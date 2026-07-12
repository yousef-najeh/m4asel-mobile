import { View } from "react-native";
import ServiceCard from "./ServiceCard";
import type { WashService } from '@/types/api';
import { styles } from "../styles/ServiceCards.styles";

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

export default ServiceCards;
