import fileIcons from '@/data/file_icons.json';
import universities from '@/data/universities.json';

/* Create DOM element */
export function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, textContent?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  element.className = className;

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

/* Normalize URL => remove trailing slashes */
export function normalizeURL(url: string): string {
  try {
    const parsedURL = new URL(url);
    const path = parsedURL.pathname.replace(/\/+$/, '');

    return `${parsedURL.origin}${path || '/'}`;
  } catch {
    return url;
  }
}

export function isLoginPage(url: string): boolean {
  return normalizeURL(url).endsWith('/login');
}

/* Returns a string[] of supported URLs */
const SUPPORTED_SITE_ROOTS: string[] = Object.values(universities)
  .filter(({ supported }) => supported)
  .flatMap(({ website }) => {
    const websites = Array.isArray(website) ? website : [website];

    return websites.filter((url) => typeof url === 'string' && url).map(normalizeURL);
  });

export function isSupportedURL(url: string): boolean {
  const currentURL = normalizeURL(url);

  return SUPPORTED_SITE_ROOTS.some((root) => currentURL == root || currentURL.startsWith(`${root}/`));
}

/* Return lowercase file extension */
export function getFileExtension(fileName: string): string {
  const match = fileName.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
  return match ? `.${match[1].toLowerCase()}` : '';
}

export function getIconPath(fileName: string): string {
  const extension = getFileExtension(fileName);
  const iconEntry = fileIcons.find(({ type }) => type.toLowerCase() === extension.toLowerCase());

  if (!iconEntry) {
    return chrome.runtime.getURL('icons/icon_generic.png');
  }

  return chrome.runtime.getURL(`icons/${iconEntry.name}`);
}

/* Format byte data */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  /* Math.min => value is capped at units.length */
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  const precision = value >= 10 || unitIndex === 0 ? 0 : 1;

  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

/* Return stable identifier for a download */
type DownloadData = {
  transport?: string;
  url?: string;
  fileName?: string;
};

export function getDownloadID(downloadData: DownloadData = {}): string {
  return `${downloadData.transport ?? 'unknown'}:${downloadData.url ?? 'unknown'}:${downloadData.fileName ?? 'download'}`;
}

/* Listen for popstate and hashchange */
export function addNavigationListeners(callback: () => void): void {
  for (const event of ['popstate', 'hashchange'] as const) {
    window.addEventListener(event, callback);
  }

  for (const method of ['pushState', 'replaceState'] as const) {
    const original = history[method];

    history[method] = function (...args) {
      const result = original.apply(this, args);
      callback();
      return result;
    };
  }
}

/* Create mutation observer */
export function observeMutations(callback: MutationCallback, options: MutationObserverInit = {}, disconnect: number | null = null): MutationObserver {
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

/* Wait for DOM to be ready */
export function waitForDOM(): Promise<void> {
  if (document.readyState !== 'loading') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
  });
}

/* Wait for Neptun to initialize => #loading-placeholder-index's display is set to none */
export function waitForLoading(selector: string, display: string): Promise<void> {
  const isReady = (): boolean => {
    const element = document.querySelector<HTMLElement>(selector);
    return element !== null && getComputedStyle(element).display === display;
  };

  if (isReady()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const observer = observeMutations(
      () => {
        if (!isReady()) {
          return;
        }

        observer.disconnect();
        resolve();
      },
      { attributes: true, attributeFilter: ['class', 'style'] },
    );
  });
}
