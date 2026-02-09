/**
 * Introduction Screen
 * 
 * Travel Book inspired design with top rounded section containing logo and name,
 * followed by a horizontal carousel of cards below.
 * Shown after the welcome screen "Enter" button.
 */

import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, FadeInView, PulseView } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_SPACING = 16;
const CARD_WIDTH = width - (HORIZONTAL_PADDING * 2);

interface IntroCard {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  title: string;
  date: string;
  rating: string;
  description: string;
}

const INTRO_CARDS: IntroCard[] = [
  {
    id: '1',
    icon: 'psychology',
    iconColor: '#FFFFFF',
    iconBgColor: '#06B6D4',
    title: 'Neuroplasticity',
    date: '24 June 2024',
    rating: '8.9/10',
    description: 'Our approach rewires your brain, renews your energy, and aligns with a new rhythm of wellbeing.',
  },
  {
    id: '2',
    icon: 'favorite',
    iconColor: '#FFFFFF',
    iconBgColor: '#EC4899',
    title: 'Higher Vibration',
    date: '07 Aug 2024',
    rating: '7.9/10',
    description: 'Inspired by the higher vibration of gratitude, creating new pathways that lead to peace, joy, and emotional freedom.',
  },
  {
    id: '3',
    icon: 'auto-awesome',
    iconColor: '#FFFFFF',
    iconBgColor: '#8B5CF6',
    title: 'Personal Growth',
    date: '15 Sep 2024',
    rating: '9.2/10',
    description: 'Strengthen self-confidence, ignite inspiration, build resilience, and create personal breakthroughs.',
  },
  {
    id: '4',
    icon: 'spa',
    iconColor: '#FFFFFF',
    iconBgColor: '#10B981',
    title: 'Mindful Presence',
    date: '22 Oct 2024',
    rating: '8.5/10',
    description: 'A calm space for presence and alignment, where you can return without pressure or expectations.',
  },
];

const INTRO_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function IntroScreen() {
  const router = useRouter();
  const player = useAudioPlayer(INTRO_AUDIO_URL, { downloadFirst: true });
  const status = useAudioPlayerStatus(player);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLoading = !status.isLoaded;
  const isPlaying = status.playing;

  // Configure audio mode on mount
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  }, []);

  // Handle scroll position for pagination
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
    }
  );

  const toggleAudio = () => {
    if (!status.isLoaded) return;
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleContinue = () => {
    player.pause();
    router.push('/questions');
  };

  return (
    <LinearGradient
      colors={['#1E1B2E', '#2D1B3D', '#3B2F4D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Top Rounded Section with Logo and Name */}
      <View style={styles.topSection}>
        <FadeInView duration={1000} delay={200}>
          <View style={styles.topContent}>
            {/* Logo - Circular Avatar */}
            <View style={styles.logoContainer}>
              <PulseView isActive={isPlaying} duration={2000}>
                <View style={styles.logoCircle}>
                  <Image
                    source={require('../assets/images/geometry.jpeg')}
                    style={styles.logoImage}
                    resizeMode="cover"
                  />
                </View>
              </PulseView>
            </View>

            {/* App Name */}
            <Text style={styles.appName}>Gratitude Keeper</Text>
            <Text style={styles.appSubtitle}>Your Mental Wellness Sanctuary</Text>
          </View>
        </FadeInView>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsSectionContainer}>
        <View style={styles.cardsSection}>
          <FadeInView duration={800} delay={400}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Your Journey</Text>
            </View>
          </FadeInView>

        {/* Horizontal Carousel */}
        <FadeInView duration={800} delay={600}>
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
              {
                paddingLeft: HORIZONTAL_PADDING,
                paddingRight: HORIZONTAL_PADDING,
              },
            ]}
          >
            {INTRO_CARDS.map((card, index) => (
              <View 
                key={card.id} 
                style={[
                  styles.cardWrapper, 
                  { 
                    width: CARD_WIDTH,
                    marginRight: index < INTRO_CARDS.length - 1 ? CARD_SPACING : 0,
                  }
                ]}
              >
                <View style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, { backgroundColor: card.iconBgColor }]}>
                      <MaterialIcons name={card.icon} size={24} color={card.iconColor} />
                    </View>
                    <View style={styles.cardHeaderText}>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <Text style={styles.cardDate}>{card.date}</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingText}>{card.rating}</Text>
                    </View>
                  </View>

                  {/* Your Note Section */}
                  <View style={styles.noteSection}>
                    <Text style={styles.noteLabel}>Your Note</Text>
                    <Text style={styles.noteText}>{card.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {INTRO_CARDS.map((_, index) => {
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
        </FadeInView>

        {/* Audio Player */}
        <FadeInView duration={800} delay={800}>
          <View style={styles.audioContainer}>
            <TouchableOpacity
              onPress={toggleAudio}
              disabled={isLoading}
              style={styles.audioButton}
              activeOpacity={0.6}
            >
              <View style={styles.audioButtonContent}>
                {isLoading ? (
                  <MaterialIcons name="hourglass-empty" size={20} color="#8B5CF6" />
                ) : isPlaying ? (
                  <MaterialIcons name="pause" size={20} color="#8B5CF6" />
                ) : (
                  <MaterialIcons name="play-arrow" size={20} color="#8B5CF6" />
                )}
                <Text style={styles.audioButtonText}>
                  {isLoading ? 'Loading...' : isPlaying ? 'Pause Audio' : 'Play Audio Message'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* Continue Button */}
        <FadeInView duration={800} delay={1000}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleContinue}
              style={styles.continueButton}
              activeOpacity={0.6}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Top Section (no rounded corners)
  topSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  topContent: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 3,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingBottom: 8,
    fontFamily: 'serif',
    letterSpacing: 2,
    marginBottom: 5,
    textShadowColor: 'rgba(139, 92, 246, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '100',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Cards Section Container (rounded)
  cardsSectionContainer: {
    flex: 1,
    marginTop: -20,
    paddingTop: 20,
  },
  // Cards Section
  cardsSection: {
    flex: 1,
    backgroundColor: '#1A1625',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingBottom: 20,
  },
  historyHeader: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: '400',
    paddingBottom: 8,
    color: '#FFFFFF',
    fontFamily: 'serif',
    letterSpacing: 1,
  },
  carouselContent: {
    paddingVertical: 8,
  },
  cardWrapper: {
    // marginRight handled inline
  },
  card: {
    backgroundColor: 'rgba(30, 27, 46, 0.9)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'serif',
  },
  cardDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '300',
  },
  ratingBadge: {
    backgroundColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  noteSection: {
    marginTop: 4,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '300',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  audioContainer: {
    width: '100%',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 24,
    marginBottom: 16,
  },
  audioButton: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    overflow: 'hidden',
  },
  audioButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 10,
  },
  audioButtonText: {
    color: '#8B5CF6',
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 8,
    marginBottom: 20,
  },
  continueButton: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  continueButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
