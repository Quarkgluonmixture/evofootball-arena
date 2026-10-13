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
  BQ_WORLD_VERSION, DS2_WORLD_VERSION, DS_WORLD_VERSION, GK_WORLD_VERSION, IF_WORLD_VERSION,
  LN_WORLD_VERSION, LN_WORLD_WEIGHT, OP_WORLD_DOORS, OP_WORLD_VERSION, a4ArmedVersion,
  a4MatchFlags, a4UrlOverride, armA4World, bqArmedVersion, ds2ArmedVersion, dsArmedVersion,
  gkArmedVersion, ifArmedVersion, isDs2World, isIfWorld, isOpWorld, lnArmedVersion,
  opArmedVersion, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_OP, A4_BADGE_TEXT_OP_EMPTY, A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../src/ui/A4WorldBadge';

/**
 * ⭐⭐ THE OP ENTRY — `?a4world=19` (身前贴着的人要算进去, the TWO front-man doors at OP-T1b's
 * arm of record `W18-D+OP+OC`). Ruling #437 item 4; docs/world-model/OP-ENTRY-RUNG.md. The
 * NINETEENTH entry of the play-test family, written in `tests/ifPlaytestEntry.test.ts`'s form.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 19 IS world 18 plus EXACTLY the TWO doors `{ opFrontMan,
 *       opFrontChooser }`, and it says so by CALLING the world-18 composition. ⛔ NOTHING ELSE
 *       rides along; NO DOSE, NO GENE, NO CONSTANT, so `armOpWorld` is `armIfWorld` CALLED and
 *       nothing more. ⭐⭐⭐ THE DOOR SET is the EXAM'S, in two halves: (a) OP-T1b's own
 *       construction re-run here reproduces its STORED per-seed whole-match signatures for
 *       `W18-D+OP+OC` AND `W18-E+OP+OC` on its first twelve battery seeds (consumed; not a
 *       consumption; same host ⇒ exact), and (b) `a4MatchFlags(18)` + the two flags gives
 *       whole-match signatures IDENTICAL to `a4MatchFlags(19)`'s on six scratch seeds.
 *   (2) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 19 → 18 → 17 → …: 19 only if 18's reader
 *       says 18 AND BOTH flags are true. ONE door alone is world 18; the two doors on world 17's
 *       substrate are not 19.
 *   (3) ⭐ THE URL parses 19 and the bound moves to 20; the badge carries 19 in BOTH dose forms.
 *   (4) ⭐⭐ THE HONEST BRIEF — every 6-dp numeral on each surface is an OP-T1b FIELD read from
 *       the artifact BY FIELD AND BY ARM (D = the arm of record under its own heading; E beside
 *       under its own — the #387 item 1 class), THE COST BEFORE THE WIN, and the honesty line on
 *       every surface. ⛔ ZERO untraceable numerals, ⛔ ZERO cross-arm numbers.
 *   (5) ⭐⭐ IDENTITY BELOW 19, ARCH-KEYED (#418 item 2(ii)) — pooled whole-match digests for the
 *       bare world and worlds 12…18 on the family IDENTITY band. The x64 column was RECORDED at
 *       the dispatch HEAD `4cf854f` in process on the clean tree (the #433 LOW 2 precedent),
 *       after the same recorder first reproduced `ifPlaytestEntry`'s seven x64 literals; the
 *       arm64 column is INHERITED BY IDENTITY from `tests/ds2PlaytestEntry.test.ts` for bare ·
 *       12 · 13 · 14 · 15 · 16, and worlds 17 and 18 are ABSENT on arm64 (skip by title).
 *   (6) DORMANCY — worlds 1–18 carry neither door; a plain League match reads as no world;
 *       `League.toJSON` omits matchFlags.
 *   (7) ⭐⭐ LIVENESS — world 19 differs from 18, and from each one-door world, in whole matches
 *       — and THE MUTANT WALK: four mutants killed.
 *
 * ⚠ SEEDS: OUT-OF-BAND SCRATCH ONLY — the family IDENTITY band 900,007,200–211 (re-used on
 * purpose, #437 item 4(iii)/(ix)) and this executor's own block 900,010,800–899 from the ONE
 * declared base `SCRATCH_BASE`; zero frontier consumption, ZERO sims of record. The ONE
 * exception is OP-T1b's OWN battery band 12,566,000–011, consumed WHOLE by the exam, which item
 * 4(ii)(a) names for the door-set pin — re-walking a consumed seed reads no new frontier.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/OP-ENTRY-RUNG.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

/** ⭐ THE ONE DECLARED BASE of this executor's scratch block 900,010,800–899 (#437 item 4(ix)). */
const SCRATCH_BASE = 900_010_800;
const SCRATCH = SCRATCH_BASE + 30;

type W = 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (version: W, dosed = true, seed = SCRATCH): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = a4MatchFlags(version);
  const match = league.createMatch(league.nextFixture()!);
  armA4World(match, null, version, dosed ? L3_DOSE : null, dosed ? PC_DOSE : null);
  return match;
};

/** A world-18 substrate with extra construction flags, armed as `armAs` (the one-door worlds). */
const withFlags = (
  base: W, extra: Record<string, boolean>, armAs: W, seed = SCRATCH, dosed = true,
): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = { ...a4MatchFlags(base), ...extra };
  const match = league.createMatch(league.nextFixture()!);
  armA4World(match, null, armAs, dosed ? L3_DOSE : null, dosed ? PC_DOSE : null);
  return match;
};

const genomeOf = (m: Match, side: 0 | 1, view: 'base' | 'eff' | 'info'): TacticalGenome =>
  (view === 'base' ? m.teams[side].baseGenome
    : view === 'eff' ? m.teams[side].effGenome
      : m.teams[side].info.genome) as TacticalGenome;

/** THE WHOLE-MATCH SIGNATURE, field for field the `ifPlaytestEntry.test.ts` helper. */
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

