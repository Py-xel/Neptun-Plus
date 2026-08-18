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
export function observeMutations(callback) {
  const observer = new MutationObserver(callback);
  const root = document.body || document.documentElement;

  if (root) {
    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  }

  return observer;
}
