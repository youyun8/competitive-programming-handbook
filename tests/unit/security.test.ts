import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync('supabase/migrations/202607160001_initial.sql', 'utf8');
const accountData = readFileSync('supabase/functions/account-data/index.ts', 'utf8');

describe('database security contract', () => {
  it('enables RLS on every browser-visible private table', () => {
    for (const table of [
      'profiles',
      'user_settings',
      'lesson_progress',
      'exercise_progress',
      'exercise_notes',
      'bookmarks',
      'sync_receipts'
    ]) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it('lets each user manage only their own exercise status', () => {
    expect(migration).toContain('exercise_progress_select_own');
    expect(migration).toContain('exercise_progress_insert_own');
    expect(migration).toContain('exercise_progress_update_own');
    expect(migration).toContain('exercise_progress_delete_own');
    expect(migration).toContain('exercise_notes_select_own');
    expect(migration).toContain('exercise_notes_update_own');
  });

  it('contains no submission or judge execution tables', () => {
    expect(migration).not.toContain('public.submissions');
    expect(migration).not.toContain('judge_jobs');
    expect(migration).not.toContain('source_code');
  });

  it('deletes the auth user through the protected account function', () => {
    expect(accountData).toContain('requireUser(request)');
    expect(accountData).toContain('deleteUser(user.id)');
  });
});
