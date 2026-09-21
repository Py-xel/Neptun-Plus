import ToggleButton from '@/components/general/ToggleButton';
import Shortcut from '@/components/interface/Shortcuts';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useTranslation } from 'react-i18next';

export default function Interface() {
  const { t } = useTranslation();

  const { value: disableHeaders, setValue: setDisableHeaders } = useSettings(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, false);
  const { value: itemList, setValue: setItemList } = useSettings(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_FULL_ITEMLIST, false);
  const { value: hideNotification, setValue: setHideNotification } = useSettings(CATEGORIES.INTERFACE, KEYS.INTERFACE.HIDE_NOTIFICATIONS, false);
  const { value: showDownload, setValue: setShowDownload } = useSettings(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_DOWNLOAD, false);
  const { value: customShortcut, setValue: setCustomShortcut } = useSettings(CATEGORIES.INTERFACE, KEYS.INTERFACE.USE_SHORTCUTS, false);

  return (
    <div>
      <h1 className="np-title">{t('Popup.Interface.general')}</h1>
      <ToggleButton label={t('Popup.Interface.unfilledSurvey')} enabled={disableHeaders} setEnabled={setDisableHeaders} hintId={KEYS.INTERFACE.DISABLE_HEADERS} />
      <ToggleButton label={t('Popup.Interface.hideNotifications')} enabled={hideNotification} setEnabled={setHideNotification} hintId={KEYS.INTERFACE.HIDE_NOTIFICATIONS} />
      <ToggleButton label={t('Popup.Interface.itemList')} enabled={itemList} setEnabled={setItemList} hintId={KEYS.INTERFACE.SHOW_FULL_ITEMLIST} />
      <h1 className="np-title">{t('Popup.Interface.fileDownload')}</h1>
      <ToggleButton label={t('Popup.Interface.showDownload')} enabled={showDownload} setEnabled={setShowDownload} />
      <h1 className="np-title">{t('Popup.Interface.shortcuts')}</h1>
      <ToggleButton label={t('Popup.Interface.customShortcuts')} enabled={customShortcut} setEnabled={setCustomShortcut} />
      <Shortcut disabled={!customShortcut} />
    </div>
  );
}
