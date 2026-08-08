/**
 * MT T1 — THE RULER RE-RUN (the PM-T1 compression exam re-run with the MARK-SAG seam armed).
 *
 * Doc:      docs/world-model/MT-T1-RULER-RERUN.md  (EVERY arm, seed, gate, threshold and
 *           predicate below is frozen THERE, ex ante, before any full-N number existed.)
 * Contract: docs/world-model/MARK-TIGHTNESS-CONTRACT.md §1 H-MT · §2 M-MT.1-5 · §3 the
 *           MT-T1 clause + the pre-named F-MT-a/b/c · §4 the non-claims.
 * Seams:    docs/world-model/MT-T0-DORMANT-SEAM.md (the sag §LAW, the ARMING CHECKLIST)
 *           docs/world-model/PM-T0-DORMANT-SEAM.md (k_PM ≤ 0.25, its arming checklist)
 * THE RULER: docs/world-model/PM-T1-COMPRESSION-EXAM.md + scripts/probes/pm-t1-compression-exam.ts
 *           — every measured QUANTITY below is that exam's, inherited VERBATIM and pinned
 *           line-by-line by G-INHERIT. Any definitional difference is DISCLOSED in the
 *           `inheritance.disclosedDifferences` block of the artifact and in doc §5.0.
 * Rulings:  #202.4 (this dispatch) · #201 (the contract) · #199 (the null this exam tests
 *           against) · #198 (the guard/band set incl. goals) · #196.3-D4 (⚠ THE ARMING
 *           CHECKLISTS ARE BINDING — flags + evolve opt-ins + non-absent genes, ALL) ·
 *           #196.3-D6 (no engine-side dose surface: doses travel the REAL gene channel
 *           via genome views) · #181.2 (receipts = committed recomputable artifacts;
 *           every hash computed HERE) · #197-M1 (nothing commit-dependent inside the
 *           hashed body) · #197-M2 (never drop failing rows) · #194/#196 (state what the
 *           arms DIFFER in).
 *
 * INSTRUMENT-ONLY: zero src/** changes (X-SRC-ZERO is a HARD gate). Both seams are
 * certified and dormant; the doses travel genome views + MatchConfig flags.
 *
 * THE QUESTION. #199 measured the ASK moving (−4.71 m at the top PM dose) while the BODY
 * stayed null (−0.32 [−1.15, +0.47]) because the MARK STANCE owned 80.0–84.6 % of
 * material-ask ticks. MT-T0 built the access-time SAG that prices that stance. This exam
 * asks, on the SAME ruler:
 *   PRIMARY — with MT armed (alone and with PM), do the #199-null BODY contrasts RESOLVE?
 *   F-MT-a  — the sag FIRES but the body still does not move ⇒ wrong delivery geometry ⇒ STOP
 *   F-MT-b  — marking's defensive function breaks (the equilibrium band) ⇒ STOP
 *   F-MT-c  — the clump re-imports (the PM-T1 guard set) ⇒ STOP
 *
 * MODES:  MTT1_MODE=smoke (default) — plumbing only, adjudicates NOTHING
 *         MTT1_MODE=full            — the pre-registered battery
 *         MTT1_N=<n>                — accepted in SMOKE ONLY (turns G-NDERIVED RED in
 *                                     full mode, the #188 nDerived precedent)
 *
 * EXIT SEMANTICS (the commander's monitor reads these):
 *   0 — X-family green, PRIMARY passes, no pre-named STOP fired
 *   1 — an X-family HARD gate failed  ⇒ the MEASUREMENT is invalid
 *   2 — the exam ran clean and a STOP fired (PRIMARY fail / F-MT-a / F-MT-b / F-MT-c)
 *       ⇒ the RESULT is a fork, by contract the user's
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { markSagMetres } from '../../src/ai/actionExecutor';
import { formationSpot, runTarget } from '../../src/ai/formations';
import {
  MARK_SAG_BALL_SPEED, MARK_SAG_MAX, PM_LANE_CONVERGENCE_MAX, markSagWeight, mutateGenome,
  pmLaneConvergenceK, randomGenome, type TacticalGenome,
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
const MODE = (process.env.MTT1_MODE ?? 'smoke') as 'smoke' | 'full';
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('MT-T1 FATAL — MTT1_MODE must be `smoke` or `full`.');
  process.exit(2);
}
const N_ENV = process.env.MTT1_N === undefined ? null : Math.max(1, Number.parseInt(process.env.MTT1_N, 10));
const OUT_PATH = process.env.MTT1_OUT ?? (MODE === 'smoke'
  ? 'docs/world-model/data/mt-t1-ruler-rerun-smoke.json'
  : 'docs/world-model/data/mt-t1-ruler-rerun.json');
const SMOKE_PATH = 'docs/world-model/data/mt-t1-ruler-rerun-smoke.json';

/* ========================================================================== */
/* §1 THE FROZEN DESIGN — THE FIVE ARMS (stage doc §2)                        */
/* ========================================================================== */
/**
 * ⚠ THE TWO ARMING CHECKLISTS (#196.3-D4, BINDING), asserted per arm by G-ARM:
 *   PM armed = the `pmLaneConvergence` MatchConfig flag + the `evolveDefLaneConvergence`
 *              opt-in + a non-absent `defLaneConvergence` gene — ALL THREE.
 *   MT armed = the `mtMarkSag` MatchConfig flag + the `evolveMarkSag` opt-in + a
 *              non-absent `markSag` gene — ALL THREE.
 * This exam is FIXED-DOSE (no evolution runs), so the opt-ins are the channel the genes
 * WOULD travel under selection rather than ones this exam exercises; G-ARM asserts BOTH
 * channels are LIVE (PM-T0/MT-T0's `optInDraws` evidence form). Stated, not implied.
 * Genes are written on ALL THREE genome views (`info.genome` / `baseGenome` / `effGenome`)
 * of BOTH teams — the `a4World` `armGenes` idiom, i.e. the REAL gene channel
 * (#196.3-D6: this exam adds NO engine-side dose surface).
 */
interface ArmSpec {
  readonly id: string;
  readonly pmFlag: boolean;
  readonly mtFlag: boolean;
  /** `null` = the gene ABSENT. */
  readonly pmGene: number | null;
  readonly mtGene: number | null;
  readonly what: string;
}
const ARMS = [
  {
    id: 'ABSENT', pmFlag: false, mtFlag: false, pmGene: null, mtGene: null,
    what: 'THE CONTROL — both flags OFF, both genes absent (the production-shaped defensive path)',
  },
  {
    id: 'ARMEDZERO', pmFlag: true, mtFlag: true, pmGene: null, mtGene: null,
    what: 'the BORN-EQUIVALENCE arm — both flags ON, both genes ABSENT: both branches are '
      + 'ENTERED and both weights evaluate to 0 (PM-T0 G-BORN + MT-T0 G-BORN, re-proved here)',
  },
  {
    id: 'PMTOP', pmFlag: true, mtFlag: false, pmGene: 1, mtGene: null,
    what: 'PM armed at the top dose (k_PM = 0.25, the frozen PM-T0 ceiling), MT OFF — the '
      + 'INTERNAL REPLICATION of #199 (its D100 arm), REPORTED',
  },
  {
    id: 'MTTOP', pmFlag: false, mtFlag: true, pmGene: null, mtGene: 1,
    what: 'MT armed at the top dose (markSag = 1 ⇒ the full frozen sag, cap 9 m), PM OFF',
  },
  {
    id: 'BOTHTOP', pmFlag: true, mtFlag: true, pmGene: 1, mtGene: 1,
    what: 'BOTH seams armed at their top doses — the coupled arm the contract designs for',
  },
] as const satisfies readonly ArmSpec[];
type ArmId = (typeof ARMS)[number]['id'];
const ARM_IDS = ARMS.map((a) => a.id) as ArmId[];
const ARMS_COUNT = ARM_IDS.length;
const CONTROL_ARM: ArmId = 'ABSENT';
/** The two arms the PRIMARY is pre-registered on (the contract §3 "alone and with PM"). */
const PRIMARY_ARMS: readonly ArmId[] = ['MTTOP', 'BOTHTOP'];
const specOf = (a: ArmId): ArmSpec => ARMS[ARM_IDS.indexOf(a)];
const DOSE_ARMS = ARM_IDS.filter((a) => a !== CONTROL_ARM);
/** Both teams are dosed symmetrically — the PM-T1 §2.2 equilibrium frame, inherited. */
const DOSE_BOTH_TEAMS = true;

/** §2.3 the world: the percept-armed substrate PM-T0/PM-T1's own receipts ran in. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;

/* --- §3 the seed ledger ----------------------------------------------------- */
const RESERVED_BAND: readonly [number, number] = [12_313_000, 12_313_999];
const SMOKE_BASE = 12_313_000;
const SMOKE_N = 6;
/** The EXIT-SEMANTICS sub-block: seeds this stage steps ONLY to prove that a full-mode
 *  `MTT1_N` override turns `gNDerived` RED and exits 1. Declared here so the battery's own
 *  seeds stay VIRGIN — that check's output is discarded and adjudicates nothing. */
const EXIT_CHECK_BLOCK: readonly [number, number] = [12_313_100, 12_313_199];
const FULL_BASE = 12_313_200;
/** Honest hard cap: the reserved battery band 12,313,200..12,313,999 = 800 seeds.
 *  A SEED-BUDGET cap, not a statistical claim. */
const N_CAP = 800;
const N_STEP = 25;
/** Every block the A4/O/PM/MT arc has consumed (PM-T1's ledger + PM-T1's own battery +
 *  MT-T0's receipts and test seeds). Disjointness is computed IN-PROBE (G-SEED). */
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
];
/** §3: the stats stream — a THIRD namespace. PM-T1's base was 103,400 ⇒ +200 floor (#163). */
const BOOTSTRAP_SEED = 103_600;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  101_403, 102_000, 102_200, 102_400, 102_600, 102_800, 103_000, 103_200, 103_400,
];

/* --- §4 THE N ARITHMETIC, frozen ex ante ------------------------------------ */
const Z_975 = 1.96;
/** ⭐ THE VARIANCE SOURCE IS SMOKE-FREE and is the SAME published one PM-T1's frozen rule
 *  used: #188's prod-world CI for the weak-side back's per-seed lane gap
 *  (FARSIDE-DEFENDER-FORENSIC §8.3, `sendLatGapMean` p50 19.86 [19.65, 20.04] over 700
 *  per-seed clusters — the WIDEST of its four published worlds, the conservative choice).
 *  ⚠ TWO SUBSTITUTIONS ARE DISCLOSED, NOT HIDDEN (stage doc §4):
 *   (a) it is a MEDIAN's interval used as if it were a mean's — inherited from PM-T1 §4's
 *       own ⚠ CORRECTION (#197-L4); direction CONSERVATIVE (over-sizes N);
 *   (b) PM-T1 GATED on the ask and this exam GATES on the BODY, so the variance term is
 *       a TARGET metric's applied to a BODY metric. Direction UNKNOWN. The rule is not
 *       re-cut for it: the achieved half-width is PUBLISHED per arm and any shortfall is
 *       disclosed (the #188 §8.0 precedent). */
const PUB188_ASK = { p50: 19.86, lo: 19.65, hi: 20.04, clusters: 700 } as const;
const PAIRED_INFLATION = Math.SQRT2;
const TARGET_HALFWIDTH_M = 0.5;
const WALL_BUDGET_HOURS = 2.0;
const XDET_FACTOR = 2;
/** #188's published per-match cost — the PRIOR the wall term uses when no committed smoke
 *  artifact exists yet (the PM-T1 form). */
const PUB188_MS_PER_MATCH = 102.21;

/* --- §5 THE GUARDS: tolerances INHERITED, never invented -------------------- */
/** ⭐ THE S2 NON-INFERIORITY FRACTION, INHERITED VERBATIM (A4-S2P1-VECTOR-CENSUS §4,
 *  via PM-T1 §5.4): `1 − 0.275/0.380 = 0.2763`. The FRACTION is inherited; the SCALE is
 *  the control arm's own level in THIS run. */
const NI_FRACTION = 1 - 0.275 / 0.380;
/** §5 EQUILIBRIUM BAND — inherited VERBATIM from A4-S2P3-GENE-BATTERY §4.2 via PM-T1 §5.5,
 *  INCLUDING goals and INCLUDING its declared SUBSTRATE-DRIFT caveat (a dimension the
 *  CONTROL arm itself fails is DISCLOSED and EXCLUDED from the gate). */
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;
type BandKey = keyof typeof BAND_BASELINE;
const BAND_KEYS = Object.keys(BAND_BASELINE) as BandKey[];

