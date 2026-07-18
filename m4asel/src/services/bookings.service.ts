import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import type { Booking, BookingCreate, BookingStatusUpdate } from "@/types/api";

export const bookingsService = {
  list: () => apiClient.get<Booking[]>(endpoints.bookings.root),
  create: (payload: BookingCreate) => apiClient.post<Booking>(endpoints.bookings.root, payload),
  updateStatus: (id: number, body: BookingStatusUpdate) =>
    apiClient.patch<Booking>(endpoints.bookings.status(id), body),
};