describe('W19 — ⭐ FIDELITY: world 18 plus TWO doors, no gene, no constant, no dose', () => {
  it('world 19 is `a4MatchFlags(18)` ∪ { opFrontMan, opFrontChooser }, key for key', () => {
    expect(OP_WORLD_VERSION).toBe(19);
    const flags = a4MatchFlags(OP_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(IF_WORLD_VERSION), ...OP_WORLD_DOORS });
    expect(OP_WORLD_DOORS).toEqual({ opFrontMan: true, opFrontChooser: true });
    const eighteen = a4MatchFlags(IF_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in eighteen)).sort())
      .toEqual(['opFrontChooser', 'opFrontMan']);
    for (const k of Object.keys(eighteen)) expect(flags[k]).toBe(eighteen[k]);
  });

  it('⛔ NOTHING ELSE RIDES ALONG: no OBM, no CTB, no RC, no BF, no EDS touch cost, no OBM gene', () => {
    const KEYS = ['obmMovement', 'ctbSupportPlane', 'rcAnticipate', 'rcReady', 'bfFacingCost',
      'edsTouchCost'] as const;
    for (const v of [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      for (const k of KEYS) expect(flags[k]).toBeFalsy();
    }
    const m = worldMatch(19);
    for (const k of KEYS) expect((m as unknown as Record<string, unknown>)[k]).toBeFalsy();
    for (const side of [0, 1] as const) {
      for (const view of ['base', 'eff', 'info'] as const) {
        expect((genomeOf(m, side, view) as unknown as Record<string, unknown>)
          .offballMovementWeights).toBeUndefined();
      }
    }
  });

  it('⭐⭐ the composition is CALLED, not copied; the arming IS world 18\'s, called, and NOTHING more', () => {
    expect(SRC).toContain('return { ...a4MatchFlags(IF_WORLD_VERSION), ...OP_WORLD_DOORS };');
    expect(SRC).toContain('): void {\n  armIfWorld(match, l3Dose, pcDose);\n}');
    // ⛔ NO GENE AND NO CONSTANT: the entry layer names no OP weight and no OP gene setter
    expect(SRC).not.toContain('setOpGene');
    expect(SRC).not.toContain('OP_WORLD_WEIGHT');
    // ⭐ AND THE CONTAINMENT READ CALLS THE WORLD BELOW — it re-reads no flag of world 18
    expect(SRC).toContain('  if (ifArmedVersion(match) !== IF_WORLD_VERSION) return 0;');
    const m = worldMatch(19);
    expect(m.opFrontMan).toBe(true);
    expect(m.opFrontChooser).toBe(true);
    expect(m.ifFlightRun).toBe(true);
    expect(m.dsCoopHatsOff).toBe(true);
    expect(m.dsOwnRun).toBe(true);
    expect(m.dsHatsOff).toBe(true);
    expect(m.gkDiveBody).toBe(true);
    expect(m.lnOwnLanePrice).toBe(true);
    expect(m.bqCushion).toBe(true);
    for (const side of [0, 1] as const) {
      // ⭐ world 14's ONE pin rides in from the CALL, on BOTH dosed views, never on info.genome
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(LN_WORLD_WEIGHT);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(opArmedVersion(m)).toBe(OP_WORLD_VERSION);
    expect(ifArmedVersion(m)).toBe(IF_WORLD_VERSION);
    expect(ds2ArmedVersion(m)).toBe(DS2_WORLD_VERSION);
    expect(dsArmedVersion(m)).toBe(DS_WORLD_VERSION);
    expect(gkArmedVersion(m)).toBe(GK_WORLD_VERSION);
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(m)).toBe(BQ_WORLD_VERSION);
  });

  it('⭐ both doors and the inherited gene survive to FULL TIME; `info.genome` stays clean', () => {
    const m = worldMatch(19, true, SCRATCH_BASE + 31);
    m.runToCompletion();
    expect(m.opFrontMan).toBe(true);
    expect(m.opFrontChooser).toBe(true);
    expect(m.ifFlightRun).toBe(true);
    for (const side of [0, 1] as const) {
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(LN_WORLD_WEIGHT);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(opArmedVersion(m)).toBe(OP_WORLD_VERSION);
    expect(a4ArmedVersion(m)).toBe(OP_WORLD_VERSION);
  }, 120_000);
});

/* ========================================================================== */
/* ⭐⭐⭐ THE DOOR-SET IDENTITY WITH THE EXAM                                    */
/* ========================================================================== */

/** OP-T1b's own team builder (`scripts/probes/op-t1b-front-chooser-exam.ts` `teamInfo`, character
 *  for character — DS-C0's, inherited unchanged through the arc). */
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
 * ⭐⭐ THE EXAM'S OWN SIGNATURE RECIPE — `op-t1b-front-chooser-exam.ts` `signatureOf`, field for
 * field. It differs from this family's by ONE field (`action.type`), so it is written out here:
 * a pin that reproduces a stored value has to use the recipe that produced it.
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
 * ⭐⭐ THE EXAM'S WAY — `op-t1b-front-chooser-exam.ts` `buildMatch` for the two both-door arms:
 * `a4MatchFlags(18)` + `opFrontMan` + `opFrontChooser` in the CONSTRUCTOR's flags, then
 * `armA4World(m, null, 18, L3, PC)` (D, the dosed arm) or `armA4World(m, null, 18)` (E, the
 * empty book). Walked by the exam's own unobserved loop (its `gLockstep` proves observed ≡
 * unobserved byte for byte per arm).
 */
const examWay = (seed: number, dosed: boolean): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(IF_WORLD_VERSION),
    ...{ opFrontMan: true },
    ...{ opFrontChooser: true },
  } as ConstructorParameters<typeof Match>[0]);
  if (dosed) armA4World(m, null, IF_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, IF_WORLD_VERSION);
  return m;
};

/** OP-T1b's first twelve battery seeds — its own consumed band (#437 item 4(ii)(a)/(ix)). */
const EXAM_SEEDS = Array.from({ length: 12 }, (_, i) => 12_566_000 + i);

/** ⚠ The OP-T1b artifact sits at its CANONICAL path (`allGreen` a stored `true`). It is never
 *  moved, renamed or copied. */
const ARTIFACT_PATH = 'docs/world-model/data/op-t1b-front-chooser-exam.json';

interface Band {
  id: string; controlLevel: number; armLevel: number; delta: number; ci: [number, number];
  absDeltaOverTolerance: number; resolved: boolean; breach: boolean;
}
interface FaceDelta {
  controlValue: number; armValue: number; delta: number; lo: number; hi: number; resolved: boolean;
}
interface Fix {
  controlLevel: number; armLevel: number; delta: number; ci: [number, number]; resolved: boolean;
  fixes: boolean;
}
interface Artifact {
  stage: { arch: string };
  allGreen: boolean;
  perSeedCells: ({ seed: number } & Record<string, { signature: string }>)[];
  bands: Record<string, { g: Band[]; s: Band[] }>;
  winTable: { fixes: Record<string, Fix> };
  frontMan: { deltas: Record<string, Record<string, FaceDelta>> };
  deltas: Record<string, Record<string, FaceDelta>>;
  chooserSeat: { levels: Record<string, Record<string, { value: number }>> };
  selectors: Record<string, { holdsBands: boolean; fixes: boolean; breachSet: string[] }>;
  reads: { comparisonOfRecord: string; word: string; sentence: string };
}

const ART = JSON.parse(repoText(ARTIFACT_PATH)) as Artifact;

