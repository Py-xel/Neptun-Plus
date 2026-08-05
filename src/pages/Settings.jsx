import Toggle_Button from '@/components/Toggle_Button';
import { CATEGORIES, KEYS, useStorage } from '@/utils/useStorage';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();

  const [settingsInfo, setSettingsInfo] = useStorage(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.HIDE_HINTS, false);

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
