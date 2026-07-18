# Screen-Based Architecture Migration

Converting `src/` from **feature-based** (`src/features/<feature>/…`) to **screen-based**:
each screen owns its private components/hooks/styles in one folder, and cross-cutting code
(services, api, auth, shared hooks/components, theme) lives in flat top-level folders.

> Routing is unaffected — `app/` stays a thin routing layer; only import paths change.

## What this migration does
- Replaces `src/features/*` with `src/screens/<Screen>/` (one folder per screen).
- Colocates each screen's private components, hooks, and styles inside its folder.
- Consolidates all `*.service.ts` → `src/services/`, the shared React-Query hook →
  `src/hooks/`, and `AuthContext` → `src/context/`.
- Drops the `auth` barrel (`src/features/auth/index.ts`) in favor of direct imports.
- Deletes dead code (`TimeSlotPicker` + its styles — no importers).
- Leaves `app/`, `src/api`, `src/config`, `src/constants`, `src/theme`, `src/providers`,
  `src/utils`, `src/shared/components` in place.

## Target structure
```
src/
  screens/<Screen>/   screen + .styles.ts + components/ + hooks/  (per screen)
  services/           auth · bookings · washers · notifications
  hooks/              useBookings   (shared: WasherBookings + History)
  context/            AuthContext
  api/  shared/components/  theme/  constants/  config/  utils/  providers/
```

### Placement rules
- **Services** → always `src/services/`.
- **Hooks** → colocate with the one screen that uses them; multi-screen (`useBookings`) → `src/hooks/`.
- **Components** → colocate under `<Screen>/components/`; multi-screen (`ErrorState`,
  `LoadingState`, `TabButton`) → `src/shared/components/`.
- **Styles** → beside the file they style.

## Progress — migration complete ✅ (`tsc --noEmit` green after every phase)

### Phase 1 — Shared layers (services, context, shared hook, barrel)
- [x] Move `*.service.ts` → `src/services/`; repoint importers.
- [x] Move `AuthContext.tsx` → `src/context/`.
- [x] Move `useBookings.ts` → `src/hooks/`; repoint importers.
- [x] Delete `src/features/auth/index.ts` barrel; repoint consumers.
- [x] `tsc --noEmit` green.

### Phase 2 — Login, SignUp, Profile screens
- [x] Move screens (+ styles) → `src/screens/{Login,SignUp,Profile}/`; relative style imports.
- [x] Update `app/(auth)/{Login,SignUp}.tsx`, `app/(main)/ProfilePage.tsx`.
- [x] `tsc --noEmit` green.

### Phase 3 — Map, Notifications, WasherDetails
- [x] Map → `src/screens/Map/` (+ `components/MapCard`, `constants.ts`).
- [x] Notifications → `src/screens/Notifications/` (+ `hooks/useNotifications`).
- [x] WasherDetails → `src/screens/WasherDetails/` (+ `components/ServiceFormModal`).
- [x] Update `app/(main)/{MapPage,Notifications,WasherDetails}.tsx`.
- [x] `tsc --noEmit` green.

### Phase 4 — Booking trio
- [x] UserBooking → `src/screens/UserBooking/` (+ 5 components, hooks: useCreateBooking, useTimeSlots, useWasher).
- [x] Delete dead `TimeSlotPicker` (+ styles).
- [x] WasherBookings → `src/screens/WasherBookings/`; split `useUpdateBookingStatus` into its `hooks/`.
- [x] History → `src/screens/History/`.
- [x] Update `app/(main)/{BookingPage,Bookings,History}.tsx`.
- [x] `tsc --noEmit` green.

### Phase 5 — Cleanup + docs
- [x] Delete empty `src/features/`.
- [x] `grep -r "@/src/features" app src` returns nothing.
- [x] Update `src/README.md`.
- [ ] Full runtime verification on device (both roles) — see below.

## Verification
- Static: `npx tsc --noEmit` after every phase; final grep for `@/src/features` returns nothing.
- Runtime: `npx expo start -c`, then drive customer (Map → book → History) and washer
  (Bookings accept/complete → History → WasherDetails add service) flows, plus auth + notifications + profile.
