import { assertOrigin, corsHeaders, json } from '../_shared/http.ts';
import { requireUser, serviceClient } from '../_shared/supabase.ts';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  try {
    assertOrigin(request);
    const user = await requireUser(request);
    const database = serviceClient();

    if (request.method === 'GET') {
      const [profile, settings, lessons, exercises, notes, bookmarks] = await Promise.all([
        database.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        database.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
        database.from('lesson_progress').select('*').eq('user_id', user.id),
        database.from('exercise_progress').select('*').eq('user_id', user.id),
        database.from('exercise_notes').select('*').eq('user_id', user.id),
        database.from('bookmarks').select('*').eq('user_id', user.id)
      ]);
      return json(request, {
        exportedAt: new Date().toISOString(),
        profile: profile.data,
        settings: settings.data,
        lessonProgress: lessons.data ?? [],
        exerciseProgress: exercises.data ?? [],
        exerciseNotes: notes.data ?? [],
        bookmarks: bookmarks.data ?? []
      });
    }

    if (request.method === 'DELETE') {
      const { data: objects } = await database.storage.from('user-data').list(user.id);
      if (objects?.length) {
        await database.storage
          .from('user-data')
          .remove(objects.map((object) => `${user.id}/${object.name}`));
      }
      const { error } = await database.auth.admin.deleteUser(user.id);
      if (error) throw error;
      return json(request, { deleted: true });
    }

    return json(request, { error: 'method_not_allowed' }, 405);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'internal_error';
    if (message === 'origin_not_allowed') return json(request, { error: message }, 403);
    if (message === 'unauthorized') return json(request, { error: message }, 401);
    console.error(JSON.stringify({ event: 'account_data_error', message }));
    return json(request, { error: 'internal_error' }, 500);
  }
});
