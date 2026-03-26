import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text } from '@/shared/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 28),
          },
        ]}
      >
        <View style={styles.logoShell}>
          <Image source={require('../assets/images/geometry.jpeg')} style={styles.logo} resizeMode="cover" />
        </View>

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Tap below to begin your journey</Text>

        <TouchableOpacity style={styles.enterButton} activeOpacity={0.85} onPress={() => router.push('/welcome-details')}>
          <Text style={styles.enterText}>Enter</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    alignItems: 'center',
    transform: [{ translateY: -20 }],
  },
  logoShell: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 4,
    borderColor: 'rgba(255, 176, 117, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 6,
  },
  logo: {
    width: 210,
    height: 210,
    borderRadius: 105,
  },
  title: {
    fontSize: 42,
    color: '#FFFFFF',
    fontWeight: '600',
    padding: 24,
    marginBottom: 12,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    marginBottom: 32,
  },
  enterButton: {
    minWidth: 170,
    minHeight: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 26,
    backgroundColor: 'rgba(139, 92, 246, 0.24)',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  enterText: {
    color: 'rgba(196, 181, 253, 0.95)',
    fontSize: 26,
    fontWeight: '700',
  },
});
