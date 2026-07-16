import { authMode, getSupabaseClient, readMockUser } from '@/lib/auth/client';
import { pendingEvents, removeEvent } from './store';

export async function flushSyncQueue() {
  if (!navigator.onLine) return { status: 'offline' as const, processed: 0 };
  const events = await pendingEvents();
  if (!events.length) return { status: 'synced' as const, processed: 0 };
  window.dispatchEvent(new CustomEvent('ac:sync-state', { detail: 'syncing' }));

  if (authMode() === 'mock') {
    if (!readMockUser()) return { status: 'local-only' as const, processed: 0 };
    for (const event of events) await removeEvent(event.id);
    window.dispatchEvent(new CustomEvent('ac:sync-state', { detail: 'synced' }));
    return { status: 'synced' as const, processed: events.length };
  }

  const client = getSupabaseClient();
  const {
    data: { session }
  } = await client.auth.getSession();
  if (!session) return { status: 'local-only' as const, processed: 0 };

  const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/sync-progress`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${session.access_token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ events })
  });
  if (!response.ok) {
    window.dispatchEvent(new CustomEvent('ac:sync-state', { detail: 'error' }));
    return { status: 'error' as const, processed: 0 };
  }
  const result = (await response.json()) as { acceptedIds: string[] };
  for (const id of result.acceptedIds) await removeEvent(id);
  window.dispatchEvent(new CustomEvent('ac:sync-state', { detail: 'synced' }));
  return { status: 'synced' as const, processed: result.acceptedIds.length };
}
