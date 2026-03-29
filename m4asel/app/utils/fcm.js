import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Request notification permissions and return the Expo push token.
 * Returns null if on a simulator or permissions are denied.
 */
export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return null;
    }

    const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
        console.log('Project ID not found');
        return null;
    }

    const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return pushTokenString;
}

/**
 * Register the push token with the backend (call on login).
 */
export async function registerFcmToken(firebaseUser) {
    try {
        const pushToken = await registerForPushNotificationsAsync();
        if (!pushToken) return;

        const idToken = await firebaseUser.getIdToken();
        await fetch(`${apiUrl}/users/fcm-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: pushToken }),
        });
    } catch (error) {
        console.error('Failed to register FCM token:', error);
    }
}

/**
 * Remove the push token from the backend (call on logout).
 */
export async function deleteFcmToken(firebaseUser) {
    try {
        const pushToken = await registerForPushNotificationsAsync();
        if (!pushToken) return;

        const idToken = await firebaseUser.getIdToken();
        await fetch(`${apiUrl}/users/fcm-token`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: pushToken }),
        });
    } catch (error) {
        console.error('Failed to delete FCM token:', error);
    }
}
