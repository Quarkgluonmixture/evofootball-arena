import { describe, expect, it } from 'vitest';
import { PLAYER_MIN_DIST } from '../src/sim/constants';
import {
  BUMP_MIN_CLOSING, CONTACT_ENTER, CONTACT_LEAVE, ContactTracker,
} from '../src/render3d/contactCues';
import { SHADOW_WINDOW, groundAim, lightBasis, snapToLightTexels } from '../src/render3d/shadowFollow';
import { RENDER_QUALITY, pixelRatioFor } from '../src/render3d/renderQuality';
import { STYLE_IDS, stylePreset } from '../src/render3d/stylePresets';

/**
 * Track F / F-Q (2026-09-15) — the pure halves of the render-quality step.
 * Each test names the bug it catches.
 */

describe('ContactTracker (F-Q body bumps, pure)', () => {
  const shell = PLAYER_MIN_DIST;
  const frame = (tracker: ContactTracker, t: number, ax: number, bx: number) =>
    tracker.update([{ gid: 1, x: ax, z: 0 }, { gid: 2, x: bx, z: 0 }], t);

  it('a marking pair drifting into the shell at a walk does NOT bump', () => {
    // Phase 38 measured 185–286 shell "contacts" a match from marking alone;
    // a proximity trigger would have the whole defence flinching all game.
    const tr = new ContactTracker();
    let gap = shell * 1.6;
    let bumps = 0;
    let reached = false;
    for (let i = 0; i < 240; i++) {
      gap = Math.max(shell, gap - 0.5 / 60); // closing at 0.5 m/s — below BUMP_MIN_CLOSING
      if (gap < shell * CONTACT_ENTER) reached = true;
      bumps += frame(tr, i / 60, 0, gap).length;
    }
    expect(reached).toBe(true); // they did reach the shell and sat in it
    expect(bumps).toBe(0);
  });

  it('a pair arriving at speed bumps ONCE, with the normal from a to b, and not again until re-armed', () => {
    const tr = new ContactTracker();
    const v = BUMP_MIN_CLOSING * 3; // m/s, body 2 running at body 1
    let gap = shell * 1.6;
    const all: ReturnType<typeof frame> = [];
    for (let i = 0; i < 40; i++) {
      gap = Math.max(shell, gap - v / 60);
      all.push(...frame(tr, i / 60, 0, gap));
    }
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ a: 1, b: 2, nx: 1, nz: 0 });
    expect(all[0].closing).toBeGreaterThanOrEqual(BUMP_MIN_CLOSING);
    // Still in contact, still nothing — and separating past LEAVE re-arms.
    expect(frame(tr, 41 / 60, 0, shell).length).toBe(0);
    expect(frame(tr, 42 / 60, 0, shell * (CONTACT_LEAVE + 0.05)).length).toBe(0);
    let gap2 = shell * (CONTACT_LEAVE + 0.05);
    let again = 0;
    for (let i = 43; i < 90; i++) {
      gap2 = Math.max(shell, gap2 - v / 60);
      again += frame(tr, i / 60, 0, gap2).length;
    }
    expect(again).toBe(1);
  });

  it('a replay jump or a paused frame never invents a bump from the teleport', () => {
    const tr = new ContactTracker();
    frame(tr, 10, -20, 20); // far apart
    // Same sim time (paused) then a backwards scrub, landing inside the shell.
    expect(frame(tr, 10, 0, shell).length).toBe(0);
    expect(frame(tr, 3, 0, shell).length).toBe(0);
  });
});

