// A4-P1b — THE INTERVENTIONAL FORK-AND-ABANDON CENSUS (the CAUSAL price of the
// index-1 rest-defence DESIGNATION POLICY, in goal-value units).
//
// Authority: docs/world-model/A4-P1B-ABANDON-CENSUS.md (the FROZEN pre-registration) +
// ruling #133 (the user rules #129.4 = A; A4-P1b authorized; the eight binding constraints
// #133.2.i–viii) + the A4-ASSIGNMENT-CONTRACT §4 estimand family under §3 I-A1..I-A7.
// The observational A4-P1 census STOPPED resolvedly-negative because ENDOGENEITY (#129): the
// incumbent hard-codes the job (PlayerBrain.ts:1176), so TRUE functional absence never occurs on
// the world's own variation. This probe CREATES that counterfactual with a paired same-seed fork:
//   • branch A = the world AS-IS (the incumbent rest-defence policy intact);
//   • branch B = the DESIGNATION DISABLED for side d (Match.abandonRestDesignation = d) — BOTH
//     in-possession faces stop binding (the PlayerBrain support-fan exclusion + the formations
//     in-possession clamp); the out-of-possession sweeper face untouched; the DF is FROZEN NOWHERE
//     (STATUE-safe: he keeps his base spot + ordinary support scoring, minus the special law).
// The policy PRICE for a fork = the excess downstream opponent concession goal-value that side d
// suffers in branch B over branch A, priced through the ADMITTED P1 surrogates over a pinned
// horizon. The paired same-seed difference is the policy's CAUSAL effect (identical pre-fork
// states; the branches differ in EXACTLY the policy and nothing else) — it defeats the #129
// endogeneity. #106.6: P1b is the SECOND instrument on this question; a THIRD needs a user ruling.
//
// It REUSES, VERBATIM in logic:
//   • the P1-calibration surrogate detectors (scripts/probes/stage3-v4-p1-calibration.ts:326-344),
//     exactly as the A4-P1 vacancy census reused them: opponent deep entry (opp owns AND ball in
//     d's own third, on the null→true transition) and opponent box entry (opp owns AND ball in d's
//     box), scored per DEFENDING side d.
//   • the ADMITTED P1 prices (STAGE3-V4-P1-CALIBRATION §RESULT, reading B): deep entry L = 0.043455
//     [0.030790, 0.055817] PRIMARY (the #127 disposition carries); box entry L = 0.195217
//     [0.166228, 0.223515] parallel; shot-against BANNED (dropped non-monotone at P1).
//   • the P1 match-cluster bootstrap engine (clusterCI, cluster = match seed).
//   • the P2b paired-fork idiom (cloneSimulationState — an INDEPENDENT deep copy per branch; the
//     parent match is NEVER stepped inside the fork; X-FORK-IDENT on the as-is branch).
//
// THE SEAM (dormant, ruling #133.2.ii). Match.abandonRestDesignation (0|1|null; null in every
// production path). It is SET ONLY here, on branch B's clone. The flag-off byte-identity is proven
// by tests/a4RestAbandon.test.ts; the production fingerprint 57b0bdab…c673 is unchanged (X-FP-PROD).
// src IS touched by this step (the dormant seam) so git diff src is NON-empty BY DESIGN — Road B is
// proven by (1) flag-off byte-identity + (2) the unchanged fingerprint, NOT by an empty src diff.
//
// FORK SAMPLING (prereg §2.1). During a base enriched eye-null match, a fork QUALIFIES iff phase is
// playing AND the ball is owned AND simTime − lastForkTime ≥ FORK_SPACING_S (=4.0 s, the P2b
// cadence). Fork side d = owner.side (the side in possession, whose rest defence is exposed on the
// coming turnover); both sides eligible. A per-match cap FORK_CAP_PER_MATCH (=40) bounds wall.
//
// HORIZON + ACCRUAL (DOSE) LADDER (prereg §2.3). After t_fork count opponent deep/box entries
// suffered by d in (t_fork, t_fork + W], per branch, seeded from the shared fork-start state (only
// NEW entries within W count). PRIMARY W = 10 s (the certified P0b concede horizon); the accrual
// (dose) ladder is W ∈ {10, 20, 30} s (30 s = P1/P2b W_cal). Fork price at W (deep) =
// (nDeepB(W) − nDeepA(W))·L_DEEP.
//
// THE FROZEN GATE (prereg §4; smoke data may NOT inform it). PASS to A4-P2 requires ALL of:
//   (i)   RESOLVED — the pooled paired policy price P* (deep-priced, W=10, B − A, match-cluster
//         bootstrap CI) has CI lower bound > 0.
//   (ii)  MONOTONE — over the accrual ladder W ∈ {10,20,30} s, the pooled deep-priced price is
//         NON-DECREASING in the point estimates: c_10 ≤ c_20 ≤ c_30.
//   (iii) LADDER RESOLVED — the (W30 − W10) ACCRUAL contrast match-cluster CI lower bound > 0.
//   Any leg fails ⇒ STOP at A4-P1b (return to the user). PLUS the #127 tightening: a Simpson-genre
//   SIGN REVERSAL on the primary cell (pooled vs fork-context-standardized) is an AUTOMATIC
//   NOT-ADVANCE (reading E). The gate reads the POOLED primary cell; the context stratification is a
//   HETEROGENEITY exhibit under same-seed pairing (NOT a confound repair, §4.1).
//
// TWO MODES (explicit A4P1B_MODE, NO default):
//   smoke   — 40 matches @ 11,850,000 + k, enriched eye-null, full paired forks, X-DET double-run.
//             Publishes the realized fork populations / cap-binding / fork-context strata / E-ENDED
//             exclusions / pooled price σ̂ / per-match wall INCLUDING forks, and the FROZEN N
//             arithmetic. Writes a4-p1b-abandon-census-sizing-smoke.json.
//   census  — A4P1B_N matches @ 11,900,000 + k, the gate-bearing run: the pooled primary price +
//             the accrual ladder + the fork-context Simpson exhibit + the raw event-rate deltas +
//             the box parallel + X-family + X-DET double-run. Writes a4-p1b-abandon-census.json.
//             Detached, the commander's resident (#49.5).
//
// N RULE (frozen §5): N* = the smallest 200-step match count at which the smoke-measured pooled
// price SE_N resolves the primary MDL at ~95 % power, CAPPED at N_MAX. N_MAX is WALL-DERIVED at the
// smoke (largest 200-step N whose projected total wall — N × per-match wall INCLUDING forks × 2 for
// X-DET — ≤ 12 h), hard-capped at 8,000 (keeps the census band strictly inside 11.81M–12.3M).
// Attainability-knee: a gate-bearing cell too rare to resolve reads UNRESOLVED ⇒ the gate STOPS. N
// fixed before the run; no optional stopping (#105.4).
//
// SEEDS (frozen §6, inside the remaining 11.81M–12.3M reservation #133.2.vi, disjoint from the
// P1-consumed 11.70M/11.80M): smoke 11.85M (k 0..39); census 11.90M (k 0..N−1). Stats: bootstrap
// 100203; 100303 reserved-unused. Bootstrap B=2000.
//
// COMMAND LINES:
//   smoke:   A4P1B_MODE=smoke npx tsx scripts/probes/a4-p1b-abandon-census.ts
//   census:  A4P1B_MODE=census A4P1B_N=<disclosed N* from the smoke> \
//            npx tsx scripts/probes/a4-p1b-abandon-census.ts
//   preflight (bounded; writes OUTSIDE the repo, NOT a verdict):
//     A4P1B_MODE=smoke A4P1B_CAP=3 A4P1B_FORK_CAP=3 A4P1B_OUT=/tmp/x.json A4P1B_SKIP_FP=1 \
//       npx tsx scripts/probes/a4-p1b-abandon-census.ts
//
// ENV KNOBS (preflight only; the two real runs touch only A4P1B_MODE and — census — A4P1B_N):
//   A4P1B_CAP (cap the match count ⇒ IS_PREFLIGHT: never writes the canonical JSON), A4P1B_N (census
//   count, REQUIRED in census, capped at N_MAX), A4P1B_FORK_CAP (cap forks/match — preflight only),
//   A4P1B_OUT (redirect output), A4P1B_SKIP_DET=1 (skip the X-DET second run), A4P1B_SKIP_FP=1 (skip
//   the fingerprint — preflight only), A4P1B_SEED_BASE (shift the seed base, ONLY under a preflight cap).

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING (prereg §2/§3/§4/§5/§6) — every constant pinned before any run.
// =============================================================================
// Seed families: smoke 11.85M / census 11.90M, inside the remaining 11.81M–12.3M reservation (#133.2.vi).
const CENSUS_SEED_BASE = 11_900_000; // census: 11,900,000 + k, k∈0..N−1 (N ≤ 8,000 ⇒ ≤ 11,907,999)
const SMOKE_SEED_BASE = 11_850_000; // smoke: 11,850,000 + k, k∈0..39
const SMOKE_MATCHES = 40; // the frozen sizing-smoke corpus size
const RESERVED_BAND = [11_810_000, 12_300_000] as const; // the remaining A4-slice-1 reservation (#133.2.vi)
// the P1-consumed blocks (§6): the disjointness gate also asserts disjointness from these.
const P1_SMOKE_RANGE = [11_700_000, 11_700_039] as const;
const P1_CENSUS_RANGE = [11_800_000, 11_807_999] as const;

