import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import Toggle_Button from '../components/Toggle_Button';
import Grid_Picker from '../components/Grid_Picker';

export default function Interface() {
  const { t } = useTranslation();

  const [unfilledSurvey, setUnfilledSurvey] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [customWidget, setCustomWidget] = useState(false);
  const [gridPosition, setGridPosition] = useState('bl'); /* Default to bottom-left */

  return (
    <div>
      <h1>{t('Content.general')}</h1>
      <div className="toggleCombo">
        <p>{t('Content.unfilledSurvey')}</p>
        <Toggle_Button enabled={unfilledSurvey} setEnabled={setUnfilledSurvey} id="setting.unfilledSurvey" />
      </div>
      <div className="toggleCombo">
        <p>{t('Content.showDownload')}</p>
        <Toggle_Button enabled={showDownload} setEnabled={setShowDownload} id="setting.showDownload" />
      </div>
      {showDownload && <Grid_Picker selected={gridPosition} onSelect={setGridPosition} />}
      <div className="toggleCombo">
        <p>{t('Content.customWidget')}</p>
        <Toggle_Button enabled={customWidget} setEnabled={setCustomWidget} id="setting.customWidget" />
      </div>
    </div>
  );
}
