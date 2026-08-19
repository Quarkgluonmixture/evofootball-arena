/**
 * ⭐⭐ IN-C0 — THE PERCEPTION-SURFACE CENSUS
 * (docs/world-model/IN-C0-PERCEPTION-SURFACE.md).
 *
 * Authorized by ruling #316 item 2 for EXACTLY this stage, bound by
 * `IN-SNAPSHOT-CONTRACT.md` §3 IN-C0 (a)–(e). INSTRUMENT-ONLY: `src/**` is untouched —
 * nothing here arms, doses or edits a seam. There is NO SCORED HYPOTHESIS: this is a
 * CENSUS whose job is to PICK the seam design, the refresh law and the slice order.
 *
 * THE FIVE INSTRUMENTS, in the contract's own order:
 *   (a) THE TRUTH-READ SURFACE  — every site where a DECISION reads another body's
 *       position/velocity/facing, needle counts per needle with the PREFIX stated, every
 *       occurrence's site enumerated, each classed chooser- / executor- / physics-grade
 *       (physics stays truth by M-IN.1). VERDICT: bounded, or the slice STAGE-STOPS.
 *   (b) THE VISION-ALGEBRA INVENTORY — the shipped blind forms and pens, TURN_RATE, the BK
 *       facing cone; the vision-field CANDIDATES derived from that algebra alone, each with
 *       its derivation chain. NO TASTE CONES (#200).
 *   (c) THE o2Look INVENTORY — what the banked dormant look seam does today, its pins, its
 *       named debts, the extend-vs-new material.
 *   (d) THE STALENESS-OPPORTUNITY CENSUS (the battery) — in the WORLD-9 composition, the
 *       would-be-stale share per field candidate × read class × situation, plus the
 *       COUNTERFACTUAL DOSE LADDER (the pass chooser's ranked candidates re-evaluated with
 *       out-of-field reads FROZEN k ticks old; which choices flip). CENSUS-GRAIN: oracle
 *       re-evaluation, NO live seam.
 *   (e) PERF SIZING — the snapshot bookkeeping bound against an ANCHORED measurement of
 *       the current decide-loop cost.
 *
 * ⭐ CANON, COPIED FROM CANON.md BESIDE ITS ACTUAL HOME (never re-typed from memory, #301):
 *   · freeze-before-battery — freeze the instrument commit BEFORE the battery; the artifact
 *     records the instrument hash.  HOME: ruling #266.3(c). (paraphrase)
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema
 *     never enters the body; forbidden-name lists are retired".  HOME:
 *     PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1.
 *   · per-seed cells — per-seed/per-cluster cells stored so every headline re-derives.
 *     HOME: ruling #282.2(ii). (paraphrase)
 *   · gFaces-from-disk — the re-derivation gate parses the SERIALIZED artifact off disk.
 *     HOME: ruling #287 item 1.  VERBATIM extension: "the re-derivation gate covers EVERY
 *     published face; a percentile face requires stored bins" — HOME:
 *     PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4.
 *   · "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's
 *     site".  HOME: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1.
 *   · "a field carries the unit its name claims".  HOME: ruling #294 item 3.
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
 *     face".  HOME: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4.
 *   · "a starred finding states its |Δ| ÷ half-width ratio".  HOME:
 *     BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2.
 *   · "a src-extracted constant pins its extraction to the NAMED call site — anchored match +
 *     line receipt — never first-occurrence".  HOME: BK-C0-BODYBALL-CENSUS.md §COMMANDER
 *     CORRECTIONS item 1 (ruling #306 item 4).
 *   · "a dose-source guard should hash the bytes it reads, not a self-declared field".
 *     HOME: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6.
 *   · moving denominators disclosed per face; prefer the denominator-stable form.  HOME:
 *     PW-C0-WEIGHT-PHYSICS-CENSUS.md §COMMANDER CORRECTIONS item 2. (paraphrase)
 *   · seed discipline — BOOKED = WALKED; blocks consumed whole; stats floors step ≥ 200 on
 *     the lattice from every published base.  HOME: the standing frontier practice.
 *     (paraphrase)
 *
 * ⭐ WHAT IS INHERITED, NOT INVENTED:
 *   · THE WORLD — BK-T2/R9's `buildMatch` construction, reused EXACTLY, with the arm pinned
 *     to WORLD 9 (`a4MatchFlags(8)` + `bkFacingLaw` + `bkContactLaw` + `armA4World` with the
 *     matured L3/PC doses, both dose FILES hashed AS BYTES before they are parsed).
 *     SINGLE-ARM: this census has no armed arm — the dose ladder is ORACLE-side.
 *   · THE CANDIDATE WINDOW — `passChoiceCandidateGids` (6–30 m, E0's censused window), the
 *     engine's own function, CALLED not copied.
 *   · THE CHOOSER — `choosePerceivedPassTarget` / `pricePassOption`, the engine's own live
 *     chooser, CALLED not copied, on `oraclePerceptionSnapshot`'s documented offline path
 *     ("Full-truth snapshot for offline oracle probes; never a live perception path").
 *   · THE LADDER TIERS — `PC_TIER_SIMPLE_TICKS` / `PC_TIER_CHOICE_TICKS` (slice 1's own
 *     derived tiers) and the fastest SHIPPED scan interval, extracted from the NAMED site.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: INC0_MODE (smoke|full, REQUIRED) · INC0_N · INC0_OUT.
 *   ANY other `INC0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: INC0_MODE=full npx tsx scripts/probes/in-c0-perception-surface-census.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) · 2 = a refusal ·
 *       3 = the world/dose/constant/static-census construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { BK_CONE_RAD, BK_CONE_TICKS, O2_LOOK_TICKS } from '../../src/sim/Match';
import { DT, MATCH_DURATION } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { PC_BOOK_CELLS, PC_TIER_CHOICE_TICKS, PC_TIER_SIMPLE_TICKS } from '../../src/ai/pcLatency';
import {
  PASS_CHOICE_MAX_METRES, PASS_CHOICE_MIN_METRES, choosePerceivedPassTarget,
  passChoiceCandidateGids,
} from '../../src/ai/perceivedPassChoice';
import type { PerceptionSnapshot, PerceptionTruth } from '../../src/ai/perceptionSnapshot';
import { capturePerceptionTruth } from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)      */
/* ========================================================================== */
const ENV_WHITELIST = ['INC0_MODE', 'INC0_N', 'INC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('INC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('IN-C0 FATAL — refused env surface. '
    + `rogue INC0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.INC0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`IN-C0 FATAL — INC0_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.INC0_N !== undefined ? Number(process.env.INC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1 || N_ENV > 999)) {
  banner('IN-C0 FATAL — INC0_N must be an integer in [1, 999] (the block holds 1000 seeds, '
    + 'one of which is the world-construction receipt).');
  process.exit(2);
}
const OUT_ENV = process.env.INC0_OUT;
const PREFLIGHT_REASONS = [
  ...(MODE === 'smoke' ? ['mode=smoke'] : []),
  ...(N_ENV !== undefined ? ['INC0_N set'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/in-c0-perception-surface-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/in-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === pathResolve(CANONICAL_OUT) || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
if (IS_PREFLIGHT && isCanonical(OUT_PATH)) {
  banner(`IN-C0 FATAL — an OVERRIDE run (${PREFLIGHT_REASONS.join(', ')}) may not write a `
    + `canonical repo path (${OUT_PATH}).`);
  process.exit(2);
}

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
/** canonical JSON for the ALLOWLIST-SCHEMA hashed body */
const canonical = (v: unknown): string => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`).join(',')}}`;
};

/* ========================================================================== */
/* §2 INSTRUMENT (a) — THE TRUTH-READ SURFACE (static, over src/**)           */
/* ========================================================================== */
/**
 * ⭐ THE NEEDLE PREFIX, STATED (#307 §CORR 3 — canon needle-occurrence counts requires the
 * PREFIX be named, not implied). The needle is a PROPERTY-ACCESS suffix matched against a
 * captured RECEIVER expression; the PREFIX is the receiver token immediately left of the
 * dot, matched by:
 *
 *     /([A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*)\.(pos|vel|bodyDir|heading)\b/
 *
 * i.e. the prefix alphabet is `[A-Za-z_$][A-Za-z0-9_$]*` optionally dotted, and the four
 * needles are the four body-state fields a body's DECISION could read off another body:
 * `.pos` `.vel` `.bodyDir` `.heading`. Line comments (`//` to end of line) are stripped
 * before matching; block-comment interiors are stripped by a paren-free scanner below.
 * A receiver the regex cannot capture (a call result `foo().pos`, an index `a[i].pos`) is
 * counted in `uncapturedReceivers` and is a RED gate if non-zero in the SCOPED tree.
 */
const NEEDLES = ['pos', 'vel', 'bodyDir', 'heading'] as const;
type Needle = (typeof NEEDLES)[number];
const NEEDLE_PREFIX_ALPHABET = '[A-Za-z_$][A-Za-z0-9_$]*(?:\\.[A-Za-z_$][A-Za-z0-9_$]*)*';
const NEEDLE_RE = new RegExp(`(${NEEDLE_PREFIX_ALPHABET})\\.(pos|vel|bodyDir|heading)\\b`, 'g');
/**
 * The INDEXED receiver form — `this.allPlayers[gid].pos`, `team.players[i].vel`. The plain
 * prefix alphabet cannot cross a `]`, so these would otherwise be uncounted; they are captured
 * here with the receiver recorded as `<base>[]` and adjudicated in the SAME frozen lexicon.
 * Counted into the SAME per-needle totals — a read is a read however the body was indexed.
 */
const INDEXED_RE = new RegExp(
  `(${NEEDLE_PREFIX_ALPHABET})\\[[^\\]]*\\]\\.(pos|vel|bodyDir|heading)\\b`, 'g',
);
/** what remains uncapturable: a read off a CALL RESULT. A RED gate if it ever appears. */
const UNCAPTURED_RE = /\)\.(?:pos|vel|bodyDir|heading)\b/g;

/**
 * ⭐ THE FILE GRADE MAP — FROZEN BEFORE THE BATTERY. Every file under `src/` falls in
 * exactly one grade; the map is by explicit path or by directory prefix, and an unmapped
 * file is a RED gate (`gNoUnmappedFile`).
 *
 *  chooser   — option scoring / valuation / assignment: what a body DECIDES to do.
 *  executor  — steering, targets, spot resolution: HOW the decided act is carried out.
 *  physics   — contact, collision, capture, kick resolution. STAYS TRUTH by M-IN.1.
 *  observed  — the perception trunk itself: its reads are ALREADY snapshot reads.
 *  outside   — render / ui / game shell / evolution / utils: not a decision surface.
 */
type Grade = 'chooser' | 'executor' | 'physics' | 'observed' | 'outside';
const DIR_GRADE: readonly (readonly [string, Grade])[] = [
  ['src/render3d/', 'outside'], ['src/render/', 'outside'], ['src/ui/', 'outside'],
  ['src/game/', 'outside'], ['src/evolution/', 'outside'], ['src/utils/', 'outside'],
  ['src/audio/', 'outside'], ['src/pwa/', 'outside'], ['src/style/', 'outside'],
  ['src/replay/', 'outside'], ['src/data/', 'outside'],
];
const FILE_GRADE: Readonly<Record<string, Grade>> = {
  /* --- the perception trunk: already-observed reads --- */
  'src/ai/perceptionSnapshot.ts': 'observed',
  'src/ai/perception.ts': 'observed',
  'src/ai/attentionPolicy.ts': 'observed',
  'src/ai/motionEvidence.ts': 'observed',
  'src/ai/offballEyes.ts': 'observed',
  'src/ai/eyeContextBitsV4.ts': 'observed',
  /* --- the choosers: option scoring, valuation, assignment --- */
  'src/ai/PlayerBrain.ts': 'chooser',
  'src/ai/TeamBrain.ts': 'chooser',
  'src/ai/passAffordance.ts': 'chooser',
  'src/ai/passOptionPricing.ts': 'chooser',
  'src/ai/passOptionValue.ts': 'chooser',
  'src/ai/passValue.ts': 'chooser',
  'src/ai/passPrior.ts': 'chooser',
  'src/ai/passWeightChooser.ts': 'chooser',
  'src/ai/passLeadSeat.ts': 'chooser',
  'src/ai/passCorridorInterception.ts': 'chooser',
  'src/ai/perceivedPassChoice.ts': 'chooser',
  'src/ai/carryAffordance.ts': 'chooser',
  'src/ai/carryChoiceSeat.ts': 'chooser',
  'src/ai/offBallAffordance.ts': 'chooser',
  'src/ai/offBallCoordination.ts': 'chooser',
  'src/ai/defensiveCoordination.ts': 'chooser',
  'src/ai/defenceBook.ts': 'chooser',
  'src/ai/deliveryAccountBook.ts': 'chooser',
  'src/ai/deliveryChoiceSeat.ts': 'chooser',
  'src/ai/deliveryValueSeat.ts': 'chooser',
  'src/ai/holdAccountBook.ts': 'chooser',
  'src/ai/whetherEye.ts': 'chooser',
  'src/ai/stationEye.ts': 'chooser',
  'src/ai/strikePlaneSeat.ts': 'chooser',
  'src/ai/lookSeat.ts': 'chooser',
  'src/ai/mentality.ts': 'chooser',
  'src/ai/intentProcess.ts': 'chooser',
  'src/ai/intentResponse.ts': 'chooser',
  'src/ai/motionGatedIntentResponse.ts': 'chooser',
  'src/ai/teamTaskOccupancy.ts': 'chooser',
  'src/ai/relativeAffordance.ts': 'chooser',
  'src/ai/reachability.ts': 'chooser',
  'src/ai/prediction.ts': 'chooser',
  'src/ai/kickTransitionFeatures.ts': 'chooser',
  'src/ai/kickTransitionCorridorFeatures.ts': 'chooser',
  'src/ai/pcLatency.ts': 'chooser',
  /* --- the executors: steering, targets, spots --- */
  'src/ai/actionExecutor.ts': 'executor',
  'src/ai/steering.ts': 'executor',
  'src/ai/formations.ts': 'executor',
  'src/ai/offBallMove.ts': 'executor',
  'src/sim/rendezvousRecovery.ts': 'executor',
  /* --- the physics: contact, capture, kick resolution, the tick --- */
  'src/sim/Match.ts': 'physics',
  'src/sim/mechanics.ts': 'physics',
  'src/sim/Player.ts': 'physics',
  'src/sim/Team.ts': 'physics',
  'src/sim/physical.ts': 'physics',
  'src/sim/carryBeat.ts': 'physics',
  'src/sim/controlCoupling.ts': 'physics',
  'src/sim/League.ts': 'outside',
  'src/sim/types.ts': 'outside',
  'src/sim/constants.ts': 'outside',
  /* --- the remaining sim/app files: not decision surfaces --- */
  'src/sim/Ball.ts': 'physics',
  'src/sim/chronicle.ts': 'outside',
  'src/sim/cloneState.ts': 'outside',
  'src/sim/cup.ts': 'outside',
  'src/sim/profiler.ts': 'outside',
  'src/sim/ratings.ts': 'outside',
  'src/sim/records.ts': 'outside',
  'src/sim/simRunner.ts': 'outside',
  'src/main.ts': 'outside',
  'src/vite-env.d.ts': 'outside',
};

/**
 * ⭐ THE RECEIVER LEXICON — FROZEN BEFORE THE BATTERY. Every captured receiver token maps
 * to exactly one ROLE; an unmapped token is a RED gate (`gNoUnknownReceiver`), never a
 * silent bucket. Roles:
 *
 *  self   — the deciding body's OWN state (proprioception; FREE by M-IN.1, never snapshotted)
 *  ball   — the ball (slice 1's domain by M-IN.1; NOT this slice's)
 *  other  — ANOTHER BODY's truth: the surface a private snapshot must interpose at
 *  seen   — a body's state read off a PERCEPT (`ObservedPlayer` / snapshot record) — already
 *           private, already aged; nothing to interpose
 *  frame  — a recorded/stored/buffered copy inside the perception trunk (its own bookkeeping)
 *  nonbody— a point, a vector, a wall, a plan, a style object: not a body at all
 */
type Role = 'self' | 'ball' | 'other' | 'seen' | 'frame' | 'nonbody';
const RECEIVER_LEXICON: Readonly<Record<string, Role>> = {
  /* the deciding body — the engine's universal parameter name for "this body" */
  p: 'self', this: 'self', self: 'self', observer: 'self', me: 'self',
  /* the ball, in every alias the tree uses */
  ball: 'ball', 'match.ball': 'ball', 'this.ball': 'ball', 'truth.ball': 'ball',
  'input.ball': 'ball', 'snap.ball': 'ball', 'memory.ball': 'ball', 'buffer.ball': 'ball',
  'ball.owner': 'other',
  /* ANOTHER BODY — every alias the decision layers use for a body that is not the reader */
  o: 'other', q: 'other', mate: 'other', carrier: 'other', owner: 'other', gk: 'other',
  target: 'other', mark: 'other', threat: 'other', defender: 'other', runner: 'other',
  crosser: 'other', taker: 'other', tackler: 'other', trapper: 'other', winner: 'other',
  candidate: 'other', opponent: 'other', other: 'other', middle: 'other', back: 'other',
  outletA: 'other', outletB: 'other', bestCrossMate: 'other', bestThrowMate: 'other',
  'team.goalkeeper': 'other', shooter: 'other', passer: 'other', actor: 'other',
  player: 'other', body: 'other', entity: 'other', controller: 'other', 'input.player': 'other',
  a: 'other', b: 'other', c: 'other', d: 'other', r: 'other', lm: 'other', st: 'other',
  near: 'other', pinch: 'other', first: 'other', last: 'other', newest: 'other',
  arr: 'other', reference: 'other', real: 'other', predictedPlayer: 'other',
  /* PERCEPT reads — already private, already aged */
  seen: 'seen', observed: 'seen', obs: 'seen', fact: 'seen', seenTarget: 'seen',
  seenMate: 'seen', seenSelf: 'seen', seenPasser: 'seen', snapshot: 'seen', entry: 'seen',
  sample: 'seen', state: 'seen',
  /* perception-trunk bookkeeping copies */
  into: 'frame', from: 'frame', to: 'frame',
  /* not bodies */
  'match.fkWall': 'nonbody', 'match.restart': 'nonbody', 'style.sun': 'nonbody',
  'this.referee': 'nonbody', wall: 'nonbody', block: 'nonbody', context: 'nonbody',
  'plan.ballAfterSingleImpulse': 'nonbody', D: 'nonbody', ref: 'nonbody', team: 'nonbody',
  slider: 'nonbody',
  /* INDEXED receivers — a body taken out of a collection by index */
  'this.allPlayers[]': 'other', 'allPlayers[]': 'other', 'team.players[]': 'other',
  'opp.players[]': 'other', 'players[]': 'other', 'truth.players[]': 'other',
  'frame.players[]': 'other', 'buffer.players[]': 'other', 'snapshot.players[]': 'seen',
};

/**
 * THE BODY-ENUMERATION GATEWAYS — the OTHER half of the boundedness verdict. A read of
 * another body's truth can only happen if the reader HOLDS a reference to that body; these
 * are the expressions that hand a decision a COLLECTION of bodies. A snapshot law that
 * interposes here reaches every downstream read at once, which is what makes the surface
 * bounded (or not).
 */
const GATEWAY_RE = /\b(?:[A-Za-z_$][A-Za-z0-9_$]*\.)*(?:allPlayers|players|teammates|opponents|outfield)\b(?!\s*[:(])/g;
const GATEWAY_NEEDLES = ['team.players', 'opp.players', 'match.allPlayers', 'this.allPlayers',
  'allPlayers', '.players'] as const;

interface Site {
  file: string; line: number; needle: Needle; receiver: string; role: Role; grade: Grade;
}
const stripComments = (src: string): string => {
  // Strip block comments but PRESERVE newlines so line numbers survive.
  let out = '';
  let i = 0;
  while (i < src.length) {
    if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end < 0 ? src.length : end + 2;
      for (let j = i; j < stop; j++) if (src[j] === '\n') out += '\n';
      i = stop;
      continue;
    }
    out += src[i];
    i++;
  }
  return out.split('\n').map((l) => l.split('//')[0]).join('\n');
};
const walkTree = (dir: string, into: string[]): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = pathJoin(dir, entry);
    if (statSync(full).isDirectory()) walkTree(full, into);
    else if (entry.endsWith('.ts')) into.push(full);
  }
  return into;
};
const SRC_FILES = walkTree('src', []).sort();
const gradeOf = (file: string): Grade | null => {
  if (FILE_GRADE[file] !== undefined) return FILE_GRADE[file];
  for (const [prefix, g] of DIR_GRADE) if (file.startsWith(prefix)) return g;
  return null;
};
const unmappedFiles: string[] = [];
const sites: Site[] = [];
const unknownReceivers = new Map<string, number>();
let uncapturedReceivers = 0;
const uncapturedSites: string[] = [];
for (const file of SRC_FILES) {
  const grade = gradeOf(file);
  if (grade === null) { unmappedFiles.push(file); continue; }
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    NEEDLE_RE.lastIndex = 0;
    let m = NEEDLE_RE.exec(line);
    while (m !== null) {
      const receiver = m[1];
      const needle = m[2] as Needle;
      const role = RECEIVER_LEXICON[receiver];
      if (role === undefined) {
        unknownReceivers.set(receiver, (unknownReceivers.get(receiver) ?? 0) + 1);
      } else {
        sites.push({ file, line: li + 1, needle, receiver, role, grade });
      }
      m = NEEDLE_RE.exec(line);
    }
    INDEXED_RE.lastIndex = 0;
    let ix = INDEXED_RE.exec(line);
    while (ix !== null) {
      const receiver = `${ix[1]}[]`;
      const needle = ix[2] as Needle;
      const role = RECEIVER_LEXICON[receiver];
      if (role === undefined) {
        unknownReceivers.set(receiver, (unknownReceivers.get(receiver) ?? 0) + 1);
      } else {
        sites.push({ file, line: li + 1, needle, receiver, role, grade });
      }
      ix = INDEXED_RE.exec(line);
    }
    UNCAPTURED_RE.lastIndex = 0;
    let u = UNCAPTURED_RE.exec(line);
    while (u !== null) {
      uncapturedReceivers++;
      if (uncapturedSites.length < 40) uncapturedSites.push(`${file}:${li + 1}`);
      u = UNCAPTURED_RE.exec(line);
    }
  }
}
/** per-needle occurrence COUNTS (canon: counts per needle, every occurrence enumerated) */
const needleCounts = Object.fromEntries(NEEDLES.map((n) => [n,
  sites.filter((s) => s.needle === n).length])) as Record<Needle, number>;
