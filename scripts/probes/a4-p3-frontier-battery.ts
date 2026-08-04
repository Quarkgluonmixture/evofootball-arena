// A4-P3 — THE FRONTIER BATTERY (slice 1's FINAL EXAM of H-A4.1): the P3p-3
// attribution-chain whole-match battery FORKED to FIVE arms with the home-prior
// injected on BOTH sides, under the FROZEN FRONTIER PREDICATE on `PRIOR − R3p`.
//
// Authority: docs/world-model/A4-P3-FRONTIER-BATTERY.md (the FROZEN pre-registration)
// + ruling #149.4 (A4-P3 dispatched; five arms R0/R3v3/R3v3p/R3p/PRIOR; the frozen
// frontier predicate on PRIOR−R3p; prior arms at 0.25×VAL_SCALE; instrument gates
// inherited; seeds from the reservation tail 12.21M–12.30M) + #148 (the certified
// 0.25× dose + the born-0 P2 gene, span [0,0.5×VAL_SCALE]) + #145/#146 (the dose
// curve; the beneficial low-dose region) + #123/STAGE3-V4-P3P3-BATTERY.md §RESULT
// (THE FORM REUSED — the frozen P3p-3 numbers carried VERBATIM as must-not-regress)
// under the A4-ASSIGNMENT-CONTRACT §1 (H-A4.1), §5 (as #148/#149-amended: five arms,
// prior at 0.25×VAL_SCALE, R3v3/R3v3p replaces the vacuous priorOnly), §6 (the FAIL
// modes F-SLIDE / F-NULL / F-SHAPE-ONLY, all → the user).
//
// ⚠⚠ THE ONE MECHANICS DIVERGENCE, FLAGGED (executor's choice; #134.2 precedent).
// #149.4 says the prior arms grant 0.25×VAL_SCALE "via the probe grant path" on
// BOTH SIDES. `Match.homeMapGrant` is STRUCTURALLY SINGLE-SIDE ({side,strength}|null)
// — one static object cannot bias both sides in a whole-match run (the executor gates
// it on `mapGrant.side === p.side`). A SYMMETRIC both-sides grant is therefore
// UNREACHABLE through `homeMapGrant` without a src change (forbidden; ZERO src). The
// prior is instead injected on BOTH sides via the P2 SHIPPED-FORM seam
// `eye.v4.homePrior === true` + each team's `homePriorObedience = 0.5` gene, set on
// the PROBE FIXTURES ONLY (never production). This is BYTE-EQUIVALENT to a both-sides
// homeMapGrant@0.0409: `homePriorStrength(0.5) = 0.5×HOME_MAP_STRENGTH_MAX =
// 0.25×VAL_SCALE = 0.040874` routes through the SAME `homeMapBias` at the SAME v3
// consumption point with the SAME per-body ATTACK_FORMATIONS homes (proven:
// tests/a4HomePriorGene.test.ts:141-143 the ceiling, :169 the 0.5↔0.0409 map, :259-286
// the per-team both-sides effect, :289-298 the homeMapGrant≡gene precedence identity).
// Production stays byte-identical (X-FP-PROD; the flag/gene are absent everywhere but
// these two probe arms). The equivalence is asserted IN-PROBE (VAL_SCALE recomputed
// from the SHA-pinned merged table === 0.163494 AND homePriorStrength(0.5) ===
// 0.25×VAL_SCALE). This honours #149.4's INTENT (a probe-injected 0.25×VAL_SCALE prior,
// the mechanism dormant in production) over its LETTER (the single-side field). The
// commander ratifies at review; a redirect to the single-side homeMapGrant (one side
// only, or a per-side asymmetric hybrid) costs nothing numerically (byte-equivalent).
//
// THE FIVE ARMS (§2 of the pre-reg; one seed runs ALL FIVE — the paired set idiom):
//   R0     CONTROL  stationEye null — the paired ENRICHED baseline (#68.2)
//   R3v3   BOTH     plain v3 (roleTable,control); NO children; NO eye.v4 — the plain eye
//   R3v3p  BOTH     R3v3 + the home prior BOTH SIDES (eye.v4.homePrior + obedience 0.5)
//   R3p    BOTH     v3 base+children+SHA; v4:{law,delivery,offside} — the P3p-3 arm VERBATIM
//   PRIOR  BOTH     R3p + the home prior BOTH SIDES (v4:{law,delivery,offside,homePrior} + obedience 0.5)
//   telescoping (REPORTED): (R3v3−R0), (R3v3p−R3v3 = the prior on the PLAIN eye),
//                           (R3p−R3v3), (PRIOR−R3p = the primary), (PRIOR−R0).
//
// THE FROZEN GATE (H-A4.1, on PRIOR−R3p). PASS := (i) DEGEN-RESTDEF (I5(b) designated-
//   slot occupancy) IMPROVES RESOLVEDLY — the paired PRIOR−R3p CI excludes zero on the
//   HELPING side (lower > 0, restSlot rises → closes the deficit vs R0) ∧ (ii) NO shape
//   limb resolves NEGATIVE on the same PRIOR−R3p contrast — spacing median (must not
//   resolve DOWN), under-4m share (must not resolve UP), dupRun (must not resolve UP),
//   the watchability DEGEN family (I4 scramble must not resolve UP, C-BOX must not
//   resolve DOWN), roleMixTV (PRIOR ≥ the incumbent 0.407), ball-ledger (PRIOR = 0);
//   thresholds carried VERBATIM from the P3p-3 freeze ∧ (iii) the X-family gates HARD
//   (Simpson-genre reversal is N/A — no pooling across contexts here). Any leg fails ⇒
//   the §6 FAIL modes classify it (F-SLIDE / F-NULL / F-SHAPE-ONLY); in EVERY case the
//   arc RETURNS TO THE USER with the verdict.
//
// TWO MODES (explicit A4P3_MODE, NO default):
//   smoke   — 40 sets @ 12,208,000 + k, k∈0..39, all five arms, the light instruments;
//             publishes the per-match SD of the paired PRIOR−R3p DEGEN-RESTDEF diff →
//             the FROZEN N arithmetic (MDL from that contrast; N* → wall-N_MAX ≤ 12 h
//             ×2 X-DET; hard cap 8,000) + the reduced-power disclosure. X-DET double-run.
//   battery — A4P3_N sets @ 12,210,000 + k, k∈0..N−1 (N ≤ 8,000 ⇒ ≤ 12,217,999). The
//             gate-bearing run: the frontier predicate + limbs + disposition + the §6
//             FAIL-mode classification + the telescopes + the deep/box mediators + the
//             X-family + X-DET double-run. Progress every 250 sets to stderr.
//
// SEEDS (the reservation TAIL, #149.4): virgin band [12,208,000, 12,300,000]; everything
//   below 12.208M consumed. smoke 12,208,000+k (0..39); battery 12,210,000+k (single
//   contiguous block, ≤ 12,217,999). Stats: bootstrap 101003; reserved 101103.
//   Disjointness asserted in-probe vs EVERY consumed block. ONE seed = one five-arm set.
//
// COMMAND LINES:
//   smoke:    A4P3_MODE=smoke npx tsx scripts/probes/a4-p3-frontier-battery.ts
//   battery:  A4P3_MODE=battery A4P3_N=<disclosed N* from the smoke> \
//             npx tsx scripts/probes/a4-p3-frontier-battery.ts
//   preflight (bounded; writes OUTSIDE the repo; NOT a verdict):
//     A4P3_MODE=battery A4P3_N=2 A4P3_MATCH_CAP=2 A4P3_MATCH_DURATION=40 A4P3_SKIP_FP=1 \
//       A4P3_BODY_LOG=1 A4P3_OUT_BATTERY=/tmp/x.json \
//       npx tsx scripts/probes/a4-p3-frontier-battery.ts
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
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
  CELL_FLOOR, HOME_MAP_STRENGTH_MAX, homePriorStrength, newStationEyeTrace,
  type RoleCell, type RoleConditionedTable, type RoleControlLevels, type MergedChildTable,
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
const MODE = process.env.A4P3_MODE;                    // 'smoke' | 'battery'; validated in main()
const IS_BATTERY = MODE === 'battery';

/** the reservation TAIL (#149.4): virgin [12,208,000, 12,300,000]; below 12.208M consumed. */
const SMOKE_START = 12_208_000;                        // smoke: 12,208,000 + k, k∈0..39
const BATTERY_START = 12_210_000;                      // battery: 12,210,000 + k (single block)
const RESERVED_BAND = [12_208_000, 12_300_000] as const;
/** every consumed block below 12.208M — the disjointness gate asserts disjointness from ALL. */
const CONSUMED_BLOCKS = [
  [11_150_000, 11_150_039], // P3p-3 smoke
  [11_200_000, 11_600_079], // P3p-3 battery (5 sub-blocks 11.2–11.6M)
  [11_700_000, 11_700_039], // A4-P1 smoke
  [11_800_000, 11_807_999], // A4-P1 census
  [11_850_000, 11_850_039], // A4-P1b smoke
  [11_900_000, 11_907_999], // A4-P1b census
  [11_950_000, 11_950_039], // A4-P1c sizing smoke
  [12_000_000, 12_007_999], // A4-P1c census (+ the #140 forensic re-read)
  [12_050_000, 12_050_039], // A4-P1d smoke
  [12_100_000, 12_107_999], // A4-P1d census
  [12_150_000, 12_150_039], // A4-P1e smoke
  [12_200_000, 12_207_999], // A4-P1e census (the last consumed seed = 12,207,999)
] as const;

/** smoke = 40 (env-overridable for the bounded preflight only, labelled);
 *  battery = A4P3_N (REQUIRED, no default, validated in main). */
