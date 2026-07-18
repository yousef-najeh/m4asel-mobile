import { onAuthStateChanged, type User } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import { auth } from "@/src/config/firebase";
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

  // Fetch the backend profile for the signed-in Firebase user (token added by apiClient).
  const fetchProfile = async (): Promise<void> => {
    try {
      const profileData = await apiClient.get<UserProfileRead>(endpoints.users.profile);
      setProfile(Object.freeze(profileData));
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchProfile();
      } else {
        setProfile(null);
        setError(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async (): Promise<void> => {
    if (auth.currentUser) {
      setLoading(true);
      await fetchProfile();
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
