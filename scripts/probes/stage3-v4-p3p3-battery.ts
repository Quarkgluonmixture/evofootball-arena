// STAGE III V4-P3p-3 — THE MEASUREMENT BATTERY (the attribution-chain five arms).
//
// Authority: docs/world-model/STAGE3-V4-P3P3-BATTERY.md (the FROZEN pre-registration,
// as #121-AMENDED — the wall-derived N_MAX rule; the 2000/arm proposal SUPERSEDED)
// + rulings #120 (P3p-2 closes on reading A; #120.4 the DIRECTED attribution-chain
// five arms) and #121 (pre-reg PASS; sizing ruled full-power-first with a wall-derived
// N_MAX; probe build authorized). This probe re-runs the P3a WHOLE-MATCH watchability
// battery (scripts/probes/stage3-v3-p3a-deployment.ts) VERBATIM across the directed
// five-arm chain, under the pre-declared MEASUREMENT verdict form (§4): the REST limb
// REPORTED as the residual (the primary deliverable — the A4 target size, #109.3), the
// offside / restart / delivery limbs as per-remedy CURE gates (at the P3a bands vs THIS
// battery's own paired R0, #68.2), the #88.2 shape adjudicators as MUST-NOT-REGRESS
// gates, the X-family HARD. It TOUCHES NO src (X-SRC-ZERO): it injects the committed
// P3p-1 merged table's base + children + mergedTableSha, arms the per-arm eye.v4 flags,
// and reads the trace the src writes. Nothing ships (Road B): every EDS flag dormant,
// stationEye null, the eye.v4 flags absent, fingerprint 57b0bdab…c673 unchanged.
//
// THE FIVE ARMS (§2, DIRECTED — each remedy its marginal battery effect, telescoping):
//   R0            CONTROL   stationEye null — the paired ENRICHED baseline (#68.2)
//   R3v3          BOTH      plain v3 (roleTable,control); NO children; NO eye.v4 — the
//                           ATTRIBUTION baseline (P3a's R3 config re-run on the new seeds)
//   R3p-lawOnly   BOTH      v3+children; v4:{ law:T, delivery:F, offside:F } (law only —
//                           injects children but reads NEITHER family, §2.2; base for all)
//   R3p-noOffside BOTH      v3+children; v4:{ law:T, delivery:T, offside:F } (law+delivery)
//   R3p           BOTH      v3+children; v4:{ law:T, delivery:T, offside:T } (all three)  ←
//                           the arm every CURE GATE binds on
//   telescoping: (R3v3−R0)+(lawOnly−R3v3)+(noOffside−lawOnly)+(R3p−noOffside)=R3p−R0 (§2.1)
//   marginals (§5): restart←lawOnly−R3v3 · delivery←noOffside−lawOnly · offside←R3p−noOffside
//                   · rest residual←every arm vs R0 (REPORTED, unremedied CLASS H).
//
// TWO MODES (explicit V4P3P3_MODE, NO default):
//   smoke   — 40 matches @ 11,150,000 + k, all five arms, the LIGHT battery instruments
//             (the four limb quantities + wall), X-DET double-run. Publishes the
//             light-battery R0 restart-tick MEAN (→ the +10 % band edge, #68.2) + the
//             restart-tick per-match SD on the R3p−R0 paired difference (→ SE_N → N*), the
//             offside/delivery/rest instrument SDs, the per-set (5-arm) WALL cost, the
//             FROZEN N arithmetic (N* / N_MAX / the binding value + the reduced-power
//             disclosure), and the 30-tick freshness pins. Writes stage3-v4-p3p3-sizing-smoke.json.
//   battery — V4P3P3_N matches @ 11,200,000 + blockIndex·100,000 + k (5 sub-blocks
//             composing ONE shared N seed list, paired across all arms, §7). The
//             gate-bearing run: the §4 verdict form + the §5 marginal chain + the shape
//             adjudicators + the X-family + X-DET internal double-run. Writes
//             stage3-v4-p3p3-battery.json. Detached, the commander's resident (#49.5).
//
// N RULE (#121-AMENDED, frozen §6.4): N* = the smallest 200-step match count at which the
// smoke-measured restart SE_N resolves the restart cure gate at the band edge at ~95 %
// power (SE_N ≤ g/3.605), CAPPED at N_MAX; N_MAX is WALL-DERIVED at the smoke — the largest
// 200-step N whose projected total battery wall (the 5-arm per-set wall × N × 2 for X-DET)
// ≤ 36 hours, itself capped at 8,000/arm. If N* > N_MAX the cap binds and the reduced-power
// reading is DISCLOSED before the gate-bearing run (no optional stopping, #105.4).
//
// SEEDS: smoke 11.15M (k 0..39); battery 11.2M–11.6M (5 sub-blocks). Stats: bootstrap 99603
// (reserved for THIS battery, #120.4), permutation 99903 (fresh, unused). Bootstrap B=2000.
//
// GATES (§8, all HARD): X-MERGE-SHA (every partial arm) · X-FP-PROD · X-OFF-IDENT · X-SEAM ·
// X-DET · X-SRC-ZERO · STRUCTURAL eye-never-touches-ball (every partial arm) · seed
// disjointness. X-CORPUS-IDENT (R3v3−R0 reproduces the P3a picture) reported, not gating.
//
// COMMAND LINES:
//   smoke:    V4P3P3_MODE=smoke npx tsx scripts/probes/stage3-v4-p3p3-battery.ts
//   battery:  V4P3P3_MODE=battery V4P3P3_N=<disclosed N* from the smoke> \
//             npx tsx scripts/probes/stage3-v4-p3p3-battery.ts
//
// BOUNDED-PREFLIGHT env caps (labelled; a preflight REFUSES to write a canonical repo
// path — redirect via V4P3P3_OUT_SMOKE / V4P3P3_OUT_BATTERY=/tmp/…): V4P3P3_MATCH_CAP (cap
// seeds), V4P3P3_MATCH_DURATION (shorten matches), V4P3P3_SMOKE_MATCHES (smoke count),
// V4P3P3_SKIP_FP=1 (skip the fingerprint), V4P3P3_MERGED (alt table for the X-MERGE-SHA
// self-test).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { runHeadless } from '../../src/sim/simRunner';
import { formationSpot, runTarget, supportSpot } from '../../src/ai/formations';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import {
  STATION_FAMILY, newStationEyeTrace,
  type RoleConditionedTable, type RoleControlLevels, type MergedChildTable,
  type StationEyeTrace,
} from '../../src/ai/stationEye';
import {
  SUPPORT_STALE_TICKS, WIDTH_STALE_TICKS, LINE_STALE_TICKS,
} from '../../src/ai/eyeContextBitsV4';
import { Rng } from '../../src/utils/rng';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// =============================================================================
// MODE + frozen parameters
// =============================================================================
const MODE = process.env.V4P3P3_MODE;                 // 'smoke' | 'battery'; validated in main()
const IS_BATTERY = MODE === 'battery';

/** §7: fresh bands, disjoint above the P3p-2 run high-water (11,100,119). */
const SMOKE_START = 11_150_000;
const BATTERY_START = 11_200_000;
const BATTERY_BLOCK_STRIDE = 100_000;
const BATTERY_BLOCKS = 5;                             // 5 sub-blocks (11.2/11.3/11.4/11.5/11.6M)

/** smoke = 40 (env-overridable for the bounded preflight only, labelled);
 *  battery = V4P3P3_N (REQUIRED, no default, validated in main). */
const N_REQUESTED = IS_BATTERY ? envInt('V4P3P3_N', -1) : envInt('V4P3P3_SMOKE_MATCHES', 40);
/** bounded-preflight cap on the number of seeds (labelled). */
const MATCH_CAP = envInt('V4P3P3_MATCH_CAP', Number.POSITIVE_INFINITY);
const MATCHES = Number.isFinite(MATCH_CAP) ? Math.min(N_REQUESTED, MATCH_CAP) : N_REQUESTED;

/** bounded-preflight match-duration override (labelled); real runs OMIT it ⇒ the src
 *  default MATCH_DURATION=240 (the P3a battery's own matchOf, byte-identical). */
const MATCH_DURATION_ENV = process.env.V4P3P3_MATCH_DURATION;

// --- frozen instrument constants (P3a §§4 VERBATIM) --------------------------
const SAMPLE_EVERY = 10;            // 6 Hz (every 10th tick), P0 §2
const SAMPLE_DT = SAMPLE_EVERY * DT;
const PAIR_SUBSAMPLE = 6;           // P0's I3 sub-sample
const CLOSE_PAIR_M = 4;             // I3 share < 4 m
const BALL_NEAR_M = 5;             // I4 within 5 m
const BALL_MID_M = 10;             // I4 within 10 m
const DRIFT_FAST_MS = 4;           // I2 fast-drift bucket
const DUP_RUN_M = 4;               // I6 duplicate-run bucket
const REST_THIRD = HALF_L / 3;     // I5 own-third depth
const CROSS_WINDOW_S = 4;          // C-BOX arrival window (C4's own 4 s)
const SPEED_GATE = 2.5;            // de-glue speed gate (release classification)
const RECEIPT_CAP = 1000;          // per-class receipts cap (#49.3), first-N deterministic
const REST_BOTH = 2;               // I5(a) both-back = >= 2 deep in own third

// --- P0 reference points the DEGEN battery bands anchor on (P3a §4.1, reported) --
const P0_I4_OWN5 = 0.956;          // DEGEN-SCRAMBLE (v1 reference)
const P0_I3_UNDER4 = 0.0940;       // DEGEN-PILEUP (share, v1 reference)
const P0_I5_SLOT = 0.6582;         // DEGEN-RESTDEF (v1 reference)
// two-part predicate thresholds (relative), P3a §4.1 verbatim:
const DEGEN_SCRAMBLE_REL = 0.25;   // I4 own-within-5 m rises >= +25 %
const DEGEN_PILEUP_REL = 0.50;     // I3 share < 4 m rises >= +50 %
const DEGEN_RESTDEF_REL = -0.20;   // I5(b) slot falls >= 20 % drop  (the REPORTED residual)
const CANARY_OFFSIDE_REL = 0.10;   // C-OFFSIDE: offsides/match rise, point >= +10 %  (CURE gate)
const CANARY_BOX_REL = -0.15;      // C-BOX: box-at-arrival falls >= 15 %  (MUST-NOT-REGRESS)
const CANARY_RESTART_REL = 0.10;   // C-RESTART: restart ticks/match rise >= +10 %  (CURE gate)

// --- §2 EQUILIBRIUM BAND (P3a §4.2, C1 §4 absolute) --------------------------
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;
const INCUMBENT_ROLE_TV = 0.407;   // the incumbent's mean pairwise role TV (P3a §4.3)

// --- sizing (§6, frozen) -----------------------------------------------------
const RESTART_BAND_REL = 0.10;     // the +10 % restart cure-gate band edge (#120.2)
const POWER_Z = 3.605;             // z_.975 + z_.95 (two-sided 95 % CI test at 95 % power)
const Z_975 = 1.96;                // the two-sided 95 % CI z (doc §6.1 arithmetic)
const N_STEP = 200;                // fixed-step N grid (#121)
const N_CAP = 8000;                // the hard N/arm cap (#121)
const WALL_BUDGET_HOURS = 36;      // the wall cap (#121)
const WALL_BUDGET_MS = WALL_BUDGET_HOURS * 3600 * 1000;
const XDET_FACTOR = 2;             // the battery runs twice (X-DET)

// --- stats seeds (§7) --------------------------------------------------------
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 99603;      // reserved for THIS battery (#120.4), never drawn
const PERM_SEED = 99903;           // fresh; reserved-unused (no dispersion null here)

// --- X-FP-PROD: the frozen shipped-world production fingerprint --------------
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SKIP_FP = process.env.V4P3P3_SKIP_FP === '1';   // bounded-preflight only, labelled

