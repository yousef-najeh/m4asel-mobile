import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

export const ITEM_HEIGHT = 44;
export const VISIBLE_ROWS = 5;

export const styles = StyleSheet.create({
    card: {
        height: ITEM_HEIGHT * VISIBLE_ROWS,
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primaryFaint,
        overflow: "hidden",
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.sm,
        padding: spacing.xl,
    },
    stateText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: "center",
    },

    // Figma 258:4155: hour and minute stacks around a colon, ص/م at the right.
    columnsRow: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing["2xl"],
    },
    column: {
        justifyContent: "center",
    },
    periodColumn: {
        justifyContent: "center",
        marginLeft: spacing.md,
    },
    cell: {
        height: ITEM_HEIGHT,
        minWidth: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    // Selected value gets the Figma underline treatment.
    cellSelected: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    cellText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.medium,
        color: colors.placeholder,
    },
    cellTextSelected: {
        fontSize: fontSize["2xl"],
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    colon: {
        fontSize: fontSize["2xl"],
        fontWeight: fontWeight.bold,
        color: colors.primary,
    },
    scrollOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent",
    },
});
