import '@/styles/components/settings/resetSettings.css';
import { useStorage } from '@/utils/componentStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useTranslation } from 'react-i18next';

export default function ResetSettings() {
  const { t } = useTranslation();
  const storage = useStorage(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LANGUAGE, 'hu');
  const resetAllSettings = storage.resetAllSettings;

  const handleReset = async () => {
    await resetAllSettings();
  };

  return (
    <div className="np-reset-container">
      <label className="np-reset-label">{t('Content.Settings.resetLabel')}</label>
      <button className="np-reset-button" onClick={handleReset}>
        {t('Content.Settings.resetButton')}
      </button>
    </div>
  );
}
