import FieldIcon from './FieldIcon';
import FieldShell from './FieldShell';
import type { TypedFieldProps } from './types';

/**
 * Email input. Owns its icon, keyboard and autofill hints so no form has to
 * restate them. Every default is overridable — `{...props}` spreads last.
 */
export default function EmailField({
    placeholder = 'البريد الإلكتروني',
    iconProps,
    ...props
}: TypedFieldProps) {
    return (
        <FieldShell
            leading={<FieldIcon name="alternate-email" override={iconProps} />}
            placeholder={placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textContentType="emailAddress"
            autoComplete="email"
            {...props}
        />
    );
}
