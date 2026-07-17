export type SyncState = 'synced' | 'syncing' | 'offline' | 'error';

export interface ReadingSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  contentWidth: number;
  codeFontSize: number;
  updatedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  percent: number;
  lastAnchor?: string;
  updatedAt: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  status: 'not-started' | 'in-progress' | 'needs-review' | 'solved';
  reviewNote?: string;
  lastPracticedAt?: string;
  updatedAt: string;
}

export interface ExerciseNote {
  exerciseId: string;
  solution: string;
  thought: string;
  language: 'cpp17' | 'cpp20';
  updatedAt: string;
}

export interface Bookmark {
  itemType: 'lesson' | 'exercise';
  itemId: string;
  createdAt: string;
}

export interface GuestSnapshot {
  settings?: ReadingSettings;
  lessons: LessonProgress[];
  exercises: ExerciseProgress[];
  notes: ExerciseNote[];
  bookmarks: Bookmark[];
}

export interface SyncEvent {
  id: string;
  idempotencyKey: string;
  entity:
    | 'settings'
    | 'lesson_progress'
    | 'exercise_progress'
    | 'exercise_note'
    | 'bookmark'
    | 'merge';
  operation: 'upsert' | 'delete' | 'merge';
  payload: unknown;
  createdAt: string;
  attempts: number;
}
