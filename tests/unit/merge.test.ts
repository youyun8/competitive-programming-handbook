import { describe, expect, it } from 'vitest';
import { mergeGuestAndCloud } from '@/lib/sync/merge';

describe('guest/cloud merge', () => {
  it('keeps completion, maximum progress, bookmark union, and newest settings', () => {
    const merged = mergeGuestAndCloud(
      {
        settings: {
          theme: 'dark',
          fontSize: 18,
          contentWidth: 50,
          codeFontSize: 15,
          updatedAt: '2026-07-16T10:00:00Z'
        },
        lessons: [
          {
            lessonId: 'binary-search',
            status: 'completed',
            percent: 100,
            updatedAt: '2026-07-16T09:00:00Z'
          }
        ],
        exercises: [
          {
            exerciseId: 'first-not-less',
            status: 'needs-review',
            reviewNote: '重新檢查邊界',
            updatedAt: '2026-07-16T09:00:00Z'
          }
        ],
        notes: [
          {
            exerciseId: 'first-not-less',
            solution: 'old solution',
            thought: 'local thought',
            language: 'cpp17',
            updatedAt: '2026-07-16T09:30:00Z'
          }
        ],
        bookmarks: [
          { itemType: 'lesson', itemId: 'binary-search', createdAt: '2026-07-16T08:00:00Z' }
        ]
      },
      {
        settings: {
          theme: 'light',
          fontSize: 16,
          contentWidth: 44,
          codeFontSize: 13,
          updatedAt: '2026-07-16T11:00:00Z'
        },
        lessons: [
          {
            lessonId: 'binary-search',
            status: 'in-progress',
            percent: 80,
            updatedAt: '2026-07-16T11:00:00Z'
          }
        ],
        exercises: [
          {
            exerciseId: 'first-not-less',
            status: 'solved',
            lastPracticedAt: '2026-07-16T10:00:00Z',
            updatedAt: '2026-07-16T10:00:00Z'
          }
        ],
        notes: [
          {
            exerciseId: 'first-not-less',
            solution: 'new solution',
            thought: 'cloud thought',
            language: 'cpp20',
            updatedAt: '2026-07-16T10:30:00Z'
          }
        ],
        bookmarks: [
          { itemType: 'exercise', itemId: 'first-not-less', createdAt: '2026-07-16T10:00:00Z' }
        ]
      }
    );
    expect(merged.settings?.theme).toBe('light');
    expect(merged.lessons[0]).toMatchObject({ status: 'completed', percent: 100 });
    expect(merged.exercises[0]).toMatchObject({ status: 'solved' });
    expect(merged.notes[0]).toMatchObject({
      solution: 'new solution',
      language: 'cpp20'
    });
    expect(merged.bookmarks).toHaveLength(2);
  });
});
