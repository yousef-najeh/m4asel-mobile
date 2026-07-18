# `src/` — application code

`app/` (Expo Router) holds **routes only** (thin re-export shims). All real code lives here in
`src/`, organized **screen-first**: each screen owns its private components/hooks/styles, and
cross-cutting code lives in flat top-level folders. See
[`docs/SCREEN_BASED_ARCHITECTURE.md`](../docs/SCREEN_BASED_ARCHITECTURE.md).

```
src/
├── screens/       one folder per screen: <Screen>.tsx + <Screen>.styles.ts, plus
│                  components/ and hooks/ when private to that screen
│                    Login · SignUp · Profile · Map · Notifications · WasherDetails
│                    UserBooking · WasherBookings · History
├── services/      API/data layer — auth · bookings · washers · notifications
├── hooks/         cross-screen hooks (useBookings)
├── context/       AuthContext  (useAuth / AuthProvider)
├── api/           client.ts (token + fetch + errors) · endpoints.ts
├── providers/     app-wide provider composition (SafeArea + QueryClient + Auth + Gluestack)
├── config/        env.ts · firebase.ts
├── shared/        components/  (reused by 2+ screens: ErrorState, LoadingState, TabButton)
├── theme/         colors · spacing · typography  (design tokens)
├── constants/     UserRole · roleRedirectMap
└── utils/         helpers.ts
```

**Dependency direction (one way, downward):**
`screen → hook (React Query) → service → api/client → backend`.

**Placement rules:**
- Services always live in `src/services/`.
- A hook/component used by **one** screen lives in that screen's folder; used by **2+** screens →
  lift it to `src/hooks`, `src/shared/components`, `src/theme`, or `src/constants`.
- Styles sit next to the file they style (`X.styles.ts` beside `X.tsx`).
