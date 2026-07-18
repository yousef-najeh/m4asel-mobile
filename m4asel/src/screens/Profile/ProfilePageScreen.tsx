import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from "@/src/constants/UserRole";
import { authService } from "@/src/services/auth.service";
import { useAuth } from "@/src/context/AuthContext";
import { styles } from "./ProfilePageScreen.styles";

const ProfilePage = () => {
  const { user, profile, role, washerProfile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.signOut();
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

  const roleLabels: Record<UserRole, string> = {
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
            <Text style={styles.roleText}>{(role && roleLabels[role]) || "مستخدم"}</Text>
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
      <Icon name={icon} type="material" size={18} color="#007AFF" />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
  </View>
);

interface ActionRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  last?: boolean;
}

const ActionRow = ({ icon, label, onPress, last }: ActionRowProps) => (
  <Pressable style={[styles.row, !last && styles.rowBorder]} onPress={onPress}>
    <Icon name="chevron-left" type="material" size={20} color="#D1D5DB" />
    <View style={styles.rowLeft}>
      <Icon name={icon} type="material" size={18} color="#374151" />
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  </Pressable>
);

export default ProfilePage;
