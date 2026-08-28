/**
 * Backend endpoint paths in one place (mirrors the FastAPI routes).
 * Paths that take an id are functions; static paths are strings.
 */
export const endpoints = {
  users: {
    profile: "/users/profile",
    register: "/users/register",
    update: "/users/profile",
    changePassword: "/users/change-password",
  },
  bookings: {
    root: "/bookings/",
    status: (id: number | string) => `/bookings/${id}/status`,
  },
  washers: {
    root: "/washers/",
    profile: "/washers/profile",
    nearby: "/washers",
    byId: (id: number | string) => `/washers/${id}`,
    // The washer is derived from the auth token — no washer id in the path.
    services: "/washers/services",
    service: (serviceId: number | string) => `/washers/services/${serviceId}`,
    availableTimes: (washerId: number | string, serviceId: number | string) =>
      `/washers/${washerId}/services/${serviceId}/available-times`,
  },
  notifications: {
    root: "/notifications/",
  },
  bookmarks: {
    root: "/bookmarks/",
    byWasherId: (washerId: number | string) => `/bookmarks/${washerId}`,
  },
} as const;
