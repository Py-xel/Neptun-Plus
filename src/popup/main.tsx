import ErrorBoundary from '@/components/error/ErrorBoundary';
import { ToastProvider } from '@/components/general/ToastProvider';
import '@/i18n.js';
import { createPopupRouter } from '@/popup/router';
import '@/styles/popup/index.css';
import { CATEGORIES, KEYS, SIDEBAR_PATHS, type SidebarPath } from '@/utils/dataSchema';
import { readSetting } from '@/utils/settingsStore';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

function getRootElement(): HTMLElement {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    // TODO Add error handling
    throw new Error('Root element not found');
  }

  return rootElement;
}

const isSidebarPath = (value: unknown): value is SidebarPath => {
  return SIDEBAR_PATHS.includes(value as SidebarPath);
};

async function getInitialPath(): Promise<SidebarPath> {
  try {
    const storedPath = await readSetting(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LAST_PAGE, '/');
    return isSidebarPath(storedPath) ? storedPath : '/';
  } catch {
    return '/';
  }
}

async function renderPopup() {
  const router = createPopupRouter(await getInitialPath());
  const rootElement = getRootElement();

  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <ToastProvider>
        <Suspense fallback="Loading...">
          <RouterProvider router={router} />
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>,
  );
}

void renderPopup();
