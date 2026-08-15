import i18n from '@/popup/i18n';
import { CATEGORIES, KEYS, STORAGE_KEY } from '@/utils/dataSchema';
import { useEffect, useRef, useState } from 'react';

const RESET_EVENT = 'neptun-plus-reset-storage';

export function useStorage(category, key, defaultValue) {
  /* Add error handling */
  if (!category || !key) {
    return false;
  }

  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const defaultValueRef = useRef(defaultValue);

  async function resetAllSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.remove(STORAGE_KEY);
    }

    setValue(defaultValueRef.current);
    window.dispatchEvent(new Event(RESET_EVENT));

    if (i18n.isInitialized) {
      await i18n.changeLanguage('hu');
    }
  }

  useEffect(() => {
    const handleStorageReset = () => {
      setValue(defaultValueRef.current);
      setLoading(false);
    };

    window.addEventListener(RESET_EVENT, handleStorageReset);

    async function load() {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const settings = result[STORAGE_KEY] || {};
      const storedValue = settings?.[category]?.[key] ?? defaultValueRef.current;

      setValue(storedValue);

      if (category === CATEGORIES.EXTENSION_SETTINGS && key === KEYS.EXTENSION_SETTINGS.LANGUAGE) {
        const normalizedLanguage = storedValue === 'en' || storedValue === 'hu' ? storedValue : 'hu';
        if (normalizedLanguage !== i18n.language) {
          await i18n.changeLanguage(normalizedLanguage);
        }
      }

      setLoading(false);
    }

    load();

    return () => {
      window.removeEventListener(RESET_EVENT, handleStorageReset);
    };
  }, [category, key]);

  async function updateValue(newValue) {
    setValue(newValue);

    const result = await chrome.storage.local.get(STORAGE_KEY);
    const settings = result[STORAGE_KEY] || {};

    settings[category] ??= {};
    settings[category][key] = newValue;

    await chrome.storage.local.set({
      [STORAGE_KEY]: settings,
    });

    if (category === CATEGORIES.EXTENSION_SETTINGS && key === KEYS.EXTENSION_SETTINGS.LANGUAGE) {
      const normalizedLanguage = newValue === 'en' || newValue === 'hu' ? newValue : 'hu';
      if (normalizedLanguage !== i18n.language) {
        await i18n.changeLanguage(normalizedLanguage);
      }
    }
  }

  const storageApi = [value, updateValue, loading, resetAllSettings];
  Object.assign(storageApi, {
    value,
    updateValue,
    loading,
    resetAllSettings,
  });

  return storageApi;
}
