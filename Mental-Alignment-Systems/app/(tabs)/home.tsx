/**
 * Home Tab
 *
 * Main landing screen after login. Premium entry with geometry image.
 * Enter → intro (begin journey).
 */

import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/shared/ui';
import { useFocusEffect, useRouter } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from '@/shared/contexts';
import {
  getLast7DayProgress,
  getLast7DayProgressSeries,
  type Last7DayProgress,
  type Last7DayProgressPoint,
} from '@/features/progress/storage';

const { width } = Dimensions.get('window');

const REFLECTION_TILES = [
  {
    key: 'reflection',
    title: 'Daily Reflection',
    subtitle: 'Capture one gentle insight.',
    colors: ['#1a3d42', '#14101f'] as const,
    icon: 'auto-stories' as const,
    iconColor: '#7dd3fc',
    accent: '#5eead4',
  },
  {
    key: 'breathing',
    title: 'Breathing Reset',
    subtitle: 'Return to your breath in one minute.',
    colors: ['#3d2f5c', '#161223'] as const,
    icon: 'spa' as const,
    iconColor: '#ddd6fe',
    accent: '#a78bfa',
  },
  {
    key: 'checkin',
    title: 'Emotional Check-In',
    subtitle: 'Name how you feel, without judgment.',
    colors: ['#4a3058', '#120f18'] as const,
    icon: 'favorite-outline' as const,
    iconColor: '#f9a8d4',
    accent: '#f472b6',
  },
] as const;

const PROGRESS_TILE = {
  colors: ['#2a2540', '#0c0a12'] as const,
  icon: 'show-chart' as const,
  iconColor: '#fcd34d',
  accent: '#fbbf24',
};

/** Hero card — same visual language as reflection tiles (gradient, bubble, accent). */
const PRIMARY_FOCUS_TILE = {
  colors: ['#1a3650', '#0c1222'] as const,
  icon: 'auto-awesome' as const,
  iconColor: '#7dd3fc',
  accent: '#38bdf8',
};

