import { createMemoryRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import Interface from '@/pages/Interface';
import System from '@/pages/System';
import Settings from '@/pages/Settings';

export const router = createMemoryRouter([
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
        path: 'Settings',
        element: <Settings />,
      },
    ],
  },
]);
