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
  new MutationObserver(() => {
    const newLang = getHtmlLanguage();

    // TODO Add proper logging
    /* console.log('[i18n] HTML language:', newLang);
    console.log('[i18n] Current i18n language:', i18n.language); */

    if (newLang !== i18n.language) {
      // TODO Add proper logging
      /* console.log('[i18n] Changing language:', i18n.language, '→', newLang); */
      i18n.changeLanguage(newLang);
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
}

export default i18n;
