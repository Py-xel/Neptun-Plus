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

export async function initializeItemList(): Promise<void> {
  let enabled = Boolean(await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_FULL_ITEMLIST, false));

  const updateItemListSetting = (): void => {
    applyItemListSetting(enabled);
  };

  updateItemListSetting();

  observeMutations(updateItemListSetting);

  subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_FULL_ITEMLIST, (newValue) => {
    enabled = Boolean(newValue);
    updateItemListSetting();
  });
}
