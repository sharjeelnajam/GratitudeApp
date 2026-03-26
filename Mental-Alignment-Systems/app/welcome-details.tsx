import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text } from '@/shared/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top + 10, 24), paddingBottom: Math.max(insets.bottom + 16, 24) },
        ]}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logoShell}>
            <Image source={require('../assets/images/geometry.jpeg')} style={styles.logo} resizeMode="cover" />
          </View>
          <Text style={styles.brandTitle}>Gratitude Keeper</Text>
        </View>

        <Text style={styles.screenTitle}>Your Mental Wellness Sanctuary</Text>
        <Text style={styles.screenSubtitle}>A safe space.</Text>

        <View style={styles.infoCard}>
          <Text style={styles.cardHeading}>Welcome my friend, we are so happy that you are here!</Text>
          <Text style={styles.cardBody}>
            You&apos;ve stepped into a sacred journey of calm, renewal, and self-discovery. We are here to guide each
            step with gratitude and emotional balance, helping you realign your thoughts and energy.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Image source={require('../assets/images/Blue.png')} style={styles.cardFlower} resizeMode="cover" />
          <Text style={styles.cardHeadingAlt}>This is Your Time</Text>
          <Text style={styles.cardBody}>
            Together, we will explore a transformative path that strengthens confidence, builds resilience, and
            supports lasting positive change.
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            activeOpacity={0.85}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.actionText}>Yes, I&apos;m Ready</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Text style={styles.actionText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 14,
  },
  logoShell: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3.5,
    borderColor: 'rgba(255, 176, 117, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 6,
  },
  logo: {
    width: 154,
    height: 154,
    borderRadius: 77,
  },
  brandTitle: {
    fontSize: 38,
    lineHeight: 44,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'serif',
    marginBottom: 6,
  },
  screenTitle: {
    fontSize: 22,
    color: '#A78BFA',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 26,
    color: '#C4B5FD',
    fontWeight: '700',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  infoCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardHeading: {
    fontSize: 24,
    lineHeight: 32,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardHeadingAlt: {
    fontSize: 36,
    lineHeight: 42,
    color: '#A78BFA',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  cardBody: {
    fontSize: 18,
    lineHeight: 28,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    fontWeight: '600',
  },
  cardFlower: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  actionsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  primaryAction: {
    backgroundColor: 'rgba(139, 92, 246, 0.24)',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  secondaryAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  actionText: {
    color: 'rgba(196, 181, 253, 0.96)',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
});
