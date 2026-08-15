import i18n from 'i18next';

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

export function syncHtmlLanguage() {
  const nextLanguage = getHtmlLanguage();
  if (i18n.language !== nextLanguage) {
    i18n.changeLanguage(nextLanguage);
  }
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

export default i18n;
