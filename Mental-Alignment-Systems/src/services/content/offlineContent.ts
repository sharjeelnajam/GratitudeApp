/**
 * Offline Content Fallback
 * 
 * Provides offline fallback cards when network is unavailable.
 * Ensures content is always available.
 */

import { ContentCard } from './types';
import { CardType } from '@/domain';

/**
 * Offline Card Library
 * Curated set of cards available offline
 * These are protected, authored content
 */
const OFFLINE_CARDS: readonly ContentCard[] = [
  // Arrival & Stillness cards
  {
    id: 'offline-arrival-1',
    content: 'Take a moment to arrive. Notice where you are, right now.',
    type: 'invitation' as CardType,
    category: 'arrival',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'offline-arrival-2',
    content: 'Allow yourself to be present, just as you are.',
    type: 'invitation' as CardType,
    category: 'arrival',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Gratitude cards
  {
    id: 'offline-gratitude-1',
    content: 'Notice what you feel grateful for in this moment.',
    type: 'prompt' as CardType,
    category: 'gratitude',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'offline-gratitude-2',
    content: 'What brings you a sense of appreciation right now?',
    type: 'prompt' as CardType,
    category: 'gratitude',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'offline-gratitude-3',
    content: 'Reflect on a moment of gratitude from today.',
    type: 'invitation' as CardType,
    category: 'gratitude',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Presence cards
  {
    id: 'offline-presence-1',
    content: 'Be present with what is, without needing to change anything.',
    type: 'reflection' as CardType,
    category: 'presence',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'offline-presence-2',
    content: 'Notice your breath. Allow it to be as it is.',
    type: 'invitation' as CardType,
    category: 'presence',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // Alignment cards
  {
    id: 'offline-alignment-1',
    content: 'What does alignment feel like for you in this moment?',
    type: 'prompt' as CardType,
    category: 'alignment',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'offline-alignment-2',
    content: 'Notice what feels aligned within you right now.',
    type: 'invitation' as CardType,
    category: 'alignment',
    roomIds: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
] as const;

/**
 * Gets offline cards
 */
export function getOfflineCards(): readonly ContentCard[] {
  return OFFLINE_CARDS;
}

/**
 * Gets offline card by ID
 */
export function getOfflineCardById(id: string): ContentCard | null {
  return OFFLINE_CARDS.find(card => card.id === id) || null;
}

/**
 * Gets offline cards by category
 */
export function getOfflineCardsByCategory(category: string): readonly ContentCard[] {
  return OFFLINE_CARDS.filter(card => card.category === category);
}

/**
 * Gets random offline card
 */
export function getRandomOfflineCard(): ContentCard {
  const cards = OFFLINE_CARDS;
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}
