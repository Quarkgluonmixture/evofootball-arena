/**
 * MT T2 — THE CO-EVOLUTION LIVE A/B (selection sets the dose).
 *
 * Doc:      docs/world-model/MT-T2-COEVOLUTION.md  (EVERY arm, seed, horizon, threshold and
 *           predicate below is frozen THERE, ex ante, before any full-run number existed.)
 * Contract: docs/world-model/MARK-TIGHTNESS-CONTRACT.md §3 "MT-T2 / exit" · §1 H-MT · §4.
 * Seams:    docs/world-model/MT-T0-DORMANT-SEAM.md (`evolveMarkSag`, the sag §LAW, the ARMING
 *           CHECKLIST) · docs/world-model/PM-T0-DORMANT-SEAM.md (`evolveDefLaneConvergence`).
 * Ruler:    docs/world-model/MT-T1-RULER-RERUN.md §RESULT + its COMMITTED artifact
 *           docs/world-model/data/mt-t1-ruler-rerun.json — the deflated levels this stage
 *           asks selection about are read FROM THAT ARTIFACT (rehashed here), never typed.
 * Precedent: A4-S2P3-GENE-BATTERY §5 (LEG S) — the named selection instrument this stage
 *           reuses: the probe-side mirror of `evolveGroup`'s band law, win-only fitness,
 *           gen-0 born absent, and the ⚠ "presence rises MECHANICALLY" reading note.
 * Rulings:  #205 (this dispatch: arms, win-only fitness, born-absent gen 0, the three
 *           pre-named outcome forms) · #204 (the cost finding this answers) · #167 (the
 *           Leg-S win-only rule) · #163 (stats-base discipline) · #181.2 (receipts =
 *           committed recomputable artifacts, every hash computed HERE) · #197-M1 (nothing
 *           commit-dependent inside the hashed body) · #197-M2 (never drop failing rows) ·
 *           #194/#196 (state what the arms DIFFER in) · #203 (adjudicate from PER-ARM rows).
 *
 * INSTRUMENT-ONLY: zero src/** changes (xSrcZero is a HARD gate). Both seams stay dormant
 * and born-absent; the only thing this stage adds is a probe-side selection loop.
 *
 * THE QUESTION. MT-T1 (#204) proved the sag delivers the body (−2.41 m) but at gene = 1 on
 * BOTH teams the offensive equilibrium deflates (goals 2.195 → 1.61375, headers −46 %). The
 * user ruled 甲: don't hand-pick a dose — arm the two evolution opt-ins, keep fitness
 * WIN-ONLY, start the genes ABSENT, and measure WHERE SELECTION SETTLES them and whether the
 * equilibrium restores there.
 *
 * MODES:  MTT2_MODE=smoke (default) — plumbing only, ADJUDICATES NOTHING
 *         MTT2_MODE=full            — the pre-registered experiment
 *         MTT2_SEEDS=<n>            — accepted in SMOKE ONLY (turns gNDerived RED in full)
 *         MTT2_RESUME=1             — RESILIENCE ONLY: restore already-finished (pass, seed)
 *                                     units from the scratch checkpoint (§15.5). Refuses to
 *                                     resume across a changed HEAD / probe / src / config.
 *         MTT2_CHECKPOINT=<path>    — the scratch checkpoint file (default
 *                                     /tmp/mt-t2-checkpoint.jsonl). NEVER committed.
 *
 * ⚠ THE CHECKPOINT CHANGES NO MEASUREMENT. It stores the EXACT per-seed unit of work the
 * uninterrupted path produces and replays it; every pooled level, CI, gate, digest and the
 * `resultSha256` are recomputed from the union exactly as before, so a resumed run is
 * BYTE-IDENTICAL to an uninterrupted one (proved at smoke scale in the stage doc's
 * §CHECKPOINT/RESUME appendix). See §15.5.
 *
 * EXIT SEMANTICS (the commander's monitor reads these):
 *   0 — X-family green, and the outcome is (i) SELECTION ENGAGES + RESTORES, or a MIXED
 *       form (reported as-is; a mixture is a RESULT, not a failure)
 *   1 — an X-family HARD gate failed ⇒ the MEASUREMENT is invalid, read nothing else
 *   2 — the run is CLEAN and a PRE-NAMED NEGATIVE outcome fired: (ii) SELECTION REJECTS
 *       (honest UNSUPPORTED) or (iii) SELECTION MAXES + EQUILIBRIUM STAYS DEFLATED.
 *       ⚠ (ii) and (iii) are NEGATIVE FINDINGS, not measurement failures — exit 2 says
 *       "a fork returns to the user", never "the instrument broke".
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { formationSpot, runTarget } from '../../src/ai/formations';
import {
  crossoverGenomes, markSagWeight, mutateGenome, pmLaneConvergenceK, randomGenome,
  type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const wall0 = Date.now();

/* ========================================================================== */
/* §0 MODE / ENV                                                              */
/* ========================================================================== */
const MODE = (process.env.MTT2_MODE ?? 'smoke') as 'smoke' | 'full';
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('MT-T2 FATAL — MTT2_MODE must be `smoke` or `full`.');
  process.exit(2);
}
const SEEDS_ENV = process.env.MTT2_SEEDS === undefined
  ? null : Math.max(1, Number.parseInt(process.env.MTT2_SEEDS, 10));
const OUT_PATH = process.env.MTT2_OUT ?? (MODE === 'smoke'
  ? 'docs/world-model/data/mt-t2-coevolution-smoke.json'
  : 'docs/world-model/data/mt-t2-coevolution.json');
const SMOKE_PATH = 'docs/world-model/data/mt-t2-coevolution-smoke.json';
const RULER_PATH = 'docs/world-model/data/mt-t1-ruler-rerun.json';

/* ========================================================================== */
/* §1 THE FROZEN DESIGN — THE TWO ARMS (stage doc §2)                         */
/* ========================================================================== */
/**
 * ⭐ THE ARMS DIFFER IN EXACTLY TWO BOOLEANS — the two `MutateOptions` EVOLUTION opt-ins.
 * BOTH arms carry the two CONSUMPTION flags (`pmLaneConvergence`, `mtMarkSag`) ON, so the
 * two seam branches are ENTERED in both arms; in CONTROL the genes are never written by the
 * mutation law, so both weights evaluate to 0 on every tick (MT-T1's ARMEDZERO arm, proven
 * byte-identical to the flags-off world there, is exactly CONTROL's world here). Making the
 * consumption flags COMMON is what reduces the A/B to ONE difference: whether selection may
 * touch the two genes at all.
 */
interface ArmSpec {
  readonly id: string;
  readonly evolveMarkSag: boolean;
  readonly evolveDefLaneConvergence: boolean;
  readonly what: string;
}
const ARMS = [
  {
    id: 'ARMED', evolveMarkSag: true, evolveDefLaneConvergence: true,
    what: 'BOTH evolution opt-ins TRUE — the genes may enter the population through mutation '
      + 'and crossover from their born-absent state. NOTHING is pre-seeded.',
  },
  {
    id: 'CONTROL', evolveMarkSag: false, evolveDefLaneConvergence: false,
    what: 'BOTH evolution opt-ins FALSE — identical league seeds, identical founders, '
      + 'identical fitness; the two genes stay STRUCTURALLY ABSENT for all generations.',
  },
] as const satisfies readonly ArmSpec[];
type ArmId = (typeof ARMS)[number]['id'];
const ARM_IDS = ARMS.map((a) => a.id) as ArmId[];
const specOf = (a: ArmId): ArmSpec => ARMS[ARM_IDS.indexOf(a)];
/** BOTH arms consume: the seam branches are live in both worlds (see the note above). */
const CONSUME_FLAGS = { pmLaneConvergence: true, mtMarkSag: true } as const;
/** §2.3 the world: the percept-armed substrate PM-T0/PM-T1/MT-T1's receipts ran in. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;
/** The two genes under selection. */
const NEW_GENES = ['markSag', 'defLaneConvergence'] as const;
type NewGene = (typeof NEW_GENES)[number];

/* --- §3 THE HORIZON — traced, not invented ---------------------------------- */
/**
 * ⭐ TRACED FROM TWO PRECEDENTS, both named by the dispatch (#205.2):
 *  (a) the vision/positioning CO-EVOLUTION arc (docs/ROADMAP.md, 2026-07-20): its reads are
 *      @8 seasons (attack leads: goals 2.47) and @25 seasons (the lead CLOSED: 3.09,
 *      interceptions +27 %). Those two read points ARE the co-evolution shape, so the
 *      horizon must reach 25 and must publish gen 8.
 *  (b) A4-S2P3 §5.5 LEG S: 10 teams · single round robin (45 matches) · elite 2 / reborn 2 /
 *      mutated 6 · rate/scale pairs verbatim from `evolveGroup`. Its 20-generation horizon is
 *      the other anchor; 25 CONTAINS it and is chosen for (a)'s second read point.
 */
const GENS = 25;
const READ_POINTS = [8, GENS] as const;          // 1-indexed generations (gen 8 and the final)
const TEAMS = 10;
const MATCHES_PER_GEN = (TEAMS * (TEAMS - 1)) / 2;   // 45 — a single round robin
const ELITE_N = 2;
const REBORN_N = 2;
const MUT_RATE = 0.4; const MUT_SCALE = 0.08;        // evolveGroup 'mutated', verbatim
const REBORN_RATE = 0.5; const REBORN_SCALE = 0.15;  // evolveGroup 'reborn', verbatim
/** The POST-EVOLUTION body instrument: matches per league seed, per dose. */
const BODY_N = 40;

/* --- §4 the seed ledger ----------------------------------------------------- */
const RESERVED_BAND: readonly [number, number] = [12_320_000, 12_419_999];
const SMOKE_BASE = 12_320_000;
const SMOKE_BODY_BASE = 12_325_000;
const FULL_BASE = 12_330_000;
const BODY_BASE = 12_410_000;
const LEAGUE_STRIDE = 3_000;   // ≥ GENS × GEN_STRIDE = 2,500
const GEN_STRIDE = 100;        // ≥ MATCHES_PER_GEN = 45
const BODY_STRIDE = 100;       // ≥ BODY_N = 40
/** Honest hard caps on the sized seed count (a SEED/WALL budget, not a statistical claim). */
const SEEDS_MIN = 6;
const SEEDS_MAX = 24;
/** Evolution RNG — a THIRD namespace (neither a match seed nor a stats seed), Leg-S form. */
const EVO_RNG_BASE = 771_001;
/** The NEUTRAL-DRIFT shadow's own namespace — a FOURTH, so it perturbs nothing. */
const DRIFT_RNG_BASE = 772_001;
/** Every block the A4/O/PM/MT arc has consumed (MT-T1's ledger + MT-T1's own band). */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
];
/** §4: the stats stream — a SEPARATE namespace. MT-T1's base was 103,600 ⇒ +200 floor (#163). */
const BOOTSTRAP_SEED = 103_800;
const RESERVED_STATS_SEED = 104_000;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  101_403, 102_000, 102_200, 102_400, 102_600, 102_800, 103_000, 103_200, 103_400, 103_600,
];

/* --- §5 THE SEED-COUNT RULE, frozen ex ante --------------------------------- */
const WALL_BUDGET_HOURS = 4.0;
const XDET_FACTOR = 2;
/** matches charged per league seed: both arms' full evolution runs + the armed arm's
 *  post-evolution body instrument at TWO doses. */
const MATCHES_PER_SEED = GENS * MATCHES_PER_GEN * ARM_IDS.length + BODY_N * 2;
/** #188's published per-match cost — the PRIOR used when no committed smoke exists yet. */
const PUB188_MS_PER_MATCH = 102.21;

/* --- §6 THE INHERITED RULER: the equilibrium band --------------------------- */
/** Inherited VERBATIM from A4-S2P3-GENE-BATTERY §4.2 via PM-T1 §5.5 and MT-T1 §5.5,
 *  INCLUDING goals and INCLUDING the declared SUBSTRATE-DRIFT caveat (a dimension the
 *  CONTROL arm itself fails at the same read point is DISCLOSED and EXCLUDED from the gate). */
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;
type BandKey = keyof typeof BAND_BASELINE;
const BAND_KEYS = Object.keys(BAND_BASELINE) as BandKey[];

/* --- §7 THE FROZEN OUTCOME THRESHOLDS --------------------------------------- */
/**
 * ⭐ GENE_ZERO_EPS — the "gene mass stays/returns ~0" cut. TRACED to the Leg-S form: A4-S2P3
 * §5.3's frozen sign dead-zone `LEGS_SIGN_EPS = 0.02` is the value that stage froze for
 * "this gene coordinate is indistinguishable from zero". Re-used unchanged.
 */
const GENE_ZERO_EPS = 0.02;
/**
 * ⭐ GENE_HIGH — the "selection MAXES the genes" cut. TRACED to `randomGenome`'s own birth
 * range (`src/evolution/genome.ts`: `for (const k of GENE_KEYS) g[k] = rng.range(0.15, 0.85);`):
 * 0.85 is the TOP of the interval any incumbent gene is ever born into, so a new gene sitting
 * at or above it has been driven higher than the substrate ever hands out at birth. Not a
 * chosen number.
 */
