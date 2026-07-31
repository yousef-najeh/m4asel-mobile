import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { userService } from "@/src/services/user.service";
import { styles } from "./EditProfileScreen.styles";

const EditProfileScreen = () => {
  const router = useRouter();
  const { profile, user, refreshProfile } = useAuth();

  const [name, setName] = useState(profile?.name || "");
  const [mobileNumber, setMobileNumber] = useState(profile?.mobile_number || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("خطأ", "الرجاء إدخال الاسم");
      return;
    }

    if (!mobileNumber.trim()) {
      Alert.alert("خطأ", "الرجاء إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      await userService.updateProfile({
        name: name.trim(),
        mobile_number: mobileNumber.trim(),
      });
      await refreshProfile();
      Alert.alert("نجاح", "تم تحديث الملف الشخصي بنجاح", [
        { text: "حسناً", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("خطأ", "فشل تحديث الملف الشخصي. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarCircle}>
              <Icon name="person" type="material" size={38} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>معلومات الحساب</Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Icon name="person" type="material" size={20} color="#007AFF" />
                <Text style={styles.inputLabel}>الاسم</Text>
              </View>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="أدخل الاسم"
                placeholderTextColor="#9CA3AF"
                textAlign="right"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Icon name="phone" type="material" size={20} color="#007AFF" />
                <Text style={styles.inputLabel}>رقم الهاتف</Text>
              </View>
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="أدخل رقم الهاتف"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                textAlign="right"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Icon name="email" type="material" size={20} color="#6B7280" />
                <Text style={[styles.inputLabel, styles.disabledLabel]}>البريد الإلكتروني</Text>
              </View>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user?.email || "غير متوفر"}
                editable={false}
                textAlign="right"
              />
              <Text style={styles.inputHint}>البريد الإلكتروني لا يمكن تعديله</Text>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="check" type="material" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
              </>
            )}
          </Pressable>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