const GRADES: readonly Grade[] = ['chooser', 'executor', 'physics', 'observed', 'outside'];
const ROLES: readonly Role[] = ['self', 'ball', 'other', 'seen', 'frame', 'nonbody'];
const surfaceMatrix = GRADES.map((g) => ROLES.map((r) => sites
  .filter((s) => s.grade === g && s.role === r).length));
/** ⭐ THE VERDICT QUANTITY: other-body truth reads that a snapshot must interpose at */
const interposeSites = sites.filter((s) => s.role === 'other'
  && (s.grade === 'chooser' || s.grade === 'executor'));
const physicsOtherSites = sites.filter((s) => s.role === 'other' && s.grade === 'physics');
const interposeFiles = [...new Set(interposeSites.map((s) => s.file))].sort();
/** the gateway census — where a decision OBTAINS a collection of bodies */
const gatewayCounts: Record<string, number> = {};
const gatewaySites: string[] = [];
for (const file of SRC_FILES) {
  const grade = gradeOf(file);
  if (grade !== 'chooser' && grade !== 'executor') continue;
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
  for (let li = 0; li < lines.length; li++) {
    GATEWAY_RE.lastIndex = 0;
    let m = GATEWAY_RE.exec(lines[li]);
    while (m !== null) {
      const tok = m[0];
      gatewayCounts[tok] = (gatewayCounts[tok] ?? 0) + 1;
      gatewaySites.push(`${file}:${li + 1}:${tok}`);
      m = GATEWAY_RE.exec(lines[li]);
    }
  }
}

/* ========================================================================== */
/* §3 INSTRUMENT (b) — THE VISION-ALGEBRA INVENTORY (anchored extraction)     */
/* ========================================================================== */
/**
 * ⭐ CANON, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
 * anchored match + line receipt — never first-occurrence" (HOME: BK-C0 §CORR item 1). Every
 * extraction below is SCOPED to the body of a NAMED declaration before the pattern is
 * matched at all.
 */
const MATCH_SRC = readFileSync('src/sim/Match.ts', 'utf8');
const MECH_SRC = readFileSync('src/sim/mechanics.ts', 'utf8');
const CONST_SRC = readFileSync('src/sim/constants.ts', 'utf8');
const PSNAP_SRC = readFileSync('src/ai/perceptionSnapshot.ts', 'utf8');
const lineOf = (src: string, index: number): number => src.slice(0, index).split('\n').length;
interface Extract { value: number; site: string; line: number; expression: string }
const scopeBody = (src: string, anchor: string): { body: string; at: number } | null => {
  const at = src.indexOf(anchor);
  if (at < 0) return null;
  const next = src.indexOf('\nexport ', at + 1);
  const next2 = src.indexOf('\n  private ', at + 1);
  const next3 = src.indexOf('\n  }', at + 1);
  const ends = [next, next2, next3].filter((v) => v > 0);
  const end = ends.length === 0 ? src.length : Math.min(...ends);
  return { body: src.slice(at, end), at };
};
const extractFrom = (
  src: string, anchor: string, re: RegExp, siteName: string,
): Extract | null => {
  const scoped = scopeBody(src, anchor);
  if (scoped === null) return null;
  const m = re.exec(scoped.body);
  if (m === null) return null;
  return {
    value: Number(m[1]),
    site: siteName,
    line: lineOf(src, scoped.at + m.index),
    expression: m[0].replace(/\s+/g, ' ').trim(),
  };
};
/** the two shipped blind PENS, at their own NAMED export declarations */
const CONTACT_PEN = extractFrom(CONST_SRC, 'export const CONTACT_BLIND_PEN',
  /export const CONTACT_BLIND_PEN = ([0-9.]+);/, 'constants.ts export const CONTACT_BLIND_PEN');
const DEFLECT_PEN = extractFrom(CONST_SRC, 'export const DEFLECT_BLIND_PEN',
  /export const DEFLECT_BLIND_PEN = ([0-9.]+);/, 'constants.ts export const DEFLECT_BLIND_PEN');
