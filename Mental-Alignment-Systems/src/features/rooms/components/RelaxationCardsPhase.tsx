/**
 * Relaxation Cards Phase
 *
 * 5 interactive flip cards with color/flower imagery on the front
 * and short relaxation messages on the back to ease depression and sadness.
 * Shown after Body Awareness audio.
 */

import { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text as RNText,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeInView, CardEnterView } from '@/shared/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const CARD_GAP = 14;
const GRID_COLUMNS = 2;
const GRID_HORIZONTAL_PADDING = 24;
const GRID_AVAILABLE_WIDTH = width - GRID_HORIZONTAL_PADDING * 2 - CARD_GAP;
const CARD_WIDTH = GRID_AVAILABLE_WIDTH / GRID_COLUMNS;
const CARD_HEIGHT = Math.min(height * 0.26, 220);
const EXPANDED_CARD_WIDTH = width - 40;
const EXPANDED_CARD_HEIGHT = Math.min(height * 0.72, 560);

interface CardData {
  id: string;
  label: string;
  /** Static image (PNG/JPG) - used when imageGif is not set */
  image: number;
  /** Optional GIF (e.g. flower) - when set, used for the card front instead of image */
  imageGif?: number;
  message: string;
}

const CARDS: CardData[] = [
  {
    id: '1',
    label: 'Lavender',
    image: require('../../../../assets/images/Purple.png'),
    // imageGif: require('../../../../assets/images/lavender-flower.gif'), // optional: use GIF for animated flower
    message: 'You are allowed to rest. Soften your shoulders and breathe. This moment is yours.',
  },
  {
    id: '2',
    label: 'Rose',
    image: require('../../../../assets/images/Pink.png'),
    message: 'Be gentle with yourself. You are doing the best you can. That is enough.',
  },
  {
    id: '3',
    label: 'Sky',
    image: require('../../../../assets/images/Blue.png'),
    message: 'Let heaviness drift like clouds. You are not your sadness. Peace is possible.',
  },
  {
    id: '4',
    label: 'Leaf',
    image: require('../../../../assets/images/Green.png'),
    message: 'Growth is quiet. You are rooted. One breath at a time, you are renewing.',
  },
  {
    id: '5',
    label: 'Light',
    image: require('../../../../assets/images/Yellow.png'),
    message: 'Even a small glow matters. You matter. Let this reminder warm you from within.',
  },
];

interface RelaxationCardsPhaseProps {
  onComplete: () => void;
}

const GLOW_CYCLE_MS = 2400;

function FlipCard({
  card,
  index,
  expanded = false,
  showBackOnly = false,
}: {
  card: CardData;
  index: number;
  expanded?: boolean;
  showBackOnly?: boolean;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.08)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  // Gentle glow in/out on the card image (looping)
  useEffect(() => {
    const glowIn = Animated.timing(glowAnim, {
      toValue: 0.32,
      duration: GLOW_CYCLE_MS / 2,
      useNativeDriver: true,
    });
    const glowOut = Animated.timing(glowAnim, {
      toValue: 0.08,
      duration: GLOW_CYCLE_MS / 2,
      useNativeDriver: true,
    });
    const loop = Animated.loop(Animated.sequence([glowIn, glowOut]));
    loop.start();
    return () => loop.stop();
  }, [glowAnim]);

  const handlePress = () => {
    const toValue = isFlipped ? 0 : 1;
    setIsFlipped(!isFlipped);
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 65,
      useNativeDriver: true,
    }).start();
  };

  const rotateFront = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const rotateBack = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const opacityFront = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  const opacityBack = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const cardImageSource = card.imageGif ?? card.image;

  if (showBackOnly) {
    return (
      <View style={styles.cardTouchExpanded}>
        <View style={styles.cardOuter}>
          <View style={[styles.cardFace, styles.cardBack]}>
            <View style={styles.cardBackInner}>
              <RNText style={styles.cardLabelExpanded}>{card.label}</RNText>
              <RNText style={styles.cardMessageExpanded}>{card.message}</RNText>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={[
        expanded ? styles.cardTouchExpanded : styles.cardTouch,
        !expanded && index === 4 && styles.cardTouchSingle,
      ]}
    >
      <View style={styles.cardOuter}>
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            {
              transform: [{ rotateY: rotateFront }],
              opacity: opacityFront,
            },
          ]}
        >
          <View style={styles.cardImageWrap}>
            <Image source={cardImageSource} style={styles.cardImage} resizeMode="cover" />
            <Animated.View
              style={[
                styles.cardImageGlow,
                { opacity: glowAnim },
              ]}
              pointerEvents="none"
            />
          </View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cardLabelWrap}>
            <RNText style={styles.cardLabel} numberOfLines={1}>
              {card.label}
            </RNText>
          </View>
          <View style={styles.tapHint}>
            <MaterialIcons name="touch-app" size={20} color="rgba(255,255,255,0.8)" />
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            {
              transform: [{ rotateY: rotateBack }],
              opacity: opacityBack,
            },
          ]}
        >
          <View style={styles.cardBackInner}>
            <RNText style={styles.cardMessage}>{card.message}</RNText>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

