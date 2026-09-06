/**
 * ⭐⭐ DS-C0 — 「点名普查」 THE DESIGNATION CENSUS
 * (docs/world-model/DS-C0-DESIGNATION-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #404 item 2. Lineage: LN-C0 (the census form of record) →
 * LN-C3 / LN-T1′b §COMMANDER CORRECTIONS (the `stage` block is THIS instrument's path and the
 * RUNNING file's hash; the call graph EXTRACTED, never declared; no false universal; every
 * predicate written so it can actually FIRE) → GK-C0 (the house form THIS instrument copies:
 * the run envelope, the arms, the per-tick walker, the ledger joins, the cluster bootstrap,
 * the frozen bins, the hash order, the gate set, the `stage` block) → GK-T1 §COMMANDER
 * CORRECTIONS (a liveness receipt exempts the shapes where it cannot hold, or states itself on
 * stored rows) → this census.
 *
 * THE QUESTION (#404 item 2, not re-argued here): before any hand-written hat is removed, HOW
 * MUCH of the attacking off-ball run is the coach's DESIGNATION, WHAT do the hats produce,
 * WHICH passer reads consume them, and DOES the off-ball eyes seat already carry the
 * vocabulary a priced run would use.
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis, ARMS NOTHING and
 * SHIPS NOTHING. The READ SENTENCES are FROZEN LITERALS selected by STORED booleans, and no
 * verdict word is printed on the yield.
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The probe reads public
 * `Match` / `Team` / `Player` / `Ball` state and the engine's own decision record
 * (`p.action.scores`) before and after `match.step(DT)`. THERE IS NO WRAPPER — `gLockstep`
 * proves observed ≡ unobserved byte for byte, PER ARM.
 * ⛔ WORLDS 12–15 ARE UNTOUCHED. E13 is the READ OF RECORD; D13 is the played form; E15 is the
 * frontier world published BESIDE, and the code facts state whether the own-lane door or the
 * dive door touches any designation path.
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 * ⇒ the HAT CLASS of a `MakeRun` is read off the WINNER'S OWN `why` in `p.action.scores`; a
 * pass is joined through `match.pendingPass` and `match.lastCompletedPass`; a shot through
 * `match.shotLog` + `match.pendingShot.shooterGid`; the one-two return through the engine's own
 * `stats.oneTwos`; the overlap arrival through `stats.overlaps`. Where NO record exists (the
 * wall trigger's per-conjunct kill shares; the passer's wall-return and third-man bonuses,
 * whose last conjunct is computed on a candidate's own aim) a DECLARED RECONSTRUCTION is
 * written, is labelled an UPPER BOUND in its own field name, and says so.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L, AI_INTERVAL, TEAM_AI_INTERVAL } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bqArmedVersion, lnArmedVersion, gkArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  BQ_WORLD_VERSION, LN_WORLD_VERSION, GK_WORLD_VERSION,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { pressureAt } from '../../src/ai/perception';
import { randomGenome, OBM_FEATURE_KEYS, OBM_OUTPUT_KEYS } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the LN-C0 §1 form, via GK-C0)              */
/* ========================================================================== */
const ENV_WHITELIST = ['DSC0_MODE', 'DSC0_N', 'DSC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('DSC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`DS-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.DSC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('DS-C0 FATAL — DSC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.DSC0_N !== undefined ? Number(process.env.DSC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('DS-C0 FATAL — DSC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.DSC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`DSC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`DSC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`DSC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/ds-c0-designation-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/ds-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('DS-C0 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}
/** ⭐⭐ THE INSTRUMENT OF RECORD — this file's own path, for the stage block's hash. */
const INSTRUMENT_PATH = 'scripts/probes/ds-c0-designation-census.ts';

/* ========================================================================== */
/* §2 SMALL HELPERS (the house set)                                            */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'ERROR'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const binMedian = (bins: readonly number[], width: number): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= n) return i * width;
  }
  return (bins.length - 1) * width;
};
const canonicalJson = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      return Object.keys(o).sort().reduce<Record<string, unknown>>(
        (acc, k) => { acc[k] = walk(o[k]); return acc; }, {},
      );
    }
    return x;
  };
  return JSON.stringify(walk(v));
};

/* ========================================================================== */
/* §3 THE ANCHORED SITES — anchored needle + line receipt, never first-occurrence
   canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
   anchored match + line receipt — never first-occurrence" (home: BK-C0-BODYBALL-CENSUS.md
   §COMMANDER CORRECTIONS item 1); and "a seam-map gate pins occurrence COUNTS per needle and
   enumerates EVERY occurrence's site" (home: PC-C0-REACTION-BASELINE.md §CORR item 1)        */
/* ========================================================================== */
const TEAMBRAIN_PATH = 'src/ai/TeamBrain.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const CONST_PATH = 'src/sim/constants.ts';
const EYES_PATH = 'src/ai/offballEyes.ts';
const GENOME_PATH = 'src/evolution/genome.ts';
const A4_PATH = 'src/game/a4World.ts';
const TEAM_PATH = 'src/sim/Team.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const ANCHOR_FILES = [TEAMBRAIN_PATH, MECH_PATH, BRAIN_PATH, EXEC_PATH, MATCH_PATH, CONST_PATH,
  EYES_PATH, GENOME_PATH, A4_PATH, TEAM_PATH, PLAYER_PATH];
const SRC_OF: Record<string, string> = {};
for (const p of ANCHOR_FILES) SRC_OF[p] = readFileSync(p, 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};
interface Anchor {
  what: string; file: string; needle: string; want: number;
  occurrences: { line: number }[]; extracted?: unknown;
}
const ANCHORS: Anchor[] = [];
const anchor = (
  what: string, file: string, needle: string, want: number, extracted?: unknown,
): { line: number }[] => {
  const hits = occurrences(SRC_OF[file], needle);
  ANCHORS.push({ what, file, needle, want, occurrences: hits, extracted });
  return hits;
};
/** ⭐ backtick-bearing source lines are built by CONCATENATION so this instrument's own text
 *  never carries a template literal that could be mistaken for the source's. */
const BT = String.fromCharCode(96);
const DOLLAR = '$';
const nums = (s: string): number[] => (s.match(/-?[0-9]+\.?[0-9]*/g) ?? []).map(Number);
const firstQuoted = (s: string): string => {
  const m = /'([^']*)'/.exec(s);
  return m === null ? '' : m[1];
};

/* ---- THE DESIGNATION WRITER (TeamBrain.assignRunners) ---- */
anchor('⭐⭐ `assignRunners` — THE DESIGNATION WRITER, the function this census censuses',
  TEAMBRAIN_PATH, 'function assignRunners(team: Team, match: Match): void {', 1);
anchor('⭐⭐ `assignRunners` CALLED from `updateTeamBrain` — the 0.4 s coach tick',
  TEAMBRAIN_PATH, '  assignRunners(team, match);', 1);
const RUN_ROLE_W_LINE = 'const RUN_ROLE_W: Record<Role, number> = '
  + '{ GK: 0, DF: 0.4, MF: 1.2, WG: 1.8, ST: 2.2 };';
anchor('⭐⭐ `RUN_ROLE_W` — THE ROLE WEIGHTS (GK 0 · DF 0.4 · MF 1.2 · WG 1.8 · ST 2.2)',
  TEAMBRAIN_PATH, RUN_ROLE_W_LINE, 1, nums(RUN_ROLE_W_LINE));
anchor('⭐⭐ the runners set CLEARED at the top of `assignRunners`', TEAMBRAIN_PATH,
  '  team.runners.clear();', 2);
anchor('⭐⭐ THE `keepOverlap` FLIGHT RULE — the licence survives its own release ball',
  TEAMBRAIN_PATH, '  const keepOverlap =', 1);
anchor('⭐⭐ its `pendingPass.targetGid` conjunct', TEAMBRAIN_PATH,
  '    match.pendingPass.targetGid === team.players[team.overlapper].gid;', 1);
anchor('⭐⭐ THE POSSESSION EARLY RETURN — every tick below is an IN-POSSESSION tick',
  TEAMBRAIN_PATH, '  if (match.possessionSide !== team.side) return;', 1);
const LIVE_CORNER_LINE = "  const liveCorner = match.phase === 'restart' && "
  + "match.restart?.kind === 'corner' && match.restart.side === team.side;";
anchor('⭐⭐ THE `liveCorner` BRANCH PREDICATE — the engine\'s own restart state',
  TEAMBRAIN_PATH, LIVE_CORNER_LINE, 1);
const HELD_CRASH_LINE = '  const heldCrash = !liveCorner && team.cornerCrash !== null '
  + '&& match.simTime < team.cornerCrash.until;';
anchor('⭐⭐ THE `heldCrash` BRANCH PREDICATE', TEAMBRAIN_PATH, HELD_CRASH_LINE, 1);
anchor('⭐⭐ THE CROSS-FLIGHT BRANCH — the open-play cross\'s held licence', TEAMBRAIN_PATH,
  '  else if (cf !== null && match.ball.owner === null) {', 1);
const COUNT_LINE_A = "    (team.mode === 'CounterAttack' || team.genome.tempo > 0.65 ? 2 : 1) +";
const COUNT_LINE_B = '    (team.mentality.urgency > 0.65 ? 1 : 0);';
anchor('⭐⭐ THE OPEN-PLAY RUNNER COUNT, line 1 — CounterAttack OR tempo > 0.65 ⇒ 2 else 1',
  TEAMBRAIN_PATH, COUNT_LINE_A, 1, nums(COUNT_LINE_A));
anchor('⭐⭐ THE OPEN-PLAY RUNNER COUNT, line 2 — urgency > 0.65 ⇒ +1', TEAMBRAIN_PATH,
  COUNT_LINE_B, 1, nums(COUNT_LINE_B));
anchor('⭐⭐ THE OPEN-PLAY SCORING — the role weight plus a localX term over 45',
  TEAMBRAIN_PATH, '    .map((p) => ({ p, s: RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45 }))',
  1);
anchor('⭐⭐ the top-`count` slice ADDED to `team.runners`', TEAMBRAIN_PATH,
  '  for (const { p } of scored.slice(0, count)) team.runners.add(p.index);', 1);
const ARRIVER_TRIGGER_LINE = '  if (ballLocalX > HALF_L - 21 && Math.abs(ballPos.y) > 10) {';
anchor('⭐⭐ THE ARRIVER TRIGGER — ball deep (HALF_L − 21) AND wide (|y| > 10)', TEAMBRAIN_PATH,
  ARRIVER_TRIGGER_LINE, 1, nums(ARRIVER_TRIGGER_LINE));
anchor('⭐⭐ the arriver = the MF (index 2), else the WEAK-SIDE WG (index 3 or 4)',
  TEAMBRAIN_PATH, '    const weakWG = ballPos.y > 0 ? team.players[3] : team.players[4];', 1);
anchor('⭐⭐ the arriver WRITE — TWO occurrences, both ENUMERATED: the live corner\'s routine '
  + 'pick (at a deeper indent, matched as a SUBSTRING) and the open-play arriver',
  TEAMBRAIN_PATH, '    if (pick) team.arriver = pick.index;', 2);
const OVERLAP_GATE_LINE = '    team.genome.attackingWidth * team.policy.overlapW > 0.3';
anchor('⭐⭐ THE 套边 GATE — `attackingWidth · overlapW > 0.3`', TEAMBRAIN_PATH,
  OVERLAP_GATE_LINE, 1, nums(OVERLAP_GATE_LINE));
anchor('⭐⭐ the 套边 pre-conditions — a WIDE carrier in the attacking half', TEAMBRAIN_PATH,
  '    Math.abs(carrier.pos.y) > 10 &&', 1);
const CONFRONTED_LINE = '        dist(o.pos, carrier.pos) < 5.5 &&';
anchor('⭐⭐ THE `confronted` TEST — an opponent inside 5.5 m and goal-side-ish',
  TEAMBRAIN_PATH, CONFRONTED_LINE, 1, nums(CONFRONTED_LINE));
anchor('⭐⭐ the overlapper WRITE', TEAMBRAIN_PATH,
  '      if (pick) team.overlapper = pick.index;', 1);
/* ---- THE 2过1 TRIGGER (mechanics.registerPass's own function, `groundPass`) ---- */
anchor('⭐⭐ `registerPass` — the pass ledger writer this census joins on', MECH_PATH,
  'function registerPass(match: Match, passer: Player, target: Player, exempt: boolean): '
  + 'void {', 1);
anchor('⭐⭐ THE BOUNCE CLASSIFICATION — the target\'s ACTION TYPE read at the kick', MECH_PATH,
  "    target.action.type === 'MakeRun' &&", 1);
anchor('⭐⭐ `match.pendingPass` WRITTEN by `registerPass` — the aim ledger', MECH_PATH,
  '  match.pendingPass = {', 1);
const WALL_C0 = "    passer.role !== 'GK' &&";
const WALL_C1 = '    d < 15 &&';
const WALL_C2 = '    pressure > 0.2 &&';
const WALL_C3 = '    passer.stamina > 0.3 &&';
const WALL_C4 = '    team.localX(passer.pos.x) > 0 &&';
const WALL_C5 = '    ((team.genome.tempo + team.genome.passBias) / 2) * '
  + 'team.policies[passer.index].wallPassW > 0.35';
const WALL_SET = '    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };';
anchor('⭐⭐ THE 2过1 CONJUNCT 1 — the passer is not the keeper', MECH_PATH, WALL_C0, 1);
anchor('⭐⭐ THE 2过1 CONJUNCT 2 — a SHORT ball, d < 15', MECH_PATH, WALL_C1, 1, nums(WALL_C1));
anchor('⭐⭐ THE 2过1 CONJUNCT 3 — UNDER PRESSURE, > 0.2', MECH_PATH, WALL_C2, 1, nums(WALL_C2));
anchor('⭐⭐ THE 2过1 CONJUNCT 4 — FRESH LEGS, stamina > 0.3', MECH_PATH, WALL_C3, 1,
  nums(WALL_C3));
anchor('⭐⭐ THE 2过1 CONJUNCT 5 — THE ATTACKING HALF, localX > 0', MECH_PATH, WALL_C4, 1,
  nums(WALL_C4));
anchor('⭐⭐ THE 2过1 CONJUNCT 6 — THE GENE GATE, `(tempo + passBias)/2 · wallPassW > 0.35`',
  MECH_PATH, WALL_C5, 1, nums(WALL_C5));
anchor('⭐⭐ THE 2过1 WRITE — a 2.3 s licence naming the partner', MECH_PATH, WALL_SET, 1,
  nums(WALL_SET));
anchor('⭐ the `pressure` the trigger reads — the SHIPPED `pressureAt` at the passer\'s spot '
  + '(TWO occurrences in `mechanics.ts`, both ENUMERATED)',
  MECH_PATH, '  const pressure = pressureAt(passer.pos, opp.players);', 2);
anchor('⭐ the `d` the trigger reads — passer → the LED point, not the target\'s feet (THREE '
  + 'occurrences in `mechanics.ts`, all ENUMERATED)',
  MECH_PATH, '  const d = dist(passer.pos, lead);', 3);
anchor('⭐⭐ THE CROSS-FLIGHT SNAPSHOT — the licence copied at the cross\'s launch', MECH_PATH,
  '    team.crossFlight = {', 1);
anchor('⭐ the cross-flight snapshot\'s own runners copy', MECH_PATH,
  '      runners: [...team.runners],', 1);
/* ---- THE PASSER'S FOUR HAT-READS (PlayerBrain.decideCarrier) ---- */
anchor('⭐⭐ READ 1 — the WALL-RETURN bonus reads the LABEL `wallRun.partnerGid`', BRAIN_PATH,
  '        mate.wallRun.partnerGid === p.gid &&', 1);
anchor('⭐⭐ READ 1\'s own bonus line', BRAIN_PATH,
  '        s *= 1.15 + (g.tempo + g.passBias) * 0.25;', 1);
anchor('⭐⭐ READ 2 — the THIRD-MAN bonus reads a mate\'s ACTION TYPE', BRAIN_PATH,
  "        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15", 1);
anchor('⭐⭐ READ 2\'s own bonus line', BRAIN_PATH,
  '        s *= 1 + g.passBias * 0.3 * W.thirdManW;', 1);
anchor('⭐⭐ READ 3 — the 套边 RELEASE reads the LABEL `team.overlapper`', BRAIN_PATH,
  '        team.overlapper === mate.index &&', 1);
anchor('⭐⭐ READ 3\'s DEVELOPED-OVERLAP conjuncts (wide, and level or beyond)', BRAIN_PATH,
  '        Math.abs(mate.pos.y) > 9 &&', 1);
anchor('⭐⭐ READ 3\'s own bonus line', BRAIN_PATH,
  '        s *= 1.3 + g.attackingWidth * 0.6;', 1);
anchor('⭐⭐ READ 4 — the ARRIVER CUTBACK candidate reads the LABEL `team.arriver`', BRAIN_PATH,
  '    p.kickCooldown <= 0 && (!mustKick || cornerCutback) && team.arriver !== null &&', 1);
const CUTBACK_WHY_LINE = '        why: ' + BT + 'cutback to ' + DOLLAR + '{arr.name} at the arc '
  + '· lane ' + DOLLAR + '{lane.toFixed(2)} · open ' + DOLLAR + '{open.toFixed(2)}' + BT + ',';
anchor('⭐⭐ READ 4\'s own candidate `why` — the DECISION RECORD this census reads it off',
  BRAIN_PATH, CUTBACK_WHY_LINE, 1);
anchor('⭐⭐ THE FIFTH ACTION-TYPE READ (#404 names four) — the THROUGH-BALL\'s runner scan',
  BRAIN_PATH, "      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;",
  1);
/* ---- THE OFF-BALL BRANCH'S `MakeRun` PUSHES (PlayerBrain.decideOffBall) ---- */
anchor('⭐⭐ `decideOffBall` — the attacking off-ball decision function', BRAIN_PATH,
  'function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {', 1);
anchor('⭐⭐ `decideOffBall` CALLED — the dispatch tail of `decidePlayer`', BRAIN_PATH,
  '  decideOffBall(p, team, opp, match);', 1);
anchor('⭐⭐ THE LICENSED-RUN PUSH\'s GUARD — `team.runners.has(p.index) || arriving`',
  BRAIN_PATH,
  "    if ((team.runners.has(p.index) || arriving) && (carrier ? carrier !== p : "
  + "match.phase === 'restart' || crashLive || crossLive)) {", 1);
const WHY_ARRIVING_LINE = "          ? 'arriving late at the cutback arc'";
const WHY_BOX_LINE = "          : match.phase === 'restart' || crashLive ? "
  + "'attacking the box for the delivery' : 'licensed run in behind',";
anchor('⭐⭐ THE WINNER\'S `why` — ARRIVING LATE', BRAIN_PATH, WHY_ARRIVING_LINE, 1);
anchor('⭐⭐ THE WINNER\'S `why` — ATTACKING THE BOX / LICENSED RUN IN BEHIND', BRAIN_PATH,
  WHY_BOX_LINE, 1);
const WHY_BURST_LINE = "      cands.push({ action: 'MakeRun', score: s, "
  + "why: 'bursting for the one-two return' });";
anchor('⭐⭐ THE ONE-TWO BURST PUSH and its `why`', BRAIN_PATH, WHY_BURST_LINE, 1);
anchor('⭐⭐ its GUARD — `p.wallRun && simTime < until − 1.1`', BRAIN_PATH,
  '    if (p.wallRun && match.simTime < p.wallRun.until - 1.1 && carrier && carrier !== p) {',
  1);
const WHY_OVERLAP_LINE = "      cands.push({ action: 'MakeRun', score: s, "
  + "why: 'overlapping outside the carrier' });";
anchor('⭐⭐ THE OVERLAP PUSH and its `why`', BRAIN_PATH, WHY_OVERLAP_LINE, 1);
anchor('⭐⭐ its GUARD — `team.overlapper === p.index`', BRAIN_PATH,
  '    if (team.overlapper === p.index && carrier && carrier !== p) {', 1);
const WHY_KEEPERUP_LINE = "      scores: [{ action: 'MakeRun', score: 1, "
  + "why: 'keeper UP for the corner — nothing left to lose' }],";
anchor('⭐⭐ THE KEEPER-UP CORNER RUN — the one `MakeRun` outside `decideOffBall`', BRAIN_PATH,
  WHY_KEEPERUP_LINE, 1);
anchor('⭐⭐ its GUARD — `team.keeperUp`', BRAIN_PATH, '  if (team.keeperUp) {', 1);
anchor('⭐⭐ THE DECISION RECORD — `p.action` with its `scores`, the winner FIRST (TWO '
  + 'occurrences — `decideOffBall`\'s and `decideCarrier`\'s — both ENUMERATED)', BRAIN_PATH,
  '  cands.sort((a, b) => b.score - a.score);', 2);
anchor('⭐⭐ the record\'s own `scores` slice — the top FOUR candidates', BRAIN_PATH,
  '    scores: cands.slice(0, 4),', 1);
/* ---- THE EXECUTOR'S `MakeRun` CASE ---- */
anchor('⭐⭐ the executor\'s `MakeRun` case', EXEC_PATH, "    case 'MakeRun': {", 1);
anchor('⭐⭐ `executeAction` — its enclosing function', EXEC_PATH,
  'export function executeAction(p: Player, match: Match, dt: number): void {', 1);
anchor('⭐⭐ the executor\'s ARRIVER route — the edge-of-box arc', EXEC_PATH,
  '      } else if (team.arriver === p.index) {', 1);
anchor('⭐⭐ the executor\'s OVERLAPPER route — around the outside', EXEC_PATH,
  "      } else if (team.overlapper === p.index && ball.owner && ball.owner.side === p.side) {",
  1);
/* ---- THE LEDGERS (Match.ts) ---- */
anchor('⭐⭐ `pendingPass` — the AIM ledger', MATCH_PATH, '  pendingPass: PendingPass | null = null;',
  1);
anchor('⭐⭐ `lastCompletedPass` — THE COMPLETION RECORD (`lp`)', MATCH_PATH,
  '  lastCompletedPass: { passerGid: number; receiverGid: number; t: number } | null = null;', 1);
anchor('⭐⭐ its WRITE at the reception — the engine\'s own completion record', MATCH_PATH,
  '        this.lastCompletedPass = { passerGid: pass.passerGid, receiverGid: p.gid, '
  + 't: this.simTime };', 1);
anchor('⭐⭐ `shotLog` — the shot ledger', MATCH_PATH, '  shotLog: ShotLogEntry[] = [];', 1);
anchor('⭐⭐ `markShotOutcome` — the ONE writer of the outcome (first outcome wins)', MATCH_PATH,
  "  markShotOutcome(outcome: 'goal' | 'saved' | 'miss'): void {", 1);
anchor('⭐⭐ `pushEvent` — the events ledger', MATCH_PATH,
  '  pushEvent(type: EventType, side: Side | -1, text: string): void {', 1);
anchor('⭐⭐ `possessionSide` — the possession side of record', MATCH_PATH,
  '  possessionSide: Side | -1 = -1;', 1);
anchor('⭐⭐ THE ENGINE\'S OWN ONE-TWO LEDGER — `stats.oneTwos` at the return\'s arrival',
  MATCH_PATH, '          team.stats.oneTwos++;', 1);
anchor('⭐⭐ THE ENGINE\'S OWN OVERLAP LEDGER — `stats.overlaps` when the release lands WIDE',
  MATCH_PATH,
  '        if (team.overlapper === p.index && Math.abs(p.pos.y) > 11) team.stats.overlaps++;',
  1);
anchor('⭐ THE ENGINE\'S OWN THIRD-MAN LEDGER', MATCH_PATH,
  "        if (pass.bounce && p.gid === pass.targetGid) team.stats.thirdMan++;", 1);
anchor('⭐⭐ THE COACH TICK — `updateTeamBrain` called under the 0.4 s timer', MATCH_PATH,
  '        updateTeamBrain(team, this);', 1);
anchor('⭐⭐ the coach timer\'s own decrement and guard', MATCH_PATH,
  '      team.brainTimer -= dt;', 1);
anchor('⭐⭐ the coach timer\'s re-arm', MATCH_PATH,
  '        team.brainTimer = TEAM_AI_INTERVAL;', 1);
anchor('⭐⭐ THE PLAYER DECISION GATE — `decisionTimer <= 0 && !pcHeld`', MATCH_PATH,
  '      if (p.decisionTimer <= 0 && !pcHeld) {', 1);
