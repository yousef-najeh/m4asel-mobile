// app/(main)/_layout.jsx   ← save exactly this

import {router, Stack, Tabs} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';

export default function MainLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={({ state }) => {
          const currentRoute = state.routes[state.index].name;

          return (
            <View style={styles.container}>
              <View style={styles.bottomBar}>
                <Pressable
                  onPress={() => router.replace("/(main)/ProfilePage")}
                  style={styles.tabButton}
                >
                  <View style={[
                    styles.tabContent,
                    currentRoute === "ProfilePage" && styles.activeTabContent
                  ]}>
                    <Icon
                      name="person"
                      type="material"
                      size={24}
                      color={currentRoute === "ProfilePage" ? "#FFFFFF" : "#6B7280"}
                    />
                    <Text style={[
                      styles.tabText,
                      currentRoute === "ProfilePage" && styles.activeText
                    ]}>
                      حسابك
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => router.replace("/(main)/MapPage")}
                  style={styles.tabButton}
                >
                  <View style={[
                    styles.tabContent,
                    currentRoute === "MapPage" && styles.activeTabContent
                  ]}>
                    <Icon
                      name="map"
                      type="material"
                      size={24}
                      color={currentRoute === "MapPage" ? "#FFFFFF" : "#6B7280"}
                    />
                    <Text style={[
                      styles.tabText,
                      currentRoute === "MapPage" && styles.activeText
                    ]}>
                      الخريطة
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => router.replace("/(main)/History")}
                  style={styles.tabButton}
                >
                  <View style={[
                    styles.tabContent,
                    currentRoute === "History" && styles.activeTabContent
                  ]}>
                    <Icon
                      name="history"
                      type="material"
                      size={24}
                      color={currentRoute === "History" ? "#FFFFFF" : "#6B7280"}
                    />
                    <Text style={[
                      styles.tabText,
                      currentRoute === "History" && styles.activeText
                    ]}>
                      السجل
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          );
        }}
      >
        <Tabs.Screen name="History" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="MapPage" options={{tabBarButton: () => null }} />
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

  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 70,
    gap: 4,
  },

  activeTabContent: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  tabText: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  activeText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});