import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "@/src/theme";

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
        paddingBottom: 120, // keep content clear of the fixed footer
    },
    // Visual order: back circle (left) — title (right)
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: spacing.lg,
        paddingBottom: spacing["3xl"],
    },
    pageTitle: {
        fontSize: fontSize["2xl"],
        fontWeight: fontWeight.bold,
        color: colors.primary,
        textAlign: "right",
    },
    // Visual order: title text (left of icon) — icon at the visual right
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: spacing.sm,
        marginTop: spacing["2xl"],
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.bold,
        color: colors.text,
        textAlign: "right",
    },
    durationHint: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.primary,
        textAlign: "right",
        marginBottom: spacing.lg,
    },
    endTimeHint: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.primary,
        textAlign: "center",
        marginTop: spacing.lg,
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        backgroundColor: colors.background,
    },
});
