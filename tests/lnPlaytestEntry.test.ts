import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import type { Match } from '../src/sim/Match';
import {
  BQ_WORLD_VERSION, LN_WORLD_DOORS, LN_WORLD_VERSION, LN_WORLD_WEIGHT, RA_WORLD_LEAD,
  RA_WORLD_VERSION, RA_WORLD_WEIGHT,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, bqArmedVersion, corridorArmedVersion,
  isBqWorld, isLnWorld, isRaWorld, lnArmedVersion, poolPcDoseTable, poolT1DoseCells,
  raArmedVersion,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_LN, A4_BADGE_TEXT_LN_EMPTY, A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../src/ui/A4WorldBadge';
import { lnOwnLaneWeightOf, type TacticalGenome } from '../src/evolution/genome';

/**
 * ⭐⭐ THE LN ENTRY — `?a4world=14` (看见自己人, the ONE own-lane door at LN-T1′b's W025
 * construction). Ruling #396 item 4; docs/world-model/LN-ENTRY-RUNG.md. The FOURTEENTH entry
 * of the #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6/#309.5/#337.5/#365/#386 family.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 14 IS world 13 plus EXACTLY the ONE door `lnOwnLanePrice` and the
 *       ONE pin `lnOwnLaneWeight` = 0.25 on `baseGenome` + `effGenome` of both sides, and it
 *       says so by CALLING the world-13 composition; `info.genome` is NEVER touched (canon
 *       dose placement); ⛔ NOTHING ELSE rides along; and the EXAM'S OWN W025 CONSTRUCTION is
 *       REPRODUCED byte for byte by the entry's arming.
 *   (2) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 14 → 13 → 12 → 11 (the BU-T1 mislabel
 *       class): a world-14 match names itself 14 and NEVER 13; a world-13 match never reads 14.
 *   (3) ⭐ THE URL parses 14 and the bound moves to 15; the badge carries 14 in BOTH dose forms.
 *   (4) ⭐⭐ THE HONEST BRIEF — the blurbs carry the LN-T1′b field values as 6-dp strings, each
 *       in the surface that claims it, and the empty-book vs mature ATTRIBUTION is pinned (the
 *       played form's receipt appears only with its `w = 0.5` label).
 *   (5) ⭐⭐ IDENTITY BELOW 14 — pooled whole-match digests for the bare world, world 12 and
 *       world 13 equal the digests RECORDED at the dispatch HEAD `7fe1d41` (clean worktree),
 *       and the production fingerprint literal is unchanged.
 *   (6) DORMANCY — worlds 1–13 carry no `lnOwnLanePrice` and no `lnOwnLaneWeight`; a plain
 *       League match reads as no world; `League.toJSON` omits matchFlags.
 *   (7) ⭐⭐ THE MUTANT WALK — four mutants, each killed at runtime.
 *
 * ⚠ SEEDS: OUT-OF-BAND SCRATCH ONLY — 900,004,400–499 (#396 item 4); zero frontier
 * consumption, ZERO sims of record.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/LN-ENTRY-RUNG.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

const SCRATCH = 900_004_430;

/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (version: 12 | 13 | 14, dosed = true, seed = SCRATCH): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = a4MatchFlags(version);
  const match = league.createMatch(league.nextFixture()!);
  armA4World(match, null, version, dosed ? L3_DOSE : null, dosed ? PC_DOSE : null);
  return match;
};

const genomeOf = (m: Match, side: 0 | 1, view: 'base' | 'eff' | 'info'): TacticalGenome =>
  (view === 'base' ? m.teams[side].baseGenome
    : view === 'eff' ? m.teams[side].effGenome
      : m.teams[side].info.genome) as TacticalGenome;

describe('W14 — ⭐ FIDELITY: the world IS the exam\'s W025 composition, ONE door and ONE pin', () => {
  it('world 14 is `a4MatchFlags(13)` ∪ { lnOwnLanePrice }, key for key', () => {
    expect(LN_WORLD_VERSION).toBe(14);
    expect(LN_WORLD_WEIGHT).toBe(0.25);
    const flags = a4MatchFlags(LN_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(BQ_WORLD_VERSION), ...LN_WORLD_DOORS });
    expect(LN_WORLD_DOORS).toEqual({ lnOwnLanePrice: true });
    const thirteen = a4MatchFlags(BQ_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in thirteen)).sort()).toEqual(['lnOwnLanePrice']);
    for (const k of Object.keys(thirteen)) expect(flags[k]).toBe(thirteen[k]);
  });

  it('⛔ NOTHING ELSE RIDES ALONG (#396 item 4(i)): no OBM, no CTB, no RC, no BF, no EDS', () => {
    const KEYS = ['obmMovement', 'ctbSupportPlane', 'rcAnticipate', 'rcReady', 'bfFacingCost',
      'edsTouchCost'] as const;
    for (const v of [6, 7, 8, 9, 10, 11, 12, 13, 14] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      for (const k of KEYS) expect(flags[k]).toBeFalsy();
    }
    const m = worldMatch(14) as unknown as Record<string, unknown>;
    for (const k of KEYS) expect(m[k]).toBeFalsy();
  });

  it('⭐⭐ the composition is CALLED, not copied; the arming IS world 13\'s, called', () => {
    expect(SRC).toContain('return { ...a4MatchFlags(BQ_WORLD_VERSION), ...LN_WORLD_DOORS };');
    expect(SRC).toContain('  armBqWorld(match, l3Dose, pcDose);\n  for (const side of [0, 1] as const) setLnGene(match, side);');
    const m = worldMatch(14);
    expect(m.lnOwnLanePrice).toBe(true);
    expect(m.bqCushion).toBe(true);
    for (const side of [0, 1] as const) {
      // ⭐ the ONE pin, on BOTH dosed views — and NEVER on the franchise's own genome
      expect(genomeOf(m, side, 'eff').lnOwnLaneWeight).toBe(LN_WORLD_WEIGHT);
      expect(genomeOf(m, side, 'base').lnOwnLaneWeight).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(0.25);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(0.25);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'info'))).toBe(0);
      // …and world 12's two pins and world 11's weight ride in from the call
      expect(genomeOf(m, side, 'eff').passLeadSupport).toBe(RA_WORLD_LEAD);
      expect(genomeOf(m, side, 'eff').raAccessWeight).toBe(RA_WORLD_WEIGHT);
    }
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(m)).toBe(BQ_WORLD_VERSION);
  });

  it('⭐ the gene survives to FULL TIME on both dosed views, and `info.genome` stays clean', () => {
    const m = worldMatch(14, true, 900_004_431);
    m.runToCompletion();
    for (const side of [0, 1] as const) {
      expect(genomeOf(m, side, 'eff').lnOwnLaneWeight).toBe(LN_WORLD_WEIGHT);
      expect(genomeOf(m, side, 'base').lnOwnLaneWeight).toBe(LN_WORLD_WEIGHT);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
  }, 120_000);
});

/* ========================================================================== */
/* ⭐⭐⭐ THE EXAM'S OWN CONSTRUCTION, REPRODUCED BY THE ENTRY'S ARMING          */
/* ========================================================================== */

/**
 * LN-T1′b's `setLnWeight`, character for character (`scripts/probes/ln-t1pb-own-lane-exam.ts`):
 * the gene on `baseGenome` and `effGenome` as COPIES, never on `info.genome`.
 */
const examSetLnWeight = (m: Match, weight: number): void => {
  for (const team of m.teams) {
    const view = { ...team.baseGenome, lnOwnLaneWeight: weight } as TacticalGenome;
    team.baseGenome = view;
    team.effGenome = view;
  }
};

/** THE WHOLE-MATCH SIGNATURE, field for field the `bqPlaytestEntry.test.ts` helper (rng included). */
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

/** THE EXAM'S WAY: world 13's flags + the flag + `armA4World(m, null, 13)` + the gene, E13 (no doses). */
const examWay = (seed: number): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = { ...a4MatchFlags(BQ_WORLD_VERSION), lnOwnLanePrice: true };
  const m = league.createMatch(league.nextFixture()!);
  armA4World(m, null, BQ_WORLD_VERSION);
  examSetLnWeight(m, 0.25);
  return m;
};

