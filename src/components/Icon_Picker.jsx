import '@/styles/components/Icon_Picker.css';
import { useEffect, useRef, useState } from 'react';
import icons from '@/data/icons.json';

export default function Icon_Picker({ initialIcon = 'file-lines', onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const containerRef = useRef(null);

  useEffect(() => {
    setSelectedIcon(initialIcon);
  }, [initialIcon]);

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
    setSelectedIcon(icon);
    setIsOpen(false);
    onSelect?.(icon);
  };

  return (
    <div className="iconPickerContainer" ref={containerRef}>
      <button type="button" className="iconButton" onClick={() => setIsOpen((prev) => !prev)} aria-label="Open icon picker">
        <i className={`fa-regular fa-${selectedIcon}`} />
      </button>
      {isOpen && (
        <div className="iconPickerWindow" role="dialog">
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
