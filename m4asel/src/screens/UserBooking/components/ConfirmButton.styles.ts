import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

export const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        paddingVertical: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    btnDisabled: {
        backgroundColor: colors.border,
        opacity: 0.7,
        shadowColor: "transparent",
        elevation: 0,
    },
    btnText: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.bold,
        color: colors.onPrimary,
    },
    btnTextDisabled: {
        color: colors.textMuted,
    },
});
