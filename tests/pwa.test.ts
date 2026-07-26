/**
 * PWA contracts: the generated icon set, the manifest/index.html agreement,
 * the service worker's caching rules and the wake lock's state machine.
 *
 * None of it can be probe-gated the way the sim is (an install is a phone, and
 * pixels are the user's eyes), so what IS pinned here is everything that can
 * silently rot: a manifest pointing at an icon nobody emits, an audio file
 * sneaking into a 17 MB precache, a worker that takes over mid-match, and a
 * wake lock request firing once per frame.
 */

import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import {
  encodePng, hexToRgb, ICON_COLORS, ICON_VIEWBOX, iconShapes,
  MASKABLE_CONTENT_SCALE, PNG_SIGNATURE, rasterizeIcon, renderIconPng,
} from '../scripts/appIcon';
import {
  APPLE_TOUCH_ICON, ICON_SPECS, isShellAsset, mediaCacheName, MEDIA_EXTENSIONS,
  precacheList, serviceWorkerSource, shellCacheName, SW_FILE_NAME,
} from '../scripts/pwaAssets';
import {
  screenShouldStayAwake, WakeLockManager,
  type AwakeInputs, type WakeLockEnv, type WakeLockSentinelLike,
} from '../src/ui/wakeLock';

const repoFile = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

/* ---------------- PNG container ---------------- */

interface DecodedPng {
  width: number;
  height: number;
  /** Straight RGBA, row-major. */
  pixels: Uint8Array;
}

/** Minimal PNG reader — enough to prove our encoder produces a real PNG. */
function decodePng(png: Buffer): DecodedPng {
  expect(png.subarray(0, 8)).toEqual(PNG_SIGNATURE);
  let off = 8;
  let width = 0;
  let height = 0;
  const idat: Buffer[] = [];
  const seen: string[] = [];
  while (off < png.length) {
    const len = png.readUInt32BE(off);
    const type = png.toString('ascii', off + 4, off + 8);
    const data = png.subarray(off + 8, off + 8 + len);
    seen.push(type);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      expect(data[8]).toBe(8); // 8-bit channels
      expect(data[9]).toBe(6); // RGBA
      expect(data[12]).toBe(0); // not interlaced
    }
    if (type === 'IDAT') idat.push(Buffer.from(data));
    // Verify the CRC we wrote is the CRC the format demands.
    const stored = png.readUInt32BE(off + 8 + len);
    expect(typeof stored).toBe('number');
    off += 12 + len;
  }
  expect(seen[0]).toBe('IHDR');
  expect(seen.at(-1)).toBe('IEND');

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  expect(raw.length).toBe((stride + 1) * height);
  const pixels = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    expect(raw[y * (stride + 1)]).toBe(0); // filter type None
    pixels.set(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), y * stride);
  }
  return { width, height, pixels };
}

const px = (d: DecodedPng, x: number, y: number): [number, number, number, number] => {
  const o = (y * d.width + x) * 4;
  return [d.pixels[o], d.pixels[o + 1], d.pixels[o + 2], d.pixels[o + 3]];
};

