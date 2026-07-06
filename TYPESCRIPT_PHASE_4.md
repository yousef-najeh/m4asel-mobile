# TypeScript Migration — Phase 4 (Detailed Guide)

> **Scope:** The 13 **screens & layouts** under `app/` — rename `.jsx → .tsx` and type them
> against the domain model + typed `useAuth`. This is the biggest phase and where the two
> surfaced runtime bugs (Notifications, History) become type errors and get fixed.
> **Branch:** `refactoring/phase-4` (off `refactoring/type-script-migration`, Phases 0–3 merged).
> **Goal:** All screens typed, `tsc --noEmit` at **0 errors**, app still runs.
> **Companion docs:** `TYPESCRIPT_MIGRATION_ANALYSIS.md`, `TYPESCRIPT_PHASE_0_AND_1.md`,
> `TYPESCRIPT_PHASE_2.md`, `TYPESCRIPT_PHASE_3.md`.

All paths relative to `m4asel/`. The dominant recurring pattern: **`const { user } = useAuth()`
now yields `User | null` (Phase 2), so every `user.getIdToken()` needs an `if (!user) return;`
guard.** The other recurring one: **indexing a lookup object with `role` (`UserRole | undefined`)
needs a guard or a `Record` type.**

---

## The 13 files

| # | File | Key type work |
|---|---|---|
| 1 | `_layout.jsx` | rename only (no props/user) |
| 2 | `index.jsx` | `roleRedirectMap: Partial<Record<UserRole, Href>>` + role guard |
| 3 | `(auth)/_layout.jsx` | same `roleRedirectMap` pattern |
| 4 | `(main)/_layout.jsx` | rename; `allTabs`/`tabBar` inferred |
| 5 | `(auth)/Login.jsx` | `Formik<LoginValues>`; `authErrorMessages: Record<string,string>`; `FirebaseError` narrow |
| 6 | `(auth)/SignUp.jsx` | `Formik<SignUpValues>` |
| 7 | `(main)/Bookings.jsx` | `useState<Booking[]>`; user-guard; `body: BookingStatusUpdate`; typed `updateStatus`/`handleReject` |
| 8 | `(main)/History.jsx` | `useState<Booking[]>`; user-guard; **`statusConfig: Record<OrderStatus,…>` — fix `confirmed`→`in_progress`** |
| 9 | `(main)/Notifications.jsx` | `useState<NotificationRead[]>`; user-guard; **`message`→`body`; drop `is_read` (no read-state)** |
| 10 | `(main)/BookingPage.jsx` | `useLocalSearchParams<{washerId:string}>`; typed state; user-guards; `catch` narrow |
| 11 | `(main)/MapPage.jsx` | `useRef<MapView>`, `useRef<FlatList<Washer>>`, `ViewToken[]`; typed state |
| 12 | `(main)/WasherDetails.jsx` | inline `InfoRow`; typed `editingService`/handlers; user-guard; `user={user!}` on modal |
| 13 | `(main)/ProfilePage.jsx` | `roleLabels: Record<UserRole,string>` + role guard; inline `InfoRow`/`ActionRow` |

---

## Recurring fixes (apply everywhere they appear)

1. **User null-guard.** In every `fetch*`/`update*` that calls `user.getIdToken()`:
   `if (!user) return;` right after entering the function. Files: `Bookings`, `History`,
   `Notifications`, `BookingPage`, `WasherDetails` (inside the delete handler).
2. **`response.json()` boundary cast.** `const data = (await response.json()) as Booking[]`
   (or `NotificationRead[]`, `WasherProfile`, …). Global `fetch().json()` is `any`, so where the
   code branches on the shape (`MapPage`), leaving it `any` is fine.
3. **Role-indexed lookups.** `map[role]` where `role: UserRole | undefined` → guard
   `(role && map[role]) || fallback`, and type the map (`Record<UserRole, …>` or
   `Partial<Record<UserRole, Href>>`).
