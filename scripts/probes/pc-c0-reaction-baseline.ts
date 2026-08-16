/**
 * PC-C0 — THE REACTION-BASELINE CENSUS (docs/world-model/PC-C0-REACTION-BASELINE.md).
 *
 * The PERCEPTION contract's first instrument (PC-PERCEPTION-CONTRACT.md §3 PC-C0, bound by
 * ruling #296 item 2, dispatched by #296 item 3). INSTRUMENT-ONLY: nothing is armed, nothing is
 * built, `src/**` is BYTE-UNTOUCHED, and no seam acquires a caller.
 *
 * FOUR INSTRUMENTS, ONE BATTERY:
 *   (a) TODAY'S REACTION STRUCTURE at EVENT GRAIN — for each surprise class derived from the
 *       engine's own event vocabulary (R-JIA-EVENT-VOCABULARY-CENSUS.md), the TICK-LAG
 *       distribution until each AFFECTED body's reactive channels reflect the new truth. THREE
 *       channels, three lags: the per-tick truth-tracking STEERING channel (re-derived through
 *       the engine's OWN `interceptBall`, no formula copied), the DECISION-SLOT channel
 *       (`decisionTimer`), and the ACTION channel (`p.action` actually changing).
 *   (b) THE INSERTION-SEAM MAP, MACHINE-READ from `src/**` at run time: every reactive channel
 *       that re-reads fresh truth, located by regex over the shipped bytes and published with
 *       `file:line`; plus the world's EXISTING latency structure measured on the real walks —
 *       the `decisionTimer` reset-value spectrum (each reset value is a 1:1 fingerprint of its
 *       write site, because the decrement runs between the decide loop and `stepBall`).
 *   (c) THE SITUATION-CLASS DERIVATION + EXPOSURE RATES — events per class per BODY per SEASON
 *       (a season = 7 league fixtures per franchise, `src/sim/League.ts`), per role, both as
 *       INITIATOR and as AFFECTED body, with the feasibility arithmetic against the L3-T1
 *       slow-knowledge yardstick.
 *   (d) THE SELF-INITIATED INVENTORY — machine-located initiator paths (knock-and-go the built
 *       exemplar) and the per-class initiator census measured on the walks.
 *
 * ⭐ CLOCK CONVENTION, stated once and used everywhere: every lag in this artifact is APPLIED
 *   TICKS on the SIM clock (`DT = 1/60` sim-s, `MATCH_DURATION = 240` sim-s) — the contract's
 *   own clock ruling (§2 M-PC.1: body physics lives on the sim clock). Nothing here is scoreboard
 *   time. A field named `...Ticks` carries ticks; a field named `...SimSeconds` carries sim
 *   seconds (#294 item 1 / #295 item 3: a name that lies is a false field).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: PCC0_MODE (smoke|full, REQUIRED) · PCC0_N · PCC0_OUT.
 *   ANY other `PCC0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is a PREFLIGHT: it may not write a canonical repo path.
 *
 * ⭐ #289 item 1, BY NAME: `preflight`, `preflightReasons`, `mode`, `wallMs`, `generatedAt`,
 *   `head`, `outPath` live in the ENVELOPE, never in the hashed body.
 * ⭐ #289 canon: the dose guard hashes the FILE BYTES it reads and RE-DERIVES the artifact's own
 *   digest from those bytes.
 * ⭐ #287 item 1: `gFaces` re-derives the published faces by parsing the SERIALIZED artifact off
 *   disk.
 *
 * RUN: PCC0_MODE=full npx tsx scripts/probes/pc-c0-reaction-baseline.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { Ball } from '../../src/sim/Ball';
import { AI_INTERVAL, DT, MATCH_DURATION, TEAM_AI_INTERVAL, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { interceptBall } from '../../src/ai/perception';
import {
  a4MatchFlags, armA4World, a4ArmedVersion, l3ArmedVersion, poolT1DoseCells,
  L3_WORLD_VERSION, L3_T1_SHA, type L3DoseCell,
} from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['PCC0_MODE', 'PCC0_N', 'PCC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PCC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('PC-C0 FATAL — refused env surface. '
    + `rogue PCC0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PCC0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`PC-C0 FATAL — PCC0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const N_ENV = process.env.PCC0_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PCC0_N, 10)) : null;
const OUT_ENV = process.env.PCC0_OUT;
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['PCC0_N'] : []),
  ...(OUT_ENV !== undefined ? ['PCC0_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pc-c0-reaction-baseline-smoke.json',
  full: 'docs/world-model/data/pc-c0-reaction-baseline.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pc-c0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('PC-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
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
/* §2 THE SEAM MAP — MACHINE-READ FROM src AT RUN TIME (instrument (b))        */
/* ========================================================================== */
/**
 * Every entry is LOCATED, not typed: the needle is searched in the shipped bytes and the line
 * number is whatever the file says. A needle that is not found (or found more than once where
 * uniqueness is claimed) fails `gSeamMap` — the map cannot drift silently away from src.
 */
interface SeamNeedle {
  channel: string;
  file: string;
  needle: string;
  reads: string;
  cadence: string;
  holdSufficient: 'HOLD-SUFFICIENT' | 'HOLD-INSUFFICIENT' | 'ALREADY-A-HOLD' | 'INITIATOR-PATH';
  note: string;
}
const SEAM_NEEDLES: readonly SeamNeedle[] = [
  {
    channel: 'stepOrder.decideLoop',
    file: 'src/sim/Match.ts',
    needle: 'if (p.decisionTimer <= 0) {',
    reads: 'the decision gate itself — the ONLY door to `decidePlayer` in the live path',
    cadence: `fires when the timer expires; re-armed to AI_INTERVAL = ${AI_INTERVAL} sim-s`,
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'A latency timer ANDed into this gate holds the whole decision layer at once. This is '
      + 'the cheapest single seam in the world, and it is already a latency structure.',
  },
  {
    channel: 'stepOrder.decideLoop.rearm',
    file: 'src/sim/Match.ts',
    needle: 'p.decisionTimer = AI_INTERVAL;',
    reads: 'nothing (a write) — the ordinary cadence re-arm',
    cadence: `every ${AI_INTERVAL} sim-s per body, phase-staggered at kick-off`,
    holdSufficient: 'ALREADY-A-HOLD',
    note: 'The existing cadence IS an unearned latency of 0..9 ticks that every body already '
      + 'pays. PC-T0 composes with it, it does not replace it.',
  },
  {
    channel: 'stepOrder.decideStagger',
    file: 'src/sim/Match.ts',
    needle: '(AI_INTERVAL / TEAM_SIZE)',
    reads: 'the body index — the kick-off phase of the cadence',
    cadence: 'once, at kick-off',
    holdSufficient: 'ALREADY-A-HOLD',
    note: 'Deterministic phase stagger: the 0..9-tick decision lag is a FIXED per-body offset, '
      + 'not a random one. The seam must not assume the offsets are uniform per event.',
  },
  {
    channel: 'stepOrder.executeLoop',
    file: 'src/sim/Match.ts',
    needle: 'if (!p.sentOff) executeAction(p, this, dt);',
    reads: 'EVERY body, EVERY tick — the per-tick steering channel in full',
    cadence: 'every tick (60 Hz sim)',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: '⭐ THE LOAD-BEARING SEAM. The executor re-reads live truth for every body every tick; '
      + 'holding only the decision layer would leave steering omniscient (M-PC.2\'s own warning).',
  },
  {
    channel: 'steering.chase.interceptSolution',
    file: 'src/ai/actionExecutor.ts',
    needle: 'const sol = interceptBall(p, ball);',
    reads: '`ball.pos`, `ball.vel`, `ball.z`, `ball.vz`, `ball.spin` — the TRUTH ball',
    cadence: 'every tick, for every body in ChaseBall / ReceivePass / InterceptPass',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'The channel INFO-DOCTRINE §3 measured ("every defender re-targets the truth ball '
      + 'within 1 tick"). A frozen target here is the whole of M-PC.2 for the chase family.',
  },
  {
    channel: 'steering.chase.jockeyStandoff',
    file: 'src/ai/actionExecutor.ts',
    needle: 'const carrier = ball.owner;',
    reads: '`ball.owner` and the carrier\'s live position — the containment target',
    cadence: 'every tick, for a goal-side chaser',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'A SECOND truth read inside the same case: who owns the ball. A hold that freezes the '
      + 'intercept point but lets `ball.owner` through still leaks the turnover.',
  },
  {
    channel: 'steering.mark.stance',
    file: 'src/ai/actionExecutor.ts',
    needle: 'const bx = ball.pos.x - mark.pos.x;',
    reads: '`ball.pos` (the ball-side lane blend) + the mark\'s live position',
    cadence: 'every tick, for every body in MarkOpponent (25.99 % of all player-samples, R-甲 §2.0a)',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'The single largest population by action share. Its ball term is exactly the "sees the '
      + 'new ball instantly" channel for bodies who are not chasing.',
  },
  {
    channel: 'steering.mark.reactionLag',
    file: 'src/ai/actionExecutor.ts',
    needle: 'const lag = 0.45 - p.attrs.defending * 0.25;',
    reads: 'the mark\'s speed and the own-goal distance; freezes `target` into `p.markAnchor`',
    cadence: 're-reads on 0.20–0.45 sim-s (12–27 ticks) — NOT per tick',
    holdSufficient: 'ALREADY-A-HOLD',
    note: '⭐⭐ THE PRECEDENT OF RECORD: a TARGET-HOLD with an attribute-scaled reaction lag '
      + 'already ships, in the exact form M-PC.2 specifies, and its band 0.20–0.45 sim-s '
      + 'BRACKETS the doctrine\'s two literature-traced tiers (0.2 / 0.4–0.5). It is narrow '
      + '(sprinting mark, near own goal, non-carrier) and attribute-keyed, not book-keyed.',
  },
  {
    channel: 'steering.mark.trapHold',
    file: 'src/ai/actionExecutor.ts',
    needle: 'const ballDeep = team.localX(ball.pos.x) < -17;',
    reads: '`ball.pos.x` and `ball.owner` — the offside-trap release condition',
    cadence: 'every tick, for a trap-biased marker',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'A THIRD live-truth read in MarkOpponent. The doctrine\'s primitive 5 (shared snapshot '
      + '— one stale defender breaks the trap) is later slice; here it is only a read to hold.',
  },
  {
    channel: 'steering.receive.descentReroute',
    file: 'src/ai/actionExecutor.ts',
    needle: 'const { x: lx, y: ly } = ballLanding(ball);',
    reads: 'the live flight solution — landing point and flight direction',
    cadence: 'every tick, for the intended receiver of an airborne delivery',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'A deflection mid-flight re-solves this the very next tick.',
  },
  {
    channel: 'steering.formationSpot',
    file: 'src/ai/actionExecutor.ts',
    needle: 'target = formationSpot(p, team, ball, hasBall, opp, abandonRest, pmMover);',
    reads: '`ball` (the whole object) + `hasBall` (the possession flag)',
    cadence: 'every tick, for MoveToFormationSpot / HoldPosition (26.83 % of player-samples)',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'The shape itself slides with the ball every tick. A turnover therefore re-shapes both '
      + 'teams instantly today; this is where "the whole block reacts as one" comes from.',
  },
  {
    channel: 'steering.support',
    file: 'src/ai/actionExecutor.ts',
    needle: 'target = supportSpot(p, team, ball, match.ctbSupportPlane);',
    reads: '`ball` — the support geometry around the live carrier',
    cadence: 'every tick, for SupportBallCarrier (6.23 % of player-samples)',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'The attacking mirror of the marking stance.',
  },
  {
    channel: 'steering.gk.position',
    file: 'src/ai/actionExecutor.ts',
    needle: 'p.faceTarget = ball.pos; // backpedal facing the play (27.5)',
    reads: '`ball.pos` for both the positioning arc and the FACING',
    cadence: 'every tick, for GoalkeeperPosition (14.15 % of ALL player-samples)',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: '⭐ THE KEEPER IS THE MOST TRUTH-COUPLED BODY ON THE PITCH: his facing is literally a '
      + 'live pointer to the ball. `faceTarget` holds a LIVE REFERENCE (`Player.ts` says so), so '
      + 'a naive "freeze the vector" hold would still track — the hold must COPY.',
  },
  {
    channel: 'steering.gk.rush',
    file: 'src/ai/actionExecutor.ts',
    needle: 'case \'GoalkeeperRush\': {',
    reads: '`ball.pos` as the target directly',
    cadence: 'every tick while rushing',
    holdSufficient: 'HOLD-SUFFICIENT',
    note: 'The doctrine\'s own 单刀 example (出击即承诺) lives here.',
  },
  {
    channel: 'assignment.chasers',
    file: 'src/ai/TeamBrain.ts',
    needle: 'function assignChasers(team: Team, match: Match): void {',
    reads: '`match.possessionSide`, `ball.owner`, `ball.pos`, `match.dribbleTouch`, '
      + '`match.pendingPass`, `match.phase`, the keeper\'s hold state',
    cadence: `TEAM_AI_INTERVAL = ${TEAM_AI_INTERVAL} sim-s per team (24 ticks), NOT per tick`,
    holdSufficient: 'HOLD-INSUFFICIENT',
    note: '⭐⭐ A TEAM-LEVEL channel with its own cadence and NO per-body timer. A per-body '
      + 'latency hold does not cover it: the team brain can re-assign a chaser while that body '
      + 'is still inside his own hold. PC-T0 must decide whether this channel holds too, or '
      + 'whether the body\'s hold overrides the assignment it receives.',
  },
  {
    channel: 'assignment.teamBrainCadence',
    file: 'src/ai/TeamBrain.ts',
    needle: 'export function updateTeamBrain(team: Team, match: Match): void {',
    reads: 'the whole live world for the team layer (mode, press, chasers, overlapper)',
    cadence: `${TEAM_AI_INTERVAL} sim-s`,
    holdSufficient: 'HOLD-INSUFFICIENT',
    note: 'The second existing latency tier in the world, above the per-body one.',
  },
  {
    channel: 'initiator.knockAndGo',
    file: 'src/sim/mechanics.ts',
    needle: 'p.decisionTimer = 0;',
    reads: 'nothing — a WRITE on the initiator\'s own release',
    cadence: 'once, at the aimed touch-past release',
    holdSufficient: 'INITIATOR-PATH',
    note: '⭐ THE BUILT EXEMPLAR of M-PC.4 (CB-AFTERMATH-POLISH §FIX-①, ruling #273 item 2): the '
      + 'knocker re-decides on the NEXT tick, self-initiated = zero latency. PC-T0 must leave '
      + 'this path latency-free BY NAME.',
  },
  {
    channel: 'initiator.captureSettle',
    file: 'src/sim/Match.ts',
    needle: 'p.decisionTimer = Math.max(p.decisionTimer, inShootingRange ? 0.08 : recollect ? 0.18 : 0.3);',
    reads: 'the capturer\'s own shooting range and whether he is re-collecting his own knock',
    cadence: 'once, at every capture (`giveBall`)',
    holdSufficient: 'INITIATOR-PATH',
    note: 'The capturer is the INITIATOR of his own capture and already pays a settle, not a '
      + 'perception cost. His VICTIM pays nothing today — that asymmetry is the census\'s point.',
  },
  {
    channel: 'initiator.gkFeetOverride',
    file: 'src/sim/Match.ts',
    needle: 'if (gkFeet) p.decisionTimer = Math.min(p.decisionTimer, 0.18);',
    reads: 'whether the capturer is a keeper with the ball at his feet',
    cadence: 'once, at a keeper capture',
    holdSufficient: 'INITIATOR-PATH',
    note: 'A keeper-specific shortening of the settle — an existing role-differentiated cadence '
      + 'constant, and therefore a place where a written role rule already exists (M-PC.3 bans '
      + 'ADDING more, it does not retro-remove this one).',
  },
  {
    channel: 'initiator.substitutionArrival',
    file: 'src/sim/Match.ts',
    needle: 'out.decisionTimer = 0.05; // think on arrival, not a stale slot\'s cadence',
    reads: 'nothing — a WRITE on arrival',
    cadence: 'once per substitution',
    holdSufficient: 'INITIATOR-PATH',
    note: 'The idiom knock-and-go cites as its precedent. A body walking onto the pitch has '
      + 'nothing to react to, so its 0.05 is a SETTLE, not a reaction constant.',
  },
];

