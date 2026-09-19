import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import type { ShortcutItem } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { addNavigationListeners, createElement, isLoginPage, observeMutations } from '@/utils/utility';

type ShortcutsController = {
  update: (shortcutItems: ShortcutItem[]) => void;
  destroy: () => void;
};

function isShortcutItem(value: unknown): value is ShortcutItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const shortcut = value as Partial<ShortcutItem>;
  return typeof shortcut.id === 'number' && typeof shortcut.icon === 'string' && typeof shortcut.name === 'string' && typeof shortcut.link === 'string';
}

function createShortcutButton(shortcut: ShortcutItem): HTMLButtonElement {
  const button = createElement('button', 'np-shortcut-button');
  const icon = createElement('i', `np-shortcut-icon fa-regular fa-${shortcut.icon}`);
  const name = createElement('span', 'np-shortcut-name', shortcut.name);

  button.type = 'button';
  button.title = shortcut.name;
  button.append(icon, name);
  button.addEventListener('click', () => {
    window.location.assign(shortcut.link);
  });

  return button;
}

function renderShortcuts(container: HTMLDivElement, shortcutItems: ShortcutItem[]): void {
  container.replaceChildren(...shortcutItems.map(createShortcutButton));
}

async function readShortcuts(): Promise<ShortcutItem[]> {
  const value = await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHORTCUTS, []);
  return Array.isArray(value) ? value.filter(isShortcutItem) : [];
}

function createShortcuts(shortcutItems: ShortcutItem[]): ShortcutsController | null {
  const body = document.body;
  const appRoot = document.querySelector('app-root');

  if (!body || !appRoot || body.querySelector('.np-shortcuts-container')) {
    // TODO Add error handling
    return null;
  }

  const container = createElement('div', 'np-shortcuts-container');
  renderShortcuts(container, shortcutItems);
  body.append(container);

  return {
    update(nextShortcutItems) {
      renderShortcuts(container, nextShortcutItems);
    },
    destroy() {
      container.remove();
    },
  };
}

let shortcuts: ShortcutsController | null = null;

async function updateShortcuts(settingValue?: boolean, shortcutItems?: ShortcutItem[]) {
  const enabled = settingValue ?? (await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.USE_SHORTCUTS, false));

  if (!enabled || isLoginPage(window.location.href)) {
    shortcuts?.destroy();
    shortcuts = null;
    return;
  }

  if (!shortcuts) {
    shortcuts = createShortcuts(await readShortcuts());
  } else if (shortcutItems) {
    shortcuts.update(shortcutItems);
  }
}

async function initializeShortcuts() {
  await updateShortcuts();

  observeMutations(() => void updateShortcuts());
  addNavigationListeners(() => void updateShortcuts());
}

initializeShortcuts();
subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.USE_SHORTCUTS, (newValue) => {
  void updateShortcuts(newValue);
});
subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHORTCUTS, (newValue) => {
  void updateShortcuts(undefined, newValue);
});
