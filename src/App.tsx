/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
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
      : showAdmin
        ? isAdmin ? <AdminDashboard onBack={() => {setShowAdmin(false); window.history.replaceState({}, '', '/');}} />
          : <main className="p-8"><h1 className="text-2xl font-bold">Admin access required</h1><p className="my-4">This dashboard is restricted to the Savitrix owner.</p><button onClick={() => {setShowAdmin(false); window.history.replaceState({}, '', '/');}}>Back to library</button></main>
        : <>{isAdmin && <nav aria-label="Admin tools" className="sticky top-0 z-40 border-b border-indigo-200 bg-white shadow-md">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <ShieldCheck aria-hidden="true" className="h-10 w-10 rounded-xl bg-indigo-100 p-2 text-indigo-700" />
                <div><p className="text-base font-bold text-slate-900">Admin workspace</p><p className="text-sm text-slate-600">View teacher accounts and recent activity</p></div>
              </div>
              <button type="button" className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-indigo-700 px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700 sm:w-auto" onClick={() => {setShowAdmin(true);window.history.replaceState({}, '', '/admin');window.scrollTo({top:0});}}>
                <ShieldCheck aria-hidden="true" className="h-5 w-5" />Admin dashboard<ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </nav>}
          <div className="bg-indigo-950 px-4 py-2 text-xs text-indigo-100">Signed-in activity is recorded to help the owner understand app usage.</div><PromptLibrary user={user} onLogout={handleLogout} /></>}

  </>;
}
