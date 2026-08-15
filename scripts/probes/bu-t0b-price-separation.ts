/**
 * ⭐⭐ BU-T0b — THE PRICE-SEPARATION PROBE
 * (docs/world-model/BU-T0B-PRICE-SEPARATION.md).
 *
 * INSTRUMENT-ONLY. NOTHING SHIPS. Authorized by ruling #287.6 for EXACTLY this stage.
 *
 * BU-T0 (#287.2) left a 57/57-face NULL with TWO live explanations, unseparated:
 *   (a) GRAIN    — the DV belief indexes one of THREE PITCH THIRDS, so it is structurally
 *                  blind to lane-shaped risk (82.08 % of the outfield option loss is the
 *                  CORRIDOR — a fact about the line between two bodies);
 *   (b) LOUDNESS — the learned price is `belief · passBase` ≈ 0.0038–0.0084 score units,
 *                  ARGUED-not-measured as too quiet to move any chooser.
 *
 * ⭐ THIS PROBE SEPARATES THEM by asking one counterfactual question: IF THE SAME ZONE-GRAIN
 * KNOWLEDGE WERE PRICED LOUDER, WOULD USAGE MOVE? A PRE-REGISTERED λ-LADDER over the DV loss
 * price, every λ DERIVED (never taste), the SAME BU-T0 faces measured, all arms paired on the
 * same seeds against λ1.
 *
 *   ARMS (4, paired, SAME seeds — every one arms DV; ONLY λ differs):
 *     lam1  λ = 1                THE SHIPPED ANCHOR — the TRUE dose. NOT a counterfactual.
 *     lam2  λ = passBase⁻¹       the UNIT argument (prices read in belief units directly);
 *                                passBase from the engine's DEFAULT_POLICY at run time.
 *     lam3  λ = MARGIN-MATCHED   the LOUDNESS THRESHOLD, from the declared margin preflight.
 *     lam4  λ = 10 × λ3          SATURATION, CAPPED AT the derived linearity boundary.
 *
 * ⭐⭐⭐ EVERY ARM BUT λ1 IS A **COUNTERFACTUAL WORLD** — see §4b. It is labelled as such in
 * this file, in the artifact and in the doc, and it can never be confused with truth-dosing:
 * the yardstick FACE DEFINITIONS ARE UNCHANGED (#256.2), and nothing is scored.
 *
 * ⭐ THE COUNTERFACTUAL ENTERS ONLY THROUGH THE DOSE, through the SHIPPED WRITER (the BU-T0
 * idiom, house law #270): the books are dosed so `DeliveryAccountBook`'s own served belief is
 * `λ · belief_true`. No `src/**` edit, no field surgery, nothing near `info.genome`.
 *
 * ⭐⭐ THE LINEARITY REGION IS VERIFIED BEFORE THE LADDER IS FIXED, from the source: the price
 * is linear in the belief, but `dvLossBeliefVector`'s `clamp01` and the book's own
 * `punished <= deliveries` both bind at belief = 1 ⇒ λ_LIN = 1 / max_z belief_true_z. Any
 * rung that would leave the region is capped AT the boundary and the capping is PUBLISHED.
 *
 * THE ORDER OF PROOF (#266.3(c) — the freeze commit sits between 1 and 3):
 *   1. THE MARGIN PREFLIGHT (`BUT0B_MODE=preflight`) — the loudness threshold, measured on
 *      the v7 world from the ENGINE'S OWN published candidate table, DECLARED preflight seeds.
 *   2. THE LADDER IS FIXED from it, the doc is written, THE FREEZE COMMIT LANDS.
 *   3. THE BATTERY. It never changes the ladder.
 *
 * ⭐ #283.2(iv): every match is constructed DIRECTLY with its `matchFlags` and the arming is
 *    ASSERTED LIVE on the very match the walk measures (a `gArms` conjunct).
 * ⭐ #287.1 (the gFaces lesson, NEW CANON): the re-derivation gate PARSES THE SERIALIZED
 *    ARTIFACT, never the in-memory objects that produced it.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BUT0B_MODE (preflight|smoke|full, REQUIRED) · BUT0B_N · BUT0B_OUT.
 *   ANY other `BUT0B_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: BUT0B_MODE=preflight npx tsx scripts/probes/bu-t0b-price-separation.ts   (step 1)
 *      BUT0B_MODE=full      npx tsx scripts/probes/bu-t0b-price-separation.ts   (step 3)
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
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
import { DEFAULT_POLICY, TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['BUT0B_MODE', 'BUT0B_N', 'BUT0B_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BUT0B_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('BU-T0b FATAL — refused env surface. '
    + `rogue BUT0B_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
/**
 * ⭐⭐ THREE MODES, and `preflight` is a FIRST-CLASS one — it is the LADDER'S OWN DERIVATION
 * STEP, not a rehearsal. It walks the MARGIN population on the v7 world, writes its own
 * committed artifact, and exits WITHOUT touching the battery. The full run then READS that
 * committed artifact (SHA-guarded) and derives λ3 from it, so the ladder is DERIVED at run
 * time from committed evidence and is nonetheless FROZEN by that evidence's identity.
 */
