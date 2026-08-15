/**
 * BU-T0 — THE DV LEARNED RISK MAPS IN THE v7 COMPOSITION
 * (docs/world-model/BU-T0-DV-COMPOSITION.md).
 *
 * The BUILD-UP contract's FIRST ASSEMBLY SLICE (BU-BUILDUP-CONTRACT.md §2 M-BU.1–4 / §3,
 * bound by #285.1, slice order bound by #286.3): compose the BANKED DV seam — teams price
 * deliveries by their OWN learned loss maps (#259 / the DV-T2 family) — into the v7 world
 * (the CB layer + `l3DefenceLearn` + `l3DefenceVeto` at the matured L3 dose).
 *
 *   ARMS (paired, SAME seeds):
 *     v7    — the base: `a4MatchFlags(7)` + `armA4World(m, null, 7, poolT1DoseCells(L3-T1))`
 *     v7dv  — the slice: THE SAME WORLD plus `dvLearnedMap` + `dvDeliveryValue`, with the two
 *             delivery account books DOSED to the committed DV-T2-T1 exam's own MATURED cells
 *             (its `learnConsume` arm's final checkpoint, POOLED over all 40 books — the L3
 *             entry's `poolT1DoseCells` idiom, applied to the DV family's own bank).
 *
 * ⭐ THE ORDER OF PROOF IS BINDING (#286.3):
 *   1. THE #269.2(iv) ARMING-LIFECYCLE PROOF, at the FULL CB+L3+DV composition — the
 *      `clearTouchPastArming` staleness class. It runs FIRST, over the whole 128-cell doors
 *      matrix, and a staleness defect REFUSES THE RUN (exit 4) for adjudication.
 *   2. DORMANCY: `src/**` is BYTE-UNTOUCHED (`xSrcUntouched`, in the #286-CORRECTED form —
 *      `git diff --stat HEAD -- src` AND `git status --porcelain -- src`).
 *   3. THEN the battery.
 *
 * THE INSTRUMENT is BU-C0's, re-run for COMMENSURABLE faces (same frozen definitions), with
 * ONE canonical extension ruled by #286: ⭐ THE OPTION LADDER NOW CARRIES GK-SPLIT RUNGS —
 * L1..L4 each split GK / outfield, so the ladder a future stage quotes is re-derivable
 * outfield-only (the #286.1 DEBT, discharged here).
 *
 * ⭐ #283.2(iv): worker-simmed fixtures play the SHIPPED world (`League.toJSON` omits
 *    `matchFlags`), so EVERY match here is constructed DIRECTLY with its flags and the arming
 *    is ASSERTED LIVE on the very match the walk measures (a `gArms` conjunct).
 * ⭐ HOUSE LAW #270: the dose NEVER touches `info.genome` — the L3 dose rides the shipped
 *    entry's own path and the DV dose is written through `DeliveryAccountBook.note()`, the
 *    book's own public writer (the `doseL3Books` idiom, verbatim in form).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BUT0_MODE (smoke|full, REQUIRED) · BUT0_N · BUT0_OUT.
 *   ANY other `BUT0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is a PREFLIGHT: it may not write a canonical repo path.
 *
 * RUN: BUT0_MODE=full npx tsx scripts/probes/bu-t0-dv-composition.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal ·
 *       4 = ⭐ AN ARMING-LIFECYCLE STALENESS DEFECT (STOP for adjudication).
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
} from '../../src/game/a4World';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import { passChoiceCandidateGids } from '../../src/ai/perceivedPassChoice';
import { DeliveryAccountBook } from '../../src/ai/deliveryAccountBook';
import { DV_ZONES, DV_ZONE_COUNT } from '../../src/ai/deliveryValueSeat';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['BUT0_MODE', 'BUT0_N', 'BUT0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BUT0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('BU-T0 FATAL — refused env surface. '
    + `rogue BUT0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.BUT0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`BU-T0 FATAL — BUT0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const N_ENV = process.env.BUT0_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.BUT0_N, 10)) : null;
const OUT_ENV = process.env.BUT0_OUT;
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['BUT0_N'] : []),
  ...(OUT_ENV !== undefined ? ['BUT0_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/bu-t0-dv-composition-smoke.json',
  full: 'docs/world-model/data/bu-t0-dv-composition.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bu-t0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('BU-T0 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
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
const CONST_SRC = readFileSync(CONST_SRC_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_SRC_PATH, 'utf8');
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

/* ========================================================================== */
/* §3 THE FROZEN DESIGN — seeds, stats stream, sizing                          */
/* ========================================================================== */
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const DVT1_PATH = 'docs/world-model/data/dv-t2-t1-convergence-exam.json';
/**
 * ⭐ THE DV BANK'S DECLARED IDENTITY, TWO WAYS — and the second one is why.
 *
 * DV-T2-T1 §COMMANDER CORRECTIONS 1 records that THAT artifact's own `resultSha256` rides a
 * timing field and is therefore MACHINE-DEPENDENT; its portable anchor is the G-DET digest.
 * This stage guards on BOTH: the committed file's declared SHA (a file-identity guard, exactly
 * the `L3_T1_SHA` idiom) AND the portable G-DET digest the correction names.
 */
const DVT1_SHA = '6854ddf1c93ad8f00eb5ba647f6a10424249ab3dd86b10a822689069276b00c5';
const DVT1_GDET = '9bc1aaf9bbd419043ee399453f3a166eced9ce7cdc3ca34e92bb2e5e0ce124fc';

const BOOTSTRAP = 2000;
const STATS_BASE = 111_800;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600,
];

const BATTERY_BASE = 12_487_100;
const SMOKE_BASE = 12_487_000;
const GUARD_BASE = 12_487_040;
const GUARD_SPAN = 20;
/** ⭐ the ARMING-LIFECYCLE / DOORS-MATRIX block — its own seeds, walked BEFORE the battery. */
const LIFECYCLE_BASE = 12_487_500;
const LIFECYCLE_SEEDS_FULL = 3;
const GWORLD_SEED = 12_487_900;
const N_FROZEN = 300;
/** how many paired seeds the NON-PERTURBATION control re-walks WITHOUT the oracle. */
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
];

/* ========================================================================== */
/* §4 THE TWO DOSES — both from COMMITTED artifacts, neither ever typed        */
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

/** One zone's matured DV cell: closed labels into that AIM zone, and how many were punished. */
interface DvDoseCell { readonly deliveries: number; readonly punished: number }

/**
 * ⭐⭐ THE DV MATURED DOSE — DERIVED, never typed, by the L3 entry's own POOLING IDIOM applied
 * to the DV family's own bank.
 *
 * The source is the committed DV-T2-T1 convergence exam's stored per-book cells
 * (`result.perClusterCells`), the `consume` arm (its `learnConsume` books — the books that
 * matured in a world where the map was BEING CONSUMED, which is the world this stage arms),
 * at the LAST checkpoint (M* = 440 matches), POOLED over all 40 books (20 replicates × 2
 * sides).
 *
 * ⭐ WHY POOLED (the L3-ENTRY-RUNG §DOSE argument, verbatim in form): a composed match has no
 * replicate index and no honest way to invent one, and both teams are dosed symmetrically
 * anyway. The pooled book is the aggregate of exactly the evidence the exam banked, and it
 * carries the ordering all forty books carry — which is the whole of what the pricer reads.
 *
 * PURE: an artifact in, `DV_ZONE_COUNT` cells out.
 */
const poolDvDoseCells = (file: unknown): DvDoseCell[] => {
  const reps = ((file as { result?: { perClusterCells?: readonly {
    consume?: readonly (readonly { deliveries: number[]; punished: number[] }[])[];
  }[] } }).result?.perClusterCells) ?? [];
  const out: DvDoseCell[] = Array.from({ length: DV_ZONE_COUNT },
    () => ({ deliveries: 0, punished: 0 }));
  for (const rep of reps) {
    for (const snaps of rep.consume ?? []) {
      const last = snaps[snaps.length - 1];
      if (last === undefined) continue;
      for (let z = 0; z < out.length; z++) {
        out[z] = {
          deliveries: out[z].deliveries + (last.deliveries[z] ?? 0),
          punished: out[z].punished + (last.punished[z] ?? 0),
        };
      }
    }
  }
  return out;
};
const DVT1_FILE = readJson(DVT1_PATH);
const DV_DOSE: DvDoseCell[] = poolDvDoseCells(DVT1_FILE);
/** the belief the dosed book will serve — the book's OWN running frequency, re-derived here. */
const DV_DOSE_BELIEF: number[] = DV_DOSE.map(
  (c) => (c.deliveries === 0 ? 0 : c.punished / c.deliveries));

/**
 * ⭐ WRITE THE DV DOSE through the book's OWN public `note()` — the `doseL3Books` idiom
 * verbatim in form (house law #270): a dosed book is a state the world could itself have
 * reached, by the only writer the shipped seam has. No field surgery, no new capability,
 * and NOTHING anywhere near `info.genome`.
 */