interface SeamRow extends SeamNeedle { line: number; occurrences: number }
const SEAM_FILE_BYTES: Record<string, string> = {};
const seamRows: SeamRow[] = SEAM_NEEDLES.map((n) => {
  if (SEAM_FILE_BYTES[n.file] === undefined) SEAM_FILE_BYTES[n.file] = readFileSync(n.file, 'utf8');
  const lines = SEAM_FILE_BYTES[n.file].split('\n');
  let line = -1;
  let occurrences = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(n.needle)) {
      occurrences++;
      if (line < 0) line = i + 1;
    }
  }
  return { ...n, line, occurrences };
});
const seamAllLocated = seamRows.every((r) => r.line > 0);
const SRC_FILE_SHAS = Object.fromEntries(
  Object.entries(SEAM_FILE_BYTES).map(([f, b]) => [f, sha(b)]),
);

/* ========================================================================== */
/* §3 THE FROZEN DESIGN — seeds, stats stream, sizing                          */
/* ========================================================================== */
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const BOOTSTRAP = 4000;
const STATS_BASE = 113_000;
const STATS_STEP = 200;
const STATS_FLOOR_FROM_RULING = 113_000; // ruling #296 item 3

const SMOKE_BASE = 12_496_000;
const BATTERY_BASE = 12_496_100;
const GWORLD_SEED = 12_496_950;
const N_FROZEN = 200;
/** Declared preflight band — DISJOINT from every record band by construction (#273.2(iii)). */
const PREFLIGHT_BAND: readonly [number, number] = [12_496_900, 12_496_919];

const N_RUN = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const BASE_RUN = MODE === 'smoke' ? SMOKE_BASE : BATTERY_BASE;

/** APPLIED-TICK horizons. Every lag in this artifact is ticks on the SIM clock. */
const H_STEER = 30; // 0.5 sim-s — 2.5× the longest doctrine tier
const H_DECIDE = 60; // 1.0 sim-s — 6.7× AI_INTERVAL
const RELEVANCE_M = 25; // perceptual-relevance radius for "affected"; the all-bodies denominator is stored too
const STEER_EPS_M = 0.05; // metres: the intercept-point divergence that counts as "re-targeted"

/* ========================================================================== */
/* §4 THE ARM — CONSTRUCTED DIRECTLY WITH matchFlags (#283 item 2)             */
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
const T1_BYTES = readFileSync(T1_PATH, 'utf8');
const T1_FILE = JSON.parse(T1_BYTES) as Record<string, unknown>;
const DOSE: L3DoseCell[] = poolT1DoseCells(T1_FILE);
const DOSE_FILE_BYTES_SHA = sha(T1_BYTES);
const DOSE_REDERIVED_SHA = (() => {
  const cc = JSON.parse(T1_BYTES) as Record<string, unknown>;
  delete cc.resultSha256;
  delete cc.envelope;
  return sha(canonical(cc));
})();

