import universities from '@/data/universities.json';
import i18n from '@/i18n';
import { CATEGORIES, KEYS, type AutoLoginCredential } from '@/utils/dataSchema';
import { readSetting, subscribeToSetting } from '@/utils/settingsStore';
import { addNavigationListeners, createElement, isLoginPage, normalizeURL, observeMutations } from '@/utils/utility';

type AutoLoginController = {
  update: (credentials: AutoLoginCredential[]) => void;
  destroy: () => void;
};

function isAutoLoginCredential(value: unknown): value is AutoLoginCredential {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const credential = value as Partial<AutoLoginCredential>;
  return typeof credential.id === 'number' && typeof credential.loginName === 'string' && typeof credential.password === 'string' && typeof credential.universityId === 'string';
}

function matchesWebsite(currentURL: string, website: string): boolean {
  const normalizedWebsite = normalizeURL(website);
  return Boolean(normalizedWebsite && (currentURL === normalizedWebsite || currentURL.startsWith(`${normalizedWebsite}/`)));
}

function credentialMatchesCurrentURL(credential: AutoLoginCredential, currentURL: string): boolean {
  const university = Object.values(universities).find(({ id }) => id === credential.universityId);

  if (!university) {
    return false;
  }

  const websites = Array.isArray(university.website) ? university.website : [university.website];
  return websites.some((website) => typeof website === 'string' && matchesWebsite(currentURL, website));
}

function getMatchingCredentials(credentials: AutoLoginCredential[]): AutoLoginCredential[] {
  const currentURL = normalizeURL(window.location.href);
  return credentials.filter((credential) => credentialMatchesCurrentURL(credential, currentURL));
}

function setInputValue(selector: string, value: string): void {
  const input = document.querySelector<HTMLInputElement>(selector);

  if (!input) {
    return;
  }

  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  valueSetter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function clickLogin(): void {
  const loginButton = document.getElementById('login-button');

  loginButton?.click();
}

function fillLoginForm(credential: AutoLoginCredential): void {
  setInputValue('#userName', credential.loginName);
  setInputValue('#password-form-password', credential.password);
  clickLogin();
}

function createCredentialButton(credential: AutoLoginCredential): HTMLButtonElement {
  const button = createElement('button', 'np-auto-login-button');
  const icon = createElement('i', 'fa-regular fa-user');
  button.type = 'button';
  button.append(icon, document.createTextNode(credential.loginName));
  button.addEventListener('click', () => fillLoginForm(credential));
  return button;
}

function renderCredentials(container: HTMLDivElement, titleContainer: HTMLDivElement, credentials: AutoLoginCredential[]): void {
  container.replaceChildren(titleContainer, ...getMatchingCredentials(credentials).map(createCredentialButton));
}

async function readCredentials(): Promise<AutoLoginCredential[]> {
  const value = await readSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.CREDENTIALS, []);
  return Array.isArray(value) ? value.filter(isAutoLoginCredential) : [];
}

function createAutoLogin(credentials: AutoLoginCredential[]): AutoLoginController | null {
  const loginContainer = document.querySelector('.login-right');
  const loginForm = loginContainer?.querySelector<HTMLFormElement>('form');
  const loginCaption = loginForm?.querySelector('h4.login-right__caption');

  if (loginForm?.querySelector('.np-auto-login-container')) {
    return null;
  }

  if (!loginForm || !loginCaption || !isLoginPage(window.location.href)) {
    void chrome.runtime
      .sendMessage({
        type: 'NP_ERROR',
        errorType: 'warning',
        scope: 'auto_login',
        message: 'Could not find the login form or caption on the login page.',
      })
      .catch((error: unknown) => {
        console.error('Failed to dispatch error message', error);
      });
    return null;
  }

  const container = createElement('div', 'np-auto-login-container');
  const titleContainer = createElement('div', 'np-auto-login-title-container');
  const titleIcon = createElement('i', 'fa-solid fa-unlock');
  const title = createElement('p', 'np-auto-login-title', i18n.t('Content_Script.AutoLogin.savedCredentials'));
  titleContainer.append(titleIcon, title);
  renderCredentials(container, titleContainer, credentials);
  loginCaption.insertAdjacentElement('afterend', container);

  return {
    update(nextCredentials) {
      renderCredentials(container, titleContainer, nextCredentials);
    },
    destroy() {
      container.remove();
    },
  };
}

let autoLogin: AutoLoginController | null = null;

async function updateAutoLogin(settingValue?: boolean, credentials?: AutoLoginCredential[]) {
  const enabled = settingValue ?? (await readSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.AUTO_LOGIN, false));

  if (!enabled || !isLoginPage(window.location.href)) {
    autoLogin?.destroy();
    autoLogin = null;
    return;
  }

  if (!autoLogin) {
    autoLogin = createAutoLogin(await readCredentials());
  } else if (credentials) {
    autoLogin.update(credentials);
  }
}

export async function initializeAutoLogin() {
  await updateAutoLogin();

  observeMutations(() => void updateAutoLogin());
  addNavigationListeners(() => void updateAutoLogin());

  subscribeToSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.AUTO_LOGIN, (newValue) => {
    void updateAutoLogin(newValue);
  });
  subscribeToSetting(CATEGORIES.SYSTEM, KEYS.SYSTEM.CREDENTIALS, (newValue) => {
    void updateAutoLogin(undefined, newValue);
  });
}
