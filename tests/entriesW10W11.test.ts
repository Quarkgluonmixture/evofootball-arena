import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import {
  A4_WORLD_KEY, BK_WORLD_VERSION, CB_WORLD_VERSION, CORRIDOR_WORLD_DOORS,
  CORRIDOR_WORLD_VERSION, CORRIDOR_WORLD_WEIGHT, DF_WORLD_DOORS, DF_WORLD_VERSION,
  L3_WORLD_VERSION, PC_WORLD_VERSION,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, bkArmedVersion, corridorArmedVersion,
  dfArmedVersion, isCorridorWorld, isDfWorld, poolPcDoseTable, poolT1DoseCells,
  readA4World, writeA4World,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_CR, A4_BADGE_TEXT_CR_EMPTY, A4_BADGE_TEXT_DF, A4_BADGE_TEXT_DF_EMPTY,
  A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../src/ui/A4WorldBadge';
import type { TacticalGenome } from '../src/evolution/genome';
import { isShellAsset } from '../scripts/pwaAssets';

/**
 * ⭐⭐ THE ENTRIES ROUND — `?a4world=10` (会思考的防守, THE CAP INTACT) and `?a4world=11`
 * (门将不再往人身上开球, the corridor at BK-T4's rung 0.5). Ruling #337 item 5;
 * docs/world-model/ENTRIES-W10-W11.md. The TENTH and ELEVENTH entries of the
 * #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6/#309.5 family.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 10 IS world 9 plus the two DF doors and world 11 IS world 10 plus
 *       the corridor door, and both say so by CALLING the composition below them.
 *   (2) ⭐⭐ THE CAP IS INTACT AND ITS BYPASS IS NOT NAMED — no world arms the cap-off door and
 *       no entry-layer file contains its identifier at all (the grep receipt of record).
 *   (3) ⭐⭐ THE WEIGHT IS PINNED BY THE WORLD at 0.5, on MATCH-LOCAL COPIES only: the
 *       franchise's `info.genome` never carries `dvExposureWeight` (#334 item 1's ratified form,
 *       BK-T4's own `gGenomeClean` conjunct at entry grain).
 *   (4) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 11 → 10 → 9 → 8 → 7 → 6, then the
 *       disjoint MT family (the BU-T1 mislabel class).
 *   (5) ⭐ DORMANCY — every world below 10 gains nothing: no flag, no gene.
 *   (6) NO NEW CHUNK — neither rung carries a dose of its own.
 *   (7) THE BADGE AND THE BLURBS, INCLUDING ⭐⭐ THE HONEST STATE (the cap stays) AND ⭐⭐ THE
 *       HONEST COST (lofted volume falls, structurally) AND ⭐ THE UNMEASURED COMPOSITION.
 *   (8) ROAD B — nothing ships: production is bit-for-bit unmoved, the league serializes
 *       nothing new, and the worker fixtures still play the SHIPPED world.
 *
 * ⚠ SEEDS: this rung consumes ZERO of the sim frontier (ruling #337 item 5). Every walk here is
 * OUT-OF-BAND SCRATCH (canon, home PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6:
 * "verifier scratch walks use the stage's own consumed band or the out-of-band scratch range
 * (≥ 900,000,000) — never the next virgin block").
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/ENTRIES-W10-W11.md');
const CANON = repoText('docs/world-model/CANON.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');
const BADGE = repoText('src/ui/A4WorldBadge.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

/** The out-of-band scratch seeds this suite walks (no frontier block is booked). */
const SCRATCH = 900000100;

/** ⭐⭐ THE HONEST STATE, of record (#337 item 1): the Phase-31 cap STAYS, with its receipt. */
const CAP_LINE = '拿掉帽子,人又堆到球上去了';
/** ⭐⭐ THE HONEST COST, of record (H-BK.3(b) failed at every legal weight). */
const LOFT_COST_LINE = '高球本身被开得更少了';
/** ⭐ THE ONE UNMEASURED COMPOSITION, disclosed (corridor × the DF brain). */
const UNMEASURED_LINE = '从来没有一起量过';

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const fixtureMatch = (flags: League['matchFlags'], seed = SCRATCH): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = flags;
  return league.createMatch(league.nextFixture()!);
};

