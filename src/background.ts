import { type ErrorMessage, writeErrorLog } from '@/utils/errorHandler';

function isErrorMessage(message: unknown): message is ErrorMessage {
  if (!message || typeof message !== 'object') {
    return false;
  }

  const candidate = message as Partial<ErrorMessage>;
  return (
    candidate.type === 'NP_ERROR' &&
    (candidate.errorType === 'error' || candidate.errorType === 'warning' || candidate.errorType === 'info') &&
    typeof candidate.scope === 'string' &&
    typeof candidate.message === 'string'
  );
}

chrome.runtime.onMessage.addListener((message: unknown) => {
  if (!isErrorMessage(message)) {
    return;
  }

  void writeErrorLog({
    type: message.errorType,
    scope: message.scope,
    message: message.message,
  });
});
