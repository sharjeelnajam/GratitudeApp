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
import { MaterialIcons } from '@expo/vector-icons';
import { Text, FadeInView } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { typography } from '@/theme/typography';

const { width, height } = Dimensions.get('window');
const CARD_PADDING_H = 20;
const BOTTOM_BAR_HEIGHT = 76;
const HEADER_HEIGHT = 100;
const CARD_MAX_WIDTH = Math.min(width - CARD_PADDING_H * 2, 380);

const REFLECTION_QUESTION_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const TOTAL = REFLECTION_QUESTION_IDS.length;

type CardGradient = readonly [string, string];

function ReflectionHeader(
  props: Readonly<{
    title: string;
    finishSentenceLine: string;
    currentIndex: number;
    questionIds: readonly string[];
  }>
) {
  const { title, finishSentenceLine, currentIndex, questionIds } = props;
  return (
    <View style={styles.header}>
      <Text style={styles.kicker}>Reflection</Text>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.headerSubtitle}>{finishSentenceLine}</Text>
      <View style={styles.progressRow}>
        <View style={styles.progressDots}>
          {questionIds.map((id, i) => (
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
  );
}

function ReflectionQuestionCard(
  props: Readonly<{
    cardGradient: CardGradient;
    hasAnswer: boolean;
    inputFocused: boolean;
    headerIcon: ComponentProps<typeof MaterialIcons>['name'];
    promptLabel: string;
    promptText: string;
    answer: string;
    onChangeAnswer: (text: string) => void;
    onFocusInput: () => void;
    onBlurInput: () => void;
  }>
) {
  const {
    cardGradient,
    hasAnswer,
    inputFocused,
    headerIcon,
    promptLabel,
    promptText,
    answer,
    onChangeAnswer,
    onFocusInput,
    onBlurInput,
  } = props;

  return (
    <View style={styles.questionCardOuter}>
      <LinearGradient
        colors={cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.questionCardGradient,
          hasAnswer && styles.questionCardGradientFilled,
          inputFocused && styles.questionCardGradientFocused,
        ]}
      >
        <View style={styles.reflectTopRow}>
          <View style={[styles.reflectIconBubble, hasAnswer && styles.reflectIconBubbleActive]}>
            <MaterialIcons
              name={hasAnswer ? 'check-circle' : headerIcon}
              size={18}
              color={hasAnswer ? '#f9a8d4' : '#c4b5fd'}
            />
          </View>
          <View style={[styles.reflectAccentDot, hasAnswer && styles.reflectAccentDotActive]} />
        </View>
        <Text style={styles.promptLabel}>{promptLabel}</Text>
        <Text style={styles.promptText}>{promptText}</Text>
        <TextInput
          style={[styles.input, (hasAnswer || inputFocused) && styles.inputActive]}
          placeholder="…"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={answer}
          onChangeText={onChangeAnswer}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          multiline
          maxLength={120}
          selectionColor="rgba(139, 92, 246, 0.6)"
          autoFocus={false}
        />
      </LinearGradient>
    </View>
  );
}

export default function QuestionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);

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

  const hasAnswer = useMemo(
    () => Boolean((answers[qId] ?? '').trim().length),
    [answers, qId]
  );

  const cardGradient = useMemo(() => {
    const pair = safeIndex % 2 === 0 ? (['#2a2540', '#120f1f'] as const) : (['#3d2f5c', '#1a1428'] as const);
    return pair;
  }, [safeIndex]);

  const headerIcon = useMemo((): ComponentProps<typeof MaterialIcons>['name'] => {
    const icons: ComponentProps<typeof MaterialIcons>['name'][] = [
      'favorite-outline',
      'light-mode',
      'spa',
      'self-improvement',
    ];
    return icons[safeIndex % icons.length] ?? 'auto-awesome';
  }, [safeIndex]);

  return (
    <View style={styles.opaqueBackground}>
      <LinearGradient
        colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']}
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
            <ReflectionHeader
              title={t('questions.title')}
              finishSentenceLine={`${t('questions.finishSentence')} · ${currentIndex + 1} / ${TOTAL}`}
              currentIndex={currentIndex}
              questionIds={REFLECTION_QUESTION_IDS}
            />
          </FadeInView>

          {/* Middle: single question card */}
          <View style={styles.cardWrapper}>
            <ReflectionQuestionCard
              cardGradient={cardGradient}
              hasAnswer={hasAnswer}
              inputFocused={inputFocused}
              headerIcon={headerIcon}
              promptLabel={t('questions.finishSentence')}
              promptText={t(`questions.prompts.${qId}`)}
              answer={answers[qId] ?? ''}
              onChangeAnswer={(text) => updateAnswer(qId, text)}
              onFocusInput={() => setInputFocused(true)}
              onBlurInput={() => setInputFocused(false)}
            />
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
            {isFirst ? null : (
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.88}
                style={[styles.footerBtnOuter, styles.footerBtnBack]}
              >
                <LinearGradient
                  colors={['#3d2f5c', '#1a1428']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.footerGradientSecondary}
                >
                  <MaterialIcons name="arrow-back" size={20} color="#c4b5fd" style={styles.footerBackIcon} />
                  <Text style={styles.footerBtnTextSecondary}>{t('common.back')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.88}
              style={[
                styles.footerBtnOuter,
                isFirst ? styles.footerBtnPrimaryFull : styles.footerBtnPrimary,
              ]}
            >
              <LinearGradient
                colors={['#1e4550', '#1e1830']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.footerGradientPrimary}
              >
                {isLast ? (
                  <MaterialIcons name="meeting-room" size={20} color="rgba(255,255,255,0.92)" style={styles.footerPrimaryIcon} />
                ) : (
                  <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.92)" style={styles.footerPrimaryIcon} />
                )}
                <Text
                  style={isLast ? styles.footerBtnTextPrimaryEmphasis : styles.footerBtnTextPrimary}
                  numberOfLines={2}
                >
                  {isLast ? t('questions.enterRooms') : t('common.next')}
                </Text>
              </LinearGradient>
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
    marginBottom: 16,
    minHeight: HEADER_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(186,230,253,0.55)',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.96)',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 8,
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(226,232,240,0.65)',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  progressRow: {
    alignItems: 'center',
    gap: 8,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 22,
    backgroundColor: 'rgba(244, 114, 182, 0.95)',
  },
  dotDone: {
    backgroundColor: 'rgba(139, 92, 246, 0.65)',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 180,
    maxHeight: height * 0.55,
  },
  questionCardOuter: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: CARD_MAX_WIDTH,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  questionCardGradient: {
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    minHeight: 220,
    justifyContent: 'flex-start',
  },
  questionCardGradientFilled: {
    borderColor: 'rgba(244, 114, 182, 0.38)',
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  questionCardGradientFocused: {
    borderColor: 'rgba(196, 181, 253, 0.45)',
  },
  reflectTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reflectIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reflectAccentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(196,181,253,0.6)',
  },
  reflectIconBubbleActive: {
    borderColor: 'rgba(249, 168, 212, 0.45)',
    backgroundColor: 'rgba(244, 114, 182, 0.2)',
  },
  reflectAccentDotActive: {
    backgroundColor: '#f472b6',
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
    fontFamily: typography.fontFamily.serif.default,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    minHeight: 56,
    textAlignVertical: 'top',
  },
  inputActive: {
    borderColor: 'rgba(244, 114, 182, 0.45)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    minHeight: BOTTOM_BAR_HEIGHT,
    paddingTop: 20,
    flexShrink: 0,
  },
  /** Match `home` inspiration + guide CTAs: radius 22, padding, shadows */
  footerBtnOuter: {
    borderRadius: 22,
    overflow: 'hidden',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  footerBtnBack: {
    flex: 1,
    minWidth: 0,
  },
  footerBtnPrimary: {
    flex: 1.25,
    minWidth: 0,
  },
  footerBtnPrimaryFull: {
    flex: 1,
    minWidth: 0,
  },
  footerGradientSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(196,181,253,0.35)',
    gap: 8,
    minHeight: 56,
  },
  footerGradientPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 10,
    minHeight: 56,
  },
  footerBackIcon: {
    marginRight: -2,
  },
  footerPrimaryIcon: {
    marginRight: -2,
  },
  footerBtnTextSecondary: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.94)',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  footerBtnTextPrimary: {
    fontSize: 15,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.94)',
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
    flexShrink: 1,
  },
  footerBtnTextPrimaryEmphasis: {
    fontSize: 15,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.96)',
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
    flexShrink: 1,
  },
});
