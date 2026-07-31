import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

export const styles = StyleSheet.create({
    list: {
        gap: spacing.sm,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.xs,
    },
    chip: {
        width: 64,
        alignItems: "center",
        gap: 2,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primaryFaint,
        borderRadius: radius.lg,
        paddingVertical: spacing.md,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    dayName: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.primary,
    },
    dayNum: {
        fontSize: fontSize["2xl"],
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    monthName: {
        fontSize: 10,
        fontWeight: fontWeight.medium,
        color: colors.primary,
    },
    textSelected: {
        color: colors.onPrimary,
    },
});
