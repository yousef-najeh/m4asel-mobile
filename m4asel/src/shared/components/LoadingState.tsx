import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoadingState() {
    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.text}>جارٍ التحميل...</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F6FF' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    text: { fontSize: 15, color: '#6B7280', fontWeight: '500' },
});