/* --- §6 the #188 instrument constants, inherited VERBATIM (via PM-T1 §6) ---- */
const OWN_THIRD_LOCAL_X = -HALF_L / 3;
const FLANK_ABS_Y = BOX_WIDTH / 2;
const MIN_EPISODE_TICKS = 30;
const SPREAD_R = 9;
/** ⚠ FLAGGED EXECUTOR'S CHOICE, inherited from PM-T1 §5.3 at the SAME value and with the
 *  SAME status: NO GATE PREDICATE READS IT. It only quantifies the REPORTED swallow share. */
const ASK_MATERIAL_M = 1.0;
const ASK_MATERIAL_LADDER = [0.5, 1.0, 2.0] as const;

/* --- the P3′ whole-match guard constants, inherited VERBATIM ---------------- */
const SAMPLE_EVERY = 10;      // 6 Hz
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;       // the spacing FLOOR read
const DUP_RUN_M = 4;

/* --- the SAG-FIRED instrument (NEW this stage — F-MT-a decidability) -------- */
/** The census sampling cadence, inherited VERBATIM from MT-T0's `stanceCensus`. */
const SAG_SAMPLE_EVERY = 15;
/**
 * ⭐ THE MATERIAL-SAG THRESHOLD — **TRACED, NOT A FREE CHOICE**, because unlike
 * `ASK_MATERIAL_M` this number IS read by a gate predicate (F-MT-a's first limb).
 * `1.4` is the FULL SPAN of the stance band the EXISTING tightness gene can express:
 * `src/ai/actionExecutor.ts:294` — `let markDist = ball.owner === mark ? 2.6 : 2.6 -
 * g.markingAggression * 1.4;` — i.e. `markingAggression` sweeping [0,1] moves the stance
 * by exactly 1.4 m. "The sag FIRES materially" therefore means: the new axis moved the
 * stance by at least as much as the whole of the old one can. G-INHERIT pins that source
 * line VERBATIM, so the anchor cannot drift silently.
 */
const SAG_MATERIAL_M = 1.4;

/* --- the X-family pins ------------------------------------------------------ */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* ========================================================================== */
/* §7 HELPERS (inherited from the ruler)                                      */
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

/* ========================================================================== */
/* §8 THE ARMS — both arming checklists + the D6 gene channel                  */
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

const matchOf = (seed: number, arm: ArmId): Match => {
  const s = specOf(arm);
  const base = {
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...PERCEPT_FLAGS,
    ...(s.pmFlag ? { pmLaneConvergence: true } : {}),
    ...(s.mtFlag ? { mtMarkSag: true } : {}),
  };
  const m = new Match(base as ConstructorParameters<typeof Match>[0]);
  if (s.pmGene !== null || s.mtGene !== null) {
    const sides: Side[] = DOSE_BOTH_TEAMS ? [0, 1] : [0];
    for (const side of sides) {
      const t = m.teams[side];
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        if (s.pmGene !== null) g.defLaneConvergence = s.pmGene;
        if (s.mtGene !== null) g.markSag = s.mtGene;
      }
    }
  }
  return m;
};

/** The whole-match signature INCLUDING the rng stream state (PM-T0/PM-T1's form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/* ========================================================================== */
/* §9 THE INSTRUMENT — the ruler's tick-walk, plus the SAG census              */
/* ========================================================================== */
type SteerOwner = 'markStance' | 'markFallback' | 'stationHome' | 'ballDirected' | 'other';
const STATION_HOME_ACTIONS = new Set(['MoveToFormationSpot', 'HoldPosition']);
const BALL_DIRECTED_ACTIONS = new Set([
  'ChaseBall', 'InterceptPass', 'ReceivePass', 'Pass', 'Shoot', 'Dribble', 'Clear',
  'Tackle', 'HeaderChallenge', 'GkSave', 'GkDistribute',
]);
type Family = 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'ONBALL' | 'OTHER';
const familyOf = (p: Player, m: Match): Family => {
  if (m.ball.owner === p) return 'ONBALL';
  switch (p.action.type) {
    case 'MoveToFormationSpot':
    case 'HoldPosition': return 'FORMATION';
    case 'SupportBallCarrier': return 'SUPPORT';
    case 'MakeRun': return 'RUN';
    case 'MarkOpponent': return 'MARK';
    case 'ChaseBall':
    case 'ReceivePass':
    case 'InterceptPass': return 'BALL';
    default: return 'OTHER';
  }
};

/**
 * ⚠ STATED EXACTLY (inherited from MT-T0 Deviation 5): `baseMarkDist` is a probe-side
 * REPLICA of the two unmodulated stance-floor lines in `actionExecutor.ts` (the Phase 30.5
 * floor and the Phase 31.6 distribution stand-off), because the engine keeps `markDist` a
 * block-local scalar and neither slice adds a probe-only engine surface (#196.3-D6). The
 * replica cannot drift silently: G-INHERIT pins BOTH source lines VERBATIM.
 */
const baseMarkDist = (m: Match, side: 0 | 1, markIdx: number, aggression: number): number => {
  const opp = m.teams[1 - side];
  const mark = opp.players[markIdx];
  let d = m.ball.owner === mark ? 2.6 : 2.6 - aggression * 1.4;
  const oppGk = opp.goalkeeper;
  if (
    (m.restart?.kind === 'goalKick' && m.restart.side === mark.side)
    || ((oppGk.gkHoldTimer > 0 || oppGk.gkDistributing) && m.ball.owner === oppGk)
  ) d = Math.max(d, 2.6 - aggression * 0.6);
  return d;
};

/** The SAG census accumulator (MT-T0's `stanceCensus` quantities, carried per arm). */
interface SagAcc {
  samples: number; slackPositive: number; saggedGtBase: number; tightened: number;
  sumBase: number; sumSagged: number; sumSagPositive: number; maxSag: number;
}
const newSagAcc = (): SagAcc => ({
  samples: 0, slackPositive: 0, saggedGtBase: 0, tightened: 0,
  sumBase: 0, sumSagged: 0, sumSagPositive: 0, maxSag: 0,
});
const sagObserve = (acc: SagAcc, m: Match, t: Team, p: Player, markIdx: number): void => {
  const opp = m.teams[1 - t.side];
  const mark = opp.players[markIdx];
  if (!mark) return;
  const sag = markSagMetres(m.ball.pos, mark.pos, p.pos, p.topSpeed);
  const base = baseMarkDist(m, t.side as 0 | 1, markIdx, t.genome.markingAggression);
  const sagged = base + markSagWeight(t.genome) * sag;
  acc.samples += 1;
  acc.sumBase += base;
  acc.sumSagged += sagged;
  if (sag > 0) { acc.slackPositive += 1; acc.sumSagPositive += sag; }
  if (sagged > base + 1e-12) acc.saggedGtBase += 1;
  if (sagged < base - 1e-12) acc.tightened += 1;
  if (sag > acc.maxSag) acc.maxSag = sag;
};
const sagSummary = (a: SagAcc) => ({
  samples: a.samples,
  slackPositive: a.slackPositive,
  slackNonPositive: a.samples - a.slackPositive,
  saggedGtBase: a.saggedGtBase,
  tightened: a.tightened,
  meanBaseMarkDist: round(a.sumBase / Math.max(1, a.samples)),
  meanSaggedMarkDist: round(a.sumSagged / Math.max(1, a.samples)),
  /** the F-MT-a limb reads THIS: the mean sag over slack-positive marker-ticks. */
  meanSagOnSlackPositive: round(a.sumSagPositive / Math.max(1, a.slackPositive)),
  meanSagAllTicks: round(a.sumSagPositive / Math.max(1, a.samples)),
  maxSag: round(a.maxSag),
});
const mergeSag = (into: SagAcc, from: SagAcc): void => {
  into.samples += from.samples; into.slackPositive += from.slackPositive;
  into.saggedGtBase += from.saggedGtBase; into.tightened += from.tightened;
  into.sumBase += from.sumBase; into.sumSagged += from.sumSagged;
  into.sumSagPositive += from.sumSagPositive;
  into.maxSag = Math.max(into.maxSag, from.maxSag);
};

interface BodyAcc {
  ticks: number;
  detach: number[]; distToSend: number[];
  bodyLatGap: number[]; shortfall: number[];
  askLatGap: number[]; askLatGapUnmod: number[]; askShiftY: number[];
  markTicks: number; markFarSideTicks: number; distToMark: number[]; markLatGap: number[];
  steer: Map<SteerOwner, number>;
  materialTicks: number[]; materialMark: number[]; materialStation: number[]; materialOther: number[];
}
const newBodyAcc = (): BodyAcc => ({
  ticks: 0, detach: [], distToSend: [], bodyLatGap: [], shortfall: [],
  askLatGap: [], askLatGapUnmod: [], askShiftY: [],
  markTicks: 0, markFarSideTicks: 0, distToMark: [], markLatGap: [],
  steer: new Map(),
  materialTicks: ASK_MATERIAL_LADDER.map(() => 0),
  materialMark: ASK_MATERIAL_LADDER.map(() => 0),
  materialStation: ASK_MATERIAL_LADDER.map(() => 0),
  materialOther: ASK_MATERIAL_LADDER.map(() => 0),
});

interface EpisodeBody {
  detachMean: number; detachMax: number; distToSendMean: number;
  bodyLatGapMean: number; shortfallMean: number;
  askLatGapMean: number; askLatGapUnmodMean: number; askShiftYMean: number;
  markShare: number; markFarSideShare: number; distToMarkMean: number; markLatGapMean: number;
  steerMix: Record<string, number>;
}
const summarise = (a: BodyAcc): EpisodeBody => ({
  detachMean: mean(a.detach), detachMax: a.detach.length === 0 ? Number.NaN : Math.max(...a.detach),
  distToSendMean: mean(a.distToSend),
  bodyLatGapMean: mean(a.bodyLatGap), shortfallMean: mean(a.shortfall),
  askLatGapMean: mean(a.askLatGap), askLatGapUnmodMean: mean(a.askLatGapUnmod),
  askShiftYMean: mean(a.askShiftY),
  markShare: a.markTicks / Math.max(1, a.ticks),
  markFarSideShare: a.markTicks === 0 ? Number.NaN : a.markFarSideTicks / a.markTicks,
  distToMarkMean: mean(a.distToMark), markLatGapMean: mean(a.markLatGap),
  steerMix: Object.fromEntries([...a.steer.entries()].sort().map(([k, v]) => [k, v / Math.max(1, a.ticks)])),
});

interface Episode {
  seed: number; arm: ArmId; startTick: number; ticks: number; simSeconds: number;
  defSide: Side; flankSign: 1 | -1; weakIdx: 3 | 4;
  weak: EpisodeBody; ballSide: EpisodeBody;
}
interface GuardRow {
  spreadYOut: number; spreadYIn: number; spacingMedian: number; spacingUnder4: number;
  dupRunShare: number;
  offsides: number; fouls: number; penalties: number;
  thirdMan: number; overlaps: number; forwardPassShare: number;
  goals: number; crosses: number; headers: number; longBalls: number; cutbacks: number;
}
interface MatchWalk {
  seed: number; arm: ArmId; episodes: Episode[];
  triggerTicks: number; playedTicks: number; excludedShort: number; excludedSentOff: number;
  guards: GuardRow;
  swallow: { material: number[]; mark: number[]; station: number[]; other: number[] };
  sagAll: SagAcc; sagWeak: SagAcc;
  readOnly: boolean; eyeNull: boolean;
}

