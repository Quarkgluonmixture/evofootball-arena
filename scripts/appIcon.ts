/**
 * Procedural app icon → PNG, with no image library and no committed binary.
 *
 * Track F's procedural-first rule ("geometry/materials/textures generated in
 * code — no binary asset pipeline") applies to the app icon too, but iOS will
 * not use an SVG for a home-screen icon: `apple-touch-icon` and the manifest
 * icons that Safari honours are PNG or nothing. So the icon is defined ONCE
 * here as a shape list, rasterized analytically and encoded to PNG at build
 * time (see the `pwaAssets` plugin in vite.config.ts). Nothing lands on disk
 * in the repo — the bytes are emitted straight into the bundle.
 *
 * The shape list is a deliberate transcription of `public/icon.svg`, which
 * stays the source the browser uses when it CAN take an SVG. A test asserts
 * the two agree on the colours that carry the design, so they cannot drift
 * into two different icons.
 */

import { deflateSync } from 'node:zlib';

/** Design space of the icon artwork, matching `public/icon.svg`'s viewBox. */
export const ICON_VIEWBOX = 512;

/**
 * Fraction of a maskable icon the artwork may occupy. The platform crops a
 * maskable icon to an arbitrary shape and only guarantees the inner 80%
 * circle survives; 0.72 keeps the star accent (the artwork's furthest corner
 * element) inside that circle rather than merely inside the 80% square.
 */
export const MASKABLE_CONTENT_SCALE = 0.72;

/** Sub-samples per axis. 3×3 is enough AA for a 512 px icon of flat shapes. */
const SUPERSAMPLE = 3;

export type Rgb = readonly [number, number, number];

/** A shape is a coverage predicate in icon space plus a colour to paint. */
export interface IconShape {
  readonly inside: (x: number, y: number) => boolean;
  readonly color: Rgb;
  readonly alpha: number;
  /** Optional mask: the shape only paints where this predicate also holds. */
  readonly clip?: (x: number, y: number) => boolean;
}

/* ---------------- colours (single source: icon.svg) ---------------- */

export const ICON_COLORS = {
  /** --bg */
  backdrop: '#0b1220',
  grass: '#2d7a3e',
  grassStripe: '#37904b',
  paint: '#f5f8fc',
  ball: '#f5f7fa',
  ballPip: '#20242c',
  /** --accent */
  accent: '#4ade80',
} as const;

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/* ---------------- primitives ---------------- */

function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  const x1 = x + w;
  const y1 = y + h;
  const rr = Math.min(r, w / 2, h / 2);
  return (px: number, py: number): boolean => {
    if (px < x || px > x1 || py < y || py > y1) return false;
    // Outside a corner box only if beyond the corner's arc.
    const cx = px < x + rr ? x + rr : px > x1 - rr ? x1 - rr : px;
    const cy = py < y + rr ? y + rr : py > y1 - rr ? y1 - rr : py;
    if (cx === px && cy === py) return true;
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= rr * rr;
  };
}

function circle(cx: number, cy: number, r: number) {
  return (px: number, py: number): boolean => {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= r * r;
  };
}

/** Annulus of a given stroke width, centred on radius `r` (an SVG stroke). */
function ring(cx: number, cy: number, r: number, width: number) {
  const inner = r - width / 2;
  const outer = r + width / 2;
  return (px: number, py: number): boolean => {
    const dx = px - cx;
    const dy = py - cy;
    const d2 = dx * dx + dy * dy;
    return d2 >= inner * inner && d2 <= outer * outer;
  };
}

/** Thick line segment (an SVG stroke with butt caps approximated as round). */
function segment(x0: number, y0: number, x1: number, y1: number, width: number) {
  const vx = x1 - x0;
  const vy = y1 - y0;
  const len2 = vx * vx + vy * vy;
  const half = width / 2;
  return (px: number, py: number): boolean => {
    let t = len2 === 0 ? 0 : ((px - x0) * vx + (py - y0) * vy) / len2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const dx = px - (x0 + t * vx);
    const dy = py - (y0 + t * vy);
    return dx * dx + dy * dy <= half * half;
  };
}

/** Rectangle outline of a given stroke width, centred on the path. */
function rectOutline(x: number, y: number, w: number, h: number, width: number) {
  const half = width / 2;
  const outer = roundedRect(x - half, y - half, w + width, h + width, 0);
  const inner = roundedRect(x + half, y + half, w - width, h - width, 0);
  return (px: number, py: number): boolean => outer(px, py) && !inner(px, py);
}

