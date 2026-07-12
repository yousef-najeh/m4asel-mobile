// context/AuthContext.tsx

import { onAuthStateChanged, type User } from "firebase/auth";
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type PropsWithChildren,
} from "react";
import { auth } from "../../util/fireBaseConfig";
import type { AuthContextType, UserProfileRead } from "@/types/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// Provider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfileRead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch profile data from API
    const fetchProfile = async (firebaseUser: User): Promise<void> => {
        try {
            const token = await firebaseUser.getIdToken();
            console.log("Fetching profile with token:", token);
            const response = await fetch(`${apiUrl}/users/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.status}`);
            }

            const profileData = (await response.json()) as UserProfileRead;
            setProfile(Object.freeze(profileData));
            setError(null);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch profile');
            setProfile(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            setUser(firebaseUser);

            if (firebaseUser) {
                await fetchProfile(firebaseUser);
            } else {
                setProfile(null);
                setError(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Helper to refresh profile data
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
};

// Default export for Expo Router (to prevent route warning)
export default AuthProvider;