const GENE_HIGH = 0.85;

/* --- §8 the #188 / PM-T1 body-instrument constants, inherited VERBATIM ------ */
const OWN_THIRD_LOCAL_X = -HALF_L / 3;
const FLANK_ABS_Y = BOX_WIDTH / 2;
const MIN_EPISODE_TICKS = 30;
const SPREAD_R = 9;
const SAMPLE_EVERY = 10;      // 6 Hz
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;
const DUP_RUN_M = 4;

/* --- §9 the X-family pins --------------------------------------------------- */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/** The REPORTED attack-side gene pool — "does attack's existing gene pool shift in
 *  response?" (#205.2). Frozen list, reported per generation, NEVER gated. */
const ATTACK_GENES = [
  'attackingWidth', 'tempo', 'shootBias', 'riskTolerance', 'supportDistance',
  'pressIntensity', 'transitionPress', 'defensiveCompactness',
] as const;

/* ========================================================================== */
/* §10 HELPERS                                                                */
/* ========================================================================== */
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const pctlSorted = (s: readonly number[], q: number): number => {
  if (s.length === 0) return Number.NaN;
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};
const quantile = (xs: readonly number[], q: number): number => pctlSorted([...xs].sort((a, b) => a - b), q);
const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }): number => Math.hypot(a.x - b.x, a.y - b.y);
const canonical = (v: unknown): string => {
  const w = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(w);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = w(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(w(v));
};
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');

interface Contrast {
  point: number; lower: number; upper: number; n: number; resolved: boolean;
  resolvedBelowZero: boolean; resolvedAboveZero: boolean;
}
/** Percentile bootstrap over the CLUSTER (the league seed) — the arc's standing form. */
const bootstrapCI = (xs: readonly number[], seed: number): Contrast => {
  const clean = xs.filter(Number.isFinite);
  if (clean.length === 0) {
    return { point: Number.NaN, lower: Number.NaN, upper: Number.NaN, n: 0, resolved: false, resolvedBelowZero: false, resolvedAboveZero: false };
  }
  const rng = new Rng(seed);
  const means: number[] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    let s = 0;
    for (let i = 0; i < clean.length; i++) s += clean[Math.floor(rng.next() * clean.length)];
    means.push(s / clean.length);
  }
  means.sort((a, b) => a - b);
  const lower = round(pctlSorted(means, 0.025), 6);
  const upper = round(pctlSorted(means, 0.975), 6);
  const resolved = (lower > 0 && upper > 0) || (lower < 0 && upper < 0);
  return {
    point: round(mean(clean), 6), lower, upper, n: clean.length, resolved,
    resolvedBelowZero: upper < 0, resolvedAboveZero: lower > 0,
  };
};
/** A one-sample CI on a LEVEL (used for "is the armed goals level above MT-T1's 1.61375?"). */
const bootstrapLevel = (xs: readonly number[], seed: number): Contrast => bootstrapCI(xs, seed);

/* ========================================================================== */
/* §11 THE WORLD — one match between two evolving populations                  */
/* ========================================================================== */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/** Write a population genome onto ALL THREE genome views of one side — the `a4World`
 *  `armGenes` idiom, i.e. the REAL gene channel (#196.3-D6: no engine-side dose surface).
 *  Absent keys are written NOWHERE, so a control genome stays byte-absent. */
const applyGenome = (m: Match, side: Side, g: TacticalGenome): void => {
  const t = m.teams[side];
  for (const gg of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
    for (const k of NEW_GENES) {
      const v = g[k];
      if (v !== undefined) gg[k] = v;
      else delete gg[k];
    }
    // the incumbent gene pool travels too — the population IS the coach's ideas
    for (const k of Object.keys(g) as (keyof TacticalGenome)[]) {
      if ((NEW_GENES as readonly string[]).includes(k as string)) continue;
      const v = g[k];
      if (typeof v === 'number') (gg as unknown as Record<string, number>)[k as string] = v;
    }
  }
};

const matchOf = (seed: number, ga: TacticalGenome, gb: TacticalGenome): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...PERCEPT_FLAGS, ...CONSUME_FLAGS,
  } as ConstructorParameters<typeof Match>[0]);
  applyGenome(m, 0, ga);
  applyGenome(m, 1, gb);
  return m;
};

/** Whole-match signature INCLUDING the rng stream (the PM-T0/PM-T1/MT-T1 form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

interface MatchRates {
  goals: number; crosses: number; headers: number; longBalls: number; cutbacks: number;
  offsides: number; fouls: number; penalties: number; thirdMan: number; overlaps: number;
}
const ratesOf = (m: Match): MatchRates => {
  const st = [m.teams[0].stats, m.teams[1].stats];
  return {
    goals: st[0].goals + st[1].goals,
    crosses: st[0].crosses + st[1].crosses,
    headers: st[0].headersWon + st[1].headersWon,   // the band's `headers` dimension, MT-T1 :701 verbatim
    longBalls: st[0].longBalls + st[1].longBalls,
    cutbacks: st[0].cutbacks + st[1].cutbacks,
    offsides: st[0].offsides + st[1].offsides,
    fouls: st[0].fouls + st[1].fouls,
    penalties: st[0].penalties + st[1].penalties,
    thirdMan: st[0].thirdMan + st[1].thirdMan,
    overlaps: st[0].overlaps + st[1].overlaps,
  };
};
const RATE_KEYS = ['goals', 'crosses', 'headers', 'longBalls', 'cutbacks',
  'offsides', 'fouls', 'penalties', 'thirdMan', 'overlaps'] as const;
const meanRates = (rows: readonly MatchRates[]): MatchRates => Object.fromEntries(
  RATE_KEYS.map((k) => [k, round(mean(rows.map((r) => r[k])), 6)]),
) as unknown as MatchRates;

/* ========================================================================== */
/* §12 FITNESS — WIN-ONLY (#167 Leg-S rule), and PROVABLY BLIND to the genes   */
/* ========================================================================== */
/**
 * Points 3/1/0 with goal difference as a 1e-3 tiebreak — A4-S2P3 §5.2's own line, verbatim,
 * itself the probe-side simplification of `src/evolution/fitness.ts` (shotQuality /
 * styleConsistency need `SeasonAggregates` this probe does not build).
 * ⭐ ITS ONLY INPUTS ARE THE SEASON TABLE. No genome is in scope. `gFitnessBlind` proves it
 * two ways: this signature takes no genome, AND `src/evolution/fitness.ts` + `src/sim/League.ts`
 * contain ZERO occurrences of either gene name.
 */
const fitnessOf = (points: readonly number[], gd: readonly number[]): number[] =>
  points.map((p, i) => p + gd[i] * 1e-3);

/* ========================================================================== */
/* §13 THE SELECTION LOOP — the Leg-S mirror of `evolveGroup`'s band law       */
/* ========================================================================== */
interface EvoTeam { slot: number; genome: TacticalGenome }
interface GenStat {
  gen: number;
  geneMean: Record<NewGene, number>;
  geneSd: Record<NewGene, number>;
  geneMax: Record<NewGene, number>;
  genePresentFraction: Record<NewGene, number>;
  geneAboveEpsFraction: Record<NewGene, number>;
  /** the NEUTRAL-DRIFT shadow (CONTROL arm only): the same mutation law on inert passengers */
  driftMean: Record<NewGene, number> | null;
  driftSd: Record<NewGene, number> | null;
  attackGeneMean: Record<string, number>;
  attackGeneSd: Record<string, number>;
  rates: MatchRates;
  fitnessGeneCorrelation: Record<NewGene, number>;
}
interface RunOut {
  leagueSeed: number; arm: ArmId; gens: GenStat[];
  gen0BornAbsent: boolean; matchesPlayed: number;
  finalPop: TacticalGenome[];
}

const pearson = (a: readonly number[], b: readonly number[]): number => {
  const n = Math.min(a.length, b.length);
  if (n < 3) return Number.NaN;
  const ma = mean(a.slice(0, n)); const mb = mean(b.slice(0, n));
  let sab = 0; let saa = 0; let sbb = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - ma; const db = b[i] - mb;
    sab += da * db; saa += da * da; sbb += db * db;
  }
  return (saa === 0 || sbb === 0) ? Number.NaN : sab / Math.sqrt(saa * sbb);
};
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

const runEvolution = (
  arm: ArmId, leagueSeed: number, seedIdx: number, teamsN: number, gens: number,
): RunOut => {
  const s = specOf(arm);
  const opts = { evolveMarkSag: s.evolveMarkSag, evolveDefLaneConvergence: s.evolveDefLaneConvergence };
  const evoRng = new Rng(EVO_RNG_BASE + seedIdx);
  const driftRng = new Rng(DRIFT_RNG_BASE + seedIdx);
  const initRng = new Rng(leagueSeed);
  let pop: EvoTeam[] = Array.from({ length: teamsN }, (_, slot) => ({ slot, genome: randomGenome(initRng) }));
  /** ⭐ gen-0 BIRTH NEUTRALITY: every founder carries BOTH genes ABSENT. Asserted, not assumed. */
  const gen0BornAbsent = pop.every((t) => NEW_GENES.every((k) => t.genome[k] === undefined));
  /** the NEUTRAL-DRIFT shadow — CONTROL only: inert passengers mutated by the SAME law with
   *  their own RNG namespace, inherited through the SAME elite/mutate/reborn assignments.
   *  They touch NO match, so this is what the gene levels look like with ZERO selection on
   *  them while selection on everything else runs exactly as it really did. */
  let shadow: Record<NewGene, number>[] | null = arm === 'CONTROL'
    ? Array.from({ length: teamsN }, () => ({ markSag: 0, defLaneConvergence: 0 })) : null;

  const eliteN = Math.min(ELITE_N, teamsN - 1);
  const rebornN = Math.min(REBORN_N, Math.max(0, teamsN - eliteN - 1));
  const out: GenStat[] = [];
  let matchesPlayed = 0;

  for (let gen = 0; gen < gens; gen++) {
    const points = new Array<number>(teamsN).fill(0);
    const gd = new Array<number>(teamsN).fill(0);
    const rows: MatchRates[] = [];
    let idx = 0;
    for (let a = 0; a < teamsN; a++) {
      for (let b = a + 1; b < teamsN; b++) {
        const seed = leagueSeed + gen * GEN_STRIDE + idx;
        idx += 1;
        const m = matchOf(seed, pop[a].genome, pop[b].genome);
        while (!m.finished) m.step(DT);
        matchesPlayed += 1;
        rows.push(ratesOf(m));
        const ga = m.teams[0].stats.goals; const gb = m.teams[1].stats.goals;
        gd[a] += ga - gb; gd[b] += gb - ga;
        if (ga > gb) points[a] += 3; else if (gb > ga) points[b] += 3; else { points[a] += 1; points[b] += 1; }
      }
    }
    const fitness = fitnessOf(points, gd);

    /* --- the observation, BEFORE selection acts on this generation ---------- */
    const valuesOf = (k: NewGene): number[] => pop.map((t) => t.genome[k] ?? 0);
    const geneMean = {} as Record<NewGene, number>;
    const geneSd = {} as Record<NewGene, number>;
    const geneMax = {} as Record<NewGene, number>;
    const genePresentFraction = {} as Record<NewGene, number>;
    const geneAboveEpsFraction = {} as Record<NewGene, number>;
    const fitnessGeneCorrelation = {} as Record<NewGene, number>;
    for (const k of NEW_GENES) {
      const v = valuesOf(k);
      geneMean[k] = round(mean(v), 6);
      geneSd[k] = round(sd(v), 6);
      geneMax[k] = round(Math.max(0, ...v), 6);
      genePresentFraction[k] = round(pop.filter((t) => t.genome[k] !== undefined).length / teamsN, 4);
      geneAboveEpsFraction[k] = round(v.filter((x) => x > GENE_ZERO_EPS).length / teamsN, 4);
      fitnessGeneCorrelation[k] = round(pearson(v, fitness), 4);
    }
    const attackGeneMean: Record<string, number> = {};
    const attackGeneSd: Record<string, number> = {};
    for (const k of ATTACK_GENES) {
      const v = pop.map((t) => (t.genome as unknown as Record<string, number>)[k] ?? Number.NaN);
      attackGeneMean[k] = round(mean(v.filter(Number.isFinite)), 6);
      attackGeneSd[k] = round(sd(v.filter(Number.isFinite)), 6);
    }
    out.push({
      gen: gen + 1,
      geneMean, geneSd, geneMax, genePresentFraction, geneAboveEpsFraction,
      driftMean: shadow === null ? null : Object.fromEntries(
        NEW_GENES.map((k) => [k, round(mean(shadow!.map((r) => r[k])), 6)]),
      ) as Record<NewGene, number>,
      driftSd: shadow === null ? null : Object.fromEntries(
        NEW_GENES.map((k) => [k, round(sd(shadow!.map((r) => r[k])), 6)]),
      ) as Record<NewGene, number>,
      attackGeneMean, attackGeneSd,
      rates: meanRates(rows),
      fitnessGeneCorrelation,
    });

    if (gen === gens - 1) break;

    /* --- selection: evolveGroup's band law, mirrored VERBATIM --------------- */
    const order = [...pop].sort((x, y) => fitness[y.slot] - fitness[x.slot] || x.slot - y.slot);
    const pool = order.slice(0, 4);
    const pickParent = (exclude?: EvoTeam): EvoTeam => {
      const cands = pool.filter((f) => f !== exclude);
      const weights = cands.map((f) => 4 - pool.indexOf(f));
      const totalW = weights.reduce((a, b) => a + b, 0);
      let r = evoRng.next() * totalW;
      for (let i = 0; i < cands.length; i++) { r -= weights[i]; if (r <= 0) return cands[i]; }
      return cands[cands.length - 1];
    };
    const rebornFrom = order.length - rebornN;
    const nextShadow: Record<NewGene, number>[] | null = shadow === null ? null : [];
    const next: EvoTeam[] = [];
    order.forEach((f, rank) => {
      const sh = shadow === null ? null : { ...shadow[f.slot] };
      if (rank < eliteN) {
        next.push({ slot: f.slot, genome: f.genome });
        if (sh !== null) nextShadow!.push(sh);           // elites carry theirs unchanged
        return;
      }
      if (rank < rebornFrom) {
        next.push({ slot: f.slot, genome: mutateGenome(f.genome, evoRng, { rate: MUT_RATE, scale: MUT_SCALE, ...opts }) });
        if (sh !== null) {
          for (const k of NEW_GENES) if (driftRng.chance(MUT_RATE)) sh[k] = clamp01(sh[k] + driftRng.gaussian() * MUT_SCALE);
          nextShadow!.push(sh);
        }
        return;
      }
      const pa = pickParent(); const pb = pickParent(pa);
      next.push({
        slot: f.slot,
        genome: mutateGenome(
          crossoverGenomes(pa.genome, pb.genome, evoRng, false, false,
            specOf(arm).evolveDefLaneConvergence, specOf(arm).evolveMarkSag),
          evoRng, { rate: REBORN_RATE, scale: REBORN_SCALE, ...opts },
        ),
      });
      if (sh !== null) {
        const sa = shadow![pa.slot]; const sb = shadow![pb.slot];
        for (const k of NEW_GENES) {
          const r = driftRng.next();
          const child = r < 0.4 ? sa[k] : r < 0.8 ? sb[k] : (sa[k] + sb[k]) / 2;
          sh[k] = driftRng.chance(REBORN_RATE) ? clamp01(child + driftRng.gaussian() * REBORN_SCALE) : child;
        }
        nextShadow!.push(sh);
      }
    });
    // re-key by slot so the shadow stays aligned with its franchise
    const bySlot = new Map<number, Record<NewGene, number>>();
    if (nextShadow !== null) order.forEach((f, i) => bySlot.set(f.slot, nextShadow[i]));
    pop = next.sort((x, y) => x.slot - y.slot);
    shadow = nextShadow === null ? null : pop.map((t) => bySlot.get(t.slot)!);
  }
  return { leagueSeed, arm, gens: out, gen0BornAbsent, matchesPlayed, finalPop: pop.map((t) => ({ ...t.genome })) };
};

