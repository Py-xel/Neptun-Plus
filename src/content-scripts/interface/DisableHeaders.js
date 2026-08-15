import { CATEGORIES, KEYS, readStorageValue, observeStorageChange } from '@/utils/contentScriptStorage';

function getHideHeaderSetting() {
  return readStorageValue(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, false);
}

function applyHideHeader(enabled) {
  const headers = document.querySelectorAll('neptun-notification-bar.notification-bar');

  headers.forEach((header) => {
    header.style.display = enabled ? 'none' : '';
  });
}

async function updateHeaderVisibility() {
  const enabled = await getHideHeaderSetting();
  applyHideHeader(enabled);
}

function HideHeaders() {
  updateHeaderVisibility();

  const observer = new MutationObserver(() => {
    updateHeaderVisibility();
  });

  const root = document.body || document.documentElement;
  if (root) {
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: false,
    });
  }

  observeStorageChange(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, () => {
    updateHeaderVisibility();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', HideHeaders);
} else {
  HideHeaders();
}