anchor('⭐⭐ its re-arm at `AI_INTERVAL`', MATCH_PATH, '        p.decisionTimer = AI_INTERVAL;', 1);
anchor('⭐ the decision timer\'s own decrement — inside `physicsStep`, AFTER the decide loop',
  PLAYER_PATH, '    this.decisionTimer -= dt;', 1);
anchor('⭐ `wallRun` — the per-player licence field', PLAYER_PATH,
  '  wallRun: { until: number; partnerGid: number } | null = null;', 1);
anchor('⭐ `team.runners` — the designation set', TEAM_PATH, '  runners = new Set<number>();', 1);
anchor('⭐ `team.arriver`', TEAM_PATH, '  arriver: number | null = null;', 1);
anchor('⭐ `team.overlapper`', TEAM_PATH, '  overlapper: number | null = null;', 1);
/* ---- THE CADENCE CONSTANTS ---- */
anchor('⭐⭐ `TEAM_AI_INTERVAL` = 0.4 — THE COACH\'S OWN CADENCE', CONST_PATH,
  'export const TEAM_AI_INTERVAL = 0.4;', 1, 0.4);
anchor('⭐⭐ `AI_INTERVAL` = 0.15 — the player\'s decision cadence', CONST_PATH,
  'export const AI_INTERVAL = 0.15;', 1, 0.15);
anchor('`DT`', CONST_PATH, 'export const DT = 1 / 60;', 1, 1 / 60);
/* ---- THE OBM SEAT (dormant) ---- */
anchor('⭐⭐ the OBM seat\'s docblock claim — the seat\'s ONLY member of `match`',
  EYES_PATH, '`perceivedSnapshot` is the ONLY member of', 1);
anchor('⭐⭐ `OBM_FEATURE_KEYS` — the vocabulary a priced run would use', GENOME_PATH,
  'export const OBM_FEATURE_KEYS = [', 1);
anchor('⭐⭐ `OBM_OUTPUT_KEYS`', GENOME_PATH, 'export const OBM_OUTPUT_KEYS = [', 1);
anchor('⭐ the seat\'s own `runScore` output — the LICENSED run\'s score', GENOME_PATH,
  "  'runScore', //     the LICENSED " + BT + 'MakeRun' + BT + ' candidate score', 1);
/* ---- THE WORLDS ---- */
anchor('⭐⭐ world 15 = world 14 + the ONE dive door, the composer CALLING world 14', A4_PATH,
  '    return { ...a4MatchFlags(LN_WORLD_VERSION), ...GK_WORLD_DOORS };', 1);
anchor('⭐⭐ `GK_WORLD_DOORS` — world 15\'s ONE door', A4_PATH,
  'export const GK_WORLD_DOORS = { gkDiveBody: true } as const;', 1);
anchor('⭐⭐ `LN_WORLD_DOORS` — world 14\'s ONE door', A4_PATH,
  'export const LN_WORLD_DOORS = { lnOwnLanePrice: true } as const;', 1);
anchor('⭐⭐ world 13 = world 12 + the ONE cushion door', A4_PATH,
  '    return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };', 1);
anchor('⭐⭐ `gkArmedVersion` — the world-15 gate', A4_PATH,
  'export function gkArmedVersion(match: Match): 0 | GkWorldVersion {', 1);
anchor('⭐⭐ `lnArmedVersion` — the world-14 gate', A4_PATH,
  'export function lnArmedVersion(match: Match): 0 | LnWorldVersion {', 1);
anchor('⭐⭐ `bqArmedVersion` — the world-13 gate', A4_PATH,
  'export function bqArmedVersion(match: Match): 0 | BqWorldVersion {', 1);

/* ========================================================================== */
/* §4 THE EXTRACTED LITERALS — every constant below is PARSED from an anchored line          */
/* ========================================================================== */
const RRW = nums(RUN_ROLE_W_LINE);            /* [0, 0.4, 1.2, 1.8, 2.2] */
const ROLE_W_GK = RRW[0]; const ROLE_W_DF = RRW[1]; const ROLE_W_MF = RRW[2];
const ROLE_W_WG = RRW[3]; const ROLE_W_ST = RRW[4];
const TEMPO_HIGH = nums(COUNT_LINE_A)[0];      /* 0.65 */
const COUNT_HIGH = nums(COUNT_LINE_A)[1];      /* 2 */
const COUNT_BASE = nums(COUNT_LINE_A)[2];      /* 1 */
const URGENCY_HIGH = nums(COUNT_LINE_B)[0];    /* 0.65 */
const ARRIVER_DEPTH = nums(ARRIVER_TRIGGER_LINE)[0]; /* 21 */
const ARRIVER_WIDE = nums(ARRIVER_TRIGGER_LINE)[1];  /* 10 */
const OVERLAP_GATE = nums(OVERLAP_GATE_LINE)[0];     /* 0.3 */
const CONFRONT_R = nums(CONFRONTED_LINE)[0];         /* 5.5 */
const WALL_D = nums(WALL_C1)[0];               /* 15 */
const WALL_PRESSURE = nums(WALL_C2)[0];        /* 0.2 */
const WALL_STAMINA = nums(WALL_C3)[0];         /* 0.3 */
const WALL_HALF = nums(WALL_C4)[0];            /* 0 */
const WALL_GENE = nums(WALL_C5)[1];            /* 0.35 (the `/ 2` divisor is nums[0]) */
const WALL_GENE_DIV = nums(WALL_C5)[0];        /* 2 */
const WALL_WINDOW = nums(WALL_SET)[0];         /* 2.3 */
const WHY_ARRIVING = firstQuoted(WHY_ARRIVING_LINE);
const WHY_BOX = firstQuoted(WHY_BOX_LINE.slice(WHY_BOX_LINE.indexOf('? ')));
const WHY_LICENSED = firstQuoted(WHY_BOX_LINE.slice(WHY_BOX_LINE.lastIndexOf(': ')));
const WHY_BURST = firstQuoted(WHY_BURST_LINE.slice(WHY_BURST_LINE.indexOf('why: ')));
const WHY_OVERLAP = firstQuoted(WHY_OVERLAP_LINE.slice(WHY_OVERLAP_LINE.indexOf('why: ')));
const WHY_KEEPERUP = firstQuoted(WHY_KEEPERUP_LINE.slice(WHY_KEEPERUP_LINE.indexOf('why: ')));
const CUTBACK_PREFIX = 'cutback to ';
const LITERALS_OK = ROLE_W_GK === 0 && ROLE_W_DF === 0.4 && ROLE_W_MF === 1.2
  && ROLE_W_WG === 1.8 && ROLE_W_ST === 2.2
  && TEMPO_HIGH === 0.65 && COUNT_HIGH === 2 && COUNT_BASE === 1 && URGENCY_HIGH === 0.65
  && ARRIVER_DEPTH === 21 && ARRIVER_WIDE === 10 && OVERLAP_GATE === 0.3 && CONFRONT_R === 5.5
  && WALL_D === 15 && WALL_PRESSURE === 0.2 && WALL_STAMINA === 0.3 && WALL_HALF === 0
  && WALL_GENE === 0.35 && WALL_GENE_DIV === 2 && WALL_WINDOW === 2.3
  && WHY_ARRIVING === 'arriving late at the cutback arc'
  && WHY_BOX === 'attacking the box for the delivery'
  && WHY_LICENSED === 'licensed run in behind'
  && WHY_BURST === 'bursting for the one-two return'
  && WHY_OVERLAP === 'overlapping outside the carrier'
  && WHY_KEEPERUP.startsWith('keeper UP for the corner')
  && SRC_OF[BRAIN_PATH].includes(CUTBACK_WHY_LINE)
  && TEAM_AI_INTERVAL === 0.4 && AI_INTERVAL === 0.15 && DT === 1 / 60;
/** ⭐⭐ THE FROZEN YIELD WINDOW — THIS census's own constant (#404 item 2(iv)), stored. */
const YIELD_WINDOW_SECONDS = 6;

/* ========================================================================== */
/* §5 SEEDS — block 12,553,000–999 (#404 items 2(ix) and 5)                    */
/* ========================================================================== */
const BLOCK_BASE = 12_553_000;
const BLOCK_TOP = 12_553_999;
/** ⭐⭐ N_FROZEN = 999 — the block's OWN AFFORDANCE after the construction receipt at
 *  12,553,999 (battery seeds 12,553,000–12,553,998). §DEV-PREFLIGHT's sizing rows are computed
 *  and stored; N = min(nRequired, the affordance) is taken as the affordance, and each row
 *  states whether it is resolvable at N_FROZEN. */
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_005_800;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const XDET_SEEDS = LOCKSTEP_SEEDS;
const FIXTURE_SEED = SCRATCH_BASE + 99;

/* ========================================================================== */
/* §6 THE ARMS — THREE, PAIRED on shared seeds; the composer CALLED, never copied            */
/* ========================================================================== */
const ARMS = ['E13', 'D13', 'E15'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  E13: 'world 13 EMPTY-BOOK — ③\'s control, LN-T1\'s ABSENT arm, THE READ OF RECORD',
  D13: 'world 13 DOSED — the played form on 13, published BESIDE',
  E15: 'world 15 EMPTY-BOOK — the frontier world, published BESIDE',
};
const ARM_WORLD: Record<Arm, 13 | 15> = { E13: 13, D13: 13, E15: 15 };
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('DS-C0 FATAL — a dose file\'s BYTES do not match the pinned value');
  banner(`  l3 got ${L3_DOSE_BYTES_SHA} want ${L3_DOSE_PIN}`);
  banner(`  pc got ${PC_DOSE_BYTES_SHA} want ${PC_DOSE_PIN}`);
  process.exit(3);
}
let L3_DOSE: readonly L3DoseCell[] | null = null;
let PC_DOSE: PcDoseTable | null = null;
let DOSE_LOAD_ERROR: string | null = null;
try {
  L3_DOSE = await loadL3Dose();
  PC_DOSE = await loadPcDose();
} catch (err) {
  DOSE_LOAD_ERROR = String(err);
}
const DOSED_ARM_REACHABLE = L3_DOSE !== null && PC_DOSE !== null
  && L3_DOSE.some((c) => c.lunges > 0)
  && PC_DOSE.some((row) => row.some((v) => v > 0));
