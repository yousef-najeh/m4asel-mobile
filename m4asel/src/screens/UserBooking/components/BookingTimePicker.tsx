import { useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import HourMinutePicker, { type HoursMap } from "@/src/shared/components/HourMinutePicker";
import { useTimeSlots } from "../hooks/useTimeSlots";
import { toHHMM } from "@/src/utils/helpers";
import { colors, fontSize, radius } from "@/src/theme";

interface BookingTimePickerProps {
    washerId: string;
    serviceId: number;
    date: string;
    /** Selected time as "HH:MM" (or null). Emitted as "HH:MM". */
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
}

const CARD_HEIGHT = 220;

/**
 * Booking time picker — wraps the shared `HourMinutePicker` and drives it from
 * the washer's available slots. Hours with no slots are hidden, and each hour's
 * minute column lists only the minutes that are actually available, so every
 * composed "HH:MM" is a real bookable slot.
 */
export default function BookingTimePicker({
    washerId,
    serviceId,
    date,
    selectedTime,
    onSelectTime,
}: BookingTimePickerProps) {
    const { data, isLoading } = useTimeSlots(washerId, serviceId, date);

    // Normalize API slots (ISO datetime or "HH:MM[:SS]") to bare "HH:MM".
    const normalized = useMemo(
        () => (data ?? []).map((s) => toHHMM(s)).filter((s): s is string => !!s),
        [data],
    );

    // Build the hour → minutes map that drives the picker. Each available hour is
    // a key; its value is the sorted list of available minutes for that hour.
    const hoursMap = useMemo<HoursMap>(() => {
        const map: HoursMap = {};
        for (const t of normalized) {
            const [h, m] = t.split(":");
            if (!map[h]) map[h] = [];
            if (!map[h].includes(m)) map[h].push(m);
        }
        for (const h of Object.keys(map)) map[h].sort();
        return map;
    }, [normalized]);

    // Auto-select the first available slot when the list (re)loads with nothing
    // chosen (e.g. after a date change reset the selection).
    useEffect(() => {
        if (!selectedTime && normalized.length > 0) {
            onSelectTime(normalized[0]);
        }
    }, [normalized, selectedTime, onSelectTime]);

    const value = selectedTime ? toHHMM(selectedTime) : null;

    if (isLoading) {
        return (
            <View style={[styles.card, styles.center]}>
                <ActivityIndicator size="small" />
                <Text style={styles.stateText}>جارٍ تحميل الأوقات...</Text>
            </View>
        );
    }

    if (normalized.length === 0) {
        return (
            <View style={[styles.card, styles.center]}>
                <Text style={styles.stateText}>لا توجد أوقات متاحة في هذا اليوم</Text>
            </View>
        );
    }

    return (
        <HourMinutePicker
            value={value}
            onChange={onSelectTime}
            hours={hoursMap}
            emptyText="لا توجد دقائق متاحة"
        />
    );
}

const styles = StyleSheet.create({
    card: {
        height: CARD_HEIGHT,
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primaryFaint,
        overflow: "hidden",
    },
    center: { justifyContent: "center", alignItems: "center", gap: 8 },
    stateText: { color: colors.textSecondary, fontSize: fontSize.sm },
});