import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

export const styles = StyleSheet.create({
    // Visual card only — width/margins are supplied per screen via the `style` prop.
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        gap: spacing.sm,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
    },

    // Top row — bookmark (left) + name/subtitle (right)
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    bookmarkBtn: {
        justifyContent: "center",
        alignItems: "center",
    },
    titleCol: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    cardTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        textAlign: "right",
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
        textAlign: "right",
        marginTop: 2,
    },

    // Rating stars
    starsRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 2,
    },

    // Price (left) + distance/arrival (right)
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    priceBlock: {
        alignItems: "flex-start",
    },
    priceLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    priceValue: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.success,
    },
    metaCol: {
        alignItems: "flex-end",
        gap: spacing.xs,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
    metaText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        color: colors.primary,
    },

    // Book button
    bookBtn: {
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        paddingVertical: spacing.md,
        marginTop: spacing.xs,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookBtnText: {
        color: colors.onPrimary,
        fontSize: fontSize.base,
        fontWeight: fontWeight.bold,
    },
});
