import type { FieldConfig } from '@/src/shared/components/fields/types';

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

/**
 * Which fields each form renders, in order. Icons, keyboards, placeholders and
 * autofill hints live in the field components themselves — see
 * `src/shared/components/fields/`.
 */
export const LOGIN_FIELDS: FieldConfig<LoginValues>[] = [
    { name: 'email',    type: 'email' },
    { name: 'password', type: 'password' },
];

export const SIGNUP_FIELDS: FieldConfig<SignUpValues>[] = [
    { name: 'name',     type: 'name' },
    { name: 'email',    type: 'email' },
    {
        name: 'password',
        type: 'password',
        // Signals a *new* password so the OS/password manager offers to generate
        // and save one, rather than autofilling the existing one.
        props: { autoComplete: 'new-password', textContentType: 'newPassword' },
    },
    { name: 'mobile_number', type: 'phone' },
];