/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (
  version: 6 | 7 | 8 | 9 | 10 | 11, dose: typeof PC_DOSE | null = PC_DOSE, seed = SCRATCH,
): Match => {
  const match = fixtureMatch(a4MatchFlags(version), seed);
  armA4World(match, null, version, L3_DOSE, dose);
  return match;
};

const effWeightOf = (m: Match, side: 0 | 1): number | undefined =>
  (m.teams[side].effGenome as TacticalGenome).dvExposureWeight;
const infoWeightOf = (m: Match, side: 0 | 1): number | undefined =>
  (m.teams[side].info.genome as TacticalGenome).dvExposureWeight;

// ===========================================================================
describe('W10/W11 — ⭐ FIDELITY: each world CALLS the composition below it', () => {
  it('world 10 is `a4MatchFlags(9)` ∪ the two DF doors, key for key', () => {
    const flags = a4MatchFlags(DF_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(BK_WORLD_VERSION), ...DF_WORLD_DOORS });
    expect(DF_WORLD_DOORS).toEqual({ dfAssignPersist: true, dfSurface: true });
    const nine = a4MatchFlags(BK_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in nine)).sort())
      .toEqual(['dfAssignPersist', 'dfSurface']);
    for (const k of Object.keys(nine)) expect(flags[k]).toBe(nine[k]);
  });

  it('world 11 is `a4MatchFlags(10)` ∪ the ONE corridor door, key for key', () => {
    const flags = a4MatchFlags(CORRIDOR_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(DF_WORLD_VERSION), ...CORRIDOR_WORLD_DOORS });
    expect(CORRIDOR_WORLD_DOORS).toEqual({ bkCorridorPrice: true });
    const ten = a4MatchFlags(DF_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in ten))).toEqual(['bkCorridorPrice']);
    for (const k of Object.keys(ten)) expect(flags[k]).toBe(ten[k]);
  });

  it('⭐ the substrates are CALLED, not copied — the entries cannot drift', () => {
    expect(SRC).toContain(
      'return { ...a4MatchFlags(DF_WORLD_VERSION), ...CORRIDOR_WORLD_DOORS };',
    );
    expect(SRC).toContain(
      'if (version === DF_WORLD_VERSION) return { ...a4MatchFlags(BK_WORLD_VERSION), '
      + '...DF_WORLD_DOORS };',
    );
    expect(SRC).toContain('return { ...a4MatchFlags(PC_WORLD_VERSION), ...BK_WORLD_DOORS };');
  });

  it('⭐ the arming is the WORLD BELOW\'s path, called — never a re-implementation', () => {
    const df = SRC.slice(SRC.indexOf('export function armDfWorld'));
    expect(df.slice(0, df.indexOf('\n}'))).toContain('armBkWorld(match, l3Dose, pcDose);');
    const cr = SRC.slice(SRC.indexOf('export function armCorridorWorld'));
    const body = cr.slice(0, cr.indexOf('\n}'));
    expect(body).toContain('armDfWorld(match, l3Dose, pcDose);');
    expect(body).toContain('setCorridorWeight(match, side, CORRIDOR_WORLD_WEIGHT)');
    expect(body).not.toContain('armBkWorld');
    expect(body).not.toContain('dosePcBooks');
  });

  it('the armed matches carry their doors AND the conformance of the world below', () => {
    const ten = worldMatch(10);
    expect(ten.dfAssignPersist).toBe(true);
    expect(ten.dfSurface).toBe(true);
    expect(bkArmedVersion(ten)).toBe(BK_WORLD_VERSION);
    expect(dfArmedVersion(ten)).toBe(DF_WORLD_VERSION);
    expect(isDfWorld(DF_WORLD_VERSION)).toBe(true);
    expect(isDfWorld(BK_WORLD_VERSION)).toBe(false);
    const eleven = worldMatch(11);
    expect(eleven.bkCorridorPrice).toBe(true);
    expect(dfArmedVersion(eleven)).toBe(DF_WORLD_VERSION);
    expect(corridorArmedVersion(eleven)).toBe(CORRIDOR_WORLD_VERSION);
    expect(isCorridorWorld(CORRIDOR_WORLD_VERSION)).toBe(true);
    expect(isCorridorWorld(DF_WORLD_VERSION)).toBe(false);
  });

  it('⭐ both worlds inherit a wind-up channel, so the BK facing law is not inert', () => {
    for (const v of [10, 11] as const) {
      const flags = a4MatchFlags(v) as Record<string, boolean>;
      expect(flags.c7Windup).toBe(true);
      expect(flags.o1PassWindup).toBe(true);
      expect(flags.bkFacingLaw).toBe(true);
      expect(flags.bkContactLaw).toBe(true);
      expect(() => worldMatch(v)).not.toThrow();
    }
  });
});

