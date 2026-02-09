/**
 * Reflective Card Engine
 * 
 * Delivers reflective cards without analyzing users or relying on history.
 * Simple, respectful content delivery.
 */

import { ContentCard, CardFilter, CardSelectionStrategy, CardDeliveryResult } from './types';
import { CardType } from '@/domain';
import { getOfflineCards, getRandomOfflineCard, getOfflineCardById } from './offlineContent';
import { validateContentIntegrity, isContentProtected } from './contentProtection';

/**
 * Card Engine Configuration
 */
export interface CardEngineConfig {
  offlineEnabled: boolean;
  contentProtectionEnabled: boolean;
  defaultStrategy: CardSelectionStrategy;
}

const DEFAULT_CONFIG: CardEngineConfig = {
  offlineEnabled: true,
  contentProtectionEnabled: true,
  defaultStrategy: CardSelectionStrategy.RANDOM,
};

/**
 * Card Engine
 * Delivers cards without personalization or history tracking
 */
export class CardEngine {
  private config: CardEngineConfig;
  private offlineCards: readonly ContentCard[];
  private cardIndex: number = 0; // For sequential strategy

  constructor(config: Partial<CardEngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.offlineCards = getOfflineCards();
  }

  /**
   * Gets a card based on filter and strategy
   * No user analysis, no history tracking
   */
  async getCard(filter?: CardFilter): Promise<CardDeliveryResult> {
    try {
      // Always validate content integrity
      if (this.config.contentProtectionEnabled) {
        // Validation happens during card selection
      }

      // Get cards based on filter
      let availableCards = this.getAvailableCards(filter);

      if (availableCards.length === 0) {
        // Fallback to offline cards if no matches
        availableCards = Array.from(this.offlineCards);
      }

      if (availableCards.length === 0) {
        return {
          card: this.getFallbackCard(),
          success: false,
          error: 'No cards available',
        };
      }

      // Select card based on strategy
      const selectedCard = this.selectCard(availableCards, filter);

      // Validate content integrity
      if (this.config.contentProtectionEnabled) {
        const validation = validateContentIntegrity(selectedCard);
        if (!validation.isValid) {
          // Fallback to a safe card
          return {
            card: this.getFallbackCard(),
            success: false,
            error: validation.error || 'Content validation failed',
          };
        }
      }

      return {
        card: selectedCard,
        success: true,
        fromCache: true, // Always from offline cache for now
      };
    } catch (error) {
      return {
        card: this.getFallbackCard(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Gets a card by ID
   */
  async getCardById(cardId: string): Promise<CardDeliveryResult> {
    try {
      // Try offline cards first
      const offlineCard = getOfflineCardById(cardId);
      if (offlineCard) {
        // Validate if protection is enabled
        if (this.config.contentProtectionEnabled) {
          const validation = validateContentIntegrity(offlineCard);
          if (!validation.isValid) {
            return {
              card: this.getFallbackCard(),
              success: false,
              error: validation.error || 'Content validation failed',
            };
          }
        }

        return {
          card: offlineCard,
          success: true,
          fromCache: true,
        };
      }

      // Card not found
      return {
        card: this.getFallbackCard(),
        success: false,
        error: 'Card not found',
      };
    } catch (error) {
      return {
        card: this.getFallbackCard(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Gets available cards based on filter
   */
  private getAvailableCards(filter?: CardFilter): ContentCard[] {
    let cards = Array.from(this.offlineCards);

    if (!filter) {
      return cards;
    }

    // Filter by type
    if (filter.type) {
      cards = cards.filter(card => card.type === filter.type);
    }

    // Filter by category
    if (filter.category) {
      cards = cards.filter(card => card.category === filter.category);
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      cards = cards.filter(card =>
        card.tags?.some(tag => filter.tags!.includes(tag))
      );
    }

    // Filter by room
    if (filter.roomId) {
      cards = cards.filter(card =>
        card.roomIds.length === 0 || card.roomIds.includes(filter.roomId!)
      );
    }

    // Only return active cards
    return cards.filter(card => card.isActive);
  }

  /**
   * Selects a card based on strategy
   */
  private selectCard(
    cards: ContentCard[],
    filter?: CardFilter
  ): ContentCard {
    const strategy = filter?.roomId
      ? CardSelectionStrategy.RANDOM // Default to random for room-specific
      : this.config.defaultStrategy;

    switch (strategy) {
      case CardSelectionStrategy.SEQUENTIAL:
        const card = cards[this.cardIndex % cards.length];
        this.cardIndex = (this.cardIndex + 1) % cards.length;
        return card;

      case CardSelectionStrategy.CATEGORY:
        // Group by category and select from largest category
        const categoryGroups = cards.reduce((acc, card) => {
          const cat = card.category || 'uncategorized';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(card);
          return acc;
        }, {} as Record<string, ContentCard[]>);
        const largestCategory = Object.keys(categoryGroups).reduce((a, b) =>
          categoryGroups[a].length > categoryGroups[b].length ? a : b
        );
        const categoryCards = categoryGroups[largestCategory];
        return categoryCards[Math.floor(Math.random() * categoryCards.length)];

      case CardSelectionStrategy.RANDOM:
      default:
        return cards[Math.floor(Math.random() * cards.length)];
    }
  }

  /**
   * Gets a fallback card (always available)
   */
  private getFallbackCard(): ContentCard {
    return getRandomOfflineCard();
  }

  /**
   * Checks if offline content is available
   */
  isOfflineAvailable(): boolean {
    return this.offlineCards.length > 0;
  }

  /**
   * Gets card count
   */
  getCardCount(filter?: CardFilter): number {
    return this.getAvailableCards(filter).length;
  }
}
