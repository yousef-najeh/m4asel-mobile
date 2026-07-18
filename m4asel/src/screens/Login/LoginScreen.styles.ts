import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F0F6FF',
    },
    kav: {
        flex: 1,
    },
    screen: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        paddingBottom: 16,
    },

    /* Header */
    header: {
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: 16,
    },
    logoCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    appName: {
        fontSize: 30,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'center',
    },

    /* Card */
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },

    /* Form */
    form: {
        gap: 14,
    },
    fieldWrapper: {
        gap: 5,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        textAlign: 'right',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        height: 48,
    },
    inputError: {
        borderColor: '#EF4444',
        backgroundColor: '#FFF5F5',
    },
    inputIcon: {
        marginLeft: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
        textAlign: 'right',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        textAlign: 'right',
        fontWeight: '500',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    errorBoxText: {
        fontSize: 13,
        color: '#DC2626',
        fontWeight: '600',
        textAlign: 'right',
    },
    submitBtn: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    submitBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },

    /* Divider */
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        gap: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    /* Social */
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialBtn: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },

    /* Footer */
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
        gap: 4,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    footerLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '700',
    },
});
