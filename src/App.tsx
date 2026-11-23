import {CustomisationProvider} from './utils/CustomisationContext';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(window.location.pathname === '/admin');
  useEffect(() => {
    setIsAdmin(false);
    if (!user || recovering) return;
    let active = true;
    let timer: ReturnType<typeof setInterval> | undefined;
    const db = getAuthClient();
    void db.auth.getUser().then(async ({data, error}) => {
      if (error || !data.user || !active) return;
      const id = data.user.id;
      const admin = await db.from('savitrix_admins').select('user_id').eq('user_id', id).maybeSingle();
      if (active) setIsAdmin(Boolean(!admin.error && admin.data));
      const record = () => {
        if (!active || document.visibilityState !== 'visible') return;
        void db.from('savitrix_activity').upsert({user_id:id}, {onConflict:'user_id'}).then(() => {});
      };
      record();
      if (active) timer = setInterval(record, 5 * 60 * 1000);
    }).catch(() => {});
    return () => { active = false; if (timer) clearInterval(timer); };
  }, [user?.email, recovering]);

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
      : <CustomisationProvider key={user.email}>{showAdmin
        ? isAdmin ? <AdminDashboard onBack={() => {setShowAdmin(false); window.history.replaceState({}, '', '/');}} />
          : <main className="p-8"><h1 className="text-2xl font-bold">Admin access required</h1><p className="my-4">This dashboard is restricted to the Savitrix owner.</p><button onClick={() => {setShowAdmin(false); window.history.replaceState({}, '', '/');}}>Back to library</button></main>
        : <>
          <div className="bg-indigo-950 px-4 py-2 text-xs text-indigo-100">Signed-in visits and prompt actions are recorded to improve Savitrix; customisation values are saved privately to your profile and are not included in usage analytics.</div><PromptLibrary key={user.email} user={user} onLogout={handleLogout} onOpenAdmin={isAdmin ? () => {setShowAdmin(true);window.history.replaceState({}, '', '/admin');window.scrollTo({top:0});} : undefined} /></>}</CustomisationProvider>}

  </>;
}

