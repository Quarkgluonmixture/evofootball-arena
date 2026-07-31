// STAGE III V4-P1 — THE CALIBRATION (surrogate → goal-value; CLASS H concede-face).
//
// Authority: docs/world-model/STAGE3-V4-P1-CALIBRATION.md (FROZEN pre-registration
// 2026-07-31, all sections) — OPENED by ruling #99.5 (V4-P0 closes, V4-P1 opens) and
// AUTHORIZED to build by ruling #100 (pre-reg reviewed PASS; flagged choices ratified;
// the box-entry PRIMARY designation DEFERRED to V4-P2 per #100.3 — P1's gate reads the
// resolved monotone ladder, not the primary choice). Under the v4 design contract
// STAGE3-V4-LONG-HORIZON-PRICE.md (I1-I11). OBSERVATIONAL, no forcing; ZERO src/**
// changes. Nothing ships (Road B): every EDS flag dormant in production, stationEye NULL
// in every production path, the fingerprint 57b0bdab…c673 unchanged throughout.
//
// WHAT P1 MEASURES (prereg §1/§2). For each concede-face surrogate S ∈ {opponent deep
// entry ≺ box entry ≺ shot-against} (increasing severity), the GOAL-VALUE of one S-event =
// the EXCESS probability the defending side d CONCEDES within a pinned horizon W_cal, over
// and above a matched same-match same-side background hazard — the LIFT L(S) = p_e − p_b in
// concessions/event. A surrogate ENTERS the calibration table (usable by V4-P2) only through
// the monotone-link gate (I3, HARD): RESOLVED (bootstrap CI lower > 0) AND non-decreasing in
// severity. ALL THREE DROP ⇒ CLASS H uncalibratable ⇒ STOP at the commander (contract §6).
// The eye is NULL (pure incumbent on the enriched #67.3 bundle) — P1 forces no body.
//
// COMMAND LINES (documented per prereg §8; the two REAL runs are the commander's, #49.5):
//   • SIZING SMOKE (real; writes the canonical smoke JSON, pins the census N):
//       V4P1_MODE=smoke npx tsx scripts/probes/stage3-v4-p1-calibration.ts
//     → 40 matches on seeds 9,900,000+k (k∈0..39), enriched eye-null; realizes r_S,
//       p̂_e/p̂_b, σ̂_S at W_cal=30 s; applies the FROZEN N ARITHMETIC and records N in
//       docs/world-model/data/stage3-v4-p1-sizing-smoke.json (SHA'd; X-DET double-run).
//   • CENSUS (real; N passed EXPLICITLY from the smoke output; writes the canonical table):
//       V4P1_MODE=census V4P1_N=<N from the smoke JSON's nArithmetic.N> \
//         npx tsx scripts/probes/stage3-v4-p1-calibration.ts
//     → N matches on seeds 9,800,000+k (k∈0..N−1), enriched eye-null; builds the
//       calibration table + monotone-link gate (read at W_cal=30 s) + conditional chain +
//       {15 s,45 s} sensitivity; writes docs/world-model/data/stage3-v4-p1-calibration.json
//       (SHA'd; X-DET double-run). N is capped at N_max=1,200 (prereg §2.5).
//   • BOUNDED PREFLIGHT A — the sizing path (detectors/baseline/lift/N-arithmetic + X-DET),
//     ≤8 matches on the SMOKE family, OUTSIDE the repo (never the canonical JSON):
//       V4P1_MODE=smoke V4P1_CAP=8 V4P1_OUT=/tmp/v4p1-smoke.json \
//         npx tsx scripts/probes/stage3-v4-p1-calibration.ts
//   • BOUNDED PREFLIGHT B — the gate/table path on toy numbers (census wiring, monotone
//     gate, conditional chain, sensitivity), ≤8 matches held on the SMOKE family via the
//     preflight-only seed-base override, OUTSIDE the repo:
//       V4P1_MODE=census V4P1_CAP=8 V4P1_N=8 V4P1_SEED_BASE=9900000 \
//         V4P1_OUT=/tmp/v4p1-census.json npx tsx scripts/probes/stage3-v4-p1-calibration.ts
//
// ENV KNOBS (preflight only; the two real runs touch only V4P1_MODE and — in census —
// V4P1_N): V4P1_CAP caps the match count (⇒ IS_PREFLIGHT: never writes the canonical JSON,
// verdict is NOT a verdict); V4P1_N = the census match count (REQUIRED in census mode,
// pinned from the smoke arithmetic; capped at N_max); V4P1_OUT redirects output to a scratch
// path; V4P1_SKIP_DET=1 skips the X-DET second whole-experiment run; V4P1_SEED_BASE shifts
// the seed base but is HONORED ONLY under a preflight cap (the real, uncapped corpus family
// can NEVER be shifted — the seed-disjointness gate reads the FROZEN constants, §D2 below).
//
// FLAGGED IMPLEMENTATION CHOICES (prereg §7 froze the FORM; these are the executor's
// documented operationalisations, each surfaced in the run's `deviations` block):
//   D1  THE MATCHED BASELINE (prereg §2.2/§7.1, the load-bearing construction). For each
//       S-event (defending side d, ordinal within (match,d,S)) exactly ONE comparison tick
//       is drawn deterministically from the eligible background set: same match, same side d,
//       phase='playing', OPPONENT-in-possession (ball.owner !== null && owner.side !== d),
//       EXCLUDING any tick inside a (t_e', t_e'+W] window of a same-type (same S) same-side
//       event. The draw uses a per-event uniform u = Rng(hashSeed(COMPARISON_SEED, matchSeed,
//       d, sIdx, ord)).next(), index = ⌊u·|eligible|⌋ — the frozen COMPARISON_SEED=98203 hash
//       exactly as the prereg specifies (u is W-independent; the eligible list narrows with W).
//       Events with an EMPTY eligible set are DROPPED from the baseline pairing and the drop
//       count is PUBLISHED (the "no anchor ⇒ dropped, published" convention). The SECONDARY,
//       non-gating baseline over ALL playing ticks (any possession, incl. loose) uses an
//       INDEPENDENT salted draw (hashSeed(…, ord, SECONDARY_SALT)) so the two baselines differ
//       only in the possession-face restriction.
//   D2  SEED FAMILIES + DISJOINTNESS (prereg §2.5/§7.8). Census 9,800,000+k, smoke
//       9,900,000+k; both strictly above the 9,700,399 fresh-reference ceiling and mutually
//       disjoint (census ≤ 9,801,199 < 9,900,000). The HARD gate is computed from the FROZEN
//       family constants (a design property), independent of any preflight V4P1_SEED_BASE.
//   D3  THE BOX-ENTRY GEOMETRY (prereg §2.1/§7.6) inlined READ-ONLY, mirroring
//       Match.inPenaltyBox (src/sim/Match.ts:2076-2080): |ball.y| ≤ BOX_WIDTH/2 AND (in the
//       team's attack-local frame, Team.localX = x·attackDir, own goal at localX=−HALF_L)
//       localX(ball.x) ≤ −(HALF_L − BOX_DEPTH). Team exposes NO localY; y is attackDir-
//       symmetric so |localY| ≡ |ball.y| and the width test uses world |ball.y| exactly as
//       inPenaltyBox does. BOX_DEPTH/BOX_WIDTH from src/sim/constants.ts:50-51. The deep-entry
//       and shot-against detectors are the P0b concede-channel detectors VERBATIM (see below).
//   D4  THE CONCESSION OUTCOME (prereg §2.1/§7.7) = a per-team stats.goals increment: side d
//       concedes at t iff teams[1−d].stats.goals increments at t (the exact P0b shots-channel
//       pattern applied to goals). y_e = 1 iff d concedes in the half-open (t_e, t_e+W_cal]
//       (strictly after; the P0b lag convention). W_cal primary 30 s; sensitivities 15/45 s.
//   D5  THE PER-MATCH ESTIMATOR is computed INSIDE the match runner and only compact per-
//       match units {eSum,eN,bSum,bN,drops} per (S, W, baseline) are returned — the large
//       per-tick background arrays are discarded per match (memory-bounded at the census N).
//       The pooled lift ΣeSum/ΣeN − ΣbSum/ΣbN and its match-cluster CI reuse the P0b
//       contrastCI engine VERBATIM (a=event, b=baseline); p_e/p_b reuse the cluster engine.
//   D6  THE CONDITIONAL CHAIN (prereg §2.2 point 2) uses W_link = W_cal primary (30 s) and
//       "same-possession" = same possession-spell id (a monotone counter bumped on each
//       m.possessionSide change). Incremental lifts L(box)−L(deep), L(shot)−L(box) get a
//       match-cluster CI over per-match units carrying all three surrogates (same resample).
//   D7  σ̂_S (prereg §2.5 sizing) = the sample standard deviation (n−1) of the per-match lift
//       (eSum/eN − bSum/bN, primary baseline, W=30) across the smoke matches; matches with
//       eN=0 or bN=0 give an undefined per-match lift and are EXCLUDED (count published). The
//       frozen SE≈σ̂_S/√N approximation (treating matches as iid units) is the prereg's, used
//       for SIZING only (non-gating); the census uses the real cluster bootstrap CI.
//   D8  X-DET = the WHOLE deterministic experiment payload computed TWICE and asserted
//       byte-identical (self-contained; P0b's E8 pattern). No X-CORPUS-IDENT (prereg §4 /
//       #100.2(v): a fresh corpus has no identity target). Fidelity = X-DET + X-SRC-ZERO +
//       seed disjointness.

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng, hashSeed } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING (prereg §2 / §2.5 / §3) — every constant pinned before any run.
// =============================================================================
// NEW disjoint seed families (#46.2). Census strictly above the 9,700,399 fresh-reference
// ceiling; smoke a further 100k band above census's N_max ceiling (9,801,199) — mutually
// disjoint. No permutation seed (I11: P1 has no dispersion statistic; 98103 reserved-unused).
const CENSUS_SEED_BASE = 9_800_000; // census: 9,800,000 + k, k∈0..N−1 (N ≤ 1,200 ⇒ ≤ 9,801,199)
const SMOKE_SEED_BASE = 9_900_000; // smoke: 9,900,000 + k, k∈0..39
const SMOKE_MATCHES = 40; // the frozen sizing-smoke corpus size
const N_MAX = 1_200; // the frozen census cap (prereg §2.5)
const FRESH_REF_CEIL = 9_700_399; // the P0/P0b fresh-reference band top (everything ≤ here is consumed)

