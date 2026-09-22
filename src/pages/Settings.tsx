import ToggleButton from '@/components/general/ToggleButton';
import ResetSettings from '@/components/settings/ResetSettings';
import ExportLogs from '@/components/settings/ExportLogs';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();

  const { value: settingsInfo, setValue: setSettingsInfo } = useSettings(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.HIDE_HINTS, false);

  return (
    <div>
      <h1 className="np-title">{t('Popup.Settings.extensionSettings')}</h1>
      <ToggleButton label={t('Popup.Settings.hideInfo')} enabled={settingsInfo} setEnabled={setSettingsInfo} showInfo={false} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'absolute', bottom: '15px' }}>
        <ExportLogs />
        <ResetSettings />
      </div>
    </div>
  );
}
