import { describe, expect, it } from 'vitest';
import { curriculum } from '@/lib/curriculum';
import { threeStageHints } from '@/lib/exercise-content';
import { canonicalProblemSection, problemChapters, problemKey, problemListCounts } from '@/lib/problem-list';

describe('《演算法競賽》題單章節映射', () => {
  it('uses curriculum terminology for every displayed chapter and section', () => {
    for (const problemChapter of problemChapters) {
      const curriculumChapter = curriculum.chapters.find((chapter) => chapter.chapter === problemChapter.chapter);
      expect(problemChapter.chapter_title).toBe(curriculumChapter?.title);
      for (const problemSection of problemChapter.sections) {
        expect(problemSection.section_title).toBe(
          curriculumChapter?.sections.find((section) => section.id === problemSection.section)?.title
        );
      }
    }
  });

  it('keeps all source rows while mapping geometry subdivisions to section 8.1', () => {
    const rowCount = problemChapters.flatMap((chapter) =>
      chapter.sections.flatMap((section) => section.entries)
    ).length;
    expect(rowCount).toBe(problemListCounts.rows);
    expect(canonicalProblemSection('8.0')).toBe('8.1');
    expect(canonicalProblemSection('8.7')).toBe('8.1');
  });

  it('normalizes external problem identities', () => {
    expect(problemKey('洛谷', 'P1886')).toBe('luogu:p1886');
    expect(problemKey('OpenJudge 百練', '1234')).toBe('openjudge:1234');
    expect(problemKey('OpenJ_Bailian', '1234')).toBe('openjudge:1234');
    expect(problemKey('POJ / OpenJudge', '1234')).toBe('openjudge:1234');
  });
});

describe('exercise learning content', () => {
  it('always presents exactly three progressive hint stages', () => {
    expect(threeStageHints(['辨識', '模型', '邊界'])).toEqual(['辨識', '模型', '邊界']);
    expect(threeStageHints(['辨識', '模型'])).toHaveLength(3);
    expect(threeStageHints(['一', '二', '三', '四', '五'])).toEqual(['一', '二\n\n三\n\n四', '五']);
  });
});
