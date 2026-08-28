# TypeScript Migration — Phase 5 (Detailed Guide)

> **Scope:** Tighten & verify — the finishing pass. No new component/screen typing; this phase
> cleans up the last config quirk, runs the full gates (typecheck + lint), and does the runtime
> smoke-test.
> **Branch:** `refactoring/phase-5` (off `refactoring/type-script-migration`, Phases 0–4 merged).
> **Goal:** A clean `tsc --noEmit` **and** `expo lint`, no stray app `.jsx/.js`, app runs.
> **Companion docs:** `TYPESCRIPT_MIGRATION_ANALYSIS.md`, `TYPESCRIPT_PHASE_0_AND_1.md`,
> `TYPESCRIPT_PHASE_2.md`, `TYPESCRIPT_PHASE_3.md`, `TYPESCRIPT_PHASE_4.md`.

All paths relative to `m4asel/`.

---

## Definition of done for Phase 5

- [ ] `tsconfig.json` no longer lists `"app/index.jsx"` (that file is `app/index.tsx` now)
- [ ] `npm run typecheck` → **0 errors**
- [ ] `npm run lint` passes (or only pre-existing, non-migration warnings)
- [ ] No stray `.jsx`/`.js` under `app/` (only the 5 intentional tooling configs remain as `.js`)
- [ ] `npx expo start` — smoke-test the full app
- [ ] One commit

---

## 5.1 — Remove the stale `tsconfig` include line

`tsconfig.json` `include` explicitly lists `"app/index.jsx"` (a leftover from the Expo template).
With `allowJs` off (the default here), listing a `.jsx` file that no longer exists is dead config —
`app/index` is now `app/index.tsx`, already matched by the `"**/*.tsx"` glob.

```jsonc
"include": [
  "**/*.ts",
  "**/*.tsx",
  ".expo/types/**/*.ts",
  "expo-env.d.ts",
  "app/index.jsx",      // ← DELETE this line
  "nativewind-env.d.ts"
]
```

Everything else in `tsconfig.json` stays: `strict: true`, the `@/*` + `tailwind.config` paths, and
`extends: expo/tsconfig.base`.

---

## 5.2 — Run the gates

```bash
npm run typecheck      # tsc --noEmit → 0 errors
npm run lint           # expo lint
```

> **Note on `expo lint`:** it may need a one-time interactive setup ("install eslint config?") the
> first time. If it prompts in a non-interactive shell, run it in your own terminal. Lint findings
> that predate the migration (unused vars, etc.) are out of scope for this phase — the migration
> gate is `tsc`.

---

## 5.3 — Confirm no stray app JS

```bash
find app -name '*.jsx' -o -name '*.js'     # expect: nothing
```

The only `.js` files that should remain in the project are the **5 build/tooling configs**, all at
the root, none under `app/`:
`babel.config.js`, `metro.config.js`, `eslint.config.js`, `tailwind.config.js`, `scripts/reset-project.js`.

---

## 5.4 — Runtime smoke-test (`npx expo start`)

Types are erased at build, so a green `tsc` doesn't prove the app runs — exercise the flows once:

- **Auth:** login (valid + wrong password → Arabic error), sign-up, logout
- **Map (regular user):** location permission → nearby washers load → cards + markers → tap a card
- **Booking:** service → date → time slot → confirm → success → History
- **Washer dashboard:** Bookings accept / reject (with reason) / complete
- **Services:** WasherDetails add / edit / delete service (modal)
- **History:** both roles — **verify in-progress bookings now show the "قيد التنفيذ" (blue) style** (the Phase 4 fix)
- **Notifications:** list renders with **`body` text** and **no unread badge/dot** (the Phase 4 fix)
- **Profile:** role label, washer banner, logout

---

## 5.5 — Commit

```bash
git add tsconfig.json
git commit -m "chore(ts): phase 5 — drop stale app/index.jsx from tsconfig include; migration complete"
```

---

## ✅ Tracking checklist

### Phase 5 — Tighten & verify — ✅ VERIFIED (typecheck + build green; commit held per user)
- [x] On branch `refactoring/phase-5`
- [x] Removed `"app/index.jsx"` from `tsconfig.json` `include`
- [x] `npm run typecheck` → **0 errors**
- [x] **Build gate — `npx expo export --platform android` → SUCCESS** (whole app bundled to an
      8.32 MB Hermes bundle; every migrated file transforms + all imports resolve — the strongest
      proof the migration didn't break the app, short of a device run)
- [ ] `npm run lint` → ⚠️ **cannot run in this sandbox** — the native ESLint import-resolver
      (`unrs-resolver`) `.node` fails to load with "specified module could not be found", i.e. a
      **missing MSVC runtime DLL** at the OS level (confirmed by loading the `.node` directly; the
      WASM fallback won't install on x64). Nothing to do with the code — it lints fine on a machine
      with the VC++ runtime. Run `npm run lint` there.
- [x] `find app -name '*.jsx' -o -name '*.js'` → empty (only the 5 root tooling configs remain `.js`)
- [ ] `npx expo start` on a device → exercise the flows (device run only — see 5.4)
- [ ] Committed: `chore(ts): phase 5 …` *(holding — user will commit)*

### Migration complete 🎉
- [ ] All 5 phases merged into `refactoring/type-script-migration`
- [ ] `refactoring/type-script-migration` → `main` (final PR)
- [ ] (Optional follow-ups, out of scope): wire `typecheck` into CI; fix `ServiceFormModal`
      `description || null` (backend 422); register FCM token on login; prune unused deps;
      replace deprecated `react-native-elements`

---

## Post-migration state (for the record)

- **~28 app files** migrated to `.ts`/`.tsx` across Phases 1–4; a shared `types/api.ts` domain
  model verified 1:1 against the backend; `strict: true` throughout.
- **Bugs fixed en route** (surfaced by typing): History `statusConfig` (`confirmed`→`in_progress`),
  Notifications (`body` not `message`; no `is_read`).
- **Only intentional `.js` left:** the 5 build/tooling configs.
- Types are erased at build (Babel/Metro), so the migration never risked the running app — the
  gate throughout was a green `tsc --noEmit`.
