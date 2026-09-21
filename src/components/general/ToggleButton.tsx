import '@/styles/components/general/toggleButton.css';
import Hint from '@/components/general/Hint';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useEffect, useState } from 'react';

type ButtonProps = {
  enabled: boolean;
  setEnabled: (value: boolean) => void | Promise<void>;
  label: string;
  showInfo?: boolean;
  hintId?: string;
};

export default function ToggleButton({ enabled, setEnabled, label, showInfo = true, hintId }: ButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { value: hideHints } = useSettings(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.HIDE_HINTS, false);
  const shouldShowInfo = showInfo && hideHints !== true;

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
        {shouldShowInfo && (
          <span className="np-hint-trigger" onMouseEnter={() => setShowPreview(true)} onMouseLeave={() => setShowPreview(false)}>
            <i className="fa-solid fa-info" />
            {showPreview && hintId && <Hint id={hintId} />}
          </span>
        )}
      </div>
    </div>
  );
}
