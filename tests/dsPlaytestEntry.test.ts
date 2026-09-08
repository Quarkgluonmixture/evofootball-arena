import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { randomGenome, lnOwnLaneWeightOf, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  BQ_WORLD_VERSION, DS_WORLD_DOORS, DS_WORLD_VERSION, GK_WORLD_VERSION, LN_WORLD_VERSION,
  LN_WORLD_WEIGHT, a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, bqArmedVersion,
  dsArmedVersion, gkArmedVersion, isBqWorld, isDsWorld, isGkWorld, isLnWorld, lnArmedVersion,
  poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_DS, A4_BADGE_TEXT_DS_EMPTY, A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../src/ui/A4WorldBadge';

/**
 * ⭐⭐ THE DS ENTRY — `?a4world=16` (自己的前插, the TWO own-run doors at DS-T1c's arm of record
 * `OWN-E13-ABSENT`). Ruling #411 item 4; docs/world-model/DS-ENTRY-RUNG.md. The SIXTEENTH entry
 * of the #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6/#309.5/#337.5/#365/#386/#396/#402 family.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 16 IS world 15 plus EXACTLY the TWO doors `dsOwnRun` + `dsHatsOff`,
 *       and it says so by CALLING the world-15 composition. ⛔ NOTHING ELSE rides along, and
 *       there is NO DOSE, NO GENE AND NO CONSTANT (the law is the coach's own numbers, moved),
 *       so `armDsWorld` is `armGkWorld` CALLED and nothing more — world 14's own pin
 *       (`lnOwnLaneWeight` = 0.25 on `baseGenome` AND `effGenome` of both sides, `info.genome`
 *       clean) arrives by the call.
 *       ⭐⭐⭐ And THE DOOR SET is the EXAM'S: DS-T1c built its OWN arm as `a4MatchFlags(13)` +
 *       both flags + `armA4World(m, null, 13)` — a WORLD-13 composition, because the exam ran
 *       before this world existed. So the identity is pinned in TWO halves: (a) the exam's own
 *       construction, re-run here on WORLD 13, reproduces DS-T1c's STORED per-seed whole-match
 *       signatures for `OWN-E13-ABSENT` on the first twelve battery seeds, and (b)
 *       `a4MatchFlags(15)` + both flags gives whole-match signatures IDENTICAL to
 *       `a4MatchFlags(16)`'s on six scratch seeds — so the DOOR SET world 16 adds is the door
 *       set the exam measured, on the substrate world 16 actually sits on.
 *   (2) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 16 → 15 → 14 → 13 → 12 → 11: a world-16
 *       match names itself 16 and NEVER 15; a world-15 match never reads 16.
 *   (3) ⭐ THE URL parses 16 and the bound moves to 17; the badge carries 16 in BOTH dose forms.
 *   (4) ⭐⭐ THE HONEST BRIEF — the blurbs carry the DS-T1c field values as 6-dp strings, each in
 *       the surface that claims it, and each ARM's number under its OWN heading (E13 empty-book
 *       vs D13 mature — the #387 item 1 class), with the cost said BEFORE the win and the cost
 *       block's own ARM FRAME present (GK-ENTRY §COMMANDER CORRECTIONS 3).
 *   (5) ⭐⭐ IDENTITY BELOW 16 — pooled whole-match digests for the bare world, world 12, 13, 14
 *       AND 15 equal the digests RECORDED at the dispatch HEAD `0eefb9a` (clean worktree), and
 *       the production fingerprint literal is unchanged.
 *   (6) DORMANCY — worlds 1–15 carry neither flag; a plain League match reads as no world;
 *       `League.toJSON` omits matchFlags (canon worker fixtures).
 *   (7) ⭐⭐ LIVENESS in the #402 item 2(iii) form, and THE MUTANT WALK — four mutants killed.
 *
 * ⚠ SEEDS: OUT-OF-BAND SCRATCH ONLY — 900,007,200–299 (#411 item 4); zero frontier consumption,
 * ZERO sims of record. The ONE exception is DS-T1c's OWN battery band 12,556,000–011, which the
 * exam consumed WHOLE (#411 item 7) and which item 4(iv) names for the door-set identity pin —
 * re-walking a consumed seed reads no new frontier.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/DS-ENTRY-RUNG.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

const SCRATCH = 900_007_230;

/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (version: 12 | 13 | 14 | 15 | 16, dosed = true, seed = SCRATCH): Match => {
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

/** THE WHOLE-MATCH SIGNATURE, field for field the `gkPlaytestEntry.test.ts` helper (rng included). */
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

describe('W16 — ⭐ FIDELITY: world 15 plus TWO doors, no gene, no constant', () => {
  it('world 16 is `a4MatchFlags(15)` ∪ { dsOwnRun, dsHatsOff }, key for key', () => {
    expect(DS_WORLD_VERSION).toBe(16);
    const flags = a4MatchFlags(DS_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(GK_WORLD_VERSION), ...DS_WORLD_DOORS });
    expect(DS_WORLD_DOORS).toEqual({ dsOwnRun: true, dsHatsOff: true });
    const fifteen = a4MatchFlags(GK_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in fifteen)).sort())
      .toEqual(['dsHatsOff', 'dsOwnRun']);
    for (const k of Object.keys(fifteen)) expect(flags[k]).toBe(fifteen[k]);
  });

  it('⛔ NOTHING ELSE RIDES ALONG (#411 item 4(i)): no OBM, no CTB, no RC, no BF, no EDS', () => {
    const KEYS = ['obmMovement', 'ctbSupportPlane', 'rcAnticipate', 'rcReady', 'bfFacingCost',
      'edsTouchCost'] as const;
    for (const v of [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      for (const k of KEYS) expect(flags[k]).toBeFalsy();
    }
    const m = worldMatch(16) as unknown as Record<string, unknown>;
    for (const k of KEYS) expect(m[k]).toBeFalsy();
    // ⛔ and NO OBM GENE: the seat is ABSENT — the arm of record's own state
    for (const side of [0, 1] as const) {
      for (const view of ['base', 'eff', 'info'] as const) {
        expect((genomeOf(worldMatch(16), side, view) as unknown as Record<string, unknown>)
          .offballMovementWeights).toBeUndefined();
      }
    }
  });

  it('⭐⭐ the composition is CALLED, not copied; the arming IS world 15\'s, called, and NOTHING more', () => {
    expect(SRC).toContain('return { ...a4MatchFlags(GK_WORLD_VERSION), ...DS_WORLD_DOORS };');
    expect(SRC).toContain('): void {\n  armGkWorld(match, l3Dose, pcDose);\n}');
    // ⛔ NO GENE AND NO CONSTANT: the entry layer names no DS weight and no DS gene setter
    expect(SRC).not.toContain('setDsGene');
    expect(SRC).not.toContain('DS_WORLD_WEIGHT');
    const m = worldMatch(16);
    expect(m.dsOwnRun).toBe(true);
    expect(m.dsHatsOff).toBe(true);
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
    expect(dsArmedVersion(m)).toBe(DS_WORLD_VERSION);
    expect(gkArmedVersion(m)).toBe(GK_WORLD_VERSION);
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(m)).toBe(BQ_WORLD_VERSION);
  });

  it('⭐ the doors and the inherited gene survive to FULL TIME; `info.genome` stays clean', () => {
    const m = worldMatch(16, true, 900_007_231);
    m.runToCompletion();
    expect(m.dsOwnRun).toBe(true);
    expect(m.dsHatsOff).toBe(true);
    expect(m.gkDiveBody).toBe(true);
    expect(m.lnOwnLanePrice).toBe(true);
    for (const side of [0, 1] as const) {
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(LN_WORLD_WEIGHT);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(bqArmedVersion(m)).toBe(BQ_WORLD_VERSION);
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
    expect(gkArmedVersion(m)).toBe(GK_WORLD_VERSION);
    expect(dsArmedVersion(m)).toBe(DS_WORLD_VERSION);
    expect(a4ArmedVersion(m)).toBe(DS_WORLD_VERSION);
  }, 120_000);
});

