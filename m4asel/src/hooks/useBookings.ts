import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { bookingsService } from "@/src/services/bookings.service";

export const bookingsKeys = {
  all: ["bookings"] as const,
};

/** All bookings for the signed-in user (customer or washer). Cached + deduped. */
export function useBookings() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: bookingsKeys.all,
    queryFn: () => bookingsService.list(),
    enabled: isAuthenticated,
  });
}