const N_REQUESTED = IS_BATTERY ? envInt('A4P3_N', -1) : envInt('A4P3_SMOKE_MATCHES', 40);
/** bounded-preflight cap on the number of seeds (labelled). */
const MATCH_CAP = envInt('A4P3_MATCH_CAP', Number.POSITIVE_INFINITY);
const MATCHES = Number.isFinite(MATCH_CAP) ? Math.min(N_REQUESTED, MATCH_CAP) : N_REQUESTED;

/** bounded-preflight match-duration override (labelled); real runs OMIT it ⇒ the src
 *  default MATCH_DURATION=240 (the P3a battery's own matchOf, byte-identical). */
const MATCH_DURATION_ENV = process.env.A4P3_MATCH_DURATION;
const BODY_LOG = process.env.A4P3_BODY_LOG === '1';    // preflight-only per-side bias audit

/** progress line cadence (frozen); stderr only, NEVER in the compared core (#128). */
const PROGRESS_EVERY = 250;                            // every 250 sets (five full matches per set)

// --- frozen instrument constants (P3a / P3p-3 §§4 VERBATIM) ------------------
const SAMPLE_EVERY = 10;            // 6 Hz (every 10th tick), P0 §2
const SAMPLE_DT = SAMPLE_EVERY * DT;
const PAIR_SUBSAMPLE = 6;           // P0's I3 sub-sample
const CLOSE_PAIR_M = 4;             // I3 share < 4 m
const BALL_NEAR_M = 5;             // I4 within 5 m
const BALL_MID_M = 10;             // I4 within 10 m
const DUP_RUN_M = 4;               // I6 duplicate-run bucket
const REST_THIRD = HALF_L / 3;     // I5 own-third depth
const CROSS_WINDOW_S = 4;          // C-BOX arrival window
const SPEED_GATE = 2.5;            // de-glue speed gate
const RECEIPT_CAP = 1000;          // per-class receipts cap (#49.3)
const REST_BOTH = 2;               // I5(a) both-back = >= 2 deep in own third
const BOX_INNER_X = -(HALF_L - BOX_DEPTH); // own-box inner depth (P1 box detector)

// --- P0 reference points + P3a relative bands (must-not-regress, carried VERBATIM) --
const P0_I4_OWN5 = 0.956;
const P0_I3_UNDER4 = 0.0940;
const P0_I5_SLOT = 0.6582;
const DEGEN_SCRAMBLE_REL = 0.25;   // I4 own-within-5 m rises >= +25 %  (must-not-regress vs R0)
const DEGEN_PILEUP_REL = 0.50;     // I3 share < 4 m rises >= +50 %      (must-not-regress vs R0)
const DEGEN_RESTDEF_REL = -0.20;   // I5(b) slot falls >= 20 % drop      (the REPORTED residual vs R0)
const CANARY_BOX_REL = -0.15;      // C-BOX: box-at-arrival falls >= 15 % (must-not-regress vs R0)
const INCUMBENT_ROLE_TV = 0.407;   // the incumbent's mean pairwise role TV (P3a §4.3)

// --- the P3p-3 FROZEN §RESULT numbers carried as MUST-NOT-REGRESS anchors (reported) --
// (docs/world-model/STAGE3-V4-P3P3-BATTERY.md §RESULT; #123). The frontier gate binds
// on the RESOLVED SIGN of PRIOR−R3p; these are the reference deficits/values the gate
// context reads against — NOT re-tuned bands (#30.3).
const P3P3_FROZEN = {
  restSlot: { r0: 0.643001, r3p: 0.481603, r3pMinusR0: -0.161398, ci: [-0.172066, -0.150373] },
  spacingMedian: { r3pMinusR0: -0.654539, ci: [-0.74928, -0.562952] }, // CLOSED (the #88.2 leg that STOPPED P3p-3)
  spacingUnder4: { r3pMinusR0: 0.003126, ci: [0.001051, 0.0053] },     // ROSE
  dupRun: { r3pMinusR0: -0.035463, ci: [-0.053244, -0.016797] },       // FELL (improved)
  roleMixTV: 0.5562,                                                    // >= 0.407 (held)
} as const;

// --- sizing (frozen) --------------------------------------------------------
const POWER_Z = 3.605;             // z_.975 + z_.95 (two-sided 95 % CI test at 95 % power)
const Z_975 = 1.96;
const N_STEP = 200;                // fixed-step N grid
const N_CAP = 8000;                // the hard N cap (keeps the battery band ≤ 12,217,999)
const WALL_BUDGET_HOURS = 12;      // the wall cap (#149.4 tail: N_MAX ≤ 12 h)
const WALL_BUDGET_MS = WALL_BUDGET_HOURS * 3600 * 1000;
const XDET_FACTOR = 2;             // the battery runs twice (X-DET)
/** the MDL for the frontier DEGEN-RESTDEF gate: the smallest designated-slot-occupancy
 *  IMPROVEMENT worth resolving away from zero. Frozen floor 0.01 (one percentage-point
 *  of I5(b) occupancy — a modest but material closing of the −0.161 deficit); the actual
 *  MDL = min(0.5·|smoke PRIOR−R3p restSlot point|, this) so noise cannot inflate it. */
const MDL_ABS = 0.01;

// --- stats seeds ------------------------------------------------------------
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 101_003;    // reserved for THIS battery (#149.4)
const RESERVED_SEED = 101_103;     // reserved-unused

// --- X-FP-PROD: the frozen shipped-world production fingerprint --------------
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SKIP_FP = process.env.A4P3_SKIP_FP === '1';      // bounded-preflight only, labelled

// --- the injected P3p-1 merged table (base+children+SHA) + control ----------
const MERGED_PATH = process.env.A4P3_MERGED
  ?? 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const MERGED_SHA_EXPECTED =
  '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED =
  '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';
const CONTROL_PATH = process.env.A4P3_CONTROL_PATH
  ?? 'docs/world-model/data/stage3-v3-p2-control-recovery.json';

const SMOKE_OUT = process.env.A4P3_OUT_SMOKE
  ?? 'docs/world-model/data/a4-p3-frontier-battery-sizing-smoke.json';
const BATTERY_OUT = process.env.A4P3_OUT_BATTERY
  ?? 'docs/world-model/data/a4-p3-frontier-battery.json';

/** #67.3: the ENRICHED world — the substrate the v3 table + merged children were censused on. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];

// --- the five frontier arms -------------------------------------------------
const ALL_ARMS = ['R0', 'R3v3', 'R3v3p', 'R3p', 'PRIOR'] as const;
type Arm = (typeof ALL_ARMS)[number];
const ARMED_ARMS: readonly Arm[] = ['R3v3', 'R3v3p', 'R3p', 'PRIOR'];
const PARTIAL_ARMS: readonly Arm[] = ['R3p', 'PRIOR'];   // inject children (X-MERGE-SHA binds here)
const PRIOR_ARMS: readonly Arm[] = ['R3v3p', 'PRIOR'];   // the home-prior arms (obedience 0.5 both sides)
/** the certified primary obedience: homePriorStrength(0.5)=0.25×VAL_SCALE=0.040874 (#148). */
const PRIMARY_OBEDIENCE = 0.5;

// =============================================================================
// preflight guard — a capped invocation must NOT write a canonical repo path
// =============================================================================
const PREFLIGHT = Number.isFinite(MATCH_CAP) || MATCH_DURATION_ENV !== undefined
  || SKIP_FP || process.env.A4P3_MERGED !== undefined
  || process.env.A4P3_SMOKE_MATCHES !== undefined || BODY_LOG;
const isCanonicalRepoPath = (p: string): boolean => p.startsWith('docs/world-model/data/');

// --- small numeric helpers (P3p-3 verbatim) ---------------------------------
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

// --- team fixture (the house pattern; P3p-3 verbatim) -----------------------
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

/** set the home-prior obedience gene on ALL the genome references a team reads through
 *  the match (a4HomePriorGene.test.ts:105-110 verbatim — info.genome / baseGenome /
 *  effGenome share one object at construction; mentality/underdog rebuilds spread from
 *  baseGenome, so setting all three is robust). Set ONLY on the PRIOR arms. */
const setObedience = (m: Match, side: Side, v: number): void => {
  const t = m.teams[side];
  (t.info.genome as TacticalGenome).homePriorObedience = v;
  (t.baseGenome as TacticalGenome).homePriorObedience = v;
  (t.effGenome as TacticalGenome).homePriorObedience = v;
};
/** the PRIOR arms (R3v3p, PRIOR) inject the home prior on BOTH sides at obedience 0.5
 *  (= 0.25×VAL_SCALE, the #148 certified primary) — see the header FLAG. No-op otherwise. */
const applyPrior = (m: Match, arm: Arm): void => {
  if (!(PRIOR_ARMS as readonly string[]).includes(arm)) return;
  setObedience(m, 0, PRIMARY_OBEDIENCE);
  setObedience(m, 1, PRIMARY_OBEDIENCE);
};

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

// =============================================================================
// the injected merged table + control (X-MERGE-IDENT) — never bundled in src/**
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
  control: RoleControlLevels; sha256: string;
};
const control: RoleControlLevels = rawControl.control;

/** X-MERGE-IDENT: the loaded mergedTableSha == 39662445… AND its `base` rehashes to the
 *  injected v3 base 171a6dad… AND the field reproduces from {base, children}. */
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

