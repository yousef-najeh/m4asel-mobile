import FieldIcon from './FieldIcon';
import FieldShell from './FieldShell';
import type { TypedFieldProps } from './types';

/** Person-name input. Capitalises words and hints the OS name autofill. */
export default function NameField({
    placeholder = 'اسمك الكامل',
    iconProps,
    ...props
}: TypedFieldProps) {
    return (
        <FieldShell
            leading={<FieldIcon name="person-outline" override={iconProps} />}
            placeholder={placeholder}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            {...props}
        />
    );
}
