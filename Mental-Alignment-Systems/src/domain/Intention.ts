/**
 * Intention Domain Model
 * 
 * Represents a user's intention - what they wish to focus on or be present with.
 * Not a goal or objective - simply an intention for presence and alignment.
 * 
 * Rules:
 * - No goal-setting language
 * - No achievement tracking
 * - No progress metrics
 * - Focus on presence, not outcomes
 */

export interface Intention {
  readonly id: string;
  readonly text: string; // The intention text (e.g., "Be present with gratitude")
  readonly createdAt: Date;
  readonly isActive: boolean; // Whether this intention is currently active
  readonly roomId?: string; // Optional room where intention was set
}

/**
 * Creates a new Intention
 */
export function createIntention(
  id: string,
  text: string,
  options?: {
    isActive?: boolean;
    roomId?: string;
  }
): Intention {
  return {
    id,
    text,
    createdAt: new Date(),
    isActive: options?.isActive ?? true,
    roomId: options?.roomId,
  };
}

/**
 * Activates an intention (returns new immutable instance)
 */
export function activateIntention(intention: Intention): Intention {
  return {
    ...intention,
    isActive: true,
  };
}

/**
 * Deactivates an intention (returns new immutable instance)
 */
export function deactivateIntention(intention: Intention): Intention {
  return {
    ...intention,
    isActive: false,
  };
}

/**
 * Updates intention text (returns new immutable instance)
 */
export function updateIntentionText(
  intention: Intention,
  text: string
): Intention {
  return {
    ...intention,
    text,
  };
}
