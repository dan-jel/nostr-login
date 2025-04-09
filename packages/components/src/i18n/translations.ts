import en from './en.json';
import de from './de.json';

export type Language = 'en' | 'de';

type TranslationKeys = {
  welcome: {
    title: string;
    description: string;
    signIn: string;
    signUp: string;
    advanced: string;
  };
  login: {
    title: string;
    npub: string;
    connect: string;
    extension: string;
    readOnly: string;
    otp: string;
  };
  signup: {
    title: string;
    description: string;
    local: string;
    bunker: string;
    extension: string;
  };
  common: {
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    error: string;
    success: string;
  };
};

type TranslationKey = keyof TranslationKeys | `${keyof TranslationKeys}.${string}`;

const translations = {
  en,
  de
};

let currentLanguage: Language = 'en';

export function setLanguage(lang: Language) {
  if (translations[lang]) {
    currentLanguage = lang;
    // Dispatch event for components to update
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  }
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: TranslationKey): string {
  const [category, subKey] = key.split('.');
  const translation = subKey 
    ? translations[currentLanguage][category]?.[subKey]
    : translations[currentLanguage][category];

  if (!translation) {
    console.warn(`Translation missing for key: ${String(key)}`);
    return String(key);
  }
  return String(translation);
}

// Initialize with browser language if available
if (typeof window !== 'undefined') {
  const browserLang = navigator.language.split('-')[0] as Language;
  if (translations[browserLang]) {
    setLanguage(browserLang);
  }
} 