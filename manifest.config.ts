import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';
import universities from './src/data/universities.json';

const extensionVersion = `${pkg.version}.${pkg.universitiesVersion}`;
const isGeckoBuild = process.env.npm_lifecycle_event === 'build:gecko';

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
  version: extensionVersion,
  icons: {
    48: 'Neptun_Plus_Logo.png',
  },
  permissions: ['storage', 'scripting'],
  host_permissions: allURLs,
  background: isGeckoBuild
    ? {
        scripts: ['src/background.ts'],
      }
    : {
        service_worker: 'src/background.ts',
        type: 'module',
      },
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
      css: [
        'src/styles/content-scripts/status.css',
        'src/styles/content-scripts/interface/fileDownloader.css',
        'src/styles/content-scripts/interface/shortcuts.css',
        'src/styles/content-scripts/system/autoLogin.css',
        'src/styles/content-scripts/system/infSession.css',
      ],
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
