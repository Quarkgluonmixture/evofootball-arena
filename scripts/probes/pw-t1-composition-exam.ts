/**
 * ⭐⭐ PW-T1 — THE COMPOSITION EXAM: THE PASS-WEIGHT AXIS IN THE v7 WORLD
 * (docs/world-model/PW-T1-COMPOSITION-EXAM.md).
 *
 * Authorized by ruling #294 §5 for EXACTLY this stage — INSTRUMENT-ONLY (ZERO src edits; the
 * seam is banked and pinned by PW-T0b/PW-T0c). Arms: v7 (base) vs v7+PW (slice), SAME seeds,
 * paired. H-PW.1 is SCORED here (contract §1); every H-PW.2 face is REPORTED and no gate reads
 * one.
 *
 * ⭐ THE BRIEF'S OWN CITATIONS, VERIFIED AS THE FIRST ACT (#291.5 / #292.1 — the citation hunt
 *    stands at SEVEN strikes and covers dispatch prompts):
 *      · "#294.5 is the spec"            → RULING #294 item 5 (the PW-T1 dispatch). VERIFIED.
 *      · "the DEFAULT ladder only"       → #294 item 3 + PW-T0c §CORRECTIONS 2 (verbatim:
 *                                          "do NOT set pwPowerLadder ... the exam runs the
 *                                          default ladder"). VERIFIED — this probe NEVER sets
 *                                          `pwPowerLadder` (asserted by `gLadder`).
 *      · "the closure equation, binding"  → #294 item 3 + PW-T0c §CORRECTIONS 5. VERIFIED.
 *      · "12,494,000 RETIRED AS TAINTED"  → #294 item 4 (retired) + item 3 (the verifier's own
 *                                          walks). VERIFIED — this stage books from 12,495,000.
 *      · "forward-shifted mix PREDICTED"  → #291 item 3, verbatim. VERIFIED.
 *      · "the region may be THIN"         → #292 item 4 clause (d), verbatim. VERIFIED.
 *      · "execution honesty routed here"  → #291 item 1 + PW-C0 §CORRECTIONS 1. VERIFIED.
 *      · "the denominator-stable face"    → PW-C0 §CORRECTIONS 2 (outfield backward END-TO-END
 *                                          conversion, L4/L1). VERIFIED.
 *      · "terminals are veto-entangled"   → BU-C0 §CORRECTIONS 3. VERIFIED.
 *      · "xSrcUntouched corrected form"   → BU-C0 §CORRECTIONS 5 / #286 item 1. VERIFIED.
 *    NO LOOSE CITE FOUND IN THIS BRIEF; the hunt stays at seven.
 *
 * ORDER OF PROOF (binding, #294 §5):
 *   1. ⭐⭐ FIRST — the M-BU.2-form lifecycle/doors proof at the CB+L3+PW composition: the FULL
 *      2^6 power set of this composition's doors (C · T · S · L · V · ⭐W) × seeds, the
 *      byte-inertness of every door without its partner, the PW door's own SEAM-INERTNESS law
 *      (door shut ⇒ the chooser ledger is all-zero and no weight is ever deposited), and the CB
 *      arming-lifecycle receipts riding along. #287.3 discharged CB+L3+DV and #289 CB+L3+MT;
 *      THIS COMPOSITION IS NEW. A defect ⇒ exit 4, nothing is written.
 *   2. DORMANCY / ZERO-SRC: `xSrcUntouched` in the #286.1-CORRECTED form
 *      (`git diff --stat HEAD -- src` AND `git status --porcelain -- src`).
 *   3. The freeze commit, then the battery. The battery never changes the design.
 *   4. ⭐⭐ THE CLOSURE EQUATION over the FULL battery, per arm (#294 item 3 / PW-T0c
 *      §CORRECTIONS 5): deposits(non-default) = struck + windup-voided + abandoned + in-flight.
 *      A NON-ZERO SILENT-LOSS RESIDUE IS STAGE-STOPPING ⇒ exit 5.
 *
 * ⭐ #283.2(iv): every match is constructed DIRECTLY with its `matchFlags` and the arming is
 *    ASSERTED LIVE on the very match the walk measures.
 * ⭐ #287.1: `gFaces` PARSES THE SERIALIZED ARTIFACT off disk and re-derives every face.
 * ⭐ #294.1: every artifact field carries the unit its name claims (a `bytes` field holds bytes).
 * ⭐ #289: plumbing receipts are NEVER effect sizes; data-source guards hash FILE BYTES.
 * ⭐ #288: every starred finding states |Δ| ÷ half-width (published by machine per face).
 * ⭐ #270: nothing is written to `info.genome`.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: PWT1_MODE (smoke|full, REQUIRED) · PWT1_N · PWT1_OUT.
 *   ANY other `PWT1_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: PWT1_MODE=full npx tsx scripts/probes/pw-t1-composition-exam.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal ·
 *       4 = the arming-lifecycle class BIT at this composition · 5 = ⭐⭐ THE CHOICE LEDGER DID
 *       NOT CLOSE (a silent-loss residue — STAGE-STOPPING, #294 item 3).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import {
  BALL_FRICTION_K, DT, HALF_L, HALF_W, MATCH_DURATION, PASS_POWER_EXECUTED_MAX,
  PASS_POWER_EXECUTED_MIN, PASS_POWER_MAX, PASS_POWER_MIN, PASS_POWER_NOISE_K,
  TOUCH_CONTROL_DIST,
} from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, a4ArmedVersion, l3ArmedVersion, poolT1DoseCells,
  setCbProneness, CB_WORLD_DOSE, L3_WORLD_VERSION, L3_T1_SHA, type L3DoseCell,
} from '../../src/game/a4World';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import { passChoiceCandidateGids } from '../../src/ai/perceivedPassChoice';
import { choosePassWeight } from '../../src/ai/passWeightChooser';
import { kickMisalignment, orientationPowerMul } from '../../src/sim/mechanics';
import { clamp } from '../../src/utils/math';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type { V2 } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['PWT1_MODE', 'PWT1_N', 'PWT1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PWT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('PW-T1 FATAL — refused env surface. '
    + `rogue PWT1_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PWT1_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`PW-T1 FATAL — PWT1_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.PWT1_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PWT1_N, 10)) : null;
const OUT_ENV = process.env.PWT1_OUT;
const OVERRIDE_REASONS = [
  ...(N_ENV !== null ? ['PWT1_N'] : []),
  ...(OUT_ENV !== undefined ? ['PWT1_OUT'] : []),
];
const IS_PREFLIGHT = OVERRIDE_REASONS.length > 0;
const PREFLIGHT_REASONS = OVERRIDE_REASONS;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pw-t1-composition-exam-smoke.json',
  full: 'docs/world-model/data/pw-t1-composition-exam.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pw-t1-override.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner('PW-T1 FATAL — an OVERRIDE invocation may not write a canonical repo path '
    + `(the canonical-write guard). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 SMALL HELPERS                                                            */
/* ========================================================================== */
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
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const dist2 = (a: Readonly<V2>, b: Readonly<V2>): number => Math.hypot(a.x - b.x, a.y - b.y);
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 TRACED CONSTANTS — imported, or EXTRACTED from src/** at run time (#200)  */
/* ========================================================================== */
const CONST_SRC_PATH = 'src/sim/constants.ts';
const MATCH_SRC_PATH = 'src/sim/Match.ts';
const MECH_SRC_PATH = 'src/sim/mechanics.ts';
const BRAIN_SRC_PATH = 'src/ai/PlayerBrain.ts';
const CHOOSER_SRC_PATH = 'src/ai/passWeightChooser.ts';
const CONST_SRC = readFileSync(CONST_SRC_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_SRC_PATH, 'utf8');
const CHOOSER_SRC = readFileSync(CHOOSER_SRC_PATH, 'utf8');
const lineOf = (src: string, re: RegExp): number => {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return 0;
};
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  return m === null ? Number.NaN : Number(m[1]);
};
/** ⭐ THE PRESSURE RADIUS — #173 / Q14's own "under pressure" switch, the engine's constant. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
const PRESSURE_R_LINE = lineOf(CONST_SRC, /export const TOUCH_CONTROL_DIST = [\d.]+;/);
/** ⭐⭐ Q07'S OWN ±2 m BAND, EXTRACTED FROM THE ENGINE'S OWN FORWARD-PASS LINE — never typed. */
const FORWARD_BAND_M = extractNum(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > (\d+(?:\.\d+)?)\)/);
const FORWARD_BAND_LINE = lineOf(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > \d/);
/** ⭐ THE DISPLAY CLOCK — the 90 read out of the engine's own `Match.minute()` expression. */
const DISPLAY_MINUTES = extractNum(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* (\d+)\)\)/);
const DISPLAY_MINUTES_LINE = lineOf(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* \d+\)\)/);
/** 1 sim-second = this many display-seconds (22.5 at the shipped clock). */
const DISPLAY_S_PER_SIM_S = (DISPLAY_MINUTES * 60) / MATCH_DURATION;
/** #173's own foul-attribution lookahead, inherited with the spell walker. */
const FOUL_LOOKAHEAD_TICKS = 6;
/** the pressed-carrier sampling cadence (declared; 12 ticks = 0.2 sim-s). */
const CARRIER_SAMPLE_TICKS = 12;
/** the behind-ball option histogram's top bucket (k >= this is pooled into the last cell). */
const HIST_MAX = 5;

/** ⭐ THE ARMING-LIFECYCLE SITES, TRACED to `src/**` at run time (never asserted from memory). */
const ARM_SITE_LINE = lineOf(BRAIN_SRC, /match\.armTouchPast\(p, knockDir!, knockBack\);/);
const CLEAR_SITE_LINE = lineOf(BRAIN_SRC, /else match\.clearTouchPastArming\(p\);/);
const FIRE_SITE_LINE = lineOf(MATCH_SRC, /mech\.performTouchPast\(this, o, aim\);/);
const CLEAR_IMPL_LINE = lineOf(MATCH_SRC, /clearTouchPastArming\(p: Player\): void \{/);
/** ⭐⭐ THE PW SEAM'S OWN LINES, traced: the ONE deposit, the ONE consumption, the sweep. */
const PW_DEPOSIT_LINE = lineOf(
  BRAIN_SRC, /match\.pwStrikePower = \{ gid: p\.gid, power: pw\.power, tick: match\.simTick \};/);
const PW_CONSUME_LINE = lineOf(MATCH_SRC, /struckPower = pw\.power;/);
const PW_SWEEP_LINE = lineOf(MATCH_SRC, /this\.pwChooserLedger\.depositsAbandoned\+\+;/);
const PW_VOID_IMPL_LINE = lineOf(MATCH_SRC, /private pwNoteWindupChoiceVoid\(/);

/**
 * ⭐⭐ THE LADDER — the ENGINE'S OWN canary ladder. It is a module-private const in
 * `PlayerBrain`, so it is (i) rebuilt from the SHIPPED clamp constants and (ii) cross-checked
 * against the brain's own literal, extracted from source. `pwPowerLadder` is NEVER set by this
 * probe (#294 item 3 / PW-T0c §CORRECTIONS 2), so THIS is the ladder the exam world runs.
 */
const LADDER: readonly number[] = [PASS_POWER_MIN, 1, PASS_POWER_MAX];
const CANARY_LINE = lineOf(BRAIN_SRC, /const PASS_CANARY_POWERS: readonly number\[\] =/);
const CANARY_LITERAL = (
  /const PASS_CANARY_POWERS: readonly number\[\] = (\[[^\]]*\]);/.exec(BRAIN_SRC)?.[1] ?? ''
).trim();
const CANARY_LITERAL_MATCHES = CANARY_LITERAL === '[PASS_POWER_MIN, 1, PASS_POWER_MAX]';
const REFERENCE_INDEX = LADDER.indexOf(1);
const RUNG_LABELS = ['floor 0.85', 'reference 1.00', 'ceiling 1.15'] as const;

/* ========================================================================== */
/* §3 THE FROZEN DESIGN — seeds, stats stream, sizing                          */
/* ========================================================================== */
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
/** ⭐ #289 CANON: a data-source guard hashes FILE BYTES, not a field of the parsed object. */
const T1_FILE_BYTES_SHA =
  'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';

const BOOTSTRAP = 2000;
const STATS_BASE = 112_800;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600, 111_800,
  112_000, 112_200, 112_400, 112_600,
];

/** ⭐ #294 item 4: PW-T1 BOOKS FROM 12,495,000. The 12,494,000 block is RETIRED AS TAINTED. */
const BATTERY_BASE = 12_495_100;
const SMOKE_BASE = 12_495_000;
const GUARD_BASE = 12_495_020;
const GUARD_SPAN = 20;
/** ⭐ the ARMING-LIFECYCLE / DOORS-MATRIX block — its own seeds, walked BEFORE the battery. */
const LIFECYCLE_BASE = 12_495_500;
const LIFECYCLE_SEEDS_FULL = 3;
const GWORLD_SEED = 12_495_900;
const N_FROZEN = 200;
/** how many paired seeds the NON-PERTURBATION control re-walks WITHOUT the instruments. */
const PERTURB_CHECK_SEEDS = 25;

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'the pre-BU programme bands (#65 … #283)', range: [8_500_000, 12_485_999] },
  { name: 'BU-C0 reception-option census (#285.2/#286)', range: [12_486_000, 12_486_999] },
  { name: 'BU-T0 DV-in-v7 composition (#286.5/#287.5)', range: [12_487_000, 12_487_999] },
  { name: 'BU-T0b price separation (#287.6/#288.6)', range: [12_488_000, 12_488_999] },
  { name: 'BU-T1 MT composition (#288.7/#289)', range: [12_489_000, 12_489_999] },
  { name: 'PW-C0 weight-physics census (#290.3/#291)', range: [12_490_000, 12_490_999] },
  { name: 'PW-T0a preference census (#291.6/#292)', range: [12_491_000, 12_491_999] },
  { name: 'PW-T0b weight chooser (#292.4/#293)', range: [12_492_000, 12_492_999] },
  { name: 'PW-T0c amendment receipts (#293.3/#294)', range: [12_493_000, 12_493_999] },
  { name: '⭐ RETIRED AS TAINTED — the PW-T0c verifier\'s walks (#294 item 4)',
    range: [12_494_000, 12_494_999] },
];

/* ========================================================================== */
/* §4 THE DOSES — from COMMITTED artifacts / the shipped entry, never typed     */
/* ========================================================================== */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐ THE L3 MATURED DOSE — the SHIPPED entry's own pooled cells (`poolT1DoseCells`). */
const T1_BYTES = readFileSync(T1_PATH, 'utf8');
const T1_BYTES_SHA = sha(T1_BYTES);
const T1_BYTE_LENGTH = Buffer.byteLength(T1_BYTES, 'utf8');
const T1_FILE = JSON.parse(T1_BYTES) as Record<string, unknown>;
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(T1_FILE);
const L3_DOSE_LABELS = sum(L3_DOSE.map((c) => c.lunges));

/* ========================================================================== */
/* §5 THE ARMS — constructed DIRECTLY with matchFlags (#283.2(iv))              */
/* ========================================================================== */
/**
 * | arm     | construction                                                              |
 * |---------|---------------------------------------------------------------------------|
 * | `v7`    | `new Match({seed, teams, ...a4MatchFlags(7)})` + `armA4World(m,null,7,L3)`   |
 * | `v7pw`  | THE SAME, plus the ONE door `pwWeightChooser` — nothing else. NO ladder key. |
 *
 * ⭐⭐ THE SLICE IS EXACTLY ONE FLAG. PW-T0c proved (a digest, not an argument) that with the
 * ladder collapsed to {1} the armed world is BYTE-IDENTICAL to the door-shut world, so with the
 * DEFAULT ladder every difference between these two arms is A RUNG and nothing else: same
 * objective (`pricePassOption` under the world's own flags), same candidate set, same tie-break.
 */
const ARMS = ['v7', 'v7pw'] as const;
type ArmKind = (typeof ARMS)[number];
const isPw = (a: ArmKind): boolean => a === 'v7pw';
const matchCfg = (seed: number, arm: ArmKind): ConstructorParameters<typeof Match>[0] => ({
  seed,
  teamA: team('A', seed * 2 + 1),
  teamB: team('B', seed * 2 + 2),
  ...a4MatchFlags(L3_WORLD_VERSION),
  ...(isPw(arm) ? { pwWeightChooser: true } : {}),
});

/** the franchise genome view, for the house-law-#270 conjunct. */
const infoGenomeOf = (m: Match, s: Side): Record<string, unknown> =>
  m.teams[s].info.genome as unknown as Record<string, unknown>;

/** ⭐⭐ THE ARM-IDENTITY CONJUNCTS, ASSERTED ON THE MATCH THE WALK MEASURES (#283.2(iv)). */
const armConjuncts = (m: Match, arm: ArmKind): Record<string, boolean> => {
  const mm = m as unknown as {
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    cbChoiceSeat: boolean; cbTouchPast: boolean; cbCommitPhysics: boolean;
    dvLearnedMap: boolean; dvDeliveryValue: boolean; dvLearn: unknown;
    pmLaneConvergence: boolean; mtMarkSag: boolean; ptpPassLead: boolean;
    o1PassWindup: boolean; edsValueAxis: boolean;
    pwWeightChooser: boolean; pwPowerLadder: readonly number[] | null;
    pwStrikePower: unknown; forcedTouchPast: unknown;
  };
  const want = isPw(arm);
  const l3Dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => L3_DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  const genomeClean = ([0, 1] as const).every((s) => {
    const g = infoGenomeOf(m, s);
    return g.markSag === undefined && g.defLaneConvergence === undefined
      && g.cbCarryProneness === undefined && g.dvLossBelief === undefined;
  });
  const cbDosed = ([0, 1] as const).every((s) =>
    (m.teams[s].effGenome as TacticalGenome).cbCarryProneness === CB_WORLD_DOSE);
  return {
    theArmIsTheWorldSevenOfRecord: l3ArmedVersion(m) === L3_WORLD_VERSION
      && a4ArmedVersion(m) === L3_WORLD_VERSION,
    bothL3DoorsAreLiveInThisSim: mm.l3DefenceLearn && mm.l3DefenceVeto && mm.l3Defence !== null,
    theThreeCbDoorsAreLiveInThisSim: mm.cbChoiceSeat && mm.cbTouchPast && mm.cbCommitPhysics,
    theL3BooksCarryTheMaturedDose: l3Dosed,
    theCbSeatCarriesItsDeclaredProneness: cbDosed,
    theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
    noDoseIsInTheFranchiseGenome: genomeClean,
    noArmingExistsAtConstruction: mm.forcedTouchPast === null && mm.pwStrikePower === null,
    theDvSeamIsUnarmedOnBothArms: !mm.dvLearnedMap && !mm.dvDeliveryValue && mm.dvLearn === null,
    theMtFamilyIsUnarmedOnBothArms: !mm.pmLaneConvergence && !mm.mtMarkSag,
    /** ⭐ PW-T0c clause (d): PTP × PW is an unsupported composition; PTP must stay shut. */
    thePtpDoorIsShutOnBothArms: !mm.ptpPassLead,
    /** ⭐ the exam world IS a wind-up world (the pendingPass path is the MAIN path, #293.8). */
    theWindUpPathIsLiveInThisSim: mm.o1PassWindup,
    /** ⭐ the world's OWN objective is the armed value axis — what PW-T0c re-based onto. */
    theWorldsOwnValueAxisIsArmed: mm.edsValueAxis,
    /** ⭐⭐ THE SLICE'S OWN DOOR, and NOTHING ELSE. */
    thePwDoorMatchesThisArm: mm.pwWeightChooser === want,
    /** ⭐⭐ #294 item 3: the exam runs the DEFAULT ladder — the key is never set, on any arm. */
    thePowerLadderKeyIsNeverSet: mm.pwPowerLadder === null,
  };
};

/* ========================================================================== */
/* §6 THE ARMING-LIFECYCLE READ (the M-BU.2 debt, at a NEW composition)         */
/* ========================================================================== */
/**
 * THE STALENESS CLASS (CB-T2 §CORRECTIONS (iv)): `Match.forcedTouchPast` is a SINGLE
 * match-scoped slot, written by the CB-T2 choice seat, withdrawn at that same site, consumed by
 * the ONE fork in `Match.stepBall`. A world that arms OTHER seams beside it may take an EARLY
 * RETURN above the seat's block, so the withdrawal never runs and an aim survives its own tick.
 * #287.3 discharged CB+L3+DV; #289 discharged CB+L3+MT; ⭐ CB+L3+PW IS NEW, so it is re-taken in
 * full — AND the PW seam's own deposit slot (`pwStrikePower`) is read at the same boundary,
 * because it is the same idiom and the same hazard class.
 */
interface Lifecycle {
  ticks: number;
  carryOvers: number;
  carryOverAcrossOwnerChange: number;
  carryOverAcrossPhaseChange: number;
  maxArmingAgeTicks: number;
  armedAtWhistle: number;
  armedAtConstruction: number;
  armings: number; armingsCleared: number; seats: number; touchPasts: number;
  /** ⭐ THE PW SEAM'S OWN SLOT, at the same step boundary. */
  pwDepositLiveAtStepBoundary: number;
  pwDepositLiveAtWhistle: number;
  pwWindupLiveAtWhistle: number;
}
const EMPTY_LIFECYCLE: Lifecycle = {
  ticks: 0, carryOvers: 0, carryOverAcrossOwnerChange: 0, carryOverAcrossPhaseChange: 0,
  maxArmingAgeTicks: 0, armedAtWhistle: 0, armedAtConstruction: 0,
  armings: 0, armingsCleared: 0, seats: 0, touchPasts: 0,
  pwDepositLiveAtStepBoundary: 0, pwDepositLiveAtWhistle: 0, pwWindupLiveAtWhistle: 0,
};
const addLifecycle = (a: Lifecycle, b: Lifecycle): void => {
  for (const k of Object.keys(a) as (keyof Lifecycle)[]) {
    a[k] = k === 'maxArmingAgeTicks' ? Math.max(a[k], b[k]) : a[k] + b[k];
  }
};

/** ⭐ THE PW CHOICE LEDGER, read off the engine at the whistle (the CLOSURE EQUATION's terms). */
const PW_LEDGER_KEYS = ['decisions', 'depositsNonDefault', 'struckAtChosenPower',
  'windupChoiceVoided', 'depositsAbandoned', 'inFlightAtWhistle', 'windupCarried',
  'mateSwitches', 'matesPriced', 'matesNotExecutable', 'referenceAdmissionsWithoutOracleRead',
  'rungsWithoutReferenceNormaliser', 'pairsLive', 'matesLive', 'pairsLiveOnlyOffReference',
  'matesLiveOnlyOffReference', 'pairsAdmittedOnlyOffReference', 'matesAdmittedOnlyOffReference',
  'pairsDroppedForOtherRungRefusal'] as const;
type PwLedgerKey = (typeof PW_LEDGER_KEYS)[number];
type PwLedger = Record<PwLedgerKey, number> & { chosenByRung: number[] };
const emptyPwLedger = (): PwLedger => ({
  ...(Object.fromEntries(PW_LEDGER_KEYS.map((k) => [k, 0])) as Record<PwLedgerKey, number>),
  chosenByRung: new Array<number>(LADDER.length).fill(0),
});
const addPwLedger = (a: PwLedger, b: PwLedger): void => {
  for (const k of PW_LEDGER_KEYS) a[k] += b[k];
  for (let i = 0; i < a.chosenByRung.length; i++) a.chosenByRung[i] += b.chosenByRung[i] ?? 0;
};
/**
 * Read the engine's own ledger + the two IN-FLIGHT slots at the whistle. ⭐ `inFlightAtWhistle`
 * is the closure equation's fourth column: a non-default weight still sitting in the deposit
 * slot, or riding a wind-up that never resolved.
 */
const readPwLedger = (m: Match): PwLedger => {
  const led = m.pwChooserLedger as unknown as Record<string, number | number[]>;
  const dep = m.pwStrikePower;
  const wind = m.pendingPassWindup;
  const out = emptyPwLedger();
  for (const k of PW_LEDGER_KEYS) {
    if (k === 'inFlightAtWhistle') continue;
    out[k] = Number(led[k] ?? 0);
  }
  out.inFlightAtWhistle = (dep !== null && dep.power !== 1 ? 1 : 0)
    + (wind !== null && wind.powerChoice !== 1 ? 1 : 0);
  const byRung = (led.chosenByRung ?? []) as number[];
  for (let i = 0; i < out.chosenByRung.length; i++) out.chosenByRung[i] = Number(byRung[i] ?? 0);
  return out;
};

/* ========================================================================== */
/* §7 THE ORACLE — THE ENGINE'S OWN PASS MACHINERY (#256.2), GK-SPLIT (#286.1)  */
/* ========================================================================== */
const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
    if (d < best) best = d;
  }
  return best;
};

/**
 * ONE option census at ONE moment — BU-C0's ladder VERBATIM in definition (commensurable with
 * the committed census, with BU-T0 / BU-T0b / BU-T1), with the GK split at every behind-ball
 * rung (#286.1's debt). L1 POSITION (Q07's own ±2 m band, EXTRACTED from src) · L2 the engine's
 * own flight prediction · L3 `arrivalMargin > 0` · L4 the engine's corridor sampler.
 *
 * ⭐ ONE DECLARED ADDITION, not a redefinition: the LATERAL lane carries the SAME four rungs
 * (and its own GK split), because H-PW.1 (b) is scored on backward AND LATERAL corridor
 * survival. The backward rows are bit-for-bit BU-C0's; the lateral rows are the same functions
 * applied to the lane BU-C0 only ever published at L4.
 */
