/**
 * OP-C1 — 「近身与算盘」 THE CONTACT-AND-PRICE CENSUS (ruling #428 item 3).
 *
 * A CENSUS: it publishes measurements as STORED PARTITIONS, adjudicates nothing, ships nothing.
 * X-SRC-ZERO: not one byte under `src/` or `tests/` is created or edited; the instrument CALLS the
 * shipped exports and reads public `Match` state per tick.
 *
 * Doc of record: docs/world-model/OP-C1-CONTACT-AND-PRICE-CENSUS.md (§0 · §P · §CODE MAP ·
 * §DEV-PREFLIGHT frozen with this file; §R onward written after the battery).
 *
 * RECIPES COPIED BY RECIPE, ⛔ NEVER IMPORTED — the whole OP-C0 walker, predicates, row and owner
 * mapping are COPIED from `scripts/probes/op-c0-opponent-first-census.ts` (frozen at a40b502),
 * each cited at its site below by OP-C0's own line numbers (which in turn cite BN-C0 · LN-C1 ·
 * IF-T1b · IF-C0). The OP-C0 sub-row this instrument stores is OP-C0's ROW_SCHEMA key for key, so
 * gRepro can compare it cell for cell against OP-C0's stored per-seed rows.
 *
 * ARMS (#428 item 3(i)): W18-E · W18-D ONLY.
 *
 * ENV (whitelisted; anything else is FATAL): OPC1_MODE=smoke|full · OPC1_N · OPC1_OUT.
 *   smoke  — the disclosed sizing smoke on scratch seeds 900,009,400–411 (+ receipt 420), artifact
 *            routed OFF every canonical path.
 *   full   — the battery 12,562,000–998 + the construction receipt 12,562,999.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve as pathResolve, join as pathJoin } from 'node:path';
import { tmpdir } from 'node:os';
import { Match, type PassChoiceTraceEntry } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { CONTROL_RADIUS, DT, GRAVITY } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, ifArmedVersion, loadL3Dose, loadPcDose,
  DS2_WORLD_VERSION, IF_WORLD_VERSION,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { laneOpenness } from '../../src/ai/perception';
import { THREAT_CALIBRATION } from '../../src/ai/passPrior';
import { DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS } from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment } from '../../src/utils/vec';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';
import type { PerceptionSnapshot } from '../../src/ai/perceptionSnapshot';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE (OP-C0 l.60–92, COPIED; renamed)                         */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const ENV_WHITELIST = ['OPC1_MODE', 'OPC1_N', 'OPC1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('OPC1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`OP-C1 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = (process.env.OPC1_MODE ?? 'full') as 'smoke' | 'full';
if (MODE !== 'smoke' && MODE !== 'full') {
  banner('OP-C1 FATAL — OPC1_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.OPC1_N !== undefined ? Number(process.env.OPC1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('OP-C1 FATAL — OPC1_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.OPC1_OUT;
const IS_OVERRIDE = MODE !== 'full' || N_ENV !== undefined || OUT_ENV !== undefined;
const CANONICAL_OUT = 'docs/world-model/data/op-c1-contact-and-price-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? pathJoin(tmpdir(), 'op-c1-override.json') : CANONICAL_OUT);
if (IS_OVERRIDE && pathResolve(OUT_BASE).startsWith(CANONICAL_DIR_ABS)) {
  banner('OP-C1 FATAL — an override run may not write under docs/world-model/data'); process.exit(3);
}
const INSTRUMENT_PATH = 'scripts/probes/op-c1-contact-and-price-census.ts';
const DOC_PATH = 'docs/world-model/OP-C1-CONTACT-AND-PRICE-CENSUS.md';
const OPC0_ARTIFACT = 'docs/world-model/data/op-c0-opponent-first-census.json';
const sha = (v: string | Buffer): string => createHash('sha256').update(v).digest('hex');
const INSTRUMENT_SHA = sha(readFileSync(INSTRUMENT_PATH));
const sh = (cmd: string): string => execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8');
const T_START = Date.now();

/* ========================================================================== */
/* §2 SEEDS (#428 item 3(vi))                                                   */
/* ========================================================================== */
const BLOCK_BASE = 12_562_000;
const BLOCK_TOP = 12_562_999;
const SIM_CEILING = 12_563_000; // ⛔ never a SIM seed ≥ this
const SIM_LATTICE_TOP = 900_000_000; // seeds ≥ this are the out-of-band scratch lattice
const N_FROZEN = 999;
const SMOKE_N = 12;
const N = N_ENV ?? (MODE === 'smoke' ? SMOKE_N : N_FROZEN);
/** ⭐ THE ONE DECLARED SCRATCH BASE (#428 item 3(vi): scratch 900,009,400–499 from ONE base). */
const SCRATCH_BASE = 900_009_400;
const SCRATCH_TOP = 900_009_499;
const VERIFIER_BAND: readonly [number, number] = [900_009_500, 900_009_599];
const SMOKE_SEEDS = Array.from({ length: SMOKE_N }, (_, i) => SCRATCH_BASE + i);
const SMOKE_RECEIPT = SCRATCH_BASE + 20;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const BATTERY_SEEDS = MODE === 'smoke' ? SMOKE_SEEDS.slice(0, N)
  : Array.from({ length: N }, (_, i) => BLOCK_BASE + i);
const RECEIPT_SEED = MODE === 'smoke' ? SMOKE_RECEIPT : BLOCK_TOP;
/** OP-C0's own consumed band — its first twelve battery seeds (re-walk ≠ consumption). */
const REPRO_SEEDS = Array.from({ length: 12 }, (_, i) => 12_561_000 + i);
/** every consumed block of record below this one (OP-C0's list + OP-C0's own block). */
const CONSUMED_BLOCKS = [12_544_000, 12_545_000, 12_546_000, 12_547_000, 12_548_000,
  12_549_000, 12_550_000, 12_551_000, 12_552_000, 12_553_000, 12_554_000, 12_555_000,
  12_556_000, 12_557_000, 12_558_000, 12_559_000, 12_560_000, 12_561_000];
const STATS = { consumed: 0, nextBase: 117_600, registryOfRecord: 88 } as const;
const SCRATCH_SEEDS_USED = MODE === 'smoke'
  ? [...SMOKE_SEEDS.slice(0, N), SMOKE_RECEIPT, WORLD_PIN_SEED, ...LOCKSTEP_SEEDS]
  : [WORLD_PIN_SEED, ...LOCKSTEP_SEEDS];

/* ========================================================================== */
/* §3 ANCHORS — the code map's needles, each pinned to its occurrence count     */
/*    canon (VERBATIM, CANON.md l.55–56): "a seam-map gate pins occurrence COUNTS */
/*    per needle and enumerates EVERY occurrence's site"                          */
/* ========================================================================== */
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const PERC_PATH = 'src/ai/perception.ts';
const SNAP_PATH = 'src/ai/perceptionSnapshot.ts';
const DV_PATH = 'src/ai/deliveryValueSeat.ts';
const A4_PATH = 'src/game/a4World.ts';
const CONST_PATH = 'src/sim/constants.ts';
const PPC_PATH = 'src/ai/perceivedPassChoice.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [BRAIN_PATH, MATCH_PATH, PERC_PATH, SNAP_PATH, DV_PATH, A4_PATH, CONST_PATH, PPC_PATH, MECH_PATH]) {
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
const MD = '·'; // the middle dot of the engine's own `why` strings
const EM = '—'; // the em dash of the kick-off's `why`
/* — OP-C0's 29 needles (OP-C0 l.154–214, COPIED) — */
anchor('the carrier chooser gateway: the snapshot law is the ONE fork that swaps `opp` off truth',
  BRAIN_PATH, '  const inView = match.inSnapshotLaw', 1);
anchor('`opp` IS `oppTruth` whenever `inView` is null', BRAIN_PATH,
  '  const opp = inView === null ? oppTruth : snapshotTeamView(oppTruth, inView.opps);', 1);
anchor('the ground-pass pricer reads the lane off `opp.players` (the chooser\'s own lane)', BRAIN_PATH,
  "        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),", 1);
anchor('⭐ THE GATE — groundCandidate\'s risk gate (gain > 0.15 AND lane < 0.4)', BRAIN_PATH,
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
anchor('the defence\'s interception trigger: a pass in flight by the other side, on the ground',
  BRAIN_PATH, '    if (ball.owner === null && match.pendingPass && match.pendingPass.side !== team.side && ball.z <= 0.5) {', 1);
anchor('the defender reads the ball off HIS OWN percept when `edsPerceivedDefence`', BRAIN_PATH,
  '        ? (match.perceivedBalls.get(p.gid) ?? null)', 1);
anchor('…and prices the lane with `canInterceptPass` on that percept', BRAIN_PATH,
  '        ? (seen === null ? null : canInterceptPass(p, { pos: seen.pos, vel: seen.vel } as typeof ball))', 1);
anchor('the interception candidate', BRAIN_PATH,
  "      if (inter?.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });", 1);
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
/* — OP-C1's NEW needles: THE SEATS, THE DECIDER'S OWN RECORDS, THE PRICES — */
anchor('⭐ the price\'s OWN clear radius inside `laneOpenness` (the kick clears a body this close to the passer)',
  PERC_PATH, '    if (dist(cp, from) < 1.5) continue;', 1);
anchor('the price\'s own lane = the closest-point distance over the corridor scale 4 m', PERC_PATH,
  '    worst = Math.min(worst, clamp01(d / 4));', 1);
anchor('SEAT kickoff — the kick-off play-back loop strikes its own pick', BRAIN_PATH,
  '      match.performPass(p, back);', 1);
anchor('SEAT kickoff — its own `why`, the engine\'s record of the seat', BRAIN_PATH,
  `        scores: [{ action: 'Pass', score: 1, why: 'kickoff ${EM} played back' }],`, 1);
anchor('the decision\'s own localX (the passer\'s position on the attack axis)', BRAIN_PATH,
  '  const localX = team.localX(p.pos.x);', 1);
anchor('the stagnation the gate\'s multiplier reads', BRAIN_PATH,
  '  const stagnation = clamp01((team.staleTime - 3) / 5);', 1);
anchor('the candidate\'s forward gain (normalised ±1 over 30 m)', BRAIN_PATH,
  '      const gain = clamp01((team.localX(aim.x) - localX + 30) / 60) * 2 - 1;', 1);
anchor('⭐ the gate\'s base (riskTolerance)', BRAIN_PATH,
  '        const gate = 0.35 + g.riskTolerance * 0.65;', 1);
anchor('⭐ the gate\'s MULTIPLIER on the candidate\'s score', BRAIN_PATH,
  '        s *= gate + (1 - gate) * stagnation * 0.4;', 1);
anchor('the legacy argmax winner\'s own `why` — names bestMate and prints bestLane (the engine\'s record)',
  BRAIN_PATH, `        why: \`to \${bestMate.name} ${MD} lane \${bestLane.toFixed(2)} ${MD} open \${bestOpen.toFixed(2)}`, 1);
anchor('SEAT groundCandidate — the legacy target is the default `passMate`', BRAIN_PATH,
  '  let passMate = bestMate;', 1);
anchor('SEAT snapshot — the E3 chooser\'s pick REPLACES the legacy target (null keeps it)', BRAIN_PATH,
  '    if (chosen) passMate = chosen;', 1);
anchor('the E3 chooser\'s own trace door (pure observation)', BRAIN_PATH,
  '    if (match.traceChoice) {', 1);
anchor('the trace stores the chooser\'s pick (−1 = no executable option)', BRAIN_PATH,
  '        chosenGid: choice?.targetGid ?? -1,', 1);
anchor('the trace stores the legacy pick beside it', BRAIN_PATH,
  '        legacyGid: bestMate.gid,', 1);
anchor('the trace stores the chosen option\'s reception (the threat price)', BRAIN_PATH,
  '        reception: choice?.reception ?? Number.NaN,', 1);
anchor('SEAT cutback — the arriver, struck by its own machinery', BRAIN_PATH,
  '        match.performCutback(p, cutbackMate!);', 1);
anchor('SEAT throughBall — the runner the through-ball scorer picked', BRAIN_PATH,
  '      match.performThroughBall(p, bestRunner!, bestThroughChip, offsideExemptKick);', 1);
anchor('⭐ the snapshot chooser\'s ARGMAX on `price` (ties to the lower gid)', PPC_PATH,
  '    option.price > winner.price', 1);
