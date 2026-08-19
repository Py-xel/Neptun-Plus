import fileIcons from '@/data/file_icons.json';

(() => {
  /* Prevent multiple interceptor installs */
  if (window.__npDownloadInterceptorInstalled) {
    return;
  }

  window.__npDownloadInterceptorInstalled = true;
  window.__npDownloadAbortRegistry = new Map();

  const SUPPORTED_FILE_EXTENSIONS = fileIcons.map(({ type }) => type?.toLowerCase()).filter((type) => type && type !== '.*');

  const SUPPORTED_MIME_TYPES = {
    'application/pdf': '.pdf',
    'application/zip': '.zip',
    'application/x-zip-compressed': '.zip',
    'application/vnd.rar': '.rar',
    'application/x-rar-compressed': '.rar',
    'application/x-7z-compressed': '.7z',
    'application/octet-stream': '.bin',
    'video/mp4': '.mp4',
    'video/x-matroska': '.mkv',
    'audio/mpeg': '.mp3',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'text/plain': '.txt',
    'text/csv': '.csv',
    'text/html': '.html',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/xml': '.xml',
    'application/sql': '.sql',
    'application/x-sql': '.sql',
    'application/x-msdownload': '.exe',
    'application/vnd.android.package-archive': '.apk',
  };

  function getFileExtensionFromName(name) {
    if (!name) {
      // TODO Add error handling
      return '';
    }

    /* Extract file extension (".JPG" -> ".jpg") */
    const match = String(name).match(/\.([a-z0-9]+)(?:[?#]|$)/i);
    return match ? `.${match[1].toLowerCase()}` : '';
  }

  function getFileName(url, contentDisposition) {
    if (contentDisposition) {
      const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

      if (utf8Match) {
        try {
          /* Turn encoded escape sequences back to readable characters. ("%3F" -> "?") */
          return decodeURIComponent(utf8Match[1]);
        } catch {
          // TODO Add error handling
        }
      }

      const normalMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

      if (normalMatch) {
        return normalMatch[1];
      }
    }

    try {
      const pathname = new URL(url, location.href).pathname;
      const filename = pathname.split('/').pop();

      return filename || 'Download';
    } catch {
      return 'Download';
    }
  }

  function isSupportedDownloadExtension(extension) {
    return SUPPORTED_FILE_EXTENSIONS.includes(extension.toLowerCase());
  }

  function isDownload(url, contentType, contentDisposition) {
    const fileName = getFileName(url, contentDisposition);
    const extensionFromFileName = getFileExtensionFromName(fileName);
    const extensionFromUrl = getFileExtensionFromName(url);
    const mimeType = (contentType || '').split(';')[0].trim().toLowerCase();
    const extensionFromMimeType = SUPPORTED_MIME_TYPES[mimeType] || '';

    if (extensionFromFileName && isSupportedDownloadExtension(extensionFromFileName)) {
      return true;
    }

    if (extensionFromUrl && isSupportedDownloadExtension(extensionFromUrl)) {
      return true;
    }

    if (contentDisposition && /attachment/i.test(contentDisposition) && (extensionFromFileName || extensionFromMimeType)) {
      return isSupportedDownloadExtension(extensionFromFileName || extensionFromMimeType);
    }

    return Boolean(extensionFromMimeType && isSupportedDownloadExtension(extensionFromMimeType));
  }

  function emitDownloadEvent(data) {
    window.dispatchEvent(
      new CustomEvent('__np_download_event__', {
        detail: data,
      }),
    );
  }

  function registerDownloadAbort(downloadId, abortTarget, type = 'unknown') {
    if (!downloadId || !abortTarget) {
      // TODO Add error handling
      return;
    }

    const abortHandler = typeof abortTarget.abort === 'function' ? () => abortTarget.abort() : typeof abortTarget === 'function' ? abortTarget : null;

    if (!abortHandler) {
      return;
    }

    window.__npDownloadAbortRegistry.set(downloadId, {
      type,
      abort: abortHandler,
    });
  }

  function unregisterDownloadAbort(downloadId) {
    if (!downloadId) {
      // TODO Add error handling
      return;
    }

    window.__npDownloadAbortRegistry.delete(downloadId);
  }

  window.addEventListener('__np_abort_download__', (event) => {
    const downloadId = event.detail?.id;

    if (!downloadId) {
      return;
    }

    const abortTarget = window.__npDownloadAbortRegistry?.get(downloadId);

    if (!abortTarget || typeof abortTarget.abort !== 'function') {
      console.warn('[Network] No abort target:', downloadId);
      return;
    }

    abortTarget.abort();
  });

  /* Fetch */

  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const input = args[0];
    const originalInit = args[1] || {};
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input?.url || location.href;
    const fetchController = new AbortController();

    const nextArgs = [...args];
    if (input instanceof Request) {
      nextArgs[0] = new Request(input, {
        ...input,
        signal: fetchController.signal,
      });
    } else {
      nextArgs[1] = {
        ...originalInit,
        signal: fetchController.signal,
      };
    }

    let response;

    try {
      response = await originalFetch.apply(this, nextArgs);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return Promise.reject(error);
      }
      // TODO Add error handling
      throw error;
    }

    const contentType = response.headers.get('content-type') || '';
    const contentLength = parseInt(response.headers.get('content-length') || '0', 10);

    const contentDisposition = response.headers.get('content-disposition') || '';

    if (!response.body || !isDownload(url, contentType, contentDisposition)) {
      // TODO Add error handling
      return response;
    }

    const fileName = getFileName(url, contentDisposition);
    const downloadId = `fetch:${url}:${fileName}`;

    registerDownloadAbort(downloadId, fetchController, 'fetch');

    emitDownloadEvent({
      id: downloadId,
      type: 'start',
      transport: 'fetch',
      url,
      fileName,
      contentType,
      totalBytes: Number.isFinite(contentLength) ? contentLength : 0,
    });

    const [applicationStream, observerStream] = response.body.tee();

    observeFetchStream({
      reader: observerStream.getReader(),
      url,
      fileName,
      totalBytes: contentLength,
      downloadId,
      abortController: fetchController,
    });

    return new Response(applicationStream, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  };

  async function observeFetchStream({ reader, url, fileName, totalBytes, downloadId, abortController }) {
    let receivedBytes = 0;
    const startTime = performance.now();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          unregisterDownloadAbort(downloadId);

          emitDownloadEvent({
            id: downloadId,
            type: 'complete',
            transport: 'fetch',
            url,
            fileName,
            receivedBytes,
            totalBytes,
          });

          break;
        }

        receivedBytes += value.byteLength;

        const elapsed = (performance.now() - startTime) / 1000;

        const speed = elapsed > 0 ? receivedBytes / elapsed : 0;

        emitDownloadEvent({
          id: downloadId,
          type: 'progress',
          transport: 'fetch',
          url,
          fileName,
          receivedBytes,
          totalBytes,
          speed,
        });
      }
    } catch (error) {
      unregisterDownloadAbort(downloadId);

      emitDownloadEvent({
        id: downloadId,
        type: 'error',
        transport: 'fetch',
        url,
        fileName,
        error: String(error),
      });

      if (abortController && typeof abortController.abort === 'function') {
        abortController.abort();
      }
    }
  }

  /* XHR */

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__npDownload = {
      method,
      url: String(url),
    };

    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    const xhr = this;
    const info = xhr.__npDownload;

    if (!info) {
      return originalSend.apply(xhr, args);
    }

    let started = false;

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState !== XMLHttpRequest.HEADERS_RECEIVED) {
        return;
      }

      const contentType = xhr.getResponseHeader('content-type') || '';

      const contentDisposition = xhr.getResponseHeader('content-disposition') || '';

      if (!isDownload(info.url, contentType, contentDisposition)) {
        return;
      }

      started = true;

      const totalBytes = parseInt(xhr.getResponseHeader('content-length') || '0', 10);

      const fileName = getFileName(info.url, contentDisposition);
      const downloadId = `xhr:${info.url}:${fileName}`;

      xhr.__npDownload.fileName = fileName;
      xhr.__npDownload.totalBytes = totalBytes;
      xhr.__npDownload.receivedBytes = 0;
      xhr.__npDownload.startTime = performance.now();
      xhr.__npDownload.downloadId = downloadId;

      registerDownloadAbort(downloadId, xhr, 'xhr');

      emitDownloadEvent({
        id: downloadId,
        type: 'start',
        transport: 'xhr',
        url: info.url,
        fileName,
        contentType,
        totalBytes,
      });
    });

    xhr.addEventListener('progress', (event) => {
      if (!started) {
        return;
      }

      xhr.__npDownload.receivedBytes = event.loaded;
      const receivedBytes = xhr.__npDownload.receivedBytes;
      const totalBytes = event.lengthComputable ? event.total : xhr.__npDownload.totalBytes;

      const elapsed = (performance.now() - xhr.__npDownload.startTime) / 1000;

      const speed = elapsed > 0 ? receivedBytes / elapsed : 0;

      emitDownloadEvent({
        id: xhr.__npDownload.downloadId,
        type: 'progress',
        transport: 'xhr',
        url: info.url,
        fileName: xhr.__npDownload.fileName,
        receivedBytes,
        totalBytes,
        speed,
      });
    });

    xhr.addEventListener('loadend', () => {
      if (!started) {
        return;
      }

      unregisterDownloadAbort(xhr.__npDownload.downloadId);

      emitDownloadEvent({
        id: xhr.__npDownload.downloadId,
        type: xhr.status >= 200 && xhr.status < 300 ? 'complete' : 'error',
        transport: 'xhr',
        url: info.url,
        fileName: xhr.__npDownload.fileName,
        receivedBytes: xhr.__npDownload.receivedBytes,
        totalBytes: xhr.__npDownload.totalBytes,
      });
    });

    return originalSend.apply(xhr, args);
  };
})();
