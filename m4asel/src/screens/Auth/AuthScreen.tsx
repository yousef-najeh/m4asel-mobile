import { useState } from 'react';
import {
    Image, Keyboard, KeyboardAvoidingView, Platform,
    Pressable, Text, TouchableWithoutFeedback, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import { styles } from './AuthScreen.styles';

export type AuthTab = 'login' | 'signup';

interface AuthScreenProps {
    initialTab?: AuthTab;
}

/**
 * Single auth screen. The logo + tab bar stay fixed; tapping a tab swaps only
 * the form body via local state (no navigation), so it reads as a tab switch
 * rather than a page change.
 */
export default function AuthScreen({ initialTab = 'login' }: AuthScreenProps) {
    const [tab, setTab] = useState<AuthTab>(initialTab);

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.kav}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.screen}>

                        {/* ── Header: logo + tabs (fixed) ── */}
                        <View style={styles.header}>
                            <Image source={require('@/assets/images/lam3y-logo.png')} style={styles.logo} />
                            <View style={styles.tabs}>
                                <Pressable
                                    style={styles.tab}
                                    onPress={() => setTab('login')}
                                    accessibilityRole="tab"
                                    accessibilityLabel="تسجيل الدخول"
                                    accessibilityState={{ selected: tab === 'login' }}
                                >
                                    <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>تسجيل الدخول</Text>
                                    <View style={[styles.tabUnderline, tab === 'login' && styles.tabUnderlineActive]} />
                                </Pressable>
                                <Pressable
                                    style={styles.tab}
                                    onPress={() => setTab('signup')}
                                    accessibilityRole="tab"
                                    accessibilityLabel="حساب جديد"
                                    accessibilityState={{ selected: tab === 'signup' }}
                                >
                                    <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>حساب جديد</Text>
                                    <View style={[styles.tabUnderline, tab === 'signup' && styles.tabUnderlineActive]} />
                                </Pressable>
                            </View>
                        </View>

                        {/* ── Form body (swaps) ── */}
                        {tab === 'login' ? <LoginForm /> : <SignUpForm />}

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
