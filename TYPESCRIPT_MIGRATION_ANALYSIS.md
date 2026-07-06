# JavaScript → TypeScript Migration Analysis — `m4asel` (Expo/React Native)

> Senior-architect assessment of converting this project from JavaScript to TypeScript —
> packages, dependencies, and code. **Analysis only** (no code changes). Target posture:
> **full strict typing** (keep `strict: true`, define shared domain interfaces, type every
> component prop and the auth context).

The app is an Arabic (RTL) car-wash booking app on **Expo 54 / React Native 0.81 /
React 19**, using `expo-router` (file-based routing), Firebase Auth, a REST backend
(`EXPO_PUBLIC_API_BASE_URL`), NativeWind + gluestack-ui, and `react-native-elements`.
Project root for all paths below is `m4asel/`.

---

## Executive verdict

**Migration is low-risk and well-scoped.** Three facts make this easy:

1. **The toolchain is already TypeScript-ready.** `babel-preset-expo` + Metro transpile
   `.ts/.tsx` today and strip types at build time, so **the app keeps running regardless
   of type errors** — TS here only powers editor IntelliSense and an opt-in `tsc --noEmit`
   check. No bundler/build changes are needed.
2. **The project is half-migrated already.** `typescript@~5.9.2` and `@types/react` are in
   `devDependencies`, `tsconfig.json` exists with `strict: true`, and the entire Expo
   template layer (`components/`, `hooks/`, `constants/theme.ts`) is already `.tsx/.ts`.
   Only the hand-written app in `app/` (plus 3 support files) is still JS.
3. **No new type packages are required.** Every runtime dependency the app imports ships
   its own types (see audit below).

**The real work is code, not config:** ~28 files to rename and annotate. The dominant cost
is that `strict` (specifically `noImplicitAny`) makes **every untyped component prop a
compile error**, so each component needs a `Props` type, and the app needs a shared domain
model for the API payloads.

**Rough effort:** ~1–2 focused days for one developer to reach a clean `tsc --noEmit` under
strict, plus a manual pass through the app's flows.

---

## Migration progress

| Phase | Status |
|---|---|
| Phase 0 — Prep | ✅ **Complete** (`0a0c144`) — merged to `refactoring/type-script-migration` via PR #5 |
| Phase 1 — Foundation (types + utils) | ✅ **Complete** (`177187b`) — merged via PR #5 |
| Phase 2 — Context (`AuthContext`) | ✅ **Code complete** — branch `refactoring/phase-2`, `tsc` 0 errors (commit pending — see `TYPESCRIPT_PHASE_2.md`) |
| Phase 3 — Leaf components (11 files) | ✅ **Code complete** — branch `refactoring/phase-3`, `tsc` 0 errors (commit pending — see `TYPESCRIPT_PHASE_3.md`) |
| Phase 4 — Screens & layouts (13 files) | ✅ **Code complete** — branch `refactoring/phase-4`, `tsc` 0 errors (commit pending — see `TYPESCRIPT_PHASE_4.md`) |
| Phase 5 — Tighten & verify | ✅ **Verified** — branch `refactoring/phase-5`: `tsc` 0 errors + **`expo export` bundles the whole app clean**; stale tsconfig line removed (lint blocked by a sandbox MSVC-runtime gap — run locally; commit pending — see `TYPESCRIPT_PHASE_5.md`) |

## Current state

