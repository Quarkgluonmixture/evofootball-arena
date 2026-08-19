/**
 * ⭐⭐ R9 — THE POSSESSION-CHAIN LEDGER (docs/world-model/R9-POSSESSION-CHAIN-LEDGER.md).
 *
 * Authorized by ruling #314 item 3 for EXACTLY this stage. INSTRUMENT-ONLY: `src/**` is
 * untouched — nothing here arms, doses or edits a seam. There is NO SCORED HYPOTHESIS: this is
 * a DIAGNOSTIC LEDGER whose whole job is to answer ONE question of record (#309 item 3(ii)):
 *
 *   BK-T2 §R3 measured `bounceBackWithin240PerGkRelease` RISING from 0.089479 (base) to
 *   0.131738 (armed) — 弹回门将 +47 % relative, CI [+0.023047, +0.060698] strictly above zero,
 *   |Δ|÷half-width 2.245 — and COULD NOT SAY WHY, because BK-C0 §DOUBTS 4's instrument gap puts
 *   a save-and-regather and a punt that came home in the SAME CELL.
 *
 * This probe DECOMPOSES that face by RELEASE KIND × RETURN PATH on paired virgin seeds, with
 * the BK-C0 §CORR 2 censoring lesson built in from birth (the record retires at 720 ticks =
 * 3 × the window of record, and the FULL 73×10-tick gap histogram is stored per class).
 *
 *   BASE  = the world-8 composition  (a4MatchFlags(8) + armA4World with the MATURED L3/PC
 *           doses, both dose FILES hashed AS BYTES before they are parsed) — BK-T2's own
 *           construction, reused EXACTLY.
 *   ARMED = BASE + `bkFacingLaw: true` + `bkContactLaw: true`
 *   PAIRED: every seed is walked TWICE, once per arm.
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
 *   · "a field carries the unit its name claims".   HOME: ruling #294 item 3.
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
 *     face".  HOME: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4.
 *   · "a starred finding states its |Δ| ÷ half-width ratio".  HOME:
 *     BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2.
 *   · moving denominators disclosed per face; prefer the denominator-stable form.  HOME:
 *     PW-C0-WEIGHT-PHYSICS-CENSUS.md §COMMANDER CORRECTIONS item 2. (paraphrase)
 *   · "a src-extracted constant pins its extraction to the NAMED call site — anchored match +
 *     line receipt — never first-occurrence".  HOME: BK-C0-BODYBALL-CENSUS.md §COMMANDER
 *     CORRECTIONS item 1 (ruling #306 item 4).
 *   · "a dose-source guard should hash the bytes it reads, not a self-declared field".
 *     HOME: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6.
 *   · seed discipline — BOOKED = WALKED; blocks consumed whole; stats floors step ≥ 200 on
 *     the lattice.  HOME: the standing frontier practice. (paraphrase)
 *   · clock honesty — every rate on the 240 s match clock; APPLIED never nominal.
 *     HOMES: ruling #280.2(iii) + PC-T2 §CORR item 3. (paraphrase)
 *
 * ⭐ WHAT IS INHERITED, NOT INVENTED:
 *   · the WORLD and the PAIRED-ARM idiom — BK-T2's `buildMatch` / `worldConjuncts`, byte-equal
 *     in construction (a4MatchFlags(8) + armA4World with the same two dose FILES, hashed).
 *   · the GK RELEASE CHANNELS — BK-C0 §2(c) VERBATIM: punt (= LoftedPass while gkDistributing)
 *     · throwOut · gkShortPass · gkClearance · gkOther, off the engine's own stat signatures,
 *     open play only (phase === 'playing' at the release tick), exactly as BK-T2 walked them.
 *   · the BOUNCE-BACK FACE — BK-T2's own definition, reused expression-for-expression, so the
 *     decomposition partitions THE FACE OF RECORD and not a lookalike.
 *   · the WINDOW OF RECORD — 240 ticks, read off the COMMITTED BK-C0 artifact's own
 *     `definitions.bounceBackWindowTicks` (bytes hashed first), never re-derived by regex.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: R9_MODE (smoke|full, REQUIRED) · R9_N · R9_OUT.
 *   ANY other `R9_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: R9_MODE=full npx tsx scripts/probes/r9-possession-chain-ledger.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) · 2 = a refusal ·
 *       3 = the world/dose/constant construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION } from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { PC_BOOK_CELLS } from '../../src/ai/pcLatency';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)      */