/** THE ENTRY'S WAY: `a4MatchFlags(14)` + `armA4World(m, null, 14)`, E13 (no doses). */
const entryWay = (seed: number): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = a4MatchFlags(LN_WORLD_VERSION);
  const m = league.createMatch(league.nextFixture()!);
  armA4World(m, null, LN_WORLD_VERSION);
  return m;
};

const CONSTRUCTION_SEEDS = [900_004_420, 900_004_421, 900_004_422, 900_004_423, 900_004_424,
  900_004_425] as const;

describe('W14 — ⭐⭐⭐ THE EXAM\'S W025 CONSTRUCTION IS THE ENTRY\'S ARMING', () => {
  it('the two constructions are IDENTICAL at construction AND at full time, on 6 scratch seeds', () => {
    for (const seed of CONSTRUCTION_SEEDS) {
      const a = examWay(seed);
      const b = entryWay(seed);
      expect(signature(b)).toBe(signature(a));
      // …the flags themselves, key for key
      expect({ ...a4MatchFlags(BQ_WORLD_VERSION), lnOwnLanePrice: true })
        .toEqual(a4MatchFlags(LN_WORLD_VERSION));
      a.runToCompletion();
      b.runToCompletion();
      expect(signature(b)).toBe(signature(a));
      expect(lnArmedVersion(b)).toBe(LN_WORLD_VERSION);
      expect(lnArmedVersion(a)).toBe(LN_WORLD_VERSION);
    }
  }, 600_000);
});

