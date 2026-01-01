// context/AuthContext.jsx   ← Save exactly this (overwrite the old one)

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../util/fireBaseConfig";

export const AuthContext = createContext();

// 2. Custom hook — THIS IS WHAT WAS MISSING
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 3. Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
        setUser(usr);
        setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
        {children}
        </AuthContext.Provider>
    );
};

// Default export for Expo Router (to prevent route warning)
export default AuthProvider;