const dosedDvBooks = (): [DeliveryAccountBook, DeliveryAccountBook] => {
  const books: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook()];
  for (const book of books) {
    for (let z = 0; z < DV_DOSE.length; z++) {
      const c = DV_DOSE[z];
      for (let i = 0; i < c.punished; i++) book.note(z, true);
      for (let i = 0; i < c.deliveries - c.punished; i++) book.note(z, false);
    }
  }
  return books;
};

/* ========================================================================== */
/* §5 THE ARMS — constructed DIRECTLY with matchFlags (#283.2(iv))             */
/* ========================================================================== */
type ArmKind = 'v7' | 'v7dv';
const ARMS: readonly ArmKind[] = ['v7', 'v7dv'];
const matchOf = (seed: number, arm: ArmKind): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  const dv = arm === 'v7dv';
  const m = new Match({
    seed, teamA, teamB, ...a4MatchFlags(L3_WORLD_VERSION),
    ...(dv ? {
      dvLearnedMap: true, dvDeliveryValue: true, dvLearnedBooks: dosedDvBooks(),
    } : {}),
  });
  armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
  return m;
};

/** the three genome views, for the house-law-#270 conjunct. */
const infoGenomeOf = (m: Match, s: Side): Record<string, unknown> =>
  m.teams[s].info.genome as unknown as Record<string, unknown>;

/** ⭐⭐ THE ARM-IDENTITY CONJUNCTS, ASSERTED ON THE MATCH THE WALK MEASURES (#283.2(iv)). */
const armConjuncts = (m: Match, arm: ArmKind): Record<string, boolean> => {
  const mm = m as unknown as {
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    cbChoiceSeat: boolean; cbTouchPast: boolean; cbCommitPhysics: boolean;
    dvLearnedMap: boolean; dvDeliveryValue: boolean;
    dvLearn: { books: DeliveryAccountBook[] } | null;
    forcedTouchPast: unknown;
  };
  const l3Dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => L3_DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  const dvDosed = mm.dvLearn !== null && mm.dvLearn.books.every((b) => DV_DOSE
    .every((c, z) => b.deliveries[z] === c.deliveries && b.punished[z] === c.punished));
  const beliefLive = ([0, 1] as const).every((s) => {
    const g = m.teams[s].effGenome as TacticalGenome;
    const b = g.dvLossBelief;
    return b !== undefined && b.length === DV_ZONE_COUNT
      && b.every((v, z) => Math.abs(v - DV_DOSE_BELIEF[z]) < 1e-12);
  });
  const genomeClean = ([0, 1] as const).every((s) => {
    const g = infoGenomeOf(m, s);
    return g.dvLossBelief === undefined && g.dvExposureWeight === undefined
      && g.cbCarryProneness === undefined;
  });
  const base = {
    theArmIsTheWorldSevenOfRecord: l3ArmedVersion(m) === L3_WORLD_VERSION
      && a4ArmedVersion(m) === L3_WORLD_VERSION,
    bothL3DoorsAreLiveInThisSim: mm.l3DefenceLearn && mm.l3DefenceVeto && mm.l3Defence !== null,
    theThreeCbDoorsAreLiveInThisSim:
      mm.cbChoiceSeat && mm.cbTouchPast && mm.cbCommitPhysics,
    theL3BooksCarryTheMaturedDose: l3Dosed,
    theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
    noDoseIsInTheFranchiseGenome: genomeClean,
    noArmingExistsAtConstruction: mm.forcedTouchPast === null,
  };
  if (arm === 'v7') {
    return {
      ...base,
      theDvDoorsAreShut: !mm.dvLearnedMap && !mm.dvDeliveryValue && mm.dvLearn === null,
      theDvBeliefIsAbsentOnThisArm: ([0, 1] as const)
        .every((s) => (m.teams[s].effGenome as TacticalGenome).dvLossBelief === undefined),
    };
  }
  return {
    ...base,
    theDvDoorsAreBothLiveInThisSim: mm.dvLearnedMap && mm.dvDeliveryValue && mm.dvLearn !== null,
    theDvBooksCarryTheMaturedDose: dvDosed,
    theLearnedMapIsLiveOnTheGenomeTheChooserReads: beliefLive,
  };
};

/* ========================================================================== */
/* §6 ⭐⭐ THE #269.2(iv) ARMING-LIFECYCLE INSTRUMENT — runs FIRST              */
/* ========================================================================== */
/**
 * THE STALENESS CLASS, stated exactly (CB-T2 §COMMANDER CORRECTIONS (iv)):
 * `Match.forcedTouchPast` is a SINGLE match-scoped slot. It is WRITTEN by `armTouchPast`
 * from the ONE call site in `PlayerBrain` (the CB-T2 choice seat), WITHDRAWN by
 * `clearTouchPastArming` at that same site when the body's next decision no longer wants the
 * knock, and CONSUMED (set back to null) by the ONE fork in `Match.stepBall`. The debt: a
 * world that arms OTHER seams beside it may take an EARLY RETURN above the seat's block, so
 * the withdrawal never runs and an aim survives its own tick — and a surviving aim can fire
 * into a LATER possession, i.e. STALE.
 *
 * ⭐ THE PROOF IS A TICK-BOUNDARY OBSERVATION, and it needs no engine change: the decision
 * loop and `stepBall` both run INSIDE `Match.step`, so in a clean lifecycle the slot is ALWAYS
 * null when `step` returns. Every non-null observation at a step boundary is a CARRY-OVER, and
 * every carry-over is measured for the three ways it could become a leak:
 *   · it survives a change of ball OWNER            (leaks across a possession)
 *   · it survives a change of PHASE                 (leaks across a restart / a goal)
 *   · it is still live at the WHISTLE               (would leak across a match, if the slot
 *                                                    were not itself per-Match)
 * plus the two structural facts asserted per match: the slot is null AT CONSTRUCTION (so no
 * state can enter a match) and null at the whistle (so none can leave one).
 */
