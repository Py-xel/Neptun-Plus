import i18n from 'i18next';
import { observeMutations } from './utils/utility';

import en from '@/locales/en.json';
import hu from '@/locales/hu.json';

export function getHtmlLanguage() {
  if (typeof document === 'undefined' || !document.documentElement) {
    return 'hu';
  }

  const lang = document.documentElement.lang || 'hu';
  const normalized = lang.toLowerCase();

  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('hu')) return 'hu';
  return 'hu';
}

if (!i18n.isInitialized) {
  i18n.init({
    resources: {
      en: { translation: en },
      hu: { translation: hu },
    },
    lng: getHtmlLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

if (typeof document !== 'undefined' && document.documentElement) {
  observeMutations(
    () => {
      const newLang = getHtmlLanguage();
      if (newLang !== i18n.language) {
        i18n.changeLanguage(newLang);
      }
    },
    {
      childList: false,
      subtree: false,
      attributes: true,
      attributeFilter: ['lang'],
    },
  );
}

export default i18n;
