// A4-P1c — THE FORK-AND-GRANT CENSUS (the CAUSAL discipline value of a GRANTED
// back home-region prior on the EYE world, in RAW deep-entry rates).
//
// Authority: docs/world-model/A4-P1C-GRANT-CENSUS.md (the FROZEN pre-registration) +
// ruling #137 (the user rules #135.4′ = A′; A4-P1c authorized; the design constraints
// #137.3.i–vi) under the A4-ASSIGNMENT-CONTRACT §4 estimand family and §3 I-A1..I-A7.
// P1/P1b measured the incumbent world (the LAW is redundant-to-costly there); the A4
// target (−16.1 % DEGEN-RESTDEF) is an EYE-WORLD phenomenon (the R3p arm) where
// ordinary cover ERODES and there is NO positional prior (#135.3/#136). The
// intervention therefore runs the OTHER way: GRANT one body a back home prior and
// measure discipline RECOVERY.
//
// WORLD (prereg §2). The R3p arm reconstructed EXACTLY as the P3p-3 battery built it:
// the ENRICHED eye-null world (#67.3 CENSUS_FLAGS) with the stationEye ARMED —
// v3:{roleTable, control, children (the injected P3p-1 merged table), mergedTableSha},
// v4:{ inSupportLaw:true, deliveryBit:true, offsideBit:true }, scope both. Its arm
// gates X-MERGE-IDENT (the merged SHA + rehash) and E-NONSTATION (the eye ACTIVATES
// on this world; the carrier is never overridden — actionExecutor:676) are inherited
// as HARD gates.
//
// THE PAIRED SAME-SEED FORK (prereg §2). At a qualifying own-possession playing
// moment for side d, the base R3p state is cloned into INDEPENDENT deep copies:
//   • branch A — R3p AS-IS (homeRegionGrant null).
//   • branch B_dose — R3p + the GRANT for side d body index-1: homeRegionGrant =
//     { side:d, bodyIndex:1, strength:dose } on the clone. The grant adds a
//     distance-decayed SOFT bias toward the back home region to the granted body's
//     per-candidate station value at the ESTABLISHED v3 consumption point (no clamp,
//     no new consumption moment). One clone per DOSE (multi-branch per fork, shared
//     branch A) so the whole dose ladder is same-seed paired.
// The DF is frozen NOWHERE (STATUE-safe; he keeps his machinery, only his station
// value gains a soft home bias). X-FORK-IDENT: an independent plain clone (grant null)
// stepped W_MAX == branch A (zero leakage).
//
// THE DOSE GRID (prereg §3, the monotone axis). Strengths are FROZEN FRACTIONS
// {0.25, 0.5, 1.0, 2.0} × VAL_SCALE, where VAL_SCALE = the SD of the neutral-weight
// station value val=0.5·score−0.5·concede over the injected v3 base table's in-power
// cells (the eye's own native score dispersion — deterministic from the SHA-pinned
// merged table, NOT from smoke). PRIMARY dose = fraction 1.0 (the "unit grant": a bias
// on the order of the table's own value dispersion — soft, not a clamp; the grid
// brackets it below/above so monotonicity is testable both ways).
//
// THE METRIC (prereg §3). Per fork, per dose d: Δdeep(d) = nDeepB_d(10 s) − nDeepA(10 s),
// the RAW opponent deep-entry-against-d count in (t_fork, t_fork+10 s] (the P1 detector
// VERBATIM, the certified P0b concede horizon). The GATE reads RAW rates; the goal-value
// conversion (× L_DEEP = 0.043455) is LABELLED ONLY, non-gating (the admitted price is
// eye-null-calibrated — two-pin honesty #26.5/#68.2).
//
// THE FROZEN GATE (prereg §4; smoke may NOT inform it). At the PRIMARY dose, on the
// POOLED primary cell, match-cluster bootstrap. PASS requires ALL:
//   (i)   RESOLVED  — pooled Δdeep(primary) CI UPPER < 0 (the grant REDUCES deep entries).
//   (ii)  DOSE-MONOTONE — point estimates non-INCREASING across [0, 0.25, 0.5, 1.0, 2.0]
//         (the 0 anchor = branch A vs itself = 0): increasingly negative with dose.
//   (iii) LADDER RESOLVED — the (top−bottom) contrast Δdeep(2.0)−Δdeep(0.25) CI UPPER < 0.
//   PLUS the #127 tightening: a Simpson-genre SIGN REVERSAL on the primary cell (pooled
//   vs fork-context-standardized) is an AUTOMATIC NOT-ADVANCE. Any leg fails ⇒ STOP at
//   A4-P1c (I-A3: no measured term ⇒ no build), return to the user. PASS ⇒ A4-P2 opens
//   (the #137.1 green path).
//
// SHAPE EXHIBIT (labelled, NON-GATING; prereg §3.2). At the TOP dose, a cheap per-tick
// nearest-teammate spacing + dup-run readout for side d over the fork window, branch B
// vs A (early F-SLIDE sight). Not built as new instrumentation — a simple readout.
//
// TWO MODES (explicit A4P1C_MODE, NO default):
//   smoke  — 40 matches @ 11,950,000 + k; realises the fork/dose populations, the eye
//            consumption frequency, the pooled Δdeep σ̂, the per-match wall INCLUDING
//            forks×doses, the FROZEN N arithmetic; X-DET double-run. Writes
//            a4-p1c-grant-census-sizing-smoke.json.
//   census — A4P1C_N matches @ 12,000,000 + k; the gate-bearing run. Writes
//            a4-p1c-grant-census.json. The commander's detached resident (#49.5).
//
// SEEDS (frozen §6, #137.3.v ratified freeze, inside 11.7M–12.3M, disjoint from the
// P1/P1b-consumed 11.70/11.80/11.85/11.90M blocks): smoke 11.95M (k 0..39); census 12.0M
// (k 0..N−1, N ≤ 8,000 ⇒ ≤ 12,007,999). Stats: bootstrap 100403; 100503 reserved-unused.
//
// COMMAND LINES:
//   smoke:   A4P1C_MODE=smoke npx tsx scripts/probes/a4-p1c-grant-census.ts
//   census:  A4P1C_MODE=census A4P1C_N=<disclosed N* from the smoke> \
//            npx tsx scripts/probes/a4-p1c-grant-census.ts
//   preflight (bounded; writes OUTSIDE the repo, NOT a verdict):
//     A4P1C_MODE=smoke A4P1C_CAP=3 A4P1C_FORK_CAP=3 A4P1C_OUT=/tmp/x.json A4P1C_SKIP_FP=1 \
//       npx tsx scripts/probes/a4-p1c-grant-census.ts
//
// ENV KNOBS (preflight only; the two real runs touch only A4P1C_MODE and — census — A4P1C_N):
//   A4P1C_CAP (cap the match count ⇒ IS_PREFLIGHT: never writes canonical JSON), A4P1C_N
//   (census count, REQUIRED in census, capped at N_MAX), A4P1C_FORK_CAP (cap forks/match —
//   preflight only), A4P1C_OUT (redirect output), A4P1C_SKIP_DET=1 (skip the X-DET second
//   run), A4P1C_SKIP_FP=1 (skip the fingerprint — preflight only), A4P1C_SEED_BASE (shift
//   the seed base, ONLY under a preflight cap).

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import {
  CELL_FLOOR, EYE_LATTICE, newStationEyeTrace,
  type MergedChildTable, type RoleConditionedTable, type RoleControlLevels, type RoleCell,
  type StationEyeTrace,
} from '../../src/ai/stationEye';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING (prereg §2/§3/§4/§5/§6) — every constant pinned before any run.
// =============================================================================
const CENSUS_SEED_BASE = 12_000_000; // census: 12,000,000 + k, k∈0..N−1 (N ≤ 8,000 ⇒ ≤ 12,007,999)
const SMOKE_SEED_BASE = 11_950_000; // smoke: 11,950,000 + k, k∈0..39
const SMOKE_MATCHES = 40;
const RESERVED_BAND = [11_700_000, 12_300_000] as const; // A4 slice-1 reservation (contract §5)
// the P1/P1b-consumed blocks (§6): the disjointness gate asserts disjointness from ALL.
const CONSUMED_BLOCKS = [
  [11_700_000, 11_700_039], // P1 smoke
  [11_800_000, 11_807_999], // P1 census
  [11_850_000, 11_850_039], // P1b smoke
  [11_900_000, 11_907_999], // P1b census
] as const;