// the match-cluster bootstrap (#20) — stats seeds from 100203 (prereg §6).
const BOOTSTRAP_SEED = 100_203;
const BOOTSTRAP_RESAMPLES = 2_000;
const STATS_SEED_RESERVED = 100_303; // reserved-unused (no dispersion/permutation statistic; prereg §6)

// the ADMITTED P1 prices (STAGE3-V4-P1-CALIBRATION §RESULT, reading B; goal-value units).
// shot-against BANNED (non-monotone at P1). deep = PRIMARY pricing surrogate; box = parallel.
const L_DEEP = 0.043455; // opponent deep entry lift [0.030790, 0.055817]
const L_BOX = 0.195217; // opponent box entry lift  [0.166228, 0.223515]
const L_DEEP_CI = [0.030790, 0.055817] as const;
const L_BOX_CI = [0.166228, 0.223515] as const;

// horizon + accrual (dose) ladder (prereg §2.3): PRIMARY 10 s; ladder {10,20,30} s.
const W_PRICE_PRIMARY_S = 10;
const W_LADDER_S = [10, 20, 30] as const;
type WKey = 10 | 20 | 30;
const W_MAX_S = 30;
const W_MAX_TICKS = Math.round(W_MAX_S / DT);
const W_TICKS: Record<WKey, number> = { 10: Math.round(10 / DT), 20: Math.round(20 / DT), 30: Math.round(30 / DT) };

// fork sampling (prereg §2.1)
const FORK_SPACING_S = 4.0; // the P2b census cadence
const FORK_CAP_PER_MATCH = 40; // wall guard (the smoke reports whether it binds)

// surrogate geometry (P1 :326-344 VERBATIM), reused exactly as the A4-P1 census did.
const REST_THIRD = HALF_L / 3; // own-third depth (I5 / P1 / battery, verbatim)
const BOX_INNER_X = -(HALF_L - BOX_DEPTH); // box outer edge in the team's attack-local frame (P1 D3)

// the frozen N arithmetic (prereg §5). MDL for the price mirrors P1's min(0.5·|price|, 0.01).
const MDL_ABS = 0.01; // goal-value units
const POWER_Z = 3.605; // z_.975 + z_.95 (two-sided 95 % CI at 95 % power) — battery §6.1 form
const Z_975 = 1.96;
const N_STEP = 200; // fixed-step N grid
const N_CAP = 8_000; // hard N cap (keeps the census band inside the reserved freeze)
const WALL_BUDGET_HOURS = 12;
const WALL_BUDGET_MS = WALL_BUDGET_HOURS * 3600 * 1000;
const XDET_FACTOR = 2;

// X-FP-PROD — the frozen shipped-world production fingerprint (P1/battery verbatim).
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

// the ENRICHED census world (#67.3; the world the P1 prices were calibrated on) — eye NULL,
// abandonRestDesignation NULL in the base run (the counterfactual is created ONLY in branch B).
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const RECEIPT_CAP = 1_000; // per-class receipts cap (#49.3), first-N deterministic
const CONTEXTS = ['own', 'mid', 'their'] as const; // fork-third context strata (§4.1)
type Context = (typeof CONTEXTS)[number];

