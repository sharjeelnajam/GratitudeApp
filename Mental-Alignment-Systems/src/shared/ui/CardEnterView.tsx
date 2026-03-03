/**
 * CardEnterView Component
 *
 * Gentle card-style enter (and optional exit) animation for room cards.
 * Uses theme motion tokens for consistent, calm in/out behaviour.
 */

import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

const STAGGER_MS = 60;
const SLIDE_OFFSET = 12;
const SCALE_INIT = 0.98;

export interface CardEnterViewProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Stagger index for list items (delay = index * STAGGER_MS) */
  staggerIndex?: number;
  /** Override enter duration (default: theme cardEnter) */
  duration?: number;
  /** Extra delay before starting enter */
  delay?: number;
  /** When true, run exit animation then call onExitComplete */
  exit?: boolean;
  onExitComplete?: () => void;
}

export function CardEnterView({
  children,
  style,
  staggerIndex = 0,
  duration,
  delay = 0,
  exit = false,
  onExitComplete,
}: CardEnterViewProps) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(exit ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(exit ? 0 : SLIDE_OFFSET)).current;
  const scale = useRef(new Animated.Value(exit ? 1 : SCALE_INIT)).current;

  const durationMs = duration ?? theme.motion.animations.cardEnter.duration;
  const enterDelay = delay + staggerIndex * STAGGER_MS;

  useEffect(() => {
    if (exit) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: durationMs * 0.7,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -SLIDE_OFFSET,
          duration: durationMs * 0.7,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.98,
          duration: durationMs * 0.7,
          useNativeDriver: true,
        }),
      ]).start(() => onExitComplete?.());
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durationMs,
        delay: enterDelay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: durationMs,
        delay: enterDelay,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: durationMs,
        delay: enterDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [exit, durationMs, enterDelay, opacity, translateY, scale, onExitComplete]);

  return (
    <Animated.View
      style={[
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
