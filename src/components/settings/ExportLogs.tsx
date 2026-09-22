import { useToast } from '@/components/general/ToastProvider';
import '@/styles/components/settings/exportLogs.css';
import { exportErrorLog, clearErrorLog } from '@/utils/errorHandler';
import { useTranslation } from 'react-i18next';

export default function ExportLogs() {
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleExport = async () => {
    try {
      await exportErrorLog();
      showToast(t('Popup.Toast.logsExported'), { duration: 1200, type: 'success' });
    } catch (error) {
      console.error('Failed to export error log', error);
      showToast(t('Popup.Toast.logsExportFailed'), { type: 'error' });
    }
  };

  const handleClear = async () => {
    try {
      await clearErrorLog();
      showToast(t('Popup.Toast.logsCleared'), { duration: 1200, type: 'success' });
    } catch (error) {
      console.error('Failed to clear error log', error);
      showToast(t('Popup.Toast.logsClearFailed'), { type: 'error' });
    }
  };

  return (
    <div className="np-export-container">
      <label className="np-label">{t('Popup.Settings.exportLabel')}</label>
      <div className="np-button-container">
        <button className="np-clear-button" onClick={() => void handleClear()}>
          {t('Popup.Settings.clearButton')}
        </button>
        <button className="np-export-button" onClick={() => void handleExport()}>
          {t('Popup.Settings.exportButton')}
        </button>
      </div>
    </div>
  );
}
