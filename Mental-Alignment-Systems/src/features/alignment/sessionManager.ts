/**
 * Alignment Session Manager
 * 
 * Manages alignment session state and transitions.
 * Provides high-level API for session operations.
 */

import {
  AlignmentSessionState,
  AlignmentPhase,
  TransitionResult,
} from './types';
import {
  createAlignmentSessionState,
  transitionToNextPhase,
  skipOptionalSharing,
  isSessionComplete,
  getCurrentPhaseConfig,
  canTransitionTo,
  getNextPhase,
} from './stateMachine';
import { Intention, SavedMoment, createIntention, createSavedMoment } from '@/domain';

/**
 * Session Manager
 * Handles session lifecycle and state updates
 */
export class AlignmentSessionManager {
  private state: AlignmentSessionState;

  constructor(state: AlignmentSessionState) {
    this.state = state;
  }

  /**
   * Creates a new session manager with a new session
   */
  static create(
    sessionId: string,
    options?: {
      emotionalStateId?: string;
      roomId?: string;
    }
  ): AlignmentSessionManager {
    const initialState = createAlignmentSessionState(sessionId, options);
    return new AlignmentSessionManager(initialState);
  }

  /**
   * Gets current state
   */
  getState(): AlignmentSessionState {
    return { ...this.state }; // Return copy to prevent mutation
  }

  /**
   * Gets current phase
   */
  getCurrentPhase(): AlignmentPhase {
    return this.state.currentPhase;
  }

  /**
   * Gets current phase configuration
   */
  getCurrentPhaseConfig() {
    return getCurrentPhaseConfig(this.state);
  }

  /**
   * Checks if session is complete
   */
  isComplete(): boolean {
    return isSessionComplete(this.state);
  }

  /**
   * Proceeds to next phase
   * Deterministic - only moves forward one phase
   */
  proceedToNext(): TransitionResult {
    const result = transitionToNextPhase(this.state);
    if (result.success && result.newState) {
      this.state = result.newState;
    }
    return result;
  }

  /**
   * Skips optional sharing (if allowed)
   */
  skipSharing(): TransitionResult {
    const result = skipOptionalSharing(this.state);
    if (result.success && result.newState) {
      this.state = result.newState;
    }
    return result;
  }

  /**
   * Sets intention for the session
   */
  setIntention(intentionText: string): void {
    const intention = createIntention(
      `intention-${Date.now()}`,
      intentionText,
      {
        isActive: true,
        roomId: this.state.session.roomId,
      }
    );

    this.state = {
      ...this.state,
      intention,
      updatedAt: new Date(),
    };
  }

  /**
   * Sets current card for reflection
   */
  setCurrentCard(cardId: string): void {
    this.state = {
      ...this.state,
      currentCardId: cardId,
      updatedAt: new Date(),
    };
  }

  /**
   * Saves a moment from reflection
   */
  saveMoment(content: string): void {
    const moment = createSavedMoment(
      `moment-${Date.now()}`,
      content,
      {
        cardId: this.state.currentCardId,
        roomId: this.state.session.roomId,
        emotionalStateId: this.state.session.emotionalState,
      }
    );

    this.state = {
      ...this.state,
      savedMoment: moment,
      updatedAt: new Date(),
    };
  }

  /**
   * Completes the session
   */
  completeSession(): void {
    // Mark closing phase as completed
    const updatedPhaseStatuses = {
      ...this.state.phaseStatuses,
      [AlignmentPhase.CLOSING]: PhaseStatus.COMPLETED,
    };

    this.state = {
      ...this.state,
      phaseStatuses: updatedPhaseStatuses,
      session: {
        ...this.state.session,
        completedAt: new Date(),
      },
      updatedAt: new Date(),
    };
  }

  /**
   * Checks if can proceed to next phase
   */
  canProceed(): boolean {
    const config = getCurrentPhaseConfig(this.state);
    if (!config.canProceed) {
      return false;
    }

    const nextPhase = this.getNextPhase();
    if (!nextPhase) {
      return false;
    }

    return canTransitionTo(this.state, nextPhase);
  }

  /**
   * Gets next phase (if any)
   */
  getNextPhase(): AlignmentPhase | null {
    return getNextPhase(this.state.currentPhase);
  }
}