interface Lifecycle {
  ticks: number;
  /** step boundaries at which the arming slot was non-null (the CARRY-OVER count). */
  carryOvers: number;
  /** carry-overs that survived a change of ball owner — the possession leak. */
  carryOverAcrossOwnerChange: number;
  /** carry-overs that survived a change of phase — the restart/goal leak. */
  carryOverAcrossPhaseChange: number;
  /** the longest life, in step boundaries, of any single arming. */
  maxArmingAgeTicks: number;
  /** the slot at the whistle (would be the cross-match leak, if it could exist). */
  armedAtWhistle: number;
  /** the slot at construction (would be an inherited arming). */
  armedAtConstruction: number;
  /** the engine's own ledger, for the non-vacuity read: the seat must have ARMED at all. */
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
/* §7 THE ORACLE — THE ENGINE'S OWN PASS MACHINERY (#256.2), GK-SPLIT (#286)   */
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

/** ONE option census at ONE moment. ⭐ #286: EVERY behind-ball rung is split GK / outfield. */
interface OptionCensus {
  mates: number;
  /* --- L1 POSITION (the Q07 ±2 m band on the ball line) --- */
  behind: number; lateral: number; ahead: number;
  /* --- the LADDER, every rung an ENGINE verdict, GK-SPLIT at every rung (#286.1's DEBT) --- */
  behindFlight: number; behindRace: number; behindUncut: number;
  behindGk: number; behindFlightGk: number; behindRaceGk: number; behindUncutGk: number;
  behindUncutInWindow: number;
  lateralUncut: number; aheadUncut: number;
  raceAll: number; uncutAll: number;
  /* --- receipts --- */
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
 * THE CENSUS AT ONE MOMENT — BU-C0's ladder VERBATIM in definition (so every face is
 * commensurable with the committed census), with the GK split added at EVERY behind-ball rung.
 *
 * L1 POSITION: `Δ = team.localX(mate.x) − team.localX(ball.x)`; BEHIND = `Δ <= −2`, LATERAL =
 *    `|Δ| < 2`, AHEAD = `Δ >= +2`. The ±2 m band is Q07's OWN, EXTRACTED from `src/**`.
 * L2 THE BALL GETS THERE: `evaluatePassAffordance(...).flight.reachable`.
 * L3 THE RECEIVER WINS THE RACE: `arrivalMargin > 0` — a SIGN test on the engine's quantity.
 * L4 THE CORRIDOR IS NOT CUT: no `evaluatePassCorridorInterception` fact with a non-null
 *    `earliestFeasiblePoint`.
 * L5 (reported beside): inside the engine's own 6–30 m pass-choice window.
 * ⭐ THE PUBLISHED "OPTION" IS L1 ∧ L2 ∧ L3 ∧ L4.
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
 * ONE match, ONE arm. `measure=false` walks the SAME world with the option oracle switched off
 * — the NON-PERTURBATION control (`gNonPerturbing`). The LIFECYCLE instrument is a pure read of
 * `Match` state at step boundaries and rides BOTH shapes (it cannot perturb anything).
 */
const walk = (seed: number, arm: ArmKind, measure = true): Row => {
  const m = matchOf(seed, arm);
  const armOk = Object.values(armConjuncts(m, arm)).every(Boolean);
  const mm = m as unknown as {
    forcedTouchPast: { gid: number; dir: { x: number; y: number } } | null;
    cbChoiceLedger: { armings: number; armingsCleared: number; seats: number };
    cbLedger?: { touchPasts?: number };
  };

  const life: Lifecycle = { ...EMPTY_LIFECYCLE };
  life.armedAtConstruction = mm.forcedTouchPast === null ? 0 : 1;

  const row: Row = {
    seed, signature: '', armOk, lifecycle: life,
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
/* §9 ⭐⭐ THE DOORS MATRIX AT THE FULL COMPOSITION — 128 CELLS, LIFECYCLE FIRST */
/* ========================================================================== */
/**
 * THE FULL COMPOSITION'S SEVEN DOORS, enumerated exhaustively (2^7 = 128 cells) on the
 * v7 SUBSTRATE (`a4MatchFlags(3)` — the census substrate the CB and L3 worlds are both built
 * on, CALLED not copied). Every pairwise flag interaction therefore appears in the matrix, and
 * so does every higher-order one.
 *
 *   C  cbCommitPhysics      T  cbTouchPast         S  cbChoiceSeat (+ the proneness dose)
 *   L  l3DefenceLearn (+ the matured L3 dose)      V  l3DefenceVeto
 *   M  dvLearnedMap (+ the matured DV dose)        D  dvDeliveryValue
 *
 * ⚠ TWO AXES CARRY THEIR OWN DOSE, DECLARED: `S` without a non-absent `cbCarryProneness`
 * cannot form a seat at all and `M` without a non-empty book serves no belief, so the matrix
 * would be measuring absence rather than composition. Each of those axes is therefore
 * "door + its own banked dose", exactly as the v7 entry composes them.
 */
interface DoorCell { C: boolean; T: boolean; S: boolean; L: boolean; V: boolean; M: boolean; D: boolean }
const DOOR_AXES = ['C', 'T', 'S', 'L', 'V', 'M', 'D'] as const;
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

/** ONE doors-matrix walk: the signature at the whistle + the full lifecycle read. NO oracle. */
const doorsWalk = (seed: number, c: DoorCell): { sig: string; life: Lifecycle } => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  const m = new Match({
    seed, teamA, teamB, ...a4MatchFlags(3),
    ...(c.C ? { cbCommitPhysics: true } : {}),
    ...(c.T ? { cbTouchPast: true } : {}),
    ...(c.S ? { cbChoiceSeat: true } : {}),
    ...(c.L ? { l3DefenceLearn: true } : {}),
    ...(c.V ? { l3DefenceVeto: true } : {}),
    ...(c.M ? { dvLearnedMap: true, dvLearnedBooks: dosedDvBooks() } : {}),
    ...(c.D ? { dvDeliveryValue: true } : {}),
  });
  if (c.S) for (const side of [0, 1] as const) setCbProneness(m, side, CB_WORLD_DOSE);
  if (c.L) {
    const led = (m as unknown as { l3Defence: { books: { note(g: number, p: boolean): void }[] } | null }).l3Defence;
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
banner(`  [bu-t0] ⭐ ORDER OF PROOF STEP 1 — the #269.2(iv) arming lifecycle over `
  + `${ALL_DOOR_CELLS.length} door cells × ${LIFECYCLE_SEEDS.length} seeds…`);
const doorSig: Record<number, Record<string, string>> = {};
const doorLife: Record<number, Record<string, Lifecycle>> = {};
for (const seed of LIFECYCLE_SEEDS) {
  doorSig[seed] = {}; doorLife[seed] = {};
  for (const c of ALL_DOOR_CELLS) {
    const r = doorsWalk(seed, c);
    doorSig[seed][doorKey(c)] = r.sig;
    doorLife[seed][doorKey(c)] = r.life;
  }
  banner(`  [bu-t0]   doors seed ${seed} — ${ALL_DOOR_CELLS.length} cells walked`);
}
const sigOf = (seed: number, c: DoorCell): string => doorSig[seed][doorKey(c)];

/**
 * ⭐⭐ THE LIFECYCLE VERDICT — and it is a DICHOTOMY, not one number.
 *
 * ⚠ RE-SPECIFIED MID-BUILD, AND DISCLOSED (the L3-T0 §DEV 1 precedent). The law as first coded
 * was "no arming survives its own tick in ANY cell". The exhaustive matrix FALSIFIED it, and
 * the falsification is worth more than the law was: the carry-overs live ENTIRELY in the cells
 * where the CHOICE door is open and the CAPABILITY door is SHUT (`S ∧ ¬T`). There the arming
 * has NO CONSUMER — `Match.stepBall`'s fork requires `cbTouchPast` — so the slot simply sits
 * until the same body's next decision withdraws it, and it can sit across possessions, across
 * restarts and to the whistle.
 *
 * ⭐ THE POINT OF THE CLASS IS A STALE AIM THAT **FIRES**. So the honest law is the dichotomy,
 * and BOTH halves are proven:
 *   (a) IN EVERY CELL WHERE AN AIM CAN FIRE (`T`), no arming survives its own tick at all —
 *       so a stale aim is not merely unobserved, it never exists;
 *   (b) IN EVERY CELL WHERE ARMINGS PERSIST (`S ∧ ¬T`), ZERO knocks fire, by the firing fork's
 *       own conjunct — the persistence is inert bookkeeping with no behavioural surface.
 * `S ∧ ¬T` is also a configuration NO armed world constructs (the v7 entry opens both doors,
 * and CB-T2 §ARMING #4 says the choice buys the choice and the capability buys the firing) —
 * but it is REPORTED here rather than excluded, because an exhaustive matrix that quietly
 * dropped its own inconvenient cells would be worthless.
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
        /** an arming that persists where a knock COULD fire would be the real defect. */
        if (l.touchPasts > 0 || l.armedAtConstruction > 0) {
          offenders.push(`${seed}:${doorKey(c)}(FIRED-WITH-THE-DOOR-SHUT)`);
        }
      }
    }
  }
  return { total, firing, inert, cells, firingCells, inertCells, offenders, persistingCells };
})();

/**
 * ⭐⭐ THE STOP RULE (#286.3's order of proof): a staleness defect is NOT something this stage
 * fixes — a fix is a `src` change needing its own authorization. The probe REFUSES TO RUN.
 */
if (lifecycleMatrix.offenders.length > 0) {
  banner('BU-T0 STOPS FOR ADJUDICATION — the #269.2(iv) ARMING-LIFECYCLE class BIT:');
  banner(`  in FIRING cells — carry-overs ${lifecycleMatrix.firing.carryOvers} · across an owner `
    + `change ${lifecycleMatrix.firing.carryOverAcrossOwnerChange} · across a phase change `
    + `${lifecycleMatrix.firing.carryOverAcrossPhaseChange} · armed at the whistle `
    + `${lifecycleMatrix.firing.armedAtWhistle} · armed at construction `
    + `${lifecycleMatrix.firing.armedAtConstruction} · longest arming life `
    + `${lifecycleMatrix.firing.maxArmingAgeTicks} ticks`);
  banner(`  in NON-FIRING cells — knocks fired ${lifecycleMatrix.inert.touchPasts}`);
  banner(`  offending cells (seed:CTSLVMD): ${lifecycleMatrix.offenders.slice(0, 40).join(' ')}`);
  banner('  A FIX IS A src CHANGE AND NEEDS ITS OWN AUTHORIZATION. Nothing was written.');
  process.exit(4);
}
banner(`  [bu-t0] ⭐ lifecycle: ${lifecycleMatrix.firingCells} FIRING cells CLEAN `
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
    dvLearnDoorInertWithoutTheConsumer: [],
    dvConsumeDoorInertWithoutTheLearnedMap: [],
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
      claim('dvLearnDoorInertWithoutTheConsumer', seed, c, 'M', !c.D);
      claim('dvConsumeDoorInertWithoutTheLearnedMap', seed, c, 'D', !c.M);
    }
  }
  return { fail, checked, allHold: Object.values(fail).every((v) => v.length === 0) };
})();

/** THE LIVENESS CLAIMS — SETWISE (a door that can never move the world is a dead door). */
const doorsLive = (() => {
  const hits: Record<string, number> = {
    theCommitPhysicsDoorMovesTheWorld: 0,
    theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen: 0,
    theL3VetoMovesTheWorldOnADosedBook: 0,
    theDvPairMovesTheWorld: 0,
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
      if (!c.D && c.M && sigOf(seed, withAxis(c, 'D', true)) !== sigOf(seed, c)) {
        hits.theDvPairMovesTheWorld += 1;
      }
    }
  }
  return hits;
})();

/**
 * ⭐ THE STRUCTURAL HALF of the lifecycle proof — the call-site census, machine-read from
 * `src/**` so it cannot rot, plus the NON-VACUITY fact that makes the empirical zero mean
 * something: THE EARLY-RETURN EXPOSURE IS REAL IN THIS COMPOSITION.
 *
 * The staleness class exists because a body's decision can RETURN before the CB seat's
 * arm/withdraw block. In v7 two of those early returns are ARMED (`o1PassWindup` and
 * `c7Windup` are both in the v7 substrate's own flag set), so the withdrawal genuinely can be
 * skipped — the class is EXPOSED here, not vacuous. The two seams #269.2(iv) NAMED (`o2Look`,
 * `ekHoldVeto`) are NOT armed in this composition, and this stage therefore discharges the
 * debt for CB+L3+DV ONLY; their own compositions remain undischarged.
 */
