import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { useTimeSlots } from '../hooks/useTimeSlots';
import { formatTime } from '@/src/utils/helpers';
import { styles } from "./TimeSlotGrid.styles";

const INITIAL_SHOW = 9;

interface TimeSlotGridProps {
    washerId: string;
    serviceId: number;
    date: string;
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
}

export default function TimeSlotGrid({ washerId, serviceId, date, selectedTime, onSelectTime }: TimeSlotGridProps) {
    const { data, isLoading: loading } = useTimeSlots(washerId, serviceId, date);
    const availableTimes = data ?? [];
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setExpanded(false);
    }, [date, serviceId]);

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