/* ========================================================================== */
/* ⭐⭐⭐ THE DOOR-SET IDENTITY WITH THE EXAM                                    */
/* ========================================================================== */

/** DS-T1c's own team builder (`scripts/probes/ds-t1c-own-run-exam.ts` `teamInfo`, character for character). */
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
 * ⭐⭐ THE EXAM'S OWN SIGNATURE RECIPE — `scripts/probes/ds-t1c-own-run-exam.ts` `signatureOf`,
 * field for field. It differs from this family's by ONE field (`action.type`), so it is written
 * out here rather than reused: a pin that reproduces a stored value has to use the recipe that
 * produced it.
 */
const examSignature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
    action: pp.action.type,
  })),
})).digest('hex');

/**
 * ⭐⭐ THE EXAM'S WAY — `ds-t1c-own-run-exam.ts` `buildMatch`, arm `OWN-E13-ABSENT`: the WORLD-13
 * construction flags PLUS both DS flags in the CONSTRUCTOR's flags, then `armA4World(m, null,
 * 13)` — the EMPTY-BOOK form (E13 takes no doses), the seat ABSENT (no `obmMovement`, no dose
 * matrix). Walked by the exam's own unobserved loop (`while (!m.finished) m.step(DT)`).
 */
const examWay = (seed: number): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
    ...{ dsOwnRun: true, dsHatsOff: true },
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, BQ_WORLD_VERSION);
  return m;
};

