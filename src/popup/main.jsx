import '@/popup/i18n.js';
import '@/styles/popup/index.css';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback="Loading...">
    <RouterProvider router={router} />
  </Suspense>,
);
