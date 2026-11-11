/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { PromptLibrary } from './components/PromptLibrary';
import { TeacherUser } from './data/types';

const TOKEN_KEY = 'ai_for_teachers_token';

export default function App() {
  const [user, setUser] = useState<TeacherUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setCheckingSession(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
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
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
      localStorage.removeItem(TOKEN_KEY);
    }
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
