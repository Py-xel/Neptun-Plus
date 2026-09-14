import { useToast } from '@/components/general/ToastProvider';
import '@/styles/components/settings/resetSettings.css';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useTranslation } from 'react-i18next';

export default function ResetSettings() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { reset } = useSettings(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LANGUAGE, 'hu');

  const handleReset = async () => {
    try {
      await reset();
      showToast(t('Popup.Toast.reset'), { duration: 1200, type: 'success' });
    } catch {
      // TODO Add error handling
    }
  };

  return (
    <div className="np-reset-container">
      <label className="np-reset-label">{t('Popup.Settings.resetLabel')}</label>
      <button className="np-reset-button" onClick={() => void handleReset()}>
        {t('Popup.Settings.resetButton')}
      </button>
    </div>
  );
}