interface OptionCensus {
  mates: number;
  behind: number; lateral: number; ahead: number;
  behindFlight: number; behindRace: number; behindUncut: number;
  behindGk: number; behindFlightGk: number; behindRaceGk: number; behindUncutGk: number;
  behindUncutInWindow: number;
  lateralGk: number; lateralFlight: number; lateralFlightGk: number;
  lateralRace: number; lateralRaceGk: number; lateralUncut: number; lateralUncutGk: number;
  aheadFlight: number; aheadRace: number; aheadUncut: number;
  raceAll: number; uncutAll: number;
  oracleCalls: number; oracleNulls: number; corridorCalls: number;
  deltaSum: number; marginSumBehind: number;
}
const CENSUS_KEYS = [
  'mates', 'behind', 'lateral', 'ahead', 'behindFlight', 'behindRace', 'behindUncut',
  'behindGk', 'behindFlightGk', 'behindRaceGk', 'behindUncutGk', 'behindUncutInWindow',
  'lateralGk', 'lateralFlight', 'lateralFlightGk', 'lateralRace', 'lateralRaceGk',
  'lateralUncut', 'lateralUncutGk', 'aheadFlight', 'aheadRace', 'aheadUncut',
  'raceAll', 'uncutAll', 'oracleCalls', 'oracleNulls', 'corridorCalls',
  'deltaSum', 'marginSumBehind',
] as const;
const EMPTY_CENSUS: OptionCensus = Object.fromEntries(
  CENSUS_KEYS.map((k) => [k, 0]),
) as unknown as OptionCensus;

const censusAt = (m: Match, carrier: Player): OptionCensus => {
  const t = m.teams[carrier.side];
  const opp = m.teams[(1 - carrier.side) as Side];
  const truth = capturePerceptionTruth(m);
  const snapshot = oraclePerceptionSnapshot(truth, carrier.gid);
  const profiles = m.reachProfiles();
  const windowGids = new Set(passChoiceCandidateGids(carrier, t.players));
  const ballLocalX = t.localX(m.ball.pos.x);
  const out: OptionCensus = { ...EMPTY_CENSUS };
  for (const mate of t.players) {
    if (mate === carrier || mate.sentOff) continue;
    out.mates += 1;
    const delta = t.localX(mate.pos.x) - ballLocalX;
    out.deltaSum += delta;
    const isBehind = delta <= -FORWARD_BAND_M;
    const isAhead = delta >= FORWARD_BAND_M;
    const isLateral = !isBehind && !isAhead;
    const isGk = mate.role === 'GK';
    if (isBehind) { out.behind += 1; if (isGk) out.behindGk += 1; }
    else if (isAhead) out.ahead += 1;
    else { out.lateral += 1; if (isGk) out.lateralGk += 1; }
    out.oracleCalls += 1;
    const res = evaluatePassAffordance({
      snapshot,
      passerGid: carrier.gid,
      targetGid: mate.gid,
      attackDir: t.attackDir,
      reachProfiles: profiles,
    });
    if (res === null) { out.oracleNulls += 1; continue; }
    if (!res.flight.reachable) continue;
    if (isBehind) { out.behindFlight += 1; if (isGk) out.behindFlightGk += 1; }
    else if (isLateral) { out.lateralFlight += 1; if (isGk) out.lateralFlightGk += 1; }
    else out.aheadFlight += 1;
    if (res.affordance.arrivalMargin <= 0) continue;
    out.raceAll += 1;
    if (isBehind) {
      out.behindRace += 1;
      if (isGk) out.behindRaceGk += 1;
      out.marginSumBehind += res.affordance.arrivalMargin;
    } else if (isLateral) { out.lateralRace += 1; if (isGk) out.lateralRaceGk += 1; }
    else out.aheadRace += 1;
    let cut = false;
    for (const d of opp.players) {
      if (d.sentOff) continue;
      out.corridorCalls += 1;
      const facts = evaluatePassCorridorInterception({
        snapshot,
        passerGid: carrier.gid,
        targetGid: mate.gid,
        defenderGid: d.gid,
        reachProfiles: profiles,
      });
      if (facts !== null && facts.earliestFeasiblePoint !== null) { cut = true; break; }
    }
    if (cut) continue;
    out.uncutAll += 1;
    if (isBehind) {
      out.behindUncut += 1;
      if (windowGids.has(mate.gid)) out.behindUncutInWindow += 1;
      if (isGk) out.behindUncutGk += 1;
    } else if (isAhead) out.aheadUncut += 1;
    else { out.lateralUncut += 1; if (isGk) out.lateralUncutGk += 1; }
  }
  return out;
};
const addCensus = (a: OptionCensus, b: OptionCensus): void => {
  for (const k of CENSUS_KEYS) a[k] += b[k];
};

/* ========================================================================== */
/* §7b ⭐⭐ THE STRIKE CAMERA — REAL STRUCK BALLS, AT THE STRIKE ITSELF          */
/* ========================================================================== */
/**
 * H-PW.1 (a) is about REAL STRIKES, never oracle preferences, so the instrument is a CAMERA on
 * the engine's own strike: a `Match` subclass that reads state BEFORE delegating to `super`. It
 * writes nothing, draws no RNG (the executed-power re-derivation uses a CLONE of the engine's
 * rng at its pre-strike state) and its non-perturbation is PROVEN, not asserted (`gNonPerturbing`
 * re-walks the same worlds with every instrument off and compares world signatures).
 *
 * ⭐ THE OBSERVATION LEDGER (the emergence receipt, #293.2's routing) needs the CHOSEN
 * candidate's census-grain liveness, which the engine's aggregate ledger cannot supply. So at
 * the exact moment a PW deposit exists — the strike itself, or the wind-up ARM (the decision
 * tick for a wound-up ball) — the camera RE-RUNS `choosePassWeight` with the caller's own
 * inputs and links the result to the strike by (mate, power) agreement. A row that does not
 * agree is counted as UNLINKED and published, never silently dropped.
 */
interface RerunObs {
  ok: boolean;
  targetGid: number;
  power: number;
  powerIndex: number;
  /** the chosen pair is live on the CENSUS ladder (race ∧ corridor) at its own rung */
  chosenLive: boolean;
  /** the same mate is live on the census ladder at the REFERENCE rung */
  mateLiveAtReference: boolean;
  /** ⭐ the chosen ball is alive ONLY at its own rung — the admission the weight bought */
  chosenLiveOnlyAtItsRung: boolean;
  candidates: number;
  matesPriced: number;
  matesNotExecutable: number;
}
const rerunChoice = (m: Match, p: Player): RerunObs | null => {
  const t = m.teams[p.side];
  const opp = m.teams[(1 - p.side) as Side];
  const gids = passChoiceCandidateGids(p, t.players);
  if (gids.length === 0) return null;
  const scope = new Set<number>([p.gid, ...gids]);
  for (const o of opp.players) if (!o.sentOff) scope.add(o.gid);
  const snapshot = m.perceivedSnapshot(p, scope);
  if (snapshot === null) return null;
  const reachProfiles = m.reachProfiles();
  const orientationMul = new Map<number, number>();
  for (const gid of gids) {
    const seenMate = snapshot.players.find((e) => e.gid === gid);
    const seenSelf = snapshot.players.find((e) => e.gid === p.gid);
    if (seenMate === undefined || seenSelf === undefined) continue;
    const dx = seenMate.pos.x - seenSelf.pos.x;
    const dy = seenMate.pos.y - seenSelf.pos.y;
    const dl = Math.hypot(dx, dy);
    if (!(dl > 1e-6)) continue;
    orientationMul.set(gid, orientationPowerMul(
      kickMisalignment(p, { x: dx / dl, y: dy / dl }), p.attrs.passing,
    ));
  }
  const pw = choosePassWeight({
    snapshot,
    passerGid: p.gid,
    candidateGids: gids,
    attackDir: t.attackDir,
    reachProfiles,
    powers: LADDER,
    valueAxis: m.edsValueAxis,
    orientationMul,
  });
  if (pw === null) return null;
  const chosen = pw.candidates.find(
    (c) => c.targetGid === pw.targetGid && c.powerIndex === pw.powerIndex);
  const mateLiveAtReference = pw.candidates.some(
    (c) => c.targetGid === pw.targetGid && c.powerIndex === REFERENCE_INDEX
      && c.liveOnCensusLadder);
  const chosenLive = chosen !== undefined && chosen.liveOnCensusLadder;
  return {
    ok: true,
    targetGid: pw.targetGid,
    power: pw.power,
    powerIndex: pw.powerIndex,
    chosenLive,
    mateLiveAtReference,
    chosenLiveOnlyAtItsRung: chosenLive && !mateLiveAtReference
      && pw.powerIndex !== REFERENCE_INDEX,
    candidates: pw.candidates.length,
    matesPriced: pw.matesPriced,
    matesNotExecutable: pw.matesNotExecutable,
  };
};

/** ONE real struck ball. Every field is read at the strike, from the engine's own state. */
interface StrikeRow {
  tick: number;
  passerGid: number;
  passerSide: Side;
  mateGid: number;
  /** the INTENDED weight — the chooser's deposit if there is one, else the caller's literal */
  intended: number;
  /** index of `intended` in the engine's own canary ladder (−1 = off-ladder, published) */
  rung: number;
  fromWindup: boolean;
  pwChosen: boolean;
  direction: 'forward' | 'backward' | 'lateral';
  pressed: boolean;
  distance: number;
  orientation: number;
  /** the EXECUTED multiplier, re-derived from a CLONE of the engine's rng (no draw consumed) */
  executed: number;
  expectedSpeed: number;
  observedSpeed: number;
  relError: number;
  /** the engine's own closed form: D∞ = v / BALL_FRICTION_K (carryBeat.ts) */
  dInfinity: number;
  dInfinityPastReceiver: number;
  rollOutEndpointOutsidePitch: boolean;
  obs: RerunObs | null;
  linked: boolean;
  outcome: 'completed' | 'lost' | 'retained' | 'outOfPlay' | 'superseded' | 'atWhistle' | '';
}

class TracedMatch extends Match {
  readonly strikes: StrikeRow[] = [];
  measure = true;
  private o1StruckSeen = 0;
  private armObs: { gid: number; tick: number; obs: RerunObs | null } | null = null;

  override armPendingPass(passer: Player, mate: Player, offsideExempt = false): void {
    const dep = this.pwStrikePower;
    if (
      this.measure && this.pwWeightChooser && dep !== null
      && dep.gid === passer.gid && dep.tick === this.simTick
    ) {
      this.armObs = { gid: passer.gid, tick: this.simTick, obs: rerunChoice(this, passer) };
    }
    super.armPendingPass(passer, mate, offsideExempt);
  }

  override performPass(
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<V2> | null = null,
  ): void {
    // The engine's own guard: no strike, no receipt row.
    const willStrike = this.ball.owner === p && p.kickCooldown <= 0;
    const fromWindup = this.o1WindupLedger.struck > this.o1StruckSeen;
    this.o1StruckSeen = this.o1WindupLedger.struck;
    const dep = this.pwStrikePower;
    const hasDeposit = this.pwWeightChooser && dep !== null
      && dep.gid === p.gid && dep.tick === this.simTick;
    const intended = clamp(
      hasDeposit ? (dep as { power: number }).power : powerChoice,
      PASS_POWER_MIN, PASS_POWER_MAX,
    );
    const measuring = this.measure && willStrike && ptpLead === null;
    let obs: RerunObs | null = null;
    let pwChosen = false;
    if (measuring && this.pwWeightChooser) {
      if (fromWindup) {
        pwChosen = this.armObs !== null && this.armObs.gid === p.gid;
        obs = pwChosen ? (this.armObs as { obs: RerunObs | null }).obs : null;
      } else if (hasDeposit) {
        pwChosen = true;
        obs = rerunChoice(this, p);
      }
    }
    const t = this.teams[p.side];
    const passerPos = { x: p.pos.x, y: p.pos.y };
    const heading = { x: p.heading.x, y: p.heading.y };
    const matePos = { x: mate.pos.x, y: mate.pos.y };
    const mateVel = { x: mate.vel.x, y: mate.vel.y };
    const passing = p.attrs.passing;
    const rngState = (this.rng as unknown as { s: number }).s;
    const tick = this.simTick;
    const pressed = measuring ? nearestOpponent(this, p) <= PRESSURE_R : false;
    const delta = t.localX(matePos.x) - t.localX(passerPos.x);
    super.performPass(p, mate, offsideExempt, powerChoice, ptpLead);
    if (!measuring) return;
    const dx = matePos.x - passerPos.x;
    const dy = matePos.y - passerPos.y;
    const dl = Math.hypot(dx, dy);
    if (!(dl > 1e-9)) return;
    // ⭐ THE RE-DERIVATION — every ingredient is the ENGINE'S OWN exported function or constant;
    // only the COMPOSITION is restated, and `gExecution` demands it agree to 1e-9 relative, so
    // this is a TRACE, not a parallel oracle (the PW-T0b idiom, inherited verbatim).
    const misalign = kickMisalignment({ heading } as Player, { x: dx / dl, y: dy / dl });
    const orientation = orientationPowerMul(misalign, passing);
    let executed = 1;
    if (intended !== 1) {
      const clone = new Rng(1);
      (clone as unknown as { s: number }).s = rngState;
      const g = clone.gaussian();
      executed = clamp(
        intended + g * Math.abs(intended - 1) * PASS_POWER_NOISE_K * (1.35 - passing),
        PASS_POWER_EXECUTED_MIN, PASS_POWER_EXECUTED_MAX,
      );
    }
    const flight = dl / (16 * orientation * intended);
    const lead = {
      x: matePos.x + mateVel.x * flight * 0.8, y: matePos.y + mateVel.y * flight * 0.8,
    };
    const base = clamp(dist2(passerPos, lead) * 0.6 + 8.2, 9, 22);
    const expectedSpeed = base * orientation * executed;
    const vx = this.ball.vel.x;
    const vy = this.ball.vel.y;
    const observedSpeed = Math.hypot(vx, vy);
    const dInfinity = observedSpeed / BALL_FRICTION_K;
    const endX = passerPos.x + (observedSpeed === 0 ? 0 : (vx / observedSpeed) * dInfinity);
    const endY = passerPos.y + (observedSpeed === 0 ? 0 : (vy / observedSpeed) * dInfinity);
    const rung = LADDER.findIndex((v) => v === intended);
    const linked = obs !== null && obs.targetGid === mate.gid && obs.power === intended;
    this.strikes.push({
      tick,
      passerGid: p.gid,
      passerSide: p.side,
      mateGid: mate.gid,
      intended,
      rung,
      fromWindup,
      pwChosen,
      direction: delta > FORWARD_BAND_M ? 'forward'
        : delta < -FORWARD_BAND_M ? 'backward' : 'lateral',
      pressed,
      distance: dl,
      orientation,
      executed,
      expectedSpeed,
      observedSpeed,
      relError: expectedSpeed === 0 ? 1 : Math.abs(observedSpeed - expectedSpeed) / expectedSpeed,
      dInfinity,
      dInfinityPastReceiver: dInfinity - dl,
      rollOutEndpointOutsidePitch: Math.abs(endX) > HALF_L || Math.abs(endY) > HALF_W,
      obs,
      linked,
      outcome: '',
    });
  }
}

/* ========================================================================== */
/* §7c THE STRIKE CENSUS — the cross-tabs, stored per seed so every face re-derives */
/* ========================================================================== */
const DIRS = ['forward', 'backward', 'lateral'] as const;
type Dir = (typeof DIRS)[number];
const R = LADDER.length;
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
interface StrikeCensus {
  strikes: number; pw: number; linked: number; unlinkedPw: number; offLadder: number;
  fromWindup: number;
  byRung: number[]; byRungDir: number[]; byRungPressed: number[]; byRungDirPressed: number[];
  completedByRung: number[]; lostByRung: number[]; outByRung: number[];
  retainedByRung: number[]; otherByRung: number[];
  sumIntendedByRung: number[]; sumExecutedByRung: number[]; sumRelErrByRung: number[];
  sumSpeedByRung: number[]; sumDInfPastByRung: number[]; endpointOutByRung: number[];
  maxRelErr: number;
  liveChosen: number; liveOnlyAtItsRung: number; liveMateAtReference: number;
  liveChosenByRung: number[]; liveOnlyByRung: number[];
}
const SC_SCALARS = ['strikes', 'pw', 'linked', 'unlinkedPw', 'offLadder', 'fromWindup',
  'liveChosen', 'liveOnlyAtItsRung', 'liveMateAtReference'] as const;
const SC_ARRAYS: readonly (keyof StrikeCensus)[] = ['byRung', 'byRungDir', 'byRungPressed',
  'byRungDirPressed', 'completedByRung', 'lostByRung', 'outByRung', 'retainedByRung',
  'otherByRung', 'sumIntendedByRung', 'sumExecutedByRung', 'sumRelErrByRung', 'sumSpeedByRung',
  'sumDInfPastByRung', 'endpointOutByRung', 'liveChosenByRung', 'liveOnlyByRung'];
const emptyStrikeCensus = (): StrikeCensus => ({
  strikes: 0, pw: 0, linked: 0, unlinkedPw: 0, offLadder: 0, fromWindup: 0,
  byRung: zeros(R), byRungDir: zeros(R * 3), byRungPressed: zeros(R * 2),
  byRungDirPressed: zeros(R * 6),
  completedByRung: zeros(R), lostByRung: zeros(R), outByRung: zeros(R),
  retainedByRung: zeros(R), otherByRung: zeros(R),
  sumIntendedByRung: zeros(R), sumExecutedByRung: zeros(R), sumRelErrByRung: zeros(R),
  sumSpeedByRung: zeros(R), sumDInfPastByRung: zeros(R), endpointOutByRung: zeros(R),
  maxRelErr: 0,
  liveChosen: 0, liveOnlyAtItsRung: 0, liveMateAtReference: 0,
  liveChosenByRung: zeros(R), liveOnlyByRung: zeros(R),
});
const addStrikeCensus = (a: StrikeCensus, b: StrikeCensus): void => {
  for (const k of SC_SCALARS) a[k] += b[k];
  for (const k of SC_ARRAYS) {
    const av = a[k] as number[];
    const bv = b[k] as number[];
    for (let i = 0; i < av.length; i++) av[i] += bv[i] ?? 0;
  }
  a.maxRelErr = Math.max(a.maxRelErr, b.maxRelErr);
};
const foldStrikes = (rows: readonly StrikeRow[]): StrikeCensus => {
  const c = emptyStrikeCensus();
  for (const s of rows) {
    c.strikes += 1;
    if (s.pwChosen) c.pw += 1;
    if (s.linked) c.linked += 1;
    if (s.pwChosen && !s.linked) c.unlinkedPw += 1;
    if (s.fromWindup) c.fromWindup += 1;
    if (s.rung < 0) { c.offLadder += 1; continue; }
    const di = DIRS.indexOf(s.direction);
    const pi = s.pressed ? 1 : 0;
    c.byRung[s.rung] += 1;
    c.byRungDir[s.rung * 3 + di] += 1;
    c.byRungPressed[s.rung * 2 + pi] += 1;
    c.byRungDirPressed[s.rung * 6 + di * 2 + pi] += 1;
    if (s.outcome === 'completed') c.completedByRung[s.rung] += 1;
    else if (s.outcome === 'lost') c.lostByRung[s.rung] += 1;
    else if (s.outcome === 'outOfPlay') c.outByRung[s.rung] += 1;
    else if (s.outcome === 'retained') c.retainedByRung[s.rung] += 1;
    else c.otherByRung[s.rung] += 1;
    c.sumIntendedByRung[s.rung] += s.intended;
    c.sumExecutedByRung[s.rung] += s.executed;
    c.sumRelErrByRung[s.rung] += s.relError;
    c.sumSpeedByRung[s.rung] += s.observedSpeed;
    c.sumDInfPastByRung[s.rung] += s.dInfinityPastReceiver;
    if (s.rollOutEndpointOutsidePitch) c.endpointOutByRung[s.rung] += 1;
    c.maxRelErr = Math.max(c.maxRelErr, s.relError);
    if (s.linked && s.obs !== null) {
      if (s.obs.chosenLive) { c.liveChosen += 1; c.liveChosenByRung[s.rung] += 1; }
      if (s.obs.mateLiveAtReference) c.liveMateAtReference += 1;
      if (s.obs.chosenLiveOnlyAtItsRung) {
        c.liveOnlyAtItsRung += 1;
        c.liveOnlyByRung[s.rung] += 1;
      }
    }
  }
  return c;
};

/* ========================================================================== */
/* §8 THE WALK — #173's spell/touch semantics + the instruments                 */
/* ========================================================================== */
type Terminator = 'opponentControl' | 'fouledWon' | 'foulCommitted' | 'goal' | 'outOfPlay'
  | 'matchEnd';
const TERMINALS = ['tackled', 'intercepted', 'badTouch', 'lostOther', 'shot', 'forcedLong',
  'outOfPlay', 'foulWon', 'foulCommitted', 'goal', 'matchEnd'] as const;
type TerminalClass = (typeof TERMINALS)[number];

interface Spell {
  team: Side; startTick: number; endTick: number; ownedTicks: number; touches: number;
  origin: 'openPlay' | 'restart' | 'kickoff'; terminator: Terminator; terminal: TerminalClass;
}

interface Row {
  seed: number;
  signature: string;
  armOk: boolean;
  lifecycle: Lifecycle;
  pwLedger: PwLedger;
  strikeCensus: StrikeCensus;
  receptions: number;
  receptionsPressed: number;
  receptionsOpenPlay: number;
  atReceptions: OptionCensus;
  atPressedReceptions: OptionCensus;
  carrierSamples: number;
  carrierSamplesPressed: number;
  atPressedCarrier: OptionCensus;
  behindHist: number[];
  behindHistPressed: number[];
  attempts: number; attemptsUnattributed: number;
  attemptsForwardEngine: number; attemptsForwardMine: number;
  attemptsBackwardMine: number; attemptsLateralMine: number;
  attemptsAgreeWithEngine: number;
  completed: number; completedForwardEngine: number;
  completedBackwardMine: number; completedLateralMine: number;
  completedToIntendedTarget: number;
  enginePasses: number; enginePassesForward: number; enginePassesCompleted: number;
  spells: number; openSpells: number; openSpellTickSum: number; openSpellTouchSum: number;
  terminalAll: Record<TerminalClass, number>;
  terminalOpen: Record<TerminalClass, number>;
  ticks: number; inPlayTicks: number; simSeconds: number;
  goals: number;
}

const emptyTerminals = (): Record<TerminalClass, number> => {
  const o = {} as Record<TerminalClass, number>;
  for (const k of TERMINALS) o[k] = 0;
  return o;
};

const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/**
 * ONE match, ONE arm. `measure=false` walks the SAME world with EVERY instrument switched off
 * — the NON-PERTURBATION control (`gNonPerturbing`). The LIFECYCLE instrument and the engine's
 * own ledgers are pure reads of `Match` state and ride BOTH shapes.
 */
