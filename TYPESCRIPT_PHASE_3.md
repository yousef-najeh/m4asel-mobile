# TypeScript Migration — Phase 3 (Detailed Guide)

> **Scope:** The 11 **leaf components** under `app/Components/` — rename `.jsx → .tsx` and give
> each a `Props` type. No screen/layout files yet (those are Phase 4).
> **Branch:** `refactoring/phase-3` (off `refactoring/type-script-migration`, which contains
> Phases 0–2).
> **Goal:** Every leaf component is typed, `tsc --noEmit` stays at **0 errors**, app still runs.
> **Companion docs:** `TYPESCRIPT_MIGRATION_ANALYSIS.md`, `TYPESCRIPT_PHASE_0_AND_1.md`,
> `TYPESCRIPT_PHASE_2.md`.
> **Depends on:** `types/api.ts` (Phase 1) for `WashService` / `Washer`; the typed `useAuth`
> (Phase 2) — which is what forces the `user` null-guard in `TimeSlotGrid`.

All paths are relative to the app root `m4asel/`. Under `strict`/`noImplicitAny`, **every
destructured prop is a compile error until typed** — that's the bulk of this phase.

---

## The 11 files

| # | File | Props type | Notes |
|---|---|---|---|
| 1 | `Booking/LoadingState.jsx` | *(none)* | pure presentational, no props |
| 2 | `Booking/ErrorState.jsx` | `{ onRetry: () => void }` | |
| 3 | `Booking/ConfirmButton.jsx` | `{ onConfirm: () => void; disabled?: boolean; loading?: boolean }` | |
| 4 | `Booking/DatePicker.jsx` | `{ selectedDate: string; onSelectDate: (iso: string) => void }` | local `toISO(date: Date)` |
| 5 | `Booking/ServiceCard.jsx` | `{ service: WashService; isSelected: boolean; onSelect: (s: WashService) => void }` | |
| 6 | `Booking/ServiceCards.jsx` | `{ services?: WashService[] \| null; selectedService: WashService \| null; onSelectService: (s: WashService) => void }` | |
| 7 | `Booking/TimeSlotPicker.jsx` | `{ availableTimes: string[]; selectedTime: string \| null; onSelectTime: (t: string) => void; loading: boolean; selectedDate: string }` | |
| 8 | `Booking/TimeSlotGrid.jsx` | `{ washerId: string; serviceId: number; date: string; selectedTime: string \| null; onSelectTime: (t: string) => void }` | **user null-guard**, `useState<string[]>`, cast `json() as string[]` |
| 9 | `TabButton.jsx` | `{ route: string; currentRoute: string; iconName: string; iconType?: string; label: string }` | `router.replace` href friction |
| 10 | `MapCard.jsx` | `{ item: Washer }` | `getAdjustedTime(iso?: string\|null)`, `router.push` object form |
| 11 | `ServiceFormModal.jsx` | `{ visible: boolean; service: WashService \| null; washerId?: number; user: User; onClose: () => void; onSaved: () => void }` | inline `Field` type, `catch (e)` narrow |

> **No importer edits.** Every parent imports these extensionlessly (`import ServiceCard from "./ServiceCard"`,
> `import MapCard from '../Components/MapCard'`, …), so `.jsx → .tsx` resolves automatically. The
> parent screens stay `.jsx` (Phase 4) and won't error now.

---

## Order of work

Convert leaves that have **no children of their own first**, so each import is already typed when
the next one consumes it:

`ServiceCard` → `ServiceCards` (imports ServiceCard); `TimeSlotPicker`/`TimeSlotGrid` independent;
the rest independent. Practically: do all 11 in one pass, then typecheck once.

---

## Per-component changes

For every file: `git mv X.jsx X.tsx`, add the `Props` type, annotate the component signature.
**`StyleSheet.create({…})` needs no annotation** (fully inferred) — that's most of the line count.

### 1. `LoadingState.tsx`
No props. Just the rename; signature stays `export default function LoadingState() {`.

### 2. `ErrorState.tsx`
```ts
interface ErrorStateProps {
  onRetry: () => void;
}
function ErrorState({ onRetry }: ErrorStateProps) { … }
```

### 3. `ConfirmButton.tsx`
```ts
interface ConfirmButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  loading?: boolean;
}
export default function ConfirmButton({ onConfirm, disabled, loading }: ConfirmButtonProps) { … }
```

