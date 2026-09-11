import '@/styles/components/general/disableWrapper.css';

/**
 * Wrapper that disables children elements based on state (fires when true).
 *
 * @param {{ disabled?: boolean, className?: string, children?: React.ReactNode }} props
 * @returns {JSX.Element}
 */

type DisableWrapperProps = {
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function DisableWrapper({ disabled = false, className = '', children }: DisableWrapperProps) {
  return <div className={`${className}${disabled ? ' disabled-state' : ''}`.trim()}>{children}</div>;
}
