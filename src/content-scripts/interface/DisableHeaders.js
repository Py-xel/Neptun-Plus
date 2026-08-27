import { observeStorageChange, readStorageValue } from '@/utils/contentScriptStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { observeMutations } from '@/utils/utility';

const HEADER_SELECTOR = 'neptun-notification-bar.notification-bar';

function applyHideHeader(enabled) {
  document.querySelectorAll(HEADER_SELECTOR).forEach((header) => {
    header.style.display = enabled ? 'none' : '';
  });
}

async function initialize() {
  const enabled = await readStorageValue(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, false);

  applyHideHeader(Boolean(enabled));

  observeMutations(() => applyHideHeader(Boolean(enabled)));

  observeStorageChange(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, async () => {
    const enabled = await readStorageValue(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, false);

    applyHideHeader(Boolean(enabled));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
