/**
 * Design tokens — colors. Derived from the hex literals actually used across
 * the screens today, deduplicated into a scale + semantic names.
 *
 * Prefer the semantic `colors` export in app code; reach into `palette` only
 * when defining a new semantic token here.
 */
export const palette = {
  white: "#FFFFFF",
  black: "#000000",

  blue: {
    primary: "#007AFF", // iOS system blue — the app's primary
    tint: "#F0F6FF", // very light primary wash (buttons/cards)
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    700: "#1D4ED8",
    800: "#1E40AF",
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    700: "#374151",
    900: "#111827",
  },
  red: { 50: "#FEF2F2", 200: "#FECACA", 500: "#EF4444", 600: "#DC2626", 800: "#991B1B", ios: "#FF3B30" },
  green: { 50: "#ECFDF5", 200: "#A7F3D0", 600: "#059669", 800: "#065F46" },
  amber: { 50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FCD34D", 800: "#92400E" },
  violet: { 50: "#F5F3FF", 200: "#DDD6FE", 600: "#7C3AED" },
} as const;

export const colors = {
  primary: palette.blue.primary,
  primaryTint: palette.blue.tint,
  onPrimary: palette.white,

  background: palette.gray[50],
  surface: palette.white,
  surfaceMuted: palette.gray[100],

  border: palette.gray[200],
  borderStrong: palette.gray[300],

  text: palette.gray[900],
  textStrong: palette.gray[700],
  textSecondary: palette.gray[500],
  textMuted: palette.gray[400],

  success: palette.green[600],
  error: palette.red[500],
  danger: palette.red[600],
  warning: palette.amber[800],
  accent: palette.violet[600],

  white: palette.white,
  black: palette.black,

  /** Order-lifecycle status colors (bg / text / border trios). */
  status: {
    pending: { bg: palette.amber[50], text: palette.amber[800], border: palette.amber[200] },
    in_progress: { bg: palette.blue[50], text: palette.blue[700], border: palette.blue[200] },
    completed: { bg: palette.green[50], text: palette.green[800], border: palette.green[200] },
    cancelled: { bg: palette.red[50], text: palette.red[800], border: palette.red[200] },
  },
} as const;