// the match-cluster bootstrap (#20) — stats seeds from 100403 (prereg §6).
const BOOTSTRAP_SEED = 100_403;
const BOOTSTRAP_RESAMPLES = 2_000;
const STATS_SEED_RESERVED = 100_503; // reserved-unused (no dispersion/permutation statistic)

// the ADMITTED P1 deep price (LABELLED goal-value conversion ONLY; the gate reads RAW rates).
const L_DEEP = 0.043455; // opponent deep entry lift [0.030790, 0.055817]
const L_DEEP_CI = [0.030790, 0.055817] as const;

// horizon (prereg §3): a SINGLE primary horizon — the dose IS the monotone axis.
const W_PRICE_S = 10; // the certified P0b concede horizon
const W_MAX_TICKS = Math.round(W_PRICE_S / DT);
const SAMPLE_EVERY = 10; // the battery's 6 Hz spacing-sample cadence (shape exhibit)
const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)

// fork sampling (prereg §2.1)
const FORK_SPACING_S = 4.0; // the P2b census cadence
const FORK_CAP_PER_MATCH = 20; // wall guard (eye-armed multi-dose forks are heavier than P1b's; smoke reports binding)

// THE DOSE GRID (prereg §3): FROZEN FRACTIONS × VAL_SCALE. Primary = 1.0.
const DOSE_FRACTIONS = [0.25, 0.5, 1.0, 2.0] as const;
const PRIMARY_DOSE_FRAC = 1.0;
const TOP_DOSE_FRAC = 2.0;
const BOTTOM_DOSE_FRAC = 0.25;

// surrogate geometry (P1 :326-344 VERBATIM), reused exactly as the A4-P1/P1b censuses did.
const REST_THIRD = HALF_L / 3; // own-third depth
const BOX_INNER_X = -(HALF_L - BOX_DEPTH);

// the frozen N arithmetic (prereg §5). The gate reads RAW deep-entry rates ⇒ MDL in RATE units.
const MDL_ABS = 0.01; // deep-entries-per-window (raw-rate units; the goal-value conversion is labelled only)
const POWER_Z = 3.605; // z_.975 + z_.95
const Z_975 = 1.96;
const N_STEP = 200;
const N_CAP = 8_000; // keeps the census band ≤ 12,007,999, inside the reservation
const WALL_BUDGET_HOURS = 12;
const WALL_BUDGET_MS = WALL_BUDGET_HOURS * 3600 * 1000;
const XDET_FACTOR = 2;

// X-FP-PROD — the frozen shipped-world production fingerprint (verbatim).
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

// X-MERGE-IDENT (prereg §7; the battery's P3p-1 merged-table identity, verbatim).
const MERGED_PATH = 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const MERGED_SHA_EXPECTED = '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED = '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';

// the ENRICHED census world (#67.3) — eye ARMED to the R3p config (below); the counterfactual
// (the grant) is created ONLY in branch B.
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const RECEIPT_CAP = 1_000;
const CONTEXTS = ['own', 'mid', 'their'] as const;
type Context = (typeof CONTEXTS)[number];

// =============================================================================
// ENV / MODE (prereg §7).
// =============================================================================
const MODE = process.env.A4P1C_MODE;
if (MODE !== 'smoke' && MODE !== 'census') {
  console.error('A4-P1c FATAL — A4P1C_MODE must be "smoke" or "census" (see the header command lines).');
  process.exit(2);
}
const CAP = process.env.A4P1C_CAP ? Math.max(1, Number.parseInt(process.env.A4P1C_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(CAP);
const FORK_CAP = (IS_PREFLIGHT && process.env.A4P1C_FORK_CAP)
  ? Math.max(1, Number.parseInt(process.env.A4P1C_FORK_CAP, 10)) : FORK_CAP_PER_MATCH;
const SKIP_DET = process.env.A4P1C_SKIP_DET === '1';
const SKIP_FP = process.env.A4P1C_SKIP_FP === '1';
const N_ENV = process.env.A4P1C_N ? Math.max(1, Number.parseInt(process.env.A4P1C_N, 10)) : null;
if (MODE === 'census' && N_ENV === null) {
  console.error('A4-P1c FATAL — census mode requires A4P1C_N (the census match count pinned from the smoke arithmetic).');
  process.exit(2);
}
const N_CENSUS = MODE === 'census' ? Math.min(N_ENV as number, N_CAP) : 0;
const FROZEN_BASE = MODE === 'smoke' ? SMOKE_SEED_BASE : CENSUS_SEED_BASE;
const SEED_BASE = (IS_PREFLIGHT && process.env.A4P1C_SEED_BASE)
  ? Math.max(0, Number.parseInt(process.env.A4P1C_SEED_BASE, 10)) : FROZEN_BASE;
const PLANNED_MATCHES = MODE === 'smoke' ? SMOKE_MATCHES : N_CENSUS;
const MATCH_COUNT = IS_PREFLIGHT ? Math.min(PLANNED_MATCHES, CAP) : PLANNED_MATCHES;
const SMOKE_OUT = 'docs/world-model/data/a4-p1c-grant-census-sizing-smoke.json';
const CENSUS_OUT = 'docs/world-model/data/a4-p1c-grant-census.json';
const OUT_PATH = process.env.A4P1C_OUT
  ?? (IS_PREFLIGHT ? '/tmp/a4p1c-preflight.json' : (MODE === 'smoke' ? SMOKE_OUT : CENSUS_OUT));

// =============================================================================
// SMALL NUMERIC HELPERS (P1b verbatim).
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
// THE INJECTED P3p-1 MERGED TABLE + CONTROL (X-MERGE-IDENT) — never bundled in src/**.
// =============================================================================
interface MergedTableFile {
  mergedTableSha: string; base: RoleConditionedTable; children: MergedChildTable;
}
const rawMerged = JSON.parse(readFileSync(MERGED_PATH, 'utf8')) as MergedTableFile;
const roleTable: RoleConditionedTable = rawMerged.base;
const children: MergedChildTable = rawMerged.children;
const mergedTableSha = rawMerged.mergedTableSha;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as { control: RoleControlLevels };
const control: RoleControlLevels = rawControl.control;

const shaOf = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');
// X-MERGE-IDENT: the loaded mergedTableSha == expected AND {base,children} rehashes to it AND
// base rehashes to the injected v3 base (the P3p-1 identity), exactly as the battery asserts.
const buildMergeIdent = () => {
  const mergedRehash = shaOf({ base: roleTable, children });
  const baseRehash = shaOf(roleTable);
  const pass = mergedTableSha === MERGED_SHA_EXPECTED
    && mergedRehash === MERGED_SHA_EXPECTED && baseRehash === BASE_SHA_EXPECTED;
  return { mergedShaField: mergedTableSha, mergedShaExpected: MERGED_SHA_EXPECTED, mergedRehash, baseRehash, baseShaExpected: BASE_SHA_EXPECTED, pass };
};

// VAL_SCALE (prereg §3): the eye's native score dispersion — SD of the neutral-weight station
// value val=0.5·score−0.5·concede over the injected v3 base table's in-power cells. Deterministic
// from the SHA-pinned merged table (NOT smoke). The dose grid = DOSE_FRACTIONS × VAL_SCALE.
const computeValScale = (): number => {
  const vals: number[] = [];
  for (const ck of Object.keys(roleTable)) {
    const byRole = roleTable[ck];
    for (const role of Object.keys(byRole)) {
      const cells = byRole[role];
      for (const candId of Object.keys(cells)) {
        if (candId === 'control') continue;
        const c = cells[candId] as RoleCell;
        if (c.n >= CELL_FLOOR && c.underPowered !== true) vals.push(0.5 * c.score - 0.5 * c.concede);
      }
    }
  }
  return sampleSd(vals);
};
const VAL_SCALE = computeValScale();
const DOSES = DOSE_FRACTIONS.map((f) => f * VAL_SCALE);
const doseKey = (f: number): string => `f${f}`;
const PRIMARY_DOSE = PRIMARY_DOSE_FRAC * VAL_SCALE;
const TOP_DOSE = TOP_DOSE_FRAC * VAL_SCALE;
const BOTTOM_DOSE = BOTTOM_DOSE_FRAC * VAL_SCALE;

// =============================================================================
// THE R3p FIXTURE (= the battery's arm) — enriched world + the ARMED R3p eye.
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
// the R3p eye config (battery §2 armEye for arm 'R3p'): v3 base+children+SHA, all three v4 flags.
const r3pEye = (trace?: StationEyeTrace) => ({
  arm: 'neutral' as const, scope: { kind: 'both' as const }, table: {},
  v3: { roleTable, control, children, mergedTableSha },
  v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true },
  ...(trace ? { trace } : {}),
});
// the BARE enriched world (eye null) — for the E-NONSTATION seam checks (the battery arms the eye
// itself in those checks, so the freshNull leg needs an un-armed match).
const bareMatchOf = (seed: number): Match =>
  new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), ...CENSUS_FLAGS });
