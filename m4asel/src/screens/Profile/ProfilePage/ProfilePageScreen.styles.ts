import { StyleSheet } from "react-native";
import { colors, palette, radius, spacing } from "@/src/theme";

// Measurements come from the "Account Settings Screen" Figma frame (node 258:3822),
// which is 440px wide with 400px-wide cards — i.e. 20px side margins.
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 15,
    color: colors.textTertiary,
    fontWeight: "500",
  },

  // ── Header: avatar sits at the right under forceRTL, name/role to its left ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing["3xl"],
    paddingBottom: spacing["2xl"],
    gap: spacing.lg,
  },
  avatarCircle: {
    width: 71,
    height: 71,
    borderRadius: 71 / 2,
    backgroundColor: colors.socialBg,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  headerTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 26,
    fontWeight: "500",
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: "right",
  },
  roleText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
    textAlign: "right",
  },

  // ── Pending-approval banner ──
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 59,
    backgroundColor: palette.gold.bg,
    borderRadius: radius["2xl"],
    borderWidth: 2,
    borderColor: colors.warning,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
    marginBottom: spacing["2xl"],
  },
  warningText: {
    flex: 1,
    fontSize: 15,
    color: colors.warning,
    fontWeight: "500",
    textAlign: "right",
  },

  // ── Cards ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    marginBottom: spacing["2xl"],
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textTertiary,
    textAlign: "right",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },

  // ── Info rows (no dividers in the design) ──
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  rowLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  rowValue: {
    flex: 1,
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: "600",
    textAlign: "left",
  },

  // ── Action rows ──
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 38,
    borderRadius: 19,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  actionRowFirst: {
    backgroundColor: colors.chipBg,
  },
  actionRowLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    textAlign: "right",
  },

  // ── Logout ──
  logoutBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    backgroundColor: palette.red.bg,
    borderRadius: radius["2xl"],
    borderWidth: 2.5,
    borderColor: colors.danger,
    marginTop: spacing.sm,
  },
  logoutText: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.danger,
  },

  // ── Washer banner (not in this Figma frame; kept for washer roles) ──
  washerBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    marginBottom: spacing["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
  },
  washerBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  washerBannerInfo: {
    flex: 1,
    gap: 2,
    alignItems: "flex-end",
    marginRight: spacing.md,
  },
  washerBannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  washerBannerSub: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: "500",
  },
});
