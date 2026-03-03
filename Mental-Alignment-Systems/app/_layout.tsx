/**
 * Root Layout - Minimal Bootstrap
 * Opens directly to login; no intro screen.
 */

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { UserHeader } from '@/shared/ui';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    // Add custom fonts here when needed
  });

  useEffect(() => {
    const go = fontsLoaded || fontError;
    if (go) {
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#0A0714').catch(() => {});
      NavigationBar.setButtonStyleAsync('light').catch(() => {});
    }
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: 'transparent' },
            }}
            initialRouteName="index"
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="payment"
              options={{ contentStyle: { backgroundColor: '#0A0714' } }}
            />
            <Stack.Screen
              name="login"
              options={{ contentStyle: { backgroundColor: '#0A0714' } }}
            />
            <Stack.Screen
              name="signup"
              options={{ contentStyle: { backgroundColor: '#0A0714' } }}
            />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="intro" />
            <Stack.Screen
              name="questions"
              options={{
                headerShown: true,
                header: UserHeader,
                headerShadowVisible: false,
                headerBackground: () => null,
                contentStyle: { backgroundColor: '#1E1B2E' },
              }}
            />
            <Stack.Screen
              name="entering-room"
              options={{
                headerShown: true,
                header: UserHeader,
                headerShadowVisible: false,
                headerBackground: () => null,
                contentStyle: { backgroundColor: '#1E1B2E' },
              }}
            />
            <Stack.Screen
              name="live-room"
              options={{
                headerShown: true,
                header: UserHeader,
                headerShadowVisible: false,
                headerBackground: () => null,
                contentStyle: { backgroundColor: '#1E1B2E' },
              }}
            />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
