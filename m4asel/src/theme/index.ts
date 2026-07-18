export { colors, palette } from "./colors";
export { radius, spacing } from "./spacing";
export { fontSize, fontWeight } from "./typography";

import { colors } from "./colors";
import { radius, spacing } from "./spacing";
import { fontSize, fontWeight } from "./typography";

/** Convenience aggregate for `import { theme } from "@/src/theme"`. */
export const theme = { colors, spacing, radius, fontSize, fontWeight } as const;
