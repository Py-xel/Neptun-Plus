import Grid_Picker from '@/components/Grid_Picker';
import Shortcut from '@/components/Shortcut';
import Toggle_Button from '@/components/Toggle_Button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, KEYS, useStorage } from '@/utils/useStorage';

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
      <div className="toggleCombo">
        <p>{t('Content.Interface.unfilledSurvey')}</p>
        <Toggle_Button enabled={hideHeader} setEnabled={setHideHeader} />
      </div>
      <div className="toggleCombo">
        <p>{t('Content.Interface.itemList')}</p>
        <Toggle_Button enabled={itemList} setEnabled={setItemList} />
      </div>
      <h1>{t('Content.Interface.fileDownload')}</h1>
      <div className="toggleCombo">
        <p>{t('Content.Interface.showDownload')}</p>
        <Toggle_Button enabled={showDownload} setEnabled={setShowDownload} />
      </div>
      <Grid_Picker selected={gridPosition} onSelect={setGridPosition} disabled={!showDownload} />
      <h1>{t('Content.Interface.shortcuts')}</h1>
      <div className="toggleCombo">
        <p>{t('Content.Interface.customShortcuts')}</p>
        <Toggle_Button enabled={customShortcut} setEnabled={setCustomShortcut} />
      </div>
      <Shortcut disabled={!customShortcut} />
    </div>
  );
}