### 4. `DatePicker.tsx`
```ts
interface DatePickerProps {
  selectedDate: string;
  onSelectDate: (iso: string) => void;
}
const toISO = (date: Date) => date.toISOString().split('T')[0];
export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) { … }
```

### 5. `ServiceCard.tsx`
```ts
import type { WashService } from '@/types/api';

interface ServiceCardProps {
  service: WashService;
  isSelected: boolean;
  onSelect: (service: WashService) => void;
}
export default function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) { … }
```

### 6. `ServiceCards.tsx`
```ts
import type { WashService } from '@/types/api';

interface ServiceCardsProps {
  services?: WashService[] | null;
  selectedService: WashService | null;
  onSelectService: (service: WashService) => void;
}
function ServiceCards({ services, selectedService, onSelectService }: ServiceCardsProps) { … }
```
- `services?.map((service) => …)` and `key={service.id}` stay as-is — `WashService.id` is
  `number | null | undefined`, which is a valid React `key`.

### 7. `TimeSlotPicker.tsx`
```ts
interface TimeSlotPickerProps {
  availableTimes: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  loading: boolean;
  selectedDate: string;
}
function TimeSlotPicker({ availableTimes, selectedTime, onSelectTime, loading, selectedDate }: TimeSlotPickerProps) { … }
```

### 8. `TimeSlotGrid.tsx`  ⚠️ the interesting one
```ts
interface TimeSlotGridProps {
  washerId: string;
  serviceId: number;
  date: string;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}
export default function TimeSlotGrid({ washerId, serviceId, date, selectedTime, onSelectTime }: TimeSlotGridProps) {
  const { user } = useAuth();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  …
  const fetchAvailableTimes = async () => {
    if (!user) return;                     // ← NEW guard: useAuth().user is `User | null` now
    try {
      setLoading(true);
      const token = await user.getIdToken();
      …
      const data = (await response.json()) as string[];   // ← cast the boundary
      setAvailableTimes(data || []);
    } …
  };
}
```
- **Why the guard:** Phase 2 typed `useAuth()`, so `user` is `User | null`. Calling
  `user.getIdToken()` without narrowing is a "possibly null" error. `if (!user) return;` is the
  minimal fix (the effect only runs when authenticated anyway).
- `useState([])` → `useState<string[]>([])` so `availableTimes` isn't `never[]`.

### 9. `TabButton.tsx`
```ts
interface TabButtonProps {
  route: string;
  currentRoute: string;
  iconName: string;
  iconType?: string;
  label: string;
}
export default function TabButton({ route, currentRoute, iconName, iconType = "material", label }: TabButtonProps) { … }
```
- **`router.replace(route)` friction:** with `experiments.typedRoutes`, `router.replace` expects a
  typed `Href`, not a bare `string`. If `tsc` flags it, import `type { Href } from 'expo-router'`
  and cast at the call: `router.replace(route as Href)`. `route.split('/').pop()` needs `route`
  to stay `string`, so keep the prop `string` and cast only at the router call. **Only add the cast
  if tsc actually complains** (depends on whether `.expo/types` is generated).

### 10. `MapCard.tsx`
```ts
import type { Washer } from '@/types/api';

interface MapCardProps {
  item: Washer;
}
export default function MapCard({ item }: MapCardProps) {
  …
  const getAdjustedTime = (isoString?: string | null): string => { … };
  …
  // router.push with a query template hits typedRoutes friction — use the object form:
  onPress={() => router.push({ pathname: '/(main)/BookingPage', params: { washerId: String(item.id) } })}
}
```
- The old `router.push(\`/(main)/BookingPage?washerId=${item.id}\`)` is a string href; the object
  form is the type-safe equivalent (same runtime nav). If you'd rather not change it, `as Href`
  also works.

### 11. `ServiceFormModal.tsx`
```ts
import type { User } from 'firebase/auth';
import type { WashService } from '@/types/api';

interface ServiceFormModalProps {
  visible: boolean;
  service: WashService | null;
  washerId?: number;
  user: User;
  onClose: () => void;
  onSaved: () => void;
}
export default function ServiceFormModal({ visible, service, washerId, user, onClose, onSaved }: ServiceFormModalProps) {
  …
  } catch (e) {
    Alert.alert('خطأ', e instanceof Error ? e.message : 'حدث خطأ، حاول مجدداً');  // ← narrow unknown
  } …
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  flex?: boolean;
  required?: boolean;   // ← declared: a <Field required> is passed but the component ignores it
}
const Field = ({ label, children, flex }: FieldProps) => ( … );
```
- **`catch (e)` is `unknown`** under strict → narrow before `e.message` (same pattern as Phase 2).
- **`user` is a non-null prop** here (the parent passes the Firebase user), so `user.getIdToken()`
  needs no guard — unlike `TimeSlotGrid`.
