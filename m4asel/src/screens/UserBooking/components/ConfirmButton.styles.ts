import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#007AFF',
        borderRadius: 18,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    btnDisabled: {
        backgroundColor: '#F3F4F6',
        shadowColor: 'transparent',
        elevation: 0,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    btnTextDisabled: {
        color: '#9CA3AF',
    },
});