describe('W14 — ⭐⭐ CONTAINMENT, the URL bound and the badge', () => {
  it('⭐⭐ the version value is containment-ordered: 14 names itself 14; 13 stays 13', () => {
    const fourteen = worldMatch(14);
    expect(lnArmedVersion(fourteen)).toBe(LN_WORLD_VERSION);
    expect(a4ArmedVersion(fourteen)).toBe(LN_WORLD_VERSION); // ⛔ never 13
    // …and the worlds it contains still read as themselves underneath
    expect(bqArmedVersion(fourteen)).toBe(BQ_WORLD_VERSION);
    expect(raArmedVersion(fourteen)).toBe(RA_WORLD_VERSION);
    expect(corridorArmedVersion(fourteen)).toBe(11);
    const thirteen = worldMatch(13);
    expect(lnArmedVersion(thirteen)).toBe(0);
    expect(a4ArmedVersion(thirteen)).toBe(BQ_WORLD_VERSION); // ⛔ never 14
    const twelve = worldMatch(12);
    expect(lnArmedVersion(twelve)).toBe(0);
    expect(a4ArmedVersion(twelve)).toBe(RA_WORLD_VERSION);
    // the EMPTY-BOOK form is the same world 14
    expect(a4ArmedVersion(worldMatch(14, false))).toBe(LN_WORLD_VERSION);
    // the SOURCE ORDER itself: 14 is asked before 13
    expect(SRC.indexOf('const raw14 = lnArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw13 = bqArmedVersion(match);'));
  });

  it('⭐ the URL parses 14 and the bound moves to 15; isLnWorld agrees', () => {
    expect(a4UrlOverride('?a4world=14')).toBe(14);
    // ⚠ NARROWED BY GK-ENTRY (#402 item 5), POSITIVELY: 15 is now the GK entry, 16 the bound.
    expect(a4UrlOverride('?a4world=15')).toBe(15);
    expect(a4UrlOverride('?a4world=16')).toBeNull();
    expect(a4UrlOverride('?a4world=13')).toBe(13);
    expect(isLnWorld(14)).toBe(true);
    expect(isLnWorld(13)).toBe(false);
    expect(isBqWorld(14)).toBe(false);
    expect(isRaWorld(14)).toBe(false);
    expect(SRC).toContain('?a4world=14` arms that world + 看见自己人');
  });

  it('⭐ the badge carries 14 in BOTH dose forms, and the chip mounts', () => {
    expect(A4_BADGE_TEXTS[14]).toBe(A4_BADGE_TEXT_LN);
    expect(A4_BADGE_TEXTS_EMPTY[14]).toBe(A4_BADGE_TEXT_LN_EMPTY);
    expect(A4_BADGE_TEXT_LN).toBe('🧪 看见自己人 · 剂量成熟');
    expect(A4_BADGE_TEXT_LN_EMPTY).toBe('🧪 看见自己人 · 空账本(全新手)');
    expect(A4_BADGE_TEXT_LN).not.toBe(A4_BADGE_TEXT_LN_EMPTY);
    const badge = new A4WorldBadge({
      createElement: () => ({ className: '', textContent: null as string | null, remove: () => {} }),
      body: { appendChild: () => {} },
    });
    badge.setWorld(14);
    expect(badge.world).toBe(14);
    expect(badge.label).toBe(A4_BADGE_TEXT_LN);
    badge.setWorld(14, A4_BADGE_TEXT_LN_EMPTY);
    expect(badge.label).toBe(A4_BADGE_TEXT_LN_EMPTY);
  });
});