- **The `<Field … required>` on the name field** passes a prop `Field` doesn't use. Declaring
  `required?: boolean` keeps the JSX unchanged and type-clean (alternative: delete the attribute).
- `err` from `response.json().catch(() => ({}))` is `any` — `err.detail` stays fine, no change.

> **Known runtime bug left for later (not a type error):** `body.description = description.trim() || null`
> but the backend requires a non-null string (422 on empty). Out of scope for Phase 3 (pure typing);
> tracked for a fix when the booking/services flow is hardened.

---

## Verify & commit

```bash
npm run typecheck      # expect 0 errors
npx expo start         # optional: booking flow (service → date → time → confirm), map card, service modal
```

```bash
git add app/Components
git commit -m "refactor(ts): phase 3 — type leaf components (11 files) with Props"
```

---

## Consolidated gotchas (Phase 3)

| # | Where | Watch-out | Fix |
|---|---|---|---|
| 1 | all 11 | destructured props are implicit-any under strict | add a `Props` interface each |
| 2 | `TimeSlotGrid` | `useAuth().user` is `User \| null` (Phase 2) → `user.getIdToken()` errors | `if (!user) return;` guard |
| 3 | `TimeSlotGrid` | `useState([])` infers `never[]` | `useState<string[]>([])` + `json() as string[]` |
| 4 | `ServiceFormModal` | `catch (e)` is `unknown` | `e instanceof Error ? e.message : '…'` |
| 5 | `ServiceFormModal` | `<Field required>` prop not declared | add `required?: boolean` to `FieldProps` |
| 6 | `TabButton` / `MapCard` | `typedRoutes`: string/template href vs `Href` | object-form `router.push`, or `as Href` — only if tsc flags |
| 7 | all renames | — | no import edits (extensionless) |

---

## ✅ Tracking checklist

### Phase 3 — Leaf components — ✅ CODE COMPLETE (typecheck green; commit held per user)
- [x] On branch `refactoring/phase-3`
- [x] `LoadingState.tsx` (no props)
- [x] `ErrorState.tsx` — `{ onRetry }`
- [x] `ConfirmButton.tsx` — `{ onConfirm; disabled?; loading? }`
- [x] `DatePicker.tsx` — `{ selectedDate; onSelectDate }` + `toISO(date: Date)`
- [x] `ServiceCard.tsx` — `{ service: WashService; isSelected; onSelect }`
- [x] `ServiceCards.tsx` — `{ services?; selectedService; onSelectService }`
- [x] `TimeSlotPicker.tsx` — `{ availableTimes; selectedTime; onSelectTime; loading; selectedDate }`
- [x] `TimeSlotGrid.tsx` — props + **user null-guard** + `useState<string[]>` + json cast
- [x] `TabButton.tsx` — props + `router.replace(route as Href)` (typedRoutes flagged the dynamic string)
- [x] `MapCard.tsx` — `{ item: Washer }` + `getAdjustedTime` type — **router.push left unchanged** (template literal already matched a typed `Href` route pattern; no object-form needed)
- [x] `ServiceFormModal.tsx` — props + `FieldProps` (+ `ReactNode` import) + `catch (e)` narrow
- [x] `npm run typecheck` → **0 errors**
- [ ] `npx expo start` → booking flow + service modal still work *(not yet run)*
- [ ] Committed: `refactor(ts): phase 3 — type leaf components …` *(holding — user will commit)*
- [x] **Did NOT edit** any parent `.jsx` screen

### Ready for Phase 4?
- [ ] Phase 3 committed, branch pushed, typecheck green *(typecheck green; commit pending)*
- [ ] Next: screens & layouts `.jsx → .tsx` (see analysis doc, Phase 4)

---

## 📋 Granular change checklist — every symbol in Phase 3

`➕ add` new, `✏️ annotate` existing, `🔁 rename`, `🧠 inferred`, `🔧 fix` (logic change for TS).

**`Booking/LoadingState.tsx`** — [x] 🔁 rename (no props)

