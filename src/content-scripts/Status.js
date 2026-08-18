import universities from '@/data/universities.json';
import i18n from '@/i18n';
import { createElement, normalizeUrl, addNavigationListeners, observeMutations } from '@/utils/utility';

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
    // TODO: Add error handling
    return false;
  }

  const isLoginPage = currentUrl.endsWith('/login');

  const container = isLoginPage ? document.getElementsByClassName(LANGUAGE_DROPDOWN)[0] : document.getElementById(HEADER);

  if (!container || container.querySelector('.np_statusContainer')) {
    return false;
  }

  // Container
  const statusContainer = createElement('div', `np_statusContainer${isLoginPage ? '' : ' np_statusContainer--nonLogin'}`);

  // Logo and title
  const header = createElement('div', 'np_statusHeader');
  const icon = createElement('img', 'np_statusLogo');
  icon.src = chrome.runtime.getURL('/Neptun_Plus_Logo_Wireframe.png');
  const title = createElement('p', 'np_statusTitle', 'Neptun Plus');

  header.append(icon, title);

  // Status indicator
  const statusOuter = createElement('span', 'np_statusOuter');
  const statusInner = createElement('span', 'np_statusInner');
  const statusDot = createElement('span', 'np_statusDot');
  const statusPing = createElement('span', 'np_statusPing');
  const statusSolid = createElement('span', 'np_statusSolid');
  const statusText = createElement('span', 'np_statusText', i18n.t('Content_Script.connected'));

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
