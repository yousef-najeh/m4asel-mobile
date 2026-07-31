import { useEffect, useRef } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useTimeSlots } from "../hooks/useTimeSlots";
import { slotParts } from "../utils";
import { ITEM_HEIGHT, styles, VISIBLE_ROWS } from "./TimeWheel.styles";

interface TimeWheelProps {
    washerId: string;
    serviceId: number;
    date: string;
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
}

const SPACER_ROWS = Math.floor(VISIBLE_ROWS / 2);
/** Row offsets rendered around the selected slot (center = 0). */
const ROW_OFFSETS = Array.from({ length: VISIBLE_ROWS }, (_, i) => i - SPACER_ROWS);

/**
 * Figma-style three-column time wheel (hours : minutes, ص/م) driven by the
 * API's available slots only. One transparent ScrollView overlays the card and
 * drives a single index, so all columns scroll together as one flow and
 * unavailable times can never be composed.
 */
export default function TimeWheel({ washerId, serviceId, date, selectedTime, onSelectTime }: TimeWheelProps) {
    const { data, isLoading } = useTimeSlots(washerId, serviceId, date);
    const slots = data ?? [];
    const scrollRef = useRef<ScrollView>(null);

    const selectedIndex = selectedTime ? slots.indexOf(selectedTime) : -1;

    // Auto-select the first slot whenever the list (re)loads with nothing chosen
    // (e.g. after a date change reset), and rewind the wheel.
    useEffect(() => {
        if (!selectedTime && slots.length > 0) {
            onSelectTime(slots[0]);
            scrollRef.current?.scrollTo({ y: 0, animated: false });
        }
    }, [slots, selectedTime, onSelectTime]);

    const selectByOffset = (offsetY: number) => {
        const idx = Math.min(slots.length - 1, Math.max(0, Math.round(offsetY / ITEM_HEIGHT)));
        if (slots[idx] && slots[idx] !== selectedTime) onSelectTime(slots[idx]);
    };

    if (isLoading) {
        return (
            <View style={[styles.card, styles.center]}>
                <ActivityIndicator size="small" />
                <Text style={styles.stateText}>جارٍ تحميل الأوقات...</Text>
            </View>
        );
    }

    if (slots.length === 0) {
        return (
            <View style={[styles.card, styles.center]}>
                <Text style={styles.stateText}>لا توجد أوقات متاحة في هذا اليوم</Text>
            </View>
        );
    }

    const selected = slotParts(date, slots[Math.max(0, selectedIndex)]);

    /** Neighbor slot parts for a row offset, or null when out of range. */
    const rowParts = (offset: number) => {
        const i = selectedIndex + offset;
        return i >= 0 && i < slots.length ? slotParts(date, slots[i]) : null;
    };

    return (
        <View style={styles.card}>
            {/* Visual columns (left→right): hours — colon — minutes — ص/م */}
            <View style={styles.columnsRow} pointerEvents="none">
                <View style={styles.column}>
                    {ROW_OFFSETS.map((off) => {
                        const parts = rowParts(off);
                        return (
                            <View key={off} style={[styles.cell, off === 0 && styles.cellSelected]}>
                                <Text style={[styles.cellText, off === 0 && styles.cellTextSelected]}>
                                    {parts?.hour ?? ""}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                <Text style={styles.colon}>:</Text>

                <View style={styles.column}>
                    {ROW_OFFSETS.map((off) => {
                        const parts = rowParts(off);
                        return (
                            <View key={off} style={[styles.cell, off === 0 && styles.cellSelected]}>
                                <Text style={[styles.cellText, off === 0 && styles.cellTextSelected]}>
                                    {parts?.minute ?? ""}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.periodColumn}>
                    {(["ص", "م"] as const).map((p) => (
                        <View key={p} style={[styles.cell, selected.period === p && styles.cellSelected]}>
                            <Text style={[styles.cellText, selected.period === p && styles.cellTextSelected]}>
                                {p}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Invisible scroll surface driving the whole wheel as one flow. */}
            <ScrollView
                ref={scrollRef}
                style={styles.scrollOverlay}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                nestedScrollEnabled
                scrollEventThrottle={16}
                onScroll={(e) => selectByOffset(e.nativeEvent.contentOffset.y)}
                onMomentumScrollEnd={(e) => selectByOffset(e.nativeEvent.contentOffset.y)}
            >
                <View style={{ height: (slots.length - 1) * ITEM_HEIGHT + VISIBLE_ROWS * ITEM_HEIGHT }} />
            </ScrollView>
        </View>
    );
}