// the cluster bootstrap (#20) + the matched comparison-tick draw — both FRESH, disjoint.
const BOOTSTRAP_SEED = 98_003; // match-cluster bootstrap
const BOOTSTRAP_RESAMPLES = 2_000;
const COMPARISON_SEED = 98_203; // per-event matched comparison-tick draws (D1)
const SECONDARY_SALT = 0x5ec0; // D1: salts the all-playing (secondary) baseline draw to independence
const PERM_SEED_RESERVED = 98_103; // reserved-unused (no permutation statistic; prereg §2)

// W_cal (prereg §2.3): PRIMARY 30 s pins the gate + the table; {15 s, 45 s} sensitivity
// (labelled, non-gating). W_link (the conditional chain, prereg §2.2) = the primary W_cal.
const W_CAL_PRIMARY_S = 30;
const W_CAL_SENSITIVITY_S = [15, 45] as const;
const W_ALL_S = [15, 30, 45] as const; // all computed; only W=30 is gate-bearing
const W_LINK_S = W_CAL_PRIMARY_S; // conditional-chain window (same-possession)

// instrument constants (prereg §2.1; deep entry = P0b concede detector verbatim; box = D3).
const REST_THIRD = HALF_L / 3; // I5 own-third depth (own-third entry; P0b/P3a REST_THIRD)
const BOX_INNER_X = -(HALF_L - BOX_DEPTH); // local-x of the box's outer edge from the own goal (D3)

const RECEIPT_CAP = 1_000; // per-class receipts cap (#49.3), first-N deterministic

// the ENRICHED census world (#67.3, verbatim from the P3a stage doc §3.2 / the P0/P0b probes)
// — with stationEye NULL (eye null). c5TouchFork off. This is the enriched-R0 eye-null census
// world the V4-P0/P0b fresh reference measured on (#26.5/#68.2 two-pin logic).
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// X-SRC-ZERO — the frozen shipped-world production fingerprint (P3a/P0b verbatim).
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

// PUBLISHED sizing anchors (prereg §2.5; freeze-honest banked constants — provenance only,
// NOT used in any computation; the smoke measures realized values fresh).
const PUBLISHED_SIZING_ANCHORS = {
  source: 'P3a §4.2 (goals 2.4962/match, r0Holds) + V4-P0b banked base rates / #96.5(iii)',
  concessionEventsPerMatch: 2.4962, // both sides ⇒ ≈ 1.248/side
  turnoversPerMatch: 51.335, // deep entries are turnover-scale (bounded by this)
  restartPhasesPerMatch: 12.6375,
  deliveryBuildupsPerMatch: 12.0825,
  passReleaseNearLinePerMatch: 44.1025,
  note: 'Shots-against/match is UN-published (the binding sizing constraint) ⇒ the smoke '
    + 'measures realized r_S, p̂_e/p̂_b, σ̂_S and the frozen arithmetic pins N (§2.5).',
} as const;

