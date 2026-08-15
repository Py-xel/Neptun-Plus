import { observeStorageChange, readStorageValue } from '@/utils/contentScriptStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { observeMutations } from '@/utils/utility';

const NEXT_VISIBLE_BUTTON_SELECTOR = 'button#next-visible-button';

/* Add error handling */
function applyItemListSetting(enabled) {
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
