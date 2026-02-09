/**
 * Entering Room Transition
 *
 * Shows rotating logo when entering a specific room, then navigates to that room.
 * Used when user taps "Enter" on a room card.
 * Uses the same live video background as rooms (parallax by room type).
 */

import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/shared/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { LiveRoomVideoBackground } from '@/features/rooms/components/LiveRoomVideoBackground';
import { getRoomBackgroundVideoSource } from '@/features/rooms/roomBackgroundVideo';

const { width } = Dimensions.get('window');

const LOGO_SIZE = Math.min(width * 0.55, 220);
const TRANSITION_DURATION_MS = 2800;

const VALID_ROOMS = ['fireplace', 'ocean', 'forest', 'nightSky'] as const;

export default function EnteringRoomScreen() {
  const router = useRouter();
  const { room } = useLocalSearchParams<{ room?: string }>();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [logoOpacity]);

  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    );
    rotation.start();
    return () => rotation.stop();
  }, [logoRotation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const roomType = room && VALID_ROOMS.includes(room as (typeof VALID_ROOMS)[number])
        ? room
        : null;
      if (roomType) {
        router.replace(`/rooms/${roomType}`);
      } else {
        router.replace('/rooms');
      }
    }, TRANSITION_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router, room]);

  const rotateInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const roomType = room && VALID_ROOMS.includes(room as (typeof VALID_ROOMS)[number])
    ? (room as 'fireplace' | 'ocean' | 'forest' | 'nightSky')
    : 'fireplace';
  const videoSource = getRoomBackgroundVideoSource(roomType);

  return (
    <View style={styles.container}>
      <LiveRoomVideoBackground source={videoSource}>
        <LinearGradient
          colors={['rgba(30,27,46,0.82)', 'rgba(45,27,61,0.82)', 'rgba(59,47,77,0.82)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: logoOpacity,
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          <View style={styles.glow} />
          <View style={styles.frame}>
            <Image
              source={require('../assets/images/geometry.jpeg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
        <Text style={styles.subtitle}>Entering your space...</Text>
        </View>
      </LiveRoomVideoBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  glow: {
    position: 'absolute',
    width: LOGO_SIZE * 1.15,
    height: LOGO_SIZE * 1.15,
    borderRadius: LOGO_SIZE * 0.575,
    backgroundColor: 'rgba(139, 92, 246, 0.18)',
  },
  frame: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '88%',
    height: '88%',
    borderRadius: LOGO_SIZE / 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'serif',
    letterSpacing: 1,
  },
});
