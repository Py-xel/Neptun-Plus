import '@/styles/hooks/DisableWrapper.css';

/**
 * Wrapper that disables children element based on state (fires when true).
 *
 * @param {boolean} props.disabled
 * @param {string} props.className
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */

export default function DisableWrapper({ disabled = false, className = '', children }) {
  return (
    <div className={`${className}${disabled ? ' disabled-state' : ''}`.trim()} aria-disabled={disabled}>
      {children}
    </div>
  );
}
