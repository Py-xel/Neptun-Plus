import '@/styles/components/general/inputField.css';
import { useRef } from 'react';

export default function InputField({ icon = 'none', placeholder, value, onChange, type = 'text' }) {
  const inputRef = useRef(null);

  const focusInput = () => inputRef.current && inputRef.current.focus();

  return (
    <div className="np-input-container" onClick={focusInput}>
      {icon && <i className={icon} />}
      <input ref={inputRef} type={type} className="np-input-field" placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}