/** DS-T1c's first twelve battery seeds — its own consumed band (#411 item 4(iv)). */
const EXAM_SEEDS = Array.from({ length: 12 }, (_, i) => 12_556_000 + i);

describe('W16 — ⭐⭐⭐ THE DOOR SET IS DS-T1c\'s, PROVEN IN TWO HALVES', () => {
  it('(a) the exam\'s construction ON WORLD 13 reproduces its OWN stored `OWN-E13-ABSENT` signatures', () => {
    const artifact = JSON.parse(
      repoText('docs/world-model/data/ds-t1c-own-run-exam.json'),
    ) as { perSeedCells: { seed: number; 'OWN-E13-ABSENT': { signature: string } }[] };
    const stored = new Map(artifact.perSeedCells.map(
      (row) => [row.seed, row['OWN-E13-ABSENT'].signature] as const,
    ));
    let reproduced = 0;
    for (const seed of EXAM_SEEDS) {
      const want = stored.get(seed);
      expect(want, `seed ${seed} is in the artifact`).toBeTypeOf('string');
      const m = examWay(seed);
      while (!m.finished) m.step(DT);
      expect(examSignature(m), `seed ${seed}`).toBe(want);
      reproduced += 1;
    }
    // ⭐ #411 item 4(iv) asks for ≥ 2 of the band; the whole twelve reproduce, exactly.
    expect(reproduced).toBe(12);
  }, 900_000);

  it('(b) `a4MatchFlags(15)` + both flags ≡ `a4MatchFlags(16)`, whole-match, on 6 scratch seeds', () => {
    // the flag SET itself, key for key — the byte-for-byte claim
    expect({ ...a4MatchFlags(GK_WORLD_VERSION), dsOwnRun: true, dsHatsOff: true })
      .toEqual(a4MatchFlags(DS_WORLD_VERSION));
    const SEEDS = [900_007_220, 900_007_221, 900_007_222, 900_007_223, 900_007_224,
      900_007_225] as const;
    for (const seed of SEEDS) {
      const build = (spread: boolean): Match => {
        const league = new League({ seed, matchDuration: 300 });
        league.matchFlags = spread
          ? { ...a4MatchFlags(GK_WORLD_VERSION), dsOwnRun: true, dsHatsOff: true }
          : a4MatchFlags(DS_WORLD_VERSION);
        const m = league.createMatch(league.nextFixture()!);
        armA4World(m, null, DS_WORLD_VERSION, null, null);
        return m;
      };
      const a = build(true);
      const b = build(false);
      expect(signature(b)).toBe(signature(a));
      a.runToCompletion();
      b.runToCompletion();
      expect(signature(b)).toBe(signature(a));
      expect(dsArmedVersion(a)).toBe(DS_WORLD_VERSION);
      expect(dsArmedVersion(b)).toBe(DS_WORLD_VERSION);
    }
  }, 600_000);
});

