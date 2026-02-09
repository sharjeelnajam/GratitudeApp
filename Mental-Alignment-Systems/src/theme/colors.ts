/**
 * Color Tokens
 * 
 * Sacred, calming color palette.
 * No bright or gamified colors.
 * Dark-mode friendly by default.
 * 
 * Supports future room themes: Fireplace, Ocean, Forest, Night Sky
 */

/**
 * Neutral Colors
 * Soft, grounding neutrals that form the foundation
 */
export const neutral = {
  // Light mode neutrals
  light: {
    50: '#FAFAFA',  // Almost white, subtle background
    100: '#F5F5F5', // Very light gray
    200: '#E5E5E5', // Light gray
    300: '#D4D4D4', // Medium light gray
    400: '#A3A3A3', // Medium gray
    500: '#737373', // Base gray
    600: '#525252', // Dark gray
    700: '#404040', // Darker gray
    800: '#262626', // Very dark gray
    900: '#171717', // Almost black
    950: '#0A0A0A', // Deep black
  },
  // Dark mode neutrals (warmer, softer)
  dark: {
    50: '#0A0A0A',  // Deep black
    100: '#171717', // Almost black
    200: '#262626', // Very dark gray
    300: '#404040', // Darker gray
    400: '#525252', // Dark gray
    500: '#737373', // Base gray
    600: '#A3A3A3', // Medium gray
    700: '#D4D4D4', // Medium light gray
    800: '#E5E5E5', // Light gray
    900: '#F5F5F5', // Very light gray
    950: '#FAFAFA', // Almost white
  },
} as const;

/**
 * Warm Colors
 * Gentle, comforting warm tones (not bright or energetic)
 */
export const warm = {
  // Soft warm tones
  light: {
    50: '#FFF9F5',  // Warm white
    100: '#FFF4ED', // Very light warm
    200: '#FFE8D6', // Light warm
    300: '#FED7AA', // Soft warm
    400: '#FDBA74', // Medium warm
    500: '#FB923C', // Base warm (muted, not bright)
    600: '#F97316', // Deeper warm (still muted)
    700: '#EA580C', // Rich warm
    800: '#C2410C', // Deep warm
    900: '#9A3412', // Very deep warm
    950: '#7C2D12', // Deepest warm
  },
  dark: {
    50: '#7C2D12',  // Deepest warm
    100: '#9A3412', // Very deep warm
    200: '#C2410C', // Deep warm
    300: '#EA580C', // Rich warm
    400: '#F97316', // Deeper warm
    500: '#FB923C', // Base warm
    600: '#FDBA74', // Medium warm
    700: '#FED7AA', // Soft warm
    800: '#FFE8D6', // Light warm
    900: '#FFF4ED', // Very light warm
    950: '#FFF9F5', // Warm white
  },
} as const;

/**
 * Grounding Colors
 * Earthy, stable tones that provide foundation
 */
export const grounding = {
  // Earthy, grounding tones
  light: {
    50: '#F7F5F3',  // Light earth
    100: '#EDE9E5', // Very light earth
    200: '#DDD6D0', // Light earth
    300: '#C9BFB5', // Soft earth
    400: '#A8958A', // Medium earth
    500: '#8B7355', // Base earth (muted brown)
    600: '#6B5A47', // Deeper earth
    700: '#5A4A3A', // Rich earth
    800: '#4A3D2F', // Deep earth
    900: '#3A3025', // Very deep earth
    950: '#2A221A', // Deepest earth
  },
  dark: {
    50: '#2A221A',  // Deepest earth
    100: '#3A3025', // Very deep earth
    200: '#4A3D2F', // Deep earth
    300: '#5A4A3A', // Rich earth
    400: '#6B5A47', // Deeper earth
    500: '#8B7355', // Base earth
    600: '#A8958A', // Medium earth
    700: '#C9BFB5', // Soft earth
    800: '#DDD6D0', // Light earth
    900: '#EDE9E5', // Very light earth
    950: '#F7F5F3', // Light earth
  },
} as const;

/**
 * Accent Colors
 * Subtle, reverent accents (purple/indigo tones)
 */
export const accent = {
  light: {
    50: '#F5F3FF',  // Very light purple
    100: '#EDE9FE', // Light purple
    200: '#DDD6FE', // Soft purple
    300: '#C4B5FD', // Medium purple
    400: '#A78BFA', // Base purple (calm, not bright)
    500: '#8B5CF6', // Deeper purple
    600: '#7C3AED', // Rich purple
    700: '#6D28D9', // Deep purple
    800: '#5B21B6', // Deeper purple
    900: '#4C1D95', // Very deep purple
    950: '#3B1784', // Deepest purple
  },
  dark: {
    50: '#3B1784',  // Deepest purple
    100: '#4C1D95', // Very deep purple
    200: '#5B21B6', // Deeper purple
    300: '#6D28D9', // Deep purple
    400: '#7C3AED', // Rich purple
    500: '#8B5CF6', // Deeper purple
    600: '#A78BFA', // Base purple
    700: '#C4B5FD', // Medium purple
    800: '#DDD6FE', // Soft purple
    900: '#EDE9FE', // Light purple
    950: '#F5F3FF', // Very light purple
  },
} as const;

