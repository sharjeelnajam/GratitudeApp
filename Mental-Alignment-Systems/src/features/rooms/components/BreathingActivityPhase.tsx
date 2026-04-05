/**
 * Premium Breathing & Hold Activity
 *
 * 32 seconds total: 8s Breathe In → 8s Hold → 8s Breathe Out → 8s Hold.
 * Looping breathing video, phase dots, room-theme aware hints.
 */

import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/shared/ui';
import { recordBreathingCompletionEvent } from '@/features/progress/storage';
import { typography } from '@/theme/typography';
import { BreathingVideoVisual } from './BreathingVideoVisual';

const { width } = Dimensions.get('window');
const VIDEO_SIZE = Math.min(width * 0.72, 280);
const PHASE_DURATION_MS = 8000;
const PHASES: { key: string }[] = [
  { key: 'in' },
  { key: 'hold1' },
  { key: 'out' },
  { key: 'hold2' },
];

const BREATH_COLORS = {
  dotActive: 'rgba(74, 222, 128, 0.95)',
  dotDone: 'rgba(74, 222, 128, 0.5)',
};

const HOLD_COLORS = {
  dotActive: 'rgba(139, 92, 246, 0.9)',
  dotDone: 'rgba(139, 92, 246, 0.5)',
};

interface BreathingActivityPhaseProps {
  onComplete: () => void;
}

export function BreathingActivityPhase({ onComplete }: BreathingActivityPhaseProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const pulseScale = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phase = PHASES[phaseIndex];
  const isLastPhase = phaseIndex >= PHASES.length - 1;
  const isBreathPhase = phase?.key === 'in' || phase?.key === 'out';
  const activityStateLabel = isBreathPhase ? 'Breathe' : 'Hold';

  useEffect(() => {
    const isBreathingIn = phase?.key === 'in';
    const isBreathingOut = phase?.key === 'out';
    const isHoldPhase = phase?.key === 'hold1' || phase?.key === 'hold2';

    if (isBreathingIn) {
      Animated.timing(pulseScale, {
        toValue: 1.08,
        duration: 7600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (isBreathingOut) {
      Animated.timing(pulseScale, {
        toValue: 0.92,
        duration: 7600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (isHoldPhase) {
      pulseScale.setValue(1);
    } else {
      pulseScale.setValue(1);
    }

    timerRef.current = setTimeout(() => {
      if (isLastPhase) {
        void recordBreathingCompletionEvent();
        onComplete();
        return;
      }
      setPhaseIndex((i) => i + 1);
    }, PHASE_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phaseIndex, onComplete, phase?.key, isLastPhase, pulseScale]);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.00)', 'rgba(0,0,0,0.00)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.videoArea}>
            <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
              <BreathingVideoVisual size={VIDEO_SIZE} />
            </Animated.View>
          </View>

          <View style={styles.phaseDots}>
            {PHASES.map((p, i) => {
              const isBreathDot = p.key === 'in' || p.key === 'out';
              const dotColors = isBreathDot ? BREATH_COLORS : HOLD_COLORS;
              return (
                <View
                  key={p.key}
                  style={[
                    styles.phaseDot,
                    i === phaseIndex && [styles.phaseDotActive, { backgroundColor: dotColors.dotActive }],
                    i < phaseIndex && [styles.phaseDotDone, { backgroundColor: dotColors.dotDone }],
                  ]}
                />
              );
            })}
          </View>
          <Text style={isBreathPhase ? styles.hint : styles.hintHold}>
            {activityStateLabel}
          </Text>
        </View>
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
    alignItems: 'center',
    width: '100%',
  },
  videoArea: {
    marginBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  phaseDotActive: {
    width: 24,
  },
  phaseDotDone: {},
  hint: {
    fontSize: 24,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: typography.fontFamily.serif.default,
  },
  /** Hold phases — bold, high-contrast cue */
  hintHold: {
    fontSize: 26,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.96)',
    letterSpacing: 2,
    fontFamily: typography.fontFamily.serif.default,
  },
});
