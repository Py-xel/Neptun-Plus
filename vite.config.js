import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import zip from 'vite-plugin-zip-pack';
import manifest from './manifest.config.ts';
import { name, version } from './package.json';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react(), crx({ manifest }), zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` })],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