// the surrogate ladder in FROZEN severity order (deep ≺ box ≺ shot); sIdx = the hash/severity index.
const SURR = ['deep', 'box', 'shot'] as const;
type Surr = (typeof SURR)[number];
const SURR_LABEL: Record<Surr, string> = {
  deep: 'opponent deep entry (into own third)',
  box: 'opponent box entry',
  shot: 'shot-against',
};

// =============================================================================
// ENV / MODE (prereg §8). Two REAL modes (smoke, census); a bounded preflight caps either.
// =============================================================================
const MODE = process.env.V4P1_MODE;
if (MODE !== 'smoke' && MODE !== 'census') {
  console.error('V4-P1 FATAL — V4P1_MODE must be "smoke" or "census" (see the header command lines).');
  process.exit(2);
}
const CAP = process.env.V4P1_CAP ? Math.max(1, Number.parseInt(process.env.V4P1_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(CAP);
const SKIP_DET = process.env.V4P1_SKIP_DET === '1';
const N_ENV = process.env.V4P1_N ? Math.max(1, Number.parseInt(process.env.V4P1_N, 10)) : null;
if (MODE === 'census' && N_ENV === null) {
  console.error('V4-P1 FATAL — census mode requires V4P1_N (the census match count pinned from the smoke arithmetic).');
  process.exit(2);
}
const N_CENSUS = MODE === 'census' ? Math.min(N_ENV as number, N_MAX) : 0; // cap at N_max (prereg §2.5)
const FROZEN_BASE = MODE === 'smoke' ? SMOKE_SEED_BASE : CENSUS_SEED_BASE;
// V4P1_SEED_BASE is honored ONLY under a preflight cap — the real corpus family cannot be shifted (D2).
const SEED_BASE = (IS_PREFLIGHT && process.env.V4P1_SEED_BASE)
  ? Math.max(0, Number.parseInt(process.env.V4P1_SEED_BASE, 10)) : FROZEN_BASE;
const PLANNED_MATCHES = MODE === 'smoke' ? SMOKE_MATCHES : N_CENSUS;
const MATCH_COUNT = IS_PREFLIGHT ? Math.min(PLANNED_MATCHES, CAP) : PLANNED_MATCHES;
const SMOKE_OUT = 'docs/world-model/data/stage3-v4-p1-sizing-smoke.json';
const CENSUS_OUT = 'docs/world-model/data/stage3-v4-p1-calibration.json';
const OUT_PATH = process.env.V4P1_OUT ?? (MODE === 'smoke' ? SMOKE_OUT : CENSUS_OUT);

// =============================================================================
// SMALL NUMERIC HELPERS (P3a / P0b verbatim where shared).
// =============================================================================
const round = (v: number, dp = 6): number =>
  (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number =>
  (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const pct = (sorted: readonly number[], q: number): number => (sorted.length === 0
  ? Number.NaN
  : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]);
const sumBy = <T>(xs: readonly T[], f: (x: T) => number): number => xs.reduce((s, x) => s + f(x), 0);
// sample standard deviation (n−1) over the finite values (D7).
const sampleSd = (xs: readonly number[]): number => {
  const f = xs.filter(Number.isFinite);
  if (f.length < 2) return Number.NaN;
  const m = f.reduce((s, x) => s + x, 0) / f.length;
  const v = f.reduce((s, x) => s + (x - m) * (x - m), 0) / (f.length - 1);
  return Math.sqrt(v);
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
// THE ENRICHED MATCH FIXTURE (= the census world; P3a/P0b verbatim). Eye NULL (no arming).
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
// THE MATCH RUNNER (prereg §2.1/§2.2). One enriched eye-null match → the compact per-match
// estimator units (D5). Detects the three surrogates + the concession stream, records the
// background ticks, then draws the matched comparison ticks and builds {eSum,eN,bSum,bN}.
// =============================================================================
type WKey = 15 | 30 | 45;
interface BaselineCell { bSum: number; bN: number; drops: number }
interface Cell { eSum: number; eN: number; pri: BaselineCell; sec: BaselineCell }
interface CalRow {
  seed: number;
  cells: Record<Surr, Record<WKey, Cell>>;
  // conditional chain per-match counts (W_link = 30 s, same possession-spell) (D6):
  chain: { deepN: number; boxFromDeep: number; boxN: number; shotFromBox: number };
}
interface SEvent { t: number; sp: number } // event time (s) + possession-spell id

// binary search: first index i with arr[i] >= x (lower bound); arr ascending.
const lowerBound = (arr: readonly number[], x: number): number => {
  let lo = 0; let hi = arr.length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (arr[mid] < x) lo = mid + 1; else hi = mid; }
  return lo;
};
// D4: does side d concede in (t0, t0 + W]? (conc ascending)
const concededWithin = (conc: readonly number[], t0: number, W: number): number => {
  const i = lowerBound(conc, t0 + 1e-9); // first strictly after t0
  return (i < conc.length && conc[i] <= t0 + W) ? 1 : 0;
};
// D1 exclusion: is t inside any (e', e'+W] window of a same-type event? (evTimes ascending)
const inExclusion = (evTimes: readonly number[], t: number, W: number): boolean => {
  // need an event e with t − W ≤ e < t (⟺ e' < t ≤ e'+W). Find first e ≥ t−W, test e < t.
  const i = lowerBound(evTimes, t - W);
  return i < evTimes.length && evTimes[i] < t - 1e-9;
};

const runCalMatch = (seed: number, receipts: ReceiptBook | null): CalRow => {
  const m = matchOf(seed); // enriched flags; stationEye stays NULL (eye null; no arming)

  // per (side, surrogate) event streams (chronological ⇒ ascending in t).
  const events: [Record<Surr, SEvent[]>, Record<Surr, SEvent[]>] = [
    { deep: [], box: [], shot: [] },
    { deep: [], box: [], shot: [] },
  ];
  const concessions: [number[], number[]] = [[], []]; // per defending side, ascending
  const bg: { t: number; own: number }[] = []; // every playing tick: own = owner side (0|1) or −1 loose

  // event-detection state
  const prevShots: [number, number] = [m.teams[0].stats.shots, m.teams[1].stats.shots];
  const prevGoals: [number, number] = [m.teams[0].stats.goals, m.teams[1].stats.goals];
  const deepPrev: [boolean, boolean] = [false, false];
  const boxPrev: [boolean, boolean] = [false, false];
  let spellId = 0;
  let prevPossSpell = -2;

  while (!m.finished) {
    m.step(DT);
    if (m.finished) break;

    const playing = m.phase === 'playing';
    const owner = m.ball.owner;
    const nowT = m.simTime;
    const tick = m.simTick;

    // possession-spell id (D6): bump on each change to a valid possession side.
    if (m.possessionSide !== -1 && m.possessionSide !== prevPossSpell) {
      spellId += 1;
      prevPossSpell = m.possessionSide;
    }

    // background ticks (D1): every playing tick, with the instantaneous owner side.
    if (playing) bg.push({ t: nowT, own: owner !== null ? (owner.side as 0 | 1) : -1 });

    // --- deep entry (P0b concede detector VERBATIM, :567-573) + box entry (NEW, D3) ---
    for (const d of [0, 1] as const) {
      const tm = m.teams[d];
      const oppOwns = owner !== null && owner.side !== d;
      const lx = tm.localX(m.ball.pos.x);
      const deepNow = oppOwns && playing && lx < -REST_THIRD;
      if (deepNow && !deepPrev[d]) {
        events[d].deep.push({ t: nowT, sp: spellId });
        addReceipt(receipts, 'deep-entry', seed, tick, owner?.gid ?? -1, `d${d} sp${spellId} lx=${round(lx, 2)}`);
      }
      deepPrev[d] = deepNow;
      // box: mirrors Match.inPenaltyBox (localX ≤ −(HALF_L−BOX_DEPTH) AND |ball.y| ≤ BOX_WIDTH/2).
      const boxNow = oppOwns && playing && lx <= BOX_INNER_X && Math.abs(m.ball.pos.y) <= BOX_WIDTH / 2;
      if (boxNow && !boxPrev[d]) {
        events[d].box.push({ t: nowT, sp: spellId });
        addReceipt(receipts, 'box-entry', seed, tick, owner?.gid ?? -1, `d${d} sp${spellId} lx=${round(lx, 2)}`);
      }
      boxPrev[d] = boxNow;
    }

    // --- shot-against (P0b concede channel VERBATIM, :557-566): opp shots increment ⇒ d=1−side ---
    for (const side of [0, 1] as const) {
      const shotsNow = m.teams[side].stats.shots;
      if (shotsNow > prevShots[side]) {
        const n = shotsNow - prevShots[side];
        const d = (1 - side) as 0 | 1;
        for (let i = 0; i < n; i++) events[d].shot.push({ t: nowT, sp: spellId });
        addReceipt(receipts, 'shot-against', seed, tick, -1, `d${d} sp${spellId} n${n}`);
      }
      prevShots[side] = shotsNow;
    }

    // --- concession outcome (D4): opponent's per-team stats.goals increment ---
    for (const side of [0, 1] as const) {
      const gNow = m.teams[side].stats.goals;
      if (gNow > prevGoals[side]) {
        const n = gNow - prevGoals[side];
        const d = (1 - side) as 0 | 1; // the side that CONCEDES
        for (let i = 0; i < n; i++) concessions[d].push(nowT);
        addReceipt(receipts, 'concession', seed, tick, -1, `d${d} n${n}`);
      }
      prevGoals[side] = gNow;
    }
  }

  // ---- the per-match estimator (D5): draw comparison ticks, build compact units ----
  const emptyCell = (): Cell => ({ eSum: 0, eN: 0, pri: { bSum: 0, bN: 0, drops: 0 }, sec: { bSum: 0, bN: 0, drops: 0 } });
  const cells = {
    deep: { 15: emptyCell(), 30: emptyCell(), 45: emptyCell() },
    box: { 15: emptyCell(), 30: emptyCell(), 45: emptyCell() },
    shot: { 15: emptyCell(), 30: emptyCell(), 45: emptyCell() },
  } as Record<Surr, Record<WKey, Cell>>;

  for (let sIdx = 0; sIdx < SURR.length; sIdx++) {
    const S = SURR[sIdx];
    for (const W of W_ALL_S) {
      const cell = cells[S][W as WKey];
      for (const d of [0, 1] as const) {
        const ev = events[d][S];
        if (ev.length === 0) continue;
        const evTimes = ev.map((e) => e.t); // ascending
        // build the two eligible tick lists ONCE per (d, S, W) (D1).
        const eligPri: number[] = [];
        const eligSec: number[] = [];
        for (const b of bg) {
          if (inExclusion(evTimes, b.t, W)) continue; // uncontaminated background
          eligSec.push(b.t); // secondary: ALL playing ticks (any possession)
          if (b.own !== -1 && b.own !== d) eligPri.push(b.t); // primary: OPPONENT in possession
        }
        // draw one comparison tick per event; deterministic per-event hash (COMPARISON_SEED).
        for (let ord = 0; ord < ev.length; ord++) {
          const te = ev[ord].t;
          const ye = concededWithin(concessions[d], te, W);
          cell.eSum += ye; cell.eN += 1;
          // PRIMARY draw
          if (eligPri.length > 0) {
            const u = new Rng(hashSeed(COMPARISON_SEED, seed, d, sIdx, ord)).next();
            const tc = eligPri[Math.min(eligPri.length - 1, Math.floor(u * eligPri.length))];
            cell.pri.bSum += concededWithin(concessions[d], tc, W); cell.pri.bN += 1;
            if (W === 30) addReceipt(receipts, 'comparison-tick', seed, Math.round(tc / DT), -1, `${S} d${d} ord${ord} pri`);
          } else cell.pri.drops += 1;
          // SECONDARY draw (independent, salted)
          if (eligSec.length > 0) {
            const u2 = new Rng(hashSeed(COMPARISON_SEED, seed, d, sIdx, ord, SECONDARY_SALT)).next();
            const tc2 = eligSec[Math.min(eligSec.length - 1, Math.floor(u2 * eligSec.length))];
            cell.sec.bSum += concededWithin(concessions[d], tc2, W); cell.sec.bN += 1;
          } else cell.sec.drops += 1;
        }
      }
    }
  }

  // ---- conditional chain per-match counts (D6): W_link = 30 s, same possession-spell ----
  let deepN = 0; let boxFromDeep = 0; let boxN = 0; let shotFromBox = 0;
  for (const d of [0, 1] as const) {
    const deep = events[d].deep; const box = events[d].box; const shot = events[d].shot;
    for (const e of deep) {
      deepN += 1;
      if (box.some((b) => b.sp === e.sp && b.t > e.t && b.t <= e.t + W_LINK_S)) boxFromDeep += 1;
    }
    for (const e of box) {
      boxN += 1;
      if (shot.some((s) => s.sp === e.sp && s.t > e.t && s.t <= e.t + W_LINK_S)) shotFromBox += 1;
    }
  }
  return { seed, cells, chain: { deepN, boxFromDeep, boxN, shotFromBox } };
};

// =============================================================================
// STATISTICS — the match-cluster bootstrap (#20), P0b engine VERBATIM (BOOTSTRAP_SEED=98003).
// =============================================================================
const clusterCI = <A>(
  units: readonly A[], stat: (sample: readonly A[]) => number, offset: number,
): { point: number; lower: number; upper: number; n: number } => {
  const point = stat(units);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  const n = units.length;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const sample: A[] = [];
    for (let i = 0; i < n; i++) sample.push(units[rng.int(0, n - 1)]);
    const v = stat(sample);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  return { point: round(point), lower: round(pct(draws, 0.025)), upper: round(pct(draws, 0.975)), n };
};

// proportion (hazard) CI: units = per-match {sum,n}; stat = Σsum/Σn.
const rateCI = (units: readonly { sum: number; n: number }[], offset: number) => {
  const stat = (s: readonly { sum: number; n: number }[]): number => {
    let a = 0; let b = 0; for (const u of s) { a += u.sum; b += u.n; } return b === 0 ? Number.NaN : a / b;
  };
  return clusterCI(units, stat, offset);
};

// THE LIFT CI (prereg §2.2): the P0b contrastCI engine VERBATIM — a=event, b=baseline.
// units = per-match {aSum=eSum, aN=eN, bSum, bN}; stat = ΣeSum/ΣeN − ΣbSum/ΣbN.
const contrastCI = (
  units: readonly { aSum: number; aN: number; bSum: number; bN: number }[], offset: number,
) => {
  const stat = (s: readonly { aSum: number; aN: number; bSum: number; bN: number }[]): number => {
    let aS = 0; let aN = 0; let bS = 0; let bN = 0;
    for (const u of s) { aS += u.aSum; aN += u.aN; bS += u.bSum; bN += u.bN; }
    if (aN === 0 || bN === 0) return Number.NaN;
    return aS / aN - bS / bN;
  };
  return clusterCI(units, stat, offset);
};

// distinct, deterministic bootstrap offsets per (surrogate, W, statistic).
const wIdxOf = (W: number): number => (W === 15 ? 0 : W === 30 ? 1 : 2);
const off = (sIdx: number, wIdx: number, statCode: number): number => 100 + sIdx * 100 + wIdx * 10 + statCode;

// =============================================================================
// THE CALIBRATION TABLE (prereg §2.2 / §4a) — per surrogate, at one window W.
// =============================================================================
const buildTable = (rows: readonly CalRow[], W: WKey) => {
  const wIdx = wIdxOf(W);
  return SURR.map((S, sIdx) => {
    const cell = (r: CalRow) => r.cells[S][W];
    const eN = sumBy(rows, (r) => cell(r).eN);
    const pE = rateCI(rows.map((r) => ({ sum: cell(r).eSum, n: cell(r).eN })), off(sIdx, wIdx, 0));
    const pBpri = rateCI(rows.map((r) => ({ sum: cell(r).pri.bSum, n: cell(r).pri.bN })), off(sIdx, wIdx, 1));
    const pBsec = rateCI(rows.map((r) => ({ sum: cell(r).sec.bSum, n: cell(r).sec.bN })), off(sIdx, wIdx, 2));
    const lift = contrastCI(rows.map((r) => ({ aSum: cell(r).eSum, aN: cell(r).eN, bSum: cell(r).pri.bSum, bN: cell(r).pri.bN })), off(sIdx, wIdx, 3));
    const liftSec = contrastCI(rows.map((r) => ({ aSum: cell(r).eSum, aN: cell(r).eN, bSum: cell(r).sec.bSum, bN: cell(r).sec.bN })), off(sIdx, wIdx, 4));
    const resolved = Number.isFinite(lift.lower) && lift.lower > 0; // RESOLVED(S) ⟺ CI lower > 0 (prereg §2.4)
    return {
      surrogate: S, label: SURR_LABEL[S], sIdx, wCalS: W,
      eN, rS: round(eN / rows.length),
      pE, pBprimary: pBpri, pBsecondary: pBsec,
      lift, liftSecondary: liftSec,
      dropsPrimary: sumBy(rows, (r) => cell(r).pri.drops),
      dropsSecondary: sumBy(rows, (r) => cell(r).sec.drops),
      resolved,
    };
  });
};
type TableRow = ReturnType<typeof buildTable>[number];

// =============================================================================
// THE MONOTONE-LINK GATE (prereg §2.4, I3 HARD) — deterministic left-anchored greedy.
// Read at the PRIMARY W_cal = 30 s only.
// =============================================================================
const monotoneGate = (table30: readonly TableRow[]) => {
  let lastAccepted = Number.NEGATIVE_INFINITY;
  const perSurrogate = table30.map((t) => {
    let admitted = false; let dropReason: string | null = null;
    if (!t.resolved) {
      dropReason = 'unresolved lift (match-cluster CI lower ≤ 0)';
    } else if (t.lift.point >= lastAccepted) {
      admitted = true; lastAccepted = t.lift.point;
    } else {
      dropReason = 'non-monotone — point lift below a milder admitted surrogate';
    }
    return {
      surrogate: t.surrogate, label: t.label, resolved: t.resolved,
      pointLift: t.lift.point, ciLower: t.lift.lower, ciUpper: t.lift.upper,
      admitted, dropReason,
    };
  });
  const admittedSet = perSurrogate.filter((p) => p.admitted).map((p) => p.surrogate);
  const boxRow = perSurrogate.find((p) => p.surrogate === 'box');
  return {
    readAtWCalS: W_CAL_PRIMARY_S,
    ordering: 'deep ≺ box ≺ shot (increasing severity)',
    monotoneRequirement: 'L(deep) ≤ L(box) ≤ L(shot)',
    admission: 'deterministic left-anchored greedy (§2.4): admit iff RESOLVED and point lift ≥ last admitted; drops PUBLISHED, never patched',
    perSurrogate,
    admittedSet,
    allDropped: admittedSet.length === 0,
    proposedPrimaryBoxDropped: boxRow ? !boxRow.admitted : true,
    primaryDesignationNote: 'PROPOSED primary = box entry (severity knee); the FINAL per-channel '
      + 'primary designation is DEFERRED to the V4-P2 pre-registration with this table in hand '
      + '(ruling #100.3). P1 gates on the resolved monotone ladder, not on the primary choice.',
  };
};

// =============================================================================
// THE CONDITIONAL CHAIN (prereg §2.2 point 2, labelled/descriptive/non-gating).
// =============================================================================
const incrementalLiftCI = (
  rows: readonly CalRow[], hi: Surr, lo: Surr, offset: number,
) => {
  const liftOf = (s: readonly CalRow[], S: Surr): number => {
    let eS = 0; let eN = 0; let bS = 0; let bN = 0;
    for (const r of s) { const c = r.cells[S][30]; eS += c.eSum; eN += c.eN; bS += c.pri.bSum; bN += c.pri.bN; }
    if (eN === 0 || bN === 0) return Number.NaN;
    return eS / eN - bS / bN;
  };
  const stat = (s: readonly CalRow[]): number => liftOf(s, hi) - liftOf(s, lo);
  return clusterCI(rows, stat, offset);
};
const buildConditionalChain = (rows: readonly CalRow[]) => {
  const pBoxGivenDeep = rateCI(rows.map((r) => ({ sum: r.chain.boxFromDeep, n: r.chain.deepN })), 900);
  const pShotGivenBox = rateCI(rows.map((r) => ({ sum: r.chain.shotFromBox, n: r.chain.boxN })), 901);
  return {
    wLinkS: W_LINK_S, samePossession: true,
    pBoxGivenDeep, pShotGivenBox,
    incrementalLifts: {
      boxMinusDeep: incrementalLiftCI(rows, 'box', 'deep', 910),
      shotMinusBox: incrementalLiftCI(rows, 'shot', 'box', 911),
    },
    note: 'DESCRIPTIVE (prereg §2.2): nesting is by severity/proximity (empirically near-nested, '
      + 'not strict set containment — a shot may originate outside the box). The chain reports '
      + 'the actual measured overlap so the double-counting is a quantity, not an assumption.',
  };
};

// =============================================================================
// THE SIZING SMOKE (prereg §2.5) — realized rates + the FROZEN N ARITHMETIC.
// =============================================================================
const buildSizing = (rows: readonly CalRow[]) => {
  const wIdx = wIdxOf(30);
  const perSurrogate = SURR.map((S, sIdx) => {
    const cell = (r: CalRow) => r.cells[S][30];
    const eN = sumBy(rows, (r) => cell(r).eN);
    const rS = eN / rows.length;
    const pE = rateCI(rows.map((r) => ({ sum: cell(r).eSum, n: cell(r).eN })), off(sIdx, wIdx, 0));
    const pBpri = rateCI(rows.map((r) => ({ sum: cell(r).pri.bSum, n: cell(r).pri.bN })), off(sIdx, wIdx, 1));
    const eSumTot = sumBy(rows, (r) => cell(r).eSum);
    const bSumTot = sumBy(rows, (r) => cell(r).pri.bSum);
    const bNtot = sumBy(rows, (r) => cell(r).pri.bN);
    const pLift = (eN === 0 ? Number.NaN : eSumTot / eN) - (bNtot === 0 ? Number.NaN : bSumTot / bNtot);
    // per-match lift (finite matches only) → σ̂_S (D7)
    const perMatchLifts = rows.map((r) => {
      const c = cell(r);
      return (c.eN === 0 || c.pri.bN === 0) ? Number.NaN : c.eSum / c.eN - c.pri.bSum / c.pri.bN;
    });
    const sigma = sampleSd(perMatchLifts);
    const finiteMatchesForSigma = perMatchLifts.filter(Number.isFinite).length;
    // THE FROZEN N ARITHMETIC (prereg §2.5): MDL_S = min(0.5·|p̂_lift|, 0.01);
    //   N_S = ⌈(1.96·σ̂_S / MDL_S)²⌉ ; under-powered if N_S > N_max or σ̂/MDL undefined.
    const mdl = Math.min(0.5 * Math.abs(pLift), 0.01);
    let nS: number; let underPowered = false; let nNote = 'resolvable at N_S ≤ N_max';
    if (!Number.isFinite(sigma) || !Number.isFinite(mdl) || mdl <= 0) {
      nS = N_MAX; underPowered = true;
      nNote = 'σ̂_S or MDL_S undefined/zero (p̂_lift ≈ 0 or < 2 finite matches) ⇒ N_S := N_max; UNDER-POWERED (published, never pooled — #24/#44.5); reads UNRESOLVED at the gate';
    } else {
      nS = Math.ceil((1.96 * sigma / mdl) ** 2);
      if (nS > N_MAX) { underPowered = true; nNote = 'N_S > N_max ⇒ UNDER-POWERED (published, never pooled — #24/#44.5); the census runs at N and this lift reads UNRESOLVED at the gate'; }
    }
    return {
      surrogate: S, label: SURR_LABEL[S], rS: round(rS), eN,
      pE, pBprimary: pBpri, pooledLift: round(pLift),
      sigmaPerMatchLift: round(sigma), finiteMatchesForSigma,
      mdl: round(mdl), nS, underPowered, note: nNote,
    };
  });
  const nSmax = Math.max(...perSurrogate.map((p) => p.nS));
  const N = Math.min(nSmax, N_MAX);
  return {
    perSurrogate,
    nArithmetic: {
      mdlFormula: 'MDL_S = min( 0.5·|p̂_lift_smoke(S)| , 0.01 ) concessions/event',
      nSFormula: 'N_S = ceil( (1.96·σ̂_S / MDL_S)^2 )',
      nFormula: 'N = min( max_S N_S , N_max )',
      nMax: N_MAX,
      perSurrogate: perSurrogate.map((p) => ({ surrogate: p.surrogate, sigmaPerMatchLift: p.sigmaPerMatchLift, mdl: p.mdl, nS: p.nS, underPowered: p.underPowered })),
      nSmax,
      N,
      note: 'N is a DETERMINISTIC function of this smoke (#44.5/#65). Pass it to the census as '
        + 'V4P1_N=<N>. A surrogate with N_S > N_max is under-powered, published never pooled, and '
        + 'reads UNRESOLVED at the gate; the census still runs at N.',
    },
  };
};

// =============================================================================
// THE DETERMINISTIC EXPERIMENT (run TWICE for X-DET, D8) — mode-dispatched payload.
// =============================================================================
const runExperiment = () => {
  const seeds: number[] = [];
  for (let k = 0; k < MATCH_COUNT; k++) seeds.push(SEED_BASE + k);
  const receipts: ReceiptBook = {};
  const rows: CalRow[] = seeds.map((s) => runCalMatch(s, receipts));

  const seedRange = { first: seeds[0] ?? null, last: seeds[seeds.length - 1] ?? null, count: seeds.length };
  const receiptOut = {
    cap: RECEIPT_CAP,
    counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])),
    records: receipts,
  };

  if (MODE === 'smoke') {
    const sizing = buildSizing(rows);
    return {
      mode: 'smoke' as const,
      seedRange,
      seedFamily: '9,900,000 + k, k∈0..39 (sizing only; disjoint)',
      wCalPrimaryS: W_CAL_PRIMARY_S,
      sizing: sizing.perSurrogate,
      nArithmetic: sizing.nArithmetic,
      receipts: receiptOut,
    };
  }
  // census
  const table30 = buildTable(rows, 30);
  const table15 = buildTable(rows, 15);
  const table45 = buildTable(rows, 45);
  const gate = monotoneGate(table30);
  const chain = buildConditionalChain(rows);
  return {
    mode: 'census' as const,
    seedRange,
    seedFamily: '9,800,000 + k, k∈0..N−1 (N ≤ 1,200; disjoint)',
    wCalPrimaryS: W_CAL_PRIMARY_S,
    wCalSensitivityS: W_CAL_SENSITIVITY_S,
    calibrationTable: table30, // the ONLY substantive output (prereg §4), read at 30 s
    monotoneGate: gate,
    conditionalChain: chain,
    sensitivity: {
      note: 'labelled, NON-GATING (prereg §2.3/§4c): the lift table re-read at {15 s, 45 s}. '
        + 'The gate + primary table read the PRIMARY 30 s window ONLY.',
      w15: table15,
      w45: table45,
    },
    receipts: receiptOut,
  };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET (double-run, D8), X-SRC-ZERO, seed disjointness, SHA, write.
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);

