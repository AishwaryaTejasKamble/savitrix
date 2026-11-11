import { TeacherUser } from '../data/types';

export const TOKEN_KEY = 'ai_for_teachers_token';
const LOCAL_USERS_KEY = 'ai_for_teachers_local_users';
const LOCAL_SESSION_KEY = 'ai_for_teachers_local_session';

interface LocalUserRecord extends TeacherUser {
  password: string;
}

const DEFAULT_ADMIN: LocalUserRecord = {
  userId: 'Admin',
  fullName: 'Administrator',
  email: 'admin@school.edu',
  schoolOrSubject: 'Administration',
  password: 'Admin@123',
};

function getLocalUsers(): LocalUserRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      const initial = [DEFAULT_ADMIN];
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as LocalUserRecord[];
    if (!parsed.some((u) => u.userId.toLowerCase() === 'admin')) {
      parsed.push(DEFAULT_ADMIN);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DEFAULT_ADMIN];
  }
}

function saveLocalUsers(users: LocalUserRecord[]): void {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage quota errors
  }
}

function toPublicUser(u: LocalUserRecord): TeacherUser {
  return {
    userId: u.userId,
    fullName: u.fullName,
    email: u.email,
    schoolOrSubject: u.schoolOrSubject,
  };
}

async function tryApiJson(
  url: string,
  options?: RequestInit
): Promise<{ available: boolean; ok: boolean; data: Record<string, unknown> }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { available: false, ok: false, data: {} };
    }
    const data = (await res.json()) as Record<string, unknown>;
    return { available: true, ok: res.ok, data };
  } catch {
    return { available: false, ok: false, data: {} };
  }
}

export async function loginTeacher(
  userId: string,
  password: string
): Promise<{ user: TeacherUser; token: string }> {
  const api = await tryApiJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password }),
  });

  if (api.available) {
    if (!api.ok) {
      throw new Error(String(api.data.error || 'Invalid User ID or Password.'));
    }
    return {
      user: api.data.user as TeacherUser,
      token: String(api.data.token),
    };
  }

  // Fallback for static hosting / preview environments without Express backend
  const cleanUserId = userId.trim();
  const users = getLocalUsers();
  const found = users.find(
    (u) => u.userId.toLowerCase() === cleanUserId.toLowerCase() && u.password === password
  );
  if (!found) {
    throw new Error('Invalid User ID or Password. Please try again.');
  }
  const token = `local_${found.userId}_${Date.now()}`;
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(toPublicUser(found)));
  return { user: toPublicUser(found), token };
}

export async function signupTeacher(payload: {
  userId: string;
  fullName: string;
  email: string;
  schoolOrSubject: string;
  password: string;
}): Promise<{ user: TeacherUser; token: string }> {
  const api = await tryApiJson('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (api.available) {
    if (!api.ok) {
      throw new Error(String(api.data.error || 'Unable to create account.'));
    }
    return {
      user: api.data.user as TeacherUser,
      token: String(api.data.token),
    };
  }

  const cleanUserId = payload.userId.trim();
  const cleanName = payload.fullName.trim();
  const cleanEmail = payload.email.trim().toLowerCase();

  if (cleanUserId.length < 3) {
    throw new Error('User ID must be at least 3 characters long.');
  }
  if (!cleanName) {
    throw new Error('Please enter your full name.');
  }
  if (!cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (payload.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const users = getLocalUsers();
  if (users.some((u) => u.userId.toLowerCase() === cleanUserId.toLowerCase())) {
    throw new Error('This User ID is already taken. Please choose another.');
  }
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: LocalUserRecord = {
    userId: cleanUserId,
    fullName: cleanName,
    email: cleanEmail,
    schoolOrSubject: payload.schoolOrSubject.trim(),
    password: payload.password,
  };
  users.push(newUser);
  saveLocalUsers(users);

  const token = `local_${newUser.userId}_${Date.now()}`;
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(toPublicUser(newUser)));
  return { user: toPublicUser(newUser), token };
}

export async function recoverUserId(
  email: string
): Promise<{ userId: string; fullName: string }> {
  const api = await tryApiJson('/api/auth/forgot-userid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (api.available) {
    if (!api.ok) {
      throw new Error(String(api.data.error || 'No teacher account found with that email.'));
    }
    return {
      userId: String(api.data.userId),
      fullName: String(api.data.fullName),
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getLocalUsers();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!found) {
    throw new Error('No teacher account was found with that email address.');
  }
  return { userId: found.userId, fullName: found.fullName };
}

export async function resetTeacherPassword(payload: {
  userId: string;
  email: string;
  newPassword: string;
}): Promise<string> {
  const api = await tryApiJson('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (api.available) {
    if (!api.ok) {
      throw new Error(String(api.data.error || 'Could not reset password.'));
    }
    return String(
      api.data.message || 'Your password has been reset successfully. You can now log in.'
    );
  }

  const cleanUserId = payload.userId.trim().toLowerCase();
  const cleanEmail = payload.email.trim().toLowerCase();
  if (payload.newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const users = getLocalUsers();
  const idx = users.findIndex(
    (u) => u.userId.toLowerCase() === cleanUserId && u.email.toLowerCase() === cleanEmail
  );
  if (idx === -1) {
    throw new Error('No matching account found for that User ID and email.');
  }
  users[idx].password = payload.newPassword;
  saveLocalUsers(users);
  return 'Your password has been reset successfully. You can now log in with your new password.';
}

export async function restoreSession(): Promise<TeacherUser | null> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  if (token.startsWith('local_')) {
    try {
      const raw = localStorage.getItem(LOCAL_SESSION_KEY);
      return raw ? (JSON.parse(raw) as TeacherUser) : null;
    } catch {
      return null;
    }
  }

  const api = await tryApiJson('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (api.available && api.ok && api.data.user) {
    return api.data.user as TeacherUser;
  }

  if (!api.available) {
    try {
      const raw = localStorage.getItem(LOCAL_SESSION_KEY);
      return raw ? (JSON.parse(raw) as TeacherUser) : null;
    } catch {
      return null;
    }
  }

  localStorage.removeItem(TOKEN_KEY);
  return null;
}

export function clearSession(): void {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !token.startsWith('local_')) {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOCAL_SESSION_KEY);
}