/* ========================================================================== */
/* ⭐⭐ CONTAINMENT, THE URL BOUND AND THE BADGE                                */
/* ========================================================================== */

describe('W16 — ⭐⭐ CONTAINMENT, the URL bound and the badge', () => {
  it('⭐⭐ the version value is containment-ordered: 16 names itself 16; 15 stays 15', () => {
    const sixteen = worldMatch(16);
    expect(dsArmedVersion(sixteen)).toBe(DS_WORLD_VERSION);
    expect(a4ArmedVersion(sixteen)).toBe(DS_WORLD_VERSION); // ⛔ never 15
    // …and the worlds it contains still read as themselves underneath: 16 → 15 → 14 → 13 → 12
    expect(gkArmedVersion(sixteen)).toBe(GK_WORLD_VERSION);
    expect(lnArmedVersion(sixteen)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(sixteen)).toBe(BQ_WORLD_VERSION);
    const fifteen = worldMatch(15);
    expect(dsArmedVersion(fifteen)).toBe(0);
    expect(a4ArmedVersion(fifteen)).toBe(GK_WORLD_VERSION); // ⛔ never 16
    const fourteen = worldMatch(14);
    expect(dsArmedVersion(fourteen)).toBe(0);
    expect(a4ArmedVersion(fourteen)).toBe(LN_WORLD_VERSION);
    const thirteen = worldMatch(13);
    expect(dsArmedVersion(thirteen)).toBe(0);
    expect(a4ArmedVersion(thirteen)).toBe(BQ_WORLD_VERSION);
    const twelve = worldMatch(12);
    expect(dsArmedVersion(twelve)).toBe(0);
    expect(a4ArmedVersion(twelve)).toBe(12);
    // the EMPTY-BOOK form is the same world 16
    expect(a4ArmedVersion(worldMatch(16, false))).toBe(DS_WORLD_VERSION);
    // ⭐ ONE DOOR IS NOT ENOUGH: the containment predicate needs BOTH
    for (const only of [{ dsOwnRun: true }, { dsHatsOff: true }] as const) {
      const league = new League({ seed: SCRATCH, matchDuration: 300 });
      league.matchFlags = { ...a4MatchFlags(GK_WORLD_VERSION), ...only };
      const m = league.createMatch(league.nextFixture()!);
      armA4World(m, null, DS_WORLD_VERSION, L3_DOSE, PC_DOSE);
      expect(dsArmedVersion(m)).toBe(0);
      expect(a4ArmedVersion(m)).toBe(GK_WORLD_VERSION);
    }
    // ⭐ THE SOURCE ORDER itself: 16 is asked BEFORE 15 (mutant M4's home)
    expect(SRC.indexOf('const raw16 = dsArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw15 = gkArmedVersion(match);'));
    expect(SRC.indexOf('const raw15 = gkArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw14 = lnArmedVersion(match);'));
    expect(SRC.indexOf('const raw14 = lnArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw13 = bqArmedVersion(match);'));
    expect(SRC.indexOf('const raw13 = bqArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw12 = raArmedVersion(match);'));
  });

  it('⭐ the URL parses 16 and the bound moves to 17; isDsWorld agrees', () => {
    expect(a4UrlOverride('?a4world=16')).toBe(16);
    expect(a4UrlOverride('?a4world=17')).toBeNull();
    expect(a4UrlOverride('?a4world=15')).toBe(15);
    expect(isDsWorld(16)).toBe(true);
    expect(isDsWorld(15)).toBe(false);
    expect(isGkWorld(16)).toBe(false);
    expect(isLnWorld(16)).toBe(false);
    expect(isBqWorld(16)).toBe(false);
    expect(SRC).toContain('?a4world=16` arms that world + 自己的前插');
  });

  it('⭐ the badge carries 16 in BOTH dose forms, and the chip mounts', () => {
    expect(A4_BADGE_TEXTS[16]).toBe(A4_BADGE_TEXT_DS);
    expect(A4_BADGE_TEXTS_EMPTY[16]).toBe(A4_BADGE_TEXT_DS_EMPTY);
    expect(A4_BADGE_TEXT_DS).toBe('🧪 自己的前插 · 剂量成熟');
    expect(A4_BADGE_TEXT_DS_EMPTY).toBe('🧪 自己的前插 · 空账本(全新手)');
    expect(A4_BADGE_TEXT_DS).not.toBe(A4_BADGE_TEXT_DS_EMPTY);
    const badge = new A4WorldBadge({
      createElement: () => ({ className: '', textContent: null as string | null, remove: () => {} }),
      body: { appendChild: () => {} },
    });
    badge.setWorld(16);
    expect(badge.world).toBe(16);
    expect(badge.label).toBe(A4_BADGE_TEXT_DS);
    badge.setWorld(16, A4_BADGE_TEXT_DS_EMPTY);
    expect(badge.label).toBe(A4_BADGE_TEXT_DS_EMPTY);
  });
});

