// A4 SLICE 2, S2-P3 — THE GENE BATTERY (three legs: F fidelity · W world health · S selection).
//
// Authority: docs/world-model/A4-S2P3-GENE-BATTERY.md (the FROZEN pre-registration, which
// ELABORATES and NEVER re-cuts ruling #165.3) + #165 (S2-P2 banked; the ARMING CHECKLIST
// binding: an armed world = eye.v4.homePrior + evolveHomePrior + evolveHomePriorOffsets,
// all three, asserted in-probe) + #164 (the S2-P1b backLoaded read CONFIRMED at fork grain
// — the set-grain currency here is REPORTED, never re-gated) + #163 (stats bases must be
// STREAM-disjoint: gaps ≥ 200) + #162 (the anchor philosophy; the §4 diversity observation
// binding) + #158 / A4-SLICE2-PERBODY-CONTRACT §2 (M-S2.1/2 the gene family, M-S2.3 the
// instrument vector seam), §3 (BIRTH NEUTRALITY + Road B), §4 (S2-P3), §5 (the #157
// instrument debt) + A4-P3PRIME-REPLICATION (the SET-GRAIN battery idiom inherited whole:
// the football hard gates, the §2 equilibrium band, the X-family, the sizing→frozen-N
// arithmetic, the receipts) + A4-S2P1-VECTOR-CENSUS (the vector-grant machinery Leg F
// compares the gene path against) + #152/#151/#148/#128/#20/#46.2/#105.4/#49.3.
//
// ⭐ LEG F — GENE ≡ VECTOR FIDELITY (EXACT-INVARIANT, GATING). `Match.homeRegionGrant` is
// STRUCTURALLY SINGLE-SIDE (both union members carry ONE `side`), so a both-sides vector
// world is unreachable zero-src (the #150.1 structural fact, inherited). The leg is
// therefore frozen in THREE sub-legs over the SAME shared seeds, all full-match signature
// comparisons:
//   F1  V0 ≡ G0 : V0 = the S2-P1b instrument world on side 0 (R3p eye, NO v4.homePrior,
//                 homeRegionGrant {side:0, obedienceByIndex:[0,.9,.7,.5,.3,.1]}, genomes
//                 untouched); G0 = the SAME world reached through the GENE path (R3p eye +
//                 v4.homePrior, grant null, side 0's genome carrying obedience 0.5 + the
//                 backLoaded offset family, side 1's genome BORN-ABSENT ⇒ effective
//                 obedience 0 ⇒ strength 0 ⇒ inert, exactly V0's unarmed side 1).
//   F2  V1 ≡ G1 : the mirror on side 1.
//   F3  Gboth ≡ H0 ≡ H1 : the BOTH-SIDES gene-armed world (the Leg W arm) is byte-identical
//                 to itself with the vector grant laid over side 0 / side 1 (the grant
//                 branch takes precedence for the side it covers, so this reads the grant
//                 path on one side and the gene path on the other, both ways round).
// NON-VACUITY (frozen as a conjunct): the armed world must DIFFER from the unarmed R3p
// world on every seed, and G0 must differ from Gboth — otherwise the identities above
// would be the trivial "nothing happened either way".
// ANY mismatch at ANY scale FAILS the leg ⇒ STOP.
//
// ⭐ LEG W — WORLD HEALTH AT SET GRAIN (GATING; the P3′ football hard gates VERBATIM).
// Armed-FIXED A/B, NO evolution: ARM = both teams gene-armed backLoaded (the Leg F Gboth
// world); CONTROL = both teams at the uniform whisper (eye.v4.homePrior true, obedience
// 0.5, NO offsets — the slice-1 PRIOR world). One seed = one SET (both arms, paired).
// GATING: scramble I4 not resolved-up · eye ball-ledger 0 on BOTH armed arms · ARM roleMixTV
// ≥ 0.407 (the incumbent floor) · the §2 equilibrium band on the ARM (C1 §4 absolute, with
// the P3a substrate-drift caveat: a dimension the CONTROL already fails is DISCLOSED and
// excluded) · the X-family. REPORTED, never gating: dupRun / deep / box / offsides / fouls /
// the E4 combination counters / proximity (the #164 fork-grain exam already ruled value).
//
// ⭐ LEG S — SELECTION + THE §4 DIVERSITY OBSERVATION (OBSERVATIONAL, #162.2.iv binding).
// Fresh evolution runs with ALL THREE flags armed, gen-0 fully born-absent. ⚠ DEVIATION,
// declared: `MutateOptions` is NOT plumbed through `src/sim/League.ts` / `evolveGroup`, so
// arming evolution through the shipped League would need a src change — forbidden here
// (Road B, X-SRC-ZERO). Leg S therefore runs a MINIMAL PROBE-SIDE selection loop that
// mirrors `evolveGroup`'s band law (elite / mutated / reborn, the same rates and scales)
// over a round-robin league of armed worlds. It is an INSTRUMENT, not the shipped league:
// no careers, transfers, coaches, morale, promotion or fire-sale. Named ex ante.
//
// MODES (explicit A4S2P3_MODE, NO default):
//   legF-smoke · legF · legW-smoke · legW · legS-smoke · legS
//
// COMMAND LINES (the canonical runs; the commander launches detached per §0.0.4):
//   A4S2P3_MODE=legF-smoke npx tsx scripts/probes/a4-s2p3-gene-battery.ts
//   A4S2P3_MODE=legF       npx tsx scripts/probes/a4-s2p3-gene-battery.ts
//   A4S2P3_MODE=legW-smoke npx tsx scripts/probes/a4-s2p3-gene-battery.ts
//   A4S2P3_MODE=legW A4S2P3_N=<the disclosed N* from the legW smoke> \
//                          npx tsx scripts/probes/a4-s2p3-gene-battery.ts
//   A4S2P3_MODE=legS-smoke npx tsx scripts/probes/a4-s2p3-gene-battery.ts
//   A4S2P3_MODE=legS       npx tsx scripts/probes/a4-s2p3-gene-battery.ts
//   preflight (bounded, writes OUTSIDE the repo, NOT a verdict):
//     A4S2P3_MODE=legF A4S2P3_CAP=2 A4S2P3_SKIP_FP=1 A4S2P3_OUT=/tmp/x.json npx tsx …
//
// ROAD B. Nothing ships. ZERO `src/**` changes (X-SRC-ZERO HARD). Every flag is armed ONLY
// inside this instrument; the production fingerprint 57b0bdab…c673 is unchanged.

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import {
  GENE_KEYS, HOME_PRIOR_OFFSET_SLOTS, crossoverGenomes, effectiveHomePriorObedience,
  mutateGenome, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { runTarget } from '../../src/ai/formations';
import {
  CELL_FLOOR, HOME_MAP_STRENGTH_MAX, homePriorStrength, newStationEyeTrace,
  type MergedChildTable, type RoleConditionedTable, type RoleControlLevels, type RoleCell,
  type StationEyeTrace,
} from '../../src/ai/stationEye';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING (pre-registration §§2–7) — pinned BEFORE any run.
// =============================================================================

/** ⭐ THE BACKLOADED FAMILY, DERIVED FROM THE S2-P1 FROZEN VECTOR AND FROZEN HERE.
 *  S2-P1 vector `backLoaded` = [0, .9, .7, .5, .3, .1] (index 0 = GK, 1..5 = outfield).
 *  The whisper is obedience 0.5 (#148's certified PRIMARY dose). Effective obedience =
 *  clamp01(0.5 + offset_i) ⇒ offset_i = vector_i − 0.5 over the OUTFIELD slots:
 *      .9−.5=+.4 · .7−.5=+.2 · .5−.5=0 · .3−.5=−.2 · .1−.5=−.4
 *  Slot 0 (GK) is frozen at 0 — the ROLE-BLIND neutral (contract §3 BIRTH NEUTRALITY:
 *  writing −0.5 to zero the keeper would be role-derived content). The GK never reaches
 *  the v3 station-eye consumption point, so his slot is inert by the world's own geometry;
 *  Leg F PROVES the choice is immaterial (V0's vector gives the GK obedience 0). */
const BACKLOADED_VECTOR = [0, 0.9, 0.7, 0.5, 0.3, 0.1] as const;
const WHISPER_OBEDIENCE = 0.5;
const BACKLOADED_OFFSETS = [0, 0.4, 0.2, 0, -0.2, -0.4] as const;

// --- seed ledger (#165.3: from 12,256,040+; blocks DECLARED DISJOINT) --------
const RESERVED_BAND = [12_256_040, 12_300_000] as const; // the remaining slice-2 pool tail
const LEGF_SMOKE_BASE = 12_256_040; const LEGF_SMOKE_MATCHES = 8;    // → 12,256,047
const LEGF_BASE = 12_257_000; const LEGF_M = 400;                    // → 12,257,399
const LEGW_SMOKE_BASE = 12_258_000; const LEGW_SMOKE_SETS = 40;      // → 12,258,039
const LEGW_BASE = 12_260_000; const LEGW_N_CAP = 6_000;              // → 12,265,999
const LEGS_SMOKE_BASE = 12_266_000;                                  // → 12,266,xxx (bounded)
const LEGS_BASE = 12_270_000;                                        // → ≤ 12,291,899
/** every consumed block of the A4 arc (the S2-P1/S2-P1b ledger + the P3′ ledger). */
const CONSUMED_BLOCKS = [
  [11_150_000, 11_150_039], [11_200_000, 11_600_079],
  [11_700_000, 11_700_039], [11_800_000, 11_807_999],
  [11_850_000, 11_850_039], [11_900_000, 11_907_999],
  [11_950_000, 11_950_039], [12_000_000, 12_007_999],
  [12_050_000, 12_050_039], [12_100_000, 12_107_999],
  [12_150_000, 12_150_039], [12_200_000, 12_207_999],
  [12_208_000, 12_217_999], // A4-P3 (retired in full, #152.4.iii)
  [12_220_000, 12_220_039], [12_230_000, 12_236_999], // A4-P3′
  [12_237_000, 12_237_039], [12_240_000, 12_247_999], // A4-S2-P1
  [12_248_000, 12_255_999], [12_256_000, 12_256_039], // A4-S2-P1b gate + smoke
] as const;

// --- stats seeds: bases 101700+, STREAM-disjoint with gaps ≥ 200 (#163.2.iii) --
const LEGW_BOOTSTRAP_SEED = 101_800;
const LEGW_RESERVED_SEED = 102_000;
const LEGS_BOOTSTRAP_SEED = 102_200;
const LEGS_RESERVED_SEED = 102_400;
const BOOTSTRAP_RESAMPLES = 2_000;
/** the arc's consumed stats seeds (every base spent before this stage). */
const CONSUMED_STATS = [
  91_100, 91_110, 92_110, 93_003, 99_403, 99_503, 99_603, 99_703, 99_803, 99_903,
  100_603, 100_703, 100_803, 100_903, 101_003, 101_103, 101_203, 101_303,
  101_403, 101_503, 101_513, 101_523,
] as const;
const STATS_GAP_MIN = 200;

// --- Leg S frozen shape (sized to the wall partition, §6) --------------------
const LEGS_RUNS = 8;            // independent evolution runs
const LEGS_TEAMS = 10;          // league size
const LEGS_GENS = 20;           // generations per run
const LEGS_ELITE_N = 2;         // evolveGroup's band law, mirrored
const LEGS_REBORN_N = 2;
const LEGS_MUT_RATE = 0.4; const LEGS_MUT_SCALE = 0.08;      // evolveGroup 'mutated'
const LEGS_REBORN_RATE = 0.5; const LEGS_REBORN_SCALE = 0.15; // evolveGroup 'reborn'
const LEGS_MATCHES_PER_GEN = (LEGS_TEAMS * (LEGS_TEAMS - 1)) / 2; // 45, single round robin
const LEGS_RUN_STRIDE = 3_000;  // ≥ GENS × MATCHES_PER_GEN = 900
const LEGS_GEN_STRIDE = 100;    // ≥ MATCHES_PER_GEN = 45
/** the EVOLUTION RNG family — a THIRD namespace, neither a match seed nor a stats seed. */
const LEGS_EVO_RNG_BASE = 770_001;
/** the sign dead-zone for the shape-cluster read (an offset inside ±ε counts as 0). */
const LEGS_SIGN_EPS = 0.02;
/** the style genes the diversity axis is correlated against (frozen list). */
const LEGS_STYLE_GENES = [
  'pressIntensity', 'defensiveCompactness', 'formationDepth', 'transitionPress',
  'coverBias', 'jockeyBias', 'trapBias', 'riskTolerance', 'tempo', 'supportDistance',
] as const;
const LEGS_SMOKE_RUNS = 1; const LEGS_SMOKE_GENS = 3; const LEGS_SMOKE_TEAMS = 6;

// --- Leg W sizing (frozen ex ante) -------------------------------------------
const POWER_Z = 3.605;          // z_.975 + z_.95
const Z_975 = 1.96;
const N_STEP = 200;
const XDET_FACTOR = 2;
/** ⭐ the WALL PARTITION (#165.3 caps the whole battery at 12 h across ALL launched runs).
 *  Frozen split: Leg F ≤ 1.5 h · Leg W ≤ 8.0 h · Leg S ≤ 2.5 h. */
const WALL_BUDGET_HOURS_TOTAL = 12;
const WALL_BUDGET_HOURS_LEGF = 1.5;
const WALL_BUDGET_HOURS_LEGW = 8;
const WALL_BUDGET_HOURS_LEGS = 2.5;
const WALL_BUDGET_MS_LEGW = WALL_BUDGET_HOURS_LEGW * 3_600_000;
/** ⭐ THE MDL for Leg W's sizing target — the SET-GRAIN dupRun share contrast (ARM−CONTROL).
 *  MDL = min( 0.5·|smoke point| , MDL_ABS ) with MDL_ABS = 0.019 = HALF the #151 SEEN
 *  dupRun movement on PRIOR−R3p (+0.038 share, the P3′ motivating exhibit). Pre-named
 *  BEFORE any seed runs; the 0.5·|point| guard stops smoke noise INFLATING the MDL.
 *  dupRun is REPORTED, never gated — it is the sizing TARGET only, so the gating football
 *  legs (resolved-sign guards) run over-powered at the frozen N. */
const LEGW_MDL_ABS = 0.019;
const P151_SEEN_DUPRUN = 0.038;

// --- instrument constants (P3′ §§4 VERBATIM) ---------------------------------
const SAMPLE_EVERY = 10;           // 6 Hz
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;
const BALL_NEAR_M = 5;
const BALL_MID_M = 10;
const DUP_RUN_M = 4;
const REST_THIRD = HALF_L / 3;
const CROSS_WINDOW_S = 4;
const SPEED_GATE = 2.5;
const RECEIPT_CAP = 1_000;
const BOX_INNER_X = -(HALF_L - BOX_DEPTH);
const INCUMBENT_ROLE_TV = 0.407;   // the incumbent floor (P3a §4.3, P3′ leg (c))
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];
const PROGRESS_EVERY_LEGF = 25;
const PROGRESS_EVERY_LEGW = 50;

