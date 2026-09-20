import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { addNavigationListeners, createElement, isSupportedURL, observeMutations } from '@/utils/utility';

function createInfSession(): void {
  const existingContainer = document.querySelector('.np-inf-session-container');

  if (!document.body) {
    return;
  }

  if (existingContainer) {
    return;
  }

  const container = createElement('div', 'np-inf-session-container');
  const iconBackground = createElement('span', 'np-inf-session-icon-background');
  const icon = createElement('i', 'fa-solid fa-shield-halved');

  iconBackground.append(icon);
  container.append(iconBackground);
  document.body.append(container);
}

async function updateInfSession(settingValue?: boolean): Promise<void> {
  const enabled = settingValue ?? (await readSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false));
  const shouldEnable = Boolean(enabled && isSupportedURL(window.location.href));

  if (!shouldEnable) {
    document.querySelector('.np-inf-session-container')?.remove();
    return;
  }

  createInfSession();
}

export async function initializeInfSession(): Promise<void> {
  let enabled = Boolean(await readSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false));

  await updateInfSession(enabled);

  observeMutations(() => void updateInfSession(enabled));
  addNavigationListeners(() => void updateInfSession(enabled));
  subscribeToSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, (newValue) => {
    enabled = newValue ?? false;
    void updateInfSession(enabled);
  });
}