/* ========================================================================== */
/* §14 THE POST-EVOLUTION BODY INSTRUMENT (MT-T1's gated quantities, reused)   */
/* ========================================================================== */
/**
 * ⭐ THE EVOLVED-DOSE BODY READ. MT-T1 measured the body at gene = 1 (a hand-set dose). This
 * stage asks whether the compression SURVIVES at whatever dose selection chose: the ARMED
 * arm's final-generation genomes are played against themselves TWICE — once as evolved
 * (EVOLVED), once with the two new genes DELETED (ZEROED) — and the #188 weak-side-back
 * body quantities are contrasted, paired on the league seed. Same genomes, same seeds, same
 * flags: the ONLY difference is whether the two evolved gene values are present.
 */
interface BodyRow { bodyLatGap: number; shortfall: number; detach: number; episodes: number }
const walkBody = (seed: number, ga: TacticalGenome, gb: TacticalGenome): BodyRow => {
  const m = matchOf(seed, ga, gb);
  const bodyGaps: number[] = []; const shorts: number[] = []; const detaches: number[] = [];
  let episodes = 0;
  let openKey: string | null = null; let ticks = 0;
  let defSide: Side = 0; let flankSign: 1 | -1 = 1; let weakIdx: 3 | 4 = 3;
  let epBody: number[] = []; let epShort: number[] = []; let epDetach: number[] = [];
  const closeEpisode = (): void => {
    if (openKey !== null && ticks >= MIN_EPISODE_TICKS && epBody.length > 0) {
      episodes += 1;
      bodyGaps.push(mean(epBody)); shorts.push(mean(epShort)); detaches.push(mean(epDetach));
    }
    openKey = null;
  };
  while (!m.finished) {
    m.step(DT);
    if (m.finished) break;
    const a = m.possessionSide;
    const owner = m.ball.owner;
    const inTrigger = m.phase === 'playing' && m.restart === null && a !== -1
      && owner !== null && owner.side === a && owner.role !== 'GK'
      && m.teams[(1 - a) as Side].localX(m.ball.pos.x) < OWN_THIRD_LOCAL_X
      && Math.abs(m.ball.pos.y) >= FLANK_ABS_Y;
    if (!inTrigger) { closeEpisode(); continue; }
    const d = (1 - a) as Side;
    const fs: 1 | -1 = m.ball.pos.y > 0 ? 1 : -1;
    const key = `${d}|${fs}`;
    if (openKey !== key) {
      closeEpisode();
      openKey = key; ticks = 0; defSide = d; flankSign = fs; weakIdx = fs > 0 ? 3 : 4;
      epBody = []; epShort = []; epDetach = [];
    }
    ticks += 1;
    const dTeam = m.teams[defSide];
    const weak = dTeam.players[weakIdx];
    if (weak === undefined || weak.sentOff) { openKey = null; continue; }
    const bodyGap = Math.abs(weak.pos.y - m.ball.pos.y);
    epBody.push(bodyGap);
    epShort.push(Math.max(0, bodyGap - SPREAD_R));
    let cx = 0; let cy = 0; let n = 0;
    for (const q of dTeam.players) {
      if (q === weak || q.role === 'GK' || q.sentOff) continue;
      cx += q.pos.x; cy += q.pos.y; n += 1;
    }
    epDetach.push(n === 0 ? Number.NaN : Math.hypot(weak.pos.x - cx / n, weak.pos.y - cy / n));
  }
  closeEpisode();
  return {
    bodyLatGap: mean(bodyGaps), shortfall: mean(shorts),
    detach: mean(detaches.filter(Number.isFinite)), episodes,
  };
};
const zeroed = (g: TacticalGenome): TacticalGenome => {
  const out = { ...g };
  for (const k of NEW_GENES) delete out[k];
  return out;
};

/* ========================================================================== */
/* §15 SIZING — the frozen seed-count rule                                    */
/* ========================================================================== */
const smokeArtifact = (() => {
  if (MODE !== 'full' || !existsSync(SMOKE_PATH)) return null;
  const raw = readFileSync(SMOKE_PATH, 'utf8');
  try {
    const j = JSON.parse(raw) as { sizing?: { msPerMatch?: number }; resultSha256?: string };
    return { sha256: sha(raw), msPerMatch: j.sizing?.msPerMatch ?? null, resultSha256: j.resultSha256 ?? null };
  } catch { return null; }
})();
const msPerMatchPrior = smokeArtifact?.msPerMatch ?? PUB188_MS_PER_MATCH;
const seedsDerived = (() => {
  const perSeedMs = msPerMatchPrior * MATCHES_PER_SEED * XDET_FACTOR;
  const affordable = Math.floor((WALL_BUDGET_HOURS * 3_600_000) / perSeedMs);
  return {
    msPerMatchPrior: round(msPerMatchPrior, 3),
    matchesPerSeed: MATCHES_PER_SEED,
    perSeedSeconds: round(perSeedMs / 1000, 1),
    affordable,
    seedsStar: Math.max(SEEDS_MIN, Math.min(SEEDS_MAX, affordable)),
    capBinds: affordable > SEEDS_MAX ? 'SEEDS_MAX' : affordable < SEEDS_MIN ? 'SEEDS_MIN' : 'none',
    arithmetic: 'SEEDS* = clamp( floor( 4.0 h / (ms_per_match × matchesPerSeed × 2 X-DET) ), 6, 24 ) '
      + '· matchesPerSeed = 25 gens × 45 matches × 2 arms + 40 body matches × 2 doses = 2,330 '
      + '— frozen in stage doc §5. ms_per_match comes from the COMMITTED smoke artifact; with no '
      + 'smoke on disk the #188 published prior 102.21 ms is used and that is disclosed here.',
    source: smokeArtifact === null ? '#188 published prior (no committed smoke artifact found)' : SMOKE_PATH,
    smokeArtifactSha256: smokeArtifact?.sha256 ?? null,
  };
})();

const SMOKE_SEEDS = 1; const SMOKE_TEAMS = 6; const SMOKE_GENS = 3; const SMOKE_BODY_N = 4;
const RUN_SEEDS = MODE === 'smoke' ? (SEEDS_ENV ?? SMOKE_SEEDS) : (SEEDS_ENV ?? seedsDerived.seedsStar);
const RUN_TEAMS = MODE === 'smoke' ? SMOKE_TEAMS : TEAMS;
const RUN_GENS = MODE === 'smoke' ? SMOKE_GENS : GENS;
const RUN_BODY_N = MODE === 'smoke' ? SMOKE_BODY_N : BODY_N;
const RUN_BASE = MODE === 'smoke' ? SMOKE_BASE : FULL_BASE;
const RUN_BODY_BASE = MODE === 'smoke' ? SMOKE_BODY_BASE : BODY_BASE;

/* ========================================================================== */
/* §16 THE CORE (computed TWICE for X-DET)                                    */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`  [mt-t2] ${s}\n`); };
banner(`MODE ${MODE} · seeds ${RUN_SEEDS} · teams ${RUN_TEAMS} · gens ${RUN_GENS} · body ${RUN_BODY_N}`);
banner(`arms ${ARM_IDS.join(' vs ')} — the ONLY difference is the two MutateOptions opt-ins`);

interface SeedOut {
  seedIdx: number; leagueSeed: number;
  runs: Record<ArmId, RunOut>;
  body: { evolved: BodyRow[]; zeroedRows: BodyRow[] };
}
interface Core {
  seeds: SeedOut[]; matchesPlayed: number; gen0Identical: boolean[];
  /** RESILIENCE ONLY, timing: the true compute cost of pass-1's seeds, summed across
   *  processes when the run was resumed (skipped seeds contribute their ORIGINAL cost). */
  costMs: number;
  restored: string[]; computed: string[];
}

/* ========================================================================== */
/* §15.5 CHECKPOINT / RESUME — RESILIENCE ONLY, MEASURES NOTHING              */
/* ========================================================================== */
/**
 * ⭐ WHY THIS EXISTS. The frozen full run (24 seeds × 2 arms × 25 gens × 2 X-DET passes,
 * ≈ 3 h) was silently killed THREE times between 3 and 75 minutes in by an external killer
 * that is not OOM and not the user, and that survived every launch channel tried. The probe
 * wrote its artifact only at the very end, so each kill cost the entire run. This block makes
 * a kill cost AT MOST ONE SEED.
 *
 * ⭐ WHY IT CANNOT MOVE A NUMBER. The checkpointed unit is exactly the `SeedOut` the
 * uninterrupted loop builds — the two arms' whole `RunOut`s plus the body block — and it is
 * stored per (PASS, SEED). Nothing pooled is stored: every level, CI, band row, gate, digest
 * and `resultSha256` is recomputed downstream from the union of restored + freshly computed
 * seeds, by the same code, in the same order. `SeedOut` is pure data (numbers, booleans,
 * absent optional gene keys), so a JSON round trip is lossless — with ONE trap handled
 * explicitly: `JSON.stringify` maps `NaN` to `null`, and a `null` would silently arithmetic
 * as 0 downstream. Non-finite numbers are therefore encoded with a sentinel and every record
 * is verified by (a) a payload hash and (b) an encode(decode(encode(x))) === encode(x)
 * round-trip identity before it is trusted. A record that fails either check is DISCARDED and
 * its seed is recomputed.
 *
 * ⭐ WHY RESUMING IS GUARDED. Resuming across a code change would silently mix two worlds.
 * The header pins the full git HEAD, a hash of THIS probe file, a hash of `git diff -- src`,
 * the mode, and a hash of the frozen-config echo (arms, seeds, strides, RNG bases, horizon,
 * thresholds, band). Any mismatch ⇒ REFUSE, exit 1.
 *
 * The file lives under /tmp: it is SCRATCH, never committed, and never read by any gate.
 */
