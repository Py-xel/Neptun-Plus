import ToggleButton from '@/components/general/ToggleButton';
import AutoLogin from '@/components/system/AutoLogin';
import Warning from '@/components/system/Warning';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useTranslation } from 'react-i18next';

export default function System() {
  const { t } = useTranslation();

  const { value: infsession, setValue: setInfsession } = useSettings(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false);
  const { value: autoLogin, setValue: setAutoLogin } = useSettings(CATEGORIES.SYSTEM, KEYS.SYSTEM.AUTO_LOGIN, false);
  const { value: warningAccepted, setValue: setWarningAccepted } = useSettings(CATEGORIES.SYSTEM, KEYS.SYSTEM.ACCEPTED_WARNING, false);

  return (
    <div>
      <h1 className="np-title">{t('Popup.System.general')}</h1>
      <ToggleButton label={t('Popup.System.infsession')} enabled={infsession} setEnabled={setInfsession} hintId={KEYS.SYSTEM.INFINITE_SESSION} />
      <h1 className="np-title">{t('Popup.System.login')}</h1>
      <ToggleButton label={t('Popup.System.autologin')} enabled={autoLogin} setEnabled={setAutoLogin} hintId={KEYS.SYSTEM.AUTO_LOGIN} />
      <AutoLogin disabled={!autoLogin} />
      {autoLogin && !warningAccepted && <Warning onAccept={() => setWarningAccepted(true)} />}
    </div>
  );
}
