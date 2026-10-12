/**
 * OP-C0 — 「传到对面身上 · 普查」 THE OPPONENT-FIRST CENSUS (ruling #426 item 3).
 *
 * A CENSUS: it publishes measurements as STORED PARTITIONS, adjudicates nothing, ships nothing.
 * X-SRC-ZERO: not one byte under `src/` or `tests/` is created or edited; the instrument CALLS the
 * shipped exports and reads public `Match` state per tick.
 *
 * Doc of record: docs/world-model/OP-C0-OPPONENT-FIRST-CENSUS.md (§0 · §P · §CODE MAP ·
 * §DEV-PREFLIGHT frozen with this file; §R onward written after the battery).
 *
 * RECIPES COPIED BY RECIPE, ⛔ NEVER IMPORTED (each cited at its site below):
 *   - the release detection, `klassOf`, `isDelivery`, `isGroundLaunch`, `isMeasurableGroundPass`,
 *     `contactClassOf` and the FIRST-BODY follow loop — `scripts/probes/bn-c0-bounce-census.ts`
 *     l.463–493 and l.959–1090 (PT-C0's population, reused byte for byte there);
 *   - the corridor membership `inCorridorOf` and the three-way `oppCellOf` —
 *     `bn-c0-bounce-census.ts` l.574–586 (both widths: `DV_CORRIDOR_SCALE` and `CONTROL_RADIUS`);
 *   - the choice read (`laneOpenness` CALLED at the passer's choice-tick position toward the aim
 *     of record; the alternative menu) and `binOf` — `scripts/probes/ln-c1-passer-lane-census.ts`
 *     l.115–118 and l.829–867, re-expressed on the OPPONENT side as #426 item 3(iii) Q3 orders;
 *   - the team builder, the IF-T1b arm construction and its `signatureOf` (with `action.type`)
 *     — `scripts/probes/if-t1b-flight-run-exam.ts` l.1036–1062 (and `tests/ifPlaytestEntry.test.ts`
 *     l.205–247, the IF-ENTRY item 1(c) proof);
 *   - the crowding sample (`crowd.crashShare`) — `scripts/probes/if-c0-flight-run-census.ts`
 *     l.1503–1531.
 *
 * ARMS (#426 item 3(i)): W18-E · W18-D (the dosed pair) and W13-E · W13-D (REFERENCE rows only).
 *
 * ENV (whitelisted; anything else is FATAL): OPC0_MODE=smoke|full · OPC0_N · OPC0_OUT.
 *   smoke  — the disclosed sizing smoke on scratch seeds 900,009,200–211 (+ receipt 220), artifact
 *            routed OFF every canonical path.
 *   full   — the battery 12,561,000–998 + the construction receipt 12,561,999.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve as pathResolve, join as pathJoin } from 'node:path';
import { tmpdir } from 'node:os';
import { Match } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { CONTROL_RADIUS, DT, GRAVITY } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bqArmedVersion, ifArmedVersion, loadL3Dose, loadPcDose,
  BQ_WORLD_VERSION, DS2_WORLD_VERSION, IF_WORLD_VERSION,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { laneOpenness } from '../../src/ai/perception';
import { DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS } from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment } from '../../src/utils/vec';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';
import type { PerceptionSnapshot } from '../../src/ai/perceptionSnapshot';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE                                                         */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const ENV_WHITELIST = ['OPC0_MODE', 'OPC0_N', 'OPC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('OPC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`OP-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = (process.env.OPC0_MODE ?? 'full') as 'smoke' | 'full';
if (MODE !== 'smoke' && MODE !== 'full') {
  banner('OP-C0 FATAL — OPC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.OPC0_N !== undefined ? Number(process.env.OPC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('OP-C0 FATAL — OPC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.OPC0_OUT;
const IS_OVERRIDE = MODE !== 'full' || N_ENV !== undefined || OUT_ENV !== undefined;
const CANONICAL_OUT = 'docs/world-model/data/op-c0-opponent-first-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? pathJoin(tmpdir(), 'op-c0-override.json') : CANONICAL_OUT);
if (IS_OVERRIDE && pathResolve(OUT_BASE).startsWith(CANONICAL_DIR_ABS)) {
  banner('OP-C0 FATAL — an override run may not write under docs/world-model/data'); process.exit(3);
}
const INSTRUMENT_PATH = 'scripts/probes/op-c0-opponent-first-census.ts';
const DOC_PATH = 'docs/world-model/OP-C0-OPPONENT-FIRST-CENSUS.md';
const sha = (v: string | Buffer): string => createHash('sha256').update(v).digest('hex');
const INSTRUMENT_SHA = sha(readFileSync(INSTRUMENT_PATH));
const sh = (cmd: string): string => execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8');
const T_START = Date.now();

/* ========================================================================== */
/* §2 SEEDS (#426 item 3(v))                                                    */
/* ========================================================================== */
const BLOCK_BASE = 12_561_000;
const BLOCK_TOP = 12_561_999;
const SIM_CEILING = 12_562_000; // ⛔ never a SIM seed ≥ this
const SIM_LATTICE_TOP = 900_000_000; // seeds ≥ this are the out-of-band scratch lattice
const N_FROZEN = 999;
const SMOKE_N = 12;
const N = N_ENV ?? (MODE === 'smoke' ? SMOKE_N : N_FROZEN);
/** ⭐ THE ONE DECLARED SCRATCH BASE (#426 item 3(v): scratch 900,009,200–299 from ONE base). */
const SCRATCH_BASE = 900_009_200;
const SCRATCH_TOP = 900_009_299;
const VERIFIER_BAND: readonly [number, number] = [900_009_300, 900_009_399];
const SMOKE_SEEDS = Array.from({ length: SMOKE_N }, (_, i) => SCRATCH_BASE + i);
const SMOKE_RECEIPT = SCRATCH_BASE + 20;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const BATTERY_SEEDS = MODE === 'smoke' ? SMOKE_SEEDS.slice(0, N)
  : Array.from({ length: N }, (_, i) => BLOCK_BASE + i);
const RECEIPT_SEED = MODE === 'smoke' ? SMOKE_RECEIPT : BLOCK_TOP;
/** IF-T1b's own consumed band — its first twelve battery seeds (re-walk ≠ consumption). */
const REPRO_SEEDS = Array.from({ length: 12 }, (_, i) => 12_560_000 + i);
/** every consumed block of record below this one (IF-T1b's list + IF-T1b's own block). */
const CONSUMED_BLOCKS = [12_544_000, 12_545_000, 12_546_000, 12_547_000, 12_548_000,
  12_549_000, 12_550_000, 12_551_000, 12_552_000, 12_553_000, 12_554_000, 12_555_000,
  12_556_000, 12_557_000, 12_558_000, 12_559_000, 12_560_000];
const STATS = { consumed: 0, nextBase: 117_600, registryOfRecord: 88 } as const;
const SCRATCH_SEEDS_USED = MODE === 'smoke'
  ? [...SMOKE_SEEDS.slice(0, N), SMOKE_RECEIPT, WORLD_PIN_SEED, ...LOCKSTEP_SEEDS]
  : [WORLD_PIN_SEED, ...LOCKSTEP_SEEDS];

/* ========================================================================== */
/* §3 ANCHORS — the code map's needles, each pinned to its occurrence count     */
/*    canon (VERBATIM): "a seam-map gate pins occurrence COUNTS per needle and   */
/*    enumerates EVERY occurrence's site"                                        */
/* ========================================================================== */
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const PERC_PATH = 'src/ai/perception.ts';
const SNAP_PATH = 'src/ai/perceptionSnapshot.ts';
const DV_PATH = 'src/ai/deliveryValueSeat.ts';
const A4_PATH = 'src/game/a4World.ts';
const CONST_PATH = 'src/sim/constants.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [BRAIN_PATH, MATCH_PATH, PERC_PATH, SNAP_PATH, DV_PATH, A4_PATH, CONST_PATH]) {
  SRC_OF[p] = readFileSync(p, 'utf8');
}
interface Anchor { what: string; file: string; needle: string; want: number; got: number;
  lines: number[]; ok: boolean }
const ANCHORS: Anchor[] = [];
const lineOf = (text: string, idx: number): number => text.slice(0, idx).split('\n').length;
const anchor = (what: string, file: string, needle: string, want: number): void => {
  const text = SRC_OF[file];
  const lines: number[] = [];
  let i = text.indexOf(needle);
  while (i >= 0) { lines.push(lineOf(text, i)); i = text.indexOf(needle, i + 1); }
  ANCHORS.push({ what, file, needle, want, got: lines.length, lines, ok: lines.length === want });
};
/* — THE DECISION'S READ (truth vs snapshot) — */
anchor('the carrier chooser gateway: the snapshot law is the ONE fork that swaps `opp` off truth',
  BRAIN_PATH, '  const inView = match.inSnapshotLaw', 1);
anchor('`opp` IS `oppTruth` whenever `inView` is null', BRAIN_PATH,
  '  const opp = inView === null ? oppTruth : snapshotTeamView(oppTruth, inView.opps);', 1);
anchor('the ground-pass pricer reads the lane off `opp.players` (the chooser\'s own lane)', BRAIN_PATH,
  "        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),", 1);
anchor('⭐ THE PASSER\'S OWN BAR — the chooser\'s risk gate at 0.4', BRAIN_PATH,
  '      if (gain > 0.15 && lane < 0.4) {', 1);
anchor('the EDS E3 perceived chooser re-seats WHO gets the pass, off his own snapshot', BRAIN_PATH,
  '    match.edsPerceivedChoice && top.action === \'Pass\' && top !== cutbackCand', 1);
anchor('the E3 chooser\'s scope carries EVERY non-sent-off opponent', BRAIN_PATH,
  '    for (const other of opp.players) if (!other.sentOff) scope.add(other.gid);', 1);
anchor('⭐ the ONE scoped snapshot pull by a carrier (the E3 chooser\'s own read)', BRAIN_PATH,
  '    const snapshot = candidateGids.length === 0 ? null : match.perceivedSnapshot(p, scope);', 1);
anchor('the PW chooser\'s scoped pull (dormant: `pwWeightChooser` absent from world 18)', BRAIN_PATH,
  '    const pwSnapshot = pwGids.length === 0 ? null : match.perceivedSnapshot(p, pwScope);', 1);
anchor('the snapshot holds a scoped body ONLY if his memory holds it (presence = remembered)',
  SNAP_PATH, '    if (scope !== null && !scope.has(entity.gid)) continue;', 1);
anchor('…and a body never seen is absent from the snapshot', SNAP_PATH,
  '    const observed = memory.players.get(entity.gid);\n    if (!observed) continue;', 1);
/* — THE DELIVERY SEATS — */
anchor('DLC: the LED candidate enters the same argmax', BRAIN_PATH,
  '        const ledCand = groundCandidate(mate, ledBall.aim, d);', 1);
anchor('the strike plane yields to the DLC seat (inert while `dlcSeat` is open)', BRAIN_PATH,
  '      if (spSeat !== null && dlcSeat === null && ptpSeat === null) {', 1);
anchor('DX: the elected displacement is DEPOSITED for this body at this tick', BRAIN_PATH,
  '        if (match.dxWindupAim && passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)) {', 1);
anchor('the open-play shortPass is WOUND UP (the arm tick is the choice tick)', BRAIN_PATH,
  '          match.armPendingPass(p, passMate!, offsideExemptKick);', 1);
anchor('the SYNCHRONOUS led strike (the DLC led ball struck without a wind-up)', BRAIN_PATH,
  '          match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));', 1);
anchor('the SYNCHRONOUS plain strike (to feet)', BRAIN_PATH,
  '        } else match.performPass(p, passMate!, offsideExemptKick);', 1);
anchor('the wind-up CONSUMES the DX deposit at arm time (an unconsumed deposit = a sync strike)',
  MATCH_PATH, '      dxArmLead = dxDeposit.lead;', 1);
anchor('the wind-up record\'s priced aim (`aim` = the mate\'s arm-time position)', MATCH_PATH,
  '      aim: { x: mate.pos.x, y: mate.pos.y },', 1);
anchor('the wind-up record carries the elected displacement', MATCH_PATH,
  '      aimLead: dxArmLead,', 1);
anchor('the wind-up resolves through the shipped strike with the carried lead', MATCH_PATH,
  '    this.performPass(passer, mate, pp.offsideExempt, 1, pp.aimLead);', 1);
/* — THE DEFENCE'S READ — */
anchor('the defence\'s interception trigger: a pass in flight by the other side, on the ground',
  BRAIN_PATH, '    if (ball.owner === null && match.pendingPass && match.pendingPass.side !== team.side && ball.z <= 0.5) {', 1);
anchor('the defender reads the ball off HIS OWN percept when `edsPerceivedDefence`', BRAIN_PATH,
  '        ? (match.perceivedBalls.get(p.gid) ?? null)', 1);
anchor('…and prices the lane with `canInterceptPass` on that percept', BRAIN_PATH,
  '        ? (seen === null ? null : canInterceptPass(p, { pos: seen.pos, vel: seen.vel } as typeof ball))', 1);
anchor('the interception candidate', BRAIN_PATH,
  "      if (inter?.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });", 1);
/* — THE GEOMETRY CONSTANTS — */
anchor('`laneOpenness` declaration', PERC_PATH,
  'export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {', 1);
anchor('`DV_CORRIDOR_SCALE` (the wide corridor half-width, BN-C0\'s primary)', DV_PATH,
  'export const DV_CORRIDOR_SCALE = 4;', 1);
anchor('`DV_CLEAR_RADIUS` (the clear-the-kicker guard)', DV_PATH,
  'export const DV_CLEAR_RADIUS = 1.5;', 1);
anchor('`CONTROL_RADIUS` (the tight corridor half-width, BN-C0\'s robustness bin)', CONST_PATH,
  'export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;', 1);
anchor('world 18 = world 17 + the flight door, CALLED', A4_PATH,
  '    return { ...a4MatchFlags(DS2_WORLD_VERSION), ...IF_WORLD_DOORS };', 1);
/** the bar, PARSED from its own anchored line (never typed). */
const BAR_LINE = '      if (gain > 0.15 && lane < 0.4) {';
const BAR = Number(BAR_LINE.slice(BAR_LINE.indexOf('lane < ') + 7, BAR_LINE.indexOf(') {')));
const PLAYMAKER_LINE = "        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),";
const PLAYMAKER_MUL = Number(PLAYMAKER_LINE.slice(PLAYMAKER_LINE.indexOf('? ') + 2, PLAYMAKER_LINE.indexOf(' : 1')));
const ANCHORS_OK = ANCHORS.every((a) => a.ok) && BAR === 0.4 && PLAYMAKER_MUL === 1.15
  && DV_CORRIDOR_SCALE === 4 && DV_CLEAR_RADIUS === 1.5 && Number.isFinite(CONTROL_RADIUS);
banner(`OP-C0 anchors ${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} · bar ${BAR} · playmaker ×${PLAYMAKER_MUL}`);

/* ========================================================================== */
/* §4 THE ARMS                                                                  */
/* ========================================================================== */
const ARMS = ['W18-E', 'W18-D', 'W13-E', 'W13-D'] as const;
type Arm = (typeof ARMS)[number];
const ARM_WORLD: Record<Arm, 13 | 18> = { 'W18-E': 18, 'W18-D': 18, 'W13-E': 13, 'W13-D': 13 };
const ARM_DOSED: Record<Arm, boolean> = { 'W18-E': false, 'W18-D': true, 'W13-E': false, 'W13-D': true };

const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE));
const DOSE_BYTES_OK = L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN;
let L3_DOSE: readonly L3DoseCell[] | null = null;
let PC_DOSE: PcDoseTable | null = null;
try {
  L3_DOSE = await loadL3Dose();
  PC_DOSE = await loadPcDose();
} catch (err) {
  banner(`OP-C0 FATAL — the shipped dose loaders failed: ${String(err)}`); process.exit(3);
}
if (!DOSE_BYTES_OK || L3_DOSE === null || PC_DOSE === null) {
  banner('OP-C0 FATAL — dose bytes do not match their pins'); process.exit(3);
}

/** DS-C0's team construction, byte for byte (IF-T1b `teamInfo`, l.1036–1044). */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐ THE ARM CONSTRUCTION — the composer CALLED (`a4MatchFlags(v)`), the shipped arming CALLED
 *  (`armA4World(m, null, v[, L3, PC])` — the GameApp form `armA4World(match, tables, world, l3,
 *  pc)` with no tables; `?pcdose=0` is the empty-book form, i.e. the two doses null). */
const buildMatch = (seed: number, arm: Arm): Match => {
  const v = ARM_WORLD[arm];
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(v),
  } as ConstructorParameters<typeof Match>[0]);
  if (ARM_DOSED[arm]) armA4World(m, null, v, L3_DOSE, PC_DOSE);
  else armA4World(m, null, v);
  return m;
};
/** ⭐ IF-T1b's OWN construction of `OWNCOOP+IF-E13` (l.1051–1062), for gRepro ONLY. */
const buildIfT1bArmOfRecord = (seed: number): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
    ...{ dsOwnRun: true, dsHatsOff: true, dsCoopHatsOff: true },
    ...{ ifFlightRun: true },
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, BQ_WORLD_VERSION);
  return m;
};
/** IF-T1b's `signatureOf` — field for field, INCLUDING `action.type`. */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
    action: pp.action.type,
  })),
}));
const runOut = (m: Match): Match => { while (!m.finished) m.step(DT); return m; };

/* ========================================================================== */
/* §5 THE WALK-SIDE PREDICATES — PURE, fixture-backed                           */
/* ========================================================================== */
/* --- BN-C0 l.457–493 (PT-C0's population, COPIED) --- */
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';
interface StatDelta {
  shots: number; clearances: number; passes: number; crosses: number; cutbacks: number;
  throughBalls: number; longBalls: number; headersWon: number;
}
const klassOf = (d: StatDelta, pendingChangedHere: boolean): Klass | null => {
  let klass: Klass | null = null;
  if (d.shots > 0) klass = d.headersWon > 0 ? 'headerShot' : 'shot';
  if (d.clearances > 0 && klass === null) {
    klass = d.headersWon > 0 ? 'headerClearance' : 'clearance';
  }
  if (d.passes > 0 && klass === null) {
    klass = d.crosses > 0 ? 'cross'
      : d.cutbacks > 0 ? 'cutback'
        : d.throughBalls > 0 ? 'throughBall'
          : d.longBalls > 0 ? 'loftedPass' : 'shortPass';
  }
  if (d.headersWon > 0 && klass === null) klass = 'headerKnockdown';
  if (klass === null && pendingChangedHere) klass = 'other';
  return klass;
};
const isDelivery = (k: Klass): boolean =>
  k !== 'shot' && k !== 'headerShot' && k !== 'headerKnockdown' && k !== 'headerClearance';
const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>
  grounded || !(vzAfterGravity > 0);
const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>
  ground && hasTarget && (k === 'shortPass' || k === 'throughBall' || k === 'cutback');
const GROUND_KLASSES = ['shortPass', 'throughBall', 'cutback'] as const;
/** ⭐⭐ PT-C0's FIRST-BODY CLASSES (BN-C0 l.486–493, byte for byte). */
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');
/** BN-C0 l.730: PT-C0's own retire cap. */
const FLIGHT_RETIRE_TICKS = 720;

/* --- BN-C0 l.574–586: THE CORRIDOR (both widths) and the three-way split --- */
const inCorridorOf = (
  fromX: number, fromY: number, aimX: number, aimY: number,
  px: number, py: number, halfWidth: number,
): boolean => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  if (Math.hypot(cp.x - fromX, cp.y - fromY) < DV_CLEAR_RADIUS) return false;
  return Math.hypot(cp.x - px, cp.y - py) < halfWidth;
};
const SPLITS = ['corridorAtRelease', 'arrivedInFlight', 'struckThrough'] as const;
type Split = (typeof SPLITS)[number];
const oppCellOf = (atRelease: boolean, atContact: boolean): Split =>
  (atRelease ? 'corridorAtRelease' : atContact ? 'arrivedInFlight' : 'struckThrough');
/** LN-C1 l.636–641: the distance to the corridor's centre line (same closest point). */
const centreLineDistOf = (
  fromX: number, fromY: number, aimX: number, aimY: number, px: number, py: number,
): number => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  return Math.hypot(cp.x - px, cp.y - py);
};
/** LN-C1 l.115–118 `binOf`, COPIED. */
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const OPEN_BIN_W = 0.1; const OPEN_BINS = 10;
/** frozen edge bins (lower edges; the last cell is open). */
const edgeBinOf = (v: number, edges: readonly number[]): number => {
  let k = 0;
  for (let i = 0; i < edges.length; i++) if (v >= edges[i]) k = i;
  return k;
};
const MISS_EDGES = [0, 2, 5, 10, 20, 45] as const;         // degrees
const DIST_EDGES = [0, 4, 6, 8, 12, 20] as const;          // metres

/* --- ⭐⭐ THE PRICED LANE AND THE BAR (the chooser's own expression, anchored) --- */
/** the chooser's own `lane`: `min(1, laneOpenness · (playmaker ? 1.15 : 1))`. */
const pricedLaneOf = (rawOpen: number, playmaker: boolean): number =>
  Math.min(1, rawOpen * (playmaker ? PLAYMAKER_MUL : 1));
const belowBarOf = (pricedLane: number): boolean => pricedLane < BAR;
/** ⭐⭐ THE ALTERNATIVE, OPPONENT SIDE — LN-C1's `ownClearAlternativeAtLeastAsOpen` form
 *  (`aOwn >= GATE_040 && aOpp >= oppOpen`) re-expressed on the opponent side: an alternative own
 *  outfield mate (not the passer, not the target) whose PRICED lane is ≥ the bar AND ≥ the chosen
 *  lane's priced openness. */
const altQualifiesOf = (altPriced: number, chosenPriced: number): boolean =>
  altPriced >= BAR && altPriced >= chosenPriced;

/* --- ⭐⭐ THE PRESENCE TEST (truth vs his snapshot) --- */
const PRESENCES = ['truthRead', 'snapshotPresent', 'snapshotAbsent', 'noChoiceRead'] as const;
type Presence = (typeof PRESENCES)[number];
/** `scopedPullAtChoice` = the E3 chooser pulled his scoped snapshot at the choice step;
 *  `inSnapshot` = the first-touch opponent's gid has an entry in it. */
const presenceOf = (choiceKnown: boolean, scopedPullAtChoice: boolean, inSnapshot: boolean): Presence =>
  (!choiceKnown ? 'noChoiceRead' : !scopedPullAtChoice ? 'truthRead'
    : inSnapshot ? 'snapshotPresent' : 'snapshotAbsent');

/* --- ⭐⭐ THE DELIVERY SEAT --- */
const SEATS = ['dlcChoice', 'dxAim', 'plain'] as const;
type Seat = (typeof SEATS)[number];
/** `viaWindupWithLead` = struck out of a wind-up whose record carried a non-zero `aimLead`;
 *  `syncDepositThisStep` = a DX deposit by THIS passer was made on the release step and left
 *  UNCONSUMED (no wind-up took it) ⇒ the synchronous led strike. */
const seatOf = (viaWindup: boolean, windupLead: boolean, syncDepositThisStep: boolean): Seat =>
  (viaWindup ? (windupLead ? 'dxAim' : 'plain') : syncDepositThisStep ? 'dlcChoice' : 'plain');
const WHERE = ['beyondAim', 'besideLine', 'atTheKicker'] as const;
type Where = (typeof WHERE)[number];
/** where a struck-through contact sits against the PRICED segment L→E. */
const whereOf = (lx: number, ly: number, ex: number, ey: number, px: number, py: number): Where => {
  const L = Math.hypot(ex - lx, ey - ly);
  if (!(L > 1e-9)) return 'atTheKicker';
  const t = ((px - lx) * (ex - lx) + (py - ly) * (ey - ly)) / L; // metres along the line
  if (t > L) return 'beyondAim';
  if (t < DV_CLEAR_RADIUS) return 'atTheKicker';
  return 'besideLine';
};
const angleDegBetween = (ax: number, ay: number, bx: number, by: number): number => {
  const la = Math.hypot(ax, ay); const lb = Math.hypot(bx, by);
  if (la < 1e-9 || lb < 1e-9) return Number.NaN;
  const c = (ax * bx + ay * by) / (la * lb);
  return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
};
const ACTS = ['InterceptPass', 'ChaseBall', 'MarkOpponent', 'other'] as const;
const actOf = (t: string): number => {
  const i = (ACTS as readonly string[]).indexOf(t);
  return i < 0 ? 3 : i;
};

/* --- ⭐⭐⭐ THE OWNERSHIP MAPPING (frozen §P.F) --- */
const OWNERS = ['notOpponentFirst', 'price', 'priceGeometry', 'struckNotPriced', 'defenceRead',
  'perception', 'residueBelowBarNoAlternative', 'residueNoChoiceRead'] as const;
type Owner = (typeof OWNERS)[number];
const RESIDUE: readonly Owner[] = ['residueBelowBarNoAlternative', 'residueNoChoiceRead'];
interface OwnerInput {
  fb: ContactClass; split: Split | null; presence: Presence;
  pricedLane: number | null; altOpp: boolean;
}
const ownerOf = (i: OwnerInput): Owner => {
  if (i.fb !== 'opponent') return 'notOpponentFirst';
  if (i.split === 'arrivedInFlight') return 'defenceRead';
  if (i.split === 'struckThrough') return 'struckNotPriced';
  /* the man was IN THE LANE at release */
  if (i.presence === 'snapshotAbsent') return 'perception';
  if (i.presence === 'noChoiceRead' || i.pricedLane === null) return 'residueNoChoiceRead';
  if (belowBarOf(i.pricedLane) && i.altOpp) return 'price';
  if (!belowBarOf(i.pricedLane)) return 'priceGeometry';
  return 'residueBelowBarNoAlternative';
};

/* ========================================================================== */
/* §6 THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) */
/* ========================================================================== */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const D0: StatDelta = { shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0 };
fx('klass.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klass.throughBall', klassOf({ ...D0, passes: 1, throughBalls: 1 }, false), 'throughBall');
fx('klass.lofted', klassOf({ ...D0, passes: 1, longBalls: 1 }, false), 'loftedPass');
fx('klass.shotWins', klassOf({ ...D0, passes: 1, shots: 1 }, false), 'shot');
fx('klass.null', klassOf(D0, false), null);
fx('delivery.shotIsNot', isDelivery('shot'), false);
fx('delivery.crossIs', isDelivery('cross'), true);
fx('ground.grounded', isGroundLaunch(true, 9), true);
fx('ground.rising', isGroundLaunch(false, 0.1), false);
fx('ground.falling', isGroundLaunch(false, -0.1), true);
fx('measurable.short', isMeasurableGroundPass('shortPass', true, true), true);
fx('measurable.lofted', isMeasurableGroundPass('loftedPass', true, true), false);
fx('measurable.airborne', isMeasurableGroundPass('shortPass', false, true), false);
fx('measurable.noTarget', isMeasurableGroundPass('shortPass', true, false), false);
fx('firstBody.none', contactClassOf(null, 4, null, 0), 'none');
fx('firstBody.ownTarget', contactClassOf(4, 4, 0, 0), 'ownTarget');
fx('firstBody.ownNonTarget', contactClassOf(5, 4, 0, 0), 'ownNonTarget');
fx('firstBody.opponent', contactClassOf(9, 4, 1, 0), 'opponent');
/* the corridor test (BN-C0's fixtures, re-run on the copy) */
fx('corridor.onTheLine', inCorridorOf(0, 0, 20, 0, 10, 0, DV_CORRIDOR_SCALE), true);
fx('corridor.threeOff', inCorridorOf(0, 0, 20, 0, 10, 3, DV_CORRIDOR_SCALE), true);
fx('corridor.fourOffIsOut', inCorridorOf(0, 0, 20, 0, 10, 4, DV_CORRIDOR_SCALE), false);
fx('corridor.beyondAimClamped', inCorridorOf(0, 0, 20, 0, 30, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.atTheKickerExcluded', inCorridorOf(0, 0, 20, 0, 1, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.tightExcludesThree', inCorridorOf(0, 0, 20, 0, 10, 3, CONTROL_RADIUS), false);
fx('corridor.tightKeepsTheLine', inCorridorOf(0, 0, 20, 0, 10, 0, CONTROL_RADIUS), true);
fx('split.atRelease', oppCellOf(true, false), 'corridorAtRelease');
fx('split.atReleaseWins', oppCellOf(true, true), 'corridorAtRelease');
fx('split.arrived', oppCellOf(false, true), 'arrivedInFlight');
fx('split.struck', oppCellOf(false, false), 'struckThrough');
/* the bar and the priced lane */
fx('bar.isParsedFromItsLine', BAR, 0.4);
fx('bar.belowFires', belowBarOf(0.39), true);
fx('bar.atBarDoesNotFire', belowBarOf(0.4), false);
fx('bar.aboveDoesNotFire', belowBarOf(0.8), false);
fx('priced.plainIsRaw', pricedLaneOf(0.3, false), 0.3);
fx('priced.playmakerLifts', Math.abs(pricedLaneOf(0.3, true) - 0.345) < 1e-12, true);
fx('priced.capsAtOne', pricedLaneOf(0.95, true), 1);
fx('priced.playmakerCrossesTheBar', belowBarOf(pricedLaneOf(0.36, true)), false);
/* the alternative */
fx('alt.openAndAsOpenFires', altQualifiesOf(0.5, 0.2), true);
fx('alt.belowBarDoesNotFire', altQualifiesOf(0.39, 0.1), false);
fx('alt.lessOpenThanChosenDoesNotFire', altQualifiesOf(0.5, 0.6), false);
fx('alt.equalFires', altQualifiesOf(0.4, 0.4), true);
/* the presence test */
fx('presence.truthRead', presenceOf(true, false, false), 'truthRead');
fx('presence.truthReadIgnoresSnapshot', presenceOf(true, false, true), 'truthRead');
fx('presence.present', presenceOf(true, true, true), 'snapshotPresent');
fx('presence.absent', presenceOf(true, true, false), 'snapshotAbsent');
fx('presence.noChoice', presenceOf(false, true, false), 'noChoiceRead');
/* the seat */
fx('seat.dxAim', seatOf(true, true, false), 'dxAim');
fx('seat.windupNoLeadIsPlain', seatOf(true, false, true), 'plain');
fx('seat.dlcChoice', seatOf(false, false, true), 'dlcChoice');
fx('seat.syncPlain', seatOf(false, false, false), 'plain');
fx('where.beyond', whereOf(0, 0, 20, 0, 25, 1), 'beyondAim');
fx('where.beside', whereOf(0, 0, 20, 0, 10, 6), 'besideLine');
fx('where.atKicker', whereOf(0, 0, 20, 0, 1, 5), 'atTheKicker');
fx('where.behindKicker', whereOf(0, 0, 20, 0, -3, 0), 'atTheKicker');
fx('angle.zero', Math.abs(angleDegBetween(1, 0, 2, 0)) < 1e-9, true);
fx('angle.ninety', Math.abs(angleDegBetween(1, 0, 0, 3) - 90) < 1e-9, true);
fx('bins.open.zero', binOf(0, OPEN_BIN_W, OPEN_BINS), 0);
fx('bins.open.barEdge', binOf(0.4, OPEN_BIN_W, OPEN_BINS), 4);
fx('bins.open.one', binOf(1, OPEN_BIN_W, OPEN_BINS), 9);
fx('bins.miss.edge2', edgeBinOf(2, MISS_EDGES), 1);
fx('bins.miss.under2', edgeBinOf(1.999, MISS_EDGES), 0);
fx('bins.miss.top', edgeBinOf(170, MISS_EDGES), 5);
fx('bins.dist.under4', edgeBinOf(3.9, DIST_EDGES), 0);
fx('bins.dist.at20', edgeBinOf(20, DIST_EDGES), 5);
fx('acts.intercept', actOf('InterceptPass'), 0);
fx('acts.other', actOf('Dribble'), 3);
/* ⭐⭐⭐ THE OWNER MAPPING — every cell fires, and its neighbours do not */
const OI = (fb: ContactClass, split: Split | null, presence: Presence, lane: number | null,
  alt: boolean): OwnerInput => ({ fb, split, presence, pricedLane: lane, altOpp: alt });
fx('owner.notOpponentFirst.ownTarget', ownerOf(OI('ownTarget', null, 'truthRead', 0.1, true)), 'notOpponentFirst');
fx('owner.notOpponentFirst.none', ownerOf(OI('none', null, 'noChoiceRead', null, false)), 'notOpponentFirst');
fx('owner.defenceRead', ownerOf(OI('opponent', 'arrivedInFlight', 'snapshotAbsent', 0.1, true)), 'defenceRead');
fx('owner.struckNotPriced', ownerOf(OI('opponent', 'struckThrough', 'snapshotAbsent', 0.1, true)), 'struckNotPriced');
fx('owner.perception', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotAbsent', 0.1, true)), 'perception');
fx('owner.perceptionBeatsPrice', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotAbsent', 0.9, false)), 'perception');
fx('owner.price', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotPresent', 0.2, true)), 'price');
fx('owner.priceOnTruthRead', ownerOf(OI('opponent', 'corridorAtRelease', 'truthRead', 0.2, true)), 'price');
fx('owner.priceGeometry', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotPresent', 0.6, true)), 'priceGeometry');
fx('owner.priceGeometryAtTheBar', ownerOf(OI('opponent', 'corridorAtRelease', 'truthRead', 0.4, false)), 'priceGeometry');
fx('owner.residueBelowBarNoAlt', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotPresent', 0.2, false)), 'residueBelowBarNoAlternative');
fx('owner.residueNoChoice', ownerOf(OI('opponent', 'corridorAtRelease', 'noChoiceRead', null, false)), 'residueNoChoiceRead');
/* ⭐ the seed arithmetic (the ceiling is on the SIM lattice) */
const simSeedOk = (s: number): boolean => s >= SIM_LATTICE_TOP || (s >= BLOCK_BASE && s < SIM_CEILING);
fx('seeds.ceilingWouldBeCaught', simSeedOk(SIM_CEILING), false);
fx('seeds.topOfBlockOk', simSeedOk(BLOCK_TOP), true);
fx('seeds.scratchIsNotOnTheSimLattice', simSeedOk(SCRATCH_BASE), true);
fx('seeds.belowBlockWouldBeCaught', simSeedOk(BLOCK_BASE - 1), false);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
banner(`OP-C0 fixtures ${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length}`);
if (!FIXTURES_OK) for (const f of FIXTURES.filter((q) => !q.ok)) banner(`  RED fixture ${f.name}: got ${JSON.stringify(f.got)}`);

/* ========================================================================== */
/* §7 THE ROW                                                                   */
/* ========================================================================== */
/** ROW SCHEMA — every counter is a stored field; the faces are sums of named cells. */
const ROW_SCHEMA = {
  ticks: 1,
  relGround: 1, relGroundOther: 1, relLofted: 1,
  fbG: 4, fbL: 4, fbGKlass: 12,                     // fbGKlass = klass(3) × contact(4)
  split: 3, splitTight: 3,
  owner: 8,
  ownerBySeat: 24,                                  // seat(3) × owner(8)
  inLaneOpenBin: 10, inLaneBelowBar: 1, inLaneAlt: 1, inLaneAltGivenBelowBar: 1,
  inLanePresence: 4, inLanePerceivedInLane: 1, inLaneInLaneAtChoice: 1, inLaneKlass: 3,
  presenceBySplit: 12,                              // split(3) × presence(4)
  allOpenBin: 10, allOpenBinOppFirst: 10, allBelowBar: 1, allBelowBarOppFirst: 1,
  allPresence: 4, allChoiceKnown: 1,
  seatAll: 3, seatOppFirst: 3,
  struckSeat: 3, struckMissBin: 18, struckWhere: 9,   // seat(3) × 6 bins ; seat(3) × where(3)
  struckLeadSumCm: 3, struckLeadN: 3,
  arrivedStartBin: 6, arrivedActAtContact: 4, arrivedActAtRelease: 4, arrivedRunSumCm: 1,
  passesStat: 1, passesCompletedStat: 1, crowdSamples: 1, crashHits: 1,
  scopedPulls: 1, windupArms: 1, syncDeposits: 1, superseded: 1,
} as const;
type RowKey = keyof typeof ROW_SCHEMA;
const ROW_KEYS = Object.keys(ROW_SCHEMA) as RowKey[];
type Row = Record<RowKey, number[]>;
const emptyRow = (): Row => {
  const r = {} as Row;
  for (const k of ROW_KEYS) r[k] = new Array<number>(ROW_SCHEMA[k]).fill(0);
  return r;
};
const FLAT_INDEX: Record<string, number> = {};
let FLAT_LEN = 0;
for (const k of ROW_KEYS) for (let i = 0; i < ROW_SCHEMA[k]; i++) FLAT_INDEX[`${k}.${i}`] = FLAT_LEN++;
const flatten = (r: Row): number[] => ROW_KEYS.flatMap((k) => r[k]);


const STAT_KEYS = ['passes', 'passesCompleted', 'shots', 'crosses', 'cutbacks', 'throughBalls',
  'longBalls', 'headersWon', 'clearances'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface ChoiceRec {
  step: number; passerGid: number; targetGid: number; px: number; py: number; ex: number; ey: number;
  oppPos: Map<number, { x: number; y: number }>;
  rawOpen: number; pricedLane: number; altOpp: boolean;
  scopedPull: boolean; snapOpp: Map<number, { x: number; y: number }>;
}
interface Windup { key: string; gid: number; targetGid: number; eX: number; eY: number;
  hasLead: boolean; leadM: number; choice: ChoiceRec }
interface Flight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number; klassI: number;
  lx: number; ly: number; eX: number; eY: number; hasLine: boolean; launchVx: number; launchVy: number;
  seat: Seat; leadM: number; choice: ChoiceRec | null;
  corr: Set<number>; corrT: Set<number>; oppAtRelease: Map<number, { x: number; y: number }>;
  actAtRelease: Map<number, string>;
}

/** ⭐⭐ THE CHOICE READ — LN-C1 l.829–867's construction (truth positions at the choice step, the
 *  aim of record, `laneOpenness` CALLED), on the OPPONENT side; plus the snapshot the E3 chooser
 *  pulled on the same step, copied out by the OBSERVING wrapper. */
const choiceReadOf = (
  m: Match, passer: Player, targetGid: number, ex: number, ey: number, step: number,
  pull: { step: number; opp: Map<number, { x: number; y: number }> } | undefined,
): ChoiceRec => {
  const side = passer.side as Side;
  const oppPlayers = m.teams[1 - side].players;
  const aim = { x: ex, y: ey };
  const playmaker = passer.traits.includes('playmaker');
  const rawOpen = laneOpenness(passer.pos, aim, oppPlayers);
  const pricedLane = pricedLaneOf(rawOpen, playmaker);
  let altOpp = false;
  for (const mate of m.teams[side].players) {
    if (mate.role === 'GK' || mate.sentOff || mate.gid === passer.gid || mate.gid === targetGid) continue;
    const a = pricedLaneOf(laneOpenness(passer.pos, mate.pos, oppPlayers), playmaker);
    if (altQualifiesOf(a, pricedLane)) { altOpp = true; break; }
  }
  const oppPos = new Map<number, { x: number; y: number }>();
  for (const o of oppPlayers) oppPos.set(o.gid, { x: o.pos.x, y: o.pos.y });
  const scopedPull = pull !== undefined && pull.step === step;
  return {
    step, passerGid: passer.gid, targetGid, px: passer.pos.x, py: passer.pos.y, ex, ey, oppPos,
    rawOpen, pricedLane, altOpp, scopedPull,
    snapOpp: scopedPull ? (pull as { opp: Map<number, { x: number; y: number }> }).opp : new Map(),
  };
};

/* ========================================================================== */
/* §8 THE WALKER                                                                */
/* ========================================================================== */
interface WalkOut { signature: string; worldOk: boolean; wallMs: number; row: Row }
const walkMatch = (m: Match, arm: Arm, observe: boolean): WalkOut => {
  const t0 = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: { gid: number; readyTick: number; aim: { x: number; y: number };
      targetGid: number; aimLead: { x: number; y: number } | null } | null;
    dxStrikeAim: { gid: number; lead: { x: number; y: number }; tick: number } | null;
    inSnapshotLaw: boolean; edsPerceivedChoice: boolean; possessionSide: Side | -1;
    perceivedSnapshot: (p: Player, scope?: ReadonlySet<number> | null) => PerceptionSnapshot | null;
  };
  /* gWorld, per walked match */
  const v = ARM_WORLD[arm];
  const genomeClean = m.teams.every((t) =>
    (t.info.genome as TacticalGenome & { offballMovementWeights?: unknown }).offballMovementWeights === undefined);
  const worldOk = (v === 18 ? ifArmedVersion(m) === IF_WORLD_VERSION
    : ifArmedVersion(m) === 0 && bqArmedVersion(m) === BQ_WORLD_VERSION && (m as unknown as { dsOwnRun?: boolean }).dsOwnRun !== true)
    && mm.inSnapshotLaw !== true && mm.edsPerceivedChoice === true && genomeClean;
  /* ⭐ THE OBSERVING WRAPPER — records the scoped pull (the E3 chooser's own read) and returns
   *  the engine's own value untouched. gLockstep proves it inert. */
  let curStep = 0;
  const pulls = new Map<number, { step: number; opp: Map<number, { x: number; y: number }> }>();
  if (observe) {
    const orig = mm.perceivedSnapshot.bind(m);
    mm.perceivedSnapshot = (p: Player, scope: ReadonlySet<number> | null = null) => {
      const r = orig(p, scope);
      if (scope !== null && r !== null) {
        const opp = new Map<number, { x: number; y: number }>();
        for (const e of r.players) if (e.side !== p.side) opp.set(e.gid, { x: e.pos.x, y: e.pos.y });
        pulls.set(p.gid, { step: curStep, opp });
        row.scopedPulls[0] += 1;
      }
      return r;
    };
  }
  const players = m.allPlayers;
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let wu: Windup | null = null;
  let endedWindup: Windup | null = null;
  let lastDx: object | null = mm.dxStrikeAim;
  let flight: Flight | null = null;
  const prevAct = new Map<number, string>();

  while (!m.finished) {
    curStep += 1;
    m.step(DT);
    row.ticks[0] += 1;
    if (!observe) continue;
    const tick = m.simTick;
    const ball = m.ball;
    const ballIsLive = m.phase === 'playing' || m.phase === 'restart';
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number; const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }
    const pp = mm.pendingPass;
    const passT = pp?.t ?? null;
    const passChangedHere = passT !== null && passT !== prevPendingPassT;
    prevPendingPassT = passT;
    const lastTouch = ball.lastTouch;
    /* the DX deposit left UNCONSUMED on this step (a synchronous led strike) */
    const dx = mm.dxStrikeAim;
    const dxNew = dx !== null && dx !== lastDx ? dx : null;
    lastDx = dx;
    if (dxNew !== null) row.syncDeposits[0] += 1;

    /* --- THE WIND-UP RECORD: the arm step IS the choice step (LN-C1 §6b) --- */
    const rec = mm.pendingPassWindup;
    const key = rec === null ? null
      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;
    endedWindup = null;
    if (wu !== null && key !== wu.key) { endedWindup = wu; wu = null; }
    if (rec !== null && (wu === null || key !== wu.key)) {
      const lead = rec.aimLead;
      const eX = rec.aim.x + (lead?.x ?? 0); const eY = rec.aim.y + (lead?.y ?? 0);
      const hasLead = lead !== null && (lead.x !== 0 || lead.y !== 0);
      row.windupArms[0] += 1;
      wu = { key: key as string, gid: rec.gid, targetGid: rec.targetGid, eX, eY, hasLead,
        leadM: hasLead ? Math.hypot((lead as { x: number }).x, (lead as { y: number }).y) : 0,
        choice: choiceReadOf(m, players[rec.gid], rec.targetGid, eX, eY, curStep, pulls.get(rec.gid)) };
    }

    /* --- FOLLOW THE PENDING FLIGHT AND BOOK THE FIRST BODY (BN-C0 l.1026–1090's channel) ---
     *  ⚠ ORDER (frozen, §P.C): the pending flight is followed BEFORE this tick's releases are read,
     *  so a one-touch release by the body that met the previous ball books THAT ball's first body
     *  (BN-C0 read the release first and overwrote the pending flight unbooked). */
    if (flight !== null) {
      const f = flight;
      let cls: ContactClass | null = null;
      if (lastTouch !== null && lastTouch.gid !== f.passerGid) {
        cls = contactClassOf(lastTouch.gid, f.targetGid, lastTouch.side as Side, f.passerSide);
      } else if (ball.owner !== null && ball.owner.gid !== f.passerGid) cls = 'none';
      else if (!ballIsLive) cls = 'none';
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) cls = 'none';
      if (cls !== null) {
        bookFlight(row, f, cls, cls === 'none' ? null : lastTouch, ball.pos.x, ball.pos.y, prevAct);
        flight = null;
      }
    }

    /* --- THE RELEASE (BN-C0 l.959–1023, COPIED; the lofted class booked apart) --- */
    const releases: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        const k0 = klassOf({
          shots: d.shots[side], clearances: d.clearances[side], passes: d.passes[side],
          crosses: d.crosses[side], cutbacks: d.cutbacks[side], throughBalls: d.throughBalls[side],
          longBalls: d.longBalls[side], headersWon: d.headersWon[side],
        }, passChangedHere && pp !== null && pp.side === side);
        if (k0 === null) continue;
        let klass = k0;
        let gid = -1;
        if (passChangedHere && pp !== null && pp.side === side) gid = pp.passerGid;
        else if (lastTouch !== null && lastTouch.side === side) gid = lastTouch.gid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && (players[gid].action.type as string) === 'ThrowOut') klass = 'keeperThrow';
        releases.push({ gid, klass });
      }
    }
    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);
    for (const rel of releases) {
      if (!isDelivery(rel.klass) || hSpeedNow < 1e-6) continue;
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const ground = isGroundLaunch(grounded, vz0);
      const targetGid = (pp !== null && passChangedHere && pp.passerGid === rel.gid) ? pp.targetGid : null;
      if (targetGid === null) continue; // a pass release carries a target (the aim ledger's own)
      /* a flight still pending here was struck again by its own passer before any other body met
       *  it: booked `none` (first body: nobody) and COUNTED as superseded — never dropped. */
      if (flight !== null) {
        row.superseded[0] += 1;
        bookFlight(row, flight, 'none', null, ball.pos.x, ball.pos.y, prevAct);
        flight = null;
      }
      if (!ground) {
        row.relLofted[0] += 1;
        /* the lofted class: first body only (the corridor is a ground notion) */
        flight = {
          passerGid: rel.gid, passerSide: players[rel.gid].side as Side, targetGid, releaseTick: tick,
          klassI: -1, lx: 0, ly: 0, eX: 0, eY: 0, hasLine: false, launchVx: 0, launchVy: 0,
          seat: 'plain', leadM: 0, choice: null, corr: new Set(), corrT: new Set(),
          oppAtRelease: new Map(), actAtRelease: new Map(),
        };
        continue;
      }
      if (!isMeasurableGroundPass(rel.klass, ground, true)) { row.relGroundOther[0] += 1; continue; }
      row.relGround[0] += 1;
      const viaWindup = endedWindup !== null && endedWindup.gid === rel.gid
        && endedWindup.targetGid === targetGid;
      const syncDeposit = !viaWindup && dxNew !== null && dxNew.gid === rel.gid;
      const seat = seatOf(viaWindup, viaWindup && (endedWindup as Windup).hasLead, syncDeposit);
      const tgt = players[targetGid];
      let eX: number; let eY: number; let leadM = 0;
      if (viaWindup) { eX = (endedWindup as Windup).eX; eY = (endedWindup as Windup).eY; leadM = (endedWindup as Windup).leadM; }
      else if (syncDeposit) {
        const lead = (dxNew as { lead: { x: number; y: number } }).lead;
        eX = tgt.pos.x + lead.x; eY = tgt.pos.y + lead.y; leadM = Math.hypot(lead.x, lead.y);
      } else { eX = tgt.pos.x; eY = tgt.pos.y; }
      const choice = viaWindup ? (endedWindup as Windup).choice
        : choiceReadOf(m, players[rel.gid], targetGid, eX, eY, curStep, pulls.get(rel.gid));
      const lx = ball.pos.x - ball.vel.x * DT; const ly = ball.pos.y - ball.vel.y * DT;
      const hasLine = Math.hypot(eX - lx, eY - ly) > 1e-6;
      const passerSide = players[rel.gid].side as Side;
      const corr = new Set<number>(); const corrT = new Set<number>();
      const oppAtRelease = new Map<number, { x: number; y: number }>();
      const actAtRelease = new Map<number, string>();
      for (const o of m.teams[1 - passerSide].players) {
        oppAtRelease.set(o.gid, { x: o.pos.x, y: o.pos.y });
        actAtRelease.set(o.gid, o.action.type as string);
        if (o.sentOff || !hasLine) continue;
        if (inCorridorOf(lx, ly, eX, eY, o.pos.x, o.pos.y, DV_CORRIDOR_SCALE)) corr.add(o.gid);
        if (inCorridorOf(lx, ly, eX, eY, o.pos.x, o.pos.y, CONTROL_RADIUS)) corrT.add(o.gid);
      }
      const klassI = (GROUND_KLASSES as readonly string[]).indexOf(rel.klass);
      row.seatAll[SEATS.indexOf(seat)] += 1;
      const ck = choice !== null;
      if (ck) {
        row.allChoiceKnown[0] += 1;
        row.allOpenBin[binOf(choice.rawOpen, OPEN_BIN_W, OPEN_BINS)] += 1;
        if (belowBarOf(choice.pricedLane)) row.allBelowBar[0] += 1;
      }
      flight = {
        passerGid: rel.gid, passerSide, targetGid, releaseTick: tick, klassI, lx, ly, eX, eY, hasLine,
        launchVx: ball.vel.x, launchVy: ball.vel.y, seat, leadM, choice, corr, corrT, oppAtRelease,
        actAtRelease,
      };
      /* a ground release that is never followed to a contact still enters the partition: it is
       *  booked at retirement below (first body `none`). */
    }

    /* --- the crowding family (IF-C0 l.1503–1531) --- */
    if (tick % 10 === 0 && m.phase === 'playing') {
      const owner = ball.owner;
      const possSide: Side | null = owner !== null ? owner.side as Side
        : (mm.possessionSide !== -1 ? mm.possessionSide as Side : null);
      if (possSide !== null) {
        const outs = m.teams[possSide].players.filter((q) => q.role !== 'GK' && !q.sentOff);
        row.crowdSamples[0] += 1;
        let mp = Infinity;
        for (let a = 0; a < outs.length; a++) {
          for (let b = a + 1; b < outs.length; b++) {
            const dd = Math.hypot(outs[a].pos.x - outs[b].pos.x, outs[a].pos.y - outs[b].pos.y);
            if (dd < mp) mp = dd;
          }
        }
        if (Number.isFinite(mp) && mp < 4) row.crashHits[0] += 1;
      }
    }
    for (const q of players) prevAct.set(q.gid, q.action.type as string);
  }
  if (observe && flight !== null) bookFlight(row, flight, 'none', null, 0, 0, prevAct);
  row.passesStat[0] = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.passesCompletedStat[0] = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  return { signature: signatureOf(m), worldOk, wallMs: Date.now() - t0, row };
};

/** ⭐⭐⭐ BOOK ONE FLIGHT — every ground pass into EXACTLY ONE owner cell. */
const bookFlight = (
  row: Row, f: Flight, cls: ContactClass, body: Player | null, ballX: number, ballY: number,
  prevAct: Map<number, string>,
): void => {
  const ci = CONTACTS.indexOf(cls);
  if (f.klassI < 0) { row.fbL[ci] += 1; return; }
  row.fbG[ci] += 1;
  row.fbGKlass[f.klassI * 4 + ci] += 1;
  const si = SEATS.indexOf(f.seat);
  const c = f.choice;
  const isOpp = cls === 'opponent' && body !== null;
  let split: Split | null = null;
  let presence: Presence = 'noChoiceRead';
  if (isOpp) {
    const b = body as Player;
    row.seatOppFirst[si] += 1;
    const atRelease = f.corr.has(b.gid);
    const atContact = f.hasLine && inCorridorOf(f.lx, f.ly, f.eX, f.eY, b.pos.x, b.pos.y, DV_CORRIDOR_SCALE);
    const atReleaseT = f.corrT.has(b.gid);
    const atContactT = f.hasLine && inCorridorOf(f.lx, f.ly, f.eX, f.eY, b.pos.x, b.pos.y, CONTROL_RADIUS);
    split = oppCellOf(atRelease, atContact);
    row.split[SPLITS.indexOf(split)] += 1;
    row.splitTight[SPLITS.indexOf(oppCellOf(atReleaseT, atContactT))] += 1;
    presence = presenceOf(c !== null, c !== null && c.scopedPull, c !== null && c.snapOpp.has(b.gid));
    row.presenceBySplit[SPLITS.indexOf(split) * 4 + PRESENCES.indexOf(presence)] += 1;
    if (c !== null) {
      row.allOpenBinOppFirst[binOf(c.rawOpen, OPEN_BIN_W, OPEN_BINS)] += 1;
      if (belowBarOf(c.pricedLane)) row.allBelowBarOppFirst[0] += 1;
    }
    if (split === 'corridorAtRelease') {
      row.inLaneKlass[f.klassI] += 1;
      row.inLanePresence[PRESENCES.indexOf(presence)] += 1;
      if (c !== null) {
        row.inLaneOpenBin[binOf(c.rawOpen, OPEN_BIN_W, OPEN_BINS)] += 1;
        const below = belowBarOf(c.pricedLane);
        if (below) row.inLaneBelowBar[0] += 1;
        if (c.altOpp) row.inLaneAlt[0] += 1;
        if (below && c.altOpp) row.inLaneAltGivenBelowBar[0] += 1;
        const at = c.oppPos.get(b.gid);
        if (at !== undefined && inCorridorOf(c.px, c.py, c.ex, c.ey, at.x, at.y, DV_CORRIDOR_SCALE)) {
          row.inLaneInLaneAtChoice[0] += 1;
        }
        const seen = c.snapOpp.get(b.gid);
        if (presence === 'snapshotPresent' && seen !== undefined
          && inCorridorOf(c.px, c.py, c.ex, c.ey, seen.x, seen.y, DV_CORRIDOR_SCALE)) {
          row.inLanePerceivedInLane[0] += 1;
        }
      }
    } else if (split === 'struckThrough') {
      row.struckSeat[si] += 1;
      const miss = angleDegBetween(f.launchVx, f.launchVy, f.eX - f.lx, f.eY - f.ly);
      if (Number.isFinite(miss)) row.struckMissBin[si * 6 + edgeBinOf(miss, MISS_EDGES)] += 1;
      row.struckWhere[si * 3 + WHERE.indexOf(whereOf(f.lx, f.ly, f.eX, f.eY, b.pos.x, b.pos.y))] += 1;
      if (f.seat !== 'plain') { row.struckLeadSumCm[si] += Math.round(f.leadM * 100); row.struckLeadN[si] += 1; }
    } else {
      const at = f.oppAtRelease.get(b.gid);
      if (at !== undefined) {
        row.arrivedStartBin[edgeBinOf(centreLineDistOf(f.lx, f.ly, f.eX, f.eY, at.x, at.y), DIST_EDGES)] += 1;
        row.arrivedRunSumCm[0] += Math.round(Math.hypot(ballX - at.x, ballY - at.y) * 100);
      }
      row.arrivedActAtContact[actOf(prevAct.get(b.gid) ?? 'other')] += 1;
      row.arrivedActAtRelease[actOf(f.actAtRelease.get(b.gid) ?? 'other')] += 1;
    }
  }
  if (c !== null) row.allPresence[PRESENCES.indexOf(presenceOf(true, c.scopedPull, true))] += 1;
  const owner = ownerOf({ fb: cls, split, presence, pricedLane: c === null ? null : c.pricedLane,
    altOpp: c !== null && c.altOpp });
  row.owner[OWNERS.indexOf(owner)] += 1;
  row.ownerBySeat[si * 8 + OWNERS.indexOf(owner)] += 1;
};

/* ========================================================================== */
/* §9 THE FACES                                                                 */
/* ========================================================================== */
interface FaceDef { name: string; num: string[]; den: string[] }
const cells = (k: RowKey, idx: number[]): string[] => idx.map((i) => `${k}.${i}`);
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);
const FACE_DEFS: FaceDef[] = [];
const face = (name: string, num: string[], den: string[]): void => { FACE_DEFS.push({ name, num, den }); };
const ALL_GROUND = cells('fbG', range(4));
CONTACTS.forEach((c, i) => face(`fb.ground.${c}`, cells('fbG', [i]), ALL_GROUND));
CONTACTS.forEach((c, i) => face(`fb.lofted.${c}`, cells('fbL', [i]), cells('fbL', range(4))));
GROUND_KLASSES.forEach((k, ki) => face(`fb.ground.opponent.${k}`, cells('fbGKlass', [ki * 4 + 3]),
  cells('fbGKlass', range(4).map((i) => ki * 4 + i))));
SPLITS.forEach((s, i) => face(`q2.wide.${s}`, cells('split', [i]), cells('split', range(3))));
SPLITS.forEach((s, i) => face(`q2.tight.${s}`, cells('splitTight', [i]), cells('splitTight', range(3))));
OWNERS.forEach((o, i) => face(`owner.${o}`, cells('owner', [i]), cells('owner', range(8))));
OWNERS.slice(1).forEach((o, j) => face(`ownerOfOpponentFirst.${o}`, cells('owner', [j + 1]),
  cells('owner', range(7).map((i) => i + 1))));
face('owner.residue', cells('owner', [6, 7]), cells('owner', range(8)));
SEATS.forEach((s, si) => OWNERS.slice(1).forEach((o, j) => face(`ownerBySeat.${s}.${o}`,
  cells('ownerBySeat', [si * 8 + j + 1]), cells('ownerBySeat', range(7).map((i) => si * 8 + i + 1)))));
/* Q3 */
const IN_LANE_CHOICE = cells('inLaneOpenBin', range(10));
face('q3.inLane.pricedBelowBarShare', cells('inLaneBelowBar', [0]), IN_LANE_CHOICE);
face('q3.inLane.altGivenBelowBar', cells('inLaneAltGivenBelowBar', [0]), cells('inLaneBelowBar', [0]));
face('q3.inLane.altShare', cells('inLaneAlt', [0]), IN_LANE_CHOICE);
for (let b = 0; b < 10; b++) face(`q3.inLane.openBin.${b}`, cells('inLaneOpenBin', [b]), IN_LANE_CHOICE);
PRESENCES.forEach((p, i) => face(`q3.inLane.presence.${p}`, cells('inLanePresence', [i]), cells('inLanePresence', range(4))));
face('q3.inLane.inLaneAtChoiceShare', cells('inLaneInLaneAtChoice', [0]), IN_LANE_CHOICE);
face('q3.inLane.perceivedInLaneGivenPresent', cells('inLanePerceivedInLane', [0]), cells('inLanePresence', [1]));
GROUND_KLASSES.forEach((k, i) => face(`q3.inLane.klass.${k}`, cells('inLaneKlass', [i]), cells('inLaneKlass', range(3))));
SPLITS.forEach((s, si) => PRESENCES.forEach((p, pi) => face(`q3.presenceBySplit.${s}.${p}`,
  cells('presenceBySplit', [si * 4 + pi]), cells('presenceBySplit', range(4).map((i) => si * 4 + i)))));
const ALL_CHOICE = cells('allOpenBin', range(10));
face('q3.all.belowBarShare', cells('allBelowBar', [0]), ALL_CHOICE);
face('q3.all.oppFirstGivenBelowBar', cells('allBelowBarOppFirst', [0]), cells('allBelowBar', [0]));
for (let b = 0; b < 10; b++) face(`q3.all.oppFirstGivenOpenBin.${b}`, cells('allOpenBinOppFirst', [b]), cells('allOpenBin', [b]));
face('q3.all.choiceKnownShare', cells('allChoiceKnown', [0]), ALL_GROUND);
PRESENCES.slice(0, 3).forEach((p, i) => face(`q3.all.read.${p}`, cells('allPresence', [i]), cells('allPresence', range(4))));
/* Q4 */
SEATS.forEach((s, i) => face(`q4.seatAll.${s}`, cells('seatAll', [i]), cells('seatAll', range(3))));
SEATS.forEach((s, i) => face(`q4.oppFirstGivenSeat.${s}`, cells('seatOppFirst', [i]), cells('seatAll', [i])));
SEATS.forEach((s, i) => face(`q4.struck.seat.${s}`, cells('struckSeat', [i]), cells('struckSeat', range(3))));
SEATS.forEach((s, si) => {
  for (let b = 0; b < 6; b++) face(`q4.struck.${s}.missBin.${b}`, cells('struckMissBin', [si * 6 + b]),
    cells('struckMissBin', range(6).map((i) => si * 6 + i)));
  WHERE.forEach((w, wi) => face(`q4.struck.${s}.where.${w}`, cells('struckWhere', [si * 3 + wi]),
    cells('struckWhere', range(3).map((i) => si * 3 + i))));
  face(`q4.struck.${s}.meanLeadCm`, cells('struckLeadSumCm', [si]), cells('struckLeadN', [si]));
});
WHERE.forEach((w, wi) => face(`q4.struck.all.where.${w}`, cells('struckWhere', [wi, 3 + wi, 6 + wi]),
  cells('struckWhere', range(9))));
/* Q5 */
for (let b = 0; b < 6; b++) face(`q5.arrived.startBin.${b}`, cells('arrivedStartBin', [b]), cells('arrivedStartBin', range(6)));
ACTS.forEach((a, i) => face(`q5.arrived.actAtContact.${a}`, cells('arrivedActAtContact', [i]), cells('arrivedActAtContact', range(4))));
ACTS.forEach((a, i) => face(`q5.arrived.actAtRelease.${a}`, cells('arrivedActAtRelease', [i]), cells('arrivedActAtRelease', range(4))));
face('q5.arrived.meanRunCm', cells('arrivedRunSumCm', [0]), cells('arrivedStartBin', range(6)));
/* beside */
face('beside.completionRate', cells('passesCompletedStat', [0]), cells('passesStat', [0]));
face('beside.crowd.crashShare', cells('crashHits', [0]), cells('crowdSamples', [0]));
face('beside.groundPassesPerMatch', cells('relGround', [0]), []);
face('beside.loftedPassesPerMatch', cells('relLofted', [0]), []);
face('beside.scopedPullsPerMatch', cells('scopedPulls', [0]), []);
const FACE_NAMES = FACE_DEFS.map((f) => f.name);
const FACE_IDX = FACE_DEFS.map((f) => ({ num: f.num.map((k) => FLAT_INDEX[k]), den: f.den.map((k) => FLAT_INDEX[k]) }));
const FACE_DEFS_OK = FACE_IDX.every((f) => f.num.every((i) => i !== undefined) && f.den.every((i) => i !== undefined));

interface FaceVal { num: number; den: number; value: number | null; lo?: number | null; hi?: number | null }
/** a face's value from summed flat counters; `den` empty ⇒ a per-match rate (÷ seeds). */
const faceOf = (sum: number[], fi: number, nSeeds: number): FaceVal => {
  const f = FACE_IDX[fi];
  const num = f.num.reduce((s, i) => s + sum[i], 0);
  const den = f.den.length === 0 ? nSeeds : f.den.reduce((s, i) => s + sum[i], 0);
  return { num, den, value: den > 0 ? num / den : null };
};
const sumRows = (flats: number[][], idx: number[] | null = null): number[] => {
  const s = new Array<number>(FLAT_LEN).fill(0);
  const it = idx ?? range(flats.length);
  for (const r of it) { const row = flats[r]; for (let i = 0; i < FLAT_LEN; i++) s[i] += row[i]; }
  return s;
};
/** mulberry32 — the resample RNG, seeded from the block base. */
const mulberry = (a: number) => (): number => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const BOOT_DRAWS = 2000;
const pct = (xs: number[], q: number): number | null => {
  const ys = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (ys.length === 0) return null;
  return ys[Math.min(ys.length - 1, Math.max(0, Math.floor(q * ys.length)))];
};
/** cluster bootstrap over seeds: levels per arm, and the PAIRED Δ (W18-D − W18-E). */
const bootstrap = (flatsByArm: Record<Arm, number[][]>, nSeeds: number) => {
  const rnd = mulberry(BLOCK_BASE);
  const lv: Record<Arm, number[][]> = { 'W18-E': [], 'W18-D': [], 'W13-E': [], 'W13-D': [] };
  for (const a of ARMS) lv[a] = FACE_DEFS.map(() => []);
  const dl: number[][] = FACE_DEFS.map(() => []);
  for (let b = 0; b < BOOT_DRAWS; b++) {
    const idx = Array.from({ length: nSeeds }, () => Math.floor(rnd() * nSeeds));
    const sums = {} as Record<Arm, number[]>;
    for (const a of ARMS) sums[a] = sumRows(flatsByArm[a], idx);
    for (let fi = 0; fi < FACE_DEFS.length; fi++) {
      for (const a of ARMS) { const v = faceOf(sums[a], fi, nSeeds).value; lv[a][fi].push(v ?? Number.NaN); }
      const e = faceOf(sums['W18-E'], fi, nSeeds).value; const dd = faceOf(sums['W18-D'], fi, nSeeds).value;
      dl[fi].push(e === null || dd === null ? Number.NaN : dd - e);
    }
  }
  return { lv, dl };
};
const r6 = (x: number | null): number | null => (x === null || !Number.isFinite(x) ? null : Math.round(x * 1e6) / 1e6);

/* ========================================================================== */
/* §10 RUN                                                                      */
/* ========================================================================== */
const GATES: { name: string; ok: boolean; note: string }[] = [];
const gate = (name: string, ok: boolean, note: string): void => {
  GATES.push({ name, ok, note });
  banner(`  ${ok ? 'GREEN' : 'RED  '} ${name} — ${note}`);
};

/* ---- gRepro FIRST, before any census seed (#426 item 3(i)) ---- */
banner('OP-C0 gRepro — IF-T1b\'s OWN construction on its own consumed band 12,560,000–011');
const IFT1B_PATH = 'docs/world-model/data/if-t1b-flight-run-exam.json';
const ift1b = JSON.parse(readFileSync(IFT1B_PATH, 'utf8')) as {
  perSeedCells: { seed: number; 'OWNCOOP+IF-E13': { signature: string } }[];
};
const storedSig = new Map(ift1b.perSeedCells.map((r) => [r.seed, r['OWNCOOP+IF-E13'].signature] as const));
const reproRows = REPRO_SEEDS.map((seed) => {
  const got = signatureOf(runOut(buildIfT1bArmOfRecord(seed)));
  const want = storedSig.get(seed) ?? null;
  return { seed, want, got, ok: want !== null && got === want };
});
const flags18 = a4MatchFlags(IF_WORLD_VERSION) as Record<string, unknown>;
const flags17PlusDoor: Record<string, unknown> = { ...(a4MatchFlags(DS2_WORLD_VERSION) as Record<string, unknown>), ifFlightRun: true };
const flagSetIdentity = JSON.stringify(Object.keys(flags18).sort().map((k) => [k, flags18[k]]))
  === JSON.stringify(Object.keys(flags17PlusDoor).sort().map((k) => [k, flags17PlusDoor[k]]));
const ift1bFlags: Record<string, unknown> = { ...(a4MatchFlags(BQ_WORLD_VERSION) as Record<string, unknown>),
  dsOwnRun: true, dsHatsOff: true, dsCoopHatsOff: true, ifFlightRun: true };
const w18MinusIfT1b = Object.keys(flags18).filter((k) => flags18[k] !== ift1bFlags[k]).sort();
const ift1bMinusW18 = Object.keys(ift1bFlags).filter((k) => ift1bFlags[k] !== flags18[k]).sort();
const reproOk = reproRows.every((r) => r.ok) && reproRows.length === 12 && flagSetIdentity;
gate('gRepro', reproOk,
  `${reproRows.filter((r) => r.ok).length}/${reproRows.length} IF-T1b OWNCOOP+IF-E13 stored x64 signatures reproduced; `
  + `a4MatchFlags(18) ≡ {...a4MatchFlags(17), ifFlightRun} ${flagSetIdentity}; world-18 keys beyond IF-T1b's `
  + `construction: [${w18MinusIfT1b.join(', ')}]`);
