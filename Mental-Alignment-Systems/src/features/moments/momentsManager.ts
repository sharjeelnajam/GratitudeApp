/**
 * Saved Moments Manager
 * 
 * Manages saved moments and intentions.
 * Quiet memory space - no metrics, no progress tracking.
 */

import {
  SavedMomentEntry,
  SavedIntentionEntry,
  MomentsCollection,
  MomentFilter,
  MomentSortOrder,
} from './types';
import { SavedMoment, Intention, createSavedMoment } from '@/domain';
import { ContentCard } from '@/services/content';

/**
 * Moments Manager
 * Handles saving and retrieving moments
 */
export class MomentsManager {
  private moments: SavedMomentEntry[] = [];
  private intentions: SavedIntentionEntry[] = [];

  /**
   * Saves a moment
   * Like adding a star to a constellation
   */
  saveMoment(
    content: string,
    options?: {
      cardId?: string;
      roomId?: string;
      emotionalStateId?: string;
      card?: ContentCard;
    }
  ): SavedMoment {
    const moment = createSavedMoment(
      `moment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      {
        cardId: options?.cardId,
        roomId: options?.roomId,
        emotionalStateId: options?.emotionalStateId,
      }
    );

    const entry: SavedMomentEntry = {
      moment,
      card: options?.card,
    };

    this.moments.push(entry);
    return moment;
  }

  /**
   * Saves an intention
   * Preserves an intention for quiet reflection
   */
  saveIntention(intention: Intention): void {
    const entry: SavedIntentionEntry = {
      intention,
      savedAt: new Date(),
    };

    this.intentions.push(entry);
  }

  /**
   * Gets all moments
   * Returns a quiet collection, no metrics
   */
  getAllMoments(filter?: MomentFilter, sortOrder: MomentSortOrder = MomentSortOrder.NEWEST_FIRST): SavedMomentEntry[] {
    let filtered = [...this.moments];

    // Apply filters
    if (filter) {
      if (filter.cardId) {
        filtered = filtered.filter(entry => entry.moment.cardId === filter.cardId);
      }

      if (filter.roomId) {
        filtered = filtered.filter(entry => entry.moment.roomId === filter.roomId);
      }

      if (filter.emotionalStateId) {
        filtered = filtered.filter(entry => entry.moment.emotionalStateId === filter.emotionalStateId);
      }

      if (filter.dateRange) {
        filtered = filtered.filter(entry => {
          const date = entry.moment.createdAt;
          return date >= filter.dateRange!.start && date <= filter.dateRange!.end;
        });
      }
    }

    // Sort
    if (sortOrder === MomentSortOrder.NEWEST_FIRST) {
      filtered.sort((a, b) => b.moment.createdAt.getTime() - a.moment.createdAt.getTime());
    } else {
      filtered.sort((a, b) => a.moment.createdAt.getTime() - b.moment.createdAt.getTime());
    }

    return filtered;
  }

  /**
   * Gets all intentions
   */
  getAllIntentions(): SavedIntentionEntry[] {
    return [...this.intentions].sort((a, b) => 
      b.savedAt.getTime() - a.savedAt.getTime()
    );
  }

  /**
   * Gets a moment by ID
   */
  getMomentById(momentId: string): SavedMomentEntry | null {
    return this.moments.find(entry => entry.moment.id === momentId) || null;
  }

  /**
   * Gets moments collection
   * Returns the full collection - like a constellation
   */
  getCollection(): MomentsCollection {
    return {
      moments: [...this.moments],
      intentions: [...this.intentions],
      lastUpdated: new Date(),
    };
  }

  /**
   * Updates a moment
   * Allows gentle editing of saved moments
   */
  updateMoment(momentId: string, content: string): boolean {
    const entry = this.moments.find(e => e.moment.id === momentId);
    if (!entry) {
      return false;
    }

    // Create updated moment (immutable)
    const updatedMoment: SavedMoment = {
      ...entry.moment,
      content,
      updatedAt: new Date(),
    };

    entry.moment = updatedMoment;
    return true;
  }

  /**
   * Removes a moment
   * Gentle removal - no pressure
   */
  removeMoment(momentId: string): boolean {
    const index = this.moments.findIndex(entry => entry.moment.id === momentId);
    if (index === -1) {
      return false;
    }

    this.moments.splice(index, 1);
    return true;
  }

  /**
   * Removes an intention
   */
  removeIntention(intentionId: string): boolean {
    const index = this.intentions.findIndex(entry => entry.intention.id === intentionId);
    if (index === -1) {
      return false;
    }

    this.intentions.splice(index, 1);
    return true;
  }

  /**
   * Gets moments for a specific card
   * Shows moments that were created from a particular card
   */
  getMomentsForCard(cardId: string): SavedMomentEntry[] {
    return this.moments
      .filter(entry => entry.moment.cardId === cardId)
      .sort((a, b) => b.moment.createdAt.getTime() - a.moment.createdAt.getTime());
  }

  /**
   * Gets moments for a specific room
   * Shows moments created in a particular room
   */
  getMomentsForRoom(roomId: string): SavedMomentEntry[] {
    return this.moments
      .filter(entry => entry.moment.roomId === roomId)
      .sort((a, b) => b.moment.createdAt.getTime() - a.moment.createdAt.getTime());
  }

  /**
   * Clears all moments
   * Quiet clearing - no pressure, no confirmation needed
   */
  clearAll(): void {
    this.moments = [];
    this.intentions = [];
  }
}

/**
 * Global moments manager instance
 * In a real app, this would be managed by a service or context
 */
let globalMomentsManager: MomentsManager | null = null;

/**
 * Gets or creates the global moments manager
 */
export function getMomentsManager(): MomentsManager {
  if (!globalMomentsManager) {
    globalMomentsManager = new MomentsManager();
  }
  return globalMomentsManager;
}

/**
 * Resets the global moments manager (for testing)
 */
export function resetMomentsManager(): void {
  globalMomentsManager = null;
}
