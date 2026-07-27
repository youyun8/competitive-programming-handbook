import { curriculum, sectionSlug, type CurriculumSection, type Volume } from './curriculum';
import { stripBase, withBase } from './site';
import { strategyTopics } from './strategy-topics';

/**
 * 站台導覽的單一真實來源。header、側欄、首頁與麵包屑都從這裡取用，
 * 才不會出現同一個目的地在不同地方叫不同名字、或某個頁面根本沒有入口。
 */
export interface NavLink {
  label: string;
  href: string;
  /** 側欄與首頁用的一句話說明。 */
  description?: string;
  /** exact：只有同一頁才算目前位置；section：底下的子路由也算。 */
  match?: 'exact' | 'section';
  children?: NavLink[];
}

export interface NavGroup {
  /** 側欄的分組標題。 */
  label: string;
  items: NavLink[];
}

export const overviewLink: NavLink = {
  label: '總覽',
  href: withBase('/'),
  description: '整站地圖與推薦起點',
  match: 'exact'
};

export const learnLink: NavLink = {
  label: '學習路線',
  href: withBase('/learn/'),
  description: '依先備關係排序的十二篇核心教學'
};

export const strategyAtlasLink: NavLink = {
  label: '策略圖鑑',
  href: withBase('/strategies/'),
  description: '依解題手法分類，適合賽前複習與查手法',
  match: 'section',
  children: strategyTopics.map((topic) => ({
    label: topic.name,
    href: withBase(`/strategies/${topic.id}/`),
    description: topic.tagline,
    match: 'section'
  }))
};

export const patternsLink: NavLink = {
  label: '跨章解題模式',
  href: withBase('/patterns/'),
  description: '反覆出現的思考模式與對應教學'
};

export const practiceLink: NavLink = {
  label: '題庫',
  href: withBase('/practice/'),
  description: '本站題目卡：狀態、解答與思路筆記',
  match: 'section'
};

export const problemListsLink: NavLink = {
  label: '題單索引',
  href: withBase('/problem-lists/'),
  description: '外部題單的章節與策略兩種索引',
  match: 'exact',
  children: [
    {
      label: '教材題單',
      href: withBase('/problem-lists/textbook/'),
      description: '《演算法競賽》配套題單，依章節小節編排'
    },
    {
      label: '策略題單',
      href: withBase('/problem-lists/strategies/'),
      description: '策略圖鑑四個主題的題目總表'
    }
  ]
};

export const glossaryLink: NavLink = {
  label: '術語表',
  href: withBase('/glossary/'),
  description: '簡體、繁體與英文術語對照'
};

export const appendixLink: NavLink = {
  label: '附錄 A：C++ 競賽工程技巧',
  href: withBase('/appendix/'),
  description: '大數、測資生成、對拍與高效 I/O'
};

export const dashboardLink: NavLink = {
  label: '學習儀表板',
  href: withBase('/dashboard/'),
  description: '完成率、待複習與筆記統計'
};

export const profileLink: NavLink = {
  label: '偏好與資料',
  href: withBase('/profile/'),
  description: '個人資料、閱讀偏好與資料權利'
};

export const loginLink: NavLink = {
  label: '登入',
  href: withBase('/auth/login/'),
  match: 'section'
};

/** 桌機 header 只放三個最常用的入口，其餘靠側欄。 */
export const headerLinks: NavLink[] = [learnLink, strategyAtlasLink, practiceLink];

/**
 * 側欄由上而下的分組。`textbook` 這一組的內容來自 toc.json，
 * 由 SiteNav 依目前位置展開對應的冊與章。
 */
export type NavSection = (NavGroup & { kind: 'links' }) | { kind: 'textbook'; label: string };

export const siteNav: NavSection[] = [
  { kind: 'links', label: '開始', items: [overviewLink, learnLink] },
  { kind: 'textbook', label: '教材章節' },
  { kind: 'links', label: '解題策略', items: [strategyAtlasLink, patternsLink] },
  { kind: 'links', label: '練習', items: [practiceLink, problemListsLink] },
  { kind: 'links', label: '參考', items: [glossaryLink] },
  { kind: 'links', label: '帳戶', items: [dashboardLink, profileLink] }
];

export interface TextbookSectionNav {
  id: string;
  title: string;
  href: string;
}

