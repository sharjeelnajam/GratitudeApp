/**
 * Alignment Session State Machine
 * 
 * Deterministic state machine for alignment session flow.
 * No skipping phases (except optional sharing).
 * Calm, paced transitions.
 */

import {
  AlignmentPhase,
  PhaseStatus,
  AlignmentSessionState,
  PhaseConfig,
  TransitionResult,
} from './types';
import { AlignmentSession, createAlignmentSession } from '@/domain';

/**
 * Phase Configuration
 * Defines the sequence and properties of each phase
 */
export const PHASE_CONFIGS: Record<AlignmentPhase, PhaseConfig> = {
  [AlignmentPhase.ARRIVAL_AND_STILLNESS]: {
    phase: AlignmentPhase.ARRIVAL_AND_STILLNESS,
    name: 'Arrival & Stillness',
    description: 'A moment to arrive and be still',
    duration: 60000, // 1 minute - calm pacing
    isOptional: false,
    canProceed: true, // User can proceed when ready
  },
  [AlignmentPhase.GUIDED_BREATHING]: {
    phase: AlignmentPhase.GUIDED_BREATHING,
    name: 'Guided Breathing',
    description: 'Gentle guidance for presence',
    duration: 120000, // 2 minutes - calm pacing
    isOptional: false,
    canProceed: true,
  },
  [AlignmentPhase.PRIVATE_INTENTION]: {
    phase: AlignmentPhase.PRIVATE_INTENTION,
    name: 'Private Intention',
    description: 'Set an intention for this session',
    isOptional: false,
    canProceed: true,
  },
  [AlignmentPhase.CARD_REFLECTION]: {
    phase: AlignmentPhase.CARD_REFLECTION,
    name: 'Card Reflection',
    description: 'Reflect on a card',
    isOptional: false,
    canProceed: true,
  },
  [AlignmentPhase.OPTIONAL_SHARING]: {
    phase: AlignmentPhase.OPTIONAL_SHARING,
    name: 'Optional Sharing',
    description: 'Optionally share your reflection',
    isOptional: true,
    canProceed: true,
  },
  [AlignmentPhase.CLOSING]: {
    phase: AlignmentPhase.CLOSING,
    name: 'Closing',
    description: 'A gentle closing',
    duration: 30000, // 30 seconds
    isOptional: false,
    canProceed: false, // Auto-completes
  },
};

/**
 * Phase Sequence
 * Defines the order of phases (deterministic)
 */
export const PHASE_SEQUENCE: AlignmentPhase[] = [
  AlignmentPhase.ARRIVAL_AND_STILLNESS,
  AlignmentPhase.GUIDED_BREATHING,
  AlignmentPhase.PRIVATE_INTENTION,
  AlignmentPhase.CARD_REFLECTION,
  AlignmentPhase.OPTIONAL_SHARING,
  AlignmentPhase.CLOSING,
];

/**
 * Creates initial alignment session state
 */
export function createAlignmentSessionState(
  sessionId: string,
  options?: {
    emotionalStateId?: string;
    roomId?: string;
  }
): AlignmentSessionState {
  const session = createAlignmentSession(sessionId, new Date(), {
    emotionalStateId: options?.emotionalStateId,
    roomId: options?.roomId,
  });

  const now = new Date();

  // Initialize all phases as pending
  const phaseStatuses: Record<AlignmentPhase, PhaseStatus> = {
    [AlignmentPhase.ARRIVAL_AND_STILLNESS]: PhaseStatus.IN_PROGRESS, // First phase starts immediately
    [AlignmentPhase.GUIDED_BREATHING]: PhaseStatus.PENDING,
    [AlignmentPhase.PRIVATE_INTENTION]: PhaseStatus.PENDING,
    [AlignmentPhase.CARD_REFLECTION]: PhaseStatus.PENDING,
    [AlignmentPhase.OPTIONAL_SHARING]: PhaseStatus.PENDING,
    [AlignmentPhase.CLOSING]: PhaseStatus.PENDING,
  };

  return {
    session,
    currentPhase: AlignmentPhase.ARRIVAL_AND_STILLNESS,
    phaseStatuses,
    startedAt: now,
    updatedAt: now,
  };
}

/**
 * Gets the next phase in sequence
 */
export function getNextPhase(currentPhase: AlignmentPhase): AlignmentPhase | null {
  const currentIndex = PHASE_SEQUENCE.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex === PHASE_SEQUENCE.length - 1) {
    return null; // No next phase
  }
  return PHASE_SEQUENCE[currentIndex + 1];
}

/**
 * Gets the previous phase in sequence
 */
export function getPreviousPhase(currentPhase: AlignmentPhase): AlignmentPhase | null {
  const currentIndex = PHASE_SEQUENCE.indexOf(currentPhase);
  if (currentIndex <= 0) {
    return null; // No previous phase
  }
  return PHASE_SEQUENCE[currentIndex - 1];
}

