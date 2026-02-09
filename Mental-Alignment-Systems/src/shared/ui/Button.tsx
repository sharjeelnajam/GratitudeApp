/**
 * Button Component
 * 
 * Gentle, non-urgent button.
 * Soft, grounded, non-demanding presence.
 * No aggressive styling or urgent colors.
 */

import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/theme';
import { Text } from './Text';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'subtle' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  // Button size configurations
  const sizeConfig = {
    sm: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      fontSize: theme.typography.fontSize.sm,
    },
    md: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[6],
      fontSize: theme.typography.fontSize.base,
    },
    lg: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[8],
      fontSize: theme.typography.fontSize.lg,
    },
  };

  const currentSize = sizeConfig[size];

  // Variant styles - all gentle and non-urgent
  const variantStyles: Record<ButtonProps['variant'], { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: {
        backgroundColor: theme.colors.accent,
        borderWidth: 0,
      },
      text: {
        color: theme.colors.text.inverse,
      },
    },
    secondary: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: theme.borderWidth[1],
        borderColor: theme.colors.border,
      },
      text: {
        color: theme.colors.text.primary,
      },
    },
    subtle: {
      container: {
        backgroundColor: theme.colors.surface,
        borderWidth: 0,
      },
      text: {
        color: theme.colors.text.primary,
      },
    },
    text: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      text: {
        color: theme.colors.accent,
      },
    },
  };

  const variantStyle = variantStyles[variant];

  const buttonStyle: ViewStyle = {
    ...variantStyle.container,
    ...currentSize,
    borderRadius: theme.borderRadius.md,
    opacity: disabled || loading ? 0.5 : 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const buttonTextStyle: TextStyle = {
    ...variantStyle.text,
    fontSize: currentSize.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      activeOpacity={0.7} // Gentle press feedback
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.text.color}
        />
      ) : (
        <Text
          style={[buttonTextStyle, textStyle]}
          variant="body"
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
