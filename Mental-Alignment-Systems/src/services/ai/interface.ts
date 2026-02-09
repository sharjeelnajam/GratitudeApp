/**
 * AI Service Interface
 * 
 * Abstract interface for AI alignment service.
 * NO API keys, NO direct provider SDKs, NO chatbot behavior.
 */

import {
  ContentSelectionRequest,
  ContentSelectionResult,
  ToneSuggestionRequest,
  ToneSuggestionResult,
  ModalitySelectionRequest,
  ModalitySelectionResult,
  AIServiceResponse,
  AIServiceConfig,
} from './types';

/**
 * AI Alignment Service Interface
 * 
 * Defines the contract for AI services.
 * Implementations must follow guardrails and design philosophy.
 */
export interface IAIAlignmentService {
  /**
   * Selects appropriate content based on context
   * NO user analysis, NO personalization
   */
  selectContent(
    request: ContentSelectionRequest
  ): Promise<AIServiceResponse<ContentSelectionResult>>;

  /**
   * Suggests tone for content delivery
   * Simple, non-diagnostic suggestions
   */
  suggestTone(
    request: ToneSuggestionRequest
  ): Promise<AIServiceResponse<ToneSuggestionResult>>;

  /**
   * Selects content delivery modality
   * Text or audio based on context
   */
  selectModality(
    request: ModalitySelectionRequest
  ): Promise<AIServiceResponse<ModalitySelectionResult>>;

  /**
   * Gets service configuration
   */
  getConfig(): AIServiceConfig;

  /**
   * Updates service configuration
   */
  updateConfig(config: Partial<AIServiceConfig>): void;
}

/**
 * AI Service Factory
 * Creates AI service instances
 */
export class AIServiceFactory {
  /**
   * Creates a mock AI service (for development)
   */
  static createMock(): IAIAlignmentService {
    // Dynamic import to avoid circular dependency
    const { MockAIService } = require('./mockAI');
    return new MockAIService();
  }

  /**
   * Creates AI service based on configuration
   * Currently only supports mock implementation
   * Future: Can add real AI provider implementations here
   */
  static create(config?: Partial<AIServiceConfig>): IAIAlignmentService {
    // For now, always return mock
    // Future implementations would check config and return appropriate service
    const service = this.createMock();
    if (config) {
      service.updateConfig(config);
    }
    return service;
  }
}
