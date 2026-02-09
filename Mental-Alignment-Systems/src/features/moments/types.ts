/**
 * Saved Moments Types
 * 
 * Types for the quiet memory space.
 * No streaks, no counts, no progress bars.
 */

import { SavedMoment, Intention } from '@/domain';
import { ContentCard } from '@/services/content';

/**
 * Saved Moment Entry
 * A moment that has been saved - like a star in a constellation
 */
export interface SavedMomentEntry {
  moment: SavedMoment;
  card?: ContentCard; // The card that prompted this moment (if available)
}

/**
 * Saved Intention Entry
 * An intention that has been saved
 */
export interface SavedIntentionEntry {
  intention: Intention;
  savedAt: Date; // When it was saved (not when created)
}

/**
 * Moments Collection
 * A quiet collection of saved moments
 * No metrics, just presence
 */
export interface MomentsCollection {
  moments: readonly SavedMomentEntry[];
  intentions: readonly SavedIntentionEntry[];
  lastUpdated: Date;
}

/**
 * Moment Filter
 * Simple filtering for moments (no analytics)
 */
export interface MomentFilter {
  cardId?: string;
  roomId?: string;
  emotionalStateId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Sort Order
 * How to sort moments (simple, not performance-based)
 */
export enum MomentSortOrder {
  NEWEST_FIRST = 'newest_first',
  OLDEST_FIRST = 'oldest_first',
  // No "most viewed" or "most liked" - just simple chronological
}
