import '@/styles/components/system/warning.css';
import { Trans, useTranslation } from 'react-i18next';

type WarningProps = {
  onAccept: () => void | Promise<void>;
};

export default function Warning({ onAccept }: WarningProps) {
  const { t } = useTranslation();

  return (
    <div className="np-warning-container">
      <div className="np-warning-header">
        <i className="fa-solid fa-triangle-exclamation" />
        <h2 className="np-warning-title">{t('Popup.System.warningTitle')}</h2>
      </div>
      <p className="np-warning-description">
        <Trans
          i18nKey="Popup.System.warningText"
          components={{
            bold: <strong />,
            br: <br />,
          }}
        />
      </p>
      <button className="np-warning-accept" onClick={onAccept}>
        {t('Popup.System.warningAccept')}
      </button>
    </div>
  );
}
