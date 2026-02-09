/**
 * Live Room Video Background
 *
 * Full-screen looping video with device-motion parallax. Uses expo-video for
 * playback and expo-sensors (Gyroscope) to drive subtle X/Y translation via
 * Reanimated for 60 FPS. Smoothed and clamped for a premium live-wallpaper feel.
 *
 * Performance: Sensor updates throttled (~15 Hz), lerp smoothing, subscription
 * paused when app is in background to save battery.
 */

import { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
// Import Gyroscope directly to avoid loading expo-sensors barrel (which can fail to resolve Pedometer on some setups)
import Gyroscope from 'expo-sensors/build/Gyroscope';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { ReactNode } from 'react';

const SENSOR_INTERVAL_MS = 66; // ~15 Hz to limit JS work
const SMOOTHING = 0.12; // lerp factor: lower = smoother, slower response
const SENSITIVITY = 8; // scale raw gyro to pixels

export interface LiveRoomVideoBackgroundProps {
  /** Video source: require() of .mp4 or URI string */
  source: number | string;
  /** Max parallax offset in px (default 15). Clamped to ±maxOffset. */
  maxOffset?: number;
  /** Content rendered on top of the video (e.g. room UI). */
  children?: ReactNode;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function LiveRoomVideoBackground({
  source,
  maxOffset = 15,
  children,
}: LiveRoomVideoBackgroundProps) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const smoothX = useRef(0);
  const smoothY = useRef(0);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);

  const updateParallax = useCallback(
    (data: { x: number; y: number; z: number }) => {
      // Map gyro rotation rate to parallax: tilt device right (positive y) → content shifts left (negative X).
      const targetX = clamp(-data.y * SENSITIVITY, -maxOffset, maxOffset);
      const targetY = clamp(data.x * SENSITIVITY, -maxOffset, maxOffset);
      smoothX.current += (targetX - smoothX.current) * SMOOTHING;
      smoothY.current += (targetY - smoothY.current) * SMOOTHING;
      const x = clamp(smoothX.current, -maxOffset, maxOffset);
      const y = clamp(smoothY.current, -maxOffset, maxOffset);
      offsetX.value = withSpring(x, { damping: 20, stiffness: 150 });
      offsetY.value = withSpring(y, { damping: 20, stiffness: 150 });
    },
    [maxOffset, offsetX, offsetY]
  );

  useEffect(() => {
    Gyroscope.setUpdateInterval(SENSOR_INTERVAL_MS);
    const sub = Gyroscope.addListener(updateParallax);
    subscriptionRef.current = sub;

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        sub.remove();
        subscriptionRef.current = null;
      } else if (nextState === 'active') {
        const newSub = Gyroscope.addListener(updateParallax);
        subscriptionRef.current = newSub;
      }
    };
    const appSub = AppState.addEventListener('change', handleAppState);

    return () => {
      appSub.remove();
      sub.remove();
      subscriptionRef.current = null;
    };
  }, [updateParallax]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.videoWrap, animatedStyle]}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          fullscreenOptions={{ enable: false }}
          showsTimecodes={false}
          surfaceType="textureView"
        />
      </Animated.View>
      {children != null ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {children}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  videoWrap: {
    position: 'absolute',
    left: -25,
    top: -25,
    right: -25,
    bottom: -25,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
