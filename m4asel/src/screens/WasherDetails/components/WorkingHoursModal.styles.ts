import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheetWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        paddingBottom: 24,
        width: '100%',
        maxWidth: 460,
        maxHeight: '85%',
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

    body: { padding: 20, gap: 16 },
    wheelLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    wheelLabelText: { fontSize: 15, fontWeight: '700' },

    saveBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, backgroundColor: '#007AFF',
        paddingVertical: 14, borderRadius: 14, marginTop: 20,
        shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    saveBtnDisabled: { backgroundColor: '#D1D5DB', shadowColor: 'transparent', elevation: 0 },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});