// --- the injected P3p-1 merged table (base+children+SHA) + control -----------
const MERGED_PATH = process.env.V4P3P3_MERGED
  ?? 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const MERGED_SHA_EXPECTED =
  '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED =
  '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';
const CONTROL_PATH = process.env.V4P3P3_CONTROL_PATH
  ?? 'docs/world-model/data/stage3-v3-p2-control-recovery.json';

const SMOKE_OUT = process.env.V4P3P3_OUT_SMOKE
  ?? 'docs/world-model/data/stage3-v4-p3p3-sizing-smoke.json';
const BATTERY_OUT = process.env.V4P3P3_OUT_BATTERY
  ?? 'docs/world-model/data/stage3-v4-p3p3-battery.json';

/** #67.3: the ENRICHED world — the substrate the v3 table + merged children were
 *  censused on (identical CENSUS_FLAGS as V3-P2 / P3p-1 / P3p-2). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];

// --- the five attribution-chain arms (§2) ------------------------------------
const ALL_ARMS = ['R0', 'R3v3', 'R3p-lawOnly', 'R3p-noOffside', 'R3p'] as const;
type Arm = (typeof ALL_ARMS)[number];
const ARMED_ARMS: readonly Arm[] = ['R3v3', 'R3p-lawOnly', 'R3p-noOffside', 'R3p'];
const PARTIAL_ARMS: readonly Arm[] = ['R3p-lawOnly', 'R3p-noOffside', 'R3p'];

// =============================================================================
// preflight guard — a capped invocation must NOT write a canonical repo path
// =============================================================================
const PREFLIGHT = Number.isFinite(MATCH_CAP) || MATCH_DURATION_ENV !== undefined
  || SKIP_FP || process.env.V4P3P3_MERGED !== undefined
  || process.env.V4P3P3_SMOKE_MATCHES !== undefined;
const isCanonicalRepoPath = (p: string): boolean => p.startsWith('docs/world-model/data/');

// --- small numeric helpers (P3a verbatim) ------------------------------------
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((s, x) => s + x, 0) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};
const sha = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');
/** standard normal CDF (Abramowitz–Stegun 7.1.26 erf), for the projected power read. */
const phi = (z: number): number => {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592)
    * t * Math.exp(-(z * z) / 2);
  const cdf = 0.5 * (1 + Math.sign(z) * y);
  return Math.min(1, Math.max(0, cdf));
};

// --- team fixture (the house pattern; P3a verbatim) --------------------------
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), ...CENSUS_FLAGS,
  ...(MATCH_DURATION_ENV !== undefined ? { duration: Number(MATCH_DURATION_ENV) } : {}),
});

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

// =============================================================================
// the injected merged table + control (X-MERGE-SHA) — never bundled in src/**
// =============================================================================
interface MergedTableFile {
  mergedTableSha: string; baseTableSha?: string; baseTableShaObserved?: string;
  base: RoleConditionedTable; children: MergedChildTable; mergedChildCount?: number; keying?: string;
}
const rawMerged = JSON.parse(readFileSync(MERGED_PATH, 'utf8')) as MergedTableFile;
const roleTable: RoleConditionedTable = rawMerged.base;
const children: MergedChildTable = rawMerged.children;
const mergedTableSha = rawMerged.mergedTableSha;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: RoleControlLevels; sha256: string; guard: { pass: boolean }; pooledControl: number;
};
const control: RoleControlLevels = rawControl.control;

/** X-MERGE-SHA: the loaded mergedTableSha == 39662445…9d6105 AND its `base` rehashes to the
 *  injected v3 base 171a6dad…6559f (= the P3p-1 identity), AND the field reproduces from
 *  {base, children} (self-consistency). Asserted identically on every PARTIAL arm (§2.2). */
const buildMergeSha = () => {
  const baseRehash = sha(roleTable);
  const mergedRehash = sha({ base: roleTable, children });
  const mergedShaOk = mergedTableSha === MERGED_SHA_EXPECTED && mergedRehash === MERGED_SHA_EXPECTED;
  const baseShaOk = baseRehash === BASE_SHA_EXPECTED;
  return {
    mergedShaField: mergedTableSha, mergedShaExpected: MERGED_SHA_EXPECTED, mergedRehash,
    baseRehash, baseShaExpected: BASE_SHA_EXPECTED, mergedShaOk, baseShaOk,
    pass: mergedShaOk && baseShaOk,
    path: MERGED_PATH, mergedChildCount: rawMerged.mergedChildCount, keying: rawMerged.keying,
  };
};

// =============================================================================
// arm eye configs (§2) — R3v3 base ≡ every partial arm's base (same object)
// =============================================================================
type EyeConfig = NonNullable<Match['stationEye']>;
/** the whole-match arm eye. R0 → null. R3v3 → plain v3 (no children, no v4). The three
 *  partial arms → v3 base + injected children + the per-arm eye.v4 flag block (§2). */
const armEye = (arm: Arm, trace: StationEyeTrace | undefined): EyeConfig | null => {
  if (arm === 'R0') return null;
  const scope: EyeConfig['scope'] = { kind: 'both' };
  if (arm === 'R3v3') {
    return { arm: 'neutral', scope, table: {}, v3: { roleTable, control }, trace };
  }
  const v4 = arm === 'R3p-lawOnly'
    ? { inSupportLaw: true, deliveryBit: false, offsideBit: false }
    : arm === 'R3p-noOffside'
      ? { inSupportLaw: true, deliveryBit: true, offsideBit: false }
      : { inSupportLaw: true, deliveryBit: true, offsideBit: true };
  return {
    arm: 'neutral', scope, table: {},
    v3: { roleTable, control, children, mergedTableSha }, v4, trace,
  };
};

/** X-MERGE-SHA per partial arm (§8): each of the three partial arms carries the identical
 *  children object + mergedTableSha, gated by its per-family eye.v4 flags; R0/R3v3 inject none. */
const xMergeShaPerArm = () => {
  const merge = buildMergeSha();
  const perArm = Object.fromEntries(ALL_ARMS.map((arm) => {
    const eye = armEye(arm, undefined);
    const injects = eye?.v3?.children !== undefined && eye?.v3?.mergedTableSha !== undefined;
    const isPartial = (PARTIAL_ARMS as readonly string[]).includes(arm);
    return [arm, {
      isPartial, injectsChildren: injects,
      childrenIdentical: eye?.v3?.children === children,
      shaField: eye?.v3?.mergedTableSha ?? null,
      // partial arms MUST inject; R0/R3v3 MUST NOT.
      correct: isPartial
        ? injects && eye?.v3?.children === children && eye?.v3?.mergedTableSha === MERGED_SHA_EXPECTED
        : !injects,
    }];
  }));
  const allPartialsAssert = PARTIAL_ARMS.every((a) => (perArm[a] as { correct: boolean }).correct);
  const nonePartialsInject = (['R0', 'R3v3'] as const).every((a) => (perArm[a] as { correct: boolean }).correct);
  return { ...merge, perArm, pass: merge.pass && allPartialsAssert && nonePartialsInject };
};

// =============================================================================
// station family ledger + release/exclusion/perRole ledgers (P3a §§4 verbatim)
// =============================================================================
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
const stationTargetOf = (
  p: Player, t: Team, opp: Team, m: Match, family: Family,
): { x: number; y: number } | null => {
  const hasBall = m.possessionSide === t.side;
  switch (family) {
    case 'FORMATION': return formationSpot(p, t, m.ball, hasBall, opp);
    case 'SUPPORT': return supportSpot(p, t, m.ball);
    case 'RUN': return runTarget(p, t, opp.players);
    default: return null;
  }
};

interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// ownership-release ledger (#48.3 / §8; the STRUCTURAL eye-never-touches-ball gate).
interface ReleaseLedger {
  releases: number; tackle: number; deglue: number; kick: number; ballWon: number;
  eyeAttributable: number; // MUST be 0 (the eye never writes ball.owner)
  unattributable: number;  // MUST be 0 (every release classes to a named channel)
}
const newReleaseLedger = (): ReleaseLedger => ({
  releases: 0, tackle: 0, deglue: 0, kick: 0, ballWon: 0, eyeAttributable: 0, unattributable: 0,
});

interface ExclusionCounts { ePaused: number; eGk: number; eEnded: number; eSentOff: number }
const newExclusion = (): ExclusionCounts => ({ ePaused: 0, eGk: 0, eEnded: 0, eSentOff: 0 });

interface RoleLedger { decisions: number; deviations: number; mix: Map<string, number> }
const newRoleLedger = (): RoleLedger => ({ decisions: 0, deviations: 0, mix: new Map() });
type PerRole = Record<Role, RoleLedger>;
const newPerRole = (): PerRole => ({
  GK: newRoleLedger(), DF: newRoleLedger(), MF: newRoleLedger(),
  WG: newRoleLedger(), ST: newRoleLedger(),
});

// --- sum every StationEyeTrace field needed by the consumption ledger (§2.2) --
const addTrace = (a: StationEyeTrace, b: StationEyeTrace): void => {
  a.decisions += b.decisions; a.deviate += b.deviate;
  a.abstainNoSnapshot += b.abstainNoSnapshot; a.abstainNoBall += b.abstainNoBall;
  a.abstainNoOwner += b.abstainNoOwner; a.noCell += b.noCell; a.tie += b.tie;
  a.nonStationTicks += b.nonStationTicks; a.overrideTicks += b.overrideTicks;
  a.ctxSeen += b.ctxSeen; a.ctxAgree += b.ctxAgree; a.ctxAgreeFace += b.ctxAgreeFace;
  a.ctxAgreeThreat += b.ctxAgreeThreat; a.ctxAgreeDensity += b.ctxAgreeDensity;
  a.v4InSupport += b.v4InSupport; a.v4OosPhase += b.v4OosPhase; a.v4OosUnseen += b.v4OosUnseen;
  a.v4OosInflight += b.v4OosInflight; a.v4OosStale += b.v4OosStale;
  a.v4WidthHeld0 += b.v4WidthHeld0; a.v4WidthHeld1 += b.v4WidthHeld1; a.v4WidthHeldUnknown += b.v4WidthHeldUnknown;
  a.v4BeyondLine0 += b.v4BeyondLine0; a.v4BeyondLine1 += b.v4BeyondLine1; a.v4BeyondLineUnknown += b.v4BeyondLineUnknown;
  a.v4DeliveryChild += b.v4DeliveryChild; a.v4DeliveryBase += b.v4DeliveryBase;
  a.v4OffsideChild += b.v4OffsideChild; a.v4OffsideBase += b.v4OffsideBase;
  for (const [k, v] of b.byCandidate) a.byCandidate.set(k, (a.byCandidate.get(k) ?? 0) + v);
  for (const [k, v] of b.byContext) a.byContext.set(k, (a.byContext.get(k) ?? 0) + v);
};

/** §2.2 consumption-ledger view: child-vs-base reads by family (a family whose child count
 *  is 0 never fired — lawOnly reads ZERO children; noOffside reads delivery only). */
