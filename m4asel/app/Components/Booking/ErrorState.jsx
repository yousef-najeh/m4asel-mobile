import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';

function ErrorState({ onRetry }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Icon name="error-outline" type="material" size={64} color="#EF4444" />
                <Text style={styles.text}>تعذر تحميل البيانات</Text>
                <Pressable style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>إعادة المحاولة</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        padding: 32,
    },
    text: {
        fontSize: 18,
        fontWeight: "700",
        color: "#374151",
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    retryText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
});

export default ErrorState;
