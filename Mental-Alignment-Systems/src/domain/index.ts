/**
 * Domain Models
 * 
 * Core business logic and mental alignment models.
 * These represent the domain concepts, not UI or data layer concerns.
 * 
 * Rules:
 * - No React or UI imports
 * - No medical or clinical terminology
 * - No progress metrics or scoring
 * - Immutable where possible
 * - Single responsibility per model
 */

// Base entity interface
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

// Domain models
export * from './EmotionalState';
export * from './AlignmentSession';
export * from './GuidedRoom';
export * from './Card';
export * from './Intention';
export * from './SavedMoment';
export * from './BreakoutRoomSession';

// Re-export types for convenience
export type {
  EmotionalState,
  EmotionalStateLabel,
} from './EmotionalState';

export type {
  AlignmentSession,
} from './AlignmentSession';

export type {
  GuidedRoom,
  RoomTheme,
} from './GuidedRoom';

export type {
  Card,
  CardType,
} from './Card';

export type {
  Intention,
} from './Intention';

export type {
  SavedMoment,
} from './SavedMoment';

export type {
  BreakoutRoomSession,
} from './BreakoutRoomSession';
