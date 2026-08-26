/**
 * ⭐⭐ DX-T1 — THE EXPRESSION EXAM (docs/world-model/DX-T1-EXPRESSION-EXAM.md).
 *
 * Authorized by COMMANDER RULING #353 item 4 (the dispatch), bound by
 * docs/world-model/DX-DELIVERY-EXECUTION-CONTRACT.md §3. It is GC-T2's instrument
 * (docs/world-model/GC-T2-POWER-EXTENSION.md, artifact
 * docs/world-model/data/gc-t2-power-extension.json) RE-POINTED AT THE DX DOOR: THE SAME
 * COMPOSITION IN BOTH ARMS, the SAME walk-side predicates, the SAME estimator — SHUT vs ARMED
 * on `dxWindupAim` ALONE.
 *
 * THE SCORED PAIR — the GC-T2 composition in BOTH arms, ONE construction flag apart:
 *   · `shut`  = a4MatchFlags(11) + `dlcDeliveryChoice` + `dlcStrikePlane` + `bkGroundCorridor`
 *               + armA4World(m, null, 11) + `passLeadSupport` written MATCH-LOCAL at
 *               PTP_GENE_MAX (= 1, DLC-T1's idiom); `dvExposureWeight` at world 11's own 0.5 pin
 *   · `armed` = THE SAME, plus the ONE construction flag `dxWindupAim: true`
 * `gArmsIsolated` requires the difference set to be EXACTLY `['dxWindupAim']`.
 *
 * ⚠⚠ THE STRUCTURAL FACT THIS EXAM EXISTS TO KILL: GC-T1B §P11 / GC-T2 §R6's
 * `O1-WINDUP-PRECEDENCE` — the wind-up seat's own aim is displaced on EXACTLY ZERO decisions
 * (30,318 at GC-T1B, 73,079 at GC-T2). DX-T0 (#353 item 1) plumbed the ELECTED displacement
 * through the wind-up as `pendingPassWindup.aimLead`; ⚠ THE RECORD'S `aim` FIELD IS UNTOUCHED,
 * so GC-T2's own displacement read (aim vs the target's pre-step position) STILL reads zero in
 * both arms. THE CARRY IS READ FROM `pendingPassWindup.aimLead` (DX-T0 §COMMANDER CORRECTIONS
 * (#353) item 1's instrumentation note: the dormant ledger has no counter), and BOTH components
 * are published — the union is `altDisplacedShare`, the legacy aim-field read is published
 * beside it so the 30,318-zero fact's own instrument stays visible.
 *
 * H-DX.1, the four conjuncts, FROZEN at §P of the doc BEFORE any battery seed was read:
 *   (a) `altDisplacedShare` on WIND-UP flights LEAVES ZERO RESOLVEDLY in the ARMED arm — the
 *       armed arm's own 95 % interval ENTIRELY ABOVE ZERO **and** the paired Δ 95 % interval
 *       ENTIRELY ABOVE ZERO.
 *   (b) ⭐ NON-INFERIORITY — `armed.groundPassesPerMatch` sits AT OR ABOVE THIS EXAM's OWN SHUT
 *       arm's 95 % interval LOWER EDGE (GC-T1B §P4 / GC-T2 §P4's band construction, no taste
 *       constant): the GC-T2 suppression face re-asked with EXPRESSION possible.
 *   (c) THE STRIKE FACES DO NOT WORSEN — `groundStrikesPerMatch`, `teammateStrikesPerMatch`,
 *       `caromedGroundOnOpenLaneShare`: the paired Δ (armed − shut) 95 % interval's UPPER EDGE
 *       lies AT OR BELOW the NON-WORSENING MARGIN = THIS exam's own SHUT arm's 95 % interval
 *       HALF-WIDTH for that face ((b)'s band construction, mirrored onto the Δ scale). Each is
 *       REPORTED with its leave-one-out sensitivity (#346 / #348's standing orders).
 *   (d) the LOFTED-FAMILY CONTROLS stay INSIDE THIS SHUT ARM's own 95 % intervals.
 * ⭐ AND THE DEPOSIT-SIDE BEHAVIOURAL PIN (#353's rider, ordered into this §P): a CAPTURED
 * armed-world decision's `pendingPassWindup.aimLead` EQUALS the elected candidate's own
 * displacement — `gDepositCarriesElection`, walked on scratch seeds.
 *
 * REPORTED, NEVER GATED: ⭐ THE §P6 RE-AIM SIGNATURE (GC-T1B's reading rule VERBATIM, blocked /
 * clear columns beside `deliveriesPerMatch`, with GC-T2's published cells quoted as
 * DIFFERENT-BATTERY CONTEXT) · the joint cells · the led/grid USAGE shares by arm (⛔ usage,
 * never a decline rate) · perf (GC-T1 §P7's method) · ⭐ THE LEAVE-ONE-OUT SENSITIVITY FACE ·
 * ⭐ THE SEASON LADDER (probe-side, the DLC gene `passLeadSupport` EVOLVABLE through the shipped
 * opt-in; goals × generation, the house form).
 *
 * ⛔ X-SRC-ZERO. No file under `src/` is edited: the probe arms every flag IN-INSTRUMENT (as
 * construction flags on its own `Match`) and CALLS the shipped exports — `groundShellHazard`
 * (so the observer read and the priced read are the SAME function), `laneOpenness`,
 * `closestPointOnSegment`, `a4MatchFlags` / `armA4World`, `passLeadSupportWeight`.
 * `gSrcUntouched` proves it against `git diff --stat HEAD -- src` AND `git status --porcelain
 * -- src`.
 *
 * ⭐ CANON, COPIED FROM docs/world-model/CANON.md BESIDE ITS ACTUAL HOME (never re-typed from
 * memory — #301; a constraint that binds this executor beyond the ruling's own sentences is
 * cited as "the dispatch brief", never as the ruling — #342 item 3):
 *   · freeze-before-battery — freeze the instrument commit BEFORE the battery; artifact records
 *     the instrument hash.  HOME: ruling #266.3(c). (paraphrase)
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema
 *     never enters the body; forbidden-name lists are retired".  HOME: PC-T0-LATENCY-SEAM.md
 *     §COMMANDER CORRECTIONS item 1.
 *   · mutant liveness — every gate conjunct provably alive, exactly-one enforced, or the probe
 *     refuses to run.  HOME: ruling #268.3(a). (paraphrase)
 *   · per-seed cells — per-seed/per-cluster cells stored so every headline re-derives.
 *     HOME: ruling #282.2(ii). (paraphrase)
 *   · gFaces-from-disk — the re-derivation gate parses the SERIALIZED artifact off disk.
 *     HOME: ruling #287 item 1.  VERBATIM extension: "the re-derivation gate covers EVERY
 *     published face; a percentile face requires stored bins" — HOME: PC-C0-REACTION-BASELINE.md
 *     §COMMANDER CORRECTIONS item 4.
 *   · "a field carries the unit its name claims".  HOME: ruling #294 item 3.
 *   · "a src-extracted constant pins its extraction to the NAMED call site — anchored match +
 *     line receipt — never first-occurrence".  HOME: BK-C0-BODYBALL-CENSUS.md §COMMANDER
 *     CORRECTIONS item 1 (ruling #306 item 4).
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face".
 *     HOME: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4.
 *   · "a starred finding states its |Δ|÷half-width ratio".  HOME: BU-T0B-PRICE-SEPARATION.md
 *     §COMMANDER CORRECTIONS item 2.
 *   · "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's
 *     site".  HOME: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1.
 *   · "a scored face's walk-side predicate is pinned — anchored extraction or fixture — because
 *     the re-derivation gate proves arithmetic, not definitions".  HOME: DF-T3-SURFACE-EXAM.md
 *     §COMMANDER CORRECTIONS item 2.  REFINED at #334 item 2: "anchored extraction protects the
 *     source line; a headline-bearing walk-side predicate ALSO needs a composition fixture"
 *     (HOME: BK-T3 §CORR item 2).
 *   · "a dose-source guard should hash the bytes it reads, not a self-declared field".  HOME:
 *     BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6.
 *   · receipts ≠ effect sizes — arming/plumbing receipts are never quoted as football effect
 *     sizes.  HOMES: ruling #289 item 1 + BU-T1 §CORR item 5. (paraphrase)
 *   · ⭐⭐ dose placement — VERBATIM FROM THE LEDGER: "dose NEVER in info.genome; truth-dosing
 *     writes census values through the shipped writer."  HOME: ruling #270.2 (the house law).
 *     (paraphrase)  Recurrence struck at #334 item 1: the ratified form = the match-local-copy
 *     idiom (bu-t1's setMtDoseLocal shape) PLUS an info.genome-cleanliness world conjunct,
 *     required of every future dosing instrument. — THIS IS WHY `passLeadSupport` IS WRITTEN
 *     MATCH-LOCAL HERE (see §4) RATHER THAN ON ALL THREE VIEWS AS DLC-T1's OWN `armGene` DID.
 *   · "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since
 *     #155, stated now, test-pinned; refines #270's E4 correction; matches the perf
 *     diagnostic)".  HOME: ruling #283.2(iv). — this probe builds `Match` DIRECTLY and never
 *     round-trips a League, so no worker fixture is generated.
 *   · "verifier scratch walks use the stage's own consumed band or the out-of-band scratch range
 *     (≥ 900,000,000) — never the next virgin block".  HOME: PW-T0C-OBJECTIVE-FIDELITY.md
 *     §COMMANDER CORRECTIONS item 6. — the COMPOSITION PROOF and the SIZING SMOKE both walk
 *     ≥ 900,000,000 only.
 *   · seed discipline — BOOKED = WALKED; blocks consumed whole.  HOME: the standing frontier
 *     practice (#286 item 5 onward). (paraphrase)
 *   · clock honesty — every rate on the 240 s match clock or dual-axis (1 sim-s = 22.5
 *     display-s); APPLIED values, never nominal.  HOMES: ruling #280.2(iii) + PC-T2 §CORR
 *     item 3. (paraphrase)
 *   · ⭐⭐ composition proof — VERBATIM FROM THE LEDGER: "any world arming a new seam alongside
 *     the CB/L3 stack proves the doors/lifecycle at THAT composition first."  HOME: BU contract
 *     M-BU.2 (ruling #285), inherited by M-PW.4 / M-PC.5. (paraphrase) — DLC × the world-11
 *     stack is UNMEASURED, so §8B's receipts run on SCRATCH seeds BEFORE any battery seed.
 *   · provenance hashes are COPIED from the artifact's own field, never from a terminal
 *     scroll-back.  HOME: ruling #345 item 1 (the standing order). (paraphrase)
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: DXT1_MODE (smoke|full, REQUIRED) · DXT1_N · DXT1_OUT · DXT1_LADDER.
 *   ANY other `DXT1_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *   ⭐⭐ THE gN ENV ESCAPE IS CLOSED (#348 §CORR 2's order: "the override mode gets its own gate
 *   arm, never a bypass"). `gN` has TWO arms and NO bypass: in a FROZEN run it requires
 *   `cells.length === N_FROZEN`; in an OVERRIDE run it requires the override to be DECLARED, the
 *   walked n to equal the DECLARED override n, and the artifact to sit OFF every canonical path.
 *   Neither arm is vacuous and neither can be satisfied by simply setting an env var.
 *
 * RUN: DXT1_MODE=full npx tsx scripts/probes/dx-t1-expression-exam.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched; the artifact is
 *       routed to the `.RED.json` SIDE PATH — the red-routing idiom, #334 item 5) ·
 *       2 = a refusal · 3 = the world/constant construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { BALL_RADIUS, DT, GRAVITY, KICK_COOLDOWN } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, corridorArmedVersion,
  CORRIDOR_WORLD_VERSION, CORRIDOR_WORLD_WEIGHT,
} from '../../src/game/a4World';
import { laneOpenness } from '../../src/ai/perception';
import { groundShellHazard } from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment, dist, type V2 } from '../../src/utils/vec';
import {
  crossoverGenomes, mutateGenome, passLeadSupportWeight, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng, hashSeed } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)      */
/* ========================================================================== */
const ENV_WHITELIST = ['DXT1_MODE', 'DXT1_N', 'DXT1_OUT', 'DXT1_LADDER'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('DXT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('DX-T1 FATAL — refused env surface. '
    + `rogue DXT1_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.DXT1_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`DX-T1 FATAL — DXT1_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.DXT1_N !== undefined ? Number(process.env.DXT1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1 || N_ENV > 160)) {
  banner('DX-T1 FATAL — DXT1_N must be an integer in [1, 160] (an OVERRIDE run is capped).');
  process.exit(2);
}
const LADDER_ENV = process.env.DXT1_LADDER;
if (LADDER_ENV !== undefined && LADDER_ENV !== 'off') {
  banner('DX-T1 FATAL — DXT1_LADDER accepts only the literal `off`.');
  process.exit(2);
}
const OUT_ENV = process.env.DXT1_OUT;
const PREFLIGHT_REASONS = [
  ...(MODE === 'smoke' ? ['mode=smoke'] : []),
  ...(N_ENV !== undefined ? ['DXT1_N set'] : []),
  ...(LADDER_ENV !== undefined ? ['DXT1_LADDER set'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/dx-t1-expression-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/dx-t1-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === pathResolve(CANONICAL_OUT) || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
if (IS_PREFLIGHT && isCanonical(OUT_BASE)) {
  banner(`DX-T1 FATAL — an OVERRIDE run (${PREFLIGHT_REASONS.join(', ')}) may not write a `
    + `canonical repo path (${OUT_BASE}).`);
  process.exit(2);
}
const RUN_LADDER = LADDER_ENV !== 'off';

/* ========================================================================== */
/* §1 SMALL HELPERS                                                           */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Number(v.toFixed(d)) : (Number.isNaN(v) ? Number.NaN : v));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return Number.NaN;
  const m = mean(xs);
  return Math.sqrt(sum(xs.map((x) => (x - m) ** 2)) / (xs.length - 1));
};
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const zeros2 = (a: number, b: number): number[][] => Array.from({ length: a }, () => zeros(b));
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const addInto2 = (a: number[][], b: readonly (readonly number[])[]): void => {
  for (let i = 0; i < a.length; i++) addInto(a[i], b[i]);
};
const sum2 = (m: readonly (readonly number[])[]): number => sum(m.map((r) => sum(r)));
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const canonicalJson = (v: unknown): string => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(o[k])}`).join(',')}}`;
};
const medianFromBins = (bins: readonly number[], binWidth: number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc >= total / 2) return i * binWidth;
  }
  return (bins.length - 1) * binWidth;
};
const binOf = (v: number, width: number, n: number): number => {
  if (!Number.isFinite(v) || v < 0) return n - 1;
  return Math.min(n - 1, Math.floor(v / width));
};

/* ========================================================================== */
/* §2 THE ANCHORED CONSTANTS — pinned at their NAMED sites, with line receipts  */
/* ========================================================================== */
/**
 * ⭐⭐ CANON, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
 * anchored match + line receipt — never first-occurrence" (HOME: BK-C0 §CORR item 1), and
 * "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"
 * (HOME: PC-C0 §CORR item 1). This exam re-derives BK-C2's instruments, so it re-extracts
 * BK-C2's OWN anchored definitions from the ENGINE, at the same named sites:
 *   1. THE STRIKE SHELL — `Match.ts`, inside `bkCollectBodyStrikes`.
 *   2. THE CHOOSER'S OWN "OPEN LANE" LINE — `PlayerBrain.ts`, inside `groundCandidate`.
 *      ⚠ BK-C2 §CORR item 5 rides: at that site the literal lives in a contested-FORWARD-ball
 *      risk gate that never fires on sideways/backward passes, so 0.4 is BK-C2's chosen
 *      extraction of the chooser's own literal, NOT a line the chooser draws over every pass.
 *   3. THE QUICK-EXCHANGE WINDOW N — `constants.ts`'s `KICK_COOLDOWN`, the constant the contact
 *      law's own filter reads (published as a definition; no face of this exam gates on it).
 * PLUS this exam's own two seam anchors, which BK-C2 could not have (the seam did not exist):
 *   4. THE ONE `bkGroundCorridor` READ FORK — `PlayerBrain.ts`, pinned VERBATIM, count 1.
 *   5. THE ONE PRICER STATEMENT — `PlayerBrain.ts`, pinned VERBATIM, count 1.
 */
const MATCH_PATH = 'src/sim/Match.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const PERC_PATH = 'src/ai/perception.ts';
const CONST_PATH = 'src/sim/constants.ts';
const SEAT_PATH = 'src/ai/deliveryValueSeat.ts';
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const PERC_SRC = readFileSync(PERC_PATH, 'utf8');
const CONST_SRC = readFileSync(CONST_PATH, 'utf8');
const SEAT_SRC = readFileSync(SEAT_PATH, 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number; text: string }[] => {
  const out: { line: number; text: string }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) {
    const ln = lineOf(src, i);
    out.push({ line: ln, text: src.split('\n')[ln - 1].trim() });
    i = src.indexOf(needle, i + 1);
  }
  return out;
};
const namedBody = (src: string, header: string): { body: string; start: number } | null => {
  const start = src.indexOf(header);
  if (start < 0) return null;
  return { body: src.slice(start, start + 6000), start };
};

const SHELL_NEEDLE = 'const shell = p.coreRadius + ball.radius;';
const SHELL_HITS = occurrences(MATCH_SRC, SHELL_NEEDLE);
const SHELL_FN = namedBody(MATCH_SRC, 'private bkCollectBodyStrikes(');
const SHELL_IN_FN = SHELL_FN !== null && SHELL_FN.body.includes(SHELL_NEEDLE);
const SHELL_LINE = SHELL_HITS.length > 0 ? SHELL_HITS[0].line : -1;