anchor('only EXECUTABLE options enter that argmax', PPC_PATH,
  '  const executable = priced.filter((option) => option.executable);', 1);
anchor('⭐ the READ option\'s THREAT PRICE (reception = the band\'s calibrated clean-control share)', PPC_PATH,
  '  const reception = threatQuintilePrice(read.interceptionThreatSeconds);', 1);
anchor('⭐ the READ option\'s THREAT BAND (`threatBandIndex`)', PPC_PATH,
  '  const band = threatBandIndex(read.interceptionThreatSeconds);', 1);
anchor('the trace door is a construction option, default off in production', MATCH_PATH,
  '    this.traceChoice = cfg.traceChoice ?? EDS_TRACE_ARMED;', 1);
anchor('every brain decides BEFORE any executor or physics step (positions at decision = pre-step)', MATCH_PATH,
  '        decidePlayer(p, this);', 1);
anchor('…the executors run after the decide loop', MATCH_PATH,
  '      if (!p.sentOff) executeAction(p, this, dt);', 1);
anchor('…and the stale clock moves only after the ball step', MATCH_PATH,
  '        holder.staleTime += dt;', 1);
anchor('the ground shortPass is booked by `performPass` only (passes++, no longBalls++)', MECH_PATH,
  'export function performPass(', 1);
/** the gate and its multiplier, PARSED from their own anchored lines (never typed). */
const BAR_LINE = '      if (gain > 0.15 && lane < 0.4) {';
const BAR = Number(BAR_LINE.slice(BAR_LINE.indexOf('lane < ') + 7, BAR_LINE.indexOf(') {')));
const GAIN_GATE = Number(BAR_LINE.slice(BAR_LINE.indexOf('gain > ') + 7, BAR_LINE.indexOf(' && lane')));
const PLAYMAKER_LINE = "        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),";
const PLAYMAKER_MUL = Number(PLAYMAKER_LINE.slice(PLAYMAKER_LINE.indexOf('? ') + 2, PLAYMAKER_LINE.indexOf(' : 1')));
const GATE_LINE = '        const gate = 0.35 + g.riskTolerance * 0.65;';
const GATE_BASE = Number(GATE_LINE.slice(GATE_LINE.indexOf('= ') + 2, GATE_LINE.indexOf(' + g.')));
const GATE_RISK = Number(GATE_LINE.slice(GATE_LINE.indexOf('riskTolerance * ') + 16, GATE_LINE.indexOf(';')));
const MULT_LINE = '        s *= gate + (1 - gate) * stagnation * 0.4;';
const MULT_STAG = Number(MULT_LINE.slice(MULT_LINE.indexOf('stagnation * ') + 13, MULT_LINE.indexOf(';')));
const STAG_LINE = '  const stagnation = clamp01((team.staleTime - 3) / 5);';
const STAG_OFF = Number(STAG_LINE.slice(STAG_LINE.indexOf('staleTime - ') + 12, STAG_LINE.indexOf(') / ')));
const STAG_DIV = Number(STAG_LINE.slice(STAG_LINE.indexOf(') / ') + 4, STAG_LINE.indexOf(');')));
const GAIN_LINE = '      const gain = clamp01((team.localX(aim.x) - localX + 30) / 60) * 2 - 1;';
const GAIN_OFF = Number(GAIN_LINE.slice(GAIN_LINE.indexOf('localX + ') + 9, GAIN_LINE.indexOf(') / ')));
const GAIN_DIV = Number(GAIN_LINE.slice(GAIN_LINE.indexOf(') / ') + 4, GAIN_LINE.indexOf(') * 2')));
const KICKOFF_WHY = `kickoff ${EM} played back`;
const PARSED = { BAR, GAIN_GATE, PLAYMAKER_MUL, GATE_BASE, GATE_RISK, MULT_STAG, STAG_OFF, STAG_DIV, GAIN_OFF, GAIN_DIV };
const ANCHORS_OK = ANCHORS.every((a) => a.ok) && BAR === 0.4 && GAIN_GATE === 0.15 && PLAYMAKER_MUL === 1.15
  && GATE_BASE === 0.35 && GATE_RISK === 0.65 && MULT_STAG === 0.4 && STAG_OFF === 3 && STAG_DIV === 5
  && GAIN_OFF === 30 && GAIN_DIV === 60
  && DV_CORRIDOR_SCALE === 4 && DV_CLEAR_RADIUS === 1.5 && Number.isFinite(CONTROL_RADIUS);
banner(`OP-C1 anchors ${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} · parsed ${JSON.stringify(PARSED)}`);
for (const a of ANCHORS.filter((q) => !q.ok)) banner(`  RED anchor (${a.got} ≠ ${a.want}) ${a.what}`);

/* ========================================================================== */
/* §4 THE ARMS (OP-C0 l.227–295, COPIED; the W13 rows dropped by #428 item 3(i)) */
/* ========================================================================== */
const ARMS = ['W18-E', 'W18-D'] as const;
type Arm = (typeof ARMS)[number];
const ARM_WORLD: Record<Arm, 18> = { 'W18-E': 18, 'W18-D': 18 };
const ARM_DOSED: Record<Arm, boolean> = { 'W18-E': false, 'W18-D': true };

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
  banner(`OP-C1 FATAL — the shipped dose loaders failed: ${String(err)}`); process.exit(3);
}
if (!DOSE_BYTES_OK || L3_DOSE === null || PC_DOSE === null) {
  banner('OP-C1 FATAL — dose bytes do not match their pins'); process.exit(3);
}

/** DS-C0's team construction, byte for byte (OP-C0 l.252–260 ← IF-T1b `teamInfo`). */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐ THE ARM CONSTRUCTION — OP-C0's `buildMatch` (l.264–273), COPIED: the composer CALLED
 *  (`a4MatchFlags(18)`), the shipped arming CALLED (`armA4World(m, null, 18[, L3, PC])`). */
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
/** OP-C0's `signatureOf` (l.286–294 ← IF-T1b) — field for field, INCLUDING `action.type`. */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
    action: pp.action.type,
  })),
}));

/* ========================================================================== */
/* §5 THE WALK-SIDE PREDICATES — PURE, fixture-backed                           */
/* ========================================================================== */
/* --- OP-C0 l.301–339 (← BN-C0 l.457–493, PT-C0's population), COPIED --- */
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
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');
const FLIGHT_RETIRE_TICKS = 720;

/* --- OP-C0 l.342–374 (← BN-C0 l.574–586 · LN-C1 l.115–118, l.636–641), COPIED --- */
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
const centreLineDistOf = (
  fromX: number, fromY: number, aimX: number, aimY: number, px: number, py: number,
): number => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  return Math.hypot(cp.x - px, cp.y - py);
};
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const OPEN_BIN_W = 0.1; const OPEN_BINS = 10;
const edgeBinOf = (v: number, edges: readonly number[]): number => {
  let k = 0;
  for (let i = 0; i < edges.length; i++) if (v >= edges[i]) k = i;
  return k;
};
const MISS_EDGES = [0, 2, 5, 10, 20, 45] as const;         // degrees
const DIST_EDGES = [0, 4, 6, 8, 12, 20] as const;          // metres

/* --- OP-C0 l.377–447: the priced lane, the bar, the alternative, the presence test, the seat,
 *     the where-cell, the angle, the acts and THE OWNER MAPPING — COPIED --- */
const pricedLaneOf = (rawOpen: number, playmaker: boolean): number =>
  Math.min(1, rawOpen * (playmaker ? PLAYMAKER_MUL : 1));
const belowBarOf = (pricedLane: number): boolean => pricedLane < BAR;
const altQualifiesOf = (altPriced: number, chosenPriced: number): boolean =>
  altPriced >= BAR && altPriced >= chosenPriced;
const PRESENCES = ['truthRead', 'snapshotPresent', 'snapshotAbsent', 'noChoiceRead'] as const;
type Presence = (typeof PRESENCES)[number];
const presenceOf = (choiceKnown: boolean, scopedPullAtChoice: boolean, inSnapshot: boolean): Presence =>
  (!choiceKnown ? 'noChoiceRead' : !scopedPullAtChoice ? 'truthRead'
    : inSnapshot ? 'snapshotPresent' : 'snapshotAbsent');
const SEATS = ['dlcChoice', 'dxAim', 'plain'] as const;
type Seat = (typeof SEATS)[number];
const seatOf = (viaWindup: boolean, windupLead: boolean, syncDepositThisStep: boolean): Seat =>
  (viaWindup ? (windupLead ? 'dxAim' : 'plain') : syncDepositThisStep ? 'dlcChoice' : 'plain');
const WHERE = ['beyondAim', 'besideLine', 'atTheKicker'] as const;
type Where = (typeof WHERE)[number];
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
const OWNERS = ['notOpponentFirst', 'price', 'priceGeometry', 'struckNotPriced', 'defenceRead',
  'perception', 'residueBelowBarNoAlternative', 'residueNoChoiceRead'] as const;
type Owner = (typeof OWNERS)[number];
interface OwnerInput {
  fb: ContactClass; split: Split | null; presence: Presence;
  pricedLane: number | null; altOpp: boolean;
}
const ownerOf = (i: OwnerInput): Owner => {
  if (i.fb !== 'opponent') return 'notOpponentFirst';
  if (i.split === 'arrivedInFlight') return 'defenceRead';
  if (i.split === 'struckThrough') return 'struckNotPriced';
  if (i.presence === 'snapshotAbsent') return 'perception';
  if (i.presence === 'noChoiceRead' || i.pricedLane === null) return 'residueNoChoiceRead';
  if (belowBarOf(i.pricedLane) && i.altOpp) return 'price';
  if (!belowBarOf(i.pricedLane)) return 'priceGeometry';
  return 'residueBelowBarNoAlternative';
};
/** the five owner cells the in-lane class can fall in (OP-C0 §P.G rows 3–5 + the two residues). */
const IN_LANE_OWNERS: readonly Owner[] = ['price', 'priceGeometry', 'perception',
  'residueBelowBarNoAlternative', 'residueNoChoiceRead'];

/* --- ⭐⭐⭐ QA — THE STRUCK-THROUGH CONTACT BY TWO DISTANCES (NEW, #428 item 3(iii)) --- */
/** The contact against the PRICED line L→E: `t` = metres ALONG it from the launch L (negative =
 *  behind the kicker), `lat` = SIGNED metres perpendicular to the INFINITE line (left of L→E
 *  positive), `seg` = metres to the priced SEGMENT (BN-C0's closest point — the corridor's own
 *  distance), `len` = the segment's length. A degenerate line (len ≤ 1e-9, OP-C0's `whereOf`
 *  guard) has t = 0, lat = the distance to L with sign 0. */
interface LineGeom { t: number; lat: number; seg: number; len: number }
const lineGeomOf = (lx: number, ly: number, ex: number, ey: number, px: number, py: number): LineGeom => {
  const len = Math.hypot(ex - lx, ey - ly);
  const seg = centreLineDistOf(lx, ly, ex, ey, px, py);
  if (!(len > 1e-9)) return { t: 0, lat: Math.hypot(px - lx, py - ly), seg, len: 0 };
  const ux = (ex - lx) / len; const uy = (ey - ly) / len;
  const t = (px - lx) * ux + (py - ly) * uy;
  const lat = ux * (py - ly) - uy * (px - lx);
  return { t, lat, seg, len };
};
/** frozen ALONG-LINE edges (lower edges, metres; the first catches everything behind the kicker):
 *  behind · [0, DV_CLEAR_RADIUS) · [DV_CLEAR_RADIUS, 4) · [4, 8) · [8, 15) · [15, ∞). */
const ALONG_EDGES = [Number.NEGATIVE_INFINITY, 0, DV_CLEAR_RADIUS, 4, 8, 15] as const;
/** frozen LATERAL edges on |lat| (metres): [0, DV_CLEAR_RADIUS) · [DV_CLEAR_RADIUS,
 *  DV_CORRIDOR_SCALE) · [DV_CORRIDOR_SCALE, 8) · [8, 15) · [15, ∞). The wide corridor's half-width
 *  is CONSTANT along the copied corridor (`inCorridorOf` takes one `halfWidth`), so "the wide
 *  corridor's half-width at the contact" is DV_CORRIDOR_SCALE everywhere. */