/* ========================================================================== */
const ENV_WHITELIST = ['R9_MODE', 'R9_N', 'R9_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('R9_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('R9 FATAL — refused env surface. '
    + `rogue R9_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.R9_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`R9 FATAL — R9_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.R9_N !== undefined ? Number(process.env.R9_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1 || N_ENV > 999)) {
  banner('R9 FATAL — R9_N must be an integer in [1, 999] (the block holds 1000 seeds, one of '
    + 'which is the world-construction receipt).');
  process.exit(2);
}
const OUT_ENV = process.env.R9_OUT;
const PREFLIGHT_REASONS = [
  ...(MODE === 'smoke' ? ['mode=smoke'] : []),
  ...(N_ENV !== undefined ? ['R9_N set'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/r9-possession-chain-ledger.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/r9-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === pathResolve(CANONICAL_OUT) || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
if (IS_PREFLIGHT && isCanonical(OUT_PATH)) {
  banner(`R9 FATAL — an OVERRIDE run (${PREFLIGHT_REASONS.join(', ')}) may not write a `
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
const sum2 = (m: readonly (readonly number[])[]): number => sum(m.map((r) => sum(r)));
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
/** canonical JSON for the ALLOWLIST-SCHEMA hashed body */
const canonical = (v: unknown): string => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`).join(',')}}`;
};
/** the median of a stored histogram, in TICKS (lower edge of the containing bin) */
const medianFromBins = (bins: readonly number[], binTicks: number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc >= total / 2) return i * binTicks;
  }
  return (bins.length - 1) * binTicks;
};

/* ========================================================================== */
/* §2 TRACED CONSTANTS — anchored at their NAMED call sites (#306 item 4)      */
/* ========================================================================== */
const MECH_SRC = readFileSync('src/sim/mechanics.ts', 'utf8');
/**
 * ⭐⭐ THE KEEPER'S OWN LOFT CAP — BK-C0 §COMMANDER CORRECTIONS item 1 named it "the arguably-
 * correct source for any future re-derivation" (1.5 s, mechanics.ts:655). CANON, VERBATIM:
 * "a src-extracted constant pins its extraction to the NAMED call site — anchored match + line
 * receipt — never first-occurrence" — so the extraction is SCOPED to the body of the NAMED
 * `performKeeperThrow` declaration before `loftKick(` is matched at all, and tMax is taken as
 * the 7th POSITIONAL argument of loftKick's declared signature (match, p, target, tBase, tPerM,
 * tMin, tMax, noiseMul, spin?). Four loftKick callers exist (performThroughBall's dink 2.0 ·
 * performCross 1.7 · the KEEPER's own throw 1.5 · performLoftedPass 2.1); the unanchored regex
 * that took the FIRST is exactly what #306 struck.
 *
 * ⚠ IT IS PUBLISHED, NOT USED AS THE WINDOW OF RECORD. The face this stage decomposes is
 * BK-T2's, whose window is 240 ticks; re-deriving a different window here would decompose a
 * DIFFERENT number. The keeper-loft round trip is published beside it, and the FULL histogram
 * is stored so any window re-derives off disk (BK-C0 §CORR 2's defect, fixed at 3× the range).
 */
const KEEPER_FN_START = MECH_SRC.indexOf('export function performKeeperThrow(');
if (KEEPER_FN_START < 0) {
  banner('R9 FATAL — the NAMED performKeeperThrow declaration was not found.');
  process.exit(3);
}
const KEEPER_FN_END = (() => {
  const next = MECH_SRC.indexOf('\nexport function ', KEEPER_FN_START + 1);
  return next < 0 ? MECH_SRC.length : next;
})();
const KEEPER_BODY = MECH_SRC.slice(KEEPER_FN_START, KEEPER_FN_END);
const KEEPER_LOFT_CALL =
  /loftKick\(\s*match,\s*[A-Za-z]+,\s*[A-Za-z]+,\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),/
    .exec(KEEPER_BODY);
if (KEEPER_LOFT_CALL === null) {
  banner('R9 FATAL — the loftKick call inside performKeeperThrow did not parse.');
  process.exit(3);
}
const KEEPER_LOFT_T_MAX = Number(KEEPER_LOFT_CALL[4]);
const KEEPER_LOFT_LINE = MECH_SRC.slice(0, KEEPER_FN_START + KEEPER_LOFT_CALL.index)
  .split('\n').length;
/** the NAMED performLoftedPass site's own tMax — the punt's flight cap, published for contrast */
const LOFT_FN_START = MECH_SRC.indexOf('export function performLoftedPass(');
const LOFT_FN_END = (() => {
  const next = MECH_SRC.indexOf('\nexport function ', LOFT_FN_START + 1);
  return next < 0 ? MECH_SRC.length : next;
})();
const LOFT_CALL = LOFT_FN_START < 0 ? null
  : /loftKick\(\s*match,\s*[A-Za-z]+,\s*[A-Za-z]+,\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),/
    .exec(MECH_SRC.slice(LOFT_FN_START, LOFT_FN_END));
if (LOFT_CALL === null) {
  banner('R9 FATAL — the loftKick call inside performLoftedPass did not parse.');
  process.exit(3);
}
const PUNT_LOFT_T_MAX = Number(LOFT_CALL[4]);
const PUNT_LOFT_LINE = MECH_SRC.slice(0, LOFT_FN_START + LOFT_CALL.index).split('\n').length;
const CONSTANTS_OK = KEEPER_LOFT_T_MAX === 1.5 && PUNT_LOFT_T_MAX === 2.1
  && KEEPER_LOFT_LINE > 0 && PUNT_LOFT_LINE > 0;

/* ========================================================================== */
/* §3 THE DOSE SOURCES — FILE BYTES HASHED BEFORE THEY ARE PARSED             */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const BKC0_PATH = 'docs/world-model/data/bk-c0-bodyball-census.json';
const BKT2_PATH = 'docs/world-model/data/bk-t2-composition-exam.json';
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
/** the WINDOW OF RECORD, carried from the COMMITTED BK-C0 artifact (bytes hashed first) */
const BKC0_BYTES = readFileSync(BKC0_PATH, 'utf8');
const BKC0_BYTES_SHA = sha(BKC0_BYTES);
const BKC0_DEFS = (JSON.parse(BKC0_BYTES) as { definitions?: Record<string, unknown> })
  .definitions ?? {};
const BOUNCE_WINDOW_TICKS = Number(BKC0_DEFS.bounceBackWindowTicks);
/**
 * ⭐ THE FACE UNDER DECOMPOSITION, carried from the COMMITTED BK-T2 artifact (bytes hashed
 * first) so the doc's own framing quotes ARTIFACT FIELDS and not prose (canon doc-prose
 * fidelity). These are BK-T2's numbers on BK-T2's seeds; this stage walks its OWN block and
 * does NOT expect to reproduce them numerically — they are the QUESTION, not a baseline.
 */
const BKT2_BYTES = readFileSync(BKT2_PATH, 'utf8');
const BKT2_BYTES_SHA = sha(BKT2_BYTES);
const BKT2_JSON = JSON.parse(BKT2_BYTES) as {
  faces?: { face: string; base: { point: number }; armed: { point: number };
    delta: number; deltaCi95: [number, number]; absDeltaOverHalfWidth: number }[];
  definitions?: Record<string, unknown>;
};
const bkt2Face = (k: string): Record<string, unknown> => {
  const f = (BKT2_JSON.faces ?? []).find((x) => x.face === k);
  if (f === undefined) { banner(`R9 FATAL — BK-T2 face ${k} not on disk.`); process.exit(3); }
  return {
    face: f!.face, base: f!.base.point, armed: f!.armed.point, delta: f!.delta,
    deltaCi95: f!.deltaCi95, absDeltaOverHalfWidth: f!.absDeltaOverHalfWidth,
  };
};
/**
 * ⭐⭐ THE RETIRE CAP — BK-T2's UNCENSORED LESSON, INHERITED FROM BIRTH. BK-C0 retired its GK
 * record at the window itself (240) and thereby made bins 25–40 structurally zero; BK-T2 moved
 * to 420 and found 28.8 % (base) / 23.2 % (armed) of closures at gaps ≥ 250 ticks with the
 * MEDIAN in the 90/100-tick bins. A tail that big at 420 is not evidence the tail ENDS at 420.
 * This stage retires at 3 × the window of record = 720 ticks (12 sim-s) and stores 73×10-tick
 * bins, so every bin up to the cap is READABLE and the cap itself is published as the one
 * remaining censoring edge (`retireCapIsTheOnlyCensoringEdge`).
 */
const CHAIN_RETIRE_TICKS = 3 * BOUNCE_WINDOW_TICKS;
const GAP_BIN_TICKS = 10;
const GAP_BINS = Math.floor(CHAIN_RETIRE_TICKS / GAP_BIN_TICKS) + 1; // 73: last bin holds age = cap
const gapBinOf = (t: number): number => Math.min(GAP_BINS - 1, Math.max(0, Math.floor(t / GAP_BIN_TICKS)));
const KEEPER_LOFT_ROUND_TRIP_TICKS = Math.round((2 * KEEPER_LOFT_T_MAX) / DT);
const PUNT_ROUND_TRIP_TICKS = Math.round((2 * PUNT_LOFT_T_MAX) / DT);
const WINDOWS_OK = BOUNCE_WINDOW_TICKS === 240 && CHAIN_RETIRE_TICKS === 720 && GAP_BINS === 73
  && (GAP_BINS - 1) * GAP_BIN_TICKS === CHAIN_RETIRE_TICKS;

/* ========================================================================== */
/* §4 THE PRE-REGISTERED CLASSES (frozen before the battery)                  */
/* ========================================================================== */
/** BK-C0 §2(c) VERBATIM: the keeper's own action label at the pre-step boundary. */
const GK_CHANNELS = ['punt', 'throwOut', 'gkShortPass', 'gkClearance', 'gkOther'] as const;
type GkChannel = (typeof GK_CHANNELS)[number];
const G = Object.fromEntries(GK_CHANNELS.map((c, i) => [c, i])) as Record<GkChannel, number>;
/**
 * ⭐⭐ THE RETURN-PATH CLASSES — PRE-REGISTERED, EXACT, AND ORDERED. Each is decided at the
 * RETURN TICK (the releasing keeper OWNS the ball again, first resolution per chain — BK-T2's
 * own resolution rule) by the FIRST arm of this ladder that matches:
 *
 *  1. `saveHeld`            — the keeper's OWN `saves` counter incremented ON the return tick.
 *                             That is the engine's held-save path (tryKeeperSave's catch,
 *                             tryAerial's high claim, trySmother — each does `stats.saves++`
 *                             then `giveBall(gk)` in the same tick). NOT a distribution coming
 *                             home: a shot came in and he caught it.
 *  2. `restartAward`        — `match.restartKickGid === gid` at the return tick. The ball had
 *                             LEFT PLAY and the keeper was AWARDED it (goal kick). The loop did
 *                             not close; the referee closed it.
 *  3. `parryRegather`       — the keeper took a save credit EARLIER in this chain WITHOUT
 *                             gaining ownership (the parry branch: `stats.saves++`, ball
 *                             deflected, `lastTouch = gk`, no giveBall) and he now owns it.
 *                             ⭐ THE CLASS BK-C0 §DOUBTS 4 SAID WAS MISSING — kept apart from
 *                             every distribution class BY LADDER POSITION, before possession
 *                             history is consulted at all.
 *  4. `oppControlledThenLost` — an OPPONENT established ownership during the chain and gave it
 *                             back without a save being involved.
 *  5. `ownDefenderBackPass` — a TEAMMATE established ownership during the chain (and no
 *                             opponent did) and the ball came back to the keeper.
 *  6. `directCarom`         — NOBODY else ever OWNED it, but another body TOUCHED it (a
 *                             `lastTouch` change to another player with no ownership, i.e. a
 *                             deflection or — armed only — a BK bodyStrike).
 *  7. `noOtherTouch`        — nobody else owned it and nobody else touched it: the ball simply
 *                             came back (short/rolled/blocked-by-nothing) and he re-collected.
 *  8. `otherReturn`         — STRUCTURALLY UNREACHABLE (arm 7 is total). It exists as an
 *                             overflow assertion cell and is gated to 0.
 *
 * ⚠ THE LADDER IS AN ORDERING, NOT AN EXCLUSIVE DIAGNOSIS (BK-C0 §DOUBTS 2's honest phrasing,
 * reused): a chain in `parryRegather` very often ALSO saw opponent possession. That is why the
 * CROSS-TAB is published per class (`returnOppOwnedByClass` / `returnOppInBoxByClass`) — the
 * shares are "the first thing that explains this return", which is the right quantity for
 * answering WHY the face moved and the wrong one for counting counterfactual possessions.
 */
const RETURN_CLASSES = ['saveHeld', 'restartAward', 'parryRegather', 'oppControlledThenLost',
  'ownDefenderBackPass', 'directCarom', 'noOtherTouch', 'otherReturn'] as const;
type ReturnClass = (typeof RETURN_CLASSES)[number];
const R = Object.fromEntries(RETURN_CLASSES.map((c, i) => [c, i])) as Record<ReturnClass, number>;
/** the classes that are NOT a distribution coming home — the save family, named once */
const SAVE_FAMILY: readonly ReturnClass[] = ['saveHeld', 'parryRegather'];
/** the classes that are a genuine distribution round trip */
const DISTRIBUTION_FAMILY: readonly ReturnClass[] = ['oppControlledThenLost',
  'ownDefenderBackPass', 'directCarom', 'noOtherTouch'];
/**
 * ⭐ THE ACQUISITION LADDER — EVERY time the keeper gains ball ownership, however it arose
 * (this ledger is NOT conditioned on his own release, so it is the honest denominator for
 * "how does a keeper get the ball in this world"). First arm that matches:
 *  1. `acqSaveHeld`      — his `saves` counter incremented on this tick.
 *  2. `acqRestartAward`  — he is the restart taker on this tick.
 *  3. `acqParryRegather` — he took a save credit without ownership since he last owned it.
 *  4. `acqFromTeammate`  — the last player to own the ball before him was a teammate.
 *  5. `acqFromOpponent`  — the last player to own the ball before him was an opponent.
 *  6. `acqSelfRecollect` — the last player to own the ball before him was HIMSELF (he released
 *                          it and got it back with nobody owning it in between).
 *  7. `acqOther`         — nobody had owned the ball since kickoff (the residual).
 */
const ACQ_KINDS = ['acqSaveHeld', 'acqRestartAward', 'acqParryRegather', 'acqFromTeammate',
  'acqFromOpponent', 'acqSelfRecollect', 'acqOther'] as const;
type AcqKind = (typeof ACQ_KINDS)[number];
const A = Object.fromEntries(ACQ_KINDS.map((c, i) => [c, i])) as Record<AcqKind, number>;
/** what happens to a PARRY (a save credit that never becomes a held release) */
const PARRY_FATES = ['parryRegatheredByKeeper', 'parryToOpponent', 'parryToTeammate',
  'parryWentDead', 'parryUnresolved'] as const;
type ParryFate = (typeof PARRY_FATES)[number];
const P = Object.fromEntries(PARRY_FATES.map((c, i) => [c, i])) as Record<ParryFate, number>;
/** the engine's own release-signature classes (BK-C0 §2(a)), needed only to name the channel */
const CLASSES = ['shot', 'headerShot', 'shortPass', 'loftedPass', 'throughBall', 'cross',
  'cutback', 'keeperThrow', 'clearance', 'headerClearance', 'headerKnockdown', 'other'] as const;
type Klass = (typeof CLASSES)[number];

/* ========================================================================== */
/* §5 THE TWO ARMS — BK-T2's construction, reused EXACTLY                     */
/* ========================================================================== */
const ARMS = ['base', 'armed'] as const;
type Arm = (typeof ARMS)[number];
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
const buildMatch = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(PC_WORLD),
    ...(arm === 'armed' ? { bkFacingLaw: true, bkContactLaw: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, PC_WORLD, L3_DOSE, PC_DOSE);
  return m;
};
const worldConjuncts = (m: Match, arm: Arm): Record<string, boolean> => {
  const mm = m as unknown as {
    pcLatency: { books: { count(ri: number, key: string): number }[] } | null;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    c7Windup: boolean; o1PassWindup: boolean; pcReactionLatency: boolean;
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
    /**
     * ⭐ ONE DECLARED IMPROVEMENT ON BK-T2's RECEIPT, DISCLOSED BEFORE THE BATTERY. BK-T2's
     * conjunct read `a4ArmedVersion(m) === 8` on BOTH arms and was green when it ran. Ruling
     * #309 item 5 has since given the BK composition its OWN version value
     * (`bkArmedVersion` ⇒ BK_WORLD_VERSION = 9, a4World.ts:909–913 / 858), so an armed match
     * now NAMES ITSELF 9 — which is precisely the dispatch's own framing ("base = world-8,
     * armed = world-9"). The conjunct therefore asserts the version PER ARM. Verified before
     * the battery: with BK-T2's old form the armed arm is RED by construction, so keeping it
     * would have been a vacuous-green risk inverted into a false alarm.
     */
    armedVersionNamesTheArm: a4ArmedVersion(m) === (arm === 'armed' ? BK_WORLD_VERSION : PC_WORLD),
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    pcBooksBitEqualToDose: booksDosed,
    l3BooksBitEqualToDose: l3Dosed,
    bkLawsMatchTheArm: m.bkFacingLaw === (arm === 'armed') && m.bkContactLaw === (arm === 'armed'),
  };
};

/* ========================================================================== */
/* §6 THE PER-SEED ROW (per-seed cells — canon, home ruling #282.2(ii))       */
/* ========================================================================== */
interface Row {
  seed: number; arm: Arm; worldOk: boolean;
  ticks: number; playingTicks: number;
  /* --- the release menu (BK-C0 §2(c) channels, open play only) --- */
  gkReleases: number; gkByChannel: number[]; unattributedGkReleases: number;
  gkOwnershipEnds: number; gkOwnershipEndsWithoutRelease: number;
  /* --- the chains --- */
  chainsOpened: number; chainsReturned: number; chainsNoReturn: number;
  /** channel × return class, ANY gap up to the retire cap */
  returnByChannelClass: number[][];
  /** channel × return class, gap ≤ the 240-tick WINDOW OF RECORD */
  returnWithinByChannelClass: number[][];
  /** the stored gap histograms — return class × 73 bins × 10 ticks (UNCENSORED to the cap) */
  returnGapBinsByClass: number[][];
  /** the stored gap histograms — channel × 73 bins × 10 ticks */
  returnGapBinsByChannel: number[][];
  /** the cross-tabs (an ordering is not an exclusive diagnosis) */
  returnOppOwnedByClass: number[];
  returnOppInBoxByClass: number[];
  returnCaromTouchesByClass: number[];
  /* --- the acquisition ledger (every keeper ownership gain) --- */
  gkAcquisitions: number; acqByKind: number[];
  /* --- the save / parry ledger --- */
  saveCredits: number; saveCreditsHeld: number; saveCreditsParry: number;
  nonKeeperSaveCredits: number; engineSaveCreditsFinal: number;
  parryByFate: number[]; parryRegatherWithin: number; parryRegatherBins: number[];
  /* --- the dormancy / firing receipts (arming receipts, never football findings) --- */
  ledFacingArmsSeen: number; ledFacingArmsExtended: number; ledFacingExtraTicks: number;
  ledStrikesApplied: number; ledStrikeClaims: number; ledPartitionGroundTicks: number;
}
const emptyRow = (seed: number, arm: Arm): Row => ({
  seed, arm, worldOk: false, ticks: 0, playingTicks: 0,
  gkReleases: 0, gkByChannel: zeros(GK_CHANNELS.length), unattributedGkReleases: 0,
  gkOwnershipEnds: 0, gkOwnershipEndsWithoutRelease: 0,
  chainsOpened: 0, chainsReturned: 0, chainsNoReturn: 0,
  returnByChannelClass: zeros2(GK_CHANNELS.length, RETURN_CLASSES.length),
  returnWithinByChannelClass: zeros2(GK_CHANNELS.length, RETURN_CLASSES.length),
  returnGapBinsByClass: zeros2(RETURN_CLASSES.length, GAP_BINS),
  returnGapBinsByChannel: zeros2(GK_CHANNELS.length, GAP_BINS),
  returnOppOwnedByClass: zeros(RETURN_CLASSES.length),
  returnOppInBoxByClass: zeros(RETURN_CLASSES.length),
  returnCaromTouchesByClass: zeros(RETURN_CLASSES.length),
  gkAcquisitions: 0, acqByKind: zeros(ACQ_KINDS.length),
  saveCredits: 0, saveCreditsHeld: 0, saveCreditsParry: 0,
  nonKeeperSaveCredits: 0, engineSaveCreditsFinal: 0,
  parryByFate: zeros(PARRY_FATES.length), parryRegatherWithin: 0,
  parryRegatherBins: zeros(GAP_BINS),
  ledFacingArmsSeen: 0, ledFacingArmsExtended: 0, ledFacingExtraTicks: 0,
  ledStrikesApplied: 0, ledStrikeClaims: 0, ledPartitionGroundTicks: 0,
});

/* ========================================================================== */
/* §7 THE WALK — one match, pure reads of public engine state                  */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'longBalls', 'crosses', 'throughBalls', 'cutbacks', 'clearances',
  'shots', 'headersWon'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface Chain {
  releaseTick: number; gid: number; side: Side; channel: GkChannel;
  resolved: boolean;
  sawTeammateOwner: boolean; sawOppOwner: boolean; sawOppOwnerInKeeperBox: boolean;
  sawOtherBodyTouch: boolean; otherBodyTouches: number;
  sawGkSaveCredit: boolean;
}
/** a parry in flight: a save credit with no ownership, awaiting its fate */
interface OpenParry { tick: number; gid: number; side: Side; resolved: boolean }

const walk = (seed: number, arm: Arm): Row => {
  const m = buildMatch(seed, arm);
  const row = emptyRow(seed, arm);
  row.worldOk = Object.values(worldConjuncts(m, arm)).every(Boolean);
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
  };
  const players = m.allPlayers;
  const N = players.length;

  /** the pre-step snapshot of the ONE field the punt label needs (BK-C0 §2(c)) */
  const preGkDist = new Array<boolean>(N).fill(false);
  const snapBodies = (): void => {
    for (let i = 0; i < N; i++) preGkDist[i] = players[i].gkDistributing;
  };
  snapBodies();

  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevStrikes = 0;
  const prevSaves = new Int32Array(N);
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];

  const chains: Chain[] = [];
  const parries: OpenParry[] = [];
  /** per-keeper state since he last OWNED the ball: did he take a save credit without holding */
  const sinceOwnParry = new Array<boolean>(N).fill(false);
  /** the last player to own the ball at all (drives the acquisition ladder) */
  let lastDistinctOwnerGid: number | null = prevOwnerGid;

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks++;
    const playing = m.phase === 'playing';
    if (playing) row.playingTicks++;
    const ball = m.ball;
    const ownerGid = ball.owner?.gid ?? null;
    const lastTouchGid = ball.lastTouch?.gid ?? null;
    const contactGid = lastTouchGid !== prevLastTouchGid ? lastTouchGid
      : (ownerGid !== null && ownerGid !== prevOwnerGid ? ownerGid : null);
    const ballIsLive = playing || m.phase === 'restart';
    const strikes = m.bkContactLedger.strikesApplied;
    const strikeThisTick = strikes > prevStrikes;
    prevStrikes = strikes;

    /* ---------------- the SAVE-CREDIT deltas, per player ---------------- */
    /** the keeper (if any) who took a HELD save this tick — `saves++` AND owns the ball now */
    let heldSaveGid: number | null = null;
    for (let i = 0; i < N; i++) {
      const gid = players[i].gid;
      const s = m.stat(gid).saves;
      if (s > prevSaves[i]) {
        const delta = s - prevSaves[i];
        prevSaves[i] = s;
        row.saveCredits += delta;
        if (players[i].role !== 'GK') row.nonKeeperSaveCredits += delta;
        if (ownerGid === gid) {
          row.saveCreditsHeld += delta;
          heldSaveGid = gid;
        } else {
          row.saveCreditsParry += delta;
          sinceOwnParry[gid] = true;
          parries.push({ tick, gid, side: players[i].side as Side, resolved: false });
        }
        for (const c of chains) if (c.gid === gid) c.sawGkSaveCredit = true;
      }
    }

    /* ---------------- stat deltas, per side ---------------- */
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* ===== RELEASE DETECTION — BK-C0 §2(a) / BK-T2 VERBATIM IN DEFINITION ===== */
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
    const releasesThisTick: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        let klass: Klass | null = null;
        if (d.shots[side] > 0) klass = d.headersWon[side] > 0 ? 'headerShot' : 'shot';
        if (d.clearances[side] > 0 && klass === null) {
          klass = d.headersWon[side] > 0 ? 'headerClearance' : 'clearance';
        }
        if (d.passes[side] > 0 && klass === null) {
          klass = d.crosses[side] > 0 ? 'cross'
            : d.cutbacks[side] > 0 ? 'cutback'
              : d.throughBalls[side] > 0 ? 'throughBall'
                : d.longBalls[side] > 0 ? 'loftedPass' : 'shortPass';
        }
        if (d.headersWon[side] > 0 && klass === null) klass = 'headerKnockdown';
        if (klass === null && passChangedSide === side) klass = 'other';
        if (klass === null) continue;
        let gid = -1;
        if (passChangedSide === side && mm.pendingPass !== null) gid = mm.pendingPass.passerGid;
        else if (lastTouchGid !== null && players[lastTouchGid].side === side) gid = lastTouchGid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && players[gid].action.type === 'ThrowOut') klass = 'keeperThrow';
        releasesThisTick.push({ gid, klass });
      }
    }

    /* ===== THE KEEPER'S RELEASE MENU + a fresh chain per release ===== */
    /**
     * ⭐ BK-T2's OWN GUARD, REPRODUCED: a "release" whose ball is not moving at the tick
     * boundary (|v| < 1e-6) is booked as UNATTRIBUTED and censused nowhere — that is how the
     * face of record's denominator was built, and dropping the guard would inflate
     * `gkReleases` with dead-ball artefacts and silently deflate every per-release rate.
     */
    const hSpeed = Math.hypot(ball.vel.x, ball.vel.y);
    let gkReleasedThisTick = false;
    for (const rel of releasesThisTick) {
      const p = players[rel.gid];
      if (p.role !== 'GK') continue;
      if (!playing) continue; // OPEN PLAY ONLY — BK-T2's own scope, so the face is the same face
      if (hSpeed < 1e-6) { row.unattributedGkReleases++; continue; }
      const channel: GkChannel = rel.klass === 'loftedPass' && preGkDist[rel.gid] ? 'punt'
        : rel.klass === 'keeperThrow' ? 'throwOut'
          : rel.klass === 'clearance' ? 'gkClearance'
            : (rel.klass === 'shortPass' || rel.klass === 'throughBall') ? 'gkShortPass'
              : 'gkOther';
      row.gkReleases++;
      row.gkByChannel[G[channel]]++;
      row.chainsOpened++;
      gkReleasedThisTick = true;
      chains.push({
        releaseTick: tick, gid: rel.gid, side: p.side as Side, channel, resolved: false,
        sawTeammateOwner: false, sawOppOwner: false, sawOppOwnerInKeeperBox: false,
        sawOtherBodyTouch: false, otherBodyTouches: 0, sawGkSaveCredit: false,
      });
    }

    /* ===== THE KEEPER'S OWNERSHIP ENDINGS (the release menu's honest denominator) ===== */
    if (prevOwnerGid !== null && prevOwnerGid !== ownerGid
      && players[prevOwnerGid].role === 'GK') {
      row.gkOwnershipEnds++;
      if (!gkReleasedThisTick) row.gkOwnershipEndsWithoutRelease++;
    }

    /* ===== THE ACQUISITION LADDER — every keeper ownership gain ===== */
    if (ownerGid !== null && ownerGid !== prevOwnerGid && players[ownerGid].role === 'GK') {
      row.gkAcquisitions++;
      const prior = lastDistinctOwnerGid;
      const kind: AcqKind = heldSaveGid === ownerGid ? 'acqSaveHeld'
        : m.restartKickGid === ownerGid ? 'acqRestartAward'
          : sinceOwnParry[ownerGid] ? 'acqParryRegather'
            : prior === null ? 'acqOther'
              : prior === ownerGid ? 'acqSelfRecollect'
                : players[prior].side === players[ownerGid].side ? 'acqFromTeammate'
                  : 'acqFromOpponent';
      row.acqByKind[A[kind]]++;
      sinceOwnParry[ownerGid] = false;
    }

    /* ===== THE CHAINS ===== */
    for (let i = chains.length - 1; i >= 0; i--) {
      const c = chains[i];
      if (c.releaseTick === tick) continue;
      const age = tick - c.releaseTick;
      /* --- the history this chain accumulates --- */
      if (ownerGid !== null && ownerGid !== prevOwnerGid && ownerGid !== c.gid) {
        if (players[ownerGid].side === c.side) c.sawTeammateOwner = true;
        else {
          c.sawOppOwner = true;
          if (m.inPenaltyBox(ball.pos, c.side)) c.sawOppOwnerInKeeperBox = true;
        }
      }
      if (contactGid !== null && contactGid !== c.gid && contactGid !== ownerGid) {
        c.sawOtherBodyTouch = true;
        c.otherBodyTouches++;
      }
      if (strikeThisTick) { c.sawOtherBodyTouch = true; c.otherBodyTouches++; }
      /* --- the RETURN: the releasing keeper owns it again (BK-T2's resolution rule) --- */
      if (ownerGid === c.gid && ownerGid !== prevOwnerGid) {
        const klass: ReturnClass = heldSaveGid === c.gid ? 'saveHeld'
          : m.restartKickGid === c.gid ? 'restartAward'
            : c.sawGkSaveCredit ? 'parryRegather'
              : c.sawOppOwner ? 'oppControlledThenLost'
                : c.sawTeammateOwner ? 'ownDefenderBackPass'
                  : c.sawOtherBodyTouch ? 'directCarom'
                    : 'noOtherTouch';
        const ri = R[klass];
        c.resolved = true;
        row.chainsReturned++;
        row.returnByChannelClass[G[c.channel]][ri]++;
        row.returnGapBinsByClass[ri][gapBinOf(age)]++;
        row.returnGapBinsByChannel[G[c.channel]][gapBinOf(age)]++;
        if (age <= BOUNCE_WINDOW_TICKS) row.returnWithinByChannelClass[G[c.channel]][ri]++;
        if (c.sawOppOwner) row.returnOppOwnedByClass[ri]++;
        if (c.sawOppOwnerInKeeperBox) row.returnOppInBoxByClass[ri]++;
        row.returnCaromTouchesByClass[ri] += c.otherBodyTouches;
        chains.splice(i, 1);
        continue;
      }
      /* --- the retire cap: 3 × the window of record, so every bin is readable --- */
      if (age > CHAIN_RETIRE_TICKS) { row.chainsNoReturn++; chains.splice(i, 1); }
    }

    /* ===== THE PARRIES — a save credit that never became a held release ===== */
    for (let i = parries.length - 1; i >= 0; i--) {
      const q = parries[i];
      if (q.tick === tick) continue;
      const age = tick - q.tick;
      if (ownerGid !== null && ownerGid !== prevOwnerGid) {
        const fate: ParryFate = ownerGid === q.gid ? 'parryRegatheredByKeeper'
          : players[ownerGid].side === q.side ? 'parryToTeammate' : 'parryToOpponent';
        row.parryByFate[P[fate]]++;
        if (fate === 'parryRegatheredByKeeper') {
          row.parryRegatherBins[gapBinOf(age)]++;
          if (age <= BOUNCE_WINDOW_TICKS) row.parryRegatherWithin++;
        }
        parries.splice(i, 1);
        continue;
      }
      if (!ballIsLive) {
        row.parryByFate[P.parryWentDead]++;
        parries.splice(i, 1);
        continue;
      }
      if (age > CHAIN_RETIRE_TICKS) {
        row.parryByFate[P.parryUnresolved]++;
        parries.splice(i, 1);
      }
    }

    if (ownerGid !== null && ownerGid !== prevOwnerGid) lastDistinctOwnerGid = ownerGid;
    prevOwnerGid = ownerGid;
    prevLastTouchGid = lastTouchGid;
    prevPendingPassT = passT;
    snapBodies();
  }
  /* --- full time: every open record is booked, so the partition is exhaustive --- */
  row.chainsNoReturn += chains.length;
  row.parryByFate[P.parryUnresolved] += parries.length;

  const lf = m.bkFacingLedger;
  row.ledFacingArmsSeen = lf.armsSeen;
  row.ledFacingArmsExtended = lf.armsExtended;
  row.ledFacingExtraTicks = lf.extraTicksTotal;
  const lc = m.bkContactLedger;
  row.ledStrikesApplied = lc.strikesApplied;
  row.ledStrikeClaims = lc.strikeClaimsCooldown + lc.strikeClaimsStunned;
  row.ledPartitionGroundTicks = lc.partitionGroundTicks;
  row.engineSaveCreditsFinal = sum(players.map((p) => m.stat(p.gid).saves));
  return row;
};

