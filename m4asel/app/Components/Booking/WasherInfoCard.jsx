import { View, Text, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';

function WasherInfoCard({ address, display_name }) {
    if (!address || !display_name) return null;

    return (
        <View style={styles.washerCard}>
            <View style={styles.washerHeader}>
                <Icon name="store" type="material" size={28} color="#007AFF" />
                <Text style={styles.washerName}>{display_name}</Text>
            </View>
            <View style={styles.washerInfo}>
                <Icon name="place" type="material" size={18} color="#6B7280" />
                <Text style={styles.washerAddress}>{address}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    washerCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        gap: 12,
    },
    washerHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    washerName: {
        fontSize: 20,
        fontWeight: "800",
        color: "#111827",
        flex: 1,
    },
    washerInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    washerAddress: {
        fontSize: 14,
        color: "#6B7280",
        flex: 1,
    },
});

export default WasherInfoCard;
