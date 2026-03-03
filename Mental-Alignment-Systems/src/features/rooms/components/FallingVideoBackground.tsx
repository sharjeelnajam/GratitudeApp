/**
 * Full-screen falling video background.
 * Used on app intro (play once, then navigate) and in room (loop in all stages).
 */

import { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { ReactNode } from 'react';

const FALLING_VIDEO_SOURCE = require('../../../../assets/live-room-video/starts-falling.mp4');

export interface FallingVideoBackgroundProps {
  readonly children?: ReactNode;
  /** Loop the video (e.g. in room). When false, plays once. */
  readonly loop?: boolean;
  /** Called when playback ends (only when loop is false). */
  readonly onPlaybackEnd?: () => void;
}

export function FallingVideoBackground({
  children,
  loop = false,
  onPlaybackEnd,
}: FallingVideoBackgroundProps) {
  const onEndCalledRef = useRef(false);

  const player = useVideoPlayer(FALLING_VIDEO_SOURCE, (p) => {
    p.loop = loop;
    p.muted = false;
    p.play();
  });

  useEffect(() => {
    if (loop || !onPlaybackEnd) return;

    const handlePlayToEnd = () => {
      if (onEndCalledRef.current) return;
      onEndCalledRef.current = true;
      onPlaybackEnd();
    };

    const sub = player.addListener('playToEnd', handlePlayToEnd);
    return () => sub.remove();
  }, [player, loop, onPlaybackEnd]);

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
