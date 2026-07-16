import toc from '../../data/toc.json';

export type Volume = 'upper' | 'lower';

export interface CurriculumSection {
  id: string;
  title: string;
  topics: string[];
}

export interface CurriculumChapter {
  chapter: number;
  volume: Volume;
  title: string;
  book_pages: [number, number];
  pdf_pages: [number, number];
  color: string;
  sections: CurriculumSection[];
}

export const curriculum = toc as unknown as {
  volumes: Record<Volume, { source_file: string; display_name: string; pdf_pages: number }>;
  chapters: CurriculumChapter[];
  appendix: {
    id: string;
    volume: Volume;
    title: string;
    book_pages: [number, number];
    pdf_pages: [number, number];
    sections: CurriculumSection[];
  };
};

export function chapterByNumber(chapter: number) {
  return curriculum.chapters.find((item) => item.chapter === chapter);
}

export function sectionById(id: string) {
  return curriculum.chapters
    .flatMap((chapter) => chapter.sections)
    .find((section) => section.id === id);
}

export function sectionSlug(section: CurriculumSection) {
  const slugs: Record<string, string> = {
    '2.3': 'binary-search',
    '3.1': 'bfs-dfs',
    '4.1': 'union-find',
    '4.3': 'segment-tree',
    '4.8': 'lca',
    '5.1': 'dynamic-programming',
    '6.2': 'fast-power',
    '6.8': 'extended-gcd',
    '8.1': 'convex-hull',
    '9.5': 'kmp',
    '10.8': 'dijkstra',
    '10.10': 'max-flow'
  };
  return slugs[section.id] ?? `section-${section.id.replace('.', '-')}`;
}
