/**
 * Reflection Questions Phase
 *
 * Shows room-specific reflection questions with heading(s) and an ambient image.
 * Uses color-named images from assets (Black.png, Teal.png, Green.png, etc.) per room.
 */

import { View, StyleSheet, ScrollView, Image, Dimensions, ImageSourcePropType } from 'react-native';
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
      <Container style={styles.container} padding="lg" backgroundColor="background">
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
                    <View key={`${section.heading}-${index}`} style={styles.questionRow}>
                      <Text variant="body" color="tertiary" style={styles.questionNumber}>
                        {index + 1}.
                      </Text>
                      <Text variant="body" color="secondary" style={styles.questionText}>
                        {q}
                      </Text>
                    </View>
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
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  questionNumber: {
    marginRight: 10,
    minWidth: 24,
    fontSize: 14,
  },
  questionText: {
    flex: 1,
    lineHeight: 22,
  },
  actions: {
    marginTop: 24,
    alignItems: 'center',
  },
});