const ledgerOf = (t: StationEyeTrace) => {
  const bitDelivery = t.v4WidthHeld0 + t.v4WidthHeld1 + t.v4WidthHeldUnknown;
  const bitOffside = t.v4BeyondLine0 + t.v4BeyondLine1 + t.v4BeyondLineUnknown;
  const oosTotal = t.v4OosPhase + t.v4OosUnseen + t.v4OosInflight + t.v4OosStale;
  return {
    decisions: t.decisions, deviate: t.deviate, tie: t.tie, noCell: t.noCell,
    inSupport: t.v4InSupport, oosPhase: t.v4OosPhase, oosUnseen: t.v4OosUnseen,
    oosInflight: t.v4OosInflight, oosStale: t.v4OosStale, oosTotal,
    oosShare: round(oosTotal / ((t.v4InSupport + oosTotal) || 1)),
    widthHeld0: t.v4WidthHeld0, widthHeld1: t.v4WidthHeld1, widthHeldUnknown: t.v4WidthHeldUnknown,
    deliveryBitFireRate: round(t.v4WidthHeld1 / (bitDelivery || 1)),
    beyondLine0: t.v4BeyondLine0, beyondLine1: t.v4BeyondLine1, beyondLineUnknown: t.v4BeyondLineUnknown,
    offsideBeyondShare: round(t.v4BeyondLine1 / (bitOffside || 1)),
    deliveryChild: t.v4DeliveryChild, deliveryBase: t.v4DeliveryBase,
    deliveryChildShare: round(t.v4DeliveryChild / ((t.v4DeliveryChild + t.v4DeliveryBase) || 1)),
    offsideChild: t.v4OffsideChild, offsideBase: t.v4OffsideBase,
    offsideChildShare: round(t.v4OffsideChild / ((t.v4OffsideChild + t.v4OffsideBase) || 1)),
    // the structural facts (§2.2 preflight): does this arm read children at all?
    readsDeliveryChildren: t.v4DeliveryChild + t.v4DeliveryBase > 0,
    readsOffsideChildren: t.v4OffsideChild + t.v4OffsideBase > 0,
  };
};

// =============================================================================
// the LIGHT collector (SMOKE, §6.4) — the four limb quantities + wall
// =============================================================================
interface LightMediators {
  offsideRate: number;        // offsides both sides / match (final stat — instrument-exact)
  deliveryEvents: number;     // (longBalls + crosses + cutbacks) both sides / match (final stat)
  restartTicks: number;       // restart ticks / match — the P3a instrument (m.restart !== null)
  restSlotOccupancy: number;  // I5(b) surrogate: index-1 body held in own-third over playing ticks
}
/** play ONE full match under `arm` collecting ONLY the four sizing quantities + wall.
 *  restartTicks uses the P3a battery instrument (m.restart !== null) so the sizing SD
 *  matches the gate the battery will run; restSlotOccupancy is the light per-tick surrogate
 *  (the battery's DEGEN-RESTDEF is 6 Hz possession-sampled — REPORTED + over-powered, §6.2). */
const playArmLight = (seed: number, arm: Arm): { mediators: LightMediators; trace: StationEyeTrace | null; wallMs: number } => {
  const t0 = Date.now();
  const m = matchOf(seed);
  const trace = arm === 'R0' ? null : newStationEyeTrace();
  const eye = armEye(arm, trace ?? undefined);
  if (eye !== null) m.stationEye = eye;
  let restartTicks = 0;
  let heldS0 = 0; let presentS0 = 0; let heldS1 = 0; let presentS1 = 0;
  while (!m.finished) {
    m.step(DT);
    if (m.finished) break;
    if (m.restart !== null) restartTicks += 1;
    if (m.phase === 'playing') {
      for (const side of [0, 1] as const) {
        const t = m.teams[side];
        const b = t.players.find((p) => p.index === 1 && !p.sentOff);
        if (b === undefined) continue;
        const held = t.localX(b.pos.x) < -REST_THIRD ? 1 : 0;
        if (side === 0) { presentS0 += 1; heldS0 += held; } else { presentS1 += 1; heldS1 += held; }
      }
    }
  }
  const s = [m.teams[0].stats, m.teams[1].stats];
  const restSlotS0 = presentS0 === 0 ? Number.NaN : heldS0 / presentS0;
  const restSlotS1 = presentS1 === 0 ? Number.NaN : heldS1 / presentS1;
  const mediators: LightMediators = {
    offsideRate: s[0].offsides + s[1].offsides,
    deliveryEvents: s[0].longBalls + s[0].crosses + s[0].cutbacks + s[1].longBalls + s[1].crosses + s[1].cutbacks,
    restartTicks,
    restSlotOccupancy: mean([restSlotS0, restSlotS1].filter(Number.isFinite)),
  };
  m.stationEye = null;
  return { mediators, trace, wallMs: Date.now() - t0 };
};

// =============================================================================
// the FULL whole-match battery instrument (BATTERY, P3a §§4 runMatch VERBATIM)
// =============================================================================
interface SideRow {
  dwellMedian: number; familyChangesPerBodyPerMin: number;
  driftMedian: number; driftFastShare: number;
  spacingP10: number; spacingMedian: number; spacingUnder4: number;
  ballNear: number; ballMid: number;
  restCount: number; restBothShare: number; restSlotShare: number; dupRunShare: number;
  shapeDeltaCentroid: number; shapeDeltaSpreadX: number; shapeDeltaSpreadY: number;
  offsides: number; goals: number; shots: number; shotsOnTarget: number; blocks: number;
  crosses: number; headersWon: number; longBalls: number; cutbacks: number;
  passes: number; passesCompleted: number; passesForward: number;
  oneTwos: number; bestPassChain: number; tackles: number; interceptions: number;
  boxAtArrival: number; crossArrivals: number;
}
const emptySide = (): SideRow => ({
  dwellMedian: Number.NaN, familyChangesPerBodyPerMin: Number.NaN,
  driftMedian: Number.NaN, driftFastShare: Number.NaN,
  spacingP10: Number.NaN, spacingMedian: Number.NaN, spacingUnder4: Number.NaN,
  ballNear: Number.NaN, ballMid: Number.NaN,
  restCount: Number.NaN, restBothShare: Number.NaN, restSlotShare: Number.NaN, dupRunShare: Number.NaN,
  shapeDeltaCentroid: Number.NaN, shapeDeltaSpreadX: Number.NaN, shapeDeltaSpreadY: Number.NaN,
  offsides: 0, goals: 0, shots: 0, shotsOnTarget: 0, blocks: 0, crosses: 0, headersWon: 0,
  longBalls: 0, cutbacks: 0, passes: 0, passesCompleted: 0, passesForward: 0,
  oneTwos: 0, bestPassChain: 0, tackles: 0, interceptions: 0,
  boxAtArrival: Number.NaN, crossArrivals: 0,
});

interface MatchRow {
  readonly seed: number; readonly arm: Arm;
  readonly sides: [SideRow, SideRow];
  readonly restartTicks: number; readonly looseCount: number;
  readonly possessionSpells: number; readonly spellDurations: number[];
  readonly turnoverOwnThird: number; readonly turnoverMiddle: number; readonly turnoverTheirThird: number;
  readonly arrivalC0: number; readonly arrivalC1: number; readonly arrivalC2: number; readonly arrivalC3: number;
  readonly signature: string;
}