const experiment = runExperiment();
const experiment2 = SKIP_DET ? null : runExperiment();
const xDet = SKIP_DET ? null : canonical(experiment) === canonical(experiment2);

// X-SRC-ZERO (HARD): git diff --stat -- src empty + the production fingerprint unchanged.
let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
const fpLeague = new League({ seed: FINGERPRINT_SEED });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
});
const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
const xFpProd = fingerprint === FINGERPRINT_BASELINE;
const xSrcZero = srcDiff === '' && xFpProd;

// SEED DISJOINTNESS (HARD, D2) — computed from the FROZEN family constants (a design
// property; independent of any preflight V4P1_SEED_BASE override).
const censusMaxSeed = CENSUS_SEED_BASE + N_MAX - 1; // 9,801,199
const smokeMaxSeed = SMOKE_SEED_BASE + SMOKE_MATCHES - 1; // 9,900,039
const seedDisjoint =
  CENSUS_SEED_BASE > FRESH_REF_CEIL // census above every consumed range
  && SMOKE_SEED_BASE > FRESH_REF_CEIL // smoke above every consumed range
  && censusMaxSeed < SMOKE_SEED_BASE; // census band ends below the smoke band (mutually disjoint)

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates = {
  xDet, // HARD (whole output twice byte-identical); null when skipped (preflight)
  xSrcZero, // HARD
  seedDisjoint, // HARD (design property, frozen constants)
};

