import { useQuery } from "@tanstack/react-query";
import { washersService } from "../services/washers.service";

/** A single washer's full profile (incl. services) by id. */
export function useWasher(id: string) {
  return useQuery({
    queryKey: ["washer", id],
    queryFn: () => washersService.getById(id),
    enabled: Boolean(id),
  });
}