describe('W19 — ⭐⭐⭐ THE DOOR SET IS OP-T1b\'s, PROVEN IN TWO HALVES', () => {
  // ARCH-KEYED (#418 item 2(ii)): the stored signatures are the RECORDING host's (x64); on any other arch the
  // float trajectory differs by construction, so this half SKIPS there (#439 — caught by the macOS deploy run).
  it.skipIf(process.arch !== ART.stage.arch)('(a) the exam\'s construction reproduces its OWN stored `W18-D+OP+OC` and `W18-E+OP+OC` signatures (x64 recording host only — SKIPPED on arm64)', () => {
    expect(ART.stage.arch).toBe('x64'); // same host ⇒ exact (#437 item 4(ii)(a))
    const stored = new Map(ART.perSeedCells.map((row) => [row.seed, row] as const));
    let reproduced = 0;
    for (const seed of EXAM_SEEDS) {
      const row = stored.get(seed);
      expect(row, `seed ${seed} is in the artifact`).toBeDefined();
      for (const [arm, dosed] of [['W18-D+OP+OC', true], ['W18-E+OP+OC', false]] as const) {
        const want = row![arm].signature;
        expect(want, `${arm} @ ${seed}`).toBeTypeOf('string');
        const m = examWay(seed, dosed);
        while (!m.finished) m.step(DT);
        expect(examSignature(m), `${arm} @ ${seed}`).toBe(want);
        expect(opArmedVersion(m)).toBe(OP_WORLD_VERSION); // the exam's arm IS world 19's door set
        reproduced += 1;
      }
    }
    expect(reproduced).toBe(24);
  }, 900_000);

  it('(b) `a4MatchFlags(18)` + the two flags ≡ `a4MatchFlags(19)`, whole-match, on 6 scratch seeds', () => {
    expect({ ...a4MatchFlags(IF_WORLD_VERSION), opFrontMan: true, opFrontChooser: true })
      .toEqual(a4MatchFlags(OP_WORLD_VERSION));
    const SEEDS = Array.from({ length: 6 }, (_, i) => SCRATCH_BASE + 20 + i);
    for (const seed of SEEDS) {
      const build = (spread: boolean): Match => {
        const league = new League({ seed, matchDuration: 300 });
        league.matchFlags = spread
          ? { ...a4MatchFlags(IF_WORLD_VERSION), opFrontMan: true, opFrontChooser: true }
          : a4MatchFlags(OP_WORLD_VERSION);
        const m = league.createMatch(league.nextFixture()!);
        armA4World(m, null, OP_WORLD_VERSION, L3_DOSE, PC_DOSE);
        return m;
      };
      const a = build(true);
      const b = build(false);
      expect(signature(b)).toBe(signature(a));
      a.runToCompletion();
      b.runToCompletion();
      expect(signature(b)).toBe(signature(a));
      expect(opArmedVersion(a)).toBe(OP_WORLD_VERSION);
      expect(opArmedVersion(b)).toBe(OP_WORLD_VERSION);
    }
  }, 600_000);
});

/* ========================================================================== */
/* ⭐⭐ CONTAINMENT, THE URL BOUND AND THE BADGE                                */
/* ========================================================================== */

describe('W19 — ⭐⭐ CONTAINMENT, the URL bound and the badge', () => {
  it('⭐⭐ the version value is containment-ordered: 19 names itself 19; 18 stays 18', () => {
    const nineteen = worldMatch(19);
    expect(opArmedVersion(nineteen)).toBe(OP_WORLD_VERSION);
    expect(a4ArmedVersion(nineteen)).toBe(OP_WORLD_VERSION); // ⛔ never 18
    expect(ifArmedVersion(nineteen)).toBe(IF_WORLD_VERSION);
    expect(ds2ArmedVersion(nineteen)).toBe(DS2_WORLD_VERSION);
    const eighteen = worldMatch(18);
    expect(opArmedVersion(eighteen)).toBe(0);
    expect(a4ArmedVersion(eighteen)).toBe(IF_WORLD_VERSION); // ⛔ never 19
    for (const v of [12, 13, 14, 15, 16, 17] as const) expect(opArmedVersion(worldMatch(v))).toBe(0);
    // the EMPTY-BOOK form is the same world 19
    expect(a4ArmedVersion(worldMatch(19, false))).toBe(OP_WORLD_VERSION);
    // ⭐ ONE DOOR ALONE IS NOT WORLD 19 — either flag alone on world 18 reads 18 (mutant M2's home)
    for (const one of [{ opFrontMan: true }, { opFrontChooser: true }] as Record<string, boolean>[]) {
      const m = withFlags(18, one, OP_WORLD_VERSION);
      expect(opArmedVersion(m), JSON.stringify(one)).toBe(0);
      expect(a4ArmedVersion(m), JSON.stringify(one)).toBe(IF_WORLD_VERSION);
    }
    // ⭐ THE TWO DOORS WITHOUT WORLD 18 ARE NOT WORLD 19: on world 17's substrate they read 0
    const lonely = withFlags(17, { opFrontMan: true, opFrontChooser: true }, OP_WORLD_VERSION);
    expect(lonely.opFrontMan && lonely.opFrontChooser).toBe(true);
    expect(opArmedVersion(lonely)).toBe(0);
    expect(a4ArmedVersion(lonely)).toBe(DS2_WORLD_VERSION);
    // ⭐ THE SOURCE ORDER itself: 19 is asked BEFORE 18
    expect(SRC.indexOf('const raw19 = opArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw18 = ifArmedVersion(match);'));
    expect(SRC).toContain(
      '  return match.opFrontMan === true && match.opFrontChooser === true ? OP_WORLD_VERSION : 0;');
  });

  it('⭐ the URL parses 19 and the bound moves to 20; isOpWorld agrees', () => {
    expect(a4UrlOverride('?a4world=19')).toBe(19);
    expect(a4UrlOverride('?a4world=20')).toBeNull();
    expect(a4UrlOverride('?a4world=18')).toBe(18);
    expect(isOpWorld(19)).toBe(true);
    expect(isOpWorld(18)).toBe(false);
    expect(isIfWorld(19)).toBe(false);
    expect(isDs2World(19)).toBe(false);
    expect(SRC).toContain('`?a4world=19` arms that world +');
  });

  it('⭐ the badge carries 19 in BOTH dose forms, and the chip mounts', () => {
    expect(A4_BADGE_TEXTS[19]).toBe(A4_BADGE_TEXT_OP);
    expect(A4_BADGE_TEXTS_EMPTY[19]).toBe(A4_BADGE_TEXT_OP_EMPTY);
    expect(A4_BADGE_TEXT_OP).toBe('🧪 身前贴着的人要算进去 · 剂量成熟');
    expect(A4_BADGE_TEXT_OP_EMPTY).toBe('🧪 身前贴着的人要算进去 · 空账本(全新手)');
    const badge = new A4WorldBadge({
      createElement: () => ({ className: '', textContent: null as string | null, remove: () => {} }),
      body: { appendChild: () => {} },
    });
    badge.setWorld(19);
    expect(badge.world).toBe(19);
    expect(badge.label).toBe(A4_BADGE_TEXT_OP);
    badge.setWorld(19, A4_BADGE_TEXT_OP_EMPTY);
    expect(badge.label).toBe(A4_BADGE_TEXT_OP_EMPTY);
  });
});