describe('shadow follow (F-Q, pure)', () => {
  const sun = { x: -34, y: 66, z: 26 }; // the toy/day key light
  const win = SHADOW_WINDOW.follow!;

  it('a smoothly panning aim lands on a texel GRID: idempotent, and steps of exactly one texel', () => {
    // Without snapping every sub-texel camera move shifts the whole shadow
    // map by a fraction of a texel and the edges crawl. On a grid, a pan of
    // 0.1 texel per frame either stays put or jumps one whole texel.
    const map = 2048;
    const texel = (2 * win.halfX) / map; // along the light's right axis
    const texelY = (2 * win.halfY) / map; // along its up axis — the box is not square
    const { right, up } = lightBasis(sun);
    const planar = (a: { x: number; y: number; z: number }, b: typeof a) => {
      const d = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
      return Math.hypot(d.x * right.x + d.y * right.y + d.z * right.z, d.x * up.x + d.y * up.y + d.z * up.z);
    };
    let prev = snapToLightTexels({ x: 3.1, y: 0, z: -2.2 }, sun, win, map);
    let distinct = 1;
    for (let i = 1; i <= 200; i++) {
      const aim = { x: 3.1 + i * texel * 0.1, y: 0, z: -2.2 + i * texel * 0.03 };
      const s = snapToLightTexels(aim, sun, win, map);
      expect(planar(s, snapToLightTexels(s, sun, win, map))).toBeLessThan(1e-9); // idempotent
      const step = planar(prev, s);
      if (step > 1e-9) {
        distinct++;
        // One texel along right, along up, or the diagonal — never a fraction.
        const legal = [texel, texelY, Math.hypot(texel, texelY)];
        expect(legal.some((l) => Math.abs(step - l) < 1e-9), `step ${step}`).toBe(true);
      }
      prev = s;
    }
    // 200 frames × 0.1 texel of pan ≈ 20 texels of travel → ~20–30 distinct boxes, not 200.
    expect(distinct).toBeLessThan(40);
  });

  it('snapping only moves the aim within the light plane, never along the sun', () => {
    const aim = { x: 7.3, y: 0, z: 4.9 };
    const s = snapToLightTexels(aim, sun, win, 2048);
    const { dir } = lightBasis(sun);
    const d = { x: s.x - aim.x, y: s.y - aim.y, z: s.z - aim.z };
    expect(Math.abs(d.x * dir.x + d.y * dir.y + d.z * dir.z)).toBeLessThan(1e-9);
    expect(Math.hypot(d.x, d.y, d.z)).toBeLessThan((2 * win.halfX) / 2048);
  });

  it('the ground aim is where the camera looks, and never behind a level camera', () => {
    expect(groundAim({ x: 0, y: 10, z: 10 }, { x: 0, y: -Math.SQRT1_2, z: -Math.SQRT1_2 })).toEqual({ x: 0, y: 0, z: 0 });
    expect(groundAim({ x: 5, y: 3, z: 1 }, { x: 1, y: 0, z: 0 })).toEqual({ x: 5, y: 0, z: 1 });
  });

  it('wide cameras keep the full-pitch box; every play camera has a window', () => {
    expect(SHADOW_WINDOW.tactical).toBeNull();
    expect(SHADOW_WINDOW.tacfeed).toBeNull();
    for (const m of ['broadcast', 'follow', 'thirdPerson', 'behindGoal', 'penalty']) {
      expect(SHADOW_WINDOW[m], m).not.toBeNull();
    }
  });
});

describe('render quality ladder (F-Q, data)', () => {
  it('never renders above the device ratio, and high is native on a DPR-3 phone', () => {
    expect(pixelRatioFor('high', 3)).toBe(3);
    expect(pixelRatioFor('high', 2)).toBe(2);
    expect(pixelRatioFor('low', 3)).toBe(1);
  });

  it('the pitch canvas stays under the 4096-texel limit at every quality', () => {
    // 73 × 50.6 m plane (FIELD_SCALE 0.7 + 5 m apron): 40 px/m → 2920 px.
    for (const spec of Object.values(RENDER_QUALITY)) {
      expect((31.5 + 5) * 2 * spec.pitchPx).toBeLessThanOrEqual(4096);
    }
  });

  it('the banked `current` baseline gained the new fields with NO-OP values', () => {
    // F-DIRECTION: never edit `current`. Growing the interface is allowed
    // only if the frame it renders is unchanged — environment off, no relief.
    for (const lighting of ['night', 'day'] as const) {
      const p = stylePreset('current', lighting);
      expect(p.environment).toBe(0);
      expect(p.turfBump).toBe(0);
    }
    // ...and the shipped arm actually uses them.
    for (const id of STYLE_IDS) {
      if (id === 'current') continue;
      expect(stylePreset(id, 'day').environment).toBeGreaterThan(0);
    }
  });
});
