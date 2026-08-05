import '@/styles/components/Warning.css';
import { useTranslation, Trans } from 'react-i18next';

export default function Warning({ onAccept }) {
  const { t } = useTranslation();

  return (
    <div className="warningContainer">
      <div className="warningHeader">
        <i className="fa-solid fa-triangle-exclamation" />
        <h2 className="warningTitle">{t('Content.System.warningTitle')}</h2>
      </div>
      <p className="warningText">
        <Trans
          i18nKey="Content.System.warningText"
          components={{
            bold: <strong />,
            br: <br />,
          }}
        />
      </p>
      <button className="warningAccept" onClick={onAccept}>
        {t('Content.System.warningAccept')}
      </button>
    </div>
  );
}
