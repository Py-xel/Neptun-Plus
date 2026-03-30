import { Outlet } from 'react-router-dom';

import '../styles/components/Layout.css';

import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div id="Layout">
      <Header />
      <div id="Layout_Body">
        <Sidebar />
        <main id="Layout_Content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
