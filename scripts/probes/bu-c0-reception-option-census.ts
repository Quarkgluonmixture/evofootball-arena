/**
 * BU-C0 — THE RECEPTION-OPTION CENSUS (docs/world-model/BU-C0-RECEPTION-OPTION-CENSUS.md).
 *
 * The BUILD-UP contract's first instrument (BU-BUILDUP-CONTRACT.md §3, dispatched by #285.2):
 * in the POLISHED world (`?a4world=7` — the CB layer + the learning defence with the MATURED
 * dose, the treated swarm as the honest background), PHOTOGRAPH THE CIRCULATION STRUCTURE.
 *
 * FOUR INSTRUMENTS, ONE BATTERY:
 *   1. BEHIND-BALL OPTIONS — at every reception event and every pressed-carrier moment, how many
 *      team-mates offer a BEHIND-THE-BALL option: POSITION (behind the ball line toward own goal,
 *      on Q07's own ±2 m band) AND REACHABILITY, decided by THE ENGINE'S OWN PASS MACHINERY
 *      (`evaluatePassAffordance`, the evaluator `perceivedPassChoice` prices every live pass
 *      option with) — no parallel oracle is invented (#256.2 commensurability).
 *   2. COMPLETED-PASS DIRECTION MIX — forward / lateral / backward. FORWARD is the R-乙 Q07
 *      instrument VERBATIM: the ENGINE'S OWN counter `team.stats.passesForward`, defined in
 *      `src/sim/mechanics.ts` as `localX(target) − localX(passer) > 2` at the strike. Q07's own
 *      semantics note says its complement POOLS backward and lateral; this stage splits that
 *      complement with the SAME ±2 m rule applied to the same displacement, and publishes the
 *      per-attempt agreement between its own re-derivation and the engine's counter.
 *   3. SPELL TERMINAL-EVENT CENSUS — the #173 / R-乙 Q01 spell segmentation VERBATIM (ported from
 *      `scripts/probes/l3-t2-armed-world-read.ts`, itself the #173 walk), with the terminating
 *      event sub-classified from the ENGINE'S OWN stat deltas at the terminating tick.
 *   4. E7 AT WORLD GRAIN — where the aheadBias structure actually puts bodies at receptions.
 *
 * ⭐ #246 PRE-REGISTERED: real build-up teams keep 2–3 behind-ball options; ours is expected
 *    ≈ 0–1. An INVERSION routes to diagnosis, never to celebration.
 *
 * ⭐ INSTRUMENT-ONLY ROUND: `src/**` is BYTE-UNTOUCHED (`xSrcUntouched` compares WORKTREE vs HEAD,
 *    #273.3). Every arm is constructed DIRECTLY with `matchFlags` and the arming is ASSERTED LIVE
 *    on the very match the walk measures (#283.2(iv) — worker-simmed fixtures play the SHIPPED
 *    world, so a fixture-routed arm would measure the wrong world).
 * ⭐ HOUSE LAW #270: the dose NEVER touches `info.genome` — it is written through the book's own
 *    public `note()` by the SHIPPED entry path (`armA4World(m, null, 7, dose)`).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BUC0_MODE (smoke|full, REQUIRED) · BUC0_N · BUC0_OUT.
 *   ANY other `BUC0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is a PREFLIGHT: it may not write a canonical repo path.
 *
 * RUN: BUC0_MODE=full npx tsx scripts/probes/bu-c0-reception-option-census.ts
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
  L3_WORLD_VERSION, L3_T1_SHA, type L3DoseCell,
} from '../../src/game/a4World';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import { passChoiceCandidateGids } from '../../src/ai/perceivedPassChoice';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['BUC0_MODE', 'BUC0_N', 'BUC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BUC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('BU-C0 FATAL — refused env surface. '
    + `rogue BUC0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.BUC0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`BU-C0 FATAL — BUC0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const N_ENV = process.env.BUC0_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.BUC0_N, 10)) : null;
const OUT_ENV = process.env.BUC0_OUT;
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['BUC0_N'] : []),
  ...(OUT_ENV !== undefined ? ['BUC0_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/bu-c0-reception-option-census-smoke.json',
  full: 'docs/world-model/data/bu-c0-reception-option-census.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bu-c0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('BU-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
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
const CONST_SRC = readFileSync(CONST_SRC_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
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
/** ⭐⭐ Q07'S OWN ±2 m BAND, EXTRACTED FROM THE ENGINE'S OWN FORWARD-PASS LINE — never typed.
 *  `if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;` */
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

/* ========================================================================== */
/* §3 THE FROZEN DESIGN — seeds, stats stream, sizing                          */
/* ========================================================================== */
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const BOOTSTRAP = 2000;
const STATS_BASE = 111_600;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400,
];

const BATTERY_BASE = 12_486_100;
const SMOKE_BASE = 12_486_000;
const GUARD_BASE = 12_486_040;
const GUARD_SPAN = 20;
const GWORLD_SEED = 12_486_900;
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
];

/* ========================================================================== */
/* §4 THE TWO ARMS — constructed DIRECTLY with matchFlags (#283.2(iv))         */
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

/** ⭐ THE MATURED DOSE — the SHIPPED entry's own pooled cells, read from the committed L3-T1
 *  artifact at run time and never typed (`poolT1DoseCells`, the world-7 entry path's function). */
const T1_FILE = readJson(T1_PATH);
const DOSE: L3DoseCell[] = poolT1DoseCells(T1_FILE);

type ArmKind = 'armed' | 'bare';
const ARMS: readonly ArmKind[] = ['armed', 'bare'];
const matchOf = (seed: number, arm: ArmKind): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  if (arm === 'bare') return new Match({ seed, teamA, teamB });
  const m = new Match({ seed, teamA, teamB, ...a4MatchFlags(L3_WORLD_VERSION) });
  armA4World(m, null, L3_WORLD_VERSION, DOSE);
  return m;
};

