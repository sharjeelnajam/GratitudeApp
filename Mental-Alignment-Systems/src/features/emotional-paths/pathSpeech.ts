import * as Speech from 'expo-speech';

/**
 * Calm pacing for regulation paths (`1.0` = system default speed in expo-speech).
 * Lower = slower. Adjust 0.65–0.85 if a device sounds too slow or fast.
 */
export const PATH_SPEECH_CALM_RATE = 0.65;

/** Slightly below `1.0` for a softer, less “sharp” tone where the OS supports it */
export const PATH_SPEECH_CALM_PITCH = 0.96;

/** Stops device text-to-speech (safe if nothing was speaking). */
export function stopDeviceSpeech(): void {
  try {
    Speech.stop();
  } catch {
    /* no-op */
  }
}

export type SpeakPathOptions = {
  rate?: number;
  pitch?: number;
  language?: string;
};

/**
 * Speak path copy with system voice (good for **dynamic AI text** when you have no recorded MP3).
 * Defaults to **slower, slightly lower pitch** for anxiety / depressive-states-friendly pacing.
 */
export function speakPathLine(text: string, options?: SpeakPathOptions): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  stopDeviceSpeech();
  Speech.speak(trimmed, {
    language: options?.language ?? 'en-US',
    rate: options?.rate ?? PATH_SPEECH_CALM_RATE,
    pitch: options?.pitch ?? PATH_SPEECH_CALM_PITCH,
  });
}
