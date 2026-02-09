/**
 * Card Domain Model
 * 
 * Represents reflective content - prompts, reflections, or gentle guidance.
 * Designed to support presence and alignment, not instruction or fixing.
 * 
 * Rules:
 * - No advice-giving language
 * - No prescriptive content
 * - No "you should" language
 * - Focus on reflection and presence
 */

export interface Card {
  readonly id: string;
  readonly content: string; // The reflective prompt or content
  readonly type: CardType;
  readonly category?: string; // Optional category for organization
  readonly roomIds: readonly string[]; // Rooms where this card appears
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Types of reflective content
 */
export const CARD_TYPES = {
  PROMPT: 'prompt', // A question for reflection
  REFLECTION: 'reflection', // A thought or observation
  INVITATION: 'invitation', // An invitation to notice or be present
} as const;

export type CardType = typeof CARD_TYPES[keyof typeof CARD_TYPES];

/**
 * Creates a new Card
 */
export function createCard(
  id: string,
  content: string,
  type: CardType,
  options?: {
    category?: string;
    roomIds?: readonly string[];
    isActive?: boolean;
  }
): Card {
  const now = new Date();
  return {
    id,
    content,
    type,
    category: options?.category,
    roomIds: options?.roomIds || [],
    isActive: options?.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Updates a card (returns new immutable instance)
 */
export function updateCard(
  card: Card,
  updates: Partial<Pick<Card, 'content' | 'type' | 'category' | 'roomIds' | 'isActive'>>
): Card {
  return {
    ...card,
    ...updates,
    updatedAt: new Date(),
  };
}
