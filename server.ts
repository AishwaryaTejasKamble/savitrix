import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

interface StoredUser {
  userId: string;
  fullName: string;
  email: string;
  schoolOrSubject?: string;
  passwordHash: string;
  createdAt: string;
}

function hashPassword(password: string, existingSalt?: string): string {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
}

function ensureUsersFile(): StoredUser[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const defaultAdmin: StoredUser = {
    userId: 'Admin',
    fullName: 'Administrator',
    email: 'admin@school.edu',
    schoolOrSubject: 'Administration',
    passwordHash: hashPassword('Admin@123'),
    createdAt: new Date().toISOString(),
  };

  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers: StoredUser[] = [defaultAdmin];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8');
    return defaultUsers;
  }
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw) as StoredUser[];
    if (!users.some((u) => u.userId.toLowerCase() === 'admin')) {
      users.push(defaultAdmin);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    }
    return users;
  } catch {
    return [defaultAdmin];
  }
}

function saveUsers(users: StoredUser[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

const sessions = new Map<string, { userId: string; expiresAt: number }>();

function createSession(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  ensureUsersFile();

  // Sign Up
  app.post('/api/auth/signup', (req, res) => {
    const { userId, fullName, email, schoolOrSubject, password } = req.body ?? {};
    const cleanUserId = String(userId ?? '').trim();
    const cleanName = String(fullName ?? '').trim();
    const cleanEmail = String(email ?? '').trim().toLowerCase();
    const cleanPassword = String(password ?? '');

    if (!cleanUserId || cleanUserId.length < 3) {
      res.status(400).json({ error: 'User ID must be at least 3 characters long.' });
      return;
    }
    if (!cleanName) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (cleanPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const users = ensureUsersFile();
    if (users.some((u) => u.userId.toLowerCase() === cleanUserId.toLowerCase())) {
      res.status(409).json({ error: 'This User ID is already taken. Please choose another.' });
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const newUser: StoredUser = {
      userId: cleanUserId,
      fullName: cleanName,
      email: cleanEmail,
      schoolOrSubject: String(schoolOrSubject ?? '').trim(),
      passwordHash: hashPassword(cleanPassword),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = createSession(newUser.userId);
    res.status(201).json({
      token,
      user: {
        userId: newUser.userId,
        fullName: newUser.fullName,
        email: newUser.email,
        schoolOrSubject: newUser.schoolOrSubject,
      },
    });
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { userId, password } = req.body ?? {};
    const cleanUserId = String(userId ?? '').trim();
    const cleanPassword = String(password ?? '');

    if (!cleanUserId || !cleanPassword) {
      res.status(400).json({ error: 'Please enter both your User ID and Password.' });
      return;
    }

    const users = ensureUsersFile();
    const user = users.find((u) => u.userId.toLowerCase() === cleanUserId.toLowerCase());

    if (!user || !verifyPassword(cleanPassword, user.passwordHash)) {
      res.status(401).json({ error: 'Invalid User ID or Password. Please try again.' });
      return;
    }

    const token = createSession(user.userId);
    res.json({
      token,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        schoolOrSubject: user.schoolOrSubject,
      },
    });
  });

  // Forgot User ID
  app.post('/api/auth/forgot-userid', (req, res) => {
    const { email } = req.body ?? {};
    const cleanEmail = String(email ?? '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      res.status(400).json({ error: 'Please enter the email address linked to your account.' });
      return;
    }

    const users = ensureUsersFile();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      res.status(404).json({ error: 'No teacher account was found with that email address.' });
      return;
    }

    res.json({
      userId: user.userId,
      fullName: user.fullName,
      message: `Your User ID is "${user.userId}".`,
    });
  });

  // Forgot Password (verify User ID + Email and set new password)
  app.post('/api/auth/forgot-password', (req, res) => {
    const { userId, email, newPassword } = req.body ?? {};
    const cleanUserId = String(userId ?? '').trim();
    const cleanEmail = String(email ?? '').trim().toLowerCase();
    const cleanNewPassword = String(newPassword ?? '');

    if (!cleanUserId || !cleanEmail) {
      res.status(400).json({ error: 'Please enter both your User ID and registered email address.' });
      return;
    }
    if (cleanNewPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    const users = ensureUsersFile();
    const idx = users.findIndex(
      (u) =>
        u.userId.toLowerCase() === cleanUserId.toLowerCase() &&
        u.email.toLowerCase() === cleanEmail
    );

    if (idx === -1) {
      res.status(404).json({ error: 'No matching account found for that User ID and email.' });
      return;
    }

    users[idx].passwordHash = hashPassword(cleanNewPassword);
    saveUsers(users);

    res.json({
      message: 'Your password has been reset successfully. You can now log in with your new password.',
    });
  });

  // Session Check
  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const session = sessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
      sessions.delete(token);
      res.status(401).json({ error: 'Session expired' });
      return;
    }

    const users = ensureUsersFile();
    const user = users.find((u) => u.userId === session.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        schoolOrSubject: user.schoolOrSubject,
      },
    });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (token) {
      sessions.delete(token);
    }
    res.json({ ok: true });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
