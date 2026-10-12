/**
 * OP-T1 — 「身前那个人 · 考」 THE FRONT-MAN EXAM (ruling #433 items 3–4).
 *
 * AN EXAM: the reads, their precedence, the arms, the win face and the bands are FROZEN EX ANTE at
 * ruling #433 item 3 (their FIRST home), in docs/world-model/OP-T1-FRONT-MAN-EXAM.md §P (the
 * second) and in this file (the third); `gReadLiterals` cross-checks the three homes.
 * X-SRC-ZERO: not one byte under `src/` or `tests/` is created or edited; the instrument CALLS the
 * shipped exports and reads public `Match` state per tick.
 *
 * Doc of record: docs/world-model/OP-T1-FRONT-MAN-EXAM.md (§0 · §P · §DEV-PREFLIGHT frozen with
 * this file at the FREEZE commit; §R onward written after the battery).
 *
 * COPIED BY RECIPE, ⛔ NEVER IMPORTED — OP-C2's whole walker (and with it OP-C1's and OP-C0's
 * predicates, row and decider attribution) is COPIED from `scripts/probes/op-c2-feet-zone-census.ts`
 * (frozen at 1f95398 / 50d9dba), byte for byte in every line that writes a stored OP-C2 cell, so
 * `gRepro` can compare OP-C2's whole per-seed row field for field against its stored cells; the
 * exam form (the band F-DS-b, NI_FRACTION by anchor, the cluster bootstrap, the read precedence,
 * gReadLiterals, the house gates) is COPIED in FORM from `scripts/probes/if-t1b-flight-run-exam.ts`
 * and cited by its line numbers (IF-T1b l.N). Blocks this exam ADDS are marked ⭐OP-T1.
 *
 * ARMS (#433 item 3(i)): W18-D (THE CONTROL) · W18-D+OP (THE ARM OF RECORD) · W18-E · W18-E+OP.
 *
 * ENV (whitelisted; anything else is FATAL): OPT1_MODE=smoke|chunk|full · OPT1_N · OPT1_OUT ·
 *   OPT1_CHUNK (battery index range `lo-hi`, half-open, chunk mode only) · OPT1_CHUNK_DIR.
 *   smoke  — the disclosed sizing smoke on scratch seeds 900,010,000–011 (+ receipt 020), artifact
 *            routed OFF every canonical path.
 *   chunk  — walks battery seeds [lo, hi) of 12,564,000–998 (gRepro FIRST, in the same process) and
 *            writes their rows to OPT1_CHUNK_DIR; REFUSES unless the running file is byte-identical
 *            to the FREEZE commit's blob.
 *   full   — gRepro FIRST, the scratch gates, then the battery rows READ from the chunk files (each
 *            stamped with this file's sha256; their union must be exactly 12,564,000–998), the
 *            construction receipt 12,564,999 walked here, faces, bands, reads, gates, artifact.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync, mkdirSync } from 'node:fs';
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
import { laneOpenness, laneOpennessFront, pressureAt } from '../../src/ai/perception';
import { THREAT_CALIBRATION } from '../../src/ai/passPrior';
import {
  DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS, groundShellHazard, deliveryValueSeatOf,
} from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment } from '../../src/utils/vec';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';
import type { PerceptionSnapshot } from '../../src/ai/perceptionSnapshot';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE (OP-C2 l.56–89, COPIED; renamed; chunk mode ⭐OP-T1)      */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const ENV_WHITELIST = ['OPT1_MODE', 'OPT1_N', 'OPT1_OUT', 'OPT1_CHUNK', 'OPT1_CHUNK_DIR'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('OPT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`OP-T1 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = (process.env.OPT1_MODE ?? 'full') as 'smoke' | 'chunk' | 'full';
if (MODE !== 'smoke' && MODE !== 'chunk' && MODE !== 'full') {
  banner('OP-T1 FATAL — OPT1_MODE must be smoke|chunk|full'); process.exit(3);
}
const N_ENV = process.env.OPT1_N !== undefined ? Number(process.env.OPT1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('OP-T1 FATAL — OPT1_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.OPT1_OUT;
const IS_OVERRIDE = MODE === 'smoke' || N_ENV !== undefined || OUT_ENV !== undefined;
const CANONICAL_OUT = 'docs/world-model/data/op-t1-front-man-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? pathJoin(tmpdir(), 'op-t1-override.json') : CANONICAL_OUT);
if (IS_OVERRIDE && pathResolve(OUT_BASE).startsWith(CANONICAL_DIR_ABS)) {
  banner('OP-T1 FATAL — an override run may not write under docs/world-model/data'); process.exit(3);
}
const CHUNK_DIR = process.env.OPT1_CHUNK_DIR ?? pathJoin(tmpdir(), 'op-t1-chunks');
if (pathResolve(CHUNK_DIR).startsWith(pathResolve('.'))) {
  banner('OP-T1 FATAL — the chunk directory must lie OUTSIDE the repository (a scratch path)'); process.exit(3);
}
const INSTRUMENT_PATH = 'scripts/probes/op-t1-front-man-exam.ts';
const DOC_PATH = 'docs/world-model/OP-T1-FRONT-MAN-EXAM.md';
const OPC2_ARTIFACT = 'docs/world-model/data/op-c2-feet-zone-census.json';
const OPC0_ARTIFACT = 'docs/world-model/data/op-c0-opponent-first-census.json';
const OPC2_INSTRUMENT = 'scripts/probes/op-c2-feet-zone-census.ts';
const IFT1B_INSTRUMENT = 'scripts/probes/if-t1b-flight-run-exam.ts';
const sha = (v: string | Buffer): string => createHash('sha256').update(v).digest('hex');
const INSTRUMENT_BYTES = readFileSync(INSTRUMENT_PATH);
const INSTRUMENT_SHA = sha(INSTRUMENT_BYTES);
const sh = (cmd: string): string => execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8');
const T_START = Date.now();
/** ⭐OP-T1 THE FREEZE COMMIT — the newest commit touching this file whose subject begins
 *  `OP-T1 FREEZE`; null before the freeze (smoke). Battery seeds are walked ONLY when the running
 *  file is byte-identical to that commit's blob (chunk mode refuses otherwise; gFrozen re-checks). */
const FREEZE_COMMIT: string | null = (() => {
  try {
    const h = sh(`git log --format=%H "--grep=^OP-T1 FREEZE" -- ${INSTRUMENT_PATH}`).trim().split('\n')[0];
    return h === undefined || h === '' ? null : h;
  } catch { return null; }
})();
const FREEZE_BLOB: Buffer | null = FREEZE_COMMIT === null ? null
  : execSync(`git show ${FREEZE_COMMIT}:${INSTRUMENT_PATH}`, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });
const RUNNING_IS_FREEZE = FREEZE_BLOB !== null && sha(FREEZE_BLOB) === INSTRUMENT_SHA;
if (MODE === 'chunk' && !RUNNING_IS_FREEZE) {
  banner('OP-T1 FATAL — chunk mode walks battery seeds and REFUSES before the FREEZE commit '
    + '(or if the running file differs from the FREEZE blob)'); process.exit(3);
}

/* ========================================================================== */
/* §2 SEEDS (#433 item 4(iii))                                                  */
/* ========================================================================== */
const BLOCK_BASE = 12_564_000;
const BLOCK_TOP = 12_564_999;
const SIM_CEILING = 12_565_000; // ⛔ never a SIM seed ≥ this
const SIM_LATTICE_TOP = 900_000_000; // seeds ≥ this are the out-of-band scratch lattice
const N_FROZEN = 999;
const SMOKE_N = 12;
const N = N_ENV ?? (MODE === 'smoke' ? SMOKE_N : N_FROZEN);
/** ⭐ THE ONE DECLARED SCRATCH BASE (#433 item 4(iii): scratch 900,010,000–099 from ONE base). */
const SCRATCH_BASE = 900_010_000;
const SCRATCH_TOP = 900_010_099;
const VERIFIER_BAND: readonly [number, number] = [900_010_100, 900_010_199];
const SMOKE_SEEDS = Array.from({ length: SMOKE_N }, (_, i) => SCRATCH_BASE + i);
const SMOKE_RECEIPT = SCRATCH_BASE + 20;
const ARMOP_SEEDS = [SCRATCH_BASE + 40, SCRATCH_BASE + 41];
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const FIXTURE_SEED = SCRATCH_BASE + 99;
const BATTERY_SEEDS = MODE === 'smoke' ? SMOKE_SEEDS.slice(0, N)
  : Array.from({ length: N }, (_, i) => BLOCK_BASE + i);
const RECEIPT_SEED = MODE === 'smoke' ? SMOKE_RECEIPT : BLOCK_TOP;
/** OP-C2's own consumed band — its first twelve battery seeds (re-walk ≠ consumption). */
const REPRO_BAND_BASE = 12_563_000;
const REPRO_SEEDS = Array.from({ length: 12 }, (_, i) => REPRO_BAND_BASE + i);
/** every consumed block of record below this one (OP-C2's list + OP-C2's own block). */
const CONSUMED_BLOCKS = [12_544_000, 12_545_000, 12_546_000, 12_547_000, 12_548_000,
  12_549_000, 12_550_000, 12_551_000, 12_552_000, 12_553_000, 12_554_000, 12_555_000,
  12_556_000, 12_557_000, 12_558_000, 12_559_000, 12_560_000, 12_561_000, 12_562_000, 12_563_000];
/** ⭐OP-T1 the registry moves 88 → 89: `match.opFrontMan` is this exam's ONE new registered ledger read. */
const STATS = { consumed: 0, nextBase: 117_600, registryOfRecord: 89 } as const;
const SCRATCH_SEEDS_USED = MODE === 'smoke'
  ? [...SMOKE_SEEDS.slice(0, N), SMOKE_RECEIPT, ...ARMOP_SEEDS, WORLD_PIN_SEED, ...LOCKSTEP_SEEDS, FIXTURE_SEED]
  : [...ARMOP_SEEDS, WORLD_PIN_SEED, ...LOCKSTEP_SEEDS, FIXTURE_SEED];

/* ========================================================================== */
/* §3 ANCHORS — the code map's needles, each pinned to its occurrence count     */
/*    (OP-C2 l.125–155 form). Every constant the exam reads is PARSED from an    */
/*    anchored line, never typed; every by-anchor copy names its source line.    */
/* ========================================================================== */
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const PERC_PATH = 'src/ai/perception.ts';
const A4_PATH = 'src/game/a4World.ts';
const PPC_PATH = 'src/ai/perceivedPassChoice.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const CTBT1_PATH = 'scripts/probes/ctb-t1-supply-exam.ts';
const DLCT1_PATH = 'scripts/probes/dlc-t1-choice-exam.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [BRAIN_PATH, MATCH_PATH, PERC_PATH, A4_PATH, PPC_PATH, MECH_PATH, CTBT1_PATH, DLCT1_PATH,
  IFT1B_INSTRUMENT, OPC2_INSTRUMENT]) {
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
/* — the lines OP-C2's copied decider read parses its constants from (OP-C2 l.165–166, l.228–237) — */
const BAR_LINE = '      if (gain > 0.15 && lane < 0.4) {';
const PLAYMAKER_LINE = "        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),";
const GATE_LINE = '        const gate = 0.35 + g.riskTolerance * 0.65;';
const MULT_LINE = '        s *= gate + (1 - gate) * stagnation * 0.4;';
const STAG_LINE = '  const stagnation = clamp01((team.staleTime - 3) / 5);';
const GAIN_LINE = '      const gain = clamp01((team.localX(aim.x) - localX + 30) / 60) * 2 - 1;';
anchor('OP-T1: groundCandidate forward gate (OP-C2 parses BAR and GAIN_GATE here)', BRAIN_PATH, BAR_LINE, 1);
anchor('OP-T1: the shipped licence line, byte-kept by the seam (playmaker x1.15 parsed here)', BRAIN_PATH, PLAYMAKER_LINE, 1);
anchor('OP-T1: the gate base / risk line (copied decider read)', BRAIN_PATH, GATE_LINE, 1);
anchor('OP-T1: the gate multiplier line (copied decider read)', BRAIN_PATH, MULT_LINE, 1);
anchor('OP-T1: the stagnation line (copied decider read)', BRAIN_PATH, STAG_LINE, 1);
anchor('OP-T1: the forward-gain line (copied decider read)', BRAIN_PATH, GAIN_LINE, 1);
anchor('OP-T1: kick-off play-back why (the kickoff decider cell)', BRAIN_PATH,
  `        scores: [{ action: 'Pass', score: 1, why: 'kickoff ${EM} played back' }],`, 1);
anchor('OP-T1: the legacy Pass winner why (bestMate name and bestLane)', BRAIN_PATH,
  `        why: \`to \${bestMate.name} ${MD} lane \${bestLane.toFixed(2)} ${MD} open \${bestOpen.toFixed(2)}`, 1);
anchor('OP-T1: E3 chooser trace door stores chosenGid', BRAIN_PATH, '        chosenGid: choice?.targetGid ?? -1,', 1);
anchor('OP-T1: E3 chooser pick replaces the legacy target', BRAIN_PATH, '    if (chosen) passMate = chosen;', 1);
anchor('OP-T1: trace door is a construction option, default off', MATCH_PATH,
  '    this.traceChoice = cfg.traceChoice ?? EDS_TRACE_ARMED;', 1);
anchor('OP-T1: every brain decides before executors and physics (pre-step positions)', MATCH_PATH,
  '        decidePlayer(p, this);', 1);
/* — ⭐OP-T1 THE SEAM UNDER EXAM (OP-T0 f850404, M-OP.1–3) — */
const FRONT_FORM_LINE = '    worst = Math.min(worst, clamp01(d / (along < 1.5 ? CONTROL_RADIUS : 4)));';
anchor('OP-T1: THE FORM — laneOpennessFront reads a man strictly ahead within 1.5 m at CONTROL_RADIUS', PERC_PATH,
  FRONT_FORM_LINE, 1);
anchor('OP-T1: THE FORM — the guard skips a man only when his closest point IS the kicker', PERC_PATH,
  '    if (along === 0) continue;', 1);
anchor('OP-T1: THE FORM — along = distance of the closest point from the kicker', PERC_PATH,
  '    const along = dist(cp, from);', 1);
anchor('OP-T1: the shipped guard, kept in laneOpenness (behind / level / within 1.5 m skipped)', PERC_PATH,
  '    if (dist(cp, from) < 1.5) continue;', 1);
anchor('OP-T1: THE SEAT — the closure-local fork on match.opFrontMan inside groundCandidate', BRAIN_PATH,
  '      const laneOpenness = match.opFrontMan ? laneOpennessFront : laneOpennessShipped;', 1);
anchor('OP-T1: THE DOOR — default false, read once at construction', MATCH_PATH,
  '    this.opFrontMan = cfg.opFrontMan ?? false;', 1);
anchor('OP-T1: no world names the door (a4World.ts, literal zero)', A4_PATH, 'opFrontMan', 0);
/* — ⭐OP-T1 THE PRESSED CARRIER: the engine's own pressure and its 0.5 (#433 item 3(iv)) — */
const PRESSURE_LINE = '  const pressure = pressureAt(p.pos, opp.players);';
const OUTLET_LINE = '    if (pressure > 0.5) bestPass *= W.passOutletMul; // pass is the pressure outlet';
anchor('OP-T1: the carrier pressure value, computed once per carrier decision', BRAIN_PATH, PRESSURE_LINE, 1);
anchor('OP-T1: the passOutletMul line reads that pressure above 0.5 (the pressed threshold parsed here)',
  BRAIN_PATH, OUTLET_LINE, 1);
anchor('OP-T1: a won tackle is booked on stats.tackles (the S2 receipt beside)', MECH_PATH,
  '    oppTeam.stats.tackles++;', 1);
/* — ⭐OP-T1 THE TOLERANCE, BY ANCHOR (IF-T1b l.719–722, l.814–823 form): never typed as a decimal — */
anchor('OP-T1: NI_FRACTION as an expression in CTB-T1 (first source)', CTBT1_PATH, 'const NI_FRACTION = 1 - 0.275 / 0.380;', 1);
anchor('OP-T1: NI_FRACTION, the same expression in DLC-T1 (second source)', DLCT1_PATH, 'const NI_FRACTION = 1 - 0.275 / 0.380;', 1);
/* — ⭐OP-T1 THE BAND F-DS-b, BY ANCHOR in IF-T1b (l.5339–5398): the nine limbs, the breach law, G10 — */
const IFT1B_LIMB_LINES = [
  "  { id: 'G1', key: 'guard.goalsPerMatch', direction: 'both',",
  "  { id: 'G2', key: 'guard.shotsPerMatch', direction: 'both',",
  "  { id: 'G3', key: 'guard.xgConversion', direction: 'both',",
  "  { id: 'G4', key: 'guard.passCompletion', direction: 'floor',",
  "  { id: 'G5', key: 'guard.interceptionsPerMatch', direction: 'ceiling',",
  "  { id: 'G6', key: 'guard.possessionShareSideA', direction: 'both',",
  "  { id: 'G7', key: 'guard.passesPerMatch', direction: 'both',",
  "  { id: 'G8', key: 'guard.meanAimDistanceMetres', direction: 'both',",
  "  { id: 'G9', key: 'guard.throughBallsPerMatch', direction: 'both',",
] as const;
for (const l of IFT1B_LIMB_LINES) anchor('OP-T1: an F-DS-b limb in IF-T1b, inherited unchanged', IFT1B_INSTRUMENT, l, 1);
anchor('OP-T1: IF-T1b breach law, the harmful-direction test', IFT1B_INSTRUMENT,
  "  const beyond = l.direction === 'ceiling' ? d.delta > tol", 1);
anchor('OP-T1: IF-T1b breach direction', IFT1B_INSTRUMENT,
  "  const dir = d.resolved && beyond ? (d.delta > 0 ? 'UP' : 'DOWN') : 'none';", 1);
anchor('OP-T1: IF-T1b G10 offside FLAG form (flags, gates nothing; the line and its own anchor)', IFT1B_INSTRUMENT,
  '    resolved: d.resolved, flag: d.resolved && d.delta > 0, gating: false,', 2);
anchor('OP-T1: IF-T1b cluster bootstrap resample over seeds', IFT1B_INSTRUMENT,
  '  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));', 1);
anchor('OP-T1: IF-T1b G8 aim distance at the tick a new pendingPass appears', IFT1B_INSTRUMENT,
  '        row.aimDistSum += Math.hypot(players[pi].pos.x - players[ti].pos.x,', 1);
/* — ⭐OP-T1 THE FACES COPIED BY ANCHOR FROM OP-C2 (the win face, the zone faces, the decider attribution, the dose) — */
const OPC2_COPIED_LINES = [
  "CONTACTS.forEach((c, i) => face(`fb.ground.${c}`, cells('fbG', [i]), ALL_GROUND));",
  "face('qd.zone.aheadShare', cells('qdZoneAhead', range(NQ).map((o) => NQ + o)), cells('qdZoneAhead', range(2 * NQ)));",
  "face('qd.zoneAhead.zoneManFirst', cells('qdZoneAhead', [NQ]), cells('qdZoneAhead', range(NQ).map((o) => NQ + o)));",
  "face('qd.zoneAhead.anyOppFirst', cells('qdZoneAhead', [NQ, NQ + 1]), cells('qdZoneAhead', range(NQ).map((o) => NQ + o)));",
  "face('qd.zoneBehindOnly.zoneManFirst', cells('qdZoneAhead', [0]), cells('qdZoneAhead', range(NQ)));",
  "face('qd.zoneBehindOnly.anyOppFirst', cells('qdZoneAhead', [0, 1]), cells('qdZoneAhead', range(NQ)));",
  "qdFaces('qd', [0, 1, 2], range(N_DEC));",
  "const deciderOfQb = (q: QbCell): Decider => (q === 'snapOpen' || q === 'snapShut' || q === 'snapUnread' ? 'snapshot'",
  "const zoneManAheadOf = (g: LineGeom): boolean => inSkipZoneOf(g) && g.t >= 0;",
  "  if (ARM_DOSED[arm]) armA4World(m, null, v, L3_DOSE, PC_DOSE);",
  "const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';",
  "const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';",
] as const;
for (const l of OPC2_COPIED_LINES) anchor('OP-T1: an OP-C2 line copied byte for byte into this file', OPC2_INSTRUMENT, l, 1);
/** the gate and its multiplier, PARSED from their own anchored lines (never typed; OP-C2 l.306–323). */
const BAR = Number(BAR_LINE.slice(BAR_LINE.indexOf('lane < ') + 7, BAR_LINE.indexOf(') {')));
const GAIN_GATE = Number(BAR_LINE.slice(BAR_LINE.indexOf('gain > ') + 7, BAR_LINE.indexOf(' && lane')));
const PLAYMAKER_MUL = Number(PLAYMAKER_LINE.slice(PLAYMAKER_LINE.indexOf('? ') + 2, PLAYMAKER_LINE.indexOf(' : 1')));
const GATE_BASE = Number(GATE_LINE.slice(GATE_LINE.indexOf('= ') + 2, GATE_LINE.indexOf(' + g.')));
const GATE_RISK = Number(GATE_LINE.slice(GATE_LINE.indexOf('riskTolerance * ') + 16, GATE_LINE.indexOf(';')));
const MULT_STAG = Number(MULT_LINE.slice(MULT_LINE.indexOf('stagnation * ') + 13, MULT_LINE.indexOf(';')));
const STAG_OFF = Number(STAG_LINE.slice(STAG_LINE.indexOf('staleTime - ') + 12, STAG_LINE.indexOf(') / ')));
const STAG_DIV = Number(STAG_LINE.slice(STAG_LINE.indexOf(') / ') + 4, STAG_LINE.indexOf(');')));
const GAIN_OFF = Number(GAIN_LINE.slice(GAIN_LINE.indexOf('localX + ') + 9, GAIN_LINE.indexOf(') / ')));
const GAIN_DIV = Number(GAIN_LINE.slice(GAIN_LINE.indexOf(') / ') + 4, GAIN_LINE.indexOf(') * 2')));
const KICKOFF_WHY = `kickoff ${EM} played back`;
/** ⭐OP-T1 the pressed threshold, PARSED from the passOutletMul line (`pressure > 0.5`). */
const PRESSED_AT = Number(OUTLET_LINE.slice(OUTLET_LINE.indexOf('pressure > ') + 11, OUTLET_LINE.indexOf(') bestPass')));
/** ⭐OP-T1 the seam's front radius, PARSED from the form line (`along < 1.5`). */
const FRONT_RADIUS = Number(FRONT_FORM_LINE.slice(FRONT_FORM_LINE.indexOf('along < ') + 8, FRONT_FORM_LINE.indexOf(' ? CONTROL')));
/** ⭐OP-T1 THE GUARD TOLERANCE FRACTION — IF-T1b's `niPair` (l.814–823), COPIED: inherited BY ANCHOR
 *  from CTB-T1's own probe line and EVALUATED FROM ITS TWO NUMERALS; DLC-T1's line must agree. */
const niPair = (path: string): [number, number] => {
  const m = SRC_OF[path].match(/const NI_FRACTION = 1 - (0\.\d+) \/ (0\.\d+);/);
  return m === null ? [Number.NaN, Number.NaN] : [Number(m[1]), Number(m[2])];
};
const NI_A = niPair(CTBT1_PATH);
const NI_B = niPair(DLCT1_PATH);
const NI_FRACTION = 1 - NI_A[0] / NI_A[1];
const NI_FRACTION_SECOND_SOURCE = 1 - NI_B[0] / NI_B[1];
const NI_OK = Number.isFinite(NI_FRACTION) && NI_FRACTION > 0 && NI_FRACTION < 1
  && NI_FRACTION === NI_FRACTION_SECOND_SOURCE;
const PARSED = { BAR, GAIN_GATE, PLAYMAKER_MUL, GATE_BASE, GATE_RISK, MULT_STAG, STAG_OFF, STAG_DIV, GAIN_OFF, GAIN_DIV,
  PRESSED_AT, FRONT_RADIUS, NI_FRACTION, NI_FRACTION_SECOND_SOURCE };
const ANCHORS_OK = ANCHORS.every((a) => a.ok) && BAR === 0.4 && GAIN_GATE === 0.15 && PLAYMAKER_MUL === 1.15
  && GATE_BASE === 0.35 && GATE_RISK === 0.65 && MULT_STAG === 0.4 && STAG_OFF === 3 && STAG_DIV === 5
  && GAIN_OFF === 30 && GAIN_DIV === 60 && PRESSED_AT === 0.5 && FRONT_RADIUS === 1.5 && NI_OK
  && DV_CORRIDOR_SCALE === 4 && DV_CLEAR_RADIUS === 1.5 && Number.isFinite(CONTROL_RADIUS);
banner(`OP-T1 anchors ${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} · parsed ${JSON.stringify(PARSED)}`);
for (const a of ANCHORS.filter((q) => !q.ok)) banner(`  RED anchor (${a.got} ≠ ${a.want}) ${a.what} :: ${a.needle}`);

/* ========================================================================== */
/* §4 THE ARMS (OP-C2 l.333–390, COPIED; the two +OP arms ⭐OP-T1, #433 item 3(i)) */
/* ========================================================================== */
const ARMS = ['W18-D', 'W18-D+OP', 'W18-E', 'W18-E+OP'] as const;
type Arm = (typeof ARMS)[number];
const ARM_WORLD: Record<Arm, 18> = { 'W18-D': 18, 'W18-D+OP': 18, 'W18-E': 18, 'W18-E+OP': 18 };
const ARM_DOSED: Record<Arm, boolean> = { 'W18-D': true, 'W18-D+OP': true, 'W18-E': false, 'W18-E+OP': false };
/** ⭐OP-T1 THE DOOR per arm: `opFrontMan: true` on the two +OP arms ONLY (gArmOP). */
const ARM_OP: Record<Arm, boolean> = { 'W18-D': false, 'W18-D+OP': true, 'W18-E': false, 'W18-E+OP': true };
/** the contrasts — a PAIR each (IF-T1b §P.1 form): candidate | control. */
const CONTRASTS = ['W18-D+OP|W18-D', 'W18-E+OP|W18-E'] as const;
type Cid = (typeof CONTRASTS)[number];
const CONTRAST_OF_RECORD: Cid = 'W18-D+OP|W18-D';
const TREAT_OF: Record<Cid, Arm> = { 'W18-D+OP|W18-D': 'W18-D+OP', 'W18-E+OP|W18-E': 'W18-E+OP' };
const CTRL_OF: Record<Cid, Arm> = { 'W18-D+OP|W18-D': 'W18-D', 'W18-E+OP|W18-E': 'W18-E' };
/** OP-C2's own arms — the two control arms gRepro re-walks. */
const OPC2_ARMS = ['W18-E', 'W18-D'] as const;

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
  banner(`OP-T1 FATAL — the shipped dose loaders failed: ${String(err)}`); process.exit(3);
}
if (!DOSE_BYTES_OK || L3_DOSE === null || PC_DOSE === null) {
  banner('OP-T1 FATAL — dose bytes do not match their pins'); process.exit(3);
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
    ...(ARM_OP[arm] ? { opFrontMan: true } : {}), // ⭐OP-T1 the door, on the +OP arms only
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

/* --- ⭐⭐⭐ QC — THE `guardSkip` BALLS BY THEIR DECIDER (NEW, #430 item 2(ii)) --- */
/** the QC / QD decider axis = OP-C1's `DECIDERS`, in its order; `unread` is #430's "other". */
const N_DEC = DECIDERS.length;
/** ⭐ THE DECIDER OF A RELEASE, read off its OP-C1 QB CELL exactly as OP-C1's own "BY DECIDER" faces
 *  group it (OP-C1 l.1351–1357: snap* → snapshot, gc* → groundCandidate), the other cells by name. */
const deciderOfQb = (q: QbCell): Decider => (q === 'snapOpen' || q === 'snapShut' || q === 'snapUnread' ? 'snapshot'
  : q === 'gcOpen' || q === 'gcBelowBarNotForward' || q === 'gcGateFired' ? 'groundCandidate' : q);
/** frozen edges for groundCandidate's own `lane` at the choice (unitless 0–1; 0.4 = the gate's bar). */
const GC_LANE_EDGES = [0, 0.2, BAR, 0.6, 0.8] as const;
/** the three gate cells of OP-C1's `gcCellOf`, in a fixed order. */
const GC_CELLS = ['gcOpen', 'gcBelowBarNotForward', 'gcGateFired'] as const;
/** THE CLOSING: the contacting opponent's distance to the passer at the CHOICE minus at the
 *  RELEASE (metres; positive = he came closer). Frozen edges (lower edges; the first catches every
 *  opening): opened (< 0) · [0, 0.5) · [0.5, DV_CLEAR_RADIUS) · [DV_CLEAR_RADIUS, 4) · [4, ∞). */
const CLOSE_EDGES = [Number.NEGATIVE_INFINITY, 0, 0.5, DV_CLEAR_RADIUS, DV_CORRIDOR_SCALE] as const;
const N_CLOSE = CLOSE_EDGES.length;
/** ⭐ CLOSED DURING THE WIND-UP: he came at least DV_CLEAR_RADIUS (1.5 m) closer to the passer
 *  between the choice and the release (THE MOVE's own closing threshold, OP-C1 l.512–516). */
const closedOf = (distChoice: number, distRelease: number): boolean => distChoice - distRelease >= DV_CLEAR_RADIUS;
/** ⭐ SNAPSHOT MEMBERSHIP at the choice — OP-C1's copied `presenceOf` (OP-C1 l.433–435 ← OP-C0),
 *  CALLED on the choice step's scoped pull: `snapshotPresent` (the contacting opponent is in the
 *  passer's own scoped snapshot), `snapshotAbsent` (a scoped pull happened and he is not in it),
 *  `truthRead` (no scoped pull by this passer on the choice step — the E3 chooser not reached),
 *  `noChoiceRead` (no choice record). */
const membershipOf = (c: { scopedPull: boolean; snapOpp: ReadonlyMap<number, unknown> } | null, gid: number): Presence =>
  presenceOf(c !== null, c !== null && c.scopedPull, c !== null && c.snapOpp.has(gid));

/* --- ⭐⭐⭐ QD — THE DENOMINATOR (NEW, #430 item 2(iii)) --- */
/** ⭐ THE RELEASE ZONE: OP-C1's `guardSkip` geometry (OP-C1 l.532, COPIED as a predicate on a
 *  LineGeom) applied to an opponent's RELEASE-tick position against the priced line L→E: projection
 *  `t < DV_CLEAR_RADIUS` (within 1.5 m along, or behind the kicker) AND segment distance
 *  `seg < DV_CORRIDOR_SCALE` (4 m). */
const inSkipZoneOf = (g: LineGeom): boolean => g.t < DV_CLEAR_RADIUS && g.seg < DV_CORRIDOR_SCALE;
/** beside (not a QD cell of #430): a zone man NOT behind the kicker — OP-C1's own along edge 0. */
const zoneManAheadOf = (g: LineGeom): boolean => inSkipZoneOf(g) && g.t >= 0;
/** the QD outcome of one ground release: the first body was a man in the release zone · another
 *  opponent · not an opponent (own target, own non-target, or none). */
const QD_OUT = ['zoneManFirst', 'otherOppFirst', 'notOppFirst'] as const;
type QdOut = (typeof QD_OUT)[number];
const qdOutOf = (oppFirst: boolean, firstGid: number | null, zone: ReadonlySet<number>): QdOut =>
  (!oppFirst ? 'notOppFirst' : firstGid !== null && zone.has(firstGid) ? 'zoneManFirst' : 'otherOppFirst');

/* --- ⭐⭐⭐ OP-T1 — THE NEW WALK-SIDE PREDICATES (#433 item 4(i)); each has a FIRES and a DOES-NOT fixture --- */
/** ⭐ THE FRONT MAN (the seam's OWN partition, M-OP.2): a live opponent whose closest point on the
 *  priced segment L→E — `closestPointOnSegment`, the call `laneOpennessFront` makes — lies STRICTLY
 *  ahead of the kicker and short of the seam's radius: `0 < along < FRONT_RADIUS`, `along` = the
 *  distance of that closest point from L. NO lateral bound (the seam has none: beyond
 *  CONTROL_RADIUS aside his read is 1, but he is still in the partition). A degenerate segment puts
 *  every closest point AT L (along 0) ⇒ nobody is a front man. */
const frontAlongOf = (lx: number, ly: number, ex: number, ey: number, px: number, py: number): number => {
  const cp = closestPointOnSegment({ x: lx, y: ly }, { x: ex, y: ey }, { x: px, y: py });
  return Math.hypot(cp.x - lx, cp.y - ly);
};
const isFrontManOf = (along: number): boolean => along > 0 && along < FRONT_RADIUS;
/** ⭐ THE BACKWARD PASS: the priced aim E lies against the passer's own attack direction from the
 *  launch L — `(eX − lX) · attackDir < 0` (strict: a square ball is NOT backward). */
const isBackwardOf = (lx: number, ex: number, attackDir: number): boolean => (ex - lx) * attackDir < 0;
/** ⭐ THE POSSESSION, off the engine's own `match.possessionSide` read AFTER every step: a possession
 *  of side s OPENS on a step whose value is s and was not s on the previous step (from the other side
 *  or from −1), and CLOSES on the first step whose value is not s (the other side, or −1: a won
 *  tackle, a goal, a loose ball) or at full time. A same-side restart does NOT split a possession. */
const possessionStepOf = (prev: Side | -1, cur: Side | -1): { closes: boolean; opens: boolean } =>
  ({ closes: prev !== -1 && cur !== prev, opens: cur !== -1 && cur !== prev });
/** ⭐ THE PASS ATTEMPT: a step on which the possessing side's engine `stats.passes` counter rose
 *  (every pass kind the engine books: short, through, cross, cutback, lofted, keeper throw). */
const isPassAttemptOf = (passesDelta: number): boolean => passesDelta > 0;
/** ⭐ THE DISPOSSESSION (S2): `ball.owner` becomes a player of the OTHER side than the last non-null
 *  owner, with NO release between — `released` is set by any step on which the last owner's side
 *  booked a pass, a shot or a clearance, or wrote a new pendingPass, or the phase was not
 *  `playing`; it is cleared whenever the ball is owned. Tackles, steals and loose balls the other
 *  side picks up after a carrier lost it; ⛔ never an interception of a pass, a shot or a clearance. */
const releasedOf = (passesD: number, shotsD: number, clearancesD: number, newPassBySide: boolean,
  playing: boolean): boolean => passesD > 0 || shotsD > 0 || clearancesD > 0 || newPassBySide || !playing;
const isDispossessionOf = (lastOwnerSide: Side | -1, newOwnerSide: Side, released: boolean): boolean =>
  lastOwnerSide !== -1 && newOwnerSide !== lastOwnerSide && !released;
/** ⭐ THE PRESSED DECISION TICK: a step on which the PRE-STEP ball owner made a FRESH decision (his
 *  `action.scores` is a new array — OP-C2's own `fresh` test, l.1052) with the engine's own pressure
 *  `pressureAt(p.pos, opp.players)` — CALLED at the PRE-STEP positions the brain decided on — strictly
 *  above PRESSED_AT (0.5, parsed from the passOutletMul line). */
const isPressedOf = (pressure: number): boolean => pressure > PRESSED_AT;
/** ⭐ THE ACTION MIX bucket of `p.action.type` (read AFTER the step): pass = Pass | LoftedPass |
 *  ThroughBall | Cross · dribble = Dribble · hold = HoldUp | ShieldHold | HoldPosition · shoot = Shoot
 *  · other = everything else (ClearBall, ThrowOut, …). */
const MIX = ['pass', 'dribble', 'hold', 'shoot', 'other'] as const;
const mixOf = (t: string): number => (t === 'Pass' || t === 'LoftedPass' || t === 'ThroughBall' || t === 'Cross' ? 0
  : t === 'Dribble' ? 1 : t === 'HoldUp' || t === 'ShieldHold' || t === 'HoldPosition' ? 2 : t === 'Shoot' ? 3 : 4);
/** ⭐ THE BREACH LAW (IF-T1b l.5359–5366, its form copied): beyond = ceiling ? Δ > tol : floor ?
 *  Δ < −tol : |Δ| > tol; a BREACH = RESOLVED ∧ beyond, and it carries its direction (UP / DOWN). */
type BandDir = 'ceiling' | 'floor' | 'both';
const breachOf = (dir: BandDir, delta: number, resolved: boolean, tol: number): 'UP' | 'DOWN' | 'none' => {
  const beyond = dir === 'ceiling' ? delta > tol : dir === 'floor' ? delta < -tol : Math.abs(delta) > tol;
  return resolved && beyond ? (delta > 0 ? 'UP' : 'DOWN') : 'none';
};
/** ⭐ `fixes(contrast)` (#433 item 3(ii)): the paired Δ's 95 % interval lies wholly BELOW zero —
 *  RESOLVED (it excludes zero) AND DOWN. */
const fixesOf = (lo: number, hi: number): boolean => hi < 0;
/** ⭐ THE FROZEN PRECEDENCE (#433 item 3(v)), on STORED booleans: (0) liveness `gBiteOP` RED ⇒ no
 *  read; (1) `holdsBands` FALSE ⇒ read 2; (2) else `fixes` TRUE ⇒ read 1; (3) else ⇒ read 3; (4) the
 *  FALLBACK only if a stored boolean is ABSENT (not a boolean). */
type ReadWord = 'read1' | 'read2' | 'read3' | 'fallback' | 'noRead';
const readWordFrom = (live: unknown, holds: unknown, fixes: unknown): ReadWord => {
  if (typeof live !== 'boolean') return 'fallback';
  if (!live) return 'noRead';
  if (typeof holds !== 'boolean' || typeof fixes !== 'boolean') return 'fallback';
  if (!holds) return 'read2';
  if (fixes) return 'read1';
  return 'read3';
};
const precedenceStepFrom = (live: unknown, holds: unknown, fixes: unknown): string => {
  const w = readWordFrom(live, holds, fixes);
  return w === 'noRead' ? 'step (0) — LIVENESS: gBiteOP is RED, so NO READ IS SELECTED'
    : w === 'read2' ? 'step (1) — holdsBands FALSE: a breach'
      : w === 'read1' ? 'step (2) — the bands hold and fixes is TRUE'
        : w === 'read3' ? 'step (3) — the bands hold and fixes is FALSE'
          : 'step (4) — a stored boolean is ABSENT: THE FALLBACK (a defect, not a shape)';
};

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
/* — ⭐ OP-C2 NEW: the release-zone test, the snapshot-membership test, the closing bins, the QC / QD cells — */
/* the release zone (the guardSkip geometry at release), each side of each edge */
fx('zone.atTheFeet', inSkipZoneOf(G(0.5, 1)), true);
fx('zone.behindKickerClose', inSkipZoneOf(G(-1, 2)), true);
fx('zone.justUnderClearAlong', inSkipZoneOf(G(1.4999, 3.9)), true);
fx('zone.notAtClearAlong', inSkipZoneOf(G(1.5, 0)), false);
fx('zone.notFourAside', inSkipZoneOf(G(1, 4)), false);
fx('zone.notFiveAside', inSkipZoneOf(G(1, 5)), false);
fx('zone.behindUsesSegDistance', inSkipZoneOf(G(-3, 2)), true);   // seg = hypot(3, 2) ≈ 3.61 < 4
fx('zone.behindFarIsOut', inSkipZoneOf(G(-3, 3)), false);         // seg = hypot(3, 3) ≈ 4.24 ≥ 4
fx('zone.equalsGuardSkipGeometry', [G(0.5, 1), G(1, 5), G(-3, 2), G(1.5, 0)].map((g) => inSkipZoneOf(g)),
  [G(0.5, 1), G(1, 5), G(-3, 2), G(1.5, 0)].map((g) => readingOf(g, false) === 'guardSkip'));
fx('zoneAhead.atTheFeet', zoneManAheadOf(G(0.5, 1)), true);
fx('zoneAhead.zeroIsAhead', zoneManAheadOf(G(0, 1)), true);
fx('zoneAhead.behindIsNot', zoneManAheadOf(G(-0.1, 1)), false);
fx('zoneAhead.outsideZoneIsNot', zoneManAheadOf(G(1, 5)), false);
fx('zone.degenerateLineWithinFour', inSkipZoneOf(lineGeomOf(0, 0, 0, 0, 3, 2)), true);
/* the QD outcome */
const ZS = new Set([11, 12]);
fx('qd.zoneManFirst', qdOutOf(true, 12, ZS), 'zoneManFirst');
fx('qd.otherOppFirst', qdOutOf(true, 13, ZS), 'otherOppFirst');
fx('qd.notOppFirst', qdOutOf(false, 12, ZS), 'notOppFirst');
fx('qd.emptyZoneOppIsOther', qdOutOf(true, 12, new Set()), 'otherOppFirst');
fx('qd.nullBodyIsOther', qdOutOf(true, null, ZS), 'otherOppFirst');
/* the snapshot membership (OP-C1's presenceOf, CALLED on the choice record) */
const SNAP_PULL = { scopedPull: true, snapOpp: new Map([[11, { x: 0, y: 0 }]]) };
fx('member.present', membershipOf(SNAP_PULL, 11), 'snapshotPresent');
fx('member.absent', membershipOf(SNAP_PULL, 12), 'snapshotAbsent');
fx('member.noPullIsTruthRead', membershipOf({ scopedPull: false, snapOpp: new Map() }, 11), 'truthRead');
fx('member.noChoice', membershipOf(null, 11), 'noChoiceRead');
/* the closing bins and the closed predicate */
fx('close.openedIsBinZero', edgeBinOf(-0.01, CLOSE_EDGES), 0);
fx('close.zeroIsStill', edgeBinOf(0, CLOSE_EDGES), 1);
fx('close.halfMetreEdge', edgeBinOf(0.5, CLOSE_EDGES), 2);
fx('close.clearRadiusEdge', edgeBinOf(DV_CLEAR_RADIUS, CLOSE_EDGES), 3);
fx('close.fourEdge', edgeBinOf(4, CLOSE_EDGES), 4);
fx('closed.byClearRadius', closedOf(5, 3.5), true);
fx('closed.lessDoesNot', closedOf(5, 3.6), false);
fx('closed.openingDoesNot', closedOf(2, 6), false);
fx('bins.dist.choiceUsesPasserEdges', edgeBinOf(1.4999, PASSER_DIST_EDGES), 0);
/* groundCandidate's lane bins (0.4 = the parsed bar is an edge) and the gate cell order */
fx('bins.gcLane.barIsAnEdge', edgeBinOf(BAR, GC_LANE_EDGES), 2);
fx('bins.gcLane.justUnderBar', edgeBinOf(0.3999, GC_LANE_EDGES), 1);
fx('bins.gcLane.top', edgeBinOf(1, GC_LANE_EDGES), 4);
fx('qc.deciderAxisIsOpC1s', [...DECIDERS], ['snapshot', 'groundCandidate', 'throughBall', 'cutback', 'kickoff', 'unread']);
fx('decOfQb.snapShutIsSnapshot', deciderOfQb('snapShut'), 'snapshot');
fx('decOfQb.snapUnreadIsSnapshot', deciderOfQb('snapUnread'), 'snapshot');
fx('decOfQb.gcFiredIsGroundCandidate', deciderOfQb('gcGateFired'), 'groundCandidate');
fx('decOfQb.gcBelowBarIsGroundCandidate', deciderOfQb('gcBelowBarNotForward'), 'groundCandidate');
fx('decOfQb.kickoffByName', deciderOfQb('kickoff'), 'kickoff');
fx('decOfQb.unreadIsOther', deciderOfQb('unread'), 'unread');
/* the shell hazard is CALLED, never re-typed: a body on the line short of the target fires it,
 *  the kicker and the receiver are named out, a body 1 m aside does not (shell = core + ball) */
const HB = (gid: number, x: number, y: number) => ({ gid, pos: { x, y }, sentOff: false, coreRadius: 0.525 }) as unknown as Player;
fx('hazard.onLineAtTheFeet', groundShellHazard({ x: 0, y: 0 }, { x: 20, y: 0 }, [[HB(5, 0.5, 0.2)]], 1, 2), 1);
fx('hazard.kickerNamedOut', groundShellHazard({ x: 0, y: 0 }, { x: 20, y: 0 }, [[HB(1, 0.5, 0.2)]], 1, 2), 0);
fx('hazard.receiverNamedOut', groundShellHazard({ x: 0, y: 0 }, { x: 20, y: 0 }, [[HB(2, 10, 0)]], 1, 2), 0);
fx('hazard.oneMetreAsideClear', groundShellHazard({ x: 0, y: 0 }, { x: 20, y: 0 }, [[HB(5, 3, 1)]], 1, 2), 0);
/* ⭐ the seed arithmetic (the ceiling is on the SIM lattice) */
const simSeedOk = (s: number): boolean => s >= SIM_LATTICE_TOP || (s >= BLOCK_BASE && s < SIM_CEILING);
fx('seeds.ceilingWouldBeCaught', simSeedOk(SIM_CEILING), false);
fx('seeds.topOfBlockOk', simSeedOk(BLOCK_TOP), true);
fx('seeds.scratchIsNotOnTheSimLattice', simSeedOk(SCRATCH_BASE), true);
fx('seeds.belowBlockWouldBeCaught', simSeedOk(BLOCK_BASE - 1), false);
/* — ⭐⭐⭐ OP-T1 NEW: every new predicate, a case where it FIRES and a case where it does NOT — */
/* the front man (the seam's partition 0 < along < 1.5 on the segment L→E = (0,0)→(20,0)) */
const FA = (px: number, py: number): number => frontAlongOf(0, 0, 20, 0, px, py);
fx('front.fires.oneMetreAheadOnTheLine', isFrontManOf(FA(1, 0)), true);
fx('front.fires.oneMetreAheadThreeAside', isFrontManOf(FA(1, 3)), true);          // no lateral bound (the seam's)
fx('front.fires.justUnderTheRadius', isFrontManOf(FA(1.4999, 0.5)), true);
fx('front.not.behindTheKicker', isFrontManOf(FA(-1, 0.5)), false);               // closest point clamps to L
fx('front.not.levelWithTheKicker', isFrontManOf(FA(0, 2)), false);
fx('front.not.atTheRadius', isFrontManOf(FA(1.5, 0)), false);
fx('front.not.beyondTheRadius', isFrontManOf(FA(3, 0.5)), false);
fx('front.not.degenerateSegment', isFrontManOf(frontAlongOf(0, 0, 0, 0, 1, 0)), false);
/* ⭐ the front man IS the seam's partition: on a random sweep (Rng(FIXTURE_SEED)) with ONE live
 *  opponent, the shipped `laneOpennessFront` differs from `laneOpenness` ONLY where `isFrontManOf`
 *  fires, and DOES differ wherever it fires with the man inside CONTROL_RADIUS of the line. */
(() => {
  const r = new Rng(FIXTURE_SEED);
  let differOutside = 0; let insideNoDiffer = 0; let fired = 0; let notFired = 0;
  for (let i = 0; i < 4000; i++) {
    const L = { x: r.range(-40, 40), y: r.range(-25, 25) };
    const E = { x: L.x + r.range(-25, 25), y: L.y + r.range(-25, 25) };
    const o = { pos: { x: L.x + r.range(-3, 3), y: L.y + r.range(-3, 3) }, sentOff: false } as unknown as Player;
    const along = frontAlongOf(L.x, L.y, E.x, E.y, o.pos.x, o.pos.y);
    const cp = closestPointOnSegment(L, E, o.pos);
    const d = Math.hypot(cp.x - o.pos.x, cp.y - o.pos.y);
    const differ = laneOpennessFront(L, E, [o]) !== laneOpenness(L, E, [o]);
    if (isFrontManOf(along)) { fired += 1; if (d < CONTROL_RADIUS && !differ) insideNoDiffer += 1; }
    else { notFired += 1; if (differ) differOutside += 1; }
  }
  fx('front.isTheSeamPartition.differOnlyWhereItFires', differOutside, 0);
  fx('front.isTheSeamPartition.differsInsideControlRadius', insideNoDiffer, 0);
  fx('front.isTheSeamPartition.bothSidesLive', fired > 200 && notFired > 200, true);
})();
/* the backward pass (attackDir ±1) */
fx('backward.fires.againstAttackDirPlus', isBackwardOf(10, 4, 1), true);
fx('backward.fires.againstAttackDirMinus', isBackwardOf(10, 16, -1), true);
fx('backward.not.forward', isBackwardOf(10, 16, 1), false);
fx('backward.not.square', isBackwardOf(10, 10, 1), false);
/* the possession step */
fx('poss.opens.fromNone', possessionStepOf(-1, 0), { closes: false, opens: true });
fx('poss.closesAndOpens.onAFlip', possessionStepOf(0, 1), { closes: true, opens: true });
fx('poss.closes.toNone', possessionStepOf(1, -1), { closes: true, opens: false });
fx('poss.not.sameSideContinues', possessionStepOf(0, 0), { closes: false, opens: false });
fx('poss.not.noneStaysNone', possessionStepOf(-1, -1), { closes: false, opens: false });
/* the pass attempt */
fx('passAttempt.fires', isPassAttemptOf(1), true);
fx('passAttempt.not', isPassAttemptOf(0), false);
/* the release and the dispossession */
fx('released.fires.pass', releasedOf(1, 0, 0, false, true), true);
fx('released.fires.shot', releasedOf(0, 1, 0, false, true), true);
fx('released.fires.clearance', releasedOf(0, 0, 1, false, true), true);
fx('released.fires.newPendingPass', releasedOf(0, 0, 0, true, true), true);
fx('released.fires.deadBall', releasedOf(0, 0, 0, false, false), true);
fx('released.not.carrying', releasedOf(0, 0, 0, false, true), false);
fx('dispossession.fires', isDispossessionOf(0, 1, false), true);
fx('dispossession.not.afterARelease', isDispossessionOf(0, 1, true), false);
fx('dispossession.not.sameSide', isDispossessionOf(0, 0, false), false);
fx('dispossession.not.noPriorOwner', isDispossessionOf(-1, 1, false), false);
/* the pressed decision tick (pressure strictly above the parsed 0.5) */
fx('pressed.fires', isPressedOf(0.51), true);
fx('pressed.not.atTheThreshold', isPressedOf(0.5), false);
fx('pressed.not.low', isPressedOf(0.1), false);
fx('pressed.pressureAtIsCalled', isPressedOf(pressureAt({ x: 0, y: 0 },
  [{ pos: { x: 1, y: 0 }, sentOff: false } as unknown as Player])), true);   // 1 − 1/6 > 0.5
fx('pressed.pressureAtFarIsNot', isPressedOf(pressureAt({ x: 0, y: 0 },
  [{ pos: { x: 4, y: 0 }, sentOff: false } as unknown as Player])), false);  // 1 − 4/6 < 0.5
/* the action-mix buckets */
fx('mix.pass', ['Pass', 'LoftedPass', 'ThroughBall', 'Cross'].map(mixOf), [0, 0, 0, 0]);
fx('mix.dribble', mixOf('Dribble'), 1);
fx('mix.hold', ['HoldUp', 'ShieldHold', 'HoldPosition'].map(mixOf), [2, 2, 2]);
fx('mix.shoot', mixOf('Shoot'), 3);
fx('mix.other', ['ClearBall', 'ThrowOut', 'MakeRun'].map(mixOf), [4, 4, 4]);
/* the band's breach law and the read precedence (pure; fixtured here, applied at §11) */
fx('breach.ceiling.upBeyondResolved', breachOf('ceiling', 2, true, 1), 'UP');
fx('breach.not.ceilingDown', breachOf('ceiling', -2, true, 1), 'none');
fx('breach.floor.downBeyondResolved', breachOf('floor', -2, true, 1), 'DOWN');
fx('breach.not.floorUp', breachOf('floor', 2, true, 1), 'none');
fx('breach.both.down', breachOf('both', -2, true, 1), 'DOWN');
fx('breach.not.unresolved', breachOf('both', 5, false, 1), 'none');
fx('breach.not.insideTolerance', breachOf('both', 0.9, true, 1), 'none');
fx('read.liveness', readWordFrom(false, true, true), 'noRead');
fx('read.step1.bandsBreached', readWordFrom(true, false, true), 'read2');
fx('read.step1.beatsFixes', readWordFrom(true, false, true) === readWordFrom(true, false, false), true);
fx('read.step2.fixes', readWordFrom(true, true, true), 'read1');
fx('read.step3.neither', readWordFrom(true, true, false), 'read3');
fx('read.fallback.absent', readWordFrom(true, undefined, true), 'fallback');
fx('read.fallback.absentFixes', readWordFrom(true, true, undefined), 'fallback');
fx('fixes.fires.resolvedDown', fixesOf(-0.02, -0.01), true);
fx('fixes.not.straddles', fixesOf(-0.02, 0.01), false);
fx('fixes.not.resolvedUp', fixesOf(0.01, 0.02), false);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
banner(`OP-T1 fixtures ${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length}`);
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
/** OP-C1's ROW_SCHEMA (OP-C1 l.781–794), COPIED key for key — the sub-row gRepro compares. */
const OPC1_ROW_SCHEMA = {
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
/** OP-C2's row = OP-C1's row, then OP-C2's keys (OP-C2 l.939–962, COPIED key for key — the sub-row gRepro compares). */
const OPC2_ROW_SCHEMA = {
  ...OPC1_ROW_SCHEMA,
  /* QC — every struck-through ball: seat × QA reading × decider */
  qcReadDec: 3 * 4 * N_DEC,
  /* QC — the guardSkip balls: the deciding price at the choice */
  qcGsSnapBand: N_BANDS,                    // snapshot-seated: the chosen option's band (−1 … 4)
  qcGsGcCell: GC_CELLS.length,              // groundCandidate-seated: the gate as the engine writes it
  qcGsGcLaneBin: GC_LANE_EDGES.length,      // …its `lane` at the choice
  qcGsGcHazard: 2,                          // …the shell hazard's value (0 · 1) as the engine computes it
  qcGsGcSeatArmed: 1,                       // …receipt: the GC seat was armed (the engine computes the hazard)
  /* QC — the guardSkip balls: snapshot membership and distances, by decider */
  qcGsPresence: N_DEC * 4,
  qcGsDistChoice: N_DEC * N_PD,
  qcGsDistRelease: N_DEC * N_PD,
  qcGsClose: N_DEC * N_CLOSE,
  qcGsClosed: N_DEC,
  qcGsDist2D: N_PD * N_PD,
  qcGsPath: 4,                              // [wind-up · synchronous] × [not closed · closed]
  qcGsZoneAtRelease: 1,                     // the contacting man was in the release zone
  /* QD — every ground release: seat × decider × [zone empty · zone occupied] × outcome */
  qd: 3 * N_DEC * 2 * QD_OUT.length,
  /* QD beside: the zone-occupied releases split by OP-C1's own along edge 0 — [every zone man behind the kicker (t < 0) · at least one at 0 ≤ t < 1.5] × outcome */
  qdZoneAhead: 2 * QD_OUT.length,
} as const;
/** ⭐OP-T1 THE EXAM'S ROW = OP-C2's row, then the NEW keys (all written only by ⭐OP-T1 lines). */
const ROW_SCHEMA = {
  ...OPC2_ROW_SCHEMA,
  /* the door, read off the walked match (gArmOP; the ONE new registered ledger read) */
  opFlag: 1,
  /* THE FRONT MAN (the seam's partition 0 < along < 1.5 on L→E at RELEASE) */
  frontRel: 1,                 // ground releases with ≥ 1 front man
  frontManFirst: 1,            // …of which a front man was the first body
  frontByDecider: N_DEC,       // …by OP-C2's decider attribution (the RE-SEAT face, M-OP.4)
  backGround: 1,               // ground releases aimed against the own attack direction
  /* THE POSSESSIONS (S1 · S3 · the faces) */
  possN: 1, possPasses: 1, possGround: 1, possNoPass: 1, possTicks: 1,
  /* THE DISPOSSESSIONS (S2) and the engine's own won-tackle counter beside */
  dispossessions: 1, tacklesStat: 1,
  /* THE PRESSED CARRIER (pressure > 0.5 at a fresh carrier decision) */
  carrierDecisions: 1, pressedDecisions: 1, pressedMix: MIX.length, pressedTypeIsTop: 1,
  /* THE BAND F-DS-b's own cells (IF-T1b l.2979–2987, l.2757–2762), not already in OP-C2's row */
  goals: 1, shots: 1, xgSum: 1, interceptions: 1, offsides: 1, throughBallsStat: 1,
  possTime: 2, aimDistSum: 1, aimDistCount: 1,
} as const;
type RowKey = keyof typeof ROW_SCHEMA;
const ROW_KEYS = Object.keys(ROW_SCHEMA) as RowKey[];
const OPC0_KEYS = Object.keys(OPC0_ROW_SCHEMA) as (keyof typeof OPC0_ROW_SCHEMA)[];
const OPC1_KEYS = Object.keys(OPC1_ROW_SCHEMA) as (keyof typeof OPC1_ROW_SCHEMA)[];
const OPC2_KEYS = Object.keys(OPC2_ROW_SCHEMA) as (keyof typeof OPC2_ROW_SCHEMA)[];
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
const opc2SubRow = (r: Row): Record<string, number[]> => Object.fromEntries(OPC2_KEYS.map((k) => [k, r[k]]));

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
  /** ⭐ OP-C2: groundCandidate's shell hazard at the choice (CALLED at the pre-step positions),
   *  and whether the GC seat was armed (`deliveryValueSeatOf(team.genome) !== null`). */
  gcHazard: number | null; gcSeatArmed: boolean;
}
interface Windup { key: string; gid: number; targetGid: number; eX: number; eY: number;
  hasLead: boolean; leadM: number; choice: ChoiceRec; dec: DecRec;
  /** ⭐ OP-C2: every body's PRE-STEP position on the choice (arm) step. */
  choicePre: Float64Array }
interface Flight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number; klassI: number;
  lx: number; ly: number; eX: number; eY: number; hasLine: boolean; launchVx: number; launchVy: number;
  seat: Seat; leadM: number; choice: ChoiceRec | null;
  corr: Set<number>; corrT: Set<number>; oppAtRelease: Map<number, { x: number; y: number }>;
  actAtRelease: Map<number, string>;
  dec: DecRec | null; prx: number; pry: number;
  /** ⭐ OP-C2: the choice step's pre-step positions, the path, and the release zone's men. */
  choicePre: Float64Array | null; viaWindup: boolean; zone: Set<number>; zoneAhead: boolean;
  /** ⭐OP-T1: the front men at release (the seam's partition). */
  front: Set<number>;
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
    whyParsed: false, whyMateIsTarget: false, whyLaneAgrees: false, gcHazard: null, gcSeatArmed: false };
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
    /* ⭐ OP-C2: the GC shell hazard AS THE ENGINE COMPUTES IT — `groundShellHazard(p.pos, aim,
     *  [team.players, opp.players], p.gid, mate.gid)` (PlayerBrain l.552–553, l.713–714), CALLED with
     *  both teams' bodies at the PRE-STEP positions (each with its own `sentOff` and `coreRadius`) */
    const bodyAt = (q: Player): Player => ({ gid: q.gid, pos: { x: pre[q.gid * 2], y: pre[q.gid * 2 + 1] },
      sentOff: q.sentOff, coreRadius: q.coreRadius }) as unknown as Player;
    rec.gcSeatArmed = deliveryValueSeatOf(team.genome) !== null;
    rec.gcHazard = groundShellHazard({ x: pxp, y: pyp }, aim,
      [team.players.map(bodyAt), m.teams[1 - side].players.map(bodyAt)], passer.gid, targetGid);
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
interface WalkOut { signature: string; worldOk: boolean; wallMs: number; row: Row; trajectory: string }
/** ⭐OP-T1 THE TRAJECTORY DIGEST — a 32-bit FNV-1a folded over EVERY stepped tick's public state (the
 *  tick, the ball's position and velocity, the match rng state, every body's position): two walks of
 *  the same seed have the same digest iff their trajectories coincide tick for tick (up to a 2⁻³²
 *  collision). It is gBiteOP's ELIGIBILITY (§DEVIATIONS 1): the door changed the match iff the
 *  candidate's digest differs from the control's. Pure reads; gLockstep proves the walk inert. */
const TRAJ_BUF = new Float64Array(64);
const TRAJ_WORDS = new Uint32Array(TRAJ_BUF.buffer);
const foldTick = (h: number, m: Match): number => {
  const ps = m.allPlayers;
  let k = 0;
  TRAJ_BUF[k++] = m.simTick; TRAJ_BUF[k++] = m.ball.pos.x; TRAJ_BUF[k++] = m.ball.pos.y;
  TRAJ_BUF[k++] = m.ball.vel.x; TRAJ_BUF[k++] = m.ball.vel.y; TRAJ_BUF[k++] = (m.rng as unknown as { s: number }).s;
  for (let i = 0; i < ps.length && k < 62; i++) { TRAJ_BUF[k++] = ps[i].pos.x; TRAJ_BUF[k++] = ps[i].pos.y; }
  let x = h;
  for (let i = 0; i < k * 2; i++) { x ^= TRAJ_WORDS[i]; x = Math.imul(x, 0x01000193) >>> 0; }
  return x;
};
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
  /* ⭐OP-T1 the door, read off the walked match (gArmOP) — the ONE new registered ledger read */
  const opOk = m.opFrontMan === ARM_OP[arm];
  row.opFlag[0] = m.opFrontMan ? 1 : 0;
  let curStep = 0;
  let traj = 0x811c9dc5; // ⭐OP-T1 the FNV-1a offset basis
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
  /* ⭐OP-T1 the walk-side state of the new predicates */
  let ownerPreGid = -1;
  let passKeyBefore = '';
  let lastOwnerSide: Side | -1 = m.ball.owner === null ? -1 : m.ball.owner.side as Side;
  let releasedSinceOwner = false;
  let prevPossSide: Side | -1 = mm.possessionSide;
  let possOpen: { side: Side; ticks: number; passes: number; ground: number } | null =
    prevPossSide === -1 ? null : { side: prevPossSide, ticks: 0, passes: 0, ground: 0 };
  const bookPossession = (q: { ticks: number; passes: number; ground: number }): void => {
    row.possN[0] += 1; row.possPasses[0] += q.passes; row.possGround[0] += q.ground;
    if (!isPassAttemptOf(q.passes)) row.possNoPass[0] += 1;
    row.possTicks[0] += q.ticks;
  };

  while (!m.finished) {
    curStep += 1;
    if (observe) {
      for (let i = 0; i < players.length; i++) {
        pre[i * 2] = players[i].pos.x; pre[i * 2 + 1] = players[i].pos.y; preScores[i] = players[i].action.scores;
      }
      preStale[0] = m.teams[0].staleTime; preStale[1] = m.teams[1].staleTime;
      ownerPreGid = m.ball.owner === null ? -1 : m.ball.owner.gid; // ⭐OP-T1
      passKeyBefore = mm.pendingPass === null ? '' // ⭐OP-T1 (IF-T1b l.2201–2202)
        : `${mm.pendingPass.t}|${mm.pendingPass.passerGid}|${mm.pendingPass.targetGid}`;
    }
    m.step(DT);
    row.ticks[0] += 1;
    traj = foldTick(traj, m); // ⭐OP-T1
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
        choice: choiceReadOf(m, players[rec.gid], rec.targetGid, eX, eY, curStep, pulls.get(rec.gid)), dec,
        choicePre: pre.slice() /* ⭐ OP-C2 */ };
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
          choicePre: null, viaWindup: false, zone: new Set(), zoneAhead: false, front: new Set(),
        };
        continue;
      }
      if (!isMeasurableGroundPass(rel.klass, ground, true)) { row.relGroundOther[0] += 1; continue; }
      row.relGround[0] += 1;
      if (possOpen !== null && possOpen.side === players[rel.gid].side) possOpen.ground += 1; // ⭐OP-T1
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
      const zone = new Set<number>(); // ⭐ OP-C2 QD: the men in the skip zone at RELEASE
      let zoneAhead = false;          // …and whether one of them is NOT behind the kicker (t ≥ 0)
      const front = new Set<number>(); // ⭐OP-T1 the front men at RELEASE (the seam's partition)
      if (isBackwardOf(lx, eX, m.teams[passerSide].attackDir)) row.backGround[0] += 1; // ⭐OP-T1
      for (const o of m.teams[1 - passerSide].players) {
        oppAtRelease.set(o.gid, { x: o.pos.x, y: o.pos.y });
        actAtRelease.set(o.gid, o.action.type as string);
        const gz = lineGeomOf(lx, ly, eX, eY, o.pos.x, o.pos.y);
        if (!o.sentOff && inSkipZoneOf(gz)) { zone.add(o.gid); if (zoneManAheadOf(gz)) zoneAhead = true; }
        if (!o.sentOff && isFrontManOf(frontAlongOf(lx, ly, eX, eY, o.pos.x, o.pos.y))) front.add(o.gid); // ⭐OP-T1
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
        choicePre: viaWindup ? (endedWindup as Windup).choicePre : pre.slice(), viaWindup, zone, zoneAhead,
        front, // ⭐OP-T1
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
    /* ---- ⭐⭐⭐ OP-T1 — THE NEW PER-STEP READS (pure observation of public state) ---- */
    /* the pressed carrier: the PRE-STEP owner's FRESH decision, the engine's pressure at the pre-step positions */
    if (ownerPreGid >= 0) {
      const cp0 = players[ownerPreGid];
      if (cp0.action.scores !== preScores[ownerPreGid]) {
        row.carrierDecisions[0] += 1;
        const oppsPre = m.teams[1 - cp0.side].players.map((o) => ({ pos: { x: pre[o.gid * 2], y: pre[o.gid * 2 + 1] },
          sentOff: o.sentOff })) as unknown as Player[];
        const pressure = pressureAt({ x: pre[ownerPreGid * 2], y: pre[ownerPreGid * 2 + 1] }, oppsPre);
        if (isPressedOf(pressure)) {
          row.pressedDecisions[0] += 1;
          row.pressedMix[mixOf(cp0.action.type as string)] += 1;
          if (cp0.action.scores.length > 0 && cp0.action.scores[0].action === cp0.action.type) row.pressedTypeIsTop[0] += 1;
        }
      }
    }
    /* G8 — the aim distance at the tick a NEW pendingPass appears (IF-T1b l.2711, l.2757–2762) */
    {
      const passKey = pp === null ? '' : `${pp.t}|${pp.passerGid}|${pp.targetGid}`;
      if (pp !== null && passKey !== passKeyBefore) {
        const pq = players[pp.passerGid]; const tq = players[pp.targetGid];
        if (pq !== undefined && tq !== undefined) {
          row.aimDistCount[0] += 1;
          row.aimDistSum[0] += Math.hypot(pq.pos.x - tq.pos.x, pq.pos.y - tq.pos.y);
        }
      }
    }
    /* S2 — the dispossession */
    if (lastOwnerSide !== -1 && releasedOf(d.passes[lastOwnerSide], d.shots[lastOwnerSide], d.clearances[lastOwnerSide],
      passChangedHere && pp !== null && pp.side === lastOwnerSide, m.phase === 'playing')) releasedSinceOwner = true;
    if (ball.owner !== null) {
      const ns = ball.owner.side as Side;
      if (isDispossessionOf(lastOwnerSide, ns, releasedSinceOwner)) row.dispossessions[0] += 1;
      lastOwnerSide = ns; releasedSinceOwner = false;
    }
    /* S1 · S3 — the possession: credit this step's passes to the open one, then close / open */
    if (possOpen !== null) possOpen.passes += d.passes[possOpen.side];
    {
      const cur = mm.possessionSide;
      const st = possessionStepOf(prevPossSide, cur);
      if (st.closes && possOpen !== null) { bookPossession(possOpen); possOpen = null; }
      if (st.opens) possOpen = { side: cur as Side, ticks: 0, passes: 0, ground: 0 };
      if (possOpen !== null) possOpen.ticks += 1;
      prevPossSide = cur;
    }
    for (const q of players) prevAct.set(q.gid, q.action.type as string);
  }
  if (observe && flight !== null) bookFlight(row, flight, 'none', null, 0, 0, prevAct);
  /* ⭐OP-T1 full time: the open possession closes; the band's own end-of-match cells (IF-T1b l.2978–2987) */
  if (observe && possOpen !== null) { bookPossession(possOpen); possOpen = null; }
  {
    const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<string, number>[];
    row.goals[0] = st[0].goals + st[1].goals;
    row.shots[0] = st[0].shots + st[1].shots;
    row.interceptions[0] = st[0].interceptions + st[1].interceptions;
    row.offsides[0] = st[0].offsides + st[1].offsides;
    row.throughBallsStat[0] = st[0].throughBalls + st[1].throughBalls;
    row.possTime[0] = st[0].possessionTime; row.possTime[1] = st[1].possessionTime;
    row.xgSum[0] = m.shotLog.reduce((a, e) => a + e.xg, 0);
    row.tacklesStat[0] = st[0].tackles + st[1].tackles;
  }
  row.passesStat[0] = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.passesCompletedStat[0] = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  return { signature: signatureOf(m), worldOk: worldOk && opOk, wallMs: Date.now() - t0, row,
    trajectory: traj.toString(16).padStart(8, '0') };
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
  /* ---- ⭐⭐⭐ OP-C2 QD — every ground release: was a man in the skip zone at RELEASE, and who
   *      touched first (seat × decider × zone × outcome) ---- */
  const di = DECIDERS.indexOf(deciderOfQb(dec === null ? 'unread' : dec.qb));
  const zi = f.zone.size > 0 ? 1 : 0;
  const qo = qdOutOf(isOpp, isOpp ? (body as Player).gid : null, f.zone);
  row.qd[((si * N_DEC + di) * 2 + zi) * QD_OUT.length + QD_OUT.indexOf(qo)] += 1;
  if (zi === 1) row.qdZoneAhead[(f.zoneAhead ? 1 : 0) * QD_OUT.length + QD_OUT.indexOf(qo)] += 1;
  /* ---- ⭐⭐⭐ OP-T1 — THE FRONT-MAN FACES and THE RE-SEAT FACE (M-OP.4) ---- */
  if (f.front.size > 0) {
    row.frontRel[0] += 1;
    row.frontByDecider[di] += 1;
    if (isOpp && f.front.has((body as Player).gid)) row.frontManFirst[0] += 1;
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
    /* ---- ⭐⭐⭐ OP-C2 QC — the QA reading (the SAME call as the line above) × the decider ---- */
    const reading = readingOf(g, movedOf(gR.lat, g.lat));
    row.qcReadDec[(si * 4 + READINGS.indexOf(reading)) * N_DEC + di] += 1;
    if (reading === 'guardSkip') {
      /* the deciding price at the choice, off the decider's own record */
      if (dec !== null && DECIDERS[di] === 'snapshot' && dec.snapBand !== null) row.qcGsSnapBand[dec.snapBand + 1] += 1;
      if (dec !== null && DECIDERS[di] === 'groundCandidate' && dec.gcLane !== null && dec.gcGain !== null) {
        row.qcGsGcCell[GC_CELLS.indexOf(gcCellOf(dec.gcLane, dec.gcGain))] += 1;
        row.qcGsGcLaneBin[edgeBinOf(dec.gcLane, GC_LANE_EDGES)] += 1;
        row.qcGsGcHazard[dec.gcHazard === 1 ? 1 : 0] += 1;
        if (dec.gcSeatArmed) row.qcGsGcSeatArmed[0] += 1;
      }
      /* was he in the passer's snapshot at the choice */
      row.qcGsPresence[di * 4 + PRESENCES.indexOf(membershipOf(c, b.gid))] += 1;
      /* his distance to the passer at the CHOICE (pre-step positions on the choice step) and at the
       * RELEASE (OP-C1's release-tick read), and the closing between them */
      const cp = f.choicePre;
      const dRel = Math.hypot(at.x - f.prx, at.y - f.pry);
      const dCh = cp === null ? dRel
        : Math.hypot(cp[b.gid * 2] - cp[f.passerGid * 2], cp[b.gid * 2 + 1] - cp[f.passerGid * 2 + 1]);
      const bc = edgeBinOf(dCh, PASSER_DIST_EDGES); const br = edgeBinOf(dRel, PASSER_DIST_EDGES);
      row.qcGsDistChoice[di * N_PD + bc] += 1;
      row.qcGsDistRelease[di * N_PD + br] += 1;
      row.qcGsDist2D[bc * N_PD + br] += 1;
      row.qcGsClose[di * N_CLOSE + edgeBinOf(dCh - dRel, CLOSE_EDGES)] += 1;
      const closed = closedOf(dCh, dRel);
      if (closed) row.qcGsClosed[di] += 1;
      row.qcGsPath[(f.viaWindup ? 0 : 2) + (closed ? 1 : 0)] += 1;
      if (f.zone.has(b.gid)) row.qcGsZoneAtRelease[0] += 1;
    }
  }
};