// the R3p census fixture: the bare world with the ARMED R3p eye (the battery's R3p arm).
const matchOf = (seed: number): Match => {
  const m = bareMatchOf(seed);
  m.stationEye = r3pEye(newStationEyeTrace());
  return m;
};

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const contextOf = (lx: number): Context => (lx < -REST_THIRD ? 'own' : lx > REST_THIRD ? 'their' : 'mid');

// E-NONSTATION (prereg §7; the battery's X-SEAM verbatim, P3a §4.4). A bare match is eye-null;
// the eye ACTIVATES on the R3p world (the arm gate is not vacuous); the eye NEVER issues a FRESH
// override decision (untilTick advanced, offset non-null) while the body OWNS the ball
// (actionExecutor:676 guards the whole eye block on `ball.owner !== p`; a RETAINED window offset on
// a body that just gained the ball is benign — never applied — so the refined test tracks a FRESH
// decision only, per the battery's #134.2 note). Body-/team-scope gating honoured.
const checkENonStation = () => {
  const seed = SEED_BASE;
  const freshNull = bareMatchOf(seed).stationEye === null && bareMatchOf(seed).stationEyeState.size === 0;
  const bodyGid = 1 + (seed % 5);
  const bodyM = bareMatchOf(seed);
  bodyM.stationEye = { arm: 'neutral', scope: { kind: 'body', gid: bodyGid }, table: {}, v3: { roleTable, control, children, mergedTableSha }, v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true } };
  let bodyScopeOk = true; let carrierNeverOverridden = true;
  const prevUntil = new Map<number, number>();
  for (let i = 0; i < 3000 && !bodyM.finished; i++) {
    bodyM.step(DT);
    for (const [gid, st] of bodyM.stationEyeState) {
      if (gid !== bodyGid) bodyScopeOk = false;
      const pv = prevUntil.get(gid);
      if (bodyM.ball.owner !== null && bodyM.ball.owner.gid === gid && st.offset !== null
        && (pv === undefined || st.untilTick > pv)) carrierNeverOverridden = false;
      prevUntil.set(gid, st.untilTick);
    }
  }
  const teamM = bareMatchOf(seed);
  teamM.stationEye = { arm: 'neutral', scope: { kind: 'team', side: 0 }, table: {}, v3: { roleTable, control, children, mergedTableSha }, v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true } };
  let teamScopeOk = true;
  for (let i = 0; i < 3000 && !teamM.finished; i++) {
    teamM.step(DT);
    for (const gid of teamM.stationEyeState.keys()) {
      if (Math.floor(gid / TEAM_SIZE) !== 0 || gid % TEAM_SIZE === 0) teamScopeOk = false;
    }
  }
  const bothM = matchOf(seed); // the ARMED R3p both-scope eye must activate
  let bothActivated = false;
  for (let i = 0; i < 3000 && !bothM.finished; i++) {
    bothM.step(DT);
    if (bothM.stationEyeState.size > 0) { bothActivated = true; break; }
  }
  const pass = freshNull && bodyScopeOk && teamScopeOk && bothActivated && carrierNeverOverridden;
  return { pass, freshNull, bodyScopeOk, teamScopeOk, bothActivated, carrierNeverOverridden };
};

// =============================================================================
// ONE BRANCH (prereg §2/§3) — clone the base, optionally GRANT side d body-1 at `strength`,
// step W_MAX_TICKS, count opponent deep entries AGAINST d in (t_fork, t_fork+10 s] on the
// null→true transition seeded from the shared fork-start state. Optionally accumulate the
// shape readout (nearest-teammate spacing + dup-runs) for side d.
// =============================================================================
interface BranchOut {
  nDeep: number;
  ended: boolean;
  signature: string;
  shape: { spacingSum: number; spacingSamples: number; dupRunSum: number } | null;
}

const runBranch = (
  base: Match, d: Side, strength: number, seed: number, decisionTick: number,
  label: string, receipts: ReceiptBook | null, wantShape: boolean,
): BranchOut => {
  const fork = cloneSimulationState(base);
  if (strength !== 0) fork.homeRegionGrant = { side: d, bodyIndex: 1, strength }; // the counterfactual, on THIS clone only
  const mine = fork.teams[d];
  const startTick = fork.simTick;

  const ball0 = fork.ball;
  const owner0 = ball0.owner;
  const oppOwns0 = owner0 !== null && owner0.side !== d;
  const lx0 = mine.localX(ball0.pos.x);
  let deepPrev = oppOwns0 && fork.phase === 'playing' && lx0 < -REST_THIRD;

  let nDeep = 0;
  let ended = false;
  let spacingSum = 0; let spacingSamples = 0; let dupRunSum = 0;

  while (!fork.finished && fork.simTick - startTick < W_MAX_TICKS) {
    fork.step(DT);
    if (fork.finished) { ended = true; break; }
    const owner = fork.ball.owner;
    const oppOwns = owner !== null && owner.side !== d;
    const lx = mine.localX(fork.ball.pos.x);
    const deepNow = oppOwns && fork.phase === 'playing' && lx < -REST_THIRD;
    if (deepNow && !deepPrev) {
      nDeep += 1;
      addReceipt(receipts, 'deep-entry-against', seed, decisionTick, owner?.gid ?? -1, `branch${label} d${d} lx=${round(lx, 2)}`);
    }
    deepPrev = deepNow;
    // shape readout (labelled, non-gating): sample every SAMPLE_EVERY ticks — nearest-teammate
    // spacing + dup-runs for side d's outfielders (a simple readout, the battery I6 form).
    if (wantShape && (fork.simTick - startTick) % SAMPLE_EVERY === 0) {
      const outs = mine.players.filter((q) => q.role !== 'GK' && !q.sentOff);
      for (let a = 0; a < outs.length; a++) {
        let nearest = Number.POSITIVE_INFINITY;
        for (let b = 0; b < outs.length; b++) {
          if (a === b) continue;
          const dd = Math.hypot(outs[a].pos.x - outs[b].pos.x, outs[a].pos.y - outs[b].pos.y);
          if (dd < nearest) nearest = dd;
          if (b > a && dd < DUP_RUN_M) dupRunSum += 1;
        }
        if (Number.isFinite(nearest)) { spacingSum += nearest; spacingSamples += 1; }
      }
    }
  }
  return {
    nDeep, ended, signature: signatureOf(fork),
    shape: wantShape ? { spacingSum, spacingSamples, dupRunSum } : null,
  };
};

