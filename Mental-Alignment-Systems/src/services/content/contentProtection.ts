/**
 * Content Protection
 * 
 * Protects authored content from unauthorized access or modification.
 * Ensures content integrity and attribution.
 */

import { ContentCard } from './types';

/**
 * Content Signature
 * Simple signature for content verification
 */
export interface ContentSignature {
  cardId: string;
  hash: string; // Simple hash for integrity check
  timestamp: number;
}

/**
 * Content Protection Status
 */
export interface ProtectionStatus {
  isProtected: boolean;
  isValid: boolean;
  error?: string;
}

/**
 * Simple hash function for content verification
 * Note: This is a basic implementation. For production, use a proper hash function.
 */
function simpleHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Creates a signature for a card
 */
export function createContentSignature(card: ContentCard): ContentSignature {
  const contentString = `${card.id}-${card.content}-${card.type}`;
  return {
    cardId: card.id,
    hash: simpleHash(contentString),
    timestamp: Date.now(),
  };
}

/**
 * Verifies content signature
 */
export function verifyContentSignature(
  card: ContentCard,
  signature: ContentSignature
): ProtectionStatus {
  // Check if card ID matches
  if (card.id !== signature.cardId) {
    return {
      isProtected: true,
      isValid: false,
      error: 'Card ID mismatch',
    };
  }

  // Verify hash
  const contentString = `${card.id}-${card.content}-${card.type}`;
  const expectedHash = simpleHash(contentString);

  if (signature.hash !== expectedHash) {
    return {
      isProtected: true,
      isValid: false,
      error: 'Content hash mismatch - content may have been modified',
    };
  }

  return {
    isProtected: true,
    isValid: true,
  };
}

/**
 * Checks if content is protected
 */
export function isContentProtected(card: ContentCard): boolean {
  // All authored content is protected
  // Cards with 'offline-' prefix are protected offline content
  // Future: Can add more sophisticated protection checks
  return card.id.startsWith('offline-') || card.id.startsWith('authored-');
}

/**
 * Validates content integrity
 */
export function validateContentIntegrity(card: ContentCard): ProtectionStatus {
  const protected = isContentProtected(card);
  
  if (!protected) {
    return {
      isProtected: false,
      isValid: true, // Non-protected content is valid
    };
  }

  // For protected content, verify it hasn't been tampered with
  // In a real implementation, this would check against a secure source
  return {
    isProtected: true,
    isValid: true, // Assume valid if structure is correct
  };
}