/* ========================================================================== */
/* §9 THE FACES — OP-C2's cell-addressed form (l.1514–1518, l.1681–1698),       */
/*    the copied faces byte for byte, then the exam's own (⭐OP-T1)             */
/* ========================================================================== */
interface FaceDef { name: string; num: string[]; den: string[] }
const cells = (k: RowKey, idx: number[]): string[] => idx.map((i) => `${k}.${i}`);
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);
const FACE_DEFS: FaceDef[] = [];
const face = (name: string, num: string[], den: string[]): void => { FACE_DEFS.push({ name, num, den }); };
/* — THE WIN FACE, OP-C0's `fb.ground.*` by field (OP-C2 l.1519–1520, COPIED) — */
const ALL_GROUND = cells('fbG', range(4));
CONTACTS.forEach((c, i) => face(`fb.ground.${c}`, cells('fbG', [i]), ALL_GROUND));
/* — OP-C2's QD faces by field name (OP-C2 l.1660–1678, COPIED) — */
const NQ = QD_OUT.length;
const qdIdx = (s: number, di: number, zi: number, oi: number): number => ((s * N_DEC + di) * 2 + zi) * NQ + oi;
const qdCells = (ss: number[], ds: number[], zs: number[], os: number[]): string[] =>
  cells('qd', ss.flatMap((s) => ds.flatMap((d) => zs.flatMap((z) => os.map((o) => qdIdx(s, d, z, o))))));
