import { Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { formatDateTime } from '@/src/utils/helpers';
import type { OrderResponse, OrderStatus } from '@/types/api';
import { styles } from "./BookingCard.styles";

interface StatusConfig {
    label: string;
    color: string;
    badgeIcon: string;
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
    pending:     { label: "قيد الانتظار", color: "#E3AE28", badgeIcon: "schedule" },
    in_progress: { label: "جاري",          color: "#E3AE28", badgeIcon: "autorenew" },
    completed:   { label: "مكتمل",         color: "#059669", badgeIcon: "check" },
    cancelled:   { label: "ملغي",          color: "#E62B2E", badgeIcon: "close" },
};

interface BookingCardProps {
    booking: OrderResponse;
    /** Washers see the customer who booked them; clients see the washer they booked. */
    isWasher: boolean;
}

export default function BookingCard({ booking, isWasher }: BookingCardProps) {
    const { date, time } = formatDateTime(booking.scheduled_time);
    const status = statusConfig[booking.status] || statusConfig.pending;

    const personName = isWasher ? booking.user_profile?.name : booking.wash_service?.washer_profile?.display_name;
    const personSubtitle = isWasher ? booking.user_profile?.mobile_number : booking.wash_service?.washer_profile?.address;
    const personIcon = isWasher ? "person" : "store";
    const serviceName = booking.wash_service?.name;
    const servicePrice = booking.wash_service?.price;
    const serviceDuration = booking.wash_service?.duration_minutes;

    return (
        <View style={styles.card}>
            <View style={styles.cardRow}>
                {/* Left column: status, icon, price, duration */}
                <View style={styles.leftCol}>
                    <View style={[styles.statusPill, { borderColor: status.color }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>

                    <View style={styles.serviceIconWrap}>
                        <Icon name="directions-car" type="material" size={44} color="#D1D5DB" />
                        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                            <Icon name={status.badgeIcon} type="material" size={13} color="#FFFFFF" />
                        </View>
                    </View>
                    <View style={styles.priceDurationRow}>
                        {servicePrice != null && (
                            <View style={styles.priceRow}>
                                <Text style={styles.priceText}>{'₪'} {servicePrice}</Text>
                            </View>
                        )}

                        {serviceDuration != null && (
                            <View style={styles.durationChip}>
                                <Icon name="timer" type="material" size={13} color="#6F767D" />
                                <Text style={styles.durationText}>{serviceDuration} دقائق</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Right column: washer info, service, date/time */}
                <View style={styles.rightCol}>
                    <View style={styles.personRow}>
                        <View style={styles.personInfo}>
                            <Text style={styles.personName}>{personName || "غير متوفر"}</Text>
                            {personSubtitle && <Text style={styles.personAddress}>{personSubtitle}</Text>}
                        </View>
                        <View style={styles.avatarCircle}>
                            <Icon name={personIcon} type="material" size={20} color="#2B67E6" />
                        </View>
                    </View>

                    <View style={styles.detailsCol}>
                        <Text style={[styles.serviceName, { color: status.color }]}>{serviceName || "غير محدد"}</Text>
                        <View style={styles.dateTimeRow}>
                            <View style={styles.dateTimeItem}>
                                <Icon name="access-time" type="material" size={15} color="#828282" />
                                <Text style={styles.dateTimeText}>{time}</Text>
                            </View>
                            <View style={styles.dateTimeItem}>
                                <Icon name="event" type="material" size={15} color="#828282" />
                                <Text style={styles.dateTimeText}>{date}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
