/**
 * FadeInView Component
 * 
 * Gentle fade-in animation.
 * Slow, subtle, contemplative entrance.
 */

import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface FadeInViewProps {
  children: ReactNode;
  style?: ViewStyle;
  duration?: number;
  delay?: number;
  fadeIn?: boolean; // Allow disabling animation
}

export function FadeInView({
  children,
  style,
  duration,
  delay = 0,
  fadeIn = true,
}: FadeInViewProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(fadeIn ? 0 : 1)).current;

  useEffect(() => {
    if (!fadeIn) {
      fadeAnim.setValue(1);
      return;
    }

    const animationDuration = duration || theme.motion.animations.fadeIn.duration;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animationDuration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [fadeIn, duration, delay, fadeAnim, theme]);

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
