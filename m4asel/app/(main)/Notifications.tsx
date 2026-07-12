import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../Context/AuthContext';
import type { NotificationRead } from '@/types/api';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            if (!user) return;
            const token = await user.getIdToken();
            const response = await fetch(`${apiUrl}/notifications/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`Failed to fetch notifications: ${response.status}`);
            const data = (await response.json()) as NotificationRead[];
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    useEffect(() => { fetchNotifications(); }, []);

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString?: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
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
                            <Icon name="notifications" type="material" size={20} color="#fff" />
                        </View>
                        <Text style={styles.headerTitle}>الإشعارات</Text>
                    </View>
                </View>

                {/* Empty state */}
                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconCircle}>
                            <Icon name="notifications-none" type="material" size={36} color="#9CA3AF" />
                        </View>
                        <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
                        <Text style={styles.emptySubtitle}>ليس لديك أي إشعارات حتى الآن</Text>
                    </View>
                ) : (
                    notifications.map((notification) => (
                        <View
                            key={notification.id}
                            style={styles.card}
                        >
                            {/* Top row: icon + time */}
                            <View style={styles.cardTop}>
                                <View style={styles.timeRow}>
                                    {notification.created_at && (
                                        <>
                                            <View style={styles.timeItem}>
                                                <Icon name="access-time" type="material" size={13} color="#9CA3AF" />
                                                <Text style={styles.timeText}>{formatTime(notification.created_at)}</Text>
                                            </View>
                                            <View style={styles.timeItem}>
                                                <Icon name="event" type="material" size={13} color="#9CA3AF" />
                                                <Text style={styles.timeText}>{formatDate(notification.created_at)}</Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                                <View style={styles.notifIconCircle}>
                                    <Icon name="notifications" type="material" size={18} color="#007AFF" />
                                </View>
                            </View>

                            {/* Title */}
                            {notification.title && (
                                <Text style={styles.notifTitle}>{notification.title}</Text>
                            )}

                            {/* Message */}
                            {notification.body && (
                                <Text style={styles.notifMessage}>{notification.body}</Text>
                            )}
                        </View>
                    ))
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
        backgroundColor: '#EF4444',
        minWidth: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        shadowColor: '#EF4444',
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
        gap: 10,
    },
    cardUnread: {
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    unreadDot: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notifIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    notifTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'right',
    },
    notifMessage: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '400',
        textAlign: 'right',
        lineHeight: 22,
    },
});
