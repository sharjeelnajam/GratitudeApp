/**
 * Closing Phase
 * 
 * User-controlled closing choice.
 * Inspirational Reading or Inspired Medicine Message.
 */

import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AmbientBackground, Container, Text, FadeInView, Button, Card } from '@/shared/ui';
import { useTheme } from '@/theme';
import { ClosingChoice } from '../types';

interface ClosingPhaseProps {
  onChoice: (choice: ClosingChoice) => void;
}

export function ClosingPhase({ onChoice }: ClosingPhaseProps) {
  const { theme } = useTheme();
  const [selectedChoice, setSelectedChoice] = useState<ClosingChoice | null>(null);

  const handleSelect = (choice: ClosingChoice) => {
    setSelectedChoice(choice);
    onChoice(choice);
  };

  return (
    <AmbientBackground variant="solid" roomTheme>
      <Container style={styles.container} padding="lg" backgroundColor="background">
        <FadeInView duration={theme.motion.animations.fadeIn.duration}>
          <View style={styles.content}>
            <Text variant="h3" style={styles.title}>
              Closing
            </Text>

            <Text variant="body" color="secondary" style={styles.description}>
              Choose how you'd like to close this session.
            </Text>

            <View style={styles.choices}>
              <Card
                variant={selectedChoice === ClosingChoice.INSPIRATIONAL_READING ? 'elevated' : 'default'}
                padding="lg"
                style={[
                  styles.choiceCard,
                  selectedChoice === ClosingChoice.INSPIRATIONAL_READING && styles.selectedCard,
                ]}
              >
                <Text variant="h4" style={styles.choiceTitle}>
                  Inspirational Reading
                </Text>
                <Text variant="body" color="secondary" style={styles.choiceDescription}>
                  A calm, grounding, reflective reading.
                </Text>
                <Button
                  variant={selectedChoice === ClosingChoice.INSPIRATIONAL_READING ? 'primary' : 'secondary'}
                  size="md"
                  onPress={() => handleSelect(ClosingChoice.INSPIRATIONAL_READING)}
                  style={styles.choiceButton}
                >
                  Choose This
                </Button>
              </Card>

              <Card
                variant={selectedChoice === ClosingChoice.INSPIRED_MEDICINE_MESSAGE ? 'elevated' : 'default'}
                padding="lg"
                style={[
                  styles.choiceCard,
                  selectedChoice === ClosingChoice.INSPIRED_MEDICINE_MESSAGE && styles.selectedCard,
                ]}
              >
                <Text variant="h4" style={styles.choiceTitle}>
                  Inspired Medicine Message™
                </Text>
                <Text variant="body" color="secondary" style={styles.choiceDescription}>
                  A voice-based message reinforcing alignment.
                </Text>
                <Button
                  variant={selectedChoice === ClosingChoice.INSPIRED_MEDICINE_MESSAGE ? 'primary' : 'secondary'}
                  size="md"
                  onPress={() => handleSelect(ClosingChoice.INSPIRED_MEDICINE_MESSAGE)}
                  style={styles.choiceButton}
                >
                  Choose This
                </Button>
              </Card>
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
  },
  content: {
    flex: 1,
    maxWidth: 500,
    width: '100%',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 48,
  },
  choices: {
    gap: 24,
  },
  choiceCard: {
    marginBottom: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  choiceTitle: {
    marginBottom: 8,
  },
  choiceDescription: {
    marginBottom: 16,
  },
  choiceButton: {
    width: '100%',
  },
});
