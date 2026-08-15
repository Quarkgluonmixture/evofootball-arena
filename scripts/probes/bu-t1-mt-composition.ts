/**
 * ⭐⭐ BU-T1 — THE MT KEEP/HOLD SEAM IN THE v7 COMPOSITION
 * (docs/world-model/BU-T1-MT-COMPOSITION.md).
 *
 * Authorized by ruling #288.7 for EXACTLY this stage — the BUILD-UP arc's LAST assembly
 * slice: arms v7 (base) vs v7+MT (slice), SAME seeds, paired. DV STAYS UNARMED (it nulled,
 * #287.2; the derived-calibration fix was STRUCK, #288.2).
 *
 * ⭐ WHAT "MT KEEP/HOLD" IS, STATED HONESTLY BEFORE ANYTHING IS MEASURED. #213.3(丙) reads
 * "the MT worlds' KEEP/HOLD VERDICT" — that is the still-open USER decision on whether to
 * KEEP the banked tuck-in worlds, NOT an event class. MT's own docs name NO keep/hold event:
 * the seam is 松盯内收 — an ACCESS-TIME MARK SAG (MT-T0 §SEAM) coupled with PM's defensive
 * lane convergence (MT-LADDER §2: "each dosed arm throws ALL switches of BOTH seams"). It is
 * a CAPABILITY seam with NO learned books. Its OWN event grain is therefore the SAG CENSUS
 * (MT-LADDER §RESULT's `sagCensus`), which this probe re-takes with the engine's own
 * `markSagMetres` × `markSagWeight` — the seam's own line, verbatim.
 *
 * ⭐ THE ARMING PATH — what MT's OWN banked docs prescribe (MT-LADDER §2 / §ENTRY, a4World.ts
 *   `MT_WORLD_FLAGS` + `MT_WORLD_DOSE`):
 *     · construction flags `pmLaneConvergence` + `mtMarkSag` (both born OFF);
 *     · the genes `defLaneConvergence` and `markSag`, EQUAL, at ONE dose, on BOTH teams;
 *     · the dose = ⭐ THE RULED KNEE 0.2 (MT-LADDER §RESULT / #211.1's NONE_ABOVE_FLOOR
 *       branch) — read at run time from the COMMITTED mt-ladder artifact's own
 *       `results.knee.kneeDose` AND from `MT_WORLD_DOSE[4]`, never typed;
 *     · ⚠ NO evolution opt-in is armed (a fixed armed world mutates nothing — MT-LADDER
 *       §ENTRY's own reading, #165.2.ii).
 *
 * ⚠⚠ ONE DECLARED DEVIATION FROM MT'S BANKED IDIOM, AND HOUSE LAW #270 IS WHY. `setMtDose`
 * (a4World.ts) writes the two genes onto ALL THREE genome views INCLUDING `info.genome` — the
 * pre-#270 A4/MT idiom. Ruling #270.2 ratified the OPPOSITE as the better form: the dose is
 * NOT written to `info.genome` (it would persist a dormant gene into the save and feed
 * crossover) and the de-aliasing form (`setCbProneness`'s: replace `baseGenome` with a copy,
 * point `effGenome` at it) is used instead. THIS PROBE THEREFORE ARMS THE MT GENES THROUGH
 * THE #270 DE-ALIASING FORM, on MATCH-LOCAL views only. The consumers read `team.genome`
 * (=== `effGenome`, Team.ts:227), so the seam receives the identical dose; `gArms` asserts
 * BOTH the dose on the effective view AND that `info.genome` stays clean, and `gDoors`
 * proves the two doors genuinely move the world at this dose (a dead door would end the
 * round before the football).
 *
 * ORDER OF PROOF (binding, #288.7):
 *   1. ⭐⭐ FIRST — the M-BU.2 lifecycle/doors proof at the CB+L3+MT composition: the FULL
 *      2^7 power set of this composition's doors × seeds, the byte-inertness of every door
 *      without its partner (including MT-T0's own G-BORN law: the flag with the gene ABSENT
 *      is byte-identical to the flag OFF), and the CB arming-lifecycle receipts riding along.
 *      #287.3 discharged CB+L3+DV; THIS COMPOSITION IS NEW. A defect ⇒ exit 4, nothing written.
 *   2. DORMANCY: flags off ⇒ `src/**` byte-identity, a HARD gate (`xSrcUntouched`, the
 *      #286.1-corrected form: `git diff --stat HEAD -- src` AND `git status --porcelain -- src`).
 *   3. The freeze commit, then the battery. The battery never changes the design.
 *
 * ⭐ #283.2(iv): every match is constructed DIRECTLY with its `matchFlags` and the arming is
 *    ASSERTED LIVE on the very match the walk measures (`League.toJSON` omits `matchFlags`).
 * ⭐ #287.1 (the gFaces canon): the re-derivation gate PARSES THE SERIALIZED ARTIFACT off
 *    disk and re-derives every published face from the stored cells.
 * ⭐⭐ NOTHING HERE IS SCORED. H-BU.1 is scored at ARC EXIT (#286.3's amended seat); every
 *    football face below is REPORTED and no gate reads one.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BUT1_MODE (smoke|full, REQUIRED) · BUT1_N · BUT1_OUT.
 *   ANY other `BUT1_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: BUT1_MODE=full npx tsx scripts/probes/bu-t1-mt-composition.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal ·
 *       4 = the arming-lifecycle class BIT at this composition (STOP for adjudication).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, a4ArmedVersion, l3ArmedVersion, poolT1DoseCells,
  setCbProneness, CB_WORLD_DOSE, L3_WORLD_VERSION, L3_T1_SHA, type L3DoseCell,
  MT_WORLD_DOSE, MT_WORLD_FLAGS, mtArmedVersion,
} from '../../src/game/a4World';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import { passChoiceCandidateGids } from '../../src/ai/perceivedPassChoice';
import { markSagMetres } from '../../src/ai/actionExecutor';
import {
  markSagWeight, pmLaneConvergenceK, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['BUT1_MODE', 'BUT1_N', 'BUT1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BUT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('BU-T1 FATAL — refused env surface. '
    + `rogue BUT1_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.BUT1_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`BU-T1 FATAL — BUT1_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const N_ENV = process.env.BUT1_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.BUT1_N, 10)) : null;
const OUT_ENV = process.env.BUT1_OUT;
/** ⚠ an OVERRIDE invocation (an env knob turned) may never write a canonical repo path. */
const OVERRIDE_REASONS = [
  ...(N_ENV !== null ? ['BUT1_N'] : []),
  ...(OUT_ENV !== undefined ? ['BUT1_OUT'] : []),
];
const IS_PREFLIGHT = OVERRIDE_REASONS.length > 0;
const PREFLIGHT_REASONS = OVERRIDE_REASONS;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/bu-t1-mt-composition-smoke.json',
  full: 'docs/world-model/data/bu-t1-mt-composition.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bu-t1-override.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('BU-T1 FATAL — an OVERRIDE invocation may not write a canonical repo path '
    + `(the canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
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
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 TRACED CONSTANTS — imported, or EXTRACTED from src/** at run time (#200)  */
/* ========================================================================== */
const CONST_SRC_PATH = 'src/sim/constants.ts';
const MATCH_SRC_PATH = 'src/sim/Match.ts';
const MECH_SRC_PATH = 'src/sim/mechanics.ts';
const BRAIN_SRC_PATH = 'src/ai/PlayerBrain.ts';
const EXEC_SRC_PATH = 'src/ai/actionExecutor.ts';
const CONST_SRC = readFileSync(CONST_SRC_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_SRC_PATH, 'utf8');
const EXEC_SRC = readFileSync(EXEC_SRC_PATH, 'utf8');
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
/** ⭐ THE SAG CENSUS CADENCE — MT-LADDER's own `SAG_SAMPLE_EVERY = 15`, inherited verbatim. */
const SAG_SAMPLE_TICKS = 15;
/** the behind-ball option histogram's top bucket (k >= this is pooled into the last cell). */
const HIST_MAX = 5;

/** ⭐ THE ARMING-LIFECYCLE SITES, TRACED to `src/**` at run time (never asserted from memory). */
const ARM_SITE_LINE = lineOf(BRAIN_SRC, /match\.armTouchPast\(p, knockDir!, knockBack\);/);
const CLEAR_SITE_LINE = lineOf(BRAIN_SRC, /else match\.clearTouchPastArming\(p\);/);
const FIRE_SITE_LINE = lineOf(MATCH_SRC, /mech\.performTouchPast\(this, o, aim\);/);
const CLEAR_IMPL_LINE = lineOf(MATCH_SRC, /clearTouchPastArming\(p: Player\): void \{/);
/** ⭐ THE MT SEAM'S OWN LINE, traced — the only write of the slice (MT-T0 §SEAM). */
const MT_SEAM_LINE = lineOf(
  EXEC_SRC, /markDist \+= w \* markSagMetres\(ball\.pos, mark\.pos, p\.pos, p\.topSpeed\);/);

/* ========================================================================== */
/* §3 THE FROZEN DESIGN — seeds, stats stream, sizing                          */
/* ========================================================================== */
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const MTLAD_PATH = 'docs/world-model/data/mt-ladder.json';
/** ⭐ THE MT BANK'S DECLARED IDENTITY — the committed ladder artifact the knee was ruled on
 *  (#211.1; the `L3_T1_SHA` idiom: a file-identity guard, so the dose cannot drift). */
const MTLAD_SHA = '1716ffa3f4e7d76e18d5758472e980c5143423fe01b20184a5cba726f451393b';
/** the MT play-test world whose dose IS the ruled knee (a4World `MT_WORLD_DOSE[4] = 0.2`). */
const MT_KNEE_WORLD = 4 as const;

const BOOTSTRAP = 2000;
const STATS_BASE = 112_200;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600, 111_800,
  112_000,
];

const BATTERY_BASE = 12_489_100;
const SMOKE_BASE = 12_489_000;
const GUARD_BASE = 12_489_020;
const GUARD_SPAN = 20;
/** ⭐ the ARMING-LIFECYCLE / DOORS-MATRIX block — its own seeds, walked BEFORE the battery. */
const LIFECYCLE_BASE = 12_489_500;
const LIFECYCLE_SEEDS_FULL = 3;
const GWORLD_SEED = 12_489_900;
const N_FROZEN = 200;
/** how many paired seeds the NON-PERTURBATION control re-walks WITHOUT the instruments. */
const PERTURB_CHECK_SEEDS = 25;

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 / O2 / MT / LADDER bands', range: [12_300_000, 12_421_999] },
  { name: 'O2-T1 · CTB · OBM · PTP · DLC bands', range: [12_422_000, 12_428_999] },
  { name: 'DV-C0 / DV-T0 / DV-T1 family', range: [12_429_000, 12_435_099] },
  { name: 'DV-T2-C0 census band (#255.4/#256)', range: [12_436_000, 12_436_999] },
  { name: 'DV-T2-T0 learning seam (#256.4/#257)', range: [12_437_000, 12_437_999] },
  { name: 'DV-T2-T1 convergence exam (#257.3/#258.4)', range: [12_438_000, 12_447_999] },
  { name: 'EK-C0 census band (#259.3/#260.4)', range: [12_448_000, 12_448_999] },
  { name: 'EK-C0b diagnostic band (#260.3/#261)', range: [12_449_000, 12_449_999] },
  { name: 'EK-T0 hold-belief seam (#261.4/#262)', range: [12_450_000, 12_450_999] },
  { name: 'EK-T1 convergence exam band (#262.4)', range: [12_451_000, 12_469_999] },
  { name: 'CB-C0 / CB-T0 / CB-T1 / CB-T2 bands (#264–#273)', range: [12_470_000, 12_479_999] },
  { name: 'L3-C0 lunge-outcome census (#277.2/#278)', range: [12_480_000, 12_480_999] },
  { name: 'L3-C0b window decomposition (#278.2/#279)', range: [12_481_000, 12_481_999] },
  { name: 'L3-T0 dormant defence-book seam (#279.4/#280)', range: [12_482_000, 12_482_999] },
  { name: 'L3-T1 convergence exam (#280.3/#281)', range: [12_483_000, 12_483_999] },
  { name: 'L3-T2 armed world read (#281.4/#282)', range: [12_484_000, 12_484_999] },
  { name: 'L3 entry rung (#282.4/#283)', range: [12_485_000, 12_485_999] },
  { name: 'BU-C0 reception-option census (#285.2/#286)', range: [12_486_000, 12_486_999] },
  { name: 'BU-T0 DV-in-v7 composition (#286.5/#287.5)', range: [12_487_000, 12_487_999] },
  { name: 'BU-T0b price separation (#287.6/#288.6)', range: [12_488_000, 12_488_999] },
];

/* ========================================================================== */
/* §4 THE DOSES — both from COMMITTED artifacts, neither ever typed             */
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
const T1_FILE = readJson(T1_PATH);
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(T1_FILE);

