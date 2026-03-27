import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { AuthErrorCodes, signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image, Keyboard, KeyboardAvoidingView, Platform,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { auth } from '../../util/fireBaseConfig';

const authErrorMessages = {
    [AuthErrorCodes.USER_DELETED]: 'لا يوجد حساب بهذا البريد الإلكتروني',
    [AuthErrorCodes.INVALID_PASSWORD]: 'كلمة المرور غير صحيحة',
    [AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: 'تم تجاوز عدد المحاولات، حاول لاحقاً',
};

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

    const handleLogin = async (values, { setSubmitting }) => {
        setFirebaseError('');
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
        } catch (error) {
            setFirebaseError(authErrorMessages[error?.code] || 'حدث خطأ، حاول مجدداً');
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
                            <Formik
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
                                            onPress={handleSubmit}
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
                                    <Image source={require('../../assets/images/google-logo.png')} style={styles.socialIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <Image source={require('../../assets/images/facebook-logo-2.png')} style={styles.socialIcon} />
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
        fontSize: 30,
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
        gap: 14,
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
        marginVertical: 16,
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
