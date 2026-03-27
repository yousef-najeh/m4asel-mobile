import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';

function ErrorState({ onRetry }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.iconCircle}>
                    <Icon name="error-outline" type="material" size={32} color="#EF4444" />
                </View>
                <Text style={styles.title}>تعذر تحميل البيانات</Text>
                <Text style={styles.subtitle}>حدث خطأ أثناء جلب المعلومات</Text>
                <Pressable style={styles.retryButton} onPress={onRetry}>
                    <Icon name="refresh" type="material" size={16} color="#FFFFFF" />
                    <Text style={styles.retryText}>إعادة المحاولة</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F6FF',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        padding: 32,
    },
    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#FEF2F2',
        borderWidth: 1.5,
        borderColor: '#FECACA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
        textAlign: 'center',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 13,
        borderRadius: 14,
        marginTop: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default ErrorState;
