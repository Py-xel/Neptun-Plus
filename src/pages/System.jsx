import Toggle_Button from '@/components/general/Toggle_Button';
import AutoLogin from '@/components/system/AutoLogin';
import Warning from '@/components/system/Warning';
import { useStorage } from '@/utils/componentStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useTranslation } from 'react-i18next';

export default function System() {
  const { t } = useTranslation();

  const [infsession, setInfsession] = useStorage(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false);
  const [autoLogin, setAutoLogin] = useStorage(CATEGORIES.SYSTEM, KEYS.SYSTEM.AUTO_LOGIN, false);
  const [warningAccepted, setWarningAccepted] = useStorage(CATEGORIES.SYSTEM, KEYS.SYSTEM.ACCEPTED_WARNING, false);

  return (
    <div>
      <h1>{t('Content.System.general')}</h1>
      <Toggle_Button label={t('Content.System.infsession')} enabled={infsession} setEnabled={setInfsession} showInfo={false} />
      <Toggle_Button label={t('Content.System.autologin')} enabled={autoLogin} setEnabled={setAutoLogin} showInfo={false} />
      <AutoLogin disabled={!autoLogin} />
      {autoLogin && !warningAccepted && <Warning onAccept={() => setWarningAccepted(true)} />}
    </div>
  );
}
