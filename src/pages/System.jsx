import AutoLogin from '@/components/AutoLogin';
import Toggle_Button from '@/components/Toggle_Button';
import Warning from '@/components/Warning';
import { CATEGORIES, KEYS, useStorage } from '@/utils/useStorage';
import { useTranslation } from 'react-i18next';

export default function System() {
  const { t } = useTranslation();

  const [infsession, setInfsession] = useStorage(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false);
  const [autoLogin, setAutoLogin] = useStorage(CATEGORIES.SYSTEM, KEYS.SYSTEM.AUTO_LOGIN, false);
  const [warningAccepted, setWarningAccepted] = useStorage(CATEGORIES.SYSTEM, KEYS.SYSTEM.ACCEPTED_WARNING, false);

  return (
    <div>
      <h1>{t('Content.System.general')}</h1>
      <div className="toggleCombo">
        <p>{t('Content.System.infsession')}</p>
        <Toggle_Button enabled={infsession} setEnabled={setInfsession} showInfo={false} />
      </div>
      <div className="toggleCombo">
        <p>{t('Content.System.autologin')}</p>
        <Toggle_Button enabled={autoLogin} setEnabled={setAutoLogin} showInfo={false} />
      </div>
      <AutoLogin disabled={!autoLogin} />
      {autoLogin && !warningAccepted && <Warning onAccept={() => setWarningAccepted(true)} />}
    </div>
  );
}
