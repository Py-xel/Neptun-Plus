import { useTranslation } from 'react-i18next';

import '../styles/components/Grid_Picker.css';

export default function PositionPicker({ selected, onSelect }) {
  const { t } = useTranslation();
  const positions = ['tl', 'tr', 'bl', 'br'];

  return (
    <div className="grid-container">
      <span className="grid-label">{t('Content.position')}</span>
      <div className="grid-picker">
        {positions.map((pos) => (
          <div key={pos} className={`grid-square ${selected === pos ? 'active' : ''}`} onClick={() => onSelect(pos)} title={pos.toUpperCase()} />
        ))}
      </div>
    </div>
  );
}
