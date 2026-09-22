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
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      void chrome.runtime
        .sendMessage({
          type: 'NP_ERROR',
          errorType: 'error',
          scope: 'reset_settings',
          message: `Could not reset settings: ${message}`,
        })
        .catch((error: unknown) => {
          console.error('Failed to dispatch error message', error);
        });
      showToast(t('Popup.Toast.resetFailed'), { type: 'error' });
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
