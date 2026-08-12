import '@/styles/components/settings/ResetSettings.css';
import { useStorage } from '@/utils/useStorage';
import { useTranslation } from 'react-i18next';

export default function ResetSettings() {
  const { t } = useTranslation();
  const storage = useStorage('extension-settings', 'language', 'hu');
  const resetAllSettings = storage.resetAllSettings;

  const handleReset = async () => {
    await resetAllSettings();
  };

  return (
    <div className="resetContainer">
      <label className="resetLabel">{t('Content.Settings.resetLabel')}</label>
      <button className="resetButton" onClick={handleReset}>
        {t('Content.Settings.resetButton')}
      </button>
    </div>
  );
}
