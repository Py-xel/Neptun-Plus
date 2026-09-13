import i18n from '@/i18n';
import { addNavigationListeners, createElement, isLoginPage, isSupportedURL, observeMutations } from '@/utils/utility';

const LANGUAGE_DROPDOWN = 'neptun-language-dropdown';
const HEADER = 'main-header-right';

function createStatus(): void {
  const container = isLoginPage(window.location.href) ? document.getElementsByClassName(LANGUAGE_DROPDOWN)[0] : document.getElementById(HEADER);

  if (!container || container.querySelector('.np-status-container')) {
    // TODO Add error handling
    return;
  }

  // Container
  const statusContainer = createElement('div', `np-status-container${isLoginPage(window.location.href) ? '' : ' np-status-container--nonLogin'}`);

  // Logo and title
  const header = createElement('div', 'np-status-header');
  const icon = createElement('img', 'np-status-logo');
  icon.src = chrome.runtime.getURL('/Neptun_Plus_Logo_Wireframe.png');
  const title = createElement('p', 'np-status-title', 'Neptun Plus');

  header.append(icon, title);

  // Status indicator
  const statusOuter = createElement('span', 'np-status-outer');
  const statusInner = createElement('span', 'np-status-inner');
  const statusDot = createElement('span', 'np-status-dot');
  const statusPing = createElement('span', 'np-status-ping');
  const statusSolid = createElement('span', 'np-status-solid');
  const statusText = createElement('span', 'np-status-text', i18n.t('Content_Script.connected'));

  statusDot.append(statusPing, statusSolid);
  statusInner.append(statusDot, statusText);
  statusOuter.append(statusInner);
  statusContainer.append(header, statusOuter);
  container.append(statusContainer);

  return;
}

function initializeStatus(): void {
  if (!isSupportedURL(window.location.href)) {
    // TODO Add error handling
    return;
  }

  createStatus();
  observeMutations(createStatus);
  addNavigationListeners(createStatus);
}

initializeStatus();
