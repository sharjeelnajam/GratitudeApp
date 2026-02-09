/**
 * AmbientBackground Component
 * 
 * Soft, ambient background that adapts to room themes.
 * Creates a calm, reverent atmosphere.
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
// Note: expo-linear-gradient can be added later for gradient support
// import { LinearGradient } from 'expo-linear-gradient';

export interface AmbientBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'solid' | 'gradient' | 'subtle';
  roomTheme?: boolean; // Use room theme colors if available
}

// Note: expo-linear-gradient may need to be installed
// For now, we'll use a View with backgroundColor
// If LinearGradient is available, it will be used for gradient variant

export function AmbientBackground({
  children,
  style,
  variant = 'solid',
  roomTheme = false,
}: AmbientBackgroundProps) {
  const { theme, roomThemeId } = useTheme();

  // Get background color based on variant and room theme
  const getBackgroundColor = (): string => {
    if (roomTheme) {
      // Room theme colors would come from roomThemes
      // For now, use accent color as a subtle hint
      return theme.colors.background;
    }

    switch (variant) {
      case 'gradient':
        // Gradient would use LinearGradient if available
        // Fallback to solid for now
        return theme.colors.background;
      case 'subtle':
        return theme.colors.surface;
      case 'solid':
      default:
        return theme.colors.background;
    }
  };

  const backgroundColor = getBackgroundColor();

  // For gradient variant, we'd use LinearGradient
  // For now, render as solid background
  // TODO: Add expo-linear-gradient for gradient support
  const isGradient = variant === 'gradient' && false; // Disabled until LinearGradient is available

  if (isGradient) {
    // Gradient implementation would go here
    // return (
    //   <LinearGradient
    //     colors={[theme.colors.background, theme.colors.surface]}
    //     style={[styles.container, style]}
    //   >
    //     {children}
    //   </LinearGradient>
    // );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
