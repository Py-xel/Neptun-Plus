import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: 'public/Neptun_Plus_Logo.png',
  },
  permissions: ['contentSettings'],
  action: {
    default_icon: {
      48: 'public/Neptun_Plus_Logo.png',
    },
    default_popup: 'src/popup/index.html',
  },
});
