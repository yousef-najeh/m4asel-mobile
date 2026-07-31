import { Image, Text, View } from "react-native";
import type { WasherProfile } from "@/types/api";
import BackCircle from "./BackCircle";
import { styles } from "./WasherHeader.styles";

/**
 * Service-select header (Figma 258:4360): back circle at the visual left,
 * washer name/address + avatar at the visual right. Rows are written in
 * visual left→right order per the project convention.
 * The API has no avatar field, so a placeholder profile image is used.
 */
interface WasherHeaderProps {
    washer: WasherProfile;
    onBack: () => void;
}

export default function WasherHeader({ washer, onBack }: WasherHeaderProps) {
    return (
        <View style={styles.row}>
            <BackCircle onPress={onBack} />
            <View style={styles.spacer} />
            <View style={styles.textCol}>
                <Text style={styles.name} numberOfLines={1}>{washer.display_name}</Text>
                <Text style={styles.address} numberOfLines={1}>{washer.address}</Text>
            </View>
            <Image source={require("@/assets/images/user-profile.webp")} style={styles.avatar} />
        </View>
    );
}