const walk = (seed: number, arm: ArmKind, measure = true): Row => {
  const m = new TracedMatch(matchCfg(seed, arm));
  m.measure = measure;
  armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
  const armOk = Object.values(armConjuncts(m, arm)).every(Boolean);
  const mm = m as unknown as {
    forcedTouchPast: { gid: number; dir: { x: number; y: number } } | null;
    cbChoiceLedger: { armings: number; armingsCleared: number; seats: number };
    cbLedger?: { touchPasts?: number };
  };

  const life: Lifecycle = { ...EMPTY_LIFECYCLE };
  life.armedAtConstruction = mm.forcedTouchPast === null && m.pwStrikePower === null ? 0 : 1;

  const row: Row = {
    seed, signature: '', armOk, lifecycle: life, pwLedger: emptyPwLedger(),
    strikeCensus: emptyStrikeCensus(),
    receptions: 0, receptionsPressed: 0, receptionsOpenPlay: 0,
    atReceptions: { ...EMPTY_CENSUS },
    atPressedReceptions: { ...EMPTY_CENSUS },
    carrierSamples: 0, carrierSamplesPressed: 0,
    atPressedCarrier: { ...EMPTY_CENSUS },
    behindHist: zeros(HIST_MAX + 1),
    behindHistPressed: zeros(HIST_MAX + 1),
    attempts: 0, attemptsUnattributed: 0,
    attemptsForwardEngine: 0, attemptsForwardMine: 0,
    attemptsBackwardMine: 0, attemptsLateralMine: 0, attemptsAgreeWithEngine: 0,
    completed: 0, completedForwardEngine: 0,
    completedBackwardMine: 0, completedLateralMine: 0, completedToIntendedTarget: 0,
    enginePasses: 0, enginePassesForward: 0, enginePassesCompleted: 0,
    spells: 0, openSpells: 0, openSpellTickSum: 0, openSpellTouchSum: 0,
    terminalAll: emptyTerminals(), terminalOpen: emptyTerminals(),
    ticks: 0, inPlayTicks: 0, simSeconds: 0, goals: 0,
  };

  const spells: Spell[] = [];
  const foulTicks: { tick: number; side: Side }[] = [];
  let cur: Spell | null = null;
  let prevOwnerGid: number | null = null;
  let prevScore: [number, number] = [0, 0];
  let inPlayTicks = 0;
  let prevFouls: [number, number] = [0, 0];
  const statKeys = ['passes', 'passesCompleted', 'passesForward', 'tackles', 'interceptions',
    'miscontrols', 'clearances', 'longBalls', 'shots', 'fouls'] as const;
  type StatKey = (typeof statKeys)[number];
  const prev: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of statKeys) prev[k] = [0, 0];
  const delta: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of statKeys) delta[k] = [0, 0];
  const TERMINAL_KEYS = ['tackles', 'interceptions', 'miscontrols', 'clearances', 'longBalls',
    'shots'] as const;
  const termEvents: { tick: number; k: (typeof TERMINAL_KEYS)[number]; side: Side }[] = [];

  const slotOfGid = new Map<number, number>();
  m.allPlayers.forEach((p, i) => slotOfGid.set(p.gid, i));
  const preX = new Float64Array(m.allPlayers.length);
  const capturePositions = (): void => {
    m.allPlayers.forEach((p, i) => { preX[i] = p.pos.x; });
  };
  const xBeforeStep = new Float64Array(m.allPlayers.length);
  capturePositions();

  interface Attempt {
    side: Side; passerGid: number; targetGid: number; t: number;
    forwardEngine: boolean; mine: 'forward' | 'backward' | 'lateral' | 'unknown';
    completed: boolean;
  }
  const attempts: Attempt[] = [];
  const lastAttemptOfSide: [Attempt | null, Attempt | null] = [null, null];
  let prevPendingKey = '';
  let prevCompletedT = -1;

  /* --- the LIFECYCLE tracker's own carried state --- */
  let prevArmKey = '';
  let armAge = 0;
  let prevLifeOwner: number | null = null;
  let prevLifePhase = m.phase;
  /* --- ⭐ the STRIKE FLIGHT tracker: one ball, so one open flight at a time --- */
  let seenStrikes = 0;
  let openFlight = -1;

  const newSpell = (side: Side, tick: number, origin: Spell['origin']): Spell => ({
    team: side, startTick: tick, endTick: tick, ownedTicks: 0, touches: 0, origin,
    terminator: 'matchEnd', terminal: 'matchEnd',
  });
  const finishSpell = (s: Spell, tick: number, terminator: Terminator): void => {
    s.endTick = tick; s.terminator = terminator; spells.push(s);
  };

  while (!m.finished) {
    xBeforeStep.set(preX);
    m.step(DT);
    const tick = m.simTick;
    capturePositions();

    /* --- ⭐⭐ THE ARMING-LIFECYCLE OBSERVATION, at the step boundary (BOTH slots) --- */
    life.ticks += 1;
    {
      const f = mm.forcedTouchPast;
      const key = f === null ? '' : `${f.gid}:${f.dir.x}:${f.dir.y}`;
      const owner = m.ball.owner === null ? null : m.ball.owner.gid;
      if (key !== '') {
        life.carryOvers += 1;
        armAge = key === prevArmKey ? armAge + 1 : 1;
        if (armAge > life.maxArmingAgeTicks) life.maxArmingAgeTicks = armAge;
        if (key === prevArmKey && owner !== prevLifeOwner) life.carryOverAcrossOwnerChange += 1;
        if (key === prevArmKey && m.phase !== prevLifePhase) life.carryOverAcrossPhaseChange += 1;
      } else armAge = 0;
      prevArmKey = key;
      prevLifeOwner = owner;
      prevLifePhase = m.phase;
      if (m.pwStrikePower !== null) life.pwDepositLiveAtStepBoundary += 1;
    }

    /* --- ⭐ THE STRIKE FLIGHT RESOLUTION (probe-side, declared) --- */
    if (measure) {
      for (let i = seenStrikes; i < m.strikes.length; i++) {
        if (openFlight >= 0 && m.strikes[openFlight].outcome === '') {
          m.strikes[openFlight].outcome = 'superseded';
        }
        openFlight = i;
      }
      seenStrikes = m.strikes.length;
      if (openFlight >= 0 && m.strikes[openFlight].outcome === '') {
        const s = m.strikes[openFlight];
        if (m.phase !== 'playing') s.outcome = 'outOfPlay';
        else if (m.ball.owner !== null) {
          const o = m.ball.owner;
          s.outcome = o.gid === s.passerGid ? 'retained'
            : o.side === s.passerSide ? 'completed' : 'lost';
        }
      }
    }

    for (const k of statKeys) {
      for (const s of [0, 1] as const) {
        const v = Number((m.teams[s].stats as unknown as Record<string, number>)[k]);
        delta[k][s] = v - prev[k][s];
        prev[k][s] = v;
      }
    }
    for (const k of TERMINAL_KEYS) {
      for (const s of [0, 1] as const) if (delta[k][s] > 0) termEvents.push({ tick, k, side: s });
    }

    const pp = m.pendingPass;
    const key = pp === null ? '' : `${pp.side}:${pp.passerGid}:${pp.targetGid}:${pp.t}`;
    const attributedThisTick: [number, number] = [0, 0];
    if (pp !== null && key !== prevPendingKey && delta.passes[pp.side] > 0) {
      const t = m.teams[pp.side];
      const ia = slotOfGid.get(pp.passerGid);
      const ib = slotOfGid.get(pp.targetGid);
      const d = ia !== undefined && ib !== undefined
        ? t.localX(xBeforeStep[ib]) - t.localX(xBeforeStep[ia]) : Number.NaN;
      const mine: Attempt['mine'] = !Number.isFinite(d) ? 'unknown'
        : d > FORWARD_BAND_M ? 'forward' : d < -FORWARD_BAND_M ? 'backward' : 'lateral';
      const at: Attempt = {
        side: pp.side, passerGid: pp.passerGid, targetGid: pp.targetGid, t: m.simTime,
        forwardEngine: delta.passesForward[pp.side] > 0, mine, completed: false,
      };
      attempts.push(at);
      lastAttemptOfSide[pp.side] = at;
      attributedThisTick[pp.side] = 1;
    }
    prevPendingKey = key;
    for (const s of [0, 1] as const) {
      row.attemptsUnattributed += Math.max(0, delta.passes[s] - attributedThisTick[s]);
    }
    const lcp = m.lastCompletedPass;
    if (lcp !== null && lcp.t !== prevCompletedT) {
      prevCompletedT = lcp.t;
      for (const s of [0, 1] as const) {
        const a = lastAttemptOfSide[s];
        if (a === null || a.completed) continue;
        if (a.passerGid !== lcp.passerGid) continue;
        a.completed = true;
        if (a.targetGid === lcp.receiverGid) row.completedToIntendedTarget += 1;
      }
    }

    const phase = m.phase;
    const owner = m.ball.owner;
    const ownerGid = owner === null ? null : owner.gid;
    for (const s of [0, 1] as const) {
      const f = m.teams[s].stats.fouls;
      if (f > prevFouls[s]) foulTicks.push({ tick, side: s });
      prevFouls[s] = f;
    }
    const goalThisTick = m.score[0] !== prevScore[0] || m.score[1] !== prevScore[1];
    prevScore = [m.score[0], m.score[1]];
    if (phase !== 'playing') {
      if (cur !== null) { finishSpell(cur, tick, goalThisTick ? 'goal' : 'outOfPlay'); cur = null; }
      prevOwnerGid = null;
      continue;
    }
    inPlayTicks++;
    if (owner === null) { prevOwnerGid = null; continue; }
    const side = owner.side;
    if (cur !== null && cur.team !== side) { finishSpell(cur, tick, 'opponentControl'); cur = null; }
    if (cur === null) {
      const origin: Spell['origin'] = m.kickoffKickGid === owner.gid ? 'kickoff'
        : m.restartKickGid === owner.gid ? 'restart' : 'openPlay';
      cur = newSpell(side, tick, origin);
    }
    const spell: Spell = cur;
    spell.ownedTicks++;
    const isReception = ownerGid !== prevOwnerGid;
    if (isReception) spell.touches++;

    if (measure && isReception) {
      const pressed = nearestOpponent(m, owner) <= PRESSURE_R;
      const c = censusAt(m, owner);
      row.receptions += 1;
      if (spell.origin === 'openPlay') row.receptionsOpenPlay += 1;
      addCensus(row.atReceptions, c);
      const k = Math.min(HIST_MAX, c.behindUncut);
      row.behindHist[k] += 1;
      if (pressed) {
        row.receptionsPressed += 1;
        addCensus(row.atPressedReceptions, c);
        row.behindHistPressed[k] += 1;
      }
    }
    if (measure && !isReception && tick % CARRIER_SAMPLE_TICKS === 0) {
      row.carrierSamples += 1;
      if (nearestOpponent(m, owner) <= PRESSURE_R) {
        row.carrierSamplesPressed += 1;
        addCensus(row.atPressedCarrier, censusAt(m, owner));
      }
    }
    prevOwnerGid = ownerGid;
  }
  if (cur !== null) finishSpell(cur, m.simTick, 'matchEnd');
  if (measure && openFlight >= 0 && m.strikes[openFlight].outcome === '') {
    m.strikes[openFlight].outcome = 'atWhistle';
  }
  life.armedAtWhistle = mm.forcedTouchPast === null ? 0 : 1;
  life.pwDepositLiveAtWhistle = m.pwStrikePower === null ? 0 : 1;
  life.pwWindupLiveAtWhistle = m.pendingPassWindup === null ? 0 : 1;
  life.armings = mm.cbChoiceLedger.armings;
  life.armingsCleared = mm.cbChoiceLedger.armingsCleared;
  life.seats = mm.cbChoiceLedger.seats;
  life.touchPasts = Number(mm.cbLedger?.touchPasts ?? 0);
  row.pwLedger = readPwLedger(m);
  row.strikeCensus = foldStrikes(m.strikes);

  for (const s of spells) {
    if (s.terminator !== 'outOfPlay') continue;
    const f = foulTicks.find((x) => x.tick >= s.endTick - FOUL_LOOKAHEAD_TICKS
      && x.tick <= s.endTick + FOUL_LOOKAHEAD_TICKS);
    if (f === undefined) continue;
    s.terminator = f.side === s.team ? 'foulCommitted' : 'fouledWon';
  }

  const lastInSpell = (
    sp: Spell, wanted: readonly { k: (typeof TERMINAL_KEYS)[number]; side: Side }[],
  ): (typeof TERMINAL_KEYS)[number] | null => {
    let best: { tick: number; k: (typeof TERMINAL_KEYS)[number]; rank: number } | null = null;
    for (const e of termEvents) {
      if (e.tick < sp.startTick || e.tick > sp.endTick) continue;
      const rank = wanted.findIndex((w) => w.k === e.k && w.side === e.side);
      if (rank < 0) continue;
      if (best === null || e.tick > best.tick || (e.tick === best.tick && rank < best.rank)) {
        best = { tick: e.tick, k: e.k, rank };
      }
    }
    return best === null ? null : best.k;
  };
  for (const sp of spells) {
    const own = sp.team;
    const opp = (1 - sp.team) as Side;
    if (sp.terminator === 'goal') sp.terminal = 'goal';
    else if (sp.terminator === 'matchEnd') sp.terminal = 'matchEnd';
    else if (sp.terminator === 'foulCommitted') sp.terminal = 'foulCommitted';
    else if (sp.terminator === 'fouledWon') sp.terminal = 'foulWon';
    else if (sp.terminator === 'opponentControl') {
      const k = lastInSpell(sp, [
        { k: 'tackles', side: opp }, { k: 'interceptions', side: opp },
        { k: 'miscontrols', side: own },
      ]);
      sp.terminal = k === 'tackles' ? 'tackled' : k === 'interceptions' ? 'intercepted'
        : k === 'miscontrols' ? 'badTouch' : 'lostOther';
    } else {
      const k = lastInSpell(sp, [
        { k: 'shots', side: own }, { k: 'clearances', side: own }, { k: 'longBalls', side: own },
      ]);
      sp.terminal = k === 'shots' ? 'shot'
        : (k === 'clearances' || k === 'longBalls') ? 'forcedLong' : 'outOfPlay';
    }
    row.terminalAll[sp.terminal] += 1;
    if (sp.origin === 'openPlay') row.terminalOpen[sp.terminal] += 1;
  }

  row.signature = signature(m);
  row.spells = spells.length;
  const open = spells.filter((s) => s.origin === 'openPlay');
  row.openSpells = open.length;
  row.openSpellTickSum = sum(open.map((s) => s.endTick - s.startTick));
  row.openSpellTouchSum = sum(open.map((s) => s.touches));
  row.attempts = attempts.length;
  row.attemptsForwardEngine = attempts.filter((a) => a.forwardEngine).length;
  row.attemptsForwardMine = attempts.filter((a) => a.mine === 'forward').length;
  row.attemptsBackwardMine = attempts
    .filter((a) => !a.forwardEngine && a.mine === 'backward').length;
  row.attemptsLateralMine = attempts
    .filter((a) => !a.forwardEngine && a.mine !== 'backward').length;
  row.attemptsAgreeWithEngine = attempts
    .filter((a) => a.forwardEngine === (a.mine === 'forward')).length;
  const done = attempts.filter((a) => a.completed);
  row.completed = done.length;
  row.completedForwardEngine = done.filter((a) => a.forwardEngine).length;
  row.completedBackwardMine = done.filter((a) => !a.forwardEngine && a.mine === 'backward').length;
  row.completedLateralMine = done.filter((a) => !a.forwardEngine && a.mine !== 'backward').length;
  row.enginePasses = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.enginePassesForward = m.teams[0].stats.passesForward + m.teams[1].stats.passesForward;
  row.enginePassesCompleted = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  row.ticks = m.simTick;
  row.inPlayTicks = inPlayTicks;
  row.simSeconds = m.simTime;
  row.goals = m.teams[0].stats.goals + m.teams[1].stats.goals;
  return row;
};

/* ========================================================================== */
/* §9 ⭐⭐ THE DOORS MATRIX AT THE CB+L3+PW COMPOSITION — 64 CELLS, FIRST        */
/* ========================================================================== */
/**
 * THE COMPOSITION'S SIX DOORS, enumerated EXHAUSTIVELY (2^6 = 64 cells) on the v7 SUBSTRATE
 * (`a4MatchFlags(3)` — CALLED, not copied, BU-T0's own line), so every pairwise flag
 * interaction appears in the matrix and so does every higher-order one:
 *
 *   C  cbCommitPhysics      T  cbTouchPast         S  cbChoiceSeat (+ the proneness dose)
 *   L  l3DefenceLearn (+ the matured L3 dose)      V  l3DefenceVeto
 *   ⭐⭐ W  pwWeightChooser  (NO dose, NO gene, NO ladder key — one flag, the whole slice)
 *
 * ⚠ TWO AXES CARRY THEIR OWN DOSE, DECLARED: `S` without a proneness cannot form a seat and `L`
 * without a dosed book has nothing to read, so each is "door + its banked dose", exactly as the
 * shipped entries compose them. `W` carries NOTHING — that is the point of the slice.
 *
 * ⭐ THE PW DOOR'S OWN INERTNESS LAW (its analogue of MT's born-absent law): with `W` SHUT the
 * seam's whole accounting is structurally silent — the chooser ledger is all-zero, no weight is
 * ever deposited, and the deposit slot is null at every step boundary and at the whistle. That
 * is checked on EVERY cell, so "dormant" is a count in 32 worlds, not a claim.
 */
interface DoorCell {
  C: boolean; T: boolean; S: boolean; L: boolean; V: boolean; W: boolean;
}
const DOOR_AXES = ['C', 'T', 'S', 'L', 'V', 'W'] as const;
type DoorAxis = (typeof DOOR_AXES)[number];
const doorKey = (c: DoorCell): string => DOOR_AXES.map((a) => (c[a] ? '1' : '0')).join('');
const ALL_DOOR_CELLS: DoorCell[] = (() => {
  const out: DoorCell[] = [];
  for (let bits = 0; bits < 1 << DOOR_AXES.length; bits++) {
    const c = {} as DoorCell;
    DOOR_AXES.forEach((a, i) => { c[a] = ((bits >> i) & 1) === 1; });
    out.push(c);
  }
  return out;
})();
const withAxis = (c: DoorCell, a: DoorAxis, v: boolean): DoorCell => ({ ...c, [a]: v });

/**
 * ONE doors-matrix walk: the signature at the whistle + the full lifecycle read + the PW
 * ledger. NO oracle, NO strike camera — a doors walk measures the WORLD, not the football.
 */
const doorsWalk = (seed: number, c: DoorCell): {
  sig: string; life: Lifecycle; pw: PwLedger;
} => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(3),
    ...(c.C ? { cbCommitPhysics: true } : {}),
    ...(c.T ? { cbTouchPast: true } : {}),
    ...(c.S ? { cbChoiceSeat: true } : {}),
    ...(c.L ? { l3DefenceLearn: true } : {}),
    ...(c.V ? { l3DefenceVeto: true } : {}),
    ...(c.W ? { pwWeightChooser: true } : {}),
  });
  if (c.S) for (const side of [0, 1] as const) setCbProneness(m, side, CB_WORLD_DOSE);
  if (c.L) {
    const led = (m as unknown as {
      l3Defence: { books: { note(g: number, p: boolean): void }[] } | null;
    }).l3Defence;
    if (led !== null) {
      for (const book of led.books) {
        for (let g = 0; g < L3_DOSE.length; g++) {
          for (let i = 0; i < L3_DOSE[g].punished; i++) book.note(g, true);
          for (let i = 0; i < L3_DOSE[g].lunges - L3_DOSE[g].punished; i++) book.note(g, false);
        }
      }
    }
  }
  const mm = m as unknown as {
    forcedTouchPast: { gid: number; dir: { x: number; y: number } } | null;
    cbChoiceLedger: { armings: number; armingsCleared: number; seats: number };
    cbLedger: { touchPasts: number };
  };
  const life: Lifecycle = { ...EMPTY_LIFECYCLE };
  life.armedAtConstruction = mm.forcedTouchPast === null && m.pwStrikePower === null ? 0 : 1;
  let prevArmKey = '';
  let armAge = 0;
  let prevOwner: number | null = null;
  let prevPhase = m.phase;
  while (!m.finished) {
    m.step(DT);
    life.ticks += 1;
    const f = mm.forcedTouchPast;
    const key = f === null ? '' : `${f.gid}:${f.dir.x}:${f.dir.y}`;
    const owner = m.ball.owner === null ? null : m.ball.owner.gid;
    if (key !== '') {
      life.carryOvers += 1;
      armAge = key === prevArmKey ? armAge + 1 : 1;
      if (armAge > life.maxArmingAgeTicks) life.maxArmingAgeTicks = armAge;
      if (key === prevArmKey && owner !== prevOwner) life.carryOverAcrossOwnerChange += 1;
      if (key === prevArmKey && m.phase !== prevPhase) life.carryOverAcrossPhaseChange += 1;
    } else armAge = 0;
    prevArmKey = key;
    prevOwner = owner;
    prevPhase = m.phase;
    if (m.pwStrikePower !== null) life.pwDepositLiveAtStepBoundary += 1;
  }
  life.armedAtWhistle = mm.forcedTouchPast === null ? 0 : 1;
  life.pwDepositLiveAtWhistle = m.pwStrikePower === null ? 0 : 1;
  life.pwWindupLiveAtWhistle = m.pendingPassWindup === null ? 0 : 1;
  life.armings = mm.cbChoiceLedger.armings;
  life.armingsCleared = mm.cbChoiceLedger.armingsCleared;
  life.seats = mm.cbChoiceLedger.seats;
  life.touchPasts = mm.cbLedger.touchPasts;
  return { sig: signature(m), life, pw: readPwLedger(m) };
};

const LIFECYCLE_SEED_COUNT = MODE === 'smoke' ? 1 : LIFECYCLE_SEEDS_FULL;
const LIFECYCLE_SEEDS = Array.from({ length: LIFECYCLE_SEED_COUNT }, (_, i) => LIFECYCLE_BASE + i);
banner(`  [pw-t1] ⭐ ORDER OF PROOF STEP 1 — the M-BU.2 lifecycle/doors proof at CB+L3+PW: `
  + `${ALL_DOOR_CELLS.length} door cells × ${LIFECYCLE_SEEDS.length} seeds…`);
const doorSig: Record<number, Record<string, string>> = {};
const doorLife: Record<number, Record<string, Lifecycle>> = {};
const doorPw: Record<number, Record<string, PwLedger>> = {};
for (const seed of LIFECYCLE_SEEDS) {
  doorSig[seed] = {}; doorLife[seed] = {}; doorPw[seed] = {};
  for (const c of ALL_DOOR_CELLS) {
    const r = doorsWalk(seed, c);
    doorSig[seed][doorKey(c)] = r.sig;
    doorLife[seed][doorKey(c)] = r.life;
    doorPw[seed][doorKey(c)] = r.pw;
  }
  banner(`  [pw-t1]   doors seed ${seed} — ${ALL_DOOR_CELLS.length} cells walked`);
}
const sigOf = (seed: number, c: DoorCell): string => doorSig[seed][doorKey(c)];

/**
 * ⭐⭐ THE LIFECYCLE VERDICT — the DICHOTOMY #287.3 established, re-proven at THIS composition,
 * with the PW deposit slot read at the same boundary:
 *   (a) IN EVERY CELL WHERE AN AIM CAN FIRE (`T`), no arming survives its own tick;
 *   (b) IN EVERY CELL WHERE ARMINGS PERSIST (`S ∧ ¬T`), ZERO knocks fire — the S∧¬T EXHIBIT,
 *       expected to reproduce and stay INERT (it is a configuration no armed world constructs);
 *   (c) IN EVERY CELL, the PW deposit slot is EMPTY at every step boundary (it is deposited and
 *       consumed inside one tick, or swept).
 */
const CAN_FIRE = (c: DoorCell): boolean => c.T;
const lifecycleMatrix = (() => {
  const total: Lifecycle = { ...EMPTY_LIFECYCLE };
  const firing: Lifecycle = { ...EMPTY_LIFECYCLE };
  const inert: Lifecycle = { ...EMPTY_LIFECYCLE };
  const pwOn: Lifecycle = { ...EMPTY_LIFECYCLE };
  const pwOff: Lifecycle = { ...EMPTY_LIFECYCLE };
  const pwOffLedger = emptyPwLedger();
  const pwOnLedger = emptyPwLedger();
  let cells = 0; let firingCells = 0; let inertCells = 0;
  const offenders: string[] = [];
  const persistingCells: string[] = [];
  for (const seed of LIFECYCLE_SEEDS) {
    for (const c of ALL_DOOR_CELLS) {
      const l = doorLife[seed][doorKey(c)];
      const p = doorPw[seed][doorKey(c)];
      cells += 1;
      addLifecycle(total, l);
      addLifecycle(c.W ? pwOn : pwOff, l);
      addPwLedger(c.W ? pwOnLedger : pwOffLedger, p);
      if (l.pwDepositLiveAtStepBoundary > 0) {
        offenders.push(`${seed}:${doorKey(c)}(PW-DEPOSIT-SURVIVED-ITS-TICK)`);
      }
      if (!c.W && (p.decisions > 0 || p.depositsNonDefault > 0 || l.pwDepositLiveAtWhistle > 0)) {
        offenders.push(`${seed}:${doorKey(c)}(PW-LEDGER-MOVED-WITH-THE-DOOR-SHUT)`);
      }
      if (CAN_FIRE(c)) {
        firingCells += 1;
        addLifecycle(firing, l);
        if (l.carryOvers > 0 || l.armedAtWhistle > 0 || l.armedAtConstruction > 0) {
          offenders.push(`${seed}:${doorKey(c)}`);
        }
      } else {
        inertCells += 1;
        addLifecycle(inert, l);
        if (l.carryOvers > 0) persistingCells.push(`${seed}:${doorKey(c)}`);
        if (l.touchPasts > 0 || l.armedAtConstruction > 0) {
          offenders.push(`${seed}:${doorKey(c)}(FIRED-WITH-THE-DOOR-SHUT)`);
        }
      }
    }
  }
  return {
    total, firing, inert, pwOn, pwOff, pwOnLedger, pwOffLedger,
    cells, firingCells, inertCells, offenders, persistingCells,
  };
})();

/** ⭐⭐ THE STOP RULE (the order of proof): a defect here is a `src` question. */
if (lifecycleMatrix.offenders.length > 0) {
  banner('PW-T1 STOPS FOR ADJUDICATION — the arming-lifecycle class BIT at CB+L3+PW:');
  banner(`  in FIRING cells — carry-overs ${lifecycleMatrix.firing.carryOvers} · armed at the `
    + `whistle ${lifecycleMatrix.firing.armedAtWhistle} · longest arming life `
    + `${lifecycleMatrix.firing.maxArmingAgeTicks} ticks`);
  banner(`  in NON-FIRING cells — knocks fired ${lifecycleMatrix.inert.touchPasts}`);
  banner(`  PW deposits alive at a step boundary — `
    + `${lifecycleMatrix.total.pwDepositLiveAtStepBoundary}`);
  banner(`  PW ledger with the door SHUT — decisions ${lifecycleMatrix.pwOffLedger.decisions}`);
  banner(`  offending cells (seed:CTSLVW): ${lifecycleMatrix.offenders.slice(0, 40).join(' ')}`);
  banner('  A FIX IS A src CHANGE AND NEEDS ITS OWN AUTHORIZATION. Nothing was written.');
  process.exit(4);
}
banner(`  [pw-t1] ⭐ lifecycle: ${lifecycleMatrix.firingCells} FIRING cells CLEAN `
  + `(${lifecycleMatrix.firing.armings} armings, ${lifecycleMatrix.firing.touchPasts} knocks) · `
  + `${lifecycleMatrix.persistingCells.length} S∧¬T cells hold an UNCONSUMED arming `
  + `(${lifecycleMatrix.inert.touchPasts} knocks fired there — the inert half) · `
  + `PW deposits alive at a boundary ${lifecycleMatrix.total.pwDepositLiveAtStepBoundary}`);

/** THE IDENTITY CLAIMS — checked on EVERY cell of the matrix and EVERY seed (`always`). */
const doorsAlways = (() => {
  const fail: Record<string, string[]> = {
    touchPastDoorInertWithoutTheChoiceSeat: [],
    l3LearnDoorInertWithoutTheVeto: [],
    l3VetoDoorInertWithoutTheBook: [],
    pwSeamSilentWithItsDoorShut: [],
  };
  const checked: Record<string, number> = Object.fromEntries(
    Object.keys(fail).map((k) => [k, 0]));
  const claim = (
    name: string, seed: number, c: DoorCell, axis: DoorAxis, when: boolean,
  ): void => {
    if (!when || c[axis]) return;
    checked[name] += 1;
    if (sigOf(seed, withAxis(c, axis, true)) !== sigOf(seed, c)) {
      fail[name].push(`${seed}:${doorKey(c)}`);
    }
  };
  for (const seed of LIFECYCLE_SEEDS) {
    for (const c of ALL_DOOR_CELLS) {
      claim('touchPastDoorInertWithoutTheChoiceSeat', seed, c, 'T', !c.S);
      claim('l3LearnDoorInertWithoutTheVeto', seed, c, 'L', !c.V);
      claim('l3VetoDoorInertWithoutTheBook', seed, c, 'V', !c.L);
      if (!c.W) {
        checked.pwSeamSilentWithItsDoorShut += 1;
        const p = doorPw[seed][doorKey(c)];
        const l = doorLife[seed][doorKey(c)];
        const silent = PW_LEDGER_KEYS.every((k) => p[k] === 0)
          && p.chosenByRung.every((v) => v === 0)
          && l.pwDepositLiveAtStepBoundary === 0 && l.pwDepositLiveAtWhistle === 0;
        if (!silent) fail.pwSeamSilentWithItsDoorShut.push(`${seed}:${doorKey(c)}`);
      }
    }
  }
  return { fail, checked, allHold: Object.values(fail).every((v) => v.length === 0) };
})();