/* ========================================================================== */
/* §8 THE WORLD-CONSTRUCTION RECEIPT (its own booked seed, xxx,999)            */
/* ========================================================================== */
const BLOCK = 12_506_000;
const RECEIPT_SEED = BLOCK + 999;
const receiptMatch = buildMatch(RECEIPT_SEED, 'base');
const RECEIPT = worldConjuncts(receiptMatch, 'base');
const RECEIPT_OK = Object.values(RECEIPT).every(Boolean);
if (!RECEIPT_OK || !CONSTANTS_OK || !WINDOWS_OK) {
  banner(`R9 FATAL — the world/dose/constant class BIT. receipt=${JSON.stringify(RECEIPT)} `
    + `constants=${CONSTANTS_OK} windows=${WINDOWS_OK}. Nothing is written.`);
  process.exit(3);
}

/* ========================================================================== */
/* §9 THE BATTERY — PAIRED, virgin seeds                                      */
/* ========================================================================== */
/**
 * ⭐ THE SIZE, WITH ITS REASON — THE RAREST PUBLISHED CELL GOVERNS, AND IT IS THE PUNT.
 * BK-T2 §R3's own fields: `gkReleasesPerMatch` = 10.645 (base) / 9.5075 (armed) and
 * `gkPuntShare` = 0.065993 / 0.063897 ⇒ 0.703 (base) / 0.608 (armed) PUNTS PER MATCH — the
 * "~0.7/match" of the dispatch. The RARE cell this stage publishes is a punt that comes home:
 * at BK-T2's own `bounceBackWithin240PerGkRelease` (0.0895 / 0.1317) an indifferent
 * per-release rate puts ≈ 0.063 (base) / 0.080 (armed) punt returns per match. At N = 400
 * paired seeds that is ≈ 25 (base) / 32 (armed) events — enough for a per-class SHARE with an
 * honest CI, NOT enough to split the punt cell further by return class, which is why the punt
 * decomposition is published as COUNTS beside the all-channel decomposition and its own doubt
 * is declared BEFORE the walk (§DOUBTS 1 of the stage doc). The all-channel classes are the
 * grain that carries the answer: ≈ 0.95 (base) / 1.25 (armed) returns per match ⇒ ≈ 380 / 500
 * events per arm at N = 400.
 * WALL: BK-T2 measured 0.19 s per walk WITH its corridor rung; this instrument drops the
 * corridor and every geometry sweep, so 801 walks is comfortably inside the 60 min ceiling.
 * The battery's own measurement is published in `battery.wallSeconds`.
 */
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 400 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
const SEEDS = Array.from({ length: N_SEEDS }, (_, i) => BLOCK + i);
const rows: Row[] = [];
let walksBooked = 1; // the world receipt above
banner(`R9 ledger: mode=${MODE} N=${N_SEEDS} block=${BLOCK}`);
for (const seed of SEEDS) {
  for (const arm of ARMS) {
    rows.push(walk(seed, arm));
    walksBooked++;
  }
  if (rows.length % 50 === 0) {
    banner(`  … ${rows.length / 2}/${N_SEEDS} paired seeds `
      + `(${((Date.now() - t0Wall) / 1000).toFixed(0)} s)`);
  }
}
const rowsOf = (arm: Arm): Row[] => rows.filter((r) => r.arm === arm);

