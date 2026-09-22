import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import type { ShortcutItem } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { addNavigationListeners, createElement, isLoginPage } from '@/utils/utility';

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
  button.append(icon, name);
  button.addEventListener('click', () => {
    window.location.assign(shortcut.link);
  });

  return button;
}

function renderShortcuts(container: HTMLDivElement, shortcutItems: ShortcutItem[], chevron: HTMLElement): void {
  container.replaceChildren(...shortcutItems.map(createShortcutButton), chevron);
}

async function readShortcuts(): Promise<ShortcutItem[]> {
  const value = await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHORTCUTS, []);
  return Array.isArray(value) ? value.filter(isShortcutItem) : [];
}

function createShortcuts(shortcutItems: ShortcutItem[]): ShortcutsController | null {
  const body = document.body;
  const appRoot = document.querySelector('app-root');

  if (body?.querySelector('.np-shortcuts-container')) {
    return null;
  }

  if (!body || !appRoot) {
    void chrome.runtime
      .sendMessage({
        type: 'NP_ERROR',
        errorType: 'warning',
        scope: 'shortcuts',
        message: 'Could not find the document body or app root.',
      })
      .catch((error: unknown) => {
        console.error('Failed to dispatch error message', error);
      });
    return null;
  }

  const masterContainer = createElement('div', 'np-shortcuts-master-container');
  const container = createElement('div', 'np-shortcuts-container');
  const hitbox = createElement('div', 'np-shortcuts-hitbox');
  const chevron = createElement('i', 'np-shortcuts-chevron fa-solid fa-chevron-right');

  renderShortcuts(container, shortcutItems, chevron);
  masterContainer.append(hitbox, container);
  body.append(masterContainer);

  return {
    update(nextShortcutItems) {
      renderShortcuts(container, nextShortcutItems, chevron);
    },
    destroy() {
      masterContainer.remove();
    },
  };
}

let shortcuts: ShortcutsController | null = null;
let shortcutsEnabled: boolean | null = null;

async function updateShortcuts(settingValue?: boolean, shortcutItems?: ShortcutItem[]) {
  const enabled = settingValue ?? shortcutsEnabled ?? (await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.USE_SHORTCUTS, false)) ?? false;
  shortcutsEnabled = enabled;

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

export async function initializeShortcuts() {
  await updateShortcuts();

  addNavigationListeners(() => void updateShortcuts());

  subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.USE_SHORTCUTS, (newValue) => {
    void updateShortcuts(newValue);
  });
  subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHORTCUTS, (newValue) => {
    void updateShortcuts(undefined, newValue);
  });
}
