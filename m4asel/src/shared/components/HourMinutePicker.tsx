import { useMemo } from "react";
import ColumnsWheel, { type ColumnDef, type ColumnValues } from "./ColumnsWheel";

/** An hour → minutes map. Each key is a 24h hour option, and its array is the
 *  minute options shown when that hour is selected. e.g.
 *  `{ "09": ["00","10","20"], "10": ["00","15"], "11": [] }`. */
export type HoursMap = Record<string, string[]>;

type Period = "ص" | "م";

interface HourMinutePickerProps {
    /** Current time as "HH:MM" in 24h (or null/undefined when unset). */
    value?: string | null;
    /** Emitted as "HH:MM" (24h) whenever any wheel changes. */
    onChange: (time: string) => void;
    /** Accent color for the selected cells + colon. */
    accentColor?: string;
    /** Hour → minutes map driving the wheels. When omitted, every hour 00–23
     *  gets minutes stepped by `minuteStep`. */
    hours?: HoursMap;
    /** Step between minute options when building the default `hours` map.
     *  Default 10 → 00,10,20,30,40,50 for every hour. */
    minuteStep?: number;
    /** Render a 12h hour wheel + a ص/م day/night wheel alongside minutes
     *  (hour : minute  ص/م). The value in/out is still 24h "HH:MM". Default true. */
    use12Hour?: boolean;
    emptyText?: string;
}

/** Default map: every hour 00–23 shares the same stepped-minute list. */
const buildDefaultHours = (step: number): HoursMap => {
    const minutes = Array.from({ length: Math.floor(60 / step) }, (_, i) =>
        String(i * step).padStart(2, "0"),
    );
    const map: HoursMap = {};
    for (let h = 0; h < 24; h++) map[String(h).padStart(2, "0")] = minutes;
    return map;
};

/** 24h hour key → { 12h hour, period }. */
const to12 = (h24: string): { hour12: string; period: Period } => {
    const h = parseInt(h24, 10);
    return {
        hour12: String(h % 12 || 12).padStart(2, "0"),
        period: h >= 12 ? "م" : "ص",
    };
};

/** 12h hour + period → 24h hour key. */
const to24 = (hour12: string, period: Period): string => {
    const h = parseInt(hour12, 10);
    const h24 = period === "م" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
    return String(h24).padStart(2, "0");
};

/**
 * Reusable hour + minutes picker. Two modes:
 *  - 24h (default when `use12Hour` is false): hour | minute wheels.
 *  - 12h with day/night (`use12Hour`, the default): hour(12h) | minute | ص/م.
 *
 * Driven by an hour → minutes map: change the hour wheel and the minute wheel
 * swaps to that hour's related minutes; in 12h mode the ص/م wheel also cascades
 * (each 12h hour lists only the periods that exist in the map). The value
 * emitted is always 24h "HH:MM".
 */
export default function HourMinutePicker({
    value,
    onChange,
    accentColor,
    hours,
    minuteStep = 10,
    use12Hour = true,
    emptyText = "لا توجد خيارات",
}: HourMinutePickerProps) {
    const hoursMap = useMemo(() => hours ?? buildDefaultHours(minuteStep), [hours, minuteStep]);

    const columns = useMemo<ColumnDef[]>(() => {
        if (!use12Hour) {
            const hourKeys = Object.keys(hoursMap).sort();
            return [
                { key: "hour", label: "الساعة", options: hourKeys },
                {
                    key: "minute",
                    label: "الدقيقة",
                    options: (v: ColumnValues) => hoursMap[v.hour ?? hourKeys[0]] ?? [],
                },
            ];
        }

        // 12h mode: distinct 12h hours present in the map, sorted numerically.
        const hour12Options = Array.from(
            new Set(Object.keys(hoursMap).map((h24) => to12(h24).hour12)),
        ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

        const periodsForHour12 = (hour12: string): Period[] => {
            const res: Period[] = [];
            if (hoursMap[to24(hour12, "ص")]) res.push("ص");
            if (hoursMap[to24(hour12, "م")]) res.push("م");
            return res;
        };

        const firstHour = hour12Options[0] ?? "12";
        return [
            { key: "hour", label: "الساعة", options: hour12Options },
            {
                key: "minute",
                label: "الدقيقة",
                options: (v: ColumnValues) =>
                    hoursMap[to24(v.hour ?? firstHour, (v.period as Period) ?? "ص")] ?? [],
            },
            {
                key: "period",
                label: "الفقرة",
                options: (v: ColumnValues) => periodsForHour12(v.hour ?? firstHour),
                colonBefore: false,
            },
        ];
    }, [hoursMap, use12Hour]);

    // Decompose the 24h "HH:MM" value into column values.
    const h24 = value ? value.slice(0, 2) : null;
    const minute = value ? value.slice(3, 5) : null;
    const t12 = h24 ? to12(h24) : null;
    const values: ColumnValues = use12Hour
        ? { hour: t12?.hour12 ?? null, minute, period: t12?.period ?? null }
        : { hour: h24, minute };

    const handleChange = (next: ColumnValues) => {
        if (use12Hour) {
            const h = to24(next.hour ?? "12", (next.period as Period) ?? "ص");
            const m = next.minute ?? "00";
            onChange(`${h}:${m}`);
        } else {
            onChange(`${next.hour ?? "00"}:${next.minute ?? "00"}`);
        }
    };

    return (
        <ColumnsWheel
            columns={columns}
            values={values}
            onChange={handleChange}
            accentColor={accentColor}
            emptyText={emptyText}
        />
    );
}