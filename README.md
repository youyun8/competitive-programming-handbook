# 競賽演算法筆記

以繁體中文重新整理上下冊十章與附錄的 Astro 靜態學習網站。公開內容採原創學習筆記模式，不部署掃描頁、OCR 原文、出版社版面或 QR 圖片。

> 目前 repo 尚未設定 GitHub remote 或 Supabase project，因此沒有公開 URL。所有前端、migration、Edge Functions 與測試都可先在本機驗證。

## 預覽

網站提供桌面固定側欄、手機抽屜、深淺色、中文搜尋、教學進度、題庫篩選、原題連結、解題狀態、解答／思路筆記、十二個演算法視覺化與 Supabase Auth。

![網站總覽預覽](docs/site-preview.svg)

## 系統架構

```mermaid
flowchart LR
  Browser[Astro static frontend<br/>GitHub Pages] -->|publishable key + user JWT| Auth[Supabase Auth]
  Browser -->|progress / notes / bookmarks / settings| Edge[Supabase Edge Functions]
  Edge --> DB[(PostgreSQL + RLS)]
  Browser -. offline .-> IndexedDB[(IndexedDB cache + sync queue)]
```

- GitHub Pages 只承載 `astro build` 的靜態檔案。
- Supabase Auth 處理電子郵件密碼、驗證信、重設密碼與 GitHub OAuth；本站不自行雜湊密碼。
- PostgreSQL 儲存每位使用者自己的進度、題目狀態、解答、思路、設定與書籤，所有資料表均啟用 RLS。
- 題目卡只記錄自我評估狀態與私人筆記；網站不編譯或執行使用者程式。

## 快速開始

需求：Node 24 LTS、pnpm 11、C++17 編譯器。PDF/OCR 流程另需 Python 3、PyMuPDF、Tesseract `chi_sim+eng` 與 Poppler。

```bash
pnpm install
cp .env.example .env
pnpm dev
```

預設 `.env.example` 使用 `PUBLIC_AUTH_MODE=mock`，可在沒有正式 Supabase 憑證時測試登入、進度、筆記、離線 queue 與 UI。

