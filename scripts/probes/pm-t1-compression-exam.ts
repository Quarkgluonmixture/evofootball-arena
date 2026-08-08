/**
 * PM T1 — THE COMPRESSION EXAM (forced doses on the certified PM-T0 seam).
 *
 * Doc:      docs/world-model/PM-T1-COMPRESSION-EXAM.md  (EVERY dose, seed, gate,
 *           threshold and predicate below is frozen THERE, ex ante, before any
 *           full-N number existed. Nothing here is invented at read time.)
 * Contract: docs/world-model/PHASE-MODULATION-CONTRACT.md §1 H-PM · §2 M-PM.1-5 ·
 *           §3 the PM-T1 clause + the pre-named FAILs · §4 non-claims.
 * Seam:     docs/world-model/PM-T0-DORMANT-SEAM.md (§LAW k_PM ≤ 0.25, §SEAM, §GATES)
 * Rulings:  #196.5 (this dispatch; PM-T1 FIRST) · #196.3-D4 (⚠ THE ARMING CHECKLIST
 *           IS BINDING: flag + evolve opt-in + non-absent gene, ALL THREE) ·
 *           #196.3-D6 (no engine-side dose surface — doses travel the REAL gene
 *           channel via genome views) · #181.2 (receipts = committed recomputable
 *           artifacts; every hash computed HERE) · #194/#196 (gate semantics stated
 *           exactly — say what the arms DIFFER in; no doc-typed hashes).
 *
 * INSTRUMENT-ONLY: zero src/** changes (X-SRC-ZERO is a HARD gate).
 *
 * THE QUESTION. PM-T0 certified a dormant per-body lateral convergence toward the
 * ball's lane. #188 measured that the defensive send target for the weak-side back
 * sits 18-20 m off the ball's lane in every world. This exam forces the gene and
 * asks, in order:
 *   PRIMARY — does the ASK move? (send-target lane gap, resolvedly + dose-responsively)
 *   ANSWER  — measured SEPARATELY: does the BODY move? (body lane gap, detachment)
 *   F-PM-a  — the ask moves and the body does not ⇒ STOP (the 乙 fork, with the
 *             swallowed share quantified from the D2 STEER attribution — never from
 *             switchKey, which the #188 §8.4 retraction disqualified)
 *   F-PM-b  — the B1-a clump re-imports ⇒ STOP (wrong dimension, not wrong dose)
 *
 * MODES:  PMT1_MODE=smoke (default) — plumbing only, adjudicates NOTHING
 *         PMT1_MODE=full            — the pre-registered battery
 *         PMT1_N=<n>                — accepted in SMOKE ONLY (turns G-NDERIVED RED
 *                                     in full mode, the #188 nDerived precedent)
 *
 * EXIT SEMANTICS (the commander's monitor reads these):
 *   0 — X-family green, PRIMARY passes, no pre-named fork fired
 *   1 — an X-family HARD gate failed  ⇒ the MEASUREMENT is invalid
 *   2 — the exam ran clean and a STOP fired (PRIMARY fail / F-PM-a / F-PM-b /
 *       equilibrium band) ⇒ the RESULT is a fork, by contract the user's
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { formationSpot, runTarget } from '../../src/ai/formations';
import {
  PM_LANE_CONVERGENCE_MAX, mutateGenome, pmLaneConvergenceK, randomGenome,
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
const MODE = (process.env.PMT1_MODE ?? 'smoke') as 'smoke' | 'full';
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('PM-T1 FATAL — PMT1_MODE must be `smoke` or `full`.');
  process.exit(2);
}
const N_ENV = process.env.PMT1_N === undefined ? null : Math.max(1, Number.parseInt(process.env.PMT1_N, 10));
const OUT_PATH = process.env.PMT1_OUT ?? (MODE === 'smoke'
  ? 'docs/world-model/data/pm-t1-compression-exam-smoke.json'
  : 'docs/world-model/data/pm-t1-compression-exam.json');
const SMOKE_PATH = 'docs/world-model/data/pm-t1-compression-exam-smoke.json';

/* ========================================================================== */
/* §1 THE FROZEN DESIGN (stage doc §2-§4)                                     */
/* ========================================================================== */
/** §2 THE DOSE VECTOR. `null` = the gene ABSENT (the control: flag ARMED, gene
 *  absent ⇒ k_PM = 0 ⇒ byte-identical to flag-off, PM-T0's G-BORN). The four live
 *  doses span the gene's whole domain [0,1] in equal steps up to 1 ⇒ k_PM = the
 *  frozen ceiling 0.25. NO dose exceeds the ceiling; the ceiling is not re-cut. */
const DOSES: readonly (number | null)[] = [null, 0.25, 0.5, 0.75, 1];
const ARM_IDS = ['D000', 'D025', 'D050', 'D075', 'D100'] as const;
type ArmId = (typeof ARM_IDS)[number];
const CONTROL_ARM: ArmId = 'D000';
const TOP_ARM: ArmId = 'D100';
const doseOf = (a: ArmId): number | null => DOSES[ARM_IDS.indexOf(a)];
/** §2: BOTH teams are dosed symmetrically — the equilibrium frame (stage doc §2.2). */
const DOSE_BOTH_TEAMS = true;

/** §2.3 the world: the percept-armed substrate PM-T0's own receipts ran in. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;

/* --- §3 the seed ledger ----------------------------------------------------- */
const RESERVED_BAND: readonly [number, number] = [12_311_200, 12_311_999];
const SMOKE_BASE = 12_311_200;
const SMOKE_N = 6;
const FULL_BASE = 12_311_300;
/** Honest hard cap: the reserved band's own ceiling for the census block
 *  (12,311,300..12,311,999 = 700 seeds). A SEED-BUDGET cap, not a statistical claim. */
const N_CAP = 700;
const N_STEP = 25;
/** Every block the A4/O/PM arc has consumed (PM-T0's ledger + PM-T0's own block). */
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
];
/** §3: the stats stream — a THIRD namespace. 103,200 was #188's base ⇒ +200 floor. */
const BOOTSTRAP_SEED = 103_400;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [101_403, 102_000, 102_200, 102_400, 102_600, 102_800, 103_000, 103_200];

/* --- §4 THE N ARITHMETIC, frozen ex ante ------------------------------------ */
const Z_975 = 1.96;
/** ⭐ THE VARIANCE SOURCE IS SMOKE-FREE: #188's PUBLISHED prod-world CI for the very
 *  quantity this exam gates on (weak-side back `sendLatGapMean`, per-seed cluster
 *  bootstrap over 700 seed clusters) — FARSIDE-DEFENDER-FORENSIC §8.3, the WIDEST
 *  of its four published worlds (the conservative choice). σ is recovered here. */
