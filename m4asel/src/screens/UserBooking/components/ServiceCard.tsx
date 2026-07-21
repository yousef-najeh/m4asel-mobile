import { Image, Pressable, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "@/src/theme";
import type { WashService } from "@/types/api";
import { styles } from "./ServiceCard.styles";

interface ServiceCardProps {
    service: WashService;
    isSelected: boolean;
    onSelect: (service: WashService) => void;
}

/**
 * Full-width service row card (Figma 276:2214 "Service Card").
 * Visual order: illustration (left) — text column (right, RTL-aligned).
 * Selected state: primary tint background + primary border.
 */
export default function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
    return (
        <Pressable
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelect(service)}
            accessibilityState={{ selected: isSelected }}
        >
            <Image source={require("@/assets/images/booking-service.png")} style={styles.illustration} />

            <View style={styles.textCol}>
                <Text style={styles.name} numberOfLines={1}>{service.name}</Text>
                <Text style={styles.description} numberOfLines={1}>{service.description}</Text>

                {/* Bottom row (visual left→right): duration chip — price — select circle */}
                <View style={styles.bottomRow}>
                    <View style={styles.durationChip}>
                        <Icon name="timer" type="material" size={12} color={colors.textTertiary} />
                        <Text style={styles.durationText}>يحتاج {service.duration_minutes} دقائق</Text>
                    </View>
                    <Text style={styles.price}>₪ {service.price}</Text>
                    <View style={[styles.selectCircle, isSelected && styles.selectCircleSelected]}>
                        <Icon
                            name="arrow-forward"
                            type="material"
                            size={14}
                            color={isSelected ? colors.onPrimary : colors.textMuted}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    );
}
