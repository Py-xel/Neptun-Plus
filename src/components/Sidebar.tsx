import '@/styles/components/sidebar.css';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav className="np-sidebar-root">
      <NavLink className="np-option-container" to="/">
        <i className="fa-solid fa-desktop" />
        <span>{t('Popup.Sidebar.interface')}</span>
      </NavLink>
      <NavLink className="np-option-container" to="System">
        <i className="fa-solid fa-gear" />
        <span>{t('Popup.Sidebar.system')}</span>
      </NavLink>
      <NavLink className="np-option-container" to="Info">
        <i className="fa-solid fa-circle-info" />
        <span>{t('Popup.Sidebar.info')}</span>
      </NavLink>
      <NavLink className="np-option-container np-extension-settings" to="Settings">
        <i className="fa-solid fa-sliders" />
        <span>{t('Popup.Sidebar.settings')}</span>
      </NavLink>
    </nav>
  );
}
