import { FirebaseError } from 'firebase/app';
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
    email: Yup.string()
        .email('البريد الإلكتروني غير صالح')
        .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
        .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
        .required('كلمة المرور مطلوبة'),
});

export default function LoginForm() {
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
        <Formik<LoginValues>
            initialValues={{ email: '', password: '' }}
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

                        <AuthErrorBox message={firebaseError} />
                    </View>

                    <AuthActions
                        submitLabel="تسجيل الدخول"
                        onSubmit={() => handleSubmit()}
                        isSubmitting={isSubmitting}
                    />
                </View>
            )}
        </Formik>
    );
}
