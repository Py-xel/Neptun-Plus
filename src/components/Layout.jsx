import Header from '@/components/header/Header';
import Sidebar from '@/components/Sidebar';
import '@/styles/components/layout.css';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="np-root">
      <Header />
      <div className="np-body">
        <Sidebar />
        <main className="np-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
