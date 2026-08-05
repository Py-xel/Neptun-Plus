import { useAnimationGate } from '@/hooks/useAnimationGate';
import '@/styles/components/Toggle_Button.css';
import { useState } from 'react';

export default function Toggle_Button({ enabled, setEnabled, showInfo = true }) {
  const [showPreview, setShowPreview] = useState(false);
  const { isAnimating, triggerAnimation } = useAnimationGate(320);

  const handleToggle = (event) => {
    const nextValue = event.target.checked;

    setEnabled(nextValue);

    if (nextValue !== enabled) {
      triggerAnimation();
    }
  };

  return (
    <div className="optionContainer">
      <div className="toggleContainer">
        <label className="switch">
          <input type="checkbox" checked={enabled} onChange={handleToggle} />
          <span className={`slider${isAnimating ? ' slider--animated' : ''}`} />
        </label>
      </div>
      {showInfo && <i className="fa-regular fa-circle-question" onMouseEnter={() => setShowPreview(true)} onMouseLeave={() => setShowPreview(false)} />}
      {showPreview && <div className="previewWindow" />}
    </div>
  );
}