const MODES = ['preflight', 'smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.BUT0B_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`BU-T0b FATAL — BUT0B_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const N_ENV = process.env.BUT0B_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.BUT0B_N, 10)) : null;
const OUT_ENV = process.env.BUT0B_OUT;
/** ⚠ an OVERRIDE invocation (an env knob turned) may never write a canonical repo path. */
const OVERRIDE_REASONS = [
  ...(N_ENV !== null ? ['BUT0B_N'] : []),
  ...(OUT_ENV !== undefined ? ['BUT0B_OUT'] : []),
];
const IS_PREFLIGHT = OVERRIDE_REASONS.length > 0;
const PREFLIGHT_REASONS = OVERRIDE_REASONS;
const OUT_BY_MODE: Record<Mode, string> = {
  preflight: 'docs/world-model/data/bu-t0b-margin-preflight.json',
  smoke: 'docs/world-model/data/bu-t0b-price-separation-smoke.json',
  full: 'docs/world-model/data/bu-t0b-price-separation.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bu-t0b-override.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('BU-T0b FATAL — an OVERRIDE invocation may not write a canonical repo path '
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
const STATS_BASE = 112_000;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600, 111_800,
];

const BATTERY_BASE = 12_488_100;
const SMOKE_BASE = 12_488_000;
const GUARD_BASE = 12_488_020;
const GUARD_SPAN = 20;
/** ⭐⭐ THE MARGIN PREFLIGHT'S OWN DECLARED SEEDS — DISJOINT from the battery's, by design:
 *  the loudness threshold is derived on worlds the battery never walks, so the ladder cannot
 *  be tuned to the very seeds it is then measured on. */
const MARGIN_BASE = 12_488_040;
const MARGIN_SEEDS_FULL = 40;
const GWORLD_SEED = 12_488_900;
const N_FROZEN = 200;
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
  { name: 'BU-T0 DV-in-v7 composition (#286.5/#287.5)', range: [12_487_000, 12_487_999] },
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

/* ========================================================================== */
/* §4b ⭐⭐ THE COUNTERFACTUAL λ-LADDER — DERIVED, NEVER TASTE                   */
/* ========================================================================== */
/**
 * ⭐⭐⭐ READ THIS BEFORE ANYTHING ELSE IN THIS FILE.
 *
 * EVERY ARM OF THIS STAGE EXCEPT λ1 IS A **COUNTERFACTUAL**. The books are dosed so that the
 * belief the shipped writer serves is `λ · belief_true`. λ = 1 IS the truth (BU-T0's own
 * `v7dv` arm, replicated on this stage's own virgin seeds); EVERY OTHER ARM IS A WORLD THAT
 * NEVER EXISTED and whose numbers are NOT measurements of the shipped game. Nothing here
 * ships, nothing here is scored, and no face definition moved (#256.2 — the yardstick faces
 * are BU-T0's, verbatim).
 *
 * ⭐ HOW THE COUNTERFACTUAL ENTERS — through the SHIPPED WRITER AND NOWHERE ELSE (the BU-T0
 * idiom, house law #270). `DeliveryAccountBook` serves `punished[z] / deliveries[z]`. So a
 * λ-dosed book keeps the TRUE delivery count `D_z` and writes `round(λ · P_z)` punished
 * labels through the book's own public `note()`. No field surgery, no new capability, no
 * `info.genome`. A λ-dosed book is a state the world COULD have reached — it is the book of
 * a team that was punished λ times as often into the same zones.
 *
 * ⭐⭐ THE LINEARITY REGION, DERIVED FROM THE SOURCE (this is a HARD boundary, not an
 * aesthetic one). The chooser's price is `belief[zone(aim)] · W.passBase`
 * (`deliveryRiskPrice`, src/ai/deliveryValueSeat.ts) — LINEAR in the belief, with no clamp of
 * its own and no clamp on the candidate score `s` downstream of the subtraction. But TWO
 * clamps stand upstream of it, and they agree exactly:
 *   (1) `dvLossBeliefVector` (src/evolution/genome.ts) runs every slot through `clamp01`;
 *   (2) the book itself cannot serve more than 1 — `punished[z] <= deliveries[z]` by the
 *       writer's own construction.
 * Both bind at `belief′_z = 1`, so the LINEAR REGION IS EXACTLY
 *       λ ≤ λ_LIN = min over evidenced zones of  D_z / P_z  =  1 / max_z belief_true_z .
 * ⭐ ANY RUNG THAT WOULD LEAVE IT IS CAPPED **AT** λ_LIN, and the capping is published as a
 * fact of record rather than quietly applied (`gLadder` asserts every rung is inside the
 * region and that `capped` is reported honestly).
 */
const DV_LAMBDA_LIN = Math.min(...DV_DOSE
  .filter((c) => c.deliveries > 0 && c.punished > 0)
  .map((c) => c.deliveries / c.punished));

/**
 * ⭐ THE PRICE SCALE, IMPORTED FROM THE ENGINE, NEVER TYPED. `deliveryRiskPrice`'s
 * `valueScale` argument is `W.passBase`, and `W` is `team.policies[p.index]` — which is the
 * `DEFAULT_POLICY` OBJECT ITSELF for every team this probe builds (`Team`'s constructor keeps
 * the default object when `info.policy` and `info.rolePolicies` are absent, and this probe's
 * `team()` factory sets neither). `gLadder` asserts that identity on the walked worlds rather
 * than trusting this sentence.
 */
const PASS_BASE = DEFAULT_POLICY.passBase;

/** the price, in SCORE UNITS, that zone z's belief costs a candidate aimed into it, at λ. */
const priceOfZone = (lambda: number, z: number): number => Math.min(1, lambda * DV_DOSE_BELIEF[z])
  * PASS_BASE;

/**
 * ⭐⭐ THE LOUDNESS QUANTITY, FROZEN BEFORE THE PREFLIGHT RAN: the MEAN PAIRWISE PRICE
 * DIFFERENTIAL ACROSS ZONES. The DV term cannot move a chooser by being large — a price
 * charged EQUALLY to every candidate cancels in an argmax. What can move the chooser is the
 * DIFFERENCE the map draws between one zone and another, so THAT is the quantity the ladder
 * matches to the choice margin. Mean over the three unordered zone pairs.
 */
const meanZoneDifferential = (lambda: number): number => {
  const d: number[] = [];
  for (let i = 0; i < DV_ZONE_COUNT; i++) {
    for (let j = i + 1; j < DV_ZONE_COUNT; j++) {
      d.push(Math.abs(priceOfZone(lambda, i) - priceOfZone(lambda, j)));
    }
  }
  return sum(d) / d.length;
};

/**
 * ⭐ THE COUNTERFACTUAL DOSE, through the shipped writer (house law #270). The delivery count
 * per zone is the TRUE one; the punished count is `round(λ · P_z)`, capped at `D_z` because
 * the writer cannot express more (which is the linearity boundary, made structural).
 */
interface LambdaDoseCell { readonly deliveries: number; readonly punished: number }
const lambdaDoseCells = (lambda: number): LambdaDoseCell[] => DV_DOSE.map((c) => ({
  deliveries: c.deliveries,
  punished: Math.min(c.deliveries, Math.round(lambda * c.punished)),
}));
const lambdaBelief = (lambda: number): number[] => lambdaDoseCells(lambda)
  .map((c) => (c.deliveries === 0 ? 0 : c.punished / c.deliveries));

/**
 * ⭐ WRITE THE DOSE through the book's OWN public `note()` — the `doseL3Books` idiom verbatim
 * in form (house law #270). At λ = 1 this is BU-T0's dose, cell for cell.
 */
const dosedDvBooks = (lambda: number): [DeliveryAccountBook, DeliveryAccountBook] => {
  const cells = lambdaDoseCells(lambda);
  const books: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook()];
  for (const book of books) {
    for (let z = 0; z < cells.length; z++) {
      const c = cells[z];
      for (let i = 0; i < c.punished; i++) book.note(z, true);
      for (let i = 0; i < c.deliveries - c.punished; i++) book.note(z, false);
    }
  }
  return books;
};

/* ========================================================================== */
/* §5 THE ARMS — constructed DIRECTLY with matchFlags (#283.2(iv))             */
/* ========================================================================== */
/**
 * ⭐⭐ THE MARGIN PREFLIGHT'S WORLD — the v7 world with the DV doors SHUT: BU-T0's own base
 * arm, i.e. the UN-PERTURBED chooser. The loudness threshold is a property of the table the
 * DV price would have to move, so it is measured on the table BEFORE that price exists.
 */
const marginWorld = (seed: number): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(L3_WORLD_VERSION),
  });
  armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
  return m;
};

/**
 * ⭐⭐ THE WALKED ARMS ARE **THREE**, AND THE FOURTH RUNG IS COINCIDENT WITH THE THIRD — BY THE
 * CHARTER'S OWN CAP RULE, DERIVED BEFORE THE FREEZE, NEVER BY TASTE.
 *
 * The dispatch's ladder is λ1 = 1 · λ2 = passBase⁻¹ · λ3 = MARGIN-MATCHED · λ4 = 10 × λ3,
 * "capped at the derived linearity boundary if it exceeds it". The margin preflight makes
 * λ3_raw ≈ 58.9 — **2.5× OUTSIDE the linear region** — so λ3 caps AT λ_LIN, and 10 × λ3 caps
 * at λ_LIN too. RUNGS 3 AND 4 ARE THEREFORE THE SAME WORLD. Walking it twice would produce
 * two bit-identical arms and zero information, so it is walked ONCE and the fourth rung is
 * published as MERGED, with its arithmetic shown. Nothing is dropped: λ_LIN IS the saturation
 * point — the mean zone differential is MAXIMISED there and DECREASES above it (as the lower
 * zones catch the clamp), so no dose through this seam is ever louder than rung 3.
 */