/** THE LIVENESS CLAIMS — SETWISE (a door that can never move the world is a DEAD door). */
const doorsLive = (() => {
  const hits: Record<string, number> = {
    theCommitPhysicsDoorMovesTheWorld: 0,
    theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen: 0,
    theL3VetoMovesTheWorldOnADosedBook: 0,
    thePwDoorMovesTheWorld: 0,
    thePwDoorMovesTheWorldOnTheFullCbL3Stack: 0,
  };
  for (const seed of LIFECYCLE_SEEDS) {
    for (const c of ALL_DOOR_CELLS) {
      if (!c.C && sigOf(seed, withAxis(c, 'C', true)) !== sigOf(seed, c)) {
        hits.theCommitPhysicsDoorMovesTheWorld += 1;
      }
      if (!c.S && c.T && sigOf(seed, withAxis(c, 'S', true)) !== sigOf(seed, c)) {
        hits.theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen += 1;
      }
      if (!c.V && c.L && sigOf(seed, withAxis(c, 'V', true)) !== sigOf(seed, c)) {
        hits.theL3VetoMovesTheWorldOnADosedBook += 1;
      }
      if (!c.W && sigOf(seed, withAxis(c, 'W', true)) !== sigOf(seed, c)) {
        hits.thePwDoorMovesTheWorld += 1;
        if (c.C && c.T && c.S && c.L && c.V) {
          hits.thePwDoorMovesTheWorldOnTheFullCbL3Stack += 1;
        }
      }
    }
  }
  return hits;
})();

/**
 * ⭐ THE STRUCTURAL HALF of the lifecycle proof — the call-site census, machine-read from
 * `src/**`, plus the NON-VACUITY fact: the early-return exposure is REAL in this composition
 * (`o1PassWindup` and `c7Windup` are armed in the v7 substrate). ⭐ AND the PW seam's own
 * site census: ONE deposit writer, ONE consumption site inside `performPass`, ONE sweep, SIX
 * void-accounting sites — the closure equation's own plumbing, counted not assumed.
 */
const lifecycleStructure = (() => {
  const count = (src: string, re: RegExp): number => (src.match(re) ?? []).length;
  const probe = new Match(matchCfg(GWORLD_SEED, 'v7pw'));
  const pm = probe as unknown as {
    o2Look: boolean; ekHoldVeto: boolean; o1PassWindup: boolean; c7Windup: boolean;
    stationEye: unknown; ptpPassLead: boolean;
  };
  return {
    armCallSites: count(BRAIN_SRC, /match\.armTouchPast\(/g),
    clearCallSites: count(BRAIN_SRC, /match\.clearTouchPastArming\(/g),
    slotClearedInSrc: count(MATCH_SRC, /this\.forcedTouchPast = null;/g),
    fireForks: count(MATCH_SRC, /mech\.performTouchPast\(/g),
    pwDepositWriteSites: count(BRAIN_SRC, /match\.pwStrikePower = \{/g),
    pwChooserCallSites: count(BRAIN_SRC, /choosePassWeight\(\{/g),
    pwFlagReadsInBrain: count(BRAIN_SRC, /match\.pwWeightChooser/g),
    pwVoidSites: count(MATCH_SRC, /this\.pwNoteWindupChoiceVoid\(/g),
    pwSlotClears: count(MATCH_SRC, /this\.pwStrikePower = null;/g),
    pwPricerCalledNotRestated: count(CHOOSER_SRC, /pricePassOption\(\{/g),
    o2LookArmed: pm.o2Look === true,
    ekHoldVetoArmed: pm.ekHoldVeto === true,
    o1PassWindupArmed: pm.o1PassWindup === true,
    c7WindupArmed: pm.c7Windup === true,
    ptpArmed: pm.ptpPassLead === true,
    stationEyeNull: pm.stationEye === null,
    lines: {
      arm: `${BRAIN_SRC_PATH}:${ARM_SITE_LINE}`,
      withdraw: `${BRAIN_SRC_PATH}:${CLEAR_SITE_LINE}`,
      fire: `${MATCH_SRC_PATH}:${FIRE_SITE_LINE}`,
      clearImpl: `${MATCH_SRC_PATH}:${CLEAR_IMPL_LINE}`,
      pwDeposit: `${BRAIN_SRC_PATH}:${PW_DEPOSIT_LINE}`,
      pwConsume: `${MATCH_SRC_PATH}:${PW_CONSUME_LINE}`,
      pwSweep: `${MATCH_SRC_PATH}:${PW_SWEEP_LINE}`,
      pwVoidImpl: `${MATCH_SRC_PATH}:${PW_VOID_IMPL_LINE}`,
      canary: `${BRAIN_SRC_PATH}:${CANARY_LINE}`,
    },
  };
})();

/**
 * ⭐ PW-T0c CLAUSE (d), EXERCISED (a receipt, not a walk): the constructor REFUSES to build a
 * world with both `ptpPassLead` and `pwWeightChooser` armed, and the message names its lifting
 * slice. Either door alone still builds — proven by construction, here.
 */
const ptpDoorReceipt = (() => {
  let threw = false;
  let message = '';
  try {
    // eslint-disable-next-line no-new
    new Match({ ...matchCfg(GWORLD_SEED, 'v7pw'), ptpPassLead: true });
  } catch (e) { threw = true; message = String((e as Error).message ?? e); }
  let pwAloneBuilds = false;
  try { new Match(matchCfg(GWORLD_SEED, 'v7pw')); pwAloneBuilds = true; } catch { /* noop */ }
  let ptpAloneBuilds = false;
  try {
    new Match({ ...matchCfg(GWORLD_SEED, 'v7'), ptpPassLead: true });
    ptpAloneBuilds = true;
  } catch { /* noop */ }
  return {
    bothArmedThrows: threw,
    messageNamesTheRuling: message.includes('#293.3'),
    messageLength: message.length,
    pwAloneBuilds,
    ptpAloneBuilds,
  };
})();

/* ========================================================================== */
/* §10 THE BATTERY                                                             */
/* ========================================================================== */
const N_RUN = N_ENV ?? (MODE === 'smoke' ? 4 : N_FROZEN);
const BASE_RUN = MODE === 'smoke' && N_ENV === null ? SMOKE_BASE
  : (IS_PREFLIGHT ? GUARD_BASE : BATTERY_BASE);

interface Battery { rows: Record<ArmKind, Row[]> }
const runBattery = (): Battery => {
  const rows: Record<ArmKind, Row[]> = { v7: [], v7pw: [] };
  for (const arm of ARMS) {
    for (let i = 0; i < N_RUN; i++) rows[arm].push(walk(BASE_RUN + i, arm));
    banner(`  [pw-t1] ${arm} — ${N_RUN} walks done`);
  }
  return { rows };
};

/* ========================================================================== */
/* §11 THE FACES — every one a RATIO OF SUMS over the stored per-seed rows      */
/* ========================================================================== */
type Face = {
  num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string;
  /** ⭐ declared ARM-STRUCTURAL: its denominator is 0 on the base arm BY CONSTRUCTION. */
  armStructural?: boolean;
};
const perMatch = (): number => 1;
const outfield = (
  c: OptionCensus, k: 'behind' | 'behindFlight' | 'behindRace' | 'behindUncut',
): number => {
  const gk = k === 'behind' ? c.behindGk : k === 'behindFlight' ? c.behindFlightGk
    : k === 'behindRace' ? c.behindRaceGk : c.behindUncutGk;
  return c[k] - gk;
};
const outfieldLat = (
  c: OptionCensus, k: 'lateral' | 'lateralFlight' | 'lateralRace' | 'lateralUncut',
): number => {
  const gk = k === 'lateral' ? c.lateralGk : k === 'lateralFlight' ? c.lateralFlightGk
    : k === 'lateralRace' ? c.lateralRaceGk : c.lateralUncutGk;
  return c[k] - gk;
};
const scOf = (r: Row): StrikeCensus => r.strikeCensus;
const rungIdx = { floor: 0, ref: REFERENCE_INDEX, ceiling: LADDER.length - 1 } as const;
const dirIdx = (d: Dir): number => DIRS.indexOf(d);
const rdp = (c: StrikeCensus, rung: number, d: Dir, pressed: 0 | 1): number =>
  c.byRungDirPressed[rung * 6 + dirIdx(d) * 2 + pressed];
const strikesPressed = (c: StrikeCensus, pressed: 0 | 1): number =>
  sum(LADDER.map((_, k) => c.byRungPressed[k * 2 + pressed]));
const strikesDir = (c: StrikeCensus, d: Dir): number =>
  sum(LADDER.map((_, k) => c.byRungDir[k * 3 + dirIdx(d)]));
const strikesOnLadder = (c: StrikeCensus): number => sum(c.byRung);

const FACES: Record<string, Face> = {
  /* ==== ⭐⭐ H-PW.1 (a) — WEIGHT CHOSEN AT STRIKE GRAIN (REAL STRUCK BALLS) ==== */
  ...Object.fromEntries(LADDER.map((p, k) => [`strikeShareAtRung${k}`, {
    num: (r: Row) => scOf(r).byRung[k], den: (r: Row) => strikesOnLadder(scOf(r)),
    unit: 'share of real strikes',
    what: `⭐⭐ H-PW.1 (a) — the share of REAL STRUCK BALLS leaving the boot at rung ${k} `
      + `(${RUNG_LABELS[k]}). NOT an oracle preference: the camera reads the engine's own `
      + 'strike. On the base arm this is 1.000 at the reference rung by construction.',
  }])) as Record<string, Face>,
  strikesPerMatch: {
    num: (r) => scOf(r).strikes, den: perMatch, unit: 'struck balls / match',
    what: 'the strike population itself (ground passes through `performPass`, PTP-lead-free)',
  },
  chosenStrikeShare: {
    num: (r) => scOf(r).pw, den: (r) => scOf(r).strikes,
    unit: 'share of strikes',
    what: '⭐ the share of strikes carrying a PW CHOICE (deposit present, or a wind-up armed '
      + 'with one). 0 on the base arm BY CONSTRUCTION — the door is shut.',
  },
  windupShareOfStrikes: {
    num: (r) => scOf(r).fromWindup, den: (r) => scOf(r).strikes,
    unit: 'share of strikes',
    what: 'strikes resolved out of an O1 wind-up — the exam world\'s MAIN path (#293.8)',
  },
  /* ==== ⭐ THE SHAPE QUESTION — 小力到脚 + 大力穿缝, descriptively ==== */
  softShareOfUnpressedBackwardStrikes: {
    num: (r) => rdp(scOf(r), rungIdx.floor, 'backward', 0),
    den: (r) => rdp(scOf(r), rungIdx.floor, 'backward', 0) + rdp(scOf(r), rungIdx.ref, 'backward', 0)
      + rdp(scOf(r), rungIdx.ceiling, 'backward', 0),
    unit: 'share of unpressed backward strikes',
    what: '⭐ 小力到脚 — the FLOOR rung\'s share of BACKWARD strikes made with no opponent '
      + `inside ${PRESSURE_R} m of the passer`,
  },
  firmShareOfPressedStrikes: {
    num: (r) => scOf(r).byRungPressed[rungIdx.ceiling * 2 + 1],
    den: (r) => strikesPressed(scOf(r), 1),
    unit: 'share of pressed strikes',
    what: '⭐ 大力穿缝 — the CEILING rung\'s share of strikes made UNDER PRESSURE',
  },
  firmShareOfUnpressedStrikes: {
    num: (r) => scOf(r).byRungPressed[rungIdx.ceiling * 2 + 0],
    den: (r) => strikesPressed(scOf(r), 0),
    unit: 'share of unpressed strikes',
    what: 'the same rung\'s share when the passer is NOT pressed (the contrast that makes the '
      + 'shape claim readable)',
  },
  firmShareOfForwardStrikes: {
    num: (r) => scOf(r).byRungDir[rungIdx.ceiling * 3 + dirIdx('forward')],
    den: (r) => strikesDir(scOf(r), 'forward'),
    unit: 'share of forward strikes', what: 'the ceiling rung\'s share of FORWARD strikes',
  },
  firmShareOfBackwardStrikes: {
    num: (r) => scOf(r).byRungDir[rungIdx.ceiling * 3 + dirIdx('backward')],
    den: (r) => strikesDir(scOf(r), 'backward'),
    unit: 'share of backward strikes', what: 'the ceiling rung\'s share of BACKWARD strikes',
  },
  softShareOfBackwardStrikes: {
    num: (r) => scOf(r).byRungDir[rungIdx.floor * 3 + dirIdx('backward')],
    den: (r) => strikesDir(scOf(r), 'backward'),
    unit: 'share of backward strikes', what: 'the floor rung\'s share of BACKWARD strikes',
  },
  /* ==== ⭐ THE OBSERVATION LEDGER (the emergence receipt) ==== */
  chosenStrikesAliveOnlyAtTheirRung: {
    num: (r) => scOf(r).liveOnlyAtItsRung, den: (r) => scOf(r).linked,
    unit: 'share of linked chosen strikes',
    armStructural: true,
    what: '⭐⭐ THE EMERGENCE RECEIPT (#293.2\'s routing) — of the chosen strikes whose decision '
      + 'the camera could re-run and LINK, the share whose chosen (mate × rung) pair is live on '
      + 'the CENSUS ladder ONLY at its own rung: the corridor the WEIGHT bought.',
  },
  chosenStrikesAliveOnTheCensusLadder: {
    num: (r) => scOf(r).liveChosen, den: (r) => scOf(r).linked,
    unit: 'share of linked chosen strikes', armStructural: true,
    what: 'of the same population, the share whose chosen pair is live on the census ladder at '
      + 'all (race ∧ corridor) — the denominator context for the row above',
  },
  mateSwitchesPerChooserDecision: {
    num: (r) => r.pwLedger.mateSwitches, den: (r) => r.pwLedger.decisions,
    unit: 'share of chooser decisions', armStructural: true,
    what: '⭐ THE MATE-SWITCH RATE vs the base arm\'s own chooser — decisions where the weight '
      + 'axis moved the MAN off the shipped chooser\'s pick. Attributable to a RUNG because '
      + 'PW-T0c proved objective fidelity (same price, same candidates, same tie-break).',
  },
  /* ==== ⭐ EXECUTION HONESTY (#291.1's routed exam) ==== */
  ...Object.fromEntries(LADDER.map((p, k) => [`meanExecutedOverIntendedAtRung${k}`, {
    num: (r: Row) => scOf(r).sumExecutedByRung[k], den: (r: Row) => scOf(r).byRung[k],
    unit: 'executed multiplier (intended = ' + String(p) + ')',
    armStructural: k !== REFERENCE_INDEX,
    what: `⭐ EXECUTION HONESTY at rung ${k} (${RUNG_LABELS[k]}): the mean EXECUTED power the `
      + 'sim actually struck with, re-derived from the engine\'s own gaussian at its pre-strike '
      + 'rng state. The oracle prices the INTENDED number; this is what left the boot.',
  }])) as Record<string, Face>,
  ...Object.fromEntries(LADDER.map((p, k) => [`completionRateAtRung${k}`, {
    num: (r: Row) => scOf(r).completedByRung[k], den: (r: Row) => scOf(r).byRung[k],
    unit: 'share of strikes at this rung', armStructural: k !== REFERENCE_INDEX,
    what: `⭐⭐ COMPLETION BY CHOSEN RUNG (${RUNG_LABELS[k]}) — the realised-vs-priced gap: the `
      + 'oracle admitted these balls, this is how many actually reached a team-mate.',
  }])) as Record<string, Face>,
  ...Object.fromEntries(LADDER.map((p, k) => [`outOfPlayRateAtRung${k}`, {
    num: (r: Row) => scOf(r).outByRung[k], den: (r: Row) => scOf(r).byRung[k],
    unit: 'share of strikes at this rung', armStructural: k !== REFERENCE_INDEX,
    what: `⭐ THE OUT FACE at ${RUNG_LABELS[k]} — strikes whose flight ended with the ball dead `
      + '(phase left `playing`) before anybody controlled it.',
  }])) as Record<string, Face>,
  ...Object.fromEntries(LADDER.map((p, k) => [`lossRateAtRung${k}`, {
    num: (r: Row) => scOf(r).lostByRung[k], den: (r: Row) => scOf(r).byRung[k],
    unit: 'share of strikes at this rung', armStructural: k !== REFERENCE_INDEX,
    what: `strikes at ${RUNG_LABELS[k]} whose next controller was an OPPONENT`,
  }])) as Record<string, Face>,
  ...Object.fromEntries(LADDER.map((p, k) => [`meanDInfinityPastReceiverAtRung${k}`, {
    num: (r: Row) => scOf(r).sumDInfPastByRung[k], den: (r: Row) => scOf(r).byRung[k],
    unit: 'metres', armStructural: k !== REFERENCE_INDEX,
    what: `⭐ THE OVERSHOOT FACE at ${RUNG_LABELS[k]} — the engine's own closed form `
      + '(D∞ = v / BALL_FRICTION_K, carryBeat.ts) minus the passer→receiver distance, on the '
      + 'UNTOUCHED ball. PW-C0 §D\'s face, now measured on REAL strikes instead of options.',
  }])) as Record<string, Face>,
  ...Object.fromEntries(LADDER.map((p, k) => [`rollOutLeavesThePitchAtRung${k}`, {
    num: (r: Row) => scOf(r).endpointOutByRung[k], den: (r: Row) => scOf(r).byRung[k],
    unit: 'share of strikes at this rung', armStructural: k !== REFERENCE_INDEX,
    what: `PW-C0 §D's "sails away" face at ${RUNG_LABELS[k]} — the untouched roll-out endpoint `
      + 'lies outside the pitch. ⚠ GEOMETRY ON AN UNTOUCHED BALL, never a prediction.',
  }])) as Record<string, Face>,
  meanLaunchSpeed: {
    num: (r) => sum(scOf(r).sumSpeedByRung), den: (r) => strikesOnLadder(scOf(r)),
    unit: 'm/s', what: 'the mean OBSERVED launch speed of a struck ball (the engine\'s own ball)',
  },
  /* ==== ⭐⭐ H-PW.1 (b) — CORRIDOR SURVIVAL, BU-C0's INSTRUMENT, GK-SPLIT ==== */
  outfieldCorridorSurvivalRate: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'),
    den: (r) => outfield(r.atReceptions, 'behindRace'),
    unit: 'share of race-winning outfield options',
    what: '⭐⭐ H-PW.1 (b) THE SCORED FACE — of the OUTFIELD BACKWARD balls that win the race, '
      + 'how many survive the corridor. ⚠ MOVING DENOMINATOR (PW-C0 §CORRECTIONS 2): the L3 '
      + 'race-winner set is itself power-dependent; the denominator-stable face is quoted beside '
      + 'it (`outfieldEndToEndConversion`).',
  },
  lateralCorridorSurvivalRate: {
    num: (r) => outfieldLat(r.atReceptions, 'lateralUncut'),
    den: (r) => outfieldLat(r.atReceptions, 'lateralRace'),
    unit: 'share of race-winning outfield lateral options',
    what: '⭐⭐ H-PW.1 (b), THE LATERAL LIMB — the same rung on the lateral lane (outfield). '
      + 'The same four rungs, the same functions; BU-C0 published this lane only at L4.',
  },
  outfieldEndToEndConversion: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'),
    den: (r) => outfield(r.atReceptions, 'behind'),
    unit: 'share of outfield behind-ball bodies',
    what: '⭐⭐ THE DENOMINATOR-STABLE FACE OF RECORD (PW-C0 §CORRECTIONS 2): outfield backward '
      + 'END-TO-END conversion L4/L1 — L1 is power-independent, so the pairing is clean. PW-C0 '
      + 'measured 21.09 % → 25.04 % at the ceiling rung THROUGH THE ORACLE; this is the same '
      + 'face in a WALKED world.',
  },
  lateralEndToEndConversion: {
    num: (r) => outfieldLat(r.atReceptions, 'lateralUncut'),
    den: (r) => outfieldLat(r.atReceptions, 'lateral'),
    unit: 'share of outfield lateral bodies',
    what: '⭐ the denominator-stable form of the LATERAL limb (L4/L1, outfield)',
  },
  gkCorridorSurvivalRate: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindRaceGk,
    unit: 'share of race-winning GK options', what: 'the same rung for the keeper ball',
  },
  gkEndToEndConversion: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindGk,
    unit: 'share of GK behind-ball bodies', what: 'the keeper\'s own end-to-end conversion',
  },
  /* ==== THE SUPPLY FACES (BU-C0's headline, commensurable) ==== */
  behindBallOptionsPerReception: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.receptions,
    unit: 'options / reception',
    what: '⭐⭐ THE SUPPLY HEADLINE — behind-the-ball team-mates the ENGINE\'S OWN machinery '
      + 'calls a live option (L1 ∧ L2 ∧ L3 ∧ L4), per reception. BU-C0\'s frozen definition.',
  },
  behindBallOptionsPerPressedReception: {
    num: (r) => r.atPressedReceptions.behindUncut, den: (r) => r.receptionsPressed,
    unit: 'options / pressed reception',
    what: '⭐ PRESSED-RECEPTION SUPPLY (the #288.3 hypothesis face, banked MARGINAL at BU-T0b '
      + 'and re-tested at BU-T1; carried here for commensurability)',
  },
  behindBallOptionsPerPressedCarrierMoment: {
    num: (r) => r.atPressedCarrier.behindUncut, den: (r) => r.carrierSamplesPressed,
    unit: 'options / pressed-carrier moment',
    what: 'the same count at PRESSED-CARRIER moments (sampled every 12 ticks)',
  },
  lateralOptionsPerReception: {
    num: (r) => r.atReceptions.lateralUncut, den: (r) => r.receptions,
    unit: 'options / reception', what: '⭐ the LATERAL lane\'s live supply per reception',
  },
  shareReceptionsWithNoBehindOption: {
    num: (r) => r.behindHist[0], den: (r) => r.receptions,
    unit: 'share of receptions', what: '⭐ ZERO-OPTION SHARE — receptions offering no '
      + 'behind-ball option at all (BU-C0 measured 43.73 %)',
  },
  shareReceptionsWithTwoOrMore: {
    num: (r) => r.receptions - r.behindHist[0] - r.behindHist[1], den: (r) => r.receptions,
    unit: 'share of receptions', what: 'the #246 BAND — receptions offering 2 or more',
  },
  /* ==== #286.1's GK-SPLIT LADDER, rung by rung ==== */
  ladderL1OutfieldBodiesPerReception: {
    num: (r) => outfield(r.atReceptions, 'behind'), den: (r) => r.receptions,
    unit: 'bodies / reception', what: 'L1 OUTFIELD — bodies behind the ball line, keeper removed',
  },
  ladderL1GkBodiesPerReception: {
    num: (r) => r.atReceptions.behindGk, den: (r) => r.receptions,
    unit: 'bodies / reception', what: 'L1 GK',
  },
  ladderL2OutfieldPerReception: {
    num: (r) => outfield(r.atReceptions, 'behindFlight'), den: (r) => r.receptions,
    unit: 'bodies / reception', what: '⭐ L2 OUTFIELD — the ball actually arrives',
  },
  ladderL3OutfieldPerReception: {
    num: (r) => outfield(r.atReceptions, 'behindRace'), den: (r) => r.receptions,
    unit: 'options / reception', what: '⭐ L3 OUTFIELD — the receiver wins the race',
  },
  ladderL4OutfieldPerReception: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'), den: (r) => r.receptions,
    unit: 'options / reception',
    what: '⭐⭐ L4 OUTFIELD — THE OUTFIELD SUPPLY (the behind-ball option that is not the keeper)',
  },
  ladderL4GkPerReception: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.receptions,
    unit: 'options / reception', what: 'L4 GK — the keeper ball',
  },
  keeperShareOfSurvivingOptions: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindUncut,
    unit: 'share of surviving behind-ball options',
    what: '⭐ the KEEPER SHARE (BU-C0 54.20 % armed; BU-T0 replicated 53.89 %)',
  },
  behindCorridorSurvivalRate: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.atReceptions.behindRace,
    unit: 'share of race-winning behind options', what: 'RUNG L4\'s bite (GK-inclusive)',
  },
  behindReachabilityRate: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.atReceptions.behind,
    unit: 'share of behind-ball bodies', what: 'end-to-end conversion (GK-inclusive)',
  },
  aheadReachabilityRate: {
    num: (r) => r.atReceptions.aheadUncut, den: (r) => r.atReceptions.ahead,
    unit: 'share of ahead bodies', what: 'the same rate for bodies ahead of the ball',
  },
  aheadCorridorSurvivalRate: {
    num: (r) => r.atReceptions.aheadUncut, den: (r) => r.atReceptions.aheadRace,
    unit: 'share of race-winning ahead options', what: 'the corridor rung for the FORWARD lane',
  },
  reachableOptionsPerReception: {
    num: (r) => r.atReceptions.uncutAll, den: (r) => r.receptions,
    unit: 'options / reception', what: 'ALL live options (any direction, full ladder)',
  },
  behindOptionsInEngineWindowPerReception: {
    num: (r) => r.atReceptions.behindUncutInWindow, den: (r) => r.receptions,
    unit: 'options / reception',
    what: 'behind-ball options ALSO inside the engine\'s own 6–30 m pass-choice window',
  },
  meanArrivalMarginOfBehindOptions: {
    num: (r) => r.atReceptions.marginSumBehind, den: (r) => r.atReceptions.behindRace,
    unit: 'seconds', what: 'how comfortably the behind-ball race is won, when it is won',
  },
  shareOfTeammatesBehindAtReception: {
    num: (r) => r.atReceptions.behind, den: (r) => r.atReceptions.mates,
    unit: 'share of team-mates', what: 'E7 AT WORLD GRAIN — share behind the ball line',
  },
  meanTeammateDeltaAtReception: {
    num: (r) => r.atReceptions.deltaSum, den: (r) => r.atReceptions.mates,
    unit: 'metres (+ = ahead of the ball)', what: 'E7 — the mean longitudinal offset',
  },
  /* ==== ⭐ THE USAGE / DIRECTION FACES (Q07 conventions) ==== */
  forwardShareOfAttempts: {
    num: (r) => r.attemptsForwardEngine, den: (r) => r.attempts,
    unit: 'share of pass attempts',
    what: '⭐ Q07 VERBATIM — the ENGINE\'S OWN forward counter. ⭐ PRE-REGISTERED (#291.3): a '
      + 'FORWARD-SHIFTED usage mix is the PREDICTED outcome of arming this axis, NOT a failure.',
  },
  backwardShareOfAttempts: {
    num: (r) => r.attemptsBackwardMine, den: (r) => r.attempts,
    unit: 'share of pass attempts', what: 'Q07\'s POOLED complement, split: BACKWARD',
  },
  lateralShareOfAttempts: {
    num: (r) => r.attemptsLateralMine, den: (r) => r.attempts,
    unit: 'share of pass attempts', what: 'Q07\'s pooled complement, split: LATERAL',
  },
  forwardShareOfCompletions: {
    num: (r) => r.completedForwardEngine, den: (r) => r.completed,
    unit: 'share of completed passes', what: 'THE COMPLETED-PASS DIRECTION MIX — forward',
  },
  backwardShareOfCompletions: {
    num: (r) => r.completedBackwardMine, den: (r) => r.completed,
    unit: 'share of completed passes', what: '⭐ BACKWARD completed-pass share',
  },
  lateralShareOfCompletions: {
    num: (r) => r.completedLateralMine, den: (r) => r.completed,
    unit: 'share of completed passes', what: '⭐ LATERAL completed-pass share',
  },
  circulationShareOfCompletions: {
    num: (r) => r.completedBackwardMine + r.completedLateralMine, den: (r) => r.completed,
    unit: 'share of completed passes',
    what: '⭐⭐ BACKWARD + LATERAL together — the CIRCULATION ball, the contract\'s own object',
  },
  passCompletionRate: {
    num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
    unit: 'share', what: '⭐ Q06 — the engine\'s own completion rate',
  },
  attemptsPerMatch: {
    num: (r) => r.attempts, den: perMatch, unit: 'attributed attempts / match',
    what: '⭐ PASS ATTEMPTS PER MATCH',
  },
  receptionsPerMatch: {
    num: (r) => r.receptions, den: perMatch, unit: 'receptions / match',
    what: '⭐ RECEPTIONS PER MATCH',
  },
  /* ==== THE TERMINAL CENSUS ==== */
  ...Object.fromEntries(TERMINALS.map((t) => [`terminal_${t}`, {
    num: (r: Row) => r.terminalOpen[t], den: (r: Row) => r.openSpells,
    unit: 'share of open-play spells',
    what: `THE TERMINAL CENSUS — open-play spells ending in: ${t}. ⚠ L3-VETO ENTANGLED AT THE `
      + 'LEVEL (BU-C0 §CORRECTIONS 3); the CONTRAST is entanglement-free (both arms carry it).',
  }])) as Record<string, Face>,
  lossToOpponentShare: {
    num: (r) => r.terminalOpen.tackled + r.terminalOpen.intercepted + r.terminalOpen.badTouch
      + r.terminalOpen.lostOther,
    den: (r) => r.openSpells,
    unit: 'share of open-play spells',
    what: '⭐ TOTAL LOSS TO AN OPPONENT — the honest cross-arm aggregate (BU-C0 §CORRECTIONS 3)',
  },
  /* ==== THE R-乙 RE-RUN CLAUSE (REPORTED) ==== */
  spellMeanSeconds: {
    num: (r) => r.openSpellTickSum * DT, den: (r) => r.openSpells,
    unit: 'sim-seconds', what: '⭐ Q01 — the mean open-play spell duration (REPORTED)',
  },
  touchesPerSpell: {
    num: (r) => r.openSpellTouchSum, den: (r) => r.openSpells,
    unit: 'touches / spell', what: '⭐ Q05 (REPORTED)',
  },
  pressedReceptionShare: {
    num: (r) => r.receptionsPressed, den: (r) => r.receptions,
    unit: 'share of receptions',
    what: '⭐ Q14-shaped (REPORTED) — ⚠ ALL receptions, NOT Q14\'s first-of-spell population',
  },
  openSpellsPerMatch: {
    num: (r) => r.openSpells, den: perMatch, unit: 'open-play spells / match', what: 'context',
  },
  goalsPerMatch: {
    num: (r) => r.goals, den: perMatch, unit: 'goals / match', what: '⭐ goals/match (REPORTED)',
  },
};
const FACE_KEYS = Object.keys(FACES);
const ARM_STRUCTURAL_FACES = FACE_KEYS.filter((k) => FACES[k].armStructural === true);

