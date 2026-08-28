import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BookingCreate } from "@/types/api";
import { bookingsService } from "@/src/services/bookings.service";
import { bookingsKeys } from "@/src/hooks/useBookings";

/** Create a booking, then invalidate the bookings list so it reflects the new order. */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingCreate) => bookingsService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKeys.all }),
  });
}
