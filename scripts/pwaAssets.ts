/**
 * The PWA's generated assets, as pure data + pure string building so they can
 * be unit-tested without a browser or a build.
 *
 * Two things are generated rather than committed:
 *   • the PNG icon set (iOS refuses SVG home-screen icons; see `appIcon.ts`);
 *   • the service worker, which needs the build's real hashed asset names
 *     baked in to precache the shell, and the build version baked in to name
 *     its cache.
 *
 * Both are emitted by the `pwaAssets` Vite plugin in vite.config.ts.
 */

import type { IconOptions } from './appIcon';

/* ---------------- icons ---------------- */

export interface IconSpec extends IconOptions {
  /** Path inside the bundle, relative to the deploy root. */
  readonly fileName: string;
  /** manifest `purpose`, or null for icons only `index.html` links to. */
  readonly purpose: 'any' | 'maskable' | null;
}

/**
 * The icon set. 192 + 512 are the two sizes the install prompt wants on
 * Android; the maskable 512 is what stops the launcher from putting our
 * square in a white circle; the 180 is `apple-touch-icon`, which is the only
 * icon iOS reliably uses for "Add to Home Screen".
 */
export const ICON_SPECS: readonly IconSpec[] = [
  { fileName: 'icons/icon-192.png', size: 192, transparentCorners: true, purpose: 'any' },
  { fileName: 'icons/icon-512.png', size: 512, transparentCorners: true, purpose: 'any' },
  { fileName: 'icons/maskable-512.png', size: 512, maskable: true, purpose: 'maskable' },
  // Square and opaque on purpose: iOS applies its own mask.
  { fileName: 'icons/apple-touch-icon-180.png', size: 180, purpose: null },
];

/** `apple-touch-icon` in index.html must point at a spec we actually emit. */
export const APPLE_TOUCH_ICON = 'icons/apple-touch-icon-180.png';

/* ---------------- service worker ---------------- */

/** Name of the emitted service worker, at the deploy root so its scope is the app. */
export const SW_FILE_NAME = 'sw.js';

/**
 * Bump when a file under `public/audio/` CHANGES CONTENT under an unchanged
 * name. The media cache is deliberately NOT versioned per build: re-fetching
 * 17 MB of audio on every deploy would be hostile on a phone, and the audio
 * filenames are content-stable in practice. This constant is the escape hatch
 * for the case where they are not (`?nosw=1` is the user-facing one).
 */
export const MEDIA_CACHE_VERSION = 'v1';

/** File extensions the worker runtime-caches into the persistent media cache. */
export const MEDIA_EXTENSIONS = ['.m4a', '.wav', '.mp3', '.ogg'] as const;

export function shellCacheName(version: string): string {
  return `evo-shell-${version}`;
}

export function mediaCacheName(): string {
  return `evo-media-${MEDIA_CACHE_VERSION}`;
}

/**
 * Decide whether a built file belongs in the install-time precache.
 *
 * The shell is what the game needs to boot offline: the document, the JS/CSS
 * bundles, the manifest and the icons. Audio is explicitly excluded — 17 MB
 * of it — and is instead cached on first play. Source maps are excluded
 * because nobody needs them offline.
 *
 * The OPT-IN chunks are excluded for the same reason as the audio, and for one
 * more: ruling #155's "nothing changes for a player who does not opt in". The
 * A4 play-test entry lazy-loads ~250 kB of frozen census tables; precaching
 * them would make every install pay for a debug world nobody armed. They are
 * fetched (and then http-cached) the first time the entry is armed.
 */
const OPT_IN_CHUNK_PREFIXES = ['assets/stage3-'] as const;

export function isShellAsset(fileName: string): boolean {
  if (fileName.endsWith('.map')) return false;
  if (fileName.startsWith('audio/')) return false;
  if (OPT_IN_CHUNK_PREFIXES.some((p) => fileName.startsWith(p))) return false;
  if (fileName === SW_FILE_NAME) return false;
  return true;
}

