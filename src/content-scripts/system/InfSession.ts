import i18n from '@/i18n';
import { CATEGORIES, KEYS } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { addNavigationListeners, createElement, isSupportedURL, observeMutations } from '@/utils/utility';

const NEPTUN_HEADER = '#main-header-right';
const TOKEN_ENDPOINT = '/hallgato/api/Account/GetNewTokens';
const RETRY_DELAY = 25000; // 25s
const REFRESH = 100000; // 100s
const TIMER_JITTER = 0.1;
const TOKEN_TIMEOUT = 5;
const SESSION_TIMEOUT = 30;

let infSessionTimer: number | null = null;
let infSessionRefreshInProgress = false;

function stopInfSession(): void {
  if (infSessionTimer !== null) {
    window.clearTimeout(infSessionTimer);
    infSessionTimer = null;
  }
}

function addTimerJitter(delay: number): number {
  const variation = (Math.random() * 2 - 1) * TIMER_JITTER;
  return Math.max(0, Math.round(delay * (1 + variation)));
}

function scheduleInfSession(retry = false): void {
  if (infSessionTimer !== null) {
    window.clearTimeout(infSessionTimer);
  }

  const expiration = Date.parse(sessionStorage.getItem('access_token_expiration_date') ?? '');
  // retry sooner only when refresh data is unavailable
  const baseDelay = !retry && Number.isFinite(expiration) ? Math.max(0, expiration - Date.now() - REFRESH) : RETRY_DELAY;
  const delay = addTimerJitter(baseDelay);

  infSessionTimer = window.setTimeout(() => {
    infSessionTimer = null;
    void refreshInfSession();
  }, delay);
}

function resetInfSessionCountdown(): void {
  if (document.visibilityState === 'visible') {
    document.dispatchEvent(new Event('visibilitychange'));
  }
  document.dispatchEvent(new Event('scroll'));
}

async function refreshInfSession(): Promise<void> {
  // avoid sending overlapping refresh requests when the page is slow or suspended
  if (infSessionRefreshInProgress) {
    return;
  }

  const oldToken = sessionStorage.getItem('access_token');

  // if the token doesn't exist, schedule again
  if (!oldToken) {
    scheduleInfSession(true);
    return;
  }

  const expiration = Date.parse(sessionStorage.getItem('access_token_expiration_date') ?? '');

  if (Number.isFinite(expiration) && expiration - Date.now() > REFRESH) {
    scheduleInfSession();
    return;
  }

  infSessionRefreshInProgress = true;

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${oldToken}`,
        accessToken: oldToken,
        sessionTimeoutInMinutes: String(SESSION_TIMEOUT),
      },
    });

    if (!response.ok) {
      // TODO Add error handling
      throw new Error(`GetNewTokens failed: HTTP ${response.status}`);
    }

    const data: { accessToken?: unknown; sessionTimeoutInMinutes?: unknown } = await response.json();

    if (typeof data.accessToken !== 'string' || !data.accessToken) {
      // TODO Add error handling
      throw new Error('GetNewTokens response did not contain accessToken.');
    }

    const sessionTimeoutMinutes = Number(data.sessionTimeoutInMinutes ?? SESSION_TIMEOUT);
    const validSessionTimeout = Number.isFinite(sessionTimeoutMinutes) && sessionTimeoutMinutes > 0 ? sessionTimeoutMinutes : SESSION_TIMEOUT;
    const now = Date.now();

    // keep storage and client session countdown in sync
    sessionStorage.setItem('access_token', data.accessToken);
    sessionStorage.setItem('session_expiration_date', new Date(now + validSessionTimeout * 60_000).toISOString());
    sessionStorage.setItem('access_token_expiration_date', new Date(now + TOKEN_TIMEOUT * 60_000).toISOString());
    resetInfSessionCountdown();
    scheduleInfSession();
  } catch {
    scheduleInfSession(true);
    return;
  } finally {
    infSessionRefreshInProgress = false;
  }
}

function startInfSession(): void {
  if (infSessionTimer !== null) {
    return;
  }

  void refreshInfSession();
  scheduleInfSession();
}

function createInfSession(): void {
  const header = document.querySelector(NEPTUN_HEADER);
  const existingContainer = header?.querySelector('.np-inf-session-container');

  if (!header) {
    return;
  }

  if (existingContainer) {
    return;
  }

  const container = createElement('div', 'np-inf-session-container');
  const iconBackground = createElement('span', 'np-inf-session-icon-background');
  const icon = createElement('i', 'fa-solid fa-shield-halved');

  container.setAttribute('aria-label', i18n.t('Content_Script.InfSession.enabled'));
  iconBackground.append(icon);
  container.append(iconBackground);
  header.append(container);
}

async function updateInfSession(settingValue?: boolean): Promise<void> {
  const enabled = settingValue ?? (await readSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false));
  const shouldEnable = Boolean(enabled && isSupportedURL(window.location.href));

  if (!shouldEnable) {
    document.querySelector('.np-inf-session-container')?.remove();
    stopInfSession();
    return;
  }

  createInfSession();
  startInfSession();
}

export async function initializeInfSession(): Promise<void> {
  let enabled = Boolean(await readSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, false));

  await updateInfSession(enabled);

  observeMutations(() => void updateInfSession(enabled));
  addNavigationListeners(() => void updateInfSession(enabled));
  subscribeToSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.INFINITE_SESSION, (newValue) => {
    enabled = newValue ?? false;
    void updateInfSession(enabled);
  });
}
