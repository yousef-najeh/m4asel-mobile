import { useEffect, useState, type ReactNode } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, Modal,
    Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import type { User } from 'firebase/auth';
import type { WashService } from '@/types/api';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ServiceFormModalProps {
    visible: boolean;
    service: WashService | null;
    washerId?: number;
    user: User;
    onClose: () => void;
    onSaved: () => void;
}

export default function ServiceFormModal({ visible, service, washerId, user, onClose, onSaved }: ServiceFormModalProps) {
    const isEdit = !!service;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (visible) {
            setName(service?.name ?? '');
            setPrice(service?.price != null ? String(service.price) : '');
            setDuration(service?.duration_minutes != null ? String(service.duration_minutes) : '');
            setDescription(service?.description ?? '');
            setIsActive(service?.is_active ?? true);
        }
    }, [visible, service]);

    const isValid = name.trim() && price.trim() && duration.trim();

    const handleSave = async () => {
        if (!isValid) return;
        try {
            setSaving(true);
            const token = await user.getIdToken();
            const body = {
                name: name.trim(),
                price: parseFloat(price),
                duration_minutes: parseInt(duration, 10),
                description: description.trim() || null,
                ...(isEdit && { is_active: isActive }),
            };

            const url = isEdit
                ? `${apiUrl}/washers/services/${service.id}`
                : `${apiUrl}/washers/${washerId}/services/`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.detail || 'فشلت العملية');
            }

            onSaved();
        } catch (e) {
            Alert.alert('خطأ', e instanceof Error ? e.message : 'حدث خطأ، حاول مجدداً');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.sheetWrapper}
            >
                <View style={styles.sheet}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable style={styles.closeBtn} onPress={onClose}>
                            <Icon name="close" type="material" size={20} color="#6B7280" />
                        </Pressable>
                        <Text style={styles.title}>{isEdit ? 'تعديل الخدمة' : 'إضافة خدمة'}</Text>
                        <View style={{ width: 36 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                        <Field label="اسم الخدمة *" required>
                            <TextInput
                                style={styles.input}
                                placeholder="مثال: غسيل خارجي"
                                placeholderTextColor="#9CA3AF"
                                textAlign="right"
                                value={name}
                                onChangeText={setName}
                            />
                        </Field>

                        <View style={styles.row}>
                            <Field label="المدة (دقيقة) *" flex>
                                <TextInput
                                    style={styles.input}
                                    placeholder="60"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="number-pad"
                                    textAlign="right"
                                    value={duration}
                                    onChangeText={setDuration}
                                />
                            </Field>
                            <Field label="السعر (nis) *" flex>
                                <TextInput
                                    style={styles.input}
                                    placeholder="50"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="decimal-pad"
                                    textAlign="right"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </Field>
                        </View>

                        <Field label="الوصف (اختياري)">
                            <TextInput
                                style={[styles.input, styles.textarea]}
                                placeholder="وصف مختصر للخدمة..."
                                placeholderTextColor="#9CA3AF"
                                textAlign="right"
                                multiline
                                numberOfLines={3}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </Field>

                        {isEdit && (
                            <View style={styles.toggleRow}>
                                <Switch
                                    value={isActive}
                                    onValueChange={setIsActive}
                                    trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                                    thumbColor={isActive ? '#007AFF' : '#9CA3AF'}
                                />
                                <View style={styles.toggleInfo}>
                                    <Text style={styles.toggleLabel}>حالة الخدمة</Text>
                                    <Text style={[styles.toggleStatus, { color: isActive ? '#059669' : '#EF4444' }]}>
                                        {isActive ? 'مفعّلة — تظهر للعملاء' : 'معطّلة — مخفية عن العملاء'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <Pressable
                            style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={!isValid || saving}
                        >
                            {saving
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Icon name={isEdit ? 'save' : 'add-circle'} type="material" size={20} color="#fff" />
                            }
                            <Text style={styles.saveBtnText}>{saving ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الخدمة'}</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

interface FieldProps {
    label: string;
    children: ReactNode;
    flex?: boolean;
    required?: boolean;
}

const Field = ({ label, children, flex }: FieldProps) => (
    <View style={[styles.field, flex && { flex: 1 }]}>
        <Text style={styles.label}>{label}</Text>
        {children}
    </View>
);

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheetWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: 32,
        maxHeight: '90%',
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginTop: 12, marginBottom: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    closeBtn: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center', alignItems: 'center',
    },
    title: { fontSize: 17, fontWeight: '800', color: '#111827' },

    form: { padding: 20, gap: 14 },
    row: { flexDirection: 'row', gap: 12 },
    field: { gap: 6 },
    label: { fontSize: 13, fontWeight: '700', color: '#374151', textAlign: 'right' },
    input: {
        borderWidth: 1.5, borderColor: '#E5E7EB',
        borderRadius: 12, backgroundColor: '#F9FAFB',
        paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 15, color: '#111827',
    },
    textarea: { height: 80, textAlignVertical: 'top' },

    saveBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, backgroundColor: '#007AFF',
        paddingVertical: 14, borderRadius: 14, marginTop: 6,
        shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    saveBtnDisabled: { backgroundColor: '#D1D5DB', shadowColor: 'transparent', elevation: 0 },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    toggleInfo: { flex: 1, gap: 3 },
    toggleLabel: { fontSize: 14, fontWeight: '700', color: '#374151', textAlign: 'right' },
    toggleStatus: { fontSize: 12, fontWeight: '600', textAlign: 'right' },
});
