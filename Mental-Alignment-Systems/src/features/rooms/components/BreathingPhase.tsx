/**
 * Deep Focused Breathing Phase
 * 
 * Short, intentional breathing sequence.
 * Grounding, centering, settling.
 */

import { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, FadeInView, Button } from '@/shared/ui';
import { useTheme } from '@/theme';

interface BreathingPhaseProps {
  duration?: number; // Duration in seconds (default: 60)
  onComplete: () => void;
}

export function BreathingPhase({ duration = 60, onComplete }: BreathingPhaseProps) {
  const { theme } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // Cycle through breathing phases based on remaining time
        const cycle = newTime % 6;
        if (cycle >= 4) {
          setPhase('inhale');
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 2000,
            useNativeDriver: true,
          }).start();
        } else if (cycle >= 2) {
          setPhase('hold');
        } else {
          setPhase('exhale');
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }).start();
        }

        if (newTime <= 0) {
          setIsBreathing(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, scaleAnim]);

  const handleStart = () => {
    setIsBreathing(true);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(30,27,46,0.82)', 'rgba(45,27,61,0.82)', 'rgba(59,47,77,0.82)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.container}>
        <FadeInView duration={theme.motion.animations.fadeIn.duration}>
          <View style={styles.content}>
            <Text variant="h3" style={styles.title}>
              Deep Focused Breathing
            </Text>

            {!isBreathing ? (
              <>
                <Text variant="body" color="secondary" style={styles.description}>
                  A short, intentional breathing sequence to bring you into a shared physiological state.
                </Text>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={handleStart}
                  style={styles.button}
                >
                  Begin Breathing
                </Button>
              </>
            ) : (
              <>
                <View style={styles.breathingCircle}>
                  <Animated.View
                    style={[
                      styles.circle,
                      {
                        transform: [{ scale: scaleAnim }],
                      },
                    ]}
                  />
                </View>

                <Text variant="h2" style={styles.phaseText}>
                  {phase === 'inhale' && 'Breathe In'}
                  {phase === 'hold' && 'Hold'}
                  {phase === 'exhale' && 'Breathe Out'}
                </Text>

                <Text variant="body" color="tertiary" style={styles.timer}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </Text>

                {timeRemaining === 0 && (
                  <Button
                    variant="primary"
                    size="lg"
                    onPress={handleComplete}
                    style={styles.button}
                  >
                    Continue
                  </Button>
                )}
              </>
            )}
          </View>
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
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 48,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 48,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    opacity: 0.6,
  },
  phaseText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  timer: {
    marginTop: 16,
    fontSize: 18,
  },
  button: {
    width: '100%',
    marginTop: 32,
  },
});
