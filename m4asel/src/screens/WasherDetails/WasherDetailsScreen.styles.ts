import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F6FF' },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F6FF' },

    // Empty
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
    emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', textAlign: 'center' },
    emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },

    // Navbar
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        paddingBottom: 8,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    navTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },

    // Hero
    hero: { alignItems: 'center', paddingVertical: 24, gap: 10 },
    heroIconCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#007AFF', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    },
    businessName: { fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center' },
    openBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#ECFDF5', borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 5,
        borderWidth: 1, borderColor: '#A7F3D0',
    },
    openDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#059669' },
    openBadgeText: { fontSize: 13, fontWeight: '700', color: '#065F46' },

    // Cards
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16,
        marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    },
    cardTitle: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textAlign: 'right', marginBottom: 8 },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 8 },
    countPill: {
        backgroundColor: '#007AFF', borderRadius: 10,
        paddingHorizontal: 8, paddingVertical: 2,
    },
    countPillText: { fontSize: 12, fontWeight: '800', color: '#fff' },

    // Rows
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    rowLabel: { fontSize: 14, color: '#374151', fontWeight: '600' },
    rowValue: { fontSize: 14, color: '#6B7280', fontWeight: '500', flex: 1, textAlign: 'left' },

    // Hours (summary card — edit buttons on top, open/close display below)
    hoursEditRow: {
        flexDirection: 'row', gap: 10,
        marginTop: 4, marginBottom: 8,
    },
    hoursRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F9FAFB', borderRadius: 14,
        padding: 16, marginTop: 4,
    },
    hourBlock: { flex: 1, alignItems: 'center', gap: 6 },
    hoursDivider: { width: 1, height: 44, backgroundColor: '#E5E7EB', marginHorizontal: 8 },
    hourLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
    hourValue: { fontSize: 17, fontWeight: '800' },
    editHint: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 4, flex: 1,
        borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 6,
        borderWidth: 1,
    },
    editHintText: { fontSize: 13, fontWeight: '700' },

    // Services
    noServices: { alignItems: 'center', paddingVertical: 20, gap: 8 },
    noServicesText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
    serviceCard: { paddingVertical: 14 },
    serviceCardBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    serviceCardInactive: { opacity: 0.5 },
    serviceTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    serviceInfo: { flex: 1, alignItems: 'flex-end', gap: 6 },
    serviceNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
    serviceName: { fontSize: 15, fontWeight: '700', color: '#111827', textAlign: 'right' },
    serviceNameInactive: { color: '#9CA3AF' },
    inactiveBadge: {
        backgroundColor: '#FEF2F2', borderRadius: 6,
        paddingHorizontal: 7, paddingVertical: 2,
        borderWidth: 1, borderColor: '#FECACA',
    },
    inactiveBadgeText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
    serviceChips: { flexDirection: 'row', gap: 6 },
    serviceActions: { flexDirection: 'row', gap: 6 },
    actionBtn: {
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: '#F9FAFB',
        borderWidth: 1, borderColor: '#E5E7EB',
        justifyContent: 'center', alignItems: 'center',
    },
    addServiceBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#EFF6FF', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: '#BFDBFE',
    },
    addServiceText: { fontSize: 13, fontWeight: '700', color: '#007AFF' },
    chipGreen: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#ECFDF5', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 4,
        borderWidth: 1, borderColor: '#A7F3D0',
    },
    chipPurple: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#F5F3FF', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 4,
        borderWidth: 1, borderColor: '#DDD6FE',
    },
    chipText: { fontSize: 12, fontWeight: '700' },

});
