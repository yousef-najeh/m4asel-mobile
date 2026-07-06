# TypeScript Migration — Phase 2 (Detailed Guide)

> **Scope:** Convert the auth context (`app/Context/AuthContext.jsx → .tsx`) only — the single
> stateful provider the whole app depends on.
> **Branch:** `refactoring/phase-2` (off `refactoring/type-script-migration`, which already
> contains Phases 0 & 1 via merged PR #5).
> **Goal:** Type the context, its hook, its provider state, and the profile fetch — reaching a
> clean `tsc --noEmit` with the app still running.
> **Companion docs:** `TYPESCRIPT_MIGRATION_ANALYSIS.md` (full assessment + all phases),
> `TYPESCRIPT_PHASE_0_AND_1.md` (foundation).
> **Depends on:** `types/api.ts` from Phase 1 — this phase consumes `AuthContextType`,
> `UserProfileRead`, and the Firebase `User` type.

All paths are relative to the app root `m4asel/` unless noted. Run commands from inside
`m4asel/` (that's where `package.json` lives).

---

## Definition of done for Phase 2

- [x] Working on branch `refactoring/phase-2`
- [x] `app/Context/AuthContext.tsx` is TypeScript with real types:
  - context typed `createContext<AuthContextType | undefined>(undefined)`
  - `useAuth()` returns `AuthContextType` (never `undefined` — narrowed by the throw-guard)
  - `AuthProvider` children typed (`PropsWithChildren`)
  - all four `useState` calls carry the right generics
  - `fetchProfile(firebaseUser: User)` typed; `response.json()` cast to `UserProfileRead`
  - the provider `value` object satisfies `AuthContextType`
- [x] `npm run typecheck` reports **0 errors**
- [ ] `npx expo start` still boots and login/logout still works *(not yet run)*
- [ ] One clean commit *(holding — user will commit)*

> **Why this is safe:** Babel/Metro strip types at build time, so this is a rename + annotations
> with no runtime change. Every import of this file is **extensionless**
> (`import { useAuth } from '../Context/AuthContext'`, `import { AuthProvider } from "./Context/AuthContext"`),
> so renaming `.jsx → .tsx` needs **no import-path edits** anywhere. The eight consumer files
> are still `.jsx` (converted in Phases 3–4), so they won't error now — they simply start
> receiving IntelliSense from the typed `useAuth`.

**Consumers of `useAuth` / `AuthProvider` (all extensionless imports — no edits this phase):**

| File | Uses |
|---|---|
| `app/_layout.jsx` | `<AuthProvider>` wrapper |
| `app/index.jsx` | `{ user, role, loading }` |
| `app/(auth)/_layout.jsx` | `{ user, loading, role }` |
| `app/(main)/_layout.jsx` | `{ role }` |
| `app/(main)/Bookings.jsx` | `{ user }` |
| `app/(main)/BookingPage.jsx` | `{ user }` |
| `app/(main)/History.jsx` | `{ user, role }` |
| `app/(main)/Notifications.jsx` | `{ user }` |
| `app/(main)/ProfilePage.jsx` | `{ user, profile, role, washerProfile, loading }` |
| `app/(main)/WasherDetails.jsx` | `{ washerProfile, loading, user, refreshProfile }` |
| `app/Components/Booking/TimeSlotGrid.jsx` | `{ user }` |

---

# Phase 2 — Context

Purpose: convert the one file that owns Firebase auth state + the API profile. It contains JSX
(the `<AuthContext.Provider>`), so it becomes **`.tsx`** (not `.ts`).

---

### 2.1 — `app/Context/AuthContext.jsx → app/Context/AuthContext.tsx`

```bash
git mv app/Context/AuthContext.jsx app/Context/AuthContext.tsx
```

### 2.2 — The full converted file

Replace the contents with the typed version below. Only types are added — **runtime behaviour
is unchanged** except the `catch` block, which now derives its message safely (see watch-out #4).

```tsx
import { onAuthStateChanged, type User } from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { auth } from "../../util/fireBaseConfig";
import type { AuthContextType, UserProfileRead } from "@/types/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// Provider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from API
  const fetchProfile = async (firebaseUser: User): Promise<void> => {
    try {
      const token = await firebaseUser.getIdToken();
      console.log("Fetching profile with token:", token);
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const profileData = (await response.json()) as UserProfileRead;
      setProfile(Object.freeze(profileData));
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
        setError(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper to refresh profile data
  const refreshProfile = async (): Promise<void> => {
    if (user) {
      setLoading(true);
      await fetchProfile(user);
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    refreshProfile,
    isAuthenticated: !!user,
    role: profile?.user_role,
    washerProfile: profile?.washer_profile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Default export for Expo Router (to prevent route warning)
export default AuthProvider;
```

**Details / watch-outs:**

1. **`createContext` with no default.** JS had `createContext()` → implicit `undefined` default and
   an `any` context type. Type it `createContext<AuthContextType | undefined>(undefined)`. The
   existing throw-guard in `useAuth` narrows away the `undefined`, so `useAuth()` returns a clean
   `AuthContextType` to every consumer.

2. **`children` typing.** `({ children }: PropsWithChildren)` is the idiomatic type for a component
   that only renders its children. (Equivalent: `{ children: React.ReactNode }`.)

3. **`useState(null)` needs generics.** Without them TS infers `null` and rejects every later
   `setUser(firebaseUser)` / `setProfile(profileData)`. Add:
   `useState<User | null>(null)`, `useState<UserProfileRead | null>(null)`,
   `useState<string | null>(null)`. `useState(true)` for `loading` is fine — inferred `boolean`.

4. **`catch (err)` is `unknown` under `strict`** (TS's `useUnknownInCatchVariables`). The old
   `setError(err.message)` no longer compiles because `unknown` has no `.message`. Narrow it:
   `err instanceof Error ? err.message : "Failed to fetch profile"`. This is a tiny behaviour
   improvement (no crash on a non-Error throw), not a regression.

5. **`response.json()` returns `any`** — cast the boundary once: `(await response.json()) as UserProfileRead`.
   This is the typed seam between the network and the app; everything downstream is now typed.

6. **`Object.freeze(profileData)`** returns `Readonly<UserProfileRead>`, which is assignable to
   `UserProfileRead | null` — no change needed, `setProfile(Object.freeze(...))` still type-checks.

7. **`onAuthStateChanged`'s callback param is already typed** by Firebase as `User | null`, so the
   inner `firebaseUser` needs no annotation; the `if (firebaseUser)` guard narrows it to `User`
   before `fetchProfile(firebaseUser)`.

8. **The `value` object.** Annotating it `const value: AuthContextType = { … }` makes the provider
   fail loudly here (not at some consumer) if a field drifts from the contract. `role` and
   `washerProfile` come from `profile?.…`, so they're `UserRole | undefined` /
   `WashProfileWithServicesRead | null | undefined` — which is exactly why `AuthContextType` marks
   them optional (`role?`, `washerProfile?`).

9. **No importer changes.** All 11 consumers import extensionlessly, so the `.jsx → .tsx` rename
   resolves automatically. Do **not** touch them this phase.

---

### 2.3 — Verify & commit

```bash
npm run typecheck      # expect 0 errors
npx expo start         # optional sanity: sign in → profile loads; sign out → cleared. Ctrl+C to stop
```

If `typecheck` is clean:

```bash
git add app/Context/AuthContext.tsx
git commit -m "refactor(ts): phase 2 — type AuthContext (context, provider, profile fetch)"
```

**Expected error count = 0.** This file's only new dependency is `types/api.ts` (already shipped
in Phase 1). Consumers stay `.jsx`, so nothing cascades.

---

## Consolidated gotchas (Phase 2)

| # | Where | Watch-out | Fix |
|---|---|---|---|
| 1 | `createContext()` | Untyped `any` context | `createContext<AuthContextType \| undefined>(undefined)` |
| 2 | `AuthProvider({ children })` | Implicit-any prop under `strict` | `({ children }: PropsWithChildren)` |
| 3 | `useState(null)` ×3 | Infers `null`, rejects later setters | Add generics: `<User \| null>`, `<UserProfileRead \| null>`, `<string \| null>` |
| 4 | `catch (err)` | `err` is `unknown`; `err.message` errors | `err instanceof Error ? err.message : "…"` |
| 5 | `await response.json()` | Returns `any` | Cast `as UserProfileRead` |
| 6 | `useAuth()` return | Could be `undefined` | Throw-guard already narrows → returns `AuthContextType` |
| 7 | The rename | — | No import edits (extensionless imports resolve to `.tsx`) |

---

## ✅ Tracking checklist

### Phase 2 — Context — ✅ CODE COMPLETE (typecheck green; commit held per user)
- [x] On branch `refactoring/phase-2`
- [x] `git mv app/Context/AuthContext.jsx app/Context/AuthContext.tsx`
- [x] Typed `createContext<AuthContextType | undefined>(undefined)`
- [x] `useAuth(): AuthContextType` (throw-guard narrows `undefined`)
- [x] `AuthProvider({ children }: PropsWithChildren)`
- [x] `useState<User | null>` (user), `useState<UserProfileRead | null>` (profile), `useState<string | null>` (error), `useState(true)` (loading)
- [x] `fetchProfile(firebaseUser: User): Promise<void>`
- [x] `(await response.json()) as UserProfileRead`
- [x] `catch (err)` narrowed (`err instanceof Error ? err.message : …`)
- [x] `refreshProfile(): Promise<void>`
- [x] `value: AuthContextType` object annotated
- [x] `npm run typecheck` → **0 errors**
- [ ] `npx expo start` → app still boots, sign-in still loads profile *(not yet run)*
- [ ] Committed: `refactor(ts): phase 2 — type AuthContext …` *(holding — user will commit)*
- [x] **Did NOT edit** any of the 11 consumer `.jsx` files

### Ready for Phase 3?
- [ ] Phase 2 committed, branch pushed, typecheck green *(typecheck green; commit pending)*
- [ ] Next: leaf components `.jsx → .tsx` with `Props` types (see analysis doc, Phase 3)

---

## 📋 Granular change checklist — every symbol in Phase 2

`➕ add` = brand new, `✏️ annotate` = add types to existing code, `🔁 rename` = file/extension
change only, `🧠 inferred` = TypeScript infers it, `🔧 fix` = small logic change for TS.

### `app/Context/AuthContext.tsx` (🔁 from `.jsx`)
- [x] 🔁 rename `AuthContext.jsx → AuthContext.tsx`

**Imports**
- [x] ✏️ `import { onAuthStateChanged, type User } from "firebase/auth"`
- [x] ➕ `type PropsWithChildren` from `"react"`
- [x] ➕ `import type { AuthContextType, UserProfileRead } from "@/types/api"`

**Context + hook**
- [x] ✏️ `AuthContext` = `createContext<AuthContextType | undefined>(undefined)`
- [x] ✏️ `useAuth` return type `: AuthContextType`
- [x] 🧠 `context` — inferred `AuthContextType | undefined`, narrowed by throw-guard
- [x] 🧠 `apiUrl` — inferred `string | undefined` (from `expo-env.d.ts`)

**`AuthProvider`**
- [x] ✏️ param `{ children }: PropsWithChildren`
- [x] ✏️ state `user` — `useState<User | null>(null)`
- [x] ✏️ state `profile` — `useState<UserProfileRead | null>(null)`
- [x] 🧠 state `loading` — `useState(true)` → inferred `boolean`
- [x] ✏️ state `error` — `useState<string | null>(null)`

**`fetchProfile`**
- [x] ✏️ param `firebaseUser: User`
- [x] ✏️ return `: Promise<void>`
- [x] 🧠 `token` — inferred `string` (`getIdToken()`)
- [x] 🧠 `response` — inferred `Response`
- [x] 🔧 `profileData` — `(await response.json()) as UserProfileRead`
- [x] 🔧 `catch (err)` — `err instanceof Error ? err.message : "Failed to fetch profile"`
- [x] 🧠 `Object.freeze(profileData)` — `Readonly<UserProfileRead>`, assignable to state

**`useEffect` / `onAuthStateChanged`**
- [x] 🧠 callback `firebaseUser` — inferred `User | null` (Firebase types)
- [x] 🧠 `unsubscribe` — inferred `Unsubscribe`

**`refreshProfile`**
- [x] ✏️ return `: Promise<void>`

**Provider value**
- [x] ✏️ `const value: AuthContextType = { … }`
- [x] `user`, `profile`, `loading`, `error`, `refreshProfile`
- [x] `isAuthenticated: !!user`
- [x] `role: profile?.user_role` (→ `UserRole | undefined`)
- [x] `washerProfile: profile?.washer_profile` (→ `WashProfileWithServicesRead | null | undefined`)

**Exports**
- [x] `export { AuthContext, useAuth, AuthProvider }` + `export default AuthProvider` — unchanged

---

### Count summary
- **Files:** 1 converted (`AuthContext.jsx → .tsx`). **0 consumer edits** this phase.
- **New imports:** 3 (`type User`, `type PropsWithChildren`, `AuthContextType`/`UserProfileRead`)
- **State hooks typed:** 4 (`user`, `profile`, `loading`, `error`)
- **Functions annotated:** 3 (`useAuth`, `fetchProfile`, `refreshProfile`)
- **Logic fixes for TS:** 1 (`catch (err)` narrowing) + 1 boundary cast (`response.json()`)
- **Expected `tsc` result:** 0 errors
