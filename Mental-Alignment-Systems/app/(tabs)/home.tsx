/**
 * Home Tab
 *
 * Main landing screen after login. Premium entry with geometry image.
 * Enter → intro (begin journey).
 */

import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/shared/ui';
import { useFocusEffect, useRouter } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from '@/shared/contexts';
import { getLast7DayProgress, type Last7DayProgress } from '@/features/progress/storage';

const { width } = Dimensions.get('window');

const PARTICLE_COUNT = 10;
const RING_RADIUS = Math.min(width * 0.26, 110);
const PARTICLE_SIZE = 6;

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuthContext();
  const insets = useSafeAreaInsets();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [last7Progress, setLast7Progress] = useState<Last7DayProgress>({
    logins: 0,
    breathing: 0,
    activeDays: 0,
  });

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const orbitRotation = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(20)).current;
  const primaryOpacity = useRef(new Animated.Value(0)).current;
  const primaryTranslateY = useRef(new Animated.Value(20)).current;
  const tilesOpacity = useRef(new Animated.Value(0)).current;
  const tilesTranslateY = useRef(new Animated.Value(20)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslateY = useRef(new Animated.Value(20)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(starsOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 700, delay: 200, useNativeDriver: true }),
        Animated.timing(headerTranslateY, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(primaryOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(primaryTranslateY, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(tilesOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(tilesTranslateY, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(bottomOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(bottomTranslateY, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const rotateAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(logoRotation, { toValue: 1, duration: 12000, useNativeDriver: true }),
          Animated.timing(logoRotation, { toValue: 0, duration: 12000, useNativeDriver: true }),
        ])
      );
      rotateAnimation.start();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const orbitAnimation = Animated.loop(
      Animated.timing(orbitRotation, { toValue: 1, duration: 18000, useNativeDriver: true })
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

  const particlePositions = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * 2 * Math.PI - Math.PI / 2;
    return {
      left: RING_RADIUS + RING_RADIUS * Math.cos(angle) - PARTICLE_SIZE / 2,
      top: RING_RADIUS + RING_RADIUS * Math.sin(angle) - PARTICLE_SIZE / 2,
    };
  });

  const userName =
    user?.name?.trim() || user?.email?.split('@')[0]?.trim() || 'Friend';
  const currentHour = new Date().getHours();
  let greetingTime = 'Good evening';
  if (currentHour < 12) {
    greetingTime = 'Good morning';
  } else if (currentHour < 18) {
    greetingTime = 'Good afternoon';
  }

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        const stats = await getLast7DayProgress();
        if (active) {
          setLast7Progress(stats);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <LinearGradient
      colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.starsContainer, { opacity: starsOpacity }]}>
        {Array.from({ length: 20 }, (_, i) => (
          <View
            key={`star-${i}`}
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
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: 20 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View
          style={[
            styles.headerRow,
            { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <View>
            <Text style={styles.greetingLabel}>{greetingTime},</Text>
            <Text style={styles.greetingName}>{userName}</Text>
          </View>
          <View style={styles.moodPill}>
            <View style={styles.moodDot} />
            <Text style={styles.moodText}>Calm focus</Text>
          </View>
        </Animated.View>

        <View style={styles.geometryContainer}>
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
              {particlePositions.map((pos) => (
                <View
                  key={`particle-${pos.left}-${pos.top}`}
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
                transform: [{ scale: logoScale }, { rotate: logoRotationInterpolate }],
              },
            ]}
          >
            <View style={styles.geometryGlow} />
            <View style={styles.geometryFrame}>
              <Image
                source={require('../../assets/images/appIcon.png')}
                style={styles.geometryImage}
                resizeMode="contain"
                onLoad={() => setImageLoaded(true)}
              />
              {imageLoaded && <View style={styles.innerGlow} />}
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.primaryCard,
            { opacity: primaryOpacity, transform: [{ translateY: primaryTranslateY }] },
          ]}
        >
          <Text style={styles.primaryLabel}>Primary focus</Text>
          <Text style={styles.primaryTitle}>Start Today’s Reset</Text>
          <Text style={styles.primaryCopy}>
            A short, gentle sequence to clear your mind and soften the day.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/intro')}
            activeOpacity={0.8}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Begin</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.tilesGrid,
            { opacity: tilesOpacity, transform: [{ translateY: tilesTranslateY }] },
          ]}
        >
          <TouchableOpacity style={styles.tileCard} activeOpacity={0.85}>
            <Text style={styles.tileLabel}>Daily Reflection</Text>
            <Text style={styles.tileSub}>Capture one gentle insight.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tileCard} activeOpacity={0.85}>
            <Text style={styles.tileLabel}>Breathing Reset</Text>
            <Text style={styles.tileSub}>Return to your breath in 1 minute.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tileCard} activeOpacity={0.85}>
            <Text style={styles.tileLabel}>Emotional Check-In</Text>
            <Text style={styles.tileSub}>Name how you feel without judgment.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tileCard} activeOpacity={0.85}>
            <Text style={styles.tileLabel}>7-Day Progress</Text>
            <Text style={styles.tileSub}>
              Logins: {last7Progress.logins} | Breathing: {last7Progress.breathing}
            </Text>
            <Text style={styles.tileSub}>Active days: {last7Progress.activeDays} / 7</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomRow,
            { opacity: bottomOpacity, transform: [{ translateY: bottomTranslateY }] },
          ]}
        >
          <TouchableOpacity
            style={styles.guideButton}
            activeOpacity={0.85}
            onPress={() => router.push('/intro')}
          >
            <Text style={styles.guideText}>Speak with your guide</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  starsContainer: { position: 'absolute', width: '100%', height: '100%' },
  star: { position: 'absolute', width: 2, height: 2, borderRadius: 1, backgroundColor: '#FFFFFF' },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  greetingLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
  },
  greetingName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15,118,110,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.4)',
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5EEAD4',
    marginRight: 6,
  },
  moodText: {
    fontSize: 13,
    color: 'rgba(240,253,250,0.9)',
  },
  geometryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
  particleRing: { position: 'relative' },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(139, 92, 246, 0.85)',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  geometryInner: { alignItems: 'center', justifyContent: 'center' },
  geometryGlow: {
    position: 'absolute',
    width: Math.min(width * 0.68, 280),
    height: Math.min(width * 0.68, 280),
    borderRadius: Math.min(width * 0.34, 140),
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  geometryFrame: {
    width: Math.min(width * 0.58, 240),
    height: Math.min(width * 0.58, 240),
    borderRadius: Math.min(width * 0.29, 120),
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
    borderRadius: Math.min(width * 0.26, 108),
  },
  innerGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: Math.min(width * 0.29, 120),
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
  },
  primaryCard: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.55)',
    marginBottom: 20,
  },
  primaryLabel: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.9)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  primaryTitle: {
    fontSize: 24,
    color: '#E5F4FF',
    fontWeight: '600',
    marginBottom: 8,
  },
  primaryCopy: {
    fontSize: 14,
    color: 'rgba(226,232,240,0.9)',
    lineHeight: 20,
    marginBottom: 14,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(56,189,248,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.6)',
  },
  primaryButtonText: {
    fontSize: 14,
    color: '#E0F2FE',
    fontWeight: '600',
  },
  tilesGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 20,
  },
  tileCard: {
    width: (width - 24 * 2 - 12) / 2,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(51,65,85,0.9)',
  },
  tileLabel: {
    fontSize: 14,
    color: '#E5E7EB',
    fontWeight: '500',
    marginBottom: 4,
  },
  tileSub: {
    fontSize: 12,
    color: 'rgba(156,163,175,0.95)',
    lineHeight: 17,
  },
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  guideButton: {
    flex: 1.3,
    marginRight: 10,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(30,64,175,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    fontSize: 14,
    color: '#E0E7FF',
    fontWeight: '600',
  },
  settingsButton: {
    flex: 0.8,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.7)',
  },
  settingsText: {
    fontSize: 13,
    color: 'rgba(209,213,219,0.95)',
    fontWeight: '500',
  },
});
