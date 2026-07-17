import { useEffect, useState, type SyntheticEvent } from 'react';
import { authMode, getSupabaseClient, writeMockUser } from '@/lib/auth/client';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

interface Props {
  mode: Mode;
  basePath: string;
}

const labels: Record<Mode, { title: string; submit: string }> = {
  login: { title: '登入', submit: '登入' },
  register: { title: '建立帳戶', submit: '註冊並寄出驗證信' },
  forgot: { title: '忘記密碼', submit: '寄出重設連結' },
  reset: { title: '設定新密碼', submit: '更新密碼' }
};

export default function AuthForm({ mode, basePath }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const needsPassword = mode !== 'forgot';

  useEffect(() => {
    if (mode !== 'reset' || authMode() === 'mock') return;
    const client = getSupabaseClient();
    client.auth.getSession().then(({ data }) => {
      if (!data.session) setError('重設連結已失效，請重新申請。');
    });
  }, [mode]);

  async function submit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (needsPassword && password.length < 8) {
      setError('密碼至少需要 8 個字元。');
      return;
    }
    if ((mode === 'register' || mode === 'reset') && password !== confirmPassword) {
      setError('兩次輸入的密碼不同。');
      return;
    }
    setBusy(true);
    try {
      if (authMode() === 'mock') {
        if (mode === 'forgot') {
          setMessage('Mock 模式已模擬寄出重設信。');
        } else if (mode === 'reset') {
          setMessage('Mock 模式已更新密碼。');
        } else {
          writeMockUser({ id: 'mock-user', email, displayName: email.split('@')[0] || '學習者' });
          location.href = sessionStorage.getItem('ac-auth-return') || `${basePath}/dashboard/`;
        }
        return;
      }

      const client = getSupabaseClient();
      const callback = new URL(`${basePath}/auth/callback/`, location.origin);
      callback.searchParams.set('next', sessionStorage.getItem('ac-auth-return') || `${basePath}/dashboard/`);
      if (mode === 'login') {
        const { error: authError } = await client.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        location.href = callback.searchParams.get('next') ?? `${basePath}/dashboard/`;
      } else if (mode === 'register') {
        const { error: authError } = await client.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callback.toString() }
        });
        if (authError) throw authError;
        setMessage('驗證信已寄出。完成驗證後會回到網站。');
      } else if (mode === 'forgot') {
        callback.searchParams.set('mode', 'reset');
        const { error: authError } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: callback.toString()
        });
        if (authError) throw authError;
        setMessage('若帳戶存在，重設連結已寄出。');
      } else {
        const { error: authError } = await client.auth.updateUser({ password });
        if (authError) throw authError;
        setMessage('密碼已更新。');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '操作失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  async function githubLogin() {
    setError('');
    if (authMode() === 'mock') {
      writeMockUser({
        id: 'mock-github-user',
        email: 'github@example.test',
        displayName: 'GitHub 學習者'
      });
      location.href = sessionStorage.getItem('ac-auth-return') || `${basePath}/dashboard/`;
      return;
    }
    const callback = new URL(`${basePath}/auth/callback/`, location.origin);
    callback.searchParams.set('next', sessionStorage.getItem('ac-auth-return') || `${basePath}/dashboard/`);
    const { error: authError } = await getSupabaseClient().auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: callback.toString() }
    });
    if (authError) setError(authError.message);
  }

  return (
    <section className="card auth-card" aria-labelledby="auth-title">
      <h1 id="auth-title">{labels[mode].title}</h1>
      <p className="lede">公開教材不需登入。登入後才會同步跨裝置進度、題目狀態、書籤與閱讀偏好。</p>
      <form onSubmit={submit} noValidate>
        {mode !== 'reset' && (
          <div className="field">
            <label htmlFor="email">電子郵件</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
        )}
        {needsPassword && (
          <div className="field">
            <label htmlFor="password">{mode === 'reset' ? '新密碼' : '密碼'}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={8}
              required
            />
          </div>
        )}
        {(mode === 'register' || mode === 'reset') && (
          <div className="field">
            <label htmlFor="confirm-password">再次輸入密碼</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
        )}
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="callout">
            {message}
          </p>
        )}
        <button className="button" type="submit" disabled={busy}>
          {busy ? '處理中…' : labels[mode].submit}
        </button>
        {(mode === 'login' || mode === 'register') && (
          <button className="button secondary" type="button" onClick={githubLogin}>
            使用 GitHub 繼續
          </button>
        )}
      </form>
    </section>
  );
}
