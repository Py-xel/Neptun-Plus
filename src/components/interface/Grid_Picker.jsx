import DisableWrapper from '@/hooks/DisableWrapper';
import { UseAnimationGate } from '@/hooks/UseAnimationGate';
import '@/styles/components/interface/Grid_Picker.css';
import { useTranslation } from 'react-i18next';

export default function Grid_Picker({ selected, onSelect, disabled = false }) {
  const { t } = useTranslation();
  const positions = ['tl', 'tr', 'bl', 'br'];
  const { isAnimating, triggerAnimation } = UseAnimationGate(320);

  const handleSelect = (pos) => {
    if (pos === selected) return;

    onSelect(pos);
    triggerAnimation();
  };

  return (
    <DisableWrapper disabled={disabled} className="grid-container">
      <span className="grid-label">{t('Content.Interface.layout')}</span>
      <div className="grid-picker">
        {positions.map((pos) => (
          <div key={pos} className={`grid-square ${selected === pos ? 'active' : ''}${isAnimating ? ' animated' : ''}`} onClick={() => handleSelect(pos)} />
        ))}
      </div>
    </DisableWrapper>
  );
}
