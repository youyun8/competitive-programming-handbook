import { readFileSync, writeFileSync } from 'node:fs';
import fg from 'fast-glob';
import toc from '../../data/toc.json' with { type: 'json' };

type Volume = 'upper' | 'lower';

interface CatalogItem {
  id: string;
  kind: 'example' | 'exercise';
  label: string;
  chapter: number;
  chapter_title: string;
  volume: Volume;
  source_file: string;
  source_book_pages: number[];
  source_pdf_pages: number[];
  platform?: string;
  problem_id?: string;
  learning_focus: string[];
  summary: string;
  review_status: 'verified-metadata';
}

const chapterForPage = (volume: Volume, pdfPage: number) =>
  toc.chapters.find(
    (chapter) => chapter.volume === volume && pdfPage >= chapter.pdf_pages[0]! && pdfPage <= chapter.pdf_pages[1]!
  );

const bookPage = (volume: Volume, pdfPage: number) => (volume === 'upper' ? pdfPage - 18 : pdfPage + 370);

const normalizeLabel = (label: string) =>
  label
    .replace(/\s+/g, '')
    .replace('例', '例 ')
    .replace(/(\d+)\.(\d+)/, '$1.$2');

const chapterSummary: Record<number, string> = {
  1: '以容器操作、元素順序與結構不變量為核心，練習選擇合適的基礎資料結構。',
  2: '運用單調性、預處理、分治或指標移動，減少重複計算並控制複雜度。',
  3: '把問題建成狀態圖，設計展開順序、判重方式與安全剪枝。',
  4: '維護可合併摘要，處理大量動態更新、區間查詢或樹上操作。',
  5: '明確定義狀態、轉移與計算順序，再依結構減少狀態或轉移成本。',
  6: '把整數、同餘、線性轉移或算術函數轉成可驗證的數學演算法。',
  7: '先定義計數物件與等價關係，再使用組合公式、容斥、生成函數或博弈分析。',
  8: '把幾何關係轉成向量與代數判斷，並處理退化情況、溢位與浮點誤差。',
  9: '重用前綴、後綴、回文或子字串等價資訊，避免重複比較字元。',
  10: '先定義圖的方向、權重與容量，再選擇遍歷、連通、路徑、生成樹或網路流方法。'
};

const exampleCandidates = JSON.parse(readFileSync('data/exercise-candidates.json', 'utf8')).candidates as Array<{
  candidate_kind: string;
  original_label?: string;
  volume: Volume;
  source_pdf_pages: number[];
  source_book_pages: number[];
}>;

const exampleMap = new Map<string, CatalogItem>();
for (const candidate of exampleCandidates) {
  if (candidate.candidate_kind !== 'labeled-example' || !candidate.original_label) continue;
  const label = normalizeLabel(candidate.original_label);
  const match = label.match(/^例 (\d+)\.(\d+)$/);
  if (!match) continue;
  const chapterNumber = Number(match[1]);
  if (chapterNumber < 1 || chapterNumber > 10) continue;
  const chapter = toc.chapters.find((entry) => entry.chapter === chapterNumber)!;
  const pageChapter = chapterForPage(candidate.volume, candidate.source_pdf_pages[0]!);
  if (pageChapter?.chapter !== chapterNumber) continue;
  const key = `${candidate.volume}-${label}`;
  const existing = exampleMap.get(key);
  const pdfPages = [...new Set([...(existing?.source_pdf_pages ?? []), ...candidate.source_pdf_pages])].sort(
    (left, right) => left - right
  );
  const bookPages = [...new Set([...(existing?.source_book_pages ?? []), ...candidate.source_book_pages])].sort(
    (left, right) => left - right
  );
  exampleMap.set(key, {
    id: `${candidate.volume}-example-${match[1]}-${match[2]}`,
    kind: 'example',
    label,
    chapter: chapterNumber,
    chapter_title: chapter.title,
    volume: candidate.volume,
    source_file: `${candidate.volume}-volume`,
    source_book_pages: bookPages,
    source_pdf_pages: pdfPages,
    learning_focus: chapter.sections.flatMap((section) => section.topics).slice(0, 6),
    summary: chapterSummary[chapterNumber]!,
    review_status: 'verified-metadata'
  });
}

const platformPatterns: Array<[string, RegExp]> = [
  ['洛谷', /洛\s*谷\s*(P\s*\d{4})(?!\d)/gi],
  ['HDU', /h\s*d\s*u\s*([0-9]{4})(?!\d)/gi],
  ['POJ', /p\s*o\s*j\s*([0-9]{4})(?!\d)/gi],
  ['UVA', /u\s*v\s*a\s*([0-9]{3,5})(?!\d)/gi],
  ['Codeforces', /(?:codeforces|c\s*f)\s*([0-9]{2,6}[A-Z][0-9]?)/gi]
];

const exerciseMap = new Map<string, CatalogItem>();
for (const path of fg.sync('tmp/ocr/full/{upper,lower}/*.txt').sort()) {
  const volume = path.includes('/upper/') ? 'upper' : 'lower';
  const pdfPage = Number(path.match(/(\d+)\.txt$/)?.[1]);
  const chapter = chapterForPage(volume, pdfPage);
  if (!chapter) continue;
  const text = readFileSync(path, 'utf8');
  for (const [platform, pattern] of platformPatterns) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const problemId = match[1]!.replace(/\s+/g, '').toUpperCase();
      const key = `${platform}-${problemId}`;
      const existing = exerciseMap.get(key);
      const pdfPages = [...new Set([...(existing?.source_pdf_pages ?? []), pdfPage])].sort(
        (left, right) => left - right
      );
      const bookPages = pdfPages.map((page) => bookPage(volume, page));
      exerciseMap.set(key, {
        id: `exercise-${platform.toLowerCase()}-${problemId.toLowerCase()}`,
        kind: 'exercise',
        label: `${platform} ${problemId}`,
        chapter: chapter.chapter,
        chapter_title: chapter.title,
        volume,
        source_file: `${volume}-volume`,
        source_book_pages: bookPages,
        source_pdf_pages: pdfPages,
        platform,
        problem_id: problemId,
        learning_focus: chapter.sections.flatMap((section) => section.topics).slice(0, 6),
        summary: chapterSummary[chapter.chapter]!,
        review_status: 'verified-metadata'
      });
    }
  }
}

const items = [...exampleMap.values(), ...exerciseMap.values()].sort(
  (left, right) =>
    left.chapter - right.chapter ||
    left.source_pdf_pages[0]! - right.source_pdf_pages[0]! ||
    left.label.localeCompare(right.label, 'zh-Hant')
);

writeFileSync(
  'data/textbook-items.json',
  `${JSON.stringify(
    {
      version: 1,
      generated_from: 'Full OCR page inventory with labels rewritten as a public study catalog',
      counts: {
        total: items.length,
        examples: items.filter((item) => item.kind === 'example').length,
        exercises: items.filter((item) => item.kind === 'exercise').length
      },
      items
    },
    null,
    2
  )}\n`
);

console.log(`Generated ${items.length} textbook items: ${exampleMap.size} examples, ${exerciseMap.size} exercises.`);
