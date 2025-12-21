// app/index.jsx
import { Redirect } from 'expo-router';
import { useAuth } from './Context/AuthContext';
import { I18nManager } from "react-native";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// change to welcome

export default function Index() {
    const { user } = useAuth(); 

    return user ? <Redirect href="/(main)/MapPage" /> : <Redirect href="/(auth)/Login" />;
}