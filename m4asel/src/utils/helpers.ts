// Accepts full ISO datetime ("2024-01-15T09:00:00Z") or time string ("09:00:00" / "09:00:00.000Z")
export const formatTime = (input?: string | null): string => {
    if (!input) return 'غير محدد';
    try {
        let h: number, m: number;
        if (input.includes('T')) {
            const d = new Date(input);
            h = d.getHours();
            m = d.getMinutes();
        } else {
            const parts = input.replace('Z', '').split(':');
            h = parseInt(parts[0], 10);
            m = parseInt(parts[1], 10);
        }
        const ampm = h >= 12 ? 'مساءً' : 'صباحاً';
        const h12 = h % 12 || 12;
        return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
    } catch {
        return input;
    }
};

export const formatDateTime = (isoString?: string | null): { date: string; time: string; day: string } => {
    if (!isoString) return { date: '---', time: '---', day: '---' };
    try {
        const d = new Date(isoString);
        const months = ['يناير','فبراير','مارس','إبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
        const days = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
        const date = `${d.getDate()} ${months[d.getMonth()]}`;
        const day = days[d.getDay()];
        let h = d.getHours();
        const m = String(d.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'م' : 'ص';
        h = h % 12 || 12;
        return { date, time: `${h}:${m} ${ampm}`, day };
    } catch { return { date: '---', time: '---', day: '---' }; }
};

export const formatDistance = (km?: number | null): string | null => {
    if (km == null) return null;
    return km < 1 ? `${(km * 1000).toFixed(0)} م` : `${km.toFixed(1)} كم`;
};

/** Normalize a stored time (full ISO datetime or "HH:MM[:SS]") to a bare "HH:MM"
 *  so it matches an option from `generateHourlySlots`. Returns null when unset. */
export const toHHMM = (input?: string | null): string | null => {
    if (!input) return null;
    try {
        let h: number, m: number;
        if (input.includes('T')) {
            const d = new Date(input);
            h = d.getHours();
            m = d.getMinutes();
        } else {
            const parts = input.replace('Z', '').split(':');
            h = parseInt(parts[0], 10);
            m = parseInt(parts[1], 10);
        }
        if (Number.isNaN(h) || Number.isNaN(m)) return null;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    } catch {
        return null;
    }
};

/** 24 hourly slot options: "00:00", "01:00", … "23:00". */
export const generateHourlySlots = (): string[] => generateTimeSlots(60);

/** Time options across a full day at `stepMinutes` granularity, e.g. step 10 →
 *  "00:00","00:10",…,"23:50". Used by the working-hours wheel so minutes scroll
 *  in 10-minute increments. */
export const generateTimeSlots = (stepMinutes: number): string[] => {
    const total = Math.floor((24 * 60) / stepMinutes);
    return Array.from({ length: total }, (_, i) => {
        const m = i * stepMinutes;
        return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    });
};
