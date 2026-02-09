/**
 * App-wide Constants
 * 
 * Configuration values used throughout the application.
 */

export const APP_CONFIG = {
  name: 'Gratitude Keeper',
  version: '1.0.0',
  bundleId: {
    ios: 'com.mentalalignmentsystems.gratitudekeeper',
    android: 'com.mentalalignmentsystems.gratitudekeeper',
  },
} as const;

export const STORAGE_KEYS = {
  onboardingCompleted: '@gratitude_keeper:onboarding_completed',
  userPreferences: '@gratitude_keeper:user_preferences',
  alignmentData: '@gratitude_keeper:alignment_data',
} as const;

export const ROUTES = {
  onboarding: '/onboarding',
  alignment: '/alignment',
  rooms: '/rooms',
  moments: '/moments',
} as const;