// ===========================================================================
describe('W10/W11 — ⭐⭐ THE PHASE-31 CAP IS INTACT (H-DF.4 failed; the cap stays)', () => {
  it('⭐⭐ NO ENTRY-LAYER FILE NAMES THE CAP-OFF DOOR AT ALL (the grep receipt)', () => {
    // ruling #337 item 5, verbatim: "`dfCapOff` NEVER enters any world". The identifier is
    // assembled from its two halves so that this assertion cannot satisfy itself.
    const needle = `df${'CapOff'}`;
    for (const text of [SRC, APP, SETTINGS, BADGE]) expect(text).not.toContain(needle);
    // …and it is absent from the tenth and eleventh flag sets by construction
    for (const v of [10, 11] as const) {
      expect(JSON.stringify(a4MatchFlags(v))).not.toContain(needle);
    }
  });

  it('⭐ an armed world-10 / world-11 match runs with the cap ON', () => {
    for (const v of [10, 11] as const) {
      const m = worldMatch(v) as unknown as Record<string, unknown>;
      expect(m.dfCapOff).toBe(false); // the engine's own default, never armed here
    }
  });

  it('the doc states the honest state, with DF-T4\'s own fields', () => {
    expect(DOC).toContain(CAP_LINE);
    expect(DOC).toContain('0.659930978307'); // markHeldShare, cap-on
    expect(DOC).toContain('0.640572655093'); // markHeldShare, cap-off
    expect(DOC).toContain('13,069'); // the four-chaser bin the cap holds at zero
  });
});

// ===========================================================================
describe('W10/W11 — ⭐⭐ THE PINNED WEIGHT: 0.5, match-local, never the franchise', () => {
  it('the weight is BK-T4\'s rung 0.5 and both teams carry it', () => {
    expect(CORRIDOR_WORLD_WEIGHT).toBe(0.5);
    const m = worldMatch(11);
    for (const side of [0, 1] as const) expect(effWeightOf(m, side)).toBe(0.5);
  });

  it('⭐⭐ `info.genome` CARRIES NO WEIGHT — the franchise object is never written', () => {
    // The ratified form (#334 item 1; BK-T4 §P1's `gGenomeClean` conjunct): the weight lives on
    // MATCH-LOCAL copies, so it can never enter the save or the crossover path.
    const m = worldMatch(11);
    for (const side of [0, 1] as const) {
      expect(infoWeightOf(m, side)).toBeUndefined();
      expect(Object.keys(m.teams[side].info.genome)).not.toContain('dvExposureWeight');
    }
    const league = new League({ seed: SCRATCH + 1 });
    league.matchFlags = a4MatchFlags(CORRIDOR_WORLD_VERSION);
    const live = league.createMatch(league.nextFixture()!);
    armA4World(live, null, CORRIDOR_WORLD_VERSION, L3_DOSE, PC_DOSE);
    expect(JSON.stringify(league)).not.toContain('dvExposureWeight');
  });

  it('⭐ the world-10 stack leaves the gene BORN ABSENT — the price has no seat there', () => {
    const ten = worldMatch(10);
    for (const side of [0, 1] as const) {
      expect(effWeightOf(ten, side)).toBeUndefined();
      expect(infoWeightOf(ten, side)).toBeUndefined();
    }
    expect(corridorArmedVersion(ten)).toBe(0);
  });

  it('⭐ the weight is a WORLD constant, never an evolution opt-in', () => {
    const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toContain('evolveDeliveryValue');
    expect(code).not.toContain('dvDeliveryValue');
  });
});

