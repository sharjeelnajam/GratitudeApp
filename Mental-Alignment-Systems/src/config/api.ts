/**
 * API & Backend Configuration
 * Guided Alignment Room backend URL and Socket.IO endpoint.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Use EXPO_PUBLIC_API_URL for client-side, or fallback for dev
const getApiUrl = (): string => {
  const env = process.env.EXPO_PUBLIC_API_URL ?? Constants.expoConfig?.extra?.apiUrl;
  if (env) return env.replace(/\/$/, '');
  // Development
  if (__DEV__) {
    // Physical device (Expo Go via QR): use dev machine IP from bundler hostUri (e.g. exp://192.168.1.100:8081)
    try {
      const hostUri = Constants.expoConfig?.hostUri;
      if (hostUri) {
        const host = new URL(hostUri).hostname;
        if (host && host !== 'localhost' && !host.startsWith('127.')) {
          return `http://${host}:4000`;
        }
      }
    } catch { /* ignore */ }
    // Emulator/simulator
    return Platform.OS === 'android'
      ? 'http://10.0.2.2:4000'
      : 'http://localhost:4000';
  }
  return 'https://api.example.com'; // Replace with production URL
};

export const API_URL = getApiUrl();
