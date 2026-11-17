# Savitrix — AI for Teachers

The existing classroom prompt library, with hosted teacher accounts through Supabase Auth and Vite hosting on Vercel. The prompt content, PDF assets, filters, customization, copying, and external AI launch links are retained.

## Activate accounts

1. Create or select your Supabase project. In Authentication, enable the Email provider and keep email confirmation enabled. Configure the project's minimum password length to at least 8.
2. In Authentication > URL Configuration, set Site URL to your chosen stable production Vercel address. Add that exact URL and `https://YOUR-DOMAIN/?reset-password=true` to the allowed redirect URLs. Add `http://localhost:3000` and `http://localhost:3000/?reset-password=true` only if using local development. For previews, allow only the specific preview URL you intend to test.
3. In the Supabase project's API settings, copy the project URL and **publishable key**. Do not use a secret key or service-role key.
4. In the chosen Vercel project's Settings > Environment Variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the environments you use. These are public browser configuration values. Vite embeds them during the build, so deploy a new build after changing them.
5. Merge this change only after testing the preview with those values. Use the Vite framework, `npm run build`, and `dist` output directory, as declared in `vercel.json`. Use a supported Node.js 22 runtime.
6. Create a fresh teacher account, confirm its email, sign out, and sign in with the same email/password on another browser or device. Old browser-only accounts cannot be migrated as verified users; register them again.
7. Request a password reset. Open the emailed link, choose a new password, sign out, and confirm the old password no longer works. An email address alone must never permit a password change.

Supabase's default email service has restrictive sending limits and recipient restrictions. Configure an SMTP provider in Supabase Authentication before inviting general users; check its sending limits and pricing separately. No connection to the owner's Gmail inbox is required. Do not disable email confirmation to work around delivery problems.

## Optional Google sign-in

Enable the Google provider in Supabase, configure your Google OAuth application's authorized redirect URI with the callback URL Supabase displays, and enter the Google client ID/secret in Supabase only. Then set `VITE_ENABLE_GOOGLE_AUTH=true` in Vercel and deploy a new build. Leave it false until the provider works. Google login is optional; email/password works independently.

## What this change protects

Supabase manages account verification, password hashing, session refresh, and recovery. Profile display name, full name, and subject are stored in the authenticated user's Supabase metadata and work across devices. No application database tables are required for these fields. Display names are not unique login identifiers or administrator roles; login uses email. No default administrator account is created.

The frontend shows the prompt library after sign-in. **The repository is public, and prompt text/PDFs remain static public assets. This is not a paywall or confidential-content backend.** A private paid library would need server-side content delivery and authorization. Any future private user tables must use row-level security tied to `auth.uid()` before browser access is enabled. Do not authorize access using editable profile metadata.

There is no Gemini API dependency in this version: prompt buttons open external AI tools. Each visitor uses their own account with those services. Supabase, email delivery, and hosting are separate services with their own quotas; no paid resources are provisioned by these source changes.

## Development and checks

Copy `.env.example` to `.env.local` and fill in the two public Supabase values. With dependencies already available, run `npm run dev` for local development, `npm run typecheck` for TypeScript checks, and `npm run build` for the production bundle. `npm test` runs adapter tests against a mocked authentication provider on Node.js 22.13+ and creates no live accounts.

`server.ts` and the old local authentication implementation have been removed. The deployed app no longer needs a writable JSON users file or an in-memory session server. If authentication configuration is missing, the app displays a setup message and disables login instead of creating browser-only accounts.
