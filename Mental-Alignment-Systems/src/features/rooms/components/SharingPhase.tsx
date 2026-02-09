/**
 * Sharing Phase
 * 
 * Optional, non-directive sharing.
 * One person speaks at a time.
 * No advice, no fixing, no responding.
 */

import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { AmbientBackground, Container, Text, FadeInView, Button, Card } from '@/shared/ui';
import { useTheme } from '@/theme';
import { SharingEntry } from '../types';

interface SharingPhaseProps {
  selectedCardContent: string;
  onShare: (content: string) => void;
  onSkip: () => void;
  onComplete: () => void;
  existingShares?: SharingEntry[];
}

export function SharingPhase({
  selectedCardContent,
  onShare,
  onSkip,
  onComplete,
  existingShares = [],
}: SharingPhaseProps) {
  const { theme } = useTheme();
  const [shareContent, setShareContent] = useState('');
  const [hasShared, setHasShared] = useState(false);

  const handleShare = () => {
    if (shareContent.trim()) {
      onShare(shareContent.trim());
      setHasShared(true);
      setShareContent('');
    }
  };

  return (
    <AmbientBackground variant="solid" roomTheme>
      <Container style={styles.container} padding="lg" backgroundColor="background">
        <FadeInView duration={theme.motion.animations.fadeIn.duration}>
          <View style={styles.content}>
            <Text variant="h3" style={styles.title}>
              Optional Sharing
            </Text>

            <Text variant="body" color="secondary" style={styles.description}>
              Share what you noticed—not what others should do.
            </Text>

            <Card variant="elevated" padding="md" style={styles.cardDisplay}>
              <Text variant="body" style={styles.cardText}>
                Your selected card:
              </Text>
              <Text variant="contemplative" color="secondary" style={styles.cardContent}>
                {selectedCardContent}
              </Text>
            </Card>

            {!hasShared ? (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.text.primary,
                    },
                  ]}
                  placeholder="What did you notice? (Optional)"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={shareContent}
                  onChangeText={setShareContent}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <View style={styles.actions}>
                  <Button
                    variant="primary"
                    size="md"
                    onPress={handleShare}
                    disabled={!shareContent.trim()}
                    style={styles.button}
                  >
                    Share
                  </Button>
                  <Button
                    variant="subtle"
                    size="md"
                    onPress={onSkip}
                    style={styles.button}
                  >
                    Skip
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Text variant="body" color="secondary" style={styles.sharedMessage}>
                  Thank you for sharing.
                </Text>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={onComplete}
                  style={styles.button}
                >
                  Continue
                </Button>
              </>
            )}

            {existingShares.length > 0 && (
              <View style={styles.sharesContainer}>
                <Text variant="h4" style={styles.sharesTitle}>
                  What Others Noticed
                </Text>
                <ScrollView style={styles.sharesList}>
                  {existingShares.map((share, index) => (
                    <Card key={index} variant="subtle" padding="md" style={styles.shareCard}>
                      <Text variant="caption" color="tertiary" style={styles.shareAuthor}>
                        {share.participantName}
                      </Text>
                      <Text variant="body" style={styles.shareContent}>
                        {share.content}
                      </Text>
                    </Card>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </FadeInView>
      </Container>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  cardDisplay: {
    marginBottom: 24,
  },
  cardText: {
    marginBottom: 8,
  },
  cardContent: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
  sharedMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  sharesContainer: {
    marginTop: 32,
    flex: 1,
  },
  sharesTitle: {
    marginBottom: 16,
  },
  sharesList: {
    flex: 1,
  },
  shareCard: {
    marginBottom: 12,
  },
  shareAuthor: {
    marginBottom: 8,
  },
  shareContent: {
    marginTop: 4,
  },
});
