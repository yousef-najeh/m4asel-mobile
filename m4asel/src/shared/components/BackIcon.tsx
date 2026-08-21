import { Pressable, PressableProps, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { colors } from "@/src/theme";

/**
 * Back-button icon rendered from the "BackIcon.svg" design — a filled circular
 * badge in the main brand blue with a white left-pointing chevron. Pure SVG
 * (no raster), so it scales crisply to any `size`.
 *
 * The color (main blue) and direction (left) are fixed by the design; only
 * `size` and an optional `onPress` are configurable. When `onPress` is given
 * the SVG is wrapped in a Pressable (rounded hit area + pressed feedback).
 *
 * Source asset: src/shared/components/BackIcon.svg
 */
export interface BackIconProps {
  /** Edge length in px (default 55, matches the source SVG). */
  size?: number;
  /** If provided, wraps the icon in a tappable button. */
  onPress?: PressableProps["onPress"];
}

/** The viewBox is 55×55; the circle is centered at (27.5, 27.5), r ≈ 26.42. */
const VIEWBOX = 55;

export default function BackIcon({ size = 55, onPress }: BackIconProps) {
  const svg = (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} fill="none">
      <Circle
        cx={27.5}
        cy={27.5}
        r={26.4244}
        fill={colors.primary}
        stroke={colors.primary}
        strokeWidth={2.15128}
      />
      {/* Chevron path from BackIcon.svg (points left). */}
      <Path
        // eslint-disable-next-line max-len
        d="M40.5703 28.1091C41.1644 28.1091 41.646 27.6276 41.646 27.0335C41.646 26.4394 41.1644 25.9579 40.5703 25.9579L40.5703 27.0335L40.5703 28.1091ZM13.2246 26.2729C12.8045 26.693 12.8045 27.374 13.2246 27.7941L20.0699 34.6394C20.49 35.0595 21.1711 35.0595 21.5911 34.6394C22.0112 34.2194 22.0112 33.5383 21.5911 33.1182L15.5064 27.0335L21.5911 20.9488C22.0112 20.5287 22.0112 19.8476 21.5911 19.4276C21.1711 19.0075 20.49 19.0075 20.0699 19.4276L13.2246 26.2729ZM40.5703 27.0335L40.5703 25.9579L13.9852 25.9579L13.9852 27.0335L13.9852 28.1091L40.5703 28.1091L40.5703 27.0335Z"
        fill={colors.white}
      />
    </Svg>
  );

  if (!onPress) return svg;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="رجوع"
    >
      {svg}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.8,
  },
});