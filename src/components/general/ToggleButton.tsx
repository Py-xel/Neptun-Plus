import '@/styles/components/general/toggleButton.css';
import { useEffect, useState } from 'react';

type ButtonProps = {
  enabled: boolean;
  setEnabled: (value: boolean) => void | Promise<void>;
  label: string;
  showInfo?: boolean;
};

export default function ToggleButton({ enabled, setEnabled, label, showInfo = true }: ButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  /* Reset isAnimating after 300ms */
  useEffect(() => {
    if (!isAnimating) return undefined; // TODO Add error handling

    const timeoutId = window.setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [isAnimating]);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;

    setEnabled(nextValue);

    if (nextValue !== enabled) {
      setIsAnimating(true);
    }
  };

  return (
    <div className="np-toggle-container">
      {label && <p className="np-description">{label}</p>}
      <div className="np-switch-container">
        <label className="np-switch">
          <input type="checkbox" checked={enabled} onChange={handleToggle} />
          <span className={`np-slider${isAnimating ? ' np-slider-animated' : ''}`} />
        </label>
        {showInfo && <i className="fa-regular fa-circle-question" onMouseEnter={() => setShowPreview(true)} onMouseLeave={() => setShowPreview(false)} />}
        {showPreview && <div className="np-preview-window" />}
      </div>
    </div>
  );
}