/** VAL_SCALE (the eye's native score dispersion; P1c/P1d/P1e verbatim) — recomputed from
 *  the SHA-pinned merged base table; MUST equal 0.163494. Anchors the strength provenance
 *  + the home-prior equivalence assertion (see the header FLAG). */
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
  const f = vals.filter(Number.isFinite);
  if (f.length < 2) return Number.NaN;
  const mu = f.reduce((s, x) => s + x, 0) / f.length;
  return Math.sqrt(f.reduce((s, x) => s + (x - mu) ** 2, 0) / (f.length - 1));
};
const VAL_SCALE = computeValScale();
const PRIMARY_STRENGTH = homePriorStrength(PRIMARY_OBEDIENCE); // 0.25×VAL_SCALE = 0.040874
/** the home-prior equivalence: obedience 0.5 → 0.25×VAL_SCALE via the SAME homeMapBias. */
const buildPriorEquivalence = () => {
  // VAL_SCALE recomputed from the SHA-pinned table rounds to the pinned 0.163494 (the src
  // constant HOME_MAP_STRENGTH_MAX is pinned to that rounded value). So the exact identity
  // is against the PINNED value; the recomputed-table check is to ~1e-6 (rounding).
  const valScaleOk = Number.isFinite(VAL_SCALE) && Math.abs(VAL_SCALE - 0.163494) < 1e-6;
  const quarterValScalePinned = 0.25 * 0.163494;
  const quarterValScaleRecomputed = 0.25 * VAL_SCALE;
  // PRIMARY_STRENGTH = homePriorStrength(0.5) = 0.5×HOME_MAP_STRENGTH_MAX = 0.25×0.163494 EXACTLY.
  const strengthMatchesPinned = Math.abs(PRIMARY_STRENGTH - quarterValScalePinned) < 1e-12;
  const strengthMatchesRecomputed = Math.abs(PRIMARY_STRENGTH - quarterValScaleRecomputed) < 1e-6;
  const ceilingOk = Math.abs(HOME_MAP_STRENGTH_MAX - 0.5 * 0.163494) < 1e-12;
  return {
    valScale: round(VAL_SCALE), valScaleExpected: 0.163494, valScaleOk,
    obedience: PRIMARY_OBEDIENCE, primaryStrength: round(PRIMARY_STRENGTH, 9),
    quarterValScalePinned: round(quarterValScalePinned, 9),
    quarterValScaleRecomputed: round(quarterValScaleRecomputed, 9),
    strengthMatchesPinned, strengthMatchesRecomputed,
    homeMapStrengthMax: round(HOME_MAP_STRENGTH_MAX, 9), ceilingOk,
    note: 'homePriorStrength(0.5) = 0.5×HOME_MAP_STRENGTH_MAX = 0.25×VAL_SCALE(pinned 0.163494) = the #148 '
      + 'certified primary dose 0.040874; the both-sides home prior is injected via eye.v4.homePrior + '
      + 'obedience 0.5, BYTE-EQUIVALENT to a both-sides homeMapGrant@0.0409 (single-side field ⇒ the FLAG). '
      + 'tests/a4HomePriorGene.test.ts:141-143/169/259-298.',
    pass: valScaleOk && strengthMatchesPinned && strengthMatchesRecomputed && ceilingOk,
  };
};

// =============================================================================
// arm eye configs — R3v3 base ≡ R3v3p base (+homePrior); R3p base ≡ PRIOR base (+homePrior)
// =============================================================================
type EyeConfig = NonNullable<Match['stationEye']>;
const armEye = (arm: Arm, trace: StationEyeTrace | undefined): EyeConfig | null => {
  if (arm === 'R0') return null;
  const scope: EyeConfig['scope'] = { kind: 'both' };
  if (arm === 'R3v3') {
    return { arm: 'neutral', scope, table: {}, v3: { roleTable, control }, trace };
  }
  if (arm === 'R3v3p') {
    // the PLAIN v3 eye + the home prior (no children, no law/delivery/offside bits).
    return { arm: 'neutral', scope, table: {}, v3: { roleTable, control }, v4: { homePrior: true }, trace };
  }
  // R3p / PRIOR — the P3p-3 R3p arm (all three bits) + children; PRIOR adds homePrior.
  const v4 = arm === 'R3p'
    ? { inSupportLaw: true, deliveryBit: true, offsideBit: true }
    : { inSupportLaw: true, deliveryBit: true, offsideBit: true, homePrior: true };
  return {
    arm: 'neutral', scope, table: {},
    v3: { roleTable, control, children, mergedTableSha }, v4, trace,
  };
};

/** X-MERGE-SHA per partial arm: R3p + PRIOR carry the identical children + mergedTableSha;
 *  R0/R3v3/R3v3p inject none. */
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
      correct: isPartial
        ? injects && eye?.v3?.children === children && eye?.v3?.mergedTableSha === MERGED_SHA_EXPECTED
        : !injects,
    }];
  }));
  const allPartialsAssert = PARTIAL_ARMS.every((a) => (perArm[a] as { correct: boolean }).correct);
  const noneElseInject = (['R0', 'R3v3', 'R3v3p'] as const).every((a) => (perArm[a] as { correct: boolean }).correct);
  return { ...merge, perArm, pass: merge.pass && allPartialsAssert && noneElseInject };
};

// =============================================================================
// station family ledger + release ledger (P3p-3 §§4 verbatim)
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
  GK: newRoleLedger(), DF: newRoleLedger(), MF: newRoleLedger(),
  WG: newRoleLedger(), ST: newRoleLedger(),
});

// --- sum every StationEyeTrace field needed by the consumption ledger --------
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

const ledgerOf = (t: StationEyeTrace) => {
  const oosTotal = t.v4OosPhase + t.v4OosUnseen + t.v4OosInflight + t.v4OosStale;
  return {
    decisions: t.decisions, deviate: t.deviate, tie: t.tie, noCell: t.noCell,
    inSupport: t.v4InSupport, oosTotal,
    oosShare: round(oosTotal / ((t.v4InSupport + oosTotal) || 1)),
    deliveryChild: t.v4DeliveryChild, deliveryBase: t.v4DeliveryBase,
    deliveryChildShare: round(t.v4DeliveryChild / ((t.v4DeliveryChild + t.v4DeliveryBase) || 1)),
    offsideChild: t.v4OffsideChild, offsideBase: t.v4OffsideBase,
    offsideChildShare: round(t.v4OffsideChild / ((t.v4OffsideChild + t.v4OffsideBase) || 1)),
    readsDeliveryChildren: t.v4DeliveryChild + t.v4DeliveryBase > 0,
    readsOffsideChildren: t.v4OffsideChild + t.v4OffsideBase > 0,
  };
};

// =============================================================================
// the LIGHT collector (SMOKE) — the frontier sizing quantities + wall
// =============================================================================
interface LightMediators {
  restSlotOccupancy: number;  // I5(b) surrogate: index-1 body held in own-third over playing ticks
  restartTicks: number;
  deepEntries: number;        // P1-family surrogate: opponent deep entries (both sides) / match
  boxEntries: number;         // P1-family surrogate: opponent box entries (both sides) / match
}
/** play ONE full match under `arm`, collecting the light sizing quantities + wall. */
const playArmLight = (seed: number, arm: Arm): { mediators: LightMediators; trace: StationEyeTrace | null; wallMs: number } => {
  const t0 = Date.now();
  const m = matchOf(seed);
  applyPrior(m, arm);
  const trace = arm === 'R0' ? null : newStationEyeTrace();
  const eye = armEye(arm, trace ?? undefined);
  if (eye !== null) m.stationEye = eye;
  let restartTicks = 0;
  let heldS0 = 0; let presentS0 = 0; let heldS1 = 0; let presentS1 = 0;
  let deepEntries = 0; let boxEntries = 0;
  const deepPrev = [false, false]; const boxPrev = [false, false];
  while (!m.finished) {
    m.step(DT);
    if (m.finished) break;
    if (m.restart !== null) restartTicks += 1;
    const owner = m.ball.owner;
    const playing = m.phase === 'playing';
    for (const side of [0, 1] as const) {
      const t = m.teams[side];
      // P1 deep/box detectors: OPPONENT owns + ball in side's own third / own box.
      const oppOwns = owner !== null && owner.side !== side;
      const lx = t.localX(m.ball.pos.x);
      const deepNow = oppOwns && playing && lx < -REST_THIRD;
      if (deepNow && !deepPrev[side]) deepEntries += 1;
      deepPrev[side] = deepNow;
      const boxNow = oppOwns && playing && lx <= BOX_INNER_X && Math.abs(m.ball.pos.y) <= BOX_WIDTH / 2;
      if (boxNow && !boxPrev[side]) boxEntries += 1;
      boxPrev[side] = boxNow;
      if (playing) {
        const b = t.players.find((p) => p.index === 1 && !p.sentOff);
        if (b === undefined) continue;
        const held = t.localX(b.pos.x) < -REST_THIRD ? 1 : 0;
        if (side === 0) { presentS0 += 1; heldS0 += held; } else { presentS1 += 1; heldS1 += held; }
      }
    }
  }
  const restSlotS0 = presentS0 === 0 ? Number.NaN : heldS0 / presentS0;
  const restSlotS1 = presentS1 === 0 ? Number.NaN : heldS1 / presentS1;
  const mediators: LightMediators = {
    restSlotOccupancy: mean([restSlotS0, restSlotS1].filter(Number.isFinite)),
    restartTicks, deepEntries, boxEntries,
  };
  m.stationEye = null;
  return { mediators, trace, wallMs: Date.now() - t0 };
};

// =============================================================================
// the FULL whole-match battery instrument (BATTERY, P3p-3 §§4 runMatch VERBATIM)
// =============================================================================
interface SideRow {
  spacingMedian: number; spacingUnder4: number;
  ballNear: number; ballMid: number;
  restSlotShare: number; dupRunShare: number;
  offsides: number; goals: number; crosses: number; headersWon: number; longBalls: number; cutbacks: number;
  boxAtArrival: number; crossArrivals: number;
}
const emptySide = (): SideRow => ({
  spacingMedian: Number.NaN, spacingUnder4: Number.NaN,
  ballNear: Number.NaN, ballMid: Number.NaN,
  restSlotShare: Number.NaN, dupRunShare: Number.NaN,
  offsides: 0, goals: 0, crosses: 0, headersWon: 0, longBalls: 0, cutbacks: 0,
  boxAtArrival: Number.NaN, crossArrivals: 0,
});

