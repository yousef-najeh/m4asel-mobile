import { Dimensions } from "react-native";

/**
 * Layout constants for the map's horizontal washer-card strip.
 * Shared by MapScreen (snap/centering logic) and the card styles so the
 * `Dimensions` math lives in exactly one place.
 */
const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const CARD_WIDTH = WINDOW_WIDTH * 0.82;
/** Horizontal margin on each side of a card (matches marginHorizontal in MapCard styles). */
export const CARD_MARGIN = 6;
/** FlatList snap distance: one card plus both side margins. */
export const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;
/** Side padding that centers the first/last card in the viewport. */
export const CENTER_PADDING = (WINDOW_WIDTH - CARD_WIDTH) / 2 - CARD_MARGIN;
