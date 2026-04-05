import type { EmotionalBaseline } from '@/features/onboarding';

/** 10% slower cycles when baseline is emotionally drained (client spec). */
export function getBreathTimingMultiplier(baseline: EmotionalBaseline | null | undefined): number {
  if (baseline === 'emotionally_drained') return 1.1;
  return 1;
}

export const BASE_INHALE_MS = 4000;
export const BASE_HOLD_MS = 4000;
export const BASE_EXHALE_MS = 8000;
export const BREATH_CYCLES = 3;

export function getBreathDurationsMs(multiplier: number) {
  return {
    inhale: Math.round(BASE_INHALE_MS * multiplier),
    hold: Math.round(BASE_HOLD_MS * multiplier),
    exhale: Math.round(BASE_EXHALE_MS * multiplier),
  };
}