/** the shipped BLIND FORM at each of the three NAMED roll sites */
const BLIND_FORM_RE = /const blind = \(1 \+ \([A-Za-z.]+ \* [A-Za-z.]+ \+ [A-Za-z.]+ \* [A-Za-z.]+\)\) \/ 2;/;
const blindFormAt = (src: string, anchor: string, name: string): Extract | null => {
  const scoped = scopeBody(src, anchor);
  if (scoped === null) return null;
  const m = BLIND_FORM_RE.exec(scoped.body);
  if (m === null) return null;
  return { value: 2, site: name, line: lineOf(src, scoped.at + m.index), expression: m[0] };
};
/** contact roll: the CAPTURE contact inside the named `resolveBystanderContact`-bearing block */
const CONTACT_BLIND_ANCHOR = 'private tryCapture(): void {';
const CONTACT_FORM = blindFormAt(MATCH_SRC, CONTACT_BLIND_ANCHOR,
  'Match.ts private tryCapture — the CAPTURE-contact bystander roll');
const DEFLECT_FORM = blindFormAt(MECH_SRC, 'export function tryDeflection(',
  'mechanics.ts export function tryDeflection');
const UNSET_FORM = blindFormAt(MECH_SRC, 'const bdir', 'mechanics.ts the UNSET-WALL readiness');
/** the shipped INCUMBENT perception cone, inside the NAMED `visibleDistance` declaration */
const INCUMBENT_CONE = extractFrom(PSNAP_SRC, 'function visibleDistance(',
  /return facing >= (-?[0-9.]+) - awareness \* ([0-9.]+) \? d : Number\.NaN;/,
  'perceptionSnapshot.ts function visibleDistance — the facing gate');
const INCUMBENT_CONE_AW = (() => {
  const scoped = scopeBody(PSNAP_SRC, 'function visibleDistance(');
  if (scoped === null) return null;
  const m = /return facing >= (-?[0-9.]+) - awareness \* ([0-9.]+) \? d : Number\.NaN;/
    .exec(scoped.body);
  return m === null ? null : { base: Number(m[1]), slope: Number(m[2]) };
})();
const INCUMBENT_RANGE = extractFrom(PSNAP_SRC, 'function visibleDistance(',
  /const range = ([0-9.]+) \+ awareness \* ([0-9.]+);/,
  'perceptionSnapshot.ts function visibleDistance — the range');
const INCUMBENT_RANGE_SLOPE = (() => {
  const scoped = scopeBody(PSNAP_SRC, 'function visibleDistance(');
  if (scoped === null) return null;
  const m = /const range = ([0-9.]+) \+ awareness \* ([0-9.]+);/.exec(scoped.body);
  return m === null ? null : { base: Number(m[1]), slope: Number(m[2]) };
})();
const INCUMBENT_NEARFIELD = extractFrom(PSNAP_SRC, 'function visibleDistance(',
  /if \(d <= ([0-9.]+)\) return d;/,
  'perceptionSnapshot.ts function visibleDistance — the near-field felt/heard radius');
/** the shipped scan interval, at its NAMED site inside `advancePerceptionMemory` */
const SCAN_INTERVAL = extractFrom(PSNAP_SRC, 'export function advancePerceptionMemory(',
  /const intervalTicks = Math\.round\(([0-9.]+) - awareness \* ([0-9.]+)\);/,
  'perceptionSnapshot.ts advancePerceptionMemory — the scan interval');
const SCAN_INTERVAL_SLOPE = (() => {
  const scoped = scopeBody(PSNAP_SRC, 'export function advancePerceptionMemory(');
  if (scoped === null) return null;
  const m = /const intervalTicks = Math\.round\(([0-9.]+) - awareness \* ([0-9.]+)\);/
    .exec(scoped.body);
  return m === null ? null : { base: Number(m[1]), slope: Number(m[2]) };
})();
/** the per-extraction verdict, published so a RED gate names WHICH anchor moved */
const EXTRACT_CHECKS: Record<string, boolean> = {
  contactPen: CONTACT_PEN?.value === 0.7,
  deflectPen: DEFLECT_PEN?.value === 0.75,
  contactBlindForm: CONTACT_FORM !== null,
  deflectBlindForm: DEFLECT_FORM !== null,
  unsetWallBlindForm: UNSET_FORM !== null,
  incumbentCone: INCUMBENT_CONE_AW?.base === -0.2 && INCUMBENT_CONE_AW?.slope === 0.5,
  incumbentRange: INCUMBENT_RANGE_SLOPE?.base === 18 && INCUMBENT_RANGE_SLOPE?.slope === 22,
  incumbentNearField: INCUMBENT_NEARFIELD?.value === 4,
  scanInterval: SCAN_INTERVAL_SLOPE?.base === 15 && SCAN_INTERVAL_SLOPE?.slope === 9,
  bkConeTicks: BK_CONE_TICKS === 11,
  o2LookTicks: O2_LOOK_TICKS === 11,
  turnRate: TURN_RATE === 6.5,
  pcTiers: PC_TIER_SIMPLE_TICKS === 12 && PC_TIER_CHOICE_TICKS === 27,
};
const EXTRACTS_OK = CONTACT_PEN !== null && DEFLECT_PEN !== null && CONTACT_FORM !== null
  && DEFLECT_FORM !== null && UNSET_FORM !== null && INCUMBENT_CONE_AW !== null
  && INCUMBENT_RANGE_SLOPE !== null && INCUMBENT_NEARFIELD !== null
  && SCAN_INTERVAL_SLOPE !== null
  && CONTACT_PEN.value === 0.7 && DEFLECT_PEN.value === 0.75
  && INCUMBENT_CONE_AW.base === -0.2 && INCUMBENT_CONE_AW.slope === 0.5
  && INCUMBENT_RANGE_SLOPE.base === 18 && INCUMBENT_RANGE_SLOPE.slope === 22
  && INCUMBENT_NEARFIELD.value === 4
  && SCAN_INTERVAL_SLOPE.base === 15 && SCAN_INTERVAL_SLOPE.slope === 9
  && BK_CONE_TICKS === 11 && O2_LOOK_TICKS === 11 && TURN_RATE === 6.5
  && PC_TIER_SIMPLE_TICKS === 12 && PC_TIER_CHOICE_TICKS === 27;

/**
 * ⭐⭐ THE DERIVED VISION-FIELD CANDIDATES — FROM THE ENGINE'S OWN ALGEBRA, NOTHING ELSE.
 *
 * THE ALGEBRA. The shipped blind form is `blind = (1 + ĥ·d̂) / 2`, where `ĥ` is the body's
 * heading and `d̂` the BALL'S TRAVEL direction. For an object approaching the body, the
 * unit vector FROM the body TOWARD it is `û ≈ −d̂`, so the same expression read as a
 * SEEING weight is `s = 1 − blind = (1 + ĥ·û) / 2` — 1 dead ahead, 0.5 square across the
 * body (mechanics.ts's own comment: "0.5 = square across the body"), 0 directly behind.
 * That is the ONLY facing price the engine ships, and every candidate below is a
 * THRESHOLD ON IT, obtained by asking the engine's own prices where they bite.
 *
 * ⚠ THE HONEST LIMIT, STATED BEFORE THE BATTERY: the blind algebra prices FACING and
 * NOTHING ELSE. There is no distance term in it anywhere. Candidates F1–F4 are therefore
 * ANGLE-ONLY fields; the only shipped RANGE (18 + awareness·22 m, plus a 4 m felt/heard
 * near field) lives in the INCUMBENT cone, which is NOT derived from the blind algebra and
 * is published as F5 for contrast, LABELLED as taste (#200's own target).
 */
interface FieldCandidate {
  key: string;
  dotMin: number;
  halfAngleDeg: number;
  rangeMetres: number | null;
  nearFieldMetres: number | null;
  derivedFromBlindAlgebra: boolean;
  derivation: string;
}
const HALF_PRICE = 0.5;
const acosDeg = (c: number): number => (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
const AW = 0.8; // the shipped `edsAwareness` default — asserted against the engine below
const contactBlindEdge = HALF_PRICE / (CONTACT_PEN?.value ?? Number.NaN);
const deflectBlindEdge = HALF_PRICE / (DEFLECT_PEN?.value ?? Number.NaN);
const FIELD_CANDIDATES: FieldCandidate[] = [
  {
    key: 'F1_bkCone',
    dotMin: Math.cos(BK_CONE_RAD),
    halfAngleDeg: (BK_CONE_RAD * 180) / Math.PI,
    rangeMetres: null,
    nearFieldMetres: null,
    derivedFromBlindAlgebra: false,
    derivation: 'THE TURN-BUDGET FIELD. `BK_CONE_RAD = BK_CONE_TICKS · DT · TURN_RATE` '
      + `(= ${BK_CONE_TICKS} · ${DT} · ${TURN_RATE} rad), the rotation the world's EXISTING `
      + 'wind-up time price already absorbs (BK-T0 §LAW). A body inside this cone is a body '
      + 'the engine already treats as ALIGNED FOR FREE — so it is the tightest field the '
      + 'shipped algebra names. Derived from TURN_RATE + C7_W_CAP, not from the blind pens.',
  },
  {
    key: 'F2_squareAcross',
    dotMin: 0,
    halfAngleDeg: 90,
    rangeMetres: null,
    nearFieldMetres: null,
    derivedFromBlindAlgebra: true,
    derivation: 'THE SQUARE FIELD. `s = (1 + ĥ·û)/2 ≥ 0.5 ⇔ ĥ·û ≥ 0` — the engine\'s own '
      + 'midpoint, named in mechanics.ts\'s own words ("0.5 = square across the body"). '
      + 'Half-angle 90°: everything in front of the shoulder line.',
  },
  {
    key: 'F3_deflectHalfPrice',
    dotMin: 1 - 2 * deflectBlindEdge,
    halfAngleDeg: acosDeg(1 - 2 * deflectBlindEdge),
    rangeMetres: null,
    nearFieldMetres: null,
    derivedFromBlindAlgebra: true,
    derivation: 'THE DEFLECT HALF-PRICE FIELD. The shipped deflection roll multiplies by '
      + `(1 − blind · DEFLECT_BLIND_PEN) with DEFLECT_BLIND_PEN = ${DEFLECT_PEN?.value}. `
      + 'The facing at which the engine has taken HALF the odds away is '
      + `blind = 0.5 / ${DEFLECT_PEN?.value} = ${round(deflectBlindEdge)}, i.e. `
      + `ĥ·û = 1 − 2·blind = ${round(1 - 2 * deflectBlindEdge)}. Beyond it the engine already `
      + 'says he mostly does not get to the ball — the natural edge of "he is reacting to it".',
  },
  {
    key: 'F4_contactHalfPrice',
    dotMin: 1 - 2 * contactBlindEdge,
    halfAngleDeg: acosDeg(1 - 2 * contactBlindEdge),
    rangeMetres: null,
    nearFieldMetres: null,
    derivedFromBlindAlgebra: true,
    derivation: 'THE CONTACT HALF-PRICE FIELD. The same construction at the CAPTURE roll: '
      + `(1 − blind · CONTACT_BLIND_PEN) with CONTACT_BLIND_PEN = ${CONTACT_PEN?.value} ⇒ `
      + `blind = ${round(contactBlindEdge)} ⇒ ĥ·û = ${round(1 - 2 * contactBlindEdge)}. `
      + 'The WIDEST field the blind algebra itself names, because 0.7 is the gentler pen.',
  },
  {
    key: 'F5_incumbentCone',
    dotMin: (INCUMBENT_CONE_AW?.base ?? Number.NaN) + AW * (INCUMBENT_CONE_AW?.slope ?? 0) * -1
      + 2 * (INCUMBENT_CONE_AW?.base ?? 0) * 0, // see note: value assembled below
    halfAngleDeg: Number.NaN,
    rangeMetres: null,
    nearFieldMetres: null,
    derivedFromBlindAlgebra: false,
    derivation: 'THE INCUMBENT (SHIPPED, NOT DERIVED) CONE — `visibleDistance`\'s own gate: '
      + '`facing >= -0.2 - awareness · 0.5`, range `18 + awareness · 22` m, plus a 4 m '
      + 'near field that is felt/heard outside the cone entirely. ⚠ THESE ARE TASTE '
      + 'CONSTANTS from the EDS era — published as the CONTRAST arm, never as a derivation. '
      + 'This is the field the two ALREADY-ARMED percept consumers use today.',
  },
];
// F5's numbers, assembled honestly from the anchored extraction rather than inline arithmetic.
FIELD_CANDIDATES[4].dotMin = (INCUMBENT_CONE_AW?.base ?? Number.NaN)
  - AW * (INCUMBENT_CONE_AW?.slope ?? Number.NaN);
FIELD_CANDIDATES[4].halfAngleDeg = acosDeg(FIELD_CANDIDATES[4].dotMin);
FIELD_CANDIDATES[4].rangeMetres = (INCUMBENT_RANGE_SLOPE?.base ?? Number.NaN)
  + AW * (INCUMBENT_RANGE_SLOPE?.slope ?? Number.NaN);
FIELD_CANDIDATES[4].nearFieldMetres = INCUMBENT_NEARFIELD?.value ?? Number.NaN;
const FIELD_KEYS = FIELD_CANDIDATES.map((f) => f.key);
const NF = FIELD_KEYS.length;
/** ⭐ THE NESTING PROPERTY: the candidates are ordered strictly widening (F1 ⊂ … ⊂ F5). */
const FIELDS_NESTED = FIELD_CANDIDATES.every((f, i) => i === 0
  || f.dotMin < FIELD_CANDIDATES[i - 1].dotMin);
/** the shipped fastest scan interval — `round(15 − awareness·9)` at awareness = 1 */
const FASTEST_SCAN_TICKS = Math.round((SCAN_INTERVAL_SLOPE?.base ?? Number.NaN)
  - 1 * (SCAN_INTERVAL_SLOPE?.slope ?? Number.NaN));
/**
 * ⭐ THE DOSE LADDER, DERIVED (never chosen): k ∈ {the fastest SHIPPED scan interval,
 * slice 1's SIMPLE tier, slice 1's CHOICE tier} = {6, 12, 27} ticks. Every rung is a number
 * the world already ships; none is a taste value.
 */
const K_LADDER = [FASTEST_SCAN_TICKS, PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS] as const;
const NK = K_LADDER.length;
const LADDER_OK = FASTEST_SCAN_TICKS === 6 && PC_TIER_SIMPLE_TICKS === 12
  && PC_TIER_CHOICE_TICKS === 27;
const RING = Math.max(...K_LADDER) + 1;

/* ========================================================================== */
/* §4 INSTRUMENT (c) — THE o2Look INVENTORY (static)                          */
/* ========================================================================== */
const LOOKSEAT_SRC = readFileSync('src/ai/lookSeat.ts', 'utf8');
const BRAIN_SRC = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
const O2_NEEDLES = ['o2Look', 'o2LookWindow', 'forcedLook', 'o2LookLedger', 'O2_LOOK_TICKS',
  'armO2Look', 'stepO2Look', 'o2LookEligible', 'o2LookDecision',
  'recordObserverScanFrame'] as const;
const o2Counts: Record<string, number> = {};
const o2Sites: string[] = [];
for (const file of SRC_FILES) {
  const raw = readFileSync(file, 'utf8');
  const lines = raw.split('\n');
  for (const needle of O2_NEEDLES) {
    for (let li = 0; li < lines.length; li++) {
      const hits = lines[li].split(needle).length - 1;
      if (hits > 0) {
        o2Counts[needle] = (o2Counts[needle] ?? 0) + hits;
        o2Sites.push(`${file}:${li + 1}:${needle}×${hits}`);
      }
    }
  }
}
const o2CountsTotal = sum(Object.values(o2Counts));
const O2_INVENTORY_OK = LOOKSEAT_SRC.includes('export function o2LookEligible')
  && LOOKSEAT_SRC.includes('export function o2LookDecision')
  && LOOKSEAT_SRC.includes("return { take: false, why: 'no look (incumbent-equivalent)' };")
  && BRAIN_SRC.includes('o2LookEligible(p, match, top.action, mustKick)')
  && MATCH_SRC.includes('armO2Look(p: Player): void {')
  && MATCH_SRC.includes('private stepO2Look(): void {')
  && (o2Counts.O2_LOOK_TICKS ?? 0) > 0;

/* ========================================================================== */
/* §5 THE DOSE SOURCES — FILE BYTES HASHED BEFORE THEY ARE PARSED             */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha(L3_BYTES);
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(JSON.parse(L3_BYTES) as Record<string, unknown>);
const PC_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PC_BYTES_SHA = sha(PC_BYTES);
const PC_DOSE: readonly (readonly number[])[] = poolPcDoseTable(
  JSON.parse(PC_BYTES) as Record<string, unknown>,
);
const PC_DOSE_EXPOSURES = sum(PC_DOSE.map((r) => sum(r)));
const L3_DOSE_LUNGES = sum(L3_DOSE.map((c) => c.lunges));

/* ========================================================================== */
/* §6 THE WORLD — WORLD 9, SINGLE ARM (BK-T2/R9's construction, reused)       */
/* ========================================================================== */
const PC_WORLD = 8 as const;
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const buildMatch = (seed: number): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(PC_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, PC_WORLD, L3_DOSE, PC_DOSE);
  return m;
};
const worldConjuncts = (m: Match): Record<string, boolean> => {
  const mm = m as unknown as {
    pcLatency: { books: { count(ri: number, key: string): number }[] } | null;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    c7Windup: boolean; o1PassWindup: boolean; pcReactionLatency: boolean;
    edsPerceivedChoice: boolean; edsPerceivedDefence: boolean; edsAwareness: number;
    o2Look: boolean;
  };
  const booksDosed = mm.pcLatency !== null && mm.pcLatency.books.every((b) => {
    for (let ri = 0; ri < ROSTER_SIZE; ri++) {
      for (let c = 0; c < PC_BOOK_CELLS.length; c++) {
        if (b.count(ri, PC_BOOK_CELLS[c]) !== PC_DOSE[ri][c]) return false;
      }
    }
    return true;
  });
  const l3Dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => L3_DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  return {
    armedVersionIsWorldNine: a4ArmedVersion(m) === BK_WORLD_VERSION,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    pcBooksBitEqualToDose: booksDosed,
    l3BooksBitEqualToDose: l3Dosed,
    bkLawsArmed: m.bkFacingLaw === true && m.bkContactLaw === true,
    /** ⭐ THE CENSUS'S OWN RECEIPT: the two ALREADY-ARMED percept consumers, named */
    edsPerceivedChoiceArmed: mm.edsPerceivedChoice === true,
    edsPerceivedDefenceArmed: mm.edsPerceivedDefence === true,
    shippedAwarenessIsTheAssumedOne: mm.edsAwareness === AW,
    /** ⭐ the look seam is BANKED-DORMANT in world 9 — the extend-vs-new question is open */
    o2LookDormant: mm.o2Look === false,
  };
};

