import { Pressable } from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "@/src/theme";
import { styles } from "./BackCircle.styles";

/**
 * Solid blue circular back button (Figma 258:4367).
 * Booking routes live in the Tabs navigator where router.back() is unreliable,
 * so each caller passes an explicit navigation action.
 */
export default function BackCircle({ onPress }: { onPress: () => void }) {
    return (
        <Pressable style={styles.btn} onPress={onPress} accessibilityLabel="رجوع">
            <Icon name="arrow-back" type="material" size={20} color={colors.onPrimary} />
        </Pressable>
    );
}
