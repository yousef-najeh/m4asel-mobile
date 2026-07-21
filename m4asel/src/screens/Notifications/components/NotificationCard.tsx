import { Image, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "@/src/theme";
import type { NotificationRead } from "@/types/api";
import { deriveNotificationType, NOTIFICATION_VARIANTS } from "../constants/notificationVariants";
import { styles } from "./NotificationCard.styles";

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ar-EG", { day: "numeric", month: "long" });

const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" });

/**
 * Bold the "(اسم)" spans the backend embeds in body copy, per the Figma design.
 * Everything else renders in the regular secondary style.
 */
function renderBody(body: string) {
    return body.split(/(\([^)]*\))/).map((part, i) =>
        part.startsWith("(") && part.endsWith(")") ? (
            <Text key={i} style={styles.bodyBold}>{part}</Text>
        ) : (
            part
        )
    );
}

/** Notification card per Figma frame 277:5513 — children written in visual order (left → right), matching the History cards' convention. */
export default function NotificationCard({ notification }: { notification: NotificationRead }) {
    const variant = NOTIFICATION_VARIANTS[deriveNotificationType(notification.title)];

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={[styles.dot, { backgroundColor: variant.dotColor }]} />
                <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
                <Image source={variant.icon} style={styles.icon} />
            </View>

            {notification.body ? (
                <Text style={styles.body} numberOfLines={2}>{renderBody(notification.body)}</Text>
            ) : null}

            {notification.created_at ? (
                <View style={styles.footerRow}>
                    <View style={styles.footerItem}>
                        <Icon name="access-time" type="material" size={12} color={colors.textTertiary} />
                        <Text style={styles.footerText}>{formatTime(notification.created_at)}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Icon name="event" type="material" size={12} color={colors.textTertiary} />
                        <Text style={styles.footerText}>{formatDate(notification.created_at)}</Text>
                    </View>
                </View>
            ) : null}
        </View>
    );
}