/* ========================================================================== */
/* §7 THE PRE-REGISTERED READ CLASSES AND SITUATIONS (frozen)                 */
/* ========================================================================== */
/**
 * ⭐ THE READ CLASSES, from instrument (a)'s own finding — not invented here.
 *
 *  chooserOpp    — the chooser scans EVERY opponent (`opennessOf` / `laneOpenness` /
 *                  `pressureAt` / `effectiveBlockers` all take `opp.players` whole:
 *                  PlayerBrain lines enumerated in the artifact's `gatewaySites`).
 *  chooserMate   — the chooser scans the pass-candidate WINDOW: `passChoiceCandidateGids`'s
 *                  own 6–30 m band over `team.players`, the engine's function, CALLED.
 *  executorMark  — the executor's own steering target: this body's mark (`Team.marks`).
 *  executorBall  — the executor's other steering target: the current CARRIER.
 *  executorTeammate — ⚠ AN EXPLICIT UPPER BOUND, labelled as one. The enumerated executor
 *                  sites (actionExecutor.ts / formations.ts / steering.ts — every occurrence
 *                  listed in `truthReadSurface.sites`) read teammate bodies by the aliases
 *                  `mate` / `q` for spot resolution, overlap routing, wall-run partners and
 *                  avoidance. The census does NOT resolve WHICH teammate each site reads at
 *                  each tick, so it books ALL of the reader's on-pitch teammates and SAYS SO:
 *                  this cell OVER-COUNTS by construction and is an upper bound on the
 *                  executor's teammate truth surface, never an estimate of it.
 *
 * ⭐ A PRE-FREEZE CORRECTION OF RECORD (made from CODE FACTS, before any battery result was
 * read): the OFF-BALL chooser is ALREADY SNAPSHOT-BASED — `offBallAffordance`'s context is
 * built from `snapshot.players.filter(...)` (ObservedPlayer records) and `stationEye`'s
 * `perceivedContext` likewise. An off-ball body's OPPONENT reads are therefore not truth
 * reads at all, which is exactly why `chooserOpp` / `chooserMate` are scoped to the CARRIER.
 * Without the upper-bound class above, the `receiver` situation would have carried a ZERO
 * denominator — a vacuous face dressed as a measurement.
 *
 * PHYSICS reads are EXCLUDED by M-IN.1 ("PHYSICS STAYS TRUTH") and their count is published
 * so the exclusion is auditable, never silent.
 */
const READ_CLASSES = ['chooserOpp', 'chooserMate', 'executorMark', 'executorBall',
  'executorTeammate'] as const;
type ReadClass = (typeof READ_CLASSES)[number];
const RC = Object.fromEntries(READ_CLASSES.map((c, i) => [c, i])) as Record<ReadClass, number>;
/**
 * THE SITUATIONS — the reader's own state at the sampled tick, first arm that matches:
 *  carrier   — he owns the ball
 *  receiver  — he is the target of a live `pendingPass`
 *  defender  — his side does not hold the ball (nobody owning ⇒ by last touch's side)
 *  supporter — his side holds the ball and he is neither carrier nor receiver
 */
const SITUATIONS = ['carrier', 'receiver', 'defender', 'supporter'] as const;
type Situation = (typeof SITUATIONS)[number];
const SI = Object.fromEntries(SITUATIONS.map((c, i) => [c, i])) as Record<Situation, number>;
/**
 * ⭐ THE SAMPLE STRIDE, DERIVED: every `FASTEST_SCAN_TICKS` = 6 ticks (the fastest interval
 * the SHIPPED perception trunk ever scans at). Sampling faster than the world can refresh
 * would over-count the same read; sampling slower would miss refreshes.
 */
const STRIDE = FASTEST_SCAN_TICKS;

/* ========================================================================== */
/* §8 THE PER-SEED ROW (per-seed cells — canon, home ruling #282.2(ii))       */
/* ========================================================================== */
interface Row {
  seed: number; worldOk: boolean; ticks: number; playingTicks: number; sampledTicks: number;
  /* --- (d.1) the staleness-opportunity census --- */
  /** read class × situation: the number of (reader, read-body) PAIRS sampled */
  pairsByClassSituation: number[][];
  /** field × read class × situation: pairs whose READ BODY is OUTSIDE the reader's field */
  outByFieldClassSituation: number[][][];
  /** the excluded physics population, published so the M-IN.1 exclusion is auditable */
  physicsPairsExcluded: number;
  /** distance histogram of sampled pairs, 8 bins × 5 m (the range question, uncensored tail) */
  pairDistBins: number[];
  /** pairs outside F5's shipped RANGE (the only shipped distance term) */
  pairsBeyondIncumbentRange: number;
  /* --- (d.2) the counterfactual dose ladder --- */
  receptionMoments: number; ladderEvaluable: number;
  /** field × k: choices whose ARGMAX target flipped under frozen out-of-field reads */
  flipsByFieldK: number[][];
  /** field × k: choices whose ranked ORDER changed at all (a superset of flips) */
  reorderByFieldK: number[][];
  /** field × k: evaluable choices (the denominator; identical across k by construction) */
  evalByFieldK: number[][];
  /** field: choices with at least one candidate OUT of field (the "could flip" population) */
  anyOutByField: number[];
  /** the option census at reception moments: candidates offered, executable, out-of-field */
  candidatesTotal: number; executableTotal: number; outOfFieldCandidatesByField: number[];
  /* --- (e) perf --- */
  stepWallMs: number;
}
const emptyRow = (seed: number): Row => ({
  seed, worldOk: false, ticks: 0, playingTicks: 0, sampledTicks: 0,
  pairsByClassSituation: zeros2(READ_CLASSES.length, SITUATIONS.length),
  outByFieldClassSituation: Array.from({ length: NF },
    () => zeros2(READ_CLASSES.length, SITUATIONS.length)),
  physicsPairsExcluded: 0,
  pairDistBins: zeros(8),
  pairsBeyondIncumbentRange: 0,
  receptionMoments: 0, ladderEvaluable: 0,
  flipsByFieldK: zeros2(NF, NK), reorderByFieldK: zeros2(NF, NK), evalByFieldK: zeros2(NF, NK),
  anyOutByField: zeros(NF),
  candidatesTotal: 0, executableTotal: 0, outOfFieldCandidatesByField: zeros(NF),
  stepWallMs: 0,
});

/* ========================================================================== */
/* §9 THE WALK — one match, pure reads of public engine state                  */
/* ========================================================================== */
const DIST_BIN_M = 5;
const distBinOf = (d: number): number => Math.min(7, Math.floor(d / DIST_BIN_M));
/** the seeing dot: ĥ·û with û the unit vector FROM the reader TOWARD the read body */
const seeingDot = (
  hx: number, hy: number, dx: number, dy: number, d: number,
): number => (d > 1e-9 ? (hx * dx + hy * dy) / d : 1);

/** a deep-enough copy of one truth frame for the ring buffer */
const copyTruth = (t: PerceptionTruth): PerceptionTruth => ({
  tick: t.tick,
  ball: {
    pos: { x: t.ball.pos.x, y: t.ball.pos.y },
    vel: { x: t.ball.vel.x, y: t.ball.vel.y },
    ownerGid: t.ball.ownerGid,
  },
  players: t.players.map((p) => ({
    gid: p.gid, side: p.side, sentOff: p.sentOff,
    pos: { x: p.pos.x, y: p.pos.y },
    vel: { x: p.vel.x, y: p.vel.y },
    bodyDir: { x: p.bodyDir.x, y: p.bodyDir.y },
  })),
});

/**
 * The ORACLE snapshot this census re-evaluates the chooser on. Built by hand rather than by
 * `oraclePerceptionSnapshot` because the counterfactual arm must REPLACE selected bodies'
 * pos/vel with a k-tick-old frame; the FRESH arm is byte-identical in construction to
 * `oraclePerceptionSnapshot`'s output (awareness 1, ageTicks 0, sentOff filtered), which the
 * `gOracleMatchesShipped` gate asserts against the shipped function on every walk.
 */
const buildOracleSnapshot = (
  truth: PerceptionTruth, observerGid: number, stale: ReadonlyMap<number, PerceptionTruth>,
): PerceptionSnapshot => ({
  tick: truth.tick,
  observerGid,
  awareness: 1,
  ball: {
    pos: { x: truth.ball.pos.x, y: truth.ball.pos.y },
    vel: { x: truth.ball.vel.x, y: truth.ball.vel.y },
    ownerGid: truth.ball.ownerGid,
    observedTick: truth.tick,
    ageTicks: 0,
  },
  players: truth.players.filter((p) => !p.sentOff).map((p) => {
    const old = stale.get(p.gid);
    const src = old === undefined ? p
      : (old.players.find((q) => q.gid === p.gid) ?? p);
    return {
      gid: p.gid,
      side: p.side,
      pos: { x: src.pos.x, y: src.pos.y },
      vel: { x: src.vel.x, y: src.vel.y },
      bodyDir: { x: src.bodyDir.x, y: src.bodyDir.y },
      observedTick: old === undefined ? truth.tick : old.tick,
      ageTicks: old === undefined ? 0 : truth.tick - old.tick,
    };
  }),
});

