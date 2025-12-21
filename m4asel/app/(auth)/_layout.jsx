// app/(auth)/_layout.jsx   ← this runs BEFORE any auth screen opens
import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useAuth } from "../Context/AuthContext";   // adjust path if needed

export default function AuthLayout() {
  const { user, loading } = useAuth();

  // If already logged in → kick them out instantly
  if (!loading && user) {
    return <Redirect href="/(main)/MapPage" />;
  }

  // If not logged in → show normal login/signup screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
      <Stack.Screen name="SignUp" />
      {/* add more auth screens here later */}
    </Stack>
  );
}