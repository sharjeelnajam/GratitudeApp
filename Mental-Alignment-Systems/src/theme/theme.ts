/**
 * Theme Configuration
 * 
 * Complete design system combining colors, typography, spacing, and motion.
 * Aligned with design philosophy: calm, reverent, sacred.
 */

import { Platform } from 'react-native';
import { semantic, ColorPalette } from './colors';
import { typography, textStyles, TypographyScale, TextStyle } from './typography';
import { spacing, spacingSemantic, borderRadius, borderWidth, Spacing, SpacingSemantic } from './spacing';
import { duration, easing, animations, Duration, Easing, Animations } from './motion';

export interface Theme {
  colors: ColorPalette;
  typography: TypographyScale;
  textStyles: typeof textStyles;
  spacing: Spacing;
  spacingSemantic: SpacingSemantic;
  borderRadius: typeof borderRadius;
  borderWidth: typeof borderWidth;
  motion: {
    duration: Duration;
    easing: Easing;
    animations: Animations;
  };
}

const baseTheme: Omit<Theme, 'colors'> = {
  typography,
  textStyles,
  spacing,
  spacingSemantic,
  borderRadius,
  borderWidth,
  motion: {
    duration,
    easing,
    animations,
  },
};

export const theme = {
  light: {
    ...baseTheme,
    colors: semantic.light,
  },
  dark: {
    ...baseTheme,
    colors: semantic.dark,
  },
};

export type { Theme };
export type { ColorPalette, RoomThemeColors } from './colors';
export type { TypographyScale, TextStyle } from './typography';
export type { Spacing, SpacingSemantic } from './spacing';
export type { Duration, Easing, Animations } from './motion';
