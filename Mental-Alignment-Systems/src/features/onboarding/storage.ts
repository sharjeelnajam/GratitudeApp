import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/config/constants';

const ONBOARDING_PROFILE_KEY = '@gratitude_keeper:onboarding_profile';

export type FocusMode =
  | 'stress_overwhelm'
  | 'emotional_clarity'
  | 'focus_productivity'
  | 'sleep_restoration'
  | 'general_wellbeing';

export type DailyTimePreference = 'morning' | 'midday' | 'evening' | 'flexible';

export type EmotionalBaseline =
  | 'calm'
  | 'slightly_stressed'
  | 'overwhelmed'
  | 'emotionally_drained';

export interface OnboardingProfile {
  focusMode: FocusMode;
  dailyTimePreference: DailyTimePreference;
  emotionalBaseline: EmotionalBaseline;
  createdAt: string;
}

export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.onboardingCompleted);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function saveOnboardingProfile(profile: OnboardingProfile): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_PROFILE_KEY, JSON.stringify(profile));
  await AsyncStorage.setItem(STORAGE_KEYS.onboardingCompleted, 'true');
}

export async function getOnboardingProfile(): Promise<OnboardingProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDING_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingProfile;
  } catch {
    return null;
  }
}