interface MatchRow {
  readonly seed: number; readonly arm: Arm;
  readonly sides: [SideRow, SideRow];
  readonly restartTicks: number;
  readonly deepEntries: number; readonly boxEntries: number;   // side-summed P1-family surrogates
  readonly turnovers: number;                                  // side-summed possession losses
  readonly signature: string;
}

const runMatch = (
  seed: number, arm: Arm,
  trace: StationEyeTrace | null, release: ReleaseLedger | null,
  perRole: PerRole | null, receipts: ReceiptBook | null,
): MatchRow => {
  const m = matchOf(seed);
  applyPrior(m, arm);
  const eye = armEye(arm, trace ?? undefined);
  if (eye !== null) m.stationEye = eye;
  const per: [SideRow, SideRow] = [emptySide(), emptySide()];

  const roleOf = new Map<number, Role>();
  for (const p of m.allPlayers) roleOf.set(p.gid, p.role);
  const lastUntil = new Map<number, number>();

  const pairs: [number[], number[]] = [[], []];
  const ballNear: [number[], number[]] = [[], []];
  const ballMid: [number[], number[]] = [[], []];
  const boxAtArrival: [number[], number[]] = [[], []];
  const restTicks = [0, 0];
  const restSlotTicks = [0, 0];
  const runTicks = [0, 0];
  const dupRunTicks = [0, 0];

  let restartTicks = 0;
  let samples = 0;
  let tick = 0;
  let deepEntries = 0; let boxEntries = 0;
  const deepPrev = [false, false]; const boxPrev = [false, false];
  const crossesBefore: [number, number] = [0, 0];
  const inFlight: { side: 0 | 1; deadline: number; headersAtStart: number; arrived: boolean; maxInBox: number }[] = [];

  let lastValidPoss: number | -1 = -1;
  let possessionSpells = 0;
  let turnovers = 0;

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

    // P1 deep/box detectors (both sides, opponent-owns transitions).
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
      const deglued = m.dribbleTouch !== null && m.dribbleTouch.gid === relGid
        && m.dribbleTouch.until >= m.simTime;
      if (deglued) {
        release.deglue += 1;
        if (receipts) addReceipt(receipts, 'deglue', seed, tick, relGid, 'de-glue branch');
      } else if (newOwner === null) {
        const kicked = m.pendingPass !== null
          || m.ball.vel.x * m.ball.vel.x + m.ball.vel.y * m.ball.vel.y > SPEED_GATE * SPEED_GATE;
        if (kicked) { release.kick += 1; if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'strike/kick/pass/clearance'); }
        else { release.ballWon += 1; if (receipts) addReceipt(receipts, 'ball-won', seed, tick, relGid, 'loose contest'); }
      } else if (prevOwnerSide !== null && newOwner.side !== prevOwnerSide) {
        release.tackle += 1;
        if (receipts) addReceipt(receipts, 'tackle', seed, tick, relGid, 'won by other side');
      } else {
        release.kick += 1;
        if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'teammate received');
      }
    }

    const poss = m.possessionSide;
    if (poss !== -1) {
      if (lastValidPoss === -1) { /* first possession */ }
      else if (poss !== lastValidPoss) { possessionSpells += 1; turnovers += 1; }
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
          for (let j = i + 1; j < outfield.length; j++) {
            pairs[side].push(dist2(outfield[i].pos, outfield[j].pos));
          }
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
        const targets = runners.map((p) => runTarget(p, t, opp.players));
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
    s.offsides = t.stats.offsides;
    s.goals = t.stats.goals;
    s.crosses = t.stats.crosses;
    s.headersWon = t.stats.headersWon;
    s.longBalls = t.stats.longBalls;
    s.cutbacks = t.stats.cutbacks;
    s.boxAtArrival = mean(boxAtArrival[side]);
    s.crossArrivals = boxAtArrival[side].length;
  }
  void possessionSpells;
  const sig = signatureOf(m);
  m.stationEye = null;
  return {
    seed, arm, sides: per, restartTicks, deepEntries, boxEntries, turnovers, signature: sig,
  };
};

// =============================================================================
// statistics — paired cluster bootstrap (cluster = match seed, B=2000, seed 101003)
// =============================================================================
interface PairedCI {
  n: number; control: number; treated: number; diff: number;
  lower: number; upper: number; relative: number; resolved: boolean;
}
/** paired treated[i] − controlCol[i] index-aligned (paired seeds), match-cluster bootstrap. */
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
// seed layout + disjointness
// =============================================================================
const buildSeeds = (): number[] => {
  const start = IS_BATTERY ? BATTERY_START : SMOKE_START;
  return Array.from({ length: MATCHES }, (_, k) => start + k);
};

const seedDisjointness = (seeds: readonly number[]) => {
  const minSeed = seeds.length ? Math.min(...seeds) : Number.POSITIVE_INFINITY;
  const maxSeed = seeds.length ? Math.max(...seeds) : Number.NEGATIVE_INFINITY;
  const disjointFrom = (aLo: number, aHi: number, bLo: number, bHi: number): boolean => aHi < bLo || bHi < aLo;
  const smokeHi = SMOKE_START + 39;
  const batteryHi = BATTERY_START + N_CAP - 1; // 12,217,999
  const withinReservation = SMOKE_START >= RESERVED_BAND[0] && batteryHi <= RESERVED_BAND[1];
  const smokeVsBattery = smokeHi < BATTERY_START;
  const consumedOk = CONSUMED_BLOCKS.every(([lo, hi]) =>
    disjointFrom(SMOKE_START, smokeHi, lo, hi) && disjointFrom(BATTERY_START, batteryHi, lo, hi));
  // stats seeds disjoint from every used stats seed across the arc.
  const usedStats = new Set([
    99603, 99903, 99703, 99803, 99403, 99503, 93003, 92110, 91110, 91100,
    100603, 100703, 100803, 100903,
  ]);
  const statsSeeds = [BOOTSTRAP_SEED, RESERVED_SEED];
  const statsOk = BOOTSTRAP_SEED === 101_003 && RESERVED_SEED === 101_103
    && new Set(statsSeeds).size === 2 && !statsSeeds.some((s) => usedStats.has(s));
  return {
    pass: withinReservation && smokeVsBattery && consumedOk && statsOk,
    reservedBand: RESERVED_BAND, smokeStart: SMOKE_START, batteryStart: BATTERY_START,
    smokeRange: [SMOKE_START, smokeHi], batteryRangeMax: [BATTERY_START, batteryHi],
    seedMin: Number.isFinite(minSeed) ? minSeed : null, seedMax: Number.isFinite(maxSeed) ? maxSeed : null,
    consumedBlocks: CONSUMED_BLOCKS, bootstrapSeed: BOOTSTRAP_SEED, reservedSeed: RESERVED_SEED, statsOk,
  };
};

// =============================================================================
// X-family — fingerprint, off-identity, seam
// =============================================================================
const productionFingerprint = (): { fingerprint: string; pass: boolean } => {
  if (SKIP_FP) return { fingerprint: 'SKIPPED(A4P3_SKIP_FP=1; bounded-preflight only)', pass: true };
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

/** X-OFF-IDENT: R0 (enriched, stationEye null) byte-identical to the bare enriched world. */
const offIdentity = (seeds: readonly number[], r0Sigs: readonly string[]) => {
  let mismatches = 0;
  for (let i = 0; i < seeds.length; i++) {
    const bare = matchOf(seeds[i]);
    while (!bare.finished) bare.step(DT);
    if (signatureOf(bare) !== r0Sigs[i]) mismatches += 1;
  }
  return { seeds: seeds.length, mismatches, pass: mismatches === 0 };
};

/** X-SEAM / E-NONSTATION (refined form): fresh null, scope gating, the eye never overrides
 *  a ball-directed carrier. Exercised on the PRIOR eye (both bits + homePrior armed). */
const xSeamCheck = (seed: number) => {
  const seamMatch = matchOf(seed);
  const freshNull = seamMatch.stationEye === null && seamMatch.stationEyeState.size === 0;
  const priorV3 = { roleTable, control, children, mergedTableSha };
  const priorV4 = { inSupportLaw: true, deliveryBit: true, offsideBit: true, homePrior: true };
  const bodyGid = 1 + (seed % 5);
  const bodyM = matchOf(seed);
  applyPrior(bodyM, 'PRIOR');
  bodyM.stationEye = { arm: 'neutral', scope: { kind: 'body', gid: bodyGid }, table: {}, v3: priorV3, v4: priorV4 };
  let bodyScopeOk = true;
  let carrierNeverOverridden = true;
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
  applyPrior(teamM, 'PRIOR');
  teamM.stationEye = { arm: 'neutral', scope: { kind: 'team', side: 0 }, table: {}, v3: priorV3, v4: priorV4 };
  let teamScopeOk = true;
  for (let i = 0; i < 3000 && !teamM.finished; i++) {
    teamM.step(DT);
    for (const gid of teamM.stationEyeState.keys()) {
      if (Math.floor(gid / TEAM_SIZE) !== 0 || gid % TEAM_SIZE === 0) teamScopeOk = false;
    }
  }
  const bothM = matchOf(seed);
  applyPrior(bothM, 'PRIOR');
  bothM.stationEye = { arm: 'neutral', scope: { kind: 'both' }, table: {}, v3: priorV3, v4: priorV4 };
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
// SMOKE — the frontier sizing (the PRIOR−R3p DEGEN-RESTDEF contrast) + the N rule
// =============================================================================
const LIGHT_KEYS = ['restSlotOccupancy', 'restartTicks', 'deepEntries', 'boxEntries'] as const;
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
    LIGHT_KEYS.map((mk) => [mk, round(mean(seeds.map((s) => medBySeed[arm].get(s)![mk]).filter(Number.isFinite)), 6)]),
  )])) as Record<string, Record<LightKey, number>>;

  // the FRONTIER sizing input: the paired PRIOR − R3p per-match restSlot diffs.
  const frontierDiffs = seeds
    .map((s) => medBySeed.PRIOR.get(s)!.restSlotOccupancy - medBySeed.R3p.get(s)!.restSlotOccupancy)
    .filter(Number.isFinite);
  const frontierPoint = mean(frontierDiffs);
  const frontierSd = sd(frontierDiffs);
  const frontierN = frontierDiffs.length;
  const frontierCI = pairedCI(
    seeds.map((s) => medBySeed.PRIOR.get(s)!.restSlotOccupancy),
    seeds.map((s) => medBySeed.R3p.get(s)!.restSlotOccupancy), 500,
  );

  const ledger = Object.fromEntries(ARMED_ARMS.map((a) => [a, ledgerOf(traceByArm[a]!)]));
  return {
    perArmMediators, ledger, wallByArm,
    frontier: { point: round(frontierPoint, 6), sd: round(frontierSd, 6), n: frontierN, ci: frontierCI },
  };
};