/* ========================================================================== */
/* ⭐⭐ THE HONEST BRIEF — every number a LN-T1′b field at 6 dp                 */
/* ========================================================================== */

/** The EMPTY-BOOK (E13) arm's own numbers — control ABSENT → arm W025, `w = 0.25`. */
const EMPTY_BOOK_PAIRS = [
  '0.102798', '0.058788', // firstBody.ownNonTarget
  '0.575499', '0.189112', // family.KICKOFF-PLAYBACK.caromRate
  '74.579710', '71.246377', // context.groundPassesPerMatch
  '14.492657', '14.347704', // context.meanPassDistanceMetres
  '0.592215', '0.023227', // context.passCompletion + its delta
  '27.173913', '2.565217', // guard.interceptionsPerMatch + its delta
] as const;
/** The PLAYED (mature-book, D13) arm's own receipt — measured at `w = 0.5`, NOT at 0.25. */
const PLAYED_FORM_PAIR = ['0.089528', '0.040022'] as const;

describe('W14 — ⭐⭐ THE HONEST BRIEF: what it does, what it costs, what is inferred', () => {
  it('the settings blurb carries the checkbox label and every field it claims', () => {
    expect(SETTINGS).toContain('看见自己人 · 传球者的每套定价都看得见线上的队友 (play-test)');
    for (const v of EMPTY_BOOK_PAIRS) expect(SETTINGS).toContain(v);
    for (const v of PLAYED_FORM_PAIR) expect(SETTINGS).toContain(v);
    expect(SETTINGS).toContain('0.321803'); // firstBody.opponent, the ABSENT control
    expect(SETTINGS).toContain('不是这扇门的事'); // the first-look disclosure
    expect(SETTINGS).toContain('推断,不是测量'); // the played form's receipt, said plainly
    expect(SETTINGS).toContain('?a4world=14');
  });

  it('the feed blurb (GameApp) carries the brief in BOTH dose forms', () => {
    expect(APP).toContain('🧪 看见自己人 ON');
    expect(APP).toContain('🧪 看见自己人 · 空账本 ON');
    expect(APP).toContain('不是这扇门的事');
  });

  it('⭐⭐ THE ATTRIBUTION IS PINNED: each arm\'s number under its OWN heading (#387 item 1)', () => {
    // the EMPTY-BOOK feed line carries the E13 W025 numbers…
    const emptyLine = APP.split('\n').find((l) => l.includes('🧪 看见自己人 · 空账本 ON'))!;
    expect(emptyLine).toBeDefined();
    for (const v of EMPTY_BOOK_PAIRS) expect(emptyLine).toContain(v);
    // …and NOT the played form's 0.5 receipt
    for (const v of PLAYED_FORM_PAIR) expect(emptyLine).not.toContain(v);
    // the MATURE feed line carries the played form's receipt, and only WITH its `w = 0.5` label
    const matureLine = APP.split('\n').find(
      (l) => l.includes('🧪 看见自己人 ON') && l.includes('0.089528'),
    )!;
    expect(matureLine).toBeDefined();
    for (const v of PLAYED_FORM_PAIR) expect(matureLine).toContain(v);
    expect(matureLine).toContain('w = 0.5');
    // ⭐ the 0.5 receipt NEVER appears without its label, in either surface
    for (const text of [APP, SETTINGS]) {
      for (const line of text.split('\n').filter((l) => l.includes('0.040022'))) {
        expect(line).toContain('w = 0.5');
      }
    }
    // ⭐ and the empty-book arm is always declared as such where its numbers are claimed
    for (const line of SETTINGS.split('\n').filter((l) => l.includes('0.058788'))) {
      expect(line).toContain('空账本那一档,w = 0.25');
    }
  });

  it('the entry doc exists and names its rulings and its exam', () => {
    expect(DOC).toContain('#396');
    expect(DOC).toContain('LN-T1′b');
    expect(DOC).toContain('LN-T0');
  });
});

