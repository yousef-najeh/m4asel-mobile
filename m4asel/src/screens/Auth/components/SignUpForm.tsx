import { Formik, type FormikHelpers } from 'formik';
import { useState } from 'react';
import { View } from 'react-native';
import * as Yup from 'yup';
import { authErrorMessages, authService } from '@/src/services/auth.service';
import { FIELD_COMPONENTS } from '@/src/shared/components/fields/registry';
import { SIGNUP_FIELDS, type SignUpValues } from '../constants/authFields';
import { styles } from '../AuthScreen.styles';
import AuthActions from './AuthActions';
import AuthErrorBox from './AuthErrorBox';

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

export default function SignUpForm() {
    const [serverError, setServerError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSignUp = async (values: SignUpValues, { setSubmitting }: FormikHelpers<SignUpValues>) => {
        setServerError('');
        try {
            await authService.register(values);
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            setServerError(authErrorMessages[message] ?? 'حدث خطأ في الاتصال، حاول مجدداً');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setServerError('');
        setGoogleLoading(true);
        try {
            await authService.signInWithGoogle();
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            setServerError(authErrorMessages[message] ?? 'تعذر تسجيل الدخول عبر Google، حاول مجدداً');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <Formik<SignUpValues>
            initialValues={{ name: '', email: '', mobile_number: '', password: '' }}
            validationSchema={schema}
            onSubmit={handleSignUp}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.formBlock}>
                    <View style={styles.form}>
                        {SIGNUP_FIELDS.map((f) => {
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

                        <AuthErrorBox message={serverError} />
                    </View>

                    <AuthActions
                        submitLabel="إنشاء الحساب"
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
