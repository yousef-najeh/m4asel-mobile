import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

/**
 * Default field look — the Lam3y auth style from Figma. Values were lifted
 * verbatim from the old `AuthScreen.styles.ts` so the auth forms render
 * unchanged. Off-scale numbers (58, 2, 13, 6) are design literals with no
 * matching token; everything else uses `@/src/theme`.
 *
 * Any of these can be overridden per call site — see `FieldStyleProps`.
 */
export const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: fontWeight.bold,
    color: colors.textStrong,
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 58,
    borderRadius: radius["2xl"],
    borderWidth: 2,
    borderColor: colors.primaryFaint,
    backgroundColor: colors.surfaceInput,
    paddingHorizontal: spacing.xl,
  },
  rowFocused: {
    borderColor: colors.accentFocus,
  },
  rowError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text,
    textAlign: "right",
    padding: 0,
  },
  /** Hit area for a pressable leading element (e.g. the password toggle). */
  iconBtn: {
    width: spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error,
    textAlign: "right",
    fontWeight: fontWeight.medium,
  },

  /* Multi-line defaults — the row grows instead of holding a fixed height. */
  textareaRow: {
    height: "auto",
    alignItems: "stretch",
    paddingVertical: spacing.md,
  },
  textareaInput: {
    height: 80,
    textAlignVertical: "top",
  },
});
