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
  BQ_WORLD_VERSION, DS2_WORLD_DOORS, DS2_WORLD_VERSION, DS_WORLD_VERSION, GK_WORLD_VERSION,
  IF_WORLD_DOORS, IF_WORLD_VERSION, LN_WORLD_VERSION, LN_WORLD_WEIGHT, a4ArmedVersion,
  a4MatchFlags, a4UrlOverride, armA4World, bqArmedVersion, ds2ArmedVersion, dsArmedVersion,
  gkArmedVersion, ifArmedVersion, isBqWorld, isDs2World, isDsWorld, isGkWorld, isIfWorld,
  isLnWorld, lnArmedVersion, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_IF, A4_BADGE_TEXT_IF_EMPTY, A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../src/ui/A4WorldBadge';

/**
 * ⭐⭐ THE IF ENTRY — `?a4world=18` (看见出脚就跑, the ONE flight-run door at IF-T1b's arm of
 * record `OWNCOOP+IF-E13`). Ruling #424 item 5; docs/world-model/IF-ENTRY-RUNG.md. The
 * EIGHTEENTH entry of the
 * #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6/#309.5/#337.5/#365/#386/#396/#402/#411/#414
 * family, written in `tests/ds2PlaytestEntry.test.ts`'s form.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 18 IS world 17 plus EXACTLY the ONE door `ifFlightRun`, and it says
 *       so by CALLING the world-17 composition. ⛔ NOTHING ELSE rides along, and there is NO
 *       DOSE, NO GENE AND NO CONSTANT (the seam is identity tests only), so `armIfWorld` is
 *       `armDs2World` CALLED and nothing more — world 14's own pin (`lnOwnLaneWeight` = 0.25 on
 *       `baseGenome` AND `effGenome` of both sides, `info.genome` clean) arrives by the call.
 *       ⭐⭐⭐ And THE DOOR SET is the EXAM'S: IF-T1b built its arm of record as
 *       `a4MatchFlags(13)` + the world-17 doors + `ifFlightRun` + `armA4World(m, null, 13)` — a
 *       WORLD-13 composition, because the exam ran before this world existed. So the identity is
 *       pinned in TWO halves: (a) the exam's own construction, re-run here on WORLD 13,
 *       reproduces IF-T1b's STORED per-seed whole-match signatures for `OWNCOOP+IF-E13` on its
 *       own first twelve battery seeds, and (b) `a4MatchFlags(17)` + the flag gives whole-match
 *       signatures IDENTICAL to `a4MatchFlags(18)`'s on six scratch seeds.
 *   (2) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 18 → 17 → 16 → 15 → 14 → 13 → 12: a
 *       world-18 match names itself 18 and NEVER 17; a world-17 match never reads 18. ⭐ AND THE
 *       FLAG ALONE IS NOT ENOUGH: on a world-16 match it reads 0 and falls back to 16.
 *   (3) ⭐ THE URL parses 18 and the bound moves to 19; the badge carries 18 in BOTH dose forms.
 *   (4) ⭐⭐ THE HONEST BRIEF — every 6-dp numeral on each surface is an IF-T1b FIELD read from
 *       the artifact BY FIELD AND BY ARM, each arm under its OWN heading (E13 the measured arm,
 *       D13 beside — the #387 item 1 class), the cost said BEFORE the win, ⭐ and THE HONESTY
 *       LINE on every surface. ⛔ ZERO untraceable numerals, ⛔ ZERO cross-arm numbers.
 *   (5) ⭐⭐ IDENTITY BELOW 18, ARCH-KEYED (#418 item 2(ii)) — pooled whole-match digests for the
 *       bare world and worlds 12…17 on the family IDENTITY band. The x64 column was RECORDED at
 *       the dispatch HEAD `05df245` in a clean throwaway worktree; the arm64 column is INHERITED
 *       BY IDENTITY from `tests/ds2PlaytestEntry.test.ts`'s `BASELINE_DIGESTS` for bare · 12 ·
 *       13 · 14 · 15 · 16, and world 17 is ABSENT on arm64 (no literal of record with this
 *       recipe) so its row SKIPS there, by title.
 *   (6) DORMANCY — worlds 1–17 carry no flight-run flag; a plain League match reads as no world;
 *       `League.toJSON` omits matchFlags (canon worker fixtures).
 *   (7) ⭐⭐ LIVENESS in the #402 item 2(iii) form — the EIGHTH `why` appears in whole matches on
 *       world 18 and NEVER on world 17 — and THE MUTANT WALK: four mutants killed.
 *
 * ⚠ SEEDS: OUT-OF-BAND SCRATCH ONLY — the family IDENTITY band 900,007,200–211 (re-used on
 * purpose, #424 item 5(iii)/(ix)) and this executor's own block 900,009,000–099 from the ONE
 * declared base `SCRATCH_BASE` (#424 item 5(ix)); zero frontier consumption, ZERO sims of
 * record. The ONE exception is IF-T1b's OWN battery band 12,560,000–011, which the exam
 * consumed WHOLE and which item 5(ii)(a) names for the door-set identity pin — re-walking a
 * consumed seed reads no new frontier.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/IF-ENTRY-RUNG.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

/** ⭐ THE ONE DECLARED BASE of this executor's scratch block 900,009,000–099 (#424 item 5(ix)). */
const SCRATCH_BASE = 900_009_000;
const SCRATCH = SCRATCH_BASE + 30;

