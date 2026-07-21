# Figma ↔ Codebase Design System Rules

Reference doc for translating Figma designs into code (or code into Figma) for the
`m4asel` Expo/React Native app. Read this before implementing any Figma design in
this repo.

## 1. Stack

- **Framework**: Expo (~54) + `expo-router` (file-based routing) + React Native 0.81 + React 19.
- **Language**: TypeScript everywhere (`.tsx`/`.ts`).
- **RTL**: The app is Arabic-first and force-RTL. `app/index.tsx` calls
  `I18nManager.allowRTL(true)` / `forceRTL(true)`. Any layout translated from Figma
  must be checked in RTL — mirror `flex-direction: row` content, left/right icon
  placement, and text alignment accordingly. Don't hardcode `left`/`right` — prefer
  `start`/`end` semantics or verify mirrored behavior explicitly.
- Two styling systems coexist in this repo (see §6) — know which one a screen uses
  before editing it.

## 2. Token Definitions

There are **two parallel token systems**. They are not yet unified — check which one
a given screen already uses before adding new tokens.

### A. `src/theme/` — the actively-used token set for `src/screens/**`
Plain TypeScript objects, no CSS variables, no Tailwind involvement.

- `src/theme/colors.ts` — `palette` (raw hex swatches per hue) → `colors` (semantic
  names: `primary`, `background`, `surface`, `text`, `textSecondary`, `border`,
  `success`, `error`, `warning`, `accent`, plus a `status` map for booking-lifecycle
  badges: `pending` / `in_progress` / `completed` / `cancelled`, each `{ bg, text, border }`).
- `src/theme/spacing.ts` — `spacing` scale (`xs..4xl`, 4–40px) and `radius` scale
  (`sm..full`).
- `src/theme/typography.ts` — `fontSize` (`xs..3xl`, 12–30px) and `fontWeight`
  (`regular..bold`, string values for RN `TextStyle`).
- `src/theme/index.ts` re-exports everything plus a `theme` aggregate object.

**Rule**: when a Figma frame maps to a screen under `src/screens/**`, resolve colors,
spacing, and type sizes against these tables first. Only add a new hex/size to
`palette`/`spacing`/`fontSize` if no existing token is within visual tolerance —
don't invent a sibling token for a value one shade off from an existing one.

Reality check: most existing screen code still hardcodes hex strings and raw numbers
in `StyleSheet.create` (see §6) rather than importing from `src/theme`. Treat
`src/theme` as the target to migrate toward, not a fully-adopted convention — new
code should import from it; don't assume every file already does.

### B. Gluestack/NativeWind CSS variables — for `components/ui/**` only
- `components/ui/gluestack-ui-provider/config.ts` defines `light`/`dark` NativeWind
  `vars()` maps: `--color-{primary,secondary,tertiary,error,success,warning,info,
  typography,outline,background,indicator}-{0..950}` as `"R G B"` triplets.
- `tailwind.config.js` maps those CSS vars into Tailwind color classes
  (`bg-primary-500`, `text-typography-700`, etc.) via `rgb(var(--color-x-y)/<alpha-value>)`,
  plus custom `boxShadow` tokens (`shadow-soft-1..4`, `shadow-hard-1..4`) and a
  `2xs` (10px) font size.
- This is the (mostly unused) gluestack-ui scaffold — only `components/ui/button`
  currently exists. It is **not** wired into `src/screens/**` yet (zero `className`
  usage found there). Don't route new screen work through it unless you're
  deliberately expanding the gluestack component set.

## 3. Component Library

- **`components/ui/`** — gluestack-ui primitives, one subfolder per component
  (currently only `button/`, plus the provider). Built with `createButton` from
  `@gluestack-ui/core`, styled via `tva` (tailwind-variants) with `action` /
  `variant` / `size` variant props, no Storybook.
- **`src/shared/components/`** — small cross-screen RN components using plain
  `StyleSheet.create`: `TabButton.tsx`, `ErrorState.tsx`, `LoadingState.tsx`.
- **Screen-local components** — `src/screens/<Screen>/components/*.tsx`, colocated
  with the screen that owns them (e.g. `src/screens/UserBooking/components/ServiceCard.tsx`,
  `TimeSlotGrid.tsx`; `src/screens/WasherDetails/components/ServiceFormModal.tsx`).
