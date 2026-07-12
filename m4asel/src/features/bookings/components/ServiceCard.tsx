import { Pressable, View, Text } from "react-native";
import { Icon } from 'react-native-elements';
import type { WashService } from '@/types/api';
import { styles } from "../styles/ServiceCard.styles";

interface ServiceCardProps {
    service: WashService;
    isSelected: boolean;
    onSelect: (service: WashService) => void;
}

export default function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
    return (
        <Pressable
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelect(service)}
        >
            {/* Selected check */}
            {isSelected && (
                <View style={styles.checkBadge}>
                    <Icon name="check" type="material" size={12} color="#fff" />
                </View>
            )}

            <Icon
                name="local-car-wash"
                type="material"
                size={26}
                color={isSelected ? '#007AFF' : '#9CA3AF'}
            />

            <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={2}>
                {service.name}
            </Text>

            {service.description ? (
                <Text style={styles.desc} numberOfLines={2}>{service.description}</Text>
            ) : null}

            <View style={styles.chips}>
                <View style={[styles.chip, styles.chipGreen]}>
                    <Icon name="payments" type="material" size={12} color="#059669" />
                    <Text style={[styles.chipText, { color: '#059669' }]}>{service.price} nis</Text>
                </View>
                <View style={[styles.chip, styles.chipPurple]}>
                    <Icon name="timer" type="material" size={12} color="#7C3AED" />
                    <Text style={[styles.chipText, { color: '#7C3AED' }]}>{service.duration_minutes} د</Text>
                </View>
            </View>
        </Pressable>
    );
}
