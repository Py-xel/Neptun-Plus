import '@/styles/components/general/inputField.css';
import { useRef } from 'react';

type InputProp = {
  icon?: string;
  placeholder: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: 'text' | 'password';
};

export default function InputField({ icon = 'none', placeholder, value, onChange, type = 'text' }: InputProp) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="np-input-container" onClick={focusInput}>
      {icon && <i className={icon} />}
      <input ref={inputRef} type={type} className="np-input-field" placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}