/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (
  version: 12 | 13 | 14 | 15 | 16 | 17 | 18, dosed = true, seed = SCRATCH,
): Match => {
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

/** THE WHOLE-MATCH SIGNATURE, field for field the `ds2PlaytestEntry.test.ts` helper. */
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

describe('W18 — ⭐ FIDELITY: world 17 plus ONE door, no gene, no constant, no dose', () => {
  it('world 18 is `a4MatchFlags(17)` ∪ { ifFlightRun }, key for key', () => {
    expect(IF_WORLD_VERSION).toBe(18);
    const flags = a4MatchFlags(IF_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(DS2_WORLD_VERSION), ...IF_WORLD_DOORS });
    expect(IF_WORLD_DOORS).toEqual({ ifFlightRun: true });
    const seventeen = a4MatchFlags(DS2_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in seventeen)).sort())
      .toEqual(['ifFlightRun']);
    for (const k of Object.keys(seventeen)) expect(flags[k]).toBe(seventeen[k]);
  });

  it('⛔ NOTHING ELSE RIDES ALONG (#424 item 5(i)): no OBM, no CTB, no RC, no BF, no EDS', () => {
    const KEYS = ['obmMovement', 'ctbSupportPlane', 'rcAnticipate', 'rcReady', 'bfFacingCost',
      'edsTouchCost'] as const;
    for (const v of [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      for (const k of KEYS) expect(flags[k]).toBeFalsy();
    }
    const m = worldMatch(18) as unknown as Record<string, unknown>;
    for (const k of KEYS) expect(m[k]).toBeFalsy();
    // ⛔ and NO OBM GENE: the seat is ABSENT — the arm of record `OWNCOOP+IF-E13` is seat-absent
    for (const side of [0, 1] as const) {
      for (const view of ['base', 'eff', 'info'] as const) {
        expect((genomeOf(worldMatch(18), side, view) as unknown as Record<string, unknown>)
          .offballMovementWeights).toBeUndefined();
      }
    }
  });

  it('⭐⭐ the composition is CALLED, not copied; the arming IS world 17\'s, called, and NOTHING more', () => {
    expect(SRC).toContain('return { ...a4MatchFlags(DS2_WORLD_VERSION), ...IF_WORLD_DOORS };');
    expect(SRC).toContain('): void {\n  armDs2World(match, l3Dose, pcDose);\n}');
    // ⛔ NO GENE AND NO CONSTANT: the entry layer names no IF weight and no IF gene setter
    expect(SRC).not.toContain('setIfGene');
    expect(SRC).not.toContain('IF_WORLD_WEIGHT');
    // ⭐ AND THE CONTAINMENT READ CALLS THE WORLD BELOW — it re-reads no flag of world 17
    expect(SRC).toContain('  if (ds2ArmedVersion(match) !== DS2_WORLD_VERSION) return 0;');
    const m = worldMatch(18);
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
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(0.25);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(ifArmedVersion(m)).toBe(IF_WORLD_VERSION);
    expect(ds2ArmedVersion(m)).toBe(DS2_WORLD_VERSION);
    expect(dsArmedVersion(m)).toBe(DS_WORLD_VERSION);
    expect(gkArmedVersion(m)).toBe(GK_WORLD_VERSION);
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(m)).toBe(BQ_WORLD_VERSION);
  });

  it('⭐ the door and the inherited gene survive to FULL TIME; `info.genome` stays clean', () => {
    const m = worldMatch(18, true, SCRATCH_BASE + 31);
    m.runToCompletion();
    expect(m.ifFlightRun).toBe(true);
    expect(m.dsCoopHatsOff).toBe(true);
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
    expect(ds2ArmedVersion(m)).toBe(DS2_WORLD_VERSION);
    expect(ifArmedVersion(m)).toBe(IF_WORLD_VERSION);
    expect(a4ArmedVersion(m)).toBe(IF_WORLD_VERSION);
  }, 120_000);
});

/* ========================================================================== */
/* ⭐⭐⭐ THE DOOR-SET IDENTITY WITH THE EXAM                                    */
/* ========================================================================== */

/** IF-T1b's own team builder (`scripts/probes/if-t1b-flight-run-exam.ts` `teamInfo`, character
 *  for character — it is DS-C0's, inherited unchanged through the arc). */
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
 * ⭐⭐ THE EXAM'S OWN SIGNATURE RECIPE — `scripts/probes/if-t1b-flight-run-exam.ts`
 * `signatureOf`, field for field. It differs from this family's by ONE field (`action.type`),
 * so it is written out here rather than reused: a pin that reproduces a stored value has to use
 * the recipe that produced it.
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
 * ⭐⭐ THE EXAM'S WAY — `if-t1b-flight-run-exam.ts` `buildMatch`, arm `OWNCOOP+IF-E13`: the
 * WORLD-13 construction flags PLUS the three DS flags PLUS the flight door in the CONSTRUCTOR's
 * flags, then `armA4World(m, null, 13)` — the EMPTY-BOOK form (E13 takes no doses), the seat
 * ABSENT. Walked by the exam's own unobserved loop (`gLockstep` proves observed ≡ unobserved
 * byte for byte per arm, so the unobserved walk is the one that reproduces).
 */
const examWay = (seed: number): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
    ...{ dsOwnRun: true, dsHatsOff: true, dsCoopHatsOff: true },
    ...{ ifFlightRun: true },
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, BQ_WORLD_VERSION);
  return m;
};

/** IF-T1b's first twelve battery seeds — its own consumed band (#424 item 5(ii)(a)/(ix)). */
const EXAM_SEEDS = Array.from({ length: 12 }, (_, i) => 12_560_000 + i);

/** ⚠ The IF-T1b artifact sits at its CANONICAL path (`allGreen` a stored `true` — there is no
 *  red-routing here, unlike DS-T1d's `.RED.json`). It is never moved, renamed or copied. */
const ARTIFACT_PATH = 'docs/world-model/data/if-t1b-flight-run-exam.json';