const walk = (seed: number): Row => {
  const m = buildMatch(seed);
  const row = emptyRow(seed);
  row.worldOk = Object.values(worldConjuncts(m)).every(Boolean);
  const players = m.allPlayers;
  const ring: (PerceptionTruth | null)[] = new Array<PerceptionTruth | null>(RING).fill(null);
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  const reachProfiles: Map<number, KnownReachProfile> = m.reachProfiles();
  const wall0 = Date.now();

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks++;
    const playing = m.phase === 'playing';
    if (!playing) {
      prevOwnerGid = m.ball.owner?.gid ?? null;
      continue;
    }
    row.playingTicks++;
    const truth = copyTruth(capturePerceptionTruth(m));
    ring[tick % RING] = truth;
    const ownerGid = m.ball.owner?.gid ?? null;
    const pending = (m as unknown as { pendingPass: { targetGid: number } | null }).pendingPass;
    const receiverGid = pending?.targetGid ?? null;
    const possessingSide = m.ball.owner?.side ?? m.ball.lastTouch?.side ?? null;

    /* ---------------- (d.1) THE STALENESS-OPPORTUNITY CENSUS ---------------- */
    if (tick % STRIDE === 0) {
      row.sampledTicks++;
      for (const reader of players) {
        if (reader.sentOff) continue;
        const situation: Situation = reader.gid === ownerGid ? 'carrier'
          : (receiverGid !== null && reader.gid === receiverGid ? 'receiver'
            : (possessingSide !== null && reader.side !== possessingSide ? 'defender'
              : 'supporter'));
        const si = SI[situation];
        const team = m.teams[reader.side];
        const opp = m.teams[1 - reader.side];
        const markIdx = team.marks.get(reader.index);
        const markGid = markIdx === undefined ? null : opp.players[markIdx]?.gid ?? null;
        const mateGids = new Set(passChoiceCandidateGids(reader, team.players));
        for (const read of players) {
          if (read.sentOff || read.gid === reader.gid) continue;
          const dx = read.pos.x - reader.pos.x;
          const dy = read.pos.y - reader.pos.y;
          const d = Math.hypot(dx, dy);
          const dot = seeingDot(reader.heading.x, reader.heading.y, dx, dy, d);
          const classes: ReadClass[] = [];
          if (read.side !== reader.side && situation === 'carrier') classes.push('chooserOpp');
          if (mateGids.has(read.gid) && situation === 'carrier') classes.push('chooserMate');
          if (markGid !== null && read.gid === markGid) classes.push('executorMark');
          if (ownerGid !== null && read.gid === ownerGid) classes.push('executorBall');
          if (read.side === reader.side) classes.push('executorTeammate');
          if (classes.length === 0) { row.physicsPairsExcluded++; continue; }
          row.pairDistBins[distBinOf(d)]++;
          if (d > (FIELD_CANDIDATES[4].rangeMetres ?? Number.POSITIVE_INFINITY)) {
            row.pairsBeyondIncumbentRange++;
          }
          for (const cls of classes) {
            const ci = RC[cls];
            row.pairsByClassSituation[ci][si]++;
            for (let fi = 0; fi < NF; fi++) {
              const f = FIELD_CANDIDATES[fi];
              const inAngle = dot >= f.dotMin;
              const inNear = f.nearFieldMetres !== null && d <= f.nearFieldMetres;
              const inRange = f.rangeMetres === null || d <= f.rangeMetres;
              const inField = inNear || (inAngle && inRange);
              if (!inField) row.outByFieldClassSituation[fi][ci][si]++;
            }
          }
        }
      }
    }

    /* ---------------- (d.2) THE COUNTERFACTUAL DOSE LADDER ---------------- */
    /** a RECEPTION MOMENT: ownership newly established, outfield body, open play */
    if (ownerGid !== null && ownerGid !== prevOwnerGid) {
      const p = players.find((q) => q.gid === ownerGid);
      if (p !== undefined && !p.sentOff && p.role !== 'GK') {
        row.receptionMoments++;
        const team = m.teams[p.side];
        const candidateGids = passChoiceCandidateGids(p, team.players);
        if (candidateGids.length > 0) {
          const fresh = choosePerceivedPassTarget({
            snapshot: buildOracleSnapshot(truth, p.gid, new Map()),
            passerGid: p.gid,
            candidateGids,
            attackDir: team.attackDir,
            reachProfiles,
            valueAxis: m.edsValueAxis,
          });
          if (fresh !== null) {
            row.ladderEvaluable++;
            row.candidatesTotal += fresh.options.length;
            row.executableTotal += fresh.options.filter((o) => o.executable).length;
            const freshOrder = fresh.options.map((o) => o.targetGid).join(',');
            const freshRanked = [...fresh.options]
              .sort((x, y) => (y.price - x.price) || (x.targetGid - y.targetGid))
              .map((o) => o.targetGid).join(',');
            for (let fi = 0; fi < NF; fi++) {
              const f = FIELD_CANDIDATES[fi];
              /* which bodies are OUT of this field, from the reader's own geometry */
              const outGids: number[] = [];
              for (const read of players) {
                if (read.sentOff || read.gid === p.gid) continue;
                const dx = read.pos.x - p.pos.x;
                const dy = read.pos.y - p.pos.y;
                const d = Math.hypot(dx, dy);
                const dot = seeingDot(p.heading.x, p.heading.y, dx, dy, d);
                const inNear = f.nearFieldMetres !== null && d <= f.nearFieldMetres;
                const inRange = f.rangeMetres === null || d <= f.rangeMetres;
                if (!(inNear || (dot >= f.dotMin && inRange))) outGids.push(read.gid);
              }
              const outCandidates = candidateGids.filter((g) => outGids.includes(g)).length;
              row.outOfFieldCandidatesByField[fi] += outCandidates;
              if (outGids.length > 0) row.anyOutByField[fi]++;
              for (let ki = 0; ki < NK; ki++) {
                const k = K_LADDER[ki];
                const oldFrame = ring[(tick - k + RING * 2) % RING];
                if (oldFrame === null || oldFrame.tick !== tick - k) continue;
                const stale = new Map<number, PerceptionTruth>();
                for (const g of outGids) stale.set(g, oldFrame);
                const degraded = choosePerceivedPassTarget({
                  snapshot: buildOracleSnapshot(truth, p.gid, stale),
                  passerGid: p.gid,
                  candidateGids,
                  attackDir: team.attackDir,
                  reachProfiles,
                  valueAxis: m.edsValueAxis,
                });
                row.evalByFieldK[fi][ki]++;
                if (degraded === null || degraded.targetGid !== fresh.targetGid) {
                  row.flipsByFieldK[fi][ki]++;
                }
                const degRanked = degraded === null ? '' : [...degraded.options]
                  .sort((x, y) => (y.price - x.price) || (x.targetGid - y.targetGid))
                  .map((o) => o.targetGid).join(',');
                if (degRanked !== freshRanked) row.reorderByFieldK[fi][ki]++;
                void freshOrder;
              }
            }
          }
        }
      }
    }
    prevOwnerGid = ownerGid;
  }
  row.stepWallMs = Date.now() - wall0;
  return row;
};

/* ========================================================================== */
/* §10 THE WORLD-CONSTRUCTION RECEIPT (its own booked seed, xxx,999)           */
/* ========================================================================== */
const BLOCK = 12_507_000;
const RECEIPT_SEED = BLOCK + 999;
const receiptMatch = buildMatch(RECEIPT_SEED);
const RECEIPT = worldConjuncts(receiptMatch);
const RECEIPT_OK = Object.values(RECEIPT).every(Boolean);
const STATIC_OK = EXTRACTS_OK && LADDER_OK && FIELDS_NESTED && O2_INVENTORY_OK
  && unmappedFiles.length === 0 && unknownReceivers.size === 0;
if (!RECEIPT_OK || !STATIC_OK) {
  banner(`IN-C0 FATAL — the world/constant/static class BIT. receipt=${JSON.stringify(RECEIPT)} `
    + `extracts=${EXTRACTS_OK} ${JSON.stringify(EXTRACT_CHECKS)} `
    + `ladder=${LADDER_OK} nested=${FIELDS_NESTED} `
    + `o2=${O2_INVENTORY_OK} unmapped=${JSON.stringify(unmappedFiles)} `
    + `unknownReceivers=${JSON.stringify([...unknownReceivers.keys()])}. Nothing is written.`);
  process.exit(3);
}

/* ========================================================================== */
/* §11 THE BATTERY — single arm, virgin seeds                                  */
/* ========================================================================== */
/**
 * ⭐ THE SIZE, WITH ITS REASON — THE RAREST PUBLISHED CELL GOVERNS, AND IT IS THE LADDER.
 * The dose ladder's denominator is RECEPTION MOMENTS with a non-empty candidate window.
 * R9's own `gkAcquisitionsPerMatch` family and BU-C0's reception census put ownership
 * establishments in the tens per match; at a conservative 40 evaluable reception moments per
 * match, N = 240 gives ≈ 9,600 chooser re-evaluations per (field × k) cell — 15 cells, each
 * with its own denominator, enough for a flip SHARE with an honest cluster CI. The staleness
 * census is far denser (≈ 2,400 sampled ticks × ~15 booked pairs per match) and is not the
 * binding cell. WALL: R9 measured ≈ 0.19 s per walk WITHOUT this census's per-sample
 * geometry and 15 extra chooser evaluations per reception; the smoke measures the real
 * per-walk cost and `battery.wallSeconds` publishes it against the 45 min ceiling.
 */
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 240 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
const SEEDS = Array.from({ length: N_SEEDS }, (_, i) => BLOCK + i);
const rows: Row[] = [];
let walksBooked = 1; // the world receipt above
banner(`IN-C0 census: mode=${MODE} N=${N_SEEDS} block=${BLOCK} stride=${STRIDE} `
  + `fields=${NF} k=[${K_LADDER.join(', ')}]`);
for (const seed of SEEDS) {
  rows.push(walk(seed));
  walksBooked++;
  if (rows.length % 20 === 0) {
    banner(`  … ${rows.length}/${N_SEEDS} seeds (${((Date.now() - t0Wall) / 1000).toFixed(0)} s)`);
  }
}

/* ========================================================================== */
/* §12 INSTRUMENT (e) — PERF SIZING (anchored measurement)                     */
/* ========================================================================== */
/**
 * THE ANCHOR: the per-tick wall cost of the SHIPPED step, measured on this battery's own
 * walks (`stepWallMs` per seed ÷ ticks). The CENSUS's own geometry is excluded from the
 * anchor by construction? — NO, and that is stated honestly: `stepWallMs` brackets the whole
 * walk loop INCLUDING this probe's sampling, so it is an UPPER bound on the engine's own
 * step cost, and the SNAPSHOT BOOKKEEPING bound below is measured SEPARATELY, in isolation,
 * on the same machine in the same process. Both numbers are published with what they are.
 */
const PERF_BODIES = 12;
const PERF_SEEN = 11;
const perfTicks = sum(rows.map((r) => r.ticks));
const perfWallMs = sum(rows.map((r) => r.stepWallMs));
const perfMsPerTickUpperBound = ratio(perfWallMs, perfTicks);
/** the isolated bookkeeping micro-measurement: 12 × 11 × NF field tests, TICKS_MICRO times */
const TICKS_MICRO = 20_000;
const microBuf = new Float64Array(PERF_BODIES * 4);
for (let i = 0; i < PERF_BODIES; i++) {
  microBuf[i * 4] = Math.cos(i); microBuf[i * 4 + 1] = Math.sin(i);
  microBuf[i * 4 + 2] = i * 3.1; microBuf[i * 4 + 3] = i * -2.7;
}
let microSink = 0;
const micro0 = Date.now();
for (let t = 0; t < TICKS_MICRO; t++) {
  for (let a = 0; a < PERF_BODIES; a++) {
    const hx = microBuf[a * 4]; const hy = microBuf[a * 4 + 1];
    const ax = microBuf[a * 4 + 2]; const ay = microBuf[a * 4 + 3];
    for (let b = 0; b < PERF_BODIES; b++) {
      if (b === a) continue;
      const dx = microBuf[b * 4 + 2] - ax + t * 1e-6;
      const dy = microBuf[b * 4 + 3] - ay;
      const d = Math.hypot(dx, dy);
      const dot = d > 1e-9 ? (hx * dx + hy * dy) / d : 1;
      for (let fi = 0; fi < NF; fi++) {
        if (dot >= FIELD_CANDIDATES[fi].dotMin) microSink++;
      }
    }
  }
}
const microMs = Date.now() - micro0;
const microMsPerTick = microMs / TICKS_MICRO;
const perfBookkeepingRecords = PERF_BODIES * PERF_SEEN;
const perfShareOfStep = ratio(microMsPerTick, perfMsPerTickUpperBound);

