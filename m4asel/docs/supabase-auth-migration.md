# Supabase Auth migration (Google Sign-In)

The mobile app now runs entirely on **Supabase Auth** (email/password + Google
OAuth) instead of Firebase Auth. This doc covers the two things that live
outside this repo: Supabase/Google dashboard config, and the backend change
still required for real (non-mock) logins to work.

## 1. What changed in this repo

- `src/config/firebase.ts` removed; `src/config/supabase.ts` added (client
  with AsyncStorage session persistence, matching the old Firebase setup).
- `AuthContext`, `auth.service.ts`, `apiClient` all use the Supabase session
  and its `access_token` instead of a Firebase ID token.
- `authService.signInWithGoogle()` opens Google's consent screen in an in-app
  browser via `supabase.auth.signInWithOAuth` + `expo-web-browser`, and
  completes the session from the redirect URL.
- A **dev-only mock profile** (`src/services/mockProfile.ts`) fills in when
  the backend profile fetch fails, gated by `EXPO_PUBLIC_USE_MOCK_PROFILE=true`
  in `.env` (see `.env.example`) and always off in production builds. This
  exists so the Google sign-in flow can be demoed end-to-end before the
  backend migrates (step 3 below).

## 2. Supabase dashboard setup (required for Google Sign-In to work at all)

1. **Google Cloud Console** → create an OAuth 2.0 Client ID (type: Web
   application).
   - Authorized redirect URI: `https://hdzyncyutatccpyndzkl.supabase.co/auth/v1/callback`
     (fixed, from your Supabase project — Settings → API → Project URL).
2. **Supabase Dashboard → Authentication → Providers → Google**
   - Enable it, paste the Google Client ID + Client Secret from step 1.
3. **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**
   - Add `m4asel://auth-callback` (the app's deep link scheme, from
     `app.json`'s `"scheme": "m4asel"` — used in dev/production builds).
   - Add `exp://**` too, for testing in **Expo Go**: `makeRedirectUri()`
     resolves to `exp://<your-lan-ip>:8081/--/auth-callback` there instead
     (the IP/port change every session, hence the wildcard — Supabase's `*`
     doesn't cross `.`/`/`, so it has to be `**`, not `*`).
   - Without a matching entry, Supabase silently falls back to the project's
     Site URL instead of erroring — if that's still the default
     `http://localhost:3000`, the phone can't reach it and Safari shows
     "could not connect to the server", which looks like a totally unrelated
     failure.
4. **App config** (`m4asel/.env`, copy from `.env.example`):
   - `EXPO_PUBLIC_SUPABASE_URL` — Project URL (Settings → API).
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` — anon/public key (Settings → API).
   - Never put the Postgres connection string or the service-role key here —
     those are server-only secrets, not client config.

## 3. Backend (separate repo, `github.com/yousef-najeh/m4asel`) — done, not yet deployed

The FastAPI backend has been migrated to verify **Supabase-issued JWTs**
instead of Firebase ID tokens (auth only — push notifications stay on
Firebase Cloud Messaging, untouched). Summary of what changed there:

- `externals/supabase_client.py` (new) — verifies tokens via the project's
  JWKS (`PyJWT` + `PyJWKClient`), and owns account creation via the Supabase
  **Admin API** (`auth.admin.create_user(..., email_confirm=True)`), so the
  backend still creates the account server-side exactly like it did with
  Firebase — the client just signs in afterward (see `register()` in
  `auth.service.ts`, back to `signInWithPassword` rather than `signUp`).
- `models.Profile.firebase_uid` → `Profile.supabase_uid` (Alembic migration
  included; clean rename, no data to migrate since there were no production
  users yet).
- `externals/firebase_client.py` trimmed to messaging only
  (`send_push_to_token(s)`, `send_notification_to_topic`) —
  `notifications_service.py` is unchanged.
- Needs `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_AUD` set
  in the server's real `.env` (not committed) before the next deploy —
  see that repo's `.env.example`.

Until that's deployed to `lam3i.tech`, `/users/profile` and friends still
reject the app's Supabase-token requests — that's what
`EXPO_PUBLIC_USE_MOCK_PROFILE` works around for local demos in the meantime.

## 4. Removing the mock once the backend is deployed

Set `EXPO_PUBLIC_USE_MOCK_PROFILE=false` (or delete the line) in `.env`, and
optionally delete `src/services/mockProfile.ts` and the fallback branch in
`AuthContext.tsx`'s `fetchProfile`.
