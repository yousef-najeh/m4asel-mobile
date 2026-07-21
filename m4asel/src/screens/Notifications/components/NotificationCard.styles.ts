import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

export const styles = StyleSheet.create({
    // Figma: white, radius 24, drop-shadow 0 0 10.7 rgba(0,0,0,0.09)
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius["2xl"],
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.lg,
        gap: spacing.sm,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.09,
        shadowRadius: 10.7,
        elevation: 3,
    },

    // Visual order: dot (left) — title — car icon (right), as in Figma.
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    icon: {
        width: 33,
        height: 33,
        resizeMode: "contain",
    },
    title: {
        flex: 1,
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textBlack,
        textAlign: "right",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: radius.full,
        alignSelf: "flex-start",
    },

    body: {
        fontSize: fontSize.xs,
        color: colors.textTertiary,
        textAlign: "right",
        lineHeight: 19,
    },
    bodyBold: {
        fontWeight: fontWeight.bold,
    },

    // Footer sits at the visual left: clock+time, then calendar+date.
    footerRow: {
        flexDirection: "row",
        alignSelf: "flex-start",
        alignItems: "center",
        gap: spacing.md,
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
    footerText: {
        fontSize: 10,
        fontWeight: fontWeight.medium,
        color: colors.textTertiary,
    },
});