const lifecycleStructure = (() => {
  const count = (src: string, re: RegExp): number => (src.match(re) ?? []).length;
  const probe = matchOf(GWORLD_SEED, 'v7dv');
  const pm = probe as unknown as {
    o2Look: boolean; ekHoldVeto: boolean; o1PassWindup: boolean; c7Windup: boolean;
    whetherEye: unknown; forcedHold: unknown; c5Hold: boolean;
  };
  return {
    armCallSites: count(BRAIN_SRC, /match\.armTouchPast\(/g),
    clearCallSites: count(BRAIN_SRC, /match\.clearTouchPastArming\(/g),
    slotClearedInSrc: count(MATCH_SRC, /this\.forcedTouchPast = null;/g),
    fireSites: count(MATCH_SRC, /mech\.performTouchPast\(/g),
    armSiteLine: ARM_SITE_LINE,
    clearSiteLine: CLEAR_SITE_LINE,
    fireSiteLine: FIRE_SITE_LINE,
    clearImplLine: CLEAR_IMPL_LINE,
    o2LookArmed: pm.o2Look === true,
    ekHoldVetoArmed: pm.ekHoldVeto === true,
    o1WindupArmed: pm.o1PassWindup === true,
    c7WindupArmed: pm.c7Windup === true,
    whetherEyeArmed: pm.whetherEye !== null,
    forcedHoldArmed: pm.forcedHold !== null,
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
  const rows: Record<ArmKind, Row[]> = { v7: [], v7dv: [] };
  for (const arm of ARMS) {
    for (let i = 0; i < N_RUN; i++) rows[arm].push(walk(BASE_RUN + i, arm));
    banner(`  [bu-t0] ${arm} — ${N_RUN} walks done`);
  }
  return { rows };
};

/* ========================================================================== */
/* §11 THE FACES — every one a RATIO OF SUMS over the stored per-seed rows      */
/* ========================================================================== */
type Face = { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string };
const perMatch = (): number => 1;
const outfield = (c: OptionCensus, k: 'behind' | 'behindFlight' | 'behindRace' | 'behindUncut'): number => {
  const gk = k === 'behind' ? c.behindGk : k === 'behindFlight' ? c.behindFlightGk
    : k === 'behindRace' ? c.behindRaceGk : c.behindUncutGk;
  return c[k] - gk;
};
const FACES: Record<string, Face> = {
  /* ---- THE SUPPLY FACE (BU-C0's headline, commensurable) ---- */
  behindBallOptionsPerReception: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.receptions,
    unit: 'options / reception',
    what: '⭐⭐ THE SUPPLY HEADLINE — behind-the-ball team-mates the ENGINE\'S OWN machinery '
      + 'calls a live option (L1 ∧ L2 ∧ L3 ∧ L4), per reception. BU-C0\'s frozen definition.',
  },
  behindBallOptionsPerPressedReception: {
    num: (r) => r.atPressedReceptions.behindUncut, den: (r) => r.receptionsPressed,
    unit: 'options / pressed reception', what: '⭐ the same count at PRESSED receptions',
  },
  behindBallOptionsPerPressedCarrierMoment: {
    num: (r) => r.atPressedCarrier.behindUncut, den: (r) => r.carrierSamplesPressed,
    unit: 'options / pressed-carrier moment',
    what: 'the same count at PRESSED-CARRIER moments (sampled every 12 ticks)',
  },
  shareReceptionsWithNoBehindOption: {
    num: (r) => r.behindHist[0], den: (r) => r.receptions,
    unit: 'share of receptions', what: '⭐ receptions offering ZERO behind-ball option',
  },
  shareReceptionsWithTwoOrMore: {
    num: (r) => r.receptions - r.behindHist[0] - r.behindHist[1], den: (r) => r.receptions,
    unit: 'share of receptions', what: 'the #246 BAND — receptions offering 2 or more',
  },
  /* ---- ⭐ #286's NEW CANON: THE GK-SPLIT LADDER (the #286.1 DEBT, discharged) ---- */
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
    what: '⭐⭐ L4 OUTFIELD — THE OUTFIELD SUPPLY (the #286.1 debt\'s own number: the '
      + 'behind-ball option that is NOT the keeper)',
  },
  ladderL4GkPerReception: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.receptions,
    unit: 'options / reception', what: 'L4 GK — the keeper ball',
  },
  outfieldEndToEndConversion: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'), den: (r) => outfield(r.atReceptions, 'behind'),
    unit: 'share of outfield behind-ball bodies',
    what: '⭐⭐ THE OUTFIELD LADDER\'S END-TO-END CONVERSION — L4/L1, keeper removed',
  },
  gkEndToEndConversion: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindGk,
    unit: 'share of GK behind-ball bodies', what: 'the keeper\'s own end-to-end conversion',
  },
  outfieldCorridorSurvivalRate: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'), den: (r) => outfield(r.atReceptions, 'behindRace'),
    unit: 'share of race-winning outfield options',
    what: '⭐⭐ THE RUNG THE SLICE AIMS AT — of the OUTFIELD behind-ball balls that win the '
      + 'race, how many survive the corridor',
  },
  gkCorridorSurvivalRate: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindRaceGk,
    unit: 'share of race-winning GK options', what: 'the same rung for the keeper ball',
  },
  keeperShareOfSurvivingOptions: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindUncut,
    unit: 'share of surviving behind-ball options',
    what: '⭐ the KEEPER SHARE (BU-C0 measured 54.20 % armed)',
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
  /* ---- ⭐ THE USAGE FACES (the pre-registered directions) ---- */
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
    unit: 'share of completed passes',
    what: '⭐⭐ THE PRE-REGISTERED USAGE DIRECTION — BACKWARD completed-pass share',
  },
  lateralShareOfCompletions: {
    num: (r) => r.completedLateralMine, den: (r) => r.completed,
    unit: 'share of completed passes',
    what: '⭐⭐ THE PRE-REGISTERED USAGE DIRECTION — LATERAL completed-pass share',
  },
  circulationShareOfCompletions: {
    num: (r) => r.completedBackwardMine + r.completedLateralMine, den: (r) => r.completed,
    unit: 'share of completed passes',
    what: '⭐⭐ BACKWARD + LATERAL together — the CIRCULATION ball, the contract\'s own object',
  },
  passCompletionRate: {
    num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
    unit: 'share', what: '⭐ Q06 — the engine\'s own completion rate (a pre-registered direction)',
  },
  attemptsPerMatch: {
    num: (r) => r.attempts, den: perMatch, unit: 'attributed attempts / match',
    what: 'the direction mix\'s denominator, per match',
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
      + '§CORRECTIONS 3: the veto MOVES mass between tackled and intercepted, so the '
      + 'aggregate is the honest cross-arm quantity)',
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
    num: (r) => r.receptions, den: perMatch, unit: 'receptions / match', what: 'context',
  },
  openSpellsPerMatch: {
    num: (r) => r.openSpells, den: perMatch, unit: 'open-play spells / match', what: 'context',
  },
  goalsPerMatch: {
    num: (r) => r.goals, den: perMatch, unit: 'goals / match', what: 'the football guard, REPORTED',
  },
};
const FACE_KEYS = Object.keys(FACES);