/** ⭐⭐ THE ARM-IDENTITY CONJUNCTS, ASSERTED ON THE MATCH THE WALK MEASURES (#283.2(iv)). */
const armConjuncts = (m: Match, arm: ArmKind): Record<string, boolean> => {
  const mm = m as unknown as {
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    cbChoiceSeat: boolean;
  };
  const dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  const genomeClean = m.teams.every((t) => !JSON.stringify(t.info.genome).includes('l3')
    && !Object.keys(t.info.genome as unknown as Record<string, unknown>)
      .some((k) => k.toLowerCase().includes('defence')));
  if (arm === 'bare') {
    return {
      theArmIsTheBareProductionWorld: a4ArmedVersion(m) === 0,
      noL3DoorIsOpen: !mm.l3DefenceLearn && !mm.l3DefenceVeto && mm.l3Defence === null,
      noCbDoorIsOpen: !mm.cbChoiceSeat,
      theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
      theDoseIsNotInTheGenome: genomeClean,
    };
  }
  return {
    theArmIsTheWorldSevenOfRecord: l3ArmedVersion(m) === L3_WORLD_VERSION
      && a4ArmedVersion(m) === L3_WORLD_VERSION,
    bothL3DoorsAreLiveInThisSim: mm.l3DefenceLearn && mm.l3DefenceVeto && mm.l3Defence !== null,
    theCarryDoorIsLiveInThisSim: mm.cbChoiceSeat,
    theBooksCarryTheMaturedDose: dosed,
    theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
    theDoseIsNotInTheGenome: genomeClean,
  };
};

/* ========================================================================== */
/* §5 THE ORACLE — THE ENGINE'S OWN PASS MACHINERY (#256.2)                    */
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

/** ONE option census at ONE moment: the carrier, his mates, and the engine's own verdicts. */
interface OptionCensus {
  mates: number;
  /* --- L1 POSITION (the Q07 +-2 m band on the ball line) --- */
  behind: number; lateral: number; ahead: number;
  /* --- the LADDER, every rung an ENGINE verdict --- */
  behindFlight: number; behindRace: number; behindUncut: number;
  behindUncutInWindow: number; behindUncutGk: number;
  lateralUncut: number; aheadUncut: number;
  raceAll: number; uncutAll: number;
  /* --- receipts --- */
  oracleCalls: number; oracleNulls: number; corridorCalls: number;
  deltaSum: number; marginSumBehind: number;
}
const CENSUS_KEYS = [
  'mates', 'behind', 'lateral', 'ahead', 'behindFlight', 'behindRace', 'behindUncut',
  'behindUncutInWindow', 'behindUncutGk', 'lateralUncut', 'aheadUncut', 'raceAll', 'uncutAll',
  'oracleCalls', 'oracleNulls', 'corridorCalls', 'deltaSum', 'marginSumBehind',
] as const;
const EMPTY_CENSUS: OptionCensus = Object.fromEntries(
  CENSUS_KEYS.map((k) => [k, 0]),
) as unknown as OptionCensus;

/**
 * THE CENSUS AT ONE MOMENT — A LADDER OF ENGINE VERDICTS, no rung invented here.
 *
 * L1 POSITION: `D = team.localX(mate.x) - team.localX(ball.x)`; BEHIND = `D <= -2`, LATERAL =
 *    `|D| < 2`, AHEAD = `D >= +2`. The +-2 m band is Q07's OWN, EXTRACTED from the engine's
 *    forward-pass line at run time and never typed here.
 * L2 THE BALL CAN GET THERE: `evaluatePassAffordance` returns an affordance AND its flight is
 *    `reachable` -- the engine's own ground-pass prediction under its own friction and its own
 *    launch-speed law says the ball arrives at all.
 * L3 THE RECEIVER WINS THE RACE: `arrivalMargin > 0` -- the intended receiver reaches the landing
 *    point before ANY opponent. A SIGN test on the engine's own quantity.
 * L4 THE CORRIDOR IS NOT CUT: no opponent has an `evaluatePassCorridorInterception` fact with a
 *    non-null `earliestFeasiblePoint` -- i.e. nobody can meet the ball ON ITS PATH. Also a sign
 *    test (`margin >= 0`) inside the engine's own corridor sampler.
 * L5 (reported beside): the option is inside the engine's OWN pass-choice window
 *    (`passChoiceCandidateGids`, 6-30 m, keepers excluded -- the window the live perceived chooser
 *    enumerates over).
 *
 * ⭐ THE PUBLISHED "OPTION" IS L1 AND L2 AND L3 AND L4. Every weaker rung is published beside it,
 * so the drop-off itself is a measured face and nothing is hidden behind one definition.
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
    if (isBehind) out.behind += 1; else if (isAhead) out.ahead += 1; else out.lateral += 1;
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
    if (isBehind) out.behindFlight += 1;
    if (res.affordance.arrivalMargin <= 0) continue;
    out.raceAll += 1;
    if (isBehind) {
      out.behindRace += 1;
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
      if (mate.role === 'GK') out.behindUncutGk += 1;
    } else if (isAhead) out.aheadUncut += 1;
    else out.lateralUncut += 1;
  }
  return out;
};
const addCensus = (a: OptionCensus, b: OptionCensus): void => {
  for (const k of CENSUS_KEYS) a[k] += b[k];
};

/* ========================================================================== */
/* §6 THE WALK — #173's spell/touch semantics + the four instruments            */
/* ========================================================================== */
type Terminator = 'opponentControl' | 'fouledWon' | 'foulCommitted' | 'goal' | 'outOfPlay'
  | 'matchEnd';