if (!DOSED_ARM_REACHABLE) {
  banner(`DS-C0 FATAL — the DOSED arm is not reachable: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** the LN-C0 population construction per seed: the arms differ ONLY in world and doses. */
const buildMatch = (seed: number, arm: Arm): Match => {
  const v = ARM_WORLD[arm];
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(v),
  } as ConstructorParameters<typeof Match>[0]);
  if (arm === 'D13') armA4World(m, null, v, L3_DOSE, PC_DOSE);
  else armA4World(m, null, v);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed, each able to FIRE        */
/* ========================================================================== */
/** ⭐⭐ THE COACH TICK. The engine does `team.brainTimer -= dt; if (team.brainTimer <= 0)` at
 *  the HEAD of the step, so the PRE-STEP timer minus DT — the engine's own arithmetic — is the
 *  guard. Later `Math.min(brainTimer, 0.05)` writes happen AFTER the loop and cannot move it. */
const coachTickFired = (brainTimerBefore: number): boolean => brainTimerBefore - DT <= 0;
/** ⭐⭐ THE PLAYER DECISION TICK — `if (p.decisionTimer <= 0 && !pcHeld)` (anchored).
 *  `decisionTimer` is decremented inside `physicsStep`, which runs AFTER the decide loop, so
 *  the PRE-STEP value is exactly the one the guard tests. ⚠ THE LATENCY SEAT IS LIVE ON EVERY
 *  ARM OF THIS CENSUS (world 13 carries the PC recognition layer), so `notHeld` is NOT a
 *  constant: it is read off the seat's OWN `holds` map WITHOUT calling `holdFor` — which
 *  DELETES expired entries and would therefore not be byte-inert. The map read reproduces
 *  `holdFor`'s semantics exactly (`h !== undefined && simTick < h.untilTick`). */
const decisionTickFired = (decisionTimerBefore: number, notHeld: boolean): boolean =>
  decisionTimerBefore <= 0 && notHeld;
/** `holdFor`'s OWN semantics, read-only: a body is HELD iff the seat has an entry for him whose
 *  `untilTick` is still in the future at the tick the decide loop runs. */
const pcHeldRecon = (h: { untilTick: number } | undefined, simTick: number): boolean =>
  h !== undefined && simTick < h.untilTick;
/** ⭐⭐ THE WRITING BRANCH of `assignRunners`, in the SOURCE'S OWN ORDER: `heldCrash` is tested
 *  first (and is itself `!liveCorner`), then `liveCorner`, then the cross-flight hold, then
 *  open play. Read off the engine's own state as the branch reads it. */
const BRANCHES = ['openPlay', 'cornerCrashHeld', 'liveCorner', 'crossFlight'] as const;
type Branch = (typeof BRANCHES)[number];
const BRI = (b: Branch): number => BRANCHES.indexOf(b);
interface BranchState {
  liveCorner: boolean; crashHeld: boolean; crossHeld: boolean;
}
const branchOf = (s: BranchState): Branch => {
  if (!s.liveCorner && s.crashHeld) return 'cornerCrashHeld';
  if (s.liveCorner) return 'liveCorner';
  if (s.crossHeld) return 'crossFlight';
  return 'openPlay';
};
/** ⭐⭐ THE HAT CLASS OF A `MakeRun`, read off THE ENGINE'S OWN DECISION RECORD: the winner's
 *  `why` in `p.action.scores[0]` (the record is sorted, so scores[0] IS the winner and its
 *  `action` equals `p.action.type`). The six literals are EXTRACTED from their own anchored
 *  source lines, never typed. `OTHER` is the counted else-branch and CAN fire;
 *  `noWhyRecorded` is the counted shape where the record carries no candidate at all. */
const HAT_CLASSES = ['licensedRunInBehind', 'arrivingLate', 'attackingTheBox', 'oneTwoBurst',
  'overlapping', 'keeperUp', 'noWhyRecorded', 'OTHER'] as const;
type HatClass = (typeof HAT_CLASSES)[number];
const HCI = (c: HatClass): number => HAT_CLASSES.indexOf(c);
const HAT_CLASSES_NAMED: readonly HatClass[] = ['licensedRunInBehind', 'arrivingLate',
  'attackingTheBox', 'oneTwoBurst', 'overlapping', 'keeperUp'];
const hatClassOf = (why: string | null): HatClass => {
  if (why === null) return 'noWhyRecorded';
  if (why === WHY_LICENSED) return 'licensedRunInBehind';
  if (why === WHY_ARRIVING) return 'arrivingLate';
  if (why === WHY_BOX) return 'attackingTheBox';
  if (why === WHY_BURST) return 'oneTwoBurst';
  if (why === WHY_OVERLAP) return 'overlapping';
  if (why === WHY_KEEPERUP) return 'keeperUp';
  return 'OTHER';
};
/** ⭐⭐ THE HAT EPISODE — a designation from its SET tick to its CLEAR tick, per class, read
 *  off the field's own transitions tick to tick. The YIELD WINDOW extends
 *  `YIELD_WINDOW_SECONDS` past the clear. */
const EP_CLASSES = ['runner', 'arriver', 'overlapper', 'wallRun'] as const;
type EpClass = (typeof EP_CLASSES)[number];
const ECI = (c: EpClass): number => EP_CLASSES.indexOf(c);
const episodeSets = (series: readonly boolean[]): number => {
  let n = 0;
  for (let i = 0; i < series.length; i++) if (series[i] && !(i > 0 && series[i - 1])) n += 1;
  return n;
};
const inYieldWindow = (active: boolean, now: number, windowEnd: number): boolean =>
  active || now <= windowEnd;
/** ⭐⭐ THE 2过1 TRIGGER, RECONSTRUCTED — a DECLARED reconstruction of the six conjuncts, so
 *  each conjunct's KILL SHARE can be counted. ⚠ `d` uses the passer→TARGET distance where the
 *  engine uses the passer→LED-POINT distance: a PROXY, named in the field. The FIRE ITSELF is
 *  never reconstructed — it is read off `passer.wallRun`'s own transition. */
const CONJUNCTS = ['notGK', 'shortDistanceProxy', 'underPressure', 'freshLegs', 'attackingHalf',
  'geneGate'] as const;
type Conjunct = (typeof CONJUNCTS)[number];
const CJI = (c: Conjunct): number => CONJUNCTS.indexOf(c);
interface WallInputs {
  isGk: boolean; dProxy: number; pressure: number; stamina: number; localX: number;
  tempo: number; passBias: number; wallPassW: number;
}
const wallConjuncts = (w: WallInputs): boolean[] => [
  !w.isGk,
  w.dProxy < WALL_D,
  w.pressure > WALL_PRESSURE,
  w.stamina > WALL_STAMINA,
  w.localX > WALL_HALF,
  ((w.tempo + w.passBias) / WALL_GENE_DIV) * w.wallPassW > WALL_GENE,
];
const wallFiresRecon = (w: WallInputs): boolean => wallConjuncts(w).every((c) => c);
/** ⭐⭐ THE OPEN-PLAY RUNNER COUNT, RECONSTRUCTED from the engine's own inputs (the mode, the
 *  gene view and the mentality READ AFTER the coach tick, which is where the engine writes
 *  them — `mentalityOf` / `applyMentality` run in the same block, immediately before
 *  `updateTeamBrain`). */
const runnerCountRecon = (counter: boolean, tempo: number, urgency: number): number =>
  (counter || tempo > TEMPO_HIGH ? COUNT_HIGH : COUNT_BASE)
  + (urgency > URGENCY_HIGH ? 1 : 0);
/** the 套边 GENE GATE, exactly as written. */
const overlapGeneGate = (attackingWidth: number, overlapW: number): boolean =>
  attackingWidth * overlapW > OVERLAP_GATE;

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture; every
   predicate is stated with a case where it FIRES and one where it does NOT) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
/* the CADENCE predicates */
fx('coachTick.aTimerAtZeroFires', coachTickFired(0), true);
fx('coachTick.aTimerBelowDtFires', coachTickFired(DT * 0.5), true);
fx('coachTick.aFullIntervalDoesNOTFire', coachTickFired(TEAM_AI_INTERVAL), false);
fx('coachTick.exactlyOneDtDoesNOTFire', coachTickFired(DT * (1 + 1e-9)), false);
fx('decisionTick.zeroFires', decisionTickFired(0, true), true);
fx('decisionTick.negativeFires', decisionTickFired(-0.01, true), true);
fx('decisionTick.aFullIntervalDoesNOT', decisionTickFired(AI_INTERVAL, true), false);
fx('decisionTick.aHELDBodyDoesNOTDecide', decisionTickFired(0, false), false);
fx('pcHold.liveHoldIsHeld', pcHeldRecon({ untilTick: 100 }, 99), true);
fx('pcHold.exactlyAtTheExpiryIsNOTHeld', pcHeldRecon({ untilTick: 100 }, 100), false);
fx('pcHold.pastTheExpiryIsNOTHeld', pcHeldRecon({ untilTick: 100 }, 101), false);
fx('pcHold.noEntryIsNOTHeld', pcHeldRecon(undefined, 0), false);
/* the BRANCH classifier — every branch, each with a negative */
const BS = (o: Partial<BranchState>): BranchState => ({
  liveCorner: false, crashHeld: false, crossHeld: false, ...o,
});
fx('branch.openPlayIsTheDefault', branchOf(BS({})), 'openPlay');
fx('branch.heldCrashWinsOverCrossFlight',
  branchOf(BS({ crashHeld: true, crossHeld: true })), 'cornerCrashHeld');
fx('branch.aLiveCornerSUPPRESSESTheHeldCrash',
  branchOf(BS({ liveCorner: true, crashHeld: true })), 'liveCorner');
fx('branch.liveCornerWinsOverCrossFlight',
  branchOf(BS({ liveCorner: true, crossHeld: true })), 'liveCorner');
fx('branch.crossFlightFiresAlone', branchOf(BS({ crossHeld: true })), 'crossFlight');
/* the HAT-CLASS classifier — every class, with OTHER able to fire */
fx('hatClass.licensedRunInBehind', hatClassOf(WHY_LICENSED), 'licensedRunInBehind');
fx('hatClass.arrivingLate', hatClassOf(WHY_ARRIVING), 'arrivingLate');
fx('hatClass.attackingTheBox', hatClassOf(WHY_BOX), 'attackingTheBox');
fx('hatClass.oneTwoBurst', hatClassOf(WHY_BURST), 'oneTwoBurst');
fx('hatClass.overlapping', hatClassOf(WHY_OVERLAP), 'overlapping');
fx('hatClass.keeperUp', hatClassOf(WHY_KEEPERUP), 'keeperUp');
fx('hatClass.OTHER_CAN_FIRE', hatClassOf('a run I chose for myself'), 'OTHER');
fx('hatClass.noWhyRecordedCanFire', hatClassOf(null), 'noWhyRecorded');
fx('hatClass.editingTheTextMovesTheClass',
  hatClassOf(WHY_OVERLAP.replace('overlapping', 'sprinting')), 'OTHER');
fx('hatClass.aNearMissIsNotTheClass',
  hatClassOf(`${WHY_LICENSED} `), 'OTHER');
fx('hatClass.everyNamedClassIsDistinct',
  new Set(HAT_CLASSES_NAMED.map((c) => c as string)).size, HAT_CLASSES_NAMED.length);
/* the HAT EPISODE set/clear on a HAND-BUILT designation series */
fx('episode.oneSetOneClear', episodeSets([false, true, true, false]), 1);
fx('episode.twoSeparateSets', episodeSets([true, false, true, false, true]), 3);
fx('episode.aHeldDesignationIsONEEpisode',
  episodeSets([true, true, true, true, true]), 1);
fx('episode.neverSetIsZero', episodeSets([false, false, false]), 0);
fx('episode.windowIsOpenWhileActive', inYieldWindow(true, 100, -1), true);
fx('episode.windowIsOpenAfterTheClear', inYieldWindow(false, 100, 105), true);
fx('episode.windowIsSHUTBeyondTheClear', inYieldWindow(false, 106, 105), false);
fx('episode.windowIsShutBeforeAnySet', inYieldWindow(false, 0, -1), false);
fx('episode.theWindowIsTheStoredConstant', YIELD_WINDOW_SECONDS, 6);
/* the 2过1 trigger — ALL SIX CONJUNCTS TRUE, then EACH killed by ONE fixture */
const WALL_ALL: WallInputs = {
  isGk: false, dProxy: 10, pressure: 0.5, stamina: 0.9, localX: 5,
  tempo: 0.8, passBias: 0.8, wallPassW: 1,
};
fx('wall.allSixTrueFIRES', wallFiresRecon(WALL_ALL), true);
fx('wall.kill1_theKeeperCannot', wallFiresRecon({ ...WALL_ALL, isGk: true }), false);
fx('wall.kill2_aLongBallCannot', wallFiresRecon({ ...WALL_ALL, dProxy: 15 }), false);
fx('wall.kill3_unpressedCannot', wallFiresRecon({ ...WALL_ALL, pressure: 0.2 }), false);
fx('wall.kill4_tiredLegsCannot', wallFiresRecon({ ...WALL_ALL, stamina: 0.3 }), false);
fx('wall.kill5_theOwnHalfCannot', wallFiresRecon({ ...WALL_ALL, localX: 0 }), false);
fx('wall.kill6_theGeneGateCannot', wallFiresRecon({ ...WALL_ALL, wallPassW: 0.1 }), false);
fx('wall.eachKillIsExactlyOneConjunct', [
  wallConjuncts({ ...WALL_ALL, isGk: true }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, dProxy: 15 }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, pressure: 0.2 }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, stamina: 0.3 }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, localX: 0 }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, wallPassW: 0.1 }).filter((c) => !c).length,
], [1, 1, 1, 1, 1, 1]);
fx('wall.theConjunctVectorIsSix', wallConjuncts(WALL_ALL).length, 6);
/* the RUNNER COUNT reconstruction — every arm of the two-line expression */
fx('count.baseIsOne', runnerCountRecon(false, 0.5, 0.5), 1);
fx('count.counterAttackMakesTwo', runnerCountRecon(true, 0.5, 0.5), 2);
fx('count.highTempoMakesTwo', runnerCountRecon(false, 0.66, 0.5), 2);
fx('count.tempoExactlyAtTheGateDoesNOT', runnerCountRecon(false, 0.65, 0.5), 1);
fx('count.urgencyAddsOne', runnerCountRecon(false, 0.5, 0.66), 2);
fx('count.urgencyExactlyAtTheGateDoesNOT', runnerCountRecon(false, 0.5, 0.65), 1);
fx('count.allThreeMakeThree', runnerCountRecon(true, 0.9, 0.9), 3);
/* the 套边 gene gate */
fx('overlapGate.passes', overlapGeneGate(0.8, 0.8), true);
fx('overlapGate.exactlyAtTheGateDoesNOT', overlapGeneGate(0.6, 0.5), false);
fx('overlapGate.aNarrowSideDoesNOT', overlapGeneGate(0.2, 0.5), false);
/* the EXTRACTED literals */
fx('literals.allExtractedFromTheAnchoredLines', LITERALS_OK, true);
fx('literals.roleWeights', [ROLE_W_GK, ROLE_W_DF, ROLE_W_MF, ROLE_W_WG, ROLE_W_ST],
  [0, 0.4, 1.2, 1.8, 2.2]);
fx('literals.theCoachCadenceIsFourTenthsOfASecond', TEAM_AI_INTERVAL, 0.4);
fx('literals.theWallWindow', WALL_WINDOW, 2.3);
fx('literals.theArriverTrigger', [ARRIVER_DEPTH, ARRIVER_WIDE], [21, 10]);
fx('literals.halfLMinusTwentyOne', HALF_L - ARRIVER_DEPTH, HALF_L - 21);

/* ========================================================================== */
/* §8 THE FROZEN BINS AND THE PER-SEED ROW                                     */
/* ========================================================================== */
const RUN_COUNT_BINS = 5;                              /* 0 · 1 · 2 · 3 · 4+ runners */
const EP_TICK_BIN = 6; const EP_TICK_BINS = 21;        /* episode length, 0 … 120+ ticks */
const ROLES4 = ['DF', 'MF', 'WG', 'ST'] as const;
const RI = (r: string): number => {
  const i = (ROLES4 as readonly string[]).indexOf(r);
  return i < 0 ? -1 : i;
};
/** the ACTION vocabulary — READ OFF `ActionType`'s OWN union, never re-typed. */
const TYPES_SRC = readFileSync('src/sim/types.ts', 'utf8');
const AT_START = 'export type ActionType =';
const atIdx = TYPES_SRC.indexOf(AT_START);
const ACTIONS = (TYPES_SRC.slice(atIdx, TYPES_SRC.indexOf(';', atIdx))
  .match(/'([A-Za-z]+)'/g) ?? []).map((s) => s.slice(1, -1));
const ACTION_CELLS = [...ACTIONS, 'unknown'] as const;
const AI = (a: string): number => {
  const i = ACTIONS.indexOf(a);
  return i < 0 ? ACTIONS.length : i;
};

interface Row {
  ticks: number; wallMs: number;
  bqVersion: number; lnVersion: number; gkVersion: number;
  worldOk: boolean; edsChoiceOn: boolean; seamsAbsent: boolean; genomeClean: boolean;
  pcSeatPresent: boolean; pcHoldsReadable: boolean; pcHeldDecisionTicks: number;
  /* --- POPULATION A — EVERY TEAM-BRAIN TICK IN POSSESSION --- */
  coachTicks: number; coachTicksInPossession: number;
  branchTicks: number[]; runCountBins: number[]; runCountBinsByBranch: number[];
  arriverSetByBranch: number[]; overlapperSetByBranch: number[];
  runnerCountSum: number; inputCounterAttack: number; inputTempoHigh: number;
  inputUrgencyHigh: number; countReconAgree: number; countReconChecked: number;
  runnersByRole: number[]; arriverByRole: number[]; overlapperByRole: number[];
  runnerDesignations: number;
  overlapGeneGatePass: number; overlapPreconditionTicks: number; overlapConfronted: number;
  phaseAmbiguousCoachTicks: number;
  /* --- POPULATION B — EVERY ATTACKING OFF-BALL DECISION TICK --- */
  offBallDecisionTicks: number; offBallBranchReached: number;
  offBallActionTicks: number[]; makeRunTicks: number;
  hatClassTicks: number[]; keeperHatClassTicks: number[];
  hatClassTicksKeeper: number; keeperDecisionTicks: number;
  attackingHatted: number; attackingOutfield: number; possessionTicks: number;
  possessionFlipTicks: number;
  /* --- POPULATION C — THE HATS' YIELD --- */
  epSets: number[]; epTicks: number[]; epTickBins: number[];
  epPassAimed: number[]; epPassCompleted: number[]; epPassBounce: number[];
  epPassThrough: number[]; epShots: number[]; epGoals: number[];
  wallEligiblePasses: number; wallFires: number; wallConjunctKills: number[];
  wallReconAllTrue: number; wallReconAgrees: number; wallOneTwosStat: number;
  overlapSets: number; overlapReleaseFires: number; overlapArrivedStat: number;
  arriverSets: number; cutbackFormed: number; cutbackTaken: number; cutbackAssistShots: number;
  completedHatted: number; completedUnhatted: number;
  shotsAfterHatted: number; goalsAfterHatted: number;
  shotsAfterUnhatted: number; goalsAfterUnhatted: number;
  /* --- POPULATION D — THE PASSER'S HAT-READS --- */
  carrierDecisionTicks: number;
  fireWallReturnUpperBound: number; fireThirdManUpperBound: number;
  fireOverlapReleaseExact: number; fireArriverCutbackFormed: number;
  fireArriverCutbackTaken: number;
  /* --- CONTEXT --- */
  goals: number; shots: number; passes: number; thirdManStat: number;
  shotLogRows: number; shotsJoinedToAShooter: number;
}
const emptyRow = (): Row => ({
  ticks: 0, wallMs: 0, bqVersion: 0, lnVersion: 0, gkVersion: 0,
  worldOk: false, edsChoiceOn: false, seamsAbsent: false, genomeClean: false,
  pcSeatPresent: false, pcHoldsReadable: false, pcHeldDecisionTicks: 0,
  coachTicks: 0, coachTicksInPossession: 0,
  branchTicks: zeros(BRANCHES.length), runCountBins: zeros(RUN_COUNT_BINS),
  runCountBinsByBranch: zeros(BRANCHES.length * RUN_COUNT_BINS),
  arriverSetByBranch: zeros(BRANCHES.length), overlapperSetByBranch: zeros(BRANCHES.length),
  runnerCountSum: 0, inputCounterAttack: 0, inputTempoHigh: 0, inputUrgencyHigh: 0,
  countReconAgree: 0, countReconChecked: 0,
  runnersByRole: zeros(ROLES4.length), arriverByRole: zeros(ROLES4.length),
  overlapperByRole: zeros(ROLES4.length), runnerDesignations: 0,
  overlapGeneGatePass: 0, overlapPreconditionTicks: 0, overlapConfronted: 0,
  phaseAmbiguousCoachTicks: 0,
  offBallDecisionTicks: 0, offBallBranchReached: 0,
  offBallActionTicks: zeros(ACTION_CELLS.length), makeRunTicks: 0,
  hatClassTicks: zeros(HAT_CLASSES.length), keeperHatClassTicks: zeros(HAT_CLASSES.length),
  hatClassTicksKeeper: 0, keeperDecisionTicks: 0,
  attackingHatted: 0, attackingOutfield: 0, possessionTicks: 0, possessionFlipTicks: 0,
  epSets: zeros(EP_CLASSES.length), epTicks: zeros(EP_CLASSES.length),
  epTickBins: zeros(EP_CLASSES.length * EP_TICK_BINS),
  epPassAimed: zeros(EP_CLASSES.length), epPassCompleted: zeros(EP_CLASSES.length),
  epPassBounce: zeros(EP_CLASSES.length), epPassThrough: zeros(EP_CLASSES.length),
  epShots: zeros(EP_CLASSES.length), epGoals: zeros(EP_CLASSES.length),
  wallEligiblePasses: 0, wallFires: 0, wallConjunctKills: zeros(CONJUNCTS.length),
  wallReconAllTrue: 0, wallReconAgrees: 0, wallOneTwosStat: 0,
  overlapSets: 0, overlapReleaseFires: 0, overlapArrivedStat: 0,
  arriverSets: 0, cutbackFormed: 0, cutbackTaken: 0, cutbackAssistShots: 0,
  completedHatted: 0, completedUnhatted: 0,
  shotsAfterHatted: 0, goalsAfterHatted: 0, shotsAfterUnhatted: 0, goalsAfterUnhatted: 0,
  carrierDecisionTicks: 0,
  fireWallReturnUpperBound: 0, fireThirdManUpperBound: 0, fireOverlapReleaseExact: 0,
  fireArriverCutbackFormed: 0, fireArriverCutbackTaken: 0,
  goals: 0, shots: 0, passes: 0, thirdManStat: 0,
  shotLogRows: 0, shotsJoinedToAShooter: 0,
});

/* ========================================================================== */
/* §9 THE WALK — public state and the engine's own decision record, read BEFORE and AFTER
   `match.step(DT)`; NO WRAPPER                                                              */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
    action: pp.action.type,
  })),
}));
interface OpenWindow { until: number; side: Side; hatted: boolean }

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    bqCushion?: boolean; lnOwnLanePrice?: boolean; gkDiveBody?: boolean;
    edsPerceivedChoice?: boolean; obmMovement?: boolean; ctbSupportPlane?: boolean;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    pcLatency: { holds?: Map<number, { untilTick: number }> } | null;
  };
  row.bqVersion = bqArmedVersion(m);
  row.lnVersion = lnArmedVersion(m);
  row.gkVersion = gkArmedVersion(m);
  row.edsChoiceOn = mm.edsPerceivedChoice === true;
  row.seamsAbsent = mm.obmMovement !== true && mm.ctbSupportPlane !== true
    && mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as unknown as Record<string, unknown>;
    return g.lnOwnLaneWeight === undefined && g.rcReadyWeight === undefined
      && g.obmSupportWeight === undefined && g.ctbSupportDepth === undefined;
  });
  const pcHolds = mm.pcLatency === null ? null : (mm.pcLatency.holds ?? null);
  row.pcSeatPresent = mm.pcLatency !== null;
  row.pcHoldsReadable = mm.pcLatency === null || pcHolds instanceof Map;
  const players = m.allPlayers;
  const n = players.length;
  const idxOfGid = new Map<number, number>();
  for (let i = 0; i < n; i++) idxOfGid.set(players[i].gid, i);
  /* per-body, per-class hat state and yield window */
  const hatActive = EP_CLASSES.map(() => new Array<boolean>(n).fill(false));
  const hatWindowEnd = EP_CLASSES.map(() => new Array<number>(n).fill(-1));
  const hatRunTicks = EP_CLASSES.map(() => zeros(n));
  const anyHat = new Array<boolean>(n).fill(false);
  /* pre-step scratch */
  const preDecision = zeros(n);
  const preX = zeros(n); const preY = zeros(n); const preStamina = zeros(n);
  const preWallUntil = zeros(n); const preWallPartner = zeros(n);
  const preAction = new Array<string>(n).fill('');
  const notHeld = new Array<boolean>(n).fill(true);
  const openWindows: OpenWindow[] = [];
  let prevPassKey = '';
  let prevCompletedKey = '';
  let prevShotRows = 0;
  const seenOutcome: string[] = [];
  let prevOneTwos = 0; let prevOverlaps = 0; let prevThirdMan = 0;
  let prevOverlapper: (number | null)[] = [null, null];
  let prevArriver: (number | null)[] = [null, null];

  while (!m.finished) {
    if (!observe) { m.step(DT); row.ticks += 1; continue; }
    /* ---------- BEFORE THE STEP ---------- */
    const phaseBefore = m.phase;
    const possBefore = m.possessionSide;
    const ownerBefore = m.ball.owner;
    const simTimeBefore = m.simTime;
    const brainBefore: number[] = [m.teams[0].brainTimer, m.teams[1].brainTimer];
    const crashHeldBefore: boolean[] = [false, false];
    const crossHeldBefore: boolean[] = [false, false];
    const liveCornerBefore: boolean[] = [false, false];
    for (const s of [0, 1] as const) {
      const t = m.teams[s];
      const clock = simTimeBefore + DT; /* the coach runs AFTER `simTime += dt` */
      liveCornerBefore[s] = m.phase === 'restart' && m.restart !== null
        && m.restart.kind === 'corner' && m.restart.side === s;
      crashHeldBefore[s] = !liveCornerBefore[s] && t.cornerCrash !== null
        && clock < t.cornerCrash.until;
      crossHeldBefore[s] = t.crossFlight !== null && clock < t.crossFlight.until
        && ownerBefore === null;
    }
    for (let i = 0; i < n; i++) {
      const p = players[i];
      preDecision[i] = p.decisionTimer;
      preX[i] = p.pos.x; preY[i] = p.pos.y; preStamina[i] = p.stamina;
      preWallUntil[i] = p.wallRun === null ? -1 : p.wallRun.until;
      preWallPartner[i] = p.wallRun === null ? -1 : p.wallRun.partnerGid;
      preAction[i] = p.action.type as string;
      notHeld[i] = pcHolds === null
        || !pcHeldRecon(pcHolds.get(p.gid), m.simTick + 1);
      if (!notHeld[i] && preDecision[i] <= 0) row.pcHeldDecisionTicks += 1;
    }
    /* --- POPULATION D and the CUTBACK record: the carrier's own decision tick --- */
    const carrierDeciding: number[] = [];
    for (let i = 0; i < n; i++) {
      const p = players[i];
      if (p.sentOff) continue;
      if (ownerBefore !== p) continue;
      if (!decisionTickFired(preDecision[i], notHeld[i])) continue;
      carrierDeciding.push(i);
    }
    const passKeyBefore = m.pendingPass === null ? ''
      : `${m.pendingPass.t}|${m.pendingPass.passerGid}|${m.pendingPass.targetGid}`;
    const completedKeyBefore = m.lastCompletedPass === null ? ''
      : `${m.lastCompletedPass.t}|${m.lastCompletedPass.passerGid}|`
        + `${m.lastCompletedPass.receiverGid}`;
    prevPassKey = passKeyBefore; prevCompletedKey = completedKeyBefore;
    prevShotRows = m.shotLog.length;
    for (let j = 0; j < prevShotRows; j++) seenOutcome[j] = m.shotLog[j].outcome;
    prevOneTwos = m.teams[0].stats.oneTwos + m.teams[1].stats.oneTwos;
    prevOverlaps = m.teams[0].stats.overlaps + m.teams[1].stats.overlaps;
    prevThirdMan = m.teams[0].stats.thirdMan + m.teams[1].stats.thirdMan;
    prevOverlapper = [m.teams[0].overlapper, m.teams[1].overlapper];
    prevArriver = [m.teams[0].arriver, m.teams[1].arriver];

    /* ⭐ POPULATION D — the four hat-reads, reconstructed on the state the carrier's brain
     *   READ (pre-step: the decide loop runs before `physicsStep`). Three are UPPER BOUNDS
     *   because their last conjunct is computed on a candidate's OWN aim, which no public
     *   read can see; the overlap release's three conjuncts are ALL public ⇒ EXACT. */
    for (const ci of carrierDeciding) {
      const p = players[ci];
      const team = m.teams[p.side as Side];
      const lp = m.lastCompletedPass;
      row.carrierDecisionTicks += 1;
      let wallSeen = false; let thirdSeen = false; let overSeen = false;
      for (let j = 0; j < n; j++) {
        const mate = players[j];
        if (mate === p || mate.sentOff || mate.side !== p.side) continue;
        if (preWallUntil[j] > 0 && simTimeBefore < preWallUntil[j]
          && preWallPartner[j] === p.gid) wallSeen = true;
        if (lp !== null && lp.receiverGid === p.gid && simTimeBefore - lp.t < 1.5
          && lp.passerGid !== mate.gid && preAction[j] === 'MakeRun') thirdSeen = true;
        if (team.overlapper === mate.index && Math.abs(preY[j]) > 9
          && team.localX(preX[j]) > team.localX(preX[ci]) - 6) overSeen = true;
      }
      if (wallSeen) row.fireWallReturnUpperBound += 1;
      if (thirdSeen) row.fireThirdManUpperBound += 1;
      if (overSeen) row.fireOverlapReleaseExact += 1;
    }

    m.step(DT);
    row.ticks += 1;

    /* ---------- AFTER THE STEP ---------- */
    const simTime = m.simTime;
    const phaseAfter = m.phase;
    if (possBefore !== m.possessionSide) row.possessionFlipTicks += 1;

    /* --- POPULATION A — every coach tick, and the ones in possession --- */
    for (const s of [0, 1] as const) {
      if (!coachTickFired(brainBefore[s])) continue;
      const team = m.teams[s];
      row.coachTicks += 1;
      if (phaseBefore === 'kickoff' || phaseBefore === 'goalPause'
        || phaseBefore === 'halftime' || phaseBefore !== phaseAfter) {
        row.phaseAmbiguousCoachTicks += 1;
      }
      if (possBefore !== s) continue;
      row.coachTicksInPossession += 1;
      const br = branchOf({
        liveCorner: liveCornerBefore[s], crashHeld: crashHeldBefore[s],
        crossHeld: crossHeldBefore[s],
      });
      row.branchTicks[BRI(br)] += 1;
      const rc = team.runners.size;
      const rb = rc >= RUN_COUNT_BINS ? RUN_COUNT_BINS - 1 : rc;
      row.runCountBins[rb] += 1;
      row.runCountBinsByBranch[BRI(br) * RUN_COUNT_BINS + rb] += 1;
      row.runnerCountSum += rc;
      row.runnerDesignations += rc;
      if (team.arriver !== null) row.arriverSetByBranch[BRI(br)] += 1;
      if (team.overlapper !== null) row.overlapperSetByBranch[BRI(br)] += 1;
      for (const ri of team.runners) {
        const k = RI(team.players[ri].role as string);
        if (k >= 0) row.runnersByRole[k] += 1;
      }
      if (team.arriver !== null) {
        const k = RI(team.players[team.arriver].role as string);
        if (k >= 0) row.arriverByRole[k] += 1;
      }
      if (team.overlapper !== null) {
        const k = RI(team.players[team.overlapper].role as string);
        if (k >= 0) row.overlapperByRole[k] += 1;
      }
      const counter = team.mode === 'CounterAttack';
      const tempo = team.genome.tempo;
      const urgency = team.mentality.urgency;
      if (counter) row.inputCounterAttack += 1;
      if (tempo > TEMPO_HIGH) row.inputTempoHigh += 1;
      if (urgency > URGENCY_HIGH) row.inputUrgencyHigh += 1;
      if (br === 'openPlay') {
        row.countReconChecked += 1;
        const want = Math.min(runnerCountRecon(counter, tempo, urgency),
          team.players.filter((pp) => pp.role !== 'GK' && !pp.sentOff
            && pp !== ownerBefore).length);
        if (rc === want) row.countReconAgree += 1;
      }
      const gate = overlapGeneGate(team.genome.attackingWidth, team.policy.overlapW);
      if (gate) row.overlapGeneGatePass += 1;
      /* the 套边 pre-conditions, on the PRE-STEP bodies the coach read */
      if (br === 'openPlay' && gate && prevOverlapper[s] === null && ownerBefore !== null
        && ownerBefore.side === s && ownerBefore.role !== 'GK') {
        const ci = idxOfGid.get(ownerBefore.gid) ?? -1;
        if (ci >= 0 && Math.abs(preY[ci]) > ARRIVER_WIDE && team.localX(preX[ci]) > 0) {
          row.overlapPreconditionTicks += 1;
          const opp = m.teams[1 - s];
          let confronted = false;
          for (let j = 0; j < n; j++) {
            const o = players[j];
            if (o.side === s || o.sentOff) continue;
            const dd = Math.hypot(preX[j] - preX[ci], preY[j] - preY[ci]);
            if (dd < CONFRONT_R && opp.localX(preX[j]) < opp.localX(preX[ci]) + 0.5) {
              confronted = true; break;
            }
          }
          if (confronted) row.overlapConfronted += 1;
        }
      }
    }

    /* --- POPULATION B — every attacking off-ball decision tick --- */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      if (p.sentOff) continue;
      if (!decisionTickFired(preDecision[i], notHeld[i])) continue;
      if (possBefore !== p.side) continue;
      const isKeeper = p.role === 'GK';
      const wasCarrier = ownerBefore === p;
      const why = p.action.scores.length > 0 ? p.action.scores[0].why : null;
      const type = p.action.type as string;
      if (isKeeper) {
        row.keeperDecisionTicks += 1;
        if (type === 'MakeRun') {
          row.hatClassTicksKeeper += 1;
          row.keeperHatClassTicks[HCI(hatClassOf(why))] += 1;
        }
        continue;
      }
      if (wasCarrier) continue;
      row.offBallDecisionTicks += 1;
      row.offBallActionTicks[AI(type)] += 1;
      /* the ENGINE'S OWN DISPATCH, reconstructed: three early returns sit above
       * `decideOffBall` and a body that took one never entered the off-ball branch. */
      const takerHere = phaseBefore === 'restart' && m.restart !== null
        && m.restart.takerGid === p.gid;
      const deadHere = phaseBefore !== 'playing' && phaseBefore !== 'restart';
      const chaseOwnTouch = ownerBefore === null && m.dribbleTouch !== null
        && m.dribbleTouch.gid === p.gid && simTimeBefore < m.dribbleTouch.until;
      if (!takerHere && !deadHere && !chaseOwnTouch) row.offBallBranchReached += 1;
      if (type === 'MakeRun') {
        row.makeRunTicks += 1;
        row.hatClassTicks[HCI(hatClassOf(why))] += 1;
      }
      /* the CUTBACK candidate, off the carrier's own record — handled below */
    }
    /* the CUTBACK candidate FORMED / TAKEN, off the carrier's OWN decision record */
    for (const ci of carrierDeciding) {
      const p = players[ci];
      let formed = false;
      for (const sc of p.action.scores) {
        if (typeof sc.why === 'string' && sc.why.startsWith(CUTBACK_PREFIX)) formed = true;
      }
      if (formed) { row.cutbackFormed += 1; row.fireArriverCutbackFormed += 1; }
      const w0 = p.action.scores.length > 0 ? p.action.scores[0].why : null;
      if ((p.action.type as string) === 'Pass' && typeof w0 === 'string'
        && w0.startsWith(CUTBACK_PREFIX)) {
        row.cutbackTaken += 1; row.fireArriverCutbackTaken += 1;
      }
    }

    /* --- THE HAT STATE at the END of the tick, and the EPISODE transitions --- */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      const team = m.teams[p.side as Side];
      const nowState = [
        team.runners.has(p.index),
        team.arriver === p.index,
        team.overlapper === p.index,
        p.wallRun !== null && simTime < p.wallRun.until,
      ];
      for (let c = 0; c < EP_CLASSES.length; c++) {
        const was = hatActive[c][i];
        const now = nowState[c];
        if (now && !was) { row.epSets[c] += 1; hatRunTicks[c][i] = 0; }
        if (now) { row.epTicks[c] += 1; hatRunTicks[c][i] += 1; }
        if (!now && was) {
          hatWindowEnd[c][i] = simTime + YIELD_WINDOW_SECONDS;
          row.epTickBins[c * EP_TICK_BINS + binOf(hatRunTicks[c][i], EP_TICK_BIN, EP_TICK_BINS)]
            += 1;
        }
        hatActive[c][i] = now;
      }
      anyHat[i] = nowState[0] || nowState[1] || nowState[2] || nowState[3];
    }
    /* the HATTED share of the attacking outfield, per stepped tick */
    if (m.possessionSide !== -1) {
      row.possessionTicks += 1;
      for (let i = 0; i < n; i++) {
        const p = players[i];
        if (p.sentOff || p.role === 'GK' || p.side !== m.possessionSide) continue;
        row.attackingOutfield += 1;
        if (anyHat[i]) row.attackingHatted += 1;
      }
    }
    /* the OVERLAP / ARRIVER SETS, off the fields' own transitions */
    for (const s of [0, 1] as const) {
      const t = m.teams[s];
      if (t.overlapper !== null && t.overlapper !== prevOverlapper[s]) row.overlapSets += 1;
      if (t.arriver !== null && t.arriver !== prevArriver[s]) row.arriverSets += 1;
    }

    /* --- THE PASS LEDGERS: aimed, and the wall trigger --- */
    const pp = m.pendingPass;
    const passKey = pp === null ? '' : `${pp.t}|${pp.passerGid}|${pp.targetGid}`;
    if (pp !== null && passKey !== prevPassKey) {
      const ti = idxOfGid.get(pp.targetGid) ?? -1;
      const pi = idxOfGid.get(pp.passerGid) ?? -1;
      if (ti >= 0) {
        for (let c = 0; c < EP_CLASSES.length; c++) {
          if (!inYieldWindow(hatActive[c][ti], simTime, hatWindowEnd[c][ti])) continue;
          row.epPassAimed[c] += 1;
          if (pp.bounce === true) row.epPassBounce[c] += 1;
          if (m.lastPassKind !== null && m.lastPassKind.kind === 'through'
            && m.lastPassKind.t === simTime) row.epPassThrough[c] += 1;
        }
      }
      /* THE WALL PASS — the ELIGIBLE population is a GROUND pass by an outfield passer */
      const ground = m.lastPassKind !== null && m.lastPassKind.kind === 'pass'
        && m.lastPassKind.t === simTime;
      if (ground && pi >= 0 && ti >= 0 && players[pi].role !== 'GK') {
        const passer = players[pi];
        const target = players[ti];
        const team = m.teams[passer.side as Side];
        const opp = m.teams[1 - (passer.side as Side)];
        row.wallEligiblePasses += 1;
        const inputs: WallInputs = {
          isGk: false,
          dProxy: Math.hypot(passer.pos.x - target.pos.x, passer.pos.y - target.pos.y),
          pressure: pressureAt(passer.pos, opp.players),
          stamina: passer.stamina,
          localX: team.localX(passer.pos.x),
          tempo: team.genome.tempo, passBias: team.genome.passBias,
          wallPassW: team.policies[passer.index].wallPassW,
        };
        const cj = wallConjuncts(inputs);
        for (let c = 0; c < CONJUNCTS.length; c++) if (!cj[c]) row.wallConjunctKills[c] += 1;
        const reconFire = cj.every((x) => x);
        if (reconFire) row.wallReconAllTrue += 1;
        const wr = passer.wallRun;
        const fired = wr !== null && wr.partnerGid === target.gid
          && Math.abs(wr.until - (simTime + WALL_WINDOW)) < 1e-9;
        if (fired) row.wallFires += 1;
        if (fired === reconFire) row.wallReconAgrees += 1;
      }
    }
    /* --- THE COMPLETION RECORD, and the DOWNSTREAM windows --- */
    const lc = m.lastCompletedPass;
    const completedKey = lc === null ? ''
      : `${lc.t}|${lc.passerGid}|${lc.receiverGid}`;
    if (lc !== null && completedKey !== prevCompletedKey) {
      const ri2 = idxOfGid.get(lc.receiverGid) ?? -1;
      if (ri2 >= 0) {
        for (let c = 0; c < EP_CLASSES.length; c++) {
          if (inYieldWindow(hatActive[c][ri2], simTime, hatWindowEnd[c][ri2])) {
            row.epPassCompleted[c] += 1;
          }
        }
        const hatted = anyHat[ri2];
        if (hatted) row.completedHatted += 1; else row.completedUnhatted += 1;
        openWindows.push({
          until: simTime + YIELD_WINDOW_SECONDS, side: players[ri2].side as Side, hatted,
        });
      }
    }
    while (openWindows.length > 0 && openWindows[0].until < simTime) openWindows.shift();
    /* --- THE SHOT LEDGER: new rows joined to the engine's own `pendingShot.shooterGid` --- */
    if (m.shotLog.length > prevShotRows) {
      for (let j = prevShotRows; j < m.shotLog.length; j++) {
        row.shotLogRows += 1;
        const entry = m.shotLog[j];
        if (entry.assist === 'cutback') row.cutbackAssistShots += 1;
        const ps = m.pendingShot;
        const shooterGid = ps !== null && ps.logIndex === j ? ps.shooterGid : -1;
        if (shooterGid < 0) continue;
        row.shotsJoinedToAShooter += 1;
        const si = idxOfGid.get(shooterGid) ?? -1;
        if (si < 0) continue;
        for (let c = 0; c < EP_CLASSES.length; c++) {
          if (inYieldWindow(hatActive[c][si], simTime, hatWindowEnd[c][si])) row.epShots[c] += 1;
        }
        for (const w of openWindows) {
          if (w.side !== entry.side) continue;
          if (w.hatted) row.shotsAfterHatted += 1; else row.shotsAfterUnhatted += 1;
        }
      }
    }
    /* --- GOALS: the outcome flip on a row we joined to a shooter --- */
    for (let j = 0; j < m.shotLog.length; j++) {
      const before = j < prevShotRows ? seenOutcome[j] : 'pending';
      const after = m.shotLog[j].outcome;
      if (before === 'pending' && after === 'goal') {
        const ps = m.pendingShot;
        const gid = ps !== null && ps.logIndex === j ? ps.shooterGid : -1;
        const gi = gid < 0 ? -1 : (idxOfGid.get(gid) ?? -1);
        if (gi >= 0) {
          for (let c = 0; c < EP_CLASSES.length; c++) {
            if (inYieldWindow(hatActive[c][gi], simTime, hatWindowEnd[c][gi])) {
              row.epGoals[c] += 1;
            }
          }
        }
        for (const w of openWindows) {
          if (w.side !== m.shotLog[j].side) continue;
          if (w.hatted) row.goalsAfterHatted += 1; else row.goalsAfterUnhatted += 1;
        }
      }
    }
    /* --- THE ENGINE'S OWN ONE-TWO / OVERLAP / THIRD-MAN LEDGERS --- */
    const oneTwos = m.teams[0].stats.oneTwos + m.teams[1].stats.oneTwos;
    const overlaps = m.teams[0].stats.overlaps + m.teams[1].stats.overlaps;
    const thirds = m.teams[0].stats.thirdMan + m.teams[1].stats.thirdMan;
    row.wallOneTwosStat += oneTwos - prevOneTwos;
    row.overlapArrivedStat += overlaps - prevOverlaps;
    row.thirdManStat += thirds - prevThirdMan;
  }
  row.worldOk = arm === 'E15'
    ? (row.gkVersion === GK_WORLD_VERSION && mm.lnOwnLanePrice === true
      && mm.gkDiveBody === true && mm.bqCushion === true)
    : (row.bqVersion === BQ_WORLD_VERSION && row.lnVersion !== LN_WORLD_VERSION
      && row.gkVersion !== GK_WORLD_VERSION && mm.bqCushion === true
      && mm.lnOwnLanePrice !== true && mm.gkDiveBody !== true);
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<string, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.shots = st[0].shots + st[1].shots;
  row.passes = st[0].passes + st[1].passes;
  row.overlapReleaseFires = row.fireOverlapReleaseExact;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 THE CODE FACTS — the EXTRACTED call graph (canon: "the callee list is EXTRACTED from
   the hashed text — every identifier called within the span, resolved to its definition and
   hashed — never typed")                                                                    */
/* ========================================================================== */
const listTs = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((d) => (d.isDirectory() ? listTs(`${dir}/${d.name}`)
    : d.name.endsWith('.ts') ? [`${dir}/${d.name}`] : []));
const GRAPH_DIRS = ['src/sim', 'src/ai'];
const GRAPH_FILES = GRAPH_DIRS.flatMap(listTs).sort();
const GRAPH_SRC: Record<string, string[]> = {};
for (const f of GRAPH_FILES) GRAPH_SRC[f] = readFileSync(f, 'utf8').split('\n');
const KEYWORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'do', 'else', 'try',
  'return', 'case', 'typeof', 'new', 'function', 'await', 'of', 'in', 'delete', 'void',
  'yield', 'super', 'constructor']);
interface Span {
  file: string; name: string; start: number; end: number; text: string; sha: string;
}
const SPANS: Span[] = [];
const HEAD_RE = /^(\s*)(?:(?:export|private|public|protected|static|async|readonly|declare)\s+)*(?:function\s+)?(?:(?:const|let|var)\s+)?(?:(get|set)\s+)?([A-Za-z_$][\w$]*)/;
const FN_DECL = /^\s*(?:export\s+)?(?:async\s+)?function\s*\*?\s*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\(/;
const METHOD_DECL = /^\s*(?:(?:private|public|protected|static|async|readonly|get|set)\s+)*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\([^)]*\)\s*(?::\s*[^;{]+)?\s*\{\s*$/;
const ARROW_DECL = /^\s*(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::\s*[^=]+)?=>\s*\{\s*$/;
const MULTI_OPEN_M = /^\s*(?:(?:private|public|protected|static|async|readonly|get|set)\s+)*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\(\s*$/;
const MULTI_OPEN_A = /^\s*(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::[^=]+)?=\s*(?:async\s*)?\(\s*$/;
const MULTI_CLOSE = /^(\s*)\)[^;{]*\{\s*$/;
const isFnHead = (L: string, multi: boolean): boolean => (multi
  ? FN_DECL.test(L) || MULTI_OPEN_M.test(L) || MULTI_OPEN_A.test(L)
  : FN_DECL.test(L) || METHOD_DECL.test(L) || ARROW_DECL.test(L));
for (const f of GRAPH_FILES) {
  const lines = GRAPH_SRC[f];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (!L.endsWith('{')) continue;
    let headLine = i;
    let headText = L;
    const mMulti = MULTI_CLOSE.exec(L);
    if (mMulti !== null) {
      const ind = mMulti[1];
      let k = i - 1;
      while (k >= 0 && !(lines[k].startsWith(ind) && lines[k].trim().length > 0
        && lines[k].indexOf('(') >= 0 && !lines[k].endsWith('{')
        && lines[k].length - lines[k].trimStart().length === ind.length)) k -= 1;
      if (k < 0) continue;
      headLine = k; headText = lines[k];
    }
    if (headText.indexOf('(') < 0) continue;
    const t = headText.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('}')) continue;
    if (!isFnHead(headText, mMulti !== null)) continue;
    const mHead = HEAD_RE.exec(headText);
    if (mHead === null) continue;
    const name = mHead[3];
    if (KEYWORDS.has(name)) continue;
    const indent = mHead[1];
    const close = `${indent}}`;
    let end = -1;
    for (let j = i + 1; j < lines.length; j++) {
      const c = lines[j];
      if (c === close || c === `${close};` || c === `${close});`) { end = j; break; }
    }
    if (end < 0) continue;
    const text = lines.slice(headLine, end + 1).join('\n');
    SPANS.push({ file: f, name, start: headLine + 1, end: end + 1, text, sha: sha(text) });
  }
}
const spansByName = new Map<string, Span[]>();
for (const s of SPANS) {
  const arr = spansByName.get(s.name) ?? [];
  arr.push(s); spansByName.set(s.name, arr);
}
const spanKey = (s: Span): string => `${s.file}:${s.start}-${s.end}:${s.name}`;
const enclosingOf = (file: string, line: number): Span | null => {
  let best: Span | null = null;
  for (const s of SPANS) {
    if (s.file !== file || s.start > line || s.end < line) continue;
    if (best === null || s.start > best.start) best = s;
  }
  return best;
};
const CALL_RE = /([A-Za-z_$][\w$]*)\s*\(/g;
const calleesOf = (s: Span): { resolved: Span[]; external: string[] } => {
  const seen = new Set<string>();
  const resolved: Span[] = [];
  const external: string[] = [];
  let mm2: RegExpExecArray | null = null;
  CALL_RE.lastIndex = 0;
  while ((mm2 = CALL_RE.exec(s.text)) !== null) {
    const nm = mm2[1];
    if (KEYWORDS.has(nm) || seen.has(nm)) continue;
    seen.add(nm);
    const hits = spansByName.get(nm);
    if (hits === undefined) { external.push(nm); continue; }
    for (const h of hits) if (h !== s) resolved.push(h);
  }
  return { resolved, external };
};
const CLOSURE_NODE_CAP = 1200;
const closureOf = (roots: readonly Span[]): {
  nodes: Span[]; externals: string[]; depth: number; capped: boolean;
} => {
  const seen = new Map<string, Span>();
  const externals = new Set<string>();
  let frontier = [...roots];
  for (const r of roots) seen.set(spanKey(r), r);
  let depth = 0;
  let capped = false;
  while (frontier.length > 0 && depth < 12) {
    const next: Span[] = [];
    for (const nd of frontier) {
      const { resolved, external } = calleesOf(nd);
      for (const e of external) externals.add(e);
      for (const c of resolved) {
        const k = spanKey(c);
        if (seen.has(k)) continue;
        if (seen.size >= CLOSURE_NODE_CAP) { capped = true; continue; }
        seen.set(k, c); next.push(c);
      }
    }
    if (next.length === 0) break;
    frontier = next; depth += 1;
  }
  return { nodes: [...seen.values()], externals: [...externals].sort(), depth, capped };
};
const findSpan = (file: string, name: string, headNeedle: string): Span | null => {
  const hits = occurrences(SRC_OF[file], headNeedle);
  if (hits.length !== 1) return null;
  const s = enclosingOf(file, hits[0].line + 1);
  return s !== null && s.name === name ? s : null;
};
/** ⭐⭐ THE FIVE DESIGNATION-PATH ROOTS, each hashed WHOLE. */
const SPAN_ASSIGN_RUNNERS = findSpan(TEAMBRAIN_PATH, 'assignRunners',
  'function assignRunners(team: Team, match: Match): void {');
const SPAN_REGISTER_PASS = findSpan(MECH_PATH, 'registerPass',
  'function registerPass(match: Match, passer: Player, target: Player, exempt: boolean): void {');
const SPAN_DECIDE_OFFBALL = findSpan(BRAIN_PATH, 'decideOffBall',
  'function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {');
const SPAN_DECIDE_CARRIER = findSpan(BRAIN_PATH, 'decideCarrier',
  'function decideCarrier(p: Player, teamTruth: Team, oppTruth: Team, match: Match): void {');
const SPAN_EXECUTE_ACTION = findSpan(EXEC_PATH, 'executeAction',
  'export function executeAction(p: Player, match: Match, dt: number): void {');
const DESIGNATION_ROOTS = [SPAN_ASSIGN_RUNNERS, SPAN_REGISTER_PASS, SPAN_DECIDE_OFFBALL,
  SPAN_DECIDE_CARRIER, SPAN_EXECUTE_ACTION].filter((s): s is Span => s !== null);
const ROOTS_COMPLETE = DESIGNATION_ROOTS.length === 5;
const MAKERUN_CASE_LINE = occurrences(SRC_OF[EXEC_PATH], "    case 'MakeRun': {");
const MAKERUN_CASE_ENCLOSING = MAKERUN_CASE_LINE.length === 1
  ? enclosingOf(EXEC_PATH, MAKERUN_CASE_LINE[0].line) : null;
const MAKERUN_CASE_IN_EXECUTE_ACTION = MAKERUN_CASE_ENCLOSING !== null
  && SPAN_EXECUTE_ACTION !== null
  && spanKey(MAKERUN_CASE_ENCLOSING) === spanKey(SPAN_EXECUTE_ACTION);

/** ⭐⭐ THE SIX FIELDS' WRITE AND READ SITES, enumerated over `src/sim` + `src/ai`. */
const FIELD_NEEDLES = [
  { key: 'team.runners', re: /\.runners\b/ },
  { key: 'team.arriver', re: /\.arriver\b/ },
  { key: 'team.overlapper', re: /\.overlapper\b/ },
  { key: 'team.cornerCrash', re: /\.cornerCrash\b/ },
  { key: 'team.crossFlight', re: /\.crossFlight\b/ },
  { key: 'p.wallRun', re: /\.wallRun\b/ },
] as const;
const WRITE_OPS = /\.(runners|arriver|overlapper|cornerCrash|crossFlight|wallRun)\s*(=|\+=|-=)(?!=)/;
const SET_MUTATORS = /\.runners\.(add|delete|clear)\s*\(/;
interface FieldSite {
  field: string; file: string; line: number; text: string; kind: 'write' | 'read';
  fn: string | null; fnSpan: string | null; fnSha: string | null;
}
const FIELD_SITES: FieldSite[] = [];
for (const f of GRAPH_FILES) {
  const lines = GRAPH_SRC[f];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    const t = L.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue;
    for (const nd of FIELD_NEEDLES) {
      if (!nd.re.test(L)) continue;
      const enc = enclosingOf(f, i + 1);
      const isWrite = WRITE_OPS.test(L) || SET_MUTATORS.test(L);
      FIELD_SITES.push({
        field: nd.key, file: f, line: i + 1, text: t, kind: isWrite ? 'write' : 'read',
        fn: enc === null ? null : enc.name,
        fnSpan: enc === null ? null : spanKey(enc),
        fnSha: enc === null ? null : enc.sha,
      });
    }
  }
}
const fieldCount = (field: string, kind: 'write' | 'read'): number =>
  FIELD_SITES.filter((s) => s.field === field && s.kind === kind).length;
const FIELD_COUNTS = Object.fromEntries(FIELD_NEEDLES.map((nd) => [nd.key, {
  writes: fieldCount(nd.key, 'write'), reads: fieldCount(nd.key, 'read'),
  total: FIELD_SITES.filter((s) => s.field === nd.key).length,
}]));
const EVERY_FIELD_SITE_RESOLVED = FIELD_SITES.every((s) => s.fn !== null);
const EVERY_FIELD_NEEDLE_LIVE = FIELD_NEEDLES.every((nd) =>
  FIELD_SITES.some((s) => s.field === nd.key));

/** ⭐⭐ EVERY `MakeRun` CANDIDATE PUSH in the corpus, with its EXTRACTED GUARD. The guard is
 *  the nearest ENCLOSING `if (` at a STRICTLY SMALLER indentation, captured to the line that
 *  opens its body. `hatGuarded` = that guard's own text names one of the six designation
 *  fields (or the keeper-up licence, which is NAMED separately as the one non-hat run). */
const DESIGNATION_NEEDLE_RE = /\.(runners|arriver|overlapper|cornerCrash|crossFlight|wallRun)\b/;
const KEEPER_UP_RE = /\.keeperUp\b/;
interface MakeRunPush {
  sameCandidateLiteralAsPrevious: boolean; file: string; line: number; text: string; fn: string | null; fnSpan: string | null;
  guardLine: number | null; guardText: string; hatGuarded: boolean; keeperUpGuarded: boolean;
  inDecideOffBall: boolean;
}
const MAKERUN_PUSHES: MakeRunPush[] = [];
for (const f of GRAPH_FILES) {
  const lines = GRAPH_SRC[f];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    const t = L.trim();
    if (t.startsWith('//') || t.startsWith('*')) continue;
    if (!/(action|type):\s*'MakeRun'/.test(L)) continue;
    const enc = enclosingOf(f, i + 1);
    const ind = L.length - L.trimStart().length;
    let guardLine: number | null = null;
    let guardText = '';
    for (let k = i - 1; k >= 0 && (enc === null || k >= enc.start - 1); k--) {
      const c = lines[k];
      if (c.trim().length === 0) continue;
      const cInd = c.length - c.trimStart().length;
      if (cInd >= ind) continue;
      if (!/^\s*(\}\s*else\s+)?if\s*\(/.test(c)) continue;
      /* ⭐ the `if` must OPEN A BLOCK that still contains the push: its signature has to close
       * on a `) {` line at or before the push. A single-line `if (x) y;` above the push is NOT
       * this candidate's guard and is SKIPPED. */
      const parts: string[] = [];
      let opened = false;
      for (let q = k; q < lines.length && q <= i; q++) {
        parts.push(lines[q].trim());
        if (/\)\s*\{\s*$/.test(lines[q])) { opened = true; break; }
        if (/;\s*$/.test(lines[q])) break;
      }
      if (!opened) continue;
      guardLine = k + 1;
      guardText = parts.join(' ');
      break;
    }
    const prev = MAKERUN_PUSHES[MAKERUN_PUSHES.length - 1];
    MAKERUN_PUSHES.push({
      sameCandidateLiteralAsPrevious: prev !== undefined && prev.file === f
        && i + 1 - prev.line <= 2,
      file: f, line: i + 1, text: t, fn: enc === null ? null : enc.name,
      fnSpan: enc === null ? null : spanKey(enc),
      guardLine, guardText,
      hatGuarded: DESIGNATION_NEEDLE_RE.test(guardText),
      keeperUpGuarded: KEEPER_UP_RE.test(guardText),
      inDecideOffBall: SPAN_DECIDE_OFFBALL !== null && f === BRAIN_PATH
        && i + 1 >= SPAN_DECIDE_OFFBALL.start && i + 1 <= SPAN_DECIDE_OFFBALL.end,
    });
  }
}
const OFFBALL_PUSHES = MAKERUN_PUSHES.filter((mr) => mr.inDecideOffBall);
const makeRunCandidatesAllHatGuarded = ROOTS_COMPLETE && OFFBALL_PUSHES.length > 0
  && OFFBALL_PUSHES.every((mr) => mr.hatGuarded);
const NON_HAT_MAKERUN_PUSHES = MAKERUN_PUSHES.filter((mr) => !mr.hatGuarded);

/** ⭐⭐ THE OBM SEAT — every span in `offballEyes.ts` as roots, its EXTRACTED closure checked
 *  for the six designation needles. */
const OBM_ROOTS = SPANS.filter((s) => s.file === EYES_PATH);
const OBM_CLOSURE = closureOf(OBM_ROOTS);
const OBM_HITS = OBM_CLOSURE.nodes.filter((s) => DESIGNATION_NEEDLE_RE.test(s.text))
  .map(spanKey);
const obmSeatReadsNoDesignation = OBM_ROOTS.length > 0 && OBM_HITS.length === 0
  && EVERY_FIELD_NEEDLE_LIVE;

/** ⭐⭐ THE TWO DOORS over the EXTRACTED designation-path closure. A FALSE NAMES THE HIT. */
const DESIGNATION_CLOSURE = closureOf(DESIGNATION_ROOTS);
const LN_HITS = DESIGNATION_CLOSURE.nodes.filter((s) => s.text.includes('lnOwnLane'))
  .map(spanKey);
const GK_HITS = DESIGNATION_CLOSURE.nodes.filter((s) => s.text.includes('gkDiveBody'))
  .map(spanKey);
const LN_ANYWHERE = SPANS.filter((s) => s.text.includes('lnOwnLane')).map(spanKey);
const GK_ANYWHERE = SPANS.filter((s) => s.text.includes('gkDiveBody')).map(spanKey);
const lnDoorTouchesNoDesignationPath = ROOTS_COMPLETE && LN_HITS.length === 0;
const gkDoorTouchesNoDesignationPath = ROOTS_COMPLETE && GK_HITS.length === 0;
const lnNeedleIsLive = LN_ANYWHERE.length > 0;
const gkNeedleIsLive = GK_ANYWHERE.length > 0;
/** the four passer-read sites, resolved to their enclosing function(s). */
const PASSER_READ_SITES = [
  { read: 'wallReturn', consumes: 'LABEL — `mate.wallRun.partnerGid`',
    needle: '        mate.wallRun.partnerGid === p.gid &&' },
  { read: 'thirdMan', consumes: 'ACTION TYPE — `mate.action.type === \'MakeRun\'`',
    needle: "        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15" },
  { read: 'overlapRelease', consumes: 'LABEL — `team.overlapper`',
    needle: '        team.overlapper === mate.index &&' },
  { read: 'arriverCutback', consumes: 'LABEL — `team.arriver`',
    needle: '    p.kickCooldown <= 0 && (!mustKick || cornerCutback) && team.arriver !== null &&' },
  { read: 'throughBallRunnerScan (a FIFTH site; #404 item 1 names four)',
    consumes: 'ACTION TYPE — `mate.action.type !== \'MakeRun\'`',
    needle: "      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;" },
  { read: 'registerPassBounce', consumes: 'ACTION TYPE — `target.action.type === \'MakeRun\'`',
    needle: "    target.action.type === 'MakeRun' &&" },
].map((r) => {
  const file = r.needle.includes('target.action.type') ? MECH_PATH : BRAIN_PATH;
  const hits = occurrences(SRC_OF[file], r.needle);
  const enc = hits.length === 1 ? enclosingOf(file, hits[0].line) : null;
  return {
    ...r, file, occurrences: hits.length, line: hits.length === 1 ? hits[0].line : null,
    enclosingFn: enc === null ? null : enc.name,
    enclosingSpan: enc === null ? null : spanKey(enc),
    enclosingSha: enc === null ? null : enc.sha,
  };
});
const PASSER_READS_RESOLVED = PASSER_READ_SITES.every((r) => r.enclosingSpan !== null);

