
import { Redirect,Stack } from "expo-router";
import { useAuth } from "../Context/AuthContext";   // adjust path if needed
import {UserRole} from '../../constants/UserRole';

const roleRedirectMap = {
  [UserRole.WASHER_OWNER]: "/(main)/Bookings",
  [UserRole.WASHER_WORKER]: "/(main)/Bookings",
  [UserRole.CONFIRMED_USER]: "/(main)/MapPage",
  [UserRole.UNCONFIRMED_USER]: "/(main)/MapPage",
};

export default function AuthLayout() {
  const { user, loading,role } = useAuth();
  if (!loading && user) {
    return <Redirect href={roleRedirectMap[role] || "/(main)/ProfilePage"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
      <Stack.Screen name="SignUp" />
    </Stack>
  );
}