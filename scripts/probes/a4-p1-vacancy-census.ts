// A4-P1 — THE VACANCY CENSUS (the concession price of rest-defence-slot VACANCY).
//
// Authority: docs/world-model/A4-P1-VACANCY-CENSUS.md (the FROZEN pre-registration) +
// docs/world-model/A4-ASSIGNMENT-CONTRACT.md §4 (fork C folded in as calibration) +
// rulings #125 (the A4 contract opens; fork C = A4-P1) and #126 (the 自走 green path).
// This probe PRICES the ABSENCE of the rest-defence slot on the world's OWN
// occupied-vs-vacant variation during own-possession phases — the measurement the v4
// occupancy censuses could not deliver (they priced PRESENCE where presence exists,
// zero-positive by construction; #109.3). It reuses, VERBATIM in logic:
//   • the I5(b) designated-slot OCCUPANCY definition from the P3p-3 battery
//     (scripts/probes/stage3-v4-p3p3-battery.ts:757-763, restSlotShare @:812): at a 6 Hz
//     OWN-POSSESSION playing sample tick, the slot is OCCUPIED iff the index-1 outfield
//     body (role !== 'GK', !sentOff) is deep in its own third (t.localX(p.pos.x) < -REST_THIRD).
//     NO new geometry.
//   • the P1-calibration surrogate detectors (scripts/probes/stage3-v4-p1-calibration.ts:326-344):
//     opponent deep entry (opp owns AND ball in d's own third, on the null→true transition) and
//     opponent box entry (opp owns AND ball in d's box), VERBATIM.
//   • the ADMITTED P1 prices (STAGE3-V4-P1-CALIBRATION §RESULT, reading B — the calibration
//     table carries [deep, box]; shot-against DROPPED non-monotone, NOT used here): deep entry
//     L = 0.043455 [0.030790, 0.055817]; box entry L = 0.195217 [0.166228, 0.223515]
//     concessions/event (goal-value units).
//   • the P0b/P1 match-cluster bootstrap engine (clusterCI/contrastCI, cluster = match seed).
//
// It TOUCHES NO src (X-SRC-ZERO): it constructs the enriched eye-null census world (the world
// the P1 prices were calibrated on — #26.5/#68.2 two-pin logic), reads its own play, and prices
// downstream exposure. Nothing ships (Road B): every EDS flag dormant in production, stationEye
// NULL, the fingerprint 57b0bdab…c673 unchanged. PERCEPT-honesty is N/A at P1 (read-only
// measurement; no consumer is built — that is A4-P2/P3).
//
// THE ESTIMAND (prereg §1). During OWN-POSSESSION windows (side d holds the ball), the
// designated rest-defence slot is sometimes OCCUPIED and sometimes VACANT (the world's own
// variation). At the TURNOVER that ends a window, a vacant slot leaves d exposed (the Phase-31
// "uncontested breakaway" pathology). The vacancy PRICE = the excess downstream concession
// goal-value that a VACANT window suffers over an OCCUPIED one, in goal-value units, priced
// through the admitted P1 surrogates over a pinned horizon.
//
// WINDOW CONSTRUCTION (prereg §2, frozen):
//   • a WINDOW = a maximal run of constant m.possessionSide === d (d in {0,1}); it CLOSES when
//     m.possessionSide leaves d. A close is a TURNOVER iff the new possessionSide === (1-d) AND
//     the tick is PLAYING (a live hand-off exposing rest defence); a close to loose (-1), a
//     restart, or match end is a NON-TURNOVER (no live exposure) — counted, NOT priced.
//   • VACANCY classification: during the window, the I5(b) slot occupancy is sampled at 6 Hz
//     (SAMPLE_EVERY=10). vacFrac = vacantSamples / totalSamples; vacDurS = vacantSamples·SAMPLE_DT
//     (trailing vacant own-possession seconds). A window with 0 samples (too short) is DROPPED
//     (counted). BINARY: VACANT iff vacFrac >= 0.5, else OCCUPIED.
//   • PRICING HORIZON W_price after the turnover tick t_end: count opponent deep/box entries
//     suffered by d in the half-open (t_end, t_end + W_price]. PRIMARY W_price = 10 s (the
//     certified P0b concede horizon; the breakaway is immediate); sensitivity {6 s, 15 s}
//     labelled non-gating. Goal value = nEvents · L (deep-priced PRIMARY; box-priced secondary).
//
// THE FROZEN GATE (prereg §4; smoke data may NOT inform it). PASS to A4-P2 requires ALL of:
//   (i)   RESOLVED — the pooled primary price P* (deep-priced, W=10, VACANT − OCCUPIED,
//         match-cluster bootstrap CI) has CI lower bound > 0.
//   (ii)  MONOTONE — over the pre-registered vacancy-duration bins (edges 4 s, 10 s from the P0
//         published lag grid: bin0 [0,4) · bin1 [4,10) · bin2 [10,∞)), the per-window downstream
//         deep-priced goal-value cost is NON-DECREASING: c0 <= c1 <= c2 (point estimates).
//   (iii) LADDER RESOLVED — the (bin2 − bin0) contrast match-cluster CI lower bound > 0.
//   A null/non-monotone price (any of i/ii/iii fails) ⇒ STOP at A4-P1 (contract §4); return to
//   the user with the finding. The gate reads the POOLED primary cell (contract §4 language);
//   the context×role stratified (Simpson, #94.3) standardized price is a REPORTED robustness
//   exhibit — a sign reversal pooled-vs-standardized is FLAGGED to the commander, never silently
//   passed.
//
// TWO MODES (explicit A4P1_MODE, NO default):
//   smoke   — 40 matches @ 11,700,000 + k, enriched eye-null, X-DET double-run. Publishes the
//             realized per-match window/turnover counts, the per-bin & per-stratum populations
//             (the attainability-knee inputs), the realized pooled price σ̂, and the FROZEN N
//             arithmetic (N* / N_MAX / binding). Writes a4-p1-vacancy-census-sizing-smoke.json.
//   census  — A4P1_N matches @ 11,800,000 + k (paired, one seed list), the gate-bearing run:
//             the pooled primary price + the duration ladder + the Simpson exhibit + the raw
//             event-rate deltas + the sensitivity windows + X-family + X-DET double-run. Writes
//             a4-p1-vacancy-census.json. Detached, the commander's resident (#49.5).
//
// N RULE (frozen §5): N* = the smallest 200-step match count at which the smoke-measured pooled
// price SE_N resolves the primary MDL at ~95 % power AND the sparsest gate-bearing cell (top
// duration bin) resolves its top−bottom contrast, CAPPED at N_MAX. N_MAX is WALL-DERIVED at the
// smoke (largest 200-step N whose projected total wall — N × per-match wall × 2 for X-DET —
// ≤ 12 hours), hard-capped at 8,000/arm (keeps the census band strictly inside the reserved
// 11.7M–12.3M freeze). Attainability-knee: a gate-bearing cell whose N_cell > N_MAX is PUBLISHED
// under-powered → its leg reads UNRESOLVED → the gate STOPS. N fixed before the run; no optional
// stopping (#105.4).
//
// SEEDS (frozen §6, inside the ratified 11.7M–12.3M band, #125.6): smoke 11.7M (k 0..39);
// census 11.8M (k 0..N−1). Stats: bootstrap 100003; permutation 100103 reserved-unused (no
// dispersion statistic). Bootstrap B=2000. Smoke/census disjoint; both inside the reserved band.
//
// COMMAND LINES:
//   smoke:   A4P1_MODE=smoke npx tsx scripts/probes/a4-p1-vacancy-census.ts
//   census:  A4P1_MODE=census A4P1_N=<disclosed N* from the smoke> \
//            npx tsx scripts/probes/a4-p1-vacancy-census.ts
//   preflight (bounded; writes OUTSIDE the repo, NOT a verdict):
//     A4P1_MODE=smoke A4P1_CAP=3 A4P1_OUT=/tmp/x.json A4P1_SKIP_DET=1 A4P1_SKIP_FP=1 \
//       npx tsx scripts/probes/a4-p1-vacancy-census.ts
//
// ENV KNOBS (preflight only; the two real runs touch only A4P1_MODE and — census — A4P1_N):
//   A4P1_CAP (cap the match count ⇒ IS_PREFLIGHT: never writes the canonical JSON), A4P1_N (census
//   count, REQUIRED in census, capped at N_MAX), A4P1_OUT (redirect output), A4P1_SKIP_DET=1
//   (skip the X-DET second run), A4P1_SKIP_FP=1 (skip the fingerprint — preflight only),
//   A4P1_SEED_BASE (shift the seed base, honored ONLY under a preflight cap).

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Role, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING (prereg §2/§4/§5/§6) — every constant pinned before any run.
// =============================================================================
// Seed families inside the ratified 11.7M–12.3M band (#125.6). smoke 11.7M; census 11.8M.
const CENSUS_SEED_BASE = 11_800_000; // census: 11,800,000 + k, k∈0..N−1 (N ≤ 8,000 ⇒ ≤ 11,807,999)
const SMOKE_SEED_BASE = 11_700_000; // smoke: 11,700,000 + k, k∈0..39
const SMOKE_MATCHES = 40; // the frozen sizing-smoke corpus size
const RESERVED_BAND = [11_700_000, 12_300_000] as const; // the ratified A4-slice-1 seed freeze

