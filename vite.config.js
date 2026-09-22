import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import zip from 'vite-plugin-zip-pack';
import manifest from './manifest.config.ts';
import { universitiesVersion, version } from './package.json';

const extensionTarget = process.env.npm_lifecycle_event === 'build:gecko' ? 'gecko' : 'chromium';
const releaseName = `Neptun-Plus_v${version}-u${universitiesVersion}.${extensionTarget}`;
const buildDirectory = extensionTarget === 'chromium' ? releaseName : '.gecko-build';

function geckoManifestCompatibility() {
  return {
    name: 'gecko-manifest-compatibility',
    writeBundle() {
      const manifestPath = resolve(process.cwd(), buildDirectory, 'manifest.json');
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

      for (const resourceGroup of manifest.web_accessible_resources ?? []) {
        delete resourceGroup.use_dynamic_url;
      }

      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    },
  };
}

export default defineConfig({
  build: {
    modulePreload: false,
    outDir: buildDirectory,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    crx({
      manifest,
      contentScripts: {
        standaloneFiles: ['src/content-scripts/Network.ts'],
      },
    }),
    ...(extensionTarget === 'gecko' ? [geckoManifestCompatibility()] : []),
    zip({
      inDir: buildDirectory,
      outDir: 'release',
      outFileName: `${releaseName}.zip`,
      done: (error) => {
        if (!error && extensionTarget === 'gecko') {
          rmSync(resolve(process.cwd(), buildDirectory), { recursive: true, force: true });
        }
      },
    }),
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
