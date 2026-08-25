import i18n from '@/i18n';
import { addNavigationListeners, createElement, isOnLoginPage, isOnSupportedSite, observeMutations } from '@/utils/utility';

const LANGUAGE_DROPDOWN = 'neptun-language-dropdown';
const HEADER = 'main-header-right';

function createStatus() {
  const container = isOnLoginPage(window.location.href) ? document.getElementsByClassName(LANGUAGE_DROPDOWN)[0] : document.getElementById(HEADER);

  if (!container || container.querySelector('.np_statusContainer')) {
    // TODO Add error handling
    return false;
  }

  // Container
  const statusContainer = createElement('div', `np_statusContainer${isOnLoginPage(window.location.href) ? '' : ' np_statusContainer--nonLogin'}`);

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

function initializeStatus() {
  if (!isOnSupportedSite(window.location.href)) {
    // TODO Add error handling
    return false;
  }

  createStatus();
  observeMutations(createStatus);
  addNavigationListeners(createStatus);
}

initializeStatus();
