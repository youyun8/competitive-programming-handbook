import { useEffect, useState } from 'react';
import { authMode, getSupabaseClient, readMockUser, writeMockUser } from '@/lib/auth/client';
import { flushSyncQueue } from '@/lib/sync/processor';

interface Account {
  id: string;
  email?: string;
}

export default function AccountPanel({ basePath }: { basePath: string }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [syncMessage, setSyncMessage] = useState('尚未同步');

  useEffect(() => {
    if (authMode() === 'mock') {
      setAccount(readMockUser());
      return;
    }
    const client = getSupabaseClient();
    client.auth
      .getUser()
      .then(({ data }) => setAccount(data.user ? { id: data.user.id, email: data.user.email } : null));
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setAccount(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function sync() {
    setSyncMessage('同步中…');
    const result = await flushSyncQueue();
    setSyncMessage(result.status === 'synced' ? `已同步 ${result.processed} 筆事件` : result.status);
  }

  async function logout() {
    if (authMode() === 'mock') writeMockUser(null);
    else await getSupabaseClient().auth.signOut();
    location.href = `${basePath}/`;
  }

  if (!account) {
    return (
      <div className="callout warning account-panel">
        <div className="account-identity">
          <h2>訪客模式</h2>
          <p className="settings-hint">進度與草稿只保存在此裝置，換裝置或清除瀏覽器資料後會遺失。</p>
        </div>
        <a className="button" href={`${basePath}/auth/login/`}>
          登入以跨裝置同步
        </a>
      </div>
    );
  }

  return (
    <section className="card account-panel">
      <div className="account-identity">
        <h2>帳戶</h2>
        <p className="account-email">{account.email ?? account.id}</p>
        <p className="settings-hint" role="status">
          {syncMessage}
        </p>
      </div>
      <div className="page-actions">
        <button className="button" type="button" onClick={sync}>
          立即同步
        </button>
        <button className="button secondary" type="button" onClick={logout}>
          登出
        </button>
      </div>
    </section>
  );
}
