function appendLink(link) {
  const target = document.head ?? document.documentElement;

  if (target) {
    target.appendChild(link);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.head?.appendChild(link), { once: true });
  }
}

/* Font Awesome */
if (!document.querySelector('link[data-np-fa]')) {
  const faCss = document.createElement('link');
  faCss.rel = 'stylesheet';
  faCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css';
  faCss.setAttribute('data-np-fa', 'true');
  appendLink(faCss);
}

/* Google Fonts preconnect links */
if (!document.querySelector('link[href*="fonts.googleapis.com"][rel="preconnect"]')) {
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  appendLink(preconnect1);
}

if (!document.querySelector('link[href*="fonts.gstatic.com"][rel="preconnect"]')) {
  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  appendLink(preconnect2);
}

const fontUrls = [
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap',
  'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap',
  'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
  'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap',
  'https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap',
  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
];

fontUrls.forEach((url) => {
  const family = new URL(url).searchParams.get('family').split(':')[0];
  if (!document.querySelector(`link[href*="family=${family}"]`)) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = url;
    appendLink(fontLink);
  }
});
