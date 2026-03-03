/**
 * Full-screen live-effect-1.mp4 background for room session.
 * Loops; used for all room phases after the starts-falling intro.
 */

import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { ReactNode } from 'react';

const LIVE_EFFECT_VIDEO_SOURCE = require('../../../../assets/live-room-video/live-effect-1.mp4');

export interface LiveEffectVideoBackgroundProps {
  readonly children?: ReactNode;
}

export function LiveEffectVideoBackground({ children }: LiveEffectVideoBackgroundProps) {
  const player = useVideoPlayer(LIVE_EFFECT_VIDEO_SOURCE, (p) => {
    p.loop = true;
    p.muted = false;
    p.play();
  });

  return (
    <View style={styles.container}>
      <View style={styles.videoWrap}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          fullscreenOptions={{ enable: false }}
          showsTimecodes={false}
          surfaceType="textureView"
        />
      </View>
      {children ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {children}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  videoWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
