import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { fetch } from 'expo/fetch';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image, Keyboard, KeyboardAvoidingView, Platform,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { auth } from '../../util/fireBaseConfig';

const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .required('الاسم مطلوب'),
  email: Yup.string()
    .email('البريد الإلكتروني غير صالح')
    .required('البريد الإلكتروني مطلوب'),
  mobile_number: Yup.string()
    .matches(/^[0-9+]{9,15}$/, 'رقم الجوال غير صالح')
    .required('رقم الجوال مطلوب'),
  password: Yup.string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSignUp = async (values, { setSubmitting }) => {
    setServerError('');
    try {
      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          name: values.name,
          mobile_number: values.mobile_number,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const msg = errorData?.detail || errorData?.message || errorData?.error;
        setServerError(msg || 'فشل إنشاء الحساب، حاول مجدداً');
        return;
      }

      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (error) {
      console.error('Error:', error);
      setServerError('حدث خطأ في الاتصال، حاول مجدداً');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Icon name="person-add" type="material" size={34} color="#fff" />
            </View>
            <Text style={styles.appName}>إنشاء حساب</Text>
            <Text style={styles.subtitle}>انضم إلى مَغسل الآن</Text>
          </View>

          {/* ── Form Card ── */}
          <View style={styles.card}>
            <Formik
              initialValues={{ name: '', email: '', mobile_number: '', password: '' }}
              validationSchema={schema}
              onSubmit={handleSignUp}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.form}>

                  {/* Name */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>الاسم الكامل</Text>
                    <View style={[styles.inputRow, touched.name && errors.name && styles.inputError]}>
                      <Icon name="person" type="material" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="محمد أحمد"
                        placeholderTextColor="#9CA3AF"
                        textAlign="right"
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                      />
                    </View>
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  {/* Email */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>البريد الإلكتروني</Text>
                    <View style={[styles.inputRow, touched.email && errors.email && styles.inputError]}>
                      <Icon name="email" type="material" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="example@email.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        textAlign="right"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                      />
                    </View>
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Mobile */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>رقم الجوال</Text>
                    <View style={[styles.inputRow, touched.mobile_number && errors.mobile_number && styles.inputError]}>
                      <Icon name="phone" type="material" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="05xxxxxxxx"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        textAlign="right"
                        value={values.mobile_number}
                        onChangeText={handleChange('mobile_number')}
                        onBlur={handleBlur('mobile_number')}
                      />
                    </View>
                    {touched.mobile_number && errors.mobile_number && (
                      <Text style={styles.errorText}>{errors.mobile_number}</Text>
                    )}
                  </View>

                  {/* Password */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>كلمة المرور</Text>
                    <View style={[styles.inputRow, touched.password && errors.password && styles.inputError]}>
                      <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.inputIcon}>
                        <Icon
                          name={showPassword ? 'visibility-off' : 'visibility'}
                          type="material"
                          size={20}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showPassword}
                        textAlign="right"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                      />
                    </View>
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  {/* Server error */}
                  {serverError ? (
                    <View style={styles.errorBox}>
                      <Icon name="error-outline" type="material" size={16} color="#DC2626" />
                      <Text style={styles.errorBoxText}>{serverError}</Text>
                    </View>
                  ) : null}

                  {/* Submit */}
                  <Button
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    isDisabled={isSubmitting}
                  >
                    {isSubmitting
                      ? <ActivityIndicator color="#fff" />
                      : <ButtonText style={styles.submitBtnText}>إنشاء الحساب</ButtonText>
                    }
                  </Button>

                </View>
              )}
            </Formik>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>أو التسجيل عبر</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={require('../../assets/images/google-logo.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={require('../../assets/images/facebook-logo-2.png')} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>تسجيل الدخول</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>لديك حساب بالفعل؟ </Text>
          </View>

        </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0F6FF',
  },
  kav: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },

  /* Header */
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  /* Form */
  form: {
    gap: 12,
  },
  fieldWrapper: {
    gap: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    textAlign: 'right',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'right',
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorBoxText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'right',
  },
  submitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  /* Divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  /* Social */
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '700',
  },
});
