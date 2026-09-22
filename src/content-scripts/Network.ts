import fileIcons from '@/data/file_icons.json';
import mimeTypes from '@/data/mime_types.json';

type DownloadTransport = 'fetch' | 'xhr';

type DownloadEvent = {
  id: string;
  type: 'start' | 'progress' | 'complete' | 'error';
  transport: DownloadTransport;
  url: string;
  fileName: string;
  contentType?: string;
  receivedBytes?: number;
  totalBytes?: number;
  speed?: number;
  error?: string;
};

type DownloadAbort = {
  type: DownloadTransport;
  abort: () => void;
};

type ObserveFetchStreamOptions = {
  reader: ReadableStreamDefaultReader<Uint8Array>;
  url: string;
  fileName: string;
  totalBytes: number;
  downloadId: string;
  abortController: AbortController;
};

type XhrRequestInfo = {
  method: string;
  url: string;
};

type XhrDownloadState = XhrRequestInfo & {
  fileName: string;
  downloadId: string;
  totalBytes: number;
  receivedBytes: number;
  startTime: number;
};

const SUPPORTED_FILE_EXTENSIONS = fileIcons.map(({ type }) => type?.toLowerCase()).filter((type): type is string => Boolean(type && type !== '.*'));

const SUPPORTED_MIME_TYPES: Record<string, string> = mimeTypes;

const downloadAbortRegistry = new Map<string, DownloadAbort>();

/* EVENT :: DOWNLOAD */
function emitDownloadEvent(data: DownloadEvent): void {
  window.dispatchEvent(
    new CustomEvent<DownloadEvent>('__np_download_event__', {
      detail: data,
    }),
  );
}

function registerDownloadAbort(downloadId: string, abort: () => void, type: DownloadTransport): void {
  downloadAbortRegistry.set(downloadId, { type, abort });
}

function unregisterDownloadAbort(downloadId: string): void {
  downloadAbortRegistry.delete(downloadId);
}

/* LISTENER :: ABORT */
window.addEventListener('__np_abort_download__', (event: Event) => {
  const downloadId = (event as CustomEvent<{ id?: string }>).detail?.id;

  if (!downloadId) {
    return;
  }

  downloadAbortRegistry.get(downloadId)?.abort();
});

function getFileExtensionFromName(name: string): string {
  /* ignore trailing params and hashes */
  const match = name.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
  return match ? `.${match[1].toLowerCase()}` : '';
}

function getFileName(url: string, contentDisposition: string): string {
  /* extract URL-encoded filename from header */
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch (error) {
      void chrome.runtime
        .sendMessage({
          type: 'NP_ERROR',
          errorType: 'warning',
          scope: 'network',
          message: `Could not decode the download filename: ${String(error)}`,
        })
        .catch((dispatchError: unknown) => {
          console.error('Failed to dispatch error message', dispatchError);
        });
    }
  }
  /* extract filename and remove optional wrapping quotes */
  const normalMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

  if (normalMatch) {
    return normalMatch[1];
  }

  try {
    const pathname = new URL(url, location.href).pathname;
    return pathname.split('/').pop() || 'Download';
  } catch {
    return 'Download';
  }
}

function isSupportedDownloadExtension(extension: string): boolean {
  return SUPPORTED_FILE_EXTENSIONS.includes(extension.toLowerCase());
}

function isDownload(url: string, contentType: string, contentDisposition: string): boolean {
  const fileNameExtension = getFileExtensionFromName(getFileName(url, contentDisposition));
  const urlExtension = getFileExtensionFromName(url);
  const mimeType = contentType.split(';')[0].trim().toLowerCase();
  const mimeExtension = SUPPORTED_MIME_TYPES[mimeType] || '';

  if (fileNameExtension && isSupportedDownloadExtension(fileNameExtension)) {
    return true;
  }

  if (urlExtension && isSupportedDownloadExtension(urlExtension)) {
    return true;
  }

  if (contentDisposition && /attachment/i.test(contentDisposition) && (fileNameExtension || mimeExtension)) {
    return isSupportedDownloadExtension(fileNameExtension || mimeExtension);
  }

  return Boolean(mimeExtension && isSupportedDownloadExtension(mimeExtension));
}

/* FETCH */

const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const fetchController = new AbortController();
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const fetchInput: RequestInfo | URL = input instanceof Request ? new Request(input, { ...init, signal: fetchController.signal }) : input;
  const fetchInit = input instanceof Request ? undefined : { ...init, signal: fetchController.signal };

  let response: Response;

  try {
    response = await originalFetch(fetchInput, fetchInit);
  } catch (error) {
    throw error;
  }

  const contentType = response.headers.get('content-type') || '';
  const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
  const contentDisposition = response.headers.get('content-disposition') || '';

  if (!response.body || !isDownload(url, contentType, contentDisposition)) {
    return response;
  }

  const fileName = getFileName(url, contentDisposition);
  const downloadId = `fetch:${url}:${fileName}`;
  const totalBytes = Number.isFinite(contentLength) ? contentLength : 0;

  registerDownloadAbort(downloadId, () => fetchController.abort(), 'fetch');
  emitDownloadEvent({
    id: downloadId,
    type: 'start',
    transport: 'fetch',
    url,
    fileName,
    contentType,
    totalBytes,
  });

  const [applicationStream, observerStream] = response.body.tee();

  void observeFetchStream({
    reader: observerStream.getReader(),
    url,
    fileName,
    totalBytes,
    downloadId,
    abortController: fetchController,
  });

  return new Response(applicationStream, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};

