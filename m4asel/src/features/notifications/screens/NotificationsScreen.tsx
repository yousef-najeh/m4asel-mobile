import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '@/src/features/notifications/hooks/useNotifications';
import { styles } from "../styles/NotificationsScreen.styles";

export default function Notifications() {
    const { data, isLoading: loading, refetch, isRefetching: refreshing } = useNotifications();
    const notifications = data ?? [];

    const onRefresh = () => {
        refetch();
    };

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
