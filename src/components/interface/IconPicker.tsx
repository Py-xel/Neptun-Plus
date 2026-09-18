import icons from '@/data/shortcut_icons.json';
import '@/styles/components/interface/iconPicker.css';
import { useEffect, useRef, useState } from 'react';

type IconPickerProps = {
  initialIcon?: string;
  onSelect?: (icon: string) => void;
};

const iconList = icons as string[];

export default function IconPicker({ initialIcon = 'file-lines', onSelect }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedIcon(initialIcon);
  }, [initialIcon]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const handleSelect = (icon: string) => {
    setSelectedIcon(icon);
    setIsOpen(false);
    onSelect?.(icon);
  };

  return (
    <div className="np-icon-picker-container" ref={containerRef}>
      <button type="button" className="np-icon-picker-button" onClick={() => setIsOpen((prev) => !prev)}>
        <i className={`fa-regular fa-${selectedIcon}`} />
      </button>
      {isOpen && (
        <div className="np-icon-picker-window">
          {iconList.map((icon) => (
            <button key={icon} type="button" className={`np-icon-option ${selectedIcon === icon ? 'selected' : ''}`} onClick={() => handleSelect(icon)} title={icon}>
              <i className={`fa-regular fa-${icon}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