const qdFaces = (tag: string, ss: number[], ds: number[]): void => {
  face(`${tag}.zoneShare`, qdCells(ss, ds, [1], range(NQ)), qdCells(ss, ds, [0, 1], range(NQ)));
  face(`${tag}.zone.zoneManFirst`, qdCells(ss, ds, [1], [0]), qdCells(ss, ds, [1], range(NQ)));
  face(`${tag}.zone.otherOppFirst`, qdCells(ss, ds, [1], [1]), qdCells(ss, ds, [1], range(NQ)));
  face(`${tag}.zone.anyOppFirst`, qdCells(ss, ds, [1], [0, 1]), qdCells(ss, ds, [1], range(NQ)));
  face(`${tag}.zone.notOppFirst`, qdCells(ss, ds, [1], [2]), qdCells(ss, ds, [1], range(NQ)));
  face(`${tag}.noZone.anyOppFirst`, qdCells(ss, ds, [0], [0, 1]), qdCells(ss, ds, [0], range(NQ)));
  face(`${tag}.noZone.notOppFirst`, qdCells(ss, ds, [0], [2]), qdCells(ss, ds, [0], range(NQ)));
};
qdFaces('qd', [0, 1, 2], range(N_DEC));
face('qd.zone.aheadShare', cells('qdZoneAhead', range(NQ).map((o) => NQ + o)), cells('qdZoneAhead', range(2 * NQ)));
face('qd.zoneAhead.zoneManFirst', cells('qdZoneAhead', [NQ]), cells('qdZoneAhead', range(NQ).map((o) => NQ + o)));
face('qd.zoneAhead.anyOppFirst', cells('qdZoneAhead', [NQ, NQ + 1]), cells('qdZoneAhead', range(NQ).map((o) => NQ + o)));
face('qd.zoneBehindOnly.zoneManFirst', cells('qdZoneAhead', [0]), cells('qdZoneAhead', range(NQ)));
face('qd.zoneBehindOnly.anyOppFirst', cells('qdZoneAhead', [0, 1]), cells('qdZoneAhead', range(NQ)));
/* — OP-C1 / OP-C2's decider share over all ground releases (OP-C2 l.1574, l.1579, l.1584, COPIED) — */
const QB_ALL = cells('qbAll', range(10));
const SNAP_I = [0, 1, 2];
face('qb.all.decider.snapshot', cells('qbAll', SNAP_I), QB_ALL);
/* — ⭐OP-T1 THE FRONT-MAN FACES (the seam's partition) and THE RE-SEAT FACE (M-OP.4) — */
face('front.share', cells('frontRel', [0]), cells('relGround', [0]));
face('front.manFirst', cells('frontManFirst', [0]), cells('frontRel', [0]));
DECIDERS.forEach((d, di) => face(`front.reseat.${d}`, cells('frontByDecider', [di]), cells('frontByDecider', range(N_DEC))));
/* — ⭐OP-T1 THE BAND F-DS-b (IF-T1b l.4452–4481: the same numerators and denominators) — */
face('guard.goalsPerMatch', cells('goals', [0]), []);
face('guard.shotsPerMatch', cells('shots', [0]), []);
face('guard.xgConversion', cells('goals', [0]), cells('xgSum', [0]));
face('guard.passCompletion', cells('passesCompletedStat', [0]), cells('passesStat', [0]));
face('guard.interceptionsPerMatch', cells('interceptions', [0]), []);
face('guard.possessionShareSideA', cells('possTime', [0]), cells('possTime', [0, 1]));
face('guard.passesPerMatch', cells('passesStat', [0]), []);
face('guard.meanAimDistanceMetres', cells('aimDistSum', [0]), cells('aimDistCount', [0]));
face('guard.throughBallsPerMatch', cells('throughBallsStat', [0]), []);
face('guard.offsidesPerMatch', cells('offsides', [0]), []);
/* — ⭐OP-T1 THE 传不出去 BAND S1–S3 (#433 item 3(iii)) — */
face('s1.passesPerPossession', cells('possPasses', [0]), cells('possN', [0]));
face('s2.dispossessionsPerMatch', cells('dispossessions', [0]), []);
face('s3.possessionsEndingWithoutAPassAttempt', cells('possNoPass', [0]), cells('possN', [0]));
/* — ⭐OP-T1 THE 传不出去 FACES (#433 item 3(iv)), no verdict word — */
face('stuck.groundPassAttemptsPerPossession', cells('possGround', [0]), cells('possN', [0]));
MIX.forEach((k, i) => face(`stuck.pressedMix.${k}`, cells('pressedMix', [i]), cells('pressedMix', range(MIX.length))));
face('stuck.pressedShareOfCarrierDecisions', cells('pressedDecisions', [0]), cells('carrierDecisions', [0]));
face('stuck.pressedDecisionsPerMatch', cells('pressedDecisions', [0]), []);
face('stuck.pressedTypeIsTopCandidateShare', cells('pressedTypeIsTop', [0]), cells('pressedDecisions', [0]));
face('stuck.backwardShareOfGroundReleases', cells('backGround', [0]), cells('relGround', [0]));
face('stuck.possessionMeanTicks', cells('possTicks', [0]), cells('possN', [0]));
face('stuck.possessionsPerMatch', cells('possN', [0]), []);
face('beside.groundReleasesPerMatch', cells('relGround', [0]), []);
face('beside.wonTacklesPerMatch', cells('tacklesStat', [0]), []);
const FACE_NAMES = FACE_DEFS.map((f) => f.name);
const FACE_IDX = FACE_DEFS.map((f) => ({ num: f.num.map((k) => FLAT_INDEX[k]), den: f.den.map((k) => FLAT_INDEX[k]) }));
const FACE_DEFS_OK = FACE_IDX.every((f) => f.num.every((i) => i !== undefined) && f.den.every((i) => i !== undefined))
  && new Set(FACE_NAMES).size === FACE_NAMES.length;
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den); // IF-T1b l.171
/** per-seed numerator / denominator of every face (den = 1 per match when the face's den is empty). */
const seedNumDen = (flat: number[], fi: number): [number, number] => {
  const f = FACE_IDX[fi];
  return [f.num.reduce((s, i) => s + flat[i], 0), f.den.length === 0 ? 1 : f.den.reduce((s, i) => s + flat[i], 0)];
};
interface FaceVal { num: number; den: number; value: number | null; lo: number | null; hi: number | null }
const fin = (x: number): number | null => (Number.isFinite(x) ? x : null);

