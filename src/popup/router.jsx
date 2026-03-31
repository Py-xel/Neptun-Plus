import { createMemoryRouter } from 'react-router-dom';

import Layout from '../components/Layout';

import Home from '../pages/Home';
import Interface from '../pages/Interface';
import System from '../pages/System';

export const router = createMemoryRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <Interface />,
        path: 'Interface',
      },
      {
        element: <System />,
        path: 'System',
      },
    ],
  },
]);