/**
 * Premium Gradient Colors
 * Purple/blue gradients for premium feel
 */
export const gradients = {
  primary: ['#6366F1', '#8B5CF6', '#A78BFA'], // Indigo to purple
  secondary: ['#3B82F6', '#6366F1', '#8B5CF6'], // Blue to purple
  accent: ['#8B5CF6', '#C026D3', '#EC4899'], // Purple to pink
  background: ['#0A0714', '#1E1B2E', '#2D1B3D'], // Deep purple-black
  surface: ['#1A1625', '#2A1F3D', '#3A2F4D'], // Dark purple surfaces
  glow: {
    purple: 'rgba(139, 92, 246, 0.3)',
    blue: 'rgba(99, 102, 241, 0.3)',
    pink: 'rgba(236, 72, 153, 0.2)',
  },
} as const;

/**
 * Glassmorphism Colors
 * Translucent, frosted glass effects
 */
export const glass = {
  light: 'rgba(255, 255, 255, 0.1)',
  medium: 'rgba(255, 255, 255, 0.15)',
  dark: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.2)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
} as const;

/**
 * Semantic Colors
 * Colors for specific UI purposes
 * Premium dark theme by default
 */
export const semantic = {
  light: {
    background: neutral.light[50],
    surface: neutral.light[100],
    surfaceElevated: neutral.light[50],
    border: neutral.light[200],
    borderSubtle: neutral.light[100],
    text: {
      primary: neutral.light[900],
      secondary: neutral.light[600],
      tertiary: neutral.light[400],
      inverse: neutral.light[50],
    },
    accent: accent.light[500],
    accentSubtle: accent.light[100],
  },
  dark: {
    background: '#0A0714', // Deep purple-black
    surface: '#1A1625', // Dark purple surface
    surfaceElevated: '#2A1F3D', // Elevated surface
    border: 'rgba(139, 92, 246, 0.2)', // Purple border
    borderSubtle: 'rgba(139, 92, 246, 0.1)', // Subtle purple border
    text: {
      primary: '#FFFFFF', // Pure white
      secondary: 'rgba(255, 255, 255, 0.7)', // Soft white
      tertiary: 'rgba(255, 255, 255, 0.5)', // Muted white
      inverse: '#0A0714', // Dark for light backgrounds
    },
    accent: '#8B5CF6', // Premium purple
    accentSubtle: 'rgba(139, 92, 246, 0.2)', // Subtle purple
    gradient: gradients.primary,
    glass: glass,
  },
} as const;

/**
 * Room Theme Color Palettes
 * Prepared for future room themes
 */

// Fireplace theme - warm, cozy, amber tones
export const fireplace = {
  light: {
    primary: warm.light[600],      // Soft amber
    secondary: warm.light[400],    // Light amber
    background: warm.light[50],    // Warm white
    accent: warm.light[700],       // Rich amber
  },
  dark: {
    primary: warm.dark[400],        // Soft amber
    secondary: warm.dark[300],     // Rich amber
    background: neutral.dark[50], // Deep black
    accent: warm.dark[500],        // Base amber
  },
} as const;

// Ocean theme - calm, serene, blue-green tones
export const ocean = {
  light: {
    primary: '#4A90A4',            // Soft teal-blue
    secondary: '#6BA8B8',          // Light teal-blue
    background: '#F0F7F9',         // Very light blue-white
    accent: '#2E6B7A',             // Deep teal
  },
  dark: {
    primary: '#5BA8C0',            // Soft teal-blue
    secondary: '#4A90A4',          // Medium teal-blue
    background: '#0A1A1F',        // Deep blue-black
    accent: '#6BA8B8',             // Light teal-blue
  },
} as const;

// Forest theme - grounding, natural, green-brown tones
export const forest = {
  light: {
    primary: grounding.light[600], // Earthy brown-green
    secondary: '#6B8E5A',          // Soft forest green
    background: '#F5F7F3',         // Very light green-white
    accent: grounding.light[700],  // Rich earth
  },
  dark: {
    primary: '#7A9A6A',            // Soft forest green
    secondary: grounding.dark[400], // Earthy tone
    background: '#0F1A0F',         // Deep green-black
    accent: '#8BAA7A',             // Light forest green
  },
} as const;

// Night Sky theme - deep, contemplative, indigo-purple tones
export const nightSky = {
  light: {
    primary: accent.light[600],    // Rich purple
    secondary: accent.light[400],  // Base purple
    background: '#F5F3FF',         // Very light purple-white
    accent: accent.light[700],     // Deep purple
  },
  dark: {
    primary: accent.dark[400],      // Rich purple
    secondary: accent.dark[300],   // Deep purple
    background: '#0A0714',         // Deep purple-black
    accent: accent.dark[500],       // Base purple
  },
} as const;

export type ColorPalette = typeof semantic.light;
export type RoomThemeColors = typeof fireplace.light;