/**
 * Checks if a phase can be transitioned to
 */
export function canTransitionTo(
  state: AlignmentSessionState,
  targetPhase: AlignmentPhase
): boolean {
  const currentIndex = PHASE_SEQUENCE.indexOf(state.currentPhase);
  const targetIndex = PHASE_SEQUENCE.indexOf(targetPhase);

  // Cannot transition to invalid phase
  if (targetIndex === -1) {
    return false;
  }

  // Can only move forward (no skipping backward)
  if (targetIndex < currentIndex) {
    return false;
  }

  // Can only move to next phase (no skipping forward)
  // Exception: optional sharing can be skipped
  if (targetIndex > currentIndex + 1) {
    // Check if we're skipping optional sharing
    if (
      targetPhase === AlignmentPhase.CLOSING &&
      state.currentPhase === AlignmentPhase.CARD_REFLECTION
    ) {
      // Can skip optional sharing to go to closing
      return true;
    }
    return false;
  }

  // Current phase must be completed or in progress
  const currentStatus = state.phaseStatuses[state.currentPhase];
  if (currentStatus !== PhaseStatus.IN_PROGRESS && currentStatus !== PhaseStatus.COMPLETED) {
    return false;
  }

  return true;
}

/**
 * Completes the current phase
 */
export function completeCurrentPhase(
  state: AlignmentSessionState
): AlignmentSessionState {
  const updatedPhaseStatuses = {
    ...state.phaseStatuses,
    [state.currentPhase]: PhaseStatus.COMPLETED,
  };

  return {
    ...state,
    phaseStatuses: updatedPhaseStatuses,
    updatedAt: new Date(),
  };
}

/**
 * Transitions to the next phase
 * Deterministic - only moves forward one phase at a time
 */
export function transitionToNextPhase(
  state: AlignmentSessionState
): TransitionResult {
  // Complete current phase first
  const completedState = completeCurrentPhase(state);

  // Get next phase
  const nextPhase = getNextPhase(completedState.currentPhase);

  if (!nextPhase) {
    return {
      success: false,
      error: 'NO_NEXT_PHASE',
      message: 'Already at the final phase',
    };
  }

  // Check if transition is allowed
  if (!canTransitionTo(completedState, nextPhase)) {
    return {
      success: false,
      error: 'TRANSITION_NOT_ALLOWED',
      message: 'Cannot transition to next phase',
    };
  }

  // Update phase statuses
  const updatedPhaseStatuses = {
    ...completedState.phaseStatuses,
    [nextPhase]: PhaseStatus.IN_PROGRESS,
  };

  const newState: AlignmentSessionState = {
    ...completedState,
    currentPhase: nextPhase,
    phaseStatuses: updatedPhaseStatuses,
    updatedAt: new Date(),
  };

  return {
    success: true,
    newState,
    message: `Transitioned to ${PHASE_CONFIGS[nextPhase].name}`,
  };
}

/**
 * Skips optional sharing phase
 * Only allowed if current phase is Card Reflection
 */
export function skipOptionalSharing(
  state: AlignmentSessionState
): TransitionResult {
  if (state.currentPhase !== AlignmentPhase.CARD_REFLECTION) {
    return {
      success: false,
      error: 'CANNOT_SKIP',
      message: 'Can only skip optional sharing from Card Reflection phase',
    };
  }

  // Mark optional sharing as skipped
  const updatedPhaseStatuses = {
    ...state.phaseStatuses,
    [AlignmentPhase.CARD_REFLECTION]: PhaseStatus.COMPLETED,
    [AlignmentPhase.OPTIONAL_SHARING]: PhaseStatus.SKIPPED,
    [AlignmentPhase.CLOSING]: PhaseStatus.IN_PROGRESS,
  };

  const newState: AlignmentSessionState = {
    ...state,
    currentPhase: AlignmentPhase.CLOSING,
    phaseStatuses: updatedPhaseStatuses,
    updatedAt: new Date(),
  };

  return {
    success: true,
    newState,
    message: 'Skipped optional sharing, moved to closing',
  };
}

/**
 * Checks if session is complete
 */
export function isSessionComplete(state: AlignmentSessionState): boolean {
  return state.currentPhase === AlignmentPhase.CLOSING &&
    state.phaseStatuses[AlignmentPhase.CLOSING] === PhaseStatus.COMPLETED;
}

/**
 * Gets the current phase configuration
 */
export function getCurrentPhaseConfig(
  state: AlignmentSessionState
): PhaseConfig {
  return PHASE_CONFIGS[state.currentPhase];
}

/**
 * Gets phase configuration by phase
 */
export function getPhaseConfig(phase: AlignmentPhase): PhaseConfig {
  return PHASE_CONFIGS[phase];
}
