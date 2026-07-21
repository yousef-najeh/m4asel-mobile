import type { OrderStatus } from '@/types/api';

interface StatusConfig {
    label: string;
    color: string;
    badgeIcon: string;
}

export const statusConfig: Record<OrderStatus, StatusConfig> = {
    pending:     { label: "قيد الانتظار", color: "#E3AE28", badgeIcon: "schedule" },
    in_progress: { label: "جاري",          color: "#E3AE28", badgeIcon: "autorenew" },
    completed:   { label: "مكتمل",         color: "#059669", badgeIcon: "check" },
    cancelled:   { label: "ملغي",          color: "#E62B2E", badgeIcon: "close" },
};
