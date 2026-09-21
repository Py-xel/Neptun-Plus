import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { observeMutations } from '@/utils/utility';

const NOTIFICATION_SELECTOR = 'neptun-badge--primary neptun-badge--secondary';

function applyHideNotifications(enabled: boolean): void {
  document.querySelectorAll<HTMLElement>(NOTIFICATION_SELECTOR).forEach((notification) => {
    notification.style.display = enabled ? 'none' : '';
  });
}

export async function initializeHideNotifications(): Promise<void> {
  let enabled = Boolean(await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.HIDE_NOTIFICATIONS, false));

  applyHideNotifications(enabled);

  observeMutations(() => applyHideNotifications(enabled));

  subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.HIDE_NOTIFICATIONS, (newValue) => {
    enabled = newValue ?? false;
    applyHideNotifications(enabled);
  });
}
