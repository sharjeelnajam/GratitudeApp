/**
 * Text Component
 * 
 * Soft, readable text with theme support.
 * Gentle, non-demanding typography.
 */

import React, { ReactNode } from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme';
import { TextStyle as ThemeTextStyle } from '@/theme/typography';

export interface TextProps extends RNTextProps {
  children: ReactNode;
  variant?: keyof typeof textStyleVariants;
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse';
  style?: TextStyle;
}

const textStyleVariants: Record<string, keyof ThemeTextStyle> = {
  display: 'display',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'body',
  bodyLarge: 'bodyLarge',
  bodySmall: 'bodySmall',
  contemplative: 'contemplative',
  caption: 'caption',
  label: 'label',
};

export function Text({
  children,
  variant = 'body',
  color = 'primary',
  style,
  ...props
}: TextProps) {
  const { theme } = useTheme();
  const textStyle = theme.textStyles[textStyleVariants[variant]];

  const textColor = theme.colors.text[color];

  return (
    <RNText
      style={[
        {
          fontSize: textStyle.fontSize,
          fontWeight: textStyle.fontWeight,
          lineHeight: textStyle.fontSize * textStyle.lineHeight,
          letterSpacing: textStyle.letterSpacing,
          color: textColor,
          fontFamily: theme.typography.fontFamily.sans.default,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
