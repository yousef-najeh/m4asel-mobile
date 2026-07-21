import { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, Modal,
    Platform, Pressable, ScrollView, Switch, Text, View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { ApiError } from '@/src/api/client';
import { washersService } from '@/src/services/washers.service';
import DurationField from '@/src/shared/components/fields/DurationField';
import PriceField from '@/src/shared/components/fields/PriceField';
import TextAreaField from '@/src/shared/components/fields/TextAreaField';
import TextField from '@/src/shared/components/fields/TextField';
import type { WashService } from '@/types/api';
import { fieldOverrides, styles } from './ServiceFormModal.styles';

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
        if (!isValid) return;
        try {
            setSaving(true);
            const base = {
                name: name.trim(),
                price: parseFloat(price),
                duration_minutes: parseInt(duration, 10),
                // Send an empty string (not null) when blank — the backend rejects null (422).
                description: description.trim(),
            };

            if (isEdit && service) {
                await washersService.updateService(service.id!, { ...base, is_active: isActive });
            } else {
                await washersService.createService(base);
            }

            onSaved();
        } catch (e) {
            if (__DEV__) {
                console.error('[ServiceForm] save failed', {
                    status: e instanceof ApiError ? e.status : undefined,
                    detail: e instanceof ApiError ? e.detail : undefined,
                });
            }
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
                        <TextField
                            {...fieldOverrides}
                            label="اسم الخدمة *"
                            placeholder="مثال: غسيل خارجي"
                            value={name}
                            onChangeText={setName}
                        />

                        <View style={styles.row}>
                            <DurationField
                                {...fieldOverrides}
                                containerStyle={styles.fieldFlex}
                                label="المدة (دقيقة) *"
                                placeholder="60"
                                value={duration}
                                onChangeText={setDuration}
                            />
                            <PriceField
                                {...fieldOverrides}
                                containerStyle={styles.fieldFlex}
                                label="السعر (nis) *"
                                placeholder="50"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>

                        <TextAreaField
                            {...fieldOverrides}
                            label="الوصف (اختياري)"
                            placeholder="وصف مختصر للخدمة..."
                            value={description}
                            onChangeText={setDescription}
                        />

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
