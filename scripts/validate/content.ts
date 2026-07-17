import { existsSync, readFileSync } from 'node:fs';
import fg from 'fast-glob';
import textbookCatalog from '../../data/textbook-items.json' with { type: 'json' };
import toc from '../../data/toc.json' with { type: 'json' };
import { readFrontmatter } from './frontmatter';

const errors: string[] = [];
const lessons = fg.sync('src/content/lessons/**/*.{md,mdx}').map((path) => ({
  path,
  ...readFrontmatter(path)
}));
const exercises = fg.sync('src/content/exercises/**/*.{md,mdx}').map((path) => ({
  path,
  ...readFrontmatter(path)
}));

const sectionIds = new Set(toc.chapters.flatMap((chapter) => chapter.sections.map((section) => section.id)));
for (const section of toc.appendix.sections) sectionIds.add(section.id);
for (const lesson of lessons) {
  const data = lesson.data;
  if (!sectionIds.has(data.section)) errors.push(`${lesson.path}: unknown section ${data.section}`);
  if (!Array.isArray(data.source_book_pages) || data.source_book_pages.length !== 2) {
    errors.push(`${lesson.path}: source_book_pages must be a pair`);
  }
  if (!Array.isArray(data.source_pdf_pages) || data.source_pdf_pages.length !== 2) {
    errors.push(`${lesson.path}: source_pdf_pages must be a pair`);
  }
  if (data.review_status === 'needs-review') errors.push(`${lesson.path}: needs-review content must not be public`);
  const requiredHeadings = [
    '這個技術解決什麼問題',
    '辨識題型的訊號',
    '核心想法與直覺',
    '狀態／資料結構定義',
    '不變量或正確性證明',
    '逐步演算法',
    'C++17 模板',
    '時間與空間複雜度',
    '常見錯誤與邊界條件',
    '與相似技巧的比較',
    '例題與分級練習',
    '本節重點速查'
  ];
  for (const heading of requiredHeadings) {
    if (!lesson.body.includes(`## ${heading}`)) errors.push(`${lesson.path}: missing heading "${heading}"`);
  }
}

const lessonIds = new Set(lessons.map((lesson) => lesson.data.id));
const publishedLessonSections = new Set(lessons.map((lesson) => lesson.data.section));
const sectionGuideSource = readFileSync('src/components/lessons/SectionGuide.astro', 'utf8');
const guidedSections = new Set([...sectionGuideSource.matchAll(/^ {2}'(\d+\.\d+)':/gm)].map((match) => match[1]));
for (const sectionId of sectionIds) {
  if (!publishedLessonSections.has(sectionId) && !guidedSections.has(sectionId)) {
    errors.push(`Section ${sectionId} has neither a deep lesson nor a core guide`);
  }
}

for (const exercise of exercises) {
  const data = exercise.data;
  for (const field of ['source_book_pages', 'source_pdf_pages', 'hints']) {
    if (!Array.isArray(data[field]) || data[field].length === 0) errors.push(`${exercise.path}: ${field} is required`);
  }
  if (!Array.isArray(data.samples)) {
    errors.push(`${exercise.path}: samples must be an array`);
  } else if (data.kind !== 'external-oj' && data.samples.length === 0) {
    errors.push(`${exercise.path}: samples is required`);
  }
  for (const field of [
    'external_url',
    'external_platform',
    'external_problem_id',
    'external_title',
    'external_relation'
  ]) {
    if (!data[field]) errors.push(`${exercise.path}: ${field} is required for every public card`);
  }
  if (data.review_status === 'needs-review') errors.push(`${exercise.path}: needs-review content must not be public`);
}

for (const lesson of lessons) {
  for (const exerciseId of lesson.data.related_exercises ?? []) {
    if (!exercises.some((exercise) => exercise.data.id === exerciseId)) {
      errors.push(`${lesson.path}: missing related exercise ${exerciseId}`);
    }
  }
}

if (!existsSync('reports/content-review.md')) errors.push('Missing content review report');
if (toc.chapters.length !== 10) errors.push('TOC must contain ten chapters');
const sectionCount = toc.chapters.reduce((sum, chapter) => sum + chapter.sections.length, 0);
if (sectionCount < 90) errors.push(`Expected complete section structure, found ${sectionCount}`);
if (lessonIds.size < 12) errors.push('At least 12 complete core lessons are required');

if (textbookCatalog.counts.examples < 90) {
  errors.push(`Expected all labeled textbook examples, found ${textbookCatalog.counts.examples}`);
}
if (textbookCatalog.counts.exercises < 300) {
  errors.push(`Expected full textbook exercise inventory, found ${textbookCatalog.counts.exercises}`);
}
const textbookItemIds = new Set<string>();
for (const item of textbookCatalog.items) {
  if (textbookItemIds.has(item.id)) errors.push(`Duplicate textbook item id: ${item.id}`);
  textbookItemIds.add(item.id);
  const chapter = toc.chapters.find((entry) => entry.chapter === item.chapter);
  if (!chapter) {
    errors.push(`Textbook item ${item.id}: unknown chapter ${item.chapter}`);
    continue;
  }
  if (item.volume !== chapter.volume) {
    errors.push(`Textbook item ${item.id}: volume does not match chapter ${item.chapter}`);
  }
  if (!item.source_book_pages.length || !item.source_pdf_pages.length) {
    errors.push(`Textbook item ${item.id}: missing source pages`);
  }
}
for (const chapter of toc.chapters) {
  const chapterItems = textbookCatalog.items.filter((item) => item.chapter === chapter.chapter);
  if (!chapterItems.some((item) => item.kind === 'example')) {
    errors.push(`Chapter ${chapter.chapter}: missing textbook examples`);
  }
  if (!chapterItems.some((item) => item.kind === 'exercise')) {
    errors.push(`Chapter ${chapter.chapter}: missing textbook exercises`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Content validation passed: ${toc.chapters.length} chapters, ${sectionCount} covered sections, ${lessons.length} deep lessons, ${guidedSections.size} core guides, ${exercises.length} interactive exercises, ${textbookCatalog.counts.examples} textbook examples, ${textbookCatalog.counts.exercises} textbook exercises.`
);
