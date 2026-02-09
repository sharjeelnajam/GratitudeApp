/**
 * Design Constraints for Gratitude Keeper® Mental Alignment Systems™
 * 
 * These constants enforce the core philosophy and prevent forbidden patterns.
 * Reference this file when building features to ensure compliance.
 */

/**
 * FORBIDDEN PATTERNS - These should NEVER appear in the codebase
 */
export const FORBIDDEN_PATTERNS = {
  // Language patterns to avoid
  DIAGNOSIS_LANGUAGE: [
    'diagnosis',
    'symptom',
    'disorder',
    'condition',
    'treatment',
    'therapy',
    'clinical',
    'therapeutic',
    'counseling',
    'intervention',
  ],
  
  // Gamification patterns to avoid
  GAMIFICATION: [
    'streak',
    'score',
    'points',
    'badge',
    'achievement',
    'reward',
    'level',
    'progress',
    'milestone',
    'challenge',
    'leaderboard',
    'rank',
  ],
  
  // Social features to avoid
  SOCIAL_FEATURES: [
    'share',
    'social',
    'feed',
    'community',
    'group',
    'friend',
    'follow',
    'comment',
    'like',
    'post',
  ],
  
  // Pressure-inducing patterns
  PRESSURE_PATTERNS: [
    'you should',
    'you need to',
    'you must',
    "you haven't",
    "you're behind",
    'catch up',
    'reminder',
    'don\'t forget',
    'last chance',
  ],
} as const;

/**
 * ALLOWED TONE - Language that aligns with our philosophy
 */
export const ALLOWED_TONE = {
  WELCOME: [
    'welcome',
    'welcome back',
    'take a moment',
    'when you\'re ready',
    'at your own pace',
  ],
  
  SUPPORTIVE: [
    'reflect',
    'notice',
    'observe',
    'presence',
    'alignment',
    'restoration',
  ],
  
  GENTLE: [
    'gentle',
    'calm',
    'peaceful',
    'quiet',
    'still',
    'present',
  ],
} as const;

/**
 * DESIGN PRINCIPLES - Core values to guide development
 */
export const DESIGN_PRINCIPLES = {
  CALM: 'The experience should feel calm, reverent, and sacred',
  PRESENCE: 'Presence over progress',
  ALIGNMENT: 'Alignment over optimization',
  RESTORATION: 'Restoration over rewards',
  TRUSTED_GUIDE: 'Feel like a trusted internal guide',
  STEADY_PRESENCE: 'Feel like a steady, warm presence',
  NO_PRESSURE: 'A place users return to without pressure',
} as const;

/**
 * ARCHITECTURAL_PRINCIPLES - Technical requirements
 */
export const ARCHITECTURAL_PRINCIPLES = {
  REUSABILITY: 'Components must be modular and reusable',
  SEPARATION_OF_CONCERNS: 'Clear boundaries between UI, logic, and data',
  SCALABILITY: 'Designed to scale to millions of users',
  IP_PROTECTION: 'Protect proprietary IP and methodologies',
} as const;

/**
 * Helper function to check if text contains forbidden patterns
 * Use this in development to catch violations early
 */
export function containsForbiddenPattern(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  const allForbidden = [
    ...FORBIDDEN_PATTERNS.DIAGNOSIS_LANGUAGE,
    ...FORBIDDEN_PATTERNS.GAMIFICATION,
    ...FORBIDDEN_PATTERNS.SOCIAL_FEATURES,
    ...FORBIDDEN_PATTERNS.PRESSURE_PATTERNS,
  ];
  
  return allForbidden.some(pattern => lowerText.includes(pattern));
}

/**
 * Helper function to validate feature compliance
 */
export function validateFeatureCompliance(featureName: string, description: string): {
  compliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const lowerDescription = description.toLowerCase();
  const lowerFeatureName = featureName.toLowerCase();
  
  // Check for diagnosis language
  FORBIDDEN_PATTERNS.DIAGNOSIS_LANGUAGE.forEach(pattern => {
    if (lowerDescription.includes(pattern) || lowerFeatureName.includes(pattern)) {
      violations.push(`Contains diagnosis language: "${pattern}"`);
    }
  });
  
  // Check for gamification
  FORBIDDEN_PATTERNS.GAMIFICATION.forEach(pattern => {
    if (lowerDescription.includes(pattern) || lowerFeatureName.includes(pattern)) {
      violations.push(`Contains gamification: "${pattern}"`);
    }
  });
  
  // Check for social features
  FORBIDDEN_PATTERNS.SOCIAL_FEATURES.forEach(pattern => {
    if (lowerDescription.includes(pattern) || lowerFeatureName.includes(pattern)) {
      violations.push(`Contains social features: "${pattern}"`);
    }
  });
  
  // Check for pressure patterns
  FORBIDDEN_PATTERNS.PRESSURE_PATTERNS.forEach(pattern => {
    if (lowerDescription.includes(pattern) || lowerFeatureName.includes(pattern)) {
      violations.push(`Contains pressure-inducing language: "${pattern}"`);
    }
  });
  
  return {
    compliant: violations.length === 0,
    violations,
  };
}