const LANE_GATE_NEEDLE = 'if (gain > 0.15 && lane < 0.4) {';
const LANE_GATE_HITS = occurrences(BRAIN_SRC, LANE_GATE_NEEDLE);
const LANE_GATE_RE = /if \(gain > [0-9.]+ && lane < ([0-9.]+)\) \{/;
const LANE_GATE_MATCH = LANE_GATE_RE.exec(BRAIN_SRC);
const OPEN_LANE_THRESHOLD = LANE_GATE_MATCH === null ? Number.NaN : Number(LANE_GATE_MATCH[1]);
const LANE_GATE_LINE = LANE_GATE_HITS.length > 0 ? LANE_GATE_HITS[0].line : -1;
const GROUND_CANDIDATE_FN = namedBody(BRAIN_SRC, 'const groundCandidate = (');
const LANE_GATE_IN_FN = GROUND_CANDIDATE_FN !== null
  && GROUND_CANDIDATE_FN.body.includes(LANE_GATE_NEEDLE);

const KICK_CD_NEEDLE = 'export const KICK_COOLDOWN = ';
const KICK_CD_HITS = occurrences(CONST_SRC, KICK_CD_NEEDLE);
const KICK_CD_LINE = KICK_CD_HITS.length > 0 ? KICK_CD_HITS[0].line : -1;
const QUICK_N_TICKS = Math.round(KICK_COOLDOWN / DT);

/** ⭐⭐ THE SEAM's OWN TWO SITES — GC-T0 §SEAM's read-fork inventory, re-asserted at battery time */
const GC_FORK_NEEDLE = '  const gcSeat = match.bkGroundCorridor ? deliveryValueSeatOf(g) : null;';
const GC_FORK_HITS = occurrences(BRAIN_SRC, GC_FORK_NEEDLE);
const GC_PRICE_NEEDLE = '        : sDv - gcSeat.exposureWeight * groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid);';
const GC_PRICE_HITS = occurrences(BRAIN_SRC, GC_PRICE_NEEDLE);
const GC_HAZARD_CALLS = (BRAIN_SRC.match(/groundShellHazard\(/g) ?? []).length;
const GC_HAZARD_DEFS = (SEAT_SRC.match(/export function groundShellHazard\(/g) ?? []).length;
/**
 * ⭐⭐ THE TWO DLC READ FORKS — DLC-T0 §SEAM's and DLC-T0s §SEAM's own inventories, re-asserted
 * at battery time. Pinned VERBATIM, count 1 each, and the PRECEDENCE GUARD's own line is pinned
 * too, because it is the src law that decides what the ORDERED armed-both world actually IS.
 */
const DLC_FORK_NEEDLE = '  const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const DLC_FORK_HITS = occurrences(BRAIN_SRC, DLC_FORK_NEEDLE);
const SP_FORK_NEEDLE = '  const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const SP_FORK_HITS = occurrences(BRAIN_SRC, SP_FORK_NEEDLE);
/** ⭐⭐ THE PRECEDENCE GUARD — "no grid forms while either seat exists" (Match.ts's own words) */
const SP_PRECEDENCE_NEEDLE = '      if (spSeat !== null && dlcSeat === null && ptpSeat === null) {';
const SP_PRECEDENCE_HITS = occurrences(BRAIN_SRC, SP_PRECEDENCE_NEEDLE);
/** the seam must be ABSENT from the entry layer at every version — GC-T0 §ROAD B, re-asserted;
 *  the two DLC doors are absent there too (Road B: nothing ships) */
const A4_SRC = readFileSync('src/game/a4World.ts', 'utf8');
const GC_ABSENT_FROM_A4 = !A4_SRC.includes('bkGroundCorridor');
const DLC_ABSENT_FROM_A4 = !A4_SRC.includes('dlcDeliveryChoice')
  && !A4_SRC.includes('dlcStrikePlane') && !A4_SRC.includes('passLeadSupport');
/**
 * ⭐⭐ THE DX SEAM's OWN THREE SITES — DX-T0 §SEAM MAP / §DISCARD's inventory, re-asserted at
 * battery time so this exam's arms cannot drift from the seam the door actually is:
 *   1. THE ONE `dxWindupAim` FORK in `src/**` (PlayerBrain, the deposit), pinned VERBATIM.
 *   2. THE ONE arm-time CONSUMPTION gate (Match.armPendingPass), pinned VERBATIM.
 *   3. THE ONE PLUMB-THROUGH (Match.resolvePendingPassWindup's release), pinned VERBATIM.
 * Plus ROAD B: the door is named by NO world — absent from `a4World.ts` at every version.
 */
const DX_FORK_NEEDLE = '        if (match.dxWindupAim && passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)) {';
const DX_FORK_HITS = occurrences(BRAIN_SRC, DX_FORK_NEEDLE);
const DX_ARM_NEEDLE = '      this.dxWindupAim && dxDeposit !== null';
const DX_ARM_HITS = occurrences(MATCH_SRC, DX_ARM_NEEDLE);
const DX_RESOLVE_NEEDLE = '    this.performPass(passer, mate, pp.offsideExempt, 1, pp.aimLead);';
const DX_RESOLVE_HITS = occurrences(MATCH_SRC, DX_RESOLVE_NEEDLE);
const DX_ARM_SITES = (MATCH_SRC.match(/armPendingPass\(/g) ?? []).length;
const DX_BRAIN_ARM_SITES = (BRAIN_SRC.match(/match\.armPendingPass\(/g) ?? []).length;
const DX_DEPOSIT_WRITES = (BRAIN_SRC.match(/match\.dxStrikeAim = \{/g) ?? []).length;
const DX_ABSENT_FROM_A4 = !A4_SRC.includes('dxWindupAim') && !A4_SRC.includes('dxStrikeAim');
const DX_SEAM_OK = DX_FORK_HITS.length === 1 && DX_ARM_HITS.length === 1
  && DX_RESOLVE_HITS.length === 1 && DX_ARM_SITES === 1 && DX_BRAIN_ARM_SITES === 1
  && DX_DEPOSIT_WRITES === 1 && DX_ABSENT_FROM_A4;

const ANCHORS_OK = SHELL_HITS.length === 1 && SHELL_IN_FN && SHELL_LINE > 0
  && LANE_GATE_HITS.length === 1 && LANE_GATE_IN_FN && OPEN_LANE_THRESHOLD === 0.4
  && KICK_CD_HITS.length === 1 && KICK_CD_LINE > 0 && QUICK_N_TICKS === 27;
const SEAM_OK = GC_FORK_HITS.length === 1 && GC_PRICE_HITS.length === 1
  && GC_HAZARD_CALLS === 1 && GC_HAZARD_DEFS === 1 && GC_ABSENT_FROM_A4
  && DLC_FORK_HITS.length === 1 && SP_FORK_HITS.length === 1
  && SP_PRECEDENCE_HITS.length === 1 && DLC_ABSENT_FROM_A4 && DX_SEAM_OK;
if (!ANCHORS_OK || !SEAM_OK) {
  banner('DX-T1 FATAL — the anchored extraction / seam pin did not land. '
    + `shell=${SHELL_HITS.length}/${SHELL_IN_FN} laneGate=${LANE_GATE_HITS.length}/${OPEN_LANE_THRESHOLD} `
    + `kickCd=${KICK_CD_HITS.length}/N=${QUICK_N_TICKS} gcFork=${GC_FORK_HITS.length} `
    + `gcPrice=${GC_PRICE_HITS.length} hazCalls=${GC_HAZARD_CALLS} hazDefs=${GC_HAZARD_DEFS} `
    + `absentFromA4=${GC_ABSENT_FROM_A4} dlcFork=${DLC_FORK_HITS.length} `
    + `spFork=${SP_FORK_HITS.length} spPrecedence=${SP_PRECEDENCE_HITS.length} `
    + `dlcAbsentFromA4=${DLC_ABSENT_FROM_A4} dxFork=${DX_FORK_HITS.length} `
    + `dxArm=${DX_ARM_HITS.length} dxResolve=${DX_RESOLVE_HITS.length} `
    + `armSites=${DX_ARM_SITES}/${DX_BRAIN_ARM_SITES} deposits=${DX_DEPOSIT_WRITES} `
    + `dxAbsentFromA4=${DX_ABSENT_FROM_A4}`);
  process.exit(3);
}

/* ========================================================================== */
/* §3 BK-C2's PUBLISHED REFERENCE INTERVALS — READ off its own artifact        */
/* ========================================================================== */
/**
 * ⭐⭐ THE §P-FROZEN REFERENCE LINES. This exam re-derives BK-C2's instruments, so the SHUT arm
 * — which is BK-C2's `w11` world exactly (world-11 stack, gene 0.5, no ground price) walked on
 * FRESH seeds — must read the same instrument. The reference values are READ OUT of BK-C2's own
 * committed artifact with its BYTES HASHED FIRST (canon: "a dose-source guard should hash the
 * bytes it reads, not a self-declared field", HOME: BU-T1 §CORR item 6), never re-typed from
 * prose — and the §P-frozen LITERALS below are asserted against what was read, so a drift in
 * either direction goes RED rather than silently re-basing the exam.
 *
 * ⚠ THE FIDELITY RULE IS INTERVAL OVERLAP, NOT CONTAINMENT, AND THAT IS DELIBERATE: two 95 %
 * bootstrap intervals drawn from the same population overlap with very high probability, while
 * a point-inside-interval rule on three faces would carry a ~14 % family-wise false-red rate.
 * The gate asks "is this the SAME instrument on the SAME world", and overlap is the honest form
 * of that question. Stated before the battery, never re-cut after sight.
 */
const BKC2_PATH = 'docs/world-model/data/bk-c2-carom-census.json';
const BKC2_BYTES = readFileSync(BKC2_PATH, 'utf8');
const BKC2_SHA = sha(BKC2_BYTES);
interface BkC2Face { face: string; value: number; ci95: [number, number]; numerator: number; denominator: number }
const BKC2_FACES = (JSON.parse(BKC2_BYTES) as { faces: BkC2Face[] }).faces;
const bkc2 = (k: string): BkC2Face => {
  const f = BKC2_FACES.find((x) => x.face === k);
  if (f === undefined) { banner(`GC-T1 FATAL — BK-C2 face ${k} not found`); process.exit(3); }
  return f!;
};
/** ⭐ THE FROZEN LITERALS (§P): BK-C2 §R's own `w11` fields, at source precision. */
const BKC2_FROZEN: Record<string, { value: number; ci95: [number, number] }> = {
  'w11.caromedGroundOnOpenLaneShare': { value: 0.50322119, ci95: [0.47622378, 0.53133903] },
  'w11.strikeShareTeammateOfKicker': { value: 0.43107769, ci95: [0.39156035, 0.46922698] },
  'w11.strikesPerMatch': { value: 23.05833333, ci95: [21.14166667, 25.06666667] },
  'w11.groundCaromRate': { value: 0.16295346, ci95: [0.15463338, 0.1716608] },
  'w11.strikeShareOnGroundFlight': { value: 0.95739348, ci95: [0.9262607, 0.97915608] },
};
const BKC2_QUOTED_OK = Object.entries(BKC2_FROZEN).every(([k, v]) => {
  const f = bkc2(k);
  return f.value === v.value && f.ci95[0] === v.ci95[0] && f.ci95[1] === v.ci95[1];
});
/**
 * ⭐⭐ GC-T1's OWN PUBLISHED CELLS — QUOTED AS DIFFERENT-BATTERY CONTEXT, NEVER AS A REFERENCE
 * LINE. GC-T1's arms are the world-11 stack WITHOUT the DLC pair, on a DIFFERENT seed block
 * (12,524,000–159). They are quoted so the re-aim signature can be READ BESIDE its predecessor,
 * and every quotation is labelled as another battery's. ⛔ NO GATE COMPARES THIS EXAM'S NUMBERS
 * TO THEM, and no Δ is computed across the two batteries.
 *
 * ⚠⚠ AND THE FIDELITY GATE OF GC-T1 §P2b IS DELIBERATELY NOT INHERITED: GC-T1's shut arm WAS
 * BK-C2's `w11` world, so BK-C2's intervals were a fidelity reference there. THIS exam's shut
 * arm carries the DLC pair, so it is NOT BK-C2's `w11` world and BK-C2's intervals are context
 * here too. The frozen-literal quotation gate (`gBkC2Quoted`) rides unchanged — it proves the
 * quoted numbers are the artifact's own — but there is no `gInstrumentReDerivesBkC2`.
 */
const GCT2_PATH = 'docs/world-model/data/gc-t2-power-extension.json';
const GCT2_BYTES = readFileSync(GCT2_PATH, 'utf8');
const GCT2_SHA = sha(GCT2_BYTES);
interface GcT2Row {
  matches: number; strikeOnGroundFlight: number; strikeBySide: number[]; crosses: number;
  gpCaromJoint: number[][]; gpCaromed: number; gpMeasured: number; loftedLaunches: number;
}
interface GcT2Cell { index: number; scoredSeed: number; rows: Record<string, GcT2Row> }
interface GcT2Delta {
  key: string; shutArm: string; armedArm: string; delta: number;
  ci95: [number, number]; halfWidth: number;
}
interface GcT2Sens {
  face: string; maxInfluenceIndex: number; maxInfluenceSeed: number;
  maxInfluence: number; looDelta: number;
}
interface GcT2Artifact {
  staleMap: { byArm: Record<string, { measuredGroundPasses: number; deliveries: number;
    jointLaneOpenByShellBlocked: number[][] }> };
  faces: { face: string; value: number; ci95: [number, number] }[];
  deltas: GcT2Delta[];
  perSeedCells: GcT2Cell[];
  sensitivity: { rows: GcT2Sens[] };
  hashedBodySha256: string;
}
const GCT2 = JSON.parse(GCT2_BYTES) as GcT2Artifact;
/** ⭐ COPIED FROM THE ARTIFACT'S OWN FIELD, never from a terminal (#345 item 1's standing order) */
const GCT2_HASHED_BODY = GCT2.hashedBodySha256;
const gct2Face = (k: string): { value: number; ci95: [number, number] } => {
  const f = GCT2.faces.find((x) => x.face === k);
  if (f === undefined) { banner(`DX-T1 FATAL — GC-T2 face ${k} not found`); process.exit(3); }
  return f!;
};
/** ⭐ THE §P-FROZEN GC-T2 LITERALS (its own §R fields, at source precision) */
const GCT2_FROZEN = {
  'shut.groundPassesPerMatch': { value: 79.9625, ci95: [78.9125, 80.94375] },
  'armed.groundPassesPerMatch': { value: 77.64375, ci95: [76.69125, 78.60125] },
  'shut.deliveriesPerMatch': { value: 84.98125, ci95: [84.0325, 85.8925] },
  'armed.deliveriesPerMatch': { value: 82.82625, ci95: [81.965, 83.7125] },
  'shut.groundStrikesPerMatch': { value: 17.56625, ci95: [17.0225, 18.095] },
  'armed.groundStrikesPerMatch': { value: 16.74, ci95: [16.205, 17.2925] },
  'shut.teammateStrikesPerMatch': { value: 7.6225, ci95: [7.2775, 7.99] },
  'armed.teammateStrikesPerMatch': { value: 6.93, ci95: [6.64, 7.23625] },
  'shut.altDisplacedShare': { value: 0, ci95: [0, 0] },
  'armed.altDisplacedShare': { value: 0, ci95: [0, 0] },
} as Record<string, { value: number; ci95: number[] }>;
/** GC-T2 §R3's own published joint cells — the re-aim signature's DIFFERENT-BATTERY context */
const GCT2_JOINT_FROZEN: Record<string, number[][]> = {
  shut: [[7432, 34091], [10200, 12247]],
  armed: [[6211, 34538], [9392, 11974]],
};
const GCT2_QUOTED_OK = Object.entries(GCT2_FROZEN).every(([k, v]) => {
  const f = gct2Face(k);
  return f.value === v.value && f.ci95[0] === v.ci95[0] && f.ci95[1] === v.ci95[1];
}) && ['shut', 'armed'].every((a) => JSON.stringify(GCT2.staleMap.byArm[a].jointLaneOpenByShellBlocked)
  === JSON.stringify(GCT2_JOINT_FROZEN[a]))
  && GCT2_SHA.length === 64 && GCT2_HASHED_BODY.length === 64
  && GCT2.perSeedCells.length === 800;

/* ========================================================================== */
/* §4 THE ARMS — the world-11 stack, SHUT vs ARMED, armed by CALLING a4World   */
/* ========================================================================== */
/**
 * ⭐⭐ TWO ARMS, ONE PAIR — IDENTICAL TO GC-T1B's SCORED PAIR (#347 item 2: "arms IDENTICAL to
 * GC-T1B"). GC-T1B's REPORTED-ONLY plane pair is NOT re-walked: its record stands and this
 * block's seeds buy POWER on the scored pair instead (§N).
 */
const ARMS = ['shut', 'armed'] as const;
type Arm = (typeof ARMS)[number];
/** the SCORED pair, named once so no face table can quietly re-point the verdict */
const SCORED_PAIR = ['shut', 'armed'] as const;
const PAIRS: readonly (readonly [Arm, Arm])[] = [
  [SCORED_PAIR[0], SCORED_PAIR[1]],
];
/** ⭐ THE ONE AXIS: the ARMED arm is the arm whose wind-up may express the elected aim. */
const isPricedArm = (a: Arm): boolean => a === 'armed';
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/**
 * ⭐⭐ THE DLC GENE, WRITTEN THE RATIFIED WAY — and the ONE declared departure from DLC-T1's own
 * `armGene`, stated here rather than discovered later.
 *
 * DLC-T1's arming checklist (its own §6 `armGene`) wrote `passLeadSupport` on ALL THREE genome
 * views — `info.genome`, `baseGenome`, `effGenome` — of both teams. That probe predates ruling
 * #334 item 1. CANON, VERBATIM FROM THE LEDGER: *"dose NEVER in info.genome; truth-dosing writes
 * census values through the shipped writer"* (HOME: ruling #270.2, the house law), with the
 * ratified form = the match-local-copy idiom PLUS an info.genome-cleanliness world conjunct,
 * "required of every future dosing instrument". `info.genome` is the LEAGUE FRANCHISE'S OWN
 * OBJECT; writing a born-absent gene there puts it into a save and hands the crossover path a
 * value with the opt-in shut.
 *
 * So the gene is written in the SHIPPED `setCorridorWeight` SHAPE — `baseGenome` and `effGenome`
 * replaced by COPIES carrying the gene, `info.genome` NEVER touched. The seat reads
 * `team.genome`, which IS `effGenome` (`src/sim/Team.ts`'s getter), and mentality rebuilds
 * spread from `baseGenome`, so the DLC doors see exactly the value DLC-T1's checklist delivered
 * — the CHECKLIST's substance (flag + a NON-ABSENT gene on the views the chooser reads, proved
 * by read-back through the SHIPPED `passLeadSupportWeight` map) is kept in full, and only the
 * franchise object is spared. `gGeneValuePinned` proves the VALUE on both views of both teams
 * (the #345 rider's order) and `gGenomeClean` proves the franchise object carries NEITHER gene.
 */
const DLC_GENE_VALUE = 1;
const setPassLeadLocal = (match: Match, side: Side, value: number): void => {
  const team = match.teams[side];
  const view = { ...team.baseGenome, passLeadSupport: value } as TacticalGenome;
  team.baseGenome = view;
  team.effGenome = view;
};

/** the DLC doors each arm opens — declared per arm, never inferred */
const DOORS: Record<Arm, { dlcDeliveryChoice: boolean; dlcStrikePlane: boolean }> = {
  shut: { dlcDeliveryChoice: true, dlcStrikePlane: true },
  armed: { dlcDeliveryChoice: true, dlcStrikePlane: true },
};

/**
 * ⭐ THE WORLD'S OWN COMPOSER IS CALLED, NEVER COPIED. `a4MatchFlags(CORRIDOR_WORLD_VERSION)` is
 * the substrate; the DLC doors and the ONE ground door are the only literals. `armA4World` runs
 * FIRST (world 11's own writer puts `dvExposureWeight` at its 0.5 pin on the match-local views),
 * then the DLC gene is SPREAD onto those same views — so both genes ride the same copies and
 * `corridorArmedVersion` still reads 11.
 */
const buildMatch = (arm: Arm, seed: number): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  const m = new Match({
    ...base,
    ...a4MatchFlags(CORRIDOR_WORLD_VERSION),
    ...DOORS[arm],
    bkGroundCorridor: true,
    ...(isPricedArm(arm) ? { dxWindupAim: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, CORRIDOR_WORLD_VERSION);
  for (const side of [0, 1] as const) setPassLeadLocal(m, side, DLC_GENE_VALUE);
  return m;
};

/* ========================================================================== */
/* §5 THE WALK-SIDE PREDICATES — pure, fixture-backed (canon, #334 item 2)     */
/* ========================================================================== */
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';
interface StatDelta {
  shots: number; clearances: number; passes: number; crosses: number; cutbacks: number;
  throughBalls: number; longBalls: number; headersWon: number;
}
/**
 * ⭐ THE RELEASE CLASSIFIER — R9's / BK-C0 §2(a)'s per-side stat-delta ladder, reused verbatim
 * from BK-C2's own walk. A PURE function, called by BOTH the walk and the fixture table.
 */
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
/** a delivery at all? shots and every headed contact are NAMED OUT and never booked */
const isDelivery = (k: Klass): boolean =>
  k !== 'shot' && k !== 'headerShot' && k !== 'headerKnockdown' && k !== 'headerClearance';
/**
 * ⭐ THE GROUND / LOFTED SPLIT — BK-C2 §P.4's own: a launch is GROUND iff it had NO positive
 * vertical component at the release tick (`grounded`, or the post-gravity `vz0 <= 0`).
 */
const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>
  grounded || !(vzAfterGravity > 0);
/**
 * ⭐⭐ THE MEASURED GROUND PASS — the population every (a)/(b) face is defined on, and the
 * population the GC price actually touches: a GROUND launch, of class shortPass / throughBall /
 * cutback, for which the ENGINE itself names a target (`pendingPass.targetGid`) so a LINE
 * exists to price. BK-C2 §P.4's definition, byte for byte in substance.
 */
const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>
  ground && hasTarget && (k === 'shortPass' || k === 'throughBall' || k === 'cutback');

/** ⭐ THE COMPOSITION FIXTURES — every headline-bearing walk-side predicate, published */
const D0: StatDelta = {
  shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0,
};
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
fx('klassOf.shot', klassOf({ ...D0, shots: 1 }, false), 'shot');
fx('klassOf.headerShot', klassOf({ ...D0, shots: 1, headersWon: 1 }, false), 'headerShot');
fx('klassOf.clearance', klassOf({ ...D0, clearances: 1 }, false), 'clearance');
fx('klassOf.headerClearance', klassOf({ ...D0, clearances: 1, headersWon: 1 }, false), 'headerClearance');
fx('klassOf.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klassOf.cross', klassOf({ ...D0, passes: 1, crosses: 1 }, false), 'cross');
fx('klassOf.cutback', klassOf({ ...D0, passes: 1, cutbacks: 1 }, false), 'cutback');
fx('klassOf.throughBall', klassOf({ ...D0, passes: 1, throughBalls: 1 }, false), 'throughBall');
fx('klassOf.loftedPass', klassOf({ ...D0, passes: 1, longBalls: 1 }, false), 'loftedPass');
fx('klassOf.crossBeatsLong', klassOf({ ...D0, passes: 1, crosses: 1, longBalls: 1 }, false), 'cross');
fx('klassOf.shotBeatsPass', klassOf({ ...D0, shots: 1, passes: 1 }, false), 'shot');
fx('klassOf.headerKnockdown', klassOf({ ...D0, headersWon: 1 }, false), 'headerKnockdown');
fx('klassOf.other', klassOf(D0, true), 'other');
fx('klassOf.null', klassOf(D0, false), null);
fx('isDelivery.shot', isDelivery('shot'), false);
fx('isDelivery.headerKnockdown', isDelivery('headerKnockdown'), false);
fx('isDelivery.shortPass', isDelivery('shortPass'), true);
fx('isDelivery.cross', isDelivery('cross'), true);
fx('isGroundLaunch.grounded', isGroundLaunch(true, 5), true);
fx('isGroundLaunch.rising', isGroundLaunch(false, 0.5), false);
fx('isGroundLaunch.falling', isGroundLaunch(false, -0.5), true);
fx('isGroundLaunch.zero', isGroundLaunch(false, 0), true);
fx('measurable.shortPassGroundTarget', isMeasurableGroundPass('shortPass', true, true), true);
fx('measurable.throughBallGroundTarget', isMeasurableGroundPass('throughBall', true, true), true);
fx('measurable.cutbackGroundTarget', isMeasurableGroundPass('cutback', true, true), true);
fx('measurable.crossExcluded', isMeasurableGroundPass('cross', true, true), false);
fx('measurable.loftedPassExcluded', isMeasurableGroundPass('loftedPass', true, true), false);
fx('measurable.keeperThrowExcluded', isMeasurableGroundPass('keeperThrow', true, true), false);
fx('measurable.noTarget', isMeasurableGroundPass('shortPass', true, false), false);
fx('measurable.notGround', isMeasurableGroundPass('shortPass', false, true), false);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §6 THE FROZEN BINS                                                          */
/* ========================================================================== */
const PERP_BIN_M = 0.5;
const PERP_BINS = 13;
const LANE_BINS = 10;
const UNIT_BIN = 0.1;
/** ⭐ the AIM-DISPLACEMENT histogram: 0.5 m bins, last bin is the ≥ 6 m overflow */
const DISP_BIN_M = 0.5;
const DISP_BINS = 13;
const FLIGHT_RETIRE_TICKS = 720; // R9's own retire cap, inherited (BK-C1 §3)

/* ========================================================================== */
/* §7 THE PER-MATCH ROW (per-seed cells — canon, home ruling #282.2(ii))       */
/* ========================================================================== */
interface Row {
  worldOk: boolean; armedVersion: number; flagOn: boolean; geneOk: boolean; genomeClean: boolean;
  ticks: number; playingTicks: number; matches: number;
  /* --- the engine's own receipts (never football findings) --- */
  ledStrikesApplied: number;
  strikes: number; strikesUnattributed: number;
  strikeByClass: number[];             // [cooldown, stunned]
  strikeBySide: number[];              // [kicker's teammate, kicker's opponent, no live flight]
  strikePerpBins: number[];
  strikeOnGroundFlight: number; strikeOnLoftedFlight: number;
  /* --- the delivery census --- */
  deliveries: number; groundLaunches: number; loftedLaunches: number;
  crosses: number; longBalls: number; throughBalls: number; cutbacks: number;
  /* --- the measured ground-pass population (b) --- */
  gpMeasured: number; gpFromWindup: number; gpFromRelease: number;
  gpLaneBins: number[]; gpCaromLaneBins: number[];
  gpJoint: number[][];                 // [laneOpen|laneContested] x [shellBlocked|shellClear]
  gpJointWindup: number[][];
  gpCaromed: number; gpCaromJoint: number[][]; gpCaromJointWindup: number[][];
  /* --- the price's own LIVENESS census (the corrected gPriceFires form, #334 item 4) --- */
  priceEvals: number; priceEvalNonZero: number;
  /* --- ⭐ THE ALTERNATIVES USAGE CENSUS (REPORTED) --- */
  /* (i) the WIND-UP SEAT's own aim, vs the target's pre-step position — the PRECEDENCE receipt */
  altDecisions: number; altDisplaced: number;
  altSupport: number; altSupportDisplaced: number;
  altDispSumMetres: number; altDispBins: number[];
  /** ⭐⭐ THE DX SPLIT: the CARRIED electon (`pendingPassWindup.aimLead`) vs the LEGACY
   *  aim-field read (the record's own `aim` vs the target's pre-step position — GC-T2's
   *  instrument, which the DX door does NOT move: DX-T0 §SEAM MAP leaves `aim` untouched). */
  altCarried: number; altCarriedSumMetres: number; altCarriedBins: number[];
  altAimFieldDisplaced: number;
  /** ⭐ THE DEPOSIT-SIDE BEHAVIOURAL PIN (#353's rider), counted per walk */
  depCaptures: number; depCarriedOk: number; depNullOk: number; depMismatch: number;
  depResolves: number; depResolveOk: number; depResolveMismatch: number;
  /* (ii) ⭐⭐ THE DELIVERED LEAD, off the STRIKE ITSELF — DLC-T1s's own `performPass` wrapper */
  passStrikes: number; passStrikesToSupport: number;
  ledHandled: number; ledNonZero: number; ledNonZeroToSupport: number;
  leadSumMetres: number; leadMaxMetres: number; leadBins: number[];
  /* --- the game faces --- */
  goals: number; shots: number; passes: number; passesCompleted: number;
  interceptions: number; tackles: number;
  interceptionsCaromPreceded: number;
  possessionFlips: number; flipsCaromLastContact: number;
  /* --- the PERF face --- */
  wallMs: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: 0, flagOn: false, geneOk: false, genomeClean: false,
  ticks: 0, playingTicks: 0, matches: 1,
  ledStrikesApplied: 0, strikes: 0, strikesUnattributed: 0,
  strikeByClass: zeros(2), strikeBySide: zeros(3), strikePerpBins: zeros(PERP_BINS),
  strikeOnGroundFlight: 0, strikeOnLoftedFlight: 0,
  deliveries: 0, groundLaunches: 0, loftedLaunches: 0,
  crosses: 0, longBalls: 0, throughBalls: 0, cutbacks: 0,
  gpMeasured: 0, gpFromWindup: 0, gpFromRelease: 0,
  gpLaneBins: zeros(LANE_BINS), gpCaromLaneBins: zeros(LANE_BINS),
  gpJoint: zeros2(2, 2), gpJointWindup: zeros2(2, 2),
  gpCaromed: 0, gpCaromJoint: zeros2(2, 2), gpCaromJointWindup: zeros2(2, 2),
  priceEvals: 0, priceEvalNonZero: 0,
  altDecisions: 0, altDisplaced: 0, altSupport: 0, altSupportDisplaced: 0,
  altDispSumMetres: 0, altDispBins: zeros(DISP_BINS),
  altCarried: 0, altCarriedSumMetres: 0, altCarriedBins: zeros(DISP_BINS),
  altAimFieldDisplaced: 0,
  depCaptures: 0, depCarriedOk: 0, depNullOk: 0, depMismatch: 0,
  depResolves: 0, depResolveOk: 0, depResolveMismatch: 0,
  passStrikes: 0, passStrikesToSupport: 0,
  ledHandled: 0, ledNonZero: 0, ledNonZeroToSupport: 0,
  leadSumMetres: 0, leadMaxMetres: 0, leadBins: zeros(DISP_BINS),
  goals: 0, shots: 0, passes: 0, passesCompleted: 0,
  interceptions: 0, tackles: 0, interceptionsCaromPreceded: 0,
  possessionFlips: 0, flipsCaromLastContact: 0,
  wallMs: 0,
});
interface Cell { seed: number; shut: Row; armed: Row }

/* ========================================================================== */
/* §8 THE WALK — one match, pure reads of engine state + the SHIPPED predicate  */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'longBalls', 'crosses', 'throughBalls',
  'cutbacks', 'clearances', 'shots', 'headersWon', 'interceptions', 'tackles', 'goals'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface ChoiceRead {
  tick: number; fromWindup: boolean; targetGid: number;
  lane: number; laneRaw: number; hazard: number;
  aimX: number; aimY: number; d: number;
  /** ⭐ THE ALTERNATIVES READ — PURE ENGINE STATE, no seat call, no percept pull (see §8A) */
  aimDisplacementMetres: number; targetInSupportMode: boolean;
  /** ⭐⭐ THE CARRIED ELECTION — `pendingPassWindup.aimLead`'s magnitude (0 when null). This is
   *  the DX door's own channel (DX-T0 §LAW); the record's `aim` field is byte-untouched, which
   *  is why `aimDisplacementMetres` alone still reads GC-T2's structural zero. */
  carriedLeadMetres: number;
}
interface Flight {
  tick: number; gid: number; side: Side; ground: boolean;
  posAtKick: Float64Array; live: boolean; struck: boolean;
  choice: ChoiceRead | null; measured: boolean;
  ox: number; oy: number; ax: number; ay: number;
}

/**
 * ⭐⭐ THE OBSERVER READ IS THE SHIPPED FUNCTION ITSELF. `groundShellHazard` is IMPORTED from
 * `src/ai/deliveryValueSeat.ts` and CALLED with the same body set the pricer's own call site
 * builds (`[team.players, opp.players]`), the same kicker gid and the same receiver gid — so
 * this exam's "shell-blocked" cell and the ARMED arm's price are, by construction, the SAME
 * predicate. Nothing is re-implemented (X-SRC-ZERO's other half: X-REIMPL-ZERO).
 */
/**
 * `compositionWalk` marks the §8B scratch walks: those worlds deliberately carry ABSENT or ZERO
 * genes, so their world/gene conjuncts are the COMPOSITION relations' business and not `gWorld`'s.
 */
const walkMatch = (
  m: Match, expectFlag: boolean, compositionWalk: boolean, traceStrikes = true,
): Row => {
  const t0 = Date.now();
  const row = emptyRow();
  row.armedVersion = corridorArmedVersion(m);
  /** ⭐ THE ARM AXIS IS `dxWindupAim`; `bkGroundCorridor` is TRUE IN BOTH ARMS (the GC-T2
   *  composition), and the world conjunct asserts BOTH. */
  row.flagOn = (m as unknown as { dxWindupAim: boolean }).dxWindupAim === true;
  row.worldOk = row.armedVersion === CORRIDOR_WORLD_VERSION
    && (compositionWalk || (row.flagOn === expectFlag && m.bkGroundCorridor === true));
  /**
   * ⭐⭐ THE geneOk VALUE CHECK — ORDERED BY GC-T1 §COMMANDER CORRECTIONS item 2 (the #345 rider):
   * "A future weight-varying exam must tighten `geneOk` to a VALUE check … insufficient the
   * moment the weight becomes an axis." Two genes are now in play, so BOTH are checked BY VALUE,
   * on BOTH match-local views of BOTH teams, and the DLC gene is read back through the SHIPPED
   * `passLeadSupportWeight` map rather than off the object this probe wrote.
   */
  row.geneOk = ([0, 1] as const).every((s) => {
    const eff = m.teams[s].effGenome as TacticalGenome;
    const bas = m.teams[s].baseGenome as TacticalGenome;
    return eff.dvExposureWeight === CORRIDOR_WORLD_WEIGHT
      && bas.dvExposureWeight === CORRIDOR_WORLD_WEIGHT
      && eff.passLeadSupport === DLC_GENE_VALUE
      && bas.passLeadSupport === DLC_GENE_VALUE
      && passLeadSupportWeight(eff) === DLC_GENE_VALUE
      && passLeadSupportWeight(m.teams[s].genome as TacticalGenome) === DLC_GENE_VALUE;
  });
  /** ⭐ THE DOSE-PLACEMENT CONJUNCT (canon, #334 item 1): the FRANCHISE genome — the object
   *  that serializes and crosses over — must carry NO ground-corridor weight of this exam's
   *  making. World 11 writes the pin on MATCH-LOCAL views only; this asserts it. */
  row.genomeClean = ([0, 1] as const).every((s) => {
    const franchise = m.teams[s].info.genome as TacticalGenome;
    return franchise.dvExposureWeight === undefined && franchise.passLeadSupport === undefined;
  });
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: V2; targetGid: number; aimLead: V2 | null;
    } | null;
    possessionSide: Side;
    dxStrikeAim: { gid: number; lead: V2; tick: number } | null;
    dxWindupAim: boolean;
    armPendingPass: (passer: Player, mate: Player, offsideExempt?: boolean) => void;
    resolvePendingPassWindup: () => void;
  };
  const players = m.allPlayers;
  const N = players.length;
  /**
   * ⭐⭐ THE DELIVERED-LEAD CENSUS — DLC-T1s's OWN OBSERVATION IDIOM, COPIED: a wrapper on this
   * match's `performPass` that RECORDS the chooser's own `ptpLead` argument and DELEGATES with
   * the identical arguments. It is the only honest way to see what the chooser actually
   * DELIVERED, because the wind-up seat's stored `aim` is `mate.pos` on every path.
   * ⚠ IT IS A TRACE, so it is proven inert: the composition proof's G-LOCKSTEP relation walks
   * the SAME seed and world with `traceStrikes` FALSE and requires a BYTE-IDENTICAL whole-match
   * signature (DLC-T1s's `lockstep` receipt, in this exam's own hands).
   */
  /**
   * ⭐⭐ THE DEPOSIT-SIDE BEHAVIOURAL PIN — ORDERED INTO THIS §P BY THE #353 RIDER
   * (DX-T0 §COMMANDER CORRECTIONS item 2: "a captured armed-world decision must assert
   * `pendingPassWindup.aimLead` equals the elected candidate's own displacement — closing the
   * one link currently held by a source-text pin alone"). The wrapper reads the deposit the ONE
   * FORK wrote (`match.dxStrikeAim`, BEFORE `armPendingPass` consumes it), delegates with the
   * IDENTICAL arguments, then reads the record the arm wrote. Three outcomes are counted and
   * NONE is allowed to be a mismatch:
   *   · an ELIGIBLE deposit in an ARMED world  ⇒ `aimLead` EQUALS it, component for component;
   *   · no eligible deposit (or a SHUT world)  ⇒ `aimLead` is exactly `null`.
   * The RELEASE link is pinned in the same breath: the lead the resolve hands `performPass` is
   * the record's own `aimLead`. ⚠ PURE OBSERVATION — both wrappers delegate unchanged, and
   * G-LOCKSTEP walks every composition world with them ABSENT and requires a byte-identical
   * whole-match signature.
   */
  let expectResolveLead: V2 | null | undefined;
  if (traceStrikes) {
    const origArm = mm.armPendingPass.bind(m);
    mm.armPendingPass = (passer: Player, mate: Player, offsideExempt = false): void => {
      const dep = mm.dxStrikeAim;
      const eligible = dep !== null && dep.gid === passer.gid && dep.tick === m.simTick;
      const want: V2 | null = (mm.dxWindupAim === true && eligible)
        ? { x: dep!.lead.x, y: dep!.lead.y } : null;
      origArm(passer, mate, offsideExempt);
      const got = mm.pendingPassWindup?.aimLead ?? null;
      row.depCaptures += 1;
      if (want === null) {
        if (got === null) row.depNullOk += 1; else row.depMismatch += 1;
      } else if (got !== null && got.x === want.x && got.y === want.y) {
        row.depCarriedOk += 1;
      } else row.depMismatch += 1;
    };
    const origResolve = mm.resolvePendingPassWindup.bind(m);
    mm.resolvePendingPassWindup = (): void => {
      const rec = mm.pendingPassWindup;
      expectResolveLead = rec === null ? undefined : rec.aimLead;
      origResolve();
      expectResolveLead = undefined;
    };
    const origPerformPass = m.performPass.bind(m);
    (m as unknown as { performPass: unknown }).performPass = (
      pp: Player, mate: Player, offsideExempt = false, powerChoice = 1,
      ptpLead: Readonly<V2> | null = null,
    ): void => {
      if (expectResolveLead !== undefined) {
        row.depResolves += 1;
        const want = expectResolveLead;
        const ok = want === null
          ? ptpLead === null
          : ptpLead !== null && ptpLead.x === want.x && ptpLead.y === want.y;
        if (ok) row.depResolveOk += 1; else row.depResolveMismatch += 1;
      }
      row.passStrikes += 1;
      const toSupport = mate.action.type === 'SupportBallCarrier';
      if (toSupport) row.passStrikesToSupport += 1;
      if (ptpLead !== null) {
        row.ledHandled += 1;
        const mag = Math.hypot(ptpLead.x, ptpLead.y);
        if (mag > 0) {
          row.ledNonZero += 1;
          if (toSupport) row.ledNonZeroToSupport += 1;
          row.leadSumMetres += mag;
          if (mag > row.leadMaxMetres) row.leadMaxMetres = mag;
          row.leadBins[binOf(mag, DISP_BIN_M, DISP_BINS)] += 1;
        }
      }
      origPerformPass(pp, mate, offsideExempt, powerChoice, ptpLead);
    };
  }
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevWindupGid: number | null = null;
  let prevWindupReady = -1;
  let prevStrikes = 0;
  let prevStrikesCool = 0;
  let prevPossession: Side = mm.possessionSide;
  let strikeSinceRelease = false;
  let lastContactWasStrike = false;
  let flight: Flight | null = null;
  const pendingChoice = new Map<number, ChoiceRead>();

  const readChoice = (p: Player, targetGid: number, tick: number, fromWindup: boolean,
    aim: V2, refPos: V2, aimLead: V2 | null = null): ChoiceRead | null => {
    const team = m.teams[p.side as Side];
    const opp = m.teams[(1 - p.side) as Side];
    const from: V2 = { x: p.pos.x, y: p.pos.y };
    const d = dist(from, aim);
    if (!(d > 1e-6)) return null;
    const laneRaw = laneOpenness(from, aim, opp.players);
    const lane = Math.min(1, laneRaw * (p.traits.includes('playmaker') ? 1.15 : 1));
    /** ⭐ THE SHIPPED PREDICATE, CALLED — the pricer's own body set, kicker and receiver */
    const hazard = groundShellHazard(from, aim, [team.players, opp.players], p.gid, targetGid);
    /**
     * ⭐⭐ THE USAGE READ, AND WHY IT IS A PURE ENGINE READ (§8A states the whole limit).
     * The to-feet candidate's aim IS `mate.pos` — the same object the shipped loop passes —
     * so ANY displacement between the ENGINE'S OWN recorded aim and the named target's
     * position at the choice tick means a NON-TO-FEET candidate won the argmax: a led
     * delivery under `dlcDeliveryChoice`, or a sampled grid member under `dlcStrikePlane`.
     * Nothing is re-implemented and NO seat is constructed here — `passLeadSeatOf` would pull
     * `match.perceivedSnapshot(p)`, which RECONSTRUCTS this body's percept memory in place,
     * so an observer-side seat call could perturb the very walk it is measuring.
     */
    const mate = players[targetGid];
    const disp = dist(aim, refPos);
    return {
      tick, fromWindup, targetGid, lane, laneRaw, hazard, aimX: aim.x, aimY: aim.y, d,
      aimDisplacementMetres: disp,
      targetInSupportMode: mate.action.type === 'SupportBallCarrier',
      carriedLeadMetres: aimLead === null ? 0 : Math.hypot(aimLead.x, aimLead.y),
    };
  };

  const bookFlight = (f: Flight): void => {
    if (!f.measured || f.choice === null) return;
    const c = f.choice;
    const laneIdx = c.lane >= OPEN_LANE_THRESHOLD ? 0 : 1;
    const shellIdx = c.hazard > 0 ? 0 : 1;
    row.gpMeasured++;
    row.priceEvals++;
    if (c.hazard > 0) row.priceEvalNonZero++;
    if (c.fromWindup) row.gpFromWindup++; else row.gpFromRelease++;
    /** ⭐ THE ALTERNATIVES USAGE CENSUS — WIND-UP-SEAT DECISIONS ONLY (§8A): the one-touch
     *  bypass has no wind-up seat, so its choice is read at the RELEASE tick with the aim
     *  TAKEN AS the target's own position — a displacement of exactly 0 BY CONSTRUCTION, which
     *  would dilute the share with a structural zero. Those rows enter no alt cell. */
    if (c.fromWindup) {
      row.altDecisions++;
      /**
       * ⭐⭐ THE DX DISPLACEMENT READ, IN TWO COMPONENTS, UNIONED (the frozen definition):
       *   · the CARRIED election — `pendingPassWindup.aimLead`'s magnitude (the DX channel);
       *   · the LEGACY aim-field read — the record's own `aim` vs the target's PRE-STEP
       *     position (GC-T2's instrument verbatim, which the DX door does not move).
       * A decision is DISPLACED when EITHER is non-zero, so in a SHUT arm the face collapses
       * EXACTLY to GC-T2's own face and reads its structural zero.
       */
      const carried = c.carriedLeadMetres;
      const aimField = c.aimDisplacementMetres;
      if (aimField > 0) row.altAimFieldDisplaced++;
      if (carried > 0) {
        row.altCarried++;
        row.altCarriedSumMetres += carried;
        row.altCarriedBins[binOf(carried, DISP_BIN_M, DISP_BINS)]++;
      }
      const magnitude = Math.max(carried, aimField);
      const displaced = magnitude > 0;
      if (displaced) {
        row.altDisplaced++;
        row.altDispSumMetres += magnitude;
        row.altDispBins[binOf(magnitude, DISP_BIN_M, DISP_BINS)]++;
      }
      if (c.targetInSupportMode) {
        row.altSupport++;
        if (displaced) row.altSupportDisplaced++;
      }
    }
    row.gpLaneBins[binOf(c.lane, UNIT_BIN, LANE_BINS)]++;
    row.gpJoint[laneIdx][shellIdx]++;
    if (c.fromWindup) row.gpJointWindup[laneIdx][shellIdx]++;
    if (f.struck) {
      row.gpCaromed++;
      row.gpCaromJoint[laneIdx][shellIdx]++;
      if (c.fromWindup) row.gpCaromJointWindup[laneIdx][shellIdx]++;
      row.gpCaromLaneBins[binOf(c.lane, UNIT_BIN, LANE_BINS)]++;
    }
  };
  const retire = (): void => {
    if (flight === null) return;
    bookFlight(flight);
    flight = null;
  };

  /**
   * ⭐ THE PRE-STEP POSITION SNAPSHOT — the positions THE CHOOSER SAW. `Match.step` runs the
   * brains and THEN the physics, so a wind-up aim recorded during a step was composed against
   * the positions as they stood BEFORE that step. Comparing an aim to the POST-step position
   * would credit every to-feet kick with one tick of the target's own motion (measured at ≈
   * 0.076 m mean — one tick at walking pace), which is exactly the structural contamination
   * the composition proof's CANDIDATES-FORM relation exists to catch. The world-11 stack does
   * NOT arm `inSnapshotLaw`, so the chooser's `team.players` ARE the truth objects and this
   * pre-step truth read is the chooser's own read.
   */
  const prePos = new Float64Array(N * 2);
  const refOf = (gid: number): V2 => ({ x: prePos[gid * 2], y: prePos[gid * 2 + 1] });
  while (!m.finished) {
    for (let i = 0; i < N; i++) {
      prePos[i * 2] = players[i].pos.x;
      prePos[i * 2 + 1] = players[i].pos.y;
    }
    m.step(DT);
    const tick = m.simTick;
    row.ticks++;
    const playing = m.phase === 'playing';
    if (playing) row.playingTicks++;
    const ball = m.ball;
    const lastTouchGid = ball.lastTouch?.gid ?? null;
    const ballIsLive = playing || m.phase === 'restart';
    const touchChanged = lastTouchGid !== null && lastTouchGid !== prevLastTouchGid;

    const led = m.bkContactLedger;
    const dStrikes = led.strikesApplied - prevStrikes;
    const dStrikesCool = led.strikesAppliedCooldown - prevStrikesCool;
    prevStrikes = led.strikesApplied;
    prevStrikesCool = led.strikesAppliedCooldown;
    const strikeThisTick = dStrikes > 0;

    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* ===== THE STRIKE, ATTRIBUTED — BK-C2 §P.1's own gated rule ===== */
    if (strikeThisTick) {
      const striker = lastTouchGid !== null ? players[lastTouchGid] : null;
      const cooling = striker !== null && striker.kickCooldown > 0;
      const stunned = striker !== null && striker.stunTimer > 0;
      const classAgrees = striker !== null
        && ((dStrikesCool === dStrikes && cooling) || (dStrikesCool === 0 && !cooling && stunned));
      if (striker === null || !classAgrees || dStrikes !== 1) {
        row.strikesUnattributed += dStrikes;
      } else {
        row.strikes++;
        row.strikeByClass[cooling ? 0 : 1]++;
        if (flight !== null && flight.live) {
          const sideIdx = striker.side === flight.side ? 0 : 1;
          row.strikeBySide[sideIdx]++;
          if (flight.ground) row.strikeOnGroundFlight++; else row.strikeOnLoftedFlight++;
          const kx = flight.posAtKick[striker.gid * 2];
          const ky = flight.posAtKick[striker.gid * 2 + 1];
          const cp = closestPointOnSegment(
            { x: flight.ox, y: flight.oy }, { x: flight.ax, y: flight.ay }, { x: kx, y: ky },
          );
          row.strikePerpBins[binOf(dist(cp, { x: kx, y: ky }), PERP_BIN_M, PERP_BINS)]++;
          flight.struck = true;
        } else {
          row.strikeBySide[2]++;
        }
      }
      strikeSinceRelease = true;
      lastContactWasStrike = true;
    } else if (touchChanged) {
      lastContactWasStrike = false;
    }

    /* ===== THE CHOICE SEAT — the ARM-TIME aim, the engine's own record ===== */
    const wu = mm.pendingPassWindup;
    if (wu !== null && (wu.gid !== prevWindupGid || wu.readyTick !== prevWindupReady)) {
      const p = players[wu.gid];
      const c = readChoice(p, wu.targetGid, tick, true, { x: wu.aim.x, y: wu.aim.y },
        refOf(wu.targetGid),
        wu.aimLead === null ? null : { x: wu.aimLead.x, y: wu.aimLead.y });
      if (c !== null) pendingChoice.set(wu.gid, c);
    }
    prevWindupGid = wu?.gid ?? null;
    prevWindupReady = wu?.readyTick ?? -1;

    /* ===== RELEASE DETECTION — the pure classifier above, called ===== */
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
    prevPendingPassT = passT;
    const releases: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        const klass0 = klassOf({
          shots: d.shots[side], clearances: d.clearances[side], passes: d.passes[side],
          crosses: d.crosses[side], cutbacks: d.cutbacks[side],
          throughBalls: d.throughBalls[side], longBalls: d.longBalls[side],
          headersWon: d.headersWon[side],
        }, passChangedSide === side);
        if (klass0 === null) continue;
        let klass = klass0;
        let gid = -1;
        if (passChangedSide === side && mm.pendingPass !== null) gid = mm.pendingPass.passerGid;
        else if (lastTouchGid !== null && players[lastTouchGid].side === side) gid = lastTouchGid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && players[gid].action.type === 'ThrowOut') klass = 'keeperThrow';
        releases.push({ gid, klass });
      }
    }

    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);
    for (const rel of releases) {
      if (!isDelivery(rel.klass)) { pendingChoice.delete(rel.gid); continue; }
      if (hSpeedNow < 1e-6) { pendingChoice.delete(rel.gid); continue; }
      const p = players[rel.gid];
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const ground = isGroundLaunch(grounded, vz0);
      const targetGid = (mm.pendingPass !== null && mm.pendingPass.passerGid === rel.gid)
        ? mm.pendingPass.targetGid : null;
      retire();
      let choice = pendingChoice.get(rel.gid) ?? null;
      pendingChoice.delete(rel.gid);
      if (choice !== null && targetGid !== null && choice.targetGid !== targetGid) choice = null;
      const ox = ball.pos.x - ball.vel.x * DT;
      const oy = ball.pos.y - ball.vel.y * DT;
      const measurable = isMeasurableGroundPass(rel.klass, ground, targetGid !== null);
      if (measurable && choice === null) {
        /* the one-touch bypass releases synchronously (PlayerBrain's own gate) — no wind-up
           seat exists, so the choice is read at the RELEASE tick and booked as such. */
        const t = players[targetGid!];
        const tAim: V2 = { x: t.pos.x, y: t.pos.y };
        choice = readChoice(p, targetGid!, tick, false, tAim, tAim);
      }
      row.deliveries++;
      if (ground) row.groundLaunches++; else row.loftedLaunches++;
      const aimX = choice?.aimX ?? (ox + (ball.vel.x / hSpeedNow) * 20);
      const aimY = choice?.aimY ?? (oy + (ball.vel.y / hSpeedNow) * 20);
      const posAtKick = new Float64Array(N * 2);
      for (let i = 0; i < N; i++) {
        posAtKick[i * 2] = players[i].pos.x;
        posAtKick[i * 2 + 1] = players[i].pos.y;
      }
      flight = {
        tick, gid: rel.gid, side: p.side as Side, ground,
        posAtKick, live: true, struck: false,
        choice, measured: measurable && choice !== null,
        ox, oy, ax: aimX, ay: aimY,
      };
      strikeSinceRelease = false;
      lastContactWasStrike = false;
    }

    /* ===== the engine's own counters, attributed ===== */
    const dInt = d.interceptions[0] + d.interceptions[1];
    if (dInt > 0) {
      row.interceptions += dInt;
      if (strikeSinceRelease) row.interceptionsCaromPreceded += dInt;
    }
    row.tackles += d.tackles[0] + d.tackles[1];
    if (mm.possessionSide !== prevPossession) {
      row.possessionFlips++;
      if (lastContactWasStrike) row.flipsCaromLastContact++;
      prevPossession = mm.possessionSide;
    }

    if (flight !== null) {
      if (ball.owner !== null && ball.owner.gid !== flight.gid) retire();
      else if (tick - flight.tick > FLIGHT_RETIRE_TICKS) retire();
    }
    prevLastTouchGid = lastTouchGid;
  }
  retire();
  row.ledStrikesApplied = m.bkContactLedger.strikesApplied;
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.shots = st[0].shots + st[1].shots;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.crosses = st[0].crosses + st[1].crosses;
  row.longBalls = st[0].longBalls + st[1].longBalls;
  row.throughBalls = st[0].throughBalls + st[1].throughBalls;
  row.cutbacks = st[0].cutbacks + st[1].cutbacks;
  row.wallMs = Date.now() - t0;
  return row;
};

/* ========================================================================== */
/* §8A THE ALTERNATIVES USAGE READ — WHAT IT IS, AND ITS DECLARED LIMIT        */
/* ========================================================================== */
/**
 * ⭐⭐ DLC-T1s §R's OWN CORRECTION RIDES, AND IT IS QUOTED BEFORE ANY DLC FACE IS READ.
 * DLC-T1s (#243 item 1) RETRACTED its first delivered-rate statistic because that statistic
 * "scored two OPPOSITE facts identically: the plane offered another kick and the decision
 * declined it (a real zero-point win) and the plane had nothing to offer (a fully degenerate
 * grid — the treatment was impossible at that decision)", and the symptom that proved it
 * mattered was that the old statistic was NOT MONOTONE IN TREATMENT. Its corrected form
 * conditions on GRID LIVENESS, measured per decision.
 *
 * ⚠⚠ THAT CONDITIONING IS NOT AVAILABLE TO THIS EXAM, AND THE FACE IS NAMED ACCORDINGLY.
 * Liveness needs the seat's own remembered motion, i.e. `match.perceivedSnapshot(p)` — a call
 * that RECONSTRUCTS the body's percept memory in place, so an observer-side pull could perturb
 * the walk it is measuring. This exam therefore publishes a USAGE share, never a decline rate:
 *   · `altDisplacedShare` — of WIND-UP-SEAT measured ground passes, the share whose ENGINE-
 *     RECORDED aim differs from the named target's own position ⇒ a NON-TO-FEET candidate won;
 *   · `altDisplacedShareSupportScoped` — the same on the DLC seats' OWN SCOPE (a target in
 *     `SupportBallCarrier` mode), which is the only class either door can ever displace
 *     (`passLeadOffset` returns exactly ZERO for every other action type). This removes the
 *     largest STRUCTURAL zero class, and it is DLC-T1's own published idiom (#238 item 2's
 *     support-scoped reading).
 * ⛔ NEITHER IS A DECLINE RATE. An undisplaced kick may be the chooser declining a live
 * alternative OR an alternative that was degenerate by arithmetic; this instrument cannot
 * separate them, exactly as DLC-T1s warned. The share is a USAGE receipt about which candidate
 * won, and it is REPORTED, never gated as football.
 */

/* ========================================================================== */
/* §8B ⭐⭐ THE COMPOSITION PROOF — DLC × THE WORLD-11 STACK, BEFORE ANY SCORING */
/* ========================================================================== */
/**
 * CANON, VERBATIM FROM docs/world-model/CANON.md: **"composition proof — any world arming a new
 * seam alongside the CB/L3 stack proves the doors/lifecycle at THAT composition first."**
 * HOME: BU contract M-BU.2 (ruling #285), inherited by M-PW.4 / M-PC.5.
 *
 * The DLC pair has never been walked on the world-11 stack. So BEFORE a single battery seed is
 * read, seven worlds are constructed and walked to completion on OUT-OF-BAND SCRATCH seeds
 * (canon: verifier scratch seeds, ≥ 900,000,000) and compared by WHOLE-MATCH SIGNATURE:
 *
 *   W0 `base`        world 11, no DLC door, gene absent                 — the reference
 *   W1 `bothAbsent`  world 11 + BOTH doors, gene ABSENT      ≡ W0  (each door's G-BORN)
 *   W2 `bothZero`    world 11 + BOTH doors, gene 0           ≡ W0  (⭐ DLC-T0 §LAW's own
 *                    G-law: under this door the gene has NO zero-dose semantics — the
 *                    candidate FORMS at 0 and loses every tie; #238's ARMED-ZERO ≡ ABSENT)
 *   W3 `bothOne`     world 11 + BOTH doors, gene 1           ≠ W0  (THE SCORED ARM's world:
 *                    the doors REACH the chooser — a bite receipt, never an effect size)
 *   W4 `contestOnly` world 11 + `dlcDeliveryChoice` alone, gene 1 ≡ W3
 *                    ⭐⭐ THE FROZEN PRECEDENCE LAW, MEASURED: src/sim/Match.ts says of
 *                    `dlcStrikePlane` that "`ptpPassLead` and `dlcDeliveryChoice` keep
 *                    PRECEDENCE — no grid forms while either seat exists, so armed-both is the
 *                    banked door armed alone, byte for byte (gated, not promised)". The guard
 *                    line itself is pinned at `SP_PRECEDENCE_NEEDLE`. THIS RECEIPT IS WHAT
 *                    ESTABLISHES WHAT THE ORDERED WORLD ACTUALLY IS.
 *   W5 `planeAbsent` world 11 + `dlcStrikePlane` alone, gene ABSENT ≡ W0  (#243's PLANE-INERT
 *                    ≡ ABSENT identity)
 *   W6 `planeOne`    world 11 + `dlcStrikePlane` alone, gene 1  ≠ W0  (the REPORTED pair's
 *                    world: the grid reaches the chooser)
 *
 * LIFECYCLE, on every one of the seven: the constructor does not refuse; `corridorArmedVersion`
 * still reads 11; the contact ledger is all-zero at construction; the franchise `info.genome`
 * carries NEITHER gene; and the match runs to `finished` without throwing.
 * ⚠ THESE ARE ARMING RECEIPTS, NEVER FOOTBALL FINDINGS (canon: receipts ≠ effect sizes).
 */
const SCRATCH_BASE = 900_000_000;
const COMP_SEEDS = [SCRATCH_BASE + 700, SCRATCH_BASE + 701, SCRATCH_BASE + 702];
type CompWorld = 'shutRef' | 'armedRef' | 'noDlcShut' | 'noDlcArmed'
  | 'dlcZeroShut' | 'dlcZeroArmed' | 'contestOnlyArmed';
/**
 * ⭐⭐ THE SEVEN WORLDS — every one of them carries the GC-T2 composition's own ground price
 * (`bkGroundCorridor`), because the composition this exam must prove is DX × THAT stack:
 *   W0 `shutRef`         the SCORED shut arm's world (both DLC doors, gene 1, dx OFF) — reference
 *   W1 `armedRef`        + `dxWindupAim`                    ≠ W0  — ⭐ G-BITE.dx (an ARMING
 *                        receipt, never an effect size)
 *   W2 `noDlcShut`       NO DLC door, gene absent, dx OFF   — the G-INERT reference
 *   W3 `noDlcArmed`      W2 + `dxWindupAim`                 ≡ W2  — ⭐⭐ G-INERT.dx, DX-T0 §R2's
 *                        claim RE-MEASURED at THIS composition (inheritance is not proof)
 *   W4 `dlcZeroShut`     both doors, gene 0, dx OFF         — the zero-dose reference
 *   W5 `dlcZeroArmed`    W4 + `dxWindupAim`                 ≡ W4  — ⭐ G-ZERO.dx: at gene 0 the
 *                        contest candidate forms and loses every tie (DLC-T0 §LAW's own G-law,
 *                        measured again by GC-T2's `G-ZERO.contest`), so NO displaced election
 *                        exists and the door has nothing to carry
 *   W6 `contestOnlyArmed` `dlcDeliveryChoice` ALONE, gene 1, dx ON ≡ W1 — ⭐⭐ G-PRECEDENCE
 *                        under DX: the frozen "no grid forms while either seat exists" law,
 *                        re-measured with the door open
 */
const COMP_WORLDS: Record<CompWorld, {
  doors: { dlcDeliveryChoice?: boolean; dlcStrikePlane?: boolean; dxWindupAim?: boolean };
  gene: number | null;
}> = {
  shutRef: { doors: { dlcDeliveryChoice: true, dlcStrikePlane: true }, gene: DLC_GENE_VALUE },
  armedRef: {
    doors: { dlcDeliveryChoice: true, dlcStrikePlane: true, dxWindupAim: true },
    gene: DLC_GENE_VALUE,
  },
  noDlcShut: { doors: {}, gene: null },
  noDlcArmed: { doors: { dxWindupAim: true }, gene: null },
  dlcZeroShut: { doors: { dlcDeliveryChoice: true, dlcStrikePlane: true }, gene: 0 },
  dlcZeroArmed: {
    doors: { dlcDeliveryChoice: true, dlcStrikePlane: true, dxWindupAim: true }, gene: 0,
  },
  contestOnlyArmed: {
    doors: { dlcDeliveryChoice: true, dxWindupAim: true }, gene: DLC_GENE_VALUE,
  },
};
/** the whole-match signature INCLUDING the rng stream state (the CTB-T0 / DLC-T1 form) */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
interface CompRow {
  world: CompWorld; seed: number; signature: string;
  armedVersion: number; ledgerZeroAtBirth: boolean; franchiseClean: boolean;
  geneReadBack: number | null; exposureReadBack: number | null; finished: boolean;
  windupGroundDecisions: number; displacedDecisions: number;
  carriedDecisions: number; aimFieldDisplacedDecisions: number;
  depCaptures: number; depCarriedOk: number; depNullOk: number; depMismatch: number;
  depResolves: number; depResolveOk: number; depResolveMismatch: number;
  passStrikes: number; ledNonZero: number; untracedSignature: string;
}
const compRows: CompRow[] = [];
let compWalks = 0;
banner('  … composition proof (scratch seeds, before any battery seed)');
for (const seed of COMP_SEEDS) {
  for (const w of Object.keys(COMP_WORLDS) as CompWorld[]) {
    const spec = COMP_WORLDS[w];
    const m = new Match({
      seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
      ...a4MatchFlags(CORRIDOR_WORLD_VERSION), bkGroundCorridor: true, ...spec.doors,
    } as ConstructorParameters<typeof Match>[0]);
    armA4World(m, null, CORRIDOR_WORLD_VERSION);
    if (spec.gene !== null) {
      for (const side of [0, 1] as const) setPassLeadLocal(m, side, spec.gene);
    }
    const ledgerZero = Object.values(m.bkContactLedger).every((x) => x === 0);
    const franchiseClean = ([0, 1] as const).every((si) => {
      const fr = m.teams[si].info.genome as TacticalGenome;
      return fr.dvExposureWeight === undefined && fr.passLeadSupport === undefined;
    });
    const eff0 = m.teams[0].effGenome as TacticalGenome;
    const row = walkMatch(m, false, true);
    compWalks += 1;
    /** ⭐ G-LOCKSTEP's twin: the SAME world and seed walked with the strike trace OFF */
    const twin = new Match({
      seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
      ...a4MatchFlags(CORRIDOR_WORLD_VERSION), bkGroundCorridor: true, ...spec.doors,
    } as ConstructorParameters<typeof Match>[0]);
    armA4World(twin, null, CORRIDOR_WORLD_VERSION);
    if (spec.gene !== null) {
      for (const side of [0, 1] as const) setPassLeadLocal(twin, side, spec.gene);
    }
    walkMatch(twin, false, true, false);
    compWalks += 1;
    compRows.push({
      world: w, seed, signature: signatureOf(m),
      armedVersion: corridorArmedVersion(m), ledgerZeroAtBirth: ledgerZero,
      franchiseClean, geneReadBack: eff0.passLeadSupport ?? null,
      exposureReadBack: eff0.dvExposureWeight ?? null, finished: m.finished,
      windupGroundDecisions: row.altDecisions, displacedDecisions: row.altDisplaced,
      carriedDecisions: row.altCarried, aimFieldDisplacedDecisions: row.altAimFieldDisplaced,
      depCaptures: row.depCaptures, depCarriedOk: row.depCarriedOk, depNullOk: row.depNullOk,
      depMismatch: row.depMismatch, depResolves: row.depResolves,
      depResolveOk: row.depResolveOk, depResolveMismatch: row.depResolveMismatch,
      passStrikes: row.passStrikes, ledNonZero: row.ledNonZero,
      untracedSignature: signatureOf(twin),
    });
  }
  banner(`      composition seed ${seed} done (${round((Date.now() - t0Wall) / 1000, 1)} s)`);
}
const compSig = (w: CompWorld, seed: number): string =>
  compRows.find((r) => r.world === w && r.seed === seed)!.signature;
const compIdentity = (w: CompWorld, ref: CompWorld): boolean =>
  COMP_SEEDS.every((seed) => compSig(w, seed) === compSig(ref, seed));
const compDiffers = (w: CompWorld, ref: CompWorld): boolean =>
  COMP_SEEDS.every((seed) => compSig(w, seed) !== compSig(ref, seed));
const compRowsOf = (w: CompWorld): CompRow[] => compRows.filter((r) => r.world === w);
const DX_ON: CompWorld[] = ['armedRef', 'noDlcArmed', 'dlcZeroArmed', 'contestOnlyArmed'];
const DX_OFF: CompWorld[] = ['shutRef', 'noDlcShut', 'dlcZeroShut'];
const COMP_RELATIONS = [
  { name: 'G-BITE.dx', law: '⭐ THE SCORED ARMED ARM\'s world (the GC-T2 composition + '
    + '`dxWindupAim`) DIFFERS from the SCORED SHUT arm\'s — the door reaches the strike. '
    + '⚠ AN ARMING RECEIPT, never an effect size.',
  ok: compDiffers('armedRef', 'shutRef') },
  { name: 'G-INERT.dx', law: '⭐⭐ DX-T0 §R2\'s CLAIM, RE-MEASURED AT THIS COMPOSITION rather '
    + 'than inherited: with NO delivery-choice door and the gene ABSENT, arming `dxWindupAim` '
    + 'is BYTE-IDENTICAL to leaving it shut — every election is a to-feet election, its '
    + 'displacement is exactly 0,0, the fork\'s second guard is false and NOTHING is deposited '
    + '(M-DX.2\'s "changes NOTHING measurable").',
  ok: compIdentity('noDlcArmed', 'noDlcShut') },
  { name: 'G-ZERO.dx', law: '⭐ at DLC gene 0 the contest candidate FORMS and loses every tie '
    + '(DLC-T0 §LAW\'s G-law, measured again by GC-T2\'s `G-ZERO.contest`), so no DISPLACED '
    + 'election ever wins and the door has nothing to carry: arming it is BYTE-IDENTICAL.',
  ok: compIdentity('dlcZeroArmed', 'dlcZeroShut') },
  { name: 'G-PRECEDENCE.dx', law: '⭐⭐ the frozen precedence law under DX: with the door OPEN, '
    + 'BOTH DLC doors at gene 1 is still BYTE-IDENTICAL to `dlcDeliveryChoice` ALONE at gene 1 '
    + '— "no grid forms while either seat exists, so armed-both is the banked door armed alone, '
    + 'byte for byte". MEASURED, never quoted.',
  ok: compIdentity('contestOnlyArmed', 'armedRef') },
  { name: 'DX-EXPRESSION', law: '⭐⭐ THE RELATION THIS PROOF EXISTS TO FIND: in the ARMED '
    + 'world the wind-up record CARRIES a non-zero elected displacement on at least one '
    + 'decision of every scratch seed, and in EVERY `dxWindupAim`-OFF world it carries one on '
    + 'EXACTLY ZERO decisions (GC-T1B §P11 / GC-T2 §R6\'s `O1-WINDUP-PRECEDENCE`, now shown to '
    + 'be a property OF THE SHUT DOOR rather than of the engine). ⚠ AN ARMING RECEIPT.',
  ok: compRowsOf('armedRef').every((r) => r.carriedDecisions > 0)
    && DX_OFF.every((w) => compRowsOf(w).every((r) => r.carriedDecisions === 0)) },
  { name: 'O1-WINDUP-AIM-FIELD-UNMOVED', law: '⭐ THE HONEST HALF: the wind-up record\'s own '
    + '`aim` field is BYTE-UNTOUCHED by this door (DX-T0 §SEAM MAP), so GC-T2\'s OWN '
    + 'displacement instrument — the record\'s aim against the target\'s PRE-STEP position — '
    + 'still reads EXACTLY ZERO in EVERY world, armed included. This is why the carry must be '
    + 'read from `aimLead` (DX-T0 §COMMANDER CORRECTIONS (#353) item 1).',
  ok: compRows.every((r) => r.aimFieldDisplacedDecisions === 0) },
  { name: 'DX-DEPOSIT-PIN', law: '⭐⭐ THE DEPOSIT-SIDE BEHAVIOURAL PIN (#353\'s rider): on '
    + 'EVERY captured decision in EVERY world, `pendingPassWindup.aimLead` EQUALS the elected '
    + 'candidate\'s own displacement (the deposit the ONE fork wrote, component for component) '
    + 'when the door is armed and an eligible deposit exists, and is EXACTLY `null` otherwise; '
    + 'and the release hands `performPass` that same record value. ZERO mismatches, with the '
    + 'carried case NON-VACUOUS in the armed world.',
  ok: compRows.every((r) => r.depMismatch === 0 && r.depResolveMismatch === 0
      && r.depCaptures === r.depCarriedOk + r.depNullOk
      && r.depResolves === r.depResolveOk)
    && compRowsOf('armedRef').every((r) => r.depCarriedOk > 0)
    && DX_OFF.every((w) => compRowsOf(w).every((r) => r.depCarriedOk === 0)) },
  { name: 'LIFECYCLE', law: 'on every one of the seven worlds and every scratch seed: the '
    + 'constructor does not refuse, `corridorArmedVersion` reads 11, the contact ledger is '
    + 'all-zero at construction, the franchise `info.genome` carries NEITHER gene, and the '
    + 'match runs to `finished`.',
  ok: compRows.every((r) => r.armedVersion === CORRIDOR_WORLD_VERSION && r.ledgerZeroAtBirth
      && r.franchiseClean && r.finished) },
  { name: 'CANDIDATES-FORM', law: 'in every armed composition the alternative machinery actually '
    + 'DELIVERS a non-zero lead into a strike somewhere (candidate formation, not merely seat '
    + 'construction — measured off the SHIPPED `performPass` argument), and in every '
    + 'gene-absent / gene-zero composition it delivers NOTHING.',
  ok: (['shutRef', 'armedRef', 'contestOnlyArmed'] as CompWorld[]).every((w) => compRowsOf(w)
    .some((r) => r.ledNonZero > 0))
    && (['noDlcShut', 'noDlcArmed', 'dlcZeroShut', 'dlcZeroArmed'] as CompWorld[])
      .every((w) => compRowsOf(w).every((r) => r.ledNonZero === 0)) },
  { name: 'G-LOCKSTEP', law: '⭐ THE STRIKE TRACE IS INERT: every one of the seven worlds, on '
    + 'every scratch seed, produces a BYTE-IDENTICAL whole-match signature when walked with the '
    + '`performPass` wrapper INSTALLED and with it ABSENT (DLC-T1s\'s `lockstep` receipt).',
  ok: compRows.every((r) => r.untracedSignature === r.signature) },
  { name: 'WINDUP-CHANNEL-LIVE', law: 'the wind-up channel genuinely carries traffic in EVERY '
    + 'world on EVERY scratch seed (`o1PassWindup` is armed by the world-11 stack), so no '
    + 'identity above is an identity between two worlds in which nothing happened.',
  ok: compRows.every((r) => r.windupGroundDecisions > 0 && r.depCaptures > 0) },
];
const COMPOSITION_OK = COMP_RELATIONS.every((r) => r.ok);
banner(`  … composition proof: ${COMP_RELATIONS.filter((r) => r.ok).length}/`
  + `${COMP_RELATIONS.length} relations hold`);

/* ========================================================================== */
/* §9 THE BATTERY — virgin seeds, BOOKED = WALKED, PAIRED inside each pair     */
/* ========================================================================== */
/* ========================================================================== */
/* §N THE EX-ANTE POWER ARITHMETIC — n FROM GC-T1B's OWN PUBLISHED VARIANCES   */
/* ========================================================================== */
/**
 * ⭐⭐ THE DV-T1B / DF-T3B HOUSE FORM, applied to GC-T1B's own battery (#347 item 2: "n
 * PRE-REGISTERED from GC-T1B's own published variances ... with the sizing arithmetic shown
 * at §P"). NOTHING here is a guess: every input is a FIELD of
 * `docs/world-model/data/gc-t1b-alternatives-arm.json`, read from bytes that are hashed first
 * (canon: "a dose-source guard should hash the bytes it reads, not a self-declared field").
 *
 * THE FOUR STEPS, per face (DV-T1B §N's own arithmetic):
 *   1  half-width = (ci95[1] − ci95[0]) / 2                      ← T1B's PUBLISHED field
 *   2  se(160)    = half-width / z.975                            ← recover the bootstrap SE
 *   3  se(needed) = |target| / (z.975 + z.80)                     ← 80 % power, 95 % two-sided
 *   4  N          = ceil( 160 · (se(160) / se(needed))² )         ← paired-cluster SE ∝ 1/√N
 *
 * ⭐ THE TARGET MAGNITUDES ARE THE DISPATCH'S, NOT MINE (#347 item 2 names them one by one):
 *   · (a1) `groundStrikesPerMatch`      — the OUTLIER-ROBUST magnitude (#346 item 1's
 *          leave-one-out point), ⛔ NOT the fragile −2.15625 headline;
 *   · (a2) `caromedGroundOnOpenLaneShare` — T1B's own Δ (the dispatch names "Δ −0.014, hw
 *          0.0253 at 160"); no #346 leave-one-out point exists for this face;
 *   · (c)  `teammateStrikesPerMatch`    — the OUTLIER-ROBUST magnitude (#346 item 1);
 *   · (d)  `crossesPerMatch`            — T1B's own Δ (the dispatch names "Δ −0.3125, hw
 *          0.353").
 * The ROBUST magnitude for (a2) and (d) is DERIVED AND PUBLISHED BESIDE the requirement too, so
 * the sizing's own sensitivity is visible — it is REPORTED, it moves no frozen number.
 *
 * ⭐⭐ THE ROBUST POINTS ARE RE-DERIVED HERE FROM GC-T1B's OWN STORED CELLS, not re-typed from
 * #346's rounded interval: for each face the MAX-SINGLE-SEED-INFLUENCE cell is found and the
 * paired point estimate is recomputed without it. `G-N` proves the accessors are the SAME
 * definitions by requiring them to reproduce T1B's PUBLISHED full-sample Δ EXACTLY, and
 * requires each derived robust point to lie inside #346's own quoted leave-one-out interval.
 */
const Z_975 = 1.959963985;
const Z_80 = 0.8416212336;
const Z_SUM = Z_975 + Z_80;
const GCT2_CELLS = GCT2.perSeedCells;
const gct2Delta = (k: string): GcT2Delta => {
  const d = GCT2.deltas.find((x) => x.key === k && x.shutArm === 'shut' && x.armedArm === 'armed');
  if (d === undefined) { banner(`DX-T1 FATAL — GC-T2 delta missing: ${k}`); process.exit(3); }
  return d!;
};
const gct2Sens = (k: string): GcT2Sens => {
  const s = GCT2.sensitivity.rows.find((x) => x.face === k);
  if (s === undefined) { banner(`DX-T1 FATAL — GC-T2 sensitivity row missing: ${k}`); process.exit(3); }
  return s!;
};
/**
 * ⭐ THE §P-FROZEN LITERALS OF THE SIZING SOURCE. Every one of these is a FIELD of GC-T1B's
 * committed artifact; `GCT1B_QUOTED_OK` proves the quotation against the hashed bytes, so a
 * drifted source artifact REDS the gate rather than riding in on inheritance (DV-T1B's lesson).
 */
const GCT2_FROZEN_DELTAS: Record<string, { delta: number; ci95: [number, number]; hw: number }> = {
  groundPassesPerMatch: { delta: -2.31875, ci95: [-3.17375, -1.54375], hw: 0.815 },
  groundStrikesPerMatch: { delta: -0.82625, ci95: [-1.415, -0.195], hw: 0.61 },
  teammateStrikesPerMatch: { delta: -0.6925, ci95: [-1.10625, -0.29875], hw: 0.40375 },
  caromedGroundOnOpenLaneShare: {
    delta: 0.00689566, ci95: [-0.00461787, 0.01874934], hw: 0.01168361,
  },
  loftedDeliveriesPerMatch: { delta: 0.16375, ci95: [-0.025, 0.35625], hw: 0.190625 },
  crossesPerMatch: { delta: 0.0675, ci95: [-0.08125, 0.22375], hw: 0.1525 },
};
/** the six sizing faces' accessors — ⚠ these MUST be the same definitions as §10's; gN proves it */
const SIZING_ACCESS: Record<string, { num: (r: GcT2Row) => number; den: (r: GcT2Row) => number }> = {
  groundPassesPerMatch: { num: (r) => r.gpMeasured, den: (r) => r.matches },
  groundStrikesPerMatch: { num: (r) => r.strikeOnGroundFlight, den: (r) => r.matches },
  teammateStrikesPerMatch: { num: (r) => r.strikeBySide[0], den: (r) => r.matches },
  caromedGroundOnOpenLaneShare: {
    num: (r) => r.gpCaromJoint[0][0] + r.gpCaromJoint[0][1], den: (r) => r.gpCaromed,
  },
  loftedDeliveriesPerMatch: { num: (r) => r.loftedLaunches, den: (r) => r.matches },
  crossesPerMatch: { num: (r) => r.crosses, den: (r) => r.matches },
};
const gct2PairedPoint = (key: string, skipIndex: number | null): number => {
  const f = SIZING_ACCESS[key];
  let ns = 0; let ds = 0; let na = 0; let da = 0;
  for (const c of GCT2_CELLS) {
    if (skipIndex !== null && c.index === skipIndex) continue;
    ns += f.num(c.rows.shut); ds += f.den(c.rows.shut);
    na += f.num(c.rows.armed); da += f.den(c.rows.armed);
  }
  return ratio(na, da) - ratio(ns, ds);
};
const SIZING_CONJUNCT: Record<string, string> = {
  groundPassesPerMatch: '(b)',
  groundStrikesPerMatch: '(c) face 1',
  teammateStrikesPerMatch: '(c) face 2',
  caromedGroundOnOpenLaneShare: '(c) face 3',
  loftedDeliveriesPerMatch: '(d) control 1',
  crossesPerMatch: '(d) control 2',
};
const N_SOURCE = 800;
/** the block's own ceiling: 1,000 seeds, with 990–993 (ladder) and 999 (receipts) reserved */
const BLOCK_CAP_PAIRS = 800;
interface SizingRow {
  face: string; conjunct: string; targetKind: string;
  sourceHalfWidth: number; seAtSource: number;
  fullDelta: number; publishedDelta: number; reproducesPublished: boolean;
  maxInfluenceSeed: number; maxInfluence: number; robustPoint: number;
  rulingLooInterval: [number, number] | null; robustPointInsideRulingLoo: boolean | null;
  reproducesPublishedLoo: boolean; publishedLooDelta: number;
  targetMagnitude: number; seNeeded: number; nRequired: number;
  nRequiredAtRobustMagnitude: number;
  mdeAtCap: number; resolvableAtCap: boolean;
}
const SIZING: SizingRow[] = Object.keys(SIZING_ACCESS).map((key) => {
  const d = gct2Delta(key);
  const s = gct2Sens(key);
  const full = gct2PairedPoint(key, null);
  let maxIdx = GCT2_CELLS[0].index;
  let maxInf = -1;
  for (const c of GCT2_CELLS) {
    const inf = Math.abs(full - gct2PairedPoint(key, c.index));
    if (inf > maxInf) { maxInf = inf; maxIdx = c.index; }
  }
  const robust = gct2PairedPoint(key, maxIdx);
  const maxSeed = GCT2_CELLS.find((c) => c.index === maxIdx)!.scoredSeed;
  const seAtSource = d.halfWidth / Z_975;
  /** ⭐ THE TARGET IS ALWAYS THE OUTLIER-ROBUST MAGNITUDE (the dispatch brief's own order:
   *  "sizing … from ITS published variances at its robust magnitudes"). */
  const target = Math.abs(robust);
  const seNeeded = target / Z_SUM;
  const nReq = Math.ceil(N_SOURCE * ((seAtSource / seNeeded) ** 2));
  const mdeAtCap = seAtSource * Math.sqrt(N_SOURCE / BLOCK_CAP_PAIRS) * Z_SUM;
  return {
    face: key, conjunct: SIZING_CONJUNCT[key],
    targetKind: 'OUTLIER-ROBUST (GC-T2\'s own leave-one-out point, RE-DERIVED from its stored '
      + 'cells and required to reproduce its published `sensitivity.looDelta` exactly)',
    sourceHalfWidth: d.halfWidth, seAtSource,
    fullDelta: full, publishedDelta: d.delta,
    reproducesPublished: Math.abs(round(full, 8) - d.delta) < 1e-8,
    maxInfluenceSeed: maxSeed, maxInfluence: maxInf, robustPoint: robust,
    rulingLooInterval: null,
    robustPointInsideRulingLoo: null,
    reproducesPublishedLoo: Math.abs(round(robust, 8) - s.looDelta) < 1e-8
      && maxIdx === s.maxInfluenceIndex && maxSeed === s.maxInfluenceSeed,
    publishedLooDelta: s.looDelta,
    targetMagnitude: target, seNeeded, nRequired: nReq,
    nRequiredAtRobustMagnitude: nReq,
    mdeAtCap, resolvableAtCap: target > mdeAtCap,
  };
});
const N_REQUIRED_MAX = Math.max(...SIZING.map((r) => r.nRequired));
/**
 * ⭐⭐ N_FROZEN = the max requirement, CAPPED BY THE BLOCK. The cap BINDS here, and the two
 * faces it cannot buy are NAMED at §P rather than quietly promised: (a2) needs 1,071 pairs and
 * (c) needs 1,618 pairs AT ITS ROBUST MAGNITUDE — 1.34 and 2.02 blocks. ⛔ NEVER PROMISE POWER
 * YOU DO NOT HAVE (the dispatch's own words).
 */
const N_FROZEN = Math.min(N_REQUIRED_MAX, BLOCK_CAP_PAIRS);
const N_CAP_BINDS = N_REQUIRED_MAX > BLOCK_CAP_PAIRS;
const GCT2_DELTAS_QUOTED_OK = Object.entries(GCT2_FROZEN_DELTAS).every(([k, v]) => {
  const d = gct2Delta(k);
  return d.delta === v.delta && d.ci95[0] === v.ci95[0] && d.ci95[1] === v.ci95[1]
    && d.halfWidth === v.hw;
}) && GCT2_CELLS.length === N_SOURCE;
/**
 * ⭐⭐ G-N — THE POWER RULE'S OWN GATE (DV-T1B §N's form): the frozen literal must EQUAL the
 * derivation, the moments must come from the source artifact, the sizing accessors must
 * REPRODUCE GC-T1B's published Δ exactly (the anti-drift proof that they are the same
 * definitions), each derived robust point must lie inside #346 item 1's OWN quoted
 * leave-one-out interval, and — in FULL mode — the battery must actually have RUN at N_FROZEN.
 * ⛔ A battery that quietly ran a different n reds this gate rather than publishing a smaller
 * MDE as if it were the frozen one.
 */
const G_N_DERIVATION_OK = GCT2_QUOTED_OK && GCT2_DELTAS_QUOTED_OK
  && SIZING.every((r) => r.reproducesPublished)
  && SIZING.every((r) => r.reproducesPublishedLoo)
  && N_FROZEN === Math.min(Math.max(...SIZING.map((x) => x.nRequired)), BLOCK_CAP_PAIRS)
  && N_FROZEN > 0 && N_FROZEN <= BLOCK_CAP_PAIRS;
const SMOKE_SEEDS = Array.from({ length: 40 }, (_, i) => SCRATCH_BASE + 800 + i);

const BLOCK_BASE = 12_527_000;
/**
 * ⭐ THE SUB-BAND SPLIT, DECLARED AT §P (block 12,527,000–999, consumed WHOLE of record):
 *   · the SCORED pair       = 12,527,000–799 (N_FROZEN = 800 seeds × 2 arms = 1,600 walks)
 *   · the SEASON LADDER     = 12,527,990–993 (4 LEAGUE seeds; every ladder MATCH seed is
 *     derived from them through the SHIPPED `hashSeed`, exactly as `League.createMatch` does)
 *   · the construction receipts = 12,527,999, one per arm (2 constructions)
 * The COMPOSITION PROOF, the DEPOSIT PIN and the PREFLIGHT SMOKE walk the OUT-OF-BAND SCRATCH
 * range (≥ 900,000,000) only.
 */
const N_SEEDS = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCORED_SEEDS = MODE === 'smoke'
  ? SMOKE_SEEDS.slice(0, Math.min(N_SEEDS, SMOKE_SEEDS.length))
  : Array.from({ length: N_SEEDS }, (_, i) => BLOCK_BASE + i);
const RECEIPT_SEED = MODE === 'smoke' ? SMOKE_SEEDS[0] : BLOCK_BASE + 999;
/** ⭐ THE SEASON LADDER's own league seeds — inside the SAME authorized block (the dispatch
 *  brief: "battery + ladder ONLY from block 12,527,000–999"). */
const LADDER_SEEDS = MODE === 'smoke'
  ? [SCRATCH_BASE + 850]
  : [BLOCK_BASE + 990, BLOCK_BASE + 991, BLOCK_BASE + 992, BLOCK_BASE + 993];
const SEEDS_OF: Record<Arm, number[]> = {
  shut: SCORED_SEEDS, armed: SCORED_SEEDS,
};

interface Cell4 { index: number; scoredSeed: number; rows: Record<Arm, Row> }
const cells: Cell4[] = [];
for (let i = 0; i < SCORED_SEEDS.length; i++) {
  const sSeed = SCORED_SEEDS[i];
  /** ⭐ THE PERF METHOD (GC-T1 §P7's, inherited): the two arms of a pair are walked BACK TO
   *  BACK on the same seed (shut first, armed second) so scheduler/thermal drift is spread
   *  across both arms rather than concentrated in one. */
  const rows = {
    shut: walkMatch(buildMatch('shut', sSeed), false, false),
    armed: walkMatch(buildMatch('armed', sSeed), true, false),
  } as Record<Arm, Row>;
  cells.push({ index: i, scoredSeed: sSeed, rows });
  if (cells.length % 25 === 0 || cells.length === SCORED_SEEDS.length) {
    banner(`  … battery ${cells.length}/${SCORED_SEEDS.length} paired seeds `
      + `(${round((Date.now() - t0Wall) / 1000, 1)} s)`);
  }
}
let walksBooked = cells.length * ARMS.length;

/** the WORLD-CONSTRUCTION RECEIPT — its own booked seed, all four arms */
const receiptMatches = Object.fromEntries(
  ARMS.map((a) => [a, buildMatch(a, RECEIPT_SEED)]),
) as Record<Arm, Match>;
const receiptFacts = Object.fromEntries(ARMS.map((a) => {
  const m = receiptMatches[a];
  return [a, {
    armedVersion: corridorArmedVersion(m),
    bkGroundCorridor: m.bkGroundCorridor,
    dxWindupAim: (m as unknown as { dxWindupAim: boolean }).dxWindupAim,
    dxStrikeAimAtBirth: (m as unknown as { dxStrikeAim: unknown }).dxStrikeAim,
    windupRecordAtBirth: (m as unknown as { pendingPassWindup: unknown }).pendingPassWindup,
    dlcDeliveryChoice: m.dlcDeliveryChoice,
    dlcStrikePlane: m.dlcStrikePlane,
    ptpPassLead: (m as unknown as { ptpPassLead: boolean }).ptpPassLead,
    bkCorridorPrice: m.bkCorridorPrice,
    bkFacingLaw: m.bkFacingLaw,
    bkContactLaw: m.bkContactLaw,
    dfAssignPersist: m.dfAssignPersist,
    dfSurface: m.dfSurface,
    exposureWeightA: (m.teams[0].effGenome as TacticalGenome).dvExposureWeight,
    exposureWeightB: (m.teams[1].effGenome as TacticalGenome).dvExposureWeight,
    exposureWeightBaseA: (m.teams[0].baseGenome as TacticalGenome).dvExposureWeight,
    leadGeneA: (m.teams[0].effGenome as TacticalGenome).passLeadSupport,
    leadGeneB: (m.teams[1].effGenome as TacticalGenome).passLeadSupport,
    leadGeneBaseA: (m.teams[0].baseGenome as TacticalGenome).passLeadSupport,
    leadWeightReadBackA: passLeadSupportWeight(m.teams[0].genome as TacticalGenome),
    leadWeightReadBackB: passLeadSupportWeight(m.teams[1].genome as TacticalGenome),
    infoGenomeExposureA: (m.teams[0].info.genome as TacticalGenome).dvExposureWeight ?? null,
    infoGenomeExposureB: (m.teams[1].info.genome as TacticalGenome).dvExposureWeight ?? null,
    infoGenomeLeadA: (m.teams[0].info.genome as TacticalGenome).passLeadSupport ?? null,
    infoGenomeLeadB: (m.teams[1].info.genome as TacticalGenome).passLeadSupport ?? null,
    ledgerZero: Object.values(m.bkContactLedger).every((x) => x === 0),
  }];
})) as unknown as Record<Arm, Record<string, unknown>>;
walksBooked += ARMS.length;
/**
 * ⭐ THE ARMS-ISOLATED RECEIPT: inside EACH pair the two constructed worlds differ in EXACTLY
 * ONE construction flag — `bkGroundCorridor`. Compared as OBJECTS over `a4MatchFlags(11)`'s own
 * key set PLUS the three doors this exam names, not asserted flag by flag from memory.
 */
const flagsOf = (m: Match): Record<string, boolean> => {
  const keys = Object.keys(a4MatchFlags(CORRIDOR_WORLD_VERSION)) as string[];
  const out: Record<string, boolean> = {};
  for (const k of keys) out[k] = (m as unknown as Record<string, boolean>)[k] === true;
  out.bkGroundCorridor = m.bkGroundCorridor === true;
  out.dlcDeliveryChoice = m.dlcDeliveryChoice === true;
  out.dlcStrikePlane = m.dlcStrikePlane === true;
  out.dxWindupAim = (m as unknown as { dxWindupAim: boolean }).dxWindupAim === true;
  return out;
};
const flagDiffOf = (a: Arm, b: Arm): string[] => {
  const fa = flagsOf(receiptMatches[a]);
  const fb = flagsOf(receiptMatches[b]);
  return Object.keys(fb).filter((k) => fb[k] !== fa[k]);
};
const flagDiffScored = flagDiffOf(SCORED_PAIR[0], SCORED_PAIR[1]);
/** ⭐ and the DLC AXIS IS IDENTICAL ACROSS THE SCORED ARMS — the dispatch's own requirement */
const dlcAxisIdentical = ARMS.every((a) => receiptFacts[a].dlcStrikePlane === true)
  && ARMS.every((a) => receiptFacts[a].dlcDeliveryChoice === true);

/* pooled cells */
const poolArm = (arm: Arm, pick: (r: Row) => number[]): number[] => {
  const acc = zeros(pick(cells[0].rows[arm]).length);
  for (const c of cells) addInto(acc, pick(c.rows[arm]));
  return acc;
};
const poolArm2 = (arm: Arm, pick: (r: Row) => number[][]): number[][] => {
  const acc = pick(cells[0].rows[arm]).map((x) => zeros(x.length));
  for (const c of cells) addInto2(acc, pick(c.rows[arm]));
  return acc;
};

/* ========================================================================== */
/* §10 THE FACE TABLE — every published face is (numerator, denominator)       */
/* ========================================================================== */
interface FaceDef {
  num: (c: Cell4) => number; den: (c: Cell4) => number;
  unit: string; what: string; denNote: string;
}
const FACES: Record<string, FaceDef> = {};
const perArm = (
  key: string, num: (r: Row) => number, den: (r: Row) => number,
  unit: string, what: string, denNote: string,
): void => {
  for (const a of ARMS) {
    FACES[`${a}.${key}`] = {
      num: (c) => num(c.rows[a]), den: (c) => den(c.rows[a]),
      unit, what: `[${a}] ${what}`, denNote,
    };
  }
};
const MATCH_CLOCK = 'per match (the engine\'s own 240 sim-second match; 1 sim-s = 22.5 display-s)';

/* --- (a) THE GROUND-STRIKE FACES — BK-C2's own instruments, re-derived --- */
perArm('groundStrikesPerMatch', (r) => r.strikeOnGroundFlight, (r) => r.matches,
  `attributed ground-flight body strikes ${MATCH_CLOCK}`,
  '⭐⭐ H-GC.2(a) CONJUNCT 1: attributed body strikes that happened on a GROUND flight, per '
  + 'match. BK-C2 §R1(ii)\'s `strikeShareOnGroundFlight` numerator, published as a per-match '
  + 'COUNT so a fall cannot be manufactured by a shrinking denominator.',
  'denominator = matches walked (1 per cell)');
perArm('caromedGroundOnOpenLaneShare',
  (r) => r.gpCaromJoint[0][0] + r.gpCaromJoint[0][1], (r) => r.gpCaromed,
  'share of caromed measured ground passes',
  '⭐⭐ H-GC.2(a) CONJUNCT 2: of the measured ground passes that ACTUALLY caromed, the share '
  + 'played on a line the CHOOSER\'S OWN gate called OPEN. BK-C2 §R2(i)\'s face verbatim — the '
  + 'stale map\'s own signature, and the thing the price exists to remove.',
  'denominator = measured ground passes whose flight was body-struck');

/* --- (b) NON-SUPPRESSION --- */
perArm('groundPassesPerMatch', (r) => r.gpMeasured, (r) => r.matches,
  `measured ground passes ${MATCH_CLOCK}`,
  '⭐⭐ H-GC.2(b) THE NON-SUPPRESSION FACE: measured ground passes per match — a GROUND launch '
  + 'of class shortPass/throughBall/cutback with a named target. The band is THIS exam\'s own '
  + 'shut arm\'s 95 % interval LOWER EDGE.',
  'denominator = matches walked (1 per cell)');

/* --- (c) THE TEAMMATE-STRIKE FACE --- */
perArm('teammateStrikesPerMatch', (r) => r.strikeBySide[0], (r) => r.matches,
  `attributed teammate-of-kicker body strikes ${MATCH_CLOCK}`,
  '⭐⭐ H-GC.2(c): body strikes whose struck body is the PASSER\'S OWN TEAMMATE, per match — the '
  + 'side-blindness BK-C2 §R1(ii) sized at 2 in 5. Published as a COUNT for the same reason as '
  + '(a).',
  'denominator = matches walked (1 per cell)');

/* --- (d) THE LOFTED-FAMILY CONTROLS --- */
perArm('loftedDeliveriesPerMatch', (r) => r.loftedLaunches, (r) => r.matches,
  `lofted deliveries ${MATCH_CLOCK}`,
  '⭐ H-GC.2(d) CONTROL 1: deliveries whose launch had a POSITIVE vertical component. The GC '
  + 'term never enters the lofted `sL` chain (GC-T0 §SCOPE, machine-pinned), so this line may '
  + 'not move.',
  'denominator = matches walked (1 per cell)');
perArm('crossesPerMatch', (r) => r.crosses, (r) => r.matches,
  `crosses (the engine's own counter, both teams) ${MATCH_CLOCK}`,
  '⭐ H-GC.2(d) CONTROL 2: the engine\'s OWN `crosses` counter, both teams. A delivery family '
  + 'with its own chooser and its own scoring chain — untouched by this seam.',
  'denominator = matches walked (1 per cell)');

/* --- ⭐ REPORTED: THE ALTERNATIVES USAGE CENSUS (§8A's declared limit rides) --- */
perArm('altDisplacedShare', (r) => r.altDisplaced, (r) => r.altDecisions,
  'share of wind-up-seat measured ground passes',
  '⭐⭐ H-DX.1(a) THE SCORED FACE: of WIND-UP-SEAT measured ground passes, the share whose '
  + 'ELECTED AIM IS DISPLACED — the UNION of (i) the CARRIED election, '
  + '`pendingPassWindup.aimLead`\'s magnitude (the DX channel; `null` ⇒ 0), and (ii) the LEGACY '
  + 'aim-field read, the record\'s own `aim` against the target\'s PRE-STEP position (GC-T2\'s '
  + 'instrument verbatim). In a SHUT arm (i) is identically zero, so the face collapses EXACTLY '
  + 'to GC-T2\'s own face and reads its structural zero. ⛔ NOT A DECLINE RATE — DLC-T1s\'s '
  + 'retraction rides (§8A).',
  'denominator = wind-up-seat measured ground passes (the release-tick bypass has no wind-up '
  + 'seat and its aim is the target\'s own position BY CONSTRUCTION, so it enters neither side)');
perArm('altCarriedShare', (r) => r.altCarried, (r) => r.altDecisions,
  'share of wind-up-seat measured ground passes',
  '⭐⭐ REPORTED — THE CARRIED COMPONENT ALONE: the share of wind-up-seat measured ground passes '
  + 'whose record carried a NON-ZERO `aimLead`. This is the DX door\'s own channel and nothing '
  + 'else; in a shut arm it is zero BY THE SEAM (the fork never runs).',
  'denominator = wind-up-seat measured ground passes');
perArm('altAimFieldDisplacedShare', (r) => r.altAimFieldDisplaced, (r) => r.altDecisions,
  'share of wind-up-seat measured ground passes',
  '⭐ REPORTED — THE LEGACY COMPONENT ALONE (GC-T1B §P11 / GC-T2 §R6\'s OWN instrument): the '
  + 'record\'s `aim` field against the target\'s pre-step position. ⚠ The DX door does NOT move '
  + 'this field (DX-T0 §SEAM MAP), so this is expected to stay at the 30,318 / 73,079-decision '
  + 'zero in BOTH arms — published so the old fact\'s own instrument stays visible rather than '
  + 'being silently replaced.',
  'denominator = wind-up-seat measured ground passes');
perArm('meanCarriedLeadMetres', (r) => r.altCarriedSumMetres, (r) => r.altCarried,
  'metres, mean over CARRYING wind-up decisions',
  'REPORTED: how far the carried election moved the wound-up strike point off the target\'s '
  + 'feet. ⚠ A moving denominator (carrying decisions only) — disclosed.',
  'denominator = wind-up-seat measured ground passes carrying a non-zero `aimLead`');
perArm('altDisplacedShareSupportScoped', (r) => r.altSupportDisplaced, (r) => r.altSupport,
  'share of wind-up-seat measured ground passes to a support-mode target',
  '⭐⭐ REPORTED — THE SAME SHARE ON THE DLC SEATS\' OWN SCOPE: a target in `SupportBallCarrier` '
  + 'mode is the ONLY class either door can displace (`passLeadOffset` returns exactly ZERO for '
  + 'every other action type), so this removes the largest STRUCTURAL zero class. DLC-T1\'s own '
  + 'support-scoped idiom (#238 item 2). ⛔ Still a usage share, never a decline rate.',
  'denominator = wind-up-seat measured ground passes whose target was in SupportBallCarrier mode');
perArm('ledDeliveredShare', (r) => r.ledNonZero, (r) => r.passStrikes,
  'share of ground-pass strikes',
  '⭐⭐ REPORTED — THE DELIVERED-LEAD SHARE, measured off the STRIKE ITSELF (DLC-T1s\'s own '
  + '`performPass` wrapper idiom, copied): the share of ground-pass strikes the chooser handed '
  + 'a NON-ZERO `ptpLead`. ⚠ On this composition `o1PassWindup` keeps PRECEDENCE, so a '
  + 'wound-up pass carries NO lead at all — see `compositionProof.relations[O1-WINDUP-'
  + 'PRECEDENCE]`. ⛔ Still a USAGE share, never a decline rate (DLC-T1s\'s retraction rides).',
  'denominator = every `performPass` call in the match, both teams');
perArm('ledDeliveredShareSupportScoped', (r) => r.ledNonZeroToSupport,
  (r) => r.passStrikesToSupport,
  'share of ground-pass strikes to a support-mode target',
  '⭐⭐ REPORTED — the same on the DLC seats\' OWN SCOPE (DLC-T1 #238 item 2\'s support-scoped '
  + 'idiom): a `SupportBallCarrier` target is the only class either door can lead.',
  'denominator = `performPass` calls whose target was in SupportBallCarrier mode');
perArm('meanDeliveredLeadMetres', (r) => r.leadSumMetres, (r) => r.ledNonZero,
  'metres, mean over strikes carrying a non-zero lead',
  'REPORTED: how far the delivered lead moved the strike point off the incumbent one. ⚠ A '
  + 'moving denominator (led strikes only) — disclosed.',
  'denominator = ground-pass strikes carrying a non-zero `ptpLead`');
perArm('passStrikesPerMatch', (r) => r.passStrikes, (r) => r.matches,
  `ground-pass strikes ${MATCH_CLOCK}`,
  'REPORTED: the `performPass` call count itself, so the delivered-lead share\'s denominator '
  + 'is visible.',
  'denominator = matches walked (1 per cell)');
perArm('altSupportScopedShare', (r) => r.altSupport, (r) => r.altDecisions,
  'share of wind-up-seat measured ground passes',
  'REPORTED: how big the DLC seats\' own scope is, so the support-scoped share\'s denominator '
  + 'is visible.',
  'denominator = wind-up-seat measured ground passes');
perArm('meanAimDisplacementMetres', (r) => r.altDispSumMetres, (r) => r.altDisplaced,
  'metres, mean over DISPLACED wind-up decisions',
  'REPORTED: how FAR the winning alternative moved the aim off the target\'s feet. ⚠ A moving '
  + 'denominator (displaced decisions only) — disclosed, and the count face beside it is '
  + '`altDisplacedShare`\'s numerator.',
  'denominator = displaced wind-up-seat measured ground passes');

/* --- REPORTED: the anatomy of the fall --- */
perArm('strikesPerMatch', (r) => r.strikes, (r) => r.matches,
  `attributed body strikes ${MATCH_CLOCK}`,
  'REPORTED: every attributed body strike per match, ground and lofted together — the scale of '
  + 'the phenomenon the user\'s eyes named.',
  'denominator = matches walked (1 per cell)');
perArm('strikeShareTeammateOfKicker', (r) => r.strikeBySide[0],
  (r) => r.strikeBySide[0] + r.strikeBySide[1],
  'share of attributed strikes on a live flight',
  'REPORTED beside (c): the SHARE form of the teammate face (BK-C2 §R1(ii) verbatim).',
  'denominator = strikes attributed to a live flight (teammate + opponent)');
perArm('strikeShareOnGroundFlight', (r) => r.strikeOnGroundFlight,
  (r) => r.strikeOnGroundFlight + r.strikeOnLoftedFlight,
  'share of attributed strikes on a live flight',
  'REPORTED: the SHARE form of (a) conjunct 1 — which delivery family pays.',
  'denominator = strikes attributed to a live flight');
perArm('groundCaromRate', (r) => r.gpCaromed, (r) => r.gpMeasured,
  'caroms per measured ground pass',
  'REPORTED: the base rate — measured ground passes whose flight was body-struck.',
  'denominator = measured ground passes');
perArm('groundOpenLaneButShellBlockedShare', (r) => r.gpJoint[0][0], (r) => r.gpMeasured,
  'share of measured ground passes',
  'REPORTED: THE STALE MAP\'S OWN SIZE — ground passes played on a line the old map called OPEN '
  + 'while the shell predicate says a body sits on it. In the priced arms this is what the '
  + 'price was charged for.',
  'denominator = measured ground passes');
perArm('caromedGroundOpenLaneButShellBlockedShare', (r) => r.gpCaromJoint[0][0], (r) => r.gpCaromed,
  'share of caromed measured ground passes',
  'REPORTED: BK-C2 §R2(i)\'s sharpest cell — of the caroms, the share on a line the old map '
  + 'called open while a body\'s shell was sitting on it.',
  'denominator = measured ground passes whose flight was body-struck');
perArm('caromRateOnOpenLaneShellBlocked', (r) => r.gpCaromJoint[0][0], (r) => r.gpJoint[0][0],
  'caroms per measured ground pass',
  'REPORTED: BK-C2 §R2(ii)\'s discriminating pair, half one — the carom rate on OPEN-lane lines '
  + 'the shell read called BLOCKED.',
  'denominator = measured ground passes in that joint cell');
perArm('caromRateOnOpenLaneShellClear', (r) => r.gpCaromJoint[0][1], (r) => r.gpJoint[0][1],
  'caroms per measured ground pass',
  'REPORTED: the discriminating pair, half two — OPEN-lane lines the shell read also called '
  + 'clear.',
  'denominator = measured ground passes in that joint cell');
perArm('priceEvalNonZeroShare', (r) => r.priceEvalNonZero, (r) => r.priceEvals,
  'share of priced ground lines carrying hazard 1',
  '⭐ THE PRICE\'S OWN LIVENESS CENSUS (the corrected `gPriceFires` form, #334 item 4): the '
  + 'share of measured ground passes whose line the SHIPPED `groundShellHazard` calls blocked. '
  + '⚠ AN INSTRUMENT RECEIPT, never a football finding — and in a SHUT arm it is the read the '
  + 'chooser was NOT charged for.',
  'denominator = measured ground passes (one evaluation each)');

/* --- REPORTED: the game beside the fix --- */
perArm('passCompletion', (r) => r.passesCompleted, (r) => r.passes,
  'share of the engine\'s own `passes` counter',
  'REPORTED beside (b) (BK-T2\'s own Q06 definition, both teams): does the ground game still '
  + 'ARRIVE. Gated by nothing.',
  'denominator = every `team.stats.passes` increment, both teams');
perArm('possessionSpellSeconds', (r) => r.playingTicks * DT, (r) => r.possessionFlips,
  'sim-seconds of playing time per possession change (240 s match clock)',
  'REPORTED beside (b): the mean POSSESSION SPELL. A price that suppressed passing without '
  + 'suppressing turnovers would show here.',
  'denominator = every `possessionSide` flip in the match');
perArm('possessionFlipsPerMatch', (r) => r.possessionFlips, (r) => r.matches,
  `possession changes ${MATCH_CLOCK}`,
  'REPORTED: the flip count itself, so the spell face\'s denominator is visible.',
  'denominator = matches walked (1 per cell)');
perArm('flipsCaromLastContactShare', (r) => r.flipsCaromLastContact, (r) => r.possessionFlips,
  'share of possession flips',
  'REPORTED: the share of possession changes whose LAST ball contact was a body strike — '
  + 'BK-C2 §R4\'s loss face. ⚠ TEMPORAL, NOT CAUSAL.',
  'denominator = every `possessionSide` flip in the match');
perArm('interceptionCaromPrecededShare', (r) => r.interceptionsCaromPreceded, (r) => r.interceptions,
  'share of scored interceptions',
  '⭐ REPORTED — THE INTERCEPTION DECOMPOSITION (BK-C2 §R4 (vi)\'s form): the share of the '
  + 'engine\'s own scored `interceptions` that had a body carom on the ball since the delivery '
  + 'was released. ⚠ A TEMPORAL attribution rule, never a causal claim.',
  'denominator = every `team.stats.interceptions` increment, both teams');
perArm('interceptionsPerMatch', (r) => r.interceptions, (r) => r.matches,
  `scored interceptions ${MATCH_CLOCK}`,
  'REPORTED: the interception count itself, so the decomposition\'s denominator is visible.',
  'denominator = matches walked (1 per cell)');
perArm('interceptionsPerTackle', (r) => r.interceptions, (r) => r.tackles,
  'interceptions per tackle',
  'REPORTED: R-乙\'s Q27 axis read on THIS exam\'s seeds. ⚠ NOT a re-measurement of R-乙.',
  'denominator = every `team.stats.tackles` increment, both teams');
perArm('goalsPerMatch', (r) => r.goals, (r) => r.matches,
  `goals ${MATCH_CLOCK}`, 'REPORTED context: goals per match.',
  'denominator = matches walked (1 per cell)');
perArm('shotsPerMatch', (r) => r.shots, (r) => r.matches,
  `shots ${MATCH_CLOCK}`, 'REPORTED context: shots per match.',
  'denominator = matches walked (1 per cell)');
perArm('deliveriesPerMatch', (r) => r.deliveries, (r) => r.matches,
  `deliveries of every family ${MATCH_CLOCK}`,
  '⭐⭐ REPORTED — THE RE-AIM SIGNATURE\'S OTHER HALF: the whole delivery population. In GC-T1 '
  + 'this FELL with the ground passes, which is what "the deliveries simply stop happening" '
  + 'meant. If blocked mass MOVES rather than vanishing, this holds while the joint cells shift.',
  'denominator = matches walked (1 per cell)');
perArm('strikeAttributionCompleteness', (r) => r.strikes, (r) => r.strikes + r.strikesUnattributed,
  'share of ledger strikes the walk could name',
  'THE INSTRUMENT\'S OWN HONESTY FACE. ⚠ AN INSTRUMENT RECEIPT, never a football finding '
  + '(canon: receipts ≠ effect sizes).',
  'denominator = every applied strike the engine ledgered');
/* --- THE PERF FACE (GC-T1 §P7's method, inherited) --- */
perArm('wallSecondsPerMatch', (r) => r.wallMs / 1000, (r) => r.matches,
  'wall seconds per walked match (⚠ THIS MACHINE, THIS RUN)',
  '⭐ THE PERF FACE. METHOD (GC-T1 §P7\'s, inherited and declared at §P): each walk is timed '
  + 'end to end with `Date.now()` around it; the two arms of a pair are walked BACK TO BACK on '
  + 'the same seed (shut first, armed second) so thermal/scheduler drift is spread across both '
  + 'arms; the face is Σ wall seconds ÷ walks. ⚠ IT MEASURES THE WALK, NOT THE ENGINE ALONE — '
  + 'the observer\'s own `laneOpenness` and `groundShellHazard` reads are inside the timed '
  + 'region in EVERY arm, so the DIFFERENCE is the priced chooser\'s cost and the LEVEL is not '
  + 'the game\'s frame cost. A machine reading, never a portable number.',
  'denominator = matches walked (1 per cell)');

const FACE_KEYS = Object.keys(FACES).sort();

/* ========================================================================== */
/* §11 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)  */
/* ========================================================================== */
/**
 * ⭐ The intervals are BOOTSTRAP RESAMPLES OF THE WALKED CELLS (the IN-T0 / DF-T2 / IN-T1 /
 * BK-C1 / BK-C2 / GC-T1 precedent, #329 item 4), not a registry-consuming statistic. THE CLUSTER
 * IS THE CELL INDEX and BOTH ARMS OF A PAIR RIDE THE SAME RESAMPLED CELL, so each pair's Δ is
 * PAIRED by construction. One pair only in this exam, so no Δ crosses a sub-band.
 */
const BOOTSTRAP = 2000;
const scoredSeedsWalked = [...new Set(cells.map((c) => c.scoredSeed))].sort((a, b) => a - b);
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceRow {
  face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = FACE_KEYS.map((key) => {
  const f = FACES[key];
  const nu = cells.map((c) => f.num(c));
  const de = cells.map((c) => f.den(c));
  const point = ratio(sum(nu), sum(de));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n = 0;
    let dd = 0;
    for (const i of idx) { n += nu[i]; dd += de[i]; }
    const v = ratio(n, dd);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  return {
    face: key, unit: f.unit, what: f.what, denNote: f.denNote,
    value: point, numerator: sum(nu), denominator: sum(de),
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
  };
});
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`GC-T2 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
};
/** ⭐ THE PAIRED Δ — the SAME resampled cells re-derive BOTH arms of the pair inside each draw */
interface DeltaRow {
  key: string; pair: string; shutArm: Arm; armedArm: Arm;
  shut: number; armed: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean;
}
const pairedDelta = (key: string, pair: readonly [Arm, Arm]): DeltaRow => {
  const fs = FACES[`${pair[0]}.${key}`];
  const fa = FACES[`${pair[1]}.${key}`];
  const ns = cells.map((c) => fs.num(c));
  const ds = cells.map((c) => fs.den(c));
  const na = cells.map((c) => fa.num(c));
  const da = cells.map((c) => fa.den(c));
  const pShut = ratio(sum(ns), sum(ds));
  const pArmed = ratio(sum(na), sum(da));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += ns[i]; d1 += ds[i]; n2 += na[i]; d2 += da[i]; }
    const v = ratio(n2, d2) - ratio(n1, d1);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  const hw = (hi - lo) / 2;
  return {
    key, pair: `${pair[0]}→${pair[1]}`, shutArm: pair[0], armedArm: pair[1],
    shut: pShut, armed: pArmed, delta: pArmed - pShut,
    ciLo: lo, ciHi: hi, halfWidth: hw,
    absDeltaOverHalfWidth: ratio(Math.abs(pArmed - pShut), hw),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
  };
};
const DELTA_KEYS = ['altDisplacedShare', 'altCarriedShare', 'altAimFieldDisplacedShare',
  'altDisplacedShareSupportScoped',
  'groundStrikesPerMatch', 'caromedGroundOnOpenLaneShare',
  'teammateStrikesPerMatch', 'groundPassesPerMatch', 'loftedDeliveriesPerMatch',
  'crossesPerMatch', 'strikesPerMatch', 'passCompletion', 'possessionSpellSeconds',
  'interceptionsPerMatch', 'interceptionCaromPrecededShare', 'groundCaromRate',
  'goalsPerMatch', 'deliveriesPerMatch', 'ledDeliveredShare',
  'ledDeliveredShareSupportScoped', 'passStrikesPerMatch', 'wallSecondsPerMatch'];
const deltas = PAIRS.flatMap((pr) => DELTA_KEYS.map((k) => pairedDelta(k, pr)));
const deltaOf = (k: string, pair: readonly [Arm, Arm]): DeltaRow => {
  const d = deltas.find((x) => x.key === k && x.shutArm === pair[0] && x.armedArm === pair[1]);
  if (d === undefined) { banner(`GC-T2 FATAL — unknown delta ${k}`); process.exit(3); }
  return d!;
};
const delta = (k: string): DeltaRow => deltaOf(k, SCORED_PAIR);

/* ========================================================================== */
/* §11B ⭐⭐ THE LEAVE-ONE-OUT SENSITIVITY FACE — PRE-REGISTERED, REPORTED      */
/* ========================================================================== */
/**
 * ⭐⭐ RULING #346 item 1's STANDING ORDER, in code: *"A future exam pre-registers an
 * outlier-sensitivity face (leave-one-out influence, REPORTED) alongside its primary faces."*
 *
 * FOR EVERY SCORED FACE — the two (a) faces, (b)'s face, (c)'s face and both (d) controls —
 * this publishes:
 *   · `maxInfluenceSeed` / `maxInfluence` — the SINGLE cell whose removal moves the scored
 *     statistic furthest, and by how much (the influence census, all n cells examined);
 *   · the LEAVE-THAT-ONE-OUT RE-BOOTSTRAP of the whole scored statistic — the #346 verifier's
 *     own procedure, run with this exam's own estimator on n − 1 cells;
 *   · `conjunctFlips` — whether the FROZEN predicate would read differently on the LOO draw.
 *
 * ⛔⛔ NO GATE READS THIS FACE, AND NOTHING IS TRIMMED. The primary faces are the full-n
 * untrimmed readings and they alone carry H-GC.2's verdict; the sensitivity reading stands
 * BESIDE them and the commander reads both (#347 item 2). ⛔ No seed is ever dropped from a
 * published face.
 */
const SENS_DELTA_KEYS = ['altDisplacedShare', 'groundPassesPerMatch',
  'groundStrikesPerMatch', 'teammateStrikesPerMatch', 'caromedGroundOnOpenLaneShare',
  'loftedDeliveriesPerMatch', 'crossesPerMatch'];
/** the paired Δ point estimate over a cell subset (skip = the cell index left out, or null) */
const pairedPointSub = (key: string, skip: number | null): number => {
  const fs = FACES[`${SCORED_PAIR[0]}.${key}`];
  const fa = FACES[`${SCORED_PAIR[1]}.${key}`];
  let ns = 0; let ds = 0; let na = 0; let da = 0;
  for (const c of cells) {
    if (c.index === skip) continue;
    ns += fs.num(c); ds += fs.den(c); na += fa.num(c); da += fa.den(c);
  }
  return ratio(na, da) - ratio(ns, ds);
};
/** an arm's own pooled point over a cell subset */
const armPointSub = (faceKey: string, skip: number | null): number => {
  const f = FACES[faceKey];
  let n = 0; let d = 0;
  for (const c of cells) { if (c.index === skip) continue; n += f.num(c); d += f.den(c); }
  return ratio(n, d);
};
/** the LOO resample index — its OWN rng stream, seeded from the block base + 1 */
const rngLoo = new Rng(BLOCK_BASE + 1);
const looResample: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length - 1 },
    () => Math.floor(rngLoo.next() * (cells.length - 1)) % (cells.length - 1)));
const looCells = (skip: number): Cell4[] => cells.filter((c) => c.index !== skip);
const looDeltaCi = (key: string, skip: number): [number, number] => {
  const sub = looCells(skip);
  const fs = FACES[`${SCORED_PAIR[0]}.${key}`];
  const fa = FACES[`${SCORED_PAIR[1]}.${key}`];
  const ns = sub.map((c) => fs.num(c)); const ds = sub.map((c) => fs.den(c));
  const na = sub.map((c) => fa.num(c)); const da = sub.map((c) => fa.den(c));
  const draws: number[] = [];
  for (const idx of looResample) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += ns[i]; d1 += ds[i]; n2 += na[i]; d2 += da[i]; }
    const v = ratio(n2, d2) - ratio(n1, d1);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  return [pctl(draws, 0.025), pctl(draws, 0.975)];
};
const looFaceCi = (faceKey: string, skip: number): [number, number] => {
  const sub = looCells(skip);
  const f = FACES[faceKey];
  const nu = sub.map((c) => f.num(c)); const de = sub.map((c) => f.den(c));
  const draws: number[] = [];
  for (const idx of looResample) {
    let n = 0; let d = 0;
    for (const i of idx) { n += nu[i]; d += de[i]; }
    const v = ratio(n, d);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  return [pctl(draws, 0.025), pctl(draws, 0.975)];
};
interface SensRow {
  face: string; conjunct: string; predicateForm: string;
  fullDelta: number; maxInfluenceIndex: number; maxInfluenceSeed: number; maxInfluence: number;
  influenceShareOfDelta: number;
  looDelta: number; looCi95: [number, number];
  primaryPass: boolean; looPass: boolean; conjunctFlips: boolean;
  looShutBand: number | null; looArmedPoint: number | null; looShutCi95: [number, number] | null;
}
const SENS_CONJ: Record<string, string> = {
  altDisplacedShare: '(a)', groundPassesPerMatch: '(b)',
  groundStrikesPerMatch: '(c) face 1', teammateStrikesPerMatch: '(c) face 2',
  caromedGroundOnOpenLaneShare: '(c) face 3',
  loftedDeliveriesPerMatch: '(d) control 1', crossesPerMatch: '(d) control 2',
};
const LEVEL_TEST_KEYS = ['groundPassesPerMatch', 'loftedDeliveriesPerMatch', 'crossesPerMatch'];
/** ⭐ (c)'s three faces — the NON-WORSENING form, scored on the Δ against a within-battery margin */
const NON_WORSEN_KEYS = ['groundStrikesPerMatch', 'teammateStrikesPerMatch',
  'caromedGroundOnOpenLaneShare'];
/** the NON-WORSENING MARGIN — THIS exam's own shut arm's 95 % interval HALF-WIDTH for the face */
const nonWorsenMargin = (key: string): number => face(`${SCORED_PAIR[0]}.${key}`).halfWidth;
const sensitivityRows: SensRow[] = SENS_DELTA_KEYS.map((key) => {
  const full = pairedPointSub(key, null);
  let bestIdx = 0;
  let bestInf = -1;
  for (const c of cells) {
    const inf = Math.abs(full - pairedPointSub(key, c.index));
    if (inf > bestInf) { bestInf = inf; bestIdx = c.index; }
  }
  const looD = pairedPointSub(key, bestIdx);
  const looCi = looDeltaCi(key, bestIdx);
  const isLevel = LEVEL_TEST_KEYS.includes(key);
  const dRow = delta(key);
  let primaryPass: boolean;
  let looPass: boolean;
  let looShutBand: number | null = null;
  let looArmed: number | null = null;
  let looShutCi: [number, number] | null = null;
  if (isLevel) {
    looShutCi = looFaceCi(`${SCORED_PAIR[0]}.${key}`, bestIdx);
    looArmed = armPointSub(`${SCORED_PAIR[1]}.${key}`, bestIdx);
    looShutBand = looShutCi[0];
    if (key === 'groundPassesPerMatch') {
      primaryPass = face(`${SCORED_PAIR[1]}.${key}`).value >= face(`${SCORED_PAIR[0]}.${key}`).ciLo;
      looPass = looArmed >= looShutCi[0];
    } else {
      const sf = face(`${SCORED_PAIR[0]}.${key}`);
      const af = face(`${SCORED_PAIR[1]}.${key}`);
      primaryPass = af.value >= sf.ciLo && af.value <= sf.ciHi;
      looPass = looArmed >= looShutCi[0] && looArmed <= looShutCi[1];
    }
  } else if (NON_WORSEN_KEYS.includes(key)) {
    /** ⭐ (c) NON-WORSENING: the paired Δ's 95 % UPPER edge ≤ the shut arm's own half-width.
     *  ⚠ THE MARGIN IS THE FULL-n SHUT ARM'S, held FIXED across the LOO redraw — the
     *  sensitivity face asks "does one seed carry the Δ", not "does one seed move the margin". */
    const margin = nonWorsenMargin(key);
    primaryPass = dRow.ciHi <= margin;
    looPass = looCi[1] <= margin;
  } else {
    /** ⭐ (a) LEAVES ZERO RESOLVEDLY: the paired Δ's 95 % interval ENTIRELY ABOVE ZERO, and
     *  the ARMED arm's OWN interval entirely above zero. */
    const af = face(`${SCORED_PAIR[1]}.${key}`);
    primaryPass = dRow.excludesZeroAbove && af.ciLo > 0;
    looPass = looCi[0] > 0
      && looFaceCi(`${SCORED_PAIR[1]}.${key}`, bestIdx)[0] > 0;
  }
  return {
    face: key, conjunct: SENS_CONJ[key],
    predicateForm: isLevel
      ? (key === 'groundPassesPerMatch'
        ? 'NON-INFERIORITY: armed point ≥ shut 95 % interval LOWER EDGE'
        : 'LEVEL: armed point INSIDE the shut 95 % interval')
      : (NON_WORSEN_KEYS.includes(key)
        ? 'NON-WORSENING: paired Δ 95 % UPPER edge ≤ the shut arm\'s own 95 % half-width'
        : 'RESOLUTION UPWARD: paired Δ 95 % interval ENTIRELY ABOVE ZERO and the armed arm\'s '
          + 'own 95 % interval entirely above zero'),
    fullDelta: full, maxInfluenceIndex: bestIdx,
    maxInfluenceSeed: cells[bestIdx].scoredSeed, maxInfluence: bestInf,
    influenceShareOfDelta: ratio(bestInf, Math.abs(full)),
    looDelta: looD, looCi95: looCi,
    primaryPass, looPass, conjunctFlips: primaryPass !== looPass,
    looShutBand, looArmedPoint: looArmed, looShutCi95: looShutCi,
  };
});

/* ========================================================================== */
/* §12 H-GC.2 — THE FROZEN VERDICT, EVALUATED (never re-cut after sight)       */
/* ========================================================================== */
/**
 * ⛔ THE VERDICT IS SCORED ON THE `shut` → `armed` PAIR ONLY. The plane pair is REPORTED.
 * (a) BOTH ground-strike faces: the PAIRED Δ (armed − shut) 95 % interval ENTIRELY BELOW ZERO.
 * (b) `armed.groundPassesPerMatch` point ≥ THIS exam's own SHUT arm's 95 % interval LOWER EDGE.
 * (c) `teammateStrikesPerMatch`: the same paired form as (a).
 * (d) each control's ARMED point estimate INSIDE THIS shut arm's own 95 % interval [lo, hi].
 */
const A_KEY = 'altDisplacedShare';
const C_KEYS = NON_WORSEN_KEYS;
const D_KEYS = ['loftedDeliveriesPerMatch', 'crossesPerMatch'];
const aDelta = delta(A_KEY);
const aArmed = face(`${SCORED_PAIR[1]}.${A_KEY}`);
const aShut = face(`${SCORED_PAIR[0]}.${A_KEY}`);
const conjunctA = {
  key: A_KEY,
  shut: aShut.value, armed: aArmed.value,
  armedCi: [aArmed.ciLo, aArmed.ciHi], deltaCi: [aDelta.ciLo, aDelta.ciHi],
  deltaExcludesZeroAbove: aDelta.excludesZeroAbove, armedExcludesZeroAbove: aArmed.ciLo > 0,
  pass: aDelta.excludesZeroAbove && aArmed.ciLo > 0,
};
const bBand = face(`${SCORED_PAIR[0]}.groundPassesPerMatch`).ciLo;
const bArmed = face(`${SCORED_PAIR[1]}.groundPassesPerMatch`).value;
const conjunctB = { key: 'groundPassesPerMatch', band: bBand, armed: bArmed, pass: bArmed >= bBand };
const conjunctC = C_KEYS.map((k) => {
  const d = delta(k);
  const margin = nonWorsenMargin(k);
  const sf = face(`${SCORED_PAIR[0]}.${k}`);
  const af = face(`${SCORED_PAIR[1]}.${k}`);
  return {
    key: k, shut: sf.value, armed: af.value, delta: d.delta,
    deltaCi: [d.ciLo, d.ciHi], nonWorseningMargin: margin,
    marginProvenance: 'THIS exam\'s own shut arm\'s 95 % interval HALF-WIDTH for this face — '
      + '(b)\'s band construction mirrored onto the Δ scale. No taste constant.',
    pass: d.ciHi <= margin,
  };
});
const conjunctD = D_KEYS.map((k) => {
  const sf = face(`${SCORED_PAIR[0]}.${k}`);
  const af = face(`${SCORED_PAIR[1]}.${k}`);
  return {
    key: k, shutCi: [sf.ciLo, sf.ciHi], armed: af.value,
    pass: af.value >= sf.ciLo && af.value <= sf.ciHi,
  };
});
const H_DX_1 = {
  a: conjunctA.pass,
  b: conjunctB.pass,
  c: conjunctC.every((x) => x.pass),
  d: conjunctD.every((x) => x.pass),
};
const H_DX_1_ALL = H_DX_1.a && H_DX_1.b && H_DX_1.c && H_DX_1.d;

/* ========================================================================== */
/* §13 ⭐ THE SEASON LADDER — REPORTED, GATED BY NOTHING (the house form)       */
/* ========================================================================== */
/**
 * ⭐⭐ THE DISPATCH'S OWN ORDER (#353 item 4 / the dispatch brief): "THE SEASON LADDER
 * (probe-side, the DLC gene evolvable, goals × generation per the house form, match-local dose
 * idiom + info.genome-cleanliness conjunct)". The BK-T4 §10 / DF-C0 §R4 house ladder, with the
 * gene axis re-pointed at the DLC gene `passLeadSupport`:
 *   · `geneAbsent`   — `evolvePassLeadSupport` FALSE: the gene stays STRUCTURALLY ABSENT for
 *     every generation (mutation and crossover draw no value for it). THE CONTROL.
 *   · `geneEvolvable` — `evolvePassLeadSupport` TRUE: the gene may enter the population through
 *     the SHIPPED `mutateGenome` / `crossoverGenomes` opt-in path. ⛔ NOTHING IS PRE-SEEDED and
 *     NO VALUE IS EVER SET BY HAND in this ladder.
 * BOTH arms walk THE ARMED WORLD (the GC-T2 composition + `dxWindupAim`), so the DOOR is open in
 * both and the only question is whether a coach who plays the alternative line can SPREAD.
 * ⭐ THE DOSE IDIOM IS UNCHANGED: `armA4World` writes `dvExposureWeight` on MATCH-LOCAL views
 * only, and `gLadderClean` proves the franchise `info.genome` carries NO exposure weight on any
 * ladder match (canon #270.2 / #334 item 1) and NO `passLeadSupport` in the CONTROL arm.
 * ⚠ THE NEUTRAL-DRIFT SHADOW rides the control arm: inert passengers mutated by the SAME law in
 * their OWN rng namespace, inherited through the SAME elite/mutate/reborn assignments. They
 * touch no match, so they are what the gene level looks like with ZERO selection on it.
 * ⛔ REPORTED, GATED BY NOTHING as football: no H-DX.1 conjunct reads a ladder number.
 */
const LADDER_ARMS = ['geneAbsent', 'geneEvolvable'] as const;
type LadderArm = (typeof LADDER_ARMS)[number];
const LADDER_TEAMS = 10;
const LADDER_GENS = MODE === 'smoke' ? 2 : 20;
const LADDER_ELITE_N = 2;
const LADDER_REBORN_N = 2;
const MUT_RATE = 0.4;
const MUT_SCALE = 0.08;
const REBORN_RATE = 0.5;
const REBORN_SCALE = 0.15;
const EARLY_GENS = 5;
const LATE_FROM = LADDER_GENS - 4;
interface LadderTeam { slot: number; genome: TacticalGenome }
interface LadderCell {
  arm: LadderArm; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; passes: number; passesCompleted: number;
  interceptions: number; longBalls: number;
  geneMean: number; geneSd: number; geneMax: number;
  genePresentShare: number; geneAboveZeroShare: number;
  driftMean: number | null; driftSd: number | null;
  fitnessGeneCorrelation: number;
  doorChecked: number; doorWrong: number; franchiseDirty: number;
  wallSeconds: number;
}
const pearson = (a: readonly number[], b: readonly number[]): number => {
  const n = Math.min(a.length, b.length);
  if (n < 3) return Number.NaN;
  const ma = mean(a.slice(0, n));
  const mb = mean(b.slice(0, n));
  let sab = 0; let saa = 0; let sbb = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - ma;
    const db = b[i] - mb;
    sab += da * db; saa += da * da; sbb += db * db;
  }
  return (saa === 0 || sbb === 0) ? Number.NaN : sab / Math.sqrt(saa * sbb);
};
/** the ladder's own match: THE ARMED WORLD in both arms, evolved genomes handed in */
const ladderMatch = (seed: number, ga: TacticalGenome, gb: TacticalGenome): Match => {
  const ta = teamInfo('A', seed * 2 + 1);
  const tb = teamInfo('B', seed * 2 + 2);
  const m = new Match({
    seed,
    teamA: { ...ta, genome: ga },
    teamB: { ...tb, genome: gb },
    ...a4MatchFlags(CORRIDOR_WORLD_VERSION),
    dlcDeliveryChoice: true, dlcStrikePlane: true,
    bkGroundCorridor: true, dxWindupAim: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, CORRIDOR_WORLD_VERSION);
  return m;
};
const runLadderArm = (arm: LadderArm, leagueSeed: number): LadderCell[] => {
  const opts = { evolvePassLeadSupport: arm === 'geneEvolvable' };
  const evoRng = new Rng(hashSeed(leagueSeed, 0xe0));
  const driftRng = new Rng(hashSeed(leagueSeed, 0xd7));
  const initRng = new Rng(leagueSeed);
  let pop: LadderTeam[] = Array.from({ length: LADDER_TEAMS }, (_, slot) => ({
    slot, genome: randomGenome(initRng),
  }));
  let shadow: number[] | null = arm === 'geneAbsent'
    ? new Array<number>(LADDER_TEAMS).fill(0) : null;
  const out: LadderCell[] = [];
  for (let gen = 1; gen <= LADDER_GENS; gen++) {
    const tGen = Date.now();
    const points = new Array<number>(LADDER_TEAMS).fill(0);
    const gd = new Array<number>(LADDER_TEAMS).fill(0);
    const acc = {
      goals: 0, shots: 0, passes: 0, passesCompleted: 0, interceptions: 0, longBalls: 0,
    };
    let matches = 0;
    let doorChecked = 0;
    let doorWrong = 0;
    let franchiseDirty = 0;
    let idx = 0;
    for (let a = 0; a < LADDER_TEAMS; a++) {
      for (let b = a + 1; b < LADDER_TEAMS; b++) {
        /** the per-match seed is DERIVED through the SHIPPED `hashSeed`, exactly as
         *  `League.createMatch` derives its fixture seeds from the league's own seed */
        const seed = hashSeed(leagueSeed, gen, idx, 0xdc);
        idx += 1;
        const m = ladderMatch(seed, pop[a].genome, pop[b].genome);
        doorChecked += 1;
        if ((m as unknown as { dxWindupAim: boolean }).dxWindupAim !== true
          || m.bkGroundCorridor !== true || m.dlcDeliveryChoice !== true
          || m.dlcStrikePlane !== true
          || corridorArmedVersion(m) !== CORRIDOR_WORLD_VERSION) doorWrong += 1;
        for (const side of [0, 1] as const) {
          const fr = m.teams[side].info.genome as TacticalGenome;
          if (fr.dvExposureWeight !== undefined) franchiseDirty += 1;
          if (arm === 'geneAbsent' && fr.passLeadSupport !== undefined) franchiseDirty += 1;
        }
        while (!m.finished) m.step(DT);
        const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
        matches += 1;
        acc.goals += st[0].goals + st[1].goals;
        acc.shots += st[0].shots + st[1].shots;
        acc.passes += st[0].passes + st[1].passes;
        acc.passesCompleted += st[0].passesCompleted + st[1].passesCompleted;
        acc.interceptions += st[0].interceptions + st[1].interceptions;
        acc.longBalls += st[0].longBalls + st[1].longBalls;
        const ga = st[0].goals;
        const gb = st[1].goals;
        gd[a] += ga - gb; gd[b] += gb - ga;
        if (ga > gb) points[a] += 3; else if (gb > ga) points[b] += 3;
        else { points[a] += 1; points[b] += 1; }
      }
    }
    const fitness = pop.map((t) => points[t.slot] * 100 + gd[t.slot]);
    const vals = pop.map((t) => t.genome.passLeadSupport ?? 0);
    out.push({
      arm, leagueSeed, generation: gen, matches,
      goals: acc.goals, shots: acc.shots, passes: acc.passes,
      passesCompleted: acc.passesCompleted, interceptions: acc.interceptions,
      longBalls: acc.longBalls,
      geneMean: round(mean(vals), 8), geneSd: round(sd(vals), 8),
      geneMax: round(Math.max(0, ...vals), 8),
      genePresentShare: round(pop.filter((t) => t.genome.passLeadSupport !== undefined).length
        / LADDER_TEAMS, 6),
      geneAboveZeroShare: round(vals.filter((v) => v > 0).length / LADDER_TEAMS, 6),
      driftMean: shadow === null ? null : round(mean(shadow), 8),
      driftSd: shadow === null ? null : round(sd(shadow), 8),
      fitnessGeneCorrelation: round(pearson(vals, fitness), 6),
      doorChecked, doorWrong, franchiseDirty,
      wallSeconds: round((Date.now() - tGen) / 1000, 3),
    });
    if (gen === LADDER_GENS) break;

    /* selection: evolveGroup's band law, mirrored (BK-T4 §10's anchors) */
    const order = [...pop].sort((x, y) => fitness[y.slot] - fitness[x.slot] || x.slot - y.slot);
    const pool = order.slice(0, 4);
    const pickParent = (exclude?: LadderTeam): LadderTeam => {
      const cands = pool.filter((f) => f !== exclude);
      const weights = cands.map((f) => 4 - pool.indexOf(f));
      const totalW = weights.reduce((x, y) => x + y, 0);
      let r = evoRng.next() * totalW;
      for (let i = 0; i < cands.length; i++) { r -= weights[i]; if (r <= 0) return cands[i]; }
      return cands[cands.length - 1];
    };
    const rebornFrom = order.length - LADDER_REBORN_N;
    const nextShadowBySlot = new Map<number, number>();
    const next: LadderTeam[] = [];
    order.forEach((f, rank) => {
      const sh = shadow === null ? null : shadow[f.slot];
      if (rank < LADDER_ELITE_N) {
        next.push({ slot: f.slot, genome: f.genome });
        if (sh !== null) nextShadowBySlot.set(f.slot, sh);
        return;
      }
      if (rank < rebornFrom) {
        next.push({
          slot: f.slot,
          genome: mutateGenome(f.genome, evoRng, { rate: MUT_RATE, scale: MUT_SCALE, ...opts }),
        });
        if (sh !== null) {
          nextShadowBySlot.set(f.slot, driftRng.chance(MUT_RATE)
            ? clamp01(sh + driftRng.gaussian() * MUT_SCALE) : sh);
        }
        return;
      }
      const pa = pickParent();
      const pb = pickParent(pa);
      next.push({
        slot: f.slot,
        genome: mutateGenome(
          crossoverGenomes(
            pa.genome, pb.genome, evoRng, false, false, false, false, false, false,
            arm === 'geneEvolvable',
          ),
          evoRng, { rate: REBORN_RATE, scale: REBORN_SCALE, ...opts },
        ),
      });
      if (shadow !== null) {
        const sa = shadow[pa.slot];
        const sb = shadow[pb.slot];
        const r = driftRng.next();
        const child = r < 0.4 ? sa : r < 0.8 ? sb : (sa + sb) / 2;
        nextShadowBySlot.set(f.slot, driftRng.chance(REBORN_RATE)
          ? clamp01(child + driftRng.gaussian() * REBORN_SCALE) : child);
      }
    });
    pop = next.sort((x, y) => x.slot - y.slot);
    shadow = shadow === null ? null : pop.map((t) => nextShadowBySlot.get(t.slot) ?? 0);
  }
  return out;
};
const tLadder0 = Date.now();
const ladderCells: LadderCell[] = [];
if (RUN_LADDER) {
  for (const arm of LADDER_ARMS) {
    for (const ls of LADDER_SEEDS) {
      ladderCells.push(...runLadderArm(arm, ls));
      banner(`  … ladder ${arm} league ${ls} done `
        + `(${round((Date.now() - tLadder0) / 1000, 1)} s)`);
    }
  }
}
const ladderWallSec = round((Date.now() - tLadder0) / 1000, 3);
const ladderFaces = RUN_LADDER ? LADDER_ARMS.flatMap((arm) => {
  const gens = Array.from({ length: LADDER_GENS }, (_, i) => i + 1);
  return gens.map((gen) => {
    const cs = ladderCells.filter((c) => c.arm === arm && c.generation === gen);
    const mt = sum(cs.map((c) => c.matches));
    return {
      arm, generation: gen, leagues: cs.length, matches: mt,
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt), 6),
      shotsPerMatch: round(ratio(sum(cs.map((c) => c.shots)), mt), 6),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)),
        sum(cs.map((c) => c.passes))), 6),
      interceptionsPerMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt), 6),
      longBallsPerMatch: round(ratio(sum(cs.map((c) => c.longBalls)), mt), 6),
      geneMean: round(mean(cs.map((c) => c.geneMean)), 8),
      geneMax: round(Math.max(0, ...cs.map((c) => c.geneMax)), 8),
      genePresentShare: round(mean(cs.map((c) => c.genePresentShare)), 6),
      geneAboveZeroShare: round(mean(cs.map((c) => c.geneAboveZeroShare)), 6),
      driftMean: cs.every((c) => c.driftMean === null) ? null
        : round(mean(cs.map((c) => c.driftMean ?? 0)), 8),
      fitnessGeneCorrelation: round(mean(cs.map((c) => c.fitnessGeneCorrelation)
        .filter(Number.isFinite)), 6),
      unit: 'per-generation league aggregate (goals/shots per match on the 240 s match clock; '
        + 'gene levels are league-mean passLeadSupport in [0,1])',
    };
  });
}) : [];
/** the goals slope, per arm: early(1–5) → late(LADDER_GENS−4 … LADDER_GENS), per league */
const ladderSlopes = RUN_LADDER ? LADDER_ARMS.map((arm) => {
  const perLeague = LADDER_SEEDS.map((ls) => {
    const cs = ladderCells.filter((c) => c.arm === arm && c.leagueSeed === ls);
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    const gpm = (xs: LadderCell[]): number =>
      ratio(sum(xs.map((c) => c.goals)), sum(xs.map((c) => c.matches)));
    return {
      leagueSeed: ls, early: round(gpm(early), 6), late: round(gpm(late), 6),
      delta: round(gpm(late) - gpm(early), 6),
    };
  });
  const ds = perLeague.map((p) => p.delta);
  return {
    arm, perLeague,
    goalsSlopeMean: round(mean(ds), 6),
    goalsSlopeSd: round(sd(ds), 6),
    unit: 'goals per match, late minus early (the house early(1–5)→late idiom)',
    geneMeanFinal: round(mean(ladderCells.filter((c) => c.arm === arm
      && c.generation === LADDER_GENS).map((c) => c.geneMean)), 8),
    driftMeanFinal: (() => {
      const xs = ladderCells.filter((c) => c.arm === arm && c.generation === LADDER_GENS)
        .map((c) => c.driftMean).filter((v): v is number => v !== null);
      return xs.length === 0 ? null : round(mean(xs), 8);
    })(),
  };
}) : [];

/* ========================================================================== */
/* §14 THE GATES (frozen; a red gate is REPORTED, never patched)               */
/* ========================================================================== */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
const pooled = Object.fromEntries(ARMS.map((a) => [a, {
  strikePerpBins: poolArm(a, (r) => r.strikePerpBins),
  strikeByClass: poolArm(a, (r) => r.strikeByClass),
  strikeBySide: poolArm(a, (r) => r.strikeBySide),
  gpLaneBins: poolArm(a, (r) => r.gpLaneBins),
  gpCaromLaneBins: poolArm(a, (r) => r.gpCaromLaneBins),
  altDispBins: poolArm(a, (r) => r.altDispBins),
  altCarriedBins: poolArm(a, (r) => r.altCarriedBins),
  leadBins: poolArm(a, (r) => r.leadBins),
  gpJoint: poolArm2(a, (r) => r.gpJoint),
  gpJointWindup: poolArm2(a, (r) => r.gpJointWindup),
  gpCaromJoint: poolArm2(a, (r) => r.gpCaromJoint),
  gpCaromJointWindup: poolArm2(a, (r) => r.gpCaromJointWindup),
}])) as unknown as Record<Arm, Record<string, number[] | number[][]>>;
const tot = (a: Arm, pick: (r: Row) => number): number => sum(cells.map((c) => pick(c.rows[a])));
const totals = Object.fromEntries(ARMS.map((a) => [a, {
  strikes: tot(a, (r) => r.strikes),
  strikesUnattributed: tot(a, (r) => r.strikesUnattributed),
  ledStrikesApplied: tot(a, (r) => r.ledStrikesApplied),
  gpMeasured: tot(a, (r) => r.gpMeasured),
  gpCaromed: tot(a, (r) => r.gpCaromed),
  gpFromWindup: tot(a, (r) => r.gpFromWindup),
  gpFromRelease: tot(a, (r) => r.gpFromRelease),
  deliveries: tot(a, (r) => r.deliveries),
  groundLaunches: tot(a, (r) => r.groundLaunches),
  loftedLaunches: tot(a, (r) => r.loftedLaunches),
  priceEvals: tot(a, (r) => r.priceEvals),
  priceEvalNonZero: tot(a, (r) => r.priceEvalNonZero),
  altDecisions: tot(a, (r) => r.altDecisions),
  altDisplaced: tot(a, (r) => r.altDisplaced),
  altCarried: tot(a, (r) => r.altCarried),
  altCarriedSumMetres: tot(a, (r) => r.altCarriedSumMetres),
  altAimFieldDisplaced: tot(a, (r) => r.altAimFieldDisplaced),
  altSupport: tot(a, (r) => r.altSupport),
  altSupportDisplaced: tot(a, (r) => r.altSupportDisplaced),
  depCaptures: tot(a, (r) => r.depCaptures),
  depCarriedOk: tot(a, (r) => r.depCarriedOk),
  depNullOk: tot(a, (r) => r.depNullOk),
  depMismatch: tot(a, (r) => r.depMismatch),
  depResolves: tot(a, (r) => r.depResolves),
  depResolveOk: tot(a, (r) => r.depResolveOk),
  depResolveMismatch: tot(a, (r) => r.depResolveMismatch),
  passStrikes: tot(a, (r) => r.passStrikes),
  passStrikesToSupport: tot(a, (r) => r.passStrikesToSupport),
  ledHandled: tot(a, (r) => r.ledHandled),
  ledNonZero: tot(a, (r) => r.ledNonZero),
  ledNonZeroToSupport: tot(a, (r) => r.ledNonZeroToSupport),
  leadSumMetres: tot(a, (r) => r.leadSumMetres),
  leadMaxMetres: Math.max(...cells.map((c) => c.rows[a].leadMaxMetres)),
  interceptions: tot(a, (r) => r.interceptions),
  tackles: tot(a, (r) => r.tackles),
  possessionFlips: tot(a, (r) => r.possessionFlips),
  wallSeconds: round(tot(a, (r) => r.wallMs) / 1000, 3),
}])) as unknown as Record<Arm, Record<string, number>>;

const gates: Record<string, boolean> = {
  /** every walked match reads back as world 11 with ITS OWN arm's flag state, plus the receipts */
  gWorld: cells.every((c) => ARMS.every((a) => c.rows[a].worldOk))
    && ARMS.every((a) => (receiptFacts[a].armedVersion as number) === CORRIDOR_WORLD_VERSION)
    && ARMS.every((a) => receiptFacts[a].bkGroundCorridor === true)
    && ARMS.every((a) => receiptFacts[a].dxWindupAim === isPricedArm(a))
    && ARMS.every((a) => receiptFacts[a].ptpPassLead !== true)
    && ARMS.every((a) => receiptFacts[a].ledgerZero === true)
    && dlcAxisIdentical,
  /**
   * ⭐⭐ INSIDE EACH PAIR THE ARMS DIFFER IN EXACTLY ONE CONSTRUCTION FLAG, compared as objects
   * over `a4MatchFlags(11)`'s key set plus the three doors this exam names.
   */
  gArmsIsolated: flagDiffScored.length === 1 && flagDiffScored[0] === 'dxWindupAim',
  /** the shared-seed contract: both arms of a pair walked exactly the same seed list, paired */
  gSharedSeeds: cells.length === SCORED_SEEDS.length
    && cells.every((c, i) => c.scoredSeed === SCORED_SEEDS[i])
    && cells.every((c) => ARMS.every((a) => c.rows[a].matches === 1)),
  /** the anchored extraction + the enumerated needle occurrences */
  gAnchoredConstants: ANCHORS_OK,
  /** ⭐⭐ the seam map re-asserted at battery time: the GC fork/pricer/hazard, the TWO DLC forks,
   *  the PRECEDENCE guard, and all three doors ABSENT from `a4World.ts` */
  gSeamSitesPinned: SEAM_OK,
  /** ⭐ the walk-side predicates are fixture-backed (canon, #334 item 2) */
  gWalkFixtures: FIXTURES_OK && FIXTURES.length >= 25,
  /** ⭐ THE WALK'S STRIKE COUNT AGREES WITH THE ENGINE'S OWN LEDGER, match by match, every arm */
  gStrikeLedgerAgrees: cells.every((c) => ARMS.every(
    (a) => c.rows[a].strikes + c.rows[a].strikesUnattributed === c.rows[a].ledStrikesApplied,
  )),
  /** the attribution is not silently lossy: each arm names ≥ 99 % of ledgered strikes */
  gStrikeAttributionComplete: ARMS.every(
    (a) => totals[a].ledStrikesApplied > 0
      && totals[a].strikes / totals[a].ledStrikesApplied >= 0.99,
  ),
  /** the joint tables PARTITION their own population, per arm; the alt census partitions too */
  gJointPartition: ARMS.every((a) => sum2(pooled[a].gpJoint as number[][]) === totals[a].gpMeasured
    && sum2(pooled[a].gpCaromJoint as number[][]) === totals[a].gpCaromed
    && sum2(pooled[a].gpJointWindup as number[][]) === totals[a].gpFromWindup
    && sum(pooled[a].gpLaneBins as number[]) === totals[a].gpMeasured
    && totals[a].gpFromWindup + totals[a].gpFromRelease === totals[a].gpMeasured
    && totals[a].groundLaunches + totals[a].loftedLaunches === totals[a].deliveries
    && totals[a].altDecisions === totals[a].gpFromWindup
    && sum(pooled[a].altDispBins as number[]) === totals[a].altDisplaced
    && sum(pooled[a].altCarriedBins as number[]) === totals[a].altCarried
    && totals[a].altCarried <= totals[a].altDisplaced
    && totals[a].altAimFieldDisplaced <= totals[a].altDisplaced
    && totals[a].altDisplaced <= totals[a].altCarried + totals[a].altAimFieldDisplaced
    && totals[a].altDisplaced <= totals[a].altDecisions
    && totals[a].altSupportDisplaced <= totals[a].altDisplaced
    && totals[a].altSupport <= totals[a].altDecisions
    && sum(pooled[a].leadBins as number[]) === totals[a].ledNonZero
    && totals[a].ledNonZero <= totals[a].ledHandled
    && totals[a].ledHandled <= totals[a].passStrikes
    && totals[a].ledNonZeroToSupport <= totals[a].ledNonZero
    && totals[a].passStrikesToSupport <= totals[a].passStrikes),
  /**
   * ⭐⭐ THE PRICE FIRES — the corrected `gPriceFires` form (#334 item 4): in EVERY PRICED arm the
   * shipped predicate is EVALUATED on every priced ground line and it is NON-ZERO somewhere. It
   * gates LIVENESS, never a direction, so it cannot "fail by succeeding".
   */
  gPriceFires: ARMS.every(
    (a) => totals[a].priceEvals > 0 && totals[a].priceEvalNonZero > 0,
  ),
  /** ⭐ EACH PAIR GENUINELY DIVERGES — an identical pair would mean the flag never reached the
   *  pricer. NOT a direction, only a bite. */
  gArmsDiverge: PAIRS.every((pr) => cells.some((c) => c.rows[pr[0]].gpMeasured !== c.rows[pr[1]].gpMeasured
    || c.rows[pr[0]].strikes !== c.rows[pr[1]].strikes
    || c.rows[pr[0]].goals !== c.rows[pr[1]].goals)),
  /** ⭐ the QUOTED artifacts are READ from hashed bytes and match the §P-frozen literals.
   *  BK-C2's and GC-T1's numbers are DIFFERENT-BATTERY CONTEXT here; this gate proves the
   *  quotation is faithful, never that this exam reproduces them. */
  gQuotationsFaithful: BKC2_QUOTED_OK && BKC2_SHA.length === 64 && BKC2_FACES.length > 0
    && GCT2_QUOTED_OK && GCT2_DELTAS_QUOTED_OK,
  /**
   * ⭐⭐ G-N — the power rule's own gate (§N). It can fail: a drifted sizing source, an
   * accessor that no longer reproduces GC-T1B's published Δ, a robust point outside #346's
   * quoted interval, or a battery that ran at an n other than the frozen one all red it.
   */
  /**
   * ⭐⭐ gN — TWO ARMS, NO BYPASS (#348 §COMMANDER CORRECTIONS item 2's order: "Future power
   * gates close the escape — the override mode gets its own gate arm, never a bypass").
   *   · FROZEN arm   (no override env at all): the battery MUST have run at exactly N_FROZEN.
   *   · OVERRIDE arm (mode=smoke / DXT1_N / DXT1_LADDER set): the override must be DECLARED,
   *     the walked n must equal the n the override itself declared, and the artifact must sit
   *     OFF every canonical path. ⛔ Setting an env var does not make the gate pass; it moves
   *     the gate onto a DIFFERENT, equally falsifiable set of conjuncts, and the artifact it
   *     green-lights can never be the artifact of record.
   */
  gN: G_N_DERIVATION_OK && (IS_PREFLIGHT
    ? (PREFLIGHT_REASONS.length > 0 && cells.length === N_SEEDS
      && SCORED_SEEDS.length === N_SEEDS && !isCanonical(OUT_BASE))
    : cells.length === N_FROZEN),
  /**
   * ⭐ THE DOSE-PLACEMENT CONJUNCT (canon, VERBATIM: "dose NEVER in info.genome; truth-dosing
   * writes census values through the shipped writer" — HOME ruling #270.2; ratified form at #334
   * item 1). BOTH genes live on MATCH-LOCAL views only: the franchise `info.genome` carries
   * NEITHER `dvExposureWeight` NOR `passLeadSupport`, on every walked match, every construction
   * receipt and every composition-proof world.
   */
  gGenomeClean: cells.every((c) => ARMS.every((a) => c.rows[a].genomeClean))
    && ARMS.every((a) => receiptFacts[a].infoGenomeExposureA === null
      && receiptFacts[a].infoGenomeExposureB === null
      && receiptFacts[a].infoGenomeLeadA === null && receiptFacts[a].infoGenomeLeadB === null)
    && compRows.every((r) => r.franchiseClean),
  /**
   * ⭐⭐ THE geneOk VALUE CHECK — GC-T1 §COMMANDER CORRECTIONS item 2's order (the #345 rider).
   * BOTH genes at their pinned VALUES, on BOTH match-local views of BOTH teams, on every walked
   * match; and on the construction receipts the DLC gene is read back through the SHIPPED
   * `passLeadSupportWeight` map rather than off the object this probe wrote.
   */
  gGeneValuePinned: cells.every((c) => ARMS.every((a) => c.rows[a].geneOk))
    && ARMS.every((a) => receiptFacts[a].exposureWeightA === CORRIDOR_WORLD_WEIGHT
      && receiptFacts[a].exposureWeightB === CORRIDOR_WORLD_WEIGHT
      && receiptFacts[a].exposureWeightBaseA === CORRIDOR_WORLD_WEIGHT
      && receiptFacts[a].leadGeneA === DLC_GENE_VALUE
      && receiptFacts[a].leadGeneB === DLC_GENE_VALUE
      && receiptFacts[a].leadGeneBaseA === DLC_GENE_VALUE
      && receiptFacts[a].leadWeightReadBackA === DLC_GENE_VALUE
      && receiptFacts[a].leadWeightReadBackB === DLC_GENE_VALUE),
  /** ⭐⭐ THE COMPOSITION PROOF — canon's own form, run on SCRATCH seeds BEFORE any scoring */
  gCompositionProof: COMPOSITION_OK && compRows.length === COMP_SEEDS.length * 7,
  /** ⭐ THE ALTERNATIVES ARE NON-VACUOUS: in EVERY arm the machinery displaces a chosen aim
   *  somewhere, so no arm silently walks a world where the alternatives never formed. */
  gAlternativesLive: ARMS.every((a) => totals[a].passStrikes > 0 && totals[a].ledNonZero > 0
    && totals[a].passStrikesToSupport > 0 && totals[a].altDecisions > 0),
  /** non-vacuity: every quantified face has a non-empty domain, in EVERY arm */
  gNonVacuous: ARMS.every((a) => totals[a].strikes > 0 && totals[a].gpMeasured > 0
    && totals[a].gpCaromed > 0 && totals[a].interceptions > 0 && totals[a].tackles > 0
    && totals[a].possessionFlips > 0 && totals[a].loftedLaunches > 0
    && sum(pooled[a].strikePerpBins as number[]) > 0)
    && cells.length === SCORED_SEEDS.length,
  gSrcUntouched: srcDiff === '' && srcStatus === '',
  /** BOOKED = WALKED, gated from the CELLS' OWN distinct-seed sets (#335 item 4) */
  gSeedsBookedEqualWalked: scoredSeedsWalked.length === SCORED_SEEDS.length
    && scoredSeedsWalked.every((sd) => SCORED_SEEDS.includes(sd))
    && cells.length * ARMS.length + ARMS.length === walksBooked
    && (MODE === 'smoke' || [...scoredSeedsWalked, RECEIPT_SEED]
      .every((sd) => sd >= BLOCK_BASE && sd <= BLOCK_BASE + 999))
    && compRows.every((r) => r.seed >= SCRATCH_BASE)
    && compWalks === COMP_SEEDS.length * 7 * 2
    && (!RUN_LADDER || MODE === 'smoke'
      || ladderCells.every((c) => c.leagueSeed >= BLOCK_BASE && c.leagueSeed <= BLOCK_BASE + 999)),
  /**
   * ⭐⭐ THE DEPOSIT-SIDE BEHAVIOURAL PIN, ON THE BATTERY ITSELF (#353's rider, §P). Every
   * captured wind-up decision in every walked match, both arms: `pendingPassWindup.aimLead`
   * EQUALS the elected candidate's own displacement when the door is armed and an eligible
   * deposit exists, and is EXACTLY `null` otherwise; the release hands `performPass` that same
   * value. ZERO mismatches anywhere, NON-VACUOUS in the armed arm and structurally EMPTY in the
   * shut arm. ⛔ This closes the link DX-T0 held with a SOURCE-TEXT pin alone.
   */
  gDepositCarriesElection: ARMS.every((a) => totals[a].depMismatch === 0
    && totals[a].depResolveMismatch === 0
    && totals[a].depCaptures === totals[a].depCarriedOk + totals[a].depNullOk
    && totals[a].depResolves === totals[a].depResolveOk
    && totals[a].depCaptures > 0 && totals[a].depResolves > 0)
    && totals.shut.depCarriedOk === 0
    && compRows.every((r) => r.depMismatch === 0 && r.depResolveMismatch === 0),
  /**
   * ⛔ NOTE, DECLARED AT §P: the NON-VACUITY of the carried case (`depCarriedOk > 0`) is gated
   * ONLY on the SCRATCH composition proof (`DX-DEPOSIT-PIN`), NEVER on the battery. Gating the
   * battery on "the door carried something" would make H-DX.1(a) unfailable-in-artifact — a
   * gate must not read the result it is meant to leave free.
   */
  /**
   * ⭐ THE LADDER'S OWN CLEANLINESS (the dispatch brief's "match-local dose idiom +
   * info.genome-cleanliness conjunct"): every ladder match is the ARMED world, the franchise
   * `info.genome` NEVER carries `dvExposureWeight`, and in the CONTROL arm it never carries
   * `passLeadSupport` either (the gene must ENTER only through the shipped opt-in).
   * ⛔ NO LADDER NUMBER IS GATED AS FOOTBALL — this gate is about the ecology's hygiene.
   */
  gLadderClean: !RUN_LADDER || (ladderCells.length === LADDER_ARMS.length * LADDER_SEEDS.length
    * LADDER_GENS
    && ladderCells.every((c) => c.doorWrong === 0 && c.franchiseDirty === 0
      && c.doorChecked === c.matches && c.matches > 0)
    && ladderCells.filter((c) => c.arm === 'geneAbsent')
      .every((c) => c.genePresentShare === 0 && c.geneMean === 0)),
  gFaces: false, // set below, after the artifact is on disk
};

/* ========================================================================== */
/* §15 THE ARTIFACT                                                            */
/* ========================================================================== */
const BODY_SCHEMA = ['stage', 'definitions', 'world', 'compositionProof', 'hypothesis', 'seeds',
  'sizing', 'sensitivity', 'stats', 'strikeCensus', 'staleMap', 'reAimSignature',
  'alternativesUsage', 'depositPin', 'seasonLadder', 'perf', 'quotedContext', 'walkFixtures',
  'perSeedCells', 'faces', 'deltas', 'gates'] as const;

const binTable = (arm: Arm, key: string, width: number): Record<string, unknown> => ({
  bins: pooled[arm][key],
  binWidth: width,
  medianFromBinsLowerEdge: round(medianFromBins(pooled[arm][key] as number[], width), 6),
  total: sum(pooled[arm][key] as number[]),
});

const strikeCensus = {
  note: 'BK-C2 §R1\'s instruments, re-derived at this exam\'s grain, per arm.',
  quickExchangeWindowTicks: QUICK_N_TICKS,
  byArm: Object.fromEntries(ARMS.map((a) => [a, {
    attributedStrikes: totals[a].strikes,
    ledgerAppliedStrikes: totals[a].ledStrikesApplied,
    unattributed: totals[a].strikesUnattributed,
    byClassCooldownStunned: pooled[a].strikeByClass,
    bySideTeammateOpponentNoFlight: pooled[a].strikeBySide,
    perpDistanceFromLineAtKick: binTable(a, 'strikePerpBins', PERP_BIN_M),
    onGroundFlight: tot(a, (r) => r.strikeOnGroundFlight),
    onLoftedFlight: tot(a, (r) => r.strikeOnLoftedFlight),
  }])),
};
const staleMap = {
  note: '⭐ the chooser\'s OWN lane read BESIDE the SHIPPED `groundShellHazard`, both taken at '
    + 'the moment of choice, per arm. In a PRICED arm the hazard column is what the price '
    + 'actually charged; in a SHUT arm it is what the chooser was NOT charged for.',
  openLaneThreshold: OPEN_LANE_THRESHOLD,
  openLaneProvenance: `the ground-pass chooser's OWN gate line, anchored at ${BRAIN_PATH}:`
    + `${LANE_GATE_LINE} — \`${LANE_GATE_NEEDLE}\`. ⚠ BK-C2 §CORR item 5 rides: at that site `
    + 'the literal lives in a contested-FORWARD-ball risk gate that never fires on sideways or '
    + 'backward passes, so 0.4 is BK-C2\'s chosen EXTRACTION of the chooser\'s literal, not a '
    + 'line the chooser draws over every pass. Carried, not re-argued.',
  hazardProvenance: 'the SHIPPED predicate itself — `groundShellHazard` imported from '
    + `${SEAT_PATH} and CALLED with the pricer's own body set (\`[team.players, opp.players]\`), `
    + 'kicker gid and receiver gid. The observer read and the priced read are the SAME function.',
  shellProvenance: `the contact law's own shell, anchored at ${MATCH_PATH}:${SHELL_LINE} — `
    + `\`${SHELL_NEEDLE}\` inside \`bkCollectBodyStrikes\`.`,
  choiceTick: 'the ARM-TIME seat (`pendingPassWindup`) wherever the shipped wind-up formed one; '
    + 'the RELEASE tick for the one-touch bypass that releases synchronously. The split is '
    + 'published per arm and the joint table is republished on the wind-up-only subset.',
  byArm: Object.fromEntries(ARMS.map((a) => [a, {
    measuredGroundPasses: totals[a].gpMeasured,
    fromWindupSeat: totals[a].gpFromWindup,
    fromReleaseTick: totals[a].gpFromRelease,
    caromedGroundPasses: totals[a].gpCaromed,
    jointLaneOpenByShellBlocked: pooled[a].gpJoint,
    jointWindupOnly: pooled[a].gpJointWindup,
    caromJointLaneOpenByShellBlocked: pooled[a].gpCaromJoint,
    caromJointWindupOnly: pooled[a].gpCaromJointWindup,
    jointRowsAre: '[laneOpen, laneContested] x [shellBlocked, shellClear]',
    laneOpennessAtChoice: binTable(a, 'gpLaneBins', UNIT_BIN),
    laneOpennessAtChoiceCaromedOnly: binTable(a, 'gpCaromLaneBins', UNIT_BIN),
    priceEvaluations: totals[a].priceEvals,
    priceEvaluationsNonZero: totals[a].priceEvalNonZero,
    deliveries: totals[a].deliveries,
    groundLaunches: totals[a].groundLaunches,
    loftedLaunches: totals[a].loftedLaunches,
  }])),
};
/**
 * ⭐⭐ THE RE-AIM SIGNATURE — REPORTED, NEVER GATED. The question #345 item 4 asked in words:
 * does the blocked mass MOVE to the clear cells with the deliveries HOLDING, or does it VANISH?
 * The cells below are the SAME joint tables as `staleMap`, re-published side by side with their
 * arm-to-arm differences and with GC-T1's OWN published cells beside them as
 * ⚠ DIFFERENT-BATTERY CONTEXT (different world — no DLC pair — and a different seed block).
 */
const reAimSignature = {
  note: '⭐ the joint cells by arm, their within-pair differences, and the delivery volume that '
    + 'says whether the declined lines came back. REPORTED, NEVER GATED.',
  rowsAre: '[laneOpen, laneContested] x [shellBlocked, shellClear]',
  byPair: PAIRS.map((pr) => {
    const js = pooled[pr[0]].gpJoint as number[][];
    const ja = pooled[pr[1]].gpJoint as number[][];
    return {
      pair: `${pr[0]}→${pr[1]}`,
      shutJoint: js, armedJoint: ja,
      cellDeltas: [[ja[0][0] - js[0][0], ja[0][1] - js[0][1]],
        [ja[1][0] - js[1][0], ja[1][1] - js[1][1]]],
      blockedColumnDelta: (ja[0][0] + ja[1][0]) - (js[0][0] + js[1][0]),
      clearColumnDelta: (ja[0][1] + ja[1][1]) - (js[0][1] + js[1][1]),
      measuredGroundPassDelta: totals[pr[1]].gpMeasured - totals[pr[0]].gpMeasured,
      deliveriesDelta: totals[pr[1]].deliveries - totals[pr[0]].deliveries,
      readingNote: '⚠ these are DIFFERENCES OF THE CELLS ABOVE, not separate faces. A RE-AIM '
        + 'signature is blocked mass falling while the CLEAR column RISES and the delivery '
        + 'volume holds; a SUPPRESSION signature is blocked mass falling with the clear column '
        + 'flat and the deliveries falling too (GC-T1 §R2\'s reading).',
    };
  }),
  gcT2Context: {
    warning: '⚠⚠ DIFFERENT BATTERY, DIFFERENT TREATMENT, DIFFERENT SEEDS: GC-T2 walked block '
      + '12,526,000–999 and its ARM AXIS was `bkGroundCorridor`, which is TRUE IN BOTH OF THIS '
      + 'EXAM\'S ARMS. Its cells are quoted so the signature can be READ BESIDE its predecessor. '
      + 'NO gate compares them and NO Δ is computed across the two batteries.',
    source: { file: GCT2_PATH, sha256: GCT2_SHA,
      note: 'the byte hash of the file, computed here over the bytes read — and the artifact\'s '
        + 'own `hashedBodySha256` is quoted separately below, by COPYING that field (the #345 '
        + 'item 1 standing order).' },
    gcT2HashedBodySha256: GCT2_HASHED_BODY,
    jointFrozen: GCT2_JOINT_FROZEN,
    facesFrozen: GCT2_FROZEN,
    gcT2Measured: {
      shut: GCT2.staleMap.byArm.shut.measuredGroundPasses,
      armed: GCT2.staleMap.byArm.armed.measuredGroundPasses,
      shutDeliveries: GCT2.staleMap.byArm.shut.deliveries,
      armedDeliveries: GCT2.staleMap.byArm.armed.deliveries,
    },
    gcT2Reading: '⭐ GC-T2 §R3\'s OWN reading of its own cells, quoted: blocked column −2029, '
      + 'clear column +174, deliveries resolved DOWN ⇒ "SUPPRESSION with a small re-aim '
      + 'component". THIS exam re-applies GC-T1B\'s SAME reading rule to ITS OWN cells; the two '
      + 'readings are separate within-battery statements.',
  },
};
const alternativesUsage = {
  note: '⭐⭐ THE USAGE SHARE — which candidate won the argmax, per arm. REPORTED, NEVER GATED.',
  definition: 'a WIND-UP-SEAT measured ground pass is DISPLACED when the ENGINE\'S OWN recorded '
    + 'aim differs from the named target\'s position at the choice tick. The to-feet candidate\'s '
    + 'aim IS `mate.pos`, so any displacement means a led delivery or a sampled grid member won.',
  declaredLimit: '⛔ NOT A DECLINE RATE. DLC-T1s (#243 item 1) RETRACTED its first delivered-rate '
    + 'statistic because it "scored two OPPOSITE facts identically: the plane offered another '
    + 'kick and the decision declined it … and the plane had nothing to offer (a fully '
    + 'degenerate grid — the treatment was impossible at that decision)", and the symptom that '
    + 'proved it mattered was that the statistic was NOT MONOTONE IN TREATMENT. Its corrected '
    + 'form conditions on GRID LIVENESS per decision; that conditioning needs the seat\'s own '
    + 'remembered motion, i.e. a `match.perceivedSnapshot` pull that RECONSTRUCTS the body\'s '
    + 'percept memory in place and could perturb the walk. This exam therefore publishes a '
    + 'USAGE share only, plus the SUPPORT-SCOPED form (DLC-T1 #238 item 2\'s own idiom) which '
    + 'removes the largest structural zero class.',
  byArm: Object.fromEntries(ARMS.map((a) => [a, {
    windupGroundDecisions: totals[a].altDecisions,
    displaced: totals[a].altDisplaced,
    supportScopedDecisions: totals[a].altSupport,
    supportScopedDisplaced: totals[a].altSupportDisplaced,
    aimDisplacementMetres: binTable(a, 'altDispBins', DISP_BIN_M),
    carriedElectionDecisions: totals[a].altCarried,
    carriedLeadMetres: binTable(a, 'altCarriedBins', DISP_BIN_M),
    aimFieldDisplacedDecisions: totals[a].altAimFieldDisplaced,
    passStrikes: totals[a].passStrikes,
    passStrikesToSupportTarget: totals[a].passStrikesToSupport,
    ledStrikesHandled: totals[a].ledHandled,
    ledStrikesNonZero: totals[a].ledNonZero,
    ledStrikesNonZeroToSupportTarget: totals[a].ledNonZeroToSupport,
    deliveredLeadMetres: binTable(a, 'leadBins', DISP_BIN_M),
    deliveredLeadMaxMetres: round(totals[a].leadMaxMetres, 6),
  }])),
};
const perf = {
  note: '⭐ THE PERF FACE — the armed cost, GC-T1 §P7\'s method inherited.',
  method: 'each walk is timed end to end (`Date.now()` around the walk); the two arms of a pair '
    + 'are walked BACK TO BACK on the same seed (shut first, armed second), so scheduler/thermal '
    + 'drift is spread across both arms; the face is Σ wall seconds ÷ walks. ⚠ THE TIMED REGION '
    + 'IS THE WALK, not the engine alone — the observer\'s `laneOpenness` and `groundShellHazard` '
    + 'reads sit inside it in EVERY arm, so the DIFFERENCE is the priced chooser\'s cost and the '
    + 'LEVEL is not the game\'s frame cost. A MACHINE reading on one machine, never portable.',
  byArm: Object.fromEntries(ARMS.map((a) => [a, {
    wallSecondsTotal: totals[a].wallSeconds,
    walks: cells.length,
    wallSecondsPerMatch: round(ratio(totals[a].wallSeconds, cells.length), 6),
  }])),
  batteryWallSeconds: round(sum(ARMS.map((a) => totals[a].wallSeconds)), 3),
};
const quotedContext = {
  note: '⚠⚠ EVERY NUMBER HERE IS ANOTHER BATTERY\'S, QUOTED AS CONTEXT. This exam\'s shut arm '
    + 'carries the DLC pair, so it is NOT BK-C2\'s `w11` world and NOT GC-T1\'s shut arm. '
    + 'GC-T1 §P2b\'s instrument-fidelity GATE is therefore deliberately NOT inherited — there '
    + 'is no `gInstrumentReDerivesBkC2` in this exam. What IS gated (`gQuotationsFaithful`) is '
    + 'that the quoted numbers are the source artifacts\' OWN fields, read from hashed bytes.',
  bkC2: {
    source: { file: BKC2_PATH, sha256: BKC2_SHA },
    frozenLiterals: BKC2_FROZEN,
    frozenLiteralsMatchArtifact: BKC2_QUOTED_OK,
  },
  gcT2: {
    source: { file: GCT2_PATH, sha256: GCT2_SHA },
    hashedBodySha256: GCT2_HASHED_BODY,
    role: 'THE SIZING SOURCE **and** the re-aim signature\'s different-battery context — every '
      + '§N input is a FIELD of this artifact, read from bytes hashed first',
    frozenLiterals: GCT2_FROZEN,
    frozenJoint: GCT2_JOINT_FROZEN,
    frozenScoredDeltas: GCT2_FROZEN_DELTAS,
    frozenLiteralsMatchArtifact: GCT2_QUOTED_OK,
    frozenScoredDeltasMatchArtifact: GCT2_DELTAS_QUOTED_OK,
  },
  /**
   * ⭐⭐ GC-T1B IS NOT MERELY QUOTED — IT IS THE SIZING SOURCE (§N). Its byte hash and its OWN
   * `hashedBodySha256` FIELD are published here (#345 item 1's standing order: provenance
   * hashes are COPIED from the artifact's own fields, never from a terminal scroll-back).
   * ⚠ It is still a DIFFERENT BATTERY on a different block: no Δ is computed across the two,
   * and nothing of GC-T1B's is re-published here as if it were this exam's reading.
   */
};
const compositionProof = {
  note: '⭐⭐ CANON, VERBATIM: "composition proof — any world arming a new seam alongside the '
    + 'CB/L3 stack proves the doors/lifecycle at THAT composition first." HOME: BU contract '
    + 'M-BU.2 (ruling #285). DLC × the world-11 stack was UNMEASURED, so these receipts ran on '
    + 'OUT-OF-BAND SCRATCH seeds BEFORE any battery seed was read. ⚠ ARMING RECEIPTS, NEVER '
    + 'FOOTBALL FINDINGS (canon: receipts ≠ effect sizes).',
  scratchSeeds: COMP_SEEDS,
  worlds: Object.fromEntries((Object.keys(COMP_WORLDS) as CompWorld[])
    .map((w) => [w, { doors: COMP_WORLDS[w].doors, passLeadSupport: COMP_WORLDS[w].gene }])),
  precedenceLawQuoted: 'src/sim/Match.ts, on `dlcStrikePlane`: "⭐ Its relation to the banked '
    + 'doors is FROZEN: `ptpPassLead` and `dlcDeliveryChoice` keep PRECEDENCE — no grid forms '
    + 'while either seat exists, so armed-both is the banked door armed alone, byte for byte '
    + '(gated, not promised)." The guard itself is pinned VERBATIM at '
    + `${BRAIN_PATH}:${SP_PRECEDENCE_HITS[0]?.line ?? -1} — \`${SP_PRECEDENCE_NEEDLE.trim()}\`.`,
  relations: COMP_RELATIONS,
  allHold: COMPOSITION_OK,
  rows: compRows,
  walks: compWalks,
};
const hypothesis = {
  id: 'H-DX.1',
  frozenAt: 'docs/world-model/DX-T1-EXPRESSION-EXAM.md §P, at the FREEZE COMMIT, before a '
    + 'battery seed was read. The conjunct forms are ruling #353 item 4\'s; the gate '
    + 'CONSTRUCTIONS are stated there and are not re-cut after sight.',
  scoredPair: `${SCORED_PAIR[0]}→${SCORED_PAIR[1]}`,
  a: {
    rule: '⭐⭐ `altDisplacedShare` on WIND-UP flights LEAVES ZERO RESOLVEDLY in the ARMED arm: '
      + 'the paired Δ (armed − shut) 95 % interval ENTIRELY ABOVE ZERO **and** the ARMED arm\'s '
      + 'own 95 % interval ENTIRELY ABOVE ZERO. ⚠ The displacement is the UNION of the CARRIED '
      + 'election (`pendingPassWindup.aimLead`) and the LEGACY aim-field read, so in the shut '
      + 'arm the face is GC-T2\'s own face exactly.',
    face: A_KEY, detail: conjunctA, pass: H_DX_1.a,
  },
  b: {
    rule: 'the ARMED arm\'s `groundPassesPerMatch` point estimate sits AT OR ABOVE THIS EXAM\'S '
      + 'OWN SHUT arm\'s 95 % interval LOWER EDGE (GC-T1B §P4 / GC-T2 §P4\'s band construction — '
      + 'the band is DERIVED from this battery\'s own control arm, no taste constant). THE GC-T2 '
      + 'SUPPRESSION FACE, RE-ASKED WITH EXPRESSION POSSIBLE.',
    detail: conjunctB, pass: H_DX_1.b,
  },
  c: {
    rule: '⭐ THE STRIKE FACES DO NOT WORSEN: for each of `groundStrikesPerMatch`, '
      + '`teammateStrikesPerMatch` and `caromedGroundOnOpenLaneShare`, the PAIRED Δ (armed − '
      + 'shut) 95 % interval\'s UPPER EDGE lies AT OR BELOW the NON-WORSENING MARGIN = THIS '
      + 'exam\'s own SHUT arm\'s 95 % interval HALF-WIDTH for that face ((b)\'s band '
      + 'construction, mirrored onto the Δ scale — no taste constant). Each is REPORTED with '
      + 'its leave-one-out sensitivity (#346 item 1 / #348\'s standing orders).',
    faces: C_KEYS, conjuncts: conjunctC, pass: H_DX_1.c,
  },
  d: {
    rule: 'each lofted-family control\'s ARMED point estimate lies INSIDE THIS EXAM\'S OWN SHUT '
      + 'arm\'s 95 % interval (BK-T4 §P2 / GC-T2 §P5\'s control form)',
    faces: D_KEYS, conjuncts: conjunctD, pass: H_DX_1.d,
  },
  allConjunctsPass: H_DX_1_ALL,
  honestLimits: [
    '⚠⚠ THE CARRY MUST BE READ FROM `pendingPassWindup.aimLead`: the wind-up record\'s own '
    + '`aim` field is BYTE-UNTOUCHED by this door, so GC-T2\'s displacement instrument still '
    + 'reads zero in BOTH arms (published as `altAimFieldDisplacedShare`, and measured as the '
    + 'composition relation `O1-WINDUP-AIM-FIELD-UNMOVED`). DX-T0 §COMMANDER CORRECTIONS (#353) '
    + 'item 1: the dormant ledger has NO counter, and its step-boundary sampler was blind to '
    + 'exactly the carried case.',
    '⚠⚠ NO EXECUTION-ERROR MODEL EXISTS (contract §4 / DX-T0 §HONESTY 3): expression without '
    + 'error makes the body MORE precise than a human. A named door, not smuggled.',
    '⚠ THE AIM IS THE ARM-TIME ELECTION AND THE WORLD MOVES DURING THE WINDOW (DX-T0 §HONESTY '
    + '2); and "the struck point IS the elected point" is EXACT only where the incumbent '
    + 'strike-time correction is zero (DX-T0 §HONESTY 1). Both inherited, neither re-argued.',
    '⚠⚠ THE ORDERED ARMS ARM BOTH DLC DOORS, AND THE FROZEN PRECEDENCE LAW MAKES THE K = 9 GRID '
    + 'STRUCTURALLY INERT IN THEM (measured at `compositionProof.relations[G-PRECEDENCE.dx]`). '
    + 'The alternatives this verdict is about are the TWO-POINT CONTEST\'s led candidates.',
    '⚠ THE DOOR CANNOT EXPRESS AN ELECTION THE SYNCHRONOUS PATH WOULD NOT HAVE STRUCK (DX-T0 '
    + '§HONESTY 4): both guards are the shipped statement\'s own.',
    '⚠ THE DLC GENE IS PINNED AT 1 IN EVERY BATTERY ARM (DLC-T1\'s own `PTP_GENE_MAX`) and '
    + '`dvExposureWeight` at world 11\'s own 0.5. NO GENE LADDER IS WALKED IN THE BATTERY; the '
    + 'SEASON LADDER is a SEPARATE, REPORTED ecology and no conjunct reads it.',
    '⚠ THE USAGE SHARES ARE NOT DECLINE RATES (DLC-T1s\'s retraction rides — see '
    + '`alternativesUsage.declaredLimit`).',
    '⚠ THE CONTROLS CANNOT SEPARATE "NOT PRICED" FROM "NOT SUBSTITUTED INTO" (GC-T1 §P5, '
    + 'inherited through GC-T2 §P5).',
    '⚠ THE INTERCEPTION DECOMPOSITION IS TEMPORAL, NOT CAUSAL (BK-C2 §P.7\'s own warning).',
    '⚠ THE PERF FACE IS A MACHINE READING (see `perf.method`), not a portable cost.',
    '⚠ THE OPEN-LANE CUT IS BK-C2\'s EXTRACTION of the chooser\'s literal (BK-C2 §CORR item 5), '
    + 'carried here unchanged; the full lane histogram is stored so any other cut re-derives.',
    '⚠ THIS EXAM\'S SHUT ARM IS NOT GC-T2\'s SHUT ARM (different block, and GC-T2\'s arm axis is '
    + 'TRUE in both of these arms) and not BK-C2\'s `w11` world. Every quotation from either is '
    + 'labelled DIFFERENT-BATTERY CONTEXT and NO Δ is computed across batteries.',
    '⚠ THE SIZING ASSUMES GC-T2\'s PER-SEED CLUSTER VARIANCE UNDER A DIFFERENT TREATMENT — same '
    + 'composition, same estimator, same predicates, but a different arm axis and different '
    + 'seeds. Declared at §N; the realised half-widths are published against the ex-ante ones.',
  ],
};

const artifact: Record<string, unknown> = {
  stage: {
    id: 'DX-T1',
    title: 'THE EXPRESSION EXAM — the GC-T2 composition in BOTH arms, SHUT vs ARMED on '
      + '`dxWindupAim` ALONE; does the body express what the chooser elected, and does the '
      + 'ground game hold when it can',
    doc: 'docs/world-model/DX-T1-EXPRESSION-EXAM.md',
    contract: 'docs/world-model/DX-DELIVERY-EXECUTION-CONTRACT.md',
    seam: 'docs/world-model/DX-T0-WINDUP-AIM-SEAM.md',
    predecessor: 'docs/world-model/GC-T2-POWER-EXTENSION.md',
    predecessorOfPredecessor: 'docs/world-model/GC-T1B-ALTERNATIVES-ARM.md',
    dlcSeams: ['docs/world-model/DLC-T1-CHOICE-EXAM.md',
      'docs/world-model/DLC-T1S-STRIKE-EXAM.md'],
    census: 'docs/world-model/BK-C2-CAROM-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #353 item 4 (contract §3; the deposit-side behavioural pin '
      + 'is #353\'s rider, i.e. DX-T0 §COMMANDER CORRECTIONS item 2; the leave-one-out '
      + 'sensitivity face is #346 item 1\'s standing order; the closed gN env escape is '
      + '#348 §COMMANDER CORRECTIONS item 2\'s order)',
    kind: 'EXAM — a frozen hypothesis scored on virgin seeds; ZERO src behaviour change (every '
      + 'flag is armed IN-INSTRUMENT, as a construction flag on the probe\'s own Match)',
    userWordsOfRecord: [
      '对啊,肯定得修,包括高空球,弧线球,力度等, (#352 item 1 — THE MANDATE this arc serves)',
      '但是弹身体感觉很影响比赛 (#341 item 1)',
      '我发现传球经常会传到别人身上然后反弹回来 (#340 item 1)',
    ],
    xSrcZero: 'no file under `src/` is edited. The probe CALLS the shipped exports — '
      + '`groundShellHazard` (so the observer read and the priced read are the SAME function), '
      + '`laneOpenness`, `closestPointOnSegment`, `a4MatchFlags` / `armA4World`, '
      + '`passLeadSupportWeight` — and reads Match state and `bkContactLedger` per tick.',
    mode: MODE, generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/dx-t1-expression-exam.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/dx-t1-expression-exam.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: {
      [MATCH_PATH]: sha(MATCH_SRC), [BRAIN_PATH]: sha(BRAIN_SRC),
      [PERC_PATH]: sha(PERC_SRC), [CONST_PATH]: sha(CONST_SRC), [SEAT_PATH]: sha(SEAT_SRC),
    },
    anchoredSites: [
      { what: 'the strike shell', file: MATCH_PATH, needle: SHELL_NEEDLE,
        occurrences: SHELL_HITS, line: SHELL_LINE, insideNamedFn: 'bkCollectBodyStrikes' },
      { what: 'the chooser\'s own open-lane line', file: BRAIN_PATH, needle: LANE_GATE_NEEDLE,
        occurrences: LANE_GATE_HITS, line: LANE_GATE_LINE, insideNamedFn: 'groundCandidate',
        extracted: OPEN_LANE_THRESHOLD },
      { what: 'the quick-exchange window N (published as a definition; no face gates on it)',
        file: CONST_PATH, needle: KICK_CD_NEEDLE, occurrences: KICK_CD_HITS, line: KICK_CD_LINE,
        extractedSeconds: KICK_COOLDOWN, extractedTicks: QUICK_N_TICKS },
      { what: 'THE ONE `bkGroundCorridor` READ FORK (GC-T0 §SEAM)', file: BRAIN_PATH,
        needle: GC_FORK_NEEDLE, occurrences: GC_FORK_HITS },
      { what: 'THE ONE GC PRICER STATEMENT (GC-T0 §LAW)', file: BRAIN_PATH,
        needle: GC_PRICE_NEEDLE, occurrences: GC_PRICE_HITS },
      { what: 'THE ONE `dlcDeliveryChoice` READ FORK (DLC-T0 §SEAM)', file: BRAIN_PATH,
        needle: DLC_FORK_NEEDLE, occurrences: DLC_FORK_HITS },
      { what: 'THE ONE `dlcStrikePlane` READ FORK (DLC-T0s §SEAM)', file: BRAIN_PATH,
        needle: SP_FORK_NEEDLE, occurrences: SP_FORK_HITS },
      { what: '⭐⭐ THE PRECEDENCE GUARD — "no grid forms while either seat exists"',
        file: BRAIN_PATH, needle: SP_PRECEDENCE_NEEDLE, occurrences: SP_PRECEDENCE_HITS },
      { what: '⭐⭐ THE ONE `dxWindupAim` FORK — the elected aim\'s DEPOSIT (DX-T0 §DISCARD '
        + 'statement 1)', file: BRAIN_PATH, needle: DX_FORK_NEEDLE, occurrences: DX_FORK_HITS },
      { what: '⭐⭐ THE ONE ARM-TIME CONSUMPTION GATE (DX-T0 §DISCARD statement 2)',
        file: MATCH_PATH, needle: DX_ARM_NEEDLE, occurrences: DX_ARM_HITS },
      { what: '⭐⭐ THE ONE PLUMB-THROUGH — the release (DX-T0 §DISCARD statement 3)',
        file: MATCH_PATH, needle: DX_RESOLVE_NEEDLE, occurrences: DX_RESOLVE_HITS },
      { what: '`groundShellHazard` call count in PlayerBrain / definition count in the seat',
        calls: GC_HAZARD_CALLS, definitions: GC_HAZARD_DEFS,
        absentFromEntryLayer: GC_ABSENT_FROM_A4, dlcAbsentFromEntryLayer: DLC_ABSENT_FROM_A4,
        dxAbsentFromEntryLayer: DX_ABSENT_FROM_A4,
        armPendingPassDefinitionSites: DX_ARM_SITES,
        armPendingPassCallSitesInBrain: DX_BRAIN_ARM_SITES,
        dxDepositWriteSites: DX_DEPOSIT_WRITES },
    ],
  },
  definitions: {
    clockHonesty: '1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds. Every '
      + 'per-match COUNT face carries the clock in its unit string; every SHARE face is '
      + 'clock-invariant.',
    strikeAttribution: 'BK-C2 §P.1\'s rule verbatim in substance: a tick on which '
      + '`bkContactLedger.strikesApplied` moved by exactly one; the struck body is the ball\'s '
      + 'own `lastTouch` after the step, GATED by the body still being inside the contact law\'s '
      + 'cooldown/stun gate and by his class agreeing with the ledger\'s own split for that '
      + 'tick. Anything else is booked `strikesUnattributed` and enters no other cell.',
    liveFlight: 'the most recent release, retired when any body other than the kicker owns the '
      + 'ball or after 720 ticks (R9\'s own retire cap).',
    measuredGroundPass: 'a GROUND launch (no positive vertical component at release) of class '
      + 'shortPass / throughBall / cutback for which the engine itself names a target '
      + '(`pendingPass.targetGid`) — so a LINE exists to price. This is exactly the population '
      + 'the GC term is charged on. Shots and every headed contact are named out.',
    displacedDecision: '⭐⭐ a WIND-UP-SEAT measured ground pass whose ELECTED AIM IS DISPLACED, '
      + 'the UNION of two components: (i) the CARRIED election — `pendingPassWindup.aimLead` is '
      + 'non-null with non-zero magnitude (the DX channel, DX-T0 §LAW); (ii) the LEGACY '
      + 'aim-field read — the record\'s own `aim` differs from the named target\'s position at '
      + 'the choice tick (GC-T1B §P11 / GC-T2 §R6\'s instrument verbatim). ⚠ THE DX DOOR MOVES '
      + '(i) ONLY: the `aim` field is byte-untouched, which is why a `dxWindupAim`-shut arm\'s '
      + 'reading is GC-T2\'s reading exactly. Both components are published separately. ⛔ Not a '
      + 'decline rate (see `alternativesUsage.declaredLimit`).',
    loftedDelivery: 'a delivery whose launch HAD a positive vertical component. The GC term '
      + 'never enters the lofted `sL` chain (GC-T0 §SCOPE, machine-pinned).',
    pairedDelta: 'the two arms of a pair walk the SAME seeds, and the bootstrap CLUSTER IS THE '
      + 'CELL: each draw resamples cells once and re-derives BOTH arms\' pooled ratios inside '
      + 'that draw, so the Δ interval is paired by construction. 2,000 draws, percentile '
      + `interval, resample rng seeded from the block base ${BLOCK_BASE}. ⚠ Pairing is WITHIN a `
      + 'pair; no Δ is ever computed ACROSS the two pairs.',
    honestLimits: hypothesis.honestLimits,
  },
  world: {
    arms: ARMS,
    scoredPair: SCORED_PAIR,
    stacks: {
      shut: 'a4MatchFlags(11) + `dlcDeliveryChoice` + `dlcStrikePlane` + `bkGroundCorridor` + '
        + 'armA4World(m, null, 11) + `passLeadSupport` 1 on the match-local views — THE GC-T2 '
        + 'COMPOSITION EXACTLY. `dxWindupAim` FALSE.',
      armed: 'THE SAME, plus the ONE construction flag `dxWindupAim: true`.',
    },
    theOnlyDifferenceScored: flagDiffScored,
    dlcAxisIdenticalWithinScoredPair: dlcAxisIdentical,
    geneNote: '`dvExposureWeight` sits at world 11\'s own 0.5 pin and `passLeadSupport` at the '
      + 'banked DLC value 1 (DLC-T1\'s `PTP_GENE_MAX`), in EVERY arm, on MATCH-LOCAL views only. '
      + '⭐ NEITHER THE DLC AXIS NOR THE GROUND PRICE DIFFERS BETWEEN THE SCORED ARMS — only '
      + 'whether the wound-up kick may express the aim the argmax already elected.',
    geneWritingIdiom: 'the SHIPPED `armCorridorWorld` → `setCorridorWeight` writes the exposure '
      + 'weight; the DLC gene is written in THAT SAME SHAPE (`baseGenome` and `effGenome` '
      + 'replaced by copies, `info.genome` never touched). ⚠ DECLARED DEPARTURE from DLC-T1\'s '
      + 'own `armGene`, which wrote all THREE views: that probe predates ruling #334 item 1, and '
      + 'canon (HOME #270.2) is "dose NEVER in info.genome". The checklist\'s SUBSTANCE — flag + '
      + 'a NON-ABSENT gene on the views the chooser reads, proved by read-back through the '
      + 'SHIPPED `passLeadSupportWeight` map — is kept in full.',
    pinnedExposureWeight: CORRIDOR_WORLD_WEIGHT,
    pinnedLeadGene: DLC_GENE_VALUE,
    constructionReceipts: receiptFacts,
    compositionProofNote: 'canon (composition proof, HOME: BU contract M-BU.2 / ruling #285): '
      + 'DLC × the world-11 stack was UNMEASURED, so the doors and the lifecycle are proven at '
      + 'THIS composition FIRST — see `compositionProof`, walked on scratch seeds before any '
      + 'battery seed.',
    workerFixtureNote: 'CANON, VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world '
      + '(League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines '
      + "#270's E4 correction; matches the perf diagnostic)\" — this probe builds `Match` "
      + 'DIRECTLY and never round-trips a League, so no worker fixture is generated and the '
      + 'sentence binds nothing here.',
  },
  compositionProof,
  hypothesis,
  sizing: {
    note: '⭐⭐ THE EX-ANTE POWER ARITHMETIC (§N), shown BEFORE any battery seed was read. Every '
      + 'input is a FIELD of GC-T2\'s committed artifact, read from hashed bytes; every target '
      + 'magnitude is GC-T2\'s OUTLIER-ROBUST (leave-one-out) point, RE-DERIVED here from its '
      + 'stored cells and required to reproduce its published `sensitivity.looDelta` and '
      + '`maxInfluenceSeed` EXACTLY. The paired-cluster bootstrap SE scales as 1/sqrt(N) in the '
      + 'number of CLUSTERS (cluster = match seed).',
    form: 'half-width = (ci95[1] - ci95[0]) / 2; se(nSource) = half-width / z.975; '
      + 'se(needed) = |target| / (z.975 + z.80); N = ceil(nSource * (se(nSource)/se(needed))^2)',
    z975: Z_975, z80: Z_80, zSum: Z_SUM,
    source: { file: GCT2_PATH, sha256: GCT2_SHA, hashedBodySha256: GCT2_HASHED_BODY },
    unsizableFaces: [{
      face: 'altDisplacedShare', conjunct: '(a)',
      why: '⛔ NOT SIZABLE FROM THE SOURCE, AND SAID HERE BEFORE THE BATTERY: GC-T2 published '
        + 'this face at EXACTLY 0 in both arms (0/37450 shut, 0/35629 armed) with a ZERO-WIDTH '
        + 'interval, so there is no variance to size against. (a) is therefore scored as a '
        + 'STRUCTURAL / LIVENESS resolution — "does the door express at all, resolvedly" — and '
        + 'NOT as a powered estimate of a magnitude. ⛔ Never promise power you do not have.',
    }],
    nSource: N_SOURCE,
    rows: SIZING.map((r) => ({
      face: r.face, conjunct: r.conjunct, targetKind: r.targetKind,
      sourceHalfWidth: r.sourceHalfWidth, seAtSource: round(r.seAtSource, 8),
      publishedDelta: r.publishedDelta, reDerivedDelta: round(r.fullDelta, 8),
      reproducesPublished: r.reproducesPublished,
      maxInfluenceSeed: r.maxInfluenceSeed, maxInfluence: round(r.maxInfluence, 8),
      robustPoint: round(r.robustPoint, 8),
      sourcePublishedLooDelta: r.publishedLooDelta,
      reproducesPublishedLoo: r.reproducesPublishedLoo,
      targetMagnitude: round(r.targetMagnitude, 8), seNeeded: round(r.seNeeded, 8),
      nRequired: r.nRequired,
      nRequiredAtRobustMagnitude: r.nRequiredAtRobustMagnitude,
      mdeAtFrozenN: round(r.mdeAtCap, 8),
      resolvableAtFrozenN: r.resolvableAtCap,
    })),
    nRequiredMax: N_REQUIRED_MAX,
    blockCapPairs: BLOCK_CAP_PAIRS,
    nFrozen: N_FROZEN,
    capBinds: N_CAP_BINDS,
    ranAtFrozenN: cells.length === N_FROZEN,
    honestShortfall: '⛔ THE CAP BINDS AND MOST FACES CANNOT BE BOUGHT INSIDE ONE BLOCK. At '
      + `n = ${N_FROZEN} paired seeds only the rows whose \`resolvableAtFrozenN\` is TRUE are `
      + 'powered at GC-T2\'s own outlier-robust magnitudes; every other row is declared '
      + 'UNDERPOWERED HERE, BEFORE THE BATTERY, and for those a non-resolution is a SAMPLE-SIZE '
      + 'statement, not evidence of no effect. ⚠ AND THE TARGETS ARE A DIFFERENT TREATMENT\'S '
      + 'magnitudes — the sizes the GROUND PRICE moved these faces by, used as the best '
      + 'available scale for what the DX door might move them by. ⛔ Never promise power you do '
      + 'not have, and ⛔ THE PREDICATES ARE NOT RELAXED TO COMPENSATE.',
    assumptionDeclared: '⚠⚠ THIS RULE ASSUMES THIS BATTERY\'S PER-SEED CLUSTER VARIANCE IS '
      + 'GC-T2\'S. Same composition, same estimator, same walk-side predicates — but a DIFFERENT '
      + 'ARM AXIS (GC-T2 varied `bkGroundCorridor`, which is TRUE in BOTH arms here) and '
      + 'DIFFERENT SEEDS, so it is a strictly weaker assumption than GC-T2\'s own was. The '
      + 'REALISED half-widths are published beside the ex-ante expected ones.',
    exAnteExpectedHalfWidth: Object.fromEntries(SIZING.map((r) => [r.face,
      round(r.seAtSource * Math.sqrt(N_SOURCE / N_FROZEN) * Z_975, 8)])),
  },
  sensitivity: {
    note: '⭐⭐ THE LEAVE-ONE-OUT SENSITIVITY FACE — ruling #346 item 1\'s standing order, '
      + 'PRE-REGISTERED at §P and REPORTED beside every scored face. For each scored face: the '
      + 'MAX SINGLE-SEED INFLUENCE (all n cells examined) and the leave-that-one-out '
      + 're-bootstrap of the scored statistic, with the frozen predicate re-read on it.',
    law: '⛔⛔ NO GATE READS THIS FACE AND NOTHING IS TRIMMED. The primary faces are the FULL-n '
      + 'untrimmed readings and they alone carry H-GC.2\'s verdict; the commander reads both.',
    bootstrapDraws: BOOTSTRAP,
    looResampleRngSeed: BLOCK_BASE + 1,
    rows: sensitivityRows.map((r) => ({
      face: r.face, conjunct: r.conjunct, predicateForm: r.predicateForm,
      fullDelta: round(r.fullDelta, 8),
      maxInfluenceIndex: r.maxInfluenceIndex, maxInfluenceSeed: r.maxInfluenceSeed,
      maxInfluence: round(r.maxInfluence, 8),
      influenceShareOfDelta: round(r.influenceShareOfDelta, 6),
      looDelta: round(r.looDelta, 8),
      looCi95: [round(r.looCi95[0], 8), round(r.looCi95[1], 8)],
      looShutCi95: r.looShutCi95 === null
        ? null : [round(r.looShutCi95[0], 8), round(r.looShutCi95[1], 8)],
      looShutBand: r.looShutBand === null ? null : round(r.looShutBand, 8),
      looArmedPoint: r.looArmedPoint === null ? null : round(r.looArmedPoint, 8),
      primaryPass: r.primaryPass, looPass: r.looPass, conjunctFlips: r.conjunctFlips,
    })),
    anyScoredFaceFlips: sensitivityRows.some((r) => r.conjunctFlips),
    facesThatFlip: sensitivityRows.filter((r) => r.conjunctFlips).map((r) => r.face),
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    subBands: {
      scoredPairBattery: `${BLOCK_BASE}–${BLOCK_BASE + N_SEEDS - 1} (${N_SEEDS} seeds x 2 arms)`,
      seasonLadderLeagues: RUN_LADDER ? LADDER_SEEDS : '⛔ NOT WALKED (DXT1_LADDER=off)',
      constructionReceipt: RECEIPT_SEED,
    },
    ladderNote: RUN_LADDER
      ? '⭐ the SEASON LADDER draws its LEAGUE seeds from THIS block and derives every ladder '
        + 'MATCH seed from them through the SHIPPED `hashSeed`, exactly as `League.createMatch` '
        + `does. Matches walked: ${LADDER_ARMS.length} arms x ${LADDER_SEEDS.length} leagues x `
        + `${LADDER_GENS} generations x ${(LADDER_TEAMS * (LADDER_TEAMS - 1)) / 2} fixtures.`
      : '⛔ NO LADDER WALKED IN THIS RUN.',
    bookedScored: SCORED_SEEDS,
    walkedScored: scoredSeedsWalked,
    armsPerCell: ARMS.length,
    walksTotal: walksBooked,
    compositionProofWalks: compWalks,
    compositionProofSeeds: COMP_SEEDS,
    scratchSmokeSeeds: SMOKE_SEEDS,
    scratchNote: 'the COMPOSITION PROOF and the SIZING SMOKE walk the OUT-OF-BAND SCRATCH RANGE '
      + '(≥ 900,000,000) — canon: "verifier scratch walks use the stage\'s own consumed band or '
      + 'the out-of-band scratch range (≥ 900,000,000) — never the next virgin block". No '
      + 'battery seed was walked before the freeze commit.',
    bookedEqualsWalked: scoredSeedsWalked.length === SCORED_SEEDS.length,
    consumedWhole: 'the block is consumed WHOLE of record',
  },
  stats: {
    consumed: 0,
    note: 'every interval in this exam is a PERCENTILE BOOTSTRAP over the WALKED CELLS (the '
      + 'IN-T0 / DF-T2 / IN-T1 / BK-C1 / BK-C2 / GC-T1 precedent, #329 item 4), not a '
      + 'registry-consuming statistic. The next stats base therefore remains ≥ 117,600 and the '
      + 'registry stays 73. ⚠ THIS IS A FIELD, NOT A GATE (#334 item 3: a hardcoded `true` is '
      + 'not a gate).',
    bootstrapDraws: BOOTSTRAP,
    resampleRngSeed: BLOCK_BASE,
    clusterIsTheCell: 'both arms of a pair ride the same resampled cell — paired by design.',
  },
  strikeCensus,
  staleMap,
  reAimSignature,
  alternativesUsage,
  depositPin: {
    note: '⭐⭐ THE DEPOSIT-SIDE BEHAVIOURAL PIN — ORDERED INTO THIS §P BY THE #353 RIDER '
      + '(DX-T0 §COMMANDER CORRECTIONS item 2). It closes the ONE link DX-T0 held with a '
      + 'SOURCE-TEXT pin alone: that the value the ONE fork deposits is the value the wind-up '
      + 'record carries.',
    method: 'a wrapper on THIS match\'s `armPendingPass` reads `match.dxStrikeAim` BEFORE the '
      + 'call (the deposit the fork wrote, with the seam\'s own gid+tick eligibility applied), '
      + 'delegates with the IDENTICAL arguments, then reads `pendingPassWindup.aimLead`. A '
      + 'second wrapper on `resolvePendingPassWindup` captures the record\'s `aimLead` and the '
      + '`performPass` wrapper asserts the release received exactly it. ⚠ PURE OBSERVATION: the '
      + 'composition proof\'s G-LOCKSTEP walks every world with BOTH wrappers ABSENT and '
      + 'requires a byte-identical whole-match signature.',
    law: 'armed + an eligible deposit ⇒ `aimLead` EQUALS it component for component; otherwise '
      + '`aimLead` is EXACTLY `null`. ZERO mismatches. ⛔ The NON-VACUITY of the carried case is '
      + 'gated on the SCRATCH composition proof only (`DX-DEPOSIT-PIN`), NEVER on the battery — '
      + 'a gate must not read the result H-DX.1(a) is meant to leave free.',
    byArm: Object.fromEntries(ARMS.map((a) => [a, {
      captures: totals[a].depCaptures,
      carriedAndEqual: totals[a].depCarriedOk,
      nullAsCertified: totals[a].depNullOk,
      mismatches: totals[a].depMismatch,
      resolves: totals[a].depResolves,
      resolveCarriedRecordValue: totals[a].depResolveOk,
      resolveMismatches: totals[a].depResolveMismatch,
    }])),
    compositionProofRows: compRows.map((r) => ({
      world: r.world, seed: r.seed, captures: r.depCaptures, carriedAndEqual: r.depCarriedOk,
      nullAsCertified: r.depNullOk, mismatches: r.depMismatch,
      resolves: r.depResolves, resolveOk: r.depResolveOk,
      resolveMismatches: r.depResolveMismatch,
    })),
  },
  seasonLadder: {
    note: '⭐ REPORTED, GATED BY NOTHING AS FOOTBALL (the dispatch brief\'s own order). The '
      + 'BK-T4 §10 / DF-C0 §R4 house ladder with the gene axis re-pointed at the DLC gene '
      + '`passLeadSupport`: BOTH arms walk THE ARMED WORLD (the GC-T2 composition + '
      + '`dxWindupAim`), and the ONE difference is whether SELECTION MAY TOUCH THE GENE through '
      + 'the SHIPPED `mutateGenome` / `crossoverGenomes` opt-in. ⛔ NOTHING IS PRE-SEEDED and NO '
      + 'VALUE IS EVER SET BY HAND.',
    walked: RUN_LADDER,
    arms: LADDER_ARMS,
    teams: LADDER_TEAMS,
    generations: LADDER_GENS,
    leagueSeeds: LADDER_SEEDS,
    fixturesPerGeneration: (LADDER_TEAMS * (LADDER_TEAMS - 1)) / 2,
    selectionLaw: `elite ${LADDER_ELITE_N} · reborn ${LADDER_REBORN_N} · mutated the rest, `
      + `mutation {rate: ${MUT_RATE}, scale: ${MUT_SCALE}}, reborn {rate: ${REBORN_RATE}, `
      + `scale: ${REBORN_SCALE}} — \`evolveGroup\`'s own band law, mirrored probe-side because `
      + '`League.finishSeason` calls the shipped mutators with HARD-CODED options (the MT-T2 '
      + 'precedent).',
    matchSeedDerivation: 'hashSeed(leagueSeed, generation, fixtureIndex, 0xdc) — the SHIPPED '
      + '`hashSeed`, the `League.createMatch` idiom.',
    driftShadow: '⚠ THE NEUTRAL-DRIFT SHADOW rides the CONTROL arm: inert passengers mutated by '
      + 'the SAME law in their OWN rng namespace and inherited through the SAME '
      + 'elite/mutate/reborn assignments. They touch no match, so they are what the gene level '
      + 'looks like with ZERO selection on it — the honest null for "did selection ADOPT it".',
    doseIdiom: '⭐ `armA4World` writes `dvExposureWeight` on MATCH-LOCAL views only; the '
      + 'franchise `info.genome` carries NO exposure weight on any ladder match, and no '
      + '`passLeadSupport` at all in the CONTROL arm (`gLadderClean`).',
    limits: [
      '⚠ ONE ECOLOGY, TEN CLUBS, FOUR LEAGUES — a probe-side ladder, not the shipped League.',
      '⚠ THE GOALS SLOPE IS THE HOUSE early(1–5)→late idiom and carries NO interval here.',
      '⛔ NO H-DX.1 CONJUNCT READS ANY LADDER NUMBER.',
    ],
    wallSeconds: ladderWallSec,
    cells: ladderCells,
    byGeneration: ladderFaces,
    goalsSlopes: ladderSlopes,
  },
  perf,
  quotedContext,
  walkFixtures: {
    note: 'canon REFINED at #334 item 2: "anchored extraction protects the source line; a '
      + 'headline-bearing walk-side predicate ALSO needs a composition fixture". Every predicate '
      + 'that decides what a published face COUNTS is a PURE function called by BOTH the walk '
      + 'and this table.',
    total: FIXTURES.length, passed: FIXTURES.filter((f) => f.ok).length, rows: FIXTURES,
  },
  perSeedCells: cells,
  faces: faces.map((f) => ({
    face: f.face, unit: f.unit, what: f.what, denNote: f.denNote,
    value: round(f.value, 8), numerator: f.numerator, denominator: f.denominator,
    ci95: [round(f.ciLo, 8), round(f.ciHi, 8)], halfWidth: round(f.halfWidth, 8),
  })),
  deltas: deltas.map((d) => ({
    key: d.key, pair: d.pair, shutArm: d.shutArm, armedArm: d.armedArm,
    shut: round(d.shut, 8), armed: round(d.armed, 8), delta: round(d.delta, 8),
    ci95: [round(d.ciLo, 8), round(d.ciHi, 8)], halfWidth: round(d.halfWidth, 8),
    absDeltaOverHalfWidth: round(d.absDeltaOverHalfWidth, 4),
    excludesZeroBelow: d.excludesZeroBelow, excludesZeroAbove: d.excludesZeroAbove,
    unit: 'paired (armed − shut) difference, in the face\'s own unit',
  })),
  gates,
};

/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — decided AFTER gFaces, below. */
let OUT_PATH = OUT_BASE;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
/* §16 gFaces — THE RE-DERIVATION GATE, PARSING THE SERIALIZED ARTIFACT        */
/* ========================================================================== */
const disk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as typeof artifact;
const diskCells = disk.perSeedCells as Cell4[];
const diskFaces = disk.faces as {
  face: string; value: number; numerator: number; denominator: number;
}[];
const diskDeltas = disk.deltas as {
  key: string; shutArm: Arm; armedArm: Arm; shut: number; armed: number; delta: number;
}[];
const asNum = (v: number | null | undefined): number =>
  (v === null || v === undefined ? Number.NaN : v);
const eq = (a: number | null, b: number | null): boolean => {
  const x = asNum(a);
  const y = asNum(b);
  return (Number.isNaN(x) && Number.isNaN(y)) || Math.abs(x - y) < 1e-8;
};
let faceChecks = 0;
let faceOk = 0;
const faceFailures: string[] = [];
for (const df of diskFaces) {
  const def = FACES[df.face];
  faceChecks++;
  if (def === undefined) { faceFailures.push(`${df.face}: no definition`); continue; }
  const n = sum(diskCells.map((c) => def.num(c)));
  const d0 = sum(diskCells.map((c) => def.den(c)));
  const ok = eq(n, df.numerator) && eq(d0, df.denominator)
    && eq(round(ratio(n, d0), 8), df.value);
  if (ok) faceOk++;
  else faceFailures.push(`${df.face}: ${n}/${d0} vs ${df.numerator}/${df.denominator}`);
}
/** every Δ re-derives from the cells too (the point estimates; the interval is the rng's) */
for (const dd of diskDeltas) {
  faceChecks++;
  const fs = FACES[`${dd.shutArm}.${dd.key}`];
  const fa = FACES[`${dd.armedArm}.${dd.key}`];
  const ps = ratio(sum(diskCells.map((c) => fs.num(c))), sum(diskCells.map((c) => fs.den(c))));
  const pa = ratio(sum(diskCells.map((c) => fa.num(c))), sum(diskCells.map((c) => fa.den(c))));
  if (eq(round(ps, 8), dd.shut) && eq(round(pa, 8), dd.armed) && eq(round(pa - ps, 8), dd.delta)) {
    faceOk++;
  } else faceFailures.push(`delta.${dd.shutArm}->${dd.armedArm}.${dd.key}`);
}
const binChecks: [string, boolean][] = [];
const poolDisk = (arm: Arm, pick: (r: Row) => number[]): number[] => {
  const acc = zeros(pick(diskCells[0].rows[arm]).length);
  for (const c of diskCells) addInto(acc, pick(c.rows[arm]));
  return acc;
};
const poolDisk2 = (arm: Arm, pick: (r: Row) => number[][]): number[][] => {
  const acc = pick(diskCells[0].rows[arm]).map((x) => zeros(x.length));
  for (const c of diskCells) addInto2(acc, pick(c.rows[arm]));
  return acc;
};
const diskStrike = disk.strikeCensus as typeof strikeCensus;
const diskStale = disk.staleMap as typeof staleMap;
const diskPerf = disk.perf as typeof perf;
const diskAlt = disk.alternativesUsage as typeof alternativesUsage;
for (const a of ARMS) {
  const sc = (diskStrike.byArm as Record<string, Record<string, unknown>>)[a];
  const st = (diskStale.byArm as Record<string, Record<string, unknown>>)[a];
  const pf = (diskPerf.byArm as Record<string, Record<string, number>>)[a];
  const al = (diskAlt.byArm as Record<string, Record<string, unknown>>)[a];
  const perp = poolDisk(a, (r) => r.strikePerpBins);
  const perpPub = sc.perpDistanceFromLineAtKick as {
    bins: number[]; medianFromBinsLowerEdge: number;
  };
  binChecks.push([`${a}.perpBins`, JSON.stringify(perp) === JSON.stringify(perpPub.bins)]);
  binChecks.push([`${a}.perpMedian`,
    eq(perpPub.medianFromBinsLowerEdge, round(medianFromBins(perp, PERP_BIN_M), 6))]);
  binChecks.push([`${a}.byClass`, JSON.stringify(poolDisk(a, (r) => r.strikeByClass))
    === JSON.stringify(sc.byClassCooldownStunned)]);
  binChecks.push([`${a}.bySide`, JSON.stringify(poolDisk(a, (r) => r.strikeBySide))
    === JSON.stringify(sc.bySideTeammateOpponentNoFlight)]);
  binChecks.push([`${a}.joint`, JSON.stringify(poolDisk2(a, (r) => r.gpJoint))
    === JSON.stringify(st.jointLaneOpenByShellBlocked)]);
  binChecks.push([`${a}.jointWindup`, JSON.stringify(poolDisk2(a, (r) => r.gpJointWindup))
    === JSON.stringify(st.jointWindupOnly)]);
  binChecks.push([`${a}.caromJoint`, JSON.stringify(poolDisk2(a, (r) => r.gpCaromJoint))
    === JSON.stringify(st.caromJointLaneOpenByShellBlocked)]);
  binChecks.push([`${a}.caromJointWindup`, JSON.stringify(poolDisk2(a, (r) => r.gpCaromJointWindup))
    === JSON.stringify(st.caromJointWindupOnly)]);
  for (const [k, pick] of [
    ['laneOpennessAtChoice', (r: Row) => r.gpLaneBins],
    ['laneOpennessAtChoiceCaromedOnly', (r: Row) => r.gpCaromLaneBins],
  ] as [string, (r: Row) => number[]][]) {
    const acc = poolDisk(a, pick);
    const pub = st[k] as { bins: number[]; medianFromBinsLowerEdge: number };
    binChecks.push([`${a}.${k}`, JSON.stringify(acc) === JSON.stringify(pub.bins)]);
    binChecks.push([`${a}.${k}.median`,
      eq(pub.medianFromBinsLowerEdge, round(medianFromBins(acc, UNIT_BIN), 6))]);
  }
  const dispAcc = poolDisk(a, (r) => r.altDispBins);
  const dispPub = al.aimDisplacementMetres as { bins: number[]; medianFromBinsLowerEdge: number };
  binChecks.push([`${a}.altDispBins`, JSON.stringify(dispAcc) === JSON.stringify(dispPub.bins)]);
  binChecks.push([`${a}.altDispMedian`,
    eq(dispPub.medianFromBinsLowerEdge, round(medianFromBins(dispAcc, DISP_BIN_M), 6))]);
  const carAcc = poolDisk(a, (r) => r.altCarriedBins);
  const carPub = al.carriedLeadMetres as { bins: number[]; medianFromBinsLowerEdge: number };
  binChecks.push([`${a}.altCarriedBins`, JSON.stringify(carAcc) === JSON.stringify(carPub.bins)]);
  binChecks.push([`${a}.altCarriedMedian`,
    eq(carPub.medianFromBinsLowerEdge, round(medianFromBins(carAcc, DISP_BIN_M), 6))]);
  binChecks.push([`${a}.dxCounts`,
    (al.carriedElectionDecisions as number) === sum(diskCells.map((c) => c.rows[a].altCarried))
    && (al.aimFieldDisplacedDecisions as number)
      === sum(diskCells.map((c) => c.rows[a].altAimFieldDisplaced))]);
  binChecks.push([`${a}.altCounts`,
    (al.windupGroundDecisions as number) === sum(diskCells.map((c) => c.rows[a].altDecisions))
    && (al.displaced as number) === sum(diskCells.map((c) => c.rows[a].altDisplaced))
    && (al.supportScopedDecisions as number) === sum(diskCells.map((c) => c.rows[a].altSupport))
    && (al.supportScopedDisplaced as number)
      === sum(diskCells.map((c) => c.rows[a].altSupportDisplaced))
    && (al.passStrikes as number) === sum(diskCells.map((c) => c.rows[a].passStrikes))
    && (al.ledStrikesHandled as number) === sum(diskCells.map((c) => c.rows[a].ledHandled))
    && (al.ledStrikesNonZero as number) === sum(diskCells.map((c) => c.rows[a].ledNonZero))
    && (al.ledStrikesNonZeroToSupportTarget as number)
      === sum(diskCells.map((c) => c.rows[a].ledNonZeroToSupport))]);
  const leadAcc = poolDisk(a, (r) => r.leadBins);
  const leadPub = al.deliveredLeadMetres as { bins: number[]; medianFromBinsLowerEdge: number };
  binChecks.push([`${a}.leadBins`, JSON.stringify(leadAcc) === JSON.stringify(leadPub.bins)]);
  binChecks.push([`${a}.leadMedian`,
    eq(leadPub.medianFromBinsLowerEdge, round(medianFromBins(leadAcc, DISP_BIN_M), 6))]);
  binChecks.push([`${a}.staleCounts`,
    (st.measuredGroundPasses as number) === sum(diskCells.map((c) => c.rows[a].gpMeasured))
    && (st.caromedGroundPasses as number) === sum(diskCells.map((c) => c.rows[a].gpCaromed))
    && (st.fromWindupSeat as number) === sum(diskCells.map((c) => c.rows[a].gpFromWindup))
    && (st.priceEvaluations as number) === sum(diskCells.map((c) => c.rows[a].priceEvals))
    && (st.priceEvaluationsNonZero as number)
      === sum(diskCells.map((c) => c.rows[a].priceEvalNonZero))
    && (st.deliveries as number) === sum(diskCells.map((c) => c.rows[a].deliveries))
    && (st.loftedLaunches as number) === sum(diskCells.map((c) => c.rows[a].loftedLaunches))]);
  binChecks.push([`${a}.strikeCounts`,
    (sc.attributedStrikes as number) === sum(diskCells.map((c) => c.rows[a].strikes))
    && (sc.ledgerAppliedStrikes as number)
      === sum(diskCells.map((c) => c.rows[a].ledStrikesApplied))
    && (sc.onGroundFlight as number)
      === sum(diskCells.map((c) => c.rows[a].strikeOnGroundFlight))
    && (sc.onLoftedFlight as number)
      === sum(diskCells.map((c) => c.rows[a].strikeOnLoftedFlight))]);
  binChecks.push([`${a}.perf`,
    eq(pf.wallSecondsPerMatch,
      round(ratio(sum(diskCells.map((c) => c.rows[a].wallMs)) / 1000, diskCells.length), 6))]);
}
/** ⭐ THE RE-AIM SIGNATURE's own arithmetic re-derives from the cells, off disk */
const diskReAim = disk.reAimSignature as typeof reAimSignature;
for (const row of diskReAim.byPair) {
  const [sa, aa] = row.pair.split('→') as [Arm, Arm];
  const js = poolDisk2(sa, (r) => r.gpJoint);
  const ja = poolDisk2(aa, (r) => r.gpJoint);
  const ok = JSON.stringify(js) === JSON.stringify(row.shutJoint)
    && JSON.stringify(ja) === JSON.stringify(row.armedJoint)
    && JSON.stringify([[ja[0][0] - js[0][0], ja[0][1] - js[0][1]],
      [ja[1][0] - js[1][0], ja[1][1] - js[1][1]]]) === JSON.stringify(row.cellDeltas)
    && row.blockedColumnDelta === (ja[0][0] + ja[1][0]) - (js[0][0] + js[1][0])
    && row.clearColumnDelta === (ja[0][1] + ja[1][1]) - (js[0][1] + js[1][1])
    && row.measuredGroundPassDelta === sum(diskCells.map((c) => c.rows[aa].gpMeasured))
      - sum(diskCells.map((c) => c.rows[sa].gpMeasured))
    && row.deliveriesDelta === sum(diskCells.map((c) => c.rows[aa].deliveries))
      - sum(diskCells.map((c) => c.rows[sa].deliveries));
  binChecks.push([`reAim.${row.pair}`, ok]);
}
/** ⭐ THE COMPOSITION PROOF re-derives its relations from the stored signature rows, off disk */
const diskComp = disk.compositionProof as typeof compositionProof;
binChecks.push(['composition.reDerives', (() => {
  const rows = diskComp.rows;
  const sig = (w: CompWorld, seed: number): string | undefined =>
    rows.find((r) => r.world === w && r.seed === seed)?.signature;
  const ident = (w: CompWorld, ref: CompWorld): boolean =>
    (diskComp.scratchSeeds as number[]).every((sd) => sig(w, sd) !== undefined
      && sig(w, sd) === sig(ref, sd));
  const diff = (w: CompWorld, ref: CompWorld): boolean =>
    (diskComp.scratchSeeds as number[]).every((sd) => sig(w, sd) !== undefined
      && sig(w, sd) !== sig(ref, sd));
  const rowsIn = (w: CompWorld): CompRow[] => rows.filter((r) => r.world === w);
  const want: Record<string, boolean> = {
    'G-BITE.dx': diff('armedRef', 'shutRef'),
    'G-INERT.dx': ident('noDlcArmed', 'noDlcShut'),
    'G-ZERO.dx': ident('dlcZeroArmed', 'dlcZeroShut'),
    'G-PRECEDENCE.dx': ident('contestOnlyArmed', 'armedRef'),
    'DX-EXPRESSION': rowsIn('armedRef').every((r) => r.carriedDecisions > 0)
      && (['shutRef', 'noDlcShut', 'dlcZeroShut'] as CompWorld[])
        .every((w) => rowsIn(w).every((r) => r.carriedDecisions === 0)),
    'O1-WINDUP-AIM-FIELD-UNMOVED': rows.every((r) => r.aimFieldDisplacedDecisions === 0),
    'DX-DEPOSIT-PIN': rows.every((r) => r.depMismatch === 0 && r.depResolveMismatch === 0
      && r.depCaptures === r.depCarriedOk + r.depNullOk && r.depResolves === r.depResolveOk)
      && rowsIn('armedRef').every((r) => r.depCarriedOk > 0)
      && (['shutRef', 'noDlcShut', 'dlcZeroShut'] as CompWorld[])
        .every((w) => rowsIn(w).every((r) => r.depCarriedOk === 0)),
    LIFECYCLE: rows.every((r) => r.armedVersion === CORRIDOR_WORLD_VERSION
      && r.ledgerZeroAtBirth && r.franchiseClean && r.finished),
    'CANDIDATES-FORM': (['shutRef', 'armedRef', 'contestOnlyArmed'] as CompWorld[])
      .every((w) => rowsIn(w).some((r) => r.ledNonZero > 0))
      && (['noDlcShut', 'noDlcArmed', 'dlcZeroShut', 'dlcZeroArmed'] as CompWorld[])
        .every((w) => rowsIn(w).every((r) => r.ledNonZero === 0)),
    'G-LOCKSTEP': rows.every((r) => r.untracedSignature === r.signature),
    'WINDUP-CHANNEL-LIVE': rows.every((r) => r.windupGroundDecisions > 0 && r.depCaptures > 0),
  };
  return diskComp.relations.every((r) => want[r.name] === r.ok)
    && diskComp.allHold === diskComp.relations.every((r) => r.ok);
})()]);
/** the QUOTED artifacts re-read from the same hashed bytes */
binChecks.push(['quotations.reRead', (() => {
  const pub = disk.quotedContext as typeof quotedContext;
  if (pub.bkC2.source.sha256 !== sha(readFileSync(BKC2_PATH, 'utf8'))) return false;
  if (pub.gcT2.source.sha256 !== sha(readFileSync(GCT2_PATH, 'utf8'))) return false;
  if (pub.gcT2.hashedBodySha256 !== GCT2_HASHED_BODY) return false;
  return Object.entries(pub.bkC2.frozenLiterals).every(([k, v]) => {
    const src = bkc2(k);
    return src.value === v.value && src.ci95[0] === v.ci95[0] && src.ci95[1] === v.ci95[1];
  }) && Object.entries(pub.gcT2.frozenLiterals).every(([k, v]) => {
    const src = gct2Face(k);
    return src.value === v.value && src.ci95[0] === v.ci95[0] && src.ci95[1] === v.ci95[1];
  }) && Object.entries(pub.gcT2.frozenScoredDeltas).every(([k, v]) => {
    const src = gct2Delta(k);
    return src.delta === v.delta && src.halfWidth === v.hw;
  });
})()]);
/** ⭐ THE VERDICT RE-DERIVES FROM THE PUBLISHED FACES AND DELTAS, off disk */
binChecks.push(['verdict.reDerives', (() => {
  const h = disk.hypothesis as typeof hypothesis;
  const dOf = (k: string): { excludesZeroBelow: boolean } | undefined =>
    (disk.deltas as { key: string; shutArm: Arm; armedArm: Arm; excludesZeroBelow: boolean }[])
      .find((x) => x.key === k && x.shutArm === SCORED_PAIR[0] && x.armedArm === SCORED_PAIR[1]);
  const fOf = (k: string): { value: number; ci95: [number, number] } | undefined =>
    (disk.faces as { face: string; value: number; ci95: [number, number] }[])
      .find((x) => x.face === k);
  const dFull = (k: string): { ci95: [number, number]; excludesZeroAbove: boolean } | undefined =>
    (disk.deltas as {
      key: string; shutArm: Arm; armedArm: Arm; ci95: [number, number]; excludesZeroAbove: boolean;
    }[]).find((x) => x.key === k && x.shutArm === SCORED_PAIR[0] && x.armedArm === SCORED_PAIR[1]);
  const aRow = dFull(A_KEY);
  const aArmedF = fOf(`${SCORED_PAIR[1]}.${A_KEY}`);
  const aOk = ((aRow?.excludesZeroAbove ?? false)
    && (aArmedF?.ci95[0] ?? Number.NaN) > 0) === h.a.pass;
  const bLo = fOf(`${SCORED_PAIR[0]}.groundPassesPerMatch`)?.ci95[0] ?? Number.NaN;
  const bVal = fOf(`${SCORED_PAIR[1]}.groundPassesPerMatch`)?.value ?? Number.NaN;
  const bOk = (bVal >= bLo) === h.b.pass;
  const cOk = C_KEYS.every((k) => {
    const sf = fOf(`${SCORED_PAIR[0]}.${k}`) as { halfWidth?: number } | undefined;
    const hw = (disk.faces as { face: string; halfWidth: number }[])
      .find((x) => x.face === `${SCORED_PAIR[0]}.${k}`)?.halfWidth ?? Number.NaN;
    void sf;
    return (dFull(k)?.ci95[1] ?? Number.NaN) <= hw;
  }) === h.c.pass;
  const dOk = D_KEYS.every((k) => {
    const sf = fOf(`${SCORED_PAIR[0]}.${k}`);
    const af = fOf(`${SCORED_PAIR[1]}.${k}`);
    return sf !== undefined && af !== undefined
      && af.value >= sf.ci95[0] && af.value <= sf.ci95[1];
  }) === h.d.pass;
  return aOk && bOk && cOk && dOk;
})()]);
/**
 * ⭐⭐ THE SIZING AND THE SENSITIVITY FACE RE-DERIVE FROM DISK TOO (canon: "the re-derivation
 * gate covers EVERY published face"). The sizing rows re-derive from GC-T1B's own artifact;
 * the sensitivity rows' POINT estimates re-derive from THIS artifact's serialized cells.
 */
const diskSizing = disk.sizing as { rows: { face: string; nRequired: number;
  targetMagnitude: number; seNeeded: number; seAtSource: number; robustPoint: number;
  maxInfluenceSeed: number }[]; nFrozen: number; nRequiredMax: number; capBinds: boolean };
for (const r of diskSizing.rows) {
  const src = SIZING.find((x) => x.face === r.face);
  binChecks.push([`sizing.${r.face}`, src !== undefined
    && eq(round(src.seAtSource, 8), r.seAtSource)
    && eq(round(src.targetMagnitude, 8), r.targetMagnitude)
    && eq(round(src.seNeeded, 8), r.seNeeded)
    && eq(round(src.robustPoint, 8), r.robustPoint)
    && src.maxInfluenceSeed === r.maxInfluenceSeed
    && src.nRequired === Math.ceil(N_SOURCE * ((r.seAtSource / r.seNeeded) ** 2))
    && src.nRequired === r.nRequired]);
}
binChecks.push(['sizing.nFrozen', diskSizing.nFrozen
  === Math.min(Math.max(...diskSizing.rows.map((r) => r.nRequired)), BLOCK_CAP_PAIRS)
  && diskSizing.nRequiredMax === Math.max(...diskSizing.rows.map((r) => r.nRequired))
  && diskSizing.capBinds === (diskSizing.nRequiredMax > BLOCK_CAP_PAIRS)]);
const diskSens = disk.sensitivity as { rows: { face: string; fullDelta: number;
  maxInfluenceIndex: number; maxInfluence: number; looDelta: number;
  conjunctFlips: boolean; primaryPass: boolean; looPass: boolean }[];
  anyScoredFaceFlips: boolean; facesThatFlip: string[] };
for (const r of diskSens.rows) {
  const fs = FACES[`${SCORED_PAIR[0]}.${r.face}`];
  const fa = FACES[`${SCORED_PAIR[1]}.${r.face}`];
  const pt = (skip: number | null): number => {
    let ns = 0; let ds = 0; let na = 0; let da = 0;
    for (const c of diskCells) {
      if (skip !== null && c.index === skip) continue;
      ns += fs.num(c); ds += fs.den(c); na += fa.num(c); da += fa.den(c);
    }
    return ratio(na, da) - ratio(ns, ds);
  };
  const full = pt(null);
  const loo = pt(r.maxInfluenceIndex);
  binChecks.push([`sensitivity.${r.face}`,
    eq(round(full, 8), r.fullDelta) && eq(round(loo, 8), r.looDelta)
    && eq(round(Math.abs(full - loo), 8), r.maxInfluence)
    && r.conjunctFlips === (r.primaryPass !== r.looPass)]);
}
binChecks.push(['sensitivity.summary',
  diskSens.anyScoredFaceFlips === diskSens.rows.some((r) => r.conjunctFlips)
  && JSON.stringify(diskSens.facesThatFlip)
    === JSON.stringify(diskSens.rows.filter((r) => r.conjunctFlips).map((r) => r.face))]);
/** ⭐ THE DEPOSIT PIN's own arithmetic re-derives from the serialized cells, off disk */
binChecks.push(['depositPin.reDerives', (() => {
  const pub = disk.depositPin as {
    byArm: Record<string, Record<string, number>>;
    compositionProofRows: { world: string; seed: number; mismatches: number;
      resolveMismatches: number }[];
  };
  return ARMS.every((a) => {
    const p = pub.byArm[a];
    return p.captures === sum(diskCells.map((c) => c.rows[a].depCaptures))
      && p.carriedAndEqual === sum(diskCells.map((c) => c.rows[a].depCarriedOk))
      && p.nullAsCertified === sum(diskCells.map((c) => c.rows[a].depNullOk))
      && p.mismatches === sum(diskCells.map((c) => c.rows[a].depMismatch))
      && p.resolves === sum(diskCells.map((c) => c.rows[a].depResolves))
      && p.resolveCarriedRecordValue === sum(diskCells.map((c) => c.rows[a].depResolveOk))
      && p.resolveMismatches === sum(diskCells.map((c) => c.rows[a].depResolveMismatch))
      && p.captures === p.carriedAndEqual + p.nullAsCertified && p.mismatches === 0;
  }) && pub.compositionProofRows.every((r) => r.mismatches === 0 && r.resolveMismatches === 0);
})()]);
/** ⭐ THE SEASON LADDER's per-generation aggregates re-derive from its own stored cells */
binChecks.push(['seasonLadder.reDerives', (() => {
  const pub = disk.seasonLadder as {
    walked: boolean; generations: number;
    cells: LadderCell[];
    byGeneration: { arm: string; generation: number; matches: number; goalsPerMatch: number;
      leagues: number }[];
    goalsSlopes: { arm: string; goalsSlopeMean: number;
      perLeague: { leagueSeed: number; delta: number }[] }[];
  };
  if (!pub.walked) return pub.byGeneration.length === 0 && pub.goalsSlopes.length === 0;
  const rowsOk = pub.byGeneration.every((g) => {
    const cs = pub.cells.filter((c) => c.arm === g.arm && c.generation === g.generation);
    const mt = sum(cs.map((c) => c.matches));
    return cs.length === g.leagues && mt === g.matches
      && eq(round(ratio(sum(cs.map((c) => c.goals)), mt), 6), g.goalsPerMatch);
  });
  const slopesOk = pub.goalsSlopes.every((s) => s.perLeague.every((pl) => {
    const cs = pub.cells.filter((c) => c.arm === s.arm && c.leagueSeed === pl.leagueSeed);
    const gpm = (xs: LadderCell[]): number =>
      ratio(sum(xs.map((c) => c.goals)), sum(xs.map((c) => c.matches)));
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    return eq(round(gpm(late) - gpm(early), 6), pl.delta);
  }) && eq(round(mean(s.perLeague.map((p) => p.delta)), 6), s.goalsSlopeMean));
  return rowsOk && slopesOk;
})()]);
const binFailures = binChecks.filter(([, v]) => !v).map(([k]) => k);
gates.gFaces = faceOk === faceChecks && faceFailures.length === 0 && binFailures.length === 0;
(artifact as { gates: Record<string, boolean> }).gates = gates;
(artifact as { faceCoverage: unknown }).faceCoverage = {
  publishedFaces: FACE_KEYS.length, publishedDeltas: deltas.length,
  checksRun: faceChecks, checksPassed: faceOk,
  binChecksRun: binChecks.length, binFailures, failures: faceFailures,
};
/** the ALLOWLIST-SCHEMA hashed body, computed LAST so it covers the final gate values */
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
(artifact as { hashedBodySha256: string }).hashedBodySha256 = sha(canonicalJson(body));

/* ⭐ THE RED-ROUTING IDIOM (#334 item 5), IN CODE, not in a human's discipline */
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
const ALL_GREEN = red.length === 0;
if (!ALL_GREEN && OUT_PATH === OUT_BASE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH)}`); } catch { /* best effort */ }
  OUT_PATH = `${OUT_BASE}.RED.json`;
}
(artifact as { outPath: string }).outPath = OUT_PATH;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
banner('');
banner('=== DX-T1 — THE EXPRESSION EXAM ===');
banner(`artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
banner('--- composition proof ---');
for (const r of COMP_RELATIONS) banner(`  ${r.ok ? 'HOLDS' : '**FAILS**'}  ${r.name}`);
banner('');
const show = (k: string): string => {
  const f = face(k);
  return `${k} = ${round(f.value, 6)} CI[${round(f.ciLo, 6)}, ${round(f.ciHi, 6)}] `
    + `n=${f.numerator}/${f.denominator}`;
};
for (const a of ARMS) {
  banner(`--- ${a} ---`);
  for (const k of ['groundStrikesPerMatch', 'caromedGroundOnOpenLaneShare',
    'groundPassesPerMatch', 'teammateStrikesPerMatch', 'loftedDeliveriesPerMatch',
    'crossesPerMatch', 'deliveriesPerMatch', 'strikesPerMatch', 'groundCaromRate',
    'passCompletion', 'possessionSpellSeconds', 'interceptionsPerMatch',
    'ledDeliveredShare', 'ledDeliveredShareSupportScoped', 'meanDeliveredLeadMetres',
    'passStrikesPerMatch', 'altDisplacedShare', 'altCarriedShare',
    'altAimFieldDisplacedShare', 'meanCarriedLeadMetres',
    'priceEvalNonZeroShare', 'goalsPerMatch', 'wallSecondsPerMatch']) {
    banner(`  ${show(`${a}.${k}`)}`);
  }
}
for (const pr of PAIRS) {
  banner(`--- paired Δ (${pr[1]} − ${pr[0]}) ---`);
  for (const d of deltas.filter((x) => x.shutArm === pr[0])) {
    banner(`  ${d.key}: Δ=${round(d.delta, 6)} CI[${round(d.ciLo, 6)}, ${round(d.ciHi, 6)}] `
      + `|Δ|/hw=${round(d.absDeltaOverHalfWidth, 3)} belowZero=${d.excludesZeroBelow}`);
  }
}
banner('--- the re-aim signature ---');
for (const row of reAimSignature.byPair) {
  banner(`  ${row.pair}: joint shut=${JSON.stringify(row.shutJoint)} `
    + `armed=${JSON.stringify(row.armedJoint)}`);
  banner(`    blockedΔ=${row.blockedColumnDelta} clearΔ=${row.clearColumnDelta} `
    + `groundPassΔ=${row.measuredGroundPassDelta} deliveriesΔ=${row.deliveriesDelta}`);
}
banner('--- §N the sizing (n from GC-T2\'s own variances, at its robust magnitudes) ---');
for (const r of SIZING) {
  banner(`  ${r.conjunct} ${r.face}: se160=${round(r.seAtSource, 6)} `
    + `target=${round(r.targetMagnitude, 6)} N=${r.nRequired} `
    + `MDE@${N_FROZEN}=${round(r.mdeAtCap, 6)} resolvable=${r.resolvableAtCap}`);
}
banner(`  N_REQUIRED_MAX=${N_REQUIRED_MAX} cap=${BLOCK_CAP_PAIRS} `
  + `N_FROZEN=${N_FROZEN} capBinds=${N_CAP_BINDS}`);