/* ========================================================================== */
/* ⭐⭐ THE HONEST BRIEF — every number a DS-T1c field at 6 dp                  */
/* ========================================================================== */

/**
 * The EMPTY-BOOK (E13) arm's OWN values — the ARM OF RECORD `OWN-E13-ABSENT` against its
 * control `HATS-E13-ABSENT`, `data/ds-t1c-own-run-exam.json`.
 */
const E13_VALUES = [
  '0.588555', '0.253849', '0.431309', // r1.runsPerInPossessionTick + the stored ratio
  '5.860861', '5.306306', // guard.throughBallsPerMatch
  '16.577578', '1.558559', // coupling.arriverSetsPerMatch
  '5.030030', '0.979980', // coupling.cutbackTakenPerMatch
  '0.047234', '0.132072', // own.shotsPerEpisode vs ep.shotsPerEpisode.runner
  '63.429429', '12.384384', // own.episodesPerMatch vs ep.setsPerMatch.runner
  '1.521690', '0.191037', // runCount.mean
  '3.324324', '3.350350', // guard.goalsPerMatch
  '0.582113', '0.586816', // guard.passCompletion
  '27.384384', '25.870871', // guard.interceptionsPerMatch
  '2.478478', '0.167167', // guard.offsidesPerMatch + its resolved-DOWN delta
  '0.119467', // state.runShare.own.ballInFlight — the stale-eyes leak
  '0.439480', '0.449494', // crowd.crashShare
] as const;
/** The MATURE-BOOK (D13) arm's OWN values — `OWN-D13` against `HATS-D13`, MEASURED this time. */
const D13_VALUES = [
  '0.660191', '0.255253', // r1.runsPerInPossessionTick
  '6.811812', '6.301301', // guard.throughBallsPerMatch
] as const;
/** The D13 values the FEED's mature line adds, all of them `OWN-D13`/`HATS-D13` fields. */
const D13_FEED_ONLY = [
  '16.508509', '1.630631', // coupling.arriverSetsPerMatch
  '5.575576', '1.103103', // coupling.cutbackTakenPerMatch
  '0.043998', '0.141444', // own.shotsPerEpisode vs ep.shotsPerEpisode.runner
  '77.058058', '10.622623', // own.episodesPerMatch vs ep.setsPerMatch.runner
  '1.515195', '0.159770', // runCount.mean
  '0.157355', // state.runShare.own.ballInFlight
  '0.477069', '0.465658', // crowd.crashShare
] as const;

