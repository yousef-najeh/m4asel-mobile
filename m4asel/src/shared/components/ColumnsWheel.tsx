import { useEffect, useRef } from "react";
import { Fragment } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/src/theme";

export type ColumnValues = Record<string, string | null>;

export interface ColumnDef {
    key: string;
    /** Static option list, OR a resolver that returns options based on the
     *  current column values — enabling cascading columns (e.g. the minute
     *  options depend on the selected hour: `{ "09": ["00","10","20"], "10": [] }`). */
    options: string[] | ((values: ColumnValues) => string[]);
    /** Not rendered in the unified design (kept for API compatibility). */
    label?: string;
    /** Whether to render a `:` separator before this column. Default true; set
     *  false for a column that isn't a time-part (e.g. the ص/م period column). */
    colonBefore?: boolean;
}

interface ColumnsWheelProps {
    columns: ColumnDef[];
    values: ColumnValues;
    /** Emitted with the full next-values map whenever any column changes.
     *  Cascading: when a parent column changes, dependent columns whose current
     *  value is no longer valid are auto-corrected (to the first option, or null
     *  when empty) and included in the same emission. */
    onChange: (next: ColumnValues) => void;
    accentColor?: string;
    emptyText?: string;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const CARD_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const SPACER_ROWS = Math.floor(VISIBLE_ROWS / 2);
const ROW_OFFSETS = Array.from({ length: VISIBLE_ROWS }, (_, i) => i - SPACER_ROWS);

const resolveOptions = (col: ColumnDef, values: ColumnValues): string[] =>
    typeof col.options === "function" ? col.options(values) : col.options;

/**
 * Unified multi-column wheel — the old TimeWheel look (one card, `:` between
 * columns, 5-row windows with an underlined selected value and faded neighbors),
 * but each column scrolls **independently** via its own overlay ScrollView.
 *
 * Supports **cascading columns**: a column's `options` may be a function of the
 * current values, so changing a parent column (e.g. hour) recomputes a child
 * column's options (e.g. minutes) and auto-corrects a now-invalid selection.
 */
export default function ColumnsWheel({
    columns,
    values,
    onChange,
    accentColor = colors.primary,
    emptyText = "لا توجد خيارات",
}: ColumnsWheelProps) {
    const handleColumnSelect = (key: string, value: string) => {
        let next: ColumnValues = { ...values, [key]: value };
        // Cascade to a fixpoint: recompute every dependent column from the
        // accumulated values and correct stale selections. Iterating to a
        // fixpoint (rather than a single pass) lets a column depend on a LATER
        // column — e.g. minutes depend on the period column that comes after it.
        let changed = true;
        let guard = 0;
        while (changed && guard++ < columns.length + 2) {
            changed = false;
            for (const col of columns) {
                if (col.key === key) continue;
                if (typeof col.options !== "function") continue;
                const opts = col.options(next);
                const cur = next[col.key];
                if (cur == null || !opts.includes(cur)) {
                    next = { ...next, [col.key]: opts[0] ?? null };
                    changed = true;
                }
            }
        }
        onChange(next);
    };

    return (
        <View style={styles.card}>
            <View style={styles.columnsRow}>
                {columns.map((col, idx) => (
                    <Fragment key={col.key}>
                        {idx > 0 && col.colonBefore !== false && (
                            <Text style={[styles.colon, { color: accentColor }]}>:</Text>
                        )}
                        <ColumnWheel
                            options={resolveOptions(col, values)}
                            selectedValue={values[col.key] ?? null}
                            onSelect={(v) => handleColumnSelect(col.key, v)}
                            accentColor={accentColor}
                            emptyText={emptyText}
                        />
                    </Fragment>
                ))}
            </View>
        </View>
    );
}

interface ColumnWheelProps {
    options: string[];
    selectedValue: string | null;
    onSelect: (value: string) => void;
    accentColor: string;
    emptyText: string;
}

function ColumnWheel({ options, selectedValue, onSelect, accentColor, emptyText }: ColumnWheelProps) {
    const scrollRef = useRef<ScrollView>(null);
    const lastSelectedRef = useRef<string | null>(null);

    const selectedIndex = selectedValue ? options.indexOf(selectedValue) : -1;

    // Scroll to an externally-seeded or cascade-corrected selection.
    useEffect(() => {
        if (!selectedValue || selectedValue === lastSelectedRef.current) return;
        const idx = options.indexOf(selectedValue);
        if (idx >= 0) {
            lastSelectedRef.current = selectedValue;
            requestAnimationFrame(() =>
                scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: false }),
            );
        }
    }, [selectedValue, options]);

    const selectByOffset = (offsetY: number) => {
        const idx = Math.min(options.length - 1, Math.max(0, Math.round(offsetY / ITEM_HEIGHT)));
        if (options[idx] && options[idx] !== selectedValue) {
            lastSelectedRef.current = options[idx];
            onSelect(options[idx]);
        }
    };

    if (options.length === 0) {
        return (
            <View style={[styles.column, styles.center]}>
                <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
        );
    }

    const rowValue = (offset: number) => {
        const i = selectedIndex + offset;
        return i >= 0 && i < options.length ? options[i] : null;
    };

    return (
        <View style={styles.column}>
            {/* Visual 5-row window centered on the selected value (non-interactive). */}
            <View style={styles.visual} pointerEvents="none">
                {ROW_OFFSETS.map((off) => {
                    const val = rowValue(off);
                    const active = off === 0;
                    return (
                        <View
                            key={off}
                            style={[styles.cell, active && styles.cellSelected, active && { borderBottomColor: accentColor }]}
                        >
                            <Text style={[styles.cellText, active && styles.cellTextSelected, active && { color: accentColor }]}>
                                {val ?? ""}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Invisible scroll surface driving this column only. */}
            <ScrollView
                ref={scrollRef}
                style={styles.scrollOverlay}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                nestedScrollEnabled
                scrollEventThrottle={16}
                onScroll={(e) => selectByOffset(e.nativeEvent.contentOffset.y)}
                onMomentumScrollEnd={(e) => selectByOffset(e.nativeEvent.contentOffset.y)}
            >
                <View style={{ height: (options.length - 1) * ITEM_HEIGHT + VISIBLE_ROWS * ITEM_HEIGHT }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        height: CARD_HEIGHT,
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primaryFaint,
        overflow: "hidden",
    },
    columnsRow: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing["2xl"],
    },
    column: {
        height: CARD_HEIGHT,
        minWidth: 48,
        justifyContent: "center",
    },
    visual: {
        justifyContent: "center",
    },
    center: { alignItems: "center" },
    emptyText: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: "center" },
    cell: {
        height: ITEM_HEIGHT,
        minWidth: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    cellSelected: { borderBottomWidth: 2 },
    cellText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.medium,
        color: colors.placeholder,
    },
    cellTextSelected: {
        fontSize: fontSize["2xl"],
        fontWeight: fontWeight.bold,
    },
    colon: {
        fontSize: fontSize["2xl"],
        fontWeight: fontWeight.bold,
    },
    scrollOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent",
    },
});