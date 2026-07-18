import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F6FF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F0F6FF',
    },
    contentContainer: {
        padding: 16,
        paddingTop: 8,
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 8,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    navTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
    },
    navSpacer: {
        width: 36,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
    },
    bottomSpacer: {
        height: 100,
    },
});
