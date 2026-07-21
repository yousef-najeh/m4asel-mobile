import { Slot } from "expo-router";
import { I18nManager, LogBox } from "react-native";
import { AppProviders } from "@/src/providers";
import "@/global.css";

// Suppress SafeAreaView deprecation warning from expo-router (internal dependency issue)
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead.",
]);

// The app is Arabic-first and always RTL, regardless of device locale.
// I18nManager's layout direction is fixed at native launch — flipping it here
// only takes effect after the app is fully closed and reopened (not a JS/Fast
// Refresh reload). If the UI still renders LTR, restart the app, don't reload it.
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function RootLayout() {
    return (
        <AppProviders>
            <Slot />
        </AppProviders>
    );
}