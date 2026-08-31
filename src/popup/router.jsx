import Layout from '@/components/Layout';
import Vault from '@/components/Vault';
import Info from '@/pages/Info';
import Interface from '@/pages/Interface';
import Settings from '@/pages/Settings';
import System from '@/pages/System';
import { createMemoryRouter } from 'react-router-dom';

const protectedRoutes = [
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
];

export function createRouter({ isUnlocked }) {
  const routes = isUnlocked ? protectedRoutes : [{ path: '/', element: <Vault /> }];

  return createMemoryRouter(routes);
}
