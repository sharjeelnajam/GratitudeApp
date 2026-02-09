/**
 * Card Component
 * 
 * Soft, grounded card container.
 * Gentle elevation, non-demanding presence.
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

export interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof paddingOptions;
  variant?: 'default' | 'elevated' | 'subtle' | 'glass';
}

const paddingOptions = {
  none: 0,
  sm: 'sm' as const,
  md: 'md' as const,
  lg: 'lg' as const,
};

export function Card({
  children,
  style,
  padding = 'md',
  variant = 'default',
}: CardProps) {
  const { theme } = useTheme();

  const variantStyles: Record<CardProps['variant'], ViewStyle> = {
    default: {
      backgroundColor: theme.colors.surface,
      borderWidth: theme.borderWidth[1],
      borderColor: theme.colors.border,
    },
    elevated: {
      backgroundColor: theme.colors.surfaceElevated,
      borderWidth: theme.borderWidth[1],
      borderColor: theme.colors.borderSubtle,
      // Subtle shadow (if platform supports)
      shadowColor: theme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2, // Android
    },
    subtle: {
      backgroundColor: theme.colors.surface,
      borderWidth: 0,
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      // Glassmorphism shadow
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 8, // Android
      // Backdrop blur effect (iOS)
      overflow: 'hidden',
    },
  };

  const paddingValue = padding === 'none' 
    ? 0 
    : theme.spacingSemantic[padding as 'sm' | 'md' | 'lg'];

  const cardStyle: ViewStyle = {
    ...variantStyles[variant],
    borderRadius: theme.borderRadius.lg,
    padding: paddingValue,
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}
