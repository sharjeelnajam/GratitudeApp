/**
 * Container Component
 * 
 * A soft, grounded container for content.
 * Non-demanding, calm presence.
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface ContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: 'background' | 'surface' | 'surfaceElevated';
}

export function Container({
  children,
  style,
  padding = 'md',
  backgroundColor = 'background',
}: ContainerProps) {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    backgroundColor: theme.colors[backgroundColor],
    padding: theme.spacingSemantic[padding],
  };

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
}
