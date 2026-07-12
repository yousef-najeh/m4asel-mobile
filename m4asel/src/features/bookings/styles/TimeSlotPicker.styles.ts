import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    dateLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 12,
        textAlign: "center",
    },
    timesLoading: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingVertical: 32,
    },
    timesLoadingText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "600",
    },
    noTimes: {
        alignItems: "center",
        paddingVertical: 40,
        gap: 12,
    },
    noTimesText: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
    },
    timesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
    },
    timeSlot: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#E5E7EB",
        width: 110,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    timeSlotSelected: {
        backgroundColor: "#007AFF",
        borderColor: "#007AFF",
    },
    iconContainer: {
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    timeText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#374151",
    },
    timeTextSelected: {
        color: "#FFFFFF",
    },
});