/* ---- the estimator: PAIRED CLUSTER BOOTSTRAP over match seeds ---- */
let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const REF_ARM: ArmKind = 'v7';
const DOSE_ARMS: readonly ArmKind[] = ['v7pw'];
interface FaceRow {
  face: string; unit: string; what: string;
  arms: Record<string, { point: number; num: number; den: number; ci95: [number, number] }>;
  contrasts: Record<string, { delta: number; ci95: [number, number]; relative: number }>;
}
const scoreFaces = (b: Battery): FaceRow[] => {
  const K = b.rows[REF_ARM].length;
  resetStats();
  const draws: number[][] = [];
  for (let d = 0; d < BOOTSTRAP; d++) {
    const idx: number[] = [];
    for (let i = 0; i < K; i++) idx.push(Math.floor(statsRng.next() * K) % K);
    draws.push(idx);
  }
  const out: FaceRow[] = [];
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nums: Record<string, number[]> = {};
    const dens: Record<string, number[]> = {};
    for (const arm of ARMS) {
      nums[arm] = b.rows[arm].map((r) => f.num(r));
      dens[arm] = b.rows[arm].map((r) => f.den(r));
    }
    const arms: FaceRow['arms'] = {};
    const point: Record<string, number> = {};
    for (const arm of ARMS) {
      const n = sum(nums[arm]); const d = sum(dens[arm]);
      point[arm] = ratio(n, d);
      const vals: number[] = [];
      for (const idx of draws) {
        let nn = 0; let dd = 0;
        for (const i of idx) { nn += nums[arm][i]; dd += dens[arm][i]; }
        vals.push(ratio(nn, dd));
      }
      const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
      arms[arm] = {
        point: point[arm], num: n, den: d,
        ci95: s.length === 0 ? [Number.NaN, Number.NaN]
          : [s[Math.floor(0.025 * s.length)],
            s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
      };
    }
    /** ⭐ PAIRED: ONE resample-index matrix draws BOTH arms, so the contrast is the same
     *  resampled worlds and the pairing is inside the interval. */
    const contrasts: FaceRow['contrasts'] = {};
    for (const arm of DOSE_ARMS) {
      const vals: number[] = [];
      for (const idx of draws) {
        let nA = 0; let dA = 0; let nB = 0; let dB = 0;
        for (const i of idx) {
          nA += nums[arm][i]; dA += dens[arm][i];
          nB += nums[REF_ARM][i]; dB += dens[REF_ARM][i];
        }
        vals.push(ratio(nA, dA) - ratio(nB, dB));
      }
      const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
      const delta = point[arm] - point[REF_ARM];
      contrasts[arm] = {
        delta,
        ci95: s.length === 0 ? [Number.NaN, Number.NaN]
          : [s[Math.floor(0.025 * s.length)],
            s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
        relative: point[REF_ARM] === 0 ? Number.NaN : delta / point[REF_ARM],
      };
    }
    out.push({ face: key, unit: f.unit, what: f.what, arms, contrasts });
  }
  return out;
};

/* ========================================================================== */
/* §12 THE DETERMINISTIC CORE (G-DET runs it twice)                            */
/* ========================================================================== */
interface Core { battery: Battery; faces: FaceRow[] }
const runCore = (): Core => {
  const battery = runBattery();
  return { battery, faces: scoreFaces(battery) };
};
const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, sig: r.signature, armOk: r.armOk, life: r.lifecycle, pw: r.pwLedger,
  sc: r.strikeCensus,
  rec: r.receptions, recP: r.receptionsPressed, recOpen: r.receptionsOpenPlay,
  atRec: r.atReceptions, atRecP: r.atPressedReceptions, atCar: r.atPressedCarrier,
  carS: r.carrierSamples, carSP: r.carrierSamplesPressed,
  hist: r.behindHist, histP: r.behindHistPressed,
  att: r.attempts, attU: r.attemptsUnattributed, attFE: r.attemptsForwardEngine,
  attFM: r.attemptsForwardMine, attBM: r.attemptsBackwardMine, attLM: r.attemptsLateralMine,
  attAgree: r.attemptsAgreeWithEngine,
  cmp: r.completed, cmpF: r.completedForwardEngine, cmpB: r.completedBackwardMine,
  cmpL: r.completedLateralMine, cmpIntended: r.completedToIntendedTarget,
  eP: r.enginePasses, ePF: r.enginePassesForward, ePC: r.enginePassesCompleted,
  spells: r.spells, openSpells: r.openSpells, openTicks: r.openSpellTickSum,
  openTouches: r.openSpellTouchSum,
  termAll: r.terminalAll, termOpen: r.terminalOpen,
  ticks: r.ticks, inPlay: r.inPlayTicks, simS: r.simSeconds, goals: r.goals,
});
const rowFromCell = (c: Record<string, unknown>): Row => ({
  seed: Number(c.seed), signature: String(c.sig), armOk: Boolean(c.armOk),
  lifecycle: c.life as Lifecycle, pwLedger: c.pw as PwLedger,
  strikeCensus: c.sc as StrikeCensus,
  receptions: Number(c.rec), receptionsPressed: Number(c.recP),
  receptionsOpenPlay: Number(c.recOpen),
  atReceptions: c.atRec as OptionCensus, atPressedReceptions: c.atRecP as OptionCensus,
  atPressedCarrier: c.atCar as OptionCensus,
  carrierSamples: Number(c.carS), carrierSamplesPressed: Number(c.carSP),
  behindHist: c.hist as number[], behindHistPressed: c.histP as number[],
  attempts: Number(c.att), attemptsUnattributed: Number(c.attU),
  attemptsForwardEngine: Number(c.attFE), attemptsForwardMine: Number(c.attFM),
  attemptsBackwardMine: Number(c.attBM), attemptsLateralMine: Number(c.attLM),
  attemptsAgreeWithEngine: Number(c.attAgree),
  completed: Number(c.cmp), completedForwardEngine: Number(c.cmpF),
  completedBackwardMine: Number(c.cmpB), completedLateralMine: Number(c.cmpL),
  completedToIntendedTarget: Number(c.cmpIntended),
  enginePasses: Number(c.eP), enginePassesForward: Number(c.ePF),
  enginePassesCompleted: Number(c.ePC),
  spells: Number(c.spells), openSpells: Number(c.openSpells),
  openSpellTickSum: Number(c.openTicks), openSpellTouchSum: Number(c.openTouches),
  terminalAll: c.termAll as Record<TerminalClass, number>,
  terminalOpen: c.termOpen as Record<TerminalClass, number>,
  ticks: Number(c.ticks), inPlayTicks: Number(c.inPlay), simSeconds: Number(c.simS),
  goals: Number(c.goals),
});
const coreDigest = (c: Core): string => sha(canonical({
  faces: c.faces,
  rows: Object.fromEntries(ARMS.map((a) => [a, c.battery.rows[a].map(cellOf)])),
}));