const PARTICLE_COUNT = 10;
const RING_RADIUS = Math.min(width * 0.2, 82);
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
  const [last7Series, setLast7Series] = useState<Last7DayProgressPoint[]>([]);

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
        const [stats, series] = await Promise.all([
          getLast7DayProgress(),
          getLast7DayProgressSeries(),
        ]);
        if (active) {
          setLast7Progress(stats);
          setLast7Series(series);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const maxBarValue = Math.max(1, ...last7Series.map((p) => p.total));

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
          style={[{ opacity: primaryOpacity, transform: [{ translateY: primaryTranslateY }] }]}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/intro')}
            style={styles.primaryTileOuter}
          >
            <LinearGradient
              colors={[PRIMARY_FOCUS_TILE.colors[0], PRIMARY_FOCUS_TILE.colors[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryTileGradient}
            >
              <View style={styles.reflectTopRow}>
                <View style={styles.reflectIconBubble}>
                  <MaterialIcons
                    name={PRIMARY_FOCUS_TILE.icon}
                    size={20}
                    color={PRIMARY_FOCUS_TILE.iconColor}
                  />
                </View>
                <View
                  style={[styles.reflectAccentDot, { backgroundColor: PRIMARY_FOCUS_TILE.accent }]}
                />
              </View>
              <Text style={styles.primaryEyebrow}>Primary focus</Text>
              <Text style={styles.primaryHeroTitle}>Start Today’s Reset</Text>
              <Text style={styles.primaryHeroCopy}>
                A short, gentle sequence to clear your mind and soften the day.
              </Text>
              <View style={styles.primaryCtaPill}>
                <Text style={styles.primaryCtaText}>Begin</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.tilesGrid,
            { opacity: tilesOpacity, transform: [{ translateY: tilesTranslateY }] },
          ]}
        >
          <View style={styles.tilesRow}>
            {REFLECTION_TILES.slice(0, 2).map((tile) => (
              <TouchableOpacity
                key={tile.key}
                style={styles.reflectTileOuter}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={[tile.colors[0], tile.colors[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.reflectTileGradient}
                >
                  <View style={styles.reflectTopRow}>
                    <View style={styles.reflectIconBubble}>
                      <MaterialIcons name={tile.icon} size={20} color={tile.iconColor} />
                    </View>
                    <View style={[styles.reflectAccentDot, { backgroundColor: tile.accent }]} />
                  </View>
                  <Text style={styles.reflectTitle}>{tile.title}</Text>
                  <Text style={styles.reflectSubtitle}>{tile.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.tilesRow, styles.tilesRowLast]}>
            {REFLECTION_TILES.slice(2).map((tile) => (
              <TouchableOpacity
                key={tile.key}
                style={styles.reflectTileOuter}
                activeOpacity={0.88}
                onPress={
                  tile.key === 'checkin'
                    ? () => router.push('/emotional-path')
                    : undefined
                }
              >
                <LinearGradient
                  colors={[tile.colors[0], tile.colors[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.reflectTileGradient}
                >
                  <View style={styles.reflectTopRow}>
                    <View style={styles.reflectIconBubble}>
                      <MaterialIcons name={tile.icon} size={20} color={tile.iconColor} />
                    </View>
                    <View style={[styles.reflectAccentDot, { backgroundColor: tile.accent }]} />
                  </View>
                  <Text style={styles.reflectTitle}>{tile.title}</Text>
                  <Text style={styles.reflectSubtitle}>{tile.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.reflectTileOuter} activeOpacity={0.88}>
              <LinearGradient
                colors={[PROGRESS_TILE.colors[0], PROGRESS_TILE.colors[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.reflectTileGradient}
              >
                <View style={styles.reflectTopRow}>
                  <View style={styles.reflectIconBubble}>
                    <MaterialIcons name={PROGRESS_TILE.icon} size={20} color={PROGRESS_TILE.iconColor} />
                  </View>
                  <View style={[styles.reflectAccentDot, { backgroundColor: PROGRESS_TILE.accent }]} />
                </View>
                <Text style={styles.reflectTitle}>7-Day Progress</Text>
                <View style={styles.progressChartRow}>
                  {last7Series.map((point, idx) => {
                    const barHeight = Math.max(5, (point.total / maxBarValue) * 28);
                    return (
                      <View key={`${point.dayLabel}-${idx}`} style={styles.progressBarWrap}>
                        <View style={[styles.progressBar, { height: barHeight }]} />
                        <Text style={styles.progressDayLabel}>{point.dayLabel}</Text>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.progressStatsRow}>
                  <Text style={styles.reflectStatText} numberOfLines={1}>
                    Logins {last7Progress.logins}
                  </Text>
                  <Text style={styles.reflectStatText} numberOfLines={1}>
                    Breaths {last7Progress.breathing}
                  </Text>
                </View>
                <Text style={styles.reflectStatTextMuted} numberOfLines={1}>
                  Active {last7Progress.activeDays} / 7
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomRow,
            { opacity: bottomOpacity, transform: [{ translateY: bottomTranslateY }] },
          ]}
        >
          <TouchableOpacity
            style={styles.guideButtonOuter}
            activeOpacity={0.88}
            onPress={() => router.push('/intro')}
          >
            <LinearGradient
              colors={['#1e4550', '#1e1830']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.guideButtonGradient}
            >
              <Text style={styles.guideText}>Speak with your Gratitude keeper guide</Text>
            </LinearGradient>
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
    marginBottom: 14,
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
    marginBottom: 28,
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
    width: Math.min(width * 0.5, 190),
    height: Math.min(width * 0.5, 190),
    borderRadius: Math.min(width * 0.25, 95),
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  geometryFrame: {
    width: Math.min(width * 0.42, 170),
    height: Math.min(width * 0.42, 170),
    borderRadius: Math.min(width * 0.21, 85),
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
  primaryTileOuter: {
    width: '100%',
    borderRadius: 22,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryTileGradient: {
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  primaryEyebrow: {
    marginTop: 10,
    fontSize: 11,
    color: 'rgba(148,200,255,0.72)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  primaryHeroTitle: {
    fontSize: 21,
    color: 'rgba(255,255,255,0.98)',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  primaryHeroCopy: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(226,232,240,0.78)',
    marginBottom: 12,
  },
  primaryCtaPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(56,189,248,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.55)',
  },
  primaryCtaText: {
    fontSize: 13,
    color: '#E0F2FE',
    fontWeight: '600',
  },
  tilesGrid: {
    width: '100%',
    marginBottom: 20,
  },
  tilesRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    columnGap: 12,
    marginBottom: 14,
  },
  tilesRowLast: {
    marginBottom: 0,
  },
  reflectTileOuter: {
    flex: 1,
    minWidth: 0,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  reflectTileGradient: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 138,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  reflectTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reflectIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reflectAccentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reflectTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.96)',
    letterSpacing: 0.2,
  },
  reflectSubtitle: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.68)',
  },
  progressChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 6,
    minHeight: 36,
  },
  progressBarWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 16,
  },
  progressBar: {
    width: 7,
    borderRadius: 6,
    backgroundColor: 'rgba(253,224,71,0.85)',
    marginBottom: 3,
  },
  progressDayLabel: {
    fontSize: 9,
    color: 'rgba(226,232,240,0.65)',
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 6,
  },
  reflectStatText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 13,
    color: 'rgba(226,232,240,0.88)',
    fontWeight: '500',
  },
  reflectStatTextMuted: {
    fontSize: 10,
    lineHeight: 13,
    color: 'rgba(203,213,225,0.65)',
  },
  bottomRow: {
    width: '100%',
    alignItems: 'stretch',
    marginTop: 2,
  },
  guideButtonOuter: {
    width: '100%',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  guideButtonGradient: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.94)',
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
    lineHeight: 22,
  },
});
