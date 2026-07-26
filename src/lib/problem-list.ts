import problemList from '../../data/vjudge-3284.json';
import { chapterByNumber, sectionById, sectionSlug } from './curriculum';

export type ProblemGroup = 'example' | 'practice';

export interface ProblemEntry {
  chapter: number;
  chapter_title: string;
  section: string;
  section_title: string;
  group: ProblemGroup;
  index: number;
  platform: string;
  platform_label: string;
  problem_id: string;
  title: string;
  solved: number | null;
  contest_source: string;
  url: string;
  source_section?: string;
  source_section_title?: string;
  lesson_href?: string;
}

export interface ProblemSection {
  section: string;
  section_title: string;
  entries: ProblemEntry[];
}

export interface ProblemChapter {
  chapter: number;
  chapter_title: string;
  sections: ProblemSection[];
}

const geometrySection = '8.1';

export function canonicalProblemSection(section: string) {
  // 原題單把第 8 章細分為 8.0–8.7，但教材目錄把這些平面幾何主題統一放在 8.1。
  return section.startsWith('8.') ? geometrySection : section;
}

export function problemKey(platform: string, problemId: string) {
  const normalizedPlatform = platform
    .normalize('NFKC')
    .toLowerCase()
    .replace(/openjudge.*百練/u, 'openjudge')
    .replace(/洛谷/u, 'luogu')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/g, '');
  return `${normalizedPlatform}:${problemId.normalize('NFKC').toLowerCase()}`;
}

const entries = (problemList.items as unknown as ProblemEntry[]).map((sourceEntry) => {
  const canonicalSectionId = canonicalProblemSection(sourceEntry.section);
  const chapter = chapterByNumber(sourceEntry.chapter);
  const section = sectionById(canonicalSectionId);
  return {
    ...sourceEntry,
    chapter_title: chapter?.title ?? sourceEntry.chapter_title,
    section: canonicalSectionId,
    section_title: section?.title ?? sourceEntry.section_title,
    source_section: sourceEntry.section,
    source_section_title: sourceEntry.section_title,
    lesson_href: section ? `/lessons/${sectionSlug(section)}/` : undefined
  };
});

export const problemListSource = problemList.source;
export const problemListCounts = problemList.counts;

export const problemListPlatforms = [...new Set(entries.map((entry) => entry.platform_label))].sort((a, b) =>
  a.localeCompare(b)
);

// 題單依原始編排排序；顯示名稱與章節歸屬則一律取自教材目錄。
export const problemChapters: ProblemChapter[] = (() => {
  const chapters = new Map<number, ProblemChapter>();
  for (const entry of entries) {
    let chapter = chapters.get(entry.chapter);
    if (!chapter) {
      chapter = { chapter: entry.chapter, chapter_title: entry.chapter_title, sections: [] };
      chapters.set(entry.chapter, chapter);
    }
    let section = chapter.sections.find((candidate) => candidate.section === entry.section);
    if (!section) {
      section = { section: entry.section, section_title: entry.section_title, entries: [] };
      chapter.sections.push(section);
    }
    section.entries.push(entry);
  }
  return [...chapters.values()].sort((a, b) => a.chapter - b.chapter);
})();

export function problemEntriesForChapter(chapter: number) {
  return entries.filter((entry) => entry.chapter === chapter);
}

export function problemEntriesForSection(section: string) {
  return entries.filter((entry) => entry.section === section);
}
