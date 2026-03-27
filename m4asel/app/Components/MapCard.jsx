import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Icon } from 'react-native-elements';
import { formatDistance, formatTime } from '../utils/helpers';

const { width: WINDOW_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = WINDOW_WIDTH * 0.82;
const MINUTE_MS = 60000;


export default function MapCard({ item }) {
    const [minutesElapsed, setMinutesElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setMinutesElapsed(p => p + 1), MINUTE_MS);
        return () => clearInterval(interval);
    }, []);

    const getAdjustedTime = (isoString) => {
        if (!isoString) return "غير متاح";
        try {
            const t = new Date(isoString);
            t.setMinutes(t.getMinutes() + minutesElapsed);
            return formatTime(t.toISOString());
        } catch { return "غير متاح"; }
    };

    const arrivalTime = getAdjustedTime(item.arrival_time);
    const availableTime = getAdjustedTime(item.next_available_time);
    const distance = formatDistance(item.distance_km);

    return (
        <View style={styles.card}>

            {/* ── Top: name + distance ── */}
            <View style={styles.topRow}>
                <View style={styles.distanceBadge}>
                    <Icon name="location-on" type="material" size={12} color="#007AFF" />
                    {distance && <Text style={styles.distanceText}>{distance}</Text>}
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.display_name}</Text>
            </View>

            {/* ── Address ── */}
            {item.address && (
                <View style={styles.addressRow}>
                    <Icon name="place" type="material" size={14} color="#9CA3AF" />
                    <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                </View>
            )}

            {/* ── Arrival + Available time ── */}
            <View style={styles.timeBanner}>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>متاح من</Text>
                    <Text style={styles.timeValue}>{availableTime}</Text>
                </View>
                <View style={styles.timeDivider} />
                <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>يصل في</Text>
                    <Text style={[styles.timeValue, styles.timeValueAccent]}>{arrivalTime}</Text>
                </View>
                <View style={styles.timeIconCircle}>
                    <Icon name="schedule" type="material" size={20} color="#007AFF" />
                </View>
            </View>

            {/* ── Services ── */}
            {Array.isArray(item.services) && item.services.length > 0 && (
                <View style={styles.chipsRow}>
                    {item.services.map((s, i) => (
                        <View key={i} style={styles.chip}>
                            <Text style={styles.chipText}>{s}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* ── Book button ── */}
            <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => router.push(`/(main)/BookingPage?washerId=${item.id}`)}
                activeOpacity={0.85}
            >
                <Icon name="arrow-left" type="font-awesome" size={13} color="#fff" />
                <Text style={styles.bookBtnText}>احجز الآن</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
