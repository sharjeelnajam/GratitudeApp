/**
 * PulseView Component
 * 
 * Fade in/out animation for continuous pulsing effect.
 * Used for geometry logo during audio playback.
 */

import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

export interface PulseViewProps {
  children: ReactNode;
  style?: ViewStyle;
  duration?: number;
  delay?: number;
  isActive?: boolean; // Control whether animation is active
}

export function PulseView({
  children,
  style,
  duration = 2000, // 2 seconds for fade in + fade out
  delay = 0,
  isActive = true,
}: PulseViewProps) {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isActive) {
      fadeAnim.setValue(1);
      return;
    }

    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: duration / 2,
      delay,
      useNativeDriver: true,
    });

    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: duration / 2,
      useNativeDriver: true,
    });

    const pulse = Animated.sequence([fadeIn, fadeOut]);
    const loop = Animated.loop(pulse);

    loop.start();

    return () => {
      loop.stop();
    };
  }, [isActive, duration, delay, fadeAnim]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
