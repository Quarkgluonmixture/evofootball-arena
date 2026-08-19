import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  barrel, limb, LIMB_RADIAL_SEG, shoe, TORSO_BASE, TORSO_RADIAL_SEG,
} from '../src/render3d/PlayerModel';

/**
 * ⭐⭐ THE GEOMETRY-GUARD PIN (R8 item (iii), ruling #312 item 3 — discharging
 * RB2-OFFICIALS-ROUNDING.md §COMMANDER CORRECTIONS item 2 / §5's self-disclosed
 * "no automated pin guards this rounding").
 *
 * THE DEBT IT PAYS. RB (docs/world-model/RB-ROUND-BODY-SLICE.md) and RB-2
 * (docs/world-model/RB2-OFFICIALS-ROUNDING.md) each rest on ONE invariant:
 * *"every part occupies exactly the same bounding box as the box it replaces"* —
 * which is what keeps `armSpan` / `maxArmSpan`, the F1 anchor
 * `HUMAN_MODEL_SCALE = 0.64` and the F2 toy proportions numerically untouched
 * while every anatomy box became a body of revolution. Both slices MEASURED it
 * with a throwaway `/tmp` script (RB-2 §3.4) and committed nothing, so a future
 * edit could put a box back — or resize a barrel — with a fully green suite.
 * This file is that guard, made permanent.
 *
 * WHAT IT ASSERTS, per rounded part across the four model files:
 *   (1) BBOX INVARIANCE — the geometry the models build has the DIMENSIONS of
 *       the box it replaced, within **1e-6** (RB/RB-2's own stated tolerance;
 *       the worst row measured there was 3.0e-8, one float32 rounding step, so
 *       1e-6 can never do hidden work while still catching a real resize).
 *   (2) THE CALL SITE — the shipped construction expression appears in its file
 *       EXACTLY ONCE. Without this the table below could drift away from the
 *       code silently and still pass (1); with it, an argument change fails
 *       here and has to be re-derived against the box. (Canon idiom: *"a
 *       src-extracted constant pins its extraction to the NAMED call site —
 *       anchored match + line receipt — never first-occurrence"*, home
 *       BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1.)
 *   (3) NO BOX IN THE ANATOMY — none of the four files may name `BoxGeometry`
 *       at all. Flat pieces stay flat by NAME (`PlaneGeometry`) and are exempt.
 *
 * THE BOX DIMENSIONS ARE HARDCODED ON PURPOSE. They are the pre-RB geometry,
 * which no longer exists in src — the only sources of truth for them are the
 * landing docs' own tables: RB-ROUND-BODY-SLICE.md §1 (the player, 8 parts) and
 * RB2-OFFICIALS-ROUNDING.md §1 (referee / linesman / coach, 15 parts).
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = (file: string): string =>
  readFileSync(join(HERE, '..', 'src', 'render3d', file), 'utf8');

const FILES = ['PlayerModel.ts', 'RefereeModel.ts', 'LinesmanModel.ts', 'CoachModel.ts'] as const;
const SOURCES: Record<string, string> = Object.fromEntries(FILES.map((f) => [f, SRC(f)]));

/** RB/RB-2's stated tolerance. The worst row either slice measured was 3.0e-8. */
const TOL = 1e-6;

type Part = {
  /** which model file builds it */
  file: (typeof FILES)[number];
  /** the part's name in the landing doc's table */
  name: string;
  /** the replaced `BoxGeometry(w, h, d)` — from the landing doc tables, see header */
  box: readonly [number, number, number];
  /** how many of these the figure carries (documentation only) */
  count: number;
  /** the shipped construction expression; must occur EXACTLY once in `file` */
  callSite: string;
  /** rebuild it from the SHIPPED exported primitives with the SHIPPED arguments */
  build: () => THREE.BufferGeometry;
};

