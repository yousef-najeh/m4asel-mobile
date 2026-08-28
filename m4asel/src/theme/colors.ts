/**
 * Design tokens — colors, from the "لمعي" (Lam3y) Figma design system.
 * Values are the exact hex/rgba pulled from the design (Login, Bookings/History,
 * Orders frames). Prefer the semantic `colors` export in app code; reach into
 * `palette` only when defining a new semantic token here.
 *
 * NOTE: screens are being migrated to these tokens screen-by-screen; until then
 * some screens still use hardcoded hex.
 */
export const palette = {
  white: "#FFFFFF",
  black: "#000000",

  /** Brand blue. */
  blue: {
    primary: "#2B67E6", // primary buttons, active tab, count badges
    accent: "#2F71FD", // secondary brand blue (from palette)
    focus: "#4782FF", // input focus border / active tab (Login frame)
    tint: "#EEF3FF", // light wash (chips / soft backgrounds)
    faint: "rgba(71,130,255,0.25)", // inactive input border / tab underline
    bg: "#FAFCFF", // app background
  },

  /** Text / ink shades — dark→light neutral ramp. */
  ink: {
    black: "#05070C", // darkest (near-black)
    primary: "#1A1D22", // headings & primary text
    slate: "#292C31", // dark neutral
    strong: "#374151",
    secondary: "#828282", // sub-labels
    tertiary: "#6F767D", // chip text
    muted: "#A1A1A1", // inactive nav labels
    placeholder: "#D4D4D4", // input placeholders, hairline dividers
  },

  /** Surfaces & neutrals. */
  neutral: {
    surface: "#FFFFFF", // cards
    input: "#FFFEFC", // input fields (warm white)
    social: "#ECECEC", // social-login circles
    border: "#DBDBDB", // card / hairline border
    borderStrong: "#D1D5DB",
    chip: "rgba(217,217,217,0.2)", // neutral chip background
    muted: "#F3F4F6",
  },

  /** Status colors (solid = text/border, bg = 10% tint). */
  gold: { solid: "#E3AE28", border: "#D2A124", bg: "rgba(210,161,36,0.1)" }, // جاري / pending
  green: { solid: "#25AB5D", bg: "rgba(37,171,93,0.1)" }, // مكتمل / completed
  red: { solid: "#E62B2E", bg: "rgba(171,37,40,0.1)" }, // ملغي / cancelled / danger
} as const;

export const colors = {
  primary: palette.blue.primary,
  accent: palette.blue.accent,
  accentFocus: palette.blue.focus,
  primaryTint: palette.blue.tint,
  primaryFaint: palette.blue.faint,
  onPrimary: palette.white,

  background: palette.blue.bg,
  surface: palette.neutral.surface,
  surfaceInput: palette.neutral.input,
  surfaceMuted: palette.neutral.muted,
  socialBg: palette.neutral.social,

  border: palette.neutral.border,
  borderStrong: palette.neutral.borderStrong,
  chipBg: palette.neutral.chip,

  textBlack: palette.ink.black,
  text: palette.ink.primary,
  textSlate: palette.ink.slate,
  textStrong: palette.ink.strong,
  textSecondary: palette.ink.secondary,
  textTertiary: palette.ink.tertiary,
  textMuted: palette.ink.muted,
  placeholder: palette.ink.placeholder,

  success: palette.green.solid,
  warning: palette.gold.solid,
  error: palette.red.solid,
  danger: palette.red.solid,

  white: palette.white,
  black: palette.black,

  /** Order-lifecycle status colors (bg / text / border trios). */
  status: {
    pending: { bg: palette.gold.bg, text: palette.gold.solid, border: palette.gold.border },
    in_progress: { bg: palette.gold.bg, text: palette.gold.solid, border: palette.gold.border },
    completed: { bg: palette.green.bg, text: palette.green.solid, border: palette.green.solid },
    cancelled: { bg: palette.red.bg, text: palette.red.solid, border: palette.red.solid },
    info: { bg: palette.blue.tint, text: palette.blue.primary, border: palette.blue.faint },
  },
} as const;
