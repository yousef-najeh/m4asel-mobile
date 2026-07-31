import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

export const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    spacer: { flex: 1 },
    textCol: {
        alignItems: "flex-end",
    },
    name: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.bold,
        color: colors.text,
        textAlign: "right",
    },
    address: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        textAlign: "right",
        marginTop: 2,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: radius.full,
    },
});
