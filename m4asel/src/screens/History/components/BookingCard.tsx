import { Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { formatDateTime } from '@/src/utils/helpers';
import type { OrderResponse } from '@/types/api';
import { styles } from "./BookingCard.styles";
import ClientBookingPerson from "./ClientBookingPerson";
import WasherBookingPerson from "./WasherBookingPerson";
import { statusConfig } from "../constants";

interface BookingCardProps {
    booking: OrderResponse;
}

export default function BookingCard({ booking }: BookingCardProps) {
    const { date, time } = formatDateTime(booking.scheduled_time);
    const status = statusConfig[booking.status] || statusConfig.pending;

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
                    <WasherBookingPerson booking={booking} />
                    <ClientBookingPerson booking={booking} />

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
