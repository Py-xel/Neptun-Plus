import InputField from '@/components/general/InputField';
import '@/styles/Vault.css';
import { useStorage } from '@/utils/componentStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Vault() {
  const [vaultAccess, setVaultAccess] = useStorage(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.VAULT_ACCESS, false);
  const [established, setEstablished] = useStorage(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.ESTABLISHED, false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [warning, setWarning] = useState(false);

  const { t } = useTranslation();
  const isNewUser = !established;
  const isLockedExistingUser = established && !vaultAccess;

  const registerPass = (newPassword, confirmNewPassword) => {
    if (newPassword == '' || confirmNewPassword == '' || newPassword != confirmNewPassword) {
      setWarning(true);
    } else {
      setWarning(false);
      setEstablished(true);
    }
  };

  return (
    <div className="np-vault-container">
      <img src="/Neptun_Plus_Logo_White.png" className="np-vault-logo" />
      <div className="np-vault-input-container">
        {isNewUser ? (
          <>
            <InputField type="password" icon={'fa-regular fa-eye'} placeholder={t('Vault.passPlaceholder')} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
            <InputField
              type="password"
              icon={'fa-regular fa-eye'}
              placeholder={t('Vault.passConfirmPlaceholder')}
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
            />
            <button className="np-vault-submit" onClick={() => registerPass(newPassword, confirmNewPassword)}>
              {t('Vault.login')}
            </button>
          </>
        ) : isLockedExistingUser ? (
          <>
            <InputField type="password" icon={'fa-regular fa-eye'} placeholder={t('Vault.passPlaceholder')} value={password} onChange={(event) => setPassword(event.target.value)} />
            <button className="np-vault-submit" onClick={() => setVaultAccess(true)}>
              {t('Vault.login')}
            </button>
            {warning && <p className="np-vault-warning">{t('Vault.passMismatch')}</p>}
          </>
        ) : null}

        {isNewUser && (
          <>
            <p className="np-vault-description">{t('Vault.createDescription')}</p>
            {warning && <p className="np-vault-warning">{t('Vault.passMismatch')}</p>}
          </>
        )}
      </div>
    </div>
  );
}