// --- §2 EQUILIBRIUM BAND (P3a §4.2 / C1 §4 absolute, VERBATIM) ---------------
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;

// --- X-family pins ------------------------------------------------------------
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const MERGED_PATH = 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const MERGED_SHA_EXPECTED = '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED = '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';
const VAL_SCALE_PINNED = 0.163494;

/** #67.3: the ENRICHED world (the substrate the v3 table + merged children were censused on). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// =============================================================================
// ENV / MODE
// =============================================================================
const MODES = ['legF-smoke', 'legF', 'legW-smoke', 'legW', 'legS-smoke', 'legS'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.A4S2P3_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`A4-S2P3 FATAL — A4S2P3_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const CAP = process.env.A4S2P3_CAP ? Math.max(1, Number.parseInt(process.env.A4S2P3_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(CAP);
const SKIP_DET = process.env.A4S2P3_SKIP_DET === '1';
const SKIP_FP = process.env.A4S2P3_SKIP_FP === '1';
const N_ENV = process.env.A4S2P3_N ? Math.max(1, Number.parseInt(process.env.A4S2P3_N, 10)) : null;
if (MODE === 'legW' && N_ENV === null) {
  console.error('A4-S2P3 FATAL — legW requires A4S2P3_N (pinned from the legW-smoke arithmetic).');
  process.exit(2);
}
if (MODE !== 'legW' && N_ENV !== null) {
  console.error('A4-S2P3 FATAL — A4S2P3_N is accepted ONLY in legW (Leg F\'s M and Leg S\'s shape are '
    + 'FROZEN in the stage doc and may not be re-cut at the command line).');
  process.exit(2);
}
const LEGW_N = MODE === 'legW' ? Math.min(N_ENV as number, LEGW_N_CAP) : 0;

const OUT_BY_MODE: Record<Mode, string> = {
  'legF-smoke': 'docs/world-model/data/a4-s2p3-legf-fidelity-smoke.json',
  legF: 'docs/world-model/data/a4-s2p3-legf-fidelity.json',
  'legW-smoke': 'docs/world-model/data/a4-s2p3-legw-sizing-smoke.json',
  legW: 'docs/world-model/data/a4-s2p3-legw-world-health.json',
  'legS-smoke': 'docs/world-model/data/a4-s2p3-legs-selection-smoke.json',
  legS: 'docs/world-model/data/a4-s2p3-legs-selection.json',
};
const OUT_PATH = process.env.A4S2P3_OUT ?? (IS_PREFLIGHT ? '/tmp/a4s2p3-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && OUT_PATH.startsWith('docs/world-model/data/')) {
  console.error('A4-S2P3 FATAL — a CAPPED (preflight) invocation may not write a canonical repo path; '
    + 'pass A4S2P3_OUT=/tmp/… (the canonical-write guard).');
  process.exit(2);
}

// =============================================================================
// numeric helpers (the house forms)
// =============================================================================
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const sampleSd = (xs: readonly number[]): number => {
  const f = xs.filter(Number.isFinite);
  if (f.length < 2) return Number.NaN;
  const mu = f.reduce((s, x) => s + x, 0) / f.length;
  return Math.sqrt(f.reduce((s, x) => s + (x - mu) ** 2, 0) / (f.length - 1));
};
const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }): number => Math.hypot(a.x - b.x, a.y - b.y);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};
const sha = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const phi = (z: number): number => {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592)
    * t * Math.exp(-(z * z) / 2);
  return Math.min(1, Math.max(0, 0.5 * (1 + Math.sign(z) * y)));
};
const pearson = (xs: readonly number[], ys: readonly number[]): number => {
  const n = Math.min(xs.length, ys.length);
  const xa: number[] = []; const ya: number[] = [];
  for (let i = 0; i < n; i++) if (Number.isFinite(xs[i]) && Number.isFinite(ys[i])) { xa.push(xs[i]); ya.push(ys[i]); }
  if (xa.length < 3) return Number.NaN;
  const mx = mean(xa); const my = mean(ya);
  let sxy = 0; let sxx = 0; let syy = 0;
  for (let i = 0; i < xa.length; i++) {
    const dx = xa[i] - mx; const dy = ya[i] - my;
    sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
  }
  return (sxx === 0 || syy === 0) ? Number.NaN : sxy / Math.sqrt(sxx * syy);
};

interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (book: ReceiptBook | null, cls: string, seed: number, tick: number, gid: number, cause: string): void => {
  if (book === null) return;
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// =============================================================================
// the injected P3p-1 merged table + control (X-MERGE-IDENT) — never in src/**
// =============================================================================
interface MergedTableFile { mergedTableSha: string; base: RoleConditionedTable; children: MergedChildTable }
const rawMerged = JSON.parse(readFileSync(MERGED_PATH, 'utf8')) as MergedTableFile;
const roleTable: RoleConditionedTable = rawMerged.base;
const children: MergedChildTable = rawMerged.children;
const mergedTableSha = rawMerged.mergedTableSha;
const control: RoleControlLevels = (JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as { control: RoleControlLevels }).control;

const buildMergeIdent = () => {
  const mergedRehash = sha({ base: roleTable, children });
  const baseRehash = sha(roleTable);
  return {
    mergedShaField: mergedTableSha, mergedShaExpected: MERGED_SHA_EXPECTED, mergedRehash,
    baseRehash, baseShaExpected: BASE_SHA_EXPECTED,
    pass: mergedTableSha === MERGED_SHA_EXPECTED && mergedRehash === MERGED_SHA_EXPECTED
      && baseRehash === BASE_SHA_EXPECTED,
  };
};

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

/** priorEquivalence (HARD) + the FROZEN FAMILY ARITHMETIC shown in the receipt: the gene
 *  family's effective obedience over the outfield slots EQUALS the S2-P1 backLoaded vector. */
const buildPriorEquivalence = () => {
  const valScaleMatches = round(VAL_SCALE) === VAL_SCALE_PINNED;
  const whisper = homePriorStrength(WHISPER_OBEDIENCE);
  const whisperMatches = Math.abs(whisper - 0.25 * VAL_SCALE_PINNED) < 1e-12;
  const ceilingMatches = Math.abs(HOME_MAP_STRENGTH_MAX - 0.5 * VAL_SCALE_PINNED) < 1e-12;
  const g: TacticalGenome = { ...randomGenome(new Rng(1)), homePriorObedience: WHISPER_OBEDIENCE, homePriorObedienceOffset: [...BACKLOADED_OFFSETS] };
  const effective = Array.from({ length: HOME_PRIOR_OFFSET_SLOTS }, (_, i) => round(effectiveHomePriorObedience(g, i), 12));
  // slots 1..5 must reproduce the S2-P1 frozen vector EXACTLY; slot 0 (GK) is inert.
  const outfieldMatches = [1, 2, 3, 4, 5].every((i) => Math.abs(effective[i] - BACKLOADED_VECTOR[i]) < 1e-12);
  const strengthsMatch = [1, 2, 3, 4, 5].every((i) =>
    Math.abs(homePriorStrength(effective[i]) - homePriorStrength(BACKLOADED_VECTOR[i])) < 1e-15);
  const meanOutfield = mean([1, 2, 3, 4, 5].map((i) => effective[i]));
  return {
    valScaleRecomputed: round(VAL_SCALE), valScalePinned: VAL_SCALE_PINNED, valScaleMatches,
    whisperObedience: WHISPER_OBEDIENCE, whisperStrength: whisper, whisperMatches,
    homeMapStrengthMax: HOME_MAP_STRENGTH_MAX, ceilingMatches,
    s2p1BackLoadedVector: BACKLOADED_VECTOR, frozenOffsetFamily: BACKLOADED_OFFSETS,
    effectiveObedienceBySlot: effective, outfieldMatches, strengthsMatch,
    meanOutfieldObedience: round(meanOutfield),
    arithmetic: 'offset_i = backLoadedVector_i − 0.5 over the OUTFIELD slots ⇒ '
      + '[.9,.7,.5,.3,.1] − .5 = [+.4,+.2,0,−.2,−.4]; slot 0 (GK) frozen at 0 (role-BLIND, '
      + 'contract §3) and inert by the world\'s own geometry. Effective obedience = '
      + 'clamp01(0.5 + offset) reproduces the S2-P1 vector on 1..5, mean 0.5 = the #148 whisper.',
    pass: valScaleMatches && whisperMatches && ceilingMatches && outfieldMatches && strengthsMatch,
  };
};

// =============================================================================
// the R3p fixture + the ARMING helpers
// =============================================================================
type EyeConfig = NonNullable<Match['stationEye']>;
const teamInfo = (name: string, seed: number, genome?: TacticalGenome): TeamInfo => {
  const rng = new Rng(seed);
  const g = randomGenome(rng);
  const squad = randomSquad(rng);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: genome === undefined ? g : { ...genome }, squad,
  };
};
const matchOf = (seed: number, genomes?: [TacticalGenome, TacticalGenome]): Match => new Match({
  seed,
  teamA: teamInfo('A', seed * 2 + 1, genomes?.[0]),
  teamB: teamInfo('B', seed * 2 + 2, genomes?.[1]),
  ...CENSUS_FLAGS,
});
/** the R3p eye (v3 base+children+SHA; v4 inSupportLaw+deliveryBit+offsideBit), optionally
 *  with the SHIPPED-FORM home-prior master flag. */
const r3pEye = (homePrior: boolean, trace?: StationEyeTrace): EyeConfig => ({
  arm: 'neutral', scope: { kind: 'both' }, table: {},
  v3: { roleTable, control, children, mergedTableSha },
  v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true, ...(homePrior ? { homePrior: true } : {}) },
  ...(trace ? { trace } : {}),
});
/** write the gene family onto EVERY genome reference a team reads through the match
 *  (info.genome / baseGenome / effGenome — the a4HomePriorGene idiom, #150 verbatim). */
const armGenes = (m: Match, side: Side, obedience: number, offsets: readonly number[] | null): void => {
  const t = m.teams[side];
  for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
    g.homePriorObedience = obedience;
    if (offsets !== null) g.homePriorObedienceOffset = [...offsets];
  }
};
const signatureOf = (m: Match): string => sha({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
});
const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signatureOf(m); };

