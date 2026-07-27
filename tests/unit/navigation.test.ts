import { existsSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { curriculum, sectionSlug } from '@/lib/curriculum';
import {
  headerLinks,
  isCurrent,
  isVolumeOpen,
  siteNav,
  textbookContext,
  textbookNav,
  type NavLink
} from '@/lib/navigation';
import { stripBase } from '@/lib/site';

const linkSections = siteNav.filter((section) => section.kind === 'links');
const flatLinks: NavLink[] = linkSections.flatMap((section) =>
  section.items.flatMap((item) => [item, ...(item.children ?? [])])
);
const textbookLinks: NavLink[] = textbookNav.flatMap((volume) => [
  { label: volume.label, href: volume.href },
  ...volume.chapters.map((chapter) => ({ label: chapter.title, href: chapter.href })),
  ...volume.chapters.flatMap((chapter) =>
    chapter.sections.map((section) => ({ label: section.title, href: section.href }))
  ),
  ...(volume.appendix ? [volume.appendix] : [])
]);

/** 靜態站的每個導覽目的地都要對得上一個真的會被建置出來的路由。 */
function routeExists(href: string) {
  const path = stripBase(href).replace(/^\/|\/$/g, '');
  if (!path) return existsSync('src/pages/index.astro');
  const segments = path.split('/');
  const last = segments.at(-1)!;
  const parent = segments.slice(0, -1).join('/');
  const parentDir = parent ? `src/pages/${parent}` : 'src/pages';
  if (existsSync(`${parentDir}/${last}.astro`) || existsSync(`${parentDir}/${last}/index.astro`)) return true;
  // 動態路由：/chapters/2/ 由 [chapter].astro、/lessons/xxx/ 由 [...slug].astro 產生。
  return existsSync(parentDir) && readdirSync(parentDir).some((entry) => entry.startsWith('['));
}

describe('站台導覽結構', () => {
  it('gives every group at least one destination and never repeats a href', () => {
    const hrefs = [...flatLinks, ...textbookLinks].map((link) => link.href);
    for (const section of linkSections) expect(section.items.length).toBeGreaterThan(0);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('points every navigation entry at a route that exists', () => {
    for (const link of [...flatLinks, ...textbookLinks, ...headerLinks]) {
      expect(routeExists(link.href), `${link.label} → ${link.href}`).toBe(true);
    }
  });

  it('keeps header links a subset of the sidebar so both name the same destinations', () => {
    for (const link of headerLinks) {
      const match = flatLinks.find((item) => item.href === link.href);
      expect(match?.label, link.href).toBe(link.label);
    }
  });

  it('covers the whole curriculum: ten chapters, every section, and Appendix A', () => {
    const chapters = textbookNav.flatMap((volume) => volume.chapters);
    expect(chapters.map((chapter) => chapter.chapter)).toEqual(curriculum.chapters.map((item) => item.chapter));
    const sectionCount = chapters.reduce((sum, chapter) => sum + chapter.sections.length, 0);
    expect(sectionCount).toBe(curriculum.chapters.reduce((sum, chapter) => sum + chapter.sections.length, 0));
    expect(textbookNav.find((volume) => volume.volume === 'lower')?.appendix).toBeDefined();
    expect(textbookNav.find((volume) => volume.volume === 'upper')?.appendix).toBeUndefined();
  });
});

describe('目前位置', () => {
  it('marks only the exact page by default and the whole subtree for section links', () => {
    const practice = flatLinks.find((link) => link.href.endsWith('/practice/'))!;
    expect(isCurrent(practice, '/practice/')).toBe(true);
    expect(isCurrent(practice, '/practice/first-not-less/')).toBe(true);

    const glossary = flatLinks.find((link) => link.href.endsWith('/glossary/'))!;
    expect(isCurrent(glossary, '/glossary/')).toBe(true);
    expect(isCurrent(glossary, '/practice/')).toBe(false);

    const overview = flatLinks.find((link) => stripBase(link.href) === '/')!;
    expect(isCurrent(overview, '/')).toBe(true);
    expect(isCurrent(overview, '/learn/')).toBe(false);
  });

  it('derives the textbook position from chapter, lesson, volume, and appendix routes', () => {
    expect(textbookContext('/chapters/2/')).toEqual({ volume: 'upper', chapter: 2 });
    expect(textbookContext('/lessons/binary-search/')).toEqual({ volume: 'upper', chapter: 2, sectionId: '2.3' });
    expect(textbookContext('/lessons/max-flow/')).toEqual({ volume: 'lower', chapter: 10, sectionId: '10.10' });
    expect(textbookContext('/volumes/lower/')).toEqual({ volume: 'lower' });
    expect(textbookContext('/appendix/')).toEqual({ volume: 'lower' });
    expect(textbookContext('/strategies/greedy/')).toEqual({});
  });

  it('lets a page supply the position that the URL cannot express', () => {
    // /lessons/topic/<id>/ 看不出章節，由頁面補；補進來的值不會被 undefined 洗掉。
    expect(textbookContext('/lessons/topic/sparse-table/', { chapter: 2, sectionId: '2.5' })).toEqual({
      volume: 'upper',
      chapter: 2,
      sectionId: '2.5'
    });
    expect(textbookContext('/chapters/7/', {})).toEqual({ volume: 'lower', chapter: 7 });
  });

  it('opens the volume the reader is in, and falls back to the upper volume elsewhere', () => {
    expect(isVolumeOpen(textbookContext('/chapters/8/'), 'lower')).toBe(true);
    expect(isVolumeOpen(textbookContext('/chapters/8/'), 'upper')).toBe(false);
    expect(isVolumeOpen(textbookContext('/glossary/'), 'upper')).toBe(true);
    expect(isVolumeOpen(textbookContext('/glossary/'), 'lower')).toBe(false);
  });

  it('links each section to the lesson route that renders it', () => {
    for (const chapter of curriculum.chapters) {
      const navChapter = textbookNav
        .flatMap((volume) => volume.chapters)
        .find((entry) => entry.chapter === chapter.chapter)!;
      for (const [index, section] of chapter.sections.entries()) {
        expect(stripBase(navChapter.sections[index]!.href)).toBe(`/lessons/${sectionSlug(section)}/`);
      }
    }
  });
});
