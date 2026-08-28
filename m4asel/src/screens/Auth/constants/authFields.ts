import type { FieldConfig } from '@/src/shared/components/fields/types';

export interface LoginValues {
    phone: string;
    password: string;
}

export interface SignUpValues {
    name: string;
    phone: string;
    password: string;
}

/**
 * Which fields each form renders, in order. Icons, keyboards, placeholders and
 * autofill hints live in the field components themselves — see
 * `src/shared/components/fields/`.
 */
export const LOGIN_FIELDS: FieldConfig<LoginValues>[] = [
    { name: 'phone',    type: 'phone' },
    { name: 'password', type: 'password' },
];

export const SIGNUP_FIELDS: FieldConfig<SignUpValues>[] = [
    { name: 'name',     type: 'name' },
    {
        name: 'phone',
        type: 'phone',
        props: { autoComplete: 'tel', textContentType: 'telephoneNumber' },
    },
    {
        name: 'password',
        type: 'password',
        // Signals a *new* password so the OS/password manager offers to generate
        // and save one, rather than autofilling the existing one.
        props: { autoComplete: 'new-password', textContentType: 'newPassword' },
    },
];
