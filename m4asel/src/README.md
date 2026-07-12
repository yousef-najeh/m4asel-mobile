# `src/` — application code

`app/` (Expo Router) holds **routes only**. All real code lives here in `src/`, organized
**feature-first**. See the repo-root [`CLEAN_ARCHITECTURE_REFACTOR.md`](../../CLEAN_ARCHITECTURE_REFACTOR.md)
and [`docs/architecture.drawio`](../docs/architecture.drawio) for the full plan.

```
src/
├── providers/     app-wide provider composition (SafeArea + QueryClient + Auth + Gluestack)
├── api/           client.ts (token + fetch + errors) · endpoints.ts
├── config/        env.ts · firebase.ts
├── features/      auth · bookings · washers · map · notifications · profile
│                    each: screens/ components/ hooks/ services/
├── shared/        components/ · hooks/  (reused by 2+ features)
├── theme/         colors · spacing · typography  (design tokens)
├── constants/     UserRole · statusConfig · roleRedirectMap · authErrorMessages
├── types/         api.ts  (domain types)
└── utils/         helpers.ts
```

**Dependency direction (one way, downward):**
`screen → hook (React Query) → service → api/client → backend`.

**Placement rule:** feature-specific → keep it in the feature; used by 2+ features → lift it to
`src/shared`, `src/theme`, or `src/constants`.

> Folders are created as each migration phase needs them. During the migration, cross-cutting
> `src/` modules are imported as `@/src/...`; the alias is flipped to a bare `@/...` in the final
> cleanup phase.