// ---- the verdict (prereg §5 readings) ----
let verdict: string;
if (IS_PREFLIGHT) {
  verdict = `PREFLIGHT (bounded, ${MODE}) — NOT a verdict; exercises the detectors + matched `
    + 'baseline + lift + (census) gate/chain/sensitivity + (smoke) the N arithmetic + X-DET on '
    + 'a capped slice. Numbers on ≤ few matches are meaningless by design; nothing canonical written.';
} else if (xDet === false) {
  verdict = 'FAIL — X-DET (§5 reading D): the output is not byte-identical across the double-run; STOP';
} else if (!xSrcZero) {
  verdict = 'FAIL — X-SRC-ZERO (§5 reading D): src touched or the production fingerprint moved; STOP';
} else if (!seedDisjoint) {
  verdict = 'FAIL — SEED DISJOINTNESS (§5 reading D): a seed family collides; STOP';
} else if (MODE === 'smoke') {
  verdict = 'SIZING SMOKE — NOT a verdict (prereg §2.5, #44.5/#65): realizes r_S, p̂_e/p̂_b, σ̂_S and '
    + 'pins the census N via the frozen arithmetic (labelled, non-gating). Pass nArithmetic.N as V4P1_N to the census.';
} else {
  const gate = (experiment as Extract<typeof experiment, { mode: 'census' }>).monotoneGate;
  if (gate.allDropped) {
    verdict = 'STOP AT COMMANDER — CLASS H UNCALIBRATABLE (§5 reading C): no surrogate resolved a '
      + 'monotone positive lift; V4-P2 does not run on an empty table (contract §6). No re-cut.';
  } else if (gate.admittedSet.length === 3) {
    verdict = 'ALL THREE ADMIT (§5 reading A) — RETURNS to the commander with the calibration table; '
      + 'this reading licenses V4-P2 (the occupancy census). Only the commander opens V4-P2.';
  } else {
    verdict = `SOME ADMIT, SOME DROP (§5 reading B) — admitted [${gate.admittedSet.join(', ')}]; `
      + 'dropped surrogates PUBLISHED, never patched. RETURNS to the commander.'
      + (gate.proposedPrimaryBoxDropped
        ? ' NOTE: the PROPOSED primary (box entry) DROPPED — the commander redesignates an admitted alternative at V4-P2 (#100.3/§5-B) or treats the channel as uncalibrated.'
        : '');
  }
}

