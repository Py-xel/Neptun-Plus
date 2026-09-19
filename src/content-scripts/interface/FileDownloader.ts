import i18n from '@/i18n';
import actionBarStyles from '@/styles/content-scripts/actionBar.css?inline';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { addNavigationListeners, createElement, formatBytes, getDownloadID, getIconPath, isLoginPage, isSupportedURL, observeMutations } from '@/utils/utility';

const viewTransitions = {
  closed: { TOGGLE: 'full' },
  half: { TOGGLE: 'full', DOWNLOAD_COMPLETED: 'closed' },
  full: { TOGGLE: 'closed' },
};

type DownloadType = 'start' | 'progress' | 'complete' | 'error';
type DownloadView = keyof typeof viewTransitions;

type Download = {
  id: string;
  type: DownloadType;
  transport?: 'fetch' | 'xhr';
  url?: string;
  fileName?: string;
  receivedBytes?: number;
  totalBytes?: number;
  speed?: number;
  error?: string;
  completionId?: number;
};

type CompletedDownload = Download & { completionId: number };

type DownloaderState = {
  view: DownloadView;
  activeDownloads: Record<string, Download>;
  completedDownloads: CompletedDownload[];
  nextCompletionId: number;
};

type DownloadAction = { type: 'TOGGLE' } | { type: 'CLEAR_COMPLETED' } | { type: 'DOWNLOAD_STARTED' | 'DOWNLOAD_UPDATED' | 'DOWNLOAD_COMPLETED'; download: Download };

function createInitialState(): DownloaderState {
  return {
    view: 'closed',
    activeDownloads: {},
    completedDownloads: [],
    nextCompletionId: 0,
  };
}

function reducer(state: DownloaderState, action: DownloadAction): DownloaderState {
  const transitions = viewTransitions[state.view] as Partial<Record<DownloadAction['type'], DownloadView>>;
  const nextView = transitions[action.type] ?? state.view;

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

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        completedDownloads: [],
      };

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

function abortDownload(downloadId: string): void {
  window.dispatchEvent(
    new CustomEvent('__np_abort_download__', {
      detail: { id: downloadId },
    }),
  );
  console.log('Abort download!');
}

function updateActionBarStyles(enabled: boolean): void {
  const styleId = 'np-action-bar-styles';
  const existingStyles = document.getElementById(styleId);

  if (!enabled) {
    existingStyles?.remove();
    return;
  }

  if (existingStyles) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = actionBarStyles;
  (document.head || document.documentElement).append(style);
}

type CardEntry = {
  card: HTMLDivElement;
  update: (download: Download) => void;
  complete: (download: Download) => void;
};

function createCard(downloadData: Download, isCompleted = false): CardEntry {
  let completed = isCompleted;
  const cardContainer = createElement('div', 'np-download-card-container');
  const containerLeft = createElement('div', 'np-download-card-container-left');
  const icon = createElement('img', 'np-download-card-icon');
  icon.src = getIconPath(downloadData.fileName || '');
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
      abortDownload(downloadData.id || getDownloadID(downloadData));
    });
  }

  /* Update only mutable values (only byte data) */
  return {
    card: cardContainer,
    update(download: Download): void {
      currentBytes.textContent = formatBytes(download.receivedBytes || 0);
      totalBytes.textContent = formatBytes(download.totalBytes || 0);

      const total = Number.isFinite(download.totalBytes) && (download.totalBytes ?? 0) > 0 ? (download.totalBytes ?? 0) : 0;
      const received = Number.isFinite(download.receivedBytes) ? (download.receivedBytes ?? 0) : 0;
      const width = total > 0 ? `${Math.min((received / total) * 100, 100)}%` : '0%';
      fill.style.width = completed ? '100%' : width;

      if (completed) {
        streamBytes.textContent = download.type === 'complete' ? `${i18n.t('Content_Script.FileDownloader.complete')}` : `${i18n.t('Content_Script.FileDownloader.failed')}`;
      } else {
        streamBytes.textContent = `${formatBytes(download.speed || 0)}/s`;
      }

      applyBarCompletion(fill, completed ? download.type : null);
    },
    complete(download: Download): void {
      completed = true;
      cardContainer.classList.add('np-download-card-container-complete', 'np-download-card-container-completing');
      cancelDownload.remove();
      this.update(download);
    },
  };
}

type DownloaderController = {
  destroy: () => void;
};