/** the TERMINAL-EVENT census classes — every spell lands in EXACTLY one (gSpells proves it). */
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
  /* --- instrument 1: the option census at receptions and pressed-carrier moments --- */
  receptions: number;
  receptionsPressed: number;
  receptionsOpenPlay: number;
  atReceptions: OptionCensus;
  atPressedReceptions: OptionCensus;
  carrierSamples: number;
  carrierSamplesPressed: number;
  atPressedCarrier: OptionCensus;
  /** hist[k] = receptions offering exactly k behind-ball options (k >= HIST_MAX pooled). */
  behindHist: number[];
  behindHistPressed: number[];
  /* --- instrument 2: the direction mix --- */
  attempts: number; attemptsUnattributed: number;
  attemptsForwardEngine: number; attemptsForwardMine: number;
  attemptsBackwardMine: number; attemptsLateralMine: number;
  attemptsAgreeWithEngine: number;
  completed: number; completedForwardEngine: number;
  completedBackwardMine: number; completedLateralMine: number;
  completedToIntendedTarget: number;
  enginePasses: number; enginePassesForward: number; enginePassesCompleted: number;
  /* --- instrument 3: the spell terminal census --- */
  spells: number; openSpells: number; openSpellTickSum: number; openSpellTouchSum: number;
  terminalAll: Record<TerminalClass, number>;
  terminalOpen: Record<TerminalClass, number>;
  /* --- clock honesty --- */
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
 * ONE match, ONE arm. `measure=false` walks the SAME world with the instrument switched off —
 * the NON-PERTURBATION control (`gNonPerturbing`): the oracle must not move the football.
 */
const walk = (seed: number, arm: ArmKind, measure = true): Row => {
  const m = matchOf(seed, arm);
  const armOk = Object.values(armConjuncts(m, arm)).every(Boolean);

  const row: Row = {
    seed, signature: '', armOk,
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
  /** the per-tick stat deltas, both teams — the ENGINE's own counters. */
  const statKeys = ['passes', 'passesCompleted', 'passesForward', 'tackles', 'interceptions',
    'miscontrols', 'clearances', 'longBalls', 'shots', 'fouls'] as const;
  type StatKey = (typeof statKeys)[number];
  const prev: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of statKeys) prev[k] = [0, 0];
  const delta: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of statKeys) delta[k] = [0, 0];
  /** ⭐ THE TERMINAL-EVENT TAPE. A tackle sets `ball.owner = null` and the ball SQUIRTS — the
   *  spell does not end until an opponent establishes ownership, which can be many ticks later,
   *  so a fixed window around the terminating tick would miss it (measured: it missed EVERY
   *  tackle). The tape records every tick at which one of the six terminal counters moved, and
   *  the class is read from the LATEST such event INSIDE THE SPELL'S OWN SPAN — spell-scoped,
   *  no invented window. */
  const TERMINAL_KEYS = ['tackles', 'interceptions', 'miscontrols', 'clearances', 'longBalls',
    'shots'] as const;
  const termEvents: { tick: number; k: (typeof TERMINAL_KEYS)[number]; side: Side }[] = [];

  /** pre-step x (= the previous tick's post-step x) for the pass-direction re-derivation.
   *  `m.allPlayers` order is stable, so a flat array indexed by gid→slot is enough. */
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

    /* --- the engine's own counters, differenced --- */
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

    /* --- instrument 2: the pass attempt, classified on Q07's own rule --- */
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

    /* --- the #173 spell/touch walker, ported verbatim in semantics --- */
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

    /* --- instruments 1 + 4: the option census at THIS reception --- */
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
    /* --- instrument 1b: the PRESSED-CARRIER moment population --- */
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

  /* --- #173's foul lookahead, inherited verbatim --- */
  for (const s of spells) {
    if (s.terminator !== 'outOfPlay') continue;
    const f = foulTicks.find((x) => x.tick >= s.endTick - FOUL_LOOKAHEAD_TICKS
      && x.tick <= s.endTick + FOUL_LOOKAHEAD_TICKS);
    if (f === undefined) continue;
    s.terminator = f.side === s.team ? 'foulCommitted' : 'fouledWon';
  }

  /* --- the TERMINAL-EVENT sub-classification, from the engine's own event tape --- */
  /** the LATEST qualifying event inside the spell's own span, or null. */
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

  /* --- the roll-up --- */
  row.signature = signature(m);
  row.spells = spells.length;
  const open = spells.filter((s) => s.origin === 'openPlay');
  row.openSpells = open.length;
  row.openSpellTickSum = sum(open.map((s) => s.endTick - s.startTick));
  row.openSpellTouchSum = sum(open.map((s) => s.touches));
  row.attempts = attempts.length;
  row.attemptsForwardEngine = attempts.filter((a) => a.forwardEngine).length;
  row.attemptsForwardMine = attempts.filter((a) => a.mine === 'forward').length;
  /* ⭐ THE COMPLEMENT SPLIT: the engine's own verdict decides FORWARD; the probe's ±2 m
   * re-derivation only splits what the engine pooled, so the three shares sum to exactly 1. */
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
/* §7 THE BATTERY                                                              */
/* ========================================================================== */
const N_RUN = N_ENV ?? (MODE === 'smoke' ? 4 : N_FROZEN);
const BASE_RUN = MODE === 'smoke' && N_ENV === null ? SMOKE_BASE
  : (IS_PREFLIGHT ? GUARD_BASE : BATTERY_BASE);

interface Battery { rows: Record<ArmKind, Row[]> }
const runBattery = (): Battery => {
  const rows: Record<ArmKind, Row[]> = { armed: [], bare: [] };
  for (const arm of ARMS) {
    for (let i = 0; i < N_RUN; i++) rows[arm].push(walk(BASE_RUN + i, arm));
    banner(`  [bu-c0] ${arm} — ${N_RUN} walks done`);
  }
  return { rows };
};

