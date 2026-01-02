import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";

function DatePicker({ selectedDate, onSelectDate }) {
    const getDateRange = () => {
        const dates = [];
        const today = new Date();
        
        // Generate next 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        return dates;
    };

    const formatDateDisplay = (date, isToday) => {
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        
        if (isToday) {
            return 'اليوم';
        }
        
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = date.getMonth() + 1;
        
        return `${dayName}\n${day}/${month}`;
    };

    const formatDateISO = (date) => {
        return date.toISOString().split('T')[0];
    };

    const dates = getDateRange();

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesScroll}
            style={styles.container}
        >
            {dates.map((date, index) => {
                const dateISO = formatDateISO(date);
                const isSelected = selectedDate === dateISO;
                const isToday = index === 0;
                const displayText = formatDateDisplay(date, isToday);

                return (
                    <Pressable
                        key={index}
                        style={[
                            styles.dateCard,
                            isSelected && styles.dateCardSelected
                        ]}
                        onPress={() => onSelectDate(dateISO)}
                    >
                        <Text style={[
                            styles.dateText,
                            isSelected && styles.dateTextSelected
                        ]}>
                            {displayText}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    datesScroll: {
        flexDirection: "row",
        gap: 8,
        paddingRight: 16,
    },
    dateCard: {
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        minWidth: 70,
        alignItems: "center",
    },
    dateCardSelected: {
        backgroundColor: "#007AFF",
        borderColor: "#007AFF",
    },
    dateText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#374151",
        textAlign: "center",
        lineHeight: 18,
    },
    dateTextSelected: {
        color: "#FFFFFF",
    },
});

export default DatePicker;