const matchOf = (seed: number, bare = false): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  if (bare) return new Match({ seed, teamA, teamB });
  const m = new Match({ seed, teamA, teamB, ...a4MatchFlags(L3_WORLD_VERSION) });
  armA4World(m, null, L3_WORLD_VERSION, DOSE);
  return m;
};
const armConjuncts = (m: Match): Record<string, boolean> => {
  const mm = m as unknown as {
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    cbChoiceSeat: boolean;
  };
  const dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  const genomeClean = m.teams.every((t) => !JSON.stringify(t.info.genome).includes('l3'));
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
/* §5 THE SITUATION CLASSES — derived from the ENGINE'S OWN event grain         */
/* ========================================================================== */
/**
 * Each class is a STATE-TRANSITION PREDICATE over public engine state, tied to the engine site
 * that writes it and to the R-甲 vocabulary row it realises. No invented taxonomy: every class
 * is something the engine already writes, and every class is something a football watcher names.
 */
const CLASSES = [
  'knockRelease', 'dribblePush', 'passRelease', 'shotRelease',
  'turnover', 'deflection', 'looseBallSpill',
] as const;
type Klass = (typeof CLASSES)[number];
const CLASS_DEFS: Record<Klass, { rJia: string; site: string; predicate: string; initiator: string }> = {
  knockRelease: {
    rJia: 'A7 (knock past a man) — DEGENERATE→live only through the CB seat',
    site: 'src/sim/mechanics.ts performTouchPast',
    predicate: '`match.cbLedger.touchPasts` increments on this tick',
    initiator: 'the knocker (`ball.lastTouch`) — ALREADY latency-free (knock-and-go)',
  },
  dribblePush: {
    rJia: 'A1 (carry with the ball) / A3 (the production push)',
    site: 'src/sim/mechanics.ts performDribbleTouch',
    predicate: '`match.dribbleTouch` becomes non-null WITHOUT a `touchPasts` increment',
    initiator: 'the pusher — pays the ordinary cadence today (no knock-and-go on this path)',
  },
  passRelease: {
    rJia: 'B1–B6 (pass family), D1 (ball receipt) on the other end',
    site: 'src/sim/Match.ts (`pendingPass` written at the strike)',
    predicate: '`match.pendingPass` becomes non-null or its `t` changes',
    initiator: 'the passer',
  },
  shotRelease: {
    rJia: 'C1–C4 (finishing)',
    site: 'src/sim/Match.ts (`pendingShot` written at the strike)',
    predicate: '`match.pendingShot` becomes non-null',
    initiator: 'the shooter',
  },
  turnover: {
    rJia: 'H1 (possession change), F1 (tackle), G1 (interception)',
    site: 'src/sim/Match.ts giveBall / tryCapture',
    predicate: '`ball.owner` becomes a body whose side differs from the last known owner\'s side',
    initiator: 'the WINNER; ⭐ the loser and every team-mate of his are pure surprise',
  },
  deflection: {
    rJia: 'G2 (block), G3 (deflection), I2 (parry)',
    site: 'src/sim/mechanics.ts tryDeflection / the block path / tryKeeperSave',
    predicate: '`ball.lastTouch` changes while `ball.owner` is null on BOTH sides of the tick, '
      + 'and the ball\'s velocity direction turns by more than 0.2 rad',
    initiator: '⭐ NONE on the affected side — a deflection surprises everyone, including the '
      + 'deflector\'s own team-mates and the passer whose ball it was',
  },
  looseBallSpill: {
    rJia: 'D3 (miscontrol), H2 (loose-ball race), L-group 50/50',
    site: 'src/sim/Match.ts (owner cleared without a pass, shot or aimed knock)',
    predicate: '`ball.owner` goes non-null → null with no pendingPass/pendingShot/dribbleTouch',
    initiator: 'the spiller — he initiated the touch but NOT the outcome (an honest half-case)',
  },
};

const ROLES: readonly Role[] = ['GK', 'DF', 'MF', 'WG', 'ST'];
type Relation = 'own' | 'opp';
const RELATIONS: readonly Relation[] = ['own', 'opp'];
const groupKey = (k: Klass, rel: Relation, role: Role): string => `${k}|${rel}|${role}`;
const GROUP_KEYS: string[] = [];
for (const k of CLASSES) for (const rel of RELATIONS) for (const role of ROLES) GROUP_KEYS.push(groupKey(k, rel, role));

/* ========================================================================== */
/* §6 THE WALK                                                                 */
/* ========================================================================== */
interface Agg {
  /** n bodies for whom the steering channel was APPLICABLE (in the intercept family in-window). */
  steerN: number; steerSum: number; steerLe1: number;
  /** ⭐ the CLEAN read of the §3 baseline: bodies ALREADY in the family on the first tick after */
  /** the event, and how many of those had re-targeted by that very tick. */
  steerAppK1: number; steerDivK1: number;
  steerHist: number[]; // index 1..H_STEER, index 0 = "censored / never diverged"
  decideN: number; decideSum: number; decideHist: number[];
  actionN: number; actionSum: number; actionChanged: number;
  bodies: number; // affected bodies inside RELEVANCE_M (the denominator)
  bodiesAll: number; // affected bodies regardless of distance (the moving-denominator disclosure)
}
const newAgg = (): Agg => ({
  steerN: 0, steerSum: 0, steerLe1: 0, steerAppK1: 0, steerDivK1: 0,
  steerHist: new Array(H_STEER + 1).fill(0),
  decideN: 0, decideSum: 0, decideHist: new Array(H_DECIDE + 1).fill(0),
  actionN: 0, actionSum: 0, actionChanged: 0, bodies: 0, bodiesAll: 0,
});
const addAgg = (a: Agg, b: Agg): void => {
  a.steerN += b.steerN; a.steerSum += b.steerSum; a.steerLe1 += b.steerLe1;
  a.steerAppK1 += b.steerAppK1; a.steerDivK1 += b.steerDivK1;
  for (let i = 0; i <= H_STEER; i++) a.steerHist[i] += b.steerHist[i];
  a.decideN += b.decideN; a.decideSum += b.decideSum;
  for (let i = 0; i <= H_DECIDE; i++) a.decideHist[i] += b.decideHist[i];
  a.actionN += b.actionN; a.actionSum += b.actionSum; a.actionChanged += b.actionChanged;
  a.bodies += b.bodies; a.bodiesAll += b.bodiesAll;
};

interface SeedRow {
  seed: number;
  ticks: number;
  armOk: boolean;
  events: Record<Klass, number>;
  eventsPressed: Record<Klass, number>;
  /** initiations attributable to a body of this role (per class) — the (c) exposure numerator. */
  initByRole: Record<string, number>;
  /** in-relevance exposures attributable to a body of this role (per class). */
  expByRole: Record<string, number>;
  bodiesByRole: Record<Role, number>;
  /** the decisionTimer reset-value spectrum: value(5dp) → count. */
  resetSpectrum: Record<string, number>;
  groups: Record<string, Agg>;
  /** the intercept-family applicability denominator: body-ticks in the family / all body-ticks. */
  familyBodyTicks: number;
  allBodyTicks: number;
}

interface WinBody {
  gid: number; role: Role; rel: Relation;
  steer: number; // 0 = not yet diverged
  steerApplicable: boolean; appK1: boolean; divK1: boolean;
  decide: number;
  action: number;
  a0type: string; a0idx: number;
}
interface Win {
  klass: Klass; startTick: number; frozen: Ball; bodies: WinBody[];
}

const cloneBall = (b: Ball): Ball => {
  const f = new Ball();
  f.pos = { x: b.pos.x, y: b.pos.y };
  f.vel = { x: b.vel.x, y: b.vel.y };
  f.z = b.z; f.vz = b.vz; f.spin = b.spin;
  return f;
};

const walkSeed = (seed: number): SeedRow => {
  const m = matchOf(seed);
  const arm = armConjuncts(m);
  const nTicks = Math.round(MATCH_DURATION / DT);
  const players = m.allPlayers;
  const row: SeedRow = {
    seed, ticks: 0, armOk: Object.values(arm).every(Boolean),
    events: Object.fromEntries(CLASSES.map((c) => [c, 0])) as Record<Klass, number>,
    eventsPressed: Object.fromEntries(CLASSES.map((c) => [c, 0])) as Record<Klass, number>,
    initByRole: {}, expByRole: {},
    bodiesByRole: { GK: 0, DF: 0, MF: 0, WG: 0, ST: 0 },
    resetSpectrum: {},
    groups: Object.fromEntries(GROUP_KEYS.map((k) => [k, newAgg()])),
    familyBodyTicks: 0, allBodyTicks: 0,
  };
  for (const p of players) row.bodiesByRole[p.role]++;

  const wins: Win[] = [];
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let lastKnownOwnerGid: number | null = prevOwnerGid;
  let prevTouchPasts = m.cbLedger.touchPasts;
  let prevDribbleTouchKey: string | null = m.dribbleTouch === null ? null
    : `${m.dribbleTouch.gid}:${m.dribbleTouch.until}`;
  let prevPendingPassT: number | null = m.pendingPass?.t ?? null;
  let prevPendingShot = m.pendingShot !== null;
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  const prevTimer = new Float64Array(players.length);
  const prevActType: string[] = players.map((p) => p.action.type);
  const prevActIdx: number[] = players.map((p) => p.action.targetIdx ?? -1);

  for (let t = 0; t < nTicks; t++) {
    for (let i = 0; i < players.length; i++) prevTimer[i] = players[i].decisionTimer;
    const preBall = cloneBall(m.ball);
    const preOwnerGid = m.ball.owner?.gid ?? null;
    const preLastTouchGid = m.ball.lastTouch?.gid ?? null;
    const preVel = { x: m.ball.vel.x, y: m.ball.vel.y };
    const prePhase = m.phase;

    m.step(DT);
    row.ticks++;

    /* --- the decisionTimer reset spectrum (instrument (b), measured on the real walk) --- */
    for (let i = 0; i < players.length; i++) {
      const now = players[i].decisionTimer;
      if (now > prevTimer[i] + 1e-12 || (prevTimer[i] > 0 && now === 0)) {
        const key = now.toFixed(5);
        row.resetSpectrum[key] = (row.resetSpectrum[key] ?? 0) + 1;
      }
    }

    /* --- event detection over public state (the §5 predicates) --- */
    const ownerGid = m.ball.owner?.gid ?? null;
    const lastTouchGid = m.ball.lastTouch?.gid ?? null;
    const touchPasts = m.cbLedger.touchPasts;
    const dribbleTouchGid = m.dribbleTouch?.gid ?? null;
    const dribbleTouchKey = m.dribbleTouch === null ? null
      : `${m.dribbleTouch.gid}:${m.dribbleTouch.until}`;
    const pendingPassT = m.pendingPass?.t ?? null;
    const pendingShot = m.pendingShot !== null;
    const fired: { klass: Klass; initiatorGid: number | null }[] = [];
    if (prePhase === 'playing' && m.phase === 'playing') {
      if (touchPasts > prevTouchPasts) {
        fired.push({ klass: 'knockRelease', initiatorGid: lastTouchGid });
      } else if (dribbleTouchKey !== null && dribbleTouchKey !== prevDribbleTouchKey) {
        fired.push({ klass: 'dribblePush', initiatorGid: lastTouchGid });
      }
      if (pendingPassT !== null && pendingPassT !== prevPendingPassT) {
        fired.push({ klass: 'passRelease', initiatorGid: m.pendingPass?.passerGid ?? lastTouchGid });
      }
      if (pendingShot && !prevPendingShot) {
        fired.push({ klass: 'shotRelease', initiatorGid: lastTouchGid });
      }
      if (ownerGid !== null && ownerGid !== prevOwnerGid) {
        const prevSide = lastKnownOwnerGid === null ? null : players[lastKnownOwnerGid].side;
        if (prevSide !== null && players[ownerGid].side !== prevSide) {
          fired.push({ klass: 'turnover', initiatorGid: ownerGid });
        }
      }
      if (ownerGid === null && preOwnerGid === null && lastTouchGid !== preLastTouchGid
        && lastTouchGid !== null) {
        const a = Math.hypot(preVel.x, preVel.y);
        const b = Math.hypot(m.ball.vel.x, m.ball.vel.y);
        const cosT = a > 1e-6 && b > 1e-6
          ? (preVel.x * m.ball.vel.x + preVel.y * m.ball.vel.y) / (a * b) : 1;
        if (Math.acos(Math.max(-1, Math.min(1, cosT))) > 0.2) {
          fired.push({ klass: 'deflection', initiatorGid: lastTouchGid });
        }
      }
      if (preOwnerGid !== null && ownerGid === null && pendingPassT === prevPendingPassT
        && !pendingShot && dribbleTouchGid === null) {
        fired.push({ klass: 'looseBallSpill', initiatorGid: preOwnerGid });
      }
    }

    for (const ev of fired) {
      row.events[ev.klass]++;
      const initiator = ev.initiatorGid === null ? null : players[ev.initiatorGid];
      // the PRESSED split of the EVENT: an opponent inside TOUCH_CONTROL_DIST of the ball.
      let nearestOpp = Infinity;
      if (initiator !== null) {
        for (const o of m.teams[1 - initiator.side].players) {
          if (o.sentOff) continue;
          const d = Math.hypot(o.pos.x - m.ball.pos.x, o.pos.y - m.ball.pos.y);
          if (d < nearestOpp) nearestOpp = d;
        }
      }
      if (nearestOpp <= TOUCH_CONTROL_DIST) row.eventsPressed[ev.klass]++;
      if (initiator !== null) {
        const ik = `${ev.klass}|${initiator.role}`;
        row.initByRole[ik] = (row.initByRole[ik] ?? 0) + 1;
      }
      const bodies: WinBody[] = [];
      for (const p of players) {
        if (p.sentOff) continue;
        if (initiator !== null && p.gid === initiator.gid) continue;
        const d = Math.hypot(p.pos.x - m.ball.pos.x, p.pos.y - m.ball.pos.y);
        const rel: Relation = initiator === null
          ? 'opp' : (p.side === initiator.side ? 'own' : 'opp');
        const g = row.groups[groupKey(ev.klass, rel, p.role)];
        g.bodiesAll++;
        if (d > RELEVANCE_M) continue;
        g.bodies++;
        const ek = `${ev.klass}|${p.role}`;
        row.expByRole[ek] = (row.expByRole[ek] ?? 0) + 1;
        bodies.push({
          gid: p.gid, role: p.role, rel, steer: 0, steerApplicable: false,
          appK1: false, divK1: false, decide: 0, action: 0,
          a0type: p.action.type, a0idx: p.action.targetIdx ?? -1,
        });
      }
      if (bodies.length > 0) {
        wins.push({ klass: ev.klass, startTick: t, frozen: cloneBall(preBall), bodies });
      }
    }

    /* --- advance every open window with THIS tick's post-step state --- */
    for (let wi = wins.length - 1; wi >= 0; wi--) {
      const w = wins[wi];
      const k = t - w.startTick + 1; // APPLIED TICKS since the event step; k = 1 is the next executor call
      for (const wb of w.bodies) {
        const p = players[wb.gid];
        const fam = p.action.type === 'ChaseBall' || p.action.type === 'ReceivePass'
          || p.action.type === 'InterceptPass';
        if (wb.steer === 0 && k <= H_STEER) {
          if (fam && !(p.action.type === 'ChaseBall' && p.containing)) {
            wb.steerApplicable = true;
            const fresh = interceptBall(p, m.ball).point;
            const stale = interceptBall(p, w.frozen).point;
            const moved = Math.hypot(fresh.x - stale.x, fresh.y - stale.y) > STEER_EPS_M;
            if (moved) wb.steer = k;
            if (k === 1) { wb.appK1 = true; wb.divK1 = moved; }
          }
        }
        if (wb.decide === 0 && k <= H_DECIDE && prevTimer[wb.gid] <= 0) wb.decide = k;
        if (wb.action === 0 && k <= H_DECIDE
          && (p.action.type !== wb.a0type || (p.action.targetIdx ?? -1) !== wb.a0idx)) {
          wb.action = k;
        }
      }
      if (t - w.startTick + 1 >= Math.max(H_STEER, H_DECIDE)) {
        for (const wb of w.bodies) {
          const g = row.groups[groupKey(w.klass, wb.rel, wb.role)];
          if (wb.appK1) { g.steerAppK1++; if (wb.divK1) g.steerDivK1++; }
          if (wb.steerApplicable) {
            g.steerN++;
            g.steerHist[wb.steer]++;
            if (wb.steer > 0) { g.steerSum += wb.steer; if (wb.steer <= 1) g.steerLe1++; }
          }
          g.decideN++;
          g.decideHist[wb.decide]++;
          if (wb.decide > 0) g.decideSum += wb.decide;
          g.actionN++;
          if (wb.action > 0) { g.actionChanged++; g.actionSum += wb.action; }
        }
        wins.splice(wi, 1);
      }
    }

    /* --- the intercept-family applicability denominator (non-vacuity) --- */
    for (const p of players) {
      if (p.sentOff) continue;
      row.allBodyTicks++;
      if ((p.action.type === 'ChaseBall' && !p.containing) || p.action.type === 'ReceivePass'
        || p.action.type === 'InterceptPass') row.familyBodyTicks++;
    }

    prevOwnerGid = ownerGid;
    if (ownerGid !== null) lastKnownOwnerGid = ownerGid;
    prevTouchPasts = touchPasts;
    prevDribbleTouchKey = dribbleTouchKey;
    prevPendingPassT = pendingPassT;
    prevPendingShot = pendingShot;
    prevLastTouchGid = lastTouchGid;
    for (let i = 0; i < players.length; i++) {
      prevActType[i] = players[i].action.type;
      prevActIdx[i] = players[i].action.targetIdx ?? -1;
    }
  }
  void prevLastTouchGid; void prevActType; void prevActIdx;
  return row;
};

/* ========================================================================== */
/* §7 THE DETERMINISTIC CORE (G-DET runs it twice)                             */
/* ========================================================================== */
const SEEDS = Array.from({ length: N_RUN }, (_, i) => BASE_RUN + i);
const coreRun = (): SeedRow[] => SEEDS.map((s) => walkSeed(s));
const digestOf = (rows: SeedRow[]): string => sha(canonical(rows));

banner(`  [pc-c0] mode=${MODE} N=${N_RUN} seeds from ${BASE_RUN} × 2 G-DET runs`);
const rowsA = coreRun();
const digestA = digestOf(rowsA);
banner('  [pc-c0] G-DET second run…');
const rowsB = coreRun();
const digestB = digestOf(rowsB);
const ROWS = rowsA;

/** The world-separation probe: the v7 arm and the bare world are not the same match. */
const worldSeedOk = (() => {
  const a = matchOf(GWORLD_SEED);
  const b = matchOf(GWORLD_SEED, true);
  const armed = armConjuncts(a);
  const bareArmed = armConjuncts(b);
  for (let i = 0; i < 600; i++) { a.step(DT); b.step(DT); }
  return {
    armedIsArmed: Object.values(armed).every(Boolean),
    bareIsNotArmed: !bareArmed.theArmIsTheWorldSevenOfRecord,
    theTwoWorldsDiverge: sha(canonical([a.ball.pos, a.ball.vel]))
      !== sha(canonical([b.ball.pos, b.ball.vel])),
  };
})();

/* ========================================================================== */
/* §8 THE FACES — RATIOS OF SUMS over the stored per-seed cells                 */
/* ========================================================================== */
const rng = new Rng(STATS_BASE);
const bootCI = (
  perSeed: readonly { num: number; den: number }[],
): [number, number] => {
  const n = perSeed.length;
  if (n === 0) return [Number.NaN, Number.NaN];
  const out: number[] = [];
  for (let b = 0; b < BOOTSTRAP; b++) {
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      const j = Math.min(n - 1, Math.floor(rng.next() * n));
      num += perSeed[j].num; den += perSeed[j].den;
    }
    out.push(den === 0 ? Number.NaN : num / den);
  }
  const ok = out.filter((x) => Number.isFinite(x)).sort((a, b2) => a - b2);
  if (ok.length === 0) return [Number.NaN, Number.NaN];
  return [ok[Math.floor(ok.length * 0.025)], ok[Math.min(ok.length - 1, Math.floor(ok.length * 0.975))]];
};

