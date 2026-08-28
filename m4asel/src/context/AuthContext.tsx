import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import { env } from "@/src/config/env";
import { supabase } from "@/src/config/supabase";
import { registerAuthDeepLinkListener } from "@/src/services/auth.service";
import { buildMockProfile } from "@/src/services/mockProfile";
import type { AuthContextType, UserProfileRead } from "@/types/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Access auth state + profile. Throws if used outside <AuthProvider>. */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
//unify data fetching by somthing like react quere or if not found a custom made one
//
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the backend profile for the signed-in Supabase user (token added by apiClient).
  const fetchProfile = async (sessionUser: User): Promise<void> => {
    try {
      const profileData = await apiClient.get<UserProfileRead>(endpoints.users.profile);
      setProfile(Object.freeze(profileData));
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (env.useMockProfile) {
        // Backend doesn't verify Supabase tokens yet — stand in a dev-only
        // profile so the rest of the app is still usable. See mockProfile.ts.
        setProfile(Object.freeze(buildMockProfile(sessionUser)));
        setError(null);
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      setProfile(null);
    }
  };

  useEffect(() => {
    const removeDeepLinkListener = registerAuthDeepLinkListener();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setProfile(null);
        setError(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      removeDeepLinkListener();
    };
  }, []);

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      setLoading(true);
      await fetchProfile(user);
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    refreshProfile,
    isAuthenticated: !!user,
    role: profile?.user_role,
    washerProfile: profile?.washer_profile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
