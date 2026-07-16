import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function authMode() {
  return import.meta.env.PUBLIC_AUTH_MODE ?? 'mock';
}

export function getSupabaseClient() {
  if (client) return client;
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error('尚未設定 Supabase 公開連線資訊。請使用 mock 模式或設定 .env。');
  }
  client = createClient(url, publishableKey, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'ac-handbook-auth'
    }
  });
  return client;
}

export interface MockUser {
  id: string;
  email: string;
  displayName: string;
}

const mockSessionKey = 'ac-mock-session';

export function readMockUser(): MockUser | null {
  if (typeof localStorage === 'undefined') return null;
  const value = localStorage.getItem(mockSessionKey);
  return value ? (JSON.parse(value) as MockUser) : null;
}

export function writeMockUser(user: MockUser | null) {
  if (user) localStorage.setItem(mockSessionKey, JSON.stringify(user));
  else localStorage.removeItem(mockSessionKey);
  localStorage.setItem(
    'ac-auth-event',
    JSON.stringify({ at: Date.now(), signedIn: Boolean(user) })
  );
  window.dispatchEvent(new CustomEvent('ac:auth-change', { detail: user }));
}
