import i18n from '@/i18n';
import { createElement, formatBytes, getDownloadIdentifier, getFileIconPath, observeMutations } from '@/utils/utility.js';

const viewTransitions = {
  closed: { TOGGLE: 'full' },
  half: { TOGGLE: 'full', DOWNLOAD_COMPLETED: 'closed' },
  full: { TOGGLE: 'closed' },
};

function createInitialState() {
  return {
    view: 'closed',
    activeDownloads: {},
    completedDownloads: [],
    nextCompletionId: 0,
  };
}

function reducer(state, action) {
  const nextView = viewTransitions[state.view]?.[action.type] || state.view;

  switch (action.type) {
    case 'TOGGLE': {
      const hasActiveDownloads = Object.keys(state.activeDownloads).length > 0;
      const view = state.view === 'full' && hasActiveDownloads ? 'half' : nextView;

      return { ...state, view };
    }

    case 'DOWNLOAD_COMPLETED': {
      const { [action.download.id]: completedDownload, ...activeDownloads } = state.activeDownloads;
      const finalDownload = {
        ...completedDownload,
        ...action.download,
        completionId: state.nextCompletionId,
      };

      return {
        ...state,
        view: nextView,
        activeDownloads,
        completedDownloads: [finalDownload, ...state.completedDownloads],
        nextCompletionId: state.nextCompletionId + 1,
      };
    }

    case 'DOWNLOAD_STARTED':
    case 'DOWNLOAD_UPDATED':
      return {
        ...state,
        view: state.view === 'closed' ? 'half' : state.view,
        activeDownloads: {
          ...state.activeDownloads,
          [action.download.id]: action.download,
        },
      };

    default:
      return state;
  }
}

function abortDownload(downloadId) {
  window.dispatchEvent(
    new CustomEvent('__np_abort_download__', {
      detail: { id: downloadId },
    }),
  );
  console.log('Abort download!');
}

function createCard(downloadData = {}, isCompleted = false) {
  let completed = isCompleted;
  const cardContainer = createElement('div', 'np-download-card-container');
  const containerLeft = createElement('div', 'np-download-card-container-left');
  const icon = createElement('img', 'np-download-card-icon');
  icon.src = getFileIconPath(downloadData.fileName || '');
  const containerMiddle = createElement('div', 'np-download-card-container-middle');
  const fileName = createElement('p', 'np-download-card-file-name', downloadData.fileName || 'Download');
  const dataContainer = createElement('div', 'np-download-card-data-container');
  const currentBytes = createElement('p', 'np-download-card-byte-data', formatBytes(downloadData.receivedBytes || 0));
  const divider_1 = createElement('p', 'np-download-card-byte-data', '/');
  const totalBytes = createElement('p', 'np-download-card-byte-data', formatBytes(downloadData.totalBytes || 0));
  const divider_2 = createElement('p', 'np-download-card-byte-data', '•');
  const streamBytes = createElement('p', 'np-download-card-byte-data', `${formatBytes(downloadData.speed || 0)}/s`);
  const barContainer = createElement('div', 'np-download-card-bar-container');
  const bar = createElement('div', 'np-download-card-bar');
  const fill = createElement('div', 'np-download-card-fill');
  const containerRight = createElement('div', 'np-download-card-container-right');
  const cancelDownload = createElement('i', 'np-download-card-cancel fa-solid fa-xmark');

  cardContainer.append(containerLeft, containerMiddle, containerRight);
  containerLeft.append(icon);
  containerMiddle.append(fileName, dataContainer, barContainer);
  dataContainer.append(currentBytes, divider_1, totalBytes, divider_2, streamBytes);
  barContainer.append(bar, fill);
  containerRight.append(cancelDownload);

  if (isCompleted) {
    cardContainer.classList.add('np-download-card-container-complete');
    cancelDownload.remove();
  } else {
    cancelDownload.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      abortDownload(downloadData.id || getDownloadIdentifier(downloadData));
    });
  }

  /* Update only mutable values (only byte data) */
  return {
    card: cardContainer,
    update(download) {
      currentBytes.textContent = formatBytes(download.receivedBytes || 0);
      totalBytes.textContent = formatBytes(download.totalBytes || 0);

      const total = Number.isFinite(download.totalBytes) && download.totalBytes > 0 ? download.totalBytes : 0;
      const received = Number.isFinite(download.receivedBytes) ? download.receivedBytes : 0;
      const width = total > 0 ? `${Math.min((received / total) * 100, 100)}%` : '0%';
      fill.style.width = completed ? '100%' : width;

      if (completed) {
        streamBytes.textContent = download.type === 'complete' ? 'Complete' : 'Failed';
        applyBarCompletion(fill, download.type);
      } else {
        streamBytes.textContent = `${formatBytes(download.speed || 0)}/s`;
      }

      applyBarCompletion(fill, completed ? download.type : null);
    },
    complete(download) {
      completed = true;
      cardContainer.classList.add('np-download-card-container-complete', 'np-download-card-container-completing');
      cancelDownload.remove();
      this.update(download);
    },
  };
}

