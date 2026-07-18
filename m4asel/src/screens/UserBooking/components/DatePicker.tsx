import { View, Text, Pressable, ScrollView } from "react-native";
import { styles } from "./DatePicker.styles";

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = ['يناير','فبراير','مارس','إبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

const toISO = (date: Date) => date.toISOString().split('T')[0];

interface DatePickerProps {
    selectedDate: string;
    onSelectDate: (iso: string) => void;
}

export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            style={styles.container}
        >
            {dates.map((date, i) => {
                const iso = toISO(date);
                const isSelected = selectedDate === iso;
                const isToday = i === 0;

                return (
                    <Pressable
                        key={i}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => onSelectDate(iso)}
                    >
                        <Text style={[styles.dayName, isSelected && styles.textSelected]}>
                            {isToday ? 'اليوم' : DAYS[date.getDay()]}
                        </Text>
                        <Text style={[styles.dayNum, isSelected && styles.textSelected]}>
                            {date.getDate()}
                        </Text>
                        {!isToday && (
                            <Text style={[styles.monthName, isSelected && styles.textSelectedSub]}>
                                {MONTHS[date.getMonth()]}
                            </Text>
                        )}
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}
