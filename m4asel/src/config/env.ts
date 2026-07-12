/**
 * Central, typed access to public runtime config.
 *
 * Read config here once instead of scattering `process.env.EXPO_PUBLIC_*`
 * literals across ~10 files.
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  // A missing base URL means every request 404s silently — fail loud in logs.
  console.warn(
    "[config] EXPO_PUBLIC_API_BASE_URL is not set — API requests will fail. Add it to m4asel/.env",
  );
}

export const env = {
  apiBaseUrl: API_BASE_URL ?? "",
} as const;