/* ========================================================================== */
/* §13 THE STATS-BASE REGISTRY — COMPLETED FIRST (#315 §CORR 4's ORDER)        */
/* ========================================================================== */
/**
 * ⭐⭐ THE ORDER, DISCHARGED BEFORE THE DISJOINTNESS CHECK IS EVALUATED (#315 item 4 /
 * §CORR 4): the registry of PUBLISHED stats bases is COMPLETED from a TREE-WIDE sweep, and
 * `gStatsDisjoint` checks against THE COMPLETED REGISTRY and SAYS SO.
 *
 * THE SWEEP, three sources unioned (method published in the artifact so it re-runs):
 *   (i)   R9's inherited registry (41 entries) — the previous state of record;
 *   (ii)  every committed artifact under `docs/world-model/data/*.json` whose own body
 *         declares a stats base at a key named `base` / `statsBase` / `seedBase`
 *         (`nextBaseAtLeast` and `publishedBasesCheckedAgainst` EXCLUDED — the former is a
 *         forward pointer, the latter a copy of this very registry);
 *   (iii) every `scripts/**` top-level `const …BASE… = <6-digit>` declaration (a probe's own
 *         base of record). MUTANT literals passed as arguments are NOT declarations and are
 *         correctly outside (iii); they were never published bases.
 *
 * ⭐ THE FINDING OF RECORD: R9's list was INCOMPLETE BY 15 ENTRIES. The completed registry
 * holds 56. Both the inherited list and the 15 additions are published so the completion is
 * auditable, and the gate reports WHICH registry it checked.
 */
const R9_INHERITED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_200, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600,
  111_800, 112_000, 112_200, 112_400, 112_600, 112_800, 113_000, 113_200, 113_400, 113_600,
  113_800,
];
const REGISTRY_ADDITIONS: readonly number[] = [
  102_200, 102_800, 103_200, 103_600, 103_800, 104_200, 104_600, 104_800, 105_200, 105_800,
  109_400, 109_600, 109_800, 110_000, 114_000,
];
const STATS_PUBLISHED_BASES: readonly number[] = [
  ...new Set([...R9_INHERITED_BASES, ...REGISTRY_ADDITIONS]),
].sort((a, b) => a - b);
const REGISTRY_COMPLETE = STATS_PUBLISHED_BASES.length
  === R9_INHERITED_BASES.length + REGISTRY_ADDITIONS.length
  && REGISTRY_ADDITIONS.every((b) => !R9_INHERITED_BASES.includes(b));

/* ========================================================================== */
/* §14 THE FACE TABLE — every published face is (numerator, denominator)      */
/* ========================================================================== */
interface FaceDef {
  num: (r: Row) => number;
  den: (r: Row) => number;
  unit: string;
  what: string;
  denNote?: string;
}
const pairsTotal = (r: Row): number => sum2(r.pairsByClassSituation);
const outTotal = (fi: number) => (r: Row): number => sum2(r.outByFieldClassSituation[fi]);
const pairsClass = (ci: number) => (r: Row): number => sum(r.pairsByClassSituation[ci]);
const outClass = (fi: number, ci: number) => (r: Row): number => sum(
  r.outByFieldClassSituation[fi][ci],
);
const pairsSit = (si: number) => (r: Row): number => sum(
  READ_CLASSES.map((_, ci) => r.pairsByClassSituation[ci][si]),
);
const outSit = (fi: number, si: number) => (r: Row): number => sum(
  READ_CLASSES.map((_, ci) => r.outByFieldClassSituation[fi][ci][si]),
);
const FACES: Record<string, FaceDef> = {};
for (let fi = 0; fi < NF; fi++) {
  const fk = FIELD_CANDIDATES[fi].key;
  FACES[`wouldBeStaleShare_${fk}_all`] = {
    num: outTotal(fi), den: pairsTotal, unit: 'share of sampled decision reads',
    what: `read pairs whose READ BODY is OUTSIDE ${fk}, over all booked read classes`,
    denNote: 'denominator = every booked (reader, read-body) pair at sampled ticks; the '
      + 'physics population is EXCLUDED by M-IN.1 and published as physicsPairsExcluded',
  };
  for (const cls of READ_CLASSES) {
    FACES[`wouldBeStaleShare_${fk}_${cls}`] = {
      num: outClass(fi, RC[cls]), den: pairsClass(RC[cls]),
      unit: 'share of sampled decision reads',
      what: `read pairs OUTSIDE ${fk}, read class ${cls}`,
    };
  }
  for (const sit of SITUATIONS) {
    FACES[`wouldBeStaleShare_${fk}_${sit}`] = {
      num: outSit(fi, SI[sit]), den: pairsSit(SI[sit]),
      unit: 'share of sampled decision reads',
      what: `read pairs OUTSIDE ${fk}, reader situation ${sit}`,
    };
  }
  for (let ki = 0; ki < NK; ki++) {
    FACES[`flipShare_${fk}_k${K_LADDER[ki]}`] = {
      num: (r) => r.flipsByFieldK[fi][ki], den: (r) => r.evalByFieldK[fi][ki],
      unit: 'share of re-evaluated choices',
      what: `pass-chooser ARGMAX flips when reads outside ${fk} freeze ${K_LADDER[ki]} ticks old`,
      denNote: 'denominator = reception-moment choices with a non-empty candidate window AND '
        + 'a full k-tick ring frame; identical across fields by construction',
    };
    FACES[`reorderShare_${fk}_k${K_LADDER[ki]}`] = {
      num: (r) => r.reorderByFieldK[fi][ki], den: (r) => r.evalByFieldK[fi][ki],
      unit: 'share of re-evaluated choices',
      what: `ranked-order changes under the same freeze (a superset of the flips)`,
    };
  }
  FACES[`anyCandidateOutOfFieldShare_${fk}`] = {
    num: (r) => r.anyOutByField[fi], den: (r) => r.ladderEvaluable,
    unit: 'share of reception-moment choices',
    what: `choices where at least one BODY is outside ${fk} (the could-flip population)`,
  };
  FACES[`outOfFieldCandidateShare_${fk}`] = {
    num: (r) => r.outOfFieldCandidatesByField[fi], den: (r) => r.candidatesTotal,
    unit: 'share of priced candidates',
    what: `priced pass candidates whose own body sits outside ${fk}`,
  };
}
FACES.receptionMomentsPerMatch = {
  num: (r) => r.receptionMoments, den: () => 1, unit: 'per match',
  what: 'ownership establishments by an outfield body in open play',
};
FACES.ladderEvaluablePerMatch = {
  num: (r) => r.ladderEvaluable, den: () => 1, unit: 'per match',
  what: 'reception moments the chooser could actually be re-evaluated at',
};
FACES.pairsBeyondIncumbentRangeShare = {
  num: (r) => r.pairsBeyondIncumbentRange, den: pairsTotal, unit: 'share of sampled reads',
  what: 'booked read pairs farther than the ONLY shipped range term (F5 incumbent)',
};
FACES.executableCandidateShare = {
  num: (r) => r.executableTotal, den: (r) => r.candidatesTotal,
  unit: 'share of priced candidates',
  what: 'candidates the FRESH oracle chooser rated executable',
};
const FACE_KEYS = Object.keys(FACES);

