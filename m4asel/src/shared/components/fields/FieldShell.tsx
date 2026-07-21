import { useState, type ReactNode } from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '@/src/theme';
import { styles } from './FieldShell.styles';
import type { TypedFieldProps } from './types';

export interface FieldShellProps extends Omit<TypedFieldProps, 'iconProps'> {
    /**
     * Leading element — an icon, or a Pressable for types that need one.
     * Stays the first child so it renders on the *right* under `forceRTL`.
     */
    leading?: ReactNode;
    /** Only field types that own a visibility concept set this (see PasswordField). */
    secureTextEntry?: boolean;
}

/**
 * The presentational primitive behind every field: one rounded row with an
 * optional label above and an optional error below, plus self-contained focus
 * state. It knows nothing about emails, phones or passwords — that lives in the
 * typed components that wrap it.
 *
 * Style overrides are merged last in every array so a call site always wins.
 */
export default function FieldShell({
    leading,
    label,
    error,
    containerStyle,
    rowStyle,
    focusedRowStyle,
    errorRowStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    onFocus,
    onBlur,
    ...inputProps
}: FieldShellProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

            <View style={[
                styles.row,
                isFocused && styles.rowFocused,
                !!error && styles.rowError,
                rowStyle,
                isFocused && focusedRowStyle,
                !!error && errorRowStyle,
            ]}>
                {leading}
                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholderTextColor={colors.placeholder}
                    textAlign="right"
                    {...inputProps}
                    onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
                />
            </View>

            {error ? <Text style={[styles.errorText, errorStyle]}>{error}</Text> : null}
        </View>
    );
}