/* ========================================================================== */
/* ⭐⭐ THE HONEST BRIEF — every numeral an OP-T1b field, BY FIELD AND BY ARM   */
/* ========================================================================== */

const six = (x: number): string => Math.abs(x).toFixed(6);
const bandOf = (c: string, id: string): Band =>
  [...ART.bands[c].g, ...ART.bands[c].s].find((r) => r.id === id)!;
const faceOf = (c: string, face: string): FaceDelta => ART.deltas[c][face];
const seatOf = (arm: string, face: string): number => ART.chooserSeat.levels[arm][face].value;

type Row = readonly [string, string, string];
/** a band limb printed in full: control → arm, Δ, interval, |Δ| ÷ tolerance */
const bandRows = (c: string, id: string): Row[] => {
  const b = bandOf(c, id);
  return [
    [`bands.${id}.controlLevel`, c, six(b.controlLevel)],
    [`bands.${id}.armLevel`, c, six(b.armLevel)],
    [`bands.${id}.delta`, c, six(b.delta)],
    [`bands.${id}.ci[0]`, c, six(b.ci[0])],
    [`bands.${id}.ci[1]`, c, six(b.ci[1])],
    [`bands.${id}.absDeltaOverTolerance`, c, six(b.absDeltaOverTolerance)],
  ];
};
/** a face printed in full: control → arm, Δ, interval */
const faceRows = (c: string, face: string, src: 'deltas' | 'frontMan' = 'deltas'): Row[] => {
  const f = src === 'deltas' ? faceOf(c, face) : ART.frontMan.deltas[c][face];
  return [
    [`${src}.${face}.controlValue`, c, six(f.controlValue)],
    [`${src}.${face}.armValue`, c, six(f.armValue)],
    [`${src}.${face}.delta`, c, six(f.delta)],
    [`${src}.${face}.lo`, c, six(f.lo)],
    [`${src}.${face}.hi`, c, six(f.hi)],
  ];
};
const fixRows = (c: string): Row[] => {
  const f = ART.winTable.fixes[c];
  return [
    ['winTable.fixes.controlLevel', c, six(f.controlLevel)],
    ['winTable.fixes.armLevel', c, six(f.armLevel)],
    ['winTable.fixes.delta', c, six(f.delta)],
    ['winTable.fixes.ci[0]', c, six(f.ci[0])],
    ['winTable.fixes.ci[1]', c, six(f.ci[1])],
  ];
};

/**
 * ⭐⭐ THE TRACE TABLE — [the field, the ARM / contrast it is read under, the token]. Every token is
 * COMPUTED from the artifact here, never typed: a mistyped numeral on a surface dies because the
 * token this table produces is the field's own `toFixed(6)`.
 */
const C_D = 'W18-D+OP+OC|W18-D';
const C_E = 'W18-E+OP+OC|W18-E';
const D_TRACE: Row[] = [
  ['chooserSeat.repricedShareOfCalls', 'W18-D+OP+OC', six(seatOf('W18-D+OP+OC', 'chooserSeat.repricedShareOfCalls'))],
  ['chooserSeat.changedShareOfCalls', 'W18-D+OP+OC', six(seatOf('W18-D+OP+OC', 'chooserSeat.changedShareOfCalls'))],
  ...bandRows(C_D, 'G1'), ...bandRows(C_D, 'G2'), ...bandRows(C_D, 'G3'), ...bandRows(C_D, 'G5'),
  ...bandRows(C_D, 'G7'), ...bandRows(C_D, 'G8'), ...bandRows(C_D, 'S3'), ...bandRows(C_D, 'S4'),
  ...faceRows(C_D, 'stuck.pressedMix.pass'), ...faceRows(C_D, 'stuck.pressedMix.dribble'),
  ...faceRows(C_D, 'stuck.possessionMeanTicks'), ...faceRows(C_D, 'stuck.meanGroundPassLengthMetres'),
  ...fixRows(C_D),
  ...faceRows(C_D, 'front.manFirst', 'frontMan'),
  // 「两扇门单开」 — the two one-door contrasts of the SAME dosed surface, printed beside
  ...fixRows('W18-D+OP|W18-D'), ...fixRows('W18-D+OC|W18-D'),
];
const E_TRACE: Row[] = [
  ['chooserSeat.repricedShareOfCalls', 'W18-E+OP+OC', six(seatOf('W18-E+OP+OC', 'chooserSeat.repricedShareOfCalls'))],
  ['chooserSeat.changedShareOfCalls', 'W18-E+OP+OC', six(seatOf('W18-E+OP+OC', 'chooserSeat.changedShareOfCalls'))],
  ...bandRows(C_E, 'G1'), ...bandRows(C_E, 'G2'), ...bandRows(C_E, 'G7'), ...bandRows(C_E, 'G9'),
  ...bandRows(C_E, 'S3'), ...bandRows(C_E, 'S4'),
  ...faceRows(C_E, 'stuck.pressedMix.pass'), ...faceRows(C_E, 'stuck.pressedMix.dribble'),
  ...faceRows(C_E, 'stuck.meanGroundPassLengthMetres'),
  ...fixRows(C_E),
  ...faceRows(C_E, 'front.manFirst', 'frontMan'),
];
const D_TOKENS = new Set(D_TRACE.map((r) => r[2]));
const E_TOKENS = new Set(E_TRACE.map((r) => r[2]));
const SHARED_TOKENS = new Set([...D_TOKENS].filter((t) => E_TOKENS.has(t)));

const numerals = (s: string): string[] => s.match(/\d+\.\d{6}/g) ?? [];
const lineOf = (text: string, needle: string): string =>
  text.split('\n').find((l) => l.includes(needle))!;

const EMPTY_LINE = lineOf(APP, '🧪 身前贴着的人要算进去 · 空账本 ON');
const MATURE_LINE = APP.split('\n').find(
  (l) => l.includes('🧪 身前贴着的人要算进去 ON') && !l.includes('空账本 ON'),
)!;
const BLURB = lineOf(SETTINGS, '身前贴着的人要算进去 —— 传不传、传给谁');

