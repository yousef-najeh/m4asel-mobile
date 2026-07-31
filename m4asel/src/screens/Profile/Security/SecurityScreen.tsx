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
import { userService } from "@/src/services/user.service";
import { styles } from "./SecurityScreen.styles";

const SecurityScreen = () => {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSave = async () => {
    if (!currentPassword) {
      Alert.alert("خطأ", "الرجاء إدخال كلمة المرور الحالية");
      return;
    }

    if (!newPassword) {
      Alert.alert("خطأ", "الرجاء إدخال كلمة المرور الجديدة");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("خطأ", "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("خطأ", "كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      Alert.alert("نجاح", "تم تغيير كلمة المرور بنجاح", [
        { text: "حسناً", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Failed to change password:", error);
      Alert.alert("خطأ", "فشل تغيير كلمة المرور. تأكد من كلمة المرور الحالية.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
            <View style={styles.iconCircle}>
              <Icon name="lock" type="material" size={38} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>الأمان وكلمة المرور</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>تغيير كلمة المرور</Text>

            {/* Current Password */}
            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Icon name="lock-outline" type="material" size={20} color="#007AFF" />
                <Text style={styles.inputLabel}>كلمة المرور الحالية</Text>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="أدخل كلمة المرور الحالية"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.current}
                  textAlign="right"
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("current")}
                >
                  <Icon
                    name={showPasswords.current ? "visibility" : "visibility-off"}
                    type="material"
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Icon name="lock-outline" type="material" size={20} color="#007AFF" />
                <Text style={styles.inputLabel}>كلمة المرور الجديدة</Text>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="أدخل كلمة المرور الجديدة"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.new}
                  textAlign="right"
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("new")}
                >
                  <Icon
                    name={showPasswords.new ? "visibility" : "visibility-off"}
                    type="material"
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Icon name="lock-outline" type="material" size={20} color="#007AFF" />
                <Text style={styles.inputLabel}>تأكيد كلمة المرور</Text>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="أكد كلمة المرور الجديدة"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.confirm}
                  textAlign="right"
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => togglePasswordVisibility("confirm")}
                >
                  <Icon
                    name={showPasswords.confirm ? "visibility" : "visibility-off"}
                    type="material"
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
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

export default SecurityScreen;
