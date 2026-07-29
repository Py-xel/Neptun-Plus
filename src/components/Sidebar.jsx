import '@/styles/components/Sidebar.css';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav id="Sidebar_Button">
      <NavLink to="/">
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