| Area | Status |
|---|---|
| `tsconfig.json` | Exists, `extends expo/tsconfig.base`, `strict: true`, path alias `@/*` + `tailwind.config` |
| `typescript`, `@types/react` | Already installed (dev deps) |
| Template layer (`components/`, `hooks/`, `constants/theme.ts`, `nativewind-env.d.ts`) | Already TS ✅ |
| Foundation layer (`constants/UserRole.ts`, `types/api.ts`, `app/utils/helpers.ts`, `util/fireBaseConfig.ts`) | Migrated to TS ✅ (Phase 1) |
| Context (`app/Context/AuthContext.tsx`) | Migrated to TS ✅ (Phase 2) |
| Leaf components (`app/Components/**` — 11 files) | Migrated to TS ✅ (Phase 3) |
| Screens & layouts (`app/**` — 13 files) | Migrated to TS ✅ (Phase 4 — commit pending) |
| **Whole `app/` is now TypeScript** | Only the 5 build/tooling `.js` configs remain (intentional) |
| Path aliases | Configured in **both** `babel.config.js` (module-resolver) and `tsconfig.json` `paths` — imports like `@/components/ui/button` already resolve |
| `experiments.typedRoutes` | **Enabled** in `app.json` → generates typed `Href`s (a friction point, see below) |
| `reactCompiler` | Enabled — orthogonal to TS, no impact |

**Quirk to clean up:** `tsconfig.json` `include` explicitly lists `"app/index.jsx"`. With
`allowJs` off (the default here), a `.jsx` file in `include` is invalid once we stop
compiling JS. This line gets removed during migration (the file becomes `app/index.tsx`,
matched by the `**/*.tsx` glob).

---

## Dependency & type-support audit

**Conclusion: no additional `@types/*` packages are strictly required.** All imported
runtime deps bundle their own declarations:

| Dependency | Types | Notes |
|---|---|---|
| `react`, `react-native` | Bundled / `@types/react` ✅ | `@types/react` present; RN ships its own |
| `expo`, `expo-router`, `expo-location`, `expo-image`, `expo-haptics`, `expo-*` | Bundled ✅ | — |
| `firebase` | Bundled ✅ | `User`, `AuthErrorCodes`, etc. all typed |
| `formik`, `yup` | Bundled ✅ | Enables generic-typed forms |
| `react-native-maps` | Bundled ✅ | `MapView`, `Marker`, `Region` types |
| `react-native-safe-area-context` | Bundled ✅ | — |
| `nativewind` | `nativewind-env.d.ts` ✅ | Already referenced |
| `@gluestack-ui/*`, `tailwind-variants` | Bundled ✅ | Template `.tsx` already uses `VariantProps` |
| `@react-native-async-storage/async-storage` | Bundled ✅ | — |
| `react-native-elements@3.4.3` | Bundled ✅ | **Deprecated** package (successor is `@rneui/themed`). Types work; flagged as tech debt, **out of scope**. |

**Two small gaps to handle deliberately (not blockers):**

- **`process.env.EXPO_PUBLIC_API_BASE_URL`** (used in 8 files) is typed via Expo's
  auto-generated `expo-env.d.ts`, which is already in `tsconfig` `include` but is generated
  on first `expo start`. Ensure it exists so `process.env` is typed rather than an error.
- **`@types/node` is not installed and not needed** — `console`/`setInterval`/`setTimeout`
  come from the TS `lib` set via the Expo base config; `process.env` comes from
  `expo-env.d.ts`.

**Possibly-unused deps** (no imports found in `app/` code): `@futurejj/react-native-checkbox`,
`react-native-geolocation-service` (the map uses `expo-location` instead), `react-aria`,
`react-stately`, `@legendapp/motion`, `@expo/html-elements`. They don't affect the
migration; pruning them is optional housekeeping, **out of scope**.

---

## File inventory & scope

**28 source files to convert** + **5 tooling files left as `.js`**.

### Convert `.jsx → .tsx` (contains JSX) — 25 files
- Routing/layouts (5): `app/_layout.jsx`, `app/index.jsx`, `app/(auth)/_layout.jsx`, `app/(main)/_layout.jsx`
- Auth screens (2): `app/(auth)/Login.jsx`, `app/(auth)/SignUp.jsx`
- Main screens (7): `Bookings`, `BookingPage`, `MapPage`, `WasherDetails`, `History`, `Notifications`, `ProfilePage` (all under `app/(main)/`)
- Components (11): `app/Components/TabButton.jsx`, `MapCard.jsx`, `ServiceFormModal.jsx`, and `app/Components/Booking/{ConfirmButton, DatePicker, ErrorState, LoadingState, ServiceCard, ServiceCards, TimeSlotGrid, TimeSlotPicker}.jsx`
- Context (1): `app/Context/AuthContext.jsx` (JSX Provider → `.tsx`)

