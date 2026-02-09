/**
 * Motion Tokens
 * 
 * Slow, subtle animations for calm, reverent experience.
 * No aggressive or energetic animations.
 */

/**
 * Duration Scale
 * Slow, contemplative timing
 */
export const duration = {
  instant: 0,
  fast: 150,      // Very quick (hover states)
  normal: 300,    // Standard transition
  slow: 500,      // Contemplative transition
  slower: 750,    // Very slow (page transitions)
  slowest: 1000,  // Slowest (rarely used, for special moments)
} as const;

/**
 * Easing Functions
 * Gentle, natural easing curves
 */
export const easing = {
  // Standard easing (most common)
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',      // Material Design default
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',        // Gentle ease out
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',           // Gentle ease in
  
  // Soft, contemplative easing
  soft: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',   // Very gentle
  gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',         // Smooth, calm
  
  // Linear (for very subtle effects)
  linear: 'linear',
} as const;

/**
 * Animation Presets
 * Pre-defined animations for common use cases
 */
export const animations = {
  // Fade animations (gentle appearance/disappearance)
  fadeIn: {
    duration: duration.normal,
    easing: easing.easeOut,
  },
  fadeOut: {
    duration: duration.normal,
    easing: easing.easeIn,
  },
  fadeInSlow: {
    duration: duration.slow,
    easing: easing.soft,
  },

  // Slide animations (subtle movement)
  slideUp: {
    duration: duration.slow,
    easing: easing.easeOut,
  },
  slideDown: {
    duration: duration.slow,
    easing: easing.easeOut,
  },
  slideIn: {
    duration: duration.normal,
    easing: easing.easeOut,
  },

  // Scale animations (gentle growth)
  scaleIn: {
    duration: duration.normal,
    easing: easing.easeOut,
  },
  scaleOut: {
    duration: duration.fast,
    easing: easing.easeIn,
  },

  // Page transitions (contemplative)
  pageTransition: {
    duration: duration.slower,
    easing: easing.soft,
  },

  // Card appearance (gentle entrance)
  cardEnter: {
    duration: duration.slow,
    easing: easing.soft,
  },

  // Button interactions (subtle feedback)
  buttonPress: {
    duration: duration.fast,
    easing: easing.easeOut,
  },
} as const;

/**
 * Motion Constraints
 * Rules for animation usage
 */
export const motionConstraints = {
  // Maximum duration for any animation
  maxDuration: duration.slowest,
  
  // Minimum duration for visible animations
  minDuration: duration.fast,
  
  // Recommended duration for most interactions
  defaultDuration: duration.normal,
  
  // Recommended easing for most animations
  defaultEasing: easing.easeOut,
} as const;

/**
 * Reduced Motion Support
 * Respect user's motion preferences
 */
export const reducedMotion = {
  // When reduced motion is enabled, use these values
  duration: {
    instant: 0,
    fast: 0,
    normal: 0,
    slow: 0,
    slower: 0,
    slowest: 0,
  },
  // Disable animations entirely
  animations: {
    fadeIn: { duration: 0, easing: 'linear' },
    fadeOut: { duration: 0, easing: 'linear' },
    slideUp: { duration: 0, easing: 'linear' },
    slideDown: { duration: 0, easing: 'linear' },
    scaleIn: { duration: 0, easing: 'linear' },
    scaleOut: { duration: 0, easing: 'linear' },
    pageTransition: { duration: 0, easing: 'linear' },
    cardEnter: { duration: 0, easing: 'linear' },
    buttonPress: { duration: 0, easing: 'linear' },
  },
} as const;

export type Duration = typeof duration;
export type Easing = typeof easing;
export type Animations = typeof animations;