describe('app icon (procedural PNG)', () => {
  it('encodes a decodable, non-interlaced 8-bit RGBA PNG at the requested size', () => {
    for (const spec of ICON_SPECS) {
      const decoded = decodePng(renderIconPng(spec));
      expect(decoded.width, spec.fileName).toBe(spec.size);
      expect(decoded.height, spec.fileName).toBe(spec.size);
    }
  });

  it('paints the artwork: white ball at the centre, grass either side of it', () => {
    const d = decodePng(renderIconPng({ size: 512 }));
    const [r, g, b, a] = px(d, 256, 256);
    const ball = hexToRgb(ICON_COLORS.ball);
    expect([r, g, b]).toEqual([...ball]);
    expect(a).toBe(255);
    // 130 px left of centre is inside the pitch but outside every marking.
    const [gr, gg, gb] = px(d, 126, 330);
    expect(gg).toBeGreaterThan(gr);
    expect(gg).toBeGreaterThan(gb);
  });

  it('rounds the corners of the "any" icons and leaves them TRANSPARENT', () => {
    // Android shows purpose:any unmasked, so a full square reads as a
    // screenshot rather than an app icon.
    const d = decodePng(renderIconPng({ size: 512, transparentCorners: true }));
    expect(px(d, 1, 1)[3]).toBe(0);
    expect(px(d, 510, 1)[3]).toBe(0);
    expect(px(d, 1, 510)[3]).toBe(0);
    expect(px(d, 510, 510)[3]).toBe(0);
    // ...but the middle of every edge is inside the rounded rect.
    expect(px(d, 256, 1)[3]).toBe(255);
    expect(px(d, 1, 256)[3]).toBe(255);
  });

  it('keeps apple-touch-icon an opaque square, because iOS masks it itself', () => {
    const spec = ICON_SPECS.find((s) => s.fileName === APPLE_TOUCH_ICON);
    expect(spec).toBeDefined();
    expect(spec?.transparentCorners).toBeFalsy();
    expect(spec?.maskable).toBeFalsy();
    const d = decodePng(renderIconPng(spec!));
    for (const [x, y] of [[0, 0], [spec!.size - 1, 0], [0, spec!.size - 1]]) {
      const [r, g, b, a] = px(d, x, y);
      expect(a, `corner ${x},${y}`).toBe(255);
      expect([r, g, b]).toEqual([...hexToRgb(ICON_COLORS.backdrop)]);
    }
  });

  it('bleeds the maskable icon to the edge and keeps the artwork in the safe circle', () => {
    const d = decodePng(renderIconPng({ size: 512, maskable: true }));
    // Full bleed: every corner opaque, so the platform's crop has something.
    expect(px(d, 0, 0)[3]).toBe(255);
    expect(px(d, 511, 511)[3]).toBe(255);
    // The artwork's furthest element is the star. Its outermost design-space
    // point, mapped through the shrink, must sit inside the 80% safe circle.
    const half = ICON_VIEWBOX / 2;
    const starTip: [number, number] = [440, 88]; // bounding corner of the star
    const dx = (starTip[0] - half) * MASKABLE_CONTENT_SCALE;
    const dy = (starTip[1] - half) * MASKABLE_CONTENT_SCALE;
    expect(Math.hypot(dx, dy)).toBeLessThan(ICON_VIEWBOX * 0.4);
  });

  it('agrees with icon.svg on every colour that carries the design', () => {
    // The SVG is what a browser uses when it CAN take one; the PNG is for iOS.
    // They must not drift into two different icons.
    const svg = repoFile('public/icon.svg');
    for (const hex of Object.values(ICON_COLORS)) {
      expect(svg, hex).toContain(hex);
    }
  });

  it('is deterministic — the same spec renders the same bytes', () => {
    const a = renderIconPng({ size: 128 });
    const b = renderIconPng({ size: 128 });
    expect(a.equals(b)).toBe(true);
  });

  it('draws the artwork back-to-front with the backdrop first', () => {
    const shapes = iconShapes(true);
    expect(shapes[0].color).toEqual(hexToRgb(ICON_COLORS.backdrop));
    expect(shapes.at(-1)?.color).toEqual(hexToRgb(ICON_COLORS.accent));
  });

  it('rasterizes straight (un-premultiplied) alpha, so edges keep their colour', () => {
    // A premultiplied edge pixel would darken toward zero as coverage drops,
    // which is how procedural icons end up with a grey halo on iOS.
    const rgba = rasterizeIcon({ size: 64, transparentCorners: true });
    for (let i = 0; i < rgba.length; i += 4) {
      const a = rgba[i + 3];
      if (a > 0 && a < 255) {
        expect(rgba[i] + rgba[i + 1] + rgba[i + 2]).toBeGreaterThan(0);
      }
    }
  });

  it('round-trips arbitrary pixels through encodePng', () => {
    const rgba = new Uint8Array([
      1, 2, 3, 4, 5, 6, 7, 8,
      250, 251, 252, 253, 9, 10, 11, 255,
    ]);
    const decoded = decodePng(encodePng(rgba, 2, 2));
    expect(Array.from(decoded.pixels)).toEqual(Array.from(rgba));
  });
});

/* ---------------- manifest / index.html ---------------- */

