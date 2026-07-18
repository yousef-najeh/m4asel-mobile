import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F0F6FF',
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    countBadge: {
        backgroundColor: '#EF4444',
        minWidth: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    countText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#fff',
    },

    // Empty
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        gap: 12,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    // Card
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        gap: 10,
    },
    cardUnread: {
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    unreadDot: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notifIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    notifTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'right',
    },
    notifMessage: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '400',
        textAlign: 'right',
        lineHeight: 22,
    },
});
