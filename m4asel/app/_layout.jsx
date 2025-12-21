// app/_layout.jsx
import { Slot } from "expo-router";
import { AuthProvider } from "./Context/AuthContext";  // ← correct path
import { StatusBar } from "expo-status-bar";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style="light" />
            <GluestackUIProvider mode="dark">
                <Slot />
            </GluestackUIProvider>
    </AuthProvider>
    );
}