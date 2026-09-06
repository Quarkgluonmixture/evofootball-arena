import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { randomGenome, lnOwnLaneWeightOf, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  BQ_WORLD_VERSION, GK_WORLD_DOORS, GK_WORLD_VERSION, LN_WORLD_VERSION, LN_WORLD_WEIGHT,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, bqArmedVersion, gkArmedVersion,
  isBqWorld, isGkWorld, isLnWorld, lnArmedVersion, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_GK, A4_BADGE_TEXT_GK_EMPTY, A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../src/ui/A4WorldBadge';

/**
 * ⭐⭐ THE GK ENTRY — `?a4world=15` (身体跟着手走, the ONE dive door at GK-T1's E14-ARMED
 * construction). Ruling #402 item 5; docs/world-model/GK-ENTRY-RUNG.md. The FIFTEENTH entry
 * of the #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6/#309.5/#337.5/#365/#386/#396 family.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 15 IS world 14 plus EXACTLY the ONE door `gkDiveBody`, and it says
 *       so by CALLING the world-14 composition. ⛔ NOTHING ELSE rides along, and there is NO
 *       DOSE AND NO GENE (the law introduced no new constant), so `armGkWorld` is
 *       `armLnWorld` CALLED and nothing more — world 14's own pin (`lnOwnLaneWeight` = 0.25 on
 *       `baseGenome` AND `effGenome` of both sides, `info.genome` clean) arrives by the call.
 *       ⭐⭐⭐ And THE EXAM'S OWN E14-ARMED CONSTRUCTION is REPRODUCED by the entry's arming.
 *   (2) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 15 → 14 → 13 → 12 → 11: a world-15 match
 *       names itself 15 and NEVER 14; a world-14 match never reads 15.
 *   (3) ⭐ THE URL parses 15 and the bound moves to 16; the badge carries 15 in BOTH dose forms.
 *   (4) ⭐⭐ THE HONEST BRIEF — the blurbs carry the GK-T1 field values as 6-dp strings, each in
 *       the surface that claims it, and each ARM's number under its OWN heading (E13 empty-book
 *       vs D13 mature — the #387 item 1 class); plus the deferred world-14 sentence's 499 → 454.
 *   (5) ⭐⭐ IDENTITY BELOW 15 — pooled whole-match digests for the bare world, world 12, world
 *       13 AND world 14 equal the digests RECORDED at the dispatch HEAD `a5a6b73` (clean
 *       worktree), and the production fingerprint literal is unchanged.
 *   (6) DORMANCY — worlds 1–14 carry no `gkDiveBody`; a plain League match reads as no world;
 *       `League.toJSON` omits matchFlags (canon worker fixtures).
 *   (7) ⭐⭐ LIVENESS in the #402 item 2(iii) form, and THE MUTANT WALK — four mutants killed.
 *
 * ⚠ SEEDS: OUT-OF-BAND SCRATCH ONLY — 900,005,600–699 (#402 item 5); zero frontier
 * consumption, ZERO sims of record.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/GK-ENTRY-RUNG.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

const SCRATCH = 900_005_630;

/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (version: 12 | 13 | 14 | 15, dosed = true, seed = SCRATCH): Match => {
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

/** THE WHOLE-MATCH SIGNATURE, field for field the `lnPlaytestEntry.test.ts` helper (rng included). */
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

/* ========================================================================== */
/* ⭐ FIDELITY                                                                 */
/* ========================================================================== */

describe('W15 — ⭐ FIDELITY: the world IS the exam\'s E14-ARMED composition, ONE door, no gene', () => {
  it('world 15 is `a4MatchFlags(14)` ∪ { gkDiveBody }, key for key', () => {
    expect(GK_WORLD_VERSION).toBe(15);
    const flags = a4MatchFlags(GK_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(LN_WORLD_VERSION), ...GK_WORLD_DOORS });
    expect(GK_WORLD_DOORS).toEqual({ gkDiveBody: true });
    const fourteen = a4MatchFlags(LN_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in fourteen)).sort()).toEqual(['gkDiveBody']);
    for (const k of Object.keys(fourteen)) expect(flags[k]).toBe(fourteen[k]);
  });

  it('⛔ NOTHING ELSE RIDES ALONG (#402 item 5(i)): no OBM, no CTB, no RC, no BF, no EDS', () => {
    const KEYS = ['obmMovement', 'ctbSupportPlane', 'rcAnticipate', 'rcReady', 'bfFacingCost',
      'edsTouchCost'] as const;
    for (const v of [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      for (const k of KEYS) expect(flags[k]).toBeFalsy();
    }
    const m = worldMatch(15) as unknown as Record<string, unknown>;
    for (const k of KEYS) expect(m[k]).toBeFalsy();
  });

  it('⭐⭐ the composition is CALLED, not copied; the arming IS world 14\'s, called, and NOTHING more', () => {
    expect(SRC).toContain('return { ...a4MatchFlags(LN_WORLD_VERSION), ...GK_WORLD_DOORS };');
    expect(SRC).toContain('): void {\n  armLnWorld(match, l3Dose, pcDose);\n}');
    // ⛔ NO GENE AND NO CONSTANT: the entry layer names no GK weight and no GK gene setter
    expect(SRC).not.toContain('setGkGene');
    expect(SRC).not.toContain('GK_WORLD_WEIGHT');
    const m = worldMatch(15);
    expect(m.gkDiveBody).toBe(true);
    expect(m.lnOwnLanePrice).toBe(true);
    expect(m.bqCushion).toBe(true);
    for (const side of [0, 1] as const) {
      // ⭐ world 14's ONE pin rides in from the CALL, on BOTH dosed views, never on info.genome
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(0.25);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(0.25);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(gkArmedVersion(m)).toBe(GK_WORLD_VERSION);
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(m)).toBe(BQ_WORLD_VERSION);
  });

  it('⭐ the door and the inherited gene survive to FULL TIME; `info.genome` stays clean', () => {
    const m = worldMatch(15, true, 900_005_631);
    m.runToCompletion();
    expect(m.gkDiveBody).toBe(true);
    for (const side of [0, 1] as const) {
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(LN_WORLD_WEIGHT);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(gkArmedVersion(m)).toBe(GK_WORLD_VERSION);
    expect(a4ArmedVersion(m)).toBe(GK_WORLD_VERSION);
  }, 120_000);
});

