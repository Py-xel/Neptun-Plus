import { useAnimationGate } from '@/hooks/useAnimationGate';
import '@/styles/components/Grid_Picker.css';
import { useTranslation } from 'react-i18next';

export default function PositionPicker({ selected, onSelect, disabled = false }) {
  const { t } = useTranslation();
  const positions = ['tl', 'tr', 'bl', 'br'];
  const { isAnimating, triggerAnimation } = useAnimationGate(320);

  const handleSelect = (pos) => {
    if (pos === selected) return;

    onSelect(pos);
    triggerAnimation();
  };

  return (
    <div
      className="grid-container"
      style={{
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }}>
      <span className="grid-label">{t('Content.Interface.layout')}</span>
      <div className="grid-picker">
        {positions.map((pos) => (
          <div key={pos} className={`grid-square ${selected === pos ? 'active' : ''}${isAnimating ? ' animated' : ''}`} onClick={() => handleSelect(pos)} />
        ))}
      </div>
    </div>
  );
}
