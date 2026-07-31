import Grid_Picker from '@/components/Grid_Picker';
import Shortcut from '@/components/Shortcut';
import Toggle_Button from '@/components/Toggle_Button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Interface() {
  const { t } = useTranslation();

  const [unfilledSurvey, setUnfilledSurvey] = useState(false);
  const [itemList, setItemList] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [customShortcut, setCustomShortcut] = useState(false);
  const [gridPosition, setGridPosition] = useState('bl'); /* Default to bottom-left */

  return (
    <div>
      <h1>{t('Content.Interface.general')}</h1>
      <div className="toggleCombo">
        <p>{t('Content.Interface.unfilledSurvey')}</p>
        <Toggle_Button enabled={unfilledSurvey} setEnabled={setUnfilledSurvey} />
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
      <Shortcut />
    </div>
  );
}
