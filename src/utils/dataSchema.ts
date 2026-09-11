export const STORAGE_KEY = 'settings';

export const CATEGORIES = {
  INTERFACE: 'interface',
  SYSTEM: 'system',
  EXTENSION_SETTINGS: 'extension-settings',
} as const;

export const KEYS = {
  INTERFACE: {
    DISABLE_HEADERS: 'disable-headers',
    SHOW_FULL_ITEMLIST: 'show-full-itemlist',
    SHOW_DOWNLOAD: 'show-download',
    USE_SHORTCUTS: 'use-shortcuts',
    SHORTCUTS: 'shortcuts',
  },
  SYSTEM: {
    INFINITE_SESSION: 'infinite-session',
    AUTO_LOGIN: 'auto-login',
    ACCEPTED_WARNING: 'accepted-warning',
    CREDENTIALS: 'credentials',
  },
  EXTENSION_SETTINGS: {
    LANGUAGE: 'language',
    HIDE_HINTS: 'hide-hints',
  },
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];
export type InterfaceKey = (typeof KEYS.INTERFACE)[keyof typeof KEYS.INTERFACE];
export type SystemKey = (typeof KEYS.SYSTEM)[keyof typeof KEYS.SYSTEM];
export type ExtensionSettingsKey = (typeof KEYS.EXTENSION_SETTINGS)[keyof typeof KEYS.EXTENSION_SETTINGS];

export type StorageKey = InterfaceKey | SystemKey | ExtensionSettingsKey;

export const SUPPORTED_LANGUAGES = ['hu', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
const DEFAULT_LANGUAGE: Language = 'hu';

const isLanguage = (value: string): value is Language => {
  return SUPPORTED_LANGUAGES.includes(value as Language);
};

export const normalizeLanguage = (language: string): Language => {
  const baseLanguage = language.split('-')[0];

  return isLanguage(baseLanguage) ? baseLanguage : DEFAULT_LANGUAGE;
};

export type SettingValueByKey = {
  [KEYS.INTERFACE.DISABLE_HEADERS]: boolean;
  [KEYS.INTERFACE.SHOW_FULL_ITEMLIST]: boolean;
  [KEYS.INTERFACE.SHOW_DOWNLOAD]: boolean;
  [KEYS.INTERFACE.USE_SHORTCUTS]: boolean;
  [KEYS.INTERFACE.SHORTCUTS]: string[];

  [KEYS.SYSTEM.INFINITE_SESSION]: boolean;
  [KEYS.SYSTEM.AUTO_LOGIN]: boolean;
  [KEYS.SYSTEM.ACCEPTED_WARNING]: boolean;
  [KEYS.SYSTEM.CREDENTIALS]: AutoLoginCredential[];

  [KEYS.EXTENSION_SETTINGS.LANGUAGE]: Language;
  [KEYS.EXTENSION_SETTINGS.HIDE_HINTS]: boolean;
};

export type AutoLoginCredential = {
  id: number;
  loginName: string;
  password: string;
  universityId: string;
};

export type SettingValue<Key extends StorageKey> = SettingValueByKey[Key];

export type SettingsByCategory = {
  [CATEGORIES.INTERFACE]: Partial<{
    [Key in InterfaceKey]: SettingValue<Key>;
  }>;

  [CATEGORIES.SYSTEM]: Partial<{
    [Key in SystemKey]: SettingValue<Key>;
  }>;

  [CATEGORIES.EXTENSION_SETTINGS]: Partial<{
    [Key in ExtensionSettingsKey]: SettingValue<Key>;
  }>;
};
