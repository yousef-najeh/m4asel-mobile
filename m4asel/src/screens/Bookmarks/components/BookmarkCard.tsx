import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "@/src/theme";
import { formatDistance, formatTime } from "@/src/utils/helpers";
import type { NearbyWasherResponse } from "@/types/api";
import { styles } from "./BookmarkCard.styles";

interface BookmarkCardProps {
  item: NearbyWasherResponse;
  onRemove: (washerId: number) => void;
}

// Static placeholders until the API returns these fields.
const RATING = 3;
const MAX_STARS = 5;
const PRICE_MIN = 25;
const PRICE_MAX = 100;

export default function BookmarkCard({ item, onRemove }: BookmarkCardProps) {
  const distance = formatDistance(item.distance_km);
  const arrival = formatTime(item.arrival_time);

  return (
    <View style={styles.card}>
      {/* ── Top: bookmark toggle (left) + name (right) ── */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.bookmarkBtn}
          onPress={() => onRemove(item.id)}
          hitSlop={8}
          activeOpacity={0.7}
        >
          <Icon name="bookmark" type="material" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.display_name}</Text>
      </View>

      {/* ── Address ── */}
      {item.address && (
        <View style={styles.addressRow}>
          <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
        </View>
      )}

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
