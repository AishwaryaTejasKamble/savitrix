/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { PromptLibrary } from './components/PromptLibrary';
import { TeacherUser } from './data/types';
import { clearSession, restoreSession, TOKEN_KEY } from './utils/authClient';

export default function App() {
  const [user, setUser] = useState<TeacherUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    restoreSession()
      .then((restored) => {
        if (restored) {
          setUser(restored);
        }
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  const handleAuthSuccess = (loggedInUser: TeacherUser, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading educator workspace...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <PromptLibrary user={user} onLogout={handleLogout} />;
}
