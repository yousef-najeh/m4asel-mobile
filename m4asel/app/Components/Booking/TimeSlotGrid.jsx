import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

function TimeSlotGrid({ washerId, serviceId, date, selectedTime, onSelectTime }) {
    const { user } = useAuth();
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (washerId && serviceId && date) {
            fetchAvailableTimes();
        }
    }, [washerId, serviceId, date]);

    const fetchAvailableTimes = async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(
                `${apiUrl}/washers/${washerId}/services/${serviceId}/available-times?date=${date}`,
                {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch times: ${response.status}`);
            }
            
            const data = await response.json();
            setAvailableTimes(data || []);
        } catch (error) {
            console.error('Error fetching available times:', error);
            setAvailableTimes([]);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (isoString) => {
        try {
            const dateObj = new Date(isoString);
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        } catch (e) {
            return isoString;
        }
    };

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
            <Text style={styles.dateLabel}>التاريخ: {date}</Text>
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

const styles = StyleSheet.create({
    dateLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 12,
        textAlign: "center",
    },
    timesLoading: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingVertical: 32,
    },
    timesLoadingText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "600",
    },
    noTimes: {
        alignItems: "center",
        paddingVertical: 40,
        gap: 12,
    },
    noTimesText: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
    },
    timesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
    },
    timeSlot: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#E5E7EB",
        width: 110,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    timeSlotSelected: {
        backgroundColor: "#007AFF",
        borderColor: "#007AFF",
    },
    iconContainer: {
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    timeText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#374151",
    },
    timeTextSelected: {
        color: "#FFFFFF",
    },
});

export default TimeSlotGrid;
