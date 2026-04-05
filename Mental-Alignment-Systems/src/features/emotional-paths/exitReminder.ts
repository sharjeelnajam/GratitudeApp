import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { ANXIOUS } from './copy';

let handlerConfigured = false;

/**
 * If user leaves the Anxious path before completion, gentle reminder in 10 minutes.
 *
 * Skips entirely in **Expo Go** — loading `expo-notifications` there triggers SDK 53+
 * push-token warnings/errors. Use a development/production build for local notifications.
 */
export async function scheduleAnxiousExitReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return;

  try {
    const Notifications = await import('expo-notifications');

    if (!handlerConfigured) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: Platform.OS === 'android',
          shouldSetBadge: false,
        }),
      });
      handlerConfigured = true;
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Gratitude Keeper',
        body: ANXIOUS.exitNotificationBody,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 600,
        repeats: false,
      },
    });
  } catch {
    /* optional — Expo Go / permissions */
  }
}
