// A4-P1c — THE FORENSIC SAME-SEED RE-READ (the outlet-tax diagnosis put on trial:
// H1 outlet tax / H2 UNUSED outlet-substrate defect / H4 mechanical surrogate artifact).
//
// AUTHORITY: ruling #140 (the user challenges the #139.2 "outlet tax" diagnosis; it is
// DOWNGRADED from finding to HYPOTHESIS; the forensic same-seed re-read is authorized as
// adjudication diligence — NOT a fourth gate instrument (#106.6 undisturbed); the #139 STOP
// stands regardless of what this re-read finds). The three hypotheses H1/H2/H4 and their
// discriminating mediators are FROZEN in #140.2 and quoted VERBATIM in
// docs/world-model/A4-P1C-FORENSICS.md. This probe REPORTS the mediators; it VERDICTS NOTHING.
//
// DESIGN (#140.3): re-run the FIRST 800 census matches (seeds 12,000,000 + k, k∈0..799 —
// SAME-SEED REUSE IS THE DESIGN, ruled #140.3: determinism makes the re-read exact and
// auditable) with branches A + dose 1.0 + dose 2.0 (a SUBSET of the census's 4-dose ladder;
// each branch is an INDEPENDENT clone from the SAME fork state, so running fewer doses cannot
// perturb the shared branches — the parent match trajectory, the fork moments, branch A, and
// branch B_{1.0}/B_{2.0} are byte-identical to what the census computed).
//
// X-COUNT-IDENT (HARD, #140.3). The census artifact does NOT store per-fork counts, so a direct
// per-fork equality diff is impossible. The identity is instead guaranteed BY CONSTRUCTION and
// checked mechanically:
//   (a) the deep-entry counting block is COPIED BYTE-IDENTICAL from the census runBranch
//       (a4-p1c-grant-census.ts:404-422): same deepPrev seeding, same
//       `oppOwns && phase==='playing' && lx < -REST_THIRD` predicate, same null→true transition,
//       same P1 detector (stage3-v4-p1-calibration.ts:326-344 VERBATIM). The added forensic
//       counters are ALL read-only (they read state AFTER fork.step(DT) and never touch the RNG
//       or control flow), so they cannot perturb the deep count or the fork trajectory.
//   (b) the world/fork/branch machinery (matchOf, the fork-qualification loop, FORK_SPACING_S=4,
//       FORK_CAP_PER_MATCH=20, cloneSimulationState, the branch stepping, X-FORK-IDENT) is REUSED
//       from the census unchanged — same parent stepping ⇒ same qualifying moments ⇒ same forks.
//   (c) X-DET double-runs this probe (byte-identical output) + X-FORK-IDENT (branch A == an
//       independent plain clone) prove the determinism the identity rests on.
// The honest limit (stated in the doc): (a)+(b)+(c) prove the counts EQUAL what the census WOULD
// recompute on these 800 seeds; the pooled deep delta over the 800-subset is reported for eyeball
// against the census's full-N sign/shape, but is NOT expected to equal the full-N pooled figure.
//
// COUNTERS ADDED per branch (side d = the fork owner; granted body = side-d index-1, the census's
// grantee):
//   • deepEntries   — BYTE-IDENTICAL to the census (the X-COUNT-IDENT anchor).
//   • boxEntries    — the P1 calibration box detector VERBATIM (stage3-v4-p1-calibration.ts:337-343):
//                     oppOwns && playing && lx <= BOX_INNER_X && |ball.y| <= BOX_WIDTH/2, null→true.
//   • turnovers     — possession losses by side d in the window: transitions of Match.possessionSide
//                     from d to (1−d) (the persistent possessor; -1 dead-ball transients are not a
//                     turnover). firstTurnoverTicks = ticks-since-fork of the FIRST such loss,
//                     CENSORED at W_MAX_TICKS when none (retention proxy; higher = more retained).
//   • turnoverThird — the side-d-local third (own/mid/their) of the ball at the FIRST turnover
//                     (contextOf; 'none' if the window keeps possession).
//   • grantedReceives — times the granted body GAINS ball ownership in the window (ball.owner.gid
//                     → grantedGid transition); grantedReceiveLocalX = his own localX at each
//                     receive (pooled mean per branch).
//   • teamPassesForward / Backward — side-d pass ATTEMPTS in the window (a NEW Match.pendingPass
//                     with pass.side===d), classified by the SAME backward test passBackPen uses:
//                     gain = clamp01((localX(target)−localX(passer)+30)/60)*2−1 (PlayerBrain.ts:320);
//                     gain>0 ⇒ forward (PlayerBrain.ts:356), else ⇒ backward (PlayerBrain.ts:357,
//                     the passBackPen branch). passesToGranted = attempts whose targetGid===grantedGid.
//
// OUTPUT: docs/world-model/data/a4-p1c-forensics.json — per-branch pooled means + match-cluster CIs
// for every mediator (A, dose1, dose2; paired deltas dose1−A, dose2−A), the H1/H2/H4 discrimination
// table auto-populated MECHANICALLY (point estimates + CIs + matched/unmatched/ambiguous, NO verdict
// text), receipts (capped), and the X-family results. REPORTED-only: no gate, no disposition.
//
// MODE KNOB: A4P1CF_CAP caps the match count for the BOUNDED PREFLIGHT (⇒ IS_PREFLIGHT: never writes
// the canonical JSON, skips nothing else unless told). The REAL run takes NO N env — the 800 is FROZEN
// in the doc (#140.3). Preflight-only knobs: A4P1CF_FORK_CAP, A4P1CF_OUT, A4P1CF_SKIP_DET,
// A4P1CF_SKIP_FP, A4P1CF_SEED_BASE.
//
// COMMAND LINES:
//   real:      npx tsx scripts/probes/a4-p1c-forensics.ts
//   preflight: A4P1CF_CAP=3 A4P1CF_FORK_CAP=3 A4P1CF_OUT=/tmp/x.json A4P1CF_SKIP_FP=1 \
//                npx tsx scripts/probes/a4-p1c-forensics.ts

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
  CELL_FLOOR, newStationEyeTrace,
  type MergedChildTable, type RoleConditionedTable, type RoleControlLevels, type RoleCell,
  type StationEyeTrace,
} from '../../src/ai/stationEye';
import { clamp01 } from '../../src/utils/math';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING — the census constants REUSED verbatim (so the fork sampling is identical).
// =============================================================================
const CENSUS_SEED_BASE = 12_000_000; // #140.3: the FIRST 800 census matches, 12,000,000 + k, k∈0..799
const FORENSICS_MATCHES = 800; // FROZEN in the doc (#140.3); the real run takes NO N env
const RESERVED_BAND = [11_700_000, 12_300_000] as const;
const CONSUMED_BLOCKS = [
  [11_700_000, 11_700_039], // P1 smoke
  [11_800_000, 11_807_999], // P1 census
  [11_850_000, 11_850_039], // P1b smoke
  [11_900_000, 11_907_999], // P1b census
  [11_950_000, 11_950_039], // A4-P1c sizing smoke
] as const;