const CKPT_PATH = process.env.MTT2_CHECKPOINT ?? '/tmp/mt-t2-checkpoint.jsonl';
const RESUME = process.env.MTT2_RESUME === '1';
const PROBE_SELF_PATH = 'scripts/probes/mt-t2-coevolution.ts';
const gitSay = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'git-unavailable'; }
};

/** the NaN-safe transport (see the trap note above) */
const NONFINITE_TAG = '__nonFinite__';
const encTransport = (v: unknown): unknown => {
  if (typeof v === 'number' && !Number.isFinite(v)) {
    return { [NONFINITE_TAG]: Number.isNaN(v) ? 'NaN' : v > 0 ? 'Infinity' : '-Infinity' };
  }
  if (Array.isArray(v)) return v.map(encTransport);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o)) out[k] = encTransport(o[k]);
    return out;
  }
  return v;
};
const decTransport = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(decTransport);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const keys = Object.keys(o);
    if (keys.length === 1 && keys[0] === NONFINITE_TAG) {
      const t = o[NONFINITE_TAG];
      return t === 'NaN' ? Number.NaN : t === 'Infinity' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    const out: Record<string, unknown> = {};
    for (const k of keys) out[k] = decTransport(o[k]);
    return out;
  }
  return v;
};
const encodeSeedOut = (s: SeedOut): string => JSON.stringify(encTransport(s));

/** the guard: what a checkpoint may be resumed INTO */
const ckptConfigEcho = {
  mode: MODE, runSeeds: RUN_SEEDS, runTeams: RUN_TEAMS, runGens: RUN_GENS,
  runBodyN: RUN_BODY_N, runBase: RUN_BASE, runBodyBase: RUN_BODY_BASE,
  leagueStride: LEAGUE_STRIDE, genStride: GEN_STRIDE, bodyStride: BODY_STRIDE,
  eliteN: ELITE_N, rebornN: REBORN_N,
  mutRate: MUT_RATE, mutScale: MUT_SCALE, rebornRate: REBORN_RATE, rebornScale: REBORN_SCALE,
  evoRngBase: EVO_RNG_BASE, driftRngBase: DRIFT_RNG_BASE,
  arms: ARMS.map((a) => ({ id: a.id, evolveMarkSag: a.evolveMarkSag, evolveDefLaneConvergence: a.evolveDefLaneConvergence })),
  consumeFlags: CONSUME_FLAGS, perceptFlags: PERCEPT_FLAGS, newGenes: NEW_GENES,
  geneZeroEps: GENE_ZERO_EPS, geneHigh: GENE_HIGH,
  band: { baseline: BAND_BASELINE, tolerance: BAND_TOLERANCE },
  readPoints: READ_POINTS, bootstrapSeed: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES,
  smokeArtifactSha256: seedsDerived.smokeArtifactSha256, seedsStar: seedsDerived.seedsStar,
};
const ckptHeader = {
  kind: 'header' as const,
  version: 1,
  headFull: gitSay('git rev-parse HEAD'),
  probeSha256: existsSync(PROBE_SELF_PATH) ? sha(readFileSync(PROBE_SELF_PATH, 'utf8')) : 'probe-unreadable',
  srcDiffSha256: sha(gitSay('git diff -- src')),
  mode: MODE,
  configSha256: sha(canonical(ckptConfigEcho)),
};
type CkptHeader = typeof ckptHeader;

interface RestoredSeed { seed: SeedOut; computeMs: number }
const restoredSeeds = new Map<string, RestoredSeed>();
const ckptKey = (pass: number, seedIdx: number): string => `${pass}:${seedIdx}`;

const refuse = (why: string): never => {
  console.error(`MT-T2 FATAL — REFUSING TO RESUME: ${why}`);
  console.error(`  checkpoint: ${CKPT_PATH}`);
  console.error('  Resuming across a changed world would silently mix two worlds. Delete the '
    + 'checkpoint to start a genuinely fresh run, or check out the commit it was made on.');
  process.exit(1);
};

const startCheckpoint = (): void => {
  const exists = existsSync(CKPT_PATH);
  if (RESUME && exists) {
    const lines = readFileSync(CKPT_PATH, 'utf8').split('\n').filter((l) => l.trim() !== '');
    let hdr: CkptHeader | null = null;
    let bad = 0;
    for (const line of lines) {
      let rec: Record<string, unknown>;
      try { rec = JSON.parse(line) as Record<string, unknown>; } catch { bad += 1; continue; }
      if (rec.kind === 'header') { if (hdr === null) hdr = rec as unknown as CkptHeader; continue; }
      if (rec.kind !== 'seed' || hdr === null) { bad += 1; continue; }
      const pass = rec.pass as number; const seedIdx = rec.seedIdx as number;
      const payload = rec.payload as string;
      if (typeof payload !== 'string' || sha(payload) !== rec.sha) { bad += 1; continue; }
      let seed: SeedOut;
      try { seed = decTransport(JSON.parse(payload)) as SeedOut; } catch { bad += 1; continue; }
      if (encodeSeedOut(seed) !== payload) { bad += 1; continue; }   // lossless round trip or nothing
      if (seed.seedIdx !== seedIdx || seed.leagueSeed !== RUN_BASE + seedIdx * LEAGUE_STRIDE) { bad += 1; continue; }
      restoredSeeds.set(ckptKey(pass, seedIdx), { seed, computeMs: (rec.computeMs as number) ?? 0 });
    }
    if (hdr === null) refuse('the checkpoint has no readable header record (corrupt or truncated).');
    const h = hdr as CkptHeader;
    const mismatches = ([
      ['git HEAD', h.headFull, ckptHeader.headFull],
      ['probe file', h.probeSha256, ckptHeader.probeSha256],
      ['src working tree', h.srcDiffSha256, ckptHeader.srcDiffSha256],
      ['mode', h.mode, ckptHeader.mode],
      ['frozen config', h.configSha256, ckptHeader.configSha256],
    ] as const).filter(([, was, now]) => was !== now);
    if (mismatches.length > 0) {
      refuse(`${mismatches.length} guard field(s) changed since the checkpoint was written — `
        + mismatches.map(([w, was, now]) => `${w}: ${String(was)} → ${String(now)}`).join(' · '));
    }
    banner(`RESUME — checkpoint ${CKPT_PATH} accepted (HEAD ${ckptHeader.headFull.slice(0, 7)} · `
      + `config ${ckptHeader.configSha256.slice(0, 12)}) · ${restoredSeeds.size} (pass, seed) unit(s) `
      + `restored${bad > 0 ? ` · ${bad} unusable record(s) DISCARDED and will be recomputed` : ''}`);
    return;
  }
  if (RESUME && !exists) banner(`RESUME requested but no checkpoint at ${CKPT_PATH} — starting FRESH.`);
  writeFileSync(CKPT_PATH, `${JSON.stringify(ckptHeader)}\n`);
  banner(`checkpoint ARMED at ${CKPT_PATH} (fresh header; one line per finished (pass, seed) unit)`);
};
const appendCheckpoint = (pass: number, s: SeedOut, computeMs: number): void => {
  const payload = encodeSeedOut(s);
  try {
    appendFileSync(CKPT_PATH, `${JSON.stringify({
      kind: 'seed', pass, seedIdx: s.seedIdx, leagueSeed: s.leagueSeed, computeMs,
      sha: sha(payload), payload,
    })}\n`);
  } catch (e) {
    banner(`⚠ checkpoint append FAILED (${String(e)}) — the run continues, unprotected.`);
  }
};
startCheckpoint();

/** the matches a finished seed unit is charged with — one definition for BOTH the freshly
 *  computed and the restored path, so the accounting cannot drift between them. */
const matchesOfSeed = (s: SeedOut): number =>
  ARM_IDS.reduce((a, arm) => a + s.runs[arm].matchesPlayed, 0) + s.body.evolved.length * 2;

