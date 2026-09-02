import { useTranslation } from 'react-i18next';

const WARNING_CONFIG = {
  Vault: {
    passwordMismatch: {
      message: 'Vault.passMismatch',
    },
  },
};

export default function Warning({ type }) {
  const { t } = useTranslation();

  const [category, errorName] = type ? type.split('.') : [];
  const translationKey = WARNING_CONFIG[category]?.[errorName]?.message;

  // TODO Add error handling
  if (!translationKey) return null;

  return <p className="np-warning">{t(translationKey)}</p>;
}
