import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Icon } from 'react-native-elements';
import { formatDistance, formatTime } from '@/src/utils/helpers';
import type { Washer } from '@/types/api';
import { styles } from "../styles/MapCard.styles";

const MINUTE_MS = 60000;

interface MapCardProps {
    item: Washer;
}

export default function MapCard({ item }: MapCardProps) {
    const [minutesElapsed, setMinutesElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setMinutesElapsed(p => p + 1), MINUTE_MS);
        return () => clearInterval(interval);
    }, []);

    const getAdjustedTime = (isoString?: string | null): string => {
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