const body = {
  experiment: `STAGE3-V4-P1 (the calibration — surrogate → goal-value; CLASS H concede-face) [${MODE}]`,
  authority: 'STAGE3-V4-P1-CALIBRATION §1-§8 (opened #99.5, authorized #100; box-primary DEFERRED '
    + '#100.3); contract STAGE3-V4-LONG-HORIZON-PRICE (I1-I11); reuses the P0b probe machinery',
  head,
  mode: MODE,
  world: 'ENRICHED eye-null (#67.3: edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; '
    + 'c5TouchFork off; stationEye NULL — pure incumbent, no forcing)',
  flags: CENSUS_FLAGS,
  preflight: IS_PREFLIGHT ? { cap: Number.isFinite(CAP) ? CAP : null, seedBase: SEED_BASE, note: 'bounded preflight — writes OUTSIDE the canonical JSON; not a verdict' } : null,
  parameters: {
    matchCount: MATCH_COUNT,
    plannedMatches: PLANNED_MATCHES,
    nEnv: N_ENV,
    nCensus: MODE === 'census' ? N_CENSUS : null,
    nMax: N_MAX,
    nSource: MODE === 'census' ? 'V4P1_N env (pinned from the sizing smoke arithmetic; capped at N_max)' : null,
    seedBaseFrozen: FROZEN_BASE,
    seedBaseUsed: SEED_BASE,
    censusSeedBase: CENSUS_SEED_BASE, smokeSeedBase: SMOKE_SEED_BASE, smokeMatches: SMOKE_MATCHES,
    freshReferenceCeiling: FRESH_REF_CEIL,
    censusSeedRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeSeedRange: [SMOKE_SEED_BASE, smokeMaxSeed],
    wCalPrimaryS: W_CAL_PRIMARY_S, wCalSensitivityS: W_CAL_SENSITIVITY_S, wLinkS: W_LINK_S,
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
    comparisonSeed: COMPARISON_SEED, secondarySalt: SECONDARY_SALT,
    permSeedReserved: PERM_SEED_RESERVED,
    clusterUnit: 'match seed (#20)',
    restThird: REST_THIRD, boxInnerLocalX: BOX_INNER_X, boxDepth: BOX_DEPTH, boxWidth: BOX_WIDTH,
    surrogateOrder: SURR, surrogateLabels: SURR_LABEL,
    publishedSizingAnchors: PUBLISHED_SIZING_ANCHORS,
  },
  result: experiment,
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xSrcZero: { pass: xSrcZero, srcDiffEmpty: srcDiff === '', srcDiff, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, matches: xFpProd },
    seedDisjoint: { pass: seedDisjoint, censusRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeRange: [SMOKE_SEED_BASE, smokeMaxSeed], freshReferenceCeiling: FRESH_REF_CEIL, note: 'computed from the FROZEN family constants (design property); preflight V4P1_SEED_BASE cannot shift it' },
    xCorpusIdent: 'N/A (prereg §4 / #100.2(v): a fresh observational corpus has no identity target)',
  },
  gates,
  deviations: [
    'D1: the MATCHED BASELINE — one comparison tick/event drawn deterministically (COMPARISON_SEED=98203, per-event hashSeed(seed,d,sIdx,ord), u mapped into the W-narrowed eligible list) from same-match/same-side PLAYING + OPPONENT-in-possession ticks, excluding post-event (t_e,t_e+W] windows of the same surrogate; empty eligible ⇒ event dropped from the baseline (count published). Secondary all-playing baseline = an independent salted draw, published non-gating.',
    'D2: seed families — census 9,800,000+k (≤ 9,801,199), smoke 9,900,000+k; above the 9,700,399 ceiling and mutually disjoint. The HARD disjointness gate reads the FROZEN constants; V4P1_SEED_BASE is honored ONLY under a preflight cap so the real corpus family can never be shifted.',
    'D3: the box-entry geometry inlined READ-ONLY, mirroring Match.inPenaltyBox (src/sim/Match.ts:2076-2080): |ball.y| ≤ BOX_WIDTH/2 AND localX(ball.x) ≤ −(HALF_L−BOX_DEPTH) (Team has no localY; |localY| ≡ |ball.y|). BOX_DEPTH/BOX_WIDTH from src/sim/constants.ts:50-51. Deep-entry + shot-against detectors are the P0b concede-channel VERBATIM.',
    'D4: the concession outcome = a per-team stats.goals increment (side d concedes iff teams[1−d].stats.goals increments); y_e over the half-open (t_e, t_e+W_cal]. W_cal primary 30 s; sensitivities 15/45 s.',
    'D5: the per-match estimator is computed inside the match runner (large per-tick arrays discarded per match, memory-bounded at N); the pooled lift + match-cluster CI reuse the P0b contrastCI engine verbatim; p_e/p_b reuse the cluster engine.',
    'D6: the conditional chain uses W_link = W_cal primary (30 s), "same-possession" = same possession-spell id (a counter bumped on each m.possessionSide change); incremental lifts get a match-cluster CI over per-match units carrying all three surrogates.',
    'D7: σ̂_S = the sample SD (n−1) of the per-match lift (primary baseline, W=30) across smoke matches; matches with eN=0 or bN=0 excluded (count published). The frozen SE≈σ̂_S/√N is the prereg sizing approximation (non-gating); the census uses the real bootstrap CI.',
    'D8: X-DET = the whole deterministic experiment payload computed twice and asserted byte-identical (self-contained; P0b E8). No X-CORPUS-IDENT (fresh corpus). Fidelity = X-DET + X-SRC-ZERO + seed disjointness.',
    'MODE selection is EXPLICIT via V4P1_MODE (no default) — two real full runs (smoke sizes N; census reads N via V4P1_N); a bare invocation errors rather than silently running the wrong corpus.',
  ],
  registeredNonClaims: [
    'PRICES NO STATION / FORCES NO BODY: observational only; no fork-and-hold (that is V4-P2); stationEye null.',
    'BUILDS NO CONSUMER: no merged scalar, no context bit, no in-support law (V4-P3). The table is UNIT CONVERSION ONLY.',
    'CALIBRATES ONLY THE CLASS H CONCEDE FACE (#99.4/#99.5): delivery (S) and restart (J) need no surrogate→goal calibration and are V4-P3.',
    'The P3a corpus stays LABELLED (I7/#44.3); P0/P0b aggregates quoted only to pin W_cal + seed the sizing; every gate-bearing number runs fresh on the P1 census.',
    'Nothing ships (Road B): EDS flags dormant, c6Carry/c7Windup probe-only, stationEye null, fingerprint 57b0bdab…c673 unchanged throughout.',
    'V4-P1 CANNOT authorize V4-P2: only the commander opens V4-P2; ALL surrogates failing the gate stops the stage here (contract §6).',
    'The PROPOSED primary (box entry) designation is DEFERRED to the V4-P2 pre-reg (#100.3); P1 gates on the resolved monotone ladder and publishes all three.',
  ],
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
const output = { ...body, sha256 };

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