/* ========================================================================== */
/* ⭐⭐⭐ THE EXAM'S OWN CONSTRUCTION, REPRODUCED BY THE ENTRY'S ARMING          */
/* ========================================================================== */

/** GK-T1's own team builder (`scripts/probes/gk-t1-dive-exam.ts` `teamInfo`, character for character). */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/**
 * ⭐⭐ THE EXAM'S WAY — `scripts/probes/gk-t1-dive-exam.ts` `buildMatch`, E14-ARMED arm: the
 * world-14 construction flags PLUS `gkDiveBody: true` in the CONSTRUCTOR's flags, then
 * `armA4World(m, null, 14)` — the EMPTY-BOOK form (E14 takes no doses).
 */
const examWay = (seed: number): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(LN_WORLD_VERSION),
    ...{ gkDiveBody: true },
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, LN_WORLD_VERSION);
  return m;
};

/** ⭐⭐ THE ENTRY'S WAY — `a4MatchFlags(15)` + `armA4World(m, null, 15)`, the same E14 empty book. */
const entryWay = (seed: number): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(GK_WORLD_VERSION),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, GK_WORLD_VERSION);
  return m;
};

/** The SAME pair through the APP's own construction path (League + `matchFlags`). */
const examWayApp = (seed: number): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = { ...a4MatchFlags(LN_WORLD_VERSION), gkDiveBody: true };
  const m = league.createMatch(league.nextFixture()!);
  armA4World(m, null, LN_WORLD_VERSION);
  return m;
};
const entryWayApp = (seed: number): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = a4MatchFlags(GK_WORLD_VERSION);
  const m = league.createMatch(league.nextFixture()!);
  armA4World(m, null, GK_WORLD_VERSION);
  return m;
};