/* ========================================================================== */
/* §15 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds                     */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const STATS_BASE = 114_200;
const STATS_STEP = 200;
interface FaceRow {
  face: string; unit: string; what: string; denNote: string | null;
  point: number; num: number; den: number; ci95: [number, number]; halfWidth: number;
}
const pct = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
const scoreFaces = (): FaceRow[] => {
  const Kn = rows.length;
  const rng = new Rng(STATS_BASE);
  const draws: number[][] = [];
  for (let dI = 0; dI < BOOTSTRAP; dI++) {
    const idx: number[] = [];
    for (let i = 0; i < Kn; i++) idx.push(Math.floor(rng.next() * Kn) % Kn);
    draws.push(idx);
  }
  const out: FaceRow[] = [];
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const ns = rows.map((r) => f.num(r));
    const ds = rows.map((r) => f.den(r));
    const point = ratio(sum(ns), sum(ds));
    const vs: number[] = [];
    for (const idx of draws) {
      let n = 0; let d = 0;
      for (const i of idx) { n += ns[i]; d += ds[i]; }
      const v = ratio(n, d);
      if (Number.isFinite(v)) vs.push(v);
    }
    vs.sort((x, y) => x - y);
    const ci: [number, number] = [pct(vs, 0.025), pct(vs, 0.975)];
    out.push({
      face: key, unit: f.unit, what: f.what, denNote: f.denNote ?? null,
      point, num: sum(ns), den: sum(ds), ci95: ci, halfWidth: (ci[1] - ci[0]) / 2,
    });
  }
  return out;
};
const faces = scoreFaces();
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`IN-C0 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
};

/* ========================================================================== */
/* §16 THE GATES (frozen — a red gate is REPORTED, never patched)             */
/* ========================================================================== */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
const minStatsGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
const totalSites = sites.length;
const gates: Record<string, boolean> = {
  gWorld: RECEIPT_OK && rows.every((r) => r.worldOk),
  gDoseBytes: L3_DOSE.length > 0 && PC_DOSE.length > 0 && L3_BYTES_SHA.length === 64
    && PC_BYTES_SHA.length === 64,
  /** ⭐ canon: counts per needle AND every occurrence's site enumerated */
  gNeedleEnumeration: sum(NEEDLES.map((n) => needleCounts[n])) === totalSites
    && sites.every((s) => s.line > 0 && s.file.startsWith('src/'))
    && sum2(surfaceMatrix) === totalSites,
  gNoUnknownReceiver: unknownReceivers.size === 0,
  gNoUnmappedFile: unmappedFiles.length === 0,
  gNoUncapturedReceiver: uncapturedReceivers === 0,
  gAnchoredExtraction: EXTRACTS_OK,
  gFieldsNested: FIELDS_NESTED,
  gLadderDerived: LADDER_OK && K_LADDER.every((k) => k > 0 && k < RING),
  gO2Inventory: O2_INVENTORY_OK && RECEIPT.o2LookDormant,
  /** the census must actually have looked at something */
  gNonVacuous: sum(rows.map((r) => pairsTotal(r))) > 0
    && sum(rows.map((r) => r.ladderEvaluable)) > 0
    && sum(rows.map((r) => r.sampledTicks)) > 0
    && rows.length === N_SEEDS
    && interposeSites.length > 0,
  /** every (field × k) cell has a non-empty denominator, or the ladder is not measured */
  gLadderNonVacuous: FIELD_KEYS.every((_, fi) => K_LADDER
    .every((_k, ki) => sum(rows.map((r) => r.evalByFieldK[fi][ki])) > 0)),
  /** the ladder denominators agree across fields (the same choices, differently degraded) */
  gLadderDenominatorsAgree: (() => {
    for (let ki = 0; ki < NK; ki++) {
      const ref = sum(rows.map((r) => r.evalByFieldK[0][ki]));
      for (let fi = 1; fi < NF; fi++) {
        if (sum(rows.map((r) => r.evalByFieldK[fi][ki])) !== ref) return false;
      }
    }
    return true;
  })(),
  /**
   * ⭐ THE WIDER FIELD CANNOT STRAND MORE READS THAN THE TIGHTER ONE — nesting, MEASURED,
   * and SCOPED TO THE ANGLE-ONLY CANDIDATES F1–F4 for a stated structural reason: F5 carries a
   * RANGE term, so a body 40 m dead ahead is INSIDE every angle-only field and OUTSIDE F5. F5
   * is therefore NOT a superset of F4 by construction, and asserting it would be false. The
   * F5-vs-F4 relation is published as its own REPORTED observation
   * (`f5NotNestedBecauseItCarriesARange`), never as a gate.
   */
  gStalenessMonotoneInAngleOnlyFields: (() => {
    for (let fi = 1; fi < NF - 1; fi++) {
      for (let ci = 0; ci < READ_CLASSES.length; ci++) {
        for (let si = 0; si < SITUATIONS.length; si++) {
          const wide = sum(rows.map((r) => r.outByFieldClassSituation[fi][ci][si]));
          const tight = sum(rows.map((r) => r.outByFieldClassSituation[fi - 1][ci][si]));
          if (wide > tight) return false;
        }
      }
    }
    return true;
  })(),
  /** the partition: booked pairs + excluded physics pairs is the whole sampled cross-product */
  gPairPartition: rows.every((r) => sum(r.pairDistBins) <= pairsTotal(r) + r.physicsPairsExcluded
    && sum(r.pairDistBins) > 0),
  /** ⭐ the reorder population contains the flip population, by construction and in fact */
  gReorderContainsFlips: rows.every((r) => FIELD_KEYS.every((_, fi) => K_LADDER
    .every((_k, ki) => r.reorderByFieldK[fi][ki] >= r.flipsByFieldK[fi][ki]))),
  /** ⭐⭐ the registry ORDER discharged BEFORE disjointness is judged (#315 §CORR 4) */
  gRegistryComplete: REGISTRY_COMPLETE && STATS_PUBLISHED_BASES.length === 56,
  gStatsDisjoint: STATS_BASE >= 114_200 && minStatsGap >= STATS_STEP && REGISTRY_COMPLETE,
  gPerfAnchored: perfTicks > 0 && perfWallMs > 0 && microMs > 0
    && Number.isFinite(perfMsPerTickUpperBound) && Number.isFinite(microMsPerTick),
  gSrcUntouched: srcDiff === '' && srcStatus === '',
  gSeedsBookedEqualWalked: walksBooked === N_SEEDS + 1,
  gFaces: false, // set below, after the artifact is on disk
};

/* ========================================================================== */
/* §17 THE ARTIFACT                                                           */
/* ========================================================================== */
const BODY_SCHEMA = ['stage', 'definitions', 'world', 'seeds', 'stats', 'truthReadSurface',
  'visionAlgebra', 'o2LookInventory', 'stalenessCensus', 'doseLadder', 'perfSizing',
  'faces', 'perSeedCells', 'gates'] as const;

const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, worldOk: r.worldOk, ticks: r.ticks, playingTicks: r.playingTicks,
  sampledTicks: r.sampledTicks,
  pairsByClassSituation: r.pairsByClassSituation,
  outByFieldClassSituation: r.outByFieldClassSituation,
  physicsPairsExcluded: r.physicsPairsExcluded,
  pairDistBins: r.pairDistBins,
  pairsBeyondIncumbentRange: r.pairsBeyondIncumbentRange,
  receptionMoments: r.receptionMoments, ladderEvaluable: r.ladderEvaluable,
  flipsByFieldK: r.flipsByFieldK, reorderByFieldK: r.reorderByFieldK,
  evalByFieldK: r.evalByFieldK, anyOutByField: r.anyOutByField,
  candidatesTotal: r.candidatesTotal, executableTotal: r.executableTotal,
  outOfFieldCandidatesByField: r.outOfFieldCandidatesByField,
  stepWallMs: r.stepWallMs,
});

const truthReadSurface = {
  needlePrefixAlphabet: NEEDLE_PREFIX_ALPHABET,
  needlePrefixNote: 'the PREFIX is the receiver expression immediately left of the dot; the '
    + 'four needles are the four body-state fields a decision could read off another body',
  needles: NEEDLES,
  needleCounts,
  occurrencesEnumerated: totalSites,
  filesScanned: SRC_FILES.length,
  gradeOrder: GRADES,
  roleOrder: ROLES,
  /** grade × role occurrence matrix — the whole surface in one table */
  surfaceMatrix,
  /** ⭐⭐ THE VERDICT QUANTITY */
  interposeSiteCount: interposeSites.length,
  interposeFileCount: interposeFiles.length,
  interposeFiles,
  interposeByGrade: {
    chooser: interposeSites.filter((s) => s.grade === 'chooser').length,
    executor: interposeSites.filter((s) => s.grade === 'executor').length,
  },
  physicsOtherBodySitesStayTruth: physicsOtherSites.length,
  /** the gateway census: where a decision OBTAINS bodies at all */
  gatewayNeedles: GATEWAY_NEEDLES,
  gatewayCounts,
  gatewayDistinctTokens: Object.keys(gatewayCounts).length,
  gatewaySiteCount: gatewaySites.length,
  gatewaySites,
  /** EVERY occurrence's site, as canon requires */
  sites: sites.map((s) => `${s.file}:${s.line}:${s.receiver}.${s.needle}:${s.role}:${s.grade}`),
  uncapturedReceivers,
  uncapturedSites,
  receiverLexicon: RECEIVER_LEXICON,
  fileGradeMap: FILE_GRADE,
  dirGradeMap: DIR_GRADE,
};

const visionAlgebra = {
  shippedBlindForm: '(1 + heading·direction) / 2',
  seeingFormRead: 's = 1 − blind = (1 + heading·(unit vector toward the body)) / 2',
  blindRollSites: [CONTACT_FORM, DEFLECT_FORM, UNSET_FORM],
  pens: { contact: CONTACT_PEN, deflect: DEFLECT_PEN },
  turnRate: TURN_RATE,
  bkConeTicks: BK_CONE_TICKS,
  bkConeRad: BK_CONE_RAD,
  bkConeDeg: (BK_CONE_RAD * 180) / Math.PI,
  o2LookTicks: O2_LOOK_TICKS,
  incumbentCone: INCUMBENT_CONE,
  incumbentConeCoefficients: INCUMBENT_CONE_AW,
  incumbentRange: INCUMBENT_RANGE,
  incumbentRangeCoefficients: INCUMBENT_RANGE_SLOPE,
  incumbentNearField: INCUMBENT_NEARFIELD,
  shippedScanInterval: SCAN_INTERVAL,
  shippedScanIntervalCoefficients: SCAN_INTERVAL_SLOPE,
  fastestShippedScanTicks: FASTEST_SCAN_TICKS,
  awarenessAssumed: AW,
  candidates: FIELD_CANDIDATES.map((f) => ({
    ...f, halfAngleDeg: round(f.halfAngleDeg, 4), dotMin: round(f.dotMin, 6),
  })),
  candidatesAreNested: FIELDS_NESTED,
  candidatesAreNestedNote: 'NESTED IN ANGLE ONLY: dotMin falls strictly from F1 to F5, so the '
    + 'angular half-angles widen monotonically. ⚠ F5 is NOT a set-superset of F4 because it '
    + 'carries a RANGE term the angle-only fields do not: a body 40 m dead ahead is inside '
    + 'every angle-only field and OUTSIDE F5. The size of that population is the published '
    + 'face `pairsBeyondIncumbentRangeShare`; the monotonicity GATE is scoped to F1–F4 for '
    + 'exactly this reason (`gStalenessMonotoneInAngleOnlyFields`).',
  f5NotNestedBecauseItCarriesARange: true,
  honestLimit: 'the blind algebra prices FACING and nothing else — it carries NO distance '
    + 'term, so F1–F4 are ANGLE-ONLY fields. The only shipped RANGE (18 + awareness·22 m, '
    + 'plus a 4 m felt/heard near field) lives in the INCUMBENT cone F5, which is NOT '
    + 'derived from the blind algebra and is published as the taste-labelled contrast arm.',
};

const o2LookInventory = {
  needles: O2_NEEDLES,
  counts: o2Counts,
  countsTotal: o2CountsTotal,
  sites: o2Sites,
  whatALookIsToday: 'O2_LOOK_TICKS = 11 ticks (round(C7_W_CAP · 60), the certified wind-up '
    + 'ceiling) during which the body PLANTS (the re-decide lock in decidePlayer holds his '
    + 'Dribble label), does not act, and ONE extra scan MOMENT is recorded per tick through '
    + 'the EXISTING recorder (armO2Look records the first, stepO2Look one per tick). It '
    + 'opens NO new information channel: visibleDistance\'s cone is applied unchanged when '
    + 'the frames are replayed, so what his heading does not cover stays uncovered.',
  pins: 'o2LookEligible = the C5-T2 whether fork predicate + owns the ball + no stacked look; '
    + 'o2LookDecision is BORN INCUMBENT-EQUIVALENT (forcedLook is the ONLY way to take a '
    + 'look and is null in every production path); o2LookLedger counts looks / scans / '
    + 'completed / abortedLoss / abortedPhase.',
  dormantInWorldNine: RECEIPT.o2LookDormant,
  namedDebts: [
    'THE ARMING-LIFECYCLE DEBT (ruling #265-era, CB-T2 §named debt): "worlds arming '
      + 'o2Look/ekHoldVeto alongside must prove the lifecycle first" — it falls due IN THIS '
      + 'ARC if slice 2 extends the seam (contract M-IN.2).',
    'THE F-O2a STOP (ruling #222 item 3): the O2-T1 wedge exam FIRED the pre-named STOP — '
      + 'the look demonstrably REFRESHES (E-ABSTAIN-UNSEEN −6.30 pp RESOLVED, 9,600 '
      + 'completed 11-tick looks) and the HOLD classification does not move. The seam is '
      + 'BANKED-DORMANT on its own evidence, not on neglect.',
  ],
  extendVsNewMaterial: 'WHAT THE SEAM ALREADY HAS: an eligibility predicate on the right '
    + 'population, a time price from the traced wind-up family, a re-decide lock, a '
    + 'lifecycle with abort channels, a ledger, and a refresh mechanism that is ALREADY a '
    + 'scan-cadence change through the recorder. WHAT IT LACKS FOR SLICE 2: (i) the look '
    + 'does not TURN — it refreshes what the heading already covers, so under a vision '
    + 'field it would buy freshness on bodies he can already see and NOTHING on the ones he '
    + 'cannot; (ii) forcedLook is an instrument channel, not a chooser; (iii) its consumer '
    + 'was the whether-seat, and #222 proved that consumer does not move.',
};

const stalenessCensus = {
  strideTicks: STRIDE,
  strideDerivation: 'the fastest interval the SHIPPED perception trunk ever scans at, '
    + `round(${SCAN_INTERVAL_SLOPE?.base} − awareness · ${SCAN_INTERVAL_SLOPE?.slope}) at `
    + `awareness = 1 = ${FASTEST_SCAN_TICKS} ticks`,
  readClasses: READ_CLASSES,
  readClassNotes: {
    chooserOpp: 'the CARRIER\'s chooser scans EVERY opponent (opennessOf / laneOpenness / '
      + 'pressureAt / effectiveBlockers all take `opp.players` whole).',
    chooserMate: 'the CARRIER\'s pass-candidate window — the engine\'s own '
      + 'passChoiceCandidateGids band over `team.players`, CALLED not copied.',
    executorMark: 'the reader\'s marking assignment out of `Team.marks`.',
    executorBall: 'the current carrier — the executor\'s chase/press target.',
    executorTeammate: '⚠ AN EXPLICIT UPPER BOUND: all of the reader\'s on-pitch teammates, '
      + 'booked because the enumerated executor sites read teammate bodies by alias without '
      + 'the census resolving which one per site. OVER-COUNTS by construction.',
  },
  offBallChooserIsAlreadySnapshotBased: 'PRE-FREEZE CORRECTION OF RECORD, from code facts: '
    + 'offBallAffordance builds its context from `snapshot.players.filter(...)` and '
    + 'stationEye\'s perceivedContext likewise — an off-ball body\'s opponent reads are '
    + 'ALREADY percept reads, which is why chooserOpp/chooserMate are scoped to the carrier.',
  situations: SITUATIONS,
  fieldOrder: FIELD_KEYS,
  pairsBooked: sum(rows.map((r) => pairsTotal(r))),
  physicsPairsExcluded: sum(rows.map((r) => r.physicsPairsExcluded)),
  physicsExclusionAuthority: 'M-IN.1 VERBATIM: "PHYSICS STAYS TRUTH: contact/collision/'
    + 'capture read the world (a body you do not see still blocks you)".',
  pairsByClassSituation: (() => {
    const acc = zeros2(READ_CLASSES.length, SITUATIONS.length);
    for (const r of rows) addInto2(acc, r.pairsByClassSituation);
    return acc;
  })(),
  outByFieldClassSituation: FIELD_KEYS.map((_, fi) => {
    const acc = zeros2(READ_CLASSES.length, SITUATIONS.length);
    for (const r of rows) addInto2(acc, r.outByFieldClassSituation[fi]);
    return acc;
  }),
  pairDistBinMetres: DIST_BIN_M,
  pairDistBins: (() => {
    const acc = zeros(8);
    for (const r of rows) addInto(acc, r.pairDistBins);
    return acc;
  })(),
};

const doseLadder = {
  kTicks: K_LADDER,
  kDerivation: `{${FASTEST_SCAN_TICKS} = the fastest SHIPPED scan interval, `
    + `${PC_TIER_SIMPLE_TICKS} = PC_TIER_SIMPLE_TICKS (slice 1's SIMPLE tier, 0.20 sim-s), `
    + `${PC_TIER_CHOICE_TICKS} = PC_TIER_CHOICE_TICKS (slice 1's CHOICE tier, 0.45 sim-s)} — `
    + 'every rung a number the world already ships',
  subsetReEvaluated: 'the pass chooser\'s ranked candidates at RECEPTION MOMENTS (the tick a '
    + 'non-GK body newly establishes ownership in open play), pre-registered before the '
    + 'battery. The candidate window is the engine\'s own passChoiceCandidateGids '
    + `(${PASS_CHOICE_MIN_METRES}–${PASS_CHOICE_MAX_METRES} m), CALLED not copied; the `
    + 'chooser is the engine\'s own choosePerceivedPassTarget, CALLED not copied; the '
    + 'snapshot is the documented OFFLINE ORACLE path (full truth, awareness 1), with '
    + 'out-of-field bodies\' pos/vel/bodyDir replaced by a k-tick-old frame.',
  grain: 'CENSUS-GRAIN COUNTERFACTUAL: oracle re-evaluation only. No live seam is armed, no '
    + 'engine tick is altered, nothing is written back into the match.',
  flipsByFieldK: FIELD_KEYS.map((_, fi) => K_LADDER.map((_k, ki) => sum(
    rows.map((r) => r.flipsByFieldK[fi][ki]),
  ))),
  reorderByFieldK: FIELD_KEYS.map((_, fi) => K_LADDER.map((_k, ki) => sum(
    rows.map((r) => r.reorderByFieldK[fi][ki]),
  ))),
  evalByFieldK: FIELD_KEYS.map((_, fi) => K_LADDER.map((_k, ki) => sum(
    rows.map((r) => r.evalByFieldK[fi][ki]),
  ))),
  anyOutByField: FIELD_KEYS.map((_, fi) => sum(rows.map((r) => r.anyOutByField[fi]))),
};

const perfSizing = {
  bodies: PERF_BODIES,
  seenPerBody: PERF_SEEN,
  fieldCandidates: NF,
  bookkeepingRecordsPerTick: perfBookkeepingRecords,
  bookkeepingFieldTestsPerTick: PERF_BODIES * PERF_SEEN * NF,
  anchorTicks: perfTicks,
  anchorWallMs: perfWallMs,
  msPerTickUpperBound: round(perfMsPerTickUpperBound, 9),
  msPerTickUpperBoundNote: 'stepWallMs brackets the WHOLE walk loop including this probe\'s '
    + 'own sampling and up to 15 extra chooser evaluations per reception moment, so it is an '
    + 'UPPER BOUND on the engine\'s own step cost, never the engine\'s cost itself. The '
    + 'shipped perf baseline (scripts/perf-baseline.ts) remains the authority for that.',
  microTicks: TICKS_MICRO,
  microWallMs: microMs,
  microMsPerTick: round(microMsPerTick, 9),
  microNote: 'the ISOLATED bookkeeping cost: 12 bodies × 11 seen × '
    + `${NF} field tests per tick (hypot + dot + ${NF} comparisons per pair), measured in `
    + 'this same process on this same machine.',
  bookkeepingShareOfStepUpperBound: round(perfShareOfStep, 6),
  microSinkGuard: microSink > 0,
};

const artifact: Record<string, unknown> = {
  stage: 'IN-C0 — THE PERCEPTION-SURFACE CENSUS',
  definitions: {
    authority: 'IN-SNAPSHOT-CONTRACT.md §3 IN-C0 (a)–(e); dispatched by ruling #316 item 2.',
    instrumentOnly: 'src/** is untouched; no seam is armed, dosed or edited.',
    noScoredHypothesis: '⭐ THIS STAGE SCORES NOTHING. Every face is REPORTED. The gates are '
      + 'instrument-integrity gates only; no football claim passes or fails here.',
    arm: 'SINGLE ARM — the WORLD-9 composition (a4MatchFlags(8) + armA4World with the matured '
      + 'L3/PC doses + bkFacingLaw + bkContactLaw). This census has no armed arm; the dose '
      + 'ladder is ORACLE-side.',
    clockNote: `the match clock is ${MATCH_DURATION} s; per-match faces are per WALKED match `
      + '(the per-seed `ticks` are stored so any exact-clock normalisation re-derives).',
    matchDurationSeconds: MATCH_DURATION,
    dtSeconds: DT,
  },
  world: {
    version: BK_WORLD_VERSION,
    substrate: PC_WORLD,
    receiptSeed: RECEIPT_SEED,
    receiptConjuncts: RECEIPT,
    everyWalkedMatchConformed: rows.every((r) => r.worldOk),
    l3DoseFileBytesSha256: L3_BYTES_SHA,
    pcDoseFileBytesSha256: PC_BYTES_SHA,
    l3DoseLungesTotal: L3_DOSE_LUNGES,
    pcDoseExposuresTotal: PC_DOSE_EXPOSURES,
  },
  seeds: {
    block: BLOCK,
    batteryFirst: SEEDS[0],
    batteryLast: SEEDS[SEEDS.length - 1],
    seedsWalked: N_SEEDS,
    receiptSeed: RECEIPT_SEED,
    walksBooked,
    smokePrefix: [BLOCK, BLOCK + 1, BLOCK + 2],
    bookedEqualsWalked: walksBooked === N_SEEDS + 1,
  },
  stats: {
    base: STATS_BASE,
    step: STATS_STEP,
    resamples: BOOTSTRAP,
    estimator: 'CLUSTER bootstrap by match seed, percentile 95 % CIs; ONE resample-index '
      + 'matrix draws every face',
    registryCompletionOrder: '#315 item 4 / §CORR 4 — DISCHARGED HERE, BEFORE the '
      + 'disjointness check was evaluated.',
    registryCompletionMethod: 'union of (i) R9\'s inherited 41-entry list, (ii) every '
      + 'committed docs/world-model/data/*.json stats base at a key named base/statsBase/'
      + 'seedBase (nextBaseAtLeast and publishedBasesCheckedAgainst EXCLUDED), (iii) every '
      + 'scripts/** top-level `const …BASE… = <6 digits>` declaration.',
    inheritedBases: R9_INHERITED_BASES,
    registryAdditions: REGISTRY_ADDITIONS,
    publishedBasesCheckedAgainst: STATS_PUBLISHED_BASES,
    registryEntries: STATS_PUBLISHED_BASES.length,
    registryWasIncompleteBy: REGISTRY_ADDITIONS.length,
    checkedAgainstTheCompletedRegistry: true,
    minimumGapToAnyPublishedBase: minStatsGap,
    drawsTaken: 1,
    nextBaseAtLeast: STATS_BASE + STATS_STEP,
  },
  truthReadSurface,
  visionAlgebra,
  o2LookInventory,
  stalenessCensus,
  doseLadder,
  perfSizing,
  faces,
  perSeedCells: rows.map(cellOf),
  gates,
  instrumentSha256: sha(readFileSync(new URL(import.meta.url).pathname, 'utf8')),
  headCommit: gitOut('git rev-parse HEAD'),
  battery: {
    matches: rows.length,
    ticksTotal: sum(rows.map((r) => r.ticks)),
    wallSeconds: round((Date.now() - t0Wall) / 1000, 1),
  },
};

writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ---- gFaces: re-derive EVERY published face by RE-PARSING the artifact off disk ---- */
const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as {
  faces: FaceRow[];
  perSeedCells: Record<string, unknown>[];
  stalenessCensus: { pairsByClassSituation: number[][]; outByFieldClassSituation: number[][][];
    pairDistBins: number[] };
  doseLadder: { flipsByFieldK: number[][]; reorderByFieldK: number[][];
    evalByFieldK: number[][]; anyOutByField: number[] };
};
const diskCells = onDisk.perSeedCells.map((c) => c as unknown as Row);
const asNum = (v: unknown): number => (v === null || v === undefined ? Number.NaN : Number(v));
const eq = (av: unknown, bv: unknown): boolean => {
  const a = asNum(av); const b = asNum(bv);
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.isNaN(a) && Number.isNaN(b);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
  return Math.abs(a - b) < 1e-9;
};
let faceChecks = 0;
let faceOk = 0;
const faceFailures: string[] = [];
for (const fr of onDisk.faces) {
  const def = FACES[fr.face];
  const n = sum(diskCells.map((r) => def.num(r)));
  const d = sum(diskCells.map((r) => def.den(r)));
  faceChecks += 3;
  if (eq(fr.num, n)) faceOk++; else faceFailures.push(`${fr.face}.num`);
  if (eq(fr.den, d)) faceOk++; else faceFailures.push(`${fr.face}.den`);
  if (eq(fr.point, ratio(n, d))) faceOk++; else faceFailures.push(`${fr.face}.point`);
}
/** every stored-bin / stored-matrix face re-derives from the per-seed cells on disk */
const binResults: [string, boolean][] = [
  ['stalenessCensus.pairsByClassSituation', (() => {
    const acc = zeros2(READ_CLASSES.length, SITUATIONS.length);
    for (const r of diskCells) addInto2(acc, r.pairsByClassSituation);
    return acc.every((rw, i) => rw.every((v, j) => v === onDisk.stalenessCensus
      .pairsByClassSituation[i][j]));
  })()],
  ['stalenessCensus.outByFieldClassSituation', (() => {
    for (let fi = 0; fi < NF; fi++) {
      const acc = zeros2(READ_CLASSES.length, SITUATIONS.length);
      for (const r of diskCells) addInto2(acc, r.outByFieldClassSituation[fi]);
      const stored = onDisk.stalenessCensus.outByFieldClassSituation[fi];
      if (!acc.every((rw, i) => rw.every((v, j) => v === stored[i][j]))) return false;
    }
    return true;
  })()],
  ['stalenessCensus.pairDistBins', (() => {
    const acc = zeros(8);
    for (const r of diskCells) addInto(acc, r.pairDistBins);
    return acc.every((v, i) => v === onDisk.stalenessCensus.pairDistBins[i]);
  })()],
  ['doseLadder.flipsByFieldK', (() => {
    const acc = zeros2(NF, NK);
    for (const r of diskCells) addInto2(acc, r.flipsByFieldK);
    return acc.every((rw, i) => rw.every((v, j) => v === onDisk.doseLadder.flipsByFieldK[i][j]));
  })()],
  ['doseLadder.reorderByFieldK', (() => {
    const acc = zeros2(NF, NK);
    for (const r of diskCells) addInto2(acc, r.reorderByFieldK);
    return acc.every((rw, i) => rw.every((v, j) => v === onDisk.doseLadder
      .reorderByFieldK[i][j]));
  })()],
  ['doseLadder.evalByFieldK', (() => {
    const acc = zeros2(NF, NK);
    for (const r of diskCells) addInto2(acc, r.evalByFieldK);
    return acc.every((rw, i) => rw.every((v, j) => v === onDisk.doseLadder.evalByFieldK[i][j]));
  })()],
  ['doseLadder.anyOutByField', (() => {
    const acc = zeros(NF);
    for (const r of diskCells) addInto(acc, r.anyOutByField);
    return acc.every((v, i) => v === onDisk.doseLadder.anyOutByField[i]);
  })()],
];
const binFailures = binResults.filter(([, v]) => !v).map(([k]) => k);
gates.gFaces = faceOk === faceChecks && binFailures.length === 0;
(artifact as { gates: Record<string, boolean> }).gates = gates;
(artifact as { faceCoverage: unknown }).faceCoverage = {
  publishedFaces: FACE_KEYS.length,
  checksRun: faceChecks,
  checksPassed: faceOk,
  binChecksRun: binResults.length,
  binFailures,
  failures: faceFailures,
};
/** the ALLOWLIST-SCHEMA hashed body, computed LAST so it covers the final gate values */
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
(artifact as { hashedBodySha256: string }).hashedBodySha256 = sha(canonical(body));
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
banner('');
banner('=== IN-C0 — THE PERCEPTION-SURFACE CENSUS ===');
banner(`artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
banner('--- (a) THE TRUTH-READ SURFACE ---');
banner(`  needles: ${NEEDLES.map((n) => `${n}=${needleCounts[n]}`).join(' · ')} `
  + `(total ${totalSites} occurrences, ${SRC_FILES.length} files)`);
banner(`  ⭐ INTERPOSE SITES (other-body truth, chooser+executor) = ${interposeSites.length} `
  + `across ${interposeFiles.length} files `
  + `(chooser ${truthReadSurface.interposeByGrade.chooser} · `
  + `executor ${truthReadSurface.interposeByGrade.executor})`);
banner(`  physics other-body sites (STAY TRUTH by M-IN.1) = ${physicsOtherSites.length}`);
banner(`  gateway tokens = ${Object.keys(gatewayCounts).length}, `
  + `${gatewaySites.length} sites: ${JSON.stringify(gatewayCounts)}`);
banner('--- (b) THE VISION-ALGEBRA CANDIDATES ---');
for (const f of FIELD_CANDIDATES) {
  banner(`  ${f.key}: half-angle ${round(f.halfAngleDeg, 2)}° dotMin ${round(f.dotMin, 4)} `
    + `range ${f.rangeMetres === null ? 'none' : round(f.rangeMetres, 2)} `
    + `derived=${f.derivedFromBlindAlgebra}`);
}
banner('--- (c) THE o2Look INVENTORY ---');
banner(`  needle total ${o2CountsTotal} · dormant in world 9 = ${RECEIPT.o2LookDormant}`);
banner('--- (d) THE STALENESS-OPPORTUNITY CENSUS ---');
const show = (k: string): string => {
  const f = face(k);
  return `${k}: ${round(f.point, 6)} CI[${round(f.ci95[0], 6)}, ${round(f.ci95[1], 6)}] `
    + `n=${f.num}/${f.den}`;
};
for (const f of FIELD_CANDIDATES) banner(`  ${show(`wouldBeStaleShare_${f.key}_all`)}`);
for (const f of FIELD_CANDIDATES) {
  for (const cls of READ_CLASSES) banner(`    ${show(`wouldBeStaleShare_${f.key}_${cls}`)}`);
}
for (const f of FIELD_CANDIDATES) {
  for (const sit of SITUATIONS) banner(`    ${show(`wouldBeStaleShare_${f.key}_${sit}`)}`);
}
banner('--- THE COUNTERFACTUAL DOSE LADDER (flips) ---');
for (const f of FIELD_CANDIDATES) {
  for (const k of K_LADDER) banner(`  ${show(`flipShare_${f.key}_k${k}`)}`);
}
banner('--- the reorder superset ---');
for (const f of FIELD_CANDIDATES) {
  for (const k of K_LADDER) banner(`  ${show(`reorderShare_${f.key}_k${k}`)}`);
}
banner('--- context ---');
for (const k of ['receptionMomentsPerMatch', 'ladderEvaluablePerMatch',
  'executableCandidateShare', 'pairsBeyondIncumbentRangeShare']) banner(`  ${show(k)}`);
for (const f of FIELD_CANDIDATES) {
  banner(`  ${show(`anyCandidateOutOfFieldShare_${f.key}`)}`);
  banner(`  ${show(`outOfFieldCandidateShare_${f.key}`)}`);
}
banner('--- (e) PERF SIZING ---');
banner(`  bookkeeping ${perfBookkeepingRecords} records/tick · `
  + `${PERF_BODIES * PERF_SEEN * NF} field tests/tick · `
  + `isolated ${round(microMsPerTick, 6)} ms/tick vs step upper bound `
  + `${round(perfMsPerTickUpperBound, 6)} ms/tick ⇒ share ≤ ${round(perfShareOfStep, 4)}`);
banner('--- stats registry ---');
banner(`  COMPLETED registry = ${STATS_PUBLISHED_BASES.length} entries `
  + `(R9 had ${R9_INHERITED_BASES.length}; +${REGISTRY_ADDITIONS.length} found). `
  + `base ${STATS_BASE}, min gap ${minStatsGap}`);
banner(`walks booked = walked: ${walksBooked}  ·  wall ${round((Date.now() - t0Wall) / 1000, 1)} s`);
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
if (red.length > 0) banner(`RED GATES: ${red.join(', ')} — REPORTED, NEVER PATCHED`);
process.exit(red.length > 0 ? 1 : 0);