// the match-cluster bootstrap (#20) — stats seeds from 100003 up (prereg §6).
const BOOTSTRAP_SEED = 100_003;
const BOOTSTRAP_RESAMPLES = 2_000;
const PERM_SEED_RESERVED = 100_103; // reserved-unused (no dispersion statistic; prereg §6)

// the ADMITTED P1 prices (STAGE3-V4-P1-CALIBRATION §RESULT, reading B; goal-value units).
// shot-against DROPPED (non-monotone) — NOT used. deep = PRIMARY pricing surrogate; box = secondary.
const L_DEEP = 0.043455; // opponent deep entry lift [0.030790, 0.055817]
const L_BOX = 0.195217; // opponent box entry lift  [0.166228, 0.223515]
const L_DEEP_CI = [0.030790, 0.055817] as const;
const L_BOX_CI = [0.166228, 0.223515] as const;

// pricing horizon (prereg §2): PRIMARY 10 s (the certified P0b concede horizon); {6 s,45 s->15 s}
// sensitivity, labelled non-gating. All three computed; only W=10 is gate-bearing.
const W_PRICE_PRIMARY_S = 10;
const W_PRICE_SENS_S = [6, 15] as const;
const W_ALL_S = [6, 10, 15] as const;
type WKey = 6 | 10 | 15;

// I5(b) OCCUPANCY (battery :757-763 VERBATIM) + surrogate geometry (P1 :326-344 VERBATIM).
const SAMPLE_EVERY = 10; // 6 Hz sampling (every 10th tick), P0 §2 / battery SAMPLE_EVERY
const SAMPLE_DT = SAMPLE_EVERY * DT;
const REST_THIRD = HALF_L / 3; // own-third depth (I5 / P1 / battery, verbatim)
const BOX_INNER_X = -(HALF_L - BOX_DEPTH); // box outer edge in the team's attack-local frame (P1 D3)

// vacancy classification (prereg §2/§4).
const VAC_BINARY_THRESH = 0.5; // BINARY: VACANT iff vacFrac >= 0.5
// vacancy-duration bin edges (P0 published lag grid edges 4 s, 10 s): bin0 [0,4) · bin1 [4,10) · bin2 [10,∞)
const DURATION_BIN_EDGES_S = [4, 10] as const;
const DURATION_BINS = 3;

// the frozen N arithmetic (prereg §5). MDL for the price mirrors P1's min(0.5·|price|, 0.01).
const MDL_ABS = 0.01; // goal-value units
const POWER_Z = 3.605; // z_.975 + z_.95 (two-sided 95 % CI at 95 % power) — battery §6.1 form
const Z_975 = 1.96;
const N_STEP = 200; // fixed-step N grid
const N_CAP = 8_000; // hard N cap (keeps the census band inside the reserved freeze)
const WALL_BUDGET_HOURS = 12;
const WALL_BUDGET_MS = WALL_BUDGET_HOURS * 3600 * 1000;
const XDET_FACTOR = 2;

// X-SRC-ZERO — the frozen shipped-world production fingerprint (P1/battery verbatim).
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

// the ENRICHED census world (#67.3; the world the P1 prices were calibrated on) — eye NULL.
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const RECEIPT_CAP = 1_000; // per-class receipts cap (#49.3), first-N deterministic
const CONTEXTS = ['own', 'mid', 'their'] as const; // turnover-third context strata
type Context = (typeof CONTEXTS)[number];
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST']; // slot-body role strata (GK excluded)