const CONSTRUCTION_SEEDS = [900_005_620, 900_005_621, 900_005_622, 900_005_623, 900_005_624,
  900_005_625] as const;

describe('W15 — ⭐⭐⭐ THE EXAM\'S E14-ARMED CONSTRUCTION IS THE ENTRY\'S ARMING', () => {
  it('the two constructions are IDENTICAL at construction AND at full time, on 6 scratch seeds', () => {
    // the flag SET itself, key for key — the byte-for-byte claim
    expect({ ...a4MatchFlags(LN_WORLD_VERSION), gkDiveBody: true })
      .toEqual(a4MatchFlags(GK_WORLD_VERSION));
    for (const seed of CONSTRUCTION_SEEDS) {
      const a = examWay(seed);
      const b = entryWay(seed);
      expect(signature(b)).toBe(signature(a));
      a.runToCompletion();
      b.runToCompletion();
      expect(signature(b)).toBe(signature(a));
      expect(gkArmedVersion(b)).toBe(GK_WORLD_VERSION);
      // …the exam's own arm is the SAME world, read by the entry's own predicate
      expect(gkArmedVersion(a)).toBe(GK_WORLD_VERSION);
    }
  }, 600_000);

  it('…and identically through the APP\'s own League construction path', () => {
    for (const seed of CONSTRUCTION_SEEDS) {
      const a = examWayApp(seed);
      const b = entryWayApp(seed);
      expect(signature(b)).toBe(signature(a));
      a.runToCompletion();
      b.runToCompletion();
      expect(signature(b)).toBe(signature(a));
    }
  }, 600_000);
});

/* ========================================================================== */
/* ⭐⭐ CONTAINMENT, THE URL BOUND AND THE BADGE                                */
/* ========================================================================== */

describe('W15 — ⭐⭐ CONTAINMENT, the URL bound and the badge', () => {
  it('⭐⭐ the version value is containment-ordered: 15 names itself 15; 14 stays 14', () => {
    const fifteen = worldMatch(15);
    expect(gkArmedVersion(fifteen)).toBe(GK_WORLD_VERSION);
    expect(a4ArmedVersion(fifteen)).toBe(GK_WORLD_VERSION); // ⛔ never 14
    // …and the worlds it contains still read as themselves underneath: 15 → 14 → 13 → 12 → 11
    expect(lnArmedVersion(fifteen)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(fifteen)).toBe(BQ_WORLD_VERSION);
    const fourteen = worldMatch(14);
    expect(gkArmedVersion(fourteen)).toBe(0);
    expect(a4ArmedVersion(fourteen)).toBe(LN_WORLD_VERSION); // ⛔ never 15
    const thirteen = worldMatch(13);
    expect(gkArmedVersion(thirteen)).toBe(0);
    expect(a4ArmedVersion(thirteen)).toBe(BQ_WORLD_VERSION);
    const twelve = worldMatch(12);
    expect(gkArmedVersion(twelve)).toBe(0);
    expect(a4ArmedVersion(twelve)).toBe(12);
    // the EMPTY-BOOK form is the same world 15
    expect(a4ArmedVersion(worldMatch(15, false))).toBe(GK_WORLD_VERSION);
    // ⭐ THE SOURCE ORDER itself: 15 is asked BEFORE 14 (mutant M4's home)
    expect(SRC.indexOf('const raw15 = gkArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw14 = lnArmedVersion(match);'));
    expect(SRC.indexOf('const raw14 = lnArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw13 = bqArmedVersion(match);'));
  });

  it('⭐ the URL parses 15 and the bound moves to 16; isGkWorld agrees', () => {
    expect(a4UrlOverride('?a4world=15')).toBe(15);
    expect(a4UrlOverride('?a4world=16')).toBeNull();
    expect(a4UrlOverride('?a4world=14')).toBe(14);
    expect(isGkWorld(15)).toBe(true);
    expect(isGkWorld(14)).toBe(false);
    expect(isLnWorld(15)).toBe(false);
    expect(isBqWorld(15)).toBe(false);
    expect(SRC).toContain('?a4world=15` arms that world + 身体跟着手走');
  });

  it('⭐ the badge carries 15 in BOTH dose forms, and the chip mounts', () => {
    expect(A4_BADGE_TEXTS[15]).toBe(A4_BADGE_TEXT_GK);
    expect(A4_BADGE_TEXTS_EMPTY[15]).toBe(A4_BADGE_TEXT_GK_EMPTY);
    expect(A4_BADGE_TEXT_GK).toBe('🧪 身体跟着手走 · 剂量成熟');
    expect(A4_BADGE_TEXT_GK_EMPTY).toBe('🧪 身体跟着手走 · 空账本(全新手)');
    expect(A4_BADGE_TEXT_GK).not.toBe(A4_BADGE_TEXT_GK_EMPTY);
    const badge = new A4WorldBadge({
      createElement: () => ({ className: '', textContent: null as string | null, remove: () => {} }),
      body: { appendChild: () => {} },
    });
    badge.setWorld(15);
    expect(badge.world).toBe(15);
    expect(badge.label).toBe(A4_BADGE_TEXT_GK);
    badge.setWorld(15, A4_BADGE_TEXT_GK_EMPTY);
    expect(badge.label).toBe(A4_BADGE_TEXT_GK_EMPTY);
  });
});

