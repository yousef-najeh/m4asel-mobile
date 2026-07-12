import { useQuery } from "@tanstack/react-query";
import { washersService } from "@/src/features/washers/services/washers.service";

/** Available booking times for a washer's service on a given date. */
export function useTimeSlots(washerId: string, serviceId: number | undefined, date: string) {
  return useQuery({
    queryKey: ["timeSlots", washerId, serviceId, date],
    queryFn: () => washersService.availableTimes(washerId, serviceId as number, date),
    enabled: Boolean(washerId && serviceId && date),
  });
}