function walkMatch(arm: ArmId, seed: number): MatchWalk {
  const m = matchOf(seed, arm);
  const readOnly = m.abandonRestDesignation === null && m.homeRegionGrant === null && m.homeMapGrant === null;
  const eyeNull = m.stationEye === null;
  const episodes: Episode[] = [];
  let triggerTicks = 0; let playedTicks = 0; let excludedShort = 0; let excludedSentOff = 0;

  // --- episode state (the ruler's, verbatim) ---
  let openKey: string | null = null;
  let startTick = 0; let ticks = 0; let sentOffSeen = false;
  let defSide: Side = 0; let flankSign: 1 | -1 = 1; let weakIdx: 3 | 4 = 3; let ballIdx: 3 | 4 = 4;
  let weakAcc = newBodyAcc(); let ballAcc = newBodyAcc();
  const swallow = {
    material: ASK_MATERIAL_LADDER.map(() => 0), mark: ASK_MATERIAL_LADDER.map(() => 0),
    station: ASK_MATERIAL_LADDER.map(() => 0), other: ASK_MATERIAL_LADDER.map(() => 0),
  };
  // --- the SAG census: match-wide (MT-T0's layer) + the WEAK-SIDE BACK in-trigger layer
  //     (the body the PRIMARY gates on — this is the layer F-MT-a's first limb reads) ---
  const sagAll = newSagAcc(); const sagWeak = newSagAcc();

  // --- whole-match guard accumulators (the P3′ / B1-a instrument forms) ---
  const pairs: [number[], number[]] = [[], []];
  const runTicks = [0, 0]; const dupTicks = [0, 0];
  const spreadOut: [number[], number[]] = [[], []];
  const spreadIn: [number[], number[]] = [[], []];
  let samples = 0; let tick = 0;

  const closeEpisode = (): void => {
    if (openKey === null) return;
    if (ticks < MIN_EPISODE_TICKS) excludedShort += 1;
    else if (sentOffSeen || weakAcc.ticks === 0 || ballAcc.ticks === 0) excludedSentOff += 1;
    else {
      episodes.push({
        seed, arm, startTick, ticks, simSeconds: ticks * DT, defSide, flankSign, weakIdx,
        weak: summarise(weakAcc), ballSide: summarise(ballAcc),
      });
      for (let i = 0; i < ASK_MATERIAL_LADDER.length; i++) {
        swallow.material[i] += weakAcc.materialTicks[i];
        swallow.mark[i] += weakAcc.materialMark[i];
        swallow.station[i] += weakAcc.materialStation[i];
        swallow.other[i] += weakAcc.materialOther[i];
      }
    }
    openKey = null;
  };

  while (!m.finished) {
    m.step(DT);
    tick += 1;
    if (m.finished) break;
    if (m.phase === 'playing') playedTicks += 1;

    /* ---------------- the #188 §1 TRIGGER, verbatim ---------------------- */
    const a = m.possessionSide;
    const owner = m.ball.owner;
    const inTrigger = m.phase === 'playing' && m.restart === null && a !== -1
      && owner !== null && owner.side === a && owner.role !== 'GK'
      && m.teams[(1 - a) as Side].localX(m.ball.pos.x) < OWN_THIRD_LOCAL_X
      && Math.abs(m.ball.pos.y) >= FLANK_ABS_Y;

    if (inTrigger) {
      triggerTicks += 1;
      const d = (1 - a) as Side;
      const fs: 1 | -1 = m.ball.pos.y > 0 ? 1 : -1;
      const key = `${d}|${fs}`;
      if (openKey !== key) {
        closeEpisode();
        openKey = key; startTick = m.simTick; ticks = 0; sentOffSeen = false;
        defSide = d; flankSign = fs;
        weakIdx = fs > 0 ? 3 : 4; ballIdx = fs > 0 ? 4 : 3;
        weakAcc = newBodyAcc(); ballAcc = newBodyAcc();
      }
      ticks += 1;
      const dTeam = m.teams[d];
      const aTeam = m.teams[a as Side];
      const weak = dTeam.players[weakIdx];
      const mirror = dTeam.players[ballIdx];
      if (weak === undefined || mirror === undefined || weak.sentOff || mirror.sentOff) {
        sentOffSeen = true;
      } else {
        const observe = (p: Player, acc: BodyAcc, isWeak: boolean): void => {
          acc.ticks += 1;
          // §3.1 detachment — from the centroid of the REST of his outfield team
          let cx = 0; let cy = 0; let n = 0;
          for (const q of dTeam.players) {
            if (q === p || q.role === 'GK' || q.sentOff) continue;
            cx += q.pos.x; cy += q.pos.y; n += 1;
          }
          acc.detach.push(n === 0 ? Number.NaN : Math.hypot(p.pos.x - cx / n, p.pos.y - cy / n));

          // §3.2 THE SEND (the ASK) — a RECOMPUTED COUNTERFACTUAL STATION READ, exactly as
          // the ruler's ⚠ CORRECTION (#197-L6) states: the probe calls `formationSpot`
          // itself with `pmMover = true` (the same ARGUMENT actionExecutor.ts :145/:336
          // pass); on markStance ticks the executor never calls it at all.
          // ⚠ MT-ONLY ARMS: `formationSpot`'s PM branch reads the GENE (`pmLaneConvergenceK`),
          // not the MatchConfig flag — so at ABSENT / ARMEDZERO / MTTOP the modulated and
          // unmodulated reads are IDENTICAL BY CONSTRUCTION (k_PM = 0) and every ask
          // quantity, including the swallow share, is degenerate there. Stated, not implied.
          const askMod = formationSpot(p, dTeam, m.ball, false, aTeam, false, true);
          const askUnmod = formationSpot(p, dTeam, m.ball, false, aTeam, false, false);
          acc.distToSend.push(Math.hypot(p.pos.x - askMod.x, p.pos.y - askMod.y));
          acc.askLatGap.push(Math.abs(askMod.y - m.ball.pos.y));
          acc.askLatGapUnmod.push(Math.abs(askUnmod.y - m.ball.pos.y));
          const shiftY = Math.abs(askMod.y - askUnmod.y);
          acc.askShiftY.push(shiftY);

          // §3.3 the ANSWER (the BODY) — ⭐ THE GATED QUANTITY OF THIS EXAM
          const bodyGap = Math.abs(p.pos.y - m.ball.pos.y);
          acc.bodyLatGap.push(bodyGap);
          acc.shortfall.push(Math.max(0, bodyGap - SPREAD_R));

          // D2 steer owner (NO switchKey anywhere — #188 §8.4 / map §5 trap 7)
          const markIdx = p.action.type === 'MarkOpponent' ? p.action.targetIdx : undefined;
          const marked = markIdx === undefined ? undefined : aTeam.players[markIdx];
          const steer: SteerOwner = p.action.type === 'MarkOpponent'
            ? (marked === undefined ? 'markFallback' : 'markStance')
            : STATION_HOME_ACTIONS.has(p.action.type) ? 'stationHome'
              : BALL_DIRECTED_ACTIONS.has(p.action.type) ? 'ballDirected' : 'other';
          acc.steer.set(steer, (acc.steer.get(steer) ?? 0) + 1);

          if (marked !== undefined && !marked.sentOff) {
            acc.markTicks += 1;
            acc.distToMark.push(Math.hypot(p.pos.x - marked.pos.x, p.pos.y - marked.pos.y));
            acc.markLatGap.push(Math.abs(marked.pos.y - m.ball.pos.y));
            if (Math.sign(marked.pos.y) === -flankSign) acc.markFarSideTicks += 1;
          }

          // ⭐ THE SAG-FIRED INSTRUMENT, weak-side-back layer: on the very ticks the BODY
          // contrast is built from, is the marker's stance actually sagged? (out of
          // possession + a resolvable mark — the seam's own conditions).
          if (isWeak && markIdx !== undefined && marked !== undefined) {
            sagObserve(sagWeak, m, dTeam as Team, p, markIdx);
          }

          // the REPORTED swallow share (PM-T1 §5.3's instrument, verbatim; NO gate reads it)
          if (isWeak) {
            for (let i = 0; i < ASK_MATERIAL_LADDER.length; i++) {
              if (shiftY < ASK_MATERIAL_LADDER[i]) continue;
              acc.materialTicks[i] += 1;
              if (steer === 'markStance') acc.materialMark[i] += 1;
              else if (steer === 'stationHome' || steer === 'markFallback') acc.materialStation[i] += 1;
              else acc.materialOther[i] += 1;
            }
          }
        };
        observe(weak, weakAcc, true);
        observe(mirror, ballAcc, false);
      }
    } else {
      closeEpisode();
    }

    /* -------- the MATCH-WIDE SAG census (MT-T0's `stanceCensus`, same cadence) -- */
    if (tick % SAG_SAMPLE_EVERY === 0 && m.phase === 'playing') {
      for (const t of m.teams) {
        if (m.possessionSide === t.side) continue; // the seam is out-of-possession only
        for (const p of t.players) {
          if (p.sentOff || p.action.type !== 'MarkOpponent') continue;
          const mi = p.action.targetIdx;
          if (mi === undefined) continue;
          sagObserve(sagAll, m, t as Team, p, mi);
        }
      }
    }

    /* ---------------- the whole-match GUARDS (B1-a + P3′ forms) ---------- */
    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const side = t.side as 0 | 1;
      const opp = m.teams[1 - side];
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outfield.length === 0) continue;
      const hasBall = m.possessionSide === side;
      (hasBall ? spreadIn : spreadOut)[side].push(sd(outfield.map((p) => p.pos.y)));
      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) pairs[side].push(dist2(outfield[i].pos, outfield[j].pos));
        }
      }
      const crashLive = t.cornerCrash !== null && m.simTime < t.cornerCrash.until;
      const liveCorner = m.restart?.kind === 'corner' && m.restart.side === side;
      const runners = outfield.filter((p) => familyOf(p, m) === 'RUN'
        && t.arriver !== p.index && t.overlapper !== p.index
        && !((crashLive || liveCorner) && t.runners.has(p.index)));
      if (runners.length >= 2) {
        runTicks[side] += 1;
        const targets = runners.map((p) => runTarget(p, t as Team, opp.players));
        let dup = false;
        for (let i = 0; i < targets.length && !dup; i++) {
          for (let j = i + 1; j < targets.length && !dup; j++) {
            if (dist2(targets[i], targets[j]) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) dupTicks[side] += 1;
      }
    }
  }
  closeEpisode();

  const bothPairs = [...pairs[0], ...pairs[1]];
  const st = [m.teams[0].stats, m.teams[1].stats];
  const passes = st[0].passes + st[1].passes;
  const guards: GuardRow = {
    spreadYOut: mean([...spreadOut[0], ...spreadOut[1]]),
    spreadYIn: mean([...spreadIn[0], ...spreadIn[1]]),
    spacingMedian: quantile(bothPairs, 0.5),
    spacingUnder4: bothPairs.length === 0 ? Number.NaN
      : bothPairs.filter((v) => v < CLOSE_PAIR_M).length / bothPairs.length,
    dupRunShare: (runTicks[0] + runTicks[1]) === 0 ? Number.NaN
      : (dupTicks[0] + dupTicks[1]) / (runTicks[0] + runTicks[1]),
    offsides: st[0].offsides + st[1].offsides,
    fouls: st[0].fouls + st[1].fouls,
    penalties: st[0].penalties + st[1].penalties,
    thirdMan: st[0].thirdMan + st[1].thirdMan,
    overlaps: st[0].overlaps + st[1].overlaps,
    forwardPassShare: passes === 0 ? Number.NaN : (st[0].passesForward + st[1].passesForward) / passes,
    goals: st[0].goals + st[1].goals,
    crosses: st[0].crosses + st[1].crosses,
    headers: st[0].headersWon + st[1].headersWon,
    longBalls: st[0].longBalls + st[1].longBalls,
    cutbacks: st[0].cutbacks + st[1].cutbacks,
  };
  return {
    seed, arm, episodes, triggerTicks, playedTicks, excludedShort, excludedSentOff,
    guards, swallow, sagAll, sagWeak, readOnly, eyeNull,
  };
}

/* ========================================================================== */
/* §10 THE PAIRED PER-SEED CONTRAST ENGINE (the ruler's, verbatim)            */
/* ========================================================================== */
interface Contrast {
  n: number; control: number; treated: number; point: number;
  lower: number; upper: number; resolved: boolean;
}
const EMPTY_CONTRAST: Contrast = {
  n: 0, control: Number.NaN, treated: Number.NaN, point: Number.NaN,
  lower: Number.NaN, upper: Number.NaN, resolved: false,
};
let bootOffset = 0;
const contrastOf = (ctrl: readonly number[], treat: readonly number[]): Contrast => {
  const ci: number[] = []; const ti: number[] = [];
  for (let i = 0; i < ctrl.length; i++) {
    if (Number.isFinite(ctrl[i]) && Number.isFinite(treat[i])) { ci.push(ctrl[i]); ti.push(treat[i]); }
  }
  const n = ci.length;
  if (n === 0) return { ...EMPTY_CONTRAST };
  const diffs = ti.map((v, i) => v - ci[i]);
  const point = mean(diffs);
  const rng = new Rng(BOOTSTRAP_SEED + (bootOffset += 1));
  const draws: number[] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    let s = 0;
    for (let k = 0; k < n; k++) s += diffs[Math.min(n - 1, Math.floor(rng.next() * n))];
    draws.push(s / n);
  }
  draws.sort((p, q) => p - q);
  const lower = pctlSorted(draws, 0.025); const upper = pctlSorted(draws, 0.975);
  return {
    n, control: round(mean(ci)), treated: round(mean(ti)), point: round(point),
    lower: round(lower), upper: round(upper), resolved: lower > 0 || upper < 0,
  };
};