banner(`  [pw-t1] ⭐ THE BATTERY: mode=${MODE} N=${N_RUN} seeds × ${ARMS.length} arms × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [pw-t1] G-DET second run…');
const coreB = runCore();
const digestB = coreDigest(coreB);
const C = coreA;

/* ---- the NON-PERTURBATION control: the same worlds, every instrument OFF ---- */
const perturbCheck = (() => {
  let ok = 0; let total = 0;
  const n = Math.min(PERTURB_CHECK_SEEDS, N_RUN);
  for (const arm of ARMS) {
    for (let i = 0; i < n; i++) {
      const quiet = walk(BASE_RUN + i, arm, false);
      total += 1;
      if (quiet.signature === C.battery.rows[arm][i].signature
        && quiet.spells === C.battery.rows[arm][i].spells
        && quiet.enginePasses === C.battery.rows[arm][i].enginePasses
        && quiet.pwLedger.decisions === C.battery.rows[arm][i].pwLedger.decisions) ok += 1;
    }
  }
  return { ok, total };
})();

/* ========================================================================== */
/* §13 THE READINGS THE GATES SCORE                                            */
/* ========================================================================== */
const rowsOf = (a: ArmKind): Row[] => C.battery.rows[a];
const allRows = (): Row[] => ARMS.flatMap(rowsOf);
const armOkCount = allRows().filter((r) => r.armOk).length;
const armTotal = allRows().length;
const armProbes = Object.fromEntries(ARMS.map((a) => {
  const m = new Match(matchCfg(GWORLD_SEED, a));
  armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
  return [a, m];
})) as Record<ArmKind, Match>;
const worldSeedOk = ARMS.every((a) => l3ArmedVersion(armProbes[a]) === L3_WORLD_VERSION
  && a4ArmedVersion(armProbes[a]) === L3_WORLD_VERSION)
  && armProbes.v7pw.pwWeightChooser && !armProbes.v7.pwWeightChooser;
const armsSeparate = (() => {
  const sigs = ARMS.map((a) => {
    const m = new Match(matchCfg(GWORLD_SEED, a));
    armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
    for (let i = 0; i < 600 && !m.finished; i++) m.step(DT);
    return signature(m);
  });
  return new Set(sigs).size === ARMS.length;
})();

const batteryLifecycle = (() => {
  const total: Lifecycle = { ...EMPTY_LIFECYCLE };
  for (const r of allRows()) addLifecycle(total, r.lifecycle);
  return total;
})();
const pwLedgerByArm = Object.fromEntries(ARMS.map((a) => {
  const acc = emptyPwLedger();
  for (const r of rowsOf(a)) addPwLedger(acc, r.pwLedger);
  return [a, acc];
})) as Record<ArmKind, PwLedger>;
const strikeCensusByArm = Object.fromEntries(ARMS.map((a) => {
  const acc = emptyStrikeCensus();
  for (const r of rowsOf(a)) addStrikeCensus(acc, r.strikeCensus);
  return [a, acc];
})) as Record<ArmKind, StrikeCensus>;

/**
 * ⭐⭐ THE CLOSURE EQUATION (#294 item 3 / PW-T0c §CORRECTIONS 5), OVER THE FULL BATTERY, PER
 * ARM: deposits(non-default) = struck + wind-up-voided + abandoned + in-flight-at-whistle.
 * A NON-ZERO RESIDUE IS A STAGE-STOPPING FINDING.
 */
const closure = Object.fromEntries(ARMS.map((a) => {
  const l = pwLedgerByArm[a];
  const accounted = l.struckAtChosenPower + l.windupChoiceVoided + l.depositsAbandoned
    + l.inFlightAtWhistle;
  return [a, {
    depositsNonDefault: l.depositsNonDefault,
    struckAtChosenPower: l.struckAtChosenPower,
    windupChoiceVoided: l.windupChoiceVoided,
    depositsAbandoned: l.depositsAbandoned,
    inFlightAtWhistle: l.inFlightAtWhistle,
    accounted,
    silentLossResidue: l.depositsNonDefault - accounted,
    closes: l.depositsNonDefault - accounted === 0,
  }];
})) as Record<ArmKind, {
  depositsNonDefault: number; struckAtChosenPower: number; windupChoiceVoided: number;
  depositsAbandoned: number; inFlightAtWhistle: number; accounted: number;
  silentLossResidue: number; closes: boolean;
}>;
const closureResidueTotal = sum(ARMS.map((a) => Math.abs(closure[a].silentLossResidue)));

/** ⭐ THE EXECUTION-HONESTY RECEIPT — the trace must agree with the engine's own ball. */
const executionReceipt = (() => {
  const sc = strikeCensusByArm;
  const armed = sc.v7pw;
  const base = sc.v7;
  const meanRel = (c: StrikeCensus): number =>
    ratio(sum(c.sumRelErrByRung), strikesOnLadder(c));
  return {
    strikesArmed: armed.strikes,
    strikesBase: base.strikes,
    strikesOnLadderArmed: strikesOnLadder(armed),
    strikesOffLadderArmed: armed.offLadder,
    chosenStrikesArmed: armed.pw,
    linkedArmed: armed.linked,
    unlinkedChosenArmed: armed.unlinkedPw,
    linkShare: ratio(armed.linked, armed.pw),
    maxRelErrorArmed: armed.maxRelErr,
    maxRelErrorBase: base.maxRelErr,
    meanRelErrorArmed: meanRel(armed),
    meanRelErrorBase: meanRel(base),
    /** the engine's own struck-at-non-default counter vs the camera's own count */
    ledgerStruckNonDefault: pwLedgerByArm.v7pw.struckAtChosenPower,
    cameraStruckNonDefault: sum(LADDER.map((p, k) => (p === 1 ? 0 : armed.byRung[k]))),
    baseArmEverStruckOffReference:
      sum(LADDER.map((p, k) => (p === 1 ? 0 : base.byRung[k]))) > 0,
  };
})();

/**
 * ⭐⭐ H-PW.1 — SCORED HERE, ON A RULE WRITTEN INTO THE FROZEN PROBE BEFORE THE BATTERY RAN.
 *
 * (a) WEIGHT IS CHOSEN AT STRIKE GRAIN. The population is REAL STRUCK BALLS in the armed arm
 *     (the camera's own rows), never oracle preferences. The verdict is a DISTRIBUTION SHAPE,
 *     the PW-T0a idiom (#292's own pre-registered DEGENERATE clause, whose boundary was 95 %):
 *       · DEGENERATE  — some single rung takes ≥ 95 % of real strikes, or any rung takes 0.
 *       · NON-DEGENERATE — otherwise. The SHARES THEMSELVES are the finding, never the label.
 * (b) CORRIDOR SURVIVAL OF BACKWARD/LATERAL OPTIONS RISES RESOLVEDLY, on the BU-C0 census
 *     instrument with GK-SPLIT rungs, paired v7 vs v7+PW:
 *       · the BACKWARD limb (`outfieldCorridorSurvivalRate`) must RISE with its paired 95 % CI
 *         strictly above 0 (RESOLVED), and
 *       · the LATERAL limb (`lateralCorridorSurvivalRate`) is reported beside it; (b) reads
 *         POSITIVE if EITHER limb rises resolvedly and NEITHER falls resolvedly.
 *       · ⭐ the DENOMINATOR-STABLE face (`outfieldEndToEndConversion`, L4/L1) is quoted
 *         alongside with its own resolution — and if it CONTRADICTS the scored limb, the
 *         verdict is reported as CONTESTED with both numbers.
 * BOTH conjuncts must hold for H-PW.1 POSITIVE. Either failing ⇒ NEGATIVE with the mechanism.
 */
const HPW1_DEGENERACY_SHARE = 0.95;
const hPw1 = (() => {
  const armed = strikeCensusByArm.v7pw;
  const den = strikesOnLadder(armed);
  const shares = LADDER.map((_, k) => ratio(armed.byRung[k], den));
  const maxShare = Math.max(...shares.map((s) => (Number.isFinite(s) ? s : 0)));
  const anyEmpty = armed.byRung.some((v) => v === 0);
  const aPass = den > 0 && !anyEmpty && maxShare < HPW1_DEGENERACY_SHARE;
  const faceOf = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
  const read = (k: string) => {
    const f = faceOf(k);
    const c = f.contrasts.v7pw;
    const hw = (c.ci95[1] - c.ci95[0]) / 2;
    return {
      face: k,
      v7: round(f.arms.v7.point), v7pw: round(f.arms.v7pw.point),
      delta: round(c.delta), ci95: c.ci95.map((x) => round(x)),
      absDeltaOverHalfWidth: round(hw === 0 ? Number.NaN : Math.abs(c.delta) / hw, 4),
      rises: c.ci95[0] > 0 && c.ci95[1] > 0,
      falls: c.ci95[0] < 0 && c.ci95[1] < 0,
    };
  };
  const back = read('outfieldCorridorSurvivalRate');
  const lat = read('lateralCorridorSurvivalRate');
  const stable = read('outfieldEndToEndConversion');
  const stableLat = read('lateralEndToEndConversion');
  const bPass = (back.rises || lat.rises) && !back.falls && !lat.falls;
  const contested = bPass && stable.falls;
  return {
    preRegisteredRule: {
      a: `the rung distribution of REAL STRIKES in the armed arm is NON-DEGENERATE: every rung `
        + `takes a non-zero share and no single rung takes ≥ ${HPW1_DEGENERACY_SHARE * 100} % `
        + '(the PW-T0a distribution-shape idiom; the shares themselves are the finding)',
      b: 'the BACKWARD outfield corridor-survival face rises with its paired 95 % CI strictly '
        + 'above 0, or the LATERAL limb does, and neither falls resolvedly; the '
        + 'DENOMINATOR-STABLE face (L4/L1) is quoted alongside and a contradiction is reported '
        + 'as CONTESTED',
      both: 'H-PW.1 is POSITIVE only if (a) AND (b) hold',
    },
    a: {
      population: 'REAL STRUCK BALLS in the armed arm (the strike camera)',
      strikesOnLadder: den,
      byRung: armed.byRung,
      shares: shares.map((s) => round(s)),
      rungLabels: RUNG_LABELS,
      maxRungShare: round(maxShare),
      anyRungEmpty: anyEmpty,
      verdict: aPass ? 'NON-DEGENERATE' : 'DEGENERATE',
      pass: aPass,
    },
    b: {
      backwardLimb: back,
      lateralLimb: lat,
      denominatorStableFace: stable,
      denominatorStableLateral: stableLat,
      movingDenominatorDisclosure: '⚠ the corridor-survival faces are conditioned on the L3 '
        + 'race-winner set, which is itself power-dependent (PW-C0 §CORRECTIONS 2) — the '
        + 'end-to-end faces (L4/L1) are the denominator-stable ones and are published beside '
        + 'them, per that correction\'s own rule.',
      verdict: bPass ? (contested ? 'POSITIVE-BUT-CONTESTED' : 'POSITIVE') : 'NEGATIVE',
      pass: bPass,
    },
    verdict: aPass && bPass ? (contested ? 'POSITIVE-BUT-CONTESTED' : 'POSITIVE') : 'NEGATIVE',
    pass: aPass && bPass,
    standing: [
      '⭐ PRE-REGISTERED AND STANDING (#291.3): a FORWARD-SHIFTED usage mix is the PREDICTED '
        + 'outcome of arming this axis — its appearance is NOT a failure.',
      '⭐ PRE-REGISTERED AND STANDING (#292.4 (d)): the chosen region may be THIN — the '
        + 'marginal admissions carry worse prices. Thinness is a measurement, not a failure.',
      '⛔ NO GATE READS THIS SCORE. The gates prove the instrument; the score is a reading.',
    ],
  };
})();

const oracleReceipt = (() => {
  let calls = 0; let nulls = 0; let behind = 0; let race = 0; let uncut = 0; let corridor = 0;
  let gk = 0; let lateral = 0; let lateralRace = 0;
  for (const r of allRows()) {
    for (const c of [r.atReceptions, r.atPressedReceptions, r.atPressedCarrier]) {
      calls += c.oracleCalls; nulls += c.oracleNulls; corridor += c.corridorCalls;
      behind += c.behind; race += c.raceAll; uncut += c.uncutAll;
      gk += c.behindGk; lateral += c.lateral; lateralRace += c.lateralRace;
    }
  }
  return {
    calls, nulls, behind, race, uncut, corridor, gk, lateral, lateralRace,
    nullShare: ratio(nulls, calls),
    uncutGivenRace: ratio(uncut, race),
  };
})();

const q07Receipt = (() => {
  let enginePasses = 0; let attributed = 0; let unattributed = 0;
  let engineForward = 0; let attributedForward = 0;
  let agree = 0; let attempts = 0; let engineCompleted = 0; let completed = 0;
  for (const r of allRows()) {
    enginePasses += r.enginePasses; attributed += r.attempts;
    unattributed += r.attemptsUnattributed;
    engineForward += r.enginePassesForward; attributedForward += r.attemptsForwardEngine;
    agree += r.attemptsAgreeWithEngine; attempts += r.attempts;
    engineCompleted += r.enginePassesCompleted; completed += r.completed;
  }
  return {
    enginePasses, attributed, unattributed, engineForward, attributedForward,
    attempts, agree, engineCompleted, completed,
    agreementShare: ratio(agree, attempts),
    attributionShare: ratio(attributed, enginePasses),
    completionAttributionShare: ratio(completed, engineCompleted),
    booksClose: attributed + unattributed === enginePasses,
    forwardBooksClose: attributedForward <= engineForward,
    completionsNeverExceedTheEngine: completed <= engineCompleted,
  };
})();

const spellReceipt = (() => {
  let spells = 0; let classified = 0; let open = 0; let openClassified = 0;
  for (const r of allRows()) {
    spells += r.spells; open += r.openSpells;
    classified += sum(TERMINALS.map((t) => r.terminalAll[t]));
    openClassified += sum(TERMINALS.map((t) => r.terminalOpen[t]));
  }
  return { spells, classified, open, openClassified,
    closes: spells === classified && open === openClassified };
})();

const histReceipt = (() => {
  let ok = 0; let total = 0;
  for (const r of allRows()) {
    total += 1;
    if (sum(r.behindHist) === r.receptions && sum(r.behindHistPressed) === r.receptionsPressed) {
      ok += 1;
    }
  }
  return { ok, total };
})();

/** ⭐ the strike census must close against its own strike count, per row. */
const strikeBooks = (() => {
  let ok = 0; let total = 0;
  for (const r of allRows()) {
    total += 1;
    const c = r.strikeCensus;
    const byDir = sum(c.byRungDir);
    const byPressed = sum(c.byRungPressed);
    const byBoth = sum(c.byRungDirPressed);
    const onLadder = strikesOnLadder(c);
    const outcomes = sum(c.completedByRung) + sum(c.lostByRung) + sum(c.outByRung)
      + sum(c.retainedByRung) + sum(c.otherByRung);
    if (onLadder + c.offLadder === c.strikes && byDir === onLadder && byPressed === onLadder
      && byBoth === onLadder && outcomes === onLadder) ok += 1;
  }
  return { ok, total };
})();

const vacuity = (() => {
  const empties: string[] = [];
  const structuralEmpties: string[] = [];
  let cells = 0;
  for (const f of C.faces) {
    const structural = FACES[f.face].armStructural === true;
    for (const arm of ARMS) {
      cells += 1;
      if (f.arms[arm].den !== 0) continue;
      if (structural && arm === REF_ARM) structuralEmpties.push(`${arm}.${f.face}`);
      else empties.push(`${arm}.${f.face}`);
    }
  }
  const armedDens = ARM_STRUCTURAL_FACES.map((k) => {
    const f = C.faces.find((x) => x.face === k) as FaceRow;
    return f.arms.v7pw.den;
  });
  return {
    cells, empties, structuralEmpties,
    declaredArmStructuralFaces: ARM_STRUCTURAL_FACES.length,
    everyArmStructuralFaceIsMeasuredOnTheArmedArm: armedDens.every((d) => d > 0),
  };
})();

const faceRederivation = (() => {
  let checked = 0; let bad = 0;
  for (const row of C.faces) {
    const f = FACES[row.face];
    for (const arm of ARMS) {
      checked += 1;
      const want = ratio(sum(rowsOf(arm).map(f.num)), sum(rowsOf(arm).map(f.den)));
      const got = row.arms[arm].point;
      if (!(Number.isNaN(want) && Number.isNaN(got)) && Math.abs(want - got) > 1e-12) bad += 1;
    }
  }
  return { checked, bad };
})();

const CLAIMED: { name: string; range: [number, number] }[] = [
  ...(BASE_RUN === BATTERY_BASE
    ? [{ name: 'PW-T1 battery',
      range: [BATTERY_BASE, BATTERY_BASE + N_RUN - 1] as [number, number] }]
    : []),
  { name: 'PW-T1 smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 19] },
  { name: 'PW-T1 guard/override block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: '⭐ PW-T1 lifecycle/doors block',
    range: [LIFECYCLE_BASE, LIFECYCLE_BASE + LIFECYCLE_SEEDS_FULL - 1] },
  { name: 'PW-T1 world-identity seed', range: [GWORLD_SEED, GWORLD_SEED] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
const allSeedsInBand = ARMS.every((a) => rowsOf(a)
  .every((r) => r.seed >= BASE_RUN && r.seed <= BASE_RUN + N_RUN - 1));
const allClaimedInsideTheBlock = CLAIMED
  .every((c) => c.range[0] >= 12_495_000 && c.range[1] <= 12_495_999);
const refSeedKey = rowsOf(REF_ARM).map((r) => r.seed).join(',');
const pairedSameSeeds = ARMS.every((a) => rowsOf(a).map((r) => r.seed).join(',') === refSeedKey);

/* ========================================================================== */
/* §14 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean;
  live: boolean;
}
interface GateSpec<I> {
  name: string;
  fn: (i: I) => Conj;
  input: I;
  mutants: readonly { conjunct: string; name: string; mutate: (i: I) => I }[];
}
const REGISTRY: GateSpec<never>[] = [];
const registerGate = <I>(spec: GateSpec<I>): void => {
  REGISTRY.push(spec as unknown as GateSpec<never>);
};
const runMutant = <I>(
  gate: string, name: string, conjunct: string, fn: (i: I) => Conj, base: Conj, mutated: I,
): MutantResult => {
  const out = fn(mutated);
  const flipped = base[conjunct] === true && out[conjunct] === false;
  const othersSurvived = Object.keys(base).filter((k) => k !== conjunct)
    .every((k) => out[k] === base[k]);
  return { gate, name, conjunct, flipped, othersSurvived, live: flipped && othersSurvived };
};

/* ---- 1 gDet ---- */
registerGate<{ equal: boolean; digest: string }>({
  name: 'gDet',
  fn: (i) => ({ rederivesBitIdentically: i.equal, digestNonEmpty: i.digest.length === 64 }),
  input: { equal: digestA === digestB, digest: digestA },
  mutants: [
    { conjunct: 'rederivesBitIdentically', name: 'the second run differed', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'digestNonEmpty', name: 'no digest was produced', mutate: (i) => ({ ...i, digest: '' }) },
  ],
});

/* ---- 2 xSrcUntouched — ⭐ THE #286.1-CORRECTED FORM: WORKTREE vs HEAD, both conjuncts ---- */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
registerGate<{ diff: string; status: string }>({
  name: 'xSrcUntouched',
  fn: (i) => ({ noWorktreeVsHeadDiff: i.diff === '', noUntrackedOrStaged: i.status === '' }),
  input: { diff: srcDiff, status: srcStatus },
  mutants: [
    { conjunct: 'noWorktreeVsHeadDiff', name: 'src moved against HEAD', mutate: (i) => ({ ...i, diff: 'src/sim/Match.ts | 2 +-' }) },
    { conjunct: 'noUntrackedOrStaged', name: 'an untracked src file appeared', mutate: (i) => ({ ...i, status: '?? src/x.ts' }) },
  ],
});

/* ---- 3 gArms ---- */
registerGate<{
  ok: number; total: number; probe: boolean; separate: boolean; arms: number; paired: boolean;
}>({
  name: 'gArms',
  fn: (i) => ({
    everyWalkedMatchCarriesItsArmLive: i.ok === i.total,
    theIdentitySeedReadsTheEntrysOwnArmedVersions: i.probe,
    theTwoArmsAreDifferentWorlds: i.separate,
    bothArmsWereWalked: i.arms === 2,
    theArmsWalkTheSameSeeds: i.paired,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: {
    ok: armOkCount, total: armTotal, probe: worldSeedOk, separate: armsSeparate,
    arms: ARMS.length, paired: pairedSameSeeds,
  },
  mutants: [
    { conjunct: 'everyWalkedMatchCarriesItsArmLive', name: 'a walk was not its arm', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theIdentitySeedReadsTheEntrysOwnArmedVersions', name: 'the entry\'s armed-version read disagreed', mutate: (i) => ({ ...i, probe: false }) },
    { conjunct: 'theTwoArmsAreDifferentWorlds', name: '⭐ the slice was the base world twice', mutate: (i) => ({ ...i, separate: false }) },
    { conjunct: 'bothArmsWereWalked', name: 'an arm was dropped', mutate: (i) => ({ ...i, arms: 1 }) },
    { conjunct: 'theArmsWalkTheSameSeeds', name: 'the arms were not paired', mutate: (i) => ({ ...i, paired: false }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 4 gDose — ⭐ #289 CANON: the data-source guard hashes FILE BYTES ---- */
registerGate<{
  fileSha: string; declared: string; bytes: number; resultSha: string; labels: number;
  groups: number; cbDose: number;
}>({
  name: 'gDose',
  fn: (i) => ({
    theL3DoseFileIsTheDECLAREDBYTES: i.fileSha === i.declared,
    theFileIsNonEmptyInBytes: i.bytes > 0,
    theArtifactStillCarriesItsOwnResultSha: i.resultSha === L3_T1_SHA && i.resultSha.length === 64,
    theL3DoseIsNonEmpty: i.labels > 0,
    theL3DoseHasBothArrivalGroups: i.groups === 2,
    theCbPronenessIsTheShippedEntrysOwn: i.cbDose === CB_WORLD_DOSE,
  }),
  input: {
    fileSha: T1_BYTES_SHA, declared: T1_FILE_BYTES_SHA, bytes: T1_BYTE_LENGTH,
    resultSha: String((T1_FILE as { resultSha256?: string }).resultSha256 ?? ''),
    labels: L3_DOSE_LABELS, groups: L3_DOSE.length, cbDose: CB_WORLD_DOSE,
  },
  mutants: [
    { conjunct: 'theL3DoseFileIsTheDECLAREDBYTES', name: '⭐ the dose file\'s BYTES moved', mutate: (i) => ({ ...i, fileSha: 'deadbeef' }) },
    { conjunct: 'theFileIsNonEmptyInBytes', name: 'the dose file was empty', mutate: (i) => ({ ...i, bytes: 0 }) },
    { conjunct: 'theArtifactStillCarriesItsOwnResultSha', name: 'the artifact lost its digest', mutate: (i) => ({ ...i, resultSha: '' }) },
    { conjunct: 'theL3DoseIsNonEmpty', name: 'the L3 dose was empty', mutate: (i) => ({ ...i, labels: 0 }) },
    { conjunct: 'theL3DoseHasBothArrivalGroups', name: 'an L3 group went missing', mutate: (i) => ({ ...i, groups: 1 }) },
    { conjunct: 'theCbPronenessIsTheShippedEntrysOwn', name: 'the CB dose drifted', mutate: (i) => ({ ...i, cbDose: 99 }) },
  ],
});

/* ---- 5 ⭐⭐ gLifecycle — THE M-BU.2 DEBT AT THE NEW CB+L3+PW COMPOSITION ---- */
registerGate<{
  firingCarry: number; firingOwner: number; firingPhase: number; firingWhistle: number;
  firingConstruct: number; firingAge: number; firedInInertCells: number;
  pwBoundary: number; pwBatteryBoundary: number; pwOffDecisions: number;
  batteryCarry: number; batteryArmings: number; batteryKnocks: number; batteryConstruct: number;
  seatArmed: number; arm: number; clear: number; slotClears: number; fire: number;
  pwDeposits: number; pwCalls: number; pwVoids: number; pwSlotClears: number;
  o2: boolean; ek: boolean; o1: boolean; c7: boolean; ptp: boolean; eye: boolean; cells: number;
}>({
  name: 'gLifecycle',
  fn: (i) => ({
    noArmingSurvivesItsOwnTickWhereAnAimCanFire: i.firingCarry === 0,
    noArmingCrossesAPossessionWhereAnAimCanFire: i.firingOwner === 0,
    noArmingCrossesAPhaseWhereAnAimCanFire: i.firingPhase === 0,
    noArmingIsLiveAtTheWhistleWhereAnAimCanFire: i.firingWhistle === 0,
    noArmingExistsAtConstruction: i.firingConstruct === 0 && i.batteryConstruct === 0,
    theLongestArmingLifeIsZeroWhereAnAimCanFire: i.firingAge === 0,
    noKnockEverFiresWithTheCapabilityDoorShut: i.firedInInertCells === 0,
    /** ⭐⭐ THE PW SLOT'S OWN LAW, both populations */
    noPwDepositSurvivesItsOwnTickInTheDoorsMatrix: i.pwBoundary === 0,
    noPwDepositSurvivesItsOwnTickInTheBattery: i.pwBatteryBoundary === 0,
    thePwLedgerIsSilentWithItsDoorShut: i.pwOffDecisions === 0,
    theMeasuredBatteryHoldsTheSameLaw: i.batteryCarry === 0,
    everyArmingIsConsumedInItsOwnTickAcrossTheBattery: i.batteryArmings === i.batteryKnocks,
    theSeatActuallyArmedSomething: i.seatArmed > 0,
    theEarlyReturnExposureIsRealInThisComposition: i.o1 && i.c7,
    theTwoNamedSeamsAreNotArmedHere: !i.o2 && !i.ek,
    thePtpDoorIsNotArmedHere: !i.ptp,
    theStationEyeIsNull: i.eye,
    exactlyOneArmingWriteSite: i.arm === 1,
    exactlyOneWithdrawalCallSite: i.clear === 1,
    theSlotIsClearedInExactlyTwoPlaces: i.slotClears === 2,
    exactlyOneFiringFork: i.fire === 1,
    /** ⭐ the PW seam's own site census */
    exactlyOnePwDepositWriteSite: i.pwDeposits === 1,
    exactlyOnePwChooserCallSite: i.pwCalls === 1,
    theSixVoidAccountingSitesAreStillThere: i.pwVoids === 6,
    thePwSlotIsClearedInEveryConsumerAndTheSweep: i.pwSlotClears === 3,
    theMatrixIsTheFullPowerSet: i.cells === 64,
  }),
  input: {
    firingCarry: lifecycleMatrix.firing.carryOvers,
    firingOwner: lifecycleMatrix.firing.carryOverAcrossOwnerChange,
    firingPhase: lifecycleMatrix.firing.carryOverAcrossPhaseChange,
    firingWhistle: lifecycleMatrix.firing.armedAtWhistle,
    firingConstruct: lifecycleMatrix.firing.armedAtConstruction,
    firingAge: lifecycleMatrix.firing.maxArmingAgeTicks,
    firedInInertCells: lifecycleMatrix.inert.touchPasts,
    pwBoundary: lifecycleMatrix.total.pwDepositLiveAtStepBoundary,
    pwBatteryBoundary: batteryLifecycle.pwDepositLiveAtStepBoundary,
    pwOffDecisions: lifecycleMatrix.pwOffLedger.decisions + pwLedgerByArm.v7.decisions,
    batteryCarry: batteryLifecycle.carryOvers,
    batteryArmings: batteryLifecycle.armings,
    batteryKnocks: batteryLifecycle.touchPasts,
    batteryConstruct: batteryLifecycle.armedAtConstruction,
    seatArmed: lifecycleMatrix.firing.armings + batteryLifecycle.armings,
    arm: lifecycleStructure.armCallSites,
    clear: lifecycleStructure.clearCallSites,
    slotClears: lifecycleStructure.slotClearedInSrc,
    fire: lifecycleStructure.fireForks,
    pwDeposits: lifecycleStructure.pwDepositWriteSites,
    pwCalls: lifecycleStructure.pwChooserCallSites,
    pwVoids: lifecycleStructure.pwVoidSites,
    pwSlotClears: lifecycleStructure.pwSlotClears,
    o2: lifecycleStructure.o2LookArmed, ek: lifecycleStructure.ekHoldVetoArmed,
    o1: lifecycleStructure.o1PassWindupArmed, c7: lifecycleStructure.c7WindupArmed,
    ptp: lifecycleStructure.ptpArmed, eye: lifecycleStructure.stationEyeNull,
    cells: ALL_DOOR_CELLS.length,
  },
  mutants: [
    { conjunct: 'noArmingSurvivesItsOwnTickWhereAnAimCanFire', name: 'an arming outlived its tick', mutate: (i) => ({ ...i, firingCarry: 1 }) },
    { conjunct: 'noArmingCrossesAPossessionWhereAnAimCanFire', name: 'an arming crossed a possession', mutate: (i) => ({ ...i, firingOwner: 1 }) },
    { conjunct: 'noArmingCrossesAPhaseWhereAnAimCanFire', name: 'an arming crossed a restart', mutate: (i) => ({ ...i, firingPhase: 1 }) },
    { conjunct: 'noArmingIsLiveAtTheWhistleWhereAnAimCanFire', name: 'an arming was live at the whistle', mutate: (i) => ({ ...i, firingWhistle: 1 }) },
    { conjunct: 'noArmingExistsAtConstruction', name: 'a match was born armed', mutate: (i) => ({ ...i, firingConstruct: 1 }) },
    { conjunct: 'theLongestArmingLifeIsZeroWhereAnAimCanFire', name: 'an arming aged', mutate: (i) => ({ ...i, firingAge: 3 }) },
    { conjunct: 'noKnockEverFiresWithTheCapabilityDoorShut', name: '⭐ a knock fired with the door shut', mutate: (i) => ({ ...i, firedInInertCells: 1 }) },
    { conjunct: 'noPwDepositSurvivesItsOwnTickInTheDoorsMatrix', name: '⭐⭐ a chosen weight outlived its tick', mutate: (i) => ({ ...i, pwBoundary: 1 }) },
    { conjunct: 'noPwDepositSurvivesItsOwnTickInTheBattery', name: '⭐⭐ the battery leaked a deposit', mutate: (i) => ({ ...i, pwBatteryBoundary: 1 }) },
    { conjunct: 'thePwLedgerIsSilentWithItsDoorShut', name: '⭐ the PW seam moved with its door shut', mutate: (i) => ({ ...i, pwOffDecisions: 1 }) },
    { conjunct: 'theMeasuredBatteryHoldsTheSameLaw', name: 'the battery carried an arming over', mutate: (i) => ({ ...i, batteryCarry: 1 }) },
    { conjunct: 'everyArmingIsConsumedInItsOwnTickAcrossTheBattery', name: 'armings and knocks stopped matching', mutate: (i) => ({ ...i, batteryKnocks: i.batteryKnocks - 1 }) },
    { conjunct: 'theSeatActuallyArmedSomething', name: '⭐ the proof was vacuous (nothing armed)', mutate: (i) => ({ ...i, seatArmed: 0 }) },
    { conjunct: 'theEarlyReturnExposureIsRealInThisComposition', name: '⭐ a zero of absence (no early return armed)', mutate: (i) => ({ ...i, o1: false }) },
    { conjunct: 'theTwoNamedSeamsAreNotArmedHere', name: 'the discharge over-claimed its scope', mutate: (i) => ({ ...i, o2: true }) },
    { conjunct: 'thePtpDoorIsNotArmedHere', name: 'PTP × PW was silently composed', mutate: (i) => ({ ...i, ptp: true }) },
    { conjunct: 'theStationEyeIsNull', name: 'an eye entered the composition', mutate: (i) => ({ ...i, eye: false }) },
    { conjunct: 'exactlyOneArmingWriteSite', name: 'a second arming site appeared', mutate: (i) => ({ ...i, arm: 2 }) },
    { conjunct: 'exactlyOneWithdrawalCallSite', name: 'a second withdrawal site appeared', mutate: (i) => ({ ...i, clear: 2 }) },
    { conjunct: 'theSlotIsClearedInExactlyTwoPlaces', name: 'the slot gained a third clear', mutate: (i) => ({ ...i, slotClears: 3 }) },
    { conjunct: 'exactlyOneFiringFork', name: 'a second firing fork appeared', mutate: (i) => ({ ...i, fire: 2 }) },
    { conjunct: 'exactlyOnePwDepositWriteSite', name: '⭐ a second deposit writer appeared', mutate: (i) => ({ ...i, pwDeposits: 2 }) },
    { conjunct: 'exactlyOnePwChooserCallSite', name: 'a second chooser call site appeared', mutate: (i) => ({ ...i, pwCalls: 2 }) },
    { conjunct: 'theSixVoidAccountingSitesAreStillThere', name: '⭐ a void-accounting site vanished', mutate: (i) => ({ ...i, pwVoids: 5 }) },
    { conjunct: 'thePwSlotIsClearedInEveryConsumerAndTheSweep', name: 'a PW slot clear vanished', mutate: (i) => ({ ...i, pwSlotClears: 2 }) },
    { conjunct: 'theMatrixIsTheFullPowerSet', name: 'the doors matrix was not exhaustive', mutate: (i) => ({ ...i, cells: 1 }) },
  ],
});

/* ---- 6 ⭐⭐ gDoors — the composition's IDENTITY and LIVENESS laws ---- */
registerGate<{
  inertHold: boolean; checked: number; pwChecked: number;
  liveC: number; liveS: number; liveV: number; liveW: number; liveWfull: number;
  cells: number; seeds: number; ptpThrows: boolean; ptpNames: boolean;
  pwAlone: boolean; ptpAlone: boolean;
}>({
  name: 'gDoors',
  fn: (i) => ({
    everyDoorIsInertWithoutItsPartner: i.inertHold,
    theInertnessWasCheckedOnRealCells: i.checked > 0,
    thePwSilenceLawWasCheckedOnRealCells: i.pwChecked > 0,
    theCommitPhysicsDoorIsALiveDoor: i.liveC > 0,
    theChoiceSeatIsALiveDoor: i.liveS > 0,
    theL3VetoIsALiveDoor: i.liveV > 0,
    thePwDoorIsALiveDoor: i.liveW > 0,
    thePwDoorIsLiveOnTheFullCbL3Stack: i.liveWfull > 0,
    theMatrixIsExhaustive: i.cells === 64 && i.seeds > 0,
    thePtpTimesPwCompositionIsREFUSEDByTheConstructor: i.ptpThrows && i.ptpNames,
    eitherDoorAloneStillBuilds: i.pwAlone && i.ptpAlone,
  }),
  input: {
    inertHold: doorsAlways.allHold,
    checked: sum(Object.values(doorsAlways.checked)),
    pwChecked: doorsAlways.checked.pwSeamSilentWithItsDoorShut,
    liveC: doorsLive.theCommitPhysicsDoorMovesTheWorld,
    liveS: doorsLive.theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen,
    liveV: doorsLive.theL3VetoMovesTheWorldOnADosedBook,
    liveW: doorsLive.thePwDoorMovesTheWorld,
    liveWfull: doorsLive.thePwDoorMovesTheWorldOnTheFullCbL3Stack,
    cells: ALL_DOOR_CELLS.length, seeds: LIFECYCLE_SEEDS.length,
    ptpThrows: ptpDoorReceipt.bothArmedThrows,
    ptpNames: ptpDoorReceipt.messageNamesTheRuling,
    pwAlone: ptpDoorReceipt.pwAloneBuilds, ptpAlone: ptpDoorReceipt.ptpAloneBuilds,
  },
  mutants: [
    { conjunct: 'everyDoorIsInertWithoutItsPartner', name: '⭐ a door moved the world without its partner', mutate: (i) => ({ ...i, inertHold: false }) },
    { conjunct: 'theInertnessWasCheckedOnRealCells', name: 'the inertness laws checked nothing', mutate: (i) => ({ ...i, checked: 0 }) },
    { conjunct: 'thePwSilenceLawWasCheckedOnRealCells', name: 'the PW silence law checked nothing', mutate: (i) => ({ ...i, pwChecked: 0 }) },
    { conjunct: 'theCommitPhysicsDoorIsALiveDoor', name: 'the CB physics door was dead', mutate: (i) => ({ ...i, liveC: 0 }) },
    { conjunct: 'theChoiceSeatIsALiveDoor', name: 'the choice seat was dead', mutate: (i) => ({ ...i, liveS: 0 }) },
    { conjunct: 'theL3VetoIsALiveDoor', name: 'the L3 veto was dead', mutate: (i) => ({ ...i, liveV: 0 }) },
    { conjunct: 'thePwDoorIsALiveDoor', name: '⭐⭐ THE SLICE ITSELF was a dead door', mutate: (i) => ({ ...i, liveW: 0 }) },
    { conjunct: 'thePwDoorIsLiveOnTheFullCbL3Stack', name: '⭐ the PW door died in the exam composition', mutate: (i) => ({ ...i, liveWfull: 0 }) },
    { conjunct: 'theMatrixIsExhaustive', name: 'the matrix was not the full power set', mutate: (i) => ({ ...i, cells: 1 }) },
    { conjunct: 'thePtpTimesPwCompositionIsREFUSEDByTheConstructor', name: '⭐ the PTP × PW guard disappeared', mutate: (i) => ({ ...i, ptpThrows: false }) },
    { conjunct: 'eitherDoorAloneStillBuilds', name: 'the guard over-refused', mutate: (i) => ({ ...i, pwAlone: false }) },
  ],
});

/* ---- 7 gNonPerturbing ---- */
registerGate<{ ok: number; total: number }>({
  name: 'gNonPerturbing',
  fn: (i) => ({
    theInstrumentedWalkIsTheQuietWalk: i.ok === i.total,
    nonVacuousControlCount: i.total > 0,
  }),
  input: perturbCheck,
  mutants: [
    { conjunct: 'theInstrumentedWalkIsTheQuietWalk', name: '⭐ an instrument (the camera) changed the world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'nonVacuousControlCount', name: 'no control walk ran', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 8 gOracle ---- */
registerGate<{
  called: boolean; answered: boolean; raceBoth: boolean; corridorBoth: boolean;
  corridorRan: boolean; behindSeen: boolean; gkSeen: boolean; outfieldSeen: boolean;
  lateralSeen: boolean; band: number;
}>({
  name: 'gOracle',
  fn: (i) => ({
    theEnginesEvaluatorWasActuallyCalled: i.called,
    itAnsweredForNearlyEveryPair: i.answered,
    bothRaceVerdictsOccur: i.raceBoth,
    theCorridorTestWasActuallyRun: i.corridorRan,
    bothCorridorVerdictsOccur: i.corridorBoth,
    behindBodiesWereSeenAtAll: i.behindSeen,
    theGkSplitSeesBothSides: i.gkSeen && i.outfieldSeen,
    theLateralLaneIsANonEmptyPopulation: i.lateralSeen,
    theForwardBandIsTheEnginesOwn: i.band === 2,
  }),
  input: {
    called: oracleReceipt.calls > 0,
    answered: oracleReceipt.nulls < oracleReceipt.calls,
    raceBoth: oracleReceipt.race > 0 && oracleReceipt.race < oracleReceipt.calls,
    corridorRan: oracleReceipt.corridor > 0,
    corridorBoth: oracleReceipt.uncut > 0 && oracleReceipt.uncut < oracleReceipt.race,
    behindSeen: oracleReceipt.behind > 0,
    gkSeen: oracleReceipt.gk > 0,
    outfieldSeen: oracleReceipt.behind - oracleReceipt.gk > 0,
    lateralSeen: oracleReceipt.lateral > 0 && oracleReceipt.lateralRace > 0,
    band: FORWARD_BAND_M,
  },
  mutants: [
    { conjunct: 'theEnginesEvaluatorWasActuallyCalled', name: 'the oracle never ran', mutate: (i) => ({ ...i, called: false }) },
    { conjunct: 'itAnsweredForNearlyEveryPair', name: 'the oracle refused every pair', mutate: (i) => ({ ...i, answered: false }) },
    { conjunct: 'bothRaceVerdictsOccur', name: 'the race verdict was constant', mutate: (i) => ({ ...i, raceBoth: false }) },
    { conjunct: 'theCorridorTestWasActuallyRun', name: 'the corridor test never ran', mutate: (i) => ({ ...i, corridorRan: false }) },
    { conjunct: 'bothCorridorVerdictsOccur', name: 'the corridor verdict was constant', mutate: (i) => ({ ...i, corridorBoth: false }) },
    { conjunct: 'behindBodiesWereSeenAtAll', name: 'no behind-ball body was ever seen', mutate: (i) => ({ ...i, behindSeen: false }) },
    { conjunct: 'theGkSplitSeesBothSides', name: 'the GK split was one-sided', mutate: (i) => ({ ...i, gkSeen: false }) },
    { conjunct: 'theLateralLaneIsANonEmptyPopulation', name: '⭐ the lateral limb was measured on nothing', mutate: (i) => ({ ...i, lateralSeen: false }) },
    { conjunct: 'theForwardBandIsTheEnginesOwn', name: 'the ±2 m band stopped tracing to src', mutate: (i) => ({ ...i, band: 3 }) },
  ],
});

/* ---- 9 ⭐⭐ gStrikeCamera — the (a) instrument is ALIVE, SIDED and CLOSED ---- */
registerGate<{
  armedStrikes: number; baseStrikes: number; chosen: number; baseChosen: number;
  baseOffReference: boolean; ladderCells: number; booksOk: number; booksTotal: number;
  linked: number; offLadder: number; windup: number;
}>({
  name: 'gStrikeCamera',
  fn: (i) => ({
    bothArmsStruckRealBalls: i.armedStrikes > 0 && i.baseStrikes > 0,
    theArmedArmActuallyChoseWeights: i.chosen > 0,
    theBaseArmNeverChoseAnything: i.baseChosen === 0,
    theBaseArmNeverLeftTheReferenceRung: !i.baseOffReference,
    everyRungOfTheEnginesLadderIsARealCell: i.ladderCells === 3,
    theStrikeCensusClosesOnEveryRow: i.booksOk === i.booksTotal,
    theObservationLedgerLinkedRealDecisions: i.linked > 0,
    noStrikeLandedOffTheEnginesOwnLadder: i.offLadder === 0,
    theWindUpPathActuallyCarriedStrikes: i.windup > 0,
  }),
  input: {
    armedStrikes: strikeCensusByArm.v7pw.strikes,
    baseStrikes: strikeCensusByArm.v7.strikes,
    chosen: strikeCensusByArm.v7pw.pw,
    baseChosen: strikeCensusByArm.v7.pw,
    baseOffReference: executionReceipt.baseArmEverStruckOffReference,
    ladderCells: LADDER.length,
    booksOk: strikeBooks.ok, booksTotal: strikeBooks.total,
    linked: strikeCensusByArm.v7pw.linked,
    offLadder: strikeCensusByArm.v7pw.offLadder + strikeCensusByArm.v7.offLadder,
    windup: strikeCensusByArm.v7pw.fromWindup,
  },
  mutants: [
    { conjunct: 'bothArmsStruckRealBalls', name: 'no strike was ever seen', mutate: (i) => ({ ...i, armedStrikes: 0 }) },
    { conjunct: 'theArmedArmActuallyChoseWeights', name: '⭐⭐ the armed arm never chose a weight', mutate: (i) => ({ ...i, chosen: 0 }) },
    { conjunct: 'theBaseArmNeverChoseAnything', name: '⭐ the base arm was silently armed', mutate: (i) => ({ ...i, baseChosen: 1 }) },
    { conjunct: 'theBaseArmNeverLeftTheReferenceRung', name: 'the base arm struck off-reference', mutate: (i) => ({ ...i, baseOffReference: true }) },
    { conjunct: 'everyRungOfTheEnginesLadderIsARealCell', name: 'the ladder changed size', mutate: (i) => ({ ...i, ladderCells: 4 }) },
    { conjunct: 'theStrikeCensusClosesOnEveryRow', name: 'a strike escaped its own cross-tabs', mutate: (i) => ({ ...i, booksOk: i.booksOk - 1 }) },
    { conjunct: 'theObservationLedgerLinkedRealDecisions', name: '⭐ the observation ledger linked nothing', mutate: (i) => ({ ...i, linked: 0 }) },
    { conjunct: 'noStrikeLandedOffTheEnginesOwnLadder', name: 'a strike carried a weight off the ladder', mutate: (i) => ({ ...i, offLadder: 1 }) },
    { conjunct: 'theWindUpPathActuallyCarriedStrikes', name: 'the wind-up path was never exercised', mutate: (i) => ({ ...i, windup: 0 }) },
  ],
});

/* ---- 10 ⭐⭐ gChoiceLedger — THE CLOSURE EQUATION, FULL BATTERY, PER ARM ---- */
registerGate<{
  residue: number; armedCloses: boolean; baseCloses: boolean;
  deposits: number; struck: number; cameraStruck: number; baseDeposits: number;
}>({
  name: 'gChoiceLedger',
  fn: (i) => ({
    theClosureEquationHoldsOnTheArmedArm: i.armedCloses,
    theClosureEquationHoldsOnTheBaseArm: i.baseCloses,
    thereIsNoSilentLossAnywhereInTheBattery: i.residue === 0,
    theArmedArmActuallyDepositedNonDefaultWeights: i.deposits > 0,
    theEnginesStruckCounterAgreesWithTheCamera: i.struck === i.cameraStruck,
    theBaseArmDepositedNothing: i.baseDeposits === 0,
  }),
  input: {
    residue: closureResidueTotal,
    armedCloses: closure.v7pw.closes, baseCloses: closure.v7.closes,
    deposits: closure.v7pw.depositsNonDefault,
    struck: executionReceipt.ledgerStruckNonDefault,
    cameraStruck: executionReceipt.cameraStruckNonDefault,
    baseDeposits: closure.v7.depositsNonDefault,
  },
  mutants: [
    { conjunct: 'theClosureEquationHoldsOnTheArmedArm', name: '⭐⭐ the armed ledger did not close', mutate: (i) => ({ ...i, armedCloses: false }) },
    { conjunct: 'theClosureEquationHoldsOnTheBaseArm', name: 'the base ledger did not close', mutate: (i) => ({ ...i, baseCloses: false }) },
    { conjunct: 'thereIsNoSilentLossAnywhereInTheBattery', name: '⭐⭐ A SILENT LOSS RESIDUE (stage-stopping)', mutate: (i) => ({ ...i, residue: 1 }) },
    { conjunct: 'theArmedArmActuallyDepositedNonDefaultWeights', name: '⭐ the closure was vacuous (nothing deposited)', mutate: (i) => ({ ...i, deposits: 0 }) },
    { conjunct: 'theEnginesStruckCounterAgreesWithTheCamera', name: '⭐ the camera and the engine disagreed on strikes', mutate: (i) => ({ ...i, cameraStruck: i.cameraStruck + 1 }) },
    { conjunct: 'theBaseArmDepositedNothing', name: 'the base arm deposited a weight', mutate: (i) => ({ ...i, baseDeposits: 1 }) },
  ],
});

/* ---- 11 ⭐ gLadder — the exam runs the DEFAULT ladder (#294 item 3) ---- */
registerGate<{
  keySetAnywhere: number; literalOk: boolean; min: number; max: number; ref: number;
  pricerCalls: number;
}>({
  name: 'gLadder',
  fn: (i) => ({
    thePowerLadderKeyIsNeverSetInThisProbe: i.keySetAnywhere === 0,
    theLadderIsTheBrainsOwnCanaryLiteral: i.literalOk,
    theLadderEndpointsAreTheShippedClampsOwn: i.min === PASS_POWER_MIN && i.max === PASS_POWER_MAX,
    theReferenceRungIsPresentAndIsOne: i.ref === 1,
    theChooserStillCallsTheShippedPricerRatherThanRestatingIt: i.pricerCalls === 1,
  }),
  input: {
    /** ⭐ MEASURED, not asserted: the identity probes AND a battery-configured match of each
     *  arm are read for a non-null `pwPowerLadder`. The key is never set by this probe. */
    keySetAnywhere: ARMS.filter((a) => armProbes[a].pwPowerLadder !== null).length
      + ARMS.map((a) => new Match(matchCfg(BATTERY_BASE, a)))
        .filter((m) => m.pwPowerLadder !== null).length,
    literalOk: CANARY_LITERAL_MATCHES,
    min: LADDER[0], max: LADDER[LADDER.length - 1], ref: LADDER[REFERENCE_INDEX],
    pricerCalls: lifecycleStructure.pwPricerCalledNotRestated,
  },
  mutants: [
    { conjunct: 'thePowerLadderKeyIsNeverSetInThisProbe', name: '⭐ a ladder override was set', mutate: (i) => ({ ...i, keySetAnywhere: 1 }) },
    { conjunct: 'theLadderIsTheBrainsOwnCanaryLiteral', name: 'the ladder stopped tracing to the brain', mutate: (i) => ({ ...i, literalOk: false }) },
    { conjunct: 'theLadderEndpointsAreTheShippedClampsOwn', name: 'a rung left the shipped clamp', mutate: (i) => ({ ...i, min: 0.5 }) },
    { conjunct: 'theReferenceRungIsPresentAndIsOne', name: '⭐ the reference rung vanished (#294 item 3\'s silent degeneracy)', mutate: (i) => ({ ...i, ref: 0.9 }) },
    { conjunct: 'theChooserStillCallsTheShippedPricerRatherThanRestatingIt', name: 'the objective stopped being the shipped one', mutate: (i) => ({ ...i, pricerCalls: 0 }) },
  ],
});

/* ---- 12 ⭐ gExecution — the strike trace agrees with the engine's own ball ---- */
registerGate<{
  maxRel: number; strikes: number; linkShare: number; chosen: number; unlinked: number;
}>({
  name: 'gExecution',
  fn: (i) => ({
    everyTracedStrikeReDerivesTheEnginesOwnLaunchSpeed: i.maxRel < 1e-9,
    theTraceCoveredRealStrikes: i.strikes > 0,
    theObservationLedgerLinkedTheOverwhelmingMajority: i.linkShare > 0.9,
    theChosenPopulationIsNonEmpty: i.chosen > 0,
    theUnlinkedRemainderIsPublishedNotHidden: i.unlinked >= 0,
  }),
  input: {
    maxRel: Math.max(executionReceipt.maxRelErrorArmed, executionReceipt.maxRelErrorBase),
    strikes: executionReceipt.strikesArmed + executionReceipt.strikesBase,
    linkShare: executionReceipt.linkShare,
    chosen: executionReceipt.chosenStrikesArmed,
    unlinked: executionReceipt.unlinkedChosenArmed,
  },
  mutants: [
    { conjunct: 'everyTracedStrikeReDerivesTheEnginesOwnLaunchSpeed', name: '⭐ the trace stopped agreeing with the ball', mutate: (i) => ({ ...i, maxRel: 1 }) },
    { conjunct: 'theTraceCoveredRealStrikes', name: 'the trace covered nothing', mutate: (i) => ({ ...i, strikes: 0 }) },
    { conjunct: 'theObservationLedgerLinkedTheOverwhelmingMajority', name: '⭐ the link rate collapsed', mutate: (i) => ({ ...i, linkShare: 0 }) },
    { conjunct: 'theChosenPopulationIsNonEmpty', name: 'no chosen strike existed', mutate: (i) => ({ ...i, chosen: 0 }) },
    { conjunct: 'theUnlinkedRemainderIsPublishedNotHidden', name: 'the unlinked count went missing', mutate: (i) => ({ ...i, unlinked: -1 }) },
  ],
});

/* ---- 13 gQ07 ---- */
registerGate<{
  close: boolean; fwdClose: boolean; cmpClose: boolean; attempts: number; attribution: number;
}>({
  name: 'gQ07',
  fn: (i) => ({
    everyEnginePassIsAttributedOrCountedUnattributed: i.close,
    theForwardCountNeverExceedsTheEnginesOwn: i.fwdClose,
    theCompletionCountNeverExceedsTheEnginesOwn: i.cmpClose,
    theAttributionCoversTheOverwhelmingMajority: i.attribution > 0.9,
    nonVacuousAttemptCount: i.attempts > 0,
  }),
  input: {
    close: q07Receipt.booksClose, fwdClose: q07Receipt.forwardBooksClose,
    cmpClose: q07Receipt.completionsNeverExceedTheEngine,
    attempts: q07Receipt.attempts, attribution: q07Receipt.attributionShare,
  },
  mutants: [
    { conjunct: 'everyEnginePassIsAttributedOrCountedUnattributed', name: 'a pass went missing from the books', mutate: (i) => ({ ...i, close: false }) },
    { conjunct: 'theForwardCountNeverExceedsTheEnginesOwn', name: 'a forward pass was invented', mutate: (i) => ({ ...i, fwdClose: false }) },
    { conjunct: 'theCompletionCountNeverExceedsTheEnginesOwn', name: 'a completion was invented', mutate: (i) => ({ ...i, cmpClose: false }) },
    { conjunct: 'theAttributionCoversTheOverwhelmingMajority', name: 'the attribution collapsed', mutate: (i) => ({ ...i, attribution: 0 }) },
    { conjunct: 'nonVacuousAttemptCount', name: 'no attempt was observed', mutate: (i) => ({ ...i, attempts: 0 }) },
  ],
});

/* ---- 14 gSpells ---- */
registerGate<{ closes: boolean; spells: number; open: number; classes: number }>({
  name: 'gSpells',
  fn: (i) => ({
    everySpellLandsInExactlyOneTerminalClass: i.closes,
    theOpenPlayPopulationIsNonEmpty: i.open > 0,
    theClassSetIsTheFrozenOne: i.classes === TERMINALS.length,
    nonVacuousSpellCount: i.spells > 0,
  }),
  input: {
    closes: spellReceipt.closes, spells: spellReceipt.spells, open: spellReceipt.open,
    classes: TERMINALS.length,
  },
  mutants: [
    { conjunct: 'everySpellLandsInExactlyOneTerminalClass', name: 'a spell escaped the census', mutate: (i) => ({ ...i, closes: false }) },
    { conjunct: 'theOpenPlayPopulationIsNonEmpty', name: 'no open-play spell existed', mutate: (i) => ({ ...i, open: 0 }) },
    { conjunct: 'theClassSetIsTheFrozenOne', name: 'the class set changed', mutate: (i) => ({ ...i, classes: 3 }) },
    { conjunct: 'nonVacuousSpellCount', name: 'no spell was walked', mutate: (i) => ({ ...i, spells: 0 }) },
  ],
});

/* ---- 15 gNonVacuity — with the ARM-STRUCTURAL zeros declared, never hidden ---- */
registerGate<{
  empties: string[]; structural: string[]; declared: number; armedOk: boolean;
  cells: number; hist: number; histTotal: number;
}>({
  name: 'gNonVacuity',
  fn: (i) => ({
    noUndeclaredRateHasAZeroDenominator: i.empties.length === 0,
    everyStructuralZeroIsOnTheBaseArmAndDeclared: i.structural.length <= i.declared,
    everyArmStructuralFaceIsMEASUREDOnTheArmedArm: i.armedOk,
    theHistogramSumsToItsOwnDenominator: i.hist === i.histTotal,
    nonVacuousCellCount: i.cells > 0,
  }),
  input: {
    empties: vacuity.empties, structural: vacuity.structuralEmpties,
    declared: vacuity.declaredArmStructuralFaces,
    armedOk: vacuity.everyArmStructuralFaceIsMeasuredOnTheArmedArm,
    cells: vacuity.cells, hist: histReceipt.ok, histTotal: histReceipt.total,
  },
  mutants: [
    { conjunct: 'noUndeclaredRateHasAZeroDenominator', name: 'a rate was published on nothing', mutate: (i) => ({ ...i, empties: ['x'] }) },
    { conjunct: 'everyStructuralZeroIsOnTheBaseArmAndDeclared', name: 'an undeclared structural zero appeared', mutate: (i) => ({ ...i, declared: -1 }) },
    { conjunct: 'everyArmStructuralFaceIsMEASUREDOnTheArmedArm', name: '⭐ a PW face was never measured at all', mutate: (i) => ({ ...i, armedOk: false }) },
    { conjunct: 'theHistogramSumsToItsOwnDenominator', name: 'the histogram lost a reception', mutate: (i) => ({ ...i, hist: i.hist - 1 }) },
    { conjunct: 'nonVacuousCellCount', name: 'nothing was published', mutate: (i) => ({ ...i, cells: 0 }) },
  ],
});

/* ---- 16 ⭐⭐ gFaces — RE-DERIVED FROM THE **SERIALIZED ARTIFACT** (#287.1's canon) ---- */
const facesFromDisk = {
  checked: 0, bad: 0, keys: 0, cellsRead: 0, ran: false, mismatches: [] as string[],
};
const rederiveFacesFromDisk = (path: string): void => {
  const file = readJson(path) as unknown as {
    faces: { face: string; arms: Record<string, { num: number; den: number }> }[];
    perSeedCells: Record<string, Record<string, unknown>[]>;
  };
  facesFromDisk.ran = true;
  facesFromDisk.keys = file.faces.length;
  const rebuilt: Record<string, Row[]> = {};
  for (const arm of ARMS) {
    rebuilt[arm] = (file.perSeedCells[arm] ?? []).map(rowFromCell);
    facesFromDisk.cellsRead += rebuilt[arm].length;
  }
  for (const pub of file.faces) {
    const f = FACES[pub.face];
    if (f === undefined) { facesFromDisk.mismatches.push(`${pub.face}:unknown`); continue; }
    for (const arm of ARMS) {
      facesFromDisk.checked += 1;
      const num = sum(rebuilt[arm].map(f.num));
      const den = sum(rebuilt[arm].map(f.den));
      const p = pub.arms[arm];
      if (p === undefined || Math.abs(num - p.num) > 1e-9 || Math.abs(den - p.den) > 1e-9) {
        facesFromDisk.bad += 1;
        facesFromDisk.mismatches.push(`${pub.face}.${arm}`);
      }
    }
  }
};
registerGate<typeof facesFromDisk>({
  name: 'gFaces',
  fn: (i) => ({
    everyPublishedFaceRederivesFromTheSERIALIZEDCells: i.bad === 0,
    theGateActuallyParsedTheArtifactFromDisk: i.ran && i.cellsRead > 0,
    everyFrozenFaceIsPublished: i.keys === FACE_KEYS.length,
    nonVacuousFaceCount: i.checked > 0,
  }),
  input: facesFromDisk,
  mutants: [
    { conjunct: 'everyPublishedFaceRederivesFromTheSERIALIZEDCells', name: '⭐ a face did not re-derive from the JSON on disk', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'theGateActuallyParsedTheArtifactFromDisk', name: 'the gate never read the file', mutate: (i) => ({ ...i, cellsRead: 0 }) },
    { conjunct: 'everyFrozenFaceIsPublished', name: 'a face went missing', mutate: (i) => ({ ...i, keys: i.keys - 1 }) },
    { conjunct: 'nonVacuousFaceCount', name: 'nothing was re-derived', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 17 gClock ---- */
const clockOk = allRows().every((r) => r.ticks > 0 && r.simSeconds > 0);
registerGate<{ durationOk: boolean; displayOk: boolean; mappingOk: boolean; walks: boolean }>({
  name: 'gClock',
  fn: (i) => ({
    theMatchClockIsTheEngineDefault: i.durationOk,
    theDisplayMinutesCameOutOfTheEnginesOwnExpression: i.displayOk,
    theMappingIsDerivedNotTyped: i.mappingOk,
    everyWalkRanOnTheMatchClock: i.walks,
  }),
  input: {
    durationOk: MATCH_DURATION === 240,
    displayOk: DISPLAY_MINUTES === 90,
    mappingOk: Math.abs(DISPLAY_S_PER_SIM_S - (DISPLAY_MINUTES * 60) / MATCH_DURATION) < 1e-12,
    walks: clockOk,
  },
  mutants: [
    { conjunct: 'theMatchClockIsTheEngineDefault', name: 'the clock was overridden', mutate: (i) => ({ ...i, durationOk: false }) },
    { conjunct: 'theDisplayMinutesCameOutOfTheEnginesOwnExpression', name: 'the display clock stopped tracing', mutate: (i) => ({ ...i, displayOk: false }) },
    { conjunct: 'theMappingIsDerivedNotTyped', name: 'the mapping was typed', mutate: (i) => ({ ...i, mappingOk: false }) },
    { conjunct: 'everyWalkRanOnTheMatchClock', name: 'a walk never stepped', mutate: (i) => ({ ...i, walks: false }) },
  ],
});

/* ---- 18 gSeed ---- */
registerGate<{
  clashes: string[]; internal: string[]; inBand: boolean; ordered: boolean; inBlock: boolean;
}>({
  name: 'gSeed',
  fn: (i) => ({
    noClashWithTheConsumedLedger: i.clashes.length === 0,
    noInternalClash: i.internal.length === 0,
    everyWalkedSeedIsInTheClaimedBattery: i.inBand,
    theClaimedBlocksAreOrdered: i.ordered,
    everyClaimedBlockIsInsideTheStagesOwnBlock: i.inBlock,
  }),
  input: {
    clashes: seedClashes, internal: claimedInternalClashes, inBand: allSeedsInBand,
    ordered: CLAIMED.every((c) => c.range[0] <= c.range[1]),
    inBlock: allClaimedInsideTheBlock,
  },
  mutants: [
    { conjunct: 'noClashWithTheConsumedLedger', name: 'a claimed block collided with a consumed one', mutate: (i) => ({ ...i, clashes: ['x'] }) },
    { conjunct: 'noInternalClash', name: 'two claimed blocks overlapped', mutate: (i) => ({ ...i, internal: ['x'] }) },
    { conjunct: 'everyWalkedSeedIsInTheClaimedBattery', name: 'a walk left the claimed band', mutate: (i) => ({ ...i, inBand: false }) },
    { conjunct: 'theClaimedBlocksAreOrdered', name: 'a block was inverted', mutate: (i) => ({ ...i, ordered: false }) },
    { conjunct: 'everyClaimedBlockIsInsideTheStagesOwnBlock', name: '⭐ a walk left the booked 12,495,000 block', mutate: (i) => ({ ...i, inBlock: false }) },
  ],
});

/* ---- 19 gStats ---- */
const minGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
registerGate<{ base: number; gap: number; resamples: number }>({
  name: 'gStats',
  fn: (i) => ({
    theBaseIsTheDispatchedFloor: i.base === 112_800,
    theGapToEveryPublishedBaseIsAtLeastTheStep: i.gap >= STATS_STEP,
    theResampleCountIsTheFrozenOne: i.resamples === BOOTSTRAP,
  }),
  input: { base: STATS_BASE, gap: minGap, resamples: BOOTSTRAP },
  mutants: [
    { conjunct: 'theBaseIsTheDispatchedFloor', name: 'the stats base moved', mutate: (i) => ({ ...i, base: 1 }) },
    { conjunct: 'theGapToEveryPublishedBaseIsAtLeastTheStep', name: 'the stream collided with a published base', mutate: (i) => ({ ...i, gap: 0 }) },
    { conjunct: 'theResampleCountIsTheFrozenOne', name: 'the resample count moved', mutate: (i) => ({ ...i, resamples: 1 }) },
  ],
});

/* ---- 20 gEnvClean ---- */
registerGate<{ rogue: number; doors: number; preflight: boolean; out: string }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnVariable: i.rogue === 0,
    noEngineDoorIsSet: i.doors === 0,
    aPreflightNeverWritesACanonicalPath: !i.preflight || !isCanonicalPath(i.out),
  }),
  input: {
    rogue: rogueOwn.length, doors: rogueEngine.length, preflight: IS_PREFLIGHT, out: OUT_PATH,
  },
  mutants: [
    { conjunct: 'noRogueOwnVariable', name: 'a rogue PWT1_* var was accepted', mutate: (i) => ({ ...i, rogue: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote the canonical artifact', mutate: (i) => ({ ...i, preflight: true, out: OUT_BY_MODE.full }) },
  ],
});

/* ---- 21 gHashEnvelope ---- */
const envelopeInput = {
  crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[],
};
registerGate<typeof envelopeInput>({
  name: 'gHashEnvelope',
  fn: (i) => ({
    theBodyRederivesItsDigestFromDisk: i.rederivesFromDisk,
    aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest: i.crossOutIdentical,
    noInvocationFactIsInTheHashedBody: i.forbidden.length === 0,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'theBodyRederivesItsDigestFromDisk', name: 'the artifact on disk did not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest', name: 'the envelope entered the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'noInvocationFactIsInTheHashedBody', name: 'a wall-clock field entered the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});

/* ---- 22 gMutants ---- */
const gMutantsInput = { uncovered: [] as string[], dead: 0, total: 0 };
registerGate<typeof gMutantsInput>({
  name: 'gMutants',
  fn: (i) => ({
    noUncoveredConjunctNoGhostNoDuplicate: i.uncovered.length === 0,
    everyMutantIsLive: i.dead === 0,
    nonVacuousMutantCount: i.total > 0,
  }),
  input: gMutantsInput,
  mutants: [
    { conjunct: 'noUncoveredConjunctNoGhostNoDuplicate', name: 'a conjunct owned no mutant', mutate: (i) => ({ ...i, uncovered: ['x'] }) },
    { conjunct: 'everyMutantIsLive', name: 'a mutant was dead', mutate: (i) => ({ ...i, dead: 1 }) },
    { conjunct: 'nonVacuousMutantCount', name: 'no mutant ran', mutate: (i) => ({ ...i, total: 0 }) },
  ],
});

/* ========================================================================== */
/* §15 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
/* ========================================================================== */
const COVERAGE_MAP: Record<string, string[]> = {};
const uncoveredConjuncts: string[] = [];
for (const spec of REGISTRY) {
  const keys = Object.keys(spec.fn(spec.input));
  COVERAGE_MAP[spec.name] = keys;
  for (const k of keys) {
    if (!spec.mutants.some((mu) => mu.conjunct === k)) uncoveredConjuncts.push(`${spec.name}.${k}`);
  }
  const seen = new Set<string>();
  for (const mu of spec.mutants) {
    if (!keys.includes(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(ghost)`);
    if (seen.has(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(duplicate)`);
    seen.add(mu.conjunct);
  }
}
const CONJUNCT_TOTAL = Object.values(COVERAGE_MAP).reduce((a, v) => a + v.length, 0);
if (uncoveredConjuncts.length > 0) {
  banner('PW-T1 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  process.exit(3);
}
const runRegistry = (): { gates: Record<string, boolean>; mutants: MutantResult[] } => {
  const gates: Record<string, boolean> = {};
  const mutants: MutantResult[] = [];
  for (const spec of REGISTRY) {
    const base = spec.fn(spec.input);
    gates[spec.name] = Object.values(base).every(Boolean);
    for (const mu of spec.mutants) {
      mutants.push(runMutant(spec.name, mu.name, mu.conjunct, spec.fn, base, mu.mutate(spec.input)));
    }
  }
  return { gates, mutants };
};

/* ========================================================================== */
/* §16 THE ARTIFACT                                                            */
/* ========================================================================== */
/** ⭐ #288's CANON, MACHINE-APPLIED: every face carries |Δ| ÷ its own half-width. */
const ratioToHalfWidth = (delta: number, ci: [number, number]): number => {
  const hw = (ci[1] - ci[0]) / 2;
  return hw === 0 || !Number.isFinite(hw) ? Number.NaN : Math.abs(delta) / hw;
};
const pubFace = (f: FaceRow): Record<string, unknown> => ({
  face: f.face, unit: f.unit, what: f.what,
  armStructural: FACES[f.face].armStructural === true,
  arms: Object.fromEntries(Object.entries(f.arms).map(([k, v]) => [k, {
    point: v.den === 0 ? 'UNMEASURED' : round(v.point), num: v.num, den: v.den,
    ci95: v.den === 0 ? 'UNMEASURED' : v.ci95.map((x) => round(x)),
  }])),
  contrastVsV7: Object.fromEntries(DOSE_ARMS.map((a) => {
    const c = f.contrasts[a];
    const resolved = (c.ci95[0] > 0 && c.ci95[1] > 0) || (c.ci95[0] < 0 && c.ci95[1] < 0);
    const r = ratioToHalfWidth(c.delta, c.ci95);
    return [a, {
      delta: round(c.delta), ci95: c.ci95.map((x: number) => round(x)),
      relative: round(c.relative),
      resolved,
      absDeltaOverHalfWidth: round(r, 4),
      strength: !Number.isFinite(r) ? 'UNMEASURED'
        : r < 1 ? 'UNRESOLVED' : r < 2 ? '⚠ MARGINAL (within 2× of its half-width)' : 'RESOLVED',
    }];
  })),
});

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: '⭐⭐ PW-T1 — THE COMPOSITION EXAM (the pass-weight axis in the v7 world; H-PW.1 SCORED)',
  doc: 'docs/world-model/PW-T1-COMPOSITION-EXAM.md',
  contract: 'docs/world-model/PW-PASSWEIGHT-CONTRACT.md §1 (H-PW.1 scored / H-PW.2 reported) '
    + '· §2 M-PW.2 the one table · M-PW.4 scope & debts; authorized by ruling #294 item 5; the '
    + 'bases are PW-C0 / PW-T0a / PW-T0b / PW-T0c and BU-C0 / BU-T1, INCLUDING every '
    + '§COMMANDER CORRECTIONS OF RECORD (#291 · #292 · #293 · #294 · #286 · #289)',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: '球能选大小之后,回传的球路活了吗?—— and is the weight actually CHOSEN at the '
      + 'grain the football happens on (real struck balls), or is one rung eating everything?',
    arms: {
      v7: 'THE BASE — `new Match({seed, teams, ...a4MatchFlags(7)})` + `armA4World(m, null, 7, '
        + 'poolT1DoseCells(L3-T1))`: the CB layer (commit physics + touch-past + the choice seat '
        + 'at the declared proneness) + the two L3 book doors at the shipped matured dose. DV, '
        + 'MT/PM and PTP stay SHUT on both arms.',
      v7pw: 'THE SLICE — THE SAME, plus the ONE door `pwWeightChooser`. No gene, no dose, and '
        + '⭐ NO `pwPowerLadder` (#294 item 3 / PW-T0c §CORRECTIONS 2: the exam runs the DEFAULT '
        + 'ladder). PW-T0c proved by DIGEST that at ladder {1} the armed world is byte-identical '
        + 'to the door-shut world, so every difference here is A RUNG.',
    },
    ladder: {
      law: 'the ENGINE\'S OWN canary ladder — never typed, never overridden',
      powers: LADDER,
      labels: RUNG_LABELS,
      referenceIndex: REFERENCE_INDEX,
      tracedTo: `${BRAIN_SRC_PATH}:${CANARY_LINE}`,
      brainLiteral: CANARY_LITERAL,
      endpointsFrom: `${CONST_SRC_PATH} PASS_POWER_MIN / PASS_POWER_MAX`,
    },
    scoredClaim: hPw1.preRegisteredRule,
    instruments: {
      optionLadder: 'BU-C0\'s ladder VERBATIM in definition (L1 POSITION on Q07\'s own ±2 m '
        + `band, EXTRACTED from ${MECH_SRC_PATH}:${FORWARD_BAND_LINE} · L2 the engine's own `
        + 'flight prediction · L3 arrivalMargin > 0 · L4 the engine\'s corridor sampler), '
        + 'GK-SPLIT at every behind-ball rung (#286.1). ⭐ ONE DECLARED ADDITION: the LATERAL '
        + 'lane carries the same four rungs (BU-C0 published it only at L4), because H-PW.1 (b) '
        + 'is scored on backward AND lateral survival.',
      strikeCamera: '⭐⭐ a `Match` subclass that reads state BEFORE delegating to `super` at '
        + `${MATCH_SRC_PATH}:${PW_CONSUME_LINE}'s own consumption path: the INTENDED weight (the `
        + 'deposit, or the caller\'s literal), the passer\'s orientation, the EXECUTED power '
        + 're-derived from a CLONE of the engine\'s rng at its pre-strike state (no draw '
        + 'consumed), the ball\'s own observed launch speed, and the engine\'s closed-form '
        + 'D∞ = v / BALL_FRICTION_K. Non-perturbation is PROVEN by `gNonPerturbing`.',
      observationLedger: '⭐ at the decision moment (the strike, or the wind-up ARM) the camera '
        + 'RE-RUNS `choosePassWeight` with the caller\'s own inputs and links it to the strike by '
        + '(mate, power) agreement, so the CHOSEN pair\'s census-grain liveness can be read. '
        + 'Unlinked rows are counted and published, never dropped.',
      flightOutcome: '⚠ PROBE-SIDE AND DECLARED: a struck ball\'s fate is the first of — the '
        + 'phase leaving `playing` (outOfPlay) · a team-mate controlling it (completed) · an '
        + 'opponent controlling it (lost) · the passer re-controlling it (retained) · another '
        + 'strike (superseded) · the whistle. The engine\'s own completion counter is published '
        + 'beside it as the cross-check, and Q06 uses the ENGINE\'S counter, not this one.',
      directionMix: 'FORWARD is R-乙 Q07 VERBATIM (the engine\'s own passesForward counter); the '
        + 'probe\'s ±2 m re-derivation only splits the engine\'s POOLED complement.',
      spellTerminals: 'the #173 / R-乙 Q01 segmentation VERBATIM.',
    },
    preRegisteredReporting: [
      '⭐ PRE-REGISTERED AND STANDING (#291.3): a FORWARD-SHIFTED usage mix is the PREDICTED '
        + 'outcome of arming this axis — its appearance is NOT a failure.',
      '⭐ PRE-REGISTERED AND STANDING (#292.4 (d)): the chosen region may be THIN.',
      '⭐ H-PW.2 FACES ARE REPORTED AND NEVER GATED: no gate in this probe reads a football face.',
      '⚠ TERMINALS ARE L3-VETO ENTANGLED AT THE LEVEL (BU-C0 §CORRECTIONS 3): both arms carry '
        + 'the veto, so the CONTRASTS are entanglement-free by construction and the LEVELS are '
        + 'not; lossToOpponentShare is the honest cross-arm aggregate.',
      '⚠ MOVING DENOMINATORS DISCLOSED PER FACE (PW-C0 §CORRECTIONS 2): every corridor-survival '
        + 'face is conditioned on the L3 race-winner set, which is power-dependent; the '
        + 'END-TO-END faces (L4/L1) are the denominator-stable ones and are published beside '
        + 'them.',
    ],
    populations: {
      reception: 'every tick at which the ball\'s owner CHANGES while phase === "playing".',
      pressedReception: `a reception whose receiver has an opponent within ${PRESSURE_R} m `
        + `(TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}).`,
      pressedCarrierMoment: `a NON-reception carrier tick sampled every ${CARRIER_SAMPLE_TICKS} `
        + `ticks (${round(CARRIER_SAMPLE_TICKS * DT, 4)} sim-s) at which the carrier is pressed.`,
      strike: 'a ground pass that actually left the boot through `performPass` (the engine\'s '
        + 'own guard: the passer owns the ball and his kick cooldown is clear), PTP-lead-free.',
      pressedStrike: `a strike whose PASSER has an opponent within ${PRESSURE_R} m.`,
    },
    clock: {
      matchDurationSimSeconds: MATCH_DURATION,
      displayMinutes: DISPLAY_MINUTES,
      displayMinutesTracedTo: `${MATCH_SRC_PATH}:${DISPLAY_MINUTES_LINE} (Match.minute())`,
      displaySecondsPerSimSecond: DISPLAY_S_PER_SIM_S,
      law: 'shares are dimensionless and read the same on both axes; per-MATCH count rows are '
        + 'convention B (our match IS the 90′) and their convention-A form is '
        + '× displaySecondsPerSimSecond.',
      applied: 'APPLIED, not nominal: the duration is never overridden and gClock asserts it.',
    },
    estimator: `PAIRED cluster bootstrap by match seed, ${BOOTSTRAP} resamples, percentile 95 % `
      + 'CI, ratio of sums; ONE resample-index matrix drawn once and shared by every face and '
      + 'BOTH arms, so the contrast is the same resampled worlds.',
    sizing: `N = ${N_FROZEN} paired seeds. ⚠ a face inside 2× of its half-width is MARGINAL and `
      + 'is NEVER rounded up (the `strength` field applies the rule by machine).',
    terminalClasses: TERMINALS,
    pressureRadiusM: PRESSURE_R,
    forwardBandM: FORWARD_BAND_M,
    histogramTopBucket: HIST_MAX,
  },
  run: {
    N: N_RUN, base: BASE_RUN, arms: ARMS.length, walks: armTotal,
    perturbationControls: perturbCheck.total,
    doorsMatrixWalks: LIFECYCLE_SEEDS.length * ALL_DOOR_CELLS.length,
    receptions: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.receptions))])),
    pressedReceptions: Object.fromEntries(ARMS.map((a) => [a,
      sum(rowsOf(a).map((r) => r.receptionsPressed))])),
    strikes: Object.fromEntries(ARMS.map((a) => [a, strikeCensusByArm[a].strikes])),
    openSpells: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.openSpells))])),
    attempts: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.attempts))])),
    oracleCalls: oracleReceipt.calls,
  },
  /* ---- ⭐⭐ THE ORDER OF PROOF'S FIRST STEP, PUBLISHED IN FULL ---- */
  armingLifecycle: {
    debt: 'M-BU.2 / #269.2(iv) — the clearTouchPastArming staleness class, PROVEN AT THE NEW '
      + 'CB+L3+PW COMPOSITION (#287.3 discharged CB+L3+DV; #289 discharged CB+L3+MT), TOGETHER '
      + 'WITH the PW seam\'s own deposit slot, which is the same idiom and the same hazard.',
    law: 'A DICHOTOMY plus the PW clause: (a) in every cell where an aim CAN fire, no arming '
      + 'survives its own tick; (b) in every cell where armings persist (choice-armed without '
      + 'capability — the S∧¬T EXHIBIT), ZERO knocks fire; (c) in EVERY cell, no chosen weight '
      + 'is ever alive at a step boundary, and with the PW door shut the seam\'s whole ledger '
      + 'is all-zero.',
    scope: '⚠ o2Look, ekHoldVeto, PTP, DV and MT are NOT armed here, so the discharge is for '
      + 'CB+L3+PW ONLY; their own compositions remain UNDISCHARGED.',
    nonVacuity: 'the exposure is REAL: o1PassWindup and c7Windup (two early returns above the '
      + 'seat\'s arm/withdraw block) ARE armed in the v7 substrate.',
    firingHalf: lifecycleMatrix.firing,
    inertHalf: lifecycleMatrix.inert,
    pwDoorOpenHalf: lifecycleMatrix.pwOn,
    pwDoorShutHalf: lifecycleMatrix.pwOff,
    pwLedgerWithTheDoorOpen: lifecycleMatrix.pwOnLedger,
    pwLedgerWithTheDoorShut: lifecycleMatrix.pwOffLedger,
    total: lifecycleMatrix.total,
    cellsWalked: lifecycleMatrix.cells,
    firingCellWalks: lifecycleMatrix.firingCells,
    inertCellWalks: lifecycleMatrix.inertCells,
    sAndNotTCellsHoldingAnArming: lifecycleMatrix.persistingCells.length,
    measuredBattery: batteryLifecycle,
    structure: lifecycleStructure,
    ptpTimesPwRefusal: ptpDoorReceipt,
    unitNote: '⚠ the cell counts above are WALKS (cells × seeds), not distinct flag cells.',
  },
  doorsMatrix: {
    axes: 'C cbCommitPhysics · T cbTouchPast · S cbChoiceSeat(+proneness) · L l3DefenceLearn'
      + '(+dose) · V l3DefenceVeto · ⭐⭐ W pwWeightChooser (no gene, no dose, no ladder key)',
    substrate: 'a4MatchFlags(3) — CALLED, not copied',
    cells: ALL_DOOR_CELLS.length,
    seeds: LIFECYCLE_SEEDS,
    identityLaws: [
      'cbTouchPast is INERT without the choice seat (nothing can write the arming slot)',
      'l3DefenceLearn is INERT without the veto (the book fills, nothing reads it)',
      'l3DefenceVeto is INERT without the learning door (there is no book to read)',
      '⭐⭐ pwWeightChooser SHUT ⇒ the seam is structurally silent: the whole chooser ledger is '
        + 'all-zero, no weight is ever deposited, and the deposit slot is null at every step '
        + 'boundary and at the whistle (the PW analogue of a partnerless door)',
    ],
    inertnessChecked: doorsAlways.checked,
    inertnessFailures: doorsAlways.fail,
    liveness: doorsLive,
  },
  /* ---- ⭐⭐ THE SCORED CLAIM ---- */
  hPw1,
  /* ---- ⭐⭐ THE CLOSURE EQUATION (#294 item 3) ---- */
  choiceLedgerClosure: {
    equation: 'depositsNonDefault = struckAtChosenPower + windupChoiceVoided + '
      + 'depositsAbandoned + inFlightAtWhistle',
    perArm: closure,
    residueTotal: closureResidueTotal,
    verdict: closureResidueTotal === 0 ? 'CLOSES — no silent loss anywhere in the battery'
      : '⛔ STAGE-STOPPING: a silent-loss residue exists',
    inFlightDefinition: 'a non-default weight still in the deposit slot at the whistle, plus a '
      + 'live `pendingPassWindup` carrying a non-default `powerChoice` at the whistle.',
  },
  /* ---- ⭐ THE OBSERVATION LEDGER, in raw counts, per arm ---- */
  observationLedger: {
    what: '⭐ THE EMERGENCE RECEIPT (#293.2): the armed arm\'s REAL strikes, crossed by rung × '
      + 'direction × pressure, plus the share whose chosen option was alive ONLY at its rung.',
    rungLabels: RUNG_LABELS,
    directions: DIRS,
    perArm: Object.fromEntries(ARMS.map((a) => {
      const c = strikeCensusByArm[a];
      return [a, {
        strikes: c.strikes,
        strikesOnLadder: strikesOnLadder(c),
        offLadder: c.offLadder,
        chosenByThePwChooser: c.pw,
        linkedToARerunDecision: c.linked,
        unlinkedChosen: c.unlinkedPw,
        fromWindup: c.fromWindup,
        byRung: c.byRung,
        byRungDirection: Object.fromEntries(LADDER.map((p, k) => [String(p),
          Object.fromEntries(DIRS.map((d, di) => [d, c.byRungDir[k * 3 + di]]))])),
        byRungPressed: Object.fromEntries(LADDER.map((p, k) => [String(p), {
          unpressed: c.byRungPressed[k * 2], pressed: c.byRungPressed[k * 2 + 1],
        }])),
        byRungDirectionPressed: Object.fromEntries(LADDER.map((p, k) => [String(p),
          Object.fromEntries(DIRS.map((d, di) => [d, {
            unpressed: c.byRungDirPressed[k * 6 + di * 2],
            pressed: c.byRungDirPressed[k * 6 + di * 2 + 1],
          }]))])),
        outcomesByRung: Object.fromEntries(LADDER.map((p, k) => [String(p), {
          completed: c.completedByRung[k], lost: c.lostByRung[k], outOfPlay: c.outByRung[k],
          retained: c.retainedByRung[k], other: c.otherByRung[k],
        }])),
        censusGrainAdmission: {
          chosenPairLiveOnTheCensusLadder: c.liveChosen,
          chosenPairLiveOnlyAtItsOwnRung: c.liveOnlyAtItsRung,
          chosenMateAlsoLiveAtTheReferenceRung: c.liveMateAtReference,
          liveOnlyByRung: c.liveOnlyByRung,
          denominator: c.linked,
        },
        executionHonesty: Object.fromEntries(LADDER.map((p, k) => [String(p), {
          strikes: c.byRung[k],
          meanIntended: round(ratio(c.sumIntendedByRung[k], c.byRung[k])),
          meanExecuted: round(ratio(c.sumExecutedByRung[k], c.byRung[k])),
          meanObservedLaunchSpeedMetresPerSecond: round(ratio(c.sumSpeedByRung[k], c.byRung[k])),
          meanDInfinityPastReceiverMetres: round(ratio(c.sumDInfPastByRung[k], c.byRung[k])),
          rollOutEndpointOutsideThePitch: c.endpointOutByRung[k],
        }])),
        engineLedger: pwLedgerByArm[a],
      }];
    })),
    executionReceipt: {
      ...executionReceipt,
      linkShare: round(executionReceipt.linkShare),
      meanRelErrorArmed: round(executionReceipt.meanRelErrorArmed, 15),
      meanRelErrorBase: round(executionReceipt.meanRelErrorBase, 15),
      maxRelErrorArmed: round(executionReceipt.maxRelErrorArmed, 15),
      maxRelErrorBase: round(executionReceipt.maxRelErrorBase, 15),
      note: '⭐ `maxRelError*` are DIMENSIONLESS RELATIVE errors of the re-derived launch speed '
        + 'against the engine\'s own ball, not metres and not m/s.',
    },
  },
  faces: C.faces.map(pubFace),
  behindOptionHistogram: Object.fromEntries(ARMS.map((a) => [a, {
    allReceptions: Array.from({ length: HIST_MAX + 1 },
      (_, k) => sum(rowsOf(a).map((r) => r.behindHist[k]))),
    pressedReceptions: Array.from({ length: HIST_MAX + 1 },
      (_, k) => sum(rowsOf(a).map((r) => r.behindHistPressed[k]))),
    denominator: sum(rowsOf(a).map((r) => r.receptions)),
    pressedDenominator: sum(rowsOf(a).map((r) => r.receptionsPressed)),
  }])),
  gkSplitLadder: Object.fromEntries(ARMS.map((a) => [a, {
    L1: sum(rowsOf(a).map((r) => r.atReceptions.behind)),
    L1gk: sum(rowsOf(a).map((r) => r.atReceptions.behindGk)),
    L2: sum(rowsOf(a).map((r) => r.atReceptions.behindFlight)),
    L2gk: sum(rowsOf(a).map((r) => r.atReceptions.behindFlightGk)),
    L3: sum(rowsOf(a).map((r) => r.atReceptions.behindRace)),
    L3gk: sum(rowsOf(a).map((r) => r.atReceptions.behindRaceGk)),
    L4: sum(rowsOf(a).map((r) => r.atReceptions.behindUncut)),
    L4gk: sum(rowsOf(a).map((r) => r.atReceptions.behindUncutGk)),
    lateralL1: sum(rowsOf(a).map((r) => r.atReceptions.lateral)),
    lateralL3: sum(rowsOf(a).map((r) => r.atReceptions.lateralRace)),
    lateralL4: sum(rowsOf(a).map((r) => r.atReceptions.lateralUncut)),
    receptions: sum(rowsOf(a).map((r) => r.receptions)),
  }])),
  terminalCensus: Object.fromEntries(ARMS.map((a) => [a, {
    openPlay: Object.fromEntries(TERMINALS.map((t) => [t,
      sum(rowsOf(a).map((r) => r.terminalOpen[t]))])),
    openDenominator: sum(rowsOf(a).map((r) => r.openSpells)),
    allDenominator: sum(rowsOf(a).map((r) => r.spells)),
    entanglement: '⚠ L3-VETO ENTANGLED AT THE LEVEL (BU-C0 §CORRECTIONS 3); the CONTRAST is '
      + 'entanglement-free because both arms carry the veto.',
  }])),
  oracleReceipt: {
    ...oracleReceipt,
    nullShare: round(oracleReceipt.nullShare),
    uncutGivenRace: round(oracleReceipt.uncutGivenRace),
  },
  q07Receipt: {
    ...q07Receipt,
    agreementShare: round(q07Receipt.agreementShare),
    attributionShare: round(q07Receipt.attributionShare),
    completionAttributionShare: round(q07Receipt.completionAttributionShare),
  },
  spellReceipt,
  histReceipt,
  strikeBooks,
  perturbCheck,
  doses: {
    l3: {
      source: `${T1_PATH} · poolT1DoseCells (the SHIPPED world-7 entry's own pooling)`,
      declaredFileBytesSha256: T1_FILE_BYTES_SHA,
      measuredFileBytesSha256: T1_BYTES_SHA,
      fileBytes: T1_BYTE_LENGTH,
      artifactResultSha256: L3_T1_SHA,
      cells: L3_DOSE, labels: L3_DOSE_LABELS,
    },
    cbProneness: CB_WORLD_DOSE,
    houseLaw: '#270 — no dose anywhere in info.genome, asserted per walk in gArms.',
  },
  perSeedCells: Object.fromEntries(ARMS.map((a) => [a, rowsOf(a).map(cellOf)])),
  seeds: { claimed: CLAIMED, block: [12_495_000, 12_495_999], consumedLedger: CONSUMED },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 112_800, step: STATS_STEP },
  faceRederivationInMemoryCrossCheck: faceRederivation,
  faceRederivationFromTheSerializedArtifact: facesFromDisk,
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ H-PW.1 IS SCORED HERE, ON A PRE-REGISTERED RULE — but NO GATE READS IT. The gates prove '
      + 'the instrument; the score is a reading of the football.',
    'H-PW.2 faces are REPORTED, never gated (contract §1).',
    'ZERO src edits: this stage is instrument-only, and `xSrcUntouched` proves it in the '
      + '#286.1-corrected form.',
    '⚠ THIS IS NOT A SHIP DECISION. The entry rung is PW-T2\'s and the play-test is the USER\'S '
      + 'gate (回传能活下来了吗,组织进攻看得出来了吗).',
    '⚠ The oracle faces answer "could the engine\'s own machinery get the ball there" — '
      + 'capability, never choice, never perception.',
    '⚠ The strike camera measures GROUND PASSES through `performPass`; lofted balls, crosses, '
      + 'through-balls, keeper throws and PTP-led passes are NOT in the strike population.',
    '⚠ Restart takers (`mustKick`) are outside the chooser\'s own scope (PW-T0b §CORRECTIONS 8), '
      + 'so their strikes appear in the camera at the reference rung and are not PW choices.',
    '⚠ The flight-outcome classes are PROBE-SIDE (declared above); Q06 completion uses the '
      + 'ENGINE\'S own counter.',
  ],
});

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
    note: 'UNHASHED (#266.3(a) / #289.1): head, timestamps, paths and all machine timings live '
      + 'here BY NAME so resultSha256 re-derives at any commit or path.',
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/pw-t1-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      generatedAt: 'ANOTHER-INVOCATION', head: 'ANOTHER-HEAD',
    },
  }, null, 1)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest,
    reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

