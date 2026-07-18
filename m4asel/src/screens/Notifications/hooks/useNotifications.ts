import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { notificationsService } from "@/src/services/notifications.service";

/** The signed-in user's notifications. Cached + deduped by React Query. */
export function useNotifications() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsService.list(),
    enabled: isAuthenticated,
  });
}
