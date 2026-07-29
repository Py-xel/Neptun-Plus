import { createMemoryRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import Interface from '@/pages/Interface';
import System from '@/pages/System';

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
    ],
  },
]);