/* ========================================================================== */
/* ⭐⭐ THE HONEST BRIEF — every number a GK-T1 field at 6 dp                   */
/* ========================================================================== */

/** The EMPTY-BOOK (E13) arm's OWN values — `…json.RED.json`, control ABSENT → arm ARMED. */
const E13_VALUES = [
  '0.835740', '0.104907', // r1.catchMaxOverOneMetreShare
  '353.194605', '2.738122', '6.924280', '12.052622', // guard.timeToDistributionTicks + Δ + CI
  '82.609375', '0.819444', // wait.meanTicks + wait.overSpriteShare
  '1.465122', '0.054493', // guard.xgConversion + Δ
  '1.388442', '1.353315', // claim.meanNextDisplacementMetres
] as const;
/** The MATURE-BOOK (D13) arm's OWN values — the form the user plays, MEASURED this time. */
const D13_VALUES = [
  '0.843111', '0.117733', // r1.catchMaxOverOneMetreShare
  '360.472754', '5.569766', '1.868426', '12.818250', // guard.timeToDistributionTicks + Δ + CI
  '84.659733', '0.742942', // wait.meanTicks + wait.overSpriteShare
  '1.338601', '1.348855', // claim.meanNextDisplacementMetres
] as const;
/** LN-T1′b's KEEPER-pass ledger-row denominators — the DEFERRED world-14 sentence (#398 1(ii)). */
const W14_KEEPER_PASS = ['499', '454'] as const;