- No Storybook or component documentation exists. Judge a component's visual
  contract by reading its `.styles.ts` sibling.

## 4. Project Structure

Screen-based (not feature-based) organization under `src/`:

```
src/
  screens/<ScreenName>/
    <ScreenName>Screen.tsx
    <ScreenName>Screen.styles.ts   # StyleSheet.create, colocated 1:1 with the screen
    components/                    # screen-local sub-components (+ .styles.ts siblings)
    hooks/                         # screen-local hooks
  shared/components/                # cross-screen presentational components
  theme/                            # design tokens (see §2A)
  api/ config/ constants/ context/ hooks/ providers/ services/ utils/
app/                                # expo-router routes (thin, delegate to src/screens)
components/ui/                     # gluestack-ui primitives (see §2B, §3)
assets/images/                     # static image assets
```

When implementing a new Figma screen: create `src/screens/<Name>/` with a
`<Name>Screen.tsx` + `<Name>Screen.styles.ts` pair, matching this convention rather
than introducing feature-based folders.

## 5. Icon System

- **Primary icon set in `src/screens/**`**: `react-native-elements`'s `<Icon>`
  component, e.g. `<Icon name="local-car-wash" type="material" size={26} color="#9CA3AF" />`.
  `type` selects the underlying icon font (`material`, `material-community`, etc.,
  matching `@expo/vector-icons` font families under the hood). `iconName`/`iconType`
  props are threaded through shared components like `TabButton`.
- **`components/ui/button`** uses gluestack's `PrimitiveIcon`/`UIIcon` creator
  pattern instead — only relevant inside `components/ui/**`.
- No custom SVG icon set or `assets/icons/` directory exists — icons are font-glyph
  based (Material Icons name strings), not asset files. When a Figma icon doesn't
  have an obvious Material Icons equivalent, flag it rather than importing a raw SVG,
  since that would introduce a second icon system.

## 6. Styling Approach

Two coexisting methodologies — **use whichever one the file you're editing already uses**:

1. **`StyleSheet.create` + colocated `.styles.ts`** — the dominant pattern across
   `src/screens/**` and `src/shared/components/**`. Colors/sizes are largely
   hardcoded hex/number literals today (e.g. `"#007AFF"`, `fontSize: 11`) rather than
   importing `src/theme`; prefer importing from `src/theme` in new/edited code even
   where neighboring code doesn't.
2. **NativeWind (`className`) + Tailwind + `tva` variants** — confined to
   `components/ui/**` (gluestack scaffold). `global.css` is just the three
   `@tailwind` directives; `tailwind.config.js` extends `content` to scan `src/**`
   too, but nothing there currently uses `className`.

There is no separate responsive-breakpoint system — this is a native mobile app
(no web breakpoints in play for `src/screens/**`); NativeWind/Tailwind responsive
utilities would only matter inside `components/ui/**` on web builds.

## 7. Asset Management

- Images live under `assets/images/` (flat, no subfolders): logo/brand assets
  (`facebook-logo-2.png`, `google-logo.png`, `icon.png`, `favicon.png`), plus one
  content image (`user-profile.webp`). Referenced via static `require()`/import,
  not a CDN — Expo's asset pipeline (Metro bundler) handles bundling.
- No image-optimization tooling is configured beyond Expo/Metro defaults and
  `expo-image` (already a dependency) for runtime loading/caching.
- When pulling new images from Figma (`download_assets`/`export_video`), save them
  into `assets/images/` and reference with a relative `require()`, matching existing
  usage — don't introduce a new assets directory or a remote asset host.

## 8. Practical checklist when implementing a Figma design here

1. Identify the target screen folder under `src/screens/` (or note that a new one
   is needed) and read its existing `.styles.ts` to see current token usage.
2. Resolve every color/spacing/font value against `src/theme/{colors,spacing,typography}.ts`
   first; only fall back to a raw literal if genuinely no token fits, and prefer
   adding the token over hardcoding if it'll recur.
3. Match icons to `react-native-elements`/Material Icons names; don't add new icon
   font packages or raw SVGs.
4. Build with `StyleSheet.create` in a colocated `<Screen>.styles.ts`, not `className`,
   unless you are specifically extending `components/ui/**`.
5. Sanity-check the layout under RTL (force-RTL is always on).
6. Place new screen-local sub-components in `src/screens/<Screen>/components/`.