export function RelaxationCardsPhase({ onComplete }: RelaxationCardsPhaseProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedCard, setExpandedCard] = useState<CardData | null>(null);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const frostSlide = useRef(new Animated.Value(0)).current;
  const frostPulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: expandedCard ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [expandAnim, expandedCard]);

  useEffect(() => {
    const slideLoop = Animated.loop(
      Animated.timing(frostSlide, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(frostPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(frostPulse, { toValue: 0.7, duration: 1000, useNativeDriver: true }),
      ])
    );
    slideLoop.start();
    pulseLoop.start();
    return () => {
      slideLoop.stop();
      pulseLoop.stop();
    };
  }, [frostPulse, frostSlide]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.40)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.40)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <FadeInView duration={500} style={styles.fadeWrap}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <RNText style={styles.title}>Moments of calm</RNText>
          <RNText style={styles.subtitle}>Tap the card to reveal a gentle reminder</RNText>

          <View style={styles.grid}>
            {CARDS.map((card, index) => (
              <CardEnterView key={card.id} duration={400 + index * 50}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setExpandedCard(card)}
                  style={[styles.cardTouch, index === 4 && styles.cardTouchSingle]}
                >
                  <View style={styles.cardOuter}>
                    <View style={[styles.cardFace, styles.cardFront]}>
                      <View style={styles.cardImageWrap}>
                        <Image source={card.imageGif ?? card.image} style={styles.cardImage} resizeMode="cover" />
                      </View>
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={styles.cardLabelWrap}>
                        <RNText style={styles.cardLabel} numberOfLines={1}>
                          {card.label}
                        </RNText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </CardEnterView>
            ))}
          </View>
        </ScrollView>
      </FadeInView>

      {expandedCard && (
        <Animated.View
          style={[
            styles.expandedOverlay,
            {
              opacity: expandAnim,
            },
          ]}
        >
          <Pressable style={styles.expandedBackdrop} onPress={() => setExpandedCard(null)} />
          <Animated.View
            style={[
              styles.expandedContent,
              {
                transform: [
                  {
                    scale: expandAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.88, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <FlipCard card={expandedCard} index={0} expanded showBackOnly />
            <View
              style={[
                styles.expandedActions,
                { paddingBottom: Math.max(insets.bottom, 12) },
              ]}
            >
              <TouchableOpacity
                style={[styles.actionButton, styles.exitButton]}
                onPress={() => {
                  onComplete();
                  setExpandedCard(null);
                  router.replace('/(tabs)/home');
                }}
                activeOpacity={0.85}
              >
                <RNText style={styles.actionButtonText}>Exit Room</RNText>
              </TouchableOpacity>
              <Animated.View style={[styles.actionButton, styles.oceanButton, { transform: [{ scale: frostPulse }] }]}>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.oceanFrostOverlay,
                    {
                      transform: [
                        {
                          translateX: frostSlide.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-80, 120],
                          }),
                        },
                        { rotate: '-18deg' },
                      ],
                    },
                  ]}
                />
                <TouchableOpacity
                  style={styles.oceanButtonTouch}
                  onPress={() => router.push('/entering-room?room=ocean')}
                  activeOpacity={0.85}
                >
                  <RNText style={styles.oceanEmoji}>❄</RNText>
                  <RNText style={styles.actionButtonText}>Go to Ocean Room</RNText>
                  <RNText style={styles.oceanEmoji}>❄</RNText>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fadeWrap: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 28,
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  cardTouch: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: CARD_GAP,
  },
  cardTouchSingle: {
    width: '100%',
    height: Math.min(height * 0.28, 240),
  },
  cardTouchExpanded: {
    width: EXPANDED_CARD_WIDTH,
    height: EXPANDED_CARD_HEIGHT,
    marginBottom: 12,
  },
  singleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2A2438',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardFront: {
    justifyContent: 'flex-end',
  },
  cardImageWrap: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  cardImageGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
  },
  cardLabelWrap: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tapHint: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.9,
  },
  cardBack: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 36, 56, 0.98)',
  },
  cardBackInner: {
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
    textAlign: 'center',
  },
  cardLabelExpanded: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cardMessageExpanded: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 30,
    textAlign: 'center',
  },
  continueButton: {
    width: '100%',
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.45)',
    backgroundColor: 'rgba(139, 92, 246, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  expandedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  expandedContent: {
    width: EXPANDED_CARD_WIDTH,
    alignItems: 'center',
  },
  expandedActions: {
    width: '100%',
    marginTop: 4,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  exitButton: {
    borderColor: 'rgba(239, 68, 68, 0.45)',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  oceanButton: {
    borderColor: 'rgba(56, 189, 248, 0.45)',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    overflow: 'hidden',
  },
  oceanButtonTouch: {
    width: '100%',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
  },
  oceanFrostOverlay: {
    position: 'absolute',
    top: -8,
    bottom: -8,
    width: 64,
    backgroundColor: 'rgba(224, 242, 254, 0.33)',
    shadowColor: '#E0F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 8,
    elevation: 4,
  },
  oceanEmoji: {
    color: '#E0F2FE',
    fontSize: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
