/**
 * Room Theme Configurations
 * 
 * Pre-configured themes for different room environments.
 * Each theme extends the base design system with room-specific colors.
 */

import { fireplace, ocean, forest, nightSky, RoomThemeColors } from './colors';
import { Theme } from './theme';

export type RoomThemeId = 'fireplace' | 'ocean' | 'forest' | 'nightSky' | 'default';

export interface RoomTheme {
  id: RoomThemeId;
  name: string;
  description: string;
  colors: {
    light: RoomThemeColors;
    dark: RoomThemeColors;
  };
}

/**
 * Fireplace Theme
 * Warm, cozy, amber tones - like sitting by a fire
 */
export const fireplaceTheme: RoomTheme = {
  id: 'fireplace',
  name: 'Fireplace',
  description: 'A warm, cozy space with gentle amber light',
  colors: {
    light: fireplace.light,
    dark: fireplace.dark,
  },
};

/**
 * Ocean Theme
 * Calm, serene, blue-green tones - like being by the ocean
 */
export const oceanTheme: RoomTheme = {
  id: 'ocean',
  name: 'Ocean',
  description: 'A calm, serene space with soft blue-green tones',
  colors: {
    light: ocean.light,
    dark: ocean.dark,
  },
};

/**
 * Forest Theme
 * Grounding, natural, green-brown tones - like being in a forest
 */
export const forestTheme: RoomTheme = {
  id: 'forest',
  name: 'Forest',
  description: 'A grounding, natural space with earthy tones',
  colors: {
    light: forest.light,
    dark: forest.dark,
  },
};

/**
 * Night Sky Theme
 * Deep, contemplative, indigo-purple tones - like looking at the night sky
 */
export const nightSkyTheme: RoomTheme = {
  id: 'nightSky',
  name: 'Night Sky',
  description: 'A deep, contemplative space with indigo-purple tones',
  colors: {
    light: nightSky.light,
    dark: nightSky.dark,
  },
};

/**
 * Default Theme
 * Uses base semantic colors
 */
export const defaultRoomTheme: RoomTheme = {
  id: 'default',
  name: 'Default',
  description: 'The default calm, reverent space',
  colors: {
    light: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      background: '#FAFAFA',
      accent: '#7C3AED',
    },
    dark: {
      primary: '#A78BFA',
      secondary: '#8B5CF6',
      background: '#0A0A0A',
      accent: '#C4B5FD',
    },
  },
};

/**
 * All available room themes
 */
export const roomThemes: Record<RoomThemeId, RoomTheme> = {
  default: defaultRoomTheme,
  fireplace: fireplaceTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  nightSky: nightSkyTheme,
};

/**
 * Get room theme by ID
 */
export function getRoomTheme(id: RoomThemeId): RoomTheme {
  return roomThemes[id] || defaultRoomTheme;
}

/**
 * Apply room theme colors to base theme
 * Returns a theme with room-specific colors applied
 */
export function applyRoomTheme(baseTheme: Theme, roomTheme: RoomTheme, isDark: boolean): Theme {
  const roomColors = isDark ? roomTheme.colors.dark : roomTheme.colors.light;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      accent: roomColors.primary,
      accentSubtle: roomColors.secondary,
      background: roomColors.background,
    },
  };
}