/* ---- RB: the player (RB-ROUND-BODY-SLICE.md §1, 8 rounded parts) ---- */
const PLAYER_PARTS: Part[] = [
  {
    file: 'PlayerModel.ts', name: 'torso', box: [0.72, 0.86, 0.54], count: 1,
    callSite: 'barrel(TORSO_BASE.w / 2, TORSO_BASE.h / 2, 0.20, TORSO_RADIAL_SEG)',
    build: () => barrel(TORSO_BASE.w / 2, TORSO_BASE.h / 2, 0.20, TORSO_RADIAL_SEG)
      .scale(1, 1, TORSO_BASE.d / TORSO_BASE.w),
  },
  {
    file: 'PlayerModel.ts', name: 'hips', box: [0.68, 0.34, 0.5], count: 1,
    callSite: 'barrel(0.34, 0.17, 0.15, TORSO_RADIAL_SEG).scale(1, 1, 0.5 / 0.68)',
    build: () => barrel(0.34, 0.17, 0.15, TORSO_RADIAL_SEG).scale(1, 1, 0.5 / 0.68),
  },
  {
    file: 'PlayerModel.ts', name: 'sleeve (upper arm)', box: [0.30, 0.36, 0.30], count: 2,
    callSite: 'limb(SLEEVE_HALF_W, 0.36)',
    build: () => limb(0.15, 0.36),
  },
  {
    file: 'PlayerModel.ts', name: 'forearm', box: [0.26, 0.44, 0.26], count: 2,
    callSite: 'limb(FOREARM_HALF_W, 0.44)',
    build: () => limb(0.13, 0.44),
  },
  {
    file: 'PlayerModel.ts', name: 'thigh', box: [0.34, 0.55, 0.34], count: 2,
    callSite: 'limb(0.17, 0.55)',
    build: () => limb(0.17, 0.55),
  },
  {
    file: 'PlayerModel.ts', name: 'sock (shin)', box: [0.30, 0.42, 0.32], count: 2,
    callSite: 'limb(0.15, 0.42, 0.32 / 0.30)',
    build: () => limb(0.15, 0.42, 0.32 / 0.30),
  },
  {
    file: 'PlayerModel.ts', name: 'sock band', box: [0.32, 0.10, 0.34], count: 2,
    callSite: 'new THREE.CylinderGeometry(0.16, 0.16, 0.1, LIMB_RADIAL_SEG).scale(1, 1, 0.34 / 0.32)',
    build: () => new THREE.CylinderGeometry(0.16, 0.16, 0.1, LIMB_RADIAL_SEG)
      .scale(1, 1, 0.34 / 0.32),
  },
  {
    file: 'PlayerModel.ts', name: 'boot', box: [0.32, 0.18, 0.46], count: 2,
    callSite: 'shoe(0.32, 0.18, 0.46)',
    build: () => shoe(0.32, 0.18, 0.46),
  },
];

/* ---- RB-2: the officials (RB2-OFFICIALS-ROUNDING.md §1, 15 parts) ---- */
const REFEREE_PARTS: Part[] = [
  {
    file: 'RefereeModel.ts', name: 'torso', box: [0.78, 0.95, 0.44], count: 1,
    callSite: 'barrel(0.39, 0.475, 0.2, TORSO_RADIAL_SEG).scale(1, 1, 0.44 / 0.78)',
    build: () => barrel(0.39, 0.475, 0.2, TORSO_RADIAL_SEG).scale(1, 1, 0.44 / 0.78),
  },
  {
    file: 'RefereeModel.ts', name: 'collar', box: [0.8, 0.12, 0.46], count: 1,
    callSite: 'new THREE.CylinderGeometry(0.4, 0.4, 0.12, TORSO_RADIAL_SEG).scale(1, 1, 0.46 / 0.8)',
    build: () => new THREE.CylinderGeometry(0.4, 0.4, 0.12, TORSO_RADIAL_SEG)
      .scale(1, 1, 0.46 / 0.8),
  },
  {
    file: 'RefereeModel.ts', name: 'arm', box: [0.26, 0.74, 0.26], count: 2,
    callSite: 'limb(0.13, 0.74)',
    build: () => limb(0.13, 0.74),
  },
  {
    file: 'RefereeModel.ts', name: 'leg', box: [0.30, 1.0, 0.32], count: 2,
    callSite: 'limb(0.15, 1.0, 0.32 / 0.30)',
    build: () => limb(0.15, 1.0, 0.32 / 0.30),
  },
  {
    file: 'RefereeModel.ts', name: 'shoe', box: [0.30, 0.15, 0.38], count: 2,
    callSite: 'shoe(0.30, 0.15, 0.38)',
    build: () => shoe(0.30, 0.15, 0.38),
  },
];