4. **`catch (e)` is `unknown`.** Narrow before `.message`/`.code`: `e instanceof Error ? … : …`
   or, for Firebase auth codes, `e instanceof FirebaseError ? e.code : undefined`.

---

## Per-file notes (only the non-mechanical bits)

### 2. `index.tsx` & 3. `(auth)/_layout.tsx`
```ts
import { type Href } from 'expo-router';
const roleRedirectMap: Partial<Record<UserRole, Href>> = {
  [UserRole.WASHER_OWNER]: "/(main)/Bookings",
  [UserRole.WASHER_WORKER]: "/(main)/Bookings",
  [UserRole.CONFIRMED_USER]: "/(main)/MapPage",
  [UserRole.UNCONFIRMED_USER]: "/(main)/MapPage",
};
// role is UserRole | undefined → guard the index access:
const target: Href = (role && roleRedirectMap[role]) || "/(main)/ProfilePage";
return <Redirect href={target} />;
```

### 5. `Login.tsx`
```ts
import { FirebaseError } from 'firebase/app';
import type { FormikHelpers } from 'formik';

interface LoginValues { email: string; password: string }
const authErrorMessages: Record<string, string> = { … };

const handleLogin = async (values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>) => {
  …
  } catch (error) {
    const code = error instanceof FirebaseError ? error.code : undefined;
    setFirebaseError((code && authErrorMessages[code]) || 'حدث خطأ، حاول مجدداً');
  } …
};
// <Formik<LoginValues> initialValues={{ email:'', password:'' }} …>
```

### 6. `SignUp.tsx`
`interface SignUpValues { name: string; email: string; mobile_number: string; password: string }`,
`handleSignUp(values: SignUpValues, { setSubmitting }: FormikHelpers<SignUpValues>)`, `<Formik<SignUpValues> …>`.
`catch (error)` only logs → no narrow needed.

### 7. `Bookings.tsx`
```ts
import type { Booking, OrderStatus, BookingStatusUpdate } from '@/types/api';
const [bookings, setBookings] = useState<Booking[]>([]);
// fetchBookings: if (!user) return; … const data = (await response.json()) as Booking[];
const updateStatus = async (bookingId: number, newStatus: OrderStatus, cancelReason: string | null = null) => {
  if (!user) return;
  const body: BookingStatusUpdate = { status: newStatus };
  if (cancelReason) body.cancel_reason = cancelReason;   // needs the BookingStatusUpdate type
  …
};
const handleReject = (bookingId: number) => { … };
```

### 8. `History.tsx` — **bug fix**
```ts
import type { Booking, OrderStatus } from '@/types/api';
interface StatusConfig { label: string; bg: string; text: string; border: string; icon: string }
const statusConfig: Record<OrderStatus, StatusConfig> = {
  pending:     { … },
  in_progress: { label: "قيد التنفيذ", bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", icon: "autorenew" }, // was `confirmed` (never returned)
  completed:   { … },
  cancelled:   { … },
};
```
Typing `statusConfig` as `Record<OrderStatus,…>` **forces** dropping the bogus `confirmed` key and
adding the real `in_progress` — exactly the History bug from the analysis. `useState<Booking[]>`, user-guard, json cast as before.

### 9. `Notifications.tsx` — **bug fix**
```ts
import type { NotificationRead } from '@/types/api';
const [notifications, setNotifications] = useState<NotificationRead[]>([]);
// fetch: if (!user) return; … const data = (await response.json()) as NotificationRead[];
```
`NotificationRead` has **no `is_read`** and the text field is **`body`**, so typing forces:
- delete `unreadCount` + the count badge, `cardUnread`, and the `unreadDot` (no read-state exists)
- `notification.message` → `notification.body`
- `formatDate`/`formatTime` locals typed `(dateString?: string | null)`