/** ⭐⭐ THE HONESTY LINE — #437 item 4(vi)'s own words ("the table seeing little ≠ the eye seeing
 *  nothing"), rendered in plain Chinese, on EVERY surface. */
const HONESTY = '这块表看到的很少,不等于眼睛什么也看不到——这道门就是请你的眼睛来判';

describe('W19 — ⭐⭐ THE HONEST BRIEF: the cost first, each arm under its own heading', () => {
  it('the stored read IS read 1 on the comparison of record, and the band holds on both pairs', () => {
    expect(ART.allGreen).toBe(true);
    expect(ART.reads.comparisonOfRecord).toBe(C_D);
    expect(ART.reads.word).toBe('read1');
    expect(ART.reads.sentence).toContain('OP-ENTRY is named (world 19 = 18 + opFrontMan + opFrontChooser)');
    for (const c of [C_D, C_E]) {
      expect(ART.selectors[c].holdsBands, c).toBe(true);
      expect(ART.selectors[c].breachSet, c).toEqual([]);
    }
    expect(ART.selectors[C_D].fixes).toBe(true);
    expect(ART.selectors[C_E].fixes).toBe(false); // ⚠ the empty book did NOT fix — said on the surface
  });

  it('the three surfaces exist and carry the honesty line, the comparison and the league-worker caveat', () => {
    for (const s of [EMPTY_LINE, MATURE_LINE, BLURB]) {
      expect(s).toBeDefined();
      expect(s).toContain(HONESTY);
      expect(s).toContain('联赛后台快速模拟的比赛跑的是原版世界');
      expect(s).toContain('你的眼睛要判的:身前贴着人的时候,他还会不会硬往那人身上传?被逼抢时是不是更多选择带球——带得像样吗?进球是不是少了、少得让人难受吗?');
      expect(s).toContain('?a4world=19 对 ?a4world=18');
      expect(s).toContain('?a4world=19&pcdose=0');
      expect(s).toContain('别期待看到“他不再往身前那个人身上传”');
    }
    expect(SETTINGS).toContain('身前贴着的人要算进去 · 传不传、传给谁,都把球前面贴着的那个对手算进去 (play-test)');
    // ⭐ the badge carries the name and the dose form and NO numeral (a chip is a few characters)
    expect(numerals(A4_BADGE_TEXT_OP)).toEqual([]);
    expect(numerals(A4_BADGE_TEXT_OP_EMPTY)).toEqual([]);
  });

  it('⭐⭐ THE COST IS SAID BEFORE THE WIN on all three surfaces', () => {
    for (const s of [EMPTY_LINE, MATURE_LINE, BLURB]) {
      expect(s.indexOf('这一步造了什么')).toBeGreaterThan(-1);
      expect(s.indexOf('代价说在最前面')).toBeGreaterThan(s.indexOf('这一步造了什么'));
      expect(s.indexOf('代价说在最前面')).toBeLessThan(s.indexOf('⭐ 量到的'));
      expect(s.indexOf('⭐ 量到的')).toBeLessThan(s.indexOf('别期待'));
      expect(s.indexOf('别期待')).toBeLessThan(s.indexOf('你的眼睛要判的'));
    }
    // ⭐ and inside the cost, #437 item 4(vi)'s order: goals, shots, the pressed mix, then S3
    for (const s of [MATURE_LINE, BLURB]) {
      const g1 = bandOf(C_D, 'G1');
      const goals = s.indexOf(`${six(g1.controlLevel)} → ${six(g1.armLevel)}`);
      const shots = s.indexOf(`${six(bandOf(C_D, 'G2').controlLevel)} → `);
      const mix = s.indexOf(`${six(faceOf(C_D, 'stuck.pressedMix.pass').controlValue)} → `);
      const s3 = s.indexOf(`${six(bandOf(C_D, 'S3').controlLevel)} → `);
      const win = s.indexOf(`${six(ART.winTable.fixes[C_D].controlLevel)} → `);
      expect(goals).toBeGreaterThan(s.indexOf('代价说在最前面'));
      expect(goals).toBeLessThan(shots);
      expect(shots).toBeLessThan(mix);
      expect(mix).toBeLessThan(s3);
      expect(s3).toBeLessThan(win);
      expect(win).toBeGreaterThan(s.indexOf('⭐ 量到的'));
    }
  });

  it('⭐⭐⭐ EVERY 6-dp NUMERAL ON EVERY SURFACE IS AN ARTIFACT FIELD UNDER THE ARM IT CLAIMS', () => {
    const untraced = (s: string, allowed: Set<string>): string[] =>
      [...new Set(numerals(s))].filter((t) => !allowed.has(t));
    expect(untraced(MATURE_LINE, D_TOKENS)).toEqual([]);
    expect(untraced(EMPTY_LINE, E_TOKENS)).toEqual([]);
    expect(untraced(BLURB, new Set([...D_TOKENS, ...E_TOKENS]))).toEqual([]);
    // …and the brief is not empty: the counts are the receipt
    expect(numerals(MATURE_LINE).length).toBeGreaterThanOrEqual(60);
    expect(numerals(EMPTY_LINE).length).toBeGreaterThanOrEqual(35);
    expect(numerals(BLURB).length).toBeGreaterThanOrEqual(80);
  });

  it('⭐⭐ ZERO CROSS-ARM NUMBERS on the two feed lines (the #387 item 1 class)', () => {
    // the two arms share NO token at all — nothing to exempt
    expect([...SHARED_TOKENS]).toEqual([]);
    expect([...E_TOKENS].filter((t) => MATURE_LINE.includes(t))).toEqual([]);
    expect([...D_TOKENS].filter((t) => EMPTY_LINE.includes(t))).toEqual([]);
  });

  it('⭐⭐ THE ARM LABELS ARE ADJACENT TO THE NUMBERS', () => {
    expect(MATURE_LINE).toContain('成熟账本,OP-T1b 的 D 臂,也就是记录在案的那一臂');
    expect(EMPTY_LINE).toContain('下面的数全是 OP-T1b 的 E 臂自己的,各报各的');
    expect(BLURB).toContain('⚠ 代价说在最前面(以下数字来自 D 臂——成熟账本,也就是你默认玩的、记录在案的那一臂)');
    expect(BLURB).toContain('⭐ 量到的(还是 D 臂)');
    expect(BLURB).toContain('⭐⭐ 空账本那一档(E 臂,?a4world=19&pcdose=0)也量过,各报各的数');
    // every E numeral in the blurb sits AFTER the E heading and behind a 「(空账本)」 label
    const eHead = BLURB.indexOf('⭐⭐ 空账本那一档');
    const eEnd = BLURB.indexOf('⚠ 别期待的几件事');
    const eOnly = [...E_TOKENS];
    for (const t of eOnly) {
      const at = BLURB.indexOf(t);
      if (at === -1) continue;
      expect(at, t).toBeGreaterThan(eHead);
      expect(at, t).toBeLessThan(eEnd);
    }
    expect((BLURB.slice(eHead, eEnd).match(/\(空账本\)/g) ?? []).length).toBeGreaterThanOrEqual(6);
  });

  it('⭐ THE COST FACES #437 item 4(vi) NAMED ARE ON THE SURFACE, with their fields', () => {
    const g1 = bandOf(C_D, 'G1');
    // goals per match 2.866867 → 2.664665, resolved, inside the band — with |Δ| ÷ tolerance
    expect(g1.resolved).toBe(true);
    expect(g1.breach).toBe(false);
    for (const s of [MATURE_LINE, BLURB]) {
      expect(s).toContain(`${six(g1.controlLevel)} → ${six(g1.armLevel)}`);
      expect(s).toContain(`[−${six(g1.ci[0])}, −${six(g1.ci[1])}] 不含零`);
      expect(s).toContain(`用掉容差的 ${six(g1.absDeltaOverTolerance)}(护栏没破,但这是动得最大的一条)`);
      expect(s).toContain('射门少了');
      expect(s).toContain('被逼抢的持球人传得少了、带得多了');
      expect(s).toContain('一脚没传就结束的球权多了');
    }
    // ⭐ the largest resolved |Δ| ÷ tolerance on the record pair IS goals — the surface's claim
    const resolved = [...ART.bands[C_D].g, ...ART.bands[C_D].s].filter((b) => b.resolved);
    const top = resolved.reduce((a, b) => (b.absDeltaOverTolerance > a.absDeltaOverTolerance ? b : a));
    expect(top.id).toBe('G1');
    // ⭐ every RESOLVED band limb of the record pair is printed with its interval and its ratio
    for (const b of resolved) {
      for (const s of [MATURE_LINE, BLURB]) {
        expect(s, b.id).toContain(six(b.absDeltaOverTolerance));
        expect(s, b.id).toContain(six(b.ci[0]));
        expect(s, b.id).toContain(six(b.ci[1]));
      }
    }
    expect(resolved.map((b) => b.id).sort()).toEqual(['G1', 'G2', 'G3', 'G5', 'G7', 'G8', 'S3']);
    // ⭐ and on the empty book every resolved limb is printed too
    const eResolved = [...ART.bands[C_E].g, ...ART.bands[C_E].s].filter((b) => b.resolved);
    expect(eResolved.map((b) => b.id).sort()).toEqual(['G7', 'G9']);
    for (const b of eResolved) {
      for (const s of [EMPTY_LINE, BLURB]) expect(s, b.id).toContain(six(b.absDeltaOverTolerance));
    }
    // the win: about one ground pass in 190, with the arithmetic beside
    const fix = ART.winTable.fixes[C_D];
    expect(fix.fixes).toBe(true);
    const inv = (1 / Number(six(fix.delta))).toFixed(2);
    for (const s of [MATURE_LINE, BLURB]) {
      expect(s).toContain(`${six(fix.controlLevel)} → ${six(fix.armLevel)}`);
      expect(s).toContain('大约每 190 次地面传球少 1 次传到对面身上');
      expect(s).toContain(`1 ÷ ${six(fix.delta)} = ${inv}`);
    }
    expect(inv).toBe('191.46');
  });

  it('⚠ 别期待 — the mechanism\'s own face did not move; neither door alone; E the other way', () => {
    const mf = ART.frontMan.deltas[C_D]['front.manFirst'];
    expect(mf.resolved).toBe(false);
    expect(mf.lo).toBeLessThan(0);
    expect(mf.hi).toBeGreaterThan(0);
    for (const s of [MATURE_LINE, BLURB]) {
      expect(s).toContain(`${six(mf.controlValue)} → ${six(mf.armValue)}`);
      expect(s).toContain('身前那个人还是一样常是第一个碰到球的人');
      expect(s).toContain('两扇门单开都量不出来');
    }
    for (const c of ['W18-D+OP|W18-D', 'W18-D+OC|W18-D']) {
      expect(ART.winTable.fixes[c].resolved, c).toBe(false);
      for (const s of [MATURE_LINE, BLURB]) expect(s, c).toContain(six(ART.winTable.fixes[c].delta));
    }
    const fe = ART.winTable.fixes[C_E];
    expect(fe.resolved).toBe(false);
    expect(fe.delta).toBeGreaterThan(0); // the other way
    expect(EMPTY_LINE).toContain(`${six(fe.controlLevel)} → ${six(fe.armLevel)},差 +${six(fe.delta)}`);
    expect(EMPTY_LINE).toContain('往另一个方向动了一点、含零');
    expect(MATURE_LINE).toContain('空账本那一档(E 臂)反而往另一个方向动了一点,也量不出来');
    // ⭐ the named cost that did NOT appear is said as such: ground passes LONGER, not shorter
    const len = faceOf(C_D, 'stuck.meanGroundPassLengthMetres');
    expect(len.delta).toBeGreaterThan(0);
    expect(MATURE_LINE).toContain(`地面传球没有变短,反而长了 ${six(len.delta)} 米`);
  });

  it('the entry doc exists and names its rulings, its exam and its artifact; the trace table is in it', () => {
    expect(DOC).toContain('#437');
    expect(DOC).toContain('OP-T1b');
    expect(DOC).toContain(ARTIFACT_PATH.split('/').pop()!);
    expect(DOC).toContain('§THE HONEST BRIEF');
    for (const [, , token] of [...D_TRACE, ...E_TRACE]) expect(DOC).toContain(token);
  });
});

