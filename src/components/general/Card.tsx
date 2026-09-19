import '@/styles/components/general/card.css';
import DisableWrapper from '@/components/general/DisableWrapper';
import type { ReactNode } from 'react';

type CardProps = {
  isEditable?: boolean;
  children?: ReactNode;
  onRemove?: () => void;
  onSave?: () => void;
};

export default function Card({ isEditable = false, children, onRemove, onSave }: CardProps) {
  return (
    <div className="np-card-container">
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