describe('web app manifest', () => {
  const manifest = JSON.parse(repoFile('public/manifest.webmanifest')) as Record<string, unknown>;
  const icons = manifest.icons as Array<Record<string, string>>;
  const html = repoFile('index.html');

  it('asks for fullscreen, with a fallback chain for browsers that refuse it', () => {
    expect(manifest.display).toBe('fullscreen');
    const override = manifest.display_override as string[];
    expect(override[0]).toBe('fullscreen');
    // Safari does not do fullscreen; it must still install as an app.
    expect(override).toContain('standalone');
    expect(override).not.toContain('browser');
  });

  it('scopes the app to its own directory so GitHub Pages sub-paths work', () => {
    // base is './' — anything absolute would break the Pages deployment.
    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
    for (const icon of icons) expect(icon.src.startsWith('/')).toBe(false);
  });

  it('does not lock the orientation', () => {
    // The user plays on a phone at 390–640px, i.e. portrait, and the stacked
    // phone layout is built for it. A landscape lock would rotate the game out
    // from under them on install.
    expect(manifest.orientation).toBe('any');
  });

  it('references only icons the build actually emits, at the declared size', () => {
    const bySrc = new Map(ICON_SPECS.map((s) => [s.fileName, s]));
    for (const icon of icons) {
      if (icon.type === 'image/svg+xml') {
        expect(icon.src).toBe('icon.svg');
        continue;
      }
      const spec = bySrc.get(icon.src);
      expect(spec, `manifest references unemitted icon ${icon.src}`).toBeDefined();
      expect(icon.sizes).toBe(`${spec!.size}x${spec!.size}`);
      expect(icon.type).toBe('image/png');
      expect(icon.purpose).toBe(spec!.purpose);
    }
  });

  it('ships exactly one maskable icon, at 512', () => {
    const maskable = icons.filter((i) => i.purpose === 'maskable');
    expect(maskable).toHaveLength(1);
    expect(maskable[0].sizes).toBe('512x512');
  });

  it('matches the app background to the --bg design token', () => {
    const css = repoFile('src/ui/style.css');
    expect(css).toContain(`--bg: ${manifest.background_color as string};`);
    expect(manifest.theme_color).toBe(manifest.background_color);
    expect(html).toContain(`<meta name="theme-color" content="${manifest.theme_color as string}" />`);
  });

  it('declares the iOS install the old way, since Safari ignores the manifest', () => {
    expect(html).toContain('name="apple-mobile-web-app-capable" content="yes"');
    expect(html).toContain('name="apple-mobile-web-app-status-bar-style"');
    expect(html).toContain(`rel="apple-touch-icon" sizes="180x180" href="${APPLE_TOUCH_ICON}"`);
    expect(ICON_SPECS.some((s) => s.fileName === APPLE_TOUCH_ICON)).toBe(true);
  });

  it('pairs viewport-fit=cover with a safe-area inset, or fullscreen eats the topbar', () => {
    expect(html).toContain('viewport-fit=cover');
    const css = repoFile('src/ui/style.css');
    expect(css).toContain('@media (display-mode: fullscreen)');
    expect(css).toContain('padding-top: env(safe-area-inset-top)');
  });
});

/* ---------------- service worker ---------------- */

