import problemList from '../../data/vjudge-3284.json';

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

const entries = problemList.items as unknown as ProblemEntry[];

export const problemListSource = problemList.source;
export const problemListCounts = problemList.counts;

export const problemListPlatforms = [...new Set(entries.map((entry) => entry.platform_label))].sort((a, b) =>
  a.localeCompare(b)
);

// 題單本身已依章、節、例題／習題排好，因此依出現順序分組即可保持原始編排。
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
