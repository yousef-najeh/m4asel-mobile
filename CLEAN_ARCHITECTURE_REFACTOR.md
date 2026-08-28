# Clean Architecture Refactor — m4asel-mobile

A phased plan to restructure the frontend (`m4asel/`) for **maximum separation of concerns,
readability, scalability, and flexibility**, executed as small reviewable PRs so the app keeps
booting at every step. This follows the same phased style as the completed TypeScript migration.

> Diagram: see [`m4asel/docs/architecture.drawio`](m4asel/docs/architecture.drawio)
> (open with the draw.io / diagrams.net app or the VS Code "Draw.io Integration" extension).

---

## Why

The TypeScript migration made the code typed and strict, but the structure is still tangled:

- **Everything lives under `app/`.** Expo Router treats every file in `app/` as a route, so
  components, context, and utils sit next to real screens — which is why `AuthContext` needs a
  fake `export default` to silence a route warning, and folder naming is inconsistent
  (`app/Components`, `app/Context`, `util` vs `app/utils`).
- **Duplicated data logic.** The `fetch + getIdToken() + Bearer header + response.ok + json() as T`
  block is copy-pasted across ~10 files.
- **God components.** Screens are 300–450 lines mixing data-fetching + business logic + JSX + a
  large `StyleSheet` block.
- **Hardcoded design values.** `#007AFF` and status/role color maps are re-declared per screen.
- **Leftover debug** logs the auth token in `AuthContext`.

## Decisions

| Area | Choice | Why |
|---|---|---|
| **Structure** | **Feature-first** — `src/features/<domain>/` | Each domain self-contained; scales as features grow |
| **Data layer** | **React Query + one API client + per-feature services** | Kills fetch boilerplate; adds caching / dedup / auto-refetch |
| **Styling** | **Central theme tokens** (`src/theme`), keep `StyleSheet` | Removes scattered hex; incremental, low regression risk |

## Core principle

`app/` = **routing only** (thin re-export files). `src/` = **all real code.**

```
Route (app/) → Screen (UI) → Hook (React Query) → Service (endpoint + types) → api/client (token + fetch + errors) → Backend / Firebase
```

Dependencies flow **one direction, downward.** A screen never talks to `fetch` directly; it uses a
hook, which uses a service, which uses the single API client.

## Granularity — the unit is the FEATURE, not the screen

One folder per **domain**; that folder can hold **multiple screens** which **share** its
components/hooks/services. Today's 3 booking screens collapse into one feature:

```
src/features/bookings/
├── screens/     BookingsScreen  HistoryScreen  BookingPageScreen
├── components/  ServiceCard  TimeSlotGrid  DatePicker
├── hooks/       useBookings  useCreateBooking
├── services/    bookings.service.ts
└── constants.ts (only if bookings-specific)
```

**Placement rule:** feature-specific → keep in the feature; used by 2+ features → lift to
`src/shared`, `src/theme`, or `src/constants`.

## Target structure

```
m4asel/
├── app/                     ← ROUTES ONLY (each ~3 lines, re-export a feature screen)
│   ├── _layout.tsx          → mounts src/app/providers.tsx
│   ├── index.tsx
│   ├── (auth)/  Login.tsx  SignUp.tsx
│   └── (main)/  Bookings.tsx  History.tsx  MapPage.tsx  …
└── src/
    ├── providers/           ← SafeArea + QueryClient + Auth + Gluestack composition
    ├── api/                 client.ts (token+fetch+errors)  endpoints.ts
    ├── config/              env.ts  firebase.ts
    ├── features/            auth/  bookings/  washers/  map/  notifications/  profile/
    ├── shared/              components/  hooks/
    ├── theme/               colors.ts  spacing.ts  typography.ts  index.ts
    ├── constants/           UserRole.ts  statusConfig.ts  roleRedirectMap.ts  authErrorMessages.ts
    ├── types/               api.ts   (kept as-is)
    └── utils/               helpers.ts
```

## Phases (one PR each, named by phase)

| Phase | Scope |
|---|---|
| **0** | Add React Query; create `src/providers/` (SafeArea + QueryClient + Auth + Gluestack) and make `app/_layout.tsx` a thin shell over it; add `src/README.md`. No behavior change. *(Alias flip deferred — see note.)* |
| **1** | Foundation: `src/config/{env,firebase}.ts`, `src/api/client.ts` (+ remove token log), `src/api/endpoints.ts`. |
| **2** | Theme tokens + shared constants (`statusConfig`, `roleRedirectMap`, `authErrorMessages`, `UserRole`). |
| **3** | Auth feature: context → `src/features/auth`, `auth.service.ts`, move Login/SignUp screens, thin route re-exports. |
| **4** | Bookings feature: service + React Query hooks; move Bookings/History/BookingPage + Booking components. |
| **5** | Washers + Map features (also fixes `ServiceFormModal` `description || null` 422). |
| **6** | Notifications + Profile features. |
| **7** | ✅ Deleted dead create-expo-app template files (`constants/theme.ts`, all of `hooks/`, and the unused `components/{themed-*,parallax-scroll-view,hello-wave,external-link,haptic-tab,ui/collapsible,ui/icon-symbol*,ui/image}`) — kept `components/ui/button` + `components/ui/gluestack-ui-provider` (still used). Verified: `tsc --noEmit` **0 errors** + `expo export` bundles clean. |

> **Alias note (kept `@/*` → `./*`):** the alias was intentionally **not** flipped to `./src/*`.
> Root-level `assets/` (referenced by `app.json` for icon/splash and via `require('@/assets/…')`),
> `global.css`, and the `components/ui/{button,gluestack-ui-provider}` template are all still imported
> as `@/…`; flipping the root would break them for a purely cosmetic gain. New `src/` code therefore
> imports as `@/src/…`, which is clean and unambiguous. Flipping later is an **optional** follow-up
> (move `assets`/`global.css` handling first).

### Repeatable screen-migration pattern (Phases 3–6)
1. Create `src/features/<f>/screens/<X>Screen.tsx` (moved UI, now using a hook + theme tokens).
2. Extract data into `services/<f>.service.ts` + `hooks/use<X>.ts`.
3. Replace the route file with `export { default } from '@/features/<f>/screens/<X>Screen';`.
4. `npm run typecheck` green; smoke-test the screen.

## Verification

- `cd m4asel && npm run typecheck` → 0 errors (gate every phase) · `npm run lint`.
- `npx expo start` and smoke-test the touched flow each phase.
- After Phase 1: `fetch(` / `getIdToken` appear **only** in `src/api` + `src/config`.
- After Phase 2: no raw `#007AFF` literals in migrated screens.
- No new runtime dependency beyond `@tanstack/react-query`.
