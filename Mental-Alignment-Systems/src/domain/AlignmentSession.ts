/**
 * AlignmentSession Domain Model
 * 
 * Represents a single alignment session.
 * Focuses on presence and alignment, not progress or performance.
 * 
 * Rules:
 * - No progress metrics
 * - No scoring
 * - No performance indicators
 * - Immutable
 */

export interface AlignmentSession {
  readonly id: string;
  readonly startedAt: Date;
  readonly completedAt?: Date; // Optional - sessions may be ongoing
  readonly emotionalState?: string; // Optional emotional state ID
  readonly intentionId?: string; // Optional intention for this session
  readonly roomId?: string; // Optional room where session occurred
  readonly notes?: string; // Optional personal notes
}

/**
 * Creates a new AlignmentSession
 */
export function createAlignmentSession(
  id: string,
  startedAt: Date = new Date(),
  options?: {
    emotionalStateId?: string;
    intentionId?: string;
    roomId?: string;
    notes?: string;
  }
): AlignmentSession {
  return {
    id,
    startedAt,
    emotionalState: options?.emotionalStateId,
    intentionId: options?.intentionId,
    roomId: options?.roomId,
    notes: options?.notes,
  };
}

/**
 * Completes an alignment session
 * Returns a new immutable session with completedAt set
 */
export function completeAlignmentSession(
  session: AlignmentSession,
  completedAt: Date = new Date()
): AlignmentSession {
  return {
    ...session,
    completedAt,
  };
}

/**
 * Updates session notes
 * Returns a new immutable session with updated notes
 */
export function updateSessionNotes(
  session: AlignmentSession,
  notes: string
): AlignmentSession {
  return {
    ...session,
    notes,
  };
}
