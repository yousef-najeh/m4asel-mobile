/** Time helpers shared by the booking pages. Slots from the API may be a full
 * ISO datetime or a bare "HH:MM" — always resolve against the selected date. */

export const slotToDate = (dateISO: string, slot: string): Date => {
    const raw = slot.includes("T") ? slot : `${dateISO}T${slot}`;
    return new Date(raw);
};

/** "h:mm ص|م" compact clock format (Figma style). */
export const formatClock = (d: Date): string => {
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const period = h >= 12 ? "م" : "ص";
    return `${h % 12 || 12}:${m} ${period}`;
};

export const formatSlotTime = (dateISO: string, slot: string): string =>
    formatClock(slotToDate(dateISO, slot));

/** Split a slot into wheel-column parts: 12h hour, zero-padded minutes, ص|م. */
export const slotParts = (dateISO: string, slot: string): { hour: string; minute: string; period: "ص" | "م" } => {
    const d = slotToDate(dateISO, slot);
    const h = d.getHours();
    return {
        hour: String(h % 12 || 12).padStart(2, "0"),
        minute: String(d.getMinutes()).padStart(2, "0"),
        period: h >= 12 ? "م" : "ص",
    };
};

/** Approximate booking end = slot start + service duration. */
export const computeEndTime = (dateISO: string, slot: string, durationMinutes: number): string =>
    formatClock(new Date(slotToDate(dateISO, slot).getTime() + durationMinutes * 60_000));