/**
 * ⭐⭐ THE MT DOSE — THE RULED KNEE, READ OUT OF THE COMMITTED LADDER, NEVER TYPED.
 *
 * MT is a CAPABILITY seam with no books, so there is no maturation and no truth-dosing
 * question: the dose is a NUMBER the commander ruled (#211.1), and its provenance is the
 * committed `mt-ladder.json` artifact's own `results.knee.kneeDose`. `a4World`'s
 * `MT_WORLD_DOSE[4]` is the SHIPPED entry's copy of the same number; `gDose` asserts the two
 * AGREE, so a drift on either side fails the gate rather than quietly re-dosing the stage.
 *
 * ⚠ OF RECORD, from the artifact's own words: the knee is "an EXHIBIT DOSE for the user's
 * play-test verdict … NOT a ship decision", reached through the NONE_ABOVE_FLOOR fallback
 * branch (no dose qualified). This stage arms the exhibit dose; it does not ship it.
 */
const MTLAD_FILE = readJson(MTLAD_PATH);
const MT_KNEE_FROM_ARTIFACT = Number(((MTLAD_FILE as {
  results?: { knee?: { kneeDose?: number } };
}).results?.knee?.kneeDose) ?? Number.NaN);
const MT_KNEE_BRANCH = String(((MTLAD_FILE as {
  results?: { knee?: { branch?: string } };
}).results?.knee?.branch) ?? '');
const MT_DOSE = MT_WORLD_DOSE[MT_KNEE_WORLD];

/**
 * ⭐⭐ THE #270-COMPLIANT MT GENE WRITE (the declared deviation from `setMtDose`, header §).
 * MATCH-LOCAL views only: `baseGenome` is replaced by a COPY carrying both genes and
 * `effGenome` points at it — `setCbProneness`'s own form. Mentality rebuilds spread from
 * `baseGenome`, so the dose survives every in-match rebuild; `info.genome` is never touched.
 */
const setMtDoseLocal = (match: Match, side: Side, dose: number): void => {
  const t = match.teams[side];
  const view = {
    ...t.baseGenome, defLaneConvergence: dose, markSag: dose,
  } as TacticalGenome;
  t.baseGenome = view;
  t.effGenome = view;
};

/* ========================================================================== */
/* §5 THE ARMS — constructed DIRECTLY with matchFlags (#283.2(iv))              */
/* ========================================================================== */
/**
 * | arm     | construction                                                             |
 * |---------|--------------------------------------------------------------------------|
 * | `v7`    | `new Match({seed, teams, ...a4MatchFlags(7)})` + `armA4World(m,null,7,L3)`  |
 * | `v7mt`  | THE SAME, plus `pmLaneConvergence` + `mtMarkSag` and both genes at the knee |
 *
 * ⚠ THE SUBSTRATE IS A SUPERSET OF MT'S OWN, DECLARED: `MT_WORLD_FLAGS`'s percept pair
 * (`edsPerceivedDefence` + `edsPerceivedChoice`) IS inside `a4MatchFlags(7)`, but v7 also
 * carries `edsValueAxis`, `c5Hold`, `c6Carry`, `c7Windup`, `o1PassWindup` and the CB + L3
 * doors. That is what a COMPOSITION slice is: the MT ladder measured this seam on the bare
 * percept substrate, and this stage measures it in the polished world. The two are NOT
 * interchangeable and no MT-LADDER number is re-quoted as this stage's.
 */
const ARMS = ['v7', 'v7mt'] as const;
type ArmKind = (typeof ARMS)[number];
const matchOf = (seed: number, arm: ArmKind): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  const m = new Match({
    seed, teamA, teamB, ...a4MatchFlags(L3_WORLD_VERSION),
    ...(arm === 'v7mt' ? { pmLaneConvergence: true, mtMarkSag: true } : {}),
  });
  armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
  if (arm === 'v7mt') for (const s of [0, 1] as const) setMtDoseLocal(m, s, MT_DOSE);
  return m;
};

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
    pmLaneConvergence: boolean; mtMarkSag: boolean;
    forcedTouchPast: unknown;
  };
  const wantMt = arm === 'v7mt';
  const l3Dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => L3_DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  const geneOk = ([0, 1] as const).every((s) => {
    const g = m.teams[s].effGenome as TacticalGenome;
    return wantMt
      ? g.markSag === MT_DOSE && g.defLaneConvergence === MT_DOSE
        && markSagWeight(g) === MT_DOSE && pmLaneConvergenceK(g) > 0
      : g.markSag === undefined && g.defLaneConvergence === undefined
        && markSagWeight(g) === 0 && pmLaneConvergenceK(g) === 0;
  });
  const genomeClean = ([0, 1] as const).every((s) => {
    const g = infoGenomeOf(m, s);
    return g.markSag === undefined && g.defLaneConvergence === undefined
      && g.cbCarryProneness === undefined && g.dvLossBelief === undefined;
  });
  return {
    theArmIsTheWorldSevenOfRecord: l3ArmedVersion(m) === L3_WORLD_VERSION,
    /**
     * ⭐ A FACT OF THE SHIPPED ENTRY LAYER, ASSERTED RATHER THAN ASSUMED (and published in
     * §DOUBTS): `a4ArmedVersion` asks the MT family FIRST (a4World.ts:706, "#211.3 — a
     * different family, checked first"), so a v7+MT match REPORTS ITSELF AS WORLD 4, not 7.
     * The entry layer has no name for this composition; `l3ArmedVersion` above is the
     * world-7 identity that does hold on both arms.
     */
    theEntryLayersFamilyPrecedenceIsExactlyAsShipped:
      a4ArmedVersion(m) === (wantMt ? MT_KNEE_WORLD : L3_WORLD_VERSION),
    bothL3DoorsAreLiveInThisSim: mm.l3DefenceLearn && mm.l3DefenceVeto && mm.l3Defence !== null,
    theThreeCbDoorsAreLiveInThisSim:
      mm.cbChoiceSeat && mm.cbTouchPast && mm.cbCommitPhysics,
    theL3BooksCarryTheMaturedDose: l3Dosed,
    theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
    noDoseIsInTheFranchiseGenome: genomeClean,
    noArmingExistsAtConstruction: mm.forcedTouchPast === null,
    /** ⭐ THE DV FAMILY STAYS SHUT ON BOTH ARMS (#287.2 nulled it; #288.2 struck the fix). */
    theDvSeamIsUnarmedOnBothArms: !mm.dvLearnedMap && !mm.dvDeliveryValue && mm.dvLearn === null,
    /** ⭐⭐ THE SLICE'S OWN CONJUNCTS: the two MT doors and the two genes, or neither. */
    theTwoMtDoorsMatchThisArm: mm.pmLaneConvergence === wantMt && mm.mtMarkSag === wantMt,
    theMtGenesCarryTheRuledKneeOnTheViewTheConsumersRead: geneOk,
    theEntrysOwnArmedVersionReadAgreesWithThisArm:
      (mtArmedVersion(m) === MT_KNEE_WORLD) === wantMt,
  };
};

/* ========================================================================== */
/* §6 THE ARMING-LIFECYCLE READ (the M-BU.2 debt, at a NEW composition)         */
/* ========================================================================== */
/**
 * THE STALENESS CLASS, stated exactly (CB-T2 §COMMANDER CORRECTIONS (iv)):
 * `Match.forcedTouchPast` is a SINGLE match-scoped slot. It is WRITTEN by `armTouchPast`
 * from the ONE call site in `PlayerBrain` (the CB-T2 choice seat), WITHDRAWN by
 * `clearTouchPastArming` at that same site when the body's next decision no longer wants the
 * knock, and CONSUMED (set back to null) by the ONE fork in `Match.stepBall`. THE DEBT: a
 * world that arms OTHER seams beside it may take an EARLY RETURN above the seat's block, so
 * the withdrawal never runs and an aim survives its own tick — and a surviving aim can fire
 * into a LATER possession, i.e. STALE.
 *
 * ⭐ #287.3 discharged this at CB+L3+DV. THE COMPOSITION HERE IS NEW (CB+L3+MT), so the
 * proof is re-taken in full: the decision loop and `stepBall` both run INSIDE `Match.step`,
 * so in a clean lifecycle the slot is ALWAYS null when `step` returns. Every non-null
 * observation at a step boundary is a CARRY-OVER, measured for the three ways it could leak
 * (across a change of ball OWNER, across a change of PHASE, live at the WHISTLE) plus the two
 * structural facts (null at construction, null at full time).
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
}
const EMPTY_LIFECYCLE: Lifecycle = {
  ticks: 0, carryOvers: 0, carryOverAcrossOwnerChange: 0, carryOverAcrossPhaseChange: 0,
  maxArmingAgeTicks: 0, armedAtWhistle: 0, armedAtConstruction: 0,
  armings: 0, armingsCleared: 0, seats: 0, touchPasts: 0,
};
const addLifecycle = (a: Lifecycle, b: Lifecycle): void => {
  for (const k of Object.keys(a) as (keyof Lifecycle)[]) {
    a[k] = k === 'maxArmingAgeTicks' ? Math.max(a[k], b[k]) : a[k] + b[k];
  }
};

/* ========================================================================== */
/* §7 THE ORACLE — THE ENGINE'S OWN PASS MACHINERY (#256.2), GK-SPLIT (#286.1)  */
/* ========================================================================== */
const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const d = Math.sqrt((o.pos.x - p.pos.x) ** 2 + (o.pos.y - p.pos.y) ** 2);
    if (d < best) best = d;
  }
  return best;
};

/** ONE option census at ONE moment. ⭐ #286.1: EVERY behind-ball rung is split GK / outfield. */
interface OptionCensus {
  mates: number;
  behind: number; lateral: number; ahead: number;
  behindFlight: number; behindRace: number; behindUncut: number;
  behindGk: number; behindFlightGk: number; behindRaceGk: number; behindUncutGk: number;
  behindUncutInWindow: number;
  lateralUncut: number; aheadUncut: number;
  raceAll: number; uncutAll: number;
  oracleCalls: number; oracleNulls: number; corridorCalls: number;
  deltaSum: number; marginSumBehind: number;
}
const CENSUS_KEYS = [
  'mates', 'behind', 'lateral', 'ahead', 'behindFlight', 'behindRace', 'behindUncut',
  'behindGk', 'behindFlightGk', 'behindRaceGk', 'behindUncutGk',
  'behindUncutInWindow', 'lateralUncut', 'aheadUncut', 'raceAll', 'uncutAll',
  'oracleCalls', 'oracleNulls', 'corridorCalls', 'deltaSum', 'marginSumBehind',
] as const;
const EMPTY_CENSUS: OptionCensus = Object.fromEntries(
  CENSUS_KEYS.map((k) => [k, 0]),
) as unknown as OptionCensus;

/**
 * THE CENSUS AT ONE MOMENT — BU-C0's ladder VERBATIM in definition (commensurable with the
 * committed census and with BU-T0 / BU-T0b), with the GK split at EVERY behind-ball rung.
 * L1 POSITION (Q07's own ±2 m band, EXTRACTED from src) · L2 the engine's own flight
 * prediction · L3 `arrivalMargin > 0` · L4 the engine's corridor sampler.
 * ⭐ THE PUBLISHED "OPTION" IS L1 ∧ L2 ∧ L3 ∧ L4. A CAPABILITY census, never a choice census.
 */
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
    const isGk = mate.role === 'GK';
    if (isBehind) { out.behind += 1; if (isGk) out.behindGk += 1; }
    else if (isAhead) out.ahead += 1;
    else out.lateral += 1;
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
    if (res.affordance.arrivalMargin <= 0) continue;
    out.raceAll += 1;
    if (isBehind) {
      out.behindRace += 1;
      if (isGk) out.behindRaceGk += 1;
      out.marginSumBehind += res.affordance.arrivalMargin;
    }
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
    else out.lateralUncut += 1;
  }
  return out;
};
const addCensus = (a: OptionCensus, b: OptionCensus): void => {
  for (const k of CENSUS_KEYS) a[k] += b[k];
};

/* ========================================================================== */
/* §7b ⭐⭐ THE SEAM'S OWN EVENT GRAIN — THE SAG CENSUS                          */
/* ========================================================================== */
/**
 * ⭐ WHAT THE SEAM'S OWN DOCS NAME. MT has no "keep/hold" event (see the header): its own
 * instrument is MT-LADDER §RESULT's `sagCensus`, taken on out-of-possession markers at
 * cadence `SAG_SAMPLE_EVERY = 15` ticks — inherited verbatim here.
 *
 * ⚠ ONE DECLARED SIMPLIFICATION vs MT-LADDER's census, and it is a HARDENING: the ladder
 * compared the sagged stance against a REPLICA of the engine's base `markDist`
 * (`baseMarkDist`, a probe-side re-implementation). This probe publishes ONLY quantities the
 * ENGINE ITSELF computes on the seam's own line (`actionExecutor.ts:MT_SEAM_LINE`):
 *     sag metres  = markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed)   [the engine's fn]
 *     metres ADDED = markSagWeight(team.genome) · sag metres                [the seam's write]
 * No base-stance replica exists here, so there is no parallel oracle (#256.2) — and the
 * "tightened" count is structurally 0 because the seam ONLY ever adds (MT-T0 §SEAM), which is
 * PUBLISHED as a fact rather than gated.
 */
