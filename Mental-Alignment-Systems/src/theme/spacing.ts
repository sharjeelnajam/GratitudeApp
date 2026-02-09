/**
 * Spacing System
 * 
 * Consistent spacing scale for calm, balanced layouts.
 * Based on 4px base unit for harmony.
 */

export const spacing = {
  /**
   * Base spacing units (4px base)
   */
  0: 0,
  1: 4,    // 0.25rem - Very tight spacing
  2: 8,    // 0.5rem - Tight spacing
  3: 12,   // 0.75rem - Compact spacing
  4: 16,   // 1rem - Base spacing unit
  5: 20,   // 1.25rem - Comfortable spacing
  6: 24,   // 1.5rem - Moderate spacing
  8: 32,   // 2rem - Generous spacing
  10: 40,  // 2.5rem - Large spacing
  12: 48,  // 3rem - Extra large spacing
  16: 64,  // 4rem - Very large spacing
  20: 80,  // 5rem - Huge spacing (rarely used)
  24: 96,  // 6rem - Maximum spacing (rarely used)
} as const;

/**
 * Semantic spacing names
 * Use these for consistent spacing patterns
 */
export const spacingSemantic = {
  // Component internal spacing
  xs: spacing[1],      // 4px - Very tight (icon padding)
  sm: spacing[2],       // 8px - Tight (button padding)
  md: spacing[4],       // 16px - Base (card padding)
  lg: spacing[6],      // 24px - Generous (section padding)
  xl: spacing[8],       // 32px - Large (container padding)

  // Layout spacing
  container: spacing[4],      // 16px - Container padding
  section: spacing[6],         // 24px - Section spacing
  screen: spacing[4],         // 16px - Screen edge padding
  card: spacing[6],            // 24px - Card padding

  // Component spacing
  buttonPadding: spacing[4],  // 16px - Button internal padding
  inputPadding: spacing[4],   // 16px - Input internal padding
  cardPadding: spacing[6],    // 24px - Card internal padding

  // Gap spacing (for flex/grid)
  gapTight: spacing[2],       // 8px - Tight gap
  gapNormal: spacing[4],       // 16px - Normal gap
  gapWide: spacing[6],        // 24px - Wide gap
} as const;

/**
 * Border radius scale
 * Soft, rounded corners for calm feel
 */
export const borderRadius = {
  none: 0,
  sm: 4,      // Small radius
  md: 8,      // Medium radius (default)
  lg: 12,     // Large radius
  xl: 16,     // Extra large radius
  '2xl': 24,  // Very large radius
  full: 9999, // Fully rounded (circle/pill)
} as const;

/**
 * Border width scale
 * Subtle borders for calm separation
 */
export const borderWidth = {
  0: 0,
  1: 1,  // Hairline (default)
  2: 2,  // Thick (rarely used)
} as const;

export type Spacing = typeof spacing;
export type SpacingSemantic = typeof spacingSemantic;