const LAT_EDGES = [0, DV_CLEAR_RADIUS, DV_CORRIDOR_SCALE, 8, 15] as const;
/** frozen edges for the opponent's distance to the PASSER at release (metres). */
const PASSER_DIST_EDGES = [0, DV_CLEAR_RADIUS, DV_CORRIDOR_SCALE, 8, 15, 25] as const;
const N_ALONG = ALONG_EDGES.length; const N_LAT = LAT_EDGES.length; const N_PD = PASSER_DIST_EDGES.length;
/** THE MOVE: between release and contact the man CROSSED the priced line (the signed lateral
 *  changed sign, both non-zero) or CLOSED on it by at least DV_CLEAR_RADIUS (|lat| at release −
 *  |lat| at contact ≥ 1.5 m). */
const movedOf = (latRelease: number, latContact: number): boolean => {
  const crossed = latRelease !== 0 && latContact !== 0 && Math.sign(latRelease) !== Math.sign(latContact);
  const closed = Math.abs(latRelease) - Math.abs(latContact) >= DV_CLEAR_RADIUS;
  return crossed || closed;
};
/** ⭐⭐⭐ THE THREE READINGS (#427 item 4(i)), frozen with precedence top to bottom:
 *  `guardSkip`     — the price's own guard: the contact projects within DV_CLEAR_RADIUS of the
 *                    launch (t < 1.5, or behind) AND lies within DV_CORRIDOR_SCALE of the priced
 *                    SEGMENT (seg < 4) — a man the corridor would hold but for the clear-the-kicker
 *                    skip (the man at the feet);
 *  `steppedAcross` — not the above, and THE MOVE holds (he crossed the priced line, or closed on
 *                    it by ≥ 1.5 m, between release and contact);
 *  `leftLineEarly` — not the above, the contact is NOT past the aim (t ≤ len) and is at least
 *                    DV_CORRIDOR_SCALE off the priced line (|lat| ≥ 4): a man who did not move,
 *                    met by a ball that left the priced line before its aim;
 *  `leftover`      — everything else (chiefly: past the aim with no move; behind the kicker off
 *                    the segment with |lat| < 4), PRINTED. */
const READINGS = ['guardSkip', 'steppedAcross', 'leftLineEarly', 'leftover'] as const;
type Reading = (typeof READINGS)[number];
const readingOf = (g: LineGeom, moved: boolean): Reading => {
  if (g.t < DV_CLEAR_RADIUS && g.seg < DV_CORRIDOR_SCALE) return 'guardSkip';
  if (moved) return 'steppedAcross';
  if (g.t <= g.len && Math.abs(g.lat) >= DV_CORRIDOR_SCALE) return 'leftLineEarly';
  return 'leftover';
};

/* --- ⭐⭐⭐ QB — THE DECIDER AND ITS OWN PRICE (NEW, #428 item 3(iv)) --- */
/** WHO SEATED THE TARGET, read off the engine's own path (§CODE MAP 1):
 *  `snapshot`        — the EDS E3 chooser returned an executable pick on the choice step (its
 *                      own trace entry, `chosenGid ≥ 0`) and it is the released target;
 *  `groundCandidate` — a fresh `Pass` decision on the choice step that the E3 chooser did not
 *                      re-seat (no entry: a keeper passer; or `chosenGid = −1`) — the legacy
 *                      truth argmax `bestMate`;
 *  `throughBall` / `cutback` — the released klass (their own choosers);
 *  `kickoff`         — the fresh decision's own `why` is the kick-off play-back's;
 *  `unread`          — no fresh decision on the choice step, or an E3 pick that is not the
 *                      released target. */
const DECIDERS = ['snapshot', 'groundCandidate', 'throughBall', 'cutback', 'kickoff', 'unread'] as const;
type Decider = (typeof DECIDERS)[number];
interface DeciderInput {
  fresh: boolean; klass: Klass; topAction: string | null; kickoffWhy: boolean;
  traced: boolean; chosenGid: number; targetGid: number;
}
const deciderOf = (i: DeciderInput): Decider => {
  if (!i.fresh) return 'unread';
  if (i.klass === 'cutback') return 'cutback';
  if (i.klass === 'throughBall') return 'throughBall';
  if (i.kickoffWhy) return 'kickoff';
  if (i.traced && i.chosenGid >= 0) return i.chosenGid === i.targetGid ? 'snapshot' : 'unread';
  if (i.topAction === 'Pass') return 'groundCandidate';
  return 'unread';
};
/** the snapshot chooser's own threat bands whose CALIBRATED clean-control price
 *  (`THREAT_CALIBRATION[band].realizedSuccess`, the very number `threatQuintilePrice` returns as
 *  the option's reception) is BELOW ONE HALF — DERIVED from the shipped table, never typed. The
 *  one half is this census's DECLARED coin ("more likely lost than kept"), not an engine bar. */
const RECEPTION_COIN = 0.5;
const SHUT_BANDS: readonly number[] = THREAT_CALIBRATION
  .map((row, i) => ({ i, r: row.realizedSuccess })).filter((x) => x.r < RECEPTION_COIN).map((x) => x.i);
/** the snapshot-seated target, by the chooser's OWN read of the chosen option: READ in an open
 *  band · READ in a shut band · SEEN-UNREAD (no corridor read: band −1). */
const snapCellOf = (infoClass: string, band: number): 'snapOpen' | 'snapShut' | 'snapUnread' =>
  (infoClass !== 'READ' || band < 0 ? 'snapUnread' : SHUT_BANDS.includes(band) ? 'snapShut' : 'snapOpen');
/** the groundCandidate-seated target, by the gate AS THE ENGINE WRITES IT (`gain > 0.15 &&
 *  lane < 0.4`): fired · lane below 0.4 but not forward enough for the gate · lane ≥ 0.4. */
const gcCellOf = (lane: number, gain: number): 'gcGateFired' | 'gcBelowBarNotForward' | 'gcOpen' =>
  (gain > GAIN_GATE && lane < BAR ? 'gcGateFired' : lane < BAR ? 'gcBelowBarNotForward' : 'gcOpen');
/** the gate's own multiplier: `gate + (1 − gate) · stagnation · 0.4`, `gate = 0.35 + rt · 0.65`. */
const gateMultOf = (riskTolerance: number, stagnation: number): number => {
  const gate = GATE_BASE + riskTolerance * GATE_RISK;
  return gate + (1 - gate) * stagnation * MULT_STAG;
};
const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const stagnationOf = (staleTime: number): number => clamp01((staleTime - STAG_OFF) / STAG_DIV);
const gainOf = (aimLocalX: number, passerLocalX: number): number =>
  clamp01((aimLocalX - passerLocalX + GAIN_OFF) / GAIN_DIV) * 2 - 1;
/** THE QB PARTITION of a ground release (one cell each). */
const QB = ['snapOpen', 'snapShut', 'snapUnread', 'gcOpen', 'gcBelowBarNotForward', 'gcGateFired',
  'throughBall', 'cutback', 'kickoff', 'unread'] as const;
type QbCell = (typeof QB)[number];
/** "PRICED SHUT AND PLAYED": the decider's own price said shut — a snapshot pick in a shut band,
 *  or a groundCandidate pick the gate fired on — and the pass was played. */
const SHUT_AND_PLAYED: readonly QbCell[] = ['snapShut', 'gcGateFired'];
const qbCellOf = (decider: Decider, snap: ReturnType<typeof snapCellOf> | null,
  gc: ReturnType<typeof gcCellOf> | null): QbCell => {
  if (decider === 'snapshot') return snap ?? 'unread';
  if (decider === 'groundCandidate') return gc ?? 'unread';
  return decider;
};
/** THE HIGHER-PRICED ALTERNATIVE (snapshot chooser): an EXECUTABLE option of the SAME menu the
 *  chooser priced strictly higher than the option it picked. */
const higherPricedAltOf = (options: readonly { targetGid: number; price: number; executable: boolean }[],
  chosenGid: number, chosenPrice: number): boolean =>
  options.some((o) => o.executable && o.targetGid !== chosenGid && o.price > chosenPrice);
/** the engine's own `why` of a legacy Pass winner: `to <bestMate.name> · lane <bestLane 2dp> · …`. */
const WHY_RE = new RegExp(`^to (.+?) ${MD} lane (-?\\d+\\.\\d\\d) ${MD} open `);
const whyReadOf = (why: string): { mate: string; lane: string } | null => {
  const r = WHY_RE.exec(why);
  return r === null ? null : { mate: r[1], lane: r[2] };
};
const PRICE_EDGES = [0, 0.05, 0.10, 0.15, 0.25] as const;   // the chosen option's own price
const MULT_EDGES = [0, 0.5, 0.65, 0.8, 0.9] as const;       // the gate's multiplier
const N_BANDS = THREAT_CALIBRATION.length + 1;               // band −1 (unread) + the quintiles

