import { Formik, type FormikHelpers } from 'formik';
import { useState } from 'react';
import { Text, View } from 'react-native';
import * as Yup from 'yup';
import { authErrorMessages, authService } from '@/src/services/auth.service';
import { FIELD_COMPONENTS } from '@/src/shared/components/fields/registry';
import { LOGIN_FIELDS, type LoginValues } from '../constants/authFields';
import { styles } from '../AuthScreen.styles';
import AuthActions from './AuthActions';
import AuthErrorBox from './AuthErrorBox';

const schema = Yup.object().shape({
    phone: Yup.string()
        .matches(/^\+?[0-9]{9,15}$/, 'رقم الجوال غير صالح')
        .required('رقم الجوال مطلوب'),
    password: Yup.string()
        .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
        .required('كلمة المرور مطلوبة'),
});

export default function LoginForm() {
    const [authError, setAuthError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async (values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>) => {
        setAuthError('');
        try {
            await authService.signIn(values.phone, values.password);
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            setAuthError(authErrorMessages[message] ?? 'حدث خطأ، حاول مجدداً');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setAuthError('');
        setGoogleLoading(true);
        try {
            await authService.signInWithGoogle();
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            setAuthError(authErrorMessages[message] ?? 'تعذر تسجيل الدخول عبر Google، حاول مجدداً');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <Formik<LoginValues>
            initialValues={{ phone: '', password: '' }}
            validationSchema={schema}
            onSubmit={handleLogin}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.formBlock}>
                    <View style={styles.form}>
                        {LOGIN_FIELDS.map((f) => {
                            const Field = FIELD_COMPONENTS[f.type];
                            return (
                                <Field
                                    key={f.name}
                                    value={values[f.name]}
                                    onChangeText={handleChange(f.name)}
                                    onBlur={handleBlur(f.name)}
                                    error={touched[f.name] ? errors[f.name] : undefined}
                                    {...f.props}
                                />
                            );
                        })}

                        <Text style={styles.forgot}>نسيت كلمة السر؟</Text>

                        <AuthErrorBox message={authError} />
                    </View>

                    <AuthActions
                        submitLabel="تسجيل الدخول"
                        onSubmit={() => handleSubmit()}
                        isSubmitting={isSubmitting}
                        onGooglePress={handleGoogleSignIn}
                        googleLoading={googleLoading}
                    />
                </View>
            )}
        </Formik>
    );
}
