import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import ErrorState from "@/src/shared/components/ErrorState";
import LoadingState from "@/src/shared/components/LoadingState";
import type { WashService } from "@/types/api";
import ConfirmButton from "./components/ConfirmButton";
import ServiceCard from "./components/ServiceCard";
import WasherHeader from "./components/WasherHeader";
import { useWasher } from "./hooks/useWasher";
import { styles } from "./BookingServiceScreen.styles";

/** Booking step 1 — service selection (Figma 258:4262). */
export default function BookingServiceScreen() {
    const { washerId } = useLocalSearchParams<{ washerId: string }>();
    const insets = useSafeAreaInsets();

    const { data: washerDetails, isLoading, refetch } = useWasher(washerId);
    const [selectedService, setSelectedService] = useState<WashService | null>(null);

    if (isLoading) return <LoadingState />;
    if (!washerDetails) return <ErrorState onRetry={() => refetch()} />;

    const services = washerDetails.wash_services ?? [];

    const handleContinue = () => {
        if (!selectedService) return;
        router.push(`/(main)/BookingTimePage?washerId=${washerId}&serviceId=${selectedService.id}`);
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <WasherHeader washer={washerDetails} onBack={() => router.replace('/(main)/MapPage')} />

                <Text style={styles.sectionLabel}>اختر خدمتك:</Text>

                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        isSelected={selectedService?.id === service.id}
                        onSelect={setSelectedService}
                    />
                ))}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <ConfirmButton
                    label="اكمل الحجز!"
                    onConfirm={handleContinue}
                    disabled={!selectedService}
                />
            </View>
        </SafeAreaView>
    );
}
