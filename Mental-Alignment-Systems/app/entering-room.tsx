/**
 * Entering Room Transition
 *
 * Shows rotating logo when entering a specific room, then navigates to that room.
 * Used when user taps "Enter" on a room card.
 * Background: door-opening-room.mp4 (play once, holds last frame; replays on each enter).
 */

import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/shared/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useCallback } from 'react';
import { DoorOpeningVideoBackground } from '@/features/rooms/components/DoorOpeningVideoBackground';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const LOGO_SIZE = Math.min(width * 0.55, 220);

const VALID_ROOMS = ['fireplace', 'ocean', 'forest', 'nightSky'] as const;

export default function EnteringRoomScreen() {
  const { t } = useTranslation();
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

  const navigatedRef = useRef(false);

  const handleDoorFullyOpen = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;

    const roomType = room && VALID_ROOMS.includes(room as (typeof VALID_ROOMS)[number])
      ? room
      : null;

    // Small delay after door is fully open so the user sees it
    setTimeout(() => {
      if (roomType) {
        router.replace(`/rooms/${roomType}`);
      } else {
        router.replace('/rooms');
      }
    }, 600);
  }, [router, room]);

  const rotateInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <DoorOpeningVideoBackground onDoorFullyOpen={handleDoorFullyOpen}>
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
        <Text style={styles.subtitle}>{t('rooms.enteringSpace')}</Text>
        </View>
      </DoorOpeningVideoBackground>
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