// =============================================================================
// THE RAW COLLECTION per match: sample fork moments, run branch A + one branch B per dose
// (+ X-FORK-IDENT), admit the tuple (exclude if ANY branch ENDED within W_MAX), record the
// paired Δdeep per dose + (top dose) the shape deltas.
// =============================================================================
interface ForkRec {
  d: Side;
  context: Context;
  gid: number;
  dDeep: Record<string, number>; // doseKey → nDeepB_dose − nDeepA
  shapeA: { spacingSum: number; spacingSamples: number; dupRunSum: number } | null;
  shapeTop: { spacingSum: number; spacingSamples: number; dupRunSum: number } | null;
}
interface CensusRow {
  seed: number;
  forks: ForkRec[];
  drops: { ended: number };
  counts: { qualifying: number; forked: number; capSkipped: number };
  eyeDecisions: number;
  xForkChecked: number;
  xForkMismatched: number;
}

const runCensusMatch = (seed: number, receipts: ReceiptBook | null): CensusRow => {
  const m = matchOf(seed); // enriched flags + the ARMED R3p eye; homeRegionGrant NULL in the base run
  const forks: ForkRec[] = [];
  let endedDrops = 0; let qualifying = 0; let forked = 0; let capSkipped = 0;
  let xForkChecked = 0; let xForkMismatched = 0;
  let lastForkTime = -Infinity;
  let forksThisMatch = 0;

  while (!m.finished) {
    const owner = m.ball.owner;
    const qualifies = m.phase === 'playing' && owner !== null && m.simTime - lastForkTime >= FORK_SPACING_S;
    if (!qualifies) { m.step(DT); if (m.finished) break; continue; }
    qualifying += 1;
    lastForkTime = m.simTime;
    if (forksThisMatch >= FORK_CAP) { capSkipped += 1; m.step(DT); if (m.finished) break; continue; }

    const d = owner!.side as Side;
    const mine = m.teams[d];
    const body = mine.players.find((p) => p.index === 1 && !p.sentOff);
    const context = contextOf(mine.localX(m.ball.pos.x));
    const decisionTick = m.simTick;
    const gid = body?.gid ?? -1;

    // branch A (grant null, + shape), then one branch B per dose (top dose carries the shape).
    const branchA = runBranch(m, d, 0, seed, decisionTick, 'A', receipts, true);
    const branchByDose: Record<string, BranchOut> = {};
    for (let i = 0; i < DOSES.length; i++) {
      branchByDose[doseKey(DOSE_FRACTIONS[i])] = runBranch(
        m, d, DOSES[i], seed, decisionTick, `B${DOSE_FRACTIONS[i]}`, receipts,
        DOSE_FRACTIONS[i] === TOP_DOSE_FRAC,
      );
    }
    forked += 1;
    forksThisMatch += 1;

    // X-FORK-IDENT (HARD, 100% coverage): an independent plain clone (grant null) == branch A.
    const plain = cloneSimulationState(m);
    for (let i = 0; i < W_MAX_TICKS && !plain.finished; i++) plain.step(DT);
    xForkChecked += 1;
    if (signatureOf(plain) !== branchA.signature) xForkMismatched += 1;

    const anyEnded = branchA.ended || DOSE_FRACTIONS.some((f) => branchByDose[doseKey(f)].ended);
    if (anyEnded) {
      endedDrops += 1;
      addReceipt(receipts, 'fork-excluded-ended', seed, decisionTick, gid, `d${d} ctx=${context}`);
    } else {
      const dDeep: Record<string, number> = {};
      for (const f of DOSE_FRACTIONS) dDeep[doseKey(f)] = branchByDose[doseKey(f)].nDeep - branchA.nDeep;
      forks.push({
        d, context, gid, dDeep,
        shapeA: branchA.shape,
        shapeTop: branchByDose[doseKey(TOP_DOSE_FRAC)].shape,
      });
      addReceipt(receipts, 'fork', seed, decisionTick, gid, `d${d} ctx=${context}`);
    }
    m.step(DT);
    if (m.finished) break;
  }
  return {
    seed, forks, drops: { ended: endedDrops },
    counts: { qualifying, forked, capSkipped },
    eyeDecisions: m.stationEye?.trace?.decisions ?? 0,
    xForkChecked, xForkMismatched,
  };
};

// =============================================================================
// STATISTICS — the match-cluster bootstrap (#20), P1 engine (BOOTSTRAP_SEED=100403).
// =============================================================================
type ForkFilter = (f: ForkRec) => boolean;
type ForkValue = (f: ForkRec) => number;
const allF: ForkFilter = () => true;
const rawDeep = (frac: number): ForkValue => (f) => f.dDeep[doseKey(frac)];
const gvDeep = (frac: number): ForkValue => (f) => f.dDeep[doseKey(frac)] * L_DEEP;
const ladderContrast: ForkValue = (f) => f.dDeep[doseKey(TOP_DOSE_FRAC)] - f.dDeep[doseKey(BOTTOM_DOSE_FRAC)];

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
// THE GRANT-PRICE TABLE + THE FROZEN GATE (prereg §4).
// =============================================================================
const buildPrimary = (rows: readonly CensusRow[]) => {
  const rawDelta = meanCI(rows, allF, rawDeep(PRIMARY_DOSE_FRAC), 100); // the gate cell (RAW)
  const gvDelta = meanCI(rows, allF, gvDeep(PRIMARY_DOSE_FRAC), 101); // LABELLED goal-value (non-gating)
  return {
    primaryDoseFraction: PRIMARY_DOSE_FRAC, primaryDoseStrength: round(PRIMARY_DOSE),
    metric: 'RAW opponent deep-entry-against-d count delta B−A in (t_fork, t_fork+10 s]',
    rawDeepDelta: rawDelta,
    goalValueDeltaLabelled: gvDelta,
    goalValueNote: 'LABELLED ONLY (× L_DEEP=0.043455, eye-null-calibrated); the GATE reads the RAW rate (#137, two-pin honesty).',
    nForks: countForks(rows, allF),
  };
};

// the DOSE ladder (prereg §4 monotone axis): the 0 anchor (branch A vs itself) + each dose.
const buildLadder = (rows: readonly CensusRow[]) => {
  const rung = DOSE_FRACTIONS.map((f, i) => ({ fraction: f, strength: round(f * VAL_SCALE), delta: meanCI(rows, allF, rawDeep(f), 200 + i) }));
  const ladderPts = [0, ...rung.map((r) => r.delta.point)]; // the 0 anchor first
  const monotoneNonIncreasing = ladderPts.every((v, i) => i === 0
    || !(Number.isFinite(v) && Number.isFinite(ladderPts[i - 1]) && v > ladderPts[i - 1]));
  const contrast = meanCI(rows, allF, ladderContrast, 210); // Δdeep(top) − Δdeep(bottom)
  return {
    axis: 'GRANT dose (× VAL_SCALE); RAW pooled deep-entry-rate delta B−A per fork; monotone leg reads dose-response',
    valScale: round(VAL_SCALE), doseFractions: DOSE_FRACTIONS, doses: DOSES.map((d) => round(d)),
    zeroAnchor: 'dose 0 = branch A vs itself = 0 by construction (the ladder base)',
    rung, ladderPointsWithZero: ladderPts.map((p) => round(p)),
    monotoneNonIncreasing,
    topMinusBottomContrast: contrast,
    contrastNote: `Δdeep(f=${TOP_DOSE_FRAC}) − Δdeep(f=${BOTTOM_DOSE_FRAC}); CI upper < 0 ⇒ the ladder resolves increasingly negative`,
  };
};

