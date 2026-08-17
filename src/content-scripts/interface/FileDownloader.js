export function createDownloader() {
  const body = document.body;

  if (!body || body.querySelector('.np_downloadContainer')) {
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

  const container = document.createElement('div');
  container.className = 'np_downloadContainer';

  const chevron = document.createElement('i');
  chevron.className = 'np_downloadChevron fa-solid fa-chevron-up';

  const header = document.createElement('div');
  header.className = 'np_downloadHeader';

  const icon = document.createElement('i');
  icon.className = 'np_downloadIcon fa-solid fa-download';

  const title = document.createElement('p');
  title.className = 'np_downloadTitle';
  title.textContent = 'Download';

  header.append(icon, title);
  container.append(chevron, header);
  body.append(container);

  let state = 'closed';
  function setState(nextState) {
    state = nextState;

    container.classList.toggle('np_downloadExpanded_Half', state === 'half');
    container.classList.toggle('np_downloadExpanded_Full', state === 'full');
    chevron.classList.toggle('np_downloadChevronDown', state === 'full');
    header.classList.toggle('np_downloadStage_Header', state === 'full');
  }

  chevron.addEventListener('click', () => {
    switch (state) {
      case 'closed':
        setState('half');
        break;

      case 'half':
        setState('full');
        break;

      case 'full':
        setState('closed');
        break;
    }
  });

  return true;
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      const checkAppRoot = () => {
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
      };

      checkAppRoot();
    },
    { once: true },
  );
} else {
  const checkAppRoot = () => {
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
  };

  checkAppRoot();
}
