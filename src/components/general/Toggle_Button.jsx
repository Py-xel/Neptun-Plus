import { UseAnimationGate } from '@/hooks/UseAnimationGate';
import '@/styles/components/general/Toggle_Button.css';
import { useState } from 'react';

export default function Toggle_Button({ enabled, setEnabled, label, showInfo = true }) {
  const [showPreview, setShowPreview] = useState(false);
  const { isAnimating, triggerAnimation } = UseAnimationGate(320);

  const handleToggle = (event) => {
    const nextValue = event.target.checked;

    setEnabled(nextValue);

    if (nextValue !== enabled) {
      triggerAnimation();
    }
  };

  return (
    <div className="toggleCombo">
      {label && <p className="np-description">{label}</p>}
      <div className="toggleContainer">
        <label className="switch">
          <input type="checkbox" checked={enabled} onChange={handleToggle} />
          <span className={`slider${isAnimating ? ' slider--animated' : ''}`} />
        </label>
        {showInfo && <i className="fa-regular fa-circle-question" onMouseEnter={() => setShowPreview(true)} onMouseLeave={() => setShowPreview(false)} />}
        {showPreview && <div className="previewWindow" />}
      </div>
    </div>
  );
}