// the fork-context Simpson exhibit (prereg §4.1 / #94.3): raw-pool vs standardized, primary dose.
const buildSimpson = (rows: readonly CensusRow[]) => {
  const nTotal = countForks(rows, allF);
  const strata: { context: Context; n: number; delta: ReturnType<typeof meanCI>; weight: number }[] = [];
  let offset = 300;
  for (const context of CONTEXTS) {
    const inStr: ForkFilter = (f) => f.context === context;
    const nStr = countForks(rows, inStr);
    if (nStr === 0) continue;
    strata.push({ context, n: nStr, delta: meanCI(rows, inStr, rawDeep(PRIMARY_DOSE_FRAC), offset++), weight: round(nStr / (nTotal || 1)) });
  }
  const finite = strata.filter((s) => Number.isFinite(s.delta.point));
  const wSum = finite.reduce((a, s) => a + s.weight, 0);
  const standardizedPoint = wSum === 0 ? Number.NaN
    : finite.reduce((a, s) => a + s.weight * s.delta.point, 0) / wSum;
  return {
    note: 'fork context = side d ball third at t_fork (own/mid/their). With same-seed pairing this is a '
      + 'HETEROGENEITY exhibit, NOT a confound repair (§4.1). Role is degenerate (the granted body is ALWAYS '
      + 'index-1 = the DF). Standardized = Σ w_s·delta_s over finite strata. The GATE binds on the pooled '
      + 'primary cell; a pooled-vs-standardized SIGN REVERSAL is FLAGGED (#127).',
    strata, standardizedDeltaPoint: round(standardizedPoint),
  };
};

// the shape exhibit (prereg §3.2; labelled, NON-GATING): top-dose branch B vs A over the fork window.
const buildShape = (rows: readonly CensusRow[]) => {
  let spSumA = 0; let spNA = 0; let dupA = 0;
  let spSumT = 0; let spNT = 0; let dupT = 0;
  let nForks = 0;
  for (const r of rows) for (const f of r.forks) {
    if (f.shapeA === null || f.shapeTop === null) continue;
    nForks += 1;
    spSumA += f.shapeA.spacingSum; spNA += f.shapeA.spacingSamples; dupA += f.shapeA.dupRunSum;
    spSumT += f.shapeTop.spacingSum; spNT += f.shapeTop.spacingSamples; dupT += f.shapeTop.dupRunSum;
  }
  const meanSpacingA = spNA === 0 ? Number.NaN : spSumA / spNA;
  const meanSpacingTop = spNT === 0 ? Number.NaN : spSumT / spNT;
  return {
    note: 'LABELLED, NON-GATING (prereg §3.2). Top-dose branch B vs branch A, side d outfielders, mean '
      + 'nearest-teammate spacing (m) + dup-run count (pairs < 4 m), sampled at 6 Hz over the 10 s fork '
      + 'window. Early F-SLIDE sight only — the frontier shape gates live at A4-P3, not here.',
    nForks, topDoseFraction: TOP_DOSE_FRAC,
    meanNearestSpacingA: round(meanSpacingA), meanNearestSpacingTop: round(meanSpacingTop),
    spacingDeltaTopMinusA: round(meanSpacingTop - meanSpacingA),
    dupRunTotalA: dupA, dupRunTotalTop: dupT, dupRunDeltaTopMinusA: dupT - dupA,
  };
};

// THE FROZEN GATE (prereg §4).
const evalGate = (
  primary: ReturnType<typeof buildPrimary>, ladder: ReturnType<typeof buildLadder>,
  simpson: ReturnType<typeof buildSimpson>,
) => {
  const resolved = Number.isFinite(primary.rawDeepDelta.upper) && primary.rawDeepDelta.upper < 0;
  const monotone = ladder.monotoneNonIncreasing;
  const ladderResolved = Number.isFinite(ladder.topMinusBottomContrast.upper) && ladder.topMinusBottomContrast.upper < 0;
  const pass = resolved && monotone && ladderResolved;
  const simpsonReversal = Number.isFinite(simpson.standardizedDeltaPoint)
    && Number.isFinite(primary.rawDeepDelta.point)
    && Math.sign(simpson.standardizedDeltaPoint) !== Math.sign(primary.rawDeepDelta.point);
  return {
    predicate: '(i) pooled RAW Δdeep(primary dose) B−A CI UPPER < 0 (grant REDUCES deep entries) AND '
      + '(ii) dose-monotone non-increasing over [0, 0.25, 0.5, 1.0, 2.0] AND '
      + '(iii) (top−bottom dose) contrast CI UPPER < 0',
    resolved, monotone, ladderResolved, pass,
    simpsonSignReversalFlag: simpsonReversal,
    emptyCellVacuity: primary.nForks === 0 ? 'POOLED CELL EMPTY ⇒ leg (i) UNRESOLVED ⇒ STOP (attainability failure)' : 'co-populated (every admitted fork contributes to every dose)',
    disposition: (pass && !simpsonReversal)
      ? 'PASS — resolved, dose-monotone discipline recovery. A4-P1c proceeds to A4-P2 (dormant build); commander review + numbered ruling gate the transition (#137.1).'
      : simpsonReversal
        ? 'NOT-ADVANCE (reading E, #127) — Simpson-genre sign reversal on the primary cell; RETURNS to the user with both exhibits even if the three legs pass.'
        : 'STOP AT A4-P1c — null / non-monotone / unresolved dose-response (prereg §4): no measured causal term for the M3′ seam ⇒ building M1′–M5 would violate I-A3. RETURNS to the user.',
  };
};

// =============================================================================
// THE SIZING SMOKE (prereg §5) — populations + realised Δdeep σ̂ + the FROZEN N arithmetic.
// The wall-derived half is computed OUTSIDE the X-DET-compared core (#128).
// =============================================================================
interface WallArithmetic {
  perMatchWallMs: number; nMaxWall: number; nMax: number;
  nStar: number; nBinding: number; underPowered: boolean; reducedPowerDisclosure: boolean;
  projectedForksAtNStar: number; projectedPrimaryPowerAtNStar: number; note: string;
}
interface SizingRaw { sigma: number; mdl: number; forksPerMatch: number; nMatches: number }

