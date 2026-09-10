import '@/styles/components/settings/resetSettings.css';
import { useSettings } from '@/utils/useSettings';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useTranslation } from 'react-i18next';

export default function ResetSettings() {
  const { t } = useTranslation();
  const { reset } = useSettings(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LANGUAGE, 'hu');

  return (
    <div className="np-reset-container">
      <label className="np-reset-label">{t('Content.Settings.resetLabel')}</label>
      <button className="np-reset-button" onClick={() => void reset()}>
        {t('Content.Settings.resetButton')}
      </button>
    </div>
  );
}