/* ========================================================================== */
/* DORMANCY and Road B                                                        */
/* ========================================================================== */

describe('W19 — DORMANCY below and Road B', () => {
  it('worlds 1–18 carry NEITHER door; world 19 carries both', () => {
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      for (const k of ['opFrontMan', 'opFrontChooser']) {
        expect(Object.prototype.hasOwnProperty.call(flags, k), `world ${v} ${k}`).toBe(false);
      }
    }
    const nineteen = a4MatchFlags(19) as Record<string, unknown>;
    expect(nineteen.opFrontMan).toBe(true);
    expect(nineteen.opFrontChooser).toBe(true);
    for (const v of [12, 13, 14, 15, 16, 17, 18] as const) {
      const m = worldMatch(v);
      expect(m.opFrontMan, `world ${v}`).toBe(false);
      expect(m.opFrontChooser, `world ${v}`).toBe(false);
    }
  });

  it('a plain League match reads as no world at all', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    const m = league.createMatch(league.nextFixture()!);
    expect(opArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
    expect(m.opFrontMan).toBe(false);
    expect(m.opFrontChooser).toBe(false);
  });

  it('the league serializes nothing new (the worker plays the SHIPPED world — canon #283.2(iv))', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(OP_WORLD_VERSION);
    expect(Object.keys(league.toJSON())).not.toContain('matchFlags');
    const serialized = JSON.stringify(league.toJSON());
    expect(serialized).not.toContain('opFrontMan');
    expect(serialized).not.toContain('opFrontChooser');
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.opFrontMan).toBe(false);
    expect(simmed.opFrontChooser).toBe(false);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });

  it('⭐ THE DEFAULT LANDING WORLD IS UNCHANGED — the app still starts at 0', () => {
    expect(APP).toContain('private a4World: A4WorldVersion = 0;');
  });

  it('⭐ THE SEEDS ARE IN THIS EXECUTOR\'S DECLARED BLOCK (#437 item 4(ix)); never the verifier\'s', () => {
    expect(SCRATCH_BASE).toBe(900_010_800);
    const mine = [SCRATCH, SCRATCH_BASE + 31, ...Array.from({ length: 6 }, (_, i) => SCRATCH_BASE + 20 + i),
      ...LIVENESS_SEEDS];
    for (const s of mine) {
      expect(s).toBeGreaterThanOrEqual(900_010_800);
      expect(s).toBeLessThanOrEqual(900_010_899);
    }
    for (const s of IDENTITY_SEEDS) {
      expect(s).toBeGreaterThanOrEqual(900_007_200);
      expect(s).toBeLessThanOrEqual(900_007_211);
    }
    for (const s of EXAM_SEEDS) {
      expect(s).toBeGreaterThanOrEqual(12_566_000);
      expect(s).toBeLessThanOrEqual(12_566_011);
    }
  });
});

