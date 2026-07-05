import { Pressable, View, Text, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';
import type { WashService } from '@/types/api';

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

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#EFF6FF',
        shadowColor: '#007AFF',
        shadowOpacity: 0.12,
    },
    checkBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'right',
    },
    nameSelected: {
        color: '#1D4ED8',
    },
    desc: {
        fontSize: 12,
        color: '#9CA3AF',
        lineHeight: 17,
        textAlign: 'right',
    },
    chips: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
    },
    chipGreen: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
    chipPurple: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
    chipText: { fontSize: 11, fontWeight: '700' },
});
