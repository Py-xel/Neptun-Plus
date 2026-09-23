import fontAwesomeCss from '@/styles/icons/fontawesome.css?inline';

const styleId = 'np-fontawesome-styles';
const extensionAssetUrl = (path) => chrome.runtime.getURL(path.replace(/^\/+/, ''));
// Replaces relative urls to to absolute extension url
const pageSafeFontAwesomeCss = fontAwesomeCss.replace(/url\((['"]?)(\/?assets\/[^)"']+)\1\)/g, (_match, _quote, path) => `url("${extensionAssetUrl(path)}")`);

if (!document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = pageSafeFontAwesomeCss;
  (document.head ?? document.documentElement)?.appendChild(style);
}
