// context/AuthContext.jsx   ← Save exactly this (overwrite the old one)

import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../util/fireBaseConfig";
import { registerFcmToken } from "../utils/fcm";

export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch profile data from API
    const fetchProfile = async (firebaseUser) => {
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

            const profileData = await response.json();
            setProfile(Object.freeze(profileData));
            setError(null);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message);
            setProfile(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            setUser(firebaseUser);

            if (firebaseUser) {
                await fetchProfile(firebaseUser);
                registerFcmToken(firebaseUser);
            } else {
                setProfile(null);
                setError(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Helper to refresh profile data
    const refreshProfile = async () => {
        if (user) {
            setLoading(true);
            await fetchProfile(user);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                error,
                refreshProfile,
                isAuthenticated: !!user,
                role: profile?.user_role,
                washerProfile: profile?.washer_profile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Default export for Expo Router (to prevent route warning)
export default AuthProvider;