**`Booking/ErrorState.tsx`**
- [x] 🔁 rename · [x] ➕ `interface ErrorStateProps { onRetry: () => void }` · [x] ✏️ param typed

**`Booking/ConfirmButton.tsx`**
- [x] 🔁 rename · [x] ➕ `ConfirmButtonProps { onConfirm: () => void; disabled?: boolean; loading?: boolean }` · [x] ✏️ param typed

**`Booking/DatePicker.tsx`**
- [x] 🔁 rename · [x] ➕ `DatePickerProps { selectedDate: string; onSelectDate: (iso: string) => void }` · [x] ✏️ `toISO(date: Date)` · [x] ✏️ param typed · [x] 🧠 `dates`, `d`, `iso`, `isSelected`, `isToday` inferred

**`Booking/ServiceCard.tsx`**
- [x] 🔁 rename · [x] ➕ `import type { WashService }` · [x] ➕ `ServiceCardProps { service: WashService; isSelected: boolean; onSelect: (s: WashService) => void }` · [x] ✏️ param typed

**`Booking/ServiceCards.tsx`**
- [x] 🔁 rename · [x] ➕ `import type { WashService }` · [x] ➕ `ServiceCardsProps { services?: WashService[] | null; selectedService: WashService | null; onSelectService: (s: WashService) => void }` · [x] ✏️ param typed

**`Booking/TimeSlotPicker.tsx`**
- [x] 🔁 rename · [x] ➕ `TimeSlotPickerProps { availableTimes: string[]; selectedTime: string | null; onSelectTime: (t: string) => void; loading: boolean; selectedDate: string }` · [x] ✏️ param typed

**`Booking/TimeSlotGrid.tsx`**
- [x] 🔁 rename · [x] ➕ `TimeSlotGridProps { washerId: string; serviceId: number; date: string; selectedTime: string | null; onSelectTime: (t: string) => void }` · [x] ✏️ param typed
- [x] ✏️ `useState<string[]>([])` (availableTimes) · [x] 🧠 `loading`, `expanded` inferred boolean
- [x] 🔧 `if (!user) return;` guard in `fetchAvailableTimes` · [x] 🔧 `(await response.json()) as string[]`
- [x] 🧠 `visibleTimes`, `hiddenCount`, `isSelected` inferred

**`TabButton.tsx`**
- [x] 🔁 rename · [x] ➕ `TabButtonProps { route: string; currentRoute: string; iconName: string; iconType?: string; label: string }` · [x] ✏️ param typed (`iconType = "material"` default kept) · [x] 🔧 `import { type Href }` + `router.replace(route as Href)` (tsc flagged the dynamic string)

**`MapCard.tsx`**
- [x] 🔁 rename · [x] ➕ `import type { Washer }` · [x] ➕ `MapCardProps { item: Washer }` · [x] ✏️ param typed
- [x] ✏️ `getAdjustedTime(isoString?: string | null): string` · [x] 🧠 `minutesElapsed`, `interval` inferred
- [x] 🧠 `router.push(\`/(main)/BookingPage?washerId=${item.id}\`)` — **unchanged**; the template literal already satisfies the typed `Href` route-with-query pattern

**`ServiceFormModal.tsx`**
- [x] 🔁 rename · [x] ➕ `import type { User } from 'firebase/auth'` · [x] ➕ `import type { WashService }` · [x] ➕ `import { type ReactNode }`
- [x] ➕ `ServiceFormModalProps { visible: boolean; service: WashService | null; washerId?: number; user: User; onClose: () => void; onSaved: () => void }` · [x] ✏️ param typed
- [x] 🧠 state hooks (`name`/`price`/`duration`/`description` strings, `isActive`/`saving` boolean) inferred
- [x] 🔧 `catch (e)` → `e instanceof Error ? e.message : '…'`
- [x] ➕ `FieldProps { label: string; children: ReactNode; flex?: boolean; required?: boolean }` · [x] ✏️ `Field` param typed

---

### Count summary
- **Files:** 11 converted (`.jsx → .tsx`). **0 parent-screen edits.**
- **Props types added:** 10 (`LoadingState` has none) + 1 inline (`FieldProps`)
- **Logic fixes for TS:** `TimeSlotGrid` user-guard + json cast; `ServiceFormModal` catch-narrow; `MapCard` router object-form; (`TabButton` `as Href` if needed)
- **Expected `tsc` result:** 0 errors
