import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '@/src/theme';
import { styles } from '../AuthScreen.styles';

/** Inline server/validation error banner. Renders nothing when there's no message. */
export default function AuthErrorBox({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <View style={styles.errorBox} accessibilityRole="alert">
            <Icon name="error-outline" type="material" size={16} color={colors.danger} />
            <Text style={styles.errorBoxText}>{message}</Text>
        </View>
    );
}
