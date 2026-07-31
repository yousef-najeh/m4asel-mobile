import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from "@/src/constants/UserRole";
import { authService } from "@/src/services/auth.service";
import { useAuth } from "@/src/context/AuthContext";
import { colors } from "@/src/theme";
import { styles } from "./ProfilePageScreen.styles";

const ProfilePage = () => {
  const { user, profile, role, washerProfile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      router.replace("/(auth)/AuthPage");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>جارٍ التحميل...</Text>
      </View>
    );
  }

  const isWasher = role === UserRole.WASHER_OWNER || role === UserRole.WASHER_WORKER;
  const userName = profile?.name || user?.displayName || "مستخدم";

  const roleLabels: Record<UserRole, string> = {
    [UserRole.ADMIN]: "مدير النظام",
    [UserRole.CONFIRMED_USER]: "مستخدم مؤكد",
    [UserRole.UNCONFIRMED_USER]: "مستخدم غير مؤكد",
    [UserRole.WASHER_OWNER]: "مالك مغسلة",
    [UserRole.WASHER_WORKER]: "عامل مغسلة",
  };

  const userMobile = profile?.mobile_number || "غير متوفر";

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.roleText}>{(role && roleLabels[role]) || "مستخدم"}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Icon name={isWasher ? "store" : "person"} type="material" size={32} color={colors.textTertiary} />
          </View>
        </View>

        {/* ── Unconfirmed warning ── */}
        {role === UserRole.UNCONFIRMED_USER && (
          <View style={styles.warningCard}>
            <Icon name="error-outline" type="material" size={24} color={colors.warning} />
            <Text style={styles.warningText}>حسابك بانتظار التأكيد من الإدارة</Text>
          </View>
        )}

        {/* ── Contact Info ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>معلومات الحساب</Text>
          <InfoRow icon="phone" label="رقم الهاتف" value={userMobile} />
          <InfoRow icon="alternate-email" label="البريد الالكتروني" value={user?.email || "غير متوفر"} />
        </View>

        {/* ── Washer banner ── */}
        {isWasher && (
          <Pressable style={styles.washerBanner} onPress={() => router.push('/(main)/WasherDetails')}>
            <Icon name="chevron-left" type="material" size={20} color={colors.primary} />
            <View style={styles.washerBannerInfo}>
              <Text style={styles.washerBannerTitle}>
                {washerProfile?.display_name || 'مغسلتي'}
              </Text>
              <Text style={styles.washerBannerSub}>
                {washerProfile?.wash_services?.length ?? 0} خدمة  •  {washerProfile?.address || 'عرض التفاصيل'}
              </Text>
            </View>
            <View style={styles.washerBannerIcon}>
              <Icon name="local-car-wash" type="material" size={22} color={colors.primary} />
            </View>
          </Pressable>
        )}

        {/* ── Actions ── */}
        <View style={styles.card}>
          <ActionRow
            label="تعديل الملف الشخصي"
            isFirst
            onPress={() => router.push("/(main)/ProfilePage/EditProfile")}
          />
          <ActionRow
            label="الأمان وكلمة المرور"
            onPress={() => router.push("/(main)/ProfilePage/Security")}
          />
          <ActionRow
            label="المساعدة"
            onPress={() => router.push("/(main)/ProfilePage/Help")}
          />
        </View>

        {/* ── Logout ── */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

// Laid out LTR (see BookingCard): value on the left, then icon + label on the right.
const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.row}>
    <Text style={styles.rowValue}>{value}</Text>
    <View style={styles.rowLabelGroup}>
      <Icon name={icon} type="material" size={18} color={colors.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
  </View>
);

interface ActionRowProps {
  label: string;
  onPress: () => void;
  isFirst?: boolean;
}

const ActionRow = ({ label, onPress, isFirst }: ActionRowProps) => (
  <Pressable
    style={[styles.actionRow, isFirst && styles.actionRowFirst]}
    onPress={onPress}
  >
    <Icon name="chevron-left" type="material" size={22} color={colors.textMuted} />
    <Text style={styles.actionRowLabel}>{label}</Text>
  </Pressable>
);

export default ProfilePage;
