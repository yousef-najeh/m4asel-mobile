import { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import {
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { useAuth } from "../Context/AuthContext";
import { auth } from "../../util/fireBaseConfig";

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const displayName = user?.name || user?.displayName || "بدون اسم";
  const email = user?.email || "غير متوفر";
  const phoneNumber = user?.mobile_number || "غير متوفر";

  useEffect(() => {
    setNameInput(displayName);
    setEmailInput(email === "غير متوفر" ? "" : email);
    setPhoneInput(phoneNumber === "غير متوفر" ? "" : phoneNumber);
    setAddressInput(user?.address || "");
  }, [displayName, email, phoneNumber, user?.address]);

  const handleLogout = async () => {
    setBusy(true);
    try {
      await signOut(auth);
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Logout failed", error);
      Alert.alert("حدث خطأ", "تعذر تسجيل الخروج، حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) {
      Alert.alert("غير مصرح", "يرجى تسجيل الدخول أولاً.");
      return;
    }

    const trimmedName = nameInput.trim();
    const trimmedEmail = emailInput.trim();
    const trimmedPhone = phoneInput.trim();
    const trimmedAddress = addressInput.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedAddress) {
      Alert.alert("حقول مطلوبة", "الاسم، البريد، الجوال، والعنوان مطلوبة.");
      return;
    }

    setSavingProfile(true);
    try {
      if (auth.currentUser.displayName !== trimmedName) {
        await updateProfile(auth.currentUser, { displayName: trimmedName });
      }
      if (auth.currentUser.email !== trimmedEmail) {
        await updateEmail(auth.currentUser, trimmedEmail);
      }
      // TODO: persist phone/address to your backend or user profile store.
      Alert.alert("تم الحفظ", "تم تحديث بيانات الحساب بنجاح.");
      setEditOpen(false);
      
    } catch (error) {
      console.error("Update profile failed", error);
      Alert.alert(
        "تعذر التحديث",
        "تعذر تحديث البيانات، حاول مرة أخرى أو سجل الدخول مجدداً."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      Alert.alert("بريد غير متوفر", "لا يمكن إرسال رابط إعادة تعيين بدون بريد.");
      return;
    }

    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert("تم الإرسال", "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور.");
    } catch (error) {
      console.error("Reset password failed", error);
      Alert.alert("حدث خطأ", "تعذر إرسال الرابط، حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>

      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Image
            style={styles.avatar}
            source={require("@/assets/images/user-profile.webp")}
            resizeMode="cover"
          />
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>✎</Text>
          </View>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.subtext}>{email}</Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>الجوال: {phoneNumber}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>إعدادات الحساب</Text>
        <Pressable
          onPress={() => setEditOpen(true)}
          style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconCircle, styles.iconPrimary]}>
              <Text style={styles.iconText}>🛠</Text>
            </View>
            <Text style={styles.rowLabel}>تعديل الملف الشخصي</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {}}
          style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconCircle, styles.iconPrimary]}>
              <Text style={styles.iconText}>🏠</Text>
            </View>
            <Text style={styles.rowLabel}>العنوان</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handleResetPassword}
          style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
          disabled={busy}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconCircle, styles.iconPrimary]}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <Text style={styles.rowLabel}>الأمان وكلمة المرور</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>المساعدة والمعلومات</Text>
        <Pressable
          style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconCircle, styles.iconInfo]}>
              <Text style={styles.iconText}>❓</Text>
            </View>
            <Text style={styles.rowLabel}>المساعدة والدعم</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconCircle, styles.iconInfo]}>
              <Text style={styles.iconText}>🛡</Text>
            </View>
            <Text style={styles.rowLabel}>سياسة الخصوصية</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.rowItem, pressed && styles.pressed]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.iconCircle, styles.iconInfo]}>
              <Text style={styles.iconText}>ℹ️</Text>
            </View>
            <Text style={styles.rowLabel}>حول التطبيق</Text>
          </View>
        </Pressable>
      </View>

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.pressed,
          busy && styles.disabled,
        ]}
        disabled={busy}
      >
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </Pressable>

      {editOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>تعديل الملف الشخصي</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="اكتب اسمك"
              value={nameInput}
              onChangeText={setNameInput}
              editable={!savingProfile}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailInput}
              onChangeText={setEmailInput}
              editable={!savingProfile}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="رقم الجوال"
              keyboardType="phone-pad"
              value={phoneInput}
              onChangeText={setPhoneInput}
              editable={!savingProfile}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="العنوان"
              value={addressInput}
              onChangeText={setAddressInput}
              editable={!savingProfile}
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setEditOpen(false)}
                style={({ pressed }) => [
                  styles.modalButtonSecondary,
                  pressed && styles.pressed,
                ]}
                disabled={savingProfile}
              >
                <Text style={styles.modalSecondaryText}>إلغاء</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveProfile}
                style={({ pressed }) => [
                  styles.modalButtonPrimary,
                  pressed && styles.pressed,
                  (savingProfile || busy) && styles.disabled,
                ]}
                disabled={savingProfile || busy}
              >
                <Text style={styles.modalPrimaryText}>
                  {savingProfile ? "جارٍ الحفظ..." : "حفظ"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingTop: 28,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backText: {
    fontSize: 18,
    color: "#1E3A8A",
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarWrapper: {
    position: "relative",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#60A5FA",
  },
  editBadge: {
    position: "absolute",
    bottom: -4,
    right: -6,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  editBadgeText: {
    color: "#fff",
    fontSize: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtext: {
    fontSize: 14,
    color: "#6B7280",
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "#EEF2FF",
    color: "#4338CA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "700",
  },
  actionsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
  },
  iconPrimary: {
    backgroundColor: "#EEF2FF",
  },
  iconInfo: {
    backgroundColor: "#E0F2FE",
  },
  iconText: {
    fontSize: 16,
  },
  rowLabel: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#F9FAFB",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalButtonSecondary: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    padding:20,
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalSecondaryText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#374151",
  },
  modalPrimaryText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
  },
});

export default ProfilePage;