describe('W15 — ⭐⭐ THE HONEST BRIEF: the cost first, and each arm under its own heading', () => {
  it('the settings blurb carries the checkbox label and every field it claims', () => {
    expect(SETTINGS).toContain('身体跟着手走 · 门将扑到球,球停在手上等身体到 (play-test)');
    for (const v of E13_VALUES) expect(SETTINGS).toContain(v);
    // …the played form's OWN win, under its own label
    expect(SETTINGS).toContain('0.843111');
    expect(SETTINGS).toContain('0.117733');
    expect(SETTINGS).toContain('591 次接球里 58 次'); // release.ownershipLoss 58 / 591
    expect(SETTINGS).toContain('含零'); // G8 is stated UNRESOLVED, never as zero
    expect(SETTINGS).toContain('上限'); // ARMED's R1 is an upper bound, said plainly
    expect(SETTINGS).toContain('?a4world=15');
  });

  it('⭐⭐ THE ARM LABELS ARE ADJACENT TO THE NUMBERS (#387 item 1, in the settings blurb)', () => {
    expect(SETTINGS).toContain('空账本 0.835740 → 0.104907');
    expect(SETTINGS).toContain('成熟账本)0.843111 → 0.117733');
  });

  it('the feed blurb (GameApp) carries the brief in BOTH dose forms', () => {
    expect(APP).toContain('🧪 身体跟着手走 ON');
    expect(APP).toContain('🧪 身体跟着手走 · 空账本 ON');
  });

  it('⭐⭐ THE ATTRIBUTION IS PINNED: each arm\'s number under its OWN heading', () => {
    const emptyLine = APP.split('\n').find((l) => l.includes('🧪 身体跟着手走 · 空账本 ON'))!;
    expect(emptyLine).toBeDefined();
    for (const v of E13_VALUES) expect(emptyLine).toContain(v);
    for (const v of D13_VALUES) expect(emptyLine).not.toContain(v);
    const matureLine = APP.split('\n').find(
      (l) => l.includes('🧪 身体跟着手走 ON') && !l.includes('空账本 ON'),
    )!;
    expect(matureLine).toBeDefined();
    for (const v of D13_VALUES) expect(matureLine).toContain(v);
    for (const v of E13_VALUES) expect(matureLine).not.toContain(v);
    // ⭐ THE COST IS SAID BEFORE THE WIN, in both dose forms
    for (const line of [emptyLine, matureLine]) {
      expect(line.indexOf('代价说在最前面')).toBeGreaterThan(-1);
      expect(line.indexOf('代价说在最前面')).toBeLessThan(line.indexOf('量到的:接住的球'));
    }
  });

  it('⭐ THE DEFERRED WORLD-14 SENTENCE is on the settings blurb AND both world-14 feed lines', () => {
    const [a, b] = W14_KEEPER_PASS;
    expect(SETTINGS).toContain(`门将传球的账本行数 ${a} → ${b}`);
    for (const needle of ['🧪 看见自己人 ON', '🧪 看见自己人 · 空账本 ON']) {
      const line = APP.split('\n').find((l) => l.includes(needle))!;
      expect(line).toBeDefined();
      expect(line).toContain(`门将传球的账本行数 ${a} → ${b}`);
    }
  });

  it('the entry doc exists and names its rulings and its exam', () => {
    expect(DOC).toContain('#402');
    expect(DOC).toContain('GK-T1');
    expect(DOC).toContain('GK-T0');
  });
});

/* ========================================================================== */
/* DORMANCY and Road B                                                        */
/* ========================================================================== */

describe('W15 — DORMANCY below and Road B', () => {
  it('worlds 1–14 carry NO `gkDiveBody`; world 15 carries it (the #402 narrow, positively)', () => {
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      expect(Object.prototype.hasOwnProperty.call(flags, 'gkDiveBody')).toBe(false);
    }
    expect((a4MatchFlags(15) as Record<string, unknown>).gkDiveBody).toBe(true);
    for (const v of [12, 13, 14] as const) expect(worldMatch(v).gkDiveBody).toBe(false);
  });

  it('a plain League match reads as no world at all', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    const m = league.createMatch(league.nextFixture()!);
    expect(gkArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
    expect(m.gkDiveBody).toBe(false);
  });

  it('the league serializes nothing new (the worker plays the SHIPPED world — canon #283.2(iv))', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(GK_WORLD_VERSION);
    expect(JSON.stringify(league.toJSON())).not.toContain('gkDiveBody');
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.gkDiveBody).toBe(false);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });

  it('⭐ THE DEFAULT LANDING WORLD IS UNCHANGED — the app still starts at 0', () => {
    expect(APP).toContain('private a4World: A4WorldVersion = 0;');
  });
});

