import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import type { NotificationRead } from "@/types/api";

export const notificationsService = {
  list: () => apiClient.get<NotificationRead[]>(endpoints.notifications.root),
};
