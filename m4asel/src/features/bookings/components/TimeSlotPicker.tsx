import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Icon } from 'react-native-elements';
import { formatTime } from '@/src/utils/helpers';
import { styles } from "../styles/TimeSlotPicker.styles";

interface TimeSlotPickerProps {
    availableTimes: string[];
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
    loading: boolean;
    selectedDate: string;
}

function TimeSlotPicker({
    availableTimes,
    selectedTime,
    onSelectTime,
    loading,
    selectedDate,
}: TimeSlotPickerProps) {

    if (loading) {
        return (
            <View style={styles.timesLoading}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.timesLoadingText}>جارٍ تحميل الأوقات...</Text>
            </View>
        );
    }

    if (availableTimes.length === 0) {
        return (
            <View style={styles.noTimes}>
                <Icon name="event-busy" type="material" size={48} color="#D1D5DB" />
                <Text style={styles.noTimesText}>لا توجد أوقات متاحة لهذا اليوم</Text>
            </View>
        );
    }

    return (
        <>
            <Text style={styles.dateLabel}>التاريخ: {selectedDate}</Text>
            <View style={styles.timesGrid}>
                {availableTimes.map((time, index) => (
                    <Pressable
                        key={index}
                        style={[
                            styles.timeSlot,
                            selectedTime === time && styles.timeSlotSelected
                        ]}
                        onPress={() => onSelectTime(time)}
                    >
                        <Text style={[
                            styles.timeText,
                            selectedTime === time && styles.timeTextSelected
                        ]}>
                            {formatTime(time)}
                        </Text>
                        <View style={styles.iconContainer}>
                            {selectedTime === time && (
                                <Icon name="check" type="material" size={18} color="#FFFFFF" />
                            )}
                        </View>
                    </Pressable>
                ))}
            </View>
        </>
    );
}
export default TimeSlotPicker;