### Convert `.jsx/.js → .ts` (no JSX) — 3 files
- `util/fireBaseConfig.jsx → .ts`
- `constants/UserRole.js → .ts`
- `app/utils/helpers.js → .ts`

### Leave as `.js` (build/dev tooling, not shipped, no type value)
- `babel.config.js`, `metro.config.js`, `eslint.config.js`, `tailwind.config.js`, `scripts/reset-project.js`

> Use `git mv` for renames so history is preserved.

---

## Domain model (the keystone)

Under strict typing the highest-leverage step is a single shared types module (e.g.
`types/api.ts`) capturing the API payloads the screens consume.

> **✅ Shipped in Phase 1 — see `m4asel/types/api.ts` for the authoritative shapes.**
> The list below was the *initial* model inferred from screen usage; it has since been
> **verified 1:1 against the backend** (`schemas.py` / `models.py` / `constants.py`) and a few
> fields were corrected. Trust `types/api.ts` over this summary. Corrections were:
> - `BookingStatus`/`OrderStatus` has **no `confirmed`** — only 4 values.
> - `UserProfile` has **no `email`** field.
> - `Notification` uses **`body`** (not `message`) and has **no `is_read`** read-state.
> - `WashService.id` is nullable; nested `*Basic` sub-types added.

- **`UserRole`** — was a plain object (`constants/UserRole.js`). Converted to the
  `as const` + derived-union pattern so existing value imports (`UserRole.WASHER_OWNER`)
  keep working *and* a `UserRole` type exists:
  `export const UserRole = {…} as const; export type UserRole = typeof UserRole[keyof typeof UserRole];`
- **`OrderStatus`** (`BookingStatus`) = `'pending' | 'in_progress' | 'completed' | 'cancelled'`
- **`WashService`** — `id?, washer_profile_id, name, description, price, duration_minutes, size, is_active`
- **`WasherProfile`** — `id, profile_id, display_name, address, latitude, longitude, opening_time, closing_time, wash_services?`
- **`UserProfile`** — `id, name, mobile_number, user_role: UserRole, washer_profile?`
- **`Booking`** (`OrderResponse`) — `id, wash_service_id, user_profile_id, scheduled_time, status: OrderStatus, created_at, updated_at, wash_service?, user_profile?`
- **`Washer`** (`NearbyWasherResponse`, map marker, from `/washers/?lat&lng`) — `WasherProfileRead` + `order_start?, order_end?, next_available_time, arrival_time, distance_km, services: string[]`
- **`Notification`** (`NotificationRead`) — `id, title, body, created_at`
- **`AuthContextType`** — `{ user: FirebaseUser | null; profile: UserProfileRead | null; loading; error: string | null; refreshProfile: () => Promise<void>; isAuthenticated; role?: UserRole; washerProfile?: WashProfileWithServicesRead | null }`

> **API asymmetry to note (not a TS issue):** `BookingPage` POSTs `scheduled_start`, but
> list screens read `scheduled_time`. Worth confirming with the backend while typing, but it
> doesn't change the migration.

---

## Type-friction hotspots (where `strict` will bite)

These are the spots that need real thought beyond mechanical renames:

1. **Implicit-any props — the bulk of the work.** Every component destructures untyped props
   (`ServiceCard`, `ServiceCards`, `TabButton`, `ConfirmButton`, `ErrorState`, `TimeSlotGrid`,
   `TimeSlotPicker`, `DatePicker`, `MapCard`, `ServiceFormModal`, plus inline `InfoRow`/
   `ActionRow` in `ProfilePage`/`WasherDetails` and `Field` in `ServiceFormModal`). Each
   needs a `Props` type. This is mechanical but touches ~15 components.
2. **`createContext()` with no default** (`AuthContext.jsx`) → type as
   `createContext<AuthContextType | undefined>(undefined)`; the existing `useAuth` throw-guard
   already narrows away `undefined`.