### 10. `BookingPage.tsx`
```ts
import type { WasherProfile, WashService } from '@/types/api';
const { washerId } = useLocalSearchParams<{ washerId: string }>();
const [washerDetails, setWasherDetails] = useState<WasherProfile | null>(null);
const [selectedService, setSelectedService] = useState<WashService | null>(null);
const [selectedTime, setSelectedTime] = useState<string | null>(null);
// fetchWasherDetails / handleConfirmBooking: if (!user) return;
// const data = (await response.json()) as WasherProfile;
const handleServiceSelect = (service: WashService) => setSelectedService(service);
// catch (error): error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الحجز'
// <TimeSlotGrid serviceId={selectedService.id!} …>  // WashService.id is number|null → assert (real services have ids)
```

### 11. `MapPage.tsx`
```ts
import { FlatList, type ViewToken } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { Washer } from '@/types/api';

const mapRef = useRef<MapView>(null);
const flatListRef = useRef<FlatList<Washer>>(null);
const [locations, setLocations] = useState<Washer[]>([]);
const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

const focusOnMarker = (item: Washer) => { … };
const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => { … }).current;
```
`fetch().json()` is `any` here and the code branches on shape (`data.results || data.washers`), so
leave `data` untyped (`any`) — no cast needed.

### 12. `WasherDetails.tsx`
```ts
import type { WashService } from '@/types/api';
const [editingService, setEditingService] = useState<WashService | null>(null);
const openEdit = (s: WashService) => { … };
const handleDelete = (service: WashService) => { … /* onPress async: if (!user) return; */ };
// <ServiceFormModal user={user!} … />   // user is User|null; screen is auth-gated
interface InfoRowProps { icon: string; label: string; value: string; last?: boolean }
const InfoRow = ({ icon, label, value, last }: InfoRowProps) => ( … );
```

### 13. `ProfilePage.tsx`
```ts
const roleLabels: Record<UserRole, string> = { …all 5 roles… };
// <Text>{(role && roleLabels[role]) || "مستخدم"}</Text>
interface InfoRowProps { icon: string; label: string; value: string; last?: boolean }
interface ActionRowProps { icon: string; label: string; onPress: () => void; last?: boolean }
```

---

## Verify & commit

```bash
npm run typecheck      # expect 0 errors
npx expo start         # full smoke: login/signup, map+cards, booking flow, washer dashboard, service modal, history, notifications, profile/logout
```
```bash
git add app
git commit -m "refactor(ts): phase 4 — type screens & layouts (13 files)"
```

---

## Consolidated gotchas (Phase 4)

| # | Where | Watch-out | Fix |
|---|---|---|---|
| 1 | every fetch calling `user.getIdToken()` | `user` is `User \| null` | `if (!user) return;` |
| 2 | `index`, `(auth)/_layout`, `ProfilePage` | `map[role]`, role is `UserRole \| undefined` | `(role && map[role]) \|\| fallback` + `Record`/`Partial<Record>` type |
| 3 | `index`, `(auth)/_layout` | string href vs `Href` | type map values `Href` |
| 4 | `Login` | `Formik` values implicit-any; `catch` unknown `.code` | `Formik<LoginValues>` + `FirebaseError` narrow |
| 5 | `Bookings` | mutating `body.cancel_reason` on inferred `{status}` | type `body: BookingStatusUpdate` |
| 6 | `History` | `statusConfig` keyed `confirmed` (bogus), missing `in_progress` | `Record<OrderStatus,…>` forces the fix |
| 7 | `Notifications` | `is_read`/`message` don't exist on `NotificationRead` | drop unread UI; `body` not `message` |
| 8 | `BookingPage` | `selectedService.id` is `number\|null`; `catch` unknown | `id!`; `error instanceof Error` |
| 9 | `MapPage` | `useRef(null)` untyped; `viewableItems` any | `useRef<MapView>` / `useRef<FlatList<Washer>>`; `ViewToken[]` |
| 10 | `WasherDetails` | modal `user` prop is non-null `User` | `user={user!}` (auth-gated screen) |

---

## ✅ Tracking checklist

