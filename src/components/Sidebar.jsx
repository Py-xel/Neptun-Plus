import '@/styles/components/Sidebar.css';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav id="Sidebar_Button">
      <NavLink to="/">
        <i class="fa-solid fa-desktop" />
        <span>{t('Sidebar.interface')}</span>
      </NavLink>
      <NavLink to="System">
        <i class="fa-solid fa-gear" />
        <span>{t('Sidebar.system')}</span>
      </NavLink>
      <NavLink to="Info">
        <i class="fa-solid fa-circle-info" />
        <span>{t('Sidebar.info')}</span>
      </NavLink>
      <NavLink to="Settings" id="ExtensionSettings">
        <i class="fa-solid fa-sliders" />
        <span>{t('Sidebar.settings')}</span>
      </NavLink>
    </nav>
  );
}