/* ========================================================================== */
/* §11 THE RECEIPT WALKS — gLockstep, X-DET (twice), the world pin, X-FP-PROD  */
/* ========================================================================== */
banner('DS-C0 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return { seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} walks)`);
const xDetRows = XDET_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const a = buildMatch(seed, armK); const rowA = walkMatch(a, armK, true);
  const b = buildMatch(seed, armK); const rowB = walkMatch(b, armK, true);
  const strip = (r: Row): string => JSON.stringify({ ...r, wallMs: 0 });
  return {
    seed, arm: armK, sigA: signatureOf(a), sigB: signatureOf(b),
    rowsIdentical: strip(rowA) === strip(rowB),
  };
}));
const XDET_OK = xDetRows.every((r) => r.sigA === r.sigB && r.rowsIdentical);
banner(`  X-DET ${XDET_OK ? 'GREEN' : 'RED'} (${xDetRows.length} twice-walked pairs)`);
const FP_PROD_PIN = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const fpLeague = new League({ seed: 1337 });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + 2,
});
const FP_PROD_GOT = sha(JSON.stringify(fpOut.league));
const FP_PROD_OK = FP_PROD_GOT === FP_PROD_PIN;
banner(`  X-FP-PROD ${FP_PROD_OK ? 'GREEN' : 'RED'} (${FP_PROD_GOT.slice(0, 8)}…)`);
const worldPin = ARMS.map((armK) => {
  const m = buildMatch(WORLD_PIN_SEED, armK);
  const mm = m as unknown as {
    bqCushion?: boolean; lnOwnLanePrice?: boolean; gkDiveBody?: boolean;
    edsPerceivedChoice?: boolean; obmMovement?: boolean; ctbSupportPlane?: boolean;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    pcLatency: { holds?: Map<number, { untilTick: number }> } | null;
  };
  return {
    seed: WORLD_PIN_SEED, arm: armK,
    bqArmedVersion: bqArmedVersion(m), lnArmedVersion: lnArmedVersion(m),
    gkArmedVersion: gkArmedVersion(m),
    bqCushion: mm.bqCushion === true,
    lnOwnLanePrice: mm.lnOwnLanePrice === true,
    gkDiveBody: mm.gkDiveBody === true,
    edsPerceivedChoice: mm.edsPerceivedChoice === true,
    pcHoldsReadable: mm.pcLatency === null || (mm.pcLatency.holds instanceof Map),
    seamsAbsent: mm.obmMovement !== true && mm.ctbSupportPlane !== true
      && mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true,
  };
});
const WORLD_PIN_OK = worldPin.every((w) => w.edsPerceivedChoice && w.seamsAbsent
  && w.bqCushion && w.pcHoldsReadable
  && (w.arm === 'E15'
    ? (w.gkArmedVersion === GK_WORLD_VERSION && w.lnOwnLanePrice && w.gkDiveBody)
    : (w.bqArmedVersion === BQ_WORLD_VERSION && w.lnArmedVersion !== LN_WORLD_VERSION
      && w.gkArmedVersion !== GK_WORLD_VERSION && !w.lnOwnLanePrice && !w.gkDiveBody)));