const buildSizingCore = (rows: readonly CensusRow[]): { sizing: Record<string, unknown>; raw: SizingRaw } => {
  const nMatches = rows.length;
  // per-match pooled RAW Δdeep(primary) → σ̂
  const perMatchDelta = rows.map((r) => {
    let sum = 0; let n = 0;
    for (const f of r.forks) { sum += rawDeep(PRIMARY_DOSE_FRAC)(f); n += 1; }
    return n === 0 ? Number.NaN : sum / n;
  });
  const sigma = sampleSd(perMatchDelta);
  const finiteMatches = perMatchDelta.filter(Number.isFinite).length;
  const pooledDelta = meanCI(rows, allF, rawDeep(PRIMARY_DOSE_FRAC), 100).point;
  const mdl = Math.min(0.5 * Math.abs(pooledDelta), MDL_ABS);

  const totalForks = countForks(rows, allF);
  const perMatchForks = rows.map((r) => r.forks.length);
  const strataN: Record<string, number> = {};
  for (const c of CONTEXTS) strataN[c] = countForks(rows, (f) => f.context === c);
  const capBound = rows.some((r) => r.counts.capSkipped > 0);
  const forksPerMatch = nMatches === 0 ? 0 : totalForks / nMatches;

  return {
    sizing: {
      nMatches, finiteMatchesForSigma: finiteMatches, valScale: round(VAL_SCALE), doses: DOSES.map((d) => round(d)),
      populations: {
        perMatchForksMean: round(mean(perMatchForks)), totalForks,
        forkContextStrataN: strataN,
        qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
        forkedTotal: sumBy(rows, (r) => r.counts.forked),
        capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
        forkCapPerMatch: FORK_CAP, forkCapBinds: capBound,
        endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
        eyeDecisionsTotal: sumBy(rows, (r) => r.eyeDecisions),
        xForkChecked: sumBy(rows, (r) => r.xForkChecked),
        xForkMismatched: sumBy(rows, (r) => r.xForkMismatched),
      },
      pooledPrimaryDelta: round(pooledDelta), sigmaPerMatchDelta: round(sigma), mdl: round(mdl),
      nArithmetic: {
        mdlFormula: 'MDL = min( 0.5·|Δdeep_smoke| , 0.01 ) deep-entries/window (RAW-RATE units; the gate reads raw)',
        seFormula: 'SE_N = σ̂·√(1/N); resolve at 95 % power ⇒ SE_N ≤ MDL / 3.605 (POWER_Z)',
        nStarFormula: 'N* = smallest 200-step N with SE_N ≤ MDL/POWER_Z, capped at N_MAX',
        powerZ: POWER_Z, nStep: N_STEP, nCap: N_CAP, wallBudgetHours: WALL_BUDGET_HOURS,
        note: 'per-fork vs per-match accounting: the delta statistic is a MEAN OVER FORKS; the resample/σ̂ unit is the MATCH.',
      },
    },
    raw: { sigma, mdl, forksPerMatch, nMatches },
  };
};

const computeWallArithmetic = (raw: SizingRaw, perMatchWallMs: number): WallArithmetic => {
  const { sigma, mdl, forksPerMatch } = raw;
  const wallStepN = (n: number): number => n * perMatchWallMs * XDET_FACTOR;
  let nMaxWall = 0;
  for (let n = N_STEP; n <= N_CAP; n += N_STEP) { if (wallStepN(n) <= WALL_BUDGET_MS) nMaxWall = n; }
  const nMax = Math.min(nMaxWall === 0 ? N_STEP : nMaxWall, N_CAP);

  let nStar: number; let underPowered = false; let note = 'resolvable at N* ≤ N_MAX';
  if (!Number.isFinite(sigma) || !Number.isFinite(mdl) || mdl <= 0) {
    nStar = nMax; underPowered = true;
    note = 'σ̂ or MDL undefined/zero (delta ≈ 0 or < 2 finite matches) ⇒ N* := N_MAX; UNDER-POWERED (published); reads UNRESOLVED at the gate';
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
    note: `${note}. Pass nStar as A4P1C_N to the census. Wall INCLUDES forks×doses (each fork = ONE branch A `
      + `+ ${DOSES.length} dose branches + one X-FORK-IDENT step-through, each up to W_MAX_TICKS on the ARMED R3p `
      + 'eye). Attainability-knee: if the priceable-fork cell or a gate stratum is too rare, its leg reads UNRESOLVED ⇒ the gate STOPS.',
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
      seedFamily: '11,950,000 + k, k∈0..39 (sizing only; inside 11.7M–12.3M; disjoint from census)',
      wPriceS: W_PRICE_S, doseFractions: DOSE_FRACTIONS,
      xForkIdent: { checked: xForkChecked, mismatched: xForkMismatched, pass: xForkMismatched === 0 },
      sizing, receipts: receiptOut,
    };
    return { core, wallMs: perMatchWallMs, sizingRaw: raw };
  }
  const primary = buildPrimary(rows);
  const ladder = buildLadder(rows);
  const simpson = buildSimpson(rows);
  const shape = buildShape(rows);
  const gate = evalGate(primary, ladder, simpson);
  const core = {
    mode: 'census' as const, seedRange,
    seedFamily: '12,000,000 + k, k∈0..N−1 (inside 11.7M–12.3M; disjoint from smoke)',
    wPriceS: W_PRICE_S, doseFractions: DOSE_FRACTIONS, valScale: round(VAL_SCALE),
    admittedPriceLabelled: { deep: { L: L_DEEP, ci: L_DEEP_CI }, note: 'goal-value conversion LABELLED ONLY; the gate reads RAW rates (#137)' },
    primary, doseLadder: ladder, simpsonExhibit: simpson, shapeExhibit: shape,
    gate,
    xForkIdent: { checked: xForkChecked, mismatched: xForkMismatched, pass: xForkMismatched === 0 },
    populations: {
      totalForks: countForks(rows, allF),
      qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
      forkedTotal: sumBy(rows, (r) => r.counts.forked),
      capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
      endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
      eyeDecisionsTotal: sumBy(rows, (r) => r.eyeDecisions),
    },
    receipts: receiptOut,
  };
  return { core, wallMs: perMatchWallMs, sizingRaw: null };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET, X-FORK-IDENT, X-MERGE-IDENT, E-NONSTATION, X-FP-PROD, disjointness.
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);
const { core: experiment, wallMs, sizingRaw } = runExperiment();
const experiment2 = SKIP_DET ? null : runExperiment().core;
const xDet = SKIP_DET ? null : canonical(experiment) === canonical(experiment2);

if (experiment.mode === 'smoke' && sizingRaw !== null) {
  (experiment.sizing as { nArithmetic: Record<string, unknown> }).nArithmetic = {
    ...(experiment.sizing as { nArithmetic: Record<string, unknown> }).nArithmetic,
    ...computeWallArithmetic(sizingRaw, wallMs),
  };
}

const xForkIdent = experiment.xForkIdent.pass;
const mergeIdent = buildMergeIdent();
const eNonStation = checkENonStation();

// X-FP-PROD (HARD): the production fingerprint is UNCHANGED.
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
const censusMaxSeed = CENSUS_SEED_BASE + N_CAP - 1; // 12,007,999
const smokeMaxSeed = SMOKE_SEED_BASE + SMOKE_MATCHES - 1; // 11,950,039
const disjointFrom = (aLo: number, aHi: number, bLo: number, bHi: number): boolean => aHi < bLo || bHi < aLo;
const seedDisjoint =
  SMOKE_SEED_BASE >= RESERVED_BAND[0] && censusMaxSeed <= RESERVED_BAND[1]
  && smokeMaxSeed < CENSUS_SEED_BASE
  && CONSUMED_BLOCKS.every(([lo, hi]) => disjointFrom(SMOKE_SEED_BASE, smokeMaxSeed, lo, hi)
    && disjointFrom(CENSUS_SEED_BASE, censusMaxSeed, lo, hi));

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates = { xDet, xForkIdent, xMergeIdent: mergeIdent.pass, eNonStation: eNonStation.pass, xFpProd, seedDisjoint };

