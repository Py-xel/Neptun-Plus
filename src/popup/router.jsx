import { createMemoryRouter } from 'react-router-dom';

import Layout from '../components/Layout';

import Home from '../pages/Home';
import Interface from '../pages/Interface';

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
    ],
  },
]);
