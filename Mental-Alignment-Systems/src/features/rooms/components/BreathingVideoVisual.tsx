/**
 * Looping breathing visual — used anywhere the app shows a guided breath (not voice).
 */

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const BREATHING_LOOP = require('../../../../assets/gif/breathing.mp4');

type BreathingVideoVisualProps = {
  /** Width and height of the circular clip (square box). */
  size: number;
  style?: StyleProp<ViewStyle>;
};

export function BreathingVideoVisual({ size, style }: BreathingVideoVisualProps) {
  const player = useVideoPlayer(BREATHING_LOOP, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const radius = size / 2;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
        style,
      ]}
    >
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        fullscreenOptions={{ enable: false }}
        showsTimecodes={false}
        surfaceType="textureView"
      />
    </View>
  );
}