const PUB188_ASK = { p50: 19.86, lo: 19.65, hi: 20.04, clusters: 700 } as const;
/** Conservative: treats the two arms as INDEPENDENT, which OVER-states the variance
 *  of a paired same-seed delta. Stated as conservatism, not as a measurement. */
const PAIRED_INFLATION = Math.SQRT2;
/** The resolution this exam needs: the ceiling's own analytic movement on a 19 m gap
 *  is ≈ −4.75 m and the LOWEST dose's is ≈ −1.19 m, so a half-width of 0.5 m resolves
 *  every dose in the vector with margin. Frozen before any number existed. */
const TARGET_HALFWIDTH_M = 0.5;
const WALL_BUDGET_HOURS = 2.0;
const XDET_FACTOR = 2;
const ARMS_COUNT = ARM_IDS.length;
/** #188's own published per-match cost (§8.0: 102.21 ms/match at the census) — the
 *  PRIOR the wall term uses when no committed smoke artifact exists yet. */
const PUB188_MS_PER_MATCH = 102.21;

/* --- §5 THE GUARDS: tolerances INHERITED, never invented -------------------- */
/** ⭐ THE S2 NON-INFERIORITY FRACTION, INHERITED VERBATIM from
 *  A4-S2P1-VECTOR-CENSUS §4: `fraction_box = 1 − 0.275/0.380 = 0.2763` (the #154
 *  certified box price and the CI bound nearest zero). The S2 form scales that
 *  FRACTION by the control arm's own level in THIS run — no cross-unit transplant
 *  of a slice-1 magnitude, exactly as §4 of that doc requires. */
const NI_FRACTION = 1 - 0.275 / 0.380;
/** §2 EQUILIBRIUM BAND — inherited VERBATIM from A4-S2P3-GENE-BATTERY §4.2
 *  (itself P3a §4.2 / C1 §4 absolute), together with its declared SUBSTRATE-DRIFT
 *  caveat: a dimension the CONTROL arm itself fails is DISCLOSED and EXCLUDED. */
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;
type BandKey = keyof typeof BAND_BASELINE;
const BAND_KEYS = Object.keys(BAND_BASELINE) as BandKey[];

/* --- §6 the #188 instrument constants, inherited VERBATIM ------------------- */
/** §1 T6: `localXBand`'s own ownThird cut. */
const OWN_THIRD_LOCAL_X = -HALF_L / 3;
/** §1 T7: the flank cut = outside the penalty-box WIDTH. */
const FLANK_ABS_Y = BOX_WIDTH / 2;
/** §1: shorter than 0.5 s is frame flicker, not a picture. */
const MIN_EPISODE_TICKS = 30;
/** §3.3: `emergentStation`'s own anti-clump repel radius = the body-spacing scale. */
const SPREAD_R = 9;
/** ⚠ FLAGGED EXECUTOR'S CHOICE, in the same class as #188's SPEED_MIN / CORNER_MATERIAL:
 *  no substrate anchor exists for "the modulated ask differs MATERIALLY". Declared ex
 *  ante at 1.0 m and reported at 0.5 / 1.0 / 2.0 m so no verdict can hinge on the cut —
 *  and NO GATE PREDICATE READS IT (it only quantifies the F-PM-a swallow share). */
const ASK_MATERIAL_M = 1.0;
const ASK_MATERIAL_LADDER = [0.5, 1.0, 2.0] as const;

/* --- the P3′ whole-match guard constants, inherited VERBATIM from the battery -- */
const SAMPLE_EVERY = 10;      // 6 Hz
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;       // the spacing FLOOR read
const DUP_RUN_M = 4;

/* --- the X-family pins ------------------------------------------------------ */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* ========================================================================== */
/* §7 HELPERS                                                                 */
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
/* §8 THE ARMS — the #196.3-D4 ARMING CHECKLIST + the D6 gene channel          */
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

/**
 * ⚠ THE ARMING CHECKLIST (#196.3-D4, BINDING): armed = the `pmLaneConvergence`
 * MatchConfig flag + the `evolveDefLaneConvergence` opt-in + a NON-ABSENT gene.
 *   • the FLAG is set here, explicitly, per arm;
 *   • the GENE is written on ALL THREE genome views (`info.genome` / `baseGenome` /
 *     `effGenome`) — the `a4World` `armGenes` idiom, i.e. the REAL gene channel
 *     (#196.3-D6: NO engine-side dose surface is added by this exam);
 *   • the EVOLUTION OPT-IN is the channel the gene would travel under selection.
 *     This exam is FIXED-DOSE (no evolution runs), so the opt-in is not exercised —
 *     G-ARM asserts the channel is LIVE (`mutateGenome` writes the key with the
 *     opt-in and leaves it absent without), which is exactly PM-T0's `optInDraws`
 *     evidence form. Stated, not implied.
 * The CONTROL arm is FLAG-ARMED with the gene ABSENT — PM-T0's G-BORN world: the
 * M-PM.1 branch is ENTERED on every defensive mover read and k_PM evaluates to 0.
 * ⇒ THE ARMS DIFFER IN EXACTLY ONE THING: the value of `defLaneConvergence`.
 */
const matchOf = (seed: number, arm: ArmId | 'FLAG_OFF'): Match => {
  const base = {
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...PERCEPT_FLAGS,
  };
  if (arm === 'FLAG_OFF') return new Match(base as ConstructorParameters<typeof Match>[0]);
  const m = new Match({ ...base, pmLaneConvergence: true } as ConstructorParameters<typeof Match>[0]);
  const dose = doseOf(arm);
  if (dose !== null) {
    const sides: Side[] = DOSE_BOTH_TEAMS ? [0, 1] : [0];
    for (const s of sides) {
      const t = m.teams[s];
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.defLaneConvergence = dose;
      }
    }
  }
  return m;
};

/** The whole-match signature INCLUDING the rng stream state (PM-T0's form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/* ========================================================================== */
/* §9 THE INSTRUMENT — one tick-walk, three families of read                  */
/* ========================================================================== */
/** D2 (the #188 declared addition): which mechanism OWNS the movement target this
 *  tick, in `executeAction`'s own precedence. This world arms NO station eye, so the
 *  `eyeOverride` bucket is empty BY CONSTRUCTION (asserted: `stationEye === null`).
 *  ⚠ `switchKey` is NOT used anywhere in this probe — #188 §8.4 retracted it for
 *  cause attribution and MARK-SELECTION-CODE-MAP §5 trap 7 forbids its reuse. */
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

interface BodyAcc {
  ticks: number;
  detach: number[]; distToSend: number[];
  bodyLatGap: number[]; shortfall: number[];
  askLatGap: number[]; askLatGapUnmod: number[]; askShiftY: number[];
  markTicks: number; markFarSideTicks: number; distToMark: number[]; markLatGap: number[];
  steer: Map<SteerOwner, number>;
  /** the F-PM-a swallow instrument: material-ask ticks bucketed by STEER owner. */
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
  /** the swallow instrument, pooled over the match's in-trigger weak-side ticks. */
  swallow: { material: number[]; mark: number[]; station: number[]; other: number[] };
  readOnly: boolean; eyeNull: boolean;
}

