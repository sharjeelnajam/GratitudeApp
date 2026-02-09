/**
 * Alignment Session Screen
 * 
 * A space for alignment work.
 * Presence-focused, no metrics or progress.
 */

import { View, StyleSheet, ScrollView } from 'react-native';
import { AmbientBackground, Container, Text, FadeInView, Button, Card } from '@/shared/ui';
import { useTheme } from '@/theme';
import { useRouter } from 'expo-router';

export default function AlignmentSessionScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <AmbientBackground variant="solid">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Container style={styles.container} padding="lg" backgroundColor="background">
          <FadeInView duration={theme.motion.animations.fadeIn.duration}>
            <View style={styles.content}>
              <Text variant="h2" style={styles.title}>
                Alignment Session
              </Text>
              
              <Text variant="contemplative" color="secondary" style={styles.description}>
                A space for presence and alignment
              </Text>

              <Card variant="elevated" padding="lg" style={styles.infoCard}>
                <Text variant="body" style={styles.infoText}>
                  This is a space for inner alignment and presence. Take your time, there's no rush.
                </Text>
              </Card>

              <View style={styles.actions}>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={() => router.push('/rooms/fireplace')}
                  style={styles.button}
                >
                  Visit a Room
                </Button>
                
                <Button
                  variant="subtle"
                  size="md"
                  onPress={() => router.back()}
                  style={styles.button}
                >
                  Back
                </Button>
              </View>

              {/* TODO: Add alignment session content */}
            </View>
          </FadeInView>
        </Container>
      </ScrollView>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    minHeight: '100%',
  },
  content: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
  },
  infoCard: {
    marginBottom: 32,
  },
  infoText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    gap: 16,
    marginTop: 24,
  },
  button: {
    width: '100%',
  },
});
