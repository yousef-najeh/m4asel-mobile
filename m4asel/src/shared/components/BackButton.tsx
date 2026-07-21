import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "@/src/theme";

/** Filled blue circular back button used in stack headers. */
export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      onPress={() => router.back()}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="رجوع"
    >
      <Icon name="arrow-back" type="material" size={22} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});
