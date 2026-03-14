/**
 * Fire Room 360° Panorama Background
 *
 * Real-app style: equirectangular image with correct horizontal range (360° = full
 * panorama width), smoothed gyro/accel response, and reduced sensitivity.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  AppState,
  AppStateStatus,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import Gyroscope from 'expo-sensors/build/Gyroscope';
import Accelerometer from 'expo-sensors/build/Accelerometer';
import type { ReactNode } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Equirectangular 2:1 = 360° horizontal; panorama width in pixels for one full rotation
const PANORAMA_ASPECT = 2;
const PANORAMA_HEIGHT = SCREEN_HEIGHT;
const PANORAMA_WIDTH = PANORAMA_HEIGHT * PANORAMA_ASPECT;
const VERTICAL_PADDING = 80;

const SENSOR_INTERVAL_MS = 25; // ~40 Hz is enough when smoothed
const SMOOTHING = 0.22; // lerp: lower = smoother, slower (0.08–0.30)
const GYRO_YAW_FACTOR = 1.8; // horizontal rotation speed
const GYRO_PITCH_FACTOR = 1.4; // vertical rotation speed
const PITCH_CLAMP_RAD = Math.PI / 2 - 0.5;
const PITCH_TO_PX = 90;
const ACCEL_TILT_SENSITIVITY = 150;

const FIRE_ROOM_IMAGE = require('../../../../assets/images/fireroom.png');

export interface FireRoomParallaxBackgroundProps {
  readonly children?: ReactNode;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function FireRoomParallaxBackground({ children }: FireRoomParallaxBackgroundProps) {
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const lastTime = useRef<number>(0);
  const yaw = useRef(Math.PI); // start at "center" of 360°
  const pitch = useRef(0);
  const smoothX = useRef(0);
  const smoothY = useRef(0);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);
  const useGyroRef = useRef<boolean | null>(null);

  // To show center of panorama: translateX must be (SCREEN_WIDTH - PANORAMA_WIDTH) / 2 (negative in portrait)
  const minTranslateX = SCREEN_WIDTH - PANORAMA_WIDTH;
  const centerTranslateX = minTranslateX / 2;

  const updateFromGyro = useCallback(
    (data: { x: number; y: number; z: number }) => {
      const now = Date.now() / 1000;
      const dt = lastTime.current > 0 ? Math.min(now - lastTime.current, 0.1) : 0;
      lastTime.current = now;

      yaw.current -= data.y * dt * GYRO_YAW_FACTOR;
      pitch.current += data.x * dt * GYRO_PITCH_FACTOR;
      pitch.current = clamp(pitch.current, -PITCH_CLAMP_RAD, PITCH_CLAMP_RAD);

      const twoPi = 2 * Math.PI;
      const effectiveYaw = ((yaw.current % twoPi) + twoPi) % twoPi;
      // 0° = left edge (translateX=0), 360° = right edge (translateX=minTranslateX), 180° = center
      const targetX = clamp(
        (effectiveYaw / twoPi) * minTranslateX,
        minTranslateX,
        0
      );
      const targetY = clamp(-pitch.current * PITCH_TO_PX, -120, 120);

      smoothX.current += (targetX - smoothX.current) * SMOOTHING;
      smoothY.current += (targetY - smoothY.current) * SMOOTHING;
      setTranslateX(smoothX.current);
      setTranslateY(smoothY.current);
    },
    []
  );

  const updateFromAccelerometer = useCallback(
    (data: { x: number; y: number; z: number }) => {
      const targetX = centerTranslateX + data.y * ACCEL_TILT_SENSITIVITY;
      const targetY = data.x * ACCEL_TILT_SENSITIVITY;
      smoothX.current += (clamp(targetX, minTranslateX, 0) - smoothX.current) * SMOOTHING;
      smoothY.current += (clamp(targetY, -120, 120) - smoothY.current) * SMOOTHING;
      setTranslateX(smoothX.current);
      setTranslateY(smoothY.current);
    },
    [centerTranslateX, minTranslateX]
  );

  const startSensor = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    if (useGyroRef.current === true) {
      Gyroscope.setUpdateInterval(SENSOR_INTERVAL_MS);
      subscriptionRef.current = Gyroscope.addListener(updateFromGyro);
    } else {
      Accelerometer.setUpdateInterval(SENSOR_INTERVAL_MS);
      subscriptionRef.current = Accelerometer.addListener(updateFromAccelerometer);
    }
  }, [updateFromGyro, updateFromAccelerometer]);

  useEffect(() => {
    let mounted = true;
    smoothX.current = centerTranslateX;
    smoothY.current = 0;
    setTranslateX(centerTranslateX);
    setTranslateY(0);

    (async () => {
      try {
        if (Platform.OS !== 'web') {
          const perm = await Gyroscope.requestPermissionsAsync?.();
          const granted = perm?.status === 'granted' || perm?.granted === true;
          const available = await Gyroscope.isAvailableAsync?.();
          if (mounted && available && granted) {
            useGyroRef.current = true;
            lastTime.current = 0;
            startSensor();
            return;
          }
        }
      } catch {
        // Permission or availability check failed; fall back to accelerometer below
      }
      if (mounted) {
        useGyroRef.current = false;
        const accelAvailable = await Accelerometer.isAvailableAsync?.();
        if (accelAvailable !== false) {
          startSensor();
        }
      }
    })();

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (subscriptionRef.current) {
          subscriptionRef.current.remove();
          subscriptionRef.current = null;
        }
      } else if (nextState === 'active') {
        lastTime.current = 0;
        startSensor();
      }
    };

    const appSub = AppState.addEventListener('change', handleAppState);

    return () => {
      mounted = false;
      appSub.remove();
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, [startSensor, centerTranslateX]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.panoramaWrap,
          {
            transform: [{ translateX }, { translateY }],
          },
        ]}
      >
        <Image
          source={FIRE_ROOM_IMAGE}
          style={styles.panorama}
          resizeMode="cover"
        />
      </View>
      {children ? (
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
  panoramaWrap: {
    position: 'absolute',
    left: 0,
    top: -VERTICAL_PADDING,
    width: PANORAMA_WIDTH,
    height: PANORAMA_HEIGHT + VERTICAL_PADDING * 2,
  },
  panorama: {
    width: PANORAMA_WIDTH,
    height: PANORAMA_HEIGHT + VERTICAL_PADDING * 2,
  },
});
