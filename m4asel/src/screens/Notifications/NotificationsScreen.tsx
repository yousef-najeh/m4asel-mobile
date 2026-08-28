import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from "@/src/theme";
import NotificationCard from './components/NotificationCard';
import { useNotifications } from './hooks/useNotifications';
import { styles } from "./NotificationsScreen.styles";

export default function Notifications() {
    const { data, isLoading: loading, refetch, isRefetching: refreshing } = useNotifications();
    const notifications = data ?? [];

    const onRefresh = () => {
        refetch();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            >
                {/* Header: count badge + title, anchored to the visual right (Figma 347:3493) */}
                <View style={styles.header}>
                    {notifications.length > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{notifications.length}</Text>
                        </View>
                    )}
                    <Text style={styles.headerTitle}>الاشعارات</Text>
                </View>

                {/* Empty state */}
                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconCircle}>
                            <Icon name="notifications-none" type="material" size={36} color={colors.textMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
                        <Text style={styles.emptySubtitle}>ليس لديك أي إشعارات حتى الآن</Text>
                    </View>
                ) : (
                    notifications.map((notification) => (
                        <NotificationCard key={notification.id} notification={notification} />
                    ))
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