describe('W16 — ⭐⭐ THE HONEST BRIEF: the cost first, and each arm under its own heading', () => {
  it('the settings blurb carries the checkbox label and every field it claims', () => {
    expect(SETTINGS).toContain('自己的前插 · 前插是球员自己看着队友排位决定的,教练不再点名 (play-test)');
    for (const v of E13_VALUES) expect(SETTINGS).toContain(v);
    for (const v of D13_VALUES) expect(SETTINGS).toContain(v);
    expect(SETTINGS).toContain('在容差内'); // G9 moved DOWN but INSIDE tolerance, said plainly
    expect(SETTINGS).toContain('没有新常数'); // no new constant, said plainly
    expect(SETTINGS).toContain('?a4world=16');
  });

  it('⭐⭐ THE COST BLOCK OPENS WITH ITS ARM FRAME (GK-ENTRY §CORR 3), and the cost precedes the win', () => {
    expect(SETTINGS).toContain('(以下数字来自 E13 空账本臂,也就是这扇门量过的那一档)');
    const blurb = SETTINGS.split('\n').find((l) => l.includes('自己的前插 —— 前插是球员自己'))!;
    expect(blurb).toBeDefined();
    expect(blurb.indexOf('⚠ 代价说在最前面')).toBeGreaterThan(-1);
    expect(blurb.indexOf('⚠ 代价说在最前面')).toBeLessThan(blurb.indexOf('⭐ 量到的:'));
  });

  it('⭐⭐ THE ARM LABELS ARE ADJACENT TO THE NUMBERS (#387 item 1, in the settings blurb)', () => {
    expect(SETTINGS).toContain('前插人数(成熟账本)0.660191 → 0.255253');
    expect(SETTINGS).toContain('直塞球(成熟账本)6.811812 → 6.301301');
    expect(SETTINGS).toContain('护栏(还是 E13 空账本臂)');
  });

  it('the feed blurb (GameApp) carries the brief in BOTH dose forms', () => {
    expect(APP).toContain('🧪 自己的前插 ON');
    expect(APP).toContain('🧪 自己的前插 · 空账本 ON');
  });

  it('⭐⭐ THE ATTRIBUTION IS PINNED: each arm\'s number under its OWN heading', () => {
    const emptyLine = APP.split('\n').find((l) => l.includes('🧪 自己的前插 · 空账本 ON'))!;
    expect(emptyLine).toBeDefined();
    for (const v of E13_VALUES) expect(emptyLine).toContain(v);
    for (const v of [...D13_VALUES, ...D13_FEED_ONLY]) expect(emptyLine).not.toContain(v);
    const matureLine = APP.split('\n').find(
      (l) => l.includes('🧪 自己的前插 ON') && !l.includes('空账本 ON'),
    )!;
    expect(matureLine).toBeDefined();
    for (const v of [...D13_VALUES, ...D13_FEED_ONLY]) expect(matureLine).toContain(v);
    for (const v of E13_VALUES) expect(matureLine).not.toContain(v);
    // ⭐ THE COST IS SAID BEFORE THE WIN, in both dose forms
    for (const line of [emptyLine, matureLine]) {
      expect(line.indexOf('代价说在最前面')).toBeGreaterThan(-1);
      expect(line.indexOf('代价说在最前面')).toBeLessThan(line.indexOf('⭐ 量到的:'));
      // ⭐ and BOTH lines carry the league-worker caveat AND the eyes' block (GK-ENTRY §CORR 8)
      expect(line).toContain('联赛后台快速模拟的比赛跑的是原版世界');
      expect(line).toContain('你的眼睛要判的');
      expect(line).toContain('?a4world=16 对 ?a4world=15');
    }
  });

  it('the entry doc exists and names its rulings and its exam', () => {
    expect(DOC).toContain('#411');
    expect(DOC).toContain('DS-T1c');
    expect(DOC).toContain('DS-T0c');
  });
});

/* ========================================================================== */
/* DORMANCY and Road B                                                        */
/* ========================================================================== */

describe('W16 — DORMANCY below and Road B', () => {
  it('worlds 1–15 carry NEITHER flag; world 16 carries both (the #411 narrow, positively)', () => {
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      expect(Object.prototype.hasOwnProperty.call(flags, 'dsOwnRun'), `world ${v}`).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(flags, 'dsHatsOff'), `world ${v}`).toBe(false);
    }
    expect((a4MatchFlags(16) as Record<string, unknown>).dsOwnRun).toBe(true);
    expect((a4MatchFlags(16) as Record<string, unknown>).dsHatsOff).toBe(true);
    for (const v of [12, 13, 14, 15] as const) {
      expect(worldMatch(v).dsOwnRun).toBe(false);
      expect(worldMatch(v).dsHatsOff).toBe(false);
    }
  });

  it('a plain League match reads as no world at all', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    const m = league.createMatch(league.nextFixture()!);
    expect(dsArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
    expect(m.dsOwnRun).toBe(false);
    expect(m.dsHatsOff).toBe(false);
  });

  it('the league serializes nothing new (the worker plays the SHIPPED world — canon #283.2(iv))', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(DS_WORLD_VERSION);
    expect(Object.keys(league.toJSON())).not.toContain('matchFlags');
    const serialized = JSON.stringify(league.toJSON());
    expect(serialized).not.toContain('dsOwnRun');
    expect(serialized).not.toContain('dsHatsOff');
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.dsOwnRun).toBe(false);
    expect(simmed.dsHatsOff).toBe(false);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });

  it('⭐ THE DEFAULT LANDING WORLD IS UNCHANGED — the app still starts at 0', () => {
    expect(APP).toContain('private a4World: A4WorldVersion = 0;');
  });
});

