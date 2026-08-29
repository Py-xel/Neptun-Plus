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
  background: {
    service_worker: 'src/background.js',
    type: 'module',
  },
  web_accessible_resources: [
    {
      resources: ['public/*', 'public/shortcut_icons/*'],
      matches: ['https://*/*'],
    },
  ],
  content_scripts: [
    {
      matches: allURLs,
      world: 'ISOLATED',
      js: [
        'src/content-scripts/Global.js',
        'src/content-scripts/Status.js',
        'src/content-scripts/interface/DisableHeaders.js',
        'src/content-scripts/interface/ItemList.js',
        'src/content-scripts/interface/FileDownloader.js',
      ],
      css: ['src/styles/content-scripts/Status.css', 'src/styles/content-scripts/FileDownloader.css'],
      run_at: 'document_start',
    },
    {
      matches: allURLs,
      world: 'MAIN',
      js: ['src/content-scripts/Network.js'],
      run_at: 'document_start',
    },
  ],
  action: {
    default_popup: 'src/popup/index.html',
  },
});
