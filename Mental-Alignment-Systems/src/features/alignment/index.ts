/**
 * Alignment Feature
 * 
 * Feature module for mental alignment functionality.
 * 
 * Structure:
 * - types.ts - Type definitions
 * - stateMachine.ts - State machine logic
 * - sessionManager.ts - Session management
 * - components/ - Feature-specific UI components (to be added)
 * - hooks/ - Feature-specific hooks (to be added)
 * - services/ - Feature-specific services (to be added)
 */

// Types
export * from './types';
export type {
  AlignmentPhase,
  PhaseStatus,
  AlignmentSessionState,
  PhaseConfig,
  TransitionResult,
} from './types';

// State Machine
export * from './stateMachine';
export {
  PHASE_CONFIGS,
  PHASE_SEQUENCE,
  createAlignmentSessionState,
  getNextPhase,
  getPreviousPhase,
  canTransitionTo,
  completeCurrentPhase,
  transitionToNextPhase,
  skipOptionalSharing,
  isSessionComplete,
  getCurrentPhaseConfig,
  getPhaseConfig,
} from './stateMachine';

// Session Manager
export * from './sessionManager';
export { AlignmentSessionManager } from './sessionManager';
