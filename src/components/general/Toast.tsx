import '@/styles/components/general/toast.css';
import type { ToastType } from '@/components/general/ToastProvider';

type ToastProps = {
  message: string;
  isClosing: boolean;
  type: ToastType;
};

const toastIcons: Record<ToastType, string> = {
  error: 'fa-solid fa-circle-xmark',
  warning: 'fa-solid fa-circle-exclamation',
  success: 'fa-solid fa-circle-check',
};

export default function Toast({ message, isClosing, type }: ToastProps) {
  return (
    <div className={`np-toast-container np-toast-container-${type}${isClosing ? ' np-toast-container-closing' : ''}`}>
      <i className={`${toastIcons[type]} np-toast-icon`} />
      <p className="np-toast-text">{message}</p>
    </div>
  );
}