/** Even-odd polygon test. */
function polygon(pts: ReadonlyArray<readonly [number, number]>) {
  return (px: number, py: number): boolean => {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i];
      const [xj, yj] = pts[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
}

/** The five-pointed star of `icon.svg`'s evolution accent, as a polygon. */
function starPoints(): ReadonlyArray<readonly [number, number]> {
  // Transcribed from the SVG path `M 396 88 l 14 28 30 4 -22 21 5 30 -27 -14 …`
  return [
    [396, 88], [410, 116], [440, 120], [418, 141],
    [423, 171], [396, 157], [369, 171], [374, 141],
    [352, 120], [382, 116],
  ];
}

/* ---------------- the artwork ---------------- */

/**
 * The icon as an ordered, painter's-algorithm shape list. Pure: the same
 * input always yields the same list, so a test can pin it.
 *
 * @param rounded whether to round the backdrop's corners. A maskable icon
 *   must bleed to the edges — the platform supplies the shape.
 */
export function iconShapes(rounded: boolean): IconShape[] {
  const c = (hex: string, alpha = 1) => ({ color: hexToRgb(hex), alpha });
  const pitch = roundedRect(56, 136, 400, 240, 18);
  return [
    { inside: roundedRect(0, 0, 512, 512, rounded ? 96 : 0), ...c(ICON_COLORS.backdrop) },
    { inside: pitch, ...c(ICON_COLORS.grass) },
    // Mow stripes, clipped to the pitch so they keep its rounded corners.
    { inside: roundedRect(56, 136, 100, 240, 0), clip: pitch, ...c(ICON_COLORS.grassStripe, 0.55) },
    { inside: roundedRect(256, 136, 100, 240, 0), clip: pitch, ...c(ICON_COLORS.grassStripe, 0.55) },
    // Line paint.
    { inside: rectOutline(72, 152, 368, 208, 8), ...c(ICON_COLORS.paint, 0.95) },
    { inside: segment(256, 152, 256, 360, 8), ...c(ICON_COLORS.paint, 0.95) },
    { inside: ring(256, 256, 46, 8), ...c(ICON_COLORS.paint, 0.95) },
    // Ball.
    { inside: circle(256, 256, 30), ...c(ICON_COLORS.ball) },
    { inside: circle(247, 248, 7), ...c(ICON_COLORS.ballPip) },
    { inside: circle(268, 252, 7), ...c(ICON_COLORS.ballPip) },
    { inside: circle(257, 269, 7), ...c(ICON_COLORS.ballPip) },
    // Evolution accent.
    { inside: polygon(starPoints()), ...c(ICON_COLORS.accent) },
  ];
}

/* ---------------- rasterizer ---------------- */

export interface IconOptions {
  /** Output edge length in pixels. */
  readonly size: number;
  /**
   * Bleed the backdrop to all four edges and shrink the artwork into the
   * maskable safe zone, because the platform will crop this to its own shape.
   */
  readonly maskable?: boolean;
  /**
   * Round the backdrop's corners and leave the outside TRANSPARENT.
   *
   * Right for manifest `purpose: "any"` icons, which Android shows unmasked —
   * a full square would read as a screenshot rather than an app. Wrong for
   * `apple-touch-icon`, which iOS masks itself: an opaque square is what
   * survives that mask cleanly.
   */
  readonly transparentCorners?: boolean;
}

/**
 * Rasterize the icon to straight (un-premultiplied) RGBA bytes,
 * `size * size * 4`.
 */
export function rasterizeIcon(
  { size, maskable = false, transparentCorners = false }: IconOptions,
): Uint8Array {
  const rounded = transparentCorners && !maskable;
  const shapes = iconShapes(rounded);
  const backdropShape = shapes[0].inside;
  const backdrop = hexToRgb(ICON_COLORS.backdrop);
  const out = new Uint8Array(size * size * 4);
  const step = 1 / SUPERSAMPLE;
  const samples = SUPERSAMPLE * SUPERSAMPLE;
  // Pixel → icon space. Maskable shrinks the artwork about the centre, but the
  // backdrop (shape 0) is drawn full-bleed either way, so only the artwork
  // moves: transform the sample point rather than every shape.
  const toIcon = ICON_VIEWBOX / size;
  const half = ICON_VIEWBOX / 2;
  const inv = maskable ? 1 / MASKABLE_CONTENT_SCALE : 1;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SUPERSAMPLE; sy++) {
        for (let sx = 0; sx < SUPERSAMPLE; sx++) {
          const ix = (px + (sx + 0.5) * step) * toIcon;
          const iy = (py + (sy + 0.5) * step) * toIcon;
          // Artwork-space coordinate (identity unless maskable).
          const ax = half + (ix - half) * inv;
          const ay = half + (iy - half) * inv;
          // Outside a rounded backdrop the sub-sample contributes nothing, so
          // the corner antialiases against transparency instead of a colour.
          if (rounded && !backdropShape(ix, iy)) continue;
          let cr = backdrop[0];
          let cg = backdrop[1];
          let cb = backdrop[2];
          for (let i = 1; i < shapes.length; i++) {
            const s = shapes[i];
            if (!s.inside(ax, ay)) continue;
            if (s.clip && !s.clip(ax, ay)) continue;
            cr += (s.color[0] - cr) * s.alpha;
            cg += (s.color[1] - cg) * s.alpha;
            cb += (s.color[2] - cb) * s.alpha;
          }
          r += cr;
          g += cg;
          b += cb;
          a++;
        }
      }
      const o = (py * size + px) * 4;
      // Straight alpha: colour is the mean of the COVERED sub-samples, so a
      // partly-covered edge pixel keeps its full-strength colour.
      out[o] = a === 0 ? 0 : Math.round(r / a);
      out[o + 1] = a === 0 ? 0 : Math.round(g / a);
      out[o + 2] = a === 0 ? 0 : Math.round(b / a);
      out[o + 3] = Math.round((a / samples) * 255);
    }
  }
  return out;
}

/* ---------------- PNG container ---------------- */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf: Uint8Array): number {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}

function chunk(type: string, data: Uint8Array): Buffer {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'ascii');
  const body = Buffer.concat([head.subarray(4), data]); // type + data for the CRC
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([head, data, tail]);
}

/** PNG magic number — the eight bytes every PNG starts with. */
export const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Encode straight RGBA bytes as a non-interlaced 8-bit RGBA PNG. */
export function encodePng(rgba: Uint8Array, width: number, height: number): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: truecolour + alpha
  // 10..12 = deflate / adaptive filtering / no interlace, all zero.

  // One filter byte (0 = None) per scanline. Flat art gains little from the
  // other filters and None keeps the encoder auditable.
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    raw.set(rgba.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', new Uint8Array(0)),
  ]);
}

/** Rasterize + encode in one call: the icon as PNG bytes. */
export function renderIconPng(opts: IconOptions): Buffer {
  return encodePng(rasterizeIcon(opts), opts.size, opts.size);
}
