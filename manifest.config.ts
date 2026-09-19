import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';
import universities from './src/data/universities.json';

// Dynamically load university links from json
const allURLs = Object.values(universities)
  .filter((university) => university.supported)
  .flatMap((university) => {
    const websites = Array.isArray(university.website) ? university.website : [university.website];

    // Convert URL to match pattern ("https://neptun.elte.hu/" -> "https://neptun.elte.hu/*")
    return websites
      .filter((url) => url && typeof url === 'string') // Filter out undefined/null/non-string values
      .map((url) => (url.endsWith('/') ? `${url}*` : `${url}/*`));
  });

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: 'Neptun_Plus_Logo.png',
  },
  permissions: ['contentSettings', 'storage', 'scripting'],
  host_permissions: allURLs,
  web_accessible_resources: [
    {
      resources: ['*.png', 'shortcut_icons/*'],
      matches: ['https://*/*'],
    },
  ],
  content_scripts: [
    {
      matches: allURLs,
      world: 'ISOLATED',
      js: ['src/content-scripts/Global.js', 'src/content-scripts/Bootstrap.ts'],
      css: ['src/styles/content-scripts/status.css', 'src/styles/content-scripts/fileDownloader.css', 'src/styles/content-scripts/shortcuts.css', 'src/styles/content-scripts/autoLogin.css'],
      run_at: 'document_start',
    },
    {
      matches: allURLs,
      world: 'MAIN',
      js: ['src/content-scripts/Network.ts'],
      run_at: 'document_start',
    },
  ],
  action: {
    default_popup: 'src/popup/index.html',
  },
});
