/**
 * SavedMoment Domain Model
 * 
 * Represents a moment of gratitude or reflection that a user has saved.
 * These are personal, private reflections - not shared or compared.
 * 
 * Rules:
 * - No sharing features
 * - No comparison or ranking
 * - No "collection" or "achievement" language
 * - Simply a saved moment for personal reflection
 */

export interface SavedMoment {
  readonly id: string;
  readonly content: string; // The moment's content (what the user wrote or reflected on)
  readonly cardId?: string; // Optional card that prompted this moment
  readonly roomId?: string; // Optional room where moment was created
  readonly emotionalStateId?: string; // Optional emotional state at time of creation
  readonly createdAt: Date;
  readonly updatedAt?: Date; // Optional - moments may be edited
}

/**
 * Creates a new SavedMoment
 */
export function createSavedMoment(
  id: string,
  content: string,
  options?: {
    cardId?: string;
    roomId?: string;
    emotionalStateId?: string;
  }
): SavedMoment {
  return {
    id,
    content,
    cardId: options?.cardId,
    roomId: options?.roomId,
    emotionalStateId: options?.emotionalStateId,
    createdAt: new Date(),
  };
}

/**
 * Updates a saved moment's content (returns new immutable instance)
 */
export function updateSavedMomentContent(
  moment: SavedMoment,
  content: string
): SavedMoment {
  return {
    ...moment,
    content,
    updatedAt: new Date(),
  };
}