const LINESMAN_PARTS: Part[] = [
  {
    file: 'LinesmanModel.ts', name: 'torso', box: [0.72, 0.92, 0.42], count: 1,
    callSite: 'barrel(0.36, 0.46, 0.2, TORSO_RADIAL_SEG).scale(1, 1, 0.42 / 0.72)',
    build: () => barrel(0.36, 0.46, 0.2, TORSO_RADIAL_SEG).scale(1, 1, 0.42 / 0.72),
  },
  {
    file: 'LinesmanModel.ts', name: 'collar', box: [0.74, 0.11, 0.44], count: 1,
    callSite: 'new THREE.CylinderGeometry(0.37, 0.37, 0.11, TORSO_RADIAL_SEG).scale(1, 1, 0.44 / 0.74)',
    build: () => new THREE.CylinderGeometry(0.37, 0.37, 0.11, TORSO_RADIAL_SEG)
      .scale(1, 1, 0.44 / 0.74),
  },
  {
    file: 'LinesmanModel.ts', name: 'arm', box: [0.25, 0.72, 0.25], count: 2,
    callSite: 'limb(0.125, 0.72)',
    build: () => limb(0.125, 0.72),
  },
  {
    file: 'LinesmanModel.ts', name: 'leg', box: [0.28, 1.0, 0.30], count: 2,
    callSite: 'limb(0.14, 1.0, 0.30 / 0.28)',
    build: () => limb(0.14, 1.0, 0.30 / 0.28),
  },
];

const COACH_PARTS: Part[] = [
  {
    file: 'CoachModel.ts', name: 'torso', box: [0.82, 0.95, 0.46], count: 1,
    callSite: 'barrel(0.41, 0.475, 0.2, TORSO_RADIAL_SEG).scale(1, 1, 0.46 / 0.82)',
    build: () => barrel(0.41, 0.475, 0.2, TORSO_RADIAL_SEG).scale(1, 1, 0.46 / 0.82),
  },
  {
    file: 'CoachModel.ts', name: 'scarf band', box: [0.6, 0.16, 0.5], count: 1,
    callSite: 'new THREE.CylinderGeometry(0.3, 0.3, 0.16, TORSO_RADIAL_SEG).scale(1, 1, 0.5 / 0.6)',
    build: () => new THREE.CylinderGeometry(0.3, 0.3, 0.16, TORSO_RADIAL_SEG)
      .scale(1, 1, 0.5 / 0.6),
  },
  {
    // The one part where "round it" would have been wrong: a hanging strip of
    // cloth, flattened to the old 0.06 depth with its ends rounded off.
    file: 'CoachModel.ts', name: 'scarf tail', box: [0.16, 0.5, 0.06], count: 1,
    callSite: 'limb(0.08, 0.5, 0.06 / 0.16)',
    build: () => limb(0.08, 0.5, 0.06 / 0.16),
  },
  {
    file: 'CoachModel.ts', name: 'arm', box: [0.28, 0.78, 0.28], count: 2,
    callSite: 'limb(0.14, 0.78)',
    build: () => limb(0.14, 0.78),
  },
  {
    file: 'CoachModel.ts', name: 'leg', box: [0.32, 1.06, 0.34], count: 2,
    callSite: 'limb(0.16, 1.06, 0.34 / 0.32)',
    build: () => limb(0.16, 1.06, 0.34 / 0.32),
  },
  {
    file: 'CoachModel.ts', name: 'shoe', box: [0.32, 0.16, 0.42], count: 2,
    callSite: 'shoe(0.32, 0.16, 0.42)',
    build: () => shoe(0.32, 0.16, 0.42),
  },
];

const PARTS: Part[] = [...PLAYER_PARTS, ...REFEREE_PARTS, ...LINESMAN_PARTS, ...COACH_PARTS];

const sizeOf = (g: THREE.BufferGeometry): THREE.Vector3 => {
  g.computeBoundingBox();
  const size = new THREE.Vector3();
  g.boundingBox!.getSize(size);
  return size;
};

const occurrences = (haystack: string, needle: string): number =>
  haystack.split(needle).length - 1;