const runMatch = (
  seed: number, arm: Arm,
  trace: StationEyeTrace | null, release: ReleaseLedger | null,
  exclusion: ExclusionCounts | null, perRole: PerRole | null, receipts: ReceiptBook | null,
): MatchRow => {
  const m = matchOf(seed);
  const eye = armEye(arm, trace ?? undefined);
  if (eye !== null) m.stationEye = eye;
  const per: [SideRow, SideRow] = [emptySide(), emptySide()];

  const roleOf = new Map<number, Role>();
  for (const p of m.allPlayers) roleOf.set(p.gid, p.role);
  const lastUntil = new Map<number, number>();

  const dwells: [number[], number[]] = [[], []];
  const drifts: [number[], number[]] = [[], []];
  const pairs: [number[], number[]] = [[], []];
  const ballNear: [number[], number[]] = [[], []];
  const ballMid: [number[], number[]] = [[], []];
  const restCount: [number[], number[]] = [[], []];
  const boxAtArrival: [number[], number[]] = [[], []];
  const shape = [0, 1].map(() => ({
    inPoss: { cx: 0, sx: 0, sy: 0, n: 0 }, outPoss: { cx: 0, sx: 0, sy: 0, n: 0 },
  }));
  const lastFamily = new Map<number, Family>();
  const dwellStart = new Map<number, number>();
  const lastTarget = new Map<number, { x: number; y: number }>();
  const familyChanges = [0, 0];
  const restTicks = [0, 0];
  const restBothTicks = [0, 0];
  const restSlotTicks = [0, 0];
  const runTicks = [0, 0];
  const dupRunTicks = [0, 0];

  let restartTicks = 0;
  let looseCount = 0;
  let samples = 0;
  let tick = 0;
  const crossesBefore: [number, number] = [0, 0];
  const inFlight: { side: 0 | 1; deadline: number; headersAtStart: number; arrived: boolean; maxInBox: number }[] = [];
  let arrivalC0 = 0, arrivalC1 = 0, arrivalC2 = 0, arrivalC3 = 0;

  let lastValidPoss: number | -1 = -1;
  let spellStartTick = 0;
  let possessionSpells = 0;
  const spellDurations: number[] = [];
  let turnoverOwnThird = 0, turnoverMiddle = 0, turnoverTheirThird = 0;

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

    if (perRole !== null && eye !== null) {
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

    if (exclusion !== null) {
      if (m.finished) exclusion.eEnded += 1;
      else if (!playing) exclusion.ePaused += 1;
      else if (owner !== null && owner.role === 'GK') exclusion.eGk += 1;
      else if (owner !== null && owner.sentOff) exclusion.eSentOff += 1;
    }

    const newOwner = m.ball.owner;
    const released = prevOwnerGid !== null && (newOwner === null || newOwner.gid !== prevOwnerGid);
    if (released) {
      const relGid = prevOwnerGid as number;
      if (newOwner === null) looseCount += 1;
      if (release !== null) {
        release.releases += 1;
        const deglued = m.dribbleTouch !== null && m.dribbleTouch.gid === relGid
          && m.dribbleTouch.until >= m.simTime;
        if (deglued) {
          release.deglue += 1;
          if (receipts) addReceipt(receipts, 'deglue', seed, tick, relGid, 'de-glue branch');
        } else if (newOwner === null) {
          const kicked = m.pendingPass !== null
            || m.ball.vel.x * m.ball.vel.x + m.ball.vel.y * m.ball.vel.y > SPEED_GATE * SPEED_GATE;
          if (kicked) {
            release.kick += 1;
            if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'strike/kick/pass/clearance');
          } else {
            release.ballWon += 1;
            if (receipts) addReceipt(receipts, 'ball-won', seed, tick, relGid, 'loose contest');
          }
        } else if (prevOwnerSide !== null && newOwner.side !== prevOwnerSide) {
          release.tackle += 1;
          if (receipts) addReceipt(receipts, 'tackle', seed, tick, relGid, 'won by other side');
        } else {
          release.kick += 1;
          if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'teammate received');
        }
        // the eye writes only the off-ball movement target and never ball.owner:
        // eye-attributable releases are 0 by construction and the classification above
        // is exhaustive so unattributable stays 0. Both asserted by the structural gate.
      }
    }

    const poss = m.possessionSide;
    if (poss !== -1) {
      if (lastValidPoss === -1) {
        spellStartTick = tick;
      } else if (poss !== lastValidPoss) {
        possessionSpells += 1;
        spellDurations.push((tick - spellStartTick) * DT);
        spellStartTick = tick;
        const loser = m.teams[lastValidPoss];
        const lx = loser.localX(m.ball.pos.x);
        if (lx < -REST_THIRD) turnoverOwnThird += 1;
        else if (lx > REST_THIRD) turnoverTheirThird += 1;
        else turnoverMiddle += 1;
      }
      lastValidPoss = poss;
    }

    for (const side of [0, 1] as const) {
      const now = m.teams[side].stats.crosses;
      if (now > crossesBefore[side]) {
        inFlight.push({
          side, deadline: m.simTime + CROSS_WINDOW_S,
          headersAtStart: m.teams[side].stats.headersWon, arrived: false, maxInBox: 0,
        });
      }
      crossesBefore[side] = now;
    }
    for (let i = inFlight.length - 1; i >= 0; i--) {
      const f = inFlight[i];
      const arrivedNow = (m.ball.owner !== null && !ownedBefore) || m.phase !== 'playing'
        || m.simTime >= f.deadline;
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
      const headed = m.teams[f.side].stats.headersWon > f.headersAtStart;
      if (headed) arrivalC3 += 1;
      else if (!f.arrived) arrivalC0 += 1;
      else if (f.maxInBox === 0) arrivalC1 += 1;
      else arrivalC2 += 1;
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

      for (const p of outfield) {
        const fam = familyOf(p, m);
        const prev = lastFamily.get(p.gid);
        if (prev !== fam) {
          if (prev !== undefined) {
            familyChanges[side] += 1;
            const start = dwellStart.get(p.gid);
            if (start !== undefined && prev !== 'ONBALL' && prev !== 'OTHER') {
              dwells[side].push((tick - start) * DT);
            }
          }
          lastFamily.set(p.gid, fam);
          dwellStart.set(p.gid, tick);
          lastTarget.delete(p.gid);
        }
        const target = stationTargetOf(p, t, opp, m, fam);
        if (target !== null) {
          const before = lastTarget.get(p.gid);
          if (before !== undefined) drifts[side].push(dist2(target, before) / SAMPLE_DT);
          lastTarget.set(p.gid, { x: target.x, y: target.y });
        } else lastTarget.delete(p.gid);
      }

      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) {
            pairs[side].push(dist2(outfield[i].pos, outfield[j].pos));
          }
        }
      }

      let near = 0;
      let mid = 0;
      for (const p of outfield) {
        const d = dist2(p.pos, m.ball.pos);
        if (d <= BALL_NEAR_M) near += 1;
        if (d <= BALL_MID_M) mid += 1;
      }
      ballNear[side].push(near);
      ballMid[side].push(mid);

      if (hasBall) {
        const deep = outfield.filter((p) => t.localX(p.pos.x) < -REST_THIRD);
        restCount[side].push(deep.length);
        restTicks[side] += 1;
        if (deep.length >= REST_BOTH) restBothTicks[side] += 1;
        if (deep.some((p) => p.index === 1)) restSlotTicks[side] += 1;
      }

      const crashLive = t.cornerCrash !== null && m.simTime < t.cornerCrash.until;
      const liveCorner = m.restart?.kind === 'corner' && m.restart.side === side;
      const runners = outfield.filter((p) => familyOf(p, m) === 'RUN'
        && t.arriver !== p.index && t.overlapper !== p.index
        && !((crashLive || liveCorner) && t.runners.has(p.index)));
      if (runners.length >= 2) {
        runTicks[side] += 1;
        const targets = runners.map((p) => runTarget(p, t, opp.players));
        let dup = false;
        for (let i = 0; i < targets.length && !dup; i++) {
          for (let j = i + 1; j < targets.length && !dup; j++) {
            if (dist2(targets[i], targets[j]) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) dupRunTicks[side] += 1;
      }

      if (outfield.length > 0) {
        const xs = outfield.map((p) => t.localX(p.pos.x));
        const ys = outfield.map((p) => p.pos.y);
        const acc = hasBall ? shape[side].inPoss : shape[side].outPoss;
        acc.cx += xs.reduce((s, x) => s + x, 0) / xs.length;
        acc.sx += sd(xs);
        acc.sy += sd(ys);
        acc.n += 1;
      }
    }
  }

  if (lastValidPoss !== -1) spellDurations.push((tick - spellStartTick) * DT);

  const minutes = (tick * DT) / 60;
  for (const side of [0, 1] as const) {
    const t = m.teams[side];
    const s = per[side];
    s.dwellMedian = quantile(dwells[side], 0.5);
    s.familyChangesPerBodyPerMin = minutes === 0 ? Number.NaN
      : familyChanges[side] / minutes / (TEAM_SIZE - 1);
    s.driftMedian = quantile(drifts[side], 0.5);
    s.driftFastShare = drifts[side].filter((v) => v > DRIFT_FAST_MS).length / (drifts[side].length || 1);
    s.spacingP10 = quantile(pairs[side], 0.1);
    s.spacingMedian = quantile(pairs[side], 0.5);
    s.spacingUnder4 = pairs[side].filter((v) => v < CLOSE_PAIR_M).length / (pairs[side].length || 1);
    s.ballNear = mean(ballNear[side]);
    s.ballMid = mean(ballMid[side]);
    s.restCount = mean(restCount[side]);
    s.restBothShare = restTicks[side] === 0 ? Number.NaN : restBothTicks[side] / restTicks[side];
    s.restSlotShare = restTicks[side] === 0 ? Number.NaN : restSlotTicks[side] / restTicks[side];
    s.dupRunShare = runTicks[side] === 0 ? Number.NaN : dupRunTicks[side] / runTicks[side];
    const face = (a: { cx: number; sx: number; sy: number; n: number }) => (a.n === 0
      ? { c: Number.NaN, x: Number.NaN, y: Number.NaN }
      : { c: a.cx / a.n, x: a.sx / a.n, y: a.sy / a.n });
    const ip = face(shape[side].inPoss);
    const op = face(shape[side].outPoss);
    s.shapeDeltaCentroid = ip.c - op.c;
    s.shapeDeltaSpreadX = ip.x - op.x;
    s.shapeDeltaSpreadY = ip.y - op.y;
    s.offsides = t.stats.offsides;
    s.goals = t.stats.goals;
    s.shots = t.stats.shots;
    s.shotsOnTarget = t.stats.shotsOnTarget;
    s.blocks = t.stats.blocks;
    s.crosses = t.stats.crosses;
    s.headersWon = t.stats.headersWon;
    s.longBalls = t.stats.longBalls;
    s.cutbacks = t.stats.cutbacks;
    s.passes = t.stats.passes;
    s.passesCompleted = t.stats.passesCompleted;
    s.passesForward = t.stats.passesForward;
    s.oneTwos = t.stats.oneTwos;
    s.bestPassChain = t.stats.bestPassChain;
    s.tackles = t.stats.tackles;
    s.interceptions = t.stats.interceptions;
    s.boxAtArrival = mean(boxAtArrival[side]);
    s.crossArrivals = boxAtArrival[side].length;
  }

  const sig = signatureOf(m);
  m.stationEye = null;
  return {
    seed, arm, sides: per, restartTicks, looseCount,
    possessionSpells, spellDurations,
    turnoverOwnThird, turnoverMiddle, turnoverTheirThird,
    arrivalC0, arrivalC1, arrivalC2, arrivalC3, signature: sig,
  };
};

// =============================================================================
// statistics — paired cluster bootstrap (cluster = match seed, B=2000, seed 99603)
// =============================================================================
interface PairedCI {
  n: number; control: number; treated: number; diff: number;
  lower: number; upper: number; relative: number; resolved: boolean;
}
/** P3a's paired cluster bootstrap: treated[i] − controlCol[i] index-aligned (paired seeds). */
const pairedCI = (treated: readonly number[], controlCol: readonly number[], offset: number): PairedCI => {
  const diffs: number[] = [];
  const ctrl: number[] = [];
  for (let i = 0; i < treated.length; i++) {
    const d = treated[i] - controlCol[i];
    if (Number.isFinite(d)) { diffs.push(d); ctrl.push(controlCol[i]); }
  }
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  const n = diffs.length;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += diffs[rng.int(0, n - 1)];
    draws.push(s / (n || 1));
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  const base = mean(ctrl.filter(Number.isFinite));
  const point = mean(diffs);
  const lower = at(0.025);
  const upper = at(0.975);
  return {
    n, control: round(base), treated: round(mean(treated.filter(Number.isFinite))),
    diff: round(point), lower: round(lower), upper: round(upper),
    relative: round(point / (Math.abs(base) || Number.NaN)),
    resolved: Number.isFinite(lower) && Number.isFinite(upper) && (lower > 0 || upper < 0),
  };
};

/** a cluster (=seed) bootstrap over per-seed values (one value per cluster) — the
 *  marginal-chain contrasts (P3p-2 verbatim). vals[i] = { cluster: seed, v: arm-a − arm-b }. */
const clusterBootstrap = (vals: { cluster: number; v: number }[], offset: number) => {
  const byC = new Map<number, number[]>();
  for (const x of vals) { const a = byC.get(x.cluster) ?? []; a.push(x.v); byC.set(x.cluster, a); }
  const clusters = [...byC.values()];
  const point = mean(vals.map((x) => x.v));
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let sum = 0; let cnt = 0;
    for (let i = 0; i < clusters.length; i++) { const c = clusters[rng.int(0, clusters.length - 1)]; for (const v of c) { sum += v; cnt += 1; } }
    if (cnt > 0) draws.push(sum / cnt);
  }
  draws.sort((a, b) => a - b);
  const lower = percentileOf(draws, 0.025);
  const upper = percentileOf(draws, 0.975);
  return { n: vals.length, point: round(point), lower: round(lower), upper: round(upper), halfWidth: round((upper - lower) / 2) };
};
const percentileOf = (sorted: readonly number[], q: number): number => (
  sorted.length === 0 ? Number.NaN
    : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]
);

// pairwise role-mix TV over the per-role destination mixes (P3a §4.3).
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
      const a = mixes[ROLE_AXIS[i]];
      const b = mixes[ROLE_AXIS[j]];
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

// =============================================================================
// seed layout (§7) + disjointness
// =============================================================================
const buildSeeds = (): number[] => {
  if (!IS_BATTERY) return Array.from({ length: MATCHES }, (_, k) => SMOKE_START + k);
  // 5 sub-blocks composing ONE arm's N seeds, block-major, paired across arms (§7).
  const K = Math.ceil(MATCHES / BATTERY_BLOCKS);
  const all: number[] = [];
  for (let b = 0; b < BATTERY_BLOCKS; b++) {
    for (let k = 0; k < K; k++) all.push(BATTERY_START + b * BATTERY_BLOCK_STRIDE + k);
  }
  return all.slice(0, MATCHES);
};

const seedDisjointness = (seeds: readonly number[]) => {
  // the P3p-2 run high-water is 11,100,119 (11.1M + k, k≤119); the released 10.6M–10.9M
  // reservation and every earlier band lie below. All P3p-3 seeds must exceed 11,100,119.
  const P3P2_RUN_HI = 11_100_119;
  const minSeed = seeds.length ? Math.min(...seeds) : Number.POSITIVE_INFINITY;
  const maxSeed = seeds.length ? Math.max(...seeds) : Number.NEGATIVE_INFINITY;
  const smokeOk = SMOKE_START > P3P2_RUN_HI && SMOKE_START + 39 < BATTERY_START;
  const seedsOk = minSeed > P3P2_RUN_HI;
  // stats seeds: bootstrap 99603 (reserved), permutation 99903 (fresh); disjoint from the
  // used set incl. P3p-2's 99703/99803 and the re-census 99403/99503.
  const usedStats = new Set([99703, 99803, 99403, 99503, 93003, 92110, 91110, 91100]);
  const boot: number = BOOTSTRAP_SEED;
  const perm: number = PERM_SEED;
  const statsSeeds = [boot, perm];
  const statsOk = boot === 99603 && perm === 99903
    && new Set(statsSeeds).size === 2
    && !statsSeeds.some((s) => usedStats.has(s));
  return {
    pass: smokeOk && seedsOk && statsOk,
    p3p2RunHighWater: P3P2_RUN_HI, smokeStart: SMOKE_START, batteryStart: BATTERY_START,
    seedMin: Number.isFinite(minSeed) ? minSeed : null, seedMax: Number.isFinite(maxSeed) ? maxSeed : null,
    bootstrapSeed: BOOTSTRAP_SEED, permutationSeed: PERM_SEED, statsOk,
    releasedReservation: '10.6M..10.9M (#111, RELEASED by #120.4)',
  };
};

