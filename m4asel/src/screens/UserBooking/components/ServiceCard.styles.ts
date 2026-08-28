import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        borderWidth: 1.5,
        borderColor: colors.surfaceMuted,
        padding: spacing.md,
        marginBottom: spacing.lg,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    cardSelected: {
        backgroundColor: colors.primaryTint,
        borderColor: colors.primary,
    },
    illustration: {
        width: 112,
        height: 63, // matches the 324x182 asset ratio
        resizeMode: "contain",
    },
    textCol: {
        flex: 1,
        alignItems: "flex-end",
        gap: spacing.xs,
    },
    name: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.primary,
        textAlign: "right",
    },
    description: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        textAlign: "right",
    },
    // Visual: select circle (left) — price — duration chip (right)
    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    selectCircle: {
        width: 26,
        height: 26,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceMuted,
        justifyContent: "center",
        alignItems: "center",
    },
    selectCircleSelected: {
        backgroundColor: colors.primary,
    },
    price: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    durationChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
    },
    durationText: {
        fontSize: 10,
        fontWeight: fontWeight.medium,
        color: colors.textTertiary,
    },
});
