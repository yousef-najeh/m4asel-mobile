import { Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { UserRole } from '@/src/constants/UserRole';
import { useAuth } from '@/src/context/AuthContext';
import type { OrderResponse } from '@/types/api';
import { styles } from "./BookingCard.styles";

interface WasherBookingPersonProps {
    booking: OrderResponse;
}

/** Washer view of the booking's person row: the customer who booked them. */
export default function WasherBookingPerson({ booking }: WasherBookingPersonProps) {
    const { role } = useAuth();
    const isWasher = role === UserRole.WASHER_OWNER || role === UserRole.WASHER_WORKER;

    if (!isWasher) return null;

    const customerName = booking.user_profile?.name;
    const customerPhone = booking.user_profile?.mobile_number;

    return (
        <View style={styles.personRow}>
            <View style={styles.personInfo}>
                <Text style={styles.personName}>{customerName || "غير متوفر"}</Text>
                {customerPhone && <Text style={styles.personAddress}>{customerPhone}</Text>}
            </View>
            <View style={styles.avatarCircle}>
                <Icon name="person" type="material" size={20} color="#2B67E6" />
            </View>
        </View>
    );
}