/* ========================================================================== */
/* ⭐⭐ THE MUTANT WALK — four mutants, each killed by a NAMED pin              */
/* ========================================================================== */

describe('W19 — ⭐⭐ THE MUTANT WALK: four mutants, each killed', () => {
  it('M1 — one door dropped from `OP_WORLD_DOORS` ⇒ the flag set stops matching and 19 reads 18', () => {
    for (const drop of ['opFrontMan', 'opFrontChooser'] as const) {
      const mutated = { ...a4MatchFlags(OP_WORLD_VERSION) } as Record<string, boolean>;
      delete mutated[drop];
      expect(mutated).not.toEqual(a4MatchFlags(OP_WORLD_VERSION)); // killed by FIDELITY
      const league = new League({ seed: SCRATCH, matchDuration: 300 });
      league.matchFlags = mutated;
      const m = league.createMatch(league.nextFixture()!);
      armA4World(m, null, OP_WORLD_VERSION, L3_DOSE, PC_DOSE);
      expect(opArmedVersion(m), drop).toBe(0); // killed by CONTAINMENT
      expect(a4ArmedVersion(m), drop).toBe(IF_WORLD_VERSION);
    }
  });

  it('M2 — the version reader reading ONE flag only ⇒ a one-door world-18 match would read 19', () => {
    const mutantRead = (m: Match): 0 | 19 =>
      (ifArmedVersion(m) === IF_WORLD_VERSION && m.opFrontMan === true ? 19 : 0);
    const oneDoor = withFlags(18, { opFrontMan: true }, OP_WORLD_VERSION);
    expect(mutantRead(oneDoor)).toBe(19); // …what the mutant would answer
    expect(opArmedVersion(oneDoor)).toBe(0); // killed by CONTAINMENT
    expect(SRC).toContain(
      '  return match.opFrontMan === true && match.opFrontChooser === true ? OP_WORLD_VERSION : 0;');
  });

  it('M3 — the arming re-writing a gene ⇒ `armOpWorld` is `armIfWorld` CALLED and nothing more', () => {
    expect(SRC).toContain('): void {\n  armIfWorld(match, l3Dose, pcDose);\n}');
    expect(SRC).not.toContain('setOpGene');
    expect(SRC).not.toContain('OP_WORLD_WEIGHT');
    const a = worldMatch(18);
    const b = worldMatch(19);
    for (const side of [0, 1] as const) {
      for (const view of ['base', 'eff', 'info'] as const) {
        expect(JSON.stringify(genomeOf(b, side, view))).toBe(JSON.stringify(genomeOf(a, side, view)));
      }
    }
  });

  it('M4 — the badge text off-by-one ⇒ world 19 would wear world 18\'s chip', () => {
    expect(A4_BADGE_TEXTS[19]).not.toBe(A4_BADGE_TEXTS[18]);
    expect(A4_BADGE_TEXTS_EMPTY[19]).not.toBe(A4_BADGE_TEXTS_EMPTY[18]);
    expect(A4_BADGE_TEXTS[19]).toBe('🧪 身前贴着的人要算进去 · 剂量成熟');
    expect(new Set(Object.values(A4_BADGE_TEXTS)).size).toBe(19);
    expect(new Set(Object.values(A4_BADGE_TEXTS_EMPTY)).size).toBe(12);
  });
});

/* ========================================================================== */
/* ⭐⭐ IDENTITY — every world BELOW 19 is byte-identical to the dispatch HEAD  */
/* ========================================================================== */

/** The IDENTITY seeds — the family's own band, re-used on purpose (#437 item 4(iii)). */
const IDENTITY_SEEDS = Array.from({ length: 12 }, (_, i) => 900_007_200 + i);

/**
 * ⭐⭐ ARCH-KEYED (#418 item 2(ii); canon *digests carry their architecture*).
 *
 * **x64** — RECORDED BY THIS EXECUTOR at the dispatch HEAD `4cf854f`, IN PROCESS on the clean
 * tree (`git status --porcelain` 0 bytes; the #433 LOW 2 precedent, #437 item 4(iii)), BEFORE a
 * single byte of this rung was written, by a throwaway recorder living outside the repo whose
 * `signature` / `pooledDigest` are this file's, field for field. The recorder FIRST reproduced
 * `tests/ifPlaytestEntry.test.ts`'s seven x64 literals (bare · 12 · 13 · 14 · 15 · 16 · 17)
 * exactly, in the same run, and only then recorded world 18.
 *
 * **arm64** — INHERITED BY IDENTITY from `tests/ds2PlaytestEntry.test.ts`'s `BASELINE_DIGESTS`
 * for bare · 12 · 13 · 14 · 15 · 16 (the route `ifPlaytestEntry` took). ⛔ Worlds 17 and 18 have
 * NO arm64 literal of record with this recipe ⇒ ABSENT, and their rows SKIP on arm64 by title.
 */