if (!reproOk && MODE === 'full') {
  banner('OP-C0 STOP — gRepro is RED: no census seed is walked (the RED-routing idiom).');
}

/* ---- the world pin, lockstep and X-DET on scratch ---- */
const worldPin = ARMS.map((a) => {
  const m = buildMatch(WORLD_PIN_SEED, a);
  return { arm: a, seed: WORLD_PIN_SEED, ifArmedVersion: ifArmedVersion(m), bqArmedVersion: bqArmedVersion(m),
    inSnapshotLaw: (m as unknown as { inSnapshotLaw: boolean }).inSnapshotLaw === true,
    edsPerceivedChoice: (m as unknown as { edsPerceivedChoice: boolean }).edsPerceivedChoice === true,
    edsPerceivedDefence: (m as unknown as { edsPerceivedDefence: boolean }).edsPerceivedDefence === true,
    dxWindupAim: (m as unknown as { dxWindupAim: boolean }).dxWindupAim === true,
    dlcDeliveryChoice: (m as unknown as { dlcDeliveryChoice: boolean }).dlcDeliveryChoice === true,
    o1PassWindup: (m as unknown as { o1PassWindup: boolean }).o1PassWindup === true,
    pwWeightChooser: (m as unknown as { pwWeightChooser?: boolean }).pwWeightChooser === true,
    ptpPassLead: (m as unknown as { ptpPassLead?: boolean }).ptpPassLead === true };
});
const lockRows: { arm: Arm; seed: number; observed: string; unobserved: string; ok: boolean }[] = [];
const xdetRows: { arm: Arm; seed: number; ok: boolean }[] = [];
if (reproOk) {
  for (const a of ARMS) {
    for (const seed of LOCKSTEP_SEEDS) {
      const o1 = walkMatch(buildMatch(seed, a), a, true);
      const u = walkMatch(buildMatch(seed, a), a, false);
      lockRows.push({ arm: a, seed, observed: o1.signature, unobserved: u.signature, ok: o1.signature === u.signature });
      const o2 = walkMatch(buildMatch(seed, a), a, true);
      xdetRows.push({ arm: a, seed, ok: o1.signature === o2.signature
        && JSON.stringify(o1.row) === JSON.stringify(o2.row) });
    }
  }
}
gate('gLockstep', reproOk && lockRows.length === 8 && lockRows.every((r) => r.ok),
  `${lockRows.filter((r) => r.ok).length}/${lockRows.length} arm × scratch walks: the observing wrapper `
  + 'on `perceivedSnapshot` leaves the whole-match signature byte-identical (INERT, proven)');