/* ========================================================================== */
/* §6 THE FIXTURES — canon (VERBATIM, CANON.md l.58–60): "a scored face's        */
/*    walk-side predicate is pinned — anchored extraction or fixture — because    */
/*    the re-derivation gate proves arithmetic, not definitions"                  */
/* ========================================================================== */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
/* — OP-C0's fixtures on the copies (OP-C0 l.457–550, COPIED) — */
const D0: StatDelta = { shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0 };
fx('klass.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klass.throughBall', klassOf({ ...D0, passes: 1, throughBalls: 1 }, false), 'throughBall');
fx('klass.cutback', klassOf({ ...D0, passes: 1, cutbacks: 1 }, false), 'cutback');
fx('klass.lofted', klassOf({ ...D0, passes: 1, longBalls: 1 }, false), 'loftedPass');
fx('klass.shotWins', klassOf({ ...D0, passes: 1, shots: 1 }, false), 'shot');
fx('klass.null', klassOf(D0, false), null);
fx('delivery.shotIsNot', isDelivery('shot'), false);
fx('ground.grounded', isGroundLaunch(true, 9), true);
fx('ground.rising', isGroundLaunch(false, 0.1), false);
fx('measurable.short', isMeasurableGroundPass('shortPass', true, true), true);
fx('measurable.lofted', isMeasurableGroundPass('loftedPass', true, true), false);
fx('firstBody.ownTarget', contactClassOf(4, 4, 0, 0), 'ownTarget');
fx('firstBody.opponent', contactClassOf(9, 4, 1, 0), 'opponent');
fx('firstBody.none', contactClassOf(null, 4, null, 0), 'none');
fx('corridor.onTheLine', inCorridorOf(0, 0, 20, 0, 10, 0, DV_CORRIDOR_SCALE), true);
fx('corridor.fourOffIsOut', inCorridorOf(0, 0, 20, 0, 10, 4, DV_CORRIDOR_SCALE), false);
fx('corridor.atTheKickerExcluded', inCorridorOf(0, 0, 20, 0, 1, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.tightExcludesThree', inCorridorOf(0, 0, 20, 0, 10, 3, CONTROL_RADIUS), false);
fx('split.struck', oppCellOf(false, false), 'struckThrough');
fx('split.atReleaseWins', oppCellOf(true, true), 'corridorAtRelease');
fx('bar.isParsedFromItsLine', BAR, 0.4);
fx('bar.atBarDoesNotFire', belowBarOf(0.4), false);
fx('priced.playmakerCrossesTheBar', belowBarOf(pricedLaneOf(0.36, true)), false);
fx('alt.equalFires', altQualifiesOf(0.4, 0.4), true);
fx('presence.absent', presenceOf(true, true, false), 'snapshotAbsent');
fx('seat.dlcChoice', seatOf(false, false, true), 'dlcChoice');
fx('seat.dxAim', seatOf(true, true, false), 'dxAim');
fx('where.atKicker.fiveAside', whereOf(0, 0, 20, 0, 1, 5), 'atTheKicker');
fx('where.beyond', whereOf(0, 0, 20, 0, 25, 1), 'beyondAim');
const OI = (fb: ContactClass, split: Split | null, presence: Presence, lane: number | null,
  alt: boolean): OwnerInput => ({ fb, split, presence, pricedLane: lane, altOpp: alt });
fx('owner.struckNotPriced', ownerOf(OI('opponent', 'struckThrough', 'snapshotAbsent', 0.1, true)), 'struckNotPriced');
fx('owner.perception', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotAbsent', 0.1, true)), 'perception');
fx('owner.price', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotPresent', 0.2, true)), 'price');
fx('owner.priceGeometry', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotPresent', 0.6, true)), 'priceGeometry');
fx('owner.residueBelowBarNoAlt', ownerOf(OI('opponent', 'corridorAtRelease', 'snapshotPresent', 0.2, false)), 'residueBelowBarNoAlternative');
fx('owner.defenceRead', ownerOf(OI('opponent', 'arrivedInFlight', 'truthRead', 0.9, false)), 'defenceRead');
/* — ⭐ QA: the two distances — */
const G = (px: number, py: number): LineGeom => lineGeomOf(0, 0, 20, 0, px, py);
fx('geom.alongIsProjection', G(7, 3).t, 7);
fx('geom.lateralIsSignedLeft', G(7, 3).lat, 3);
fx('geom.lateralIsSignedRight', G(7, -3).lat, -3);
fx('geom.segIsBnC0ClosestPoint.beyond', Math.abs(G(23, 4).seg - 5) < 1e-12, true);
fx('geom.lateralOfBeyondIsPerpendicular', G(23, 4).lat, 4);
fx('geom.behindTheKicker', G(-2, 1).t, -2);
fx('geom.degenerateLine', lineGeomOf(0, 0, 0, 0, 3, 4), { t: 0, lat: 5, seg: 5, len: 0 });
fx('bins.along.behind', edgeBinOf(-0.1, ALONG_EDGES), 0);
fx('bins.along.zero', edgeBinOf(0, ALONG_EDGES), 1);
fx('bins.along.clearRadiusIsAnEdge', edgeBinOf(DV_CLEAR_RADIUS, ALONG_EDGES), 2);
fx('bins.along.justUnderClear', edgeBinOf(1.4999, ALONG_EDGES), 1);
fx('bins.along.top', edgeBinOf(40, ALONG_EDGES), 5);
fx('bins.lat.zero', edgeBinOf(0, LAT_EDGES), 0);
fx('bins.lat.clearRadiusIsAnEdge', edgeBinOf(DV_CLEAR_RADIUS, LAT_EDGES), 1);
fx('bins.lat.corridorHalfWidthIsAnEdge', edgeBinOf(DV_CORRIDOR_SCALE, LAT_EDGES), 2);
fx('bins.lat.justUnderHalfWidth', edgeBinOf(3.9999, LAT_EDGES), 1);
fx('bins.lat.top', edgeBinOf(30, LAT_EDGES), 4);
fx('bins.passerDist.at4', edgeBinOf(4, PASSER_DIST_EDGES), 2);
fx('bins.passerDist.top', edgeBinOf(60, PASSER_DIST_EDGES), 5);
fx('moved.crossed', movedOf(2, -0.5), true);
fx('moved.closedByClearRadius', movedOf(6, 4.5), true);
fx('moved.closedLessDoesNot', movedOf(6, 4.6), false);
fx('moved.openedDoesNot', movedOf(4, 6), false);
fx('moved.zeroSignDoesNotCross', movedOf(0, 3), false);
/* the three readings + leftover, every cell firing and its neighbours not */
fx('reading.guard.atTheFeet', readingOf(G(0.5, 1), false), 'guardSkip');
fx('reading.guard.behindKickerClose', readingOf(G(-1, 2), false), 'guardSkip');
fx('reading.guard.beatsTheMove', readingOf(G(1, 2), true), 'guardSkip');
fx('reading.guard.notWhenFiveAside', readingOf(G(1, 5), false), 'leftLineEarly');
fx('reading.guard.notPastClearRadius', readingOf(G(1.5, 1), false), 'leftover');
fx('reading.stepped', readingOf(G(10, 5), true), 'steppedAcross');
fx('reading.stepped.pastAim', readingOf(G(25, 1), true), 'steppedAcross');
fx('reading.leftLine.beside', readingOf(G(10, 5), false), 'leftLineEarly');
fx('reading.leftLine.atAimIsNotPast', readingOf(G(20, 6), false), 'leftLineEarly');
fx('reading.leftLine.needsFourOff', readingOf(G(10, 3.9), false), 'leftover');
fx('reading.leftover.pastAimStill', readingOf(G(25, 1), false), 'leftover');
fx('reading.leftover.pastAimWide', readingOf(G(25, 6), false), 'leftover');
fx('reading.leftover.behindFar', readingOf(G(-5, 2), false), 'leftover');
/* — ⭐ QB: the decider, the bands, the gate, the multiplier, the higher-priced test — */
const DI = (o: Partial<DeciderInput>): DeciderInput => ({ fresh: true, klass: 'shortPass', topAction: 'Pass',
  kickoffWhy: false, traced: false, chosenGid: -1, targetGid: 7, ...o });
fx('decider.snapshot', deciderOf(DI({ traced: true, chosenGid: 7 })), 'snapshot');
fx('decider.snapshotNotTheTargetIsUnread', deciderOf(DI({ traced: true, chosenGid: 8 })), 'unread');
fx('decider.gc.e3NoExecutable', deciderOf(DI({ traced: true, chosenGid: -1 })), 'groundCandidate');
fx('decider.gc.untraced', deciderOf(DI({})), 'groundCandidate');
fx('decider.notFreshIsUnread', deciderOf(DI({ fresh: false, traced: true, chosenGid: 7 })), 'unread');
fx('decider.throughBall', deciderOf(DI({ klass: 'throughBall', topAction: 'ThroughBall' })), 'throughBall');
fx('decider.cutback', deciderOf(DI({ klass: 'cutback', traced: true, chosenGid: 7 })), 'cutback');
fx('decider.kickoff', deciderOf(DI({ kickoffWhy: true })), 'kickoff');
fx('decider.notAPassIsUnread', deciderOf(DI({ topAction: 'Dribble' })), 'unread');
fx('bands.shutDerivedFromTable', SHUT_BANDS, [3, 4]);
fx('snap.open', snapCellOf('READ', 2), 'snapOpen');
fx('snap.shut', snapCellOf('READ', 3), 'snapShut');
fx('snap.shutTop', snapCellOf('READ', 4), 'snapShut');
fx('snap.bestBandOpen', snapCellOf('READ', 0), 'snapOpen');
fx('snap.unread', snapCellOf('SEEN-UNREAD', -1), 'snapUnread');
fx('gc.gateFires', gcCellOf(0.39, 0.16), 'gcGateFired');
fx('gc.gateNotAtGain', gcCellOf(0.39, 0.15), 'gcBelowBarNotForward');
fx('gc.gateNotAtBar', gcCellOf(0.4, 0.9), 'gcOpen');
fx('gc.backwardOpen', gcCellOf(0.9, -0.5), 'gcOpen');
fx('gate.multZeroRiskZeroStale', gateMultOf(0, 0), 0.35);
fx('gate.multFullRiskIsOne', gateMultOf(1, 0), 1);
fx('gate.multStale', Math.abs(gateMultOf(0, 1) - (0.35 + 0.65 * 0.4)) < 1e-12, true);
fx('stag.belowThreeIsZero', stagnationOf(2.9), 0);
fx('stag.eightIsOne', stagnationOf(8), 1);
fx('gain.levelIsZero', gainOf(10, 10), 0);
fx('gain.thirtyAheadIsOne', gainOf(40, 10), 1);
fx('gain.fifteenAheadHalf', gainOf(25, 10), 0.5);
fx('qb.snapshotShut', qbCellOf('snapshot', 'snapShut', null), 'snapShut');
fx('qb.gcFired', qbCellOf('groundCandidate', null, 'gcGateFired'), 'gcGateFired');
fx('qb.through', qbCellOf('throughBall', null, null), 'throughBall');
fx('qb.shutAndPlayedIsTwoCells', [...SHUT_AND_PLAYED], ['snapShut', 'gcGateFired']);
const OPTS = [{ targetGid: 3, price: 0.10, executable: true }, { targetGid: 5, price: 0.20, executable: false },
  { targetGid: 7, price: 0.12, executable: true }];
fx('alt.higherPriced.fires', higherPricedAltOf(OPTS, 3, 0.10), true);
fx('alt.higherPriced.notExecutableIgnored', higherPricedAltOf(OPTS, 7, 0.12), false);
fx('alt.higherPriced.equalDoesNotFire', higherPricedAltOf([...OPTS, { targetGid: 9, price: 0.12, executable: true }], 7, 0.12), false);
fx('why.legacy', whyReadOf(`to P4 ${MD} lane 0.37 ${MD} open 0.81 ${MD} passBias 0.50`), { mate: 'P4', lane: '0.37' });
fx('why.kickoffIsNot', whyReadOf(KICKOFF_WHY), null);
fx('bins.price.edge', edgeBinOf(0.05, PRICE_EDGES), 1);
fx('bins.mult.floor', edgeBinOf(0.35, MULT_EDGES), 0);
/* ⭐ the seed arithmetic (the ceiling is on the SIM lattice) */
const simSeedOk = (s: number): boolean => s >= SIM_LATTICE_TOP || (s >= BLOCK_BASE && s < SIM_CEILING);
fx('seeds.ceilingWouldBeCaught', simSeedOk(SIM_CEILING), false);
fx('seeds.topOfBlockOk', simSeedOk(BLOCK_TOP), true);
fx('seeds.scratchIsNotOnTheSimLattice', simSeedOk(SCRATCH_BASE), true);
fx('seeds.belowBlockWouldBeCaught', simSeedOk(BLOCK_BASE - 1), false);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
banner(`OP-C1 fixtures ${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length}`);
if (!FIXTURES_OK) for (const f of FIXTURES.filter((q) => !q.ok)) banner(`  RED fixture ${f.name}: got ${JSON.stringify(f.got)}`);

/* ========================================================================== */
/* §7 THE ROW — OP-C0's schema (l.559–577) COPIED key for key, then the new keys */
/* ========================================================================== */
const OPC0_ROW_SCHEMA = {
  ticks: 1,
  relGround: 1, relGroundOther: 1, relLofted: 1,
  fbG: 4, fbL: 4, fbGKlass: 12,
  split: 3, splitTight: 3,
  owner: 8,
  ownerBySeat: 24,
  inLaneOpenBin: 10, inLaneBelowBar: 1, inLaneAlt: 1, inLaneAltGivenBelowBar: 1,
  inLanePresence: 4, inLanePerceivedInLane: 1, inLaneInLaneAtChoice: 1, inLaneKlass: 3,
  presenceBySplit: 12,
  allOpenBin: 10, allOpenBinOppFirst: 10, allBelowBar: 1, allBelowBarOppFirst: 1,
  allPresence: 4, allChoiceKnown: 1,
  seatAll: 3, seatOppFirst: 3,
  struckSeat: 3, struckMissBin: 18, struckWhere: 9,
  struckLeadSumCm: 3, struckLeadN: 3,
  arrivedStartBin: 6, arrivedActAtContact: 4, arrivedActAtRelease: 4, arrivedRunSumCm: 1,
  passesStat: 1, passesCompletedStat: 1, crowdSamples: 1, crashHits: 1,
  scopedPulls: 1, windupArms: 1, syncDeposits: 1, superseded: 1,
} as const;
const ROW_SCHEMA = {
  ...OPC0_ROW_SCHEMA,
  /* QA — the struck-through class, by seat */
  qaAlong: 3 * N_ALONG, qaLat: 3 * N_LAT, qa2D: 3 * N_ALONG * N_LAT,
  qaPasserDist: 3 * N_PD, qaPasserDistSumCm: 3, qaReading: 3 * 4,
  /* QB — the decider partition: in-lane class, all ground passes, and beside OP-C0's owners */
  qbInLane: 10, qbAll: 10, qbInLaneByOwner: 10 * 5,
  snapBandInLane: N_BANDS, snapPriceBinInLane: 5, snapPriceSumE6InLane: 1,
  snapHigherAltInLane: 1, snapHigherAltAll: 1, snapLegacySameInLane: 1,
  gcMultBinInLane: 5, gcMultSumE6InLane: 1,
  /* receipts of the reconstruction (all groundCandidate-seated ground passes) */
  gcWhyParsed: 1, gcWhyMateIsTarget: 1, gcWhyLaneAgrees: 1,
  windupAimChecked: 1, windupAimAgrees: 1, traceEntries: 1, traceDuplicateKeys: 1,
} as const;
type RowKey = keyof typeof ROW_SCHEMA;
const ROW_KEYS = Object.keys(ROW_SCHEMA) as RowKey[];
const OPC0_KEYS = Object.keys(OPC0_ROW_SCHEMA) as (keyof typeof OPC0_ROW_SCHEMA)[];
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
const opc0SubRow = (r: Row): Record<string, number[]> => Object.fromEntries(OPC0_KEYS.map((k) => [k, r[k]]));

const STAT_KEYS = ['passes', 'passesCompleted', 'shots', 'crosses', 'cutbacks', 'throughBalls',
  'longBalls', 'headersWon', 'clearances'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface ChoiceRec {
  step: number; passerGid: number; targetGid: number; px: number; py: number; ex: number; ey: number;
  oppPos: Map<number, { x: number; y: number }>;
  rawOpen: number; pricedLane: number; altOpp: boolean;
  scopedPull: boolean; snapOpp: Map<number, { x: number; y: number }>;
}
/** ⭐ THE DECIDER'S RECORD on the choice step (NEW). */
interface DecRec {
  decider: Decider; qb: QbCell;
  snapBand: number | null; snapPrice: number | null; snapHigherAlt: boolean; snapLegacySame: boolean;
  gcLane: number | null; gcGain: number | null; gcMult: number | null;
  whyParsed: boolean; whyMateIsTarget: boolean; whyLaneAgrees: boolean;
}
interface Windup { key: string; gid: number; targetGid: number; eX: number; eY: number;
  hasLead: boolean; leadM: number; choice: ChoiceRec; dec: DecRec }
interface Flight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number; klassI: number;
  lx: number; ly: number; eX: number; eY: number; hasLine: boolean; launchVx: number; launchVy: number;
  seat: Seat; leadM: number; choice: ChoiceRec | null;
  corr: Set<number>; corrT: Set<number>; oppAtRelease: Map<number, { x: number; y: number }>;
  actAtRelease: Map<number, string>;
  dec: DecRec | null; prx: number; pry: number;
}

/** OP-C0's choice read (l.615–639 ← LN-C1 l.829–867), COPIED. */
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

/** ⭐⭐⭐ THE DECIDER READ (NEW) — on the choice step: was there a FRESH decision (the passer's
 *  `action.scores` array is a new object this step), what the engine's own records say seated the
 *  target, and the decider's OWN price of it. `pre` holds every body's position at the START of
 *  the step — the positions every brain decides on (the decide loop runs before any executor or
 *  physics, §CODE MAP 1(e)); `preStale` the two teams' stale clocks at the same moment. */
const decisionReadOf = (
  m: Match, passer: Player, targetGid: number, klass: Klass, leadX: number, leadY: number,
  pre: Float64Array, preStale: [number, number], preScores: unknown[],
  traceByGid: Map<number, PassChoiceTraceEntry>,
): DecRec => {
  const scores = passer.action.scores;
  const fresh = preScores[passer.gid] !== scores;
  const top = fresh && scores.length > 0 ? scores[0] : null;
  const tr = traceByGid.get(passer.gid) ?? null;
  const decider = deciderOf({ fresh, klass, topAction: top === null ? null : top.action,
    kickoffWhy: top !== null && top.why === KICKOFF_WHY, traced: tr !== null,
    chosenGid: tr === null ? -1 : tr.chosenGid, targetGid });
  const rec: DecRec = { decider, qb: 'unread', snapBand: null, snapPrice: null, snapHigherAlt: false,
    snapLegacySame: false, gcLane: null, gcGain: null, gcMult: null,
    whyParsed: false, whyMateIsTarget: false, whyLaneAgrees: false };
  let snap: ReturnType<typeof snapCellOf> | null = null;
  let gc: ReturnType<typeof gcCellOf> | null = null;
  if (decider === 'snapshot' && tr !== null) {
    const opt = tr.options.find((o) => o.targetGid === tr.chosenGid);
    if (opt !== undefined) {
      rec.snapBand = opt.band;
      rec.snapPrice = opt.price;
      rec.snapHigherAlt = higherPricedAltOf(tr.options, tr.chosenGid, opt.price);
      rec.snapLegacySame = tr.legacyGid === tr.chosenGid;
      snap = snapCellOf(opt.infoClass, opt.band);
    }
  } else if (decider === 'groundCandidate') {
    const side = passer.side as Side;
    const team = m.teams[side];
    const pxp = pre[passer.gid * 2]; const pyp = pre[passer.gid * 2 + 1];
    const aim = { x: pre[targetGid * 2] + leadX, y: pre[targetGid * 2 + 1] + leadY };
    const opps = m.teams[1 - side].players.map((o) => ({ pos: { x: pre[o.gid * 2], y: pre[o.gid * 2 + 1] },
      sentOff: o.sentOff })) as unknown as Player[];
    const lane = Math.min(1, laneOpenness({ x: pxp, y: pyp }, aim, opps)
      * (passer.traits.includes('playmaker') ? PLAYMAKER_MUL : 1));
    const gain = gainOf(team.localX(aim.x), team.localX(pxp));
    rec.gcLane = lane; rec.gcGain = gain;
    gc = gcCellOf(lane, gain);
    if (gc === 'gcGateFired') rec.gcMult = gateMultOf(team.genome.riskTolerance, stagnationOf(preStale[side]));
    const why = top === null ? null : whyReadOf(top.why);
    if (why !== null) {
      rec.whyParsed = true;
      const mate = team.players.find((q) => q.name === why.mate);
      rec.whyMateIsTarget = mate !== undefined && mate.gid === targetGid;
      rec.whyLaneAgrees = lane.toFixed(2) === why.lane;
    }
  }
  rec.qb = qbCellOf(decider, snap, gc);
  return rec;
};

/* ========================================================================== */
/* §8 THE WALKER — OP-C0's (l.644–863) COPIED; the NEW lines are marked ⭐NEW    */
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
    traceChoice: boolean; passChoiceTrace: PassChoiceTraceEntry[];
  };
  const v = ARM_WORLD[arm];
  const genomeClean = m.teams.every((t) =>
    (t.info.genome as TacticalGenome & { offballMovementWeights?: unknown }).offballMovementWeights === undefined);
  /* gWorld, per walked match — read BEFORE the observer opens the trace door */
  const worldOk = (v === 18 && ifArmedVersion(m) === IF_WORLD_VERSION)
    && mm.inSnapshotLaw !== true && mm.edsPerceivedChoice === true && genomeClean
    && mm.traceChoice === false && m.forcedPassTarget === null;
  let curStep = 0;
  const pulls = new Map<number, { step: number; opp: Map<number, { x: number; y: number }> }>();
  if (observe) {
    /* OP-C0's OBSERVING WRAPPER (l.663–679), COPIED */
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
    /* ⭐NEW the E3 chooser's OWN trace door (pure observation; gLockstep + gRepro prove it inert) */
    mm.traceChoice = true;
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
  /* ⭐NEW the pre-step state every brain decides on */
  const pre = new Float64Array(players.length * 2);
  const preStale: [number, number] = [0, 0];
  const preScores: unknown[] = new Array(players.length).fill(null);
  let traceSeen = 0;
  const traceByGid = new Map<number, PassChoiceTraceEntry>();

  while (!m.finished) {
    curStep += 1;
    if (observe) {
      for (let i = 0; i < players.length; i++) {
        pre[i * 2] = players[i].pos.x; pre[i * 2 + 1] = players[i].pos.y; preScores[i] = players[i].action.scores;
      }
      preStale[0] = m.teams[0].staleTime; preStale[1] = m.teams[1].staleTime;
    }
    m.step(DT);
    row.ticks[0] += 1;
    if (!observe) continue;
    /* ⭐NEW this step's E3 trace entries, by passer */
    traceByGid.clear();
    const trace = mm.passChoiceTrace;
    for (let i = traceSeen; i < trace.length; i++) {
      if (traceByGid.has(trace[i].passerGid)) row.traceDuplicateKeys[0] += 1; // LN-C3's stored debt (LN-C2 §CORR 7)
      traceByGid.set(trace[i].passerGid, trace[i]); row.traceEntries[0] += 1;
    }
    traceSeen = trace.length;
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
    const dx = mm.dxStrikeAim;
    const dxNew = dx !== null && dx !== lastDx ? dx : null;
    lastDx = dx;
    if (dxNew !== null) row.syncDeposits[0] += 1;

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
      /* ⭐NEW the arm step IS the choice step: the decider read, and the receipt that the record's
       *  arm-time aim is the target's PRE-STEP position (the positions the brain decided on) */
      row.windupAimChecked[0] += 1;
      if (rec.aim.x === pre[rec.targetGid * 2] && rec.aim.y === pre[rec.targetGid * 2 + 1]) row.windupAimAgrees[0] += 1;
      const dec = decisionReadOf(m, players[rec.gid], rec.targetGid, 'shortPass', lead?.x ?? 0, lead?.y ?? 0,
        pre, preStale, preScores, traceByGid);
      wu = { key: key as string, gid: rec.gid, targetGid: rec.targetGid, eX, eY, hasLead,
        leadM: hasLead ? Math.hypot((lead as { x: number }).x, (lead as { y: number }).y) : 0,
        choice: choiceReadOf(m, players[rec.gid], rec.targetGid, eX, eY, curStep, pulls.get(rec.gid)), dec };
    }

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
      if (targetGid === null) continue;
      if (flight !== null) {
        row.superseded[0] += 1;
        bookFlight(row, flight, 'none', null, ball.pos.x, ball.pos.y, prevAct);
        flight = null;
      }
      if (!ground) {
        row.relLofted[0] += 1;
        flight = {
          passerGid: rel.gid, passerSide: players[rel.gid].side as Side, targetGid, releaseTick: tick,
          klassI: -1, lx: 0, ly: 0, eX: 0, eY: 0, hasLine: false, launchVx: 0, launchVy: 0,
          seat: 'plain', leadM: 0, choice: null, corr: new Set(), corrT: new Set(),
          oppAtRelease: new Map(), actAtRelease: new Map(), dec: null, prx: 0, pry: 0,
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
      let syncLeadX = 0; let syncLeadY = 0;
      if (viaWindup) { eX = (endedWindup as Windup).eX; eY = (endedWindup as Windup).eY; leadM = (endedWindup as Windup).leadM; }
      else if (syncDeposit) {
        const lead = (dxNew as { lead: { x: number; y: number } }).lead;
        eX = tgt.pos.x + lead.x; eY = tgt.pos.y + lead.y; leadM = Math.hypot(lead.x, lead.y);
        syncLeadX = lead.x; syncLeadY = lead.y;
      } else { eX = tgt.pos.x; eY = tgt.pos.y; }
      const choice = viaWindup ? (endedWindup as Windup).choice
        : choiceReadOf(m, players[rel.gid], targetGid, eX, eY, curStep, pulls.get(rel.gid));
      /* ⭐NEW the decider: the wind-up's arm-step record, or this (release = choice) step's read */
      const dec = viaWindup ? (endedWindup as Windup).dec
        : decisionReadOf(m, players[rel.gid], targetGid, rel.klass, syncLeadX, syncLeadY,
          pre, preStale, preScores, traceByGid);
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
        actAtRelease, dec, prx: players[rel.gid].pos.x, pry: players[rel.gid].pos.y,
      };
    }

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

/** ⭐⭐⭐ BOOK ONE FLIGHT — OP-C0's `bookFlight` (l.866–935) COPIED; the NEW QA / QB booking runs
 *  AFTER it and writes only the new keys. */
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

  /* ---- ⭐NEW QB over ALL ground passes, and the reconstruction's receipts ---- */
  const dec = f.dec;
  const qi = QB.indexOf(dec === null ? 'unread' : dec.qb);
  row.qbAll[qi] += 1;
  if (dec !== null && dec.decider === 'snapshot' && dec.snapHigherAlt) row.snapHigherAltAll[0] += 1;
  if (dec !== null && dec.decider === 'groundCandidate' && dec.whyParsed) {
    row.gcWhyParsed[0] += 1;
    if (dec.whyMateIsTarget) row.gcWhyMateIsTarget[0] += 1;
    if (dec.whyLaneAgrees) row.gcWhyLaneAgrees[0] += 1;
  }
  if (!isOpp) return;
  const b = body as Player;
  /* ---- ⭐NEW QB — the in-lane class ---- */
  if (split === 'corridorAtRelease') {
    row.qbInLane[qi] += 1;
    row.qbInLaneByOwner[qi * 5 + IN_LANE_OWNERS.indexOf(owner)] += 1;
    if (dec !== null && dec.decider === 'snapshot' && dec.snapBand !== null && dec.snapPrice !== null) {
      row.snapBandInLane[dec.snapBand + 1] += 1;
      row.snapPriceBinInLane[edgeBinOf(dec.snapPrice, PRICE_EDGES)] += 1;
      row.snapPriceSumE6InLane[0] += Math.round(dec.snapPrice * 1e6);
      if (dec.snapHigherAlt) row.snapHigherAltInLane[0] += 1;
      if (dec.snapLegacySame) row.snapLegacySameInLane[0] += 1;
    }
    if (dec !== null && dec.qb === 'gcGateFired' && dec.gcMult !== null) {
      row.gcMultBinInLane[edgeBinOf(dec.gcMult, MULT_EDGES)] += 1;
      row.gcMultSumE6InLane[0] += Math.round(dec.gcMult * 1e6);
    }
  }
  /* ---- ⭐NEW QA — the struck-through class, by seat ---- */
  if (split === 'struckThrough') {
    const g = lineGeomOf(f.lx, f.ly, f.eX, f.eY, b.pos.x, b.pos.y);
    const at = f.oppAtRelease.get(b.gid) ?? { x: b.pos.x, y: b.pos.y };
    const gR = lineGeomOf(f.lx, f.ly, f.eX, f.eY, at.x, at.y);
    const ai = edgeBinOf(g.t, ALONG_EDGES);
    const li = edgeBinOf(Math.abs(g.lat), LAT_EDGES);
    row.qaAlong[si * N_ALONG + ai] += 1;
    row.qaLat[si * N_LAT + li] += 1;
    row.qa2D[si * N_ALONG * N_LAT + ai * N_LAT + li] += 1;
    const pd = Math.hypot(at.x - f.prx, at.y - f.pry);
    row.qaPasserDist[si * N_PD + edgeBinOf(pd, PASSER_DIST_EDGES)] += 1;
    row.qaPasserDistSumCm[si] += Math.round(pd * 100);
    row.qaReading[si * 4 + READINGS.indexOf(readingOf(g, movedOf(gR.lat, g.lat)))] += 1;
  }
};

/* ========================================================================== */
/* §9 THE FACES — OP-C0's (l.940–999, W13 dropped) COPIED, then the new ones    */
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
const IN_LANE_CHOICE = cells('inLaneOpenBin', range(10));
face('q3.inLane.pricedBelowBarShare', cells('inLaneBelowBar', [0]), IN_LANE_CHOICE);
face('q3.inLane.altGivenBelowBar', cells('inLaneAltGivenBelowBar', [0]), cells('inLaneBelowBar', [0]));
PRESENCES.forEach((p, i) => face(`q3.inLane.presence.${p}`, cells('inLanePresence', [i]), cells('inLanePresence', range(4))));
GROUND_KLASSES.forEach((k, i) => face(`q3.inLane.klass.${k}`, cells('inLaneKlass', [i]), cells('inLaneKlass', range(3))));
SEATS.forEach((s, i) => face(`q4.seatAll.${s}`, cells('seatAll', [i]), cells('seatAll', range(3))));
SEATS.forEach((s, i) => face(`q4.struck.seat.${s}`, cells('struckSeat', [i]), cells('struckSeat', range(3))));
SEATS.forEach((s, si) => WHERE.forEach((w, wi) => face(`q4.struck.${s}.where.${w}`, cells('struckWhere', [si * 3 + wi]),
  cells('struckWhere', range(3).map((i) => si * 3 + i)))));
WHERE.forEach((w, wi) => face(`q4.struck.all.where.${w}`, cells('struckWhere', [wi, 3 + wi, 6 + wi]),
  cells('struckWhere', range(9))));
face('beside.groundPassesPerMatch', cells('relGround', [0]), []);
face('beside.scopedPullsPerMatch', cells('scopedPulls', [0]), []);
face('beside.traceEntriesPerMatch', cells('traceEntries', [0]), []);
face('receipt.traceDuplicateKeysPerMatch', cells('traceDuplicateKeys', [0]), []);
/* ⭐ QA */
const QA_ALL = (k: 'qaAlong' | 'qaLat' | 'qaPasserDist' | 'qaReading', n: number, b: number): string[] =>
  cells(k, [0, 1, 2].map((s) => s * n + b));
const QA_DEN = (k: 'qaAlong' | 'qaLat' | 'qaPasserDist' | 'qaReading', n: number): string[] => cells(k, range(3 * n));
for (let b = 0; b < N_ALONG; b++) face(`qa.along.${b}`, QA_ALL('qaAlong', N_ALONG, b), QA_DEN('qaAlong', N_ALONG));
for (let b = 0; b < N_LAT; b++) face(`qa.lat.${b}`, QA_ALL('qaLat', N_LAT, b), QA_DEN('qaLat', N_LAT));
for (let b = 0; b < N_PD; b++) face(`qa.passerDist.${b}`, QA_ALL('qaPasserDist', N_PD, b), QA_DEN('qaPasserDist', N_PD));
face('qa.passerDist.meanCm', cells('qaPasserDistSumCm', range(3)), QA_DEN('qaPasserDist', N_PD));
READINGS.forEach((r, ri) => face(`qa.reading.${r}`, QA_ALL('qaReading', 4, ri), QA_DEN('qaReading', 4)));
for (let a = 0; a < N_ALONG; a++) {
  for (let l = 0; l < N_LAT; l++) {
    face(`qa.2d.${a}.${l}`, cells('qa2D', [0, 1, 2].map((s) => s * N_ALONG * N_LAT + a * N_LAT + l)),
      cells('qa2D', range(3 * N_ALONG * N_LAT)));
  }
}
SEATS.forEach((s, si) => {
  READINGS.forEach((r, ri) => face(`qa.${s}.reading.${r}`, cells('qaReading', [si * 4 + ri]),
    cells('qaReading', range(4).map((i) => si * 4 + i))));
  for (let b = 0; b < N_ALONG; b++) face(`qa.${s}.along.${b}`, cells('qaAlong', [si * N_ALONG + b]),
    cells('qaAlong', range(N_ALONG).map((i) => si * N_ALONG + i)));
  for (let b = 0; b < N_LAT; b++) face(`qa.${s}.lat.${b}`, cells('qaLat', [si * N_LAT + b]),
    cells('qaLat', range(N_LAT).map((i) => si * N_LAT + i)));
  face(`qa.${s}.passerDist.meanCm`, cells('qaPasserDistSumCm', [si]),
    cells('qaPasserDist', range(N_PD).map((i) => si * N_PD + i)));
});
/* ⭐ QB */
const QB_IN = cells('qbInLane', range(10));
const QB_ALL = cells('qbAll', range(10));
QB.forEach((q, i) => face(`qb.inLane.${q}`, cells('qbInLane', [i]), QB_IN));
QB.forEach((q, i) => face(`qb.all.${q}`, cells('qbAll', [i]), QB_ALL));
face('qb.inLane.pricedShutAndPlayed', cells('qbInLane', SHUT_AND_PLAYED.map((q) => QB.indexOf(q))), QB_IN);
face('qb.all.pricedShutAndPlayed', cells('qbAll', SHUT_AND_PLAYED.map((q) => QB.indexOf(q))), QB_ALL);
const SNAP_I = [0, 1, 2]; const GC_I = [3, 4, 5];
face('qb.inLane.decider.snapshot', cells('qbInLane', SNAP_I), QB_IN);
face('qb.inLane.decider.groundCandidate', cells('qbInLane', GC_I), QB_IN);
face('qb.inLane.snapShutGivenSnapshot', cells('qbInLane', [1]), cells('qbInLane', SNAP_I));
face('qb.inLane.gateFiredGivenGroundCandidate', cells('qbInLane', [5]), cells('qbInLane', GC_I));
face('qb.all.decider.snapshot', cells('qbAll', SNAP_I), QB_ALL);
face('qb.all.decider.groundCandidate', cells('qbAll', GC_I), QB_ALL);
IN_LANE_OWNERS.forEach((o, oi) => QB.forEach((q, qi) => face(`qb.inLane.byOwner.${o}.${q}`,
  cells('qbInLaneByOwner', [qi * 5 + oi]), cells('qbInLaneByOwner', range(10).map((i) => i * 5 + oi)))));
IN_LANE_OWNERS.forEach((o, oi) => face(`qb.inLane.byOwner.${o}.pricedShutAndPlayed`,
  cells('qbInLaneByOwner', SHUT_AND_PLAYED.map((q) => QB.indexOf(q) * 5 + oi)),
  cells('qbInLaneByOwner', range(10).map((i) => i * 5 + oi))));
const SNAP_BAND_DEN = cells('snapBandInLane', range(N_BANDS));
for (let b = 0; b < N_BANDS; b++) face(`snap.inLane.band.${b - 1}`, cells('snapBandInLane', [b]), SNAP_BAND_DEN);
for (let b = 0; b < 5; b++) face(`snap.inLane.priceBin.${b}`, cells('snapPriceBinInLane', [b]), SNAP_BAND_DEN);
face('snap.inLane.meanPriceE6', cells('snapPriceSumE6InLane', [0]), SNAP_BAND_DEN);
face('snap.inLane.higherPricedAlt', cells('snapHigherAltInLane', [0]), SNAP_BAND_DEN);
face('snap.inLane.legacySame', cells('snapLegacySameInLane', [0]), SNAP_BAND_DEN);
face('snap.all.higherPricedAlt', cells('snapHigherAltAll', [0]), cells('qbAll', SNAP_I));
for (let b = 0; b < 5; b++) face(`gc.inLane.gateFired.multBin.${b}`, cells('gcMultBinInLane', [b]), cells('gcMultBinInLane', range(5)));
face('gc.inLane.gateFired.meanMultE6', cells('gcMultSumE6InLane', [0]), cells('gcMultBinInLane', range(5)));
face('gc.receipt.whyParsedShare', cells('gcWhyParsed', [0]), cells('qbAll', GC_I));
face('gc.receipt.whyMateIsTargetShare', cells('gcWhyMateIsTarget', [0]), cells('gcWhyParsed', [0]));
face('gc.receipt.whyLaneAgreesShare', cells('gcWhyLaneAgrees', [0]), cells('gcWhyParsed', [0]));
face('receipt.windupAimAgreesShare', cells('windupAimAgrees', [0]), cells('windupAimChecked', [0]));
const FACE_NAMES = FACE_DEFS.map((f) => f.name);
const FACE_IDX = FACE_DEFS.map((f) => ({ num: f.num.map((k) => FLAT_INDEX[k]), den: f.den.map((k) => FLAT_INDEX[k]) }));
const FACE_DEFS_OK = FACE_IDX.every((f) => f.num.every((i) => i !== undefined) && f.den.every((i) => i !== undefined))
  && new Set(FACE_NAMES).size === FACE_NAMES.length;

interface FaceVal { num: number; den: number; value: number | null; lo?: number | null; hi?: number | null }
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
/** mulberry32 (OP-C0 l.1019–1024), COPIED — the resample RNG, seeded from the block base. */
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
const bootstrap = (flatsByArm: Record<Arm, number[][]>, nSeeds: number) => {
  const rnd = mulberry(BLOCK_BASE);
  const lv: Record<Arm, number[][]> = { 'W18-E': [], 'W18-D': [] };
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

/* ---- gRepro FIRST, before any census seed (#428 item 3(i)) ---- */
banner('OP-C1 gRepro — OP-C0\'s stored W18 per-seed cells on its own consumed band 12,561,000–011');
const opc0 = JSON.parse(readFileSync(OPC0_ARTIFACT, 'utf8')) as {
  perSeedCells: ({ seed: number } & Record<string, { signature: string; row: Record<string, number[]> }>)[];
  stage: { instrumentSha256: string }; bodySha256: string;
};
const OPC0_BODY_SHA = opc0.bodySha256;
const storedOpc0 = new Map(opc0.perSeedCells.map((r) => [r.seed, r] as const));
const reproRows = REPRO_SEEDS.flatMap((seed) => ARMS.map((a) => {
  const w = walkMatch(buildMatch(seed, a), a, true);
  const st = storedOpc0.get(seed)?.[a];
  const sigOk = st !== undefined && w.signature === st.signature;
  const mine = opc0SubRow(w.row);
  const keysOk = st !== undefined && JSON.stringify(Object.keys(st.row)) === JSON.stringify(OPC0_KEYS);
  const rowOk = st !== undefined && keysOk && OPC0_KEYS.every((k) => JSON.stringify(mine[k]) === JSON.stringify(st.row[k]));
  return { seed, arm: a, signatureOk: sigOk, opc0RowOk: rowOk, owner: w.row.owner,
    storedOwner: st?.row.owner ?? null, ok: sigOk && rowOk };
}));
const reproOk = reproRows.length === 24 && reproRows.every((r) => r.ok);
gate('gRepro', reproOk,
  `${reproRows.filter((r) => r.ok).length}/${reproRows.length} (12 seeds × W18-E/W18-D): OP-C0's stored whole-match `
  + `signature AND its whole ${OPC0_KEYS.length}-key per-seed row (every owner cell included) reproduced EXACTLY, with this `
  + 'instrument\'s observers (snapshot wrapper + E3 trace door) open');
if (!reproOk && MODE === 'full') banner('OP-C1 STOP — gRepro is RED: no census seed is walked (the RED-routing idiom).');

/* ---- the world pin, lockstep and X-DET on scratch ---- */
const worldPin = ARMS.map((a) => {
  const m = buildMatch(WORLD_PIN_SEED, a);
  const q = m as unknown as Record<string, unknown>;
  return { arm: a, seed: WORLD_PIN_SEED, ifArmedVersion: ifArmedVersion(m),
    inSnapshotLaw: q.inSnapshotLaw === true, edsPerceivedChoice: q.edsPerceivedChoice === true,
    edsPerceivedDefence: q.edsPerceivedDefence === true, edsValueAxis: q.edsValueAxis === true,
    dxWindupAim: q.dxWindupAim === true, dlcDeliveryChoice: q.dlcDeliveryChoice === true,
    o1PassWindup: q.o1PassWindup === true, lnOwnLanePrice: q.lnOwnLanePrice === true,
    pwWeightChooser: q.pwWeightChooser === true, ptpPassLead: q.ptpPassLead === true,
    traceChoiceAtConstruction: q.traceChoice === true, forcedPassTargetNull: m.forcedPassTarget === null };
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
      xdetRows.push({ arm: a, seed, ok: o1.signature === o2.signature && JSON.stringify(o1.row) === JSON.stringify(o2.row) });
    }
  }
}
gate('gLockstep', reproOk && lockRows.length === 4 && lockRows.every((r) => r.ok),
  `${lockRows.filter((r) => r.ok).length}/${lockRows.length} arm × scratch walks: the observers (the snapshot wrapper AND `
  + 'the E3 trace door) leave the whole-match signature byte-identical (INERT, proven; gRepro proves it again on 24 walks)');
gate('gDeterminism', reproOk && xdetRows.length === 4 && xdetRows.every((r) => r.ok),
  `X-DET: ${xdetRows.filter((r) => r.ok).length}/${xdetRows.length} observed pairs identical in signature AND row bytes`);

/* ---- THE BATTERY ---- */
const perSeed: { seed: number; arms: Record<Arm, { signature: string; worldOk: boolean; wallMs: number; row: Row }> }[] = [];
const receiptRows: Record<string, { signature: string; worldOk: boolean }> = {};
if (reproOk) {
  banner(`OP-C1 battery — ${BATTERY_SEEDS.length} seeds × ${ARMS.length} arms (mode ${MODE})`);
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

/* ---- X-FP-PROD, in process (OP-C0 l.1146–1155, COPIED: seed 1337, 2 seasons) ---- */
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

/* ---- X-SRC-ZERO (#428 item 3(v)) ---- */
const srcDiff = sh('git diff 41c3a17 -- src/ tests/');
const srcPorcelain = sh('git status --porcelain -- src tests');
const srcSince170 = sh('git diff 170a5fa 41c3a17 -- src/');
gate('gSrcUntouched', srcDiff.length === 0 && srcPorcelain.length === 0 && srcSince170.length === 0,
  `git diff 41c3a17 -- src/ tests/ = ${srcDiff.length} bytes; git status --porcelain -- src tests = ${srcPorcelain.length} bytes; `
  + `git diff 170a5fa 41c3a17 -- src/ = ${srcSince170.length} bytes (src unchanged since OP-C0's anchor)`);

/* ---- the world gate ---- */
const allWalkWorldOk = perSeed.every((s) => ARMS.every((a) => s.arms[a].worldOk))
  && Object.values(receiptRows).every((r) => r.worldOk);
const pinOk = worldPin.every((w) => w.ifArmedVersion === 18 && !w.inSnapshotLaw && w.edsPerceivedChoice
  && w.edsPerceivedDefence && w.edsValueAxis && w.dxWindupAim && w.dlcDeliveryChoice && w.o1PassWindup
  && w.lnOwnLanePrice && !w.pwWeightChooser && !w.ptpPassLead && !w.traceChoiceAtConstruction && w.forcedPassTargetNull);
gate('gWorld', reproOk && allWalkWorldOk && pinOk && DOSE_BYTES_OK,
  'every walked match on world 18 (ifArmedVersion 18), inSnapshotLaw ABSENT, edsPerceivedChoice ON, info.genome clean, '
  + `the trace door SHUT at construction and forcedPassTarget null; the constructed pin at ${WORLD_PIN_SEED}: E3 chooser, `
  + 'value axis, perceived defence, DX, DLC, wind-up and the own-lane price ON, PW and PTP ABSENT; dose BYTES pinned');

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
  && REPRO_SEEDS.every((s) => s >= 12_561_000 && s <= 12_561_999)
  && allSim.every((s) => s < SIM_CEILING) && STATS.consumed === 0,
  `battery inside ${BLOCK_BASE}–${BLOCK_TOP}; all ${CONSUMED_BLOCKS.length} consumed blocks end below the base; `
  + `the re-walks lie inside OP-C0's own block; no SIM seed ≥ ${SIM_CEILING}; ZERO stats`);
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
  + `the gate (gain > ${GAIN_GATE}, lane < ${BAR}), its multiplier (${GATE_BASE} + rt·${GATE_RISK}; ·stag·${MULT_STAG}), `
  + `the stagnation (−${STAG_OFF})/${STAG_DIV}, the gain (+${GAIN_OFF})/${GAIN_DIV} and the playmaker ×${PLAYMAKER_MUL} PARSED from their anchored lines`);
gate('gPredicateFixtures', FIXTURES_OK,
  `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} fixtures — OP-C0's copies re-run; the two distances and their `
  + 'frozen bins, the move, the three readings + leftover (each firing and its neighbours not), the decider identity, the '
  + 'shut bands derived from the table, the gate and its multiplier, the higher-priced-alternative test, the why read, the seed ceiling');
const LEDGER_READ = {
  record: ['ball.lastTouch (first body)', 'match.pendingPass (release, target)', 'team stats deltas (klass)',
    'match.pendingPassWindup (arm = choice step; aim + aimLead = priced aim)',
    'match.dxStrikeAim (an UNCONSUMED deposit = the synchronous led strike)',
    'match.perceivedSnapshot return value (the E3 chooser\'s own scoped pull, copied by the observing wrapper)',
    'player.action.type (the interceptor\'s read path)', 'team stats passes/passesCompleted',
    'match.passChoiceTrace (the E3 chooser\'s OWN record: chosenGid, legacyGid, reception, options[].price/band/executable/infoClass)',
    'player.action.scores[0] (the decision\'s OWN top candidate: its action, and its why — the kick-off play-back, or bestMate\'s name and bestLane)'],
  declared: ['the corridor geometry (BN-C0\'s reconstruction, both widths)',
    'the choice-step openness and the alternative menu (LN-C1\'s reconstruction, opponent side, TRUTH positions)',
    'the launch-miss angle and the where-cell (geometry against the priced segment)',
    'the synchronous priced aim = the target\'s post-step position + the deposit (one tick)',
    'the crowding heuristic (PT-C0)',
    'QA: the contact\'s along / lateral distances, the passer distance, the move and the three readings (geometry against the priced line)',
    'QB: groundCandidate\'s lane / gain / gate / multiplier recomputed at the PRE-STEP positions (a closure local; the why-lane agreement is its receipt)',
    'QB: the snapshot chooser\'s "shut" = a READ band whose calibrated reception is < 0.5 (a DECLARED coin on the shipped table)'],
};
gate('gLedgerRead', LEDGER_READ.record.length === 10 && LEDGER_READ.declared.length === 8,
  `${LEDGER_READ.record.length} faces read an ENGINE RECORD and ${LEDGER_READ.declared.length} are DECLARED reconstructions (stored)`);

/* ---- per-arm sums, faces, the partition ---- */
const flatsByArm = {} as Record<Arm, number[][]>;
for (const a of ARMS) flatsByArm[a] = perSeed.map((s) => flatten(s.arms[a].row));
const sums = {} as Record<Arm, number[]>;
for (const a of ARMS) sums[a] = sumRows(flatsByArm[a]);
const total = (r: Row, k: RowKey): number => r[k].reduce((x, y) => x + y, 0);
const rowPartitionOk = (r: Row): { opc0: boolean; qa: boolean; qb: boolean } => {
  const ground = r.relGround[0];
  const owners = total(r, 'owner');
  const fb = total(r, 'fbG');
  const opp = r.fbG[3];
  const opc0 = ground === owners && ground === fb && opp === total(r, 'split') && opp === owners - r.owner[0];
  const struck = r.split[2];
  const whereSum = total(r, 'struckWhere');
  const qa = struck === total(r, 'qaReading') && struck === total(r, 'qa2D') && struck === total(r, 'qaAlong')
    && struck === total(r, 'qaLat') && struck === total(r, 'qaPasserDist') && struck === whereSum
    && [0, 1, 2].every((s) => r.struckSeat[s] === r.qaReading.slice(s * 4, s * 4 + 4).reduce((x, y) => x + y, 0));
  const inLane = r.split[0];
  const qb = inLane === total(r, 'qbInLane') && inLane === total(r, 'qbInLaneByOwner') && ground === total(r, 'qbAll')
    && r.qbInLane[0] + r.qbInLane[1] + r.qbInLane[2] === total(r, 'snapBandInLane')
    && r.qbInLane[5] === total(r, 'gcMultBinInLane');
  return { opc0, qa, qb };
};
const partitionRows = ARMS.map((a) => {
  const per = perSeed.map((s) => rowPartitionOk(s.arms[a].row));
  const ground = sums[a][FLAT_INDEX['relGround.0']];
  const owners = OWNERS.map((_, i) => sums[a][FLAT_INDEX[`owner.${i}`]]);
  return { arm: a, population: ground, ownerSum: owners.reduce((x, y) => x + y, 0),
    struckThrough: sums[a][FLAT_INDEX['split.2']], inLane: sums[a][FLAT_INDEX['split.0']],
    qaReadingSum: READINGS.reduce((x, _, ri) => x + [0, 1, 2].reduce((y, s) => y + sums[a][FLAT_INDEX[`qaReading.${s * 4 + ri}`]], 0), 0),
    qbInLaneSum: range(10).reduce((x, i) => x + sums[a][FLAT_INDEX[`qbInLane.${i}`]], 0),
    qbAllSum: range(10).reduce((x, i) => x + sums[a][FLAT_INDEX[`qbAll.${i}`]], 0),
    residueOpc0: owners[6] + owners[7],
    perSeedOpc0: per.every((p) => p.opc0), perSeedQa: per.every((p) => p.qa), perSeedQb: per.every((p) => p.qb),
    ok: per.length > 0 && per.every((p) => p.opc0 && p.qa && p.qb) };
});
gate('gPartition', reproOk && nSeeds > 0 && partitionRows.every((r) => r.ok),
  partitionRows.map((r) => `${r.arm}: OP-C0 owners ${r.ownerSum} = ${r.population}; QA ${r.qaReadingSum} = struck ${r.struckThrough}; `
    + `QB in-lane ${r.qbInLaneSum} = ${r.inLane}; QB all ${r.qbAllSum} = ${r.population}`).join(' · ')
  + ' — every pass in exactly one cell of each partition, per arm and per seed');
const facesByArm = {} as Record<Arm, Record<string, FaceVal>>;
for (const a of ARMS) {
  facesByArm[a] = {};
  FACE_DEFS.forEach((f, fi) => { const v = faceOf(sums[a], fi, nSeeds); facesByArm[a][f.name] = { num: v.num, den: v.den, value: r6(v.value) }; });
}
const deltas: Record<string, { value: number | null; lo: number | null; hi: number | null }> = {};
if (nSeeds > 0) {
  banner('OP-C1 bootstrap …');
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
const live = (a: Arm, k: string): number => sums[a][FLAT_INDEX[k]] ?? 0;
const nonVacuousOk = reproOk && nSeeds > 0 && ARMS.every((a) =>
  live(a, 'fbG.3') > 0 && live(a, 'split.0') > 0 && live(a, 'split.2') > 0
  && live(a, 'scopedPulls.0') > 0 && live(a, 'windupArms.0') > 0 && live(a, 'traceEntries.0') > 0
  && live(a, 'qbInLane.0') + live(a, 'qbInLane.1') + live(a, 'qbInLane.2') > 0
  && live(a, 'qbInLane.3') + live(a, 'qbInLane.4') + live(a, 'qbInLane.5') > 0
  && live(a, 'gcWhyParsed.0') > 0);
const emptiness: Record<string, string[]> = {};
for (const a of ARMS) emptiness[a] = FACE_DEFS.filter((f) => (facesByArm[a][f.name].den ?? 0) === 0).map((f) => f.name);
gate('gClassesNonVacuous', nonVacuousOk,
  'on both arms: opponent-first passes, the in-lane and struck-through classes, the scoped pulls, the wind-up arms, the E3 '
  + 'trace entries, snapshot-seated AND groundCandidate-seated in-lane passes and the why receipt are LIVE; every face with an '
  + 'EMPTY denominator is ENUMERATED in `emptiness` (never imputed, never gated)');
const biteRows = perSeed.map((s) => ({ seed: s.seed,
  rowsDiffer: JSON.stringify(s.arms['W18-D'].row) !== JSON.stringify(s.arms['W18-E'].row),
  signaturesCoincide: s.arms['W18-D'].signature === s.arms['W18-E'].signature }));
gate('gBite', reproOk && nSeeds > 0 && biteRows.every((r) => r.rowsDiffer),
  `the #414 ROW form: ${biteRows.filter((r) => r.rowsDiffer).length}/${biteRows.length} seeds' W18-D and W18-E rows `
  + `differ in ≥ 1 of ${FLAT_LEN} stored cells; PRINTED FACE (gates nothing): the full-time signature coincides on `
  + `${biteRows.filter((r) => r.signaturesCoincide).length}. ⚠ LIVENESS only`);

/* ---- sizing (the house form, #415; OP-C0 l.1280–1296) ---- */
const Z975 = 1.959963984540054; const Z80 = 0.8416212335729143;
const TARGET_HW = 0.05;
const sizedFace = 'qb.inLane.pricedShutAndPlayed';
const sizedArm: Arm = 'W18-D';
/** ⭐ THE SMOKE OF RECORD's half-width, TRANSCRIBED from the disclosed 12-seed smoke
 *  (§DEV-PREFLIGHT) before the freeze; every other sizing column is DERIVED below. */
const HW_SMOKE_RECORD: number | null = 0.07447000000000004;
const hwThisRun = nSeeds > 0 && facesByArm[sizedArm][sizedFace].lo !== null && facesByArm[sizedArm][sizedFace].hi !== null
  ? ((facesByArm[sizedArm][sizedFace].hi as number) - (facesByArm[sizedArm][sizedFace].lo as number)) / 2 : null;
const hwSmoke = MODE === 'smoke' ? hwThisRun : HW_SMOKE_RECORD;
const seSmoke = hwSmoke === null ? null : hwSmoke / Z975;
const seNeeded = TARGET_HW / (Z975 + Z80);
const nRequired = seSmoke === null ? null : Math.ceil(SMOKE_N * (seSmoke / seNeeded) ** 2);
const sizing = { face: `${sizedFace}@${sizedArm}`, targetHalfWidth: TARGET_HW, nSmoke: SMOKE_N, hwSmoke,
  seSmoke, seNeeded, nRequired, affordance: N_FROZEN, realisedHalfWidthThisRun: hwThisRun,
  whichNWasTaken: 'THE AFFORDANCE (999) — the #414 §CORR 8 floor reading: the QA readings by seat and the QB cells by '
    + 'owner are RARE classes sized by nothing but volume' };

/* ---- assemble the body (allowlist schema), write, re-read, gFaces + gHashOrder + gStage ---- */
const perSeedCells = perSeed.map((s) => {
  const o: Record<string, unknown> = { seed: s.seed };
  for (const a of ARMS) o[a] = { signature: s.arms[a].signature, worldOk: s.arms[a].worldOk, row: s.arms[a].row };
  return o;
});
const BODY_KEYS = ['stage', 'seeds', 'stats', 'arms', 'rowSchema', 'faceDefs', 'faces', 'deltasW18',
  'partition', 'emptiness', 'ownership', 'qa', 'qb', 'codeMap', 'anchors', 'parsed', 'fixtures', 'ledgerRead',
  'repro', 'worldPin', 'lockstep', 'determinism', 'bite', 'fingerprintProd', 'sizing', 'perf',
  'receipt', 'gates', 'allGreen', 'perSeedCells'] as const;
const val = (a: Arm, f: string): number | null => facesByArm[a]?.[f]?.value ?? null;
const ownership = Object.fromEntries(ARMS.map((a) => [a, Object.fromEntries(OWNERS.map((o, i) => [o, {
  count: sums[a][FLAT_INDEX[`owner.${i}`]], share: val(a, `owner.${o}`),
  shareOfOpponentFirst: i === 0 ? null : val(a, `ownerOfOpponentFirst.${o}`) }]))]));
const qa = Object.fromEntries(ARMS.map((a) => [a, {
  struckThrough: sums[a][FLAT_INDEX['split.2']],
  reading: Object.fromEntries(READINGS.map((r) => [r, val(a, `qa.reading.${r}`)])),
  readingBySeat: Object.fromEntries(SEATS.map((s) => [s, Object.fromEntries(READINGS.map((r) => [r, val(a, `qa.${s}.reading.${r}`)]))])),
  along: range(N_ALONG).map((b) => val(a, `qa.along.${b}`)), lat: range(N_LAT).map((b) => val(a, `qa.lat.${b}`)),
  passerDist: range(N_PD).map((b) => val(a, `qa.passerDist.${b}`)), passerDistMeanCm: val(a, 'qa.passerDist.meanCm'),
}]));
const qb = Object.fromEntries(ARMS.map((a) => [a, {
  inLane: sums[a][FLAT_INDEX['split.0']],
  cells: Object.fromEntries(QB.map((q) => [q, val(a, `qb.inLane.${q}`)])),
  pricedShutAndPlayed: val(a, 'qb.inLane.pricedShutAndPlayed'),
  allGround: Object.fromEntries(QB.map((q) => [q, val(a, `qb.all.${q}`)])),
  snapHigherPricedAlt: val(a, 'snap.inLane.higherPricedAlt'), gcMeanMultE6: val(a, 'gc.inLane.gateFired.meanMultE6'),
}]));
const codeMap = {
  seats: { snapshot: 'EDS E3 `choosePerceivedPassTarget` (its trace entry chosenGid ≥ 0 = the released target)',
    groundCandidate: 'the legacy truth argmax `bestMate` (a fresh Pass decision the E3 chooser did not re-seat)',
    throughBall: 'the through-ball scorer\'s `bestRunner`', cutback: 'the team\'s licensed `arriver`',
    kickoff: 'the kick-off play-back loop\'s `back`' },
  prices: { snapshot: 'option.price (EV̂ under the value axis × the own-lane factor), option.band (threatBandIndex, −1 unread), trace.reception',
    groundCandidate: 'lane = min(1, laneOpenness × 1.15 playmaker); gain; gate fires iff gain > 0.15 ∧ lane < 0.4; multiplier gate + (1 − gate)·stagnation·0.4' },
  decisionPositions: 'every brain decides before any executor or physics step ⇒ the PRE-STEP positions',
};
const body: Record<string, unknown> = {
  stage: { id: 'OP-C1', ruling: '#428 item 3', instrument: INSTRUMENT_PATH, instrumentSha256: INSTRUMENT_SHA,
    doc: DOC_PATH, mode: MODE, arch: process.arch, node: process.version, opc0BodySha256: OPC0_BODY_SHA,
    honestLimitsNote: `the HONEST LIMITS list lives ONLY in ${DOC_PATH} §HONEST LIMITS (the one home); this artifact stores none` },
  seeds: { blockBase: BLOCK_BASE, blockTop: BLOCK_TOP, battery: [BATTERY_SEEDS[0] ?? null, BATTERY_SEEDS[BATTERY_SEEDS.length - 1] ?? null],
    nBattery: BATTERY_SEEDS.length, receipt: RECEIPT_SEED, simCeiling: SIM_CEILING, scratchBase: SCRATCH_BASE,
    scratchUsed: SCRATCH_SEEDS_USED, verifierBand: VERIFIER_BAND, reproSeeds: REPRO_SEEDS, consumedBlocks: CONSUMED_BLOCKS,
    unwalkedTail: MODE === 'full' && perSeed.length < N_FROZEN ? [BLOCK_BASE + perSeed.length, BLOCK_TOP - 1] : null },
  stats: STATS,
  arms: ARMS.map((a) => ({ arm: a, world: ARM_WORLD[a], dosed: ARM_DOSED[a] })),
  rowSchema: ROW_SCHEMA,
  faceDefs: FACE_DEFS,
  faces: facesByArm,
  deltasW18: deltas,
  partition: partitionRows,
  emptiness,
  ownership,
  qa,
  qb,
  codeMap,
  anchors: ANCHORS,
  parsed: { ...PARSED, SHUT_BANDS, RECEPTION_COIN, ALONG_EDGES: ALONG_EDGES.map((e) => (Number.isFinite(e) ? e : '-Infinity')),
    LAT_EDGES, PASSER_DIST_EDGES, PRICE_EDGES, MULT_EDGES },
  fixtures: FIXTURES,
  ledgerRead: LEDGER_READ,
  repro: { rows: reproRows, opc0Artifact: OPC0_ARTIFACT, opc0BodySha256: OPC0_BODY_SHA, opc0RowKeys: OPC0_KEYS.length },
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
const writeArtifact = (path: string, b: Record<string, unknown>, receipts: Record<string, unknown>): string => {
  const ordered: Record<string, unknown> = {};
  for (const k of BODY_KEYS) ordered[k] = b[k];
  const bodySha = sha(JSON.stringify(ordered));
  writeFileSync(path, JSON.stringify({ ...ordered, receipts, bodySha256: bodySha }), { encoding: 'utf8' });
  return bodySha;
};
const allKeysInSchema = Object.keys(body).every((k) => (BODY_KEYS as readonly string[]).includes(k))
  && BODY_KEYS.every((k) => k in body);
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
const partitionReDerived = ARMS.every((a) => disk.perSeedCells.every((c) => {
  const p = rowPartitionOk((c[a] as { row: Row }).row);
  return p.opc0 && p.qa && p.qb;
}));
gate('gFaces', faceChecks > 0 && faceOk === faceChecks && ownershipReDerived && partitionReDerived && FACE_DEFS_OK,
  `${faceOk}/${faceChecks} face checks re-derived from the SERIALIZED per-seed cells off disk; the ownership table `
  + `re-derived ${ownershipReDerived}; the three partitions re-derived per seed ${partitionReDerived}`);
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
banner(`OP-C1 ${allGreen ? 'ALL GREEN' : 'RED'} — ${GATES.filter((g) => g.ok).length}/${GATES.length} gates · ${finalPath}`);
banner(`  bodySha256 ${bodySha} · fileSha256 ${sha(fileBytes)} · ${fileBytes.length} bytes · wall ${((Date.now() - T_START) / 1000).toFixed(1)} s`);
for (const a of ARMS) {
  banner(`  ${a}: fb.opponent ${val(a, 'fb.ground.opponent')} · split ${SPLITS.map((s) => val(a, `q2.wide.${s}`)).join(' / ')}`);
  banner(`    QA readings ${READINGS.map((r) => `${r} ${val(a, `qa.reading.${r}`)}`).join(' · ')}`);
  banner(`    QB in-lane ${QB.map((q) => `${q} ${val(a, `qb.inLane.${q}`)}`).join(' · ')} · shut&played ${val(a, 'qb.inLane.pricedShutAndPlayed')}`);
  banner(`    receipts: why-lane ${val(a, 'gc.receipt.whyLaneAgreesShare')} · why-mate ${val(a, 'gc.receipt.whyMateIsTargetShare')} · `
    + `windup aim ${val(a, 'receipt.windupAimAgreesShare')} · snap higher-priced alt ${val(a, 'snap.all.higherPricedAlt')} · `
    + `trace duplicate keys/match ${val(a, 'receipt.traceDuplicateKeysPerMatch')}`);
}
if (hwSmoke !== null) banner(`  sizing ${sizing.face}: hw ${hwSmoke} → nRequired ${nRequired}`);