function createDownloader() {
  const body = document.body;
  const appRoot = document.querySelector('app-root');

  if (!body || !appRoot || body.querySelector('.np-download-container')) {
    // TODO Add error handling
    return false;
  }

  const container = createElement('div', 'np-download-container');
  const chevron = createElement('i', 'np-download-chevron fa-solid fa-chevron-up');
  const currentTitle = createElement('p', 'np-download-content-title', i18n.t('Content_Script.downloading'));
  const currentContainer = createElement('div', 'np-download-content-current-container');
  const completedTitle = createElement('p', 'np-download-content-title', i18n.t('Content_Script.completed'));
  const completedContainer = createElement('div', 'np-download-content-completed-container');
  const footer = createElement('div', 'np-download-footer');

  container.append(chevron, currentTitle, currentContainer, completedTitle, completedContainer, footer);
  body.append(container);

  /* State management */
  let state = createInitialState();
  const activeCards = new Map();
  const completedCards = new Map();
  let completedCardOrder = '';
  let titleRevealTimer;
  let titlesAreVisible;

  function setTitleExpanded(title, expanded) {
    title.style.height = expanded ? '34px' : '0px';
    title.style.padding = expanded ? '14px 0px 6px 16px' : '0px';
    title.style.opacity = expanded ? '1' : '0';
  }

  function updateTitleVisibility(nextView) {
    const shouldShowTitles = nextView === 'full';

    if (shouldShowTitles === titlesAreVisible) return;

    if (!shouldShowTitles) {
      clearTimeout(titleRevealTimer);
      titleRevealTimer = undefined;
      titlesAreVisible = false;

      for (const title of [currentTitle, completedTitle]) {
        setTitleExpanded(title, false);
        title.addEventListener(
          'transitionend',
          () => {
            if (title.style.opacity === '0') title.style.display = 'none';
          },
          { once: true },
        );
      }

      return;
    }

    titlesAreVisible = true;
    for (const title of [currentTitle, completedTitle]) {
      title.style.display = 'flex';
      setTitleExpanded(title, false);
    }

    titleRevealTimer = window.setTimeout(() => {
      titleRevealTimer = undefined;

      requestAnimationFrame(() => {
        if (titlesAreVisible) {
          for (const title of [currentTitle, completedTitle]) setTitleExpanded(title, true);
        }
      });
    }, 300);
  }

  function render(nextState) {
    container.classList.toggle('np-download-expanded-closed', nextState.view === 'closed');
    container.classList.toggle('np-download-expanded-half', nextState.view === 'half');
    container.classList.toggle('np-download-expanded-full', nextState.view === 'full');
    chevron.classList.toggle('np-download-chevron-down', nextState.view === 'full');

    updateTitleVisibility(nextState.view);

    for (const [downloadId, download] of Object.entries(nextState.activeDownloads)) {
      let cardEntry = activeCards.get(downloadId);

      if (!cardEntry) {
        cardEntry = createCard(download);
        activeCards.set(downloadId, cardEntry);
      }

      cardEntry.update(download);

      if (cardEntry.card.parentNode !== currentContainer) {
        currentContainer.append(cardEntry.card);
      }
    }

    for (const [downloadId, cardEntry] of activeCards) {
      if (!nextState.activeDownloads[downloadId]) {
        cardEntry.card.remove();
        activeCards.delete(downloadId);
      }
    }

    const nextCompletedCardOrder = nextState.completedDownloads.map((download) => download.completionId).join('|');
    if (nextCompletedCardOrder !== completedCardOrder) {
      completedCardOrder = nextCompletedCardOrder;

      for (const download of nextState.completedDownloads) {
        let cardEntry = completedCards.get(download.completionId);

        if (!cardEntry) {
          cardEntry = activeCards.get(download.id);

          if (cardEntry) {
            activeCards.delete(download.id);
            cardEntry.complete(download);
          } else {
            cardEntry = createCard(download, true);
            cardEntry.card.classList.add('np-download-card-container-completing');
          }

          completedCards.set(download.completionId, cardEntry);
        }

        cardEntry.update(download);
      }

      completedContainer.replaceChildren(...nextState.completedDownloads.map((download) => completedCards.get(download.completionId).card));
    }
  }

  function dispatch(action) {
    state = reducer(state, action);
    render(state);
  }

  chevron.addEventListener('click', () => {
    dispatch({ type: 'TOGGLE' });
  });

  window.addEventListener('__np_download_event__', (event) => {
    const download = event.detail || {};

    if (!download.url && !download.fileName) {
      return;
    }

    const normalizedDownload = {
      ...download,
      id: download.id || getDownloadIdentifier(download),
    };

    const actionType =
      normalizedDownload.type === 'start' ? 'DOWNLOAD_STARTED' : normalizedDownload.type === 'complete' || normalizedDownload.type === 'error' ? 'DOWNLOAD_COMPLETED' : 'DOWNLOAD_UPDATED';

    dispatch({ type: actionType, download: normalizedDownload });
  });

  render(state);

  return true;
}

function initializeDownloader() {
  if (createDownloader()) return;

  const observer = observeMutations(
    () => {
      if (createDownloader()) observer.disconnect();
    },
    {
      childList: true,
      subtree: true,
    },
  );

  window.setTimeout(() => {
    observer.disconnect();
    createDownloader();
  }, 5000);
}

function applyBarCompletion(fillBar, status) {
  fillBar.classList.remove('np-download-card-fill-complete', 'np-download-card-fill-fail');

  switch (status) {
    case 'complete':
      fillBar.classList.add('np-download-card-fill-complete');
      break;

    case 'error':
      fillBar.classList.add('np-download-card-fill-fail');
      break;

    default:
      break;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDownloader, { once: true });
} else {
  initializeDownloader();
}