function walkMatch(arm: ArmId, seed: number): MatchWalk {
  const m = matchOf(seed, arm);
  const readOnly = m.abandonRestDesignation === null && m.homeRegionGrant === null && m.homeMapGrant === null;
  const eyeNull = m.stationEye === null;
  const episodes: Episode[] = [];
  let triggerTicks = 0; let playedTicks = 0; let excludedShort = 0; let excludedSentOff = 0;

  // --- episode state ---
  let openKey: string | null = null;
  let startTick = 0; let ticks = 0; let sentOffSeen = false;
  let defSide: Side = 0; let flankSign: 1 | -1 = 1; let weakIdx: 3 | 4 = 3; let ballIdx: 3 | 4 = 4;
  let weakAcc = newBodyAcc(); let ballAcc = newBodyAcc();
  const swallow = {
    material: ASK_MATERIAL_LADDER.map(() => 0), mark: ASK_MATERIAL_LADDER.map(() => 0),
    station: ASK_MATERIAL_LADDER.map(() => 0), other: ASK_MATERIAL_LADDER.map(() => 0),
  };

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

          // §3.2 THE SEND. No station eye is armed in this world (asserted), so the
          // #188 precedence reduces to its second limb: the station field. The LIVE
          // send is the MOVER read (`pmMover = true`, exactly what actionExecutor.ts
          // :145/:336 pass under the armed flag in `playing`); the UNMODULATED read is
          // the same call with the fork off — the within-arm counterfactual.
          const askMod = formationSpot(p, dTeam, m.ball, false, aTeam, false, true);
          const askUnmod = formationSpot(p, dTeam, m.ball, false, aTeam, false, false);
          acc.distToSend.push(Math.hypot(p.pos.x - askMod.x, p.pos.y - askMod.y));
          acc.askLatGap.push(Math.abs(askMod.y - m.ball.pos.y));
          acc.askLatGapUnmod.push(Math.abs(askUnmod.y - m.ball.pos.y));
          const shiftY = Math.abs(askMod.y - askUnmod.y);
          acc.askShiftY.push(shiftY);

          // §3.3 the ANSWER (the BODY, measured separately from the ask)
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

          // ⭐ THE F-PM-a SWALLOW INSTRUMENT (weak-side back only): of the ticks where
          // the modulated ask differs MATERIALLY from the unmodulated one, what share
          // is the body executing a MARK STANCE instead of the station walk?
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

    /* ---------------- the whole-match GUARDS (B1-a + P3′ forms) ---------- */
    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const side = t.side as 0 | 1;
      const opp = m.teams[1 - side];
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outfield.length === 0) continue;
      const hasBall = m.possessionSide === side;
      // spreadY = stdev of outfielders' world y (the B1-a metric; live implementation
      // scripts/probes/stage3-p0-instruments.ts §I7 `acc.sy += sd(ys)`), split by
      // POSSESSION — the OUT-OF-POSSESSION face is the phase this seam modulates.
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
    guards, swallow, readOnly, eyeNull,
  };
}

/* ========================================================================== */
/* §10 THE PAIRED PER-SEED CONTRAST ENGINE                                    */
/* ========================================================================== */
/** The statistic: the MEAN over seeds of the per-seed PAIRED delta (dose − control).
 *  Cluster = seed (the arms diverge tick-for-tick, so pairing is on the SEED, not on
 *  the episode — disclosed). CI = 2.5/97.5 percentiles of B = 2000 resamples of the
 *  seed set with replacement, drawn from the frozen stats stream. */
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
/** THE DOSE-RESPONSE TEST, frozen: the per-seed OLS slope of a quantity on k_PM,
 *  fitted over the arms in which THAT seed yielded at least one qualifying episode.
 *  ⚠ ADMISSION RULE (frozen ex ante, forced by the plumbing smoke and NOT by any
 *  level it measured): a seed is admitted iff it has ≥ SLOPE_MIN_ARMS = 3 finite arm
 *  values spanning ≥ 2 distinct k values. Requiring all five arms would discard the
 *  large majority of seeds — the trigger is rare (#188: ≈1.2-1.5 episodes/match) and
 *  the arms diverge, so arm coverage is per-seed ragged by construction. The admitted
 *  count is published; the mean slope carries the same seed-cluster bootstrap. */
const SLOPE_MIN_ARMS = 3;
const slopeOf = (perArm: Record<ArmId, readonly number[]>, ks: readonly number[]): Contrast => {
  const nSeeds = perArm[CONTROL_ARM].length;
  const slopes: number[] = [];
  for (let i = 0; i < nSeeds; i++) {
    const xs: number[] = []; const ys: number[] = [];
    ARM_IDS.forEach((a, j) => {
      const v = perArm[a][i];
      if (Number.isFinite(v)) { xs.push(ks[j]); ys.push(v); }
    });
    if (xs.length < SLOPE_MIN_ARMS || new Set(xs).size < 2) continue;
    const kBar = mean(xs); const yBar = mean(ys);
    const sxx = xs.reduce((s, k) => s + (k - kBar) ** 2, 0);
    if (sxx === 0) continue;
    let sxy = 0;
    for (let j = 0; j < xs.length; j++) sxy += (xs[j] - kBar) * (ys[j] - yBar);
    slopes.push(sxy / sxx);
  }
  const n = slopes.length;
  if (n === 0) return { ...EMPTY_CONTRAST };
  const rng = new Rng(BOOTSTRAP_SEED + (bootOffset += 1));
  const draws: number[] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    let s = 0;
    for (let k = 0; k < n; k++) s += slopes[Math.min(n - 1, Math.floor(rng.next() * n))];
    draws.push(s / n);
  }
  draws.sort((p, q) => p - q);
  const lower = pctlSorted(draws, 0.025); const upper = pctlSorted(draws, 0.975);
  return {
    n, control: Number.NaN, treated: Number.NaN, point: round(mean(slopes)),
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
      + 'floor( 2.0 h / (ms_per_match × 5 arms × 2 X-DET) ), 700 ) — frozen in stage doc §4',
    varianceSource: 'FARSIDE-DEFENDER-FORENSIC §8.3, prod world (the WIDEST of the four '
      + 'published worlds): weak-side back sendLatGapMean p50 19.86 [19.65, 20.04] over 700 '
      + 'per-seed clusters. σ_perSeed = (halfWidth / 1.96) · √700. NO SMOKE NUMBER FEEDS THIS TERM.',
    pub188: PUB188_ASK,
    pairsNeeded,
    pairYield: round(pairYield, 4), pairYieldSource: yieldSource,
    pairYieldNote: 'the trigger is rare and the arms diverge, so not every seed yields a PAIRED '
      + '(control, dose) ask value. The precision term is stated in CONTRIBUTING PAIRS and '
      + 'converted to matches by the smoke-measured yield — the smoke informs ONLY N (#188 §4.3).',
    halfWidth188: round(halfWidth188), sigmaPerSeed: round(sigmaPerSeed),
    pairedInflation: round(PAIRED_INFLATION),
    pairedInflationNote: 'σ_delta = √2 · σ_perSeed — CONSERVATIVE: it treats the two arms as '
      + 'INDEPENDENT, which over-states the variance of a paired same-seed delta.',
    targetHalfWidthM: TARGET_HALFWIDTH_M,
    msPerMatch: round(msPerMatch, 3), msPerMatchSource: msSource,
    nRaw, nStepped, nStep: N_STEP, nWall, nCap: N_CAP,
    capHonesty: 'N_CAP = 700 is the reserved band 12,311,300..12,311,999 — a SEED-BUDGET cap, '
      + 'not a statistical statement. If it binds, the achieved half-width is wider than the '
      + 'target and that shortfall is disclosed, never re-cut (the #188 §8.0 precedent).',
    terms, nStar, bindingTerm,
    projectedWallHours: round((nStar * ARMS_COUNT * XDET_FACTOR * msPerMatch) / 3_600_000, 3),
  };
};

