// Supabase client (auth only, for now) with AsyncStorage-backed session
// persistence — the RN equivalent of src/config/firebase.ts.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import { env } from "@/src/config/env";

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // There's no browser location bar in React Native to parse a redirect
    // from — the OAuth callback URL is handled manually (see auth.service.ts).
    detectSessionInUrl: false,
  },
});

// Supabase's token auto-refresh timer needs a manual nudge on RN: pause it
// while the app is backgrounded, resume when it's foregrounded, or refreshes
// either pile up or stop firing altogether. See Supabase's Expo auth guide.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