gate('gDeterminism', reproOk && xdetRows.length === 8 && xdetRows.every((r) => r.ok),
  `X-DET: ${xdetRows.filter((r) => r.ok).length}/${xdetRows.length} observed pairs identical in signature AND row bytes`);

/* ---- THE BATTERY ---- */
const perSeed: { seed: number; arms: Record<Arm, { signature: string; worldOk: boolean; wallMs: number; row: Row }> }[] = [];
const receiptRows: Record<string, { signature: string; worldOk: boolean }> = {};
if (reproOk) {
  banner(`OP-C0 battery — ${BATTERY_SEEDS.length} seeds × ${ARMS.length} arms (mode ${MODE})`);
  let done = 0;
  for (const seed of BATTERY_SEEDS) {
    const arms = {} as Record<Arm, { signature: string; worldOk: boolean; wallMs: number; row: Row }>;
    for (const a of ARMS) {
      const w = walkMatch(buildMatch(seed, a), a, true);
      arms[a] = { signature: w.signature, worldOk: w.worldOk, wallMs: w.wallMs, row: w.row };
    }
    perSeed.push({ seed, arms });
    done += 1;
    if (done % 50 === 0) banner(`  … ${done}/${BATTERY_SEEDS.length} (${((Date.now() - T_START) / 1000).toFixed(0)} s)`);
  }
  for (const a of ARMS) {
    const w = walkMatch(buildMatch(RECEIPT_SEED, a), a, true);
    receiptRows[a] = { signature: w.signature, worldOk: w.worldOk };
  }
}
const nSeeds = perSeed.length;

