import DisableWrapper from '@/components/general/DisableWrapper';
import '@/styles/components/general/card.css';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type CardProps = {
  isEditable?: boolean;
  children?: ReactNode;
  onRemove?: () => void;
  onSave?: () => void;
};

/* must match transition time of .np-card-top */
const cardTransitionDuration = 160;
const cardCollapseDelay = 800;

const getRemainingExpansionTime = (expandedAt: number) => Math.max(0, cardTransitionDuration - (Date.now() - expandedAt));

const delayCollapse = (callback: () => void, expandedAt: number) => {
  return window.setTimeout(callback, getRemainingExpansionTime(expandedAt) + cardCollapseDelay);
};

export default function Card({ isEditable = false, children, onRemove, onSave }: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimer = useRef<number | undefined>(undefined);
  const expandedAt = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(collapseTimer.current);
  }, []);

  const handleMouseEnter = () => {
    window.clearTimeout(collapseTimer.current);
    expandedAt.current = Date.now();
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    window.clearTimeout(collapseTimer.current);
    collapseTimer.current = delayCollapse(() => setIsExpanded(false), expandedAt.current);
  };

  return (
    <div className={`np-card-container${isExpanded ? ' expanded' : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="np-card-top">
        <DisableWrapper disabled={!isEditable} className="np-card-content">
          {children}
        </DisableWrapper>
      </div>
      <div className="np-card-bottom">
        <div className="np-card-action-container">
          <button type="button" className="np-card-action-remove-container" onClick={onRemove}>
            <i className="fa-solid fa-remove np-card-action-remove" />
          </button>
          <button type="button" className="np-card-action-save-container" onClick={onSave}>
            <i className={`${isEditable ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-pen'} np-card-action-save`} />
          </button>
        </div>
      </div>
    </div>
  );
}