3. **Firebase `User`** — `import type { User } from 'firebase/auth'` for `fetchProfile`,
   context `user`, and every `user.getIdToken()` call site.
4. **`useRef(null)`** in `MapPage` → `useRef<MapView>(null)` and `useRef<FlatList<Washer>>(null)`;
   `onViewableItemsChanged` needs `{ viewableItems: ViewToken[] }`.
5. **`useLocalSearchParams()`** in `BookingPage` → `useLocalSearchParams<{ washerId: string }>()`
   so `parseInt(washerId)` type-checks.
6. **`experiments.typedRoutes` + string hrefs.** With typed routes on, `router.push` expects a
   typed `Href`. `MapCard.jsx:88` builds one with a query template
   (`` `/(main)/BookingPage?washerId=${item.id}` ``) and there are relative pushes
   (`router.push('./SignUp')`). These may fail typecheck; prefer the object form
   (`router.push({ pathname: '/(main)/BookingPage', params: { washerId: String(item.id) } })`)
   or a few `as Href` casts. **Localized friction, a handful of call sites.**
7. **Index-by-key maps** — `roleRedirectMap[role]`, `statusConfig[booking.status]`,
   `roleLabels[role]`, `authErrorMessages[error.code]` need `Record<…>` typing plus a fallback
   for the `undefined`/unknown-key case (the code already supplies `|| fallback`).
8. **`await response.json()` returns `any`** — annotate the boundary, e.g.
   `const data = (await response.json()) as Booking[]`, to feed the domain types inward.
9. **Formik** — type forms with generics: `<Formik<LoginValues> …>` and
   `(values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>)`.
10. **`StyleSheet.create({...})`** — no annotation needed; fully inferred. (This is most of the
    line count, so raw LoC overstates the effort.)

---

## `tsconfig.json` changes (minimal)

- **Remove** `"app/index.jsx"` from `include` (becomes `app/index.tsx`).
- **Keep** `strict: true`.
- Ensure `expo-env.d.ts` is generated (first `expo start`) so `process.env` is typed.
- No change needed to `jsx`, `moduleResolution`, or `paths` (inherited/already set).

---

## Recommended migration path (bottom-up, if/when you execute)

Ordering minimizes churn — leaves first, so each layer's imports are already typed:

1. **Foundation:** add `types/api.ts` (domain model above); convert `constants/UserRole.ts`
   (as-const pattern), `app/utils/helpers.ts`, `util/fireBaseConfig.ts`.
2. **Context:** `app/Context/AuthContext.tsx` with `AuthContextType` + Firebase `User`.
3. **Leaf components** (11): props types; the trivial ones (`LoadingState`, `ErrorState`,
   `ConfirmButton`, `DatePicker`, `TabButton`) are quick wins.
4. **Screens & layouts** (13): consume the domain types; resolve the router/ref/params
   friction spots as they surface.
5. **Tighten:** remove the `app/index.jsx` include line; run `npx tsc --noEmit` to zero;
   optionally wire `tsc --noEmit` into CI / a `typecheck` npm script and `expo lint`.

Each phase is independently shippable and leaves the app runnable (Babel ignores type errors),
so this can land as a series of small PRs rather than one big-bang change. A codemod
(`ts-migrate`) is **not recommended** here — at 28 files it would inject `any`/`@ts-nocheck`
and forfeit the strict-typing goal that hand-conversion achieves cleanly.

---

## Verification (how to validate once executed)

- **Type check:** `npx tsc --noEmit` returns **0 errors** under `strict: true` (add a
  `"typecheck": "tsc --noEmit"` script).
- **Lint:** `npm run lint` (`expo lint`) passes.
- **Build/runtime smoke:** `npx expo start`, load the app, and exercise the core flows —
  login/signup, map + nearby washers, booking (service → date → time slot → confirm), washer
  dashboard accept/reject/complete, service add/edit/delete modal, history, notifications,
  profile/logout. Because Babel strips types, a green `tsc` plus a manual flow pass is the
  real gate.