### Phase 4 — Screens & layouts — ✅ CODE COMPLETE (typecheck green; commit held per user)
- [x] On branch `refactoring/phase-4`
- [x] `_layout.tsx` (rename only)
- [x] `index.tsx` — `roleRedirectMap` Record + guard
- [x] `(auth)/_layout.tsx` — same
- [x] `(main)/_layout.tsx` (rename; inferred)
- [x] `(auth)/Login.tsx` — `Formik<LoginValues>` + `FirebaseError` narrow + `onPress={() => handleSubmit()}`
- [x] `(auth)/SignUp.tsx` — `Formik<SignUpValues>` + `onPress={() => handleSubmit()}`
- [x] `(main)/Bookings.tsx` — `Booking[]`, user-guard, `BookingStatusUpdate`
- [x] `(main)/History.tsx` — `statusConfig` fix (`confirmed`→`in_progress`)
- [x] `(main)/Notifications.tsx` — `NotificationRead[]`, `body`, dropped `is_read` UI
- [x] `(main)/BookingPage.tsx` — params, typed state, guards, `serviceId={…!}`
- [x] `(main)/MapPage.tsx` — refs, `Washer[]`, `ViewToken[]`
- [x] `(main)/WasherDetails.tsx` — `InfoRow`, guards, `user={user!}`
- [x] `(main)/ProfilePage.tsx` — `roleLabels`, `InfoRow`/`ActionRow`
- [x] `npm run typecheck` → **0 errors**
- [ ] `npx expo start` → all flows work *(not yet run)*
- [ ] Committed: `refactor(ts): phase 4 — type screens & layouts …` *(holding — user will commit)*

### Ready for Phase 5?
- [ ] Phase 4 committed, branch pushed, typecheck green *(typecheck green; commit pending)*
- [ ] Next: Phase 5 — remove `app/index.jsx` from tsconfig include (now `.tsx`), final `tsc`/lint, smoke-test, confirm no stray app `.jsx`

---

## ⚠️ Environment note — typed-routes generation (`.expo/types/router.d.ts`)

Two real fixes vs. the drafted plan, both found by `tsc`:
1. **`onPress={handleSubmit}` → `onPress={() => handleSubmit()}`** in `Login`/`SignUp` — Formik's
   `handleSubmit` is typed for web (`FormEvent`), incompatible with the native `Button` `onPress`
   (`GestureResponderEvent`). Wrapping in an arrow discards the event and type-checks.
2. **Every absolute route literal** (`/(main)/Bookings`, `router.push('/(main)/History')`,
   `MapCard`'s `router.push` template, etc.) reported `TS2322/2345` against `Href` — because the
   local generated `.expo/types/router.d.ts` was the **empty fallback** (816 bytes, zero routes).
   `experiments.typedRoutes` derives `Href` from a file that only exists once a dev server has run
   with the current routes. Fix: run `npx expo start` once (it regenerates `router.d.ts` → ~9 KB
   with the real route union), after which all literals validate **with no code casts**. `.expo/`
   is git-ignored, so nothing about this lands in the repo — the committed code uses plain route
   strings, which are correct on any machine where the dev server has run.

> Takeaway for future route work: if `tsc` suddenly rejects valid `router.push('/…')` paths, it's a
> stale `.expo/types` — regenerate by starting the dev server, don't add `as Href` casts.

---

## 🐞 Bugs fixed in this phase (surfaced by typing)
- **History** — `statusConfig` was keyed on `confirmed` (never returned by the API) and missing
  `in_progress` (which is), so in-progress bookings rendered with pending styling. `Record<OrderStatus,…>`
  forced the correction.
- **Notifications** — read `notification.message` (field is `body` → always blank) and `is_read`
  (no read-state exists in the backend). Typing to `NotificationRead` forced using `body` and
  removing the unread badge/dot logic.

> Still open (not a type error, left for a later hardening pass): `ServiceFormModal` sends
> `description || null` where the backend requires a string; FCM token never registered.
