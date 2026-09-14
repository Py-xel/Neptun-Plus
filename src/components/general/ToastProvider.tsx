import Toast from '@/components/general/Toast';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export type ToastType = 'error' | 'warning' | 'success';

export type ToastOptions = {
  duration?: number;
  type?: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, options?: ToastOptions) => void;
};

type ToastState = {
  id: number;
  message: string;
  isClosing: boolean;
  type: ToastType;
};

const ToastContext = createContext<ToastContextValue | null>(null);
/* This must match the $toast-animation-duration in styles, otherwise mounting/dismounting will be off-sync */
const TOAST_EXIT_DURATION = 180;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function showToast(message: string, options: ToastOptions = {}): void {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const duration = options.duration ?? 3000;
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, message, isClosing: false, type: options.type ?? 'success' });

    timeoutRef.current = setTimeout(() => {
      setToast((currentToast) => (currentToast ? { ...currentToast, isClosing: true } : null));

      timeoutRef.current = setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, TOAST_EXIT_DURATION);
    }, duration);
  }

  return (
    <ToastContext value={{ showToast }}>
      {children}
      {toast && <Toast key={toast.id} message={toast.message} isClosing={toast.isClosing} type={toast.type} />}
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    // TODO Add error handling
    throw new Error('useToast must be used within a ToastProvider!');
  }

  return context;
}
