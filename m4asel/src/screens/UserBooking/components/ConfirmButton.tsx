import { ActivityIndicator, Pressable, Text } from "react-native";
import { colors } from "@/src/theme";
import { styles } from "./ConfirmButton.styles";

interface ConfirmButtonProps {
    label: string;
    onConfirm: () => void;
    disabled?: boolean;
    loading?: boolean;
    loadingLabel?: string;
}

/** Full-width primary CTA (Figma 258:4322 "button") — used by both booking pages. */
export default function ConfirmButton({ label, onConfirm, disabled, loading, loadingLabel }: ConfirmButtonProps) {
    const blocked = disabled || loading;
    return (
        <Pressable
            style={[styles.btn, blocked && styles.btnDisabled]}
            // Not just the `disabled` prop: never attach a handler while blocked,
            // so a press can't fire (and shows no feedback) regardless of wrappers.
            onPress={blocked ? undefined : onConfirm}
            disabled={blocked}
            accessibilityState={{ disabled: blocked, busy: loading }}
        >
            {loading && <ActivityIndicator size="small" color={colors.textMuted} />}
            <Text style={[styles.btnText, blocked && styles.btnTextDisabled]}>
                {loading ? (loadingLabel ?? label) : label}
            </Text>
        </Pressable>
    );
}
