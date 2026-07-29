import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toggle_Button from '@/components/Toggle_Button';

export default function System() {
  const { t } = useTranslation();

  const [infsession, setInfsession] = useState(false);

  return (
    <div>
      <h1>{t('Content.general')}</h1>
      <div className="toggleCombo">
        <p>{t('Content.infsession')}</p>
        <Toggle_Button enabled={infsession} setEnabled={setInfsession} id="setting.unfilledSurvey" />
      </div>
    </div>
  );
}