/* ========================================================================== */
/* §10 THE ESTIMATOR — IF-T1b's CLUSTER BOOTSTRAP over match seeds (l.4404–4410, */
/*     l.5205–5258): 2,000 draws, Rng(BLOCK_BASE), ratio of resampled sums       */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
const estimate = (flatsByArm: Record<Arm, number[][]>) => {
  const n = flatsByArm[ARMS[0]].length;
  const rngBoot = new Rng(BLOCK_BASE);
  const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
    .from({ length: n }, () => Math.floor(rngBoot.next() * n) % n));
  const nd = {} as Record<Arm, [number[], number[]][]>;
  for (const a of ARMS) nd[a] = FACE_DEFS.map((_, fi) => {
    const nu: number[] = []; const de: number[] = [];
    for (const fl of flatsByArm[a]) { const [x, y] = seedNumDen(fl, fi); nu.push(x); de.push(y); }
    return [nu, de];
  });
  const sum = (xs: number[]): number => xs.reduce((s, x) => s + x, 0);
  const levels = {} as Record<Arm, Record<string, FaceVal>>;
  for (const a of ARMS) {
    levels[a] = {};
    FACE_DEFS.forEach((f, fi) => {
      const [nu, de] = nd[a][fi];
      const draws: number[] = [];
      for (const idx of resampleIndex) {
        let x = 0; let y = 0;
        for (const i of idx) { x += nu[i]; y += de[i]; }
        const v = ratio(x, y); if (Number.isFinite(v)) draws.push(v);
      }
      draws.sort((p, q) => p - q);
      levels[a][f.name] = { num: sum(nu), den: sum(de), value: fin(ratio(sum(nu), sum(de))),
        lo: fin(pctl(draws, 0.025)), hi: fin(pctl(draws, 0.975)) };
    });
  }
  interface DeltaRow { face: string; contrast: Cid; arm: Arm; controlArm: Arm; armValue: number | null;
    controlValue: number | null; delta: number | null; lo: number | null; hi: number | null;
    halfWidth: number | null; resolved: boolean; up: boolean; down: boolean }
  const deltas: Record<Cid, Record<string, DeltaRow>> = {} as Record<Cid, Record<string, DeltaRow>>;
  for (const cid of CONTRASTS) {
    deltas[cid] = {};
    const A = TREAT_OF[cid]; const C = CTRL_OF[cid];
    FACE_DEFS.forEach((f, fi) => {
      const [nA, dA] = nd[A][fi]; const [nC, dC] = nd[C][fi];
      const point = ratio(sum(nA), sum(dA)) - ratio(sum(nC), sum(dC));
      const draws: number[] = [];
      for (const idx of resampleIndex) {
        let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
        for (const i of idx) { n1 += nA[i]; d1 += dA[i]; n2 += nC[i]; d2 += dC[i]; }
        const v = ratio(n1, d1) - ratio(n2, d2);
        if (Number.isFinite(v)) draws.push(v);
      }
      draws.sort((p, q) => p - q);
      const lo = pctl(draws, 0.025); const hi = pctl(draws, 0.975);
      deltas[cid][f.name] = { face: f.name, contrast: cid, arm: A, controlArm: C,
        armValue: fin(ratio(sum(nA), sum(dA))), controlValue: fin(ratio(sum(nC), sum(dC))), delta: fin(point),
        lo: fin(lo), hi: fin(hi), halfWidth: fin((hi - lo) / 2),
        resolved: hi < 0 || lo > 0, up: lo > 0, down: hi < 0 };
    });
  }
  return { levels, deltas, nSeeds: n };
};

