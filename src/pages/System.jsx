import Toggle_Button from '@/components/Toggle_Button';
import { CATEGORIES, KEYS, useStorage } from '@/utils/useStorage';
import { useTranslation } from 'react-i18next';

export default function System() {
  const { t } = useTranslation();

  const [infsession, setInfsession] = useStorage(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false);

  return (
    <div>
      <h1>{t('Content.System.general')}</h1>
      <div className="toggleCombo">
        <p>{t('Content.System.infsession')}</p>
        <Toggle_Button enabled={infsession} setEnabled={setInfsession} showInfo={false} />
      </div>
    </div>
  );
}