const ARMS = ['lam1', 'lam2', 'lam3'] as const;
type ArmKind = (typeof ARMS)[number];
/** filled by §5c once the preflight artifact has been read; λ1 is always exactly 1. */
const LAMBDA: Record<ArmKind, number> = { lam1: 1, lam2: 1, lam3: 1 };
const matchOf = (seed: number, arm: ArmKind): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  const m = new Match({
    seed, teamA, teamB, ...a4MatchFlags(L3_WORLD_VERSION),
    dvLearnedMap: true, dvDeliveryValue: true, dvLearnedBooks: dosedDvBooks(LAMBDA[arm]),
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
  const wantCells = lambdaDoseCells(LAMBDA[arm]);
  const wantBelief = lambdaBelief(LAMBDA[arm]);
  const dvDosed = mm.dvLearn !== null && mm.dvLearn.books.every((b) => wantCells
    .every((c, z) => b.deliveries[z] === c.deliveries && b.punished[z] === c.punished));
  const beliefLive = ([0, 1] as const).every((s) => {
    const g = m.teams[s].effGenome as TacticalGenome;
    const b = g.dvLossBelief;
    return b !== undefined && b.length === DV_ZONE_COUNT
      && b.every((v, z) => Math.abs(v - wantBelief[z]) < 1e-12);
  });
  /** ⭐ THE PRICE SCALE IS THE ENGINE'S OWN, ON THE MATCH THAT IS WALKED (not a memory). */
  const scaleLive = ([0, 1] as const).every((s) => m.teams[s].policies
    .every((w) => w.passBase === PASS_BASE));
  const genomeClean = ([0, 1] as const).every((s) => {
    const g = infoGenomeOf(m, s);
    return g.dvLossBelief === undefined && g.dvExposureWeight === undefined
      && g.cbCarryProneness === undefined;
  });
  return {
    theArmIsTheWorldSevenOfRecord: l3ArmedVersion(m) === L3_WORLD_VERSION
      && a4ArmedVersion(m) === L3_WORLD_VERSION,
    bothL3DoorsAreLiveInThisSim: mm.l3DefenceLearn && mm.l3DefenceVeto && mm.l3Defence !== null,
    theThreeCbDoorsAreLiveInThisSim:
      mm.cbChoiceSeat && mm.cbTouchPast && mm.cbCommitPhysics,
    theL3BooksCarryTheMaturedDose: l3Dosed,
    theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
    noDoseIsInTheFranchiseGenome: genomeClean,
    noArmingExistsAtConstruction: mm.forcedTouchPast === null,
    theDvDoorsAreBothLiveInThisSim: mm.dvLearnedMap && mm.dvDeliveryValue && mm.dvLearn !== null,
    theDvBooksCarryThisArmsCounterfactualDose: dvDosed,
    theCounterfactualBeliefIsLiveOnTheGenomeTheChooserReads: beliefLive,
    thePriceScaleIsTheEnginesOwnDefaultPolicy: scaleLive,
  };
};

/* ========================================================================== */
/* §5b ⭐⭐ THE MARGIN PREFLIGHT — THE LOUDNESS THRESHOLD, FROM THE ENGINE ITSELF */
/* ========================================================================== */
/**
 * ⭐⭐ WHAT IS BEING MEASURED, AND WHY THIS SURFACE.
 *
 * λ3 is the MARGIN-MATCHED rung: the λ at which the map's mean price differential across
 * zones equals the mean gap the chooser's own table already leaves between the option it
 * takes and the one it leaves. Below that gap a price is arithmetic that cannot change an
 * argmax; at it, it is loud enough to.
 *
 * ⭐ THE SURFACE IS THE ENGINE'S OWN PUBLISHED EVALUATION (#256.2 — the engine's machinery,
 * NEVER a parallel oracle): `Player.action.scores` is the shipped top-4 of `PlayerBrain`'s
 * OWN sorted candidate table (`cands.slice(0, 4)`), written at every decision. This probe
 * reads it and nothing else — it re-implements no scoring statement.
 *
 * ⚠⚠ A DECLARED DEVIATION FROM THE DISPATCH'S WORDING, STATED RATHER THAN HIDDEN. The
 * dispatch says "the mean |score margin| between the chooser's top-2 PASS options". THE
 * ENGINE PUBLISHES NO SUCH PAIR: `PlayerBrain` reduces every ground-pass candidate (every
 * mate × every delivery seam) to ONE `Pass` entry by argmax before the table is built, and
 * the runner-up ground pass is discarded inside a local loop that nothing outside can see.
 * Re-deriving it would require re-implementing `groundCandidate`'s whole chain — a PARALLEL
 * ORACLE, which #256.2 forbids outright. So the measured quantity is the ADJACENT one the
 * engine really publishes, and it is the operationally correct one for this question:
 *
 *   ⭐ THE MARGIN = |scores[0].score − scores[1].score| at every ON-BALL decision whose
 *      published top-2 CONTAINS a `Pass` — the decisions the DV price is arithmetically
 *      able to flip (it can push a leading pass below the runner-up, or a trailing pass
 *      further away). Decisions with no pass in the top 2 are counted and REPORTED, never
 *      folded into the derivation.
 *
 * ⚠ WHAT THIS MAKES λ3: a threshold for flipping the ACTION (pass vs carry/clear/loft), not
 * for flipping WHICH MATE is passed to. The mate-level margin is smaller, so λ3 is, if
 * anything, a CONSERVATIVE (high) threshold for the within-pass re-routing the DV map is
 * really aimed at — which is why the ladder does not stop at λ3. §DOUBTS carries this.
 *
 * ⭐ THE DECISION IS SAMPLED ONCE, NOT ONCE PER TICK: `p.action.scores` is a FRESH ARRAY per
 * decision (`cands.slice(0, 4)`), so reference identity is the engine's own "this is a new
 * decision" signal. No cadence is invented.
 */
interface MarginRow {
  seed: number;
  decisions: number;
  decisionsWithTwoCandidates: number;
  passInTopTwo: number;
  passIsTop: number;
  sumAbsMarginPassInTopTwo: number;
  sumAbsMarginPassIsTop: number;
  sumAbsMarginAll: number;
  ticks: number;
}
const marginWalk = (seed: number): MarginRow => {
  const m = marginWorld(seed);
  const row: MarginRow = {
    seed, decisions: 0, decisionsWithTwoCandidates: 0, passInTopTwo: 0, passIsTop: 0,
    sumAbsMarginPassInTopTwo: 0, sumAbsMarginPassIsTop: 0, sumAbsMarginAll: 0, ticks: 0,
  };
  const seen = new Map<number, unknown>();
  while (!m.finished) {
    m.step(DT);
    row.ticks += 1;
    const owner = m.ball.owner;
    if (owner === null) continue;
    const sc = owner.action.scores;
    if (seen.get(owner.gid) === sc) continue;
    seen.set(owner.gid, sc);
    row.decisions += 1;
    if (sc.length < 2) continue;
    row.decisionsWithTwoCandidates += 1;
    const margin = Math.abs(sc[0].score - sc[1].score);
    row.sumAbsMarginAll += margin;
    const topIsPass = sc[0].action === 'Pass';
    if (topIsPass || sc[1].action === 'Pass') {
      row.passInTopTwo += 1;
      row.sumAbsMarginPassInTopTwo += margin;
    }
    if (topIsPass) { row.passIsTop += 1; row.sumAbsMarginPassIsTop += margin; }
  }
  return row;
};

const MARGIN_PATH = 'docs/world-model/data/bu-t0b-margin-preflight.json';
/** ⭐ THE PREFLIGHT ARTIFACT'S DECLARED IDENTITY (the `L3_T1_SHA` idiom): the full run refuses
 *  to derive a ladder from any file but the one the freeze commit carries. */
const MARGIN_SHA = '675d222bf4ebb5c1fbdbc3b92a19a51e0c84f6caf2ae7bb6d396ea3e13bd2d6c';

if (MODE === 'preflight') {
  const n = N_ENV ?? MARGIN_SEEDS_FULL;
  banner(`  [bu-t0b] ⭐ THE MARGIN PREFLIGHT — ${n} v7 worlds from ${MARGIN_BASE}`);
  const rows: MarginRow[] = [];
  for (let i = 0; i < n; i++) rows.push(marginWalk(MARGIN_BASE + i));
  const S = (f: (r: MarginRow) => number): number => sum(rows.map(f));
  const meanAbsMarginPassInTopTwo = S((r) => r.sumAbsMarginPassInTopTwo) / S((r) => r.passInTopTwo);
  const body = {
    stage: 'BU-T0b MARGIN PREFLIGHT — the loudness threshold, from the engine\'s own table',
    doc: 'docs/world-model/BU-T0B-PRICE-SEPARATION.md',
    ruling: '#287.6 — λ DERIVED from the world\'s own choice-margin arithmetic, never taste',
    world: 'the v7 world (a4MatchFlags(7) + armA4World at the pooled matured L3 dose), DV '
      + 'doors SHUT — the un-perturbed chooser',
    surface: 'Player.action.scores — PlayerBrain\'s OWN sorted top-4 candidate table '
      + '(cands.slice(0,4)); nothing is re-implemented (#256.2)',
    population: 'every ON-BALL decision (the ball owner\'s) with >= 2 published candidates; '
      + 'the DERIVATION population is the subset whose top-2 contains a Pass',
    seeds: { base: MARGIN_BASE, n, walked: rows.map((r) => r.seed) },
    result: {
      decisions: S((r) => r.decisions),
      decisionsWithTwoCandidates: S((r) => r.decisionsWithTwoCandidates),
      passInTopTwo: S((r) => r.passInTopTwo),
      passIsTop: S((r) => r.passIsTop),
      meanAbsMarginPassInTopTwo,
      meanAbsMarginPassIsTop: S((r) => r.sumAbsMarginPassIsTop) / S((r) => r.passIsTop),
      meanAbsMarginAllDecisions:
        S((r) => r.sumAbsMarginAll) / S((r) => r.decisionsWithTwoCandidates),
      ticks: S((r) => r.ticks),
    },
    perSeedCells: rows,
    nonVacuity: {
      everySeedContributedADecision: rows.every((r) => r.decisions > 0),
      everySeedContributedAPassInTopTwo: rows.every((r) => r.passInTopTwo > 0),
      denominatorsNonZero: S((r) => r.passInTopTwo) > 0 && S((r) => r.passIsTop) > 0,
    },
    nonClaims: [
      'THIS IS AN INSTRUMENT DERIVATION STEP, not a football result. No face is published here.',
      '⚠ The margin is an ACTION-level margin (Pass vs the runner-up action), NOT a '
        + 'mate-level one: PlayerBrain publishes only its argmax pass. The mate-level margin '
        + 'is smaller, so the λ3 derived from this is a CONSERVATIVE (high) threshold.',
    ],
  };
  const digest = sha(canonical(body));
  writeFileSync(OUT_PATH, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: {
      generatedAt: new Date().toISOString(), head: gitOut('git rev-parse HEAD'),
      outPath: OUT_PATH, wallMs: Date.now() - t0Wall,
      note: 'UNHASHED (#266.3(a)).',
    },
  }, null, 1)}\n`);
  banner(`  [bu-t0b] preflight → ${OUT_PATH}`);
  banner(`  [bu-t0b] decisions ${S((r) => r.decisions)} · pass-in-top-2 ${S((r) => r.passInTopTwo)}`);
  banner(`  [bu-t0b] ⭐ MEAN |MARGIN| (pass in top 2) = ${meanAbsMarginPassInTopTwo}`);
  banner(`  [bu-t0b] file sha256 = ${sha(readFileSync(OUT_PATH, 'utf8'))}`);
  process.exit(0);
}

/* ========================================================================== */
/* §5c ⭐⭐ THE LADDER, FIXED HERE — derived, printed, and frozen by the SHA     */
/* ========================================================================== */
const MARGIN_RAW = JSON.parse(readFileSync(MARGIN_PATH, 'utf8')) as Record<string, unknown>;
/** ⚠ the guard is on the artifact's OWN `resultSha256` (the body digest), NOT on the file
 *  bytes — the envelope carries a timestamp and would make a byte guard unreproducible. */
const MARGIN_FILE_SHA = String(MARGIN_RAW.resultSha256 ?? '');
/** …and the declared digest is RE-DERIVED from the body on disk, so a hand-edited artifact
 *  carrying its old digest cannot pass (#266.3(a)'s envelope discipline, applied inbound). */
const MARGIN_REDERIVED_SHA = (() => {
  const c = { ...MARGIN_RAW };
  delete c.resultSha256; delete c.envelope;
  return sha(canonical(c));
})();
const MARGIN_FILE = MARGIN_RAW as unknown as {
  result: { passInTopTwo: number; decisions: number; meanAbsMarginPassInTopTwo: number };
  perSeedCells: MarginRow[];
  seeds: { base: number; n: number };
};
/** ⭐ RE-DERIVED FROM THE COMMITTED PER-SEED CELLS, never taken from the file's headline. */
const MARGIN_MEAN = sum(MARGIN_FILE.perSeedCells.map((r) => r.sumAbsMarginPassInTopTwo))
  / sum(MARGIN_FILE.perSeedCells.map((r) => r.passInTopTwo));

/** the zone differential at λ = 1 — the unit the margin is divided by. */
const ZONE_DIFF_AT_ONE = meanZoneDifferential(1);
const LAMBDA3_RAW = MARGIN_MEAN / ZONE_DIFF_AT_ONE;
const LAMBDA2_RAW = 1 / PASS_BASE;
const LAMBDA3_USED = Math.min(LAMBDA3_RAW, DV_LAMBDA_LIN);
const LAMBDA4_RAW = 10 * LAMBDA3_USED;
const LAMBDA4_USED = Math.min(LAMBDA4_RAW, DV_LAMBDA_LIN);
LAMBDA.lam1 = 1;
LAMBDA.lam2 = LAMBDA2_RAW;
LAMBDA.lam3 = LAMBDA3_USED;
/** ⭐ THE LEVEL-MATCHED λ, published beside the ladder because it is the OTHER loudness axis
 *  (see the doc): the price a candidate in the WORST zone pays is `belief · passBase`, and it
 *  is subtracted from ground passes ONLY — so it moves PASS-vs-NOT-PASS by its full LEVEL,
 *  not by the cross-zone differential. This is the λ at which that level equals the margin. */
const LAMBDA_LEVEL_MATCHED = MARGIN_MEAN / (PASS_BASE * Math.max(...DV_DOSE_BELIEF));
const LADDER_RUNGS: {
  arm: string; raw: number; used: number; capped: boolean; walked: boolean; why: string;
}[] = [
  { arm: 'lam1', raw: 1, used: 1, capped: false, walked: true,
    why: 'THE SHIPPED ANCHOR — the TRUE learned dose, BU-T0\'s own v7dv arm on virgin seeds. '
      + 'NOT a counterfactual.' },
  { arm: 'lam2', raw: LAMBDA2_RAW, used: LAMBDA.lam2, capped: LAMBDA2_RAW > DV_LAMBDA_LIN,
    walked: true,
    why: 'THE UNIT ARGUMENT — λ = passBase⁻¹, so the price the chooser subtracts is the belief '
      + 'ITSELF in score units (belief · passBase · passBase⁻¹ = belief). passBase is read '
      + 'from the engine\'s DEFAULT_POLICY at run time, never typed.' },
  { arm: 'lam3', raw: LAMBDA3_RAW, used: LAMBDA3_USED, capped: LAMBDA3_RAW > DV_LAMBDA_LIN,
    walked: true,
    why: 'THE LOUDNESS THRESHOLD — λ at which the mean pairwise price differential across '
      + 'zones equals the mean |margin| between the chooser\'s published top-2 at decisions '
      + 'where a pass is in that top 2 (the declared margin preflight).' },
  { arm: 'lam4 (MERGED INTO lam3 — NOT WALKED SEPARATELY)',
    raw: LAMBDA4_RAW, used: LAMBDA4_USED, capped: LAMBDA4_RAW > DV_LAMBDA_LIN, walked: false,
    why: 'SATURATION — 10 × λ3 = ' + String(LAMBDA4_RAW) + ', CAPPED AT THE DERIVED LINEARITY '
      + 'BOUNDARY λ_LIN = ' + String(DV_LAMBDA_LIN) + '. Since λ3 ALSO capped there, this rung '
      + 'IS rung 3 — the same world, walked once. ⭐ λ_LIN is genuinely the saturation point: '
      + 'the mean zone differential is MAXIMISED at it and DECREASES above it, as the middle '
      + 'and final zones catch the same clamp.' },
];
banner(`  [bu-t0b] ⭐ THE LADDER — λ_LIN ${DV_LAMBDA_LIN} · margin ${MARGIN_MEAN} · `
  + `zoneDiff@1 ${ZONE_DIFF_AT_ONE}`);
for (const r of LADDER_RUNGS) {
  banner(`    ${r.arm}  λ=${r.used}${r.capped ? ` (CAPPED from ${r.raw})` : ''}  belief=[`
    + `${lambdaBelief(r.used).map((v) => v.toFixed(6)).join(', ')}]`);
}

/* ========================================================================== */
/* §6 THE ARMING-LIFECYCLE READ — inherited as a per-walk RECEIPT, not a gate  */
/* ⚠ The #269.2(iv) DEBT IS DISCHARGED at CB+L3+DV (#287.3); this stage does not */
/* re-prove it and claims nothing about it. The read rides every walk for free   */
/* and is stored per seed, so a regression would be visible in the artifact.     */
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
/* §10 THE BATTERY                                                             */
/* ========================================================================== */
const N_RUN = N_ENV ?? (MODE === 'smoke' ? 4 : N_FROZEN);
const BASE_RUN = MODE === 'smoke' && N_ENV === null ? SMOKE_BASE
  : (IS_PREFLIGHT ? GUARD_BASE : BATTERY_BASE);

interface Battery { rows: Record<ArmKind, Row[]> }
const runBattery = (): Battery => {
  const rows: Record<ArmKind, Row[]> = { lam1: [], lam2: [], lam3: [] };
  for (const arm of ARMS) {
    for (let i = 0; i < N_RUN; i++) rows[arm].push(walk(BASE_RUN + i, arm));
    banner(`  [bu-t0b] ${arm} (λ=${LAMBDA[arm]}) — ${N_RUN} walks done`);
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
/** ⭐ EVERY CONTRAST IS AGAINST λ1 (the shipped anchor) ON THE SAME SEEDS — the response curve. */
const REF_ARM: ArmKind = 'lam1';
const DOSE_ARMS: readonly ArmKind[] = ['lam2', 'lam3'];
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
          : [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
      };
    }
    /** ⭐ PAIRED: ONE resample-index matrix draws EVERY arm, so each contrast is the same
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
          : [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
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

banner(`  [bu-t0b] ⭐ THE BATTERY (the ladder is FROZEN above): mode=${MODE} N=${N_RUN} seeds `
  + `× ${ARMS.length} λ-arms × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [bu-t0b] G-DET second run…');
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
/** ⭐ THE IDENTITY SEED — every arm arms DV; what must SEPARATE them is the SERVED BELIEF.
 *  A ladder whose arms served the same belief would be four copies of one world. */
