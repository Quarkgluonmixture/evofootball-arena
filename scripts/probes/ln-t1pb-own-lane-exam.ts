/**
 * ⭐⭐⭐ LN-T1′b — 「传球者看见自己人 · 考试 · 重走」 THE OWN-LANE EXAM, RE-RUN
 * (docs/world-model/LN-T1PB-OWN-LANE-EXAM-RERUN.md).
 *
 * Authorized by COMMANDER RULING #395 item 4. THIS IS LN-T1′'s INSTRUMENT
 * (`scripts/probes/ln-t1p-own-lane-exam.ts`) with FIVE DECLARED CHANGES AND NOTHING ELSE, plus
 * the renames and re-pointings those changes force. Every other line — the seven arms, the
 * dose placement, the family rule, R1 and its family table, the seven guards, the frozen read
 * literals, the house gate set — is INHERITED WHOLE from #394 item 4.
 *
 * THE FIVE CHANGES (#395 item 4(i); each marked `LN-T1′b CHANGE (x)` at its site and stated at
 * the doc's §P as an AMENDMENT of LN-T1′'s §P):
 *  (a) the gFaces conjunct `<arm>.partition.untracedFamiliesAreExactlyTheUntracedLedgerClass`
 *      is DEMOTED from an assertion to a PUBLISHED RECEIPT per arm — each untraced family's
 *      share of passes carrying a ledger row, with numerator and denominator, as FACES. It
 *      gates `allGreen` NO LONGER. The family assignment stays by (kind, site) FIRST, byte
 *      for byte.
 *  (b) THE JOIN DIAGNOSIS, off the engine's own records: every pass whose FAMILY and LEDGER
 *      CLASS disagree gets an ITEMISED ROW (seed, arm, tick, passerGid, strike site, choice-
 *      tick class, `chosenGid`, `legacyGid`, the family, and the `o1WindupLedger` counters
 *      arms · evictions · struck · cancelledMate at that tick and the tick before), with a
 *      stored boolean per row. It DIAGNOSES; it changes NO family.
 *  (c) G-ARM's read-back PER TEAM (side 0 and side 1 separately) at CONSTRUCTION and at FULL
 *      TIME, off `effGenome`, `baseGenome` and `info.genome` (and the KEY's presence there).
 *  (d) the doc's §GATES carries the final file hash and byte count (recomputed after the final
 *      write); this artifact's `receipts` block still carries neither, both being
 *      self-referential, and says where they live.
 *  (e) G-REPRO-LNT1P: LN-T1′'s seeds 12,549,000–011 RE-WALKED on ALL SEVEN ARMS and matched
 *      FIELD FOR FIELD against the RED artifact's `perSeedCells` — the walker and the
 *      observation are the SAME, only the receipts changed. RE-WALKS, not consumption.
 *
 * Lineage: PT-C0 (the population and the `ball.lastTouch` FIRST-BODY channel, byte for byte)
 * -> BN-C0 (the corridor membership test) -> LN-C0 (the walker, the wind-up ARM-tick channel,
 * the cause classes, the estimator, the hash order) -> LN-T1 (the EXAM form: paired Δ, the
 * guard tolerance `NI_FRACTION`, the band, the offside FLAG form, FLAG-HYGIENE, G-ARM, LOO,
 * the sizing rule) -> LN-C1 (the choice tick, the own-openness CALLED reconstruction, the
 * menu) -> LN-C2 (the ledger PATH classes, the shell at the choice) -> LN-C3 (the FAMILY rule,
 * the strike sites, the trace join, the walker, the extracted call graph) -> LN-T0 (the SEAM
 * under exam) -> LN-T1′ (this instrument's OWN PARENT: the exam, walked, one receipt RED)
 * -> this RE-RUN.
 *
 * THE QUESTION (#394 item 4, NOT re-argued here): does the own-lane price, at doses
 * w ∈ {0.25, 0.5, 1.0}, lower the user's own face — a measured ground pass whose FIRST BODY is
 * an own NON-TARGET teammate (`firstBody.ownNonTarget`) — on world 13, without breaking a
 * guard; and does the kick-off tap-back's carom move (H-LN-2)?
 *
 * ⛔ THIS IS AN EXAM. It ARMS NOTHING for the user: the flag `lnOwnLanePrice` stays default
 * OFF everywhere outside this probe's own constructed matches, world 12/13 bytes are untouched,
 * and NOTHING SHIPS. It prints FROZEN read literals selected by STORED booleans.
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited.
 * ⛔ NO LOOK-PRESSURE FACE (`blindOutpricesRead` / `blindOutpricesBand`, or any face derived
 *    from the trace's `options[].price`) is read off an ARMED arm: with the hook live those
 *    prices are PRICED values and the booleans are ASYMMETRIC (#394 item 3(ii)). This
 *    instrument reads the trace's `chosenGid` / `legacyGid` (the PATH CLASS) and nothing else
 *    that a dose can bend.
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" — CHANGE (b) is exactly this canon applied to the join.
 * ⭐ canon, VERBATIM (dose placement): "dose NEVER in info.genome; truth-dosing writes census
 * values through the effective genome" — see §5b for the ANCHOR of what `team.genome` resolves
 * to and why the T0 suite's three-view idiom is NOT followed here.
 * ⭐ canon, VERBATIM: "a code-fact boolean … the callee list is EXTRACTED from the hashed text
 * — every identifier called within the span, resolved to its definition and hashed — never
 * typed, and a declared edge absent from the text, or a call present in the text and absent
 * from the graph, is RED".
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { BALL_RADIUS, CONTROL_RADIUS, DT, GRAVITY, PLAYER_CORE_RADIUS } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bqArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  BQ_WORLD_VERSION, CORRIDOR_WORLD_WEIGHT, type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import {
  DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS, groundShellHazard,
} from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment } from '../../src/utils/vec';
import { clamp01 } from '../../src/utils/math';
import { formationSpot, supportSpot, emergentPosOn } from '../../src/ai/formations';
import { laneOpenness } from '../../src/ai/perception';
import {
  PASS_CHOICE_MAX_METRES, PASS_CHOICE_MIN_METRES,
} from '../../src/ai/perceivedPassChoice';
import { lnOwnLaneWeightOf, randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import type { Player } from '../../src/sim/Player';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the LN-C3 §1 form)                         */
/* ========================================================================== */
const ENV_WHITELIST = ['LNT1PB_MODE', 'LNT1PB_N', 'LNT1PB_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('LNT1PB_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`LN-T1PB FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.LNT1PB_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('LN-T1PB FATAL — LNT1PB_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.LNT1PB_N !== undefined ? Number(process.env.LNT1PB_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('LN-T1PB FATAL — LNT1PB_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.LNT1PB_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`LNT1PB_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`LNT1PB_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`LNT1PB_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/ln-t1pb-own-lane-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/ln-t1pb-own-lane-exam-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('LN-T1PB FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}
/** ⭐⭐ THE INSTRUMENT'S OWN PATH — the artifact's `stage` block is written from THIS constant
 *  and `gStage` compares the stored hash to the bytes of the file at this path (LN-C3
 *  §COMMANDER CORRECTIONS item 1: the ancestor shipped its PREDECESSOR's instrument receipt). */
const SELF_PATH = 'scripts/probes/ln-t1pb-own-lane-exam.ts';

/* ========================================================================== */
/* §2 SMALL HELPERS (the house set, copied)                                    */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'ERROR'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const zeros2 = (a: number, b: number): number[][] => Array.from({ length: a }, () => zeros(b));
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const addInto2 = (a: number[][], b: readonly (readonly number[])[]): void => {
  for (let i = 0; i < a.length; i++) addInto(a[i], b[i]);
};
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const signedBinOf = (v: number, width: number, n: number): number => {
  const half = Math.floor(n / 2);
  const i = half + Math.round(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const binMedian = (bins: readonly number[], width: number, signed: boolean): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  const half = signed ? Math.floor(bins.length / 2) : 0;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= n) return (i - half) * width;
  }
  return (bins.length - 1 - half) * width;
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
   §COMMANDER CORRECTIONS item 1, ruling #306 item 4)                                        */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const CONST_PATH = 'src/sim/constants.ts';
const TYPES_PATH = 'src/sim/types.ts';
const TEAM_PATH = 'src/sim/Team.ts';
const A4_PATH = 'src/game/a4World.ts';
const DV_PATH = 'src/ai/deliveryValueSeat.ts';
const VEC_PATH = 'src/utils/vec.ts';
const FORM_PATH = 'src/ai/formations.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const TEAMBRAIN_PATH = 'src/ai/TeamBrain.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const PTC0_PATH = 'scripts/probes/pt-c0-playtest-forensic-census.ts';
const BNC0_PATH = 'scripts/probes/bn-c0-bounce-census.ts';
const PERC_PATH = 'src/ai/perception.ts';
const OBMT1_PATH = 'scripts/probes/obm-t1-policy-exam.ts';
const LNC0_PROBE_PATH = 'scripts/probes/ln-c0-lane-census.ts';
const LNC1_PROBE_PATH = 'scripts/probes/ln-c1-passer-lane-census.ts';
const LNC2_PROBE_PATH = 'scripts/probes/ln-c2-chooser-path-census.ts';
const LNC3_PROBE_PATH = 'scripts/probes/ln-c3-untraced-family-census.ts';
const LNT1_PROBE_PATH = 'scripts/probes/ln-t1-lane-exam.ts';
const PPC_PATH = 'src/ai/perceivedPassChoice.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const SEAT_PATH = 'src/ai/ownLaneSeat.ts';
const GENOME_PATH = 'src/evolution/genome.ts';
const MENTALITY_PATH = 'src/ai/mentality.ts';
const POV_PATH = 'src/ai/passOptionValue.ts';
const PCI_PATH = 'src/ai/passCorridorInterception.ts';
const PAFF_PATH = 'src/ai/passAffordance.ts';
const RAS_PATH = 'src/ai/receiverAccessSeat.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const PRED_PATH = 'src/ai/prediction.ts';
const REACH_PATH = 'src/ai/reachability.ts';
const PRIOR_PATH = 'src/ai/passPrior.ts';
const MATHU_PATH = 'src/utils/math.ts';
const SRC_FILES = [MATCH_PATH, CONST_PATH, TYPES_PATH, TEAM_PATH, A4_PATH, DV_PATH, VEC_PATH,
  FORM_PATH, BRAIN_PATH, TEAMBRAIN_PATH, EXEC_PATH, A4P1C_PATH, PTC0_PATH, BNC0_PATH,
  PERC_PATH, OBMT1_PATH, LNC0_PROBE_PATH, LNC1_PROBE_PATH, LNC2_PROBE_PATH, LNC3_PROBE_PATH,
  LNT1_PROBE_PATH, PPC_PATH, PLAYER_PATH, SEAT_PATH, GENOME_PATH, MENTALITY_PATH, POV_PATH,
  PCI_PATH, PAFF_PATH, RAS_PATH, MECH_PATH, PRED_PATH, REACH_PATH, PRIOR_PATH, MATHU_PATH];
const SRC_OF: Record<string, string> = {};
for (const p of SRC_FILES) SRC_OF[p] = readFileSync(p, 'utf8');
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

/* ---- ⭐⭐⭐ LN-T0's OWN SEAM SITES — the thing under exam ---- */
anchor('⭐⭐⭐ THE SEAT — the ONE `lnOwnLanePrice` fork in `src/**`, HOISTED above the kick-off '
  + 'branch', BRAIN_PATH,
  '  const lnSeat = match.lnOwnLanePrice ? { w: lnOwnLaneWeightOf(g) } : null;', 1);
anchor('⭐⭐⭐ THE DOSE ANCHOR — what `team.genome` IS at the seat: `decideCarrier` reads '
  + '`team.genome` two lines after `team` is bound to the TRUTH team (world 13 has '
  + '`inSnapshotLaw` OFF, so `inView === null`)', BRAIN_PATH,
  '  const opp = inView === null ? oppTruth : snapshotTeamView(oppTruth, inView.opps);\n'
  + '  const g = team.genome;', 1);
anchor('⭐⭐⭐ THE DOSE ANCHOR (2/4) — `Team`\'s OWN getter: `team.genome` RESOLVES TO '
  + '`effGenome`, a FIELD, not `info.genome`', TEAM_PATH,
  '  get genome(): TacticalGenome {\n    return this.effGenome;\n  }', 1);
anchor('⭐⭐⭐ THE DOSE ANCHOR (3/4) — `effGenome` is REBUILT FROM `baseGenome` at every brain '
  + 'tick, which is why the dose goes on BOTH', MATCH_PATH,
  '        team.effGenome = applyMentality(team.baseGenome, team.mentality);', 1);
anchor('⭐⭐⭐ THE DOSE ANCHOR (4/4) — `applyMentality` SPREADS its input, so a gene it does not '
  + 'name survives the rebuild', MENTALITY_PATH,
  'export function applyMentality(raw: TacticalGenome, m: Mentality): TacticalGenome {', 1);
anchor('⭐ …and the spread itself', MENTALITY_PATH, '    ...raw,', 2);
anchor('⭐⭐ SITE (a) — THE LANE ARGMAX: `sLn = sGc − ownLanePrice(...)`', BRAIN_PATH,
  '      const sLn = lnSeat === null ? sGc\n'
  + '        : sGc - ownLanePrice(lnSeat.w, ownLaneOpenness(p.pos, aim, team.players, p.gid, mate.gid));',
  1);
anchor('⭐⭐ …and the RA term now fed from `sLn` (the ordering #394 item 3(iii) ratified)',
  BRAIN_PATH,
  '        : sLn - raSeat.weight * receiverAccessDeficit(p.pos, aim, mate, p.gid) * W.passBase;', 1);
anchor('⭐⭐ SITE (b) — THE KICK-OFF PLAY-BACK: the ONE statement inside the loop', BRAIN_PATH,
  '      if (lnSeat !== null) {\n'
  + '        s -= ownLanePrice(lnSeat.w, ownLaneOpenness(p.pos, mate.pos, team.players, p.gid, mate.gid));\n'
  + '      }', 1);
anchor('⭐⭐ …and the shipped kick-off expression above it, unchanged but for `const` → `let`',
  BRAIN_PATH,
  "      let s = opennessOf(mate, opp.players) - Math.abs(d - 12) * 0.02 - (mate.role === 'GK' ? 0.3 : 0);",
  1);
anchor('⭐⭐ SITE (c1) — THE SCOPE: own outfield gids into the perceived snapshot, under the '
  + 'flag only', BRAIN_PATH,
  '    const lnOwnGids = lnSeat === null ? null : ownLaneScopeGids(p.gid, team.players);', 1);
anchor('⭐ …and the scope write', BRAIN_PATH,
  '    if (lnOwnGids !== null) for (const gid of lnOwnGids) scope.add(gid);', 1);
anchor('⭐⭐ SITE (c2) — THE HOOK handed INTO `choosePerceivedPassTarget`', BRAIN_PATH,
  '        ownLaneFactor: lnOwnLaneFactor,', 1);
anchor('⭐⭐ …and the factor itself', BRAIN_PATH,
  '        return 1 - ownLanePrice(lnSeat.w, ownLaneOpenness(', 1);
anchor('⭐⭐ THE HOOK\'s DECLARATION in the chooser\'s input type', PPC_PATH,
  '  readonly ownLaneFactor?: (targetGid: number) => number;', 1);
anchor('⭐⭐ THE FLAG — `lnOwnLanePrice`, an explicit boolean, `?? false`, readonly', MATCH_PATH,
  '    this.lnOwnLanePrice = cfg.lnOwnLanePrice ?? false;', 1);
anchor('⭐ …and the readonly field', MATCH_PATH, '  readonly lnOwnLanePrice: boolean;', 1);
anchor('⭐⭐ THE GENE — `lnOwnLaneWeight`, BORN ABSENT', GENOME_PATH,
  '  lnOwnLaneWeight?: number;', 1);
anchor('⭐⭐ THE GENE ACCESSOR — `lnOwnLaneWeightOf`, the SINGLE owner (absent ⇒ 0)', GENOME_PATH,
  'export function lnOwnLaneWeightOf(g: TacticalGenome): number {', 1);
anchor('⭐⭐ THE SEAT MODULE — `ownLaneOpenness`\'s DECLARATION', SEAT_PATH,
  'export function ownLaneOpenness(', 1);
anchor('⭐⭐ …it CALLS the SHIPPED `laneOpenness`, never restating the geometry', SEAT_PATH,
  '  return laneOpenness(from, aim, kept as unknown as Player[]);', 1);
anchor('⭐⭐ THE PRICE — `ownLanePrice`\'s single expression', SEAT_PATH,
  '  return w * (1 - openness);', 1);
anchor('⭐⭐ THE SCOPE BUILDER — `ownLaneScopeGids`\'s DECLARATION', SEAT_PATH,
  'export function ownLaneScopeGids(', 1);
anchor('⭐⭐ `a4World.ts` NEVER NAMES THE FLAG OR THE GENE — world 13 is untouched by the seam '
  + '(the count is ZERO, and that is the anchor)', A4_PATH, 'lnOwnLane', 0);

/* ---- ⭐⭐ G1 THE BACKWARD-PASS SHARE — the chooser's OWN gain form ---- */
anchor('⭐⭐⭐ G1 — THE FORWARD-GAIN FORM inside `groundCandidate`, the form this exam CALLS on '
  + 'the STRUCK aim of record with the passer\'s `localX` AT THE CHOICE', BRAIN_PATH,
  '      const gain = clamp01((team.localX(aim.x) - localX + 30) / 60) * 2 - 1;', 1);
anchor('⭐⭐ …and the passer\'s own forward coordinate the form subtracts', BRAIN_PATH,
  '  const localX = team.localX(p.pos.x);', 1);

/* ---- ⭐⭐ THE GUARD TOLERANCE — INHERITED BY ANCHOR, never typed as a decimal ---- */
anchor('⭐⭐⭐ GUARD TOLERANCE — `NI_FRACTION` as an EXPRESSION in LN-T1\'s OWN probe (#394 item '
  + '4(iv): inherited from the LN-T1 probe by anchor). TWO occurrences in that instrument — its '
  + 'own declaration and its own anchor needle on OBM-T1 — both enumerated', LNT1_PROBE_PATH,
  'const NI_FRACTION = 1 - 0.275 / 0.380;', 2);
anchor('⭐⭐ …and the SAME expression in OBM-T1\'s probe, its origin', OBMT1_PATH,
  'const NI_FRACTION = 1 - 0.275 / 0.380;', 1);
anchor('⭐⭐ LN-T1\'s OWN guard row form (the tolerance = NI_FRACTION · |control level|)',
  LNT1_PROBE_PATH, '  const tol = NI_FRACTION * Math.abs(control);', 2);
anchor('⭐⭐ LN-T1\'s OWN breach rule (resolved AND beyond tolerance in the harmful direction)',
  LNT1_PROBE_PATH, '        resolved: d.resolved, beyondTolerance: beyond, breach: d.resolved && beyond,',
  2);
anchor('⭐ LN-T1\'s OWN offside FLAG form (#157): a resolved INCREASE flags and gates nothing',
  LNT1_PROBE_PATH, '    flag: d.resolved && d.delta > 0, gating: false,', 1);

/* ---- LN-C3's OWN SITES, RE-ANCHORED AT THIS HEAD ---- */
anchor('⭐⭐ CODE FACT — `laneOpenness`\'s DECLARATION and its `opponents` PARAMETER', PERC_PATH,
  'export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {', 1);
anchor('⭐⭐ CODE FACT — `opennessAt`\'s DECLARATION', PERC_PATH,
  'export function opennessAt(pos: V2, opponents: Player[]): number {', 1);
anchor('⭐⭐ CODE FACT — the ground candidate\'s GRADED lane read (opponents only)', BRAIN_PATH,
  "        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),", 1);
anchor('⭐⭐ CODE FACT — `opennessAt(aim, opp.players)` inside `groundCandidate`', BRAIN_PATH,
  '      const open = opennessAt(aim, opp.players);', 1);
anchor('⭐⭐ CODE FACT — the ground candidate\'s SCORE LINE', BRAIN_PATH,
  '      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;', 1);
anchor('⭐⭐ THE CHOOSER\'S OWN RISK GATE at 0.4 — the FIRST binning EDGE', BRAIN_PATH,
  '      if (gain > 0.15 && lane < 0.4) {', 1, 0.4);
anchor('⭐⭐ THE CHOOSER\'S OWN SECOND GATE at 0.45 — the SECOND binning EDGE', BRAIN_PATH,
  '      if (lane < 0.45) {', 1, 0.45);
anchor('⭐⭐ CODE FACT (GC) — the GROUND-CORRIDOR SEAT', BRAIN_PATH,
  '  const gcSeat = match.bkGroundCorridor ? deliveryValueSeatOf(g) : null;', 1);
anchor('⭐⭐ CODE FACT (GC) — `gcBodies` COMPOSITION: BOTH TEAMS', BRAIN_PATH,
  '    gcSeat === null ? [] : [team.players, opp.players];', 1);
anchor('⭐⭐ CODE FACT (GC) — the shell subtraction itself', BRAIN_PATH,
  '        : sDv - gcSeat.exposureWeight * groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid);',
  1);
anchor('⭐⭐ CODE FACT — `groundShellHazard`\'s DECLARATION (the exam CALLS it)', DV_PATH,
  'export function groundShellHazard(', 1);
anchor('⭐⭐ `DV_CORRIDOR_SCALE` — laneOpenness\'s own metre normalizer', DV_PATH,
  'export const DV_CORRIDOR_SCALE = 4;', 1, 4);
anchor('⭐⭐ `DV_CLEAR_RADIUS` — laneOpenness\'s own clear-the-kicker guard', DV_PATH,
  'export const DV_CLEAR_RADIUS = 1.5;', 1, 1.5);
anchor('⭐⭐ `closestPointOnSegment` — CALLED, never re-implemented', VEC_PATH,
  'export const closestPointOnSegment = (a: V2, b: V2, p: V2): V2 => {', 1);
anchor('⭐ `CONTROL_RADIUS` — the TIGHT bin\'s half-width', CONST_PATH,
  'export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;', 1);
anchor('⭐⭐ BN-C0\'s OWN corridor membership test — the code this exam COPIES', BNC0_PATH,
  'const inCorridorOf = (', 1);
anchor('⭐⭐ `BALL_RADIUS` — the shell\'s own ball half-width', CONST_PATH,
  'export const BALL_RADIUS = 0.11;', 1, 0.11);
anchor('⭐⭐ `PLAYER_CORE_RADIUS`', CONST_PATH,
  'export const PLAYER_CORE_RADIUS = PLAYER_MIN_DIST / 2;', 1);
anchor('⭐⭐ `DUP_RUN_M` — the A4 battery I6 duplicate-run bucket (NO new constant)', A4P1C_PATH,
  'const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)', 1, 4);
anchor('⭐⭐ `SAMPLE_EVERY` — the A4 battery\'s own 6 Hz spacing-sample cadence', A4P1C_PATH,
  "const SAMPLE_EVERY = 10; // the battery's 6 Hz spacing-sample cadence (shape exhibit)", 1, 10);
anchor('⭐⭐ PT-C0\'s 撞车 line — the min-pairwise face', PTC0_PATH,
  '          if (mp < DUP_RUN_M) row.crashHits += 1;', 1);
anchor('⭐⭐ PT-C0\'s `isMeasurableGroundPass`, the population of record', PTC0_PATH,
  'const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>', 2);
anchor('⭐⭐ PT-C0\'s ground-launch predicate', PTC0_PATH,
  'const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>', 2);
anchor('⭐⭐ PT-C0\'s FIRST-BODY class ladder', PTC0_PATH, 'const contactClassOf = (', 1);
anchor('⭐⭐ `pendingPassWindup` — the ARM record this exam reads', MATCH_PATH,
  '  pendingPassWindup:', 1);
anchor('⭐⭐ the record\'s own fields', MATCH_PATH,
  '      gid: number; readyTick: number; aim: V2;', 1);
anchor('⭐ the record\'s `aimLead` field', MATCH_PATH, '      aimLead: V2 | null;', 1);
anchor('⭐⭐ THE AIM OF RECORD (ARM class) — `armPendingPass`\'s own write', MATCH_PATH,
  '      aim: { x: mate.pos.x, y: mate.pos.y },', 1);
anchor('⭐ the engine\'s own strike-lead deposit', MATCH_PATH,
  '  dxStrikeAim: { gid: number; lead: V2; tick: number } | null = null;', 1);
anchor('⭐⭐ FAMILY RECORD — the ENGINE\'S OWN RESTART STATE', MATCH_PATH,
  '  kickoffKickGid: number | null = null;', 1);
anchor('⭐⭐ FAMILY RECORD — the ONE writer of that state', MATCH_PATH,
  '    this.kickoffKickGid = st.gid;', 1);
anchor('⭐⭐ FAMILY RECORD — the kick-off branch GATE that reads it', BRAIN_PATH,
  '  if (match.kickoffKickGid === p.gid) {', 1);
anchor('⭐ …and the clear, one line below', BRAIN_PATH, '    match.kickoffKickGid = null;', 1);
anchor('⭐⭐ STRIKE SITE 1/6 — the Pass branch\'s ARM', BRAIN_PATH,
  '          match.armPendingPass(p, passMate!, offsideExemptKick);', 1);
anchor('⭐⭐ STRIKE SITE 2/6 — the LED synchronous release', BRAIN_PATH,
  '          match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));', 1);
anchor('⭐⭐ STRIKE SITE 3/6 — the TO-FEET synchronous release', BRAIN_PATH,
  '        } else match.performPass(p, passMate!, offsideExemptKick);', 1);
anchor('⭐⭐ STRIKE SITE 4/6 — the CUTBACK', BRAIN_PATH,
  '        match.performCutback(p, cutbackMate!);', 1);
anchor('⭐⭐ STRIKE SITE 5/6 — the THROUGH BALL', BRAIN_PATH,
  '      match.performThroughBall(p, bestRunner!, bestThroughChip, offsideExemptKick);', 1);
anchor('⭐⭐ STRIKE SITE 6/6 — the KICKOFF PLAY-BACK', BRAIN_PATH,
  '      match.performPass(p, back);', 1);
anchor('⭐⭐ THE LEDGER — the ONE write site', BRAIN_PATH, '      match.passChoiceTrace.push({', 1);
anchor('⭐⭐ the ledger row\'s `chosenGid`', BRAIN_PATH, '        chosenGid: choice?.targetGid ?? -1,', 1);
anchor('⭐⭐ the ledger row\'s `legacyGid`', BRAIN_PATH, '        legacyGid: bestMate.gid,', 1);
anchor('⭐ the ledger row\'s `tick`', BRAIN_PATH, '        tick: match.simTick,', 1);
anchor('⭐⭐ the ledger ARRAY on the match', MATCH_PATH,
  '  readonly passChoiceTrace: PassChoiceTraceEntry[] = [];', 1);
anchor('⭐⭐ `traceChoice`\'s env DEFAULT — why this exam passes the flag EXPLICITLY', MATCH_PATH,
  '    this.traceChoice = cfg.traceChoice ?? EDS_TRACE_ARMED;', 1);
anchor('⭐ the snapshot law\'s DEFAULT-OFF line', MATCH_PATH,
  '    this.inSnapshotLaw = cfg.inSnapshotLaw ?? false;', 1);
anchor('⭐⭐ the EDS SUBSTITUTION LINE', BRAIN_PATH, '    if (chosen) passMate = chosen;', 1);
anchor('⭐⭐ the EDS candidate enumeration', BRAIN_PATH,
  '    const candidateGids = passChoiceCandidateGids(p, team.players);', 1);
anchor('⭐⭐ the EDS scope construction', BRAIN_PATH,
  '    const scope = new Set<number>([p.gid, ...candidateGids]);', 1);
anchor('⭐⭐ the band\'s own constants — MIN', PPC_PATH,
  'export const PASS_CHOICE_MIN_METRES = 6;', 1, 6);
anchor('⭐⭐ the band\'s own constants — MAX', PPC_PATH,
  'export const PASS_CHOICE_MAX_METRES = 30;', 1, 30);
anchor('⭐⭐ `choosePerceivedPassTarget`\'s DECLARATION', PPC_PATH,
  'export function choosePerceivedPassTarget(', 1);
anchor('⭐⭐ world 13 = world 12 + the ONE cushion door', A4_PATH,
  '    return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };', 1);
anchor('⭐⭐ `BQ_WORLD_DOORS`', A4_PATH,
  'export const BQ_WORLD_DOORS = { bqCushion: true } as const;', 1);
anchor('⭐⭐ `bqArmedVersion` — the world gate of record', A4_PATH,
  'export function bqArmedVersion(match: Match): 0 | BqWorldVersion {', 1);
anchor('⭐⭐ `edsPerceivedChoice` in the world flag sets', A4_PATH, '  edsPerceivedChoice: true,', 2);
anchor('⭐⭐ `bkGroundCorridor` — world 12\'s own door', A4_PATH, '  bkGroundCorridor: true,', 1);
anchor('⭐ `dxWindupAim` — world 12\'s wind-up-aim door', A4_PATH, '  dxWindupAim: true,', 1);
anchor('⭐⭐ `CORRIDOR_WORLD_WEIGHT`', A4_PATH,
  'export const CORRIDOR_WORLD_WEIGHT = 0.5;', 1, 0.5);
anchor('⭐⭐ `formationSpot`\'s SIGNATURE (the exam CALLS it)', FORM_PATH,
  'export function formationSpot(\n  p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team, abandonRest = false,\n  pmMover = false,\n): V2 {',
  1);
anchor('⭐⭐ THE `emergentPosOn()` TOGGLE AT THE HEAD of formationSpot', FORM_PATH,
  '  if (emergentPosOn()) return emergentStation(p, team, ball, hasBall, opp, abandonRest, pmMover);',
  1);
anchor('⭐⭐ `supportSpot`\'s SIGNATURE (the exam CALLS it)', FORM_PATH,
  'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {', 1);
anchor('⭐ the executor\'s PRODUCTION `hasBall`', EXEC_PATH,
  '  const hasBall = match.possessionSide === team.side;', 1);
anchor('⭐⭐ THE OFFSIDE STAT — the engine\'s own counter (G6\'s source)', TYPES_PATH,
  '  offsides: number;', 1);
anchor('⭐⭐ X-FP-PROD — the PRODUCTION FINGERPRINT BASELINE, inherited from OBM-T1\'s probe',
  OBMT1_PATH,
  "const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';", 1);
anchor('⭐⭐ G-REPRO-LNC3 — LN-C3\'s OWN family rule, INHERITED', LNC3_PROBE_PATH,
  'const familyOf = (', 1);
anchor('⭐⭐ G-REPRO-LNC3 — LN-C3\'s OWN strike-site rule, INHERITED', LNC3_PROBE_PATH,
  'const strikeSiteOf = (', 1);
anchor('⭐⭐ G-REPRO-LNC3 — LN-C2\'s OWN path-class rule, INHERITED', LNC2_PROBE_PATH,
  'const pathClassOf = (', 1);
anchor('⭐⭐ G-REPRO-LNC3 — LN-C1\'s OWN choice-tick class rule, INHERITED', LNC1_PROBE_PATH,
  'const choiceClassOf = (hasArmRecord: boolean): ChoiceClass =>', 1);
anchor('⭐⭐ G-REPRO-LNC3 — LN-C1\'s OWN own-openness reconstruction line, INHERITED',
  LNC1_PROBE_PATH, '  const ownOpen = laneOpenness(passer.pos, aim, ownPop);', 1);
anchor('⭐⭐ G-REPRO-LNC3 — LN-C0\'s OWN wind-up ARM-tick key', LNC0_PROBE_PATH,
  '      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;', 1);
anchor('⭐⭐ G-REPRO-LNC3 — LN-C0\'s OWN E rule', LNC0_PROBE_PATH,
  '      const eX = armRec !== null ? armRec.eX : players[tGid].pos.x;', 1);

/* ==========================================================================
   ⭐⭐⭐ §3b THE EXTRACTED CALL GRAPH (gCodeFactGraph)
   canon, VERBATIM: "a code-fact boolean about what a function reads or does not read is
   derived from the function's WHOLE text and from every callee whose return enters the read,
   each pinned by an anchored text hash — the call graph it was checked over is stored beside
   the boolean; a hash pins a body, it cannot see through a call; a needle list is a
   confirmation, not a census; the callee list is EXTRACTED from the hashed text — every
   identifier called within the span, resolved to its definition and hashed — never typed, and
   a declared edge absent from the text, or a call present in the text and absent from the
   graph, is RED".

   ⭐ THE SIX ROOTS are the THREE PRICE SITES and the SEAT MODULE: `groundCandidate` (site a),
   the KICK-OFF PLAY-BACK span (site b), `choosePerceivedPassTarget` (site c2's argmax) and
   `ownLaneOpenness` / `ownLanePrice` / `ownLaneScopeGids`. Every other node in the graph
   below was DISCOVERED by extraction, not typed.
   ⚠ THESE ARE CODE READS, NOT MEASUREMENTS.
   ========================================================================== */
/** the comment/string stripper — itself an instrument, so it is fixture-pinned at §6. */
const stripCode = (t: string): string => t
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/\/\/[^\n]*/g, ' ')
  .replace(/`(?:\\.|[^`\\])*`/g, '``')
  .replace(/'(?:\\.|[^'\\])*'/g, "''")
  .replace(/"(?:\\.|[^"\\])*"/g, '""');
/** JS/TS language and BUILTIN member names — the ONE typed list in the extractor, and it is a
 *  list of things that are NOT src definitions (a `Math.min` has no body in `src/**`). */
const BUILTIN_CALLS = new Set(['Math', 'Number', 'Object', 'Array', 'JSON', 'Set', 'Map',
  'String', 'Boolean', 'Date', 'Error', 'isNaN', 'isFinite', 'parseFloat', 'parseInt',
  'push', 'filter', 'map', 'reduce', 'slice', 'sort', 'find', 'some', 'every', 'includes',
  'indexOf', 'join', 'concat', 'forEach', 'abs', 'min', 'max', 'hypot', 'sqrt', 'floor',
  'ceil', 'round', 'sign', 'pow', 'atan2', 'acos', 'asin', 'cos', 'sin', 'tan', 'exp', 'log',
  'from', 'keys', 'values', 'entries', 'fromEntries', 'isArray', 'isInteger', 'has', 'get',
  'set', 'add', 'delete', 'toFixed', 'startsWith', 'endsWith', 'replace', 'split', 'flatMap',
  'findIndex', 'fill', 'stringify', 'parse', 'trim', 'padEnd', 'test', 'match', 'toString',
  'of', 'assign', 'freeze', 'now', 'random', 'shift', 'pop', 'unshift', 'splice', 'reverse',
  'at', 'flat', 'repeat', 'toUpperCase', 'toLowerCase']);
const KEYWORD_CALLS = new Set(['if', 'for', 'while', 'switch', 'catch', 'return', 'typeof',
  'new', 'function', 'constructor', 'readonly', 'await', 'yield', 'throw', 'do', 'else',
  'in', 'instanceof', 'as', 'void', 'delete']);
/** ⛔ THE GRAPH'S CORPUS IS `src/**` ONLY — a probe under `scripts/` may CARRY a copy of a
 *  shipped function's needle, and a callee must resolve to the ENGINE'S definition, not to an
 *  instrument's quotation of it. */
const GRAPH_FILES = [MATCH_PATH, CONST_PATH, TYPES_PATH, TEAM_PATH, A4_PATH, DV_PATH, VEC_PATH,
  FORM_PATH, BRAIN_PATH, TEAMBRAIN_PATH, EXEC_PATH, PERC_PATH, PPC_PATH, PLAYER_PATH, SEAT_PATH,
  GENOME_PATH, MENTALITY_PATH, POV_PATH, PCI_PATH, PAFF_PATH, RAS_PATH, MECH_PATH, PRED_PATH,
  REACH_PATH, PRIOR_PATH, MATHU_PATH, 'src/ai/inSnapshotView.ts', 'src/ai/relativeAffordance.ts',
  'src/ai/carryAffordance.ts', 'src/ai/offBallAffordance.ts', 'src/ai/defensiveCoordination.ts'];
const GSRC: Record<string, string> = {};
for (const p of GRAPH_FILES) GSRC[p] = SRC_OF[p] ?? readFileSync(p, 'utf8');
/** ⭐ the BALANCED span end from a definition's start index — the definition's own brackets
 *  decide where it ends, so no end needle is ever typed for a DISCOVERED node. */
const spanEndFrom = (src: string, i: number): number => {
  let k = src.indexOf('(', i);
  if (k < 0) return -1;
  let d = 0;
  for (; k < src.length; k++) {
    const c = src[k];
    if (c === '(') d += 1;
    else if (c === ')') { d -= 1; if (d === 0) { k += 1; break; } }
  }
  let j = k; let dep = 0;
  while (j < src.length) {
    const c = src[j];
    if (c === '{' && dep === 0) {
      let b = 0;
      for (let m = j; m < src.length; m++) {
        const q = src[m];
        if (q === '{') b += 1;
        else if (q === '}') { b -= 1; if (b === 0) return m + 1; }
      }
      return -1;
    }
    if (c === '=' && src[j + 1] === '>') {
      let m = j + 2;
      while (/\s/.test(src[m])) m += 1;
      if (src[m] === '{') {
        let b = 0;
        for (let n = m; n < src.length; n++) {
          const q = src[n];
          if (q === '{') b += 1;
          else if (q === '}') { b -= 1; if (b === 0) return n + 1; }
        }
        return -1;
      }
      let dd = 0;
      for (let n = m; n < src.length; n++) {
        const q = src[n];
        if ('([{'.includes(q)) dd += 1;
        else if (')]}'.includes(q)) { if (dd === 0) return n; dd -= 1; }
        else if ((q === ';' || q === ',') && dd === 0) return n + 1;
      }
      return -1;
    }
    if (c === '(' || c === '[') dep += 1;
    else if (c === ')' || c === ']') dep -= 1;
    if (c === ';' && dep === 0) return j + 1;
    j += 1;
  }
  return -1;
};
const PLAIN_PATTERNS = (n: string): string[] => [`export function ${n}\\(`,
  `(?<![\\w$.])function ${n}\\(`, `export const ${n} = \\(`, `(?<![\\w$.])const ${n} = \\(`];
const MEMBER_PATTERNS = (n: string): string[] => [
  `\\n  (?:private |public |protected |readonly |static )*${n}\\(`,
  `\\n  get ${n}\\(`, `\\n *${n}: \\(`];
const locateDefinition = (
  name: string, member: boolean, homeFile: string,
): { file: string; idx: number }[] => {
  const pats = member ? MEMBER_PATTERNS(name) : PLAIN_PATTERNS(name);
  const scan = (files: readonly string[]): { file: string; idx: number }[] => {
    const hits: { file: string; idx: number }[] = [];
    for (const f of files) {
      for (const p of pats) {
        const m = new RegExp(p).exec(GSRC[f]);
        if (m) { hits.push({ file: f, idx: m.index }); break; }
      }
    }
    return hits;
  };
  if (!member) {
    const home = scan([homeFile]);
    if (home.length === 1) return home;
  }
  return scan(GRAPH_FILES);
};
interface GraphNode {
  name: string; file: string; startLine: number; endLine: number; chars: number; lines: number;
  sha256: string; root: boolean; discovered: boolean; callees: string[];
}
interface RootSpan { name: string; file: string; startNeedle: string; endNeedle: string }
const ROOT_SPANS: RootSpan[] = [
  { name: 'groundCandidate', file: BRAIN_PATH,
    startNeedle: '    const groundCandidate = (mate: Player, aim: Readonly<V2>, d: number): {',
    endNeedle: '      return { s: sRa, lane, open, gain, mul };\n    };' },
  { name: 'kickoffPlaybackScorer', file: BRAIN_PATH,
    startNeedle: '  if (match.kickoffKickGid === p.gid) {',
    endNeedle: '      match.performPass(p, back);\n      return;\n    }\n  }' },
  { name: 'choosePerceivedPassTarget', file: PPC_PATH,
    startNeedle: 'export function choosePerceivedPassTarget(', endNeedle: '\n}\n' },
  { name: 'ownLaneOpenness', file: SEAT_PATH,
    startNeedle: 'export function ownLaneOpenness(', endNeedle: '\n}\n' },
  { name: 'ownLanePrice', file: SEAT_PATH,
    startNeedle: 'export function ownLanePrice(', endNeedle: '\n}\n' },
  { name: 'ownLaneScopeGids', file: SEAT_PATH,
    startNeedle: 'export function ownLaneScopeGids(', endNeedle: '\n}\n' },
];
const NODE_SPANS: Record<string, { file: string; start: number; end: number }> = {};
const GRAPH_UNRESOLVED: string[] = [];
const GRAPH_BOUNDARY: { callee: string; reason: string }[] = [];
const GRAPH_ROOTS_OK: boolean[] = [];
for (const r of ROOT_SPANS) {
  const s = GSRC[r.file];
  const i = s.indexOf(r.startNeedle);
  const j = i < 0 ? -1 : s.indexOf(r.endNeedle, i);
  const unique = i >= 0 && s.indexOf(r.startNeedle, i + 1) < 0;
  GRAPH_ROOTS_OK.push(i >= 0 && j >= 0 && unique);
  if (i >= 0 && j >= 0) NODE_SPANS[r.name] = { file: r.file, start: i, end: j + r.endNeedle.length };
}
const GRAPH_EDGES: Record<string, string[]> = {};
const GRAPH_DISCOVERED = new Set<string>();
{
  const queue = ROOT_SPANS.map((r) => r.name);
  const seen = new Set(queue);
  const boundarySeen = new Set<string>();
  while (queue.length > 0) {
    const n = queue.shift() as string;
    const node = NODE_SPANS[n];
    if (node === undefined) { GRAPH_UNRESOLVED.push(`${n} [no span]`); continue; }
    const t = stripCode(GSRC[node.file].slice(node.start, node.end));
    const out = new Set<string>();
    for (const m of t.matchAll(/(\.?)([A-Za-z_$][\w$]*)\s*\(/g)) {
      const member = m[1] === '.';
      const id = m[2];
      if (id === n || BUILTIN_CALLS.has(id) || KEYWORD_CALLS.has(id)) continue;
      const ls = t.lastIndexOf('\n', m.index as number) + 1;
      const le = t.indexOf('\n', m.index as number);
      const line = t.slice(ls, le < 0 ? t.length : le).trim();
      const chain = (/^(?:[A-Za-z_$][\w$]*\.)*/.exec(line) as RegExpExecArray)[0];
      if (line.startsWith(`${chain}${id}(`) && line.endsWith(');')) {
        /* ⭐ A BOUNDARY: the call stands ALONE as a statement, so its RETURN ENTERS NOTHING —
           it cannot be a callee "whose return enters the read". Stored with its reason. */
        if (!boundarySeen.has(id)) {
          boundarySeen.add(id);
          GRAPH_BOUNDARY.push({ callee: id, reason: 'statement position — the return value is '
            + 'discarded, so nothing it returns can enter a price' });
        }
        continue;
      }
      out.add(member ? `.${id}` : id);
    }
    GRAPH_EDGES[n] = [...out].map((x) => (x.startsWith('.') ? x.slice(1) : x)).sort();
    for (const c of out) {
      const member = c.startsWith('.');
      const id = member ? c.slice(1) : c;
      if (seen.has(id)) continue;
      seen.add(id);
      const hits = locateDefinition(id, member, node.file);
      if (hits.length !== 1) {
        GRAPH_UNRESOLVED.push(`${id} [${member ? 'member' : 'plain'}] defs=${hits.length}`);
        continue;
      }
      const e = spanEndFrom(GSRC[hits[0].file], hits[0].idx);
      if (e < 0) { GRAPH_UNRESOLVED.push(`${id} [span end not found]`); continue; }
      NODE_SPANS[id] = { file: hits[0].file, start: hits[0].idx, end: e };
      GRAPH_DISCOVERED.add(id);
      queue.push(id);
    }
  }
}
const GRAPH_NODES: GraphNode[] = Object.keys(NODE_SPANS).sort().map((name) => {
  const sp = NODE_SPANS[name];
  const text = GSRC[sp.file].slice(sp.start, sp.end);
  return {
    name, file: sp.file,
    startLine: lineOf(GSRC[sp.file], sp.start), endLine: lineOf(GSRC[sp.file], sp.end),
    chars: text.length, lines: text.split('\n').length, sha256: sha(text),
    root: ROOT_SPANS.some((r) => r.name === name), discovered: GRAPH_DISCOVERED.has(name),
    callees: GRAPH_EDGES[name] ?? [],
  };
});
const NODE_TEXT = (name: string): string => {
  const sp = NODE_SPANS[name];
  return sp === undefined ? '' : GSRC[sp.file].slice(sp.start, sp.end);
};
const closureOf = (root: string): string[] => {
  const seen = new Set<string>(); const stack = [root];
  while (stack.length > 0) {
    const k = stack.pop() as string;
    if (seen.has(k)) continue;
    seen.add(k);
    for (const c of GRAPH_EDGES[k] ?? []) stack.push(c);
  }
  return [...seen].sort();
};
const GRAPH_NODES_OK = GRAPH_NODES.every((n) => n.chars > 0 && n.sha256.length === 64
  && n.startLine > 0);
const GRAPH_EVERY_EDGE_HAS_A_NODE = Object.values(GRAPH_EDGES)
  .every((cs) => cs.every((c) => NODE_SPANS[c] !== undefined));
const CODE_FACT_GRAPH_OK = GRAPH_ROOTS_OK.every((x) => x) && GRAPH_NODES_OK
  && GRAPH_UNRESOLVED.length === 0 && GRAPH_EVERY_EDGE_HAS_A_NODE
  && ROOT_SPANS.every((r) => NODE_SPANS[r.name] !== undefined);
/** ⭐⭐ THE STORED CODE FACTS — every boolean DERIVED from a node's own hashed text, and
 *  written only because `gCodeFactGraph` is GREEN. */
const hasIn = (node: string, q: string): boolean => NODE_TEXT(node).includes(q);
const CODE_FACTS = {
  siteAIsAfterTheGroundCorridorShell: hasIn('groundCandidate', 'const sLn = lnSeat === null ? sGc')
    && hasIn('groundCandidate', ': sGc - ownLanePrice(lnSeat.w, ownLaneOpenness('),
  siteAFeedsTheReceiverAccessTerm: hasIn('groundCandidate', 'const sRa = raSeat === null ? sLn'),
  siteBPricesTheKickOffPlayBack: hasIn('kickoffPlaybackScorer', 's -= ownLanePrice(lnSeat.w, ownLaneOpenness('),
  siteBShippedScorerIsUnchangedButForLet: hasIn('kickoffPlaybackScorer',
    "let s = opennessOf(mate, opp.players) - Math.abs(d - 12) * 0.02 - (mate.role === 'GK' ? 0.3 : 0);"),
  seatCallsTheShippedLaneOpenness: hasIn('ownLaneOpenness',
    'return laneOpenness(from, aim, kept as unknown as Player[]);'),
  seatRestatesNoGeometry: !hasIn('ownLaneOpenness', 'closestPointOnSegment')
    && !hasIn('ownLaneOpenness', 'DV_CORRIDOR_SCALE') && !hasIn('ownLaneOpenness', '1.5'),
  priceIsTheSingleExpression: hasIn('ownLanePrice', 'return w * (1 - openness);'),
  chooserTakesTheHook: hasIn('choosePerceivedPassTarget', 'ownLaneFactor'),
  chooserHasNoLaneTerm: !hasIn('choosePerceivedPassTarget', 'laneOpenness'),
  chooserHasNoShellTerm: !hasIn('choosePerceivedPassTarget', 'groundShellHazard'),
};

/* ========================================================================== */
/* §3c THE EXTRACTED CONSTANTS — every one read out of an ANCHORED line        */
/* ========================================================================== */
/** ⭐⭐ THE TWO BINNING EDGES ARE THE CHOOSER'S OWN GATES, EXTRACTED by regex from the anchored
 *  lines — never re-typed as decimals (canon: anchored extraction). */
const GATE_040 = Number((SRC_OF[BRAIN_PATH]
  .match(/if \(gain > 0\.15 && lane < (0\.\d+)\) \{/) ?? ['', 'NaN'])[1]);
const GATE_045 = Number((SRC_OF[BRAIN_PATH]
  .match(/\n      if \(lane < (0\.\d+)\) \{\n/) ?? ['', 'NaN'])[1]);
/** ⭐⭐⭐ THE GUARD TOLERANCE FRACTION — INHERITED BY ANCHOR from LN-T1's own probe line and
 *  EVALUATED FROM ITS TWO NUMERALS. ⛔ NEVER TYPED AS A DECIMAL anywhere in this instrument:
 *  the two numerals below are READ OUT of `scripts/probes/ln-t1-lane-exam.ts` (whose own line
 *  is anchored at §3), and OBM-T1's identical line is read as a SECOND source and required to
 *  agree. */
const niPair = (path: string): [number, number] => {
  const m = SRC_OF[path].match(/const NI_FRACTION = 1 - (0\.\d+) \/ (0\.\d+);/);
  return m === null ? [Number.NaN, Number.NaN] : [Number(m[1]), Number(m[2])];
};
const NI_LNT1 = niPair(LNT1_PROBE_PATH);
const NI_OBMT1 = niPair(OBMT1_PATH);
const NI_FRACTION = 1 - NI_LNT1[0] / NI_LNT1[1];
const NI_FRACTION_FROM_OBMT1 = 1 - NI_OBMT1[0] / NI_OBMT1[1];
const NI_OK = Number.isFinite(NI_FRACTION) && NI_FRACTION > 0 && NI_FRACTION < 1
  && NI_FRACTION === NI_FRACTION_FROM_OBMT1;
/** ⭐⭐ X-FP-PROD's pins, inherited from OBM-T1's probe (anchored above), never re-typed. */
const FINGERPRINT_BASELINE = (SRC_OF[OBMT1_PATH]
  .match(/const FINGERPRINT_BASELINE = '([0-9a-f]{64})';/) ?? ['', ''])[1];
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
/** THE ACTION VOCABULARY — read off `ActionType`'s OWN union, never re-typed. */
const AT_START = 'export type ActionType =';
const atIdx = SRC_OF[TYPES_PATH].indexOf(AT_START);
const ACTIONS = (SRC_OF[TYPES_PATH].slice(atIdx, SRC_OF[TYPES_PATH].indexOf(';', atIdx))
  .match(/'([A-Za-z]+)'/g) ?? []).map((s) => s.slice(1, -1));
const AI = (a: string): number => {
  const i = ACTIONS.indexOf(a);
  return i < 0 ? ACTIONS.length : i;
};
const ACTION_CELLS = [...ACTIONS, 'unknown'] as const;
/** ⭐⭐ THE TWO CROWD CONSTANTS — ANCHORED above from the A4 battery. NO new constant. */
const DUP_RUN_M = 4;
const SAMPLE_EVERY = 10;
const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && GATE_040 === 0.4 && GATE_045 === 0.45
  && GATE_040 === (ANCHORS.find((a) => a.needle === '      if (gain > 0.15 && lane < 0.4) {')!
    .extracted as number)
  && GATE_045 === (ANCHORS.find((a) => a.needle === '      if (lane < 0.45) {')!
    .extracted as number)
  && /^[0-9a-f]{64}$/.test(FINGERPRINT_BASELINE)
  && NI_OK
  && ACTIONS.length === 23
  && ACTIONS[0] === 'MoveToFormationSpot'
  && DUP_RUN_M === (ANCHORS.find((a) => a.needle.startsWith('const DUP_RUN_M'))!
    .extracted as number)
  && SAMPLE_EVERY === (ANCHORS.find((a) => a.needle.startsWith('const SAMPLE_EVERY'))!
    .extracted as number)
  && DV_CORRIDOR_SCALE === 4 && DV_CLEAR_RADIUS === 1.5
  && BQ_WORLD_VERSION === 13 && GRAVITY === 9.81
  && BALL_RADIUS === (ANCHORS.find((a) => a.needle === 'export const BALL_RADIUS = 0.11;')!
    .extracted as number)
  && PLAYER_CORE_RADIUS > 0
  && CORRIDOR_WORLD_WEIGHT === (ANCHORS.find(
    (a) => a.needle === 'export const CORRIDOR_WORLD_WEIGHT = 0.5;')!.extracted as number)
  && PASS_CHOICE_MIN_METRES === (ANCHORS.find(
    (a) => a.needle === 'export const PASS_CHOICE_MIN_METRES = 6;')!.extracted as number)
  && PASS_CHOICE_MAX_METRES === (ANCHORS.find(
    (a) => a.needle === 'export const PASS_CHOICE_MAX_METRES = 30;')!.extracted as number);
/** ⭐⭐ LN-C3's OWN STORED SPAN for the kick-off scorer — QUOTED so the difference at THIS head
 *  is a stored comparison, not a claim (#394 item 3: "LN-C3's frozen probe's kick-off span hash
 *  no longer matches at this head (site (b) added a statement inside the span; the line anchors
 *  still match; the banked census untouched) — LN-T1′ re-anchors at its own head"). */
const LNC3_KICKOFF_SPAN = (() => {
  /* ⛔ NOT TYPED — READ out of the BANKED census artifact, so this block cannot drift from the
     thing it quotes (canon, single source). The census file is not edited by this stage. */
  const src = 'docs/world-model/data/ln-c3-untraced-family-census.json';
  const doc = JSON.parse(readFileSync(src, 'utf8')) as {
    callGraphNodes: { nodes: { name: string; sha256: string; startLine: number;
      endLine: number; chars: number }[] };
  };
  const node = doc.callGraphNodes.nodes.find((n) => n.name === 'kickoffPlaybackScorer');
  if (node === undefined) {
    banner('LN-T1PB FATAL — LN-C3\'s banked artifact carries no `kickoffPlaybackScorer` node');
    process.exit(3);
  }
  return {
    storedSha256: node.sha256, storedStartLine: node.startLine, storedEndLine: node.endLine,
    storedChars: node.chars,
    quotedFrom: `${src} \`callGraphNodes.nodes[] where name === "kickoffPlaybackScorer"\``,
  };
})();
/** WHICH PATH THE TOGGLE TAKES IN WORLD 13 — determined, not assumed. */
const EMERGENT_POS_ON = emergentPosOn();
const FORMATION_SPOT_PATH = EMERGENT_POS_ON
  ? 'emergentStation (the DEFAULT-ON emergent positioning field) — world 13 takes THIS path'
  : 'the legacy fixed-table path (ATTACK_FORMATIONS / DEFEND_FORMATIONS)';

/* ========================================================================== */
/* §4 SEEDS — block 12,550,000–999 (#395 item 4(iii) / item 8's frontier)      */
/* ========================================================================== */
const BLOCK_BASE = 12_550_000;
const BLOCK_TOP = 12_550_999;
const BLOCK_AFFORDS = BLOCK_TOP - BLOCK_BASE; // 999 seeds after the construction receipt
/** ⭐⭐ N_FROZEN — SIZED, not chosen; see §15. The variance source is the §DEV-PREFLIGHT
 *  12-seed SCRATCH SMOKE, run BEFORE the freeze commit and BEFORE any battery seed. */
const N_FROZEN = 69; /* §DEV-PREFLIGHT: SIZED, see §15 — min(nRequired, blockAffords) */
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_004_300;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
/** ⭐⭐ G-REPRO-LNC3 — LN-C3's OWN first twelve battery seeds, RE-WALKED on the ABSENT arm.
 *  ⛔ RE-WALKS, NOT CONSUMPTION: block 12,548,000–999 is LN-C3's, consumed whole of record. */
const REPRO_LNC3_BASE = 12_548_000;
const REPRO_LNC3_N = 12;
const REPRO_LNC3_SEEDS = Array.from({ length: REPRO_LNC3_N }, (_, i) => REPRO_LNC3_BASE + i);
const LNC3_ARTIFACT = 'docs/world-model/data/ln-c3-untraced-family-census.json';
/** ⭐⭐⭐ LN-T1′b CHANGE (e) — G-REPRO-LNT1P: LN-T1′'s OWN first twelve battery seeds, RE-WALKED
 *  on ALL SEVEN ARMS and matched FIELD FOR FIELD against ITS OWN artifact. The walker and the
 *  observation are the SAME (only the receipts changed), so 0 mismatches on every arm is the
 *  IDENTITY RECEIPT between the two runs.
 *  ⛔ RE-WALKS, NOT CONSUMPTION: block 12,549,000–999 is LN-T1′'s, consumed whole of record.
 *  ⚠ The artifact of record is the `.RED.json` one — LN-T1′'s own fail-closed routing wrote
 *  that path and deliberately left the canonical one unwritten (#395 item 3). */
const REPRO_LNT1P_BASE = 12_549_000;
const REPRO_LNT1P_N = 12;
const REPRO_LNT1P_SEEDS = Array.from({ length: REPRO_LNT1P_N },
  (_, i) => REPRO_LNT1P_BASE + i);
const LNT1P_ARTIFACT = 'docs/world-model/data/ln-t1p-own-lane-exam.json.RED.json';

/* ========================================================================== */
/* §5 THE ARMS — SEVEN, PAIRED on shared seeds                                 */
/* ========================================================================== */
const ARMS = ['ABSENT', 'ARMED-ZERO', 'W025', 'W050', 'W100',
  'D13-ABSENT', 'D13-W050'] as const;
type Arm = (typeof ARMS)[number];
const CONTROL_ARM: Arm = 'ABSENT';
const D13_CONTROL_ARM: Arm = 'D13-ABSENT';
/** the arms whose paired Δ is taken against the E13 control. */
const DOSE_ARMS = ['ARMED-ZERO', 'W025', 'W050', 'W100'] as const;
type DoseArm = (typeof DOSE_ARMS)[number];
/** ⭐ THE READ SELECTOR RANGES OVER THE THREE DOSED WEIGHTS ONLY. ARMED-ZERO is the IDENTITY
 *  arm — FLAG-HYGIENE requires it to be byte-identical to the control, so its every Δ is
 *  exactly 0 and it can never be a dose of record. Its booleans are STORED anyway. */
const DOSES = ['W025', 'W050', 'W100'] as const;
type Dose = (typeof DOSES)[number];
const DOSE_W: Record<Dose, number> = { W025: 0.25, W050: 0.5, W100: 1 };
const ARM_FLAG: Record<Arm, boolean> = {
  ABSENT: false, 'ARMED-ZERO': true, W025: true, W050: true, W100: true,
  'D13-ABSENT': false, 'D13-W050': true,
};
const ARM_WEIGHT: Record<Arm, number | null> = {
  ABSENT: null, 'ARMED-ZERO': null, W025: 0.25, W050: 0.5, W100: 1,
  'D13-ABSENT': null, 'D13-W050': 0.5,
};
const ARM_BOOK: Record<Arm, 'E13' | 'D13'> = {
  ABSENT: 'E13', 'ARMED-ZERO': 'E13', W025: 'E13', W050: 'E13', W100: 'E13',
  'D13-ABSENT': 'D13', 'D13-W050': 'D13',
};
const ARM_LABEL: Record<Arm, string> = {
  ABSENT: 'world 13 EMPTY-BOOK exactly as LN-C3 walked its E13 arm — the control (no '
    + '`lnOwnLanePrice` key at all)',
  'ARMED-ZERO': '`lnOwnLanePrice: true`, the gene ABSENT — the IDENTITY arm (FLAG-HYGIENE)',
  W025: '`lnOwnLanePrice: true` + `lnOwnLaneWeight` = 0.25',
  W050: '`lnOwnLanePrice: true` + `lnOwnLaneWeight` = 0.5 (the shell\'s own weight, the '
    + 'reference dose)',
  W100: '`lnOwnLanePrice: true` + `lnOwnLaneWeight` = 1.0 (the ceiling; the variance source)',
  'D13-ABSENT': 'world 13 DOSED through the shipped loaders (LN-C3\'s D13) — THE FORM THE USER '
    + 'PLAYS, no `lnOwnLanePrice` key',
  'D13-W050': 'the same DOSED book + `lnOwnLanePrice: true` + `lnOwnLaneWeight` = 0.5',
};
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('LN-T1PB FATAL — a dose file\'s BYTES do not match the pinned value (#388 item 2(i))');
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
  banner(`LN-T1PB FATAL — the DOSED arm is not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}

/* ==========================================================================
   ⭐⭐⭐ §5b THE DOSE PLACEMENT — canon, VERBATIM: "dose NEVER in info.genome;
   truth-dosing writes census values through the effective genome".

   THE ANCHOR CHAIN (each line pinned at §3, with its line receipt):
     (1) `PlayerBrain.decideCarrier` reads `const g = team.genome;` two lines after `team` is
         bound — and in world 13 `inSnapshotLaw` is OFF, so `team` IS the TRUTH `Team` object.
     (2) `Team`'s own getter: `get genome() { return this.effGenome; }` — a FIELD, NOT
         `info.genome`.
     (3) `Match` REBUILDS `effGenome` from `baseGenome` at every brain tick
         (`team.effGenome = applyMentality(team.baseGenome, team.mentality)`), so a dose written
         only on `effGenome` would be ERASED the first time the coach's mentality moves.
     (4) `applyMentality` SPREADS its input (`...raw`), so a gene it does not name survives.
   ⇒ THE DOSE IS WRITTEN ON `baseGenome` AND `effGenome`, AS COPIES, AND NEVER ON
     `info.genome` — the ratified weight-setting idiom (`setCorridorWeight` / `setRaGenes` /
     `setBkWeightLocal`, #334 item 1).

   ⚠ THE T0 SUITE'S THREE-VIEW IDIOM IS NOT FOLLOWED, AND HERE IS WHY. `tests/lnOwnLane.test.ts`
   writes the gene on ALL THREE views (`info.genome` included) because a unit pin wants the
   value wherever it is read and its `Match` dies at the end of the assertion. This exam runs
   inside the league's own construction path: `info.genome` is the FRANCHISE'S OWN OBJECT, and
   `crossoverGenomes` copies a present gene from parent A even with the evolution opt-in shut
   (LN-OWN-LANE-CONTRACT.md §2 M-LN.2), so writing it would open the Lamarck channel the
   contract names as a LATER slice. `G-ARM` therefore requires `info.genome` to carry NO gene
   on every dosed seed, and `lnOwnLaneWeightOf(info.genome)` to read 0 (ABSENT).
   ========================================================================== */
const setLnWeight = (m: Match, weight: number): void => {
  for (const team of m.teams) {
    const view = { ...team.baseGenome, lnOwnLaneWeight: weight } as TacticalGenome;
    team.baseGenome = view;
    team.effGenome = view;
  }
};
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐⭐ THE ARM CONSTRUCTION. The ABSENT arm is LN-C3's `buildMatch(seed, 'E13')` BYTE FOR BYTE
 *  (the composer CALLED, the flag set NEVER copied) and D13-ABSENT is its `buildMatch(seed,
 *  'D13')`. Every other arm is that same construction PLUS the `lnOwnLanePrice` MatchConfig
 *  flag, and — where the arm is dosed — the gene written afterwards on the anchored views.
 *  ⭐ `traceChoice` IS PASSED EXPLICITLY, NEVER THROUGH THE ENV (§1 REFUSES `EDS_TRACE_CHOICE`). */
const buildMatch = (seed: number, arm: Arm, traced = true): Match => {
  const base = {
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION), traceChoice: traced,
  };
  const m = ARM_FLAG[arm]
    ? new Match({ ...base, lnOwnLanePrice: true } as ConstructorParameters<typeof Match>[0])
    : new Match(base as ConstructorParameters<typeof Match>[0]);
  if (ARM_BOOK[arm] === 'E13') armA4World(m, null, BQ_WORLD_VERSION);
  else armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
  const w = ARM_WEIGHT[arm];
  if (w !== null) setLnWeight(m, w);
  return m;
};
/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed                          */
/* ========================================================================== */
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';
interface StatDelta {
  shots: number; clearances: number; passes: number; crosses: number; cutbacks: number;
  throughBalls: number; longBalls: number; headersWon: number;
}
/** ⭐⭐ PT-C0's population ladder, BYTE FOR BYTE. */
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
/** ⭐⭐ PT-C0's FIRST-BODY CLASSES, reused byte for byte. */
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const CTI = (c: ContactClass): number => CONTACTS.indexOf(c);
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');

/** ⭐⭐ THE CORRIDOR MEMBERSHIP — BN-C0's test, COPIED and anchored: `laneOpenness`'s own
 *  geometry through `closestPointOnSegment` (CALLED), at its own scale `DV_CORRIDOR_SCALE`
 *  with its own clear-the-kicker guard `DV_CLEAR_RADIUS`. The `CONTROL_RADIUS` half-width is
 *  the TIGHT robustness BIN beside — a bin, never a second definition. */
const inCorridorOf = (
  fromX: number, fromY: number, aimX: number, aimY: number,
  px: number, py: number, halfWidth: number,
): boolean => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  if (Math.hypot(cp.x - fromX, cp.y - fromY) < DV_CLEAR_RADIUS) return false;
  return Math.hypot(cp.x - px, cp.y - py) < halfWidth;
};
/** the distance from a body to the corridor's CENTRE LINE (the same closest point). */
const centreLineDistOf = (
  fromX: number, fromY: number, aimX: number, aimY: number, px: number, py: number,
): number => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  return Math.hypot(cp.x - px, cp.y - py);
};

/** ⭐⭐ THE DESIGNATION — READ OFF THE TEAM'S OWN SETS (the engine's ledger). Never inferred
 *  from movement. `runner` / `arriver` / `overlapper` / `chaser` / `none`, in that FROZEN
 *  precedence: the three IN-POSSESSION licences first (they are what license `MakeRun` over the
 *  fan), then the loose-ball chase assignment, then nobody. */
const DESIGNATIONS = ['runner', 'arriver', 'overlapper', 'chaser', 'none'] as const;
type Designation = (typeof DESIGNATIONS)[number];
const DGI = (d: Designation): number => DESIGNATIONS.indexOf(d);
interface DesigSets {
  runners: ReadonlySet<number>; arriver: number | null; overlapper: number | null;
  chasers: ReadonlySet<number>;
}
const designationOf = (index: number, s: DesigSets): Designation =>
  (s.runners.has(index) ? 'runner'
    : s.arriver === index ? 'arriver'
      : s.overlapper === index ? 'overlapper'
        : s.chasers.has(index) ? 'chaser' : 'none');
const isDesignated = (d: Designation): boolean =>
  d === 'runner' || d === 'arriver' || d === 'overlapper';

/** ⭐⭐ THE OCCUPANT CAUSE CLASSES, in the FROZEN PRECEDENCE L1 > L2 > L3a > L3b > L4.
 *  WHY THIS ORDER, from the decision surface itself (anchored): a DESIGNATION is a top-down
 *  licence written by `assignRunners` into the team's own sets, and the `MakeRun` candidate
 *  exists at all ONLY for an already-licensed body — the licence therefore describes what put
 *  him in motion whatever score won, so it is read FIRST, off the engine's ledger. Only then
 *  is the action the body actually CHOSE read; and inside the shape-keeping action the SPOT
 *  itself is asked before his path to it, because a spot in the lane needs no movement story. */
const CAUSES = ['L1', 'L2', 'L3a', 'L3b', 'L4'] as const;
type Cause = (typeof CAUSES)[number];
const LCI = (c: Cause): number => CAUSES.indexOf(c);
interface CauseInput { designation: Designation; action: string; spotInLane: boolean }
const causeOf = (i: CauseInput): Cause => {
  if (isDesignated(i.designation)) return 'L1';
  if (i.action === 'SupportBallCarrier') return 'L2';
  if (i.action === 'MoveToFormationSpot') return i.spotInLane ? 'L3a' : 'L3b';
  return 'L4';
};

/** ⭐⭐ THE PAIR CLASSES, in the FROZEN PRECEDENCE P2 > P3 > P1 > P4 > P5 — the SAME reading
 *  order as the occupant classes (the engine's own ledger first, then the chosen action, then
 *  the table's geometry). ⭐ The five are DISJOINT BY CONSTRUCTION (P1/P4 require BOTH bodies
 *  undesignated and shape-keeping, and differ only in the spot distance; P3 requires nobody
 *  designated and at least one supporter, which no shape-keeping pair can be), so the
 *  precedence does no work — `gWalkFixtures` proves that on constructed pairs. */
const PAIRS = ['P1', 'P2', 'P3', 'P4', 'P5'] as const;
type PairClass = (typeof PAIRS)[number];
const PCI = (c: PairClass): number => PAIRS.indexOf(c);
interface PairInput {
  dA: Designation; dB: Designation; aA: string; aB: string; spotsWithin: boolean;
}
const pairClassOf = (i: PairInput): PairClass => {
  if (isDesignated(i.dA) || isDesignated(i.dB)) return 'P2';
  if (i.aA === 'SupportBallCarrier' || i.aB === 'SupportBallCarrier') return 'P3';
  if (i.aA === 'MoveToFormationSpot' && i.aB === 'MoveToFormationSpot') {
    return i.spotsWithin ? 'P1' : 'P4';
  }
  return 'P5';
};

/** ⭐⭐ THE PRESENT / ARRIVED SPLIT — BN-C0's corridor split, MIRRORED for the occupant.
 *  Every occupant is inside the corridor AT RELEASE by definition; PRESENT = also inside the
 *  ARM-tick corridor (the record's own aim, from the passer's ARM-tick position); ARRIVED =
 *  outside at arm. A pass with NO wind-up record has no arm tick at all: `noWindup`. */
const PRESENCE = ['present', 'arrived', 'noWindup'] as const;
type Presence = (typeof PRESENCE)[number];
const PRI = (p: Presence): number => PRESENCE.indexOf(p);
const presenceOf = (hasArm: boolean, inLaneAtArm: boolean): Presence =>
  (!hasArm ? 'noWindup' : inLaneAtArm ? 'present' : 'arrived');

/** ⭐⭐ PT-C0's CROWD LIMBS — the A4 battery's own arithmetic, COPIED. */
const nearestMateOf = (xs: readonly number[], ys: readonly number[], a: number): number => {
  let nearest = Number.POSITIVE_INFINITY;
  for (let b = 0; b < xs.length; b++) {
    if (a === b) continue;
    const dd = Math.hypot(xs[a] - xs[b], ys[a] - ys[b]);
    if (dd < nearest) nearest = dd;
  }
  return nearest;
};
const dupRunPairsOf = (xs: readonly number[], ys: readonly number[]): number => {
  let n = 0;
  for (let a = 0; a < xs.length; a++) {
    for (let b = a + 1; b < xs.length; b++) {
      if (Math.hypot(xs[a] - xs[b], ys[a] - ys[b]) < DUP_RUN_M) n += 1;
    }
  }
  return n;
};
const minPairwiseOf = (xs: readonly number[], ys: readonly number[]): number => {
  let m = Number.POSITIVE_INFINITY;
  for (let a = 0; a < xs.length; a++) {
    for (let b = a + 1; b < xs.length; b++) {
      const dd = Math.hypot(xs[a] - xs[b], ys[a] - ys[b]);
      if (dd < m) m = dd;
    }
  }
  return m;
};
/** ⭐ gReproducePTC0's SECOND, INDEPENDENT implementation of the same two quantities — a
 *  different loop shape over the same sample, compared cell for cell on a scratch seed. */
const dupRunPairsAltOf = (xs: readonly number[], ys: readonly number[]): number => {
  const ds: number[] = [];
  for (let a = 0; a < xs.length; a++) {
    for (let b = 0; b < xs.length; b++) {
      if (b > a) ds.push(Math.hypot(xs[a] - xs[b], ys[a] - ys[b]));
    }
  }
  return ds.filter((d) => d < DUP_RUN_M).length;
};
const crashAltOf = (xs: readonly number[], ys: readonly number[]): boolean => {
  const ds: number[] = [];
  for (let a = 0; a < xs.length; a++) {
    for (let b = 0; b < xs.length; b++) {
      if (b > a) ds.push(Math.hypot(xs[a] - xs[b], ys[a] - ys[b]));
    }
  }
  return ds.length > 0 && Math.min(...ds) < DUP_RUN_M;
};

/* ========================================================================== */
/* ⭐⭐ LN-C1 §6b — THE CHOICE TICK, THE TWO OPENNESSES AND THE MENU            */
/* ========================================================================== */
/** ⭐⭐ THE CHOICE-TICK CLASSES, FROZEN with the ENGINE'S OWN RULE (anchored at §3):
 *  - `arm`     — a wind-up record was resolved for THIS passer and THIS target. The brain
 *                calls `armPendingPass` SYNCHRONOUSLY at the tick it chose `Pass`
 *                (`PlayerBrain` l.1683–1684), so THE ARM TICK IS THE CHOICE TICK, and the
 *                record's own `aim` (+ `aimLead`) is the AIM OF RECORD.
 *  - `release` — no wind-up record. Every remaining strike path is called SYNCHRONOUSLY from
 *                the same brain decision (`performPass` at l.1686/1687, `performCutback` at
 *                l.1628), so THE STRIKE IS ON THE DECISION TICK and THE RELEASE TICK IS THE
 *                CHOICE TICK, read as such. The aim of record is PT-C0's own: the target's
 *                position at the strike tick — the flight's launch-to-target line.
 *  - `none`    — a measured ground pass whose choice tick is NOT establishable by either rule.
 *                COUNTED, never imputed (LN-C0's `noWindup` precedent). By the engine's rule
 *                above the class is expected EMPTY; whatever it reads is published beside
 *                every read sentence. */
const CHOICE_CLASSES = ['arm', 'release', 'none'] as const;
type ChoiceClass = (typeof CHOICE_CLASSES)[number];
const CCI = (c: ChoiceClass): number => CHOICE_CLASSES.indexOf(c);
/** the ESTABLISHED classes — the reads are stated on these, the counted class beside. */
const ESTABLISHED: readonly ChoiceClass[] = ['arm', 'release'];
const choiceClassOf = (hasArmRecord: boolean): ChoiceClass =>
  (hasArmRecord ? 'arm' : 'release');

/** ⭐ the openness grid: a FINE 0.1 grid, DECLARED AS BINS (never a rule). The two RULE edges
 *  are the chooser's OWN gates, extracted at §3: `GATE_040` (l.628) and `GATE_045` (l.943). */
const OPEN_BIN_W = 0.1; const OPEN_BINS = 10;

/** ⭐⭐ THE FIRST BODY'S PRESENCE AT THE CHOICE — LN-C0's present/arrived split, RE-EXPRESSED
 *  on the CHOICE tick. `presentAtChoice` = he was inside the release corridor AND (for the
 *  `arm` class) inside the ARM-tick corridor too; `arrivedAfterChoice` = inside at release,
 *  outside at the arm tick (⚠ STRUCTURALLY EMPTY for the `release` class, whose choice tick IS
 *  the release tick — declared, and fixture-pinned); `notInReleaseCorridor` = the first body
 *  was never a lane occupant at all (the ball's struck line is not the aim line). */
const CAROM_PRESENCE = ['presentAtChoice', 'arrivedAfterChoice', 'notInReleaseCorridor'] as const;
type CaromPresence = (typeof CAROM_PRESENCE)[number];
const CPI = (c: CaromPresence): number => CAROM_PRESENCE.indexOf(c);
const caromPresenceOf = (
  wasOccupant: boolean, occPresence: Presence | null,
): CaromPresence => (!wasOccupant ? 'notInReleaseCorridor'
  : occPresence === 'arrived' ? 'arrivedAfterChoice' : 'presentAtChoice');

/** the forward-gain SIGN cells of the best alternative (published beside, NEVER gating). */
const GAIN_SIGNS = ['backward', 'level', 'forward'] as const;
const GSI = (g: number): number => (g < 0 ? 0 : g > 0 ? 2 : 1);

/** ⭐⭐ THE PATH CLASSES, off the ENGINE'S OWN LEDGER (`match.passChoiceTrace`), FROZEN:
 *   · `legacyChosen`   — a trace row joined AND `chosenGid === legacyGid`: the perceived
 *                        chooser priced the menu and landed on the lane argmax's own man.
 *   · `legacyNoOption` — a trace row joined AND `chosenGid === -1`: no EXECUTABLE option, so
 *                        the seam left the legacy target in place (the sub-class of LEGACY the
 *                        ruling asks to be stored separately).
 *   · `substituted`    — a trace row joined, `chosenGid >= 0` AND `chosenGid !== legacyGid`:
 *                        the perceived pricer REPLACED the target.
 *   · `untraced`       — NO trace row for (decision tick, passerGid). COUNTED, never imputed:
 *                        the cutback keeps its own machinery, the keeper is excluded from the
 *                        perceived chooser, a forced target is a different branch, and a pass
 *                        whose decision did not run the EDS block at all (the kickoff
 *                        play-back, the through ball) has no row by construction. */
const PATHS = ['legacyChosen', 'legacyNoOption', 'substituted', 'untraced'] as const;
type PathClass = (typeof PATHS)[number];
const PTI = (c: PathClass): number => PATHS.indexOf(c);
const pathClassOf = (
  traced: boolean, chosenGid: number, legacyGid: number,
): PathClass => (!traced ? 'untraced'
  : chosenGid === -1 ? 'legacyNoOption'
    : chosenGid === legacyGid ? 'legacyChosen' : 'substituted');
/** the LEGACY class of the ruling = both legacy sub-classes; TRACED = everything but untraced */
const LEGACY_PATHS: readonly PathClass[] = ['legacyChosen', 'legacyNoOption'];
const TRACED_PATHS: readonly PathClass[] = ['legacyChosen', 'legacyNoOption', 'substituted'];

/** ⭐⭐ LN-C2's CROSS CELL: choice-tick class × path class, flattened.
 *  `k = CCI(choiceClass) * PATHS.length + PTI(pathClass)` — every path face is therefore
 *  readable inside a choice class OR pooled over the established classes, with no second copy
 *  of any count. */
const CP_CELLS = CHOICE_CLASSES.length * PATHS.length;
const CPK = (c: ChoiceClass, pth: PathClass): number => CCI(c) * PATHS.length + PTI(pth);
const cpIdx = (
  classes: readonly ChoiceClass[], paths: readonly PathClass[],
): number[] => classes.flatMap((c) => paths.map((pth) => CPK(c, pth)));

/* ==========================================================================
   ⭐⭐⭐ LN-C3's OWN LAYER — THE STRIKE SITE AND THE FAMILY, OFF THE ENGINE'S
   OWN RECORDS. ⛔ NOTHING BELOW IS INFERRED FROM GEOMETRY OR FROM TIMING.
   ========================================================================== */
/** ⭐⭐ THE STRIKE SITE of a measured ground pass — WHICH `src/**` call struck it, decided by
 *  the ENGINE'S OWN RECORDS ONLY:
 *   · `arm`            — a TRACKED wind-up record (`pendingPassWindup`) resolved into this
 *                        strike: the Pass branch's `match.armPendingPass(...)` (anchored).
 *   · `ledSynchronous` — no wind-up record, and the engine's OWN `match.dxStrikeAim` deposit
 *                        names THIS body at THIS tick: the Pass branch's
 *                        `match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX,
 *                        bestLeadY))` (anchored).
 *   · `toFeetSynchronous` — no wind-up record, no lead deposit: the Pass branch's bare
 *                        `match.performPass(p, passMate!, offsideExemptKick)` (anchored).
 *   · `cutback`        — PT-C0's flight kind is `cutback` ⇒ `match.performCutback` (anchored):
 *                        the ONLY site that increments the engine's own `cutbacks` stat.
 *   · `throughBall`    — PT-C0's flight kind is `throughBall` ⇒ `match.performThroughBall`
 *                        (anchored): the ONLY site that increments `throughBalls`.
 *   · `kickoffPlayback`— the ENGINE'S OWN RESTART STATE `match.kickoffKickGid`, READ BEFORE
 *                        THE TICK IS STEPPED, equals this passer's gid: the pre-ladder branch's
 *                        bare `match.performPass(p, back)` (anchored). The branch clears the
 *                        state in its own first statement, so the state is TRUE for exactly the
 *                        tick this strike happens on. ⛔ NEVER geometry, NEVER a timing rule. */
const SITES = ['arm', 'ledSynchronous', 'toFeetSynchronous', 'cutback', 'throughBall',
  'kickoffPlayback'] as const;
type StrikeSite = (typeof SITES)[number];
const STI = (x: StrikeSite): number => SITES.indexOf(x);
const strikeSiteOf = (
  klass: Klass, hasArmRecord: boolean, hasLeadDeposit: boolean, kickoffTakerHere: boolean,
): StrikeSite => {
  if (klass === 'cutback') return 'cutback';
  if (klass === 'throughBall') return 'throughBall';
  if (kickoffTakerHere) return 'kickoffPlayback';
  if (hasArmRecord) return 'arm';
  return hasLeadDeposit ? 'ledSynchronous' : 'toFeetSynchronous';
};

/** ⭐⭐⭐ THE FAMILY — FROZEN at §P as a DETERMINISTIC FUNCTION of four RECORD FIELDS: the
 *  flight KIND (PT-C0's own `klassOf`), the passer's ROLE (`Player.role`), the STRIKE SITE
 *  (above) and LN-C2's LEDGER PATH CLASS. #392 item 5(ii)'s set, in its own order.
 *
 *  ⭐⭐ THE RULE IS BY (KIND, SITE) FIRST, and the ledger class is published BESIDE as a
 *  RECEIPT (`familyByPath`). THE ANCHOR FOR THAT ORDER: the EDS block that writes the ledger
 *  row is gated on `match.edsPerceivedChoice && top.action === 'Pass' && top !== cutbackCand
 *  && p.role !== 'GK' && bestMate !== null` (ANCHORED at §3) — so a THROUGH BALL (a different
 *  `top.action`, anchored), a CUTBACK (excluded by IDENTITY, anchored), a KEEPER's pass and
 *  the KICKOFF PLAY-BACK (a pre-ladder branch that returns before the ladder runs, anchored)
 *  can NEVER carry a row. ⚠ The census does not ASSUME this: `familyByPath` counts the ledger
 *  class of every family's passes and `gFamilyPartition` asserts the untraced families hold
 *  exactly the untraced passes. If the walk ever disagreed with the code, the RECEIPT would
 *  say so and the family would still be the (kind, site) one.
 *
 *  ⛔ `OTHER` is COUNTED, never pooled silently: every (kind, role, site) combination that
 *  lands in it is itemised in its own stored bin. */
const FAMILIES = ['LEGACY-outfield', 'SUBSTITUTED', 'KEEPER-pass', 'THROUGH-BALL', 'CUTBACK',
  'KICKOFF-PLAYBACK', 'OTHER'] as const;
type Family = (typeof FAMILIES)[number];
const FMI = (f: Family): number => FAMILIES.indexOf(f);
/** the families with NO ledger row by construction — the UNTRACED half, PARTITIONED. */
const UNTRACED_FAMILIES: readonly Family[] = ['KEEPER-pass', 'THROUGH-BALL', 'CUTBACK',
  'KICKOFF-PLAYBACK', 'OTHER'];
const TRACED_FAMILIES: readonly Family[] = ['LEGACY-outfield', 'SUBSTITUTED'];
const familyOf = (
  site: StrikeSite, isKeeper: boolean, pathClass: PathClass,
): Family => {
  if (site === 'kickoffPlayback') return 'KICKOFF-PLAYBACK';
  if (site === 'throughBall') return 'THROUGH-BALL';
  if (site === 'cutback') return 'CUTBACK';
  if (isKeeper) return 'KEEPER-pass';
  if (pathClass === 'legacyChosen' || pathClass === 'legacyNoOption') return 'LEGACY-outfield';
  if (pathClass === 'substituted') return 'SUBSTITUTED';
  return 'OTHER';
};
/** ⭐ the `OTHER` bin's own itemisation key — (kind, role, site, path), never pooled. */
const OTHER_KINDS = ['shortPass', 'throughBall', 'cutback'] as const;
const OKI = (k: Klass): number => (OTHER_KINDS as readonly string[]).indexOf(k as string);
const OTHER_CELLS = OTHER_KINDS.length * 2 * SITES.length * PATHS.length;
const OTHER_KEY = (k: Klass, isKeeper: boolean, site: StrikeSite, pth: PathClass): number =>
  ((OKI(k) * 2 + (isKeeper ? 1 : 0)) * SITES.length + STI(site)) * PATHS.length + PTI(pth);
const OTHER_LABEL = (idx: number): string => {
  const pth = PATHS[idx % PATHS.length];
  const rest = Math.floor(idx / PATHS.length);
  const site = SITES[rest % SITES.length];
  const rest2 = Math.floor(rest / SITES.length);
  const role = rest2 % 2 === 1 ? 'GK' : 'outfield';
  const kind = OTHER_KINDS[Math.floor(rest2 / 2)];
  return `kind=${kind} · role=${role} · site=${site} · ledger=${pth}`;
};

/** ⭐⭐ THE SUBSTITUTION'S DIRECTION — did the perceived chooser move the ball INTO a lane with
 *  one of ours in it, or OUT OF one? Read on the STRUCK lane's own-openness against the LANE
 *  ARGMAX'S OWN candidate's (a DECLARED reconstruction: the argmax's aim is NOT recorded, so
 *  the legacy lane is `passer.pos → legacyGid's body position at the choice`). */
const SUB_DIRS = ['into', 'outOf', 'neither', 'noLegacyLane'] as const;
type SubDir = (typeof SUB_DIRS)[number];
const SDI = (d: SubDir): number => SUB_DIRS.indexOf(d);
const subDirOf = (
  struckOwnOpen: number, legacyOwnOpen: number, gate: number,
): SubDir => {
  if (!Number.isFinite(legacyOwnOpen) || !Number.isFinite(struckOwnOpen)) return 'noLegacyLane';
  const struckBlocked = struckOwnOpen < gate;
  const legacyBlocked = legacyOwnOpen < gate;
  return struckBlocked && !legacyBlocked ? 'into'
    : !struckBlocked && legacyBlocked ? 'outOf' : 'neither';
};

/** ⭐⭐ THE SHELL, CALLED — `groundShellHazard` is the SHIPPED function, handed the SAME body
 *  collections the pricer hands it (`[team.players, opp.players]`), the SAME kicker gid and the
 *  SAME receiver gid. ⛔ Never re-implemented. The own-only and opponent-only calls are the
 *  same shipped function on a NARROWED population, so the doc can say WHOSE body fired it. */
const shellOf = (
  from: Readonly<{ x: number; y: number }>, aimX: number, aimY: number,
  own: readonly Player[], opp: readonly Player[], kickerGid: number, receiverGid: number,
): { both: number; ownOnly: number; oppOnly: number } => ({
  both: groundShellHazard(from, { x: aimX, y: aimY }, [own, opp], kickerGid, receiverGid),
  ownOnly: groundShellHazard(from, { x: aimX, y: aimY }, [own], kickerGid, receiverGid),
  oppOnly: groundShellHazard(from, { x: aimX, y: aimY }, [opp], kickerGid, receiverGid),
});

/** ⭐⭐ THE CHOICE READ — a DECLARED RECONSTRUCTION built ONLY from the SHIPPED `laneOpenness`
 *  and the SHIPPED `groundShellHazard`, both CALLED (never re-implemented) at the passer's OWN
 *  position at the choice tick, toward the AIM OF RECORD:
 *   · `oppOpen` = `laneOpenness(passer.pos, aim, opp.players)` — WHAT THE GRADED LANE TEST SAW:
 *     the SAME population predicate the chooser's own call uses (the whole opponent `players`
 *     array, keeper INCLUDED; `sentOff` is skipped INSIDE the shipped function).
 *   · `ownOpen` = the same function with the OWN population — own OUTFIELD bodies minus the
 *     passer minus the target. THE CENSUS'S OWN DECLARED POPULATION (LN-C1's, inherited).
 *   · `shell` / `shellOwnOnly` / `shellOppOnly` = `groundShellHazard` CALLED on the STRUCK lane
 *     with `[team.players, opp.players]` / `[team.players]` / `[opp.players]`, kicker and
 *     receiver excluded by the shipped function itself. ⭐ THE SHIPPED PRICE, at the shipped
 *     shell (`coreRadius + BALL_RADIUS`).
 *   · `shellLegacy` / `legacyOwnOpen` / `legacyOppOpen` = the same two reads on the LANE
 *     ARGMAX'S OWN candidate's lane (`passer.pos → legacyGid's body position at the choice`) —
 *     a DECLARED RECONSTRUCTION, because the argmax's own aim is NOT recorded anywhere.
 *   · `occ` / `occTight` = LN-C0's 4 m corridor membership (BN-C0's test), the SECOND
 *     membership face for the same bodies, at the CHOICE tick's geometry.
 *   · THE MENU (a declared reconstruction, ⛔ NOT the chooser's score): for every OTHER own
 *     outfield mate, the own- and opponent-openness of `passer.pos → mate.pos` (own population
 *     = own outfield minus passer minus THAT mate). `alt` = an alternative exists with
 *     own-openness ≥ GATE_040 AND opponent-openness ≥ the chosen lane's opponent-openness.
 *     THE BEST such alternative is the one with the HIGHEST opponent-openness (ties resolved
 *     by the earlier player index — a frozen, stated tie-break), and only its forward-gain
 *     SIGN is published. */
interface ChoiceRead {
  ownOpen: number; oppOpen: number; occ: boolean; occTight: boolean;
  /** ⭐⭐⭐ LN-T1′ G1: the CHOOSER'S OWN forward-gain form (`PlayerBrain.ts` l.641, ANCHORED),
   *  CALLED on the AIM OF RECORD with the passer's `localX` AT THE CHOICE. */
  gain: number;
  alt: boolean; altGainSign: number; mates: number; altCount: number;
  /** ⭐⭐ LN-C2's own additions — 0/1 from the SHIPPED `groundShellHazard`, NaN with no lane. */
  shell: number; shellOwnOnly: number; shellOppOnly: number;
  /** the LANE ARGMAX'S OWN candidate beside (NaN / −1 when there is no legacy body to read). */
  shellLegacy: number; legacyOwnOpen: number; legacyOppOpen: number;
}
const EMPTY_CHOICE: ChoiceRead = {
  ownOpen: Number.NaN, oppOpen: Number.NaN, occ: false, occTight: false, gain: Number.NaN,
  alt: false, altGainSign: 0, mates: 0, altCount: 0,
  shell: Number.NaN, shellOwnOnly: Number.NaN, shellOppOnly: Number.NaN,
  shellLegacy: Number.NaN, legacyOwnOpen: Number.NaN, legacyOppOpen: Number.NaN,
};
const choiceReadOf = (
  m: Match, passer: Player, targetGid: number, eX: number, eY: number,
  legacyGid: number | null,
): ChoiceRead => {
  const side = passer.side as Side;
  const ownAll = m.teams[side].players;
  const oppPlayers = m.teams[1 - side].players;
  const aim = { x: eX, y: eY };
  const outfield = ownAll.filter((q) => q.role !== 'GK' && !q.sentOff && q.gid !== passer.gid);
  const ownPop = outfield.filter((q) => q.gid !== targetGid);
  const ownOpen = laneOpenness(passer.pos, aim, ownPop);
  const oppOpen = laneOpenness(passer.pos, aim, oppPlayers);
  /* ⭐⭐ THE SHELL ON THE STRUCK LANE — the shipped function, the pricer's own populations. */
  const sh = shellOf(passer.pos, eX, eY, ownAll, oppPlayers, passer.gid, targetGid);
  /* ⭐ THE LANE ARGMAX'S OWN CANDIDATE beside — a DECLARED reconstruction of its lane. */
  const legacyBody = legacyGid === null ? undefined
    : m.allPlayers.find((q) => q.gid === legacyGid);
  let shellLegacy = Number.NaN;
  let legacyOwnOpen = Number.NaN;
  let legacyOppOpen = Number.NaN;
  if (legacyBody !== undefined && legacyBody.gid !== passer.gid
    && Math.hypot(legacyBody.pos.x - passer.pos.x, legacyBody.pos.y - passer.pos.y) > 1e-6) {
    const lPop = outfield.filter((q) => q.gid !== legacyBody.gid);
    legacyOwnOpen = laneOpenness(passer.pos, legacyBody.pos, lPop);
    legacyOppOpen = laneOpenness(passer.pos, legacyBody.pos, oppPlayers);
    shellLegacy = groundShellHazard(
      passer.pos, legacyBody.pos, [ownAll, oppPlayers], passer.gid, legacyBody.gid,
    );
  }
  let occ = false; let occTight = false;
  for (const q of ownPop) {
    if (inCorridorOf(passer.pos.x, passer.pos.y, eX, eY, q.pos.x, q.pos.y, DV_CORRIDOR_SCALE)) {
      occ = true;
    }
    if (inCorridorOf(passer.pos.x, passer.pos.y, eX, eY, q.pos.x, q.pos.y, CONTROL_RADIUS)) {
      occTight = true;
    }
  }
  let alt = false; let altCount = 0; let bestOpp = Number.NEGATIVE_INFINITY; let bestGain = 0;
  let mates = 0;
  const localXPasser = m.teams[side].localX(passer.pos.x);
  for (const mate of ownPop) {
    mates += 1;
    const altOwnPop = outfield.filter((q) => q.gid !== mate.gid);
    const aOwn = laneOpenness(passer.pos, mate.pos, altOwnPop);
    const aOpp = laneOpenness(passer.pos, mate.pos, oppPlayers);
    if (aOwn >= GATE_040 && aOpp >= oppOpen) {
      alt = true; altCount += 1;
      if (aOpp > bestOpp) {
        bestOpp = aOpp;
        bestGain = m.teams[side].localX(mate.pos.x) - localXPasser;
      }
    }
  }
  /* ⭐⭐⭐ LN-T1′ G1 — THE CHOOSER'S OWN GAIN FORM, CALLED on the aim of record. */
  const gain = clamp01((m.teams[side].localX(aim.x) - localXPasser + 30) / 60) * 2 - 1;
  return { ownOpen, oppOpen, occ, occTight, gain, alt, altGainSign: alt ? Math.sign(bestGain) : 0,
    mates, altCount,
    shell: sh.both, shellOwnOnly: sh.ownOnly, shellOppOnly: sh.oppOnly,
    shellLegacy, legacyOwnOpen, legacyOppOpen };
};

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
const D0: StatDelta = {
  shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0,
};
/* PT-C0's population ladder */
fx('klassOf.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klassOf.throughBall', klassOf({ ...D0, passes: 1, throughBalls: 1 }, false), 'throughBall');
fx('klassOf.cutback', klassOf({ ...D0, passes: 1, cutbacks: 1 }, false), 'cutback');
fx('klassOf.crossIsNotMeasured', klassOf({ ...D0, passes: 1, crosses: 1 }, false), 'cross');
fx('klassOf.shotWins', klassOf({ ...D0, passes: 1, shots: 1 }, false), 'shot');
fx('klassOf.nothingIsNull', klassOf({ ...D0 }, false), null);
fx('population.shortPassGroundWithTarget', isMeasurableGroundPass('shortPass', true, true), true);
fx('population.noTargetIsOut', isMeasurableGroundPass('shortPass', true, false), false);
fx('population.airborneIsOut', isMeasurableGroundPass('shortPass', false, true), false);
fx('population.crossIsOut', isMeasurableGroundPass('cross', true, true), false);
fx('groundLaunch.groundedIsGround', isGroundLaunch(true, 5), true);
fx('groundLaunch.risingIsNot', isGroundLaunch(false, 5), false);
fx('groundLaunch.fallingIsGround', isGroundLaunch(false, -1), true);
fx('delivery.shotIsNotADelivery', isDelivery('shot'), false);
fx('firstBody.target', contactClassOf(7, 7, 0, 0), 'ownTarget');
fx('firstBody.ownNonTarget', contactClassOf(5, 7, 0, 0), 'ownNonTarget');
fx('firstBody.opponent', contactClassOf(9, 7, 1, 0), 'opponent');
fx('firstBody.none', contactClassOf(null, 7, null, 0), 'none');
/* ⭐⭐ THE CORRIDOR TEST — BN-C0's, on constructed geometry */
fx('corridor.onTheLineIsInside', inCorridorOf(0, 0, 20, 0, 10, 0, DV_CORRIDOR_SCALE), true);
fx('corridor.threeMetresOffIsInside', inCorridorOf(0, 0, 20, 0, 10, 3, DV_CORRIDOR_SCALE), true);
fx('corridor.fourMetresOffIsOutside', inCorridorOf(0, 0, 20, 0, 10, 4, DV_CORRIDOR_SCALE), false);
fx('corridor.beyondTheAimIsClamped', inCorridorOf(0, 0, 20, 0, 30, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.atThePassersFeetIsExcluded', inCorridorOf(0, 0, 20, 0, 1, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.clearGuardIsTheEngineConstant',
  inCorridorOf(0, 0, 20, 0, DV_CLEAR_RADIUS + 0.01, 0, DV_CORRIDOR_SCALE), true);
fx('corridor.clearGuardExcludesInsideIt',
  inCorridorOf(0, 0, 20, 0, DV_CLEAR_RADIUS - 0.01, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.tightVariantExcludesThreeMetres',
  inCorridorOf(0, 0, 20, 0, 10, 3, CONTROL_RADIUS), false);
fx('corridor.tightVariantKeepsTheLine', inCorridorOf(0, 0, 20, 0, 10, 0, CONTROL_RADIUS), true);
fx('corridor.centreLineDistance', near(centreLineDistOf(0, 0, 20, 0, 10, 3), 3), true);
/* ⭐⭐ THE SPOT-IN-LANE TEST is THE SAME MEMBERSHIP TEST, applied to a SPOT */
fx('spotInLane.spotOnTheLineIsInside', inCorridorOf(0, 0, 20, 0, 12, 1, DV_CORRIDOR_SCALE), true);
fx('spotInLane.spotFiveMetresOffIsOutside',
  inCorridorOf(0, 0, 20, 0, 12, 5, DV_CORRIDOR_SCALE), false);
/* ⭐⭐ gLedgerRead — THE DESIGNATION FOLLOWS THE TEAM'S OWN SET, AND NOTHING ELSE */
const setsFx = (runners: number[], arriver: number | null, overlapper: number | null,
  chasers: number[]): DesigSets => ({
  runners: new Set(runners), arriver, overlapper, chasers: new Set(chasers),
});
fx('ledger.noneWhenEverySetIsEmpty', designationOf(2, setsFx([], null, null, [])), 'none');
fx('ledger.runnerWhenTheSetSaysSo', designationOf(2, setsFx([2], null, null, [])), 'runner');
fx('ledger.editingTheSetMovesTheClassIn', designationOf(2, setsFx([2], null, null, [])), 'runner');
fx('ledger.editingTheSetMovesTheClassOut', designationOf(2, setsFx([3], null, null, [])), 'none');
fx('ledger.arriver', designationOf(4, setsFx([], 4, null, [])), 'arriver');
fx('ledger.overlapper', designationOf(5, setsFx([], null, 5, [])), 'overlapper');
fx('ledger.chaser', designationOf(1, setsFx([], null, null, [1])), 'chaser');
fx('ledger.runnerBeatsArriver', designationOf(2, setsFx([2], 2, null, [])), 'runner');
fx('ledger.arriverBeatsOverlapper', designationOf(2, setsFx([], 2, 2, [])), 'arriver');
fx('ledger.overlapperBeatsChaser', designationOf(2, setsFx([], null, 2, [2])), 'overlapper');
fx('ledger.chaserIsNotDesignatedForL1', isDesignated('chaser'), false);
fx('ledger.runnerIsDesignated', isDesignated('runner'), true);
fx('ledger.arriverIsDesignated', isDesignated('arriver'), true);
fx('ledger.overlapperIsDesignated', isDesignated('overlapper'), true);
fx('ledger.noneIsNotDesignated', isDesignated('none'), false);
/* ⭐⭐ THE OCCUPANT CAUSE PRECEDENCE on constructed occupants */
const CU = (d: Designation, a: string, s: boolean): CauseInput =>
  ({ designation: d, action: a, spotInLane: s });
fx('cause.L1.runnerWhateverHisAction', causeOf(CU('runner', 'MakeRun', false)), 'L1');
fx('cause.L1.runnerEvenWhileSupporting', causeOf(CU('runner', 'SupportBallCarrier', false)), 'L1');
fx('cause.L1.runnerEvenWhileShapeKeeping',
  causeOf(CU('runner', 'MoveToFormationSpot', true)), 'L1');
fx('cause.L1.arriver', causeOf(CU('arriver', 'MakeRun', false)), 'L1');
fx('cause.L1.overlapper', causeOf(CU('overlapper', 'MakeRun', false)), 'L1');
fx('cause.L2.undesignatedSupport', causeOf(CU('none', 'SupportBallCarrier', false)), 'L2');
fx('cause.L2.chaserSupportIsStillL2', causeOf(CU('chaser', 'SupportBallCarrier', false)), 'L2');
fx('cause.L3a.spotInLane', causeOf(CU('none', 'MoveToFormationSpot', true)), 'L3a');
fx('cause.L3b.spotOutside', causeOf(CU('none', 'MoveToFormationSpot', false)), 'L3b');
fx('cause.L4.chaseBall', causeOf(CU('none', 'ChaseBall', false)), 'L4');
fx('cause.L4.receivePass', causeOf(CU('none', 'ReceivePass', true)), 'L4');
fx('cause.L4.interceptPass', causeOf(CU('none', 'InterceptPass', false)), 'L4');
fx('cause.L4.markOpponent', causeOf(CU('none', 'MarkOpponent', false)), 'L4');
fx('cause.L4.dribble', causeOf(CU('none', 'Dribble', false)), 'L4');
fx('cause.L4.makeRunWithoutALicenceIsOther', causeOf(CU('none', 'MakeRun', false)), 'L4');
/* ⭐⭐ THE PAIR CLASSES on constructed pairs */
const PU = (dA: Designation, dB: Designation, aA: string, aB: string,
  w: boolean): PairInput => ({ dA, dB, aA, aB, spotsWithin: w });
fx('pair.P1.bothShapeSpotsWithin',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', true)), 'P1');
fx('pair.P4.bothShapeSpotsApart',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', false)), 'P4');
fx('pair.P2.oneDesignated',
  pairClassOf(PU('runner', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', true)), 'P2');
fx('pair.P2.designationBeatsEverything',
  pairClassOf(PU('none', 'arriver', 'SupportBallCarrier', 'SupportBallCarrier', true)), 'P2');
fx('pair.P3.oneSupporterNoneDesignated',
  pairClassOf(PU('none', 'none', 'SupportBallCarrier', 'ChaseBall', false)), 'P3');
fx('pair.P3.bothSupporters',
  pairClassOf(PU('chaser', 'none', 'SupportBallCarrier', 'SupportBallCarrier', true)), 'P3');
fx('pair.P5.other', pairClassOf(PU('none', 'none', 'ChaseBall', 'MarkOpponent', true)), 'P5');
fx('pair.P5.mixedShapeAndOther',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'ChaseBall', true)), 'P5');
/* ⭐ the five pair classes are DISJOINT BY CONSTRUCTION — the precedence does no work */
fx('pair.disjoint.P1CannotAlsoBeP3',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', true)) === 'P1'
  && !['SupportBallCarrier'].includes('MoveToFormationSpot'), true);
/* ⭐⭐ THE PRESENT / ARRIVED SPLIT */
fx('presence.present', presenceOf(true, true), 'present');
fx('presence.arrived', presenceOf(true, false), 'arrived');
fx('presence.noWindup', presenceOf(false, false), 'noWindup');
fx('presence.noWindupBeatsInLane', presenceOf(false, true), 'noWindup');
/* ⭐⭐ PT-C0's CROWD LIMBS */
fx('spacing.nearestOfThree', near(nearestMateOf([0, 3, 10], [0, 4, 0], 0), 5), true);
fx('spacing.symmetric',
  near(nearestMateOf([0, 3], [0, 4], 0), nearestMateOf([0, 3], [0, 4], 1)), true);
fx('spacing.singletonIsInfinite', !Number.isFinite(nearestMateOf([1], [1], 0)), true);
fx('dupRun.countsEachPairOnce', dupRunPairsOf([0, 1, 2], [0, 0, 0]), 3);
fx('dupRun.boundaryIsStrict', dupRunPairsOf([0, DUP_RUN_M], [0, 0]), 0);
fx('minPairwise.picksSmallest', near(minPairwiseOf([0, 3, 12], [0, 4, 0]), 5), true);
fx('minPairwise.singleton', !Number.isFinite(minPairwiseOf([1], [1])), true);
fx('crowd.altAgreesOnPairs', dupRunPairsAltOf([0, 1, 2, 9], [0, 0, 0, 0]),
  dupRunPairsOf([0, 1, 2, 9], [0, 0, 0, 0]));
fx('crowd.altAgreesOnCrash', crashAltOf([0, 1, 9], [0, 0, 0]),
  minPairwiseOf([0, 1, 9], [0, 0, 0]) < DUP_RUN_M);
fx('crowd.altAgreesOnNoCrash', crashAltOf([0, 9], [0, 0]),
  minPairwiseOf([0, 9], [0, 0]) < DUP_RUN_M);
/* the bin helpers */
fx('binOf.first', binOf(0.4, 2, 13), 0);
fx('binOf.overflow', binOf(999, 2, 13), 12);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 13), 6);
fx('signedBinOf.underflow', signedBinOf(-999, 1, 13), 0);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1, false), 2);
fx('binMedian.signed', binMedian([1, 1, 8, 1, 1], 0.5, true), 0);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1, false)), true);
/* the action vocabulary is the union's own */
fx('actions.vocabularyIsTheUnions', ACTIONS.length, 23);
fx('actions.firstIsTheDefault', ACTIONS[0], 'MoveToFormationSpot');
fx('actions.unknownCellIsLast', AI('NotAnAction'), ACTIONS.length);

/* ⭐⭐ gWalkFixtures — LN-C1's OWN: the SHIPPED `laneOpenness` CALLED on hand-built geometries
   with the census's OWN population, so the reconstruction's population rule is PINNED and not
   merely described (canon: a headline-bearing walk-side predicate needs a composition fixture). */
const fxBody = (gid: number, x: number, y: number, extra: Record<string, unknown> = {}):
  Player => ({ gid, pos: { x, y }, sentOff: false, role: 'MF',
    coreRadius: PLAYER_CORE_RADIUS, ...extra } as unknown as Player);
const LANE_FROM = { x: 0, y: 0 };
const LANE_TO = { x: 20, y: 0 };
fx('ownOpenness.emptyLaneIsOne', laneOpenness(LANE_FROM, LANE_TO, []), 1);
fx('ownOpenness.bodyOnTheSegmentIsZero',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 0)]), 0);
fx('ownOpenness.bodyFourMetresOffIsOpen',
  near(laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 4)]), 1), true);
fx('ownOpenness.bodyTwoMetresOffIsHalf',
  near(laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 2)]), 0.5), true);
fx('ownOpenness.bodyInsideTheClearRadiusIsIgnored',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, DV_CLEAR_RADIUS - 0.01, 0)]), 1);
fx('ownOpenness.bodyJustOutsideTheClearRadiusCounts',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, DV_CLEAR_RADIUS + 0.01, 0)]), 0);
fx('ownOpenness.sentOffIsSkippedByTheShippedFunction',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 0, { sentOff: true })]), 1);
fx('ownOpenness.theWorstBodyWins',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 3), fxBody(2, 12, 1)]), 0.25);
fx('ownOpenness.beyondTheAimIsClampedToTheEnd — the closest point is the AIM, ten metres away',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 30, 0)]), 1);
/* the POPULATION rule itself — the passer and the target are excluded BEFORE the call */
{
  const passer = fxBody(7, 0, 0);
  const target = fxBody(8, 20, 0);
  const mate = fxBody(9, 10, 0);
  const pop = [passer, target, mate].filter((q) => q.gid !== 7 && q.gid !== 8);
  fx('ownOpenness.populationExcludesPasserAndTarget', pop.map((q) => q.gid), [9]);
  fx('ownOpenness.populationOfOneBlockedMateIsZero', laneOpenness(LANE_FROM, LANE_TO, pop), 0);
  const empty = [passer, target].filter((q) => q.gid !== 7 && q.gid !== 8);
  fx('ownOpenness.withOnlyPasserAndTargetTheLaneIsWideOpen',
    laneOpenness(LANE_FROM, LANE_TO, empty), 1);
}
/* the CHOICE-TICK class rule and the carom presence rule */
fx('choiceClass.withAnArmRecordIsArm', choiceClassOf(true), 'arm');
fx('choiceClass.withoutOneIsRelease', choiceClassOf(false), 'release');
fx('caromPresence.notAnOccupant', caromPresenceOf(false, null), 'notInReleaseCorridor');
fx('caromPresence.presentAtArm', caromPresenceOf(true, 'present'), 'presentAtChoice');
fx('caromPresence.arrivedAfterArm', caromPresenceOf(true, 'arrived'), 'arrivedAfterChoice');
fx('caromPresence.releaseClassIsPresentByConstruction',
  caromPresenceOf(true, 'noWindup'), 'presentAtChoice');
/* the binning helpers on the openness grid, and the two ANCHORED gate edges */
fx('openBins.zeroIsTheFirstCell', binOf(0, OPEN_BIN_W, OPEN_BINS), 0);
fx('openBins.oneIsTheLastCell', binOf(1, OPEN_BIN_W, OPEN_BINS), OPEN_BINS - 1);
fx('openBins.pointThreeNine', binOf(0.39, OPEN_BIN_W, OPEN_BINS), 3);
fx('gates.the040EdgeIsTheChoosersOwn', GATE_040, 0.4);
fx('gates.the045EdgeIsTheChoosersOwn', GATE_045, 0.45);
fx('gainSign.backward', GSI(-1), 0);
fx('gainSign.level', GSI(0), 1);
fx('gainSign.forward', GSI(1), 2);
/* ⭐⭐ gShellFixtures — THE SHIPPED `groundShellHazard` CALLED on hand-built geometries, so the
   census's shell reading is PINNED and not merely described. SHELL = coreRadius + BALL_RADIUS,
   both read from the shipped constants (anchored at §3). */
const SHELL_M = PLAYER_CORE_RADIUS + BALL_RADIUS;
{
  const K = 7; const R = 8;      // the kicker's gid and the receiver's gid
  const own = (b: Player[]): readonly Player[][] => [b];
  fx('shell.emptyPitchDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, [], K, R), 0);
  fx('shell.bodyExactlyOnTheSegmentFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 10, 0)]), K, R), 1);
  fx('shell.bodyAShellWidthOffDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 10, SHELL_M)]), K, R), 0);
  fx('shell.bodyJustInsideTheShellFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 10, SHELL_M - 0.01)]), K, R), 1);
  fx('shell.theKickerNeverFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(K, 10, 0)]), K, R), 0);
  fx('shell.theReceiverNeverFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(R, 10, 0)]), K, R), 0);
  fx('shell.aBodyBEYONDTheAimDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 30, 0)]), K, R), 0);
  fx('shell.aBodyATTheAimDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 20, 0)]), K, R), 0);
  fx('shell.aBodyJustSHORTOfTheAimStillFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 20 - SHELL_M - 0.05, 0)]), K, R), 1);
  fx('shell.aBodyINSIDEAShellOfTheAimDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 20 - SHELL_M + 0.05, 0)]), K, R), 0);
  fx('shell.sentOffIsSkippedByTheShippedFunction',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 10, 0, { sentOff: true })]), K, R), 0);
  fx('shell.thereIsNO15mClearGuard — a body at the kicker\'s feet still fires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 0.5, 0)]), K, R), 1);
  /* ⭐⭐ OWN-ONLY vs OPPONENT-ONLY POPULATIONS — the calls the doc reads WHOSE body fired from */
  const ours = [fxBody(1, 10, 0)];
  const theirs = [fxBody(21, 15, 0)];
  fx('shell.bothPopulationsFireWhenOursIsOnTheLine',
    groundShellHazard(LANE_FROM, LANE_TO, [ours, theirs], K, R), 1);
  fx('shell.ownOnlyFiresOnOurOwnBody',
    groundShellHazard(LANE_FROM, LANE_TO, [ours], K, R), 1);
  fx('shell.oppOnlyIsClearWhenOnlyOursIsOnTheLine',
    groundShellHazard(LANE_FROM, LANE_TO, [[fxBody(1, 10, 0)].slice(0, 0)], K, R), 0);
  fx('shell.oppOnlyFiresOnTheirBody',
    groundShellHazard(LANE_FROM, LANE_TO, [theirs], K, R), 1);
  fx('shell.ownOnlyIsClearWhenOnlyTheirsIsOnTheLine',
    groundShellHazard(LANE_FROM, LANE_TO, [[fxBody(1, 10, 8)]], K, R), 0);
  fx('shell.theCombinedCallIsTheUnionOfTheTwo',
    groundShellHazard(LANE_FROM, LANE_TO, [[fxBody(1, 10, 8)], theirs], K, R),
    Math.max(groundShellHazard(LANE_FROM, LANE_TO, [[fxBody(1, 10, 8)]], K, R),
      groundShellHazard(LANE_FROM, LANE_TO, [theirs], K, R)));
  /* the shell's own constants are the shipped ones */
  fx('shell.constantsAreTheShippedOnes', [BALL_RADIUS, PLAYER_CORE_RADIUS > 0], [0.11, true]);
}
/* ⭐⭐ THE PATH CLASSES on constructed ledger rows */
fx('path.untracedWhenNoRow', pathClassOf(false, 5, 5), 'untraced');
fx('path.untracedEvenIfTheGidsWouldAgree', pathClassOf(false, -1, 3), 'untraced');
fx('path.legacyChosenWhenChosenEqualsLegacy', pathClassOf(true, 4, 4), 'legacyChosen');
fx('path.legacyNoOptionWhenChosenIsMinusOne', pathClassOf(true, -1, 4), 'legacyNoOption');
fx('path.substitutedWhenTheyDiffer', pathClassOf(true, 6, 4), 'substituted');
fx('path.legacyIsTheTwoSubClasses', LEGACY_PATHS.map((c) => PTI(c)), [0, 1]);
fx('path.tracedIsEverythingButUntraced', TRACED_PATHS.map((c) => PTI(c)), [0, 1, 2]);
/* ⭐⭐ THE SUBSTITUTION'S DIRECTION on constructed openness pairs (the 0.4 gate ANCHORED) */
fx('subDir.intoOurOwnBodysLane', subDirOf(0.1, 0.9, GATE_040), 'into');
fx('subDir.outOfOne', subDirOf(0.9, 0.1, GATE_040), 'outOf');
fx('subDir.neitherWhenBothClear', subDirOf(0.9, 0.9, GATE_040), 'neither');
fx('subDir.neitherWhenBothBlocked', subDirOf(0.1, 0.1, GATE_040), 'neither');
fx('subDir.gateIsExclusiveBelow', subDirOf(GATE_040, 0.1, GATE_040), 'outOf');
fx('subDir.noLegacyLaneWhenTheArgmaxsBodyIsUnreadable',
  subDirOf(0.1, Number.NaN, GATE_040), 'noLegacyLane');
const FIXTURES_OK = FIXTURES.every((f) => f.ok);


/* ========================================================================== */
/* §7 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed).
   ⚠ Every width/count below is a STORED BIN EDGE of a histogram — never a rule and never a
   threshold: no read word and no majority boolean depends on one.                            */
/* ========================================================================== */
const NEAR_BIN_M = 0.5; const NEAR_BINS = 61;        // PT-C0's own nearest-mate grid
const MINPAIR_BIN_M = 0.5; const MINPAIR_BINS = 61;  // PT-C0's own min-pairwise grid
const OCC_BINS = 7;                                   // own occupants per pass, last = overflow
const DCARR_BIN_M = 2; const DCARR_BINS = 16;         // occupant → carrier
const DCENT_BIN_M = 0.5; const DCENT_BINS = 12;       // occupant → corridor centre line
const DTGT_BIN_M = 5; const DTGT_BINS = 13;           // occupant → target
const VACROSS_BIN_MS = 1; const VACROSS_BINS = 13;    // signed, across the lane
const VALONG_BIN_MS = 1; const VALONG_BINS = 13;      // signed, along the lane
const PAIRMID_BIN_M = 2; const PAIRMID_BINS = 16;     // carrier → pair midpoint
const FLIGHT_RETIRE_TICKS = 720;                      // PT-C0's own retire cap, inherited

/* ========================================================================== */
/* §8 THE PER-SEED ROW                                                         */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals', 'shots',
  'clearances', 'crosses', 'cutbacks', 'throughBalls', 'longBalls', 'headersWon',
  'offsides'] as const;
type StatKey = (typeof STAT_KEYS)[number];

/** ⭐⭐⭐ LN-T1′b CHANGE (b) — ONE ITEMISED JOIN-DISAGREEMENT ROW. Every field is READ off the
 *  ENGINE'S OWN RECORDS — canon, VERBATIM: "an event attribution reads the engine's own record
 *  when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only
 *  where no record exists, and says so". ⛔ NOTHING here is inferred and NOTHING here changes a
 *  family: the family is assigned by (kind, site) FIRST, byte for byte as LN-C3 froze it.
 *  `seed` and `arm` are attached OUTSIDE this row when the list is published, so the list is
 *  a property of the WORLD and FLAG-HYGIENE compares it like every other field.
 *  THE LEDGER TUPLE is `[arms, evictions, struck, cancelledMate]` off `match.o1WindupLedger`
 *  (the O1 T2 in-engine wind-up ledger, #180.3(ii)), snapshotted per tick, READ ONLY. */
interface JoinDisagreement {
  kind: 'untracedFamilyWithLedgerRow' | 'tracedFamilyWithoutLedgerRow';
  strikeTick: number; passerGid: number; site: StrikeSite; choiceClass: ChoiceClass;
  family: Family; pathClass: PathClass;
  ledgerRowTick: number | null; chosenGid: number | null; legacyGid: number | null;
  ledgerAtStrikeTick: number[]; ledgerAtStrikeTickMinusOne: number[];
  ledgerAtRowTick: number[] | null; ledgerAtRowTickMinusOne: number[] | null;
  /** ⭐⭐ THE PREDICATE, STATED EX ANTE AT §P: a wind-up was ARMED and NOT STRUCK between the
   *  ledger row's tick and the strike tick —
   *  `arms@strikeTick − arms@rowTick > 0 && struck@strikeTick − struck@rowTick === 0`.
   *  FALSE when there is no ledger row tick (the other disagreement direction). */
  windupArmedNotStruckBeforeRestart: boolean;
}
interface Row {
  ticks: number; wallMs: number; armedVersion: number;
  worldOk: boolean; cushionOk: boolean; seamsAbsent: boolean; rcBfAbsent: boolean;
  genomeClean: boolean; ctbPlaneShut: boolean; emergentOn: boolean;
  snapshotLawAbsent: boolean; perceivedChoiceOn: boolean;
  /* --- POPULATION A: THE LANE --- */
  gpFlights: number; gpWithLine: number; gpWithArm: number; gpNoArm: number;
  occPerPassBins: number[];
  occN: number; occNTight: number; passesWithOcc: number; passesWithOccTight: number;
  eligibleBodies: number; spotInLaneAll: number; supportSpotInLaneAll: number;
  hasBallRecipeAgrees: number; armBodyMissing: number;
  causeN: number[]; causeSpotInLane: number[]; causeSupportSpotInLane: number[];
  causePresence: number[][]; caromHits: number[];
  occDesig: number[]; occAction: number[]; l4Action: number[];
  distCarrierBins: number[]; distCentreBins: number[]; distTargetBins: number[];
  vAcrossBins: number[]; vAlongBins: number[];
  firstBody: number[];
  oppN: number; oppPresence: number[]; oppNTight: number; oppPresenceTight: number[];
  passesWithOpp: number; passesWithOppTight: number; passesWithLiveDesignation: number;
  /* --- POPULATION B: THE CROWD (PT-C0's limbs) --- */
  crowdSampleTicks: number; crowdUnattributed: number; crowdSamples: number;
  spacingSum: number; spacingSamples: number; nearBins: number[];
  dupRunSum: number; minPairBins: number[]; crashHits: number;
  dupRunSumAlt: number; crashHitsAlt: number;
  pairsTotal: number; pairN: number[]; pairSpotsWithin: number;
  pairEitherSupport: number; pairEitherRunner: number; pairCarrierDistBins: number[];
  pairNoCarrier: number; ownedSamples: number;
  /* --- THE DESIGNATION LEDGER --- */
  runnersSampleSum: number; chasersSampleSum: number;
  arriverLiveSamples: number; overlapperLiveSamples: number;
  runnersDistinct: number; arriverDistinct: number; overlapperDistinct: number;
  chasersDistinct: number;
  /* --- ⭐⭐ LN-C1's OWN ADDITIONS: THE CHOICE TICK (never compared by G-REPRO-LNC2) --- */
  chClass: number[];
  chOwnOpenSum: number[]; chOppOpenSum: number[];
  chOwnOpenBins: number[][]; chOppOpenBins: number[][];
  chOwnBelow40: number[]; chOwnBelow45: number[];
  chOppBelow40: number[]; chOppBelow45: number[];
  chCorridorOcc: number[]; chCorridorOccTight: number[];
  chAlt: number[]; chAltCount: number[]; chAltGain: number[][]; chMates: number[];
  chFirstBody: number[][];
  chCaromByOwnBin: number[][]; chOppFirstByOppBin: number[][];
  chCarom: number[]; chCaromGeom: number[]; chCaromBlocked: number[];
  chCaromBlockedAlt: number[]; chCaromAlt: number[];
  chCaromPresence: number[][]; chOppBelow40First: number[]; chOppFirst: number[];
  /* --- ⭐⭐ LN-C2's OWN ADDITIONS: THE PATH, THE SHELL, THE LEDGER (indexed by the flat cell
     `k = CCI(choiceClass) * PATHS.length + PTI(pathClass)`) --- */
  cpPass: number[]; cpGeom: number[]; cpCarom: number[]; cpCaromGeom: number[];
  cpShellPass: number[]; cpShellCarom: number[]; cpShellOwn: number[]; cpShellOpp: number[];
  cpOwnOpenSum: number[]; cpOwnBelow40: number[];
  cpOwnBinShell: number[][]; cpCaromOwnBinShell: number[][]; cpFirstBody: number[][];
  cpSubDir: number[][]; cpShellLegacy: number[]; cpLegacyLane: number[]; cpLegacyBelow40: number[];
  cpCandidates: number[]; cpRead: number[]; cpSeenUnread: number[]; cpUnseen: number[];
  cpBlindRead: number[]; cpTargetAgrees: number[];
  cpAimRecord: number[]; cpAimFallback: number[];
  traceRowsWritten: number; traceOn: boolean;
  /** ⭐⭐ LN-C3: the join map's DUPLICATE-KEY COUNT (LN-C2 §CORR 7's debt, paid) — how many
   *  ledger rows landed on a (decision tick, passerGid) key ALREADY OCCUPIED. */
  traceDuplicateKeys: number;
  /* --- ⭐⭐⭐ LN-C3's OWN ADDITIONS: THE FAMILY (index `f = FMI(family)`) and the STRIKE SITE.
     Every family count lives in exactly ONE cell, so every published family face is a sum over
     a cell set and NO COUNT IS COPIED. --- */
  famPass: number[]; famCarom: number[]; famGeom: number[]; famCaromGeom: number[];
  famShellPass: number[]; famShellCarom: number[]; famShellOwn: number[]; famShellOpp: number[];
  famOwnOpenSum: number[]; famOwnBelow40: number[];
  famOwnBinShell: number[][]; famCaromOwnBinShell: number[][];
  famFirstBody: number[][]; famCaromPresence: number[][];
  famAimRecord: number[]; famAimFallback: number[];
  famChoiceClass: number[][]; famCaromByClass: number[][];
  famByPath: number[][]; famBySite: number[][];
  famKeeper: number[];
  siteCount: number[]; siteCarom: number[];
  otherCombos: number[];
  /* --- CONTEXT --- */
  goals: number; passes: number; passesCompleted: number; interceptions: number; shots: number;
  /* --- ⭐⭐⭐ LN-T1′'s OWN ADDITIONS --- */
  /** G6's source: the engine's own offside counter, both sides. */
  offsides: number;
  /** G1: measured ground passes whose STRUCK aim carried a readable gain, and of those, the
   *  ones whose gain is < 0 (the chooser's own form, CALLED). */
  gpGainReadable: number; gpBackward: number;
  /** a SECONDARY: the launch→aim distance of every measured ground pass with a line. */
  passDistSum: number;
  /** the ARM DEFINITION and its receipts — excluded from FLAG-HYGIENE by name. */
  lnFlag: boolean; lnWeightEff: number; lnWeightBase: number; lnWeightInfo: number;
  lnGeneOnInfoGenome: boolean;
  /** ⭐⭐⭐ LN-T1′b CHANGE (c) — G-ARM's READ-BACK **PER TEAM**, at CONSTRUCTION and at FULL
   *  TIME: the SHIPPED `lnOwnLaneWeightOf` CALLED on `effGenome`, `baseGenome` and
   *  `info.genome` of side 0 and side 1 SEPARATELY, plus the KEY's own presence on
   *  `info.genome`. Indexed `[side0, side1]`. ⚠ LN-T1′'s four `Math.max`-over-the-two-teams
   *  fields above are LEFT UNCHANGED so G-REPRO-LNT1P can compare them field for field; these
   *  eight are the STRONGER receipt #395 item 4(i)(c) asks for, and they are excluded from
   *  FLAG-HYGIENE BY NAME exactly as the four above are (they ARE the arm definition). */
  lnEffBySideAtConstruction: number[]; lnBaseBySideAtConstruction: number[];
  lnInfoBySideAtConstruction: number[]; lnInfoKeyBySideAtConstruction: boolean[];
  lnEffBySideAtFullTime: number[]; lnBaseBySideAtFullTime: number[];
  lnInfoBySideAtFullTime: number[]; lnInfoKeyBySideAtFullTime: boolean[];
  /** ⭐⭐⭐ LN-T1′b CHANGE (b) — THE JOIN DIAGNOSIS: the itemised rows (expected SHORT) and the
   *  two disagreement COUNTS the published faces are built from. */
  joinDisagreements: JoinDisagreement[];
  joinUntracedFamilyWithLedgerRow: number; joinTracedFamilyWithoutLedgerRow: number;
  /** the WHOLE-MATCH SIGNATURE at full time — rng stream state included. */
  signature: string;
}
const emptyRow = (): Row => ({
  ticks: 0, wallMs: 0, armedVersion: 0,
  worldOk: false, cushionOk: false, seamsAbsent: false, rcBfAbsent: false,
  genomeClean: false, ctbPlaneShut: false, emergentOn: false,
  snapshotLawAbsent: false, perceivedChoiceOn: false,
  gpFlights: 0, gpWithLine: 0, gpWithArm: 0, gpNoArm: 0,
  occPerPassBins: zeros(OCC_BINS),
  occN: 0, occNTight: 0, passesWithOcc: 0, passesWithOccTight: 0,
  eligibleBodies: 0, spotInLaneAll: 0, supportSpotInLaneAll: 0,
  hasBallRecipeAgrees: 0, armBodyMissing: 0,
  causeN: zeros(CAUSES.length), causeSpotInLane: zeros(CAUSES.length),
  causeSupportSpotInLane: zeros(CAUSES.length),
  causePresence: zeros2(CAUSES.length, PRESENCE.length), caromHits: zeros(CAUSES.length),
  occDesig: zeros(DESIGNATIONS.length), occAction: zeros(ACTION_CELLS.length),
  l4Action: zeros(ACTION_CELLS.length),
  distCarrierBins: zeros(DCARR_BINS), distCentreBins: zeros(DCENT_BINS),
  distTargetBins: zeros(DTGT_BINS),
  vAcrossBins: zeros(VACROSS_BINS), vAlongBins: zeros(VALONG_BINS),
  firstBody: zeros(CONTACTS.length),
  oppN: 0, oppPresence: zeros(PRESENCE.length), oppNTight: 0,
  oppPresenceTight: zeros(PRESENCE.length),
  passesWithOpp: 0, passesWithOppTight: 0, passesWithLiveDesignation: 0,
  crowdSampleTicks: 0, crowdUnattributed: 0, crowdSamples: 0,
  spacingSum: 0, spacingSamples: 0, nearBins: zeros(NEAR_BINS),
  dupRunSum: 0, minPairBins: zeros(MINPAIR_BINS), crashHits: 0,
  dupRunSumAlt: 0, crashHitsAlt: 0,
  pairsTotal: 0, pairN: zeros(PAIRS.length), pairSpotsWithin: 0,
  pairEitherSupport: 0, pairEitherRunner: 0, pairCarrierDistBins: zeros(PAIRMID_BINS),
  pairNoCarrier: 0, ownedSamples: 0,
  runnersSampleSum: 0, chasersSampleSum: 0, arriverLiveSamples: 0, overlapperLiveSamples: 0,
  runnersDistinct: 0, arriverDistinct: 0, overlapperDistinct: 0, chasersDistinct: 0,
  chClass: zeros(CHOICE_CLASSES.length),
  chOwnOpenSum: zeros(CHOICE_CLASSES.length), chOppOpenSum: zeros(CHOICE_CLASSES.length),
  chOwnOpenBins: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOppOpenBins: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOwnBelow40: zeros(CHOICE_CLASSES.length), chOwnBelow45: zeros(CHOICE_CLASSES.length),
  chOppBelow40: zeros(CHOICE_CLASSES.length), chOppBelow45: zeros(CHOICE_CLASSES.length),
  chCorridorOcc: zeros(CHOICE_CLASSES.length),
  chCorridorOccTight: zeros(CHOICE_CLASSES.length),
  chAlt: zeros(CHOICE_CLASSES.length), chAltCount: zeros(CHOICE_CLASSES.length),
  chAltGain: zeros2(CHOICE_CLASSES.length, GAIN_SIGNS.length),
  chMates: zeros(CHOICE_CLASSES.length),
  chFirstBody: zeros2(CHOICE_CLASSES.length, CONTACTS.length),
  chCaromByOwnBin: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOppFirstByOppBin: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chCarom: zeros(CHOICE_CLASSES.length), chCaromGeom: zeros(CHOICE_CLASSES.length),
  chCaromBlocked: zeros(CHOICE_CLASSES.length),
  chCaromBlockedAlt: zeros(CHOICE_CLASSES.length), chCaromAlt: zeros(CHOICE_CLASSES.length),
  chCaromPresence: zeros2(CHOICE_CLASSES.length, CAROM_PRESENCE.length),
  chOppBelow40First: zeros(CHOICE_CLASSES.length), chOppFirst: zeros(CHOICE_CLASSES.length),
  cpPass: zeros(CP_CELLS), cpGeom: zeros(CP_CELLS), cpCarom: zeros(CP_CELLS),
  cpCaromGeom: zeros(CP_CELLS),
  cpShellPass: zeros(CP_CELLS), cpShellCarom: zeros(CP_CELLS), cpShellOwn: zeros(CP_CELLS),
  cpShellOpp: zeros(CP_CELLS),
  cpOwnOpenSum: zeros(CP_CELLS), cpOwnBelow40: zeros(CP_CELLS),
  cpOwnBinShell: zeros2(CP_CELLS, OPEN_BINS * 2),
  cpCaromOwnBinShell: zeros2(CP_CELLS, OPEN_BINS * 2),
  cpFirstBody: zeros2(CP_CELLS, CONTACTS.length),
  cpSubDir: zeros2(CP_CELLS, SUB_DIRS.length), cpShellLegacy: zeros(CP_CELLS),
  cpLegacyLane: zeros(CP_CELLS), cpLegacyBelow40: zeros(CP_CELLS),
  cpCandidates: zeros(CP_CELLS), cpRead: zeros(CP_CELLS), cpSeenUnread: zeros(CP_CELLS),
  cpUnseen: zeros(CP_CELLS), cpBlindRead: zeros(CP_CELLS), cpTargetAgrees: zeros(CP_CELLS),
  cpAimRecord: zeros(CP_CELLS), cpAimFallback: zeros(CP_CELLS),
  traceRowsWritten: 0, traceOn: false, traceDuplicateKeys: 0,
  famPass: zeros(FAMILIES.length), famCarom: zeros(FAMILIES.length),
  famGeom: zeros(FAMILIES.length), famCaromGeom: zeros(FAMILIES.length),
  famShellPass: zeros(FAMILIES.length), famShellCarom: zeros(FAMILIES.length),
  famShellOwn: zeros(FAMILIES.length), famShellOpp: zeros(FAMILIES.length),
  famOwnOpenSum: zeros(FAMILIES.length), famOwnBelow40: zeros(FAMILIES.length),
  famOwnBinShell: zeros2(FAMILIES.length, OPEN_BINS * 2),
  famCaromOwnBinShell: zeros2(FAMILIES.length, OPEN_BINS * 2),
  famFirstBody: zeros2(FAMILIES.length, CONTACTS.length),
  famCaromPresence: zeros2(FAMILIES.length, CAROM_PRESENCE.length),
  famAimRecord: zeros(FAMILIES.length), famAimFallback: zeros(FAMILIES.length),
  famChoiceClass: zeros2(FAMILIES.length, CHOICE_CLASSES.length),
  famCaromByClass: zeros2(FAMILIES.length, CHOICE_CLASSES.length),
  famByPath: zeros2(FAMILIES.length, PATHS.length),
  famBySite: zeros2(FAMILIES.length, SITES.length),
  famKeeper: zeros(FAMILIES.length),
  siteCount: zeros(SITES.length), siteCarom: zeros(SITES.length),
  otherCombos: zeros(OTHER_CELLS),
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0, shots: 0,
  offsides: 0, gpGainReadable: 0, gpBackward: 0, passDistSum: 0,
  lnFlag: false, lnWeightEff: 0, lnWeightBase: 0, lnWeightInfo: 0,
  lnGeneOnInfoGenome: false,
  lnEffBySideAtConstruction: [0, 0], lnBaseBySideAtConstruction: [0, 0],
  lnInfoBySideAtConstruction: [0, 0], lnInfoKeyBySideAtConstruction: [false, false],
  lnEffBySideAtFullTime: [0, 0], lnBaseBySideAtFullTime: [0, 0],
  lnInfoBySideAtFullTime: [0, 0], lnInfoKeyBySideAtFullTime: [false, false],
  joinDisagreements: [],
  joinUntracedFamilyWithLedgerRow: 0, joinTracedFamilyWithoutLedgerRow: 0,
  signature: '',
});

/* ========================================================================== */
/* §9 THE WALK — public state per tick; NO WRAPPER                             */
/* ========================================================================== */
interface ArmBody { inWide: boolean; inTight: boolean; desig: Designation; action: string }
/** ⭐⭐ ONE ROW OF THE ENGINE'S OWN CHOICE LEDGER (`match.passChoiceTrace`), READ, never built. */
interface TraceRow {
  tick: number; passerGid: number; chosenGid: number; legacyGid: number;
  candidates: number; read: number; seenUnread: number; unseen: number;
  blindOutpricesRead: boolean;
}
interface Windup {
  key: string; gid: number; targetGid: number; eX: number; eY: number; carried: boolean;
  armTick: number; bodies: Map<number, ArmBody>;
  /** ⭐⭐ LN-C1: the CHOICE READ, taken AT THE ARM TICK — the choice tick for this class. */
  choice: ChoiceRead;
  /** ⭐⭐ LN-C2: the ledger row joined at THAT tick (the arm tick IS the decision tick). */
  trace: TraceRow | null;
}
interface Occ {
  gid: number; desig: Designation; action: string; spotInLane: boolean;
  supportSpotInLane: boolean; presence: Presence; cause: Cause;
  distCarrier: number; distCentre: number; distTarget: number;
  vAcross: number; vAlong: number; tight: boolean;
}
interface OppOcc { gid: number; presence: Presence; tight: boolean }
interface GpFlight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number;
  hasLine: boolean; contactSeen: boolean; firstBodyGid: number | null;
  firstBodyClass: ContactClass; occupants: Occ[]; oppOccupants: OppOcc[];
  occTight: number; oppTight: number; hasArm: boolean;
  /** ⭐⭐ LN-C1: the choice-tick class and the choice read of record for this pass. */
  choiceClass: ChoiceClass; choice: ChoiceRead;
  /** ⭐⭐ LN-C2: the PATH class off the ledger, the choice read at THE STRIKE'S OWN AIM, the
   *  join receipts and the aim-record class. `choiceRec` is IDENTICAL to `choice` except on a
   *  RELEASE-class strike that carried a DLC lead record (`match.dxStrikeAim`), where LN-C1's
   *  inherited rule reads the target's BODY and this census reads the STRIKE'S OWN AIM. */
  pathClass: PathClass; choiceRec: ChoiceRead; trace: TraceRow | null;
  traced: boolean; targetAgrees: boolean; aimHasRecord: boolean;
  /** ⭐⭐⭐ LN-C3: the FLIGHT KIND (PT-C0's own), the PASSER'S ROLE, the STRIKE SITE and the
   *  FAMILY — all four off the engine's own records, decided AT THE STRIKE. */
  klass: Klass; isKeeper: boolean; site: StrikeSite; family: Family;
  /** ⭐ LN-T1′: the launch→aim distance of this strike (NaN with no line). */
  passDist: number;
}
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: { x: number; y: number }; targetGid: number;
      aimLead: { x: number; y: number } | null;
    } | null;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    obmMovement?: boolean; ctbSupportPlane?: boolean; bqCushion?: boolean;
    pmLaneConvergence?: boolean; abandonRestDesignation?: Side | null;
    inSnapshotLaw?: boolean; edsPerceivedChoice?: boolean;
    traceChoice?: boolean;
    lnOwnLanePrice?: boolean;
    passChoiceTrace: readonly TraceRow[];
    dxStrikeAim: { gid: number; lead: { x: number; y: number }; tick: number } | null;
    /** ⭐⭐ LN-C3 — the ENGINE'S OWN RESTART STATE, read BEFORE every step. */
    kickoffKickGid: number | null;
    /** ⭐⭐⭐ LN-T1′b CHANGE (b) — the ENGINE'S OWN WIND-UP LEDGER (O1 T2, #180.3(ii)), READ
     *  ONLY. Its own docblock in `src/sim/Match.ts` says "nothing in the sim ever READS these
     *  fields", so snapshotting them cannot influence a tick — and `gLockstep` proves it. */
    o1WindupLedger: {
      arms: number; evictions: number; struck: number; cancelledMate: number;
    };
  };
  row.armedVersion = bqArmedVersion(m);
  row.traceOn = mm.traceChoice === true;
  row.worldOk = row.armedVersion === BQ_WORLD_VERSION;
  row.cushionOk = mm.bqCushion === true;
  row.seamsAbsent = mm.obmMovement !== true && mm.ctbSupportPlane !== true;
  row.rcBfAbsent = mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.ctbPlaneShut = mm.ctbSupportPlane !== true;
  row.emergentOn = emergentPosOn();
  /* ⭐⭐ LN-C1's OWN world conjuncts: the pass chooser reads the TRUTH team objects. */
  row.snapshotLawAbsent = mm.inSnapshotLaw !== true;
  row.perceivedChoiceOn = mm.edsPerceivedChoice === true;
  /* ⭐⭐⭐ LN-T1′ G-ARM — THE GENE AS READ, off the ANCHORED views (§5b). `lnOwnLaneWeightOf`
     is the SHIPPED accessor, CALLED; `info.genome` must carry NO gene at all. */
  row.lnFlag = mm.lnOwnLanePrice === true;
  row.lnWeightEff = Math.max(...([0, 1] as const)
    .map((s) => lnOwnLaneWeightOf(m.teams[s].effGenome as TacticalGenome)));
  row.lnWeightBase = Math.max(...([0, 1] as const)
    .map((s) => lnOwnLaneWeightOf(m.teams[s].baseGenome as TacticalGenome)));
  row.lnWeightInfo = Math.max(...([0, 1] as const)
    .map((s) => lnOwnLaneWeightOf(m.teams[s].info.genome as TacticalGenome)));
  row.lnGeneOnInfoGenome = ([0, 1] as const).some((s) => Object.prototype.hasOwnProperty
    .call(m.teams[s].info.genome, 'lnOwnLaneWeight'));
  /* ⭐⭐⭐ LN-T1′b CHANGE (c) — THE SAME SHIPPED ACCESSOR, **PER TEAM**, on all THREE views plus
     the KEY's own presence. Taken HERE at CONSTRUCTION (no tick has been stepped) and again at
     FULL TIME below, so the receipt covers both ends of the match — #395 item 4(i)(c), which
     ruled LN-T1′'s `Math.max` over the two teams weaker than its own sentence. */
  const geneReadBySide = (): {
    eff: number[]; base: number[]; info: number[]; key: boolean[];
  } => ({
    eff: ([0, 1] as const).map((sd) => lnOwnLaneWeightOf(
      m.teams[sd].effGenome as TacticalGenome)),
    base: ([0, 1] as const).map((sd) => lnOwnLaneWeightOf(
      m.teams[sd].baseGenome as TacticalGenome)),
    info: ([0, 1] as const).map((sd) => lnOwnLaneWeightOf(
      m.teams[sd].info.genome as TacticalGenome)),
    key: ([0, 1] as const).map((sd) => Object.prototype.hasOwnProperty
      .call(m.teams[sd].info.genome, 'lnOwnLaneWeight')),
  });
  {
    const g0 = geneReadBySide();
    row.lnEffBySideAtConstruction = g0.eff;
    row.lnBaseBySideAtConstruction = g0.base;
    row.lnInfoBySideAtConstruction = g0.info;
    row.lnInfoKeyBySideAtConstruction = g0.key;
  }
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as TacticalGenome & {
      raAccessWeight?: number; passLeadSupport?: number; dvExposureWeight?: number;
      rcReadyWeight?: number; ctbSupportDepth?: number; obmSupportWeight?: number;
    };
    return g.raAccessWeight === undefined && g.passLeadSupport === undefined
      && g.dvExposureWeight === undefined && g.rcReadyWeight === undefined
      && g.ctbSupportDepth === undefined && g.obmSupportWeight === undefined;
  });
  const players = m.allPlayers;
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let wu: Windup | null = null;
  let endedWindup: Windup | null = null;
  let flight: GpFlight | null = null;
  /** ⭐⭐ THE ENGINE'S OWN LEDGER, DRAINED PER TICK and indexed by (decision tick, passerGid) —
   *  the join key of record. ⛔ Nothing is written back; the sidecar is read only. */
  const traceByKey = new Map<string, TraceRow>();
  let traceSeen = 0;
  /** ⭐⭐⭐ LN-T1′b CHANGE (b) — the ENGINE'S OWN WIND-UP LEDGER, SNAPSHOTTED PER TICK and
   *  indexed BY SIM TICK: `[arms, evictions, struck, cancelledMate]`. Index 0 is the state
   *  before the first step. ⛔ READ ONLY — nothing is ever written back to the engine. */
  const ledgerHist: number[][] = [[0, 0, 0, 0]];
  const ledgerAt = (t: number): number[] => (t >= 0 && t < ledgerHist.length
    ? ledgerHist[t] : [0, 0, 0, 0]);
  const runnersEver = new Set<number>();
  const arriverEver = new Set<number>();
  const overlapperEver = new Set<number>();
  const chasersEver = new Set<number>();

  /** the team's OWN sets at THIS tick — read, never inferred */
  const setsOf = (side: Side): DesigSets => {
    const t = m.teams[side];
    return { runners: t.runners, arriver: t.arriver, overlapper: t.overlapper,
      chasers: t.chasers };
  };
  /** ⭐⭐ THE TWO CALLED RECONSTRUCTIONS, with the PRODUCTION ARGUMENT RECIPE (anchored) and
   *  the census's own declared `hasBall = true` for the side in possession (#388 item 2(ii)). */
  const spotOf = (idx: number, side: Side): { x: number; y: number } => formationSpot(
    m.teams[side].players[idx], m.teams[side], m.ball, true, m.teams[1 - side],
    mm.abandonRestDesignation === side,
    mm.pmLaneConvergence === true && m.phase === 'playing',
  );
  const supportOf = (idx: number, side: Side): { x: number; y: number } => supportSpot(
    m.teams[side].players[idx], m.teams[side], m.ball, mm.ctbSupportPlane === true,
  );

  const bookFlight = (f: GpFlight): void => {
    row.firstBody[CTI(f.firstBodyClass)] += 1;
    row.occPerPassBins[Math.min(OCC_BINS - 1, f.occupants.length)] += 1;
    row.occN += f.occupants.length;
    row.occNTight += f.occTight;
    if (f.occupants.length > 0) row.passesWithOcc += 1;
    if (f.occTight > 0) row.passesWithOccTight += 1;
    row.oppN += f.oppOccupants.length;
    row.oppNTight += f.oppTight;
    if (f.oppOccupants.length > 0) row.passesWithOpp += 1;
    if (f.oppTight > 0) row.passesWithOppTight += 1;
    for (const o of f.occupants) {
      const ci = LCI(o.cause);
      row.causeN[ci] += 1;
      row.causePresence[ci][PRI(o.presence)] += 1;
      if (o.spotInLane) row.causeSpotInLane[ci] += 1;
      if (o.supportSpotInLane) row.causeSupportSpotInLane[ci] += 1;
      if (f.firstBodyGid !== null && f.firstBodyGid === o.gid) row.caromHits[ci] += 1;
      row.occDesig[DGI(o.desig)] += 1;
      row.occAction[AI(o.action)] += 1;
      if (o.cause === 'L4') row.l4Action[AI(o.action)] += 1;
      row.distCarrierBins[binOf(o.distCarrier, DCARR_BIN_M, DCARR_BINS)] += 1;
      row.distCentreBins[binOf(o.distCentre, DCENT_BIN_M, DCENT_BINS)] += 1;
      row.distTargetBins[binOf(o.distTarget, DTGT_BIN_M, DTGT_BINS)] += 1;
      row.vAcrossBins[signedBinOf(o.vAcross, VACROSS_BIN_MS, VACROSS_BINS)] += 1;
      row.vAlongBins[signedBinOf(o.vAlong, VALONG_BIN_MS, VALONG_BINS)] += 1;
    }
    for (const o of f.oppOccupants) {
      row.oppPresence[PRI(o.presence)] += 1;
      if (o.tight) row.oppPresenceTight[PRI(o.presence)] += 1;
    }
    /* ⭐⭐ LN-C1 — THE CHOICE-TICK FACES, booked with the flight's own outcome. A pass with no
       launch line (LN-C0's `hasLine` false) carries NO choice geometry and enters no openness
       face; it is still counted in its class's pass count and in `chFirstBody`. */
    /* ⭐⭐⭐ LN-T1′ G1 — THE BACKWARD-PASS SHARE, on the STRUCK aim of record. */
    if (Number.isFinite(f.choiceRec.gain)) {
      row.gpGainReadable += 1;
      if (f.choiceRec.gain < 0) row.gpBackward += 1;
    }
    if (Number.isFinite(f.passDist)) row.passDistSum += f.passDist;
    const ci = CCI(f.choiceClass);
    row.chClass[ci] += 1;
    row.chFirstBody[ci][CTI(f.firstBodyClass)] += 1;
    const ch = f.choice;
    const isCarom = f.firstBodyClass === 'ownNonTarget';
    const isOppFirst = f.firstBodyClass === 'opponent';
    if (isCarom) row.chCarom[ci] += 1;
    if (isOppFirst) row.chOppFirst[ci] += 1;
    if (Number.isFinite(ch.ownOpen) && Number.isFinite(ch.oppOpen)) {
      const ob = binOf(ch.ownOpen, OPEN_BIN_W, OPEN_BINS);
      const pb = binOf(ch.oppOpen, OPEN_BIN_W, OPEN_BINS);
      row.chOwnOpenSum[ci] += ch.ownOpen;
      row.chOppOpenSum[ci] += ch.oppOpen;
      row.chOwnOpenBins[ci][ob] += 1;
      row.chOppOpenBins[ci][pb] += 1;
      const blocked = ch.ownOpen < GATE_040;
      if (blocked) row.chOwnBelow40[ci] += 1;
      if (ch.ownOpen < GATE_045) row.chOwnBelow45[ci] += 1;
      if (ch.oppOpen < GATE_040) {
        row.chOppBelow40[ci] += 1;
        if (isOppFirst) row.chOppBelow40First[ci] += 1;
      }
      if (ch.oppOpen < GATE_045) row.chOppBelow45[ci] += 1;
      if (ch.occ) row.chCorridorOcc[ci] += 1;
      if (ch.occTight) row.chCorridorOccTight[ci] += 1;
      if (ch.alt) {
        row.chAlt[ci] += 1;
        row.chAltGain[ci][GSI(ch.altGainSign)] += 1;
      }
      row.chAltCount[ci] += ch.altCount;
      row.chMates[ci] += ch.mates;
      if (isCarom) {
        row.chCaromGeom[ci] += 1;
        row.chCaromByOwnBin[ci][ob] += 1;
        if (blocked) {
          row.chCaromBlocked[ci] += 1;
          if (ch.alt) row.chCaromBlockedAlt[ci] += 1;
        }
        if (ch.alt) row.chCaromAlt[ci] += 1;
        /* ⭐ the FIRST BODY's presence at the choice — LN-C0's split on the SAME body */
        const occ = f.occupants.find((o) => o.gid === f.firstBodyGid);
        row.chCaromPresence[ci][CPI(caromPresenceOf(
          occ !== undefined, occ === undefined ? null : occ.presence,
        ))] += 1;
      }
      if (isOppFirst) row.chOppFirstByOppBin[ci][pb] += 1;
    }
    /* ⭐⭐ LN-C2 — THE PATH × CHOICE-CLASS CELL, booked with the flight's own outcome. Every
       count below lives in exactly ONE cell `k`, so every published path face is a sum over a
       cell set and no count is copied. */
    const k = CPK(f.choiceClass, f.pathClass);
    const rec = f.choiceRec;
    row.cpPass[k] += 1;
    row.cpFirstBody[k][CTI(f.firstBodyClass)] += 1;
    if (isCarom) row.cpCarom[k] += 1;
    if (f.traced) {
      const t = f.trace as TraceRow;
      row.cpCandidates[k] += t.candidates;
      row.cpRead[k] += t.read;
      row.cpSeenUnread[k] += t.seenUnread;
      row.cpUnseen[k] += t.unseen;
      /* ⛔ #394 item 3(ii) — THE LOOK-PRESSURE COUNT IS BOOKED ON UN-ARMED ARMS ONLY. With the
         hook live the trace's `options[].price` is the PRICED value, so `blindOutpricesRead`
         is ASYMMETRIC between arms and is not a comparable face. It stays 0 on every armed
         arm BY CONSTRUCTION, is published as NO face at all, and exists here only so
         G-REPRO-LNC3 can match LN-C3's own ABSENT-arm field. */
      if (!ARM_FLAG[arm] && t.blindOutpricesRead) row.cpBlindRead[k] += 1;
      if (f.targetAgrees) row.cpTargetAgrees[k] += 1;
    }
    if (f.aimHasRecord) row.cpAimRecord[k] += 1; else row.cpAimFallback[k] += 1;
    if (Number.isFinite(rec.ownOpen) && Number.isFinite(rec.shell)) {
      row.cpGeom[k] += 1;
      const ob = binOf(rec.ownOpen, OPEN_BIN_W, OPEN_BINS);
      const sh = rec.shell > 0 ? 1 : 0;
      row.cpOwnOpenSum[k] += rec.ownOpen;
      row.cpOwnBinShell[k][ob * 2 + sh] += 1;
      if (rec.ownOpen < GATE_040) row.cpOwnBelow40[k] += 1;
      if (sh === 1) row.cpShellPass[k] += 1;
      if (rec.shellOwnOnly > 0) row.cpShellOwn[k] += 1;
      if (rec.shellOppOnly > 0) row.cpShellOpp[k] += 1;
      if (isCarom) {
        row.cpCaromGeom[k] += 1;
        row.cpCaromOwnBinShell[k][ob * 2 + sh] += 1;
        if (sh === 1) row.cpShellCarom[k] += 1;
      }
      /* ⭐⭐ THE SUBSTITUTION'S DIRECTION, and the LANE ARGMAX'S OWN candidate beside. */
      if (f.pathClass === 'substituted') {
        row.cpSubDir[k][SDI(subDirOf(rec.ownOpen, rec.legacyOwnOpen, GATE_040))] += 1;
        if (Number.isFinite(rec.legacyOwnOpen)) {
          row.cpLegacyLane[k] += 1;
          if (rec.shellLegacy > 0) row.cpShellLegacy[k] += 1;
          if (rec.legacyOwnOpen < GATE_040) row.cpLegacyBelow40[k] += 1;
        }
      }
    }
    /* ⭐⭐⭐ LN-C3 — THE FAMILY CELL. Every count below lives in exactly ONE `fi`, so every
       published family face is a sum over a cell set and NO COUNT IS COPIED. The strike-site
       and ledger-class RECEIPTS are booked beside it, never instead of it. */
    const fi = FMI(f.family);
    row.famPass[fi] += 1;
    row.famFirstBody[fi][CTI(f.firstBodyClass)] += 1;
    row.famByPath[fi][PTI(f.pathClass)] += 1;
    row.famBySite[fi][STI(f.site)] += 1;
    row.famChoiceClass[fi][ci] += 1;
    if (f.isKeeper) row.famKeeper[fi] += 1;
    row.siteCount[STI(f.site)] += 1;
    if (isCarom) {
      row.famCarom[fi] += 1; row.siteCarom[STI(f.site)] += 1;
      row.famCaromByClass[fi][ci] += 1;
    }
    if (f.aimHasRecord) row.famAimRecord[fi] += 1; else row.famAimFallback[fi] += 1;
    if (f.family === 'OTHER') {
      row.otherCombos[OTHER_KEY(f.klass, f.isKeeper, f.site, f.pathClass)] += 1;
    }
    if (Number.isFinite(rec.ownOpen) && Number.isFinite(rec.shell)) {
      const ob2 = binOf(rec.ownOpen, OPEN_BIN_W, OPEN_BINS);
      const sh2 = rec.shell > 0 ? 1 : 0;
      row.famGeom[fi] += 1;
      row.famOwnOpenSum[fi] += rec.ownOpen;
      row.famOwnBinShell[fi][ob2 * 2 + sh2] += 1;
      if (rec.ownOpen < GATE_040) row.famOwnBelow40[fi] += 1;
      if (sh2 === 1) row.famShellPass[fi] += 1;
      if (rec.shellOwnOnly > 0) row.famShellOwn[fi] += 1;
      if (rec.shellOppOnly > 0) row.famShellOpp[fi] += 1;
      if (isCarom) {
        row.famCaromGeom[fi] += 1;
        row.famCaromOwnBinShell[fi][ob2 * 2 + sh2] += 1;
        if (sh2 === 1) row.famShellCarom[fi] += 1;
        const occF = f.occupants.find((o) => o.gid === f.firstBodyGid);
        row.famCaromPresence[fi][CPI(caromPresenceOf(
          occF !== undefined, occF === undefined ? null : occF.presence,
        ))] += 1;
      }
    }
  };

  while (!m.finished) {
    /* ⭐⭐⭐ LN-C3 — THE ENGINE'S OWN RESTART STATE, READ BEFORE THE TICK IS STEPPED. The
       kickoff branch clears `kickoffKickGid` in its own first statement and strikes in the
       same call, so the value standing HERE names the kickoff taker for the strike that this
       step may produce. ⛔ This is a RECORD read, never a geometry or timing rule. */
    const kickoffGidBefore = mm.kickoffKickGid;
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe) continue;
    /* ⭐⭐⭐ LN-T1′b CHANGE (b) — the wind-up ledger AS IT STANDS AT THE END OF THIS TICK. */
    {
      const lg = mm.o1WindupLedger;
      while (ledgerHist.length <= tick) ledgerHist.push(ledgerHist[ledgerHist.length - 1]);
      ledgerHist[tick] = [lg.arms, lg.evictions, lg.struck, lg.cancelledMate];
    }
    const ball = m.ball;
    const playing = m.phase === 'playing';
    const ballIsLive = playing || m.phase === 'restart';

    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }
    const pp = mm.pendingPass;
    const passT = pp?.t ?? null;
    const passChangedHere = passT !== null && passT !== prevPendingPassT;
    prevPendingPassT = passT;
    const lastTouch = ball.lastTouch;

    /* ---------- THE DESIGNATION LEDGER, READ EVERY TICK ---------- */
    for (const side of [0, 1] as const) {
      const t = m.teams[side];
      for (const idx of t.runners) runnersEver.add(t.players[idx].gid);
      if (t.arriver !== null) arriverEver.add(t.players[t.arriver].gid);
      if (t.overlapper !== null) overlapperEver.add(t.players[t.overlapper].gid);
      for (const idx of t.chasers) chasersEver.add(t.players[idx].gid);
    }

    /* ---------- ⭐⭐ THE ENGINE'S CHOICE LEDGER, DRAINED (read-only) ---------- */
    {
      const tr = mm.passChoiceTrace;
      for (let i = traceSeen; i < tr.length; i++) {
        const e = tr[i];
        const kk = `${e.tick}:${e.passerGid}`;
        /* ⭐⭐ LN-C3 (LN-C2 §CORR 7's debt, PAID): the join map's DUPLICATE-KEY COUNT, stored
           as a receipt — a second row on the same (decision tick, passerGid) key would mean
           the join is ambiguous. */
        if (traceByKey.has(kk)) row.traceDuplicateKeys += 1;
        traceByKey.set(kk, e);
      }
      traceSeen = tr.length;
      row.traceRowsWritten = tr.length;
    }

    /* ---------- THE WIND-UP RECORD: THE ARM TICK, SNAPSHOTTED ---------- */
    const rec = mm.pendingPassWindup;
    const key = rec === null ? null
      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;
    endedWindup = null;
    if (wu !== null && key !== wu.key) { endedWindup = wu; wu = null; }
    if (rec !== null && (wu === null || key !== wu.key)) {
      const lead = rec.aimLead;
      const eX = rec.aim.x + (lead?.x ?? 0);
      const eY = rec.aim.y + (lead?.y ?? 0);
      const passer = players[rec.gid];
      const px = passer.pos.x; const py = passer.pos.y;
      const bodies = new Map<number, ArmBody>();
      const armHasLine = Math.hypot(eX - px, eY - py) > 1e-6;
      /* ⭐⭐ THE JOIN, AT THE ARM TICK — which is the DECISION tick for this class. */
      const armTrace = traceByKey.get(`${tick}:${rec.gid}`) ?? null;
      const armLegacyGid = armTrace === null ? null : armTrace.legacyGid;
      for (const q of players) {
        if (q.gid === rec.gid || q.role === 'GK' || q.sentOff) continue;
        bodies.set(q.gid, {
          inWide: armHasLine
            && inCorridorOf(px, py, eX, eY, q.pos.x, q.pos.y, DV_CORRIDOR_SCALE),
          inTight: armHasLine
            && inCorridorOf(px, py, eX, eY, q.pos.x, q.pos.y, CONTROL_RADIUS),
          desig: designationOf(q.index, setsOf(q.side as Side)),
          action: q.action.type as string,
        });
      }
      wu = {
        key: key as string, gid: rec.gid, targetGid: rec.targetGid, eX, eY,
        carried: lead !== null && (lead.x !== 0 || lead.y !== 0),
        armTick: tick, bodies,
        /* ⭐⭐ LN-C1 — THE CHOICE READ AT THE ARM TICK: the passer's OWN position at the tick
           he chose, toward the RECORD'S OWN AIM (never recomputed). */
        choice: armHasLine
          ? choiceReadOf(m, passer, rec.targetGid, eX, eY, armLegacyGid)
          : EMPTY_CHOICE,
        trace: armTrace,
      };
    }

    /* ---------- THE GROUND-PASS RELEASE (PT-C0's own detection, reused) ---------- */
    const releases: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        const k0 = klassOf({
          shots: d.shots[side], clearances: d.clearances[side], passes: d.passes[side],
          crosses: d.crosses[side], cutbacks: d.cutbacks[side],
          throughBalls: d.throughBalls[side], longBalls: d.longBalls[side],
          headersWon: d.headersWon[side],
        }, passChangedHere && pp !== null && pp.side === side);
        if (k0 === null) continue;
        let klass = k0;
        let gid = -1;
        if (passChangedHere && pp !== null && pp.side === side) gid = pp.passerGid;
        else if (lastTouch !== null && lastTouch.side === side) gid = lastTouch.gid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && (players[gid].action.type as string) === 'ThrowOut') {
          klass = 'keeperThrow';
        }
        releases.push({ gid, klass });
      }
    }
    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);
    for (const rel of releases) {
      if (!isDelivery(rel.klass) || hSpeedNow < 1e-6) continue;
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const ground = isGroundLaunch(grounded, vz0);
      const targetGid = (pp !== null && passChangedHere && pp.passerGid === rel.gid)
        ? pp.targetGid : null;
      if (!isMeasurableGroundPass(rel.klass, ground, targetGid !== null)) continue;
      if (flight !== null) { bookFlight(flight); flight = null; }
      row.gpFlights += 1;
      const tGid = targetGid as number;
      const viaWindup = endedWindup !== null && endedWindup.gid === rel.gid
        && endedWindup.targetGid === tGid;
      const armRec = viaWindup ? (endedWindup as Windup) : null;
      const eX = armRec !== null ? armRec.eX : players[tGid].pos.x;
      const eY = armRec !== null ? armRec.eY : players[tGid].pos.y;
      const lx = ball.pos.x - ball.vel.x * DT;
      const ly = ball.pos.y - ball.vel.y * DT;
      const dxE = eX - lx; const dyE = eY - ly;
      const L = Math.hypot(dxE, dyE);
      const hasLine = L > 1e-6;
      const ux = hasLine ? dxE / L : 0;
      const uy = hasLine ? dyE / L : 0;
      const passer = players[rel.gid];
      const passerSide = passer.side as Side;
      if (hasLine) row.gpWithLine += 1;
      if (armRec !== null) row.gpWithArm += 1; else row.gpNoArm += 1;
      if (m.possessionSide === passerSide) row.hasBallRecipeAgrees += 1;
      const sets = setsOf(passerSide);
      if (sets.runners.size > 0 || sets.arriver !== null || sets.overlapper !== null) {
        row.passesWithLiveDesignation += 1;
      }
      /* ⭐⭐ LN-C1 — THE CHOICE TICK, by the ENGINE'S OWN RULE (anchored at §3). `arm`: the
         record's own arm tick, whose read was taken THERE. `release`: the strike is on the
         decision tick, so the RELEASE TICK IS THE CHOICE TICK and the read is taken HERE, from
         the passer's own position toward the aim of record (PT-C0's E). */
      /* ⭐⭐ THE JOIN — (decision tick, passerGid). For the ARM class the row was joined at the
         ARM tick and travels on the wind-up record; for the RELEASE class the decision tick IS
         this tick. A pass with NO row is class UNTRACED — COUNTED, never imputed. */
      const relTrace = armRec !== null ? armRec.trace
        : (traceByKey.get(`${tick}:${rel.gid}`) ?? null);
      const relLegacyGid = relTrace === null ? null : relTrace.legacyGid;
      const pathClass = pathClassOf(
        relTrace !== null, relTrace?.chosenGid ?? -1, relTrace?.legacyGid ?? -1,
      );
      /* ⭐⭐ THE RECEIPT: the struck target must BE the ledger's own outcome. */
      const targetAgrees = relTrace !== null && (relTrace.chosenGid >= 0
        ? tGid === relTrace.chosenGid : tGid === relTrace.legacyGid);
      /* ⭐⭐ THE STRIKE'S OWN AIM RECORD (§CORR 3). ARM class: the wind-up record's own `aim` +
         `aimLead`, already read above. RELEASE class: the engine's `dxStrikeAim` deposit for
         THIS body at THIS tick (written by the ONE `dxWindupAim` fork when the argmax elected a
         displaced candidate and the strike carried it). ⛔ NEVER recomputed; where no record
         exists the class is COUNTED as `aim.bodyFallback` and the target's own position is
         used — LN-C1's inherited rule, declared. */
      const dxRec = mm.dxStrikeAim;
      const strikeLead = (armRec === null && dxRec !== null && dxRec.gid === rel.gid
        && dxRec.tick === tick) ? dxRec.lead : null;
      const aimHasRecord = armRec !== null || strikeLead !== null;
      const chClass = choiceClassOf(armRec !== null);
      const chRead: ChoiceRead = armRec !== null ? armRec.choice
        : (hasLine ? choiceReadOf(m, passer, tGid, eX, eY, relLegacyGid) : EMPTY_CHOICE);
      /* ⭐⭐ LN-C2's OWN read, at THE STRIKE'S OWN AIM. Identical to `chRead` unless a RELEASE
         strike carried a lead record, in which case the aim is the target's body PLUS the
         engine's own recorded displacement. LN-C1's `chRead` is kept UNCHANGED beside it so
         G-REPRO-LNC2 compares like with like, field for field. */
      const chReadRec: ChoiceRead = strikeLead === null ? chRead
        : (hasLine ? choiceReadOf(m, passer, tGid, eX + strikeLead.x, eY + strikeLead.y,
          relLegacyGid) : EMPTY_CHOICE);
      /* ⭐⭐⭐ LN-C3 — THE STRIKE SITE AND THE FAMILY, off the ENGINE'S OWN RECORDS ONLY: the
         flight KIND (`rel.klass`, PT-C0's own stat-delta class), the passer's ROLE, the
         wind-up record, the `dxStrikeAim` deposit, the pre-step restart state, and LN-C2's
         ledger PATH class. ⛔ No geometry, no timing heuristic. */
      const isKeeper = (passer.role as string) === 'GK';
      const site = strikeSiteOf(rel.klass, armRec !== null, strikeLead !== null,
        kickoffGidBefore !== null && kickoffGidBefore === rel.gid);
      const family = familyOf(site, isKeeper, pathClass);
      /* ⭐⭐⭐ LN-T1′b CHANGE (b) — THE JOIN DIAGNOSIS. ⛔ THE FAMILY IS ALREADY DECIDED ABOVE,
         by (kind, site) FIRST, byte for byte as LN-C3 froze it; NOTHING below changes it. This
         block only RECORDS, off the engine's own records, the passes on which the FAMILY and
         the LEDGER CLASS disagree: an UNTRACED family whose pass carries a ledger row, or a
         TRACED family whose pass carries none. LEGACY-outfield and SUBSTITUTED are traced BY
         CONSTRUCTION (the path class IS what puts a pass in them), so only the first kind can
         occur — both are COUNTED anyway, never assumed away. */
      const familyIsUntraced = (UNTRACED_FAMILIES as readonly Family[]).includes(family);
      if (familyIsUntraced === (relTrace !== null)) {
        const rowTick = relTrace === null ? null : relTrace.tick;
        const lStrike = ledgerAt(tick);
        const lRow = rowTick === null ? null : ledgerAt(rowTick);
        row.joinDisagreements.push({
          kind: familyIsUntraced
            ? 'untracedFamilyWithLedgerRow' : 'tracedFamilyWithoutLedgerRow',
          strikeTick: tick, passerGid: rel.gid, site, choiceClass: chClass, family, pathClass,
          ledgerRowTick: rowTick,
          chosenGid: relTrace === null ? null : relTrace.chosenGid,
          legacyGid: relTrace === null ? null : relTrace.legacyGid,
          ledgerAtStrikeTick: lStrike,
          ledgerAtStrikeTickMinusOne: ledgerAt(tick - 1),
          ledgerAtRowTick: lRow,
          ledgerAtRowTickMinusOne: rowTick === null ? null : ledgerAt(rowTick - 1),
          windupArmedNotStruckBeforeRestart: lRow !== null
            && lStrike[0] - lRow[0] > 0 && lStrike[2] - lRow[2] === 0,
        });
        if (familyIsUntraced) row.joinUntracedFamilyWithLedgerRow += 1;
        else row.joinTracedFamilyWithoutLedgerRow += 1;
      }
      const f: GpFlight = {
        klass: rel.klass, isKeeper, site, family,
        passDist: hasLine ? L : Number.NaN,
        passerGid: rel.gid, passerSide, targetGid: tGid, releaseTick: tick, hasLine,
        contactSeen: false, firstBodyGid: null, firstBodyClass: 'none',
        occupants: [], oppOccupants: [], occTight: 0, oppTight: 0, hasArm: armRec !== null,
        choiceClass: chClass, choice: chRead,
        pathClass, choiceRec: chReadRec, trace: relTrace,
        traced: relTrace !== null, targetAgrees, aimHasRecord,
      };
      if (hasLine) {
        /* ⭐ OWN OUTFIELD BODIES — neither the passer nor the target */
        for (const q of m.teams[passerSide].players) {
          if (q.role === 'GK' || q.sentOff || q.gid === rel.gid || q.gid === tGid) continue;
          const sp = spotOf(q.index, passerSide);
          const ss = supportOf(q.index, passerSide);
          const spotInLane = inCorridorOf(lx, ly, eX, eY, sp.x, sp.y, DV_CORRIDOR_SCALE);
          const supportSpotInLane = inCorridorOf(lx, ly, eX, eY, ss.x, ss.y, DV_CORRIDOR_SCALE);
          row.eligibleBodies += 1;
          if (spotInLane) row.spotInLaneAll += 1;
          if (supportSpotInLane) row.supportSpotInLaneAll += 1;
          if (!inCorridorOf(lx, ly, eX, eY, q.pos.x, q.pos.y, DV_CORRIDOR_SCALE)) continue;
          const tight = inCorridorOf(lx, ly, eX, eY, q.pos.x, q.pos.y, CONTROL_RADIUS);
          if (tight) f.occTight += 1;
          const desig = designationOf(q.index, sets);
          const action = q.action.type as string;
          const armBody = armRec === null ? undefined : armRec.bodies.get(q.gid);
          if (armRec !== null && armBody === undefined) row.armBodyMissing += 1;
          const presence = presenceOf(
            armRec !== null && armBody !== undefined, armBody?.inWide === true,
          );
          f.occupants.push({
            gid: q.gid, desig, action, spotInLane, supportSpotInLane, presence,
            cause: causeOf({ designation: desig, action, spotInLane }),
            distCarrier: Math.hypot(q.pos.x - passer.pos.x, q.pos.y - passer.pos.y),
            distCentre: centreLineDistOf(lx, ly, eX, eY, q.pos.x, q.pos.y),
            distTarget: Math.hypot(q.pos.x - players[tGid].pos.x,
              q.pos.y - players[tGid].pos.y),
            vAcross: q.vel.x * -uy + q.vel.y * ux,
            vAlong: q.vel.x * ux + q.vel.y * uy,
            tight,
          });
        }
        /* ⭐ THE OPPONENTS IN THE LANE — published BESIDE, never read */
        for (const o of m.teams[1 - passerSide].players) {
          if (o.role === 'GK' || o.sentOff) continue;
          if (!inCorridorOf(lx, ly, eX, eY, o.pos.x, o.pos.y, DV_CORRIDOR_SCALE)) continue;
          const tight = inCorridorOf(lx, ly, eX, eY, o.pos.x, o.pos.y, CONTROL_RADIUS);
          if (tight) f.oppTight += 1;
          const armBody = armRec === null ? undefined : armRec.bodies.get(o.gid);
          f.oppOccupants.push({
            gid: o.gid,
            presence: presenceOf(armRec !== null && armBody !== undefined,
              armBody?.inWide === true),
            tight,
          });
        }
      }
      flight = f;
    }

    /* ---------- FOLLOW THE FLIGHT AND BOOK THE FIRST BODY ---------- */
    if (flight !== null) {
      const f = flight;
      if (!f.contactSeen && lastTouch !== null && lastTouch.gid !== f.passerGid) {
        f.contactSeen = true;
        f.firstBodyGid = lastTouch.gid;
        f.firstBodyClass = contactClassOf(
          lastTouch.gid, f.targetGid, lastTouch.side as Side, f.passerSide,
        );
      }
      if (f.contactSeen) { bookFlight(f); flight = null; }
      else if (ball.owner !== null && ball.owner.gid !== f.passerGid) { bookFlight(f); flight = null; }
      else if (!ballIsLive) { bookFlight(f); flight = null; }
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) { bookFlight(f); flight = null; }
    }

    /* ---------- POPULATION B — 挤人, at the A4 battery's OWN cadence ---------- */
    if (tick % SAMPLE_EVERY === 0 && playing) {
      row.crowdSampleTicks += 1;
      const owner = ball.owner;
      if (owner !== null) row.ownedSamples += 1;
      const possSide: Side | null = owner !== null ? owner.side as Side
        : (flight !== null ? flight.passerSide : null);
      if (possSide === null) row.crowdUnattributed += 1;
      else {
        const outs = m.teams[possSide].players.filter((q) => q.role !== 'GK' && !q.sentOff);
        const xs = outs.map((q) => q.pos.x);
        const ys = outs.map((q) => q.pos.y);
        row.crowdSamples += 1;
        const sets = setsOf(possSide);
        for (let a = 0; a < xs.length; a++) {
          const nearest = nearestMateOf(xs, ys, a);
          if (Number.isFinite(nearest)) {
            row.spacingSum += nearest;
            row.spacingSamples += 1;
            row.nearBins[binOf(nearest, NEAR_BIN_M, NEAR_BINS)] += 1;
          }
        }
        row.dupRunSum += dupRunPairsOf(xs, ys);
        row.dupRunSumAlt += dupRunPairsAltOf(xs, ys);
        const mp = minPairwiseOf(xs, ys);
        if (Number.isFinite(mp)) {
          row.minPairBins[binOf(mp, MINPAIR_BIN_M, MINPAIR_BINS)] += 1;
          if (mp < DUP_RUN_M) row.crashHits += 1;
        }
        if (crashAltOf(xs, ys)) row.crashHitsAlt += 1;
        row.runnersSampleSum += sets.runners.size;
        row.chasersSampleSum += sets.chasers.size;
        if (sets.arriver !== null) row.arriverLiveSamples += 1;
        if (sets.overlapper !== null) row.overlapperLiveSamples += 1;
        /* ⭐⭐ THE DUP-RUN PAIRS, CLASSED */
        const spotCache = new Map<number, { x: number; y: number }>();
        const spotFor = (idx: number): { x: number; y: number } => {
          const hit = spotCache.get(idx);
          if (hit !== undefined) return hit;
          const v = spotOf(idx, possSide);
          spotCache.set(idx, v);
          return v;
        };
        for (let a = 0; a < outs.length; a++) {
          for (let b = a + 1; b < outs.length; b++) {
            if (Math.hypot(xs[a] - xs[b], ys[a] - ys[b]) >= DUP_RUN_M) continue;
            const pA = outs[a]; const pB = outs[b];
            const sA = spotFor(pA.index); const sB = spotFor(pB.index);
            const spotsWithin = Math.hypot(sA.x - sB.x, sA.y - sB.y) < DUP_RUN_M;
            const dA = designationOf(pA.index, sets);
            const dB = designationOf(pB.index, sets);
            const aA = pA.action.type as string;
            const aB = pB.action.type as string;
            row.pairsTotal += 1;
            row.pairN[PCI(pairClassOf({ dA, dB, aA, aB, spotsWithin }))] += 1;
            if (spotsWithin) row.pairSpotsWithin += 1;
            if (aA === 'SupportBallCarrier' || aB === 'SupportBallCarrier') {
              row.pairEitherSupport += 1;
            }
            if (dA === 'runner' || dB === 'runner') row.pairEitherRunner += 1;
            if (owner === null) row.pairNoCarrier += 1;
            else {
              row.pairCarrierDistBins[binOf(Math.hypot(
                owner.pos.x - (xs[a] + xs[b]) / 2, owner.pos.y - (ys[a] + ys[b]) / 2,
              ), PAIRMID_BIN_M, PAIRMID_BINS)] += 1;
            }
          }
        }
      }
    }
  }
  if (flight !== null && observe) { bookFlight(flight); flight = null; }
  row.runnersDistinct = runnersEver.size;
  row.arriverDistinct = arriverEver.size;
  row.overlapperDistinct = overlapperEver.size;
  row.chasersDistinct = chasersEver.size;
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.shots = st[0].shots + st[1].shots;
  row.offsides = st[0].offsides + st[1].offsides;
  {
    /* ⭐⭐⭐ LN-T1′b CHANGE (c) — THE SAME READ-BACK AT FULL TIME. `effGenome` is REBUILT from
       `baseGenome` at every brain tick (§5b's anchor chain), so this is the receipt that the
       dose SURVIVED every mentality rebuild of the whole match, per team. */
    const g1 = geneReadBySide();
    row.lnEffBySideAtFullTime = g1.eff;
    row.lnBaseBySideAtFullTime = g1.base;
    row.lnInfoBySideAtFullTime = g1.info;
    row.lnInfoKeyBySideAtFullTime = g1.key;
  }
  row.signature = signatureOf(m);
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ==========================================================================
   ⭐⭐ EXTRA FIXTURES — LN-T1′'s OWN walk-side predicates and instruments
   (canon: "a scored face's walk-side predicate is pinned — anchored extraction or fixture").
   ========================================================================== */
/* G1 — the chooser's own gain form, on constructed geometry. `localX` is the passer's own
   forward coordinate and the aim's is the same team's; the form is the ANCHORED one. */
const gainForm = (aimLocalX: number, passerLocalX: number): number =>
  clamp01((aimLocalX - passerLocalX + 30) / 60) * 2 - 1;
fx('gain.levelIsZero', near(gainForm(10, 10), 0), true);
fx('gain.forwardIsPositive', gainForm(20, 10) > 0, true);
fx('gain.backwardIsNegative', gainForm(0, 10) < 0, true);
fx('gain.clampsAtPlusOne', near(gainForm(1000, 0), 1), true);
fx('gain.clampsAtMinusOne', near(gainForm(-1000, 0), -1), true);
fx('gain.thirtyMetresBackIsTheFloor', near(gainForm(-30, 0), -1), true);
fx('gain.thirtyMetresForwardIsTheCeiling', near(gainForm(30, 0), 1), true);
/* the COMMENT/STRING STRIPPER is itself an instrument (canon: text-census corpus integrity) */
fx('strip.removesLineComments', stripCode('a(); // b()').includes('b('), false);
fx('strip.removesBlockComments', stripCode('a(); /* b() */ c();').includes('b('), false);
fx('strip.keepsCode', stripCode('a(); /* x */ c();').includes('c('), true);
fx('strip.blanksStringLiterals', stripCode("const s = 'b()';").includes('b('), false);
fx('strip.blanksTemplateLiterals', stripCode('const s = `b()`;').includes('b('), false);
/* the DOSE ACCESSOR is the SHIPPED one, CALLED */
fx('dose.absentReadsZero', lnOwnLaneWeightOf({} as TacticalGenome), 0);
fx('dose.quarter', lnOwnLaneWeightOf({ lnOwnLaneWeight: 0.25 } as TacticalGenome), 0.25);
fx('dose.half', lnOwnLaneWeightOf({ lnOwnLaneWeight: 0.5 } as TacticalGenome), 0.5);
fx('dose.one', lnOwnLaneWeightOf({ lnOwnLaneWeight: 1 } as TacticalGenome), 1);
fx('dose.brokenReadsZero', lnOwnLaneWeightOf({ lnOwnLaneWeight: Number.NaN } as TacticalGenome), 0);
const FIXTURES_OK_ALL = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §10 gLockstep — NO WRAPPER; the observation reads are BYTE-INERT             */
/* ========================================================================== */
const runOut = (m: Match): Match => { while (!m.finished) m.step(DT); return m; };
banner('LN-T1PB — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return { seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm × scratch-seed walks)`);

/* ⭐⭐ gLockstepTrace — THE LEDGER IS BYTE-INERT, RE-PROVED AT THIS HEAD AND UNDER THE DOSE. */
banner('LN-T1PB — the TRACE-INERTNESS receipt (traced vs untraced, PER ARM)');
const lockstepTraceRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const traced = runOut(buildMatch(seed, armK, true));
  const untraced = runOut(buildMatch(seed, armK, false));
  const tracedRows = (traced as unknown as { passChoiceTrace: unknown[] }).passChoiceTrace.length;
  const untracedRows = (untraced as unknown as { passChoiceTrace: unknown[] })
    .passChoiceTrace.length;
  return {
    seed, arm: armK,
    tracedSignature: signatureOf(traced), untracedSignature: signatureOf(untraced),
    identical: signatureOf(traced) === signatureOf(untraced),
    tracedLedgerRows: tracedRows, untracedLedgerRows: untracedRows,
  };
}));
const LOCKSTEP_TRACE_OK = lockstepTraceRows.every((r) => r.identical)
  && lockstepTraceRows.every((r) => r.tracedLedgerRows > 0 && r.untracedLedgerRows === 0);
banner(`  gLockstepTrace ${LOCKSTEP_TRACE_OK ? 'GREEN' : 'RED'}`);
if (!LOCKSTEP_TRACE_OK) {
  banner('LN-T1PB FATAL — the choice ledger is NOT byte-inert: the exam is BLOCKED. No battery '
    + 'seed is walked.');
  process.exit(4);
}

/* ========================================================================== */
/* §11 THE WORLD PIN — a constructed match of EACH arm at an out-of-band seed   */
/* ========================================================================== */
const worldPin = ARMS.map((armK) => {
  const m = buildMatch(WORLD_PIN_SEED, armK);
  const mm = m as unknown as {
    bqCushion?: boolean; obmMovement?: boolean; ctbSupportPlane?: boolean;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    inSnapshotLaw?: boolean; edsPerceivedChoice?: boolean; traceChoice?: boolean;
    bkGroundCorridor?: boolean; dxWindupAim?: boolean; lnOwnLanePrice?: boolean;
  };
  const untraced = buildMatch(WORLD_PIN_SEED, armK, false);
  const dvw = ([0, 1] as const).map((side) => (m.teams[side].effGenome as TacticalGenome & {
    dvExposureWeight?: number }).dvExposureWeight);
  return {
    seed: WORLD_PIN_SEED, arm: armK, bqArmedVersion: bqArmedVersion(m),
    lnOwnLanePriceAsConstructed: mm.lnOwnLanePrice === true,
    lnOwnLanePriceExpected: ARM_FLAG[armK],
    lnOwnLaneWeightOnEffGenome: ([0, 1] as const)
      .map((s) => lnOwnLaneWeightOf(m.teams[s].effGenome as TacticalGenome)),
    lnOwnLaneWeightOnBaseGenome: ([0, 1] as const)
      .map((s) => lnOwnLaneWeightOf(m.teams[s].baseGenome as TacticalGenome)),
    lnOwnLaneWeightOnInfoGenome: ([0, 1] as const)
      .map((s) => lnOwnLaneWeightOf(m.teams[s].info.genome as TacticalGenome)),
    lnGeneKeyPresentOnInfoGenome: ([0, 1] as const).some((s) => Object.prototype
      .hasOwnProperty.call(m.teams[s].info.genome, 'lnOwnLaneWeight')),
    lnOwnLaneWeightExpected: ARM_WEIGHT[armK] ?? 0,
    book: ARM_BOOK[armK],
    traceChoiceOn: mm.traceChoice === true,
    traceChoiceOffOnTheUntracedTwin:
      (untraced as unknown as { traceChoice: boolean }).traceChoice === false,
    bkGroundCorridor: mm.bkGroundCorridor === true,
    dxWindupAim: mm.dxWindupAim === true,
    dvExposureWeightRead: dvw,
    bqCushion: mm.bqCushion === true,
    obmMovementAbsent: mm.obmMovement !== true,
    ctbSupportPlaneAbsent: mm.ctbSupportPlane !== true,
    rcBfAbsent: mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true,
    emergentPosOn: emergentPosOn(),
    snapshotLawAbsent: mm.inSnapshotLaw !== true,
    perceivedChoiceOn: mm.edsPerceivedChoice === true,
  };
});
const WORLD_PIN_OK = worldPin.every((w) => w.bqArmedVersion === BQ_WORLD_VERSION && w.bqCushion
  && w.obmMovementAbsent && w.ctbSupportPlaneAbsent && w.rcBfAbsent
  && w.snapshotLawAbsent && w.perceivedChoiceOn
  && w.traceChoiceOn && w.traceChoiceOffOnTheUntracedTwin
  && w.bkGroundCorridor && w.dxWindupAim
  && w.dvExposureWeightRead.every((v) => v === CORRIDOR_WORLD_WEIGHT)
  /* ⭐⭐⭐ THE ARM AS CONSTRUCTED: the flag and the gene are what the arm SAYS they are, and
     `info.genome` carries NO gene on ANY arm. */
  && w.lnOwnLanePriceAsConstructed === w.lnOwnLanePriceExpected
  && w.lnOwnLaneWeightOnEffGenome.every((v) => v === w.lnOwnLaneWeightExpected)
  && w.lnOwnLaneWeightOnBaseGenome.every((v) => v === w.lnOwnLaneWeightExpected)
  && w.lnOwnLaneWeightOnInfoGenome.every((v) => v === 0)
  && !w.lnGeneKeyPresentOnInfoGenome);
const DV_EXPOSURE_WEIGHT_READ = worldPin[0].dvExposureWeightRead[0];

/* ========================================================================== */
/* §12 THE BATTERY — the seven arms PAIRED on every seed                       */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const CHUNK = 25;
const runCore = (pass: number): { cells: Cell[]; receipt: Record<Arm, Row> } => {
  const out: Cell[] = [];
  banner(`LN-T1PB — pass ${pass}: ${N} seeds × ${ARMS.length} arms, seeds `
    + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
  for (let start = 0; start < batterySeeds.length; start += CHUNK) {
    for (const seed of batterySeeds.slice(start, start + CHUNK)) {
      const rows = {} as Record<Arm, Row>;
      for (const armK of ARMS) rows[armK] = walkMatch(buildMatch(seed, armK), armK, true);
      out.push({ seed, rows });
    }
    banner(`  … pass ${pass} ${Math.min(start + CHUNK, batterySeeds.length)}/`
      + `${batterySeeds.length} seeds ×${ARMS.length} arms `
      + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
  }
  const receipt = {} as Record<Arm, Row>;
  for (const armK of ARMS) receipt[armK] = walkMatch(buildMatch(RECEIPT_SEED, armK), armK, true);
  return { cells: out, receipt };
};
const coreDigest = (c: { cells: Cell[]; receipt: Record<Arm, Row> }): string => {
  const strip = (r: Row): Record<string, unknown> => {
    const o = { ...r } as Record<string, unknown>;
    delete o.wallMs;
    return o;
  };
  return sha(canonicalJson({
    cells: c.cells.map((x) => ({ seed: x.seed,
      rows: Object.fromEntries(ARMS.map((a) => [a, strip(x.rows[a])])) })),
    receipt: Object.fromEntries(ARMS.map((a) => [a, strip(c.receipt[a])])),
  }));
};
const coreA = runCore(1);
const digestA = coreDigest(coreA);
banner(`  [ln-t1pb] pass 1 digest ${digestA} — X-DET second pass...`);
const coreB = runCore(2);
const digestB = coreDigest(coreB);
const X_DET = digestA === digestB;
banner(`  [ln-t1pb] pass 2 digest ${digestB} — X-DET ${X_DET ? 'PASS' : 'FAIL'}`);
const cells = coreA.cells;
const receiptRows = coreA.receipt;
const walksBooked = (cells.length + 1) * ARMS.length * 2;

/* --- X-FP-PROD, recomputed in-probe (#181.2), inherited from OBM-T1's probe --- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return sha(JSON.stringify(out.league));
};
const fpObserved = leagueHash(FINGERPRINT_SEED);
const X_FP_PROD = fpObserved === FINGERPRINT_BASELINE;
banner(`  [ln-t1pb] X-FP-PROD ${X_FP_PROD ? 'PASS' : 'FAIL'} (${fpObserved.slice(0, 16)}…)`);

/* ==========================================================================
   ⭐ G-REPRO-LNC3 — LN-C3's OWN SEEDS 12,548,000–011, RE-WALKED ON THE ABSENT ARM
   with the trace ON, and matched FIELD FOR FIELD against the COMMITTED artifact over
   EVERY field the two instruments SHARE. ⛔ RE-WALKS, NOT CONSUMPTION.
   ⭐⭐ THE DORMANCY RECEIPT IN THE CENSUS'S OWN ARITHMETIC: the flag-off world is byte-identical
   to the head LN-C3 walked, so 0 mismatches is what dormancy MEANS here.
   ========================================================================== */
const lnc3Disk = JSON.parse(readFileSync(LNC3_ARTIFACT, 'utf8')) as {
  perSeedCells: (Record<string, unknown> & { seed: number })[];
  hashedBodySha256: string;
};
const LNC3_FILE_SHA = sha(readFileSync(LNC3_ARTIFACT, 'utf8'));
const REPRO_EXCLUDED_FIELDS = ['wallMs'] as const;
banner(`LN-T1PB — G-REPRO-LNC3: re-walking LN-C3 seeds ${REPRO_LNC3_SEEDS[0]}–`
  + `${REPRO_LNC3_SEEDS[REPRO_LNC3_N - 1]} on the ABSENT arm...`);
const MY_ROW_KEYS = Object.keys(emptyRow());
const reproRows = REPRO_LNC3_SEEDS.map((seed) => {
  const got = walkMatch(buildMatch(seed, CONTROL_ARM, true), CONTROL_ARM, true) as unknown as
    Record<string, unknown>;
  const want = (lnc3Disk.perSeedCells.find((c) => c.seed === seed)?.E13 ?? null) as
    Record<string, unknown> | null;
  const shared = want === null ? [] : Object.keys(want)
    .filter((k) => MY_ROW_KEYS.includes(k))
    .filter((k) => !(REPRO_EXCLUDED_FIELDS as readonly string[]).includes(k));
  const notComputed = want === null ? [] : Object.keys(want).filter(
    (k) => !MY_ROW_KEYS.includes(k),
  );
  const mismatches = shared.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want![k]));
  return { seed, found: want !== null, fieldsCompared: shared.length, notComputed, mismatches };
});
const REPRO_FIELDS_COMPARED = reproRows.reduce((a, r) => a + r.fieldsCompared, 0);
const REPRO_MISMATCHES = reproRows.reduce((a, r) => a + r.mismatches.length, 0);
const REPRO_MIN_FIELDS = ['gpFlights', 'firstBody', 'famPass', 'famCarom', 'famGeom',
  'famShellPass', 'famOwnOpenSum', 'cpPass', 'cpCarom', 'siteCount', 'siteCarom',
  'crashHits', 'crowdSamples', 'passes', 'passesCompleted', 'interceptions', 'goals', 'shots'];
const REPRO_OK_LNC3 = reproRows.length === REPRO_LNC3_N
  && reproRows.every((r) => r.found && r.fieldsCompared > 0 && r.mismatches.length === 0)
  && REPRO_MIN_FIELDS.every((k) => MY_ROW_KEYS.includes(k));
banner(`  G-REPRO-LNC3 ${REPRO_OK_LNC3 ? 'GREEN' : 'RED'} — ${REPRO_FIELDS_COMPARED} field `
  + `comparisons, ${REPRO_MISMATCHES} mismatches`);

/* ==========================================================================
   ⭐⭐⭐ G-REPRO-LNT1P (LN-T1′b CHANGE (e), #395 item 4(i)(e)) — LN-T1′'s OWN SEEDS
   12,549,000–011 RE-WALKED ON ALL SEVEN ARMS with THIS instrument, and matched FIELD FOR FIELD
   against EVERY `perSeedCells` field this instrument SHARES with LN-T1′'s (RED) artifact.
   ⭐⭐ THE IDENTITY RECEIPT BETWEEN THE TWO RUNS: the walker is the same and the observation is
   the same — only the RECEIPTS changed — so 0 mismatches on every arm is what "the five
   changes and nothing else" MEANS, in the parent run's own arithmetic.
   ⛔ RE-WALKS, NOT CONSUMPTION: block 12,549,000–999 is LN-T1′'s, consumed whole of record.
   ========================================================================== */
const lnt1pDisk = JSON.parse(readFileSync(LNT1P_ARTIFACT, 'utf8')) as {
  perSeedCells: (Record<string, Record<string, unknown>> & { seed: number })[];
  hashedBodySha256: string; allGreen: boolean;
};
const LNT1P_FILE_SHA = sha(readFileSync(LNT1P_ARTIFACT, 'utf8'));
/** the ONE shared field excluded, and it is a MACHINE TIMING. Every field THIS instrument adds
 *  is absent from LN-T1′'s cells by construction and is therefore not a shared field at all —
 *  it is listed separately, by name, as `fieldsIAddedThatLnT1pDoesNotHave`. */
const REPRO_LNT1P_EXCLUDED_FIELDS = ['wallMs'] as const;
banner(`LN-T1PB — G-REPRO-LNT1P: re-walking LN-T1′ seeds ${REPRO_LNT1P_SEEDS[0]}–`
  + `${REPRO_LNT1P_SEEDS[REPRO_LNT1P_N - 1]} on ALL ${ARMS.length} arms...`);
const reproLnt1pRows = REPRO_LNT1P_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const got = walkMatch(buildMatch(seed, armK, true), armK, true) as unknown as
    Record<string, unknown>;
  const want = (lnt1pDisk.perSeedCells.find((c) => c.seed === seed)?.[armK] ?? null) as
    Record<string, unknown> | null;
  const shared = want === null ? [] : Object.keys(want)
    .filter((k) => MY_ROW_KEYS.includes(k))
    .filter((k) => !(REPRO_LNT1P_EXCLUDED_FIELDS as readonly string[]).includes(k));
  const theirsNotMine = want === null ? []
    : Object.keys(want).filter((k) => !MY_ROW_KEYS.includes(k));
  const mismatches = shared.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want![k]));
  return { seed, arm: armK, found: want !== null, fieldsCompared: shared.length,
    theirFieldsIDoNotCompute: theirsNotMine, mismatches };
}));
const LNT1P_THEIR_KEYS = Object.keys(lnt1pDisk.perSeedCells[0]?.[CONTROL_ARM] ?? {});
const REPRO_LNT1P_NEW_FIELDS = MY_ROW_KEYS.filter((k) => !LNT1P_THEIR_KEYS.includes(k));
const REPRO_LNT1P_FIELDS = reproLnt1pRows.reduce((a, r) => a + r.fieldsCompared, 0);
const REPRO_LNT1P_MISMATCHES = reproLnt1pRows.reduce((a, r) => a + r.mismatches.length, 0);
const REPRO_LNT1P_BY_ARM = Object.fromEntries(ARMS.map((armK) => {
  const rs = reproLnt1pRows.filter((r) => r.arm === armK);
  return [armK, {
    seeds: rs.length,
    fieldsCompared: rs.reduce((a, r) => a + r.fieldsCompared, 0),
    mismatches: rs.reduce((a, r) => a + r.mismatches.length, 0),
    mismatchedFields: [...new Set(rs.flatMap((r) => r.mismatches))].sort(),
  }];
})) as Record<Arm, { seeds: number; fieldsCompared: number; mismatches: number;
  mismatchedFields: string[] }>;
const REPRO_OK_LNT1P = reproLnt1pRows.length === REPRO_LNT1P_N * ARMS.length
  && reproLnt1pRows.every((r) => r.found && r.fieldsCompared > 0 && r.mismatches.length === 0)
  && REPRO_MIN_FIELDS.every((k) => MY_ROW_KEYS.includes(k))
  && REPRO_MIN_FIELDS.every((k) => LNT1P_THEIR_KEYS.includes(k));
banner(`  G-REPRO-LNT1P ${REPRO_OK_LNT1P ? 'GREEN' : 'RED'} — ${REPRO_LNT1P_FIELDS} field `
  + `comparisons over ${ARMS.length} arms, ${REPRO_LNT1P_MISMATCHES} mismatches`);
for (const armK of ARMS) {
  const b = REPRO_LNT1P_BY_ARM[armK];
  banner(`    ${armK.padEnd(11)} ${b.fieldsCompared} fields, ${b.mismatches} mismatches`
    + `${b.mismatches > 0 ? ` — ${b.mismatchedFields.join(', ')}` : ''}`);
}

/* --- ⭐⭐ FLAG-HYGIENE: ARMED-ZERO ≡ ABSENT on EVERY seed --------------------- */
/** ⚠ The excluded fields ARE the arm definition or its receipt — the flag and the gene as read.
 *  EVERYTHING the world produced, INCLUDING the whole-match signature with the rng stream
 *  state, is compared. `wallMs` is excluded as a machine timing.
 *  ⛔ `cpBlindRead` is excluded because THIS INSTRUMENT censors it, not because the world moved:
 *  #394 item 3(ii) forbids a look-pressure face off an armed arm, so the count is booked on
 *  UN-ARMED arms only and is 0 on ARMED-ZERO by construction. The byte-identity claim rests on
 *  the WHOLE-MATCH SIGNATURE (rng stream state included), which is compared and must be
 *  identical on every seed. Excluded and STATED. */
const HYGIENE_EXCLUDED_FIELDS = ['lnFlag', 'lnWeightEff', 'lnWeightBase', 'lnWeightInfo',
  'lnGeneOnInfoGenome', 'wallMs', 'cpBlindRead',
  /* ⭐⭐⭐ LN-T1′b CHANGE (c) — the eight PER-TEAM read-back fields are the SAME arm definition
     as the four `Math.max` ones above, at a finer grain. Excluded BY NAME, never dropped. */
  'lnEffBySideAtConstruction', 'lnBaseBySideAtConstruction', 'lnInfoBySideAtConstruction',
  'lnInfoKeyBySideAtConstruction', 'lnEffBySideAtFullTime', 'lnBaseBySideAtFullTime',
  'lnInfoBySideAtFullTime', 'lnInfoKeyBySideAtFullTime'] as const;
const hygieneRows = cells.map((c) => {
  const r = c.rows[CONTROL_ARM] as unknown as Record<string, unknown>;
  const z = c.rows['ARMED-ZERO'] as unknown as Record<string, unknown>;
  const keys = Object.keys(r)
    .filter((k) => !(HYGIENE_EXCLUDED_FIELDS as readonly string[]).includes(k));
  const diffs = keys.filter((k) => JSON.stringify(r[k]) !== JSON.stringify(z[k]));
  return { seed: c.seed, fieldsCompared: keys.length, differingFields: diffs };
});
const HYGIENE_DIFFERING = hygieneRows.reduce((a, r) => a + r.differingFields.length, 0);
const HYGIENE_SIGNATURES_IDENTICAL = cells
  .filter((c) => c.rows[CONTROL_ARM].signature === c.rows['ARMED-ZERO'].signature).length;
const FLAG_HYGIENE_OK = hygieneRows.every((r) => r.differingFields.length === 0)
  && HYGIENE_SIGNATURES_IDENTICAL === cells.length
  && cells.every((c) => c.rows['ARMED-ZERO'].lnFlag && !c.rows[CONTROL_ARM].lnFlag)
  && cells.every((c) => c.rows['ARMED-ZERO'].lnWeightEff === 0);

/* --- ⭐⭐ G-ARM: the gene on the ANCHORED views, and the seam ALIVE ------------ */
const gArmRows = Object.fromEntries(ARMS.map((armK) => {
  const rows = cells.map((c) => c.rows[armK]);
  const want = ARM_WEIGHT[armK] ?? 0;
  return [armK, {
    flagExpected: ARM_FLAG[armK], weightExpected: want,
    seedsWithFlagOn: rows.filter((r) => r.lnFlag).length,
    seedsWithWeightOnEffGenome: rows.filter((r) => r.lnWeightEff === want).length,
    seedsWithWeightOnBaseGenome: rows.filter((r) => r.lnWeightBase === want).length,
    seedsWithGeneOnInfoGenome: rows.filter((r) => r.lnGeneOnInfoGenome).length,
    seedsWithInfoGenomeReadingZero: rows.filter((r) => r.lnWeightInfo === 0).length,
    seeds: rows.length,
  }];
})) as Record<Arm, { flagExpected: boolean; weightExpected: number; seedsWithFlagOn: number;
  seedsWithWeightOnEffGenome: number; seedsWithWeightOnBaseGenome: number;
  seedsWithGeneOnInfoGenome: number; seedsWithInfoGenomeReadingZero: number; seeds: number }>;
/** ⭐⭐ LIVENESS — the whole-match signature DIFFERS between ABSENT and W100 on every seed, or
 *  the count of differing seeds is published. The seam has no counter of its own. */
const LIVENESS_ROWS = cells.map((c) => ({
  seed: c.seed,
  absentVsW100Differs: c.rows[CONTROL_ARM].signature !== c.rows.W100.signature,
  absentVsW050Differs: c.rows[CONTROL_ARM].signature !== c.rows.W050.signature,
  absentVsW025Differs: c.rows[CONTROL_ARM].signature !== c.rows.W025.signature,
  d13AbsentVsD13W050Differs: c.rows[D13_CONTROL_ARM].signature !== c.rows['D13-W050'].signature,
}));
const LIVENESS = {
  seeds: LIVENESS_ROWS.length,
  w100DifferingSeeds: LIVENESS_ROWS.filter((r) => r.absentVsW100Differs).length,
  w050DifferingSeeds: LIVENESS_ROWS.filter((r) => r.absentVsW050Differs).length,
  w025DifferingSeeds: LIVENESS_ROWS.filter((r) => r.absentVsW025Differs).length,
  d13DifferingSeeds: LIVENESS_ROWS.filter((r) => r.d13AbsentVsD13W050Differs).length,
};
/** ⭐⭐⭐ LN-T1′b CHANGE (c) — THE READ-BACK **PER TEAM**, AT CONSTRUCTION AND AT FULL TIME.
 *  #395 item 4(i)(c) / §CORR 2: LN-T1′'s receipt was a `Math.max` over the two teams and was
 *  taken at construction only, which is weaker than the sentence it carried. Here EVERY dosed
 *  side is checked SEPARATELY on `effGenome` AND `baseGenome`, at BOTH times, and `info.genome`
 *  must carry no key and read 0 on BOTH sides at BOTH times. Every arm is dosed on BOTH teams
 *  (the ratified idiom), so the requirement is stated over both sides on every arm. */
const SIDES = [0, 1] as const;
const gArmPerTeamRows = Object.fromEntries(ARMS.map((armK) => {
  const rows = cells.map((c) => c.rows[armK]);
  const want = ARM_WEIGHT[armK] ?? 0;
  const cnt = (pick: (r: Row) => boolean): number => rows.filter(pick).length;
  return [armK, {
    weightExpected: want, seeds: rows.length,
    bySide: SIDES.map((sd) => ({
      side: sd,
      effAtConstruction: cnt((r) => r.lnEffBySideAtConstruction[sd] === want),
      baseAtConstruction: cnt((r) => r.lnBaseBySideAtConstruction[sd] === want),
      infoAtConstructionReadsZero: cnt((r) => r.lnInfoBySideAtConstruction[sd] === 0),
      infoKeyAbsentAtConstruction: cnt((r) => !r.lnInfoKeyBySideAtConstruction[sd]),
      effAtFullTime: cnt((r) => r.lnEffBySideAtFullTime[sd] === want),
      baseAtFullTime: cnt((r) => r.lnBaseBySideAtFullTime[sd] === want),
      infoAtFullTimeReadsZero: cnt((r) => r.lnInfoBySideAtFullTime[sd] === 0),
      infoKeyAbsentAtFullTime: cnt((r) => !r.lnInfoKeyBySideAtFullTime[sd]),
    })),
  }];
})) as Record<Arm, { weightExpected: number; seeds: number; bySide: {
  side: number; effAtConstruction: number; baseAtConstruction: number;
  infoAtConstructionReadsZero: number; infoKeyAbsentAtConstruction: number;
  effAtFullTime: number; baseAtFullTime: number; infoAtFullTimeReadsZero: number;
  infoKeyAbsentAtFullTime: number }[] }>;
const G_ARM_PER_TEAM_OK = ARMS.every((armK) => {
  const g = gArmPerTeamRows[armK];
  return g.bySide.every((b) => b.effAtConstruction === g.seeds && b.baseAtConstruction === g.seeds
    && b.effAtFullTime === g.seeds && b.baseAtFullTime === g.seeds
    && b.infoAtConstructionReadsZero === g.seeds && b.infoKeyAbsentAtConstruction === g.seeds
    && b.infoAtFullTimeReadsZero === g.seeds && b.infoKeyAbsentAtFullTime === g.seeds);
});
const G_ARM_OK = ARMS.every((a) => {
  const g = gArmRows[a];
  return g.seedsWithFlagOn === (g.flagExpected ? g.seeds : 0)
    && g.seedsWithWeightOnEffGenome === g.seeds
    && g.seedsWithWeightOnBaseGenome === g.seeds
    && g.seedsWithGeneOnInfoGenome === 0
    && g.seedsWithInfoGenomeReadingZero === g.seeds;
}) && G_ARM_PER_TEAM_OK && LIVENESS.w100DifferingSeeds > 0;

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef { unit: string; what: string; den: string;
  num: (r: Row) => number; dn: (r: Row) => number }
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, what: string, den: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, den, num, dn }; };
const ONE = (): number => 1;
const sumIdx = (xs: readonly number[], idx: readonly number[]): number =>
  idx.reduce((a, i) => a + xs[i], 0);
const sumIdxCell = (
  xs: readonly (readonly number[])[], idx: readonly number[], j: number,
): number => idx.reduce((a, i) => a + xs[i][j], 0);

/* ---- ⭐⭐⭐ R1 — THE PRIMARY RULER, THE USER'S OWN FACE ---- */
defFace('firstBody.ownNonTarget', 'share',
  '⭐⭐⭐ R1 — THE USER\'S OWN FACE 「传到人身上弹回」: the share of MEASURED GROUND PASSES whose '
  + 'FIRST BODY (PT-C0\'s `ball.lastTouch` channel) is an own outfielder who is NOT the target. '
  + 'DOWN resolved = HELPFUL', 'measured ground passes',
  (r) => r.firstBody[CTI('ownNonTarget')], (r) => r.gpFlights);
for (const c of CONTACTS) {
  if (c === 'ownNonTarget') continue;
  defFace(`firstBody.${c}`, 'share', `the first-body class ${c} (published beside R1)`,
    'measured ground passes', (r) => r.firstBody[CTI(c)], (r) => r.gpFlights);
}
/* ---- ⭐⭐ THE FAMILY TABLE — the carom rate and the share of caroms, per family ---- */
const famIdx = (fams: readonly Family[]): number[] => fams.map((f) => FMI(f));
const ALL_FAM_IDX = famIdx(FAMILIES);
const UNTRACED_FAM_IDX = famIdx(UNTRACED_FAMILIES);
interface FamilyView { key: string; fams: readonly Family[]; label: string }
const FAMILY_VIEWS: FamilyView[] = [
  ...FAMILIES.map((f) => ({ key: f, fams: [f] as readonly Family[], label: f })),
  { key: 'UNTRACED-ALL', fams: UNTRACED_FAMILIES, label: 'the UNTRACED families POOLED' },
  { key: 'TRACED-ALL', fams: TRACED_FAMILIES, label: 'the TRACED families POOLED' },
  { key: 'ALL', fams: FAMILIES, label: 'every measured ground pass' },
];
for (const fv of FAMILY_VIEWS) {
  const idx = famIdx(fv.fams);
  defFace(`family.${fv.key}.passShare`, 'share',
    `the share of ALL measured ground passes in ${fv.label}`, 'measured ground passes',
    (r) => sumIdx(r.famPass, idx), (r) => sumIdx(r.famPass, ALL_FAM_IDX));
  defFace(`family.${fv.key}.caromRate`, 'share',
    `⭐⭐ P(carom | family) — R1's own conditional INSIDE ${fv.label}`,
    'passes in this family', (r) => sumIdx(r.famCarom, idx), (r) => sumIdx(r.famPass, idx));
  defFace(`family.${fv.key}.caromShareOfAllCaroms`, 'share',
    `⭐⭐ the family's SHARE OF ALL CAROMS: ${fv.label}`, 'caroms',
    (r) => sumIdx(r.famCarom, idx), (r) => sumIdx(r.famCarom, ALL_FAM_IDX));
  defFace(`family.${fv.key}.geometryShare`, 'share',
    '⚠ A RECEIPT: the share of this family\'s passes carrying a choice GEOMETRY',
    'passes in this family', (r) => sumIdx(r.famGeom, idx), (r) => sumIdx(r.famPass, idx));
  defFace(`openFam.${fv.key}.ownOpennessMean`,
    'openness (0 = a body on the line, 1 = clear)',
    `⭐⭐ A SECONDARY — THE SEAM'S OWN FACE: LN-C1's own-openness of the STRUCK lane (the `
    + `SHIPPED \`laneOpenness\` CALLED with the OWN population), meaned over ${fv.label}. `
    + 'EXPECTED UP under a dose; published, NEVER gating',
    'passes in this family with a choice geometry',
    (r) => sumIdx(r.famOwnOpenSum, idx), (r) => sumIdx(r.famGeom, idx));
  defFace(`openFam.${fv.key}.ownOpenBelow40Share`, 'share',
    `the share of ${fv.label}'s struck lanes with own-openness below the chooser's own `
    + `${GATE_040} gate`, 'passes in this family with a choice geometry',
    (r) => sumIdx(r.famOwnBelow40, idx), (r) => sumIdx(r.famGeom, idx));
  defFace(`shellFam.${fv.key}.firedShare`, 'share',
    `⭐ A SECONDARY — THE SHELL AT THE CHOICE (\`groundShellHazard\` CALLED on the STRUCK lane, `
    + `both populations): the share of ${fv.label}'s passes on which it FIRES — does the price `
    + 'already empty the shell?', 'passes in this family with a choice geometry',
    (r) => sumIdx(r.famShellPass, idx), (r) => sumIdx(r.famGeom, idx));
}
/* ---- ⭐⭐⭐ LN-T1′b CHANGE (a) — THE DEMOTED CONJUNCT, PUBLISHED AS A RECEIPT.
   LN-T1′ ASSERTED "the untraced families ARE exactly the untraced ledger class" inside `gFaces`
   and went RED on three armed arms (#395 item 3). Here the same quantity is PUBLISHED, per arm,
   per untraced family, as a FACE with its own numerator and denominator — so `gTwoFractions`
   and `gFaces` both cover it — and it GATES NOTHING. ⛔ The family assignment is by (kind, site)
   FIRST, byte for byte as LN-C3 froze it, and is untouched by what this receipt says. ---- */
for (const fam of UNTRACED_FAMILIES) {
  defFace(`ledgerRow.${fam}.share`, 'share',
    '⭐⭐⭐ THE DEMOTED CONJUNCT (LN-T1′b CHANGE (a)), PUBLISHED: the share of this UNTRACED '
    + `family's measured ground passes that CARRY a ledger row — ${fam}. LN-C3's inherited `
    + 'identity said this is 0 on every untraced family, by construction of the EDS gate; '
    + 'LN-T1′ found it non-zero by one or two kick-off passes on three armed arms. It is a '
    + 'RECEIPT here and gates NOTHING', 'passes in this family',
    (r) => TRACED_PATHS.reduce((a, p) => a + r.famByPath[FMI(fam)][PTI(p)], 0),
    (r) => r.famPass[FMI(fam)]);
}
/* ---- ⭐⭐⭐ LN-T1′b CHANGE (b) — THE JOIN DISAGREEMENT, AS TWO COUNTED FACES ---- */
defFace('joinDisagreement.untracedFamilyWithLedgerRow.share', 'share',
  '⭐⭐⭐ LN-T1′b CHANGE (b) — the share of measured ground passes whose FAMILY is UNTRACED and '
  + 'whose pass nevertheless CARRIES a ledger row: exactly the disagreement LN-T1′ hit. Every '
  + 'one of them is ITEMISED in the artifact\'s `ledgerJoin.disagreementRows`. A DIAGNOSIS '
  + 'face — it gates nothing and it changes no family', 'measured ground passes',
  (r) => r.joinUntracedFamilyWithLedgerRow, (r) => r.gpFlights);
defFace('joinDisagreement.tracedFamilyWithoutLedgerRow.share', 'share',
  '⭐⭐⭐ LN-T1′b CHANGE (b) — the OTHER direction: a TRACED family (LEGACY-outfield or '
  + 'SUBSTITUTED) whose pass carries NO ledger row. Both are traced BY CONSTRUCTION — the '
  + 'ledger PATH CLASS is what puts a pass in them — so this is expected 0, and it is COUNTED, '
  + 'never assumed away', 'measured ground passes',
  (r) => r.joinTracedFamilyWithoutLedgerRow, (r) => r.gpFlights);
/* ---- ⭐⭐ THE STRIKE SITES ---- */
for (const st of SITES) {
  defFace(`site.${st}.passShare`, 'share',
    `the share of ALL measured ground passes struck at ${st}`, 'measured ground passes',
    (r) => sumIdx(r.siteCount, [STI(st)]), (r) => sum(r.siteCount));
  defFace(`site.${st}.caromShareOfAllCaroms`, 'share', `${st}'s share of ALL caroms`, 'caroms',
    (r) => sumIdx(r.siteCarom, [STI(st)]), (r) => sum(r.siteCarom));
}
/* ---- ⭐⭐ THE PATH CLASSES (LN-C2's, on the ESTABLISHED choice classes) ---- */
interface PathView { key: string; paths: readonly PathClass[]; label: string }
const PATH_VIEWS: PathView[] = [
  { key: 'legacy', paths: LEGACY_PATHS, label: 'LEGACY (the lane argmax\'s own man)' },
  { key: 'legacyNoOption', paths: ['legacyNoOption'], label: 'LEGACY-NO-OPTION (`chosenGid === -1`)' },
  { key: 'substituted', paths: ['substituted'], label: 'SUBSTITUTED (the perceived chooser replaced the target)' },
  { key: 'untraced', paths: ['untraced'], label: 'UNTRACED (no ledger row)' },
  { key: 'traced', paths: TRACED_PATHS, label: 'TRACED (a ledger row joined)' },
];
const EST_CP_ALL = cpIdx(ESTABLISHED, PATHS);
for (const pv of PATH_VIEWS) {
  const idx = cpIdx(ESTABLISHED, pv.paths);
  defFace(`path.established.${pv.key}.passShare`, 'share',
    `⭐ A SECONDARY: the share of measured ground passes on path ${pv.label}`,
    'established-class measured ground passes',
    (r) => sumIdx(r.cpPass, idx), (r) => sumIdx(r.cpPass, EST_CP_ALL));
  defFace(`path.established.${pv.key}.caromRate`, 'share',
    `P(carom | path) inside ${pv.label}`, 'established-class passes on this path',
    (r) => sumIdx(r.cpCarom, idx), (r) => sumIdx(r.cpPass, idx));
  defFace(`path.established.${pv.key}.caromShareOfCaroms`, 'share',
    `the path's share of the caroms: ${pv.label}`, 'established-class caroms',
    (r) => sumIdx(r.cpCarom, idx), (r) => sumIdx(r.cpCarom, EST_CP_ALL));
}
defFace('trace.established.joinShare', 'share',
  '⚠ A RECEIPT: the share of measured ground passes joined to a ledger row by (decision tick, '
  + 'passerGid)', 'established-class measured ground passes',
  (r) => sumIdx(r.cpPass, cpIdx(ESTABLISHED, TRACED_PATHS)), (r) => sumIdx(r.cpPass, EST_CP_ALL));
defFace('trace.established.targetAgreesShare', 'share',
  '⚠ A GATED RECEIPT: the STRUCK target gid equals the ledger\'s own outcome',
  'established-class traced passes',
  (r) => sumIdx(r.cpTargetAgrees, cpIdx(ESTABLISHED, TRACED_PATHS)),
  (r) => sumIdx(r.cpPass, cpIdx(ESTABLISHED, TRACED_PATHS)));
defFace('trace.established.noOptionShare', 'share',
  '⭐ A SECONDARY RECEIPT — the `chosenGid = −1` RATE: the factor touches no executability, so '
  + 'this is EXPECTED UNCHANGED', 'established-class traced passes',
  (r) => sumIdx(r.cpPass, cpIdx(ESTABLISHED, ['legacyNoOption'])),
  (r) => sumIdx(r.cpPass, cpIdx(ESTABLISHED, TRACED_PATHS)));
defFace('trace.duplicateJoinKeysPerMatch', 'duplicate join keys per match',
  '⚠ A RECEIPT: ledger rows landing on an already-occupied (decision tick, passerGid) key',
  'matches', (r) => r.traceDuplicateKeys, ONE);
defFace('trace.rowsWrittenPerMatch', 'ledger rows per match',
  '⚠ A RECEIPT: the size of the engine\'s own `passChoiceTrace` at full time', 'matches',
  (r) => r.traceRowsWritten, ONE);
/* ---- ⭐ THE CHOICE TICK (LN-C1's classes, inherited) ---- */
const EST_IDX = [CCI('arm'), CCI('release')];
const CH_VIEWS: { key: string; idx: number[] }[] = [
  { key: 'arm', idx: [CCI('arm')] }, { key: 'release', idx: [CCI('release')] },
  { key: 'established', idx: EST_IDX }, { key: 'none', idx: [CCI('none')] },
];
for (const v of CH_VIEWS) {
  defFace(`choice.${v.key}.passShare`, 'share',
    `the share of measured ground passes in the ${v.key} choice-tick class`,
    'measured ground passes', (r) => sumIdx(r.chClass, v.idx), (r) => r.gpFlights);
}
defFace('choice.established.caromShare', 'share',
  'R1 restricted to the established choice classes', 'established-class measured ground passes',
  (r) => sumIdx(r.chCarom, EST_IDX), (r) => sumIdx(r.chClass, EST_IDX));
defFace('choice.established.ownOpennessMean', 'openness (0 = a body on the line, 1 = clear)',
  '⭐⭐ THE CHOSEN LANE\'S OWN-OPENNESS at the choice, pooled over the established classes',
  'established-class passes with a choice geometry',
  (r) => sumIdx(r.chOwnOpenSum, EST_IDX), (r) => sumIdx(EST_IDX.map((i) => sum(r.chOwnOpenBins[i])), [0, 1]));
defFace('choice.established.opponentOpennessMean', 'openness (0 = a body on the line, 1 = clear)',
  'the SAME lane\'s OPPONENT-openness — what the chooser already saw',
  'established-class passes with a choice geometry',
  (r) => sumIdx(r.chOppOpenSum, EST_IDX), (r) => sumIdx(EST_IDX.map((i) => sum(r.chOwnOpenBins[i])), [0, 1]));
defFace('choice.established.ownOpenBelow40Share', 'share',
  `the share struck with own-openness below the chooser's own ${GATE_040} gate`,
  'established-class passes with a choice geometry',
  (r) => sumIdx(r.chOwnBelow40, EST_IDX), (r) => sumIdx(EST_IDX.map((i) => sum(r.chOwnOpenBins[i])), [0, 1]));
/* ---- ⭐⭐ THE LANE (LN-C0's own faces, reproduced) ---- */
defFace('lane.occupantsPerPass', 'own occupants per measured ground pass',
  'own OUTFIELD bodies (neither passer nor target) inside the WIDE corridor at release',
  'measured ground passes', (r) => r.occN, (r) => r.gpFlights);
defFace('lane.passesWithOccupantShare', 'share',
  'the share of measured ground passes with AT LEAST ONE own lane occupant at release',
  'measured ground passes', (r) => r.passesWithOcc, (r) => r.gpFlights);
defFace('lane.armRecordShare', 'share',
  'the share whose strike resolved a TRACKED wind-up record', 'measured ground passes',
  (r) => r.gpWithArm, (r) => r.gpFlights);
defFace('lane.noWindupShare', 'share', 'the share with NO wind-up record',
  'measured ground passes', (r) => r.gpNoArm, (r) => r.gpFlights);
for (const c of CAUSES) {
  defFace(`composition.${c}`, 'share',
    `LN-C0's OCCUPANT COMPOSITION — the ${c} share of own lane occupants`,
    'own lane occupants at release', (r) => r.causeN[LCI(c)], (r) => sum(r.causeN));
}
/* ---- ⭐⭐ 撞车 BESIDE (LN-C0 / PT-C0's crowd limbs) ---- */
defFace('crowd.crashShare', 'share',
  '⭐⭐ 撞车 — PT-C0\'s own face: the share of sampled attacking ticks whose MINIMUM PAIRWISE '
  + 'outfield distance is below DUP_RUN_M = 4 m. Published BESIDE, never gating',
  'sampled ticks with an attributable possession side', (r) => r.crashHits, (r) => r.crowdSamples);
defFace('crowd.dupRunPairsPerSample', 'pairs per sampled tick',
  'attacking outfield PAIRS closer than DUP_RUN_M = 4 m, per sample',
  'sampled ticks with an attributable possession side', (r) => r.dupRunSum, (r) => r.crowdSamples);
defFace('crowd.nearestMateMeanMetres', 'metres',
  'the mean nearest same-side outfielder distance', '(sampled tick, outfielder) pairs',
  (r) => r.spacingSum, (r) => r.spacingSamples);
/* ---- ⭐⭐⭐ THE GUARDS (F-LN′-b) AND THE BAND ---- */
defFace('guard.backwardPassShare', 'share',
  '⭐⭐⭐ G1 — THE BACKWARD-PASS SHARE, THE FIRST GUARD (a CEILING; UP is harmful): the share of '
  + 'measured ground passes whose STRUCK AIM OF RECORD has the chooser\'s own `gain` < 0, the '
  + 'form ANCHORED at `PlayerBrain.ts` l.641 and CALLED on the struck aim with the passer\'s '
  + '`localX` AT THE CHOICE', 'measured ground passes with a readable struck-aim gain',
  (r) => r.gpBackward, (r) => r.gpGainReadable);
defFace('guard.backwardGeometryShare', 'share',
  '⚠ G1\'s OWN DENOMINATOR RECEIPT: the share of measured ground passes carrying a readable '
  + 'struck-aim gain', 'measured ground passes', (r) => r.gpGainReadable, (r) => r.gpFlights);
defFace('guard.interceptionsPerMatch', 'interceptions per match',
  '⭐⭐ G3 (a CEILING): both sides\' `interceptions` on the 240 s match clock', 'matches',
  (r) => r.interceptions, ONE);
defFace('guard.offsidesPerMatch', 'offsides per match',
  '⭐ G6 — THE OFFSIDE LIMB in the #157 FLAG form: a resolved INCREASE raises a FLAG and flips '
  + 'NO gate', 'matches', (r) => r.offsides, ONE);
defFace('context.passCompletion', 'share',
  '⭐⭐ G2 (a FLOOR; DOWN is harmful): ALL deliveries, the engine\'s own stats', 'engine passes',
  (r) => r.passesCompleted, (r) => r.passes);
defFace('context.goalsPerMatch', 'goals per match',
  '⭐⭐ G4 (BOTH directions harmful): both sides, 240 s clock', 'matches', (r) => r.goals, ONE);
defFace('context.shotsPerMatch', 'shots per match',
  '⭐⭐ G5 (BOTH directions harmful): both sides', 'matches', (r) => r.shots, ONE);
defFace('context.ownedBallSampleShare', 'share',
  '⭐⭐ G7 (a FLOOR; DOWN is harmful): the share of sampled open-play ticks on which a body OWNS '
  + 'the ball', 'sampled open-play ticks', (r) => r.ownedSamples, (r) => r.crowdSampleTicks);
/* ---- ⭐ THE REMAINING SECONDARIES ---- */
defFace('context.groundPassesPerMatch', 'measured ground passes per match',
  '⭐ A SECONDARY: PT-C0\'s own volume face on the 240 s match clock', 'matches',
  (r) => r.gpFlights, ONE);
defFace('context.meanPassDistanceMetres', 'metres',
  '⭐ A SECONDARY: the mean launch→aim distance of a measured ground pass',
  'measured ground passes with a launch line', (r) => r.passDistSum, (r) => r.gpWithLine);
defFace('receipt.hasBallRecipeAgreesShare', 'share',
  '⚠ A RECEIPT: the share of measured releases at which the PRODUCTION `hasBall` recipe agrees '
  + 'with the exam\'s declared `hasBall = true` reconstruction argument', 'measured ground passes',
  (r) => r.hasBallRecipeAgrees, (r) => r.gpFlights);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; arm: Arm; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const armRows = (armK: Arm): Row[] => cells.map((c) => c.rows[armK]);
const faces: FaceRow[] = [];
for (const armK of ARMS) {
  const rows = armRows(armK);
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nu = rows.map((r) => f.num(r));
    const de = rows.map((r) => f.dn(r));
    const draws: number[] = [];
    for (const idx of resampleIndex) {
      let n = 0; let dd = 0;
      for (const i of idx) { n += nu[i]; dd += de[i]; }
      const v = ratio(n, dd);
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
  if (f === undefined) { banner(`LN-T1PB FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};
/** ⭐⭐ THE PAIRED Δ (arm − its control). The arms share seeds, so the interval is PAIRED by
 *  construction. ⭐ LOO in the CONSERVATIVE POINT-SHIFT form (BQ-T1's, #346/#348). */
interface DeltaRow {
  key: string; face: string; arm: Arm; control: Arm;
  controlValue: number; armValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  down: boolean; up: boolean; resolved: boolean; containsZero: boolean;
  looMaxInfluenceShare: number; looFlipsDown: number; looFlipsUp: number;
}
const pairedDelta = (faceKey: string, armK: Arm, controlK: Arm): DeltaRow => {
  const f = FACES[faceKey];
  const nA = cells.map((c) => f.num(c.rows[armK]));
  const dA = cells.map((c) => f.dn(c.rows[armK]));
  const nC = cells.map((c) => f.num(c.rows[controlK]));
  const dC = cells.map((c) => f.dn(c.rows[controlK]));
  const pA = ratio(sum(nA), sum(dA));
  const pC = ratio(sum(nC), sum(dC));
  const point = pA - pC;
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nA[i]; d1 += dA[i]; n2 += nC[i]; d2 += dC[i]; }
    const v = ratio(n1, d1) - ratio(n2, d2);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  const tNA = sum(nA); const tDA = sum(dA); const tNC = sum(nC); const tDC = sum(dC);
  let maxInf = 0; let flipsDown = 0; let flipsUp = 0;
  for (let i = 0; i < cells.length; i++) {
    const dLoo = ratio(tNA - nA[i], tDA - dA[i]) - ratio(tNC - nC[i], tDC - dC[i]);
    if (!Number.isFinite(dLoo)) continue;
    const inf = Math.abs(dLoo - point) / Math.max(Math.abs(point), 1e-12);
    if (inf > maxInf) maxInf = inf;
    const shift = dLoo - point;
    if ((hi < 0) !== (hi + shift < 0)) flipsDown += 1;
    if ((lo > 0) !== (lo + shift > 0)) flipsUp += 1;
  }
  return {
    key: `${faceKey}@${armK}`, face: faceKey, arm: armK, control: controlK,
    controlValue: pC, armValue: pA, delta: point,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(point), (hi - lo) / 2),
    down: hi < 0, up: lo > 0, resolved: hi < 0 || lo > 0,
    containsZero: !(hi < 0) && !(lo > 0),
    looMaxInfluenceShare: maxInf, looFlipsDown: flipsDown, looFlipsUp: flipsUp,
  };
};
const CONTROL_OF: Record<Arm, Arm | null> = {
  ABSENT: null, 'ARMED-ZERO': CONTROL_ARM, W025: CONTROL_ARM, W050: CONTROL_ARM,
  W100: CONTROL_ARM, 'D13-ABSENT': null, 'D13-W050': D13_CONTROL_ARM,
};
const DELTA_ARMS = ARMS.filter((a) => CONTROL_OF[a] !== null) as readonly Arm[];
const deltas: DeltaRow[] = DELTA_ARMS.flatMap(
  (a) => FACE_KEYS.map((k) => pairedDelta(k, a, CONTROL_OF[a] as Arm)),
);
const delta = (faceKey: string, armK: Arm): DeltaRow => {
  const dd = deltas.find((x) => x.face === faceKey && x.arm === armK);
  if (dd === undefined) { banner(`LN-T1PB FATAL — unknown Δ ${faceKey}@${armK}`); process.exit(3); }
  return dd as DeltaRow;
};

/* ========================================================================== */
/* §14 THE GUARDS, THE OFFSIDE FLAG, THE SELECTORS AND THE FROZEN READS         */
/* ========================================================================== */
/** ⭐⭐ THE GUARD ROWS — OBM-T1's tolerance form: tolerance = NI_FRACTION · |control level|,
 *  with NI_FRACTION INHERITED BY ANCHOR from LN-T1's own probe line and EVALUATED from its two
 *  numerals, never typed as a decimal (§3c). BREACH = resolved AND beyond tolerance IN THE
 *  HARMFUL DIRECTION. ⭐ G1 IS FIRST, as the ruling orders. */
type GuardDir = 'ceiling' | 'floor' | 'both';
const GUARD_LIMBS: readonly { id: string; key: string; direction: GuardDir; what: string }[] = [
  { id: 'G1', key: 'guard.backwardPassShare', direction: 'ceiling',
    what: 'THE BACKWARD-PASS SHARE — the chooser\'s own `gain` < 0 on the STRUCK aim of record. '
      + 'LN-C1\'s warning: the own-clear alternative points BACKWARD on 0.570033 of the passes '
      + 'that had one, so a price on our own bodies in the lane could buy its clearance by '
      + 'turning the ball round' },
  { id: 'G2', key: 'context.passCompletion', direction: 'floor',
    what: 'PASS COMPLETION — the engine\'s own stat over ALL deliveries' },
  { id: 'G3', key: 'guard.interceptionsPerMatch', direction: 'ceiling',
    what: 'INTERCEPTIONS per match, both sides' },
  { id: 'G4', key: 'context.goalsPerMatch', direction: 'both',
    what: 'GOALS per match — the exam claims NO effect, so EITHER direction beyond tolerance is '
      + 'a breach' },
  { id: 'G5', key: 'context.shotsPerMatch', direction: 'both',
    what: 'SHOTS per match — the same, both directions' },
  { id: 'G7', key: 'context.ownedBallSampleShare', direction: 'floor',
    what: 'POSSESSION — the share of sampled open-play ticks on which a body owns the ball' },
];
const TOLERANCE_FORM = 'NI_FRACTION · |controlLevel|, NI_FRACTION = 1 − 0.275/0.380 (PM-T1 §5, '
  + 'inherited from A4-S2P1-VECTOR-CENSUS §4) — INHERITED BY ANCHOR from '
  + '`scripts/probes/ln-t1-lane-exam.ts`\'s own line and EVALUATED FROM ITS TWO NUMERALS, never '
  + 'typed as a decimal; frozen ex ante at §P';
const guardRowFor = (armK: Arm, controlK: Arm) => GUARD_LIMBS.map((l) => {
  const control = face(l.key, controlK).value;
  const tol = NI_FRACTION * Math.abs(control);
  const d = delta(l.key, armK);
  const beyond = l.direction === 'ceiling' ? d.delta > tol
    : l.direction === 'floor' ? d.delta < -tol : Math.abs(d.delta) > tol;
  return {
    id: l.id, key: l.key, what: l.what, direction: l.direction, gating: true,
    controlArm: controlK, controlLevel: control, toleranceAbs: tol, toleranceForm: TOLERANCE_FORM,
    delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    absDeltaOverHalfWidth: d.absDeltaOverHalfWidth,
    resolved: d.resolved, beyondTolerance: beyond, breach: d.resolved && beyond,
    looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp,
  };
});
const GUARD_TABLE = Object.fromEntries(DELTA_ARMS.map(
  (a) => [a, guardRowFor(a, CONTROL_OF[a] as Arm)],
)) as Record<Arm, ReturnType<typeof guardRowFor>>;
/** ⭐ G6 — THE OFFSIDE LIMB in the #157 FLAG form: a RESOLVED INCREASE raises a FLAG and flips
 *  NO gate. Stored per arm; it enters neither `breach` nor `Q`. */
const OFFSIDE_ROWS = Object.fromEntries(DELTA_ARMS.map((a) => {
  const d = delta('guard.offsidesPerMatch', a);
  const control = face('guard.offsidesPerMatch', CONTROL_OF[a] as Arm).value;
  return [a, {
    id: 'G6', key: 'guard.offsidesPerMatch', controlLevel: control,
    delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    resolved: d.resolved, flag: d.resolved && d.delta > 0, gating: false,
  }];
})) as Record<Arm, { id: string; key: string; controlLevel: number; delta: number;
  ci: number[]; halfWidth: number; resolved: boolean; flag: boolean; gating: boolean }>;

/** ⭐⭐⭐ THE SELECTOR BOOLEANS, STORED PER ARM. */
const selectorFor = (armK: Arm) => {
  const r1 = delta('firstBody.ownNonTarget', armK);
  const kick = delta('family.KICKOFF-PLAYBACK.caromRate', armK);
  const breaches = GUARD_TABLE[armK].filter((g) => g.breach);
  return {
    arm: armK, control: CONTROL_OF[armK],
    r1Delta: r1.delta, r1Ci: [r1.ciLo, r1.ciHi], r1HalfWidth: r1.halfWidth,
    r1AbsDeltaOverHalfWidth: r1.absDeltaOverHalfWidth,
    r1Resolved: r1.resolved, r1Down: r1.down, r1Up: r1.up,
    r1LooFlipsDown: r1.looFlipsDown, r1LooFlipsUp: r1.looFlipsUp,
    kickDelta: kick.delta, kickCi: [kick.ciLo, kick.ciHi], kickHalfWidth: kick.halfWidth,
    kickResolved: kick.resolved, kickDown: kick.down, kickUp: kick.up,
    kickLooFlipsDown: kick.looFlipsDown, kickLooFlipsUp: kick.looFlipsUp,
    breach: breaches.length > 0,
    breachingGuards: breaches.map((g) => `${g.id} ${g.key}`),
    offsideFlag: OFFSIDE_ROWS[armK].flag,
  };
};
const SELECTORS = Object.fromEntries(DELTA_ARMS.map((a) => [a, selectorFor(a)])) as
  Record<Arm, ReturnType<typeof selectorFor>>;

/** ⭐⭐⭐ THE FROZEN READ LITERALS — copied VERBATIM from COMMANDER RULING #394 item 4(v), and
 *  NOT interpolated: the ruling's sentence is the sentence. The smallest qualifying dose and
 *  the breaching guards are STORED FIELDS beside it (`smallestQualifyingWeight`,
 *  `breachNamed`) and are printed as a SEPARATE annotation line, never spliced into the
 *  literal (doc-prose fidelity: the sentence is a face, the number is a field). */
const READ_LITERALS = {
  read1: 'THE PASSER SEES HIS OWN MEN AND THE CAROM FALLS — LN-ENTRY is named: world 14 = '
    + 'world 13 + the own-lane door at the SMALLEST qualifying dose.',
  read2: 'THE CAROM FALLS BUT A GUARD BREAKS — the dose is disqualified; the commander decides '
    + 'with the table.',
  read3: 'THE PRICE MOVES NOTHING THE USER SEES — the seam stays dormant; the commander decides '
    + 'with the table.',
} as const;
const H_LN_2_LITERALS = {
  holds: 'THE KICK-OFF TAP-BACK DID NOT MOVE — the restart SHAPE is named (H-LN-2 holds).',
  refuted: (w: string): string => `THE KICK-OFF TAP-BACK MOVED TOO (H-LN-2 refuted at ${w}).`,
} as const;
/** Q = the DOSES with `r1Down ∧ ¬breach`. ⛔ ARMED-ZERO is NOT a dose: FLAG-HYGIENE requires it
 *  to be byte-identical to the control, so its every Δ is exactly 0. Its booleans are stored. */
const Q = DOSES.filter((w) => SELECTORS[w].r1Down && !SELECTORS[w].breach);
const R1_DOWN_ANY = DOSES.some((w) => SELECTORS[w].r1Down);
const R1_DOWN_WITH_BREACH = DOSES.filter((w) => SELECTORS[w].r1Down && SELECTORS[w].breach);
const SMALLEST_QUALIFYING_DOSE: Dose | null = Q.length > 0 ? Q[0] : null;
const READ_SELECTED: 'read1' | 'read2' | 'read3' = Q.length > 0 ? 'read1'
  : R1_DOWN_ANY ? 'read2' : 'read3';
const BREACH_NAMED = R1_DOWN_WITH_BREACH
  .map((w) => `${w}: ${SELECTORS[w].breachingGuards.join(', ')}`).join(' · ');
const READ_SENTENCE = READ_LITERALS[READ_SELECTED];
/** the ANNOTATION printed on its OWN line beneath the read — every value a STORED field. */
const READ_ANNOTATION = READ_SELECTED === 'read1'
  ? `  ↳ the SMALLEST qualifying dose: w = ${DOSE_W[SMALLEST_QUALIFYING_DOSE as Dose]}`
  : READ_SELECTED === 'read2' ? `  ↳ the guard(s): ${BREACH_NAMED}`
    : '  ↳ no dose resolved R1 DOWN';
/** ⭐⭐ H-LN-2's OWN SENTENCE, on a STORED boolean over the doses. */
const KICK_DOWN_DOSES = DOSES.filter((w) => SELECTORS[w].kickDown);
const H_LN_2_REFUTED = KICK_DOWN_DOSES.length > 0;
const H_LN_2_SENTENCE = H_LN_2_REFUTED
  ? H_LN_2_LITERALS.refuted(`w = ${DOSE_W[KICK_DOWN_DOSES[0]]}`) : H_LN_2_LITERALS.holds;
/** ⭐⭐ THE COUNTERFACTUAL WORDS — canon, VERBATIM: "a counterfactual verdict sentence ('had X
 *  been scored, the rule would read W') quotes a word the instrument STORED by applying the
 *  frozen rule to X's stored interval". For EVERY dose arm: what the read would be if THAT arm
 *  alone were the whole table. */
const counterfactualWords = Object.fromEntries(DELTA_ARMS.map((a) => {
  const s = SELECTORS[a];
  const word = (s.r1Down && !s.breach) ? 'read1' : s.r1Down ? 'read2' : 'read3';
  return [a, {
    arm: a, word,
    sentence: READ_LITERALS[word as 'read1' | 'read2' | 'read3'],
    armWeight: ARM_WEIGHT[a], breachingGuards: s.breachingGuards,
    hLn2: s.kickDown ? H_LN_2_LITERALS.refuted(`w = ${ARM_WEIGHT[a] ?? 0}`)
      : H_LN_2_LITERALS.holds,
    note: 'the frozen rule APPLIED to THIS arm\'s stored intervals alone',
  }];
})) as Record<Arm, { arm: Arm; word: string; sentence: string; armWeight: number | null;
  breachingGuards: string[]; hLn2: string; note: string }>;
/** ⭐⭐ THE D13 PAIR — the form the user plays, printed BESIDE the read as the play-form
 *  receipt. It is NOT in Q and it selects nothing. */
const D13_PAIR = {
  arm: 'D13-W050' as Arm, control: 'D13-ABSENT' as Arm,
  r1: (() => { const d = delta('firstBody.ownNonTarget', 'D13-W050');
    return { delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
      absDeltaOverHalfWidth: d.absDeltaOverHalfWidth, resolved: d.resolved,
      down: d.down, up: d.up, controlValue: d.controlValue, armValue: d.armValue,
      looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp }; })(),
  kick: (() => { const d = delta('family.KICKOFF-PLAYBACK.caromRate', 'D13-W050');
    return { delta: d.delta, ci: [d.ciLo, d.ciHi], resolved: d.resolved, down: d.down }; })(),
  word: counterfactualWords['D13-W050'].word,
  sentence: counterfactualWords['D13-W050'].sentence,
  hLn2: counterfactualWords['D13-W050'].hLn2,
  breachingGuards: SELECTORS['D13-W050'].breachingGuards,
};
/** ⭐⭐ THE UNIVERSAL SENTENCES, STORED AS BOOLEANS (canon: a universal sentence about a table
 *  is a stored boolean or is not written). */
const UNIVERSALS = {
  everyDoseHasR1Down: DOSES.every((w) => SELECTORS[w].r1Down),
  noDoseHasR1Down: !R1_DOWN_ANY,
  everyDoseHasR1Up: DOSES.every((w) => SELECTORS[w].r1Up),
  noDoseHasR1Up: !DOSES.some((w) => SELECTORS[w].r1Up),
  everyGuardHeldOnEveryDose: DOSES.every((w) => !SELECTORS[w].breach),
  everyGuardHeldOnEveryDeltaArm: DELTA_ARMS.every((a) => !SELECTORS[a].breach),
  noOffsideFlagOnAnyDeltaArm: DELTA_ARMS.every((a) => !SELECTORS[a].offsideFlag),
  everyDoseHasKickDown: DOSES.every((w) => SELECTORS[w].kickDown),
  noDoseHasKickDown: !H_LN_2_REFUTED,
  armedZeroIsIdenticalOnEverySeed: FLAG_HYGIENE_OK,
  everyArmIsPerceptArmed: ARMS.every((a) => cells.every((c) => c.rows[a].perceivedChoiceOn)),
  everyArmIsWorld13: ARMS.every((a) => cells.every((c) => c.rows[a].worldOk)),
  theGeneIsAbsentFromEveryInfoGenome: ARMS.every((a) => gArmRows[a].seedsWithGeneOnInfoGenome === 0),
  theSeamMovesTheWorldOnEverySeedAtW100:
    LIVENESS.w100DifferingSeeds === LIVENESS.seeds && LIVENESS.seeds > 0,
};
const READS = {
  note: '⭐⭐ #394 item 4(v)\'s THREE SENTENCES are FROZEN LITERALS, copied VERBATIM into the '
    + 'instrument BEFORE any battery seed, and the H-LN-2 pair beside them. The selector is the '
    + 'STORED boolean set per DOSE; Q = the doses with `r1Down ∧ ¬breach`.',
  literals: {
    read1: READ_LITERALS.read1,
    read2: READ_LITERALS.read2,
    read3: READ_LITERALS.read3,
    hLn2Holds: H_LN_2_LITERALS.holds,
    hLn2RefutedTemplate: H_LN_2_LITERALS.refuted('<w>'),
  },
  doses: DOSES, doseWeights: DOSE_W,
  armedZeroExcludedWhy: 'FLAG-HYGIENE requires ARMED-ZERO to be byte-identical to ABSENT, so its '
    + 'every Δ is exactly 0 and it can never be a dose of record. Its booleans are STORED anyway.',
  selectors: SELECTORS,
  qualifyingDoses: Q,
  smallestQualifyingDose: SMALLEST_QUALIFYING_DOSE,
  smallestQualifyingWeight: SMALLEST_QUALIFYING_DOSE === null ? null
    : DOSE_W[SMALLEST_QUALIFYING_DOSE],
  r1DownAtAnyDose: R1_DOWN_ANY,
  r1DownWithBreachDoses: R1_DOWN_WITH_BREACH,
  selectedRead: READ_SELECTED,
  sentence: READ_SENTENCE,
  breachNamed: BREACH_NAMED,
  kickDownDoses: KICK_DOWN_DOSES,
  hLn2Refuted: H_LN_2_REFUTED,
  hLn2Sentence: H_LN_2_SENTENCE,
  counterfactualWords,
  d13Pair: D13_PAIR,
  universals: UNIVERSALS,
  annotation: READ_ANNOTATION,
  readListPrinted: [READ_SENTENCE, H_LN_2_SENTENCE],
};

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form                                      */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** ⭐⭐ THE SMOKE'S OWN REALISED PAIRED-Δ HALF-WIDTH, read out of the §DEV-PREFLIGHT scratch
 *  smoke artifact's own `deltas[].halfWidth` field (12 seeds, 900,004,300–311 — THIS stage's
 *  own FRESH scratch band, #395 item 4(iii)) and written here BEFORE the FREEZE commit and
 *  BEFORE any battery seed. ⛔ Never re-typed from the console's rounded print. The variance
 *  source is the CEILING arm W100 (LN-T1's form). */
const SMOKE_HW_R1 = 0.016692084284591215;
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'firstBody.ownNonTarget@W100',
    group: '⭐⭐⭐ R1 — THE USER\'S OWN FACE, the paired Δ against ABSENT at the CEILING dose',
    hwSmoke: SMOKE_HW_R1, target: 0.01 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN, nFrozen: N_FROZEN,
  };
});
const N_REQUIRED_MAX = Math.max(...sizingRows.map((r) => r.nRequired));
const N_BOUND_BY = N_FROZEN === Math.min(N_REQUIRED_MAX, BLOCK_AFFORDS)
  ? (N_REQUIRED_MAX <= BLOCK_AFFORDS ? 'the SIZING (N = max nRequired)'
    : 'the BLOCK\'s affordance (the sizing asked for more than the block holds)')
  : 'MISMATCH — the frozen N is not min(required, affordance)';
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0)
  && N_FROZEN === Math.min(N_REQUIRED_MAX, BLOCK_AFFORDS);

/* ==========================================================================
   ⭐ THE LOO RECEIPT — LEAVE-ONE-OUT on R1 PER DOSE and on `kickDown`, in the
   conservative point-shift form (already computed inside every `DeltaRow`).
   ⚠ A RECEIPT — it gates no direction, and the doc's LOO sentence is scoped to these rows.
   ========================================================================== */
const LOO_ROWS = DELTA_ARMS.flatMap((a) => [
  { face: 'firstBody.ownNonTarget', arm: a, ...(() => { const d = delta('firstBody.ownNonTarget', a);
    return { delta: d.delta, resolvedDown: d.down, resolvedUp: d.up,
      looMaxInfluenceShare: d.looMaxInfluenceShare,
      looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp, seedsDropped: cells.length }; })() },
  { face: 'family.KICKOFF-PLAYBACK.caromRate', arm: a,
    ...(() => { const d = delta('family.KICKOFF-PLAYBACK.caromRate', a);
      return { delta: d.delta, resolvedDown: d.down, resolvedUp: d.up,
        looMaxInfluenceShare: d.looMaxInfluenceShare,
        looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp,
        seedsDropped: cells.length }; })() },
]);
const LOO_OK = LOO_ROWS.every((r) => Number.isFinite(r.looMaxInfluenceShare)
  && Number.isInteger(r.looFlipsDown) && Number.isInteger(r.looFlipsUp))
  && LOO_ROWS.length === DELTA_ARMS.length * 2;

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
type Pooled = {
  firstBody: number[]; occPerPassBins: number[]; causeN: number[];
  nearBins: number[]; minPairBins: number[]; pairN: number[];
  chClass: number[]; chOwnOpenBins: number[][]; chOppOpenBins: number[][];
  chCaromByOwnBin: number[][]; chFirstBody: number[][];
  cpPass: number[]; cpCarom: number[]; cpGeom: number[]; cpCaromGeom: number[];
  cpShellPass: number[]; cpShellCarom: number[]; cpFirstBody: number[][];
  famPass: number[]; famCarom: number[]; famGeom: number[]; famCaromGeom: number[];
  famShellPass: number[]; famShellCarom: number[];
  famOwnBinShell: number[][]; famCaromOwnBinShell: number[][];
  famByPath: number[][]; famBySite: number[][]; famChoiceClass: number[][];
  famFirstBody: number[][]; famCaromPresence: number[][]; famCaromByClass: number[][];
  siteCount: number[]; siteCarom: number[]; otherCombos: number[];
};
const emptyPooled = (): Pooled => ({
  firstBody: zeros(CONTACTS.length), occPerPassBins: zeros(OCC_BINS),
  causeN: zeros(CAUSES.length), nearBins: zeros(NEAR_BINS), minPairBins: zeros(MINPAIR_BINS),
  pairN: zeros(PAIRS.length),
  chClass: zeros(CHOICE_CLASSES.length),
  chOwnOpenBins: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOppOpenBins: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chCaromByOwnBin: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chFirstBody: zeros2(CHOICE_CLASSES.length, CONTACTS.length),
  cpPass: zeros(CP_CELLS), cpCarom: zeros(CP_CELLS), cpGeom: zeros(CP_CELLS),
  cpCaromGeom: zeros(CP_CELLS), cpShellPass: zeros(CP_CELLS), cpShellCarom: zeros(CP_CELLS),
  cpFirstBody: zeros2(CP_CELLS, CONTACTS.length),
  famPass: zeros(FAMILIES.length), famCarom: zeros(FAMILIES.length),
  famGeom: zeros(FAMILIES.length), famCaromGeom: zeros(FAMILIES.length),
  famShellPass: zeros(FAMILIES.length), famShellCarom: zeros(FAMILIES.length),
  famOwnBinShell: zeros2(FAMILIES.length, OPEN_BINS * 2),
  famCaromOwnBinShell: zeros2(FAMILIES.length, OPEN_BINS * 2),
  famByPath: zeros2(FAMILIES.length, PATHS.length),
  famBySite: zeros2(FAMILIES.length, SITES.length),
  famChoiceClass: zeros2(FAMILIES.length, CHOICE_CLASSES.length),
  famFirstBody: zeros2(FAMILIES.length, CONTACTS.length),
  famCaromPresence: zeros2(FAMILIES.length, CAROM_PRESENCE.length),
  famCaromByClass: zeros2(FAMILIES.length, CHOICE_CLASSES.length),
  siteCount: zeros(SITES.length), siteCarom: zeros(SITES.length),
  otherCombos: zeros(OTHER_CELLS),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto(p.firstBody, r.firstBody); addInto(p.occPerPassBins, r.occPerPassBins);
    addInto(p.causeN, r.causeN); addInto(p.nearBins, r.nearBins);
    addInto(p.minPairBins, r.minPairBins); addInto(p.pairN, r.pairN);
    addInto(p.chClass, r.chClass);
    addInto2(p.chOwnOpenBins, r.chOwnOpenBins); addInto2(p.chOppOpenBins, r.chOppOpenBins);
    addInto2(p.chCaromByOwnBin, r.chCaromByOwnBin); addInto2(p.chFirstBody, r.chFirstBody);
    addInto(p.cpPass, r.cpPass); addInto(p.cpCarom, r.cpCarom); addInto(p.cpGeom, r.cpGeom);
    addInto(p.cpCaromGeom, r.cpCaromGeom); addInto(p.cpShellPass, r.cpShellPass);
    addInto(p.cpShellCarom, r.cpShellCarom); addInto2(p.cpFirstBody, r.cpFirstBody);
    addInto(p.famPass, r.famPass); addInto(p.famCarom, r.famCarom);
    addInto(p.famGeom, r.famGeom); addInto(p.famCaromGeom, r.famCaromGeom);
    addInto(p.famShellPass, r.famShellPass); addInto(p.famShellCarom, r.famShellCarom);
    addInto2(p.famOwnBinShell, r.famOwnBinShell);
    addInto2(p.famCaromOwnBinShell, r.famCaromOwnBinShell);
    addInto2(p.famByPath, r.famByPath); addInto2(p.famBySite, r.famBySite);
    addInto2(p.famChoiceClass, r.famChoiceClass); addInto2(p.famFirstBody, r.famFirstBody);
    addInto2(p.famCaromPresence, r.famCaromPresence);
    addInto2(p.famCaromByClass, r.famCaromByClass);
    addInto(p.siteCount, r.siteCount); addInto(p.siteCarom, r.siteCarom);
    addInto(p.otherCombos, r.otherCombos);
  }
  return p;
};
const mediansFrom = (p: Pooled): Record<string, unknown> => ({
  nearestMateMetres: binMedian(p.nearBins, NEAR_BIN_M, false),
  minPairwiseMetres: binMedian(p.minPairBins, MINPAIR_BIN_M, false),
});
const pooled = {} as Record<Arm, Pooled>;
const medians = {} as Record<Arm, Record<string, unknown>>;
for (const armK of ARMS) {
  pooled[armK] = poolFrom(armRows(armK));
  medians[armK] = mediansFrom(pooled[armK]);
}
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const tot = (armK: Arm, pick: (r: Row) => number): number =>
  armRows(armK).reduce((a, r) => a + pick(r), 0);
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED];
const allRows = (armK: Arm): Row[] => [...armRows(armK), receiptRows[armK]];
const REPRO_CROWD_OK = ARMS.every((armK) => allRows(armK).every(
  (r) => r.crashHits === r.crashHitsAlt && r.dupRunSum === r.dupRunSumAlt,
));
/** ⭐ THE PUBLISHED LEDGER, QUOTED (#395 item 8) — the frontier and the consumed intervals. */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'LN-C0 battery block (#388 item 2)', range: [12_544_000, 12_544_999] },
  { name: 'LN-T1 battery block (#389 item 4)', range: [12_545_000, 12_545_999] },
  { name: 'LN-C1 battery block (#390 item 4)', range: [12_546_000, 12_546_999] },
  { name: 'LN-C2 battery block (#392 item 8)', range: [12_547_000, 12_547_999] },
  { name: 'LN-C3 battery block (#393 item 7)', range: [12_548_000, 12_548_999] },
  { name: 'LN-T1′ battery block (#395 item 8)', range: [12_549_000, 12_549_999] },
];
const PUBLISHED_FRONTIER_AT_395: number = 12_550_000;
const SEED_DISJOINT = (BLOCK_BASE as number) === PUBLISHED_FRONTIER_AT_395
  && CONSUMED.every((c) => BLOCK_TOP < c.range[0] || BLOCK_BASE > c.range[1])
  && (IS_OVERRIDE
    ? walkedSeeds.every((s) => s >= 900_000_000) && RECEIPT_SEED >= 900_000_000
    : walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED))
  && ALL_SCRATCH.every((s) => s >= 900_000_000)
  && REPRO_LNC3_SEEDS.every((s) => s >= 12_548_000 && s <= 12_548_999)
  && REPRO_LNT1P_SEEDS.every((s) => s >= 12_549_000 && s <= 12_549_999);
const TWO_FRACTIONS_OK = faces.every((f) => Number.isFinite(f.numerator)
  && Number.isFinite(f.denominator)
  && (f.denominator === 0 ? Number.isNaN(f.value) : f.value === f.numerator / f.denominator));
/** ⭐⭐ gStage — the artifact's own instrument receipt (LN-C3 §COMMANDER CORRECTIONS item 1). */
const SELF_BYTES = readFileSync(SELF_PATH, 'utf8');
const SELF_SHA = sha(SELF_BYTES);

/* ==========================================================================
   ⭐⭐⭐ LN-T1′b CHANGES (a) + (b) — THE LEDGER-JOIN BLOCK: the DEMOTED conjunct as a published
   RECEIPT, and the JOIN DIAGNOSIS off the engine's own wind-up ledger.
   ========================================================================== */
const LEDGER_ROW_SHARE_BY_FAMILY = Object.fromEntries(ARMS.map((armK) => [armK,
  Object.fromEntries(UNTRACED_FAMILIES.map((fam) => {
    const nu = tot(armK, (r) => TRACED_PATHS.reduce(
      (a, p) => a + r.famByPath[FMI(fam)][PTI(p)], 0));
    const de = tot(armK, (r) => r.famPass[FMI(fam)]);
    return [fam, { numerator: nu, denominator: de, share: ratio(nu, de) }];
  })),
])) as Record<Arm, Record<string, { numerator: number; denominator: number; share: number }>>;
/** ⭐ THE IDENTITY LN-T1′ ASSERTED, now an OBSERVATION per arm. It gates NOTHING. */
const UNTRACED_IDENTITY_BY_ARM = Object.fromEntries(ARMS.map((armK) => [armK,
  tot(armK, (r) => sumIdx(r.famPass, UNTRACED_FAM_IDX))
    === tot(armK, (r) => sumIdx(r.cpPass, cpIdx(CHOICE_CLASSES, ['untraced'])))
    && tot(armK, (r) => sumIdx(r.famCarom, UNTRACED_FAM_IDX))
      === tot(armK, (r) => sumIdx(r.cpCarom, cpIdx(CHOICE_CLASSES, ['untraced']))),
])) as Record<Arm, boolean>;
const DISAGREEMENT_ROWS_BY_ARM = Object.fromEntries(ARMS.map((armK) => [armK,
  cells.flatMap((c) => c.rows[armK].joinDisagreements.map(
    (dg) => ({ seed: c.seed, arm: armK, ...dg })),
  ),
])) as Record<Arm, (JoinDisagreement & { seed: number; arm: Arm })[]>;
const DISAGREEMENT_ROWS_ALL = ARMS.flatMap((armK) => DISAGREEMENT_ROWS_BY_ARM[armK]);
const DISAGREEMENT_COUNTS_BY_ARM = Object.fromEntries(ARMS.map((armK) => [armK, {
  untracedFamilyWithLedgerRow: tot(armK, (r) => r.joinUntracedFamilyWithLedgerRow),
  tracedFamilyWithoutLedgerRow: tot(armK, (r) => r.joinTracedFamilyWithoutLedgerRow),
  measuredGroundPasses: tot(armK, (r) => r.gpFlights),
}]));
/** ⭐⭐ THE STORED BOOLEAN — WRITTEN ONLY IF THE LIST IS NON-EMPTY (canon **counterfactual words
 *  are stored**: a universal about a table is a stored boolean or is not written). */
const EVERY_DISAGREEMENT_IS_A_KICKOFF_WITH_AN_UNSTRUCK_WINDUP: boolean | null
  = DISAGREEMENT_ROWS_ALL.length === 0 ? null
    : DISAGREEMENT_ROWS_ALL.every((dg) => dg.site === 'kickoffPlayback'
      && dg.windupArmedNotStruckBeforeRestart);
const EVERY_DISAGREEMENT_IS_A_KICKOFF: boolean | null
  = DISAGREEMENT_ROWS_ALL.length === 0 ? null
    : DISAGREEMENT_ROWS_ALL.every((dg) => dg.site === 'kickoffPlayback');
const EVERY_DISAGREEMENT_HAS_AN_UNSTRUCK_WINDUP: boolean | null
  = DISAGREEMENT_ROWS_ALL.length === 0 ? null
    : DISAGREEMENT_ROWS_ALL.every((dg) => dg.windupArmedNotStruckBeforeRestart);

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.cushionOk
      && r.seamsAbsent && r.rcBfAbsent && r.ctbPlaneShut && r.emergentOn
      && r.snapshotLawAbsent && r.perceivedChoiceOn && r.traceOn
      && r.lnFlag === ARM_FLAG[armK]
      && r.lnWeightEff === (ARM_WEIGHT[armK] ?? 0)
      && r.lnWeightBase === (ARM_WEIGHT[armK] ?? 0)
      && r.lnWeightInfo === 0 && !r.lnGeneOnInfoGenome))
      && WORLD_PIN_OK && EMERGENT_POS_ON,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`bqArmedVersion(m) === ${BQ_WORLD_VERSION}\`; \`bqCushion\` TRUE; the step-② seams `
      + 'ABSENT (`obmMovement` / `ctbSupportPlane`); every RC/BF flag ABSENT; `emergentPosOn()` '
      + `TRUE so \`formationSpot\` takes the ${FORMATION_SPOT_PATH}; \`inSnapshotLaw\` ABSENT `
      + 'while `edsPerceivedChoice` is TRUE (so the pass chooser reads the TRUTH team objects, '
      + 'and `team.genome` at the seat IS the truth team\'s `effGenome` — §5b\'s anchor chain); '
      + '`traceChoice` TRUE by CONSTRUCTION on every walked match and FALSE on the untraced '
      + 'lockstep twin; `bkGroundCorridor` and `dxWindupAim` OPEN; the world\'s '
      + `\`dvExposureWeight\` READ off the effective genome as a RECEIPT (${DV_EXPOSURE_WEIGHT_READ}). `
      + '⭐⭐⭐ AND THE ARM AS CONSTRUCTED: `lnOwnLanePrice` is exactly what the arm declares, '
      + '`lnOwnLaneWeight` READS BACK as the arm\'s dose off BOTH anchored views (`effGenome` '
      + 'and `baseGenome`) of BOTH teams, and `info.genome` carries NO `lnOwnLaneWeight` KEY at '
      + 'all and reads 0',
  },
  gDoseSource: {
    ok: DOSED_ARM_REACHABLE && L3_DOSE_BYTES_SHA === L3_DOSE_PIN
      && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The D13 pair takes its books from the SHIPPED LOADERS '
      + `(\`loadL3Dose\` / \`loadPcDose\`, CALLED); this gate hashes the FILE BYTES read from `
      + `${L3_DOSE_FILE} and ${PC_DOSE_FILE} and compares them to the values PINNED in #388 `
      + `item 2(i). ⚠ \`pcDoseGuard.bytesChecked\` is ${pcDoseGuard.bytesChecked} under bare `
      + 'node, which is exactly why this gate hashes the bytes independently',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites — LN-T0's OWN `
      + 'SEAM (the hoisted seat, the three price sites, the scope site, the hook\'s declaration, '
      + 'the flag, the gene and its accessor, the seat module\'s three functions) · THE DOSE '
      + 'ANCHOR CHAIN (`team.genome` at the seat → `Team`\'s getter → `effGenome` rebuilt from '
      + '`baseGenome` → `applyMentality`\'s spread) · G1\'s GAIN FORM and the passer\'s `localX` '
      + '· THE GUARD TOLERANCE (`NI_FRACTION` as an EXPRESSION in LN-T1\'s probe AND in '
      + 'OBM-T1\'s, both read, both required to agree) · LN-C3\'s family records, EVERY STRIKE '
      + 'SITE, the ledger\'s one write site, the corridor and shell constants, PT-C0\'s '
      + 'population ladders, world 13\'s own composition. ⭐ `a4World.ts` names `lnOwnLane` '
      + 'ZERO times — the world is untouched by the seam, and the count IS the anchor. The '
      + `ACTION vocabulary (${ACTIONS.length}) is READ OFF \`ActionType\`'s OWN union; the two `
      + `binning edges (${GATE_040} / ${GATE_045}) are EXTRACTED from the chooser's own gates`,
  },
  gCodeFactGraph: {
    ok: CODE_FACT_GRAPH_OK,
    note: '⭐⭐⭐ canon, VERBATIM: "…the callee list is EXTRACTED from the hashed text — every '
      + 'identifier called within the span, resolved to its definition and hashed — never '
      + 'typed, and a declared edge absent from the text, or a call present in the text and '
      + `absent from the graph, is RED". ${ROOT_SPANS.length} ROOTS (the THREE price sites and `
      + `the SEAT MODULE's three functions) were anchored and hashed; ${GRAPH_NODES.length} `
      + `nodes in all, of which ${GRAPH_NODES.filter((n) => n.discovered).length} were `
      + 'DISCOVERED by extraction and located by their own definition patterns, each hashed over '
      + 'a BRACKET-BALANCED span so no end needle is ever typed for a discovered node. '
      + `${GRAPH_UNRESOLVED.length} identifiers unresolved. The ${GRAPH_BOUNDARY.length} `
      + 'BOUNDARY callee(s) are calls in STATEMENT POSITION — their return value is discarded, '
      + 'so nothing they return can enter a price — and each is stored with that reason. ⚠ '
      + 'THESE ARE CODE READS, NOT MEASUREMENTS',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK_ALL,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — PT-C0\'s population and first-body ladders, BN-C0\'s corridor test on '
      + 'constructed geometry, the spot-in-lane test, the designation read, the occupant cause '
      + 'and pair precedences, the present/arrived split, the crowd limbs and their second '
      + 'implementations, the path classes, the substitution direction, ⭐⭐⭐ G1\'s GAIN FORM on '
      + 'constructed geometry (level / forward / backward / both clamps), the COMMENT-AND-STRING '
      + 'STRIPPER the call-graph extractor runs on, and the SHIPPED `lnOwnLaneWeightOf` accessor '
      + 'at every dose this exam writes',
  },
  gShellFixtures: {
    ok: FIXTURES.filter((f) => f.name.startsWith('shell.') || f.name.startsWith('ownOpenness.')
      || f.name.startsWith('path.') || f.name.startsWith('subDir.')).every((f) => f.ok),
    note: '⭐⭐ THE SHIPPED `groundShellHazard` AND `laneOpenness` CALLED ON HAND-BUILT '
      + `GEOMETRIES — ${FIXTURES.filter((f) => f.name.startsWith('shell.')).length} shell `
      + `fixtures and ${FIXTURES.filter((f) => f.name.startsWith('ownOpenness.')).length} `
      + 'lane-openness fixtures (the population rule — own outfield minus passer minus target — '
      + 'pinned as a composition, the 1.5 m clear guard on both sides of its own radius, the 4 m '
      + `normaliser, the worst-body rule). The shell is \`coreRadius + BALL_RADIUS\` = ${SHELL_M} `
      + 'm from the shipped constants',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((armK) => tot(armK, (r) => r.gpFlights) > 0
      && tot(armK, (r) => sum(r.causeN)) > 0
      && tot(armK, (r) => r.crashHits) > 0
      && tot(armK, (r) => r.gpGainReadable) > 0
      && tot(armK, (r) => r.gpBackward) > 0
      && tot(armK, (r) => r.chClass[CCI('arm')]) > 0
      && tot(armK, (r) => r.chClass[CCI('release')]) > 0
      && tot(armK, (r) => r.firstBody[CTI('ownNonTarget')]) > 0
      && tot(armK, (r) => r.offsides) > 0
      && FAMILIES.filter((f) => f !== 'OTHER')
        .every((f) => tot(armK, (r) => r.famPass[FMI(f)]) > 0)
      && FAMILIES.filter((f) => f !== 'OTHER')
        .every((f) => tot(armK, (r) => r.famGeom[FMI(f)]) > 0)
      && tot(armK, (r) => r.famCarom[FMI('KICKOFF-PLAYBACK')]) > 0
      && SITES.every((st) => tot(armK, (r) => r.siteCount[STI(st)]) > 0)
      && tot(armK, (r) => sumIdx(r.cpPass, cpIdx(ESTABLISHED, ['substituted']))) > 0
      && tot(armK, (r) => sumIdx(r.cpPass, cpIdx(ESTABLISHED, LEGACY_PATHS))) > 0
      && tot(armK, (r) => sumIdx(r.cpPass, cpIdx(ESTABLISHED, ['untraced']))) > 0),
    note: '⛔ NO FACE IS COMPUTED ON AN EMPTY CLASS, on EVERY ONE of the seven arms: measured '
      + `ground passes (ABSENT ${tot('ABSENT', (r) => r.gpFlights)}), CAROMS (ABSENT `
      + `${tot('ABSENT', (r) => r.firstBody[CTI('ownNonTarget')])}), passes with a readable `
      + `STRUCK-AIM GAIN (ABSENT ${tot('ABSENT', (r) => r.gpGainReadable)}) of which BACKWARD `
      + `(ABSENT ${tot('ABSENT', (r) => r.gpBackward)}), OFFSIDES (ABSENT `
      + `${tot('ABSENT', (r) => r.offsides)}), 撞车 ticks (ABSENT `
      + `${tot('ABSENT', (r) => r.crashHits)}), the KICKOFF-PLAYBACK family's own caroms (ABSENT `
      + `${tot('ABSENT', (r) => r.famCarom[FMI('KICKOFF-PLAYBACK')])}), every named family, `
      + 'every strike site and all three ledger path classes. ⚠ `OTHER` is DELIBERATELY not '
      + 'required to be non-empty — an empty `OTHER` is a RESULT of the frozen rule. ⚠ LIVENESS '
      + 'only — never a direction, never a magnitude',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER: observation is pure per-tick reads of public '
      + '`Match` / `Team` state after `m.step(DT)`, and every shipped function it calls is a '
      + 'PURE query. Proven anyway — the same scratch seed walked OBSERVED and UNOBSERVED yields '
      + `a BYTE-IDENTICAL whole-match signature on all ${lockstepRows.length} arm × `
      + 'out-of-band-scratch-seed walks (all SEVEN arms, the dosed ones included)',
  },
  gLockstepTrace: {
    ok: LOCKSTEP_TRACE_OK,
    note: '⭐⭐ THE LEDGER IS BYTE-INERT, RE-PROVED AT THIS HEAD AND UNDER THE DOSE: the SAME arm '
      + 'at the SAME out-of-band scratch seed, once with `traceChoice: true` and once with '
      + '`traceChoice: false`, gives an IDENTICAL whole-match signature (rng stream state '
      + `included) on all ${lockstepTraceRows.length} arm × seed pairs, while the ledger held `
      + 'rows only on the traced walks. ⛔ Had they differed the exam would have STOPPED before '
      + 'any battery seed',
  },
  gFlagHygiene: {
    ok: FLAG_HYGIENE_OK,
    note: '⭐⭐⭐ ARMED-ZERO ≡ ABSENT ON EVERY SEED. `lnOwnLanePrice: true` with the gene ABSENT '
      + 'runs the scope statement, both subtractions and the perceived factor — and the world is '
      + `BYTE-IDENTICAL: ${hygieneRows.length} seeds compared over `
      + `${hygieneRows[0]?.fieldsCompared ?? 0} row fields each, ${HYGIENE_DIFFERING} differing, `
      + `and the WHOLE-MATCH SIGNATURE (score, phase, ball, every body's position / velocity / `
      + `heading / stamina AND THE RNG STREAM STATE) identical on ${HYGIENE_SIGNATURES_IDENTICAL}`
      + `/${cells.length}. ⚠ THE EXCLUDED FIELDS ARE THE ARM DEFINITION ITSELF — `
      + `\`${HYGIENE_EXCLUDED_FIELDS.join('`, `')}\` — and they are excluded BY NAME, never `
      + 'quietly dropped',
  },
  gArm: {
    ok: G_ARM_OK,
    note: '⭐⭐⭐ THE DOSE IS WHERE THE BRAIN READS IT. On EVERY dosed seed the gene reads back as '
      + 'the arm\'s own dose off `effGenome` AND `baseGenome` of BOTH teams (the ANCHORED views '
      + 'of §5b), and `info.genome` carries NO `lnOwnLaneWeight` key and reads 0 — canon, '
      + 'VERBATIM: "dose NEVER in info.genome; truth-dosing writes census values through the '
      + 'effective genome". '
      + '⭐⭐⭐ LN-T1′b CHANGE (c): the read-back is taken PER TEAM (side 0 and side 1 '
      + 'SEPARATELY, never a `Math.max` over the two) at CONSTRUCTION **and** at FULL TIME, on '
      + '`effGenome`, `baseGenome`, `info.genome` and the KEY\'s own presence — #395 item '
      + `4(i)(c) / LN-T1′ §CORR 2. perTeamOk ${G_ARM_PER_TEAM_OK}. ⭐ LIVENESS, because the `
      + 'seam has no counter of its own: the WHOLE-MATCH SIGNATURE differs between ABSENT and '
      + 'W100 on '
      + `${LIVENESS.w100DifferingSeeds}/${LIVENESS.seeds} seeds (W050 `
      + `${LIVENESS.w050DifferingSeeds}, W025 ${LIVENESS.w025DifferingSeeds}, the D13 pair `
      + `${LIVENESS.d13DifferingSeeds})`,
  },
  gReproLnc3: {
    ok: REPRO_OK_LNC3,
    note: `⭐⭐ G-REPRO-LNC3 — LN-C3's OWN seeds ${REPRO_LNC3_SEEDS[0]}–`
      + `${REPRO_LNC3_SEEDS[REPRO_LNC3_N - 1]} RE-WALKED on the ABSENT arm with the trace ON and `
      + `matched FIELD FOR FIELD against the COMMITTED artifact (${LNC3_ARTIFACT}, file `
      + `byte-hash ${LNC3_FILE_SHA}): ${REPRO_FIELDS_COMPARED} field comparisons over every `
      + `field the two instruments SHARE, ${REPRO_MISMATCHES} mismatches. ⭐⭐ THIS IS THE `
      + 'DORMANCY RECEIPT IN THE CENSUS\'S OWN ARITHMETIC: with the flag off the world is '
      + 'byte-identical to the head LN-C3 walked, so zero mismatches is what dormancy MEANS. '
      + `The ONE excluded shared field is \`${REPRO_EXCLUDED_FIELDS.join('`, `')}\` (a machine `
      + 'timing). ⛔ RE-WALKS, NOT CONSUMPTION',
  },
  gReproLnt1p: {
    ok: REPRO_OK_LNT1P,
    note: `⭐⭐⭐ G-REPRO-LNT1P (LN-T1′b CHANGE (e)) — LN-T1′'s OWN seeds ${REPRO_LNT1P_SEEDS[0]}–`
      + `${REPRO_LNT1P_SEEDS[REPRO_LNT1P_N - 1]} RE-WALKED on ALL ${ARMS.length} ARMS with THIS `
      + `instrument and matched FIELD FOR FIELD against LN-T1′'s artifact (${LNT1P_ARTIFACT}, `
      + `file byte-hash ${LNT1P_FILE_SHA}, hashed body `
      + `${lnt1pDisk.hashedBodySha256}, allGreen ${lnt1pDisk.allGreen}): `
      + `${REPRO_LNT1P_FIELDS} field comparisons over every field the two runs SHARE `
      + `(${LNT1P_THEIR_KEYS.length - REPRO_LNT1P_EXCLUDED_FIELDS.length} shared fields per `
      + `arm per seed), ${REPRO_LNT1P_MISMATCHES} mismatches. ⭐⭐ THE IDENTITY RECEIPT BETWEEN `
      + 'THE TWO RUNS: the walker and the observation are the SAME — only the RECEIPTS changed '
      + '— so zero mismatches is what "FIVE declared changes and nothing else" means in the '
      + `parent run's own arithmetic. The ONE excluded SHARED field is `
      + `\`${REPRO_LNT1P_EXCLUDED_FIELDS.join('`, `')}\` (a machine timing). The `
      + `${REPRO_LNT1P_NEW_FIELDS.length} field(s) THIS instrument ADDS are absent from `
      + `LN-T1′'s cells and so are not shared at all: \`${REPRO_LNT1P_NEW_FIELDS.join('`, `')}\`. `
      + '⛔ RE-WALKS, NOT CONSUMPTION',
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
        && walksBooked === (N_FROZEN + 1) * ARMS.length * 2
        && ALL_SCRATCH.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length * 2
        && ALL_SCRATCH.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds: every battery seed and '
      + `the construction receipt lie inside block ${BLOCK_BASE}–${BLOCK_TOP}, each seed is `
      + `walked ONCE PER ARM (${ARMS.length} arms) in EACH of the TWO X-DET passes ⇒ `
      + `${walksBooked} walks booked; the unwalked tail is DECLARED in the \`seeds\` block; and `
      + 'EVERY scratch seed this instrument walks is out-of-band (≥ 900,000,000) and STORED',
  },
  gSeedDisjoint: {
    ok: SEED_DISJOINT,
    note: 'SEED-DISJOINT against the PUBLISHED ledger: the block base equals the frontier of '
      + `record at #395 item 8 (${PUBLISHED_FRONTIER_AT_395}); the block `
      + `${BLOCK_BASE}–${BLOCK_TOP} is disjoint from every quoted consumed interval `
      + `(${CONSUMED.map((c) => `${c.name} ${c.range[0]}–${c.range[1]}`).join(' · ')}); and the `
      + 'G-REPRO-LNC3 seeds lie inside LN-C3\'s OWN already-consumed block, and the '
      + 'G-REPRO-LNT1P seeds inside LN-T1′\'s OWN already-consumed block — both DECLARED '
      + 'RE-WALKS, not consumption',
  },
  xDet: {
    ok: X_DET,
    note: `⭐⭐ THE WHOLE CORE RUN TWICE: ${N} seeds × ${ARMS.length} arms + the construction `
      + 'receipt, walked from scratch a second time, and the two digests over every per-seed row '
      + 'are BYTE-IDENTICAL (`wallMs`, a machine timing, is the ONE field excluded and it is '
      + `named here). digestA ${digestA.slice(0, 16)}… digestB ${digestB.slice(0, 16)}…`,
  },
  xFpProd: {
    ok: X_FP_PROD,
    note: '⭐⭐ THE PRODUCTION FINGERPRINT, RECOMPUTED IN-PROBE (#181.2): '
      + `${FINGERPRINT_SEASONS} seasons at seed ${FINGERPRINT_SEED} through the SHIPPED `
      + '`League` / `runHeadless` path, hashed. The baseline is EXTRACTED from OBM-T1\'s own '
      + `probe line, never re-typed. observed ${fpObserved} · baseline ${FINGERPRINT_BASELINE}`,
  },
  gTwoFractions: {
    ok: TWO_FRACTIONS_OK,
    note: 'EVERY published face carries its own NUMERATOR and DENOMINATOR and its value is '
      + `exactly their ratio (or NaN on an empty denominator): ${faces.length} face rows over `
      + `${FACE_KEYS.length} keys × ${ARMS.length} arms`,
  },
  gLoo: {
    ok: LOO_OK,
    note: '⭐ LEAVE-ONE-OUT on R1 PER DOSE ARM and on the KICKOFF-PLAYBACK carom rate (the '
      + `\`kickDown\` face), ${LOO_ROWS.length} rows: drop each seed, re-derive the paired Δ, `
      + 'and count a FLIP when the conservative point shift would move the interval across zero. '
      + '⚠ A RECEIPT — it gates no direction, and the doc\'s LOO sentence is scoped to these rows',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms × 2 X-DET passes. N was SIZED at a DECLARED 0.01 `
        + `ABSOLUTE target on R1's paired Δ from the CEILING arm W100: nRequired = ${
          N_REQUIRED_MAX}, the block affords ${BLOCK_AFFORDS}, and N = min(the two) = `
        + `${N_FROZEN} — BOUND BY ${N_BOUND_BY}`,
  },
  gReproduceCrowd: {
    ok: REPRO_CROWD_OK,
    note: '⭐ PT-C0\'s CROWD ARITHMETIC REPRODUCES: the two quantities 撞车 rests on are '
      + 'recomputed by a SECOND, independently shaped implementation on EVERY sampled tick of '
      + `EVERY walked match and the receipt of all ${ARMS.length} arms, and the two agree cell `
      + 'for cell',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon: "an artifact is written as compact JSON")           */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((armK) => [armK, c.rows[armK]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'allGreen', 'faces', 'deltas', 'guards', 'offsides', 'reads', 'medians',
  'bins', 'definitions', 'arms', 'dosePlacement', 'causes', 'pairClasses', 'designations',
  'presence', 'contactClasses', 'actions', 'families', 'strikeSites', 'pathClasses',
  'choiceTick', 'doseSource', 'worldPin', 'seeds', 'stats', 'anchoredSites', 'fixtures',
  'lockstep', 'lockstepTrace', 'flagHygiene', 'gArm', 'liveness', 'perf', 'sizing', 'loo',
  'reproLnc3', 'reproLnt1p', 'ledgerJoin', 'xDet', 'xFpProd', 'codeFactGraph',
  'lnC3KickoffSpan',
  'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'LN-T1PB',
    title: '「传球者看见自己人 · 考试 · 重走」 THE OWN-LANE EXAM, RE-RUN — does the own-lane price, at doses '
      + 'w ∈ {0.25, 0.5, 1.0}, lower the user\'s own face (`firstBody.ownNonTarget`, a measured '
      + 'ground pass whose FIRST BODY is an own NON-TARGET teammate) on world 13 without '
      + 'breaking a guard, and does the kick-off tap-back\'s carom move (H-LN-2)?',
    doc: 'docs/world-model/LN-T1PB-OWN-LANE-EXAM-RERUN.md',
    reRunOf: 'docs/world-model/LN-T1P-OWN-LANE-EXAM.md',
    reRunOfArtifact: LNT1P_ARTIFACT,
    contract: 'docs/world-model/LN-OWN-LANE-CONTRACT.md',
    seamDoc: 'docs/world-model/LN-T0-OWN-LANE-PRICE.md',
    authorizedBy: 'COMMANDER RULING #395 item 4 — LN-T1\u2032 re-frozen with FIVE declared '
      + 'changes and nothing else; the specification it inherits WHOLE is #394 item 4',
    lineage: 'PT-C0 (the population and the `ball.lastTouch` FIRST-BODY channel) → BN-C0 (the '
      + 'corridor test) → LN-C0 (the walker and the wind-up ARM-tick channel) → LN-T1 (the EXAM '
      + 'form: the paired Δ, the guard tolerance, the offside FLAG form, FLAG-HYGIENE, G-ARM, '
      + 'LOO, the sizing rule) → LN-C1 (the choice tick and the own-openness CALLED '
      + 'reconstruction) → LN-C2 (the ledger PATH classes and the shell at the choice) → LN-C3 '
      + '(the FAMILY rule, the strike sites, the trace join, the walker, the extracted call '
      + 'graph) → LN-T0 (the SEAM under exam) → LN-T1′ (this instrument\'s OWN PARENT: the '
      + 'exam walked, one inherited receipt conjunct RED) → this RE-RUN',
    userVerdictVerbatim: '12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上',
    kind: 'EXAM (a RE-RUN) — pre-registered rules, frozen read sentences. It ARMS NOTHING for the user: the '
      + 'flag `lnOwnLanePrice` stays default OFF, world 12/13 bytes are untouched, the '
      + 'production fingerprint is unchanged, and NOTHING SHIPS.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited; `gSrcUntouched` proves it '
      + 'on the run that writes this artifact.',
    noLookPressure: '⛔ NO look-pressure face (`blindOutpricesRead`, `blindOutpricesBand`, or any '
      + 'face derived from the trace\'s `options[].price`) is read off an ARMED arm — the armed '
      + 'trace\'s prices are PRICED values and its look-pressure booleans are ASYMMETRIC (#394 '
      + 'item 3(ii)). This instrument reads the trace\'s `chosenGid` / `legacyGid` (the PATH '
      + 'CLASS) on every arm and nothing else a dose can bend.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    /** ⭐⭐ THIS instrument's OWN path and hash (LN-C3 §COMMANDER CORRECTIONS item 1). */
    instrument: SELF_PATH,
    instrumentSha256: SELF_SHA,
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((armK) => ({
    arm: armK, label: ARM_LABEL[armK], book: ARM_BOOK[armK],
    lnOwnLanePrice: ARM_FLAG[armK], lnOwnLaneWeight: ARM_WEIGHT[armK],
    control: CONTROL_OF[armK],
    composition: ARM_BOOK[armK] === 'E13'
      ? 'a4MatchFlags(13) as construction flags + armA4World(m, null, 13) — LN-C3\'s E13 '
        + 'construction CALLED. `null` L3 dose ⇒ the defence books stay as the season left them; '
        + '`null` PC dose ⇒ the recognition books are born absent.'
      : 'a4MatchFlags(13) + armA4World(m, null, 13, l3Dose, pcDose) via the SHIPPED LOADERS — '
        + 'LN-C3\'s D13, THE FORM THE USER PLAYS.',
    gate: `bqArmedVersion(m) === ${BQ_WORLD_VERSION}`,
  })),
  dosePlacement: {
    canon: 'VERBATIM: "dose NEVER in info.genome; truth-dosing writes census values through the '
      + 'effective genome".',
    whatTeamGenomeResolvesTo: '⭐⭐⭐ ANCHORED (§3, with line receipts): `PlayerBrain.decideCarrier` '
      + 'reads `const g = team.genome;` two lines after `team` is bound, and in world 13 '
      + '`inSnapshotLaw` is OFF (`gWorld`) so `team` IS the TRUTH `Team` object; `Team`\'s own '
      + 'getter is `get genome() { return this.effGenome; }` — a FIELD, not `info.genome`; '
      + '`Match` REBUILDS `effGenome` from `baseGenome` at every brain tick '
      + '(`team.effGenome = applyMentality(team.baseGenome, team.mentality)`); and '
      + '`applyMentality` SPREADS its input, so a gene it does not name survives the rebuild.',
    whereTheDoseIsWritten: 'ON `baseGenome` AND `effGenome`, AS COPIES, of BOTH teams — the '
      + 'ratified weight-setting idiom (`setCorridorWeight` / `setRaGenes`, #334 item 1). ⛔ '
      + '`info.genome` is NEVER touched.',
    theT0SuitesThreeViewIdiomIsNotFollowed: '⚠ `tests/lnOwnLane.test.ts` writes the gene on ALL '
      + 'THREE views (`info.genome` included) because a unit pin wants the value wherever it is '
      + 'read and its `Match` dies with the assertion. THIS EXAM DOES NOT: `info.genome` is the '
      + 'FRANCHISE\'S OWN OBJECT and `crossoverGenomes` copies a present gene from parent A even '
      + 'with the evolution opt-in shut (LN-OWN-LANE-CONTRACT.md §2 M-LN.2), so writing it would '
      + 'open the Lamarck channel the contract names as a LATER slice.',
    receipt: '`lnOwnLaneWeightOf` (the SHIPPED accessor, CALLED) read back off `effGenome` and '
      + '`baseGenome` of both teams on EVERY walked match = the arm\'s dose; read off '
      + '`info.genome` = 0, and the KEY is absent (`gArm`, `gWorld`, `worldPin`).',
  },
  definitions: {
    population: '⭐⭐ PT-C0\'s own, BYTE FOR BYTE: every MEASURED GROUND PASS '
      + '(`isMeasurableGroundPass`: shortPass | throughBall | cutback, ground launch, with a '
      + 'pending-pass target), registered at the strike via `pendingPass`.',
    r1: '⭐⭐⭐ R1 = `firstBody.ownNonTarget` over ALL measured ground passes — the '
      + '`ball.lastTouch` FIRST-BODY channel (LN-C0\'s). DOWN resolved (the 95% cluster-bootstrap '
      + 'interval excludes zero on the helpful side) = HELPFUL.',
    g1: '⭐⭐⭐ G1 = the share of measured ground passes whose STRUCK AIM OF RECORD has the '
      + `chooser's own gain < 0, where gain = clamp01((team.localX(aim.x) − localX + 30)/60)·2 − 1 `
      + '(`PlayerBrain.ts` l.641, ANCHORED) and `localX` is the passer\'s own forward coordinate '
      + 'AT THE CHOICE TICK. A CEILING: UP is harmful.',
    theAimOfRecord: '⭐⭐ NEVER RECOMPUTED. ARM class: the wind-up record\'s own `aim` + `aimLead`. '
      + 'RELEASE class: the target\'s own body position PLUS the engine\'s own recorded strike '
      + 'lead (`match.dxStrikeAim` when its `gid` and `tick` match this strike). Where no record '
      + 'exists the class is COUNTED and the target\'s own position is used (LN-C1\'s inherited '
      + 'rule, DECLARED).',
    theCorridor: '⭐⭐ BN-C0\'s membership test, REUSED: `laneOpenness`\'s own geometry — '
      + '`closestPointOnSegment` CALLED — at its OWN scale `DV_CORRIDOR_SCALE` = 4 m with its '
      + 'OWN clear-the-kicker guard `DV_CLEAR_RADIUS` = 1.5 m.',
    binEdges: {
      note: '⚠ every width/count here is a STORED BIN EDGE of a histogram — never a rule and '
        + 'never a threshold: no read word and no majority boolean depends on one.',
      nearestMateM: { width: NEAR_BIN_M, bins: NEAR_BINS },
      minPairwiseM: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS },
      occupantsPerPass: { width: 1, bins: OCC_BINS },
      opennessGrid: { width: OPEN_BIN_W, bins: OPEN_BINS },
      flightRetireTicks: FLIGHT_RETIRE_TICKS,
    },
    engineConstants: {
      DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS, CONTROL_RADIUS, DUP_RUN_M, SAMPLE_EVERY, DT, GRAVITY,
      BALL_RADIUS, PLAYER_CORE_RADIUS, shellMetres: SHELL_M,
      chooserGate040: GATE_040, chooserGate045: GATE_045,
    },
  },
  causes: { vocabulary: CAUSES, precedence: 'L1 > L2 > L3a > L3b > L4, LN-C0\'s, INHERITED' },
  pairClasses: { vocabulary: PAIRS, precedence: 'P2 > P3 > P1 > P4 > P5, LN-C0\'s, INHERITED' },
  designations: { vocabulary: DESIGNATIONS,
    read: 'READ OFF THE TEAM\'S OWN SETS at the tick — never inferred from movement' },
  presence: { vocabulary: PRESENCE, what: 'BN-C0\'s corridor split, MIRRORED' },
  contactClasses: CONTACTS, actions: ACTION_CELLS,
  families: {
    vocabulary: FAMILIES, untracedFamilies: UNTRACED_FAMILIES, tracedFamilies: TRACED_FAMILIES,
    theRule: '⭐⭐⭐ LN-C3\'s FAMILY RULE, INHERITED: a DETERMINISTIC FUNCTION of four RECORD '
      + 'fields, applied in THIS order — (1) strike site `kickoffPlayback` ⇒ KICKOFF-PLAYBACK; '
      + '(2) flight kind `throughBall` ⇒ THROUGH-BALL; (3) flight kind `cutback` ⇒ CUTBACK; '
      + '(4) passer role `GK` ⇒ KEEPER-pass; (5) ledger path in {legacyChosen, legacyNoOption} ⇒ '
      + 'LEGACY-outfield; (6) ledger path `substituted` ⇒ SUBSTITUTED; (7) otherwise OTHER '
      + '(COUNTED, its combinations itemised).',
    theRecordFields: '⛔ NEVER GEOMETRY, NEVER TIMING: the flight KIND is PT-C0\'s own stat-delta '
      + 'class; the ROLE is `Player.role`; the STRIKE SITE is the wind-up record, the engine\'s '
      + 'own `match.dxStrikeAim` deposit, the flight kind itself, and `match.kickoffKickGid` READ '
      + 'BEFORE THE TICK IS STEPPED.',
    reAnchoredAtThisHead: '⭐⭐ THE KICK-OFF SCORER\'S SPAN NOW CONTAINS THE LN-T0 STATEMENT, so '
      + 'LN-C3\'s stored span hash NO LONGER MATCHES at this head — see `lnC3KickoffSpan`. The '
      + 'NEW span is hashed here and its line anchors pinned; LN-C3\'s banked census is '
      + 'untouched (#394 item 3).',
  },
  strikeSites: { vocabulary: SITES,
    what: 'LN-C3\'s STRIKE-SITE rule, INHERITED; every site anchored at its own line' },
  pathClasses: { vocabulary: PATHS, legacyIsBothSubClasses: LEGACY_PATHS,
    tracedIsEverythingElse: TRACED_PATHS,
    theJoin: '(DECISION TICK, passerGid) — the arm tick for the ARM class, the release tick for '
      + 'the RELEASE class. The join rate is a RECEIPT, never a filter.',
    whatIsReadOffTheArmedTrace: '⛔ ONLY `chosenGid` / `legacyGid` (and `tick` / `passerGid` for '
      + 'the join). NO price, NO look-pressure boolean.' },
  choiceTick: { vocabulary: CHOICE_CLASSES, established: ESTABLISHED,
    theEnginesRule: 'LN-C1\'s, INHERITED: where a wind-up record exists the ARM TICK IS THE '
      + 'CHOICE TICK; where none does the strike is on the decision tick, so the RELEASE TICK IS '
      + 'THE CHOICE TICK. A class with no establishable choice tick is COUNTED, never imputed.' },
  lnC3KickoffSpan: {
    what: '⭐⭐ THE RE-ANCHORING RECEIPT: LN-C3 stored the kick-off scorer\'s span hash BEFORE '
      + 'LN-T0 added site (b) inside it. The stored values are QUOTED from LN-C3\'s own artifact '
      + 'and compared to THIS head\'s.',
    lnC3: LNC3_KICKOFF_SPAN,
    thisHead: (() => {
      const n = GRAPH_NODES.find((x) => x.name === 'kickoffPlaybackScorer');
      return n === undefined ? null : { sha256: n.sha256, startLine: n.startLine,
        endLine: n.endLine, chars: n.chars };
    })(),
    hashDiffers: (GRAPH_NODES.find((x) => x.name === 'kickoffPlaybackScorer')?.sha256
      ?? '') !== LNC3_KICKOFF_SPAN.storedSha256,
    why: 'site (b) — the ONE statement `s -= ownLanePrice(lnSeat.w, ownLaneOpenness(...))` — was '
      + 'added INSIDE the span, and `const s` became `let s`.',
  },
  codeFactGraph: {
    canon: '#393 item 3, VERBATIM: "…the callee list is EXTRACTED from the hashed text — every '
      + 'identifier called within the span, resolved to its definition and hashed — never typed, '
      + 'and a declared edge absent from the text, or a call present in the text and absent from '
      + 'the graph, is RED".',
    method: 'the SIX ROOTS are anchored by needle; every other node was DISCOVERED by stripping '
      + 'comments and string literals from a node\'s text, extracting every identifier followed '
      + 'by `(`, classifying it as a BUILTIN (a name with no body in `src/**`), a BOUNDARY (the '
      + 'call stands alone as a statement, so its return enters nothing) or a CALLEE, and '
      + 'resolving each callee to its own definition — a member call by class-method / getter / '
      + 'property-arrow pattern, a plain call by function / arrow-const pattern preferring the '
      + 'CALLING FILE — then hashing it over a BRACKET-BALANCED span.',
    roots: ROOT_SPANS.map((r) => r.name),
    nodes: GRAPH_NODES,
    edges: GRAPH_EDGES,
    closures: Object.fromEntries(ROOT_SPANS.map((r) => [r.name, closureOf(r.name)])),
    boundaryCallees: GRAPH_BOUNDARY,
    unresolvedIdentifiers: GRAPH_UNRESOLVED,
    builtinList: [...BUILTIN_CALLS].sort(),
    keywordList: [...KEYWORD_CALLS].sort(),
    facts: CODE_FACTS,
    whatTheFactsAre: '⚠ CODE READS, NOT MEASUREMENTS. Each boolean is derived from a node\'s own '
      + 'hashed text and is written only because `gCodeFactGraph` is GREEN.',
  },
  guards: {
    form: TOLERANCE_FORM,
    niFraction: NI_FRACTION,
    niFractionNumerals: { fromLnT1Probe: NI_LNT1, fromObmT1Probe: NI_OBMT1 },
    niFractionSources: [LNT1_PROBE_PATH, OBMT1_PATH],
    breachRule: 'BREACH = RESOLVED (the paired-Δ interval excludes zero) AND BEYOND TOLERANCE IN '
      + 'THE HARMFUL DIRECTION. The harmful direction of every guard is FROZEN at §P.',
    order: '⭐ G1 THE BACKWARD-PASS SHARE IS FIRST, as #394 item 4(iv) orders.',
    limbs: GUARD_LIMBS,
    table: GUARD_TABLE,
  },
  offsides: {
    form: '⭐ G6 in the #157 FLAG form: a RESOLVED INCREASE raises a FLAG and flips NO gate. It '
      + 'enters neither `breach` nor `Q`.',
    rows: OFFSIDE_ROWS,
  },
  reads: READS,
  medians: { note: '⭐ every median is BIN-DERIVED from the stored bins, so `gFaces` re-derives '
    + 'it off the SERIALIZED artifact', values: medians },
  bins: Object.fromEntries(ARMS.map((armK) => [armK, {
    firstBodyClass: { vocabulary: CONTACTS, pooled: pooled[armK].firstBody },
    occupantsPerPass: { width: 1, bins: OCC_BINS, pooled: pooled[armK].occPerPassBins },
    occupantCause: { vocabulary: CAUSES, pooled: pooled[armK].causeN },
    nearestMateM: { width: NEAR_BIN_M, bins: NEAR_BINS, pooled: pooled[armK].nearBins },
    minPairwiseM: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS, pooled: pooled[armK].minPairBins },
    pairClass: { vocabulary: PAIRS, pooled: pooled[armK].pairN },
    choiceClass: { vocabulary: CHOICE_CLASSES, pooled: pooled[armK].chClass },
    choiceOwnOpenness: { width: OPEN_BIN_W, bins: OPEN_BINS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chOwnOpenBins },
    choiceOpponentOpenness: { width: OPEN_BIN_W, bins: OPEN_BINS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chOppOpenBins },
    caromByOwnOpenness: { width: OPEN_BIN_W, bins: OPEN_BINS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chCaromByOwnBin },
    firstBodyByChoiceClass: { vocabulary: CONTACTS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chFirstBody },
    pathByChoiceClass: { vocabulary: PATHS, groups: CHOICE_CLASSES, pooled: pooled[armK].cpPass },
    pathCaroms: { vocabulary: PATHS, groups: CHOICE_CLASSES, pooled: pooled[armK].cpCarom },
    pathPassesWithGeometry: { vocabulary: PATHS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].cpGeom },
    pathCaromsWithGeometry: { vocabulary: PATHS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].cpCaromGeom },
    pathShellFired: { vocabulary: PATHS, groups: CHOICE_CLASSES, pooled: pooled[armK].cpShellPass },
    pathShellFiredCaroms: { vocabulary: PATHS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].cpShellCarom },
    firstBodyByPath: { vocabulary: CONTACTS, groups: 'choiceClass × path',
      pooled: pooled[armK].cpFirstBody },
    familyPasses: { vocabulary: FAMILIES, pooled: pooled[armK].famPass },
    familyCaroms: { vocabulary: FAMILIES, pooled: pooled[armK].famCarom },
    familyPassesWithGeometry: { vocabulary: FAMILIES, pooled: pooled[armK].famGeom },
    familyCaromsWithGeometry: { vocabulary: FAMILIES, pooled: pooled[armK].famCaromGeom },
    familyShellFired: { vocabulary: FAMILIES, pooled: pooled[armK].famShellPass },
    familyShellFiredOnCaroms: { vocabulary: FAMILIES, pooled: pooled[armK].famShellCarom },
    familyOwnOpennessByShell: { width: OPEN_BIN_W, bins: OPEN_BINS * 2,
      layout: 'bin * 2 + shellFired', groups: FAMILIES, pooled: pooled[armK].famOwnBinShell },
    familyCaromOwnOpennessByShell: { width: OPEN_BIN_W, bins: OPEN_BINS * 2,
      layout: 'bin * 2 + shellFired', groups: FAMILIES,
      pooled: pooled[armK].famCaromOwnBinShell },
    familyByLedgerPath: { vocabulary: PATHS, groups: FAMILIES, pooled: pooled[armK].famByPath },
    familyByStrikeSite: { vocabulary: SITES, groups: FAMILIES, pooled: pooled[armK].famBySite },
    familyByChoiceClass: { vocabulary: CHOICE_CLASSES, groups: FAMILIES,
      pooled: pooled[armK].famChoiceClass },
    familyFirstBody: { vocabulary: CONTACTS, groups: FAMILIES, pooled: pooled[armK].famFirstBody },
    familyCaromPresenceAtChoice: { vocabulary: CAROM_PRESENCE, groups: FAMILIES,
      pooled: pooled[armK].famCaromPresence },
    familyCaromByChoiceClass: { vocabulary: CHOICE_CLASSES, groups: FAMILIES,
      pooled: pooled[armK].famCaromByClass },
    strikeSitePasses: { vocabulary: SITES, pooled: pooled[armK].siteCount },
    strikeSiteCaroms: { vocabulary: SITES, pooled: pooled[armK].siteCarom },
    otherFamilyCombinations: { bins: OTHER_CELLS, pooled: pooled[armK].otherCombos },
  }])),
  doseSource: {
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_PIN, [PC_DOSE_FILE]: PC_DOSE_PIN },
    matchesPins: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    reachable: DOSED_ARM_REACHABLE, loadError: DOSE_LOAD_ERROR,
  },
  worldPin: { seed: WORLD_PIN_SEED, rows: worldPin, ok: WORLD_PIN_OK,
    emergentPosOn: EMERGENT_POS_ON, formationSpotPath: FORMATION_SPOT_PATH },
  anchoredSites: ANCHORS, fixtures: FIXTURES,
  lockstep: lockstepRows,
  lockstepTrace: { rows: lockstepTraceRows, ok: LOCKSTEP_TRACE_OK },
  flagHygiene: { rows: hygieneRows, differingFields: HYGIENE_DIFFERING,
    signaturesIdentical: HYGIENE_SIGNATURES_IDENTICAL, seeds: cells.length,
    excludedFields: HYGIENE_EXCLUDED_FIELDS, ok: FLAG_HYGIENE_OK },
  gArm: { rows: gArmRows, perTeamRows: gArmPerTeamRows, perTeamOk: G_ARM_PER_TEAM_OK,
    ok: G_ARM_OK,
    perTeamWhat: '⭐⭐⭐ LN-T1′b CHANGE (c) — the SHIPPED `lnOwnLaneWeightOf` CALLED on side 0 '
      + 'and side 1 SEPARATELY, on `effGenome` / `baseGenome` / `info.genome` and on the KEY\'s '
      + 'own presence, at CONSTRUCTION and again at FULL TIME. Counts are SEEDS PASSING, out of '
      + '`seeds`.' },
  liveness: { ...LIVENESS, rows: LIVENESS_ROWS,
    what: 'the WHOLE-MATCH SIGNATURE (rng stream state included) of a dosed arm against its own '
      + 'control, per seed — the seam has no counter of its own' },
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: `THIS exam's own 12-seed SCRATCH SMOKE (seeds ${SCRATCH_BASE}–`
      + `${SCRATCH_BASE + 11}), DISCLOSED IN FULL at the doc's §DEV-PREFLIGHT. ⚠ 12 seeds is a `
      + 'NOISY variance estimate. The variance source row is the CEILING dose W100 (LN-T1\'s '
      + 'form), at a DECLARED 0.01 ABSOLUTE target on R1\'s paired Δ.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: BLOCK_AFFORDS,
    nRequiredMax: N_REQUIRED_MAX, boundBy: N_BOUND_BY,
    declaredAbsoluteTarget: 0.01, rows: sizingRows,
  },
  loo: { rows: LOO_ROWS,
    what: '⭐ LEAVE-ONE-OUT in the conservative point-shift form on R1 per dose arm and on the '
      + 'KICKOFF-PLAYBACK carom rate. ⚠ A RECEIPT — it gates no direction.' },
  reproLnc3: {
    seeds: REPRO_LNC3_SEEDS, rows: reproRows,
    artifact: LNC3_ARTIFACT, artifactFileSha256: LNC3_FILE_SHA,
    artifactHashedBodySha256: lnc3Disk.hashedBodySha256,
    fieldsCompared: REPRO_FIELDS_COMPARED, mismatches: REPRO_MISMATCHES,
    excludedSharedFields: REPRO_EXCLUDED_FIELDS,
    minimumFieldsRequired: REPRO_MIN_FIELDS,
    ok: REPRO_OK_LNC3,
    note: '⛔ RE-WALKS, NOT CONSUMPTION: block 12,548,000–999 is LN-C3\'s, consumed whole of '
      + 'record. ⭐⭐ 0 mismatches IS the dormancy receipt in the census\'s own arithmetic.',
  },
  reproLnt1p: {
    seeds: REPRO_LNT1P_SEEDS, arms: ARMS, rows: reproLnt1pRows,
    artifact: LNT1P_ARTIFACT, artifactFileSha256: LNT1P_FILE_SHA,
    artifactHashedBodySha256: lnt1pDisk.hashedBodySha256,
    artifactAllGreen: lnt1pDisk.allGreen,
    sharedFieldsPerCell: LNT1P_THEIR_KEYS.length - REPRO_LNT1P_EXCLUDED_FIELDS.length,
    fieldsCompared: REPRO_LNT1P_FIELDS, mismatches: REPRO_LNT1P_MISMATCHES,
    byArm: REPRO_LNT1P_BY_ARM,
    excludedSharedFields: REPRO_LNT1P_EXCLUDED_FIELDS,
    fieldsIAddedThatLnT1pDoesNotHave: REPRO_LNT1P_NEW_FIELDS,
    ok: REPRO_OK_LNT1P,
    note: '⛔ RE-WALKS, NOT CONSUMPTION: block 12,549,000–999 is LN-T1′\'s, consumed whole of '
      + 'record. ⭐⭐ 0 mismatches on every arm IS the identity receipt between the two runs — '
      + 'the walker and the observation are the same; only the receipts changed. ⚠ The parent '
      + 'artifact is the `.RED.json` one: LN-T1′\'s own fail-closed routing wrote that path and '
      + 'left the canonical one unwritten (#395 item 3).',
  },
  ledgerJoin: {
    what: '⭐⭐⭐ LN-T1′b CHANGES (a) + (b), #395 item 4(i). (a) THE DEMOTED CONJUNCT: LN-T1′ '
      + 'asserted `partition.untracedFamiliesAreExactlyTheUntracedLedgerClass` inside `gFaces` '
      + 'and it went RED on three armed arms; here the same quantity is PUBLISHED per arm and '
      + 'per untraced family, with numerator and denominator, ALSO as the faces '
      + '`ledgerRow.<FAMILY>.share`, and it GATES NOTHING. (b) THE JOIN DIAGNOSIS: every pass '
      + 'whose FAMILY and LEDGER CLASS disagree, ITEMISED off the engine\'s own records. ⛔ '
      + 'NEITHER changes a family: the family is assigned by (kind, site) FIRST, byte for byte '
      + 'as LN-C3 froze it.',
    ledgerRowShareByFamily: LEDGER_ROW_SHARE_BY_FAMILY,
    untracedFamiliesAreExactlyTheUntracedLedgerClass: UNTRACED_IDENTITY_BY_ARM,
    identityIsAnObservationNotAGate: true,
    disagreementCountsByArm: DISAGREEMENT_COUNTS_BY_ARM,
    disagreementRowsByArm: DISAGREEMENT_ROWS_BY_ARM,
    disagreementRows: DISAGREEMENT_ROWS_ALL,
    disagreementRowCount: DISAGREEMENT_ROWS_ALL.length,
    ledgerTupleOrder: ['arms', 'evictions', 'struck', 'cancelledMate'],
    ledgerSource: 'match.o1WindupLedger (src/sim/Match.ts, the O1 T2 in-engine wind-up ledger, '
      + '#180.3(ii)) — SNAPSHOTTED PER SIM TICK, READ ONLY. Its own docblock: "nothing in the '
      + 'sim ever READS these fields, so they cannot influence a single tick".',
    windupArmedNotStruckBeforeRestartPredicate:
      'arms@strikeTick − arms@ledgerRowTick > 0 AND struck@strikeTick − struck@ledgerRowTick '
      + '=== 0 (FALSE when the row has no ledger row tick). Frozen at §P before any battery '
      + 'seed.',
    everyDisagreementIsAKickoffWithAnUnstruckWindup:
      EVERY_DISAGREEMENT_IS_A_KICKOFF_WITH_AN_UNSTRUCK_WINDUP,
    everyDisagreementIsAKickoff: EVERY_DISAGREEMENT_IS_A_KICKOFF,
    everyDisagreementHasAnUnstruckWindup: EVERY_DISAGREEMENT_HAS_AN_UNSTRUCK_WINDUP,
    booleansAreNullWhenTheListIsEmpty: '⛔ canon, VERBATIM: "a universal sentence about a table '
      + '(\'every bin\', \'the one bin\') is a stored boolean or is not written" — with an '
      + 'EMPTY list there is no universal to write, so the three booleans are null.',
  },
  xDet: { pass: X_DET, digestA, digestB, excludedFields: ['wallMs'] },
  xFpProd: { pass: X_FP_PROD, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length, armsPerSeed: ARMS.length,
    constructionReceiptSeed: RECEIPT_SEED, walksBooked,
    unwalkedTail: (IS_OVERRIDE
      || batterySeeds[batterySeeds.length - 1] + 1 > BLOCK_TOP - 1) ? null
      : [batterySeeds[batterySeeds.length - 1] + 1, BLOCK_TOP - 1],
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    worldPinScratchSeedWalked: WORLD_PIN_SEED,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    smokeReceiptSeed: SCRATCH_BASE + 20,
    reproLnc3SeedsRewalked: REPRO_LNC3_SEEDS,
    reproLnc3IsARewalkNotConsumption: true,
    reproLnt1pSeedsRewalked: REPRO_LNT1P_SEEDS,
    reproLnt1pArmsRewalked: ARMS,
    reproLnt1pIsARewalkNotConsumption: true,
    publishedFrontierAt395: PUBLISHED_FRONTIER_AT_395,
    consumedLedgerQuoted: CONSUMED,
    blockAffordsAfterTheConstructionReceipt: BLOCK_AFFORDS,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 79 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, armK) => a + armRows(armK).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / Math.max(1, cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE.',
  },
  honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; the '
    + 'artifact stores that list verbatim or stores none". THIS ARTIFACT STORES NONE. The list '
    + 'of record is THIS exam\'s own doc, docs/world-model/LN-T1PB-OWN-LANE-EXAM-RERUN.md §HONEST '
    + 'LIMITS.',
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
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
  guards: { table: Record<Arm, ReturnType<typeof guardRowFor>>; niFraction: number };
  offsides: { rows: Record<Arm, { flag: boolean; resolved: boolean; delta: number }> };
  sizing: { rows: typeof sizingRows };
  stage: { instrument: string; instrumentSha256: string };
  ledgerJoin: {
    ledgerRowShareByFamily: Record<Arm, Record<string,
    { numerator: number; denominator: number; share: number }>>;
    untracedFamiliesAreExactlyTheUntracedLedgerClass: Record<Arm, boolean>;
    disagreementRowsByArm: Record<Arm, unknown[]>;
  };
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
  const l = disk.perSeedCells.map((c) => c[dd.arm]);
  const r = disk.perSeedCells.map((c) => c[dd.control]);
  const pl = ratio(sum(l.map((x) => def.num(x))), sum(l.map((x) => def.dn(x))));
  const pr = ratio(sum(r.map((x) => def.num(x))), sum(r.map((x) => def.dn(x))));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: sameNum(pl, dd.armValue) && sameNum(pr, dd.controlValue) && sameNum(pl - pr, dd.delta),
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
  cmp('firstBodyClass', got.firstBody);
  cmp('occupantsPerPass', got.occPerPassBins);
  cmp('occupantCause', got.causeN);
  cmp('nearestMateM', got.nearBins);
  cmp('minPairwiseM', got.minPairBins);
  cmp('pairClass', got.pairN);
  cmp('choiceClass', got.chClass);
  cmp('choiceOwnOpenness', got.chOwnOpenBins);
  cmp('choiceOpponentOpenness', got.chOppOpenBins);
  cmp('caromByOwnOpenness', got.chCaromByOwnBin);
  cmp('firstBodyByChoiceClass', got.chFirstBody);
  cmp('pathByChoiceClass', got.cpPass);
  cmp('pathCaroms', got.cpCarom);
  cmp('pathPassesWithGeometry', got.cpGeom);
  cmp('pathCaromsWithGeometry', got.cpCaromGeom);
  cmp('pathShellFired', got.cpShellPass);
  cmp('pathShellFiredCaroms', got.cpShellCarom);
  cmp('firstBodyByPath', got.cpFirstBody);
  cmp('familyPasses', got.famPass);
  cmp('familyCaroms', got.famCarom);
  cmp('familyPassesWithGeometry', got.famGeom);
  cmp('familyCaromsWithGeometry', got.famCaromGeom);
  cmp('familyShellFired', got.famShellPass);
  cmp('familyShellFiredOnCaroms', got.famShellCarom);
  cmp('familyOwnOpennessByShell', got.famOwnBinShell);
  cmp('familyCaromOwnOpennessByShell', got.famCaromOwnBinShell);
  cmp('familyByLedgerPath', got.famByPath);
  cmp('familyByStrikeSite', got.famBySite);
  cmp('familyByChoiceClass', got.famChoiceClass);
  cmp('familyFirstBody', got.famFirstBody);
  cmp('familyCaromPresenceAtChoice', got.famCaromPresence);
  cmp('familyCaromByChoiceClass', got.famCaromByClass);
  cmp('strikeSitePasses', got.siteCount);
  cmp('strikeSiteCaroms', got.siteCarom);
  cmp('otherFamilyCombinations', got.otherCombos);
  binChecks.push({ bin: `${armK}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[armK]) });
  /* THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${armK}.partition.firstBodySumsToFlights`,
    ok: sum(got.firstBody) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ bin: `${armK}.partition.familyGridSumsToFlights`,
    ok: sum(got.famPass) === sum(rows.map((r) => r.gpFlights))
      && sum(got.siteCount) === sum(rows.map((r) => r.gpFlights))
      && sum(got.famCarom) === got.firstBody[CTI('ownNonTarget')]
      && sum(got.siteCarom) === sum(got.famCarom)
      && sum(got.otherCombos) === got.famPass[FMI('OTHER')] });
  binChecks.push({ bin: `${armK}.partition.familySubGridsSumToTheirFamily`,
    ok: got.famByPath.every((x, i) => sum(x) === got.famPass[i])
      && got.famBySite.every((x, i) => sum(x) === got.famPass[i])
      && got.famChoiceClass.every((x, i) => sum(x) === got.famPass[i])
      && got.famFirstBody.every((x, i) => sum(x) === got.famPass[i])
      && got.famOwnBinShell.every((x, i) => sum(x) === got.famGeom[i])
      && got.famCaromOwnBinShell.every((x, i) => sum(x) === got.famCaromGeom[i])
      && got.famCaromPresence.every((x, i) => sum(x) === got.famCaromGeom[i])
      && got.famCaromByClass.every((x, i) => sum(x) === got.famCarom[i]) });
  binChecks.push({ bin: `${armK}.partition.pathGridSumsToFlights`,
    ok: sum(got.cpPass) === sum(rows.map((r) => r.gpFlights))
      && CHOICE_CLASSES.every((c) => sumIdx(got.cpPass, cpIdx([c], PATHS))
        === got.chClass[CCI(c)]) });
  /* ⭐⭐⭐ LN-T1′b CHANGE (a) — THE DEMOTION, HERE. LN-T1′ ASSERTED the untraced-family /
     untraced-ledger-class IDENTITY at this exact spot and the assertion is what went RED. What
     is re-derived off disk now is (i) the ARITHMETIC of the PUBLISHED per-family ledger-row
     receipt, (ii) that the STORED identity OBSERVATION per arm is the one the disk cells
     actually say, and (iii) that the itemised diagnosis list's length is the counted one. The
     IDENTITY ITSELF GATES NOTHING. */
  binChecks.push({ bin: `${armK}.ledgerJoin.receiptRederivesOffDisk`,
    ok: UNTRACED_FAMILIES.every((fam) => {
      const stored = disk.ledgerJoin.ledgerRowShareByFamily[armK][fam];
      const nu = sum(rows.map((r) => TRACED_PATHS.reduce(
        (a, p) => a + r.famByPath[FMI(fam)][PTI(p)], 0)));
      const de = sum(rows.map((r) => r.famPass[FMI(fam)]));
      return stored !== undefined && stored.numerator === nu && stored.denominator === de
        && sameNum(ratio(nu, de), stored.share);
    })
      && disk.ledgerJoin.untracedFamiliesAreExactlyTheUntracedLedgerClass[armK]
        === (sumIdx(got.famPass, UNTRACED_FAM_IDX)
          === sumIdx(got.cpPass, cpIdx(CHOICE_CLASSES, ['untraced']))
          && sumIdx(got.famCarom, UNTRACED_FAM_IDX)
            === sumIdx(got.cpCarom, cpIdx(CHOICE_CLASSES, ['untraced'])))
      && disk.ledgerJoin.disagreementRowsByArm[armK].length
        === sum(rows.map((r) => r.joinUntracedFamilyWithLedgerRow
          + r.joinTracedFamilyWithoutLedgerRow)) });
  binChecks.push({ bin: `${armK}.partition.familyShellIsItsOwnGridColumn`,
    ok: got.famShellPass.every((v, i) => v === Array.from({ length: OPEN_BINS },
      (_, bb) => got.famOwnBinShell[i][bb * 2 + 1]).reduce((a, x) => a + x, 0))
      && got.famShellCarom.every((v, i) => v === Array.from({ length: OPEN_BINS },
        (_, bb) => got.famCaromOwnBinShell[i][bb * 2 + 1]).reduce((a, x) => a + x, 0)) });
  binChecks.push({ bin: `${armK}.partition.backwardIsInsideTheReadableGain`,
    ok: rows.every((r) => r.gpBackward <= r.gpGainReadable
      && r.gpGainReadable <= r.gpFlights) });
}
/** ⭐⭐ THE GUARD TABLE, RE-DERIVED off the serialized cells: every control level, every
 *  tolerance, every Δ, every `resolved` / `beyondTolerance` / `breach` boolean. */
for (const armK of DELTA_ARMS) {
  const controlK = CONTROL_OF[armK] as Arm;
  for (const row of disk.guards.table[armK]) {
    const def = FACES[row.key];
    const a = disk.perSeedCells.map((c) => c[armK]);
    const cc = disk.perSeedCells.map((c) => c[controlK]);
    const pA = ratio(sum(a.map((x) => def.num(x))), sum(a.map((x) => def.dn(x))));
    const pC = ratio(sum(cc.map((x) => def.num(x))), sum(cc.map((x) => def.dn(x))));
    const tol = disk.guards.niFraction * Math.abs(pC);
    const dd = pA - pC;
    const beyond = row.direction === 'ceiling' ? dd > tol
      : row.direction === 'floor' ? dd < -tol : Math.abs(dd) > tol;
    binChecks.push({ bin: `guards.${armK}.${row.id}.rederives`,
      ok: sameNum(pC, row.controlLevel) && sameNum(tol, row.toleranceAbs)
        && sameNum(dd, row.delta) && beyond === row.beyondTolerance
        && row.breach === (row.resolved && beyond) });
  }
}
/** ⭐⭐ THE READ WORDS, RE-DERIVED: every selector boolean, Q, the smallest qualifying dose, the
 *  printed sentence (which must be one of the frozen literals), the H-LN-2 sentence, every
 *  counterfactual word and the D13 pair's own word. */
{
  const diskReads = disk.reads as unknown as typeof READS;
  for (const armK of DELTA_ARMS) {
    const controlK = CONTROL_OF[armK] as Arm;
    const rederive = (key: string): { d: number; lo: number; hi: number } => {
      const def = FACES[key];
      const a = disk.perSeedCells.map((c) => c[armK]);
      const cc = disk.perSeedCells.map((c) => c[controlK]);
      const pA = ratio(sum(a.map((x) => def.num(x))), sum(a.map((x) => def.dn(x))));
      const pC = ratio(sum(cc.map((x) => def.num(x))), sum(cc.map((x) => def.dn(x))));
      const stored = disk.deltas.find((x) => x.face === key && x.arm === armK) as DeltaRow;
      return { d: pA - pC, lo: stored.ciLo, hi: stored.ciHi };
    };
    const r1 = rederive('firstBody.ownNonTarget');
    const kk = rederive('family.KICKOFF-PLAYBACK.caromRate');
    const sel = diskReads.selectors[armK];
    const breaches = disk.guards.table[armK].filter((g) => g.breach).map((g) => `${g.id} ${g.key}`);
    binChecks.push({ bin: `reads.${armK}.selectorsRederive`,
      ok: sameNum(r1.d, sel.r1Delta) && (r1.hi < 0) === sel.r1Down && (r1.lo > 0) === sel.r1Up
        && sameNum(kk.d, sel.kickDelta) && (kk.hi < 0) === sel.kickDown
        && (breaches.length > 0) === sel.breach
        && JSON.stringify(breaches) === JSON.stringify(sel.breachingGuards)
        && disk.offsides.rows[armK].flag === sel.offsideFlag });
  }
  const qq = DOSES.filter((w) => diskReads.selectors[w].r1Down && !diskReads.selectors[w].breach);
  const anyDown = DOSES.some((w) => diskReads.selectors[w].r1Down);
  const wantRead = qq.length > 0 ? 'read1' : anyDown ? 'read2' : 'read3';
  const kickDoses = DOSES.filter((w) => diskReads.selectors[w].kickDown);
  binChecks.push({ bin: 'reads.QAndTheSelectedReadRederive',
    ok: JSON.stringify(qq) === JSON.stringify(diskReads.qualifyingDoses)
      && wantRead === diskReads.selectedRead
      && (qq.length > 0 ? qq[0] : null) === diskReads.smallestQualifyingDose
      && JSON.stringify(kickDoses) === JSON.stringify(diskReads.kickDownDoses)
      && (kickDoses.length > 0) === diskReads.hLn2Refuted });
  binChecks.push({ bin: 'reads.sentencesAreTheFrozenLiterals',
    ok: diskReads.sentence === READ_LITERALS[
      diskReads.selectedRead as 'read1' | 'read2' | 'read3']
      && diskReads.hLn2Sentence === (diskReads.hLn2Refuted
        ? H_LN_2_LITERALS.refuted(`w = ${DOSE_W[diskReads.kickDownDoses[0] as Dose]}`)
        : H_LN_2_LITERALS.holds)
      && diskReads.readListPrinted.length === 2
      && diskReads.readListPrinted[0] === diskReads.sentence
      && diskReads.readListPrinted[1] === diskReads.hLn2Sentence });
  binChecks.push({ bin: 'reads.counterfactualWordsRederive',
    ok: DELTA_ARMS.every((a) => {
      const s = diskReads.selectors[a];
      const want = (s.r1Down && !s.breach) ? 'read1' : s.r1Down ? 'read2' : 'read3';
      return diskReads.counterfactualWords[a].word === want
        && diskReads.counterfactualWords[a].sentence === READ_LITERALS[want]
        && diskReads.counterfactualWords[a].hLn2 === (s.kickDown
          ? H_LN_2_LITERALS.refuted(`w = ${ARM_WEIGHT[a] ?? 0}`) : H_LN_2_LITERALS.holds);
    }) && diskReads.d13Pair.word === diskReads.counterfactualWords['D13-W050'].word });
  binChecks.push({ bin: 'reads.universalsAreStoredBooleans',
    ok: diskReads.universals.noDoseHasR1Down === !anyDown
      && diskReads.universals.everyDoseHasR1Down === DOSES.every((w) => diskReads.selectors[w].r1Down)
      && diskReads.universals.noDoseHasKickDown === (kickDoses.length === 0)
      && diskReads.universals.everyGuardHeldOnEveryDose === DOSES.every((w) => !diskReads.selectors[w].breach) });
}
/** ⭐ EVERY SIZING ROW's ARITHMETIC re-derives off disk, step by step */
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
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / median / `
    + 'partition / GUARD-TABLE / READ-WORD / sizing checks re-derived from the SERIALIZED '
    + 'artifact off disk — canon, VERBATIM: "the re-derivation gate covers EVERY published face; '
    + 'a percentile face requires stored bins". EVERY guard\'s control level, tolerance, Δ and '
    + 'breach boolean, EVERY selector, Q, the smallest qualifying dose, both printed sentences '
    + 'and every counterfactual word are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.')).every((b) => b.ok)
    && binChecks.filter((b) => b.bin.startsWith('reads.')).length > 0,
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: every selector boolean (`r1Down`, `r1Up`, '
    + '`breach` with its named guards, `kickDown`, the offside flag), Q, the smallest qualifying '
    + 'dose, the SELECTED read, both printed sentences, every counterfactual word per dose arm '
    + 'taken alone, the D13 pair\'s own word and every UNIVERSAL are RE-DERIVED by applying the '
    + 'FROZEN rules to the SERIALIZED per-seed cells off disk, and every printed sentence must '
    + 'be one of the frozen literals. canon, VERBATIM: "a universal sentence about a table '
    + '(\'every bin\', \'the one bin\') is a stored boolean or is not written"',
};
/** ⭐⭐⭐ gStage — the artifact's OWN instrument receipt, checked against the RUNNING FILE. */
const STAGE_OK = disk.stage.instrument === SELF_PATH
  && disk.stage.instrumentSha256 === sha(readFileSync(SELF_PATH, 'utf8'))
  && disk.stage.instrumentSha256 === SELF_SHA;
gates.gStage = {
  ok: STAGE_OK,
  note: '⭐⭐⭐ LN-C3 §COMMANDER CORRECTIONS item 1 (the ancestor shipped its PREDECESSOR\'s '
    + 'instrument receipt): the artifact\'s `stage.instrument` is written from THIS instrument\'s '
    + `OWN path constant (${SELF_PATH}) and `
    + `\`stage.instrumentSha256\` (${SELF_SHA}) is compared, OFF THE SERIALIZED ARTIFACT, to a `
    + 'fresh read of the RUNNING FILE\'s bytes',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };

/* ---- THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt ---- */
const SCHEMA_COMPLETE = BODY_SCHEMA.every((k) => artifact[k] !== undefined)
  && (BODY_SCHEMA as readonly string[]).includes('allGreen')
  && !(BODY_SCHEMA as readonly string[]).includes('hashedBodySha256')
  && !(BODY_SCHEMA as readonly string[]).includes('gFacesDetail')
  && !(BODY_SCHEMA as readonly string[]).includes('receipts')
  && !(BODY_SCHEMA as readonly string[]).includes('honestLimitsNote');
gates.gHashOrder = {
  ok: SCHEMA_COMPLETE,
  note: '⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
    + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
    + `${BODY_SCHEMA.length}-key schema is complete and EVERY key is enumerated in it: `
    + `${BODY_SCHEMA.join(' · ')}. It covers the per-seed cells, the construction receipt AND `
    + '`allGreen` (BQ-T1 §CORR 4: the gate verdict is INSIDE the allowlist), and EXCLUDES the '
    + 'NON-BODY keys `hashedBodySha256`, `gFacesDetail`, `receipts` and `honestLimitsNote`; the '
    + 'body hash is computed LAST — after every body key is assigned — and a NON-body '
    + '`receipts.hashReproducesFromFile` records that it reproduces from the written file',
};
artifact.gates = gates;
const ALL_GREEN_FINAL = Object.values(gates).every((g) => g.ok);
artifact.allGreen = ALL_GREEN_FINAL;
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));
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
  what: '⭐⭐ canon, VERBATIM: "the body hash is computed after every body key is assigned, and a '
    + 'NON-body receipt field records that the hash reproduces from the written file". This '
    + 'block is OUTSIDE `BODY_SCHEMA` by construction.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  nonBodyKeys: ['hashedBodySha256', 'gFacesDetail', 'receipts', 'honestLimitsNote'],
  note: '⭐⭐⭐ LN-T1′b CHANGE (d) (#395 item 4(i)(d); LN-T1′ §CORR 4 — the parent promised this '
    + 'and its doc did not carry it). ⚠ THIS BLOCK CARRIES NO file byte-hash and NO byte count: '
    + 'both are self-referential (writing either changes the bytes they describe). THE PROMISE '
    + 'IS KEPT IN THE DOC: `docs/world-model/LN-T1PB-OWN-LANE-EXAM-RERUN.md` §GATES carries the '
    + 'FINAL file sha256 and byte count, recomputed with `shasum -a 256` and `wc -c` on the '
    + 'committed artifact AFTER the final write — the doc is written after the artifact, which '
    + 'is why it can. The instrument also PRINTS both on stderr at the end of the run.',
  finalFileHashAndByteCountLiveIn: 'docs/world-model/LN-T1PB-OWN-LANE-EXAM-RERUN.md §GATES',
};
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
const FINAL_BYTES = readFileSync(OUT_PATH, 'utf8');
const FINAL_FILE_SHA = sha(FINAL_BYTES);
const FINAL_ARTIFACT_BYTES = Buffer.byteLength(FINAL_BYTES, 'utf8');
const HASH_REPRODUCES_FINAL = (() => {
  const onDisk = JSON.parse(FINAL_BYTES) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`LN-T1PB — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 R1, THE USER\'S OWN FACE, PER DOSE ---');
banner(`  ABSENT level ${f6(face('firstBody.ownNonTarget', 'ABSENT').value)} (`
  + `${face('firstBody.ownNonTarget', 'ABSENT').numerator}/`
  + `${face('firstBody.ownNonTarget', 'ABSENT').denominator})`);
for (const a of DELTA_ARMS) {
  const s = SELECTORS[a];
  banner(`  ${a.padEnd(11)} Δ ${f6(s.r1Delta)} [${f6(s.r1Ci[0])}, ${f6(s.r1Ci[1])}] `
    + `|Δ|÷hw ${f6(s.r1AbsDeltaOverHalfWidth)} · down ${s.r1Down} · up ${s.r1Up} · breach `
    + `${s.breach}${s.breach ? ` (${s.breachingGuards.join(', ')})` : ''} · kickDown ${s.kickDown}`
    + ` (Δ ${f6(s.kickDelta)} [${f6(s.kickCi[0])}, ${f6(s.kickCi[1])}])`);
}
banner('');
banner('--- §R1 THE FAMILY TABLE ---');
for (const armK of ARMS) {
  for (const fam of FAMILIES) {
    const cr = face(`family.${fam}.caromRate`, armK);
    const cs = face(`family.${fam}.caromShareOfAllCaroms`, armK);
    banner(`  ${armK.padEnd(11)} ${fam.padEnd(17)} P(carom|fam) ${f6(cr.value)} `
      + `(${cr.numerator}/${cr.denominator}) · of caroms ${f6(cs.value)}`);
  }
}
banner('');
banner('--- §R2 THE GUARDS ---');
for (const a of DELTA_ARMS) {
  for (const g of GUARD_TABLE[a]) {
    banner(`  ${a.padEnd(11)} ${g.id} ${g.key.padEnd(32)} control ${f6(g.controlLevel)} · tol `
      + `${f6(g.toleranceAbs)} · Δ ${f6(g.delta)} [${f6(g.ci[0])}, ${f6(g.ci[1])}] · resolved `
      + `${g.resolved} · breach ${g.breach}`);
  }
  banner(`  ${a.padEnd(11)} G6 guard.offsidesPerMatch          Δ `
    + `${f6(OFFSIDE_ROWS[a].delta)} · resolved ${OFFSIDE_ROWS[a].resolved} · FLAG `
    + `${OFFSIDE_ROWS[a].flag}`);
}
banner('');
banner('--- §R3 THE SECONDARIES ---');
for (const armK of ARMS) {
  banner(`  ${armK.padEnd(11)} own-openness(ALL) `
    + `${f6(face('openFam.ALL.ownOpennessMean', armK).value)} · shell fired `
    + `${f6(face('shellFam.ALL.firedShare', armK).value)} · substituted `
    + `${f6(face('path.established.substituted.passShare', armK).value)} · chosenGid=-1 `
    + `${f6(face('trace.established.noOptionShare', armK).value)} · pass dist `
    + `${f6(face('context.meanPassDistanceMetres', armK).value)} · passes/match `
    + `${f6(face('context.groundPassesPerMatch', armK).value)} · 撞车 `
    + `${f6(face('crowd.crashShare', armK).value)}`);
}
banner('');
banner('--- §R3 THE LEDGER-JOIN RECEIPTS (LN-T1′b CHANGES (a) + (b)) ---');
for (const armK of ARMS) {
  const parts = UNTRACED_FAMILIES.map((fam) => {
    const rr = LEDGER_ROW_SHARE_BY_FAMILY[armK][fam];
    return `${fam} ${f6(rr.share)} (${rr.numerator}/${rr.denominator})`;
  });
  banner(`  ${armK.padEnd(11)} ledger-row share — ${parts.join(' · ')}`);
  banner(`  ${armK.padEnd(11)} identity(observation) `
    + `${UNTRACED_IDENTITY_BY_ARM[armK]} · disagreements `
    + `${DISAGREEMENT_COUNTS_BY_ARM[armK].untracedFamilyWithLedgerRow} untraced-with-row + `
    + `${DISAGREEMENT_COUNTS_BY_ARM[armK].tracedFamilyWithoutLedgerRow} traced-without-row`);
}
banner(`  disagreement rows in all: ${DISAGREEMENT_ROWS_ALL.length}`);
for (const dg of DISAGREEMENT_ROWS_ALL) {
  banner(`    ${dg.arm.padEnd(11)} seed ${dg.seed} tick ${dg.strikeTick} gid ${dg.passerGid} `
    + `site ${dg.site} choice ${dg.choiceClass} family ${dg.family} path ${dg.pathClass} `
    + `chosen ${dg.chosenGid} legacy ${dg.legacyGid} rowTick ${dg.ledgerRowTick} `
    + `ledger@strike [${dg.ledgerAtStrikeTick.join(',')}] @strike-1 `
    + `[${dg.ledgerAtStrikeTickMinusOne.join(',')}] @row `
    + `[${(dg.ledgerAtRowTick ?? []).join(',')}] @row-1 `
    + `[${(dg.ledgerAtRowTickMinusOne ?? []).join(',')}] armedNotStruck `
    + `${dg.windupArmedNotStruckBeforeRestart}`);
}
banner(`  everyDisagreementIsAKickoffWithAnUnstruckWindup = `
  + `${EVERY_DISAGREEMENT_IS_A_KICKOFF_WITH_AN_UNSTRUCK_WINDUP}`
  + ` (kickoff ${EVERY_DISAGREEMENT_IS_A_KICKOFF}, unstruck `
  + `${EVERY_DISAGREEMENT_HAS_AN_UNSTRUCK_WINDUP})`);
banner('');
banner('--- §R4 THE D13 PAIR ---');
banner(`  R1 Δ ${f6(D13_PAIR.r1.delta)} [${f6(D13_PAIR.r1.ci[0])}, ${f6(D13_PAIR.r1.ci[1])}] · `
  + `down ${D13_PAIR.r1.down} · breach ${SELECTORS['D13-W050'].breach} ⇒ ${D13_PAIR.word}`);
banner('');
banner('--- §R5 THE READS ---');
banner(`  ${READS.sentence}`);
banner(READS.annotation);
banner(`  ${READS.hLn2Sentence}`);
banner(`  Q = [${Q.join(', ')}] · smallest qualifying dose ${SMALLEST_QUALIFYING_DOSE ?? 'NONE'}`);
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FINAL_FILE_SHA}  bytes ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN_FINAL) process.exit(1);