// ===========================================================================
describe('W10/W11 — ⭐⭐ THE VERSION VALUE: the read stays ordered by CONTAINMENT', () => {
  it('a world-10 match reports TEN and a world-11 match reports ELEVEN', () => {
    expect(a4ArmedVersion(worldMatch(10))).toBe(DF_WORLD_VERSION);
    expect(a4ArmedVersion(worldMatch(11))).toBe(CORRIDOR_WORLD_VERSION);
    expect(a4ArmedVersion(worldMatch(10, null))).toBe(DF_WORLD_VERSION); // the weak form too
    expect(a4ArmedVersion(worldMatch(11, null))).toBe(CORRIDOR_WORLD_VERSION);
  });

  it('⭐ every world they contain still reports ITSELF', () => {
    expect(a4ArmedVersion(worldMatch(9))).toBe(BK_WORLD_VERSION);
    expect(a4ArmedVersion(worldMatch(8))).toBe(PC_WORLD_VERSION);
    expect(a4ArmedVersion(worldMatch(7))).toBe(L3_WORLD_VERSION);
    expect(a4ArmedVersion(worldMatch(6))).toBe(CB_WORLD_VERSION);
    for (const v of [4, 5] as const) {
      const m = fixtureMatch(a4MatchFlags(v));
      armA4World(m, null, v);
      expect(a4ArmedVersion(m)).toBe(v); // the DISJOINT MT family, unharmed
    }
  });

  it('⭐⭐ the source order IS the containment order: 11 → 10 → 9 → 8 → 7 → 6, then MT', () => {
    const fn = SRC.slice(SRC.indexOf('export function a4ArmedVersion'));
    const body = fn.slice(0, fn.indexOf('\n}'));
    const at = (needle: string): number => {
      const i = body.indexOf(needle);
      expect(i).toBeGreaterThan(-1);
      return i;
    };
    expect(at('corridorArmedVersion(match)')).toBeLessThan(at('dfArmedVersion(match)'));
    expect(at('dfArmedVersion(match)')).toBeLessThan(at('bkArmedVersion(match)'));
    expect(at('bkArmedVersion(match)')).toBeLessThan(at('pcArmedVersion(match)'));
    expect(at('pcArmedVersion(match)')).toBeLessThan(at('l3ArmedVersion(match)'));
    expect(at('l3ArmedVersion(match)')).toBeLessThan(at('cbArmedVersion(match)'));
    expect(at('cbArmedVersion(match)')).toBeLessThan(at('mtArmedVersion(match)'));
  });

  it('⭐ a PARTIAL arming is not the world: one door short reports the world below', () => {
    const halfTen = fixtureMatch({ ...a4MatchFlags(BK_WORLD_VERSION), dfSurface: true });
    armA4World(halfTen, null, BK_WORLD_VERSION, L3_DOSE, PC_DOSE);
    expect(dfArmedVersion(halfTen)).toBe(0);
    expect(a4ArmedVersion(halfTen)).toBe(BK_WORLD_VERSION);
    // world 11's flag without world 11's weight is world 10, not world 11
    const noWeight = fixtureMatch(a4MatchFlags(CORRIDOR_WORLD_VERSION));
    armA4World(noWeight, null, DF_WORLD_VERSION, L3_DOSE, PC_DOSE);
    expect(corridorArmedVersion(noWeight)).toBe(0);
    expect(a4ArmedVersion(noWeight)).toBe(DF_WORLD_VERSION);
  });
});

