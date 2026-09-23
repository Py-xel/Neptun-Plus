import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { build as buildWithEsbuild } from 'esbuild';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

/* background.ts must be declared as a classic script for gecko browsers */
function geckoBackgroundBundle() {
  const backgroundFileName = 'assets/background-gecko.js';

  return {
    name: 'gecko-background-bundle',
    async writeBundle() {
      const manifestPath = resolve(process.cwd(), buildDirectory, 'manifest.json');
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      const generatedBackground = manifest.background?.scripts?.[0];

      await buildWithEsbuild({
        absWorkingDir: process.cwd(),
        alias: {
          '@': resolve(process.cwd(), 'src'),
        },
        bundle: true,
        entryPoints: ['src/background.ts'],
        format: 'iife',
        minify: true,
        outfile: resolve(process.cwd(), buildDirectory, backgroundFileName),
        platform: 'browser',
        target: 'es2022',
      });

      const assetDirectory = resolve(process.cwd(), buildDirectory, 'assets');

      if (generatedBackground) {
        rmSync(resolve(process.cwd(), buildDirectory, generatedBackground), { force: true });
      }

      for (const fileName of readdirSync(assetDirectory)) {
        if (fileName.startsWith('background.ts-')) {
          rmSync(resolve(assetDirectory, fileName), { force: true });
        }
      }

      manifest.background.scripts = [backgroundFileName];
      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    },
  };
}

export default defineConfig(({ mode }) => ({
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
    ...(extensionTarget === 'gecko' ? [geckoManifestCompatibility(), geckoBackgroundBundle()] : []),
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
  ...(mode === 'dev'
    ? {
        server: {
          cors: {
            origin: true,
          },
          origin: 'http://localhost:5173',
        },
      }
    : {}),
}));
