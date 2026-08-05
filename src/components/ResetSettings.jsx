import '@/styles/components/ResetSettings.css';
import { useTranslation } from 'react-i18next';
import { useStorage } from '@/utils/useStorage';

export default function ResetSettings() {
  const { t } = useTranslation();
  const [, , , resetAllSettings] = useStorage('extension-settings', 'language', 'hu');

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
