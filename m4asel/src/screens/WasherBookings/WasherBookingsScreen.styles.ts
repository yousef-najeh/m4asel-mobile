import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F6FF' },
    container: { flex: 1, backgroundColor: '#F0F6FF' },
    contentContainer: { padding: 16, paddingTop: 20 },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 15, color: '#6B7280', fontWeight: '600' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerIconCircle: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
    headerSub: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginTop: 1 },
    countBadge: {
        backgroundColor: '#007AFF',
        minWidth: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    countText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },

    // Summary
    summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    summaryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
        borderWidth: 1,
    },
    pillPending: { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' },
    pillProgress: { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' },
    summaryText: { fontSize: 12, fontWeight: '700' },

    // Empty
    emptyState: { alignItems: 'center', paddingVertical: 80, gap: 12 },
    emptyIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
    emptyText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },

    // Card
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
    },
    badgePending: { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' },
    badgeProgress: { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' },
    statusText: { fontSize: 12, fontWeight: '700' },
    statusPendingText: { color: '#92400E' },
    statusProgressText: { color: '#1E40AF' },
    bookingId: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },

    // Customer
    customerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    customerAvatar: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customerInfo: { flex: 1, gap: 3 },
    customerName: { fontSize: 16, fontWeight: '800', color: '#111827' },
    customerPhone: { fontSize: 13, color: '#6B7280', fontWeight: '500' },

    divider: { height: 1, backgroundColor: '#F3F4F6' },

    // Service
    serviceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    serviceName: { fontSize: 14, fontWeight: '700', color: '#374151', flex: 1 },
    chips: { flexDirection: 'row', gap: 6 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
    chipGreen: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
    chipPurple: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
    chipText: { fontSize: 11, fontWeight: '700' },

    // Time
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 10 },
    timeText: { fontSize: 13, fontWeight: '600', color: '#374151' },
    timeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginHorizontal: 2 },

    // Actions
    actions: { flexDirection: 'row', gap: 10 },
    acceptBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 12,
        shadowColor: '#007AFF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
    },
    rejectBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, backgroundColor: '#EF4444', paddingVertical: 12, borderRadius: 12,
        shadowColor: '#EF4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
    },
    completeBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, backgroundColor: '#7C3AED', paddingVertical: 12, borderRadius: 12,
        shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
    },
    actionText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

    bottomSpacer: { height: 100 },
});
