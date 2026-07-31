import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import type { BookmarkCreate, NearbyWasherResponse } from "@/types/api";

export const bookmarksService = {
  /** The customer's bookmarked washers, with distance/availability computed from lat/lng. */
  list: (lat: number, lng: number, name?: string) =>
    apiClient.get<NearbyWasherResponse[]>(endpoints.bookmarks.root, {
      query: { lat, lng, name },
    }),

  /** Bookmark a washer (backend treats re-bookmarking as a no-op). */
  add: (washerId: number) =>
    apiClient.post<void>(endpoints.bookmarks.root, { washer_id: washerId } as BookmarkCreate),

  /** Remove a bookmarked washer. */
  remove: (washerId: number) =>
    apiClient.delete<void>(endpoints.bookmarks.byWasherId(washerId)),
};
