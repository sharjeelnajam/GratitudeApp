import { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { useFocusEffect, useRouter } from 'expo-router';
import { Text } from '@/shared/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STARS_FALLING_VIDEO = require('../assets/live-room-video/starts-falling.mp4');
const WELCOME_AUDIO = require('../assets/audio/welcomScreenAudio.mpeg');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const logoRotation = useRef(new Animated.Value(0)).current;

  const videoPlayer = useVideoPlayer(STARS_FALLING_VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const welcomeAudio = useAudioPlayer(WELCOME_AUDIO);
  const welcomeAudioStatus = useAudioPlayerStatus(welcomeAudio);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!welcomeAudioStatus.isLoaded) {
        return () => {};
      }
      welcomeAudio.loop = true;
      welcomeAudio.play();
      return () => {
        welcomeAudio.pause();
      };
    }, [welcomeAudio, welcomeAudioStatus.isLoaded])
  );

  const beginReset = () => {
    welcomeAudio.pause();
    router.push('/onboarding');
  };

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [logoRotation]);

  const spinInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.root}>
      <VideoView
        player={videoPlayer}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        fullscreenOptions={{ enable: false }}
        showsTimecodes={false}
        surfaceType="textureView"
      />
      <LinearGradient
        colors={['rgba(10, 7, 20, 0.55)', 'rgba(30, 27, 46, 0.65)', 'rgba(10, 7, 20, 0.75)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
      />
      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 28),
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.topBlock}>
          <View style={styles.logoShell}>
            <Animated.Image
              source={require('../assets/images/geometry.jpeg')}
              style={[styles.logo, { transform: [{ rotate: spinInterpolate }] }]}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.middleBlock}>
          <Text style={styles.headline}>Welcome.</Text>
          <Text style={styles.copy}>This is your space to slowdown and reset good energy</Text>
          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.85}
            onPress={beginReset}
          >
            <Text style={styles.ctaText}>Begin your journey to reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0714',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ scale: 1.3 }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  topBlock: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  middleBlock: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShell: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgba(167, 139, 250, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 176,
    height: 176,
    borderRadius: 88,
  },
  headline: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'serif',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  copy: {
    fontSize: 19,
    lineHeight: 30,
    color: 'rgba(255, 255, 255, 0.88)',
    textAlign: 'center',
    marginBottom: 36,
    maxWidth: 340,
  },
  cta: {
    minWidth: '88%',
    maxWidth: 360,
    minHeight: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(196, 181, 253, 0.55)',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
