/**
 * Card Selection Phase
 * 
 * Individual, intentional card selection.
 * Cards are shuffled, one person selects at a time.
 */

import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AmbientBackground, Container, Text, FadeInView, Button, Card } from '@/shared/ui';
import { useTheme } from '@/theme';
import { ContentCard } from '@/services/content';
import { Participant } from '../types';

interface CardSelectionPhaseProps {
  cards: ContentCard[];
  participants: Participant[];
  currentShufflerIndex: number;
  onShuffle: () => void;
  onCardSelect: (cardId: string) => void;
  onComplete: () => void;
}

export function CardSelectionPhase({
  cards,
  participants,
  currentShufflerIndex,
  onShuffle,
  onCardSelect,
  onComplete,
}: CardSelectionPhaseProps) {
  const { theme } = useTheme();
  const [shuffledCards, setShuffledCards] = useState<ContentCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [shuffleInterval, setShuffleInterval] = useState<NodeJS.Timeout | null>(null);

  const currentParticipant = participants[currentShufflerIndex];
  const isYourTurn = currentParticipant?.id === 'participant-1'; // You are participant-1
  const allSelected = participants.every(p => p.hasSelectedCard);

  useEffect(() => {
    // Initial shuffle
    setShuffledCards([...cards].sort(() => Math.random() - 0.5));
  }, [cards]);

  const handleStartShuffle = () => {
    if (isShuffling) return;

    setIsShuffling(true);
    const interval = setInterval(() => {
      setShuffledCards([...cards].sort(() => Math.random() - 0.5));
    }, 100); // Fast shuffle animation

    setShuffleInterval(interval);
  };

  const handleStopShuffle = () => {
    if (shuffleInterval) {
      clearInterval(shuffleInterval);
      setShuffleInterval(null);
    }
    setIsShuffling(false);
  };

  const handleSelectCard = (cardId: string) => {
    if (isShuffling || !isYourTurn) return;
    handleStopShuffle();
    setSelectedCard(cardId);
    onCardSelect(cardId);
  };

  const handleContinue = () => {
    if (currentShufflerIndex < participants.length - 1) {
      onShuffle();
      setSelectedCard(null);
      setIsShuffling(false);
    } else {
      onComplete();
    }
  };

  return (
    <AmbientBackground variant="solid" roomTheme>
      <Container style={styles.container} padding="lg" backgroundColor="background">
        <FadeInView duration={theme.motion.animations.fadeIn.duration}>
          <View style={styles.content}>
            <Text variant="h3" style={styles.title}>
              Card Selection
            </Text>

            {!allSelected ? (
              <>
                <Text variant="body" color="secondary" style={styles.description}>
                  {isYourTurn
                    ? 'It\'s your turn to select a card. Press shuffle, then choose when ready.'
                    : `${currentParticipant?.name || 'Someone'} is selecting a card...`}
                </Text>

                <Text variant="caption" color="tertiary" style={styles.progress}>
                  {currentShufflerIndex + 1} of {participants.length} have selected
                </Text>

                {isYourTurn && (
                  <View style={styles.shuffleControls}>
                    {!isShuffling ? (
                      <Button
                        variant="primary"
                        size="lg"
                        onPress={handleStartShuffle}
                        style={styles.button}
                      >
                        Start Shuffle
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="lg"
                        onPress={handleStopShuffle}
                        style={styles.button}
                      >
                        Stop & Select
                      </Button>
                    )}
                  </View>
                )}

                <ScrollView
                  style={styles.cardsContainer}
                  contentContainerStyle={styles.cardsContent}
                >
                  {shuffledCards.map((card, index) => (
                    <Card
                      key={card.id}
                      variant="elevated"
                      padding="md"
                      style={[
                        styles.card,
                        selectedCard === card.id && styles.selectedCard,
                      ]}
                    >
                      <Text variant="body" style={styles.cardText}>
                        {card.content}
                      </Text>
                      {isYourTurn && !isShuffling && (
                        <Button
                          variant="subtle"
                          size="sm"
                          onPress={() => handleSelectCard(card.id)}
                          style={styles.selectButton}
                        >
                          Select
                        </Button>
                      )}
                    </Card>
                  ))}
                </ScrollView>

                {selectedCard && isYourTurn && (
                  <Button
                    variant="primary"
                    size="lg"
                    onPress={handleContinue}
                    style={styles.button}
                  >
                    Continue
                  </Button>
                )}
              </>
            ) : (
              <>
                <Text variant="body" color="secondary" style={styles.description}>
                  Everyone has selected a card.
                </Text>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={onComplete}
                  style={styles.button}
                >
                  Continue to Sharing
                </Button>
              </>
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
    marginBottom: 8,
  },
  progress: {
    textAlign: 'center',
    marginBottom: 24,
  },
  shuffleControls: {
    marginBottom: 24,
  },
  button: {
    width: '100%',
    marginTop: 16,
  },
  cardsContainer: {
    flex: 1,
    marginVertical: 24,
  },
  cardsContent: {
    gap: 16,
  },
  card: {
    marginBottom: 8,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  cardText: {
    marginBottom: 12,
  },
  selectButton: {
    marginTop: 8,
  },
});
