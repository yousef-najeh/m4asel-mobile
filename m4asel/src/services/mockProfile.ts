import type { User } from "@supabase/supabase-js";
import { UserRole } from "@/src/constants/UserRole";
import { getUserDisplayName } from "@/src/utils/supabaseUser";
import type { UserProfileRead } from "@/types/api";

/**
 * Dev-only stand-in profile, used while the backend still verifies Firebase
 * ID tokens and doesn't recognize Supabase-issued ones yet (see
 * docs/supabase-auth-migration.md). Gated behind EXPO_PUBLIC_USE_MOCK_PROFILE
 * so the Google sign-in flow can be exercised end-to-end before the backend
 * migrates — never used outside __DEV__ (enforced in src/config/env.ts).
 */
export function buildMockProfile(user: User): UserProfileRead {
  return {
    id: 0,
    name: getUserDisplayName(user) ?? "مستخدم تجريبي",
    mobile_number: (user.user_metadata?.mobile_number as string | undefined) ?? "",
    user_role: UserRole.CONFIRMED_USER,
  };
}
