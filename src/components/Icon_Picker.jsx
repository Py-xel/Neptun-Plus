import '@/styles/components/Icon_Picker.css';
import { useState } from 'react';
import icons from '@/data/icons.json';

export default function Icon_Picker({ initialIcon = 'face-laugh-beam', onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);

  const handleSelect = (icon) => {
    setSelectedIcon(icon);
    setIsOpen(false);
    onSelect?.(icon);
  };

  return (
    <div className="iconPickerContainer">
      <button type="button" className="iconButton" onClick={() => setIsOpen((prev) => !prev)} aria-label="Open icon picker">
        <i className={`fa-regular fa-${selectedIcon}`} />
      </button>

      {isOpen && (
        <div className="iconPickerWindow" role="dialog" aria-label="Icon picker">
          {icons.map((icon) => (
            <button key={icon} type="button" className={`iconOption ${selectedIcon === icon ? 'selected' : ''}`} onClick={() => handleSelect(icon)} title={icon} aria-label={icon}>
              <i className={`fa-regular fa-${icon}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
