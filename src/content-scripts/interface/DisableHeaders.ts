import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readSettings, subscribeToSetting } from '@/utils/settingsStore';
import { observeMutations } from '@/utils/utility';

const HEADER_SELECTOR = 'neptun-notification-bar.notification-bar';

function applyHideHeader(enabled: boolean): void {
  document.querySelectorAll<HTMLElement>(HEADER_SELECTOR).forEach((header) => {
    header.style.display = enabled ? 'none' : '';
  });
}

async function initialize(): Promise<void> {
  const settings = await readSettings();
  let enabled = Boolean(settings[CATEGORIES.INTERFACE]?.[KEYS.INTERFACE.DISABLE_HEADERS]);

  applyHideHeader(enabled);

  observeMutations(() => applyHideHeader(enabled));

  subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, (newValue) => {
    enabled = newValue ?? false;
    applyHideHeader(enabled);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
