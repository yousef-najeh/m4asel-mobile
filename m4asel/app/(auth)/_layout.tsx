import { Redirect, Stack } from "expo-router";
import { resolveRoleRedirect } from "@/src/constants/roleRedirectMap";
import { useAuth } from "@/src/context/AuthContext";

export default function AuthLayout() {
  const { user, loading, role } = useAuth();

  if (!loading && user) {
    return <Redirect href={resolveRoleRedirect(role)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Single auth route — AuthScreen swaps login/signup via tabs, not navigation. */}
      <Stack.Screen name="AuthPage" />
    </Stack>
  );
}