describe('W18 — ⭐⭐⭐ THE DOOR SET IS IF-T1b\'s, PROVEN IN TWO HALVES', () => {
  it('(a) the exam\'s construction ON WORLD 13 reproduces its OWN stored `OWNCOOP+IF-E13` signatures', () => {
    const artifact = JSON.parse(repoText(ARTIFACT_PATH)) as {
      perSeedCells: { seed: number; 'OWNCOOP+IF-E13': { signature: string } }[];
    };
    const stored = new Map(artifact.perSeedCells.map(
      (row) => [row.seed, row['OWNCOOP+IF-E13'].signature] as const,
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
    expect(reproduced).toBe(12);
  }, 900_000);

  it('(b) `a4MatchFlags(17)` + the flag ≡ `a4MatchFlags(18)`, whole-match, on 6 scratch seeds', () => {
    // the flag SET itself, key for key — the byte-for-byte claim
    expect({ ...a4MatchFlags(DS2_WORLD_VERSION), ifFlightRun: true })
      .toEqual(a4MatchFlags(IF_WORLD_VERSION));
    const SEEDS = Array.from({ length: 6 }, (_, i) => SCRATCH_BASE + 20 + i);
    for (const seed of SEEDS) {
      const build = (spread: boolean): Match => {
        const league = new League({ seed, matchDuration: 300 });
        league.matchFlags = spread
          ? { ...a4MatchFlags(DS2_WORLD_VERSION), ifFlightRun: true }
          : a4MatchFlags(IF_WORLD_VERSION);
        const m = league.createMatch(league.nextFixture()!);
        armA4World(m, null, IF_WORLD_VERSION, null, null);
        return m;
      };
      const a = build(true);
      const b = build(false);
      expect(signature(b)).toBe(signature(a));
      a.runToCompletion();
      b.runToCompletion();
      expect(signature(b)).toBe(signature(a));
      expect(ifArmedVersion(a)).toBe(IF_WORLD_VERSION);
      expect(ifArmedVersion(b)).toBe(IF_WORLD_VERSION);
    }
  }, 600_000);
});

/* ========================================================================== */
/* ⭐⭐ CONTAINMENT, THE URL BOUND AND THE BADGE                                */
/* ========================================================================== */

describe('W18 — ⭐⭐ CONTAINMENT, the URL bound and the badge', () => {
  it('⭐⭐ the version value is containment-ordered: 18 names itself 18; 17 stays 17', () => {
    const eighteen = worldMatch(18);
    expect(ifArmedVersion(eighteen)).toBe(IF_WORLD_VERSION);
    expect(a4ArmedVersion(eighteen)).toBe(IF_WORLD_VERSION); // ⛔ never 17
    // …and the worlds it contains still read as themselves underneath
    expect(ds2ArmedVersion(eighteen)).toBe(DS2_WORLD_VERSION);
    expect(dsArmedVersion(eighteen)).toBe(DS_WORLD_VERSION);
    expect(gkArmedVersion(eighteen)).toBe(GK_WORLD_VERSION);
    expect(lnArmedVersion(eighteen)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(eighteen)).toBe(BQ_WORLD_VERSION);
    const seventeen = worldMatch(17);
    expect(ifArmedVersion(seventeen)).toBe(0);
    expect(a4ArmedVersion(seventeen)).toBe(DS2_WORLD_VERSION); // ⛔ never 18
    for (const v of [12, 13, 14, 15, 16] as const) {
      expect(ifArmedVersion(worldMatch(v))).toBe(0);
    }
    // the EMPTY-BOOK form is the same world 18
    expect(a4ArmedVersion(worldMatch(18, false))).toBe(IF_WORLD_VERSION);
    // ⭐ THE FLAG ALONE IS NOT ENOUGH: on world 16's substrate it reads 0 and falls back to 16
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = { ...a4MatchFlags(DS_WORLD_VERSION), ifFlightRun: true };
    const lonely = league.createMatch(league.nextFixture()!);
    armA4World(lonely, null, IF_WORLD_VERSION, L3_DOSE, PC_DOSE);
    expect(lonely.ifFlightRun).toBe(true);
    expect(ifArmedVersion(lonely)).toBe(0);
    expect(a4ArmedVersion(lonely)).toBe(DS_WORLD_VERSION);
    // ⭐ THE SOURCE ORDER itself: 18 is asked BEFORE 17 (mutant M2's home)
    expect(SRC.indexOf('const raw18 = ifArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw17 = ds2ArmedVersion(match);'));
    expect(SRC.indexOf('const raw17 = ds2ArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw16 = dsArmedVersion(match);'));
  });

  it('⭐ the URL parses 18 and the bound moves to 19; isIfWorld agrees', () => {
    expect(a4UrlOverride('?a4world=18')).toBe(18);
    expect(a4UrlOverride('?a4world=19')).toBeNull();
    expect(a4UrlOverride('?a4world=17')).toBe(17);
    expect(isIfWorld(18)).toBe(true);
    expect(isIfWorld(17)).toBe(false);
    expect(isDs2World(18)).toBe(false);
    expect(isDsWorld(18)).toBe(false);
    expect(isGkWorld(18)).toBe(false);
    expect(isLnWorld(18)).toBe(false);
    expect(isBqWorld(18)).toBe(false);
    expect(SRC).toContain('`?a4world=18` arms that world +');
  });

  it('⭐ the badge carries 18 in BOTH dose forms, and the chip mounts', () => {
    expect(A4_BADGE_TEXTS[18]).toBe(A4_BADGE_TEXT_IF);
    expect(A4_BADGE_TEXTS_EMPTY[18]).toBe(A4_BADGE_TEXT_IF_EMPTY);
    expect(A4_BADGE_TEXT_IF).toBe('🧪 看见出脚就跑 · 剂量成熟');
    expect(A4_BADGE_TEXT_IF_EMPTY).toBe('🧪 看见出脚就跑 · 空账本(全新手)');
    expect(A4_BADGE_TEXT_IF).not.toBe(A4_BADGE_TEXT_IF_EMPTY);
    const badge = new A4WorldBadge({
      createElement: () => ({ className: '', textContent: null as string | null, remove: () => {} }),
      body: { appendChild: () => {} },
    });
    badge.setWorld(18);
    expect(badge.world).toBe(18);
    expect(badge.label).toBe(A4_BADGE_TEXT_IF);
    badge.setWorld(18, A4_BADGE_TEXT_IF_EMPTY);
    expect(badge.label).toBe(A4_BADGE_TEXT_IF_EMPTY);
  });
});

/* ========================================================================== */
/* ⭐⭐ THE HONEST BRIEF — every numeral an IF-T1b field, BY FIELD AND BY ARM   */
/* ========================================================================== */

interface Guard {
  id: string; controlLevel: number; armLevel: number; delta: number; ci: [number, number];
  absDeltaOverTolerance: number;
}
interface Face { face: string; arm: string; value: number | null }
interface Artifact {
  eighthClass: Record<string, {
    count: { shareOfMakeRun: number };
    startStatePartition: { memory: { theLastPasser: number; anotherMate: number } };
    yieldPartition: {
      shotsPerEpisode: number;
      theSeventhsOwnYieldBeside: { shotsPerEpisode: number };
      byState: { ownRestart: { ifRunsPerMatch: number } };
    };
  }>;
  r1: {
    rows: Record<string, { controlLevel: number; armLevel: number; delta: number; ci: number[] }>;
    ratioOfRecord: { ratio: number; ci: number[] };
  };
  guards: {
    table: Record<string, Guard[]>;
    holdsBand: Record<string, boolean>;
    breachSets: Record<string, string[]>;
  };
  offsides: { rows: Record<string, { flag: boolean; resolved: boolean }> };
  faceBlocks: { crowding: Record<string, { crashShare: number }> };
  faces: Face[];
  reads: { honestyLine: string };
}

const ART = JSON.parse(repoText(ARTIFACT_PATH)) as Artifact;
const six = (x: number): string => Math.abs(x).toFixed(6);
const guardOf = (contrast: string, id: string): Guard =>
  ART.guards.table[contrast].find((r) => r.id === id)!;
const faceOf = (face: string, arm: string): number =>
  ART.faces.find((x) => x.face === face && x.arm === arm)!.value as number;

/**
 * ⭐⭐ THE TRACE TABLE — [what it is, the ARM (or contrast) it belongs to, the token]. Every
 * token is COMPUTED from the artifact here, never typed: a mistyped numeral on a surface dies
 * because the token this table produces is the field's own `toFixed(6)`.
 */
const traceTable = (arm: string, ctrl: string): readonly (readonly [string, string, string])[] => {
  const c = `${arm}|${ctrl}`;
  const e = ART.eighthClass[arm];
  const g1 = guardOf(c, 'G1');
  const g9 = guardOf(c, 'G9');
  const r1 = ART.r1.rows[c];
  const rows: (readonly [string, string, string])[] = [
    ['eighthClass.count.shareOfMakeRun', arm, six(e.count.shareOfMakeRun)],
    ['flight.intendedReceiverShare', arm, six(faceOf('flight.intendedReceiverShare', arm))],
    ['eighthClass.yieldPartition.shotsPerEpisode', arm, six(e.yieldPartition.shotsPerEpisode)],
    ['eighthClass.yieldPartition.theSeventhsOwnYieldBeside.shotsPerEpisode', arm,
      six(e.yieldPartition.theSeventhsOwnYieldBeside.shotsPerEpisode)],
    ['r1.runsPerInPossessionTick (control)', ctrl, six(r1.controlLevel)],
    ['r1.runsPerInPossessionTick (arm)', arm, six(r1.armLevel)],
    ['guard.throughBallsPerMatch (control)', ctrl, six(g9.controlLevel)],
    ['guard.throughBallsPerMatch (arm)', arm, six(g9.armLevel)],
    ['G9.delta', c, six(g9.delta)],
    ['G9.ci[0]', c, six(g9.ci[0])],
    ['G9.ci[1]', c, six(g9.ci[1])],
    ['G9.absDeltaOverTolerance', c, six(g9.absDeltaOverTolerance)],
    ['guard.goalsPerMatch (control)', ctrl, six(g1.controlLevel)],
    ['guard.goalsPerMatch (arm)', arm, six(g1.armLevel)],
    ['G1.delta', c, six(g1.delta)],
    ['G1.ci[0]', c, six(g1.ci[0])],
    ['G1.ci[1]', c, six(g1.ci[1])],
    ['G1.absDeltaOverTolerance', c, six(g1.absDeltaOverTolerance)],
    ['startStatePartition.memory.theLastPasser', arm,
      six(e.startStatePartition.memory.theLastPasser)],
    ['startStatePartition.memory.anotherMate', arm,
      six(e.startStatePartition.memory.anotherMate)],
    ['yieldPartition.byState.ownRestart.ifRunsPerMatch', arm,
      six(e.yieldPartition.byState.ownRestart.ifRunsPerMatch)],
    ['leak.cellShare.stalePasserStillCredited (control)', ctrl,
      six(faceOf('leak.cellShare.stalePasserStillCredited', ctrl))],
    ['leak.cellShare.stalePasserStillCredited (arm)', arm,
      six(faceOf('leak.cellShare.stalePasserStillCredited', arm))],
    ['crowd.crashShare (control)', ctrl, six(ART.faceBlocks.crowding[ctrl].crashShare)],
    ['crowd.crashShare (arm)', arm, six(ART.faceBlocks.crowding[arm].crashShare)],
  ];
  if (arm.endsWith('E13')) {
    // the RATIO OF RECORD is stored for the comparison of record only
    rows.push(['r1.ratioOfRecord.ratio', c, six(ART.r1.ratioOfRecord.ratio)]);
    rows.push(['r1.ratioOfRecord.ci[0]', c, six(ART.r1.ratioOfRecord.ci[0])]);
    rows.push(['r1.ratioOfRecord.ci[1]', c, six(ART.r1.ratioOfRecord.ci[1])]);
  } else {
    rows.push(['r1.delta', c, six(r1.delta)]);
    rows.push(['r1.ci[0]', c, six(r1.ci[0])]);
    rows.push(['r1.ci[1]', c, six(r1.ci[1])]);
  }
  return rows;
};

const E13_TRACE = traceTable('OWNCOOP+IF-E13', 'OWNCOOP-E13');
const D13_TRACE = traceTable('OWNCOOP+IF-D13', 'OWNCOOP-D13');
const E13_TOKENS = new Set(E13_TRACE.map((r) => r[2]));
const D13_TOKENS = new Set(D13_TRACE.map((r) => r[2]));
/** ⚠ `0.000000` is a field on BOTH arms (the intended-receiver share and the dead-ball start),
 *  so it is the ONE token the two sets share and the disjointness pin exempts it BY NAME. */
const SHARED_TOKENS = new Set([...E13_TOKENS].filter((t) => D13_TOKENS.has(t)));

const numerals = (s: string): string[] => s.match(/\d+\.\d{6}/g) ?? [];
const lineOf = (text: string, needle: string): string =>
  text.split('\n').find((l) => l.includes(needle))!;

const EMPTY_LINE = lineOf(APP, '🧪 看见出脚就跑 · 空账本 ON');
const MATURE_LINE = APP.split('\n').find(
  (l) => l.includes('🧪 看见出脚就跑 ON') && !l.includes('空账本 ON'),
)!;
const BLURB = lineOf(SETTINGS, '看见出脚就跑 —— 球还在飞的时候');

/** ⭐⭐ THE HONESTY LINE, rendered in plain Chinese — `reads.honestyLine`, on EVERY surface. */
const HONESTY = '这块表看不见,不等于眼睛看不见——这道门就是请你的眼睛来判';

describe('W18 — ⭐⭐ THE HONEST BRIEF: the cost first, each arm under its own heading', () => {
  it('the three surfaces exist and carry the honesty line and the league-worker caveat', () => {
    for (const s of [EMPTY_LINE, MATURE_LINE, BLURB]) {
      expect(s).toBeDefined();
      expect(s).toContain(HONESTY);
      expect(s).toContain('联赛后台快速模拟的比赛跑的是原版世界');
      expect(s).toContain('你的眼睛要判的');
      expect(s).toContain('?a4world=18 对 ?a4world=17');
      expect(s).toContain('?a4world=18&pcdose=0');
    }
    // ⭐ the honesty line is the exam's own `reads.honestyLine`, rendered — the STORED string
    // names the eye and the band; the Chinese says the same thing.
    expect(ART.reads.honestyLine).toContain('the eye');
    // the settings checkbox label
    expect(SETTINGS).toContain('看见出脚就跑 · 球还在飞的时候,刚看见传球的那个人自己往身后冲 (play-test)');
    // ⭐ the badge carries the name and the dose form and NO numeral (a chip is a few characters)
    expect(numerals(A4_BADGE_TEXT_IF)).toEqual([]);
    expect(numerals(A4_BADGE_TEXT_IF_EMPTY)).toEqual([]);
  });

  it('⭐⭐ THE COST IS SAID BEFORE THE WIN on all three surfaces', () => {
    for (const s of [EMPTY_LINE, MATURE_LINE, BLURB]) {
      expect(s.indexOf('这一步造了什么')).toBeGreaterThan(-1);
      expect(s.indexOf('代价说在最前面')).toBeGreaterThan(s.indexOf('这一步造了什么'));
      expect(s.indexOf('代价说在最前面')).toBeLessThan(s.indexOf('⭐ 量到的'));
      expect(s.indexOf('⭐ 量到的')).toBeLessThan(s.indexOf('别期待'));
      expect(s.indexOf('别期待')).toBeLessThan(s.indexOf('你的眼睛要判的'));
    }
  });

  it('⭐⭐⭐ EVERY 6-dp NUMERAL ON EVERY SURFACE IS AN ARTIFACT FIELD UNDER THE ARM IT CLAIMS', () => {
    const untraced = (s: string, allowed: Set<string>): string[] =>
      [...new Set(numerals(s))].filter((t) => !allowed.has(t));
    expect(untraced(EMPTY_LINE, E13_TOKENS)).toEqual([]);
    expect(untraced(MATURE_LINE, D13_TOKENS)).toEqual([]);
    expect(untraced(BLURB, new Set([...E13_TOKENS, ...D13_TOKENS]))).toEqual([]);
    // …and the brief is not empty: the counts are the receipt
    expect(numerals(EMPTY_LINE).length).toBeGreaterThanOrEqual(25);
    expect(numerals(MATURE_LINE).length).toBeGreaterThanOrEqual(25);
    expect(numerals(BLURB).length).toBeGreaterThanOrEqual(50);
  });

  it('⭐⭐ ZERO CROSS-ARM NUMBERS on the two feed lines (the #387 item 1 class)', () => {
    const eOnly = [...E13_TOKENS].filter((t) => !SHARED_TOKENS.has(t));
    const dOnly = [...D13_TOKENS].filter((t) => !SHARED_TOKENS.has(t));
    expect(eOnly.filter((t) => MATURE_LINE.includes(t))).toEqual([]);
    expect(dOnly.filter((t) => EMPTY_LINE.includes(t))).toEqual([]);
    // the ONE shared token is `0.000000`, and it is a field on BOTH arms — declared, not ignored
    expect([...SHARED_TOKENS]).toEqual(['0.000000']);
    for (const arm of ['OWNCOOP+IF-E13', 'OWNCOOP+IF-D13']) {
      expect(six(faceOf('flight.intendedReceiverShare', arm))).toBe('0.000000');
      expect(six(ART.eighthClass[arm].yieldPartition.byState.ownRestart.ifRunsPerMatch))
        .toBe('0.000000');
    }
  });

  it('⭐⭐ THE ARM LABELS ARE ADJACENT TO THE NUMBERS in the settings blurb', () => {
    expect(BLURB).toContain('⚠ 代价说在最前面(以下数字来自 E13 空账本臂,也就是这扇门量过的那一档)');
    expect(BLURB).toContain('⭐ 量到的(还是 E13 空账本臂)');
    expect(BLURB).toContain('⭐⭐ 你玩的这一档(成熟账本,D13 臂)这次也是量过的,不是推断');
    expect(BLURB).toContain('前插人数(成熟账本)0.238608 → 0.298222');
    expect(BLURB).toContain('(以下两条两臂各报各的数)');
    expect(EMPTY_LINE).toContain('IF-T1b 的 E13 臂');
    expect(MATURE_LINE).toContain('IF-T1b 的 D13 臂');
  });

  it('⭐ THE COST FACES THE RULING NAMED ARE ON THE SURFACE, each with its field', () => {
    // the class is one attacking run in about eleven — the SHARE field, and the arithmetic beside
    expect(EMPTY_LINE).toContain('占全部进攻前插的 0.092214');
    expect(EMPTY_LINE).toContain('1 ÷ 0.092214');
    // the passer NEVER targets him
    expect(EMPTY_LINE).toContain('0.000000');
    // the yield pair — this run against the at-feet run
    expect(EMPTY_LINE).toContain('0.038808');
    expect(EMPTY_LINE).toContain('0.049224');
    // runs per possession tick with the RATIO and its interval
    expect(EMPTY_LINE).toContain('0.241767 → 0.288929');
    expect(EMPTY_LINE).toContain('1.195072');
    expect(EMPTY_LINE).toContain('[1.175962, 1.213609]');
    // the memory partition
    expect(EMPTY_LINE).toContain('0.450157');
    expect(EMPTY_LINE).toContain('0.549843');
    // ⚠ 别期待 — the four non-claims of contract §4, and the leak pair
    for (const s of [EMPTY_LINE, MATURE_LINE, BLURB]) {
      expect(s).toContain('卡着越位线的时机');
      expect(s).toContain('也没有看方向');
      expect(s).toContain('传球手不会读他');
      expect(s).toContain('「有人挤人」不是这扇门的事');
    }
    expect(EMPTY_LINE).toContain('0.896515 → 0.896442');
    expect(MATURE_LINE).toContain('0.859212 → 0.848694');
  });

  it('⭐ THE BAND IS REPORTED HONESTLY: the guards, and the offside flag on the pair that has it', () => {
    expect(ART.guards.holdsBand['OWNCOOP+IF-E13|OWNCOOP-E13']).toBe(true);
    expect(ART.guards.breachSets['OWNCOOP+IF-E13|OWNCOOP-E13']).toEqual([]);
    expect(ART.guards.holdsBand['OWNCOOP+IF-D13|OWNCOOP-D13']).toBe(true);
    expect(ART.guards.breachSets['OWNCOOP+IF-D13|OWNCOOP-D13']).toEqual([]);
    // the E13 pair's offside flag is DOWN, and the empty-book line says so
    expect(ART.offsides.rows['OWNCOOP+IF-E13|OWNCOOP-E13'].flag).toBe(false);
    expect(EMPTY_LINE).toContain('越位旗没有升起');
    // ⭐ the D13 pair's offside flag is UP, and the mature line SAYS SO rather than hiding it
    expect(ART.offsides.rows['OWNCOOP+IF-D13|OWNCOOP-D13'].flag).toBe(true);
    expect(MATURE_LINE).toContain('这一档的越位旗升了');
    expect(BLURB).toContain('这一档的越位旗升了');
    // ⭐ the D13 through-ball limb RESOLVES and the surface prints its |Δ| ÷ tolerance instead of
    // claiming an interval that contains zero — the honest form
    expect(guardOf('OWNCOOP+IF-D13|OWNCOOP-D13', 'G9').ci[0]).toBeGreaterThan(0);
    expect(MATURE_LINE).toContain('不含零');
    expect(MATURE_LINE).toContain('0.130871');
  });

  it('the entry doc exists and names its rulings, its exam and its artifact', () => {
    expect(DOC).toContain('#424');
    expect(DOC).toContain('IF-T1b');
    expect(DOC).toContain('IF-T0b');
    expect(DOC).toContain(ARTIFACT_PATH.split('/').pop()!);
    // ⭐ the trace table lives in the doc too, surface × token × field × arm
    expect(DOC).toContain('§THE HONEST BRIEF');
    for (const [, , token] of [...E13_TRACE, ...D13_TRACE]) expect(DOC).toContain(token);
  });
});

/* ========================================================================== */
/* DORMANCY and Road B                                                        */
/* ========================================================================== */

describe('W18 — DORMANCY below and Road B', () => {
  it('worlds 1–17 carry NO flight-run flag; world 18 carries it (the narrow, positively)', () => {
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      expect(Object.prototype.hasOwnProperty.call(flags, 'ifFlightRun'), `world ${v}`)
        .toBe(false);
    }
    expect((a4MatchFlags(18) as Record<string, unknown>).ifFlightRun).toBe(true);
    for (const v of [12, 13, 14, 15, 16, 17] as const) {
      expect(worldMatch(v).ifFlightRun).toBe(false);
    }
    expect(worldMatch(18).ifFlightRun).toBe(true);
  });

  it('a plain League match reads as no world at all', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    const m = league.createMatch(league.nextFixture()!);
    expect(ifArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
    expect(m.ifFlightRun).toBe(false);
  });

  it('the league serializes nothing new (the worker plays the SHIPPED world — canon #283.2(iv))', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(IF_WORLD_VERSION);
    expect(Object.keys(league.toJSON())).not.toContain('matchFlags');
    const serialized = JSON.stringify(league.toJSON());
    expect(serialized).not.toContain('ifFlightRun');
    expect(serialized).not.toContain('dsCoopHatsOff');
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.ifFlightRun).toBe(false);
    expect(simmed.dsCoopHatsOff).toBe(false);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });

  it('⭐ THE DEFAULT LANDING WORLD IS UNCHANGED — the app still starts at 0', () => {
    expect(APP).toContain('private a4World: A4WorldVersion = 0;');
  });

  it('⭐ THE SEEDS ARE IN THIS EXECUTOR\'S DECLARED BLOCK (#424 item 5(ix))', () => {
    expect(SCRATCH_BASE).toBe(900_009_000);
    const mine = [SCRATCH, SCRATCH_BASE + 31, ...Array.from({ length: 6 }, (_, i) => SCRATCH_BASE + 20 + i),
      ...Array.from({ length: 6 }, (_, i) => SCRATCH_BASE + 40 + i)];
    for (const s of mine) {
      expect(s).toBeGreaterThanOrEqual(900_009_000);
      expect(s).toBeLessThanOrEqual(900_009_099);
    }
    for (const s of IDENTITY_SEEDS) {
      expect(s).toBeGreaterThanOrEqual(900_007_200);
      expect(s).toBeLessThanOrEqual(900_007_211);
    }
    for (const s of EXAM_SEEDS) {
      expect(s).toBeGreaterThanOrEqual(12_560_000);
      expect(s).toBeLessThanOrEqual(12_560_011);
    }
  });
});

