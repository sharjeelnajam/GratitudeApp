/**
 * AI voice-over assets for emotional paths.
 *
 * For each moment below, set either:
 * - A remote URL string (mp3/m4a), or
 * - A bundled file: `require('../../../assets/audio/voice/anxious_intro.mp3')` (adjust path)
 *
 * Use `null` to skip audio for that beat (on-screen copy still shows).
 *
 * Demo URL (same as intro screen) — replace with your mastered VO files:
 */
export const DEMO_VOICE_MP3_URL =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

/** PATH: ANXIOUS — maps to client Part A / B / C / D voice beats */
export const VOICE_AUDIO_ANXIOUS = {
  /** Part A — Guided intro */
  intro: DEMO_VOICE_MP3_URL as string | number | null,

  /** Part B — one clip per breath phase (repeats each cycle); use short cues or null */
  breatheInhale: null as string | number | null,
  breatheHold: null as string | number | null,
  breatheExhale: null as string | number | null,

  /** Part C — Fingerprint grounding */
  groundingBlue: null as string | number | null,
  groundingFeet: null as string | number | null,

  /** Part D — Integration */
  integration: null as string | number | null,
} as const;

/**
 * When `true` and a slot below is `null`, the app uses **device TTS** (expo-speech) to read
 * the same on-screen copy — including **dynamic AI** text on the reframe step.
 * When a slot is a URL / `require()`, that **recorded clip wins** and TTS is skipped for that beat.
 */
export const OVERWHELMED_DEVICE_TTS_ENABLED = true;

/** PATH: OVERWHELMED — maps to client voice beats */
export const VOICE_AUDIO_OVERWHELMED = {
  /** Part A — Guided intro (null → TTS reads `OVERWHELMED.introVoice` if enabled above) */
  intro: null as string | number | null,

  /**
   * Part B — recorded clip after mental dump; if null, TTS reads **`gc.acknowledgmentAndPivot`** (AI).
   */
  reframe: null as string | number | null,

  /** Part D — Integration; null → TTS reads `OVERWHELMED.integration` */
  integration: null as string | number | null,
} as const;

export type AnxiousVoiceClip = keyof typeof VOICE_AUDIO_ANXIOUS;
export type OverwhelmedVoiceClip = keyof typeof VOICE_AUDIO_OVERWHELMED;
