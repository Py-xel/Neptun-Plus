import '@/styles/components/Toggle_Button.css';
import { useState } from 'react';

export default function Toggle_Button({ enabled, setEnabled, showInfo = true }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="toggleContainer">
      <label className="switch">
        <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} />
        <span className="slider"></span>
      </label>
      {showInfo && <i className="fa-regular fa-circle-question" onMouseEnter={() => setShowPreview(true)} onMouseLeave={() => setShowPreview(false)} />}
      {showPreview && <div className="previewWindow" />}
    </div>
  );
}