/* ========================================================================== */
/* DORMANCY and Road B                                                        */
/* ========================================================================== */

describe('W14 — DORMANCY below and Road B', () => {
  it('worlds 1–13 carry NO `lnOwnLanePrice`; world 14 carries it (the #396 narrow, positively)', () => {
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      expect(Object.prototype.hasOwnProperty.call(flags, 'lnOwnLanePrice')).toBe(false);
    }
    expect((a4MatchFlags(14) as Record<string, unknown>).lnOwnLanePrice).toBe(true);
    // …and no world BELOW 14 writes the gene either
    for (const v of [12, 13] as const) {
      const m = worldMatch(v);
      expect(m.lnOwnLanePrice).toBe(false);
      for (const side of [0, 1] as const) {
        expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'eff'), 'lnOwnLaneWeight'))
          .toBe(false);
        expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'base'), 'lnOwnLaneWeight'))
          .toBe(false);
      }
    }
  });

  it('a plain League match reads as no world at all', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    const m = league.createMatch(league.nextFixture()!);
    expect(lnArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
    expect(m.lnOwnLanePrice).toBe(false);
  });

  it('the league serializes nothing new (the worker plays the SHIPPED world — canon #283.2(iv))', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(LN_WORLD_VERSION);
    expect(JSON.stringify(league.toJSON())).not.toContain('lnOwnLanePrice');
    expect(JSON.stringify(league.toJSON())).not.toContain('lnOwnLaneWeight');
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.lnOwnLanePrice).toBe(false);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });
});

/* ========================================================================== */
/* ⭐⭐ THE MUTANT WALK — four mutants, each killed                             */
/* ========================================================================== */

