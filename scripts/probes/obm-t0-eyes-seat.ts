/**
 * OBM T0 — THE DORMANT OFF-BALL EYES SEAT (前插与回撤是同一个选择): the receipts probe.
 *
 * Doc: docs/world-model/OBM-T0-DORMANT-SEAM.md
 * Contract: docs/world-model/OFFBALL-MOVEMENT-CONTRACT.md §2 M-OBM.1–4, §3 OBM-T0
 * Ruling: #227 (the dispatch), #181.2 (THE STANDING RECEIPT RULE), #194 (state each
 *         gate's semantics EXACTLY — say what the arms DIFFER in), #197-M1 (nothing
 *         commit-dependent inside the hashed body), #200 (no predicates), #202
 *         (traced bounds derived IN CODE, never typed literals).
 *
 * ⭐ #181.2: a HARD gate's evidence must be a COMMITTED, RECOMPUTABLE artifact.
 * Every hash below is computed IN THIS PROBE on the run that writes the JSON —
 * nothing is transcribed from a doc, and the doc quotes the artifact, never the
 * other way round. Re-run:
 *
 *     npx tsx scripts/probes/obm-t0-eyes-seat.ts
 *          → docs/world-model/data/obm-t0-eyes-seat.json
 *
 * The gates (all HARD unless marked REPORTED):
 *   G-IDENT   flag/gene-absent league byte-identity on THREE frozen league seeds,
 *             each recomputed here (2 seasons; the 1337 row IS the production
 *             fingerprint). These baselines were frozen from PRE-change code, so
 *             THIS is the RNG-stream receipt for the sim path.
 *   G-FP      the 1337 row IS X-FP-PROD.
 *   G-OFF     per-match whole-run signature (rng state included): flag ABSENT ≡
 *             flag FALSE, production-shaped AND percept-armed. ⚠ SEMANTICS: both
 *             arms run the SAME flag-off path ⇒ CONFIG EQUIVALENCE only.
 *   G-BORN    ARMED with the matrix ABSENT ≡ OFF. ⚠ The arms DIFFER in code path:
 *             armed ⇒ both forks are ENTERED and the seat PULLS A PERCEPT on every
 *             off-ball decision, so this proves the born-absent read inert THROUGH
 *             the live branch AND proves the pull itself side-effect-free.
 *   G-ZERO    ARMED with the matrix present AT ZERO ≡ OFF — the additive /
 *             multiplicative law is exactly null at 0 (`+0`, `×1`).
 *   G-BITE    ARMED at a non-zero dose in a PERCEPT-ARMED world the world DIVERGES,
 *             and the POLICY GEOMETRY moves as §LAW says at the traced corners
 *             (sign AND exact magnitude of the plane shift and of both score
 *             multipliers, sampled on live match states).
 *   G-EPI ⭐  EPISTEMIC HONESTY, PROVED: on a stepped fixture whose PERCEPT
 *             disagrees with TRUTH (opponents moved after the last scan), the
 *             seat's features equal the PERCEPT-derived values and NOT the
 *             truth-derived ones; plus the source-level pin that the seat module
 *             touches nothing on `match` but `perceivedSnapshot`.
 *   G-BLIND ⭐ THE FOURTH ARMING LIMB: fully armed and fully dosed in a world with
 *             the percept trunk OFF ≡ that world unarmed. A blind body has no
 *             policy. (An ADDED gate — strictly more conservative.)
 *   G-RNG     the seam draws ZERO rng (exact state compare across a dosed armed
 *             decision on a stepped fixture) and the opt-in's draws sit strictly
 *             after every existing draw incl. the ctbSupportPlane block.
 *   G-HYGIENE `?? false`; flag and matrix ABSENT from a4World.ts entirely; matrix
 *             absent from GENE_KEYS; fresh Match and League match both OFF; no env
 *             door.
 *   G-FORK    the READ-FORK INVENTORY: EXACTLY TWO `match.obmMovement` forks in
 *             src/**, at the two named sites, with every src occurrence of the flag
 *             and of the seat's symbols enumerated and classed.
 *   G-TRACE   every bound DERIVED IN CODE from an incumbent constant, each
 *             declaration line matched VERBATIM.
 *   G-PINS    the §PINS inventory's machine-checkable rows, INCLUDING the banked
 *             CTB plane's own pinned source lines, still present verbatim.
 *   G-SEED    seed-block disjointness, proved in-probe.
 *   G-DET     the experiment core runs TWICE, byte-identical digests.
 *   REPORTED  (a) a dosed corner smoke; (b) ⭐ the PERCEPT-PULL COST reading.
 *             DESCRIPTIVE ONLY — no control, no CI; the POLICY EXAM is OBM-T1's.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { AI_INTERVAL, DT, HALF_L, HALF_W, OFFBALL_TIRED_MUL } from '../../src/sim/constants';
import {
  CTB_DEPTH_BIAS_SPAN, SUPPORT_LAT_CAP_FRAC, SUPPORT_LAT_PULL, supportSpot,
  supportSpotOnObmPlane,
} from '../../src/ai/formations';
import { PRESSURE_RADIUS_M } from '../../src/ai/perception';
import {
  perceptionRetentionTicks, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import {
  OBM_POLICY_TTL_TICKS, OBM_SCORE_SPAN, obmFeatures, obmOffballPolicy, obmPolicyOf,
} from '../../src/ai/offballEyes';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, GENE_KEYS, OBM_FEATURE_KEYS, OBM_OUTPUT_KEYS,
  OBM_WEIGHT_MAX, OBM_WEIGHT_MIN, OBM_WEIGHT_SLOTS, crossoverGenomes, mutateGenome,
  randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { clamp01 } from '../../src/utils/math';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const OUT_PATH = 'docs/world-model/data/obm-t0-eyes-seat.json';

/* ---- the frozen league-identity baselines (the PRE-CHANGE production hashes,
 * inherited VERBATIM and UNTRUNCATED from CTB-T0 / O2-T0 §GATES G-IDENT).
 * This probe recomputes all three. */
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: FINGERPRINT_SEED, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/* ---- seeds: a FRESH block above everything the ledger has consumed ------------ */
const BLOCK = 12_424_000;
const N = Number(process.env.OBMT0_N ?? 24);
const COST_SEED = BLOCK + N + 1; // 12,424,025 — the REPORTED cost reading
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat block (repro receipt)', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
  { name: 'O2-T1 smoke (#222)', range: [12_422_000, 12_422_011] },
  { name: 'O2-T1 guard (#222)', range: [12_422_050, 12_422_099] },
  { name: 'O2-T1 battery + reserve (#222)', range: [12_422_100, 12_422_899] },
  { name: 'CTB-T0 receipts + corner/smoke read (#223)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds', range: [12_423_900, 12_423_901] },
];

const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walkValue = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walkValue);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walkValue(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walkValue(v));
};
const round = (v: number, d = 4): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** The percept trunk alive — the enriched census world this seat requires. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;

type Arm =
  | 'absent' | 'off' | 'plain' | 'plainOff' | 'bornArmed' | 'zeroArmed' | 'forced'
  | 'blindOff' | 'blindForced';

/**
 * ⭐ THE INSTRUMENT DOSE (OBM-T1's policy family, used here only to make the seat
 * BITE): one readable policy corner, written at the frozen domain ends —
 *   • carrier pressed        ⇒ DROP (planeDepth ← −1 · f1)   [回撤]
 *   • my own marker tight    ⇒ WIDEN (planeWidth ← +1 · f2)
 *   • carrier pressed        ⇒ WANT IT (supportScore ← +1 · f1)
 *   • my target is crowded   ⇒ DON'T RUN (runScore ← −1 · f3)
 * No number is invented: every non-zero entry is ±1, the domain's own corner.
 */