/* ========================================================================== */
/* §11 N — DERIVED IN CODE, BEFORE A SINGLE BATTERY MATCH IS STEPPED          */
/* ========================================================================== */
const frozenNStar = (msPerMatch: number, msSource: string, pairYield: number, yieldSource: string) => {
  const halfWidth188 = (PUB188_ASK.hi - PUB188_ASK.lo) / 2;
  const sigmaPerSeed = (halfWidth188 / Z_975) * Math.sqrt(PUB188_ASK.clusters);
  const sigmaDelta = sigmaPerSeed * PAIRED_INFLATION;
  const pairsNeeded = Math.ceil(((Z_975 * sigmaDelta) / TARGET_HALFWIDTH_M) ** 2);
  const nRaw = Math.ceil(pairsNeeded / Math.max(1e-9, pairYield));
  const nStepped = Math.ceil(nRaw / N_STEP) * N_STEP;
  const nWall = Math.floor((WALL_BUDGET_HOURS * 3_600_000) / (msPerMatch * ARMS_COUNT * XDET_FACTOR));
  const terms = { precision: nStepped, wallBudget: nWall, reservedBandCap: N_CAP };
  const nStar = Math.min(nStepped, nWall, N_CAP);
  const bindingTerm = (Object.entries(terms).find(([, v]) => v === nStar) ?? ['none'])[0];
  return {
    arithmetic: 'pairsNeeded = ceil( (1.96·σ_delta / 0.5 m)² ) · '
      + 'N* = min( ceil(pairsNeeded / pairYield) rounded up to 25, '
      + 'floor( 2.0 h / (ms_per_match × 5 arms × 2 X-DET) ), 800 ) — frozen in stage doc §4',
    varianceSource: 'FARSIDE-DEFENDER-FORENSIC §8.3, prod world (the WIDEST of the four published '
      + 'worlds): weak-side back sendLatGapMean p50 19.86 [19.65, 20.04] over 700 per-seed '
      + 'clusters. σ_perSeed = (halfWidth / 1.96) · √700. NO SMOKE NUMBER FEEDS THIS TERM. '
      + '⚠ TWO DISCLOSED SUBSTITUTIONS: (a) a MEDIAN interval used as a mean\'s (inherited from '
      + 'PM-T1 §4 ⚠ #197-L4; direction CONSERVATIVE); (b) an ASK-metric variance applied to a '
      + 'BODY-metric gate (direction UNKNOWN — the achieved half-widths are PUBLISHED per arm '
      + 'and any shortfall is disclosed, never re-cut).',
    pub188: PUB188_ASK,
    pairsNeeded,
    pairYield: round(pairYield, 4), pairYieldSource: yieldSource,
    pairYieldNote: 'the trigger is rare and the arms diverge, so not every seed yields a PAIRED '
      + '(control, arm) BODY value. ⚠ DISCLOSED DIFFERENCE from the ruler: PM-T1 measured this '
      + 'yield on the ASK because the ask was its gated quantity; this exam measures it on the '
      + 'BODY, which is THIS exam\'s gated quantity. Same episodes, same pairing rule.',
    halfWidth188: round(halfWidth188), sigmaPerSeed: round(sigmaPerSeed),
    pairedInflation: round(PAIRED_INFLATION),
    pairedInflationNote: 'σ_delta = √2 · σ_perSeed — CONSERVATIVE: it treats the arms as '
      + 'INDEPENDENT, which over-states the variance of a paired same-seed delta.',
    targetHalfWidthM: TARGET_HALFWIDTH_M,
    msPerMatch: round(msPerMatch, 3), msPerMatchSource: msSource,
    nRaw, nStepped, nStep: N_STEP, nWall, nCap: N_CAP,
    capHonesty: 'N_CAP = 800 is the reserved battery band 12,313,200..12,313,999 — a SEED-BUDGET '
      + 'cap, not a statistical statement. If it binds, the achieved half-width may be wider than '
      + 'the 0.5 m target and that shortfall is DISCLOSED, never re-cut (the #188 §8.0 precedent). '
      + 'The achieved half-width of every body contrast is published in '
      + '`results.primary.achievedHalfWidthM`, so the shortfall (or its absence) is measured, not '
      + 'assumed.',
    terms, nStar, bindingTerm,
    projectedWallHours: round((nStar * ARMS_COUNT * XDET_FACTOR * msPerMatch) / 3_600_000, 3),
  };
};

const nDerivation = ((): Record<string, unknown> & { n: number } => {
  if (MODE === 'smoke') {
    return {
      mode: 'smoke',
      note: 'SMOKE. N is fixed by stage doc §3 at 6 seeds (12,313,000..12,313,005). The §4 '
        + 'arithmetic does not select it: THE SMOKE ADJUDICATES NOTHING and may not tune any '
        + 'threshold; it exists to prove plumbing and to publish ms/match + the paired yield.',
      n: N_ENV ?? SMOKE_N,
      envOverride: N_ENV,
    };
  }
  let msPerMatch = PUB188_MS_PER_MATCH;
  let msSource = 'PUBLISHED PRIOR — FARSIDE-DEFENDER-FORENSIC §8.0 census cost 102.21 ms/match '
    + '(no committed smoke artifact found)';
  let pairYield = 1;
  let yieldSource = 'DEGENERATE PRIOR 1.0 (no committed smoke artifact found) — N is then stated '
    + 'in matches as if every seed paired, and the shortfall would be disclosed';
  let smokeSha: string | null = null;
  if (existsSync(SMOKE_PATH)) {
    const bytes = readFileSync(SMOKE_PATH);
    const smoke = JSON.parse(bytes.toString('utf8')) as {
      mode?: string; sizing?: { msPerMatch?: number; pairYieldMin?: number };
    };
    const v = smoke.sizing?.msPerMatch;
    const y = smoke.sizing?.pairYieldMin;
    if (smoke.mode === 'smoke' && typeof v === 'number' && v > 0 && typeof y === 'number' && y > 0) {
      msPerMatch = v;
      pairYield = y;
      smokeSha = createHash('sha256').update(bytes).digest('hex');
      msSource = `the committed SMOKE artifact ${SMOKE_PATH} (sha256 ${smokeSha})`;
      yieldSource = `the same committed SMOKE artifact — THE SMOKE INFORMS ONLY N (the #188 §4.3 `
        + 'precedent): exactly two numbers are read out of it, ms/match and the MINIMUM paired-BODY '
        + 'yield over the four non-control arms. No level, share, rate, CI or threshold from it is '
        + 'read anywhere. ⚠ The probe reads the WORKING-TREE file at that path, not the committed '
        + 'blob — the provenance is sha-audited (this field), not git-enforced (PM-T1 §4 #197-L3).';
    }
  }
  const derived = frozenNStar(msPerMatch, msSource, pairYield, yieldSource);
  return {
    mode: 'full', smokeArtifact: SMOKE_PATH, smokeArtifactSha256: smokeSha,
    ...derived, envOverride: N_ENV, n: N_ENV ?? derived.nStar,
  };
})();

/** ⭐ A full-mode `MTT1_N` override is BY DEFINITION not the battery: `gNDerived` goes RED
 *  and the process exits 1. Such a run is therefore routed onto the EXIT-SEMANTICS
 *  sub-block, so it can never consume a battery seed. The battery itself always starts at
 *  `FULL_BASE` and can only be reached with NO override. */
const RUN_BASE = MODE === 'smoke' ? SMOKE_BASE
  : (N_ENV === null ? FULL_BASE : EXIT_CHECK_BLOCK[0]);
const RUN_N = nDerivation.n;

/* ========================================================================== */
/* §12 THE STARTUP BANNER — the derived N + the frozen predicates enforced    */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
banner('');
banner('=============================================================================');
banner(`MT-T1 — THE RULER RE-RUN · mode ${MODE} · N ${RUN_N} seeds × ${ARMS_COUNT} arms`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1}   (reserved band ${RESERVED_BAND[0]}..${RESERVED_BAND[1]})`);
for (const s of ARMS) {
  banner(`  ${s.id.padEnd(9)} pmFlag ${String(s.pmFlag).padEnd(5)} mtFlag ${String(s.mtFlag).padEnd(5)}`
    + ` defLaneConvergence ${s.pmGene === null ? 'ABSENT' : s.pmGene}  markSag ${s.mtGene === null ? 'ABSENT' : s.mtGene}`);
}
banner(`ceilings      k_PM ≤ ${PM_LANE_CONVERGENCE_MAX} (PM-T0, not re-cut) · sag ≤ ${MARK_SAG_MAX} m,`
  + ` t_ball speed ${MARK_SAG_BALL_SPEED} m/s (MT-T0, not re-cut)`);
banner(`N derivation  ${String(nDerivation.arithmetic ?? nDerivation.note)}`);
if (MODE === 'full') {
  banner(`              pairsNeeded ${nDerivation.pairsNeeded} / pairYield ${nDerivation.pairYield}`
    + ` = ${nDerivation.nRaw} → step ${nDerivation.nStepped} · wall ${nDerivation.nWall} · cap ${N_CAP}`
    + ` ⇒ N* ${nDerivation.nStar} (${String(nDerivation.bindingTerm)} binds; projected wall ${String(nDerivation.projectedWallHours)} h)`);
} else {
  banner('              ⚠ SMOKE — PLUMBING ONLY. It adjudicates NOTHING and tunes NO threshold;');
  banner('                it publishes exactly two sizing numbers (ms/match, min paired-BODY yield).');
}
banner('FROZEN PREDICATES ENFORCED THIS RUN (all contrasts paired per-seed vs the ABSENT control):');
banner('  PRIMARY := for BOTH of MTTOP and BOTHTOP —');
banner('     CI_upper( bodyLatGap ) < 0  ∧  CI_upper( compressionShortfall ) < 0');
banner('     ∧  ¬resolvedPositive( detachMean )   [detachment must NOT resolve upward]');
banner(`  SAG-FIRED(arm) := weak-back in-trigger census: saggedGtBase > 0 ∧ tightened = 0`);
banner(`                    ∧ meanSagOnSlackPositive ≥ ${SAG_MATERIAL_M} m (the TRACED markingAggression stance band)`);
banner('  F-MT-a := SAG-FIRED(MTTOP) ∧ SAG-FIRED(BOTHTOP) ∧ bodyLatGap CI INCLUDES ZERO at BOTH ⇒ STOP');
banner('  F-MT-b := (∃ body-moving arm) ∧ (∀ body-moving arm: the equilibrium BAND fails on a');
banner('            GATED dimension — dimensions the CONTROL itself fails are EXCLUDED) ⇒ STOP');
banner('  F-MT-c := (∃ body-moving arm) ∧ (∀ body-moving arm: GUARD-NI fails) ⇒ STOP');
banner(`    GUARD-NI(a) := spreadY_out & spacingMedian CI_lower > −tol ∧ under4 & dupRun CI_upper < +tol,`);
banner(`                   tol = ${round(NI_FRACTION, 4)} × the CONTROL arm's own level (S2 form, A4-S2P1 §4)`);
banner('  FLAG    := offsides — returns to the USER, NEVER flips PASS/FAIL (the #157 debt / F-S2d form)');
banner('  REPORTED, NO GATE: the swallow share · mark-assignment drift · the ask instruments');
banner('            (PMTOP/BOTHTOP replicate #199; at ABSENT/ARMEDZERO/MTTOP the ask is UNMODULATED');
banner('            BY CONSTRUCTION — formationSpot reads the GENE, and defLaneConvergence is absent)');
banner('=============================================================================');
banner('');

/* ========================================================================== */
/* §13 THE CORE (run TWICE for X-DET)                                         */
/* ========================================================================== */
const PROGRESS_EVERY_MS = 30_000;
let lastProgress = Date.now();
const progress = (tag: string, done: number, total: number): void => {
  const now = Date.now();
  if (now - lastProgress < PROGRESS_EVERY_MS && done !== total) return;
  lastProgress = now;
  const el = (now - wall0) / 1000;
  const rate = done === 0 ? 0 : el / done;
  process.stderr.write(`  [mt-t1 ${tag}] ${done}/${total} matches · ${el.toFixed(0)}s elapsed · `
    + `${rate.toFixed(2)} s/match · ETA ${((total - done) * rate).toFixed(0)}s\n`);
};

interface CoreOut {
  seeds: { base: number; n: number; first: number; last: number };
  perArm: Record<string, {
    matches: number; episodes: number; episodesPerMatch: number;
    triggerTickShare: number; excludedShort: number; excludedSentOff: number;
  }>;
  perSeed: Record<string, Record<string, number[]>>;
  guardSeries: Record<string, Record<string, number[]>>;
  swallow: Record<string, { material: number[]; mark: number[]; station: number[]; other: number[] }>;
  sag: Record<string, { matchWide: ReturnType<typeof sagSummary>; weakInTrigger: ReturnType<typeof sagSummary> }>;
  levels: Record<string, Record<string, unknown>>;
  receipts: unknown[];
  readOnly: boolean; eyeNull: boolean;
}

const EPI_KEYS = [
  'askLatGapMean', 'askLatGapUnmodMean', 'askShiftYMean',
  'bodyLatGapMean', 'shortfallMean', 'detachMean', 'distToSendMean',
  'markShare', 'markFarSideShare', 'distToMarkMean', 'markLatGapMean',
] as const;
const GUARD_KEYS = [
  'spreadYOut', 'spreadYIn', 'spacingMedian', 'spacingUnder4', 'dupRunShare',
  'offsides', 'fouls', 'penalties', 'thirdMan', 'overlaps', 'forwardPassShare',
  'goals', 'crosses', 'headers', 'longBalls', 'cutbacks',
] as const;