/* ---- X-FP-PROD, in process (the `npm run fingerprint` recipe: seed 1337, 2 seasons) ---- */
const FP_X64 = '59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d';
const FP_ARM64 = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FP_PIN = process.arch === 'x64' ? FP_X64 : process.arch === 'arm64' ? FP_ARM64 : '';
const fpLeague = new League({ seed: 1337 });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + 2,
});
const FP_GOT = sha(JSON.stringify(fpOut.league));
gate('gFingerprintProd', FP_PIN !== '' && FP_GOT === FP_PIN,
  `X-FP-PROD recomputed in-process on ${process.arch} = ${FP_GOT.slice(0, 8)}… (pin ${FP_PIN.slice(0, 8)}…)`);

/* ---- X-SRC-ZERO ---- */
const srcDiff170 = sh('git diff 170a5fa -- src/ tests/');
const srcPorcelain = sh('git status --porcelain -- src tests');
gate('gSrcUntouched', srcDiff170.length === 0 && srcPorcelain.length === 0,
  `git diff 170a5fa -- src/ tests/ = ${srcDiff170.length} bytes; git status --porcelain -- src tests = ${srcPorcelain.length} bytes`);

/* ---- the world gate ---- */
const allWalkWorldOk = perSeed.every((s) => ARMS.every((a) => s.arms[a].worldOk))
  && Object.values(receiptRows).every((r) => r.worldOk);
