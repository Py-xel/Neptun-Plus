import Toggle_Button from '@/components/general/Toggle_Button';
import ResetSettings from '@/components/settings/ResetSettings';
import { CATEGORIES, KEYS, useStorage } from '@/utils/useStorage';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();

  const [settingsInfo, setSettingsInfo] = useStorage(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.HIDE_HINTS, false);

  return (
    <div>
      <h1>{t('Content.Settings.extensionSettings')}</h1>
      <Toggle_Button label={t('Content.Settings.hideInfo')} enabled={settingsInfo} setEnabled={setSettingsInfo} showInfo={false} />
      <ResetSettings />
    </div>
  );
}
