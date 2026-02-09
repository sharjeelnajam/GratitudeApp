/**
 * BreakoutRoomSession Domain Model
 * 
 * Represents a session within a breakout room - a focused space for reflection.
 * Breakout rooms provide a contained environment for specific types of presence work.
 * 
 * Rules:
 * - No progress tracking
 * - No completion metrics
 * - Focus on presence within the room
 */

export interface BreakoutRoomSession {
  readonly id: string;
  readonly roomId: string; // The breakout room where this session occurs
  readonly startedAt: Date;
  readonly endedAt?: Date; // Optional - sessions may be ongoing
  readonly currentCardId?: string; // Optional current card being reflected on
  readonly savedMomentIds: readonly string[]; // Moments created during this session
  readonly notes?: string; // Optional personal notes
}

/**
 * Creates a new BreakoutRoomSession
 */
export function createBreakoutRoomSession(
  id: string,
  roomId: string,
  startedAt: Date = new Date(),
  options?: {
    currentCardId?: string;
    savedMomentIds?: readonly string[];
    notes?: string;
  }
): BreakoutRoomSession {
  return {
    id,
    roomId,
    startedAt,
    currentCardId: options?.currentCardId,
    savedMomentIds: options?.savedMomentIds || [],
    notes: options?.notes,
  };
}

/**
 * Ends a breakout room session (returns new immutable instance)
 */
export function endBreakoutRoomSession(
  session: BreakoutRoomSession,
  endedAt: Date = new Date()
): BreakoutRoomSession {
  return {
    ...session,
    endedAt,
  };
}

/**
 * Updates the current card in a session (returns new immutable instance)
 */
export function updateCurrentCard(
  session: BreakoutRoomSession,
  cardId: string
): BreakoutRoomSession {
  return {
    ...session,
    currentCardId: cardId,
  };
}

/**
 * Adds a saved moment to the session (returns new immutable instance)
 */
export function addSavedMomentToSession(
  session: BreakoutRoomSession,
  momentId: string
): BreakoutRoomSession {
  return {
    ...session,
    savedMomentIds: [...session.savedMomentIds, momentId],
  };
}

/**
 * Updates session notes (returns new immutable instance)
 */
export function updateBreakoutRoomSessionNotes(
  session: BreakoutRoomSession,
  notes: string
): BreakoutRoomSession {
  return {
    ...session,
    notes,
  };
}
