#!/usr/bin/env python3
"""Resumable, private OCR inventory for the two scanned source volumes.

Raw text and rendered images are written below tmp/ and are ignored by Git.
Only checksums, page-level status, confidence, and candidate metadata are
written to data/extraction-manifest.json.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
from concurrent.futures import ProcessPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import fitz
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
from pytesseract import Output
from pyzbar.pyzbar import decode as decode_barcode

ROOT = Path(__file__).resolve().parents[2]
SOURCES = {
    "upper": ROOT / "source/900782057-算法竞赛-上册-罗勇军-郭卫斌.pdf",
    "lower": ROOT / "source/算法竞赛（清华科技大讲堂）.pdf",
}
EXPECTED = {
    "upper": {
        "pages": 406,
        "sha256": "05d471dc258775779925dc705864f20519a6966aa9b45f05620706787e5dd75d",
    },
    "lower": {
        "pages": 330,
        "sha256": "885c201be96b05a146d8dd3f493d848231b1e7fa8b2d82a13aa1aa8fbbdb04f5",
    },
}
EXAMPLE_RE = re.compile(r"(?:例|例题|練習|练习)\s*([0-9]{1,2})\s*[.．·]\s*([0-9]{1,3})")
URL_RE = re.compile(r"(?:https?://|www\.)[^\s<>{}\\[\\]\"']+", re.IGNORECASE)
OJ_RE = re.compile(
    r"(LeetCode|LintCode|洛谷|HDU|POJ|Codeforces|AtCoder|UVA|牛客|计蒜客|OJ)",
    re.IGNORECASE,
)
SAMPLE_RE = re.compile(r"(输入样例|输出样例|样例输入|样例输出|Sample\s+(?:Input|Output))", re.IGNORECASE)
CODE_RE = re.compile(r"(#include|using\s+namespace|int\s+main|std::|long\s+long)")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def tool_version(command: list[str]) -> str:
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        return (result.stdout or result.stderr).splitlines()[0]
    except Exception as error:  # pragma: no cover - diagnostic only
        return f"unavailable: {error}"


def preprocess(image: Image.Image) -> Image.Image:
    grayscale = image.convert("L")
    grayscale = ImageEnhance.Contrast(grayscale).enhance(1.45)
    return grayscale.filter(ImageFilter.SHARPEN)


def scan_page(job: tuple[str, str, int, int]) -> dict[str, Any]:
    volume, source_path, page_number, dpi = job
    document = fitz.open(source_path)
    page = document.load_page(page_number - 1)
    scale = dpi / 72
    pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), colorspace=fitz.csRGB, alpha=False)
    image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    image = preprocess(image)
    data = pytesseract.image_to_data(
        image,
        lang="chi_sim+eng",
        config="--psm 6",
        output_type=Output.DICT,
    )
    words = [word.strip() for word in data["text"] if word.strip()]
    text = " ".join(words)
    confidences = [
        float(confidence)
        for confidence, word in zip(data["conf"], data["text"])
        if word.strip() and float(confidence) >= 0
    ]
    average_confidence = round(sum(confidences) / len(confidences) / 100, 4) if confidences else 0
    labels = sorted({f"例 {chapter}.{index}" for chapter, index in EXAMPLE_RE.findall(text)})
    urls = sorted(set(URL_RE.findall(text)))
    flags = []
    if labels:
        flags.append("example-label")
    if OJ_RE.search(text):
        flags.append("external-oj")
    if SAMPLE_RE.search(text):
        flags.append("sample-io")
    if CODE_RE.search(text):
        flags.append("code")

    raw_dir = ROOT / f"tmp/ocr/full/{volume}"
    raw_dir.mkdir(parents=True, exist_ok=True)
    (raw_dir / f"{page_number:04d}.txt").write_text(text, encoding="utf-8")
    document.close()
    return {
        "page": page_number,
        "status": "ocr-complete",
        "ocr_confidence": average_confidence,
        "candidate_labels": labels,
        "candidate_urls": urls,
        "candidate_flags": flags,
        "manual_review": "required" if labels or flags or urls else "pending-page-sweep",
        "raw_ocr_path": f"tmp/ocr/full/{volume}/{page_number:04d}.txt",
    }


def scan_qr_page(job: tuple[str, str, int, int]) -> dict[str, Any]:
    volume, source_path, page_number, dpi = job
    document = fitz.open(source_path)
    page = document.load_page(page_number - 1)
    scale = dpi / 72
    pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), colorspace=fitz.csRGB, alpha=False)
    image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    candidates = []
    for barcode in decode_barcode(image):
        if barcode.type != "QRCODE":
            continue
        value = barcode.data.decode("utf-8", errors="replace").strip()
        if value:
            candidates.append(
                {
                    "type": barcode.type,
                    "value": value[:2048],
                    "publish_status": "needs-link-review",
                }
            )
    document.close()
    return {
        "volume": volume,
        "page": page_number,
        "qr_scan_status": "complete",
        "qr_candidates": candidates,
    }


def load_manifest() -> dict[str, Any]:
    path = ROOT / "data/extraction-manifest.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {"version": 1, "volumes": {}}


def write_manifest(manifest: dict[str, Any]) -> None:
    path = ROOT / "data/extraction-manifest.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_report(manifest: dict[str, Any]) -> None:
    report = ROOT / "reports/content-review.md"
    report.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# 內容校對報告",
        "",
        "> OCR 僅用來建立候選清單。以下項目未經人工比對掃描頁前，不會發布 OCR 文字、題目、公式、程式碼或 URL。",
        "",
        f"- 產生時間：{manifest['updated_at']}",
        f"- OCR 工具：{manifest['tools']['tesseract']}",
        "",
        "## 分冊統計",
        "",
        "| 分冊 | PDF 頁數 | 已 OCR | 例題標籤候選 | 外部 URL 候選 | QR 候選 | 需人工檢查頁 |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for volume in ("upper", "lower"):
        pages = manifest["volumes"][volume]["pages"]
        completed = [page for page in pages if page["status"] == "ocr-complete"]
        labels = sum(len(page.get("candidate_labels", [])) for page in pages)
        urls = sum(len(page.get("candidate_urls", [])) for page in pages)
        qr_candidates = sum(len(page.get("qr_candidates", [])) for page in pages)
        review = sum(page.get("manual_review") != "verified" for page in pages)
        lines.append(
            f"| {volume} | {len(pages)} | {len(completed)} | {labels} | {urls} | {qr_candidates} | {review} |"
        )
    lines.extend(["", "## 優先人工確認", ""])
    for volume in ("upper", "lower"):
        lines.extend([f"### {volume}", ""])
        flagged = [
            page
            for page in manifest["volumes"][volume]["pages"]
            if page.get("candidate_labels") or page.get("candidate_flags") or page.get("candidate_urls")
        ]
        if not flagged:
            lines.append("- 尚未執行逐頁 OCR。")
        for page in flagged:
            labels = "、".join(page.get("candidate_labels", [])) or "未辨識標籤"
            flags = "、".join(page.get("candidate_flags", [])) or "無"
            lines.append(
                f"- PDF 第 {page['page']} 頁：{labels}；特徵 `{flags}`；"
                f"OCR 信心 {page.get('ocr_confidence', 0):.1%}；狀態 `{page['manual_review']}`。"
            )
        lines.append("")
    lines.extend(
        [
            "## 固定待確認項目",
            "",
            "- 上冊 PDF 第 403 頁是否完整對應書本第 385 頁。",
            "- 下冊 PDF 第 323 頁是否完整對應附錄書本第 693 頁。",
            "- 所有公式、程式碼區塊、例題框、樣例與外部 URL 必須逐項人工比對。",
            "- QR code 僅可在本機解碼；確認為合法公開連結後才可加入文字連結，QR 圖片不得發布。",
            "",
        ]
    )
    report.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--scan", action="store_true", help="run OCR for pages not already complete")
    parser.add_argument(
        "--qr-scan",
        action="store_true",
        help="locally decode QR/barcodes without retaining or publishing page images",
    )
    parser.add_argument("--workers", type=int, default=min(8, os.cpu_count() or 2))
    parser.add_argument("--dpi", type=int, default=140)
    parser.add_argument("--limit", type=int, default=0, help="limit new pages per volume for diagnostics")
    args = parser.parse_args()

    manifest = load_manifest()
    manifest["updated_at"] = datetime.now(timezone.utc).isoformat()
    manifest["tools"] = {
        "pymupdf": fitz.VersionBind,
        "pytesseract": pytesseract.__version__,
        "tesseract": tool_version(["tesseract", "--version"]),
        "languages": ["chi_sim", "eng"],
        "dpi": args.dpi,
    }

    jobs: list[tuple[str, str, int, int]] = []
    qr_jobs: list[tuple[str, str, int, int]] = []
    for volume, path in SOURCES.items():
        if not path.exists():
            raise SystemExit(f"Missing source PDF: {path}")
        document = fitz.open(path)
        checksum = sha256(path)
        expected = EXPECTED[volume]
        if len(document) != expected["pages"] or checksum != expected["sha256"]:
            raise SystemExit(f"Source mismatch for {volume}: pages={len(document)} sha256={checksum}")
        current = manifest["volumes"].get(volume, {})
        previous = {page["page"]: page for page in current.get("pages", [])}
        pages = [
            previous.get(
                page_number,
                {
                    "page": page_number,
                    "status": "pending",
                    "ocr_confidence": None,
                    "candidate_labels": [],
                    "candidate_urls": [],
                    "candidate_flags": [],
                    "manual_review": "pending-page-sweep",
                },
            )
            for page_number in range(1, len(document) + 1)
        ]
        manifest["volumes"][volume] = {
            "source_file": f"{volume}-volume",
            "source_sha256": checksum,
            "page_count": len(document),
            "page_size_points": [round(document[0].rect.width, 2), round(document[0].rect.height, 2)],
            "pages": pages,
        }
        if args.scan:
            pending = [page for page in pages if page["status"] != "ocr-complete"]
            if args.limit:
                pending = pending[: args.limit]
            jobs.extend((volume, str(path), page["page"], args.dpi) for page in pending)
        if args.qr_scan:
            qr_pending = [page for page in pages if page.get("qr_scan_status") != "complete"]
            if args.limit:
                qr_pending = qr_pending[: args.limit]
            qr_jobs.extend((volume, str(path), page["page"], max(args.dpi, 180)) for page in qr_pending)
        document.close()

    write_manifest(manifest)
    if jobs:
        page_indexes = {
            volume: {page["page"]: index for index, page in enumerate(info["pages"])}
            for volume, info in manifest["volumes"].items()
        }
        with ProcessPoolExecutor(max_workers=args.workers) as executor:
            future_to_job = {executor.submit(scan_page, job): job for job in jobs}
            completed = 0
            for future in as_completed(future_to_job):
                volume, _, page_number, _ = future_to_job[future]
                try:
                    result = future.result()
                except Exception as error:
                    result = {
                        "page": page_number,
                        "status": "ocr-failed",
                        "ocr_confidence": 0,
                        "candidate_labels": [],
                        "candidate_urls": [],
                        "candidate_flags": [],
                        "manual_review": "required",
                        "error": str(error)[:500],
                    }
                index = page_indexes[volume][page_number]
                manifest["volumes"][volume]["pages"][index] = result
                completed += 1
                if completed % 20 == 0:
                    manifest["updated_at"] = datetime.now(timezone.utc).isoformat()
                    write_manifest(manifest)
                    print(f"processed {completed}/{len(jobs)} pages", flush=True)

    if qr_jobs:
        page_indexes = {
            volume: {page["page"]: index for index, page in enumerate(info["pages"])}
            for volume, info in manifest["volumes"].items()
        }
        with ProcessPoolExecutor(max_workers=args.workers) as executor:
            future_to_job = {executor.submit(scan_qr_page, job): job for job in qr_jobs}
            completed = 0
            for future in as_completed(future_to_job):
                volume, _, page_number, _ = future_to_job[future]
                try:
                    result = future.result()
                    index = page_indexes[volume][page_number]
                    manifest["volumes"][volume]["pages"][index].update(
                        {
                            "qr_scan_status": result["qr_scan_status"],
                            "qr_candidates": result["qr_candidates"],
                        }
                    )
                except Exception as error:
                    index = page_indexes[volume][page_number]
                    manifest["volumes"][volume]["pages"][index].update(
                        {
                            "qr_scan_status": "failed",
                            "qr_candidates": [],
                            "qr_error": str(error)[:500],
                        }
                    )
                completed += 1
                if completed % 40 == 0:
                    write_manifest(manifest)
                    print(f"QR scanned {completed}/{len(qr_jobs)} pages", flush=True)

    manifest["updated_at"] = datetime.now(timezone.utc).isoformat()
    write_manifest(manifest)
    write_report(manifest)


if __name__ == "__main__":
    main()
