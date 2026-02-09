/**
 * Alignment Session Types
 * 
 * Type definitions for the alignment session state machine.
 */

import { AlignmentSession, Intention, SavedMoment } from '@/domain';

/**
 * Alignment Session Phases
 * 
 * Deterministic sequence - phases cannot be skipped.
 */
export enum AlignmentPhase {
  ARRIVAL_AND_STILLNESS = 'arrival_and_stillness',
  GUIDED_BREATHING = 'guided_breathing',
  PRIVATE_INTENTION = 'private_intention',
  CARD_REFLECTION = 'card_reflection',
  OPTIONAL_SHARING = 'optional_sharing',
  CLOSING = 'closing',
}

/**
 * Phase Status
 * Tracks the state of each phase
 */
export enum PhaseStatus {
  PENDING = 'pending',     // Not yet started
  IN_PROGRESS = 'in_progress', // Currently active
  COMPLETED = 'completed', // Finished
  SKIPPED = 'skipped',     // Skipped (only for optional phases)
}

/**
 * Alignment Session State
 * Complete state of an alignment session
 */
export interface AlignmentSessionState {
  session: AlignmentSession;
  currentPhase: AlignmentPhase;
  phaseStatuses: Record<AlignmentPhase, PhaseStatus>;
  intention?: Intention;
  currentCardId?: string;
  savedMoment?: SavedMoment;
  startedAt: Date;
  updatedAt: Date;
}

/**
 * Phase Configuration
 * Defines timing and behavior for each phase
 */
export interface PhaseConfig {
  phase: AlignmentPhase;
  name: string;
  description: string;
  duration?: number; // Optional duration in milliseconds (for calm pacing)
  isOptional: boolean; // Whether this phase can be skipped
  canProceed: boolean; // Whether user can manually proceed
}

/**
 * Transition Result
 * Result of attempting a phase transition
 */
export interface TransitionResult {
  success: boolean;
  newState?: AlignmentSessionState;
  error?: string;
  message?: string;
}
