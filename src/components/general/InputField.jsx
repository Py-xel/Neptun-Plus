import '@/styles/components/general/InputField.css';
import { useRef } from 'react';

export default function InputField({ icon = 'none', placeholder, value, onChange, type = 'text' }) {
  const inputRef = useRef(null);

  const focusInput = () => inputRef.current && inputRef.current.focus();

  return (
    <div className="inputContainer" onClick={focusInput}>
      {icon && <i className={icon} />}
      <input ref={inputRef} type={type} className="inputField" placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}
