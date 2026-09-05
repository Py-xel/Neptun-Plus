import '@/styles/components/sidebar.css';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav className="np-sidebar-root">
      <NavLink className="np-option-container" to="/">
        <i class="fa-solid fa-desktop" />
        <span>{t('Sidebar.interface')}</span>
      </NavLink>
      <NavLink className="np-option-container" to="System">
        <i class="fa-solid fa-gear" />
        <span>{t('Sidebar.system')}</span>
      </NavLink>
      <NavLink className="np-option-container" to="Info">
        <i class="fa-solid fa-circle-info" />
        <span>{t('Sidebar.info')}</span>
      </NavLink>
      <NavLink className="np-option-container np-extension-settings" to="Settings">
        <i class="fa-solid fa-sliders" />
        <span>{t('Sidebar.settings')}</span>
      </NavLink>
    </nav>
  );
}
