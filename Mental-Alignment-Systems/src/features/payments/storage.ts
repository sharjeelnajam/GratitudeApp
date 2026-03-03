import AsyncStorage from '@react-native-async-storage/async-storage';

const PAYMENT_ACCESS_KEY = 'payment:access-granted';

export async function getPaymentAccess(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(PAYMENT_ACCESS_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}

export async function setPaymentAccessGranted(): Promise<void> {
  try {
    await AsyncStorage.setItem(PAYMENT_ACCESS_KEY, 'true');
  } catch {
    // Swallow; payment gate will simply behave as unpaid if this fails
  }
}