const BOOTSTRAP_SEED = 100_403; // the P1/P1b/census stats seed (#140 re-read reuses the engine)
const BOOTSTRAP_RESAMPLES = 2_000;

// horizon + fork sampling (census verbatim — so forks match exactly).
const W_PRICE_S = 10;
const W_MAX_TICKS = Math.round(W_PRICE_S / DT);
const FORK_SPACING_S = 4.0;
const FORK_CAP_PER_MATCH = 20;

// the DOSE SUBSET (#140.3): branches A + dose 1.0 + dose 2.0 (fractions × VAL_SCALE).
const DOSE_FRACTIONS = [1.0, 2.0] as const;
const PRIMARY_DOSE_FRAC = 1.0; // the census primary dose (the H1/H2/H4 comparison cell)
const TOP_DOSE_FRAC = 2.0;

// surrogate geometry (P1 :326-344 VERBATIM).
const REST_THIRD = HALF_L / 3;
const BOX_INNER_X = -(HALF_L - BOX_DEPTH); // the box detector's inner-x threshold (P1 :337-338)

const N_STEP = 200; // (unused for sizing here; the N is frozen) — kept for parity documentation
const XDET_FACTOR = 2;

// X-FP-PROD — the frozen shipped-world production fingerprint (census verbatim).
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

// X-MERGE-IDENT (census verbatim).
const MERGED_PATH = 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const MERGED_SHA_EXPECTED = '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED = '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';

const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const RECEIPT_CAP = 1_000;
const CONTEXTS = ['own', 'mid', 'their'] as const;
type Context = (typeof CONTEXTS)[number];

// =============================================================================
// ENV / MODE.
// =============================================================================
const CAP = process.env.A4P1CF_CAP ? Math.max(1, Number.parseInt(process.env.A4P1CF_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(CAP);
const FORK_CAP = (IS_PREFLIGHT && process.env.A4P1CF_FORK_CAP)
  ? Math.max(1, Number.parseInt(process.env.A4P1CF_FORK_CAP, 10)) : FORK_CAP_PER_MATCH;
const SKIP_DET = process.env.A4P1CF_SKIP_DET === '1';
const SKIP_FP = process.env.A4P1CF_SKIP_FP === '1';
const FROZEN_BASE = CENSUS_SEED_BASE;
const SEED_BASE = (IS_PREFLIGHT && process.env.A4P1CF_SEED_BASE)
  ? Math.max(0, Number.parseInt(process.env.A4P1CF_SEED_BASE, 10)) : FROZEN_BASE;
const MATCH_COUNT = IS_PREFLIGHT ? Math.min(FORENSICS_MATCHES, CAP) : FORENSICS_MATCHES;
const CANONICAL_OUT = 'docs/world-model/data/a4-p1c-forensics.json';
const OUT_PATH = process.env.A4P1CF_OUT ?? (IS_PREFLIGHT ? '/tmp/a4p1cf-preflight.json' : CANONICAL_OUT);

// =============================================================================
// SMALL NUMERIC HELPERS (census verbatim).
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
// THE INJECTED P3p-1 MERGED TABLE + CONTROL (X-MERGE-IDENT) — census verbatim.
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
const buildMergeIdent = () => {
  const mergedRehash = shaOf({ base: roleTable, children });
  const baseRehash = shaOf(roleTable);
  const pass = mergedTableSha === MERGED_SHA_EXPECTED
    && mergedRehash === MERGED_SHA_EXPECTED && baseRehash === BASE_SHA_EXPECTED;
  return { mergedShaField: mergedTableSha, mergedShaExpected: MERGED_SHA_EXPECTED, mergedRehash, baseRehash, baseShaExpected: BASE_SHA_EXPECTED, pass };
};

// VAL_SCALE (census verbatim): SD of val=0.5·score−0.5·concede over in-power base cells.
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

// =============================================================================
// THE R3p FIXTURE (census verbatim) — enriched world + the ARMED R3p eye.
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
const r3pEye = (trace?: StationEyeTrace) => ({
  arm: 'neutral' as const, scope: { kind: 'both' as const }, table: {},
  v3: { roleTable, control, children, mergedTableSha },
  v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true },
  ...(trace ? { trace } : {}),
});
const bareMatchOf = (seed: number): Match =>
  new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), ...CENSUS_FLAGS });
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

