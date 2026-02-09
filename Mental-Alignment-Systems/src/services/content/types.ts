/**
 * Content Service Types
 * 
 * Types for the reflective card content engine.
 * No user analysis, no history tracking.
 */

import { Card, CardType } from '@/domain';

/**
 * Content Card
 * Extended card with content service metadata
 */
export interface ContentCard extends Card {
  readonly audioUrl?: string; // Future-ready: audio content URL
  readonly duration?: number; // Optional duration for audio cards
  readonly tags?: readonly string[]; // Optional tags for organization (not personalization)
}

/**
 * Card Filter
 * Simple filtering without personalization
 */
export interface CardFilter {
  type?: CardType;
  category?: string;
  tags?: readonly string[];
  roomId?: string;
}

/**
 * Card Selection Strategy
 * How to select cards (no personalization)
 */
export enum CardSelectionStrategy {
  RANDOM = 'random', // Random selection
  SEQUENTIAL = 'sequential', // Sequential order
  CATEGORY = 'category', // By category
}

/**
 * Content Service Configuration
 */
export interface ContentServiceConfig {
  offlineEnabled: boolean;
  contentProtectionEnabled: boolean;
  defaultStrategy: CardSelectionStrategy;
}

/**
 * Card Delivery Result
 */
export interface CardDeliveryResult {
  card: ContentCard;
  success: boolean;
  fromCache?: boolean;
  error?: string;
}