// ===========================================================================
describe('render3d geometry guard — the RB/RB-2 bbox invariant, committed', () => {
  it('the population is the two landing docs\' tables: 8 player + 15 official parts', () => {
    // RB §1: 8 rounded rows (torso, hips, sleeve, forearm, thigh, sock, band, boot).
    expect(PLAYER_PARTS).toHaveLength(8);
    // RB-2 §1 / §3.4: "15 parts, measured" — 5 referee + 4 linesman + 6 coach,
    // counted as ROWS exactly as the doc's tables and its 15 are counted.
    expect(REFEREE_PARTS.length + LINESMAN_PARTS.length + COACH_PARTS.length).toBe(15);
    // …across all four files, none missed.
    expect([...new Set(PARTS.map((p) => p.file))].sort()).toEqual([...FILES].sort());
  });

  it('⭐ TORSO_BASE still IS the player chest box the table was written against', () => {
    // The player torso row reads its box from src, so pin the constant too.
    expect(TORSO_BASE).toEqual({ w: 0.72, h: 0.86, d: 0.54 });
  });

  for (const part of PARTS) {
    it(`⭐ ${part.file} ${part.name} fills its replaced ${part.box.join(' × ')} box (±${TOL})`, () => {
      const size = sizeOf(part.build());
      expect(size.x).toBeCloseTo(part.box[0], 6);
      expect(size.y).toBeCloseTo(part.box[1], 6);
      expect(size.z).toBeCloseTo(part.box[2], 6);
      // …and explicitly against the RB/RB-2 tolerance, so the number is visible
      for (const [i, axis] of ([size.x, size.y, size.z] as const).entries()) {
        expect(Math.abs(axis - part.box[i])).toBeLessThan(TOL);
      }
    });

    it(`${part.file} builds ${part.name} at exactly ONE call site with these arguments`, () => {
      expect(occurrences(SOURCES[part.file], part.callSite)).toBe(1);
    });
  }

  it('⭐⭐ NO `BoxGeometry` anywhere in the anatomy of the four model files', () => {
    // The RB/RB-2 property in one line: "no vertical edge survives anywhere on
    // the man" (RB §1). Flat pieces stay flat BY NAME and are exempt: the
    // referee's card, the linesman's flag cloth, the coach's open-jacket panel
    // and the player's number are `PlaneGeometry`.
    for (const file of FILES) {
      expect(SOURCES[file]).not.toContain('BoxGeometry');
    }
  });

  it('the exempt flat pieces are still PLANES, not rounded by accident', () => {
    expect(occurrences(SOURCES['RefereeModel.ts'], 'new THREE.PlaneGeometry(0.2, 0.28)')).toBe(1);
    expect(occurrences(SOURCES['LinesmanModel.ts'], 'new THREE.PlaneGeometry(0.26, 0.2)')).toBe(1);
    expect(occurrences(SOURCES['CoachModel.ts'], 'new THREE.PlaneGeometry(0.2, 0.7)')).toBe(1);
    expect(occurrences(SOURCES['PlayerModel.ts'], 'new THREE.PlaneGeometry(0.52, 0.58)')).toBe(1);
  });

  it('⭐ the officials use the PLAYER\'s primitives — one species on the pitch', () => {
    // RB-2's whole claim (#312 item 1). If a future edit gives an official its
    // own local lathe, this fails.
    for (const file of ['RefereeModel.ts', 'LinesmanModel.ts', 'CoachModel.ts'] as const) {
      expect(SOURCES[file]).toContain("from './PlayerModel'");
      expect(SOURCES[file]).toMatch(/\bbarrel\b/);
      expect(SOURCES[file]).toMatch(/\blimb\b/);
    }
    expect(SOURCES['PlayerModel.ts']).toContain('export function barrel(');
    expect(SOURCES['PlayerModel.ts']).toContain('export function limb(');
    expect(SOURCES['PlayerModel.ts']).toContain('export function shoe(');
  });

  it('non-circular cross-sections are baked into the GEOMETRY, never onto a mesh', () => {
    // RB-2 §2 item 2. `.scale(1,1,k)` on the GEOMETRY at build time is legal;
    // scaling an anatomy MESH would silently break the F1 shrink anchor's story
    // (`HUMAN_MODEL_SCALE` arrives through the single `bodyScale` group).
    // ⚠ NOT a blanket `.scale.set(` ban: the coach's nameplate SPRITE is scaled,
    // legitimately and unrelatedly — so the ban is scoped to the named parts.
    const ANATOMY = /\b(torso|collar|head|arm[LR]?|leg[LR]?|shoe[LR]?|scarfBand|scarfDrop|armGeo|legGeo|shoeGeo)\.scale\b/;
    for (const file of ['RefereeModel.ts', 'LinesmanModel.ts', 'CoachModel.ts'] as const) {
      expect(SOURCES[file]).not.toMatch(ANATOMY);
    }
  });
});