const pinOk = worldPin.every((w) => (ARM_WORLD[w.arm] === 18 ? w.ifArmedVersion === 18 : w.ifArmedVersion === 0 && w.bqArmedVersion === 13)
  && !w.inSnapshotLaw && w.edsPerceivedChoice && w.edsPerceivedDefence && w.dxWindupAim && w.dlcDeliveryChoice
  && w.o1PassWindup && !w.pwWeightChooser && !w.ptpPassLead);
gate('gWorld', reproOk && allWalkWorldOk && pinOk && DOSE_BYTES_OK,
  `every walked match: the arm's world (18 → ifArmedVersion 18; 13 → bq 13, no DS/IF door), inSnapshotLaw ABSENT `
  + '(the decision reads TRUTH), edsPerceivedChoice ON, info.genome clean; the constructed pin at '
  + `${WORLD_PIN_SEED}: the E3 chooser, the perceived defence, DX, DLC and the wind-up ON, PW and PTP ABSENT; dose BYTES pinned`);

/* ---- seeds ---- */
const allSim = [...BATTERY_SEEDS, RECEIPT_SEED, ...REPRO_SEEDS].filter((s) => s < SIM_LATTICE_TOP);
const bookedEqualsWalked = !reproOk ? false : perSeed.length === BATTERY_SEEDS.length
  && new Set(perSeed.map((s) => s.seed)).size === BATTERY_SEEDS.length && Object.keys(receiptRows).length === ARMS.length;
