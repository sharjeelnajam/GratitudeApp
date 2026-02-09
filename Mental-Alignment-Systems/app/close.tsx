/**
 * Quiet Closing Screen
 * 
 * A gentle, reverent closing experience.
 * No pressure, no urgency - simply a quiet farewell.
 */

import { View, StyleSheet } from 'react-native';
import { AmbientBackground, Container, Text, FadeInView, Button } from '@/shared/ui';
import { useTheme } from '@/theme';
import { useRouter } from 'expo-router';

export default function QuietClosingScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <AmbientBackground variant="solid">
      <Container
        style={styles.container}
        padding="lg"
        backgroundColor="background"
      >
        <FadeInView duration={theme.motion.animations.fadeIn.duration} delay={200}>
          <View style={styles.content}>
            <Text variant="h2" style={styles.title}>
              Thank you
            </Text>
            <Text variant="contemplative" color="secondary" style={styles.message}>
              Take care
            </Text>

            <View style={styles.actions}>
              <Button
                variant="subtle"
                size="md"
                onPress={() => router.push('/')}
                style={styles.button}
              >
                Return Home
              </Button>
            </View>
            {/* TODO: Add gentle closing content */}
          </View>
        </FadeInView>
      </Container>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 48,
  },
  actions: {
    marginTop: 24,
    gap: 16,
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
