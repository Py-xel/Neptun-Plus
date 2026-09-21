import Layout from '@/components/Layout';
import Info from '@/pages/Info';
import Interface from '@/pages/Interface';
import Settings from '@/pages/Settings';
import System from '@/pages/System';
import type { SidebarPath } from '@/utils/dataSchema';
import { createMemoryRouter } from 'react-router-dom';

export function createPopupRouter(initialPath: SidebarPath) {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <Layout />,
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
