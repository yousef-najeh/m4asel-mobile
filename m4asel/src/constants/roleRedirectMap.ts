import type { Href } from "expo-router";
import { UserRole } from "@/src/constants/UserRole";

/** Where each role lands after authentication. */
export const roleRedirectMap: Partial<Record<UserRole, Href>> = {
  [UserRole.WASHER_OWNER]: "/(main)/Bookings",
  [UserRole.WASHER_WORKER]: "/(main)/Bookings",
  [UserRole.CONFIRMED_USER]: "/(main)/MapPage",
  [UserRole.UNCONFIRMED_USER]: "/(main)/MapPage",
};

/** Fallback route when a role has no explicit mapping. */
export const DEFAULT_REDIRECT: Href = "/(main)/ProfilePage";

/** Resolve the post-auth destination for a role. */
export const resolveRoleRedirect = (role: UserRole | undefined): Href =>
  (role && roleRedirectMap[role]) || DEFAULT_REDIRECT;
