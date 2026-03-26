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
  Keyboard,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, FadeInView } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');
const CARD_PADDING_H = 20;
const BOTTOM_GAP = 12;
const BOTTOM_BAR_HEIGHT = 72;
const HEADER_HEIGHT = 100;
const CARD_MAX_WIDTH = Math.min(width - CARD_PADDING_H * 2, 380);
/** Each bottom button gets exactly half the row so both stay visible on all screens */
const BOTTOM_BUTTON_WIDTH = Math.floor((width - CARD_PADDING_H * 2 - BOTTOM_GAP) / 2);

const REFLECTION_QUESTION_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const TOTAL = REFLECTION_QUESTION_IDS.length;

export default function QuestionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const safeIndex = Math.min(Math.max(currentIndex, 0), TOTAL - 1);
  const qId = REFLECTION_QUESTION_IDS[safeIndex] ?? '1';
  const isFirst = safeIndex === 0;
  const isLast = safeIndex === TOTAL - 1;

  const updateAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      router.push('/rooms');
      return;
    }
    setCurrentIndex((i) => Math.min(i + 1, TOTAL - 1));
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentIndex((i) => Math.max(i - 1, 0));
    }
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const keyboardLift = Math.max(0, keyboardHeight - insets.bottom);

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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : 0}
        >
          {/* Top: header + progress */}
          <FadeInView duration={500} delay={80}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>{t('questions.title')}</Text>
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>
                  {currentIndex + 1} of {TOTAL}
                </Text>
                <View style={styles.progressDots}>
                  {REFLECTION_QUESTION_IDS.map((id, i) => (
                    <View
                      key={`dot-${id}`}
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
          <View style={styles.cardWrapper}>
            <View style={styles.questionCard}>
              <View style={styles.cardAccent} />
              <View style={styles.cardInner}>
                <Text style={styles.promptLabel}>{t('questions.finishSentence')}</Text>
                <Text style={styles.promptText}>{t(`questions.prompts.${qId}`)}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="…"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={answers[qId] ?? ''}
                  onChangeText={(text) => updateAnswer(qId, text)}
                  multiline
                  maxLength={120}
                  selectionColor="rgba(139, 92, 246, 0.6)"
                  autoFocus={false}
                />
              </View>
            </View>
          </View>

          {/* Bottom: Back + Next / Enter Rooms – fixed widths so both always visible */}
          <View
            style={[
              styles.bottomBar,
              {
                paddingBottom: keyboardVisible ? 12 : Math.max(insets.bottom, 24),
                marginBottom: keyboardVisible ? keyboardLift : 0,
              },
            ]}
          >
            {isFirst ? (
              <View style={[styles.backPlaceholder, { width: BOTTOM_BUTTON_WIDTH }]} />
            ) : (
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={[styles.backButton, { width: BOTTOM_BUTTON_WIDTH }]}
              >
                <Text style={styles.backButtonText}>{t('common.back')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.85}
              style={[
                styles.nextButton,
                { width: BOTTOM_BUTTON_WIDTH },
                isLast && styles.enterRoomsButton,
              ]}
            >
              <Text
                style={[styles.nextButtonText, isLast && styles.enterRoomsButtonText]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {isLast ? t('questions.enterRooms') : t('common.next')}
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
    borderRadius: 24,
    padding: 28,
    paddingBottom: 28,
    backgroundColor: 'rgba(45, 35, 65, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.35)',
    overflow: 'hidden',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(167, 139, 250, 0.6)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardInner: {
    marginTop: 4,
  },
  promptLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(196, 181, 253, 0.95)',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'serif',
    lineHeight: 30,
    marginBottom: 18,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(30, 27, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    minHeight: 52,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: BOTTOM_GAP,
    minHeight: BOTTOM_BAR_HEIGHT,
    paddingTop: 20,
    flexShrink: 0,
  },
  backPlaceholder: {
    minHeight: 52,
  },
  backButton: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  nextButton: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.6)',
    backgroundColor: 'rgba(139, 92, 246, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  enterRoomsButton: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.6)',
    paddingVertical: 15,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
  },
  enterRoomsButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