// =============================================================================
// X-family — fingerprint, off-identity, seam, src-zero
// =============================================================================
const productionFingerprint = (): { fingerprint: string; pass: boolean } => {
  if (SKIP_FP) return { fingerprint: 'SKIPPED(V4P3P3_SKIP_FP=1; bounded-preflight only)', pass: true };
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  return { fingerprint, pass: fingerprint === FINGERPRINT_BASELINE };
};

const srcZero = () => {
  let srcDiff = '';
  try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
  return { pass: srcDiff === '', srcDiff };
};

/** X-OFF-IDENT: R0 (enriched, stationEye null) byte-identical to the same enriched world
 *  played with no stationEye ever touched, across the battery seeds (0 mismatches). */
const offIdentity = (seeds: readonly number[], r0Sigs: readonly string[]) => {
  let mismatches = 0;
  for (let i = 0; i < seeds.length; i++) {
    const bare = matchOf(seeds[i]); // never assigns stationEye — the pristine enriched world
    while (!bare.finished) bare.step(DT);
    if (signatureOf(bare) !== r0Sigs[i]) mismatches += 1;
  }
  return { seeds: seeds.length, mismatches, pass: mismatches === 0 };
};

/** X-SEAM: stationEye null on a fresh Match; scope gating honoured (body/team/both); the
 *  eye never overrides a ball-directed carrier (E-NONSTATION). P3a §4.4 verbatim. */
const xSeamCheck = (seed: number) => {
  const seamMatch = matchOf(seed);
  const freshNull = seamMatch.stationEye === null && seamMatch.stationEyeState.size === 0;
  const bodyGid = 1 + (seed % 5);
  const bodyM = matchOf(seed);
  bodyM.stationEye = { arm: 'neutral', scope: { kind: 'body', gid: bodyGid }, table: {}, v3: { roleTable, control } };
  let bodyScopeOk = true;
  let carrierNeverOverridden = true;
  const prevUntil = new Map<number, number>();
  for (let i = 0; i < 3000 && !bodyM.finished; i++) {
    bodyM.step(DT);
    for (const [gid, st] of bodyM.stationEyeState) {
      if (gid !== bodyGid) bodyScopeOk = false;
      // E-NONSTATION (actionExecutor L672/L955): the executor's whole eye block — the
      // decision AND the target write — is guarded by `ball.owner !== p`, so a body that
      // owns the ball is NEVER eye-overridden. A RETAINED window offset on a body that just
      // gained the ball is benign (it is never applied). A violation would be a FRESH eye
      // override DECISION (untilTick advanced, offset non-null) while the body owns the ball
      // — the guard makes that impossible; we assert it. (This refines p3a's retained-state
      // proxy, which false-fires on the benign retained offset — seed-flaky; see deviations.)
      const pv = prevUntil.get(gid);
      if (bodyM.ball.owner !== null && bodyM.ball.owner.gid === gid && st.offset !== null
        && (pv === undefined || st.untilTick > pv)) carrierNeverOverridden = false;
      prevUntil.set(gid, st.untilTick);
    }
  }
  const teamM = matchOf(seed);
  teamM.stationEye = { arm: 'neutral', scope: { kind: 'team', side: 0 }, table: {}, v3: { roleTable, control } };
  let teamScopeOk = true;
  for (let i = 0; i < 3000 && !teamM.finished; i++) {
    teamM.step(DT);
    for (const gid of teamM.stationEyeState.keys()) {
      if (Math.floor(gid / TEAM_SIZE) !== 0 || gid % TEAM_SIZE === 0) teamScopeOk = false;
    }
  }
  const bothM = matchOf(seed);
  bothM.stationEye = { arm: 'neutral', scope: { kind: 'both' }, table: {}, v3: { roleTable, control } };
  let bothActivated = false;
  for (let i = 0; i < 3000 && !bothM.finished; i++) {
    bothM.step(DT);
    if (bothM.stationEyeState.size > 0) { bothActivated = true; break; }
  }
  const pass = freshNull && bodyScopeOk && teamScopeOk && bothActivated && carrierNeverOverridden;
  return { pass, freshNull, bodyScopeOk, teamScopeOk, bothActivated, carrierNeverOverridden };
};

const stalePins = () => ({
  supportStaleTicks: SUPPORT_STALE_TICKS, widthStaleTicks: WIDTH_STALE_TICKS, lineStaleTicks: LINE_STALE_TICKS,
  pass: SUPPORT_STALE_TICKS === 30 && WIDTH_STALE_TICKS === 30 && LINE_STALE_TICKS === 30,
  note: '#48.4 the 30-tick freshness pins honoured at consumption (no re-cut).',
});

// =============================================================================
// SMOKE — the light science + the FROZEN N arithmetic (§6.4)
// =============================================================================
const LIGHT_KEYS = ['offsideRate', 'deliveryEvents', 'restartTicks', 'restSlotOccupancy'] as const;
type LightKey = (typeof LIGHT_KEYS)[number];

const computeSmokeScience = (seeds: readonly number[]) => {
  const medBySeed: Record<string, Map<number, LightMediators>> = {};
  const traceByArm: Record<string, StationEyeTrace | null> = {};
  const wallByArm: Record<string, number> = {};
  for (const arm of ALL_ARMS) { medBySeed[arm] = new Map(); traceByArm[arm] = arm === 'R0' ? null : newStationEyeTrace(); wallByArm[arm] = 0; }
  for (const seed of seeds) {
    for (const arm of ALL_ARMS) {
      const r = playArmLight(seed, arm);
      medBySeed[arm].set(seed, r.mediators);
      wallByArm[arm] += r.wallMs;
      if (r.trace !== null && traceByArm[arm] !== null) addTrace(traceByArm[arm]!, r.trace);
    }
  }
  const perArmMediators = Object.fromEntries(ALL_ARMS.map((arm) => [arm, Object.fromEntries(
    LIGHT_KEYS.map((mk) => [mk, round(mean(seeds.map((s) => medBySeed[arm].get(s)![mk]).filter(Number.isFinite)), 4)]),
  )])) as Record<string, Record<LightKey, number>>;

  // the paired R3p − R0 per-seed differences per light key (the sizing input).
  const pairedDiffs = (mk: LightKey): number[] => seeds
    .map((s) => medBySeed['R3p'].get(s)![mk] - medBySeed['R0'].get(s)![mk])
    .filter(Number.isFinite);
  const sizingStat = (mk: LightKey, offset: number) => {
    const diffs = pairedDiffs(mk);
    const vals = seeds
      .map((s) => ({ cluster: s, v: medBySeed['R3p'].get(s)![mk] - medBySeed['R0'].get(s)![mk] }))
      .filter((x) => Number.isFinite(x.v));
    const ci = clusterBootstrap(vals, offset);
    return { key: mk, n: diffs.length, point: round(mean(diffs), 4), sd: round(sd(diffs), 4), ci };
  };
  const restart = sizingStat('restartTicks', 400);
  const offside = sizingStat('offsideRate', 401);
  const delivery = sizingStat('deliveryEvents', 402);
  const rest = sizingStat('restSlotOccupancy', 403);
  const r0RestartMean = perArmMediators['R0'].restartTicks;

  const ledger = Object.fromEntries(ARMED_ARMS.map((a) => [a, ledgerOf(traceByArm[a]!)]));
  return { perArmMediators, restart, offside, delivery, rest, r0RestartMean, ledger, wallByArm };
};

/** the FROZEN restart-gate N arithmetic (§6.1/§6.4, #121). SD-driven, deterministic. */
const computeRestartSizing = (sci: ReturnType<typeof computeSmokeScience>) => {
  const B = sci.r0RestartMean * RESTART_BAND_REL;             // the +10 % band edge (re-anchored, #68.2)
  const residual = sci.restart.point;                          // R3p − R0 restart residual (ticks)
  const sdDiff = sci.restart.sd;                               // per-match SD of the paired diff
  const gap = B - residual;                                    // signed gap to the band edge
  const absGap = Math.abs(gap);
  const seSmoke = sdDiff / Math.sqrt(Math.max(1, sci.restart.n)); // SE at the smoke N
  // N* to resolve the gate at ~95 % power: SE_N = sd/sqrt(N) ≤ absGap/POWER_Z.
  const need = absGap > 0 ? Math.pow((sdDiff * POWER_Z) / absGap, 2) : Number.POSITIVE_INFINITY;
  const nStar = Number.isFinite(need) ? Math.max(N_STEP, Math.ceil(need / N_STEP) * N_STEP) : Number.POSITIVE_INFINITY;
  return {
    bandEdgeRel: RESTART_BAND_REL, powerZ: POWER_Z, z975: Z_975,
    r0RestartMean: round(sci.r0RestartMean, 4), bandEdgeTicks: round(B, 4),
    residualTicks: round(residual, 4), residualRelativePct: round(100 * residual / (sci.r0RestartMean || 1), 4),
    sdPairedDiff: round(sdDiff, 4), pairedCI: sci.restart.ci, seSmoke: round(seSmoke, 4),
    gapToBandEdgeTicks: round(gap, 4),
    residualVsBandEdge: gap > 0 ? 'below (cure plausible — the CI can fall under +10 %)'
      : 'at/above (cure implausible — the residual sits at/over +10 %)',
    needRaw: Number.isFinite(need) ? round(need, 2) : null,
    nStar: Number.isFinite(nStar) ? nStar : null,
  };
};

/** the WALL-DERIVED N_MAX + the binding N + the reduced-power disclosure (§6.4, #121).
 *  MACHINE-DEPENDENT (one-shot at the smoke) ⇒ STRIPPED from the X-DET compare + the SHA. */
const computeWallDerived = (
  sci: ReturnType<typeof computeSmokeScience>, restart: ReturnType<typeof computeRestartSizing>,
) => {
  const nSeeds = Math.max(1, MATCHES);
  const perArmPerMatchWallMs = Object.fromEntries(ALL_ARMS.map((a) => [a, round((sci.wallByArm[a] ?? 0) / nSeeds, 2)]));
  const perSetPerMatchWallMs = round(ALL_ARMS.reduce((s, a) => s + (sci.wallByArm[a] ?? 0) / nSeeds, 0), 2);
  // projected total battery wall at N seeds/arm: per-set wall × N × 2 (X-DET). N_MAX =
  // largest 200-step N with that ≤ 36 h, capped at 8,000.
  const perSetTwice = perSetPerMatchWallMs * XDET_FACTOR;
  const nMaxWallRaw = perSetTwice > 0 ? Math.floor((WALL_BUDGET_MS / perSetTwice) / N_STEP) * N_STEP : N_CAP;
  const nMaxWall = Math.max(0, nMaxWallRaw);
  const nMax = Math.min(nMaxWall, N_CAP);
  const nStar = restart.nStar;
  const nBinding = nStar === null ? nMax : Math.min(nStar, nMax);
  const reducedPowerDisclosure = nStar === null ? true : nStar > nMax;
  // projected restart power at the binding N: Φ(absGap·sqrt(N)/sd − 1.96).
  const absGap = Math.abs(restart.gapToBandEdgeTicks);
  const seAtBinding = restart.sdPairedDiff / Math.sqrt(Math.max(1, nBinding));
  const projectedRestartPower = seAtBinding > 0 ? round(phi(absGap / seAtBinding - Z_975), 4) : null;
  const projectedTotalWallHoursAtBinding = round(perSetTwice * nBinding / (3600 * 1000), 3);
  return {
    perArmPerMatchWallMs, perSetPerMatchWallMs, xDetFactor: XDET_FACTOR,
    wallBudgetHours: WALL_BUDGET_HOURS, nCap: N_CAP, nStep: N_STEP,
    nMaxWall, nMax, nStar, nBinding, reducedPowerDisclosure,
    projectedRestartPowerAtBinding: projectedRestartPower,
    projectedTotalWallHoursAtBinding,
    note: 'MACHINE-DEPENDENT (measured once at the smoke); stripped from the X-DET / SHA. The '
      + 'per-set wall is the LIGHT-instrument 5-arm wall — a LOWER bound on the full-battery '
      + 'per-set wall (the 6 Hz SideRow/shape/release sampling adds overhead) ⇒ treat N_MAX as a '
      + 'ceiling and the resident (#49.5) monitors live wall. N fixed before the run (#105.4).',
  };
};

