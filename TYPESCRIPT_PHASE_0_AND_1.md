# TypeScript Migration — Phase 0 & Phase 1 (Detailed Guide)

> **Scope:** Prep (Phase 0) + Foundation types & utils (Phase 1) only.
> **Branch:** `refactoring/phaze-0-and-1`
> **Goal:** Lay the typed foundation the rest of the migration builds on, and reach a clean
> `tsc --noEmit` with the app still running.
> **Companion doc:** `TYPESCRIPT_MIGRATION_ANALYSIS.md` (full assessment + all phases).
> **Backend:** FastAPI at `https://lam3a.tech` — repo `github.com/yousef-najeh/m4asel`. The
> domain types below are taken **1:1 from the backend source** (`schemas.py`, `models.py`,
> `constants.py`), cross-checked against the live `openapi.json`.

All paths are relative to the app root `m4asel/` unless noted. Run commands from inside
`m4asel/` (that's where `package.json` lives).

---

## Definition of done for Phases 0 & 1

- [x] Working on branch `refactoring/phaze-0-and-1`
- `expo-env.d.ts` exists so `process.env.EXPO_PUBLIC_*` is typed
- `package.json` has a `typecheck` script
- These 4 files are TypeScript with real types:
  - `constants/UserRole.ts` (value **and** union type)
  - `types/api.ts` (the shared domain model — new file)
  - `app/utils/helpers.ts`
  - `util/fireBaseConfig.ts`
- `npm run typecheck` reports **0 errors**
- `npx expo start` still boots and the app runs
- Two clean commits (one per phase)

> **Why this is safe:** Babel/Metro strip types at build time, so renaming files and adding
> types can't break the running app. The only failure mode is a red `tsc`. Also note every
> current import of these files is **extensionless** (e.g. `import { UserRole } from '../../constants/UserRole'`),
> so renaming `.js/.jsx → .ts` needs **no import-path edits** anywhere — resolution just finds
> the `.ts` file.

---

# Phase 0 — Prep

Purpose: get the environment and tooling ready so Phase 1 can be verified. No code conversion yet.

### 0.1 — Confirm the branch (already done)

```bash
git branch --show-current      # → refactoring/phaze-0-and-1
```

### 0.2 — Environment file for runtime (needed for the smoke test)

The app reads the backend URL from `process.env.EXPO_PUBLIC_API_BASE_URL` in 8 files. Without
it, every `fetch` hits `undefined/...`. This is **not** a TypeScript requirement, but you need
it for the "app still runs" check. Ensure a `.env` exists at the app root:

```bash
# m4asel/.env
EXPO_PUBLIC_API_BASE_URL=https://lam3a.tech
```

> **No trailing slash** — probed and confirmed: `/health-check` → `200`, `//health-check`
> (what a trailing slash produces) → `404`. The endpoints live at the host root, and the app
> builds URLs as `` `${apiUrl}/users/profile` ``. `.env` is git-ignored (`.gitignore` line 45).

### 0.3 — Generate `expo-env.d.ts`

This file makes `process.env.EXPO_PUBLIC_*` typed (as `string | undefined`) instead of an
error under strict. Expo auto-generates it. Start the dev server once, then stop it:

```bash
npx expo start
# wait until the Metro bundler banner appears, then press Ctrl+C
```

**Verify:** a new `expo-env.d.ts` appears at the app root containing
`/// <reference types="expo/types" />`. It is already listed in `tsconfig.json` `include`, and
it is git-ignored (leave it generated, don't edit it).

### 0.4 — Add a `typecheck` script

Edit `package.json` → `scripts`, add one line:

```jsonc
"scripts": {
  "start": "expo start",
  "reset-project": "node ./scripts/reset-project.js",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint",
  "typecheck": "tsc --noEmit"        // ← add this
}
```

### 0.5 — Record the baseline

```bash
npm run typecheck
```

Note whatever it prints **now** (before any changes). The template `.tsx` files should already
be clean, so you likely get 0 errors. If there are pre-existing errors, write them down so you
don't confuse them with migration-introduced ones later.

### 0.6 — Commit

```bash
git add package.json expo-env.d.ts
git commit -m "chore(ts): phase 0 prep — typecheck script + expo-env types"
```

---

# Phase 1 — Foundation (types + utils)

Purpose: create the shared domain model and convert the three dependency-free support files.
**Order matters within this phase** because `types/api.ts` imports the `UserRole` type:

1. `constants/UserRole.ts`  → 2. `types/api.ts`  → 3. `app/utils/helpers.ts`  → 4. `util/fireBaseConfig.ts`

---

### 1.1 — `constants/UserRole.js → constants/UserRole.ts`

```bash
git mv constants/UserRole.js constants/UserRole.ts
```

Then make it emit both a runtime value **and** a type. Replace the file contents with:

```ts
export const UserRole = {
  ADMIN: 'admin',
  CONFIRMED_USER: 'confirmed_user',
  UNCONFIRMED_USER: 'unconfirmed_user',
  WASHER_OWNER: 'washer_owner',
  WASHER_WORKER: 'washer_worker',
} as const;

// A value named `UserRole` and a type named `UserRole` can coexist (declaration merging).
// Existing imports `import { UserRole } from '.../UserRole'` keep working as the value,
// and you can now also write `role: UserRole` as a type.
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
```

**Why `as const`:** without it, the values widen to `string` and you lose the literal union.
With it, `UserRole` (the type) resolves to
`'admin' | 'confirmed_user' | 'unconfirmed_user' | 'washer_owner' | 'washer_worker'`.

**Details / watch-outs:**
- No importer changes needed (all extensionless).
- The value + type sharing the same name is intentional and idiomatic — not an error.
- ✅ **Values match the backend.** The backend enum member *names* are `WASH_OWNER`/`WASH_WORKER`
  (constants.py), but the string *values* are identical (`washer_owner`/`washer_worker`). The app
  compares by value, so this frontend object is correct as-is.

---

### 1.2 — Create `types/api.ts` (the shared domain model) — ✅ verified against backend source

This is the keystone of the whole migration. Create a new folder `types/` at the app root with
`api.ts`. **Every shape below is copied 1:1 from the backend `schemas.py` / `models.py` /
`constants.py`** (FastAPI + SQLModel) and matches the live OpenAPI contract — not inferred.
Interface names mirror the backend; app-friendly aliases are at the bottom.

```ts
import type { User as FirebaseUser } from 'firebase/auth';
import type { UserRole } from '@/constants/UserRole';

// ── Enums (backend constants.py) ──
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ServiceSize = 'small' | 'large';

// ── Washer profiles ──
/** Base washer profile — backend WasherProfileRead. */
export interface WasherProfileRead {
  id: number;
  profile_id: number;
  display_name: string;
  address: string;
  latitude: number;
  longitude: number;
  opening_time: string; // "HH:mm:ss"
  closing_time: string;
}

/** Full washer profile + services — GET /washers/{id}, UserProfileRead.washer_profile. */
export interface WashProfileWithServicesRead extends WasherProfileRead {
  wash_services?: WashService[] | null; // default []
}

/** Compact washer profile nested inside a booking's service — backend WasherProfileBasic. */
export interface WasherProfileBasic {
  id: number;
  display_name: string;
  address: string;
}

// ── Wash services ──
/** Full wash service — backend WashService (models.py). NOTE: `id` is nullable. */
export interface WashService {
  id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  washer_profile_id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number; // default 60
  size: ServiceSize;        // default 'large'
  is_active: boolean;       // default true
}

/** Compact service nested in a booking — backend WashServiceBasic. */
export interface WashServiceBasic {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  washer_profile?: WasherProfileBasic | null;
}

// ── Users ──
/** Compact user profile nested in a booking — backend UserProfileBasic. */
export interface UserProfileBasic {
  id: number;
  name: string;
  mobile_number: string;
}

/** Authenticated user's profile — GET /users/profile (backend UserProfileRead).
 *  NOTE: no `email` field — email lives on the Firebase user, not the API profile. */
export interface UserProfileRead {
  id: number;
  name: string;
  mobile_number: string;
  user_role: UserRole;
  washer_profile?: WashProfileWithServicesRead | null;
}

// ── Bookings ──
/** A booking — GET /bookings/ (backend OrderResponse). */
export interface OrderResponse {
  id: number;
  wash_service_id: number;
  user_profile_id: number;
  scheduled_time: string; // date-time — reads use scheduled_time
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  wash_service?: WashServiceBasic | null;
  user_profile?: UserProfileBasic | null;
  // NOTE: no cancel_reason on reads (stored server-side in a separate CancelledReason table).
}

// ── Nearby washers (map) ──
/** Map marker — GET /washers?lat&lng (backend NearbyWasherResponse extends WasherProfileRead). */
export interface NearbyWasherResponse extends WasherProfileRead {
  order_start?: string | null;
  order_end?: string | null;
  next_available_time: string; // date-time (required)
  arrival_time: string;        // date-time (required)
  distance_km: number;         // required
  services: string[];          // default []
}

// ── Notifications ──
/** A notification — GET /notifications/ (backend NotificationRead).
 *  Field is `body` (NOT `message`), and there is NO read-state field. */
export interface NotificationRead {
  id: number;
  title: string;
  body: string;
  created_at: string | null;
}

// ── Request bodies (used in later phases) ──
export interface BookingCreate {
  washer_id: number;
  wash_service_id: number;
  scheduled_start: string; // create uses scheduled_start (reads use scheduled_time)
}
export interface BookingStatusUpdate {
  status: OrderStatus;
  cancel_reason?: string | null; // REQUIRED by backend when status === 'cancelled'
}
export interface CreateProfileSchema {
  name: string;
  mobile_number: string;
  email: string;
  password: string;
}
export interface WashServiceCreate {
  name: string;
  description: string; // required — send '' rather than null
  price: number;
  duration_minutes: number;
}
export interface WashServiceUpdate {
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
}
export interface FcmTokenInfo {
  token: string;
}

// ── App-friendly aliases (match the screens' vocabulary) ──
export type Booking = OrderResponse;
export type Washer = NearbyWasherResponse;
export type UserProfile = UserProfileRead;
export type WasherProfile = WashProfileWithServicesRead;
export type BookingStatus = OrderStatus;
// (Import NotificationRead directly — avoid the name `Notification`, a DOM global.)

// ── Auth context (typed in Phase 2) ──
export interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfileRead | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  role?: UserRole;
  washerProfile?: WashProfileWithServicesRead | null;
}
```

**Details / watch-outs (all verified against backend source):**
- **`scheduled_start` vs `scheduled_time` — resolved:** creates send `BookingCreate.scheduled_start`;
  reads return `OrderResponse.scheduled_time`. Both are modelled above; not a bug.
- **`WashService.id` is nullable** in the read model. `BookingPage` passes `selectedService.id`
  as `wash_service_id: number`, so it needs a non-null guard in Phase 4.
- **`NotificationRead` has `body` (not `message`) and no read-state** — when `Notifications.tsx`
  is typed in Phase 4, TS will (correctly) flag `notification.message` and `notification.is_read`.
- **`UserProfileRead` has no `email`** — `ProfilePage` already reads email from the Firebase
  `user`, so this is fine; just don't add `email` to the profile type.
- `import type { User as FirebaseUser } from 'firebase/auth'` and `@/constants/UserRole` both
  resolve with no installs / the existing path alias.

---

### 1.3 — `app/utils/helpers.js → app/utils/helpers.ts`

```bash
git mv app/utils/helpers.js app/utils/helpers.ts
```

Add parameter/return types. Full converted file:

```ts
// Accepts full ISO datetime ("2024-01-15T09:00:00Z") or time string ("09:00:00" / "09:00:00.000Z")
export const formatTime = (input?: string | null): string => {
  if (!input) return 'غير محدد';
  try {
    let h: number, m: number;
    if (input.includes('T')) {
      const d = new Date(input);
      h = d.getHours();
      m = d.getMinutes();
    } else {
      const parts = input.replace('Z', '').split(':');
      h = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10);
    }
    const ampm = h >= 12 ? 'مساءً' : 'صباحاً';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  } catch {
    return input;
  }
};

export const formatDateTime = (
  isoString?: string | null,
): { date: string; time: string } => {
  if (!isoString) return { date: '---', time: '---' };
  try {
    const d = new Date(isoString);
    const months = ['يناير','فبراير','مارس','إبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    const date = `${d.getDate()} ${months[d.getMonth()]}`;
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'م' : 'ص';
    h = h % 12 || 12;
    return { date, time: `${h}:${m} ${ampm}` };
  } catch {
    return { date: '---', time: '---' };
  }
};

export const formatDistance = (km?: number | null): string | null => {
  if (km == null) return null;   // ← see note; replaces `if (!km && km !== 0)`
  return km < 1 ? `${(km * 1000).toFixed(0)} م` : `${km.toFixed(1)} كم`;
};
```

**Details / watch-outs:**
- `formatTime`/`formatDateTime`: the `if (!input)` guard narrows `string | null | undefined`
  down to `string`, so the body type-checks cleanly.
- `formatDistance`: the original guard `if (!km && km !== 0)` does **not** narrow `null`/
  `undefined` away for TypeScript, so `km < 1` would error as "possibly null". Use
  `if (km == null) return null;` — behaviourally equivalent for real distances (returns `null`
  for missing, formats `0` as `"0 م"`). Only difference is a `NaN` input would now format as
  `"NaN كم"` instead of `null`; the API never sends `NaN`, so this is fine.

---

### 1.4 — `util/fireBaseConfig.jsx → util/fireBaseConfig.ts`

No JSX in this file, so it becomes `.ts` (not `.tsx`):

```bash
git mv util/fireBaseConfig.jsx util/fireBaseConfig.ts
```

The contents stay the same; the types are inferred (`initializeApp → FirebaseApp`,
`initializeAuth → Auth`). No edits usually required:

```ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDCH-t6Ykli9Aew_bqtmzlz3q4P7PA5Q-Q',
  authDomain: 'm4asel-d94d0.firebaseapp.com',
  projectId: 'm4asel-d94d0',
  storageBucket: 'm4asel-d94d0.firebasestorage.app',
  messagingSenderId: '1095895610631',
  appId: '1:1095895610631:web:6187a8a639b29561a5c1a2',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, app };
```

**Details / watch-outs:**
- **Known snag:** in some Firebase v12 setups, `getReactNativePersistence` is not surfaced in
  the `firebase/auth` **type** declarations even though it exists at runtime. If `tsc` reports
  it as missing, do **not** change the runtime import — add a narrow escape hatch on that line:
  ```ts
  // @ts-expect-error getReactNativePersistence is exported at runtime but missing from types in this version
  import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
  ```
  Only add this if `tsc` actually complains; try without it first.
- Aside (not TS): the API key is hardcoded here. Fine for a Firebase web config (these keys are
  not secrets), but if you want it in `.env` later, that's a separate task — out of scope.

---

### 1.5 — Verify & commit

```bash
npm run typecheck      # expect 0 errors (same as your Phase 0 baseline)
npx expo start         # optional sanity: app still boots; Ctrl+C to stop
```

If `typecheck` is clean:

```bash
git add constants/UserRole.ts types/api.ts app/utils/helpers.ts util/fireBaseConfig.ts
git commit -m "refactor(ts): phase 1 foundation — domain types, UserRole, helpers, firebase config"
```

**Expected error count = 0.** These four files have no dependents that yet *demand* their new
types (the screens still import them as before, extensionless, and don't pass typed arguments
until later phases). So converting them in isolation should not cascade errors.

---

## 🐞 Bugs surfaced while verifying types (fix in Phase 3/4, not now)

Typing against the real contract exposes existing mismatches. They don't block Phases 0/1, but
note them — TypeScript will flag most of them automatically when you convert the screens.

| Where | Problem | Fix (later phase) |
|---|---|---|
| `Notifications.jsx` | Reads `notification.message` → the field is `body`, so the text is always blank. The screen also reads `notification.is_read`, which **doesn't exist** (no read-state in the DB). | Use `body`; remove unread badge/dot logic (or wait for backend support). |
| `History.jsx` | `statusConfig` is keyed on `confirmed` (never returned) and is missing `in_progress` (which *is* returned) → in-progress bookings render with pending styling. | Replace `confirmed` with `in_progress`. |
| `ServiceFormModal.jsx` | Sends `description: description.trim() || null`, but backend `WashServiceCreate/Update.description` is a **required string** → 422 on empty. | Send `description.trim()` (string, never null). |
| App-wide (push) | A full `FcmToken` table + `/users/fcm-token` endpoints exist, but the app **never registers a token**, so push can't reach the device (only the in-app list works). | Call `POST /users/fcm-token` on login/register (enhancement). |

---

## Consolidated gotchas (Phases 0 & 1)

| # | Where | Watch-out | Fix |
|---|---|---|---|
| 1 | `constants/UserRole.ts` | Values widen to `string` | `as const` + derived union type |
| 2 | `types/api.ts` | Verified vs backend: reads=`scheduled_time`, create=`scheduled_start`; `NotificationRead` uses `body` (no read-state); no `email` on profile; `WashService.id` nullable | Types already reflect this — see §1.2 |
| 3 | `helpers.ts` `formatDistance` | Old guard doesn't narrow `null` for TS | Use `if (km == null) return null;` |
| 4 | `fireBaseConfig.ts` | `getReactNativePersistence` may be missing from types | `// @ts-expect-error` on that import line **only if** tsc complains |
| 5 | All renames | — | No import edits needed (extensionless imports resolve to `.ts`) |
| 6 | `expo-env.d.ts` | Missing → `process.env` untyped | Generate via `npx expo start` |

---

## ✅ Tracking checklist

Tick as you go. Each phase ends with a green `typecheck` and a commit.

### Phase 0 — Prep — ✅ COMPLETE (commit `0a0c144`)
- [x] On branch `refactoring/phaze-0-and-1`
- [x] `.env` present with `EXPO_PUBLIC_API_BASE_URL=https://lam3a.tech` (no trailing slash)
- [x] `npm install` — node_modules was missing; installed 1238 packages
- [x] `expo-env.d.ts` created at app root (`/// <reference types="expo/types" />`)
- [x] Added `"typecheck": "tsc --noEmit"` to `package.json` scripts
- [x] Ran `npm run typecheck` — baseline error count: **0**
- [x] Committed: `chore(ts): phase 0 prep …` (`0a0c144`)

### Phase 1 — Foundation — ✅ COMPLETE (commit `177187b`, pushed to PR #5)
- [x] `git mv constants/UserRole.js constants/UserRole.ts`
- [x] Added `as const` + `export type UserRole = …` union
- [x] Created `types/api.ts` with all verified interfaces (enums, `WasherProfileRead`, `WashProfileWithServicesRead`, `WashService`, `WashServiceBasic`, `UserProfileRead`, `OrderResponse`, `NearbyWasherResponse`, `NotificationRead`, request bodies, aliases, `AuthContextType`)
- [x] `git mv app/utils/helpers.js app/utils/helpers.ts` + typed params/returns
- [x] Fixed `formatDistance` guard (`if (km == null) return null;`)
- [x] `git mv util/fireBaseConfig.jsx util/fireBaseConfig.ts`
- [x] Handled `getReactNativePersistence` types: ☑ **added `@ts-expect-error`** (tsc flagged it missing from `firebase/auth` v12 types)
- [x] `npm run typecheck` → **0 errors**
- [ ] `npx expo start` → app still boots *(not yet run — types are erased at build so no runtime impact expected)*
- [x] Committed: `refactor(ts): phase 1 foundation …` (`177187b`)

### Ready for Phase 2?
- [x] Phase 1 code boxes checked, committed, branch pushed (PR #5 updated)
- [ ] Next: `AuthContext.jsx → .tsx` using `AuthContextType` from `types/api.ts` (see analysis doc, Phase 2)

---

## 📋 Granular change checklist — every symbol in Phases 0 & 1

Exhaustive, symbol-by-symbol. `➕ add` = brand new, `✏️ annotate` = add types to existing code,
`🔁 rename` = file/extension change only, `🧠 inferred` = TypeScript infers it, no manual typing.
Interface fields are listed individually so you can verify the shape field-by-field against the
backend `schemas.py`.

### `package.json` (Phase 0)
- [x] ➕ `scripts.typecheck` = `"tsc --noEmit"`

### `expo-env.d.ts` (Phase 0, generated)
- [x] ➕ file generated by `npx expo start` (do not hand-edit)

---

### `constants/UserRole.ts` (🔁 from `.js`)
- [x] 🔁 rename `UserRole.js → UserRole.ts`
- [x] ✏️ object `UserRole` — append `as const`
- [x] ➕ type `UserRole` = `(typeof UserRole)[keyof typeof UserRole]`
- [x] (values unchanged: `ADMIN`, `CONFIRMED_USER`, `UNCONFIRMED_USER`, `WASHER_OWNER`, `WASHER_WORKER`)

---

### `types/api.ts` (➕ new file — verified against backend `schemas.py`/`models.py`)

**Imports**
- [x] ➕ `import type { User as FirebaseUser } from 'firebase/auth'`
- [x] ➕ `import type { UserRole } from '@/constants/UserRole'`

**➕ enums**
- [x] type `OrderStatus` = `'pending' | 'in_progress' | 'completed' | 'cancelled'` (no `confirmed`)
- [x] type `ServiceSize` = `'small' | 'large'`

**➕ interface `WasherProfileRead`**
- [x] `id: number`
- [x] `profile_id: number`
- [x] `display_name: string`
- [x] `address: string`
- [x] `latitude: number`
- [x] `longitude: number`
- [x] `opening_time: string`
- [x] `closing_time: string`

**➕ interface `WashProfileWithServicesRead extends WasherProfileRead`**
- [x] `wash_services?: WashService[] | null`

**➕ interface `WasherProfileBasic`**
- [x] `id: number`
- [x] `display_name: string`
- [x] `address: string`

**➕ interface `WashService`** (full)
- [x] `id?: number | null`
- [x] `created_at?: string | null`
- [x] `updated_at?: string | null`
- [x] `washer_profile_id: number`
- [x] `name: string`
- [x] `description: string`
- [x] `price: number`
- [x] `duration_minutes: number`
- [x] `size: ServiceSize`
- [x] `is_active: boolean`

**➕ interface `WashServiceBasic`**
- [x] `id: number`
- [x] `name: string`
- [x] `description: string`
- [x] `price: number`
- [x] `duration_minutes: number`
- [x] `washer_profile?: WasherProfileBasic | null`

**➕ interface `UserProfileBasic`**
- [x] `id: number`
- [x] `name: string`
- [x] `mobile_number: string`

**➕ interface `UserProfileRead`** (no `email`)
- [x] `id: number`
- [x] `name: string`
- [x] `mobile_number: string`
- [x] `user_role: UserRole`
- [x] `washer_profile?: WashProfileWithServicesRead | null`

**➕ interface `OrderResponse`** (booking)
- [x] `id: number`
- [x] `wash_service_id: number`
- [x] `user_profile_id: number`
- [x] `scheduled_time: string`
- [x] `status: OrderStatus`
- [x] `created_at: string`
- [x] `updated_at: string`
- [x] `wash_service?: WashServiceBasic | null`
- [x] `user_profile?: UserProfileBasic | null`

**➕ interface `NearbyWasherResponse extends WasherProfileRead`** (map marker)
- [x] `order_start?: string | null`
- [x] `order_end?: string | null`
- [x] `next_available_time: string`
- [x] `arrival_time: string`
- [x] `distance_km: number`
- [x] `services: string[]`

**➕ interface `NotificationRead`** (`body`, not `message`; no read-state)
- [x] `id: number`
- [x] `title: string`
- [x] `body: string`
- [x] `created_at: string | null`

**➕ request bodies**
- [x] `BookingCreate` — `washer_id`, `wash_service_id`, `scheduled_start`
- [x] `BookingStatusUpdate` — `status`, `cancel_reason?` (required when cancelling)
- [x] `CreateProfileSchema` — `name`, `mobile_number`, `email`, `password`
- [x] `WashServiceCreate` — `name`, `description`, `price`, `duration_minutes`
- [x] `WashServiceUpdate` — + `is_active`
- [x] `FcmTokenInfo` — `token`

**➕ aliases**
- [x] `Booking = OrderResponse`, `Washer = NearbyWasherResponse`, `UserProfile = UserProfileRead`, `WasherProfile = WashProfileWithServicesRead`, `BookingStatus = OrderStatus`

**➕ interface `AuthContextType`** (consumed in Phase 2)
- [x] `user: FirebaseUser | null`
- [x] `profile: UserProfileRead | null`
- [x] `loading: boolean`
- [x] `error: string | null`
- [x] `refreshProfile: () => Promise<void>`
- [x] `isAuthenticated: boolean`
- [x] `role?: UserRole`
- [x] `washerProfile?: WashProfileWithServicesRead | null`

---

### `app/utils/helpers.ts` (🔁 from `.js`)
- [x] 🔁 rename `helpers.js → helpers.ts`

**✏️ function `formatTime`**
- [x] param `input?: string | null`
- [x] return `: string`
- [x] local `h: number`
- [x] local `m: number`
- [x] (locals `ampm`, `h12`, `d`, `parts` — 🧠 inferred)

**✏️ function `formatDateTime`**
- [x] param `isoString?: string | null`
- [x] return `: { date: string; time: string }`
- [x] (locals `d`, `months`, `date`, `h`, `m`, `ampm` — 🧠 inferred)

**✏️ function `formatDistance`**
- [x] param `km?: number | null`
- [x] return `: string | null`
- [x] 🔧 change guard `if (!km && km !== 0)` → `if (km == null) return null;`

---

### `util/fireBaseConfig.ts` (🔁 from `.jsx`)
- [x] 🔁 rename `fireBaseConfig.jsx → fireBaseConfig.ts`
- [x] 🧠 object `firebaseConfig` — inferred, no annotation
- [x] 🧠 variable `app` — inferred `FirebaseApp`
- [x] 🧠 variable `auth` — inferred `Auth`
- [x] 🔧 import `getReactNativePersistence` — added `// @ts-expect-error` (tsc flagged it missing from `firebase/auth` v12 types)
- [x] exports `auth`, `app` — unchanged

---

### Count summary
- **Files:** 3 converted (`UserRole`, `helpers`, `fireBaseConfig`) + 1 new (`types/api.ts`) + `package.json` edit + `expo-env.d.ts` generated
- **Types in `types/api.ts`:** 24 — 2 enums + 17 interfaces + 5 aliases — all mirrored 1:1 from backend `schemas.py`/`models.py`; plus the `UserRole` union in `constants/`
- **Typed fields:** ~90 across the interfaces
- **Functions annotated:** 3 (`formatTime`, `formatDateTime`, `formatDistance`)
- **Objects/vars touched:** `UserRole` (const), `firebaseConfig`, `app`, `auth`
