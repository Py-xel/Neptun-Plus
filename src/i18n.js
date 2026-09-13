import en from '@/locales/en.json';
import hu from '@/locales/hu.json';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import i18n from 'i18next';

function normalizeLanguage(language) {
  return language === 'en' || language === 'hu' ? language : 'hu';
}

if (!i18n.isInitialized) {
  i18n.init({
    resources: {
      en: { translation: en },
      hu: { translation: hu },
    },
    lng: 'hu',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

async function loadStoredLanguage() {
  const storedLanguage = await readSetting(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LANGUAGE, 'hu');
  const language = normalizeLanguage(storedLanguage);

  if (language !== i18n.language) {
    await i18n.changeLanguage(language);
  }
}

loadStoredLanguage();

subscribeToSetting(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LANGUAGE, (newValue) => {
  const language = normalizeLanguage(newValue);

  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }
});

export default i18n;