gate('gSeedsBookedEqualWalked', bookedEqualsWalked,
  `${perSeed.length} battery seeds × ${ARMS.length} arms + the receipt at ${RECEIPT_SEED} × ${ARMS.length} = `
  + `${perSeed.length * ARMS.length + Object.keys(receiptRows).length} walks booked = walked`);
const blockSeeds = MODE === 'full' ? [...BATTERY_SEEDS, RECEIPT_SEED] : [];
gate('gSeedDisjoint', blockSeeds.every((s) => s >= BLOCK_BASE && s <= BLOCK_TOP)
  && CONSUMED_BLOCKS.every((b) => b + 999 < BLOCK_BASE)
  && REPRO_SEEDS.every((s) => s >= 12_560_000 && s <= 12_560_999)
  && allSim.every((s) => s < SIM_CEILING) && STATS.consumed === 0,
  `battery inside ${BLOCK_BASE}–${BLOCK_TOP}; all ${CONSUMED_BLOCKS.length} consumed blocks end below the base; `
  + `the re-walks lie inside IF-T1b's own block; no SIM seed ≥ ${SIM_CEILING}; ZERO stats`);
gate('gN', MODE === 'full' ? N === N_FROZEN && N_ENV === undefined : true,
  MODE === 'full' ? `the battery ran at N_FROZEN = ${N_FROZEN} (the affordance), no override env`
    : `smoke mode, N = ${N} on scratch (not a battery)`);
