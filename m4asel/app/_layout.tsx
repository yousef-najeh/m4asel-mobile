import { Slot } from "expo-router";
import { LogBox } from "react-native";
import { AppProviders } from "@/src/providers";
import "@/global.css";

// Suppress SafeAreaView deprecation warning from expo-router (internal dependency issue)
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead.",
]);

export default function RootLayout() {
    return (
        <AppProviders>
            <Slot />
        </AppProviders>
    );
}