// ---- the verdict (prereg §4/§8 readings) ----
let verdict: string;
if (IS_PREFLIGHT) {
  verdict = `PREFLIGHT (bounded, ${MODE}) — NOT a verdict; exercises the R3p arm + fork sampling + branch A + `
    + 'the dose branches + X-FORK-IDENT + X-MERGE-IDENT + E-NONSTATION + the deep detector + (census) the '
    + 'dose ladder/gate/Simpson/shape + (smoke) the N arithmetic + X-DET on a capped slice. Numbers on ≤ few matches are meaningless by design; nothing canonical written.';
} else if (xDet === false) {
  verdict = 'FAIL — X-DET: the output is not byte-identical across the double-run; STOP';
} else if (!xForkIdent) {
  verdict = 'FAIL — X-FORK-IDENT: the as-is branch diverged from an independent plain step-through (fork leakage/non-determinism); STOP';
} else if (!mergeIdent.pass) {
  verdict = 'FAIL — X-MERGE-IDENT: the injected merged table SHA/rehash does not match the P3p-1 identity; STOP';
} else if (!eNonStation.pass) {
  verdict = 'FAIL — E-NONSTATION: the eye did not activate on the R3p world, or it overrode the ball carrier; STOP';
} else if (!xFpProd) {
  verdict = 'FAIL — X-FP-PROD: the production fingerprint moved (the dormant grant seam is not dormant); STOP';
} else if (!seedDisjoint) {
  verdict = 'FAIL — SEED DISJOINTNESS: a seed family escaped the reservation or collided; STOP';
} else if (MODE === 'smoke') {
  verdict = 'SIZING SMOKE — NOT a verdict (prereg §5): realises the fork/dose populations, the eye consumption '
    + 'frequency, the pooled Δdeep σ̂, and pins the census N via the frozen arithmetic. Pass nArithmetic.nStar as A4P1C_N.';
} else {
  const g = (experiment as Extract<typeof experiment, { mode: 'census' }>).gate;
  verdict = (g.pass && !g.simpsonSignReversalFlag)
    ? 'PASS (prereg §4) — RESOLVED, DOSE-MONOTONE discipline recovery; A4-P1c proceeds to A4-P2 (commander review + numbered ruling, #137.1).'
    : g.simpsonSignReversalFlag
      ? 'NOT-ADVANCE (reading E, #127) — Simpson-genre sign reversal on the primary cell; RETURNS to the user with both exhibits.'
      : 'STOP AT A4-P1c (prereg §4) — null / non-monotone / unresolved dose-response; no measured causal term for the M3′ seam (I-A3). RETURNS to the user.';
}

