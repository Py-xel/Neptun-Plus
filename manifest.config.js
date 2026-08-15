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
      resources: ['public/*'],
      matches: ['https://*/*'],
    },
  ],
  content_scripts: [
    {
      matches: allURLs,
      js: ['src/content-scripts/Status.js', 'src/content-scripts/interface/DisableHeaders.js'],
      css: ['src/styles/content-scripts/Status.css'],
      run_at: 'document_start',
    },
  ],
  action: {
    default_popup: 'src/popup/index.html',
  },
});
