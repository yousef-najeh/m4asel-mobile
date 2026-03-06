import { getAuth, onAuthStateChanged, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        // User is signed in
        // Some Android devices can automatically process the verification code (OTP) message
        // In this case, the user is already authenticated
        console.log('User authenticated:', user.phoneNumber);
        
        // Navigate to main app
        // The AuthContext will handle the navigation automatically
        // But we can show a success message
        if (confirm) {
          Alert.alert('نجح', 'تم تسجيل الدخول بنجاح');
        }
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [confirm]);

  const formatPhoneNumber = (phone) => {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Add +972 for Israeli numbers if not present
    if (cleaned.startsWith('0')) {
      cleaned = '970' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('970') && !cleaned.startsWith('+')) {
      cleaned = '970' + cleaned;
    }
    
    return '+' + cleaned;
  };

  const handleSendCode = async () => {
    setError('');
    
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('الرجاء إدخال رقم هاتف صحيح');
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Sending code to:', formattedPhone);

      const confirmation = await signInWithPhoneNumber(getAuth(), formattedPhone);
      
      setConfirm(confirmation);
      setError('');
      Alert.alert('نجح', 'تم إرسال رمز التحقق إلى هاتفك');
    } catch (err) {
      console.error('Error sending code:', err);
      
      // Provide more specific error messages
      let errorMessage = 'فشل إرسال رمز التحقق. الرجاء المحاولة مرة أخرى.';
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'رقم الهاتف غير صحيح. الرجاء التحقق من الرقم.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'تم إرسال عدد كبير من الطلبات. الرجاء المحاولة لاحقاً.';
      } else if (err.code === 'auth/quota-exceeded') {
        errorMessage = 'تم تجاوز الحد المسموح. الرجاء المحاولة لاحقاً.';
      }
      
      setError(errorMessage);
      Alert.alert('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    
    if (!code || code.length !== 6) {
      setError('الرجاء إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setLoading(true);

    try {
      // Confirm the verification code
      await confirm.confirm(code);
      // Auth state change will be handled by onAuthStateChanged listener above
      // which will show success message and AuthContext will handle navigation
    } catch (err) {
      console.error('Error verifying code:', err);
      
      // Provide specific error messages
      let errorMessage = 'رمز التحقق غير صحيح';
      if (err.code === 'auth/invalid-verification-code') {
        errorMessage = 'رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى.';
      } else if (err.code === 'auth/code-expired') {
        errorMessage = 'انتهت صلاحية رمز التحقق. الرجاء طلب رمز جديد.';
      }
      
      setError(errorMessage);
      Alert.alert('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setPhoneNumber('');
    setCode('');
    setConfirm(null);
  };

  const handleResendCode = async () => {
    setCode('');
    setConfirm(null);
    await handleSendCode();
  };

  if (!confirm) {
    // Phone number input screen
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.content}>
            {/* Logo/Header */}
            <View style={styles.header}>
              <Icon name="local-car-wash" type="material" size={80} color="#007AFF" />
              <Text style={styles.title}>
                {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </Text>
              <Text style={styles.subtitle}>
                {mode === 'login' 
                  ? 'أدخل رقم هاتفك لتسجيل الدخول' 
                  : 'أدخل رقم هاتفك لإنشاء حساب جديد'}
              </Text>
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="phone" type="material" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="رقم الهاتف (مثال: 0501234567)"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textAlign="right"
                  editable={!loading}
                />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Send Code Button */}
            <Pressable 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>إرسال رمز التحقق</Text>
              )}
            </Pressable>

            {/* Switch Mode */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {mode === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
              </Text>
              <Pressable onPress={switchMode}>
                <Text style={styles.linkText}>
                  {mode === 'login' ? 'إنشاء حساب' : 'تسجيل الدخول'}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // OTP verification screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Icon name="sms" type="material" size={80} color="#007AFF" />
            <Text style={styles.title}>تحقق من رمز OTP</Text>
            <Text style={styles.subtitle}>
              تم إرسال رمز التحقق إلى {phoneNumber}
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="lock" type="material" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="رمز التحقق (6 أرقام)"
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                editable={!loading}
              />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Verify Button */}
          <Pressable 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>تحقق</Text>
            )}
          </Pressable>

          {/* Resend Code */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>لم تستلم الرمز؟ </Text>
            <Pressable onPress={handleResendCode} disabled={loading}>
              <Text style={[styles.linkText, loading && styles.linkDisabled]}>
                إعادة إرسال
              </Text>
            </Pressable>
          </View>

          {/* Back Button */}
          <Pressable 
            style={styles.backButton}
            onPress={() => setConfirm(null)}
            disabled={loading}
          >
            <Icon name="arrow-back" type="material" size={24} color="#007AFF" />
            <Text style={styles.backText}>تغيير رقم الهاتف</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    writingDirection: 'rtl',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  linkDisabled: {
    opacity: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
});