const nDerivation = ((): Record<string, unknown> & { n: number } => {
  if (MODE === 'smoke') {
    return {
      mode: 'smoke',
      note: 'SMOKE. N is fixed by stage doc §3 at 6 seeds (12,311,200..12,311,205). The §4 '
        + 'arithmetic does not select it: THE SMOKE ADJUDICATES NOTHING and may not tune any '
        + 'threshold; it exists to prove plumbing and to measure ms/match for the wall term.',
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
        + 'precedent): exactly two numbers are read out of it, ms/match and the MINIMUM paired-ask '
        + 'yield over the four doses. No level, share, rate, CI or threshold from it is read anywhere.';
    }
  }
  const derived = frozenNStar(msPerMatch, msSource, pairYield, yieldSource);
  return {
    mode: 'full', smokeArtifact: SMOKE_PATH, smokeArtifactSha256: smokeSha,
    ...derived, envOverride: N_ENV, n: N_ENV ?? derived.nStar,
  };
})();

const RUN_BASE = MODE === 'smoke' ? SMOKE_BASE : FULL_BASE;
const RUN_N = nDerivation.n;

/* ========================================================================== */
/* §12 THE STARTUP BANNER — the derived N + the frozen predicates enforced    */
/* ========================================================================== */
const kOf = (a: ArmId): number => {
  const d = doseOf(a);
  return d === null ? 0 : d * PM_LANE_CONVERGENCE_MAX;
};
const K_VALUES = ARM_IDS.map(kOf);
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
banner('');
banner('=============================================================================');
banner(`PM-T1 — THE COMPRESSION EXAM · mode ${MODE} · N ${RUN_N} seeds × ${ARMS_COUNT} arms`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1}   (reserved band ${RESERVED_BAND[0]}..${RESERVED_BAND[1]})`);
banner(`doses (gene)  ${ARM_IDS.map((a) => `${a}=${doseOf(a) === null ? 'ABSENT' : doseOf(a)}`).join('  ')}`);
banner(`k_PM          ${K_VALUES.map((k) => k.toFixed(4)).join('  ')}   (ceiling ${PM_LANE_CONVERGENCE_MAX}, not re-cut)`);
banner(`N derivation  ${String(nDerivation.arithmetic ?? nDerivation.note)}`);
if (MODE === 'full') {
  banner(`              pairsNeeded ${nDerivation.pairsNeeded} / pairYield ${nDerivation.pairYield}`
    + ` = ${nDerivation.nRaw} → step ${nDerivation.nStepped} · wall ${nDerivation.nWall} · cap ${N_CAP}`
    + ` ⇒ N* ${nDerivation.nStar} (${String(nDerivation.bindingTerm)} binds; projected wall ${String(nDerivation.projectedWallHours)} h)`);
} else {
  banner('              ⚠ SMOKE — PLUMBING ONLY. It adjudicates NOTHING and tunes NO threshold;');
  banner('                it publishes exactly two sizing numbers (ms/match, min paired-ask yield).');
}
banner('FROZEN PREDICATES ENFORCED THIS RUN:');
banner('  PRIMARY := P1 ∧ P2a ∧ P2b');
banner('    P1  CI_upper( ask(D100 − D000) ) < 0                       [ask falls RESOLVEDLY at the top dose]');
banner('    P2a askDelta(D025) ≥ askDelta(D050) ≥ askDelta(D075) ≥ askDelta(D100)   [weakly monotone points]');
banner('    P2b CI_upper( mean per-seed OLS slope of ask on k_PM ) < 0 [resolved dose-response trend]');
banner('  F-PM-a := P1 ∧ CI( body(D100 − D000) ) INCLUDES ZERO         [ask moves, body does not ⇒ STOP]');
banner('  F-PM-b := (∃ ask-moving dose) ∧ (∀ ask-moving dose: GUARD-NI fails)   [clump re-imports ⇒ STOP]');
banner(`    GUARD-NI(d) := spreadY_out & spacingMedian CI_lower > −tol ∧ under4 & dupRun CI_upper < +tol,`);
banner(`                   tol = ${round(NI_FRACTION, 4)} × the CONTROL arm's own level (S2 form, A4-S2P1 §4)`);
banner('  BAND    := the C1 §4 absolute equilibrium band on the top-dose arm, dimensions the');
banner('             CONTROL itself fails EXCLUDED and disclosed (A4-S2P3 §4.2 caveat, verbatim)');
banner('  FLAG    := offsides — returns to the USER, NEVER flips PASS/FAIL (the #157 debt / F-S2d form)');
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
  process.stderr.write(`  [pm-t1 ${tag}] ${done}/${total} matches · ${el.toFixed(0)}s elapsed · `
    + `${rate.toFixed(2)} s/match · ETA ${((total - done) * rate).toFixed(0)}s\n`);
};

interface CoreOut {
  seeds: { base: number; n: number; first: number; last: number };
  perArm: Record<ArmId, {
    matches: number; episodes: number; episodesPerMatch: number;
    triggerTickShare: number; excludedShort: number; excludedSentOff: number;
  }>;
  perSeed: Record<ArmId, Record<string, number[]>>;
  guardSeries: Record<ArmId, Record<string, number[]>>;
  swallow: Record<ArmId, { material: number[]; mark: number[]; station: number[]; other: number[] }>;
  levels: Record<ArmId, Record<string, unknown>>;
  receipts: unknown[];
  readOnly: boolean; eyeNull: boolean;
}

