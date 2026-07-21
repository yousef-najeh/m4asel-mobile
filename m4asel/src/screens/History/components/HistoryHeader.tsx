import { Text, View } from "react-native";
import { styles } from "./HistoryHeader.styles";

interface HistoryHeaderProps {
    count: number;
}

export default function HistoryHeader({ count }: HistoryHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>الحجوزات</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}</Text>
                </View>
            </View>
        </View>
    );
}
