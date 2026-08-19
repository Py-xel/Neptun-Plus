import fileIcons from '@/data/file_icons.json';

/* Create DOM element */
export function createElement(tag, className, textContent = null) {
  const element = document.createElement(tag);
  element.className = className;
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
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
export function observeMutations(callback, options = {}) {
  const observer = new MutationObserver(callback);
  const root = document.body || document.documentElement;

  if (root) {
    observer.observe(root, {
      childList: true,
      subtree: true,
      ...options,
    });
  }

  return observer;
}