/** Episode-level quantities carried per seed (per-seed value = MEAN over that seed's
 *  episodes, weak-side back unless the key says mirror). */
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
    // per-seed episode means (weak-side back and the ball-side control mirror)
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
    // arm LEVELS (episode-grain descriptive, the #188 reporting shape)
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
    // receipts: the six worst-detachment episodes of the arm (the #188 citation form)
    receipts.push(...[...eps].sort((p, q) => q.weak.detachMean - p.weak.detachMean).slice(0, 6).map((e) => ({
      arm, seed: e.seed, startTick: e.startTick, simSeconds: round(e.simSeconds, 3),
      defendingSide: e.defSide, flankSign: e.flankSign, weakSideSlot: e.weakIdx,
      askLatGap: round(e.weak.askLatGapMean, 3), askLatGapUnmodulated: round(e.weak.askLatGapUnmodMean, 3),
      bodyLatGap: round(e.weak.bodyLatGapMean, 3), detach: round(e.weak.detachMean, 3),
      distToSend: round(e.weak.distToSendMean, 3), markShare: round(e.weak.markShare, 4),
      steerMix: Object.fromEntries(Object.entries(e.weak.steerMix).map(([k, v]) => [k, round(v, 4)])),
      watchHint: `PM-T1 arm ${arm} (gene ${String(doseOf(arm))}), seed ${e.seed}, from tick ${e.startTick} `
        + `(${round(e.startTick * DT, 2)} sim-s), defending side ${e.defSide}, ball flank `
        + `${e.flankSign > 0 ? '+y' : '-y'}, weak-side slot ${e.weakIdx}`,
    })));
  }
  return {
    seeds: { base: RUN_BASE, n: RUN_N, first: seeds[0], last: seeds[seeds.length - 1] },
    perArm, perSeed, guardSeries, swallow: swallowOut, levels, receipts, readOnly, eyeNull,
  };
};

const tCore = Date.now();
const coreA = runCore('pass1');
const passMs = Date.now() - tCore;
const coreB = runCore('pass2');
const digestA = sha(canonical(coreA));
const digestB = sha(canonical(coreB));
const xDet = digestA === digestB;
process.stderr.write(`  [pm-t1] X-DET ${xDet ? 'PASS' : '*** FAIL ***'} (${digestA.slice(0, 12)} / ${digestB.slice(0, 12)})\n`);

/* ========================================================================== */
/* §14 THE FROZEN GATE ARITHMETIC                                             */
/* ========================================================================== */
const askKey = 'askLatGapMean';
const bodyKey = 'bodyLatGapMean';
const ctrlSeries = (k: string): number[] => coreA.perSeed[CONTROL_ARM][k];
const guardCtrl = (k: string): number[] => coreA.guardSeries[CONTROL_ARM][k];

const DOSE_ARMS = ARM_IDS.filter((a) => a !== CONTROL_ARM);

/** ---- PRIMARY: the ASK ---------------------------------------------------- */
const askContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(askKey), coreA.perSeed[a][askKey])])) as Record<string, Contrast>;
const askSlope = slopeOf(
  Object.fromEntries(ARM_IDS.map((a) => [a, coreA.perSeed[a][askKey]])) as Record<ArmId, number[]>,
  K_VALUES,
);
const P1 = Number.isFinite(askContrasts[TOP_ARM].upper) && askContrasts[TOP_ARM].upper < 0;
const askPoints = DOSE_ARMS.map((a) => askContrasts[a].point);
const P2a = askPoints.every((v, i) => i === 0 || (Number.isFinite(v) && Number.isFinite(askPoints[i - 1]) && v <= askPoints[i - 1]));
const P2b = Number.isFinite(askSlope.upper) && askSlope.upper < 0;
const PRIMARY = P1 && P2a && P2b;

/** ---- THE ANSWER, measured separately ------------------------------------- */
const bodyContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(bodyKey), coreA.perSeed[a][bodyKey])])) as Record<string, Contrast>;
const shortfallContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries('shortfallMean'), coreA.perSeed[a].shortfallMean)])) as Record<string, Contrast>;
const detachContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries('detachMean'), coreA.perSeed[a].detachMean)])) as Record<string, Contrast>;
const bodySlope = slopeOf(
  Object.fromEntries(ARM_IDS.map((a) => [a, coreA.perSeed[a][bodyKey]])) as Record<ArmId, number[]>,
  K_VALUES,
);

/** ---- F-PM-a: the ask moves but the body does not ------------------------- */
const bodyTop = bodyContrasts[TOP_ARM];
const bodyIncludesZero = Number.isFinite(bodyTop.lower) && Number.isFinite(bodyTop.upper)
  && bodyTop.lower <= 0 && bodyTop.upper >= 0;
const F_PM_a = P1 && bodyIncludesZero;
/** the QUANTIFIED swallow share (rides whether or not F-PM-a fires) */
const swallowShare = Object.fromEntries(ARM_IDS.map((a) => {
  const s = coreA.swallow[a];
  return [a, ASK_MATERIAL_LADDER.map((cut, i) => ({
    materialCutM: cut, materialTicks: s.material[i],
    markStanceShare: s.material[i] === 0 ? Number.NaN : round(s.mark[i] / s.material[i]),
    stationWalkShare: s.material[i] === 0 ? Number.NaN : round(s.station[i] / s.material[i]),
    otherShare: s.material[i] === 0 ? Number.NaN : round(s.other[i] / s.material[i]),
  }))];
}));

/** ---- GUARD-NI (the S2 non-inferiority form, tolerance INHERITED) --------- */
type GuardLimb = { key: string; direction: 'floor' | 'ceiling' };
const GUARD_LIMBS: readonly GuardLimb[] = [
  { key: 'spreadYOut', direction: 'floor' },     // the B1-a collapse direction is DOWN
  { key: 'spacingMedian', direction: 'floor' },
  { key: 'spacingUnder4', direction: 'ceiling' }, // the spacing FLOOR read: crowding is UP
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

/** ---- F-PM-b: the clump re-imports at EVERY ask-moving dose ---------------- */
const askMovingDoses = DOSE_ARMS.filter((a) => Number.isFinite(askContrasts[a].upper) && askContrasts[a].upper < 0);
const F_PM_b = askMovingDoses.length > 0 && askMovingDoses.every((a) => !guardNI[a].pass);

/** ---- the equilibrium BAND (with the disclosed substrate-drift exclusion) -- */
const bandRow = (arm: ArmId) => Object.fromEntries(BAND_KEYS.map((k) => {
  const lvl = mean(coreA.guardSeries[arm][k].filter(Number.isFinite));
  const lo = BAND_BASELINE[k] * (1 - BAND_TOLERANCE[k]);
  const hi = BAND_BASELINE[k] * (1 + BAND_TOLERANCE[k]);
  return [k, { level: round(lvl), lo: round(lo), hi: round(hi), inBand: lvl >= lo && lvl <= hi }];
})) as Record<BandKey, { level: number; lo: number; hi: number; inBand: boolean }>;
const bandControl = bandRow(CONTROL_ARM);
const bandTop = bandRow(TOP_ARM);
const bandExcluded = BAND_KEYS.filter((k) => !bandControl[k].inBand);
const bandGated = BAND_KEYS.filter((k) => bandControl[k].inBand);
const BAND_PASS = bandGated.every((k) => bandTop[k].inBand);

/** ---- the #157 instrument debt: FLAG + REPORTED counters ------------------ */
const debtKeys = ['offsides', 'fouls', 'penalties', 'thirdMan', 'overlaps', 'forwardPassShare'] as const;
const instrumentDebt = Object.fromEntries(debtKeys.map((k) => [k,
  Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(guardCtrl(k), coreA.guardSeries[a][k])])),
]));
const offsideTop = contrastOf(guardCtrl('offsides'), coreA.guardSeries[TOP_ARM].offsides);
const OFFSIDE_FLAG = offsideTop.resolved && offsideTop.point > 0;

