import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { getStoredLanguage } from './languageStorage';

import en from './locales/en.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';
import sw from './locales/sw.json';

const SUPPORTED_LANGUAGES = ['en', 'fr', 'zh', 'sw'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  zh: '中文',
  sw: 'Kiswahili',
};

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  zh: { translation: zh },
  sw: { translation: sw },
};

function getDeviceLanguage(): string {
  const locale = Localization.getLocales()[0]?.languageCode ?? 'en';
  return SUPPORTED_LANGUAGES.includes(locale as SupportedLanguage) ? locale : 'en';
}

async function initI18n() {
  const stored = await getStoredLanguage();
  const lng = stored ?? getDeviceLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });
}

initI18n();

export default i18n;
