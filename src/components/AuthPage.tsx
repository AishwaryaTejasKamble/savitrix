import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Mail, User, UserPlus } from 'lucide-react';
import { TeacherUser } from '../data/types';
import {
  loginTeacher,
  recoverUserId,
  resetTeacherPassword,
  signupTeacher,
} from '../utils/authClient';

interface AuthPageProps {
  onAuthSuccess: (user: TeacherUser, token: string) => void;
}

type AuthView = 'login' | 'signup' | 'forgot-userid' | 'forgot-password';

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [view, setView] = useState<AuthView>('login');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolOrSubject, setSchoolOrSubject] = useState('');

  // Reset password field
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const switchView = (nextView: AuthView) => {
    setView(nextView);
    setError(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const { user, token } = await loginTeacher(userId, password);
      onAuthSuccess(user, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const { user, token } = await signupTeacher({
        userId,
        fullName,
        email,
        schoolOrSubject,
        password,
      });
      onAuthSuccess(user, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotUserId = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const data = await recoverUserId(email);
      setUserId(data.userId);
      setSuccessMsg(`Account found for ${data.fullName}. Your User ID is "${data.userId}".`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not find an account with that email.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const message = await resetTeacherPassword({ userId, email, newPassword });
      setPassword('');
      setNewPassword('');
      setSuccessMsg(message);
      setView('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Editorial Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-200 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>SAVITRIX</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              AI for Teachers
            </h1>
            <p className="mt-4 text-indigo-100/90 text-base leading-relaxed">
              Sign in to access your complete library of 241 classroom-tested AI prompts from{' '}
              <span className="font-medium text-white">The Practical Prompt Playbook</span> and{' '}
              <span className="font-medium text-white">The Practical AI Workbook</span>.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">241 Ready-to-Use Classroom Prompts</p>
                  <p className="text-xs text-indigo-200/80 mt-0.5">
                    Lesson planning, quizzes, rubrics, parent communication, feedback, and classroom management.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Easy Prompt Customization</p>
                  <p className="text-xs text-indigo-200/80 mt-0.5">
                    Fill in [Grade/Class], [Topic], [Duration], and other placeholders directly on any card before copying or launching.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">One-Click Launch in ChatGPT, Claude & Gemini</p>
                  <p className="text-xs text-indigo-200/80 mt-0.5">
                    Open any prompt directly inside your preferred AI assistant with the text pre-filled.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Instant Prompt Translation</p>
                  <p className="text-xs text-indigo-200/80 mt-0.5">
                    Translate prompts into Marathi, Hindi, Spanish, French, and more while preserving placeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col justify-center">
          {/* Top Tabs for Login / Sign Up */}
          {(view === 'login' || view === 'signup') && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => switchView('login')}
                className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                  view === 'login'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchView('signup')}
                className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                  view === 'signup'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {successMsg}
            </div>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Teacher Login</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your User ID and Password to open the prompt library.
                </p>
              </div>

              <div>
                <label htmlFor="login-userid" className="block text-sm font-medium text-slate-700 mb-1.5">
                  User ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-userid"
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your User ID"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-sm py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => switchView('signup')}
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>

              {/* Forgot User ID & Forgot Password links */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => switchView('forgot-userid')}
                  className="text-indigo-700 hover:text-indigo-900 font-medium hover:underline"
                >
                  Forgot User ID?
                </button>
                <button
                  type="button"
                  onClick={() => switchView('forgot-password')}
                  className="text-indigo-700 hover:text-indigo-900 font-medium hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {/* SIGN UP VIEW */}
          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Create Teacher Account</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Register your User ID and password to save your access.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="signup-userid" className="block text-xs font-medium text-slate-700 mb-1">
                    Choose User ID *
                  </label>
                  <input
                    id="signup-userid"
                    type="text"
                    required
                    minLength={3}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. ms_sharma"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label htmlFor="signup-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address * (used for User ID / password recovery)
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.edu"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor="signup-subject" className="block text-xs font-medium text-slate-700 mb-1">
                  Subject / Grade (optional)
                </label>
                <input
                  id="signup-subject"
                  type="text"
                  value={schoolOrSubject}
                  onChange={(e) => setSchoolOrSubject(e.target.value)}
                  placeholder="e.g. Science · Class 8"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-xs font-medium text-slate-700 mb-1">
                  Password * (min. 6 characters)
                </label>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-sm py-2.5 px-5 rounded-lg transition-colors mt-2"
              >
                {loading ? 'Creating Account...' : 'Sign Up & Enter Library'}
              </button>
            </form>
          )}

          {/* FORGOT USER ID VIEW */}
          {view === 'forgot-userid' && (
            <form onSubmit={handleForgotUserId} className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Recover User ID</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter the email address you registered with to look up your User ID.
                </p>
              </div>

              <div>
                <label htmlFor="recover-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="recover-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@school.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-sm py-2.5 px-5 rounded-lg transition-colors"
              >
                {loading ? 'Searching...' : 'Find My User ID'}
              </button>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="text-indigo-700 hover:underline font-medium"
                >
                  Back to Login
                </button>
                <button
                  type="button"
                  onClick={() => switchView('forgot-password')}
                  className="text-slate-600 hover:text-slate-900 hover:underline"
                >
                  Reset Password instead
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Reset Password</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Verify your User ID and registered email to set a new password.
                </p>
              </div>

              <div>
                <label htmlFor="reset-userid" className="block text-sm font-medium text-slate-700 mb-1.5">
                  User ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-userid"
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Your User ID"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@school.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reset-new-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  New Password (min. 6 characters)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-new-password"
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-sm py-2.5 px-5 rounded-lg transition-colors"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="text-indigo-700 hover:underline font-medium"
                >
                  Back to Login
                </button>
                <button
                  type="button"
                  onClick={() => switchView('forgot-userid')}
                  className="text-slate-600 hover:text-slate-900 hover:underline"
                >
                  Forgot User ID?
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