- **Diff hygiene:** confirm renames used `git mv` (history preserved) and no `.jsx/.js` app
  files remain except the 5 intentional tooling configs.

---

## Risks & out of scope

- **Out of scope:** replacing the deprecated `react-native-elements`, pruning unused deps,
  backend `scheduled_start` vs `scheduled_time` reconciliation, and any web (`react-dom`)
  typing (`@types/react-dom` only needed if you later typecheck web-only DOM code — the app
  doesn't).
- **Main risk:** `experiments.typedRoutes` friction on dynamic hrefs — contained to a few
  `router.push` sites; object-form navigation resolves it.
- **Low runtime risk overall:** types are erased at build, so the migration cannot break the
  running app; the failure mode is red squiggles / a non-zero `tsc`, not a broken binary.

---

## Execution checklist

Work top-to-bottom. Each phase leaves the app runnable, so commit after each. Run
`npx tsc --noEmit` at the end of every phase and fix before moving on.

### Phase 0 — Prep — ✅ COMPLETE (`0a0c144`, PR #5)
- [x] Create a branch — used `refactoring/phaze-0-and-1` (off `refactoring/type-script-migration`)
- [x] Generate `expo-env.d.ts` (types `process.env.EXPO_PUBLIC_*`) — created at app root
- [x] Add `"typecheck": "tsc --noEmit"` to `package.json` scripts
- [x] Record the baseline: `npm run typecheck` → **0 errors**

### Phase 1 — Foundation (types + utils) — ✅ COMPLETE (`177187b`, PR #5)
- [x] Create `types/api.ts` — backend-verified domain model (`OrderStatus`, `WashService`, `WasherProfile`, `UserProfile`, `OrderResponse`/`Booking`, `NearbyWasherResponse`/`Washer`, `NotificationRead`, request bodies, `AuthContextType`)
- [x] `git mv constants/UserRole.js constants/UserRole.ts` → `as const` + derived `UserRole` union type
- [x] `git mv app/utils/helpers.js app/utils/helpers.ts` → typed `formatTime` / `formatDateTime` / `formatDistance` (guard fixed to `km == null`)
- [x] `git mv util/fireBaseConfig.jsx util/fireBaseConfig.ts` (no JSX — plain `.ts`; `@ts-expect-error` on `getReactNativePersistence`)
- [x] `npm run typecheck` clean → committed

### Phase 2 — Context — ✅ COMPLETE (`a318e17`, PR #6 merged) — see `TYPESCRIPT_PHASE_2.md`
- [x] `git mv app/Context/AuthContext.jsx app/Context/AuthContext.tsx`
- [x] `createContext<AuthContextType | undefined>(undefined)`; type `AuthProvider` children (`PropsWithChildren`)
- [x] `import { type User } from 'firebase/auth'`; typed `fetchProfile(firebaseUser: User)`, `useState<User | null>` / `useState<UserProfileRead | null>`
- [x] Narrowed `catch (err)` (unknown under strict) + cast `response.json() as UserProfileRead`
- [x] `npm run typecheck` clean → **committed & merged** (`a318e17`, PR #6)

### Phase 3 — Leaf components — ✅ COMPLETE (`36a65ec`, PR #8 merged) — see `TYPESCRIPT_PHASE_3.md`
- [x] `app/Components/Booking/LoadingState.tsx` (no props)
- [x] `app/Components/Booking/ErrorState.tsx` — `{ onRetry: () => void }`
- [x] `app/Components/Booking/ConfirmButton.tsx` — `{ onConfirm: () => void; disabled?: boolean; loading?: boolean }`
- [x] `app/Components/Booking/DatePicker.tsx` — `{ selectedDate: string; onSelectDate: (iso: string) => void }`
- [x] `app/Components/Booking/ServiceCard.tsx` — `{ service: WashService; isSelected: boolean; onSelect: (s: WashService) => void }`
- [x] `app/Components/Booking/ServiceCards.tsx` — `{ services?: WashService[] | null; selectedService: WashService | null; onSelectService: (s: WashService) => void }`
- [x] `app/Components/Booking/TimeSlotGrid.tsx` — props + **user null-guard** (typed `useAuth` from Phase 2) + `useState<string[]>` + json cast
- [x] `app/Components/Booking/TimeSlotPicker.tsx` — `{ availableTimes: string[]; selectedTime: string | null; onSelectTime: (t: string) => void; loading: boolean; selectedDate: string }`
- [x] `app/Components/TabButton.tsx` — props + `router.replace(route as Href)` (typedRoutes flagged the dynamic string)
- [x] `app/Components/MapCard.tsx` — `{ item: Washer }` — `router.push` **left unchanged** (template literal already matched a typed `Href` pattern)
- [x] `app/Components/ServiceFormModal.tsx` — props + inline `FieldProps` (+ `ReactNode`) + `catch (e)` narrow
- [x] `npm run typecheck` clean → **committed & merged** (`36a65ec`, PR #8)

### Phase 4 — Screens & layouts — ✅ COMPLETE (`06d9d6b`, PR #9 merged) — see `TYPESCRIPT_PHASE_4.md`
- [x] `app/_layout.tsx` (rename only)
- [x] `app/index.tsx` — `roleRedirectMap: Partial<Record<UserRole, Href>>` + role guard
- [x] `app/(auth)/_layout.tsx` — same
- [x] `app/(auth)/Login.tsx` — `Formik<LoginValues>`; `authErrorMessages: Record<string, string>`; `FirebaseError` narrow; `onPress={() => handleSubmit()}`
- [x] `app/(auth)/SignUp.tsx` — `Formik<SignUpValues>`; `onPress={() => handleSubmit()}`
- [x] `app/(main)/_layout.tsx` — rename (allTabs/tabBar inferred)
- [x] `app/(main)/Bookings.tsx` — `useState<Booking[]>`; user-guard; `body: BookingStatusUpdate`
- [x] `app/(main)/BookingPage.tsx` — `useLocalSearchParams<{ washerId: string }>()`; typed state; user-guards; `catch` narrow
- [x] `app/(main)/MapPage.tsx` — `useRef<MapView>`, `useRef<FlatList<Washer>>`, `ViewToken[]`, `Washer[]`
- [x] `app/(main)/WasherDetails.tsx` — inline `InfoRow`; guards; `user={user!}`
- [x] `app/(main)/History.tsx` — **`statusConfig: Record<OrderStatus, …>` (fixed `confirmed`→`in_progress`)**
- [x] `app/(main)/Notifications.tsx` — **`useState<NotificationRead[]>`; `body` not `message`; dropped `is_read` UI**
- [x] `app/(main)/ProfilePage.tsx` — `roleLabels: Record<UserRole, string>`; inline `InfoRow`/`ActionRow`
- [x] Regenerated `.expo/types/router.d.ts` (empty→full) so absolute route `Href`s validate — no casts in code
- [x] `npm run typecheck` clean → **committed & merged** (`06d9d6b`, PR #9)

### Phase 5 — Tighten & verify — ✅ CONFIG DONE (`tsc` 0 errors; commit held per user) — see `TYPESCRIPT_PHASE_5.md`
- [x] Remove `"app/index.jsx"` from `tsconfig.json` `include`
- [x] `npm run typecheck` = **0 errors**
- [x] **Build gate:** `npx expo export --platform android` → success (whole app bundles; all imports resolve)
- [ ] `npm run lint` — ⚠️ couldn't run here (native ESLint resolver `.node` needs an MSVC runtime absent in this sandbox; not migration-related); run on your machine
- [x] No stray app `.jsx/.js` (only the 5 root tooling configs remain `.js`)
- [ ] `npx expo start` — smoke-test every flow: login/signup · map + nearby washers · booking (service → date → time → confirm) · washer dashboard accept/reject/complete · service add/edit/delete · history · notifications · profile/logout *(run on your machine)*
- [ ] Confirm no stray app `.jsx/.js` remain (only the 5 tooling configs: `babel/metro/eslint/tailwind.config.js`, `scripts/reset-project.js`)
- [ ] Open PR; consider adding `typecheck` to CI
