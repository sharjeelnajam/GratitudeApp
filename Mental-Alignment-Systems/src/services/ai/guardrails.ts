/**
 * AI Service Guardrails
 * 
 * Prevents forbidden language and behaviors.
 * Ensures compliance with design philosophy.
 */

import { FORBIDDEN_PATTERNS, validateFeatureCompliance } from '@/config/design-constraints';

/**
 * Guardrail Result
 */
export interface GuardrailResult {
  passed: boolean;
  filtered?: boolean; // Whether content was filtered
  reason?: string;
}

/**
 * Validates content against guardrails
 */
export function validateContentGuardrails(content: string): GuardrailResult {
  // Check for diagnosis language
  const hasDiagnosisLanguage = FORBIDDEN_PATTERNS.DIAGNOSIS_LANGUAGE.some(pattern =>
    content.toLowerCase().includes(pattern)
  );

  if (hasDiagnosisLanguage) {
    return {
      passed: false,
      filtered: true,
      reason: 'Contains diagnosis language',
    };
  }

  // Check for advice-giving patterns
  const hasAdvice = FORBIDDEN_PATTERNS.PRESSURE_PATTERNS.some(pattern =>
    content.toLowerCase().includes(pattern)
  );

  if (hasAdvice) {
    return {
      passed: false,
      filtered: true,
      reason: 'Contains prescriptive language',
    };
  }

  // Check for emotional labeling (gentle check)
  const emotionalLabelingPatterns = [
    'you are',
    'you feel',
    'you seem',
    'you appear',
  ];

  const hasEmotionalLabeling = emotionalLabelingPatterns.some(pattern =>
    content.toLowerCase().includes(pattern)
  );

  if (hasEmotionalLabeling) {
    return {
      passed: false,
      filtered: true,
      reason: 'Contains emotional labeling',
    };
  }

  return {
    passed: true,
  };
}

/**
 * Validates reasoning text against guardrails
 */
export function validateReasoningGuardrails(reasoning: string): GuardrailResult {
  // Reasoning should be simple and non-diagnostic
  const validation = validateFeatureCompliance('AI Reasoning', reasoning);

  if (!validation.compliant) {
    return {
      passed: false,
      filtered: true,
      reason: `Reasoning contains forbidden patterns: ${validation.violations.join(', ')}`,
    };
  }

  return {
    passed: true,
  };
}

/**
 * Sanitizes content to remove forbidden patterns
 * Returns sanitized content or null if too much was removed
 */
export function sanitizeContent(content: string): string | null {
  let sanitized = content;

  // Remove diagnosis language patterns
  FORBIDDEN_PATTERNS.DIAGNOSIS_LANGUAGE.forEach(pattern => {
    const regex = new RegExp(pattern, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Remove prescriptive patterns
  FORBIDDEN_PATTERNS.PRESSURE_PATTERNS.forEach(pattern => {
    const regex = new RegExp(pattern, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Clean up extra spaces
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // If too much was removed, return null
  if (sanitized.length < content.length * 0.5) {
    return null; // Too much content was removed
  }

  return sanitized;
}

/**
 * Checks if content needs guardrail filtering
 */
export function needsGuardrailFiltering(content: string): boolean {
  const validation = validateContentGuardrails(content);
  return !validation.passed;
}
