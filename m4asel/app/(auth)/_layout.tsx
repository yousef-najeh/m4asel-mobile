import { Redirect, Stack } from "expo-router";
import { resolveRoleRedirect } from "@/src/constants/roleRedirectMap";
import { useAuth } from "@/src/features/auth";

export default function AuthLayout() {
  const { user, loading, role } = useAuth();

  if (!loading && user) {
    return <Redirect href={resolveRoleRedirect(role)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
      <Stack.Screen name="SignUp" />
    </Stack>
  );
}
