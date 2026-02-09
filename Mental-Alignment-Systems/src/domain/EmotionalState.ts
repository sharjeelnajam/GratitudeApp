/**
 * EmotionalState Domain Model
 * 
 * Represents a non-diagnostic, optional emotional state.
 * This is purely descriptive and does not imply any clinical condition.
 * 
 * Rules:
 * - No medical or clinical terminology
 * - No diagnosis language
 * - Optional - users may choose not to specify
 */

export interface EmotionalState {
  readonly id: string;
  readonly label: string; // Simple, non-clinical label (e.g., "calm", "reflective", "present")
  readonly description?: string; // Optional description
  readonly createdAt: Date;
}

/**
 * Predefined emotional state labels (non-clinical)
 * These are gentle, descriptive terms aligned with the design philosophy
 */
export const EMOTIONAL_STATE_LABELS = {
  CALM: 'calm',
  REFLECTIVE: 'reflective',
  PRESENT: 'present',
  GROUNDED: 'grounded',
  OPEN: 'open',
  QUIET: 'quiet',
  STILL: 'still',
  CENTERED: 'centered',
} as const;

export type EmotionalStateLabel = typeof EMOTIONAL_STATE_LABELS[keyof typeof EMOTIONAL_STATE_LABELS];

/**
 * Creates a new EmotionalState
 */
export function createEmotionalState(
  id: string,
  label: string,
  description?: string
): EmotionalState {
  return {
    id,
    label,
    description,
    createdAt: new Date(),
  };
}
