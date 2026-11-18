/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { PromptLibrary } from './components/PromptLibrary';
import type { TeacherUser } from './data/types';
import { authConfigured, clearSession, getAuthClient, removeLegacyAccounts, toTeacherUser } from './utils/authClient';

export default function App() {
  const [user, setUser] = useState<TeacherUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [recovering, setRecovering] = useState(
    () => new URLSearchParams(window.location.search).get('reset-password') === 'true'
      || new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'
  );
  const [error, setError] = useState('');

  useEffect(() => {
    removeLegacyAccounts();
    if (!authConfigured) { setCheckingSession(false); return; }
    let active = true;
    const auth = getAuthClient().auth;
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      setUser(session?.user ? toTeacherUser(session.user) : null);
    });
    auth.getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) setError(sessionError.message);
        setUser(data.session?.user ? toTeacherUser(data.session.user) : null);
      })
      .catch(() => { if (active) setError('Unable to restore your session. Please sign in again.'); })
      .finally(() => { if (active) setCheckingSession(false); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    setError('');
    try { await clearSession(); setUser(null); }
    catch { setError('Could not sign out. Check your connection and try again.'); }
  };

  if (checkingSession) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p role="status" className="text-sm text-slate-500">Loading educator workspace...</p></div>;
  }

  return <>
    {error && <div role="alert" className="bg-red-50 p-4 text-red-800">{error}</div>}
    {(!user || recovering)
      ? <AuthPage recovering={recovering} hasSession={Boolean(user)} onRecoveryComplete={() => {
          setRecovering(false);
          window.history.replaceState({}, '', window.location.pathname);
        }} />
      : <PromptLibrary user={user} onLogout={handleLogout} />}
  </>;
}
