import '@/styles/components/general/alert.css';
import { Trans, useTranslation } from 'react-i18next';

/* info is not used anywhere, but we declare it, in case */
type AlertProps = {
  type: 'warning' | 'info';
  message: string;
  onAccept: () => void | Promise<void>;
};

export default function Alert({ type, message, onAccept }: AlertProps) {
  const { t } = useTranslation();

  const iconByType = {
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info',
  } as const;

  const titleByType = {
    warning: t('Popup.Alert.warning'),
    info: t('Popup.Alert.info'),
  } as const;

  return (
    <>
      <div className="np-alert-background" />
      <div className={`np-alert-container-${type}`}>
        <div className={`np-alert-title-container-${type}`}>
          <i className={`np-icon ${iconByType[type]}`} />
          <p className={`np-alert-title-${type}`}>{titleByType[type]}</p>
        </div>
        <p className={`np-alert-description-${type}`}>
          <Trans
            i18nKey={t(message)}
            components={{
              bold: <strong />,
              br: <br />,
            }}
          />
        </p>
        <button type="button" className={`np-alert-accept-${type}`} onClick={onAccept}>
          {t('Popup.Alert.accept')}
        </button>
      </div>
    </>
  );
}
