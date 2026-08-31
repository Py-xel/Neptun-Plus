import { deriveKey, encryptCredentials, toBase64 } from '@/utils/crypto';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_CREDENTIALS') {
    saveCredentials(message.credentials)
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        // TODO Add error handling
        sendResponse({ success: false });
      });

    return true;
  }
});

async function saveCredentials(credentials) {
  const password = 'test-master-password';
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const encrypted = await encryptCredentials(credentials, key);

  await chrome.storage.local.set({
    credentials: {
      version: 1,
      salt: toBase64(salt),
      iv: encrypted.iv,
      ciphertext: encrypted.ciphertext,
      uni: credentials.uni,
    },
  });
}