/* ========================================================================== */
/* §8 THE FACES — every one a RATIO OF SUMS over the stored per-seed rows       */
/* ========================================================================== */
type Face = { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string };
const perMatch = (): number => 1;
const FACES: Record<string, Face> = {
  /* ---- instrument 1: BEHIND-BALL OPTIONS ---- */
  behindBallOptionsPerReception: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.receptions,
    unit: 'options / reception',
    what: '⭐⭐ THE HEADLINE (#246) — behind-the-ball team-mates the ENGINE\'S OWN machinery calls '
      + 'a live option (L1 position + L2 the ball gets there + L3 the receiver wins the race + '
      + 'L4 the corridor is not cut), per reception event',
  },
  behindBallOptionsPerPressedReception: {
    num: (r) => r.atPressedReceptions.behindUncut, den: (r) => r.receptionsPressed,
    unit: 'options / pressed reception',
    what: '⭐ the same count at PRESSED receptions (the build-up moment that matters)',
  },
  behindBallOptionsPerPressedCarrierMoment: {
    num: (r) => r.atPressedCarrier.behindUncut, den: (r) => r.carrierSamplesPressed,
    unit: 'options / pressed-carrier moment',
    what: '⭐ the same count at PRESSED-CARRIER moments (sampled every 12 ticks)',
  },
  behindBallBodiesPerReception: {
    num: (r) => r.atReceptions.behind, den: (r) => r.receptions,
    unit: 'bodies / reception',
    what: 'RUNG L1, POSITION ONLY — team-mates behind the ball line, option or not (E7\'s structure)',
  },
  shareReceptionsWithNoBehindOption: {
    num: (r) => r.behindHist[0], den: (r) => r.receptions,
    unit: 'share of receptions',
    what: '⭐⭐ NOWHERE BACKWARD TO GO — receptions offering ZERO behind-ball option (full ladder)',
  },
  shareReceptionsWithTwoOrMore: {
    num: (r) => r.receptions - r.behindHist[0] - r.behindHist[1], den: (r) => r.receptions,
    unit: 'share of receptions',
    what: '⭐ the #246 BAND — receptions offering 2 or more (real build-up teams keep 2–3)',
  },
  shareOfPressedReceptionsWithNoBehindOption: {
    num: (r) => r.behindHistPressed[0], den: (r) => r.receptionsPressed,
    unit: 'share of pressed receptions',
    what: 'the same emptiness, under pressure',
  },
  reachableOptionsPerReception: {
    num: (r) => r.atReceptions.uncutAll, den: (r) => r.receptions,
    unit: 'options / reception',
    what: 'ALL live options (any direction, full ladder) — the total behind-ball is a slice of',
  },
  aheadOptionsPerReception: {
    num: (r) => r.atReceptions.aheadUncut, den: (r) => r.receptions,
    unit: 'options / reception',
    what: 'live options AHEAD of the ball line (full ladder)',
  },
  lateralOptionsPerReception: {
    num: (r) => r.atReceptions.lateralUncut, den: (r) => r.receptions,
    unit: 'options / reception', what: 'live options in the ±2 m LATERAL band (full ladder)',
  },
  behindOptionsInEngineWindowPerReception: {
    num: (r) => r.atReceptions.behindUncutInWindow, den: (r) => r.receptions,
    unit: 'options / reception',
    what: 'behind-ball options that are ALSO inside the engine\'s own 6–30 m pass-choice window',
  },
  keeperBehindOptionsPerReception: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.receptions,
    unit: 'options / reception', what: 'how often the KEEPER is the behind-ball option',
  },
  /* ---- instrument 4: E7 AT WORLD GRAIN ---- */
  shareOfTeammatesBehindAtReception: {
    num: (r) => r.atReceptions.behind, den: (r) => r.atReceptions.mates,
    unit: 'share of team-mates',
    what: '⭐ E7 AT WORLD GRAIN — the share of team-mates standing behind the ball line',
  },
  shareOfTeammatesAheadAtReception: {
    num: (r) => r.atReceptions.ahead, den: (r) => r.atReceptions.mates,
    unit: 'share of team-mates', what: 'E7 — the share standing AHEAD of the ball line',
  },
  meanTeammateDeltaAtReception: {
    num: (r) => r.atReceptions.deltaSum, den: (r) => r.atReceptions.mates,
    unit: 'metres (+ = ahead of the ball)',
    what: '⭐ E7 — the mean longitudinal offset of a team-mate from the ball at a reception',
  },
  behindReachabilityRate: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.atReceptions.behind,
    unit: 'share of behind-ball bodies',
    what: '⭐ THE DIAGNOSIS SPLIT — of the bodies that ARE behind the ball, how many survive the '
      + 'whole engine ladder',
  },
  aheadReachabilityRate: {
    num: (r) => r.atReceptions.aheadUncut, den: (r) => r.atReceptions.ahead,
    unit: 'share of ahead bodies', what: 'the same rate for bodies ahead of the ball',
  },
  /* ---- THE LADDER'S OWN DROP-OFF (which rung kills the option) ---- */
  behindBodiesTheBallCanReachPerReception: {
    num: (r) => r.atReceptions.behindFlight, den: (r) => r.receptions,
    unit: 'bodies / reception',
    what: 'RUNG L2 — behind-ball team-mates the engine\'s own flight prediction says the ball '
      + 'actually reaches',
  },
  behindOptionsWinningTheRacePerReception: {
    num: (r) => r.atReceptions.behindRace, den: (r) => r.receptions,
    unit: 'options / reception',
    what: 'RUNG L3 — … and whose receiver beats every opponent to the landing point',
  },
  behindCorridorSurvivalRate: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.atReceptions.behindRace,
    unit: 'share of race-winning behind options',
    what: '⭐ RUNG L4\'S OWN BITE — of the behind-ball balls that win the race, how many the '
      + 'engine\'s corridor sampler says nobody can cut',
  },
  meanArrivalMarginOfBehindOptions: {
    num: (r) => r.atReceptions.marginSumBehind, den: (r) => r.atReceptions.behindRace,
    unit: 'seconds', what: 'how comfortably the behind-ball race is won, when it is won',
  },
  /* ---- instrument 2: THE DIRECTION MIX ---- */
  forwardShareOfAttempts: {
    num: (r) => r.attemptsForwardEngine, den: (r) => r.attempts,
    unit: 'share of pass attempts',
    what: '⭐ Q07 VERBATIM — the ENGINE\'S OWN forward counter over attributed attempts',
  },
  backwardShareOfAttempts: {
    num: (r) => r.attemptsBackwardMine, den: (r) => r.attempts,
    unit: 'share of pass attempts',
    what: 'Q07\'s POOLED complement, split: BACKWARD (Δ < −2 m on the same displacement)',
  },
  lateralShareOfAttempts: {
    num: (r) => r.attemptsLateralMine, den: (r) => r.attempts,
    unit: 'share of pass attempts', what: 'Q07\'s pooled complement, split: LATERAL (|Δ| <= 2 m)',
  },
  forwardShareOfCompletions: {
    num: (r) => r.completedForwardEngine, den: (r) => r.completed,
    unit: 'share of completed passes',
    what: '⭐⭐ THE COMPLETED-PASS DIRECTION MIX — forward',
  },
  backwardShareOfCompletions: {
    num: (r) => r.completedBackwardMine, den: (r) => r.completed,
    unit: 'share of completed passes', what: '⭐⭐ the completed mix — BACKWARD',
  },
  lateralShareOfCompletions: {
    num: (r) => r.completedLateralMine, den: (r) => r.completed,
    unit: 'share of completed passes', what: '⭐⭐ the completed mix — LATERAL',
  },
  passCompletionRate: {
    num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
    unit: 'share', what: 'Q06 cross-check — the engine\'s own completion rate',
  },
  attemptsPerMatch: {
    num: (r) => r.attempts, den: perMatch, unit: 'attributed attempts / match',
    what: 'the direction mix\'s denominator, per match',
  },
  /* ---- instrument 3: THE SPELL TERMINAL CENSUS (open-play spells) ---- */
  ...Object.fromEntries(TERMINALS.map((t) => [`terminal_${t}`, {
    num: (r: Row) => r.terminalOpen[t], den: (r: Row) => r.openSpells,
    unit: 'share of open-play spells',
    what: `⭐ THE TERMINAL CENSUS — open-play spells ending in: ${t}`,
  }])) as Record<string, Face>,
  /* ---- the R-乙 cross-checks ---- */
  spellMeanSeconds: {
    num: (r) => r.openSpellTickSum * DT, den: (r) => r.openSpells,
    unit: 'sim-seconds', what: 'Q01 cross-check — the mean open-play spell duration',
  },
  touchesPerSpell: {
    num: (r) => r.openSpellTouchSum, den: (r) => r.openSpells,
    unit: 'touches / spell', what: 'Q05 cross-check',
  },
  pressedReceptionShare: {
    num: (r) => r.receptionsPressed, den: (r) => r.receptions,
    unit: 'share of receptions',
    what: 'Q14-shaped cross-check — receptions with an opponent inside the pressure radius '
      + '(⚠ ALL receptions, not Q14\'s first-of-spell population)',
  },
  receptionsPerMatch: {
    num: (r) => r.receptions, den: perMatch, unit: 'receptions / match',
    what: 'the census\'s own denominator, per match (dual-axis: see the clock block)',
  },
  openSpellsPerMatch: {
    num: (r) => r.openSpells, den: perMatch, unit: 'open-play spells / match', what: 'context',
  },
};
const FACE_KEYS = Object.keys(FACES);

