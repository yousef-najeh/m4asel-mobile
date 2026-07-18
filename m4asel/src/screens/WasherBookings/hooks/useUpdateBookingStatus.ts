import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsKeys } from "@/src/hooks/useBookings";
import { bookingsService } from "@/src/services/bookings.service";
import type { BookingStatusUpdate, OrderStatus } from "@/types/api";

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