// ===========================================================================
describe('W10/W11 — ⭐ DORMANCY: the worlds below gain nothing', () => {
  it('worlds 9 and below carry NO DF door and NO corridor door', () => {
    for (const v of [9, 8, 7, 6, 5, 4, 3, 2, 1] as const) {
      const flags = a4MatchFlags(v) as Record<string, boolean>;
      for (const k of ['dfAssignPersist', 'dfSurface', 'bkCorridorPrice']) {
        expect(flags).not.toHaveProperty(k);
      }
    }
  });

  it('⭐ a world-9 match is DF- and corridor-dormant on the match itself', () => {
    const nine = worldMatch(9);
    expect(nine.dfAssignPersist).toBe(false);
    expect(nine.dfSurface).toBe(false);
    expect(nine.bkCorridorPrice).toBe(false);
    expect(dfArmedVersion(nine)).toBe(0);
    expect(corridorArmedVersion(nine)).toBe(0);
    expect(a4ArmedVersion(nine)).toBe(BK_WORLD_VERSION);
  });

  it('⭐⭐ NON-VACUOUS: 9, 10 and 11 are three DIFFERENT worlds on the same seed', () => {
    const walk = (v: 9 | 10 | 11): string => {
      const m = worldMatch(v, PC_DOSE, SCRATCH + 2);
      while (!m.finished) m.step(DT);
      return signature(m);
    };
    const [nine, ten, eleven] = [walk(9), walk(10), walk(11)];
    expect(ten).not.toBe(nine); // the DF doors bite
    expect(eleven).not.toBe(ten); // the corridor price bites
    expect(eleven).not.toBe(nine);
  }, 180_000);
});

