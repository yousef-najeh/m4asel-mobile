// Accepts full ISO datetime ("2024-01-15T09:00:00Z") or time string ("09:00:00" / "09:00:00.000Z")
export const formatTime = (input) => {
    if (!input) return 'غير محدد';
    try {
        let h, m;
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