/** the FROZEN frontier N arithmetic (SD-driven, deterministic). MDL from the smoke
 *  PRIOR−R3p DEGEN-RESTDEF contrast; SE_N ≤ MDL/POWER_Z at 95 % power. */
const computeSizing = (sci: ReturnType<typeof computeSmokeScience>) => {
  const point = sci.frontier.point;
  const sdDiff = sci.frontier.sd;
  const n = sci.frontier.n;
  const mdl = Math.min(0.5 * Math.abs(point), MDL_ABS);
  const seSmoke = sdDiff / Math.sqrt(Math.max(1, n));
  const need = mdl > 0 && Number.isFinite(sdDiff)
    ? Math.pow((sdDiff * POWER_Z) / mdl, 2) : Number.POSITIVE_INFINITY;
  const nStar = Number.isFinite(need) ? Math.max(N_STEP, Math.ceil(need / N_STEP) * N_STEP) : Number.POSITIVE_INFINITY;
  return {
    rule: 'N* = smallest 200-step N with SE_N (=SD_pairedDiff/√N) ≤ MDL/POWER_Z (95 % power to resolve '
      + 'the PRIOR−R3p DEGEN-RESTDEF improvement away from zero), CAPPED at N_MAX (WALL-DERIVED: largest '
      + '200-step N with per-set wall × N × 2 (X-DET) ≤ 12 h, itself ≤ 8,000). If N* > N_MAX the cap binds '
      + 'and the reduced-power reading is DISCLOSED before the gate-bearing run (#105.4).',
    powerZ: POWER_Z, z975: Z_975,
    degenRestdefPriorMinusR3p: { point, sd: sdDiff, n, ci: sci.frontier.ci },
    mdlFormula: 'MDL = min( 0.5·|PRIOR−R3p restSlot point| , 0.01 ) (designated-slot-occupancy units)',
    mdl: round(mdl, 6), seSmoke: round(seSmoke, 6),
    needRaw: Number.isFinite(need) ? round(need, 2) : null,
    nStar: Number.isFinite(nStar) ? nStar : null,
  };
};

/** the WALL-DERIVED N_MAX + binding N + reduced-power disclosure (MACHINE-DEPENDENT, one-shot
 *  at the smoke ⇒ STRIPPED from the X-DET compare + the SHA, #128). */
const computeWallDerived = (
  sci: ReturnType<typeof computeSmokeScience>, sizing: ReturnType<typeof computeSizing>,
) => {
  const nSeeds = Math.max(1, MATCHES);
  const perArmPerMatchWallMs = Object.fromEntries(ALL_ARMS.map((a) => [a, round((sci.wallByArm[a] ?? 0) / nSeeds, 2)]));
  const perSetPerMatchWallMs = round(ALL_ARMS.reduce((s, a) => s + (sci.wallByArm[a] ?? 0) / nSeeds, 0), 2);
  const perSetTwice = perSetPerMatchWallMs * XDET_FACTOR;
  const nMaxWallRaw = perSetTwice > 0 ? Math.floor((WALL_BUDGET_MS / perSetTwice) / N_STEP) * N_STEP : N_CAP;
  const nMaxWall = Math.max(0, nMaxWallRaw);
  const nMax = Math.min(nMaxWall, N_CAP);
  const nStar = sizing.nStar;
  const nBinding = nStar === null ? nMax : Math.min(nStar, nMax);
  const reducedPowerDisclosure = nStar === null ? true : nStar > nMax;
  const mdl = sizing.mdl;
  const sdDiff = sci.frontier.sd;
  const seAtBinding = sdDiff / Math.sqrt(Math.max(1, nBinding));
  const projectedPower = seAtBinding > 0 && mdl > 0 ? round(phi(mdl / seAtBinding - Z_975), 4) : null;
  const projectedTotalWallHoursAtBinding = round(perSetTwice * nBinding / (3600 * 1000), 3);
  return {
    perArmPerMatchWallMs, perSetPerMatchWallMs, xDetFactor: XDET_FACTOR,
    wallBudgetHours: WALL_BUDGET_HOURS, nCap: N_CAP, nStep: N_STEP,
    nMaxWall, nMax, nStar, nBinding, reducedPowerDisclosure,
    projectedFrontierPowerAtBinding: projectedPower,
    projectedTotalWallHoursAtBinding,
    note: 'MACHINE-DEPENDENT (measured once at the smoke); stripped from the X-DET / SHA. The per-set '
      + 'wall is the LIGHT-instrument 5-arm wall — a LOWER bound on the full-battery per-set wall (the '
      + '6 Hz SideRow/shape/release sampling adds overhead) ⇒ treat N_MAX as a ceiling; the resident '
      + '(#49.5) monitors live wall. N fixed before the run (#105.4).',
  };
};

// =============================================================================
// BATTERY — the frontier gate (§ the frozen predicate on PRIOR − R3p) + telescopes
// =============================================================================
const limbValue = (r: MatchRow, key: LightKey): number => {
  switch (key) {
    case 'restSlotOccupancy':
      return mean([r.sides[0].restSlotShare, r.sides[1].restSlotShare].filter(Number.isFinite));
    case 'restartTicks': return r.restartTicks;
    case 'deepEntries': return r.deepEntries;
    case 'boxEntries': return r.boxEntries;
  }
};