/* ========================================================================== */
/* §10 THE FACE TABLE — every published face is (numerator, denominator)      */
/* ========================================================================== */
interface FaceDef {
  num: (r: Row) => number;
  den: (r: Row) => number;
  unit: string;
  what: string;
  denNote?: string;
}
const perMatch = (): number => 1;
const withinTotal = (r: Row): number => sum2(r.returnWithinByChannelClass);
const anyTotal = (r: Row): number => sum2(r.returnByChannelClass);
const withinClass = (ri: number) => (r: Row): number => sum(
  GK_CHANNELS.map((_, gi) => r.returnWithinByChannelClass[gi][ri]),
);
const anyClass = (ri: number) => (r: Row): number => sum(
  GK_CHANNELS.map((_, gi) => r.returnByChannelClass[gi][ri]),
);
const withinChannel = (gi: number) => (r: Row): number => sum(r.returnWithinByChannelClass[gi]);
const famWithin = (fam: readonly ReturnClass[]) => (r: Row): number => sum(
  fam.map((c) => withinClass(R[c])(r)),
);

const FACES: Record<string, FaceDef> = {
  /* ============ THE FACE OF RECORD, REPRODUCED IN DEFINITION ============ */
  bounceBackWithin240PerGkRelease: {
    num: withinTotal, den: (r) => r.gkReleases,
    unit: `bounce-backs within ${BOUNCE_WINDOW_TICKS} ticks / GK release`,
    what: '⭐⭐ THE FACE UNDER DECOMPOSITION — BK-T2 §R3\'s own definition reused '
      + 'expression-for-expression: the releasing keeper owns the ball again inside the '
      + `${BOUNCE_WINDOW_TICKS}-tick WINDOW OF RECORD, per open-play GK release. This stage `
      + 'walks its OWN seed block, so its level is its own; the DECOMPOSITION below is what '
      + 'this stage exists to publish.',
    denNote: '⚠ MOVING DENOMINATOR (disclosed): `gkReleases` itself moved between the arms in '
      + 'BK-T2 (10.645 → 9.5075 per match). Every class face below uses THE SAME denominator, '
      + 'so the class rates SUM to this face exactly and the denominator move cannot hide '
      + 'inside the partition.',
  },
  bounceBackAnyGapPerGkRelease: {
    num: anyTotal, den: (r) => r.gkReleases,
    unit: `bounce-backs at ANY gap ≤ ${CHAIN_RETIRE_TICKS} ticks / GK release`,
    what: 'the same face at the RETIRE CAP (3 × the window) — the uncensored read',
  },
  gkReleasesPerMatch: {
    num: (r) => r.gkReleases, den: perMatch,
    unit: 'open-play GK releases / match', what: 'the denominator itself, published',
  },
  unattributedGkReleasesPerMatch: {
    num: (r) => r.unattributedGkReleases, den: perMatch,
    unit: 'unattributed GK release signatures / match',
    what: 'the honesty counter: keeper release signatures dropped by BK-T2\'s own |v| < 1e-6 '
      + 'guard (censused nowhere, published so the denominator\'s losses are visible)',
  },
  /* ============ THE DECOMPOSITION — one face per RETURN CLASS ============ */
  ...Object.fromEntries(RETURN_CLASSES.map((c) => [`bounceBackWithin240_${c}_PerGkRelease`, {
    num: withinClass(R[c]), den: (r: Row) => r.gkReleases,
    unit: `${c} bounce-backs within ${BOUNCE_WINDOW_TICKS} ticks / GK release`,
    what: `⭐ THE DECOMPOSITION — the \`${c}\` limb of the face of record, same denominator`,
  }])) as Record<string, FaceDef>,
  ...Object.fromEntries(RETURN_CLASSES.map((c) => [`bounceBackAnyGap_${c}_PerGkRelease`, {
    num: anyClass(R[c]), den: (r: Row) => r.gkReleases,
    unit: `${c} bounce-backs at ANY gap / GK release`,
    what: `the \`${c}\` limb at the retire cap (the uncensored read of the same limb)`,
  }])) as Record<string, FaceDef>,
  /* ============ THE TWO FAMILIES, NAMED ONCE ============ */
  bounceBackWithin240_saveFamily_PerGkRelease: {
    num: famWithin(SAVE_FAMILY), den: (r) => r.gkReleases,
    unit: `save-family bounce-backs within ${BOUNCE_WINDOW_TICKS} ticks / GK release`,
    what: '⭐⭐ THE SAVE FAMILY (saveHeld + parryRegather) — BK-C0 §DOUBTS 4\'s missing split, '
      + 'the half of the face that is NOT a distribution coming home',
  },
  bounceBackWithin240_distributionFamily_PerGkRelease: {
    num: famWithin(DISTRIBUTION_FAMILY), den: (r) => r.gkReleases,
    unit: `distribution-family bounce-backs within ${BOUNCE_WINDOW_TICKS} ticks / GK release`,
    what: '⭐⭐ THE DISTRIBUTION FAMILY (oppControlledThenLost + ownDefenderBackPass + '
      + 'directCarom + noOtherTouch) — a ball he gave away that came home',
  },
  saveFamilyShareOfBounceBacksWithin240: {
    num: famWithin(SAVE_FAMILY), den: withinTotal,
    unit: 'share of within-window bounce-backs',
    what: 'how much of 弹回门将 is a SAVE rather than a distribution',
    denNote: '⚠ MOVING DENOMINATOR: the bounce-back total is exactly the face that moved, so '
      + 'this share is read BESIDE the per-release faces, never instead of them.',
  },
  /* ============ PER RELEASE KIND (moving denominators, disclosed) ============ */
  ...Object.fromEntries(GK_CHANNELS.map((ch) => [`bounceBackWithin240Per${ch[0].toUpperCase()}${ch.slice(1)}Release`, {
    num: withinChannel(G[ch]), den: (r: Row) => r.gkByChannel[G[ch]],
    unit: `bounce-backs within ${BOUNCE_WINDOW_TICKS} ticks / ${ch} release`,
    what: `⭐ THE RELEASE-KIND limb: how often a \`${ch}\` comes home`,
    denNote: `⚠ MOVING DENOMINATOR: the \`${ch}\` COUNT itself moves between the arms (BK-T2 `
      + 'measured every channel share as CI-spans-zero but the release TOTAL fell 10.7 %); the '
      + 'per-seed channel counts are stored so any other denominator re-derives.',
  }])) as Record<string, FaceDef>,
  ...Object.fromEntries(GK_CHANNELS.map((ch) => [`${ch}ReleasesPerMatch`, {
    num: (r: Row) => r.gkByChannel[G[ch]], den: perMatch,
    unit: `${ch} releases / match`, what: `the release mix, published (${ch})`,
  }])) as Record<string, FaceDef>,
  /* ============ THE SAVE / PARRY LEDGER ============ */
  saveCreditsPerMatch: {
    num: (r) => r.saveCredits, den: perMatch,
    unit: 'save credits / match',
    what: 'every `saves` increment the engine booked (both keepers), the ledger\'s own total',
  },
  parryShareOfSaveCredits: {
    num: (r) => r.saveCreditsParry, den: (r) => r.saveCredits,
    unit: 'share of save credits',
    what: '⭐ the PARRY share — a save credit that never became a held release (the class '
      + 'BK-C0 §DOUBTS 4 said shared a cell with a punt that came home)',
  },
  parryRegatherWithin240Share: {
    num: (r) => r.parryRegatherWithin, den: (r) => r.saveCreditsParry,
    unit: 'share of parries',
    what: 'how often the keeper re-collects his OWN parry inside the window of record',
  },
  parryToOpponentShare: {
    num: (r) => r.parryByFate[P.parryToOpponent], den: (r) => r.saveCreditsParry,
    unit: 'share of parries', what: 'the parry the opponent gets (the scramble)',
  },
  parryWentDeadShare: {
    num: (r) => r.parryByFate[P.parryWentDead], den: (r) => r.saveCreditsParry,
    unit: 'share of parries', what: 'the parry that goes out (the corner)',
  },
  /* ============ THE ACQUISITION LEDGER ============ */
  gkAcquisitionsPerMatch: {
    num: (r) => r.gkAcquisitions, den: perMatch,
    unit: 'keeper ownership gains / match',
    what: '⭐ how often a keeper gets the ball AT ALL (the honest denominator the release menu '
      + 'never had)',
  },
  ...Object.fromEntries(ACQ_KINDS.map((k) => [`${k}ShareOfAcquisitions`, {
    num: (r: Row) => r.acqByKind[A[k]], den: (r: Row) => r.gkAcquisitions,
    unit: 'share of keeper ownership gains', what: `the acquisition ladder's \`${k}\` limb`,
  }])) as Record<string, FaceDef>,
  gkOwnershipEndsPerMatch: {
    num: (r) => r.gkOwnershipEnds, den: perMatch,
    unit: 'keeper ownership endings / match',
    what: 'the other side of the ledger: how often the keeper STOPS owning the ball',
  },
  gkLostWithoutReleaseShare: {
    num: (r) => r.gkOwnershipEndsWithoutRelease, den: (r) => r.gkOwnershipEnds,
    unit: 'share of keeper ownership endings',
    what: '⭐ the "carry?" cell the dispatch asked about: the keeper loses the ball with NO '
      + 'release signature (tackled/smothered/spilled/dead ball), so it is not a distribution',
  },
  /* ============ CHAIN BOOK-KEEPING ============ */
  chainReturnShareAnyGap: {
    num: anyTotal, den: (r) => r.chainsOpened,
    unit: 'share of chains', what: 'chains that closed at all before the retire cap',
  },
  chainNoReturnShare: {
    num: (r) => r.chainsNoReturn, den: (r) => r.chainsOpened,
    unit: 'share of chains', what: 'chains retired or still open at full time',
  },
};
const FACE_KEYS = Object.keys(FACES);