const IDX = (output: number, feature: number): number => output * OBM_FEATURE_KEYS.length + feature;
const FORCED_MATRIX = ((): number[] => {
  const w = new Array<number>(OBM_WEIGHT_SLOTS).fill(0);
  w[IDX(0, 0)] = OBM_WEIGHT_MIN; // planeDepth  ← carrierPlight
  w[IDX(1, 1)] = OBM_WEIGHT_MAX; // planeWidth  ← ownMarker
  w[IDX(2, 0)] = OBM_WEIGHT_MAX; // supportScore ← carrierPlight
  w[IDX(3, 2)] = OBM_WEIGHT_MIN; // runScore    ← targetCongestion
  return w;
})();
const ZERO_MATRIX = new Array<number>(OBM_WEIGHT_SLOTS).fill(0);

/** ⭐ THE ARMING CHECKLIST (#196.3-D6): the matrix on ALL THREE views of BOTH teams. */
const armMatrix = (m: Match, w: number[] | null): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (w === null) delete g.offballMovementWeights;
      else g.offballMovementWeights = [...w];
    }
  }
};

const matchOf = (seed: number, arm: Arm): Match => {
  const percept = !(arm === 'plain' || arm === 'plainOff'
    || arm === 'blindOff' || arm === 'blindForced');
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(percept ? PERCEPT_FLAGS : {}),
    ...(arm === 'off' || arm === 'plainOff' || arm === 'blindOff'
      ? { obmMovement: false } : {}),
    ...(arm === 'bornArmed' || arm === 'zeroArmed' || arm === 'forced' || arm === 'blindForced'
      ? { obmMovement: true } : {}),
  });
  if (arm === 'zeroArmed') armMatrix(m, ZERO_MATRIX);
  if (arm === 'forced' || arm === 'blindForced') armMatrix(m, FORCED_MATRIX);
  return m;
};

/** The whole-match signature, INCLUDING the rng stream state. */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

const walk = (seed: number, arm: Arm): string => {
  const m = matchOf(seed, arm);
  while (!m.finished) m.step(DT);
  return signature(m);
};

/* ---- G-BITE's geometry half + the REPORTED corner table ---------------------- */
/**
 * On ONE armed match, sampled every 15 playing ticks over both sides' outfielders,
 * compute the REAL policy from the body's REAL percept at the forced dose and check
 * §LAW's SIGN and MAGNITUDE claims directly, against the incumbent point and the
 * incumbent scores. Observation-only: it never runs inside an arm whose signature
 * is compared.
 */
const policyGeometry = (seed: number): {
  samples: number;
  featureMeans: number[];
  planeDepthMean: number; planeWidthMean: number;
  supportMulMean: number; runMulMean: number;
  meanIncumbentAheadMetres: number; meanDosedAheadMetres: number;
  meanAbsShiftMetres: number; maxAbsShiftMetres: number;
  movedSamples: number; behindBallSamples: number; incumbentBehindBallSamples: number;
  lawViolations: {
    outputArithmetic: number; planeCompose: number; scoreCompose: number;
    planeSign: number; planeMagnitude: number; featureRange: number;
  };
  lawPass: boolean;
} => {
  const m = matchOf(seed, 'bornArmed');
  const featureSums = new Array<number>(OBM_FEATURE_KEYS.length).fill(0);
  let samples = 0;
  let depthSum = 0;
  let widthSum = 0;
  let supMulSum = 0;
  let runMulSum = 0;
  let aheadBase = 0;
  let aheadDosed = 0;
  let shiftSum = 0;
  let shiftMax = 0;
  let moved = 0;
  let behind = 0;
  let baseBehind = 0;
  const v = {
    outputArithmetic: 0, planeCompose: 0, scoreCompose: 0,
    planeSign: 0, planeMagnitude: 0, featureRange: 0,
  };
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 15 !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff || p.role === 'GK') continue;
        const base = supportSpot(p, t, m.ball);
        // the dose is applied to a COPY of the team genome, so the sampled match
        // trajectory stays the born-absent one (observation, never intervention)
        const dosed: TacticalGenome = { ...t.genome, offballMovementWeights: [...FORCED_MATRIX] };
        const policy = obmOffballPolicy(p, m, dosed, base);
        // (a) the features are in range
        for (const f of policy.features) if (!(f >= 0 && f <= 1)) v.featureRange += 1;
        // (b) the outputs ARE the mean of the weighted features
        for (let o = 0; o < OBM_OUTPUT_KEYS.length; o++) {
          let acc = 0;
          for (let k = 0; k < OBM_FEATURE_KEYS.length; k++) {
            acc += FORCED_MATRIX[IDX(o, k)] * policy.features[k];
          }
          if (Math.abs(policy.outputs[o] - acc / OBM_FEATURE_KEYS.length) > 1e-12) {
            v.outputArithmetic += 1;
          }
        }
        // (c) the plane is clamp(STATIC INTERCEPT + dynamic) — the static CTB genes
        //     are absent here, so the intercept is exactly 0
        const wantDepth = Math.max(CTB_GENE_MIN, Math.min(CTB_GENE_MAX, policy.outputs[0]));
        const wantWidth = Math.max(CTB_GENE_MIN, Math.min(CTB_GENE_MAX, policy.outputs[1]));
        if (Math.abs(policy.plane.depth - wantDepth) > 1e-12) v.planeCompose += 1;
        if (Math.abs(policy.plane.width - wantWidth) > 1e-12) v.planeCompose += 1;
        // (d) the score multipliers are 1 + output · SPAN, inside the frozen band
        if (Math.abs(policy.supportMul - (1 + policy.outputs[2] * OBM_SCORE_SPAN)) > 1e-12
          || Math.abs(policy.runMul - (1 + policy.outputs[3] * OBM_SCORE_SPAN)) > 1e-12
          || policy.supportMul < 1 - OBM_SCORE_SPAN - 1e-12
          || policy.supportMul > 1 + OBM_SCORE_SPAN + 1e-12
          || policy.runMul < 1 - OBM_SCORE_SPAN - 1e-12
          || policy.runMul > 1 + OBM_SCORE_SPAN + 1e-12) v.scoreCompose += 1;
        // (e) the GEOMETRY: the plane point moves as §LAW says, sign and magnitude
        const got = supportSpotOnObmPlane(p, t, m.ball, policy.plane);
        const radius = 10 + t.genome.supportDistance * 8;
        const bias = t.mode === 'CounterAttack' || t.mode === 'Attack' ? 0.75 : 0.35;
        const wantX = Math.max(-HALF_L + 2, Math.min(
          HALF_L - 2,
          m.ball.pos.x + t.attackDir * radius * (bias + policy.plane.depth * CTB_DEPTH_BIAS_SPAN),
        ));
        if (Math.abs(got.x - wantX) > 1e-9) v.planeMagnitude += 1;
        const baseAheadM = (base.x - m.ball.pos.x) * t.attackDir;
        const aheadM = (got.x - m.ball.pos.x) * t.attackDir;
        // this dose's depth output can only be ≤ 0 (a negative weight on a
        // non-negative feature), so the seat can only ever pull him BACK
        if (policy.plane.depth < 0 && aheadM > baseAheadM + 1e-9) v.planeSign += 1;
        if (policy.plane.depth === 0 && Math.abs(aheadM - baseAheadM) > 1e-9) v.planeSign += 1;
        const shift = Math.hypot(got.x - base.x, got.y - base.y);
        if (shift > 1e-9) moved += 1;
        shiftSum += shift;
        shiftMax = Math.max(shiftMax, shift);
        aheadBase += baseAheadM;
        aheadDosed += aheadM;
        if (aheadM < 0) behind += 1;
        if (baseAheadM < 0) baseBehind += 1;
        for (let k = 0; k < OBM_FEATURE_KEYS.length; k++) featureSums[k] += policy.features[k];
        depthSum += policy.plane.depth;
        widthSum += policy.plane.width;
        supMulSum += policy.supportMul;
        runMulSum += policy.runMul;
        samples += 1;
      }
    }
  }
  const n = Math.max(samples, 1);
  return {
    samples,
    featureMeans: featureSums.map((s) => round(s / n)),
    planeDepthMean: round(depthSum / n),
    planeWidthMean: round(widthSum / n),
    supportMulMean: round(supMulSum / n),
    runMulMean: round(runMulSum / n),
    meanIncumbentAheadMetres: round(aheadBase / n),
    meanDosedAheadMetres: round(aheadDosed / n),
    meanAbsShiftMetres: round(shiftSum / n),
    maxAbsShiftMetres: round(shiftMax),
    movedSamples: moved,
    behindBallSamples: behind,
    incumbentBehindBallSamples: baseBehind,
    lawViolations: v,
    lawPass: samples > 0 && Object.values(v).every((c) => c === 0) && moved > 0,
  };
};

