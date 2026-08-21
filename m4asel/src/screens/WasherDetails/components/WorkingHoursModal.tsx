import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import HourMinutePicker from '@/src/shared/components/HourMinutePicker';
import { washersService } from '@/src/services/washers.service';
import { toHHMM } from '@/src/utils/helpers';
import { colors, palette } from '@/src/theme';
import type { WasherProfile } from '@/types/api';
import { styles } from './WorkingHoursModal.styles';

type HoursField = 'open' | 'close';

interface WorkingHoursModalProps {
    visible: boolean;
    /** Which wheel to edit in this modal session. */
    field: HoursField;
    /** Full current washer profile — the edited field is merged into a copy and
     *  the whole profile is sent to PUT /washers/profile. */
    profile: WasherProfile;
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
    profile,
    onClose,
    onSaved,
}: WorkingHoursModalProps) {
    const [time, setTime] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const theme = FIELD_THEME[field];
    const initialValue = toHHMM(field === 'open' ? profile.opening_time : profile.closing_time);

    // Seed the picker from the profile every time the sheet opens.
    useEffect(() => {
        if (visible) setTime(initialValue);
    }, [visible, initialValue]);

    const canSave = !!time && time !== initialValue && !saving;

    const handleSave = async () => {
        if (!time) return;
        setSaving(true);
        try {
            // Merge the edited hour into a copy of the whole profile and send it
            // all to PUT /washers/profile. Both time fields are normalized to "HH:MM".
            const updated: WasherProfile = {
                ...profile,
                opening_time: field === 'open' ? time : (toHHMM(profile.opening_time) ?? '00:00'),
                closing_time: field === 'close' ? time : (toHHMM(profile.closing_time) ?? '00:00'),
            };
            await washersService.updateProfile(updated);
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