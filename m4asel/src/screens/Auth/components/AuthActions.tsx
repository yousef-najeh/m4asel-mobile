import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { colors } from '@/src/theme';
import { styles } from '../AuthScreen.styles';

interface AuthActionsProps {
    submitLabel: string;
    onSubmit: () => void;
    isSubmitting: boolean;
    /** Wires up the Google button. Left undefined, the button stays inert (matches Apple/Facebook, not implemented yet). */
    onGooglePress?: () => void;
    googleLoading?: boolean;
}

/** Submit button + "or via" divider + social-login row, shared by both auth forms. */
export default function AuthActions({
    submitLabel, onSubmit, isSubmitting, onGooglePress, googleLoading,
}: AuthActionsProps) {
    return (
        <View style={styles.actions}>
            <Pressable
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={onSubmit}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={submitLabel}
                accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
            >
                {isSubmitting
                    ? <ActivityIndicator color={colors.onPrimary} />
                    : <Text style={styles.submitBtnText}>{submitLabel}</Text>}
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>او تسجيل عبر</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* Social (RTL order → Google, Facebook, Apple left→right) */}
            <View style={styles.socialRow}>
                <Pressable style={styles.socialBtn} accessibilityRole="button" accessibilityLabel="التسجيل عبر Apple">
                    <Image source={require('@/assets/images/apple-logo.png')} style={styles.socialImgFull} />
                </Pressable>
                <Pressable style={styles.socialBtn} accessibilityRole="button" accessibilityLabel="التسجيل عبر Facebook">
                    <Image source={require('@/assets/images/facebook-logo-2.png')} style={styles.socialIcon} />
                </Pressable>
                <Pressable
                    style={styles.socialBtn}
                    onPress={onGooglePress}
                    disabled={!onGooglePress || googleLoading}
                    accessibilityRole="button"
                    accessibilityLabel="التسجيل عبر Google"
                    accessibilityState={{ disabled: !onGooglePress || googleLoading, busy: googleLoading }}
                >
                    {googleLoading
                        ? <ActivityIndicator color={colors.primary} />
                        : <Image source={require('@/assets/images/google-logo.png')} style={styles.socialIcon} />}
                </Pressable>
            </View>
        </View>
    );
}
