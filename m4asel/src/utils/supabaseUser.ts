import type { User } from "@supabase/supabase-js";

/**
 * Best-effort display name from a Supabase user's OAuth metadata. Google
 * populates `full_name`/`name`; email/password sign-ups have neither, so this
 * falls back to the email. Unlike Firebase's `user.displayName`, Supabase
 * doesn't have a dedicated field for this.
 */
export function getUserDisplayName(user: User): string | undefined {
  const metadata = user.user_metadata ?? {};
  return (
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    user.email ??
    undefined
  );
}