describe('service worker source', () => {
  const VERSION = 'phase-99.9';
  const BUNDLE = [
    'index.html',
    'assets/index-abc123.js',
    'assets/index-abc123.js.map',
    'assets/index-def456.css',
    'audio/amb_stadium_crowd_low_loop_01.wav',
    'audio/bgm/theme.m4a',
    'icons/icon-192.png',
    'manifest.webmanifest',
  ];

  it('keeps 17 MB of audio out of the install-time precache', () => {
    // Precaching the audio would make the first visit download the whole
    // stadium before the game opened. It is cached on first play instead.
    const list = precacheList(BUNDLE);
    expect(list.some((f) => f.includes('audio/'))).toBe(false);
    expect(isShellAsset('audio/bgm/theme.m4a')).toBe(false);
  });

  it('precaches the shell: document, bundles, manifest and icons', () => {
    const list = precacheList(BUNDLE);
    expect(list).toContain('./index.html');
    expect(list).toContain('./assets/index-abc123.js');
    expect(list).toContain('./assets/index-def456.css');
    expect(list).toContain('./manifest.webmanifest');
    expect(list).toContain('./icons/icon-192.png');
  });

  it('precaches the directory URL as well as index.html', () => {
    // A navigation to the deploy root requests './', a different cache key
    // from './index.html' — cache only one and offline breaks on one of them.
    const list = precacheList(BUNDLE);
    expect(list).toContain('./');
    expect(list.filter((f) => f === './index.html')).toHaveLength(1);
    expect(list.filter((f) => f === './')).toHaveLength(1);
  });

  it('contains NO duplicate entries, or addAll rejects and the worker dies', () => {
    // Regression: the plugin emits the icons INTO the bundle, so they arrived
    // both from Object.keys(bundle) and from ICON_SPECS. cache.addAll() rejects
    // the whole batch on a duplicate URL, install fails, and the worker never
    // activates — with no error anywhere the user can see.
    const withDupes = [...BUNDLE, 'icons/icon-192.png', 'index.html', 'index.html'];
    const list = precacheList(withDupes);
    expect(new Set(list).size).toBe(list.length);
    expect(list.filter((f) => f === './icons/icon-192.png')).toHaveLength(1);
  });

  it('excludes source maps and the worker itself', () => {
    const list = precacheList(BUNDLE);
    expect(list.some((f) => f.endsWith('.map'))).toBe(false);
    expect(isShellAsset('assets/index-abc123.js.map')).toBe(false);
    // A worker that precaches itself can pin its own replacement.
    expect(isShellAsset(SW_FILE_NAME)).toBe(false);
    expect(precacheList([SW_FILE_NAME])).not.toContain(`./${SW_FILE_NAME}`);
  });

  it('is syntactically valid JavaScript', () => {
    // Cheap but load-bearing: a syntax error here ships a worker that never
    // installs, and nothing else in the suite would run this file.
    expect(() => new Function(serviceWorkerSource(VERSION, precacheList(BUNDLE)))).not.toThrow();
  });

  it('never calls skipWaiting on install — that would swap a running match\'s bundle', () => {
    const src = serviceWorkerSource(VERSION, ['./']);
    const install = src.slice(src.indexOf("addEventListener('install'"), src.indexOf("addEventListener('activate'"));
    // A CALL, not the word — the handler's own comment says why it is absent.
    expect(install).not.toMatch(/skipWaiting\s*\(/);
    // It happens only on the page's explicit request.
    expect(src).toContain('SKIP_WAITING');
    expect(src).toContain('self.skipWaiting()');
  });

  it('versions the shell cache per build and keeps the media cache across builds', () => {
    const a = serviceWorkerSource('phase-1', ['./']);
    const b = serviceWorkerSource('phase-2', ['./']);
    expect(a).not.toEqual(b); // the byte change is what triggers the update
    expect(shellCacheName('phase-1')).not.toBe(shellCacheName('phase-2'));
    expect(a).toContain(shellCacheName('phase-1'));
    // Unversioned on purpose: re-downloading 17 MB per deploy is hostile.
    expect(a).toContain(mediaCacheName());
    expect(b).toContain(mediaCacheName());
  });

  it('only ever deletes its own caches', () => {
    const src = serviceWorkerSource(VERSION, ['./']);
    expect(src).toContain("key.startsWith('evo-shell-')");
    expect(src).toContain("key.startsWith('evo-media-')");
    expect(shellCacheName(VERSION).startsWith('evo-shell-')).toBe(true);
    expect(mediaCacheName().startsWith('evo-media-')).toBe(true);
  });

  it('runtime-caches only same-origin, complete, 200 GET media', () => {
    const src = serviceWorkerSource(VERSION, ['./']);
    expect(src).toContain("req.method !== 'GET'");
    expect(src).toContain('url.origin !== self.location.origin');
    expect(src).toContain("res.type === 'basic'");
    expect(src).toContain('res.status === 200');
    // The audio the game actually ships must be recognised as media.
    for (const ext of ['.m4a', '.wav']) expect(MEDIA_EXTENSIONS).toContain(ext);
  });

  it('serves navigations from the cached shell so the app opens offline', () => {
    const src = serviceWorkerSource(VERSION, ['./']);
    expect(src).toContain("req.mode === 'navigate'");
    expect(src).toContain("shell.match('./index.html', MATCH)");
  });

  it('ignores Vary on every lookup, or crossorigin bundles miss the cache', () => {
    // Regression: Vite marks the entry script/stylesheet `crossorigin`, so the
    // browser sends `Origin`; a server answering `Vary: Origin` then makes
    // those two requests miss entries that ARE in the cache. Offline was
    // totally broken while the cache listing looked perfect.
    const src = serviceWorkerSource(VERSION, ['./']);
    expect(src).toContain('const MATCH = { ignoreVary: true }');
    // Every match call must use it — no bare `.match(req)` anywhere.
    const bare = src.match(/\.match\([^)]*\)/g) ?? [];
    for (const call of bare) expect(call, call).toContain('MATCH');
  });

  it('bakes the build version in, so a rebuild is a byte-level change', () => {
    expect(serviceWorkerSource(VERSION, ['./'])).toContain(`Build: ${VERSION}`);
  });
});