/* ========================================================================== */
/* §11 THE BANDS, THE WIN FACE AND THE READS (#433 item 3, FROZEN)              */
/* ========================================================================== */
/** F-DS-b, G1–G9 + the G10 FLAG — inherited unchanged from IF-T1b BY ANCHOR (§3). */
const BAND_G: readonly { id: string; key: string; direction: BandDir }[] = [
  { id: 'G1', key: 'guard.goalsPerMatch', direction: 'both' },
  { id: 'G2', key: 'guard.shotsPerMatch', direction: 'both' },
  { id: 'G3', key: 'guard.xgConversion', direction: 'both' },
  { id: 'G4', key: 'guard.passCompletion', direction: 'floor' },
  { id: 'G5', key: 'guard.interceptionsPerMatch', direction: 'ceiling' },
  { id: 'G6', key: 'guard.possessionShareSideA', direction: 'both' },
  { id: 'G7', key: 'guard.passesPerMatch', direction: 'both' },
  { id: 'G8', key: 'guard.meanAimDistanceMetres', direction: 'both' },
  { id: 'G9', key: 'guard.throughBallsPerMatch', direction: 'both' },
];
/** ⭐ THE 传不出去 BAND (#433 item 3(iii)): S1 FLOOR · S2 CEILING · S3 CEILING, the same breach law. */
const BAND_S: readonly { id: string; key: string; direction: BandDir }[] = [
  { id: 'S1', key: 's1.passesPerPossession', direction: 'floor' },
  { id: 'S2', key: 's2.dispossessionsPerMatch', direction: 'ceiling' },
  { id: 'S3', key: 's3.possessionsEndingWithoutAPassAttempt', direction: 'ceiling' },
];
const WIN_FACE = 'fb.ground.opponent';
/** ⭐ THE THREE FROZEN READS + THE FALLBACK + THE LIVENESS STRING — #433 item 3(v), CHARACTER FOR
 *  CHARACTER; cross-checked against the ruling and the exam doc's §P on normalised prose. */
const READ_LITERALS = {
  read1: 'THE MAN IN FRONT IS COUNTED AND THE BALL HITS THE OTHER TEAM LESS, AT NO COST THE BANDS CAN SEE — '
    + 'OP-ENTRY is named (world 19 = 18 + opFrontMan).',
  read2: 'COUNTING THE MAN IN FRONT COSTS A FACE — the breached limb is named and the fork goes to the user '
    + '(the cost of 甲 is the user\'s to weigh).',
  read3: 'COUNTING THE MAN IN FRONT DOES NOT MOVE THE SENTENCE — the commander decides with the table (the '
    + 'held target chooser, M-OP.4, is the first door to look at).',
  fallback: 'THE READS DO NOT COVER THE SHAPE — the commander decides with the table.',
  noRead: 'THE SEAT DID NOT FIRE — no read',
} as const;
const RULINGS_PATH = 'docs/world-model/PROGRAMME-RULINGS.md';
/** the house normaliser (IF-T1b l.5489–5493) WIDENED to strip NESTED blockquote markers: the ruling
 *  quotes the reads inside a blockquote inside the ruling's own blockquote (`>    > …`). */
const normaliseProse = (t: string): string => t
  .split(String.fromCharCode(10)).map((l) => l.replace(/^(\s*>\s?)+/, '')).join(' ')
  .replace(/[*`]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const READ_LITERAL_HOMES = (() => {
  const rulingText = existsSync(RULINGS_PATH) ? readFileSync(RULINGS_PATH, 'utf8') : '';
  const at = rulingText.indexOf('COMMANDER RULING #433 ');
  const homes = [
    { home: `${RULINGS_PATH} (ruling #433 item 3(v), its FIRST home)`,
      text: at < 0 ? '' : normaliseProse(rulingText.slice(at)) },
    { home: `${DOC_PATH} §P (the second home)`,
      text: existsSync(DOC_PATH) ? normaliseProse(readFileSync(DOC_PATH, 'utf8')) : '' },
  ];
  const rows = (Object.keys(READ_LITERALS) as (keyof typeof READ_LITERALS)[]).flatMap((w) => homes.map((h) => ({
    literal: w, home: h.home, found: h.text.includes(normaliseProse(READ_LITERALS[w])) })));
  return { rows, ok: rows.length === 10 && rows.every((r) => r.found) };
})();
/** OP-C2's per-row partition checks (OP-C2 l.1915–1974), COPIED byte for byte. */
const total = (r: Row, k: RowKey): number => r[k].reduce((x, y) => x + y, 0);
const rowPartitionOk = (r: Row): { opc0: boolean; qa: boolean; qb: boolean; qc: boolean; qd: boolean } => {
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
  /* ⭐ QC: reading × decider sums, per seat AND per reading, to OP-C1's own `qaReading` cell; the
   *  guardSkip balls' membership / distance / closing / 2-D / path tables each sum to the guardSkip
   *  count, per decider; the snapshot band table to the snapshot-seated guardSkip count; the gc
   *  tables to the groundCandidate-seated guardSkip count */
  const sumIdx = (k: RowKey, idx: number[]): number => idx.reduce((x, i) => x + r[k][i], 0);
  const qcDec = (ri: number, di: number): number => [0, 1, 2].reduce((x, s) => x + r.qcReadDec[(s * 4 + ri) * N_DEC + di], 0);
  const gsByDec = range(N_DEC).map((di) => qcDec(0, di));
  const gs = gsByDec.reduce((x, y) => x + y, 0);
  const qc = struck === total(r, 'qcReadDec')
    && [0, 1, 2].every((s) => range(4).every((ri) =>
      sumIdx('qcReadDec', range(N_DEC).map((di) => (s * 4 + ri) * N_DEC + di)) === r.qaReading[s * 4 + ri]))
    && range(N_DEC).every((di) => sumIdx('qcGsPresence', range(4).map((j) => di * 4 + j)) === gsByDec[di]
      && sumIdx('qcGsDistChoice', range(N_PD).map((j) => di * N_PD + j)) === gsByDec[di]
      && sumIdx('qcGsDistRelease', range(N_PD).map((j) => di * N_PD + j)) === gsByDec[di]
      && sumIdx('qcGsClose', range(N_CLOSE).map((j) => di * N_CLOSE + j)) === gsByDec[di]
      && r.qcGsClosed[di] <= gsByDec[di])
    && total(r, 'qcGsDist2D') === gs && total(r, 'qcGsPath') === gs && r.qcGsZoneAtRelease[0] <= gs
    && r.qcGsPath[1] + r.qcGsPath[3] === total(r, 'qcGsClosed')
    && total(r, 'qcGsSnapBand') === gsByDec[DECIDERS.indexOf('snapshot')]
    && total(r, 'qcGsGcCell') === gsByDec[DECIDERS.indexOf('groundCandidate')]
    && total(r, 'qcGsGcLaneBin') === gsByDec[DECIDERS.indexOf('groundCandidate')]
    && total(r, 'qcGsGcHazard') === gsByDec[DECIDERS.indexOf('groundCandidate')]
    && r.qcGsGcSeatArmed[0] <= gsByDec[DECIDERS.indexOf('groundCandidate')];
  /* ⭐ QD: every ground release in exactly one cell; its opponent-first cells sum to OP-C0's
   *  `fbG.opponent`; its per-seat sums to `seatAll`; its per-decider sums to OP-C1's `qbAll` grouped
   *  by decider (snap* → snapshot, gc* → groundCandidate, the rest by name) */
  const NQo = QD_OUT.length;
  const qdSum = (pred: (s: number, di: number, zi: number, oi: number) => boolean): number => {
    let x = 0;
    for (let s = 0; s < 3; s++) for (let di = 0; di < N_DEC; di++) for (let zi = 0; zi < 2; zi++) {
      for (let oi = 0; oi < NQo; oi++) if (pred(s, di, zi, oi)) x += r.qd[((s * N_DEC + di) * 2 + zi) * NQo + oi];
    }
    return x;
  };
  const qbOfDec = (d: Decider): number => (d === 'snapshot' ? r.qbAll[0] + r.qbAll[1] + r.qbAll[2]
    : d === 'groundCandidate' ? r.qbAll[3] + r.qbAll[4] + r.qbAll[5] : r.qbAll[QB.indexOf(d as QbCell)]);
  const qd = total(r, 'qd') === ground
    && qdSum((_s, _d, _z, oi) => oi < 2) === r.fbG[3]
    && qdSum((_s, _d, zi, oi) => zi === 0 && oi === 0) === 0
    && [0, 1, 2].every((s) => qdSum((ss) => ss === s) === r.seatAll[s])
    && DECIDERS.every((d, di) => qdSum((_s, dd) => dd === di) === qbOfDec(d))
    && QD_OUT.every((_o, oi) => r.qdZoneAhead[oi] + r.qdZoneAhead[NQo + oi] === qdSum((_s, _d, zi, o) => zi === 1 && o === oi));
  return { opc0, qa, qb, qc, qd };
};
/** ⭐OP-T1 the exam's own partition checks, beside OP-C2's five. */
const rowPartitionOpT1 = (r: Row): boolean => r.frontRel[0] <= r.relGround[0]
  && total(r, 'frontByDecider') === r.frontRel[0] && r.frontManFirst[0] <= r.frontRel[0]
  && r.backGround[0] <= r.relGround[0]
  && total(r, 'pressedMix') === r.pressedDecisions[0] && r.pressedDecisions[0] <= r.carrierDecisions[0]
  && r.pressedTypeIsTop[0] <= r.pressedDecisions[0]
  && r.possNoPass[0] <= r.possN[0] && r.possGround[0] <= r.relGround[0] && r.possPasses[0] <= r.passesStat[0]
  && r.possTicks[0] <= r.ticks[0];
const partitionAll = (r: Row): boolean => {
  const p = rowPartitionOk(r);
  return p.opc0 && p.qa && p.qb && p.qc && p.qd && rowPartitionOpT1(r);
};

/* ========================================================================== */
/* §12 RUN                                                                      */
/* ========================================================================== */
const GATES: { name: string; ok: boolean; note: string }[] = [];
const gate = (name: string, ok: boolean, note: string): void => {
  GATES.push({ name, ok, note });
  banner(`  ${ok ? 'GREEN' : 'RED  '} ${name} — ${note}`);
};
type ArmCell = { signature: string; worldOk: boolean; wallMs: number; row: Row; trajectory: string };

/* ---- gRepro FIRST, before any exam seed, in EVERY process (#433 item 4(ii)) ---- */
banner('OP-T1 gRepro — OP-C2\'s stored W18-E / W18-D per-seed cells on its own consumed band 12,563,000–011');
const opc2 = JSON.parse(readFileSync(OPC2_ARTIFACT, 'utf8')) as {
  perSeedCells: ({ seed: number } & Record<string, { signature: string; row: Record<string, number[]> }>)[];
  rowSchema: Record<string, number>; bodySha256: string; faces: Record<string, Record<string, { num: number; den: number; value: number }>>;
};
const OPC2_BODY_SHA = opc2.bodySha256;
const OPC2_STORED_KEYS = Object.keys(opc2.rowSchema);
const storedOpc2 = new Map(opc2.perSeedCells.map((r) => [r.seed, r] as const));
const reproRows = REPRO_SEEDS.flatMap((seed) => OPC2_ARMS.map((a) => {
  const w = walkMatch(buildMatch(seed, a), a, true);
  const st = storedOpc2.get(seed)?.[a];
  const sigOk = st !== undefined && w.signature === st.signature;
  const mine = opc2SubRow(w.row);
  const keysOk = st !== undefined && JSON.stringify(Object.keys(st.row)) === JSON.stringify(OPC2_KEYS)
    && JSON.stringify(OPC2_STORED_KEYS) === JSON.stringify(OPC2_KEYS);
  const differing = st === undefined ? ['<no stored row>'] : OPC2_KEYS.filter((k) => JSON.stringify(mine[k]) !== JSON.stringify(st.row[k]));
  return { seed, arm: a, signatureOk: sigOk, keysOk, fieldsCompared: OPC2_KEYS.length, differingFields: differing,
    ok: sigOk && keysOk && differing.length === 0 };
}));
const reproOk = reproRows.length === 24 && reproRows.every((r) => r.ok);
gate('gRepro', reproOk,
  `${reproRows.filter((r) => r.ok).length}/${reproRows.length} (12 seeds × OP-C2's W18-E / W18-D): the stored whole-match `
  + `signature AND all ${OPC2_KEYS.length} keys of OP-C2's per-seed row reproduced field for field on this host (x64, `
  + 'the host OP-C2 ran on, so this GATES), with this instrument\'s observers open');
if (!reproOk && MODE !== 'smoke') {
  banner('OP-T1 STOP — gRepro is RED: no battery seed is walked or read (the RED-routing idiom).');
}

