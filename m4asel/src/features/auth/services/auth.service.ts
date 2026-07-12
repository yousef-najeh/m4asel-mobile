import { AuthErrorCodes, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { apiClient } from "@/src/api/client";
import { endpoints } from "@/src/api/endpoints";
import { auth } from "@/src/config/firebase";

export interface RegisterPayload {
  name: string;
  email: string;
  mobile_number: string;
  password: string;
}

/** Arabic copy for the Firebase auth error codes surfaced on the login screen. */
export const authErrorMessages: Record<string, string> = {
  [AuthErrorCodes.USER_DELETED]: "لا يوجد حساب بهذا البريد الإلكتروني",
  [AuthErrorCodes.INVALID_PASSWORD]: "كلمة المرور غير صحيحة",
  [AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: "تم تجاوز عدد المحاولات، حاول لاحقاً",
};

export const authService = {
  signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),

  signOut: () => signOut(auth),

  /** Register the account on the backend, then sign in with Firebase. */
  async register(payload: RegisterPayload): Promise<void> {
    await apiClient.post(endpoints.users.register, payload, { authenticated: false });
    await signInWithEmailAndPassword(auth, payload.email, payload.password);
  },
};