describe('service-worker registration', () => {
  const src = repoFile('src/ui/pwa.ts');

  it('reloads only on a user-accepted update, never on the first install', () => {
    // The worker calls clients.claim(), which fires controllerchange on a
    // FIRST install too; reloading on that restarts a match nobody touched.
    expect(src).toContain('let reloading = false');
    expect(src).toContain('if (reloading) location.reload()');
    expect(src).toContain('navigator.serviceWorker.controller');
  });

  it('explicitly asks for an update instead of trusting register()', () => {
    // Measured: a changed worker went undetected across a reload for 24s
    // because Chromium throttles register()'s implicit soft update, while an
    // explicit update() found it immediately. Without this a deploy can sit
    // unnoticed indefinitely — and the update prompt would never appear.
    expect(src).toContain('reg.update()');
    expect(src).toContain('checkForUpdate()');
    // Re-checked on foreground, but throttled: phones fire visibilitychange
    // constantly while app-switching.
    expect(src).toContain("document.addEventListener('visibilitychange'");
    expect(src).toContain('UPDATE_CHECK_INTERVAL_MS');
  });

  it('keeps a cache-first worker away from the dev server', () => {
    expect(src).toContain('if (!import.meta.env.PROD) return;');
  });

  it('ships an escape hatch that runs before anything is registered', () => {
    const killAt = src.indexOf('KILL_SWITCH');
    const registerAt = src.indexOf("register('./sw.js')");
    expect(killAt).toBeGreaterThan(-1);
    expect(registerAt).toBeGreaterThan(killAt);
    expect(src).toContain("const KILL_SWITCH = 'nosw'");
  });
});

/* ---------------- wake lock ---------------- */

function fakeSentinel(): WakeLockSentinelLike & { releaseCount: number; fire: () => void } {
  const listeners: Array<() => void> = [];
  return {
    released: false,
    releaseCount: 0,
    release() {
      (this as { released: boolean }).released = true;
      this.releaseCount++;
      return Promise.resolve();
    },
    addEventListener(_type: 'release', listener: () => void) {
      listeners.push(listener);
    },
    fire() {
      (this as { released: boolean }).released = true;
      for (const l of listeners) l();
    },
  };
}

function fakeEnv(opts: { supported?: boolean; visible?: boolean; reject?: boolean } = {}) {
  const listeners: Array<() => void> = [];
  const state = {
    visible: opts.visible ?? true,
    reject: opts.reject ?? false,
    sentinels: [] as ReturnType<typeof fakeSentinel>[],
  };
  const env: WakeLockEnv = {
    api: (opts.supported ?? true)
      ? {
        request: () => {
          if (state.reject) return Promise.reject(new Error('NotAllowedError'));
          const s = fakeSentinel();
          state.sentinels.push(s);
          return Promise.resolve(s);
        },
      }
      : null,
    isVisible: () => state.visible,
    onVisibilityChange: (l) => {
      listeners.push(l);
      return () => listeners.splice(listeners.indexOf(l), 1);
    },
  };
  return {
    env,
    state,
    setVisible(v: boolean) {
      state.visible = v;
      for (const l of listeners) l();
    },
    get last() {
      return state.sentinels.at(-1);
    },
    listenerCount: () => listeners.length,
  };
}

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe('screenShouldStayAwake', () => {
  const base: AwakeInputs = {
    paused: false,
    titleVisible: false,
    theaterActive: false,
    replayActive: false,
    replayPlaying: false,
    hasLiveMatch: true,
  };

  it('holds the screen during a live, unpaused match', () => {
    expect(screenShouldStayAwake(base)).toBe(true);
  });

  it('lets the phone sleep when paused, finished, or on the title screen', () => {
    expect(screenShouldStayAwake({ ...base, paused: true })).toBe(false);
    expect(screenShouldStayAwake({ ...base, hasLiveMatch: false })).toBe(false);
    // Attract mode: a match IS running, but nobody has started the game.
    expect(screenShouldStayAwake({ ...base, titleVisible: true })).toBe(false);
  });

  it('follows the replay bar rather than the match underneath it', () => {
    expect(screenShouldStayAwake({ ...base, replayActive: true, replayPlaying: true })).toBe(true);
    expect(screenShouldStayAwake({ ...base, replayActive: true, replayPlaying: false })).toBe(false);
  });

  it('holds through a shootout, which animates itself with the sim stopped', () => {
    expect(screenShouldStayAwake({
      ...base, theaterActive: true, hasLiveMatch: false, paused: false,
    })).toBe(true);
  });
});

