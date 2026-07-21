import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: '#DBDBDB',
        paddingHorizontal: 23,
        paddingVertical: 21,
        marginBottom: 23,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    // Left column: status pill, service icon, price, duration
    leftCol: {
        gap: 13,
        alignItems: 'flex-start',
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 14,
        paddingVertical: 4,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    serviceIconWrap: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        position: 'absolute',
        bottom: -2,
        left: -2,
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceDurationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1D22',
    },
    durationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(217,217,217,0.2)',
        borderWidth: 0.5,
        borderColor: '#DBDBDB',
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    durationText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#6F767D',
    },

    // Right column: avatar/name/address, service name, date/time
    rightCol: {
        alignItems: 'flex-end',
        gap: 22,
        flex: 1,
        marginLeft: 12,
    },
    personRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
    },
    avatarCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    personInfo: {
        alignItems: 'flex-end',
        gap: 2,
    },
    personName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1D22',
        textAlign: 'right',
    },
    personAddress: {
        fontSize: 12,
        color: '#828282',
        fontWeight: '500',
        textAlign: 'right',
    },
    detailsCol: {
        alignItems: 'flex-end',
        gap: 12,
    },
    serviceName: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'right',
    },
    dateTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    dateTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateTimeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#828282',
    },
});
