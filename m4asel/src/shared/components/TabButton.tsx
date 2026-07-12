import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { router, type Href } from 'expo-router';

interface TabButtonProps {
  route: string;
  currentRoute: string;
  iconName: string;
  iconType?: string;
  label: string;
}

export default function TabButton({ route, currentRoute, iconName, iconType = "material", label }: TabButtonProps) {
  const isActive = currentRoute === route.split('/').pop();

  return (
    <Pressable
      onPress={() => router.replace(route as Href)}
      style={styles.tabButton}
    >
      <View style={[
        styles.tabContent,
        isActive && styles.activeTabContent
      ]}>
        <Icon
          name={iconName}
          type={iconType}
          size={24}
          color={isActive ? "#FFFFFF" : "#6B7280"}
        />
        <Text style={[
          styles.tabText,
          isActive && styles.activeText
        ]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
