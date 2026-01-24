import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

function Bookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch active bookings (pending and in_progress) from API
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
            // Filter to show only pending and in_progress bookings
            const activeBookings = Array.isArray(data) 
                ? data.filter(b => b.status === 'pending' || b.status === 'in_progress')
                : [];
            setBookings(activeBookings);
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

    // Update booking status
    const updateBookingStatus = async (bookingId, newStatus, cancelReason = null) => {
        try {
            const token = await user.getIdToken();
            const body = { status: newStatus };
            if (cancelReason) {
                body.cancel_reason = cancelReason;
            }
            
            const response = await fetch(`${apiUrl}/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update booking: ${response.status}`);
            }
            
            // Refresh bookings after update
            await fetchBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            Alert.alert('خطأ', 'فشل تحديث حالة الحجز');
        }
    };

    // Handle cancel with reason
    const handleCancelBooking = (bookingId) => {
        Alert.alert(
            'رفض الحجز',
            'يرجى اختيار سبب الرفض:',
            [
                {
                    text: 'مشغول في هذا الوقت',
                    onPress: () => updateBookingStatus(bookingId, 'cancelled', 'مشغول في هذا الوقت')
                },
                {
                    text: 'لا يمكنني تقديم هذه الخدمة',
                    onPress: () => updateBookingStatus(bookingId, 'cancelled', 'لا يمكنني تقديم هذه الخدمة')
                },
                {
                    text: 'سبب آخر',
                    onPress: () => updateBookingStatus(bookingId, 'cancelled', 'تم الرفض من قبل المغسلة')
                },
                {
                    text: 'إلغاء',
                    style: 'cancel'
                }
            ]
        );
    };

    // Format date and time
    const formatDateTime = (isoString) => {
        if (!isoString) return { date: "---", time: "---" };
        try {
            const date = new Date(isoString);
            
            const monthNames = [
                "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
                "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
            ];
            
            const day = date.getDate();
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            const dateStr = `${day} ${month} ${year}`;
            
            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'مساءً' : 'صباحاً';
            hours = hours % 12 || 12;
            const timeStr = `${hours}:${minutes} ${ampm}`;
            
            return { date: dateStr, time: timeStr };
        } catch (_e) {
            return { date: "---", time: "---" };
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <Icon name="event-note" type="material" size={48} color="#D1D5DB" />
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
                        <Icon name="event-note" type="material" size={28} color="#111827" />
                        <Text style={styles.headerTitle}>الحجوزات النشطة</Text>
                    </View>
                    <View style={styles.bookingCount}>
                        <Text style={styles.bookingCountText}>{bookings.length}</Text>
                    </View>
                </View>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="event-available" type="material" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>لا توجد حجوزات نشطة</Text>
                        <Text style={styles.emptyText}>جميع الحجوزات قد تم إكمالها</Text>
                    </View>
                ) : (
                    bookings.map((booking) => {
                        const { date, time } = formatDateTime(booking.scheduled_time);
                        const customerName = booking.user_profile?.name;
                        const customerPhone = booking.user_profile?.mobile_number;
                        const serviceName = booking.wash_service?.name;
                        const servicePrice = booking.wash_service?.price;
                        const serviceDuration = booking.wash_service?.duration_minutes;

                        const isPending = booking.status === 'pending';
                        const isInProgress = booking.status === 'in_progress';

                        return (
                            <View key={booking.id} style={styles.bookingCard}>
                                {/* Status Badge */}
                                {isPending && (
                                    <View style={styles.pendingBadge}>
                                        <Icon name="schedule" type="material" size={16} color="#92400E" />
                                        <Text style={styles.pendingText}>قيد الانتظار</Text>
                                    </View>
                                )}
                                {isInProgress && (
                                    <View style={styles.inProgressBadge}>
                                        <Icon name="hourglass-empty" type="material" size={16} color="#1E40AF" />
                                        <Text style={styles.inProgressText}>قيد التنفيذ</Text>
                                    </View>
                                )}

                                {/* Customer Info */}
                                <View style={styles.mainSection}>
                                    <Icon name="person" type="material" size={24} color="#007AFF" />
                                    <View style={styles.mainInfo}>
                                        <Text style={styles.mainName}>{customerName || "عميل"}</Text>
                                        {customerPhone && (
                                            <Text style={styles.subInfo}>{customerPhone}</Text>
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
                                        <Text style={styles.timeLabel}>التاريخ:</Text>
                                        <Text style={styles.timeValue}>{date}</Text>
                                    </View>
                                    <View style={styles.timeRow}>
                                        <Icon name="access-time" type="material" size={18} color="#6B7280" />
                                        <Text style={styles.timeLabel}>الوقت:</Text>
                                        <Text style={styles.timeValue}>{time}</Text>
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                {isPending && (
                                    <View style={styles.actionButtons}>
                                        <Pressable 
                                            style={styles.confirmButton}
                                            onPress={() => updateBookingStatus(booking.id, 'in_progress')}
                                        >
                                            <Icon name="check-circle" type="material" size={20} color="#FFFFFF" />
                                            <Text style={styles.confirmText}>تأكيد</Text>
                                        </Pressable>
                                        
                                        <Pressable 
                                            style={styles.cancelButton}
                                            onPress={() => handleCancelBooking(booking.id)}
                                        >
                                            <Icon name="cancel" type="material" size={20} color="#FFFFFF" />
                                            <Text style={styles.cancelText}>رفض</Text>
                                        </Pressable>
                                    </View>
                                )}
                                {isInProgress && (
                                    <View style={styles.actionButtons}>
                                        <Pressable 
                                            style={styles.completedButton}
                                            onPress={() => updateBookingStatus(booking.id, 'completed')}
                                        >
                                            <Icon name="check-circle-outline" type="material" size={20} color="#FFFFFF" />
                                            <Text style={styles.completedText}>إكمال الخدمة</Text>
                                        </Pressable>
                                    </View>
                                )}

                                {/* Booking ID */}
                                <View style={styles.bookingFooter}>
                                    <Text style={styles.bookingId}>رقم الحجز: #{booking.id}</Text>
                                </View>
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
        backgroundColor: "#F59E0B",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#F59E0B",
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
    pendingBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 2,
        backgroundColor: "#FEF3C7",
        borderColor: "#FCD34D",
        gap: 6,
    },
    pendingText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#92400E",
    },
    inProgressBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 2,
        backgroundColor: "#DBEAFE",
        borderColor: "#93C5FD",
        gap: 6,
    },
    inProgressText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#1E40AF",
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
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    confirmButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#10B981",
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    confirmText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    cancelButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EF4444",
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        shadowColor: "#EF4444",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    completedButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#7C3AED",
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        shadowColor: "#7C3AED",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    completedText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
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

export default Bookings;