/* ---- ⭐ G-EPI: the eyes are honest, PROVED on a percept/truth divergence ------ */
const epiFixture = (seed: number): {
  bodies: number;
  featuresMatchPercept: number; featuresMatchTruth: number;
  meanPerceptAge: number; truthAge: number;
  divergedBodies: number;
  moduleMatchMembers: string[]; moduleBannedHits: string[];
  pass: boolean;
} => {
  const m = matchOf(seed, 'bornArmed');
  for (let i = 0; i < 600; i++) m.step(DT);
  const candidates: {
    p: (typeof m.allPlayers)[number]; side: 0 | 1; candidate: { x: number; y: number };
    fromPercept: number[]; ageMean: number;
  }[] = [];
  // ⚠ Scoped to side-0 observers on purpose: the divergence below moves the SIDE-1
  // bodies only, so the OBSERVERS themselves and their own intention points are
  // untouched and the ONLY thing that can move a feature is what he believes about
  // his opponents — which is exactly the claim under test.
  const observerTeam = m.teams[0];
  for (const p of observerTeam.players) {
    if (p.sentOff || p.role === 'GK') continue;
    const snap = m.perceivedSnapshot(p);
    if (snap === null) continue;
    const opponents = snap.players.filter((o) => o.side !== p.side);
    if (opponents.length === 0) continue;
    const candidate = supportSpot(p, observerTeam, m.ball);
    candidates.push({
      p,
      side: observerTeam.side,
      candidate: { x: candidate.x, y: candidate.y },
      fromPercept: obmFeatures(snap, p.pos, p.side, candidate),
      ageMean: opponents.reduce((n, o) => n + o.ageTicks, 0) / opponents.length,
    });
  }
  // ⭐ THE DIVERGENCE: move every OPPONENT 25 m WITHOUT stepping, so no new scan
  // moment is recorded. Truth has changed; his recorded scan moments have not.
  for (const p of m.teams[1].players) { p.pos.x += 25; p.pos.y += 12; }
  const truthSnapshot = (gid: number): PerceptionSnapshot => ({
    tick: m.simTick, observerGid: gid, awareness: 0.8, ball: null,
    players: m.allPlayers.filter((q) => !q.sentOff).map((q) => ({
      gid: q.gid, side: q.side, pos: { x: q.pos.x, y: q.pos.y },
      vel: { x: q.vel.x, y: q.vel.y }, bodyDir: { x: q.bodyDir.x, y: q.bodyDir.y },
      observedTick: m.simTick, ageTicks: 0,
    })),
  });
  let matchPercept = 0;
  let matchTruth = 0;
  let diverged = 0;
  let ageSum = 0;
  for (const c of candidates) {
    // the SEAT, run through its real entry point on the moved world
    const seat = obmOffballPolicy(c.p, m, m.teams[c.side].genome, c.candidate);
    const fromTruth = obmFeatures(truthSnapshot(c.p.gid), c.p.pos, c.p.side, c.candidate);
    const same = (a: readonly number[], b: readonly number[]): boolean =>
      a.length === b.length && a.every((x, i) => x === b[i]);
    if (same(seat.features, c.fromPercept)) matchPercept += 1;
    if (same(seat.features, fromTruth)) matchTruth += 1;
    if (!same(c.fromPercept, fromTruth)) diverged += 1;
    ageSum += c.ageMean;
  }
  // the SOURCE-LEVEL pin: the module reads nothing but the snapshot path
  const eyesSrc = readFileSync('src/ai/offballEyes.ts', 'utf8');
  const code = eyesSrc.split('\n')
    .filter((l) => {
      const t = l.trim();
      return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
    }).join('\n');
  const members = [...new Set([...code.matchAll(/\bmatch\.(\w+)/g)].map((mm) => mm[1]))].sort();
  const BANNED = [
    'allPlayers', 'perceptionTruth', 'oraclePerceptionSnapshot', 'capturePerceptionTruth',
    'match.teams', 'match.ball', 'team.players', 'opp.', 'pressureAt(',
  ];
  const bannedHits = BANNED.filter((b) => code.includes(b));
  return {
    bodies: candidates.length,
    featuresMatchPercept: matchPercept,
    featuresMatchTruth: matchTruth,
    meanPerceptAge: round(ageSum / Math.max(candidates.length, 1)),
    truthAge: 0,
    divergedBodies: diverged,
    moduleMatchMembers: members,
    moduleBannedHits: bannedHits,
    pass: candidates.length > 0
      && matchPercept === candidates.length // every body reads his OWN eyes
      && diverged === candidates.length // and truth really did move away
      && matchTruth === 0 // and NOT ONE body reads the truth
      && members.length === 1 && members[0] === 'perceivedSnapshot'
      && bannedHits.length === 0,
  };
};

/* ---- G-RNG (a): an armed, dosed decision draws zero rng ---------------------- */
const seamRng = (seed: number): { before: number; after: number; pass: boolean; calls: number } => {
  const m = matchOf(seed, 'forced');
  for (let i = 0; i < 400; i++) m.step(DT);
  const before = (m.rng as unknown as { s: number }).s;
  let calls = 0;
  for (const t of m.teams) {
    for (const p of t.players) {
      if (p.sentOff || p.role === 'GK') continue;
      const policy = obmOffballPolicy(p, m, t.genome, supportSpot(p, t, m.ball));
      supportSpotOnObmPlane(p, t, m.ball, policy.plane);
      calls += 1;
    }
  }
  const after = (m.rng as unknown as { s: number }).s;
  return { before, after, pass: before === after && calls > 0, calls };
};

/* ---- G-RNG (b): the evolution path draws ZERO extra with the opt-in off ------ */
const evoRng = (): {
  genomesIdentical: boolean; rngStateIdentical: boolean; matrixStayedAbsent: boolean;
  optInDraws: boolean; ctbStreamUnmoved: boolean; crossoverOrderHeld: boolean;
  sActual: number; sHead: number;
} => {
  const headMutate = (g: TacticalGenome, rng: Rng, rate: number, scale: number): TacticalGenome => {
    const out = { ...g };
    for (const k of GENE_KEYS) if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
    return out;
  };
  const headCross = (a: TacticalGenome, b: TacticalGenome, rng: Rng): TacticalGenome => {
    const out = {} as TacticalGenome;
    for (const k of GENE_KEYS) {
      const r = rng.next();
      out[k] = r < 0.4 ? a[k] : r < 0.8 ? b[k] : (a[k] + b[k]) / 2;
    }
    return out;
  };
  const rngA = new Rng(616161);
  const rngH = new Rng(616161);
  let a0 = randomGenome(new Rng(11));
  let a1 = randomGenome(new Rng(22));
  let h0: TacticalGenome = { ...a0 };
  let h1: TacticalGenome = { ...a1 };
  for (let gen = 0; gen < 8; gen++) {
    a0 = mutateGenome(a0, rngA, { rate: 0.45, scale: 0.14 });
    a1 = mutateGenome(a1, rngA, { rate: 0.4, scale: 0.08 });
    h0 = headMutate(h0, rngH, 0.45, 0.14);
    h1 = headMutate(h1, rngH, 0.4, 0.08);
    a0 = mutateGenome(crossoverGenomes(a0, a1, rngA), rngA, { rate: 0.5, scale: 0.15 });
    h0 = headMutate(headCross(h0, h1, rngH), rngH, 0.5, 0.15);
  }
  const sActual = (rngA as unknown as { s: number }).s;
  const sHead = (rngH as unknown as { s: number }).s;
  // the opt-in really draws (so the zero-draw claim is about the flag, not a no-op)
  const rngOn = new Rng(616161);
  let gOn = randomGenome(new Rng(11));
  for (let gen = 0; gen < 8; gen++) {
    gOn = mutateGenome(gOn, rngOn, { rate: 0.45, scale: 0.14, evolveOffballMovement: true });
  }
  // the PRIOR opt-in's OWN stream is unmoved: a ctbSupportPlane-only run's values are
  // identical whether or not the new block also runs, because the new draws sit
  // STRICTLY AFTER it — in mutation AND in crossover.
  const ctbOnly = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
    rate: 1, scale: 0.2, evolveCtbSupportPlane: true,
  });
  const both = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
    rate: 1, scale: 0.2, evolveCtbSupportPlane: true, evolveOffballMovement: true,
  });
  const p0 = { ...randomGenome(new Rng(3)), ctbSupportDepth: 0.4, ctbSupportWidth: -0.4 };
  const p1 = { ...randomGenome(new Rng(4)), ctbSupportDepth: -0.8, ctbSupportWidth: 0.8 };
  const xCtb = crossoverGenomes(p0, p1, new Rng(31), false, false, false, false, true);
  const xBoth = crossoverGenomes(p0, p1, new Rng(31), false, false, false, false, true, true);
  return {
    genomesIdentical: GENE_KEYS.every((k) => a0[k] === h0[k] && a1[k] === h1[k]),
    rngStateIdentical: sActual === sHead,
    matrixStayedAbsent: a0.offballMovementWeights === undefined
      && a1.offballMovementWeights === undefined,
    optInDraws: Array.isArray(gOn.offballMovementWeights)
      && gOn.offballMovementWeights.length === OBM_WEIGHT_SLOTS
      && gOn.offballMovementWeights.some((v) => v !== 0),
    ctbStreamUnmoved: both.ctbSupportDepth === ctbOnly.ctbSupportDepth
      && both.ctbSupportWidth === ctbOnly.ctbSupportWidth,
    crossoverOrderHeld: xBoth.ctbSupportDepth === xCtb.ctbSupportDepth
      && xBoth.ctbSupportWidth === xCtb.ctbSupportWidth
      && Array.isArray(xBoth.offballMovementWeights),
    sActual,
    sHead,
  };
};