// =============================================================================
// ENV / MODE (prereg §7). Two REAL modes (smoke, census); a bounded preflight caps either.
// =============================================================================
const MODE = process.env.A4P1B_MODE;
if (MODE !== 'smoke' && MODE !== 'census') {
  console.error('A4-P1b FATAL — A4P1B_MODE must be "smoke" or "census" (see the header command lines).');
  process.exit(2);
}
const CAP = process.env.A4P1B_CAP ? Math.max(1, Number.parseInt(process.env.A4P1B_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(CAP);
const FORK_CAP = (IS_PREFLIGHT && process.env.A4P1B_FORK_CAP)
  ? Math.max(1, Number.parseInt(process.env.A4P1B_FORK_CAP, 10)) : FORK_CAP_PER_MATCH;
const SKIP_DET = process.env.A4P1B_SKIP_DET === '1';
const SKIP_FP = process.env.A4P1B_SKIP_FP === '1'; // preflight only
const N_ENV = process.env.A4P1B_N ? Math.max(1, Number.parseInt(process.env.A4P1B_N, 10)) : null;
if (MODE === 'census' && N_ENV === null) {
  console.error('A4-P1b FATAL — census mode requires A4P1B_N (the census match count pinned from the smoke arithmetic).');
  process.exit(2);
}
const N_CENSUS = MODE === 'census' ? Math.min(N_ENV as number, N_CAP) : 0;
const FROZEN_BASE = MODE === 'smoke' ? SMOKE_SEED_BASE : CENSUS_SEED_BASE;
const SEED_BASE = (IS_PREFLIGHT && process.env.A4P1B_SEED_BASE)
  ? Math.max(0, Number.parseInt(process.env.A4P1B_SEED_BASE, 10)) : FROZEN_BASE;
const PLANNED_MATCHES = MODE === 'smoke' ? SMOKE_MATCHES : N_CENSUS;
const MATCH_COUNT = IS_PREFLIGHT ? Math.min(PLANNED_MATCHES, CAP) : PLANNED_MATCHES;
const SMOKE_OUT = 'docs/world-model/data/a4-p1b-abandon-census-sizing-smoke.json';
const CENSUS_OUT = 'docs/world-model/data/a4-p1b-abandon-census.json';
// SAFETY (P2b idiom): a preflight NEVER writes the canonical JSON unless A4P1B_OUT is set explicitly.
const OUT_PATH = process.env.A4P1B_OUT
  ?? (IS_PREFLIGHT ? '/tmp/a4p1b-preflight.json' : (MODE === 'smoke' ? SMOKE_OUT : CENSUS_OUT));

// =============================================================================
// SMALL NUMERIC HELPERS (P1 / battery verbatim where shared).
// =============================================================================
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const sumBy = <T>(xs: readonly T[], f: (x: T) => number): number => xs.reduce((s, x) => s + f(x), 0);
const pct = (sorted: readonly number[], q: number): number => (sorted.length === 0
  ? Number.NaN
  : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]);
const sampleSd = (xs: readonly number[]): number => {
  const f = xs.filter(Number.isFinite);
  if (f.length < 2) return Number.NaN;
  const m = f.reduce((s, x) => s + x, 0) / f.length;
  const v = f.reduce((s, x) => s + (x - m) * (x - m), 0) / (f.length - 1);
  return Math.sqrt(v);
};
// standard normal CDF (Abramowitz–Stegun; battery phi), for the projected-power read.
const phi = (z: number): number => {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592)
    * t * Math.exp(-(z * z) / 2);
  return Math.min(1, Math.max(0, 0.5 * (1 + Math.sign(z) * y)));
};

// --- per-record receipts (#49.3), capped, first-N deterministic --------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook | null, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  if (book === null) return;
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// =============================================================================
// THE ENRICHED MATCH FIXTURE (= the census world; P1 verbatim). Eye NULL; abandon NULL.
// =============================================================================
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), ...CENSUS_FLAGS,
});

// the harness-identity signature (P2b verbatim) — for X-FORK-IDENT.
const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const contextOf = (lx: number): Context => (lx < -REST_THIRD ? 'own' : lx > REST_THIRD ? 'their' : 'mid');

// =============================================================================
// ONE BRANCH (prereg §2.2/§3) — clone the base, optionally ABANDON side d, step W_MAX_TICKS,
// count opponent deep/box entries AGAINST d over the accrual ladder (seeded from the shared
// fork-start state ⇒ only NEW entries within W count; identical seeding across branches).
// =============================================================================
interface BranchOut {
  nDeep: Record<WKey, number>;
  nBox: Record<WKey, number>;
  ended: boolean; // the match finished within W_MAX (truncated horizon ⇒ the pair is excluded)
  signature: string; // W_MAX signature (as-is branch ⇒ X-FORK-IDENT target)
}

const runBranch = (
  base: Match, d: Side, abandon: boolean, seed: number, decisionTick: number,
  label: 'A' | 'B', receipts: ReceiptBook | null,
): BranchOut => {
  const fork = cloneSimulationState(base);
  if (abandon) fork.abandonRestDesignation = d; // the counterfactual, on THIS clone only
  const mine = fork.teams[d];
  const startTick = fork.simTick;

  // seed the entry-transition prev-state from the SHARED fork-start state (P2b F3).
  const ball0 = fork.ball;
  const owner0 = ball0.owner;
  const oppOwns0 = owner0 !== null && owner0.side !== d;
  const lx0 = mine.localX(ball0.pos.x);
  let deepPrev = oppOwns0 && fork.phase === 'playing' && lx0 < -REST_THIRD;
  let boxPrev = oppOwns0 && fork.phase === 'playing' && lx0 <= BOX_INNER_X && Math.abs(ball0.pos.y) <= BOX_WIDTH / 2;

  const nDeep: Record<WKey, number> = { 10: 0, 20: 0, 30: 0 };
  const nBox: Record<WKey, number> = { 10: 0, 20: 0, 30: 0 };
  let ended = false;

  while (!fork.finished && fork.simTick - startTick < W_MAX_TICKS) {
    fork.step(DT);
    if (fork.finished) { ended = true; break; } // truncated horizon
    const offset = fork.simTick - startTick; // ticks since the fork (≥ 1)
    const playing = fork.phase === 'playing';
    const owner = fork.ball.owner;
    const oppOwns = owner !== null && owner.side !== d;
    const lx = mine.localX(fork.ball.pos.x);
    const deepNow = oppOwns && playing && lx < -REST_THIRD;
    if (deepNow && !deepPrev) {
      for (const W of W_LADDER_S) if (offset <= W_TICKS[W]) nDeep[W] += 1;
      addReceipt(receipts, 'deep-entry-against', seed, decisionTick, owner?.gid ?? -1, `branch${label} d${d} lx=${round(lx, 2)}`);
    }
    deepPrev = deepNow;
    const boxNow = oppOwns && playing && lx <= BOX_INNER_X && Math.abs(fork.ball.pos.y) <= BOX_WIDTH / 2;
    if (boxNow && !boxPrev) {
      for (const W of W_LADDER_S) if (offset <= W_TICKS[W]) nBox[W] += 1;
      addReceipt(receipts, 'box-entry-against', seed, decisionTick, owner?.gid ?? -1, `branch${label} d${d} lx=${round(lx, 2)}`);
    }
    boxPrev = boxNow;
  }
  return { nDeep, nBox, ended, signature: signatureOf(fork) };
};

// =============================================================================
// THE RAW COLLECTION per match: sample fork moments, run the paired branches (+ X-FORK-IDENT),
// admit the pair (exclude E-ENDED either branch), record the paired policy price per fork.
// =============================================================================
interface ForkRec {
  d: Side;
  context: Context;
  gid: number; // the abandoned (index-1) body gid
  tEnd: number;
  dDeep: Record<WKey, number>; // nDeepB(W) − nDeepA(W)
  dBox: Record<WKey, number>;
}
interface CensusRow {
  seed: number;
  forks: ForkRec[]; // admitted paired forks only (the priced population)
  drops: { ended: number };
  counts: { qualifying: number; forked: number; capSkipped: number };
  xForkChecked: number;
  xForkMismatched: number;
}

