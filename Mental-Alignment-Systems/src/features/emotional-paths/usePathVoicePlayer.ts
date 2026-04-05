import { useCallback, useEffect } from 'react';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';

function safePause(player: { pause: () => void }) {
  try {
    player.pause();
  } catch {
    /* Native AudioPlayer may already be released (e.g. screen unmount / expo-audio teardown). */
  }
}

/**
 * Single player for path voice-overs: replace source + play, or pause when clip is null.
 * Never call bare `pause` on unmount — use `stop()` which is wrapped safely.
 */
export function usePathVoicePlayer() {
  const player = useAudioPlayer(null, { downloadFirst: true });

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  }, []);

  const playClip = useCallback(
    (source: string | number | null | undefined) => {
      if (source == null) {
        safePause(player);
        return;
      }
      try {
        player.replace(source);
        player.play();
      } catch {
        /* invalid source or released player */
      }
    },
    [player]
  );

  const stop = useCallback(() => {
    safePause(player);
  }, [player]);

  return { playClip, stop };
}