/* ---- the estimator: PAIRED CLUSTER BOOTSTRAP over match seeds ---- */
let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
interface FaceRow {
  face: string; unit: string; what: string;
  arms: Record<string, { point: number; num: number; den: number; ci95: [number, number] }>;
  contrast: { delta: number; ci95: [number, number]; relative: number };
}
const scoreFaces = (b: Battery): FaceRow[] => {
  const K = b.rows.v7.length;
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
          : [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
      };
    }
    /** ⭐ PAIRED: the same resample-index matrix draws BOTH arms, so the contrast is the
     *  same resampled worlds and the pairing is inside the interval. */
    const vals: number[] = [];
    for (const idx of draws) {
      let nA = 0; let dA = 0; let nB = 0; let dB = 0;
      for (const i of idx) {
        nA += nums.v7dv[i]; dA += dens.v7dv[i];
        nB += nums.v7[i]; dB += dens.v7[i];
      }
      vals.push(ratio(nA, dA) - ratio(nB, dB));
    }
    const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
    const delta = point.v7dv - point.v7;
    out.push({
      face: key, unit: f.unit, what: f.what, arms,
      contrast: {
        delta,
        ci95: s.length === 0 ? [Number.NaN, Number.NaN]
          : [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
        relative: point.v7 === 0 ? Number.NaN : delta / point.v7,
      },
    });
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
  seed: r.seed, sig: r.signature, armOk: r.armOk, life: r.lifecycle,
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

banner(`  [bu-t0] ⭐ ORDER OF PROOF STEP 3 — the battery: mode=${MODE} N=${N_RUN} seeds `
  + `× ${ARMS.length} arms × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [bu-t0] G-DET second run…');
const coreB = runCore();
const digestB = coreDigest(coreB);
const C = coreA;

/* ---- the NON-PERTURBATION control: the same worlds, the option oracle OFF ---- */
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
const v7Probe = matchOf(GWORLD_SEED, 'v7');
const dvProbe = matchOf(GWORLD_SEED, 'v7dv');
const worldSeedOk = l3ArmedVersion(v7Probe) === L3_WORLD_VERSION
  && l3ArmedVersion(dvProbe) === L3_WORLD_VERSION
  && (v7Probe as unknown as { dvLearn: unknown }).dvLearn === null
  && (dvProbe as unknown as { dvLearn: unknown }).dvLearn !== null;

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
  return { spells, classified, open, openClassified, closes: spells === classified && open === openClassified };
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
    ? [{ name: 'BU-T0 battery', range: [BATTERY_BASE, BATTERY_BASE + N_RUN - 1] as [number, number] }]
    : []),
  { name: 'BU-T0 smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 19] },
  { name: 'BU-T0 guard/preflight block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: 'BU-T0 lifecycle/doors block', range: [LIFECYCLE_BASE, LIFECYCLE_BASE + LIFECYCLE_SEEDS_FULL - 1] },
  { name: 'BU-T0 world-identity seed', range: [GWORLD_SEED, GWORLD_SEED] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
const allSeedsInBand = ARMS.every((a) => rowsOf(a)
  .every((r) => r.seed >= BASE_RUN && r.seed <= BASE_RUN + N_RUN - 1));
const pairedSameSeeds = rowsOf('v7').map((r) => r.seed).join(',')
  === rowsOf('v7dv').map((r) => r.seed).join(',');

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
const registerGate = <I>(spec: GateSpec<I>): void => { REGISTRY.push(spec as unknown as GateSpec<never>); };
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

/* ---- 2 xSrcUntouched — ⭐ THE #286-CORRECTED FORM: WORKTREE vs HEAD, both conjuncts ---- */
/** ⚠ #286.5, THE DEFECT CLASS NAMED: "AN INHERITED FIX ANNOUNCED IS NOT A FIX RIDDEN".
 *  BU-C0's first conjunct ran `git diff --stat -- src` (worktree vs INDEX) while its header
 *  claimed the #273.3 worktree-vs-HEAD form. This is the corrected implementation, ridden. */
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
registerGate<{ ok: number; total: number; probe: boolean; arms: number; paired: boolean }>({
  name: 'gArms',
  fn: (i) => ({
    everyWalkedMatchCarriesItsArmLive: i.ok === i.total,
    theIdentitySeedSeparatesTheTwoArms: i.probe,
    twoArmsWalked: i.arms === 2,
    theArmsWalkTheSameSeeds: i.paired,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: { ok: armOkCount, total: armTotal, probe: worldSeedOk, arms: ARMS.length, paired: pairedSameSeeds },
  mutants: [
    { conjunct: 'everyWalkedMatchCarriesItsArmLive', name: 'a walk was not its arm', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theIdentitySeedSeparatesTheTwoArms', name: 'the two arms were not distinguishable', mutate: (i) => ({ ...i, probe: false }) },
    { conjunct: 'twoArmsWalked', name: 'an arm was dropped', mutate: (i) => ({ ...i, arms: 1 }) },
    { conjunct: 'theArmsWalkTheSameSeeds', name: 'the arms were not paired', mutate: (i) => ({ ...i, paired: false }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 4 gDose — BOTH matured doses come from COMMITTED artifacts ---- */
const l3DoseLabels = sum(L3_DOSE.map((c) => c.lunges));
const dvDoseLabels = sum(DV_DOSE.map((c) => c.deliveries));
registerGate<{
  l3sha: string; l3labels: number; l3groups: number;
  dvsha: string; dvgdet: string; dvlabels: number; dvzones: number; ordered: boolean;
}>({
  name: 'gDose',
  fn: (i) => ({
    theL3DoseComesFromTheCommittedExam: i.l3sha === L3_T1_SHA,
    theL3DoseIsNonEmpty: i.l3labels > 0,
    theL3DoseHasBothArrivalGroups: i.l3groups === 2,
    theDvDoseComesFromTheCommittedExam: i.dvsha === DVT1_SHA,
    theDvDosePortableAnchorMatches: i.dvgdet === DVT1_GDET,
    theDvDoseIsNonEmpty: i.dvlabels > 0,
    theDvDoseCoversEveryBeliefZone: i.dvzones === DV_ZONE_COUNT,
    theDvDoseCarriesTheExamsOwnOrdering: i.ordered,
  }),
  input: {
    l3sha: String((T1_FILE as { resultSha256?: string }).resultSha256 ?? ''),
    l3labels: l3DoseLabels, l3groups: L3_DOSE.length,
    dvsha: String((DVT1_FILE as { resultSha256?: string }).resultSha256 ?? ''),
    dvgdet: String(((DVT1_FILE as { result?: { gDet?: { digestA?: string } } })
      .result?.gDet?.digestA) ?? ''),
    dvlabels: dvDoseLabels,
    dvzones: DV_DOSE.filter((c) => c.deliveries > 0).length,
    /** the exam's own scored SHAPE — own > middle > final — survives the pooling. */
    ordered: DV_DOSE_BELIEF[0] > DV_DOSE_BELIEF[1] && DV_DOSE_BELIEF[1] > DV_DOSE_BELIEF[2],
  },
  mutants: [
    { conjunct: 'theL3DoseComesFromTheCommittedExam', name: 'the L3 artifact was swapped', mutate: (i) => ({ ...i, l3sha: 'deadbeef' }) },
    { conjunct: 'theL3DoseIsNonEmpty', name: 'the L3 dose was empty', mutate: (i) => ({ ...i, l3labels: 0 }) },
    { conjunct: 'theL3DoseHasBothArrivalGroups', name: 'an L3 group went missing', mutate: (i) => ({ ...i, l3groups: 1 }) },
    { conjunct: 'theDvDoseComesFromTheCommittedExam', name: 'the DV artifact was swapped', mutate: (i) => ({ ...i, dvsha: 'deadbeef' }) },
    { conjunct: 'theDvDosePortableAnchorMatches', name: 'the DV exam\'s portable G-DET anchor moved', mutate: (i) => ({ ...i, dvgdet: 'deadbeef' }) },
    { conjunct: 'theDvDoseIsNonEmpty', name: 'the DV dose was empty', mutate: (i) => ({ ...i, dvlabels: 0 }) },
    { conjunct: 'theDvDoseCoversEveryBeliefZone', name: 'a belief zone had no evidence', mutate: (i) => ({ ...i, dvzones: 1 }) },
    { conjunct: 'theDvDoseCarriesTheExamsOwnOrdering', name: 'the pooled map lost the exam\'s shape', mutate: (i) => ({ ...i, ordered: false }) },
  ],
});

/* ---- 5 ⭐⭐ gLifecycle — THE #269.2(iv) DEBT, DISCHARGED AT THIS COMPOSITION ---- */
registerGate<{
  cells: number; firingCells: number; expFiring: number; carry: number; owner: number; phase: number;
  whistle: number; ctor: number;
  age: number; armings: number; inertFired: number; inertCtor: number;
  battCarry: number; battWhistle: number; battCtor: number;
  armSites: number; clearSites: number; slotClears: number; fireSites: number;
  o2: boolean; ek: boolean; o1: boolean; c7: boolean;
}>({
  name: 'gLifecycle',
  fn: (i) => ({
    /* --- (a) EVERY CELL WHERE AN AIM CAN FIRE: no arming survives its own tick --- */
    noArmingSurvivesItsOwnTickWhereAnAimCanFire: i.carry === 0,
    noArmingSurvivesAChangeOfPossession: i.owner === 0,
    noArmingSurvivesAChangeOfPhase: i.phase === 0,
    noArmingIsLiveAtTheWhistle: i.whistle === 0,
    noArmingExistsAtConstruction: i.ctor === 0 && i.inertCtor === 0,
    theLongestArmingLifeIsZeroTickBoundaries: i.age === 0,
    /* --- (b) WHERE ARMINGS PERSIST, NOTHING CAN CONSUME THEM --- */
    noKnockEverFiresWithTheCapabilityDoorShut: i.inertFired === 0,
    theFiringHalfOfTheMatrixIsHalfOfIt: i.firingCells === i.expFiring,
    /* --- the same proof re-taken on the BATTERY population --- */
    theBatteryPopulationCarriesNoArmingAcrossATick: i.battCarry === 0,
    theBatteryPopulationIsCleanAtBothEnds: i.battWhistle === 0 && i.battCtor === 0,
    /* --- NON-VACUITY: the seat actually armed, so the zero is not a zero of absence --- */
    theSeatActuallyArmedInThisMatrix: i.armings > 0,
    /* --- the STRUCTURAL half, machine-read from src/** --- */
    theArmingHasExactlyOneWriteSiteInSrc: i.armSites === 1,
    theWithdrawalHasExactlyOneCallSiteInSrc: i.clearSites === 1,
    theSlotIsClearedInExactlyTwoPlacesTheFireAndTheWithdrawal: i.slotClears === 2,
    theFiringForkIsTheOnlyConsumer: i.fireSites === 1,
    /* --- the SCOPE of the discharge, stated as a conjunct --- */
    theTwoSeamsTheDebtNamedAreNotArmedHere: !i.o2 && !i.ek,
    theEarlyReturnExposureIsRealInThisComposition: i.o1 && i.c7,
    theMatrixIsTheFullPowerSet: i.cells === (1 << DOOR_AXES.length) * LIFECYCLE_SEEDS.length,
  }),
  input: {
    cells: lifecycleMatrix.cells,
    firingCells: lifecycleMatrix.firingCells,
    expFiring: (1 << (DOOR_AXES.length - 1)) * LIFECYCLE_SEEDS.length,
    carry: lifecycleMatrix.firing.carryOvers,
    owner: lifecycleMatrix.firing.carryOverAcrossOwnerChange,
    phase: lifecycleMatrix.firing.carryOverAcrossPhaseChange,
    whistle: lifecycleMatrix.firing.armedAtWhistle,
    ctor: lifecycleMatrix.firing.armedAtConstruction,
    age: lifecycleMatrix.firing.maxArmingAgeTicks,
    armings: lifecycleMatrix.firing.armings,
    inertFired: lifecycleMatrix.inert.touchPasts,
    inertCtor: lifecycleMatrix.inert.armedAtConstruction,
    battCarry: batteryLifecycle.carryOvers,
    battWhistle: batteryLifecycle.armedAtWhistle,
    battCtor: batteryLifecycle.armedAtConstruction,
    armSites: lifecycleStructure.armCallSites,
    clearSites: lifecycleStructure.clearCallSites,
    slotClears: lifecycleStructure.slotClearedInSrc,
    fireSites: lifecycleStructure.fireSites,
    o2: lifecycleStructure.o2LookArmed, ek: lifecycleStructure.ekHoldVetoArmed,
    o1: lifecycleStructure.o1WindupArmed, c7: lifecycleStructure.c7WindupArmed,
  },
  mutants: [
    { conjunct: 'noArmingSurvivesItsOwnTickWhereAnAimCanFire', name: 'an arming survived a tick where it could fire', mutate: (i) => ({ ...i, carry: 1 }) },
    { conjunct: 'noArmingSurvivesAChangeOfPossession', name: 'an arming crossed a possession', mutate: (i) => ({ ...i, owner: 1 }) },
    { conjunct: 'noArmingSurvivesAChangeOfPhase', name: 'an arming crossed a restart', mutate: (i) => ({ ...i, phase: 1 }) },
    { conjunct: 'noArmingIsLiveAtTheWhistle', name: 'an arming was live at full time', mutate: (i) => ({ ...i, whistle: 1 }) },
    { conjunct: 'noArmingExistsAtConstruction', name: 'a match inherited an arming', mutate: (i) => ({ ...i, ctor: 1 }) },
    { conjunct: 'theLongestArmingLifeIsZeroTickBoundaries', name: 'an arming lived a tick', mutate: (i) => ({ ...i, age: 1 }) },
    { conjunct: 'noKnockEverFiresWithTheCapabilityDoorShut', name: 'an unconsumed arming found a consumer', mutate: (i) => ({ ...i, inertFired: 1 }) },
    { conjunct: 'theFiringHalfOfTheMatrixIsHalfOfIt', name: 'the firing/non-firing split was mis-cut', mutate: (i) => ({ ...i, expFiring: i.expFiring + 1 }) },
    { conjunct: 'theBatteryPopulationCarriesNoArmingAcrossATick', name: 'the battery population carried one', mutate: (i) => ({ ...i, battCarry: 1 }) },
    { conjunct: 'theBatteryPopulationIsCleanAtBothEnds', name: 'the battery leaked at an end', mutate: (i) => ({ ...i, battWhistle: 1 }) },
    { conjunct: 'theSeatActuallyArmedInThisMatrix', name: 'the zero was a zero of absence', mutate: (i) => ({ ...i, armings: 0 }) },
    { conjunct: 'theArmingHasExactlyOneWriteSiteInSrc', name: 'a second arming site appeared', mutate: (i) => ({ ...i, armSites: 2 }) },
    { conjunct: 'theWithdrawalHasExactlyOneCallSiteInSrc', name: 'a second withdrawal site appeared', mutate: (i) => ({ ...i, clearSites: 2 }) },
    { conjunct: 'theSlotIsClearedInExactlyTwoPlacesTheFireAndTheWithdrawal', name: 'a third clear appeared', mutate: (i) => ({ ...i, slotClears: 3 }) },
    { conjunct: 'theFiringForkIsTheOnlyConsumer', name: 'a second firing fork appeared', mutate: (i) => ({ ...i, fireSites: 2 }) },
    { conjunct: 'theTwoSeamsTheDebtNamedAreNotArmedHere', name: 'o2Look was armed after all', mutate: (i) => ({ ...i, o2: true }) },
    { conjunct: 'theEarlyReturnExposureIsRealInThisComposition', name: 'the wind-up locks were off (the proof would be vacuous)', mutate: (i) => ({ ...i, o1: false }) },
    { conjunct: 'theMatrixIsTheFullPowerSet', name: 'the doors matrix was not exhaustive', mutate: (i) => ({ ...i, cells: 1 }) },
  ],
});

/* ---- 6 ⭐⭐ gDoors — the composition's IDENTITY and LIVENESS laws ---- */
registerGate<{
  inertHold: boolean; checked: number;
  liveC: number; liveS: number; liveV: number; liveD: number; cells: number;
}>({
  name: 'gDoors',
  fn: (i) => ({
    everyInertnessLawHoldsOnEveryCellAndEverySeed: i.inertHold,
    theInertnessLawsWereActuallyExercised: i.checked > 0,
    theCommitPhysicsDoorIsNotDead: i.liveC > 0,
    theChoiceSeatIsNotDead: i.liveS > 0,
    theL3VetoIsNotDead: i.liveV > 0,
    theDvPairIsNotDead: i.liveD > 0,
    theMatrixEnumeratesEveryPairwiseInteraction: i.cells === (1 << DOOR_AXES.length),
  }),
  input: {
    inertHold: doorsAlways.allHold,
    checked: sum(Object.values(doorsAlways.checked)),
    liveC: doorsLive.theCommitPhysicsDoorMovesTheWorld,
    liveS: doorsLive.theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen,
    liveV: doorsLive.theL3VetoMovesTheWorldOnADosedBook,
    liveD: doorsLive.theDvPairMovesTheWorld,
    cells: ALL_DOOR_CELLS.length,
  },
  mutants: [
    { conjunct: 'everyInertnessLawHoldsOnEveryCellAndEverySeed', name: 'a dormant door moved the world', mutate: (i) => ({ ...i, inertHold: false }) },
    { conjunct: 'theInertnessLawsWereActuallyExercised', name: 'no inertness law ran', mutate: (i) => ({ ...i, checked: 0 }) },
    { conjunct: 'theCommitPhysicsDoorIsNotDead', name: 'the commit-physics door never moved anything', mutate: (i) => ({ ...i, liveC: 0 }) },
    { conjunct: 'theChoiceSeatIsNotDead', name: 'the choice seat never moved anything', mutate: (i) => ({ ...i, liveS: 0 }) },
    { conjunct: 'theL3VetoIsNotDead', name: 'the veto never moved anything', mutate: (i) => ({ ...i, liveV: 0 }) },
    { conjunct: 'theDvPairIsNotDead', name: '⭐ THE SLICE ITSELF NEVER MOVED THE WORLD', mutate: (i) => ({ ...i, liveD: 0 }) },
    { conjunct: 'theMatrixEnumeratesEveryPairwiseInteraction', name: 'the power set was truncated', mutate: (i) => ({ ...i, cells: 4 }) },
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
    { conjunct: 'theInstrumentedWalkIsTheQuietWalk', name: 'the oracle changed the world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
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

/* ---- 9 gQ07 ---- */
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

/* ---- 10 gSpells ---- */
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

/* ---- 11 gNonVacuity ---- */
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

/* ---- 12 gFaces ---- */
registerGate<{ checked: number; bad: number; keys: number }>({
  name: 'gFaces',
  fn: (i) => ({
    everyPublishedFaceRederivesFromTheStoredCells: i.bad === 0,
    everyFrozenFaceIsPublished: i.keys === FACE_KEYS.length,
    nonVacuousFaceCount: i.checked > 0,
  }),
  input: { checked: faceRederivation.checked, bad: faceRederivation.bad, keys: C.faces.length },
  mutants: [
    { conjunct: 'everyPublishedFaceRederivesFromTheStoredCells', name: 'a face did not re-derive', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'everyFrozenFaceIsPublished', name: 'a face went missing', mutate: (i) => ({ ...i, keys: i.keys - 1 }) },
    { conjunct: 'nonVacuousFaceCount', name: 'nothing was re-derived', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 13 gClock ---- */
const clockOk = allRows().every((r) => r.ticks > 0 && r.simSeconds > 0);
registerGate<{
  durationOk: boolean; displayOk: boolean; mappingOk: boolean; walks: boolean;
}>({
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

/* ---- 14 gSeed ---- */
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

/* ---- 15 gStats ---- */
const minGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
registerGate<{ base: number; gap: number; resamples: number }>({
  name: 'gStats',
  fn: (i) => ({
    theBaseIsTheDispatchedFloor: i.base === 111_800,
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

/* ---- 16 gEnvClean ---- */
registerGate<{ rogue: number; doors: number; preflight: boolean; out: string }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnVariable: i.rogue === 0,
    noEngineDoorIsSet: i.doors === 0,
    aPreflightNeverWritesACanonicalPath: !i.preflight || !isCanonicalPath(i.out),
  }),
  input: { rogue: rogueOwn.length, doors: rogueEngine.length, preflight: IS_PREFLIGHT, out: OUT_PATH },
  mutants: [
    { conjunct: 'noRogueOwnVariable', name: 'a rogue BUT0_* var was accepted', mutate: (i) => ({ ...i, rogue: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote the canonical artifact', mutate: (i) => ({ ...i, preflight: true, out: OUT_BY_MODE.full }) },
  ],
});

/* ---- 17 gHashEnvelope ---- */
const envelopeInput = { crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[] };
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

/* ---- 18 gMutants ---- */
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
  banner('BU-T0 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
const pubFace = (f: FaceRow): Record<string, unknown> => ({
  face: f.face, unit: f.unit, what: f.what,
  arms: Object.fromEntries(Object.entries(f.arms).map(([k, v]) => [k, {
    point: v.den === 0 ? 'UNMEASURED' : round(v.point), num: v.num, den: v.den,
    ci95: v.den === 0 ? 'UNMEASURED' : v.ci95.map((x) => round(x)),
  }])),
  contrast: {
    delta: round(f.contrast.delta), ci95: f.contrast.ci95.map((x) => round(x)),
    relative: round(f.contrast.relative),
    resolved: (f.contrast.ci95[0] > 0 && f.contrast.ci95[1] > 0)
      || (f.contrast.ci95[0] < 0 && f.contrast.ci95[1] < 0),
  },
});

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'BU-T0 — THE DV LEARNED RISK MAPS IN THE v7 COMPOSITION',
  doc: 'docs/world-model/BU-T0-DV-COMPOSITION.md',
  contract: 'docs/world-model/BU-BUILDUP-CONTRACT.md §2 M-BU.1–4 / §3, bound by #285.1; '
    + 'slice order bound by #286.3',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'does arming the BANKED DV learned risk maps (#259) inside the v7 world (CB + the '
      + 'learning defence at the matured dose) move the CIRCULATION faces — supply, usage, '
      + 'completion, the terminal mix? ⭐ THE LABELLED HYPOTHESIS IS PRE-WRITTEN (#286.3): DV '
      + 'prices the destination ZONE, not the LANE; if no usage/supply face moves resolvedly, '
      + 'the verdict is "zone-grain knowledge cannot price lane-grain risk" — a REAL result that '
      + 'routes to the commander\'s menu, NEVER to a weight nudge (M-BU.3).',
    arms: {
      v7: 'THE BASE — `new Match({...a4MatchFlags(7)})` + `armA4World(m, null, 7, '
        + 'poolT1DoseCells(L3-T1))`: the CB layer + l3DefenceLearn + l3DefenceVeto at the '
        + 'SHIPPED entry\'s own pooled matured L3 dose.',
      v7dv: '⭐ THE SLICE — THE SAME WORLD plus `dvLearnedMap` + `dvDeliveryValue`, the two '
        + 'delivery account books DOSED (through the book\'s own `note()`) with the committed '
        + 'DV-T2-T1 exam\'s MATURED cells, its learnConsume arm\'s final checkpoint POOLED over '
        + 'all 40 books. The exposure weight is NOT armed (it is not learned — contract '
        + '§M-DV2.4), so the ONLY live limb is the LEARNED LOSS-COST BELIEF.',
    },
    orderOfProof: [
      '1. ⭐ THE #269.2(iv) ARMING-LIFECYCLE PROOF at the FULL CB+L3+DV composition (the '
        + 'clearTouchPastArming staleness class) — 128 door cells × the lifecycle seeds, BEFORE '
        + 'the battery; a defect REFUSES THE RUN (exit 4) for adjudication.',
      '2. DORMANCY — `src/**` byte-untouched, `xSrcUntouched` in the #286-CORRECTED form '
        + '(WORKTREE vs HEAD: `git diff --stat HEAD -- src` AND `git status --porcelain -- src`).',
      '3. THE BATTERY.',
    ],
    doorsMatrix: {
      axes: DOOR_AXES,
      legend: 'C cbCommitPhysics · T cbTouchPast · S cbChoiceSeat(+the proneness dose) · '
        + 'L l3DefenceLearn(+the matured L3 dose) · V l3DefenceVeto · '
        + 'M dvLearnedMap(+the matured DV dose) · D dvDeliveryValue',
      cells: ALL_DOOR_CELLS.length,
      substrate: 'a4MatchFlags(3) — the census substrate BOTH the CB and L3 worlds are built '
        + 'on, CALLED not copied',
      inertnessLaws: [
        'cbTouchPast is INERT without the choice seat (nothing can write the arming slot)',
        'l3DefenceLearn is INERT without the veto (the book fills, nothing reads it)',
        'l3DefenceVeto is INERT without the learning door (there is no book to read)',
        'dvLearnedMap is INERT without dvDeliveryValue (the book fills, nothing reads it)',
        'dvDeliveryValue is INERT without dvLearnedMap (the belief gene stays absent ⇒ no seat)',
      ],
      livenessLaws: [
        'cbCommitPhysics moves the world',
        'the choice seat moves the world when its capability door is open',
        'the L3 veto moves the world on a dosed book',
        '⭐ the DV pair moves the world (if it did not, the slice would be a dead door)',
      ],
    },
    stalenessClass: {
      what: '`Match.forcedTouchPast` is a SINGLE match-scoped slot: WRITTEN by armTouchPast from '
        + 'ONE call site in PlayerBrain, WITHDRAWN by clearTouchPastArming at that same site, '
        + 'CONSUMED by ONE fork in Match.stepBall. The debt (#269.2(iv)): a world arming other '
        + 'seams beside it may take an EARLY RETURN above the seat\'s block, so the withdrawal '
        + 'never runs and an aim survives its own tick — and a surviving aim can fire into a '
        + 'LATER possession.',
      howItIsProven: 'the decision loop and stepBall both run INSIDE Match.step, so in a clean '
        + 'lifecycle the slot is ALWAYS null when step returns. Every non-null observation at a '
        + 'step boundary is a CARRY-OVER, and each is measured for the three leaks: across a '
        + 'change of ball OWNER, across a change of PHASE, and live at the WHISTLE — plus the '
        + 'two end facts (null at construction, null at full time).',
      tracedSites: {
        armSite: `${BRAIN_SRC_PATH}:${ARM_SITE_LINE}`,
        withdrawalSite: `${BRAIN_SRC_PATH}:${CLEAR_SITE_LINE}`,
        withdrawalImpl: `${MATCH_SRC_PATH}:${CLEAR_IMPL_LINE}`,
        fireSite: `${MATCH_SRC_PATH}:${FIRE_SITE_LINE}`,
      },
      scopeOfTheDischarge: '⚠ THIS DISCHARGES THE DEBT FOR CB+L3+DV ONLY. The two seams #269.2(iv) '
        + 'NAMED (o2Look, ekHoldVeto) are NOT armed in this composition and their own '
        + 'compositions remain UNDISCHARGED. The proof is non-vacuous here because two OTHER '
        + 'early returns (o1PassWindup, c7Windup) ARE armed in the v7 substrate.',
    },
    instruments: {
      optionLadder: 'BU-C0\'s ladder VERBATIM in definition (L1 POSITION on Q07\'s own ±2 m band, '
        + 'EXTRACTED from ' + `${MECH_SRC_PATH}:${FORWARD_BAND_LINE}` + ' · L2 the engine\'s own '
        + 'flight prediction · L3 arrivalMargin > 0 · L4 the engine\'s corridor sampler), so every '
        + 'face is commensurable with the committed census. ⭐ #286\'s NEW CANON: EVERY behind-ball '
        + 'rung is now SPLIT GK / OUTFIELD (the #286.1 debt).',
      directionMix: 'FORWARD is R-乙 Q07 VERBATIM (the engine\'s own passesForward counter); the '
        + 'probe\'s ±2 m re-derivation only splits the engine\'s POOLED complement into backward '
        + 'vs lateral, so a disagreement can only mis-file INSIDE that complement.',
      spellTerminals: 'the #173 / R-乙 Q01 segmentation VERBATIM, terminal class = the LATEST '
        + 'qualifying engine event inside the spell\'s own span.',
    },
    preRegisteredDirections: [
      'backward/lateral completed-pass USAGE up (Q07 conventions verbatim)',
      'interception terminal share down',
      'completion up',
      'behind-ball option EXISTENCE (the BU-C0 instrument re-run, commensurable)',
      '⚠ REPORTED, NEVER GATED: no gate in this probe reads any of them.',
    ],
    reRunClause: 'R-乙 REPORTED on both arms: Q01 spell length · Q05 touches/spell · Q06 '
      + 'completion · Q07 direction · Q14-shaped pressed share.',
    populations: {
      reception: 'every tick at which the ball\'s owner CHANGES while phase === "playing".',
      pressedReception: `a reception whose receiver has an opponent within ${PRESSURE_R} m `
        + `(TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}).`,
      pressedCarrierMoment: `a NON-reception carrier tick sampled every ${CARRIER_SAMPLE_TICKS} `
        + `ticks (${round(CARRIER_SAMPLE_TICKS * DT, 4)} sim-s) at which the carrier is pressed.`,
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
      + 'both arms, so the contrast is the same resampled worlds.',
    terminalClasses: TERMINALS,
    pressureRadiusM: PRESSURE_R,
    forwardBandM: FORWARD_BAND_M,
    histogramTopBucket: HIST_MAX,
    beliefZones: DV_ZONES,
  },
  run: {
    N: N_RUN, base: BASE_RUN, arms: ARMS.length, walks: armTotal,
    perturbationControls: perturbCheck.total,
    doorsMatrixWalks: ALL_DOOR_CELLS.length * LIFECYCLE_SEEDS.length,
    receptions: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.receptions))])),
    pressedReceptions: Object.fromEntries(ARMS.map((a) => [a,
      sum(rowsOf(a).map((r) => r.receptionsPressed))])),
    pressedCarrierMoments: Object.fromEntries(ARMS.map((a) => [a,
      sum(rowsOf(a).map((r) => r.carrierSamplesPressed))])),
    openSpells: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.openSpells))])),
    attempts: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.attempts))])),
    oracleCalls: oracleReceipt.calls,
  },
  /* ---- ⭐⭐ THE ORDER-OF-PROOF ARTIFACT: the lifecycle proof, first ---- */
  armingLifecycle: {
    law: '⭐ A DICHOTOMY, re-specified mid-build and DISCLOSED (the L3-T0 §DEV 1 precedent): the '
      + 'law as first coded was "no arming survives its own tick in ANY cell"; the exhaustive '
      + 'matrix FALSIFIED it in the CHOICE-WITHOUT-CAPABILITY cells (S ∧ ¬T) and the '
      + 'falsification is the finding. (a) in EVERY cell where an aim CAN fire (cbTouchPast '
      + 'open) no arming survives its own tick, so a stale aim never exists; (b) in the cells '
      + 'where armings DO persist, ZERO knocks fire — the firing fork\'s own conjunct is the '
      + 'capability door — so the persistence has no behavioural surface.',
    matrix: {
      cells: lifecycleMatrix.cells,
      firingCells: lifecycleMatrix.firingCells,
      nonFiringCells: lifecycleMatrix.inertCells,
      seeds: LIFECYCLE_SEEDS,
      firingHalfTotals: lifecycleMatrix.firing,
      nonFiringHalfTotals: lifecycleMatrix.inert,
      allCellTotals: lifecycleMatrix.total,
      offenders: lifecycleMatrix.offenders,
      cellsHoldingAnUnconsumedArming: lifecycleMatrix.persistingCells,
    },
    battery: batteryLifecycle,
    structure: lifecycleStructure,
    finding: '⚠ ROUTED TO ADJUDICATION, of record: in the ' + lifecycleMatrix.persistingCells.length
      + ' enumerated CHOICE-WITHOUT-CAPABILITY cells (cbChoiceSeat armed, cbTouchPast SHUT) the '
      + 'arming slot is left set with no consumer — it crosses possessions and restarts and can '
      + 'be live at the whistle. NO ARMED WORLD CONSTRUCTS THAT CELL (the v7 entry opens both '
      + 'doors; CB-T2 §ARMING #4 is explicit that the choice buys the choice and the capability '
      + 'buys the firing), and no knock can fire there, so it is INERT — but it is the '
      + '#269.2(iv) class exhibited, and it is published rather than excluded.',
    verdict: lifecycleMatrix.offenders.length === 0 && batteryLifecycle.carryOvers === 0
      ? '⭐ CLEAN AT THE AUTHORIZED COMPOSITION — across every cell in which a knock can fire, '
        + 'and across the whole measured battery, no arming survives its own tick, none crosses a '
        + 'possession or a phase, none is live at the whistle and none exists at construction. '
        + 'The seat DID arm and knocks DID fire, so the zero is not a zero of absence.'
      : 'STALENESS OBSERVED WHERE IT COULD FIRE — see offenders.',
  },
  doorsMatrix: {
    cells: ALL_DOOR_CELLS.length,
    seeds: LIFECYCLE_SEEDS,
    inertnessChecked: doorsAlways.checked,
    inertnessFailures: doorsAlways.fail,
    liveness: doorsLive,
    perCellLifecycle: Object.fromEntries(LIFECYCLE_SEEDS.map((seed) => [seed,
      Object.fromEntries(ALL_DOOR_CELLS.map((c) => [doorKey(c), doorLife[seed][doorKey(c)]]))])),
    perCellSignature: Object.fromEntries(LIFECYCLE_SEEDS.map((seed) => [seed,
      Object.fromEntries(ALL_DOOR_CELLS.map((c) => [doorKey(c), doorSig[seed][doorKey(c)]]))])),
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
    dv: {
      source: `${DVT1_PATH} · result.perClusterCells[].consume[][last] POOLED over all books `
        + '(the poolT1DoseCells idiom, applied to the DV family\'s own bank)',
      declaredSha: DVT1_SHA,
      portableAnchorGDet: DVT1_GDET,
      cells: DV_DOSE,
      labels: dvDoseLabels,
      belief: DV_DOSE_BELIEF.map((v) => round(v, 8)),
      zones: DV_ZONES,
      note: 'the belief the dosed book SERVES, re-derived here from the pooled cells; the engine '
        + 'writes it onto the MATCH-LOCAL genome views at construction (Match.dvLearnWriteBelief) '
        + 'and nothing of it is ever in info.genome (house law #270, a gArms conjunct).',
    },
    houseLaw: '#270 — both doses are written through their book\'s own public note(); the dose '
      + 'appears NOWHERE in info.genome, asserted per walk in gArms.',
  },
  perSeedCells: Object.fromEntries(ARMS.map((a) => [a, rowsOf(a).map(cellOf)])),
  seeds: { claimed: CLAIMED, block: [12_487_000, 12_487_999] },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 111_800, step: STATS_STEP },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    'NOTHING IS SCORED HERE. H-BU.1 is scored at ARC EXIT on the assembled composition '
      + '(#286.3\'s amended seat); every face in this stage is REPORTED.',
    'The pre-registered DIRECTIONS are directions — no gate reads a football number.',
    'The option oracle answers "could the engine\'s own machinery get the ball there", NOT '
      + '"would the chooser pick it" and NOT "did the carrier see him" — capability, never '
      + 'choice, never perception.',
    '⚠ THE ARMED TERMINAL SHARES ARE L3-VETO ENTANGLED (BU-C0 §CORRECTIONS 3): the veto moves '
      + '~14.5 pp out of tackled into intercepted. BOTH arms here carry the veto, so the '
      + 'CONTRAST is entanglement-free; the LEVELS are not, and the aggregate '
      + 'lossToOpponentShare is the honest cross-arm quantity.',
    'The DV dose is a DECLARED PRESENTATION of a committed exam\'s matured books (#270\'s form): '
      + 'its provenance world is the DV-T2-T1 exam\'s substrate, NOT this composition — stated, '
      + 'not hidden.',
    'The pressed-carrier population is a SAMPLE at a declared cadence, not every tick.',
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
  const crossPath = '/tmp/bu-t0-cross-out.json';
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
banner(`\n  [bu-t0] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [bu-t0] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
const face = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const show = (k: string): string => {
  const f = face(k);
  return `${f.arms.v7.point.toFixed(4)} v7 → ${f.arms.v7dv.point.toFixed(4)} v7dv `
    + `(Δ ${f.contrast.delta >= 0 ? '+' : ''}${f.contrast.delta.toFixed(4)} `
    + `[${f.contrast.ci95[0].toFixed(4)}, ${f.contrast.ci95[1].toFixed(4)}]`
    + `${(f.contrast.ci95[0] > 0 && f.contrast.ci95[1] > 0) || (f.contrast.ci95[0] < 0 && f.contrast.ci95[1] < 0) ? ' RESOLVED' : ''})`;
};
banner(`  [bu-t0] behind-ball options / reception — ${show('behindBallOptionsPerReception')}`);
banner(`  [bu-t0] OUTFIELD L4 / reception       — ${show('ladderL4OutfieldPerReception')}`);
banner(`  [bu-t0] backward completions          — ${show('backwardShareOfCompletions')}`);
banner(`  [bu-t0] circulation completions       — ${show('circulationShareOfCompletions')}`);
banner(`  [bu-t0] completion rate (Q06)         — ${show('passCompletionRate')}`);
banner(`  [bu-t0] intercepted terminal share    — ${show('terminal_intercepted')}`);
banner(`  [bu-t0] loss-to-opponent share        — ${show('lossToOpponentShare')}`);
banner(`  [bu-t0] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