const runCore = (tag: string): CoreOut => {
  const seeds = Array.from({ length: RUN_N }, (_, i) => RUN_BASE + i);
  const perArm = {} as CoreOut['perArm'];
  const perSeed = {} as CoreOut['perSeed'];
  const guardSeries = {} as CoreOut['guardSeries'];
  const swallowOut = {} as CoreOut['swallow'];
  const sagOut = {} as CoreOut['sag'];
  const levels = {} as CoreOut['levels'];
  const receipts: unknown[] = [];
  let readOnly = true; let eyeNull = true;
  let done = 0; const total = RUN_N * ARMS_COUNT;

  for (const arm of ARM_IDS) {
    const walks: MatchWalk[] = [];
    for (const seed of seeds) {
      walks.push(walkMatch(arm, seed));
      done += 1;
      progress(tag, done, total);
    }
    readOnly = readOnly && walks.every((w) => w.readOnly);
    eyeNull = eyeNull && walks.every((w) => w.eyeNull);
    const eps = walks.flatMap((w) => w.episodes);
    perArm[arm] = {
      matches: walks.length, episodes: eps.length,
      episodesPerMatch: round(eps.length / Math.max(1, walks.length), 4),
      triggerTickShare: round(walks.reduce((s, w) => s + w.triggerTicks, 0)
        / Math.max(1, walks.reduce((s, w) => s + w.playedTicks, 0))),
      excludedShort: walks.reduce((s, w) => s + w.excludedShort, 0),
      excludedSentOff: walks.reduce((s, w) => s + w.excludedSentOff, 0),
    };
    const bySeedEp: Record<string, number[]> = {};
    for (const k of EPI_KEYS) { bySeedEp[k] = []; bySeedEp[`mirror_${k}`] = []; }
    for (const w of walks) {
      for (const k of EPI_KEYS) {
        bySeedEp[k].push(mean(w.episodes.map((e) => e.weak[k]).filter(Number.isFinite)));
        bySeedEp[`mirror_${k}`].push(mean(w.episodes.map((e) => e.ballSide[k]).filter(Number.isFinite)));
      }
    }
    perSeed[arm] = bySeedEp;
    const bySeedGuard: Record<string, number[]> = {};
    for (const k of GUARD_KEYS) bySeedGuard[k] = walks.map((w) => w.guards[k]);
    guardSeries[arm] = bySeedGuard;
    swallowOut[arm] = {
      material: ASK_MATERIAL_LADDER.map((_, i) => walks.reduce((s, w) => s + w.swallow.material[i], 0)),
      mark: ASK_MATERIAL_LADDER.map((_, i) => walks.reduce((s, w) => s + w.swallow.mark[i], 0)),
      station: ASK_MATERIAL_LADDER.map((_, i) => walks.reduce((s, w) => s + w.swallow.station[i], 0)),
      other: ASK_MATERIAL_LADDER.map((_, i) => walks.reduce((s, w) => s + w.swallow.other[i], 0)),
    };
    const allAcc = newSagAcc(); const weakAccAll = newSagAcc();
    for (const w of walks) { mergeSag(allAcc, w.sagAll); mergeSag(weakAccAll, w.sagWeak); }
    sagOut[arm] = { matchWide: sagSummary(allAcc), weakInTrigger: sagSummary(weakAccAll) };
    const lv: Record<string, unknown> = {};
    for (const k of EPI_KEYS) {
      const xs = eps.map((e) => e.weak[k]).filter(Number.isFinite);
      const mx = eps.map((e) => e.ballSide[k]).filter(Number.isFinite);
      lv[k] = {
        weak: { mean: round(mean(xs)), p50: round(quantile(xs, 0.5)), p90: round(quantile(xs, 0.9)), n: xs.length },
        mirror: { mean: round(mean(mx)), p50: round(quantile(mx, 0.5)), n: mx.length },
      };
    }
    const steerMix = new Map<string, number>();
    let steerTicks = 0;
    for (const e of eps) {
      for (const [k, v] of Object.entries(e.weak.steerMix)) steerMix.set(k, (steerMix.get(k) ?? 0) + v * e.ticks);
      steerTicks += e.ticks;
    }
    lv.steerMix = Object.fromEntries([...steerMix.entries()].sort((p, q) => q[1] - p[1])
      .map(([k, v]) => [k, round(v / Math.max(1, steerTicks), 5)]));
    lv.detachP90 = round(quantile(eps.map((e) => e.weak.detachMean).filter(Number.isFinite), 0.9));
    levels[arm] = lv;
    receipts.push(...[...eps].sort((p, q) => q.weak.detachMean - p.weak.detachMean).slice(0, 6).map((e) => ({
      arm, seed: e.seed, startTick: e.startTick, simSeconds: round(e.simSeconds, 3),
      defendingSide: e.defSide, flankSign: e.flankSign, weakSideSlot: e.weakIdx,
      askLatGap: round(e.weak.askLatGapMean, 3), askLatGapUnmodulated: round(e.weak.askLatGapUnmodMean, 3),
      bodyLatGap: round(e.weak.bodyLatGapMean, 3), detach: round(e.weak.detachMean, 3),
      distToSend: round(e.weak.distToSendMean, 3), markShare: round(e.weak.markShare, 4),
      steerMix: Object.fromEntries(Object.entries(e.weak.steerMix).map(([k, v]) => [k, round(v, 4)])),
      watchHint: `MT-T1 arm ${arm} (defLaneConvergence ${String(specOf(arm).pmGene)}, markSag `
        + `${String(specOf(arm).mtGene)}), seed ${e.seed}, from tick ${e.startTick} `
        + `(${round(e.startTick * DT, 2)} sim-s), defending side ${e.defSide}, ball flank `
        + `${e.flankSign > 0 ? '+y' : '-y'}, weak-side slot ${e.weakIdx}`,
    })));
  }
  return {
    seeds: { base: RUN_BASE, n: RUN_N, first: seeds[0], last: seeds[seeds.length - 1] },
    perArm, perSeed, guardSeries, swallow: swallowOut, sag: sagOut, levels, receipts, readOnly, eyeNull,
  };
};

const tCore = Date.now();
const coreA = runCore('pass1');
const passMs = Date.now() - tCore;
const coreB = runCore('pass2');
const digestA = sha(canonical(coreA));
const digestB = sha(canonical(coreB));
const xDet = digestA === digestB;
process.stderr.write(`  [mt-t1] X-DET ${xDet ? 'PASS' : '*** FAIL ***'} (${digestA.slice(0, 12)} / ${digestB.slice(0, 12)})\n`);

/* ========================================================================== */
/* §14 THE FROZEN GATE ARITHMETIC                                             */
/* ========================================================================== */
const bodyKey = 'bodyLatGapMean';
const askKey = 'askLatGapMean';
const ctrlSeries = (k: string): number[] => coreA.perSeed[CONTROL_ARM][k];
const guardCtrl = (k: string): number[] => coreA.guardSeries[CONTROL_ARM][k];

/** ---- THE PRIMARY: the BODY (this exam's gated quantity) ------------------- */
const bodyContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(bodyKey), coreA.perSeed[a][bodyKey])])) as Record<string, Contrast>;
const shortfallContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries('shortfallMean'), coreA.perSeed[a].shortfallMean)])) as Record<string, Contrast>;
const detachContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries('detachMean'), coreA.perSeed[a].detachMean)])) as Record<string, Contrast>;

const fallsResolved = (c: Contrast): boolean => Number.isFinite(c.upper) && c.upper < 0;
const risesResolved = (c: Contrast): boolean => Number.isFinite(c.lower) && c.lower > 0;
const includesZero = (c: Contrast): boolean => Number.isFinite(c.lower) && Number.isFinite(c.upper)
  && c.lower <= 0 && c.upper >= 0;

const primaryPerArm = Object.fromEntries(PRIMARY_ARMS.map((a) => {
  const bodyFalls = fallsResolved(bodyContrasts[a]);
  const shortfallFalls = fallsResolved(shortfallContrasts[a]);
  const detachNotUp = !risesResolved(detachContrasts[a]);
  return [a, { bodyFalls, shortfallFalls, detachNotUp, pass: bodyFalls && shortfallFalls && detachNotUp }];
}));
const PRIMARY = PRIMARY_ARMS.every((a) => primaryPerArm[a].pass);

/** achieved precision, published (the N-rule substitution disclosure, §4) */
const achievedHalfWidth = Object.fromEntries(DOSE_ARMS.map((a) => {
  const c = bodyContrasts[a];
  return [a, round((c.upper - c.lower) / 2)];
}));

/** ---- SAG-FIRED (the F-MT-a first limb) ----------------------------------- */
const sagFired = Object.fromEntries(ARM_IDS.map((a) => {
  const s = coreA.sag[a].weakInTrigger;
  const fired = s.saggedGtBase > 0 && s.tightened === 0
    && Number.isFinite(s.meanSagOnSlackPositive) && s.meanSagOnSlackPositive >= SAG_MATERIAL_M;
  return [a, { fired, weakInTrigger: s, matchWide: coreA.sag[a].matchWide }];
}));

/** ---- F-MT-a: the sag fires but the body does not move ⇒ STOP -------------- */
const F_MT_a = PRIMARY_ARMS.every((a) => sagFired[a].fired)
  && PRIMARY_ARMS.every((a) => includesZero(bodyContrasts[a]));

/** ---- the BODY-MOVING arms: the scope F-MT-b and F-MT-c quantify over ------ */
const bodyMovingArms = DOSE_ARMS.filter((a) => fallsResolved(bodyContrasts[a]));

/** ---- the equilibrium BAND, per arm, with the substrate-drift exclusion ---- */
const bandRow = (arm: ArmId) => Object.fromEntries(BAND_KEYS.map((k) => {
  const lvl = mean(coreA.guardSeries[arm][k].filter(Number.isFinite));
  const lo = BAND_BASELINE[k] * (1 - BAND_TOLERANCE[k]);
  const hi = BAND_BASELINE[k] * (1 + BAND_TOLERANCE[k]);
  return [k, { level: round(lvl), lo: round(lo), hi: round(hi), inBand: lvl >= lo && lvl <= hi }];
})) as Record<BandKey, { level: number; lo: number; hi: number; inBand: boolean }>;
const bandControl = bandRow(CONTROL_ARM);
const bandExcluded = BAND_KEYS.filter((k) => !bandControl[k].inBand);
const bandGated = BAND_KEYS.filter((k) => bandControl[k].inBand);
const bandByArm = Object.fromEntries(ARM_IDS.map((a) => {
  const row = bandRow(a);
  const failed = bandGated.filter((k) => !row[k].inBand);
  return [a, { row, failedGatedDimensions: failed, pass: failed.length === 0 }];
}));
/** ---- F-MT-b: marking's defensive function breaks at EVERY body-moving arm - */
const F_MT_b = bodyMovingArms.length > 0 && bodyMovingArms.every((a) => !bandByArm[a].pass);

/** ---- GUARD-NI (the PM-T1 §5.4 form, tolerance INHERITED, scale THIS run) -- */
type GuardLimb = { key: string; direction: 'floor' | 'ceiling' };
const GUARD_LIMBS: readonly GuardLimb[] = [
  { key: 'spreadYOut', direction: 'floor' },
  { key: 'spacingMedian', direction: 'floor' },
  { key: 'spacingUnder4', direction: 'ceiling' },
  { key: 'dupRunShare', direction: 'ceiling' },
];
const guardNI = Object.fromEntries(DOSE_ARMS.map((a) => {
  const limbs = GUARD_LIMBS.map((l) => {
    const c = contrastOf(guardCtrl(l.key), coreA.guardSeries[a][l.key]);
    const tol = NI_FRACTION * Math.abs(c.control);
    const pass = l.direction === 'floor'
      ? Number.isFinite(c.lower) && c.lower > -tol
      : Number.isFinite(c.upper) && c.upper < tol;
    return { ...l, contrast: c, tolerance: round(tol), pass };
  });
  return [a, { limbs, pass: limbs.every((l) => l.pass) }];
})) as Record<string, { limbs: { key: string; direction: string; contrast: Contrast; tolerance: number; pass: boolean }[]; pass: boolean }>;
/** ---- F-MT-c: the clump re-imports at EVERY body-moving arm ⇒ STOP --------- */
const F_MT_c = bodyMovingArms.length > 0 && bodyMovingArms.every((a) => !guardNI[a].pass);

/** ---- the #157 instrument debt: FLAG + REPORTED counters ------------------ */
const debtKeys = ['offsides', 'fouls', 'penalties', 'thirdMan', 'overlaps', 'forwardPassShare'] as const;
const instrumentDebt = Object.fromEntries(debtKeys.map((k) => [k,
  Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(guardCtrl(k), coreA.guardSeries[a][k])])),
]));
const offsideByArm = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(guardCtrl('offsides'), coreA.guardSeries[a].offsides)]));
const OFFSIDE_FLAG = DOSE_ARMS.some((a) => risesResolved(offsideByArm[a]));