/* ---- G-FORK: the READ-FORK INVENTORY, every src occurrence classed ----------- */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full)
    : full.endsWith('.ts') ? [full] : [];
});
const forkTable = (): {
  sites: { file: string; line: number; kind: string; text: string }[];
  flagForks: number; planeForks: number; pass: boolean;
} => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  for (const f of srcFiles('src')) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((text, i) => {
      const t = text.trim();
      if (!/obmMovement|obmPlane|offballMovementWeights|ObmPlane|obmPolicies|setObmPolicy/.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = /^if \(match\.obmMovement\) \{$/.test(t) ? 'FLAG_FORK_SCORE'
        : /^const obmPlane = match\.obmMovement \? match\.obmPlaneFor\(p\) : null;$/.test(t)
          ? 'FLAG_FORK_PLANE'
          : /^if \(obmPlane !== null\) target = supportSpotOnObmPlane/.test(t) ? 'PLANE_APPLY'
            : /^readonly obmMovement: boolean;$/.test(t) ? 'FIELD'
              : /^obmMovement\?: boolean;$/.test(t) ? 'CONFIG'
                : /this\.obmMovement = cfg\.obmMovement \?\? false;/.test(t) ? 'INIT'
                  : /'obmMovement'/.test(t) ? 'UNION_KEY'
                    : /^offballMovementWeights\?: number\[\];$/.test(t) ? 'GENE_DECL'
                      : /obmPolicies/.test(t) ? 'POLICY_CACHE'
                        : /^match\.setObmPolicy\(p\.gid, obm\.plane\);$/.test(t) ? 'POLICY_WRITE'
                          : /^setObmPolicy|^obmPlaneFor/.test(t) ? 'ACCESSOR'
                            : /offballMovementWeights/.test(t) ? 'GENE_RW'
                              : /ObmPlane/.test(t) ? 'TYPE'
                                : /obmPlane/.test(t) ? 'PLANE_PARAM' : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  const flagForks = sites.filter((s) => s.kind === 'FLAG_FORK_SCORE' || s.kind === 'FLAG_FORK_PLANE');
  const planeApply = sites.filter((s) => s.kind === 'PLANE_APPLY');
  return {
    sites,
    flagForks: flagForks.length,
    planeForks: planeApply.length,
    // ⭐ EXACTLY TWO flag forks, one per named read site, and exactly one place
    // where the plane is applied. Zero unclassified occurrences.
    pass: flagForks.length === 2
      && flagForks.some((s) => s.kind === 'FLAG_FORK_SCORE' && s.file.endsWith('PlayerBrain.ts'))
      && flagForks.some((s) => s.kind === 'FLAG_FORK_PLANE' && s.file.endsWith('actionExecutor.ts'))
      && planeApply.length === 1 && planeApply[0].file.endsWith('actionExecutor.ts')
      && sites.filter((s) => s.kind === 'OTHER').length === 0,
  };
};

/* ---- G-TRACE: every bound DERIVED in code from an incumbent constant --------- */
const TRACE_LINES: readonly { file: string; line: string }[] = [
  { file: 'src/ai/offballEyes.ts', line: 'export const OBM_SCORE_SPAN = 1 - OFFBALL_TIRED_MUL;' },
  { file: 'src/ai/offballEyes.ts', line: 'export const OBM_POLICY_TTL_TICKS = Math.ceil(AI_INTERVAL / DT);' },
  { file: 'src/evolution/genome.ts', line: 'export const OBM_WEIGHT_MIN = CTB_GENE_MIN;' },
  { file: 'src/evolution/genome.ts', line: 'export const OBM_WEIGHT_MAX = CTB_GENE_MAX;' },
  {
    file: 'src/evolution/genome.ts',
    line: 'export const OBM_WEIGHT_SLOTS = OBM_OUTPUT_KEYS.length * OBM_FEATURE_KEYS.length;',
  },
  { file: 'src/ai/perception.ts', line: 'return clamp01(1 - best / PRESSURE_RADIUS_M);' },
  {
    file: 'src/ai/perceptionSnapshot.ts',
    line: 'return Math.round(15 + clamp01(awarenessInput) * 45);',
  },
];
const traceGate = (): {
  pass: boolean; lines: { file: string; line: string; found: boolean }[];
  scoreSpan: number; tiredMul: number; ttlTicks: number; aiIntervalTicks: number;
  weightDomain: readonly [number, number]; ctbDomain: readonly [number, number];
  pressureRadiusM: number; retentionTicksAt08: number;
  featureKeys: readonly string[]; outputKeys: readonly string[]; weightSlots: number;
} => {
  const lines = TRACE_LINES.map((t) => ({
    ...t, found: readFileSync(t.file, 'utf8').includes(t.line),
  }));
  return {
    pass: lines.every((l) => l.found)
      && OBM_SCORE_SPAN === 1 - OFFBALL_TIRED_MUL
      && OBM_POLICY_TTL_TICKS === Math.ceil(AI_INTERVAL / DT)
      && OBM_WEIGHT_MIN === CTB_GENE_MIN && OBM_WEIGHT_MAX === CTB_GENE_MAX
      && OBM_WEIGHT_SLOTS === OBM_OUTPUT_KEYS.length * OBM_FEATURE_KEYS.length
      && PRESSURE_RADIUS_M === 6 && perceptionRetentionTicks(0.8) === 51
      // the CTB plane's own traced spans are UNTOUCHED and still the vocabulary
      && CTB_DEPTH_BIAS_SPAN === SUPPORT_LAT_CAP_FRAC && SUPPORT_LAT_PULL === 0.75,
    lines,
    scoreSpan: OBM_SCORE_SPAN,
    tiredMul: OFFBALL_TIRED_MUL,
    ttlTicks: OBM_POLICY_TTL_TICKS,
    aiIntervalTicks: AI_INTERVAL / DT,
    weightDomain: [OBM_WEIGHT_MIN, OBM_WEIGHT_MAX],
    ctbDomain: [CTB_GENE_MIN, CTB_GENE_MAX],
    pressureRadiusM: PRESSURE_RADIUS_M,
    retentionTicksAt08: perceptionRetentionTicks(0.8),
    featureKeys: OBM_FEATURE_KEYS,
    outputKeys: OBM_OUTPUT_KEYS,
    weightSlots: OBM_WEIGHT_SLOTS,
  };
};

/* ---- G-HYGIENE -------------------------------------------------------------- */
const SEAM_FILES = [
  'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/offballEyes.ts', 'src/ai/formations.ts',
  'src/ai/PlayerBrain.ts', 'src/ai/actionExecutor.ts', 'src/evolution/genome.ts',
  'src/ai/perception.ts', 'src/ai/perceptionSnapshot.ts', 'src/sim/constants.ts',
];
const hygiene = (): Record<string, boolean> => {
  const a4 = readFileSync('src/game/a4World.ts', 'utf8');
  const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
  return {
    defaultFalse: matchSrc.includes('this.obmMovement = cfg.obmMovement ?? false;'),
    absentFromA4World: !a4.includes('obmMovement') && !a4.includes('offballMovementWeights')
      && !a4.includes('obmPlane'),
    notInGeneKeys: !(GENE_KEYS as readonly string[]).includes('offballMovementWeights'),
    noEnvDoor: SEAM_FILES.every((f) => readFileSync(f, 'utf8').split('\n')
      .filter((l) => /obmMovement|offballMovement|obmPlane|OBM_/.test(l))
      .every((l) => !/envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l))),
    freshMatchOff: matchOf(1, 'absent').obmMovement === false,
    leagueMatchOff: (() => {
      const l = new League({ seed: 20260810 });
      return l.createMatch(l.nextFixture()!).obmMovement === false;
    })(),
    randomGenomeBornAbsent: (() => {
      const g = randomGenome(new Rng(99));
      return g.offballMovementWeights === undefined
        && !JSON.stringify(g).includes('offballMovement');
    })(),
  };
};

/* ---- G-PINS: the §PINS inventory's machine-checkable rows -------------------- */
const testFiles = (): string[] => readdirSync('tests').filter((f) => f.endsWith('.ts'))
  .map((f) => join('tests', f));
const pinTable = (): {
  supportSpotCallers: number; ownTestCallers: number;
  namedPins: { pin: string; file: string; needle: string; found: boolean }[];
  pass: boolean;
} => {
  const OWN = 'obmEyesSeat.test.ts';
  const count = (files: string[]): number => files.reduce((n, f) => n + (readFileSync(f, 'utf8')
    .split('\n').filter((l) => /supportSpot\(/.test(l) && !l.trim().startsWith('//')).length), 0);
  const namedPins = [
    // ⭐ the BANKED CTB PLANE's own pins — contract §4: they must still pass VERBATIM
    {
      pin: 'CTB-T0: the supportSpot SIGNATURE, pinned verbatim',
      file: 'tests/ctbSupportPlane.test.ts',
      needle: 'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {',
    },
    {
      pin: 'CTB-T0: the executor call site, pinned verbatim',
      file: 'tests/ctbSupportPlane.test.ts',
      needle: 'target = supportSpot(p, team, ball, match.ctbSupportPlane);',
    },
    {
      pin: 'CTB-T0: the depth-span derivation line, pinned verbatim',
      file: 'tests/ctbSupportPlane.test.ts',
      needle: 'export const CTB_DEPTH_BIAS_SPAN = SUPPORT_LAT_CAP_FRAC;',
    },
    {
      pin: 'CTB-T0: the two incumbent fan constants at the seam site',
      file: 'tests/ctbSupportPlane.test.ts',
      needle: 'const maxLat = radius * SUPPORT_LAT_CAP_FRAC * widthScale;',
    },
    // and the wider inventory the CTB stage itself named
    {
      pin: 'the 5v6 sanity invariant (Phase 30.5)',
      file: 'tests/cards.test.ts',
      needle: 'directional: playing a man short costs results (forced early red)',
    },
    {
      pin: 'the goal-level shape pin (heir of the mirror-goals starvation receipt)',
      file: 'tests/formations.test.ts',
      needle: 'the novel shapes play REAL football — attack both ways over a seed pool',
    },
    {
      pin: 'the production-fingerprint pin (one of thirteen)',
      file: 'tests/a4HomePriorGene.test.ts',
      needle: '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    },
    {
      pin: 'the SupportBallCarrier action-type surface',
      file: 'tests/combos.test.ts',
      needle: "type: 'SupportBallCarrier'",
    },
    {
      pin: 'the MakeRun licence surface (TeamBrain designation, UNTOUCHED)',
      file: 'tests/formations.test.ts',
      needle: 'man tracks the flank threat; zonal defends its zones and the box',
    },
  ].map((p) => ({ ...p, found: readFileSync(p.file, 'utf8').includes(p.needle) }));
  // the source lines those CTB pins assert must ALSO still be present in src
  const srcVerbatim = [
    ['src/ai/formations.ts', 'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {'],
    ['src/ai/actionExecutor.ts', 'target = supportSpot(p, team, ball, match.ctbSupportPlane);'],
    ['src/ai/formations.ts', 'export const CTB_DEPTH_BIAS_SPAN = SUPPORT_LAT_CAP_FRAC;'],
    ['src/ai/formations.ts', 'const maxLat = radius * SUPPORT_LAT_CAP_FRAC * widthScale;'],
    ['src/ai/formations.ts', 'const latPull = clamp((lane.y - ball.pos.y) * SUPPORT_LAT_PULL * widthScale, -maxLat, maxLat);'],
  ].every(([f, needle]) => readFileSync(f, 'utf8').includes(needle));
  return {
    supportSpotCallers: count(testFiles().filter((f) => !f.endsWith(OWN)
      && !f.endsWith('ctbSupportPlane.test.ts'))),
    ownTestCallers: count(testFiles().filter((f) => f.endsWith(OWN))),
    namedPins,
    pass: namedPins.every((p) => p.found) && srcVerbatim,
  };
};

/* ---- REPORTED: the dosed smoke — is the seat REACHED at scale? --------------- */
const dosedSmoke = (seed: number): {
  supportTicks: number; movedTicks: number; meanShiftMetres: number; maxShiftMetres: number;
  meanAheadIncumbent: number; meanAheadDosed: number; behindBallTicks: number;
  meanSupportMul: number; meanRunMul: number;
} => {
  const m = matchOf(seed, 'forced');
  let supportTicks = 0;
  let moved = 0;
  let sumShift = 0;
  let maxShift = 0;
  let sumAheadBase = 0;
  let sumAheadDosed = 0;
  let behind = 0;
  let sumSup = 0;
  let sumRun = 0;
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 5 !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff || p.action?.type !== 'SupportBallCarrier') continue;
        const base = supportSpot(p, t, m.ball);
        const plane = m.obmPlaneFor(p);
        if (plane === null) continue;
        const dosedPoint = supportSpotOnObmPlane(p, t, m.ball, plane);
        const policy = obmOffballPolicy(p, m, t.genome, base);
        const shift = Math.hypot(dosedPoint.x - base.x, dosedPoint.y - base.y);
        if (shift > 1e-9) moved += 1;
        sumShift += shift;
        maxShift = Math.max(maxShift, shift);
        sumAheadBase += (base.x - m.ball.pos.x) * t.attackDir;
        const ahead = (dosedPoint.x - m.ball.pos.x) * t.attackDir;
        sumAheadDosed += ahead;
        if (ahead < 0) behind += 1;
        sumSup += policy.supportMul;
        sumRun += policy.runMul;
        supportTicks += 1;
      }
    }
  }
  const n = Math.max(supportTicks, 1);
  return {
    supportTicks,
    movedTicks: moved,
    meanShiftMetres: round(sumShift / n),
    maxShiftMetres: round(maxShift),
    meanAheadIncumbent: round(sumAheadBase / n),
    meanAheadDosed: round(sumAheadDosed / n),
    behindBallTicks: behind,
    meanSupportMul: round(sumSup / n),
    meanRunMul: round(sumRun / n),
  };
};