const runCensusMatch = (seed: number, receipts: ReceiptBook | null): CensusRow => {
  const m = matchOf(seed); // enriched flags; stationEye + abandonRestDesignation NULL (base run)
  const forks: ForkRec[] = [];
  let endedDrops = 0; let qualifying = 0; let forked = 0; let capSkipped = 0;
  let xForkChecked = 0; let xForkMismatched = 0;
  let lastForkTime = -Infinity;
  let forksThisMatch = 0;

  while (!m.finished) {
    const owner = m.ball.owner;
    const qualifies = m.phase === 'playing' && owner !== null
      && m.simTime - lastForkTime >= FORK_SPACING_S;
    if (!qualifies) { m.step(DT); if (m.finished) break; continue; }
    qualifying += 1;
    lastForkTime = m.simTime; // reset on EVERY qualifying moment (P2b/V3-P0 placement)
    if (forksThisMatch >= FORK_CAP) { capSkipped += 1; m.step(DT); if (m.finished) break; continue; }

    const d = owner!.side as Side;
    const mine = m.teams[d];
    const body = mine.players.find((p) => p.index === 1 && !p.sentOff);
    const context = contextOf(mine.localX(m.ball.pos.x));
    const decisionTick = m.simTick;
    const gid = body?.gid ?? -1;

    // the paired branches, each an INDEPENDENT deep clone of the SAME base state (the parent m is
    // never stepped inside the fork). branch A = as-is; branch B = designation abandoned for d.
    const branchA = runBranch(m, d, false, seed, decisionTick, 'A', receipts);
    const branchB = runBranch(m, d, true, seed, decisionTick, 'B', receipts);
    forked += 1;
    forksThisMatch += 1;

    // X-FORK-IDENT (HARD, 100% coverage): an INDEPENDENT plain clone stepped W_MAX must be
    // byte-identical to the as-is branch — proves the fork perturbs nothing (zero leakage).
    const plain = cloneSimulationState(m);
    for (let i = 0; i < W_MAX_TICKS && !plain.finished; i++) plain.step(DT);
    xForkChecked += 1;
    if (signatureOf(plain) !== branchA.signature) xForkMismatched += 1;

    // ADMISSION (§3): exclude the pair iff either branch ENDED within W_MAX (truncated horizon).
    if (branchA.ended || branchB.ended) {
      endedDrops += 1;
      addReceipt(receipts, 'fork-excluded-ended', seed, decisionTick, gid, `d${d} ctx=${context}`);
    } else {
      forks.push({
        d, context, gid, tEnd: m.simTime,
        dDeep: { 10: branchB.nDeep[10] - branchA.nDeep[10], 20: branchB.nDeep[20] - branchA.nDeep[20], 30: branchB.nDeep[30] - branchA.nDeep[30] },
        dBox: { 10: branchB.nBox[10] - branchA.nBox[10], 20: branchB.nBox[20] - branchA.nBox[20], 30: branchB.nBox[30] - branchA.nBox[30] },
      });
      addReceipt(receipts, 'fork', seed, decisionTick, gid, `d${d} ctx=${context}`);
    }

    m.step(DT); // the parent continues, unperturbed
    if (m.finished) break;
  }
  return {
    seed, forks, drops: { ended: endedDrops },
    counts: { qualifying, forked, capSkipped }, xForkChecked, xForkMismatched,
  };
};

// =============================================================================
// STATISTICS — the match-cluster bootstrap (#20), P1 engine (BOOTSTRAP_SEED=100203).
// The price statistic is a MEAN OVER FORKS; the resample unit is the MATCH (cluster).
// =============================================================================
type ForkFilter = (f: ForkRec) => boolean;
type ForkValue = (f: ForkRec) => number;
const allF: ForkFilter = () => true;
const gvDeep = (W: WKey): ForkValue => (f) => f.dDeep[W] * L_DEEP;
const gvBox = (W: WKey): ForkValue => (f) => f.dBox[W] * L_BOX;
const rawDeep = (W: WKey): ForkValue => (f) => f.dDeep[W];
const rawBox = (W: WKey): ForkValue => (f) => f.dBox[W];
const accrualDeep: ForkValue = (f) => (f.dDeep[30] - f.dDeep[10]) * L_DEEP; // the (W30−W10) accrual

// mean of `value` over forks passing `filter`, match-cluster bootstrap CI (resample MATCHES).
const meanCI = (
  rows: readonly CensusRow[], filter: ForkFilter, value: ForkValue, offset: number,
): { point: number; lower: number; upper: number; n: number } => {
  const stat = (sample: readonly CensusRow[]): number => {
    let sum = 0; let n = 0;
    for (const r of sample) for (const f of r.forks) if (filter(f)) { sum += value(f); n += 1; }
    return n === 0 ? Number.NaN : sum / n;
  };
  const point = stat(rows);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  const nRows = rows.length;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const sample: CensusRow[] = [];
    for (let i = 0; i < nRows; i++) sample.push(rows[rng.int(0, nRows - 1)]);
    const v = stat(sample);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const nForks = sumBy(rows, (r) => r.forks.filter(filter).length);
  return { point: round(point), lower: round(pct(draws, 0.025)), upper: round(pct(draws, 0.975)), n: nForks };
};

const countForks = (rows: readonly CensusRow[], filter: ForkFilter): number =>
  sumBy(rows, (r) => r.forks.filter(filter).length);

// =============================================================================
// THE POLICY-PRICE TABLE + THE FROZEN GATE (prereg §4).
// =============================================================================
const buildPrimary = (rows: readonly CensusRow[]) => {
  const W = W_PRICE_PRIMARY_S as WKey;
  const priceDeep = meanCI(rows, allF, gvDeep(W), 100); // the pooled paired policy price (gate cell)
  const priceBox = meanCI(rows, allF, gvBox(W), 101); // parallel (secondary)
  const rawDeepDelta = meanCI(rows, allF, rawDeep(W), 110);
  const rawBoxDelta = meanCI(rows, allF, rawBox(W), 111);
  return {
    wPriceS: W, pricingSurrogatePrimary: 'deep entry (rest-defence-natural, dense, avoids the deep⊃box double-count)',
    pricePooledDeep: priceDeep, pricePooledBox: priceBox,
    rawDeepRateDelta: rawDeepDelta, rawBoxRateDelta: rawBoxDelta,
    nForks: countForks(rows, allF),
  };
};

// the accrual (dose) ladder (prereg §4 monotone axis).
const buildLadder = (rows: readonly CensusRow[]) => {
  const rungCost = W_LADDER_S.map((W, i) => meanCI(rows, allF, gvDeep(W as WKey), 200 + i));
  const accrualContrast = meanCI(rows, allF, accrualDeep, 210); // (W30 − W10)
  const pts = rungCost.map((c) => c.point);
  const monotone = pts.every((v, i) => i === 0
    || !(Number.isFinite(v) && Number.isFinite(pts[i - 1]) && v < pts[i - 1]));
  return {
    axis: 'accrual (dose) horizon W (s); pooled deep-priced paired policy price (B−A) per fork',
    ladderS: W_LADDER_S, rungCost, accrualContrast, monotoneNonDecreasing: monotone,
  };
};

