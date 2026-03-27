import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmButton from '../Components/Booking/ConfirmButton';
import DatePicker from '../Components/Booking/DatePicker';
import ErrorState from '../Components/Booking/ErrorState';
import LoadingState from '../Components/Booking/LoadingState';
import ServiceCards from '../Components/Booking/ServiceCards';
import TimeSlotGrid from '../Components/Booking/TimeSlotGrid';
import { useAuth } from '../Context/AuthContext';

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
        backgroundColor: '#F0F6FF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F0F6FF',
    },
    contentContainer: {
        padding: 16,
        paddingTop: 8,
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 8,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    navTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
    },
    navSpacer: {
        width: 36,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
    },
    bottomSpacer: {
        height: 100,
    },
});

export default BookingPage;