const pooledGroup = (pred: (k: Klass, rel: Relation, role: Role) => boolean): Agg => {
  const acc = newAgg();
  for (const r of ROWS) {
    for (const k of CLASSES) {
      for (const rel of RELATIONS) {
        for (const role of ROLES) {
          if (pred(k, rel, role)) addAgg(acc, r.groups[groupKey(k, rel, role)]);
        }
      }
    }
  }
  return acc;
};
const perSeedGroup = (
  pred: (k: Klass, rel: Relation, role: Role) => boolean,
  pick: (a: Agg) => { num: number; den: number },
): { num: number; den: number }[] => ROWS.map((r) => {
  const acc = newAgg();
  for (const k of CLASSES) for (const rel of RELATIONS) for (const role of ROLES) {
    if (pred(k, rel, role)) addAgg(acc, r.groups[groupKey(k, rel, role)]);
  }
  return pick(acc);
});

const quantile = (hist: readonly number[], q: number): number | 'CENSORED' => {
  const total = sum(hist.slice(1)) + hist[0];
  if (total === 0) return 'CENSORED';
  let cum = 0;
  for (let i = 1; i < hist.length; i++) {
    cum += hist[i];
    if (cum / total >= q) return i;
  }
  return 'CENSORED';
};

interface LagFace {
  key: string; klass: Klass | 'ALL'; relation: Relation | 'ALL'; role: Role | 'ALL';
  affectedBodiesInRelevance: number; affectedBodiesAllDistances: number;
  steer: {
    applicableBodies: number;
    applicableOnFirstTick: number; retargetedOnFirstTick: number;
    shareRetargetedOnFirstTickGivenApplicableThen: number | 'UNMEASURED';
    ci95ShareRetargetedOnFirstTick: [number, number] | 'UNMEASURED';
    meanTicks: number | 'UNMEASURED';
    shareWithinOneTick: number | 'UNMEASURED'; ci95ShareWithinOneTick: [number, number] | 'UNMEASURED';
    p50Ticks: number | 'CENSORED'; p90Ticks: number | 'CENSORED';
    neverDivergedWithinHorizon: number; histogramTicks: number[];
  };
  decide: {
    bodies: number; meanTicks: number | 'UNMEASURED'; ci95MeanTicks: [number, number] | 'UNMEASURED';
    p50Ticks: number | 'CENSORED'; p90Ticks: number | 'CENSORED'; noSlotWithinHorizon: number;
  };
  action: {
    bodies: number; shareChangedWithinHorizon: number | 'UNMEASURED';
    meanTicksGivenChanged: number | 'UNMEASURED';
  };
}
const faceOf = (
  key: string, klass: Klass | 'ALL', relation: Relation | 'ALL', role: Role | 'ALL',
): LagFace => {
  const pred = (k: Klass, rel: Relation, r: Role): boolean => (klass === 'ALL' || k === klass)
    && (relation === 'ALL' || rel === relation) && (role === 'ALL' || r === role);
  const a = pooledGroup(pred);
  const diverged = a.steerN - a.steerHist[0];
  return {
    key, klass, relation, role,
    affectedBodiesInRelevance: a.bodies, affectedBodiesAllDistances: a.bodiesAll,
    steer: {
      applicableBodies: a.steerN,
      applicableOnFirstTick: a.steerAppK1, retargetedOnFirstTick: a.steerDivK1,
      shareRetargetedOnFirstTickGivenApplicableThen: a.steerAppK1 === 0 ? 'UNMEASURED'
        : round(a.steerDivK1 / a.steerAppK1, 6),
      ci95ShareRetargetedOnFirstTick: a.steerAppK1 === 0 ? 'UNMEASURED'
        : bootCI(perSeedGroup(pred, (g) => ({ num: g.steerDivK1, den: g.steerAppK1 })))
          .map((x) => round(x, 6)) as [number, number],
      meanTicks: diverged === 0 ? 'UNMEASURED' : round(a.steerSum / diverged, 4),
      shareWithinOneTick: a.steerN === 0 ? 'UNMEASURED' : round(a.steerLe1 / a.steerN, 6),
      ci95ShareWithinOneTick: a.steerN === 0 ? 'UNMEASURED'
        : bootCI(perSeedGroup(pred, (g) => ({ num: g.steerLe1, den: g.steerN }))).map((x) => round(x, 6)) as [number, number],
      p50Ticks: quantile(a.steerHist, 0.5), p90Ticks: quantile(a.steerHist, 0.9),
      neverDivergedWithinHorizon: a.steerHist[0], histogramTicks: a.steerHist,
    },
    decide: {
      bodies: a.decideN,
      meanTicks: a.decideN - a.decideHist[0] === 0 ? 'UNMEASURED'
        : round(a.decideSum / (a.decideN - a.decideHist[0]), 4),
      ci95MeanTicks: a.decideN === 0 ? 'UNMEASURED'
        : bootCI(perSeedGroup(pred, (g) => ({ num: g.decideSum, den: g.decideN - g.decideHist[0] })))
          .map((x) => round(x, 4)) as [number, number],
      p50Ticks: quantile(a.decideHist, 0.5), p90Ticks: quantile(a.decideHist, 0.9),
      noSlotWithinHorizon: a.decideHist[0],
    },
    action: {
      bodies: a.actionN,
      shareChangedWithinHorizon: a.actionN === 0 ? 'UNMEASURED' : round(a.actionChanged / a.actionN, 6),
      meanTicksGivenChanged: a.actionChanged === 0 ? 'UNMEASURED' : round(a.actionSum / a.actionChanged, 4),
    },
  };
};