// E-NONSTATION (census verbatim) — the eye ACTIVATES on the R3p world and never overrides the carrier.
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
  const bothM = matchOf(seed);
  let bothActivated = false;
  for (let i = 0; i < 3000 && !bothM.finished; i++) {
    bothM.step(DT);
    if (bothM.stationEyeState.size > 0) { bothActivated = true; break; }
  }
  const pass = freshNull && bodyScopeOk && teamScopeOk && bothActivated && carrierNeverOverridden;
  return { pass, freshNull, bodyScopeOk, teamScopeOk, bothActivated, carrierNeverOverridden };
};

// =============================================================================
// ONE BRANCH — clone the base, optionally GRANT side d body-1 at `strength`, step W_MAX_TICKS.
// The DEEP block is BYTE-IDENTICAL to the census (a4-p1c-grant-census.ts:404-422); the forensic
// counters that follow are ALL READ-ONLY (they never touch the RNG or control flow), so branch A
// and the shared dose branches remain byte-identical to what the census computed (X-COUNT-IDENT).
// =============================================================================
interface BranchOut {
  // --- the X-COUNT-IDENT anchor (census-verbatim) ---
  nDeep: number;
  // --- the forensic mediators (#140.3) ---
  nBox: number;
  turnovers: number;
  firstTurnoverTicks: number; // ticks-since-fork of the FIRST loss; CENSORED at W_MAX_TICKS if none
  firstTurnoverThird: Context | 'none';
  grantedReceives: number;
  grantedReceiveLxSum: number; // Σ granted-body localX over receives (pooled-mean numerator)
  passFwd: number;
  passBack: number;
  passToGranted: number;
  passToGrantedBack: number;
  // --- bookkeeping ---
  ended: boolean;
  signature: string;
}

const runBranch = (
  base: Match, d: Side, strength: number, seed: number, decisionTick: number,
  label: string, receipts: ReceiptBook | null,
): BranchOut => {
  const fork = cloneSimulationState(base);
  if (strength !== 0) fork.homeRegionGrant = { side: d, bodyIndex: 1, strength }; // the counterfactual, on THIS clone only
  const mine = fork.teams[d];
  const startTick = fork.simTick;
  const grantedGid = mine.players.find((p) => p.index === 1)?.gid ?? -1;
  const opp = (1 - d) as Side;

  // --- DEEP seeding (census-verbatim, a4-p1c-grant-census.ts:404-406) ---
  const ball0 = fork.ball;
  const owner0 = ball0.owner;
  const oppOwns0 = owner0 !== null && owner0.side !== d;
  const lx0 = mine.localX(ball0.pos.x);
  let deepPrev = oppOwns0 && fork.phase === 'playing' && lx0 < -REST_THIRD;
  // --- BOX seeding (P1 calibration box detector, stage3-v4-p1-calibration.ts:337-338) ---
  let boxPrev = oppOwns0 && fork.phase === 'playing' && lx0 <= BOX_INNER_X && Math.abs(ball0.pos.y) <= BOX_WIDTH / 2;
  // --- possession / receive / pass seeding (read the fork-start state so only NEW events count) ---
  let lastRealPoss: Side | -1 = fork.possessionSide;
  let prevOwnerGid = owner0?.gid ?? -1;
  const pp0 = fork.pendingPass;
  let lastPassT = pp0?.t ?? Number.NaN;
  let lastPasserGid = pp0?.passerGid ?? -1;
  let lastTargetGid = pp0?.targetGid ?? -1;

  let nDeep = 0; let nBox = 0;
  let turnovers = 0; let firstTurnoverTicks = W_MAX_TICKS; let firstTurnoverThird: Context | 'none' = 'none';
  let grantedReceives = 0; let grantedReceiveLxSum = 0;
  let passFwd = 0; let passBack = 0; let passToGranted = 0; let passToGrantedBack = 0;
  let ended = false;

  while (!fork.finished && fork.simTick - startTick < W_MAX_TICKS) {
    fork.step(DT);
    if (fork.finished) { ended = true; break; }

    const owner = fork.ball.owner;
    const oppOwns = owner !== null && owner.side !== d;
    const lx = mine.localX(fork.ball.pos.x);

    // ===== DEEP entry — BYTE-IDENTICAL to the census (X-COUNT-IDENT anchor) =====
    const deepNow = oppOwns && fork.phase === 'playing' && lx < -REST_THIRD;
    if (deepNow && !deepPrev) {
      nDeep += 1;
      addReceipt(receipts, 'deep-entry-against', seed, decisionTick, owner?.gid ?? -1, `branch${label} d${d} lx=${round(lx, 2)}`);
    }
    deepPrev = deepNow;

    // ===== BOX entry — the P1 calibration box detector VERBATIM (:337-343) =====
    const boxNow = oppOwns && fork.phase === 'playing' && lx <= BOX_INNER_X && Math.abs(fork.ball.pos.y) <= BOX_WIDTH / 2;
    if (boxNow && !boxPrev) nBox += 1;
    boxPrev = boxNow;

    // ===== TURNOVER — side-d possession loss (possessionSide d → (1−d)) =====
    const ps = fork.possessionSide;
    if (ps !== -1 && ps !== lastRealPoss) {
      if (lastRealPoss === d && ps === opp) {
        turnovers += 1;
        if (firstTurnoverThird === 'none') {
          firstTurnoverTicks = fork.simTick - startTick;
          firstTurnoverThird = contextOf(lx);
          addReceipt(receipts, 'turnover', seed, decisionTick, owner?.gid ?? -1, `branch${label} d${d} third=${firstTurnoverThird} t+${firstTurnoverTicks}`);
        }
      }
      lastRealPoss = ps;
    }

    // ===== GRANTED-body RECEIVES — ball ownership gained by side-d index-1 =====
    const ownerGid = owner?.gid ?? -1;
    if (ownerGid === grantedGid && prevOwnerGid !== grantedGid) {
      grantedReceives += 1;
      const g = mine.players.find((p) => p.index === 1);
      if (g) grantedReceiveLxSum += mine.localX(g.pos.x);
    }
    prevOwnerGid = ownerGid;

    // ===== side-d PASS ATTEMPTS — a NEW pendingPass, classified by passBackPen's gain test =====
    const pp = fork.pendingPass;
    if (pp !== null && pp.side === d
      && (pp.t !== lastPassT || pp.passerGid !== lastPasserGid || pp.targetGid !== lastTargetGid)) {
      const passer = fork.allPlayers[pp.passerGid];
      const target = fork.allPlayers[pp.targetGid];
      if (passer && target) {
        // the SAME backward test PlayerBrain.ts:320 defines / :356-357 splits (passBackPen branch):
        const gain = clamp01((mine.localX(target.pos.x) - mine.localX(passer.pos.x) + 30) / 60) * 2 - 1;
        if (gain > 0) passFwd += 1; else passBack += 1;
        if (pp.targetGid === grantedGid) { passToGranted += 1; if (!(gain > 0)) passToGrantedBack += 1; }
      }
      lastPassT = pp.t; lastPasserGid = pp.passerGid; lastTargetGid = pp.targetGid;
    }
  }
  return {
    nDeep, nBox, turnovers, firstTurnoverTicks, firstTurnoverThird,
    grantedReceives, grantedReceiveLxSum, passFwd, passBack, passToGranted, passToGrantedBack,
    ended, signature: signatureOf(fork),
  };
};

