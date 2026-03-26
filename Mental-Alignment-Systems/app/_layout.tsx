/**
 * Root Layout - Minimal Bootstrap
 * Opens directly to login; no intro screen.
 */

import '../src/i18n';
import { Fragment, useEffect, useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { LanguageProvider } from '@/shared/contexts/LanguageContext';
import { UserHeader } from '@/shared/ui';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { RoomInviteDeepLink } from '@/features/rooms/components/RoomInviteDeepLink';

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
    const t = setTimeout(() => {
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setPositionAsync('absolute').catch(() => {});
      NavigationBar.setBackgroundColorAsync('transparent').catch(() => {});
      NavigationBar.setButtonStyleAsync('light').catch(() => {});
    }
  }, []);

  if (!ready) {
    return <View style={styles.bootPlaceholder} />;
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <Fragment>
            <RoomInviteDeepLink />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: '#0A0714' },
              }}
              initialRouteName="index"
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="payment" />
              <Stack.Screen name="welcome" />
              <Stack.Screen name="welcome-details" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="forgot-password" />
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
          </Fragment>
        </ThemeProvider>
      </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  bootPlaceholder: {
    flex: 1,
    backgroundColor: '#0A0714',
  },
});