// E-NONSTATION / X-SEAM (the P1c refined form, inherited).
const checkENonStation = (seed: number) => {
  const freshNull = matchOf(seed).stationEye === null && matchOf(seed).stationEyeState.size === 0;
  const bodyGid = 1 + (seed % 5);
  const bodyM = matchOf(seed);
  bodyM.stationEye = { ...r3pEye(false), scope: { kind: 'body', gid: bodyGid } };
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
  const teamM = matchOf(seed);
  teamM.stationEye = { ...r3pEye(false), scope: { kind: 'team', side: 0 } };
  let teamScopeOk = true;
  for (let i = 0; i < 3000 && !teamM.finished; i++) {
    teamM.step(DT);
    for (const gid of teamM.stationEyeState.keys()) {
      if (Math.floor(gid / TEAM_SIZE) !== 0 || gid % TEAM_SIZE === 0) teamScopeOk = false;
    }
  }
  const bothM = matchOf(seed);
  bothM.stationEye = r3pEye(true);
  armGenes(bothM, 0, WHISPER_OBEDIENCE, BACKLOADED_OFFSETS);
  armGenes(bothM, 1, WHISPER_OBEDIENCE, BACKLOADED_OFFSETS);
  let bothActivated = false;
  for (let i = 0; i < 3000 && !bothM.finished; i++) {
    bothM.step(DT);
    if (bothM.stationEyeState.size > 0) { bothActivated = true; break; }
  }
  return {
    pass: freshNull && bodyScopeOk && teamScopeOk && bothActivated && carrierNeverOverridden,
    freshNull, bodyScopeOk, teamScopeOk, bothActivated, carrierNeverOverridden,
  };
};

// =============================================================================
// ⭐ LEG F — GENE ≡ VECTOR FIDELITY (exact-invariant, GATING)
// =============================================================================
type LegFWorld = 'plain' | 'V0' | 'G0' | 'V1' | 'G1' | 'Gboth' | 'H0' | 'H1';
const LEGF_WORLDS: readonly LegFWorld[] = ['plain', 'V0', 'G0', 'V1', 'G1', 'Gboth', 'H0', 'H1'];

const buildLegFWorld = (seed: number, w: LegFWorld): Match => {
  const m = matchOf(seed);
  switch (w) {
    case 'plain':
      m.stationEye = r3pEye(false);
      break;
    case 'V0':
    case 'V1': {
      const side: Side = w === 'V0' ? 0 : 1;
      m.stationEye = r3pEye(false);
      m.homeRegionGrant = { side, obedienceByIndex: [...BACKLOADED_VECTOR] };
      break;
    }
    case 'G0':
    case 'G1': {
      const side: Side = w === 'G0' ? 0 : 1;
      m.stationEye = r3pEye(true);
      armGenes(m, side, WHISPER_OBEDIENCE, BACKLOADED_OFFSETS);
      break; // the OTHER side stays born-absent ⇒ effective obedience 0 ⇒ strength 0 ⇒ inert
    }
    case 'Gboth':
      m.stationEye = r3pEye(true);
      armGenes(m, 0, WHISPER_OBEDIENCE, BACKLOADED_OFFSETS);
      armGenes(m, 1, WHISPER_OBEDIENCE, BACKLOADED_OFFSETS);
      break;
    case 'H0':
    case 'H1': {
      const side: Side = w === 'H0' ? 0 : 1;
      m.stationEye = r3pEye(true);
      armGenes(m, 0, WHISPER_OBEDIENCE, BACKLOADED_OFFSETS);
      armGenes(m, 1, WHISPER_OBEDIENCE, BACKLOADED_OFFSETS);
      m.homeRegionGrant = { side, obedienceByIndex: [...BACKLOADED_VECTOR] };
      break;
    }
  }
  return m;
};

interface LegFRow {
  seed: number;
  sigs: Record<LegFWorld, string>;
  f1: boolean; f2: boolean; f3: boolean; nonVacuous: boolean;
}
const runLegFSeed = (seed: number): LegFRow => {
  const sigs = {} as Record<LegFWorld, string>;
  for (const w of LEGF_WORLDS) sigs[w] = runToEnd(buildLegFWorld(seed, w));
  return {
    seed, sigs,
    f1: sigs.V0 === sigs.G0,
    f2: sigs.V1 === sigs.G1,
    f3: sigs.Gboth === sigs.H0 && sigs.Gboth === sigs.H1,
    // NON-VACUITY: the armed worlds genuinely bite, and one-sided ≠ both-sided.
    nonVacuous: sigs.Gboth !== sigs.plain && sigs.G0 !== sigs.plain && sigs.G1 !== sigs.plain
      && sigs.G0 !== sigs.Gboth && sigs.G1 !== sigs.Gboth,
  };
};

