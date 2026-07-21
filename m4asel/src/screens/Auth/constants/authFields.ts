import { type KeyboardTypeOptions, type TextInputProps } from 'react-native';

export interface LoginValues {
    email: string;
    password: string;
}

export interface SignUpValues {
    name: string;
    email: string;
    mobile_number: string;
    password: string;
}

/** Declarative descriptor for one AuthField row, keyed to a Formik value. */
export type FieldConfig<T> = {
    name: keyof T;
    icon: string;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: TextInputProps['autoCapitalize'];
    /** Password field: AuthField renders the show/hide toggle and owns visibility. */
    secure?: boolean;
};

export const LOGIN_FIELDS: FieldConfig<LoginValues>[] = [
    { name: 'email',    icon: 'person-outline', placeholder: 'البريد الإلكتروني', keyboardType: 'email-address', autoCapitalize: 'none' },
    { name: 'password', icon: 'lock-outline',   placeholder: 'كلمة المرور', secure: true },
];

export const SIGNUP_FIELDS: FieldConfig<SignUpValues>[] = [
    { name: 'name',          icon: 'person-outline',  placeholder: 'اسمك الكامل' },
    { name: 'email',         icon: 'alternate-email', placeholder: 'البريد الإلكتروني', keyboardType: 'email-address', autoCapitalize: 'none' },
    { name: 'password',      icon: 'lock-outline',    placeholder: 'كلمة المرور', secure: true },
    { name: 'mobile_number', icon: 'call',            placeholder: 'رقم الهاتف', keyboardType: 'phone-pad' },
];
