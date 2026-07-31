import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from 'react-native-elements';
import { bookmarksService } from '@/src/services/bookmarks.service';
import BookmarkIcon from '@/src/shared/components/BookmarkIcon';
import { colors } from '@/src/theme';
import { formatDistance, formatTime } from '@/src/utils/helpers';
import type { Washer } from '@/types/api';
import { styles } from "./MapCard.styles";

interface MapCardProps {
    item: Washer;
}

// Static placeholders until the API returns these fields.
const RATING = 3;
const MAX_STARS = 5;
const PRICE_MIN = 25;
const PRICE_MAX = 100;
const SUBTITLE_FALLBACK = "بجانب الايكون مول";

export default function MapCard({ item }: MapCardProps) {
    const queryClient = useQueryClient();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const distance = formatDistance(item.distance_km);
    const arrival = formatTime(item.arrival_time);

    const toggleSave = async () => {
        if (saving) return;
        setSaving(true);
        const next = !saved;
        setSaved(next); // optimistic
        try {
            if (next) await bookmarksService.add(item.id);
            else await bookmarksService.remove(item.id);
            // Keep the Bookmarks page (GET /bookmarks) in sync with this change.
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        } catch {
            setSaved(!next); // revert on failure
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.card}>
            {/* ── Top: bookmark toggle (left) + name & subtitle (right) ── */}
            <View style={styles.topRow}>
                <TouchableOpacity
                    style={styles.bookmarkBtn}
                    onPress={toggleSave}
                    hitSlop={8}
                    activeOpacity={0.7}
                >
                    <BookmarkIcon size={26} active={saved} />
                </TouchableOpacity>
                <View style={styles.titleCol}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.display_name}</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>{item.address || SUBTITLE_FALLBACK}</Text>
                </View>
            </View>

            {/* ── Rating (static placeholder) ── */}
            <View style={styles.starsRow}>
                {Array.from({ length: MAX_STARS }).map((_, i) => (
                    <Icon
                        key={i}
                        name={i < RATING ? "star" : "star-border"}
                        type="material"
                        size={16}
                        color={i < RATING ? colors.warning : colors.borderStrong}
                    />
                ))}
            </View>

            {/* ── Price (left, static) + distance & arrival (right) ── */}
            <View style={styles.infoRow}>
                <View style={styles.priceBlock}>
                    <Text style={styles.priceLabel}>خدمات/</Text>
                    <Text style={styles.priceValue}>₪ {PRICE_MIN} - ₪ {PRICE_MAX}</Text>
                </View>
                <View style={styles.metaCol}>
                    {distance && (
                        <View style={styles.metaItem}>
                            <Text style={styles.metaText}>{distance}</Text>
                            <Icon name="location-on" type="material" size={14} color={colors.primary} />
                        </View>
                    )}
                    <View style={styles.metaItem}>
                        <Text style={styles.metaText}>يصل {arrival}</Text>
                        <Icon name="schedule" type="material" size={14} color={colors.primary} />
                    </View>
                </View>
            </View>

            {/* ── Book button ── */}
            <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => router.push(`/(main)/BookingPage?washerId=${item.id}`)}
                activeOpacity={0.85}
            >
                <Icon name="arrow-left" type="font-awesome" size={13} color={colors.onPrimary} />
                <Text style={styles.bookBtnText}>احجز الآن</Text>
            </TouchableOpacity>
        </View>
    );
}