const FACES: LagFace[] = [];
FACES.push(faceOf('ALL', 'ALL', 'ALL', 'ALL'));
for (const k of CLASSES) {
  FACES.push(faceOf(`${k}|ALL|ALL`, k, 'ALL', 'ALL'));
  for (const rel of RELATIONS) FACES.push(faceOf(`${k}|${rel}|ALL`, k, rel, 'ALL'));
  for (const role of ROLES) FACES.push(faceOf(`${k}|ALL|${role}`, k, 'ALL', role));
}
for (const role of ROLES) FACES.push(faceOf(`ALL|ALL|${role}`, 'ALL', 'ALL', role));

/* ========================================================================== */
/* §9 EXPOSURE + FEASIBILITY (instrument (c))                                  */
/* ========================================================================== */
const LEAGUE_FIXTURES_PER_SEASON = 7; // src/sim/League.ts: 8 teams, single round-robin
/** L3-T1's own traced yardstick: the rare cell's per-book fill at 15 seasons (min 184). */
const L3_YARDSTICK_LABELS = 184;
const L3_YARDSTICK_SEASONS = 15;
const L3_TAU_SEASONS = 12;

const nSeeds = ROWS.length;
const bodiesByRole = Object.fromEntries(ROLES.map((r) => [r,
  sum(ROWS.map((x) => x.bodiesByRole[r])) / nSeeds])) as Record<Role, number>;
const exposure = CLASSES.map((k) => {
  const perRole = ROLES.map((role) => {
    const init = sum(ROWS.map((r) => r.initByRole[`${k}|${role}`] ?? 0));
    const exp = sum(ROWS.map((r) => r.expByRole[`${k}|${role}`] ?? 0));
    const bodies = bodiesByRole[role] * nSeeds; // body-matches of this role
    const initPerBodyPerMatch = bodies === 0 ? 0 : init / bodies;
    const expPerBodyPerMatch = bodies === 0 ? 0 : exp / bodies;
    const expPerSeason = expPerBodyPerMatch * LEAGUE_FIXTURES_PER_SEASON;
    const initPerSeason = initPerBodyPerMatch * LEAGUE_FIXTURES_PER_SEASON;
    return {
      role,
      bodyMatches: bodies,
      initiations: init, exposuresInRelevance: exp,
      initiationsPerBodyPerMatch: round(initPerBodyPerMatch, 5),
      exposuresPerBodyPerMatch: round(expPerBodyPerMatch, 5),
      initiationsPerBodyPerSeason: round(initPerSeason, 4),
      exposuresPerBodyPerSeason: round(expPerSeason, 4),
      seasonsToL3Yardstick: expPerSeason <= 0 ? 'NEVER' : round(L3_YARDSTICK_LABELS / expPerSeason, 3),
      feasible: expPerSeason > 0 && L3_YARDSTICK_LABELS / expPerSeason <= L3_TAU_SEASONS,
    };
  });
  return { klass: k, perRole };
});

/* ========================================================================== */
/* §10 THE decisionTimer CADENCE SPECTRUM (instrument (b), measured)            */
/* ========================================================================== */
const spectrumPooled: Record<string, number> = {};
for (const r of ROWS) {
  for (const [k, v] of Object.entries(r.resetSpectrum)) {
    spectrumPooled[k] = (spectrumPooled[k] ?? 0) + v;
  }
}
/** ⭐ Each observed reset value fingerprints its write site 1:1 — the decrement (`Player.update`) */
/** runs BETWEEN the decide loop and `stepBall`, so a cadence re-arm reads AI_INTERVAL − DT while */
/** every `stepBall`-side override reads its raw constant. */
const RESET_ATTRIBUTION: Record<string, string> = {
  [(AI_INTERVAL - DT).toFixed(5)]: 'src/sim/Match.ts — the ordinary cadence re-arm '
    + '(`p.decisionTimer = AI_INTERVAL`), observed post-decrement',
  '0.00000': 'src/sim/mechanics.ts performTouchPast — ⭐ KNOCK-AND-GO, self-initiated zero latency',
  '0.30000': 'src/sim/Match.ts giveBall — the open-play capture settle',
  '0.18000': 'src/sim/Match.ts giveBall — the re-collect settle / the GK-feet cap',
  '0.08000': 'src/sim/Match.ts giveBall — the in-shooting-range settle',
  '0.12000': 'src/sim/Match.ts — the restart taker ("kick promptly")',
  '0.07000': 'src/sim/Match.ts — the touch-past fork\'s own re-decide',
  '0.05000': 'src/sim/Match.ts — substitution arrival / kick-off striker',
};
const spectrumRows = Object.entries(spectrumPooled)
  .sort((a, b) => b[1] - a[1])
  .map(([value, count]) => ({
    valueSimSeconds: Number(value),
    valueAppliedTicks: round(Number(value) / DT, 4),
    count,
    sharePooled: round(count / sum(Object.values(spectrumPooled)), 6),
    attributedSite: RESET_ATTRIBUTION[value] ?? 'UNATTRIBUTED — no src write site has this value',
  }));
const spectrumAllAttributed = spectrumRows.every((r) => !r.attributedSite.startsWith('UNATTRIBUTED'));

/* ========================================================================== */
/* §11 gFaces — RE-DERIVED FROM THE SERIALIZED ARTIFACT ON DISK (#287 item 1)  */
/* ========================================================================== */
const rederiveFromDisk = (p: string): { checked: number; bad: string[]; parsed: boolean } => {
  const bad: string[] = [];
  let checked = 0;
  let parsed = false;
  try {
    const file = readJson(p);
    const cells = (file.perSeedCells ?? []) as Record<string, unknown>[];
    const faces = (file.faces ?? []) as Record<string, unknown>[];
    parsed = cells.length > 0 && faces.length > 0;
    for (const f of faces) {
      const key = String(f.key);
      const klass = String(f.klass);
      const relation = String(f.relation);
      const role = String(f.role);
      let steerN = 0;
      let steerLe1 = 0;
      let bodies = 0;
      let appK1 = 0;
      let divK1 = 0;
      for (const c of cells) {
        const groups = c.groups as Record<string, number[]>;
        for (const [gk, g] of Object.entries(groups)) {
          const [k2, rel2, role2] = gk.split('|');
          if ((klass === 'ALL' || k2 === klass) && (relation === 'ALL' || rel2 === relation)
            && (role === 'ALL' || role2 === role)) {
            steerN += g[GF.steerN]; steerLe1 += g[GF.steerLe1]; bodies += g[GF.bodies];
            appK1 += g[GF.steerAppK1]; divK1 += g[GF.steerDivK1];
          }
        }
      }
      const st = f.steer as Record<string, unknown>;
      checked++;
      if (Number(f.affectedBodiesInRelevance) !== bodies) bad.push(`${key}.bodies`);
      if (Number(st.applicableBodies) !== steerN) bad.push(`${key}.steerN`);
      const expect = steerN === 0 ? 'UNMEASURED' : round(steerLe1 / steerN, 6);
      if (String(st.shareWithinOneTick) !== String(expect)) bad.push(`${key}.shareWithinOneTick`);
      if (Number(st.applicableOnFirstTick) !== appK1) bad.push(`${key}.applicableOnFirstTick`);
      const expectK1 = appK1 === 0 ? 'UNMEASURED' : round(divK1 / appK1, 6);
      if (String(st.shareRetargetedOnFirstTickGivenApplicableThen) !== String(expectK1)) {
        bad.push(`${key}.shareRetargetedOnFirstTick`);
      }
    }
  } catch (e) { bad.push(`PARSE-FAILED: ${String(e)}`); }
  return { checked, bad, parsed };
};

/* ========================================================================== */
/* §12 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean;
  live: boolean;
}
interface GateSpec<I> {
  name: string; fn: (i: I) => Conj; input: I;
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

/* ---- 2 xSrcUntouched (the CORRECTED form: BU-C0 §COMMANDER CORRECTIONS 5, ruling #286 item 1) ---- */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
registerGate<{ diff: string; status: string }>({
  name: 'xSrcUntouched',
  fn: (i) => ({ noDiffAgainstHead: i.diff === '', noUntrackedOrStaged: i.status === '' }),
  input: { diff: srcDiff, status: srcStatus },
  mutants: [
    { conjunct: 'noDiffAgainstHead', name: 'src moved against HEAD', mutate: (i) => ({ ...i, diff: 'src/sim/Match.ts | 2 +-' }) },
    { conjunct: 'noUntrackedOrStaged', name: 'an untracked src file appeared', mutate: (i) => ({ ...i, status: '?? src/x.ts' }) },
  ],
});

