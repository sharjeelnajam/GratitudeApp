/**
 * Typography Scale
 * 
 * Soft, readable typography system.
 * Designed for calm, reverent reading experience.
 */

export const typography = {
  /**
   * Font Families
   * System fonts for native feel, with fallbacks
   */
  fontFamily: {
    sans: {
      ios: 'system-ui',
      android: 'sans-serif',
      web: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      default: 'sans-serif',
    },
    serif: {
      ios: 'ui-serif',
      android: 'serif',
      web: "'Playfair Display', 'Cormorant Garamond', Georgia, 'Times New Roman', serif",
      default: 'serif',
    },
    display: {
      ios: 'ui-serif',
      android: 'serif',
      web: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
      default: 'serif',
    },
    mono: {
      ios: 'ui-monospace',
      android: 'monospace',
      web: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      default: 'monospace',
    },
  },

  /**
   * Font Sizes
   * Soft, readable scale (not too large, not too small)
   */
  fontSize: {
    xs: 12,      // Small labels, captions
    sm: 14,      // Secondary text, helper text
    base: 16,    // Body text (comfortable reading)
    lg: 18,      // Slightly emphasized text
    xl: 20,      // Small headings
    '2xl': 24,   // Medium headings
    '3xl': 30,   // Large headings
    '4xl': 36,   // Extra large headings (sparingly used)
    '5xl': 48,   // Display text (rarely used)
  },

  /**
   * Font Weights
   * Soft weights - avoid heavy/bold for calm feel
   */
  fontWeight: {
    light: '300',
    normal: '400',    // Default - comfortable reading
    medium: '500',    // Slight emphasis
    semibold: '600',  // Moderate emphasis (use sparingly)
    bold: '700',      // Strong emphasis (rarely used)
  },

  /**
   * Line Heights
   * Generous for comfortable reading
   */
  lineHeight: {
    tight: 1.2,      // Headings
    normal: 1.5,     // Body text (comfortable)
    relaxed: 1.75,   // Long-form reading
    loose: 2.0,      // Poetry, contemplative text
  },

  /**
   * Letter Spacing
   * Subtle adjustments for readability
   */
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
} as const;

/**
 * Typography Styles
 * Pre-defined text styles for common use cases
 */
export const textStyles = {
  // Display styles (rarely used, for special moments)
  display: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.light,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    fontFamily: typography.fontFamily.display.default,
  },

  // Heading styles - Premium serif for titles
  h1: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.light,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.wide,
    fontFamily: typography.fontFamily.serif.default,
  },
  h2: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.normal,
  },
  h3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  h4: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  // Body styles
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  // Contemplative text (for reflections, moments)
  contemplative: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.light,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.wide,
  },

  // Caption and helper text
  caption: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
  },
} as const;

export type TypographyScale = typeof typography;
export type TextStyle = keyof typeof textStyles;
