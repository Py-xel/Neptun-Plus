import universities from '@/data/universities.json';
import i18n, { syncHtmlLanguage } from '@/i18n';
import { normalizeUrl, addNavigationListeners, observeMutations } from '@/utils/utility';

const LANGUAGE_DROPDOWN = 'neptun-language-dropdown';
const HEADER = 'main-header-right';
const SUPPORTED_SITE_ROOTS = Object.values(universities)
  .filter(({ supported }) => supported)
  .flatMap(({ website }) => {
    const websites = Array.isArray(website) ? website : [website];

    return websites.filter((url) => typeof url === 'string' && url).map(normalizeUrl);
  });

function createStatus() {
  const currentUrl = normalizeUrl(window.location.href);

  const isSupportedSite = SUPPORTED_SITE_ROOTS.some((root) => currentUrl === root || currentUrl.startsWith(`${root}/`));

  if (!isSupportedSite) {
    /* Add error handling */
    return false;
  }

  syncHtmlLanguage();

  const isLoginPage = currentUrl.endsWith('/login');

  const container = isLoginPage ? document.getElementsByClassName(LANGUAGE_DROPDOWN)[0] : document.getElementById(HEADER);

  if (!container || container.querySelector('.np_statusContainer')) {
    return false;
  }

  // Container
  const statusContainer = document.createElement('div');
  statusContainer.className = `np_statusContainer${isLoginPage ? '' : ' np_statusContainer--nonLogin'}`;

  // Logo and title
  const header = document.createElement('div');
  header.className = 'np_statusHeader';

  const icon = document.createElement('img');
  icon.className = 'np_statusLogo';
  icon.src = chrome.runtime.getURL('/Neptun_Plus_Logo_Wireframe.png');

  const title = document.createElement('p');
  title.className = 'np_statusTitle';
  title.textContent = 'Neptun Plus';

  header.append(icon, title);

  // Status indicator
  const statusOuter = document.createElement('span');
  statusOuter.className = 'np_statusOuter';

  const statusInner = document.createElement('span');
  statusInner.className = 'np_statusInner';

  const statusDot = document.createElement('span');
  statusDot.className = 'np_statusDot';

  const statusPing = document.createElement('span');
  statusPing.className = 'np_statusPing';

  const statusSolid = document.createElement('span');
  statusSolid.className = 'np_statusSolid';

  const statusText = document.createElement('span');
  statusText.className = 'np_statusText';
  statusText.textContent = i18n.t('Content_Script.connected');

  statusDot.append(statusPing, statusSolid);
  statusInner.append(statusDot, statusText);
  statusOuter.append(statusInner);
  statusContainer.append(header, statusOuter);
  container.append(statusContainer);

  return true;
}

createStatus();
observeMutations(createStatus);
addNavigationListeners(createStatus);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createStatus, { once: true });
}
