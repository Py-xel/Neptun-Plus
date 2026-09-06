import '@/popup/i18n.js';
import '@/styles/popup/index.css';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { router } from './router';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <ErrorBoundary>
    <Suspense fallback="Loading...">
      <RouterProvider router={router} />
    </Suspense>
  </ErrorBoundary>,
);
