/**
 * Central, typed access to public runtime config.
 *
 * Read config here once instead of scattering `process.env.EXPO_PUBLIC_*`
 * literals across ~10 files.
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const USE_MOCK_PROFILE = process.env.EXPO_PUBLIC_USE_MOCK_PROFILE === "true";

if (!API_BASE_URL) {
  // A missing base URL means every request 404s silently — fail loud in logs.
  console.warn(
    "[config] EXPO_PUBLIC_API_BASE_URL is not set — API requests will fail. Add it to m4asel/.env",
  );
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Missing Supabase config means every sign-in call throws at the network layer.
  console.warn(
    "[config] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY are not set — " +
      "Supabase auth will fail. Add them to m4asel/.env (see .env.example).",
  );
}

export const env = {
  apiBaseUrl: API_BASE_URL ?? "",
  supabaseUrl: SUPABASE_URL ?? "",
  supabaseAnonKey: SUPABASE_ANON_KEY ?? "",
  /**
   * Dev-only fallback: stand in a stub profile when the backend rejects/doesn't
   * recognize the Supabase session yet. The backend still verifies Firebase ID
   * tokens as of this writing — see docs/supabase-auth-migration.md. Never
   * enabled outside __DEV__, regardless of the env value.
   */
  useMockProfile: __DEV__ && USE_MOCK_PROFILE,
} as const;
