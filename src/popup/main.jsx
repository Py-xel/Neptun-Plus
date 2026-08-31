import '@/popup/i18n.js';
import '@/styles/popup/index.css';
import { useStorage } from '@/utils/componentStorage';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router';

export default function PopupApp() {
  const [vaultCreated, , isLoading] = useStorage(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.VAULT_ACCESS, false);

  const router = createRouter({
    isUnlocked: Boolean(vaultCreated),
  });

  if (isLoading) {
    return <Suspense fallback="Loading...">Loading...</Suspense>;
  }

  return (
    <Suspense fallback="Loading...">
      <RouterProvider router={router} />
    </Suspense>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PopupApp />);
