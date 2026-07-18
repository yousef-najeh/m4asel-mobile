import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { Formik, type FormikHelpers } from 'formik';
import { useState } from 'react';

interface SignUpValues {
  name: string;
  email: string;
  mobile_number: string;
  password: string;
}
import {
  ActivityIndicator,
  Image, Keyboard, KeyboardAvoidingView, Platform,
  Text, TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { authService } from '@/src/services/auth.service';
import { styles } from './SignUpScreen.styles';

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

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSignUp = async (values: SignUpValues, { setSubmitting }: FormikHelpers<SignUpValues>) => {
    setServerError('');
    try {
      await authService.register(values);
    } catch (error) {
      console.error('Error:', error);
      setServerError(error instanceof Error ? error.message : 'حدث خطأ في الاتصال، حاول مجدداً');
    } finally {
      setSubmitting(false);
    }
  };
  // when the user opens key borard the screen should move up and not cover the input fields,
  //  and when the user taps outside the keyboard it should close the keyboard like login screen,
  //  and the user should be able to toggle the password visibility like login screen
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
            <Formik<SignUpValues>
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
                    onPress={() => handleSubmit()}
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
                <Image source={require('@/assets/images/google-logo.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={require('@/assets/images/facebook-logo-2.png')} style={styles.socialIcon} />
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