/**
 * Build the precache list from the bundle's file names.
 *
 * `'./'` is listed alongside `'./index.html'` on purpose: a navigation to the
 * deploy root requests the directory URL, which is a different cache key from
 * the document's own name, and only one of the two would hit offline.
 *
 * ⚠️ The list MUST be free of duplicates. `cache.addAll()` rejects the whole
 * batch with InvalidStateError if two entries resolve to the same URL, the
 * install then fails, and the worker never activates — a silent, total dead
 * worker. This is not hypothetical: the icons arrive both from the bundle (the
 * plugin emits them into it) and from ICON_SPECS, and that shipped a worker
 * that could not install until a browser probe caught it.
 */
export function precacheList(fileNames: readonly string[]): string[] {
  const shell = fileNames.filter(isShellAsset).map((f) => `./${f}`);
  return [...new Set(['./', ...shell, './index.html'])].sort();
}

/**
 * The service worker source.
 *
 * Cache-first throughout (the user's ask), which makes the shell instant and
 * fully offline but means a deploy is only picked up when a NEW worker
 * activates — hence the update prompt. Deliberately NOT calling
 * `skipWaiting()` on install: taking over mid-match would swap the JS bundle
 * under a running game. The page asks for it when the user accepts.
 */
export function serviceWorkerSource(version: string, precache: readonly string[]): string {
  return `// Generated by the pwaAssets plugin (vite.config.ts) — do not edit by hand.
// Build: ${version}
const SHELL_CACHE = ${JSON.stringify(shellCacheName(version))};
const MEDIA_CACHE = ${JSON.stringify(mediaCacheName())};
const MEDIA_EXTENSIONS = ${JSON.stringify(MEDIA_EXTENSIONS)};
const PRECACHE = ${JSON.stringify(precache, null, 2)};

self.addEventListener('install', (event) => {
  // No skipWaiting: a new bundle must not replace a running match's own.
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // One request at a time per entry, NOT cache.addAll: addAll is atomic, so a
    // single 404 (or a duplicate URL) rejects the whole batch, the install
    // fails, and no worker ever activates — silently, for everyone. Degrading
    // to a partial cache is strictly better: whatever is missing simply falls
    // through to the network.
    const failed = [];
    await Promise.all(PRECACHE.map(async (url) => {
      try {
        const res = await fetch(new Request(url, { cache: 'reload' }));
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await cache.put(url, res);
      } catch (err) {
        failed.push(url + ' (' + err + ')');
      }
    }));
    if (failed.length) console.warn('[sw] precache incomplete:', failed);
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (key === SHELL_CACHE || key === MEDIA_CACHE) return undefined;
      // Only ever delete OUR caches — a stray key is somebody else's problem.
      if (!key.startsWith('evo-shell-') && !key.startsWith('evo-media-')) return undefined;
      return caches.delete(key);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  // The page's "update now" button; see src/ui/pwa.ts.
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isMedia(pathname) {
  return MEDIA_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

// ignoreVary is LOAD-BEARING, not a tidy-up. Vite emits the entry script and
// stylesheet with \`crossorigin\`, so the browser sends an \`Origin\` header for
// them — and a server that answers \`Vary: Origin\` (vite preview does; CDNs
// commonly do) makes every one of those requests MISS a cache entry that was
// stored without that header. Offline was completely broken until this was
// added, while the cache looked perfectly populated. Everything here is stored
// under an exact same-origin URL key, so there is nothing for Vary to protect.
const MATCH = { ignoreVary: true };

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // A navigation is served from the precached shell so the game opens with no
  // network at all; the app checks for a new worker separately on every load.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const shell = await caches.open(SHELL_CACHE);
      const hit = (await shell.match(req, MATCH)) || (await shell.match('./index.html', MATCH));
      if (hit) return hit;
      return fetch(req);
    })());
    return;
  }

  event.respondWith((async () => {
    const hit = await caches.match(req, MATCH);
    if (hit) return hit;
    const res = await fetch(req);
    // Only store a real, complete, same-origin 200 — never an opaque or
    // partial response, which would poison the cache with an unusable entry.
    if (res.ok && res.type === 'basic' && res.status === 200 && isMedia(url.pathname)) {
      const cache = await caches.open(MEDIA_CACHE);
      cache.put(req, res.clone());
    }
    return res;
  })());
});
`;
}
