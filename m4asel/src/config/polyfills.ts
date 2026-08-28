// Must be imported before anything touches @supabase/supabase-js — Hermes/RN
// lacks a few URL APIs the client relies on (used by src/config/supabase.ts).
// Import this file first, at the top of app/_layout.tsx.
import "react-native-url-polyfill/auto";