/* ========================================================================== */
/* ⭐⭐ THE MUTANT WALK — four mutants, each killed by a NAMED pin              */
/* ========================================================================== */

describe('W18 — ⭐⭐ THE MUTANT WALK: four mutants, each killed', () => {
  it('M1 — the door dropped from `IF_WORLD_DOORS` ⇒ the flag set stops matching and 18 reads 0', () => {
    const mutated = { ...a4MatchFlags(DS2_WORLD_VERSION) };
    expect(mutated).not.toEqual(a4MatchFlags(IF_WORLD_VERSION)); // killed by FIDELITY
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = mutated;
    const m = league.createMatch(league.nextFixture()!);
    armA4World(m, null, IF_WORLD_VERSION);
    expect(m.ifFlightRun).toBe(false);
    expect(ifArmedVersion(m)).toBe(0); // killed by CONTAINMENT
    expect(a4ArmedVersion(m)).toBe(DS2_WORLD_VERSION); // …it falls back to what it contains
  });

  it('M2 — the version reader reading world 17\'s flag only ⇒ a world-17 match would read 18', () => {
    // the mutant's own read, spelled out: `ifArmedVersion` that returns 18 whenever world 17
    // conforms, without testing `match.ifFlightRun`
    const mutantRead = (m: Match): 0 | 18 =>
      (ds2ArmedVersion(m) === DS2_WORLD_VERSION ? 18 : 0);
    const seventeen = worldMatch(17);
    expect(mutantRead(seventeen)).toBe(18); // …what the mutant would answer
    expect(ifArmedVersion(seventeen)).toBe(0); // killed by CONTAINMENT
    expect(a4ArmedVersion(seventeen)).toBe(DS2_WORLD_VERSION);
    // and the source says it reads the flag, not only the world below
    expect(SRC).toContain('  return match.ifFlightRun === true ? IF_WORLD_VERSION : 0;');
  });

  it('M3 — the arming re-writing a gene ⇒ `armIfWorld` is `armDs2World` CALLED and nothing more', () => {
    expect(SRC).toContain('): void {\n  armDs2World(match, l3Dose, pcDose);\n}');
    expect(SRC).not.toContain('setIfGene');
    expect(SRC).not.toContain('IF_WORLD_WEIGHT');
    // the runtime analogue: world 18's genomes are world 17's, key for key, on both dosed views
    const a = worldMatch(17);
    const b = worldMatch(18);
    for (const side of [0, 1] as const) {
      for (const view of ['base', 'eff', 'info'] as const) {
        expect(JSON.stringify(genomeOf(b, side, view)))
          .toBe(JSON.stringify(genomeOf(a, side, view)));
      }
    }
  });

  it('M4 — the badge text off-by-one ⇒ world 18 would wear world 17\'s chip', () => {
    expect(A4_BADGE_TEXTS[18]).not.toBe(A4_BADGE_TEXTS[17]);
    expect(A4_BADGE_TEXTS_EMPTY[18]).not.toBe(A4_BADGE_TEXTS_EMPTY[17]);
    expect(A4_BADGE_TEXTS[18]).toBe('🧪 看见出脚就跑 · 剂量成熟');
    expect(new Set(Object.values(A4_BADGE_TEXTS)).size).toBe(18);
  });
});

