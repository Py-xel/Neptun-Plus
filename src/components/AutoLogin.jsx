import '@/styles/components/AutoLogin.css';
import { useTranslation } from 'react-i18next';

export default function AutoLogin({ disabled = false }) {
  const { t } = useTranslation();
  return (
    <div
      className="credentialsContainer"
      style={{
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }}>
      <label className="credentialsLabel">{t('Content.System.studentLogin')}</label>
      <div className="credentialsInput">
        <input type="text" className="credentialsName" placeholder={t('Content.System.loginName')} />
        <input type="text" className="credentialsPassword" placeholder={t('Content.System.password')} />
      </div>
    </div>
  );
}