// =============================================================================
// THE RAW COLLECTION per match (census-verbatim fork loop; only DOSES trimmed to {1.0,2.0}).
// =============================================================================
interface ForkRec {
  d: Side;
  context: Context;
  gid: number;
  A: BranchOut;
  byDose: Record<string, BranchOut>;
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

const runForensicMatch = (seed: number, receipts: ReceiptBook | null): CensusRow => {
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

    const branchA = runBranch(m, d, 0, seed, decisionTick, 'A', receipts);
    const byDose: Record<string, BranchOut> = {};
    for (let i = 0; i < DOSES.length; i++) {
      byDose[doseKey(DOSE_FRACTIONS[i])] = runBranch(m, d, DOSES[i], seed, decisionTick, `B${DOSE_FRACTIONS[i]}`, receipts);
    }
    forked += 1;
    forksThisMatch += 1;

    // X-FORK-IDENT (HARD): an independent plain clone (grant null) == branch A (zero leakage).
    const plain = cloneSimulationState(m);
    for (let i = 0; i < W_MAX_TICKS && !plain.finished; i++) plain.step(DT);
    xForkChecked += 1;
    if (signatureOf(plain) !== branchA.signature) xForkMismatched += 1;

    const anyEnded = branchA.ended || DOSE_FRACTIONS.some((f) => byDose[doseKey(f)].ended);
    if (anyEnded) {
      endedDrops += 1;
      addReceipt(receipts, 'fork-excluded-ended', seed, decisionTick, gid, `d${d} ctx=${context}`);
    } else {
      forks.push({ d, context, gid, A: branchA, byDose });
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
// STATISTICS — the census match-cluster bootstrap (#20), engine verbatim.
// =============================================================================
type ForkFilter = (f: ForkRec) => boolean;
type ForkValue = (f: ForkRec) => number;
const allF: ForkFilter = () => true;

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

// per-mediator branch value extractors.
type BranchPick = (b: BranchOut) => number;
const pickA = (pick: BranchPick): ForkValue => (f) => pick(f.A);
const pickDose = (frac: number, pick: BranchPick): ForkValue => (f) => pick(f.byDose[doseKey(frac)]);
const pickDelta = (frac: number, pick: BranchPick): ForkValue => (f) => pick(f.byDose[doseKey(frac)]) - pick(f.A);

// a mediator triple (A, per-dose) + the paired deltas (dose−A), with match-cluster CIs.
const buildMediator = (rows: readonly CensusRow[], name: string, pick: BranchPick, off: number) => ({
  mediator: name,
  A: meanCI(rows, allF, pickA(pick), off),
  dose1: meanCI(rows, allF, pickDose(PRIMARY_DOSE_FRAC, pick), off + 1),
  dose2: meanCI(rows, allF, pickDose(TOP_DOSE_FRAC, pick), off + 2),
  deltaDose1MinusA: meanCI(rows, allF, pickDelta(PRIMARY_DOSE_FRAC, pick), off + 3),
  deltaDose2MinusA: meanCI(rows, allF, pickDelta(TOP_DOSE_FRAC, pick), off + 4),
});

// the turnover-third distribution per branch (categorical; own-share among turnovers).
const buildTurnoverThird = (rows: readonly CensusRow[]) => {
  const dist = (branch: (f: ForkRec) => BranchOut) => {
    const c: Record<string, number> = { own: 0, mid: 0, their: 0, none: 0 };
    for (const r of rows) for (const f of r.forks) c[branch(f).firstTurnoverThird] += 1;
    const withTo = c.own + c.mid + c.their;
    return { ...c, withTurnover: withTo, ownShareAmongTurnovers: round(withTo === 0 ? Number.NaN : c.own / withTo) };
  };
  return {
    note: 'the side-d-local third (own/mid/their) of the ball at the FIRST turnover in the window; '
      + '"none" = possession retained the whole window. ownShareAmongTurnovers = own/(own+mid+their).',
    A: dist((f) => f.A),
    dose1: dist((f) => f.byDose[doseKey(PRIMARY_DOSE_FRAC)]),
    dose2: dist((f) => f.byDose[doseKey(TOP_DOSE_FRAC)]),
  };
};

// pooled granted-receive localX (mean over receives, not per-fork; avoids per-fork NaN).
const buildGrantedReceiveLocalX = (rows: readonly CensusRow[]) => {
  const pooled = (branch: (f: ForkRec) => BranchOut) => {
    let lxSum = 0; let recv = 0;
    for (const r of rows) for (const f of r.forks) { lxSum += branch(f).grantedReceiveLxSum; recv += branch(f).grantedReceives; }
    return { receives: recv, meanLocalX: round(recv === 0 ? Number.NaN : lxSum / recv) };
  };
  return {
    note: 'pooled over all receives (Σ localX / Σ receives), NOT a per-fork mean — the granted body\'s '
      + 'own localX when he GAINS the ball; more negative = deeper. Reported per branch (levels).',
    A: pooled((f) => f.A),
    dose1: pooled((f) => f.byDose[doseKey(PRIMARY_DOSE_FRAC)]),
    dose2: pooled((f) => f.byDose[doseKey(TOP_DOSE_FRAC)]),
  };
};

// =============================================================================
// THE H1/H2/H4 DISCRIMINATION TABLE — auto-populated MECHANICALLY (no verdict text).
// classify a CI vs a predicted direction. matched/unmatched/ambiguous ONLY.
// =============================================================================
type Dir = 'up' | 'down' | 'equal' | 'notHigher';
const resolvedSign = (ci: { lower: number; upper: number }): 'up' | 'down' | 'spans' => {
  if (Number.isFinite(ci.lower) && ci.lower > 0) return 'up';
  if (Number.isFinite(ci.upper) && ci.upper < 0) return 'down';
  return 'spans';
};
const classify = (ci: { point: number; lower: number; upper: number }, predicted: Dir): 'matched' | 'unmatched' | 'ambiguous' => {
  const sign = resolvedSign(ci);
  if (predicted === 'up') return sign === 'up' ? 'matched' : sign === 'down' ? 'unmatched' : 'ambiguous';
  if (predicted === 'down') return sign === 'down' ? 'matched' : sign === 'up' ? 'unmatched' : 'ambiguous';
  if (predicted === 'equal') return sign === 'spans' ? 'matched' : 'unmatched'; // "≈ equal" ⇒ CI must span 0
  // notHigher: the delta must NOT be resolved-up (spans 0 or resolved-down ⇒ matched).
  return sign === 'up' ? 'unmatched' : 'matched';
};

const buildHypotheses = (
  turnovers: ReturnType<typeof buildMediator>, retention: ReturnType<typeof buildMediator>,
  box: ReturnType<typeof buildMediator>, receives: ReturnType<typeof buildMediator>,
  passToGrantedBack: ReturnType<typeof buildMediator>, third: ReturnType<typeof buildTurnoverThird>,
) => {
  // all delta cells read at the PRIMARY dose (1.0) vs A — the census primary comparison.
  const pred = (label: string, mediator: string, ci: ReturnType<typeof meanCI>, dir: Dir) => ({
    prediction: label, mediator, predictedDirection: dir,
    delta: { point: ci.point, lower: ci.lower, upper: ci.upper, n: ci.n },
    match: classify(ci, dir),
  });
  // H4 turnover-LOCATION-deeper: ownShare(dose1) − ownShare(A) among turnovers (a share delta, no CI ⇒ point-only).
  const ownShareDelta = round(third.dose1.ownShareAmongTurnovers - third.A.ownShareAmongTurnovers);
  return {
    comparisonCell: 'PRIMARY dose (fraction 1.0) − branch A; per-fork paired; match-cluster CI (#20)',
    note: 'MECHANICAL population only (point estimates + CIs + matched/unmatched/ambiguous). NO verdict text; '
      + 'the commander adjudicates #140. "≈ equal" ⇒ CI spans 0; "notHigher" ⇒ delta not resolved-up. '
      + 'Level-only predictions (rare backward-to-granted, turnover-location) report the number, not a contrast.',
    H1_outletTax: {
      statement: 'possession dies earlier: branch-B turnovers/window ↑ resolved; retention time ↓; box entries ↑.',
      predictions: [
        pred('turnovers/window ↑ resolved', 'turnovers', turnovers.deltaDose1MinusA, 'up'),
        pred('retention time ↓', 'firstTurnoverTicks (censored@W)', retention.deltaDose1MinusA, 'down'),
        pred('box entries ↑', 'boxEntries', box.deltaDose1MinusA, 'up'),
      ],
    },
    H2_unusedOutlet: {
      statement: 'substrate defect: the granted body\'s deep receives NOT higher in B (backward passes to him '
        + 'rare; passBackPen suspect); turnovers ↑ anyway.',
      predictions: [
        pred('granted receives NOT higher in B', 'grantedReceives', receives.deltaDose1MinusA, 'notHigher'),
        pred('turnovers ↑ anyway', 'turnovers', turnovers.deltaDose1MinusA, 'up'),
      ],
      levelReported: {
        backwardPassesToGrantedRare: {
          note: 'LEVEL, not a contrast — backward-pass attempts targeting the granted body per window (A vs B). '
            + '"rare" is read against teamPassesBackward/Forward levels; the commander judges (passBackPen suspect).',
          A: passToGrantedBack.A, dose1: passToGrantedBack.dose1, dose2: passToGrantedBack.dose2,
        },
      },
    },
    H4_surrogateArtifact: {
      statement: 'turnovers ≈ equal and retention ≈ equal, but turnover LOCATION deeper in B; box ≈ NULL; '
        + 'the deep↑ largely a location-shift artifact of the entry counter.',
      predictions: [
        pred('turnovers ≈ equal', 'turnovers', turnovers.deltaDose1MinusA, 'equal'),
        pred('retention ≈ equal', 'firstTurnoverTicks (censored@W)', retention.deltaDose1MinusA, 'equal'),
        pred('box ≈ NULL', 'boxEntries', box.deltaDose1MinusA, 'equal'),
      ],
      levelReported: {
        turnoverLocationDeeperInB: {
          note: 'LEVEL/point — own-third share among turnovers, dose1 − A (positive = deeper losses under the grant). '
            + 'No CI (a categorical share); the commander reads it beside the box/turnover contrasts.',
          ownShareA: third.A.ownShareAmongTurnovers, ownShareDose1: third.dose1.ownShareAmongTurnovers,
          ownShareDose2: third.dose2.ownShareAmongTurnovers, ownShareDeltaDose1MinusA: ownShareDelta,
        },
      },
    },
  };
};

// =============================================================================
// THE DETERMINISTIC EXPERIMENT (run TWICE for X-DET).
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);

const runExperiment = () => {
  const seeds: number[] = [];
  for (let k = 0; k < MATCH_COUNT; k++) seeds.push(SEED_BASE + k);
  const receipts: ReceiptBook = {};
  const t0 = Date.now();
  const rows: CensusRow[] = seeds.map((s) => runForensicMatch(s, receipts));
  const perMatchWallMs = seeds.length === 0 ? 0 : (Date.now() - t0) / seeds.length;

  const seedRange = { first: seeds[0] ?? null, last: seeds[seeds.length - 1] ?? null, count: seeds.length };
  const xForkChecked = sumBy(rows, (r) => r.xForkChecked);
  const xForkMismatched = sumBy(rows, (r) => r.xForkMismatched);

  // the mediators (per-branch means + paired deltas).
  const deep = buildMediator(rows, 'deepEntries', (b) => b.nDeep, 100);
  const box = buildMediator(rows, 'boxEntries', (b) => b.nBox, 110);
  const turnovers = buildMediator(rows, 'turnovers', (b) => b.turnovers, 120);
  const retention = buildMediator(rows, 'firstTurnoverTicks', (b) => b.firstTurnoverTicks, 130);
  const grantedReceives = buildMediator(rows, 'grantedReceives', (b) => b.grantedReceives, 140);
  const passFwd = buildMediator(rows, 'teamPassesForward', (b) => b.passFwd, 150);
  const passBack = buildMediator(rows, 'teamPassesBackward', (b) => b.passBack, 160);
  const passToGranted = buildMediator(rows, 'passesToGranted', (b) => b.passToGranted, 170);
  const passToGrantedBack = buildMediator(rows, 'passesToGrantedBackward', (b) => b.passToGrantedBack, 180);
  const third = buildTurnoverThird(rows);
  const grantedReceiveLocalX = buildGrantedReceiveLocalX(rows);
  const hypotheses = buildHypotheses(turnovers, retention, box, grantedReceives, passToGrantedBack, third);

  const core = {
    seedRange,
    seedFamily: '12,000,000 + k, k∈0..799 (the FIRST 800 census matches; SAME-SEED REUSE = the design, #140.3)',
    wPriceS: W_PRICE_S, doseFractions: DOSE_FRACTIONS, valScale: round(VAL_SCALE),
    doses: DOSES.map((x) => round(x)),
    mediators: {
      deepEntries: deep, boxEntries: box, turnovers, firstTurnoverTicks: retention,
      grantedReceives, grantedReceiveLocalX, teamPassesForward: passFwd, teamPassesBackward: passBack,
      passesToGranted: passToGranted, passesToGrantedBackward: passToGrantedBack,
      turnoverThird: third,
    },
    hypothesisTable: hypotheses,
    xCountIdent: {
      note: 'the census stores no per-fork counts ⇒ direct per-fork equality is impossible. The identity is '
        + 'guaranteed BY CONSTRUCTION: the DEEP block is byte-identical to a4-p1c-grant-census.ts:404-422, the '
        + 'forensic counters are read-only, and the fork machinery (FORK_SPACING=4, FORK_CAP=20, cloneSimulationState) '
        + 'is reused unchanged ⇒ same parent trajectory ⇒ same forks ⇒ identical branch-A/B deep counts. X-DET + '
        + 'X-FORK-IDENT prove the determinism. Reported for eyeball vs the census signs (NOT a full-N equality):',
      pooledDeepDeltaDose1MinusA: deep.deltaDose1MinusA,
      pooledDeepDeltaDose2MinusA: deep.deltaDose2MinusA,
      censusFullNReference: { dose1: '+0.046066 [+0.039961, +0.052158]', dose2: '+0.0464 (saturating)', note: 'full-N (3800 m); the 800-subset need not equal it, only share sign/shape' },
    },
    populations: {
      totalForks: countForks(rows, allF),
      qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
      forkedTotal: sumBy(rows, (r) => r.counts.forked),
      capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
      capBinds: rows.some((r) => r.counts.capSkipped > 0),
      endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
      eyeDecisionsTotal: sumBy(rows, (r) => r.eyeDecisions),
    },
    xForkIdent: { checked: xForkChecked, mismatched: xForkMismatched, pass: xForkMismatched === 0 },
    receipts: {
      cap: RECEIPT_CAP,
      counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])),
      records: receipts,
    },
  };
  return { core, wallMs: perMatchWallMs };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET, X-FORK-IDENT, X-MERGE-IDENT, E-NONSTATION, X-FP-PROD, disjointness.
