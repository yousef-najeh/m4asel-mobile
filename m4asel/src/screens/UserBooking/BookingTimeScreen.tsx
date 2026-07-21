import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/theme";
import ErrorState from "@/src/shared/components/ErrorState";
import LoadingState from "@/src/shared/components/LoadingState";
import BackCircle from "./components/BackCircle";
import ConfirmButton from "./components/ConfirmButton";
import DateChips from "./components/DateChips";
import TimeWheel from "./components/TimeWheel";
import { useCreateBooking } from "./hooks/useCreateBooking";
import { useWasher } from "./hooks/useWasher";
import { computeEndTime, slotToDate } from "./utils";
import { styles } from "./BookingTimeScreen.styles";

const todayISO = () => new Date().toISOString().split("T")[0];

/** Booking step 2 — date + time selection and confirmation (Figma 258:4155). */
export default function BookingTimeScreen() {
    const { washerId, serviceId } = useLocalSearchParams<{ washerId: string; serviceId: string }>();
    const insets = useSafeAreaInsets();

    const { data: washerDetails, isLoading, refetch } = useWasher(washerId);
    const createBooking = useCreateBooking();

    const [selectedDate, setSelectedDate] = useState(todayISO());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Changing the date invalidates the chosen slot.
    useEffect(() => {
        setSelectedTime(null);
    }, [selectedDate]);

    if (isLoading) return <LoadingState />;
    if (!washerDetails) return <ErrorState onRetry={() => refetch()} />;

    const service = washerDetails.wash_services?.find((s) => s.id === Number(serviceId));
    if (!service) {
        // Stale/invalid serviceId (e.g. deep link) — send the user back to service selection.
        return <ErrorState onRetry={() => router.replace(`/(main)/BookingServicePage?washerId=${washerId}`)} />;
    }

    const handleConfirmBooking = async () => {
        if (!selectedTime) return;

        const scheduled_start = slotToDate(selectedDate, selectedTime).toISOString();

        try {
            await createBooking.mutateAsync({
                washer_id: parseInt(washerId, 10),
                wash_service_id: service.id!,
                scheduled_start,
            });
            Alert.alert('تم الحجز بنجاح', 'تم إنشاء حجزك بنجاح', [
                { text: 'حسناً', onPress: () => router.push('/(main)/History') },
            ]);
        } catch (error) {
            console.error('Error creating booking:', error);
            const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الحجز';
            Alert.alert('خطأ', errorMessage);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header: back circle (visual left) — page title (visual right) */}
                <View style={styles.headerRow}>
                    <BackCircle onPress={() => router.replace(`/(main)/BookingServicePage?washerId=${washerId}`)} />
                    <Text style={styles.pageTitle}>التاريخ والوقت</Text>
                </View>

                {/* Date section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>اختر التاريخ</Text>
                    <Icon name="event" type="material" size={20} color={colors.primary} />
                </View>
                <DateChips selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                {/* Time section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>اختر الساعة</Text>
                    <Icon name="timer" type="material" size={20} color={colors.primary} />
                </View>
                <Text style={styles.durationHint}>مدة الخدمة: {service.duration_minutes} دقائق</Text>

                <TimeWheel
                    washerId={washerId}
                    serviceId={service.id!}
                    date={selectedDate}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                />

                {selectedTime && (
                    <Text style={styles.endTimeHint}>
                        ينتهي الحجز تقريبا: {computeEndTime(selectedDate, selectedTime, service.duration_minutes)}
                    </Text>
                )}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <ConfirmButton
                    label="تأكيد الحجز!"
                    loadingLabel="جارٍ الحجز..."
                    onConfirm={handleConfirmBooking}
                    disabled={!selectedTime || createBooking.isPending}
                    loading={createBooking.isPending}
                />
            </View>
        </SafeAreaView>
    );
}
