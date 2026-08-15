import { observeStorageChange, readStorageValue } from '@/utils/contentScriptStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { observeMutations } from '@/utils/utility';

const NEXT_VISIBLE_BUTTON_SELECTOR = 'button#next-visible-button';

function clickNextVisibleButtons() {
  document.querySelectorAll(NEXT_VISIBLE_BUTTON_SELECTOR).forEach((button) => {
    if (!(button instanceof HTMLElement) || button.dataset.npAutoClickHandled === 'true') {
      return;
    }

    button.dataset.npAutoClickHandled = 'true';
    button.click();
  });
}

function applyItemListSetting(enabled) {
  const buttons = document.querySelectorAll(NEXT_VISIBLE_BUTTON_SELECTOR);

  if (!enabled) {
    buttons.forEach((button) => {
      if (button instanceof HTMLElement) {
        delete button.dataset.npAutoClickHandled;
      }
    });

    return;
  }

  clickNextVisibleButtons();
}

function ItemList() {
  const update = async () => {
    const enabled = await readStorageValue(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_FULL_ITEMLIST, false);

    applyItemListSetting(Boolean(enabled));
  };

  update();

  observeMutations(update);

  observeStorageChange(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_FULL_ITEMLIST, (newValue) => {
    applyItemListSetting(Boolean(newValue));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ItemList, { once: true });
} else {
  ItemList();
}
