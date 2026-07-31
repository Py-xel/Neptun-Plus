import Toggle_Button from '@/components/Toggle_Button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();

  const [settingsInfo, setSettingsInfo] = useState(false);

  return (
    <div>
      <h1>{t('Content.Settings.extensionSettings')}</h1>
      <div className="toggleCombo">
        <p>{t('Content.Settings.hideInfo')}</p>
        <Toggle_Button enabled={settingsInfo} setEnabled={setSettingsInfo} showInfo={false} />
      </div>
    </div>
  );
}