/* ---- ⭐ REPORTED: the PERCEPT-PULL COST reading (M-OBM.4) -------------------- */
/**
 * Wall-clock, one full match per arm, in a PERCEPT-ARMED world: OFF vs ARMED-ZERO
 * vs DOSED. Each arm is run `COST_REPEATS` times and the MINIMUM is reported (the
 * least noisy statistic of a wall-clock on a shared machine). Measured, never
 * assumed — M-OBM.4 bounds the cost at the existing cadence laws and this is the
 * reading of what that bound actually costs.
 */
const COST_REPEATS = 3;
const costReading = (seed: number): {
  repeats: number; ticksPerMatch: number;
  arms: { arm: string; minMs: number; msPerTick: number }[];
  armedZeroOverheadPct: number; dosedOverheadPct: number;
} => {
  const timeOne = (arm: Arm): { ms: number; ticks: number } => {
    const m = matchOf(seed, arm);
    let ticks = 0;
    const t0 = Date.now();
    while (!m.finished) { m.step(DT); ticks += 1; }
    return { ms: Date.now() - t0, ticks };
  };
  const arms: Arm[] = ['off', 'zeroArmed', 'forced'];
  let ticks = 0;
  const rows = arms.map((arm) => {
    let best = Number.POSITIVE_INFINITY;
    for (let r = 0; r < COST_REPEATS; r++) {
      const one = timeOne(arm);
      ticks = one.ticks;
      best = Math.min(best, one.ms);
    }
    return { arm, minMs: best, msPerTick: round(best / Math.max(ticks, 1), 6) };
  });
  const off = rows[0].minMs;
  return {
    repeats: COST_REPEATS,
    ticksPerMatch: ticks,
    arms: rows,
    armedZeroOverheadPct: round(((rows[1].minMs - off) / off) * 100, 2),
    dosedOverheadPct: round(((rows[2].minMs - off) / off) * 100, 2),
  };
};

