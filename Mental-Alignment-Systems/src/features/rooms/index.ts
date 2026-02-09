/**
 * Rooms Feature
 * 
 * Feature module for Guided Alignment Rooms™.
 * Breakout rooms for shared alignment experiences.
 * 
 * Structure:
 * - components/ - Room session flow components
 * - types.ts - Room session types
 * - mockData.ts - Mock data for UI development
 * - index.ts - Public API exports
 */

// Types
export * from './types';
export type {
  RoomSessionState,
  Participant,
  RoomSession,
  SharingEntry,
  ClosingChoice,
} from './types';

// Room questions (reflection prompts by room)
export { getQuestionsForRoom, ROOM_QUESTIONS } from './roomQuestions';
export type { RoomType, QuestionSection, RoomQuestionsConfig } from './roomQuestions';

// Mock Data
export * from './mockData';
export { createMockRoomSession, MOCK_CARDS, MOCK_PARTICIPANTS } from './mockData';

// Components
export { RoomSessionFlow } from './components/RoomSessionFlow';
export { ArrivalPhase } from './components/ArrivalPhase';
export { BreathingPhase } from './components/BreathingPhase';
export { IntentionSettingPhase } from './components/IntentionSettingPhase';
export { CardSelectionPhase } from './components/CardSelectionPhase';
export { SharingPhase } from './components/SharingPhase';
export { ClosingPhase } from './components/ClosingPhase';

// Hooks
export { useLiveRoom } from './hooks/useLiveRoom';
export { useRoomSession } from './hooks/useRoomSession';