// =============================================================================
const { core: experiment, wallMs } = runExperiment();
const experiment2 = SKIP_DET ? null : runExperiment().core;
const xDet = SKIP_DET ? null : canonical(experiment) === canonical(experiment2);

const xForkIdent = experiment.xForkIdent.pass;
const mergeIdent = buildMergeIdent();
const eNonStation = checkENonStation();

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

const forensicsMaxSeed = CENSUS_SEED_BASE + FORENSICS_MATCHES - 1; // 12,000,799
const disjointFrom = (aLo: number, aHi: number, bLo: number, bHi: number): boolean => aHi < bLo || bHi < aLo;
const seedDisjoint =
  CENSUS_SEED_BASE >= RESERVED_BAND[0] && forensicsMaxSeed <= RESERVED_BAND[1]
  && CONSUMED_BLOCKS.every(([lo, hi]) => disjointFrom(CENSUS_SEED_BASE, forensicsMaxSeed, lo, hi));

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates = { xDet, xForkIdent, xMergeIdent: mergeIdent.pass, eNonStation: eNonStation.pass, xFpProd, seedDisjoint };

let verdict: string;
if (IS_PREFLIGHT) {
  verdict = `PREFLIGHT (bounded) — NOT a result; exercises the R3p arm + fork sampling + branch A + the two dose `
    + 'branches + the forensic counters + X-FORK-IDENT + X-MERGE-IDENT + E-NONSTATION + X-DET on a capped slice. '
    + 'Numbers on ≤ few matches are meaningless by design; nothing canonical written.';
} else if (xDet === false) {
  verdict = 'FAIL — X-DET: the output is not byte-identical across the double-run; STOP';
} else if (!xForkIdent) {
  verdict = 'FAIL — X-FORK-IDENT: branch A diverged from an independent plain step-through; STOP';
} else if (!mergeIdent.pass) {
  verdict = 'FAIL — X-MERGE-IDENT: the injected merged table SHA/rehash does not match the P3p-1 identity; STOP';
} else if (!eNonStation.pass) {
  verdict = 'FAIL — E-NONSTATION: the eye did not activate on the R3p world, or it overrode the ball carrier; STOP';
} else if (!xFpProd) {
  verdict = 'FAIL — X-FP-PROD: the production fingerprint moved (the dormant grant seam is not dormant); STOP';
} else if (!seedDisjoint) {
  verdict = 'FAIL — SEED DISJOINTNESS: the forensic band escaped the reservation or collided; STOP';
} else {
  verdict = 'FORENSIC RE-READ COMPLETE (REPORTED-only, #140) — the H1/H2/H4 mediators + discrimination table are '
    + 'populated; NO gate, NO disposition. The #139 STOP stands regardless; the commander adjudicates #140 and '
    + 're-issues the #139.5 fork.';
}