/** ---- REPORTED (no gate): the ASK instruments ------------------------------ */
const askContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(askKey), coreA.perSeed[a][askKey])])) as Record<string, Contrast>;
const askShiftContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries('askShiftYMean'), coreA.perSeed[a].askShiftYMean)])) as Record<string, Contrast>;

/** ---- REPORTED (no gate): the swallow share ------------------------------- */
const swallowShare = Object.fromEntries(ARM_IDS.map((a) => {
  const s = coreA.swallow[a];
  return [a, ASK_MATERIAL_LADDER.map((cut, i) => ({
    materialCutM: cut, materialTicks: s.material[i],
    markStanceShare: s.material[i] === 0 ? Number.NaN : round(s.mark[i] / s.material[i]),
    stationWalkShare: s.material[i] === 0 ? Number.NaN : round(s.station[i] / s.material[i]),
    otherShare: s.material[i] === 0 ? Number.NaN : round(s.other[i] / s.material[i]),
  }))];
}));

/** ---- REPORTED (no gate): mark-assignment drift, the map §2.4 channel ------ */
const markDrift = Object.fromEntries(['markShare', 'markFarSideShare', 'distToMarkMean', 'markLatGapMean']
  .map((k) => [k, Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(k), coreA.perSeed[a][k])]))]));

/* ========================================================================== */
/* §15 THE X-FAMILY GATES                                                     */
/* ========================================================================== */
/** G-CTRLEQ: the ARMED-ZERO arm (BOTH flags on, BOTH genes absent) ≡ the ABSENT control
 *  (both flags off), whole-run signature with the rng stream included, first min(8, N)
 *  seeds. ⚠ SEMANTICS, exactly (#194): THE ARMS DIFFER IN CODE PATH — armed ⇒ `pmMover`
 *  and `mtSag` are true ⇒ BOTH seam branches are ENTERED (on every defensive mover read
 *  and on every out-of-possession marker tick) and BOTH weights evaluate to 0. So this
 *  re-proves, inside THIS exam's own world, that the born-absent reads are inert THROUGH
 *  THE LIVE BRANCHES (PM-T0 G-BORN + MT-T0 G-BORN, jointly). */
const CTRLEQ_SEEDS = Math.min(8, RUN_N);
const ctrlEq = (() => {
  const rows: { seed: number; identical: boolean }[] = [];
  for (let i = 0; i < CTRLEQ_SEEDS; i++) {
    const seed = RUN_BASE + i;
    const a = matchOf(seed, CONTROL_ARM); while (!a.finished) a.step(DT);
    const b = matchOf(seed, 'ARMEDZERO'); while (!b.finished) b.step(DT);
    rows.push({ seed, identical: signature(a) === signature(b) });
  }
  return { pass: rows.every((r) => r.identical), seeds: CTRLEQ_SEEDS, rows };
})();

/** G-ARM: BOTH #196.3-D4 ARMING CHECKLISTS, asserted per arm. */
const armCheck = (() => {
  const rows = ARM_IDS.map((arm) => {
    const s = specOf(arm);
    const m = matchOf(RESERVED_BAND[1], arm); // CONSTRUCTION ONLY — never stepped
    const pmViews = m.teams.map((t) => [
      (t.info.genome as TacticalGenome).defLaneConvergence ?? null,
      (t.baseGenome as TacticalGenome).defLaneConvergence ?? null,
      (t.effGenome as TacticalGenome).defLaneConvergence ?? null,
    ]);
    const mtViews = m.teams.map((t) => [
      (t.info.genome as TacticalGenome).markSag ?? null,
      (t.baseGenome as TacticalGenome).markSag ?? null,
      (t.effGenome as TacticalGenome).markSag ?? null,
    ]);
    const kPm = m.teams.map((t) => round(pmLaneConvergenceK(t.effGenome as TacticalGenome), 8));
    const wPm = round(s.pmGene === null ? 0 : s.pmGene * PM_LANE_CONVERGENCE_MAX, 8);
    const wMt = m.teams.map((t) => round(markSagWeight(t.effGenome as TacticalGenome), 8));
    const wMtWant = round(s.mtGene === null ? 0 : s.mtGene, 8);
    return {
      arm, pmGene: s.pmGene, mtGene: s.mtGene,
      pmFlag: m.pmLaneConvergence === true, pmFlagExpected: s.pmFlag,
      mtFlag: m.mtMarkSag === true, mtFlagExpected: s.mtFlag,
      pmGeneOnAllViews: pmViews.every((v) => v.every((x) => x === s.pmGene)),
      mtGeneOnAllViews: mtViews.every((v) => v.every((x) => x === s.mtGene)),
      kPm, kPmExpected: wPm, kPmCorrect: kPm.every((k) => k === wPm),
      markSagWeight: wMt, markSagWeightExpected: wMtWant, markSagWeightCorrect: wMt.every((w) => w === wMtWant),
      bothTeamsDosed: DOSE_BOTH_TEAMS,
      pass: m.pmLaneConvergence === s.pmFlag && m.mtMarkSag === s.mtFlag
        && pmViews.every((v) => v.every((x) => x === s.pmGene))
        && mtViews.every((v) => v.every((x) => x === s.mtGene))
        && kPm.every((k) => k === wPm) && wMt.every((w) => w === wMtWant),
    };
  });
  // BOTH evolution opt-in channels are LIVE (the PM-T0 / MT-T0 `optInDraws` evidence form)
  const rngPm = new Rng(770_101); const rngMt = new Rng(770_101); const rngOff = new Rng(770_101);
  let gPm = randomGenome(new Rng(11)); let gMt = randomGenome(new Rng(11)); let gOff = randomGenome(new Rng(11));
  for (let i = 0; i < 4; i++) {
    gPm = mutateGenome(gPm, rngPm, { rate: 0.45, scale: 0.14, evolveDefLaneConvergence: true });
    gMt = mutateGenome(gMt, rngMt, { rate: 0.45, scale: 0.14, evolveMarkSag: true });
    gOff = mutateGenome(gOff, rngOff, { rate: 0.45, scale: 0.14 });
  }
  const pmOptInLive = gPm.defLaneConvergence !== undefined && gOff.defLaneConvergence === undefined;
  const mtOptInLive = gMt.markSag !== undefined && gOff.markSag === undefined;
  return {
    pass: rows.every((r) => r.pass) && pmOptInLive && mtOptInLive,
    pmOptInLive, mtOptInLive, rows,
    semantics: 'BOTH ARMING CHECKLISTS (#196.3-D4): each arm\'s two flags are exactly as frozen, '
      + 'each gene is written on all three genome views of BOTH teams (the a4World armGenes idiom — '
      + 'the REAL gene channel, #196.3-D6: this exam adds NO engine-side dose surface), the two '
      + 'expressed weights (k_PM, markSagWeight) equal their frozen values exactly, and BOTH '
      + 'evolution opt-in channels are shown LIVE (mutateGenome writes each key with its own '
      + 'opt-in and leaves it absent without). This exam is FIXED-DOSE, so the opt-ins are not '
      + 'exercised — asserted, not implied.',
  };
})();

/** G-INHERIT: ⭐ THE RULER IS INHERITED, NOT RE-IMPLEMENTED. Every quantity this exam
 *  gates or reports on is defined by a line that must still exist VERBATIM in the ruler's
 *  own probe (or, for the sag replica and its anchor, in MT-T0's probe / the engine).
 *  A silent definitional drift is therefore impossible: the gate goes RED. */