// the fork-context Simpson exhibit (prereg §4.1 / #94.3): raw-pool vs standardized.
const buildSimpson = (rows: readonly CensusRow[]) => {
  const W = W_PRICE_PRIMARY_S as WKey;
  const nTotal = countForks(rows, allF);
  const strata: { context: Context; n: number; price: ReturnType<typeof meanCI>; weight: number }[] = [];
  let offset = 300;
  for (const context of CONTEXTS) {
    const inStr: ForkFilter = (f) => f.context === context;
    const nStr = countForks(rows, inStr);
    if (nStr === 0) continue;
    strata.push({ context, n: nStr, price: meanCI(rows, inStr, gvDeep(W), offset++), weight: round(nStr / (nTotal || 1)) });
  }
  const finite = strata.filter((s) => Number.isFinite(s.price.point));
  const wSum = finite.reduce((a, s) => a + s.weight, 0);
  const standardizedPoint = wSum === 0 ? Number.NaN
    : finite.reduce((a, s) => a + s.weight * s.price.point, 0) / wSum;
  return {
    note: 'fork context = side d ball third at t_fork (own/mid/their). With same-seed pairing this is '
      + 'a HETEROGENEITY exhibit, NOT a confound repair (§4.1). Role is degenerate (the abandoned body '
      + 'is ALWAYS index-1 = the DF; #129.1). Standardized = Σ w_s·price_s over finite-price strata. '
      + 'The GATE binds on the pooled primary cell; a sign reversal pooled-vs-standardized is FLAGGED.',
    strata, standardizedPricePoint: round(standardizedPoint),
  };
};

// THE FROZEN GATE (prereg §4).
const evalGate = (
  primary: ReturnType<typeof buildPrimary>, ladder: ReturnType<typeof buildLadder>,
  simpson: ReturnType<typeof buildSimpson>,
) => {
  const resolved = Number.isFinite(primary.pricePooledDeep.lower) && primary.pricePooledDeep.lower > 0;
  const monotone = ladder.monotoneNonDecreasing;
  const ladderResolved = Number.isFinite(ladder.accrualContrast.lower) && ladder.accrualContrast.lower > 0;
  const pass = resolved && monotone && ladderResolved;
  const simpsonReversal = Number.isFinite(simpson.standardizedPricePoint)
    && Number.isFinite(primary.pricePooledDeep.point)
    && Math.sign(simpson.standardizedPricePoint) !== Math.sign(primary.pricePooledDeep.point);
  return {
    predicate: '(i) pooled paired deep-priced price P* (W=10, B−A) CI lower > 0 AND (ii) c_10<=c_20<=c_30 '
      + 'over the accrual ladder AND (iii) (W30−W10) accrual contrast CI lower > 0',
    resolved, monotone, ladderResolved, pass,
    simpsonSignReversalFlag: simpsonReversal,
    disposition: (pass && !simpsonReversal)
      ? 'PASS — monotone, resolvedly positive policy price. A4-P1b proceeds to A4-P2 (dormant build); commander review + numbered ruling gate the transition (#133.1).'
      : simpsonReversal
        ? 'NOT-ADVANCE (reading E, #127) — Simpson-genre sign reversal on the primary cell; RETURNS to the user with both exhibits even if the three legs pass.'
        : 'STOP AT A4-P1b — null/non-monotone/non-accruing policy price (prereg §4): no measured causal term for the M3 seam ⇒ building M1–M4 would violate I-A3. RETURNS to the user.',
  };
};

// =============================================================================
// THE SIZING SMOKE (prereg §5) — populations + realized price σ̂ + the FROZEN N arithmetic.
// The wall-derived half is computed OUTSIDE the X-DET-compared core (#128 harness repair).
// =============================================================================
interface WallArithmetic {
  perMatchWallMs: number; nMaxWall: number; nMax: number;
  nStar: number; nBinding: number; underPowered: boolean; reducedPowerDisclosure: boolean;
  projectedForksAtNStar: number; projectedPrimaryPowerAtNStar: number; note: string;
}
interface SizingRaw { sigma: number; mdl: number; forksPerMatch: number; nMatches: number }

const buildSizingCore = (rows: readonly CensusRow[]): { sizing: Record<string, unknown>; raw: SizingRaw } => {
  const W = W_PRICE_PRIMARY_S as WKey;
  const nMatches = rows.length;
  // per-match pooled price (finite matches only) → σ̂
  const perMatchPrice = rows.map((r) => {
    let sum = 0; let n = 0;
    for (const f of r.forks) { sum += gvDeep(W)(f); n += 1; }
    return n === 0 ? Number.NaN : sum / n;
  });
  const sigma = sampleSd(perMatchPrice);
  const finiteMatches = perMatchPrice.filter(Number.isFinite).length;
  const pooledPrice = meanCI(rows, allF, gvDeep(W), 100).point;
  const mdl = Math.min(0.5 * Math.abs(pooledPrice), MDL_ABS);

  const totalForks = countForks(rows, allF);
  const perMatchForks = rows.map((r) => r.forks.length);
  const strataN: Record<string, number> = {};
  for (const c of CONTEXTS) strataN[c] = countForks(rows, (f) => f.context === c);
  const capBound = rows.some((r) => r.counts.capSkipped > 0);
  const forksPerMatch = nMatches === 0 ? 0 : totalForks / nMatches;

  return {
    sizing: {
      nMatches, finiteMatchesForSigma: finiteMatches,
      populations: {
        perMatchForksMean: round(mean(perMatchForks)), totalForks,
        forkContextStrataN: strataN,
        qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
        forkedTotal: sumBy(rows, (r) => r.counts.forked),
        capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
        forkCapPerMatch: FORK_CAP, forkCapBinds: capBound,
        endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
        xForkChecked: sumBy(rows, (r) => r.xForkChecked),
        xForkMismatched: sumBy(rows, (r) => r.xForkMismatched),
      },
      pooledPrice: round(pooledPrice), sigmaPerMatchPrice: round(sigma), mdl: round(mdl),
      // DETERMINISTIC N-arithmetic fields only; the wall-derived fields are merged in at write time.
      nArithmetic: {
        mdlFormula: 'MDL = min( 0.5·|price_smoke| , 0.01 ) goal-value units',
        seFormula: 'SE_N = σ̂·√(1/N); resolve at 95 % power ⇒ SE_N ≤ MDL / 3.605 (POWER_Z)',
        nStarFormula: 'N* = smallest 200-step N with SE_N ≤ MDL/POWER_Z, capped at N_MAX',
        powerZ: POWER_Z, nStep: N_STEP, nCap: N_CAP, wallBudgetHours: WALL_BUDGET_HOURS,
        note: 'per-fork vs per-match accounting: the price statistic is a MEAN OVER FORKS; the resample/σ̂ unit is the MATCH.',
      },
    },
    raw: { sigma, mdl, forksPerMatch, nMatches },
  };
};