/** ---- REPORTED (no gate): mark-assignment drift, the map §2.4 channel ------ */
const markDrift = Object.fromEntries(['markShare', 'markFarSideShare', 'distToMarkMean', 'markLatGapMean']
  .map((k) => [k, Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(k), coreA.perSeed[a][k])]))]));

/* ========================================================================== */
/* §15 THE X-FAMILY GATES                                                     */
/* ========================================================================== */
/** G-CTRLEQ: the CONTROL arm (flag ARMED, gene ABSENT) ≡ a FLAG-OFF match, whole-run
 *  signature with the rng stream included, on the first min(8, N) seeds.
 *  ⚠ SEMANTICS, exactly (#194): THE ARMS DIFFER IN CODE PATH — armed ⇒ `pmMover` is
 *  true ⇒ the M-PM.1 branch is ENTERED on every defensive mover read and k_PM
 *  evaluates to 0. So this re-proves, inside THIS exam's own world, that the control
 *  arm is production-equivalent THROUGH the live branch (PM-T0's G-BORN). */
const CTRLEQ_SEEDS = Math.min(8, RUN_N);
const ctrlEq = (() => {
  const rows: { seed: number; identical: boolean }[] = [];
  for (let i = 0; i < CTRLEQ_SEEDS; i++) {
    const seed = RUN_BASE + i;
    const a = matchOf(seed, CONTROL_ARM); while (!a.finished) a.step(DT);
    const b = matchOf(seed, 'FLAG_OFF'); while (!b.finished) b.step(DT);
    rows.push({ seed, identical: signature(a) === signature(b) });
  }
  return { pass: rows.every((r) => r.identical), seeds: CTRLEQ_SEEDS, rows };
})();

