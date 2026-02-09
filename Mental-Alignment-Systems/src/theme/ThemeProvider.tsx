/**
 * Theme Provider
 * 
 * Provides theme context to the entire app.
 * Handles light/dark mode and room-specific theming.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { theme, Theme } from './theme';
import { RoomThemeId, getRoomTheme, applyRoomTheme } from './roomThemes';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  roomThemeId: RoomThemeId;
  toggleTheme?: () => void;
  setRoomTheme?: (roomThemeId: RoomThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialRoomTheme?: RoomThemeId;
}

export function ThemeProvider({ children, initialRoomTheme = 'default' }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  // Default to dark mode for premium theme
  const [isDark, setIsDark] = useState(true); // Always dark for premium look
  const [roomThemeId, setRoomThemeId] = useState<RoomThemeId>(initialRoomTheme);
  
  const baseTheme = isDark ? theme.dark : theme.light;
  const roomTheme = getRoomTheme(roomThemeId);
  const currentTheme = applyRoomTheme(baseTheme, roomTheme, isDark);

  const value: ThemeContextType = {
    theme: currentTheme,
    isDark,
    roomThemeId,
    toggleTheme: () => setIsDark(!isDark),
    setRoomTheme: (id: RoomThemeId) => setRoomThemeId(id),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
