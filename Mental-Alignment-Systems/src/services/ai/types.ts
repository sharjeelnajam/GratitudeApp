/**
 * AI Service Types
 * 
 * Interface definitions for AI alignment service.
 * NO API keys, NO direct provider SDKs, NO chatbot behavior.
 */

import { ContentCard } from '@/services/content';
import { CardType } from '@/domain';

/**
 * Content Selection Request
 * Request for AI to select appropriate content
 */
export interface ContentSelectionRequest {
  context?: {
    roomId?: string;
    currentPhase?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  availableCards: readonly ContentCard[];
}

/**
 * Content Selection Result
 * AI-selected content with reasoning
 */
export interface ContentSelectionResult {
  selectedCard: ContentCard;
  reasoning: string; // Simple explanation (not diagnostic)
  confidence: number; // 0-1 confidence score
}

/**
 * Tone Suggestion
 * Suggested tone for content delivery
 */
export enum ToneSuggestion {
  CALM = 'calm',
  GENTLE = 'gentle',
  QUIET = 'quiet',
  REVERENT = 'reverent',
  STILL = 'still',
  PRESENT = 'present',
}

/**
 * Tone Suggestion Request
 */
export interface ToneSuggestionRequest {
  context?: {
    roomId?: string;
    timeOfDay?: string;
    sessionDuration?: number; // milliseconds
  };
}

/**
 * Tone Suggestion Result
 */
export interface ToneSuggestionResult {
  tone: ToneSuggestion;
  reasoning: string; // Simple explanation
}

/**
 * Modality Type
 * Content delivery modality
 */
export enum ModalityType {
  TEXT = 'text',
  AUDIO = 'audio',
}

/**
 * Modality Selection Request
 */
export interface ModalitySelectionRequest {
  context?: {
    roomId?: string;
    userPreference?: ModalityType;
    availableModalities?: readonly ModalityType[];
  };
}

/**
 * Modality Selection Result
 */
export interface ModalitySelectionResult {
  modality: ModalityType;
  reasoning: string; // Simple explanation
}

/**
 * AI Service Response
 * Generic AI service response
 */
export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  guardrailsApplied?: boolean; // Whether guardrails were applied
}

/**
 * AI Service Configuration
 */
export interface AIServiceConfig {
  enableContentSelection: boolean;
  enableToneSuggestion: boolean;
  enableModalitySelection: boolean;
  strictGuardrails: boolean; // Enforce strict guardrails
}