/* ---- ⭐ CHUNK MODE: walk battery seeds [lo, hi) and write their rows to the scratch chunk dir ---- */
if (MODE === 'chunk') {
  const spec = process.env.OPT1_CHUNK ?? '';
  const mt = /^(\d+)-(\d+)$/.exec(spec);
  if (mt === null) { banner('OP-T1 FATAL — OPT1_CHUNK must be lo-hi'); process.exit(3); }
  const lo = Number((mt as RegExpExecArray)[1]); const hi = Number((mt as RegExpExecArray)[2]);
  if (!(lo >= 0 && hi <= N_FROZEN && lo < hi)) { banner('OP-T1 FATAL — chunk range outside the battery'); process.exit(3); }
  if (!reproOk) process.exit(4);
  mkdirSync(CHUNK_DIR, { recursive: true });
  const seedsOut: { seed: number; arms: Record<Arm, ArmCell> }[] = [];
  for (let i = lo; i < hi; i++) {
    const seed = BLOCK_BASE + i;
    const arms = {} as Record<Arm, ArmCell>;
    for (const a of ARMS) arms[a] = walkMatch(buildMatch(seed, a), a, true);
    seedsOut.push({ seed, arms });
    if ((i - lo + 1) % 25 === 0) banner(`  … chunk ${spec}: ${i - lo + 1}/${hi - lo} (${((Date.now() - T_START) / 1000).toFixed(0)} s)`);
  }
  const path = pathJoin(CHUNK_DIR, `op-t1-chunk-${String(lo).padStart(4, '0')}-${String(hi).padStart(4, '0')}.json`);
  writeFileSync(path, JSON.stringify({ instrumentSha256: INSTRUMENT_SHA, freezeCommit: FREEZE_COMMIT, lo, hi,
    reproOk, arch: process.arch, wallSeconds: (Date.now() - T_START) / 1000, seeds: seedsOut }), { encoding: 'utf8' });
  banner(`OP-T1 chunk ${spec} written: ${path} (${((Date.now() - T_START) / 1000).toFixed(1)} s)`);
  process.exit(0);
}

/* ---- the world pin, gArmOP's construction walks, lockstep and X-DET on scratch ---- */
const worldPin = ARMS.map((a) => {
  const m = buildMatch(WORLD_PIN_SEED, a);
  const q = m as unknown as Record<string, unknown>;
  return { arm: a, seed: WORLD_PIN_SEED, ifArmedVersion: ifArmedVersion(m),
    inSnapshotLaw: q.inSnapshotLaw === true, edsPerceivedChoice: q.edsPerceivedChoice === true,
    edsPerceivedDefence: q.edsPerceivedDefence === true, edsValueAxis: q.edsValueAxis === true,
    dxWindupAim: q.dxWindupAim === true, dlcDeliveryChoice: q.dlcDeliveryChoice === true,
    o1PassWindup: q.o1PassWindup === true, lnOwnLanePrice: q.lnOwnLanePrice === true,
    pwWeightChooser: q.pwWeightChooser === true, ptpPassLead: q.ptpPassLead === true,
    traceChoiceAtConstruction: q.traceChoice === true, forcedPassTargetNull: m.forcedPassTarget === null,
    bkGroundCorridor: q.bkGroundCorridor === true, dvDeliveryValue: q.dvDeliveryValue === true,
    ifFlightRun: q.ifFlightRun === true, opFrontMan: m.opFrontMan, opFrontManDue: ARM_OP[a],
    flagsOfWorld18NameTheDoor: Object.prototype.hasOwnProperty.call(a4MatchFlags(18), 'opFrontMan') };
});
const armOpWalks = ARMOP_SEEDS.flatMap((seed) => ARMS.map((a) => {
  const m = buildMatch(seed, a);
  const atConstruction = m.opFrontMan;
  const w = walkMatch(m, a, true);
  return { seed, arm: a, atConstruction, atFullTime: m.opFrontMan, opFlag: w.row.opFlag[0],
    ok: atConstruction === ARM_OP[a] && m.opFrontMan === ARM_OP[a] && w.row.opFlag[0] === (ARM_OP[a] ? 1 : 0) };
}));
const lockRows: { arm: Arm; seed: number; observed: string; unobserved: string; ok: boolean }[] = [];
const xdetRows: { arm: Arm; seed: number; ok: boolean }[] = [];
if (reproOk) {
  for (const a of ARMS) {
    for (const seed of LOCKSTEP_SEEDS) {
      const o1 = walkMatch(buildMatch(seed, a), a, true);
      const u = walkMatch(buildMatch(seed, a), a, false);
      lockRows.push({ arm: a, seed, observed: o1.signature, unobserved: u.signature, ok: o1.signature === u.signature });
      const o2 = walkMatch(buildMatch(seed, a), a, true);
      xdetRows.push({ arm: a, seed, ok: o1.signature === o2.signature && o1.trajectory === o2.trajectory
        && o1.trajectory === u.trajectory && JSON.stringify(o1.row) === JSON.stringify(o2.row) });
    }
  }
}

/* ---- THE BATTERY (smoke: walked here; full: READ from the chunk files, each stamped) ---- */
const perSeed: { seed: number; arms: Record<Arm, ArmCell> }[] = [];
const chunkReceipts: { file: string; lo: number; hi: number; seeds: number; shaOk: boolean; freezeOk: boolean;
  reproOk: boolean; wallSeconds: number }[] = [];
const chunkRewalk: { seed: number; arm: Arm; ok: boolean }[] = [];
const receiptRows: Record<string, { signature: string; worldOk: boolean; opFlag: number }> = {};
if (reproOk && MODE === 'smoke') {
  banner(`OP-T1 smoke battery — ${BATTERY_SEEDS.length} seeds × ${ARMS.length} arms`);
  for (const seed of BATTERY_SEEDS) {
    const arms = {} as Record<Arm, ArmCell>;
    for (const a of ARMS) arms[a] = walkMatch(buildMatch(seed, a), a, true);
    perSeed.push({ seed, arms });
  }
}
if (reproOk && MODE === 'full') {
  const files = existsSync(CHUNK_DIR) ? readdirSync(CHUNK_DIR).filter((f) => /^op-t1-chunk-\d{4}-\d{4}\.json$/.test(f)).sort() : [];
  for (const f of files) {
    const c = JSON.parse(readFileSync(pathJoin(CHUNK_DIR, f), 'utf8')) as { instrumentSha256: string; freezeCommit: string | null;
      lo: number; hi: number; reproOk: boolean; wallSeconds: number; seeds: { seed: number; arms: Record<Arm, ArmCell> }[] };
    chunkReceipts.push({ file: f, lo: c.lo, hi: c.hi, seeds: c.seeds.length, shaOk: c.instrumentSha256 === INSTRUMENT_SHA,
      freezeOk: c.freezeCommit !== null && c.freezeCommit === FREEZE_COMMIT, reproOk: c.reproOk, wallSeconds: c.wallSeconds });
    for (const s of c.seeds) perSeed.push(s);
  }
  perSeed.sort((x, y) => x.seed - y.seed);
  /* ⭐ chunk integrity: the FIRST seed of every chunk re-walked in THIS process, all four arms, byte for byte */
  for (const c of chunkReceipts) {
    const seed = BLOCK_BASE + c.lo;
    const stored = perSeed.find((s) => s.seed === seed);
    for (const a of ARMS) {
      const w = walkMatch(buildMatch(seed, a), a, true);
      chunkRewalk.push({ seed, arm: a, ok: stored !== undefined && stored.arms[a].signature === w.signature
        && stored.arms[a].trajectory === w.trajectory && JSON.stringify(stored.arms[a].row) === JSON.stringify(w.row) });
    }
  }
}
if (reproOk) {
  for (const a of ARMS) {
    const w = walkMatch(buildMatch(RECEIPT_SEED, a), a, true);
    receiptRows[a] = { signature: w.signature, worldOk: w.worldOk, opFlag: w.row.opFlag[0] };
  }
}
const nSeeds = perSeed.length;
gate('gLockstep', reproOk && lockRows.length === 8 && lockRows.every((r) => r.ok),
  `${lockRows.filter((r) => r.ok).length}/${lockRows.length} arm × scratch walks (4 arms × ${LOCKSTEP_SEEDS.join(', ')}): the `
  + 'observers (OP-C2\'s snapshot wrapper AND the E3 trace door) and every OP-T1 read leave the whole-match signature byte-identical');
gate('gDeterminism', reproOk && xdetRows.length === 8 && xdetRows.every((r) => r.ok)
  && (MODE !== 'full' || (chunkRewalk.length === 4 * chunkReceipts.length && chunkRewalk.length > 0 && chunkRewalk.every((r) => r.ok))),
  `X-DET: ${xdetRows.filter((r) => r.ok).length}/${xdetRows.length} observed pairs identical in signature AND row bytes; `
  + `chunk integrity: ${chunkRewalk.filter((r) => r.ok).length}/${chunkRewalk.length} first-seed-of-chunk walks re-walked in `
  + 'this process identical to the chunk file\'s signature AND row');

/* ---- X-FP-PROD, in process (OP-C2 l.1823–1833, COPIED) ---- */
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

/* ---- X-SRC-ZERO (#433 item 4(ii) gXSrcZero) ---- */
const DISPATCH_HEAD = '59d8984';
const srcDiffDispatch = sh(`git diff ${DISPATCH_HEAD} -- src/ tests/`);
const srcPorcelain = sh('git status --porcelain -- src tests');
const srcDiffFreeze = FREEZE_COMMIT === null ? null : sh(`git diff --stat ${FREEZE_COMMIT}..HEAD -- src tests`);
gate('gXSrcZero', srcDiffDispatch.length === 0 && srcPorcelain.length === 0
  && (MODE !== 'full' || (srcDiffFreeze !== null && srcDiffFreeze.length === 0)),
  `git diff ${DISPATCH_HEAD} -- src/ tests/ = ${srcDiffDispatch.length} bytes; git status --porcelain -- src tests = `
  + `${srcPorcelain.length} bytes; git diff --stat FREEZE..HEAD -- src tests = `
  + `${srcDiffFreeze === null ? 'n/a (no FREEZE commit yet — smoke)' : `${srcDiffFreeze.length} bytes`}`);

/* ---- gFrozen: the instrument and the doc's §0–§DEV-PREFLIGHT byte-identical FREEZE ↔ RESULTS ---- */
const frozenRegionOf = (t: string): string | null => {
  const a = t.indexOf('\n## §0'); const b = t.indexOf('\n## §R');
  return a < 0 || b < 0 || b < a ? null : t.slice(a, b);
};
const docAtFreeze = FREEZE_COMMIT === null ? null
  : execSync(`git show ${FREEZE_COMMIT}:${DOC_PATH}`, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 }).toString('utf8');
const docNow = existsSync(DOC_PATH) ? readFileSync(DOC_PATH, 'utf8') : '';
const frozenRegionFreeze = docAtFreeze === null ? null : frozenRegionOf(docAtFreeze);
const frozenRegionNow = frozenRegionOf(docNow);
const frozenDetail = { applicable: MODE === 'full', freezeCommit: FREEZE_COMMIT, runningIsFreezeBlob: RUNNING_IS_FREEZE,
  instrumentSha256AtFreeze: FREEZE_BLOB === null ? null : sha(FREEZE_BLOB),
  docFrozenRegionBytes: frozenRegionNow === null ? null : Buffer.byteLength(frozenRegionNow, 'utf8'),
  docFrozenRegionSha256AtFreeze: frozenRegionFreeze === null ? null : sha(frozenRegionFreeze),
  docFrozenRegionSha256Now: frozenRegionNow === null ? null : sha(frozenRegionNow),
  chunksStampedWithThisFile: chunkReceipts.every((c) => c.shaOk && c.freezeOk) };
const frozenOk = MODE !== 'full' ? true
  : RUNNING_IS_FREEZE && frozenRegionFreeze !== null && frozenRegionNow !== null && frozenRegionFreeze === frozenRegionNow
    && chunkReceipts.length > 0 && frozenDetail.chunksStampedWithThisFile;
gate('gFrozen', frozenOk, MODE !== 'full'
  ? 'NOT APPLICABLE in smoke (there is no FREEZE commit yet); in full mode it is evaluated and gates'
  : `the running instrument = the FREEZE blob of ${FREEZE_COMMIT} (${RUNNING_IS_FREEZE}); the doc's §0 → §R region `
    + `(${frozenDetail.docFrozenRegionBytes} bytes) byte-identical to the FREEZE commit's (${frozenRegionFreeze === frozenRegionNow}); `
    + `every chunk file stamped with this file's sha256 and the FREEZE commit (${frozenDetail.chunksStampedWithThisFile})`);

/* ---- the world gate and the door gate ---- */
const allWalkWorldOk = perSeed.every((s) => ARMS.every((a) => s.arms[a].worldOk))
  && Object.values(receiptRows).every((r) => r.worldOk);
const pinOk = worldPin.every((w) => w.ifArmedVersion === 18 && !w.inSnapshotLaw && w.edsPerceivedChoice
  && w.edsPerceivedDefence && w.edsValueAxis && w.dxWindupAim && w.dlcDeliveryChoice && w.o1PassWindup
  && w.lnOwnLanePrice && !w.pwWeightChooser && !w.ptpPassLead && !w.traceChoiceAtConstruction && w.forcedPassTargetNull
  && w.bkGroundCorridor && !w.dvDeliveryValue && w.ifFlightRun && w.opFrontMan === w.opFrontManDue
  && !w.flagsOfWorld18NameTheDoor);
gate('gWorld', reproOk && nSeeds > 0 && allWalkWorldOk && pinOk && DOSE_BYTES_OK,
  'every walked match on world 18 by CALLING a4MatchFlags(18) (ifArmedVersion 18), inSnapshotLaw ABSENT, the E3 chooser ON, '
  + 'info.genome clean, the trace door SHUT at construction, forcedPassTarget null, and opFrontMan exactly as due per arm; '
  + `the constructed pin at ${WORLD_PIN_SEED} (four arms): the world-18 doors ON as OP-C2 pinned them, ifFlightRun ON, `
  + 'a4MatchFlags(18) does NOT name opFrontMan; the D arms dosed by the shipped loaders (dose BYTES pinned)');
const opFlagOf = (cell: ArmCell): number => cell.row.opFlag[0];
const armOpBattery = perSeed.every((s) => ARMS.every((a) => opFlagOf(s.arms[a]) === (ARM_OP[a] ? 1 : 0)))
  && Object.entries(receiptRows).every(([a, r]) => r.opFlag === (ARM_OP[a as Arm] ? 1 : 0));
gate('gArmOP', reproOk && nSeeds > 0 && armOpBattery && armOpWalks.length === 8 && armOpWalks.every((r) => r.ok),
  `opFrontMan read off EVERY walked match: 1 on W18-D+OP and W18-E+OP, 0 on W18-D and W18-E, on all ${nSeeds} seeds and the `
  + `receipt (${armOpBattery}); the two construction walks at ${ARMOP_SEEDS.join(', ')} × 4 arms: the door as due at `
  + `construction AND at full time (${armOpWalks.filter((r) => r.ok).length}/${armOpWalks.length})`);

/* ---- seeds ---- */
const allSim = [...BATTERY_SEEDS, RECEIPT_SEED, ...REPRO_SEEDS].filter((s) => s < SIM_LATTICE_TOP);
const walkedSeeds = perSeed.map((s) => s.seed);
const bookedEqualsWalked = !reproOk ? false : walkedSeeds.length === BATTERY_SEEDS.length
  && walkedSeeds.every((s, i) => s === BATTERY_SEEDS[i]) && Object.keys(receiptRows).length === ARMS.length;
gate('gSeedsBookedEqualWalked', bookedEqualsWalked,
  `${walkedSeeds.length} battery seeds (exactly ${BATTERY_SEEDS[0]}–${BATTERY_SEEDS[BATTERY_SEEDS.length - 1]}, in order, no `
  + `gap, no repeat${MODE === 'full' ? `, from ${chunkReceipts.length} chunk files` : ''}) × ${ARMS.length} arms + the receipt at `
  + `${RECEIPT_SEED} × ${ARMS.length} = ${walkedSeeds.length * ARMS.length + Object.keys(receiptRows).length} walks booked = walked`);
const blockSeeds = MODE === 'full' ? [...BATTERY_SEEDS, RECEIPT_SEED] : [];
gate('gSeedDisjoint', blockSeeds.every((s) => s >= BLOCK_BASE && s <= BLOCK_TOP)
  && CONSUMED_BLOCKS.every((b) => b + 999 < BLOCK_BASE)
  && REPRO_SEEDS.every((s) => s >= REPRO_BAND_BASE && s <= REPRO_BAND_BASE + 999)
  && allSim.every((s) => s < SIM_CEILING) && STATS.consumed === 0,
  `battery inside ${BLOCK_BASE}–${BLOCK_TOP}; all ${CONSUMED_BLOCKS.length} consumed blocks (through OP-C2 12,563,000–999) end `
  + `below the base; the gRepro re-walks lie inside OP-C2's own block; no SIM seed ≥ ${SIM_CEILING}; ZERO stats`);
gate('gN', MODE === 'full' ? N === N_FROZEN && N_ENV === undefined : true,
  MODE === 'full' ? `the battery ran at N_FROZEN = ${N_FROZEN} (the affordance), no override env`
    : `smoke mode, N = ${N} on scratch (not a battery)`);
const scratchOk = SCRATCH_SEEDS_USED.every((s) => s >= SCRATCH_BASE && s <= SCRATCH_TOP)
  && SCRATCH_SEEDS_USED.every((s) => s < VERIFIER_BAND[0] || s > VERIFIER_BAND[1]);
gate('gScratchBand', scratchOk,
  `all ${SCRATCH_SEEDS_USED.length} scratch seeds derive from the ONE base ${SCRATCH_BASE} inside [${SCRATCH_BASE}, ${SCRATCH_TOP}]; `
  + `the verifier band ${VERIFIER_BAND[0]}–${VERIFIER_BAND[1]} is disjoint`);
gate('gAnchoredConstants', ANCHORS_OK,
  `${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} needles at their declared counts; PARSED: the pressed threshold `
  + `${PRESSED_AT} (the passOutletMul line), the front radius ${FRONT_RADIUS} (the seam's form line), NI_FRACTION `
  + `${NI_FRACTION} from two instrument files, and OP-C2's decider constants`);
gate('gPredicateFixtures', FIXTURES_OK,
  `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} fixtures — OP-C2's copies re-run; NEW, each with a FIRES and a `
  + 'DOES-NOT case: the front man (and the seam-partition sweep), the backward pass, the possession step, the pass attempt, '
  + 'the release and the dispossession, the pressed decision tick (pressureAt CALLED), the action-mix buckets, the breach '
  + 'law, fixes, and the read precedence');
const LEDGER_READ = {
  registered: ['match.opFrontMan — THE ONE NEW REGISTERED LEDGER READ of OP-T1 (registry 88 → 89): read on every walked '
    + 'match, never written'],
  record: ['ball.lastTouch (first body)', 'match.pendingPass (release, target, side; the G8 aim key)', 'team stats deltas (klass; passes / shots / clearances for the release)',
    'match.pendingPassWindup', 'match.dxStrikeAim', 'match.perceivedSnapshot return value (OP-C2\'s observing wrapper)',
    'match.passChoiceTrace (the E3 chooser\'s own record: the decider attribution)', 'player.action.scores (a fresh decision; its top candidate)',
    'player.action.type (the pressed carrier\'s action mix)', 'ball.owner (pre-step carrier; the dispossession)',
    'match.possessionSide (the possession)', 'team stats goals / shots / interceptions / offsides / throughBalls / possessionTime / tackles / passes / passesCompleted',
    'match.shotLog[].xg'],
  declared: ['the front man = the seam\'s partition 0 < along < 1.5 recomputed on the RELEASE line L→E at release positions',
    'the pressure = pressureAt CALLED at the PRE-STEP positions (the engine\'s closure value is not readable)',
    'the possession = runs of match.possessionSide; the pass attempt = a stats.passes increment of the possessing side',
    'the dispossession = an owner change to the other side with no release between',
    'the backward pass = the priced aim against the attack direction from the launch',
    'OP-C2\'s copied decider read prices groundCandidate with the SHIPPED laneOpenness (OP-C2\'s definition), not the armed form'],
};
const opFlagLive = ARMS.every((a) => perSeed.every((s) => opFlagOf(s.arms[a]) === (ARM_OP[a] ? 1 : 0)));
gate('gLedgerRead', LEDGER_READ.registered.length === 1 && STATS.registryOfRecord === 89 && nSeeds > 0 && opFlagLive,
  `registry 88 → ${STATS.registryOfRecord}: match.opFrontMan registered (read on every walked match, live on the two +OP arms, `
  + `zero on the two controls); ${LEDGER_READ.record.length} faces read an ENGINE RECORD and ${LEDGER_READ.declared.length} `
  + 'are DECLARED reconstructions (stored)');

