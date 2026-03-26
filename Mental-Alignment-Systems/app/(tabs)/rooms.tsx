/**
 * Rooms Tab
 *
 * Displays all available guided alignment rooms in a horizontal carousel.
 */

import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, FadeInView } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');
const CARD_SPACING = 20;
const CARD_WIDTH = width - 80;
const CARD_HEIGHT = Math.min(height * 0.55, 400);
const CARD_PARTICLE_COUNT = 14;

export default function RoomsTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const auraRotation = useRef(new Animated.Value(0)).current;
  const titleGlow = useRef(new Animated.Value(0.35)).current;

  const rooms = [
    {
      id: 'fireplace',
      icon: 'whatshot' as const,
      iconColor: '#F59E0B',
    },
    {
      id: 'ocean',
      icon: 'water-drop' as const,
      iconColor: '#06B6D4',
    },
    {
      id: 'forest',
      icon: 'park' as const,
      iconColor: '#10B981',
    },
    {
      id: 'nightSky',
      icon: 'nightlight' as const,
      iconColor: '#8B5CF6',
    },
  ];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  useEffect(() => {
    const rotationLoop = Animated.loop(
      Animated.timing(auraRotation, {
        toValue: 1,
        duration: 14000,
        useNativeDriver: true,
      })
    );

    const titlePulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(titleGlow, {
          toValue: 0.45,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    rotationLoop.start();
    titlePulseLoop.start();

    return () => {
      rotationLoop.stop();
      titlePulseLoop.stop();
    };
  }, [auraRotation, titleGlow]);

  const auraRotationInterpolate = auraRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cardParticles = useMemo(
    () => {
      const ringWidth = CARD_WIDTH - 20;
      const ringHeight = CARD_HEIGHT - 20;
      const centerX = ringWidth / 2;
      const centerY = ringHeight / 2;
      const radiusX = ringWidth / 2 - 8;
      const radiusY = ringHeight / 2 - 8;

      return Array.from({ length: CARD_PARTICLE_COUNT }, (_, i) => {
        const angle = (i / CARD_PARTICLE_COUNT) * 2 * Math.PI;
        return {
          key: `p-${i}`,
          style: {
            left: centerX + radiusX * Math.cos(angle),
            top: centerY + radiusY * Math.sin(angle),
          },
        };
      });
    },
    []
  );

  return (
    <LinearGradient
      colors={['#1E1B2E', '#2D1B3D', '#3B2F4D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <FadeInView duration={800} delay={200}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('rooms.title')}</Text>
              <Text style={styles.subtitle}>{t('rooms.subtitle')}</Text>
            </View>
          </FadeInView>

          <FadeInView duration={800} delay={400}>
            <View style={styles.carouselContainer}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                snapToAlignment="start"
                decelerationRate="fast"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={[
                  styles.carouselContent,
                  { paddingLeft: 40, paddingRight: 40 },
                ]}
              >
                {rooms.map((room, index) => (
                  <View
                    key={room.id}
                    style={[
                      styles.cardWrapper,
                      {
                        width: CARD_WIDTH,
                        marginRight: index < rooms.length - 1 ? CARD_SPACING : 0,
                      },
                    ]}
                  >
                    <View style={[styles.roomCard, styles[`${room.id}Card` as keyof typeof styles]]}>
                      {(room.id === 'fireplace' || room.id === 'ocean') && (
                        <View pointerEvents="none" style={styles.cardGifOverlay}>
                          <Image
                            source={
                              room.id === 'fireplace'
                                ? require('../../assets/gif/fire.gif')
                                : require('../../assets/gif/sea-ocean.gif')
                            }
                            style={styles.cardGif}
                            resizeMode="cover"
                          />
                        </View>
                      )}

                      <Animated.View
                        pointerEvents="none"
                        style={[
                          styles.cardAuraRing,
                          {
                            opacity: titleGlow.interpolate({
                              inputRange: [0.35, 1],
                              outputRange: [0.25, 0.9],
                            }),
                            transform: [{ rotate: auraRotationInterpolate }],
                          },
                        ]}
                      >
                        {room.id !== 'fireplace' && room.id !== 'ocean' && cardParticles.map((particle) => (
                          <View
                            key={`${room.id}-${particle.key}`}
                            style={[
                              styles.auraParticle,
                              {
                                ...particle.style,
                                backgroundColor: room.iconColor,
                                shadowColor: room.iconColor,
                              },
                            ]}
                          />
                        ))}
                      </Animated.View>

                      <View style={styles.roomCardHeader}>
                        <View style={[styles.roomIcon, styles[`${room.id}Icon` as keyof typeof styles]]}>
                          <MaterialIcons name={room.icon} size={28} color={room.iconColor} />
                        </View>
                        <Animated.View style={{ opacity: titleGlow }}>
                          <Text
                            style={StyleSheet.flatten([
                              styles.roomTitle,
                              {
                                textShadowColor: room.iconColor,
                                textShadowRadius: 12,
                                textShadowOffset: { width: 0, height: 0 },
                              },
                            ])}
                          >
                            {t(`rooms.${room.id}.name`)}
                          </Text>
                        </Animated.View>
                      </View>
                      <Text style={styles.roomDescription}>{t(`rooms.${room.id}.description`)}</Text>
                      <Text style={styles.roomSubtext}>{t(`rooms.${room.id}.subtext`)}</Text>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          onPress={() => router.push(`/entering-room?room=${room.id}`)}
                          activeOpacity={0.7}
                          style={[
                            styles.roomButtonOutline,
                            { borderColor: room.iconColor },
                          ]}
                        >
                          <Text style={StyleSheet.flatten([styles.roomButtonText, { color: room.iconColor }])}>
                            {t('common.enter')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.paginationContainer}>
                {rooms.map((room, index) => {
                  const inputRange = [
                    (index - 1) * (CARD_WIDTH + CARD_SPACING),
                    index * (CARD_WIDTH + CARD_SPACING),
                    (index + 1) * (CARD_WIDTH + CARD_SPACING),
                  ];

                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 24, 8],
                    extrapolate: 'clamp',
                  });

                  const dotOpacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  });

                  return (
                    <Animated.View
                      key={`dot-${room.id}`}
                      style={[
                        styles.paginationDot,
                        {
                          width: dotWidth,
                          opacity: dotOpacity,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          </FadeInView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingBottom: 16 },
  content: { paddingTop: 8, paddingBottom: 8 },
  header: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 20 },
  title: {
    fontSize: 36,
    paddingVertical: 4,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'serif',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  carouselContainer: { marginTop: 12, paddingBottom: 24 },
  carouselContent: { paddingVertical: 16, paddingBottom: 24 },
  cardWrapper: {},
  roomCard: {
    position: 'relative',
    borderRadius: 24,
    padding: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    height: CARD_HEIGHT,
    maxHeight: CARD_HEIGHT,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardGifOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  cardGif: {
    width: '100%',
    height: '100%',
  },
  cardAuraRing: {
    position: 'absolute',
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    borderRadius: 20,
  },
  auraParticle: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 999,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 3,
  },
  fireplaceCard: { borderLeftWidth: 4, borderLeftColor: 'rgba(245, 158, 11, 0.6)', shadowColor: '#F59E0B' },
  oceanCard: { borderLeftWidth: 4, borderLeftColor: 'rgba(6, 182, 212, 0.6)', shadowColor: '#06B6D4' },
  forestCard: { borderLeftWidth: 4, borderLeftColor: 'rgba(16, 185, 129, 0.6)', shadowColor: '#10B981' },
  nightSkyCard: { borderLeftWidth: 4, borderLeftColor: 'rgba(139, 92, 246, 0.6)', shadowColor: '#8B5CF6' },
  roomCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  shareOnCard: { width: 44, height: 44, marginLeft: 'auto' },
  roomIcon: {
    width: 44, height: 44, borderRadius: 22, marginRight: 14,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fireplaceIcon: { backgroundColor: 'rgba(245, 158, 11, 0.25)', borderColor: 'rgba(245, 158, 11, 0.4)' },
  oceanIcon: { backgroundColor: 'rgba(6, 182, 212, 0.25)', borderColor: 'rgba(6, 182, 212, 0.4)' },
  forestIcon: { backgroundColor: 'rgba(16, 185, 129, 0.25)', borderColor: 'rgba(16, 185, 129, 0.4)' },
  nightSkyIcon: { backgroundColor: 'rgba(139, 92, 246, 0.25)', borderColor: 'rgba(139, 92, 246, 0.4)' },
  roomTitle: {
    flex: 1,
    flexShrink: 1,
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 22,
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },
  roomDescription: { marginBottom: 6, lineHeight: 20, color: 'rgba(255, 255, 255, 0.85)', fontSize: 14, fontWeight: '300' },
  roomSubtext: { marginBottom: 16, fontStyle: 'italic', fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', fontWeight: '300' },
  buttonContainer: { marginTop: 12, paddingTop: 18, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.15)' },
  roomButtonOutline: {
    borderRadius: 12, width: '100%', minHeight: 44,
    justifyContent: 'center', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 24,
    backgroundColor: 'transparent', borderWidth: 2, overflow: 'hidden',
  },
  roomButtonText: { fontWeight: '500', letterSpacing: 1, fontSize: 14 },
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 8 },
  paginationDot: {
    height: 8, borderRadius: 4, backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8, elevation: 4,
  },
});