/* ========================================================================== */
/* the experiment core (run TWICE for G-DET)                                  */
/* ========================================================================== */

const runExperiment = () => {
  const rows = [] as {
    seed: number; absent: string; off: string; plain: string; plainOff: string;
    bornArmed: string; zeroArmed: string; forced: string;
    blindOff: string; blindForced: string;
    identical: boolean; plainIdentical: boolean; bornIdentical: boolean;
    zeroIdentical: boolean; diverged: boolean; blindIdentical: boolean;
  }[];
  for (let k = 0; k < N; k++) {
    const seed = BLOCK + k;
    const absent = walk(seed, 'absent');
    const off = walk(seed, 'off');
    const plain = walk(seed, 'plain');
    const plainOff = walk(seed, 'plainOff');
    const born = walk(seed, 'bornArmed');
    const zero = walk(seed, 'zeroArmed');
    const forced = walk(seed, 'forced');
    const blindOff = walk(seed, 'blindOff');
    const blindForced = walk(seed, 'blindForced');
    rows.push({
      seed, absent, off, plain, plainOff, bornArmed: born, zeroArmed: zero, forced,
      blindOff, blindForced,
      identical: absent === off,
      plainIdentical: plain === plainOff,
      bornIdentical: born === absent,
      zeroIdentical: zero === absent,
      diverged: forced !== absent,
      blindIdentical: blindForced === blindOff,
    });
  }
  return { seeds: { block: BLOCK, n: N, first: BLOCK, last: BLOCK + N - 1 }, rows };
};

/* ========================================================================== */
/* main                                                                       */
/* ========================================================================== */

