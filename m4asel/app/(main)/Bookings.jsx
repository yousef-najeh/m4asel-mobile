import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../Context/AuthContext';
import { formatDateTime } from "../utils/helpers";

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

function Bookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(`${apiUrl}/bookings/`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`${response.status}`);
            const data = await response.json();
            const active = Array.isArray(data)
                ? data.filter(b => b.status === 'pending' || b.status === 'in_progress')
                : [];
            setBookings(active);
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

    const updateStatus = async (bookingId, newStatus, cancelReason = null) => {
        try {
            const token = await user.getIdToken();
            const body = { status: newStatus };
            if (cancelReason) body.cancel_reason = cancelReason;
            const response = await fetch(`${apiUrl}/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error(`${response.status}`);
            await fetchBookings();
        } catch {
            Alert.alert('خطأ', 'فشل تحديث حالة الطلب');
        }
    };

    const handleReject = (bookingId) => {
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

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F6FF' },
    container: { flex: 1, backgroundColor: '#F0F6FF' },
    contentContainer: { padding: 16, paddingTop: 20 },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 15, color: '#6B7280', fontWeight: '600' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerIconCircle: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
    headerSub: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginTop: 1 },
    countBadge: {
        backgroundColor: '#007AFF',
        minWidth: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    countText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },

    // Summary
    summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    summaryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
        borderWidth: 1,
    },
    pillPending: { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' },
    pillProgress: { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' },
    summaryText: { fontSize: 12, fontWeight: '700' },

    // Empty
    emptyState: { alignItems: 'center', paddingVertical: 80, gap: 12 },
    emptyIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
    emptyText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },

    // Card
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
    },
    badgePending: { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' },
    badgeProgress: { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' },
    statusText: { fontSize: 12, fontWeight: '700' },
    statusPendingText: { color: '#92400E' },
    statusProgressText: { color: '#1E40AF' },
    bookingId: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },

    // Customer
    customerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    customerAvatar: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customerInfo: { flex: 1, gap: 3 },
    customerName: { fontSize: 16, fontWeight: '800', color: '#111827' },
    customerPhone: { fontSize: 13, color: '#6B7280', fontWeight: '500' },

    divider: { height: 1, backgroundColor: '#F3F4F6' },

    // Service
    serviceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    serviceName: { fontSize: 14, fontWeight: '700', color: '#374151', flex: 1 },
    chips: { flexDirection: 'row', gap: 6 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
    chipGreen: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
    chipPurple: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
    chipText: { fontSize: 11, fontWeight: '700' },

    // Time
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 10 },
    timeText: { fontSize: 13, fontWeight: '600', color: '#374151' },
    timeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginHorizontal: 2 },

    // Actions
    actions: { flexDirection: 'row', gap: 10 },
    acceptBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 12,
        shadowColor: '#007AFF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
    },
    rejectBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, backgroundColor: '#EF4444', paddingVertical: 12, borderRadius: 12,
        shadowColor: '#EF4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
    },
    completeBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, backgroundColor: '#7C3AED', paddingVertical: 12, borderRadius: 12,
        shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
    },
    actionText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

    bottomSpacer: { height: 100 },
});

export default Bookings;