const ladderProbes = ARMS.map((a) => matchOf(GWORLD_SEED, a));
const probeBelief = ladderProbes.map((m) => (m.teams[0].effGenome as TacticalGenome)
  .dvLossBelief as number[]);
const worldSeedOk = ladderProbes.every((m) => l3ArmedVersion(m) === L3_WORLD_VERSION
  && (m as unknown as { dvLearn: unknown }).dvLearn !== null)
  && probeBelief.every((b) => b !== undefined && b.length === DV_ZONE_COUNT);
/** the beliefs are STRICTLY INCREASING up the ladder, zone by zone (unless a zone has clamped). */
const ladderSeparates = probeBelief.slice(1).every((b, i) => b
  .every((v, z) => v >= probeBelief[i][z]))
  && probeBelief.slice(1).some((b, i) => b.some((v, z) => v > probeBelief[i][z]));

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
    ? [{ name: 'BU-T0b battery', range: [BATTERY_BASE, BATTERY_BASE + N_RUN - 1] as [number, number] }]
    : []),
  { name: 'BU-T0b smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 19] },
  { name: 'BU-T0b guard/override block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: '⭐ BU-T0b MARGIN PREFLIGHT block (declared SEPARATELY from the battery)',
    range: [MARGIN_BASE, MARGIN_BASE + MARGIN_SEEDS_FULL - 1] },
  { name: 'BU-T0b world-identity seed', range: [GWORLD_SEED, GWORLD_SEED] },
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
    theIdentitySeedSeparatesTheLadderArmsByServedBelief: i.probe,
    everyDistinctLadderRungWasWalked: i.arms === 3,
    theArmsWalkTheSameSeeds: i.paired,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: {
    ok: armOkCount, total: armTotal, probe: worldSeedOk && ladderSeparates,
    arms: ARMS.length, paired: pairedSameSeeds,
  },
  mutants: [
    { conjunct: 'everyWalkedMatchCarriesItsArmLive', name: 'a walk was not its arm', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theIdentitySeedSeparatesTheLadderArmsByServedBelief', name: 'the ladder arms served the same belief', mutate: (i) => ({ ...i, probe: false }) },
    { conjunct: 'everyDistinctLadderRungWasWalked', name: 'a rung was dropped', mutate: (i) => ({ ...i, arms: 1 }) },
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

/* ---- 5 ⭐⭐ gLadder — THE LADDER IS DERIVED, AND EVERY RUNG IS INSIDE THE LINEAR REGION ---- */
/**
 * THE WHOLE OF THE STAGE'S HONESTY LIVES IN THIS GATE. It proves, by machine:
 *  · λ1 is EXACTLY 1 — the shipped anchor is the TRUTH, not a counterfactual;
 *  · λ2 came out of the ENGINE's own `DEFAULT_POLICY.passBase`, not a typed 5;
 *  · λ3 came out of the COMMITTED margin preflight (SHA-guarded), re-derived from ITS OWN
 *    per-seed cells rather than trusting its headline, and divided by the zone differential
 *    the source's beliefs give at λ = 1;
 *  · λ4 = 10 × λ3, capped AT the derived boundary;
 *  · EVERY RUNG IS ≤ λ_LIN, and at every rung the served belief is exactly `λ · belief_true`
 *    within the rounding the integer writer forces — i.e. NO CLAMP INTERVENED anywhere on
 *    the ladder, so the price the chooser sees really is linear in λ;
 *  · the preflight seeds are DISJOINT from the battery seeds (the ladder cannot be tuned to
 *    the worlds it is then measured on);
 *  · the derivation population is NON-VACUOUS.
 */
const beliefLinearityErr = Math.max(...ARMS.map((a) => Math.max(...lambdaBelief(LAMBDA[a])
  .map((v, z) => Math.abs(v - LAMBDA[a] * DV_DOSE_BELIEF[z])))));
/** the largest served belief anywhere on the ladder — 1.0 would mean a clamp bit. */
const maxServedBelief = Math.max(...ARMS.map((a) => Math.max(...lambdaBelief(LAMBDA[a]))));
const marginSeedRange: [number, number] = [MARGIN_BASE, MARGIN_BASE + MARGIN_SEEDS_FULL - 1];
registerGate<{
  lam1: number; lam2: number; lam2Want: number; lam3: number; lam3Want: number;
  lam4: number; lam4Want: number; lin: number; maxBelief: number; linErr: number;
  maxRung: number; roundTol: number;
  sha: string; shaWant: string; rederived: string;
  marginN: number; marginDen: number; margin: number;
  disjoint: boolean; increasing: boolean; passBase: number; merged: boolean;
  armsWalked: number; distinct: number;
}>({
  name: 'gLadder',
  fn: (i) => ({
    theAnchorRungIsExactlyTheTruth: i.lam1 === 1,
    theUnitRungIsTheEnginesOwnPassBaseInverse: i.lam2 === i.lam2Want && i.passBase > 0,
    theMarginRungIsTheDerivedQuotientOrTheBoundary:
      i.lam3 === Math.min(i.lam3Want, i.lin),
    theSaturationRungIsTenTimesTheMarginRungOrTheBoundary:
      i.lam4 === Math.min(i.lam4Want, i.lin),
    theMergedFourthRungIsDeclaredHonestly: i.merged === (i.lam4 === i.lam3),
    everyDistinctRungWasWalkedExactlyOnce: i.armsWalked === i.distinct,
    everyRungIsInsideTheDerivedLinearRegion: i.maxRung <= i.lin,
    /** ⭐ the served belief IS λ × the truth, up to the integer rounding the shipped writer
     *  forces (note() writes whole labels) — i.e. NO CLAMP ALTERED THE DOSE. */
    theServedBeliefIsExactlyLambdaTimesTheTruthUpToIntegerRounding: i.linErr <= i.roundTol,
    noRungExceedsTheClampCeiling: i.maxBelief <= 1,
    theWalkedLadderIsStrictlyIncreasing: i.increasing,
    theMarginCameFromTheCommittedPreflight: i.sha === i.shaWant,
    theCommittedPreflightRederivesItsOwnDigest: i.sha === i.rederived,
    theMarginPopulationIsNonVacuous: i.marginN > 0 && i.marginDen > 0 && i.margin > 0,
    thePreflightSeedsAreDisjointFromTheBatterySeeds: i.disjoint,
  }),
  input: {
    lam1: LAMBDA.lam1, lam2: LAMBDA.lam2, lam2Want: 1 / DEFAULT_POLICY.passBase,
    lam3: LAMBDA.lam3, lam3Want: LAMBDA3_RAW,
    lam4: LAMBDA4_USED, lam4Want: LAMBDA4_RAW,
    merged: LAMBDA4_USED === LAMBDA3_USED,
    armsWalked: ARMS.length,
    distinct: new Set([LAMBDA.lam1, LAMBDA.lam2, LAMBDA.lam3, LAMBDA4_USED]).size,
    lin: DV_LAMBDA_LIN, maxBelief: maxServedBelief, linErr: beliefLinearityErr,
    maxRung: Math.max(LAMBDA.lam1, LAMBDA.lam2, LAMBDA.lam3, LAMBDA4_USED),
    roundTol: 0.5 / Math.min(...DV_DOSE.map((c) => c.deliveries)) + 1e-12,
    sha: MARGIN_FILE_SHA, shaWant: MARGIN_SHA, rederived: MARGIN_REDERIVED_SHA,
    marginN: MARGIN_FILE.perSeedCells.length,
    marginDen: sum(MARGIN_FILE.perSeedCells.map((r) => r.passInTopTwo)),
    margin: MARGIN_MEAN,
    disjoint: !overlaps(marginSeedRange, [BASE_RUN, BASE_RUN + N_RUN - 1]),
    increasing: LAMBDA.lam1 < LAMBDA.lam2 && LAMBDA.lam2 < LAMBDA.lam3,
    passBase: PASS_BASE,
  },
  mutants: [
    { conjunct: 'theAnchorRungIsExactlyTheTruth', name: 'the anchor was not the true dose', mutate: (i) => ({ ...i, lam1: 1.5 }) },
    { conjunct: 'theUnitRungIsTheEnginesOwnPassBaseInverse', name: 'λ2 was typed rather than derived from passBase', mutate: (i) => ({ ...i, lam2: i.lam2 + 1 }) },
    { conjunct: 'theMarginRungIsTheDerivedQuotientOrTheBoundary', name: 'λ3 drifted off its own quotient', mutate: (i) => ({ ...i, lam3Want: 2 }) },
    { conjunct: 'theSaturationRungIsTenTimesTheMarginRungOrTheBoundary', name: 'λ4 was not 10×λ3 (nor the cap)', mutate: (i) => ({ ...i, lam4Want: 2 }) },
    { conjunct: 'everyRungIsInsideTheDerivedLinearRegion', name: '⭐ a rung left the linear region', mutate: (i) => ({ ...i, maxRung: i.lin * 2 }) },
    { conjunct: 'theServedBeliefIsExactlyLambdaTimesTheTruthUpToIntegerRounding', name: '⭐ a clamp altered the dose (the price stopped being linear in λ)', mutate: (i) => ({ ...i, linErr: 1 }) },
    { conjunct: 'noRungExceedsTheClampCeiling', name: 'a served belief ran past the ceiling', mutate: (i) => ({ ...i, maxBelief: 2 }) },
    { conjunct: 'theWalkedLadderIsStrictlyIncreasing', name: 'two walked rungs collapsed onto each other', mutate: (i) => ({ ...i, increasing: false }) },
    { conjunct: 'theMergedFourthRungIsDeclaredHonestly', name: 'a coincident rung was published as if distinct', mutate: (i) => ({ ...i, merged: !i.merged }) },
    { conjunct: 'everyDistinctRungWasWalkedExactlyOnce', name: 'a distinct rung went unwalked (or a duplicate was walked)', mutate: (i) => ({ ...i, distinct: i.distinct + 1 }) },
    { conjunct: 'theMarginCameFromTheCommittedPreflight', name: 'the preflight artifact was swapped', mutate: (i) => ({ ...i, shaWant: 'deadbeef' }) },
    { conjunct: 'theCommittedPreflightRederivesItsOwnDigest', name: 'the preflight artifact was hand-edited under its own digest', mutate: (i) => ({ ...i, rederived: 'deadbeef' }) },
    { conjunct: 'theMarginPopulationIsNonVacuous', name: 'the margin was derived on nothing', mutate: (i) => ({ ...i, marginDen: 0 }) },
    { conjunct: 'thePreflightSeedsAreDisjointFromTheBatterySeeds', name: 'the ladder was tuned on the battery\'s own worlds', mutate: (i) => ({ ...i, disjoint: false }) },
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

/* ---- 12 ⭐⭐ gFaces — RE-DERIVED FROM THE **SERIALIZED ARTIFACT** (#287.1, THE NEW CANON) ---- */
/**
 * ⭐⭐ THE gFaces LESSON, RIDDEN RATHER THAN ANNOUNCED (#287.1, and #286.5's own defect class
 * "AN INHERITED FIX ANNOUNCED IS NOT A FIX RIDDEN"). BU-T0's `gFaces` re-ran the FACES
 * closures over the same IN-MEMORY `Row` objects that produced them — a self-consistency
 * check that a dropped serialization field would have sailed straight through. THIS gate
 * PARSES THE JSON THAT WAS WRITTEN TO DISK, rebuilds a `Row` from each stored cell, and
 * re-sums every published numerator and denominator from those rebuilt rows. A field that
 * `cellOf` forgot to serialize therefore FAILS THE GATE instead of hiding behind the objects
 * that produced it.
 */
const rowFromCell = (c: Record<string, unknown>): Row => ({
  seed: Number(c.seed), signature: String(c.sig), armOk: Boolean(c.armOk),
  lifecycle: c.life as Lifecycle,
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
/** filled AFTER pass 1 has physically written the artifact — the gate reads the FILE. */
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
    theBaseIsTheDispatchedFloor: i.base === 112_000,
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
  /** ⭐ EVERY DOSE ARM AGAINST λ1 — the response curve, one row per face. */
  contrastsVsLambda1: Object.fromEntries(DOSE_ARMS.map((a) => {
    const c = f.contrasts[a];
    return [a, {
      lambda: LAMBDA[a],
      delta: round(c.delta), ci95: c.ci95.map((x: number) => round(x)),
      relative: round(c.relative),
      resolved: (c.ci95[0] > 0 && c.ci95[1] > 0) || (c.ci95[0] < 0 && c.ci95[1] < 0),
    }];
  })),
  /** ⭐ MONOTONE = the point estimate moves the SAME WAY at every rung and the top rung
   *  RESOLVES. The pre-registered read's own predicate, computed, never eyeballed. */
  monotoneResolvedResponse: (() => {
    const ds = DOSE_ARMS.map((a) => f.contrasts[a].delta);
    const top = f.contrasts[DOSE_ARMS[DOSE_ARMS.length - 1]].ci95;
    const resolvedAtTop = (top[0] > 0 && top[1] > 0) || (top[0] < 0 && top[1] < 0);
    const up = ds.every((d, i) => i === 0 || d >= ds[i - 1]) && ds[ds.length - 1] > 0;
    const down = ds.every((d, i) => i === 0 || d <= ds[i - 1]) && ds[ds.length - 1] < 0;
    return resolvedAtTop && (up || down);
  })(),
});

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: '⭐⭐ BU-T0b — THE PRICE-SEPARATION PROBE (INSTRUMENT-ONLY, NOTHING SHIPS)',
  doc: 'docs/world-model/BU-T0B-PRICE-SEPARATION.md',
  contract: 'docs/world-model/BU-BUILDUP-CONTRACT.md §2 M-BU.1–4 / §3, bound by #285.1; '
    + 'this stage authorized by ruling #287.6; the base harness is BU-T0 '
    + '(docs/world-model/BU-T0-DV-COMPOSITION.md, incl. its §COMMANDER CORRECTIONS OF RECORD)',
  counterfactualWarning: '⭐⭐⭐ EVERY ARM EXCEPT lam1 IS A COUNTERFACTUAL WORLD. lam1 (λ=1) is the '
    + 'TRUE learned dose — BU-T0\'s own v7dv arm on virgin seeds. Every other arm doses the '
    + 'books so the shipped writer serves λ · belief_true: A WORLD THAT NEVER EXISTED. Its '
    + 'numbers are NOT measurements of the shipped game and NOTHING here ships or is scored. '
    + 'The yardstick FACE DEFINITIONS ARE UNCHANGED from BU-T0 (#256.2) — the counterfactual '
    + 'is in the DOSE and nowhere else.',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'BU-T0\'s null has TWO live explanations — (a) GRAIN: the DV belief indexes one '
      + 'of three pitch thirds and is structurally blind to lane-shaped risk; (b) LOUDNESS: '
      + 'the learned price (belief · passBase ≈ 0.0038–0.0084 score units) is too quiet to '
      + 'move any chooser. THE SEPARATING QUESTION: IF THE SAME ZONE-GRAIN KNOWLEDGE WERE '
      + 'PRICED LOUDER, WOULD USAGE MOVE?',
    preRegisteredRead: {
      LOUDNESS_BINDS: 'a RESOLVED MONOTONE usage response appearing by λ3/λ4.',
      GRAIN_PROVEN: 'FLAT at every rung including saturation.',
      MIXED: 'a response only at saturation, with degenerate texture (describe it).',
      note: '⚠ DEGENERATE BEHAVIOUR AT λ4 IS PART OF THE RESPONSE CURVE, NOT A FAILURE: a '
        + 'chooser that stops entering any learned-loss zone is a reportable answer.',
      routing: 'the verdict routes to the commander either way; this stage FIXES NOTHING.',
    },
    arms: {
      lam1: 'THE SHIPPED ANCHOR — λ = 1, the TRUE dose (BU-T0\'s v7dv arm on virgin seeds). '
        + 'The books carry the committed DV-T2-T1 exam\'s MATURED cells, its learnConsume '
        + 'arm\'s final checkpoint POOLED over all 40 books, written through the book\'s own '
        + 'note(). The exposure weight is NOT armed (M-DV2.4: it is not learned), so the ONLY '
        + 'live limb is the LEARNED LOSS-COST BELIEF. NOT A COUNTERFACTUAL.',
      lam2: '⚠ COUNTERFACTUAL — λ = passBase⁻¹ (the UNIT argument: belief · passBase · '
        + 'passBase⁻¹ = the belief itself, in score units).',
      lam3: '⚠ COUNTERFACTUAL — λ = MARGIN-MATCHED (the loudness threshold).',
      lam4: '⚠ COUNTERFACTUAL — λ = 10 × λ3 (saturation), capped at the linearity boundary.',
      construction: 'ALL FOUR: `new Match({...a4MatchFlags(7), dvLearnedMap, dvDeliveryValue, '
        + 'dvLearnedBooks: dosedDvBooks(λ)})` + `armA4World(m, null, 7, poolT1DoseCells(L3-T1))`. '
        + 'ONLY λ differs between arms.',
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
      'USAGE — backward / lateral / circulation completed-pass share (Q07 conventions verbatim)',
      'SUPPLY — behind-ball options and options/reception, GK-SPLIT RUNGS (#286 canon)',
      'TERMINALS — intercepted share + total loss-to-opponent (⚠ L3-veto entangled at the '
        + 'LEVEL: every arm carries the veto, so the CONTRASTS are entanglement-free by '
        + 'construction while the LEVELS are not — BU-C0 §CORRECTIONS 3)',
      'CONTEXT — Q06 completion · Q01 spell length · Q07 forward share · goals/match',
      '⚠ REPORTED, NEVER GATED: no gate in this probe reads any of them.',
    ],
    reRunClause: 'R-乙 REPORTED on every rung: Q01 spell length · Q05 touches/spell · Q06 '
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
      + 'EVERY arm, so each contrast is the same resampled worlds. All contrasts are against '
      + 'lam1 on the SAME seeds.',
    terminalClasses: TERMINALS,
    pressureRadiusM: PRESSURE_R,
    forwardBandM: FORWARD_BAND_M,
    histogramTopBucket: HIST_MAX,
    beliefZones: DV_ZONES,
  },
  run: {
    N: N_RUN, base: BASE_RUN, arms: ARMS.length, walks: armTotal,
    perturbationControls: perturbCheck.total,
    receptions: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.receptions))])),
    pressedReceptions: Object.fromEntries(ARMS.map((a) => [a,
      sum(rowsOf(a).map((r) => r.receptionsPressed))])),
    pressedCarrierMoments: Object.fromEntries(ARMS.map((a) => [a,
      sum(rowsOf(a).map((r) => r.carrierSamplesPressed))])),
    openSpells: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.openSpells))])),
    attempts: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.attempts))])),
    oracleCalls: oracleReceipt.calls,
  },
  /* ---- ⭐⭐ THE LADDER: its DERIVATION ARITHMETIC AND ITS LINEARITY ANALYSIS ---- */
  ladder: {
    law: '⭐ DERIVED, NEVER TASTE. λ1 = 1 (the shipped anchor, the TRUTH). λ2 = passBase⁻¹ '
      + '(the unit argument, passBase read from the ENGINE\'S OWN DEFAULT_POLICY at run time). '
      + 'λ3 = MARGIN-MATCHED (the loudness threshold, from the declared margin preflight). '
      + 'λ4 = 10 × λ3 (saturation), CAPPED AT the derived linearity boundary.',
    linearity: {
      priceLaw: 'deliveryRiskPrice (src/ai/deliveryValueSeat.ts): '
        + 'price = exposureWeight · exposure + belief[zone(aim)] · valueScale, subtracted from '
        + 'the ONE candidate score in PlayerBrain\'s hoisted groundCandidate. The exposure limb '
        + 'is NOT armed (M-DV2.4), so the live term is exactly belief[zone] · passBase — LINEAR '
        + 'in the belief, with NO clamp of its own and NO clamp on the score downstream.',
      theTwoUpstreamClamps: [
        'dvLossBeliefVector (src/evolution/genome.ts) runs every slot through clamp01',
        'DeliveryAccountBook serves punished[z]/deliveries[z] and punished <= deliveries by '
          + 'the writer\'s own construction',
      ],
      bothBindAt: 'belief = 1',
      lambdaLinearityBoundary: DV_LAMBDA_LIN,
      derivation: 'λ_LIN = min over evidenced zones of D_z / P_z = 1 / max_z belief_true_z',
      bindingZone: DV_ZONES[DV_DOSE_BELIEF.indexOf(Math.max(...DV_DOSE_BELIEF))],
      maxServedBeliefOnTheLadder: round(maxServedBelief, 8),
      maxDeviationFromExactLinearity: beliefLinearityErr,
      note: 'the deviation is the INTEGER ROUNDING the shipped writer forces (note() writes '
        + 'whole labels): served = round(λ·P_z)/D_z, never λ·P_z/D_z exactly.',
      ceiling: '⭐ THE LOUDEST THIS MAP CAN EVER BE, of record: at λ_LIN the mean pairwise '
        + 'zone price differential is ' + String(round(meanZoneDifferential(DV_LAMBDA_LIN), 8))
        + ' score units. No dose through this seam can exceed it.',
    },
    marginPreflight: {
      artifact: MARGIN_PATH,
      declaredResultSha256: MARGIN_SHA,
      observedResultSha256: MARGIN_FILE_SHA,
      rederivedFromTheBodyOnDisk: MARGIN_REDERIVED_SHA,
      seeds: MARGIN_FILE.seeds,
      surface: 'Player.action.scores — PlayerBrain\'s OWN published sorted top-4 candidate '
        + 'table; nothing re-implemented (#256.2)',
      population: 'ON-BALL decisions whose published top-2 CONTAINS a Pass',
      denominator: sum(MARGIN_FILE.perSeedCells.map((r) => r.passInTopTwo)),
      meanAbsMarginReDerivedFromItsOwnCells: MARGIN_MEAN,
      declaredDeviation: '⚠ the dispatch said "top-2 PASS options"; PlayerBrain publishes ONE '
        + 'Pass entry (its own argmax over mates) and discards the runner-up ground pass inside '
        + 'a local loop, so no such pair exists on any shipped surface and re-deriving it would '
        + 'be a PARALLEL ORACLE (#256.2 forbids it). The measured margin is therefore the '
        + 'ACTION-level one. The mate-level margin is SMALLER, so this λ3 is a CONSERVATIVE '
        + '(high) threshold — which is exactly why the ladder does not stop at λ3.',
    },
    zoneDifferentialAtLambdaOne: ZONE_DIFF_AT_ONE,
    twoLoudnessAxes: {
      note: '⭐⭐ THE PRICE HAS TWO WAYS TO MOVE A CHOOSER, and they have DIFFERENT ceilings. '
        + 'This is the arithmetic that makes the stage readable.',
      differentialAxis: 'WHICH ZONE to pass into — a price charged equally to every candidate '
        + 'cancels in the argmax, so only the CROSS-ZONE DIFFERENCE re-routes a pass. '
        + `Margin-matched λ = ${LAMBDA3_RAW} — ⚠ ${round(LAMBDA3_RAW / DV_LAMBDA_LIN, 4)}× `
        + 'OUTSIDE the linear region. ⭐ THE CEILING OF RECORD: the loudest attainable mean '
        + `zone differential is ${round(meanZoneDifferential(DV_LAMBDA_LIN), 8)} score units, `
        + `only ${round(meanZoneDifferential(DV_LAMBDA_LIN) / MARGIN_MEAN, 4)} of the choice `
        + 'margin. THE DIFFERENTIAL THRESHOLD IS UNREACHABLE THROUGH THIS SEAM.',
      levelAxis: 'WHETHER TO PASS AT ALL — the DV price is subtracted from GROUND-PASS '
        + 'candidates only (PlayerBrain\'s hoisted groundCandidate), never from Dribble / '
        + 'Shoot / Clear, so its full LEVEL moves pass-vs-not-pass. '
        + `Level-matched λ = ${LAMBDA_LEVEL_MATCHED} — INSIDE the region, and BELOW the walked `
        + `rung 3 (${LAMBDA3_USED}). ⭐ THE LADDER THEREFORE DOES CROSS THE ACTION-LEVEL `
        + `LOUDNESS THRESHOLD, at rung 3 (worst-zone price ${round(priceOfZone(LAMBDA3_USED, 0), 6)} `
        + `vs margin ${round(MARGIN_MEAN, 6)}).`,
      lambdaLevelMatched: LAMBDA_LEVEL_MATCHED,
      lambdaDifferentialMatched: LAMBDA3_RAW,
    },
    zoneDifferentialLaw: 'mean over the three unordered zone pairs of |price_i − price_j|. A '
      + 'price charged EQUALLY to every candidate cancels in an argmax, so the DIFFERENTIAL is '
      + 'the quantity that can move a chooser — and therefore the quantity matched to the margin.',
    arithmetic: `λ3 = margin ${MARGIN_MEAN} / zoneDifferential@1 ${ZONE_DIFF_AT_ONE} `
      + `= ${LAMBDA3_RAW}  ⇒ used ${LAMBDA3_USED}${LAMBDA3_RAW > DV_LAMBDA_LIN ? ' (CAPPED AT λ_LIN)' : ''}`,
    rungs: LADDER_RUNGS.map((r) => ({
      arm: r.arm,
      walkedAsItsOwnArm: r.walked,
      lambda: r.used,
      lambdaBeforeCapping: r.raw,
      cappedAtTheLinearityBoundary: r.capped,
      counterfactual: r.arm !== 'lam1',
      worstZonePriceScoreUnits: round(priceOfZone(r.used, 0), 8),
      worstZonePriceAsShareOfTheChoiceMargin: round(priceOfZone(r.used, 0) / MARGIN_MEAN, 6),
      servedBelief: lambdaBelief(r.used).map((v) => round(v, 8)),
      doseCells: lambdaDoseCells(r.used),
      priceByZoneScoreUnits: DV_ZONES.map((_, z) => round(priceOfZone(r.used, z), 8)),
      meanPairwiseZoneDifferential: round(meanZoneDifferential(r.used), 8),
      differentialAsShareOfTheChoiceMargin: round(meanZoneDifferential(r.used) / MARGIN_MEAN, 6),
      why: r.why,
    })),
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
    dvTrue: {
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
    houseLaw: '#270 — every dose is written through its book\'s own public note(); the dose '
      + 'appears NOWHERE in info.genome, asserted per walk in gArms.',
    counterfactualDose: '⚠⚠ THE PER-ARM DOSES ARE IN `ladder.rungs[].doseCells`. Only lam1\'s '
      + 'equals `dvTrue.cells`; every other rung keeps the TRUE delivery counts and writes '
      + 'round(λ · P_z) punished labels — A WORLD THAT NEVER EXISTED, reached through the '
      + 'shipped writer.',
  },
  perSeedCells: Object.fromEntries(ARMS.map((a) => [a, rowsOf(a).map(cellOf)])),
  seeds: { claimed: CLAIMED, block: [12_488_000, 12_488_999] },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 112_000, step: STATS_STEP },
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
    '⭐⭐⭐ EVERY ARM EXCEPT lam1 IS A COUNTERFACTUAL. Its faces describe a world that never '
      + 'existed and are NOT measurements of the shipped game.',
    'NOTHING IS SCORED HERE. INSTRUMENT-ONLY, NOTHING SHIPS (#287.6). H-BU.1 is scored at ARC '
      + 'EXIT on the assembled composition (#286.3\'s amended seat).',
    'NO WEIGHT WAS TOUCHED and NO FACE DEFINITION MOVED (#256.2 / M-BU.3). The counterfactual '
      + 'enters through the DOSE alone, via the shipped writer.',
    'The option oracle answers "could the engine\'s own machinery get the ball there" — '
      + 'capability, never choice, never perception.',
    '⚠ THE TERMINAL SHARES ARE L3-VETO ENTANGLED AT THE LEVEL (BU-C0 §CORRECTIONS 3): the veto '
      + 'moves ~14.5 pp out of tackled into intercepted. EVERY arm here carries the veto, so the '
      + 'CONTRASTS are entanglement-free by construction; the LEVELS are not, and '
      + 'lossToOpponentShare is the honest cross-arm aggregate.',
    '⚠ THE MARGIN IS AN ACTION-LEVEL MARGIN, not a mate-level one (the declared deviation in '
      + 'ladder.marginPreflight) — λ3 is a CONSERVATIVE threshold.',
    'The DV doses are DECLARED PRESENTATIONS of a committed exam\'s matured books (#270\'s '
      + 'form): the provenance world is the DV-T2-T1 exam\'s substrate, NOT this composition.',
    'The learning door stays OPEN during the battery (BU-T0 §DOUBTS 4, inherited): each match '
      + 'adds ~10² labels to books holding ~10⁵–10⁶, and at high λ that DILUTES the dose '
      + 'slightly toward the truth — a bound, not a measurement.',
    'The pressed-carrier population is a SAMPLE at a declared cadence, not every tick.',
    '⚠ THE #269.2(iv) LIFECYCLE READ IS A RECEIPT HERE, NOT A PROOF: the debt was discharged '
      + 'at this composition by BU-T0 (#287.3) and this stage re-claims nothing.',
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
banner(`\n  [bu-t0b] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [bu-t0b] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
const face = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const show = (k: string): string => {
  const f = face(k);
  const rungs = DOSE_ARMS.map((a) => {
    const c = f.contrasts[a];
    const res = (c.ci95[0] > 0 && c.ci95[1] > 0) || (c.ci95[0] < 0 && c.ci95[1] < 0);
    return `${a} ${f.arms[a].point.toFixed(4)} (Δ${c.delta >= 0 ? '+' : ''}`
      + `${c.delta.toFixed(4)}${res ? ' ⭐RESOLVED' : ''})`;
  });
  return `λ1 ${f.arms[REF_ARM].point.toFixed(4)} → ${rungs.join(' · ')}`;
};
banner(`  [bu-t0b] behind-ball options / reception — ${show('behindBallOptionsPerReception')}`);
banner(`  [bu-t0b] OUTFIELD L4 / reception       — ${show('ladderL4OutfieldPerReception')}`);
banner(`  [bu-t0b] backward completions          — ${show('backwardShareOfCompletions')}`);
banner(`  [bu-t0b] circulation completions       — ${show('circulationShareOfCompletions')}`);
banner(`  [bu-t0b] completion rate (Q06)         — ${show('passCompletionRate')}`);
banner(`  [bu-t0b] intercepted terminal share    — ${show('terminal_intercepted')}`);
banner(`  [bu-t0b] loss-to-opponent share        — ${show('lossToOpponentShare')}`);
banner(`  [bu-t0b] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
