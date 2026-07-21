import { useState } from 'react';
import { Pressable } from 'react-native';
import FieldIcon from './FieldIcon';
import FieldShell from './FieldShell';
import { styles } from './FieldShell.styles';
import type { TypedFieldProps } from './types';

/**
 * Password input. This is the one field type with real behaviour of its own: it
 * owns the show/hide state and swaps the lock icon, which is why that logic no
 * longer sits in the shared primitive.
 *
 * Defaults to `current-password`; sign-up forms should pass
 * `autoComplete="new-password"` so the OS offers to generate one instead.
 */
export default function PasswordField({
    placeholder = 'كلمة المرور',
    iconProps,
    ...props
}: TypedFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <FieldShell
            leading={
                <Pressable
                    style={styles.iconBtn}
                    onPress={() => setVisible(v => !v)}
                    accessibilityRole="button"
                    accessibilityLabel={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                    <FieldIcon name={visible ? 'lock-open' : 'lock-outline'} override={iconProps} />
                </Pressable>
            }
            placeholder={placeholder}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            autoComplete="current-password"
            {...props}
        />
    );
}