describe('W14 — ⭐⭐ THE MUTANT WALK: four mutants, each killed', () => {
  it('M1 — the pin on ONE SIDE only ⇒ `lnArmedVersion` reads 0', () => {
    const m = worldMatch(14);
    const team = m.teams[1];
    const stripped = { ...team.baseGenome } as TacticalGenome;
    delete stripped.lnOwnLaneWeight;
    team.baseGenome = stripped;
    team.effGenome = stripped;
    expect(lnArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(BQ_WORLD_VERSION); // …it falls back to the world it contains
  });

  it('M2 — the FLAG without the PIN ⇒ `lnArmedVersion` reads 0', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(LN_WORLD_VERSION);
    const m = league.createMatch(league.nextFixture()!);
    armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE); // world 13's arming: no gene
    expect(m.lnOwnLanePrice).toBe(true);
    expect(lnArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(BQ_WORLD_VERSION);
  });

  it('M3 — the pin written on `info.genome` INSTEAD ⇒ `lnArmedVersion` reads 0', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(LN_WORLD_VERSION);
    const m = league.createMatch(league.nextFixture()!);
    armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
    for (const side of [0, 1] as const) {
      (m.teams[side].info as { genome: TacticalGenome }).genome = {
        ...genomeOf(m, side, 'info'), lnOwnLaneWeight: LN_WORLD_WEIGHT,
      };
    }
    expect(lnArmedVersion(m)).toBe(0);
  });

  it('M4 — the WRONG WEIGHT (0.5, the shell\'s own) ⇒ `lnArmedVersion` reads 0', () => {
    const m = worldMatch(14);
    examSetLnWeight(m, 0.5);
    expect(lnOwnLaneWeightOf(genomeOf(m, 0, 'eff'))).toBe(0.5);
    expect(lnArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(BQ_WORLD_VERSION);
  });
});

/* ========================================================================== */
/* ⭐⭐ IDENTITY — every world BELOW 14 is byte-identical to the dispatch HEAD  */
/* ========================================================================== */

/** The IDENTITY seeds — scratch, out of band (#396 item 4). */
const IDENTITY_SEEDS = Array.from({ length: 12 }, (_, i) => 900_004_400 + i);

/**
 * ⭐ THE DIGESTS RECORDED AT THE DISPATCH HEAD `7fe1d41`, in a CLEAN throwaway worktree
 * (`git worktree add /tmp/ln-entry-base 7fe1d41`, `git status --short` EMPTY), BEFORE a single
 * byte of this rung was written. Each is `sha256` of the twelve per-seed whole-match signatures
 * joined by `|`, each walk armed through the SHIPPED composer (`a4MatchFlags` + `armA4World`)
 * at the ENGINE DEFAULT clock.
 */
const BASELINE_DIGESTS = {
  bare: '0243b6cee416937692bd3572c6de8035497f15e731af056040c477adf3c54052',
  world12: '8d7b51489d5dce56cfa47299b2263dff738b292fcde4d26ff67b8adb6134aa46',
  world13: '6455c9f1c59bf285b2d25341c3d40de1f2a80297710aaad5d986e57963ed5370',
} as const;

const pooledDigest = (version: 0 | 12 | 13 | 14): string => createHash('sha256').update(
  IDENTITY_SEEDS.map((seed) => {
    const league = new League({ seed });
    if (version !== 0) league.matchFlags = a4MatchFlags(version);
    const match = league.createMatch(league.nextFixture()!);
    if (version !== 0) armA4World(match, null, version, L3_DOSE, PC_DOSE);
    match.runToCompletion();
    return signature(match);
  }).join('|'),
).digest('hex');

describe('W14 — ⭐⭐ IDENTITY: the shipped world and every world below 14 are byte-identical', () => {
  it('the bare world, world 12 and world 13 equal their `7fe1d41` digests', () => {
    expect(pooledDigest(0)).toBe(BASELINE_DIGESTS.bare);
    expect(pooledDigest(12)).toBe(BASELINE_DIGESTS.world12);
    expect(pooledDigest(13)).toBe(BASELINE_DIGESTS.world13);
  }, 600_000);

  it('⭐ NON-VACUOUS: world 14 is a DIFFERENT world from world 13', () => {
    expect(pooledDigest(14)).not.toBe(BASELINE_DIGESTS.world13);
  }, 600_000);

  it('⭐ the production fingerprint literal is UNCHANGED (57b0bdab…c673)', () => {
    expect(repoText('tests/a4HomeGrant.test.ts')).toContain(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
  });
});
