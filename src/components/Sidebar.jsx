import { NavLink } from 'react-router-dom';

import '../styles/components/Sidebar.css';

export default function Sidebar() {
  return (
    <nav id="Sidebar_Button">
      <NavLink to="/">
        <i class="fa-solid fa-house" />
        Home
      </NavLink>
      <NavLink to="Interface">
        <i class="fa-solid fa-window-restore" />
        Interface
      </NavLink>
    </nav>
  );
}
