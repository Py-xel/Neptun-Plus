import '@/styles/components/general/disableWrapper.css';

type DisableWrapperProps = {
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function DisableWrapper({ disabled = false, className = '', children }: DisableWrapperProps) {
  return <div className={`${className}${disabled ? ' disabled-state' : ''}`.trim()}>{children}</div>;
}
