import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServiceFormModal from "../components/ServiceFormModal";
import { useAuth } from "@/src/features/auth";
import { washersService } from "@/src/features/washers/services/washers.service";
import { formatTime } from "@/src/utils/helpers";
import type { WashService } from '@/types/api';
import { styles } from "../styles/WasherDetailsScreen.styles";

export default function WasherDetails() {
    const { washerProfile, loading, refreshProfile } = useAuth();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<WashService | null>(null);

    const openAdd = () => { setEditingService(null); setModalVisible(true); };
    const openEdit = (s: WashService) => { setEditingService(s); setModalVisible(true); };
    const closeModal = () => setModalVisible(false);

    const handleSaved = async () => {
        closeModal();
        await refreshProfile();
    };

    const handleDelete = (service: WashService) => {
        Alert.alert(
            'حذف الخدمة',
            `هل تريد حذف "${service.name}"؟`,
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'حذف', style: 'destructive',
                    onPress: async () => {
                        try {
                            await washersService.deleteService(service.id!);
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
                onClose={closeModal}
                onSaved={handleSaved}
            />
        </SafeAreaView>
    );
}

interface InfoRowProps {
    icon: string;
    label: string;
    value: string;
    last?: boolean;
}

const InfoRow = ({ icon, label, value, last }: InfoRowProps) => (
    <View style={[styles.row, !last && styles.rowBorder]}>
        <Text style={styles.rowValue}>{value}</Text>
        <View style={styles.rowLeft}>
            <Icon name={icon} type="material" size={17} color="#007AFF" />
            <Text style={styles.rowLabel}>{label}</Text>
        </View>
    </View>
);
