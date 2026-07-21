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
        paddingBottom: 120, // keep last card clear of the fixed footer
    },
    sectionLabel: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textStrong,
        textAlign: "right",
        marginBottom: spacing.lg,
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
