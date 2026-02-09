/**
 * Body Awareness Message – Premium music player
 *
 * Plays the 10-min Body Awareness audio with cover image.
 * Interactive: play/pause, seek, progress. Shown after breathing activity.
 */

import { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  GestureResponderEvent,
  LayoutChangeEvent,
  Text as RNText,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { FadeInView, Button } from '@/shared/ui';
import { MaterialIcons } from '@expo/vector-icons';

import AUDIO_SOURCE from '../../../../assets/audio/body-awareness.mp3';
import COVER_IMAGE from '../../../../assets/images/body-awareness-cover.jpg';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = Math.min(width * 0.72, 280);

interface BodyAwarenessPlayerPhaseProps {
  onComplete: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function BodyAwarenessPlayerPhase({ onComplete }: BodyAwarenessPlayerPhaseProps) {
  const player = useAudioPlayer(AUDIO_SOURCE, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);
  const progressBarWidth = useRef(0);

  const positionMillis = Math.round((status.currentTime ?? 0) * 1000);
  const durationMillis = Math.round((status.duration ?? 0) * 1000);
  const isPlaying = status.playing;
  const isLoading = !status.isLoaded;

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  }, []);

  const togglePlayPause = () => {
    if (status.isLoaded) {
      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  const handleSeek = (value: number) => {
    if (!status.isLoaded || durationMillis <= 0) return;
    const seconds = Math.max(0, Math.min(1, value)) * (status.duration ?? 0);
    player.seekTo(seconds);
  };

  const onProgressBarPress = (e: GestureResponderEvent) => {
    if (progressBarWidth.current <= 0) return;
    const { locationX } = e.nativeEvent;
    const ratio = locationX / progressBarWidth.current;
    handleSeek(ratio);
  };

  const handleComplete = () => {
    player.pause();
    onComplete();
  };

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(30,27,46,0.82)', 'rgba(45,27,61,0.82)', 'rgba(59,47,77,0.82)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <FadeInView duration={600} style={styles.fadeWrap}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.artworkWrap}>
            <View style={styles.artworkShadow} />
            <Image
              source={COVER_IMAGE}
              style={[styles.artwork, { width: ARTWORK_SIZE, height: ARTWORK_SIZE }]}
              resizeMode="cover"
            />
          </View>

          <View style={styles.trackInfo}>
            <RNText style={styles.artist}>Dr. Maxine McLean</RNText>
            <RNText style={styles.title}>10 mins – Body Awareness Message</RNText>
          </View>

          <View style={styles.playerBlock}>
            <TouchableOpacity
              onPress={togglePlayPause}
              disabled={isLoading}
              activeOpacity={0.8}
              style={styles.playButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <MaterialIcons
                  name={isPlaying ? 'pause' : 'play-arrow'}
                  size={34}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>

            <View style={styles.progressSection}>
              <View style={styles.timeRow}>
                <RNText style={styles.timeCurrent} numberOfLines={1}>
                  {formatTime(positionMillis)}
                </RNText>
                <RNText style={styles.timeTotal} numberOfLines={1}>
                  {formatTime(durationMillis)}
                </RNText>
              </View>
              <TouchableOpacity
                style={styles.progressBar}
                activeOpacity={1}
                onPress={onProgressBarPress}
                onLayout={(e: LayoutChangeEvent) => {
                  progressBarWidth.current = e.nativeEvent.layout.width;
                }}
              >
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              variant="primary"
              size="lg"
              onPress={handleComplete}
              textStyle={styles.continueButtonText}
            >
              Continue
            </Button>
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
    paddingTop: 44,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  artworkWrap: {
    position: 'relative',
    marginBottom: 20,
  },
  trackInfo: {
    width: '100%',
    marginBottom: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 88,
  },
  artist: {
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
    lineHeight: 20,
  },
  title: {
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 24,
  },
  artworkShadow: {
    position: 'absolute',
    width: ARTWORK_SIZE + 24,
    height: ARTWORK_SIZE + 24,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    top: -8,
    left: -12,
  },
  artwork: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  playerBlock: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 28,
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
    borderWidth: 2,
    borderColor: 'rgba(167, 139, 250, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    flex: 1,
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  timeCurrent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 44,
  },
  timeTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.85,
    minWidth: 44,
    textAlign: 'right',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(167, 139, 250, 0.95)',
    borderRadius: 4,
  },
  actions: {
    marginTop: 32,
    width: '100%',
    maxWidth: 320,
  },
  continueButtonText: {
    color: '#FFFFFF',
  },
});
