import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { deleteFcmToken } from "../utils/fcm";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from "../../constants/UserRole";
import { auth } from "../../util/fireBaseConfig";
import { useAuth } from "../Context/AuthContext";

const ProfilePage = () => {
  const { user, profile, role, washerProfile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await deleteFcmToken(user);
      await signOut(auth);
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>جارٍ التحميل...</Text>
      </View>
    );
  }

  const isWasher = role === UserRole.WASHER_OWNER || role === UserRole.WASHER_WORKER;
  const userName = profile?.name || user?.displayName || "مستخدم";
  const userMobile = profile?.mobile_number || "غير متوفر";

  const roleLabels = {
    [UserRole.ADMIN]: "مدير النظام",
    [UserRole.CONFIRMED_USER]: "مستخدم مؤكد",
    [UserRole.UNCONFIRMED_USER]: "مستخدم غير مؤكد",
    [UserRole.WASHER_OWNER]: "مالك مغسلة",
    [UserRole.WASHER_WORKER]: "عامل مغسلة",
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar Header ── */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Icon name={isWasher ? "store" : "person"} type="material" size={38} color="#fff" />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{roleLabels[role] || "مستخدم"}</Text>
          </View>
        </View>

        {/* ── Unconfirmed warning ── */}
        {role === UserRole.UNCONFIRMED_USER && (
          <View style={styles.warningCard}>
            <Icon name="info-outline" type="material" size={18} color="#92400E" />
            <Text style={styles.warningText}>حسابك بانتظار التأكيد من الإدارة</Text>
          </View>
        )}

        {/* ── Contact Info ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>معلومات الحساب</Text>
          <InfoRow icon="phone" label="رقم الهاتف" value={userMobile} />
          <InfoRow icon="email" label="البريد الإلكتروني" value={user?.email || "غير متوفر"} last />
        </View>

        {/* ── Washer banner ── */}
        {isWasher && (
          <Pressable style={styles.washerBanner} onPress={() => router.push('/(main)/WasherDetails')}>
            <Icon name="chevron-left" type="material" size={20} color="#007AFF" />
            <View style={styles.washerBannerInfo}>
              <Text style={styles.washerBannerTitle}>
                {washerProfile?.display_name || 'مغسلتي'}
              </Text>
              <Text style={styles.washerBannerSub}>
                {washerProfile?.wash_services?.length ?? 0} خدمة  •  {washerProfile?.address || 'عرض التفاصيل'}
              </Text>
            </View>
            <View style={styles.washerBannerIcon}>
              <Icon name="local-car-wash" type="material" size={22} color="#007AFF" />
            </View>
          </Pressable>
        )}

        {/* ── Actions ── */}
        <View style={styles.card}>
          <ActionRow icon="edit" label="تعديل الملف الشخصي" onPress={() => {}} />
          <ActionRow icon="lock" label="الأمان وكلمة المرور" onPress={() => {}} />
          <ActionRow icon="help-outline" label="المساعدة" onPress={() => {}} last />
        </View>

        {/* ── Logout ── */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" type="material" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value, last }) => (
  <View style={[styles.row, !last && styles.rowBorder]}>
    <Text style={styles.rowValue}>{value}</Text>
    <View style={styles.rowLeft}>
      <Icon name={icon} type="material" size={18} color="#007AFF" />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
  </View>
);

const ActionRow = ({ icon, label, onPress, last }) => (
  <Pressable style={[styles.row, !last && styles.rowBorder]} onPress={onPress}>
    <Icon name="chevron-left" type="material" size={20} color="#D1D5DB" />
    <View style={styles.rowLeft}>
      <Icon name={icon} type="material" size={18} color="#374151" />
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0F6FF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F6FF',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  roleText: {
    fontSize: 13,
    color: '#1D4ED8',
    fontWeight: '600',
  },

  // Warning
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    textAlign: 'right',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
    textAlign: 'left',
  },
  actionLabel: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },

  // Washer banner
  washerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  washerBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  washerBannerInfo: {
    flex: 1,
    gap: 3,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  washerBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  washerBannerSub: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
});

export default ProfilePage;
