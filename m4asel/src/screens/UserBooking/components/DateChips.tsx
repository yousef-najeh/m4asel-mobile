import { FlatList, Pressable, Text } from "react-native";
import { styles } from "./DateChips.styles";

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = ['يناير','فبراير','مارس','إبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

const toISO = (date: Date) => date.toISOString().split('T')[0];

interface DateChipsProps {
    selectedDate: string;
    onSelectDate: (iso: string) => void;
}

/**
 * Horizontal date chips (Figma 258:4155): day name / day number / month stacked,
 * selected chip solid primary. Inverted list so today sits at the visual RIGHT
 * (RTL reading order) and later dates reveal by scrolling left.
 */
export default function DateChips({ selectedDate, onSelectDate }: DateChipsProps) {
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <FlatList
            horizontal
            inverted
            data={dates}
            keyExtractor={(d) => toISO(d)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item: date }) => {
                const iso = toISO(date);
                const isSelected = selectedDate === iso;
                return (
                    <Pressable
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => onSelectDate(iso)}
                        accessibilityState={{ selected: isSelected }}
                    >
                        <Text style={[styles.dayName, isSelected && styles.textSelected]}>
                            {DAYS[date.getDay()]}
                        </Text>
                        <Text style={[styles.dayNum, isSelected && styles.textSelected]}>
                            {date.getDate()}
                        </Text>
                        <Text style={[styles.monthName, isSelected && styles.textSelected]}>
                            {MONTHS[date.getMonth()]}
                        </Text>
                    </Pressable>
                );
            }}
        />
    );
}
