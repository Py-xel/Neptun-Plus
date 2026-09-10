import {
  CATEGORIES,
  STORAGE_KEY,
  type Category,
  type ExtensionSettingsKey,
  type InterfaceKey,
  type SettingValue,
  type SettingValueByKey,
  type SettingsByCategory,
  type StorageKey,
  type SystemKey,
} from '@/utils/dataSchema';

export type StoredSettings = Partial<SettingsByCategory>;
export type KeyForCategory = {
  [CATEGORIES.INTERFACE]: InterfaceKey;
  [CATEGORIES.SYSTEM]: SystemKey;
  [CATEGORIES.EXTENSION_SETTINGS]: ExtensionSettingsKey;
};

type SettingsChange = {
  newValue?: unknown;
  oldValue?: unknown;
};

type StorageResult = {
  [STORAGE_KEY]?: unknown;
};

function isStoredSettings(value: unknown): value is StoredSettings {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const settings = value as Record<string, unknown>;

  return Object.values(CATEGORIES).every((category) => {
    const categoryValue = settings[category];
    return categoryValue === undefined || (typeof categoryValue === 'object' && categoryValue !== null && !Array.isArray(categoryValue));
  });
}

/* READ :: MULTI */
export async function readSettings(): Promise<StoredSettings> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return {};
  }

  const result = (await chrome.storage.local.get(STORAGE_KEY)) as StorageResult;
  return isStoredSettings(result[STORAGE_KEY]) ? result[STORAGE_KEY] : {};
}

/* READ :: SINGLE */
export async function readSetting<CategoryName extends Category, Key extends KeyForCategory[CategoryName] & StorageKey>(
  category: CategoryName,
  key: Key,
  defaultValue?: SettingValue<Key>,
): Promise<SettingValue<Key> | undefined> {
  const settings = await readSettings();
  const categorySettings = settings[category] as Record<string, SettingValueByKey[StorageKey]> | undefined;
  return (categorySettings?.[key] as SettingValue<Key> | undefined) ?? defaultValue;
}

/* WRITE :: MULTI */
export async function writeSettings(settings: StoredSettings): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return;
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: settings });
}

/* WRITE :: SINGLE */
export async function writeSetting<CategoryName extends Category, Key extends KeyForCategory[CategoryName] & StorageKey>(category: CategoryName, key: Key, value: SettingValue<Key>): Promise<void> {
  const settings = await readSettings();
  const categorySettings = settings[category] ?? {};

  await writeSettings({
    ...settings,
    [category]: {
      ...categorySettings,
      [key]: value,
    },
  });
}

/* SUBSCRIBE :: SINGLE */
export function subscribeToSetting<CategoryName extends Category, Key extends KeyForCategory[CategoryName] & StorageKey>(
  category: CategoryName,
  key: Key,
  listener: (newValue: SettingValue<Key> | undefined, oldValue: SettingValue<Key> | undefined) => void,
): () => void {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return () => undefined;
  }

  const handleChange = (changes: Record<string, SettingsChange>, areaName: string) => {
    if (areaName !== 'local' || !changes[STORAGE_KEY]) {
      return;
    }

    const change = changes[STORAGE_KEY];
    const oldSettings = isStoredSettings(change.oldValue) ? change.oldValue : {};
    const newSettings = isStoredSettings(change.newValue) ? change.newValue : {};
    const oldCategorySettings = oldSettings[category] as Record<string, SettingValueByKey[StorageKey]> | undefined;
    const newCategorySettings = newSettings[category] as Record<string, SettingValueByKey[StorageKey]> | undefined;
    const oldValue = oldCategorySettings?.[key] as SettingValue<Key> | undefined;
    const newValue = newCategorySettings?.[key] as SettingValue<Key> | undefined;

    if (oldValue !== newValue) {
      listener(newValue, oldValue);
    }
  };

  chrome.storage.onChanged.addListener(handleChange);

  return () => {
    chrome.storage.onChanged.removeListener(handleChange);
  };
}

/* RESET */
export async function resetSettings(): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return;
  }

  await chrome.storage.local.remove(STORAGE_KEY);
}
