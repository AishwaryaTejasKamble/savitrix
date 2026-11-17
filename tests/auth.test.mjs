import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

// Exercise the real auth adapter with a mocked provider; no live accounts are created.
const source = await readFile(new URL('../src/utils/authClient.ts', import.meta.url), 'utf8');
let id = 0;
async function adapter(auth = {}, configured = true) {
  const calls = [];
  globalThis.__savitrixTest = {
    env: configured ? { VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'public-test-key' } : {},
    createClient: (...args) => { calls.push(args); return { auth }; },
  };
  globalThis.window = { location: { origin: 'https://savitrix.example' } };
  const code = stripTypeScriptTypes(source)
    .replace(/^import .*from '@supabase\/supabase-js';$/m, 'const { createClient } = globalThis.__savitrixTest;')
    .replaceAll('import.meta.env', 'globalThis.__savitrixTest.env');
  return { api: await import('data:text/javascript;base64,' + Buffer.from(code + '\n//' + id++).toString('base64')), calls };
}

test('missing provider configuration fails closed rather than creating a local account', async () => {
  const { api, calls } = await adapter({}, false);
  await assert.rejects(api.loginTeacher('teacher@example.org', 'password123'), /not configured/);
  assert.equal(calls.length, 0);
});

test('provider login errors propagate without a browser fallback', async () => {
  const providerError = new Error('Invalid login credentials');
  const { api } = await adapter({ signInWithPassword: async () => ({ error: providerError }) });
  await assert.rejects(api.loginTeacher('teacher@example.org', 'wrong'), error => error === providerError);
});

test('unconfirmed signup stays out of the library and asks for email confirmation', async () => {
  let sent;
  const { api } = await adapter({ signUp: async value => { sent = value; return { error: null, data: { session: null } }; } });
  const message = await api.signupTeacher({ email: ' Teacher@Example.org ', password: 'password123', fullName: ' Teacher ', userId: ' teacher ', schoolOrSubject: ' Maths ' });
  assert.match(message, /confirm/);
  assert.equal(sent.email, 'teacher@example.org');
  assert.deepEqual(sent.options.data, { userId: 'teacher', fullName: 'Teacher', schoolOrSubject: 'Maths' });
  assert.equal(sent.options.emailRedirectTo, 'https://savitrix.example');
});

test('password recovery requests an email link and never sends a new password', async () => {
  let sent;
  const { api } = await adapter({ resetPasswordForEmail: async (...args) => { sent = args; return { error: null }; } });
  await api.requestPasswordReset(' Teacher@Example.org ');
  assert.deepEqual(sent, ['teacher@example.org', { redirectTo: 'https://savitrix.example/?reset-password=true' }]);
});

test('password update errors keep the recovery flow from reporting success', async () => {
  const { api } = await adapter({ updateUser: async () => ({ error: new Error('Recovery session expired') }) });
  await assert.rejects(api.updateTeacherPassword('newpassword123'), /expired/);
});

test('legacy credentials are removed without deleting unrelated browser data', async () => {
  const stored = new Map([['ai_for_teachers_local_users', 'old plaintext record'], ['ai_for_teachers_local_session', 'old session'], ['ai_for_teachers_token', 'local_fake'], ['unrelated', 'keep']]);
  globalThis.localStorage = { removeItem: key => stored.delete(key) };
  const { api } = await adapter();
  api.removeLegacyAccounts();
  assert.deepEqual([...stored], [['unrelated', 'keep']]);
});