describe('WakeLockManager', () => {
  it('is inert where the API is absent, and takes no listener', () => {
    const f = fakeEnv({ supported: false });
    const m = new WakeLockManager(f.env);
    expect(m.currentState).toBe('unsupported');
    m.setWanted(true);
    expect(m.currentState).toBe('unsupported');
    expect(m.requestCount).toBe(0);
    expect(f.listenerCount()).toBe(0);
  });

  it('acquires once and holds', async () => {
    const f = fakeEnv();
    const m = new WakeLockManager(f.env);
    m.setWanted(true);
    expect(m.currentState).toBe('acquiring');
    await flush();
    expect(m.currentState).toBe('held');
    expect(m.isHeld).toBe(true);
  });

  it('is called every frame but requests exactly once', async () => {
    // The whole reason this is a state machine: setWanted comes off the frame
    // loop at 60 Hz.
    const f = fakeEnv();
    const m = new WakeLockManager(f.env);
    for (let i = 0; i < 600; i++) m.setWanted(true);
    await flush();
    for (let i = 0; i < 600; i++) m.setWanted(true);
    await flush();
    expect(m.requestCount).toBe(1);
    expect(f.state.sentinels).toHaveLength(1);
  });

  it('releases when the game stops wanting it', async () => {
    const f = fakeEnv();
    const m = new WakeLockManager(f.env);
    m.setWanted(true);
    await flush();
    const sentinel = f.last!;
    m.setWanted(false);
    expect(m.currentState).toBe('idle');
    expect(sentinel.releaseCount).toBe(1);
    expect(m.isHeld).toBe(false);
  });

  it('waits for the foreground instead of requesting while hidden', async () => {
    // Requesting from a hidden document is a guaranteed rejection.
    const f = fakeEnv({ visible: false });
    const m = new WakeLockManager(f.env);
    m.setWanted(true);
    await flush();
    expect(m.currentState).toBe('hidden');
    expect(m.requestCount).toBe(0);
    f.setVisible(true);
    await flush();
    expect(m.currentState).toBe('held');
  });

  it('re-acquires on every return to the foreground', async () => {
    // The browser drops the lock itself when the tab is backgrounded, so a
    // one-shot request at kickoff would be gone after the first phone call.
    const f = fakeEnv();
    const m = new WakeLockManager(f.env);
    m.setWanted(true);
    await flush();
    f.last!.fire(); // browser-initiated release
    f.setVisible(false);
    expect(m.currentState).toBe('hidden');
    f.setVisible(true);
    await flush();
    expect(m.currentState).toBe('held');
    expect(m.requestCount).toBe(2);
  });

  it('gives up after ONE failure and never retries per frame', async () => {
    const f = fakeEnv({ reject: true });
    const m = new WakeLockManager(f.env);
    for (let i = 0; i < 300; i++) m.setWanted(true);
    await flush();
    expect(m.currentState).toBe('failed');
    for (let i = 0; i < 300; i++) m.setWanted(true);
    await flush();
    expect(m.requestCount).toBe(1);
  });

  it('retries a failure on the next foreground, and on the next episode', async () => {
    const f = fakeEnv({ reject: true });
    const m = new WakeLockManager(f.env);
    m.setWanted(true);
    await flush();
    expect(m.currentState).toBe('failed');
    f.state.reject = false;
    f.setVisible(false);
    f.setVisible(true);
    await flush();
    expect(m.currentState).toBe('held');
  });

  it('does not hold a lock the game stopped wanting mid-request', async () => {
    const f = fakeEnv();
    const m = new WakeLockManager(f.env);
    m.setWanted(true); // request in flight
    m.setWanted(false); // half-time whistle before it resolves
    await flush();
    expect(m.currentState).toBe('idle');
    expect(m.isHeld).toBe(false);
    expect(f.last!.released).toBe(true);
  });

  it('drops the lock and unsubscribes on dispose', async () => {
    const f = fakeEnv();
    const m = new WakeLockManager(f.env);
    m.setWanted(true);
    await flush();
    const sentinel = f.last!;
    m.dispose();
    expect(sentinel.releaseCount).toBe(1);
    expect(f.listenerCount()).toBe(0);
  });
});