// =============================================================================
// ENV / MODE (prereg §7). Two REAL modes (smoke, census); a bounded preflight caps either.
// =============================================================================
const MODE = process.env.A4P1_MODE;
if (MODE !== 'smoke' && MODE !== 'census') {
  console.error('A4-P1 FATAL — A4P1_MODE must be "smoke" or "census" (see the header command lines).');
  process.exit(2);
}
const CAP = process.env.A4P1_CAP ? Math.max(1, Number.parseInt(process.env.A4P1_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(CAP);
const SKIP_DET = process.env.A4P1_SKIP_DET === '1';
const SKIP_FP = process.env.A4P1_SKIP_FP === '1'; // preflight only
const N_ENV = process.env.A4P1_N ? Math.max(1, Number.parseInt(process.env.A4P1_N, 10)) : null;
if (MODE === 'census' && N_ENV === null) {
  console.error('A4-P1 FATAL — census mode requires A4P1_N (the census match count pinned from the smoke arithmetic).');
  process.exit(2);
}
const N_CENSUS = MODE === 'census' ? Math.min(N_ENV as number, N_CAP) : 0;
const FROZEN_BASE = MODE === 'smoke' ? SMOKE_SEED_BASE : CENSUS_SEED_BASE;
const SEED_BASE = (IS_PREFLIGHT && process.env.A4P1_SEED_BASE)
  ? Math.max(0, Number.parseInt(process.env.A4P1_SEED_BASE, 10)) : FROZEN_BASE;
const PLANNED_MATCHES = MODE === 'smoke' ? SMOKE_MATCHES : N_CENSUS;
const MATCH_COUNT = IS_PREFLIGHT ? Math.min(PLANNED_MATCHES, CAP) : PLANNED_MATCHES;
const SMOKE_OUT = 'docs/world-model/data/a4-p1-vacancy-census-sizing-smoke.json';
const CENSUS_OUT = 'docs/world-model/data/a4-p1-vacancy-census.json';
const OUT_PATH = process.env.A4P1_OUT ?? (MODE === 'smoke' ? SMOKE_OUT : CENSUS_OUT);

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
// THE ENRICHED MATCH FIXTURE (= the census world; P1 verbatim). Eye NULL (no arming).
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

// =============================================================================
// THE MATCH RUNNER (prereg §2). One enriched eye-null match → its turnover-window records.
// Reuses: I5(b) occupancy (battery :757-763) + P1 surrogate detectors (:326-344), VERBATIM.
// =============================================================================
interface WindowRec {
  d: 0 | 1;
  vacFrac: number;
  vacDurS: number;
  samples: number;
  endContext: Context;
  slotRole: Role | null;
  slotGid: number;
  tEnd: number;
  nDeep: Record<WKey, number>;
  nBox: Record<WKey, number>;
}
interface CensusRow {
  seed: number;
  windows: WindowRec[]; // turnover-closed, sampled windows only (the priced population)
  drops: { noSample: number; nonTurnover: number };
  counts: { windowsOpened: number; turnovers: number };
}

// binary search: first index i with arr[i] >= x (lower bound); arr ascending. (P1 verbatim.)
const lowerBound = (arr: readonly number[], x: number): number => {
  let lo = 0; let hi = arr.length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (arr[mid] < x) lo = mid + 1; else hi = mid; }
  return lo;
};
// count of ascending event times in the half-open (t0, t0 + W].
const countWithin = (times: readonly number[], t0: number, W: number): number => {
  const i = lowerBound(times, t0 + 1e-9); // first strictly after t0
  let n = 0;
  for (let k = i; k < times.length && times[k] <= t0 + W + 1e-9; k++) n += 1;
  return n;
};
const contextOf = (lx: number): Context => (lx < -REST_THIRD ? 'own' : lx > REST_THIRD ? 'their' : 'mid');

interface OpenWindow { d: 0 | 1; startTick: number; vac: number; occ: number; slotRole: Role | null; slotGid: number }

const runCensusMatch = (seed: number, receipts: ReceiptBook | null): CensusRow => {
  const m = matchOf(seed); // enriched flags; stationEye stays NULL (eye null; no arming)

  // opponent deep/box entry events per DEFENDING side d (P1 detectors verbatim) — ascending in t.
  const deepEv: [number[], number[]] = [[], []];
  const boxEv: [number[], number[]] = [[], []];
  const deepPrev: [boolean, boolean] = [false, false];
  const boxPrev: [boolean, boolean] = [false, false];

  const windows: WindowRec[] = [];
  let open: OpenWindow | null = null;
  let noSample = 0; let nonTurnover = 0; let windowsOpened = 0; let turnovers = 0;
  let tick = 0;

  const closeWindow = (w: OpenWindow, tEnd: number, turnover: boolean, endLx: number): void => {
    const samples = w.vac + w.occ;
    if (!turnover) { nonTurnover += 1; return; } // no live exposure — counted, not priced
    turnovers += 1;
    if (samples === 0) { noSample += 1; return; } // too short to classify — dropped, counted
    const vacFrac = w.vac / samples;
    windows.push({
      d: w.d, vacFrac, vacDurS: w.vac * SAMPLE_DT, samples,
      endContext: contextOf(endLx), slotRole: w.slotRole, slotGid: w.slotGid, tEnd,
      nDeep: { 6: 0, 10: 0, 15: 0 }, nBox: { 6: 0, 10: 0, 15: 0 },
    });
    addReceipt(receipts, 'turnover-window', seed, Math.round(tEnd / DT), w.slotGid,
      `d${w.d} vacFrac=${round(vacFrac, 3)} vacDur=${round(w.vac * SAMPLE_DT, 2)}s ctx=${contextOf(endLx)}`);
  };

  while (!m.finished) {
    m.step(DT);
    if (m.finished) break;
    tick += 1;
    const playing = m.phase === 'playing';
    const owner = m.ball.owner;
    const nowT = m.simTime;
    const poss = m.possessionSide as -1 | 0 | 1;

    // --- opponent deep + box entry detectors (P1 :326-344 VERBATIM) ---
    for (const d of [0, 1] as const) {
      const tm = m.teams[d];
      const oppOwns = owner !== null && owner.side !== d;
      const lx = tm.localX(m.ball.pos.x);
      const deepNow = oppOwns && playing && lx < -REST_THIRD;
      if (deepNow && !deepPrev[d]) {
        deepEv[d].push(nowT);
        addReceipt(receipts, 'deep-entry-against', seed, tick, owner?.gid ?? -1, `d${d} lx=${round(lx, 2)}`);
      }
      deepPrev[d] = deepNow;
      const boxNow = oppOwns && playing && lx <= BOX_INNER_X && Math.abs(m.ball.pos.y) <= BOX_WIDTH / 2;
      if (boxNow && !boxPrev[d]) {
        boxEv[d].push(nowT);
        addReceipt(receipts, 'box-entry-against', seed, tick, owner?.gid ?? -1, `d${d} lx=${round(lx, 2)}`);
      }
      boxPrev[d] = boxNow;
    }

    // --- window management (prereg §2): a WINDOW = a run of constant possessionSide === d ---
    if (open !== null && poss !== open.d) {
      const d = open.d;
      const turnover = poss === (1 - d) && playing;
      closeWindow(open, nowT, turnover, m.teams[d].localX(m.ball.pos.x));
      open = null;
    }
    if (open === null && (poss === 0 || poss === 1)) {
      const t = m.teams[poss];
      const body = t.players.find((p) => p.index === 1 && !p.sentOff);
      open = { d: poss, startTick: tick, vac: 0, occ: 0, slotRole: body?.role ?? null, slotGid: body?.gid ?? -1 };
      windowsOpened += 1;
    }

    // --- I5(b) OCCUPANCY sample (battery :757-763 VERBATIM): 6 Hz, own possession, playing ---
    if (open !== null && playing && tick % SAMPLE_EVERY === 0) {
      const t = m.teams[open.d];
      const body = t.players.find((p) => p.index === 1 && !p.sentOff);
      const occupied = body !== undefined && t.localX(body.pos.x) < -REST_THIRD;
      if (occupied) open.occ += 1; else open.vac += 1;
      if (body !== undefined && open.slotRole === null) { open.slotRole = body.role; open.slotGid = body.gid; }
    }
  }
  if (open !== null) closeWindow(open, m.simTime, false, 0); // dangling window at match end = non-turnover

  // --- price each turnover window: count downstream surrogates in (t_end, t_end+W] ---
  for (const w of windows) {
    for (const W of W_ALL_S) {
      w.nDeep[W as WKey] = countWithin(deepEv[w.d], w.tEnd, W);
      w.nBox[W as WKey] = countWithin(boxEv[w.d], w.tEnd, W);
    }
  }
  return { seed, windows, drops: { noSample, nonTurnover }, counts: { windowsOpened, turnovers } };
};

// =============================================================================
// STATISTICS — the match-cluster bootstrap (#20), P1 engine VERBATIM (BOOTSTRAP_SEED=100003).
// =============================================================================
const clusterCI = (
  units: readonly CensusRow[], stat: (sample: readonly CensusRow[]) => number, offset: number,
): { point: number; lower: number; upper: number; n: number } => {
  const point = stat(units);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  const n = units.length;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const sample: CensusRow[] = [];
    for (let i = 0; i < n; i++) sample.push(units[rng.int(0, n - 1)]);
    const v = stat(sample);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  return { point: round(point), lower: round(pct(draws, 0.025)), upper: round(pct(draws, 0.975)), n };
};

type WinFilter = (w: WindowRec) => boolean;
type WinValue = (w: WindowRec) => number;
const allW: WinFilter = () => true;
const isVac: WinFilter = (w) => w.vacFrac >= VAC_BINARY_THRESH;
const isOcc: WinFilter = (w) => w.vacFrac < VAC_BINARY_THRESH;
const durBinOf = (w: WindowRec): number => (w.vacDurS < DURATION_BIN_EDGES_S[0] ? 0
  : w.vacDurS < DURATION_BIN_EDGES_S[1] ? 1 : 2);
const gvDeep = (W: WKey): WinValue => (w) => w.nDeep[W] * L_DEEP;
const gvBox = (W: WKey): WinValue => (w) => w.nBox[W] * L_BOX;
const cntDeep = (W: WKey): WinValue => (w) => w.nDeep[W];
const cntBox = (W: WKey): WinValue => (w) => w.nBox[W];

// mean of `value` over windows passing `filter` (pooled group mean).
const meanCI = (rows: readonly CensusRow[], filter: WinFilter, value: WinValue, offset: number) =>
  clusterCI(rows, (s) => {
    let sum = 0; let n = 0;
    for (const r of s) for (const w of r.windows) if (filter(w)) { sum += value(w); n += 1; }
    return n === 0 ? Number.NaN : sum / n;
  }, offset);

// contrast: mean(A) − mean(B) over two filters, one shared value (the vacancy PRICE form).
const contrastCI = (
  rows: readonly CensusRow[], fA: WinFilter, fB: WinFilter, value: WinValue, offset: number,
) => clusterCI(rows, (s) => {
  let aS = 0; let aN = 0; let bS = 0; let bN = 0;
  for (const r of s) for (const w of r.windows) {
    if (fA(w)) { aS += value(w); aN += 1; }
    if (fB(w)) { bS += value(w); bN += 1; }
  }
  return (aN === 0 || bN === 0) ? Number.NaN : aS / aN - bS / bN;
}, offset);

const countWindows = (rows: readonly CensusRow[], filter: WinFilter): number =>
  sumBy(rows, (r) => r.windows.filter(filter).length);

// =============================================================================
// THE VACANCY-PRICE TABLE + THE FROZEN GATE (prereg §4).
// =============================================================================
const buildPrimary = (rows: readonly CensusRow[]) => {
  const W = W_PRICE_PRIMARY_S as WKey;
  // pooled primary price (deep-priced, VACANT − OCCUPIED)
  const priceDeep = contrastCI(rows, isVac, isOcc, gvDeep(W), 100);
  const priceBox = contrastCI(rows, isVac, isOcc, gvBox(W), 101); // secondary (parallel surrogate)
  // raw event-rate deltas (prereg §4: report BOTH raw + goal-value)
  const rawDeep = contrastCI(rows, isVac, isOcc, cntDeep(W), 110);
  const rawBox = contrastCI(rows, isVac, isOcc, cntBox(W), 111);
  // group levels
  const vacDeep = meanCI(rows, isVac, gvDeep(W), 120);
  const occDeep = meanCI(rows, isOcc, gvDeep(W), 121);
  return {
    wPriceS: W, pricingSurrogatePrimary: 'deep entry (rest-defence-natural, dense, avoids the deep⊃box double-count)',
    priceDeepPooled: priceDeep, priceBoxPooled: priceBox,
    rawDeepRateDelta: rawDeep, rawBoxRateDelta: rawBox,
    vacantLevelDeep: vacDeep, occupiedLevelDeep: occDeep,
    nVacant: countWindows(rows, isVac), nOccupied: countWindows(rows, isOcc),
  };
};

// the vacancy-DURATION ladder (prereg §4 monotone axis).
const buildLadder = (rows: readonly CensusRow[]) => {
  const W = W_PRICE_PRIMARY_S as WKey;
  const binCost = Array.from({ length: DURATION_BINS }, (_, b) =>
    meanCI(rows, (w) => durBinOf(w) === b, gvDeep(W), 200 + b));
  const binN = Array.from({ length: DURATION_BINS }, (_, b) => countWindows(rows, (w) => durBinOf(w) === b));
  const topMinusBottom = contrastCI(rows, (w) => durBinOf(w) === DURATION_BINS - 1, (w) => durBinOf(w) === 0, gvDeep(W), 210);
  const pts = binCost.map((c) => c.point);
  const monotone = pts.every((v, i) => i === 0 || !(Number.isFinite(v) && Number.isFinite(pts[i - 1]) && v < pts[i - 1]));
  return {
    axis: 'trailing vacant own-possession duration vacDurS (s); deep-priced downstream goal-value cost per window',
    binEdgesS: DURATION_BIN_EDGES_S, binRanges: ['[0,4)', '[4,10)', '[10,∞)'],
    binCost, binN, topMinusBottom, monotoneNonDecreasing: monotone,
  };
};

// the Simpson exhibit (prereg §4 / #94.3): raw-pool vs context×role stratified standardized.
const buildSimpson = (rows: readonly CensusRow[]) => {
  const W = W_PRICE_PRIMARY_S as WKey;
  const strata: { context: Context; role: Role; nVac: number; nOcc: number; price: ReturnType<typeof contrastCI>; weight: number }[] = [];
  const nTotal = countWindows(rows, allW);
  let offset = 300;
  for (const context of CONTEXTS) {
    for (const role of ROLE_AXIS) {
      const inStr: WinFilter = (w) => w.endContext === context && w.slotRole === role;
      const nStr = countWindows(rows, inStr);
      if (nStr === 0) continue;
      const price = contrastCI(rows, (w) => inStr(w) && isVac(w), (w) => inStr(w) && isOcc(w), gvDeep(W), offset++);
      strata.push({
        context, role, nVac: countWindows(rows, (w) => inStr(w) && isVac(w)),
        nOcc: countWindows(rows, (w) => inStr(w) && isOcc(w)), price, weight: round(nStr / (nTotal || 1)),
      });
    }
  }
  // standardized price = Σ w_s · price_s over strata with a finite within-stratum price.
  const finite = strata.filter((s) => Number.isFinite(s.price.point));
  const wSum = finite.reduce((a, s) => a + s.weight, 0);
  const standardizedPoint = wSum === 0 ? Number.NaN
    : finite.reduce((a, s) => a + s.weight * s.price.point, 0) / wSum;
  const noRoleWindows = countWindows(rows, (w) => w.slotRole === null);
  return {
    note: 'context (turnover third) × slot-body role. Standardized = Σ w_s·price_s over strata with a '
      + 'finite within-stratum price (weights = window share). REPORTED robustness exhibit; the GATE binds '
      + 'on the pooled primary cell (contract §4). A sign reversal pooled-vs-standardized is FLAGGED.',
    strata, standardizedPricePoint: round(standardizedPoint), nWindowsNoRole: noRoleWindows,
  };
};

// {6 s, 15 s} sensitivity (labelled, non-gating) — the pooled deep-priced price re-read.
const buildSensitivity = (rows: readonly CensusRow[]) => {
  const out: Record<string, ReturnType<typeof contrastCI>> = {};
  let off = 400;
  for (const W of W_PRICE_SENS_S) out[`w${W}`] = contrastCI(rows, isVac, isOcc, gvDeep(W as WKey), off++);
  return {
    note: 'labelled, NON-GATING (prereg §2/§4): the pooled deep-priced price re-read at W_price ∈ {6 s, 15 s}. '
      + 'The gate reads the PRIMARY 10 s window ONLY.',
    ...out,
  };
};

// THE FROZEN GATE (prereg §4).
const evalGate = (primary: ReturnType<typeof buildPrimary>, ladder: ReturnType<typeof buildLadder>, simpson: ReturnType<typeof buildSimpson>) => {
  const resolved = Number.isFinite(primary.priceDeepPooled.lower) && primary.priceDeepPooled.lower > 0;
  const monotone = ladder.monotoneNonDecreasing;
  const ladderResolved = Number.isFinite(ladder.topMinusBottom.lower) && ladder.topMinusBottom.lower > 0;
  const pass = resolved && monotone && ladderResolved;
  const simpsonReversal = Number.isFinite(simpson.standardizedPricePoint)
    && Number.isFinite(primary.priceDeepPooled.point)
    && Math.sign(simpson.standardizedPricePoint) !== Math.sign(primary.priceDeepPooled.point);
  return {
    predicate: '(i) pooled primary deep-priced price CI lower > 0 AND (ii) c0<=c1<=c2 over duration bins '
      + 'AND (iii) (bin2−bin0) contrast CI lower > 0',
    resolved, monotone, ladderResolved, pass,
    simpsonSignReversalFlag: simpsonReversal,
    disposition: pass
      ? 'PASS — monotone, resolvedly nonzero vacancy price. A4-P1 proceeds to A4-P2 (dormant build); commander review + numbered ruling gate the transition (#126).'
      : 'STOP AT A4-P1 — null/non-monotone vacancy price (contract §4): no measured term for the M3 seam ⇒ building M1–M4 would violate I-A3. RETURNS to the user with the finding.',
  };
};

// =============================================================================
// THE SIZING SMOKE (prereg §5) — populations + realized price σ̂ + the FROZEN N arithmetic.
// =============================================================================
// The wall-derived N arithmetic (MACHINE-DEPENDENT; measured ONCE at the smoke). Split OUT of
// the deterministic sizing core so the X-DET byte-compare never sees a machine-wall value
// (#122.2 harness repair). Attached to the WRITTEN artifact at top level, not inside the core.
interface WallArithmetic {
  perMatchWallMs: number; nMaxWall: number; nMax: number;
  nStar: number; nBinding: number; underPowered: boolean; reducedPowerDisclosure: boolean;
  projectedRestBinTurnoversAtNStar: number; projectedPrimaryPowerAtNStar: number; note: string;
}
// the deterministic intermediates the wall arithmetic needs (all X-DET-stable; carried out-of-band).
interface SizingRaw { sigma: number; mdl: number; binN: number[]; nMatches: number }

// DETERMINISTIC sizing core (this is what X-DET compares): populations + realized price σ̂ + MDL
// + the DETERMINISTIC N-arithmetic fields (formulas, POWER_Z, N grid, wall budget). NO wall-derived
// value lives here; those are computed once by computeWallArithmetic() and merged in at write time.
const buildSizingCore = (rows: readonly CensusRow[]): { sizing: {
  nMatches: number; finiteMatchesForSigma: number;
  populations: { durationBinN: number[]; totalTurnoverWindows: number; nVacant: number; nOccupied: number } & Record<string, unknown>;
  pooledPrice: number; sigmaPerMatchPrice: number; mdl: number;
  nArithmetic: Record<string, unknown> & Partial<WallArithmetic>;
}; raw: SizingRaw } => {
  const W = W_PRICE_PRIMARY_S as WKey;
  const nMatches = rows.length;
  // per-match pooled price (finite matches only) → σ̂
  const perMatchPrice = rows.map((r) => {
    let aS = 0; let aN = 0; let bS = 0; let bN = 0;
    for (const w of r.windows) { if (isVac(w)) { aS += gvDeep(W)(w); aN += 1; } if (isOcc(w)) { bS += gvDeep(W)(w); bN += 1; } }
    return (aN === 0 || bN === 0) ? Number.NaN : aS / aN - bS / bN;
  });
  const sigma = sampleSd(perMatchPrice);
  const finiteMatches = perMatchPrice.filter(Number.isFinite).length;
  const pooledPrice = contrastCI(rows, isVac, isOcc, gvDeep(W), 100).point;
  const mdl = Math.min(0.5 * Math.abs(pooledPrice), MDL_ABS);

  // populations (the attainability-knee inputs)
  const perMatchWindows = rows.map((r) => r.windows.length);
  const binN = Array.from({ length: DURATION_BINS }, (_, b) => countWindows(rows, (w) => durBinOf(w) === b));
  const nVac = countWindows(rows, isVac); const nOcc = countWindows(rows, isOcc);
  const strataN: Record<string, number> = {};
  for (const c of CONTEXTS) for (const role of ROLE_AXIS) {
    strataN[`${c}:${role}`] = countWindows(rows, (w) => w.endContext === c && w.slotRole === role);
  }

  return {
    sizing: {
      nMatches, finiteMatchesForSigma: finiteMatches,
      populations: {
        perMatchWindowsMean: round(mean(perMatchWindows)),
        totalTurnoverWindows: countWindows(rows, allW),
        nVacant: nVac, nOccupied: nOcc, durationBinN: binN, strataN,
        dropsNoSampleTotal: sumBy(rows, (r) => r.drops.noSample),
        dropsNonTurnoverTotal: sumBy(rows, (r) => r.drops.nonTurnover),
      },
      pooledPrice: round(pooledPrice), sigmaPerMatchPrice: round(sigma), mdl: round(mdl),
      // DETERMINISTIC N-arithmetic fields only; the wall-derived fields are merged in at write time.
      nArithmetic: {
        mdlFormula: 'MDL = min( 0.5·|price_smoke| , 0.01 ) goal-value units',
        seFormula: 'SE_N = σ̂·√(1/N); resolve at 95 % power ⇒ SE_N ≤ MDL / 3.605 (POWER_Z)',
        nStarFormula: 'N* = smallest 200-step N with SE_N ≤ MDL/POWER_Z, capped at N_MAX',
        powerZ: POWER_Z, nStep: N_STEP, nCap: N_CAP, wallBudgetHours: WALL_BUDGET_HOURS,
      },
    },
    raw: { sigma, mdl, binN, nMatches },
  };
};

// FROZEN N arithmetic — the WALL-DERIVED half. Computed ONCE, from the run-1 per-match wall, OUTSIDE
// the X-DET-compared core. The FORMULA is unchanged (SE_N = σ̂·√(1/N); resolve MDL at 95 % power ⇒
// SE_N ≤ MDL/POWER_Z; N* = smallest 200-step N meeting it, capped at N_MAX; N_MAX wall-derived, hard
// cap 8,000): only its COMPUTATION LOCATION moved out of the deterministic projection (#122.2).
const computeWallArithmetic = (raw: SizingRaw, perMatchWallMs: number): WallArithmetic => {
  const { sigma, mdl, binN, nMatches } = raw;
  const wallStepN = (n: number): number => n * perMatchWallMs * XDET_FACTOR;
  let nMaxWall = 0;
  for (let n = N_STEP; n <= N_CAP; n += N_STEP) { if (wallStepN(n) <= WALL_BUDGET_MS) nMaxWall = n; }
  const nMax = Math.min(nMaxWall === 0 ? N_STEP : nMaxWall, N_CAP);

  let nStar: number; let underPowered = false; let note = 'resolvable at N* ≤ N_MAX';
  if (!Number.isFinite(sigma) || !Number.isFinite(mdl) || mdl <= 0) {
    nStar = nMax; underPowered = true;
    note = 'σ̂ or MDL undefined/zero (price ≈ 0 or < 2 finite matches) ⇒ N* := N_MAX; UNDER-POWERED (published); reads UNRESOLVED at the gate';
  } else {
    const needRaw = (POWER_Z * sigma / mdl) ** 2; // N such that σ̂·√(1/N)·POWER_Z ≤ MDL
    nStar = Math.min(Math.ceil(needRaw / N_STEP) * N_STEP, nMax);
    if (needRaw > nMax) { underPowered = true; note = 'N* > N_MAX ⇒ UNDER-POWERED (published); the census runs at N_MAX and the primary reads UNRESOLVED at the gate'; }
  }
  // attainability-knee: is the top duration bin populated enough to resolve at N*?
  const topBinRatePerMatch = binN[DURATION_BINS - 1] / (nMatches || 1);
  const projTopBinAtNStar = Math.round(topBinRatePerMatch * nStar);
  const seAtNStar = Number.isFinite(sigma) ? sigma * Math.sqrt(1 / nStar) : Number.NaN;
  const projectedPower = Number.isFinite(seAtNStar) && mdl > 0 ? round(phi(mdl / seAtNStar - Z_975), 4) : Number.NaN;

  return {
    perMatchWallMs: round(perMatchWallMs, 2), nMaxWall, nMax,
    nStar, nBinding: nStar, underPowered, reducedPowerDisclosure: underPowered,
    projectedRestBinTurnoversAtNStar: projTopBinAtNStar, projectedPrimaryPowerAtNStar: projectedPower,
    note: `${note}. Pass nStar as A4P1_N to the census. Attainability-knee: if the top duration bin `
      + 'or the vacant cell is structurally too rare, the monotone/ladder leg reads UNRESOLVED ⇒ the gate STOPS (an honest finding: the incumbent rarely vacates its own slot).',
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

  if (MODE === 'smoke') {
    const { sizing, raw } = buildSizingCore(rows);
    const core = {
      mode: 'smoke' as const, seedRange,
      seedFamily: '11,700,000 + k, k∈0..39 (sizing only; inside the reserved 11.7M–12.3M band; disjoint from census)',
      wPricePrimaryS: W_PRICE_PRIMARY_S,
      sizing,                    // DETERMINISTIC core; wall-derived N arithmetic merged at write time
      receipts: receiptOut,
    };
    return { core, wallMs: perMatchWallMs, sizingRaw: raw };
  }
  const primary = buildPrimary(rows);
  const ladder = buildLadder(rows);
  const simpson = buildSimpson(rows);
  const gate = evalGate(primary, ladder, simpson);
  const core = {
    mode: 'census' as const, seedRange,
    seedFamily: '11,800,000 + k, k∈0..N−1 (inside the reserved 11.7M–12.3M band; disjoint from smoke)',
    wPricePrimaryS: W_PRICE_PRIMARY_S, wPriceSensitivityS: W_PRICE_SENS_S,
    admittedPrices: { deep: { L: L_DEEP, ci: L_DEEP_CI }, box: { L: L_BOX, ci: L_BOX_CI }, note: 'shot-against DROPPED at P1 (non-monotone) — NOT used' },
    primaryPrice: primary,       // the pooled primary cell (the gate reads priceDeepPooled)
    durationLadder: ladder,      // the monotone axis
    simpsonExhibit: simpson,     // raw-pool vs stratified (context×role, #94.3)
    sensitivity: buildSensitivity(rows),
    gate,
    populations: {
      totalTurnoverWindows: countWindows(rows, allW),
      dropsNoSampleTotal: sumBy(rows, (r) => r.drops.noSample),
      dropsNonTurnoverTotal: sumBy(rows, (r) => r.drops.nonTurnover),
      windowsOpenedTotal: sumBy(rows, (r) => r.counts.windowsOpened),
      turnoversTotal: sumBy(rows, (r) => r.counts.turnovers),
    },
    receipts: receiptOut,
  };
  return { core, wallMs: perMatchWallMs, sizingRaw: null };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET (double-run), X-SRC-ZERO, seed disjointness, SHA, write.
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);
// X-DET compares the DETERMINISTIC core ONLY (no wall-derived value) — the #122.2 repair: the
// per-match wall (Date.now()) differs across the double-run, so it must live OUTSIDE the compare.
const { core: experiment, wallMs, sizingRaw } = runExperiment();
const experiment2 = SKIP_DET ? null : runExperiment().core;
const xDet = SKIP_DET ? null : canonical(experiment) === canonical(experiment2);

// WALL-DERIVED N arithmetic (smoke only): computed ONCE here, OUTSIDE the X-DET-compared core, from
// the RUN-1 per-match wall, then merged into the written §5 nArithmetic block (perMatchWallMs /
// nMaxWall / nMax / nStar / underPowered / disclosures) so the published artifact stays complete.
if (experiment.mode === 'smoke' && sizingRaw !== null) {
  experiment.sizing.nArithmetic = {
    ...experiment.sizing.nArithmetic, ...computeWallArithmetic(sizingRaw, wallMs),
  };
}

// X-SRC-ZERO (HARD): git diff --stat -- src empty + the production fingerprint unchanged.
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
const xSrcZero = srcDiff === '' && xFpProd;

// SEED DISJOINTNESS (HARD) — computed from the FROZEN family constants (design property).
const censusMaxSeed = CENSUS_SEED_BASE + N_CAP - 1; // 11,807,999
const smokeMaxSeed = SMOKE_SEED_BASE + SMOKE_MATCHES - 1; // 11,700,039
const seedDisjoint =
  SMOKE_SEED_BASE >= RESERVED_BAND[0] && censusMaxSeed <= RESERVED_BAND[1] // inside the reserved freeze
  && smokeMaxSeed < CENSUS_SEED_BASE; // smoke band ends below the census band (mutually disjoint)

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates = { xDet, xSrcZero, seedDisjoint };

// ---- the verdict (prereg §4/§7 readings) ----
let verdict: string;
if (IS_PREFLIGHT) {
  verdict = `PREFLIGHT (bounded, ${MODE}) — NOT a verdict; exercises the window construction + I5(b) `
    + 'occupancy + surrogate detectors + pricing + (census) gate/ladder/Simpson + (smoke) the N arithmetic '
    + '+ X-DET on a capped slice. Numbers on ≤ few matches are meaningless by design; nothing canonical written.';
} else if (xDet === false) {
  verdict = 'FAIL — X-DET: the output is not byte-identical across the double-run; STOP';
} else if (!xSrcZero) {
  verdict = 'FAIL — X-SRC-ZERO: src touched or the production fingerprint moved; STOP';
} else if (!seedDisjoint) {
  verdict = 'FAIL — SEED DISJOINTNESS: a seed family escaped the reserved band or collided; STOP';
} else if (MODE === 'smoke') {
  verdict = 'SIZING SMOKE — NOT a verdict (prereg §5): realizes the window/turnover populations, the pooled '
    + 'price σ̂, and pins the census N via the frozen arithmetic (labelled, non-gating). Pass nArithmetic.nStar as A4P1_N to the census.';
} else {
  const g = (experiment as Extract<typeof experiment, { mode: 'census' }>).gate;
  verdict = g.pass
    ? 'PASS (prereg §4) — MONOTONE, RESOLVEDLY NONZERO vacancy price; A4-P1 proceeds to A4-P2 (commander review + numbered ruling gate the transition, #126).'
    : 'STOP AT A4-P1 (prereg §4) — null/non-monotone vacancy price; no measured term for the M3 seam (I-A3). RETURNS to the user.';
  if (g.simpsonSignReversalFlag) verdict += ' ⚠ FLAG: pooled-vs-standardized (Simpson) sign reversal — surfaced for the commander.';
}

const body = {
  experiment: `A4-P1 (the vacancy census — the concession price of rest-defence-slot VACANCY) [${MODE}]`,
  authority: 'A4-P1-VACANCY-CENSUS §1-§7 (fork C folded in as calibration; opened #125, green path #126); '
    + 'contract A4-ASSIGNMENT-CONTRACT §4 (I-A1..I-A7); reuses the battery I5(b) occupancy + the P1 surrogate '
    + 'detectors + the admitted P1 prices + the P1 cluster bootstrap',
  head, mode: MODE,
  world: 'ENRICHED eye-null (#67.3: edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; '
    + 'c5TouchFork off; stationEye NULL — the world the P1 prices were calibrated on, #26.5/#68.2)',
  flags: CENSUS_FLAGS,
  perceptHonesty: 'N/A at A4-P1 — read-only measurement; NO consumer is built (that is A4-P2/P3). No percept '
    + 'is created, read, or leaked; the census only observes the world\'s own play.',
  preflight: IS_PREFLIGHT ? { cap: Number.isFinite(CAP) ? CAP : null, seedBase: SEED_BASE, skipFp: SKIP_FP, note: 'bounded preflight — writes OUTSIDE the canonical JSON; not a verdict' } : null,
  parameters: {
    matchCount: MATCH_COUNT, plannedMatches: PLANNED_MATCHES, nEnv: N_ENV,
    nCensus: MODE === 'census' ? N_CENSUS : null, nCap: N_CAP,
    seedBaseFrozen: FROZEN_BASE, seedBaseUsed: SEED_BASE,
    reservedBand: RESERVED_BAND, censusSeedBase: CENSUS_SEED_BASE, smokeSeedBase: SMOKE_SEED_BASE,
    censusSeedRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeSeedRange: [SMOKE_SEED_BASE, smokeMaxSeed],
    wPricePrimaryS: W_PRICE_PRIMARY_S, wPriceSensitivityS: W_PRICE_SENS_S,
    vacBinaryThresh: VAC_BINARY_THRESH, durationBinEdgesS: DURATION_BIN_EDGES_S,
    admittedPriceDeep: L_DEEP, admittedPriceBox: L_BOX,
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES, permSeedReserved: PERM_SEED_RESERVED,
    clusterUnit: 'match seed (#20)', sampleEvery: SAMPLE_EVERY, restThird: REST_THIRD,
    boxInnerLocalX: BOX_INNER_X, boxDepth: BOX_DEPTH, boxWidth: BOX_WIDTH,
    contexts: CONTEXTS, roleAxis: ROLE_AXIS,
  },
  result: experiment,
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xSrcZero: { pass: xSrcZero, srcDiffEmpty: srcDiff === '', srcDiff, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, matches: xFpProd, skipped: SKIP_FP },
    seedDisjoint: { pass: seedDisjoint, reservedBand: RESERVED_BAND, censusRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeRange: [SMOKE_SEED_BASE, smokeMaxSeed], note: 'computed from the FROZEN family constants (design property); preflight A4P1_SEED_BASE cannot shift it' },
    xCorpusIdent: 'N/A (a fresh observational corpus has no identity target — the P1 §4 precedent)',
  },
  gates,
  deviations: [
    'WINDOW = a run of constant m.possessionSide === d; closes on any change. TURNOVER close iff the new '
    + 'possessionSide === (1-d) AND playing (a live hand-off); loose/-1, restart and match-end closes are '
    + 'NON-TURNOVER (no live exposure) — counted, NOT priced. Only turnover-closed, ≥1-sample windows are priced.',
    'I5(b) OCCUPANCY reused VERBATIM from the P3p-3 battery (:757-763): a 6 Hz OWN-POSSESSION playing sample '
    + 'is OCCUPIED iff the index-1 outfield body (role!==GK, !sentOff) has t.localX(pos.x) < -REST_THIRD. '
    + 'vacFrac = vacantSamples/totalSamples; vacDurS = vacantSamples·SAMPLE_DT. BINARY VACANT iff vacFrac >= 0.5.',
    'The SURROGATE detectors (opponent deep entry, opponent box entry) reuse the P1 calibration probe VERBATIM '
    + '(:326-344), scored per DEFENDING side d on the null→true entry transition. Priced through the ADMITTED P1 '
    + 'lifts (deep 0.043455, box 0.195217); shot-against DROPPED at P1 (non-monotone) — NOT used.',
    'PRICING = downstream opponent deep/box entries suffered by d in (t_end, t_end + W_price]; PRIMARY W=10 s '
    + '(the certified P0b concede horizon), sensitivity {6 s,15 s} labelled non-gating. Goal value = nEvents·L. '
    + 'PRIMARY pricing surrogate = DEEP entry (rest-defence-natural, dense, avoids the deep⊃box double-count); '
    + 'box-priced reported in parallel (secondary). ⚠ FLAG: P1 PROPOSED box as primary (severity knee) but '
    + 'DEFERRED the designation to the consumer stage; A4-P1 picks deep — surfaced for the commander.',
    'THE FROZEN GATE = (i) pooled primary deep-priced price CI lower > 0 AND (ii) c0<=c1<=c2 over the '
    + 'vacancy-duration bins (edges 4 s,10 s from the P0 published lag grid) AND (iii) (bin2−bin0) contrast CI '
    + 'lower > 0. Any leg fails ⇒ STOP at A4-P1 (contract §4). Frozen before any run; smoke never informs it.',
    'CONFOUNDING (#94.3 Simpson) — stratified within context (turnover third) × slot-body role; standardized '
    + 'price = Σ w_s·price_s. The GATE binds on the POOLED primary cell (contract §4 language); the standardized '
    + 'price is a REPORTED robustness exhibit; a pooled-vs-standardized SIGN REVERSAL is FLAGGED, never silently passed.',
    'SIZING before floors (prereg §5): the smoke measures the window/turnover populations + the pooled price σ̂; '
    + 'the frozen arithmetic pins N* (SE_N ≤ MDL/POWER_Z), capped at a WALL-DERIVED N_MAX (≤ 12 h, hard-cap 8,000 '
    + 'keeps the census band inside the reserved 11.7M–12.3M freeze). Attainability-knee on the top duration bin; '
    + 'no optional stopping (#105.4).',
    'SEEDS inside the ratified 11.7M–12.3M band (#125.6): smoke 11.7M, census 11.8M, mutually disjoint. '
    + 'Stats seeds from 100003 (bootstrap); 100103 reserved-unused (no dispersion statistic).',
    'MODE is EXPLICIT via A4P1_MODE (no default); a bare invocation errors rather than silently running the wrong corpus.',
  ],
  registeredNonClaims: [
    'PRICES ABSENCE, BUILDS NO CONSUMER: A4-P1 measures the vacancy price on the world\'s own variation; it '
    + 'builds no M1–M5 mechanism, no assignment gene, no seam consumption (A4-P2/P3).',
    'PERCEPT-HONESTY N/A: read-only measurement; no percept is created or read.',
    'NOTHING SHIPS (Road B): EDS flags dormant, c6Carry/c7Windup probe-only, stationEye null, fingerprint 57b0bdab…c673 unchanged.',
    'A4-P1 CANNOT authorize A4-P2: only the commander\'s review of the census result opens A4-P2; a null/non-monotone price STOPS the arc here (contract §4).',
    'The admitted prices are P1\'s (labelled); the vacancy variation is measured FRESH on the A4-P1 census.',
  ],
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
const output = { ...body, sha256 };
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

// --- concise stderr line -----------------------------------------------------
if (MODE === 'smoke') {
  const s = (experiment as Extract<typeof experiment, { mode: 'smoke' }>).sizing;
  console.error(
    `A4-P1 ${verdict.slice(0, 52)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · smoke ${MATCH_COUNT}m`
    + ` · turnoverWins ${s.populations.totalTurnoverWindows} · vac/occ ${s.populations.nVacant}/${s.populations.nOccupied}`
    + ` · binN ${s.populations.durationBinN.join('/')} · price ${s.pooledPrice} · σ̂ ${s.sigmaPerMatchPrice}`
    + ` · N* ${s.nArithmetic.nStar} · xDet ${xDet} · xSrcZero ${xSrcZero} · disjoint ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
  );
} else {
  const c = (experiment as Extract<typeof experiment, { mode: 'census' }>);
  console.error(
    `A4-P1 ${verdict.slice(0, 52)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · census ${MATCH_COUNT}m (N_env ${N_ENV})`
    + ` · price ${c.primaryPrice.priceDeepPooled.point} [${c.primaryPrice.priceDeepPooled.lower}, ${c.primaryPrice.priceDeepPooled.upper}]`
    + ` · binCost ${c.durationLadder.binCost.map((b) => b.point).join('/')} · mono ${c.durationLadder.monotoneNonDecreasing}`
    + ` · pass ${c.gate.pass} · xDet ${xDet} · xSrcZero ${xSrcZero} · disjoint ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
  );
}
