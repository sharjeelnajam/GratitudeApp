/**
 * GuidedRoom Domain Model
 * 
 * Represents a room that provides gentle guidance and reflection.
 * Not therapeutic - simply a space for presence and alignment.
 * 
 * Rules:
 * - No therapy simulation
 * - No clinical language
 * - Focus on presence and reflection
 */

export interface GuidedRoom {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly theme: RoomTheme;
  readonly audioUrl?: string; // Optional ambient audio
  readonly cards: readonly string[]; // Card IDs available in this room
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Room theme configuration
 * Defines the visual and experiential atmosphere
 */
export interface RoomTheme {
  readonly colorPalette: {
    readonly primary: string;
    readonly secondary: string;
    readonly background: string;
  };
  readonly atmosphere: string; // Descriptive word (e.g., "calm", "reverent", "quiet")
}

/**
 * Creates a new GuidedRoom
 */
export function createGuidedRoom(
  id: string,
  name: string,
  description: string,
  theme: RoomTheme,
  options?: {
    audioUrl?: string;
    cards?: readonly string[];
    isActive?: boolean;
  }
): GuidedRoom {
  const now = new Date();
  return {
    id,
    name,
    description,
    theme,
    audioUrl: options?.audioUrl,
    cards: options?.cards || [],
    isActive: options?.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Updates a room (returns new immutable instance)
 */
export function updateGuidedRoom(
  room: GuidedRoom,
  updates: Partial<Pick<GuidedRoom, 'name' | 'description' | 'theme' | 'audioUrl' | 'cards' | 'isActive'>>
): GuidedRoom {
  return {
    ...room,
    ...updates,
    updatedAt: new Date(),
  };
}
