/**
 * Guided Alignment Rooms Types
 * 
 * Types for breakout room sessions.
 * Maximum 7 people, intentional, non-clinical.
 */

import { ContentCard } from '@/services/content';
import { Intention } from '@/domain';

/**
 * Room Session State
 * Tracks the state of a room session
 */
export enum RoomSessionState {
  BREATHING_ACTIVITY = 'breathing_activity', // 32s breathe/hold circular activity
  BODY_AWARENESS_AUDIO = 'body_awareness_audio', // 10 min Body Awareness message player
  RELAXATION_CARDS = 'relaxation_cards', // 5 flip cards with relaxation messages
  ARRIVAL = 'arrival', // Arrival & Stillness
  REFLECTION_QUESTIONS = 'reflection_questions', // Room reflection questions
  BREATHING = 'breathing', // Deep Focused Breathing
  INTENTION_SETTING = 'intention_setting', // Private Intention Setting
  CARD_SELECTION = 'card_selection', // Individual Card Selection
  SHARING = 'sharing', // Optional Sharing
  CLOSING = 'closing', // Closing Choice
}

/**
 * Participant
 * Represents a participant in the room
 */
export interface Participant {
  id: string;
  name: string; // Display name (not real name for privacy)
  isReady: boolean; // Whether they're ready for next phase
  hasSelectedCard: boolean; // Whether they've selected a card
  selectedCardId?: string; // Their selected card
  hasShared: boolean; // Whether they've shared (optional)
}

/**
 * Room Session
 * Complete room session state
 */
export interface RoomSession {
  id: string;
  roomType: 'fireplace' | 'ocean' | 'forest' | 'nightSky';
  state: RoomSessionState;
  participants: Participant[];
  cards: ContentCard[]; // Available cards for selection
  shuffledCards: ContentCard[]; // Cards being shuffled
  currentShufflerIndex: number; // Who is currently shuffling (0-6)
  startedAt: Date;
  breathingStartTime?: Date; // When breathing started
  intentionDeadline?: Date; // When intention setting ends
}

/**
 * Sharing Entry
 * Optional sharing from a participant
 */
export interface SharingEntry {
  participantId: string;
  participantName: string;
  content: string; // What they noticed (not advice)
  sharedAt: Date;
}

/**
 * Closing Choice
 * User's choice for closing
 */
export enum ClosingChoice {
  INSPIRATIONAL_READING = 'inspirational_reading',
  INSPIRED_MEDICINE_MESSAGE = 'inspired_medicine_message',
}