let { gates, mutants } = runRegistry();
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
/** ⭐⭐ #287.1: NOW read the artifact back OFF DISK and re-derive every face from it. */
rederiveFacesFromDisk(OUT_PATH);
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'receiptsMs', 'head'];
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
envelopeInput.forbidden = FORBIDDEN_BODY_KEYS
  .filter((k) => canonical(buildBody(gates, mutants)).includes(`"${k}"`));
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [pw-t1] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pw-t1] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
const face = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const show = (k: string): string => {
  const f = face(k);
  const c = f.contrasts.v7pw;
  const res = (c.ci95[0] > 0 && c.ci95[1] > 0) || (c.ci95[0] < 0 && c.ci95[1] < 0);
  const r = ratioToHalfWidth(c.delta, c.ci95);
  return `v7 ${f.arms.v7.point.toFixed(4)} → v7pw ${f.arms.v7pw.point.toFixed(4)} (Δ`
    + `${c.delta >= 0 ? '+' : ''}${c.delta.toFixed(4)} [${c.ci95[0].toFixed(4)}, `
    + `${c.ci95[1].toFixed(4)}] |Δ|/hw ${r.toFixed(2)}${res ? ' ⭐RESOLVED' : ''})`;
};
banner(`  [pw-t1] ⭐⭐ H-PW.1 = ${hPw1.verdict} — (a) ${hPw1.a.verdict} `
  + `[${hPw1.a.shares.map((s) => (s * 100).toFixed(1)).join(' / ')} %] · (b) ${hPw1.b.verdict}`);
