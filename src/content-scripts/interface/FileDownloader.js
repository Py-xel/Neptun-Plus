export function createDownloader() {
  const body = document.body;

  if (!body || body.querySelector('.np_downloadContainer')) {
    // TODO: Add error handling
    return false;
  }

  const appRoot = document.querySelector('app-root');

  if (!appRoot) {
    return false;
  }

  const appRootHasContent = appRoot.childElementCount > 0 || (appRoot.textContent || '').trim().length > 0;

  if (!appRootHasContent) {
    return false;
  }

  const container = document.createElement('div');
  container.className = 'np_downloadContainer';

  const header = document.createElement('div');
  header.className = 'np_downloadHeader';

  const headerInner = document.createElement('div');
  headerInner.className = 'np_downloadHeaderInner';

  const main = document.createElement('div');
  main.className = 'np_downloadMain';

  const footer = document.createElement('div');
  footer.className = 'np_downloadFooter';

  const icon = document.createElement('i');
  icon.className = 'np_downloadIcon fa-solid fa-download';

  const title = document.createElement('p');
  title.className = 'np_downloadTitle';
  title.textContent = 'Download';

  headerInner.append(icon, title);
  header.append(headerInner);
  container.append(header, main, footer);
  body.append(container);

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
