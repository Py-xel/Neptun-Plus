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
    HIDE_NOTIFICATIONS: 'hide-notifications',
    SHOW_DOWNLOAD: 'show-download',
    USE_SHORTCUTS: 'use-shortcuts',
    SHORTCUTS: 'shortcuts',
  },
  SYSTEM: {
    INFINITE_SESSION: 'infinite-session',
    AUTO_LOGIN: 'auto-login',
    ACCEPTED_WARNING__AUTO_LOGIN: 'accepted-warning__auto-login',
    CREDENTIALS: 'credentials',
  },
  EXTENSION_SETTINGS: {
    LANGUAGE: 'language',
    HIDE_HINTS: 'hide-hints',
    LAST_PAGE: 'last-page',
  },
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];
export type InterfaceKey = (typeof KEYS.INTERFACE)[keyof typeof KEYS.INTERFACE];
export type SystemKey = (typeof KEYS.SYSTEM)[keyof typeof KEYS.SYSTEM];
export type ExtensionSettingsKey = (typeof KEYS.EXTENSION_SETTINGS)[keyof typeof KEYS.EXTENSION_SETTINGS];

export type StorageKey = InterfaceKey | SystemKey | ExtensionSettingsKey;

export const SIDEBAR_PATHS = ['/', '/System', '/Info', '/Settings'] as const;
export type SidebarPath = (typeof SIDEBAR_PATHS)[number];

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

export type ShortcutItem = {
  id: number;
  icon: string;
  name: string;
  link: string;
};

export type SettingValueByKey = {
  [KEYS.INTERFACE.DISABLE_HEADERS]: boolean;
  [KEYS.INTERFACE.SHOW_FULL_ITEMLIST]: boolean;
  [KEYS.INTERFACE.HIDE_NOTIFICATIONS]: boolean;
  [KEYS.INTERFACE.SHOW_DOWNLOAD]: boolean;
  [KEYS.INTERFACE.USE_SHORTCUTS]: boolean;
  [KEYS.INTERFACE.SHORTCUTS]: ShortcutItem[];

  [KEYS.SYSTEM.INFINITE_SESSION]: boolean;
  [KEYS.SYSTEM.AUTO_LOGIN]: boolean;
  [KEYS.SYSTEM.ACCEPTED_WARNING__AUTO_LOGIN]: boolean;
  [KEYS.SYSTEM.CREDENTIALS]: AutoLoginCredential[];

  [KEYS.EXTENSION_SETTINGS.LANGUAGE]: Language;
  [KEYS.EXTENSION_SETTINGS.HIDE_HINTS]: boolean;
  [KEYS.EXTENSION_SETTINGS.LAST_PAGE]: SidebarPath;
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
