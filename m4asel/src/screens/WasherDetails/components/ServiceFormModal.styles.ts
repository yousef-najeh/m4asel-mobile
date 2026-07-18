import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheetWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: 32,
        maxHeight: '90%',
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginTop: 12, marginBottom: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    closeBtn: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center', alignItems: 'center',
    },
    title: { fontSize: 17, fontWeight: '800', color: '#111827' },

    form: { padding: 20, gap: 14 },
    row: { flexDirection: 'row', gap: 12 },
    field: { gap: 6 },
    label: { fontSize: 13, fontWeight: '700', color: '#374151', textAlign: 'right' },
    input: {
        borderWidth: 1.5, borderColor: '#E5E7EB',
        borderRadius: 12, backgroundColor: '#F9FAFB',
        paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 15, color: '#111827',
    },
    textarea: { height: 80, textAlignVertical: 'top' },

    saveBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, backgroundColor: '#007AFF',
        paddingVertical: 14, borderRadius: 14, marginTop: 6,
        shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    saveBtnDisabled: { backgroundColor: '#D1D5DB', shadowColor: 'transparent', elevation: 0 },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    toggleInfo: { flex: 1, gap: 3 },
    toggleLabel: { fontSize: 14, fontWeight: '700', color: '#374151', textAlign: 'right' },
    toggleStatus: { fontSize: 12, fontWeight: '600', textAlign: 'right' },
});
