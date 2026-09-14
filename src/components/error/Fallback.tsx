import '@/styles/components/error/fallback.css';
import { useTranslation } from 'react-i18next';

function beautifyError(message: string): string {
  const { t } = useTranslation();
  const now = new Date();

  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return `> [${time}] [${t('Error.errorConsole')}] ${message}`;
}

type FallbackProps = {
  error: Error | null;
};

export default function Fallback({ error }: FallbackProps) {
  const { t } = useTranslation();
  return (
    <div className="np-error-container">
      <div className="np-error-header">
        <img src="/Neptun_Plus_Logo_White.png" className="np-vault-logo" />
        <p className="np-error-title">{t('Error.title')}</p>
        <button type="button" onClick={() => window.location.reload()}>
          {t('Error.refresh')}
        </button>
      </div>
      <div className="np-error-footer">
        <div className="np-error-subtext-container">
          <i className="fa-solid fa-triangle-exclamation" />
          <p className="np-error-subtext">{t('Error.details')}</p>
        </div>
        <div className="np-error-message-container">
          <p className="np-error-message">{error && beautifyError(error.message)}</p>
        </div>
      </div>
    </div>
  );
}
