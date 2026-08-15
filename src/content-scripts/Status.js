import universities from '@/data/universities.json';
import i18n, { syncHtmlLanguage } from '@/i18n';

function normalizeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const normalizedPath = parsedUrl.pathname.replace(/\/+$/, '');
    return `${parsedUrl.origin}${normalizedPath || '/'}`;
  } catch {
    return url;
  }
}

const allowedLoginUrls = new Set(
  Object.values(universities)
    .filter((university) => university.supported)
    .flatMap((university) => {
      const websites = Array.isArray(university.website) ? university.website : [university.website];
      return websites.filter((url) => url && typeof url === 'string').map((url) => `${normalizeUrl(url).replace(/\/+$/, '')}/login`);
    }),
);

function shouldRun() {
  const currentUrl = normalizeUrl(window.location.href);
  return allowedLoginUrls.has(currentUrl);
}

function createStatus() {
  if (!shouldRun()) {
    return false;
  }

  syncHtmlLanguage();

  const container = document.getElementsByClassName('neptun-language-dropdown')[0];

  if (!container) {
    return false;
  }

  if (container.querySelector('.np_statusContainer')) {
    return true;
  }

  const statusContainer = document.createElement('div');
  statusContainer.className = 'np_statusContainer';

  // Logo and Title
  const header = document.createElement('div');
  header.className = 'np_header';

  const icon = document.createElement('img');
  icon.className = 'np_logo';
  icon.src = chrome.runtime.getURL('/Neptun_Plus_Logo_Wireframe.png');

  const title = document.createElement('p');
  title.className = 'np_title';
  title.textContent = 'Neptun Plus';

  header.appendChild(icon);
  header.appendChild(title);

  // Status Indicator
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

  statusDot.appendChild(statusPing);
  statusDot.appendChild(statusSolid);
  statusInner.appendChild(statusDot);
  statusInner.appendChild(statusText);
  statusOuter.appendChild(statusInner);

  statusContainer.appendChild(header);
  statusContainer.appendChild(statusOuter);
  container.appendChild(statusContainer);
  return true;
}

function Status() {
  const recheck = () => createStatus();

  recheck();

  const observer = new MutationObserver(() => {
    recheck();
  });

  const root = document.body || document.documentElement;
  if (root) {
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: false,
    });
  }

  const onNavigation = () => {
    recheck();
  };

  window.addEventListener('popstate', onNavigation);
  window.addEventListener('hashchange', onNavigation);

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    onNavigation();
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    onNavigation();
    return result;
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Status);
} else {
  Status();
}
