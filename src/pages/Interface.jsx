import Toggle_Button from '@/components/general/Toggle_Button';
import Grid_Picker from '@/components/interface/Grid_Picker';
import Shortcut from '@/components/interface/Shortcut';
import { useStorage } from '@/utils/componentStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useTranslation } from 'react-i18next';

export default function Interface() {
  const { t } = useTranslation();

  const [hideHeader, setHideHeader] = useStorage(CATEGORIES.INTERFACE, KEYS.INTERFACE.DISABLE_HEADERS, false);
  const [itemList, setItemList] = useStorage(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_FULL_ITEMLIST, false);
  const [showDownload, setShowDownload] = useStorage(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_DOWNLOAD, false);
  const [customShortcut, setCustomShortcut] = useStorage(CATEGORIES.INTERFACE, KEYS.INTERFACE.USE_SHORTCUTS, false);
  const [gridPosition, setGridPosition] = useStorage(CATEGORIES.INTERFACE, KEYS.INTERFACE.GRID_POSITION, 'bl');

  return (
    <div>
      <h1>{t('Content.Interface.general')}</h1>
      <Toggle_Button label={t('Content.Interface.unfilledSurvey')} enabled={hideHeader} setEnabled={setHideHeader} />
      <Toggle_Button label={t('Content.Interface.itemList')} enabled={itemList} setEnabled={setItemList} />
      <h1>{t('Content.Interface.fileDownload')}</h1>
      <Toggle_Button label={t('Content.Interface.showDownload')} enabled={showDownload} setEnabled={setShowDownload} />
      <Grid_Picker selected={gridPosition} onSelect={setGridPosition} disabled={!showDownload} />
      <h1>{t('Content.Interface.shortcuts')}</h1>
      <Toggle_Button label={t('Content.Interface.customShortcuts')} enabled={customShortcut} setEnabled={setCustomShortcut} />
      <Shortcut disabled={!customShortcut} />
    </div>
  );
}
