/**
 * Relaxation Cards Phase
 *
 * 5 interactive flip cards with color/flower imagery on the front
 * and short relaxation messages on the back to ease depression and sadness.
 * Shown after Body Awareness audio.
 */

import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text as RNText,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeInView } from '@/shared/ui';

const { width, height } = Dimensions.get('window');
const CARD_GAP = 14;
// Single large card that fits comfortably within the screen
const CARD_WIDTH = width - 48; // match horizontal padding from scrollContent
const CARD_HEIGHT = Math.min(height * 0.55, 420);

interface CardData {
  id: string;
  label: string;
  image: number;
  message: string;
}

const CARDS: CardData[] = [
  {
    id: '1',
    label: 'Lavender',
    image: require('../../../../assets/images/Purple.png'),
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

function FlipCard({
  card,
  index,
}: {
  card: CardData;
  index: number;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

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

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={[styles.cardTouch, index === 4 && styles.cardTouchSingle]}
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
          <Image source={card.image} style={styles.cardImage} resizeMode="cover" />
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(CARDS.length - 1, prev + 1));
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === CARDS.length - 1;
  const currentCard = CARDS[currentIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(30,27,46,0.82)', 'rgba(45,27,61,0.82)', 'rgba(42,31,56,0.82)']}
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
            <FlipCard key={currentCard.id} card={currentCard} index={currentIndex} />
          </View>

          <View style={styles.carouselControls}>
            <TouchableOpacity
              onPress={goPrev}
              disabled={isFirst}
              style={[styles.arrowButton, isFirst && styles.arrowButtonDisabled]}
              activeOpacity={0.8}
            >
              <MaterialIcons name="chevron-left" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <RNText style={styles.cardCounter}>
              {currentIndex + 1} / {CARDS.length}
            </RNText>

            <TouchableOpacity
              onPress={goNext}
              disabled={isLast}
              style={[styles.arrowButton, isLast && styles.arrowButtonDisabled]}
              activeOpacity={0.8}
            >
              <MaterialIcons name="chevron-right" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </FadeInView>
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
    alignItems: 'center',
    marginBottom: CARD_GAP,
  },
  cardTouch: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: CARD_GAP,
  },
  cardTouchSingle: {
    marginLeft: 'auto',
    marginRight: 'auto',
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
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
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
  carouselControls: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  arrowButtonDisabled: {
    opacity: 0.35,
  },
  cardCounter: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
