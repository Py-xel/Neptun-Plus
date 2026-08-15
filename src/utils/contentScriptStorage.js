import { STORAGE_KEY } from '@/utils/dataSchema';

export function getStoredSettings() {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      resolve({});
      return;
    }

    chrome.storage.local.get(STORAGE_KEY, (result) => {
      resolve(result[STORAGE_KEY] || {});
    });
  });
}

export async function readStorageValue(category, key, defaultValue = undefined) {
  /* Add error handling */
  if (!category || !key) {
    return false;
  }

  const settings = await getStoredSettings();
  return settings?.[category]?.[key] ?? defaultValue;
}

export async function writeStorageValue(category, key, value) {
  /* Add error handling */
  if (!category || !key) {
    return false;
  }

  const settings = await getStoredSettings();
  settings[category] ??= {};
  settings[category][key] = value;

  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return chrome.storage.local.set({ [STORAGE_KEY]: settings });
  }

  return Promise.resolve(settings);
}

export function observeStorageChange(category, key, callback) {
  const listener = (changes, areaName) => {
    if (areaName !== 'local' || !changes[STORAGE_KEY]) {
      return;
    }

    const oldSettings = changes[STORAGE_KEY].oldValue || {};
    const newSettings = changes[STORAGE_KEY].newValue || {};
    const oldValue = oldSettings?.[category]?.[key];
    const newValue = newSettings?.[category]?.[key];

    if (oldValue !== newValue) {
      callback(newValue, oldValue);
    }
  };

  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.onChanged.addListener(listener);
  }

  return () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.onChanged.removeListener(listener);
    }
  };
}