function createDownloader(): DownloaderController | null {
  const body = document.body;
  const appRoot = document.querySelector('app-root');

  if (!body || !appRoot || body.querySelector('.np-download-container')) {
    // TODO Add error handling
    return null;
  }

  const container = createElement('div', 'np-download-container');
  const chevron = createElement('i', 'np-download-chevron fa-solid fa-chevron-up');
  const currentTitle = createElement('p', 'np-download-content-title', i18n.t('Content_Script.FileDownloader.downloading'));
  const currentContainer = createElement('div', 'np-download-content-current-container');
  const completedTitle = createElement('p', 'np-download-content-title', i18n.t('Content_Script.FileDownloader.completed'));
  const completedContainer = createElement('div', 'np-download-content-completed-container');
  const footer = createElement('div', 'np-download-footer');
  const countContainer = createElement('div', 'np-download-count-container');
  const countIcon = createElement('i', 'np-download-count-icon fa-solid fa-copy');
  const countTotal = createElement('p', 'np-download-count-total');
  const countDivider = createElement('p', 'np-download-count-divider', '|');
  const countActive = createElement('p', 'np-download-count-active');
  const deleteAll = createElement('i', 'np-download-delete-all fa-solid fa-trash');
  const infoContainer = createElement('div', 'np-download-info-container');
  const infoIcon = createElement('i', 'np-download-info-icon fa-solid fa-circle-info');
  const infoTitle = createElement('p', 'np-download-info-title', i18n.t('Content_Script.FileDownloader.noDownloadTitle'));
  const infoDesc = createElement('p', 'np-download-info-desc', i18n.t('Content_Script.FileDownloader.noDownloadDesc'));

  infoContainer.append(infoIcon, infoTitle, infoDesc);
  countContainer.append(countIcon, countTotal, countDivider, countActive);
  footer.append(countContainer, deleteAll);
  container.append(chevron, currentTitle, currentContainer, completedTitle, completedContainer, footer, infoContainer);
  body.append(container);

  /* State management */
  let state = createInitialState();
  const activeCards = new Map<string, CardEntry>();
  const completedCards = new Map<number, CardEntry>();
  let completedCardOrder = '';
  let infoRevealTimer: number | undefined;
  let infoIsVisible = false;

  function updateTitleVisibility(nextView: DownloadView): void {
    const titlesAreVisible = nextView === 'full';

    for (const title of [currentTitle, completedTitle]) {
      title.classList.toggle('np-download-content-title-visible', titlesAreVisible);
    }
  }

  function updateDownloadCounts(nextState: DownloaderState): void {
    const activeCount = Object.keys(nextState.activeDownloads).length;
    const totalCount = activeCount + nextState.completedDownloads.length;

    countTotal.textContent = `${totalCount} ${i18n.t('Content_Script.FileDownloader.files')}`;
    countActive.textContent = `${activeCount} ${i18n.t('Content_Script.FileDownloader.active')}`;
  }

  function updateInfoVisibility(nextState: DownloaderState): void {
    const hasNoDownloads = Object.keys(nextState.activeDownloads).length === 0 && nextState.completedDownloads.length === 0;
    const shouldShowInfo = nextState.view === 'full' && hasNoDownloads;

    if (shouldShowInfo === infoIsVisible) return;

    if (!shouldShowInfo) {
      clearTimeout(infoRevealTimer);
      infoRevealTimer = undefined;
      infoIsVisible = false;
      infoContainer.style.opacity = '0';
      infoContainer.addEventListener(
        'transitionend',
        () => {
          if (infoContainer.style.opacity === '0') infoContainer.style.display = 'none';
        },
        { once: true },
      );
      return;
    }

    infoIsVisible = true;
    infoContainer.style.display = 'flex';
    infoContainer.style.opacity = '0';

    infoRevealTimer = window.setTimeout(() => {
      infoRevealTimer = undefined;

      requestAnimationFrame(() => {
        if (infoIsVisible) infoContainer.style.opacity = '1';
      });
    }, 300);
  }

  function render(nextState: DownloaderState): void {
    container.classList.toggle('np-download-expanded-closed', nextState.view === 'closed');
    container.classList.toggle('np-download-expanded-half', nextState.view === 'half');
    container.classList.toggle('np-download-expanded-full', nextState.view === 'full');
    chevron.classList.toggle('np-download-chevron-down', nextState.view === 'full');

    updateDownloadCounts(nextState);
    updateTitleVisibility(nextState.view);
    updateInfoVisibility(nextState);

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

      completedContainer.replaceChildren(...nextState.completedDownloads.map((download) => completedCards.get(download.completionId)?.card).filter((card): card is HTMLDivElement => Boolean(card)));
    }
  }

  function dispatch(action: DownloadAction): void {
    state = reducer(state, action);
    render(state);
  }

  chevron.addEventListener('click', () => {
    dispatch({ type: 'TOGGLE' });
  });

  deleteAll.addEventListener('click', () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  });

  function handleDownloadEvent(event: Event): void {
    const download = (event as CustomEvent<Partial<Download>>).detail || {};

    if (!download.url && !download.fileName) {
      return;
    }

    const normalizedDownload: Download = {
      ...download,
      id: download.id || getDownloadID(download),
      type: download.type || 'progress',
    };

    const actionType =
      normalizedDownload.type === 'start' ? 'DOWNLOAD_STARTED' : normalizedDownload.type === 'complete' || normalizedDownload.type === 'error' ? 'DOWNLOAD_COMPLETED' : 'DOWNLOAD_UPDATED';

    dispatch({ type: actionType, download: normalizedDownload });
  }

  window.addEventListener('__np_download_event__', handleDownloadEvent);

  render(state);

  return {
    destroy() {
      window.removeEventListener('__np_download_event__', handleDownloadEvent);
      clearTimeout(infoRevealTimer);
      container.remove();
    },
  };
}

function applyBarCompletion(fillBar: HTMLElement, status: DownloadType | null | undefined): void {
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

async function updateDownloader(settingValue?: boolean) {
  const enabled = settingValue ?? (await readSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_DOWNLOAD, false));
  const shouldEnable = Boolean(enabled && isSupportedURL(window.location.href) && !isLoginPage(window.location.href));
  updateActionBarStyles(shouldEnable);

  if (!shouldEnable) {
    downloader?.destroy();
    downloader = null;
    return;
  }

  downloader ??= createDownloader();
}

let downloader: DownloaderController | null = null;

export async function initializeFileDownloader() {
  await updateDownloader();

  observeMutations(() => void updateDownloader());
  addNavigationListeners(() => void updateDownloader());

  subscribeToSetting(CATEGORIES.INTERFACE, KEYS.INTERFACE.SHOW_DOWNLOAD, (newValue) => {
    void updateDownloader(newValue);
  });
}
