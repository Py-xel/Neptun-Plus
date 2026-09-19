import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { observeMutations } from '@/utils/utility';

const HEADER_SELECTOR = 'neptun-notification-bar.notification-bar';

function applyHideHeader(enabled: boolean): void {
  document.querySelectorAll<HTMLElement>(HEADER_SELECTOR).forEach((header) => {
    header.style.display = enabled ? 'none' : '';
  });
}

export async function initializeDisableHeaders(): Promise<void> {
  let enabled = Boolean(await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, false));

  applyHideHeader(enabled);

  observeMutations(() => applyHideHeader(enabled));

  subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, (newValue) => {
    enabled = newValue ?? false;
    applyHideHeader(enabled);
  });
}
