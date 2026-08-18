import i18n from '@/i18n';
import { createElement } from '@/utils/utility';

export function createDownloader() {
  const body = document.body;

  if (!body || body.querySelector('.np-download-container')) {
    // TODO: Add error handling
    return false;
  }

  const appRoot = document.querySelector('app-root');
  if (!appRoot) {
    // TODO: Add error handling
    return false;
  }

  const appRootHasContent = appRoot.childElementCount > 0 || (appRoot.textContent || '').trim().length > 0;
  if (!appRootHasContent) {
    // TODO: Add error handling
    return false;
  }

  const container = createElement('div', 'np-download-container');
  const chevron = createElement('i', 'np-download-chevron fa-solid fa-chevron-up');
  const header = createElement('div', 'np-download-header');
  const icon = createElement('i', 'np-download-icon fa-solid fa-download');
  const title = createElement('p', 'np-download-title', i18n.t('Content_Script.downloads'));
  const currentTitle = createElement('p', 'np-download-content-title', i18n.t('Content_Script.downloading'));
  const currentContainer = createElement('div', 'np-download-content-container');
  const completedTitle = createElement('p', 'np-download-content-title', i18n.t('Content_Script.completed'));
  const completedContainer = createElement('div', 'np-download-content-container');
  const footer = createElement('div', 'np-download-footer');

  header.append(icon, title);
  container.append(chevron, header, currentTitle, currentContainer, completedTitle, completedContainer, footer);
  body.append(container);

  let state = 'closed';
  const stateTransitions = {
    closed: 'half',
    half: 'full',
    full: 'closed',
  };

  function setState(nextState) {
    state = nextState;

    container.classList.toggle('np-download-expanded-half', state === 'half');
    container.classList.toggle('np-download-expanded-full', state === 'full');
    chevron.classList.toggle('np-download-chevron-down', state === 'full');
    header.classList.toggle('np-download-stage-header', state === 'full');
  }

  chevron.addEventListener('click', () => {
    setState(stateTransitions[state]);
  });

  return true;
}

function initializeDownloader() {
  if (createDownloader()) {
    return;
  }

  const observer = new MutationObserver(() => {
    if (createDownloader()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.setTimeout(() => {
    observer.disconnect();
    createDownloader();
  }, 5000);
}

// Handle both DOM loading states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDownloader, { once: true });
} else {
  initializeDownloader();
}
