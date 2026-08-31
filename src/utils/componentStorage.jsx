import i18n from '@/popup/i18n';
import { CATEGORIES, KEYS, STORAGE_KEY } from '@/utils/dataSchema';
import { useEffect, useRef, useState } from 'react';

const RESET_EVENT = 'np-reset-storage';

export function useStorage(category, key, defaultValue) {
  const isConfigured = Boolean(category && key);

  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(isConfigured);
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

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
    if (!isConfigured) {
      // TODO: Add error handling
      return undefined;
    }

    const handleStorageReset = () => {
      setValue(defaultValueRef.current);
      setLoading(false);
    };

    const handleStorageChange = (changes, areaName) => {
      if (areaName !== 'local' || !Object.prototype.hasOwnProperty.call(changes, STORAGE_KEY)) {
        return;
      }

      const nextSettings = changes[STORAGE_KEY].newValue || {};
      const nextValue = nextSettings?.[category]?.[key] ?? defaultValueRef.current;

      setValue(nextValue);
      setLoading(false);

      if (category === CATEGORIES.EXTENSION_SETTINGS && key === KEYS.EXTENSION_SETTINGS.LANGUAGE) {
        const normalizedLanguage = nextValue === 'en' || nextValue === 'hu' ? nextValue : 'hu';
        if (normalizedLanguage !== i18n.language) {
          void i18n.changeLanguage(normalizedLanguage);
        }
      }
    };

    window.addEventListener(RESET_EVENT, handleStorageReset);

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    async function load() {
      if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        // TODO: Add error handling
        setLoading(false);
        return;
      }

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
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, [category, isConfigured, key]);

  async function updateValue(newValue) {
    if (!isConfigured) {
      // TODO: Add error handling
      return;
    }

    setValue(newValue);

    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      // TODO: Add error handling
      return;
    }

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
  storageApi.value = value;
  storageApi.updateValue = updateValue;
  storageApi.loading = loading;
  storageApi.resetAllSettings = resetAllSettings;

  if (!isConfigured) {
    // TODO: Add error handling
    return [defaultValue, async () => undefined, true, async () => undefined];
  }

  return storageApi;
}
