import { assertOrigin, corsHeaders, json } from '../_shared/http.ts';
import { requireUser, serviceClient } from '../_shared/supabase.ts';

type SyncEvent = {
  id: string;
  idempotencyKey: string;
  entity: string;
  operation: string;
  payload: Record<string, unknown>;
};

function snakeCasePayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
      value
    ])
  );
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  try {
    assertOrigin(request);
    if (request.method !== 'POST') return json(request, { error: 'method_not_allowed' }, 405);
    const user = await requireUser(request);
    const database = serviceClient();
    const { events } = (await request.json()) as { events: SyncEvent[] };
    if (!Array.isArray(events) || events.length > 100)
      return json(request, { error: 'invalid_events' }, 400);
    const acceptedIds: string[] = [];
    const conflicts: string[] = [];

    for (const event of events) {
      if (!event.idempotencyKey || !event.id) continue;
      const { data: receipt } = await database
        .from('sync_receipts')
        .select('idempotency_key')
        .eq('user_id', user.id)
        .eq('idempotency_key', event.idempotencyKey)
        .maybeSingle();
      if (receipt) {
        acceptedIds.push(event.id);
        continue;
      }

      const payload = snakeCasePayload(event.payload ?? {});
      if (event.entity === 'lesson_progress' && event.operation === 'upsert') {
        const lessonId = String(payload.lesson_id ?? '');
        const { data: cloud } = await database
          .from('lesson_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle();
        if (
          cloud &&
          Date.parse(String(cloud.updated_at)) > Date.parse(String(payload.updated_at))
        ) {
          if (cloud.status !== 'completed' && Number(cloud.percent) < Number(payload.percent)) {
            conflicts.push(event.id);
            continue;
          }
        }
        await database.from('lesson_progress').upsert({
          user_id: user.id,
          lesson_id: lessonId,
          status:
            cloud?.status === 'completed' || payload.status === 'completed'
              ? 'completed'
              : payload.status,
          percent: Math.max(Number(cloud?.percent ?? 0), Number(payload.percent ?? 0)),
          last_anchor: payload.last_anchor,
          last_read_at: payload.updated_at,
          completed_at:
            cloud?.completed_at ?? (payload.status === 'completed' ? payload.updated_at : null)
        });
      } else if (event.entity === 'exercise_progress' && event.operation === 'upsert') {
        const exerciseId = String(payload.exercise_id ?? '');
        const { data: cloud } = await database
          .from('exercise_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('exercise_id', exerciseId)
          .maybeSingle();
        if (
          cloud &&
          Date.parse(String(cloud.updated_at)) > Date.parse(String(payload.updated_at))
        ) {
          conflicts.push(event.id);
          continue;
        }
        await database.from('exercise_progress').upsert({
          user_id: user.id,
          exercise_id: exerciseId,
          status: payload.status,
          review_note: payload.review_note,
          last_practiced_at: payload.last_practiced_at,
          completed_at: payload.status === 'solved' ? payload.updated_at : null
        });
      } else if (event.entity === 'exercise_note') {
        const exerciseId = String(payload.exercise_id ?? '');
        if (event.operation === 'delete') {
          await database
            .from('exercise_notes')
            .delete()
            .eq('user_id', user.id)
            .eq('exercise_id', exerciseId);
        } else {
          const solution = String(payload.solution ?? '').slice(0, 65536);
          const thought = String(payload.thought ?? '').slice(0, 32768);
          const { data: cloud } = await database
            .from('exercise_notes')
            .select('updated_at')
            .eq('user_id', user.id)
            .eq('exercise_id', exerciseId)
            .maybeSingle();
          if (
            cloud &&
            Date.parse(String(cloud.updated_at)) > Date.parse(String(payload.updated_at))
          ) {
            conflicts.push(event.id);
            continue;
          }
          if (!solution.trim() && !thought.trim()) {
            await database
              .from('exercise_notes')
              .delete()
              .eq('user_id', user.id)
              .eq('exercise_id', exerciseId);
          } else {
            await database.from('exercise_notes').upsert({
              user_id: user.id,
              exercise_id: exerciseId,
              solution,
              thought,
              language: payload.language === 'cpp20' ? 'cpp20' : 'cpp17',
              updated_at: payload.updated_at
            });
          }
        }
      } else if (event.entity === 'settings' && event.operation === 'upsert') {
        const { data: cloud } = await database
          .from('user_settings')
          .select('updated_at')
          .eq('user_id', user.id)
          .single();
        if (
          cloud &&
          Date.parse(String(cloud.updated_at)) > Date.parse(String(payload.updated_at))
        ) {
          conflicts.push(event.id);
          continue;
        }
        await database.from('user_settings').upsert({ user_id: user.id, ...payload });
      } else if (event.entity === 'bookmark') {
        const itemType = String(payload.item_type ?? '');
        const itemId = String(payload.item_id ?? '');
        if (event.operation === 'delete') {
          await database
            .from('bookmarks')
            .delete()
            .eq('user_id', user.id)
            .eq('item_type', itemType)
            .eq('item_id', itemId);
        } else {
          await database
            .from('bookmarks')
            .upsert({ user_id: user.id, item_type: itemType, item_id: itemId });
        }
      } else if (event.entity === 'merge') {
        // Merge is idempotent. Solved status wins during the first guest/cloud merge.
        const snapshot = event.payload as any;
        for (const progress of snapshot.lessons ?? []) {
          await database.from('lesson_progress').upsert({
            user_id: user.id,
            lesson_id: progress.lessonId,
            status: progress.status,
            percent: progress.percent,
            last_anchor: progress.lastAnchor,
            last_read_at: progress.updatedAt,
            completed_at: progress.status === 'completed' ? progress.updatedAt : null
          });
        }
        for (const bookmark of snapshot.bookmarks ?? []) {
          await database.from('bookmarks').upsert({
            user_id: user.id,
            item_type: bookmark.itemType,
            item_id: bookmark.itemId,
            created_at: bookmark.createdAt
          });
        }
        for (const progress of snapshot.exercises ?? []) {
          const { data: cloud } = await database
            .from('exercise_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('exercise_id', progress.exerciseId)
            .maybeSingle();
          await database.from('exercise_progress').upsert({
            user_id: user.id,
            exercise_id: progress.exerciseId,
            status:
              cloud?.status === 'solved' || progress.status === 'solved'
                ? 'solved'
                : progress.status,
            review_note: progress.reviewNote ?? cloud?.review_note,
            last_practiced_at: progress.lastPracticedAt ?? cloud?.last_practiced_at,
            completed_at:
              cloud?.completed_at ?? (progress.status === 'solved' ? progress.updatedAt : null)
          });
        }
        for (const note of snapshot.notes ?? []) {
          const { data: cloud } = await database
            .from('exercise_notes')
            .select('updated_at')
            .eq('user_id', user.id)
            .eq('exercise_id', note.exerciseId)
            .maybeSingle();
          if (cloud && Date.parse(String(cloud.updated_at)) > Date.parse(String(note.updatedAt))) {
            continue;
          }
          if (note.solution?.trim() || note.thought?.trim()) {
            await database.from('exercise_notes').upsert({
              user_id: user.id,
              exercise_id: note.exerciseId,
              solution: String(note.solution ?? '').slice(0, 65536),
              thought: String(note.thought ?? '').slice(0, 32768),
              language: note.language === 'cpp20' ? 'cpp20' : 'cpp17',
              updated_at: note.updatedAt
            });
          }
        }
      } else {
        continue;
      }

      await database.from('sync_receipts').insert({
        user_id: user.id,
        idempotency_key: event.idempotencyKey,
        result: { accepted: true }
      });
      acceptedIds.push(event.id);
    }
    return json(request, { acceptedIds, conflicts });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'internal_error';
    if (message === 'origin_not_allowed') return json(request, { error: message }, 403);
    if (message === 'unauthorized') return json(request, { error: message }, 401);
    console.error(JSON.stringify({ event: 'sync_error', message }));
    return json(request, { error: 'internal_error' }, 500);
  }
});