banner(`  [pw-t1] ⭐⭐ corridor survival (outfield backward) — ${show('outfieldCorridorSurvivalRate')}`);
banner(`  [pw-t1] ⭐⭐ end-to-end (denominator-stable)      — ${show('outfieldEndToEndConversion')}`);
banner(`  [pw-t1] ⭐ lateral corridor survival             — ${show('lateralCorridorSurvivalRate')}`);
banner(`  [pw-t1] behind-ball options / reception          — ${show('behindBallOptionsPerReception')}`);
banner(`  [pw-t1] zero-option share                        — ${show('shareReceptionsWithNoBehindOption')}`);
banner(`  [pw-t1] circulation completions                  — ${show('circulationShareOfCompletions')}`);
banner(`  [pw-t1] forward share of attempts                — ${show('forwardShareOfAttempts')}`);
banner(`  [pw-t1] completion rate (Q06)                    — ${show('passCompletionRate')}`);
banner(`  [pw-t1] loss-to-opponent share                   — ${show('lossToOpponentShare')}`);
banner(`  [pw-t1] Q01 spell mean (sim-s)                   — ${show('spellMeanSeconds')}`);
banner(`  [pw-t1] goals / match                            — ${show('goalsPerMatch')}`);
banner(`  [pw-t1] ⭐ closure: ${ARMS.map((a) => `${a} ${closure[a].depositsNonDefault} = `
  + `${closure[a].struckAtChosenPower}+${closure[a].windupChoiceVoided}+`
  + `${closure[a].depositsAbandoned}+${closure[a].inFlightAtWhistle} `
  + `(residue ${closure[a].silentLossResidue})`).join(' · ')}`);
banner(`  [pw-t1] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
if (closureResidueTotal !== 0) {
  banner('  [pw-t1] ⛔⛔ STAGE-STOPPING — THE CHOICE LEDGER DID NOT CLOSE (#294 item 3). '
    + `Silent-loss residue: ${closureResidueTotal}. The artifact is written; the stage is BLOCKED.`);
  process.exit(5);
}
process.exit(allPass ? 0 : 1);