/* ========================================================================== */
/* ⭐⭐ THE MUTANT WALK — four mutants, each killed by a NAMED pin              */
/* ========================================================================== */

describe('W16 — ⭐⭐ THE MUTANT WALK: four mutants, each killed', () => {
  it('M1 — ONE door dropped from `DS_WORLD_DOORS` ⇒ the flag set stops matching and 16 reads 0', () => {
    for (const dropped of [{ dsHatsOff: true }, { dsOwnRun: true }] as const) {
      const mutated = { ...a4MatchFlags(GK_WORLD_VERSION), ...dropped };
      expect(mutated).not.toEqual(a4MatchFlags(DS_WORLD_VERSION)); // killed by FIDELITY
      const league = new League({ seed: SCRATCH, matchDuration: 300 });
      league.matchFlags = mutated;
      const m = league.createMatch(league.nextFixture()!);
      armA4World(m, null, DS_WORLD_VERSION);
      expect(dsArmedVersion(m)).toBe(0); // killed by CONTAINMENT
      expect(a4ArmedVersion(m)).toBe(GK_WORLD_VERSION); // …it falls back to what it contains
    }
  });

  it('M2 — the composer calling `a4MatchFlags(14)` instead of 15 ⇒ world 15\'s door is gone', () => {
    const mutated = { ...a4MatchFlags(LN_WORLD_VERSION), ...DS_WORLD_DOORS };
    expect(mutated).not.toEqual(a4MatchFlags(DS_WORLD_VERSION)); // killed by FIDELITY
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = mutated;
    const m = league.createMatch(league.nextFixture()!);
    armA4World(m, null, DS_WORLD_VERSION);
    expect(m.gkDiveBody).toBe(false);
    expect(gkArmedVersion(m)).toBe(0);
    expect(dsArmedVersion(m)).toBe(0); // killed by CONTAINMENT (16 requires 15)
  });

  it('M3 — the URL bound NOT MOVED ⇒ `?a4world=16` would read null', () => {
    expect(a4UrlOverride('?a4world=16')).toBe(16); // killed by THE URL pin
    expect(a4UrlOverride('?a4world=17')).toBeNull();
  });

  it('M4 — `a4ArmedVersion` reading 15 BEFORE 16 ⇒ a world-16 match would name itself 15', () => {
    // the mutant's own read, spelled out: asking 15 first on a world-16 match answers 15
    const sixteen = worldMatch(16);
    expect(gkArmedVersion(sixteen)).toBe(GK_WORLD_VERSION); // …what the mutant would return
    expect(a4ArmedVersion(sixteen)).toBe(DS_WORLD_VERSION); // killed by CONTAINMENT
    expect(SRC.indexOf('const raw16 = dsArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw15 = gkArmedVersion(match);')); // killed by SOURCE ORDER
  });
});

/* ========================================================================== */
/* ⭐⭐ IDENTITY — every world BELOW 16 is byte-identical to the dispatch HEAD  */
/* ========================================================================== */

/** The IDENTITY seeds — scratch, out of band (#411 item 4). */
const IDENTITY_SEEDS = Array.from({ length: 12 }, (_, i) => 900_007_200 + i);

