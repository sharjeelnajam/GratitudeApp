/**
 * Rooms Tab
 *
 * Displays all available guided alignment rooms in a horizontal carousel.
 */

import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, FadeInView } from '@/shared/ui';
import { ShareRoomButton } from '@/features/rooms/components/ShareRoomButton';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');
const CARD_SPACING = 20;
const CARD_WIDTH = width - 80;
const CARD_HEIGHT = Math.min(height * 0.55, 400);

export default function RoomsTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

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
                      <View style={styles.roomCardHeader}>
                        <View style={[styles.roomIcon, styles[`${room.id}Icon` as keyof typeof styles]]}>
                          <MaterialIcons name={room.icon} size={28} color={room.iconColor} />
                        </View>
                        <Text style={styles.roomTitle}>{t(`rooms.${room.id}.name`)}</Text>
                        <ShareRoomButton roomType={room.id} style={styles.shareOnCard} size={20} />
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
                {rooms.map((_, index) => {
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
                      key={index}
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
