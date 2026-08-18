import icons from '@/data/shortcut_icons.json';
import '@/styles/components/interface/Icon_Picker.css';
import { useEffect, useRef, useState } from 'react';

export default function Icon_Picker({ initialIcon = 'file-lines', onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedIcon = initialIcon;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const handleSelect = (icon) => {
    setIsOpen(false);
    onSelect?.(icon);
  };

  return (
    <div className="iconPickerContainer" ref={containerRef}>
      <button type="button" className="iconButton" onClick={() => setIsOpen((prev) => !prev)}>
        <i className={`fa-regular fa-${selectedIcon}`} />
      </button>
      {isOpen && (
        <div className="iconPickerWindow">
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