/* ========================================================================== */
/* §12 THE BATTERY — the three arms PAIRED on every seed                       */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`DS-C0 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const armK of ARMS) rows[armK] = walkMatch(buildMatch(seed, armK), armK, true);
    cells.push({ seed, rows });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `×${ARMS.length} arms (${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const armK of ARMS) {
  receiptRows[armK] = walkMatch(buildMatch(RECEIPT_SEED, armK), armK, true);
}
const walksBooked = (cells.length + 1) * ARMS.length;
const armRows = (armK: Arm): Row[] => cells.map((c) => c.rows[armK]);
const allRows = (armK: Arm): Row[] => [...armRows(armK), receiptRows[armK]];
const tot = (armK: Arm, pick: (r: Row) => number): number =>
  armRows(armK).reduce((a, r) => a + pick(r), 0);

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef {
  unit: string; what: string; den: string; num: (r: Row) => number; dn: (r: Row) => number;
}
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, what: string, den: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, den, num, dn }; };
const ONE = (): number => 1;

/* ---- POPULATION A — EVERY TEAM-BRAIN TICK IN POSSESSION ---- */
defFace('coach.ticksPerMatch', 'coach ticks per match',
  'both teams, every `updateTeamBrain` execution (the 0.4 s cadence)', 'matches',
  (r) => r.coachTicks, ONE);
defFace('coach.inPossessionShare', 'share',
  '⭐⭐ coach ticks whose team WAS the possession side — the ticks `assignRunners` runs past '
  + 'its own possession early-return', 'coach ticks',
  (r) => r.coachTicksInPossession, (r) => r.coachTicks);
defFace('coach.inPossessionTicksPerMatch', 'in-possession coach ticks per match',
  'the denominator of POPULATION A', 'matches', (r) => r.coachTicksInPossession, ONE);
defFace('coach.phaseAmbiguousShare', 'share',
  '⚠ coach ticks whose PRE-STEP phase was a timer phase or CHANGED across the tick — the '
  + 'measured size of the branch reconstruction\'s own ambiguity', 'coach ticks',
  (r) => r.phaseAmbiguousCoachTicks, (r) => r.coachTicks);
for (const b of BRANCHES) {
  defFace(`branch.share.${b}`, 'share',
    `the share of in-possession coach ticks whose WRITING BRANCH is ${b}`,
    'in-possession coach ticks', (r) => r.branchTicks[BRI(b)], (r) => r.coachTicksInPossession);
  defFace(`branch.arriverSetShare.${b}`, 'share',
    `P(an ARRIVER is designated | branch ${b})`, `${b} coach ticks`,
    (r) => r.arriverSetByBranch[BRI(b)], (r) => r.branchTicks[BRI(b)]);
  defFace(`branch.overlapperSetShare.${b}`, 'share',
    `P(an OVERLAPPER is designated | branch ${b})`, `${b} coach ticks`,
    (r) => r.overlapperSetByBranch[BRI(b)], (r) => r.branchTicks[BRI(b)]);
}
for (let k = 0; k < RUN_COUNT_BINS; k++) {
  defFace(`runCount.binShare.${k === RUN_COUNT_BINS - 1 ? `${k}plus` : k}`, 'share',
    `the share of in-possession coach ticks with ${k}${k === RUN_COUNT_BINS - 1 ? '+' : ''} `
    + 'designated runners', 'in-possession coach ticks',
    (r) => r.runCountBins[k], (r) => r.coachTicksInPossession);
}
defFace('runCount.mean', 'runners per in-possession coach tick',
  '⭐⭐ THE DESIGNATION SIZE — designated runners per coach tick in possession',
  'in-possession coach ticks', (r) => r.runnerCountSum, (r) => r.coachTicksInPossession);
defFace('runCount.designationsPerMatch', 'runner designations per match',
  'the numerator above, per match', 'matches', (r) => r.runnerDesignations, ONE);
defFace('input.counterAttackShare', 'share',
  '`team.mode === \'CounterAttack\'` at the coach tick', 'in-possession coach ticks',
  (r) => r.inputCounterAttack, (r) => r.coachTicksInPossession);
defFace('input.tempoHighShare', 'share',
  '`team.genome.tempo > 0.65` (the EXTRACTED gate) at the coach tick',
  'in-possession coach ticks', (r) => r.inputTempoHigh, (r) => r.coachTicksInPossession);
defFace('input.urgencyHighShare', 'share',
  '`team.mentality.urgency > 0.65` (the EXTRACTED gate) at the coach tick',
  'in-possession coach ticks', (r) => r.inputUrgencyHigh, (r) => r.coachTicksInPossession);
defFace('input.countReconAgreeShare', 'share',
  '⭐ a RECEIPT, not a football face: the reconstructed open-play count (capped by the '
  + 'eligible bodies) equals the runner-set size actually standing at the end of the tick',
  'open-play in-possession coach ticks', (r) => r.countReconAgree, (r) => r.countReconChecked);
for (const rr of ROLES4) {
  defFace(`runnersByRole.share.${rr}`, 'share',
    `⭐⭐ THE ROLE-WEIGHT BIAS MADE VISIBLE — the ${rr} share of all runner designations`,
    'runner designations', (r) => r.runnersByRole[RI(rr)], (r) => r.runnerDesignations);
  defFace(`arriverByRole.share.${rr}`, 'share',
    `the ${rr} share of arriver designations`, 'arriver designations',
    (r) => r.arriverByRole[RI(rr)], (r) => sum(r.arriverByRole));
  defFace(`overlapperByRole.share.${rr}`, 'share',
    `the ${rr} share of overlapper designations`, 'overlapper designations',
    (r) => r.overlapperByRole[RI(rr)], (r) => sum(r.overlapperByRole));
}
defFace('overlap.geneGatePassRate', 'share',
  '⭐⭐ THE 套边 GATE — `attackingWidth · overlapW > 0.3` (EXTRACTED) at the coach tick',
  'in-possession coach ticks', (r) => r.overlapGeneGatePass, (r) => r.coachTicksInPossession);
defFace('overlap.preconditionShare', 'share',
  'in-possession coach ticks that reach the `confronted` test at all (open play · no standing '
  + 'licence · a WIDE own carrier in the attacking half · the gene gate passed)',
  'in-possession coach ticks',
  (r) => r.overlapPreconditionTicks, (r) => r.coachTicksInPossession);
defFace('overlap.confrontedShareAmongGatePassing', 'share',
  '⭐⭐ the `confronted` share among the ticks that reach the test',
  'gate-passing coach ticks', (r) => r.overlapConfronted, (r) => r.overlapPreconditionTicks);

/* ---- POPULATION B — EVERY ATTACKING OFF-BALL DECISION TICK ---- */
defFace('offBall.decisionTicksPerMatch', 'off-ball decision ticks per match',
  'own side in possession · not the carrier · not the keeper · a decision taken this tick',
  'matches', (r) => r.offBallDecisionTicks, ONE);
defFace('offBall.branchReachedShare', 'share',
  'the share of those ticks that reach `decideOffBall` (the three early returns above it — '
  + 'the restart taker, a dead-ball phase, chasing his own touch — reconstructed)',
  'off-ball decision ticks', (r) => r.offBallBranchReached, (r) => r.offBallDecisionTicks);
for (const a of ACTION_CELLS) {
  defFace(`offBall.actionShare.${a}`, 'share',
    `the share of attacking off-ball decision ticks whose CHOSEN action is ${a}`,
    'off-ball decision ticks', (r) => r.offBallActionTicks[AI(a)],
    (r) => r.offBallDecisionTicks);
}
defFace('offBall.makeRunShare', 'share',
  '⭐⭐ THE `MakeRun` SHARE of attacking off-ball decision ticks',
  'off-ball decision ticks', (r) => r.makeRunTicks, (r) => r.offBallDecisionTicks);
defFace('offBall.makeRunIsHatShare', 'share',
  '⭐⭐ THE SIZING FACE — attacking off-ball decision ticks whose chosen action is a `MakeRun` '
  + 'carrying one of the SIX NAMED HAT classes, over all off-ball decision ticks',
  'off-ball decision ticks',
  (r) => HAT_CLASSES_NAMED.reduce((a, c) => a + r.hatClassTicks[HCI(c)], 0),
  (r) => r.offBallDecisionTicks);
defFace('offBall.makeRunOtherShare', 'share',
  '⭐⭐ THE SELECTOR\'S OWN FACE — attacking off-ball `MakeRun` decisions whose winning `why` '
  + 'is NONE of the six named hats, over all off-ball decision ticks',
  'off-ball decision ticks', (r) => r.hatClassTicks[HCI('OTHER')],
  (r) => r.offBallDecisionTicks);
for (const c of HAT_CLASSES) {
  defFace(`hatClass.shareOfMakeRun.${c}`, 'share',
    `⭐ the ${c} share of ALL attacking \`MakeRun\` decisions (off-ball bodies AND the keeper)`,
    'attacking `MakeRun` decisions',
    (r) => r.hatClassTicks[HCI(c)] + r.keeperHatClassTicks[HCI(c)],
    (r) => sum(r.hatClassTicks) + sum(r.keeperHatClassTicks));
  defFace(`hatClass.perMatch.${c}`, `${c} MakeRun decisions per match`,
    `the ${c} count itself, per match`, 'matches',
    (r) => r.hatClassTicks[HCI(c)] + r.keeperHatClassTicks[HCI(c)], ONE);
}
defFace('hatClass.keeperUpMakeRunPerMatch', 'keeper `MakeRun` decisions per match',
  'the attacking KEEPER\'s own `MakeRun` decision ticks — the one non-hat run of #404 item 1',
  'matches', (r) => r.hatClassTicksKeeper, ONE);
defFace('offBall.keeperDecisionTicksPerMatch', 'keeper decision ticks per match',
  'the attacking keeper\'s decision ticks (the denominator the keeper-up class lives in)',
  'matches', (r) => r.keeperDecisionTicks, ONE);
defFace('hatted.shareOfAttackingOutfield', 'share',
  '⭐⭐ THE HATTED SHARE OF THE ATTACKING OUTFIELD — bodies carrying ANY hat (runner · arriver '
  + '· overlapper · a live wallRun) over attacking outfield bodies, per stepped tick',
  'attacking outfield body-ticks', (r) => r.attackingHatted, (r) => r.attackingOutfield);
defFace('hatted.attackingOutfieldBodyTicksPerMatch', 'attacking outfield body-ticks per match',
  'the denominator above, per match', 'matches', (r) => r.attackingOutfield, ONE);
defFace('offBall.possessionFlipShare', 'share',
  '⚠ ticks across which `possessionSide` CHANGED — the measured size of the population\'s own '
  + 'pre-step read ambiguity', 'stepped ticks', (r) => r.possessionFlipTicks, (r) => r.ticks);

