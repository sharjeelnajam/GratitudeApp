import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import i18n, { SupportedLanguage, LANGUAGE_LABELS } from '../../i18n';
import { getStoredLanguage, setStoredLanguage } from '../../i18n/languageStorage';

interface LanguageContextValue {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
  labels: typeof LANGUAGE_LABELS;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [language, setLanguage] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'en'
  );

  useEffect(() => {
    getStoredLanguage().then((stored) => {
      if (stored && stored !== language) {
        i18n.changeLanguage(stored);
        setLanguage(stored as SupportedLanguage);
      }
    });
  }, []);

  const changeLanguage = useCallback(async (lang: SupportedLanguage) => {
    await i18n.changeLanguage(lang);
    await setStoredLanguage(lang);
    setLanguage(lang);
  }, []);

  const value = useMemo(
    () => ({ language, changeLanguage, labels: LANGUAGE_LABELS }),
    [language, changeLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