/* ========================================================================== */
/* ⭐⭐ IDENTITY — every world BELOW 18 is byte-identical to the dispatch HEAD  */
/* ========================================================================== */

/** The IDENTITY seeds — the family's own band, re-used on purpose (#424 item 5(iii)). */
const IDENTITY_SEEDS = Array.from({ length: 12 }, (_, i) => 900_007_200 + i);

/**
 * ⭐⭐ ARCH-KEYED (#418 item 2(ii); canon *digests carry their architecture*).
 *
 * **x64** — RECORDED BY THIS EXECUTOR at the dispatch HEAD `05df245`, in a CLEAN throwaway
 * worktree (`git worktree add … 05df245`, a junctioned shared `node_modules`, `git status
 * --short` EMPTY), BEFORE a single byte of this rung was written.
 *
 * **arm64** — INHERITED BY IDENTITY from `tests/ds2PlaytestEntry.test.ts`'s `BASELINE_DIGESTS`
 * for bare · 12 · 13 · 14 · 15 · 16: the SAME twelve seeds, the SAME `signature` recipe, and
 * those worlds byte-identical since `4d3ff94` (#415 item 1 / #418 item 2(ii) route (a)). The
 * literals below are that suite's, character for character. ⛔ World 17 has NO arm64 literal of
 * record with this recipe (it did not exist at `4d3ff94`'s baseline column) ⇒ route (b), ABSENT,
 * and its row SKIPS on arm64 by title. ⛔ Nothing here is a number typed from memory.
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
/** the arm64 column's SOURCE SUITE, named as the inheritance requires (#418 item 2(ii)(a)) */
const ARM64_SOURCE_SUITE = 'tests/ds2PlaytestEntry.test.ts';
const ARM64_SOURCE_HEAD = '4d3ff94';

