import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

function History() {
    const { user, role } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isWasher = role === 'washer_owner' || role === 'washer_worker';

    // Fetch bookings from API
    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(`${apiUrl}/bookings/`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch bookings: ${response.status}`);
            }
            
            const data = await response.json();
            // Response is an array directly
            setBookings(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBookings();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Format date and time
    const formatDateTime = (isoString) => {
        if (!isoString) return { date: "---", time: "---" };
        try {
            const date = new Date(isoString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const timeStr = `${hours}:${minutes}`;
            
            return { date: dateStr, time: timeStr };
        } catch (_e) {
            return { date: "---", time: "---" };
        }
    };

    // Status config
    const statusConfig = {
        pending: {
            label: "قيد الانتظار",
            bg: "#FEF3C7",
            text: "#92400E",
            border: "#FCD34D",
            icon: "schedule",
        },
        confirmed: {
            label: "مؤكد",
            bg: "#DBEAFE",
            text: "#1E40AF",
            border: "#93C5FD",
            icon: "check-circle",
        },
        completed: {
            label: "مكتمل",
            bg: "#D1FAE5",
            text: "#065F46",
            border: "#6EE7B7",
            icon: "check-circle",
        },
        cancelled: {
            label: "ملغي",
            bg: "#FEE2E2",
            text: "#991B1B",
            border: "#FCA5A5",
            icon: "cancel",
        },
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <Icon name="history" type="material" size={48} color="#D1D5DB" />
                    <Text style={styles.loadingText}>جارٍ التحميل...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Icon name="history" type="material" size={28} color="#111827" />
                        <Text style={styles.headerTitle}>سجل الحجوزات</Text>
                    </View>
                    <View style={styles.bookingCount}>
                        <Text style={styles.bookingCountText}>{bookings.length}</Text>
                    </View>
                </View>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="event-busy" type="material" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>لا توجد حجوزات</Text>
                        <Text style={styles.emptyText}>ليس لديك أي حجوزات حتى الآن</Text>
                    </View>
                ) : (
                    bookings.map((booking) => {
                        const { date, time } = formatDateTime(booking.scheduled_time);
                        const status = statusConfig[booking.status] || statusConfig.pending;
                        
                        // Get appropriate info based on user role
                        const displayName = isWasher 
                            ? booking.user_profile?.name 
                            : booking.wash_service?.washer_profile?.display_name;
                        const displayAddress = isWasher 
                            ? null 
                            : booking.wash_service?.washer_profile?.address;
                        const displayPhone = isWasher 
                            ? booking.user_profile?.mobile_number 
                            : null;
                        const serviceName = booking.wash_service?.name;
                        const servicePrice = booking.wash_service?.price;
                        const serviceDuration = booking.wash_service?.duration_minutes;

                        return (
                            <Pressable key={booking.id} style={styles.bookingCard}>
                                {/* Status Badge */}
                                <View style={[styles.statusBadge, { 
                                    backgroundColor: status.bg, 
                                    borderColor: status.border 
                                }]}>
                                    <Icon 
                                        name={status.icon} 
                                        type="material" 
                                        size={16} 
                                        color={status.text} 
                                    />
                                    <Text style={[styles.statusText, { color: status.text }]}>
                                        {status.label}
                                    </Text>
                                </View>

                                {/* Main Info - Washer or Customer based on role */}
                                <View style={styles.mainSection}>
                                    <Icon 
                                        name={isWasher ? "person" : "store"} 
                                        type="material" 
                                        size={24} 
                                        color="#007AFF" 
                                    />
                                    <View style={styles.mainInfo}>
                                        <Text style={styles.mainName}>{displayName || "غير متوفر"}</Text>
                                        {displayAddress && (
                                            <Text style={styles.subInfo}>{displayAddress}</Text>
                                        )}
                                        {displayPhone && (
                                            <Text style={styles.subInfo}>{displayPhone}</Text>
                                        )}
                                    </View>
                                </View>

                                {/* Service Details */}
                                <View style={styles.serviceSection}>
                                    <View style={styles.infoRow}>
                                        <Icon name="local-car-wash" type="material" size={20} color="#6B7280" />
                                        <Text style={styles.serviceName}>{serviceName || "غير محدد"}</Text>
                                    </View>
                                    
                                    <View style={styles.serviceDetails}>
                                        {servicePrice && (
                                            <View style={styles.detailChip}>
                                                <Icon name="payments" type="material" size={16} color="#059669" />
                                                <Text style={styles.detailText}>{servicePrice} nis</Text>
                                            </View>
                                        )}
                                        {serviceDuration && (
                                            <View style={styles.detailChip}>
                                                <Icon name="timer" type="material" size={16} color="#7C3AED" />
                                                <Text style={styles.detailText}>{serviceDuration} دقيقة</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Scheduled Time */}
                                <View style={styles.timeSection}>
                                    <View style={styles.timeRow}>
                                        <Icon name="event" type="material" size={18} color="#6B7280" />
                                        <View style={styles.timeContent}>
                                            <Text style={styles.timeLabel}>التاريخ:</Text>
                                            <Text style={styles.timeValue}>{date}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.timeRow}>
                                        <Icon name="access-time" type="material" size={18} color="#6B7280" />
                                        <View style={styles.timeContent}>
                                            <Text style={styles.timeLabel}>الوقت:</Text>
                                            <Text style={styles.timeValue}>{time}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Booking ID */}
                                <View style={styles.bookingFooter}>
                                    <Text style={styles.bookingId}>رقم الحجز: #{booking.id}</Text>
                                </View>
                            </Pressable>
                        );
                    })
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    contentContainer: {
        padding: 16,
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: "#E5E7EB",
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111827",
    },
    bookingCount: {
        backgroundColor: "#007AFF",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    bookingCountText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 80,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#374151",
        marginTop: 16,
    },
    emptyText: {
        fontSize: 15,
        color: "#6B7280",
    },
    bookingCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        gap: 14,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 2,
        gap: 6,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "800",
    },
    mainSection: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    mainInfo: {
        flex: 1,
        gap: 4,
    },
    mainName: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
    },
    subInfo: {
        fontSize: 13,
        fontWeight: "500",
        color: "#6B7280",
    },
    serviceSection: {
        gap: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    serviceName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#374151",
        flex: 1,
    },
    serviceDetails: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
    },
    detailChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    detailText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#374151",
    },
    timeSection: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 12,
        gap: 8,
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    timeContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flex: 1,
    },
    timeLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
    },
    timeValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
        flex: 1,
    },
    bookingFooter: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    bookingId: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9CA3AF",
        textAlign: "center",
    },
    bottomSpacer: {
        height: 100,
    },
});

export default History;