import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useAuth } from "../Context/AuthContext";
import { auth } from "../../util/fireBaseConfig";
import { Icon } from 'react-native-elements';
import { UserRole } from "../../constants/UserRole";

const ProfilePage = () => {
  const { user, profile, role, washerProfile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Icon name="person" type="material" size={40} color="#007AFF" />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userRole}>{roleLabels[role] || "مستخدم"}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <InfoItem 
            icon="phone" 
            label="رقم الهاتف" 
            value={userMobile} 
          />
          <InfoItem 
            icon="email" 
            label="البريد الإلكتروني" 
            value={user?.email || "غير متوفر"} 
          />
        </View>

        {/* Washer Info */}
        {isWasher && washerProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات المغسلة</Text>
            <InfoItem 
              icon="store" 
              label="اسم المغسلة" 
              value={washerProfile.display_name} 
            />
            <InfoItem 
              icon="place" 
              label="العنوان" 
              value={washerProfile.address} 
            />
            
            {washerProfile.wash_services && washerProfile.wash_services.length > 0 && (
              <View style={styles.services}>
                <Text style={styles.servicesLabel}>الخدمات</Text>
                {washerProfile.wash_services.map((service, index) => (
                  <Text key={index} style={styles.serviceItem}>
                    • {service.name} - {service.price} nis ({service.duration_minutes} دقيقة)
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Warning for unconfirmed users */}
        {role === UserRole.UNCONFIRMED_USER && (
          <View style={styles.warning}>
            <Icon name="info" type="material" size={20} color="#F59E0B" />
            <Text style={styles.warningText}>حسابك بانتظار التأكيد</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <ActionButton 
            icon="edit" 
            label="تعديل الملف الشخصي" 
            onPress={() => {}}
          />
          <ActionButton 
            icon="lock" 
            label="الأمان وكلمة المرور" 
            onPress={() => {}}
          />
          <ActionButton 
            icon="help" 
            label="المساعدة" 
            onPress={() => {}}
          />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper Components
const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoLeft}>
      <Icon name={icon} type="material" size={20} color="#6B7280" />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const ActionButton = ({ icon, label, onPress }) => (
  <Pressable style={styles.actionButton} onPress={onPress}>
    <View style={styles.actionLeft}>
      <Icon name={icon} type="material" size={20} color="#374151" />
      <Text style={styles.actionText}>{label}</Text>
    </View>
    <Icon name="chevron-left" type="material" size={20} color="#D1D5DB" />
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  
  // Header
  header: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#6B7280",
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  // Info Items
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoLabel: {
    fontSize: 15,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },

  // Services
  services: {
    paddingTop: 14,
  },
  servicesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  serviceItem: {
    fontSize: 14,
    color: "#6B7280",
    paddingVertical: 4,
    paddingRight: 8,
  },

  // Warning
  warning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFBEB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    color: "#92400E",
    fontWeight: "500",
  },

  // Action Buttons
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionText: {
    fontSize: 15,
    color: "#374151",
  },

  // Logout
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  bottomSpacer: {
    height: 60,
  },
});

export default ProfilePage;