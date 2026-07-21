import type { ImageSourcePropType } from "react-native";
import { colors } from "@/src/theme";

/**
 * The API's NotificationRead carries no type field ({ id, title, body, created_at }),
 * so the visual variant is derived client-side from title keywords. Figma frame
 * 277:5513 shows six event types collapsing into four visuals (car glyph + dot color).
 */
export type NotificationType =
    | "completed"
    | "cancelled"
    | "started"
    | "newBooking"
    | "newService"
    | "default";

export interface NotificationVariant {
    /** Car glyph icon exported from Figma (assets/images/notifications). */
    icon: ImageSourcePropType;
    /** Unread-style dot at the card's far visual edge. */
    dotColor: string;
}

const green: NotificationVariant = {
    icon: require("@/assets/images/notifications/car-new-booking.png"),
    dotColor: colors.status.completed.text,
};
const red: NotificationVariant = {
    icon: require("@/assets/images/notifications/car-cancelled.png"),
    dotColor: colors.status.cancelled.text,
};
const amber: NotificationVariant = {
    icon: require("@/assets/images/notifications/car-started.png"),
    dotColor: colors.status.pending.text,
};
const blue: NotificationVariant = {
    icon: require("@/assets/images/notifications/car-new-service.png"),
    dotColor: colors.status.info.text,
};

export const NOTIFICATION_VARIANTS: Record<NotificationType, NotificationVariant> = {
    completed: green,
    newBooking: green,
    cancelled: red,
    started: amber,
    newService: blue,
    default: blue,
};

/**
 * Keyword rules checked in order; cancellation first because titles like
 * "تم الغاء الحجز" also contain "حجز". Covers both hamza spellings.
 */
export function deriveNotificationType(title: string): NotificationType {
    if (/إلغاء|الغاء|ألغى|الغى/.test(title)) return "cancelled";
    if (title.includes("اكتمل")) return "completed";
    if (title.includes("بدأ")) return "started";
    if (/حجز جديد|وصل حجز/.test(title)) return "newBooking";
    if (title.includes("خدمة")) return "newService";
    return "default";
}
