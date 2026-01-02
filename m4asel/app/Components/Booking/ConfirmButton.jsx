import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';

function ConfirmButton({ onConfirm, disabled, loading }) {
    if (disabled && !loading) return null;

    return (
        <Pressable 
            style={[
                styles.confirmButton,
                (disabled || loading) && styles.confirmButtonDisabled
            ]}
            onPress={onConfirm}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
                <Icon name="check-circle" type="material" size={22} color="#FFFFFF" />
            )}
            <Text style={styles.confirmButtonText}>
                {loading ? 'جارٍ الحجز...' : 'تأكيد الحجز'}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    confirmButton: {
        backgroundColor: "#34C759",
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        shadowColor: "#34C759",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 8,
    },
    confirmButtonDisabled: {
        backgroundColor: "#9CA3AF",
        shadowColor: "#9CA3AF",
    },
    confirmButtonText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#FFFFFF",
    },
});

export default ConfirmButton;