// FROZEN N arithmetic — the WALL-DERIVED half (per-match wall INCLUDING forks; #128: OUTSIDE the
// X-DET-compared core). The FORMULA is unchanged; only its COMPUTATION LOCATION is out-of-band.
const computeWallArithmetic = (raw: SizingRaw, perMatchWallMs: number): WallArithmetic => {
  const { sigma, mdl, forksPerMatch } = raw;
  const wallStepN = (n: number): number => n * perMatchWallMs * XDET_FACTOR;
  let nMaxWall = 0;
  for (let n = N_STEP; n <= N_CAP; n += N_STEP) { if (wallStepN(n) <= WALL_BUDGET_MS) nMaxWall = n; }
  const nMax = Math.min(nMaxWall === 0 ? N_STEP : nMaxWall, N_CAP);

  let nStar: number; let underPowered = false; let note = 'resolvable at N* ≤ N_MAX';
  if (!Number.isFinite(sigma) || !Number.isFinite(mdl) || mdl <= 0) {
    nStar = nMax; underPowered = true;
    note = 'σ̂ or MDL undefined/zero (price ≈ 0 or < 2 finite matches) ⇒ N* := N_MAX; UNDER-POWERED (published); reads UNRESOLVED at the gate';
  } else {
    const needRaw = (POWER_Z * sigma / mdl) ** 2;
    nStar = Math.min(Math.ceil(needRaw / N_STEP) * N_STEP, nMax);
    if (needRaw > nMax) { underPowered = true; note = 'N* > N_MAX ⇒ UNDER-POWERED (published); the census runs at N_MAX and the primary reads UNRESOLVED at the gate'; }
  }
  const projForks = Math.round(forksPerMatch * nStar);
  const seAtNStar = Number.isFinite(sigma) ? sigma * Math.sqrt(1 / nStar) : Number.NaN;
  const projectedPower = Number.isFinite(seAtNStar) && mdl > 0 ? round(phi(mdl / seAtNStar - Z_975), 4) : Number.NaN;

  return {
    perMatchWallMs: round(perMatchWallMs, 2), nMaxWall, nMax,
    nStar, nBinding: nStar, underPowered, reducedPowerDisclosure: underPowered,
    projectedForksAtNStar: projForks, projectedPrimaryPowerAtNStar: projectedPower,
    note: `${note}. Pass nStar as A4P1B_N to the census. Wall INCLUDES forks (each fork = TWO branches `
      + '× up to W_MAX_TICKS + one X-FORK-IDENT step-through). Attainability-knee: if the priceable-fork '
      + 'cell or a gate stratum is too rare, its leg reads UNRESOLVED ⇒ the gate STOPS.',
  };
};

// =============================================================================
// THE DETERMINISTIC EXPERIMENT (run TWICE for X-DET) — mode-dispatched payload.
// =============================================================================
const runExperiment = () => {
  const seeds: number[] = [];
  for (let k = 0; k < MATCH_COUNT; k++) seeds.push(SEED_BASE + k);
  const receipts: ReceiptBook = {};
  const t0 = Date.now();
  const rows: CensusRow[] = seeds.map((s) => runCensusMatch(s, receipts));
  const perMatchWallMs = seeds.length === 0 ? 0 : (Date.now() - t0) / seeds.length;

  const seedRange = { first: seeds[0] ?? null, last: seeds[seeds.length - 1] ?? null, count: seeds.length };
  const receiptOut = {
    cap: RECEIPT_CAP,
    counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])),
    records: receipts,
  };
  const xForkChecked = sumBy(rows, (r) => r.xForkChecked);
  const xForkMismatched = sumBy(rows, (r) => r.xForkMismatched);

  if (MODE === 'smoke') {
    const { sizing, raw } = buildSizingCore(rows);
    const core = {
      mode: 'smoke' as const, seedRange,
      seedFamily: '11,850,000 + k, k∈0..39 (sizing only; inside the remaining 11.81M–12.3M reservation; disjoint from census)',
      wPricePrimaryS: W_PRICE_PRIMARY_S, ladderS: W_LADDER_S,
      xForkIdent: { checked: xForkChecked, mismatched: xForkMismatched, pass: xForkMismatched === 0 },
      sizing, receipts: receiptOut,
    };
    return { core, wallMs: perMatchWallMs, sizingRaw: raw };
  }
  const primary = buildPrimary(rows);
  const ladder = buildLadder(rows);
  const simpson = buildSimpson(rows);
  const gate = evalGate(primary, ladder, simpson);
  const core = {
    mode: 'census' as const, seedRange,
    seedFamily: '11,900,000 + k, k∈0..N−1 (inside the remaining 11.81M–12.3M reservation; disjoint from smoke)',
    wPricePrimaryS: W_PRICE_PRIMARY_S, ladderS: W_LADDER_S,
    admittedPrices: { deep: { L: L_DEEP, ci: L_DEEP_CI }, box: { L: L_BOX, ci: L_BOX_CI }, note: 'shot-against BANNED at P1 (non-monotone) — NOT used' },
    primaryPrice: primary, accrualLadder: ladder, simpsonExhibit: simpson,
    gate,
    xForkIdent: { checked: xForkChecked, mismatched: xForkMismatched, pass: xForkMismatched === 0 },
    populations: {
      totalForks: countForks(rows, allF),
      qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
      forkedTotal: sumBy(rows, (r) => r.counts.forked),
      capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
      endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
    },
    receipts: receiptOut,
  };
  return { core, wallMs: perMatchWallMs, sizingRaw: null };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET (double-run), X-FORK-IDENT, X-FP-PROD, seed disjointness, SHA, write.
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);
// X-DET compares the DETERMINISTIC core ONLY (no wall-derived value) — the #128 repair.
const { core: experiment, wallMs, sizingRaw } = runExperiment();
const experiment2 = SKIP_DET ? null : runExperiment().core;
const xDet = SKIP_DET ? null : canonical(experiment) === canonical(experiment2);

// WALL-DERIVED N arithmetic (smoke only): computed ONCE here, OUTSIDE the X-DET-compared core.
if (experiment.mode === 'smoke' && sizingRaw !== null) {
  (experiment.sizing as { nArithmetic: Record<string, unknown> }).nArithmetic = {
    ...(experiment.sizing as { nArithmetic: Record<string, unknown> }).nArithmetic,
    ...computeWallArithmetic(sizingRaw, wallMs),
  };
}

// X-FORK-IDENT (HARD): the as-is branch matched an independent plain step-through on every fork.
const xForkIdent = experiment.xForkIdent.pass;

// X-FP-PROD (HARD): the production fingerprint is UNCHANGED. src IS touched (the dormant seam) so
// git diff src is NON-empty by design — Road B is proven by X-FP-PROD + the flag-off dormancy test,
// NOT by an empty src diff (the prereg §7 X-SRC-ZERO re-forming).
let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
let fingerprint = 'skipped'; let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fingerprint = 'skipped (preflight)'; } else {
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  xFpProd = fingerprint === FINGERPRINT_BASELINE;
}

// SEED DISJOINTNESS (HARD) — computed from the FROZEN family constants (design property).
const censusMaxSeed = CENSUS_SEED_BASE + N_CAP - 1; // 11,907,999
const smokeMaxSeed = SMOKE_SEED_BASE + SMOKE_MATCHES - 1; // 11,850,039
const disjointFrom = (aLo: number, aHi: number, bLo: number, bHi: number): boolean => aHi < bLo || bHi < aLo;
const seedDisjoint =
  SMOKE_SEED_BASE >= RESERVED_BAND[0] && censusMaxSeed <= RESERVED_BAND[1] // inside the remaining reservation
  && smokeMaxSeed < CENSUS_SEED_BASE // smoke band ends below the census band (mutually disjoint)
  && disjointFrom(SMOKE_SEED_BASE, smokeMaxSeed, P1_SMOKE_RANGE[0], P1_SMOKE_RANGE[1])
  && disjointFrom(SMOKE_SEED_BASE, smokeMaxSeed, P1_CENSUS_RANGE[0], P1_CENSUS_RANGE[1])
  && disjointFrom(CENSUS_SEED_BASE, censusMaxSeed, P1_SMOKE_RANGE[0], P1_SMOKE_RANGE[1])
  && disjointFrom(CENSUS_SEED_BASE, censusMaxSeed, P1_CENSUS_RANGE[0], P1_CENSUS_RANGE[1]);

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates = { xDet, xForkIdent, xFpProd, seedDisjoint };

