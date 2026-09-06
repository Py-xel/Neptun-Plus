import { UseAnimationGate } from '@/hooks/UseAnimationGate';
import '@/styles/components/general/toggleButton.css';
import { useState } from 'react';

export default function Toggle_Button({ enabled, setEnabled, label, showInfo = true }) {
  const [showPreview, setShowPreview] = useState(false);
  const { isAnimating, triggerAnimation } = UseAnimationGate(320);

  const handleToggle = (event) => {
    const nextValue = event.target.checked;

    setEnabled(nextValue);

    if (nextValue !== enabled) {
      triggerAnimation();
      console.log('transition button!');
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
