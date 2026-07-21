import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from '@/src/constants/UserRole';
import { useAuth } from '@/src/context/AuthContext';
import { useBookings } from '@/src/hooks/useBookings';
import BookingCard from "./components/BookingCard";
import EmptyHistoryState from "./components/EmptyHistoryState";
import HistoryHeader from "./components/HistoryHeader";
import { styles } from "./HistoryScreen.styles";

/** Booking history — shared by clients and washers. Matches the "Bookings History" Figma screen. */
export default function HistoryScreen() {
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
                    <ActivityIndicator size="large" color="#2B67E6" />
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2B67E6" />}
            >
                <HistoryHeader count={bookings.length} />

                {bookings.length === 0 ? (
                    <EmptyHistoryState />
                ) : (
                    bookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} isWasher={isWasher} />
                    ))
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