/* ========================================================================== */
/* §11 THE ESTIMATOR — PAIRED CLUSTER BOOTSTRAP over match seeds              */
/* ========================================================================== */
/**
 * ⭐ THE STATS LATTICE (frozen): base 114,000 (the floor ruling #311 item 3 opened to this
 * stage), step ≥ 200 from every published base. ONE base is drawn: one resample-index matrix
 * draws BOTH arms, so the pairing is inside every interval.
 */
const BOOTSTRAP = 2000;
const STATS_BASE = 114_000;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_200, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600,
  111_800, 112_000, 112_200, 112_400, 112_600, 112_800, 113_000, 113_200, 113_400, 113_600,
  113_800,
];

interface FaceRow {
  face: string; unit: string; what: string; denNote: string | null;
  base: { point: number; num: number; den: number; ci95: [number, number] };
  armed: { point: number; num: number; den: number; ci95: [number, number] };
  delta: number;
  deltaCi95: [number, number];
  halfWidth: number;
  absDeltaOverHalfWidth: number;
  relative: number;
}
const pct = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
const scoreFaces = (): FaceRow[] => {
  const baseRows = rowsOf('base');
  const armedRows = rowsOf('armed');
  const Kn = baseRows.length;
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
    const nb = baseRows.map((r) => f.num(r));
    const db = baseRows.map((r) => f.den(r));
    const na = armedRows.map((r) => f.num(r));
    const da = armedRows.map((r) => f.den(r));
    const pB = ratio(sum(nb), sum(db));
    const pA = ratio(sum(na), sum(da));
    const vb: number[] = []; const va: number[] = []; const vd: number[] = [];
    for (const idx of draws) {
      let nB = 0; let dB = 0; let nA = 0; let dA = 0;
      for (const i of idx) { nB += nb[i]; dB += db[i]; nA += na[i]; dA += da[i]; }
      const rB = ratio(nB, dB); const rA = ratio(nA, dA);
      if (Number.isFinite(rB)) vb.push(rB);
      if (Number.isFinite(rA)) va.push(rA);
      if (Number.isFinite(rA) && Number.isFinite(rB)) vd.push(rA - rB);
    }
    vb.sort((x, y) => x - y); va.sort((x, y) => x - y); vd.sort((x, y) => x - y);
    const dCi: [number, number] = [pct(vd, 0.025), pct(vd, 0.975)];
    const hw = (dCi[1] - dCi[0]) / 2;
    out.push({
      face: key, unit: f.unit, what: f.what, denNote: f.denNote ?? null,
      base: { point: pB, num: sum(nb), den: sum(db), ci95: [pct(vb, 0.025), pct(vb, 0.975)] },
      armed: { point: pA, num: sum(na), den: sum(da), ci95: [pct(va, 0.025), pct(va, 0.975)] },
      delta: pA - pB,
      deltaCi95: dCi,
      halfWidth: hw,
      absDeltaOverHalfWidth: hw === 0 ? Number.NaN : Math.abs(pA - pB) / hw,
      relative: pB === 0 ? Number.NaN : (pA - pB) / pB,
    });
  }
  return out;
};
const faces = scoreFaces();
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`R9 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
};

/* ========================================================================== */
/* §12 THE GATES (frozen — a red gate is REPORTED, never patched)             */
/* ========================================================================== */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
const baseSeedKey = rowsOf('base').map((r) => r.seed).join(',');
const armedSeedKey = rowsOf('armed').map((r) => r.seed).join(',');
const minStatsGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));

const gates: Record<string, boolean> = {
  gWorld: RECEIPT_OK && rows.every((r) => r.worldOk),
  gDoseBytes: L3_DOSE.length > 0 && PC_DOSE.length > 0 && L3_BYTES_SHA.length === 64
    && PC_BYTES_SHA.length === 64 && BKC0_BYTES_SHA.length === 64 && BKT2_BYTES_SHA.length === 64,
  gConstants: CONSTANTS_OK && WINDOWS_OK,
  gPaired: baseSeedKey === armedSeedKey && rowsOf('base').length === rowsOf('armed').length,
  gBaseDormant: rowsOf('base').every((r) => r.ledFacingArmsSeen === 0
    && r.ledFacingExtraTicks === 0 && r.ledStrikesApplied === 0 && r.ledStrikeClaims === 0
    && r.ledPartitionGroundTicks === 0),
  gArmedFires: sum(rowsOf('armed').map((r) => r.ledFacingArmsExtended)) > 0
    && sum(rowsOf('armed').map((r) => r.ledStrikesApplied)) > 0,
  /** ⭐ THE CHAIN PARTITION IS EXHAUSTIVE AND DISJOINT — every release is booked exactly once */
  gChainPartition: rows.every((r) => r.chainsOpened === r.gkReleases
    && r.chainsReturned + r.chainsNoReturn === r.chainsOpened
    && sum2(r.returnByChannelClass) === r.chainsReturned
    && sum2(r.returnWithinByChannelClass) <= r.chainsReturned
    && sum2(r.returnGapBinsByClass) === r.chainsReturned
    && sum2(r.returnGapBinsByChannel) === r.chainsReturned
    && sum(GK_CHANNELS.map((_, gi) => sum(r.returnByChannelClass[gi]))) === r.chainsReturned
    && r.returnByChannelClass.every((c, gi) => sum(c) === sum(r.returnGapBinsByChannel[gi]))),
  /** the overflow cell of a total ladder must stay empty */
  gNoUnclassifiedReturn: rows.every((r) => sum(GK_CHANNELS
    .map((_, gi) => r.returnByChannelClass[gi][R.otherReturn])) === 0),
  /** ⭐ THE ACQUISITION PARTITION */
  gAcqPartition: rows.every((r) => sum(r.acqByKind) === r.gkAcquisitions),
  /**
   * ⭐⭐ THE SAVE LEDGER AGREES WITH THE ENGINE'S OWN COUNTERS — an independent read (per-tick
   * deltas over every player) must equal the engine's FINAL `stat(gid).saves` sum, and every
   * credit must split into exactly one of held / parry, and no non-keeper may ever hold one.
   */
  gSaveLedgerAgrees: rows.every((r) => r.saveCredits === r.engineSaveCreditsFinal
    && r.saveCreditsHeld + r.saveCreditsParry === r.saveCredits
    && r.nonKeeperSaveCredits === 0),
  gParryPartition: rows.every((r) => sum(r.parryByFate) === r.saveCreditsParry
    && r.parryRegatherWithin <= r.parryByFate[P.parryRegatheredByKeeper]
    && sum(r.parryRegatherBins) === r.parryByFate[P.parryRegatheredByKeeper]),
  /**
   * ⭐ THE UNCENSORED-WINDOW GATE (BK-T2's lesson, made structural): the retire cap is 3× the
   * window of record, the histogram's last bin edge REACHES the cap, and no return was booked
   * into the final bin by overflow from beyond it (there is nothing beyond it — the cap is the
   * only censoring edge, and it is published).
   */
  gUncensoredRange: CHAIN_RETIRE_TICKS === 3 * BOUNCE_WINDOW_TICKS
    && (GAP_BINS - 1) * GAP_BIN_TICKS === CHAIN_RETIRE_TICKS
    && rows.every((r) => sum2(r.returnGapBinsByClass) === r.chainsReturned),
  /** non-vacuity: every quantified gate above has a non-empty domain (#268.3(a)'s spirit) */
  gNonVacuous: sum(rows.map((r) => r.gkReleases)) > 0
    && sum(rows.map((r) => r.chainsReturned)) > 0
    && sum(rows.map((r) => r.gkAcquisitions)) > 0
    && sum(rows.map((r) => r.saveCredits)) > 0
    && sum(rows.map((r) => r.saveCreditsParry)) > 0
    && rows.length === N_SEEDS * 2,
  gStatsDisjoint: STATS_BASE >= 114_000 && minStatsGap >= STATS_STEP,
  gSrcUntouched: srcDiff === '' && srcStatus === '',
  gSeedsBookedEqualWalked: walksBooked === N_SEEDS * 2 + 1,
  gFaces: false, // set below, after the artifact is on disk
};

/* ========================================================================== */
/* §13 THE ARTIFACT                                                           */
/* ========================================================================== */
const BODY_SCHEMA = ['stage', 'definitions', 'world', 'seeds', 'stats', 'faces',
  'decomposition', 'namedObservations', 'perSeedCells', 'gates'] as const;

const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, arm: r.arm, worldOk: r.worldOk, ticks: r.ticks, playingTicks: r.playingTicks,
  gkReleases: r.gkReleases, gkByChannel: r.gkByChannel,
  unattributedGkReleases: r.unattributedGkReleases,
  gkOwnershipEnds: r.gkOwnershipEnds,
  gkOwnershipEndsWithoutRelease: r.gkOwnershipEndsWithoutRelease,
  chainsOpened: r.chainsOpened, chainsReturned: r.chainsReturned,
  chainsNoReturn: r.chainsNoReturn,
  returnByChannelClass: r.returnByChannelClass,
  returnWithinByChannelClass: r.returnWithinByChannelClass,
  returnGapBinsByClass: r.returnGapBinsByClass,
  returnGapBinsByChannel: r.returnGapBinsByChannel,
  returnOppOwnedByClass: r.returnOppOwnedByClass,
  returnOppInBoxByClass: r.returnOppInBoxByClass,
  returnCaromTouchesByClass: r.returnCaromTouchesByClass,
  gkAcquisitions: r.gkAcquisitions, acqByKind: r.acqByKind,
  saveCredits: r.saveCredits, saveCreditsHeld: r.saveCreditsHeld,
  saveCreditsParry: r.saveCreditsParry, nonKeeperSaveCredits: r.nonKeeperSaveCredits,
  engineSaveCreditsFinal: r.engineSaveCreditsFinal,
  parryByFate: r.parryByFate, parryRegatherWithin: r.parryRegatherWithin,
  parryRegatherBins: r.parryRegatherBins,
  ledFacingArmsSeen: r.ledFacingArmsSeen, ledFacingArmsExtended: r.ledFacingArmsExtended,
  ledFacingExtraTicks: r.ledFacingExtraTicks, ledStrikesApplied: r.ledStrikesApplied,
  ledStrikeClaims: r.ledStrikeClaims, ledPartitionGroundTicks: r.ledPartitionGroundTicks,
});

const aggBins = (arm: Arm, pick: (r: Row) => number[]): number[] => {
  const acc = zeros(pick(rows[0]).length);
  for (const r of rowsOf(arm)) addInto(acc, pick(r));
  return acc;
};
const agg2 = (arm: Arm, pick: (r: Row) => number[][]): number[][] => {
  const shape = pick(rows[0]);
  const acc = zeros2(shape.length, shape[0].length);
  for (const r of rowsOf(arm)) { const m2 = pick(r); for (let i = 0; i < acc.length; i++) addInto(acc[i], m2[i]); }
  return acc;
};

/** ⭐ THE DECOMPOSITION BLOCK — the answer, assembled from the faces, nothing re-typed */
const decompositionRow = (c: ReturnClass) => {
  const f = face(`bounceBackWithin240_${c}_PerGkRelease`);
  return {
    returnClass: c,
    isSaveFamily: (SAVE_FAMILY as readonly string[]).includes(c),
    basePerRelease: round(f.base.point, 6),
    armedPerRelease: round(f.armed.point, 6),
    baseEvents: f.base.num,
    armedEvents: f.armed.num,
    delta: round(f.delta, 6),
    deltaCi95: [round(f.deltaCi95[0], 6), round(f.deltaCi95[1], 6)],
    halfWidth: round(f.halfWidth, 6),
    absDeltaOverHalfWidth: round(f.absDeltaOverHalfWidth, 3),
    ciStrictlyAboveZero: f.deltaCi95[0] > 0,
    ciStrictlyBelowZero: f.deltaCi95[1] < 0,
    ciSpansZero: f.deltaCi95[0] <= 0 && f.deltaCi95[1] >= 0,
    relative: round(f.relative, 6),
    baseOppOwnedDuringChain: sum(rowsOf('base').map((r) => r.returnOppOwnedByClass[R[c]])),
    armedOppOwnedDuringChain: sum(rowsOf('armed').map((r) => r.returnOppOwnedByClass[R[c]])),
    baseOppOwnedInKeeperBox: sum(rowsOf('base').map((r) => r.returnOppInBoxByClass[R[c]])),
    armedOppOwnedInKeeperBox: sum(rowsOf('armed').map((r) => r.returnOppInBoxByClass[R[c]])),
    baseMedianGapTicksFromBins: medianFromBins(
      aggBins('base', (r) => r.returnGapBinsByClass[R[c]]), GAP_BIN_TICKS,
    ),
    armedMedianGapTicksFromBins: medianFromBins(
      aggBins('armed', (r) => r.returnGapBinsByClass[R[c]]), GAP_BIN_TICKS,
    ),
  };
};
const totalFace = face('bounceBackWithin240PerGkRelease');
const decompRows = RETURN_CLASSES.map(decompositionRow);
const risers = decompRows.filter((d) => d.ciStrictlyAboveZero)
  .sort((a, b) => b.delta - a.delta).map((d) => d.returnClass);
const decomposition = {
  what: '⭐⭐ THE ANSWER OF RECORD (#309 item 3(ii)): BK-T2\'s `bounceBackWithin240PerGkRelease` '
    + 'split by RETURN PATH on this stage\'s own paired virgin seeds. Same denominator on every '
    + 'row, so the rows SUM to the total row.',
  bkT2FaceUnderDecomposition: bkt2Face('bounceBackWithin240PerGkRelease'),
  bkT2AnyGapFace: bkt2Face('bounceBackAnyGapPerGkRelease'),
  bkT2GkReleasesPerMatch: bkt2Face('gkReleasesPerMatch'),
  bkT2ArtifactBytesSha256: BKT2_BYTES_SHA,
  thisStageTotal: {
    basePerRelease: round(totalFace.base.point, 6),
    armedPerRelease: round(totalFace.armed.point, 6),
    baseEvents: totalFace.base.num, armedEvents: totalFace.armed.num,
    baseReleases: totalFace.base.den, armedReleases: totalFace.armed.den,
    delta: round(totalFace.delta, 6),
    deltaCi95: [round(totalFace.deltaCi95[0], 6), round(totalFace.deltaCi95[1], 6)],
    absDeltaOverHalfWidth: round(totalFace.absDeltaOverHalfWidth, 3),
    relative: round(totalFace.relative, 6),
  },
  rows: decompRows,
  classesWhoseCiIsStrictlyAboveZero: risers,
  saveFamilyShareOfTheRise: (() => {
    const saveDelta = sum(SAVE_FAMILY.map((c) => face(`bounceBackWithin240_${c}_PerGkRelease`).delta));
    return round(totalFace.delta === 0 ? Number.NaN : saveDelta / totalFace.delta, 6);
  })(),
  distributionFamilyShareOfTheRise: (() => {
    const dDelta = sum(DISTRIBUTION_FAMILY
      .map((c) => face(`bounceBackWithin240_${c}_PerGkRelease`).delta));
    return round(totalFace.delta === 0 ? Number.NaN : dDelta / totalFace.delta, 6);
  })(),
  restartAwardShareOfTheRise: (() => {
    const rDelta = face('bounceBackWithin240_restartAward_PerGkRelease').delta;
    return round(totalFace.delta === 0 ? Number.NaN : rDelta / totalFace.delta, 6);
  })(),
  additivityCheck: {
    what: 'the class Δs must sum to the total Δ (same denominator on every row)',
    sumOfClassDeltas: round(sum(RETURN_CLASSES
      .map((c) => face(`bounceBackWithin240_${c}_PerGkRelease`).delta)), 12),
    totalDelta: round(totalFace.delta, 12),
    agreesToWithin1e9: Math.abs(sum(RETURN_CLASSES
      .map((c) => face(`bounceBackWithin240_${c}_PerGkRelease`).delta)) - totalFace.delta) < 1e-9,
  },
  caveat: '⚠ THE LADDER IS AN ORDERING, NOT AN EXCLUSIVE DIAGNOSIS (BK-C0 §DOUBTS 2\'s honest '
    + 'phrasing): a `parryRegather` chain usually ALSO saw opponent possession, which is why '
    + 'the opp-possession cross-tab is published on every row. NO FOOTBALL VERDICT is claimed '
    + 'here — this is a diagnostic ledger for the BK play-test gate, and nothing is scored.',
};

const namedObservations = {
  returnGapHistogramsByClass: {
    what: `the UNCENSORED return-gap histograms per RETURN CLASS (${GAP_BINS} bins × `
      + `${GAP_BIN_TICKS} ticks, index i = [i·${GAP_BIN_TICKS}, (i+1)·${GAP_BIN_TICKS}) ticks, `
      + `the last bin holding age = the retire cap ${CHAIN_RETIRE_TICKS})`,
    classes: RETURN_CLASSES,
    armedBins: agg2('armed', (r) => r.returnGapBinsByClass),
    baseBins: agg2('base', (r) => r.returnGapBinsByClass),
    armedMedianTicks: RETURN_CLASSES.map((c) => medianFromBins(
      aggBins('armed', (r) => r.returnGapBinsByClass[R[c]]), GAP_BIN_TICKS,
    )),
    baseMedianTicks: RETURN_CLASSES.map((c) => medianFromBins(
      aggBins('base', (r) => r.returnGapBinsByClass[R[c]]), GAP_BIN_TICKS,
    )),
    armedBeyondWindowShare: (() => {
      const b = agg2('armed', (r) => r.returnGapBinsByClass);
      const beyond = sum(b.map((bins) => sum(bins.slice(BOUNCE_WINDOW_TICKS / GAP_BIN_TICKS + 1))));
      const total = sum2(b);
      return round(ratio(beyond, total), 6);
    })(),
    baseBeyondWindowShare: (() => {
      const b = agg2('base', (r) => r.returnGapBinsByClass);
      const beyond = sum(b.map((bins) => sum(bins.slice(BOUNCE_WINDOW_TICKS / GAP_BIN_TICKS + 1))));
      const total = sum2(b);
      return round(ratio(beyond, total), 6);
    })(),
    beyondWindowNote: '⭐ BK-T2 §R3 measured 28.8 % (base) / 23.2 % (armed) of closures at gaps '
      + '≥ 250 ticks with the record retired at 420. This stage retires at 720, so the same '
      + 'quantity is re-read on a range three times the window — the honest test of whether 420 '
      + 'was itself censoring.',
    retireCapIsTheOnlyCensoringEdge: true,
  },
  returnGapHistogramsByChannel: {
    what: 'the same histograms per RELEASE KIND (channel × bins)',
    channels: GK_CHANNELS,
    armedBins: agg2('armed', (r) => r.returnGapBinsByChannel),
    baseBins: agg2('base', (r) => r.returnGapBinsByChannel),
  },
  channelByClassMatrix: {
    what: '⭐ RELEASE KIND × RETURN PATH, the full contingency table (within the window of '
      + 'record and at any gap), as COUNTS — the punt cell is thin by construction (see the '
      + 'stage doc\'s §DOUBTS 1) and is published as counts, never as a CI-bearing share',
    channels: GK_CHANNELS,
    classes: RETURN_CLASSES,
    armedWithinWindow: agg2('armed', (r) => r.returnWithinByChannelClass),
    baseWithinWindow: agg2('base', (r) => r.returnWithinByChannelClass),
    armedAnyGap: agg2('armed', (r) => r.returnByChannelClass),
    baseAnyGap: agg2('base', (r) => r.returnByChannelClass),
  },
  parryLedger: {
    what: '⭐ SAVE/PARRY events that never became a held release — BK-C0 §DOUBTS 4\'s own words, '
      + 'instrumented: a parry the keeper re-collects is NOT a distribution',
    fates: PARRY_FATES,
    armedByFate: aggBins('armed', (r) => r.parryByFate),
    baseByFate: aggBins('base', (r) => r.parryByFate),
    armedParryRegatherBins: aggBins('armed', (r) => r.parryRegatherBins),
    baseParryRegatherBins: aggBins('base', (r) => r.parryRegatherBins),
    armedParryRegatherMedianTicks: medianFromBins(
      aggBins('armed', (r) => r.parryRegatherBins), GAP_BIN_TICKS,
    ),
    baseParryRegatherMedianTicks: medianFromBins(
      aggBins('base', (r) => r.parryRegatherBins), GAP_BIN_TICKS,
    ),
    armedSaveCreditsHeld: sum(rowsOf('armed').map((r) => r.saveCreditsHeld)),
    baseSaveCreditsHeld: sum(rowsOf('base').map((r) => r.saveCreditsHeld)),
    armedSaveCreditsParry: sum(rowsOf('armed').map((r) => r.saveCreditsParry)),
    baseSaveCreditsParry: sum(rowsOf('base').map((r) => r.saveCreditsParry)),
  },
  acquisitionLedger: {
    what: '⭐ EVERY keeper ownership gain, by how it arose (the ladder in §4) — the honest '
      + 'answer to "how does a keeper get the ball in this world", independent of his releases',
    kinds: ACQ_KINDS,
    armedByKind: aggBins('armed', (r) => r.acqByKind),
    baseByKind: aggBins('base', (r) => r.acqByKind),
    armedAcquisitions: sum(rowsOf('armed').map((r) => r.gkAcquisitions)),
    baseAcquisitions: sum(rowsOf('base').map((r) => r.gkAcquisitions)),
    armedOwnershipEnds: sum(rowsOf('armed').map((r) => r.gkOwnershipEnds)),
    baseOwnershipEnds: sum(rowsOf('base').map((r) => r.gkOwnershipEnds)),
    armedEndsWithoutRelease: sum(rowsOf('armed').map((r) => r.gkOwnershipEndsWithoutRelease)),
    baseEndsWithoutRelease: sum(rowsOf('base').map((r) => r.gkOwnershipEndsWithoutRelease)),
  },
  caromTouchLedger: {
    what: 'the mean number of OTHER-BODY touches on a returning chain, per return class — the '
      + 'carom intensity behind `directCarom` (a bodyStrike is counted as a touch; the base arm '
      + 'has no bodyStrikes by construction, gBaseDormant)',
    classes: RETURN_CLASSES,
    armedTouchesTotal: aggBins('armed', (r) => r.returnCaromTouchesByClass),
    baseTouchesTotal: aggBins('base', (r) => r.returnCaromTouchesByClass),
    armedReturns: aggBins('armed', (r) => RETURN_CLASSES.map((_, ri) => sum(
      GK_CHANNELS.map((__, gi) => r.returnByChannelClass[gi][ri]),
    ))),
    baseReturns: aggBins('base', (r) => RETURN_CLASSES.map((_, ri) => sum(
      GK_CHANNELS.map((__, gi) => r.returnByChannelClass[gi][ri]),
    ))),
  },
};

const artifact: Record<string, unknown> = {
  stage: 'R9',
  what: 'THE POSSESSION-CHAIN LEDGER — instrument-only, NO scored hypothesis. It decomposes '
    + 'BK-T2 §R3\'s `bounceBackWithin240PerGkRelease` (+47 % armed, cause UNKNOWN) by RELEASE '
    + 'KIND × RETURN PATH on paired virgin seeds, with BK-C0 §CORR 2\'s censoring lesson built '
    + 'in from birth (retire at 3× the window; full bins stored per class).',
  doc: 'docs/world-model/R9-POSSESSION-CHAIN-LEDGER.md',
  question: '#309 item 3(ii) / BK-T2 §DOUBTS 3 / BK-C0 §DOUBTS 4',
  ruling: '#314 item 3',
  mode: MODE,
  hashedBodySchema: BODY_SCHEMA,
  definitions: {
    arms: { base: 'a4MatchFlags(8) + armA4World(m, null, 8, L3 dose, PC dose)',
      armed: 'BASE + bkFacingLaw: true + bkContactLaw: true' },
    armsProvenance: 'BK-T2\'s own construction, reused EXACTLY (both dose FILES hashed AS BYTES '
      + 'before they are parsed — canon dose-source guard)',
    pairing: 'every seed walked TWICE, one walk per arm; one bootstrap resample-index matrix '
      + 'draws BOTH arms so the pairing is inside every interval',
    gkChannels: GK_CHANNELS,
    gkChannelRule: 'BK-C0 §2(c) VERBATIM: punt = LoftedPass while gkDistributing (read at the '
      + 'PRE-STEP boundary) · throwOut = a shortPass signature whose actor is in the ThrowOut '
      + 'action · gkClearance = the clearance signature · gkShortPass = shortPass/throughBall · '
      + 'gkOther = everything else.',
    releaseScope: 'OPEN PLAY ONLY (phase === "playing" at the release tick) — BK-T2\'s own '
      + 'scope, kept so the decomposed face IS the face of record. Restart-origin keeper takes '
      + '(goal kicks) are therefore NOT releases here; they appear as `restartAward` RETURNS and '
      + 'as `acqRestartAward` acquisitions.',
    returnClasses: RETURN_CLASSES,
    returnClassLadder: '1 saveHeld (the keeper\'s own `saves` counter incremented ON the return '
      + 'tick — the engine\'s held-save path: tryKeeperSave\'s catch, tryAerial\'s high claim, '
      + 'trySmother, each `stats.saves++` then `giveBall(gk)` in the same tick) → 2 restartAward '
      + '(match.restartKickGid === gid at the return tick: the ball had LEFT PLAY and the keeper '
      + 'was AWARDED it) → 3 parryRegather (a save credit EARLIER in this chain with NO '
      + 'ownership — the parry branch — and he now owns it) → 4 oppControlledThenLost (an '
      + 'opponent established ownership during the chain) → 5 ownDefenderBackPass (a teammate '
      + 'did, and no opponent) → 6 directCarom (nobody else OWNED it but another body TOUCHED '
      + 'it: a lastTouch change with no ownership, or a BK bodyStrike) → 7 noOtherTouch (nobody '
      + 'else owned it or touched it) → 8 otherReturn (structurally unreachable; gated to 0).',
    returnClassLadderCaveat: '⚠ AN ORDERING, NOT AN EXCLUSIVE DIAGNOSIS (BK-C0 §DOUBTS 2\'s '
      + 'phrasing reused): the share is "the first thing that explains this return". The '
      + 'opp-possession cross-tab is published per class for exactly this reason.',
    returnResolution: 'BK-T2\'s own rule: the FIRST tick at which the RELEASING keeper owns the '
      + 'ball again (ownerGid === gid && ownerGid !== prevOwnerGid), once per chain.',
    saveFamily: SAVE_FAMILY,
    distributionFamily: DISTRIBUTION_FAMILY,
    acquisitionKinds: ACQ_KINDS,
    acquisitionLadder: '1 acqSaveHeld → 2 acqRestartAward → 3 acqParryRegather (a save credit '
      + 'without ownership since he last owned it) → 4 acqFromTeammate → 5 acqFromOpponent → '
      + '6 acqSelfRecollect (the last owner was HIMSELF) → 7 acqOther (nobody had owned it).',
    parryDefinition: 'a `saves` increment on a tick at which that player does NOT own the ball '
      + '— the engine\'s parry branch (ball deflected, lastTouch = gk, no giveBall). A parry the '
      + 'keeper re-collects is NOT a distribution (BK-C0 §DOUBTS 4\'s own words).',
    parryFates: PARRY_FATES,
    saveCreditSource: 'match.stat(gid).saves, read per player per tick as a DELTA; the sum of '
      + 'deltas is gated against the engine\'s FINAL counters (gSaveLedgerAgrees).',
    bounceBackWindowTicks: BOUNCE_WINDOW_TICKS,
    bounceBackWindowProvenance: '⭐ THE WINDOW OF RECORD is 240 ticks (BK-C0 §COMMANDER '
      + 'CORRECTIONS item 1 — what RAN), read here off the COMMITTED BK-C0 artifact\'s own '
      + '`definitions.bounceBackWindowTicks` (bytes hashed first), never re-derived by regex. '
      + 'It is kept because the face under decomposition is BK-T2\'s, and a different window '
      + 'would decompose a different number.',
    keeperLoftCapSeconds: KEEPER_LOFT_T_MAX,
    keeperLoftCapSrcLine: KEEPER_LOFT_LINE,
    keeperLoftRoundTripTicks: KEEPER_LOFT_ROUND_TRIP_TICKS,
    keeperLoftCapProvenance: '⭐ BK-C0 §COMMANDER CORRECTIONS item 1 named the keeper\'s OWN '
      + `loft cap (${KEEPER_LOFT_T_MAX} s, mechanics.ts:${KEEPER_LOFT_LINE}) "the arguably-`
      + 'correct source for any future re-derivation". It is EXTRACTED here anchored to the '
      + 'NAMED performKeeperThrow site (7th positional argument of loftKick) and PUBLISHED as '
      + 'the alternative window — NOT used as the window of record, because that would '
      + 'decompose a different face. Every window ≤ the retire cap re-derives off the stored '
      + 'bins.',
    puntLoftCapSeconds: PUNT_LOFT_T_MAX,
    puntLoftCapSrcLine: PUNT_LOFT_LINE,
    puntRoundTripTicks: PUNT_ROUND_TRIP_TICKS,
    chainRetireTicks: CHAIN_RETIRE_TICKS,
    chainRetireProvenance: '⭐⭐ 3 × the window of record. BK-C0 retired AT the window and made '
      + 'bins 25–40 structurally zero (§CORR 2); BK-T2 moved to 420 and found ~a quarter of all '
      + 'closures beyond 250 ticks with the median in the 90/100-tick bins — evidence that 420 '
      + 'was itself a guess. 720 ticks = 12 sim-s is far beyond any lofted round trip '
      + `(the punt\'s own is ${PUNT_ROUND_TRIP_TICKS} ticks), and the cap is published as the `
      + 'ONE remaining censoring edge.',
    gapBins: GAP_BINS,
    gapBinTicks: GAP_BIN_TICKS,
    gapBinEdgeConvention: 'index i covers ticks [i·10, (i+1)·10); the FINAL bin (index 72) '
      + 'holds exactly age = 720, the retire cap. Prose quotes LOWER edges (BK-C0 §CORR item 4 '
      + 'asked for the convention to be stated per face; it is stated once here and used '
      + 'everywhere).',
    oppInBoxDefinition: 'the engine\'s own `match.inPenaltyBox(ball.pos, keeperSide)` at the '
      + 'tick an opponent established ownership — no invented threshold.',
    caromTouchDefinition: 'a `lastTouch` change to a player who is neither the releasing keeper '
      + 'nor the new owner, or a tick on which `bkContactLedger.strikesApplied` increased.',
    noScoredHypothesis: '⭐ THIS STAGE SCORES NOTHING. Every face is REPORTED. The gates are '
      + 'instrument-integrity gates only; no football claim passes or fails here.',
    clockNote: `the match clock is ${MATCH_DURATION} s; every per-match rate below is per match `
      + '(walked matches average slightly more sim-seconds than the nominal clock — the '
      + 'per-seed `ticks` are stored so any exact-clock normalisation re-derives).',
    matchDurationSeconds: MATCH_DURATION,
  },
  world: {
    version: PC_WORLD,
    receiptSeed: RECEIPT_SEED,
    receiptConjuncts: RECEIPT,
    everyWalkedMatchConformed: rows.every((r) => r.worldOk),
    l3DoseFileBytesSha256: L3_BYTES_SHA,
    pcDoseFileBytesSha256: PC_BYTES_SHA,
    bkC0ArtifactBytesSha256: BKC0_BYTES_SHA,
    bkT2ArtifactBytesSha256: BKT2_BYTES_SHA,
    l3DoseLungesTotal: L3_DOSE_LUNGES,
    pcDoseExposuresTotal: PC_DOSE_EXPOSURES,
  },
  seeds: {
    block: BLOCK,
    batteryFirst: SEEDS[0],
    batteryLast: SEEDS[SEEDS.length - 1],
    pairedSeeds: N_SEEDS,
    batteryWalks: N_SEEDS * 2,
    receiptSeed: RECEIPT_SEED,
    walksBooked,
    smokePrefix: [BLOCK, BLOCK + 2],
    bookedEqualsWalked: walksBooked === N_SEEDS * 2 + 1,
  },
  stats: {
    base: STATS_BASE,
    step: STATS_STEP,
    resamples: BOOTSTRAP,
    estimator: 'PAIRED cluster bootstrap by match seed, percentile 95 % CIs; ONE resample-index '
      + 'matrix draws both arms',
    publishedBasesCheckedAgainst: STATS_PUBLISHED_BASES,
    minimumGapToAnyPublishedBase: minStatsGap,
    drawsTaken: 1,
    nextBaseAtLeast: STATS_BASE + STATS_STEP,
  },
  faces,
  decomposition,
  namedObservations,
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
};
const diskRow = (c: Record<string, unknown>): Row => c as unknown as Row;
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
const diskCells = onDisk.perSeedCells.map(diskRow);
for (const fr of onDisk.faces) {
  const def = FACES[fr.face];
  for (const arm of ARMS) {
    const rs = diskCells.filter((r) => r.arm === arm);
    const n = sum(rs.map((r) => def.num(r)));
    const dd = sum(rs.map((r) => def.den(r)));
    const side = arm === 'base' ? fr.base : fr.armed;
    faceChecks += 3;
    if (eq(side.num, n)) faceOk++; else faceFailures.push(`${fr.face}.${arm}.num`);
    if (eq(side.den, dd)) faceOk++; else faceFailures.push(`${fr.face}.${arm}.den`);
    if (eq(side.point, ratio(n, dd))) faceOk++; else faceFailures.push(`${fr.face}.${arm}.point`);
  }
  faceChecks += 1;
  if (eq(fr.delta, asNum(fr.armed.point) - asNum(fr.base.point))) faceOk++;
  else faceFailures.push(`${fr.face}.delta`);
}
/** every stored-bin face re-derives from the per-seed cells too (canon: percentile ⇒ bins) */
const binCheck = (stored: readonly number[], pick: (r: Row) => number[], arm: Arm): boolean => {
  const acc = zeros(stored.length);
  for (const r of diskCells.filter((r) => r.arm === arm)) addInto(acc, pick(r));
  return acc.every((v, i) => v === stored[i]);
};
const bin2Check = (stored: readonly (readonly number[])[], pick: (r: Row) => number[][],
  arm: Arm): boolean => stored.every((bins, i) => binCheck(bins, (r) => pick(r)[i], arm));
