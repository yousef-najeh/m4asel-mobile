import { StyleSheet } from "react-native";
import { colors } from "@/src/theme";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav: { flex: 1 },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    alignItems: "center",
  },

  /* Header: logo + tabs (fixed — only the form below swaps) */
  header: {
    width: "100%",
    alignItems: "center",
    gap: 52,
    marginBottom: 36,
  },
  logo: {
    width: 152,
    height: 58,
    resizeMode: "contain",
  },
  tabs: {
    flexDirection: "row",
    width: "100%",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 14,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  tabTextActive: {
    color: colors.accentFocus,
  },
  tabUnderline: {
    height: 4,
    width: "100%",
    backgroundColor: colors.primaryFaint,
  },
  tabUnderlineActive: {
    backgroundColor: colors.accentFocus,
  },

  /* Form */
  formBlock: {
    width: "100%",
    gap: 30,
  },
  form: {
    width: "100%",
    gap: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 58,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.primaryFaint,
    backgroundColor: colors.surfaceInput,
    paddingHorizontal: 20,
  },
  inputRowFocused: {
    borderColor: colors.accentFocus,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    textAlign: "right",
    padding: 0,
  },
  iconBtn: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    textAlign: "right",
    fontWeight: "500",
  },
  forgot: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
    textAlign: "right",
    width: "100%",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.status.cancelled.bg,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.status.cancelled.border,
  },
  errorBoxText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: "600",
    textAlign: "right",
  },

  /* Actions */
  actions: {
    width: "100%",
    gap: 16,
  },
  submitBtn: {
    width: "100%",
    height: 64,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.onPrimary,
    fontSize: 20,
    fontWeight: "600",
  },

  /* Divider */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.placeholder,
    borderRadius: 29,
  },
  dividerText: {
    fontSize: 16,
    color: colors.placeholder,
    fontWeight: "500",
  },

  /* Socials */
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  socialBtn: {
    width: 51,
    height: 51,
    borderRadius: 25.5,
    backgroundColor: colors.socialBg,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  /** For assets that already include their own circle (e.g. Apple) — fills the button. */
  socialImgFull: {
    width: 51,
    height: 51,
    resizeMode: "contain",
  },
});
