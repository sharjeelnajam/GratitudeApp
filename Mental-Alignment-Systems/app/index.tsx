/**
 * Welcome Home Screen
 * 
 * Premium entry point featuring the geometry image with glassmorphism.
 * Unlocks entry to the alignment rooms.
 * Inspired by: https://gratitudekeeper.stillnessforpeace.com/
 */

import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';

const { width, height } = Dimensions.get('window');

const PARTICLE_COUNT = 14;
const RING_RADIUS = Math.min(width * 0.42, 165);
const PARTICLE_SIZE = 6;

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const orbitRotation = useRef(new Animated.Value(0)).current;
  const brandingOpacity = useRef(new Animated.Value(0)).current;
  const brandingTranslateY = useRef(new Animated.Value(30)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  // Start animations on mount
  useEffect(() => {
    // Stars fade in first
    Animated.timing(starsOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Logo animation sequence: scale + fade
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Branding slides up and fades in
    Animated.parallel([
      Animated.timing(brandingOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(brandingTranslateY, {
        toValue: 0,
        duration: 1000,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Welcome text slides up and fades in
    Animated.parallel([
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeTranslateY, {
        toValue: 0,
        duration: 1000,
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Button slides up and fades in
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 1400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 1000,
        delay: 1400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Continuous subtle rotation for logo (starts after initial animation)
  useEffect(() => {
    const timer = setTimeout(() => {
      const rotateAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(logoRotation, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(logoRotation, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: true,
          }),
        ])
      );
      rotateAnimation.start();
    }, 1500); // Start rotation after initial animation

    return () => clearTimeout(timer);
  }, []);

  // Revolving particle ring around logo (continuous orbit)
  useEffect(() => {
    const orbitAnimation = Animated.loop(
      Animated.timing(orbitRotation, {
        toValue: 1,
        duration: 18000,
        useNativeDriver: true,
      })
    );
    orbitAnimation.start();
    return () => orbitAnimation.stop();
  }, []);

  const logoRotationInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const orbitInterpolate = orbitRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Particle positions on the ring (circle)
  const particlePositions = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * 2 * Math.PI - Math.PI / 2; // start from top
    return {
      left: RING_RADIUS + RING_RADIUS * Math.cos(angle) - PARTICLE_SIZE / 2,
      top: RING_RADIUS + RING_RADIUS * Math.sin(angle) - PARTICLE_SIZE / 2,
    };
  });

  return (
    <LinearGradient
      colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']} // Deep purple-black gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Subtle starry background effect */}
      <Animated.View style={[styles.starsContainer, { opacity: starsOpacity }]}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
              },
            ]}
          />
        ))}
      </Animated.View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 48 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Sacred Geometry Image with Premium Glow */}
        <View style={styles.geometryContainer}>
          {/* Revolving particle ring around logo */}
          <View style={styles.particleRingWrapper} pointerEvents="none">
            <Animated.View
              style={[
                styles.particleRing,
                {
                  width: RING_RADIUS * 2 + PARTICLE_SIZE,
                  height: RING_RADIUS * 2 + PARTICLE_SIZE,
                  opacity: logoOpacity,
                  transform: [{ rotate: orbitInterpolate }],
                },
              ]}
            >
              {particlePositions.map((pos, i) => (
                <View
                  key={i}
                  style={[
                    styles.particle,
                    {
                      width: PARTICLE_SIZE,
                      height: PARTICLE_SIZE,
                      borderRadius: PARTICLE_SIZE / 2,
                      left: pos.left,
                      top: pos.top,
                    },
                  ]}
                />
              ))}
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.geometryInner,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotationInterpolate },
                ],
              },
            ]}
          >
            <View style={styles.geometryGlow} />
            <View style={styles.geometryFrame}>
              <Image
                source={require('../assets/images/geometry.jpeg')}
                style={styles.geometryImage}
                resizeMode="contain"
                onLoad={() => setImageLoaded(true)}
              />
              {imageLoaded && (
                <View style={styles.innerGlow} />
              )}
            </View>
          </Animated.View>
        </View>

        {/* App Branding */}
        <Animated.View
          style={[
            styles.brandingContainer,
            {
              opacity: brandingOpacity,
              transform: [{ translateY: brandingTranslateY }],
            },
          ]}
        >
          <Text variant="h1" style={styles.appTitle}>
            Gratitude Keeper
          </Text>
          <Text variant="body" style={styles.appSubtitle}>
            Your Mental Wellness Sanctuary
          </Text>
          <Text variant="caption" style={styles.appSubtext}>
            A safe space.
          </Text>
        </Animated.View>

        {/* Welcome Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: welcomeOpacity,
              transform: [{ translateY: welcomeTranslateY }],
            },
          ]}
        >
          <Text variant="h1" style={styles.welcomeText}>
            Welcome
          </Text>
          <Text variant="body" style={styles.subtitleText}>
            Tap below to begin your journey
          </Text>
        </Animated.View>

        {/* Premium Enter Button */}
        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/login')}
            activeOpacity={0.6}
            style={styles.buttonContainer}
          >
            <Text style={styles.enterButtonText}>Enter</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 48,
  },
  geometryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.min(48, height * 0.04),
    position: 'relative',
  },
  particleRingWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleRing: {
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(139, 92, 246, 0.85)',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  geometryInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  geometryGlow: {
    position: 'absolute',
    width: Math.min(width * 0.8, 350),
    height: Math.min(width * 0.8, 350),
    borderRadius: Math.min(width * 0.4, 175),
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  geometryFrame: {
    width: Math.min(width * 0.7, 300),
    height: Math.min(width * 0.7, 300),
    borderRadius: Math.min(width * 0.35, 150),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
    overflow: 'hidden',
  },
  geometryImage: {
    width: '90%',
    height: '90%',
    borderRadius: Math.min(width * 0.315, 135),
  },
  innerGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: Math.min(width * 0.35, 150),
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: Math.min(32, height * 0.03),
  },
  appTitle: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'serif',
    textShadowColor: 'rgba(139, 92, 246, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    marginBottom: 8,
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    fontWeight: '400',
  },
  appSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Math.min(48, height * 0.04),
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 3,
    textShadowColor: 'rgba(139, 92, 246, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    backgroundColor: 'transparent',
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  enterButtonText: {
    color: 'rgba(139, 92, 246, 0.9)',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
