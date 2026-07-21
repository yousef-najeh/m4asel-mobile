import { Text, View } from "react-native";
import { Icon } from 'react-native-elements';
import { styles } from "./EmptyHistoryState.styles";

export default function EmptyHistoryState() {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
                <Icon name="event-busy" type="material" size={36} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>لا توجد حجوزات</Text>
            <Text style={styles.emptySubtitle}>ليس لديك أي حجوزات حتى الآن</Text>
        </View>
    );
}
