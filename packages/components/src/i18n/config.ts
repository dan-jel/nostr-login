import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import de from './locales/de.json';

// i18next Initialisierung
i18next.use(LanguageDetector).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['navigator', 'htmlTag'],
    caches: ['localStorage'],
  },
});

// Exportiere die i18next-Instanz für direkten Zugriff
export const i18n = i18next;

// Hilfsfunktionen
export const t = i18next.t.bind(i18next);
export const changeLanguage = i18next.changeLanguage.bind(i18next);
export const getLanguage = () => i18next.language;
export const onLanguageChanged = (callback: (lng: string) => void) => {
  i18next.on('languageChanged', callback);
  return () => i18next.off('languageChanged', callback);
};

export default i18next;