const body = {
  experiment: 'A4-P1c FORENSIC same-seed re-read (H1 outlet tax / H2 unused outlet-substrate defect / H4 surrogate artifact)',
  authority: 'ruling #140 (the outlet-tax diagnosis DOWNGRADED to hypothesis; the forensic same-seed re-read authorized '
    + 'as adjudication diligence, NOT a fourth instrument — #106.6 undisturbed; the #139 STOP stands regardless). '
    + 'Hypotheses + predictions FROZEN in #140.2 (quoted verbatim in A4-P1C-FORENSICS.md). Reuses the census '
    + 'world/fork/branch machinery (a4-p1c-grant-census.ts) + the P1 deep/box detectors + the P1 cluster bootstrap.',
  head,
  world: 'ENRICHED (#67.3) + the ARMED R3p eye (v3 base+children+SHA; v4 inSupportLaw+deliveryBit+offsideBit); '
    + 'homeRegionGrant NULL in the base run — the grant is created ONLY in branch B (census verbatim)',
  flags: CENSUS_FLAGS,
  r3pArm: { v3: 'roleTable+control+children+mergedTableSha (injected P3p-1)', v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true }, mergedTableSha },
  design: '#140.3: re-run the FIRST 800 census matches (12,000,000 + k, k∈0..799) with branches A + dose 1.0 + dose 2.0 '
    + '(a subset of the census 4-dose ladder; each branch an independent clone from the SAME fork state ⇒ the shared '
    + 'branches are byte-identical to the census). SAME-SEED REUSE IS THE DESIGN (#140.3).',
  counters: {
    deepEntries: 'BYTE-IDENTICAL to the census (a4-p1c-grant-census.ts:404-422); the X-COUNT-IDENT anchor',
    boxEntries: 'the P1 calibration box detector VERBATIM (stage3-v4-p1-calibration.ts:337-343): oppOwns && playing && lx <= BOX_INNER_X && |ball.y| <= BOX_WIDTH/2, null→true',
    turnovers: 'possession losses by side d = Match.possessionSide transitions d→(1−d) in the window (-1 dead-ball transients ignored); firstTurnoverTicks = ticks-since-fork of the first loss, CENSORED at W_MAX_TICKS if none (retention proxy)',
    turnoverThird: 'the side-d-local third (own/mid/their) of the ball at the FIRST turnover (contextOf); "none" if retained',
    grantedReceives: 'ball.owner.gid → granted-body(gid) transitions in the window; grantedReceiveLocalX = the granted body\'s own localX at each receive (pooled mean)',
    teamPassesForwardBackward: 'side-d NEW pendingPass attempts, classified by the SAME backward test passBackPen uses: gain=clamp01((localX(target)−localX(passer)+30)/60)*2−1 (PlayerBrain.ts:320); gain>0 ⇒ forward (:356), else backward (:357). passesToGranted = attempts targeting the granted body',
  },
  perceptHonesty: 'The GRANT is an INSTRUMENT in fork branches (a soft home prior in an offline clone), NOT a consumer '
    + 'ship. No live percept is created/read/leaked; no gene, no M1′–M5 build. This is a REPORTED re-read, not a gate.',
  preflight: IS_PREFLIGHT ? { cap: Number.isFinite(CAP) ? CAP : null, forkCap: FORK_CAP, seedBase: SEED_BASE, skipFp: SKIP_FP, note: 'bounded preflight — writes OUTSIDE the canonical JSON; not a result' } : null,
  parameters: {
    matchCount: MATCH_COUNT, forensicsMatchesFrozen: FORENSICS_MATCHES,
    seedBaseFrozen: FROZEN_BASE, seedBaseUsed: SEED_BASE,
    forensicsSeedRange: [CENSUS_SEED_BASE, forensicsMaxSeed],
    reservedBand: RESERVED_BAND, consumedBlocks: CONSUMED_BLOCKS,
    wPriceS: W_PRICE_S, wMaxTicks: W_MAX_TICKS, doseFractions: DOSE_FRACTIONS, primaryDoseFraction: PRIMARY_DOSE_FRAC,
    valScale: round(VAL_SCALE), doses: DOSES.map((x) => round(x)),
    primaryDose: round(PRIMARY_DOSE), topDose: round(TOP_DOSE),
    forkSpacingS: FORK_SPACING_S, forkCapPerMatch: FORK_CAP,
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
    clusterUnit: 'match seed (#20); each mediator statistic = mean over forks',
    restThird: REST_THIRD, boxInnerLocalX: BOX_INNER_X, boxDepth: BOX_DEPTH, boxWidth: BOX_WIDTH, nStep: N_STEP,
    contexts: CONTEXTS,
  },
  result: experiment,
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xForkIdent: { pass: xForkIdent, checked: experiment.xForkIdent.checked, mismatched: experiment.xForkIdent.mismatched, note: 'branch A == an independent plain step-through on EVERY fork (zero leakage)' },
    xMergeIdent: { ...mergeIdent, note: 'the injected P3p-1 merged table identity (battery X-MERGE-SHA), inherited HARD gate' },
    eNonStation: { ...eNonStation, note: 'the eye ACTIVATES on the R3p world AND never overrides the ball carrier (actionExecutor guard), inherited HARD gate' },
    xFpProd: { pass: xFpProd, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, matches: xFpProd, skipped: SKIP_FP, note: 'src carries only the dormant grant seam (unchanged from the census commit) ⇒ git diff src NON-empty BY DESIGN; Road B = X-FP-PROD + the flag-off dormancy test' },
    srcDiffStat: srcDiff, srcDiffExpectedNonEmpty: true,
    xCountIdent: { note: 'see result.xCountIdent — identity BY CONSTRUCTION (byte-identical deep block + reused fork machinery) + X-DET + X-FORK-IDENT; the census stores no per-fork counts so a direct diff is impossible (stated honestly).' },
    seedDisjoint: { pass: seedDisjoint, reservedBand: RESERVED_BAND, forensicsRange: [CENSUS_SEED_BASE, forensicsMaxSeed], consumedBlocks: CONSUMED_BLOCKS, note: 'the 800 forensic seeds are a SUBSET of the census 12.00M block (same-seed reuse IS the design, #140.3); still inside the reservation and disjoint from the P1/P1b/smoke blocks' },
    xCorpusIdent: 'N/A (a re-read of an existing corpus; no fresh identity target)',
  },
  gates,
  perMatchWallMs: round(wallMs, 2),
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
const output = { ...body, sha256 };
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const h = experiment.hypothesisTable;
const m1 = h.H1_outletTax.predictions.map((p) => p.match).join(',');
const m2 = h.H2_unusedOutlet.predictions.map((p) => p.match).join(',');
const m4 = h.H4_surrogateArtifact.predictions.map((p) => p.match).join(',');
console.error(
  `A4-P1c FORENSICS · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · ${MATCH_COUNT}m · forks ${experiment.populations.totalForks}`
  + ` · Δturn(1.0) ${experiment.mediators.turnovers.deltaDose1MinusA.point} [${experiment.mediators.turnovers.deltaDose1MinusA.lower},${experiment.mediators.turnovers.deltaDose1MinusA.upper}]`
  + ` · Δbox ${experiment.mediators.boxEntries.deltaDose1MinusA.point} · Δrecv ${experiment.mediators.grantedReceives.deltaDose1MinusA.point}`
  + ` · H1[${m1}] H2[${m2}] H4[${m4}]`
  + ` · xDet ${xDet} · xFork ${xForkIdent} · xMerge ${mergeIdent.pass} · eNonSt ${eNonStation.pass} · xFp ${xFpProd} · disj ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
);
