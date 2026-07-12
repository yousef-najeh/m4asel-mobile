import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/features/auth";
import type { BookingStatusUpdate, OrderStatus } from "@/types/api";
import { bookingsService } from "../services/bookings.service";

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

export interface UpdateStatusInput {
  id: number;
  status: OrderStatus;
  cancelReason?: string | null;
}

/** Accept / complete / cancel a booking, then refresh the list. */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, cancelReason }: UpdateStatusInput) => {
      const body: BookingStatusUpdate = { status };
      if (cancelReason) body.cancel_reason = cancelReason;
      return bookingsService.updateStatus(id, body);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKeys.all }),
  });
}