/* XHR */

const xhrRequestInfo = new WeakMap<XMLHttpRequest, XhrRequestInfo>();
const xhrDownloadStates = new WeakMap<XMLHttpRequest, XhrDownloadState>();
const xhrPrototype = XMLHttpRequest.prototype as XMLHttpRequest & { open: (...args: any[]) => void; send: (...args: any[]) => void };
const originalOpen = xhrPrototype.open;
const originalSend = xhrPrototype.send;

xhrPrototype.open = function (method: string, requestUrl: string | URL, ...rest: any[]): void {
  xhrRequestInfo.set(this, { method, url: String(requestUrl) });
  originalOpen.call(this, method, requestUrl, ...rest);
};

xhrPrototype.send = function (...args: any[]): void {
  const xhr = this;
  const requestInfo = xhrRequestInfo.get(xhr);

  if (!requestInfo) {
    originalSend.apply(xhr, args);
    return;
  }

  let downloadStarted = false;

  xhr.addEventListener('readystatechange', () => {
    if (downloadStarted || xhr.readyState !== XMLHttpRequest.HEADERS_RECEIVED) {
      return;
    }

    const contentType = xhr.getResponseHeader('content-type') || '';
    const contentDisposition = xhr.getResponseHeader('content-disposition') || '';

    if (!isDownload(requestInfo.url, contentType, contentDisposition)) {
      return;
    }

    const fileName = getFileName(requestInfo.url, contentDisposition);
    const downloadId = `xhr:${requestInfo.url}:${fileName}`;
    const contentLength = parseInt(xhr.getResponseHeader('content-length') || '0', 10);
    const totalBytes = Number.isFinite(contentLength) ? contentLength : 0;

    xhrDownloadStates.set(xhr, {
      ...requestInfo,
      fileName,
      downloadId,
      totalBytes,
      receivedBytes: 0,
      startTime: performance.now(),
    });
    downloadStarted = true;

    registerDownloadAbort(downloadId, () => xhr.abort(), 'xhr');
    emitDownloadEvent({ id: downloadId, type: 'start', transport: 'xhr', url: requestInfo.url, fileName, contentType, totalBytes });
  });

  xhr.addEventListener('progress', (event: ProgressEvent) => {
    const state = xhrDownloadStates.get(xhr);

    if (!downloadStarted || !state) {
      return;
    }

    state.receivedBytes = event.loaded;
    const totalBytes = event.lengthComputable ? event.total : state.totalBytes;
    const elapsed = (performance.now() - state.startTime) / 1000;
    const speed = elapsed > 0 ? state.receivedBytes / elapsed : 0;

    emitDownloadEvent({ id: state.downloadId, type: 'progress', transport: 'xhr', url: state.url, fileName: state.fileName, receivedBytes: state.receivedBytes, totalBytes, speed });
  });

  xhr.addEventListener('loadend', () => {
    const state = xhrDownloadStates.get(xhr);

    if (!downloadStarted || !state) {
      return;
    }

    unregisterDownloadAbort(state.downloadId);
    xhrDownloadStates.delete(xhr);
    const successful = xhr.status >= 200 && xhr.status < 300;

    emitDownloadEvent({
      id: state.downloadId,
      type: successful ? 'complete' : 'error',
      transport: 'xhr',
      url: state.url,
      fileName: state.fileName,
      receivedBytes: state.receivedBytes,
      totalBytes: state.totalBytes,
      ...(successful ? {} : { error: `HTTP ${xhr.status}` }),
    });
  });

  originalSend.apply(xhr, args);
};

/* OBSERVE */

async function observeFetchStream({ reader, url, fileName, totalBytes, downloadId, abortController }: ObserveFetchStreamOptions): Promise<void> {
  let receivedBytes = 0;
  const startTime = performance.now();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        unregisterDownloadAbort(downloadId);
        emitDownloadEvent({ id: downloadId, type: 'complete', transport: 'fetch', url, fileName, receivedBytes, totalBytes });
        return;
      }

      if (!value) {
        continue;
      }

      receivedBytes += value.byteLength;
      const elapsed = (performance.now() - startTime) / 1000;
      const speed = elapsed > 0 ? receivedBytes / elapsed : 0;

      emitDownloadEvent({ id: downloadId, type: 'progress', transport: 'fetch', url, fileName, receivedBytes, totalBytes, speed });
    }
  } catch (error) {
    unregisterDownloadAbort(downloadId);
    emitDownloadEvent({ id: downloadId, type: 'error', transport: 'fetch', url, fileName, error: String(error) });
    abortController.abort();
  }
}
