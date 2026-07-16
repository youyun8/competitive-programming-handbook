import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  Bookmark,
  ExerciseNote,
  ExerciseProgress,
  GuestSnapshot,
  LessonProgress,
  ReadingSettings,
  SyncEvent
} from './types';

interface HandbookDatabase extends DBSchema {
  settings: { key: string; value: ReadingSettings };
  lessons: { key: string; value: LessonProgress };
  exercises: { key: string; value: ExerciseProgress };
  notes: { key: string; value: ExerciseNote };
  bookmarks: { key: [string, string]; value: Bookmark };
  queue: { key: string; value: SyncEvent; indexes: { 'by-created-at': string } };
  drafts: { key: string; value: { exerciseId: string; sourceCode: string; updatedAt: string } };
}

let databasePromise: Promise<IDBPDatabase<HandbookDatabase>> | null = null;

export function getDatabase() {
  if (!databasePromise) {
    databasePromise = openDB<HandbookDatabase>('competitive-programming-handbook', 2, {
      upgrade(database, oldVersion) {
        if (oldVersion < 1) {
          database.createObjectStore('settings');
          database.createObjectStore('lessons', { keyPath: 'lessonId' });
          database.createObjectStore('exercises', { keyPath: 'exerciseId' });
          database.createObjectStore('bookmarks', { keyPath: ['itemType', 'itemId'] });
          const queue = database.createObjectStore('queue', { keyPath: 'id' });
          queue.createIndex('by-created-at', 'createdAt');
          database.createObjectStore('drafts', { keyPath: 'exerciseId' });
        }
        if (oldVersion < 2) {
          database.createObjectStore('notes', { keyPath: 'exerciseId' });
        }
      }
    });
  }
  return databasePromise;
}

export async function readGuestSnapshot(): Promise<GuestSnapshot> {
  const database = await getDatabase();
  return {
    settings: await database.get('settings', 'reading'),
    lessons: await database.getAll('lessons'),
    exercises: await database.getAll('exercises'),
    notes: await database.getAll('notes'),
    bookmarks: await database.getAll('bookmarks')
  };
}

export async function saveLessonProgress(progress: LessonProgress) {
  const database = await getDatabase();
  await database.put('lessons', progress);
  await enqueue('lesson_progress', 'upsert', progress);
}

export async function saveExerciseProgress(progress: ExerciseProgress) {
  const database = await getDatabase();
  await database.put('exercises', progress);
  await enqueue('exercise_progress', 'upsert', progress);
}

export async function readExerciseProgress(exerciseId: string) {
  return (await getDatabase()).get('exercises', exerciseId);
}

export async function readExerciseNote(exerciseId: string) {
  return (await getDatabase()).get('notes', exerciseId);
}

export async function saveExerciseNote(note: ExerciseNote) {
  const database = await getDatabase();
  await database.put('notes', note);
  await enqueue('exercise_note', 'upsert', note);
  const progress = await database.get('exercises', note.exerciseId);
  if (!progress || progress.status === 'not-started') {
    localStorage.setItem(`ac-exercise:${note.exerciseId}`, 'needs-review');
    await saveExerciseProgress({
      exerciseId: note.exerciseId,
      status: 'needs-review',
      lastPracticedAt: note.updatedAt,
      updatedAt: note.updatedAt
    });
    window.dispatchEvent(
      new CustomEvent('ac:exercise-status-change', {
        detail: { exerciseId: note.exerciseId, status: 'needs-review' }
      })
    );
  }
}

export async function clearExerciseNote(exerciseId: string) {
  await (await getDatabase()).delete('notes', exerciseId);
  await enqueue('exercise_note', 'delete', { exerciseId });
}

export async function saveReadingSettings(settings: ReadingSettings) {
  const database = await getDatabase();
  await database.put('settings', settings, 'reading');
  await enqueue('settings', 'upsert', settings);
}

export async function toggleBookmark(itemType: Bookmark['itemType'], itemId: string) {
  const database = await getDatabase();
  const key: [string, string] = [itemType, itemId];
  const existing = await database.get('bookmarks', key);
  if (existing) {
    await database.delete('bookmarks', key);
    await enqueue('bookmark', 'delete', { itemType, itemId });
    return false;
  }
  const bookmark = { itemType, itemId, createdAt: new Date().toISOString() } satisfies Bookmark;
  await database.put('bookmarks', bookmark);
  await enqueue('bookmark', 'upsert', bookmark);
  return true;
}

export async function enqueue(
  entity: SyncEvent['entity'],
  operation: SyncEvent['operation'],
  payload: unknown,
  idempotencyKey: string = crypto.randomUUID()
) {
  const database = await getDatabase();
  const event: SyncEvent = {
    id: crypto.randomUUID(),
    idempotencyKey,
    entity,
    operation,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0
  };
  await database.put('queue', event);
  window.dispatchEvent(new CustomEvent('ac:queue-change'));
  return event;
}

export async function pendingEvents() {
  return (await getDatabase()).getAllFromIndex('queue', 'by-created-at');
}

export async function removeEvent(id: string) {
  await (await getDatabase()).delete('queue', id);
}

export async function saveDraft(exerciseId: string, sourceCode: string) {
  await (
    await getDatabase()
  ).put('drafts', {
    exerciseId,
    sourceCode,
    updatedAt: new Date().toISOString()
  });
}

export async function readDraft(exerciseId: string) {
  return (await getDatabase()).get('drafts', exerciseId);
}