/* ========================================================================== */
/* ⭐⭐ THE MUTANT WALK — four mutants, each killed by a NAMED pin              */
/* ========================================================================== */

describe('W15 — ⭐⭐ THE MUTANT WALK: four mutants, each killed', () => {
  it('M1 — the DOOR removed from `GK_WORLD_DOORS` ⇒ the flag set stops matching and 15 reads 0', () => {
    const mutated = { ...a4MatchFlags(LN_WORLD_VERSION) }; // the doors object emptied
    expect(mutated).not.toEqual(a4MatchFlags(GK_WORLD_VERSION)); // killed by FIDELITY
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = mutated;
    const m = league.createMatch(league.nextFixture()!);
    armA4World(m, null, GK_WORLD_VERSION);
    expect(m.gkDiveBody).toBe(false);
    expect(gkArmedVersion(m)).toBe(0); // killed by CONTAINMENT
    expect(a4ArmedVersion(m)).toBe(LN_WORLD_VERSION); // …it falls back to the world it contains
  });

  it('M2 — the composer calling `a4MatchFlags(13)` instead of 14 ⇒ world 14\'s door is gone', () => {
    const mutated = { ...a4MatchFlags(BQ_WORLD_VERSION), ...GK_WORLD_DOORS };
    expect(mutated).not.toEqual(a4MatchFlags(GK_WORLD_VERSION)); // killed by FIDELITY
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = mutated;
    const m = league.createMatch(league.nextFixture()!);
    armA4World(m, null, GK_WORLD_VERSION);
    expect(m.lnOwnLanePrice).toBe(false);
    expect(lnArmedVersion(m)).toBe(0);
    expect(gkArmedVersion(m)).toBe(0); // killed by CONTAINMENT (15 requires 14)
  });

  it('M3 — the URL bound NOT MOVED ⇒ `?a4world=15` would read null', () => {
    expect(a4UrlOverride('?a4world=15')).toBe(15); // killed by THE URL pin
    expect(a4UrlOverride('?a4world=16')).toBeNull();
  });

  it('M4 — `a4ArmedVersion` reading 14 BEFORE 15 ⇒ a world-15 match would name itself 14', () => {
    // the mutant's own read, spelled out: asking 14 first on a world-15 match answers 14
    const fifteen = worldMatch(15);
    expect(lnArmedVersion(fifteen)).toBe(LN_WORLD_VERSION); // …what the mutant would return
    expect(a4ArmedVersion(fifteen)).toBe(GK_WORLD_VERSION); // killed by CONTAINMENT
    expect(SRC.indexOf('const raw15 = gkArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw14 = lnArmedVersion(match);')); // killed by SOURCE ORDER
  });
});

/* ========================================================================== */
/* ⭐⭐ IDENTITY — every world BELOW 15 is byte-identical to the dispatch HEAD  */
/* ========================================================================== */

/** The IDENTITY seeds — scratch, out of band (#402 item 5). */
const IDENTITY_SEEDS = Array.from({ length: 12 }, (_, i) => 900_005_600 + i);

/**
 * ⭐ THE DIGESTS RECORDED AT THE DISPATCH HEAD `a5a6b73`, in a CLEAN throwaway worktree
 * (`git worktree add /tmp/gk-entry-base a5a6b73`, `git status --short` EMPTY), BEFORE a single
 * byte of this rung was written. Each is `sha256` of the twelve per-seed whole-match signatures
 * joined by `|`, each walk armed through the SHIPPED composer (`a4MatchFlags` + `armA4World`)
 * at the ENGINE DEFAULT clock. ⚠ `a5a6b73` is the docs-only descendant of the RESULTS commit
 * `07d4e5f` the ruling names; `git diff 07d4e5f a5a6b73 -- src tests` is EMPTY.
 */