const body = {
  experiment: `A4-P1c (the fork-and-GRANT census — the causal discipline value of a granted back home prior on the EYE world) [${MODE}]`,
  authority: 'A4-P1C-GRANT-CENSUS §1-§9 (ruling #137; the #126 green path resumes at this rung); '
    + 'contract A4-ASSIGNMENT-CONTRACT §4 (I-A1..I-A7); reconstructs the R3p arm (battery §2) + reuses the P1 '
    + 'deep detector + the P1 cluster bootstrap + the P1b paired-fork idiom',
  head, mode: MODE,
  world: 'ENRICHED (#67.3) + the ARMED R3p eye (v3 base+children+SHA; v4 inSupportLaw+deliveryBit+offsideBit); '
    + 'homeRegionGrant NULL in the base run — the counterfactual (the grant) is created ONLY in branch B',
  flags: CENSUS_FLAGS,
  r3pArm: { v3: 'roleTable+control+children+mergedTableSha (injected P3p-1)', v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true }, mergedTableSha },
  seam: 'Match.homeRegionGrant ({side,bodyIndex,strength}|null; null in every production path). Set ONLY on '
    + 'branch B\'s clone (side d, body index-1). Adds a distance-decayed SOFT bias toward the back home region '
    + 'to the granted body\'s per-candidate station value at the established v3 consumption point (no clamp, no '
    + 'new consumption moment). STATUE-safe (the DF keeps his machinery).',
  perceptHonesty: 'The GRANT is an INSTRUMENT in fork branches (a soft home prior on a granted body inside an '
    + 'offline clone), NOT a consumer ship. No live percept is created/read/leaked; no gene, no M1′–M5 build (A4-P2/P3).',
  preflight: IS_PREFLIGHT ? { cap: Number.isFinite(CAP) ? CAP : null, forkCap: FORK_CAP, seedBase: SEED_BASE, skipFp: SKIP_FP, note: 'bounded preflight — writes OUTSIDE the canonical JSON; not a verdict' } : null,
  parameters: {
    matchCount: MATCH_COUNT, plannedMatches: PLANNED_MATCHES, nEnv: N_ENV,
    nCensus: MODE === 'census' ? N_CENSUS : null, nCap: N_CAP,
    seedBaseFrozen: FROZEN_BASE, seedBaseUsed: SEED_BASE,
    reservedBand: RESERVED_BAND, censusSeedBase: CENSUS_SEED_BASE, smokeSeedBase: SMOKE_SEED_BASE,
    censusSeedRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeSeedRange: [SMOKE_SEED_BASE, smokeMaxSeed],
    consumedBlocks: CONSUMED_BLOCKS,
    wPriceS: W_PRICE_S, doseFractions: DOSE_FRACTIONS, primaryDoseFraction: PRIMARY_DOSE_FRAC,
    valScale: round(VAL_SCALE), doses: DOSES.map((d) => round(d)),
    forkSpacingS: FORK_SPACING_S, forkCapPerMatch: FORK_CAP,
    admittedPriceDeepLabelled: L_DEEP,
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES, statsSeedReserved: STATS_SEED_RESERVED,
    clusterUnit: 'match seed (#20); delta statistic = mean over forks',
    restThird: REST_THIRD, boxInnerLocalX: BOX_INNER_X, boxDepth: BOX_DEPTH, boxWidth: BOX_WIDTH,
    contexts: CONTEXTS,
  },
  result: experiment,
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xForkIdent: { pass: xForkIdent, checked: experiment.xForkIdent.checked, mismatched: experiment.xForkIdent.mismatched, note: 'branch A == an independent plain step-through on EVERY fork (zero leakage)' },
    xMergeIdent: { ...mergeIdent, note: 'the injected P3p-1 merged table identity (battery X-MERGE-SHA), inherited HARD gate' },
    eNonStation: { ...eNonStation, note: 'the eye ACTIVATES on the R3p world (the arm gate is not vacuous) AND never overrides the ball carrier (actionExecutor:676 guard), inherited HARD gate' },
    xFpProd: { pass: xFpProd, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, matches: xFpProd, skipped: SKIP_FP, note: 'src IS touched (the dormant grant seam) ⇒ git diff src is NON-empty BY DESIGN; Road B = X-FP-PROD + the flag-off byte-identity test (tests/a4HomeGrant.test.ts)' },
    srcDiffStat: srcDiff, srcDiffExpectedNonEmpty: true,
    seedDisjoint: { pass: seedDisjoint, reservedBand: RESERVED_BAND, censusRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeRange: [SMOKE_SEED_BASE, smokeMaxSeed], consumedBlocks: CONSUMED_BLOCKS, note: 'computed from the FROZEN family constants (design property); preflight A4P1C_SEED_BASE cannot shift it' },
    xCorpusIdent: 'N/A (a fresh interventional corpus has no identity target — the P1 §4 precedent)',
  },
  gates,
  deviations: [
    'WORLD = the R3p arm reconstructed EXACTLY as the P3p-3 battery built it: enriched (#67.3) + the ARMED eye '
    + '(v3 base+children+mergedTableSha; v4 inSupportLaw+deliveryBit+offsideBit). Its arm gates X-MERGE-IDENT + '
    + 'E-NONSTATION are inherited as HARD gates. The base run carries the eye; the grant is added only in branch B.',
    'INTERVENTIONAL paired same-seed MULTI-DOSE fork: at a qualifying own-possession playing moment for side d, '
    + 'the base R3p state is cloned into branch A (grant null) + ONE branch B per dose (shared branch A ⇒ the whole '
    + 'dose ladder is same-seed paired). The parent is NEVER stepped inside the fork. X-FORK-IDENT (100 %) verifies '
    + 'branch A == an independent plain step-through (zero leakage).',
    'THE SEAM adds a distance-decayed SOFT bias toward the back home region to side d body index-1\'s per-candidate '
    + 'station value at the established v3 consumption point (Match.homeRegionGrant; no clamp, no new moment; '
    + 'body- and side-scoped). Region anchored on PUBLISHED constants (center −12 = −8−0.5·8 rest clamp; half-depth '
    + '4 = 8/2; decay REST_THIRD = HALF_L/3). GRANTED BODY = index-1 (FLAGGED — the incumbent-designated DF, the '
    + 'comparable choice).',
    'THE DOSE GRID = FROZEN FRACTIONS {0.25,0.5,1.0,2.0} × VAL_SCALE, where VAL_SCALE = SD of the neutral-weight '
    + 'station value over the injected v3 base table\'s in-power cells (the eye\'s native score dispersion; '
    + 'deterministic from the SHA-pinned merged table, NOT smoke). PRIMARY = 1.0 (the unit grant). Per-fork '
    + 'MULTI-BRANCH dose assignment keeps the pairing clean.',
    'THE METRIC = RAW opponent deep-entry-against-d count delta B−A in (t_fork, t_fork+10 s] (the P1 deep detector '
    + 'VERBATIM; the certified P0b horizon). The GATE reads RAW rates; the goal-value conversion (× L_DEEP=0.043455) '
    + 'is LABELLED ONLY, non-gating (the admitted price is eye-null-calibrated — two-pin honesty).',
    'THE FROZEN GATE = (i) pooled RAW Δdeep(primary dose) CI UPPER < 0 (the grant REDUCES deep entries) AND '
    + '(ii) dose-monotone non-increasing over [0,0.25,0.5,1.0,2.0] AND (iii) (top−bottom) contrast CI UPPER < 0. '
    + '#127 tightening: a Simpson sign reversal on the primary cell is an automatic NOT-ADVANCE. Any leg fails ⇒ STOP. '
    + 'Frozen before any run; the smoke never informs it.',
    'CONFOUNDING (#94.3 Simpson) — stratified by fork context (side d ball third at t_fork). WITH SAME-SEED PAIRING '
    + 'THIS IS A HETEROGENEITY EXHIBIT, NOT A CONFOUND REPAIR (§4.1). Role is degenerate (the granted body is always '
    + 'index-1). A pooled-vs-standardized SIGN REVERSAL is FLAGGED.',
    'SHAPE EXHIBIT (labelled, NON-GATING): at the top dose, per-tick nearest-teammate spacing + dup-runs for side d '
    + 'over the fork window, branch B vs A (early F-SLIDE sight). The frontier shape gates live at A4-P3, not here.',
    'ADMISSION: a fork tuple is excluded iff ANY branch (A or any dose B) ENDED within W_MAX (truncated horizon). '
    + 'Exclusions PUBLISHED, never pooled.',
    'SIZING before floors (prereg §5): the smoke measures the fork/dose populations + the eye consumption frequency '
    + '+ the pooled Δdeep σ̂ + the per-match wall INCLUDING forks×doses; the frozen arithmetic pins N* (SE_N ≤ '
    + 'MDL/POWER_Z), capped at a WALL-DERIVED N_MAX (≤12 h; N×perMatchWall×2 for X-DET; hard-cap 8,000 keeps the '
    + 'census band ≤ 12,007,999). Attainability-knee on the priceable-fork cell; no optional stopping. Wall measured OUTSIDE the X-DET core (#128).',
    'SEEDS (#137.3.v ratified freeze): smoke 11.95M, census 12.0M, inside 11.7M–12.3M, mutually disjoint and '
    + 'disjoint from the P1/P1b-consumed 11.70/11.80/11.85/11.90M blocks. Stats: bootstrap 100403; 100503 reserved-unused.',
    'X-SRC-ZERO RE-FORMED: src IS touched by this step (the dormant grant seam in Match + stationEye + '
    + 'actionExecutor) so git diff src is NON-empty BY DESIGN. Road B is proven by (1) the FLAG-OFF byte-identity '
    + 'dormancy test + (2) the production fingerprint 57b0bdab…c673 unchanged (X-FP-PROD). Grant null in every production path.',
    'MODE is EXPLICIT via A4P1C_MODE (no default); a bare invocation errors rather than silently running the wrong corpus.',
  ],
  registeredNonClaims: [
    'MEASURES A GRANT\'S DISCIPLINE VALUE, BUILDS NO CONSUMER: A4-P1c prices the causal effect of a granted back home '
    + 'prior via a paired same-seed dose fork; it builds no M1′–M5 mechanism, no gene, no shipped consumer (A4-P2/P3).',
    'THE GRANT IS AN INSTRUMENT (a soft home prior in fork branches), NOT a percept ship — the region/decay/dose are '
    + 'hand-built ONLY as the coordinate frame + blending rule (I-A2/I-A4 诚实张力); WHAT the prior is worth is measured.',
    'GRANTED BODY = index-1 (FLAGGED): the incumbent-designated DF, the comparable choice; a different body / a '
    + 'width or bimodal region are named later slices (contract §7).',
    'THE GOAL-VALUE CONVERSION IS LABELLED ONLY: the admitted deep price is eye-null-calibrated; the gate reads RAW '
    + 'deep-entry rates (two-pin honesty #26.5/#68.2).',
    'NOTHING SHIPS (Road B): homeRegionGrant null in production, the fingerprint 57b0bdab…c673 unchanged.',
    'P1c IS THE THIRD INSTRUMENT (#106.6/#137): user-authorized; there is NO fourth without a fresh user ruling.',
    'A4-P1c CANNOT authorize A4-P2: only the commander\'s review of the census result opens A4-P2 (#137.1); a null / '
    + 'non-monotone / unresolved dose-response STOPS the arc.',
  ],
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
const output = { ...body, sha256 };
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

// --- concise stderr line -----------------------------------------------------
if (MODE === 'smoke') {
  const s = (experiment as Extract<typeof experiment, { mode: 'smoke' }>).sizing as {
    populations: { totalForks: number; forkCapBinds: boolean; endedDropsTotal: number; eyeDecisionsTotal: number };
    pooledPrimaryDelta: number; sigmaPerMatchDelta: number; nArithmetic: { nStar?: number };
  };
  console.error(
    `A4-P1c ${verdict.slice(0, 42)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · smoke ${MATCH_COUNT}m`
    + ` · forks ${s.populations.totalForks} (cap ${s.populations.forkCapBinds}) · eyeDec ${s.populations.eyeDecisionsTotal}`
    + ` · Δ ${s.pooledPrimaryDelta} · σ̂ ${s.sigmaPerMatchDelta} · N* ${s.nArithmetic.nStar} · valScale ${round(VAL_SCALE)}`
    + ` · xDet ${xDet} · xFork ${xForkIdent} · xMerge ${mergeIdent.pass} · eNonSt ${eNonStation.pass} · xFp ${xFpProd} · disj ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
  );
} else {
  const c = (experiment as Extract<typeof experiment, { mode: 'census' }>);
  console.error(
    `A4-P1c ${verdict.slice(0, 42)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · census ${MATCH_COUNT}m (N_env ${N_ENV})`
    + ` · Δprimary ${c.primary.rawDeepDelta.point} [${c.primary.rawDeepDelta.lower}, ${c.primary.rawDeepDelta.upper}]`
    + ` · rungs ${c.doseLadder.rung.map((b) => b.delta.point).join('/')} · mono ${c.doseLadder.monotoneNonIncreasing}`
    + ` · pass ${c.gate.pass} · rev ${c.gate.simpsonSignReversalFlag} · xDet ${xDet} · xFork ${xForkIdent} · xMerge ${mergeIdent.pass} · SHA ${sha256.slice(0, 12)}`,
  );
}
