import { Pressable, View, Text, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';

function ServiceCard({ service, isSelected, onSelect }) {
    return (
        <Pressable
            style={[
                styles.serviceCard,
                isSelected && styles.serviceCardSelected
            ]}
            onPress={() => onSelect(service)}
        >
            <View style={styles.serviceHeader}>
                <Icon 
                    name="local-car-wash" 
                    type="material" 
                    size={24} 
                    color={isSelected ? "#007AFF" : "#6B7280"} 
                />
                {isSelected && (
                    <Icon name="check-circle" type="material" size={20} color="#34C759" />
                )}
            </View>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription} numberOfLines={2}>
                {service.description}
            </Text>
            <View style={styles.serviceFooter}>
                <View style={styles.serviceDetail}>
                    <Icon name="payments" type="material" size={16} color="#059669" />
                    <Text style={styles.servicePrice}>{service.price} nis</Text>
                </View>
                <View style={styles.serviceDetail}>
                    <Icon name="timer" type="material" size={16} color="#7C3AED" />
                    <Text style={styles.serviceDuration}>{service.duration_minutes} د</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    serviceCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    serviceCardSelected: {
        borderColor: "#007AFF",
        backgroundColor: "#F0F7FF",
    },
    serviceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
    },
    serviceDescription: {
        fontSize: 13,
        color: "#6B7280",
        lineHeight: 18,
        marginBottom: 12,
    },
    serviceFooter: {
        flexDirection: "row",
        gap: 16,
    },
    serviceDetail: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: "700",
        color: "#059669",
    },
    serviceDuration: {
        fontSize: 14,
        fontWeight: "700",
        color: "#7C3AED",
    },
});

export default ServiceCard;
