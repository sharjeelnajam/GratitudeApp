/**
 * Mock Data for Guided Alignment Rooms
 * 
 * Static mock data for UI development.
 */

import { ContentCard } from '@/services/content';
import { CardType } from '@/domain';
import { Participant, RoomSession } from './types';

/**
 * Mock Cards
 * Sample cards for room sessions
 */
export const MOCK_CARDS: ContentCard[] = [
  {
    id: 'card-1',
    content: 'Notice what you feel grateful for in this moment.',
    type: 'prompt' as CardType,
    category: 'gratitude',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'card-2',
    content: 'What brings you a sense of peace right now?',
    type: 'prompt' as CardType,
    category: 'presence',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'card-3',
    content: 'Allow yourself to be present, just as you are.',
    type: 'invitation' as CardType,
    category: 'presence',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'card-4',
    content: 'What does alignment feel like for you in this moment?',
    type: 'prompt' as CardType,
    category: 'alignment',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'card-5',
    content: 'Be present with what is, without needing to change anything.',
    type: 'reflection' as CardType,
    category: 'presence',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'card-6',
    content: 'Notice your breath. Allow it to be as it is.',
    type: 'invitation' as CardType,
    category: 'presence',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'card-7',
    content: 'Reflect on a moment of gratitude from today.',
    type: 'invitation' as CardType,
    category: 'gratitude',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

/**
 * Mock Participants
 * Sample participants for room sessions
 */
export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'participant-1',
    name: 'You',
    isReady: false,
    hasSelectedCard: false,
    hasShared: false,
  },
  {
    id: 'participant-2',
    name: 'Guest 1',
    isReady: true,
    hasSelectedCard: true,
    selectedCardId: 'card-2',
    hasShared: false,
  },
  {
    id: 'participant-3',
    name: 'Guest 2',
    isReady: true,
    hasSelectedCard: false,
    hasShared: false,
  },
];

/**
 * Creates mock room session
 */
export function createMockRoomSession(
  roomType: 'fireplace' | 'ocean' | 'forest' | 'nightSky',
  state: RoomSession['state'] = 'arrival'
): RoomSession {
  return {
    id: `session-${Date.now()}`,
    roomType,
    state,
    participants: MOCK_PARTICIPANTS,
    cards: MOCK_CARDS,
    shuffledCards: [],
    currentShufflerIndex: 0,
    startedAt: new Date(),
  };
}