常用檢查：

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:content
pnpm validate:cpp
pnpm validate:secrets
pnpm build
pnpm test:e2e
```

## 內容結構

- `data/toc.json`：十章、各節與附錄 A 的公開課程結構。
- `data/page-map.json`：上下冊獨立頁碼映射與抽查狀態。
- `data/extraction-manifest.json`：736 頁的 checksum、OCR 狀態、信心與例題／URL 候選 metadata。
- `data/exercise-candidates.json`：只含頁碼與標籤 metadata 的候選題清單；未包含 OCR 題目文字。
- `src/content/lessons/`：原創教學；每篇固定包含問題、訊號、直覺、狀態、不變量、步驟、C++、複雜度、陷阱、比較、練習與速查。
- `src/content/exercises/`：改寫或自行設計的題目、提示、解答、證明、C++ 與已確認的外部原題連結。
- `reports/content-review.md`：所有待人工確認項目。未確認 OCR 不會渲染到公開頁面。

目前擷取統計（2026-07-16）：736/736 頁已完成 OCR 與本機 QR 掃描，偵測到 103
個例題標籤候選，正規化為 252 筆待人工確認的題目／外部 OJ 頁面候選；尚未人工確認的 736
頁都維持待校對狀態。公開站目前有 102 個課程節點、12 篇完整核心教學、3
道具備外部原題連結、進度與私人筆記的題目卡，以及 3 組術語條目。

新增 lesson 時，必須填寫 `volume`、`source_file`、章節、書頁、PDF 頁、先備、學習目標與 `review_status`。完整 schema 位於 `src/content.config.ts`。

## PDF 與 OCR 校對

兩份來源檔應放在：

```text
source/900782057-算法竞赛-上册-罗勇军-郭卫斌.pdf
source/算法竞赛（清华科技大讲堂）.pdf
```

`source/`、`tmp/ocr/`、rendered pages 與原始 OCR 都已加入 `.gitignore`。

```bash
python3 scripts/pdf/extract.py
python3 scripts/pdf/extract.py --scan --workers 8 --dpi 140
python3 scripts/pdf/extract.py --qr-scan --workers 8 --dpi 180
pnpm content:stats
```

擷取器可續跑，會驗證頁數與 SHA-256。OCR 只建立候選例題、URL 與版面特徵；公式、程式碼、題目框、外部連結與 QR 解碼結果仍須逐項人工比對。公開前將 `manual_review` 更新為 verified，並用自己的語言重新撰寫。

## 本機 Supabase

安裝 Docker 與 Supabase CLI 後：

```bash
supabase start
supabase db reset
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f tests/rls/rls.sql
supabase functions serve --env-file supabase/.env.local
```

RLS 測試建立 user A 與 user B，證明 user A 看不到或改不到 user B 的 profile、進度、題目狀態與私人解題筆記。Service-role key 不得放進 `PUBLIC_*`、前端 bundle、log 或 artifact。

## 同步模型

訪客資料存入 IndexedDB 的分表與事件 queue；登入後由 `sync-progress` 做 idempotent merge：

- 完成狀態優先。
- 進度取較高者。
- 題目狀態與解答／思路筆記以 `updated_at` 做衝突檢查。
- 書籤取聯集。
- 設定比較 `updated_at`，遇到雲端較新資料回報 conflict，不靜默覆寫。
- 重複 idempotency key 由 `sync_receipts` 去重。

離線事件在恢復網路後可重送。Dashboard 統計只讀取該使用者自己的資料。

## 題目卡與解題筆記

每張公開題目卡都必須有經確認的原題或相關原題連結，並提供：

- 未開始、練習中、待複習、已解決四種自我管理狀態。
- 「解答（程式碼）」與「思路（Markdown）」兩個筆記面板。
- Markdown 編輯／預覽、C++17／C++20 標籤、分欄清空、全部清空與更新時間。
- IndexedDB 本機保存；登入後由 Supabase 同步。
- 尚未設定狀態但開始寫筆記時，自動標記為待複習。

## 環境變數

前端可公開：

- `PUBLIC_SITE_URL`
- `PUBLIC_BASE_PATH`
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `PUBLIC_API_URL`
- `PUBLIC_AUTH_MODE`

只可放在 GitHub Environment 或後端 secret store：

- `SUPABASE_SERVICE_ROLE_KEY`
- OAuth client secret
- database password／URL

## GitHub Pages 與後端部署

`astro.config.ts` 會在 Actions 依 `GITHUB_REPOSITORY` 設定專案型 Pages `base`。`.github/workflows/deploy.yml` 使用 Astro 官方 action 建置並交給 GitHub Pages deploy action。

完整逐步部署指南請見 [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)。

正式部署前需要使用者確認：

1. GitHub owner、repo 名稱與 private visibility。
2. Supabase project、region、GitHub OAuth callback domain。
3. Pages URL 與可選 custom domain，供 `ALLOWED_ORIGINS` 精確列入 CORS。

Supabase migration／Functions 需獨立部署，不能由 GitHub Pages 代替。Fork PR 不取得正式 secrets；後端部署應使用 protected environment 與人工核准。

## 備份與復原

- PostgreSQL 使用 Supabase 排程備份或 `pg_dump` 的加密私有備份；dump 不進 Git。
- 復原時先套 migration，再還原使用者進度、題目狀態、私人筆記、書籤與設定。
- 使用者刪除流程利用 FK cascade 清除個人資料與儲存物件。

## 著作權界線

本專案是依使用者合法持有資料製作的非官方學習筆記，不暗示作者或出版社背書。禁止 commit／部署 PDF、掃描頁、逐頁 OCR、出版社插圖、QR 圖片、長篇逐字內容或大量原書程式碼。外部 OJ 題只保留改寫敘述與必要 attribution，確認 URL 後才發布。
