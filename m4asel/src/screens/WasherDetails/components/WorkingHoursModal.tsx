import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import HourMinutePicker from '@/src/shared/components/HourMinutePicker';
import { washersService } from '@/src/services/washers.service';
import { toHHMM } from '@/src/utils/helpers';
import { colors, palette } from '@/src/theme';
import { styles } from './WorkingHoursModal.styles';

type HoursField = 'open' | 'close';

interface WorkingHoursModalProps {
    visible: boolean;
    /** Which wheel to edit in this modal session. */
    field: HoursField;
    /** Current profile values — the field being edited seeds the wheel; the other
     *  is sent along unchanged so the backend always gets a valid open/close pair. */
    openingTime?: string | null;
    closingTime?: string | null;
    onClose: () => void;
    onSaved: () => void;
}

const FIELD_THEME = {
    open: {
        accent: colors.primary,
        icon: 'logout' as const,
        label: 'الفتح',
    },
    close: {
        accent: palette.red.solid,
        icon: 'login' as const,
        label: 'الإغلاق',
    },
};

export default function WorkingHoursModal({
    visible,
    field,
    openingTime,
    closingTime,
    onClose,
    onSaved,
}: WorkingHoursModalProps) {
    const [time, setTime] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const theme = FIELD_THEME[field];
    const initialValue = toHHMM(field === 'open' ? openingTime : closingTime);

    // Seed the picker from the profile every time the sheet opens.
    useEffect(() => {
        if (visible) setTime(initialValue);
    }, [visible, initialValue]);

    const canSave = !!time && time !== initialValue && !saving;

    const handleSave = async () => {
        if (!time) return;
        setSaving(true);
        try {
            const payload = field === 'open'
                ? { opening_time: time, closing_time: toHHMM(closingTime) ?? time }
                : { opening_time: toHHMM(openingTime) ?? time, closing_time: time };
            await washersService.updateHours(payload);
            onSaved();
        } catch {
            Alert.alert('خطأ', 'فشل حفظ ساعات العمل، حاول مجدداً');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.sheetWrapper}>
                <View style={styles.sheet}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Pressable style={styles.closeBtn} onPress={onClose}>
                            <Icon name="close" type="material" size={20} color="#6B7280" />
                        </Pressable>
                        <Text style={styles.title}>{`تعديل ${theme.label}`}</Text>
                        <View style={{ width: 36 }} />
                    </View>

                    <View style={styles.body}>
                        <View style={styles.wheelLabelRow}>
                            <Icon name={theme.icon} type="material" size={18} color={theme.accent} />
                            <Text style={[styles.wheelLabelText, { color: theme.accent }]}>{theme.label}</Text>
                        </View>
                        <HourMinutePicker
                            value={time}
                            onChange={setTime}
                            accentColor={theme.accent}
                        />

                        <Pressable
                            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={!canSave}
                        >
                            {saving
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Icon name="save" type="material" size={20} color="#fff" />}
                            <Text style={styles.saveBtnText}>{saving ? 'جارٍ الحفظ...' : 'حفظ'}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}