// app/(main)/_layout.jsx   ← save exactly this

import {router, Stack, Tabs} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View, StyleSheet } from "react-native";

export default function MainLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />

      <Tabs
        screenOptions={{ headerShown: true }}
        tabBar={({ state }) => {
          const currentRoute = state.routes[state.index].name;

          return (
            <View style={styles.container}>
              <View style={styles.bottomBar}>
                <Pressable
                  onPress={() => router.replace("/(main)/History")}
                  style={[
                    styles.tabButton,
                    currentRoute === "History" && styles.activeTab,
                  ]}
                >
                  <Text style={[styles.tabText, currentRoute === "History" && styles.activeText]}>
                    السجل
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.replace("/(main)/MapPage")}
                  style={[
                    styles.tabButton,
                    currentRoute === "MapPage" && styles.activeTab,
                  ]}
                >
                  <Text style={[styles.tabText, currentRoute === "MapPage" && styles.activeText]}>
                    الخريطة
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.replace("/(main)/ProfilePage")}
                  style={[
                    styles.tabButton,
                    currentRoute === "ProfilePage" && styles.activeTab,
                  ]}
                >
                  <Text style={[styles.tabText, currentRoute === "ProfilePage" && styles.activeText]}>
                    الملف الشخصي
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      >
        <Tabs.Screen name="History" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="MapPage" options={{ title: "الخريطة", tabBarButton: () => null }} />
        <Tabs.Screen name="ProfilePage" options={{ tabBarButton: () => null }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30, 
    pointerEvents: "box-none",
  },

  bottomBar: {
    width: "85%",                   
    maxWidth: 420,
    height: 70,
    backgroundColor: "#90CAF9", 
    flexDirection: "row",
    borderRadius: 35,                
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  activeTab: {
    backgroundColor: "#BBDEFB",     
    borderRadius: 30,
    marginHorizontal: 6,
    marginVertical: 6,
  },

  tabText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },

  activeText: {
    color: "blue",               
    fontWeight: "800",
  },
});