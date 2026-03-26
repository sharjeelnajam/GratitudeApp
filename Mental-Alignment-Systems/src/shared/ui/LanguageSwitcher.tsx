import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useLanguage } from '../contexts/LanguageContext';
import type { SupportedLanguage } from '../../i18n';

const languages: SupportedLanguage[] = ['en', 'fr', 'zh', 'sw'];

export function LanguageSwitcher() {
  const { language, changeLanguage, labels } = useLanguage();

  return (
    <View style={styles.container}>
      {languages.map((lang) => {
        const isActive = language === lang;
        return (
          <TouchableOpacity
            key={lang}
            style={StyleSheet.flatten([styles.option, isActive && styles.active])}
            onPress={() => changeLanguage(lang)}
            activeOpacity={0.7}
          >
            <Text style={StyleSheet.flatten([styles.label, isActive && styles.activeLabel])}>
              {labels[lang]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  active: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    borderColor: 'rgba(167, 139, 250, 0.6)',
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
