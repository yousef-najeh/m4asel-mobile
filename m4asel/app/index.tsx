import { Redirect } from "expo-router";
import { I18nManager } from "react-native";
import { resolveRoleRedirect } from "@/src/constants/roleRedirectMap";
import { useAuth } from "@/src/context/AuthContext";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function Index() {
    const { user, role, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Redirect href="/(auth)/Login" />;

    return <Redirect href={resolveRoleRedirect(role)} />;
}
