export const UserRole = {
  ADMIN: "admin",
  CONFIRMED_USER: "confirmed_user",
  UNCONFIRMED_USER: "unconfirmed_user",
  WASHER_OWNER: "washer_owner",
  WASHER_WORKER: "washer_worker",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
