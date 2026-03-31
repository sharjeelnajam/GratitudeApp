import { useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/shared/ui';
import {
  type FocusMode,
  type DailyTimePreference,
  type EmotionalBaseline,
  saveOnboardingProfile,
} from '@/features/onboarding';
import { BreathingActivityPhase } from '@/features/rooms/components/BreathingActivityPhase';

type Step = 1 | 2 | 3 | 4 | 5;
const READY_GEOMETRY: ImageSourcePropType = require('../assets/images/geometry.jpeg');

const focusOptions: Array<{ value: FocusMode; label: string }> = [
  { value: 'stress_overwhelm', label: 'Stress & overwhelm' },
  { value: 'emotional_clarity', label: 'Emotional clarity' },
  { value: 'focus_productivity', label: 'Focus & productivity' },
  { value: 'sleep_restoration', label: 'Sleep & restoration' },
  { value: 'general_wellbeing', label: 'General wellbeing' },
];

const timeOptions: Array<{ value: DailyTimePreference; label: string }> = [
  { value: 'morning', label: 'Morning' },
  { value: 'midday', label: 'Midday' },
  { value: 'evening', label: 'Evening' },
  { value: 'flexible', label: 'Flexible' },
];

const baselineOptions: Array<{ value: EmotionalBaseline; label: string }> = [
  { value: 'calm', label: 'Calm' },
  { value: 'slightly_stressed', label: 'Slightly stressed' },
  { value: 'overwhelmed', label: 'Overwhelmed' },
  { value: 'emotionally_drained', label: 'Emotionally drained' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(1);
  const [focusMode, setFocusMode] = useState<FocusMode | null>(null);
  const [timePreference, setTimePreference] = useState<DailyTimePreference | null>(null);
  const [baseline, setBaseline] = useState<EmotionalBaseline | null>(null);
  const [saving, setSaving] = useState(false);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const readyRotation = useRef(new Animated.Value(0)).current;

  const readySpin = readyRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isReadyStep = step === 4;

  useMemo(() => {
    if (!isReadyStep) {
      return undefined;
    }
    const spin = Animated.loop(
      Animated.timing(readyRotation, {
        toValue: 1,
        duration: 22000,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => {
      readyRotation.setValue(0);
      spin.stop();
    };
  }, [isReadyStep, readyRotation]);

  const canContinue = useMemo(() => {
    if (step === 1) return !!focusMode;
    if (step === 2) return !!timePreference;
    if (step === 3) return !!baseline;
    if (step === 5) return activityCompleted;
    return true;
  }, [step, focusMode, timePreference, baseline, activityCompleted]);

  const handleNext = async () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
      return;
    }
    if (step === 4) {
      setStep(5);
      return;
    }

    // Final submit from step 5
    if (!focusMode || !timePreference || !baseline || saving) return;

    setSaving(true);
    try {
      await saveOnboardingProfile({
        focusMode,
        dailyTimePreference: timePreference,
        emotionalBaseline: baseline,
        createdAt: new Date().toISOString(),
      });
      router.replace('/');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((prev) => (prev - 1) as Step);
  };

  return (
    <LinearGradient
      colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(16, insets.top + 8),
            paddingBottom: Math.max(112, insets.bottom + 96),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepColumn}>
          <Text style={styles.progress}>Step {step} of 4</Text>

          {step === 1 ? (
            <>
            <Text style={styles.title}>SELECT AN AREA OF CONCERN</Text>
            {/* <Text style={styles.subtitle}>Select one area you want to prioritize first.</Text> */}
            <View style={styles.optionsWrap}>
              {focusOptions.map((option) => (
                <ChoiceButton
                  key={option.value}
                  label={option.label}
                  selected={focusMode === option.value}
                  onPress={() => setFocusMode(option.value)}
                />
              ))}
            </View>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Text style={styles.title}>Your Time Preference</Text>
            {/* <Text style={styles.subtitle}>When do you usually want your reset practice?</Text> */}
            <View style={styles.optionsWrap}>
              {timeOptions.map((option) => (
                <ChoiceButton
                  key={option.value}
                  label={option.label}
                  selected={timePreference === option.value}
                  onPress={() => setTimePreference(option.value)}
                />
              ))}
            </View>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Text style={styles.title}>Emotional Baseline</Text>
            <Text style={styles.subtitle}>How do you feel most days?</Text>
            <View style={styles.optionsWrap}>
              {baselineOptions.map((option) => (
                <ChoiceButton
                  key={option.value}
                  label={option.label}
                  selected={baseline === option.value}
                  onPress={() => setBaseline(option.value)}
                />
              ))}
            </View>
          </>
        ) : null}

          {step === 4 ? (
            <View style={styles.readyWrap}>
            <View style={styles.readyImageShell}>
              <Animated.Image
                source={READY_GEOMETRY}
                resizeMode="cover"
                style={[styles.readyImage, { transform: [{ rotate: readySpin }] }]}
              />
            </View>
            <Text style={styles.readyTitle}>Your Gratitude Reset is ready.</Text>
            <Text style={styles.readySubtitle}>
              A calmer rhythm has been prepared for you.
              {'\n'}
              Take one gentle breath, then begin Day 1.
            </Text>
            <View style={styles.readyMetaWrap}>
              <View style={styles.readyMetaPill}>
                <Text style={styles.readyMetaLabel}>Focus</Text>
                <Text style={styles.readyMetaValue}>
                  {focusOptions.find((o) => o.value === focusMode)?.label ?? '-'}
                </Text>
              </View>
              <View style={styles.readyMetaPill}>
                <Text style={styles.readyMetaLabel}>Time</Text>
                <Text style={styles.readyMetaValue}>
                  {timeOptions.find((o) => o.value === timePreference)?.label ?? '-'}
                </Text>
              </View>
              <View style={styles.readyMetaPill}>
                <Text style={styles.readyMetaLabel}>Baseline</Text>
                <Text style={styles.readyMetaValue}>
                  {baselineOptions.find((o) => o.value === baseline)?.label ?? '-'}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {step === 5 ? (
          <View style={styles.activityWrap}>
            <Text style={styles.activityTitle}>Breating Activity</Text>
            <View style={styles.activityCard}>
              <BreathingActivityPhase onComplete={() => setActivityCompleted(true)} />
            </View>
          </View>
        ) : null}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingTop: Math.max(12, insets.top * 0.08 + 10),
            paddingBottom: Math.max(20, insets.bottom + 14),
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
          <Text style={styles.backText}>{step === 1 ? 'Back' : 'Previous'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, (!canContinue || saving) && styles.nextButtonDisabled]}
          onPress={() => void handleNext()}
          disabled={!canContinue || saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.nextText}>
              {step === 4 ? 'Activity' : step === 5 ? 'Begin Day 1' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

interface ChoiceButtonProps {
  readonly label: string;
  readonly selected: boolean;
  readonly onPress: () => void;
}

function ChoiceButton({ label, selected, onPress }: ChoiceButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.choiceButton, selected && styles.choiceButtonSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={{ ...styles.choiceText, ...(selected ? styles.choiceTextSelected : {}) }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stepColumn: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  progress: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.62)',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: 0.2,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 23,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsWrap: {
    gap: 10,
    width: '100%',
  },
  choiceButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  choiceButtonSelected: {
    borderColor: 'rgba(167,139,250,0.9)',
    backgroundColor: 'rgba(139,92,246,0.24)',
  },
  choiceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  choiceTextSelected: {
    color: '#E9DDFF',
  },
  readyWrap: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.22)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingVertical: 24,
    paddingHorizontal: 18,
    overflow: 'hidden',
    alignItems: 'center',
  },
  readyImageShell: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(167,139,250,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: 'rgba(12,10,24,0.9)',
  },
  readyImage: {
    width: 122,
    height: 122,
    borderRadius: 61,
  },
  activityWrap: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginTop: 8,
  },
  activityTitle: {
    fontSize: 36,
    padding: 8,
    lineHeight: 32,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  activityCard: {
    height: 404,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 8,
    paddingBottom: 12,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  readyTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  readySubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 18,
  },
  readyMetaWrap: {
    gap: 10,
  },
  readyMetaPill: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readyMetaLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.62)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginRight: 10,
  },
  readyMetaValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1.3,
    minHeight: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.3,
    borderColor: 'rgba(167,139,250,0.55)',
    backgroundColor: 'rgba(139,92,246,0.72)',
  },
  nextButtonDisabled: {
    opacity: 0.45,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