const binResults: [string, boolean][] = [
  ['returnGapBinsByClass.armed', bin2Check(namedObservations.returnGapHistogramsByClass.armedBins,
    (r) => r.returnGapBinsByClass, 'armed')],
  ['returnGapBinsByClass.base', bin2Check(namedObservations.returnGapHistogramsByClass.baseBins,
    (r) => r.returnGapBinsByClass, 'base')],
  ['returnGapBinsByChannel.armed', bin2Check(namedObservations.returnGapHistogramsByChannel.armedBins,
    (r) => r.returnGapBinsByChannel, 'armed')],
  ['returnGapBinsByChannel.base', bin2Check(namedObservations.returnGapHistogramsByChannel.baseBins,
    (r) => r.returnGapBinsByChannel, 'base')],
  ['channelByClass.armedWithin', bin2Check(namedObservations.channelByClassMatrix.armedWithinWindow,
    (r) => r.returnWithinByChannelClass, 'armed')],
  ['channelByClass.baseWithin', bin2Check(namedObservations.channelByClassMatrix.baseWithinWindow,
    (r) => r.returnWithinByChannelClass, 'base')],
  ['channelByClass.armedAny', bin2Check(namedObservations.channelByClassMatrix.armedAnyGap,
    (r) => r.returnByChannelClass, 'armed')],
  ['channelByClass.baseAny', bin2Check(namedObservations.channelByClassMatrix.baseAnyGap,
    (r) => r.returnByChannelClass, 'base')],
  ['parry.armedByFate', binCheck(namedObservations.parryLedger.armedByFate, (r) => r.parryByFate, 'armed')],
  ['parry.baseByFate', binCheck(namedObservations.parryLedger.baseByFate, (r) => r.parryByFate, 'base')],
  ['parry.armedRegatherBins', binCheck(namedObservations.parryLedger.armedParryRegatherBins,
    (r) => r.parryRegatherBins, 'armed')],
  ['parry.baseRegatherBins', binCheck(namedObservations.parryLedger.baseParryRegatherBins,
    (r) => r.parryRegatherBins, 'base')],
  ['acq.armedByKind', binCheck(namedObservations.acquisitionLedger.armedByKind, (r) => r.acqByKind, 'armed')],
  ['acq.baseByKind', binCheck(namedObservations.acquisitionLedger.baseByKind, (r) => r.acqByKind, 'base')],
  ['carom.armedTouches', binCheck(namedObservations.caromTouchLedger.armedTouchesTotal,
    (r) => r.returnCaromTouchesByClass, 'armed')],
  ['carom.baseTouches', binCheck(namedObservations.caromTouchLedger.baseTouchesTotal,
    (r) => r.returnCaromTouchesByClass, 'base')],
];
/** the medians published in `decomposition` re-derive from the stored bins on disk */
const medianResults: [string, boolean][] = RETURN_CLASSES.flatMap((c) => {
  const dRow = decompRows[R[c]];
  const reArmed = medianFromBins(
    (() => { const acc = zeros(GAP_BINS); for (const r of diskCells.filter((x) => x.arm === 'armed')) addInto(acc, r.returnGapBinsByClass[R[c]]); return acc; })(),
    GAP_BIN_TICKS,
  );
  const reBase = medianFromBins(
    (() => { const acc = zeros(GAP_BINS); for (const r of diskCells.filter((x) => x.arm === 'base')) addInto(acc, r.returnGapBinsByClass[R[c]]); return acc; })(),
    GAP_BIN_TICKS,
  );
  return [
    [`median.${c}.armed`, eq(dRow.armedMedianGapTicksFromBins, reArmed)] as [string, boolean],
    [`median.${c}.base`, eq(dRow.baseMedianGapTicksFromBins, reBase)] as [string, boolean],
  ];
});
const binFailures = [...binResults, ...medianResults].filter(([, v]) => !v).map(([k]) => k);
gates.gFaces = faceOk === faceChecks && binFailures.length === 0
  && decomposition.additivityCheck.agreesToWithin1e9;
