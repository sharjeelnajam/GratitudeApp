/**
 * PATH: ANXIOUS — Breathe Easy 4-4-8, grounding, integration (client spec).
 */

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import {
  ANXIOUS,
  getBreathTimingMultiplier,
  getBreathDurationsMs,
  BREATH_CYCLES,
  scheduleAnxiousExitReminder,
  VOICE_AUDIO_ANXIOUS,
  usePathVoicePlayer,
  stopDeviceSpeech,
} from '@/features/emotional-paths';
import { getOnboardingProfile } from '@/features/onboarding';
import { recordBreathingCompletionEvent } from '@/features/progress/storage';
import { BreathingVideoVisual } from '@/features/rooms/components/BreathingVideoVisual';

type Phase = 'intro' | 'breathe' | 'ground_blue' | 'ground_feet' | 'integrate';
type BreathSlice = 'inhale' | 'hold' | 'exhale';

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

const DARK_BG = ['#050810', '#0f1628', '#121a2e'] as const;
const SOFT_BG = ['#0A0714', '#1E1B2E', '#2D1B3D'] as const;

export default function AnxiousPathScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completedRef = useRef(false);
  const [phase, setPhase] = useState<Phase>('intro');
  const [cycleIndex, setCycleIndex] = useState(0);
  const [breathSlice, setBreathSlice] = useState<BreathSlice>('inhale');
  const [feetCount, setFeetCount] = useState(3);

  const pulseScale = useRef(new Animated.Value(0.92)).current;
  const holdPulse = useRef(new Animated.Value(1)).current;
  const { playClip, stop: stopVoice } = usePathVoicePlayer();

  useEffect(() => {
    return () => {
      if (!completedRef.current) {
        void scheduleAnxiousExitReminder();
      }
    };
  }, []);

  /** Part A — voice with intro copy (see `pathVoiceAudio.config.ts`) */
  useEffect(() => {
    if (phase !== 'intro') return;
    playClip(VOICE_AUDIO_ANXIOUS.intro);
    return () => stopVoice();
  }, [phase, playClip, stopVoice]);

  /** Part B — optional cue per inhale / hold / exhale */
  useEffect(() => {
    if (phase !== 'breathe') return;
    const src =
      breathSlice === 'inhale'
        ? VOICE_AUDIO_ANXIOUS.breatheInhale
        : breathSlice === 'hold'
          ? VOICE_AUDIO_ANXIOUS.breatheHold
          : VOICE_AUDIO_ANXIOUS.breatheExhale;
    playClip(src);
    return () => stopVoice();
  }, [phase, breathSlice, playClip, stopVoice]);

  useEffect(() => {
    if (phase !== 'ground_blue') return;
    playClip(VOICE_AUDIO_ANXIOUS.groundingBlue);
    return () => stopVoice();
  }, [phase, playClip, stopVoice]);

  useEffect(() => {
    if (phase !== 'ground_feet') return;
    playClip(VOICE_AUDIO_ANXIOUS.groundingFeet);
    return () => stopVoice();
  }, [phase, playClip, stopVoice]);

  useEffect(() => {
    if (phase !== 'integrate') return;
    playClip(VOICE_AUDIO_ANXIOUS.integration);
    return () => stopVoice();
  }, [phase, playClip, stopVoice]);

  useEffect(() => {
    if (phase !== 'breathe') return;
    let cancelled = false;

    void (async () => {
      const profile = await getOnboardingProfile();
      const mult = getBreathTimingMultiplier(profile?.emotionalBaseline ?? null);
      const { inhale, hold, exhale } = getBreathDurationsMs(mult);

      for (let c = 0; c < BREATH_CYCLES; c++) {
        if (cancelled) return;
        setCycleIndex(c);
        setBreathSlice('inhale');
        Animated.timing(pulseScale, {
          toValue: 1.1,
          duration: inhale,
          useNativeDriver: true,
        }).start();
        await sleep(inhale);
        if (cancelled) return;

        setBreathSlice('hold');
        const holdAnim = Animated.loop(
          Animated.sequence([
            Animated.timing(holdPulse, { toValue: 1.06, duration: 520, useNativeDriver: true }),
            Animated.timing(holdPulse, { toValue: 1, duration: 520, useNativeDriver: true }),
          ])
        );
        holdAnim.start();
        await sleep(hold);
        holdAnim.stop();
        holdPulse.setValue(1);
        if (cancelled) return;

        setBreathSlice('exhale');
        Animated.timing(pulseScale, {
          toValue: 0.92,
          duration: exhale,
          useNativeDriver: true,
        }).start();
        await sleep(exhale);
      }

      if (!cancelled) {
        void recordBreathingCompletionEvent();
        setPhase('ground_blue');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [phase, pulseScale, holdPulse]);

  useEffect(() => {
    if (phase !== 'ground_feet') return;
    setFeetCount(3);

    const haptic = () => {
      if (Platform.OS !== 'web') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };

    const t1 = setTimeout(() => {
      haptic();
      setFeetCount(2);
    }, 1000);
    const t2 = setTimeout(() => {
      haptic();
      setFeetCount(1);
    }, 2000);
    const t3 = setTimeout(() => {
      haptic();
      setPhase('integrate');
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  const startBreathe = () => setPhase('breathe');

  const breathGuide =
    breathSlice === 'inhale'
      ? ANXIOUS.breatheInhale
      : breathSlice === 'hold'
        ? ANXIOUS.breatheHold
        : ANXIOUS.breatheExhale;

  const breathLabel =
    breathSlice === 'inhale'
      ? ANXIOUS.breathePhaseInhale
      : breathSlice === 'hold'
        ? ANXIOUS.breathePhaseHold
        : ANXIOUS.breathePhaseExhale;

  const gradientColors = phase === 'integrate' ? SOFT_BG : DARK_BG;

  const finish = () => {
    completedRef.current = true;
    stopVoice();
    stopDeviceSpeech();
    router.replace('/(tabs)/home');
  };

  const goBack = () => {
    stopVoice();
    stopDeviceSpeech();
    router.back();
  };

  return (
    <LinearGradient colors={[...gradientColors]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 12,
            paddingBottom: 28 + insets.bottom,
            flexGrow: 1,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.back}
          onPress={goBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {phase === 'intro' ? (
          <View style={styles.block}>
            <Text style={styles.eyebrow}>{ANXIOUS.pathLabel}</Text>
            <Text style={styles.voice}>{ANXIOUS.introVoice}</Text>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.88} onPress={startBreathe}>
              <LinearGradient colors={['#1e4550', '#1a2038']} style={styles.primaryBtnInner}>
                <Text style={styles.primaryBtnText}>Begin breathing</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}

        {phase === 'breathe' ? (
          <View style={styles.breatheWrap}>
            <Text style={styles.eyebrowCenter}>{ANXIOUS.modalityTitle}</Text>
            <Text style={styles.subCenter}>{ANXIOUS.modalitySubtitle}</Text>
            <Text style={styles.cycleHint}>
              Cycle {cycleIndex + 1} of {BREATH_CYCLES}
            </Text>
            <View style={styles.pulseArea}>
              <Animated.View
                style={
                  breathSlice === 'hold'
                    ? { transform: [{ scale: holdPulse }] }
                    : undefined
                }
              >
                <Animated.View
                  style={{
                    transform: [{ scale: pulseScale }],
                    opacity: breathSlice === 'hold' ? 0.95 : 0.88,
                  }}
                >
                  <BreathingVideoVisual size={220} style={styles.breatheVideoBorder} />
                </Animated.View>
              </Animated.View>
            </View>
            <Text style={styles.phaseTag}>{breathLabel}</Text>
            <Text style={styles.guideLine}>{breathGuide}</Text>
          </View>
        ) : null}

        {phase === 'ground_blue' ? (
          <View style={styles.block}>
            <Text style={styles.voice}>{ANXIOUS.groundingIntro}</Text>
            <TouchableOpacity
              style={styles.tapCard}
              activeOpacity={0.85}
              onPress={() => setPhase('ground_feet')}
            >
              <Text style={styles.tapCardText}>Tap when you’ve found something blue</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {phase === 'ground_feet' ? (
          <View style={styles.block}>
            <Text style={styles.voice}>{ANXIOUS.groundingFeet}</Text>
            <View style={styles.countBubble}>
              <Text style={styles.countNum}>{feetCount}</Text>
              <Text style={styles.countCap}>seconds of contact</Text>
            </View>
          </View>
        ) : null}

        {phase === 'integrate' ? (
          <View style={styles.block}>
            <Text style={styles.eyebrow}>Integration</Text>
            <Text style={styles.voice}>{ANXIOUS.integration}</Text>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.88} onPress={finish}>
              <LinearGradient colors={['#1e4550', '#1e1830']} style={styles.primaryBtnInner}>
                <Text style={styles.primaryBtnText}>{ANXIOUS.continueCta}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 22 },
  back: { alignSelf: 'flex-start', marginBottom: 12, padding: 4 },
  block: { flex: 1 },
  breatheWrap: { alignItems: 'center', minHeight: 420 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(186,230,253,0.55)',
    marginBottom: 12,
  },
  eyebrowCenter: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(186,230,253,0.5)',
    textAlign: 'center',
    marginBottom: 6,
  },
  voice: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(241,245,249,0.9)',
    marginBottom: 22,
    letterSpacing: 0.2,
  },
  subCenter: {
    fontSize: 13,
    color: 'rgba(203,213,225,0.65)',
    textAlign: 'center',
    marginBottom: 8,
  },
  cycleHint: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.8)',
    marginBottom: 20,
  },
  pulseArea: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  breatheVideoBorder: {
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
  },
  phaseTag: {
    marginTop: 18,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(125,211,252,0.85)',
  },
  guideLine: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(226,232,240,0.88)',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  primaryBtn: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 8,
  },
  primaryBtnInner: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 0.3,
  },
  tapCard: {
    marginTop: 8,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.35)',
    alignItems: 'center',
  },
  tapCardText: {
    fontSize: 15,
    color: 'rgba(224,242,254,0.95)',
    fontWeight: '500',
    textAlign: 'center',
  },
  countBubble: {
    marginTop: 20,
    alignSelf: 'center',
    minWidth: 120,
    paddingVertical: 22,
    paddingHorizontal: 28,
    borderRadius: 20,
    backgroundColor: 'rgba(15,118,110,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.35)',
    alignItems: 'center',
  },
  countNum: {
    fontSize: 44,
    fontWeight: '300',
    color: 'rgba(240,253,250,0.95)',
  },
  countCap: {
    fontSize: 12,
    color: 'rgba(204,251,241,0.75)',
    marginTop: 6,
  },
});
