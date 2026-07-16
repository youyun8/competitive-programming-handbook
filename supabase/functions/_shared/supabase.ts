import { createClient } from 'npm:@supabase/supabase-js@2.110.6';

export function userClient(request: Request) {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: request.headers.get('authorization') ?? '' } }
  });
}

export function serviceClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function requireUser(request: Request) {
  const { data, error } = await userClient(request).auth.getUser();
  if (error || !data.user) throw new Error('unauthorized');
  return data.user;
}
