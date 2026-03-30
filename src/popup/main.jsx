import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import './i18n.js';
import { Suspense } from 'react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback="Loading...">
    <RouterProvider router={router} />
  </Suspense>,
);
