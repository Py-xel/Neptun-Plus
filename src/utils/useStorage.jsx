import { useEffect, useState } from 'react';

const STORAGE_KEY = 'settings';

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
    GRID_POSITION: 'grid-position',
  },

  SYSTEM: {
    INFINITE_SESSION: 'infinite-session',
  },

  EXTENSION_SETTINGS: {
    HIDE_HINTS: 'hide-hints',
  },
};

export function useStorage(category, key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const settings = result[STORAGE_KEY] || {};

      setValue(settings?.[category]?.[key] ?? defaultValue);
      setLoading(false);
    }

    load();
  }, [category, key, defaultValue]);

  async function updateValue(newValue) {
    setValue(newValue);

    const result = await chrome.storage.local.get(STORAGE_KEY);
    const settings = result[STORAGE_KEY] || {};

    settings[category] ??= {};
    settings[category][key] = newValue;

    await chrome.storage.local.set({
      [STORAGE_KEY]: settings,
    });
  }

  return [value, updateValue, loading];
}