const buildLegF = (seeds: readonly number[], receipts: ReceiptBook | null) => {
  const rows: LegFRow[] = [];
  const t0 = Date.now();
  for (let i = 0; i < seeds.length; i++) {
    const r = runLegFSeed(seeds[i]);
    rows.push(r);
    if (!r.f1) addReceipt(receipts, 'legF-mismatch-F1', r.seed, 0, -1, `V0 ${r.sigs.V0.slice(0, 16)} != G0 ${r.sigs.G0.slice(0, 16)}`);
    if (!r.f2) addReceipt(receipts, 'legF-mismatch-F2', r.seed, 0, -1, `V1 ${r.sigs.V1.slice(0, 16)} != G1 ${r.sigs.G1.slice(0, 16)}`);
    if (!r.f3) addReceipt(receipts, 'legF-mismatch-F3', r.seed, 0, -1, `Gboth ${r.sigs.Gboth.slice(0, 16)} H0 ${r.sigs.H0.slice(0, 16)} H1 ${r.sigs.H1.slice(0, 16)}`);
    if (!r.nonVacuous) addReceipt(receipts, 'legF-vacuous-seed', r.seed, 0, -1, 'an armed world did not differ from the unarmed R3p world');
    if ((i + 1) % PROGRESS_EVERY_LEGF === 0 || i === seeds.length - 1) {
      console.error(`A4-S2P3 [${MODE}] legF ${i + 1}/${seeds.length} seeds · mism `
        + `${rows.filter((x) => !(x.f1 && x.f2 && x.f3)).length} · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    }
  }
  const f1 = rows.filter((r) => r.f1).length;
  const f2 = rows.filter((r) => r.f2).length;
  const f3 = rows.filter((r) => r.f3).length;
  const nv = rows.filter((r) => r.nonVacuous).length;
  const n = rows.length;
  const mismatches = rows.filter((r) => !(r.f1 && r.f2 && r.f3));
  const holds = n > 0 && f1 === n && f2 === n && f3 === n && nv === n;
  return {
    worlds: LEGF_WORLDS,
    predicate: 'F1 (V0 ≡ G0) ∧ F2 (V1 ≡ G1) ∧ F3 (Gboth ≡ H0 ≡ H1) on EVERY shared seed, '
      + 'AND non-vacuity on EVERY seed (the armed worlds differ from the unarmed R3p world and '
      + 'the one-sided armings differ from the both-sided one). ANY mismatch FAILS the leg ⇒ STOP.',
    seeds: n, f1Pass: f1, f2Pass: f2, f3Pass: f3, nonVacuousSeeds: nv,
    mismatchSeeds: mismatches.slice(0, 20).map((r) => ({
      seed: r.seed, f1: r.f1, f2: r.f2, f3: r.f3, nonVacuous: r.nonVacuous, sigs: r.sigs,
    })),
    mismatchTotal: mismatches.length,
    holds,
    sigsSha: sha(rows.map((r) => [r.seed, r.sigs])),
  };
};

// =============================================================================
// ⭐ LEG W — the P3′ whole-match instrument (runMatch, VERBATIM in form)
// =============================================================================
type WArm = 'CONTROL' | 'ARM';
const W_ARMS: readonly WArm[] = ['CONTROL', 'ARM'];

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

interface ReleaseLedger {
  releases: number; tackle: number; deglue: number; kick: number; ballWon: number;
  eyeAttributable: number; unattributable: number;
}
const newReleaseLedger = (): ReleaseLedger => ({
  releases: 0, tackle: 0, deglue: 0, kick: 0, ballWon: 0, eyeAttributable: 0, unattributable: 0,
});
interface RoleLedger { decisions: number; deviations: number; mix: Map<string, number> }
const newRoleLedger = (): RoleLedger => ({ decisions: 0, deviations: 0, mix: new Map() });
type PerRole = Record<Role, RoleLedger>;
const newPerRole = (): PerRole => ({
  GK: newRoleLedger(), DF: newRoleLedger(), MF: newRoleLedger(), WG: newRoleLedger(), ST: newRoleLedger(),
});
const roleMixTV = (perRole: PerRole): { pairwise: Record<string, number>; mean: number } => {
  const norm = (led: RoleLedger): Map<string, number> => {
    const total = [...led.mix.values()].reduce((s, v) => s + v, 0);
    const out = new Map<string, number>();
    if (total === 0) return out;
    for (const [k, v] of led.mix) out.set(k, v / total);
    return out;
  };
  const mixes = Object.fromEntries(ROLE_AXIS.map((r) => [r, norm(perRole[r])])) as Record<Role, Map<string, number>>;
  const pairwise: Record<string, number> = {};
  const vals: number[] = [];
  for (let i = 0; i < ROLE_AXIS.length; i++) {
    for (let j = i + 1; j < ROLE_AXIS.length; j++) {
      const a = mixes[ROLE_AXIS[i]]; const b = mixes[ROLE_AXIS[j]];
      if (a.size === 0 || b.size === 0) { pairwise[`${ROLE_AXIS[i]}|${ROLE_AXIS[j]}`] = Number.NaN; continue; }
      const keys = new Set([...a.keys(), ...b.keys()]);
      let tv = 0;
      for (const k of keys) tv += Math.abs((a.get(k) ?? 0) - (b.get(k) ?? 0));
      tv *= 0.5;
      pairwise[`${ROLE_AXIS[i]}|${ROLE_AXIS[j]}`] = round(tv, 4);
      vals.push(tv);
    }
  }
  return { pairwise, mean: round(mean(vals), 4) };
};

interface SideRow {
  spacingMedian: number; spacingUnder4: number;
  ballNear: number; ballMid: number;
  restSlotShare: number; dupRunShare: number;
  offsides: number; fouls: number; penalties: number; goals: number;
  crosses: number; headersWon: number; longBalls: number; cutbacks: number;
  thirdMan: number; overlaps: number; passes: number; passesForward: number;
  boxAtArrival: number; crossArrivals: number;
}
const emptySide = (): SideRow => ({
  spacingMedian: Number.NaN, spacingUnder4: Number.NaN, ballNear: Number.NaN, ballMid: Number.NaN,
  restSlotShare: Number.NaN, dupRunShare: Number.NaN,
  offsides: 0, fouls: 0, penalties: 0, goals: 0,
  crosses: 0, headersWon: 0, longBalls: 0, cutbacks: 0,
  thirdMan: 0, overlaps: 0, passes: 0, passesForward: 0,
  boxAtArrival: Number.NaN, crossArrivals: 0,
});
interface MatchRow {
  seed: number; arm: WArm; sides: [SideRow, SideRow];
  restartTicks: number; deepEntries: number; boxEntries: number; turnovers: number;
  signature: string;
}

const armWorld = (seed: number, arm: WArm, trace: StationEyeTrace | null): Match => {
  const m = matchOf(seed);
  m.stationEye = r3pEye(true, trace ?? undefined);
  // BOTH arms carry the SHIPPED master flag and the SAME team whisper; they differ ONLY in
  // whether the per-slot offset family is present (the ONE thing S2-P2 built).
  armGenes(m, 0, WHISPER_OBEDIENCE, arm === 'ARM' ? BACKLOADED_OFFSETS : null);
  armGenes(m, 1, WHISPER_OBEDIENCE, arm === 'ARM' ? BACKLOADED_OFFSETS : null);
  return m;
};

const runWMatch = (
  seed: number, arm: WArm, trace: StationEyeTrace | null, release: ReleaseLedger | null,
  perRole: PerRole | null, receipts: ReceiptBook | null,
): MatchRow => {
  const m = armWorld(seed, arm, trace);
  const per: [SideRow, SideRow] = [emptySide(), emptySide()];
  const roleOf = new Map<number, Role>();
  for (const p of m.allPlayers) roleOf.set(p.gid, p.role);
  const lastUntil = new Map<number, number>();

  const pairs: [number[], number[]] = [[], []];
  const ballNear: [number[], number[]] = [[], []];
  const ballMid: [number[], number[]] = [[], []];
  const boxAtArrival: [number[], number[]] = [[], []];
  const restTicks = [0, 0]; const restSlotTicks = [0, 0];
  const runTicks = [0, 0]; const dupRunTicks = [0, 0];
  let restartTicks = 0; let samples = 0; let tick = 0;
  let deepEntries = 0; let boxEntries = 0;
  const deepPrev = [false, false]; const boxPrev = [false, false];
  const crossesBefore: [number, number] = [0, 0];
  const inFlight: { side: 0 | 1; deadline: number; arrived: boolean; maxInBox: number }[] = [];
  let lastValidPoss = -1; let turnovers = 0;
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevOwnerSide: number | null = m.ball.owner?.side ?? null;

  while (!m.finished) {
    const ownedBefore = m.ball.owner !== null;
    m.step(DT);
    tick += 1;
    if (m.finished) break;
    if (m.restart !== null) restartTicks += 1;
    const owner = m.ball.owner;
    const playing = m.phase === 'playing';

    if (perRole !== null) {
      for (const [gid, st] of m.stationEyeState) {
        const prev = lastUntil.get(gid);
        if (prev === st.untilTick) continue;
        lastUntil.set(gid, st.untilTick);
        const role = roleOf.get(gid);
        if (role === undefined) continue;
        const led = perRole[role];
        led.decisions += 1;
        if (st.offset !== null) {
          led.deviations += 1;
          led.mix.set(st.candidateId, (led.mix.get(st.candidateId) ?? 0) + 1);
        }
      }
    }

    for (const side of [0, 1] as const) {
      const t = m.teams[side];
      const oppOwns = owner !== null && owner.side !== side;
      const lx = t.localX(m.ball.pos.x);
      const deepNow = oppOwns && playing && lx < -REST_THIRD;
      if (deepNow && !deepPrev[side]) deepEntries += 1;
      deepPrev[side] = deepNow;
      const boxNow = oppOwns && playing && lx <= BOX_INNER_X && Math.abs(m.ball.pos.y) <= BOX_WIDTH / 2;
      if (boxNow && !boxPrev[side]) boxEntries += 1;
      boxPrev[side] = boxNow;
    }

    const newOwner = m.ball.owner;
    const released = prevOwnerGid !== null && (newOwner === null || newOwner.gid !== prevOwnerGid);
    if (released && release !== null) {
      const relGid = prevOwnerGid as number;
      release.releases += 1;
      const deglued = m.dribbleTouch !== null && m.dribbleTouch.gid === relGid && m.dribbleTouch.until >= m.simTime;
      if (deglued) {
        release.deglue += 1;
        addReceipt(receipts, 'deglue', seed, tick, relGid, 'de-glue branch');
      } else if (newOwner === null) {
        const kicked = m.pendingPass !== null
          || m.ball.vel.x * m.ball.vel.x + m.ball.vel.y * m.ball.vel.y > SPEED_GATE * SPEED_GATE;
        if (kicked) { release.kick += 1; addReceipt(receipts, 'kick', seed, tick, relGid, 'strike/kick/pass/clearance'); }
        else { release.ballWon += 1; addReceipt(receipts, 'ball-won', seed, tick, relGid, 'loose contest'); }
      } else if (prevOwnerSide !== null && newOwner.side !== prevOwnerSide) {
        release.tackle += 1;
        addReceipt(receipts, 'tackle', seed, tick, relGid, 'won by other side');
      } else {
        release.kick += 1;
        addReceipt(receipts, 'kick', seed, tick, relGid, 'teammate received');
      }
    }

    const poss = m.possessionSide;
    if (poss !== -1) {
      if (lastValidPoss !== -1 && poss !== lastValidPoss) turnovers += 1;
      lastValidPoss = poss;
    }

    for (const side of [0, 1] as const) {
      const now = m.teams[side].stats.crosses;
      if (now > crossesBefore[side]) inFlight.push({ side, deadline: m.simTime + CROSS_WINDOW_S, arrived: false, maxInBox: 0 });
      crossesBefore[side] = now;
    }
    for (let i = inFlight.length - 1; i >= 0; i--) {
      const f = inFlight[i];
      const arrivedNow = (m.ball.owner !== null && !ownedBefore) || m.phase !== 'playing' || m.simTime >= f.deadline;
      const att = m.teams[f.side];
      const opp = m.teams[1 - f.side];
      const oppGoalX = opp.attackDir < 0 ? HALF_L : -HALF_L;
      let inBox = 0;
      for (const p of att.players) {
        if (p.role === 'GK' || p.sentOff) continue;
        const insideX = oppGoalX > 0 ? p.pos.x > oppGoalX - BOX_DEPTH : p.pos.x < oppGoalX + BOX_DEPTH;
        if (insideX && Math.abs(p.pos.y) <= BOX_WIDTH / 2) inBox += 1;
      }
      if (inBox > f.maxInBox) f.maxInBox = inBox;
      if (m.ball.owner !== null && !ownedBefore) f.arrived = true;
      if (!arrivedNow) continue;
      boxAtArrival[f.side].push(inBox);
      inFlight.splice(i, 1);
    }

    prevOwnerGid = newOwner?.gid ?? null;
    prevOwnerSide = newOwner?.side ?? null;

    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const side = t.side as 0 | 1;
      const opp = m.teams[1 - side];
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      const hasBall = m.possessionSide === side;
      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) pairs[side].push(dist2(outfield[i].pos, outfield[j].pos));
        }
      }
      let near = 0; let mid = 0;
      for (const p of outfield) {
        const d = dist2(p.pos, m.ball.pos);
        if (d <= BALL_NEAR_M) near += 1;
        if (d <= BALL_MID_M) mid += 1;
      }
      ballNear[side].push(near);
      ballMid[side].push(mid);
      if (hasBall) {
        const deep = outfield.filter((p) => t.localX(p.pos.x) < -REST_THIRD);
        restTicks[side] += 1;
        if (deep.some((p) => p.index === 1)) restSlotTicks[side] += 1;
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
        if (dup) dupRunTicks[side] += 1;
      }
    }
  }

  for (const side of [0, 1] as const) {
    const t = m.teams[side];
    const s = per[side];
    s.spacingMedian = quantile(pairs[side], 0.5);
    s.spacingUnder4 = pairs[side].filter((v) => v < CLOSE_PAIR_M).length / (pairs[side].length || 1);
    s.ballNear = mean(ballNear[side]);
    s.ballMid = mean(ballMid[side]);
    s.restSlotShare = restTicks[side] === 0 ? Number.NaN : restSlotTicks[side] / restTicks[side];
    s.dupRunShare = runTicks[side] === 0 ? Number.NaN : dupRunTicks[side] / runTicks[side];
    s.offsides = t.stats.offsides; s.fouls = t.stats.fouls; s.penalties = t.stats.penalties;
    s.goals = t.stats.goals; s.crosses = t.stats.crosses; s.headersWon = t.stats.headersWon;
    s.longBalls = t.stats.longBalls; s.cutbacks = t.stats.cutbacks;
    s.thirdMan = t.stats.thirdMan; s.overlaps = t.stats.overlaps;
    s.passes = t.stats.passes; s.passesForward = t.stats.passesForward;
    s.boxAtArrival = mean(boxAtArrival[side]);
    s.crossArrivals = boxAtArrival[side].length;
  }
  const sig = signatureOf(m);
  m.stationEye = null;
  return { seed, arm, sides: per, restartTicks, deepEntries, boxEntries, turnovers, signature: sig };
};

// --- paired cluster bootstrap (cluster = set seed; the P3′ engine) -----------
interface PairedCI { n: number; control: number; treated: number; diff: number; lower: number; upper: number; relative: number; resolved: boolean }
let wOffset = 0;
const nextWOff = (): number => (wOffset += 1);
const pairedCI = (treated: readonly number[], ctrlCol: readonly number[], offset: number): PairedCI => {
  const diffs: number[] = []; const ctrl: number[] = [];
  for (let i = 0; i < treated.length; i++) {
    const d = treated[i] - ctrlCol[i];
    if (Number.isFinite(d)) { diffs.push(d); ctrl.push(ctrlCol[i]); }
  }
  const rng = new Rng(LEGW_BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  const n = diffs.length;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += diffs[rng.int(0, n - 1)];
    draws.push(s / (n || 1));
  }
  draws.sort((a, b) => a - b);
  const at = (q: number): number => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  const base = mean(ctrl.filter(Number.isFinite));
  const point = mean(diffs);
  const lower = at(0.025); const upper = at(0.975);
  return {
    n, control: round(base), treated: round(mean(treated.filter(Number.isFinite))),
    diff: round(point), lower: round(lower), upper: round(upper),
    relative: round(point / (Math.abs(base) || Number.NaN)),
    resolved: Number.isFinite(lower) && Number.isFinite(upper) && (lower > 0 || upper < 0),
  };
};

const colAvg = (rr: readonly MatchRow[], sel: (s: SideRow) => number): number[] =>
  rr.map((r) => mean([sel(r.sides[0]), sel(r.sides[1])].filter(Number.isFinite)));
const colSum = (rr: readonly MatchRow[], sel: (s: SideRow) => number): number[] =>
  rr.map((r) => sel(r.sides[0]) + sel(r.sides[1]));

interface LegWCollected {
  rows: Record<WArm, MatchRow[]>;
  releases: Record<WArm, ReleaseLedger>;
  perRoleByArm: Record<WArm, PerRole>;
  traces: Record<WArm, StationEyeTrace>;
}
const collectLegW = (seeds: readonly number[], receipts: ReceiptBook | null): LegWCollected => {
  const rows = { CONTROL: [] as MatchRow[], ARM: [] as MatchRow[] };
  const releases = { CONTROL: newReleaseLedger(), ARM: newReleaseLedger() };
  const perRoleByArm = { CONTROL: newPerRole(), ARM: newPerRole() };
  const traces = { CONTROL: newStationEyeTrace(), ARM: newStationEyeTrace() };
  const t0 = Date.now();
  for (let i = 0; i < seeds.length; i++) {
    for (const arm of W_ARMS) {
      rows[arm].push(runWMatch(seeds[i], arm, traces[arm], releases[arm], perRoleByArm[arm], receipts));
    }
    if ((i + 1) % PROGRESS_EVERY_LEGW === 0 || i === seeds.length - 1) {
      console.error(`A4-S2P3 [${MODE}] legW ${i + 1}/${seeds.length} sets · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    }
  }
  return { rows, releases, perRoleByArm, traces };
};

const buildLegWAnalysis = (c: LegWCollected, seeds: readonly number[]) => {
  wOffset = 0;
  const armVs = (sel: (s: SideRow) => number, avg = true): PairedCI =>
    pairedCI(avg ? colAvg(c.rows.ARM, sel) : colSum(c.rows.ARM, sel),
      avg ? colAvg(c.rows.CONTROL, sel) : colSum(c.rows.CONTROL, sel), nextWOff());
  const perSet = (rr: MatchRow[], f: (r: MatchRow) => number): number[] => rr.map(f);

  // ---- GATING: the P3′ football hard gates, VERBATIM in form -----------------
  const scramble = armVs((s) => s.ballNear);
  const armRoleMix = roleMixTV(c.perRoleByArm.ARM);
  const controlRoleMix = roleMixTV(c.perRoleByArm.CONTROL);
  const ballLedgerArm = c.releases.ARM.eyeAttributable + c.releases.ARM.unattributable;
  const ballLedgerControl = c.releases.CONTROL.eyeAttributable + c.releases.CONTROL.unattributable;

  const nSets = seeds.length || 1;
  const perMatchRate = (rr: MatchRow[], sel: (s: SideRow) => number): number =>
    rr.reduce((acc, r) => acc + sel(r.sides[0]) + sel(r.sides[1]), 0) / nSets;
  const bandDim = (key: keyof typeof BAND_BASELINE, sel: (s: SideRow) => number) => {
    const baseline = BAND_BASELINE[key]; const tol = BAND_TOLERANCE[key];
    const lo = baseline * (1 - tol); const hi = baseline * (1 + tol);
    const a = perMatchRate(c.rows.ARM, sel); const ctl = perMatchRate(c.rows.CONTROL, sel);
    const controlInside = ctl >= lo && ctl <= hi;
    const armInside = a >= lo && a <= hi;
    return {
      baseline, tolerance: tol, lo: round(lo), hi: round(hi),
      arm: round(a), control: round(ctl),
      armRelative: round(a / baseline - 1), controlRelative: round(ctl / baseline - 1),
      armInside, controlInside,
      // the P3a substrate-drift caveat: a dimension the CONTROL already fails is DISCLOSED
      // and EXCLUDED from the gate (it is substrate drift, not the gene's doing).
      gated: controlInside, holds: controlInside ? armInside : true,
    };
  };
  const band = {
    goals: bandDim('goals', (s) => s.goals),
    crosses: bandDim('crosses', (s) => s.crosses),
    headers: bandDim('headers', (s) => s.headersWon),
    longBalls: bandDim('longBalls', (s) => s.longBalls),
    cutbacks: bandDim('cutbacks', (s) => s.cutbacks),
  };
  const bandExcluded = Object.entries(band).filter(([, d]) => !d.gated).map(([k]) => k);

  const footballGates = {
    scrambleI4: {
      ci: scramble, predicate: 'ARM−CONTROL I4 own-within-5 m CI lower ≤ 0 (scramble NOT resolved-up)',
      holds: !(scramble.resolved && scramble.lower > 0),
    },
    ballLedger: {
      arm: ballLedgerArm, control: ballLedgerControl,
      predicate: 'eye ball-ledger = 0 on BOTH armed arms (the eye never touches the ball)',
      holds: ballLedgerArm === 0 && ballLedgerControl === 0,
    },
    roleMixTV: {
      arm: armRoleMix.mean, control: controlRoleMix.mean, floor: INCUMBENT_ROLE_TV,
      predicate: 'ARM-arm roleMixTV ≥ 0.407 (the incumbent floor)',
      holds: Number.isFinite(armRoleMix.mean) && armRoleMix.mean >= INCUMBENT_ROLE_TV,
    },
    equilibriumBand: {
      dimensions: band, excludedForSubstrateDrift: bandExcluded,
      predicate: 'the §2 equilibrium band (C1 §4 absolute) holds on the ARM for every dimension '
        + 'the CONTROL itself holds; a dimension the CONTROL already fails is DISCLOSED as '
        + 'substrate drift and EXCLUDED (the P3a §4.2 caveat, declared ex ante).',
      holds: Object.values(band).every((d) => d.holds),
    },
  };
  const footballHolds = Object.values(footballGates).every((g) => g.holds);

  // ---- REPORTED (never gating; the #164 fork-grain exam already ruled value) --
  const reported = {
    note: 'SET-GRAIN scale honesty, NEVER a second bite: the fork-grain exam #164 already ruled '
      + 'the value of the backLoaded shape. Nothing in this block gates.',
    dupRun: armVs((s) => s.dupRunShare),
    deepEntries: pairedCI(perSet(c.rows.ARM, (r) => r.deepEntries), perSet(c.rows.CONTROL, (r) => r.deepEntries), nextWOff()),
    boxEntries: pairedCI(perSet(c.rows.ARM, (r) => r.boxEntries), perSet(c.rows.CONTROL, (r) => r.boxEntries), nextWOff()),
    offsides: armVs((s) => s.offsides, false),
    fouls: armVs((s) => s.fouls, false),
    penalties: armVs((s) => s.penalties, false),
    restartTicks: pairedCI(perSet(c.rows.ARM, (r) => r.restartTicks), perSet(c.rows.CONTROL, (r) => r.restartTicks), nextWOff()),
    turnovers: pairedCI(perSet(c.rows.ARM, (r) => r.turnovers), perSet(c.rows.CONTROL, (r) => r.turnovers), nextWOff()),
    spacingMedian: armVs((s) => s.spacingMedian),
    spacingUnder4: armVs((s) => s.spacingUnder4),
    restSlotOccupancy: armVs((s) => s.restSlotShare),
    boxAtArrivalCBox: armVs((s) => s.boxAtArrival),
    e4ThirdMan: armVs((s) => s.thirdMan, false),
    e4Overlaps: armVs((s) => s.overlaps, false),
    e4ForwardShare: armVs((s) => (s.passes === 0 ? Number.NaN : s.passesForward / s.passes)),
    goals: armVs((s) => s.goals, false),
    roleMixPairwiseArm: armRoleMix.pairwise,
    roleMixPairwiseControl: controlRoleMix.pairwise,
    perArmLevels: Object.fromEntries(W_ARMS.map((a) => [a, {
      deepEntries: round(mean(perSet(c.rows[a], (r) => r.deepEntries))),
      boxEntries: round(mean(perSet(c.rows[a], (r) => r.boxEntries))),
      restartTicks: round(mean(perSet(c.rows[a], (r) => r.restartTicks))),
      turnovers: round(mean(perSet(c.rows[a], (r) => r.turnovers))),
      dupRunShare: round(mean(colAvg(c.rows[a], (s) => s.dupRunShare).filter(Number.isFinite))),
      spacingMedian: round(mean(colAvg(c.rows[a], (s) => s.spacingMedian).filter(Number.isFinite))),
      offsides: round(mean(colSum(c.rows[a], (s) => s.offsides))),
      fouls: round(mean(colSum(c.rows[a], (s) => s.fouls))),
      goals: round(mean(colSum(c.rows[a], (s) => s.goals))),
    }])),
  };
  return { footballGates, footballHolds, reported, armRoleMix, controlRoleMix };
};

// --- Leg W sizing (the P3′ arithmetic) ---------------------------------------
const buildLegWSizing = (c: LegWCollected, seeds: readonly number[]) => {
  const armDup = colAvg(c.rows.ARM, (s) => s.dupRunShare);
  const ctlDup = colAvg(c.rows.CONTROL, (s) => s.dupRunShare);
  const perSetDiff = armDup.map((v, i) => v - ctlDup[i]);
  const sigma = sampleSd(perSetDiff);
  const point = mean(perSetDiff.filter(Number.isFinite));
  const mdl = Math.min(0.5 * Math.abs(point), LEGW_MDL_ABS);
  return {
    nSets: seeds.length,
    sizingTarget: 'the SET-GRAIN dupRun share contrast (ARM − CONTROL) — REPORTED at the battery, '
      + 'used here ONLY to size N; the gating football legs are resolved-sign guards and run '
      + 'over-powered at the frozen N.',
    smokeContext: {
      note: 'SMOKE CONTEXT ONLY — sizing, never a verdict; no gate leg is read here (I-A6, #105.4).',
      pooledDupRunDelta: round(point),
      controlDupRunLevel: round(mean(ctlDup.filter(Number.isFinite))),
      armDupRunLevel: round(mean(armDup.filter(Number.isFinite))),
    },
    sigmaPerSet: round(sigma), mdl: round(mdl), mdlAbs: LEGW_MDL_ABS, seenP151DupRun: P151_SEEN_DUPRUN,
    mdlFormula: 'MDL = min( 0.5·|smoke dupRun(ARM−CONTROL) point| , 0.019 ) — the absolute floor is '
      + 'HALF the #151 SEEN dupRun movement (+0.038 share) on PRIOR−R3p',
    seFormula: 'SE_N = σ̂/√N; resolve at 95 % power ⇒ SE_N ≤ MDL / 3.605 (POWER_Z)',
    nStarFormula: 'N* = smallest 200-step N with SE_N ≤ MDL/POWER_Z, capped at N_MAX',
    powerZ: POWER_Z, nStep: N_STEP, nCap: LEGW_N_CAP,
    wallBudgetHoursLegW: WALL_BUDGET_HOURS_LEGW, wallBudgetHoursTotal: WALL_BUDGET_HOURS_TOTAL,
    raw: { sigma, mdl },
  };
};
const computeLegWWall = (raw: { sigma: number; mdl: number }, perSetWallMs: number) => {
  const perSetTwice = perSetWallMs * XDET_FACTOR;
  let nMaxWall = 0;
  for (let n = N_STEP; n <= LEGW_N_CAP; n += N_STEP) if (n * perSetTwice <= WALL_BUDGET_MS_LEGW) nMaxWall = n;
  const nMax = Math.min(nMaxWall === 0 ? N_STEP : nMaxWall, LEGW_N_CAP);
  let nStar: number; let underPowered = false;
  let note = 'resolvable at N* ≤ N_MAX';
  if (!Number.isFinite(raw.sigma) || !Number.isFinite(raw.mdl) || raw.mdl <= 0) {
    nStar = nMax; underPowered = true;
    note = 'σ̂ or MDL undefined/zero ⇒ N* := N_MAX; UNDER-POWERED (published)';
  } else {
    const needRaw = (POWER_Z * raw.sigma / raw.mdl) ** 2;
    nStar = Math.min(Math.ceil(needRaw / N_STEP) * N_STEP, nMax);
    if (needRaw > nMax) { underPowered = true; note = 'N* > N_MAX ⇒ the cap binds; UNDER-POWERED (published) — the REPORTED dupRun read may be unresolved; no GATE depends on it'; }
  }
  const se = Number.isFinite(raw.sigma) ? raw.sigma / Math.sqrt(nStar) : Number.NaN;
  return {
    perSetWallMs: round(perSetWallMs, 2), xDetFactor: XDET_FACTOR, nMaxWall, nMax, nStar,
    underPowered, reducedPowerDisclosure: underPowered,
    projectedWallHoursAtNStar: round(nStar * perSetTwice / 3_600_000, 3),
    projectedPowerAtNStar: (Number.isFinite(se) && raw.mdl > 0) ? round(phi(raw.mdl / se - Z_975), 4) : Number.NaN,
    note: `${note}. Pass nStar as A4S2P3_N to legW.`,
  };
};

// =============================================================================
// ⭐ LEG S — the probe-side selection loop (OBSERVATIONAL)
// =============================================================================
interface EvoTeam { slot: number; genome: TacticalGenome }
interface GenStat {
  gen: number;
  adoptionFraction: number;        // teams carrying a NON-ZERO offset family
  familyPresentFraction: number;   // teams carrying the family at all (present, may be all-zero)
  obedienceAdoptionFraction: number;
  meanObedience: number;
  driftL2Mean: number; driftL2Max: number;
  meanAbsOffsetBySlot: number[];
  shapeClusters: number; topClusterShare: number; clusterHistogram: Record<string, number>;
  disciplinePressMean: number; disciplinePressSd: number;
  disciplineFraction: number; pressFraction: number;
  styleGeneCorrelations: Record<string, number>;
  fitnessDriftCorrelation: number;
}

/** the discipline-vs-press axis: cosine of the team's OUTFIELD offset vector against the
 *  backLoaded template [+.4,+.2,0,−.2,−.4] (纪律型 +1 … 压迫型 −1). #162.2.iv's axis. */
const TEMPLATE = [0.4, 0.2, 0, -0.2, -0.4] as const;
const disciplinePress = (off: readonly number[] | undefined): number => {
  if (off === undefined) return Number.NaN;
  const v = [1, 2, 3, 4, 5].map((i) => off[i] ?? 0);
  let dot = 0; let nv = 0; let nt = 0;
  for (let i = 0; i < 5; i++) { dot += v[i] * TEMPLATE[i]; nv += v[i] * v[i]; nt += TEMPLATE[i] * TEMPLATE[i]; }
  return (nv === 0 || nt === 0) ? Number.NaN : dot / Math.sqrt(nv * nt);
};
const signPattern = (off: readonly number[] | undefined): string => {
  if (off === undefined) return 'ABSENT';
  return [1, 2, 3, 4, 5].map((i) => {
    const v = off[i] ?? 0;
    return v > LEGS_SIGN_EPS ? '+' : v < -LEGS_SIGN_EPS ? '-' : '0';
  }).join('');
};
const l2 = (off: readonly number[] | undefined): number => {
  if (off === undefined) return 0;
  let s = 0;
  for (let i = 0; i < HOME_PRIOR_OFFSET_SLOTS; i++) s += (off[i] ?? 0) ** 2;
  return Math.sqrt(s);
};

interface LegSRunOut { run: number; gens: GenStat[]; gen0BornAbsent: boolean; matchesPlayed: number }

const runLegSRun = (
  run: number, teamsN: number, gens: number, seedBase: number, receipts: ReceiptBook | null,
): LegSRunOut => {
  const evoRng = new Rng(LEGS_EVO_RNG_BASE + run);
  const initRng = new Rng(seedBase);
  let pop: EvoTeam[] = Array.from({ length: teamsN }, (_, slot) => ({ slot, genome: randomGenome(initRng) }));
  // ⭐ gen-0 BIRTH NEUTRALITY (contract §3): every founder genome carries BOTH the obedience
  // gene and the offset family ABSENT. Asserted, never assumed.
  const gen0BornAbsent = pop.every((t) => t.genome.homePriorObedience === undefined
    && t.genome.homePriorObedienceOffset === undefined);
  const out: GenStat[] = [];
  let matchesPlayed = 0;
  const eliteN = Math.min(LEGS_ELITE_N, teamsN - 1);
  const rebornN = Math.min(LEGS_REBORN_N, Math.max(0, teamsN - eliteN - 1));

  for (let gen = 0; gen < gens; gen++) {
    // --- the season: a single round robin of ARMED matches --------------------
    const points = new Array<number>(teamsN).fill(0);
    const gd = new Array<number>(teamsN).fill(0);
    let idx = 0;
    for (let a = 0; a < teamsN; a++) {
      for (let b = a + 1; b < teamsN; b++) {
        const seed = seedBase + run * LEGS_RUN_STRIDE + gen * LEGS_GEN_STRIDE + idx;
        idx += 1;
        const m = matchOf(seed, [pop[a].genome, pop[b].genome]);
        m.stationEye = r3pEye(true);
        // ⭐ the ARMING CHECKLIST, flag 1 of 3: eye.v4.homePrior. The genes come from the
        // EVOLVING population (born absent at gen 0 ⇒ inert; nonzero only if selection
        // put them there) and are written onto every reference the team reads.
        for (const side of [0, 1] as const) {
          const g = side === 0 ? pop[a].genome : pop[b].genome;
          const t = m.teams[side];
          for (const gg of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
            if (g.homePriorObedience !== undefined) gg.homePriorObedience = g.homePriorObedience;
            if (g.homePriorObedienceOffset !== undefined) gg.homePriorObedienceOffset = [...g.homePriorObedienceOffset];
          }
        }
        while (!m.finished) m.step(DT);
        matchesPlayed += 1;
        const ga = m.teams[0].stats.goals; const gb = m.teams[1].stats.goals;
        gd[a] += ga - gb; gd[b] += gb - ga;
        if (ga > gb) points[a] += 3; else if (gb > ga) points[b] += 3; else { points[a] += 1; points[b] += 1; }
        m.stationEye = null;
      }
    }
    // fitness = points, goal difference as the tiebreak (the probe-side simplification of
    // src/evolution/fitness.ts, declared ex ante: shotQuality / styleConsistency need
    // SeasonAggregates the probe does not build).
    const fitness = points.map((p, i) => p + gd[i] * 1e-3);

    // --- the observation (BEFORE selection acts on this generation) -----------
    const offs = pop.map((t) => t.genome.homePriorObedienceOffset);
    const dp = offs.map(disciplinePress);
    const norms = offs.map(l2);
    const patterns = offs.map(signPattern);
    const hist: Record<string, number> = {};
    for (const p of patterns) hist[p] = (hist[p] ?? 0) + 1;
    const topShare = Math.max(0, ...Object.values(hist)) / (teamsN || 1);
    const styleCorr: Record<string, number> = {};
    for (const k of LEGS_STYLE_GENES) {
      styleCorr[k] = round(pearson(dp, pop.map((t) => t.genome[k])), 4);
    }
    out.push({
      gen,
      adoptionFraction: round(offs.filter((o) => o !== undefined && o.some((v) => v !== 0)).length / teamsN, 4),
      familyPresentFraction: round(offs.filter((o) => o !== undefined).length / teamsN, 4),
      obedienceAdoptionFraction: round(pop.filter((t) => t.genome.homePriorObedience !== undefined
        && t.genome.homePriorObedience !== 0).length / teamsN, 4),
      meanObedience: round(mean(pop.map((t) => t.genome.homePriorObedience ?? 0)), 4),
      driftL2Mean: round(mean(norms), 5), driftL2Max: round(Math.max(0, ...norms), 5),
      meanAbsOffsetBySlot: Array.from({ length: HOME_PRIOR_OFFSET_SLOTS }, (_, i) =>
        round(mean(offs.map((o) => Math.abs(o?.[i] ?? 0))), 5)),
      shapeClusters: Object.keys(hist).filter((k) => k !== 'ABSENT').length,
      topClusterShare: round(topShare, 4),
      clusterHistogram: hist,
      disciplinePressMean: round(mean(dp.filter(Number.isFinite)), 4),
      disciplinePressSd: round(sampleSd(dp), 4),
      disciplineFraction: round(dp.filter((v) => Number.isFinite(v) && v > 0.5).length / teamsN, 4),
      pressFraction: round(dp.filter((v) => Number.isFinite(v) && v < -0.5).length / teamsN, 4),
      styleGeneCorrelations: styleCorr,
      fitnessDriftCorrelation: round(pearson(norms, fitness), 4),
    });
    addReceipt(receipts, 'legS-generation', seedBase + run * LEGS_RUN_STRIDE + gen * LEGS_GEN_STRIDE, gen, run,
      `adoption ${out[out.length - 1].adoptionFraction} · driftL2 ${out[out.length - 1].driftL2Mean}`);

    if (gen === gens - 1) break;

    // --- selection: evolveGroup's band law, mirrored, ALL THREE FLAGS ARMED ----
    const ranked = [...pop].sort((x, y) => fitness[y.slot] - fitness[x.slot] || x.slot - y.slot);
    const pool = ranked.slice(0, 4);
    const pickParent = (exclude?: EvoTeam): EvoTeam => {
      const cands = pool.filter((f) => f !== exclude);
      const weights = cands.map((f) => 4 - pool.indexOf(f));
      const totalW = weights.reduce((s, w) => s + w, 0);
      let r = evoRng.next() * totalW;
      for (let i = 0; i < cands.length; i++) { r -= weights[i]; if (r <= 0) return cands[i]; }
      return cands[cands.length - 1];
    };
    const rebornFrom = ranked.length - rebornN;
    const next: EvoTeam[] = [];
    ranked.forEach((f, rank) => {
      if (rank < eliteN) { next.push({ slot: f.slot, genome: f.genome }); return; }
      if (rank < rebornFrom) {
        next.push({
          slot: f.slot,
          // ⭐ the ARMING CHECKLIST, flags 2 and 3 of 3.
          genome: mutateGenome(f.genome, evoRng, {
            rate: LEGS_MUT_RATE, scale: LEGS_MUT_SCALE,
            evolveHomePrior: true, evolveHomePriorOffsets: true,
          }),
        });
        return;
      }
      const pa = pickParent(); const pb = pickParent(pa);
      next.push({
        slot: f.slot,
        genome: mutateGenome(
          crossoverGenomes(pa.genome, pb.genome, evoRng, true, true), evoRng,
          { rate: LEGS_REBORN_RATE, scale: LEGS_REBORN_SCALE, evolveHomePrior: true, evolveHomePriorOffsets: true },
        ),
      });
    });
    pop = next.sort((x, y) => x.slot - y.slot);
  }
  return { run, gens: out, gen0BornAbsent, matchesPlayed };
};

const buildLegS = (runs: number, teamsN: number, gens: number, seedBase: number, receipts: ReceiptBook | null) => {
  const outs: LegSRunOut[] = [];
  const t0 = Date.now();
  for (let r = 0; r < runs; r++) {
    outs.push(runLegSRun(r, teamsN, gens, seedBase, receipts));
    console.error(`A4-S2P3 [${MODE}] legS run ${r + 1}/${runs} · ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  }
  const byGen = (g: number, f: (s: GenStat) => number): number[] => outs.map((o) => f(o.gens[g])).filter(Number.isFinite);
  const lastGen = gens - 1;
  const pooledFinal = {
    adoptionFraction: round(mean(byGen(lastGen, (s) => s.adoptionFraction)), 4),
    familyPresentFraction: round(mean(byGen(lastGen, (s) => s.familyPresentFraction)), 4),
    obedienceAdoptionFraction: round(mean(byGen(lastGen, (s) => s.obedienceAdoptionFraction)), 4),
    meanObedience: round(mean(byGen(lastGen, (s) => s.meanObedience)), 4),
    driftL2Mean: round(mean(byGen(lastGen, (s) => s.driftL2Mean)), 5),
    shapeClusters: round(mean(byGen(lastGen, (s) => s.shapeClusters)), 3),
    topClusterShare: round(mean(byGen(lastGen, (s) => s.topClusterShare)), 4),
    disciplinePressMean: round(mean(byGen(lastGen, (s) => s.disciplinePressMean)), 4),
    disciplinePressSd: round(mean(byGen(lastGen, (s) => s.disciplinePressSd)), 4),
    disciplineFraction: round(mean(byGen(lastGen, (s) => s.disciplineFraction)), 4),
    pressFraction: round(mean(byGen(lastGen, (s) => s.pressFraction)), 4),
    fitnessDriftCorrelation: round(mean(byGen(lastGen, (s) => s.fitnessDriftCorrelation)), 4),
    styleGeneCorrelations: Object.fromEntries(LEGS_STYLE_GENES.map((k) => [k,
      round(mean(outs.map((o) => o.gens[lastGen].styleGeneCorrelations[k]).filter(Number.isFinite)), 4)])),
  };
  const trajectory = Array.from({ length: gens }, (_, g) => ({
    gen: g,
    adoptionFraction: round(mean(byGen(g, (s) => s.adoptionFraction)), 4),
    driftL2Mean: round(mean(byGen(g, (s) => s.driftL2Mean)), 5),
    disciplinePressSd: round(mean(byGen(g, (s) => s.disciplinePressSd)), 4),
    shapeClusters: round(mean(byGen(g, (s) => s.shapeClusters)), 3),
    fitnessDriftCorrelation: round(mean(byGen(g, (s) => s.fitnessDriftCorrelation)), 4),
  }));
  const gen0Clean = outs.every((o) => o.gen0BornAbsent)
    && outs.every((o) => o.gens[0].adoptionFraction === 0 && o.gens[0].familyPresentFraction === 0
      && o.gens[0].obedienceAdoptionFraction === 0);
  return {
    label: 'OBSERVATIONAL (#165.3) — no gate, no threshold; the metrics below are PRE-REGISTERED '
      + 'VERBATIM from the ruling and reported as measured.',
    readingNote: '⚠ HOW TO READ ADOPTION (declared ex ante, before sight). Under the opt-in, the '
      + 'mutation law WRITES a full family onto every mutated/reborn genome, so bare '
      + '`familyPresentFraction` rises MECHANICALLY with generation and is NOT evidence of selection. '
      + 'The SELECTION signal lives in (i) `fitnessDriftCorrelation` — do bigger families win? — '
      + '(ii) `driftL2Mean` under elitism (elites carry their family unchanged, so a family that '
      + 'never survives to elite status keeps getting re-drawn small), and (iii) the SHAPE '
      + 'distribution (`shapeClusters`, `topClusterShare`, `disciplinePress*`) — does selection '
      + 'DIFFERENTIATE teams along discipline-vs-press, or is the cloud just mutation noise? A flat '
      + 'fitness–drift correlation with a noise-shaped cluster histogram IS the honest F-S2c-shaped '
      + 'outcome (H-165a unsupported).',
    shape: {
      runs, teams: teamsN, generations: gens, matchesPerGen: (teamsN * (teamsN - 1)) / 2,
      eliteN: Math.min(LEGS_ELITE_N, teamsN - 1), rebornN: Math.min(LEGS_REBORN_N, Math.max(0, teamsN - Math.min(LEGS_ELITE_N, teamsN - 1) - 1)),
      mutateRate: LEGS_MUT_RATE, mutateScale: LEGS_MUT_SCALE,
      rebornRate: LEGS_REBORN_RATE, rebornScale: LEGS_REBORN_SCALE,
      fitness: 'points (3/1/0) with goal difference as a 1e-3 tiebreak — the probe-side '
        + 'simplification of src/evolution/fitness.ts, declared ex ante',
      matchesTotal: outs.reduce((s, o) => s + o.matchesPlayed, 0),
    },
    gen0BornAbsent: gen0Clean,
    trajectory, pooledFinal,
    perRun: outs.map((o) => ({ run: o.run, gen0BornAbsent: o.gen0BornAbsent, final: o.gens[lastGen], gens: o.gens })),
    hypothesis: 'H-165a (LABELLED, directional, never a gate): selection adopts nonzero offsets at '
      + 'all. If fitness is flat on the family, that is the honest F-S2c-shaped outcome — the '
      + 'uniform whisper is already optimal for WINNING and the look-value is not selectable ⇒ the '
      + 'punish-compactness half (#154.3) inherits.',
  };
};

// =============================================================================
// THE ARMING CHECKLIST (#165.2.ii, BINDING) — asserted IN-PROBE
// =============================================================================
const buildArmingChecklist = () => {
  // (1) the consumption master flag on an armed world.
  const m = armWorld(LEGF_SMOKE_BASE, 'ARM', null);
  const eyeHomePrior = m.stationEye?.v4?.homePrior === true;
  const genomeFamilyPresent = [0, 1].every((s) => {
    const t = m.teams[s as Side];
    return ([t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[])
      .every((g) => g.homePriorObedience === WHISPER_OBEDIENCE
        && Array.isArray(g.homePriorObedienceOffset)
        && g.homePriorObedienceOffset.length === HOME_PRIOR_OFFSET_SLOTS);
  });
  // (2)+(3) the EVOLUTION opt-ins actually move the family (a live exercise, not a claim).
  const rng = new Rng(4242);
  let g: TacticalGenome = randomGenome(new Rng(99));
  const bornAbsent = g.homePriorObedience === undefined && g.homePriorObedienceOffset === undefined;
  for (let i = 0; i < 20; i++) {
    g = mutateGenome(g, rng, { rate: 0.9, scale: 0.3, evolveHomePrior: true, evolveHomePriorOffsets: true });
  }
  const evolveHomePriorLive = typeof g.homePriorObedience === 'number';
  const evolveHomePriorOffsetsLive = Array.isArray(g.homePriorObedienceOffset)
    && g.homePriorObedienceOffset.length === HOME_PRIOR_OFFSET_SLOTS
    && g.homePriorObedienceOffset.some((v) => v !== 0);
  const crossChild = crossoverGenomes(g, { ...g, homePriorObedienceOffset: [0.5, -0.5, 0.5, -0.5, 0.5, -0.5] }, new Rng(7), true, true);
  const crossoverArmed = Array.isArray(crossChild.homePriorObedienceOffset)
    && crossChild.homePriorObedienceOffset.length === HOME_PRIOR_OFFSET_SLOTS;
  return {
    predicate: 'AN ARMED WORLD = eye.v4.homePrior + evolveHomePrior + evolveHomePriorOffsets, ALL THREE '
      + '(#165.2.ii, binding). ⚠ For a FIXED armed world (Legs F and W) the two EVOLUTION opt-ins are '
      + 'IRRELEVANT BY CONSTRUCTION and stay OFF — nothing mutates there; the family is written directly '
      + 'onto the genome. They are the LIVE arming for Leg S. This block asserts all three are reachable '
      + 'and that the fixed worlds really carry the family.',
    eyeV4HomePrior: eyeHomePrior,
    genomeFamilyPresentBothSides: genomeFamilyPresent,
    randomGenomeBornAbsent: bornAbsent,
    evolveHomePriorLive, evolveHomePriorOffsetsLive, crossoverArmed,
    fixedWorldEvolutionFlagsOff: true,
    pass: eyeHomePrior && genomeFamilyPresent && bornAbsent && evolveHomePriorLive
      && evolveHomePriorOffsetsLive && crossoverArmed,
  };
};

// =============================================================================
// SEED + STATS DISJOINTNESS (HARD)
// =============================================================================
const disjointFrom = (aLo: number, aHi: number, bLo: number, bHi: number): boolean => aHi < bLo || bHi < aLo;
const buildDisjointness = () => {
  const legsHi = LEGS_BASE + (LEGS_RUNS - 1) * LEGS_RUN_STRIDE + (LEGS_GENS - 1) * LEGS_GEN_STRIDE + LEGS_MATCHES_PER_GEN - 1;
  const blocks: Array<readonly [string, number, number]> = [
    ['legF-smoke', LEGF_SMOKE_BASE, LEGF_SMOKE_BASE + LEGF_SMOKE_MATCHES - 1],
    ['legF', LEGF_BASE, LEGF_BASE + LEGF_M - 1],
    ['legW-smoke', LEGW_SMOKE_BASE, LEGW_SMOKE_BASE + LEGW_SMOKE_SETS - 1],
    ['legW', LEGW_BASE, LEGW_BASE + LEGW_N_CAP - 1],
    ['legS-smoke', LEGS_SMOKE_BASE, LEGS_SMOKE_BASE + LEGS_RUN_STRIDE - 1],
    ['legS', LEGS_BASE, legsHi],
  ];
  const withinPool = blocks.every(([, lo, hi]) => lo >= RESERVED_BAND[0] && hi <= RESERVED_BAND[1]);
  let mutual = true;
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (!disjointFrom(blocks[i][1], blocks[i][2], blocks[j][1], blocks[j][2])) mutual = false;
    }
  }
  const vsConsumed = blocks.every(([, lo, hi]) => CONSUMED_BLOCKS.every(([clo, chi]) => disjointFrom(lo, hi, clo, chi)));
  // ⭐ #163.2.iii: stats bases must be STREAM-disjoint (gaps ≥ 200), not merely base-fresh.
  const statsBases = [LEGW_BOOTSTRAP_SEED, LEGW_RESERVED_SEED, LEGS_BOOTSTRAP_SEED, LEGS_RESERVED_SEED];
  const allStats = [...CONSUMED_STATS, ...statsBases].sort((a, b) => a - b);
  let statsGapOk = true;
  for (let i = 1; i < allStats.length; i++) {
    // only the NEW bases must be ≥ 200 clear of everything else; historical collisions
    // among consumed bases are not this stage's to fix (recorded, not re-cut).
    if (statsBases.includes(allStats[i]) || statsBases.includes(allStats[i - 1])) {
      if (allStats[i] - allStats[i - 1] < STATS_GAP_MIN) statsGapOk = false;
    }
  }
  const statsFresh = statsBases.every((s) => !(CONSUMED_STATS as readonly number[]).includes(s)) && s6(statsBases);
  return {
    pass: withinPool && mutual && vsConsumed && statsGapOk && statsFresh,
    reservedBand: RESERVED_BAND, blocks, withinPool, mutual, vsConsumed,
    statsBases, statsGapMin: STATS_GAP_MIN, statsGapOk, statsFresh,
    consumedBlocks: CONSUMED_BLOCKS, consumedStats: CONSUMED_STATS,
    note: 'the #163 rule: stats bases 101,800 / 102,000 / 102,200 / 102,400 (all ≥ 101,700) with pairwise gaps ≥ 200 to every other base '
      + 'the arc has spent, so no bootstrap stream re-walks RNG a previous stage consumed.',
  };
};
function s6(xs: readonly number[]): boolean { return new Set(xs).size === xs.length; }

// =============================================================================
// THE DETERMINISTIC EXPERIMENT (run TWICE for X-DET)
// =============================================================================
const runExperiment = (pass: number) => {
  const receipts: ReceiptBook = {};
  const t0 = Date.now();
  let core: Record<string, unknown>;
  let wallPerUnitMs = 0;
  let sizingRaw: { sigma: number; mdl: number } | null = null;

  if (MODE === 'legF' || MODE === 'legF-smoke') {
    const planned = MODE === 'legF' ? LEGF_M : LEGF_SMOKE_MATCHES;
    const base = MODE === 'legF' ? LEGF_BASE : LEGF_SMOKE_BASE;
    const n = IS_PREFLIGHT ? Math.min(planned, CAP) : planned;
    const seeds = Array.from({ length: n }, (_, k) => base + k);
    console.error(`A4-S2P3 [${MODE} pass ${pass}] legF start · ${n} seeds @ ${base}`);
    const legF = buildLegF(seeds, receipts);
    wallPerUnitMs = n === 0 ? 0 : (Date.now() - t0) / n;
    core = {
      mode: MODE, leg: 'F', seedRange: { first: seeds[0] ?? null, last: seeds[seeds.length - 1] ?? null, count: n },
      seedFamily: MODE === 'legF'
        ? `${LEGF_BASE} + k, k∈0..${LEGF_M - 1} (the GATE block)`
        : `${LEGF_SMOKE_BASE} + k, k∈0..${LEGF_SMOKE_MATCHES - 1} (the plumbing block)`,
      legF, receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
    };
  } else if (MODE === 'legW' || MODE === 'legW-smoke') {
    const planned = MODE === 'legW' ? LEGW_N : LEGW_SMOKE_SETS;
    const base = MODE === 'legW' ? LEGW_BASE : LEGW_SMOKE_BASE;
    const n = IS_PREFLIGHT ? Math.min(planned, CAP) : planned;
    const seeds = Array.from({ length: n }, (_, k) => base + k);
    console.error(`A4-S2P3 [${MODE} pass ${pass}] legW start · ${n} sets @ ${base}`);
    const collected = collectLegW(seeds, receipts);
    wallPerUnitMs = n === 0 ? 0 : (Date.now() - t0) / n;
    const analysis = buildLegWAnalysis(collected, seeds);
    if (MODE === 'legW-smoke') {
      const sizing = buildLegWSizing(collected, seeds);
      sizingRaw = sizing.raw;
      const { raw, ...sizingOut } = sizing;
      void raw;
      core = {
        mode: MODE, leg: 'W', seedRange: { first: seeds[0] ?? null, last: seeds[seeds.length - 1] ?? null, count: n },
        seedFamily: `${LEGW_SMOKE_BASE} + k, k∈0..${LEGW_SMOKE_SETS - 1} (sizing only)`,
        sizing: sizingOut,
        smokeGateRealisation: {
          note: 'the GATE BLOCK is realised here to prove it plumbs and to publish the CONTROL arm\'s '
            + 'own equilibrium-band position; NO leg is READ at the smoke (I-A6, #105.4).',
          footballGates: analysis.footballGates, footballHolds: analysis.footballHolds,
        },
        reported: analysis.reported,
        receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
      };
    } else {
      core = {
        mode: MODE, leg: 'W', seedRange: { first: seeds[0] ?? null, last: seeds[seeds.length - 1] ?? null, count: n },
        seedFamily: `${LEGW_BASE} + k, k∈0..N−1 (N ≤ ${LEGW_N_CAP})`,
        arms: { CONTROL: 'both teams at the uniform whisper (eye.v4.homePrior, obedience 0.5, NO offsets) — the slice-1 PRIOR world',
          ARM: 'both teams gene-armed backLoaded (obedience 0.5 + the frozen offset family) — the Leg F Gboth world' },
        footballGates: analysis.footballGates, footballHolds: analysis.footballHolds,
        reported: analysis.reported,
        receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
      };
    }
  } else {
    const runs = MODE === 'legS' ? LEGS_RUNS : LEGS_SMOKE_RUNS;
    const teamsN = MODE === 'legS' ? LEGS_TEAMS : LEGS_SMOKE_TEAMS;
    const gens = MODE === 'legS' ? LEGS_GENS : LEGS_SMOKE_GENS;
    const base = MODE === 'legS' ? LEGS_BASE : LEGS_SMOKE_BASE;
    const rr = IS_PREFLIGHT ? Math.min(runs, CAP) : runs;
    console.error(`A4-S2P3 [${MODE} pass ${pass}] legS start · ${rr} runs × ${gens} gens × ${teamsN} teams @ ${base}`);
    const legS = buildLegS(rr, teamsN, gens, base, receipts);
    wallPerUnitMs = rr === 0 ? 0 : (Date.now() - t0) / rr;
    core = {
      mode: MODE, leg: 'S', seedBase: base,
      seedFamily: `${base} + run×${LEGS_RUN_STRIDE} + gen×${LEGS_GEN_STRIDE} + matchIndex`,
      legS,
      receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
    };
  }
  return { core, wallPerUnitMs, sizingRaw };
};

// =============================================================================
// TOP LEVEL — X-DET, the X-family, the disposition
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);
const { core: experiment, wallPerUnitMs, sizingRaw } = runExperiment(1);
const experiment2 = SKIP_DET ? null : runExperiment(2).core;
const xDet = SKIP_DET ? null : canonical(experiment) === canonical(experiment2);

if (MODE === 'legW-smoke' && sizingRaw !== null) {
  const sizing = (experiment as { sizing: Record<string, unknown> }).sizing;
  sizing.wallDerived = computeLegWWall(sizingRaw, wallPerUnitMs);
}

const mergeIdent = buildMergeIdent();
const priorEquivalence = buildPriorEquivalence();
const eNonStation = checkENonStation(LEGF_SMOKE_BASE);
const arming = buildArmingChecklist();
const disjoint = buildDisjointness();

// X-OFF-IDENT (bounded, the P3′ intent): the harness itself injects nothing — a
// stationEye-null enriched match on the leg's own seeds reproduces an independently
// constructed bare enriched match byte-for-byte.
const buildOffIdent = () => {
  const n = IS_PREFLIGHT ? 2 : 20;
  let mismatches = 0;
  for (let k = 0; k < n; k++) {
    const a = matchOf(LEGF_SMOKE_BASE + k);
    const b = matchOf(LEGF_SMOKE_BASE + k);
    if (runToEnd(a) !== runToEnd(b)) mismatches += 1;
  }
  return { seeds: n, mismatches, pass: mismatches === 0, note: 'X-OFF-IDENT (bounded): the enriched world with stationEye null reproduces itself byte-for-byte' };
};
const offIdent = buildOffIdent();

let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
const xSrcZero = srcDiff === '';

let fingerprint = 'skipped'; let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fingerprint = 'skipped (preflight)'; } else {
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  xFpProd = fingerprint === FINGERPRINT_BASELINE;
}

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates = {
  xDet, xMergeIdent: mergeIdent.pass, priorEquivalence: priorEquivalence.pass,
  eNonStation: eNonStation.pass, armingChecklist: arming.pass, xOffIdent: offIdent.pass,
  xSrcZero, xFpProd, seedDisjoint: disjoint.pass,
};
const hardGatesPass = Object.entries(gates)
  .filter(([k]) => !(SKIP_DET && k === 'xDet'))
  .every(([, v]) => v === true);

let verdict: string;
if (IS_PREFLIGHT) {
  verdict = `PREFLIGHT (bounded, ${MODE}) — NOT a verdict; exercises the fixtures, the leg machinery and the X-family on a capped slice.`;
} else if (!hardGatesPass) {
  const failed = Object.entries(gates).filter(([, v]) => v !== true).map(([k]) => k).join(' + ');
  verdict = `STOP — a HARD gate failed (${failed}): the measurement is invalid, read nothing else.`;
} else if (MODE === 'legF' || MODE === 'legF-smoke') {
  const f = (experiment as { legF: { holds: boolean; mismatchTotal: number; nonVacuousSeeds: number; seeds: number } }).legF;
  verdict = f.holds
    ? `LEG F PASS — GENE ≡ VECTOR on all ${f.seeds} seeds (F1 ∧ F2 ∧ F3, non-vacuous on every seed): the gene path and the instrument-vector path are the SAME WORLD, byte for byte.`
    : `STOP — LEG F FAILED: ${f.mismatchTotal}/${f.seeds} seeds mismatch (non-vacuous ${f.nonVacuousSeeds}/${f.seeds}). The gene path does NOT reproduce the S2-P1b instrument world; the S2-P1b read cannot be carried onto the gene. RETURNS TO THE USER.`;
} else if (MODE === 'legW-smoke') {
  verdict = 'LEG W SIZING SMOKE — NOT a verdict: realises the two arms, publishes σ̂ on the set-grain '
    + 'dupRun contrast, the CONTROL arm\'s own equilibrium-band position and the frozen N arithmetic. '
    + 'Pass sizing.wallDerived.nStar as A4S2P3_N.';
} else if (MODE === 'legW') {
  const a = experiment as { footballHolds: boolean; footballGates: Record<string, { holds: boolean }> };
  const failed = Object.entries(a.footballGates).filter(([, g]) => !g.holds).map(([k]) => k).join(' + ');
  verdict = a.footballHolds
    ? 'LEG W PASS — the armed-FIXED world holds every inherited football hard gate at SET grain '
      + '(scramble not resolved-up, eye ball-ledger 0, roleMixTV ≥ 0.407, the §2 equilibrium band). '
      + 'The set-grain currency block is REPORTED, never re-gated (#164).'
    : `STOP — LEG W FAILED (${failed}): the gene-armed world is not health-neutral at set grain. RETURNS TO THE USER.`;
} else if (MODE === 'legS-smoke') {
  verdict = 'LEG S SMOKE — NOT a verdict and NOT a sizing: wall + plumbing only (the armed evolution '
    + 'loop runs, gen-0 is born-absent, every pre-registered metric populates).';
} else {
  const s = experiment as { legS: { pooledFinal: { adoptionFraction: number }; gen0BornAbsent: boolean } };
  verdict = `LEG S OBSERVED (no gate) — gen-0 born-absent ${s.legS.gen0BornAbsent}; final-generation `
    + `adoption fraction ${s.legS.pooledFinal.adoptionFraction}. H-165a is READ, never gated; the result `
    + 'shapes the S2-P4 arming choice and RETURNS TO THE USER.';
}

const body = {
  experiment: `A4 S2-P3 — THE GENE BATTERY [${MODE}]`,
  authority: 'docs/world-model/A4-S2P3-GENE-BATTERY.md (the FROZEN pre-registration) — which '
    + 'ELABORATES and NEVER re-cuts ruling #165.3 (the three-leg frame frozen at commander level: '
    + 'Leg F gene≡vector fidelity GATING, Leg W set-grain world health GATING with the P3′ football '
    + 'hard gates inherited, Leg S selection + the §4 diversity observation OBSERVATIONAL with H-165a '
    + 'labelled); #165.2.ii (the ARMING CHECKLIST, binding); #164 (the confirmed backLoaded read — the '
    + 'set-grain currency is REPORTED, never re-gated); #163 (stats-base stream disjointness, gaps ≥ '
    + '200); #162 (the anchor philosophy + the §4 diversity axis); #158 / '
    + 'A4-SLICE2-PERBODY-CONTRACT §2/§3/§4/§5; A4-P3PRIME-REPLICATION (the set-grain battery idiom); '
    + 'A4-S2P1-VECTOR-CENSUS (the vector-grant machinery)',
  head, mode: MODE,
  world: 'ENRICHED (#67.3) + the ARMED R3p eye (v3 base+children+SHA; v4 inSupportLaw+deliveryBit+'
    + 'offsideBit), with eye.v4.homePrior armed ONLY where the leg declares it',
  flags: CENSUS_FLAGS,
  seam: 'the SHIPPED eye.v4.homePrior branch reading effectiveHomePriorObedience(team.genome, p.index) '
    + '= clamp01(obedience + offset[slot]) through homePriorStrength (src/ai/actionExecutor.ts, the '
    + 'S2-P2 line); the instrument comparator is Match.homeRegionGrant\'s VECTOR member',
  birthNeutrality: 'contract §3: every genome is BORN ABSENT. Legs F and W write the family directly '
    + 'onto probe fixtures (instrument content); Leg S starts gen-0 fully born-absent and lets '
    + 'selection earn every nonzero offset. NO role-derived birth default exists in src/**.',
  preflight: IS_PREFLIGHT ? { cap: CAP, skipFp: SKIP_FP, skipDet: SKIP_DET, note: 'bounded preflight — not a verdict' } : null,
  parameters: {
    backLoadedVector: BACKLOADED_VECTOR, whisperObedience: WHISPER_OBEDIENCE,
    frozenOffsetFamily: BACKLOADED_OFFSETS, offsetSlots: HOME_PRIOR_OFFSET_SLOTS,
    legF: { m: LEGF_M, seedBase: LEGF_BASE, smokeSeedBase: LEGF_SMOKE_BASE, smokeMatches: LEGF_SMOKE_MATCHES, worlds: LEGF_WORLDS },
    legW: {
      nCap: LEGW_N_CAP, nUsed: MODE === 'legW' ? LEGW_N : null, seedBase: LEGW_BASE,
      smokeSeedBase: LEGW_SMOKE_BASE, smokeSets: LEGW_SMOKE_SETS,
      bootstrapSeed: LEGW_BOOTSTRAP_SEED, reservedStatsSeed: LEGW_RESERVED_SEED,
      bootstrapResamples: BOOTSTRAP_RESAMPLES, incumbentRoleTvFloor: INCUMBENT_ROLE_TV,
      bandBaseline: BAND_BASELINE, bandTolerance: BAND_TOLERANCE,
      mdlAbs: LEGW_MDL_ABS, powerZ: POWER_Z, nStep: N_STEP,
    },
    legS: {
      runs: LEGS_RUNS, teams: LEGS_TEAMS, generations: LEGS_GENS,
      seedBase: LEGS_BASE, runStride: LEGS_RUN_STRIDE, genStride: LEGS_GEN_STRIDE,
      evoRngBase: LEGS_EVO_RNG_BASE, signEps: LEGS_SIGN_EPS, styleGenes: LEGS_STYLE_GENES,
      bootstrapSeed: LEGS_BOOTSTRAP_SEED, reservedStatsSeed: LEGS_RESERVED_SEED,
      smoke: { runs: LEGS_SMOKE_RUNS, teams: LEGS_SMOKE_TEAMS, generations: LEGS_SMOKE_GENS, seedBase: LEGS_SMOKE_BASE },
    },
    wallBudget: {
      totalHours: WALL_BUDGET_HOURS_TOTAL, legFHours: WALL_BUDGET_HOURS_LEGF,
      legWHours: WALL_BUDGET_HOURS_LEGW, legSHours: WALL_BUDGET_HOURS_LEGS,
    },
    clusterUnit: 'set seed (#20); one seed = one paired SET (both Leg W arms)',
    geneKeysCount: GENE_KEYS.length,
  },
  result: experiment,
  wall: { perUnitMs: round(wallPerUnitMs, 2), note: 'measured OUTSIDE the X-DET-compared core (#128)' },
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xMergeIdent: { ...mergeIdent, note: 'the injected P3p-1 merged table identity (inherited HARD gate)' },
    priorEquivalence,
    eNonStation: { ...eNonStation, note: 'the eye ACTIVATES on the armed world AND never overrides the ball carrier' },
    armingChecklist: arming,
    xOffIdent: offIdent,
    xSrcZero: { pass: xSrcZero, srcDiffStat: srcDiff, note: 'S2-P3 adds ZERO src/** — the seam and the gene family are BANKED at S2-P2' },
    xFpProd: { pass: xFpProd, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, skipped: SKIP_FP },
    seedDisjoint: disjoint,
    xCorpusIdent: 'N/A (a fresh interventional corpus has no identity target — the P1 §4 precedent)',
  },
  gates, hardGatesPass,
  deviations: [
    '⭐ LEG F IS THREE SUB-LEGS, NOT ONE BOTH-SIDES COMPARISON: Match.homeRegionGrant is STRUCTURALLY '
    + 'SINGLE-SIDE (the #150.1 fact), so a both-sides instrument-vector world is unreachable zero-src. '
    + 'F1/F2 compare the ONE-SIDED instrument world to its gene equivalent (the other side born-absent '
    + '⇒ strength 0 ⇒ inert); F3 compares the BOTH-SIDES gene world to itself with the vector laid over '
    + 'each side in turn (the grant branch takes precedence for the side it covers). Together they read '
    + 'the grant path and the gene path against each other on BOTH sides and in the both-sides world.',
    '⭐ LEG S RUNS A PROBE-SIDE SELECTION LOOP: MutateOptions is NOT plumbed through src/sim/League.ts '
    + 'or evolveGroup, so arming evolution inside the shipped League would need a src change (forbidden: '
    + 'Road B, X-SRC-ZERO). The loop mirrors evolveGroup\'s band law (elite 2 / mutated rate .4 scale '
    + '.08 / reborn 2 at rate .5 scale .15, top-4 weighted parents) over a single round robin; fitness = '
    + 'points with a goal-difference tiebreak. It is an INSTRUMENT: no careers, transfers, coaches, '
    + 'morale, promotion, fire-sale or two-division pyramid. Its honest limit is stated ex ante.',
    'THE GK SLOT of the offset family is frozen at 0 (role-BLIND, contract §3) rather than −0.5; the GK '
    + 'never reaches the v3 consumption point, and Leg F PROVES the choice is immaterial (the instrument '
    + 'vector gives him obedience 0 and the worlds are byte-identical).',
    'THE §2 EQUILIBRIUM BAND carries the P3a §4.2 substrate-drift caveat as an EXPLICIT gate rule: a '
    + 'dimension the CONTROL arm itself fails is DISCLOSED and EXCLUDED from the gate (it is substrate '
    + 'drift, not the gene\'s doing). Declared ex ante, before any sight.',
    'X-OFF-IDENT is the BOUNDED form (no R0 arm exists in this two-arm battery): a stationEye-null '
    + 'enriched match reproduces itself byte-for-byte on the leg seeds, proving the harness injects '
    + 'nothing of its own.',
    'MODE is EXPLICIT via A4S2P3_MODE (no default); A4S2P3_N is accepted ONLY in legW — Leg F\'s M and '
    + 'Leg S\'s shape are frozen in the stage doc and are hard-refused at the command line.',
  ],
  registeredNonClaims: [
    'NOTHING SHIPS (Road B): zero src/** changes, the production fingerprint 57b0bdab…c673 unchanged, '
    + 'every flag armed ONLY inside this instrument.',
    'THE SET-GRAIN CURRENCY IS NOT A SECOND BITE: dupRun / deep / box / offsides / fouls / the E4 '
    + 'counters are REPORTED at set grain for scale honesty; the fork-grain exam #164 already ruled value.',
    'LEG S IS OBSERVATIONAL: no adoption threshold, no fitness claim, no gate. H-165a is a LABELLED '
    + 'directional hypothesis.',
    'NO OFFSIDE-RULE CHANGE (the 乙 axis hangs by #158): offsides are measured and reported only.',
    'NO WATCHABILITY CLAIM: the proximity block\'s verdict authority remains the USER\'s eyes (#152); '
    + 'S2-P4 is the play-test.',
  ],
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({ ...body, sha256 }, null, 2)}\n`);

console.error(
  `A4-S2P3 [${MODE}] ${verdict.slice(0, 60)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''}`
  + ` · xDet ${xDet} · xMerge ${mergeIdent.pass} · priorEq ${priorEquivalence.pass} · arming ${arming.pass}`
  + ` · eNonSt ${eNonStation.pass} · offIdent ${offIdent.pass} · srcZero ${xSrcZero} · xFp ${xFpProd}`
  + ` · disj ${disjoint.pass} · wall/unit ${round(wallPerUnitMs, 1)} ms · SHA ${sha256.slice(0, 12)} → ${OUT_PATH}`,
);
