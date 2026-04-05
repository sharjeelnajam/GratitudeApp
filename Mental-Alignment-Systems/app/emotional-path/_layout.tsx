import { Stack } from 'expo-router';

export default function EmotionalPathLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#06040f' },
      }}
    />
  );
}
