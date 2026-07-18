// Firebase initialization (auth only) with AsyncStorage-backed session persistence.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// getReactNativePersistence exists at runtime but is not in firebase/auth's
// published type exports (RN-only API), so import it with a type suppression.
// @ts-expect-error - missing from firebase/auth type declarations
import { getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCH-t6Ykli9Aew_bqtmzlz3q4P7PA5Q-Q",
  authDomain: "m4asel-d94d0.firebaseapp.com",
  projectId: "m4asel-d94d0",
  storageBucket: "m4asel-d94d0.firebasestorage.app",
  messagingSenderId: "1095895610631",
  appId: "1:1095895610631:web:6187a8a639b29561a5c1a2",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
