/**
 * Rooms Layout
 * Wraps room screens with UserHeader.
 */

import { Stack } from 'expo-router';
import { UserHeader } from '@/shared/ui';

export default function RoomsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: UserHeader,
        headerShadowVisible: false,
        headerBackground: () => null,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[roomType]" />
    </Stack>
  );
}
