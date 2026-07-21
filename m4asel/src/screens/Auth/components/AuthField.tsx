import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '@/src/theme';
import { styles } from '../AuthScreen.styles';

interface AuthFieldProps extends TextInputProps {
    iconName: string;
    iconType?: string;
    /** Password field: renders a lock show/hide toggle and owns the visibility state. */
    secure?: boolean;
    /** Validation message; also drives the error border. */
    error?: string;
}

/**
 * One rounded input row (leading icon + RTL text field) with self-contained
 * focus state. For `secure` fields it also owns the password show/hide toggle.
 * Renders an optional error message below. Shared by both auth forms.
 */
export default function AuthField({
    iconName,
    iconType = 'material',
    secure = false,
    error,
    onBlur,
    ...inputProps
}: AuthFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [visible, setVisible] = useState(false);

    const effectiveIcon = secure ? (visible ? 'lock-open' : 'lock-outline') : iconName;
    const icon = <Icon name={effectiveIcon} type={iconType} size={22} color={colors.accentFocus} />;

    return (
        <>
            <View style={[
                styles.inputRow,
                isFocused && styles.inputRowFocused,
                !!error && styles.inputRowError,
            ]}>
                {secure ? (
                    <Pressable
                        style={styles.iconBtn}
                        onPress={() => setVisible(v => !v)}
                        accessibilityRole="button"
                        accessibilityLabel={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                        {icon}
                    </Pressable>
                ) : icon}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={colors.placeholder}
                    textAlign="right"
                    {...inputProps}
                    secureTextEntry={secure && !visible}
                    onFocus={(e) => { setIsFocused(true); inputProps.onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
                />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </>
    );
}