/* ---- the estimator: CLUSTER BOOTSTRAP over match seeds ---- */
let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
interface FaceRow {
  face: string; unit: string; what: string;
  arms: Record<string, { point: number; num: number; den: number; ci95: [number, number] }>;
  contrast: { delta: number; ci95: [number, number]; relative: number };
}
const scoreFaces = (b: Battery): FaceRow[] => {
  const K = b.rows.armed.length;
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
    const vals: number[] = [];
    for (const idx of draws) {
      let nA = 0; let dA = 0; let nB = 0; let dB = 0;
      for (const i of idx) {
        nA += nums.armed[i]; dA += dens.armed[i];
        nB += nums.bare[i]; dB += dens.bare[i];
      }
      vals.push(ratio(nA, dA) - ratio(nB, dB));
    }
    const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
    const delta = point.armed - point.bare;
    out.push({
      face: key, unit: f.unit, what: f.what, arms,
      contrast: {
        delta,
        ci95: s.length === 0 ? [Number.NaN, Number.NaN]
          : [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
        relative: point.bare === 0 ? Number.NaN : delta / point.bare,
      },
    });
  }
  return out;
};

/* ========================================================================== */
/* §9 THE DETERMINISTIC CORE (G-DET runs it twice)                             */
/* ========================================================================== */
interface Core { battery: Battery; faces: FaceRow[] }
const runCore = (): Core => {
  const battery = runBattery();
  return { battery, faces: scoreFaces(battery) };
};
const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, sig: r.signature, armOk: r.armOk,
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

