import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from '@/src/constants/UserRole';
import { useAuth } from '@/src/context/AuthContext';
import { useBookings } from '@/src/hooks/useBookings';
import { formatDateTime } from '@/src/utils/helpers';
import type { OrderStatus } from '@/types/api';
import { styles } from "./HistoryScreen.styles";

interface StatusConfig {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: string;
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
    pending:     { label: "قيد الانتظار", bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", icon: "schedule" },
    in_progress: { label: "قيد التنفيذ",  bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", icon: "autorenew" },
    completed:   { label: "مكتمل",        bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0", icon: "check-circle" },
    cancelled:   { label: "ملغي",         bg: "#FEF2F2", text: "#991B1B", border: "#FECACA", icon: "cancel" },
};

export default function History() {
    const { role } = useAuth();
    const { data, isLoading: loading, refetch, isRefetching: refreshing } = useBookings();

    const bookings = data ?? [];
    const isWasher = role === UserRole.WASHER_OWNER || role === UserRole.WASHER_WORKER;

    const onRefresh = () => {
        refetch();
    };

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
                        const { date, time, day } = formatDateTime(booking.scheduled_time);
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
                                    <View style={styles.timeItem}>
                                        <Icon name="today" type="material" size={14} color="#9CA3AF" />
                                        <Text style={styles.timeText}>{day}</Text>
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
