import { View, StyleSheet } from "react-native";
import ServiceCard from "./ServiceCard";

function ServiceCards({ services, selectedService, onSelectService }) {
    return (
        <View style={styles.grid}>
            {services?.map((service) => (
                <View key={service.id} style={styles.gridItem}>
                    <ServiceCard
                        service={service}
                        isSelected={selectedService?.id === service.id}
                        onSelect={onSelectService}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    gridItem: {
        width: "48%",
    },
});

export default ServiceCards;
