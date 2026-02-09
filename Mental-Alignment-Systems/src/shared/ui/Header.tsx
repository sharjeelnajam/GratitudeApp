/**
 * Header Component
 * 
 * Minimal, calm header for navigation.
 * Only shown when needed, never intrusive.
 * Maintains the sacred space feeling.
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { Text } from './Text';

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  style?: ViewStyle;
  transparent?: boolean;
}

export function Header({
  title,
  showBack = false,
  rightAction,
  style,
  transparent = false,
}: HeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();

  const canGoBack = router.canGoBack();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent ? 'transparent' : theme.colors.background,
          borderBottomColor: theme.colors.borderSubtle,
        },
        style,
      ]}
    >
      <View style={styles.left}>
        {showBack && canGoBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text variant="body" color="primary" style={styles.backText}>
              ← Back
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {title && (
        <View style={styles.center}>
          <Text variant="h4" style={styles.title}>
            {title}
          </Text>
        </View>
      )}

      <View style={styles.right}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 16,
  },
  title: {
    textAlign: 'center',
  },
});
