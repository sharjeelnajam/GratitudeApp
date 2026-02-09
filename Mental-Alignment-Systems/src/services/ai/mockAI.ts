/**
 * Mock AI Implementation
 * 
 * Simulates AI behavior without actual AI provider.
 * Used for development and testing.
 * NO API keys, NO external dependencies.
 */

import {
  ContentSelectionRequest,
  ContentSelectionResult,
  ToneSuggestionRequest,
  ToneSuggestionResult,
  ToneSuggestion,
  ModalitySelectionRequest,
  ModalitySelectionResult,
  ModalityType,
  AIServiceResponse,
  AIServiceConfig,
} from './types';
import { IAIAlignmentService } from './interface';
import { ContentCard } from '@/services/content';
import { validateContentGuardrails, validateReasoningGuardrails } from './guardrails';

/**
 * Mock AI Service
 * Simulates AI behavior with deterministic logic
 */
export class MockAIService implements IAIAlignmentService {
  private config: AIServiceConfig = {
    enableContentSelection: true,
    enableToneSuggestion: true,
    enableModalitySelection: true,
    strictGuardrails: true,
  };

  getConfig(): AIServiceConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }
  /**
   * Selects content based on context
   * Mock implementation - uses simple heuristics
   */
  async selectContent(
    request: ContentSelectionRequest
  ): Promise<AIServiceResponse<ContentSelectionResult>> {
    try {
      const { context, availableCards } = request;

      if (!availableCards || availableCards.length === 0) {
        return {
          success: false,
          error: 'No cards available',
        };
      }

      // Simple selection logic (not personalized, just contextual)
      let selectedCard: ContentCard;

      // Filter by room if specified
      if (context?.roomId) {
        const roomCards = availableCards.filter(card =>
          card.roomIds.length === 0 || card.roomIds.includes(context.roomId!)
        );
        if (roomCards.length > 0) {
          selectedCard = this.selectRandomCard(roomCards);
        } else {
          selectedCard = this.selectRandomCard(availableCards);
        }
      } else {
        // Select based on time of day (gentle suggestion, not prescription)
        if (context?.timeOfDay) {
          const timeBasedCards = this.filterByTimeOfDay(availableCards, context.timeOfDay);
          selectedCard = timeBasedCards.length > 0
            ? this.selectRandomCard(timeBasedCards)
            : this.selectRandomCard(availableCards);
        } else {
          selectedCard = this.selectRandomCard(availableCards);
        }
      }

      // Validate guardrails
      const guardrailCheck = validateContentGuardrails(selectedCard.content);
      if (!guardrailCheck.passed) {
        // Fallback to a safe card
        const safeCards = availableCards.filter(card => {
          const check = validateContentGuardrails(card.content);
          return check.passed;
        });
        selectedCard = safeCards.length > 0
          ? this.selectRandomCard(safeCards)
          : selectedCard; // Use original if no safe cards
      }

      // Generate simple reasoning (non-diagnostic)
      const reasoning = this.generateReasoning(selectedCard, context);

      // Validate reasoning guardrails
      const reasoningCheck = validateReasoningGuardrails(reasoning);
      const safeReasoning = reasoningCheck.passed
        ? reasoning
        : 'This card aligns with the current context.';

      const result: ContentSelectionResult = {
        selectedCard,
        reasoning: safeReasoning,
        confidence: 0.7, // Mock confidence
      };

      return {
        success: true,
        data: result,
        guardrailsApplied: !guardrailCheck.passed || !reasoningCheck.passed,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Suggests tone based on context
   */
  async suggestTone(
    request: ToneSuggestionRequest
  ): Promise<AIServiceResponse<ToneSuggestionResult>> {
    try {
      const { context } = request;

      // Simple tone selection based on context
      let tone: ToneSuggestion;

      if (context?.timeOfDay === 'night' || context?.timeOfDay === 'evening') {
        tone = ToneSuggestion.QUIET;
      } else if (context?.roomId?.includes('fireplace')) {
        tone = ToneSuggestion.CALM;
      } else if (context?.roomId?.includes('ocean')) {
        tone = ToneSuggestion.GENTLE;
      } else if (context?.roomId?.includes('forest')) {
        tone = ToneSuggestion.STILL;
      } else if (context?.roomId?.includes('nightSky')) {
        tone = ToneSuggestion.REVERENT;
      } else {
        tone = ToneSuggestion.PRESENT; // Default
      }

      const reasoning = `A ${tone} tone aligns with the current context.`;

      const result: ToneSuggestionResult = {
        tone,
        reasoning,
      };

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Selects modality (text/audio)
   */
  async selectModality(
    request: ModalitySelectionRequest
  ): Promise<AIServiceResponse<ModalitySelectionResult>> {
    try {
      const { context } = request;

      // Respect user preference if provided
      if (context?.userPreference) {
        const result: ModalitySelectionResult = {
          modality: context.userPreference,
          reasoning: 'Based on user preference.',
        };
        return {
          success: true,
          data: result,
        };
      }

      // Simple modality selection
      let modality: ModalityType = ModalityType.TEXT; // Default to text

      // Check available modalities
      if (context?.availableModalities?.includes(ModalityType.AUDIO)) {
        // Could suggest audio for certain contexts (future logic)
        // For now, default to text
        modality = ModalityType.TEXT;
      }

      const reasoning = 'Text modality provides clear, contemplative content.';

      const result: ModalitySelectionResult = {
        modality,
        reasoning,
      };

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Helper: Select random card
   */
  private selectRandomCard(cards: readonly ContentCard[]): ContentCard {
    const index = Math.floor(Math.random() * cards.length);
    return cards[index];
  }

  /**
   * Helper: Filter cards by time of day
   */
  private filterByTimeOfDay(
    cards: readonly ContentCard[],
    timeOfDay: string
  ): ContentCard[] {
    // Simple time-based filtering (not personalized)
    // Morning: gratitude, presence
    // Evening/Night: quiet, stillness
    const timeCategories: Record<string, string[]> = {
      morning: ['gratitude', 'presence'],
      afternoon: ['gratitude', 'alignment'],
      evening: ['presence', 'stillness'],
      night: ['stillness', 'quiet'],
    };

    const categories = timeCategories[timeOfDay] || [];
    return cards.filter(card =>
      card.category && categories.includes(card.category)
    );
  }

  /**
   * Helper: Generate simple reasoning (non-diagnostic)
   */
  private generateReasoning(
    card: ContentCard,
    context?: ContentSelectionRequest['context']
  ): string {
    const parts: string[] = [];

    if (card.category) {
      parts.push(`This ${card.category} card`);
    } else {
      parts.push('This card');
    }

    if (context?.roomId) {
      parts.push('aligns with the room atmosphere.');
    } else if (context?.timeOfDay) {
      parts.push(`fits the ${context.timeOfDay} context.`);
    } else {
      parts.push('provides a moment for reflection.');
    }

    return parts.join(' ');
  }
}
