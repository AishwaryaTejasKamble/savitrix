import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { TeacherUser } from '../data/types';

let client: SupabaseClient | undefined;
export const authConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
export const googleSignInEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true';

export function getAuthClient(): SupabaseClient {
  if (!authConfigured) throw new Error('Account sign-in is not configured yet. Please contact the Savitrix owner.');
  client ??= createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return client;
}

export function toTeacherUser(user: User): TeacherUser {
  return {
    userId: user.user_metadata.userId || user.email?.split('@')[0] || 'Teacher',
    fullName: user.user_metadata.fullName || user.user_metadata.full_name || 'Teacher',
    email: user.email || '',
    schoolOrSubject: user.user_metadata.schoolOrSubject || '',
  };
}

// Browser-only accounts were never verified hosted accounts. Remove their plaintext passwords.
export function removeLegacyAccounts(): void {
  for (const key of ['ai_for_teachers_local_users', 'ai_for_teachers_local_session', 'ai_for_teachers_token']) {
    localStorage.removeItem(key);
  }
}

export async function loginTeacher(email: string, password: string): Promise<void> {
  const { error } = await getAuthClient().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) throw error;
}

export async function signupTeacher(payload: {
  userId: string; fullName: string; email: string; schoolOrSubject: string; password: string;
}): Promise<string> {
  const { error, data } = await getAuthClient().auth.signUp({
    email: payload.email.trim().toLowerCase(), password: payload.password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { userId: payload.userId.trim(), fullName: payload.fullName.trim(), schoolOrSubject: payload.schoolOrSubject.trim() },
    },
  });
  if (error) throw error;
  return data.session ? 'Account created.' : 'Check your email to confirm your account, then sign in.';
}

export async function requestPasswordReset(email: string): Promise<string> {
  const { error } = await getAuthClient().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: window.location.origin + '/?reset-password=true',
  });
  if (error) throw error;
  return 'If an account exists for this email, you will receive a password reset link.';
}

export async function updateTeacherPassword(password: string): Promise<void> {
  const { error } = await getAuthClient().auth.updateUser({ password });
  if (error) throw error;
}

export async function signInWithGoogle(): Promise<void> {
  const { error } = await getAuthClient().auth.signInWithOAuth({
    provider: 'google', options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function clearSession(): Promise<void> {
  const { error } = await getAuthClient().auth.signOut({ scope: 'local' });
  if (error) throw error;
}