const INHERIT_PINS: readonly { file: string; line: string; what: string }[] = [
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const OWN_THIRD_LOCAL_X = -HALF_L / 3;', what: 'the #188 trigger own-third cut' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const FLANK_ABS_Y = BOX_WIDTH / 2;', what: 'the #188 trigger flank cut' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const MIN_EPISODE_TICKS = 30;', what: 'the episode floor' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const SPREAD_R = 9;', what: 'the compression yardstick' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const ASK_MATERIAL_M = 1.0;', what: 'the swallow materiality cut (no gate reads it)' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const NI_FRACTION = 1 - 0.275 / 0.380;', what: 'the S2 non-inferiority fraction' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const DUP_RUN_M = 4;', what: 'the P3′ duplicate-run radius' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const PAIR_SUBSAMPLE = 6;', what: 'the P3′ pair subsample' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,', what: 'the equilibrium band baselines (incl. goals)' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,', what: 'the equilibrium band tolerances' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          const bodyGap = Math.abs(p.pos.y - m.ball.pos.y);', what: 'THE GATED QUANTITY: bodyLatGap' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          acc.shortfall.push(Math.max(0, bodyGap - SPREAD_R));', what: 'THE GATED QUANTITY: compressionShortfall' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          acc.detach.push(n === 0 ? Number.NaN : Math.hypot(p.pos.x - cx / n, p.pos.y - cy / n));', what: 'THE GATED QUANTITY: detachment' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          const askMod = formationSpot(p, dTeam, m.ball, false, aTeam, false, true);', what: 'the REPORTED ask (modulated station read)' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          const askUnmod = formationSpot(p, dTeam, m.ball, false, aTeam, false, false);', what: 'the REPORTED ask (unmodulated station read)' },
  { file: 'scripts/probes/mt-t0-mark-sag.ts', line: '  let d = m.ball.owner === mark ? 2.6 : 2.6 - aggression * 1.4;', what: 'the MT-T0 base-stance replica, floor line' },
  { file: 'scripts/probes/mt-t0-mark-sag.ts', line: '  ) d = Math.max(d, 2.6 - aggression * 0.6);', what: 'the MT-T0 base-stance replica, stand-off line' },
  { file: 'src/ai/actionExecutor.ts', line: '        let markDist = ball.owner === mark ? 2.6 : 2.6 - g.markingAggression * 1.4;', what: '⭐ THE SAG_MATERIAL_M ANCHOR: markingAggression\'s own 1.4 m stance band' },
  { file: 'src/ai/actionExecutor.ts', line: '          if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);', what: 'the MT-T0 seam line itself' },
];
const inheritCheck = (() => {
  const cache = new Map<string, string>();
  const rows = INHERIT_PINS.map((pin) => {
    let src = cache.get(pin.file);
    if (src === undefined) {
      src = existsSync(pin.file) ? readFileSync(pin.file, 'utf8') : '';
      cache.set(pin.file, src);
    }
    return { ...pin, found: src.includes(pin.line) };
  });
  return {
    pass: rows.every((r) => r.found),
    rows,
    semantics: 'THE RULER IS INHERITED, NOT RE-IMPLEMENTED. Because probe scripts execute on '
      + 'import (top-level side effects + process.exit), the instrument code cannot be imported '
      + 'from pm-t1-compression-exam.ts; it is carried here VERBATIM and this gate pins each '
      + 'defining line in its ORIGINAL file, the MT-T0 G-CONST idiom. If the ruler moves, this '
      + 'gate goes RED rather than the two exams drifting apart silently.',
    disclosedDifferences: [
      'ARMS: 5 flag/gene arms (ABSENT · ARMEDZERO · PMTOP · MTTOP · BOTHTOP) replace PM-T1\'s '
        + '5-point PM dose ladder. Consequence: there is NO dose ladder, so PM-T1\'s P2a '
        + 'monotonicity and P2b OLS-slope-on-k tests DO NOT EXIST here and no slope is computed.',
      'THE GATED QUANTITY MOVES from the ASK (PM-T1 §5.1) to the BODY (PM-T1 §5.2), because '
        + 'H-MT claims the body moves. The ask instruments ride REPORTED.',
      'THE CONTROL is now BOTH FLAGS OFF (production-shaped). PM-T1\'s control was flag-ARMED '
        + 'with the gene absent; that world is this exam\'s ARMEDZERO arm and G-CTRLEQ proves the '
        + 'two are byte-identical THROUGH BOTH LIVE BRANCHES.',
      'THE BAND is evaluated on EVERY arm and gated over the BODY-MOVING arms (F-MT-b); PM-T1 '
        + 'gated it on the top dose only. Baselines, tolerances and the substrate-drift exclusion '
        + 'caveat are unchanged and inherited verbatim, goals INCLUDED.',
      'THE GUARD-NI SET is unchanged (spreadYOut / spacingMedian / spacingUnder4 / dupRunShare, '
        + 'fraction 0.2763) but is quantified over the BODY-MOVING arms (F-MT-c) rather than the '
        + 'ask-moving doses (F-PM-b). The tolerance SCALE is re-derived on THIS run\'s control.',
      'pairYield (an N input) is measured on the BODY, this exam\'s gated quantity, not on the ask.',
      'NEW INSTRUMENT: the SAG census (MT-T0 `stanceCensus` quantities, cadence 15 verbatim) in '
        + 'two layers — match-wide, and the WEAK-SIDE BACK on in-trigger ticks. The weak layer is '
        + 'the one F-MT-a\'s first limb reads. SAG_MATERIAL_M = 1.4 m is TRACED to '
        + 'markingAggression\'s own stance band (pinned above), not chosen.',
      'AT ABSENT / ARMEDZERO / MTTOP the ask instruments and the swallow share are DEGENERATE BY '
        + 'CONSTRUCTION (formationSpot\'s PM branch reads the gene, which is absent ⇒ shiftY ≡ 0 ⇒ '
        + 'zero material ticks ⇒ NaN shares). Not evidence about anything.',
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
process.stderr.write('  [mt-t1] X-FP-PROD: re-deriving the production fingerprint...\n');
const fpObserved = leagueHash(FINGERPRINT_SEED);
const xFpProd = fpObserved === FINGERPRINT_BASELINE;
process.stderr.write(`  [mt-t1] X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}\n`);

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const firstSeed = RUN_BASE; const lastSeed = RUN_BASE + RUN_N - 1;
const seedDisjoint = (() => {
  const clashes = CONSUMED.filter((c) => !(lastSeed < c.range[0] || firstSeed > c.range[1]));
  const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
  /** THE THREE OWN SUB-BLOCKS must be mutually disjoint AND ordered: the smoke's 6 seeds,
   *  the exit-semantics sub-block (stepped only to prove gNDerived goes RED / exit 1), and
   *  the battery's. The battery's seeds are therefore VIRGIN. */
  const smokeLast = SMOKE_BASE + SMOKE_N - 1;
  const ownBlocks = smokeLast < EXIT_CHECK_BLOCK[0]
    && EXIT_CHECK_BLOCK[1] < FULL_BASE
    && (MODE === 'smoke'
      ? (lastSeed <= smokeLast)
      : (N_ENV === null
        ? (firstSeed >= FULL_BASE && firstSeed > EXIT_CHECK_BLOCK[1])
        : (firstSeed >= EXIT_CHECK_BLOCK[0] && lastSeed <= EXIT_CHECK_BLOCK[1])));
  return {
    pass: clashes.length === 0 && inBand && ownBlocks,
    block: `${firstSeed}..${lastSeed}`, band: RESERVED_BAND, inBand,
    smokeBlock: `${SMOKE_BASE}..${smokeLast}`,
    exitSemanticsBlock: `${EXIT_CHECK_BLOCK[0]}..${EXIT_CHECK_BLOCK[1]}`,
    exitSemanticsNote: 'stepped ONLY to prove the MTT1_N override turns gNDerived RED and exits 1; '
      + 'its output is discarded and adjudicates nothing. Reserved so the battery block stays VIRGIN.',
    fullBase: FULL_BASE, ownBlocksDisjoint: ownBlocks,
    consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name),
  };
})();
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

const xGates = {
  xDet: { pass: xDet, digestA, digestB, note: 'the whole core computed TWICE, canonical-JSON digests' },
  xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved, seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS },
  xSrcZero: { pass: srcDiff === '', srcDiff, note: 'instrument-only: zero src/** changes' },
  gArm: armCheck,
  gInherit: inheritCheck,
  gCtrlEq: {
    ...ctrlEq,
    semantics: 'ARMEDZERO (BOTH flags on, BOTH genes ABSENT) ≡ ABSENT (both flags off), whole-match '
      + 'signature INCLUDING the rng stream. THE ARMS DIFFER IN CODE PATH (armed ⇒ pmMover and '
      + 'mtSag true ⇒ both seam branches are entered and both weights evaluate to 0), so the '
      + 'born-absent reads are proven inert THROUGH the live branches.',
  },
  gSeed: seedDisjoint,
  gStats: { pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, published: PUBLISHED_STATS_BASES, minGap: statsMinGap },
  gReadOnly: {
    pass: coreA.readOnly && coreA.eyeNull,
    abandonRestAndGrantsNull: coreA.readOnly, stationEyeNull: coreA.eyeNull,
    note: 'no station eye is armed in this world, so the #188 send precedence reduces to the '
      + 'station read and the eyeOverride steer bucket is empty BY CONSTRUCTION',
  },
  gNDerived: {
    pass: MODE === 'smoke' ? true : (N_ENV === null && RUN_N === nDerivation.nStar),
    ranN: RUN_N, derivedNStar: nDerivation.nStar ?? null, envOverride: N_ENV,
    note: 'in FULL mode the N run must BE the frozen §4 rule\'s output — an MTT1_N override turns '
      + 'this gate RED rather than passing quietly (the #188 nDerived precedent). MTT1_N is '
      + 'accepted in SMOKE only.',
  },
};
const xPass = Object.values(xGates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §16 ARTIFACT                                                               */
/* ========================================================================== */
const msPerMatchMeasured = passMs / Math.max(1, RUN_N * ARMS_COUNT);
const pairYieldByArm = Object.fromEntries(DOSE_ARMS.map((a) => [a, round(bodyContrasts[a].n / Math.max(1, RUN_N), 4)]));
const sizingOut = {
  msPerMatch: round(msPerMatchMeasured, 3),
  pairYieldByArm,
  pairYieldMin: Math.min(...Object.values(pairYieldByArm)),
  provenance: MODE === 'smoke'
    ? 'THE SMOKE\'S TWO SIZING NUMBERS — ms/match and the MINIMUM paired-BODY yield over the four '
      + 'non-control arms. These are the ONLY numbers a FULL run reads out of this artifact, and '
      + 'they feed ONLY N. THE SMOKE ADJUDICATES NOTHING.'
    : 'POST-HOC on this FULL run — it selected nothing (N came from the frozen rule on the SMOKE\'s '
      + 'two numbers). Reported so the smoke\'s estimate can be checked against reality.',
};
const verdict = !xPass ? 'X-FAMILY FAIL — the measurement is invalid'
  : MODE === 'smoke' ? 'SMOKE — PLUMBING ONLY; ADJUDICATES NOTHING'
    : F_MT_b ? 'STOP — F-MT-b: marking\'s defensive function breaks (the equilibrium band fails on a gated dimension at every body-moving arm)'
      : F_MT_c ? 'STOP — F-MT-c: the clump re-imports (the PM-T1 guard set fails at every body-moving arm)'
        : F_MT_a ? 'STOP — F-MT-a: the sag FIRES but the body does not move (wrong delivery geometry; returns to the user WITH the trace)'
          : PRIMARY ? 'PRIMARY PASS — the #199-null BODY contrasts RESOLVE at MTTOP and BOTHTOP with the guards quiet'
            : 'PRIMARY FAIL — the body contrasts do not resolve as pre-registered';

const body = {
  stage: 'MT T1 — THE RULER RE-RUN (the PM-T1 compression exam with the MARK-SAG seam armed)',
  doc: 'docs/world-model/MT-T1-RULER-RERUN.md',
  contract: 'docs/world-model/MARK-TIGHTNESS-CONTRACT.md',
  seams: ['docs/world-model/MT-T0-DORMANT-SEAM.md', 'docs/world-model/PM-T0-DORMANT-SEAM.md'],
  ruler: 'docs/world-model/PM-T1-COMPRESSION-EXAM.md + scripts/probes/pm-t1-compression-exam.ts',
  ruling: '#202.4 (the dispatch) · #201 (the contract) · #199 (the null under test) · #198 (the '
    + 'guard/band set incl. goals) · #196.3-D4 (the arming checklists) · #196.3-D6 (the gene '
    + 'channel) · #181.2 (committed recomputable receipts) · #197-M1/M2 · #194/#196',
  mode: MODE, verdict,
  frozenDesign: {
    arms: ARMS.map((s) => ({
      arm: s.id, pmFlag: s.pmFlag, mtFlag: s.mtFlag,
      defLaneConvergence: s.pmGene, markSag: s.mtGene,
      kPm: round(s.pmGene === null ? 0 : s.pmGene * PM_LANE_CONVERGENCE_MAX, 6),
      markSagWeight: s.mtGene === null ? 0 : s.mtGene,
      what: s.what,
    })),
    controlArm: CONTROL_ARM, primaryArms: PRIMARY_ARMS,
    kCeiling: PM_LANE_CONVERGENCE_MAX,
    sagCeilingM: MARK_SAG_MAX, sagBallSpeed: MARK_SAG_BALL_SPEED,
    ceilingHonesty: 'NEITHER seam constant is re-cut for this exam: k_PM ≤ 0.25 is PM-T0\'s traced '
      + 'legacy convergence weight and the sag family (16 m/s, 9 m cap, the sagOf shape) is MT-T0\'s '
      + 'traced freeze. If MT-T1 needs different ones, that is a fork for the commander WITH numbers.',
    doseBothTeams: DOSE_BOTH_TEAMS,
    world: { ...PERCEPT_FLAGS, stationEye: null, flagsPerArm: 'see arms above' },
    seeds: coreA.seeds, reservedBand: RESERVED_BAND,
    bootstrap: { base: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, cluster: 'seed' },
    niFraction: round(NI_FRACTION, 6),
    niFractionSource: 'A4-S2P1-VECTOR-CENSUS §4 via PM-T1 §5.4: fraction_box = 1 − 0.275/0.380 = '
      + '0.2763. INHERITED, NOT INVENTED; the S2 form scales the FRACTION by the control arm\'s own '
      + 'level in THIS run.',
    bandSource: 'A4-S2P3-GENE-BATTERY §4.2 (P3a §4.2 / C1 §4 absolute) via PM-T1 §5.5 — baselines '
      + 'and tolerances verbatim INCLUDING goals, WITH the declared substrate-drift exclusion.',
    askMaterialM: ASK_MATERIAL_M,
    askMaterialNote: '⚠ FLAGGED EXECUTOR\'S CHOICE inherited from PM-T1 §5.3 at the same value and '
      + 'with the same status: NO GATE PREDICATE READS IT.',
    sagMaterialM: SAG_MATERIAL_M,
    sagMaterialNote: '⭐ TRACED, and it IS read by a gate (F-MT-a limb 1): 1.4 m is the full span of '
      + 'markingAggression\'s own stance band at src/ai/actionExecutor.ts:294, pinned VERBATIM by '
      + 'G-INHERIT. "The sag fires materially" = the new axis moves the stance by at least as much '
      + 'as the whole of the existing tightness gene can.',
    switchKeyProhibition: 'switchKey is NOT computed anywhere in this probe: #188 §8.4 retracted it '
      + 'and MARK-SELECTION-CODE-MAP §5 trap 7 forbids reusing it. Attribution is the D2 '
      + 'STEER-OWNER read only. This exam makes NO oscillation claim.',
  },
  inheritance: {
    rulerProbe: 'scripts/probes/pm-t1-compression-exam.ts',
    pins: inheritCheck.rows,
    semantics: inheritCheck.semantics,
    disclosedDifferences: inheritCheck.disclosedDifferences,
  },
  nDerivation,
  smokeAdjudicatesNothing: MODE === 'smoke'
    ? '⚠ THIS IS A SMOKE ARTIFACT. Every number under `results` is PLUMBING EVIDENCE ONLY — it '
      + 'adjudicates nothing, tunes no threshold, and may not be cited as a finding. The gate '
      + 'booleans below are computed so the wiring is exercised, not so they can be read.'
    : false,
  predicates: {
    PRIMARY: 'at BOTH of MTTOP and BOTHTOP, vs the ABSENT control: CI_upper(bodyLatGap) < 0 AND '
      + 'CI_upper(compressionShortfall) < 0 AND the detachMean CI does NOT resolve POSITIVE',
    'SAG-FIRED': 'weak-side-back in-trigger sag census: saggedGtBase > 0 AND tightened = 0 AND '
      + `meanSagOnSlackPositive ≥ ${SAG_MATERIAL_M} m (the traced markingAggression stance band)`,
    'F-MT-a': 'SAG-FIRED at BOTH MTTOP and BOTHTOP AND the bodyLatGap CI INCLUDES ZERO at BOTH ⇒ '
      + 'STOP: the stance geometry is the wrong delivery; the fork returns to the user WITH the trace',
    'F-MT-b': '(at least one BODY-MOVING arm, CI_upper(bodyLatGap) < 0) AND (at EVERY such arm the '
      + 'equilibrium BAND fails on a GATED dimension — dimensions the CONTROL itself fails are '
      + 'DISCLOSED and EXCLUDED) ⇒ STOP: marking\'s defensive function breaks',
    'F-MT-c': '(at least one BODY-MOVING arm) AND (at EVERY such arm GUARD-NI fails) ⇒ STOP: the '
      + 'clump re-imports. GUARD-NI(a) = spreadY_out and spacingMedian CI_lower > −tol AND '
      + 'spacingUnder4 and dupRun CI_upper < +tol, tol = 0.2763 × |control level|',
    FLAG: 'offsides — resolvedly UP at any armed arm returns the axis to the USER; it NEVER flips '
      + 'PASS/FAIL (the #157 instrument debt, the F-S2d form)',
    REPORTED: 'the swallow share · mark-assignment drift (markShare / far-side share / distToMark / '
      + 'markLatGap — the map §2.4 EMERGENT feedback channel named by #202.2) · the ask instruments '
      + '· the detach/steer receipts · the sag census. NONE of these gates anything.',
  },
  results: {
    perArm: coreA.perArm,
    levels: coreA.levels,
    primary: {
      bodyLaneGap: bodyContrasts, compressionShortfall: shortfallContrasts, detachment: detachContrasts,
      perArm: primaryPerArm, pass: PRIMARY,
      achievedHalfWidthM: achievedHalfWidth,
      note: 'THE BODY IS THE GATE. The #199 nulls this must beat: D100 body −0.323646 [−1.146021, '
        + '+0.473939], shortfall −0.305054 [−0.969188, +0.416246], detach +0.389479 [−0.304823, '
        + '+1.106214] (quoted from PM-T1 §RESULT, the committed pm-t1-compression-exam.json).',
    },
    sagCensus: sagFired,
    fMtA: { fired: F_MT_a, sagFiredAtPrimaryArms: PRIMARY_ARMS.map((a) => ({ arm: a, fired: sagFired[a].fired })), bodyIncludesZero: Object.fromEntries(PRIMARY_ARMS.map((a) => [a, includesZero(bodyContrasts[a])])) },
    fMtB: { fired: F_MT_b, bodyMovingArms, bandByArm },
    fMtC: { fired: F_MT_c, bodyMovingArms, guardNI },
    band: {
      control: bandControl, byArm: bandByArm,
      gatedDimensions: bandGated, excludedAsSubstrateDrift: bandExcluded,
      note: 'the A4-S2P3 §4.2 substrate-drift caveat, verbatim: a dimension the CONTROL arm itself '
        + 'fails is DISCLOSED and EXCLUDED from the gate.',
    },
    instrumentDebt157: { offsideFlagFired: OFFSIDE_FLAG, offsideByArm, contrasts: instrumentDebt },
    reportedAsk: {
      note: 'REPORTED, NEVER GATED. At PMTOP and BOTHTOP this is the INTERNAL REPLICATION of #199\'s '
        + 'PRIMARY (its D100 ask fell −4.705904 [−4.954743, −4.445391]). At ABSENT, ARMEDZERO and '
        + 'MTTOP the ask is UNMODULATED BY CONSTRUCTION — formationSpot\'s PM branch reads '
        + 'pmLaneConvergenceK(gene), and the gene is absent — so askShiftY ≡ 0 there and the ask '
        + 'contrast measures only what the BODIES did to the station field, not a dose.',
      contrasts: askContrasts, askShiftY: askShiftContrasts,
    },
    reportedSwallow: {
      note: 'REPORTED, NEVER GATED (the contract §3: the body may compress WHILE markStance stays '
        + 'the steer owner — the gate is the BODY, not the label). #199 measured markStance owning '
        + '79.97–84.57 % of material-ask ticks. DEGENERATE (NaN) at arms with no PM gene.',
      share: swallowShare,
    },
    reportedMarkDrift: {
      note: 'REPORTED, NEVER GATED — the MARK-SELECTION-CODE-MAP §2.4 positional-feedback channel, '
        + 'named again by #202.2: a sagged body moves the distances assignMarks\' own 22 m / 9 m '
        + 'gates read, so assignment CAN churn DOWNSTREAM of the body. Visible and attributed, not '
        + 'designed away, and NOT a predicate.',
      contrasts: markDrift,
    },
    receipts: coreA.receipts,
  },
  gates: { ...xGates, xFamilyPass: xPass },
  honesty: [
    'FROZEN BEFORE SIGHT: the arms, seeds, N rule, gates, predicates and tolerances were written in '
      + 'the stage doc before any full-N number existed, and are not re-cut afterwards.',
    'THE SMOKE ADJUDICATES NOTHING and may not tune any threshold: it proves plumbing and publishes '
      + 'exactly two sizing numbers (ms/match, min paired-BODY yield) which feed ONLY N.',
    'NO RE-CUT AFTER SIGHT: k_PM ≤ 0.25 is PM-T0\'s traced constant; 16 m/s, the 9 m cap and the '
      + 'sagOf shape are MT-T0\'s; the NI fraction is A4-S2P1 §4\'s; the band is A4-S2P3 §4.2\'s. '
      + 'FAILs are reported AS-IS — a fired F-MT-a/b/c is a RESULT, not a defect to engineer around.',
    'THE ARMS DIFFER IN EXACTLY WHAT THE TABLE SAYS: two MatchConfig flags and two gene values. '
      + 'Nothing else moves; src/** is untouched (X-SRC-ZERO) and the doses travel the real gene '
      + 'channel on all three genome views of both teams (#196.3-D6).',
    'The arms diverge tick-for-tick, so PAIRING IS ON THE SEED, not on the episode: each seed '
      + 'contributes one paired delta per arm, and the bootstrap clusters on the seed.',
    'MT-T1 ships nothing (Road B): both flags stay absent from every bundle and play-test world, '
      + 'both genes stay born-absent, and the production fingerprint is re-derived unchanged.',
    'THIS EXAM MAKES NO OSCILLATION CLAIM (switchKey is retracted, #188 §8.4) and decides nothing '
      + 'about whether the compression is GOOD FOOTBALL — SPREAD_R = 9 m is a RULER, not a target.',
  ],
};
/** ⭐ #181.2 + #197-M1: `resultSha256` hashes ONLY the timing-free AND commit-free MEASURED
 *  body, so a third party re-running this probe at ANY commit re-derives it. `head` and the
 *  wall-clock fields ride the envelope, outside the hash. The one git-derived field still
 *  INSIDE is `gates.xSrcZero` (`git diff --stat -- src`) — a GATE OUTPUT (empty on any clean
 *  tree at any commit), not a commit identifier. In full mode
 *  `nDerivation.smokeArtifactSha256` also stays inside: it is N's provenance. */
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
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
    note: 'CONTEXT ONLY, and OUTSIDE resultSha256 — used in no gate. `sizing.msPerMatch` is the one '
      + 'timing number with a job: the wall term of the frozen N rule reads it.',
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §17 STDOUT                                                                 */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const fmt = (c: Contrast): string => `${c.point >= 0 ? '+' : ''}${c.point} [${c.lower}, ${c.upper}] n=${c.n}${c.resolved ? ' ✔' : ''}`;
o('');
o(`=== MT-T1 RULER RE-RUN (${MODE}) — HEAD ${head} — ${RUN_N} seeds × ${ARMS_COUNT} arms, block ${firstSeed}..${lastSeed} ===`);
o(`arms ${ARMS.map((s) => `${s.id}[pm ${s.pmFlag ? 'on' : 'off'}/${s.pmGene ?? 'absent'} · mt ${s.mtFlag ? 'on' : 'off'}/${s.mtGene ?? 'absent'}]`).join('  ')}`);
o(`episodes/arm ${ARM_IDS.map((a) => `${a}:${coreA.perArm[a].episodes}`).join('  ')}`);
o('');
o('PRIMARY — THE BODY (paired per-seed vs ABSENT; the #199 nulls are what this must beat):');
for (const a of DOSE_ARMS) {
  o(`  ${a.padEnd(9)} body ${fmt(bodyContrasts[a])} · shortfall ${fmt(shortfallContrasts[a])} · detach ${fmt(detachContrasts[a])}`);
}
for (const a of PRIMARY_ARMS) {
  const p = primaryPerArm[a];
  o(`  ${a.padEnd(9)} bodyFalls ${p.bodyFalls} · shortfallFalls ${p.shortfallFalls} · detachNotUp ${p.detachNotUp} ⇒ ${p.pass ? 'PASS' : 'FAIL'}`);
}
o(`  ⇒ PRIMARY ${PRIMARY ? 'PASS' : 'FAIL'}   (achieved body half-widths: ${DOSE_ARMS.map((a) => `${a} ±${achievedHalfWidth[a]}`).join(' · ')})`);
o('');
o('SAG CENSUS (weak-side back, in-trigger ticks — the F-MT-a decidability limb):');
for (const a of ARM_IDS) {
  const s = sagFired[a].weakInTrigger;
  o(`  ${a.padEnd(9)} ticks ${s.samples} · slack+ ${s.slackPositive} · sagged>base ${s.saggedGtBase} · tightened ${s.tightened}`
    + ` · meanSag(slack+) ${s.meanSagOnSlackPositive} m · max ${s.maxSag} m · stance ${s.meanBaseMarkDist} → ${s.meanSaggedMarkDist} m`
    + ` ⇒ SAG-FIRED ${sagFired[a].fired}`);
}
for (const a of ARM_IDS) {
  const s = sagFired[a].matchWide;
  o(`  ${a.padEnd(9)} [match-wide] ticks ${s.samples} · slack+ ${s.slackPositive} · sagged>base ${s.saggedGtBase}`
    + ` · tightened ${s.tightened} · meanSag(slack+) ${s.meanSagOnSlackPositive} m · max ${s.maxSag} m`);
}
o('');
o(`F-MT-a ${F_MT_a ? '*** FIRED ***' : 'not fired'} (sag fires at MTTOP+BOTHTOP ∧ body CI includes zero at both)`);
o(`F-MT-b ${F_MT_b ? '*** FIRED ***' : 'not fired'} (body-moving arms: ${bodyMovingArms.join(',') || 'none'})`);
o(`BAND — gated ${bandGated.join(',') || 'none'} · excluded as substrate drift ${bandExcluded.join(',') || 'none'}`);
for (const a of ARM_IDS) {
  o(`  BAND ${a.padEnd(9)} ${bandByArm[a].pass ? 'PASS' : 'FAIL'}: `
    + BAND_KEYS.map((k) => `${k} ${bandByArm[a].row[k].level} [${bandByArm[a].row[k].lo}, ${bandByArm[a].row[k].hi}] ${bandByArm[a].row[k].inBand ? 'ok' : 'OUT'}`).join(' · '));
}
o('');
o(`F-MT-c ${F_MT_c ? '*** FIRED ***' : 'not fired'} (body-moving arms: ${bodyMovingArms.join(',') || 'none'})`);
for (const a of DOSE_ARMS) {
  o(`  GUARD-NI ${a.padEnd(9)} ${guardNI[a].pass ? 'PASS' : 'FAIL'}: `
    + guardNI[a].limbs.map((l) => `${l.key} ${l.pass ? 'ok' : 'BLOWN'} (${fmt(l.contrast)} vs ±${l.tolerance})`).join(' · '));
}
o('');
o('REPORTED — THE ASK (no gate; PMTOP/BOTHTOP replicate #199, the rest are unmodulated by construction):');
for (const a of DOSE_ARMS) o(`  ${a.padEnd(9)} ask ${fmt(askContrasts[a])} · askShiftY ${fmt(askShiftContrasts[a])}`);
o('REPORTED — THE SWALLOW SHARE (no gate; NaN where the PM gene is absent):');
for (const a of ARM_IDS) {
  const row = (swallowShare as Record<string, { materialCutM: number; materialTicks: number; markStanceShare: number; stationWalkShare: number }[]>)[a][1];
  o(`  ${a.padEnd(9)} @${row.materialCutM} m: material ticks ${row.materialTicks} · markStance ${row.markStanceShare} · stationWalk ${row.stationWalkShare}`);
}
o('REPORTED — MARK-ASSIGNMENT DRIFT (no gate; the #202.2 emergent feedback channel):');
for (const a of DOSE_ARMS) {
  o(`  ${a.padEnd(9)} markShare ${fmt((markDrift.markShare as Record<string, Contrast>)[a])}`
    + ` · farSide ${fmt((markDrift.markFarSideShare as Record<string, Contrast>)[a])}`
    + ` · distToMark ${fmt((markDrift.distToMarkMean as Record<string, Contrast>)[a])}`);
}
o(`OFFSIDE FLAG ${OFFSIDE_FLAG ? '*** FIRED (returns to the USER; never flips PASS/FAIL) ***' : 'quiet'} — `
  + DOSE_ARMS.map((a) => `${a} ${fmt(offsideByArm[a])}`).join(' · '));
o('');
o(`X-FAMILY ${xPass ? 'GREEN' : '*** RED ***'}: `
  + Object.entries(xGates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${(Date.now() - wall0) / 1000}s · ${round(msPerMatchMeasured, 1)} ms/match`
  + ` · pairYieldMin ${sizingOut.pairYieldMin} · artifact ${OUT_PATH}`);
o(`VERDICT: ${verdict}`);
if (MODE === 'smoke') o('⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.');

if (!xPass) process.exit(1);
if (MODE === 'full' && (!PRIMARY || F_MT_a || F_MT_b || F_MT_c)) process.exit(2);
process.exit(0);
