import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/features/auth";
import { notificationsService } from "../services/notifications.service";

/** The signed-in user's notifications. Cached + deduped by React Query. */
export function useNotifications() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsService.list(),
    enabled: isAuthenticated,
  });
}
