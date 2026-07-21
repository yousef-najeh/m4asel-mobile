// app/(main)/_layout.jsx   ← save exactly this

import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import TabButton from "@/src/shared/components/TabButton";
import { UserRole } from "@/src/constants/UserRole";

const allTabs = [
  { route: "/(main)/ProfilePage", iconName: "person", label: "حسابك", showFor: "all" },
  { route: "/(main)/Notifications", iconName: "notifications", label: "الإشعارات", showFor: "all" },
  { route: "/(main)/MapPage", iconName: "map", label: "الخريطة", showFor: "regularUser" },
  { route: "/(main)/Bookings", iconName: "handyman", label: "الطلبات", showFor: "washer" },
  { route: "/(main)/History", iconName: "history", label: "حجوزاتي", showFor: "regularUser" },
  { route: "/(main)/History", iconName: "history", label: "السجل", showFor: "washer" },
];

export default function MainLayout() {
  const { role } = useAuth();
  const isWasher = role === UserRole.WASHER_OWNER || role === UserRole.WASHER_WORKER;
  
  const tabs = allTabs.filter(tab => 
    tab.showFor === "all" || 
    (tab.showFor === "washer" && isWasher) || 
    (tab.showFor === "regularUser" && !isWasher)
  );

  return (
    <>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={({ state }) => {
          const currentRoute = state.routes[state.index].name;

          const hiddenScreens = ['WasherDetails', 'BookingServicePage', 'BookingTimePage'];
          if (hiddenScreens.includes(currentRoute)) return null;

          return (
            <View style={styles.container}>
              <View style={styles.bottomBar}>
                {tabs.map((tab, index) => (
                  <TabButton
                    key={index}
                    route={tab.route}
                    currentRoute={currentRoute}
                    iconName={tab.iconName}
                    label={tab.label}
                  />
                ))}
              </View>
            </View>
          );
        }}
      >
        <Tabs.Screen name="Bookings" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="History" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="MapPage" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="Notifications" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="ProfilePage" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="WasherDetails" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="BookingServicePage" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="BookingTimePage" options={{ tabBarButton: () => null }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },

  bottomBar: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
});