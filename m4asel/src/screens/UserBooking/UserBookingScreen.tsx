import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmButton from './components/ConfirmButton';
import DatePicker from './components/DatePicker';
import ServiceCards from './components/ServiceCards';
import TimeSlotGrid from './components/TimeSlotGrid';
import ErrorState from '@/src/shared/components/ErrorState';
import LoadingState from '@/src/shared/components/LoadingState';
import { useCreateBooking } from './hooks/useCreateBooking';
import { styles } from "./UserBookingScreen.styles";
import { useWasher } from './hooks/useWasher';
import type { WashService } from '@/types/api';

function UserBookingScreen() {
    const { washerId } = useLocalSearchParams<{ washerId: string }>();

    const { data: washerDetails, isLoading: loading, refetch } = useWasher(washerId);
    const createBooking = useCreateBooking();

    const [selectedService, setSelectedService] = useState<WashService | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (selectedService) {
            setSelectedTime(null);
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }
    }, [selectedService]);

    useEffect(() => {
        if (selectedDate) {
            setSelectedTime(null);
        }
    }, [selectedDate]);

    const handleServiceSelect = (service: WashService) => {
        setSelectedService(service);
    };

    const handleConfirmBooking = async () => {
        if (!selectedService || !selectedTime) return;

        const rawDatetime = selectedTime.includes('T')
            ? selectedTime
            : `${selectedDate}T${selectedTime}`;
        const scheduled_start = new Date(rawDatetime).toISOString();

        try {
            await createBooking.mutateAsync({
                washer_id: parseInt(washerId, 10),
                wash_service_id: selectedService.id!,
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

    if (loading) {
        return <LoadingState />;
    }

    if (!washerDetails) {
        return <ErrorState onRetry={() => refetch()} />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.navbar}>
                    <Pressable style={styles.backBtn} onPress={() => router.replace('/(main)/MapPage')}>
                        <Icon name="arrow-forward-ios" type="material" size={18} color="#007AFF" />
                    </Pressable>
                    <Text style={styles.navTitle}>حجز موعد</Text>
                    <View style={styles.navSpacer} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>اختر الخدمة</Text>
                    <ServiceCards
                        services={washerDetails.wash_services}
                        selectedService={selectedService}
                        onSelectService={handleServiceSelect}
                    />
                </View>

                {selectedService && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>اختر الوقت المناسب</Text>
                        <DatePicker
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                        />
                        <TimeSlotGrid
                            washerId={washerId}
                            serviceId={selectedService.id!}
                            date={selectedDate}
                            selectedTime={selectedTime}
                            onSelectTime={setSelectedTime}
                        />
                    </View>
                )}

                <ConfirmButton
                    onConfirm={handleConfirmBooking}
                    disabled={!selectedService || !selectedTime || createBooking.isPending}
                    loading={createBooking.isPending}
                />

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );

}

export default UserBookingScreen;
