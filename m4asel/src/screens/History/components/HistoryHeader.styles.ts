import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 21,
        fontWeight: '700',
        color: '#1A1D22',
        textAlign: 'right',
    },
    countBadge: {
        backgroundColor: '#2B67E6',
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    countText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});
