/**
 * Intention Setting Phase
 * 
 * Private intention setting.
 * Each participant sets an intention privately.
 */

import { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { AmbientBackground, Container, Text, FadeInView, Button } from '@/shared/ui';
import { useTheme } from '@/theme';

interface IntentionSettingPhaseProps {
  onComplete: (intention: string) => void;
}

export function IntentionSettingPhase({ onComplete }: IntentionSettingPhaseProps) {
  const { theme } = useTheme();
  const [intention, setIntention] = useState('');

  const handleContinue = () => {
    if (intention.trim()) {
      onComplete(intention.trim());
    }
  };

  return (
    <AmbientBackground variant="solid" roomTheme>
      <Container style={styles.container} padding="lg" backgroundColor="background">
        <FadeInView duration={theme.motion.animations.fadeIn.duration}>
          <View style={styles.content}>
            <Text variant="h3" style={styles.title}>
              Set Your Intention
            </Text>

            <Text variant="body" color="secondary" style={styles.description}>
              Set an intention for how you wish to be aligned in this moment.
            </Text>

            <Text variant="caption" color="tertiary" style={styles.note}>
              This is private—only you will see it.
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary,
                },
              ]}
              placeholder="e.g., Be present with gratitude"
              placeholderTextColor={theme.colors.text.tertiary}
              value={intention}
              onChangeText={setIntention}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Button
              variant="primary"
              size="lg"
              onPress={handleContinue}
              disabled={!intention.trim()}
              style={styles.button}
            >
              Continue
            </Button>
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
    marginBottom: 8,
  },
  note: {
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 32,
  },
  button: {
    width: '100%',
  },
});
