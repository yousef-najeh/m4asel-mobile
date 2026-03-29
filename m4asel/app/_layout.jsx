// app/_layout.jsx
import { Slot } from "expo-router";
import { AuthProvider } from "./Context/AuthContext";  // ← correct path
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

// Suppress SafeAreaView deprecation warning from expo-router (internal dependency issue)
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead.",
]);

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <StatusBar style="light" />
                <GluestackUIProvider mode="dark">
                    <Slot />
                </GluestackUIProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}