const BASELINE_DIGESTS = {
  bare: 'b157fd0b36e637c5ffa995836ccbef509824242c214758f4a08fb8638bd1d5b2',
  world12: 'c431fb98ad5f9d7894c61adedf6f8f984d8b3da11a272ab9b4363845f0a3e79b',
  world13: 'a25992f1fa5c6d1c3a508b8d56eebbc4abe20cf637ba2e6abb1795753d76b92a',
  world14: '522c1b79126f0d8802eeff6a6c7651699104aa3ecb647ed9059c4a6496913542',
} as const;

const pooledDigest = (version: 0 | 12 | 13 | 14 | 15): string => createHash('sha256').update(
  IDENTITY_SEEDS.map((seed) => {
    const league = new League({ seed });
    if (version !== 0) league.matchFlags = a4MatchFlags(version);
    const match = league.createMatch(league.nextFixture()!);
    if (version !== 0) armA4World(match, null, version, L3_DOSE, PC_DOSE);
    match.runToCompletion();
    return signature(match);
  }).join('|'),
).digest('hex');

describe('W15 — ⭐⭐ IDENTITY: the shipped world and every world below 15 are byte-identical', () => {
  it('the bare world, world 12, world 13 and world 14 equal their `a5a6b73` digests', () => {
    expect(pooledDigest(0)).toBe(BASELINE_DIGESTS.bare);
    expect(pooledDigest(12)).toBe(BASELINE_DIGESTS.world12);
    expect(pooledDigest(13)).toBe(BASELINE_DIGESTS.world13);
    expect(pooledDigest(14)).toBe(BASELINE_DIGESTS.world14);
  }, 900_000);

  it('⭐ NON-VACUOUS: world 15 is a DIFFERENT world from world 14', () => {
    expect(pooledDigest(15)).not.toBe(BASELINE_DIGESTS.world14);
  }, 900_000);

  it('⭐ the production fingerprint literal is UNCHANGED (57b0bdab…c673)', () => {
    expect(repoText('tests/a4HomeGrant.test.ts')).toContain(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
  });
});

/* ========================================================================== */
/* ⭐⭐ LIVENESS — the #402 item 2(iii) form, with the dead-time exemption      */
/* ========================================================================== */

const LIVENESS_SEEDS = Array.from({ length: 12 }, (_, i) => 900_005_640 + i);

describe('W15 — ⭐⭐ LIVENESS: the door BITES (the #402 item 2(iii) form)', () => {
  /**
   * ⚠ THE DEAD-TIME EXEMPTION, STATED (ruling #402 item 2(iii), the G-BITE FORM RULE): a
   * liveness receipt NEVER claims "every seed". GK-T1's own frozen `gBite` said ABSENT ≠ ARMED
   * on EVERY seed with a catch and honestly went RED on seed 12,552,083 — the only catch on the
   * last tick before half time, where `stepRestart` runs through `halftime`, the waiting branch
   * never executes and the contact dies at `resetForKickoff`: THE FLAG HAD NOTHING TO BITE.
   * This pin therefore asserts the door bites on AT LEAST ONE of twelve scratch seeds, and
   * publishes how many bit as a receipt — never a universal over a population containing dead
   * time.
   */
  it('world 15 ≠ world 14 on at least ONE of 12 scratch seeds (dead time exempted)', () => {
    let bit = 0;
    for (const seed of LIVENESS_SEEDS) {
      const build = (v: 14 | 15): string => {
        const league = new League({ seed, matchDuration: 300 });
        league.matchFlags = a4MatchFlags(v);
        const m = league.createMatch(league.nextFixture()!);
        armA4World(m, null, v, L3_DOSE, PC_DOSE);
        m.runToCompletion();
        return signature(m);
      };
      if (build(15) !== build(14)) bit += 1;
    }
    expect(bit).toBeGreaterThanOrEqual(1);
  }, 900_000);
});
