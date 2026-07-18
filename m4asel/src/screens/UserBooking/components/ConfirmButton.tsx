import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { Icon } from 'react-native-elements';
import { styles } from "./ConfirmButton.styles";

interface ConfirmButtonProps {
    onConfirm: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export default function ConfirmButton({ onConfirm, disabled, loading }: ConfirmButtonProps) {
    return (
        <Pressable
            style={[styles.btn, disabled && styles.btnDisabled]}
            onPress={onConfirm}
            disabled={disabled}
        >
            {loading
                ? <ActivityIndicator size="small" color="#FFFFFF" />
                : <Icon name="check-circle" type="material" size={20} color={disabled ? '#D1D5DB' : '#FFFFFF'} />
            }
            <Text style={[styles.btnText, disabled && styles.btnTextDisabled]}>
                {loading ? 'جارٍ الحجز...' : 'تأكيد الحجز'}
            </Text>
        </Pressable>
    );
}
