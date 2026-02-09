/**
 * Reflection Questions Screen
 *
 * One question at a time in an attractive card. User taps Next to advance.
 * No overlay; card and buttons fit on one screen; theme-matched.
 */

import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, FadeInView } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';

const { width, height } = Dimensions.get('window');
const CARD_PADDING_H = 20;
const CARD_MAX_WIDTH = Math.min(width - CARD_PADDING_H * 2, 380);
const BOTTOM_BAR_HEIGHT = 72;
const HEADER_HEIGHT = 100;

const REFLECTION_QUESTIONS = [
  { id: '1', prompt: 'I feel', placeholder: '…' },
  { id: '2', prompt: 'I am searching for', placeholder: '…' },
  { id: '3', prompt: 'I need', placeholder: '…' },
  { id: '4', prompt: 'How can I', placeholder: '…' },
  { id: '5', prompt: 'I want', placeholder: '…' },
  { id: '6', prompt: "I don't know", placeholder: '…' },
  { id: '7', prompt: 'What are you hoping for', placeholder: '…' },
  { id: '8', prompt: 'Do you know what you are feeling', placeholder: '…' },
];

const TOTAL = REFLECTION_QUESTIONS.length;

export default function QuestionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  // Clamp index to valid range so hot reload or edge cases never break rendering
  const safeIndex = Math.min(Math.max(currentIndex, 0), TOTAL - 1);
  const q = REFLECTION_QUESTIONS[safeIndex];
  const isFirst = safeIndex === 0;
  const isLast = safeIndex === TOTAL - 1;

  const updateAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const animateOut = (direction: 'next' | 'prev') => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: direction === 'next' ? 0.96 : 1.04,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const nextIndex = direction === 'next'
        ? Math.min(currentIndex + 1, TOTAL - 1)
        : Math.max(currentIndex - 1, 0);
      setCurrentIndex(nextIndex);
      // Reset opacity after React renders new content (fixes second question not showing on first open)
      setTimeout(() => {
        cardOpacity.setValue(1);
        cardScale.setValue(1);
      }, 0);
    });
  };

  const handleNext = () => {
    if (isLast) {
      router.push('/rooms');
      return;
    }
    animateOut('next');
  };

  const handleBack = () => {
    if (!isFirst) animateOut('prev');
  };

  return (
    <View style={styles.opaqueBackground}>
      <LinearGradient
        colors={['#1E1B2E', '#2D1B3D', '#3B2F4D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : 0}
        >
          {/* Top: header + progress */}
          <FadeInView duration={500} delay={80}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>Check in with yourself</Text>
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>
                  {currentIndex + 1} of {TOTAL}
                </Text>
                <View style={styles.progressDots}>
                  {REFLECTION_QUESTIONS.map((_, i) => (
                    <View
                      key={`dot-${REFLECTION_QUESTIONS[i].id}`}
                      style={[
                        styles.dot,
                        i === currentIndex && styles.dotActive,
                        i < currentIndex && styles.dotDone,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </FadeInView>

          {/* Middle: single question card */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardOpacity,
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            <View style={styles.questionCard}>
              <View style={styles.cardAccent} />
              <View style={styles.cardInner}>
                <Text style={styles.promptLabel}>Finish the sentence</Text>
                <Text style={styles.promptText}>{q.prompt}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={q.placeholder}
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={answers[q.id] ?? ''}
                  onChangeText={(text) => updateAnswer(q.id, text)}
                  multiline
                  maxLength={120}
                  selectionColor="rgba(139, 92, 246, 0.6)"
                  autoFocus={false}
                />
              </View>
            </View>
          </Animated.View>

          {/* Bottom: button bar with safe area */}
          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            {isFirst ? (
              <View style={styles.backPlaceholder} />
            ) : (
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.7}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>
                {isLast ? 'Continue to Rooms' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  opaqueBackground: {
    flex: 1,
    backgroundColor: '#1E1B2E',
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: CARD_PADDING_H,
    paddingTop: 20,
    paddingBottom: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    minHeight: HEADER_HEIGHT,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  progressRow: {
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.5,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dotActive: {
    width: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.95)',
  },
  dotDone: {
    backgroundColor: 'rgba(139, 92, 246, 0.55)',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 180,
    maxHeight: height * 0.55,
  },
  questionCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: CARD_MAX_WIDTH,
    borderRadius: 20,
    padding: 24,
    paddingBottom: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(167, 139, 250, 0.85)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardInner: {
    marginTop: 8,
  },
  promptLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(167, 139, 250, 0.95)',
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.98)',
    fontFamily: 'serif',
    lineHeight: 28,
    marginBottom: 16,
  },
  input: {
    fontSize: 17,
    fontWeight: '300',
    color: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    minHeight: 52,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: BOTTOM_BAR_HEIGHT,
    paddingTop: 20,
  },
  backPlaceholder: {
    flex: 1,
    minWidth: 0,
  },
  backButton: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  nextButton: {
    flex: 1,
    minWidth: 0,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.55)',
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
