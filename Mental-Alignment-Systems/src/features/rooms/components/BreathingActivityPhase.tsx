/**
 * Premium Breathing & Hold Activity
 *
 * 32 seconds total: 8s Breathe In → 8s Hold → 8s Breathe Out → 8s Hold.
 * Circular progress, premium design, room-theme aware.
 */

import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/shared/ui';

const { width } = Dimensions.get('window');
const SEGMENTS = 48;
const RADIUS = Math.min(width * 0.38, 140);
const STROKE_WIDTH = 5;
const PHASE_DURATION_MS = 8000;
const PHASES: { label: string; key: string }[] = [
  { label: 'Breathe In', key: 'in' },
  { label: 'Hold', key: 'hold1' },
  { label: 'Breathe Out', key: 'out' },
  { label: 'Hold', key: 'hold2' },
];

const BREATH_COLORS = {
  segment: 'rgba(74, 222, 128, 0.95)',     // green-400
  centerDot: 'rgba(74, 222, 128, 0.4)',
  centerBorder: 'rgba(74, 222, 128, 0.6)',
  dotActive: 'rgba(74, 222, 128, 0.95)',
  dotDone: 'rgba(74, 222, 128, 0.5)',
};

const HOLD_COLORS = {
  segment: 'rgba(167, 139, 250, 0.95)',    // purple (as is)
  centerDot: 'rgba(139, 92, 246, 0.4)',
  centerBorder: 'rgba(139, 92, 246, 0.5)',
  dotActive: 'rgba(139, 92, 246, 0.9)',
  dotDone: 'rgba(139, 92, 246, 0.5)',
};

interface BreathingActivityPhaseProps {
  onComplete: () => void;
}

export function BreathingActivityPhase({ onComplete }: BreathingActivityPhaseProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const phase = PHASES[phaseIndex];
  const isLastPhase = phaseIndex >= PHASES.length - 1;
  const isBreathPhase = phase?.key === 'in' || phase?.key === 'out';
  const colors = isBreathPhase ? BREATH_COLORS : HOLD_COLORS;

  useEffect(() => {
    progress.setValue(0);
    const isBreathingIn = phase?.key === 'in';
    const isBreathingOut = phase?.key === 'out';

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
    } else {
      pulseScale.setValue(1);
    }

    progressAnimRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: PHASE_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    progressAnimRef.current.start();

    timerRef.current = setTimeout(() => {
      if (isLastPhase) {
        onComplete();
        return;
      }
      setPhaseIndex((i) => i + 1);
    }, PHASE_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      progressAnimRef.current?.stop();
    };
  }, [phaseIndex, onComplete]);

  const segmentViews = Array.from({ length: SEGMENTS }, (_, i) => {
    const angle = (i / SEGMENTS) * 360;
    const opacity = progress.interpolate({
      inputRange: [Math.max(0, (i - 1) / SEGMENTS), (i + 2) / SEGMENTS],
      outputRange: [0.2, 1],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View
        key={`seg-${i}`}
        style={[
          styles.segment,
          {
            width: STROKE_WIDTH,
            height: RADIUS,
            left: RADIUS - STROKE_WIDTH / 2,
            top: 0,
            opacity,
            backgroundColor: colors.segment,
            transform: [
              { translateY: RADIUS / 2 },
              { rotate: `${angle}deg` },
              { translateY: -RADIUS / 2 },
            ],
          },
        ]}
      />
    );
  });

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(30,27,46,0.82)', 'rgba(45,27,61,0.82)', 'rgba(59,47,77,0.82)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.phaseLabel}>{phase?.label}</Text>

          <View style={styles.ringContainer}>
            {/* Track ring */}
            <View style={[styles.trackRing, { width: RADIUS * 2 + STROKE_WIDTH * 2, height: RADIUS * 2 + STROKE_WIDTH * 2, borderRadius: RADIUS + STROKE_WIDTH }]} />
            {/* Segments for progress */}
            <View style={[styles.segmentsWrap, { width: RADIUS * 2, height: RADIUS * 2 }]}>
              {segmentViews}
            </View>
            {/* Center glow / pulse */}
            <Animated.View
              style={[
                styles.centerDot,
                {
                  width: RADIUS * 0.35,
                  height: RADIUS * 0.35,
                  borderRadius: RADIUS * 0.175,
                  backgroundColor: colors.centerDot,
                  borderColor: colors.centerBorder,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            />
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
          <Text style={styles.hint}>
            {phase?.key === 'in' && 'Fill your lungs slowly'}
            {phase?.key === 'out' && 'Release gently'}
            {(phase?.key === 'hold1' || phase?.key === 'hold2') && 'Hold with ease'}
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
  phaseLabel: {
    fontSize: 26,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'serif',
    letterSpacing: 1.5,
    marginBottom: 40,
  },
  ringContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  trackRing: {
    position: 'absolute',
    borderWidth: STROKE_WIDTH,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  segmentsWrap: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    position: 'absolute',
    backgroundColor: 'rgba(167, 139, 250, 0.95)',
    borderRadius: STROKE_WIDTH / 2,
  },
  centerDot: {
    position: 'absolute',
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
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
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
  },
  phaseDotDone: {
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
  },
  hint: {
    fontSize: 14,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'serif',
  },
});
