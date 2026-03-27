import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServiceFormModal from "../Components/ServiceFormModal";
import { useAuth } from "../Context/AuthContext";
import { formatTime } from "../utils/helpers";

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function WasherDetails() {
    const { washerProfile, loading, user, refreshProfile } = useAuth();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const openAdd = () => { setEditingService(null); setModalVisible(true); };
    const openEdit = (s) => { setEditingService(s); setModalVisible(true); };
    const closeModal = () => setModalVisible(false);

    const handleSaved = async () => {
        closeModal();
        await refreshProfile();
    };

    const handleDelete = (service) => {
        Alert.alert(
            'حذف الخدمة',
            `هل تريد حذف "${service.name}"؟`,
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'حذف', style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await user.getIdToken();
                            const response = await fetch(`${apiUrl}/washers/services/${service.id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` },
                            });
                            if (!response.ok) throw new Error();
                            await refreshProfile();
                        } catch {
                            Alert.alert('خطأ', 'فشل حذف الخدمة، حاول مجدداً');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!washerProfile) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Icon name="store-mall-directory" type="material" size={36} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyTitle}>لا توجد بيانات مغسلة</Text>
                    <Text style={styles.emptySubtitle}>لم يتم إعداد ملف المغسلة بعد</Text>
                </View>
            </SafeAreaView>
        );
    }

    const openTime = formatTime(washerProfile.opening_time);
    const closeTime = formatTime(washerProfile.closing_time);
    const services = washerProfile.wash_services || [];

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={true}
            >
                {/* ── Back + Title ── */}
                <View style={styles.navbar}>
                    <Pressable style={styles.backBtn} onPress={() => router.back()}>
                        <Icon name="arrow-forward-ios" type="material" size={18} color="#007AFF" />
                    </Pressable>
                    <Text style={styles.navTitle}>مغسلتي</Text>
                    <View style={{ width: 36 }} />
                </View>

                {/* ── Hero ── */}
                <View style={styles.hero}>
                    <View style={styles.heroIconCircle}>
                        <Icon name="local-car-wash" type="material" size={40} color="#fff" />
                    </View>
                    <Text style={styles.businessName}>{washerProfile.display_name}</Text>
                    <View style={styles.openBadge}>
                        <View style={styles.openDot} />
                        <Text style={styles.openBadgeText}>نشط</Text>
                    </View>
                </View>

                {/* ── Location ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>الموقع</Text>
                    <InfoRow icon="place" label="العنوان" value={washerProfile.address} />
                    <InfoRow
                        icon="my-location"
                        label="الإحداثيات"
                        value={`${washerProfile.latitude?.toFixed(5)}, ${washerProfile.longitude?.toFixed(5)}`}
                        last
                    />
                </View>

                {/* ── Working Hours ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>ساعات العمل</Text>
                    <View style={styles.hoursRow}>
                        <View style={styles.hourBlock}>
                            <Icon name="login" type="material" size={18} color="#EF4444" />
                            <Text style={styles.hourLabel}>الإغلاق</Text>
                            <Text style={[styles.hourValue, { color: '#EF4444' }]}>{closeTime}</Text>
                        </View>
                        <View style={styles.hoursDivider} />
                        <View style={styles.hourBlock}>
                            <Icon name="logout" type="material" size={18} color="#007AFF" />
                            <Text style={styles.hourLabel}>الفتح</Text>
                            <Text style={[styles.hourValue, { color: '#007AFF' }]}>{openTime}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Services ── */}
                <View style={styles.card}>
                    <View style={styles.cardTitleRow}>
                        <Pressable style={styles.addServiceBtn} onPress={openAdd}>
                            <Icon name="add" type="material" size={16} color="#007AFF" />
                            <Text style={styles.addServiceText}>إضافة</Text>
                        </Pressable>
                        <View style={{ flex: 1 }} />
                        <View style={styles.countPill}>
                            <Text style={styles.countPillText}>{services.length}</Text>
                        </View>
                        <Text style={styles.cardTitle}>الخدمات</Text>
                    </View>

                    {services.length === 0 ? (
                        <View style={styles.noServices}>
                            <Icon name="build-circle" type="material" size={28} color="#D1D5DB" />
                            <Text style={styles.noServicesText}>لا توجد خدمات مضافة</Text>
                        </View>
                    ) : (
                        services.map((s, i) => (
                            <View key={s.id ?? i} style={[styles.serviceCard, i < services.length - 1 && styles.serviceCardBorder, !s.is_active && styles.serviceCardInactive]}>
                                <View style={styles.serviceTop}>
                                    <View style={styles.serviceActions}>
                                        <Pressable style={styles.actionBtn} onPress={() => handleDelete(s)}>
                                            <Icon name="delete-outline" type="material" size={18} color="#EF4444" />
                                        </Pressable>
                                        <Pressable style={styles.actionBtn} onPress={() => openEdit(s)}>
                                            <Icon name="edit" type="material" size={18} color="#007AFF" />
                                        </Pressable>
                                    </View>
                                    <View style={styles.serviceInfo}>
                                        <View style={styles.serviceNameRow}>
                                            {!s.is_active && (
                                                <View style={styles.inactiveBadge}>
                                                    <Text style={styles.inactiveBadgeText}>معطّل</Text>
                                                </View>
                                            )}
                                            <Text style={[styles.serviceName, !s.is_active && styles.serviceNameInactive]}>{s.name}</Text>
                                        </View>
                                        <View style={styles.serviceChips}>
                                            <View style={styles.chipPurple}>
                                                <Icon name="timer" type="material" size={12} color="#7C3AED" />
                                                <Text style={[styles.chipText, { color: '#7C3AED' }]}>{s.duration_minutes} د</Text>
                                            </View>
                                            <View style={styles.chipGreen}>
                                                <Icon name="payments" type="material" size={12} color="#059669" />
                                                <Text style={[styles.chipText, { color: '#059669' }]}>{s.price} nis</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>

            <ServiceFormModal
                visible={modalVisible}
                service={editingService}
                washerId={washerProfile?.id}
                user={user}
                onClose={closeModal}
                onSaved={handleSaved}
            />
        </SafeAreaView>
    );
}

const InfoRow = ({ icon, label, value, last }) => (
    <View style={[styles.row, !last && styles.rowBorder]}>
        <Text style={styles.rowValue}>{value}</Text>
        <View style={styles.rowLeft}>
            <Icon name={icon} type="material" size={17} color="#007AFF" />
            <Text style={styles.rowLabel}>{label}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F6FF' },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F6FF' },

    // Empty
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
    emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', textAlign: 'center' },
    emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },

    // Navbar
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        paddingBottom: 8,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    navTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },

    // Hero
    hero: { alignItems: 'center', paddingVertical: 24, gap: 10 },
    heroIconCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#007AFF', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    },
    businessName: { fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center' },
    openBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#ECFDF5', borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 5,
        borderWidth: 1, borderColor: '#A7F3D0',
    },
    openDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#059669' },
    openBadgeText: { fontSize: 13, fontWeight: '700', color: '#065F46' },

    // Cards
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16,
        marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    },
    cardTitle: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textAlign: 'right', marginBottom: 8 },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 8 },
    countPill: {
        backgroundColor: '#007AFF', borderRadius: 10,
        paddingHorizontal: 8, paddingVertical: 2,
    },
    countPillText: { fontSize: 12, fontWeight: '800', color: '#fff' },

    // Rows
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    rowLabel: { fontSize: 14, color: '#374151', fontWeight: '600' },
    rowValue: { fontSize: 14, color: '#6B7280', fontWeight: '500', flex: 1, textAlign: 'left' },

    // Hours
    hoursRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F9FAFB', borderRadius: 14,
        padding: 16, marginTop: 4,
    },
    hourBlock: { flex: 1, alignItems: 'center', gap: 6 },
    hoursDivider: { width: 1, height: 44, backgroundColor: '#E5E7EB', marginHorizontal: 8 },
    hourLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
    hourValue: { fontSize: 17, fontWeight: '800' },

    // Services
    noServices: { alignItems: 'center', paddingVertical: 20, gap: 8 },
    noServicesText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
    serviceCard: { paddingVertical: 14 },
    serviceCardBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    serviceCardInactive: { opacity: 0.5 },
    serviceTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    serviceInfo: { flex: 1, alignItems: 'flex-end', gap: 6 },
    serviceNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
    serviceName: { fontSize: 15, fontWeight: '700', color: '#111827', textAlign: 'right' },
    serviceNameInactive: { color: '#9CA3AF' },
    inactiveBadge: {
        backgroundColor: '#FEF2F2', borderRadius: 6,
        paddingHorizontal: 7, paddingVertical: 2,
        borderWidth: 1, borderColor: '#FECACA',
    },
    inactiveBadgeText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
    serviceChips: { flexDirection: 'row', gap: 6 },
    serviceActions: { flexDirection: 'row', gap: 6 },
    actionBtn: {
        width: 34, height: 34, borderRadius: 10,
        backgroundColor: '#F9FAFB',
        borderWidth: 1, borderColor: '#E5E7EB',
        justifyContent: 'center', alignItems: 'center',
    },
    addServiceBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#EFF6FF', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 5,
        borderWidth: 1, borderColor: '#BFDBFE',
    },
    addServiceText: { fontSize: 13, fontWeight: '700', color: '#007AFF' },
    chipGreen: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#ECFDF5', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 4,
        borderWidth: 1, borderColor: '#A7F3D0',
    },
    chipPurple: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#F5F3FF', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 4,
        borderWidth: 1, borderColor: '#DDD6FE',
    },
    chipText: { fontSize: 12, fontWeight: '700' },

});