banner('--- ⭐ the leave-one-out sensitivity face (REPORTED, gated by nothing) ---');
for (const r of sensitivityRows) {
  banner(`  ${r.conjunct} ${r.face}: maxInflSeed=${r.maxInfluenceSeed} `
    + `infl=${round(r.maxInfluence, 6)} looΔ=${round(r.looDelta, 6)} `
    + `looCI[${round(r.looCi95[0], 6)}, ${round(r.looCi95[1], 6)}] `
    + `primary=${r.primaryPass} loo=${r.looPass} FLIPS=${r.conjunctFlips}`);
}
banner('--- ⭐ the deposit-side behavioural pin ---');
for (const a of ARMS) {
  banner(`  ${a}: captures=${totals[a].depCaptures} carried=${totals[a].depCarriedOk} `
    + `null=${totals[a].depNullOk} MISMATCH=${totals[a].depMismatch} `
    + `resolves=${totals[a].depResolves} resolveMISMATCH=${totals[a].depResolveMismatch}`);
}
if (RUN_LADDER) {
  banner('--- ⭐ the season ladder (REPORTED) ---');
  for (const s of ladderSlopes) {
    banner(`  ${s.arm}: goals slope ${s.goalsSlopeMean} (sd ${s.goalsSlopeSd}) · `
      + `geneMeanFinal ${s.geneMeanFinal} · driftMeanFinal ${s.driftMeanFinal}`);
  }
  for (const g of ladderFaces.filter((x) => x.generation === 1
    || x.generation === LADDER_GENS)) {
    banner(`    ${g.arm} gen ${g.generation}: goals/match ${g.goalsPerMatch} · `
      + `geneMean ${g.geneMean} · geneAboveZero ${g.geneAboveZeroShare}`);
  }
}
banner('--- H-DX.1 (scored on shut→armed ONLY) ---');
banner(`  (a) ${H_DX_1.a ? 'PASS' : 'FAIL'} `
  + `(armed ${round(aArmed.value, 6)} CI[${round(aArmed.ciLo, 6)}, ${round(aArmed.ciHi, 6)}], `
  + `Δ CI[${round(aDelta.ciLo, 6)}, ${round(aDelta.ciHi, 6)}]) `
  + `· (b) ${H_DX_1.b ? 'PASS' : 'FAIL'} `
  + `(band ${round(bBand, 6)}, armed ${round(bArmed, 6)}) · (c) ${H_DX_1.c ? 'PASS' : 'FAIL'} `
  + `· (d) ${H_DX_1.d ? 'PASS' : 'FAIL'}`);
for (const c of conjunctC) {
  banner(`    (c) ${c.key}: Δ=${round(c.delta, 6)} CI[${round(c.deltaCi[0], 6)}, `
    + `${round(c.deltaCi[1], 6)}] margin=${round(c.nonWorseningMargin, 6)} `
    + `${c.pass ? 'DOES NOT WORSEN' : '**WORSENS**'}`);
}
banner(`walks booked = walked: ${walksBooked} (+${compWalks} composition-proof scratch walks)  ·  `
  + `wall ${round((Date.now() - t0Wall) / 1000, 1)} s`);
if (!ALL_GREEN) banner(`RED GATES: ${red.join(', ')} — REPORTED, NEVER PATCHED (routed to ${OUT_PATH})`);
process.exit(ALL_GREEN ? 0 : 1);
