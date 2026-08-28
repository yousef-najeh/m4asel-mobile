import { Text, View } from "react-native";
import { UserRole } from '@/src/constants/UserRole';
import { useAuth } from '@/src/context/AuthContext';
import { styles } from "./HistoryHeader.styles";

interface WasherHistoryHeaderProps {
    count: number;
}

export default function WasherHistoryHeader({ count }: WasherHistoryHeaderProps) {
    const { role } = useAuth();
    const isWasher = role === UserRole.WASHER_OWNER || role === UserRole.WASHER_WORKER;

    if (!isWasher) return null;

    return (
        <View style={styles.header}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>سجل الطلبات</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}</Text>
                </View>
            </View>
        </View>
    );
}
