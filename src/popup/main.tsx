import ErrorBoundary from '@/components/error/ErrorBoundary';
import { ToastProvider } from '@/components/general/ToastProvider';
import '@/i18n.js';
import { router } from '@/popup/router';
import '@/styles/popup/index.css';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root');

if (!rootElement) {
  // TODO Add error handling
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <ErrorBoundary>
    <ToastProvider>
      <Suspense fallback="Loading...">
        <RouterProvider router={router} />
      </Suspense>
    </ToastProvider>
  </ErrorBoundary>,
);
