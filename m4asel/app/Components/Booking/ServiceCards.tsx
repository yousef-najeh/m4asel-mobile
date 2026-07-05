import { View, StyleSheet } from "react-native";
import ServiceCard from "./ServiceCard";
import type { WashService } from '@/types/api';

interface ServiceCardsProps {
    services?: WashService[] | null;
    selectedService: WashService | null;
    onSelectService: (service: WashService) => void;
}

function ServiceCards({ services, selectedService, onSelectService }: ServiceCardsProps) {
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
