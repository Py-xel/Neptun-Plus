import Alert from '@/components/general/Alert';
import ToggleButton from '@/components/general/ToggleButton';
import AutoLogin from '@/components/system/AutoLogin';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function System() {
  const { t } = useTranslation();
  const [pendingInfiniteSessionEnable, setPendingInfiniteSessionEnable] = useState(false);

  const { value: infsession, setValue: setInfsession } = useSettings(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false);
  const { value: autoLogin, setValue: setAutoLogin } = useSettings(CATEGORIES.SYSTEM, KEYS.SYSTEM.AUTO_LOGIN, false);
  const { value: autoLoginWarning, setValue: setAutoLoginWarning } = useSettings(CATEGORIES.SYSTEM, KEYS.SYSTEM.ACCEPTED_WARNING__AUTO_LOGIN, false);

  const handleInfiniteSessionToggle = (nextValue: boolean) => {
    if (nextValue) {
      setPendingInfiniteSessionEnable(true);
      return;
    }

    void setInfsession(false);
  };

  const acceptInfiniteSessionWarning = async () => {
    setPendingInfiniteSessionEnable(false);
    await setInfsession(true);
  };

  const cancelInfiniteSessionWarning = () => {
    setPendingInfiniteSessionEnable(false);
  };

  return (
    <div>
      <h1 className="np-title">{t('Popup.System.general')}</h1>
      <ToggleButton label={t('Popup.System.infsession')} enabled={infsession} setEnabled={handleInfiniteSessionToggle} hintId={KEYS.SYSTEM.INFINITE_SESSION} />
      <h1 className="np-title">{t('Popup.System.login')}</h1>
      <ToggleButton label={t('Popup.System.autologin')} enabled={autoLogin} setEnabled={setAutoLogin} hintId={KEYS.SYSTEM.AUTO_LOGIN} />
      {pendingInfiniteSessionEnable && <Alert type={'warning'} message={'Popup.Alert.infSession'} onAccept={acceptInfiniteSessionWarning} onBack={cancelInfiniteSessionWarning} />}
      <AutoLogin disabled={!autoLogin} />
      {autoLogin && !autoLoginWarning && <Alert type={'warning'} message={'Popup.Alert.autoLogin'} onAccept={() => setAutoLoginWarning(true)} />}
    </div>
  );
}
