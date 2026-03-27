// app/index.jsx
import { Redirect } from 'expo-router';
import { useAuth } from './Context/AuthContext';
import { I18nManager } from "react-native";
import { UserRole } from '../constants/UserRole';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const roleRedirectMap = {
    [UserRole.WASHER_OWNER]: "/(main)/Bookings",
    [UserRole.WASHER_WORKER]: "/(main)/Bookings",
    [UserRole.CONFIRMED_USER]: "/(main)/MapPage",
    [UserRole.UNCONFIRMED_USER]: "/(main)/MapPage",
};

export default function Index() {
    const { user, role, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Redirect href="/(auth)/Login" />;

    return <Redirect href={roleRedirectMap[role] || "/(main)/ProfilePage"} />;
}