banner(`  [bu-c0] mode=${MODE} N=${N_RUN} seeds × ${ARMS.length} arms × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [bu-c0] G-DET second run…');
const coreB = runCore();
const digestB = coreDigest(coreB);
const C = coreA;

/* ---- the NON-PERTURBATION control: the same worlds, instrument OFF ---- */
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
/* §10 THE READINGS THE GATES SCORE                                            */
/* ========================================================================== */
const rowsOf = (a: ArmKind): Row[] => C.battery.rows[a];
const allRows = (): Row[] => ARMS.flatMap(rowsOf);

const armOkCount = allRows().filter((r) => r.armOk).length;
const armTotal = allRows().length;
const armedProbe = matchOf(GWORLD_SEED, 'armed');
const bareProbe = matchOf(GWORLD_SEED, 'bare');
const worldSeedOk = l3ArmedVersion(armedProbe) === L3_WORLD_VERSION
  && a4ArmedVersion(bareProbe) === 0;

/** ⭐ THE ORACLE RECEIPT — the engine's own evaluator was actually exercised. */
const oracleReceipt = (() => {
  let calls = 0; let nulls = 0; let behind = 0; let race = 0; let uncut = 0; let corridor = 0;
  for (const r of allRows()) {
    for (const c of [r.atReceptions, r.atPressedReceptions, r.atPressedCarrier]) {
      calls += c.oracleCalls; nulls += c.oracleNulls; corridor += c.corridorCalls;
      behind += c.behind; race += c.raceAll; uncut += c.uncutAll;
    }
  }
  return {
    calls, nulls, behind, race, uncut, corridor,
    nullShare: calls === 0 ? Number.NaN : nulls / calls,
    /** the LADDER's own drop-off, pooled: of the options that win the race, how many survive
     *  the engine's own corridor test. */
    uncutGivenRace: race === 0 ? Number.NaN : uncut / race,
  };
})();

/** ⭐ THE Q07 BOOK-KEEPING — the engine's own counters vs the attributed attempts. */
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

/** the SPELL book-keeping: every spell lands in exactly one terminal class. */
const spellReceipt = (() => {
  let spells = 0; let classified = 0; let open = 0; let openClassified = 0;
  for (const r of allRows()) {
    spells += r.spells; open += r.openSpells;
    classified += sum(TERMINALS.map((t) => r.terminalAll[t]));
    openClassified += sum(TERMINALS.map((t) => r.terminalOpen[t]));
  }
  return { spells, classified, open, openClassified, closes: spells === classified && open === openClassified };
})();

/** the HISTOGRAM book-keeping: the buckets sum to the reception count. */
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

/** NON-VACUITY at claim grain: every published face's denominator, per arm. */
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

/** gFaces: every published point re-derives from the stored per-seed cells alone. */
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

/* ---- gSeed ---- */
const CLAIMED: { name: string; range: [number, number] }[] = [
  ...(BASE_RUN === BATTERY_BASE
    ? [{ name: 'BU-C0 battery', range: [BATTERY_BASE, BATTERY_BASE + N_RUN - 1] as [number, number] }]
    : []),
  { name: 'BU-C0 smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 19] },
  { name: 'BU-C0 guard/preflight block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: 'BU-C0 world-identity seed', range: [GWORLD_SEED, GWORLD_SEED] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
const allSeedsInBand = ARMS.every((a) => rowsOf(a)
  .every((r) => r.seed >= BASE_RUN && r.seed <= BASE_RUN + N_RUN - 1));
const pairedSameSeeds = rowsOf('armed').map((r) => r.seed).join(',')
  === rowsOf('bare').map((r) => r.seed).join(',');

/* ========================================================================== */
/* §11 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
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

/* ---- 2 xSrcUntouched (WORKTREE vs HEAD, #273.3) ---- */
const srcDiff = gitOut('git diff --stat -- src');
const srcStatus = gitOut('git status --porcelain -- src');
registerGate<{ diff: string; status: string }>({
  name: 'xSrcUntouched',
  fn: (i) => ({ noWorktreeDiff: i.diff === '', noUntrackedOrStaged: i.status === '' }),
  input: { diff: srcDiff, status: srcStatus },
  mutants: [
    { conjunct: 'noWorktreeDiff', name: 'src moved in the worktree', mutate: (i) => ({ ...i, diff: 'src/sim/Match.ts | 2 +-' }) },
    { conjunct: 'noUntrackedOrStaged', name: 'an untracked src file appeared', mutate: (i) => ({ ...i, status: '?? src/x.ts' }) },
  ],
});

/* ---- 3 gArms — the arming is LIVE IN THE SIM THAT WAS MEASURED (#283.2(iv)) ---- */
registerGate<{ ok: number; total: number; probe: boolean; arms: number; paired: boolean }>({
  name: 'gArms',
  fn: (i) => ({
    everyWalkedMatchCarriesItsArmLive: i.ok === i.total,
    theIdentitySeedSeparatesTheTwoWorlds: i.probe,
    twoArmsWalked: i.arms === 2,
    theArmsWalkTheSameSeeds: i.paired,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: { ok: armOkCount, total: armTotal, probe: worldSeedOk, arms: ARMS.length, paired: pairedSameSeeds },
  mutants: [
    { conjunct: 'everyWalkedMatchCarriesItsArmLive', name: 'a walk was not its arm', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theIdentitySeedSeparatesTheTwoWorlds', name: 'the two worlds were not distinguishable', mutate: (i) => ({ ...i, probe: false }) },
    { conjunct: 'twoArmsWalked', name: 'an arm was dropped', mutate: (i) => ({ ...i, arms: 1 }) },
    { conjunct: 'theArmsWalkTheSameSeeds', name: 'the arms were not paired', mutate: (i) => ({ ...i, paired: false }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 4 gDose — the matured dose IS the shipped entry's own pooled cells ---- */
const doseLabels = sum(DOSE.map((c) => c.lunges));
registerGate<{ sha: string; labels: number; groups: number }>({
  name: 'gDose',
  fn: (i) => ({
    theDoseComesFromTheCommittedExam: i.sha === L3_T1_SHA,
    theDoseIsNonEmpty: i.labels > 0,
    theDoseHasBothArrivalGroups: i.groups === 2,
  }),
  input: {
    sha: String((T1_FILE as { resultSha256?: string }).resultSha256 ?? ''),
    labels: doseLabels, groups: DOSE.length,
  },
  mutants: [
    { conjunct: 'theDoseComesFromTheCommittedExam', name: 'the exam artifact was swapped', mutate: (i) => ({ ...i, sha: 'deadbeef' }) },
    { conjunct: 'theDoseIsNonEmpty', name: 'the dose was empty', mutate: (i) => ({ ...i, labels: 0 }) },
    { conjunct: 'theDoseHasBothArrivalGroups', name: 'a group went missing from the dose', mutate: (i) => ({ ...i, groups: 1 }) },
  ],
});

/* ---- 5 gNonPerturbing — the ORACLE DOES NOT MOVE THE FOOTBALL ---- */
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

/* ---- 6 gOracle — the reachability verdict IS the engine's own machinery ---- */
registerGate<{
  called: boolean; answered: boolean; raceBoth: boolean; corridorBoth: boolean;
  corridorRan: boolean; behindSeen: boolean; band: number;
}>({
  name: 'gOracle',
  fn: (i) => ({
    theEnginesEvaluatorWasActuallyCalled: i.called,
    itAnsweredForNearlyEveryPair: i.answered,
    bothRaceVerdictsOccur: i.raceBoth,
    theCorridorTestWasActuallyRun: i.corridorRan,
    bothCorridorVerdictsOccur: i.corridorBoth,
    behindBodiesWereSeenAtAll: i.behindSeen,
    theForwardBandIsTheEnginesOwn: i.band === 2,
  }),
  input: {
    called: oracleReceipt.calls > 0,
    answered: oracleReceipt.nulls < oracleReceipt.calls,
    raceBoth: oracleReceipt.race > 0 && oracleReceipt.race < oracleReceipt.calls,
    corridorRan: oracleReceipt.corridor > 0,
    corridorBoth: oracleReceipt.uncut > 0 && oracleReceipt.uncut < oracleReceipt.race,
    behindSeen: oracleReceipt.behind > 0,
    band: FORWARD_BAND_M,
  },
  mutants: [
    { conjunct: 'theEnginesEvaluatorWasActuallyCalled', name: 'the oracle never ran', mutate: (i) => ({ ...i, called: false }) },
    { conjunct: 'itAnsweredForNearlyEveryPair', name: 'the oracle refused every pair', mutate: (i) => ({ ...i, answered: false }) },
    { conjunct: 'bothRaceVerdictsOccur', name: 'the race verdict was constant', mutate: (i) => ({ ...i, raceBoth: false }) },
    { conjunct: 'theCorridorTestWasActuallyRun', name: 'the corridor test never ran', mutate: (i) => ({ ...i, corridorRan: false }) },
    { conjunct: 'bothCorridorVerdictsOccur', name: 'the corridor verdict was constant', mutate: (i) => ({ ...i, corridorBoth: false }) },
    { conjunct: 'behindBodiesWereSeenAtAll', name: 'no behind-ball body was ever seen', mutate: (i) => ({ ...i, behindSeen: false }) },
    { conjunct: 'theForwardBandIsTheEnginesOwn', name: 'the ±2 m band stopped tracing to src', mutate: (i) => ({ ...i, band: 3 }) },
  ],
});

/* ---- 7 gQ07 — the direction mix book-keeps against the engine's own counters ---- */
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

/* ---- 8 gSpells — the terminal census partitions the spell population ---- */
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

/* ---- 9 gNonVacuity — every reported rate shows its denominator ---- */
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

/* ---- 10 gFaces ---- */
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

/* ---- 11 gClock — APPLIED values, both axes (#280.2(iii), #272.3(ii)) ---- */
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

/* ---- 12 gSeed ---- */
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

/* ---- 13 gStats ---- */
const minGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
registerGate<{ base: number; gap: number; resamples: number }>({
  name: 'gStats',
  fn: (i) => ({
    theBaseIsTheDispatchedFloor: i.base === 111_600,
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

/* ---- 14 gEnvClean ---- */
registerGate<{ rogue: number; doors: number; preflight: boolean; out: string }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnVariable: i.rogue === 0,
    noEngineDoorIsSet: i.doors === 0,
    aPreflightNeverWritesACanonicalPath: !i.preflight || !isCanonicalPath(i.out),
  }),
  input: { rogue: rogueOwn.length, doors: rogueEngine.length, preflight: IS_PREFLIGHT, out: OUT_PATH },
  mutants: [
    { conjunct: 'noRogueOwnVariable', name: 'a rogue BUC0_* var was accepted', mutate: (i) => ({ ...i, rogue: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote the canonical artifact', mutate: (i) => ({ ...i, preflight: true, out: OUT_BY_MODE.full }) },
  ],
});

/* ---- 15 gHashEnvelope ---- */
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

/* ---- 16 gMutants ---- */
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
/* §12 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
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
  banner('BU-C0 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
/* §13 THE ARTIFACT                                                            */
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
  stage: 'BU-C0 — THE RECEPTION-OPTION CENSUS',
  doc: 'docs/world-model/BU-C0-RECEPTION-OPTION-CENSUS.md',
  contract: 'docs/world-model/BU-BUILDUP-CONTRACT.md §3 (BU-C0), bound by #285.1, dispatched #285.2',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'in the POLISHED world (?a4world=7 — CB + the learning defence at the MATURED dose), '
      + 'what does the CIRCULATION STRUCTURE look like at reception grain? INSTRUMENT-ONLY: '
      + 'nothing here is gated on a football number.',
    arms: {
      armed: '⭐ THE PRIMARY ARM — the v7 world: `new Match({...a4MatchFlags(7)})` + '
        + '`armA4World(m, null, 7, poolT1DoseCells(L3-T1))`, the SHIPPED entry path\'s own arming '
        + 'and its own POOLED matured dose; `l3ArmedVersion(m) === 7` asserted on every walked '
        + 'match (#283.2(iv)).',
      bare: 'THE CONTRAST — bare production (`new Match({seed, teamA, teamB})`), SAME seeds, SAME '
        + 'instrument. DESCRIPTIVE ONLY: no gate reads the difference.',
    },
    instruments: {
      behindBallOptions: 'POSITION: Δ = team.localX(mate) − team.localX(ball); BEHIND = Δ <= −2 m, '
        + 'LATERAL = |Δ| < 2 m, AHEAD = Δ >= +2 m — the ±2 m band EXTRACTED from the engine\'s own '
        + `forward-pass line (${MECH_SRC_PATH}:${FORWARD_BAND_LINE}), never typed. `
        + 'REACHABILITY: the ENGINE\'S OWN `evaluatePassAffordance` on an `oraclePerceptionSnapshot` '
        + 'with the match\'s own `reachProfiles()`; REACHABLE ⇔ `arrivalMargin > 0` (the receiver '
        + 'gets to the ball\'s landing point before any opponent) — a SIGN test on the engine\'s '
        + 'own quantity, no invented threshold.',
      directionMix: 'FORWARD is R-乙 Q07 VERBATIM — the engine\'s own `team.stats.passesForward` '
        + `counter (${MECH_SRC_PATH}:${FORWARD_BAND_LINE}), attributed per attempt by its per-tick `
        + 'delta. Q07\'s own semantics note records that its complement POOLS backward and lateral; '
        + 'this stage splits that complement with the SAME ±2 m rule on the SAME displacement, '
        + 'measured at the tick BEFORE the strike, and publishes the agreement between its own '
        + 'forward re-derivation and the engine\'s counter (`q07Receipt.agreementShare`).',
      spellTerminals: 'the #173 / R-乙 Q01 spell segmentation VERBATIM (a maximal same-team '
        + 'ownership interval in phase "playing", SUSPENDED while the ball is loose, ended by an '
        + 'opponent establishing ownership / the phase leaving "playing" / full time; #173\'s '
        + '6-tick foul lookahead inherited), with the terminating event SUB-CLASSIFIED from the '
        + 'engine\'s own stat deltas in the 3 ticks up to the terminating tick.',
      e7WorldGrain: 'the distribution of team-mate longitudinal offsets from the ball at reception '
        + 'moments — the E7 row (aheadBias) measured at WORLD grain rather than asserted.',
    },
    preRegistered: '#246 — real build-up teams keep 2–3 behind-ball options; OURS IS EXPECTED '
      + '≈ 0–1. An INVERSION (ours >= 2) routes to DIAGNOSIS, never to celebration.',
    populations: {
      reception: 'every tick at which the ball\'s owner CHANGES while phase === "playing" (the '
        + '#173 ownership-episode start) — the receiver is the carrier the census is taken for.',
      pressedReception: 'a reception whose receiver has an opponent within the pressure radius '
        + `(${PRESSURE_R} m — TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}).`,
      pressedCarrierMoment: `a NON-reception carrier tick sampled every ${CARRIER_SAMPLE_TICKS} `
        + `ticks (${round(CARRIER_SAMPLE_TICKS * DT, 4)} sim-s) at which the carrier is pressed.`,
    },
    clock: {
      matchDurationSimSeconds: MATCH_DURATION,
      displayMinutes: DISPLAY_MINUTES,
      displayMinutesTracedTo: `${MATCH_SRC_PATH}:${DISPLAY_MINUTES_LINE} (Match.minute())`,
      displaySecondsPerSimSecond: DISPLAY_S_PER_SIM_S,
      law: 'shares are dimensionless and read the same on both axes; the two per-MATCH count rows '
        + '(receptionsPerMatch, openSpellsPerMatch, attemptsPerMatch) are convention B (our match '
        + 'IS the 90′) and their convention-A form is × displaySecondsPerSimSecond.',
      applied: 'APPLIED, not nominal: the duration is never overridden and gClock asserts it.',
    },
    terminalClasses: TERMINALS,
    pressureRadiusM: PRESSURE_R,
    forwardBandM: FORWARD_BAND_M,
    histogramTopBucket: HIST_MAX,
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
  faces: C.faces.map(pubFace),
  behindOptionHistogram: Object.fromEntries(ARMS.map((a) => [a, {
    allReceptions: Array.from({ length: HIST_MAX + 1 },
      (_, k) => sum(rowsOf(a).map((r) => r.behindHist[k]))),
    pressedReceptions: Array.from({ length: HIST_MAX + 1 },
      (_, k) => sum(rowsOf(a).map((r) => r.behindHistPressed[k]))),
    denominator: sum(rowsOf(a).map((r) => r.receptions)),
    pressedDenominator: sum(rowsOf(a).map((r) => r.receptionsPressed)),
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
    note: 'agreementShare = the share of attributed attempts on which THIS probe\'s own ±2 m '
      + 're-derivation (measured one tick before the strike) agrees with the ENGINE\'S OWN '
      + '`passesForward` verdict. The published FORWARD share always uses the ENGINE\'S verdict; '
      + 'the re-derivation only splits the engine\'s POOLED complement into backward vs lateral, '
      + 'so a disagreement can only mis-file a pass INSIDE that complement.',
  },
  spellReceipt,
  histReceipt,
  perturbCheck,
  dose: {
    source: `${T1_PATH} · poolT1DoseCells (the SHIPPED world-7 entry\'s own pooling)`,
    declaredSha: L3_T1_SHA,
    cells: DOSE,
    labels: doseLabels,
    houseLaw: '#270 — the dose is written through DefenceAccountBook.note() by the shipped '
      + 'entry path and appears NOWHERE in info.genome (asserted per walk in gArms).',
  },
  perSeedCells: Object.fromEntries(ARMS.map((a) => [a, rowsOf(a).map(cellOf)])),
  seeds: { claimed: CLAIMED, block: [12_486_000, 12_486_999] },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 111_600, step: STATS_STEP },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ INSTRUMENT-ONLY: nothing here is gated on a football number, and no seam is armed or built.',
    'The bare-production contrast is DESCRIPTIVE — no gate reads the armed-minus-bare difference.',
    'The reachability oracle answers "could the engine\'s own evaluator get the ball there first", '
      + 'NOT "would the chooser pick it" — capability, never choice (#200).',
    'The pressed-carrier population is a SAMPLE at a declared cadence, not every tick.',
    'The slice-order recommendation in the stage doc is ARITHMETIC over these rows; the ORDER '
      + 'itself is the commander\'s to bind.',
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
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/bu-c0-cross-out.json';
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
banner(`\n  [bu-c0] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [bu-c0] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
const face = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const show = (k: string): string => `${face(k).arms.armed.point.toFixed(4)} armed / `
  + `${face(k).arms.bare.point.toFixed(4)} bare`;
banner(`  [bu-c0] behind-ball options / reception — ${show('behindBallOptionsPerReception')}`);
banner(`  [bu-c0] … at PRESSED receptions — ${show('behindBallOptionsPerPressedReception')}`);
banner(`  [bu-c0] receptions with ZERO behind option — ${show('shareReceptionsWithNoBehindOption')}`);
banner(`  [bu-c0] completed mix F/L/B — ${show('forwardShareOfCompletions')} · `
  + `${show('lateralShareOfCompletions')} · ${show('backwardShareOfCompletions')}`);
banner(`  [bu-c0] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