// --- concise stderr line -----------------------------------------------------
if (MODE === 'smoke') {
  const s = (experiment as Extract<typeof experiment, { mode: 'smoke' }>);
  console.error(
    `V4-P1 ${verdict.slice(0, 60)}`
    + ` · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · smoke ${MATCH_COUNT}m`
    + ` · rS deep/box/shot ${s.sizing.map((x) => x.rS).join('/')}`
    + ` · lift ${s.sizing.map((x) => x.pooledLift).join('/')}`
    + ` · σ̂ ${s.sizing.map((x) => x.sigmaPerMatchLift).join('/')}`
    + ` · N ${s.nArithmetic.N}`
    + ` · xDet ${xDet} · xSrcZero ${xSrcZero} · disjoint ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
  );
} else {
  const c = (experiment as Extract<typeof experiment, { mode: 'census' }>);
  console.error(
    `V4-P1 ${verdict.slice(0, 60)}`
    + ` · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · census ${MATCH_COUNT}m (N_env ${N_ENV})`
    + ` · lift deep/box/shot ${c.calibrationTable.map((x) => x.lift.point).join('/')}`
    + ` · resolved ${c.calibrationTable.map((x) => (x.resolved ? 'Y' : 'n')).join('')}`
    + ` · admitted [${c.monotoneGate.admittedSet.join(',')}]`
    + ` · xDet ${xDet} · xSrcZero ${xSrcZero} · disjoint ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
  );
}