// ---- the verdict (prereg §4/§8 readings) ----
let verdict: string;
if (IS_PREFLIGHT) {
  verdict = `PREFLIGHT (bounded, ${MODE}) — NOT a verdict; exercises the fork sampling + paired branches `
    + '+ X-FORK-IDENT + the P1 surrogate detectors + the accrual-ladder pricing + (census) gate/Simpson '
    + '+ (smoke) the N arithmetic + X-DET on a capped slice. Numbers on ≤ few matches are meaningless by design; nothing canonical written.';
} else if (xDet === false) {
  verdict = 'FAIL — X-DET: the output is not byte-identical across the double-run; STOP';
} else if (!xForkIdent) {
  verdict = 'FAIL — X-FORK-IDENT: the as-is branch diverged from an independent plain step-through (fork leakage/non-determinism); STOP';
} else if (!xFpProd) {
  verdict = 'FAIL — X-FP-PROD: the production fingerprint moved (the dormant seam is not dormant); STOP';
} else if (!seedDisjoint) {
  verdict = 'FAIL — SEED DISJOINTNESS: a seed family escaped the reservation or collided; STOP';
} else if (MODE === 'smoke') {
  verdict = 'SIZING SMOKE — NOT a verdict (prereg §5): realizes the fork populations, the pooled price σ̂, '
    + 'and pins the census N via the frozen arithmetic (labelled, non-gating). Pass nArithmetic.nStar as A4P1B_N to the census.';
} else {
  const g = (experiment as Extract<typeof experiment, { mode: 'census' }>).gate;
  verdict = (g.pass && !g.simpsonSignReversalFlag)
    ? 'PASS (prereg §4) — MONOTONE, RESOLVEDLY POSITIVE policy price; A4-P1b proceeds to A4-P2 (commander review + numbered ruling gate the transition, #133.1).'
    : g.simpsonSignReversalFlag
      ? 'NOT-ADVANCE (reading E, #127) — Simpson-genre sign reversal on the primary cell; RETURNS to the user with both exhibits.'
      : 'STOP AT A4-P1b (prereg §4) — null/non-monotone/non-accruing policy price; no measured causal term for the M3 seam (I-A3). RETURNS to the user.';
}

