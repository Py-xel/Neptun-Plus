import Layout from '@/components/Layout';
import Fallback from '@/components/error/Fallback';
import Info from '@/pages/Info';
import Interface from '@/pages/Interface';
import Settings from '@/pages/Settings';
import System from '@/pages/System';
import type { SidebarPath } from '@/utils/dataSchema';
import { createMemoryRouter, useRouteError } from 'react-router-dom';

function RouteErrorFallback() {
  const error = useRouteError();
  const normalizedError = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown route error');

  return <Fallback error={normalizedError} />;
}

export function createPopupRouter(initialPath: SidebarPath) {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <Layout />,
        errorElement: <RouteErrorFallback />,
        children: [
          {
            index: true,
            element: <Interface />,
          },
          {
            path: 'System',
            element: <System />,
          },
          {
            path: 'Info',
            element: <Info />,
          },
          {
            path: 'Settings',
            element: <Settings />,
          },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );
}
