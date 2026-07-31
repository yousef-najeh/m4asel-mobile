import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import type {
  NearbyWasherResponse,
  WasherProfile,
  WashService,
  WashServiceCreate,
  WashServiceUpdate,
} from "@/types/api";

export const washersService = {
  getById: (id: string | number) => apiClient.get<WasherProfile>(endpoints.washers.byId(id)),

  nearby: (lat: number, lng: number) =>
    apiClient.get<NearbyWasherResponse[]>(endpoints.washers.nearby, {
      query: { lat, lng },
    }),

  availableTimes: (washerId: string | number, serviceId: number, date: string) =>
    apiClient.get<string[]>(endpoints.washers.availableTimes(washerId, serviceId), {
      query: { date },
    }),

  createService: (payload: WashServiceCreate) =>
    apiClient.post<WashService>(endpoints.washers.services, payload),

  updateService: (serviceId: string | number, payload: WashServiceUpdate) =>
    apiClient.put<WashService>(endpoints.washers.service(serviceId), payload),

  deleteService: (serviceId: string | number) =>
    apiClient.delete<void>(endpoints.washers.service(serviceId)),

  // NOTE: endpoint contract assumed — `/washers/` is token-derived (see endpoints.ts),
  // like createService. If the backend instead expects these on `/users/profile` or
  // nested under `washer_profile`, swap the endpoint/payload here.
  updateHours: (payload: { opening_time: string; closing_time: string }) =>
    apiClient.put<WasherProfile>(endpoints.washers.root, payload),
};