const scratchOk = SCRATCH_SEEDS_USED.every((s) => s >= SCRATCH_BASE && s <= SCRATCH_TOP)
  && SCRATCH_SEEDS_USED.every((s) => s < VERIFIER_BAND[0] || s > VERIFIER_BAND[1]);
gate('gScratchBand', scratchOk,
  `all ${SCRATCH_SEEDS_USED.length} scratch seeds derive from the ONE base ${SCRATCH_BASE} inside [${SCRATCH_BASE}, ${SCRATCH_TOP}]; `
  + `the verifier band ${VERIFIER_BAND[0]}–${VERIFIER_BAND[1]} is disjoint`);
gate('gAnchoredConstants', ANCHORS_OK,
  `${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} code-map needles at their declared occurrence counts; `
  + `the bar ${BAR} and the playmaker ×${PLAYMAKER_MUL} PARSED from their anchored lines`);
gate('gPredicateFixtures', FIXTURES_OK,
  `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} fixtures — the corridor test (both widths), the split, `
  + 'the bar, the priced lane, the alternative test, the truth-vs-snapshot presence test, the seat, the owner mapping '
  + '(every cell firing and its neighbours not), the bins, the seed ceiling');
const LEDGER_READ = {
  record: ['ball.lastTouch (first body)', 'match.pendingPass (release, target)', 'team stats deltas (klass)',
    'match.pendingPassWindup (arm = choice step; aim + aimLead = priced aim)',
    'match.dxStrikeAim (an UNCONSUMED deposit = the synchronous led strike)',
    'match.perceivedSnapshot return value (the E3 chooser\'s own scoped pull, copied by the observing wrapper)',
    'player.action.type (the interceptor\'s read path)', 'team stats passes/passesCompleted'],
  declared: ['the corridor geometry (BN-C0\'s reconstruction, both widths)',
    'the choice-step openness and the alternative menu (LN-C1\'s reconstruction, opponent side, TRUTH positions)',
    'the launch-miss angle and the where-cell (geometry against the priced segment)',
    'the synchronous priced aim = the target\'s post-step position + the deposit (one tick)',
    'the crowding heuristic (PT-C0)'],
};
gate('gLedgerRead', LEDGER_READ.record.length === 8 && LEDGER_READ.declared.length === 5,
  `${LEDGER_READ.record.length} faces read an ENGINE RECORD and ${LEDGER_READ.declared.length} are DECLARED reconstructions (stored)`);

/* ---- per-arm sums, faces, the partition ---- */
const flatsByArm = {} as Record<Arm, number[][]>;
for (const a of ARMS) flatsByArm[a] = perSeed.map((s) => flatten(s.arms[a].row));
const sums = {} as Record<Arm, number[]>;
for (const a of ARMS) sums[a] = sumRows(flatsByArm[a]);
const partitionRows = ARMS.map((a) => {
  const ground = sums[a][FLAT_INDEX['relGround.0']];
  const owners = OWNERS.map((_, i) => sums[a][FLAT_INDEX[`owner.${i}`]]);
  const fb = range(4).map((i) => sums[a][FLAT_INDEX[`fbG.${i}`]]);
  const perSeedOk = perSeed.every((s) => s.arms[a].row.owner.reduce((x, y) => x + y, 0) === s.arms[a].row.relGround[0]);
  const ownerSum = owners.reduce((x, y) => x + y, 0);
  const oppFirst = fb[3];
  const splitSum = range(3).reduce((x, i) => x + sums[a][FLAT_INDEX[`split.${i}`]], 0);
  return { arm: a, population: ground, ownerSum, fbSum: fb.reduce((x, y) => x + y, 0), oppFirst, splitSum,
    residue: owners[6] + owners[7], perSeedOk,
    ok: ground === ownerSum && ground === fb.reduce((x, y) => x + y, 0) && oppFirst === splitSum
      && oppFirst === ownerSum - owners[0] && perSeedOk };
});
gate('gPartition', reproOk && nSeeds > 0 && partitionRows.every((r) => r.ok),
  partitionRows.map((r) => `${r.arm}: ${r.ownerSum} owner cells = ${r.population} ground passes, residue ${r.residue}`).join(' · ')
  + ' — every pass in exactly one cell, per arm and per seed');
const facesByArm = {} as Record<Arm, Record<string, FaceVal>>;
for (const a of ARMS) {
  facesByArm[a] = {};
  FACE_DEFS.forEach((f, fi) => { const v = faceOf(sums[a], fi, nSeeds); facesByArm[a][f.name] = { num: v.num, den: v.den, value: r6(v.value) }; });
}
const deltas: Record<string, { value: number | null; lo: number | null; hi: number | null }> = {};
if (nSeeds > 0) {
  banner('OP-C0 bootstrap …');
  const boot = bootstrap(flatsByArm, nSeeds);
  for (const a of ARMS) {
    FACE_DEFS.forEach((f, fi) => {
      facesByArm[a][f.name].lo = r6(pct(boot.lv[a][fi], 0.025));
      facesByArm[a][f.name].hi = r6(pct(boot.lv[a][fi], 0.975));
    });
  }
  FACE_DEFS.forEach((f, fi) => {
    const e = facesByArm['W18-E'][f.name].value; const dd = facesByArm['W18-D'][f.name].value;
    deltas[f.name] = { value: e === null || dd === null ? null : r6(dd - e),
      lo: r6(pct(boot.dl[fi], 0.025)), hi: r6(pct(boot.dl[fi], 0.975)) };
  });
}
/* non-vacuity: the classes the partition stands on are live on the W18 arms */
const live = (a: Arm, k: string): number => sums[a][FLAT_INDEX[k]] ?? 0;
const nonVacuousOk = reproOk && nSeeds > 0 && (['W18-E', 'W18-D'] as Arm[]).every((a) =>
  live(a, 'fbG.3') > 0 && live(a, 'split.0') > 0 && live(a, 'split.1') > 0 && live(a, 'split.2') > 0
  && live(a, 'scopedPulls.0') > 0 && live(a, 'windupArms.0') > 0);
const emptiness: Record<string, string[]> = {};
for (const a of ARMS) emptiness[a] = FACE_DEFS.filter((f) => (facesByArm[a][f.name].den ?? 0) === 0).map((f) => f.name);
gate('gClassesNonVacuous', nonVacuousOk,
  'on both W18 arms: opponent-first passes, all three split cells, the scoped pulls and the wind-up arms are LIVE; '
  + 'every face with an EMPTY denominator is ENUMERATED in `emptiness` (never imputed, never gated)');
/* gBite — the #414 ROW form: W18-D vs W18-E per-seed rows differ in ≥ 1 stored field */
const biteRows = perSeed.map((s) => ({ seed: s.seed,
  rowsDiffer: JSON.stringify(s.arms['W18-D'].row) !== JSON.stringify(s.arms['W18-E'].row),
  signaturesCoincide: s.arms['W18-D'].signature === s.arms['W18-E'].signature }));
gate('gBite', reproOk && nSeeds > 0 && biteRows.every((r) => r.rowsDiffer),
  `the #414 ROW form: ${biteRows.filter((r) => r.rowsDiffer).length}/${biteRows.length} seeds' W18-D and W18-E rows `
  + `differ in ≥ 1 of ${FLAT_LEN} stored cells; PRINTED FACE (gates nothing): the full-time signature coincides on `
  + `${biteRows.filter((r) => r.signaturesCoincide).length}. ⚠ LIVENESS only`);

/* ---- sizing (the house form, #415) ---- */
const Z975 = 1.959963984540054; const Z80 = 0.8416212335729143;
const TARGET_HW = 0.05;
const sizedFace = 'fb.ground.opponent';
const sizedArm: Arm = 'W18-D';
/** ⭐ THE SMOKE OF RECORD's half-width, TRANSCRIBED from the disclosed 12-seed smoke
 *  (§DEV-PREFLIGHT) before the freeze; every other sizing column is DERIVED below. */
