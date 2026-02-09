/**
 * Root Layout - Minimal Bootstrap
 * 
 * This file handles:
 * - Font loading
 * - Theme initialization
 * - Navigation mounting
 * 
 * No business logic should be here.
 */

import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { UserHeader } from '@/shared/ui';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Add custom fonts here when needed
    // Example: 'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#0A0714').catch(() => {});
      NavigationBar.setButtonStyleAsync('light').catch(() => {});
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade', // Gentle fade transitions
          contentStyle: {
            backgroundColor: 'transparent', // Let screens handle their own backgrounds
          },
        }}
        initialRouteName="index"
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="login"
          options={{
            contentStyle: { backgroundColor: '#0A0714' },
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            contentStyle: { backgroundColor: '#0A0714' },
          }}
        />
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
  );
}