/* ---- 3 gArms ---- */
const armOkCount = ROWS.filter((r) => r.armOk).length;
registerGate<{ ok: number; total: number; w: typeof worldSeedOk }>({
  name: 'gArms',
  fn: (i) => ({
    everyWalkedMatchCarriesTheV7ArmLive: i.ok === i.total,
    nonVacuousWalkCount: i.total > 0,
    theArmedProbeMatchIsArmed: i.w.armedIsArmed,
    theBareProbeMatchIsNotArmed: i.w.bareIsNotArmed,
    theTwoWorldsAreDistinguishable: i.w.theTwoWorldsDiverge,
  }),
  input: { ok: armOkCount, total: ROWS.length, w: worldSeedOk },
  mutants: [
    { conjunct: 'everyWalkedMatchCarriesTheV7ArmLive', name: 'a walk was not the v7 world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
    { conjunct: 'theArmedProbeMatchIsArmed', name: 'the arm did not take', mutate: (i) => ({ ...i, w: { ...i.w, armedIsArmed: false } }) },
    { conjunct: 'theBareProbeMatchIsNotArmed', name: 'the bare world was armed too', mutate: (i) => ({ ...i, w: { ...i.w, bareIsNotArmed: false } }) },
    { conjunct: 'theTwoWorldsAreDistinguishable', name: 'the two worlds were identical', mutate: (i) => ({ ...i, w: { ...i.w, theTwoWorldsDiverge: false } }) },
  ],
});

/* ---- 4 gDose — ⭐ #289 canon: hash the FILE BYTES, re-derive the digest from them ---- */
const doseLabels = sum(DOSE.map((c) => c.lunges));
registerGate<{ rederived: string; bytes: string; labels: number; groups: number }>({
  name: 'gDose',
  fn: (i) => ({
    theDoseArtifactsOwnBytesRederiveTheShippedDigest: i.rederived === L3_T1_SHA,
    theBytesWereActuallyHashed: i.bytes.length === 64,
    theDoseIsNonEmpty: i.labels > 0,
    theDoseHasBothArrivalGroups: i.groups === 2,
  }),
  input: {
    rederived: DOSE_REDERIVED_SHA, bytes: DOSE_FILE_BYTES_SHA, labels: doseLabels, groups: DOSE.length,
  },
  mutants: [
    { conjunct: 'theDoseArtifactsOwnBytesRederiveTheShippedDigest', name: 'the dose file drifted', mutate: (i) => ({ ...i, rederived: 'x'.repeat(64) }) },
    { conjunct: 'theBytesWereActuallyHashed', name: 'no bytes were hashed', mutate: (i) => ({ ...i, bytes: '' }) },
    { conjunct: 'theDoseIsNonEmpty', name: 'an empty dose', mutate: (i) => ({ ...i, labels: 0 }) },
    { conjunct: 'theDoseHasBothArrivalGroups', name: 'one arrival group only', mutate: (i) => ({ ...i, groups: 1 }) },
  ],
});

/* ---- 5 gClock — the APPLIED clock, stated once and asserted ---- */
const tickTotals = ROWS.map((r) => r.ticks);
registerGate<{ dt: number; dur: number; ticksOk: boolean; ai: number }>({
  name: 'gClock',
  fn: (i) => ({
    theSimTickIsTheShippedDT: i.dt === 1 / 60,
    theMatchDurationIsTheShippedDefault: i.dur === 240,
    everyWalkRanTheFullAppliedTickCount: i.ticksOk,
    theCadenceConstantIsTheShippedOne: i.ai === 0.15,
  }),
  input: {
    dt: DT, dur: MATCH_DURATION, ai: AI_INTERVAL,
    ticksOk: tickTotals.every((t) => t === Math.round(MATCH_DURATION / DT)) && tickTotals.length > 0,
  },
  mutants: [
    { conjunct: 'theSimTickIsTheShippedDT', name: 'DT changed', mutate: (i) => ({ ...i, dt: 1 / 30 }) },
    { conjunct: 'theMatchDurationIsTheShippedDefault', name: 'the clock was overridden', mutate: (i) => ({ ...i, dur: 120 }) },
    { conjunct: 'everyWalkRanTheFullAppliedTickCount', name: 'a walk was short', mutate: (i) => ({ ...i, ticksOk: false }) },
    { conjunct: 'theCadenceConstantIsTheShippedOne', name: 'AI_INTERVAL changed', mutate: (i) => ({ ...i, ai: 0.2 }) },
  ],
});

/* ---- 6 gSeamMap — the map is LOCATED in src, never typed ---- */
const LOAD_BEARING_CHANNELS = ['stepOrder.executeLoop', 'steering.mark.reactionLag',
  'assignment.chasers', 'initiator.knockAndGo'] as const;
registerGate<{ allLocated: boolean; count: number; shas: Record<string, string>; loadBearing: number }>({
  name: 'gSeamMap',
  fn: (i) => ({
    everyNeedleWasFoundInTheShippedBytes: i.allLocated,
    theMapIsNonEmpty: i.count >= 15,
    everySourceFileWasActuallyHashed: Object.values(i.shas).every((s) => s.length === 64)
      && Object.keys(i.shas).length >= 4,
    theLoadBearingSeamsArePresent: i.loadBearing === LOAD_BEARING_CHANNELS.length,
  }),
  input: {
    allLocated: seamAllLocated, count: seamRows.length, shas: SRC_FILE_SHAS,
    loadBearing: LOAD_BEARING_CHANNELS
      .filter((c) => seamRows.some((r) => r.channel === c && r.line > 0)).length,
  },
  mutants: [
    { conjunct: 'everyNeedleWasFoundInTheShippedBytes', name: 'a needle vanished from src', mutate: (i) => ({ ...i, allLocated: false }) },
    { conjunct: 'theMapIsNonEmpty', name: 'the map was empty', mutate: (i) => ({ ...i, count: 0 }) },
    { conjunct: 'everySourceFileWasActuallyHashed', name: 'no src bytes were hashed', mutate: (i) => ({ ...i, shas: {} }) },
    { conjunct: 'theLoadBearingSeamsArePresent', name: 'the executor seam went missing', mutate: (i) => ({ ...i, loadBearing: i.loadBearing - 1 }) },
  ],
});

/* ---- 7 gNonVacuity — denominators shown; never-occurred ≠ unmeasured ---- */
const totalEvents = sum(CLASSES.map((k) => sum(ROWS.map((r) => r.events[k]))));
const classesWithEvents = CLASSES.filter((k) => sum(ROWS.map((r) => r.events[k])) > 0).length;
const totalAffected = FACES[0].affectedBodiesInRelevance;
const totalSteerBodies = FACES[0].steer.applicableBodies;
registerGate<{ ev: number; cls: number; aff: number; steer: number; fam: number; all: number }>({
  name: 'gNonVacuity',
  fn: (i) => ({
    theBatteryProducedEventsInTheThousands: i.ev >= 1000,
    everyClassEitherOccurredOrIsPublishedAsNeverOccurred: i.cls >= 1,
    theAffectedPopulationIsNonEmpty: i.aff > 0,
    theSteeringChannelHadAnApplicablePopulation: i.steer > 0,
    theInterceptFamilyDenominatorIsPublished: i.all > 0 && i.fam > 0,
  }),
  input: {
    ev: totalEvents, cls: classesWithEvents, aff: totalAffected, steer: totalSteerBodies,
    fam: sum(ROWS.map((r) => r.familyBodyTicks)), all: sum(ROWS.map((r) => r.allBodyTicks)),
  },
  mutants: [
    { conjunct: 'theBatteryProducedEventsInTheThousands', name: 'a thin battery', mutate: (i) => ({ ...i, ev: 12 }) },
    { conjunct: 'everyClassEitherOccurredOrIsPublishedAsNeverOccurred', name: 'no class occurred', mutate: (i) => ({ ...i, cls: 0 }) },
    { conjunct: 'theAffectedPopulationIsNonEmpty', name: 'nobody was affected', mutate: (i) => ({ ...i, aff: 0 }) },
    { conjunct: 'theSteeringChannelHadAnApplicablePopulation', name: 'the steering face was vacuous', mutate: (i) => ({ ...i, steer: 0 }) },
    { conjunct: 'theInterceptFamilyDenominatorIsPublished', name: 'the applicability denominator was hidden', mutate: (i) => ({ ...i, fam: 0 }) },
  ],
});

/* ---- 8 gCadenceSpectrum — every observed reset value maps to a src write site ---- */
registerGate<{ count: number; attributed: boolean; modeIsCadence: boolean; knockSeen: boolean }>({
  name: 'gCadenceSpectrum',
  fn: (i) => ({
    theSpectrumIsNonEmpty: i.count > 0,
    everyObservedResetValueIsAttributedToASrcSite: i.attributed,
    theOrdinaryCadenceDominates: i.modeIsCadence,
    theKnockAndGoValueIsObserved: i.knockSeen,
  }),
  input: {
    count: spectrumRows.length, attributed: spectrumAllAttributed,
    modeIsCadence: spectrumRows.length > 0
      && spectrumRows[0].valueSimSeconds === round(AI_INTERVAL - DT, 5),
    knockSeen: spectrumRows.some((r) => r.valueSimSeconds === 0),
  },
  mutants: [
    { conjunct: 'theSpectrumIsNonEmpty', name: 'no resets seen', mutate: (i) => ({ ...i, count: 0 }) },
    { conjunct: 'everyObservedResetValueIsAttributedToASrcSite', name: 'an unattributed value', mutate: (i) => ({ ...i, attributed: false }) },
    { conjunct: 'theOrdinaryCadenceDominates', name: 'the cadence was not the mode', mutate: (i) => ({ ...i, modeIsCadence: false }) },
    { conjunct: 'theKnockAndGoValueIsObserved', name: 'knock-and-go never fired', mutate: (i) => ({ ...i, knockSeen: false }) },
  ],
});

/* ---- 9 gLagBounds — the measured lags are inside their own declared horizons ---- */
const lagBoundsOk = FACES.every((f) => (f.steer.meanTicks === 'UNMEASURED'
  || (f.steer.meanTicks >= 1 && f.steer.meanTicks <= H_STEER))
  && (f.decide.meanTicks === 'UNMEASURED' || (f.decide.meanTicks >= 1 && f.decide.meanTicks <= H_DECIDE)));
const histSumsOk = FACES.every((f) => sum(f.steer.histogramTicks) === f.steer.applicableBodies);
registerGate<{ bounds: boolean; hist: boolean; horizonSteer: number; horizonDecide: number }>({
  name: 'gLagBounds',
  fn: (i) => ({
    everyPublishedLagIsInsideItsHorizon: i.bounds,
    everyHistogramSumsToItsOwnDenominator: i.hist,
    theHorizonsAreTheFrozenOnes: i.horizonSteer === 30 && i.horizonDecide === 60,
  }),
  input: { bounds: lagBoundsOk, hist: histSumsOk, horizonSteer: H_STEER, horizonDecide: H_DECIDE },
  mutants: [
    { conjunct: 'everyPublishedLagIsInsideItsHorizon', name: 'a lag escaped its horizon', mutate: (i) => ({ ...i, bounds: false }) },
    { conjunct: 'everyHistogramSumsToItsOwnDenominator', name: 'a histogram lost rows', mutate: (i) => ({ ...i, hist: false }) },
    { conjunct: 'theHorizonsAreTheFrozenOnes', name: 'the horizons moved', mutate: (i) => ({ ...i, horizonSteer: 5 }) },
  ],
});

/* ---- 10 gExposure — the feasibility arithmetic is closed and traced ---- */
const exposureClosed = exposure.every((e) => e.perRole.every((r) => r.bodyMatches > 0));
registerGate<{ closed: boolean; fixtures: number; yard: number; tau: number }>({
  name: 'gExposure',
  fn: (i) => ({
    everyRoleHasAPublishedBodyMatchDenominator: i.closed,
    theSeasonLengthIsTheEnginesOwn: i.fixtures === 7,
    theYardstickIsTheL3T1TracedOne: i.yard === 184,
    theTauSeasonCountIsTheL3T1One: i.tau === 12,
  }),
  input: {
    closed: exposureClosed, fixtures: LEAGUE_FIXTURES_PER_SEASON,
    yard: L3_YARDSTICK_LABELS, tau: L3_TAU_SEASONS,
  },
  mutants: [
    { conjunct: 'everyRoleHasAPublishedBodyMatchDenominator', name: 'a role lost its denominator', mutate: (i) => ({ ...i, closed: false }) },
    { conjunct: 'theSeasonLengthIsTheEnginesOwn', name: 'an invented season length', mutate: (i) => ({ ...i, fixtures: 38 }) },
    { conjunct: 'theYardstickIsTheL3T1TracedOne', name: 'a taste yardstick', mutate: (i) => ({ ...i, yard: 30 }) },
    { conjunct: 'theTauSeasonCountIsTheL3T1One', name: 'tau invented', mutate: (i) => ({ ...i, tau: 3 }) },
  ],
});

/* ---- 11 gSeeds — BOOKED = WALKED, and the preflight band is disjoint ---- */
const walkedSeeds = [...SEEDS, GWORLD_SEED];
const bookedBand: [number, number] = [12_496_000, 12_496_999];
const retiredBand: [number, number] = [12_494_000, 12_494_999];
registerGate<{ outsideBand: number; retiredHits: number; preflightHits: number; n: number }>({
  name: 'gSeeds',
  fn: (i) => ({
    everyWalkedSeedIsInsideTheBookedBand: i.outsideBand === 0,
    noWalkedSeedTouchesTheRetiredBlock: i.retiredHits === 0,
    thePreflightBandIsDisjointFromEveryRecordSeed: i.preflightHits === 0,
    theWalkedListIsNonEmpty: i.n > 0,
  }),
  input: {
    outsideBand: walkedSeeds.filter((s) => s < bookedBand[0] || s > bookedBand[1]).length,
    retiredHits: walkedSeeds.filter((s) => s >= retiredBand[0] && s <= retiredBand[1]).length,
    preflightHits: walkedSeeds.filter((s) => s >= PREFLIGHT_BAND[0] && s <= PREFLIGHT_BAND[1]).length,
    n: walkedSeeds.length,
  },
  mutants: [
    { conjunct: 'everyWalkedSeedIsInsideTheBookedBand', name: 'a seed outside the band', mutate: (i) => ({ ...i, outsideBand: 1 }) },
    { conjunct: 'noWalkedSeedTouchesTheRetiredBlock', name: 'the retired block was touched', mutate: (i) => ({ ...i, retiredHits: 1 }) },
    { conjunct: 'thePreflightBandIsDisjointFromEveryRecordSeed', name: 'the preflight band collided', mutate: (i) => ({ ...i, preflightHits: 1 }) },
    { conjunct: 'theWalkedListIsNonEmpty', name: 'nothing walked', mutate: (i) => ({ ...i, n: 0 }) },
  ],
});

/* ---- 12 gEnvelope — invocation facts stay OUT of the hashed body (#289 item 1) ---- */
const FORBIDDEN_BODY_KEYS = ['preflight', 'preflightReasons', 'mode', 'wallMs', 'generatedAt',
  'head', 'outPath'] as const;
const envelopeInput = { forbidden: [] as string[], crossOutIdentical: false, rederivesFromDisk: false };
registerGate<typeof envelopeInput>({
  name: 'gEnvelope',
  fn: (i) => ({
    noInvocationFactIsInsideTheHashedBody: i.forbidden.length === 0,
    twoInvocationsHashTheSameBody: i.crossOutIdentical,
    theArtifactOnDiskRederivesItsOwnDigest: i.rederivesFromDisk,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'noInvocationFactIsInsideTheHashedBody', name: 'an invocation fact leaked into the body', mutate: (i) => ({ ...i, forbidden: ['mode'] }) },
    { conjunct: 'twoInvocationsHashTheSameBody', name: 'the envelope entered the hash', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'theArtifactOnDiskRederivesItsOwnDigest', name: 'the disk copy disagrees', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
  ],
});

/* ---- 13 gFaces — parsed from the SERIALIZED artifact (#287 item 1) ---- */
const gFacesInput = { checked: 0, bad: [] as string[], parsed: false, keys: 0 };
registerGate<typeof gFacesInput>({
  name: 'gFaces',
  fn: (i) => ({
    everyFaceRederivesFromTheSerializedCells: i.bad.length === 0,
    theArtifactParsed: i.parsed,
    everyPublishedFaceWasChecked: i.checked === i.keys && i.keys > 0,
  }),
  input: gFacesInput,
  mutants: [
    { conjunct: 'everyFaceRederivesFromTheSerializedCells', name: 'a face disagreed with its cells', mutate: (i) => ({ ...i, bad: ['x'] }) },
    { conjunct: 'theArtifactParsed', name: 'the artifact did not parse', mutate: (i) => ({ ...i, parsed: false }) },
    { conjunct: 'everyPublishedFaceWasChecked', name: 'a face escaped the check', mutate: (i) => ({ ...i, checked: i.checked - 1 }) },
  ],
});

/* ---- 14 gMutants — the machine-derived liveness map (#268.3(a)) ---- */
const gMutantsInput = { uncovered: [] as string[], dead: 0, total: 0 };
registerGate<typeof gMutantsInput>({
  name: 'gMutants',
  fn: (i) => ({
    everyConjunctIsCoveredByExactlyOneMutant: i.uncovered.length === 0,
    everyOtherMutantIsLive: i.dead === 0,
    theMutantSetIsNonEmpty: i.total > 0,
  }),
  input: gMutantsInput,
  mutants: [
    { conjunct: 'everyConjunctIsCoveredByExactlyOneMutant', name: 'an uncovered conjunct', mutate: (i) => ({ ...i, uncovered: ['x.y'] }) },
    { conjunct: 'everyOtherMutantIsLive', name: 'a dead mutant', mutate: (i) => ({ ...i, dead: 1 }) },
    { conjunct: 'theMutantSetIsNonEmpty', name: 'no mutants', mutate: (i) => ({ ...i, total: 0 }) },
  ],
});

/* ========================================================================== */
/* §13 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
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
  banner('PC-C0 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
/* §14 THE ARTIFACT                                                            */
/* ========================================================================== */
const cellOf = (r: SeedRow): Record<string, unknown> => ({
  seed: r.seed, ticks: r.ticks, armOk: r.armOk,
  events: r.events, eventsPressed: r.eventsPressed,
  initByRole: r.initByRole, expByRole: r.expByRole, bodiesByRole: r.bodiesByRole,
  resetSpectrum: r.resetSpectrum,
  familyBodyTicks: r.familyBodyTicks, allBodyTicks: r.allBodyTicks,
  groups: Object.fromEntries(Object.entries(r.groups)
    .filter(([, g]) => g.bodiesAll > 0)
    .map(([k, g]) => [k, [
      g.steerN, g.steerSum, g.steerLe1, g.steerHist[0], g.steerAppK1, g.steerDivK1,
      g.decideN, g.decideSum, g.decideHist[0],
      g.actionN, g.actionSum, g.actionChanged, g.bodies, g.bodiesAll,
    ]])),
});
/** The published field order of every `perSeedCells[].groups[key]` array (#282 item 2(ii)). */
const GROUP_FIELD_ORDER = ['steerN', 'steerSum', 'steerLe1', 'steerNever', 'steerAppK1',
  'steerDivK1', 'decideN', 'decideSum', 'decideNever', 'actionN', 'actionSum', 'actionChanged',
  'bodies', 'bodiesAll'] as const;
const GF = Object.fromEntries(GROUP_FIELD_ORDER.map((k, i) => [k, i])) as Record<string, number>;

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'PC-C0 — THE REACTION-BASELINE CENSUS',
  doc: 'docs/world-model/PC-C0-REACTION-BASELINE.md',
  contract: 'docs/world-model/PC-PERCEPTION-CONTRACT.md §3 (PC-C0), bound #296 item 2, '
    + 'dispatched #296 item 3',
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'HOW FAST does today\'s world react, per surprise class, per role, per channel — '
      + 'and WHERE would a latency law have to bite? INSTRUMENT-ONLY.',
    arm: '⭐ THE v7 WORLD: `new Match({...a4MatchFlags(7)})` + `armA4World(m, null, 7, '
      + 'poolT1DoseCells(L3-T1))`, asserted LIVE on every walked match (ruling #283 item 2 — '
      + 'League.toJSON omits matchFlags, so a fixture-simmed match would NOT be this world).',
    clockConvention: {
      statement: '⭐ EVERY lag in this artifact is APPLIED TICKS on the SIM clock. k = 1 means '
        + '"the first executor call after the step in which the event became observable".',
      simTickSeconds: DT, matchDurationSimSeconds: MATCH_DURATION,
      appliedTicksPerWalk: Math.round(MATCH_DURATION / DT),
      aiIntervalSimSeconds: AI_INTERVAL, aiIntervalAppliedTicks: round(AI_INTERVAL / DT, 4),
      teamAiIntervalSimSeconds: TEAM_AI_INTERVAL,
      teamAiIntervalAppliedTicks: round(TEAM_AI_INTERVAL / DT, 4),
      doctrineTiersAppliedTicks: {
        simpleTier0p2SimSeconds: round(0.2 / DT, 4),
        choiceTier0p4SimSeconds: round(0.4 / DT, 4),
        choiceTier0p5SimSeconds: round(0.5 / DT, 4),
      },
      whyNotScoreboard: 'the 22.5× scoreboard mapping is display-only; body physics (and therefore '
        + 'reaction) lives on the sim clock — PC contract §2 M-PC.1.',
    },
    channelDefinitions: {
      steer: 'the per-tick truth-tracking STEERING channel. lag = the first tick k ≥ 1 at which '
        + `\`interceptBall(body_k, LIVE ball_k).point\` differs by > ${STEER_EPS_M} m from `
        + '`interceptBall(body_k, the ball FROZEN at the pre-event tick).point`. The engine\'s '
        + 'OWN function is called on both sides — no formula is copied. APPLICABLE only while the '
        + 'body is in the intercept family (ChaseBall not containing / ReceivePass / '
        + 'InterceptPass); the applicability denominator is published per face.',
      decide: 'the DECISION-SLOT channel. lag = the first tick k ≥ 1 at which this body\'s '
        + '`decisionTimer` was ≤ 0 entering the step, i.e. the first tick he re-decides.',
      action: 'the ACTION channel. lag = the first tick k ≥ 1 at which `p.action.type` or '
        + '`p.action.targetIdx` differs from what it was at the event. Censored at the horizon; '
        + 'the share that changed at all is published beside the mean.',
    },
    horizonsAppliedTicks: { steer: H_STEER, decide: H_DECIDE, action: H_DECIDE },
    relevanceRadiusMetres: RELEVANCE_M,
    pressedSplitDefinition: 'an EVENT is PRESSED when an opponent of the initiator is within '
      + `TOUCH_CONTROL_DIST = ${TOUCH_CONTROL_DIST} m of the ball at the event tick.`,
    movingDenominatorDisclosure: '⭐ TWO denominators per face and BOTH published: '
      + '`affectedBodiesInRelevance` (inside the relevance radius — the population the lags are '
      + 'measured on) and `affectedBodiesAllDistances` (every non-initiator body). Steering lags '
      + 'carry a THIRD, `steer.applicableBodies`, because the intercept family is a subset.',
  },

  /* ---- (b) THE INSERTION-SEAM MAP ---- */
  insertionSeamMap: {
    method: 'each channel\'s needle is searched in the SHIPPED bytes at run time; the line number '
      + 'is whatever src says. A needle that vanishes fails gSeamMap.',
    srcFileSha256: SRC_FILE_SHAS,
    channels: seamRows.map((r) => ({
      channel: r.channel, location: `${r.file}:${r.line}`, occurrencesOfNeedle: r.occurrences,
      reads: r.reads, cadence: r.cadence, targetHoldVerdict: r.holdSufficient, note: r.note,
    })),
    verdictLegend: {
      'HOLD-SUFFICIENT': 'a per-body TARGET-HOLD on this channel is sufficient — the channel is '
        + 'evaluated inside the body\'s own executor/decision call.',
      'HOLD-INSUFFICIENT': 'the channel is evaluated OUTSIDE the body\'s own call (team layer) — '
        + 'a per-body hold does not cover it; PC-T0 must rule on it explicitly.',
      'ALREADY-A-HOLD': 'the world already holds here; the new law composes with it rather than '
        + 'replacing it.',
      'INITIATOR-PATH': 'a self-initiated write — M-PC.4 says it stays latency-free.',
    },
    existingLatencyStructure: {
      decisionTimerResetSpectrum: spectrumRows,
      everyObservedValueAttributed: spectrumAllAttributed,
      note: '⭐ the reset value is a 1:1 fingerprint of its write site: `Player.update` decrements '
        + 'BETWEEN the decide loop and `stepBall`, so the ordinary cadence re-arm is observed as '
        + `AI_INTERVAL − DT = ${round(AI_INTERVAL - DT, 5)} sim-s while every stepBall-side `
        + 'override is observed at its raw constant.',
    },
  },

  /* ---- (c) THE CLASSES + EXPOSURE ---- */
  situationClasses: CLASS_DEFS,
  exposure: {
    seasonDefinition: `${LEAGUE_FIXTURES_PER_SEASON} league fixtures per franchise per season `
      + '(src/sim/League.ts: 16 teams, two divisions of eight, single round-robin). The Evo Cup '
      + 'adds 1–4 more for the teams that survive it — NOT counted, so every seasons-to-fill '
      + 'number here is CONSERVATIVE (an upper bound on the seasons needed).',
    yardstick: {
      labels: L3_YARDSTICK_LABELS, seasons: L3_YARDSTICK_SEASONS, tauSeasons: L3_TAU_SEASONS,
      source: 'L3-T1-CONVERGENCE-EXAM.md — the RARE cell\'s per-book fill at 15 seasons was min '
        + `${L3_YARDSTICK_LABELS} labels, and τ cleared only at ${L3_TAU_SEASONS} seasons.`,
      caveat: '⚠ A TRANSFERRED yardstick, not a measured PC threshold. L3\'s book had to ORDER '
        + 'two outcome rates; a PC recognition book only needs COVERAGE of a class (M-PC.3), '
        + 'which plausibly needs far fewer exposures. Read `exposuresPerBodyPerSeason` as the '
        + 'primary number and `seasonsToL3Yardstick` as a pessimistic bound.',
    },
    perClass: exposure,
    bodiesByRolePerMatch: bodiesByRole,
  },

  /* ---- (d) THE SELF-INITIATED INVENTORY ---- */
  selfInitiatedInventory: {
    builtExemplar: {
      what: 'KNOCK-AND-GO — `p.decisionTimer = 0` at the aimed touch-past release',
      where: seamRows.find((r) => r.channel === 'initiator.knockAndGo'),
      cite: 'CB-AFTERMATH-POLISH.md §FIX-① (ruling #273 item 2); INFO-DOCTRINE §0 '
        + '(碰到的瞬间就开始走); the measured effect of record was the knocker\'s stale-label lag '
        + 'collapsing 10 ticks → 1.',
    },
    initiatorPerClass: Object.fromEntries(CLASSES.map((k) => [k, CLASS_DEFS[k].initiator])),
    classesWithNoInitiatorOnTheAffectedSide: ['deflection'],
    honestHalfCase: 'looseBallSpill — the spiller initiated the TOUCH but not the OUTCOME. '
      + 'PC-T0 must rule whether a miscontrol is self-initiated (no latency) or a surprise to its '
      + 'own author. The census does not decide it.',
  },

  /* ---- (a) THE LAG FACES ---- */
  faces: FACES,

  run: {
    N: N_RUN, base: BASE_RUN, walks: ROWS.length,
    appliedTicksWalked: sum(ROWS.map((r) => r.ticks)),
    totalEvents,
    eventsByClass: Object.fromEntries(CLASSES.map((k) => [k, sum(ROWS.map((r) => r.events[k]))])),
    eventsByClassPressed: Object.fromEntries(CLASSES
      .map((k) => [k, sum(ROWS.map((r) => r.eventsPressed[k]))])),
    interceptFamilyBodyTicks: sum(ROWS.map((r) => r.familyBodyTicks)),
    allBodyTicks: sum(ROWS.map((r) => r.allBodyTicks)),
  },
  dose: {
    source: `${T1_PATH} · poolT1DoseCells`,
    fileBytesSha256: DOSE_FILE_BYTES_SHA, rederivedBodySha256: DOSE_REDERIVED_SHA,
    shippedConstant: L3_T1_SHA, cells: DOSE,
  },
  perSeedCells: ROWS.map(cellOf),
  perSeedCellsGroupFieldOrder: GROUP_FIELD_ORDER,
  seeds: {
    walked: walkedSeeds, block: bookedBand,
    preflightBandDeclaredDisjoint: PREFLIGHT_BAND,
    retiredBlockNeverTouched: retiredBand,
  },
  stats: {
    base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: STATS_FLOOR_FROM_RULING,
    step: STATS_STEP,
    note: 'one bootstrap stream seeded at STATS_BASE; the next floor is STATS_BASE + STATS_STEP.',
  },
  gDetDigests: { runA: digestA, runB: digestB },
  gates, mutants, coverage: COVERAGE_MAP, conjunctTotal: CONJUNCT_TOTAL, uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ INSTRUMENT-ONLY: nothing is armed, nothing is built, no seam acquires a caller, and '
      + '`src/**` is byte-untouched.',
    'The steering lag is measured on the INTERCEPT FAMILY only, because that is the family whose '
      + 'target the engine computes with a function this probe can call without copying a formula. '
      + 'MarkOpponent / formationSpot / support / GK channels are mapped BY TRACE, not by lag — '
      + 'their per-tick truth reads are quoted at file:line and asserted by gSeamMap.',
    'The class predicates are STATE-TRANSITION detectors over public engine state, not engine '
      + 'callbacks. A class can therefore under- or over-count at the margin; each predicate is '
      + 'published verbatim so the count can be re-derived or disputed.',
    'The exposure arithmetic uses LEAGUE fixtures only and ignores cup matches, so every '
      + 'seasons-to-fill figure is an upper bound.',
    'No latency law is designed here and no tier is assigned. PC-T0 owns the seam.',
  ],
});

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath, mode: MODE, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256; delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/pc-c0-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body, resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      generatedAt: 'ANOTHER-INVOCATION', head: 'ANOTHER-HEAD', mode: 'ANOTHER-MODE',
      preflight: !IS_PREFLIGHT, preflightReasons: ['ANOTHER-REASON'],
    },
  }, null, 1)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest, reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

let { gates, mutants } = runRegistry();
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
envelopeInput.forbidden = FORBIDDEN_BODY_KEYS
  .filter((k) => canonical(buildBody(gates, mutants)).includes(`"${k}"`));
const disk = rederiveFromDisk(OUT_PATH);
gFacesInput.checked = disk.checked;
gFacesInput.bad = disk.bad;
gFacesInput.parsed = disk.parsed;
gFacesInput.keys = FACES.length;
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [pc-c0] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pc-c0] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
for (const k of CLASSES) {
  const f = FACES.find((x) => x.key === `${k}|ALL|ALL`) as LagFace;
  banner(`  [pc-c0] ${k.padEnd(15)} n=${String(sum(ROWS.map((r) => r.events[k]))).padStart(6)} `
    + `steer≤1t=${String(f.steer.shareWithinOneTick)} (n=${f.steer.applicableBodies}) · `
    + `decide mean=${String(f.decide.meanTicks)} p90=${String(f.decide.p90Ticks)} · `
    + `actionΔ=${String(f.action.shareChangedWithinHorizon)}`);
}
banner(`  [pc-c0] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