const computeBattery = (seeds: readonly number[], onProgress?: (done: number) => void) => {
  const traces: Record<Arm, StationEyeTrace | null> = {
    R0: null, R3v3: newStationEyeTrace(), R3v3p: newStationEyeTrace(),
    R3p: newStationEyeTrace(), PRIOR: newStationEyeTrace(),
  };
  const releases: Record<string, ReleaseLedger> = Object.fromEntries(ARMED_ARMS.map((a) => [a, newReleaseLedger()]));
  const perRoleByArm: Record<string, PerRole> = { R3p: newPerRole(), PRIOR: newPerRole() };
  const receipts: ReceiptBook = {};

  const rows: Record<Arm, MatchRow[]> = { R0: [], R3v3: [], R3v3p: [], R3p: [], PRIOR: [] };
  let done = 0;
  for (const seed of seeds) {
    for (const arm of ALL_ARMS) {
      const rel = releases[arm] ?? null;
      const pr = perRoleByArm[arm] ?? null;
      rows[arm].push(runMatch(seed, arm, traces[arm], rel, pr, arm === 'PRIOR' ? receipts : null));
    }
    done += 1;
    if (onProgress && done % PROGRESS_EVERY === 0) onProgress(done);
  }

  const colSide = (rr: MatchRow[], side: 0 | 1, sel: (s: SideRow) => number): number[] => rr.map((r) => sel(r.sides[side]));
  const colAvg = (rr: MatchRow[], sel: (s: SideRow) => number): number[] => rr.map((r) => (sel(r.sides[0]) + sel(r.sides[1])) / 2);
  const boxOf = (rr: MatchRow[]) => rr.map((r) => {
    const a = r.sides[0].boxAtArrival; const b = r.sides[1].boxAtArrival;
    const na = r.sides[0].crossArrivals; const nb = r.sides[1].crossArrivals;
    if (na + nb === 0) return Number.NaN;
    return ((Number.isFinite(a) ? a * na : 0) + (Number.isFinite(b) ? b * nb : 0)) / (na + nb);
  });

  let offset = 1000;
  const nextOff = () => offset++;

  // ---- the PRIMARY FRONTIER CONTRAST: PRIOR − R3p, per limb (paired cluster CIs) ----
  const priorVsR3p = (sel: (s: SideRow) => number, useAvg = true) =>
    useAvg ? pairedCI(colAvg(rows.PRIOR, sel), colAvg(rows.R3p, sel), nextOff())
      : pairedCI(colSide(rows.PRIOR, 0, sel), colSide(rows.R3p, 0, sel), nextOff());
  const fRestSlot = pairedCI(colAvg(rows.PRIOR, (s) => s.restSlotShare), colAvg(rows.R3p, (s) => s.restSlotShare), nextOff());
  const fSpacingMedian = priorVsR3p((s) => s.spacingMedian);
  const fSpacingUnder4 = priorVsR3p((s) => s.spacingUnder4);
  const fDupRun = priorVsR3p((s) => s.dupRunShare);
  const fBallNear = priorVsR3p((s) => s.ballNear);           // I4 scramble
  const fBox = pairedCI(boxOf(rows.PRIOR), boxOf(rows.R3p), nextOff()); // C-BOX

  // roleMixTV per armed arm; the gate reads PRIOR ≥ the incumbent 0.407.
  const roleMixByArm = Object.fromEntries(
    (['R3p', 'PRIOR'] as const).map((a) => [a, roleMixTV(perRoleByArm[a])]),
  );
  const priorRoleMix = roleMixByArm.PRIOR.mean;
  const r3pRoleMix = roleMixByArm.R3p.mean;

  // eye-never-touches-ball, every armed arm (PRIOR's ledger = 0 is the frontier ball-ledger leg).
  const releaseByArm = Object.fromEntries(ARMED_ARMS.map((a) => [a, releases[a]]));
  const eyeNeverTouchesBall = ARMED_ARMS.every((a) => releases[a].eyeAttributable === 0 && releases[a].unattributable === 0);
  const priorBallLedgerZero = releases.PRIOR.eyeAttributable === 0 && releases.PRIOR.unattributable === 0;

  // ---- leg (i): DEGEN-RESTDEF IMPROVES RESOLVEDLY (PRIOR−R3p restSlot lower > 0) ----
  const disciplineImproves = fRestSlot.resolved && fRestSlot.lower > 0;

  // ---- leg (ii): NO shape limb resolves NEGATIVE on PRIOR−R3p ----
  const shapeLimbs = {
    spacingMedian: { ci: fSpacingMedian, badIf: 'resolves DOWN (median closes)', negative: fSpacingMedian.resolved && fSpacingMedian.upper < 0 },
    spacingUnder4: { ci: fSpacingUnder4, badIf: 'resolves UP (more pile-up)', negative: fSpacingUnder4.resolved && fSpacingUnder4.lower > 0 },
    dupRun: { ci: fDupRun, badIf: 'resolves UP (more duplicate runs / clumping)', negative: fDupRun.resolved && fDupRun.lower > 0 },
    scrambleI4: { ci: fBallNear, badIf: 'resolves UP (more ball-scramble)', negative: fBallNear.resolved && fBallNear.lower > 0 },
    box: { ci: fBox, badIf: 'resolves DOWN (fewer attackers in the box at arrival)', negative: fBox.resolved && fBox.upper < 0 },
    roleMixTV: { value: priorRoleMix, incumbent: INCUMBENT_ROLE_TV, badIf: 'PRIOR roleMixTV < 0.407 (roles collapse)', negative: !(Number.isFinite(priorRoleMix) && priorRoleMix >= INCUMBENT_ROLE_TV) },
    ballLedger: { value: releases.PRIOR.eyeAttributable + releases.PRIOR.unattributable, badIf: 'PRIOR eye touches the ball (ledger ≠ 0)', negative: !priorBallLedgerZero },
  };
  const anyShapeNegative = Object.values(shapeLimbs).some((l) => l.negative);

  // a shape limb resolving in the GOOD direction (for F-SHAPE-ONLY classification).
  const anyShapeImproves =
    (fSpacingMedian.resolved && fSpacingMedian.lower > 0)      // median opens
    || (fSpacingUnder4.resolved && fSpacingUnder4.upper < 0)   // pile-up falls
    || (fDupRun.resolved && fDupRun.upper < 0)                 // duplicates fall
    || (fBallNear.resolved && fBallNear.upper < 0)             // scramble falls
    || (fBox.resolved && fBox.lower > 0);                      // more box presence

  // ---- the telescoping chain (REPORTED), on the DEGEN-RESTDEF (restSlot) limb + mediators ----
  const rowBySeed: Record<Arm, Map<number, MatchRow>> = {
    R0: new Map(), R3v3: new Map(), R3v3p: new Map(), R3p: new Map(), PRIOR: new Map(),
  };
  for (const arm of ALL_ARMS) for (const r of rows[arm]) rowBySeed[arm].set(r.seed, r);
  const orderedArms: readonly Arm[] = ['R0', 'R3v3', 'R3v3p', 'R3p', 'PRIOR'];
  const telescope = Object.fromEntries(LIGHT_KEYS.map((key) => {
    const complete = seeds.filter((s) => orderedArms.every((a) => Number.isFinite(limbValue(rowBySeed[a].get(s)!, key))));
    const diffCI = (aArm: Arm, bArm: Arm) => {
      const treated = complete.map((s) => limbValue(rowBySeed[aArm].get(s)!, key));
      const ctrl = complete.map((s) => limbValue(rowBySeed[bArm].get(s)!, key));
      return pairedCI(treated, ctrl, nextOff());
    };
    return [key, {
      completeSeeds: complete.length,
      diseasePlainEye: diffCI('R3v3', 'R0'),        // R3v3 − R0
      priorOnPlainEye: diffCI('R3v3p', 'R3v3'),     // R3v3p − R3v3 (the prior on the plain eye)
      remediesOnPlainEye: diffCI('R3p', 'R3v3'),    // R3p − R3v3
      priorPrimary: diffCI('PRIOR', 'R3p'),         // PRIOR − R3p (the primary)
      fullFrontier: diffCI('PRIOR', 'R0'),          // PRIOR − R0
    }];
  }));

  // per-arm raw levels (deep/box P1-family surrogates + restSlot + restart + offside/delivery).
  const perMatch = (rr: MatchRow[], f: (r: MatchRow) => number): number => rr.reduce((a, r) => a + f(r), 0) / (rr.length || 1);
  const deliveryOf = (r: MatchRow): number =>
    r.sides[0].longBalls + r.sides[0].crosses + r.sides[0].cutbacks
    + r.sides[1].longBalls + r.sides[1].crosses + r.sides[1].cutbacks;
  const perArmLevels = Object.fromEntries(ALL_ARMS.map((a) => [a, {
    restSlotShare: round(mean(rows[a].map((r) => limbValue(r, 'restSlotOccupancy')).filter(Number.isFinite))),
    deepEntries: round(perMatch(rows[a], (r) => r.deepEntries)),
    boxEntries: round(perMatch(rows[a], (r) => r.boxEntries)),
    restartTicks: round(perMatch(rows[a], (r) => r.restartTicks)),
    offsides: round(perMatch(rows[a], (r) => r.sides[0].offsides + r.sides[1].offsides)),
    deliveryEvents: round(perMatch(rows[a], deliveryOf)),
    turnovers: round(perMatch(rows[a], (r) => r.turnovers)),
    goals: round(perMatch(rows[a], (r) => r.sides[0].goals + r.sides[1].goals)),
  }]));

  // consumption ledgers (structural: R3v3/R3v3p read no children; R3p/PRIOR read both).
  const ledger = Object.fromEntries(ARMED_ARMS.map((a) => [a, ledgerOf(traces[a]!)]));
  const ledgerStructural = {
    r3v3ReadsZeroChildren: !ledger.R3v3.readsDeliveryChildren && !ledger.R3v3.readsOffsideChildren,
    r3v3pReadsZeroChildren: !ledger.R3v3p.readsDeliveryChildren && !ledger.R3v3p.readsOffsideChildren,
    r3pReadsBoth: ledger.R3p.readsDeliveryChildren && ledger.R3p.readsOffsideChildren,
    priorReadsBoth: ledger.PRIOR.readsDeliveryChildren && ledger.PRIOR.readsOffsideChildren,
  };

  return {
    rows, offset,
    frontier: {
      contrast: 'PRIOR − R3p (H-A4.1, the primary)',
      legI_disciplineImproves: {
        instrument: 'DEGEN-RESTDEF I5(b) designated-slot occupancy', predicate: 'PRIOR−R3p CI excludes zero AND lower > 0 (occupancy RISES → closes the deficit vs R0)',
        ci: fRestSlot, improves: disciplineImproves,
      },
      legII_noShapeNegative: { limbs: shapeLimbs, anyShapeNegative, holds: !anyShapeNegative },
      anyShapeImproves,
      roleMix: { prior: priorRoleMix, r3p: r3pRoleMix, incumbent: INCUMBENT_ROLE_TV, priorPairwise: roleMixByArm.PRIOR.pairwise },
    },
    telescope, perArmLevels,
    consumptionLedger: ledger, ledgerStructural,
    structural: {
      releaseByArm, eyeNeverTouchesBall, priorBallLedgerZero,
      receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
    },
    disciplineImproves, anyShapeNegative,
    r0Sigs: rows.R0.map((r) => r.signature),
  };
};

/** the §6 FAIL-mode classification (contract §6) — the frozen disposition. */
const classifyDisposition = (
  hardGatesPass: boolean, disciplineImproves: boolean, anyShapeNegative: boolean, anyShapeImproves: boolean,
): { disposition: string; verdict: string; returnsToUser: boolean } => {
  if (!hardGatesPass) {
    return { disposition: 'STOP — a HARD X-family / structural gate failed (the measurement is invalid)', verdict: 'GATES FAIL', returnsToUser: true };
  }
  if (disciplineImproves && !anyShapeNegative) {
    return { disposition: 'PASS (H-A4.1) — DEGEN-RESTDEF improves resolvedly AND no shape limb resolves negative on PRIOR−R3p: the FRONTIER MOVED. RETURNS TO THE USER with the verdict (#149.4 — regardless).', verdict: 'PASS — the frontier moved', returnsToUser: true };
  }
  if (disciplineImproves && anyShapeNegative) {
    return { disposition: 'F-SLIDE (contract §6) — discipline improves but a shape limb resolves negative on PRIOR−R3p: the prior as built is still price-shaped in effect; the frontier did NOT move. RETURNS TO THE USER.', verdict: 'F-SLIDE', returnsToUser: true };
  }
  if (!disciplineImproves && anyShapeImproves) {
    return { disposition: 'F-SHAPE-ONLY (contract §6) — shape improves, discipline does not: deconfliction did the work, not the anchor. Honest partial. RETURNS TO THE USER.', verdict: 'F-SHAPE-ONLY', returnsToUser: true };
  }
  return { disposition: 'F-NULL (contract §6) — no resolved DEGEN-RESTDEF effect: the prior\'s lever is too weak on the eye world. RETURNS TO THE USER.', verdict: 'F-NULL', returnsToUser: true };
};

