import { Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { UserRole } from '@/src/constants/UserRole';
import { useAuth } from '@/src/context/AuthContext';
import type { OrderResponse } from '@/types/api';
import { styles } from "./BookingCard.styles";

interface ClientBookingPersonProps {
    booking: OrderResponse;
}

/** Client view of the booking's person row: the washer they booked. */
export default function ClientBookingPerson({ booking }: ClientBookingPersonProps) {
    const { role } = useAuth();
    const isWasher = role === UserRole.WASHER_OWNER || role === UserRole.WASHER_WORKER;

    if (isWasher) return null;

    const washerName = booking.wash_service?.washer_profile?.display_name;
    const washerAddress = booking.wash_service?.washer_profile?.address;

    return (
        <View style={styles.personRow}>
            <View style={styles.personInfo}>
                <Text style={styles.personName}>{washerName || "غير متوفر"}</Text>
                {washerAddress && <Text style={styles.personAddress}>{washerAddress}</Text>}
            </View>
            <View style={styles.avatarCircle}>
                <Icon name="store" type="material" size={20} color="#2B67E6" />
            </View>
        </View>
    );
}