// =============================================================================
// BATTERY — the whole-match verdict form (§4) + the marginal chain (§5)
// =============================================================================
const limbValue = (r: MatchRow, key: LightKey): number => {
  switch (key) {
    case 'restartTicks': return r.restartTicks;
    case 'offsideRate': return r.sides[0].offsides + r.sides[1].offsides;
    case 'deliveryEvents':
      return (r.sides[0].longBalls + r.sides[0].crosses + r.sides[0].cutbacks)
        + (r.sides[1].longBalls + r.sides[1].crosses + r.sides[1].cutbacks);
    case 'restSlotOccupancy':
      return mean([r.sides[0].restSlotShare, r.sides[1].restSlotShare].filter(Number.isFinite));
  }
};

const computeBattery = (seeds: readonly number[]) => {
  // one shared trace per armed arm; a release ledger per PARTIAL arm (§8); perRole/
  // exclusion/receipts on R3p (the reference arm the shape/role gates bind on).
  const traces: Record<Arm, StationEyeTrace | null> = {
    R0: null, R3v3: newStationEyeTrace(), 'R3p-lawOnly': newStationEyeTrace(),
    'R3p-noOffside': newStationEyeTrace(), R3p: newStationEyeTrace(),
  };
  const releases: Record<string, ReleaseLedger> = Object.fromEntries(PARTIAL_ARMS.map((a) => [a, newReleaseLedger()]));
  const exclusion = newExclusion();
  const perRole = newPerRole();
  const receipts: ReceiptBook = {};

  const rows: Record<Arm, MatchRow[]> = { R0: [], R3v3: [], 'R3p-lawOnly': [], 'R3p-noOffside': [], R3p: [] };
  for (const seed of seeds) {
    for (const arm of ALL_ARMS) {
      const isR3p = arm === 'R3p';
      const rel = (releases[arm] ?? null);
      rows[arm].push(runMatch(
        seed, arm, traces[arm], rel,
        isR3p ? exclusion : null, isR3p ? perRole : null, isR3p ? receipts : null,
      ));
    }
  }

  const colSide = (rr: MatchRow[], side: 0 | 1, sel: (s: SideRow) => number): number[] => rr.map((r) => sel(r.sides[side]));
  const colSum = (rr: MatchRow[], sel: (s: SideRow) => number): number[] => rr.map((r) => sel(r.sides[0]) + sel(r.sides[1]));
  const colAvg = (rr: MatchRow[], sel: (s: SideRow) => number): number[] => rr.map((r) => (sel(r.sides[0]) + sel(r.sides[1])) / 2);
  const boxOf = (rr: MatchRow[]) => rr.map((r) => {
    const a = r.sides[0].boxAtArrival; const b = r.sides[1].boxAtArrival;
    const na = r.sides[0].crossArrivals; const nb = r.sides[1].crossArrivals;
    if (na + nb === 0) return Number.NaN;
    return ((Number.isFinite(a) ? a * na : 0) + (Number.isFinite(b) ? b * nb : 0)) / (na + nb);
  });

  let offset = 0;

  // --- the watchability limbs, treated arm vs THIS battery's paired R0 (#68.2) ---
  const degenLimb = (treated: MatchRow[], sel: (s: SideRow) => number, rel: number, sign: 1 | -1) => {
    const s0 = pairedCI(colSide(treated, 0, sel), colSide(rows.R0, 0, sel), offset++);
    const s1 = pairedCI(colSide(treated, 1, sel), colSide(rows.R0, 1, sel), offset++);
    const fires = (c: PairedCI) => (sign === 1 ? c.lower > 0 && c.relative >= rel : c.upper < 0 && c.relative <= rel);
    return { side0: s0, side1: s1, band: rel, fires: fires(s0) || fires(s1) };
  };
  const canary = (treated: MatchRow[], col: (rr: MatchRow[]) => number[], rel: number, sign: 1 | -1) => {
    const ci = pairedCI(col(treated), col(rows.R0), offset++);
    const fires = sign === 1 ? ci.lower > 0 && ci.relative >= rel : ci.upper < 0 && ci.relative <= rel;
    return { ...ci, band: rel, fires };
  };
  const watchability = (treated: MatchRow[]) => ({
    scramble: { instrument: 'I4 own-within-5m', p0Ref: P0_I4_OWN5, ...degenLimb(treated, (s) => s.ballNear, DEGEN_SCRAMBLE_REL, 1) },
    pileup: { instrument: 'I3 share <4m', p0Ref: P0_I3_UNDER4, ...degenLimb(treated, (s) => s.spacingUnder4, DEGEN_PILEUP_REL, 1) },
    restDefence: { instrument: 'I5(b) designated slot', p0Ref: P0_I5_SLOT, ...degenLimb(treated, (s) => s.restSlotShare, DEGEN_RESTDEF_REL, -1) },
    offside: canary(treated, (rr) => colSum(rr, (s) => s.offsides), CANARY_OFFSIDE_REL, 1),
    box: canary(treated, boxOf, CANARY_BOX_REL, -1),
    restart: canary(treated, (rr) => rr.map((r) => r.restartTicks), CANARY_RESTART_REL, 1),
  });
  const r3pLimbs = watchability(rows.R3p);         // the binding arm (the cure gates read here)
  const r3v3Limbs = watchability(rows.R3v3);       // X-CORPUS-IDENT sanity (must reproduce P3a)

  // --- the §2 equilibrium band (P3a §4.2), R3p vs the C1 absolute band + R0 drift ---
  const matchCount = seeds.length;
  const perMatchRate = (rr: MatchRow[], sel: (s: SideRow) => number): number =>
    rr.reduce((acc, r) => acc + sel(r.sides[0]) + sel(r.sides[1]), 0) / (matchCount || 1);
  const bandDim = (key: keyof typeof BAND_BASELINE, sel: (s: SideRow) => number) => {
    const baseline = BAND_BASELINE[key];
    const tol = BAND_TOLERANCE[key];
    const lo = baseline * (1 - tol);
    const hi = baseline * (1 + tol);
    const r3p = perMatchRate(rows.R3p, sel);
    const r0 = perMatchRate(rows.R0, sel);
    return {
      baseline, tolerance: tol, lo: round(lo), hi: round(hi), r3p: round(r3p), r0: round(r0),
      relativeVsBaseline: round(r3p / baseline - 1), r0RelativeVsBaseline: round(r0 / baseline - 1),
      insideBand: r3p >= lo && r3p <= hi, r0InsideBand: r0 >= lo && r0 <= hi,
    };
  };
  const band = {
    goals: bandDim('goals', (s) => s.goals),
    crosses: bandDim('crosses', (s) => s.crosses),
    headers: bandDim('headers', (s) => s.headersWon),
    longBalls: bandDim('longBalls', (s) => s.longBalls),
    cutbacks: bandDim('cutbacks', (s) => s.cutbacks),
  };
  const deliveryAllInside = band.headers.insideBand && band.longBalls.insideBand && band.cutbacks.insideBand;

  // --- the shape adjudicators (P3a §4.3), R3p vs R0 (must-not-regress) ---
  const pooledCI = (rr: MatchRow[], sel: (s: SideRow) => number) => pairedCI(colAvg(rr, sel), colAvg(rows.R0, sel), offset++);
  const shapeArm = (rr: MatchRow[]) => ({
    i3SpacingP10: pooledCI(rr, (s) => s.spacingP10),
    i3SpacingMedian: pooledCI(rr, (s) => s.spacingMedian),
    i3SpacingUnder4: pooledCI(rr, (s) => s.spacingUnder4),
    i5RestBothShare: pooledCI(rr, (s) => s.restBothShare),
    i5RestSlotShare: pooledCI(rr, (s) => s.restSlotShare),
    i6DupRunShare: pooledCI(rr, (s) => s.dupRunShare),
    i7ShapeSpreadX: pooledCI(rr, (s) => s.shapeDeltaSpreadX),
    i7ShapeSpreadY: pooledCI(rr, (s) => s.shapeDeltaSpreadY),
  });
  const shapeR3p = shapeArm(rows.R3p);
  const roleMix = roleMixTV(perRole);
  const perRoleReport = Object.fromEntries(ROLE_AXIS.map((r) => {
    const led = perRole[r];
    return [r, { decisions: led.decisions, deviations: led.deviations, deviationRate: round(led.decisions === 0 ? Number.NaN : led.deviations / led.decisions) }];
  }));

  // --- the marginal chain (§5), telescoping on the COMPLETE-seed set per key (§2.1) ---
  const orderedArms: readonly Arm[] = ['R0', 'R3v3', 'R3p-lawOnly', 'R3p-noOffside', 'R3p'];
  const rowBySeed: Record<Arm, Map<number, MatchRow>> = {
    R0: new Map(), R3v3: new Map(), 'R3p-lawOnly': new Map(), 'R3p-noOffside': new Map(), R3p: new Map(),
  };
  for (const arm of ALL_ARMS) for (const r of rows[arm]) rowBySeed[arm].set(r.seed, r);
  const marginalChain = Object.fromEntries(LIGHT_KEYS.map((key) => {
    const complete = seeds.filter((s) => orderedArms.every((a) => Number.isFinite(limbValue(rowBySeed[a].get(s)!, key))));
    const diffCI = (aArm: Arm, bArm: Arm) => clusterBootstrap(
      complete.map((s) => ({ cluster: s, v: limbValue(rowBySeed[aArm].get(s)!, key) - limbValue(rowBySeed[bArm].get(s)!, key) })), offset++,
    );
    const diseasePlainEye = diffCI('R3v3', 'R0');       // the plain-eye disease
    const lawMarginal = diffCI('R3p-lawOnly', 'R3v3');   // the LAW's marginal cure
    const deliveryMarginal = diffCI('R3p-noOffside', 'R3p-lawOnly'); // the DELIVERY bit's marginal
    const offsideMarginal = diffCI('R3p', 'R3p-noOffside');         // the OFFSIDE bit's marginal
    const fullResidual = diffCI('R3p', 'R0');           // the full partial-eye effect
    // telescoping (§2.1): the four marginals sum EXACTLY to R3p−R0 at the point-estimate
    // level (mean linearity on the SAME complete-seed set). Checked on RAW (unrounded) means
    // — the reported CI points are rounded per-contrast, whose sum can drift at the 6th dp.
    const rawDiff = (aArm: Arm, bArm: Arm) => mean(complete.map((s) => limbValue(rowBySeed[aArm].get(s)!, key) - limbValue(rowBySeed[bArm].get(s)!, key)));
    const rawSum = rawDiff('R3v3', 'R0') + rawDiff('R3p-lawOnly', 'R3v3')
      + rawDiff('R3p-noOffside', 'R3p-lawOnly') + rawDiff('R3p', 'R3p-noOffside');
    const rawFull = rawDiff('R3p', 'R0');
    return [key, {
      completeSeeds: complete.length,
      diseasePlainEye, lawMarginal, deliveryMarginal, offsideMarginal, fullResidual,
      telescope: { sumOfMarginals: round(rawSum, 6), fullResidual: round(rawFull, 6), exact: Math.abs(rawSum - rawFull) < 1e-9 },
    }];
  }));

  // --- the REPORTED rest residual: R3p − R0 (side-averaged) + the R3p − R3v3 change ---
  const restResidualR3pR0 = pooledCI(rows.R3p, (s) => s.restSlotShare);
  const restResidualR3pR3v3 = pairedCI(colAvg(rows.R3p, (s) => s.restSlotShare), colAvg(rows.R3v3, (s) => s.restSlotShare), offset++);

  // --- structural: eye-never-touches-ball on EVERY partial arm (§8) ---
  const releaseByArm = Object.fromEntries(PARTIAL_ARMS.map((a) => [a, releases[a]]));
  const eyeNeverTouchesBall = PARTIAL_ARMS.every((a) => releases[a].eyeAttributable === 0 && releases[a].unattributable === 0);

  // --- the consumption ledger per armed arm (§2.2: lawOnly reads ZERO children, etc.) ---
  const ledger = Object.fromEntries(ARMED_ARMS.map((a) => [a, ledgerOf(traces[a]!)]));
  const ledgerStructural = {
    lawOnlyReadsZeroChildren: !ledger['R3p-lawOnly'].readsDeliveryChildren && !ledger['R3p-lawOnly'].readsOffsideChildren,
    noOffsideReadsDeliveryOnly: ledger['R3p-noOffside'].readsDeliveryChildren && !ledger['R3p-noOffside'].readsOffsideChildren,
    r3pReadsBoth: ledger.R3p.readsDeliveryChildren && ledger.R3p.readsOffsideChildren,
  };

  // --- the PRE-DECLARED verdict form reading (§4) ---
  const shapeRegressed =
    r3pLimbs.pileup.fires
    || !(Number.isFinite(roleMix.mean) && roleMix.mean >= INCUMBENT_ROLE_TV)
    || !eyeNeverTouchesBall
    || (shapeR3p.i6DupRunShare.resolved && shapeR3p.i6DupRunShare.diff > 0)     // duplicates ROSE = clumping
    || (shapeR3p.i3SpacingMedian.resolved && shapeR3p.i3SpacingMedian.diff < 0); // median CLOSED = clumping
  const mustNotRegressFires = r3pLimbs.scramble.fires || r3pLimbs.pileup.fires || r3pLimbs.box.fires;

  const verdictReading = {
    restLimb: {
      instrument: 'DEGEN-RESTDEF I5(b)', disposition: 'REPORTED — the measured RESIDUAL (the A4 target size, #109.3); NOT a stop',
      fires: r3pLimbs.restDefence.fires, bindsOn: 'R3p−R0 (every arm reported)',
      magnitudeR3pMinusR0: restResidualR3pR0, changeR3pMinusR3v3: restResidualR3pR3v3,
    },
    cureGates: {
      inSupportLaw: {
        gate: 'C-RESTART', bindsOn: 'R3p−R0', band: '+10 %', hot: r3pLimbs.restart.fires,
        verdict: r3pLimbs.restart.fires ? 'RETURNS (in-support law → the commander)' : 'CERTIFIED (quiet at the band)',
        ci: r3pLimbs.restart, note: 'the band-edge exam (#120.2)',
      },
      offsideBit: {
        gate: 'C-OFFSIDE', bindsOn: 'R3p−R0', band: '+10 %', hot: r3pLimbs.offside.fires,
        verdict: r3pLimbs.offside.fires ? 'RETURNS (offside bit → A4/absence, #116.2(iii))' : 'CERTIFIED (quiet at the band)',
        ci: r3pLimbs.offside, note: '#116.2 the fork-grain sign INVERTED — a null/worsening is a live outcome',
      },
      deliveryBit: {
        gate: '§2 delivery band (headers/long-balls/cutbacks, ±25 % C1)', bindsOn: 'R3p', allInside: deliveryAllInside,
        verdict: deliveryAllInside ? 'CERTIFIED (all three inside the C1 band)' : 'RETURNS (delivery bit — a rate still outside)',
        band: { headers: band.headers, longBalls: band.longBalls, cutbacks: band.cutbacks },
      },
    },
    mustNotRegress: {
      scramble: r3pLimbs.scramble.fires, pileup: r3pLimbs.pileup.fires, box: r3pLimbs.box.fires,
      anyFires: mustNotRegressFires, disposition: 'a firing = the remedies introduced a new disease ⇒ STOP',
    },
    shapeMustNotRegress: {
      regressed: shapeRegressed, roleMixTV: roleMix.mean, incumbentRef: INCUMBENT_ROLE_TV,
      roleMixHolds: Number.isFinite(roleMix.mean) && roleMix.mean >= INCUMBENT_ROLE_TV,
      eyeBallLedgerZero: eyeNeverTouchesBall,
      i6DupRunShare: shapeR3p.i6DupRunShare, i3SpacingMedian: shapeR3p.i3SpacingMedian,
      disposition: 'a regression toward CLUMPING ⇒ STOP OUTRIGHT (#88.2 non-negotiable)',
    },
    goalsCrossesReported: { goals: band.goals, crosses: band.crosses },
  };

  return {
    rows, offset,
    watchability: { r3p: r3pLimbs, r3v3Sanity: r3v3Limbs },
    equilibriumBand: { ...band, deliveryAllInside, holds: Object.values(band).every((d) => d.insideBand), r0Holds: Object.values(band).every((d) => d.r0InsideBand) },
    shapeAdjudicators: shapeR3p,
    perRole: { byRole: perRoleReport, roleMixTV: { ...roleMix, incumbentRef: INCUMBENT_ROLE_TV, moreDistinctThanIncumbent: Number.isFinite(roleMix.mean) && roleMix.mean >= INCUMBENT_ROLE_TV } },
    marginalChain,
    consumptionLedger: ledger, ledgerStructural,
    structural: {
      releaseByArm, eyeNeverTouchesBall, exclusionCounts: exclusion,
      receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
    },
    verdictReading, shapeRegressed, mustNotRegressFires,
    r0Sigs: rows.R0.map((r) => r.signature),
  };
};