const ARCH = process.arch === 'arm64' ? 'arm64' : 'x64';
const COL = BASELINE_DIGESTS[ARCH] as Record<string, string | undefined>;

const pooledDigest = (version: 0 | 12 | 13 | 14 | 15 | 16 | 17 | 18): string =>
  createHash('sha256')
    .update(IDENTITY_SEEDS.map((seed) => {
      const league = new League({ seed });
      if (version !== 0) league.matchFlags = a4MatchFlags(version);
      const match = league.createMatch(league.nextFixture()!);
      if (version !== 0) armA4World(match, null, version, L3_DOSE, PC_DOSE);
      match.runToCompletion();
      return signature(match);
    }).join('|')).digest('hex');

describe('W18 — ⭐⭐ IDENTITY (arch-keyed): every world below 18 is byte-identical', () => {
  it(`the bare world, 12, 13, 14, 15 and 16 equal their ${ARCH} dispatch-head digests`, () => {
    expect(pooledDigest(0)).toBe(COL.bare);
    expect(pooledDigest(12)).toBe(COL.world12);
    expect(pooledDigest(13)).toBe(COL.world13);
    expect(pooledDigest(14)).toBe(COL.world14);
    expect(pooledDigest(15)).toBe(COL.world15);
    expect(pooledDigest(16)).toBe(COL.world16);
  }, 900_000);

  it.skipIf(ARCH === 'arm64')(
    'world 17 equals its x64 dispatch-head digest (ABSENT on arm64 — skipped there by title)',
    () => {
      expect(pooledDigest(17)).toBe(BASELINE_DIGESTS.x64.world17);
    }, 900_000,
  );

  it('⭐ the arm64 column is INHERITED BY IDENTITY, stated literal for literal', () => {
    const source = repoText(ARM64_SOURCE_SUITE);
    expect(source).toContain(ARM64_SOURCE_HEAD);
    for (const literal of Object.values(BASELINE_DIGESTS.arm64)) {
      expect(source, `${literal} is ${ARM64_SOURCE_SUITE}'s own literal`).toContain(literal);
    }
    // ⛔ and world 17 has NO arm64 literal anywhere in that suite's baseline table
    expect(Object.keys(BASELINE_DIGESTS.arm64)).not.toContain('world17');
  });

  it('⭐ NON-VACUOUS: world 18 is a DIFFERENT world from world 17', () => {
    expect(pooledDigest(18)).not.toBe(pooledDigest(17));
  }, 900_000);

  it('⭐ the production fingerprint pin is ARCH-KEYED (#418 item 1)', () => {
    const grant = repoText('tests/a4HomeGrant.test.ts');
    // arm64 — the value OF RECORD, the literal that suite still pins (RED here by construction)
    expect(grant).toContain(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    // x64 — the value of record for THIS host, from #418 item 1
    expect(DOC).toContain(
      '59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d',
    );
  });
});

/* ========================================================================== */
/* ⭐⭐ LIVENESS — the #402 item 2(iii) form: the EIGHTH `why` in whole matches */
/* ========================================================================== */

const LIVENESS_SEEDS = Array.from({ length: 6 }, (_, i) => SCRATCH_BASE + 40 + i);
const FLIGHT_RUN_WHY = 'own run onto the flight';

/** count the EIGHTH `why` over a whole match — `p.action.scores`, the form
 *  `tests/ifFlightRun.test.ts` uses (its `walk`). */
const eighthWhyCount = (seed: number, version: 17 | 18): number => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = a4MatchFlags(version);
  const m = league.createMatch(league.nextFixture()!);
  armA4World(m, null, version, L3_DOSE, PC_DOSE);
  let n = 0;
  while (!m.finished) {
    m.step(DT);
    for (const t of m.teams) {
      for (const p of t.players) {
        for (const s of p.action.scores) if (s.why === FLIGHT_RUN_WHY) n += 1;
      }
    }
  }
  return n;
};

