import { useEffect, useState, type ReactNode } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, Modal,
    Platform, Pressable, ScrollView, Switch, Text, TextInput, View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { ApiError } from '@/src/api/client';
import { washersService } from '@/src/services/washers.service';
import type { WashService } from '@/types/api';
import { styles } from './ServiceFormModal.styles';

interface ServiceFormModalProps {
    visible: boolean;
    service: WashService | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function ServiceFormModal({ visible, service, onClose, onSaved }: ServiceFormModalProps) {
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
        console.log('[ServiceForm] handleSave', {
            mode: isEdit ? 'edit' : 'create',
            serviceId: service?.id,
            raw: { name, price, duration, description, isActive },
            isValid: !!isValid,
        });
        if (!isValid) {
            console.warn('[ServiceForm] blocked — form invalid (name/price/duration required)');
            return;
        }
        try {
            setSaving(true);
            const base = {
                name: name.trim(),
                price: parseFloat(price),
                duration_minutes: parseInt(duration, 10),
                // Send an empty string (not null) when blank — the backend rejects null (422).
                description: description.trim(),
            };
            console.log('[ServiceForm] payload', {
                ...base,
                priceIsNaN: Number.isNaN(base.price),
                durationIsNaN: Number.isNaN(base.duration_minutes),
            });

            if (isEdit && service) {
                console.log('[ServiceForm] → updateService', service.id);
                const res = await washersService.updateService(service.id!, { ...base, is_active: isActive });
                console.log('[ServiceForm] ✓ updateService done', res);
            } else {
                console.log('[ServiceForm] → createService');
                const res = await washersService.createService(base);
                console.log('[ServiceForm] ✓ createService done', res);
            }

            onSaved();
        } catch (e) {
            console.error('[ServiceForm] ✗ save failed', {
                status: e instanceof ApiError ? e.status : undefined,
                detail: e instanceof ApiError ? e.detail : undefined,
                message: e instanceof Error ? e.message : String(e),
            });
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
