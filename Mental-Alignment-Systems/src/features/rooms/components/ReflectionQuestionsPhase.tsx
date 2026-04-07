/**
 * Reflection Questions Phase
 *
 * Shows room-specific reflection questions with heading(s) and an ambient image.
 * Uses color-named images from assets (Black.png, Teal.png, Green.png, etc.) per room.
 */

import { View, StyleSheet, ScrollView, Image, Dimensions, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { AmbientBackground, Container, Text, FadeInView, Button } from '@/shared/ui';
import { useTheme } from '@/theme';
import { getQuestionsForRoom } from '../roomQuestions';
import type { RoomType } from '../roomQuestions';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = Math.min(width * 0.5, 200);

// Color-named images from assets (Black.png, Teal.png, Green.png, etc.), one per room theme
const ROOM_IMAGES: Record<RoomType, ImageSourcePropType> = {
  fireplace: require('../../../../assets/images/Red.png'),
  ocean: require('../../../../assets/images/Teal.png'),
  forest: require('../../../../assets/images/Green.png'),
  nightSky: require('../../../../assets/images/Purple.png'),
};

interface ReflectionQuestionsPhaseProps {
  roomType: RoomType;
  onComplete: () => void;
}

export function ReflectionQuestionsPhase({ roomType, onComplete }: ReflectionQuestionsPhaseProps) {
  const { theme } = useTheme();
  const config = getQuestionsForRoom(roomType);

  return (
    <AmbientBackground variant="solid" roomTheme>
      <Container style={styles.container} padding="lg" backgroundColor="transparent">
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <FadeInView duration={theme.motion.animations.fadeIn.duration} delay={200}>
            <View style={styles.imageWrap}>
              <Image
                source={ROOM_IMAGES[roomType]}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </FadeInView>

          {config.sections.map((section, sectionIndex) => (
            <FadeInView
              key={section.heading}
              duration={theme.motion.animations.fadeIn.duration}
              delay={300 + sectionIndex * 100}
            >
              <View style={styles.section}>
                <Text variant="h3" style={styles.sectionHeading}>
                  {section.heading}
                </Text>
                <View style={styles.questionsList}>
                  {section.questions.map((q, index) => (
                    <LinearGradient
                      key={`${section.heading}-${index}`}
                      colors={index % 2 === 0 ? ['#2a2540', '#120f1f'] : ['#3d2f5c', '#1b1430']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.questionTile}
                    >
                      <View style={styles.questionTopRow}>
                        <View style={styles.questionIconBubble}>
                          <MaterialIcons name="auto-awesome" size={16} color="#c4b5fd" />
                        </View>
                        <View style={styles.questionAccentDot} />
                      </View>
                      <Text variant="body" color="tertiary" style={styles.questionNumber}>
                        Reflection {index + 1}
                      </Text>
                      <Text variant="body" color="secondary" style={styles.questionText}>
                        {q}
                      </Text>
                    </LinearGradient>
                  ))}
                </View>
              </View>
            </FadeInView>
          ))}

          <FadeInView duration={theme.motion.animations.fadeIn.duration} delay={500}>
            <View style={styles.actions}>
              <Button variant="primary" onPress={onComplete} size="lg">
                Continue
              </Button>
            </View>
          </FadeInView>
        </ScrollView>
      </Container>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  imageWrap: {
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeading: {
    marginBottom: 16,
    textAlign: 'center',
  },
  questionsList: {
    gap: 12,
  },
  questionTile: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  questionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionIconBubble: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionAccentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f9a8d4',
  },
  questionNumber: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(196,181,253,0.95)',
    marginBottom: 6,
  },
  questionText: {
    lineHeight: 22,
    color: 'rgba(255,255,255,0.9)',
  },
  actions: {
    marginTop: 24,
    alignItems: 'center',
  },
});