const body = {
  experiment: `A4-P1b (the interventional fork-and-abandon census — the CAUSAL price of the rest-defence DESIGNATION POLICY) [${MODE}]`,
  authority: 'A4-P1B-ABANDON-CENSUS §1-§9 (ruling #133; the #126 green path resumes at this rung); '
    + 'contract A4-ASSIGNMENT-CONTRACT §4 (I-A1..I-A7); reuses the P1 surrogate detectors + the admitted P1 '
    + 'prices + the P1 cluster bootstrap + the P2b paired-fork idiom',
  head, mode: MODE,
  world: 'ENRICHED eye-null (#67.3: edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; '
    + 'c5TouchFork off; stationEye NULL; abandonRestDesignation NULL in the base run — the world the P1 prices '
    + 'were calibrated on, #26.5/#68.2; the counterfactual is created ONLY in branch B)',
  flags: CENSUS_FLAGS,
  seam: 'Match.abandonRestDesignation (0|1|null; null in every production path). Set ONLY on branch B\'s clone '
    + '(side d). Disables BOTH in-possession faces (PlayerBrain support-fan exclusion + formations clamp); the '
    + 'out-of-possession sweeper face untouched. STATUE-safe (removes a policy, freezes no body).',
  perceptHonesty: 'N/A at A4-P1b — read-only measurement at the fork grain; the seam is an INSTRUMENT (removes a '
    + 'policy inside an offline clone), NOT a consumer. No percept is created, read, or leaked; no consumer is built (A4-P2/P3).',
  preflight: IS_PREFLIGHT ? { cap: Number.isFinite(CAP) ? CAP : null, forkCap: FORK_CAP, seedBase: SEED_BASE, skipFp: SKIP_FP, note: 'bounded preflight — writes OUTSIDE the canonical JSON; not a verdict' } : null,
  parameters: {
    matchCount: MATCH_COUNT, plannedMatches: PLANNED_MATCHES, nEnv: N_ENV,
    nCensus: MODE === 'census' ? N_CENSUS : null, nCap: N_CAP,
    seedBaseFrozen: FROZEN_BASE, seedBaseUsed: SEED_BASE,
    reservedBand: RESERVED_BAND, censusSeedBase: CENSUS_SEED_BASE, smokeSeedBase: SMOKE_SEED_BASE,
    censusSeedRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeSeedRange: [SMOKE_SEED_BASE, smokeMaxSeed],
    p1SmokeRange: P1_SMOKE_RANGE, p1CensusRange: P1_CENSUS_RANGE,
    wPricePrimaryS: W_PRICE_PRIMARY_S, ladderS: W_LADDER_S, wMaxS: W_MAX_S,
    forkSpacingS: FORK_SPACING_S, forkCapPerMatch: FORK_CAP,
    admittedPriceDeep: L_DEEP, admittedPriceBox: L_BOX,
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES, statsSeedReserved: STATS_SEED_RESERVED,
    clusterUnit: 'match seed (#20); price statistic = mean over forks',
    restThird: REST_THIRD, boxInnerLocalX: BOX_INNER_X, boxDepth: BOX_DEPTH, boxWidth: BOX_WIDTH,
    contexts: CONTEXTS,
  },
  result: experiment,
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xForkIdent: { pass: xForkIdent, checked: experiment.xForkIdent.checked, mismatched: experiment.xForkIdent.mismatched, note: 'the as-is branch == an independent plain step-through on EVERY fork (zero branch/parent leakage)' },
    xFpProd: { pass: xFpProd, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, matches: xFpProd, skipped: SKIP_FP, note: 'src IS touched (the dormant seam) ⇒ git diff src is NON-empty BY DESIGN; Road B = X-FP-PROD + the flag-off byte-identity test (tests/a4RestAbandon.test.ts)' },
    srcDiffStat: srcDiff, srcDiffExpectedNonEmpty: true,
    seedDisjoint: { pass: seedDisjoint, reservedBand: RESERVED_BAND, censusRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeRange: [SMOKE_SEED_BASE, smokeMaxSeed], p1SmokeRange: P1_SMOKE_RANGE, p1CensusRange: P1_CENSUS_RANGE, note: 'computed from the FROZEN family constants (design property); preflight A4P1B_SEED_BASE cannot shift it' },
    xCorpusIdent: 'N/A (a fresh interventional corpus has no identity target — the P1 §4 precedent)',
  },
  gates,
  deviations: [
    'INTERVENTIONAL paired same-seed fork: at a qualifying own-possession playing moment for side d, the base '
    + 'state is cloned into TWO INDEPENDENT deep copies — branch A (as-is) and branch B (abandonRestDesignation=d). '
    + 'The parent match is NEVER stepped inside the fork. X-FORK-IDENT (100% coverage) verifies the as-is branch == '
    + 'an independent plain step-through (zero leakage). This defeats the #129 endogeneity (the incumbent hard-codes the job).',
    'THE SEAM disables BOTH in-possession faces of the index-1 designation for side d (the PlayerBrain support-fan '
    + 'exclusion restDefence + the formations in-possession clamp x=min(x,−8−coverBias·8)); the out-of-possession '
    + 'sweeper face untouched. STATUE-safe: the DF keeps his base spot + ordinary support scoring (no freeze/teleport).',
    'FORK SAMPLING: qualify iff playing AND owned AND simTime−lastForkTime≥4.0 s (the P2b cadence); fork side d = '
    + 'owner.side; both sides eligible; per-match cap 40 (the smoke reports whether it binds).',
    'THE SURROGATE detectors (opponent deep entry, opponent box entry) reuse the P1 calibration probe VERBATIM '
    + '(:326-344), scored per DEFENDING side d on the null→true entry transition, SEEDED from the shared fork-start '
    + 'state (only NEW entries within W count). Priced through the ADMITTED P1 lifts (deep 0.043455 PRIMARY, box '
    + '0.195217 parallel); shot-against BANNED (non-monotone at P1). Deep and box are NEVER summed.',
    'HORIZON + ACCRUAL (DOSE) LADDER: price over (t_fork, t_fork+W]; PRIMARY W=10 s (the certified P0b concede '
    + 'horizon); the dose/monotone axis is the accrual ladder W∈{10,20,30} s (30 s = P1/P2b W_cal). Fork price at W '
    + '(deep) = (nDeepB(W)−nDeepA(W))·L_DEEP. Paired B−A per fork; cluster = match seed.',
    'THE FROZEN GATE = (i) pooled paired deep-priced price P* (W=10) CI lower > 0 AND (ii) c_10<=c_20<=c_30 over '
    + 'the accrual ladder AND (iii) (W30−W10) accrual contrast CI lower > 0. #127 tightening: a Simpson sign '
    + 'reversal on the primary cell is an automatic NOT-ADVANCE. Any leg fails ⇒ STOP. Frozen before any run; smoke never informs it.',
    'CONFOUNDING (#94.3 Simpson) — stratified by fork context (side d ball third at t_fork). WITH SAME-SEED PAIRING '
    + 'THIS IS A HETEROGENEITY EXHIBIT, NOT A CONFOUND REPAIR (§4.1). Role is degenerate (the abandoned body is '
    + 'always index-1 = the DF; #129.1). Standardized = Σ w_s·price_s; a pooled-vs-standardized SIGN REVERSAL is FLAGGED.',
    'ADMISSION: a fork PAIR is excluded iff either branch ENDED within W_MAX (truncated horizon; match end is '
    + 'time-based ⇒ both end together, the either-branch form also guards a truncated control). Exclusions PUBLISHED, never pooled.',
    'SIZING before floors (prereg §5): the smoke measures the fork populations + the pooled price σ̂ + the per-match '
    + 'wall INCLUDING forks; the frozen arithmetic pins N* (SE_N ≤ MDL/POWER_Z), capped at a WALL-DERIVED N_MAX '
    + '(≤12 h; N×perMatchWall×2 for X-DET; hard-cap 8,000 keeps the census band inside 11.81M–12.3M). Attainability-knee on '
    + 'the priceable-fork cell; no optional stopping (#105.4). The wall is measured OUTSIDE the X-DET core (#128).',
    'SEEDS inside the remaining 11.81M–12.3M reservation (#133.2.vi): smoke 11.85M, census 11.90M, mutually disjoint '
    + 'and disjoint from the P1-consumed 11.70M/11.80M blocks. Stats seeds from 100203 (bootstrap); 100303 reserved-unused.',
    'X-SRC-ZERO RE-FORMED (#133.2.ii): src IS touched by this step (the dormant Match seam) so git diff src is '
    + 'NON-empty BY DESIGN. Road B is proven by (1) the FLAG-OFF byte-identity dormancy test + (2) the production '
    + 'fingerprint 57b0bdab…c673 unchanged (X-FP-PROD, the hard gate). The seam is null in every production path.',
    'MODE is EXPLICIT via A4P1B_MODE (no default); a bare invocation errors rather than silently running the wrong corpus.',
  ],
  registeredNonClaims: [
    'PRICES A POLICY\'S REMOVAL, BUILDS NO CONSUMER: A4-P1b measures the causal price of the incumbent designation '
    + 'via a paired same-seed fork contrast; it builds no M1–M5 mechanism, no assignment gene, no seam consumption (A4-P2/P3).',
    'IT PRICES THE INCUMBENT\'S DEEP-PARKED REMOVAL CONTRACT SPECIFICALLY (#130) — the baseline for a future height-gene '
    + 'competition, NOT a claim that deep parking is the job\'s true form.',
    'PERCEPT-HONESTY N/A: read-only measurement; the seam is an INSTRUMENT, not a consumer.',
    'NOTHING SHIPS (Road B): abandonRestDesignation null in production, EDS flags dormant, stationEye null, fingerprint 57b0bdab…c673 unchanged.',
    'P1b IS THE SECOND INSTRUMENT (#106.6): a THIRD instrument on this question would need its own user ruling.',
    'A4-P1b CANNOT authorize A4-P2: only the commander\'s review of the census result opens A4-P2 (#133.1); a null/non-monotone/non-accruing price STOPS the arc.',
  ],
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
const output = { ...body, sha256 };
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

// --- concise stderr line -----------------------------------------------------
if (MODE === 'smoke') {
  const s = (experiment as Extract<typeof experiment, { mode: 'smoke' }>).sizing as {
    populations: { totalForks: number; forkCapBinds: boolean; endedDropsTotal: number };
    pooledPrice: number; sigmaPerMatchPrice: number; nArithmetic: { nStar?: number };
  };
  console.error(
    `A4-P1b ${verdict.slice(0, 46)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · smoke ${MATCH_COUNT}m`
    + ` · forks ${s.populations.totalForks} (cap ${s.populations.forkCapBinds}) · ended ${s.populations.endedDropsTotal}`
    + ` · price ${s.pooledPrice} · σ̂ ${s.sigmaPerMatchPrice} · N* ${s.nArithmetic.nStar}`
    + ` · xDet ${xDet} · xFork ${xForkIdent} · xFp ${xFpProd} · disjoint ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
  );
} else {
  const c = (experiment as Extract<typeof experiment, { mode: 'census' }>);
  console.error(
    `A4-P1b ${verdict.slice(0, 46)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · census ${MATCH_COUNT}m (N_env ${N_ENV})`
    + ` · price ${c.primaryPrice.pricePooledDeep.point} [${c.primaryPrice.pricePooledDeep.lower}, ${c.primaryPrice.pricePooledDeep.upper}]`
    + ` · rung ${c.accrualLadder.rungCost.map((b) => b.point).join('/')} · mono ${c.accrualLadder.monotoneNonDecreasing}`
    + ` · pass ${c.gate.pass} · rev ${c.gate.simpsonSignReversalFlag} · xDet ${xDet} · xFork ${xForkIdent} · xFp ${xFpProd} · SHA ${sha256.slice(0, 12)}`,
  );
}
