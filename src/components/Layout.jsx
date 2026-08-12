import Header from '@/components/header/Header';
import Sidebar from '@/components/Sidebar';
import '@/styles/components/Layout.css';
import { Outlet } from 'react-router-dom';

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