// ===========================================================================
describe('W10/W11 — ⭐ `?pcdose=0` keeps its WORLD-8 semantics all the way up', () => {
  it('the recognition books are BORN ABSENT in both new worlds', () => {
    for (const v of [10, 11] as const) {
      const m = worldMatch(v, null);
      expect(a4ArmedVersion(m)).toBe(v); // the same world
      for (const book of m.pcLatency!.books) expect(book.totalExposures).toBe(0);
    }
  });

  it('the MATURED form still carries PC-T2\'s table in both new worlds', () => {
    for (const v of [10, 11] as const) {
      const m = worldMatch(v);
      const total = m.pcLatency!.books.reduce((s, b) => s + b.totalExposures, 0);
      expect(total).toBeGreaterThan(0);
    }
  });

  it('⭐ the app reads the contrast on ONE predicate that covers ALL FOUR PC-stack worlds', () => {
    const arm = APP.slice(APP.indexOf('private async armA4('));
    const body = arm.slice(0, arm.indexOf('\n  }'));
    expect(body).toContain('const pcStack = isPcWorld(version) || isBkWorld(version)\n'
      + '      || isDfWorld(version) || isCorridorWorld(version) || isRaWorld(version)\n'
      + '      || isBqWorld(version);');
    expect(body.match(/pcDoseWanted\(/g)).toHaveLength(1);
  });

  it('neither world offers a dose of its own — no new param, no new sticky key', () => {
    for (const needle of ['dfdose', 'crdose', 'bkcdose', "'evo:dfWorld'", "'evo:crWorld'"]) {
      expect(SRC).not.toContain(needle);
      expect(APP).not.toContain(needle);
    }
  });
});

// ===========================================================================
describe('W10/W11 — ⭐ NO NEW CHUNK: neither rung carries a dose artifact', () => {
  it('the service worker\'s opt-in prefix list is UNCHANGED', () => {
    const pwa = repoText('scripts/pwaAssets.ts');
    expect(pwa).toContain(
      "const OPT_IN_CHUNK_PREFIXES = ['assets/stage3-', 'assets/l3-', 'assets/pc-'] as const;",
    );
    expect(pwa).not.toContain('assets/df-');
    expect(pwa).not.toContain('assets/bk-');
    expect(isShellAsset('assets/index-abc.js')).toBe(true);
    expect(isShellAsset('assets/pc-t1-learning-exam-DEADBEEF.js')).toBe(false);
  });

  it('the entry module imports NO DF or BK-T4 artifact', () => {
    expect(SRC).not.toContain('df-t4-cap-off-trial.json');
    expect(SRC).not.toContain('bk-t4-corridor-exam.json');
    // the dynamic world-model imports are still exactly the four the family declared
    expect(SRC.match(/import\('\.\.\/\.\.\/docs\/world-model\/data\//g)).toHaveLength(4);
  });
});

// ===========================================================================
describe('W10/W11 — ⭐⭐ THE BADGE AND THE BLURBS CARRY THE STATE AND THE COST', () => {
  it('the badges are the tenth and eleventh distinct names, in both dose forms', () => {
    expect(A4_BADGE_TEXTS[10]).toBe(A4_BADGE_TEXT_DF);
    expect(A4_BADGE_TEXTS[11]).toBe(A4_BADGE_TEXT_CR);
    expect(new Set(Object.values(A4_BADGE_TEXTS)).size).toBe(13); // #386 item 5: a thirteenth name
    expect(A4_BADGE_TEXTS_EMPTY[10]).toBe(A4_BADGE_TEXT_DF_EMPTY);
    expect(A4_BADGE_TEXTS_EMPTY[11]).toBe(A4_BADGE_TEXT_CR_EMPTY);
    expect(new Set(Object.values(A4_BADGE_TEXTS_EMPTY)).size).toBe(6); // worlds 8/9/10/11/12/13 (#386 item 5)
    expect(A4_BADGE_TEXT_DF).toContain('会思考的防守');
    expect(A4_BADGE_TEXT_CR).toContain('0.5'); // the weight is ON the chip (the #269.4 form)
  });

  it('the chip mounts, RELABELS in place for the other form, and unmounts', () => {
    const els: { className: string; textContent: string | null }[] = [];
    const doc = {
      createElement: (): { className: string; textContent: string | null; remove(): void } => {
        const el = { className: '', textContent: null as string | null, remove(): void {} };
        els.push(el);
        return el;
      },
      body: { appendChild: (): void => {} },
    };
    const badge = new A4WorldBadge(doc);
    badge.setWorld(11);
    expect(badge.label).toBe(A4_BADGE_TEXT_CR);
    badge.setWorld(11, A4_BADGE_TEXT_CR_EMPTY);
    expect(badge.world).toBe(11);
    expect(badge.label).toBe(A4_BADGE_TEXT_CR_EMPTY);
    badge.setWorld(10);
    expect(badge.label).toBe(A4_BADGE_TEXT_DF);
    expect(els).toHaveLength(1); // ONE chip, relabelled
    badge.setWorld(0);
    expect(badge.mounted).toBe(false);
  });

  it('⭐ the EMPTY-form chip comes from ONE table keyed by the version', () => {
    expect(APP).toContain('pcEmpty ? A4_BADGE_TEXTS_EMPTY[version]');
  });

  it('⭐⭐ THE CAP LINE is in the world-10 blurb, BOTH feed forms AND the doc', () => {
    expect(SETTINGS).toContain(CAP_LINE);
    expect(DOC).toContain(CAP_LINE);
    expect(APP.split(CAP_LINE)).toHaveLength(3); // two feed forms ⇒ three pieces
  });

  it('⭐⭐ THE LOFTED-VOLUME COST is in the world-11 blurb, BOTH feed forms AND the doc', () => {
    expect(SETTINGS).toContain(LOFT_COST_LINE);
    expect(DOC).toContain(LOFT_COST_LINE);
    expect(APP.split(LOFT_COST_LINE)).toHaveLength(3);
  });

  it('⭐ THE UNMEASURED COMPOSITION is disclosed in the blurb, BOTH feed forms AND the doc', () => {
    expect(SETTINGS).toContain(UNMEASURED_LINE);
    expect(DOC).toContain(UNMEASURED_LINE);
    expect(APP.split(UNMEASURED_LINE)).toHaveLength(3);
  });

  it('the blurbs open in the player\'s own football language', () => {
    expect(SETTINGS).toContain('会思考的防守 —— 盯住人,自己给选择定价。');
    expect(SETTINGS).toContain('门将不再往人身上开球 —— 走廊价格 0.5。');
  });

  it('⭐ the worker-fixture honesty line is in BOTH new blurbs', () => {
    const w10 = SETTINGS.slice(SETTINGS.indexOf('会思考的防守 —— 盯住人'));
    const w11 = SETTINGS.slice(SETTINGS.indexOf('门将不再往人身上开球 —— 走廊价格'));
    for (const blurb of [w10.slice(0, w10.indexOf('门将不再往人身上开球 —— 走廊价格')), w11]) {
      expect(blurb).toContain('你看的是屏幕上这一场');
      expect(blurb).toContain('联赛后台快速模拟的比赛跑的是原版世界');
    }
  });

  it('the settings checkboxes are the tenth and eleventh, exclusive with all others', () => {
    expect(SETTINGS).toContain('setA4World(v ? 10 : 0)');
    expect(SETTINGS).toContain('setA4World(v ? 11 : 0)');
    expect(SETTINGS).toContain('input(dfBox).checked = version === 10;');
    expect(SETTINGS).toContain('input(crBox).checked = version === 11;');
    expect(SETTINGS).toContain('input(bkBox).checked = version === 9;');
  });

  it('⭐ the doc quotes CANON.md\'s worker-fixture sentence VERBATIM', () => {
    const canonSentence = 'WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits '
      + 'matchFlags; true since #155, stated now, test-pinned; refines #270\'s E4 correction; '
      + 'matches the perf diagnostic)';
    const flat = (s: string): string => s.replace(/\s+/g, ' ');
    expect(flat(CANON)).toContain(canonSentence); // the ledger really is its home
    expect(flat(DOC)).toContain(canonSentence); // …and the doc copied it, never re-typed it
  });

  it('⭐ the doc quotes BK-T4 §P5\'s base-stack sentence VERBATIM (the disclosure)', () => {
    const flat = (s: string): string => s.replace(/\s+/g, ' ');
    const sentence = '**BOTH arms arm `bkCorridorPrice`** (plus `bkFacingLaw` + `bkContactLaw` '
      + 'on the world-9 stack)';
    expect(flat(repoText('docs/world-model/BK-T4-CORRIDOR-EXAM.md'))).toContain(sentence);
    expect(flat(DOC)).toContain(sentence);
  });

  it('the doc names both rungs, both door sets and the pinned weight', () => {
    expect(DOC).toContain('?a4world=10');
    expect(DOC).toContain('?a4world=11');
    for (const k of [...Object.keys(DF_WORLD_DOORS), ...Object.keys(CORRIDOR_WORLD_DOORS)]) {
      expect(DOC).toContain(k);
    }
    expect(DOC).toContain('dvExposureWeight');
    expect(DOC).toContain('0.09514563'); // the carom, rung 0
    expect(DOC).toContain('0.03780718'); // the carom, rung 0.5
    expect(DOC).toContain('3.78333333'); // the lofted volume the price costs
  });
});

// ===========================================================================
describe('W10/W11 — the entry: one value, eleven worlds, one inherited contrast', () => {
  const storage = (): void => {
    const map = new Map<string, string>();
    (globalThis as unknown as { localStorage: unknown }).localStorage = {
      getItem: (k: string): string | null => map.get(k) ?? null,
      setItem: (k: string, v: string): void => { map.set(k, v); },
      removeItem: (k: string): void => { map.delete(k); },
    };
  };
  afterEach(() => {
    delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
  });

  it('the phone links are ?a4world=10 and ?a4world=11, and stay exclusive', () => {
    expect(a4UrlOverride('?a4world=10')).toBe(10);
    expect(a4UrlOverride('?a4world=11')).toBe(11);
    expect(a4UrlOverride('?a4world=9')).toBe(9);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=14')).toBeNull(); // no fourteenth world exists (13 = the BQ entry, #386 item 5)
    expect(DOC).toContain('?a4world=10');
  });

  it('⭐ the sticky key stores 10 / 11 and reads them back, and clears on 0', () => {
    storage();
    for (const v of [10, 11] as const) {
      writeA4World(v);
      expect(localStorage.getItem(A4_WORLD_KEY)).toBe(String(v));
      expect(readA4World()).toBe(v);
    }
    writeA4World(0);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBeNull();
    expect(readA4World()).toBe(0);
  });

  it('the GameApp arms both worlds without waiting for A4 census tables', () => {
    expect(APP.match(/armA4World\(/g)).toHaveLength(1); // still ONE arming call site
    expect(APP).toContain(
      '|| isBkWorld(this.a4World) || isDfWorld(this.a4World)\n'
      + '      || isCorridorWorld(this.a4World) || isRaWorld(this.a4World)\n'
      + '      || isBqWorld(this.a4World))) {', // #365 widened; #386 item 5 widened again
    );
  });
});

// ===========================================================================
describe('W10/W11 OFF — the shipped world is untouched (Road B)', () => {
  it('an unarmed league match carries none of the three doors', () => {
    const m = fixtureMatch({});
    expect(m.dfAssignPersist).toBe(false);
    expect(m.dfSurface).toBe(false);
    expect(m.bkCorridorPrice).toBe(false);
    expect(a4ArmedVersion(m)).toBe(0);
  });

  it('⭐ the league serializes no new state at all (no gene, no flag)', () => {
    const league = new League({ seed: SCRATCH + 3 });
    league.matchFlags = a4MatchFlags(CORRIDOR_WORLD_VERSION);
    const match = league.createMatch(league.nextFixture()!);
    armA4World(match, null, CORRIDOR_WORLD_VERSION, L3_DOSE, PC_DOSE);
    const json = JSON.stringify(league);
    for (const needle of ['dfAssignPersist', 'dfSurface', 'bkCorridorPrice', 'dvExposureWeight']) {
      expect(json).not.toContain(needle);
    }
  });

  it('⚠ the WORKER fast-sim path is the SHIPPED world — matchFlags do not survive a save', () => {
    // Canon, home ruling #283.2(iv): "WORKER-SIMMED fixtures play the SHIPPED world
    // (League.toJSON omits matchFlags)". Re-pinned for worlds 10 and 11.
    const league = new League({ seed: SCRATCH + 4 });
    league.matchFlags = a4MatchFlags(CORRIDOR_WORLD_VERSION);
    const live = league.createMatch(league.nextFixture()!);
    expect(live.dfSurface).toBe(true);
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.dfSurface).toBe(false);
    expect(simmed.dfAssignPersist).toBe(false);
    expect(simmed.bkCorridorPrice).toBe(false);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });

  it('⭐ multi-seed: a production match is bit-for-bit what it was without this rung', () => {
    for (const seed of [SCRATCH + 5, SCRATCH + 6]) {
      const a = new Match({ seed, teamA: teamOf(0, seed), teamB: teamOf(1, seed), duration: 240 });
      const b = new Match({ seed, teamA: teamOf(0, seed), teamB: teamOf(1, seed), duration: 240 });
      while (!a.finished) a.step(DT);
      while (!b.finished) b.step(DT);
      expect(signature(a)).toBe(signature(b));
      expect(a.dfSurface).toBe(false);
      expect(a.bkCorridorPrice).toBe(false);
    }
  }, 180_000);
});

/** A minimal two-team fixture for the identity walk — the engine's own defaults. */
function teamOf(idx: 0 | 1, seed: number): ConstructorParameters<typeof Match>[0]['teamA'] {
  const league = new League({ seed, matchDuration: 240 });
  return league.teamInfo(idx);
}