const HW_SMOKE_RECORD: number | null = 0.03119150000000001;
const hwThisRun = nSeeds > 0 && facesByArm[sizedArm][sizedFace].lo !== null && facesByArm[sizedArm][sizedFace].hi !== null
  ? ((facesByArm[sizedArm][sizedFace].hi as number) - (facesByArm[sizedArm][sizedFace].lo as number)) / 2 : null;
const hwSmoke = MODE === 'smoke' ? hwThisRun : HW_SMOKE_RECORD;
const seSmoke = hwSmoke === null ? null : hwSmoke / Z975;
const seNeeded = TARGET_HW / (Z975 + Z80);
const nRequired = seSmoke === null ? null : Math.ceil(SMOKE_N * (seSmoke / seNeeded) ** 2);
const sizing = { face: `${sizedFace}@${sizedArm}`, targetHalfWidth: TARGET_HW, nSmoke: SMOKE_N, hwSmoke,
  seSmoke, seNeeded, nRequired, affordance: N_FROZEN, realisedHalfWidthThisRun: hwThisRun,
  whichNWasTaken: 'THE AFFORDANCE (999) — the #414 §CORR 8 floor reading: the ownership cells and the residue are '
    + 'RARE classes sized by nothing but volume' };

/* ---- assemble the body (allowlist schema), write, re-read, gFaces + gHashOrder + gStage ---- */
const perSeedCells = perSeed.map((s) => {
  const o: Record<string, unknown> = { seed: s.seed };
  for (const a of ARMS) o[a] = { signature: s.arms[a].signature, worldOk: s.arms[a].worldOk, row: s.arms[a].row };
  return o;
});
const BODY_KEYS = ['stage', 'seeds', 'stats', 'arms', 'rowSchema', 'faceDefs', 'faces', 'deltasW18',
  'partition', 'emptiness', 'ownership', 'questions', 'codeMap', 'anchors', 'fixtures', 'ledgerRead',
  'repro', 'worldPin', 'lockstep', 'determinism', 'bite', 'fingerprintProd', 'sizing', 'perf',
  'receipt', 'gates', 'allGreen', 'perSeedCells'] as const;
const val = (a: Arm, f: string): number | null => facesByArm[a]?.[f]?.value ?? null;
const ownership = Object.fromEntries(ARMS.map((a) => [a, Object.fromEntries(OWNERS.map((o, i) => [o, {
  count: sums[a][FLAT_INDEX[`owner.${i}`]], share: val(a, `owner.${o}`),
  shareOfOpponentFirst: i === 0 ? null : val(a, `ownerOfOpponentFirst.${o}`) }]))]));
const questions = Object.fromEntries(ARMS.map((a) => [a, {
  q1: { firstBodyOpponent: val(a, 'fb.ground.opponent'), lofted: val(a, 'fb.lofted.opponent') },
  q2: { wide: SPLITS.map((s) => val(a, `q2.wide.${s}`)), tight: SPLITS.map((s) => val(a, `q2.tight.${s}`)) },
  q3: { pricedBelowBar: val(a, 'q3.inLane.pricedBelowBarShare'), altGivenBelowBar: val(a, 'q3.inLane.altGivenBelowBar'),
    presence: PRESENCES.map((p) => val(a, `q3.inLane.presence.${p}`)) },
  q4: { struckSeat: SEATS.map((s) => val(a, `q4.struck.seat.${s}`)), where: WHERE.map((w) => val(a, `q4.struck.all.where.${w}`)) },
  q5: { actAtContact: ACTS.map((x) => val(a, `q5.arrived.actAtContact.${x}`)) },
}]));
const codeMap = {
  decisionRead: 'TRUTH for the action choice and the legacy pricing (`inSnapshotLaw` ABSENT from a4MatchFlags(18) '
    + 'and (13) ⇒ `opp` IS `oppTruth` in decideCarrier); the TARGET is re-seated by the EDS E3 chooser off the passer\'s '
    + 'OWN scoped snapshot (`edsPerceivedChoice` ON)',
  inSnapshotLawOnW18: flags18.inSnapshotLaw === true, edsPerceivedChoiceOnW18: flags18.edsPerceivedChoice === true,
  seats: { dlcChoice: 'synchronous led strike (`performPass(..., v2(bestLeadX, bestLeadY))`), read as an UNCONSUMED dxStrikeAim deposit',
    dxAim: 'wound-up strike with `pendingPassWindup.aimLead` non-null (DX deposit captured at arm)',
    plain: 'to feet (wound-up without a lead, or synchronous without a deposit)' },
  pricedAim: 'wind-up: `aim + aimLead` of the record; synchronous: the target\'s position (+ the deposit\'s lead)',
  defenceRead: '`decideOffBall` (they have the ball): a pending pass by the other side on the ground ⇒ '
    + '`perceivedBalls.get(p.gid)` → `canInterceptPass` → `InterceptPass` (`edsPerceivedDefence` ON)',
};
const body: Record<string, unknown> = {
  stage: { id: 'OP-C0', ruling: '#426 item 3', instrument: INSTRUMENT_PATH, instrumentSha256: INSTRUMENT_SHA,
    doc: DOC_PATH, mode: MODE, arch: process.arch, node: process.version,
    honestLimitsNote: `the HONEST LIMITS list lives ONLY in ${DOC_PATH} §HONEST LIMITS (the one home); this artifact stores none` },
  seeds: { blockBase: BLOCK_BASE, blockTop: BLOCK_TOP, battery: [BATTERY_SEEDS[0] ?? null, BATTERY_SEEDS[BATTERY_SEEDS.length - 1] ?? null],
    nBattery: BATTERY_SEEDS.length, receipt: RECEIPT_SEED, simCeiling: SIM_CEILING, scratchBase: SCRATCH_BASE,
    scratchUsed: SCRATCH_SEEDS_USED, verifierBand: VERIFIER_BAND, reproSeeds: REPRO_SEEDS, consumedBlocks: CONSUMED_BLOCKS,
    unwalkedTail: MODE === 'full' && perSeed.length < N_FROZEN ? [BLOCK_BASE + perSeed.length, BLOCK_TOP - 1] : null },
  stats: STATS,
  arms: ARMS.map((a) => ({ arm: a, world: ARM_WORLD[a], dosed: ARM_DOSED[a],
    reference: ARM_WORLD[a] === 13 })),
  rowSchema: ROW_SCHEMA,
  faceDefs: FACE_DEFS,
  faces: facesByArm,
  deltasW18: deltas,
  partition: partitionRows,
  emptiness,
  ownership,
  questions,
  codeMap,
  anchors: ANCHORS,
  fixtures: FIXTURES,
  ledgerRead: LEDGER_READ,
  repro: { rows: reproRows, flagSetIdentity18eq17PlusDoor: flagSetIdentity, w18KeysBeyondIfT1bConstruction: w18MinusIfT1b,
    ifT1bKeysBeyondW18: ift1bMinusW18 },
  worldPin,
  lockstep: lockRows,
  determinism: xdetRows,
  bite: { eligible: biteRows.length, rowsDiffer: biteRows.filter((r) => r.rowsDiffer).length,
    signaturesCoincide: biteRows.filter((r) => r.signaturesCoincide).length, cells: FLAT_LEN },
  fingerprintProd: { arch: process.arch, pin: FP_PIN, computed: FP_GOT, ok: FP_PIN !== '' && FP_GOT === FP_PIN },
  sizing,
  perf: { inWalkMsBattery: perSeed.reduce((s, r) => s + ARMS.reduce((x, a) => x + r.arms[a].wallMs, 0), 0),
    walks: perSeed.length * ARMS.length },
  receipt: receiptRows,
  gates: [] as unknown[],
  allGreen: false,
  perSeedCells,
};
/* gHashOrder / gFaces / gStage are computed on the written file — append them, then finalise */
const writeArtifact = (path: string, b: Record<string, unknown>, receipts: Record<string, unknown>): string => {
  const ordered: Record<string, unknown> = {};
  for (const k of BODY_KEYS) ordered[k] = b[k];
  const bodySha = sha(JSON.stringify(ordered));
  writeFileSync(path, JSON.stringify({ ...ordered, receipts, bodySha256: bodySha }), { encoding: 'utf8' });
  return bodySha;
};
const allKeysInSchema = Object.keys(body).every((k) => (BODY_KEYS as readonly string[]).includes(k))
  && BODY_KEYS.every((k) => k in body);
/* provisional gates for the first write */
const finalGateNames = ['gFaces', 'gHashOrder', 'gStage'];
const routedPath = (green: boolean): string => (green || IS_OVERRIDE ? OUT_BASE : OUT_BASE.replace(/\.json$/, '.RED.json'));
body.gates = GATES.map((g) => ({ ...g }));
const preGreen = GATES.every((g) => g.ok);
const outPath = routedPath(preGreen);
writeArtifact(outPath, body, { hashReproducesFromFile: null });
/* gFaces — re-derive EVERY face from the SERIALIZED per-seed cells off disk */
const disk = JSON.parse(readFileSync(outPath, 'utf8')) as {
  perSeedCells: Record<string, unknown>[]; faces: Record<Arm, Record<string, FaceVal>>; bodySha256: string;
} & Record<string, unknown>;
let faceChecks = 0; let faceOk = 0;
for (const a of ARMS) {
  const flats = disk.perSeedCells.map((c) => flatten((c[a] as { row: Row }).row));
  const s = sumRows(flats);
  FACE_DEFS.forEach((f, fi) => {
    faceChecks += 1;
    const v = faceOf(s, fi, flats.length);
    const st = disk.faces[a][f.name];
    if (st !== undefined && st.num === v.num && st.den === v.den && st.value === r6(v.value)) faceOk += 1;
  });
}
const ownershipReDerived = ARMS.every((a) => OWNERS.every((o, i) =>
  (disk.ownership as Record<Arm, Record<Owner, { count: number }>>)[a][o].count
  === disk.perSeedCells.reduce((x, c) => x + (c[a] as { row: Row }).row.owner[i], 0)));
gate('gFaces', faceChecks > 0 && faceOk === faceChecks && ownershipReDerived && FACE_DEFS_OK,
  `${faceOk}/${faceChecks} face checks re-derived from the SERIALIZED per-seed cells off disk; the ownership table `
  + `re-derived ${ownershipReDerived}`);
const reBody: Record<string, unknown> = {};
for (const k of BODY_KEYS) reBody[k] = disk[k];
const hashRepro = sha(JSON.stringify(reBody)) === disk.bodySha256;
gate('gHashOrder', allKeysInSchema && hashRepro,
  `the ${BODY_KEYS.length}-key ALLOWLIST schema is complete; the body hash is computed LAST over it and reproduces from the file`);
gate('gStage', sha(readFileSync(INSTRUMENT_PATH)) === INSTRUMENT_SHA,
  'stage.instrumentSha256 is the RUNNING file\'s hash');
const allGreen = GATES.every((g) => g.ok);
body.gates = GATES.map((g) => ({ ...g }));
body.allGreen = allGreen;
const finalPath = routedPath(allGreen);
if (finalPath !== outPath && existsSync(outPath)) unlinkSync(outPath);
const bodySha = writeArtifact(finalPath, body, { hashReproducesFromFile: hashRepro, finalGates: finalGateNames });
const fileBytes = readFileSync(finalPath);
banner(`OP-C0 ${allGreen ? 'ALL GREEN' : 'RED'} — ${GATES.filter((g) => g.ok).length}/${GATES.length} gates · ${finalPath}`);
banner(`  bodySha256 ${bodySha} · fileSha256 ${sha(fileBytes)} · ${fileBytes.length} bytes · wall ${((Date.now() - T_START) / 1000).toFixed(1)} s`);
for (const a of ARMS) {
  banner(`  ${a}: fb.opponent ${val(a, 'fb.ground.opponent')} [${facesByArm[a]['fb.ground.opponent'].lo}, ${facesByArm[a]['fb.ground.opponent'].hi}] `
    + `n=${facesByArm[a]['fb.ground.opponent'].den} · split ${SPLITS.map((s) => val(a, `q2.wide.${s}`)).join(' / ')}`);
  banner(`    owners ${OWNERS.map((o) => `${o} ${val(a, `owner.${o}`)}`).join(' · ')}`);
}
if (hwSmoke !== null) banner(`  sizing ${sizing.face}: hw ${hwSmoke} → nRequired ${nRequired}`);
