/**
 * Room Entry Note Phase
 *
 * Short welcoming note before calming cards.
 */

import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, FadeInView, Button } from '@/shared/ui';

interface RoomEntryNotePhaseProps {
  readonly onComplete: () => void;
}

export function RoomEntryNotePhase({ onComplete }: RoomEntryNotePhaseProps) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(0,0,0,0.40)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.40)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.container}>
        <FadeInView duration={500} style={styles.content}>
          <Text style={styles.title}>Thank you for coming to the room</Text>
          <Text style={styles.note}>
            We are grateful you shared this space with us. Before moving forward, take a quiet moment and ask
            yourself: did you enjoy the room experience, and what felt most meaningful for you? Notice what changed
            in your body, your breath, and your mind from when you entered until now.
            {'\n\n'}
            If any part of this session brought comfort, clarity, or even a small sense of relief, hold on to that
            feeling. You can carry this calm with you beyond this screen. In the next step, continue gently and stay
            connected to your inner balance, gratitude, and emotional strength.
          </Text>
          <Button variant="primary" size="lg" onPress={onComplete} style={styles.button}>
            Next
          </Button>
        </FadeInView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 460,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'serif',
    letterSpacing: 1.2,
    marginBottom: 18,
    textAlign: 'center',
  },
  note: {
    fontSize: 17,
    lineHeight: 29,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 34,
  },
  button: {
    width: '100%',
  },
});