// =============================================================================
// X-DET strip + emit
// =============================================================================
const VOLATILE_KEYS = new Set(['wallByArm', 'wallCost', 'wallDerived', 'perArmPerMatchWallMs', 'perSetPerMatchWallMs']);
const stripVolatile = (o: unknown): string => JSON.stringify(o, (k, v) => (VOLATILE_KEYS.has(k) || k.toLowerCase().includes('wall') ? undefined : v));

const emit = (output: Record<string, unknown>, path: string): void => {
  if (PREFLIGHT && isCanonicalRepoPath(path)) {
    throw new Error(`bounded-preflight (caps active) must NOT write the canonical repo path '${path}'; redirect via A4P3_OUT_${IS_BATTERY ? 'BATTERY' : 'SMOKE'}=/tmp/...`);
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
    seedFormula: IS_BATTERY ? '12,210,000 + k, k∈0..N−1 (single contiguous block; ≤ 12,217,999)' : '12,208,000 + k, k∈0..39',
    reservedBand: RESERVED_BAND,
    arms: ALL_ARMS, armedArms: ARMED_ARMS, partialArms: PARTIAL_ARMS, priorArms: PRIOR_ARMS,
    priorInjection: 'eye.v4.homePrior + homePriorObedience=0.5 (both sides) — the FLAGGED both-sides seam '
      + '(single-side homeMapGrant cannot grant both); byte-equivalent to homeMapGrant@0.25×VAL_SCALE',
    clusterUnit: 'match seed (paired across all five arms; ONE seed = one five-arm set)',
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES, reservedSeed: RESERVED_SEED,
    sampleEvery: SAMPLE_EVERY, sampleHz: round(1 / SAMPLE_DT, 3),
    world: 'ENRICHED', flags: CENSUS_FLAGS, preflight: PREFLIGHT, head,
    tableSource: MERGED_PATH, controlSource: CONTROL_PATH, controlSha: rawControl.sha256,
  };

  const disjoint = seedDisjointness(seeds);
  const xMergeSha = xMergeShaPerArm();
  const priorEquiv = buildPriorEquivalence();
  const src = srcZero();
  const pins = stalePins();

  if (MODE === 'smoke') {
    const sci1 = computeSmokeScience(seeds);
    const sci2 = computeSmokeScience(seeds);
    const sizing = computeSizing(sci1);
    const deterministic = stripVolatile({ ...sci1, sizing }) === stripVolatile({ ...sci2, sizing: computeSizing(sci2) });
    const wallDerived = computeWallDerived(sci1, sizing);
    const fp = productionFingerprint();

    const gates: Record<string, boolean> = {
      xMergeSha: xMergeSha.pass, priorEquivalence: priorEquiv.pass, xFpProd: fp.pass, xSrcZero: src.pass,
      seedDisjoint: disjoint.pass, xDet: deterministic, stalePins: pins.pass,
    };
    const output = {
      experiment: 'A4-P3 FRONTIER BATTERY — SIZING SMOKE (the five-arm frontier chain)',
      authority: 'A4-P3-FRONTIER-BATTERY.md · rulings #149.4 / #148 / #145 / #146 · #123 (the P3p-3 form)',
      parameters: commonParams,
      perArmMediators: sci1.perArmMediators,
      sizing: { ...sizing, wallDerived }, consumptionLedger: sci1.ledger,
      priorEquivalence: priorEquiv,
      xMergeSha, seedDisjointness: disjoint, fingerprint: { ...fp, baseline: FINGERPRINT_BASELINE },
      xSrcZero: src, stalePins: pins,
      wallCost: { perArmTotalMs: sci1.wallByArm, matchesRun: MATCHES },
      gates, deterministic, verdict: 'SIZING SMOKE',
      deviations: DEVIATIONS,
    };
    const sha256 = createHash('sha256').update(stripVolatile({ ...output, sha256: undefined })).digest('hex');
    emit({ ...output, sha256 }, SMOKE_OUT);
    logSmoke(sizing, wallDerived, gates, deterministic, sha256);
  } else {
    const progress = (label: string) => (done: number) => process.stderr.write(
      `A4-P3 BATTERY ${label} · ${done}/${MATCHES} sets (×5 arms)\n`,
    );
    const b1 = computeBattery(seeds, progress('pass1'));
    const b2 = computeBattery(seeds, progress('pass2'));
    const deterministic = stripVolatile(stripBattery(b1)) === stripVolatile(stripBattery(b2));
    const fp = productionFingerprint();
    const xoff = offIdentity(seeds, b1.r0Sigs);
    const seam = xSeamCheck(seeds[0]);

    const hardGates: Record<string, boolean> = {
      xMergeSha: xMergeSha.pass, priorEquivalence: priorEquiv.pass, xFpProd: fp.pass,
      xOffIdent: xoff.pass, xSeam: seam.pass, xDet: deterministic, xSrcZero: src.pass,
      seedDisjoint: disjoint.pass, eyeNeverTouchesBall: b1.structural.eyeNeverTouchesBall,
      ledgerStructural: b1.ledgerStructural.r3v3ReadsZeroChildren && b1.ledgerStructural.r3v3pReadsZeroChildren
        && b1.ledgerStructural.r3pReadsBoth && b1.ledgerStructural.priorReadsBoth,
    };
    const hardGatesPass = Object.values(hardGates).every(Boolean);
    const anyShapeImproves = (b1.frontier as { anyShapeImproves: boolean }).anyShapeImproves;
    const classification = classifyDisposition(hardGatesPass, b1.disciplineImproves, b1.anyShapeNegative, anyShapeImproves);

    const { rows, offset, r0Sigs, ...bodyBattery } = b1;
    void rows; void offset; void r0Sigs;
    const output = {
      experiment: 'A4-P3 FRONTIER BATTERY (the five-arm frontier chain — H-A4.1 final exam)',
      authority: 'A4-P3-FRONTIER-BATTERY.md §§ frontier gate · rulings #149.4 / #148 · #123 (the P3p-3 form)',
      parameters: commonParams,
      ...bodyBattery,
      priorEquivalence: priorEquiv,
      xMergeSha, seedDisjointness: disjoint, fingerprint: { ...fp, baseline: FINGERPRINT_BASELINE },
      offIdentity: xoff, seam, xSrcZero: src, stalePins: pins,
      hardGates, hardGatesPass, deterministic,
      frozenGate: {
        predicate: 'PASS := (i) DEGEN-RESTDEF (I5(b) designated-slot occupancy) improves resolvedly on '
          + 'PRIOR−R3p (CI excludes zero, occupancy rises → closes the deficit vs R0) AND (ii) no shape limb '
          + '(spacing median, under-4m share, dupRun, roleMixTV, watchability DEGEN family [I4 scramble, C-BOX], '
          + 'ball-ledger) resolves negative on the same PRIOR−R3p contrast AND (iii) the X-family gates HARD '
          + '(Simpson-genre reversal N/A — no pooling across contexts).',
        disposition: classification.disposition, returnsToUser: classification.returnsToUser,
      },
      verdict: classification.verdict,
      deviations: DEVIATIONS,
    };
    const sha256 = createHash('sha256').update(stripVolatile({ ...output, sha256: undefined })).digest('hex');
    emit({ ...output, sha256 }, BATTERY_OUT);
    logBattery(output, hardGates, deterministic, classification, sha256);
  }
}

/** strip the non-deterministic receipts records ordering + the rows for the X-DET compare. */
const stripBattery = (b: ReturnType<typeof computeBattery>) => {
  const { rows, offset, r0Sigs, ...rest } = b;
  void rows; void offset; void r0Sigs;
  return rest;
};

function logSmoke(
  sizing: ReturnType<typeof computeSizing>, w: ReturnType<typeof computeWallDerived>,
  gates: Record<string, boolean>, det: boolean, sha256: string,
): void {
  const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
  const f = sizing.degenRestdefPriorMinusR3p;
  process.stderr.write(
    `A4-P3 SMOKE · ${MATCHES} sets × 5 arms`
    + ` · DEGEN-RESTDEF PRIOR−R3p ${f.point} [${f.ci.lower},${f.ci.upper}] SD ${f.sd}`
    + ` · MDL ${sizing.mdl} N* ${sizing.nStar}`
    + ` · perSetWall ${w.perSetPerMatchWallMs}ms N_MAX ${w.nMax} N_bind ${w.nBinding} redPow ${w.reducedPowerDisclosure} pow ${w.projectedFrontierPowerAtBinding}`
    + ` · priorEquiv ${gates.priorEquivalence} xMerge ${gates.xMergeSha} fp ${gates.xFpProd} det ${det} SHA ${sha256.slice(0, 12)}`
    + (failed.length ? ` · FAILED ${failed.join(',')}` : '') + '\n',
  );
}

