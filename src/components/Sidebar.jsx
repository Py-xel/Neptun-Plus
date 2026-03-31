import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../styles/components/Sidebar.css';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav id="Sidebar_Button">
      <NavLink to="/">
        <i class="fa-solid fa-house" />
        <span>{t('Sidebar.home')}</span>
      </NavLink>
      <NavLink to="Interface">
        <i class="fa-solid fa-window-restore" />
        <span>{t('Sidebar.interface')}</span>
      </NavLink>
      <NavLink to="System">
        <i class="fa-solid fa-gear" />
        <span>{t('Sidebar.system')}</span>
      </NavLink>
    </nav>
  );
}
