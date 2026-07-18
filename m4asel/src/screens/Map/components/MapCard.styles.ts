import { StyleSheet } from "react-native";
import { CARD_WIDTH } from "../constants";

export const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
        gap: 10,
    },

    // Top
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
        flex: 1,
        textAlign: 'right',
        marginLeft: 8,
    },
    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 3,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    distanceText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#007AFF',
    },

    // Address
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    addressText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },

    // Time banner
    timeBanner: {
        backgroundColor: '#F0F6FF',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    timeIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    timeBlock: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
    },
    timeDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#BFDBFE',
        marginHorizontal: 8,
    },
    timeLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
    },
    timeValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#374151',
    },
    timeValueAccent: {
        color: '#007AFF',
    },

    // Services
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'flex-end',
    },
    chip: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },

    // Book button
    bookBtn: {
        backgroundColor: '#007AFF',
        borderRadius: 14,
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
