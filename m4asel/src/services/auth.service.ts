import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import { supabase } from "@/src/config/supabase";
import { normalizePhone } from "@/src/utils/helpers";

// Lets the in-app browser sheet used for Google sign-in close itself once the
// OAuth redirect lands, instead of leaving a dangling browser tab open.
WebBrowser.maybeCompleteAuthSession();

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
}

/** Arabic copy for the Supabase auth error messages surfaced on the login screen. */
export const authErrorMessages: Record<string, string> = {
  "Invalid login credentials": "رقم الجوال أو كلمة المرور غير صحيحة",
  "User already registered": "رقم الجوال هذا مستخدم بالفعل",
  "Phone not confirmed": "يرجى تأكيد رقم الجوال أولاً",
  "Password should be at least 6 characters": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
};

// Where Supabase sends the browser back after a Google login. Auto-resolves
// per environment: `exp://<ip>:<port>/--/auth-callback` in Expo Go, or
// `m4asel://auth-callback` in a dev/production build. Whichever it resolves
// to must be allow-listed under Authentication → URL Configuration →
// Redirect URLs in the Supabase dashboard, or the OAuth flow gets rejected
// before it ever opens (Supabase silently falls back to the Site URL, which
// usually isn't reachable from a phone — that's the "Safari can't connect"
// error). Add both `m4asel://auth-callback` and, for Expo Go testing,
// `exp://**` (the IP/port change every session, so an exact match won't work).
const redirectTo = makeRedirectUri({ path: "auth-callback" });

/** Turn the `#access_token=...&refresh_token=...` redirect into a live Supabase session. */
async function createSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) return null;

  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
  return data.session;
}

/**
 * Catches the OAuth redirect when it arrives outside the direct
 * `openAuthSessionAsync` return value — e.g. the app was cold-started by the
 * redirect. Call once near the app root; returns an unsubscribe function.
 */
export function registerAuthDeepLinkListener(): () => void {
  const subscription = Linking.addEventListener("url", ({ url }) => {
    createSessionFromUrl(url).catch((err) => console.error("[auth] deep link session failed", err));
  });

  Linking.getInitialURL().then((url) => {
    if (url) {
      createSessionFromUrl(url).catch((err) =>
        console.error("[auth] initial url session failed", err),
      );
    }
  });

  return () => subscription.remove();
}

export const authService = {
  async signIn(phone: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ phone: normalizePhone(phone), password });
    if (error) throw error;
  },

  signOut: () => supabase.auth.signOut(),

  /** Opens Google's consent screen in an in-app browser and waits for the redirect back. */
  async signInWithGoogle(): Promise<void> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) throw error;
    if (!data.url) throw new Error("لم يتم إنشاء رابط الدخول عبر Google");

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === "success") {
      await createSessionFromUrl(result.url);
    }
    // "cancel" / "dismiss" just means the user closed the sheet — not an error.
  },

  /**
   * The backend creates the account (both the Profile row and the Supabase
   * auth user, via the Admin API — phone pre-confirmed, mirroring the old
   * Firebase behavior) — see docs/supabase-auth-migration.md. The client
   * just signs in afterward.
   */
  async register(payload: RegisterPayload): Promise<void> {
    const normalized = { ...payload, phone: normalizePhone(payload.phone) };
    await apiClient.post(endpoints.users.register, normalized, { authenticated: false });
    const { error } = await supabase.auth.signInWithPassword({
      phone: normalized.phone,
      password: normalized.password,
    });
    if (error) throw error;
  },
};
