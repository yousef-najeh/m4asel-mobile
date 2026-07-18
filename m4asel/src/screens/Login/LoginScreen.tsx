import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { Formik, type FormikHelpers } from 'formik';
import { useState } from 'react';

interface LoginValues {
    email: string;
    password: string;
}
import {
    ActivityIndicator,
    Image, Keyboard, KeyboardAvoidingView, Platform,
    Text, TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { authErrorMessages, authService } from '@/src/services/auth.service';
import { styles } from './LoginScreen.styles';

const schema = Yup.object().shape({
    email: Yup.string()
        .email('البريد الإلكتروني غير صالح')
        .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
        .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
        .required('كلمة المرور مطلوبة'),
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [firebaseError, setFirebaseError] = useState('');

    const handleLogin = async (values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>) => {
        setFirebaseError('');
        try {
            await authService.signIn(values.email, values.password);
        } catch (error) {
            const code = error instanceof FirebaseError ? error.code : undefined;
            setFirebaseError((code && authErrorMessages[code]) || 'حدث خطأ، حاول مجدداً');
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
                                <Icon name="local-car-wash" type="material" size={34} color="#fff" />
                            </View>
                            <Text style={styles.appName}>مَغسل</Text>
                            <Text style={styles.subtitle}>مرحباً بعودتك</Text>
                        </View>

                        {/* ── Form Card ── */}
                        <View style={styles.card}>
                            <Formik<LoginValues>
                                initialValues={{ email: '', password: '' }}
                                validationSchema={schema}
                                onSubmit={handleLogin}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                    <View style={styles.form}>

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

                                        {/* Firebase error */}
                                        {firebaseError ? (
                                            <View style={styles.errorBox}>
                                                <Icon name="error-outline" type="material" size={16} color="#DC2626" />
                                                <Text style={styles.errorBoxText}>{firebaseError}</Text>
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
                                                : <ButtonText style={styles.submitBtnText}>تسجيل الدخول</ButtonText>
                                            }
                                        </Button>

                                    </View>
                                )}
                            </Formik>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>أو تسجيل عبر</Text>
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
                            <TouchableOpacity onPress={() => router.push('./SignUp')}>
                                <Text style={styles.footerLink}> إنشاء حساب</Text>
                            </TouchableOpacity>
                            <Text style={styles.footerText}> ليس لديك حساب؟ </Text>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
