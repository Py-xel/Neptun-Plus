import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readStorageValue, observeStorageChange } from '@/utils/contentScriptStorage';
import { observeMutations } from '@/utils/utility';

const HEADER_SELECTOR = 'neptun-notification-bar.notification-bar';

function applyHideHeader(enabled) {
  document.querySelectorAll(HEADER_SELECTOR).forEach((header) => {
    header.style.display = enabled ? 'none' : '';
  });
}

async function updateHeaderVisibility() {
  const enabled = await readStorageValue(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, false);

  applyHideHeader(Boolean(enabled));
}

function initHideHeaders() {
  updateHeaderVisibility();

  observeMutations(updateHeaderVisibility);

  observeStorageChange(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, updateHeaderVisibility);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHideHeaders, { once: true });
} else {
  initHideHeaders();
}