/* ---- per-arm sums, the partition ---- */
const flatsByArm = {} as Record<Arm, number[][]>;
for (const a of ARMS) flatsByArm[a] = perSeed.map((s) => flatten(s.arms[a].row));
const partitionRows = ARMS.map((a) => {
  const per = perSeed.map((s) => partitionAll(s.arms[a].row));
  return { arm: a, seeds: per.length, ok: per.length > 0 && per.every((p) => p) };
});
gate('gPartition', reproOk && nSeeds > 0 && partitionRows.every((r) => r.ok),
  'OP-C2\'s five partitions (OP-C0 owners, QA, QB, QC, QD) and OP-T1\'s (the front releases by decider, the pressed mix, '
  + 'the possessions) hold per arm and per seed: ' + partitionRows.map((r) => `${r.arm} ${r.ok}`).join(' · '));

/* ---- faces, deltas, the bands, the selectors, the read ---- */
const EST = nSeeds > 0 ? estimate(flatsByArm) : null;
const lvl = (a: Arm, f: string): FaceVal | null => EST?.levels[a][f] ?? null;
const dl = (cid: Cid, f: string) => EST?.deltas[cid][f] ?? null;
const bandRow = (cid: Cid, b: { id: string; key: string; direction: BandDir }) => {
  const d = dl(cid, b.key);
  const control = d?.controlValue ?? null;
  const tol = control === null ? null : NI_FRACTION * Math.abs(control);
  const dir = d === null || d.delta === null || tol === null ? 'none' : breachOf(b.direction, d.delta, d.resolved, tol);
  const beyond = d === null || d.delta === null || tol === null ? false
    : b.direction === 'ceiling' ? d.delta > tol : b.direction === 'floor' ? d.delta < -tol : Math.abs(d.delta) > tol;
  return { id: b.id, key: b.key, harmfulDirection: b.direction, contrast: cid, arm: TREAT_OF[cid], controlArm: CTRL_OF[cid],
    controlLevel: control, armLevel: d?.armValue ?? null, delta: d?.delta ?? null, ci: [d?.lo ?? null, d?.hi ?? null],
    resolved: d?.resolved ?? false, toleranceAbs: tol,
    toleranceForm: 'NI_FRACTION · |control level|, NI_FRACTION = 1 − 0.275/0.380 parsed by anchor from ctb-t1-supply-exam.ts (dlc-t1-choice-exam.ts agreeing)',
    absDeltaOverTolerance: d === null || d.delta === null || tol === null ? null : fin(ratio(Math.abs(d.delta), tol)),
    beyondTolerance: beyond, breach: dir !== 'none', breachDirection: dir, gating: true };
};
const g10Row = (cid: Cid) => {
  const d = dl(cid, 'guard.offsidesPerMatch');
  return { id: 'G10', key: 'guard.offsidesPerMatch', contrast: cid, controlLevel: d?.controlValue ?? null,
    armLevel: d?.armValue ?? null, delta: d?.delta ?? null, ci: [d?.lo ?? null, d?.hi ?? null],
    resolved: d?.resolved ?? false, flag: (d?.resolved ?? false) && (d?.delta ?? 0) > 0, gating: false };
};
const BANDS = Object.fromEntries(CONTRASTS.map((cid) => [cid, {
  g: BAND_G.map((b) => bandRow(cid, b)), g10: g10Row(cid), s: BAND_S.map((b) => bandRow(cid, b)) }])) as
  Record<Cid, { g: ReturnType<typeof bandRow>[]; g10: ReturnType<typeof g10Row>; s: ReturnType<typeof bandRow>[] }>;
const holdsBandsOf = (cid: Cid): boolean => [...BANDS[cid].g, ...BANDS[cid].s].every((r) => !r.breach);
const breachSetOf = (cid: Cid) => [...BANDS[cid].g, ...BANDS[cid].s].filter((r) => r.breach)
  .map((r) => ({ id: r.id, key: r.key, direction: r.breachDirection, delta: r.delta, ci: r.ci, toleranceAbs: r.toleranceAbs }));
const fixesRow = (cid: Cid) => {
  const d = dl(cid, WIN_FACE);
  return { face: WIN_FACE, contrast: cid, controlLevel: d?.controlValue ?? null, armLevel: d?.armValue ?? null,
    delta: d?.delta ?? null, ci: [d?.lo ?? null, d?.hi ?? null], resolved: d?.resolved ?? false, down: d?.down ?? false,
    fixes: d !== null && d.lo !== null && d.hi !== null && fixesOf(d.lo, d.hi) };
};
/* ⭐ gBiteOP — the #414 ROW form: on every battery seed the candidate's and the control's per-seed ROWS differ in
 *  ≥ 1 stored cell, on BOTH door-carrying contrasts; the full-time signature printed beside, gating nothing. */
/** the row WITHOUT the door's own cell `opFlag` — that cell differs by construction and would make
 *  every comparison trivially "differ" (found on the shake-out; §DEV-PREFLIGHT). */
const rowSansDoor = (r: Row): Record<string, number[]> => Object.fromEntries(ROW_KEYS.filter((k) => k !== 'opFlag').map((k) => [k, r[k]]));
const biteRows = CONTRASTS.map((cid) => {
  const per = perSeed.map((s) => ({ seed: s.seed,
    eligible: s.arms[TREAT_OF[cid]].trajectory !== s.arms[CTRL_OF[cid]].trajectory,
    rowsDiffer: JSON.stringify(rowSansDoor(s.arms[TREAT_OF[cid]].row)) !== JSON.stringify(rowSansDoor(s.arms[CTRL_OF[cid]].row)),
    signaturesDiffer: s.arms[TREAT_OF[cid]].signature !== s.arms[CTRL_OF[cid]].signature }));
  return { contrast: cid, seeds: per.length, eligible: per.filter((r) => r.eligible).length,
    rowsDifferOnEligible: per.filter((r) => r.eligible && r.rowsDiffer).length,
    rowsDifferOnIneligible: per.filter((r) => !r.eligible && r.rowsDiffer).length,
    rowsDiffer: per.filter((r) => r.rowsDiffer).length,
    signaturesDiffer: per.filter((r) => r.signaturesDiffer).length,
    seedsWhereTheDoorChangedNothing: per.filter((r) => !r.eligible).map((r) => r.seed),
    seedsWhereRowsCoincide: per.filter((r) => !r.rowsDiffer).map((r) => r.seed),
    frontReleasesOnCandidate: flatsByArm[TREAT_OF[cid]].reduce((x, fl) => x + fl[FLAT_INDEX['frontRel.0']], 0) };
});
const BITE_OP_OK = reproOk && nSeeds > 0 && biteRows.every((r) => r.seeds === nSeeds && r.eligible > 0
  && r.rowsDifferOnEligible === r.eligible && r.frontReleasesOnCandidate > 0);
gate('gBiteOP', BITE_OP_OK,
  'the #414 ROW form with its ELIGIBILITY (§DEVIATIONS 1), a PRECONDITION of every read: on EVERY seed where the door '
    + 'changed the match (the candidate\'s trajectory digest ≠ the control\'s) the per-seed ROWS differ, on BOTH door-carrying '
    + 'contrasts, and the door changed ≥ 1 match on each — ' + biteRows.map((r) => `${r.contrast}: eligible ${r.eligible}/${r.seeds}, `
    + `rows differ on ${r.rowsDifferOnEligible}/${r.eligible} eligible (and on ${r.rowsDifferOnIneligible} seeds whose trajectory `
    + 'digest did not move, printed); the strict '
    + `every-seed count ${r.rowsDiffer}/${r.seeds} and the full-time signatures (${r.signaturesDiffer}) printed, gating nothing; `
    + `front releases on the candidate ${r.frontReleasesOnCandidate}`).join(' · '));
const SELECTORS = Object.fromEntries(CONTRASTS.map((cid) => [cid, {
  contrast: cid, liveness: BITE_OP_OK, holdsBands: holdsBandsOf(cid), fixes: fixesRow(cid).fixes,
  breachSet: breachSetOf(cid), g10Flag: BANDS[cid].g10.flag }])) as Record<Cid, { contrast: Cid; liveness: boolean;
  holdsBands: boolean; fixes: boolean; breachSet: ReturnType<typeof breachSetOf>; g10Flag: boolean }>;
const SR = SELECTORS[CONTRAST_OF_RECORD];
const READ_WORD = readWordFrom(SR.liveness, SR.holdsBands, SR.fixes);
const READ = {
  comparisonOfRecord: CONTRAST_OF_RECORD,
  word: READ_WORD,
  sentence: READ_LITERALS[READ_WORD],
  precedenceStep: precedenceStepFrom(SR.liveness, SR.holdsBands, SR.fixes),
  selectors: { gBiteOP: SR.liveness, holdsBands: SR.holdsBands, fixes: SR.fixes },
  breachSetWithDirections: SR.breachSet,
  literals: READ_LITERALS,
  precedence: '(0) gBiteOP RED ⇒ the liveness string, nothing selects · (1) holdsBands FALSE ⇒ read 2 · (2) else fixes TRUE ⇒ '
    + 'read 1 · (3) else ⇒ read 3 · (4) the FALLBACK only if a stored boolean is ABSENT',
  ePair: { contrast: 'W18-E+OP|W18-E' as Cid, word: readWordFrom(SELECTORS['W18-E+OP|W18-E'].liveness,
    SELECTORS['W18-E+OP|W18-E'].holdsBands, SELECTORS['W18-E+OP|W18-E'].fixes),
  note: 'STORED, COUNTERFACTUAL, NEVER SELECTING — the frozen rule applied to the E pair\'s own stored booleans' },
  /** ⭐ §DEVIATIONS 1, made re-derivable: the word the frozen rule would give if gBiteOP were read in the
   *  STRICT every-seed form (rows differ on ALL seeds of both contrasts) — STORED, NEVER SELECTING. */
  strictEverySeedLivenessCounterfactual: (() => {
    const strict = biteRows.every((r) => r.seeds === nSeeds && nSeeds > 0 && r.rowsDiffer === nSeeds);
    return { strictLiveness: strict, word: readWordFrom(strict, SR.holdsBands, SR.fixes),
      note: 'the every-seed reading of "per-seed rows differ": on a seed where the door changed no decision the two walks '
        + 'are identical, so this reading is FALSE whenever such a seed exists — STORED, NEVER SELECTING' };
  })(),
};
gate('gReadLiterals', READ_LITERAL_HOMES.ok,
  `the five frozen strings (three reads, the fallback, the liveness string) found in BOTH written homes on normalised prose `
  + `(${READ_LITERAL_HOMES.rows.filter((r) => r.found).length}/${READ_LITERAL_HOMES.rows.length}); this instrument is the third home`);

/* ---- sizing (the house form, #415; OP-C2 l.2047–2064) ---- */
const Z975 = 1.959963984540054; const Z80 = 0.8416212335729143;
const TARGET_HW = 0.05;
/** ⭐ THE SMOKE OF RECORD's half-width of fb.ground.opponent's paired Δ on the comparison of record,
 *  TRANSCRIBED from the disclosed 12-seed smoke (§DEV-PREFLIGHT) before the freeze. */
const HW_SMOKE_RECORD: number | null = 0.027741506756226275;
const hwThisRun = dl(CONTRAST_OF_RECORD, WIN_FACE)?.halfWidth ?? null;
const hwSmoke = MODE === 'smoke' ? hwThisRun : HW_SMOKE_RECORD;
const seSmoke = hwSmoke === null ? null : hwSmoke / Z975;
const seNeeded = TARGET_HW / (Z975 + Z80);
const nRequired = seSmoke === null ? null : Math.ceil(SMOKE_N * (seSmoke / seNeeded) ** 2);
/** ⭐ THE SMOKE OF RECORD's mean wall seconds per walked match, TRANSCRIBED before the freeze. */
const WALL_PER_MATCH_SMOKE_RECORD: number | null = 0.2641041666666667;
const wallThisRun = nSeeds > 0 ? perSeed.reduce((x, s) => x + ARMS.reduce((y, a) => y + s.arms[a].wallMs, 0), 0)
  / (nSeeds * ARMS.length) / 1000 : null;
const wallSmoke = MODE === 'smoke' ? wallThisRun : WALL_PER_MATCH_SMOKE_RECORD;
const sizing = { face: `${WIN_FACE} paired Δ @ ${CONTRAST_OF_RECORD}`, targetHalfWidth: TARGET_HW, nSmoke: SMOKE_N, hwSmoke,
  seSmoke, seNeeded, nRequired, affordance: N_FROZEN, realisedHalfWidthThisRun: hwThisRun,
  meanWallSecondsPerMatchSmoke: wallSmoke,
  projectedBatteryHours: wallSmoke === null ? null : wallSmoke * (N_FROZEN + 1) * ARMS.length / 3600,
  halvingRule: 'HALVE N if the projected battery exceeds ~10 h (a sizing deviation, never a read change)',
  whichNWasTaken: 'THE AFFORDANCE (999) — the #414 §CORR 8 floor reading: the front-man and pressed-carrier classes are rare per seed' };

/* ========================================================================== */
/* §13 THE ARTIFACT — allowlist schema, gInheritedProse BY DIFF, hash LAST,     */
/*     re-read off disk (OP-C2 l.2066–2224 form)                                */
/* ========================================================================== */
const perSeedCells = perSeed.map((s) => {
  const o: Record<string, unknown> = { seed: s.seed };
  for (const a of ARMS) o[a] = { signature: s.arms[a].signature, trajectory: s.arms[a].trajectory, worldOk: s.arms[a].worldOk, row: s.arms[a].row };
  return o;
});
const BODY_KEYS = ['stage', 'seeds', 'stats', 'arms', 'contrasts', 'rowSchema', 'faceDefs', 'faces', 'deltas',
  'winTable', 'frontMan', 'stuck', 'bands', 'selectors', 'reads', 'priorOfRecord', 'sizing', 'perf', 'anchors', 'parsed',
  'fixtures', 'ledgerRead', 'repro', 'worldPin', 'armOp', 'lockstep', 'determinism', 'bite', 'fingerprintProd',
  'xSrcZero', 'frozen', 'partition', 'readLiteralHomes', 'inheritedProse', 'gates', 'allGreen', 'perSeedCells'] as const;
const val = (a: Arm, f: string): number | null => lvl(a, f)?.value ?? null;
const lv = (a: Arm, f: string) => lvl(a, f);
/** ⭐ THE PRIOR NUMBERS OF RECORD, read BY FIELD out of OP-C0's and OP-C2's artifacts (never typed). */
const opc0 = JSON.parse(readFileSync(OPC0_ARTIFACT, 'utf8')) as { faces: Record<string, Record<string, { num: number; den: number; value: number }>> };
const PRIOR_FIELDS: readonly [string, string, string][] = [
  [OPC0_ARTIFACT, 'W18-D', 'fb.ground.opponent'], [OPC0_ARTIFACT, 'W18-E', 'fb.ground.opponent'],
  [OPC0_ARTIFACT, 'W18-D', 'q2.wide.corridorAtRelease'],
  [OPC2_ARTIFACT, 'W18-D', 'fb.ground.opponent'], [OPC2_ARTIFACT, 'W18-E', 'fb.ground.opponent'],
  [OPC2_ARTIFACT, 'W18-D', 'qd.zoneShare'], [OPC2_ARTIFACT, 'W18-D', 'qd.zone.aheadShare'],
  [OPC2_ARTIFACT, 'W18-D', 'qd.zoneAhead.zoneManFirst'], [OPC2_ARTIFACT, 'W18-D', 'qd.zoneAhead.anyOppFirst'],
  [OPC2_ARTIFACT, 'W18-D', 'qd.zoneBehindOnly.zoneManFirst'], [OPC2_ARTIFACT, 'W18-D', 'qd.noZone.anyOppFirst'],
  [OPC2_ARTIFACT, 'W18-D', 'qb.all.decider.snapshot'], [OPC2_ARTIFACT, 'W18-D', 'qc.givenReading.guardSkip.snapshot'],
];
const priorOfRecord = PRIOR_FIELDS.map(([src, arm, f]) => {
  const v = (src === OPC0_ARTIFACT ? opc0.faces : opc2.faces)[arm]?.[f];
  return { source: src, arm, field: `faces.${arm}.${f}`, num: v?.num ?? null, den: v?.den ?? null, value: v?.value ?? null };
});
const winTable = {
  face: WIN_FACE, definition: 'OP-C0 fb.ground.opponent BY FIELD: fbG[opponent] / Σ fbG — the share of measurable ground passes whose first body is an opponent',
  levels: Object.fromEntries(ARMS.map((a) => [a, lv(a, WIN_FACE)])),
  fixes: Object.fromEntries(CONTRASTS.map((cid) => [cid, fixesRow(cid)])),
};
const frontMan = {
  partition: 'a live opponent whose closest point on the release segment L→E lies at 0 < along < 1.5 m from L (the seam\'s own partition, no lateral bound)',
  zoneDifference: 'OP-C2\'s qd zone counts t ≥ 0 within 1.5 m along AND within 4 m of the segment (level men included, men 4 m+ off excluded); the front partition is strictly ahead with no lateral bound — both printed',
  faces: Object.fromEntries(ARMS.map((a) => [a, {
    frontShare: lv(a, 'front.share'), frontManFirst: lv(a, 'front.manFirst'),
    reseatBySnapshot: lv(a, 'front.reseat.snapshot'), reseatByGroundCandidate: lv(a, 'front.reseat.groundCandidate'),
    qdZoneShare: lv(a, 'qd.zoneShare'), qdZoneAheadShare: lv(a, 'qd.zone.aheadShare'),
    qdZoneAheadZoneManFirst: lv(a, 'qd.zoneAhead.zoneManFirst'), qdZoneAheadAnyOppFirst: lv(a, 'qd.zoneAhead.anyOppFirst'),
    qdZoneBehindOnlyZoneManFirst: lv(a, 'qd.zoneBehindOnly.zoneManFirst'), qdNoZoneAnyOppFirst: lv(a, 'qd.noZone.anyOppFirst'),
    snapshotDecidedShareAllGround: lv(a, 'qb.all.decider.snapshot') }])),
  deltas: Object.fromEntries(CONTRASTS.map((cid) => [cid, Object.fromEntries(['front.share', 'front.manFirst',
    'front.reseat.snapshot', 'qd.zoneShare', 'qd.zone.aheadShare', 'qd.zoneAhead.zoneManFirst', 'qd.zoneAhead.anyOppFirst']
    .map((f) => [f, dl(cid, f)]))])),
};
const STUCK_FACES = ['stuck.groundPassAttemptsPerPossession', ...MIX.map((k) => `stuck.pressedMix.${k}`),
  'stuck.pressedShareOfCarrierDecisions', 'stuck.pressedDecisionsPerMatch', 'stuck.pressedTypeIsTopCandidateShare',
  'stuck.backwardShareOfGroundReleases', 'stuck.possessionMeanTicks', 'stuck.possessionsPerMatch',
  's1.passesPerPossession', 's2.dispossessionsPerMatch', 's3.possessionsEndingWithoutAPassAttempt',
  'beside.wonTacklesPerMatch', 'beside.groundReleasesPerMatch'];
