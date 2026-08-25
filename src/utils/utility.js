import fileIcons from '@/data/file_icons.json';
import universities from '@/data/universities.json';

const SUPPORTED_SITE_ROOTS = Object.values(universities)
  .filter(({ supported }) => supported)
  .flatMap(({ website }) => {
    const websites = Array.isArray(website) ? website : [website];

    return websites.filter((url) => typeof url === 'string' && url).map(normalizeUrl);
  });

/* Create DOM element */
export function createElement(tag, className, textContent = null) {
  const element = document.createElement(tag);
  element.className = className;
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

/* Normalize URL path by removing trailing slashes */
export function normalizeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname.replace(/\/+$/, '');

    return `${parsedUrl.origin}${path || '/'}`;
  } catch {
    return url;
  }
}

export function isOnLoginPage(url) {
  return normalizeUrl(url).endsWith('/login');
}

export function isOnSupportedSite(url) {
  const currentURL = normalizeUrl(url);

  return SUPPORTED_SITE_ROOTS.some((root) => currentURL === root || currentURL.startsWith(`${root}/`));
}

/* Format byte data */
export function formatBytes(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  const precision = value >= 10 || unitIndex === 0 ? 0 : 1;

  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

export function getFileIconPath(fileName = '') {
  const extension = getFileExtension(fileName);
  const iconEntry = fileIcons.find(({ type }) => type.toLowerCase() === extension.toLowerCase());

  if (!iconEntry) {
    return chrome.runtime.getURL('icons/icon_generic.png');
  }

  return chrome.runtime.getURL(`icons/${iconEntry.name}`);
}

/* Extract a lowercase file extension from a filename or URL */
export function getFileExtension(fileName = '') {
  const match = String(fileName).match(/\.([a-z0-9]+)(?:[?#]|$)/i);
  return match ? `.${match[1].toLowerCase()}` : '';
}

/* Build a stable identifier for a download */
export function getDownloadIdentifier(downloadData = {}) {
  return `${downloadData.transport || 'unknown'}:${downloadData.url || 'unknown'}:${downloadData.fileName || 'download'}`;
}

/* Listen for popstate and hashchange */
export function addNavigationListeners(callback) {
  for (const event of ['popstate', 'hashchange']) {
    window.addEventListener(event, callback);
  }

  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];

    history[method] = function (...args) {
      const result = original.apply(this, args);
      callback();
      return result;
    };
  }
}

/* Create mutation observer */
export function observeMutations(callback, options = {}, disconnect = null) {
  const observer = new MutationObserver(callback);
  const root = document.body || document.documentElement;

  if (root) {
    observer.observe(root, {
      childList: true,
      subtree: true,
      ...options,
    });
  }

  if (disconnect !== null) {
    setTimeout(() => observer.disconnect(), disconnect);
  }

  return observer;
}