const computeCore = (pass: number): Core => {
  const seeds: SeedOut[] = [];
  let matchesPlayed = 0;
  let costMs = 0;
  const restored: string[] = []; const computed: string[] = [];
  const gen0Identical: boolean[] = [];
  const t0 = Date.now();
  for (let i = 0; i < RUN_SEEDS; i++) {
    const leagueSeed = RUN_BASE + i * LEAGUE_STRIDE;
    const already = restoredSeeds.get(ckptKey(pass, i));
    let seedOut: SeedOut;
    if (already !== undefined) {
      // ⭐ RESILIENCE ONLY: this exact unit of work was already computed by an earlier process
      // at the SAME HEAD / probe / src / config (guarded in §15.5). Nothing is approximated.
      seedOut = already.seed;
      costMs += already.computeMs;
      restored.push(ckptKey(pass, i));
      banner(`pass ${pass} · seed ${i + 1}/${RUN_SEEDS} (${leagueSeed}) · SKIPPED — restored from `
        + `checkpoint (originally computed in ${(already.computeMs / 1000).toFixed(1)} s) · `
        + `${((Date.now() - t0) / 1000).toFixed(1)} s`);
    } else {
      const seedT0 = Date.now();
      const runs = {} as Record<ArmId, RunOut>;
      for (const arm of ARM_IDS) {
        const r = runEvolution(arm, leagueSeed, i, RUN_TEAMS, RUN_GENS);
        runs[arm] = r;
        banner(`pass ${pass} · seed ${i + 1}/${RUN_SEEDS} (${leagueSeed}) · ${arm} done · `
          + `${r.gens.length} gens · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
      }
      // --- the post-evolution body read on the ARMED arm's final population ----
      const finalPop = runs.ARMED.finalPop;
      const pairs: [number, number][] = [];
      for (let a = 0; a < RUN_TEAMS && pairs.length < RUN_BODY_N; a++) {
        for (let b = a + 1; b < RUN_TEAMS && pairs.length < RUN_BODY_N; b++) pairs.push([a, b]);
      }
      while (pairs.length < RUN_BODY_N) pairs.push(pairs[pairs.length % Math.max(1, pairs.length)]);
      const evolved: BodyRow[] = []; const zeroedRows: BodyRow[] = [];
      pairs.forEach(([a, b], j) => {
        const seed = RUN_BODY_BASE + i * BODY_STRIDE + j;
        evolved.push(walkBody(seed, finalPop[a], finalPop[b]));
        zeroedRows.push(walkBody(seed, zeroed(finalPop[a]), zeroed(finalPop[b])));
      });
      banner(`pass ${pass} · seed ${i + 1}/${RUN_SEEDS} · body instrument done (${pairs.length} pairs × 2 doses)`);
      seedOut = { seedIdx: i, leagueSeed, runs, body: { evolved, zeroedRows } };
      const seedMs = Date.now() - seedT0;
      costMs += seedMs;
      computed.push(ckptKey(pass, i));
      // the unit is COMPLETE (both arms + the body block) — bank it before anything else can
      // kill the process; a kill from here on costs at most the NEXT seed.
      appendCheckpoint(pass, seedOut, seedMs);
    }
    /** gGen0: the two arms are the SAME WORLD at generation 1 (identical founders, both genes
     *  absent in both arms ⇒ the seam branches are entered and both weights are 0). */
    gen0Identical.push(canonical(seedOut.runs.ARMED.gens[0]) === canonical({
      ...seedOut.runs.CONTROL.gens[0], driftMean: null, driftSd: null,
    }));
    matchesPlayed += matchesOfSeed(seedOut);
    seeds.push(seedOut);
  }
  return { seeds, matchesPlayed, gen0Identical, costMs, restored, computed };
};

const passStart = Date.now();
const coreA = computeCore(1);
const passMs = Date.now() - passStart;
const coreB = computeCore(2);
const digestA = sha(canonical(coreA.seeds));
const digestB = sha(canonical(coreB.seeds));
const xDet = digestA === digestB;
/** ⚠ the ONE timing number with a job (it feeds the frozen §4.1 seed rule) — so it is the
 *  SUM OF THE PER-SEED COMPUTE COSTS of pass 1, not this process's wall clock: on a resumed
 *  run a restored seed contributes the cost it ACTUALLY took in the process that computed it.
 *  It therefore stays a genuine per-match cost across a kill. It rides OUTSIDE resultSha256. */
const msPerMatchMeasured = coreA.costMs / Math.max(1, coreA.matchesPlayed);

/* ========================================================================== */
/* §17 THE MEASURED RESULT                                                    */
/* ========================================================================== */
const finalGenOf = (r: RunOut): GenStat => r.gens[r.gens.length - 1];
const genAt = (r: RunOut, gen1: number): GenStat | null =>
  r.gens.find((g) => g.gen === gen1) ?? null;
const readPoints = READ_POINTS.filter((g) => g <= RUN_GENS);
const readPointsUsed = readPoints.length > 0 ? [...readPoints] : [RUN_GENS];
if (!readPointsUsed.includes(RUN_GENS)) readPointsUsed.push(RUN_GENS);

/* --- (A) THE GENE TRAJECTORIES + the selection statistic --------------------- */
const perSeedFinalGene = (arm: ArmId, k: NewGene): number[] =>
  coreA.seeds.map((s) => finalGenOf(s.runs[arm]).geneMean[k]);
const geneDelta = Object.fromEntries(NEW_GENES.map((k) => [k, bootstrapCI(
  coreA.seeds.map((s) => finalGenOf(s.runs.ARMED).geneMean[k] - finalGenOf(s.runs.CONTROL).geneMean[k]),
  BOOTSTRAP_SEED,
)])) as Record<NewGene, Contrast>;
const geneVsDrift = Object.fromEntries(NEW_GENES.map((k) => [k, bootstrapCI(
  coreA.seeds.map((s) => finalGenOf(s.runs.ARMED).geneMean[k] - (finalGenOf(s.runs.CONTROL).driftMean?.[k] ?? 0)),
  BOOTSTRAP_SEED + 1,
)])) as Record<NewGene, Contrast>;
const armedFinalPooled = Object.fromEntries(NEW_GENES.map((k) => [k, round(mean(perSeedFinalGene('ARMED', k)), 6)])) as Record<NewGene, number>;
const controlFinalPooled = Object.fromEntries(NEW_GENES.map((k) => [k, round(mean(perSeedFinalGene('CONTROL', k)), 6)])) as Record<NewGene, number>;
const driftFinalPooled = Object.fromEntries(NEW_GENES.map((k) => [k,
  round(mean(coreA.seeds.map((s) => finalGenOf(s.runs.CONTROL).driftMean?.[k] ?? Number.NaN)), 6)])) as Record<NewGene, number>;
const controlStructuralZero = coreA.seeds.every((s) => s.runs.CONTROL.gens.every((g) =>
  NEW_GENES.every((k) => g.geneMean[k] === 0 && g.genePresentFraction[k] === 0)));
/** STYLE DIVERGENCE — the VISION §1 promise: per-team gene spread at the end. */
const styleDivergence = Object.fromEntries(NEW_GENES.map((k) => [k, {
  meanPerLeagueSd: round(mean(coreA.seeds.map((s) => finalGenOf(s.runs.ARMED).geneSd[k])), 6),
  perSeedSd: coreA.seeds.map((s) => finalGenOf(s.runs.ARMED).geneSd[k]),
  meanPerLeagueMax: round(mean(coreA.seeds.map((s) => finalGenOf(s.runs.ARMED).geneMax[k])), 6),
}]));

/* --- (B) THE BAND, per read point, per arm ---------------------------------- */
const bandRowAt = (arm: ArmId, gen1: number) => {
  const levels = Object.fromEntries(BAND_KEYS.map((k) => [k, round(mean(
    coreA.seeds.map((s) => (genAt(s.runs[arm], gen1)?.rates[k] ?? Number.NaN)),
  ), 6)])) as Record<BandKey, number>;
  return Object.fromEntries(BAND_KEYS.map((k) => {
    const lo = BAND_BASELINE[k] * (1 - BAND_TOLERANCE[k]);
    const hi = BAND_BASELINE[k] * (1 + BAND_TOLERANCE[k]);
    return [k, { level: levels[k], lo: round(lo), hi: round(hi), inBand: levels[k] >= lo && levels[k] <= hi }];
  })) as Record<BandKey, { level: number; lo: number; hi: number; inBand: boolean }>;
};
const bandByReadPoint = readPointsUsed.map((gen1) => {
  const control = bandRowAt('CONTROL', gen1);
  const armed = bandRowAt('ARMED', gen1);
  const gated = BAND_KEYS.filter((k) => control[k].inBand);
  const excluded = BAND_KEYS.filter((k) => !control[k].inBand);
  const failed = gated.filter((k) => !armed[k].inBand);
  return {
    gen: gen1, control, armed, gatedDimensions: gated, excludedAsSubstrateDrift: excluded,
    armedFailedGated: failed, armedInBand: failed.length === 0 && gated.length > 0,
  };
});
const finalBand = bandByReadPoint[bandByReadPoint.length - 1];
/** paired armed − control on every band dimension, at every read point (REPORTED). */
const bandContrasts = readPointsUsed.map((gen1) => ({
  gen: gen1,
  contrasts: Object.fromEntries(BAND_KEYS.map((k) => [k, bootstrapCI(
    coreA.seeds.map((s) => (genAt(s.runs.ARMED, gen1)?.rates[k] ?? Number.NaN)
      - (genAt(s.runs.CONTROL, gen1)?.rates[k] ?? Number.NaN)), BOOTSTRAP_SEED + 2 + gen1)])),
}));

/* --- (C) THE MT-T1 DEFLATED REFERENCE — read from the COMMITTED artifact ----- */
const ruler = (() => {
  if (!existsSync(RULER_PATH)) return { available: false as const, path: RULER_PATH };
  const raw = readFileSync(RULER_PATH, 'utf8');
  const j = JSON.parse(raw) as {
    resultSha256?: string;
    results?: { band?: { byArm?: Record<string, { row?: Record<string, { level: number }> }> } };
  };
  const rows = j.results?.band?.byArm;
  const pick = (arm: string): Record<string, number> | null => {
    const r = rows?.[arm]?.row;
    return r === undefined ? null : Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.level]));
  };
  return {
    available: true as const, path: RULER_PATH,
    artifactSha256: sha(raw), declaredResultSha256: j.resultSha256 ?? null,
    MTTOP: pick('MTTOP'), BOTHTOP: pick('BOTHTOP'), ABSENT: pick('ABSENT'),
  };
})();
/** "resolvedly closer to the band than MT-T1's deflated levels" — the goals limb, the
 *  dimension #204 named (2.195 → 1.61375). A one-sample seed-clustered CI on
 *  (armed goals @ final) − (MT-T1's MTTOP goals level). */
const mttopGoals = ruler.available ? (ruler.MTTOP?.goals ?? Number.NaN) : Number.NaN;
const goalsVsMttop = bootstrapLevel(
  coreA.seeds.map((s) => (genAt(s.runs.ARMED, RUN_GENS)?.rates.goals ?? Number.NaN) - mttopGoals),
  BOOTSTRAP_SEED + 99,
);

/* --- (D) THE BODY AT THE EVOLVED DOSES --------------------------------------- */
const bodyDeltaPerSeed = (f: (r: BodyRow) => number): number[] => coreA.seeds.map((s) =>
  mean(s.body.evolved.map(f).filter(Number.isFinite)) - mean(s.body.zeroedRows.map(f).filter(Number.isFinite)));
const bodyContrast = bootstrapCI(bodyDeltaPerSeed((r) => r.bodyLatGap), BOOTSTRAP_SEED + 3);
const shortfallContrast = bootstrapCI(bodyDeltaPerSeed((r) => r.shortfall), BOOTSTRAP_SEED + 4);
const detachContrast = bootstrapCI(bodyDeltaPerSeed((r) => r.detach), BOOTSTRAP_SEED + 5);
const bodyEpisodes = {
  evolved: coreA.seeds.reduce((s, x) => s + x.body.evolved.reduce((a, r) => a + r.episodes, 0), 0),
  zeroed: coreA.seeds.reduce((s, x) => s + x.body.zeroedRows.reduce((a, r) => a + r.episodes, 0), 0),
};
/** the doses the body read actually ran at (REPORTED — this is "the evolved dose") */
const evolvedDose = Object.fromEntries(NEW_GENES.map((k) => [k, {
  meanOverFinalPops: round(mean(coreA.seeds.flatMap((s) => s.runs.ARMED.finalPop.map((g) => g[k] ?? 0))), 6),
  maxOverFinalPops: round(Math.max(0, ...coreA.seeds.flatMap((s) => s.runs.ARMED.finalPop.map((g) => g[k] ?? 0))), 6),
}]));

/* --- (E) THE #157 DEBT COUNTERS + the co-evolution shape (REPORTED) ---------- */
const DEBT_KEYS = ['offsides', 'fouls', 'penalties', 'thirdMan', 'overlaps'] as const;
const debtByReadPoint = readPointsUsed.map((gen1) => ({
  gen: gen1,
  perArm: Object.fromEntries(ARM_IDS.map((a) => [a, Object.fromEntries(DEBT_KEYS.map((k) =>
    [k, round(mean(coreA.seeds.map((s) => genAt(s.runs[a], gen1)?.rates[k] ?? Number.NaN)), 6)]))])),
  contrasts: Object.fromEntries(DEBT_KEYS.map((k) => [k, bootstrapCI(
    coreA.seeds.map((s) => (genAt(s.runs.ARMED, gen1)?.rates[k] ?? Number.NaN)
      - (genAt(s.runs.CONTROL, gen1)?.rates[k] ?? Number.NaN)), BOOTSTRAP_SEED + 40 + gen1)])),
}));
const attackShape = {
  note: 'REPORTED, NEVER GATED — "does attack\'s existing gene pool shift in response?" (#205.2). '
    + 'Paired armed − control on the frozen attack-side gene list at the final generation.',
  finalContrasts: Object.fromEntries(ATTACK_GENES.map((k) => [k, bootstrapCI(
    coreA.seeds.map((s) => finalGenOf(s.runs.ARMED).attackGeneMean[k] - finalGenOf(s.runs.CONTROL).attackGeneMean[k]),
    BOOTSTRAP_SEED + 6)])),
  armedFinalMean: Object.fromEntries(ATTACK_GENES.map((k) => [k,
    round(mean(coreA.seeds.map((s) => finalGenOf(s.runs.ARMED).attackGeneMean[k])), 6)])),
  controlFinalMean: Object.fromEntries(ATTACK_GENES.map((k) => [k,
    round(mean(coreA.seeds.map((s) => finalGenOf(s.runs.CONTROL).attackGeneMean[k])), 6)])),
  armedFinalSd: Object.fromEntries(ATTACK_GENES.map((k) => [k,
    round(mean(coreA.seeds.map((s) => finalGenOf(s.runs.ARMED).attackGeneSd[k])), 6)])),
};
/** per-generation trajectories, pooled over league seeds (REPORTED) */
const trajectory = Array.from({ length: RUN_GENS }, (_, i) => {
  const gen1 = i + 1;
  const row: Record<string, unknown> = { gen: gen1 };
  for (const arm of ARM_IDS) {
    row[arm] = {
      geneMean: Object.fromEntries(NEW_GENES.map((k) => [k,
        round(mean(coreA.seeds.map((s) => genAt(s.runs[arm], gen1)?.geneMean[k] ?? Number.NaN)), 6)])),
      geneSd: Object.fromEntries(NEW_GENES.map((k) => [k,
        round(mean(coreA.seeds.map((s) => genAt(s.runs[arm], gen1)?.geneSd[k] ?? Number.NaN)), 6)])),
      fitnessGeneCorrelation: Object.fromEntries(NEW_GENES.map((k) => [k,
        round(mean(coreA.seeds.map((s) => genAt(s.runs[arm], gen1)?.fitnessGeneCorrelation[k] ?? Number.NaN)
          .filter(Number.isFinite)), 4)])),
      goals: round(mean(coreA.seeds.map((s) => genAt(s.runs[arm], gen1)?.rates.goals ?? Number.NaN)), 6),
      crosses: round(mean(coreA.seeds.map((s) => genAt(s.runs[arm], gen1)?.rates.crosses ?? Number.NaN)), 6),
      headers: round(mean(coreA.seeds.map((s) => genAt(s.runs[arm], gen1)?.rates.headers ?? Number.NaN)), 6),
      longBalls: round(mean(coreA.seeds.map((s) => genAt(s.runs[arm], gen1)?.rates.longBalls ?? Number.NaN)), 6),
      cutbacks: round(mean(coreA.seeds.map((s) => genAt(s.runs[arm], gen1)?.rates.cutbacks ?? Number.NaN)), 6),
    };
  }
  row.neutralDrift = Object.fromEntries(NEW_GENES.map((k) => [k,
    round(mean(coreA.seeds.map((s) => genAt(s.runs.CONTROL, gen1)?.driftMean?.[k] ?? Number.NaN)), 6)]));
  return row;
});

/* ========================================================================== */
/* §18 THE PRE-NAMED OUTCOME FORMS (frozen predicates)                        */
/* ========================================================================== */
const ENGAGED_GENES = NEW_GENES.filter((k) =>
  geneDelta[k].resolvedAboveZero && armedFinalPooled[k] >= GENE_ZERO_EPS);
const ENGAGES = ENGAGED_GENES.length > 0;
// ⚠ #206 PRE-LAUNCH AMENDMENT (stricter, the #91 form; the verify's MEDIUM):
// RESTORES additionally requires GOALS to be a GATED dimension — the question this
// stage exists to answer may not be silently excluded by the substrate-drift rule.
// If the CONTROL itself drifts off the goals band at gen 25, outcome (i) cannot
// fire; the run lands MIXED with the drift published.
const RESTORES = finalBand.armedInBand && finalBand.gatedDimensions.includes('goals');
const RESTORES_PARTIAL = !RESTORES && goalsVsMttop.resolvedAboveZero;
const BODY_NEGATIVE = bodyContrast.resolvedBelowZero;
const REJECTED_GENES = NEW_GENES.filter((k) => armedFinalPooled[k] < GENE_ZERO_EPS);
const MAXED_GENES = NEW_GENES.filter((k) => armedFinalPooled[k] >= GENE_HIGH);

const OUTCOME_I = ENGAGES && RESTORES && BODY_NEGATIVE;
const OUTCOME_II = REJECTED_GENES.length === NEW_GENES.length;
const OUTCOME_III = MAXED_GENES.length > 0 && !RESTORES;
const MIXED = !OUTCOME_I && !OUTCOME_II && !OUTCOME_III;

const outcomeLabel = OUTCOME_I
  ? '(i) SELECTION ENGAGES + EQUILIBRIUM RESTORES'
  : OUTCOME_II
    ? '(ii) SELECTION REJECTS — honest UNSUPPORTED'
    : OUTCOME_III
      ? '(iii) SELECTION MAXES + EQUILIBRIUM STAYS DEFLATED — the attack-side substrate finding'
      : 'MIXED — none of the three pre-named forms holds; REPORTED AS-IS, nothing re-cut';

/* ========================================================================== */
/* §19 THE X-FAMILY (HARD)                                                    */
/* ========================================================================== */
/** gArm — the two ARMING CHECKLISTS, and the opt-ins PROVEN to gate the draws. */
const armCheck = (() => {
  const probe = (opts: Record<string, boolean>): TacticalGenome => {
    const rng = new Rng(773_001);
    let g = randomGenome(new Rng(19));
    for (let i = 0; i < 6; i++) g = mutateGenome(g, rng, { rate: 0.9, scale: 0.14, ...opts });
    return g;
  };
  const none = probe({});
  const both = probe({ evolveMarkSag: true, evolveDefLaneConvergence: true });
  const mtOnly = probe({ evolveMarkSag: true });
  const pmOnly = probe({ evolveDefLaneConvergence: true });
  /** a CONTROL genome can NEVER carry the keys; an ARMED genome CAN. */
  const controlNeverCarries = none.markSag === undefined && none.defLaneConvergence === undefined;
  const armedCanCarry = both.markSag !== undefined && both.defLaneConvergence !== undefined;
  const separateOptIns = mtOnly.markSag !== undefined && mtOnly.defLaneConvergence === undefined
    && pmOnly.defLaneConvergence !== undefined && pmOnly.markSag === undefined;
  /** the consumption half: BOTH arms' worlds enter both seam branches. */
  const m = matchOf(RESERVED_BAND[1], randomGenome(new Rng(23)), randomGenome(new Rng(29)));
  const flagsOn = m.pmLaneConvergence === true && m.mtMarkSag === true;
  const bornZeroWeights = m.teams.every((t) =>
    markSagWeight(t.effGenome as TacticalGenome) === 0
    && pmLaneConvergenceK(t.effGenome as TacticalGenome) === 0);
  /** a dosed genome really reaches all three views (the D6 channel). */
  const dosed = { ...randomGenome(new Rng(31)), markSag: 0.7, defLaneConvergence: 0.4 } as TacticalGenome;
  const m2 = matchOf(RESERVED_BAND[1] - 1, dosed, dosed);
  const onAllViews = m2.teams.every((t) => [t.info.genome, t.baseGenome, t.effGenome]
    .every((g) => (g as TacticalGenome).markSag === 0.7 && (g as TacticalGenome).defLaneConvergence === 0.4));
  const weightsExpressed = m2.teams.every((t) =>
    round(markSagWeight(t.effGenome as TacticalGenome), 8) === 0.7
    && pmLaneConvergenceK(t.effGenome as TacticalGenome) > 0);
  return {
    pass: controlNeverCarries && armedCanCarry && separateOptIns && flagsOn && bornZeroWeights
      && onAllViews && weightsExpressed,
    controlNeverCarries, armedCanCarry, separateOptIns, flagsOn, bornZeroWeights,
    onAllViews, weightsExpressed,
    semantics: 'THE ARMS DIFFER IN EXACTLY TWO BOOLEANS — `evolveMarkSag` and '
      + '`evolveDefLaneConvergence` on MutateOptions. Both arms carry the two CONSUMPTION flags '
      + '(pmLaneConvergence, mtMarkSag) ON, so both seam branches are ENTERED in both worlds; in '
      + 'CONTROL the mutation law never writes either key, so both weights are 0 on every tick '
      + '(MT-T1\'s ARMEDZERO arm, proven byte-identical to the flags-off world there). This gate '
      + 'proves the opt-ins GENUINELY GATE THE DRAWS: without them a mutated genome never carries '
      + 'the keys; with them it does; and each opt-in moves only its OWN key.',
  };
})();

/** gFitnessBlind — WIN-ONLY fitness: no fitness code reads either new gene (#167/#205.1). */
const fitnessBlind = (() => {
  const files = ['src/evolution/fitness.ts', 'src/sim/League.ts', 'src/evolution/evolve.ts'];
  const rows = files.map((f) => {
    const src = existsSync(f) ? readFileSync(f, 'utf8') : '';
    return { file: f, markSag: (src.match(/markSag/g) ?? []).length, defLaneConvergence: (src.match(/defLaneConvergence/g) ?? []).length };
  });
  /** the probe's own fitness is a pure function of the season table — same table, genomes
   *  irrelevant because none is in scope. Demonstrated by identity on a fixed table. */
  const a = fitnessOf([9, 6, 3], [4, 0, -4]);
  const b = fitnessOf([9, 6, 3], [4, 0, -4]);
  const pureTable = canonical(a) === canonical(b);
  return {
    pass: rows.every((r) => r.markSag === 0 && r.defLaneConvergence === 0) && pureTable,
    rows, pureTable,
    fitnessLine: 'points.map((p, i) => p + gd[i] * 1e-3)  — points 3/1/0, goal difference as a '
      + '1e-3 tiebreak (A4-S2P3 §5.2, verbatim). NO genome is an input.',
    semantics: 'WIN-ONLY, ASSERTED TWO WAYS: (a) the probe\'s fitness takes only the season '
      + 'table — no genome is in scope; (b) the shipped fitness path (fitness.ts, League.ts, '
      + 'evolve.ts) contains ZERO occurrences of either gene name, so nothing anywhere shapes '
      + 'fitness toward the sag.',
  };
})();

/** gGen0 — birth neutrality inside evolution + the two arms are the same world at gen 1. */
const gen0Check = {
  pass: coreA.seeds.every((s) => ARM_IDS.every((a) => s.runs[a].gen0BornAbsent))
    && coreA.gen0Identical.every(Boolean)
    && controlStructuralZero,
  bornAbsent: coreA.seeds.every((s) => ARM_IDS.every((a) => s.runs[a].gen0BornAbsent)),
  gen1Identical: coreA.gen0Identical,
  controlStructuralZero,
  semantics: 'BIRTH NEUTRALITY INSIDE EVOLUTION: every founder genome comes from randomGenome, '
    + 'which carries neither key ⇒ generation 1 is the SAME WORLD in both arms (asserted by '
    + 'canonical equality of the whole gen-1 stat row, drift shadow excluded because it exists '
    + 'only on the control side). CONTROL\'s genes stay STRUCTURALLY ABSENT (mean 0, presence 0) '
    + 'for every generation — that is the structural zero the selection statistic is paired against.',
};

/** gRuler — the deflated levels come from MT-T1's COMMITTED artifact, rehashed here. */
const rulerCheck = {
  pass: ruler.available && ruler.MTTOP !== null && Number.isFinite(mttopGoals),
  ...ruler,
  mttopGoals,
  semantics: 'THE DEFLATED REFERENCE IS NOT TYPED: MT-T1\'s committed artifact is read and '
    + 'hashed HERE (#181.2), and the MTTOP band levels are taken from it. `declaredResultSha256` '
    + 'is the hash MT-T1 itself published over its measured body; `artifactSha256` is this run\'s '
    + 'hash of the whole file as committed.',
};

/** gInherit — every inherited definition still exists VERBATIM in its original file. */
const INHERIT_PINS: readonly { file: string; line: string; what: string }[] = [
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const OWN_THIRD_LOCAL_X = -HALF_L / 3;', what: 'the #188 trigger own-third cut' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const FLANK_ABS_Y = BOX_WIDTH / 2;', what: 'the #188 trigger flank cut' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const MIN_EPISODE_TICKS = 30;', what: 'the episode floor' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const SPREAD_R = 9;', what: 'the compression yardstick' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,', what: 'the equilibrium band baselines (incl. goals)' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,', what: 'the equilibrium band tolerances' },
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: '          const bodyGap = Math.abs(p.pos.y - m.ball.pos.y);', what: 'THE BODY QUANTITY this stage re-reads at the evolved dose' },
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: '          acc.shortfall.push(Math.max(0, bodyGap - SPREAD_R));', what: 'the shortfall quantity' },
  { file: 'scripts/probes/a4-s2p3-gene-battery.ts', line: 'const LEGS_SIGN_EPS = 0.02;', what: '⭐ THE GENE_ZERO_EPS ANCHOR: the Leg-S frozen zero dead-zone' },
  { file: 'scripts/probes/a4-s2p3-gene-battery.ts', line: 'const LEGS_MUT_RATE = 0.4; const LEGS_MUT_SCALE = 0.08;      // evolveGroup \'mutated\'', what: 'the Leg-S mirror of evolveGroup\'s mutated law' },
  { file: 'src/evolution/evolve.ts', line: '      coach.genome = mutateGenome(coach.genome, rng, { rate: 0.4, scale: 0.08 });', what: 'evolveGroup\'s OWN mutated law — the band law this loop mirrors' },
  { file: 'src/evolution/evolve.ts', line: '        crossoverGenomes(pa.coach.genome, pb.coach.genome, rng), rng, { rate: 0.5, scale: 0.15 },', what: 'evolveGroup\'s OWN reborn law' },
  { file: 'src/evolution/genome.ts', line: '  for (const k of GENE_KEYS) g[k] = rng.range(0.15, 0.85);', what: '⭐ THE GENE_HIGH ANCHOR: randomGenome\'s birth range, top = 0.85' },
  { file: 'src/evolution/genome.ts', line: '  if (opts.evolveMarkSag === true && rng.chance(rate)) {', what: 'the markSag opt-in gate itself' },
  { file: 'src/evolution/genome.ts', line: '  if (opts.evolveDefLaneConvergence === true && rng.chance(rate)) {', what: 'the defLaneConvergence opt-in gate itself' },
  { file: 'src/ai/actionExecutor.ts', line: '          if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);', what: 'the MT-T0 seam line the evolved dose flows through' },
];
const inheritCheck = (() => {
  const cache = new Map<string, string>();
  const rows = INHERIT_PINS.map((pin) => {
    let src = cache.get(pin.file);
    if (src === undefined) { src = existsSync(pin.file) ? readFileSync(pin.file, 'utf8') : ''; cache.set(pin.file, src); }
    return { ...pin, found: src.includes(pin.line) };
  });
  return {
    pass: rows.every((r) => r.found), rows,
    semantics: 'Every inherited definition is pinned in its ORIGINAL file, the MT-T0/MT-T1 '
      + 'G-CONST idiom: probe scripts execute on import, so the code is carried here and the '
      + 'source lines are pinned instead. If a source moves, this gate goes RED rather than the '
      + 'two instruments drifting apart silently.',
    disclosedDifferences: [
      '⭐ THE SUBSTRATE IS THE LEG-S PROBE-SIDE LOOP, NOT THE SHIPPED LEAGUE. MutateOptions is '
        + 'still NOT plumbed through src/sim/League.ts or src/evolution/evolve.ts (evolveGroup '
        + 'calls mutateGenome/crossoverGenomes with hard-coded options), so arming an opt-in '
        + 'inside the shipped league would need a src change — forbidden (xSrcZero). This stage '
        + 'therefore reuses A4-S2P3 §5.2\'s named deviation VERBATIM: a probe-side selection loop '
        + 'mirroring evolveGroup\'s band law. NO careers, transfers, coaches, morale, promotion/ '
        + 'relegation, fire-sale, two-division pyramid, or the four-component computeFitness.',
      'HORIZON: 25 generations with read points at generation 8 and 25 — traced from the '
        + 'vision/positioning CO-EVOLUTION arc\'s own @8 / @25-season reads (docs/ROADMAP.md, '
        + '2026-07-20). Leg S ran 20 generations; 25 CONTAINS that horizon and reaches the second '
        + 'read point. League shape (10 teams, 45-match single round robin, elite 2 / reborn 2) is '
        + 'Leg S\'s, unchanged.',
      'A GENERATION HERE IS A SINGLE ROUND ROBIN (45 matches), whereas the @8/@25 co-evolution '
        + 'reads were SHIPPED-LEAGUE seasons. The read POINTS are inherited; the season CONTENT is '
        + 'the Leg-S instrument\'s. Stated, not implied.',
      'THE ARMS DIFFER IN THE EVOLUTION OPT-INS ONLY (both consumption flags on in BOTH arms) — '
        + 'MT-T1\'s control was flags-OFF. gGen0 proves the two worlds are identical at generation 1.',
      'THE BODY READ IS AT THE EVOLVED DOSE, on EVOLVED genomes: MT-T1 read it at gene = 1 on '
        + 'randomGenome teams. Same quantities, different population — that is the question.',
      '⚠ THE RNG-STREAM DISPLACEMENT, DECLARED EX ANTE (the #148.5 trap in its EVOLUTION form). '
        + 'Under the opt-ins `mutateGenome`/`crossoverGenomes` draw EXTRA numbers for the two new '
        + 'keys, so from generation 2 onward the ARMED arm\'s evolution RNG stream is displaced '
        + 'relative to CONTROL\'s and the two populations diverge in EVERY gene, not only in the '
        + 'two under test. This is inherent to exercising the REAL gene channel (the alternative — '
        + 're-implementing the opt-in draw law probe-side on a private stream — would no longer be '
        + 'the shipped channel, and #196.3-D6 forbids inventing a parallel dose surface). '
        + 'CONSEQUENCE, stated: the displacement is EXCHANGEABLE noise — it is uncorrelated with '
        + 'anything about the arm except the presence of the genes — so it inflates VARIANCE on '
        + 'every armed − control contrast rather than biasing it, and the paired league-seed '
        + 'design + the fixed founders (identical at generation 1, proven by gGen0) are what keep '
        + 'it honest. It also means an unresolved band contrast at this seed count is an honest '
        + 'INCONCLUSIVE, never a false pass.',
      '⚠ NEUTRAL DRIFT IS NOT SELECTION (the Leg-S reading note, in its markSag form): the '
        + 'mutation law writes clamp01(0 + gaussian) onto every mutated/reborn genome, and a '
        + 'random walk CLAMPED AT ZERO drifts UPWARD mechanically. A non-zero final gene mean is '
        + 'therefore NOT by itself evidence of selection. The frozen primary statistic is the one '
        + 'the dispatch named (armed vs control\'s structural zero); the NEUTRAL-DRIFT SHADOW '
        + '(inert passengers carried through the control arm\'s own elite/mutate/reborn '
        + 'assignments, in their own RNG namespace, touching no match) is published alongside it '
        + 'as the honest reference, together with the fitness-gene correlation and the style '
        + 'spread. Declared HERE, ex ante, not after sight.',
    ],
  };
})();

/** X-FP-PROD (#181.2): the shipped fingerprint re-derived HERE. */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
banner('X-FP-PROD: re-deriving the production fingerprint...');
const fpObserved = leagueHash(FINGERPRINT_SEED);
const xFpProd = fpObserved === FINGERPRINT_BASELINE;
banner(`X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}`);

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const firstSeed = RUN_BASE;
const lastSeed = RUN_BASE + (RUN_SEEDS - 1) * LEAGUE_STRIDE + (RUN_GENS - 1) * GEN_STRIDE + MATCHES_PER_GEN - 1;
const bodyFirst = RUN_BODY_BASE;
const bodyLast = RUN_BODY_BASE + (RUN_SEEDS - 1) * BODY_STRIDE + RUN_BODY_N - 1;
const seedDisjoint = (() => {
  const spans: [number, number][] = [[firstSeed, lastSeed], [bodyFirst, bodyLast]];
  const clashes = CONSUMED.filter((c) => spans.some(([lo, hi]) => !(hi < c.range[0] || lo > c.range[1])));
  const inBand = spans.every(([lo, hi]) => lo >= RESERVED_BAND[0] && hi <= RESERVED_BAND[1]);
  const ownDisjoint = lastSeed < bodyFirst || bodyLast < firstSeed;
  const smokeBlocksBelowFull = SMOKE_BASE + LEAGUE_STRIDE - 1 < FULL_BASE
    && SMOKE_BODY_BASE + 999 < FULL_BASE;
  return {
    pass: clashes.length === 0 && inBand && ownDisjoint && smokeBlocksBelowFull,
    evolutionBlock: `${firstSeed}..${lastSeed}`, bodyBlock: `${bodyFirst}..${bodyLast}`,
    band: RESERVED_BAND, inBand, ownDisjoint, smokeBlocksBelowFull,
    seedFamily: `${RUN_BASE} + leagueIdx×${LEAGUE_STRIDE} + gen×${GEN_STRIDE} + matchIndex  ·  `
      + `body: ${RUN_BODY_BASE} + leagueIdx×${BODY_STRIDE} + pairIndex`,
    consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name),
    freshLeagueSeedsNote: 'the identity seeds 1337 / 20260728 / 424242 are CONSUMED baselines and '
      + 'are not used anywhere in this stage (1337 appears only as the production-fingerprint seed, '
      + 'which is a gate, not an experimental league).',
  };
})();
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)),
  Math.abs(RESERVED_STATS_SEED - BOOTSTRAP_SEED));
const statsBaseFloorOk = BOOTSTRAP_SEED >= 103_800;

const xGates = {
  xDet: { pass: xDet, digestA, digestB, note: 'the whole core computed TWICE, canonical-JSON digests' },
  xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved, seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS },
  xSrcZero: { pass: srcDiff === '', srcDiff, note: 'instrument-only: zero src/** changes' },
  gArm: armCheck,
  gFitnessBlind: fitnessBlind,
  gGen0: gen0Check,
  gRuler: rulerCheck,
  gInherit: inheritCheck,
  gSeed: seedDisjoint,
  gStats: {
    pass: statsMinGap >= 200 && statsBaseFloorOk,
    base: BOOTSTRAP_SEED, reserved: RESERVED_STATS_SEED, published: PUBLISHED_STATS_BASES,
    minGap: statsMinGap, floorOk: statsBaseFloorOk,
    note: 'the #163 rule: a FRESH bootstrap base ≥ 103,800 with pairwise gaps ≥ 200 from every '
      + 'published base (MT-T1\'s was 103,600).',
  },
  gNDerived: {
    pass: MODE === 'smoke' ? true : (SEEDS_ENV === null && RUN_SEEDS === seedsDerived.seedsStar),
    ranSeeds: RUN_SEEDS, derivedSeedsStar: seedsDerived.seedsStar, envOverride: SEEDS_ENV,
    note: 'in FULL mode the seed count MUST come from the frozen §5 rule; an MTT2_SEEDS override '
      + 'turns this gate RED and the run exits 1.',
  },
  gYield: {
    pass: bodyEpisodes.evolved > 0 && bodyEpisodes.zeroed > 0
      && coreA.seeds.every((s) => s.runs.ARMED.gens.length === RUN_GENS),
    bodyEpisodes, gensPerRun: RUN_GENS,
    note: 'a measurement with zero body episodes or a truncated horizon is INVALID, not a finding.',
  },
};
const xPass = Object.values(xGates).every((g) => (g as { pass: boolean }).pass);

/* ========================================================================== */
/* §20 THE ARTIFACT                                                           */
/* ========================================================================== */
const verdict = !xPass
  ? 'INVALID — an X-family HARD gate failed; read nothing else'
  : `${outcomeLabel}${MODE === 'smoke' ? '  ⚠ SMOKE — ADJUDICATES NOTHING' : ''}`;

const body = {
  stage: 'MT-T2 — THE CO-EVOLUTION LIVE A/B (selection sets the dose)',
  doc: 'docs/world-model/MT-T2-COEVOLUTION.md',
  contract: 'docs/world-model/MARK-TIGHTNESS-CONTRACT.md §3 MT-T2 / exit · §1 H-MT · §4',
  seams: ['docs/world-model/MT-T0-DORMANT-SEAM.md', 'docs/world-model/PM-T0-DORMANT-SEAM.md'],
  precedent: 'A4-S2P3-GENE-BATTERY §5 (LEG S) — the selection instrument reused',
  ruling: '#205 (dispatch) · #204 (the cost finding) · #167 (win-only) · #163 · #181.2 · #197-M1/M2 · #203',
  mode: MODE,
  verdict,
  frozenDesign: {
    arms: ARMS.map((a) => ({ ...a })),
    armsDifferInExactly: 'the two MutateOptions evolution opt-ins (evolveMarkSag, '
      + 'evolveDefLaneConvergence). Both consumption flags (pmLaneConvergence, mtMarkSag) are ON in '
      + 'BOTH arms; percept flags identical; league seeds, founders and fitness identical.',
    fitness: fitnessBlind.fitnessLine,
    horizon: {
      generations: RUN_GENS, readPoints: readPointsUsed, teams: RUN_TEAMS,
      matchesPerGeneration: (RUN_TEAMS * (RUN_TEAMS - 1)) / 2,
      eliteN: Math.min(ELITE_N, RUN_TEAMS - 1), rebornN: Math.min(REBORN_N, Math.max(0, RUN_TEAMS - Math.min(ELITE_N, RUN_TEAMS - 1) - 1)),
      mutateRate: MUT_RATE, mutateScale: MUT_SCALE, rebornRate: REBORN_RATE, rebornScale: REBORN_SCALE,
      evoRngBase: EVO_RNG_BASE, driftRngBase: DRIFT_RNG_BASE,
      source: 'read points @8/@25 from the vision/positioning co-evolution arc; league shape and '
        + 'band law from A4-S2P3 §5.5 Leg S (which ran 20 generations).',
    },
    leagueSeeds: { count: RUN_SEEDS, base: RUN_BASE, stride: LEAGUE_STRIDE, rule: seedsDerived.arithmetic },
    bodyInstrument: { matchesPerSeedPerDose: RUN_BODY_N, base: RUN_BODY_BASE, stride: BODY_STRIDE },
    thresholds: {
      GENE_ZERO_EPS, GENE_HIGH,
      geneZeroEpsSource: 'A4-S2P3 §5.3 LEGS_SIGN_EPS = 0.02 (the Leg-S frozen zero dead-zone)',
      geneHighSource: 'randomGenome\'s birth range top, src/evolution/genome.ts rng.range(0.15, 0.85)',
      band: { baseline: BAND_BASELINE, tolerance: BAND_TOLERANCE, source: 'A4-S2P3 §4.2 via PM-T1 §5.5 / MT-T1 §5.5, incl. the substrate-drift exclusion' },
    },
    statsBases: { bootstrap: BOOTSTRAP_SEED, reserved: RESERVED_STATS_SEED, resamples: BOOTSTRAP_RESAMPLES },
  },
  predicates: {
    ENGAGES: 'for at least one gene: CI( armed − control final-generation league-mean gene ) '
      + 'resolved ABOVE zero (seed-clustered percentile bootstrap, control ≡ structural 0) '
      + `AND the armed pooled final mean ≥ GENE_ZERO_EPS (${GENE_ZERO_EPS})`,
    RESTORES: 'at the FINAL read point, the ARMED arm sits inside the inherited band on every '
      + 'GATED dimension (a dimension the CONTROL arm itself fails at that read point is excluded '
      + 'as substrate drift and disclosed)',
    RESTORES_PARTIAL: '¬RESTORES ∧ CI( armed goals @ final − MT-T1 MTTOP goals level ) resolved '
      + 'ABOVE zero — "resolvedly closer to the band than MTTOP\'s deflated level" on the '
      + 'dimension #204 named. REPORTED; it does not satisfy (i).',
    BODY_NEGATIVE: 'CI( bodyLatGap(EVOLVED − ZEROED) ) resolved BELOW zero, paired on the league '
      + 'seed, measured on the ARMED arm\'s final-generation genomes',
    OUTCOME_I: 'ENGAGES ∧ RESTORES ∧ BODY_NEGATIVE',
    OUTCOME_II: `both genes' armed pooled final mean < GENE_ZERO_EPS (${GENE_ZERO_EPS}) ⇒ honest UNSUPPORTED`,
    OUTCOME_III: `(∃ gene: armed pooled final mean ≥ GENE_HIGH (${GENE_HIGH})) ∧ ¬RESTORES`,
    MIXED: 'none of the three holds ⇒ REPORTED AS-IS, nothing re-cut (the three forms are NOT '
      + 'exhaustive and were never claimed to be)',
    exitSemantics: '0 = clean and (i) or MIXED · 1 = an X-family HARD gate failed (INVALID) · '
      + '2 = clean and a PRE-NAMED NEGATIVE outcome fired ((ii) or (iii)). Exit 2 is a FINDING, '
      + 'not a measurement failure.',
  },
  results: {
    outcome: {
      label: outcomeLabel,
      ENGAGES, engagedGenes: ENGAGED_GENES, RESTORES, RESTORES_PARTIAL, BODY_NEGATIVE,
      rejectedGenes: REJECTED_GENES, maxedGenes: MAXED_GENES,
      OUTCOME_I, OUTCOME_II, OUTCOME_III, MIXED,
    },
    genes: {
      armedFinalPooled, controlFinalPooled, neutralDriftFinalPooled: driftFinalPooled,
      pairedDeltaVsControl: geneDelta,
      pairedDeltaVsNeutralDrift: geneVsDrift,
      styleDivergence,
      evolvedDose,
      readingNote: '⚠ HOW TO READ THIS (declared ex ante). The mutation law writes '
        + 'clamp01(0 + gaussian·scale) onto every mutated/reborn genome under the opt-in, and a '
        + 'random walk clamped at zero drifts UPWARD with no selection at all. `pairedDeltaVsControl` '
        + 'is the statistic the dispatch froze (control is a STRUCTURAL zero); '
        + '`pairedDeltaVsNeutralDrift` is the honest companion — the same law run on inert '
        + 'passengers through the control arm\'s own selection assignments. Read them together, '
        + 'with `fitnessGeneCorrelation` and `styleDivergence`.',
    },
    band: { byReadPoint: bandByReadPoint, pairedContrasts: bandContrasts, final: finalBand },
    deflatedReference: {
      note: 'MT-T1\'s committed per-arm band levels — the deflation this stage asks selection about.',
      MTTOP: ruler.available ? ruler.MTTOP : null,
      BOTHTOP: ruler.available ? ruler.BOTHTOP : null,
      ABSENT: ruler.available ? ruler.ABSENT : null,
      goalsVsMttop,
    },
    bodyAtEvolvedDose: {
      note: 'the ARMED arm\'s FINAL-GENERATION genomes, played twice on identical seeds: EVOLVED '
        + '(the two genes as selection left them) vs ZEROED (the two keys deleted). Paired on the '
        + 'league seed. This is MT-T1\'s gated quantity re-read at the dose selection chose.',
      bodyLatGap: bodyContrast, shortfall: shortfallContrast, detach: detachContrast,
      episodes: bodyEpisodes,
    },
    debtCounters: { note: 'the #157 instrument debt — REPORTED, never gated.', byReadPoint: debtByReadPoint },
    attackCoEvolution: attackShape,
    trajectory,
    perSeed: coreA.seeds.map((s) => ({
      leagueSeed: s.leagueSeed,
      arms: Object.fromEntries(ARM_IDS.map((a) => [a, {
        gen0BornAbsent: s.runs[a].gen0BornAbsent,
        matchesPlayed: s.runs[a].matchesPlayed,
        gens: s.runs[a].gens,
        finalGeneMean: finalGenOf(s.runs[a]).geneMean,
      }])),
      body: {
        evolvedMeanBodyLatGap: round(mean(s.body.evolved.map((r) => r.bodyLatGap).filter(Number.isFinite)), 6),
        zeroedMeanBodyLatGap: round(mean(s.body.zeroedRows.map((r) => r.bodyLatGap).filter(Number.isFinite)), 6),
        evolvedEpisodes: s.body.evolved.reduce((a, r) => a + r.episodes, 0),
        zeroedEpisodes: s.body.zeroedRows.reduce((a, r) => a + r.episodes, 0),
      },
    })),
  },
  gates: { ...xGates, xFamilyPass: xPass },
  honesty: [
    'FROZEN BEFORE SIGHT: arms, horizon, read points, seed rule, thresholds, predicates and the '
      + 'three outcome forms were written in the stage doc before any full-run number existed, and '
      + 'are not re-cut afterwards.',
    'THE SMOKE ADJUDICATES NOTHING and may not tune any threshold: it proves plumbing and publishes '
      + 'exactly one sizing number (ms/match) which feeds ONLY the seed count.',
    'THE THREE PRE-NAMED FORMS ARE NOT EXHAUSTIVE. A mixture is reported AS-IS; nothing is re-cut '
      + 'to land on one of them, and a fired (ii)/(iii) is a RESULT that returns a fork to the user.',
    'POWER, STATED HONESTLY: the selection statistic clusters on the LEAGUE SEED, so n = the seed '
      + 'count (single digits to low tens), not the number of teams or matches. This design can see '
      + 'a LARGE consistent effect (a gene mass far from the drift reference in most leagues, a band '
      + 'that plainly restores or plainly does not); it CANNOT resolve a small one, and it will not '
      + 'be read as though it could.',
    'THE INSTRUMENT IS NOT THE SHIPPED ECOLOGY (the Leg-S limit, inherited): no careers, transfers, '
      + 'coaches, morale, promotion/relegation, fire-sale, two divisions, or the four-component '
      + 'computeFitness. A result here is evidence about SELECTION ON WINNING in a round robin.',
    'MT-T2 SHIPS NOTHING (Road B): both seams stay dormant, both genes stay born-absent in every '
      + 'shipped path, and the production fingerprint is re-derived unchanged.',
    'NOTHING HERE IS A WATCHABILITY VERDICT — that is the user\'s play-test, per contract §3.',
  ],
};
/** ⭐ #181.2 + #197-M1: `resultSha256` hashes ONLY the timing-free AND commit-free MEASURED
 *  body, so a third party re-running this probe at ANY commit re-derives it. `head` and the
 *  wall-clock fields ride the envelope, OUTSIDE the hash. */
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
const sizingOut = {
  msPerMatch: round(msPerMatchMeasured, 3),
  matchesPerPass: coreA.matchesPlayed,
  derivation: seedsDerived,
};
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  sizing: sizingOut,
  headContextOnly: head,
  headNote: 'CONTEXT ONLY, and OUTSIDE resultSha256 (#197-M1): the git short-hash of the tree this '
    + 'run was launched from. Recorded for provenance and hashed NOWHERE, so the receipt '
    + 're-derives at any later commit.',
  wallContextOnly: {
    corePassMs: passMs, totalMs: Date.now() - wall0,
    note: 'CONTEXT ONLY, and OUTSIDE resultSha256 — used in no gate. `sizing.msPerMatch` is the '
      + 'one timing number with a job: the frozen seed rule reads it.',
  },
  resumeContextOnly: {
    checkpointPath: CKPT_PATH,
    resumeRequested: RESUME,
    guard: ckptHeader,
    passes: [
      { pass: 1, restored: coreA.restored, computed: coreA.computed, costMs: coreA.costMs },
      { pass: 2, restored: coreB.restored, computed: coreB.computed, costMs: coreB.costMs },
    ],
    note: 'CONTEXT ONLY, and OUTSIDE resultSha256 (the #197-M1 form): which (pass, seed) units '
      + 'this PROCESS computed and which it restored from the /tmp scratch checkpoint. The '
      + 'checkpoint stores the per-seed unit of work verbatim and every pooled quantity, gate, '
      + 'digest and the resultSha256 are recomputed from the union, so a resumed run is '
      + 'byte-identical to an uninterrupted one — which is exactly why this provenance rides '
      + 'the envelope and is hashed NOWHERE.',
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §21 STDOUT                                                                 */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const fmt = (c: Contrast): string => `${c.point >= 0 ? '+' : ''}${c.point} [${c.lower}, ${c.upper}] n=${c.n}${c.resolved ? ' ✔' : ''}`;
o('');
o(`=== MT-T2 CO-EVOLUTION A/B (${MODE}) — HEAD ${head} — ${RUN_SEEDS} league seeds × ${ARM_IDS.length} arms × ${RUN_GENS} gens × ${RUN_TEAMS} teams ===`);
o(`arms  ${ARMS.map((a) => `${a.id}[evolveMarkSag ${a.evolveMarkSag} · evolveDefLaneConvergence ${a.evolveDefLaneConvergence}]`).join('   ')}`);
o(`      consumption flags ON in BOTH arms · fitness = ${fitnessBlind.fitnessLine}`);
o(`seeds evolution ${seedDisjoint.evolutionBlock} · body ${seedDisjoint.bodyBlock}`);
o('');
o('GENE TRAJECTORY (pooled league-mean per generation; ND = the neutral-drift shadow):');
interface TrajArm { geneMean: Record<string, number>; geneSd: Record<string, number>; goals: number; fitnessGeneCorrelation: Record<string, number> }
for (const rowRaw of trajectory) {
  const row = rowRaw as unknown as { gen: number; ARMED: TrajArm; CONTROL: TrajArm; neutralDrift: Record<string, number> };
  const g = row.gen;
  if (!(g === 1 || g % 4 === 0 || g === RUN_GENS || readPointsUsed.includes(g))) continue;
  const A = row.ARMED;
  const C = row.CONTROL;
  const nd = row.neutralDrift;
  o(`  gen ${String(g).padStart(2)}  markSag ${A.geneMean.markSag.toFixed(4)} (sd ${A.geneSd.markSag.toFixed(4)}, ND ${nd.markSag.toFixed(4)}, r_fit ${A.fitnessGeneCorrelation.markSag})`
    + ` · defLane ${A.geneMean.defLaneConvergence.toFixed(4)} (sd ${A.geneSd.defLaneConvergence.toFixed(4)}, ND ${nd.defLaneConvergence.toFixed(4)}, r_fit ${A.fitnessGeneCorrelation.defLaneConvergence})`
    + ` · goals armed ${A.goals.toFixed(3)} / control ${C.goals.toFixed(3)}`);
}
o('');
o('SELECTION STATISTIC (paired on the league seed):');
for (const k of NEW_GENES) {
  o(`  ${k.padEnd(19)} armed ${armedFinalPooled[k]} · control ${controlFinalPooled[k]} · neutral-drift ${driftFinalPooled[k]}`);
  o(`  ${''.padEnd(19)} vs control ${fmt(geneDelta[k])} · vs neutral drift ${fmt(geneVsDrift[k])}`);
}
o(`  ENGAGES ${ENGAGES} (genes: ${ENGAGED_GENES.join(',') || 'none'}) · thresholds eps ${GENE_ZERO_EPS} / high ${GENE_HIGH}`);
o(`  STYLE DIVERGENCE (per-league gene sd at the end): ${NEW_GENES.map((k) => `${k} ${(styleDivergence as Record<string, { meanPerLeagueSd: number }>)[k].meanPerLeagueSd}`).join(' · ')}`);
o('');
o('THE BAND, per read point (gated = dimensions the CONTROL itself holds):');
for (const rp of bandByReadPoint) {
  o(`  gen ${rp.gen} — gated ${rp.gatedDimensions.join(',') || 'none'} · excluded as substrate drift ${rp.excludedAsSubstrateDrift.join(',') || 'none'}`);
  for (const arm of ARM_IDS) {
    const row = arm === 'ARMED' ? rp.armed : rp.control;
    o(`    ${arm.padEnd(8)} ` + BAND_KEYS.map((k) => `${k} ${row[k].level} [${row[k].lo}, ${row[k].hi}] ${row[k].inBand ? 'ok' : 'OUT'}`).join(' · '));
  }
  o(`    ARMED in band on every gated dimension: ${rp.armedInBand} (failed: ${rp.armedFailedGated.join(',') || 'none'})`);
}
o(`  RESTORES ${RESTORES} · RESTORES_PARTIAL ${RESTORES_PARTIAL} (goals vs MT-T1 MTTOP ${mttopGoals}: ${fmt(goalsVsMttop)})`);
o('');
o('THE BODY AT THE EVOLVED DOSE (EVOLVED − ZEROED, paired on the league seed):');
o(`  bodyLatGap ${fmt(bodyContrast)} · shortfall ${fmt(shortfallContrast)} · detach ${fmt(detachContrast)}`);
o(`  episodes evolved ${bodyEpisodes.evolved} / zeroed ${bodyEpisodes.zeroed} · evolved dose `
  + NEW_GENES.map((k) => `${k} mean ${(evolvedDose as Record<string, { meanOverFinalPops: number }>)[k].meanOverFinalPops}`).join(' · '));
o(`  BODY_NEGATIVE ${BODY_NEGATIVE}`);
o('');
o('REPORTED — the #157 debt counters (armed − control):');
for (const d of debtByReadPoint) {
  o(`  gen ${d.gen}: ` + DEBT_KEYS.map((k) => `${k} ${fmt((d.contrasts as Record<string, Contrast>)[k])}`).join(' · '));
}
o('REPORTED — attack-side co-evolution (armed − control, final generation):');
o('  ' + ATTACK_GENES.map((k) => `${k} ${fmt((attackShape.finalContrasts as Record<string, Contrast>)[k])}`).join('\n  '));
o('');
o(`X-FAMILY ${xPass ? 'GREEN' : '*** RED ***'}: `
  + Object.entries(xGates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${(Date.now() - wall0) / 1000}s · ${round(msPerMatchMeasured, 1)} ms/match · matches/pass ${coreA.matchesPlayed} · artifact ${OUT_PATH}`);
if (coreA.restored.length + coreB.restored.length > 0) {
  o(`RESUMED — ${coreA.restored.length + coreB.restored.length} of ${RUN_SEEDS * 2} (pass, seed) units `
    + `restored from ${CKPT_PATH}; the rest recomputed. Every pooled level, CI, gate, digest and `
    + 'the resultSha256 above are recomputed from the union — resilience only, nothing measured differs.');
}
o(`SIZING — seeds* would be ${seedsDerived.seedsStar} (affordable ${seedsDerived.affordable}, cap ${seedsDerived.capBinds}) at ${seedsDerived.msPerMatchPrior} ms/match`);
o(`VERDICT: ${verdict}`);
if (MODE === 'smoke') o('⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.');

if (!xPass) process.exit(1);
if (MODE === 'full' && (OUTCOME_II || OUTCOME_III)) process.exit(2);
process.exit(0);
