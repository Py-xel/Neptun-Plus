import '@/styles/components/system/warning.css';
import { useTranslation, Trans } from 'react-i18next';

export default function Warning({ onAccept }) {
  const { t } = useTranslation();

  return (
    <div className="np-warning-container">
      <div className="np-warning-header">
        <i className="fa-solid fa-triangle-exclamation" />
        <h2 className="np-warning-title">{t('Content.System.warningTitle')}</h2>
      </div>
      <p className="np-warning-description">
        <Trans
          i18nKey="Content.System.warningText"
          components={{
            bold: <strong />,
            br: <br />,
          }}
        />
      </p>
      <button className="np-warning-accept" onClick={onAccept}>
        {t('Content.System.warningAccept')}
      </button>
    </div>
  );
}
