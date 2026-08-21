import { useRouter } from "expo-router";
import { PressableProps } from "react-native";
import BackIcon from "@/src/shared/components/BackIcon";

/**
 * Shared navbar back button — the single place that owns the app-wide default
 * size (48) and back-navigation behavior. Wraps {@link BackIcon}.
 *
 * Use this instead of `BackIcon` directly in screen headers so the icon size,
 * color, and direction stay consistent everywhere. Override `onPress` for the
 * rare screen that needs a custom destination (e.g. replace instead of back).
 */
export interface BackButtonProps {
  /** Icon edge length in px (default 48). */
  size?: number;
  /** Defaults to `router.back()`. Override for a custom destination. */
  onPress?: PressableProps["onPress"];
}

export default function BackButton({ size = 48, onPress }: BackButtonProps) {
  const router = useRouter();

  return (
    <BackIcon
      size={size}
      onPress={onPress ?? (() => router.back())}
    />
  );
}