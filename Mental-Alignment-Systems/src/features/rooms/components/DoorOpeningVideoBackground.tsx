/**
 * Door Opening Video Background
 *
 * Full-screen, play-once video for the "room door" entrance. Plays when the user
 * enters the room, stops at a chosen time (doors fully open), and replays from
 * the start each time the user enters again. No loop; no parallax.
 *
 * When initialPausedAtTime is set, the video does not play — it shows that
 * frame only (e.g. room session so the door doesn't replay).
 */

import { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { ReactNode } from 'react';

const DOOR_VIDEO_SOURCE = require('../../../../assets/live-room-video/door-opening-room.mp4');

/** Stop playback at this time (seconds) so the frame shows "door fully open" before any end pullback. */
export const DOOR_OPEN_FRAME_TIME_SECONDS = 8;

export interface DoorOpeningVideoBackgroundProps {
  /** Content rendered on top of the video (e.g. "Entering your space..." UI). */
  readonly children?: ReactNode;
  /**
   * Stop playback at this time in seconds (door fully open). Used on entering screen.
   * Default 8s so the video stops before the very end.
   */
  readonly stopAtTimeSeconds?: number;
  /**
   * When set, do not play — show this frame only and pause (e.g. inside room so door does not replay).
   */
  readonly initialPausedAtTime?: number;
  /**
   * Fired once when the door has fully opened (video reached stopAtTimeSeconds).
   */
  readonly onDoorFullyOpen?: () => void;
}

export function DoorOpeningVideoBackground({
  children,
  stopAtTimeSeconds = DOOR_OPEN_FRAME_TIME_SECONDS,
  initialPausedAtTime,
  onDoorFullyOpen,
}: DoorOpeningVideoBackgroundProps) {
  const hasStoppedRef = useRef(false);

  const player = useVideoPlayer(DOOR_VIDEO_SOURCE, (p) => {
    p.loop = false;
    p.muted = true;
    if (initialPausedAtTime == null) {
      p.timeUpdateEventInterval = 0.25; // ~4 updates/sec so we can stop at exact time
      p.play();
    } else {
      p.timeUpdateEventInterval = 0;
      // Do not play; seek + pause in useEffect once source is ready.
    }
  });

  // When showing only the "door open" frame (room), seek to that time and pause once ready.
  useEffect(() => {
    if (initialPausedAtTime == null) return;

    const seekAndPause = () => {
      player.currentTime = initialPausedAtTime;
      player.pause();
    };
    if (player.status === 'readyToPlay') {
      seekAndPause();
    } else {
      const sub = player.addListener('statusChange', (payload: { status: string }) => {
        if (payload.status === 'readyToPlay') {
          seekAndPause();
        }
      });
      return () => sub.remove();
    }
  }, [player, initialPausedAtTime]);

  // When playing (entering), stop at stopAtTimeSeconds so we don't run to the very end.
  useEffect(() => {
    if (initialPausedAtTime == null) {
      const onTimeUpdate = (payload: { currentTime: number }) => {
        if (hasStoppedRef.current) return;
        if (payload.currentTime >= stopAtTimeSeconds) {
          hasStoppedRef.current = true;
          player.currentTime = stopAtTimeSeconds;
          player.pause();
          onDoorFullyOpen?.();
        }
      };

      const sub = player.addListener('timeUpdate', onTimeUpdate);
      return () => sub.remove();
    }
  }, [player, stopAtTimeSeconds, initialPausedAtTime, onDoorFullyOpen]);

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
