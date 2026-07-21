# Figma redesign — application checklist

Applying the **"لمعي" (Lam3y)** design → the app, screen by screen.
Source: Figma `puox99nw3vtn1sphMM8LO5`, section **final app** → *Customer Flow Screens* (`228:184`) + *Washers Flow Screens* (`228:187`).

The app already tracks this design closely (blue, RTL, cards), so most work is **tightening to match + new details** (rounded corners, font, social login, tabs, verified badge, star ratings, filters, bookmarks).

## Design tokens (extracted from Login `244:439` — refine per screen)
| Token | Value | Use |
|---|---|---|
| `primary` | `#2B67E6` | primary buttons |
| `accent` | `#4782FF` | active tab, input focus border, links, icons |
| `primaryTint` | `rgba(71,130,255,0.25)` | inactive borders / underlines |
| `background` | `#FAFCFF` | screen background |
| `surface` | `#FFFEFC` | inputs / cards |
| `text` | `#1A1D22` | primary text |
| `placeholder` | `#D4D4D4` | placeholders / dividers |
| `socialBg` | `#ECECEC` | social-login circles |
| radius | **24** (buttons/inputs), pill for chips | note: current app uses ~12–18 |
| status | green = completed/تم · red = cancel/logout · amber = in-progress | order cards |
| font | **Mayson Arabic** (Light/Regular/Medium) | ⚠️ see open decision |

## Per-screen workflow (repeat for each)
1. `get_design_context` on the frame → exact colors/spacing/type + asset URLs.
2. `download_assets` for icons/logos/images the screen needs → `assets/`.
3. Rebuild the screen's `*.styles.ts` (+ tweak the `.tsx`) with RN, reusing existing components, mapping colors to `src/theme`, mirroring for RTL.
4. `get_screenshot` the frame, run the app, compare, iterate.

---

## Foundation (do first — every screen depends on it)
- [x] **Colors** — `src/theme/colors.ts` set to the Lam3y palette (primary `#2B67E6`, accent `#4782FF`, bg `#FAFCFF`, neutrals, gold/green/red status trios). Non-breaking: no screen imports the theme yet. ✅
- [ ] **Spacing / radius** — add `24` radius + taller field/button heights to `src/theme/spacing.ts`.
- [ ] **Font** — Tajawal via `expo-font` (swap-ready), weights in `src/theme/typography.ts`.
- [ ] Optional primitives (`PrimaryButton`, `TextField`) in `src/shared/components`.

## Customer flow screens
- [x] **Auth (Login + Sign up)** — `src/screens/Auth` — Figma `244:439` / `244:1149`. **Unified into one screen**: fixed logo + tab bar, and the form body swaps on tab tap via local state (no page navigation). `AuthScreen` + `components/LoginForm` + `components/SignUpForm`; `app/(auth)/{Login,SignUp}.tsx` both render `<AuthScreen initialTab=... />`. *(font: system for now; forgot-password non-functional; login first field kept as email)*
- [ ] **Map / search** — `src/screens/Map` (+ `components/MapCard`) — `253:2687`
- [x] **Booking – Service select** — `src/screens/UserBooking/BookingServiceScreen` — `258:4262` ✅
- [x] **Booking – Time & date select** — `src/screens/UserBooking/BookingTimeScreen` — `258:4155` ✅
- [ ] **History (customer)** — `src/screens/History` — `248:362`
- [ ] **Account settings (customer)** — `src/screens/Profile` — `258:3822`

## Washer flow screens
- [ ] **Orders (طلبات العمل)** — `src/screens/WasherBookings` — `277:4604`
- [ ] **History (washer / سجل الطلبات)** — `src/screens/History` (washer branch) — `297:2997`
- [ ] **Washer profile + service/hours modals** — `src/screens/WasherDetails` (+ `components/ServiceFormModal`) — `277:5728` (add-service / edit-hours variants)
- [x] **Notifications** — `src/screens/Notifications` — `277:5513` ✅

## New screens in the design (not in the app yet — stretch/optional)
- [ ] **Bookmarks / saved washers** — new `src/screens/Bookmarks` — `257:3349`
- [ ] **Map filter (sheet + full)** — overlay on Map — `253:2914`, `253:3146`

---

## Open decision — the font
The design uses **"Mayson Arabic Trial"** (a trial font). Options:
- (A) Add the real font files if you have a license → exact match.
- (B) Approximate with a free geometric Arabic font (**Tajawal** or **Cairo**, Google Fonts) — very close, no licensing issue. *(recommended)*
- (C) Keep the system font for now; apply layout + colors, add the font later.

## Progress log
_(updated as each screen is completed and verified against its Figma frame)_

- **2026-07-21 — Booking split** (`258:4262` + `258:4155`): single `UserBookingScreen` split into two routed pages — `BookingServicePage` (washer header + illustrated service cards) and `BookingTimePage` (date chips + slot-derived time wheel + end-time hint). Params flow via query string (`washerId`, `serviceId`); hooks unchanged. Time wheel snaps only to API-available slots. Old `BookingPage`/`ServiceCards`/`TimeSlotGrid`/`DatePicker` deleted; all styles theme-tokenized. Illustration `assets/images/booking-service.png` (rasterized from Figma SVG export — no metro SVG transformer).
- **2026-07-21 — Notifications** (`277:5513`): new `NotificationCard` component + `notificationVariants` (type derived client-side from title keywords — API sends no type field); car glyph icons exported from Figma to `assets/images/notifications/`; header count badge; styles fully migrated to theme tokens (added `colors.status.info` blue trio). Bold `(…)` spans in body copy. Count badge shows total (no read/unread field in `NotificationRead`).