// =============================================================================
// X-DET strip + emit
// =============================================================================
const VOLATILE_KEYS = new Set(['wallByArm', 'wallCost', 'wallDerived', 'perArmPerMatchWallMs', 'perSetPerMatchWallMs']);
const stripVolatile = (o: unknown): string => JSON.stringify(o, (k, v) => (VOLATILE_KEYS.has(k) || k.toLowerCase().includes('wall') ? undefined : v));

const emit = (output: Record<string, unknown>, path: string): void => {
  if (PREFLIGHT && isCanonicalRepoPath(path)) {
    throw new Error(`bounded-preflight (caps active) must NOT write the canonical repo path '${path}'; redirect via V4P3P3_OUT_${IS_BATTERY ? 'BATTERY' : 'SMOKE'}=/tmp/...`);
  }
  writeFileSync(path, `${JSON.stringify(output, null, 2)}\n`);
};

// =============================================================================
// main
// =============================================================================
function run(): void {
  const seeds = buildSeeds();
  let head: string;
  try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

  const commonParams = {
    mode: MODE, seedStart: IS_BATTERY ? BATTERY_START : SMOKE_START,
    matchesRequested: N_REQUESTED, matchesRun: MATCHES,
    matchCap: Number.isFinite(MATCH_CAP) ? MATCH_CAP : null,
    matchDurationOverride: MATCH_DURATION_ENV !== undefined ? Number(MATCH_DURATION_ENV) : null,
    seedMin: seeds.length ? Math.min(...seeds) : null, seedMax: seeds.length ? Math.max(...seeds) : null,
    seedFormula: IS_BATTERY ? '11,200,000 + blockIndex*100,000 + k, blockIndex 0..4, K=ceil(N/5), first N (5 sub-blocks, paired)' : '11,150,000 + k, k 0..39',
    arms: ALL_ARMS, armedArms: ARMED_ARMS, partialArms: PARTIAL_ARMS,
    clusterUnit: 'match seed (paired across all five arms)',
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES, permutationSeedReserved: PERM_SEED,
    sampleEvery: SAMPLE_EVERY, sampleHz: round(1 / SAMPLE_DT, 3),
    world: 'ENRICHED', flags: CENSUS_FLAGS, preflight: PREFLIGHT, head,
    tableSource: MERGED_PATH, controlSource: CONTROL_PATH, controlSha: rawControl.sha256, controlPooled: rawControl.pooledControl,
  };

  const disjoint = seedDisjointness(seeds);
  const xMergeSha = xMergeShaPerArm();
  const src = srcZero();
  const pins = stalePins();

  if (MODE === 'smoke') {
    const sci1 = computeSmokeScience(seeds);
    const sci2 = computeSmokeScience(seeds);
    const restartSizing = computeRestartSizing(sci1);
    const deterministic = stripVolatile({ ...sci1, restartSizing }) === stripVolatile({ ...sci2, restartSizing: computeRestartSizing(sci2) });
    const wallDerived = computeWallDerived(sci1, restartSizing);
    const fp = productionFingerprint();

    const sizing = {
      rule: 'N* = smallest 200-step match count whose smoke-measured restart SE_N (=SD_pairedDiff/√N) '
        + 'resolves the restart cure gate at the (#68.2-re-anchored) +10 % band edge at ~95 % power '
        + '(SE_N ≤ g/3.605), CAPPED at N_MAX (WALL-DERIVED: largest 200-step N with per-set wall × N × 2 '
        + '(X-DET) ≤ 36 h, itself ≤ 8,000/arm). If N* > N_MAX the cap binds and the reduced-power reading '
        + 'is disclosed BEFORE the gate-bearing run (#105.4). #121-AMENDED (2000/arm superseded).',
      restart: restartSizing,
      otherGateSDs: {
        offside: { point: sci1.offside.point, sd: sci1.offside.sd, ci: sci1.offside.ci, note: 'C-OFFSIDE resolves at ≤800/arm (§6.2)' },
        delivery: { point: sci1.delivery.point, sd: sci1.delivery.sd, ci: sci1.delivery.ci, note: 'delivery band resolves at ≤800/arm (§6.2)' },
        rest: { point: sci1.rest.point, sd: sci1.rest.sd, ci: sci1.rest.ci, note: 'DEGEN-RESTDEF over-powered at any N≥~100 (light surrogate, §6.2)' },
      },
      wallDerived,
    };

    const gates: Record<string, boolean> = {
      xMergeSha: xMergeSha.pass, xFpProd: fp.pass, xSrcZero: src.pass,
      seedDisjoint: disjoint.pass, xDet: deterministic, stalePins: pins.pass,
    };
    const output = {
      experiment: 'STAGE3-V4-P3p-3 SIZING SMOKE (the attribution-chain five arms)',
      authority: 'STAGE3-V4-P3P3-BATTERY §6.4 (#121-AMENDED) · rulings #120/#121',
      parameters: commonParams,
      perArmMediators: sci1.perArmMediators,
      sizing, consumptionLedger: sci1.ledger,
      xMergeSha, seedDisjointness: disjoint, fingerprint: { ...fp, baseline: FINGERPRINT_BASELINE },
      xSrcZero: src, stalePins: pins,
      wallCost: { perArmTotalMs: sci1.wallByArm, matchesRun: MATCHES },
      gates, deterministic, verdict: 'SIZING SMOKE',
      deviations: DEVIATIONS,
    };
    const sha256 = createHash('sha256').update(stripVolatile({ ...output, sha256: undefined })).digest('hex');
    emit({ ...output, sha256 }, SMOKE_OUT);
    logSmoke(sizing, gates, deterministic, sha256, sci1);
  } else {
    const b1 = computeBattery(seeds);
    const b2 = computeBattery(seeds);
    const deterministic = stripVolatile(b1) === stripVolatile(b2);
    const fp = productionFingerprint();
    const xoff = offIdentity(seeds, b1.r0Sigs);
    const seam = xSeamCheck(seeds[0]);

    const hardGates: Record<string, boolean> = {
      xMergeSha: xMergeSha.pass, xFpProd: fp.pass, xOffIdent: xoff.pass, xSeam: seam.pass,
      xDet: deterministic, xSrcZero: src.pass, seedDisjoint: disjoint.pass,
      eyeNeverTouchesBall: b1.structural.eyeNeverTouchesBall,
      ledgerStructural: b1.ledgerStructural.lawOnlyReadsZeroChildren && b1.ledgerStructural.noOffsideReadsDeliveryOnly && b1.ledgerStructural.r3pReadsBoth,
    };
    const hardGatesPass = Object.values(hardGates).every(Boolean);

    // the frozen per-remedy stop mapping (§4.1) — the DISPOSITION, not a stage pass/fail.
    const stageDisposition = !hardGatesPass
      ? 'STOP — a HARD X-family / structural gate failed (the measurement is invalid)'
      : b1.shapeRegressed
        ? 'STOP OUTRIGHT — the #88.2 shape cure regressed toward clumping'
        : b1.mustNotRegressFires
          ? 'STOP — a must-not-regress watchability limb fired (a remedy introduced a new disease)'
          : `MEASUREMENT COMPLETE — law ${b1.verdictReading.cureGates.inSupportLaw.hot ? 'RETURNS' : 'CERTIFIED'}`
            + ` · delivery ${b1.verdictReading.cureGates.deliveryBit.allInside ? 'CERTIFIED' : 'RETURNS'}`
            + ` · offside ${b1.verdictReading.cureGates.offsideBit.hot ? 'RETURNS' : 'CERTIFIED'}`
            + ' · rest residual REPORTED (the A4 target size)';

    const { rows, offset, r0Sigs, ...bodyBattery } = b1;
    void rows; void offset; void r0Sigs;
    const output = {
      experiment: 'STAGE3-V4-P3p-3 MEASUREMENT BATTERY (the attribution-chain five arms)',
      authority: 'STAGE3-V4-P3P3-BATTERY §§2-8 (#121-AMENDED) · rulings #120/#121',
      parameters: commonParams,
      ...bodyBattery,
      xMergeSha, seedDisjointness: disjoint, fingerprint: { ...fp, baseline: FINGERPRINT_BASELINE },
      offIdentity: xoff, seam, xSrcZero: src, stalePins: pins,
      hardGates, hardGatesPass, deterministic, stageDisposition,
      verdict: hardGatesPass ? 'MEASUREMENT (gates valid — read §4)' : 'GATES FAIL',
      deviations: DEVIATIONS,
    };
    const sha256 = createHash('sha256').update(stripVolatile({ ...output, sha256: undefined })).digest('hex');
    emit({ ...output, sha256 }, BATTERY_OUT);
    logBattery(output, hardGates, deterministic, sha256);
  }
}

