import '@/styles/components/general/inputField.css';
import { useRef, useState, type ChangeEvent, type ChangeEventHandler, type RefObject } from 'react';

type InputProps = {
  icon?: string;
  placeholder: string;
  spellCheck?: boolean;
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type: 'text' | 'password';
};

function clearInput(inputRef: RefObject<HTMLInputElement | null>, onChange: ChangeEventHandler<HTMLInputElement>): void {
  const input = inputRef.current;

  if (!input) {
    void chrome.runtime
      .sendMessage({
        type: 'NP_ERROR',
        errorType: 'error',
        scope: 'input_field',
        message: 'Could not resolve <input> reference!',
      })
      .catch((error: unknown) => {
        console.error('Failed to dispatch error message', error);
      });

    throw new Error('Could not resolve <input> reference!');
  }

  input.value = '';
  onChange({ target: input, currentTarget: input } as ChangeEvent<HTMLInputElement>);
}

export default function InputField({ icon = 'none', placeholder, spellCheck = false, value, onChange, type = 'text' }: InputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="np-input-container" onClick={focusInput}>
      {icon && <i className={icon} />}
      <input
        ref={inputRef}
        type={type}
        className="np-input-field"
        spellCheck={spellCheck}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button type="button" className={`np-input-field-clear${isFocused ? ' visible' : ''}`} onMouseDown={(event) => event.preventDefault()} onClick={() => clearInput(inputRef, onChange)}>
        <i className="fa-regular fa-circle-xmark" />
      </button>
    </div>
  );
}
