import { Stack } from "expo-router";
import { StyleSheet, Text } from "react-native";
import BackButton from "@/src/shared/components/BackButton";
import { colors } from "@/src/theme";

// Profile sub-pages push on top of the profile screen (and over the tab bar)
// rather than living as sibling tabs, so the account tab keeps its own history.
//
// The header is laid out LTR to match the rest of the app: circular back button
// on the left, blue title on the right.
const subPage = (title: string) => ({
  title,
  headerTitle: () => null,
  headerRight: () => <Text style={styles.title}>{title}</Text>,
});

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => <BackButton />,
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" options={subPage("تعديل الملف الشخصي")} />
      <Stack.Screen name="Security" options={subPage("الأمان وكلمة المرور")} />
      <Stack.Screen name="Help" options={subPage("المساعدة")} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
});
