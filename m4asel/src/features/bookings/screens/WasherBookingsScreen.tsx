import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings, useUpdateBookingStatus } from '@/src/features/bookings/hooks/useBookings';
import { formatDateTime } from "@/src/utils/helpers";
import type { OrderStatus } from '@/types/api';
import { styles } from "../styles/WasherBookingsScreen.styles";

function WasherBookingsScreen() {
    const { data, isLoading: loading, refetch, isRefetching: refreshing } = useBookings();
    const updateStatusMutation = useUpdateBookingStatus();

    const bookings = (data ?? []).filter((b) => b.status === 'pending' || b.status === 'in_progress');

    const onRefresh = () => {
        refetch();
    };

    const updateStatus = (bookingId: number, newStatus: OrderStatus, cancelReason: string | null = null) => {
        updateStatusMutation.mutate(
            { id: bookingId, status: newStatus, cancelReason },
            { onError: () => Alert.alert('خطأ', 'فشل تحديث حالة الطلب') },
        );
    };

    const handleReject = (bookingId: number) => {
        Alert.alert('رفض الطلب', 'يرجى اختيار سبب الرفض:', [
            { text: 'مشغول في هذا الوقت', onPress: () => updateStatus(bookingId, 'cancelled', 'مشغول في هذا الوقت') },
            { text: 'لا يمكنني تقديم هذه الخدمة', onPress: () => updateStatus(bookingId, 'cancelled', 'لا يمكنني تقديم هذه الخدمة') },
            { text: 'سبب آخر', onPress: () => updateStatus(bookingId, 'cancelled', 'تم الرفض من قبل المغسلة') },
            { text: 'إلغاء', style: 'cancel' }
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>جارٍ تحميل الطلبات...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const inProgressCount = bookings.filter(b => b.status === 'in_progress').length;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.headerIconCircle}>
                            <Icon name="handyman" type="material" size={22} color="#007AFF" />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>طلبات العمل</Text>
                            <Text style={styles.headerSub}>لوحة تحكم المغسلة</Text>
                        </View>
                    </View>
                    {bookings.length > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{bookings.length}</Text>
                        </View>
                    )}
                </View>

                {/* Summary pills */}
                {bookings.length > 0 && (
                    <View style={styles.summaryRow}>
                        <View style={[styles.summaryPill, styles.pillPending]}>
                            <Icon name="schedule" type="material" size={14} color="#92400E" />
                            <Text style={[styles.summaryText, { color: '#92400E' }]}>{pendingCount} بانتظار القبول</Text>
                        </View>
                        <View style={[styles.summaryPill, styles.pillProgress]}>
                            <Icon name="autorenew" type="material" size={14} color="#1E40AF" />
                            <Text style={[styles.summaryText, { color: '#1E40AF' }]}>{inProgressCount} قيد التنفيذ</Text>
                        </View>
                    </View>
                )}

                {/* Empty state */}
                {bookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconCircle}>
                            <Icon name="event-available" type="material" size={32} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyTitle}>لا توجد طلبات نشطة</Text>
                        <Text style={styles.emptyText}>ستظهر هنا طلبات العملاء الجديدة</Text>
                    </View>
                ) : (
                    bookings.map((booking) => {
                        const { date, time } = formatDateTime(booking.scheduled_time);
                        const customerName = booking.user_profile?.name || 'عميل';
                        const customerPhone = booking.user_profile?.mobile_number;
                        const serviceName = booking.wash_service?.name;
                        const servicePrice = booking.wash_service?.price;
                        const serviceDuration = booking.wash_service?.duration_minutes;
                        const isPending = booking.status === 'pending';
                        const isInProgress = booking.status === 'in_progress';

                        return (
                            <View key={booking.id} style={styles.card}>
                                {/* Card top: status + booking id */}
                                <View style={styles.cardTop}>
                                    <View style={[styles.statusBadge, isPending ? styles.badgePending : styles.badgeProgress]}>
                                        <Icon
                                            name={isPending ? 'schedule' : 'autorenew'}
                                            type="material"
                                            size={13}
                                            color={isPending ? '#92400E' : '#1E40AF'}
                                        />
                                        <Text style={[styles.statusText, isPending ? styles.statusPendingText : styles.statusProgressText]}>
                                            {isPending ? 'بانتظار القبول' : 'قيد التنفيذ'}
                                        </Text>
                                    </View>
                                    <Text style={styles.bookingId}>#{booking.id}</Text>
                                </View>

                                {/* Customer row */}
                                <View style={styles.customerRow}>
                                    <View style={styles.customerAvatar}>
                                        <Icon name="person" type="material" size={20} color="#007AFF" />
                                    </View>
                                    <View style={styles.customerInfo}>
                                        <Text style={styles.customerName}>{customerName}</Text>
                                        {customerPhone && <Text style={styles.customerPhone}>{customerPhone}</Text>}
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                {/* Service row */}
                                <View style={styles.serviceRow}>
                                    <Text style={styles.serviceName}>{serviceName || 'خدمة غير محددة'}</Text>
                                    <View style={styles.chips}>
                                        {servicePrice && (
                                            <View style={[styles.chip, styles.chipGreen]}>
                                                <Icon name="payments" type="material" size={12} color="#007AFF" />
                                                <Text style={[styles.chipText, { color: '#007AFF' }]}>{servicePrice} nis</Text>
                                            </View>
                                        )}
                                        {serviceDuration && (
                                            <View style={[styles.chip, styles.chipPurple]}>
                                                <Icon name="timer" type="material" size={12} color="#7C3AED" />
                                                <Text style={[styles.chipText, { color: '#7C3AED' }]}>{serviceDuration} د</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Time row */}
                                <View style={styles.timeRow}>
                                    <Icon name="event" type="material" size={15} color="#9CA3AF" />
                                    <Text style={styles.timeText}>{date}</Text>
                                    <View style={styles.timeDot} />
                                    <Icon name="access-time" type="material" size={15} color="#9CA3AF" />
                                    <Text style={styles.timeText}>{time}</Text>
                                </View>

                                {/* Actions */}
                                {isPending && (
                                    <View style={styles.actions}>
                                        <Pressable style={styles.acceptBtn} onPress={() => updateStatus(booking.id, 'in_progress')}>
                                            <Icon name="check-circle" type="material" size={18} color="#FFFFFF" />
                                            <Text style={styles.actionText}>قبول</Text>
                                        </Pressable>
                                        <Pressable style={styles.rejectBtn} onPress={() => handleReject(booking.id)}>
                                            <Icon name="cancel" type="material" size={18} color="#FFFFFF" />
                                            <Text style={styles.actionText}>رفض</Text>
                                        </Pressable>
                                    </View>
                                )}
                                {isInProgress && (
                                    <Pressable style={styles.completeBtn} onPress={() => updateStatus(booking.id, 'completed')}>
                                        <Icon name="check-circle-outline" type="material" size={18} color="#FFFFFF" />
                                        <Text style={styles.actionText}>إكمال الخدمة</Text>
                                    </Pressable>
                                )}
                            </View>
                        );
                    })
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default WasherBookingsScreen;
