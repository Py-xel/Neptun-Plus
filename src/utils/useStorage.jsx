import i18n from '@/popup/i18n';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'settings';
const RESET_EVENT = 'neptun-plus-reset-storage';

export const CATEGORIES = {
  INTERFACE: 'interface',
  SYSTEM: 'system',
  EXTENSION_SETTINGS: 'extension-settings',
};

export const KEYS = {
  INTERFACE: {
    DISABLE_HEADERS: 'disable-headers',
    SHOW_FULL_ITEMLIST: 'show-full-itemlist',
    SHOW_DOWNLOAD: 'show-download',
    USE_SHORTCUTS: 'use-shortcuts',
    SHORTCUTS: 'shortcuts',
    GRID_POSITION: 'grid-position',
  },

  SYSTEM: {
    INFINITE_SESSION: 'infinite-session',
    AUTO_LOGIN: 'auto-login',
    ACCEPTED_WARNING: 'accepted-warning',
  },

  EXTENSION_SETTINGS: {
    LANGUAGE: 'language',
    HIDE_HINTS: 'hide-hints',
  },
};

export function useStorage(category, key, defaultValue) {
  /* REPLACE WITH STREAMLINED ERROR HANDLING! */
  if (!category || !key) {
    throw new Error(`useStorage requires both category and key. Received category=${category} key=${key}`);
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