interface SagCensus {
  markerTicks: number;
  slackPositiveTicks: number;
  addedPositiveTicks: number;
  sumSagMetres: number;
  sumAddedMetres: number;
  maxSagMetres: number;
  maxAddedMetres: number;
  samples: number;
}
const SAG_KEYS = ['markerTicks', 'slackPositiveTicks', 'addedPositiveTicks', 'sumSagMetres',
  'sumAddedMetres', 'maxSagMetres', 'maxAddedMetres', 'samples'] as const;
const EMPTY_SAG: SagCensus = Object.fromEntries(
  SAG_KEYS.map((k) => [k, 0]),
) as unknown as SagCensus;
const addSag = (a: SagCensus, b: SagCensus): void => {
  for (const k of SAG_KEYS) {
    a[k] = (k === 'maxSagMetres' || k === 'maxAddedMetres') ? Math.max(a[k], b[k]) : a[k] + b[k];
  }
};
/** ONE sag observation on ONE out-of-possession marker (the engine's own two functions). */
const sagObserve = (acc: SagCensus, m: Match, t: Team, p: Player, markIdx: number): void => {
  const mark = m.teams[(1 - t.side) as Side].players[markIdx];
  if (mark === undefined || mark.sentOff) return;
  const sag = markSagMetres(m.ball.pos, mark.pos, p.pos, p.topSpeed);
  const added = markSagWeight(t.genome as TacticalGenome) * sag;
  acc.markerTicks += 1;
  acc.sumSagMetres += sag;
  acc.sumAddedMetres += added;
  if (sag > 0) acc.slackPositiveTicks += 1;
  if (added > 0) acc.addedPositiveTicks += 1;
  if (sag > acc.maxSagMetres) acc.maxSagMetres = sag;
  if (added > acc.maxAddedMetres) acc.maxAddedMetres = added;
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
  sag: SagCensus;
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
 * — the NON-PERTURBATION control (`gNonPerturbing`). The LIFECYCLE instrument is a pure read
 * of `Match` state at step boundaries and rides BOTH shapes (it cannot perturb anything).
 */
const walk = (seed: number, arm: ArmKind, measure = true): Row => {
  const m = matchOf(seed, arm);
  const armOk = Object.values(armConjuncts(m, arm)).every(Boolean);
  const mm = m as unknown as {
    forcedTouchPast: { gid: number; dir: { x: number; y: number } } | null;
    cbChoiceLedger: { armings: number; armingsCleared: number; seats: number };
    cbLedger?: { touchPasts?: number };
    possessionSide: Side | null;
  };

  const life: Lifecycle = { ...EMPTY_LIFECYCLE };
  life.armedAtConstruction = mm.forcedTouchPast === null ? 0 : 1;

  const row: Row = {
    seed, signature: '', armOk, lifecycle: life, sag: { ...EMPTY_SAG },
    receptions: 0, receptionsPressed: 0, receptionsOpenPlay: 0,
    atReceptions: { ...EMPTY_CENSUS },
    atPressedReceptions: { ...EMPTY_CENSUS },
    carrierSamples: 0, carrierSamplesPressed: 0,
    atPressedCarrier: { ...EMPTY_CENSUS },
    behindHist: new Array<number>(HIST_MAX + 1).fill(0),
    behindHistPressed: new Array<number>(HIST_MAX + 1).fill(0),
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

    /* --- ⭐⭐ THE ARMING-LIFECYCLE OBSERVATION, at the step boundary --- */
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
    }

    /* --- ⭐ THE SEAM'S OWN EVENT GRAIN: the SAG CENSUS at MT-LADDER's own cadence --- */
    if (measure && tick % SAG_SAMPLE_TICKS === 0 && m.phase === 'playing') {
      row.sag.samples += 1;
      for (const t of m.teams) {
        if (mm.possessionSide === t.side) continue; // the seam is out-of-possession only
        for (const p of t.players) {
          if (p.sentOff || p.action.type !== 'MarkOpponent') continue;
          const mi = p.action.targetIdx;
          if (mi === undefined) continue;
          sagObserve(row.sag, m, t as Team, p, mi);
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
  life.armedAtWhistle = mm.forcedTouchPast === null ? 0 : 1;
  life.armings = mm.cbChoiceLedger.armings;
  life.armingsCleared = mm.cbChoiceLedger.armingsCleared;
  life.seats = mm.cbChoiceLedger.seats;
  life.touchPasts = Number(mm.cbLedger?.touchPasts ?? 0);

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
/* §9 ⭐⭐ THE DOORS MATRIX AT THE CB+L3+MT COMPOSITION — 128 CELLS, FIRST       */
/* ========================================================================== */
/**
 * THE COMPOSITION'S SEVEN DOORS, enumerated EXHAUSTIVELY (2^7 = 128 cells) on the v7
 * SUBSTRATE (`a4MatchFlags(3)` — CALLED, not copied, exactly BU-T0's line), so every pairwise
 * flag interaction appears in the matrix and so does every higher-order one:
 *
 *   C  cbCommitPhysics      T  cbTouchPast         S  cbChoiceSeat (+ the proneness dose)
 *   L  l3DefenceLearn (+ the matured L3 dose)      V  l3DefenceVeto
 *   ⭐ P  pmLaneConvergence (+ `defLaneConvergence` at the ruled knee)
 *   ⭐ M  mtMarkSag         (+ `markSag` at the ruled knee)
 *
 * ⚠ FOUR AXES CARRY THEIR OWN DOSE, DECLARED: `S` without a proneness cannot form a seat,
 * `L` without a dosed book has nothing to read, and `P`/`M` without their genes are the
 * seam's own BORN-ABSENT no-op. Each is therefore "door + its banked dose", exactly as the
 * shipped entries compose them.
 *
 * ⭐⭐ MT'S OWN IDENTITY LAW GETS ITS OWN WALKS. MT-T0's G-BORN gate says: ARMED with the gene
 * ABSENT is byte-identical to OFF — "the arms differ in CODE PATH", the branch is entered and
 * the weight evaluates to 0. That is the MT/PM analogue of a partnerless door, and it is
 * proven here on EVERY cell of the matrix by walking the flag-only world and comparing
 * signatures.
 */
interface DoorCell {
  C: boolean; T: boolean; S: boolean; L: boolean; V: boolean; P: boolean; M: boolean;
}
const DOOR_AXES = ['C', 'T', 'S', 'L', 'V', 'P', 'M'] as const;
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
 * ONE doors-matrix walk: the signature at the whistle + the full lifecycle read. NO oracle,
 * NO sag census — a doors walk measures the WORLD, not the football.
 * `geneless` arms a flag WITHOUT its gene (MT-T0's G-BORN configuration).
 */
const doorsWalk = (
  seed: number, c: DoorCell, geneless: 'P' | 'M' | null = null,
): { sig: string; life: Lifecycle } => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  const armP = c.P || geneless === 'P';
  const armM = c.M || geneless === 'M';
  const m = new Match({
    seed, teamA, teamB, ...a4MatchFlags(3),
    ...(c.C ? { cbCommitPhysics: true } : {}),
    ...(c.T ? { cbTouchPast: true } : {}),
    ...(c.S ? { cbChoiceSeat: true } : {}),
    ...(c.L ? { l3DefenceLearn: true } : {}),
    ...(c.V ? { l3DefenceVeto: true } : {}),
    ...(armP ? { pmLaneConvergence: true } : {}),
    ...(armM ? { mtMarkSag: true } : {}),
  });
  if (c.S) for (const side of [0, 1] as const) setCbProneness(m, side, CB_WORLD_DOSE);
  if (c.P || c.M) {
    for (const side of [0, 1] as const) {
      const t = m.teams[side];
      const view = { ...t.baseGenome } as TacticalGenome;
      if (c.P) view.defLaneConvergence = MT_DOSE;
      if (c.M) view.markSag = MT_DOSE;
      t.baseGenome = view;
      t.effGenome = view;
    }
  }
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
  life.armedAtConstruction = mm.forcedTouchPast === null ? 0 : 1;
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
  }
  life.armedAtWhistle = mm.forcedTouchPast === null ? 0 : 1;
  life.armings = mm.cbChoiceLedger.armings;
  life.armingsCleared = mm.cbChoiceLedger.armingsCleared;
  life.seats = mm.cbChoiceLedger.seats;
  life.touchPasts = mm.cbLedger.touchPasts;
  return { sig: signature(m), life };
};

const LIFECYCLE_SEED_COUNT = MODE === 'smoke' ? 1 : LIFECYCLE_SEEDS_FULL;
const LIFECYCLE_SEEDS = Array.from({ length: LIFECYCLE_SEED_COUNT }, (_, i) => LIFECYCLE_BASE + i);
banner(`  [bu-t1] ⭐ ORDER OF PROOF STEP 1 — the M-BU.2 lifecycle/doors proof at CB+L3+MT: `
  + `${ALL_DOOR_CELLS.length} door cells × ${LIFECYCLE_SEEDS.length} seeds (+ the born-absent walks)…`);
const doorSig: Record<number, Record<string, string>> = {};
const doorLife: Record<number, Record<string, Lifecycle>> = {};
/** the flag-ON / gene-ABSENT signatures, per cell — MT-T0's G-BORN law at this composition. */
const genelessSig: Record<number, { P: Record<string, string>; M: Record<string, string> }> = {};
for (const seed of LIFECYCLE_SEEDS) {
  doorSig[seed] = {}; doorLife[seed] = {};
  genelessSig[seed] = { P: {}, M: {} };
  for (const c of ALL_DOOR_CELLS) {
    const r = doorsWalk(seed, c);
    doorSig[seed][doorKey(c)] = r.sig;
    doorLife[seed][doorKey(c)] = r.life;
    if (!c.P) genelessSig[seed].P[doorKey(c)] = doorsWalk(seed, c, 'P').sig;
    if (!c.M) genelessSig[seed].M[doorKey(c)] = doorsWalk(seed, c, 'M').sig;
  }
  banner(`  [bu-t1]   doors seed ${seed} — ${ALL_DOOR_CELLS.length} cells walked`);
}
const sigOf = (seed: number, c: DoorCell): string => doorSig[seed][doorKey(c)];

/**
 * ⭐⭐ THE LIFECYCLE VERDICT — the DICHOTOMY #287.3 established, re-proven at THIS composition.
 *   (a) IN EVERY CELL WHERE AN AIM CAN FIRE (`T`), no arming survives its own tick;
 *   (b) IN EVERY CELL WHERE ARMINGS PERSIST (`S ∧ ¬T`), ZERO knocks fire.
 * `S ∧ ¬T` is a configuration NO armed world constructs; it is REPORTED, never excluded.
 */
const CAN_FIRE = (c: DoorCell): boolean => c.T;
const lifecycleMatrix = (() => {
  const total: Lifecycle = { ...EMPTY_LIFECYCLE };
  const firing: Lifecycle = { ...EMPTY_LIFECYCLE };
  const inert: Lifecycle = { ...EMPTY_LIFECYCLE };
  let cells = 0; let firingCells = 0; let inertCells = 0;
  const offenders: string[] = [];
  const persistingCells: string[] = [];
  for (const seed of LIFECYCLE_SEEDS) {
    for (const c of ALL_DOOR_CELLS) {
      const l = doorLife[seed][doorKey(c)];
      cells += 1;
      addLifecycle(total, l);
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
  return { total, firing, inert, cells, firingCells, inertCells, offenders, persistingCells };
})();

/** ⭐⭐ THE STOP RULE (#288.7's order of proof): a defect here is a `src` question. */
if (lifecycleMatrix.offenders.length > 0) {
  banner('BU-T1 STOPS FOR ADJUDICATION — the arming-lifecycle class BIT at CB+L3+MT:');
  banner(`  in FIRING cells — carry-overs ${lifecycleMatrix.firing.carryOvers} · across an owner `
    + `change ${lifecycleMatrix.firing.carryOverAcrossOwnerChange} · across a phase change `
    + `${lifecycleMatrix.firing.carryOverAcrossPhaseChange} · armed at the whistle `
    + `${lifecycleMatrix.firing.armedAtWhistle} · armed at construction `
    + `${lifecycleMatrix.firing.armedAtConstruction} · longest arming life `
    + `${lifecycleMatrix.firing.maxArmingAgeTicks} ticks`);
  banner(`  in NON-FIRING cells — knocks fired ${lifecycleMatrix.inert.touchPasts}`);
  banner(`  offending cells (seed:CTSLVPM): ${lifecycleMatrix.offenders.slice(0, 40).join(' ')}`);
  banner('  A FIX IS A src CHANGE AND NEEDS ITS OWN AUTHORIZATION. Nothing was written.');
  process.exit(4);
}
banner(`  [bu-t1] ⭐ lifecycle: ${lifecycleMatrix.firingCells} FIRING cells CLEAN `
  + `(${lifecycleMatrix.firing.armings} armings, ${lifecycleMatrix.firing.touchPasts} knocks `
  + `fired, ${lifecycleMatrix.firing.carryOvers} carry-overs) · `
  + `${lifecycleMatrix.persistingCells.length} choice-without-capability cells hold an `
  + `UNCONSUMED arming (${lifecycleMatrix.inert.touchPasts} knocks fired there — the inert half)`);

/** THE IDENTITY CLAIMS — checked on EVERY cell of the matrix and EVERY seed (`always`). */
const doorsAlways = (() => {
  const fail: Record<string, string[]> = {
    touchPastDoorInertWithoutTheChoiceSeat: [],
    l3LearnDoorInertWithoutTheVeto: [],
    l3VetoDoorInertWithoutTheBook: [],
    pmDoorInertWithoutItsGene: [],
    mtDoorInertWithoutItsGene: [],
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
      /** ⭐ MT-T0's G-BORN law, at every cell: the flag with the gene ABSENT ≡ the flag OFF. */
      if (!c.P) {
        checked.pmDoorInertWithoutItsGene += 1;
        if (genelessSig[seed].P[doorKey(c)] !== sigOf(seed, c)) {
          fail.pmDoorInertWithoutItsGene.push(`${seed}:${doorKey(c)}`);
        }
      }
      if (!c.M) {
        checked.mtDoorInertWithoutItsGene += 1;
        if (genelessSig[seed].M[doorKey(c)] !== sigOf(seed, c)) {
          fail.mtDoorInertWithoutItsGene.push(`${seed}:${doorKey(c)}`);
        }
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
    thePmDoorMovesTheWorldAtTheRuledKnee: 0,
    theMtDoorMovesTheWorldAtTheRuledKnee: 0,
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
      if (!c.P && sigOf(seed, withAxis(c, 'P', true)) !== sigOf(seed, c)) {
        hits.thePmDoorMovesTheWorldAtTheRuledKnee += 1;
      }
      if (!c.M && sigOf(seed, withAxis(c, 'M', true)) !== sigOf(seed, c)) {
        hits.theMtDoorMovesTheWorldAtTheRuledKnee += 1;
      }
    }
  }
  return hits;
})();

/**
 * ⭐ THE STRUCTURAL HALF of the lifecycle proof — the call-site census, machine-read from
 * `src/**`, plus the NON-VACUITY fact: the early-return exposure is REAL in this composition
 * (`o1PassWindup` and `c7Windup` are armed in the v7 substrate, so the withdrawal genuinely
 * can be skipped). The two seams #269.2(iv) NAMED (`o2Look`, `ekHoldVeto`) are NOT armed, so
 * this stage discharges the debt for CB+L3+MT ONLY.
 */
const lifecycleStructure = (() => {
  const count = (src: string, re: RegExp): number => (src.match(re) ?? []).length;
  const probe = matchOf(GWORLD_SEED, 'v7mt');
  const pm = probe as unknown as {
    o2Look: boolean; ekHoldVeto: boolean; o1PassWindup: boolean; c7Windup: boolean;
    stationEye: unknown;
  };
  return {
    armCallSites: count(BRAIN_SRC, /match\.armTouchPast\(/g),
    clearCallSites: count(BRAIN_SRC, /match\.clearTouchPastArming\(/g),
    slotClearedInSrc: count(MATCH_SRC, /this\.forcedTouchPast = null;/g),
    fireForks: count(MATCH_SRC, /mech\.performTouchPast\(/g),
    mtSeamWriteSites: count(EXEC_SRC, /markDist \+= w \* markSagMetres\(/g),
    o2LookArmed: pm.o2Look === true,
    ekHoldVetoArmed: pm.ekHoldVeto === true,
    o1PassWindupArmed: pm.o1PassWindup === true,
    c7WindupArmed: pm.c7Windup === true,
    stationEyeNull: pm.stationEye === null,
    lines: {
      arm: `${BRAIN_SRC_PATH}:${ARM_SITE_LINE}`,
      withdraw: `${BRAIN_SRC_PATH}:${CLEAR_SITE_LINE}`,
      fire: `${MATCH_SRC_PATH}:${FIRE_SITE_LINE}`,
      clearImpl: `${MATCH_SRC_PATH}:${CLEAR_IMPL_LINE}`,
      mtSeam: `${EXEC_SRC_PATH}:${MT_SEAM_LINE}`,
    },
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
  const rows: Record<ArmKind, Row[]> = { v7: [], v7mt: [] };
  for (const arm of ARMS) {
    for (let i = 0; i < N_RUN; i++) rows[arm].push(walk(BASE_RUN + i, arm));
    banner(`  [bu-t1] ${arm} — ${N_RUN} walks done`);
  }
  return { rows };
};

/* ========================================================================== */
/* §11 THE FACES — every one a RATIO OF SUMS over the stored per-seed rows      */
/* ========================================================================== */
type Face = { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string };
const perMatch = (): number => 1;
const outfield = (
  c: OptionCensus, k: 'behind' | 'behindFlight' | 'behindRace' | 'behindUncut',
): number => {
  const gk = k === 'behind' ? c.behindGk : k === 'behindFlight' ? c.behindFlightGk
    : k === 'behindRace' ? c.behindRaceGk : c.behindUncutGk;
  return c[k] - gk;
};
const FACES: Record<string, Face> = {
  /* ---- ⭐⭐ THE SEAM'S OWN EVENT GRAIN (MT has no keep/hold event — see the header) ---- */
  sagMarkerTicksPerMatch: {
    num: (r) => r.sag.markerTicks, den: perMatch,
    unit: 'sampled marker-ticks / match',
    what: '⭐ THE SEAM\'S OWN POPULATION — out-of-possession markers with a resolvable mark, '
      + `sampled every ${SAG_SAMPLE_TICKS} ticks (MT-LADDER's own cadence)`,
  },
  sagSlackPositiveShare: {
    num: (r) => r.sag.slackPositiveTicks, den: (r) => r.sag.markerTicks,
    unit: 'share of marker-ticks',
    what: '⭐ THE SEAM\'S TRIGGER — the share of marker-ticks with POSITIVE access-time slack '
      + '(the geometry that would make a marker sag). A property of the WORLD, live on both '
      + 'arms whether or not the gene is present.',
  },
  sagMeanMetresOnSlackPositive: {
    num: (r) => r.sag.sumSagMetres, den: (r) => r.sag.slackPositiveTicks,
    unit: 'metres',
    what: 'the mean available sag (markSagMetres) on the ticks where slack is positive',
  },
  sagMeanAddedMetresPerMarkerTick: {
    num: (r) => r.sag.sumAddedMetres, den: (r) => r.sag.markerTicks,
    unit: 'metres added to markDist / marker-tick',
    what: '⭐⭐ THE SEAM\'S BITE — `markSagWeight(g) · markSagMetres(...)`, the EXACT quantity '
      + 'the seam\'s own line adds to `markDist`. Structurally 0 on the base arm (gene absent).',
  },
  sagAddedPositiveShare: {
    num: (r) => r.sag.addedPositiveTicks, den: (r) => r.sag.markerTicks,
    unit: 'share of marker-ticks',
    what: '⭐ THE USAGE FACE AT THE SEAM\'S OWN GRAIN — how often the seam actually widens a '
      + 'marker\'s stance. 0 on the base arm BY CONSTRUCTION (the born-absent gene).',
  },
  /* ---- THE SUPPLY FACE (BU-C0's headline, commensurable) ---- */
  behindBallOptionsPerReception: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.receptions,
    unit: 'options / reception',
    what: '⭐⭐ THE SUPPLY HEADLINE — behind-the-ball team-mates the ENGINE\'S OWN machinery '
      + 'calls a live option (L1 ∧ L2 ∧ L3 ∧ L4), per reception. BU-C0\'s frozen definition.',
  },
  behindBallOptionsPerPressedReception: {
    num: (r) => r.atPressedReceptions.behindUncut, den: (r) => r.receptionsPressed,
    unit: 'options / pressed reception',
    what: '⭐⭐ THE NAMED HYPOTHESIS FACE (#288.3, 持球买身后支援) — pressed-reception supply. '
      + 'Banked at 1.26× half-width (MARGINAL) in BU-T0b; this slice is its scheduled test.',
  },
  behindBallOptionsPerPressedCarrierMoment: {
    num: (r) => r.atPressedCarrier.behindUncut, den: (r) => r.carrierSamplesPressed,
    unit: 'options / pressed-carrier moment',
    what: '⭐ THE NAMED HYPOTHESIS\'S CARRIER LIMB — the same count at PRESSED-CARRIER moments '
      + '(the 持球 half of 持球买身后支援; sampled every 12 ticks)',
  },
  shareReceptionsWithNoBehindOption: {
    num: (r) => r.behindHist[0], den: (r) => r.receptions,
    unit: 'share of receptions', what: '⭐ receptions offering ZERO behind-ball option',
  },
  shareReceptionsWithTwoOrMore: {
    num: (r) => r.receptions - r.behindHist[0] - r.behindHist[1], den: (r) => r.receptions,
    unit: 'share of receptions', what: 'the #246 BAND — receptions offering 2 or more',
  },
  /* ---- ⭐ #286.1's GK-SPLIT LADDER ---- */
  ladderL1BodiesPerReception: {
    num: (r) => r.atReceptions.behind, den: (r) => r.receptions,
    unit: 'bodies / reception', what: 'L1 POSITION (GK-inclusive) — bodies behind the ball line',
  },
  ladderL1OutfieldBodiesPerReception: {
    num: (r) => outfield(r.atReceptions, 'behind'), den: (r) => r.receptions,
    unit: 'bodies / reception', what: '⭐ L1 OUTFIELD — the keeper removed',
  },
  ladderL1GkBodiesPerReception: {
    num: (r) => r.atReceptions.behindGk, den: (r) => r.receptions,
    unit: 'bodies / reception', what: 'L1 GK — how often the keeper is behind the ball at all',
  },
  ladderL2OutfieldPerReception: {
    num: (r) => outfield(r.atReceptions, 'behindFlight'), den: (r) => r.receptions,
    unit: 'bodies / reception', what: '⭐ L2 OUTFIELD — the ball actually arrives',
  },
  ladderL2GkPerReception: {
    num: (r) => r.atReceptions.behindFlightGk, den: (r) => r.receptions,
    unit: 'bodies / reception', what: 'L2 GK',
  },
  ladderL3OutfieldPerReception: {
    num: (r) => outfield(r.atReceptions, 'behindRace'), den: (r) => r.receptions,
    unit: 'options / reception', what: '⭐ L3 OUTFIELD — the receiver wins the race',
  },
  ladderL3GkPerReception: {
    num: (r) => r.atReceptions.behindRaceGk, den: (r) => r.receptions,
    unit: 'options / reception', what: 'L3 GK',
  },
  ladderL4OutfieldPerReception: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'), den: (r) => r.receptions,
    unit: 'options / reception',
    what: '⭐⭐ L4 OUTFIELD — THE OUTFIELD SUPPLY (the behind-ball option that is NOT the keeper)',
  },
  ladderL4GkPerReception: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.receptions,
    unit: 'options / reception', what: 'L4 GK — the keeper ball',
  },
  outfieldEndToEndConversion: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'),
    den: (r) => outfield(r.atReceptions, 'behind'),
    unit: 'share of outfield behind-ball bodies',
    what: '⭐⭐ THE OUTFIELD LADDER\'S END-TO-END CONVERSION — L4/L1, keeper removed (#288.3: '
      + 'UNMOVED at every DV price rung — the corridor is a property of the pitch)',
  },
  gkEndToEndConversion: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindGk,
    unit: 'share of GK behind-ball bodies', what: 'the keeper\'s own end-to-end conversion',
  },
  outfieldCorridorSurvivalRate: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'),
    den: (r) => outfield(r.atReceptions, 'behindRace'),
    unit: 'share of race-winning outfield options',
    what: '⭐⭐ THE CORRIDOR RUNG — of the OUTFIELD behind-ball balls that win the race, how '
      + 'many survive the corridor',
  },
  gkCorridorSurvivalRate: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindRaceGk,
    unit: 'share of race-winning GK options', what: 'the same rung for the keeper ball',
  },
  keeperShareOfSurvivingOptions: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindUncut,
    unit: 'share of surviving behind-ball options',
    what: '⭐ the KEEPER SHARE (BU-C0 measured 54.20 % armed; BU-T0 replicated 53.89 %)',
  },
  /* ---- the GK-inclusive ladder rows, kept for commensurability with BU-C0 ---- */
  behindBodiesTheBallCanReachPerReception: {
    num: (r) => r.atReceptions.behindFlight, den: (r) => r.receptions,
    unit: 'bodies / reception', what: 'RUNG L2 (GK-inclusive)',
  },
  behindOptionsWinningTheRacePerReception: {
    num: (r) => r.atReceptions.behindRace, den: (r) => r.receptions,
    unit: 'options / reception', what: 'RUNG L3 (GK-inclusive)',
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
  /* ---- E7 AT WORLD GRAIN ---- */
  shareOfTeammatesBehindAtReception: {
    num: (r) => r.atReceptions.behind, den: (r) => r.atReceptions.mates,
    unit: 'share of team-mates', what: 'E7 AT WORLD GRAIN — share behind the ball line',
  },
  shareOfTeammatesAheadAtReception: {
    num: (r) => r.atReceptions.ahead, den: (r) => r.atReceptions.mates,
    unit: 'share of team-mates', what: 'E7 — the share standing AHEAD',
  },
  meanTeammateDeltaAtReception: {
    num: (r) => r.atReceptions.deltaSum, den: (r) => r.atReceptions.mates,
    unit: 'metres (+ = ahead of the ball)', what: 'E7 — the mean longitudinal offset',
  },
  /* ---- ⭐ THE USAGE / DIRECTION FACES (Q07 conventions) ---- */
  forwardShareOfAttempts: {
    num: (r) => r.attemptsForwardEngine, den: (r) => r.attempts,
    unit: 'share of pass attempts', what: '⭐ Q07 VERBATIM — the ENGINE\'S OWN forward counter',
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
    what: '⭐ PASS ATTEMPTS PER MATCH (the tempo/retention face #288.7 names)',
  },
  /* ---- THE TERMINAL CENSUS ---- */
  ...Object.fromEntries(TERMINALS.map((t) => [`terminal_${t}`, {
    num: (r: Row) => r.terminalOpen[t], den: (r: Row) => r.openSpells,
    unit: 'share of open-play spells',
    what: `THE TERMINAL CENSUS — open-play spells ending in: ${t}`,
  }])) as Record<string, Face>,
  lossToOpponentShare: {
    num: (r) => r.terminalOpen.tackled + r.terminalOpen.intercepted + r.terminalOpen.badTouch
      + r.terminalOpen.lostOther,
    den: (r) => r.openSpells,
    unit: 'share of open-play spells',
    what: '⭐ TOTAL LOSS TO AN OPPONENT — the veto-entanglement-free aggregate (BU-C0 '
      + '§CORRECTIONS 3)',
  },
  /* ---- THE R-乙 RE-RUN CLAUSE (REPORTED) ---- */
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
  receptionsPerMatch: {
    num: (r) => r.receptions, den: perMatch, unit: 'receptions / match',
    what: '⭐ RECEPTIONS PER MATCH (the retention face #288.7 names)',
  },
  openSpellsPerMatch: {
    num: (r) => r.openSpells, den: perMatch, unit: 'open-play spells / match', what: 'context',
  },
  goalsPerMatch: {
    num: (r) => r.goals, den: perMatch, unit: 'goals / match',
    what: '⭐ goals/match — REPORTED (MT-LADDER measured 2.19 → 1.99 at this dose on ITS OWN '
      + 'substrate; that number is CITED there, never re-quoted as this stage\'s)',
  },
};
const FACE_KEYS = Object.keys(FACES);

/* ---- the estimator: PAIRED CLUSTER BOOTSTRAP over match seeds ---- */
let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const REF_ARM: ArmKind = 'v7';
const DOSE_ARMS: readonly ArmKind[] = ['v7mt'];
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
  seed: r.seed, sig: r.signature, armOk: r.armOk, life: r.lifecycle, sag: r.sag,
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
const coreDigest = (c: Core): string => sha(canonical({
  faces: c.faces,
  rows: Object.fromEntries(ARMS.map((a) => [a, c.battery.rows[a].map(cellOf)])),
}));

banner(`  [bu-t1] ⭐ THE BATTERY: mode=${MODE} N=${N_RUN} seeds × ${ARMS.length} arms × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [bu-t1] G-DET second run…');
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
        && quiet.enginePasses === C.battery.rows[arm][i].enginePasses) ok += 1;
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
/** ⭐ THE IDENTITY SEED — the two arms must be DIFFERENT WORLDS, or the stage is one world
 *  walked twice. Proven on a seed the battery never walks. */
const armProbes = Object.fromEntries(ARMS.map((a) => [a, matchOf(GWORLD_SEED, a)])) as
  Record<ArmKind, Match>;
const worldSeedOk = ARMS.every((a) => l3ArmedVersion(armProbes[a]) === L3_WORLD_VERSION)
  && mtArmedVersion(armProbes.v7mt) === MT_KNEE_WORLD
  && mtArmedVersion(armProbes.v7) === 0;
const armsSeparate = (() => {
  const sigs = ARMS.map((a) => {
    const m = matchOf(GWORLD_SEED, a);
    for (let i = 0; i < 600 && !m.finished; i++) m.step(DT);
    return signature(m);
  });
  return new Set(sigs).size === ARMS.length;
})();

/** ⭐ THE BATTERY'S OWN LIFECYCLE ROLL-UP — the proof re-taken on the measured population. */
const batteryLifecycle = (() => {
  const total: Lifecycle = { ...EMPTY_LIFECYCLE };
  for (const r of allRows()) addLifecycle(total, r.lifecycle);
  return total;
})();

const oracleReceipt = (() => {
  let calls = 0; let nulls = 0; let behind = 0; let race = 0; let uncut = 0; let corridor = 0;
  let gk = 0; let gkUncut = 0;
  for (const r of allRows()) {
    for (const c of [r.atReceptions, r.atPressedReceptions, r.atPressedCarrier]) {
      calls += c.oracleCalls; nulls += c.oracleNulls; corridor += c.corridorCalls;
      behind += c.behind; race += c.raceAll; uncut += c.uncutAll;
      gk += c.behindGk; gkUncut += c.behindUncutGk;
    }
  }
  return {
    calls, nulls, behind, race, uncut, corridor, gk, gkUncut,
    nullShare: calls === 0 ? Number.NaN : nulls / calls,
    uncutGivenRace: race === 0 ? Number.NaN : uncut / race,
  };
})();

/** ⭐ THE SEAM'S OWN RECEIPT — per arm, so the "0 on the base arm" is a MEASURED fact. */
const sagReceipt = Object.fromEntries(ARMS.map((a) => {
  const acc: SagCensus = { ...EMPTY_SAG };
  for (const r of rowsOf(a)) addSag(acc, r.sag);
  return [a, acc];
})) as Record<ArmKind, SagCensus>;

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
    attempts, agree,
    agreementShare: attempts === 0 ? Number.NaN : agree / attempts,
    attributionShare: enginePasses === 0 ? Number.NaN : attributed / enginePasses,
    engineCompleted, completed,
    completionAttributionShare: engineCompleted === 0 ? Number.NaN : completed / engineCompleted,
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
  return {
    spells, classified, open, openClassified,
    closes: spells === classified && open === openClassified,
  };
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

const vacuity = (() => {
  const empties: string[] = [];
  let cells = 0;
  for (const f of C.faces) {
    for (const arm of ARMS) {
      cells += 1;
      if (f.arms[arm].den === 0) empties.push(`${arm}.${f.face}`);
    }
  }
  return { cells, empties };
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
    ? [{ name: 'BU-T1 battery',
      range: [BATTERY_BASE, BATTERY_BASE + N_RUN - 1] as [number, number] }]
    : []),
  { name: 'BU-T1 smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 19] },
  { name: 'BU-T1 guard/override block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: '⭐ BU-T1 lifecycle/doors block',
    range: [LIFECYCLE_BASE, LIFECYCLE_BASE + LIFECYCLE_SEEDS_FULL - 1] },
  { name: 'BU-T1 world-identity seed', range: [GWORLD_SEED, GWORLD_SEED] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
const allSeedsInBand = ARMS.every((a) => rowsOf(a)
  .every((r) => r.seed >= BASE_RUN && r.seed <= BASE_RUN + N_RUN - 1));
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

/* ---- 3 gArms — the arming is LIVE IN THE SIM THAT WAS MEASURED (#283.2(iv)) ---- */
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
    { conjunct: 'theIdentitySeedReadsTheEntrysOwnArmedVersions', name: 'the entry\'s own armed-version read disagreed', mutate: (i) => ({ ...i, probe: false }) },
    { conjunct: 'theTwoArmsAreDifferentWorlds', name: '⭐ the slice was the base world twice', mutate: (i) => ({ ...i, separate: false }) },
    { conjunct: 'bothArmsWereWalked', name: 'an arm was dropped', mutate: (i) => ({ ...i, arms: 1 }) },
    { conjunct: 'theArmsWalkTheSameSeeds', name: 'the arms were not paired', mutate: (i) => ({ ...i, paired: false }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 4 gDose — BOTH doses come from COMMITTED artifacts, neither ever typed ---- */
const l3DoseLabels = sum(L3_DOSE.map((c) => c.lunges));
registerGate<{
  l3sha: string; l3labels: number; l3groups: number;
  mtsha: string; mtKneeArtifact: number; mtKneeEntry: number; branch: string; inRange: boolean;
  flagsMatchTheEntry: boolean;
}>({
  name: 'gDose',
  fn: (i) => ({
    theL3DoseComesFromTheCommittedExam: i.l3sha === L3_T1_SHA,
    theL3DoseIsNonEmpty: i.l3labels > 0,
    theL3DoseHasBothArrivalGroups: i.l3groups === 2,
    theMtDoseComesFromTheCommittedLadder: i.mtsha === MTLAD_SHA,
    theMtDoseIsTheLaddersOwnRuledKnee: i.mtKneeArtifact === MT_DOSE,
    theShippedEntryCarriesTheSameKnee: i.mtKneeEntry === MT_DOSE,
    theKneesOwnBranchIsTheOneOfRecord: i.branch === 'NONE_ABOVE_FLOOR',
    theMtDoseIsAWeightTheSeamCanExpress: i.inRange,
    theTwoMtDoorsAreTheEntrysOwnPair: i.flagsMatchTheEntry,
  }),
  input: {
    l3sha: String((T1_FILE as { resultSha256?: string }).resultSha256 ?? ''),
    l3labels: l3DoseLabels, l3groups: L3_DOSE.length,
    mtsha: String((MTLAD_FILE as { resultSha256?: string }).resultSha256 ?? ''),
    mtKneeArtifact: MT_KNEE_FROM_ARTIFACT, mtKneeEntry: MT_WORLD_DOSE[MT_KNEE_WORLD],
    branch: MT_KNEE_BRANCH,
    inRange: MT_DOSE > 0 && MT_DOSE <= 1,
    /** the two doors this stage opens ARE `MT_WORLD_FLAGS`'s two consumption flags. */
    flagsMatchTheEntry: MT_WORLD_FLAGS.pmLaneConvergence === true
      && MT_WORLD_FLAGS.mtMarkSag === true,
  },
  mutants: [
    { conjunct: 'theL3DoseComesFromTheCommittedExam', name: 'the L3 artifact was swapped', mutate: (i) => ({ ...i, l3sha: 'deadbeef' }) },
    { conjunct: 'theL3DoseIsNonEmpty', name: 'the L3 dose was empty', mutate: (i) => ({ ...i, l3labels: 0 }) },
    { conjunct: 'theL3DoseHasBothArrivalGroups', name: 'an L3 group went missing', mutate: (i) => ({ ...i, l3groups: 1 }) },
    { conjunct: 'theMtDoseComesFromTheCommittedLadder', name: 'the MT ladder artifact was swapped', mutate: (i) => ({ ...i, mtsha: 'deadbeef' }) },
    { conjunct: 'theMtDoseIsTheLaddersOwnRuledKnee', name: '⭐ the armed dose drifted off the ladder\'s ruled knee', mutate: (i) => ({ ...i, mtKneeArtifact: 0.8 }) },
    { conjunct: 'theShippedEntryCarriesTheSameKnee', name: 'the shipped entry and the ladder disagree', mutate: (i) => ({ ...i, mtKneeEntry: 0.8 }) },
    { conjunct: 'theKneesOwnBranchIsTheOneOfRecord', name: 'the knee came from another branch', mutate: (i) => ({ ...i, branch: 'ALL_QUALIFY' }) },
    { conjunct: 'theMtDoseIsAWeightTheSeamCanExpress', name: 'the dose left the gene\'s own range', mutate: (i) => ({ ...i, inRange: false }) },
    { conjunct: 'theTwoMtDoorsAreTheEntrysOwnPair', name: 'the doors stopped being the entry\'s pair', mutate: (i) => ({ ...i, flagsMatchTheEntry: false }) },
  ],
});

/* ---- 5 ⭐⭐ gLifecycle — THE M-BU.2 DEBT, AT THE NEW CB+L3+MT COMPOSITION ---- */
registerGate<{
  firingCarry: number; firingOwner: number; firingPhase: number; firingWhistle: number;
  firingConstruct: number; firingAge: number; firedInInertCells: number;
  batteryCarry: number; batteryArmings: number; batteryKnocks: number; batteryConstruct: number;
  seatArmed: number; arm: number; clear: number; slotClears: number; fire: number;
  o2: boolean; ek: boolean; o1: boolean; c7: boolean; eye: boolean; cells: number;
}>({
  name: 'gLifecycle',
  fn: (i) => ({
    /* (a) WHERE AN AIM CAN FIRE: no arming survives its own tick, or a possession, or a phase */
    noArmingSurvivesItsOwnTickWhereAnAimCanFire: i.firingCarry === 0,
    noArmingCrossesAPossessionWhereAnAimCanFire: i.firingOwner === 0,
    noArmingCrossesAPhaseWhereAnAimCanFire: i.firingPhase === 0,
    noArmingIsLiveAtTheWhistleWhereAnAimCanFire: i.firingWhistle === 0,
    noArmingExistsAtConstruction: i.firingConstruct === 0 && i.batteryConstruct === 0,
    theLongestArmingLifeIsZeroWhereAnAimCanFire: i.firingAge === 0,
    /* (b) WHERE ARMINGS PERSIST (S ∧ ¬T): zero knocks fire — the persistence is inert */
    noKnockEverFiresWithTheCapabilityDoorShut: i.firedInInertCells === 0,
    /* the MEASURED population re-proves it */
    theMeasuredBatteryHoldsTheSameLaw: i.batteryCarry === 0,
    everyArmingIsConsumedInItsOwnTickAcrossTheBattery: i.batteryArmings === i.batteryKnocks,
    /* NON-VACUITY: the seat DID arm, and the early-return exposure is REAL */
    theSeatActuallyArmedSomething: i.seatArmed > 0,
    theEarlyReturnExposureIsRealInThisComposition: i.o1 && i.c7,
    /* the SCOPE of the discharge, asserted rather than assumed */
    theTwoNamedSeamsAreNotArmedHere: !i.o2 && !i.ek,
    theStationEyeIsNull: i.eye,
    /* the STRUCTURAL half, machine-read from src/** */
    exactlyOneArmingWriteSite: i.arm === 1,
    exactlyOneWithdrawalCallSite: i.clear === 1,
    theSlotIsClearedInExactlyTwoPlaces: i.slotClears === 2,
    exactlyOneFiringFork: i.fire === 1,
    theMatrixIsTheFullPowerSet: i.cells === 128,
  }),
  input: {
    firingCarry: lifecycleMatrix.firing.carryOvers,
    firingOwner: lifecycleMatrix.firing.carryOverAcrossOwnerChange,
    firingPhase: lifecycleMatrix.firing.carryOverAcrossPhaseChange,
    firingWhistle: lifecycleMatrix.firing.armedAtWhistle,
    firingConstruct: lifecycleMatrix.firing.armedAtConstruction,
    firingAge: lifecycleMatrix.firing.maxArmingAgeTicks,
    firedInInertCells: lifecycleMatrix.inert.touchPasts,
    batteryCarry: batteryLifecycle.carryOvers,
    batteryArmings: batteryLifecycle.armings,
    batteryKnocks: batteryLifecycle.touchPasts,
    batteryConstruct: batteryLifecycle.armedAtConstruction,
    seatArmed: lifecycleMatrix.firing.armings + batteryLifecycle.armings,
    arm: lifecycleStructure.armCallSites,
    clear: lifecycleStructure.clearCallSites,
    slotClears: lifecycleStructure.slotClearedInSrc,
    fire: lifecycleStructure.fireForks,
    o2: lifecycleStructure.o2LookArmed, ek: lifecycleStructure.ekHoldVetoArmed,
    o1: lifecycleStructure.o1PassWindupArmed, c7: lifecycleStructure.c7WindupArmed,
    eye: lifecycleStructure.stationEyeNull,
    cells: ALL_DOOR_CELLS.length,
  },
  mutants: [
    { conjunct: 'noArmingSurvivesItsOwnTickWhereAnAimCanFire', name: 'an arming outlived its tick where an aim can fire', mutate: (i) => ({ ...i, firingCarry: 1 }) },
    { conjunct: 'noArmingCrossesAPossessionWhereAnAimCanFire', name: 'an arming crossed a possession', mutate: (i) => ({ ...i, firingOwner: 1 }) },
    { conjunct: 'noArmingCrossesAPhaseWhereAnAimCanFire', name: 'an arming crossed a restart', mutate: (i) => ({ ...i, firingPhase: 1 }) },
    { conjunct: 'noArmingIsLiveAtTheWhistleWhereAnAimCanFire', name: 'an arming was live at the whistle', mutate: (i) => ({ ...i, firingWhistle: 1 }) },
    { conjunct: 'noArmingExistsAtConstruction', name: 'a match was born armed', mutate: (i) => ({ ...i, firingConstruct: 1 }) },
    { conjunct: 'theLongestArmingLifeIsZeroWhereAnAimCanFire', name: 'an arming aged', mutate: (i) => ({ ...i, firingAge: 3 }) },
    { conjunct: 'noKnockEverFiresWithTheCapabilityDoorShut', name: '⭐ a knock fired with the capability door shut', mutate: (i) => ({ ...i, firedInInertCells: 1 }) },
    { conjunct: 'theMeasuredBatteryHoldsTheSameLaw', name: 'the battery carried an arming over', mutate: (i) => ({ ...i, batteryCarry: 1 }) },
    { conjunct: 'everyArmingIsConsumedInItsOwnTickAcrossTheBattery', name: 'armings and knocks stopped matching', mutate: (i) => ({ ...i, batteryKnocks: i.batteryKnocks - 1 }) },
    { conjunct: 'theSeatActuallyArmedSomething', name: '⭐ the proof was vacuous (nothing ever armed)', mutate: (i) => ({ ...i, seatArmed: 0 }) },
    { conjunct: 'theEarlyReturnExposureIsRealInThisComposition', name: '⭐ a zero of absence (no early return was armed)', mutate: (i) => ({ ...i, o1: false }) },
    { conjunct: 'theTwoNamedSeamsAreNotArmedHere', name: 'the discharge over-claimed its scope', mutate: (i) => ({ ...i, o2: true }) },
    { conjunct: 'theStationEyeIsNull', name: 'an eye entered the composition', mutate: (i) => ({ ...i, eye: false }) },
    { conjunct: 'exactlyOneArmingWriteSite', name: 'a second arming site appeared', mutate: (i) => ({ ...i, arm: 2 }) },
    { conjunct: 'exactlyOneWithdrawalCallSite', name: 'a second withdrawal site appeared', mutate: (i) => ({ ...i, clear: 2 }) },
    { conjunct: 'theSlotIsClearedInExactlyTwoPlaces', name: 'the slot gained a third clear', mutate: (i) => ({ ...i, slotClears: 3 }) },
    { conjunct: 'exactlyOneFiringFork', name: 'a second firing fork appeared', mutate: (i) => ({ ...i, fire: 2 }) },
    { conjunct: 'theMatrixIsTheFullPowerSet', name: 'the doors matrix was not exhaustive', mutate: (i) => ({ ...i, cells: 1 }) },
  ],
});

/* ---- 6 ⭐⭐ gDoors — the composition's IDENTITY and LIVENESS laws ---- */
registerGate<{
  inertHold: boolean; checked: number; genelessChecked: number;
  liveC: number; liveS: number; liveV: number; liveP: number; liveM: number;
  cells: number; seeds: number;
}>({
  name: 'gDoors',
  fn: (i) => ({
    everyDoorIsInertWithoutItsPartner: i.inertHold,
    theInertnessWasCheckedOnRealCells: i.checked > 0,
    theBornAbsentLawWasCheckedOnRealCells: i.genelessChecked > 0,
    theCommitPhysicsDoorIsALiveDoor: i.liveC > 0,
    theChoiceSeatIsALiveDoor: i.liveS > 0,
    theL3VetoIsALiveDoor: i.liveV > 0,
    thePmDoorIsALiveDoorAtTheRuledKnee: i.liveP > 0,
    theMtDoorIsALiveDoorAtTheRuledKnee: i.liveM > 0,
    theMatrixIsExhaustive: i.cells === 128 && i.seeds > 0,
  }),
  input: {
    inertHold: doorsAlways.allHold,
    checked: sum(Object.values(doorsAlways.checked)),
    genelessChecked: doorsAlways.checked.pmDoorInertWithoutItsGene
      + doorsAlways.checked.mtDoorInertWithoutItsGene,
    liveC: doorsLive.theCommitPhysicsDoorMovesTheWorld,
    liveS: doorsLive.theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen,
    liveV: doorsLive.theL3VetoMovesTheWorldOnADosedBook,
    liveP: doorsLive.thePmDoorMovesTheWorldAtTheRuledKnee,
    liveM: doorsLive.theMtDoorMovesTheWorldAtTheRuledKnee,
    cells: ALL_DOOR_CELLS.length, seeds: LIFECYCLE_SEEDS.length,
  },
  mutants: [
    { conjunct: 'everyDoorIsInertWithoutItsPartner', name: '⭐ a door moved the world without its partner', mutate: (i) => ({ ...i, inertHold: false }) },
    { conjunct: 'theInertnessWasCheckedOnRealCells', name: 'the inertness laws checked nothing', mutate: (i) => ({ ...i, checked: 0 }) },
    { conjunct: 'theBornAbsentLawWasCheckedOnRealCells', name: 'MT-T0\'s born-absent law checked nothing', mutate: (i) => ({ ...i, genelessChecked: 0 }) },
    { conjunct: 'theCommitPhysicsDoorIsALiveDoor', name: 'the CB physics door was dead', mutate: (i) => ({ ...i, liveC: 0 }) },
    { conjunct: 'theChoiceSeatIsALiveDoor', name: 'the choice seat was dead', mutate: (i) => ({ ...i, liveS: 0 }) },
    { conjunct: 'theL3VetoIsALiveDoor', name: 'the L3 veto was dead', mutate: (i) => ({ ...i, liveV: 0 }) },
    { conjunct: 'thePmDoorIsALiveDoorAtTheRuledKnee', name: '⭐ the PM door was dead at the knee', mutate: (i) => ({ ...i, liveP: 0 }) },
    { conjunct: 'theMtDoorIsALiveDoorAtTheRuledKnee', name: '⭐⭐ THE SLICE ITSELF was a dead door', mutate: (i) => ({ ...i, liveM: 0 }) },
    { conjunct: 'theMatrixIsExhaustive', name: 'the matrix was not the full power set', mutate: (i) => ({ ...i, cells: 1 }) },
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
    { conjunct: 'theInstrumentedWalkIsTheQuietWalk', name: 'an instrument changed the world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'nonVacuousControlCount', name: 'no control walk ran', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 8 gOracle ---- */
registerGate<{
  called: boolean; answered: boolean; raceBoth: boolean; corridorBoth: boolean;
  corridorRan: boolean; behindSeen: boolean; gkSeen: boolean; outfieldSeen: boolean; band: number;
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
    band: FORWARD_BAND_M,
  },
  mutants: [
    { conjunct: 'theEnginesEvaluatorWasActuallyCalled', name: 'the oracle never ran', mutate: (i) => ({ ...i, called: false }) },
    { conjunct: 'itAnsweredForNearlyEveryPair', name: 'the oracle refused every pair', mutate: (i) => ({ ...i, answered: false }) },
    { conjunct: 'bothRaceVerdictsOccur', name: 'the race verdict was constant', mutate: (i) => ({ ...i, raceBoth: false }) },
    { conjunct: 'theCorridorTestWasActuallyRun', name: 'the corridor test never ran', mutate: (i) => ({ ...i, corridorRan: false }) },
    { conjunct: 'bothCorridorVerdictsOccur', name: 'the corridor verdict was constant', mutate: (i) => ({ ...i, corridorBoth: false }) },
    { conjunct: 'behindBodiesWereSeenAtAll', name: 'no behind-ball body was ever seen', mutate: (i) => ({ ...i, behindSeen: false }) },
    { conjunct: 'theGkSplitSeesBothSides', name: 'the GK split was one-sided (a dead split)', mutate: (i) => ({ ...i, gkSeen: false }) },
    { conjunct: 'theForwardBandIsTheEnginesOwn', name: 'the ±2 m band stopped tracing to src', mutate: (i) => ({ ...i, band: 3 }) },
  ],
});

/* ---- 9 ⭐⭐ gSag — THE SEAM'S OWN INSTRUMENT IS ALIVE AND SIDED ---- */
/**
 * The sag census is the only face family whose ARM-DEPENDENCE is structural, so it is the one
 * place a silent mis-arming would be invisible in the football. This gate makes it loud:
 * the base arm must add EXACTLY zero metres, the slice arm must add some, both arms must see
 * the same trigger population, and the seam's own line must still trace to `src/**`.
 */
registerGate<{
  baseTicks: number; sliceTicks: number; baseAdded: number; sliceAdded: number;
  baseSlack: number; sliceSlack: number; baseAddedTicks: number; sliceAddedTicks: number;
  seamLine: number; seamSites: number; samples: number;
}>({
  name: 'gSag',
  fn: (i) => ({
    theSeamsPopulationIsNonEmptyOnBothArms: i.baseTicks > 0 && i.sliceTicks > 0,
    theTriggerGeometryExistsOnBothArms: i.baseSlack > 0 && i.sliceSlack > 0,
    theBaseArmAddsExactlyZeroMetres: i.baseAdded === 0 && i.baseAddedTicks === 0,
    theSliceArmActuallyWidensStances: i.sliceAdded > 0 && i.sliceAddedTicks > 0,
    theSeamsOwnLineStillTracesToSrc: i.seamLine > 0 && i.seamSites === 1,
    theCensusWasSampledAtAll: i.samples > 0,
  }),
  input: {
    baseTicks: sagReceipt.v7.markerTicks, sliceTicks: sagReceipt.v7mt.markerTicks,
    baseAdded: sagReceipt.v7.sumAddedMetres, sliceAdded: sagReceipt.v7mt.sumAddedMetres,
    baseSlack: sagReceipt.v7.slackPositiveTicks, sliceSlack: sagReceipt.v7mt.slackPositiveTicks,
    baseAddedTicks: sagReceipt.v7.addedPositiveTicks,
    sliceAddedTicks: sagReceipt.v7mt.addedPositiveTicks,
    seamLine: MT_SEAM_LINE,
    seamSites: lifecycleStructure.mtSeamWriteSites,
    samples: sagReceipt.v7.samples + sagReceipt.v7mt.samples,
  },
  mutants: [
    { conjunct: 'theSeamsPopulationIsNonEmptyOnBothArms', name: 'no marker tick was ever sampled', mutate: (i) => ({ ...i, baseTicks: 0 }) },
    { conjunct: 'theTriggerGeometryExistsOnBothArms', name: 'the slack trigger never occurred', mutate: (i) => ({ ...i, baseSlack: 0 }) },
    { conjunct: 'theBaseArmAddsExactlyZeroMetres', name: '⭐ the base arm was silently dosed', mutate: (i) => ({ ...i, baseAdded: 1 }) },
    { conjunct: 'theSliceArmActuallyWidensStances', name: '⭐⭐ the slice never sagged anything', mutate: (i) => ({ ...i, sliceAdded: 0, sliceAddedTicks: 0 }) },
    { conjunct: 'theSeamsOwnLineStillTracesToSrc', name: 'the seam line stopped tracing to src', mutate: (i) => ({ ...i, seamSites: 0 }) },
    { conjunct: 'theCensusWasSampledAtAll', name: 'the census never sampled', mutate: (i) => ({ ...i, samples: 0 }) },
  ],
});

/* ---- 10 gQ07 ---- */
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

/* ---- 11 gSpells ---- */
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

/* ---- 12 gNonVacuity ---- */
registerGate<{ empties: string[]; cells: number; hist: number; histTotal: number }>({
  name: 'gNonVacuity',
  fn: (i) => ({
    noPublishedRateHasAZeroDenominator: i.empties.length === 0,
    theHistogramSumsToItsOwnDenominator: i.hist === i.histTotal,
    nonVacuousCellCount: i.cells > 0,
  }),
  input: {
    empties: vacuity.empties, cells: vacuity.cells,
    hist: histReceipt.ok, histTotal: histReceipt.total,
  },
  mutants: [
    { conjunct: 'noPublishedRateHasAZeroDenominator', name: 'a rate was published on nothing', mutate: (i) => ({ ...i, empties: ['x'] }) },
    { conjunct: 'theHistogramSumsToItsOwnDenominator', name: 'the histogram lost a reception', mutate: (i) => ({ ...i, hist: i.hist - 1 }) },
    { conjunct: 'nonVacuousCellCount', name: 'nothing was published', mutate: (i) => ({ ...i, cells: 0 }) },
  ],
});

/* ---- 13 ⭐⭐ gFaces — RE-DERIVED FROM THE **SERIALIZED ARTIFACT** (#287.1's canon) ---- */
/**
 * The gate PARSES THE JSON THAT WAS WRITTEN TO DISK, rebuilds a `Row` from each stored cell,
 * and re-sums every published numerator and denominator from those rebuilt rows — so a field
 * `cellOf` forgot to serialize FAILS the gate instead of hiding behind the in-memory objects
 * that produced it (BU-T0b's `rowFromCell` inverse, the pattern copied).
 */
const rowFromCell = (c: Record<string, unknown>): Row => ({
  seed: Number(c.seed), signature: String(c.sig), armOk: Boolean(c.armOk),
  lifecycle: c.life as Lifecycle, sag: c.sag as SagCensus,
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
    { conjunct: 'theGateActuallyParsedTheArtifactFromDisk', name: 'the gate never read the file (the gFaces hole)', mutate: (i) => ({ ...i, cellsRead: 0 }) },
    { conjunct: 'everyFrozenFaceIsPublished', name: 'a face went missing', mutate: (i) => ({ ...i, keys: i.keys - 1 }) },
    { conjunct: 'nonVacuousFaceCount', name: 'nothing was re-derived', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 14 gClock ---- */
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

/* ---- 15 gSeed ---- */
registerGate<{ clashes: string[]; internal: string[]; inBand: boolean; ordered: boolean }>({
  name: 'gSeed',
  fn: (i) => ({
    noClashWithTheConsumedLedger: i.clashes.length === 0,
    noInternalClash: i.internal.length === 0,
    everyWalkedSeedIsInTheClaimedBattery: i.inBand,
    theClaimedBlocksAreOrdered: i.ordered,
  }),
  input: {
    clashes: seedClashes, internal: claimedInternalClashes, inBand: allSeedsInBand,
    ordered: CLAIMED.every((c) => c.range[0] <= c.range[1]),
  },
  mutants: [
    { conjunct: 'noClashWithTheConsumedLedger', name: 'a claimed block collided with a consumed one', mutate: (i) => ({ ...i, clashes: ['x'] }) },
    { conjunct: 'noInternalClash', name: 'two claimed blocks overlapped', mutate: (i) => ({ ...i, internal: ['x'] }) },
    { conjunct: 'everyWalkedSeedIsInTheClaimedBattery', name: 'a walk left the claimed band', mutate: (i) => ({ ...i, inBand: false }) },
    { conjunct: 'theClaimedBlocksAreOrdered', name: 'a block was inverted', mutate: (i) => ({ ...i, ordered: false }) },
  ],
});

/* ---- 16 gStats ---- */
const minGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
registerGate<{ base: number; gap: number; resamples: number }>({
  name: 'gStats',
  fn: (i) => ({
    theBaseIsTheDispatchedFloor: i.base === 112_200,
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

/* ---- 17 gEnvClean ---- */
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
    { conjunct: 'noRogueOwnVariable', name: 'a rogue BUT1_* var was accepted', mutate: (i) => ({ ...i, rogue: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote the canonical artifact', mutate: (i) => ({ ...i, preflight: true, out: OUT_BY_MODE.full }) },
  ],
});

/* ---- 18 gHashEnvelope ---- */
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

/* ---- 19 gMutants ---- */
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
  banner('BU-T1 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
/** ⭐ #288.4's NEW CANON, MACHINE-APPLIED: every face carries |Δ| ÷ its own half-width. */
const ratioToHalfWidth = (delta: number, ci: [number, number]): number => {
  const hw = (ci[1] - ci[0]) / 2;
  return hw === 0 || !Number.isFinite(hw) ? Number.NaN : Math.abs(delta) / hw;
};
const pubFace = (f: FaceRow): Record<string, unknown> => ({
  face: f.face, unit: f.unit, what: f.what,
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
      /** ⭐ #288.4: the number every starred finding must state. */
      absDeltaOverHalfWidth: round(r, 4),
      /** ⚠ BU-T0b's sizing note, applied mechanically: inside 2× ⇒ MARGINAL, never rounded up. */
      strength: !Number.isFinite(r) ? 'UNMEASURED'
        : r < 1 ? 'UNRESOLVED' : r < 2 ? '⚠ MARGINAL (within 2× of its half-width)' : 'RESOLVED',
    }];
  })),
});

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: '⭐⭐ BU-T1 — THE MT KEEP/HOLD SEAM IN THE v7 COMPOSITION (the arc\'s LAST assembly slice)',
  doc: 'docs/world-model/BU-T1-MT-COMPOSITION.md',
  contract: 'docs/world-model/BU-BUILDUP-CONTRACT.md §2 M-BU.1–4 / §3, bound by #285.1; '
    + 'this stage authorized by ruling #288.7; the base harness is BU-T0 / BU-T0b '
    + '(incl. BOTH their §COMMANDER CORRECTIONS OF RECORD, #287 and #288)',
  whatMtKeepHoldIs: '⭐ #213.3(丙) names the MT worlds\' KEEP/HOLD VERDICT — the still-open '
    + 'USER decision on whether to KEEP the banked tuck-in, NOT an event class. MT\'s own docs '
    + 'name no keep/hold event: it is 松盯内收, an ACCESS-TIME MARK SAG (MT-T0 §SEAM) coupled '
    + 'with PM\'s defensive lane convergence (MT-LADDER §2). A CAPABILITY seam with NO books, '
    + 'so there is no maturation and no truth-dosing question. Its OWN event grain is the SAG '
    + 'CENSUS, re-taken here with the engine\'s own markSagMetres × markSagWeight.',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'Does arming the banked tuck-in seam in the polished world change how the team '
      + 'KEEPS THE BALL — and does it move the census faces the build-up arc is judged on?',
    arms: {
      v7: 'THE BASE — `new Match({seed, teams, ...a4MatchFlags(7)})` + `armA4World(m, null, 7, '
        + 'poolT1DoseCells(L3-T1))`: the CB layer (commit physics + touch-past + the choice '
        + 'seat at the declared proneness dose) + the two L3 book doors at the shipped pooled '
        + 'matured dose. DV STAYS SHUT on BOTH arms (#287.2 nulled it; #288.2 struck the fix).',
      v7mt: 'THE SLICE — THE SAME, plus `pmLaneConvergence` + `mtMarkSag` and both genes '
        + '(`defLaneConvergence`, `markSag`) at the RULED KNEE on both teams. Both doors '
        + 'together IS MT\'s own banked arming (MT-LADDER §2: every dosed arm throws all '
        + 'switches of BOTH seams); no evolution opt-in is armed (a fixed armed world mutates '
        + 'nothing).',
      substrate: '⚠ DECLARED: v7 is a SUPERSET of MT_WORLD_FLAGS\' own substrate (the percept '
        + 'pair is inside a4MatchFlags(7), which also carries edsValueAxis, c5Hold, c6Carry, '
        + 'c7Windup, o1PassWindup and the CB + L3 doors). That is what a COMPOSITION slice is: '
        + 'MT-LADDER measured this seam on the bare percept substrate and NO MT-LADDER number '
        + 'is re-quoted as this stage\'s.',
      houseLaw270: '⚠⚠ DECLARED DEVIATION FROM MT\'S OWN `setMtDose`: that writer includes '
        + '`info.genome` (the pre-#270 A4/MT idiom). #270.2 ratified the de-aliasing form '
        + '(baseGenome copy + effGenome) as the better one, so THIS probe uses it. The '
        + 'consumers read `team.genome` === effGenome, gArms asserts the dose there AND that '
        + 'info.genome stays clean, and gDoors proves both doors still move the world.',
    },
    dose: {
      law: 'THE RULED KNEE, read from the committed ladder — never typed.',
      value: MT_DOSE,
      fromArtifact: MT_KNEE_FROM_ARTIFACT,
      fromShippedEntry: MT_WORLD_DOSE[MT_KNEE_WORLD],
      branch: MT_KNEE_BRANCH,
      artifact: MTLAD_PATH,
      declaredSha: MTLAD_SHA,
      honesty: '⚠ THE LADDER\'S OWN WORDS: the knee is "an EXHIBIT DOSE for the user\'s '
        + 'play-test verdict … NOT a ship decision", reached through the NONE_ABOVE_FLOOR '
        + 'fallback (no dose qualified on all three limbs). This stage arms the exhibit dose '
        + 'in the composition; it ships nothing and decides nothing about the knee.',
    },
    instruments: {
      sagCensus: `⭐ THE SEAM'S OWN GRAIN — out-of-possession markers with a resolvable mark, `
        + `sampled every ${SAG_SAMPLE_TICKS} ticks (MT-LADDER's own SAG_SAMPLE_EVERY). Two `
        + `quantities, BOTH the engine's: markSagMetres(...) and markSagWeight(g)·that. `
        + `⚠ DECLARED SIMPLIFICATION vs MT-LADDER: no base-stance REPLICA is computed here, so `
        + `the "sagged > base" and "tightened" rows are not re-published — the seam only ever `
        + `ADDS (MT-T0 §SEAM), so metres-added IS the bite. Traced to ${EXEC_SRC_PATH}:${MT_SEAM_LINE}.`,
      optionLadder: 'BU-C0\'s ladder VERBATIM in definition (L1 POSITION on Q07\'s own ±2 m '
        + `band, EXTRACTED from ${MECH_SRC_PATH}:${FORWARD_BAND_LINE} · L2 the engine's own `
        + 'flight prediction · L3 arrivalMargin > 0 · L4 the engine\'s corridor sampler), '
        + 'GK-SPLIT at every behind-ball rung (#286.1\'s debt).',
      directionMix: 'FORWARD is R-乙 Q07 VERBATIM (the engine\'s own passesForward counter); '
        + 'the probe\'s ±2 m re-derivation only splits the engine\'s POOLED complement.',
      spellTerminals: 'the #173 / R-乙 Q01 segmentation VERBATIM, terminal class = the LATEST '
        + 'qualifying engine event inside the spell\'s own span.',
    },
    preRegisteredReporting: [
      '⭐ TEMPO / RETENTION (the seam\'s own axis): Q01 open-play spell mean · Q05 '
        + 'touches/spell · the keep/hold usage AT THE SEAM\'S OWN EVENT GRAIN (the sag census) '
        + '· pass attempts/match · receptions/match.',
      '⭐ CENSUS FACES (BU-C0 definitions verbatim, commensurable): behind-ball '
        + 'options/reception WITH GK-SPLIT RUNGS · zero-option share · ⭐⭐ THE NAMED '
        + 'HYPOTHESIS FACE — pressed-reception supply (#288.3, 持球买身后支援, banked at 1.26× '
        + 'half-width MARGINAL; this slice is its scheduled test).',
      'DIRECTION MIX (Q07 conventions) · Q06 completion · TERMINALS · goals/match.',
      '⚠ TERMINALS ARE L3-VETO ENTANGLED AT THE LEVEL (BU-C0 §CORRECTIONS 3): both arms carry '
        + 'the veto, so the CONTRASTS are entanglement-free by construction and the LEVELS are '
        + 'not; lossToOpponentShare is the honest cross-arm aggregate.',
      '⚠ REPORTED, NEVER GATED: no gate in this probe reads any football face.',
    ],
    populations: {
      reception: 'every tick at which the ball\'s owner CHANGES while phase === "playing".',
      pressedReception: `a reception whose receiver has an opponent within ${PRESSURE_R} m `
        + `(TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}).`,
      pressedCarrierMoment: `a NON-reception carrier tick sampled every ${CARRIER_SAMPLE_TICKS} `
        + `ticks (${round(CARRIER_SAMPLE_TICKS * DT, 4)} sim-s) at which the carrier is pressed.`,
      markerTick: `an out-of-possession player whose action is MarkOpponent with a resolvable `
        + `target, sampled every ${SAG_SAMPLE_TICKS} ticks.`,
    },
    clock: {
      matchDurationSimSeconds: MATCH_DURATION,
      displayMinutes: DISPLAY_MINUTES,
      displayMinutesTracedTo: `${MATCH_SRC_PATH}:${DISPLAY_MINUTES_LINE} (Match.minute())`,
      displaySecondsPerSimSecond: DISPLAY_S_PER_SIM_S,
      law: 'shares are dimensionless and read the same on both axes; the per-MATCH count rows '
        + 'are convention B (our match IS the 90′) and their convention-A form is '
        + '× displaySecondsPerSimSecond.',
      applied: 'APPLIED, not nominal: the duration is never overridden and gClock asserts it.',
    },
    estimator: `PAIRED cluster bootstrap by match seed, ${BOOTSTRAP} resamples, percentile 95 % `
      + 'CI, ratio of sums; ONE resample-index matrix drawn once and shared by every face and '
      + 'BOTH arms, so the contrast is the same resampled worlds.',
    sizing: `N = ${N_FROZEN} paired seeds (#288.7's budget). ⚠ BU-T0b's sizing note binds: `
      + 'marginal faces resolve LESS at N = 200 — a face inside 2× of its half-width is '
      + 'MARGINAL and is NEVER rounded up (the `strength` field applies the rule by machine).',
    terminalClasses: TERMINALS,
    pressureRadiusM: PRESSURE_R,
    forwardBandM: FORWARD_BAND_M,
    histogramTopBucket: HIST_MAX,
    sagSampleTicks: SAG_SAMPLE_TICKS,
  },
  run: {
    N: N_RUN, base: BASE_RUN, arms: ARMS.length, walks: armTotal,
    perturbationControls: perturbCheck.total,
    doorsMatrixWalks: LIFECYCLE_SEEDS.length * (ALL_DOOR_CELLS.length
      + ALL_DOOR_CELLS.filter((c) => !c.P).length + ALL_DOOR_CELLS.filter((c) => !c.M).length),
    receptions: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.receptions))])),
    pressedReceptions: Object.fromEntries(ARMS.map((a) => [a,
      sum(rowsOf(a).map((r) => r.receptionsPressed))])),
    pressedCarrierMoments: Object.fromEntries(ARMS.map((a) => [a,
      sum(rowsOf(a).map((r) => r.carrierSamplesPressed))])),
    openSpells: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.openSpells))])),
    attempts: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.attempts))])),
    oracleCalls: oracleReceipt.calls,
  },
  /* ---- ⭐⭐ THE ORDER OF PROOF'S FIRST STEP, PUBLISHED IN FULL ---- */
  armingLifecycle: {
    debt: 'M-BU.2 / #269.2(iv) — the clearTouchPastArming staleness class, PROVEN AT THE NEW '
      + 'CB+L3+MT COMPOSITION (#287.3 discharged CB+L3+DV; this composition is new).',
    law: 'A DICHOTOMY: (a) in every cell where an aim CAN fire, no arming survives its own '
      + 'tick; (b) in every cell where armings persist (choice-armed without capability), ZERO '
      + 'knocks fire. S ∧ ¬T is a configuration no armed world constructs — REPORTED, never '
      + 'excluded.',
    scope: '⚠ o2Look and ekHoldVeto are NOT armed here, so the discharge is for CB+L3+MT ONLY; '
      + 'their own compositions remain UNDISCHARGED.',
    nonVacuity: 'the exposure is REAL: o1PassWindup and c7Windup (two early returns above the '
      + 'seat\'s arm/withdraw block) ARE armed in the v7 substrate — a zero measured in a world '
      + 'with no exposure would be a zero of absence, and gLifecycle refuses it.',
    firingHalf: lifecycleMatrix.firing,
    inertHalf: lifecycleMatrix.inert,
    total: lifecycleMatrix.total,
    cellsWalked: lifecycleMatrix.cells,
    firingCellWalks: lifecycleMatrix.firingCells,
    inertCellWalks: lifecycleMatrix.inertCells,
    choiceWithoutCapabilityCellsHoldingAnArming: lifecycleMatrix.persistingCells.length,
    measuredBattery: batteryLifecycle,
    structure: lifecycleStructure,
    unitNote: '⚠ the cell counts above are WALKS (cells × seeds), not distinct flag cells — the '
      + 'BU-T0 §CORRECTIONS 3 slippage, avoided by saying so.',
  },
  doorsMatrix: {
    axes: 'C cbCommitPhysics · T cbTouchPast · S cbChoiceSeat(+proneness) · L l3DefenceLearn'
      + '(+dose) · V l3DefenceVeto · ⭐ P pmLaneConvergence(+gene at the knee) · ⭐ M mtMarkSag'
      + '(+gene at the knee)',
    substrate: 'a4MatchFlags(3) — CALLED, not copied',
    cells: ALL_DOOR_CELLS.length,
    seeds: LIFECYCLE_SEEDS,
    identityLaws: [
      'cbTouchPast is INERT without the choice seat (nothing can write the arming slot)',
      'l3DefenceLearn is INERT without the veto (the book fills, nothing reads it)',
      'l3DefenceVeto is INERT without the learning door (there is no book to read)',
      '⭐ pmLaneConvergence is INERT with defLaneConvergence ABSENT (MT-T0\'s G-BORN law: the '
        + 'branch is ENTERED and the weight evaluates to 0 — byte-identity through a live branch)',
      '⭐ mtMarkSag is INERT with markSag ABSENT (the same law, the slice\'s own door)',
    ],
    inertnessChecked: doorsAlways.checked,
    inertnessFailures: doorsAlways.fail,
    liveness: doorsLive,
  },
  faces: C.faces.map(pubFace),
  /* ---- ⭐ THE SEAM'S OWN CENSUS, per arm, in raw counts ---- */
  sagCensus: sagReceipt,
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
    receptions: sum(rowsOf(a).map((r) => r.receptions)),
  }])),
  terminalCensus: Object.fromEntries(ARMS.map((a) => [a, {
    openPlay: Object.fromEntries(TERMINALS.map((t) => [t,
      sum(rowsOf(a).map((r) => r.terminalOpen[t]))])),
    allSpells: Object.fromEntries(TERMINALS.map((t) => [t,
      sum(rowsOf(a).map((r) => r.terminalAll[t]))])),
    openDenominator: sum(rowsOf(a).map((r) => r.openSpells)),
    allDenominator: sum(rowsOf(a).map((r) => r.spells)),
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
  perturbCheck,
  doses: {
    l3: {
      source: `${T1_PATH} · poolT1DoseCells (the SHIPPED world-7 entry's own pooling)`,
      declaredSha: L3_T1_SHA, cells: L3_DOSE, labels: l3DoseLabels,
    },
    mt: {
      source: `${MTLAD_PATH} · results.knee.kneeDose (cross-checked against a4World's own `
        + 'MT_WORLD_DOSE[4], the shipped play-test entry\'s copy)',
      declaredSha: MTLAD_SHA,
      dose: MT_DOSE,
      genes: ['defLaneConvergence', 'markSag'],
      writer: '⭐ the #270 de-aliasing form on MATCH-LOCAL views (baseGenome copy + effGenome), '
        + 'NOT a4World\'s `setMtDose` (which includes info.genome — the pre-#270 idiom).',
      cbProneness: CB_WORLD_DOSE,
    },
    houseLaw: '#270 — no dose anywhere in info.genome, asserted per walk in gArms.',
  },
  perSeedCells: Object.fromEntries(ARMS.map((a) => [a, rowsOf(a).map(cellOf)])),
  seeds: { claimed: CLAIMED, block: [12_489_000, 12_489_999] },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 112_200, step: STATS_STEP },
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
    'NOTHING IS SCORED HERE. H-BU.1 is scored at ARC EXIT on the assembled composition '
      + '(#286.3\'s amended seat); every football face is REPORTED and no gate reads one.',
    '⭐ THE KEEP/HOLD VERDICT IS THE USER\'S (#213.3(丙)) and is NOT taken here: this stage '
      + 'measures what the banked seam does to build-up in the polished world.',
    'NO WEIGHT WAS TOUCHED and NO FACE DEFINITION MOVED (#256.2 / M-BU.3). The seam is armed '
      + 'at its OWN ruled dose through its own doors.',
    'The option oracle answers "could the engine\'s own machinery get the ball there" — '
      + 'capability, never choice, never perception.',
    '⚠ THE MT ARM IS THE COUPLED WORLD (PM lane convergence + MT mark sag together), because '
      + 'that is MT\'s own banked arming. This stage CANNOT attribute an effect to one of the '
      + 'two seams; the doors matrix proves both are live, it does not decompose the football.',
    '⚠ THE SUBSTRATE IS NOT MT-LADDER\'S: no MT-LADDER football number (body gap, the band, '
      + 'goals 2.19→1.99) is re-quoted as this stage\'s measurement — those were measured on '
      + 'the bare percept substrate with no CB/L3 layer.',
    '⚠ THE TERMINAL SHARES ARE L3-VETO ENTANGLED AT THE LEVEL (BU-C0 §CORRECTIONS 3); the '
      + 'CONTRASTS are entanglement-free because both arms carry the veto.',
    'The pressed-carrier population is a SAMPLE at a declared cadence, not every tick; the sag '
      + 'census likewise samples every ' + String(SAG_SAMPLE_TICKS) + ' ticks.',
    '⚠ The sag census publishes only engine-computed quantities; MT-LADDER\'s "sagged > base" '
      + 'and "tightened" rows needed a base-stance REPLICA and are NOT re-published here.',
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
    note: 'UNHASHED (#266.3(a)): head, timestamps, paths and all machine timings live here so '
      + 'resultSha256 re-derives at any commit or path.',
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/bu-t1-cross-out.json';
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
banner(`\n  [bu-t1] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [bu-t1] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
const face = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const show = (k: string): string => {
  const f = face(k);
  const c = f.contrasts.v7mt;
  const res = (c.ci95[0] > 0 && c.ci95[1] > 0) || (c.ci95[0] < 0 && c.ci95[1] < 0);
  const r = ratioToHalfWidth(c.delta, c.ci95);
  return `v7 ${f.arms.v7.point.toFixed(4)} → v7mt ${f.arms.v7mt.point.toFixed(4)} (Δ`
    + `${c.delta >= 0 ? '+' : ''}${c.delta.toFixed(4)} [${c.ci95[0].toFixed(4)}, `
    + `${c.ci95[1].toFixed(4)}] |Δ|/hw ${r.toFixed(2)}${res ? ' ⭐RESOLVED' : ''})`;
};
banner(`  [bu-t1] ⭐ sag metres ADDED / marker-tick — ${show('sagMeanAddedMetresPerMarkerTick')}`);
banner(`  [bu-t1] ⭐ sag-added share of ticks       — ${show('sagAddedPositiveShare')}`);
banner(`  [bu-t1] Q01 spell mean (sim-s)          — ${show('spellMeanSeconds')}`);
banner(`  [bu-t1] Q05 touches / spell             — ${show('touchesPerSpell')}`);
banner(`  [bu-t1] attempts / match                — ${show('attemptsPerMatch')}`);
banner(`  [bu-t1] receptions / match              — ${show('receptionsPerMatch')}`);
banner(`  [bu-t1] behind-ball options / reception — ${show('behindBallOptionsPerReception')}`);
banner(`  [bu-t1] ⭐⭐ PRESSED-reception supply     — ${show('behindBallOptionsPerPressedReception')}`);
banner(`  [bu-t1] zero-option share               — ${show('shareReceptionsWithNoBehindOption')}`);
banner(`  [bu-t1] circulation completions         — ${show('circulationShareOfCompletions')}`);
banner(`  [bu-t1] completion rate (Q06)           — ${show('passCompletionRate')}`);
banner(`  [bu-t1] loss-to-opponent share          — ${show('lossToOpponentShare')}`);
banner(`  [bu-t1] goals / match                   — ${show('goalsPerMatch')}`);
banner(`  [bu-t1] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