const stuck = {
  note: 'the 传不出去 faces, published on every arm with NO verdict word (#433 item 3(iv)); the pressure is the engine\'s own pressureAt at the pre-step positions, pressed = above the parsed 0.5',
  levels: Object.fromEntries(ARMS.map((a) => [a, Object.fromEntries(STUCK_FACES.map((f) => [f, lv(a, f)]))])),
  deltas: Object.fromEntries(CONTRASTS.map((cid) => [cid, Object.fromEntries(STUCK_FACES.map((f) => [f, dl(cid, f)]))])),
};
const facesOut = Object.fromEntries(ARMS.map((a) => [a, Object.fromEntries(FACE_NAMES.map((f) => [f, lv(a, f)]))]));
const deltasOut = Object.fromEntries(CONTRASTS.map((cid) => [cid, Object.fromEntries(FACE_NAMES.map((f) => [f, dl(cid, f)]))]));
const body: Record<string, unknown> = {
  stage: { id: 'OP-T1', title: '身前那个人 · 考', ruling: '#433 items 3–4', instrument: INSTRUMENT_PATH,
    instrumentSha256: INSTRUMENT_SHA, doc: DOC_PATH, mode: MODE, arch: process.arch, node: process.version,
    opc2BodySha256: OPC2_BODY_SHA, freezeCommit: FREEZE_COMMIT,
    xSrcZero: 'no byte under src/ or tests/ is created or edited; the walker is OP-C2\'s (its observing snapshot wrapper and the E3 trace door, both proven inert by gLockstep and gRepro)',
    honestLimitsNote: `the HONEST LIMITS list lives ONLY in ${DOC_PATH} §HONEST LIMITS (the one home); this artifact stores none` },
  seeds: { blockBase: BLOCK_BASE, blockTop: BLOCK_TOP, battery: [BATTERY_SEEDS[0] ?? null, BATTERY_SEEDS[BATTERY_SEEDS.length - 1] ?? null],
    nBattery: BATTERY_SEEDS.length, receipt: RECEIPT_SEED, simCeiling: SIM_CEILING, scratchBase: SCRATCH_BASE,
    scratchUsed: SCRATCH_SEEDS_USED, verifierBand: VERIFIER_BAND, reproSeeds: REPRO_SEEDS, consumedBlocks: CONSUMED_BLOCKS,
    walked: walkedSeeds.length, chunks: chunkReceipts },
  stats: STATS,
  arms: ARMS.map((a) => ({ arm: a, world: ARM_WORLD[a], dosed: ARM_DOSED[a], opFrontMan: ARM_OP[a] })),
  contrasts: CONTRASTS.map((cid) => ({ contrast: cid, candidate: TREAT_OF[cid], control: CTRL_OF[cid],
    ofRecord: cid === CONTRAST_OF_RECORD })),
  rowSchema: ROW_SCHEMA,
  faceDefs: FACE_DEFS,
  faces: facesOut,
  deltas: deltasOut,
  winTable,
  frontMan,
  stuck,
  bands: BANDS,
  selectors: SELECTORS,
  reads: READ,
  priorOfRecord,
  sizing,
  perf: { batteryInWalkSeconds: perSeed.reduce((s, r) => s + ARMS.reduce((x, a) => x + r.arms[a].wallMs, 0), 0) / 1000,
    walks: perSeed.length * ARMS.length, meanWallSecondsPerMatch: wallThisRun,
    chunkWallSeconds: chunkReceipts.reduce((s, c) => s + c.wallSeconds, 0) },
  anchors: ANCHORS,
  parsed: PARSED,
  fixtures: FIXTURES,
  ledgerRead: LEDGER_READ,
  repro: { rows: reproRows, opc2Artifact: OPC2_ARTIFACT, opc2BodySha256: OPC2_BODY_SHA, opc2RowKeys: OPC2_KEYS.length },
  worldPin,
  armOp: armOpWalks,
  lockstep: lockRows,
  determinism: { xdet: xdetRows, chunkRewalk },
  bite: biteRows,
  fingerprintProd: { arch: process.arch, pin: FP_PIN, computed: FP_GOT, ok: FP_PIN !== '' && FP_GOT === FP_PIN },
  xSrcZero: { dispatchHead: DISPATCH_HEAD, diffBytes: srcDiffDispatch.length, porcelainBytes: srcPorcelain.length,
    freezeDiffStatBytes: srcDiffFreeze === null ? null : srcDiffFreeze.length },
  frozen: frozenDetail,
  partition: partitionRows,
  readLiteralHomes: READ_LITERAL_HOMES,
  inheritedProse: null,
  gates: [] as unknown[],
  allGreen: false,
  perSeedCells,
};

/* ---- ⭐⭐⭐ gInheritedProse — BY DIFF AGAINST ITS SOURCE INSTRUMENTS (CANON; #424 item 4), ⛔ NO TOKEN LIST ----
 * Every prose string (≥ 40 characters) inside the hashed body is compared BYTE FOR BYTE with the source
 * instruments: (a) every string of their stored artifacts' bodies (OP-C2, IF-T1b), (b) every string literal of
 * their files (op-c2 / op-c1 / op-c0 / if-t1b `.ts`, by substring). A string identical to a source's is LISTED
 * for a human re-read; the gate is RED unless every listed string carries a frozen re-read record below. */
const PROSE_MIN = 40;
const SOURCE_FILES = [OPC2_INSTRUMENT, 'scripts/probes/op-c1-contact-and-price-census.ts',
  'scripts/probes/op-c0-opponent-first-census.ts', IFT1B_INSTRUMENT];
const SOURCE_ARTIFACTS = [OPC2_ARTIFACT, 'docs/world-model/data/if-t1b-flight-run-exam.json'];
/** ⭐ THE HUMAN RE-READ RECORDS (frozen at the FREEZE): sha256 of a listed string → why it is TRUE OF THIS EXAM. */
const REREAD: Record<string, string> = {
  bc236a0fb1550f802bb3a1c6822575f43d7ded32c5e0a0eb4eab639af0fd547e: 'reads.literals.fallback — identical to '
    + 'IF-T1b\'s fallback literal BY DESIGN: #433 item 3(v) froze the SAME fallback sentence for this exam (re-read: true here)',
  '36902c3b0aaa245709046271cb24a4b4100c38ecdd4b61237680289babd86461': 'gates[gFingerprintProd].note — identical to '
    + 'OP-C2\'s note because the same in-process recomputation on the same x64 host gives the same value (re-read: true here)',
  '817fb2f7bac13d7d7b3c7519ed5b9544034c02ada2fa46fe537f72a906acc696': 'gates[gN].note (full mode only) — identical to '
    + 'OP-C2\'s note; this exam also walks N_FROZEN = 999, the affordance, with no override env (re-read: true here)',
};
/** PROSE = a string of ≥ 40 characters with ≥ 5 whitespace-separated words (hashes, paths and seed lists
 *  are not prose); `anchors[].needle` is excluded because each needle is a verbatim CODE line whose
 *  claim (its occurrence count) is re-checked at run time by gAnchoredConstants. */
const isProse = (t: string): boolean => t.length >= PROSE_MIN && (t.match(/\s+/g) ?? []).length >= 4;
const proseDiff = (b: Record<string, unknown>) => {
  const srcStrings = new Map<string, string>();
  const collect = (node: unknown, src: string): void => {
    if (typeof node === 'string') { if (node.length >= PROSE_MIN && !srcStrings.has(node)) srcStrings.set(node, src); return; }
    if (Array.isArray(node)) { for (const v of node) collect(v, src); return; }
    if (node !== null && typeof node === 'object') for (const v of Object.values(node as Record<string, unknown>)) collect(v, src);
  };
  for (const p of SOURCE_ARTIFACTS) {
    const j = JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;
    delete j.perSeedCells;
    collect(j, p);
  }
  const srcTexts = SOURCE_FILES.map((p) => ({ p, t: readFileSync(p, 'utf8') }));
  const rows: { path: string; chars: number; identicalTo: string[]; listed: boolean; reRead: string | null }[] = [];
  const seen = new Set<string>();
  const walk = (node: unknown, path: string): void => {
    if (typeof node === 'string') {
      if (!isProse(node) || path === 'anchors[].needle') return;
      const k = path + '||' + node; if (seen.has(k)) return; seen.add(k);
      const hits: string[] = [];
      const a = srcStrings.get(node); if (a !== undefined) hits.push(`${a} (an artifact string)`);
      for (const s of srcTexts) {
        if (s.t.includes(node) || s.t.includes(node.replace(/'/g, '\\\''))) hits.push(`${s.p} (a literal)`);
      }
      const h = sha(node);
      rows.push({ path, chars: node.length, identicalTo: hits, listed: hits.length > 0,
        reRead: hits.length > 0 ? (REREAD[h] ?? null) : null });
      return;
    }
    if (Array.isArray(node)) { node.forEach((v) => walk(v, path + '[]')); return; }
    if (node !== null && typeof node === 'object') for (const [kk, v] of Object.entries(node as Record<string, unknown>)) walk(v, path + '.' + kk);
  };
  for (const k of BODY_KEYS) { if (k === 'inheritedProse' || k === 'perSeedCells') continue; walk(b[k], k); }
  const listed = rows.filter((r) => r.listed);
  return { rows, listed, ok: rows.length > 0 && listed.every((r) => r.reRead !== null) };
};

const writeArtifact = (path: string, b: Record<string, unknown>, receipts: Record<string, unknown>): string => {
  const ordered: Record<string, unknown> = {};
  for (const k of BODY_KEYS) ordered[k] = b[k];
  const bodySha = sha(JSON.stringify(ordered));
  writeFileSync(path, JSON.stringify({ ...ordered, receipts, bodySha256: bodySha }), { encoding: 'utf8' });
  return bodySha;
};
const allKeysInSchema = (): boolean => Object.keys(body).every((k) => (BODY_KEYS as readonly string[]).includes(k))
  && BODY_KEYS.every((k) => k in body);
const routedPath = (green: boolean): string => (green || IS_OVERRIDE ? OUT_BASE : OUT_BASE.replace(/\.json$/, '.RED.json'));
body.gates = GATES.map((g) => ({ ...g }));
const outPath = routedPath(GATES.every((g) => g.ok));
writeArtifact(outPath, body, { hashReproducesFromFile: null });

/* ---- gFaces — re-derive EVERY face level from the SERIALIZED per-seed cells off disk ---- */
const disk = JSON.parse(readFileSync(outPath, 'utf8')) as Record<string, unknown> & {
  perSeedCells: Record<string, unknown>[]; faces: Record<Arm, Record<string, FaceVal | null>>;
  deltas: Record<Cid, Record<string, { delta: number | null; lo: number | null; hi: number | null; resolved: boolean;
    controlValue: number | null }>>;
  bands: Record<Cid, { g: ReturnType<typeof bandRow>[]; g10: ReturnType<typeof g10Row>; s: ReturnType<typeof bandRow>[] }>;
  selectors: Record<Cid, { liveness: boolean; holdsBands: boolean; fixes: boolean }>;
  reads: { word: string; sentence: string; precedenceStep: string; ePair: { word: string } };
  winTable: { fixes: Record<Cid, { fixes: boolean; ci: (number | null)[] }> };
  gates: { name: string; ok: boolean }[];
};
let faceChecks = 0; let faceOk = 0;
for (const a of ARMS) {
  const flats = disk.perSeedCells.map((c) => flatten((c[a] as { row: Row }).row));
  FACE_DEFS.forEach((f, fi) => {
    faceChecks += 1;
    let x = 0; let y = 0;
    for (const fl of flats) { const [nu, de] = seedNumDen(fl, fi); x += nu; y += de; }
    const st = disk.faces[a][f.name];
    if (st !== null && st !== undefined && st.num === x && st.den === y && st.value === fin(ratio(x, y))) faceOk += 1;
  });
}
const partitionReDerived = ARMS.every((a) => disk.perSeedCells.every((c) => partitionAll((c[a] as { row: Row }).row)));
gate('gFaces', faceChecks > 0 && faceOk === faceChecks && partitionReDerived && FACE_DEFS_OK,
  `${faceOk}/${faceChecks} face levels (num, den, value) re-derived from the SERIALIZED per-seed cells off disk; every `
  + `partition re-derived per seed (${partitionReDerived}); the face definitions resolve to stored cells (${FACE_DEFS_OK})`);

/* ---- gReadWords — every boolean and the read re-derived off disk with the frozen rule ---- */
const rwChecks: { what: string; ok: boolean }[] = [];
for (const cid of CONTRASTS) {
  for (const r of [...disk.bands[cid].g, ...disk.bands[cid].s]) {
    const d = disk.deltas[cid][r.key];
    const tol = d.controlValue === null ? null : NI_FRACTION * Math.abs(d.controlValue);
    const dir = d.delta === null || tol === null ? 'none' : breachOf(r.harmfulDirection, d.delta, d.resolved, tol);
    rwChecks.push({ what: `${cid} ${r.id} breach + direction + tolerance`, ok: r.breachDirection === dir && r.breach === (dir !== 'none')
      && r.toleranceAbs === tol && d.resolved === (d.hi !== null && d.lo !== null && (d.hi < 0 || d.lo > 0)) });
  }
  const holds = [...disk.bands[cid].g, ...disk.bands[cid].s].every((r) => !r.breach);
  const wd = disk.deltas[cid][WIN_FACE];
  const fx2 = wd.lo !== null && wd.hi !== null && fixesOf(wd.lo, wd.hi);
  rwChecks.push({ what: `${cid} holdsBands`, ok: disk.selectors[cid].holdsBands === holds });
  rwChecks.push({ what: `${cid} fixes`, ok: disk.selectors[cid].fixes === fx2 && disk.winTable.fixes[cid].fixes === fx2 });
  rwChecks.push({ what: `${cid} G10 flag`, ok: disk.bands[cid].g10.flag === (disk.deltas[cid]['guard.offsidesPerMatch'].resolved
    && (disk.deltas[cid]['guard.offsidesPerMatch'].delta ?? 0) > 0) });
}
const biteDisk = (disk.gates.find((g) => g.name === 'gBiteOP')?.ok) ?? null;
const sel = disk.selectors[CONTRAST_OF_RECORD];
const wordDisk = readWordFrom(biteDisk, sel.holdsBands, sel.fixes);
rwChecks.push({ what: 'liveness = the stored gBiteOP gate', ok: sel.liveness === biteDisk });
rwChecks.push({ what: 'the read word, sentence and step', ok: disk.reads.word === wordDisk
  && disk.reads.sentence === READ_LITERALS[wordDisk] && disk.reads.precedenceStep === precedenceStepFrom(biteDisk, sel.holdsBands, sel.fixes) });
const selE = disk.selectors['W18-E+OP|W18-E'];
rwChecks.push({ what: 'the E pair word (stored, never selecting)', ok: disk.reads.ePair.word === readWordFrom(selE.liveness, selE.holdsBands, selE.fixes) });
gate('gReadWords', rwChecks.length > 0 && rwChecks.every((r) => r.ok),
  `${rwChecks.filter((r) => r.ok).length}/${rwChecks.length} re-derived off the SERIALIZED artifact: every G and S row's breach, `
  + 'direction and tolerance, holdsBands, fixes, the G10 flag, the liveness precondition, the read word, its sentence, the '
  + 'precedence step that selected, and the E pair\'s stored word');

/* ---- gInheritedProse, gHashOrder, gStage, then the final write ---- */
body.gates = GATES.map((g) => ({ ...g }));
const PROSE = proseDiff(body);
gate('gInheritedProse', PROSE.ok,
  `${PROSE.rows.length} prose fields (≥ ${PROSE_MIN} chars) in the hashed body compared BY DIFF with the source instruments `
  + `(${SOURCE_FILES.length} files, ${SOURCE_ARTIFACTS.length} artifacts); ${PROSE.listed.length} byte-identical to a source and `
  + `LISTED for a human re-read, ${PROSE.listed.filter((r) => r.reRead !== null).length} of them carrying a frozen re-read record; `
  + 'no token list');
body.inheritedProse = { method: 'BY DIFF against the source instruments (CANON; #424 item 4) — no token list',
  minimumLength: PROSE_MIN, sourceFiles: SOURCE_FILES, sourceArtifacts: SOURCE_ARTIFACTS, fields: PROSE.rows.length,
  listedForHumanReRead: PROSE.listed, reReadRecords: REREAD };
const hashReproducesFromFile = (() => {
  const re: Record<string, unknown> = {};
  for (const k of BODY_KEYS) re[k] = disk[k];
  return sha(JSON.stringify(re)) === (disk as unknown as { bodySha256: string }).bodySha256;
})();
gate('gHashOrder', allKeysInSchema() && hashReproducesFromFile,
  `the ${BODY_KEYS.length}-key ALLOWLIST schema is complete; the body hash is computed LAST over it and reproduces from the file`);
gate('gStage', sha(readFileSync(INSTRUMENT_PATH)) === INSTRUMENT_SHA,
  'stage.instrumentSha256 is the RUNNING file\'s hash, re-read from disk');
const allGreen = GATES.every((g) => g.ok);
body.gates = GATES.map((g) => ({ ...g }));
body.allGreen = allGreen;
const finalPath = routedPath(allGreen);
if (finalPath !== outPath && existsSync(outPath)) unlinkSync(outPath);
const bodySha = writeArtifact(finalPath, body, { hashReproducesFromFile, gateCount: GATES.length,
  bodySchemaKeys: BODY_KEYS.length });
const fileBytes = readFileSync(finalPath);
banner(`OP-T1 ${allGreen ? 'ALL GREEN' : 'RED'} — ${GATES.filter((g) => g.ok).length}/${GATES.length} gates · ${finalPath}`);
banner(`  bodySha256 ${bodySha} · fileSha256 ${sha(fileBytes)} · ${fileBytes.length} bytes · wall ${((Date.now() - T_START) / 1000).toFixed(1)} s`);
banner(`  READ ${READ.word} — ${READ.precedenceStep}`);
for (const a of ARMS) {
  banner(`  ${a}: fb.opponent ${val(a, WIN_FACE)} · front share ${val(a, 'front.share')} · front first ${val(a, 'front.manFirst')} `
    + `· reseat snapshot ${val(a, 'front.reseat.snapshot')} · S1 ${val(a, 's1.passesPerPossession')} · S2 ${val(a, 's2.dispossessionsPerMatch')} `
    + `· S3 ${val(a, 's3.possessionsEndingWithoutAPassAttempt')} · pressed ${MIX.map((k) => `${k} ${val(a, `stuck.pressedMix.${k}`)}`).join(' ')}`);
}
for (const cid of CONTRASTS) {
  const fr = fixesRow(cid);
  banner(`  ${cid}: fixes ${fr.fixes} Δ ${fr.delta} [${fr.ci.join(', ')}] · holdsBands ${holdsBandsOf(cid)} · breaches `
    + `${JSON.stringify(breachSetOf(cid).map((b) => `${b.id} ${b.direction}`))}`);
}
if (hwSmoke !== null) banner(`  sizing ${sizing.face}: hw ${hwSmoke} → nRequired ${nRequired}; wall/match ${wallSmoke} → projected ${sizing.projectedBatteryHours} h`);
if (PROSE.listed.length > 0) {
  for (const r of PROSE.listed) banner(`  PROSE LISTED ${r.path} [${r.identicalTo.join('; ')}] reRead=${r.reRead !== null}`);
}
