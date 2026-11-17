import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authConfigured, googleSignInEnabled, loginTeacher, requestPasswordReset, signupTeacher, signInWithGoogle, updateTeacherPassword } from '../utils/authClient';

interface AuthPageProps {
  recovering: boolean;
  hasSession: boolean;
  onRecoveryComplete: () => void;
}
type AuthView = 'login' | 'signup' | 'forgot-password';

export const AuthPage: React.FC<AuthPageProps> = ({ recovering, hasSession, onRecoveryComplete }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [schoolOrSubject, setSchoolOrSubject] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-900';
  const switchView = (next: AuthView) => { setView(next); setError(''); setSuccessMsg(''); setPassword(''); setConfirmPassword(''); };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); setSuccessMsg(''); setLoading(true);
    try {
      if (recovering && hasSession) {
        if (password !== confirmPassword) throw new Error('The passwords do not match.');
        await updateTeacherPassword(password);
        onRecoveryComplete();
      } else if (view === 'forgot-password' || recovering) {
        setSuccessMsg(await requestPasswordReset(email));
      } else if (view === 'signup') {
        setSuccessMsg(await signupTeacher({ userId, fullName, email, schoolOrSubject, password }));
        setPassword('');
      } else {
        await loginTeacher(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete this request. Please try again.');
    } finally { setLoading(false); }
  };

  const googleLogin = async () => {
    setLoading(true); setError('');
    try { await signInWithGoogle(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Google sign-in failed.'); }
    finally { setLoading(false); }
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
          {!recovering && view !== 'forgot-password' && <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6" aria-label="Account options">
            {(['login', 'signup'] as const).map(tab => <button key={tab} type="button" disabled={loading} onClick={() => switchView(tab)}
              className={'flex-1 py-2 px-4 text-sm font-semibold rounded-md ' + (view === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600')}>
              {tab === 'login' ? 'Login' : 'Sign Up'}
            </button>)}
          </div>}
          {!authConfigured && <p role="status" className="mb-5 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
            Savitrix account setup is in progress. Sign-up and login will be available once setup is complete.
          </p>}
          {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          {successMsg && <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{successMsg}</p>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                {recovering ? 'Reset your password' : view === 'signup' ? 'Create Teacher Account' : view === 'forgot-password' ? 'Forgot Password?' : 'Teacher Login'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {recovering && hasSession ? 'Choose a new password for your account.'
                  : recovering ? 'Your reset link has expired or is invalid. Request a new link below.'
                  : view === 'forgot-password' ? 'We will email you a secure reset link.'
                  : view === 'signup' ? 'Create your own account to sign in on any device.'
                  : 'Sign in with your registered email and password.'}
              </p>
            </div>
            {view === 'signup' && !recovering && <>
              <div><label htmlFor="signup-name" className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input id="signup-name" autoComplete="name" required maxLength={100} value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} /></div>
              <div><label htmlFor="signup-userid" className="block text-sm font-medium text-slate-700 mb-1">Display Name *</label>
                <input id="signup-userid" autoComplete="nickname" required minLength={3} maxLength={50} value={userId} onChange={e => setUserId(e.target.value)} placeholder="e.g. ms_sharma" className={inputClass} />
                <p className="text-xs text-slate-500 mt-1">Shown in the library. Use your email to log in.</p></div>
              <div><label htmlFor="signup-subject" className="block text-sm font-medium text-slate-700 mb-1">Subject / Grade (optional)</label>
                <input id="signup-subject" maxLength={100} value={schoolOrSubject} onChange={e => setSchoolOrSubject(e.target.value)} placeholder="e.g. Science · Class 8" className={inputClass} /></div>
            </>}
            {!(recovering && hasSession) && <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="teacher@school.edu" className={inputClass} />
            </div>}
            {((recovering && hasSession) || (!recovering && view !== 'forgot-password')) && <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700 mb-1">{recovering ? 'New Password' : 'Password'}</label>
              <div className="relative">
                <input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={view === 'signup' || recovering ? 'new-password' : 'current-password'}
                  required minLength={view === 'signup' || recovering ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} className={inputClass + ' pr-12'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-3 text-slate-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {(view === 'signup' || recovering) && <p className="text-xs text-slate-500 mt-1">Use at least 8 characters.</p>}
            </div>}
            {recovering && hasSession && <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />
            </div>}
            <button type="submit" disabled={loading || !authConfigured} className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-sm py-2.5 px-5 rounded-lg">
              {loading ? 'Please wait...' : recovering && hasSession ? 'Save New Password' : view === 'forgot-password' || recovering ? 'Send Reset Link' : view === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
          {!recovering && view === 'login' && <button type="button" disabled={loading} onClick={() => switchView('forgot-password')} className="mt-4 text-sm text-indigo-700 hover:underline">Forgot Password?</button>}
          {!recovering && view === 'forgot-password' && <button type="button" disabled={loading} onClick={() => switchView('login')} className="mt-4 text-sm text-indigo-700 hover:underline">Back to Login</button>}
          {recovering && <button type="button" disabled={loading} onClick={onRecoveryComplete} className="mt-4 text-sm text-indigo-700 hover:underline">Cancel</button>}
          {!recovering && view !== 'forgot-password' && googleSignInEnabled && <button type="button" disabled={loading || !authConfigured} onClick={googleLogin}
            className="mt-5 w-full border border-slate-300 rounded-lg py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Continue with Google</button>}
        </div>
      </div>
    </div>
  );
};
