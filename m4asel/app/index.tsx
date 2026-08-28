import { Redirect } from "expo-router";
import { resolveRoleRedirect } from "@/src/constants/roleRedirectMap";
import { useAuth } from "@/src/context/AuthContext";

export default function Index() {
    const { user, role, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Redirect href="/(auth)/AuthPage" />;

    return <Redirect href={resolveRoleRedirect(role)} />;
}