function logSmoke(
  sizing: { restart: ReturnType<typeof computeRestartSizing>; wallDerived: ReturnType<typeof computeWallDerived> },
  gates: Record<string, boolean>, det: boolean, sha256: string, sci: ReturnType<typeof computeSmokeScience>,
): void {
  const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
  const r = sizing.restart; const w = sizing.wallDerived;
  process.stderr.write(
    `STAGE3-V4-P3p-3 SMOKE · matches ${MATCHES} × 5 arms`
    + ` · R0restart ${r.r0RestartMean} edge +${r.bandEdgeTicks} · residual ${r.residualTicks} (${r.residualRelativePct}%) SD ${r.sdPairedDiff}`
    + ` · gap ${r.gapToBandEdgeTicks} (${r.residualVsBandEdge.split(' ')[0]}) · N* ${r.nStar}`
    + ` · perSetWall ${w.perSetPerMatchWallMs}ms N_MAX ${w.nMax} (wall ${w.nMaxWall}) N_bind ${w.nBinding} redPow ${w.reducedPowerDisclosure} pow ${w.projectedRestartPowerAtBinding}`
    + ` · offSD ${sci.offside.sd} delivSD ${sci.delivery.sd} restSD ${sci.rest.sd}`
    + ` · X-MERGE ${gates.xMergeSha} fp ${gates.xFpProd} det ${det} SHA ${sha256.slice(0, 12)}`
    + (failed.length ? ` · FAILED ${failed.join(',')}` : '') + '\n',
  );
}

function logBattery(
  output: { stageDisposition: string; verdictReading: ReturnType<typeof computeBattery>['verdictReading']; marginalChain: Record<string, { telescope: { exact: boolean } }>; perRole: { roleMixTV: { mean: number } }; hardGatesPass: boolean; structural: { eyeNeverTouchesBall: boolean } },
  gates: Record<string, boolean>, det: boolean, sha256: string,
): void {
  const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
  const vr = output.verdictReading;
  const teleAll = Object.values(output.marginalChain).every((m) => m.telescope.exact);
  process.stderr.write(
    `STAGE3-V4-P3p-3 BATTERY · ${output.hardGatesPass ? 'GATES VALID' : 'GATES FAIL'}`
    + ` · ${output.stageDisposition}`
    + ` · law hot ${vr.cureGates.inSupportLaw.hot} offside hot ${vr.cureGates.offsideBit.hot} deliv inside ${vr.cureGates.deliveryBit.allInside}`
    + ` · restResid R3p−R0 ${vr.restLimb.magnitudeR3pMinusR0.diff} [${vr.restLimb.magnitudeR3pMinusR0.lower},${vr.restLimb.magnitudeR3pMinusR0.upper}]`
    + ` · roleMixTV ${output.perRole.roleMixTV.mean} eyeBall0 ${output.structural.eyeNeverTouchesBall} telescope ${teleAll}`
    + ` · det ${det} SHA ${sha256.slice(0, 12)}`
    + (failed.length ? ` · FAILED ${failed.join(',')}` : '') + '\n',
  );
}

/** §11 — the interpretive choices the prereg froze in FORM but not in last detail. */
const DEVIATIONS: readonly string[] = [
  'restart instrument (§3/§6.4): the C-RESTART limb + the sizing SD both use the P3a battery instrument restartTicks = ticks where m.restart !== null (runMatch verbatim). The §6.1 sizing ANCHORS (R0 1708.84, residual +139) came from P3p-2\'s phase===\'restart\' surrogate — a DIFFERENT count; #68.2 re-anchors on THIS battery\'s own R0 measured with the P3a instrument, so the doc anchors are priors only (the smoke re-measures, §6.4).',
  'light-battery rest surrogate (§6.4): the SMOKE\'s restSlotOccupancy is the light per-tick surrogate (index-1 body in own-third over playing ticks), NOT the battery\'s 6 Hz possession-sampled DEGEN-RESTDEF I5(b). DEGEN-RESTDEF is REPORTED + over-powered (§6.2) so its smoke SD is confirmation only; the binding gate (restart) is measured with the exact P3a instrument. The BATTERY uses the full P3a I5(b).',
  'per-set wall (§6.4/#121): the smoke measures the LIGHT-instrument 5-arm per-set wall; N_MAX = largest 200-step N with (per-set wall × N × 2 X-DET) ≤ 36 h, ≤ 8,000/arm. The light per-set wall is a LOWER bound on the full-battery per-set wall (6 Hz SideRow/shape/release overhead), so N_MAX is a CEILING — the resident (#49.5) monitors live wall. The #121 formula "5 arms × N × per-set wall × 2" is read as [5-arm set wall] × [N seeds] × [2 X-DET] = the physical total.',
  'wall-derived N_MAX stripped from X-DET/SHA (§6.4): the per-set wall + N_MAX + N_binding + reduced-power disclosure are MACHINE-DEPENDENT (measured once at the smoke) so they live in sizing.wallDerived and are stripped from the deterministic X-DET compare + the SHA (the P3p-2 wall-strip precedent). The DETERMINISTIC N arithmetic (SDs, R0 mean, band edge, gap, N*) is inside the SHA.',
  'N* power arithmetic (§6.1): N* from the per-match SD of the paired R3p−R0 restart diff directly (SE_N = SD/√N), the brief\'s ask; the bootstrap cluster CI is reported alongside (SE ≈ halfWidth/1.96 cross-check). POWER_Z = 3.605 (z.975+z.95), Z = 1.96, both frozen from the doc. absGap = |band edge − residual| so the power rule resolves the gate EITHER side of +10 %.',
  'R3p-lawOnly injects children but reads NEITHER family (§2.2): both bit flags off ⇒ the extended resolve consults eye.v3.children for no family (base for every candidate), so its consumption ledger shows deliveryChild=deliveryBase=offsideChild=offsideBase=0 (readsZeroChildren). noOffside reads delivery only. X-MERGE-SHA asserts identically on all three partial arms (provenance-identical, behaviourally inert for lawOnly).',
  'shape-regression predicate (§4/§4.1): the doc gives #88.2 DIRECTIONS, not a mechanical predicate. Operationalised shapeRegressed = pileup fires OR roleMixTV < 0.407 OR eye ball-ledger ≠ 0 OR (i6 duplicate-run CI resolved & rose) OR (i3 spacing-median CI resolved & closed). Each component is REPORTED; the commander disposes at review (this is a MEASUREMENT).',
  'marginal-chain telescoping (§2.1): each key\'s five contrasts are computed on the COMPLETE-seed set (all five arms finite) so the four marginals sum EXACTLY to R3p−R0 at the point-estimate level (mean linearity); the CIs do not telescope (independent bootstraps). restart/offside/delivery are integer counts (always finite); only restSlotOccupancy can drop a seed. `telescope.exact` asserts |Σmarginals − fullResidual| < 1e-6.',
  'ledgers/receipts scope (§8): a release ledger on EVERY partial arm (the eye-never-touches-ball structural gate binds on all three); exclusion/perRole/receipts on R3p only (the reference arm the shape/role gates read). X-OFF-IDENT re-plays a bare enriched match per battery seed vs the R0 row signatures (P3a precedent).',
  'X-SEAM carrier check (§8, refined from P3a): P3a\'s carrierNeverOverridden proxy reads stationEyeState AFTER step and false-fires when a body that just gained the ball still carries a RETAINED window offset — never applied, because the executor\'s whole eye block (decision + target write) is guarded by ball.owner !== p (actionExecutor L672/L955). It is seed-flaky (passes on 9.30M, false-fires on 11.20M). Refined to the faithful E-NONSTATION invariant: a violation is a FRESH eye override DECISION (untilTick advanced, offset non-null) while the body owns the ball — the src guard makes that impossible; asserted 0. freshNull/bodyScope/teamScope/bothActivated are P3a-verbatim.',
  'seed layout (§7): "one block per arm" honoured as FIVE 100k sub-blocks (11.2M–11.6M) composing ONE arm\'s N seeds block-major, paired across all five arms (#20); K=ceil(N/5) then slice to N. A per-arm partition is rejected (it would break pairing + every marginal contrast). Bootstrap 99603 (reserved for this battery), permutation 99903 (fresh, unused). match-duration OMITTED on real runs ⇒ src default 240 (P3a byte-identical); env override is preflight-only.',
  'no fork-grain layer (§1): the battery instruments are 6 Hz whole-match distributions only; per-decision DEV/PC fidelity is certified by P3p-2 (#120.1) and is NOT re-run here.',
];

function main(): void {
  if (MODE !== 'smoke' && MODE !== 'battery') {
    throw new Error(`V4P3P3_MODE must be explicitly 'smoke' or 'battery' (no default); got '${MODE ?? ''}'`);
  }
  if (IS_BATTERY && !(N_REQUESTED >= 1)) {
    throw new Error('battery mode requires V4P3P3_N ≥ 1 (the disclosed-rule N* from the smoke; no default, §6.4)');
  }
  if (!(MATCHES >= 1)) throw new Error(`no matches to run (MATCHES=${MATCHES}); check V4P3P3_MATCH_CAP`);
  run();
}

const isMain = (() => {
  try { return import.meta.url === pathToFileURL(process.argv[1] ?? '').href; } catch { return false; }
})();
if (isMain) main();

export {
  armEye, xMergeShaPerArm, buildMergeSha, playArmLight, runMatch, computeSmokeScience,
  computeRestartSizing, computeWallDerived, computeBattery, ledgerOf, seedDisjointness,
  buildSeeds, matchOf, signatureOf, limbValue, phi,
};