export interface TextbookChapterNav {
  chapter: number;
  title: string;
  href: string;
  sections: TextbookSectionNav[];
}

export interface TextbookVolumeNav {
  volume: Volume;
  label: string;
  href: string;
  chapters: TextbookChapterNav[];
  /** 附錄 A 掛在下冊末尾，與書本編排一致。 */
  appendix?: NavLink;
}

function volumeLabel(volume: Volume) {
  return volume === 'upper' ? '上冊' : '下冊';
}

export function sectionHref(section: CurriculumSection) {
  return withBase(`/lessons/${sectionSlug(section)}/`);
}

export const textbookNav: TextbookVolumeNav[] = (['upper', 'lower'] as const).map((volume) => ({
  volume,
  label: volumeLabel(volume),
  href: withBase(`/volumes/${volume}/`),
  chapters: curriculum.chapters
    .filter((chapter) => chapter.volume === volume)
    .map((chapter) => ({
      chapter: chapter.chapter,
      title: chapter.title,
      href: withBase(`/chapters/${chapter.chapter}/`),
      sections: chapter.sections.map((section) => ({
        id: section.id,
        title: section.title,
        href: sectionHref(section)
      }))
    })),
  ...(volume === curriculum.appendix.volume ? { appendix: appendixLink } : {})
}));

/** 目前頁面落在教材結構的哪個位置；側欄用它決定展開哪一冊、哪一章。 */
export interface TextbookContext {
  volume?: Volume;
  chapter?: number;
  sectionId?: string;
}

const sectionBySlug = new Map<string, { chapter: number; volume: Volume; sectionId: string }>();
for (const chapter of curriculum.chapters) {
  for (const section of chapter.sections) {
    sectionBySlug.set(sectionSlug(section), {
      chapter: chapter.chapter,
      volume: chapter.volume,
      sectionId: section.id
    });
  }
}

const chapterByNumber = new Map(curriculum.chapters.map((chapter) => [chapter.chapter, chapter]));

/**
 * 從路徑推導教材位置。`/lessons/topic/<id>/` 這種一節多篇的深度教學看不出小節，
 * 由頁面透過 override 補上。
 */
export function textbookContext(pathname: string, override: TextbookContext = {}): TextbookContext {
  const path = stripBase(pathname);
  const fromPath = ((): TextbookContext => {
    const volumeMatch = /^\/volumes\/(upper|lower)\/$/.exec(path);
    if (volumeMatch) return { volume: volumeMatch[1] as Volume };

    const chapterMatch = /^\/chapters\/(\d+)\/$/.exec(path);
    if (chapterMatch) {
      const chapter = chapterByNumber.get(Number(chapterMatch[1]));
      return chapter ? { volume: chapter.volume, chapter: chapter.chapter } : {};
    }

    const lessonMatch = /^\/lessons\/([^/]+)\/$/.exec(path);
    if (lessonMatch) {
      const located = sectionBySlug.get(lessonMatch[1]!);
      return located ? { volume: located.volume, chapter: located.chapter, sectionId: located.sectionId } : {};
    }

    if (path === '/appendix/') return { volume: curriculum.appendix.volume };
    return {};
  })();

  // 只有真的有值的 override 才蓋掉路徑推導的結果，避免 undefined 把它清空。
  const merged: TextbookContext = { ...fromPath };
  if (override.volume) merged.volume = override.volume;
  if (override.chapter !== undefined) merged.chapter = override.chapter;
  if (override.sectionId) merged.sectionId = override.sectionId;
  if (!merged.volume && merged.chapter !== undefined) {
    merged.volume = chapterByNumber.get(merged.chapter)?.volume;
  }
  return merged;
}

/** 沒有教材脈絡時預設展開上冊，側欄才不會看起來空無一物。 */
export function isVolumeOpen(context: TextbookContext, volume: Volume) {
  return context.volume ? context.volume === volume : volume === 'upper';
}

export function isCurrent(link: NavLink, pathname: string) {
  const path = stripBase(pathname);
  const target = stripBase(link.href);
  if (link.match === 'section') return path === target || path.startsWith(target);
  return path === target;
}

/** 供麵包屑使用：路徑上的祖先節點。 */
export interface Crumb {
  label: string;
  href?: string;
}