process.stderr.write(`=== OBM T0 EYES-SEAT RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [obm-t0] run A digest ${digestA}\n  [obm-t0] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [obm-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ---- G-IDENT (#181.2): all THREE league-seed hashes recomputed HERE ---------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [obm-t0] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, matrix absent, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [obm-t0] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

const geometry = policyGeometry(BLOCK + N);
const epi = epiFixture(BLOCK + N);
const smoke = dosedSmoke(BLOCK + N);
const seamDraws = seamRng(BLOCK + N);
const evo = evoRng();
const fork = forkTable();
const trace = traceGate();
const hyg = hygiene();
const pins = pinTable();
process.stderr.write('  [obm-t0] REPORTED percept-pull cost reading...\n');
const cost = costReading(COST_SEED);
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  const intervals = [
    { name: 'OBM-T0 receipts + geometry/EPI/smoke read', first: BLOCK, last: BLOCK + N },
    { name: 'OBM-T0 REPORTED cost reading', first: COST_SEED, last: COST_SEED },
    { name: 'OBM-T0 test-file seeds (tests/obmEyesSeat.test.ts)', first: 12_424_900, last: 12_424_906 },
  ] as const;
  const checked = intervals.map((iv) => {
    const clashes = CONSUMED.filter((c) => !(iv.last < c.range[0] || iv.first > c.range[1]));
    return { ...iv, collisions: clashes.map((c) => c.name), pass: clashes.length === 0 };
  });
  return {
    first: BLOCK,
    last: COST_SEED,
    intervals: checked,
    consumedBlocks: CONSUMED,
    collisions: checked.flatMap((iv) => iv.collisions),
    pass: checked.every((iv) => iv.pass),
    semantics: 'EVERY interval this stage consumes is machine-checked against the COMPLETE '
      + 'consumed ledger (which now includes CTB-T1\'s 12,423,025–036 / 050–099 / 100–727 and '
      + 'CTB-T0\'s test seeds): the receipts block, the cost read, and the test file\'s own seeds.',
  };
})();

const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gZero = runA.rows.every((r) => r.zeroIdentical);
const gBite = runA.rows.every((r) => r.diverged) && geometry.lawPass;
const gBlind = runA.rows.every((r) => r.blindIdentical);
const gRng = seamDraws.pass && evo.genomesIdentical && evo.rngStateIdentical
  && evo.matrixStayedAbsent && evo.optInDraws && evo.ctbStreamUnmoved && evo.crossoverOrderHeld;
const gHygiene = Object.values(hyg).every(Boolean);

const gatesPass = gDet && gIdentPass && gOff && gBorn && gZero && gBite && epi.pass && gBlind
  && gRng && gHygiene && fork.pass && trace.pass && pins.pass && seedDisjoint.pass;

const body = {
  stage: 'OBM T0 — the dormant OFF-BALL EYES SEAT (`offballMovementWeights` / `obmMovement`)',
  ruling: '#227 (the dispatch) + #181.2 (the standing receipt rule) + #194 (gate semantics '
    + 'stated exactly) + #197-M1 (commit-free hashed body) + #200 (no predicates) + #202 '
    + '(traced bounds derived in code)',
  contract: 'docs/world-model/OFFBALL-MOVEMENT-CONTRACT.md',
  doc: 'docs/world-model/OBM-T0-DORMANT-SEAM.md',
  frozenLaw: {
    featureKeys: OBM_FEATURE_KEYS,
    outputKeys: OBM_OUTPUT_KEYS,
    weightSlots: OBM_WEIGHT_SLOTS,
    weightDomain: [OBM_WEIGHT_MIN, OBM_WEIGHT_MAX],
    scoreSpan: OBM_SCORE_SPAN,
    policyTtlTicks: OBM_POLICY_TTL_TICKS,
    pressureRadiusM: PRESSURE_RADIUS_M,
    retentionTicksAt08: perceptionRetentionTicks(0.8),
    derivation: 'features (all from the body\'s OWN perceivedSnapshot, all in [0,1]): '
      + 'f1 carrierPlight = clamp01(1 - d(nearest perceived opponent, perceived carrier) / '
      + 'PRESSURE_RADIUS_M); f2 ownMarker = the same at his own position; f3 targetCongestion = '
      + 'the same at his UNDEFORMED candidate support point; f4 readingAge = clamp01(mean '
      + 'ageTicks of his perceived opponents / perceptionRetentionTicks(awareness)). '
      + 'NO SNAPSHOT or NO PERCEIVED OPPONENT ⇒ all four EXACTLY ZERO (a blind body has no '
      + 'policy). outputs: output_o = (Σ_i w[o][i]·f_i) / OBM_FEATURE_KEYS.length ∈ [-1,1] — the '
      + 'divisor is the feature count, so the DYNAMIC term spans exactly what ONE static plane '
      + 'gene spans. composition: plane.depth = clamp(ctbSupportDepthWeight(g) + output_0, -1, 1) '
      + 'and likewise width (the banked CTB limb is the vocabulary, the static gene is the '
      + 'INTERCEPT); supportMul = 1 + output_2·OBM_SCORE_SPAN and runMul = 1 + '
      + 'output_3·OBM_SCORE_SPAN, where OBM_SCORE_SPAN IS 1 - OFFBALL_TIRED_MUL, the incumbent '
      + 'fatigue multiplier that already scales exactly these two scores. Every bound is DERIVED '
      + 'IN CODE from an incumbent constant; no number is invented and none is typed for this '
      + 'slice. ALL-ZERO weights ⇒ +0 and ×1 ⇒ today\'s world EXACTLY.',
    forcedDose: {
      matrix: FORCED_MATRIX,
      reading: 'planeDepth ← -1·carrierPlight (回撤 when the carrier is pressed) · planeWidth ← '
        + '+1·ownMarker · supportScore ← +1·carrierPlight · runScore ← -1·targetCongestion. '
        + 'Every non-zero entry is a domain corner (±1); no dose level is invented.',
    },
  },
  gates: {
    gDet: { pass: gDet, digestA, digestB },
    gIdent: {
      pass: gIdentPass, seasons: FINGERPRINT_SEASONS,
      procedure: 'new League({seed}) → runHeadless toGeneration(generation + 2) → '
        + 'sha256(JSON.stringify(out.league)) — identical to scripts/fingerprint.ts',
      semantics: 'THE RNG-STREAM RECEIPT for the sim path: these baselines were frozen from '
        + 'PRE-change code, so any draw added on the dormant path — conditional or not — would '
        + 'break them.',
      rows: gIdentRows,
    },
    xFpProd: { pass: fpRow.identical, baseline: FINGERPRINT_BASELINE, observed: fpRow.observed },
    gOff: {
      pass: gOff, seeds: N,
      semantics: 'CONFIG EQUIVALENCE ONLY (#194): flag ABSENT ≡ flag FALSE in both the '
        + 'production-shaped and the percept-armed world. Both arms execute the SAME flag-off '
        + 'code path, so this gate cannot and does not prove RNG-stream identity — G-IDENT (vs '
        + 'PRE-change baselines) plus the zero-rng seam does.',
    },
    gBorn: {
      pass: gBorn, seeds: N,
      semantics: 'THE ARMS DIFFER IN CODE PATH: armed ⇒ BOTH forks are entered, the seat PULLS '
        + 'THIS BODY\'S PERCEPT SNAPSHOT on every in-possession off-ball decision, writes a '
        + 'policy into the match cache, and the executor reads it back. Byte-identity to OFF '
        + 'therefore proves two things at once: the born-absent matrix is inert THROUGH the live '
        + 'branch, AND the percept pull itself has no side effect on any other consumer.',
    },
    gZero: {
      pass: gZero, seeds: N,
      semantics: 'THE ZERO-POINT IDENTITY: armed with the matrix PRESENT and ALL SLOTS ZERO. The '
        + 'arms differ in code path AND in gene state; byte-identity proves the additive plane '
        + 'law and the multiplicative score law are EXACTLY null at zero (+0 and ×1), i.e. '
        + 'today\'s geometry and today\'s score arithmetic are this policy\'s true centre.',
    },
    gBite: {
      pass: gBite,
      divergedSeeds: runA.rows.filter((r) => r.diverged).length,
      seeds: N,
      policyUnderForce: {
        ...geometry,
        semantics: 'REAL policies computed from REAL percepts on a live match at the forced '
          + 'corner. The checks: every feature in [0,1]; every output EQUAL to the mean of its '
          + 'weighted features (arithmetic, 1e-12); the plane EQUAL to clamp(static intercept + '
          + 'dynamic output); both score multipliers EQUAL to 1 + output·SPAN and inside the '
          + 'frozen band; the support point EQUAL to the exactly-predicted value including the '
          + 'INCUMBENT pitch clamp; and the SIGN law — this dose\'s depth output can only be '
          + '≤ 0 (a negative weight on a non-negative feature), so the seat may only ever pull '
          + 'a body BACK, never push him on, and a zero output must move him not at all.',
      },
    },
    gEpi: {
      ...epi,
      semantics: '⭐ EPISTEMIC HONESTY, PROVED NOT ASSERTED. A percept-armed match is stepped '
        + '600 ticks, every eligible body\'s features are read off his OWN snapshot, then EVERY '
        + 'BODY IS TELEPORTED 25 m WITHOUT STEPPING — so no new scan moment is recorded and his '
        + 'recorded scan frames still hold the old world. The seat, re-run through its real '
        + 'entry point, must reproduce the PERCEPT-derived features for EVERY body '
        + '(featuresMatchPercept === bodies), the truth-derived features must differ for every '
        + 'body (divergedBodies === bodies), and NOT ONE body may match the truth '
        + '(featuresMatchTruth === 0). Plus the SOURCE pin: the only member of `match` the seat '
        + 'module names is `perceivedSnapshot` (moduleMatchMembers), and no truth-scan token '
        + 'appears in its executable body (moduleBannedHits empty).',
    },
    gBlind: {
      pass: gBlind, seeds: N,
      semantics: '⭐ THE FOURTH ARMING LIMB (an ADDED gate). Fully armed AND fully dosed in a '
        + 'world with the percept trunk OFF (no edsPerceivedDefence / edsPerceivedChoice / '
        + 'stationEye ⇒ refreshPerception never runs ⇒ perceivedSnapshot is null) is '
        + 'byte-identical to that same world unarmed. A blind body has no policy — the seat '
        + 'reads NOTHING and modulates NOTHING. This is why OBM-T1\'s exam world MUST be '
        + 'percept-armed.',
    },
    gRng: {
      pass: gRng,
      seam: {
        ...seamDraws,
        semantics: 'an ARMED, fully DOSED decision (percept pull + policy + plane geometry) run '
          + 'over every outfielder of both teams on a 400-tick fixture: the match rng state is '
          + 'EXACT before and after.',
      },
      evolution: {
        ...evo,
        semantics: 'THE ARMS DIFFER: the actual shipped mutate/crossover with the opt-in OFF vs '
          + 'a faithful PRE-GENE re-implementation (GENE_KEYS only). Identical genomes AND '
          + 'identical final rng state ⇒ zero extra draws; `optInDraws` shows the opt-in path is '
          + 'live; `ctbStreamUnmoved` and `crossoverOrderHeld` show the new draws sit STRICTLY '
          + 'AFTER the ctbSupportPlane block in mutation and in crossover alike.',
      },
    },
    gHygiene: { pass: gHygiene, ...hyg },
    gFork: {
      pass: fork.pass, flagForks: fork.flagForks, planeApplySites: fork.planeForks,
      semantics: '⭐ THE READ-FORK INVENTORY (this seam has MORE than one read site, and every '
        + 'one is named): EXACTLY TWO `match.obmMovement` forks in src/** — the POLICY fork in '
        + 'PlayerBrain.decideOffBall (which feeds the two SCORE sites) and the PLANE fork in '
        + 'actionExecutor\'s SupportBallCarrier case (which feeds the single TARGET site, '
        + 'applied at exactly one statement). Every other src occurrence of the flag, the gene, '
        + 'the plane type and the policy cache is enumerated below with file:line and class, '
        + 'zero unclassified.',
      sites: fork.sites,
    },
    gTrace: {
      ...trace,
      semantics: 'every bound of this slice is DERIVED IN CODE from an INCUMBENT constant and '
        + 'each declaration line is matched VERBATIM, so no number can be re-typed as a literal '
        + 'or drift from the family it was taken from: the score span from the off-ball fatigue '
        + 'multiplier, the weight domain from the CTB plane\'s own signed domain, the read '
        + 'cadence cap from AI_INTERVAL/DT, the matrix size from the two named key lists, the '
        + 'proximity normaliser from pressureAt\'s own radius and the staleness normaliser from '
        + 'the perception trunk\'s own retention horizon. The banked CTB spans are asserted '
        + 'UNTOUCHED in the same breath.',
    },
    gPins: {
      pass: pins.pass, supportSpotCallers: pins.supportSpotCallers,
      ownTestCallers: pins.ownTestCallers, namedPins: pins.namedPins,
      semantics: 'THE PIN INVENTORY, machine-checked. ⭐ The first four rows are the BANKED CTB '
        + 'PLANE\'s own verbatim source pins (contract §4: they must still pass unchanged) — '
        + 'which is exactly why the OBM plane read is a SECOND ENTRY POINT rather than a fifth '
        + 'parameter on `supportSpot`. The remaining rows are the wider inventory CTB-T0 named. '
        + 'Nothing was renegotiated to make this stage pass; the behavioural guards '
        + '(interception ceiling, clump, offside) are OBM-T1\'s named guards, not T0 pins.',
    },
    seedDisjoint,
    allPass: gatesPass,
  },
  reported: {
    dosedSmoke: {
      note: 'REPORTED, observation-only, ONE forced match at the policy corner, sampled every 5 '
        + 'ticks over bodies actually holding the SupportBallCarrier action. No control, no CI, '
        + 'no dose curve, no ANSWER — the POLICY EXAM is OBM-T1\'s and these numbers adjudicate '
        + 'nothing.',
      seed: BLOCK + N,
      ...smoke,
    },
    perceptPullCost: {
      note: '⭐ REPORTED, the M-OBM.4 cost reading, MEASURED not assumed. Wall-clock over one '
        + 'full match per arm in a PERCEPT-ARMED world, minimum of 3 repeats. It is a wall-clock '
        + 'on a shared machine: it is used in NO rate, bounds nothing, and is context for the '
        + 'commander only. The mechanism it prices: the seat pulls ONE percept snapshot per '
        + 'in-possession off-ball decision (AI_INTERVAL cadence), and the executor — which runs '
        + 'every tick — pulls NONE, re-using the cached plane inside OBM_POLICY_TTL_TICKS.',
      seed: COST_SEED,
      ...cost,
    },
  },
  result: runA,
};
/** ⭐ #181.2 + #197-M1: `resultSha256` hashes ONLY the timing-free AND commit-free
 *  body, so a third party re-deriving it at ANY later commit gets the same hash.
 *  `head`, wall-clock and the artifact path ride the envelope, unhashed. */
const hashedBody = {
  ...body,
  reported: {
    ...body.reported,
    // ⚠ the cost reading is WALL-CLOCK: it cannot live inside a re-derivable hash.
    perceptPullCost: { note: body.reported.perceptPullCost.note, seed: COST_SEED },
  },
};
const resultSha256 = createHash('sha256').update(canonical(hashedBody)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  wallMsContextOnly: wallMs,
  headContextOnly: head,
  artifactPathContextOnly: OUT_PATH,
  headNote: 'CONTEXT ONLY, and OUTSIDE resultSha256 (⚠ #197-M1): the git short-hash of the tree '
    + 'this run observed. Embedding it in the hashed body would make the receipt un-re-derivable '
    + 'at any later commit.',
  hashNote: 'resultSha256 covers the body with the WALL-CLOCK cost numbers replaced by their '
    + 'note and seed — timings are machine-dependent and would make the hash un-re-derivable. '
    + 'Every GATE input is inside the hash.',
}, null, 2)}\n`);

