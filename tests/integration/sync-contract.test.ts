import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const syncFunction = readFileSync('supabase/functions/sync-progress/index.ts', 'utf8');

describe('sync API contract', () => {
  it('uses receipts for idempotency and reports conflicts', () => {
    expect(syncFunction).toContain('sync_receipts');
    expect(syncFunction).toContain('acceptedIds');
    expect(syncFunction).toContain('conflicts');
    expect(syncFunction).toContain("event.entity === 'exercise_note'");
    expect(syncFunction).toContain("from('exercise_notes')");
  });

  it('does not silently overwrite newer settings', () => {
    expect(syncFunction).toContain('Date.parse(String(cloud.updated_at)) > Date.parse(String(payload.updated_at))');
  });
});