/**
 * ⭐ THE DIGESTS RECORDED AT THE DISPATCH HEAD `0eefb9a`, in a CLEAN throwaway worktree
 * (`git worktree add /tmp/ds-entry-base 0eefb9a`, a symlinked shared `node_modules`,
 * `git status --short` EMPTY), BEFORE a single byte of this rung was written. Each is `sha256`
 * of the twelve per-seed whole-match signatures joined by `|`, each walk armed through the
 * SHIPPED composer (`a4MatchFlags` + `armA4World`) at the ENGINE DEFAULT clock.
 */
const BASELINE_DIGESTS = {
  bare: '062067553ef3ae85f329d3d422b0576e15296471666a0ecb3b6912c40554a8ab',
  world12: '34e882b240967047c746203cadcc39311ddee4a9fe595361365b3daa8ffaeae0',
  world13: '9c9d3117a27192ef31229294ecc050f1e0b5b3a08ca047cc50a8631dc03704e3',
  world14: '0f3887d491099f4a4a17e220d6a63fae929de1af46b45948ae3cf1069e7821cf',
  world15: '2016c431bdadf5401d38ddedf82bd0596b4062986b6eea6ee06ccdbf34c3f4be',
} as const;

const pooledDigest = (version: 0 | 12 | 13 | 14 | 15 | 16): string => createHash('sha256').update(
  IDENTITY_SEEDS.map((seed) => {
    const league = new League({ seed });
    if (version !== 0) league.matchFlags = a4MatchFlags(version);
    const match = league.createMatch(league.nextFixture()!);
    if (version !== 0) armA4World(match, null, version, L3_DOSE, PC_DOSE);
    match.runToCompletion();
    return signature(match);
  }).join('|'),
).digest('hex');

describe('W16 — ⭐⭐ IDENTITY: the shipped world and every world below 16 are byte-identical', () => {
  it('the bare world, 12, 13, 14 and 15 equal their `0eefb9a` digests', () => {
    expect(pooledDigest(0)).toBe(BASELINE_DIGESTS.bare);
    expect(pooledDigest(12)).toBe(BASELINE_DIGESTS.world12);
    expect(pooledDigest(13)).toBe(BASELINE_DIGESTS.world13);
    expect(pooledDigest(14)).toBe(BASELINE_DIGESTS.world14);
    expect(pooledDigest(15)).toBe(BASELINE_DIGESTS.world15);
  }, 900_000);

  it('⭐ NON-VACUOUS: world 16 is a DIFFERENT world from world 15', () => {
    expect(pooledDigest(16)).not.toBe(BASELINE_DIGESTS.world15);
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

const LIVENESS_SEEDS = Array.from({ length: 12 }, (_, i) => 900_007_240 + i);

describe('W16 — ⭐⭐ LIVENESS: the doors BITE (the #402 item 2(iii) form)', () => {
  /**
   * ⚠ THE DEAD-TIME EXEMPTION, STATED (ruling #402 item 2(iii), the G-BITE FORM RULE): a
   * liveness receipt NEVER claims "every seed". A population of full matches contains DEAD
   * TIME in which a flag has nothing to bite — DS-T1c's own frozen `gBite` fired its stored
   * exemption exactly that way (§HONEST LIMITS 14: on one `HATSOWN-E13-KITCHENSINK` seed the
   * armed arm recorded ZERO own-run decisions, so `dsOwnRun` had no candidate to push), and its
   * seat-bite limb read 996/999 rather than 999/999 (§HONEST LIMITS 13). This pin therefore
   * counts how many of twelve scratch seeds bit and asserts AT LEAST ONE — never a universal
   * over a population containing dead time.
   */
  it('world 16 ≠ world 15 on at least ONE of 12 scratch seeds (dead time exempted)', () => {
    let bit = 0;
    for (const seed of LIVENESS_SEEDS) {
      const build = (v: 15 | 16): string => {
        const league = new League({ seed, matchDuration: 300 });
        league.matchFlags = a4MatchFlags(v);
        const m = league.createMatch(league.nextFixture()!);
        armA4World(m, null, v, L3_DOSE, PC_DOSE);
        m.runToCompletion();
        return signature(m);
      };
      if (build(16) !== build(15)) bit += 1;
    }
    expect(bit).toBeGreaterThanOrEqual(1);
  }, 900_000);
});
