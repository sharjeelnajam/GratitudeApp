/**
 * AI Service
 * 
 * AI alignment service abstraction.
 * NO API keys, NO direct provider SDKs, NO chatbot behavior.
 * 
 * Responsibilities:
 * - Select content
 * - Suggest tone
 * - Choose modality (text/audio)
 * 
 * Guardrails:
 * - No diagnosis language
 * - No emotional labeling
 * - No follow-up questioning
 */

// Types
export * from './types';
export type {
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

// Interface
export * from './interface';
export { IAIAlignmentService, AIServiceFactory } from './interface';

// Mock Implementation
export * from './mockAI';
export { MockAIService } from './mockAI';

// Guardrails
export * from './guardrails';
export {
  validateContentGuardrails,
  validateReasoningGuardrails,
  sanitizeContent,
  needsGuardrailFiltering,
} from './guardrails';
export type { GuardrailResult } from './guardrails';