/** G-ARM: the #196.3-D4 ARMING CHECKLIST, asserted per arm. */
const armCheck = (() => {
  const rows = ARM_IDS.map((arm) => {
    const m = matchOf(RESERVED_BAND[1], arm); // CONSTRUCTION ONLY — never stepped
    const dose = doseOf(arm);
    const views = m.teams.map((t) => [
      (t.info.genome as TacticalGenome).defLaneConvergence ?? null,
      (t.baseGenome as TacticalGenome).defLaneConvergence ?? null,
      (t.effGenome as TacticalGenome).defLaneConvergence ?? null,
    ]);
    const kBoth = m.teams.map((t) => round(pmLaneConvergenceK(t.effGenome as TacticalGenome), 8));
    const wantK = round(dose === null ? 0 : dose * PM_LANE_CONVERGENCE_MAX, 8);
    return {
      arm, dose, flag: m.pmLaneConvergence === true,
      geneOnAllViews: views.every((v) => v.every((x) => x === dose)),
      kPm: kBoth, kExpected: wantK, kCorrect: kBoth.every((k) => k === wantK),
      bothTeamsDosed: DOSE_BOTH_TEAMS,
    };
  });
  // the EVOLUTION opt-in channel is LIVE (PM-T0's `optInDraws` evidence form)
  const rngOn = new Rng(770_101); const rngOff = new Rng(770_101);
  let gOn = randomGenome(new Rng(11)); let gOff = randomGenome(new Rng(11));
  for (let i = 0; i < 4; i++) {
    gOn = mutateGenome(gOn, rngOn, { rate: 0.45, scale: 0.14, evolveDefLaneConvergence: true });
    gOff = mutateGenome(gOff, rngOff, { rate: 0.45, scale: 0.14 });
  }
  const optInLive = gOn.defLaneConvergence !== undefined && gOff.defLaneConvergence === undefined;
  return {
    pass: rows.every((r) => r.flag && r.geneOnAllViews && r.kCorrect) && optInLive,
    optInLive, rows,
    semantics: 'THE ARMING CHECKLIST (#196.3-D4): the FLAG is on in every arm, the GENE is written '
      + 'on all three genome views of BOTH teams (the a4World armGenes idiom — the REAL gene '
      + 'channel, #196.3-D6: this exam adds NO engine-side dose surface), and the EVOLUTION opt-in '
      + 'channel is shown LIVE (mutateGenome writes the key with it and leaves it absent without). '
      + 'This exam is FIXED-DOSE, so the opt-in is not exercised — asserted, not implied. '
      + 'THE ARMS DIFFER IN EXACTLY ONE THING: the value of `defLaneConvergence`.',
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
process.stderr.write('  [pm-t1] X-FP-PROD: re-deriving the production fingerprint...\n');
const fpObserved = leagueHash(FINGERPRINT_SEED);
const xFpProd = fpObserved === FINGERPRINT_BASELINE;
process.stderr.write(`  [pm-t1] X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}\n`);

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const firstSeed = RUN_BASE; const lastSeed = RUN_BASE + RUN_N - 1;
const seedDisjoint = (() => {
  const clashes = CONSUMED.filter((c) => !(lastSeed < c.range[0] || firstSeed > c.range[1]));
  const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
  const ownBlocks = SMOKE_BASE + SMOKE_N - 1 < FULL_BASE;
  return {
    pass: clashes.length === 0 && inBand && ownBlocks,
    block: `${firstSeed}..${lastSeed}`, band: RESERVED_BAND, inBand,
    smokeBlock: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}`, fullBase: FULL_BASE, ownBlocksDisjoint: ownBlocks,
    consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name),
  };
})();
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

const xGates = {
  xDet: { pass: xDet, digestA, digestB, note: 'the whole core computed TWICE, canonical-JSON digests' },
  xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved, seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS },
  xSrcZero: { pass: srcDiff === '', srcDiff, note: 'instrument-only: zero src/** changes' },
  gArm: armCheck,
  gCtrlEq: {
    ...ctrlEq,
    semantics: 'ARMED + gene ABSENT ≡ FLAG-OFF, whole-match signature INCLUDING the rng stream. '
      + 'THE ARMS DIFFER IN CODE PATH (armed ⇒ pmMover true ⇒ the M-PM.1 branch is entered and '
      + 'k_PM evaluates to 0), so the control arm is production-equivalent THROUGH the live branch.',
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
    note: 'in FULL mode the N run must BE the frozen §4 rule\'s output — a PMT1_N override turns '
      + 'this gate RED rather than passing quietly (the #188 nDerived precedent). PMT1_N is '
      + 'accepted in SMOKE only.',
  },
};
const xPass = Object.values(xGates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §16 ARTIFACT                                                               */
/* ========================================================================== */
const msPerMatchMeasured = passMs / Math.max(1, RUN_N * ARMS_COUNT);
/** THE SIZING BLOCK — the ONLY thing a later FULL run is permitted to read out of a
 *  SMOKE artifact, and it feeds ONLY N (the #188 §4.3 precedent). */
const pairYieldByDose = Object.fromEntries(DOSE_ARMS.map((a) => [a, round(askContrasts[a].n / Math.max(1, RUN_N), 4)]));
const sizingOut = {
  msPerMatch: round(msPerMatchMeasured, 3),
  pairYieldByDose,
  pairYieldMin: Math.min(...Object.values(pairYieldByDose)),
  provenance: MODE === 'smoke'
    ? 'THE SMOKE\'S TWO SIZING NUMBERS — ms/match and the MINIMUM paired-ask yield over the four '
      + 'doses. These are the ONLY numbers a FULL run reads out of this artifact, and they feed '
      + 'ONLY N. THE SMOKE ADJUDICATES NOTHING.'
    : 'POST-HOC on this FULL run — it selected nothing (N came from the frozen rule on the SMOKE\'s '
      + 'two numbers). Reported so the smoke\'s estimate can be checked against reality.',
};
const verdict = !xPass ? 'X-FAMILY FAIL — the measurement is invalid'
  : MODE === 'smoke' ? 'SMOKE — PLUMBING ONLY; ADJUDICATES NOTHING'
    : F_PM_b ? 'STOP — F-PM-b: the clump re-imports (wrong dimension, not wrong dose)'
      : F_PM_a ? 'STOP — F-PM-a: the ask moves, the body does not (returns to the 乙 fork WITH numbers)'
        : !BAND_PASS ? 'STOP — the equilibrium band fails on a dimension the CONTROL holds'
          : PRIMARY ? 'PRIMARY PASS — the ASK moves resolvedly and dose-responsively'
            : 'PRIMARY FAIL — the ask does not move as pre-registered';

const body = {
  stage: 'PM T1 — THE COMPRESSION EXAM (forced doses on the PM-T0 seam)',
  doc: 'docs/world-model/PM-T1-COMPRESSION-EXAM.md',
  contract: 'docs/world-model/PHASE-MODULATION-CONTRACT.md',
  seam: 'docs/world-model/PM-T0-DORMANT-SEAM.md',
  ruling: '#196.5 (the dispatch) · #196.3-D4 (the arming checklist) · #196.3-D6 (the gene channel) '
    + '· #181.2 (committed recomputable receipts) · #194/#196 (gate semantics stated exactly)',
  mode: MODE, head, verdict,
  frozenDesign: {
    doses: ARM_IDS.map((a) => ({ arm: a, gene: doseOf(a), kPm: round(kOf(a), 6) })),
    kCeiling: PM_LANE_CONVERGENCE_MAX,
    doseBothTeams: DOSE_BOTH_TEAMS,
    world: { ...PERCEPT_FLAGS, pmLaneConvergence: true, stationEye: null },
    seeds: coreA.seeds, reservedBand: RESERVED_BAND,
    bootstrap: { base: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, cluster: 'seed' },
    niFraction: round(NI_FRACTION, 6),
    niFractionSource: 'A4-S2P1-VECTOR-CENSUS §4: fraction_box = 1 − 0.275/0.380 = 0.2763, itself '
      + 'the #154 certified box price and its CI bound nearest zero. INHERITED, NOT INVENTED; the '
      + 'S2 form scales the FRACTION by the control arm\'s own level in THIS run.',
    bandSource: 'A4-S2P3-GENE-BATTERY §4.2 (P3a §4.2 / C1 §4 absolute), baselines + tolerances '
      + 'verbatim, WITH its declared substrate-drift exclusion caveat.',
    askMaterialM: ASK_MATERIAL_M,
    askMaterialNote: '⚠ FLAGGED EXECUTOR\'S CHOICE (the #188 SPEED_MIN / CORNER_MATERIAL class): no '
      + 'substrate anchor exists. Reported at 0.5/1.0/2.0 m and read by NO gate predicate.',
    switchKeyProhibition: 'switchKey is NOT computed anywhere in this probe: #188 §8.4 retracted it '
      + 'for cause attribution and MARK-SELECTION-CODE-MAP §5 trap 7 forbids reusing it. Attribution '
      + 'here is the D2 STEER-OWNER read only.',
  },
  nDerivation,
  smokeAdjudicatesNothing: MODE === 'smoke'
    ? '⚠ THIS IS A SMOKE ARTIFACT. Every number under `results` is PLUMBING EVIDENCE ONLY — it '
      + 'adjudicates nothing, tunes no threshold, and may not be cited as a finding. The gate '
      + 'booleans below are computed so the wiring is exercised, not so they can be read.'
    : false,
  predicates: {
    PRIMARY: 'P1 ∧ P2a ∧ P2b — P1: CI_upper(ask(D100 − D000)) < 0 · P2a: the four ask point deltas '
      + 'are weakly monotone non-increasing in dose · P2b: CI_upper(mean per-seed OLS slope of the '
      + 'ask on k_PM) < 0',
    'F-PM-a': 'P1 ∧ the top-dose BODY lane-gap contrast CI INCLUDES ZERO (lower ≤ 0 ≤ upper) ⇒ STOP; '
      + 'the swallow share is quantified from the D2 steer attribution over the material-ask ticks',
    'F-PM-b': '(at least one dose moves the ask, CI_upper < 0) AND (at EVERY such dose GUARD-NI '
      + 'fails) ⇒ STOP. GUARD-NI(d) = spreadY_out and spacingMedian CI_lower > −tol AND '
      + 'spacingUnder4 and dupRun CI_upper < +tol, tol = 0.2763 × |control level|',
    BAND: 'the top-dose arm inside the C1 §4 absolute band on every dimension the CONTROL arm '
      + 'itself holds; dimensions the CONTROL fails are DISCLOSED and EXCLUDED (A4-S2P3 §4.2)',
    FLAG: 'offsides — resolvedly UP at the top dose returns the axis to the USER; it NEVER flips '
      + 'PASS/FAIL (the #157 instrument debt, the F-S2d form)',
  },
  results: {
    perArm: coreA.perArm,
    levels: coreA.levels,
    ask: { contrasts: askContrasts, slopeOnK: askSlope, P1, P2a, P2b, PRIMARY, askMovingDoses },
    answer: {
      bodyLaneGap: bodyContrasts, bodySlopeOnK: bodySlope,
      compressionShortfall: shortfallContrasts, detachment: detachContrasts,
      note: 'THE ANSWER IS MEASURED SEPARATELY FROM THE ASK — contract §3. These are BODY '
        + 'positions; the ask contrasts above are SEND TARGETS. They are not two views of one '
        + 'quantity and do not subtract into each other (the #188 §8.3 lesson).',
    },
    fPmA: { fired: F_PM_a, P1, bodyTopContrast: bodyTop, bodyIncludesZero, swallowShare },
    fPmB: { fired: F_PM_b, askMovingDoses, guardNI },
    band: { pass: BAND_PASS, control: bandControl, topDose: bandTop, gatedDimensions: bandGated, excludedAsSubstrateDrift: bandExcluded },
    instrumentDebt157: { offsideFlagFired: OFFSIDE_FLAG, offsideTopContrast: offsideTop, contrasts: instrumentDebt },
    reportedMarkDrift: {
      note: 'REPORTED, NEVER GATED — the MARK-SELECTION-CODE-MAP §2.4 positional-feedback channel: '
        + 'assignMarks reads p.pos, so dosed bodies re-rank nearest-body claims. Visible and '
        + 'attributed, not designed away.',
      contrasts: markDrift,
    },
    receipts: coreA.receipts,
  },
  gates: { ...xGates, xFamilyPass: xPass },
  honesty: [
    'FROZEN BEFORE SIGHT: doses, seeds, N rule, gates, predicates and tolerances were written in '
      + 'the stage doc before any full-N number existed, and are not re-cut afterwards.',
    'THE SMOKE ADJUDICATES NOTHING and may not tune any threshold: it proves plumbing and measures '
      + 'ms/match for the wall term of N — no level, share, rate or CI from it is read as a result.',
    'NO RE-CUT AFTER SIGHT: the k_PM ceiling 0.25 is PM-T0\'s traced constant, the NI fraction is '
      + 'inherited from A4-S2P1 §4 and the band from A4-S2P3 §4.2. FAILs are reported AS-IS.',
    'The arms diverge tick-for-tick, so PAIRING IS ON THE SEED, not on the episode: each seed '
      + 'contributes one paired delta per dose, and the bootstrap clusters on the seed.',
    'PM-T1 claims nothing about production: nothing ships, the flag is absent from every bundle, '
      + 'and the fingerprint is re-derived unchanged (X-FP-PROD).',
  ],
};
/** ⭐ #181.2: `resultSha256` hashes ONLY the timing-free body, so it is RECOMPUTABLE by
 *  re-running this probe. Wall-clock numbers (which move between runs of the same
 *  block) live OUTSIDE the hash, the PM-T0 `wallMsContextOnly` form. */
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  sizing: sizingOut,
  wallContextOnly: {
    corePassMs: passMs, totalMs: Date.now() - wall0,
    note: 'CONTEXT ONLY, and OUTSIDE resultSha256 — used in no gate. `sizing.msPerMatch` is the '
      + 'one timing number with a job: the wall term of the frozen N rule reads it.',
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §17 STDOUT                                                                 */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const fmt = (c: Contrast): string => `${c.point >= 0 ? '+' : ''}${c.point} [${c.lower}, ${c.upper}] n=${c.n}${c.resolved ? ' ✔' : ''}`;
o('');
o(`=== PM-T1 COMPRESSION EXAM (${MODE}) — HEAD ${head} — ${RUN_N} seeds × ${ARMS_COUNT} arms, block ${firstSeed}..${lastSeed} ===`);
o(`doses ${ARM_IDS.map((a) => `${a}:${doseOf(a) === null ? 'absent' : doseOf(a)}(k=${round(kOf(a), 4)})`).join('  ')}`);
o(`episodes/arm ${ARM_IDS.map((a) => `${a}:${coreA.perArm[a].episodes}`).join('  ')}`);
o('');
o('ASK (send-target lane gap, weak-side back, paired per-seed vs D000):');
for (const a of DOSE_ARMS) o(`  ${a}  ${fmt(askContrasts[a])}   level ${askContrasts[a].treated} m (control ${askContrasts[a].control} m)`);
o(`  slope on k_PM  ${fmt(askSlope)}  m per unit k  (seeds admitted: ${askSlope.n})`);
o(`  P1 ${P1 ? 'PASS' : 'FAIL'} · P2a ${P2a ? 'PASS' : 'FAIL'} · P2b ${P2b ? 'PASS' : 'FAIL'} ⇒ PRIMARY ${PRIMARY ? 'PASS' : 'FAIL'}`);
o('');
o('ANSWER (body lane gap / shortfall / detachment — measured SEPARATELY):');
for (const a of DOSE_ARMS) o(`  ${a}  body ${fmt(bodyContrasts[a])} · shortfall ${fmt(shortfallContrasts[a])} · detach ${fmt(detachContrasts[a])}`);
o('');
o(`F-PM-a ${F_PM_a ? '*** FIRED ***' : 'not fired'} (P1 ${P1} ∧ top-dose body CI includes zero ${bodyIncludesZero})`);
for (const a of ARM_IDS) {
  const row = (swallowShare as Record<string, { materialCutM: number; materialTicks: number; markStanceShare: number; stationWalkShare: number }[]>)[a][1];
  o(`  swallow ${a} @${row.materialCutM} m: material ticks ${row.materialTicks} · markStance ${row.markStanceShare} · stationWalk ${row.stationWalkShare}`);
}
o('');
o(`F-PM-b ${F_PM_b ? '*** FIRED ***' : 'not fired'} (ask-moving doses: ${askMovingDoses.join(',') || 'none'})`);
for (const a of DOSE_ARMS) {
  o(`  GUARD-NI ${a} ${guardNI[a].pass ? 'PASS' : 'FAIL'}: `
    + guardNI[a].limbs.map((l) => `${l.key} ${l.pass ? 'ok' : 'BLOWN'} (${fmt(l.contrast)} vs ±${l.tolerance})`).join(' · '));
}
o('');
o(`BAND ${BAND_PASS ? 'PASS' : 'FAIL'} — gated ${bandGated.join(',') || 'none'} · excluded as substrate drift ${bandExcluded.join(',') || 'none'}`);
o(`OFFSIDE FLAG ${OFFSIDE_FLAG ? '*** FIRED (returns to the USER; never flips PASS/FAIL) ***' : 'quiet'} — ${fmt(offsideTop)}`);
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
if (MODE === 'full' && (!PRIMARY || F_PM_a || F_PM_b || !BAND_PASS)) process.exit(2);
process.exit(0);