const o = (s: string): void => { process.stdout.write(`${s}\n`); };
o('');
o(`=== OBM T0 EYES-SEAT RECEIPTS — head ${head} (context only) — ${N} seeds, block ${BLOCK} ===`);
o(`G-IDENT (3 league seeds, computed here) ${gIdentPass ? 'PASS' : 'FAIL'}`);
for (const r of gIdentRows) {
  o(`  seed ${String(r.seed).padStart(9)} ${r.observed} ${r.identical ? 'IDENTICAL' : '*** DIFFERS ***'}`);
}
o(`G-OFF ${gOff ? 'PASS' : 'FAIL'} · G-BORN ${gBorn ? 'PASS' : 'FAIL'} · G-ZERO ${gZero ? 'PASS' : 'FAIL'}`
  + ` · G-BITE ${gBite ? 'PASS' : 'FAIL'} · G-EPI ${epi.pass ? 'PASS' : 'FAIL'}`
  + ` · G-BLIND ${gBlind ? 'PASS' : 'FAIL'} · G-RNG ${gRng ? 'PASS' : 'FAIL'}`
  + ` · G-HYGIENE ${gHygiene ? 'PASS' : 'FAIL'} · G-FORK ${fork.pass ? 'PASS' : 'FAIL'}`
  + ` · G-TRACE ${trace.pass ? 'PASS' : 'FAIL'} · G-PINS ${pins.pass ? 'PASS' : 'FAIL'}`
  + ` · G-SEED ${seedDisjoint.pass ? 'PASS' : 'FAIL'} · G-DET ${gDet ? 'PASS' : 'FAIL'}`);
o(`FROZEN LAW: ${OBM_FEATURE_KEYS.length} features × ${OBM_OUTPUT_KEYS.length} outputs = `
  + `${OBM_WEIGHT_SLOTS} weights in [${OBM_WEIGHT_MIN}, ${OBM_WEIGHT_MAX}] · score span `
  + `${OBM_SCORE_SPAN} (= 1 − OFFBALL_TIRED_MUL ${OFFBALL_TIRED_MUL}) · policy TTL `
  + `${OBM_POLICY_TTL_TICKS} ticks (= ceil(AI_INTERVAL/DT)) · pressure radius ${PRESSURE_RADIUS_M} m`);
o(`POLICY GEOMETRY (${geometry.samples} samples): features mean [${geometry.featureMeans.join(', ')}]`);
o(`  plane depth ${geometry.planeDepthMean} · width ${geometry.planeWidthMean}`
  + ` · supportMul ${geometry.supportMulMean} · runMul ${geometry.runMulMean}`);
o(`  ahead ${geometry.meanIncumbentAheadMetres} → ${geometry.meanDosedAheadMetres} m`
  + ` · moved ${geometry.movedSamples}/${geometry.samples}`
  + ` · behind-ball ${geometry.incumbentBehindBallSamples} → ${geometry.behindBallSamples}`
  + ` · violations ${JSON.stringify(geometry.lawViolations)}`);
o(`G-EPI: ${epi.bodies} bodies · percept-matched ${epi.featuresMatchPercept}`
  + ` · truth-matched ${epi.featuresMatchTruth} · diverged ${epi.divergedBodies}`
  + ` · module match members [${epi.moduleMatchMembers.join(', ')}]`);
o(`G-RNG seam: rng ${seamDraws.before} → ${seamDraws.after} over ${seamDraws.calls} armed dosed decisions`);
o(`FORK TABLE: ${fork.flagForks} flag fork(s), ${fork.planeForks} plane-apply site(s), `
  + `${fork.sites.length} src occurrence(s) total`);
o(`PIN INVENTORY: ${pins.namedPins.filter((p) => p.found).length}/${pins.namedPins.length} named pins present `
  + `(incl. the 4 BANKED CTB verbatim pins) · pre-existing supportSpot callers in tests/** `
  + `${pins.supportSpotCallers} · own file ${pins.ownTestCallers}`);
o(`REPORTED smoke: ${smoke.supportTicks} support ticks · moved ${smoke.movedTicks}`
  + ` · mean shift ${smoke.meanShiftMetres} m (max ${smoke.maxShiftMetres})`
  + ` · mean ahead ${smoke.meanAheadIncumbent} → ${smoke.meanAheadDosed} m`
  + ` · behind-ball ${smoke.behindBallTicks} · supportMul ${smoke.meanSupportMul} · runMul ${smoke.meanRunMul}`);
o(`⭐ REPORTED percept-pull cost (min of ${cost.repeats}, ${cost.ticksPerMatch} ticks/match):`);
for (const a of cost.arms) o(`  ${a.arm.padEnd(10)} ${String(a.minMs).padStart(6)} ms`);
o(`  armed-zero overhead ${cost.armedZeroOverheadPct}% · dosed overhead ${cost.dosedOverheadPct}%`);
o(`resultSha256 ${resultSha256}`);
o(`GATES ${gatesPass ? 'PASS' : '*** FAIL ***'} — artifact ${OUT_PATH}`);
if (!gatesPass) process.exitCode = 1;
