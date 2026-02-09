/**
 * Arrival & Stillness Phase
 * 
 * Silent entry into the room.
 * Visual settling, soft ambient guidance.
 */

import { View, StyleSheet } from 'react-native';
import { AmbientBackground, Container, Text, FadeInView, Button } from '@/shared/ui';
import { useTheme } from '@/theme';

interface ArrivalPhaseProps {
  roomName: string;
  roomType?: string;
  onComplete: () => void;
}

// Motivational messages for each room
const roomMessages: Record<string, { message: string; breatheEasy: boolean }> = {
  fireplace: {
    message: "I must remind myself each day to think positively and Breathe Easy in spite of trials and disappointments.",
    breatheEasy: true,
  },
  ocean: {
    message: "A good attitude, self-respect, positive thoughts and confidence determine your success—tune into your inner core.",
    breatheEasy: true,
  },
  forest: {
    message: "I reject the spirit of discontent, financial lack and greed. I declare and accept freedom, happiness and abundance in all areas of my life.",
    breatheEasy: false,
  },
  nightSky: {
    message: "Family is awesome, friends are charming. You are the key that brings joy—You are amazing! Breathe Easy.",
    breatheEasy: true,
  },
  // Add lowercase alias for nightSky
  nightsky: {
    message: "Family is awesome, friends are charming. You are the key that brings joy—You are amazing! Breathe Easy.",
    breatheEasy: true,
  },
};

export function ArrivalPhase({ roomName, roomType, onComplete }: ArrivalPhaseProps) {
  const { theme } = useTheme();
  // Normalize roomType for lookup - handle both camelCase and lowercase
  const normalizedRoomType = roomType?.toLowerCase() || '';
  const motivationalMessage = roomType 
    ? (roomMessages[normalizedRoomType] || roomMessages[roomType] || null)
    : null;

  return (
    <AmbientBackground variant="solid" roomTheme>
      <Container style={styles.container} padding="lg" backgroundColor="background">
        <FadeInView duration={theme.motion.animations.fadeIn.duration} delay={300}>
          <View style={styles.content}>
            <Text variant="h2" style={styles.title}>
              {roomName}
            </Text>
            
            <View style={styles.guidance}>
              <Text variant="contemplative" color="secondary" style={styles.guidanceText}>
                Arrive
              </Text>
              <Text variant="contemplative" color="secondary" style={styles.guidanceText}>
                Breathe
              </Text>
              <Text variant="contemplative" color="secondary" style={styles.guidanceText}>
                Be present
              </Text>
            </View>

            <Text variant="body" color="tertiary" style={styles.subtitle}>
              Take a moment to settle into this space
            </Text>

            {/* Motivational Message */}
            {motivationalMessage && (
              <View style={styles.motivationalContainer}>
                <Text style={styles.motivationalText}>
                  {motivationalMessage.message}
                </Text>
                {motivationalMessage.breatheEasy && (
                  <Text style={styles.breatheEasyText}>Breathe Easy</Text>
                )}
              </View>
            )}

            <View style={styles.continueWrap}>
              <Button variant="primary" onPress={onComplete} size="lg">
                Continue
              </Button>
            </View>
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
    marginBottom: 48,
    textAlign: 'center',
  },
  guidance: {
    marginBottom: 48,
    alignItems: 'center',
    gap: 16,
  },
  guidanceText: {
    fontSize: 24,
    letterSpacing: 2,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 32,
  },
  motivationalContainer: {
    marginTop: 48,
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    maxWidth: 500,
    alignItems: 'center',
  },
  motivationalText: {
    fontSize: 16,
    lineHeight: 26,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: '300',
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  breatheEasyText: {
    fontSize: 20,
    color: 'rgba(139, 92, 246, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '300',
    letterSpacing: 1.2,
    marginTop: 4,
  },
  continueWrap: {
    marginTop: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});
