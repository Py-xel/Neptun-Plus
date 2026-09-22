import '@/styles/components/sidebar.css';
import { CATEGORIES, KEYS, SIDEBAR_PATHS, type SidebarPath } from '@/utils/dataSchema';
import { useSettings } from '@/utils/useSettings';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { value: lastPage, setValue: setLastPage, loading } = useSettings(CATEGORIES.EXTENSION_SETTINGS, KEYS.EXTENSION_SETTINGS.LAST_PAGE, '/');
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  useEffect(() => {
    if (!loading && SIDEBAR_PATHS.includes(pathname as SidebarPath) && pathname !== lastPage) {
      void setLastPage(pathname as SidebarPath).catch((caughtError: unknown) => {
        const nextError = caughtError instanceof Error ? caughtError : new Error(String(caughtError));

        void chrome.runtime
          .sendMessage({
            type: 'NP_ERROR',
            errorType: 'error',
            scope: 'sidebar',
            message: `Could not save the last sidebar path '${pathname}': ${nextError.message}`,
          })
          .catch((dispatchError: unknown) => {
            console.error('Failed to dispatch error message', dispatchError);
          });

        setError(nextError);
      });
    }
  }, [lastPage, loading, pathname, setLastPage]);

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