describe('W18 — ⭐⭐ LIVENESS: the door BITES (the #402 item 2(iii) form)', () => {
  it('the eighth `why` appears on world 18 in whole matches, and NEVER on world 17', () => {
    let bit = 0;
    for (const seed of LIVENESS_SEEDS) {
      const on = eighthWhyCount(seed, 18);
      const off = eighthWhyCount(seed, 17);
      expect(off, `world 17, seed ${seed}`).toBe(0);
      if (on > 0) bit += 1;
    }
    // ⭐ #424 item 5(v) asks for ≥ 3 scratch seeds; six are walked and the pin names the bound
    expect(bit).toBeGreaterThanOrEqual(3);
  }, 900_000);

  it('⭐ world 18 ≠ world 17 by whole-match signature on the same scratch seeds', () => {
    let differ = 0;
    for (const seed of LIVENESS_SEEDS) {
      const build = (v: 17 | 18): string => {
        const league = new League({ seed, matchDuration: 300 });
        league.matchFlags = a4MatchFlags(v);
        const m = league.createMatch(league.nextFixture()!);
        armA4World(m, null, v, L3_DOSE, PC_DOSE);
        m.runToCompletion();
        return signature(m);
      };
      if (build(18) !== build(17)) differ += 1;
    }
    expect(differ).toBeGreaterThanOrEqual(3);
  }, 900_000);
});