function logBattery(
  output: { frozenGate: { disposition: string }; frontier: unknown; hardGatesPass: boolean; verdict: string; perArmLevels: Record<string, { restSlotShare: number }> },
  gates: Record<string, boolean>, det: boolean,
  classification: ReturnType<typeof classifyDisposition>, sha256: string,
): void {
  const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
  const fr = output.frontier as { legI_disciplineImproves: { ci: PairedCI; improves: boolean }; legII_noShapeNegative: { holds: boolean } };
  const ci = fr.legI_disciplineImproves.ci;
  process.stderr.write(
    `A4-P3 BATTERY · ${output.hardGatesPass ? 'GATES VALID' : 'GATES FAIL'} · ${output.verdict}`
    + ` · DEGEN-RESTDEF PRIOR−R3p ${ci.diff} [${ci.lower},${ci.upper}] improves ${fr.legI_disciplineImproves.improves}`
    + ` · noShapeNeg ${fr.legII_noShapeNegative.holds}`
    + ` · ${classification.disposition.slice(0, 48)}`
    + ` · det ${det} SHA ${sha256.slice(0, 12)}`
    + (failed.length ? ` · FAILED ${failed.join(',')}` : '') + '\n',
  );
}

/** the interpretive choices the pre-reg froze in FORM but not in last detail. */
const DEVIATIONS: readonly string[] = [
  '⚠⚠ THE BOTH-SIDES PRIOR SEAM (the one mechanics FLAG): #149.4 asks for the 0.25×VAL_SCALE prior on BOTH '
  + 'sides "via the probe grant path", but Match.homeMapGrant is STRUCTURALLY SINGLE-SIDE ({side,strength}|null) '
  + '— one static object cannot bias both sides in a whole-match run (the executor gates on mapGrant.side===p.side). '
  + 'A symmetric both-sides grant is unreachable through homeMapGrant zero-src (ZERO src is an iron rule). The prior '
  + 'is injected on BOTH sides via the P2 shipped-form seam eye.v4.homePrior + homePriorObedience=0.5 (probe fixtures '
  + 'ONLY; production dormant), BYTE-EQUIVALENT to homeMapGrant@0.0409: homePriorStrength(0.5)=0.5×HOME_MAP_STRENGTH_MAX'
  + '=0.25×VAL_SCALE routes through the SAME homeMapBias at the SAME v3 consumption point with the SAME per-body '
  + 'ATTACK_FORMATIONS homes (tests/a4HomePriorGene.test.ts:141-143/169/259-298; the equivalence asserted in-probe as '
  + 'the priorEquivalence gate). Honours #149.4 INTENT (probe-injected instrument, mechanism dormant in production) '
  + 'over its LETTER; commander ratifies. A redirect to a single-side or per-side-hybrid homeMapGrant is numerically free.',
  'THE FRONTIER GATE reads PRIOR−R3p (H-A4.1), not vs R0: leg (i) DEGEN-RESTDEF (I5(b) side-averaged restSlotShare) '
  + 'improves resolvedly = the paired PRIOR−R3p cluster CI excludes zero AND lower > 0 (occupancy RISES, closing the '
  + 'P3p-3 −0.161 deficit vs R0). leg (ii) no shape limb resolves NEGATIVE on the same contrast: spacing median (not '
  + 'DOWN), under-4m (not UP), dupRun (not UP), I4 scramble (not UP), C-BOX (not DOWN), roleMixTV (PRIOR ≥ 0.407), '
  + 'ball-ledger (PRIOR = 0). Resolved-sign tests (the #88.2 form), NOT the R0-relative %-bands (those don\'t translate '
  + 'to a PRIOR−R3p contrast); the P3a %-bands + the P3p-3 frozen §RESULT numbers are carried as REPORTED context.',
  'FAIL-MODE CLASSIFICATION (contract §6): !hardGates ⇒ STOP (invalid); disciplineImproves & !shapeNeg ⇒ PASS (frontier '
  + 'moved); disciplineImproves & shapeNeg ⇒ F-SLIDE; !disciplineImproves & someShapeImproves ⇒ F-SHAPE-ONLY; else '
  + 'F-NULL. EVERY outcome (incl. PASS) RETURNS TO THE USER (#149.4 — the slice\'s final exam returns regardless).',
  'SIZING (the frozen N arithmetic, P3p-3 form): MDL = min(0.5·|smoke PRIOR−R3p DEGEN-RESTDEF point|, 0.01); N* = '
  + 'smallest 200-step N with SE_N=SD_pairedDiff/√N ≤ MDL/POWER_Z (3.605) ⇒ 95 % power to resolve the improvement away '
  + 'from zero; CAPPED at a WALL-DERIVED N_MAX (per-set wall × N × 2 X-DET ≤ 12 h) and the hard N_CAP 8,000 (keeps the '
  + 'battery band ≤ 12,217,999, inside the reservation). N* > N_MAX ⇒ the cap binds + the reduced-power reading is '
  + 'DISCLOSED before the gate-bearing run (#105.4). The smoke restSlot SD is the LIGHT per-tick surrogate; the battery '
  + 'uses the full 6 Hz possession-sampled I5(b) DEGEN-RESTDEF (over-powered vs the light surrogate — confirmation only).',
  'DEEP/BOX MEDIATORS (REPORTED, P1-family surrogates): whole-match opponent deep-entry + box-entry counts (both sides, '
  + 'the P1 deep/box detectors adapted to whole matches — transition into own-third / own-box while the opponent owns). '
  + 'Per-arm raw levels + the full telescope. Turnovers (side-summed possession losses) + spacing ride as REPORTED '
  + 'mediators (spacing is already a gating shape limb). No fork-grain layer — the battery is 6 Hz whole-match only.',
  'THE ARMS: R0 (null) / R3v3 (plain v3) / R3v3p (plain v3 + prior both sides) / R3p (v3+children+law/delivery/offside — '
  + 'the P3p-3 R3p arm VERBATIM) / PRIOR (R3p + prior both sides). R3v3/R3p are byte-identical to the P3p-3 arms (no '
  + 'obedience set); the prior arms set obedience 0.5 both sides only. X-MERGE-SHA asserts on R3p + PRIOR (both inject '
  + 'the identical children + SHA); R0/R3v3/R3v3p inject none. The prior applies on the PLAIN v3 eye (R3v3p, via '
  + 'priceApproachesV3) AND the partial eye (PRIOR, via priceApproachesV3Partial) — homeBias enters both resolve paths.',
  'SEEDS (single contiguous battery block, NOT the P3p-3 5-sub-block layout): the reservation tail [12,208,000, '
  + '12,300,000] is contiguous and virgin (everything ≤ 12,207,999 consumed, incl. the P1e census 12.20M+k k≤7999), so '
  + 'smoke 12,208,000+k (0..39) + battery 12,210,000+k (single block, ≤ 12,217,999) suffice — no sub-block partition '
  + 'needed. ONE seed runs all five arms (paired). Stats bootstrap 101003, reserved 101103; disjoint from every arc '
  + 'stats seed. Match-duration OMITTED on real runs ⇒ src default 240; the env override is preflight-only.',
  'X-FAMILY (inherited): X-DET wall-free (#128; machine-dependent wall stripped from the compare + SHA); X-MERGE-IDENT '
  + '(the merged table read on R3p + PRIOR); E-NONSTATION refined form on the eye arms (exercised on the PRIOR eye — '
  + 'both bits + homePrior armed); X-FP-PROD (57b0bdab…c673 unchanged; the flag/gene absent in production); X-OFF-IDENT '
  + '(R0 == bare enriched); X-SRC-ZERO (empty src diff — the map/prior seams are BANKED, this probe adds ZERO src); '
  + 'eye-never-touches-ball (every armed arm, incl. PRIOR); seed disjointness. Road B: nothing ships.',
];

function main(): void {
  if (MODE !== 'smoke' && MODE !== 'battery') {
    throw new Error(`A4P3_MODE must be explicitly 'smoke' or 'battery' (no default); got '${MODE ?? ''}'`);
  }
  if (IS_BATTERY && !(N_REQUESTED >= 1)) {
    throw new Error('battery mode requires A4P3_N ≥ 1 (the disclosed-rule N* from the smoke; no default)');
  }
  if (!(MATCHES >= 1)) throw new Error(`no matches to run (MATCHES=${MATCHES}); check A4P3_MATCH_CAP`);

  // --- PREFLIGHT-ONLY per-side bias audit (A4P3_BODY_LOG=1) ---
  // Proves the prior binds BOTH sides in a PRIOR arm (each side's index-1 body diverges
  // from R3p under the home-ward bias). Prints to stderr; touches NOTHING canonical.
  if (BODY_LOG) {
    const seed = SMOKE_START;
    process.stderr.write(`A4-P3 BODY-LOG · seed ${seed} · priorEquivalence ${JSON.stringify(buildPriorEquivalence())}\n`);
    for (const side of [0, 1] as const) {
      const base = runMatch(seed, 'R3p', newStationEyeTrace(), null, null, null);
      const prior = runMatch(seed, 'PRIOR', newStationEyeTrace(), null, null, null);
      const bR = base.sides[side].restSlotShare;
      const pR = prior.sides[side].restSlotShare;
      process.stderr.write(
        `A4-P3 BODY-LOG · side ${side} · R3p restSlot ${round(bR, 4)} · PRIOR restSlot ${round(pR, 4)}`
        + ` · Δ ${round(pR - bR, 4)} · sigDiff ${base.signature !== prior.signature}\n`,
      );
    }
  }
  run();
}

const isMain = (() => {
  try { return import.meta.url === pathToFileURL(process.argv[1] ?? '').href; } catch { return false; }
})();
if (isMain) main();

export {
  armEye, xMergeShaPerArm, buildMergeSha, buildPriorEquivalence, applyPrior, setObedience,
  playArmLight, runMatch, computeSmokeScience, computeSizing, computeWallDerived, computeBattery,
  classifyDisposition, ledgerOf, seedDisjointness, buildSeeds, matchOf, signatureOf, limbValue, phi,
};