/* ---- POPULATION C — THE HATS' YIELD ---- */
for (const c of EP_CLASSES) {
  defFace(`ep.setsPerMatch.${c}`, `${c} episodes per match`,
    `HAT EPISODES of class ${c} — one designation from its SET tick to its CLEAR tick`,
    'matches', (r) => r.epSets[ECI(c)], ONE);
  defFace(`ep.meanTicks.${c}`, 'ticks per episode',
    `the mean length of a ${c} episode`, `${c} episodes`,
    (r) => r.epTicks[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.passAimedPerEpisode.${c}`, 'passes aimed per episode',
    `⭐ passes AIMED at him (\`pendingPass.targetGid\`) inside a ${c} episode or within the `
    + `${YIELD_WINDOW_SECONDS} s window after its clear`, `${c} episodes`,
    (r) => r.epPassAimed[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.passCompletedPerEpisode.${c}`, 'completions per episode',
    `passes COMPLETED to him (the engine's own \`lastCompletedPass\`) in the same window`,
    `${c} episodes`, (r) => r.epPassCompleted[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.completionShare.${c}`, 'share',
    `completions over passes aimed, in the ${c} window`, `${c} passes aimed`,
    (r) => r.epPassCompleted[ECI(c)], (r) => r.epPassAimed[ECI(c)]);
  defFace(`ep.bounceShare.${c}`, 'share',
    `⭐ the \`registerPass\` BOUNCE flag (the third-man shape) on passes aimed in the window`,
    `${c} passes aimed`, (r) => r.epPassBounce[ECI(c)], (r) => r.epPassAimed[ECI(c)]);
  defFace(`ep.throughShare.${c}`, 'share',
    `the engine's own \`lastPassKind === 'through'\` on passes aimed in the window`,
    `${c} passes aimed`, (r) => r.epPassThrough[ECI(c)], (r) => r.epPassAimed[ECI(c)]);
  defFace(`ep.shotsPerEpisode.${c}`, 'shots per episode',
    `shots BY HIM (\`shotLog\` joined to \`pendingShot.shooterGid\`) in the window`,
    `${c} episodes`, (r) => r.epShots[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.goalsPerEpisode.${c}`, 'goals per episode',
    `goals BY HIM (that row's outcome flipping to 'goal') in the window`, `${c} episodes`,
    (r) => r.epGoals[ECI(c)], (r) => r.epSets[ECI(c)]);
}
defFace('wall.eligiblePassesPerMatch', 'eligible passes per match',
  'a REGISTERED GROUND pass by an OUTFIELD passer — the trigger\'s own denominator',
  'matches', (r) => r.wallEligiblePasses, ONE);
defFace('wall.fireRatePerEligiblePass', 'share',
  '⭐⭐ THE 2过1 TRIGGER\'S FIRE RATE, read off `passer.wallRun`\'s OWN transition',
  'eligible passes', (r) => r.wallFires, (r) => r.wallEligiblePasses);
defFace('wall.firesPerMatch', 'wall-pass licences per match',
  'the numerator above, per match', 'matches', (r) => r.wallFires, ONE);
for (const c of CONJUNCTS) {
  defFace(`wall.conjunctKillShare.${c}`, 'share',
    `⚠ A DECLARED RECONSTRUCTION — the share of eligible passes on which conjunct ${c} is `
    + 'FALSE (conjuncts are not disjoint; the shares do not sum to 1)', 'eligible passes',
    (r) => r.wallConjunctKills[CJI(c)], (r) => r.wallEligiblePasses);
}
defFace('wall.reconAllTrueRate', 'share',
  '⚠ the RECONSTRUCTION\'s own predicted fire rate', 'eligible passes',
  (r) => r.wallReconAllTrue, (r) => r.wallEligiblePasses);
defFace('wall.reconAgreesShare', 'share',
  '⭐ THE CALIBRATION RECEIPT — the reconstruction agrees with the ENGINE\'s own fire',
  'eligible passes', (r) => r.wallReconAgrees, (r) => r.wallEligiblePasses);
defFace('wall.returnShareOfFires', 'share',
  '⭐⭐ THE RETURN PLAYED TO THE BURSTER INSIDE THE 2.3 s LICENCE — the engine\'s OWN '
  + '`stats.oneTwos`, over the triggers', 'wall-pass licences',
  (r) => r.wallOneTwosStat, (r) => r.wallFires);
defFace('wall.oneTwosPerMatch', 'one-twos per match',
  'the engine\'s own `stats.oneTwos`, both sides', 'matches', (r) => r.wallOneTwosStat, ONE);
defFace('overlap.setsPerMatch', 'overlap designations per match',
  '`team.overlapper` transitions to a NEW body', 'matches', (r) => r.overlapSets, ONE);
defFace('overlap.releaseFiresPerSet',
  'release-firing carrier ticks per overlap designation',
  '⭐⭐ THE DEVELOPED-OVERLAP RELEASE BRANCH FIRING — carrier decision ticks at which some mate '
  + 'satisfies all THREE of its conjuncts (EXACT: all three are public), over the sets. ⚠ NOT '
  + 'a share: one designation can be read on many carrier ticks, so this may exceed 1',
  'overlap designations', (r) => r.overlapReleaseFires, (r) => r.overlapSets);
defFace('overlap.playedToPerSet', 'overlap arrivals per overlap designation',
  '⭐⭐ THE BALL ACTUALLY PLAYED TO THE OVERLAPPER — the engine\'s OWN `stats.overlaps` (the '
  + 'release ARRIVED, wide), over the sets', 'overlap designations',
  (r) => r.overlapArrivedStat, (r) => r.overlapSets);
defFace('arriver.setsPerMatch', 'arriver designations per match',
  '`team.arriver` transitions to a NEW body', 'matches', (r) => r.arriverSets, ONE);
defFace('arriver.cutbackFormedPerMatch', 'cutback candidates per match',
  '⭐⭐ THE CUTBACK CANDIDATE FORMED — read off the carrier\'s OWN decision record (a scored '
  + 'candidate whose `why` opens with the cutback prefix)', 'matches',
  (r) => r.cutbackFormed, ONE);
defFace('arriver.cutbackFormedPerSet', 'cutback candidates per arriver designation',
  'the same count over arriver designations', 'arriver designations',
  (r) => r.cutbackFormed, (r) => r.arriverSets);
defFace('arriver.cutbackTakenShareOfFormed', 'share',
  '⭐⭐ THE CUTBACK TAKEN — the winner of the record IS the cutback', 'cutback candidates',
  (r) => r.cutbackTaken, (r) => r.cutbackFormed);
defFace('arriver.cutbackTakenPerMatch', 'cutbacks taken per match',
  'the numerator above, per match', 'matches', (r) => r.cutbackTaken, ONE);
defFace('arriver.cutbackAssistShotsPerMatch', 'cutback-assisted shots per match',
  'the engine\'s OWN `shotLog[].assist === \'cutback\'`', 'matches',
  (r) => r.cutbackAssistShots, ONE);
defFace('downstream.completedToHattedPerMatch', 'completions to a hatted receiver per match',
  'completed passes whose receiver carried ANY hat at the arrival tick', 'matches',
  (r) => r.completedHatted, ONE);
defFace('downstream.completedToUnhattedPerMatch', 'completions to an unhatted receiver per match',
  'the complement', 'matches', (r) => r.completedUnhatted, ONE);
defFace('downstream.shotsPerCompletedPassHatted', 'shots per completed pass',
  `⭐⭐ shots by the receiving side within ${YIELD_WINDOW_SECONDS} s of a completed pass to a `
  + 'HATTED receiver, per such completed pass. ⛔ NO VERDICT WORD — printed BESIDE its pair',
  'completions to a hatted receiver', (r) => r.shotsAfterHatted, (r) => r.completedHatted);
defFace('downstream.shotsPerCompletedPassUnhatted', 'shots per completed pass',
  `⭐⭐ the SAME quantity for an UNHATTED receiver. ⛔ NO VERDICT WORD`,
  'completions to an unhatted receiver', (r) => r.shotsAfterUnhatted,
  (r) => r.completedUnhatted);
defFace('downstream.goalsPerCompletedPassHatted', 'goals per completed pass',
  `goals by the receiving side within ${YIELD_WINDOW_SECONDS} s, per completed pass to a `
  + 'HATTED receiver', 'completions to a hatted receiver',
  (r) => r.goalsAfterHatted, (r) => r.completedHatted);
defFace('downstream.goalsPerCompletedPassUnhatted', 'goals per completed pass',
  'the SAME quantity for an UNHATTED receiver', 'completions to an unhatted receiver',
  (r) => r.goalsAfterUnhatted, (r) => r.completedUnhatted);
defFace('downstream.shotsAfterHattedPerMatch', 'shots per match',
  'the hatted numerator, per match', 'matches', (r) => r.shotsAfterHatted, ONE);
defFace('downstream.shotsAfterUnhattedPerMatch', 'shots per match',
  'the unhatted numerator, per match', 'matches', (r) => r.shotsAfterUnhatted, ONE);
defFace('downstream.goalsAfterHattedPerMatch', 'goals per match',
  'the hatted goal numerator, per match', 'matches', (r) => r.goalsAfterHatted, ONE);
defFace('downstream.goalsAfterUnhattedPerMatch', 'goals per match',
  'the unhatted goal numerator, per match', 'matches', (r) => r.goalsAfterUnhatted, ONE);

/* ---- POPULATION D — THE PASSER'S HAT-READS ---- */
defFace('passerRead.carrierDecisionTicksPerMatch', 'carrier decision ticks per match',
  'the denominator every read below is evaluated on', 'matches',
  (r) => r.carrierDecisionTicks, ONE);
defFace('passerRead.wallReturnUpperBoundPerMatch', 'carrier ticks per match',
  '⚠ AN UPPER BOUND — the wall-return bonus\'s THREE public conjuncts hold for some mate; its '
  + 'fourth (`gain > 0.2`, computed on a candidate\'s own aim) is not publicly readable',
  'matches', (r) => r.fireWallReturnUpperBound, ONE);
defFace('passerRead.thirdManUpperBoundPerMatch', 'carrier ticks per match',
  '⚠ AN UPPER BOUND — the third-man bonus\'s FOUR public conjuncts hold for some mate; its '
  + 'fifth (`gain > 0.15`) is not publicly readable', 'matches',
  (r) => r.fireThirdManUpperBound, ONE);
defFace('passerRead.overlapReleaseExactPerMatch', 'carrier ticks per match',
  '⭐ EXACT — all THREE conjuncts of the 套边 release branch are public', 'matches',
  (r) => r.fireOverlapReleaseExact, ONE);
defFace('passerRead.arriverCutbackFormedPerMatch', 'carrier ticks per match',
  '⭐ off the DECISION RECORD — the cutback candidate is present in the stored `scores`',
  'matches', (r) => r.fireArriverCutbackFormed, ONE);
defFace('passerRead.arriverCutbackTakenPerMatch', 'carrier ticks per match',
  '⭐ off the DECISION RECORD — the cutback candidate WON', 'matches',
  (r) => r.fireArriverCutbackTaken, ONE);
defFace('passerRead.wallReturnUpperBoundShare', 'share',
  'the same upper bound over carrier decision ticks', 'carrier decision ticks',
  (r) => r.fireWallReturnUpperBound, (r) => r.carrierDecisionTicks);
defFace('passerRead.thirdManUpperBoundShare', 'share',
  'the same upper bound over carrier decision ticks', 'carrier decision ticks',
  (r) => r.fireThirdManUpperBound, (r) => r.carrierDecisionTicks);
defFace('passerRead.overlapReleaseExactShare', 'share',
  'the EXACT overlap-release fire over carrier decision ticks', 'carrier decision ticks',
  (r) => r.fireOverlapReleaseExact, (r) => r.carrierDecisionTicks);

/* ---- CONTEXT (never read) ---- */
defFace('context.goalsPerMatch', 'goals per match', 'both sides', 'matches', (r) => r.goals, ONE);
defFace('context.shotsPerMatch', 'shots per match', 'both sides', 'matches', (r) => r.shots, ONE);
defFace('context.passesPerMatch', 'passes per match', 'both sides', 'matches',
  (r) => r.passes, ONE);
defFace('context.thirdManStatPerMatch', 'third-man arrivals per match',
  'the engine\'s own `stats.thirdMan`', 'matches', (r) => r.thirdManStat, ONE);
defFace('context.shotJoinShare', 'share',
  '⭐ THE SHOT JOIN — `shotLog` rows joined to a shooter through `pendingShot.logIndex`',
  '`shotLog` rows', (r) => r.shotsJoinedToAShooter, (r) => r.shotLogRows);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; arm: Arm; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = [];
for (const armK of ARMS) {
  const rows = armRows(armK);
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nu = rows.map((r) => f.num(r));
    const de = rows.map((r) => f.dn(r));
    const draws: number[] = [];
    for (const idx of resampleIndex) {
      let n1 = 0; let d1 = 0;
      for (const i of idx) { n1 += nu[i]; d1 += de[i]; }
      const v = ratio(n1, d1);
      if (Number.isFinite(v)) draws.push(v);
    }
    draws.sort((a, b) => a - b);
    faces.push({
      face: key, arm: armK, unit: f.unit, what: f.what, denNote: f.den,
      value: ratio(sum(nu), sum(de)), numerator: sum(nu), denominator: sum(de),
      ciLo: pctl(draws, 0.025), ciHi: pctl(draws, 0.975),
      halfWidth: (pctl(draws, 0.975) - pctl(draws, 0.025)) / 2,
    });
  }
}
const face = (k: string, armK: Arm): FaceRow => {
  const f = faces.find((x) => x.face === k && x.arm === armK);
  if (f === undefined) { banner(`DS-C0 FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};
interface DeltaRow {
  key: string; face: string; pair: string; armL: Arm; armR: Arm;
  leftValue: number; rightValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean;
}
const pairedDelta = (faceKey: string, armL: Arm, armR: Arm): DeltaRow => {
  const f = FACES[faceKey];
  const nl = cells.map((c) => f.num(c.rows[armL]));
  const dl = cells.map((c) => f.dn(c.rows[armL]));
  const nr = cells.map((c) => f.num(c.rows[armR]));
  const dr = cells.map((c) => f.dn(c.rows[armR]));
  const pl = ratio(sum(nl), sum(dl));
  const pr = ratio(sum(nr), sum(dr));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nl[i]; d1 += dl[i]; n2 += nr[i]; d2 += dr[i]; }
    const v = ratio(n1, d1) - ratio(n2, d2);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  return {
    key: `${faceKey}@${armL}-${armR}`, face: faceKey, pair: `${armL}−${armR}`, armL, armR,
    leftValue: pl, rightValue: pr, delta: pl - pr,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(pl - pr), (hi - lo) / 2),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
  };
};
const deltas: DeltaRow[] = [
  ...FACE_KEYS.map((k) => pairedDelta(k, 'D13', 'E13')),
  ...FACE_KEYS.map((k) => pairedDelta(k, 'E15', 'E13')),
];

/* ========================================================================== */
/* §14 THE PRE-REGISTERED READS — #404 item 2(vii)'s SENTENCES, VERBATIM.
   The SELECTORS are STORED BOOLEANS. E13 is the READ OF RECORD; D13's and E15's are computed
   by the SAME frozen rule and stored beside as AGREE booleans. canon, VERBATIM: "a universal
   sentence about a table ('every bin', 'the one bin') is a stored boolean or is not written". */
/* ========================================================================== */
const READ_1 = 'EVERY OPEN-PLAY RUN IS A HAT — there is no player-owned run candidate; '
  + '③ takes the DF path: DS-T0 builds the PRICED run decision on the off-ball eyes before '
  + 'any hat is removed.';
const READ_2 = 'A PLAYER-OWNED RUN EXISTS — its share is named; DS-T0 prices the hat '
  + 'against it.';
const READ_SENTENCES = { READ_1, READ_2 };
interface ReadBlock {
  noPlayerOwnedRun: boolean;
  otherCount: number; noWhyRecordedCount: number; makeRunDecisions: number;
  otherShareOfMakeRun: number;
  makeRunCandidatesAllHatGuarded: boolean;
  selected: 'READ_1' | 'READ_2'; sentence: string;
  perClassCounts: [string, number][];
  besideMakeRunShareOfOffBallTicks: number;
  besideMakeRunShareNumerator: number; besideMakeRunShareDenominator: number;
  besideHattedShareOfAttackingOutfield: number;
  besideHattedShareNumerator: number; besideHattedShareDenominator: number;
  besideShotsPerCompletedPassHatted: number; besideShotsPerCompletedPassUnhatted: number;
  besideShotsHattedNum: number; besideShotsHattedDen: number;
  besideShotsUnhattedNum: number; besideShotsUnhattedDen: number;
  besideWallFireRate: number; besideWallReturnShare: number;
  besideOverlapReleaseFiresPerSet: number;
}
const readOf = (armK: Arm): ReadBlock => {
  const rows = armRows(armK);
  const S = (pick: (r: Row) => number): number => sum(rows.map(pick));
  const other = S((r) => r.hatClassTicks[HCI('OTHER')] + r.keeperHatClassTicks[HCI('OTHER')]);
  const noWhy = S((r) => r.hatClassTicks[HCI('noWhyRecorded')]
    + r.keeperHatClassTicks[HCI('noWhyRecorded')]);
  const mrd = S((r) => sum(r.hatClassTicks) + sum(r.keeperHatClassTicks));
  const npor = other === 0 && makeRunCandidatesAllHatGuarded;
  const selected: 'READ_1' | 'READ_2' = npor ? 'READ_1' : 'READ_2';
  return {
    noPlayerOwnedRun: npor,
    otherCount: other, noWhyRecordedCount: noWhy, makeRunDecisions: mrd,
    otherShareOfMakeRun: ratio(other, mrd),
    makeRunCandidatesAllHatGuarded,
    selected, sentence: selected === 'READ_1' ? READ_1 : READ_2,
    perClassCounts: HAT_CLASSES.map((c): [string, number] =>
      [c as string, S((r) => r.hatClassTicks[HCI(c)] + r.keeperHatClassTicks[HCI(c)])]),
    besideMakeRunShareOfOffBallTicks: ratio(S((r) => r.makeRunTicks),
      S((r) => r.offBallDecisionTicks)),
    besideMakeRunShareNumerator: S((r) => r.makeRunTicks),
    besideMakeRunShareDenominator: S((r) => r.offBallDecisionTicks),
    besideHattedShareOfAttackingOutfield: ratio(S((r) => r.attackingHatted),
      S((r) => r.attackingOutfield)),
    besideHattedShareNumerator: S((r) => r.attackingHatted),
    besideHattedShareDenominator: S((r) => r.attackingOutfield),
    besideShotsPerCompletedPassHatted: ratio(S((r) => r.shotsAfterHatted),
      S((r) => r.completedHatted)),
    besideShotsPerCompletedPassUnhatted: ratio(S((r) => r.shotsAfterUnhatted),
      S((r) => r.completedUnhatted)),
    besideShotsHattedNum: S((r) => r.shotsAfterHatted),
    besideShotsHattedDen: S((r) => r.completedHatted),
    besideShotsUnhattedNum: S((r) => r.shotsAfterUnhatted),
    besideShotsUnhattedDen: S((r) => r.completedUnhatted),
    besideWallFireRate: ratio(S((r) => r.wallFires), S((r) => r.wallEligiblePasses)),
    besideWallReturnShare: ratio(S((r) => r.wallOneTwosStat), S((r) => r.wallFires)),
    besideOverlapReleaseFiresPerSet: ratio(S((r) => r.overlapReleaseFires),
      S((r) => r.overlapSets)),
  };
};
const READS = Object.fromEntries(ARMS.map((a) => [a, readOf(a)])) as Record<Arm, ReadBlock>;
const READ_OF_RECORD = READS.E13.sentence;
const D13_AGREES = READS.D13.selected === READS.E13.selected;
const E15_AGREES = READS.E15.selected === READS.E13.selected;
const AGREE_SENTENCE = {
  agrees: 'THIS ARM SELECTS THE SAME READ',
  disagrees: 'THIS ARM SELECTS A DIFFERENT READ',
};
/** ⭐ THE ANNOTATION LINES — printed on their OWN lines, never spliced into a frozen literal. */
const READ_ANNOTATIONS = [
  `OTHER (a MakeRun whose winning why is none of the six named hats), E13: `
  + `${READS.E13.otherCount} of ${READS.E13.makeRunDecisions} attacking MakeRun decisions`,
  `the code fact beside the count: makeRunCandidatesAllHatGuarded = `
  + `${makeRunCandidatesAllHatGuarded}`,
];
/** ⭐⭐ LOO — leave-one-cluster-out on the SELECTOR, per arm. SCOPED: a stability check on the
 *  selector, NOT a confidence statement about any face. */
const looOf = (armK: Arm): {
  selectorAlwaysSame: boolean; otherCountMin: number; otherCountMax: number;
} => {
  const rows = armRows(armK);
  const base = readOf(armK).selected;
  let same = true;
  let mn = Infinity; let mx = -Infinity;
  for (let drop = 0; drop < rows.length; drop++) {
    let other = 0;
    for (let i = 0; i < rows.length; i++) {
      if (i === drop) continue;
      other += rows[i].hatClassTicks[HCI('OTHER')]
        + rows[i].keeperHatClassTicks[HCI('OTHER')];
    }
    mn = Math.min(mn, other); mx = Math.max(mx, other);
    const sel = (other === 0 && makeRunCandidatesAllHatGuarded) ? 'READ_1' : 'READ_2';
    if (sel !== base) same = false;
  }
  return { selectorAlwaysSame: same, otherCountMin: mn, otherCountMax: mx };
};
const LOO = Object.fromEntries(ARMS.map((a) => [a, looOf(a)]));

/* ========================================================================== */
/* §15 THE POOLED BINS, THE BIN-DERIVED MEDIANS, AND THE SIZING                */
/* ========================================================================== */
interface Pooled {
  branchTicks: number[]; runCountBins: number[]; runCountBinsByBranch: number[];
  arriverSetByBranch: number[]; overlapperSetByBranch: number[];
  runnersByRole: number[]; arriverByRole: number[]; overlapperByRole: number[];
  offBallActionTicks: number[]; hatClassTicks: number[]; keeperHatClassTicks: number[];
  epSets: number[]; epTickBins: number[]; wallConjunctKills: number[];
}
const emptyPooled = (): Pooled => ({
  branchTicks: zeros(BRANCHES.length), runCountBins: zeros(RUN_COUNT_BINS),
  runCountBinsByBranch: zeros(BRANCHES.length * RUN_COUNT_BINS),
  arriverSetByBranch: zeros(BRANCHES.length), overlapperSetByBranch: zeros(BRANCHES.length),
  runnersByRole: zeros(ROLES4.length), arriverByRole: zeros(ROLES4.length),
  overlapperByRole: zeros(ROLES4.length), offBallActionTicks: zeros(ACTION_CELLS.length),
  hatClassTicks: zeros(HAT_CLASSES.length),
  keeperHatClassTicks: zeros(HAT_CLASSES.length), epSets: zeros(EP_CLASSES.length),
  epTickBins: zeros(EP_CLASSES.length * EP_TICK_BINS), wallConjunctKills: zeros(CONJUNCTS.length),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto(p.branchTicks, r.branchTicks);
    addInto(p.runCountBins, r.runCountBins);
    addInto(p.runCountBinsByBranch, r.runCountBinsByBranch);
    addInto(p.arriverSetByBranch, r.arriverSetByBranch);
    addInto(p.overlapperSetByBranch, r.overlapperSetByBranch);
    addInto(p.runnersByRole, r.runnersByRole);
    addInto(p.arriverByRole, r.arriverByRole);
    addInto(p.overlapperByRole, r.overlapperByRole);
    addInto(p.offBallActionTicks, r.offBallActionTicks);
    addInto(p.hatClassTicks, r.hatClassTicks);
    addInto(p.keeperHatClassTicks, r.keeperHatClassTicks);
    addInto(p.epSets, r.epSets);
    addInto(p.epTickBins, r.epTickBins);
    addInto(p.wallConjunctKills, r.wallConjunctKills);
  }
  return p;
};
const mediansFrom = (p: Pooled): Record<string, unknown> => Object.fromEntries(
  EP_CLASSES.map((c) => [`${c}EpisodeTicks`,
    binMedian(p.epTickBins.slice(ECI(c) * EP_TICK_BINS, (ECI(c) + 1) * EP_TICK_BINS),
      EP_TICK_BIN)]),
);
const pooled = {} as Record<Arm, Pooled>;
const medians = {} as Record<Arm, Record<string, unknown>>;
for (const armK of ARMS) {
  pooled[armK] = poolFrom(armRows(armK));
  medians[armK] = mediansFrom(pooled[armK]);
}
const Z975 = 1.959963984540054;
const ZSUM = 1.959963984540054 + 0.8416212335729143;
const SMOKE_N = 12;
/** ⭐⭐ THE SIZING INPUTS — the half-widths measured by the DISCLOSED 12-seed scratch smoke on
 *  900,005,800–811 (three walks per seed), transcribed here and re-derived off the artifact by
 *  `gFaces`. The declared target is a 0.05 HALF-WIDTH on each of the two named shares. */
const SIZING_INPUTS = [
  { face: 'offBall.makeRunIsHatShare', hwSmoke: 0.014410987856875238, target: 0.05 },
  { face: 'downstream.shotsPerCompletedPassHatted', hwSmoke: 0.08002764755379252,
    target: 0.05 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN, blockAffords: N_FROZEN,
    degenerate: r.hwSmoke === 0,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0);

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED, FIXTURE_SEED];
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
const CONSUMED_BLOCKS = [12_544_000, 12_545_000, 12_546_000, 12_547_000, 12_548_000,
  12_549_000, 12_550_000, 12_551_000, 12_552_000];
const EMPTY_EP_CLASSES = ARMS.flatMap((armK) => EP_CLASSES
  .filter((c) => tot(armK, (r) => r.epSets[ECI(c)]) === 0).map((c) => `${armK}.${c}`));
const EMPTY_HAT_CLASSES = ARMS.flatMap((armK) => HAT_CLASSES_NAMED
  .filter((c) => tot(armK, (r) => r.hatClassTicks[HCI(c)] + r.keeperHatClassTicks[HCI(c)]) === 0)
  .map((c) => `${armK}.${c}`));
const TWO_FRACTION_PAIRS = [
  ['downstream.shotsPerCompletedPassHatted', 'downstream.shotsAfterHattedPerMatch'],
  ['downstream.shotsPerCompletedPassUnhatted', 'downstream.shotsAfterUnhattedPerMatch'],
  ['downstream.goalsPerCompletedPassHatted', 'downstream.goalsAfterHattedPerMatch'],
  ['downstream.goalsPerCompletedPassUnhatted', 'downstream.goalsAfterUnhattedPerMatch'],
  ['runCount.mean', 'runCount.designationsPerMatch'],
  ['hatted.shareOfAttackingOutfield', 'hatted.attackingOutfieldBodyTicksPerMatch'],
  ['wall.fireRatePerEligiblePass', 'wall.firesPerMatch'],
  ['overlap.releaseFiresPerSet', 'overlap.setsPerMatch'],
  ['arriver.cutbackTakenShareOfFormed', 'arriver.cutbackTakenPerMatch'],
];
const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.edsChoiceOn
      && r.seamsAbsent && r.genomeClean && r.pcHoldsReadable)) && WORLD_PIN_OK,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt. E13 / D13: '
      + `\`bqArmedVersion(m) === ${BQ_WORLD_VERSION}\`, \`bqCushion\` TRUE, `
      + `\`lnArmedVersion(m) !== ${LN_WORLD_VERSION}\` and \`gkArmedVersion(m) !== `
      + `${GK_WORLD_VERSION}\`, both doors ABSENT. E15: \`gkArmedVersion(m) === `
      + `${GK_WORLD_VERSION}\` with \`lnOwnLanePrice\` and \`gkDiveBody\` TRUE. EVERY arm: `
      + '`edsPerceivedChoice` TRUE; every OBM / CTB / RC / BF seam ABSENT; `match.pcLatency`\'s '
      + 'own `holds` map READABLE (the seat IS live on these worlds, so the decision-tick '
      + 'predicate reads its holds directly rather than assuming `!pcHeld`); `info.genome` clean of the own-lane / RC / CTB / OBM genes (canon: '
      + `dose placement — world 15's own pin writes \`baseGenome\`/\`effGenome\`, never `
      + `\`info.genome\`). Pinned again on a CONSTRUCTED match of each arm at scratch seed `
      + `${WORLD_PIN_SEED}`,
  },
  gDoseSource: {
    ok: DOSED_ARM_REACHABLE && L3_DOSE_BYTES_SHA === L3_DOSE_PIN
      && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The D13 arm takes its doses from the SHIPPED LOADERS '
      + '(`loadL3Dose` / `loadPcDose`) and NEVER through `info.genome`; this gate hashes the '
      + 'FILE BYTES this process read and compares them to the values pinned since #388 — a '
      + `mismatch is exit 3 BEFORE any seed is walked. \`pcDoseGuard.bytesChecked\` = `
      + `${pcDoseGuard.bytesChecked}`,
  },
  gAnchoredConstants: {
    ok: ANCHORS.every((a) => a.occurrences.length === a.want) && LITERALS_OK
      && ACTIONS.length > 0 && ACTIONS.includes('MakeRun')
      && ACTIONS.includes('SupportBallCarrier') && ACTIONS.includes('MoveToFormationSpot'),
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites, EVERY one at `
      + 'its declared occurrence count: THE DESIGNATION WRITER (`assignRunners`, its call site, '
      + '`RUN_ROLE_W`, the clear, the `keepOverlap` flight rule, the possession early return, '
      + 'the three branch predicates, the two count lines, the scoring line, the runners add, '
      + 'the arriver trigger and write, the 套边 gate, its pre-conditions, `confronted`, the '
      + 'overlapper write) · THE 2过1 (all SIX conjuncts, the 2.3 s write, the `d` and '
      + '`pressure` the trigger reads, `registerPass`, the bounce classification, the '
      + 'cross-flight snapshot) · THE PASSER\'S READS (all four, plus the through-ball scan '
      + 'and the bounce — SIX sites) · THE OFF-BALL BRANCH (`decideOffBall`, its call site, '
      + 'the three pushes with their guards and the six `why` literals, the keeper-up run and '
      + 'its guard, the record\'s sort and its four-candidate slice) · THE EXECUTOR (the '
      + '`MakeRun` case, `executeAction`, the arriver and overlapper routes) · THE LEDGERS '
      + '(`pendingPass`, `lastCompletedPass` and its write, `shotLog`, `markShotOutcome`, '
      + '`pushEvent`, `possessionSide`, the one-two / overlap / third-man counters, the coach '
      + 'timer and the decision gate) · THE CADENCE (`TEAM_AI_INTERVAL` 0.4, `AI_INTERVAL` '
      + '0.15, `DT`) · THE OBM SEAT and its two key lists · the four worlds. EVERY numeric '
      + 'constant this instrument uses is PARSED OUT of its own anchored line — the role '
      + `weights (${[ROLE_W_GK, ROLE_W_DF, ROLE_W_MF, ROLE_W_WG, ROLE_W_ST].join(' · ')}), `
      + `${TEMPO_HIGH} / ${URGENCY_HIGH}, HALF_L − ${ARRIVER_DEPTH} and |y| > ${ARRIVER_WIDE}, `
      + `${OVERLAP_GATE}, ${CONFRONT_R}, ${WALL_D}, ${WALL_PRESSURE}, ${WALL_STAMINA}, `
      + `${WALL_GENE}, ${WALL_WINDOW} — and the six \`why\` literals the hat classifier reads. `
      + `The ACTION vocabulary (${ACTIONS.length}) is READ OFF \`ActionType\`'s OWN union`,
  },
  gPredicateFixtures: {
    ok: FIXTURES_OK,
    note: `⭐⭐ ${FIXTURES.length} FIXTURES, each predicate stated with a case where it FIRES `
      + 'and one where it does NOT: the COACH TICK and the DECISION TICK on the engine\'s own '
      + 'guard arithmetic (a full interval does not fire; a live latency seat suspends the '
      + 'claim); the BRANCH ladder (a live corner SUPPRESSES the held crash — the source\'s own '
      + 'order); the HAT-CLASS classifier on hand-built `why` strings, EVERY named class plus '
      + 'OTHER firing on a hand-written run and on an EDITED literal; the HAT EPISODE\'s '
      + 'set/clear on a hand-built designation series (one set, three sets, a held designation '
      + 'is ONE episode, never-set is zero) and the yield window open/shut on both sides; the '
      + '2过1 trigger with ALL SIX conjuncts true, then EACH killed by ONE fixture and the kill '
      + 'proven to be exactly one conjunct; the runner-count expression at every arm and at '
      + 'both gates\' boundaries; the 套边 gene gate. ⛔ NO fixture asserts a direction',
  },
  gLedgerRead: {
    ok: ARMS.every((armK) => tot(armK, (r) => r.wallEligiblePasses) > 0
      && tot(armK, (r) => r.shotLogRows) > 0
      && tot(armK, (r) => r.completedHatted + r.completedUnhatted) > 0
      && tot(armK, (r) => r.shotsJoinedToAShooter) > 0),
    note: '⭐⭐ canon, VERBATIM: "an event attribution reads the engine\'s own record when one '
      + 'exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only '
      + 'where no record exists, and says so". THE ENGINE\'S OWN RECORDS THIS CENSUS READS: '
      + 'the HAT CLASS off the WINNER\'S OWN `why` in `p.action.scores[0]`; the aim off '
      + '`pendingPass` (with its own `bounce` flag and `lastPassKind`); the completion off '
      + '`lastCompletedPass`; the shot off a NEW `shotLog` row joined to `pendingShot.'
      + 'shooterGid` through its own `logIndex`; the goal off that row\'s outcome flip; the '
      + 'wall-pass FIRE off `passer.wallRun`\'s own transition; the RETURN off `stats.oneTwos`; '
      + 'the overlap ARRIVAL off `stats.overlaps`; the cutback off the carrier\'s own decision '
      + 'record and `shotLog[].assist`. WHERE NO RECORD EXISTS, AND IT SAYS SO: the wall '
      + 'trigger\'s per-conjunct KILL SHARES (a DECLARED reconstruction whose `d` is a '
      + 'passer→target PROXY for the engine\'s passer→LED-POINT distance, calibrated against '
      + 'the observed fire by `wall.reconAgreesShare`), and the passer\'s wall-return and '
      + 'third-man bonuses (UPPER BOUNDS, named so in their own field names, because the last '
      + 'conjunct is computed on a candidate\'s own aim). LIVENESS beside: eligible passes '
      + `(${ARMS.map((a) => `${a} ${tot(a, (r) => r.wallEligiblePasses)}`).join(', ')}), `
      + `shot rows (${ARMS.map((a) => `${a} ${tot(a, (r) => r.shotLogRows)}`).join(', ')}), `
      + `shot rows joined to a shooter (${ARMS.map((a) =>
        `${a} ${tot(a, (r) => r.shotsJoinedToAShooter)}`).join(', ')})`,
  },
  gClassesNonVacuous: {
    ok: EMPTY_EP_CLASSES.length === 0
      && ARMS.every((armK) => tot(armK, (r) => r.makeRunTicks) > 0
        && tot(armK, (r) => r.offBallDecisionTicks) > 0
        && tot(armK, (r) => r.overlapSets) > 0 && tot(armK, (r) => r.arriverSets) > 0
        && tot(armK, (r) => r.completedHatted) > 0
        && tot(armK, (r) => r.completedUnhatted) > 0),
    note: '⛔ NO FALSE UNIVERSAL. The EMPTY classes are ENUMERATED as stored lists, per arm: '
      + `hat classes with a zero count = [${EMPTY_HAT_CLASSES.join(', ') || 'none'}]; episode `
      + `classes with a zero count = [${EMPTY_EP_CLASSES.join(', ') || 'none'}]. The gate `
      + 'asserts LIVENESS on every class the READ or its beside-sentences stand on (all four '
      + 'episode classes, the `MakeRun` population, the overlap and arriver sets, and BOTH '
      + 'sides of the downstream pair) and STORES the emptiness table for the rest, so a read '
      + 'about a class that does not exist can never be written. ⚠ LIVENESS only — never a '
      + 'direction',
  },
  gCodeFactGraph: {
    ok: ROOTS_COMPLETE && EVERY_FIELD_SITE_RESOLVED && EVERY_FIELD_NEEDLE_LIVE
      && MAKERUN_CASE_IN_EXECUTE_ACTION && PASSER_READS_RESOLVED
      && MAKERUN_PUSHES.length > 0 && !DESIGNATION_CLOSURE.capped && !OBM_CLOSURE.capped
      && lnNeedleIsLive && gkNeedleIsLive && OBM_ROOTS.length > 0,
    note: '⭐⭐ canon, VERBATIM: "a code-fact boolean about what a function reads or does not '
      + 'read is derived from the function\'s WHOLE text and from every callee whose return '
      + 'enters the read, each pinned by an anchored text hash — the call graph it was checked '
      + 'over is stored beside the boolean; a hash pins a body, it cannot see through a call; a '
      + 'needle list is a confirmation, not a census; the callee list is EXTRACTED from the '
      + 'hashed text — every identifier called within the span, resolved to its definition and '
      + `hashed — never typed". THE CORPUS: ${GRAPH_FILES.length} files under `
      + `\`src/sim\` + \`src/ai\`, ${SPANS.length} extracted function spans. THE SIX FIELDS: `
      + `${FIELD_SITES.length} occurrence sites enumerated with file, line, text, write/read `
      + 'class and their enclosing span + span HASH, EVERY one resolved, and every needle '
      + `LIVE. THE FIVE ROOTS (\`assignRunners\` · \`registerPass\` · \`decideOffBall\` · `
      + `\`decideCarrier\` · \`executeAction\`, which is where the \`MakeRun\` case's own `
      + `enclosing span resolves) are hashed WHOLE; their EXTRACTED closure holds `
      + `${DESIGNATION_CLOSURE.nodes.length} spans at depth ${DESIGNATION_CLOSURE.depth}, `
      + `uncapped. The OBM seat's closure holds ${OBM_CLOSURE.nodes.length} spans at depth `
      + `${OBM_CLOSURE.depth}, uncapped. Both door needles (\`lnOwnLane\`, \`gkDiveBody\`) are `
      + `proven LIVE on the same corpus (${LN_ANYWHERE.length} and ${GK_ANYWHERE.length} `
      + 'spans), so neither door boolean can pass vacuously. Every `MakeRun` candidate push in '
      + `the corpus (${MAKERUN_PUSHES.length}) is enumerated with its EXTRACTED GUARD`,
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure reads of public '
      + '`Match` / `Team` / `Player` / `Ball` state and of the engine\'s own decision record '
      + '(`p.action.scores`) before and after `m.step(DT)`. Proven anyway — the same scratch '
      + 'seed walked OBSERVED and UNOBSERVED yields a BYTE-IDENTICAL whole-match signature on '
      + `all ${lockstepRows.length} arm × out-of-band-scratch walks`,
  },
  gDeterminism: {
    ok: XDET_OK,
    note: '⭐ X-DET, TWICE: each of the two out-of-band scratch seeds is walked TWICE per arm, '
      + 'OBSERVED both times, and both the whole-match signature AND this instrument\'s own '
      + `per-seed row bytes are identical on all ${xDetRows.length} pairs`,
  },
  gFingerprintProd: {
    ok: FP_PROD_OK,
    note: '⭐⭐ X-FP-PROD: the production fingerprint is RECOMPUTED IN THIS PROCESS by the '
      + 'shipped recipe (`new League({ seed: 1337 })`, `runHeadless` to generation + 2, sha256 '
      + `of the save JSON) and equals the literal of record ${FP_PROD_PIN}. A census cannot `
      + 'move it — and this gate proves the tree it ran on did not',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === ''
      && gitOut('git diff --stat HEAD -- tests') === ''
      && gitOut('git status --porcelain -- tests') === '',
    note: 'worktree-vs-HEAD over `src/` AND `tests/`: `git diff --stat HEAD -- <dir>` AND '
      + '`git status --porcelain -- <dir>` all EMPTY (canon: xSrcUntouched) — X-SRC-ZERO',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds: every battery seed and '
      + 'the construction receipt lie inside block 12,553,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail is DECLARED `
      + 'in the `seeds` block, and EVERY scratch seed this instrument walks (the sizing smoke '
      + 'band, the construction receipt\'s scratch twin, the world pin, the lockstep pair which '
      + 'the X-DET pairs re-use, and the fixture attribute draw) is out-of-band and STORED '
      + 'there — canon, VERBATIM: "verifier scratch walks use the stage\'s own consumed band or '
      + 'the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"',
  },
  gSeedDisjoint: {
    ok: walkedSeeds.every((s) => s >= BLOCK_BASE) && ALL_SCRATCH.every((s) => s >= 900_000_000)
      && (IS_OVERRIDE || (walkedSeeds[0] === BLOCK_BASE && RECEIPT_SEED === BLOCK_TOP))
      && CONSUMED_BLOCKS.every((b) => b + 999 < BLOCK_BASE),
    note: 'SEED-DISJOINT at the frontier of #404 item 5 (next sim ≥ 12,553,000): every battery '
      + 'seed is ≥ 12,553,000 and inside THIS block, disjoint from every consumed block '
      + '(LN-C0 12,544,000–999 · LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′ '
      + '…549 · LN-T1′b 12,550,000–999 · GK-C0 12,551,000–999 · GK-T1 12,552,000–999), each of '
      + 'which is checked to end BELOW this block\'s base; ZERO stats consumed',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms. N = min(nRequired, the block's affordance) is `
        + 'the AFFORDANCE; each sizing row states its own `resolvableAtNFrozen`',
  },
  gLoo: {
    ok: ARMS.every((armK) => LOO[armK].selectorAlwaysSame),
    note: '⭐ LEAVE-ONE-CLUSTER-OUT on the READ SELECTOR, PER ARM: dropping any single match '
      + 'seed leaves the SELECTED READ unchanged. ⚠ SCOPED — this is a stability check on the '
      + 'selector, not a confidence statement about any face',
  },
  gTwoFractions: {
    ok: TWO_FRACTION_PAIRS.every(([a, b]) => FACE_KEYS.includes(a) && FACE_KEYS.includes(b)),
    note: `⭐ TWO FRACTIONS: each of the ${TWO_FRACTION_PAIRS.length} read-bearing quantities `
      + 'is published BOTH per its own denominator AND per match, so no share can hide a '
      + 'moving denominator. The pairs are stored in `twoFractionPairs`',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon: "an artifact is written as compact JSON — no
   indentation; the hash is over the canonical body regardless")                             */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((armK) => [armK, c.rows[armK]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'allGreen', 'faces', 'deltas', 'reads', 'medians', 'bins', 'definitions',
  'arms', 'branches', 'hatClasses', 'episodeClasses', 'conjuncts', 'actions', 'codeFacts',
  'obmVocabulary', 'passerReadTable', 'twoFractionPairs', 'doseSource', 'worldPin', 'seeds',
  'stats', 'anchoredSites', 'fixtures', 'lockstep', 'determinism', 'fingerprintProd', 'loo',
  'perf', 'sizing', 'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'DS-C0',
    title: '「点名普查」 THE DESIGNATION CENSUS — the hats AS WRITTEN per team-brain tick in '
      + 'possession · every attacking off-ball decision by hat class off the engine\'s own '
      + 'decision record · the hats\' yield off the engine\'s ledgers · the passer\'s four '
      + 'hat-reads with the ⑤ boundary stated · the six designation fields\' write and read '
      + 'sites over the EXTRACTED call graph and the OBM seat\'s vocabulary, on world 13 '
      + 'EMPTY-BOOK (the read of record), world 13 DOSED and world 15 EMPTY-BOOK, paired on '
      + 'shared seeds',
    doc: 'docs/world-model/DS-C0-DESIGNATION-CENSUS.md',
    censusFormOfRecord: 'docs/world-model/GK-C0-KEEPER-JUMP-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #404 item 2',
    kind: 'CENSUS — it publishes MEASUREMENTS. It scores no hypothesis, ARMS NO MECHANISM and '
      + 'SHIPS NOTHING. The READ SENTENCES of #404 item 2(vii) are FROZEN LITERALS selected by '
      + 'STORED booleans, and NO VERDICT WORD is printed on the yield. The commander rules.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited. The probe reads public '
      + '`Match` / `Team` / `Player` / `Ball` state and the engine\'s own decision record '
      + 'before and after `match.step(DT)`. THERE IS NO WRAPPER — `gLockstep` proves observed '
      + '≡ unobserved byte for byte PER ARM.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3).',
    honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
      + 'the artifact stores that list verbatim or stores none". THIS ARTIFACT STORES NONE. '
      + 'The list of record is docs/world-model/DS-C0-DESIGNATION-CENSUS.md §HONEST LIMITS.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: INSTRUMENT_PATH,
    instrumentSha256: sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  allGreen: false,
  arms: ARMS.map((armK) => ({
    arm: armK, label: ARM_LABEL[armK], world: ARM_WORLD[armK],
    composition: armK === 'E13'
      ? 'a4MatchFlags(13) as construction flags + armA4World(m, null, 13) — the EMPTY-BOOK '
        + 'form, world 13\'s own composition CALLED. THE READ OF RECORD.'
      : armK === 'D13'
        ? 'a4MatchFlags(13) + armA4World(m, null, 13, l3Dose, pcDose) via the SHIPPED LOADERS '
          + '— the played form; it differs from E13 ONLY in the two doses.'
        : 'a4MatchFlags(15) + armA4World(m, null, 15) — the EMPTY-BOOK frontier world (world '
          + '14 + `gkDiveBody`); it differs from E13 in the two doors and world 14\'s own '
          + 'effective-genome pin.',
    gate: armK === 'E15' ? `gkArmedVersion(m) === ${GK_WORLD_VERSION}`
      : `bqArmedVersion(m) === ${BQ_WORLD_VERSION} and lnArmedVersion(m) !== `
        + `${LN_WORLD_VERSION} and gkArmedVersion(m) !== ${GK_WORLD_VERSION}`,
  })),
  branches: {
    vocabulary: BRANCHES,
    labels: {
      openPlay: 'none of the three holds fired — the open-play scoring path (the runner count, '
        + 'the arriver trigger and the 套边 gate)',
      cornerCrashHeld: '`team.cornerCrash !== null && simTime < until` and NOT a live corner — '
        + 'the personnel locked at the hand-off are re-asserted and the function RETURNS',
      liveCorner: '`match.phase === \'restart\' && match.restart.kind === \'corner\' && '
        + 'restart.side === team.side` — the crashers are re-scored on aerial sense × '
        + 'reachability and the function RETURNS',
      crossFlight: '`team.crossFlight !== null && simTime < until && ball.owner === null` — '
        + 'the open-play cross\'s licence is re-asserted from the kick\'s snapshot',
    },
    precedence: 'cornerCrashHeld (which is itself `!liveCorner`) > liveCorner > crossFlight > '
      + 'openPlay — THE SOURCE\'S OWN ORDER, frozen before any battery seed.',
    reconstruction: '⚠ A DECLARED RECONSTRUCTION on the engine\'s own fields, read PRE-STEP '
      + '(the coach runs at the head of the step, before any body integrates) with the clock '
      + 'taken as `simTime + DT` (the engine advances `simTime` immediately before the coach '
      + 'loop). The ONE shape it cannot see exactly is a tick on which `match.phase` changes '
      + 'inside the step before the coach runs; that population\'s SIZE is published as '
      + '`coach.phaseAmbiguousShare` rather than assumed away.',
  },
  hatClasses: {
    vocabulary: HAT_CLASSES,
    read: '⭐⭐ READ OFF THE ENGINE\'S OWN DECISION RECORD — the WINNER\'S `why` in '
      + '`p.action.scores[0]`. `decideOffBall` sorts its candidates and stores the top four, so '
      + '`scores[0]` IS the winner and its `action` equals `p.action.type`. The six literals '
      + 'are EXTRACTED from their own anchored source lines, never typed.',
    labels: {
      licensedRunInBehind: `the winner's why is '${WHY_LICENSED}' — the TeamBrain runner set`,
      arrivingLate: `'${WHY_ARRIVING}' — the TeamBrain arriver`,
      attackingTheBox: `'${WHY_BOX}' — the same licence during a restart, a held corner crash `
        + 'or a cross in flight',
      oneTwoBurst: `'${WHY_BURST}' — the passer's own 2过1 licence`,
      overlapping: `'${WHY_OVERLAP}' — the TeamBrain overlapper`,
      keeperUp: `'${WHY_KEEPERUP}' — the stoppage-time attacking corner; the ONE MakeRun `
        + 'written OUTSIDE `decideOffBall`',
      noWhyRecorded: 'a `MakeRun` whose record carries no candidate at all — COUNTED',
      OTHER: '⭐⭐ ANY OTHER `MakeRun` — COUNTED, NEVER DROPPED. This is the class the read '
        + 'selector stands on, and the fixtures prove it CAN fire.',
    },
  },
  episodeClasses: {
    vocabulary: EP_CLASSES,
    definition: '⭐⭐ A HAT EPISODE is one body\'s designation of one class from its SET tick to '
      + 'its CLEAR tick, read off the field\'s OWN transitions tick to tick at the END of each '
      + 'stepped tick. `wallRun` counts as held while `p.wallRun !== null && simTime < '
      + '`p.wallRun.until`. THE YIELD WINDOW is the episode PLUS `yieldWindowSeconds` after '
      + 'the clear; every event join asks `active || now <= windowEnd`.',
    yieldWindowSeconds: YIELD_WINDOW_SECONDS,
    warning: '⚠ THE DESIGNATIONS ARE READ AT THE END OF THE TICK, not at the instant '
      + '`assignRunners` returns: the same tick can carry later writers, and EVERY write site '
      + 'of all six fields is enumerated in `codeFacts.fieldSites` so the reader can see which.',
  },
  conjuncts: {
    vocabulary: CONJUNCTS,
    note: '⚠ #404 item 2(iv) says "the five conjuncts"; the source line carries SIX (the '
      + 'keeper exclusion is the first). All SIX are anchored, all SIX are fixture-killed, and '
      + '§DEVIATIONS says so.',
    proxy: '⚠ `shortDistanceProxy` uses the passer→TARGET distance; the engine uses the '
      + 'passer→LED-POINT distance, which no public read can see. `wall.reconAgreesShare` '
      + 'publishes how often the whole reconstruction agrees with the engine\'s OWN fire.',
    conjunctsAreNotDisjoint: 'the kill shares do not sum to 1 — a pass can be killed by more '
      + 'than one conjunct, and each share is P(this conjunct is false) over eligible passes.',
  },
  actions: ACTION_CELLS,
  twoFractionPairs: TWO_FRACTION_PAIRS,
  definitions: {
    theCoachTick: '⭐⭐ `team.brainTimer -= dt; if (team.brainTimer <= 0)` at the HEAD of the '
      + 'step (anchored). The predicate is the PRE-STEP timer minus DT, the engine\'s own '
      + 'arithmetic; the later `Math.min(brainTimer, 0.05)` writes happen after the loop.',
    theDecisionTick: '⭐⭐ `if (p.decisionTimer <= 0 && !pcHeld)` (anchored). `decisionTimer` is '
      + 'decremented inside `physicsStep`, which runs AFTER the decide loop, so the PRE-STEP '
      + 'value is exactly the one the guard tests. `!pcHeld` is a constant `true` because '
      + '`match.pcLatency === null` on every walked match of every arm (`gWorld`).',
    populationA: 'EVERY `assignRunners` EXECUTION PER TEAM WHILE `possessionSide === '
      + 'team.side` — i.e. every coach tick that runs past the function\'s own possession '
      + 'early return (anchored). `possessionSide` is read PRE-STEP; the size of that read\'s '
      + 'ambiguity is published as `offBall.possessionFlipShare`.',
    populationB: 'EVERY ATTACKING OFF-BALL DECISION TICK — own side in possession (pre-step) · '
      + 'the body is not the carrier (pre-step `ball.owner`) · not the keeper · not sent off · '
      + 'a decision was taken this tick. ⚠ THE ENGINE\'S DISPATCH has three early returns above '
      + '`decideOffBall` (the restart taker; a dead-ball phase; chasing his own touch); they '
      + 'are RECONSTRUCTED and published as `offBall.branchReachedShare`, and none of them can '
      + 'produce a `MakeRun`. The attacking KEEPER\'s decision ticks are counted SEPARATELY so '
      + 'the keeper-up class is non-vacuous.',
    populationC: 'THE HAT EPISODES and their yield, off the engine\'s ledgers (see '
      + '`episodeClasses` and `gLedgerRead`).',
    populationD: 'THE CARRIER\'S OWN DECISION TICKS, on which the four passer reads are '
      + 'evaluated over his mates on the PRE-STEP state his brain read (the decide loop runs '
      + 'before `physicsStep`). ⚠ Within one tick the bodies decide in an alternating order, so '
      + 'a mate\'s `action.type` may already be this tick\'s; declared, never glossed.',
    theHattedShare: 'bodies of the possession side that are not the keeper and not sent off, '
      + 'carrying ANY of the four hats at the end of a stepped tick, over all such bodies. '
      + 'The CARRIER is INCLUDED in the denominator (he is an outfield body and can carry a '
      + 'standing designation); declared.',
    theDownstreamPair: `for each COMPLETED pass, whether shots and goals by the RECEIVING SIDE `
      + `fall within ${YIELD_WINDOW_SECONDS} s of it, split by whether the receiver carried ANY `
      + 'hat at the arrival tick. ⚠ The windows OVERLAP, so one shot credits every open window '
      + 'of its own side; both fractions are published (per completed pass AND per match) and '
      + 'NO VERDICT WORD is printed on the pair.',
    binEdges: {
      note: '⚠ every width/count here is a STORED BIN EDGE of a histogram — never a rule and '
        + 'never a threshold: no read word and no stored boolean depends on one.',
      runnerCountBins: RUN_COUNT_BINS,
      episodeTicks: { width: EP_TICK_BIN, bins: EP_TICK_BINS },
    },
    engineConstants: {
      DT, HALF_L, AI_INTERVAL, TEAM_AI_INTERVAL,
      roleWeights: { GK: ROLE_W_GK, DF: ROLE_W_DF, MF: ROLE_W_MF, WG: ROLE_W_WG, ST: ROLE_W_ST },
      tempoGate: TEMPO_HIGH, urgencyGate: URGENCY_HIGH,
      countHigh: COUNT_HIGH, countBase: COUNT_BASE,
      arriverDepthFromHalfL: ARRIVER_DEPTH, arriverWide: ARRIVER_WIDE,
      overlapGate: OVERLAP_GATE, confrontedRadius: CONFRONT_R,
      wall: { d: WALL_D, pressure: WALL_PRESSURE, stamina: WALL_STAMINA, half: WALL_HALF,
        geneGate: WALL_GENE, geneDivisor: WALL_GENE_DIV, windowSeconds: WALL_WINDOW },
      whyLiterals: {
        licensedRunInBehind: WHY_LICENSED, arrivingLate: WHY_ARRIVING, attackingTheBox: WHY_BOX,
        oneTwoBurst: WHY_BURST, overlapping: WHY_OVERLAP, keeperUp: WHY_KEEPERUP,
        cutbackPrefix: CUTBACK_PREFIX,
      },
      yieldWindowSeconds: YIELD_WINDOW_SECONDS,
    },
  },
  codeFacts: {
    what: '⭐⭐ canon, VERBATIM: "a code-fact boolean about what a function reads or does not '
      + 'read is derived from the function\'s WHOLE text and from every callee whose return '
      + 'enters the read, each pinned by an anchored text hash — the call graph it was checked '
      + 'over is stored beside the boolean; … the callee list is EXTRACTED from the hashed text '
      + '— every identifier called within the span, resolved to its definition and hashed — '
      + 'never typed" (homes: LN-C1 §CORR 1–2, LN-C2 §CORR 1, LN-C3 §CORR 2).',
    corpus: { dirs: GRAPH_DIRS, files: GRAPH_FILES.length, spans: SPANS.length },
    fieldNeedles: FIELD_NEEDLES.map((n) => ({ key: n.key, re: n.re.source })),
    writeClassifier: `a site is a WRITE iff its line matches ${WRITE_OPS.source} or `
      + `${SET_MUTATORS.source}; otherwise it is a READ.`,
    fieldCounts: FIELD_COUNTS,
    fieldSites: FIELD_SITES,
    everyFieldSiteResolved: EVERY_FIELD_SITE_RESOLVED,
    everyFieldNeedleLive: EVERY_FIELD_NEEDLE_LIVE,
    roots: DESIGNATION_ROOTS.map((s) => ({ span: spanKey(s), sha: s.sha })),
    rootsComplete: ROOTS_COMPLETE,
    makeRunCaseEnclosingSpan: MAKERUN_CASE_ENCLOSING === null ? null
      : spanKey(MAKERUN_CASE_ENCLOSING),
    makeRunCaseIsInExecuteAction: MAKERUN_CASE_IN_EXECUTE_ACTION,
    designationClosure: {
      nodes: DESIGNATION_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
      depth: DESIGNATION_CLOSURE.depth, capped: DESIGNATION_CLOSURE.capped,
      externals: DESIGNATION_CLOSURE.externals,
    },
    makeRunPushes: MAKERUN_PUSHES,
    makeRunCandidatesAllHatGuarded,
    nonHatMakeRunPushes: NON_HAT_MAKERUN_PUSHES,
    obmSeat: {
      file: EYES_PATH, roots: OBM_ROOTS.map((s) => ({ span: spanKey(s), sha: s.sha })),
      closureNodes: OBM_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
      closureDepth: OBM_CLOSURE.depth, closureCapped: OBM_CLOSURE.capped,
      designationHitsInClosure: OBM_HITS,
      obmSeatReadsNoDesignation,
    },
    doors: {
      lnHitsInDesignationClosure: LN_HITS, lnSpansAnywhere: LN_ANYWHERE, lnNeedleIsLive,
      lnDoorTouchesNoDesignationPath,
      gkHitsInDesignationClosure: GK_HITS, gkSpansAnywhere: GK_ANYWHERE, gkNeedleIsLive,
      gkDoorTouchesNoDesignationPath,
      note: '⭐⭐ A FALSE NAMES THE HIT. `lnDoorTouchesNoDesignationPath` / '
        + '`gkDoorTouchesNoDesignationPath` are TRUE only when the door\'s needle appears in NO '
        + 'span of the EXTRACTED designation-path closure; when FALSE, every reaching span is '
        + 'listed above with its own key.',
    },
  },
  obmVocabulary: {
    what: '⭐⭐ THE VOCABULARY DS-T0 WOULD PRICE A RUN OVER — enumerated FROM THE SOURCE '
      + '(`src/evolution/genome.ts`), LISTED, NOT JUDGED.',
    featureKeys: [...OBM_FEATURE_KEYS],
    outputKeys: [...OBM_OUTPUT_KEYS],
    weightSlots: OBM_FEATURE_KEYS.length * OBM_OUTPUT_KEYS.length,
    seatIsDormant: '`obmMovement` is absent on every arm of this census (`gWorld`), so nothing '
      + 'in `offballEyes.ts` is reached in any walked match.',
    contract: 'docs/world-model/OFFBALL-MOVEMENT-CONTRACT.md §2 M-OBM.1–4; STATUS #390.',
  },
  passerReadTable: {
    what: '⭐⭐ THE ⑤ BOUNDARY (读心标签), STATED AS A BOUNDARY — NOT FIXED, NOT JUDGED. For each '
      + 'read: does it consume a LABEL a designation wrote, or a mate\'s ACTION TYPE?',
    rows: PASSER_READ_SITES,
    resolved: PASSER_READS_RESOLVED,
    note: '#404 item 1 names FOUR passer reads. This census enumerates SIX consumption sites: '
      + 'the four named, PLUS the through-ball\'s own runner scan and `registerPass`\'s bounce '
      + 'classification — both of which read a mate\'s ACTION TYPE. §DEVIATIONS says so.',
  },
  doseSource: {
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_PIN, [PC_DOSE_FILE]: PC_DOSE_PIN },
    matchesPins: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    reachable: DOSED_ARM_REACHABLE, loadError: DOSE_LOAD_ERROR,
    placement: '⛔ canon (dose placement): the doses ride through the SHIPPED LOADERS into '
      + '`armA4World`, NEVER through `info.genome`; `gWorld`\'s `genomeClean` conjunct asserts '
      + 'the cleanliness on every walked match.',
  },
  worldPin: { seed: WORLD_PIN_SEED, rows: worldPin, ok: WORLD_PIN_OK },
  anchoredSites: ANCHORS, fixtures: FIXTURES, lockstep: lockstepRows, determinism: xDetRows,
  fingerprintProd: { pinned: FP_PROD_PIN, computed: FP_PROD_GOT, ok: FP_PROD_OK,
    recipe: 'new League({ seed: 1337 }) → runHeadless to generation + 2 → sha256 of the save '
      + 'JSON (the shipped `scripts/fingerprint.ts` recipe, recomputed in-process)',
    matches: fpOut.matches },
  loo: LOO,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,005,800–811, three '
      + 'walks per seed), DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a '
      + 'NOISY variance estimate. N_FROZEN takes the BLOCK\'S AFFORDANCE after the construction '
      + 'receipt at 12,553,999.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
  },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length, armsPerSeed: ARMS.length,
    constructionReceiptSeed: RECEIPT_SEED, walksBooked,
    unwalkedTail: (IS_OVERRIDE
      || batterySeeds[batterySeeds.length - 1] + 1 > BLOCK_TOP - 1) ? null
      : [batterySeeds[batterySeeds.length - 1] + 1, BLOCK_TOP - 1],
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    xDetScratchSeedsWalked: XDET_SEEDS,
    worldPinScratchSeedWalked: WORLD_PIN_SEED,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    smokeReceiptSeed: SCRATCH_BASE + 20,
    fixtureScratchSeed: FIXTURE_SEED,
    consumedBlocksOfRecord: CONSUMED_BLOCKS,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 82 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, armK) => a + armRows(armK).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / (cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, the per-tick '
      + 'observation included — never the game\'s frame cost.',
  },
  medians: {
    note: '⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, so `gFaces` re-derives each one off the '
      + 'SERIALIZED artifact',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((armK) => [armK, {
    branchTicks: { vocabulary: BRANCHES, pooled: pooled[armK].branchTicks },
    runCountBins: { bins: RUN_COUNT_BINS, pooled: pooled[armK].runCountBins },
    runCountBinsByBranch: { vocabulary: BRANCHES, binsPerBranch: RUN_COUNT_BINS,
      pooled: pooled[armK].runCountBinsByBranch },
    arriverSetByBranch: { vocabulary: BRANCHES, pooled: pooled[armK].arriverSetByBranch },
    overlapperSetByBranch: { vocabulary: BRANCHES, pooled: pooled[armK].overlapperSetByBranch },
    runnersByRole: { vocabulary: ROLES4, pooled: pooled[armK].runnersByRole },
    arriverByRole: { vocabulary: ROLES4, pooled: pooled[armK].arriverByRole },
    overlapperByRole: { vocabulary: ROLES4, pooled: pooled[armK].overlapperByRole },
    offBallActionTicks: { vocabulary: ACTION_CELLS, pooled: pooled[armK].offBallActionTicks },
    hatClassTicks: { vocabulary: HAT_CLASSES, pooled: pooled[armK].hatClassTicks },
    keeperHatClassTicks: { vocabulary: HAT_CLASSES,
      pooled: pooled[armK].keeperHatClassTicks },
    epSets: { vocabulary: EP_CLASSES, pooled: pooled[armK].epSets },
    episodeTicks: { vocabulary: EP_CLASSES, width: EP_TICK_BIN, bins: EP_TICK_BINS,
      pooled: pooled[armK].epTickBins },
    wallConjunctKills: { vocabulary: CONJUNCTS, pooled: pooled[armK].wallConjunctKills },
  }])),
  reads: {
    note: '⭐⭐ #404 item 2(vii)\'s SENTENCES are FROZEN LITERALS. The SELECTOR is ONE STORED '
      + 'BOOLEAN: `noPlayerOwnedRun` = the OTHER class is 0 on the arm AND the code fact '
      + '`makeRunCandidatesAllHatGuarded` (every `MakeRun` candidate push in `decideOffBall` '
      + 'enumerated with its EXTRACTED guard) is TRUE. READ_1 is selected when it holds, else '
      + 'READ_2. The READ OF RECORD is E13\'s; D13\'s and E15\'s are computed by the SAME '
      + 'frozen rule and stored beside as AGREE booleans. ⛔ The share and the code fact are '
      + 'printed on their OWN annotation lines, never spliced into a frozen literal.',
    sentences: READ_SENTENCES,
    agreementSentences: AGREE_SENTENCE,
    perArm: READS,
    readOfRecord: READ_OF_RECORD,
    readOfRecordArm: 'E13',
    annotations: READ_ANNOTATIONS,
    d13Agrees: D13_AGREES, e15Agrees: E15_AGREES,
    d13AgreementWordPrinted: D13_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees,
    e15AgreementWordPrinted: E15_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees,
    emptyHatClasses: EMPTY_HAT_CLASSES, emptyEpisodeClasses: EMPTY_EP_CLASSES,
  },
  faces, deltas,
  perSeedCells, constructionReceipt: receiptRows,
};

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perSeedCells: (Record<Arm, Row> & { seed: number })[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<Arm, Record<string, { pooled?: unknown }>>;
  medians: { values: Record<Arm, Record<string, unknown>> };
  reads: Record<string, unknown>;
  sizing: { rows: typeof sizingRows };
};
const sameNum = (got: number, stored: number | null): boolean => (Number.isNaN(got)
  ? (stored === null || Number.isNaN(stored)) : got === stored);
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const rows = disk.perSeedCells.map((c) => c[f.arm]);
  const nu = sum(rows.map((r) => def.num(r)));
  const de = sum(rows.map((r) => def.dn(r)));
  faceChecks.push({
    face: `${f.face}@${f.arm}`,
    ok: nu === f.numerator && de === f.denominator && sameNum(ratio(nu, de), f.value),
  });
}
for (const dd of disk.deltas) {
  const def = FACES[dd.face];
  const l = disk.perSeedCells.map((c) => c[dd.armL]);
  const r = disk.perSeedCells.map((c) => c[dd.armR]);
  const pl = ratio(sum(l.map((x) => def.num(x))), sum(l.map((x) => def.dn(x))));
  const pr = ratio(sum(r.map((x) => def.num(x))), sum(r.map((x) => def.dn(x))));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: sameNum(pl, dd.leftValue) && sameNum(pr, dd.rightValue) && sameNum(pl - pr, dd.delta),
  });
}
const binChecks: { bin: string; ok: boolean }[] = [];
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const got = poolFrom(rows);
  const b = disk.bins[armK];
  const cmp = (key: string, want: unknown): void => {
    binChecks.push({ bin: `${armK}.${key}`,
      ok: JSON.stringify(want) === JSON.stringify(b[key]?.pooled ?? []) });
  };
  cmp('branchTicks', got.branchTicks);
  cmp('runCountBins', got.runCountBins);
  cmp('runCountBinsByBranch', got.runCountBinsByBranch);
  cmp('arriverSetByBranch', got.arriverSetByBranch);
  cmp('overlapperSetByBranch', got.overlapperSetByBranch);
  cmp('runnersByRole', got.runnersByRole);
  cmp('arriverByRole', got.arriverByRole);
  cmp('overlapperByRole', got.overlapperByRole);
  cmp('offBallActionTicks', got.offBallActionTicks);
  cmp('hatClassTicks', got.hatClassTicks);
  cmp('keeperHatClassTicks', got.keeperHatClassTicks);
  cmp('epSets', got.epSets);
  cmp('episodeTicks', got.epTickBins);
  cmp('wallConjunctKills', got.wallConjunctKills);
  binChecks.push({ bin: `${armK}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[armK]) });
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${armK}.partition.branchesSumToInPossessionCoachTicks`,
    ok: sum(got.branchTicks) === sum(rows.map((r) => r.coachTicksInPossession))
      && sum(got.runCountBins) === sum(rows.map((r) => r.coachTicksInPossession))
      && sum(got.runCountBinsByBranch) === sum(rows.map((r) => r.coachTicksInPossession)) });
  binChecks.push({ bin: `${armK}.partition.actionsSumToOffBallDecisionTicks`,
    ok: sum(got.offBallActionTicks) === sum(rows.map((r) => r.offBallDecisionTicks)) });
  binChecks.push({ bin: `${armK}.partition.hatClassesSumToMakeRunDecisions`,
    ok: sum(got.hatClassTicks) === sum(rows.map((r) => r.makeRunTicks))
      && sum(got.keeperHatClassTicks) === sum(rows.map((r) => r.hatClassTicksKeeper)) });
  binChecks.push({ bin: `${armK}.partition.rolesSumToRunnerDesignations`,
    ok: sum(got.runnersByRole) === sum(rows.map((r) => r.runnerDesignations)) });
  binChecks.push({ bin: `${armK}.partition.episodeBinsAreInsideTheirSets`,
    ok: EP_CLASSES.every((c) => sum(got.epTickBins
      .slice(ECI(c) * EP_TICK_BINS, (ECI(c) + 1) * EP_TICK_BINS)) <= got.epSets[ECI(c)]) });
  binChecks.push({ bin: `${armK}.partition.branchReachedIsInsideTheDecisionTicks`,
    ok: rows.every((r) => r.offBallBranchReached <= r.offBallDecisionTicks
      && r.makeRunTicks <= r.offBallDecisionTicks
      && r.wallFires <= r.wallEligiblePasses) });
}
/** ⭐⭐ THE READ WORDS, re-derived from the SERIALIZED per-seed cells */
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const stored = (disk.reads.perArm as Record<string, ReadBlock>)[armK];
  const S = (pick: (r: Row) => number): number => sum(rows.map(pick));
  const other = S((r) => r.hatClassTicks[HCI('OTHER')] + r.keeperHatClassTicks[HCI('OTHER')]);
  const npor = other === 0 && makeRunCandidatesAllHatGuarded;
  const sel = npor ? 'READ_1' : 'READ_2';
  const sentence = sel === 'READ_1' ? READ_1 : READ_2;
  binChecks.push({ bin: `reads.${armK}.selectorRederives`,
    ok: npor === stored.noPlayerOwnedRun && other === stored.otherCount
      && S((r) => sum(r.hatClassTicks) + sum(r.keeperHatClassTicks)) === stored.makeRunDecisions
      && sameNum(ratio(other, S((r) => sum(r.hatClassTicks) + sum(r.keeperHatClassTicks))),
        stored.otherShareOfMakeRun) });
  binChecks.push({ bin: `reads.${armK}.sentenceIsTheFrozenLiteral`,
    ok: sel === stored.selected && sentence === stored.sentence
      && (Object.values(READ_SENTENCES) as string[]).includes(stored.sentence) });
  binChecks.push({ bin: `reads.${armK}.perClassCountsRederive`,
    ok: JSON.stringify(HAT_CLASSES.map((c) => [c as string,
      S((r) => r.hatClassTicks[HCI(c)] + r.keeperHatClassTicks[HCI(c)])]))
      === JSON.stringify(stored.perClassCounts) });
  binChecks.push({ bin: `reads.${armK}.besideSentencesRederive`,
    ok: sameNum(ratio(S((r) => r.makeRunTicks), S((r) => r.offBallDecisionTicks)),
      stored.besideMakeRunShareOfOffBallTicks)
      && sameNum(ratio(S((r) => r.attackingHatted), S((r) => r.attackingOutfield)),
        stored.besideHattedShareOfAttackingOutfield)
      && sameNum(ratio(S((r) => r.shotsAfterHatted), S((r) => r.completedHatted)),
        stored.besideShotsPerCompletedPassHatted)
      && sameNum(ratio(S((r) => r.shotsAfterUnhatted), S((r) => r.completedUnhatted)),
        stored.besideShotsPerCompletedPassUnhatted)
      && sameNum(ratio(S((r) => r.wallFires), S((r) => r.wallEligiblePasses)),
        stored.besideWallFireRate)
      && sameNum(ratio(S((r) => r.wallOneTwosStat), S((r) => r.wallFires)),
        stored.besideWallReturnShare)
      && sameNum(ratio(S((r) => r.overlapReleaseFires), S((r) => r.overlapSets)),
        stored.besideOverlapReleaseFiresPerSet) });
}
{
  const perArm = disk.reads.perArm as Record<string, ReadBlock>;
  const d13 = perArm.E13.selected === perArm.D13.selected;
  const e15 = perArm.E13.selected === perArm.E15.selected;
  binChecks.push({ bin: 'reads.agreementBooleansAreStored',
    ok: d13 === (disk.reads.d13Agrees as boolean) && e15 === (disk.reads.e15Agrees as boolean)
      && (disk.reads.d13AgreementWordPrinted as string)
        === (d13 ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees)
      && (disk.reads.e15AgreementWordPrinted as string)
        === (e15 ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees)
      && (disk.reads.readOfRecord as string) === perArm.E13.sentence });
}
for (const r of disk.sizing.rows) {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nReq = Math.ceil(r.smokeClusters * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(r.smokeClusters / N_FROZEN);
  binChecks.push({
    bin: `sizing.${r.face}@${r.target}`,
    ok: seSmoke === r.seSmoke && seNeeded === r.seNeeded && nReq === r.nRequired
      && hwAtN === r.expectedHalfWidthAtNFrozen
      && hwAtN * ZSUM / Z975 === r.mdeAtNFrozen
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen
      && (r.hwSmoke === 0) === r.degenerate,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / median / `
    + 'partition / READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk — '
    + 'canon: "the re-derivation gate covers EVERY published face; a percentile face requires '
    + 'stored bins". The read selector, the printed sentence, the per-class counts, EVERY '
    + 'beside-sentence and both agreement words are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.')).every((b) => b.ok),
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: the selector boolean with its OTHER count '
    + 'and share, the selected read, the printed sentence, the per-class count table, all seven '
    + 'beside-sentence quantities and both agreement words are RE-DERIVED by applying the '
    + 'FROZEN rules to the SERIALIZED per-seed cells off disk, and every printed sentence must '
    + 'be one of the TWO frozen literals. canon, VERBATIM: "a universal sentence about a table '
    + '(\'every bin\', \'the one bin\') is a stored boolean or is not written"',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };

/* ---- THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt ---- */
const SCHEMA_COMPLETE = BODY_SCHEMA.every((k) => artifact[k] !== undefined)
  && (BODY_SCHEMA as readonly string[]).includes('allGreen')
  && !(BODY_SCHEMA as readonly string[]).includes('hashedBodySha256')
  && !(BODY_SCHEMA as readonly string[]).includes('gFacesDetail')
  && !(BODY_SCHEMA as readonly string[]).includes('receipts');
gates.gHashOrder = {
  ok: SCHEMA_COMPLETE,
  note: '⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
    + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
    + `${BODY_SCHEMA.length}-key schema is complete, covers the per-seed cells, the `
    + 'construction receipt, the code facts, the OBM vocabulary, the passer-read table AND '
    + '`allGreen`, and EXCLUDES `hashedBodySha256`, `gFacesDetail` and `receipts`; the body '
    + 'hash is computed LAST — after every body key is assigned — and a NON-body '
    + '`receipts.hashReproducesFromFile` records that it reproduces from the written file',
};
gates.gStage = {
  ok: (artifact.stage as { instrument: string }).instrument === INSTRUMENT_PATH
    && (artifact.stage as { instrumentSha256: string }).instrumentSha256
      === sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
  note: '⭐⭐ LN-C3 §COMMANDER CORRECTIONS: the artifact\'s `stage.instrument` is THIS '
    + `instrument's own path (${INSTRUMENT_PATH}) and \`stage.instrumentSha256\` is the sha256 `
    + 'of the RUNNING FILE re-read from disk at this line — never an inherited string',
};
artifact.gates = gates;
const ALL_GREEN_FINAL = Object.values(gates).every((g) => g.ok);
artifact.allGreen = ALL_GREEN_FINAL;
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));
/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — evaluated after every gate */
const OUT_PATH = ALL_GREEN_FINAL ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}
const HASH_REPRODUCES_FROM_FILE = (() => {
  const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();
artifact.receipts = {
  what: '⭐⭐ canon, VERBATIM: "the body hash is computed after every body key is assigned, and '
    + 'a NON-body receipt field records that the hash reproduces from the written file" (home: '
    + 'RC-T1A-PRECUE-EXAM.md §COMMANDER CORRECTIONS item 3, ruling #372 item 3). This block is '
    + 'OUTSIDE `BODY_SCHEMA` by construction.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  note: '⚠ this block carries NO file byte-hash and NO byte count: both would be '
    + 'self-referential. The FINAL file byte-hash and byte count are recomputed after the final '
    + 'write and PUBLISHED IN THE DOC\'s §GATES.',
};
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
const FINAL_BYTES = readFileSync(OUT_PATH, 'utf8');
const FINAL_FILE_SHA = sha(FINAL_BYTES);
const FINAL_ARTIFACT_BYTES = Buffer.byteLength(FINAL_BYTES, 'utf8');

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`DS-C0 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to .RED'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE HATS AS WRITTEN (POPULATION A) ---');
for (const armK of ARMS) {
  banner(`  ${armK} coach ticks/match ${f6(face('coach.ticksPerMatch', armK).value)} · in `
    + `possession ${f6(face('coach.inPossessionShare', armK).value)} · runners/tick `
    + `${f6(face('runCount.mean', armK).value)}`);
  banner(`    runner-count bins: ${Array.from({ length: RUN_COUNT_BINS }, (_, k) =>
    `${k}${k === RUN_COUNT_BINS - 1 ? '+' : ''} ${f6(face(`runCount.binShare.${
      k === RUN_COUNT_BINS - 1 ? `${k}plus` : k}`, armK).value)}`).join(' · ')}`);
  banner(`    branches: ${BRANCHES.map((b) => `${b} ${f6(face(`branch.share.${b}`, armK).value)}`)
    .join(' · ')}`);
  banner(`    runners by role: ${ROLES4.map((rr) =>
    `${rr} ${f6(face(`runnersByRole.share.${rr}`, armK).value)}`).join(' · ')}`);
  banner(`    inputs: counter ${f6(face('input.counterAttackShare', armK).value)} · tempo>0.65 `
    + `${f6(face('input.tempoHighShare', armK).value)} · urgency>0.65 `
    + `${f6(face('input.urgencyHighShare', armK).value)}`);
  banner(`    overlap gate ${f6(face('overlap.geneGatePassRate', armK).value)} · confronted `
    + `${f6(face('overlap.confrontedShareAmongGatePassing', armK).value)} (n=`
    + `${face('overlap.confrontedShareAmongGatePassing', armK).denominator})`);
}
banner('');
banner('--- §R2 THE OFF-BALL DECISIONS BY HAT CLASS (POPULATION B) ---');
for (const armK of ARMS) {
  banner(`  ${armK} off-ball decision ticks/match `
    + `${f6(face('offBall.decisionTicksPerMatch', armK).value)} · MakeRun share `
    + `${f6(face('offBall.makeRunShare', armK).value)} · MakeRun-is-hat share `
    + `${f6(face('offBall.makeRunIsHatShare', armK).value)}`);
  banner(`    hat classes: ${HAT_CLASSES.map((c) => `${c} `
    + `${face(`hatClass.perMatch.${c}`, armK).numerator}`).join(' · ')}`);
  banner(`    hatted share of the attacking outfield `
    + `${f6(face('hatted.shareOfAttackingOutfield', armK).value)}`);
}
banner('');
banner('--- §R3 THE HATS\' YIELD (POPULATION C) ---');
for (const armK of ARMS) {
  banner(`  ${armK} episodes/match: ${EP_CLASSES.map((c) =>
    `${c} ${f6(face(`ep.setsPerMatch.${c}`, armK).value)}`).join(' · ')}`);
  banner(`    aimed/episode: ${EP_CLASSES.map((c) =>
    `${c} ${f6(face(`ep.passAimedPerEpisode.${c}`, armK).value)}`).join(' · ')}`);
  banner(`    shots/episode: ${EP_CLASSES.map((c) =>
    `${c} ${f6(face(`ep.shotsPerEpisode.${c}`, armK).value)}`).join(' · ')}`);
  banner(`    wall fire rate ${f6(face('wall.fireRatePerEligiblePass', armK).value)} · return `
    + `${f6(face('wall.returnShareOfFires', armK).value)} · recon agrees `
    + `${f6(face('wall.reconAgreesShare', armK).value)}`);
  banner(`    overlap sets/match ${f6(face('overlap.setsPerMatch', armK).value)} · release `
    + `${f6(face('overlap.releaseFiresPerSet', armK).value)} · played to `
    + `${f6(face('overlap.playedToPerSet', armK).value)}`);
  banner(`    arriver sets/match ${f6(face('arriver.setsPerMatch', armK).value)} · cutback `
    + `formed/match ${f6(face('arriver.cutbackFormedPerMatch', armK).value)} · taken/match `
    + `${f6(face('arriver.cutbackTakenPerMatch', armK).value)}`);
  banner(`    shots per completed pass — hatted `
    + `${f6(face('downstream.shotsPerCompletedPassHatted', armK).value)} · unhatted `
    + `${f6(face('downstream.shotsPerCompletedPassUnhatted', armK).value)}`);
}
banner('');
banner('--- §R4 THE PASSER\'S HAT-READS (POPULATION D) ---');
for (const armK of ARMS) {
  banner(`  ${armK} per match — wallReturn(UB) `
    + `${f6(face('passerRead.wallReturnUpperBoundPerMatch', armK).value)} · thirdMan(UB) `
    + `${f6(face('passerRead.thirdManUpperBoundPerMatch', armK).value)} · overlapRelease `
    + `${f6(face('passerRead.overlapReleaseExactPerMatch', armK).value)} · cutback formed `
    + `${f6(face('passerRead.arriverCutbackFormedPerMatch', armK).value)} · taken `
    + `${f6(face('passerRead.arriverCutbackTakenPerMatch', armK).value)}`);
}
banner('');
banner('--- §R5 THE CODE FACTS ---');
banner(`  field sites: ${FIELD_NEEDLES.map((nd) =>
  `${nd.key} w${FIELD_COUNTS[nd.key].writes}/r${FIELD_COUNTS[nd.key].reads}`).join(' · ')}`);
banner(`  makeRunCandidatesAllHatGuarded ${makeRunCandidatesAllHatGuarded} · `
  + `obmSeatReadsNoDesignation ${obmSeatReadsNoDesignation} · `
  + `lnDoorTouchesNoDesignationPath ${lnDoorTouchesNoDesignationPath} · `
  + `gkDoorTouchesNoDesignationPath ${gkDoorTouchesNoDesignationPath}`);
banner(`  OBM_FEATURE_KEYS ${OBM_FEATURE_KEYS.join(', ')}`);
banner(`  OBM_OUTPUT_KEYS  ${OBM_OUTPUT_KEYS.join(', ')}`);
banner('');
banner('--- §R6 THE READS (E13 of record) ---');
banner(`  ${READ_OF_RECORD}`);
for (const a of READ_ANNOTATIONS) banner(`    ${a}`);
banner(`  D13: ${D13_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees}`);
banner(`  E15: ${E15_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees}`);
banner('');
banner(`ARTIFACT ${OUT_PATH}`);
banner(`  bytes ${FINAL_ARTIFACT_BYTES} · fileSha256 ${FINAL_FILE_SHA}`);
banner(`  hashedBodySha256 ${artifact.hashedBodySha256 as string}`);
banner(`  instrumentSha256 ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`  hashReproducesFromFile ${HASH_REPRODUCES_FROM_FILE}`);
banner(`  wall ${((Date.now() - t0Wall) / 1000).toFixed(3)} s`);
if (!ALL_GREEN_FINAL) process.exitCode = 1;
