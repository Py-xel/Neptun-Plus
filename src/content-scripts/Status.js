function createStatus() {
  const container = document.getElementsByClassName('neptun-language-dropdown')[0];

  if (container && !container.querySelector('.statusContainer')) {
    const statusContainer = document.createElement('div');
    statusContainer.className = 'np_statusContainer';

    // Logo and Title
    const header = document.createElement('div');
    header.className = 'np_header';

    const icon = document.createElement('img');
    icon.className = 'np_logo';
    icon.src = chrome.runtime.getURL('public/Neptun_Plus_Logo_Wireframe.png');

    const title = document.createElement('p');
    title.className = 'np_title';
    title.textContent = 'Neptun Plus';

    header.appendChild(icon);
    header.appendChild(title);

    // Status Indicator
    const statusOuter = document.createElement('span');
    statusOuter.className = 'np_statusOuter';

    const statusInner = document.createElement('span');
    statusInner.className = 'np_statusInner';

    const statusDot = document.createElement('span');
    statusDot.className = 'np_statusDot';

    const statusPing = document.createElement('span');
    statusPing.className = 'np_statusPing';

    const statusSolid = document.createElement('span');
    statusSolid.className = 'np_statusSolid';

    const statusText = document.createElement('span');
    statusText.className = 'np_statusText';
    statusText.textContent = 'Connected';

    statusDot.appendChild(statusPing);
    statusDot.appendChild(statusSolid);
    statusInner.appendChild(statusDot);
    statusInner.appendChild(statusText);
    statusOuter.appendChild(statusInner);

    statusContainer.appendChild(header);
    statusContainer.appendChild(statusOuter);
    container.appendChild(statusContainer);
    return true;
  }
  return false;
}

function Status() {
  createStatus();

  const observer = new MutationObserver((mutations) => {
    if (createStatus()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: false,
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Status);
} else {
  Status();
}