const BASELINE_DIGESTS = {
  x64: {
    bare: '1d75378f04f649cb04040519128269d65f31cf640b3dbd7414b48d64248ba500',
    world12: 'ee39881f2a445fbb0e41b61c4fa85d1e703c24b5ef8f699ae7e0ea96f8e78119',
    world13: '7c4f206321dee78cbdce13c9528b6b635d0e1ca1792d5f7afa59cab78e76e953',
    world14: '49fd74496ed245252a8390af9e3fabd796e308549db638b90bb1ac2c3f7e2957',
    world15: '8431aafb0e5606b71804a907d7b092c6d584f4fe108179b4610e6f380154cf9e',
    world16: 'b57a0d6c6ed69c464ae8a4142b5c4da878031a4f5791b33f3a50039b7b86dd01',
    world17: '5d60981a3cccb79eeca1eb6d6249d5186d08f1231f6ecdd69eb3f0f739072933',
    world18: '70ef00f1133c3495b1d2c92b4c68996e6a96771afa27f23dc289520164ef9f68',
  },
  arm64: {
    bare: '062067553ef3ae85f329d3d422b0576e15296471666a0ecb3b6912c40554a8ab',
    world12: '34e882b240967047c746203cadcc39311ddee4a9fe595361365b3daa8ffaeae0',
    world13: '9c9d3117a27192ef31229294ecc050f1e0b5b3a08ca047cc50a8631dc03704e3',
    world14: '0f3887d491099f4a4a17e220d6a63fae929de1af46b45948ae3cf1069e7821cf',
    world15: '2016c431bdadf5401d38ddedf82bd0596b4062986b6eea6ee06ccdbf34c3f4be',
    world16: '7090f7e67350e80e63e4413020c22d1c381845c1e84fcd7417840bdde944d8a4',
  },
} as const;
const ARM64_SOURCE_SUITE = 'tests/ds2PlaytestEntry.test.ts';
const X64_SOURCE_SUITE = 'tests/ifPlaytestEntry.test.ts';

const ARCH = process.arch === 'arm64' ? 'arm64' : 'x64';
const COL = BASELINE_DIGESTS[ARCH] as Record<string, string | undefined>;

const pooledDigest = (version: 0 | W): string =>
  createHash('sha256')
    .update(IDENTITY_SEEDS.map((seed) => {
      const league = new League({ seed });
      if (version !== 0) league.matchFlags = a4MatchFlags(version);
      const match = league.createMatch(league.nextFixture()!);
      if (version !== 0) armA4World(match, null, version, L3_DOSE, PC_DOSE);
      match.runToCompletion();
      return signature(match);
    }).join('|')).digest('hex');

describe('W19 — ⭐⭐ IDENTITY (arch-keyed): every world below 19 is byte-identical', () => {
  it(`the bare world, 12, 13, 14, 15 and 16 equal their ${ARCH} digests`, () => {
    expect(pooledDigest(0)).toBe(COL.bare);
    expect(pooledDigest(12)).toBe(COL.world12);
    expect(pooledDigest(13)).toBe(COL.world13);
    expect(pooledDigest(14)).toBe(COL.world14);
    expect(pooledDigest(15)).toBe(COL.world15);
    expect(pooledDigest(16)).toBe(COL.world16);
  }, 900_000);

  it.skipIf(ARCH === 'arm64')(
    'worlds 17 and 18 equal their x64 dispatch-head digests (ABSENT on arm64 — skipped there by title)',
    () => {
      expect(pooledDigest(17)).toBe(BASELINE_DIGESTS.x64.world17);
      expect(pooledDigest(18)).toBe(BASELINE_DIGESTS.x64.world18);
    }, 900_000,
  );

  it('⭐ the inherited columns are stated literal for literal against their source suites', () => {
    const arm = repoText(ARM64_SOURCE_SUITE);
    for (const literal of Object.values(BASELINE_DIGESTS.arm64)) {
      expect(arm, `${literal} is ${ARM64_SOURCE_SUITE}'s own literal`).toContain(literal);
    }
    expect(Object.keys(BASELINE_DIGESTS.arm64)).not.toContain('world17');
    expect(Object.keys(BASELINE_DIGESTS.arm64)).not.toContain('world18');
    // the x64 literals bare … 17 are `ifPlaytestEntry`'s own (the recorder reproduced them)
    const x = repoText(X64_SOURCE_SUITE);
    for (const [k, literal] of Object.entries(BASELINE_DIGESTS.x64)) {
      if (k !== 'world18') expect(x, k).toContain(literal);
    }
    expect(x).not.toContain(BASELINE_DIGESTS.x64.world18); // NEW here, recorded at 4cf854f
    expect(DOC).toContain(BASELINE_DIGESTS.x64.world18);
  });

  it('⭐ NON-VACUOUS: world 19 is a DIFFERENT world from world 18', () => {
    expect(pooledDigest(19)).not.toBe(pooledDigest(18));
  }, 900_000);

  it('⭐ the production fingerprint pin is ARCH-KEYED (#418 item 1)', () => {
    const grant = repoText('tests/a4HomeGrant.test.ts');
    expect(grant).toContain('57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673');
    expect(DOC).toContain('59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d');
  });
});

/* ========================================================================== */
/* ⭐⭐ LIVENESS — world 19 differs from 18, and from each one-door world       */
/* ========================================================================== */

const LIVENESS_SEEDS = Array.from({ length: 6 }, (_, i) => SCRATCH_BASE + 40 + i);

const fullTime = (m: Match): string => {
  m.runToCompletion();
  return signature(m);
};

describe('W19 — ⭐⭐ LIVENESS: both doors BITE in the entry\'s own path', () => {
  it('world 19 ≠ world 18 by whole-match signature on ≥ 3 of 6 scratch seeds', () => {
    let differ = 0;
    for (const seed of LIVENESS_SEEDS) {
      if (fullTime(worldMatch(19, true, seed)) !== fullTime(worldMatch(18, true, seed))) differ += 1;
    }
    expect(differ).toBeGreaterThanOrEqual(3);
  }, 900_000);

  it('⭐ EACH door bites inside world 19: 19 ≠ 18 + the other door alone, on ≥ 3 of 6 seeds each', () => {
    let noChooser = 0;
    let noLicence = 0;
    for (const seed of LIVENESS_SEEDS) {
      const full = fullTime(worldMatch(19, true, seed));
      if (full !== fullTime(withFlags(18, { opFrontMan: true }, IF_WORLD_VERSION, seed))) noChooser += 1;
      if (full !== fullTime(withFlags(18, { opFrontChooser: true }, IF_WORLD_VERSION, seed))) noLicence += 1;
    }
    expect(noChooser).toBeGreaterThanOrEqual(3);
    expect(noLicence).toBeGreaterThanOrEqual(3);
  }, 900_000);
});
