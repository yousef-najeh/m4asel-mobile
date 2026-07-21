import { StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

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
        paddingBottom: spacing.xl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
    },
    loadingText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },

    // Header — title + blue count badge (Figma 347:3493)
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: spacing.md,
        paddingTop: spacing["3xl"],
        paddingBottom: spacing["2xl"],
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    countBadge: {
        backgroundColor: colors.primary,
        minWidth: 28,
        borderRadius: radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 9,
        paddingVertical: 5,
    },
    countText: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.semibold,
        color: colors.onPrimary,
    },

    // Empty
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        gap: spacing.md,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceMuted,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    emptyTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textStrong,
    },
    emptySubtitle: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
        fontWeight: fontWeight.medium,
    },
});
