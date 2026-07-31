# Plan: Bookmarks (المحفوظات) screen + tab bar wiring

## Context
The Figma design ("Bookmarks Screen", file `puox99nw3vtn1sphMM8LO5`) adds a **saved washers** screen (المحفوظات)
to the regular-user experience. The provided screenshot shows a list of washer cards with an "احجز الآن" (book now)
button, sitting behind a 5th bottom-tab (`المحفوظات`, bookmark icon) inserted between الخريطة (Map) and حجوزاتي (History).

Today the app has **no** bookmarks tab and **no** favorites backend endpoint.
Per the user's decisions:
- The user will **add a backend "savings" endpoint** (e.g. `GET /savings` returning saved washers, plus
  `POST`/`DELETE` to add/remove). The screen consumes that endpoint via a new `savings.service.ts`. Until the
  endpoint exists, the screen can be developed against a small local mock matching the response shape.
- The card **omits** fields the API (`NearbyWasherResponse`) doesn't return: **rating stars, price range, and subtitle**.
  It renders only real fields: name, address, distance, arrival time, plus the book button.
- The **washer** tab bar is unchanged — bookmarking is a regular-user feature. Washers keep their 4 tabs
  (حسابك / الإشعارات / الطلبات / السجل).

Outcome: a regular user gets a المحفوظات tab showing a Figma-matched list of saved washers, each linking to booking.

## Existing patterns to reuse
- **Card visuals**: `src/screens/Map/components/MapCard.tsx` + `MapCard.styles.ts` — same white rounded card,
  distance badge, arrival/time row, and the exact `احجز الآن` blue button that routes to
  `/(main)/BookingServicePage?washerId=...`. The new card is a trimmed variant of this.
- **Screen scaffold**: `src/screens/Notifications/NotificationsScreen.tsx` + `.styles.ts` — `SafeAreaView` + `ScrollView`,
  the header with title + blue **count badge** (matches the "5 المحفوظات" header in the screenshot), and the
  empty-state block. Copy this structure.
- **Theme tokens**: `@/src/theme` (`colors`, `spacing`, `radius`, `fontSize`, `fontWeight`). Use these, not raw hex.
- **Data shape**: `NearbyWasherResponse` in `types/api.ts` (fields: `id`, `display_name`, `address`, `distance_km`,
  `arrival_time`, `next_available_time`, `services`). The savings list response follows this shape.
- **Helpers**: `formatDistance`, `formatTime` from `@/src/utils/helpers` (as MapCard uses).
- **Tab**: `src/shared/components/TabButton.tsx` (no change needed — already generic).

## Files to CREATE
1. `m4asel/src/services/savings.service.ts`
   - Mirrors `washers.service.ts` structure. Methods: `list()` → `GET` saved washers (returns
     `NearbyWasherResponse[]` shape), and `add(washerId)` / `remove(washerId)` for the bookmark toggle.
   - Add the paths to `src/api/endpoints.ts` under a new `savings` group once the user confirms the route names.
2. `m4asel/src/screens/Bookmarks/useBookmarks.ts`
   - Data hook wrapping `savings.service.list()` (follow the `useNotifications` hook pattern for loading/refetch).
     Until the endpoint exists, it can return a local mock array shaped like `NearbyWasherResponse`.
3. `m4asel/src/screens/Bookmarks/BookmarksScreen.tsx`
   - `SafeAreaView` + `ScrollView` scaffold copied from NotificationsScreen.
   - Header: title `المحفوظات` + count badge (count = number of bookmarks).
   - Uses `useBookmarks()`, maps each to `<BookmarkCard>`; loading + empty states.
   - Empty state ("لا توجد محفوظات" / "لم تقم بحفظ أي مغسلة بعد") reusing the Notifications empty-state style.
4. `m4asel/src/screens/Bookmarks/BookmarksScreen.styles.ts`
   - Styled from Notifications styles (safe/scroll/content/header/countBadge/empty*).
5. `m4asel/src/screens/Bookmarks/components/BookmarkCard.tsx` (+ `BookmarkCard.styles.ts`)
   - Trimmed MapCard: top row = washer name (right) + a **bookmark toggle icon** (left, `bookmark` material, blue)
     wired to `savings.service.remove(...)`.
   - Address row (place icon) — from `item.address`.
   - Distance badge + arrival-time row — from `formatDistance(distance_km)` / `formatTime(arrival_time)`.
   - `احجز الآن` button → `router.push('/(main)/BookingServicePage?washerId=' + item.id)`.
   - NO stars, NO price range, NO subtitle (omitted per decision).
6. `m4asel/app/(main)/Bookmarks.tsx`
   - Thin route wrapper: `export default function Bookmarks() { return <BookmarksScreen />; }`
     (mirrors `app/(main)/History.tsx`).

## Files to MODIFY
1. `m4asel/app/(main)/_layout.tsx`
   - Add to `allTabs`, inserted **between** the `MapPage` entry and the regularUser `History` entry (keeps visual
     left→right order per the screenshot: حسابك · الإشعارات · الخريطة · المحفوظات · حجوزاتي):
     `{ route: "/(main)/Bookmarks", iconName: "bookmark", label: "المحفوظات", showFor: "regularUser" }`
   - Register the screen so expo-router knows it and it's excluded from the auto tab button list:
     `<Tabs.Screen name="Bookmarks" options={{ tabBarButton: () => null }} />`
   - Washer entries untouched → washer bar stays 4 tabs (verified: `Bookings` + washer `History`).
   - Note: regular users now show **5** tabs. `TabButton` uses `minWidth:70` + `paddingHorizontal:16`; on narrow
     phones 5 items may crowd. If crowding appears at run, reduce `tabContent.paddingHorizontal` (e.g. 16→10) in
     `TabButton.tsx` — call out but only apply if visually needed.

## Out of scope / follow-ups
- The **savings backend endpoint** itself — the user is adding it separately. Frontend wiring assumes a
  `NearbyWasherResponse[]`-shaped list response; confirm exact route names before writing `endpoints.ts`.
- Rating / price / subtitle — require backend fields; omitted until the API provides them.

## Verification
1. Launch the app (Android dev build / AVD `m4asel_pixel` per project setup) as a **regular user**.
2. Confirm a 5th tab المحفوظات (bookmark icon) appears between الخريطة and حجوزاتي; tapping it opens the screen.
3. Confirm the header shows title + count badge, and cards render name/address/distance/arrival + book button,
   with no stars/price/subtitle. Compare against the screenshot and the Figma node.
4. Tap `احجز الآن` on a card → routes to BookingServicePage for that washer id.
5. Log in as a **washer**: confirm the tab bar is unchanged (4 tabs, no المحفوظات).
6. Empty state: empty savings list → confirm the empty-state block renders.
