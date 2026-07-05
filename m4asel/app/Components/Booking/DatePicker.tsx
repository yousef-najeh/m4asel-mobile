import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    scroll: { gap: 8, paddingHorizontal: 2, paddingVertical: 4 },
    pill: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        minWidth: 66,
        gap: 2,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    pillSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
        shadowColor: '#007AFF',
        shadowOpacity: 0.3,
        elevation: 4,
    },
    dayName: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
    dayNum: { fontSize: 20, fontWeight: '800', color: '#111827' },
    monthName: { fontSize: 10, fontWeight: '600', color: '#9CA3AF' },
    textSelected: { color: '#FFFFFF' },
    textSelectedSub: { color: 'rgba(255,255,255,0.75)' },
});
