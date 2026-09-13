import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { observeMutations } from '@/utils/utility';

const NEXT_VISIBLE_BUTTON_SELECTOR = 'button#next-visible-button';

/* Add error handling */
function applyItemListSetting(enabled: boolean): void {
  document.querySelectorAll(NEXT_VISIBLE_BUTTON_SELECTOR).forEach((button) => {
    if (!(button instanceof HTMLElement)) {
      return;
    }

    if (!enabled) {
      delete button.dataset.npClicked;
      return;
    }

    if (button.dataset.npClicked === 'true') {
      return;
    }

    button.dataset.npClicked = 'true';
    button.click();
  });
}

function initializeItemList(): () => void {
  const update = async (): Promise<void> => {
    const enabled = await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_FULL_ITEMLIST, false);

    applyItemListSetting(Boolean(enabled));
  };

  const mutationObserver = observeMutations(() => {
    void update();
  });

  const unsubscribe = subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_FULL_ITEMLIST, (newValue) => {
    applyItemListSetting(Boolean(newValue));
  });

  void update();

  return () => {
    mutationObserver.disconnect();
    unsubscribe();
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeItemList, { once: true });
} else {
  initializeItemList();
}
