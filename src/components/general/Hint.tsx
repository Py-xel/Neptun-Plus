import hintAutoLogin from '@/assets/images/hint_auto_login.png';
import hintShowFileDownloader from '@/assets/images/hint_file_downloader.png';
import hintHideHeaders from '@/assets/images/hint_hide_headers.png';
import hintHideNotifications from '@/assets/images/hint_hide_notifications.png';
import hintInfiniteSession from '@/assets/images/hint_infinite_session.png';
import hintItemLists from '@/assets/images/hint_item_lists.png';
import hintShortcuts from '@/assets/images/hint_shortcuts.png';
import '@/styles/components/general/hint.css';
import { useTranslation } from 'react-i18next';

type HintProps = {
  id: string;
};

const hints: Record<string, { image: string; descriptionKey: string }> = {
  'disable-headers': {
    image: hintHideHeaders,
    descriptionKey: 'Popup.Hints.disableHeaders',
  },
  'hide-notifications': {
    image: hintHideNotifications,
    descriptionKey: 'Popup.Hints.hideNotifications',
  },
  'show-full-itemlist': {
    image: hintItemLists,
    descriptionKey: 'Popup.Hints.itemLists',
  },
  'show-download': {
    image: hintShowFileDownloader,
    descriptionKey: 'Popup.Hints.showFileDownloader',
  },
  'use-shortcuts': {
    image: hintShortcuts,
    descriptionKey: 'Popup.Hints.shortcuts',
  },
  'infinite-session': {
    image: hintInfiniteSession,
    descriptionKey: 'Popup.Hints.infiniteSession',
  },
  'auto-login': {
    image: hintAutoLogin,
    descriptionKey: 'Popup.Hints.autoLogin',
  },
};

export default function Hint({ id }: HintProps) {
  const { t } = useTranslation();
  const hint = hints[id];

  if (!hint) {
    void chrome.runtime
      .sendMessage({
        type: 'NP_ERROR',
        errorType: 'error',
        scope: 'hint',
        message: `Could not resolve hint with id ${id}!`,
      })
      .catch((error: unknown) => {
        console.error('Failed to dispatch error message', error);
      });

    throw new Error(`Could not resolve hint with id '${id}'!`);
  }

  return (
    <div className="np-hint-window">
      <img src={hint.image} />
      <div className="np-hint-description">{t(hint.descriptionKey)}</div>
    </div>
  );
}
