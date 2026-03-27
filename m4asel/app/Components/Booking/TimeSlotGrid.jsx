import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { formatTime } from '../../utils/helpers';

const INITIAL_SHOW = 9;

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function TimeSlotGrid({ washerId, serviceId, date, selectedTime, onSelectTime }) {
    const { user } = useAuth();
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (washerId && serviceId && date) fetchAvailableTimes();
    }, [washerId, serviceId, date]);

    useEffect(() => {
        setExpanded(false);
    }, [date, serviceId]);

    const fetchAvailableTimes = async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(
                `${apiUrl}/washers/${washerId}/services/${serviceId}/available-times?date=${date}`,
                { method: 'GET', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            if (!response.ok) throw new Error(`Failed: ${response.status}`);
            const data = await response.json();
            setAvailableTimes(data || []);
        } catch (error) {
            console.error('Error fetching times:', error);
            setAvailableTimes([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>جارٍ تحميل الأوقات...</Text>
            </View>
        );
    }

    if (availableTimes.length === 0) {
        return (
            <View style={styles.emptyBox}>
                <View style={styles.emptyIconCircle}>
                    <Icon name="event-busy" type="material" size={28} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyText}>لا توجد أوقات متاحة لهذا اليوم</Text>
            </View>
        );
    }

    const visibleTimes = expanded ? availableTimes : availableTimes.slice(0, INITIAL_SHOW);
    const hiddenCount = availableTimes.length - INITIAL_SHOW;

    return (
        <View>
            <View style={styles.grid}>
                {visibleTimes.map((time, i) => {
                    const isSelected = selectedTime === time;
                    return (
                        <Pressable
                            key={i}
                            style={[styles.slot, isSelected && styles.slotSelected]}
                            onPress={() => onSelectTime(time)}
                        >
                            <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                                {formatTime(time)}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {hiddenCount > 0 && (
                <Pressable style={styles.toggleBtn} onPress={() => setExpanded(e => !e)}>
                    <Text style={styles.toggleText}>
                        {expanded ? 'عرض أقل' : `عرض ${hiddenCount} وقت آخر`}
                    </Text>
                    <Icon
                        name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        type="material"
                        size={18}
                        color="#007AFF"
                    />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 32,
    },
    loadingText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
    emptyBox: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 10,
    },
    emptyIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    slot: {
        width: '31%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    slotText: { fontSize: 14, fontWeight: '700', color: '#374151' },
    slotTextSelected: { color: '#FFFFFF' },
    toggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    toggleText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#007AFF',
    },
});
