import { 
    Text,
    Dimensions,
    StyleSheet,
    Pressable,
    View,
    TouchableOpacity
} from "react-native";
import { router } from 'expo-router';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';

const { width: WINDOW_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = WINDOW_WIDTH * 0.8;

const MINUTE_MS_IN_MS = 60000;

const formatTime = (isoString) => {
    if (!isoString) return "غير متاح";
    try {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    } catch (e) {
        return "غير متاح";
    }
};

// Helper function to format distance
const formatDistance = (distanceKm) => {
    if (distanceKm === 0 || !distanceKm) return "0";
    if (distanceKm < 1) {
        return (distanceKm * 1000).toFixed(0) + " م";
    }
    return distanceKm.toFixed(1) + " كم";
};

function MapCard({item}) {
    const [minutesElapsed, setMinutesElapsed] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setMinutesElapsed(prev => prev + 1);
        }, MINUTE_MS_IN_MS);
        return () => clearInterval(interval);
    }, []);
    
    // Add elapsed minutes to next available time
    const getNextAvailableTime = () => {
        if (!item.next_available_time) return "غير متاح";
        try {
            const nextTime = new Date(item.next_available_time);
            nextTime.setMinutes(nextTime.getMinutes() + minutesElapsed);
            return formatTime(nextTime.toISOString());
        } catch (e) {
            return "غير متاح";
        }
    };
    const getNextArrivalTime = () => {
        if (!item.arrival_time) return "غير متاح";
        try {
            const arrivalTime = new Date(item.arrival_time);
            arrivalTime.setMinutes(arrivalTime.getMinutes() + minutesElapsed);
            return formatTime(arrivalTime.toISOString());
        } catch (e) {
            return "غير متاح";
        }
    };
    
    const nextAvailableTime = getNextAvailableTime();
    const arrivalTime = getNextArrivalTime();
    const distance = formatDistance(item.distance_km);

    return ( 
        <Pressable 
            style={styles.card}
            onPress={() => router.push('/Login')}
        >
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.titleSection}>
                    <Text style={styles.cardTitle}>{item.display_name}</Text>
                    <View style={styles.distanceBadge}>
                        <Icon
                            name="location-on"
                            type="material"
                            color="#007AFF"
                            size={12}
                        />
                        <Text style={styles.distanceText}>{distance}</Text>
                    </View>
                </View>
            </View>

            {/* Address Section */}
            <View style={styles.infoRow}>
                <Icon
                    name="map-marker"
                    type="font-awesome"
                    color="#8E8E93"
                    size={14}
                />
                <Text style={styles.infoText} numberOfLines={2}>{item.address}</Text>
            </View>

            {/* Time Section - Primary Focus on Arrival */}
            <View style={styles.timeSection}>
                <View style={styles.primaryTimeRow}>
                    <View style={styles.primaryTimeContent}>
                        <Text style={styles.primaryTimeLabel}>يصل في</Text>
                        <Text style={styles.primaryTimeValue}>{arrivalTime}</Text>
                    </View>
                    <View style={styles.timeIcon}>
                        <Icon
                            name="schedule"
                            type="material"
                            color="#FFFFFF"
                            size={24}
                        />
                    </View>
                </View>
                {item.next_available_time && (
                    <View style={styles.secondaryTimeInfo}>
                        <Icon
                            name="info"
                            type="material"
                            color="#FFFFFF"
                            size={12}
                        />
                        <Text style={styles.secondaryTimeText}>
                            متاح من {nextAvailableTime} • {distance} بعيد
                        </Text>
                    </View>
                )}
            </View>

            {/* Services Section */}
            {Array.isArray(item.services) && item.services.length > 0 && (
                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>الخدمات المتوفرة</Text>
                    <View style={styles.servicesContainer}>
                        {item.services.map((service, index) => (
                            <View key={index} style={styles.serviceChip}>
                                <Text style={styles.serviceText}>{service}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Book Button */}
            <TouchableOpacity
                style={styles.bookButton}
                onPress={() => router.push(`/(main)/BookingPage?washerId=${item.id}`)}
                activeOpacity={0.8}
            >
                <Text style={styles.bookButtonText}>احجز الآن</Text>
                <Icon
                    name="arrow-left"
                    type="font-awesome"
                    color="#FFFFFF"
                    size={14}
                />
            </TouchableOpacity>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    header: {
        marginBottom: 10,
    },
    titleSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1D1D1F",
        flex: 1,
        textAlign: "right",
        marginRight: 6,
    },
    distanceBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F7FF",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 3,
    },
    distanceText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#007AFF",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
        gap: 6,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: "#8E8E93",
        textAlign: "right",
        lineHeight: 20,
    },
    timeSection: {
        backgroundColor: "#007AFF",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    primaryTimeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    primaryTimeContent: {
        flex: 1,
    },
    primaryTimeLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.85)",
        marginBottom: 2,
        textAlign: "right",
    },
    primaryTimeValue: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "right",
        letterSpacing: 0.5,
    },
    timeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    secondaryTimeInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.2)",
    },
    secondaryTimeText: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "right",
        flex: 1,
    },
    servicesSection: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1D1D1F",
        marginBottom: 8,
        textAlign: "right",
    },
    servicesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "flex-end",
    },
    serviceChip: {
        backgroundColor: "#F0F0F0",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
    },
    serviceText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#1D1D1F",
    },
    bookButton: {
        backgroundColor: "#34C759",
        paddingVertical: 14,
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        shadowColor: "#34C759",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});

export default MapCard