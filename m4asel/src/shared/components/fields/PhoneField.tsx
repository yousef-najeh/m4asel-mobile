import FieldIcon from './FieldIcon';
import FieldShell from './FieldShell';
import type { TypedFieldProps } from './types';

/** Phone-number input. Numeric keypad plus the OS telephone autofill hint. */
export default function PhoneField({
    placeholder = 'رقم الهاتف',
    iconProps,
    ...props
}: TypedFieldProps) {
    return (
        <FieldShell
            leading={<FieldIcon name="call" override={iconProps} />}
            placeholder={placeholder}
            keyboardType="phone-pad"
            autoCorrect={false}
            textContentType="telephoneNumber"
            autoComplete="tel"
            {...props}
        />
    );
}
