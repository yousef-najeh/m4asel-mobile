import { View, Text, Pressable, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';
import { router } from 'expo-router';

function BookingHeader() {
    return (
        <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.push('/(main)/MapPage')}>
                <Icon name="arrow-forward" type="material" size={24} color="#111827" />
            </Pressable>
            <Text style={styles.headerTitle}>إتمام الحجز</Text>
            <View style={styles.placeholder} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#111827",
    },
    placeholder: {
        width: 40,
    },
});

export default BookingHeader;