(artifact as { gates: Record<string, boolean> }).gates = gates;
(artifact as { faceCoverage: unknown }).faceCoverage = {
  publishedFaces: FACE_KEYS.length,
  checksRun: faceChecks,
  checksPassed: faceOk,
  binChecksRun: binResults.length + medianResults.length,
  binFailures,
  additivityHolds: decomposition.additivityCheck.agreesToWithin1e9,
  failures: faceFailures,
};
/** the ALLOWLIST-SCHEMA hashed body, computed LAST so it covers the final gate values */
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
(artifact as { hashedBodySha256: string }).hashedBodySha256 = sha(canonical(body));
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
banner('');
banner('=== R9 — THE POSSESSION-CHAIN LEDGER ===');
banner(`artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
const show = (k: string): string => {
  const f = face(k);
  return `${k}: base=${round(f.base.point, 6)} armed=${round(f.armed.point, 6)} `
    + `Δ=${round(f.delta, 6)} CI[${round(f.deltaCi95[0], 6)}, ${round(f.deltaCi95[1], 6)}] `
    + `|Δ|/hw=${round(f.absDeltaOverHalfWidth, 3)} n=${f.base.num}/${f.armed.num}`;
};
banner(show('bounceBackWithin240PerGkRelease'));
banner('--- THE DECOMPOSITION (same denominator on every row) ---');
for (const c of RETURN_CLASSES) banner(`  ${show(`bounceBackWithin240_${c}_PerGkRelease`)}`);
banner('--- the two families ---');
banner(`  ${show('bounceBackWithin240_saveFamily_PerGkRelease')}`);
banner(`  ${show('bounceBackWithin240_distributionFamily_PerGkRelease')}`);
banner(`  save-family share of the RISE = ${decomposition.saveFamilyShareOfTheRise} · `
  + `distribution-family = ${decomposition.distributionFamilyShareOfTheRise} · `
  + `restartAward = ${decomposition.restartAwardShareOfTheRise}`);
banner(`  classes with CI strictly above zero: [${risers.join(', ')}]`);
banner('--- context ---');
for (const k of ['gkReleasesPerMatch', 'bounceBackAnyGapPerGkRelease',
  'saveCreditsPerMatch', 'parryShareOfSaveCredits', 'parryRegatherWithin240Share',
  'gkAcquisitionsPerMatch', 'acqSaveHeldShareOfAcquisitions',
  'acqRestartAwardShareOfAcquisitions', 'gkLostWithoutReleaseShare',
  'bounceBackWithin240PerPuntRelease', 'bounceBackWithin240PerGkShortPassRelease']) {
  banner(`  ${show(k)}`);
}
banner(`  beyond-window share of closures: base=`
  + `${namedObservations.returnGapHistogramsByClass.baseBeyondWindowShare} armed=`
  + `${namedObservations.returnGapHistogramsByClass.armedBeyondWindowShare}`);
banner(`walks booked = walked: ${walksBooked}  ·  wall ${round((Date.now() - t0Wall) / 1000, 1)} s`);
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
if (red.length > 0) banner(`RED GATES: ${red.join(', ')} — REPORTED, NEVER PATCHED`);
process.exit(red.length > 0 ? 1 : 0);
