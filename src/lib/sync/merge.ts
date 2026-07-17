import type { Bookmark, ExerciseNote, ExerciseProgress, GuestSnapshot, LessonProgress, ReadingSettings } from './types';

function newest<T extends { updatedAt: string }>(left?: T, right?: T) {
  if (!left) return right;
  if (!right) return left;
  return Date.parse(left.updatedAt) >= Date.parse(right.updatedAt) ? left : right;
}

function mergeLessons(local: LessonProgress[], cloud: LessonProgress[]) {
  const merged = new Map<string, LessonProgress>();
  for (const item of [...cloud, ...local]) {
    const current = merged.get(item.lessonId);
    if (!current) {
      merged.set(item.lessonId, item);
      continue;
    }
    const completed = current.status === 'completed' || item.status === 'completed';
    merged.set(item.lessonId, {
      ...(newest(current, item) ?? item),
      status: completed ? 'completed' : item.percent >= current.percent ? item.status : current.status,
      percent: Math.max(current.percent, item.percent),
      updatedAt: newest(current, item)?.updatedAt ?? item.updatedAt
    });
  }
  return [...merged.values()];
}

function mergeExercises(local: ExerciseProgress[], cloud: ExerciseProgress[]) {
  const merged = new Map<string, ExerciseProgress>();
  const statusRank: Record<ExerciseProgress['status'], number> = {
    'not-started': 0,
    'in-progress': 1,
    'needs-review': 2,
    solved: 3
  };
  for (const item of [...cloud, ...local]) {
    const current = merged.get(item.exerciseId);
    if (!current) {
      merged.set(item.exerciseId, item);
      continue;
    }
    const latest = newest(current, item) ?? item;
    merged.set(item.exerciseId, {
      ...latest,
      status: statusRank[current.status] >= statusRank[item.status] ? current.status : item.status,
      reviewNote: latest.reviewNote,
      lastPracticedAt: newest(
        current.lastPracticedAt ? { value: current.lastPracticedAt, updatedAt: current.lastPracticedAt } : undefined,
        item.lastPracticedAt ? { value: item.lastPracticedAt, updatedAt: item.lastPracticedAt } : undefined
      )?.value
    });
  }
  return [...merged.values()];
}

function mergeBookmarks(local: Bookmark[], cloud: Bookmark[]) {
  const merged = new Map<string, Bookmark>();
  for (const item of [...cloud, ...local]) {
    const key = `${item.itemType}:${item.itemId}`;
    const current = merged.get(key);
    if (!current || Date.parse(item.createdAt) < Date.parse(current.createdAt)) merged.set(key, item);
  }
  return [...merged.values()];
}

function mergeNotes(local: ExerciseNote[], cloud: ExerciseNote[]) {
  const merged = new Map<string, ExerciseNote>();
  for (const note of [...cloud, ...local]) {
    const current = merged.get(note.exerciseId);
    merged.set(note.exerciseId, newest(current, note) ?? note);
  }
  return [...merged.values()];
}

export function mergeGuestAndCloud(local: GuestSnapshot, cloud: GuestSnapshot): GuestSnapshot {
  const mergedSettings = newest<ReadingSettings>(local.settings, cloud.settings);
  return {
    settings: mergedSettings
      ? {
          ...mergedSettings,
          wrapLines: mergedSettings.wrapLines ?? true
        }
      : undefined,
    lessons: mergeLessons(local.lessons, cloud.lessons),
    exercises: mergeExercises(local.exercises, cloud.exercises),
    notes: mergeNotes(local.notes, cloud.notes),
    bookmarks: mergeBookmarks(local.bookmarks, cloud.bookmarks)
  };
}
