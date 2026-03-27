import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from '../../constants/UserRole';
import { useAuth } from '../Context/AuthContext';
import { formatDateTime } from '../utils/helpers';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const statusConfig = {
    pending:   { label: "قيد الانتظار", bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", icon: "schedule" },
    confirmed: { label: "مؤكد",         bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", icon: "check-circle" },
    completed: { label: "مكتمل",        bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0", icon: "check-circle" },
    cancelled: { label: "ملغي",         bg: "#FEF2F2", text: "#991B1B", border: "#FECACA", icon: "cancel" },
};

export default function History() {
    const { user, role } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isWasher = role === UserRole.WASHER_OWNER || role === UserRole.WASHER_WORKER;

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(`${apiUrl}/bookings/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`Failed to fetch bookings: ${response.status}`);
            const data = await response.json();
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

    useEffect(() => { fetchBookings(); }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>جارٍ التحميل...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.headerIconCircle}>
                            <Icon name="history" type="material" size={20} color="#fff" />
                        </View>
                        <Text style={styles.headerTitle}>{isWasher ? 'سجل الطلبات' : 'حجوزاتي'}</Text>
                    </View>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{bookings.length}</Text>
                    </View>
                </View>

                {/* Empty state */}
                {bookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconCircle}>
                            <Icon name="event-busy" type="material" size={36} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyTitle}>لا توجد حجوزات</Text>
                        <Text style={styles.emptySubtitle}>ليس لديك أي حجوزات حتى الآن</Text>
                    </View>
                ) : (
                    bookings.map((booking) => {
                        const { date, time } = formatDateTime(booking.scheduled_time);
                        const status = statusConfig[booking.status] || statusConfig.pending;

                        const displayName = isWasher
                            ? booking.user_profile?.name
                            : booking.wash_service?.washer_profile?.display_name;
                        const displayAddress = isWasher ? null : booking.wash_service?.washer_profile?.address;
                        const displayPhone = isWasher ? booking.user_profile?.mobile_number : null;
                        const serviceName = booking.wash_service?.name;
                        const servicePrice = booking.wash_service?.price;
                        const serviceDuration = booking.wash_service?.duration_minutes;

                        return (
                            <Pressable key={booking.id} style={styles.card}>

                                {/* Top row: status + ID */}
                                <View style={styles.cardTop}>
                                    <Text style={styles.bookingId}>#{booking.id}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
                                        <Icon name={status.icon} type="material" size={13} color={status.text} />
                                        <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
                                    </View>
                                </View>

                                {/* Person / Washer */}
                                <View style={styles.personRow}>
                                    <View style={styles.personInfo}>
                                        <Text style={styles.personName}>{displayName || "غير متوفر"}</Text>
                                        {displayAddress && <Text style={styles.personSub}>{displayAddress}</Text>}
                                        {displayPhone && <Text style={styles.personSub}>{displayPhone}</Text>}
                                    </View>
                                    <View style={styles.personIconCircle}>
                                        <Icon name={isWasher ? "person" : "store"} type="material" size={20} color="#007AFF" />
                                    </View>
                                </View>

                                {/* Service row */}
                                <View style={styles.divider} />
                                <View style={styles.serviceRow}>
                                    <View style={styles.chips}>
                                        {serviceDuration && (
                                            <View style={[styles.chip, styles.chipPurple]}>
                                                <Icon name="timer" type="material" size={13} color="#7C3AED" />
                                                <Text style={[styles.chipText, { color: "#7C3AED" }]}>{serviceDuration} د</Text>
                                            </View>
                                        )}
                                        {servicePrice && (
                                            <View style={[styles.chip, styles.chipGreen]}>
                                                <Icon name="payments" type="material" size={13} color="#059669" />
                                                <Text style={[styles.chipText, { color: "#059669" }]}>{servicePrice} nis</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.serviceName}>{serviceName || "غير محدد"}</Text>
                                </View>

                                {/* Date / Time */}
                                <View style={styles.timeRow}>
                                    <View style={styles.timeItem}>
                                        <Icon name="access-time" type="material" size={14} color="#9CA3AF" />
                                        <Text style={styles.timeText}>{time}</Text>
                                    </View>
                                    <View style={styles.timeItem}>
                                        <Icon name="event" type="material" size={14} color="#9CA3AF" />
                                        <Text style={styles.timeText}>{date}</Text>
                                    </View>
                                </View>

                            </Pressable>
                        );
                    })
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F0F6FF',
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    countBadge: {
        backgroundColor: '#007AFF',
        minWidth: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    countText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#fff',
    },

    // Empty
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        gap: 12,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    // Card
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        gap: 12,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookingId: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },

    // Person
    personRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    personIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    personInfo: {
        flex: 1,
        alignItems: 'flex-end',
        gap: 2,
    },
    personName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'right',
    },
    personSub: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'right',
    },

    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },

    // Service
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    serviceName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'right',
        flex: 1,
    },
    chips: {
        flexDirection: 'row',
        gap: 6,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
    chipGreen: {
        backgroundColor: '#ECFDF5',
        borderColor: '#A7F3D0',
    },
    chipPurple: {
        backgroundColor: '#F5F3FF',
        borderColor: '#DDD6FE',
    },
    chipText: {
        fontSize: 12,
        fontWeight: '700',
    },

    // Time
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
});
