export type ErrorType = 'error' | 'warning' | 'info';

export type ErrorHandlerProps = {
  type: ErrorType;
  scope: string;
  message: Error | string;
};

export type ErrorMessage = {
  type: 'NP_ERROR';
  errorType: ErrorType;
  scope: string;
  message: string;
};

type FileSystemDirectoryHandleWithFile = FileSystemDirectoryHandle & {
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
};

const LOG_FILE_NAME = 'log.txt';

function formatDate(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, '0');

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} - ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getMessage(message: Error | string): string {
  return message instanceof Error ? message.message : message;
}

let writeQueue = Promise.resolve();

export function writeErrorLog({ type, scope, message }: ErrorHandlerProps): Promise<void> {
  const logEntry = `[${formatDate(new Date())}] [${type.toUpperCase()}] [${scope.toUpperCase()}] → ${getMessage(message)}\n`;

  writeQueue = writeQueue
    .then(async () => {
      if (!navigator.storage?.getDirectory) {
        console.error(logEntry.trimEnd());
        return;
      }

      const root = (await navigator.storage.getDirectory()) as FileSystemDirectoryHandleWithFile;
      const logFile = await root.getFileHandle(LOG_FILE_NAME, { create: true });
      const writable = await logFile.createWritable({ keepExistingData: true });

      try {
        await writable.seek((await logFile.getFile()).size);
        await writable.write(logEntry);
      } finally {
        await writable.close();
      }
    })
    .catch((error: unknown) => {
      console.error('Failed to append to log.txt', error, logEntry.trimEnd());
    });

  return writeQueue;
}

export async function exportErrorLog(): Promise<void> {
  await writeQueue;

  if (!navigator.storage?.getDirectory) {
    throw new Error('Persistent log storage is unavailable in this browser.');
  }

  const root = (await navigator.storage.getDirectory()) as FileSystemDirectoryHandleWithFile;
  const logFile = await root.getFileHandle(LOG_FILE_NAME, { create: true });
  const file = await logFile.getFile();
  const downloadURL = URL.createObjectURL(file);
  const link = document.createElement('a');

  link.href = downloadURL;
  link.download = `Neptun-Plus-${LOG_FILE_NAME}`;
  link.click();
  URL.revokeObjectURL(downloadURL);
}

export function clearErrorLog(): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    if (!navigator.storage?.getDirectory) {
      throw new Error('Persistent log storage is unavailable in this browser.');
    }

    const root = (await navigator.storage.getDirectory()) as FileSystemDirectoryHandleWithFile;
    const logFile = await root.getFileHandle(LOG_FILE_NAME, { create: true });
    const writable = await logFile.createWritable();

    try {
      await writable.write('');
    } finally {
      await writable.close();
    }
  });

  return writeQueue;
}
