import { execSync } from 'node:child_process';
import { defineConfig, type Plugin } from 'vitest/config';
import { renderIconPng } from './scripts/appIcon';
import {
  ICON_SPECS, isShellAsset, precacheList, serviceWorkerSource, SW_FILE_NAME,
} from './scripts/pwaAssets';

// Build identity for the corner badge (user ask: "加一个版本号,方便确认
// 是否上线") — the git tag+sha the bundle was built from; 'dev' if git is
// unavailable. CI checks out with tags (fetch-depth: 0) so `describe`
// yields e.g. `phase-31.9.1` or `phase-31.9.1-2-gf1c35b3`.
function gitVersion(): string {
  try {
    return execSync('git describe --tags --always --dirty', { encoding: 'utf8' }).trim();
  } catch {
    return 'dev';
  }
}

/** Files copied out of `public/` that the shell needs offline. */
const PUBLIC_SHELL = ['manifest.webmanifest', 'icon.svg'];

/**
 * Emits the PWA's two generated assets — the PNG icon set and the service
 * worker — so neither has to be committed.
 *
 * The icons are procedural (Track F's no-binary-assets rule) and the worker
 * needs this build's real hashed filenames to precache the shell, which only
 * exists at `generateBundle` time. In dev the same bytes are served from
 * memory by a middleware, so the manifest and `apple-touch-icon` resolve
 * there too; the worker itself is only REGISTERED in a production build (a
 * cache-first worker in front of the dev server would serve stale modules).
 */
function pwaAssets(version: string): Plugin {
  const iconCache = new Map<string, Buffer>();
  const icon = (fileName: string): Buffer => {
    const cached = iconCache.get(fileName);
    if (cached) return cached;
    const spec = ICON_SPECS.find((s) => s.fileName === fileName);
    if (!spec) throw new Error(`no icon spec for ${fileName}`);
    const png = renderIconPng(spec);
    iconCache.set(fileName, png);
    return png;
  };

  return {
    name: 'evo-pwa-assets',
    generateBundle(_options, bundle) {
      for (const spec of ICON_SPECS) {
        this.emitFile({ type: 'asset', fileName: spec.fileName, source: icon(spec.fileName) });
      }
      const shipped = [
        ...Object.keys(bundle).filter(isShellAsset),
        ...PUBLIC_SHELL,
        ...ICON_SPECS.map((s) => s.fileName),
      ];
      this.emitFile({
        type: 'asset',
        fileName: SW_FILE_NAME,
        source: serviceWorkerSource(version, precacheList(shipped)),
      });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0].replace(/^\//, '');
        if (ICON_SPECS.some((s) => s.fileName === path)) {
          res.setHeader('Content-Type', 'image/png');
          res.end(icon(path));
          return;
        }
        if (path === SW_FILE_NAME) {
          res.setHeader('Content-Type', 'text/javascript');
          res.end(serviceWorkerSource(version, ['./']));
          return;
        }
        next();
      });
    },
  };
}

const APP_VERSION = gitVersion();

export default defineConfig({
  base: './',
  plugins: [pwaAssets(APP_VERSION)],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Several tests simulate full seasons (~5s on an idle machine). 20s keeps
    // the suite robust on loaded/thermally-throttled hardware while still
    // failing fast on genuine hangs (the sim itself has a 4× step safety net).
    testTimeout: 20000,
    // CI runs ONE worker thread (fm 12's corollary, final form): on the
    // 2-core runner two worker threads contend for both cores, a match loop
    // can then hold its event loop past vitest's 60s RPC budget, and the run
    // dies with "[vitest-worker]: Timeout calling onTaskUpdate" — with all
    // tests GREEN (killed the phase-45..50 deploy twice; per-test setImmediate
    // yields only shrink the window). Single-threaded, the worker owns one
    // core and the orchestrator the other. Local runs keep full parallelism.
    poolOptions: {
      threads: { singleThread: !!process.env.CI },
      forks: { singleFork: !!process.env.CI },
    },
  },
});
