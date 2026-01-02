import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useLocalSearchParams, router } from 'expo-router';
import WasherInfoCard from '../Components/Booking/WasherInfoCard';
import ServiceCards from '../Components/Booking/ServiceCards';
import TimeSlotGrid from '../Components/Booking/TimeSlotGrid';
import DatePicker from '../Components/Booking/DatePicker';
import LoadingState from '../Components/Booking/LoadingState';
import ErrorState from '../Components/Booking/ErrorState';
import BookingHeader from '../Components/Booking/BookingHeader';
import ConfirmButton from '../Components/Booking/ConfirmButton';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

function BookingPage() {
    const { user } = useAuth();
    const { washerId } = useLocalSearchParams();
    
    const [washerDetails, setWasherDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Fetch washer details
    const fetchWasherDetails = async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(`${apiUrl}/washers/${washerId}`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch washer: ${response.status}`);
            }
            
            const data = await response.json();
            setWasherDetails(data);
        } catch (error) {
            console.error('Error fetching washer details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (washerId && user) {
            fetchWasherDetails();
        }
    }, [washerId, user]);

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

    const handleServiceSelect = (service) => {
        setSelectedService(service);
    };

    const handleConfirmBooking = async () => {
        if (!selectedService || !selectedTime) return;

        try {
            setBookingLoading(true);
            const token = await user.getIdToken();
            
            const bookingData = {
                washer_id: parseInt(washerId),
                wash_service_id: selectedService.id,
                scheduled_start: selectedTime
            };

            const response = await fetch(`${apiUrl}/bookings/`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log('Booking creation failed:', errorData);
                const errorMessage = errorData.detail || errorData.message || 'فشل في إنشاء الحجز';
                throw new Error(errorMessage);
            }

            Alert.alert(
                'تم الحجز بنجاح',
                'تم إنشاء حجزك بنجاح',
                [
                    {
                        text: 'حسناً',
                        onPress: () => router.push('/(main)/History')
                    }
                ]
            );
        } catch (error) {
            console.error('Error creating booking:', error);
            const errorMessage = error?.message || error?.toString() || 'حدث خطأ أثناء إنشاء الحجز';
            Alert.alert('خطأ', errorMessage);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (!washerDetails) {
        return <ErrorState onRetry={fetchWasherDetails} />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <BookingHeader />

                <WasherInfoCard address={washerDetails.address} display_name={washerDetails.display_name} />

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
                            serviceId={selectedService.id}
                            date={selectedDate}
                            selectedTime={selectedTime}
                            onSelectTime={setSelectedTime}
                        />
                    </View>
                )}

                <ConfirmButton 
                    onConfirm={handleConfirmBooking}
                    disabled={!selectedService || !selectedTime || bookingLoading}
                    loading={bookingLoading}
                />

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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 16,
    },
    bottomSpacer: {
        height: 100,
    },
});

export default BookingPage;
