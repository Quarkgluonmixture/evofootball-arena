#!/usr/bin/env tsx
/**
 * ============================================================================
 * DF-T3 — THE SURFACE EXAM (instrument-only; H-DF.1(a)+(b) scored on virgin seeds)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #331 item 5, bound by
 * `docs/world-model/DF-DEFENSIVE-BRAIN-CONTRACT.md` §1 (H-DF.1 / H-DF.2) and §2
 * M-DF.2 ("the exam proves H-DF.1(b) INSIDE the cap first, THEN the cap-off arm
 * proves the surface alone holds the band") + M-DF.3 (the 范戴克/佩佩 axis,
 * REPORTED) + M-DF.4 ("the ecological gate: EVERY DF exam reports the season
 * ladder beside match-grain faces").
 *
 * ⛔ THE CAP-OFF ARM IS EXPLICITLY OUT — M-DF.2's own order; a later stage.
 *
 * ⭐ INSTRUMENT-ONLY. `src/**` is UNTOUCHED by this stage: the #327 §CORR 1/5
 * riders (the disambiguated :696 pin, the ledger.idle docblock fix) landed in
 * their own commit BEFORE this file was frozen, and are comment-only in src.
 * `gSrcUntouched` proves it at run time.
 *
 * ⭐⭐ THE SCORED CLAIMS — PRE-REGISTERED, FROZEN BEFORE THE BATTERY, NEVER
 * RE-CUT AFTER SIGHT:
 *
 *   H-DF.1(a) — GENUINE DIFFERENTIATION AT CLAIM GRAIN, two conjuncts:
 *     (a1) BY SITUATION — the PRESS ELECTION share resolves apart across the
 *          team modes: byModeOptionShareDefend[press] vs
 *          byModeOptionSharePress[press], each with its own seed-clustered
 *          bootstrap interval, and the two intervals must be DISJOINT.
 *     (a2) BY BODY — the attrs.defending TERCILE gradient resolves for PRESS
 *          AND for TAKE: the top and bottom tercile shares' intervals DISJOINT
 *          and the three point estimates STRICTLY MONOTONE in tercile index,
 *          for BOTH options.
 *     ⚠⚠ THE INHERITED CAUTION, STATED LOUDLY (DF-T2 §R11 item 1 / #327 §CORR 2):
 *     at the receipts' grain 407 of 410 bodies were HOLD-MODAL and not one body
 *     was modal on press or jump. If (a1)/(a2) pass while that body-modal
 *     degeneracy persists, BOTH are reported — the verdict is the conjuncts',
 *     the caution is the reader's. The body-modal census is therefore RE-RUN
 *     here at exam grain and published beside the verdict.
 *     ⚠ THE MECHANISM OF RECORD (#327 §CORR 5) is TWO PRICED ELECTIONS + ONE
 *     DERIVED LABEL — press-vs-mark and hold-vs-switch are CHOSEN; jump-vs-take
 *     is the account's own sign LABELLING the outcome. H-DF.1(a) is phrased on
 *     that mechanism, never as "four choosable acts".
 *
 *   H-DF.1(b) — THE SWARM DOES NOT RETURN, INSIDE THE CAP, three conjuncts:
 *     (b1) the FOUR-CHASER bin is EXACTLY ZERO in BOTH arms (structural);
 *     (b2) multiChaseShare2 AND multiChaseShare3 do NOT RISE resolvedly armed
 *          (frozen direction: NOT-RISE — a non-inferiority read; each fails
 *          only on a RESOLVED move in the bad direction);
 *     (b3) the `assignChasers` slice is SHA-IDENTICAL across the whole stage,
 *          to DF-T2's sha of record
 *          5b4a21d036e9d97027a360f166621d747374ec5c42ead20b9ed132919872703c
 *          (hashed BEFORE the battery and again AFTER it).
 *
 * ⭐ THE FROZEN CI RULES (pre-registered; NEVER re-cut after sight):
 *   · PER-SEED CELLS are stored so every headline re-derives (canon, home
 *     ruling #282.2(ii)).
 *   · BETWEEN-ARM faces (the same seeds walked twice, the door the only
 *     difference) use the PAIRED DELTA (armed − shut) with a SEED-CLUSTERED
 *     PAIRED bootstrap: resample the walked seeds with replacement, compute
 *     BOTH arms' ratios over the SAME resampled seed set in every draw, then
 *     the delta. RESOLVED iff the interval EXCLUDES ZERO.
 *   · WITHIN-ARM contrasts (a1's two modes, a2's terciles) are UNPAIRED: each
 *     side gets its own seed-clustered bootstrap interval and the frozen test
 *     is INTERVAL OVERLAP — DISJOINT = resolved apart.
 *   · 2,000 resamples everywhere; 95 % percentile intervals; every bootstrap
 *     rng is seeded from its own published STATS BASE (block base discipline).
 *   · Canon VERBATIM: "a starred finding states its |Δ|÷half-width ratio"
 *     (home BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2).
 *   · Canon (paraphrase): moving denominators disclosed per face (home PW-C0
 *     §CORR item 2) — every face publishes its own `denNote`.
 *   · Canon (paraphrase): clock honesty — every rate on the 240 s match clock
 *     or dual-axis; APPLIED values, never nominal.
 *
 * REPORTED, NEVER GATED:
 *   ⭐ THE SEASON LADDER (goals × generation, BOTH arms, judged against the
 *     atkFrozen FLOOR +0.2211 — DF-C0 §R4, #320 item 3's frozen direction:
 *     deviations ROUTE TO SLICES, never to nudges).
 *   ⭐ INTERCEPTIONS / TACKLES AT LADDER GRAIN — DF-C0 §R4's ESTIMAND (evolved
 *     league play across generations). ⚠ DF-T2 §R11 item 6's warning binds: the
 *     friendly-match `team.stats` numbers are NOT this estimand and the two must
 *     never be quoted as the same number. Both are published, each labelled.
 *   ⭐ THE PRESS REALISATION RATE (#327 §CORR 3) — the election-vs-act honest
 *     denominator: press ELECTIONS joined to REALISED Phase-29.1 contains.
 *   · multiChaseShare2/3 · the R-乙 chain faces (Q01/Q05/Q06/Q14/Q07) ·
 *     the churn/coverage family · goals + the §2 faces at match grain.
 *
 * ⭐ CANON HONOURED (sentences COPIED from docs/world-model/CANON.md, #301):
 *   · freeze-before-battery (home ruling #266.3(c)).
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not
 *     in the schema never enters the body; forbidden-name lists are retired"
 *     (home PC-T0 §CORR item 1).
 *   · per-seed cells (home ruling #282.2(ii)).
 *   · "the re-derivation gate covers EVERY published face; a percentile face
 *     requires stored bins" (home PC-C0 §CORR item 4).
 *   · "a field carries the unit its name claims" (home ruling #294 item 3).
 *   · "a src-extracted constant pins its extraction to the NAMED call site —
 *     anchored match + line receipt — never first-occurrence" (home BK-C0
 *     §CORR item 1).
 *   · "a max−min face reports a noise-floor comparison, not a zero-null CI"
 *     (home PC-T1 §CORR item 3) — no max−min face is published here.
 *   · "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits
 *     matchFlags; true since #155, stated now, test-pinned; refines #270's E4
 *     correction; matches the perf diagnostic)" (home ruling #283.2(iv)).
 *   · seed discipline: BOOKED = WALKED; blocks consumed whole; stats step ≥ 200.
 *   · DF-C0 §CORR item 2 (ruling #321): the body is hashed LAST, after EVERY
 *     gate is written — including `gFacesFromDisk`, which re-parses a STAGING
 *     file off disk.
 *   · RED runs write a side path; the canonical path is only reached all-green.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: DFT3_MODE (smoke|full, REQUIRED) · DFT3_N · DFT3_GENS · DFT3_OUT.
 *   ANY other `DFT3_*` var is a FATAL refusal, and so is ANY engine env door.
 *   An override run (smoke / N / GENS / OUT) may NOT write the canonical path.
 *
 * RUN: DFT3_MODE=full npx tsx scripts/probes/df-t3-surface-exam.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) ·
 *       2 = an env refusal · 3 = the construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { DT, MATCH_DURATION, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { randomGenome, GENE_KEYS } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { DF_SURFACE_OPTIONS } from '../../src/ai/TeamBrain';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';

const banner = (s: string): void => { process.stdout.write(`${s}\n`); };

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE                                               */
/* ========================================================================== */
const ENV_WHITELIST = ['DFT3_MODE', 'DFT3_N', 'DFT3_GENS', 'DFT3_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE_ARMED', 'A4_WORLD', 'EVO_', 'SIM_'];
for (const k of Object.keys(process.env)) {
  if (k.startsWith('DFT3_') && !(ENV_WHITELIST as readonly string[]).includes(k)) {
    console.error(`ENV REFUSAL: ${k} is not on the whitelist`);
    process.exit(2);
  }
  if (ENGINE_DOORS.some((d) => k === d || k.startsWith(d))) {
    console.error(`ENV REFUSAL: engine door ${k} is set`);
    process.exit(2);
  }
}
type Mode = 'smoke' | 'full';
const MODE = process.env.DFT3_MODE as Mode | undefined;
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('ENV REFUSAL: DFT3_MODE must be smoke|full');
  process.exit(2);
}
const N_ENV = process.env.DFT3_N === undefined ? null : Number(process.env.DFT3_N);
const GENS_ENV = process.env.DFT3_GENS === undefined ? null : Number(process.env.DFT3_GENS);
const OUT_OVERRIDE = process.env.DFT3_OUT ?? null;
const CANONICAL_OUT = 'docs/world-model/data/df-t3-surface-exam.json';
const OUT = OUT_OVERRIDE ?? CANONICAL_OUT;
const IS_OVERRIDE = OUT_OVERRIDE !== null || MODE !== 'full' || N_ENV !== null || GENS_ENV !== null;
if (IS_OVERRIDE && OUT === CANONICAL_OUT) {
  console.error('REFUSAL: an override run (smoke / N / GENS / OUT) may not write the canonical path');
  process.exit(2);
}

/* ========================================================================== */
/* §1 SEEDS — BOOKED = WALKED, the block consumed whole                       */
/* ========================================================================== */
/** DF-T3's OWN booked block (ruling #331 item 5): 12,515,000–999. */
const BLOCK_BASE = 12_515_000;
const RECEIPT_SEED = BLOCK_BASE + 999;
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 40 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
/**
 * THE SUB-RANGES, DECLARED BEFORE THE RUN (BOOKED = WALKED reported after):
 *   12,515,000 – 12,515,039  the exam battery (40 paired seeds)
 *   12,515,800 – 12,515,802  the in-band smoke prefix
 *   12,515,900 – 12,515,903  the season ladder's four league seeds (the SAME four
 *                            leagues in BOTH arms — the paired design)
 *   12,515,999               the xxx,999 world-construction receipt seed (walked)
 * THE BLOCK 12,515,000–999 IS CONSUMED WHOLE OF RECORD either way.
 */
const FULL_SEEDS = [
  ...Array.from({ length: N_SEEDS }, (_, i) => BLOCK_BASE + i),
  RECEIPT_SEED,
];
const SMOKE_SEEDS = [BLOCK_BASE + 800, BLOCK_BASE + 801, BLOCK_BASE + 802];
const SEEDS = MODE === 'full' ? FULL_SEEDS : SMOKE_SEEDS;

/* ========================================================================== */
/* §2 THE WORLD, AND THE ANCHORED SRC EXTRACTIONS                             */
/* ========================================================================== */
const DF_WORLD = 9 as const;
const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>) as readonly L3DoseCell[];
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

const readSrc = (rel: string): string => readFileSync(rel, 'utf8');
/**
 * ⭐ ANCHORED EXTRACTION (canon, home BK-C0 §CORR item 1): each constant is pulled from ONE
 * named line that must occur EXACTLY ONCE in its file. Never first-occurrence, never a
 * re-typed literal. The first four are DF-C0 §R2 / DF-T1 §R6's; the last two are DF-T2's
 * (the shipped Phase-29.1 contain branch — the executable form of PRESS, and the geometry
 * this stage's REALISATION instrument reads).
 */
interface Anchor { id: string; file: string; line: string; re: RegExp }
const CONTAIN_LINE =
  '      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {';
const ANCHORS: readonly Anchor[] = [
  {
    id: 'markStanceBand',
    file: 'src/ai/actionExecutor.ts',
    line: '        let markDist = ball.owner === mark ? 2.6 : 2.6 - g.markingAggression * 1.4;',
    re: /mark \? (\d+(?:\.\d+)?) :/,
  },
  {
    id: 'zonalEngageRadius9',
    file: 'src/ai/TeamBrain.ts',
    line: '      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;',
    re: /threat\.pos\) > (\d+(?:\.\d+)?)\)/,
  },
  {
    id: 'markRange22',
    file: 'src/ai/TeamBrain.ts',
    line: '      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };',
    re: /d < (\d+(?:\.\d+)?) &&/,
  },
  {
    id: 'touchControlDist',
    file: 'src/sim/constants.ts',
    line: 'export const TOUCH_CONTROL_DIST = 4.2;',
    re: /TOUCH_CONTROL_DIST = (\d+(?:\.\d+)?);/,
  },
  {
    id: 'containRadius8',
    file: 'src/ai/PlayerBrain.ts',
    line: CONTAIN_LINE,
    re: /dC < (\d+(?:\.\d+)?) &&/,
  },
  {
    id: 'containTerritory35',
    file: 'src/ai/PlayerBrain.ts',
    line: CONTAIN_LINE,
    re: /carrierGoalD < (\d+(?:\.\d+)?) &&/,
  },
];
interface AnchorReceipt { id: string; file: string; line: string; matches: number; lineNumbers: number[]; value: number }
const anchorReceipts: AnchorReceipt[] = ANCHORS.map((a) => {
  const lines = readSrc(a.file).split('\n');
  const hits = lines.map((l, i) => (l === a.line ? i + 1 : 0)).filter((n) => n > 0);
  const m = a.re.exec(a.line);
  return {
    id: a.id, file: a.file, line: a.line, matches: hits.length, lineNumbers: hits,
    value: m === null ? Number.NaN : Number(m[1]),
  };
});
const anchorOf = (id: string): number => {
  const r = anchorReceipts.find((x) => x.id === id);
  return r === undefined || r.matches !== 1 ? Number.NaN : r.value;
};
const SWARM_R_STANCE = anchorOf('markStanceBand');
const SWARM_R_ZONE = anchorOf('zonalEngageRadius9');
const MARK_RANGE = anchorOf('markRange22');
const PRESSURE_R = anchorOf('touchControlDist');
const CONTAIN_RADIUS_M = anchorOf('containRadius8');
const CONTAIN_TERRITORY_M = anchorOf('containTerritory35');
const ANCHORS_OK = SWARM_R_STANCE === 2.6 && SWARM_R_ZONE === 9 && MARK_RANGE === 22
  && PRESSURE_R === TOUCH_CONTROL_DIST && CONTAIN_RADIUS_M === 8 && CONTAIN_TERRITORY_M === 35;
if (!ANCHORS_OK) {
  console.error('CONSTRUCTION CLASS: an anchored extraction did not resolve', anchorReceipts);
  process.exit(3);
}
/** the Phase-29.1 contain candidate's OWN `why` prefix — the realisation instrument's needle */
const CONTAIN_WHY_PREFIX = 'contain ';
const CONTAIN_WHY_LINE = '            why: `contain ${carrier.name} — hold goal-side`,';
const containWhyOccurrences = readSrc('src/ai/PlayerBrain.ts').split('\n')
  .filter((l) => l === CONTAIN_WHY_LINE).length;

/* ---- (b3) THE CAP CONJUNCT: the assignChasers slice, sha-identical ---- */
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }); } catch { return 'GIT-FAILED'; }
};
/**
 * DF-T2 §R6's sha OF RECORD over the `assignChasers` slice, quoted from
 * DF-T2-DECISION-SURFACE.md §R6 and re-stated in ruling #331 item 5. The slice is taken with
 * DF-T2's OWN slicing convention (the pin suite's), so the two sides are comparable bytes.
 */
const CAP_SHA_OF_RECORD = '5b4a21d036e9d97027a360f166621d747374ec5c42ead20b9ed132919872703c';
const capSlice = (source: string): string => source.slice(
  source.indexOf('function assignChasers(team: Team, match: Match): void {'),
  source.indexOf('/**\n * Marks: each non-chasing outfielder'),
);
const CAP_RULE_LINE = "    if (team.mode === 'Press' || team.genome.pressIntensity > 0.78) count += 1;";
const capShaNow = (): string =>
  createHash('sha256').update(capSlice(readSrc('src/ai/TeamBrain.ts'))).digest('hex');
const capShaBefore = capShaNow();
const capRuleOccurrences = readSrc('src/ai/TeamBrain.ts').split('\n')
  .filter((l) => l === CAP_RULE_LINE).length;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/**
 * ⭐ THE ARMS (frozen at dispatch, #331 item 5):
 *   shut  = the world-9 stack + `dfAssignPersist` — DF-T1's BANKED world;
 *   armed = the same + `dfSurface`.
 * `dfSurface` is the ONLY difference (DF-T2 §P2(c)'s battery cell, verbatim).
 */
const buildMatch = (seed: number, armed: boolean): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(DF_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
    dfAssignPersist: true,
    ...(armed ? { dfSurface: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, DF_WORLD, L3_DOSE, PC_DOSE);
  return m;
};

/* ========================================================================== */
/* §3 THE INSTRUMENT — DF-C0 §R2's definitions verbatim + DF-T2's usage ledger */
/*     + THIS stage's own PRESS REALISATION walker (#327 §CORR 3)              */
/* ========================================================================== */
const DUP_RUN_M = 4;
const N_OPT = DF_SURFACE_OPTIONS.length;
type Family = 'ONBALL' | 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'OTHER';
const familyOf = (p: Player, m: Match): Family => {
  if (m.ball.owner === p) return 'ONBALL';
  switch (p.action.type) {
    case 'MoveToFormationSpot':
    case 'HoldPosition': return 'FORMATION';
    case 'SupportBallCarrier': return 'SUPPORT';
    case 'MakeRun': return 'RUN';
    case 'MarkOpponent': return 'MARK';
    case 'ChaseBall':
    case 'ReceivePass':
    case 'InterceptPass': return 'BALL';
    default: return 'OTHER';
  }
};
const LAT_BINS = 8;
const LAT_BIN_S = 0.5;
const latBinOf = (s: number): number => Math.min(LAT_BINS - 1, Math.floor(s / LAT_BIN_S));
const SWARM_BINS = 6;

const nearestOpponent = (m: Match, p: Player): number => {
  let best = Infinity;
  for (const o of m.teams[(1 - p.side) as 0 | 1].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
    if (d < best) best = d;
  }
  return best;
};
interface Spell { team: 0 | 1; startTick: number; endTick: number; touches: number; origin: 'openPlay' | 'kickoff' | 'restart' }

interface Row {
  arm: 'shut' | 'armed';
  seed: number;
  worldOk: boolean;
  ticks: number;
  playingTicks: number;
  defTeamTicks: number;
  defenderTicks: number;
  markSwitches: number;
  markAbandons: number;
  markStarts: number;
  chaseStarts: number;
  chaseAbandons: number;
  markHeldTicks: number;
  reTargetLatencyBins: number[];
  reTargetLatencyCount: number;
  reTargetLatencyTickSum: number;
  markPairTicks: number;
  dupMarkTicks: number;
  multiChase2Ticks: number;
  multiChase3Ticks: number;
  carrierTicks: number;
  swarmStanceBins: number[];
  swarmZoneBins: number[];
  chaserCountBins: number[];
  /* ⭐ THE PRESS REALISATION WALKER (#327 §CORR 3) — the election-vs-act join */
  containOfferTicks: number;
  containActTicks: number;
  containEpisodes: number;
  /* the R-乙 chain accumulators (definitions VERBATIM from R-YI via BK-T2) */
  openSpells: number;
  openSpellTickSum: number;
  openSpellTouchSum: number;
  openFirstReceptions: number;
  openFirstReceptionsPressed: number;
  enginePasses: number;
  enginePassesCompleted: number;
  enginePassesForward: number;
  /* the §2 equilibrium faces (REPORTED only) */
  goals: number;
  shots: number;
  crosses: number;
  headersWon: number;
  longBalls: number;
  cutbacks: number;
  tackles: number;
  interceptions: number;
  /* DF-T2 §THE USAGE LEDGER, read off the match at the whistle */
  elections: number;
  idle: number;
  pressOffered: number;
  pressDeclinedByBook: number;
  byOption: number[];
  byModeOption: number[];
  /** per-body: [defendingAttr, press, hold, jump, take] — the join happens HERE, not in src */
  bodyRows: number[][];
  stepWallMs: number;
}

const worldConjuncts = (m: Match, armed: boolean): Record<string, boolean> => {
  const mm = m as unknown as {
    pcLatency: unknown; l3Defence: unknown;
    c7Windup: boolean; o1PassWindup: boolean; pcReactionLatency: boolean;
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
  };
  return {
    armedVersionIsWorldNine: a4ArmedVersion(m) === BK_WORLD_VERSION,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    l3BooksPresent: mm.l3Defence !== null,
    bkLawsArmed: m.bkFacingLaw === true && m.bkContactLaw === true,
    l3DefenceDoorsArmed: mm.l3DefenceLearn === true && mm.l3DefenceVeto === true,
    /** DF-T1's BANKED world is the FLOOR of both arms */
    persistenceArmedBothArms: m.dfAssignPersist === true,
    /** THE ONLY ARM DIFFERENCE */
    surfaceDoorMatchesArm: m.dfSurface === armed,
  };
};

const walk = (seed: number, armed: boolean): Row => {
  const m = buildMatch(seed, armed);
  const wOk = Object.values(worldConjuncts(m, armed)).every(Boolean);
  const row: Row = {
    arm: armed ? 'armed' : 'shut',
    seed, worldOk: wOk, ticks: 0, playingTicks: 0, defTeamTicks: 0, defenderTicks: 0,
    markSwitches: 0, markAbandons: 0, markStarts: 0, chaseStarts: 0, chaseAbandons: 0,
    markHeldTicks: 0,
    reTargetLatencyBins: Array.from({ length: LAT_BINS }, () => 0),
    reTargetLatencyCount: 0, reTargetLatencyTickSum: 0,
    markPairTicks: 0, dupMarkTicks: 0, multiChase2Ticks: 0, multiChase3Ticks: 0,
    carrierTicks: 0,
    swarmStanceBins: Array.from({ length: SWARM_BINS }, () => 0),
    swarmZoneBins: Array.from({ length: SWARM_BINS }, () => 0),
    chaserCountBins: Array.from({ length: 5 }, () => 0),
    containOfferTicks: 0, containActTicks: 0, containEpisodes: 0,
    openSpells: 0, openSpellTickSum: 0, openSpellTouchSum: 0,
    openFirstReceptions: 0, openFirstReceptionsPressed: 0,
    enginePasses: 0, enginePassesCompleted: 0, enginePassesForward: 0,
    goals: 0, shots: 0, crosses: 0, headersWon: 0, longBalls: 0, cutbacks: 0,
    tackles: 0, interceptions: 0,
    elections: 0, idle: 0, pressOffered: 0, pressDeclinedByBook: 0,
    byOption: Array.from({ length: N_OPT }, () => 0),
    byModeOption: Array.from({ length: 2 * N_OPT }, () => 0),
    bodyRows: [], stepWallMs: 0,
  };
  const prevMark = new Map<number, number | null>();
  const prevChaser = new Map<number, boolean>();
  const prevContain = new Map<number, boolean>();
  const lostAt = new Map<number, number>();
  const key = (side: number, idx: number): number => side * 100 + idx;
  const spells: Spell[] = [];
  let cur: Spell | null = null;
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  const finish = (s: Spell, at: number): void => { s.endTick = at; spells.push(s); };
  const t0 = Date.now();
  let tick = 0;
  while (!m.finished) {
    m.step(DT);
    row.ticks += 1;
    tick += 1;

    /* ====== the R-乙 SPELL WALKER (Q01/Q05/Q14 VERBATIM, BK-T2 §(d)'s code) ====== */
    {
      const playing = m.phase === 'playing';
      const ownerGid = m.ball.owner?.gid ?? null;
      if (!playing) {
        if (cur !== null) { finish(cur, tick); cur = null; }
        prevOwnerGid = ownerGid;
      } else {
        if (ownerGid !== null) {
          const owner = m.allPlayers[ownerGid];
          const side = owner.side as 0 | 1;
          if (cur !== null && cur.team !== side) { finish(cur, tick); cur = null; }
          if (cur === null) {
            const origin: Spell['origin'] = m.kickoffKickGid === ownerGid ? 'kickoff'
              : m.restartKickGid === ownerGid ? 'restart' : 'openPlay';
            cur = { team: side, startTick: tick, endTick: tick, touches: 0, origin };
          }
          if (ownerGid !== prevOwnerGid) {
            cur.touches += 1;
            if (cur.origin === 'openPlay' && cur.touches === 1) {
              row.openFirstReceptions += 1;
              if (nearestOpponent(m, owner) <= PRESSURE_R) row.openFirstReceptionsPressed += 1;
            }
          }
        }
        prevOwnerGid = ownerGid;
      }
    }

    if (m.phase !== 'playing') continue;
    row.playingTicks += 1;
    const carrier = m.ball.owner;
    if (carrier !== null) row.carrierTicks += 1;
    for (const t of m.teams) {
      const side = t.side;
      const defending = m.possessionSide !== side;
      if (!defending) {
        for (const p of t.players) { lostAt.delete(key(side, p.index)); prevContain.set(key(side, p.index), false); }
        continue;
      }
      row.defTeamTicks += 1;
      row.chaserCountBins[Math.min(4, t.chasers.size)] += 1;
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      row.defenderTicks += outfield.length;
      const markTargets: Array<{ idx: number; pos: { x: number; y: number } }> = [];
      let ballFamily = 0;
      const ownGoal = t.ownGoal();
      const carrierIsOpp = carrier !== null && carrier.side !== side;
      const carrierGoalD = carrierIsOpp
        ? Math.hypot(carrier!.pos.x - ownGoal.x, carrier!.pos.y - ownGoal.y) : Infinity;
      for (const p of outfield) {
        const k = key(side, p.index);
        const cur2 = t.marks.has(p.index) ? (t.marks.get(p.index) as number) : null;
        const prev = prevMark.has(k) ? (prevMark.get(k) as number | null) : null;
        if (cur2 !== null) row.markHeldTicks += 1;
        if (prev !== null && cur2 !== null && prev !== cur2) {
          row.markSwitches += 1;
          const at = lostAt.get(k);
          if (at !== undefined) lostAt.delete(k);
        } else if (prev !== null && cur2 === null) {
          row.markAbandons += 1;
          lostAt.set(k, tick);
        } else if (prev === null && cur2 !== null) {
          row.markStarts += 1;
          const at = lostAt.get(k);
          if (at !== undefined) {
            const dTicks = tick - at;
            row.reTargetLatencyBins[latBinOf(dTicks * DT)] += 1;
            row.reTargetLatencyCount += 1;
            row.reTargetLatencyTickSum += dTicks;
            lostAt.delete(k);
          }
        }
        prevMark.set(k, cur2);
        const isChaser = t.chasers.has(p.index);
        const wasChaser = prevChaser.get(k) === true;
        if (isChaser && !wasChaser) row.chaseStarts += 1;
        if (!isChaser && wasChaser) row.chaseAbandons += 1;
        prevChaser.set(k, isChaser);
        /* ====== ⭐ THE PRESS REALISATION WALKER (#327 §CORR 3) ======
         * THE OFFER POPULATION, by anchored extraction from the contain branch's OWN line:
         * a defender who holds NO mark, is not a chaser, and satisfies the branch's three
         * geometric preconditions (inside CONTAIN_RADIUS_M of the carrier · the carrier
         * inside CONTAIN_TERRITORY_M of our goal · goal-side of him). THE ACT: the shipped
         * brain's realised ARGMAX is the contain candidate — read off `p.action` (type
         * MarkOpponent, targetIdx the carrier, and the winning candidate's own `why` string).
         * An EPISODE is a maximal contiguous run of realised ticks — the decision-grain
         * numerator the ELECTION denominator can be joined to. */
        const offered = cur2 === null && !isChaser && carrierIsOpp
          && Math.hypot(p.pos.x - carrier!.pos.x, p.pos.y - carrier!.pos.y) < CONTAIN_RADIUS_M
          && carrierGoalD < CONTAIN_TERRITORY_M
          && Math.hypot(p.pos.x - ownGoal.x, p.pos.y - ownGoal.y) < carrierGoalD;
        if (offered) row.containOfferTicks += 1;
        const acting = carrierIsOpp && p.action.type === 'MarkOpponent'
          && p.action.targetIdx === carrier!.index
          && (p.action.scores[0]?.why ?? '').startsWith(CONTAIN_WHY_PREFIX);
        if (acting) {
          row.containActTicks += 1;
          if (prevContain.get(k) !== true) row.containEpisodes += 1;
        }
        prevContain.set(k, acting);
        const fam = familyOf(p, m);
        if (fam === 'MARK' && cur2 !== null) {
          const target = m.teams[1 - side].players[cur2];
          if (target !== undefined) markTargets.push({ idx: p.index, pos: target.pos });
        }
        if (fam === 'BALL') ballFamily += 1;
      }
      if (markTargets.length >= 2) {
        row.markPairTicks += 1;
        let dup = false;
        for (let i = 0; i < markTargets.length && !dup; i++) {
          for (let j = i + 1; j < markTargets.length && !dup; j++) {
            const dx = markTargets[i].pos.x - markTargets[j].pos.x;
            const dy = markTargets[i].pos.y - markTargets[j].pos.y;
            if (Math.hypot(dx, dy) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) row.dupMarkTicks += 1;
      }
      if (ballFamily >= 2) row.multiChase2Ticks += 1;
      if (ballFamily >= 3) row.multiChase3Ticks += 1;
      if (carrierIsOpp) {
        let inStance = 0;
        let inZone = 0;
        for (const p of outfield) {
          const d = Math.hypot(p.pos.x - carrier!.pos.x, p.pos.y - carrier!.pos.y);
          if (d < SWARM_R_STANCE) inStance += 1;
          if (d < SWARM_R_ZONE) inZone += 1;
        }
        row.swarmStanceBins[Math.min(SWARM_BINS - 1, inStance)] += 1;
        row.swarmZoneBins[Math.min(SWARM_BINS - 1, inZone)] += 1;
      }
    }
  }
  if (cur !== null) finish(cur, m.simTick);
  const open = spells.filter((s) => s.origin === 'openPlay');
  row.openSpells = open.length;
  row.openSpellTickSum = open.reduce((a, s) => a + (s.endTick - s.startTick), 0);
  row.openSpellTouchSum = open.reduce((a, s) => a + s.touches, 0);
  row.stepWallMs = Date.now() - t0;
  row.goals = m.score[0] + m.score[1];
  row.enginePasses = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.enginePassesCompleted = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  row.enginePassesForward = m.teams[0].stats.passesForward + m.teams[1].stats.passesForward;
  for (const t of m.teams) {
    row.tackles += t.stats.tackles;
    row.interceptions += t.stats.interceptions;
    row.shots += t.stats.shots;
    row.crosses += t.stats.crosses;
    row.headersWon += t.stats.headersWon;
    row.longBalls += t.stats.longBalls;
    row.cutbacks += t.stats.cutbacks;
  }
  /* ---- DF-T2's usage ledger, read at the whistle (pure bookkeeping in src) ---- */
  const led = m.dfSurfaceLedger;
  row.elections = led.elections;
  row.idle = led.idle;
  row.pressOffered = led.pressOffered;
  row.pressDeclinedByBook = led.pressDeclinedByBook;
  row.byOption = [...led.byOption];
  row.byModeOption = [...led.byModeOption];
  const attrOf = new Map<number, number>();
  for (const t of m.teams) for (const p of t.players) attrOf.set(p.gid, p.attrs.defending);
  for (const [gid, counts] of led.byGid) {
    row.bodyRows.push([attrOf.get(gid) ?? Number.NaN, ...counts]);
  }
  row.bodyRows.sort((a, b) => a[0] - b[0]);
  return row;
};

/* ========================================================================== */
/* §4 THE SEASON LADDER — the ecological gate (M-DF.4), DF-T1's design reused  */
/* ========================================================================== */
/**
 * ⭐ THE ARMS: `liveShut` = the live world + `dfAssignPersist` (DF-T1's BANKED world — the
 * matched floor); `liveArmed` = the same + `dfSurface`. Both armed through the League's OWN
 * `matchFlags` probe surface, which the shipped `createMatch` spread carries into every
 * fixture — nothing is hand-written onto `info.genome` (dose-placement canon, home ruling
 * #270.2). Canon VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON
 * omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4 correction;
 * matches the perf diagnostic)" (home: ruling #283.2(iv)) — THE LADDER IS THE ECOLOGY, not
 * world 9. NO GENE IS FROZEN IN EITHER ARM. The atkFrozen FLOOR is NOT re-run: it is DF-C0
 * §R4's published +0.2211, QUOTED as a reference line.
 */
type LadderArm = 'liveShut' | 'liveArmed';
const LADDER_ARMS: readonly LadderArm[] = ['liveShut', 'liveArmed'];
const LADDER_ARM_NOTE: Record<LadderArm, string> = {
  liveShut: 'THE LIVE WORLD + dfAssignPersist (DF-T1\'s banked world), the SURFACE door SHUT.',
  liveArmed: 'THE LIVE WORLD + dfAssignPersist + dfSurface, armed through League.matchFlags '
    + '(the shipped createMatch spread). Nothing else differs.',
};
const ATK_FROZEN_FLOOR = 0.2211;
const ATK_FROZEN_FLOOR_SOURCE = 'DF-C0-DEFENSIVE-BRAIN.md §R4 (ruling #320 item 3 / #321 '
  + 'item 3): the atkFrozen arm\'s goals/match early(1–5)→late(16–20) delta +0.2211 '
  + '(half-width 0.1423, |Δ|÷hw 1.55). QUOTED, not re-run.';

interface LadderCell {
  arm: LadderArm; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; shotsOnTarget: number; xg: number;
  tackles: number; interceptions: number; clearances: number; blocks: number;
  passes: number; passesCompleted: number;
  doorChecked: number; doorWrong: number;
  wallSeconds: number;
}
const round = (v: number, digits = 12): number =>
  (Number.isFinite(v) ? Number(v.toPrecision(digits)) : v);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const ratio = (n: number, d: number): number => (d === 0 ? Number.NaN : n / d);

const gen1Fingerprint = (leagueSeed: number): string => {
  const l = new League({ seed: leagueSeed });
  const rows = l.franchises.map((f) => {
    const g = f.coach.genome as unknown as Record<string, number>;
    const st = f.coach.style as unknown as Record<string, string>;
    return `${f.slot}|${(GENE_KEYS as readonly string[]).map((k) => g[k]).join(',')}`
      + `|${['formationDef', 'formationAtk', 'scheme'].map((k) => st[k]).join(',')}`;
  });
  return createHash('sha256').update(rows.join('\n')).digest('hex');
};

const runLadderArm = (arm: LadderArm, leagueSeed: number, gens: number): LadderCell[] => {
  const league = new League({ seed: leagueSeed });
  league.matchFlags = arm === 'liveArmed'
    ? { dfAssignPersist: true, dfSurface: true }
    : { dfAssignPersist: true };
  const cells: LadderCell[] = [];
  for (let gen = 1; gen <= gens; gen++) {
    const tGen = Date.now();
    let matches = 0;
    const acc = {
      goals: 0, shots: 0, shotsOnTarget: 0, xg: 0, tackles: 0, interceptions: 0,
      clearances: 0, blocks: 0, passes: 0, passesCompleted: 0,
    };
    let doorChecked = 0;
    let doorWrong = 0;
    while (!league.seasonDone) {
      const fx = league.nextFixture();
      if (fx === null) break;
      const match = league.createMatch(fx);
      doorChecked += 1;
      if (match.dfSurface !== (arm === 'liveArmed') || match.dfAssignPersist !== true) doorWrong += 1;
      const res = match.runToCompletion();
      matches += 1;
      for (const s of res.stats) {
        acc.goals += s.goals;
        acc.shots += s.shots;
        acc.shotsOnTarget += s.shotsOnTarget;
        acc.xg += s.xg;
        acc.tackles += s.tackles;
        acc.interceptions += s.interceptions;
        acc.clearances += s.clearances;
        acc.blocks += s.blocks;
        acc.passes += s.passes;
        acc.passesCompleted += s.passesCompleted;
      }
      league.applyResult(fx, res);
    }
    cells.push({
      arm, leagueSeed, generation: gen, matches,
      goals: acc.goals, shots: acc.shots, shotsOnTarget: acc.shotsOnTarget,
      xg: round(acc.xg, 4), tackles: acc.tackles, interceptions: acc.interceptions,
      clearances: acc.clearances, blocks: acc.blocks, passes: acc.passes,
      passesCompleted: acc.passesCompleted,
      doorChecked, doorWrong,
      wallSeconds: round((Date.now() - tGen) / 1000, 3),
    });
    league.finishSeason();
  }
  return cells;
};

/* ========================================================================== */
/* §5 STATS BASES — the registry, floor 115,200, step ≥ 200                    */
/* ========================================================================== */
const R9_INHERITED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_200, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600,
  111_800, 112_000, 112_200, 112_400, 112_600, 112_800, 113_000, 113_200, 113_400, 113_600,
  113_800, 102_200, 102_800, 103_200, 103_600, 103_800, 104_200, 104_600, 104_800, 105_200,
  105_800, 109_400, 109_600, 109_800, 110_000, 114_000,
];
/**
 * Consumed since IN-C0's completed 56-entry sweep: 114,200 (IN-C0/IN-C0-FIX, #317 item 4) ·
 * 114,400 + 114,600 (DF-C0, #320 item 4) — that is the "59-entry registry" the rulings quote
 * — AND ⭐ 114,800 + 115,000, which DF-T1 ITSELF consumed (DF-T1 §R7). The rulings' running
 * "registry 59" is the count as of DF-T1's own FREEZE; DF-T1's two draws are appended here,
 * so the registry of record entering DF-T3 is 61. Stated, not hidden.
 */
const REGISTRY_ADDITIONS: readonly number[] = [114_200, 114_400, 114_600, 114_800, 115_000];
const STATS_PUBLISHED_BASES: readonly number[] = [
  ...new Set([...R9_INHERITED_BASES, ...REGISTRY_ADDITIONS]),
].sort((a, b) => a - b);
const REGISTRY_COMPLETE = R9_INHERITED_BASES.length === 56
  && STATS_PUBLISHED_BASES.length === 61
  && REGISTRY_ADDITIONS.every((b) => !R9_INHERITED_BASES.includes(b));
const STATS_BASE = 115_200;
const STATS_STEP = 200;
/** THREE draws, THREE bases, all booked (#331 item 5: stats from 115,200 on the lattice) */
const STATS_BASES_CONSUMED = [STATS_BASE, STATS_BASE + STATS_STEP, STATS_BASE + 2 * STATS_STEP] as const;
const minStatsGap = Math.min(...STATS_BASES_CONSUMED
  .flatMap((mine) => STATS_PUBLISHED_BASES.map((b) => Math.abs(mine - b))));

/* ========================================================================== */
/* §6 THE CONSTRUCTION CLASS — refuse BEFORE any battery (nothing written)     */
/* ========================================================================== */
const receiptMatch = buildMatch(RECEIPT_SEED, false);
const RECEIPT = worldConjuncts(receiptMatch, false);
const RECEIPT_OK = Object.values(RECEIPT).every(Boolean);
if (!RECEIPT_OK) {
  console.error('CONSTRUCTION CLASS: the xxx,999 world receipt failed', RECEIPT);
  process.exit(3);
}
if (!REGISTRY_COMPLETE) {
  console.error('CONSTRUCTION CLASS: the stats registry did not reconcile');
  process.exit(3);
}
if (containWhyOccurrences !== 1) {
  console.error('CONSTRUCTION CLASS: the contain `why` needle is not singular');
  process.exit(3);
}

/* ========================================================================== */
/* §7 THE BATTERY                                                              */
/* ========================================================================== */
const LADDER_GENS = GENS_ENV ?? (MODE === 'full' ? 20 : 2);
const LADDER_SEEDS_ALL = [BLOCK_BASE + 900, BLOCK_BASE + 901, BLOCK_BASE + 902, BLOCK_BASE + 903];
const LADDER_SEEDS = MODE === 'smoke' ? LADDER_SEEDS_ALL.slice(0, 1) : LADDER_SEEDS_ALL;

banner(`DF-T3: mode=${MODE} battery=${SEEDS.length} seeds × 2 arms  ladder=${LADDER_SEEDS.length}`
  + ` leagues × ${LADDER_GENS} generations × ${LADDER_ARMS.length} arms`);
const tBattery0 = Date.now();
const rows: Row[] = [];
for (const seed of SEEDS) {
  for (const armed of [false, true]) rows.push(walk(seed, armed));
  if ((seed - BLOCK_BASE) % 10 === 0 || seed === RECEIPT_SEED) {
    banner(`  … battery seed ${seed} paired (${((Date.now() - tBattery0) / 1000).toFixed(0)} s)`);
  }
}
const batteryWallSec = round((Date.now() - tBattery0) / 1000, 3);

const tLadder0 = Date.now();
const ladderCells: LadderCell[] = [];
const gen1Fingerprints = LADDER_SEEDS.map((ls) => ({ leagueSeed: ls, sha256: gen1Fingerprint(ls) }));
for (const arm of LADDER_ARMS) {
  for (const ls of LADDER_SEEDS) {
    ladderCells.push(...runLadderArm(arm, ls, LADDER_GENS));
    banner(`  … ladder ${arm} seed ${ls} done (${((Date.now() - tLadder0) / 1000).toFixed(0)} s)`);
  }
}
const ladderWallSec = round((Date.now() - tLadder0) / 1000, 3);
const ladderLeagueSeasons = LADDER_ARMS.length * LADDER_SEEDS.length * LADDER_GENS;
const ladderMatches = sum(ladderCells.map((c) => c.matches));

/* ========================================================================== */
/* §8 THE BETWEEN-ARM FACES — paired, seed-clustered, DF-T1's idiom verbatim   */
/* ========================================================================== */
const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;
const defenderMatches = (r: Row): number => (r.defenderTicks * DT) / MATCH_DURATION;
const perMatch = (): number => 1;

interface FaceDef { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string; denNote: string; family: string }
const FACES: Record<string, FaceDef> = {
  /* ---------- H-DF.1(b2)'s TWO SCORED faces ---------- */
  multiChaseShare2: {
    num: (r) => r.multiChase2Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '⭐ H-DF.1(b2) SCORED — ≥2 bodies in the BALL family at once (the cap\'s own '
      + 'output). It must NOT RISE resolvedly armed.',
    denNote: 'denominator = out-of-possession team-ticks — MOVES with possession share',
    family: 'swarm (SCORED)',
  },
  multiChaseShare3: {
    num: (r) => r.multiChase3Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '⭐ H-DF.1(b2) SCORED — ≥3 bodies in the BALL family, the "NEVER three" the cap '
      + 'bans as it actually occurs (#324 left it grazing zero UPWARD at −1.21×10⁻⁵; DF-T2\'s '
      + 'receipt left it UNRESOLVED). It must NOT RISE resolvedly armed.',
    denNote: 'denominator = out-of-possession team-ticks — MOVES with possession share',
    family: 'swarm (SCORED)',
  },
  /* ---------- the swarm companions (REPORTED) ---------- */
  swarmStanceShare2: {
    num: (r) => sum(r.swarmStanceBins.slice(2)), den: (r) => sum(r.swarmStanceBins),
    unit: `share of carrier-present defending team-ticks with ≥2 bodies inside ${SWARM_R_STANCE} m`,
    what: 'THE SWARM\'S OWN FACE at the shipped stance radius (REPORTED)',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
    family: 'swarm (REPORTED)',
  },
  swarmZoneShare3: {
    num: (r) => sum(r.swarmZoneBins.slice(3)), den: (r) => sum(r.swarmZoneBins),
    unit: `share of carrier-present defending team-ticks with ≥3 bodies inside ${SWARM_R_ZONE} m`,
    what: 'the geometric pile-up face at the zonal engage radius — H-DF.0(b2)\'s scored face, '
      + 'REPORTED here (H-DF.1(b2)\'s frozen faces are the two multiChase shares)',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
    family: 'swarm (REPORTED)',
  },
  /* ---------- the churn / coverage family (REPORTED) ---------- */
  markSwitchesPerDefenderMinute: {
    num: (r) => r.markSwitches, den: defenderMinutes,
    unit: 'switches per defender-minute (sim clock; 1 defender-minute = 60 sim-s a body '
      + 'spent out of possession)',
    what: '乱跑 itself (DF-C0 §R2\'s definition VERBATIM) — REPORTED at this stage',
    denNote: 'denominator = defender body-ticks × DT / 60; MOVING with sent-offs and with '
      + 'possession share — disclosed per face',
    family: 'churn (REPORTED)',
  },
  markSwitchesPerDefenderMatch: {
    num: (r) => r.markSwitches, den: defenderMatches,
    unit: `switches per defender-match (the ${MATCH_DURATION} s match clock — the dual axis)`,
    what: 'the same count on the match clock (clock honesty)',
    denNote: 'denominator = defender body-ticks × DT / MATCH_DURATION',
    family: 'churn (REPORTED)',
  },
  markHeldShare: {
    num: (r) => r.markHeldTicks, den: (r) => r.defenderTicks,
    unit: 'share of defender body-ticks',
    what: 'ASSIGNMENT COVERAGE — how much of his defending life a body actually HAS a mark',
    denNote: 'denominator = defender body-ticks (the assignment-holding population)',
    family: 'coverage (REPORTED)',
  },
  dupMarkShare: {
    num: (r) => r.dupMarkTicks, den: (r) => r.markPairTicks,
    unit: `share of ≥2-marker team-ticks with two mark targets within ${DUP_RUN_M} m`,
    what: `THE dupRun-LINEAGE FACE, defensive side (radius reused verbatim: DUP_RUN_M = ${DUP_RUN_M})`,
    denNote: 'denominator = team-ticks with ≥2 MARK-family defenders — MOVES with how often '
      + 'the scheme assigns two markers at all',
    family: 'churn (REPORTED)',
  },
  markAbandonsPerDefenderMinute: {
    num: (r) => r.markAbandons, den: defenderMinutes,
    unit: 'abandonments per defender-minute',
    what: 'a marker LOSES his man with no replacement assignment',
    denNote: 'same defender-minute denominator', family: 'churn (REPORTED)',
  },
  markStartsPerDefenderMinute: {
    num: (r) => r.markStarts, den: defenderMinutes,
    unit: 'assignments per defender-minute',
    what: 'a body is GIVEN a mark (the churn cycle\'s other half)',
    denNote: 'same defender-minute denominator', family: 'churn (REPORTED)',
  },
  chaseStartsPerDefenderMinute: {
    num: (r) => r.chaseStarts, den: defenderMinutes,
    unit: 'chase starts per defender-minute',
    what: 'a body is licensed to hunt the ball',
    denNote: 'same defender-minute denominator', family: 'churn (REPORTED)',
  },
  chaseAbandonsPerDefenderMinute: {
    num: (r) => r.chaseAbandons, den: defenderMinutes,
    unit: 'chase abandonments per defender-minute',
    what: 'a licensed presser is DE-licensed mid-flight (the 疯狂抽动 shape)',
    denNote: 'same defender-minute denominator', family: 'churn (REPORTED)',
  },
  reTargetLatencyMeanS: {
    num: (r) => r.reTargetLatencyTickSum * DT, den: (r) => r.reTargetLatencyCount,
    unit: 'sim-seconds',
    what: 'how long a body waits between losing a mark and being given one',
    denNote: 'denominator = completed abandon→assign cycles (a cycle broken by the team '
      + 'regaining possession is DISCARDED, not truncated)',
    family: 'churn (REPORTED)',
  },
  /* ---------- ⭐ THE PRESS REALISATION FAMILY (#327 §CORR 3) ---------- */
  containActShareOfOfferTicks: {
    num: (r) => r.containActTicks, den: (r) => r.containOfferTicks,
    unit: 'share of OFFER defender-ticks (the contain branch\'s own geometry, anchored)',
    what: '⭐ THE PRESS REALISATION RATE at TICK grain — of the defender-ticks the shipped '
      + 'contain branch\'s geometry OFFERS (no mark, not a chaser, inside 8 m of the carrier, '
      + 'carrier inside 35 m of our goal, goal-side), the share where the brain\'s realised '
      + 'ARGMAX IS the contain candidate. The ELECTION-vs-ACT conversion, both arms.',
    denNote: 'denominator = OFFER defender-ticks — MOVES with how often the geometry arises '
      + 'at all, which the surface itself changes (it vacates ledger slots)',
    family: 'press realisation (REPORTED)',
  },
  containEpisodesPerDefenderMinute: {
    num: (r) => r.containEpisodes, den: defenderMinutes,
    unit: 'contain episodes per defender-minute',
    what: 'the ACT at DECISION grain — a maximal contiguous run of realised contain ticks',
    denNote: 'same defender-minute denominator', family: 'press realisation (REPORTED)',
  },
  containOfferTicksPerDefenderMinute: {
    num: (r) => r.containOfferTicks, den: defenderMinutes,
    unit: 'offer defender-ticks per defender-minute',
    what: 'the OFFER population itself — the denominator, published as its own face so the '
      + 'rate above is never read without it (moving-denominator canon)',
    denNote: 'same defender-minute denominator', family: 'press realisation (REPORTED)',
  },
  /* ---------- the R-乙 chain faces (REPORTED; definitions reused VERBATIM) ---------- */
  ryiQ01SpellSeconds: {
    num: (r) => r.openSpellTickSum * DT, den: (r) => r.openSpells,
    unit: 'sim-seconds per open-play spell',
    what: 'R-乙 Q01 — "how long a team keeps the ball (open-play possession spell, mean)"',
    denNote: 'denominator = openPlay-origin spells — MOVES with how the world segments possession',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ05TouchesPerSpell: {
    num: (r) => r.openSpellTouchSum, den: (r) => r.openSpells,
    unit: 'touches per open-play spell',
    what: 'R-乙 Q05 — "how many touches a possession is made of"',
    denNote: 'same openPlay-spell denominator', family: 'R-乙 chain (REPORTED)',
  },
  ryiQ06PassCompletion: {
    num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
    unit: 'share of passes completed',
    what: 'R-乙 Q06 — "how many passes find a team-mate" (the engine\'s OWN passive counters)',
    denNote: 'denominator = Σ team.stats.passes, both teams — MOVES with how many passes are attempted',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ14PressedReceptionShare: {
    num: (r) => r.openFirstReceptionsPressed, den: (r) => r.openFirstReceptions,
    unit: 'share of open-play first receptions',
    what: 'R-乙 Q14 — "how much of the game is played under pressure", the nearest opponent '
      + `≤ TOUCH_CONTROL_DIST = ${PRESSURE_R} m at the reception tick`,
    denNote: 'denominator = openPlay-origin first receptions — MOVES with spell count',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ07ForwardPassShare: {
    num: (r) => r.enginePassesForward, den: (r) => r.enginePasses,
    unit: 'share of passes forward',
    what: '⭐ THE DIRECTION MIX — R-乙 Q07 VERBATIM (the engine\'s own `passesForward`). '
      + 'THE #324 LABELLED HYPOTHESIS re-measured against the SURFACE door.',
    denNote: 'same engine pass denominator', family: 'R-乙 chain (REPORTED)',
  },
  /* ---------- goals + the §2 equilibrium faces (REPORT ONLY) ---------- */
  goalsPerMatch: {
    num: (r) => r.goals, den: perMatch, unit: 'goals per match',
    what: '§2 equilibrium (REPORTED — nothing ships from an exam)',
    denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  shotsPerMatch: {
    num: (r) => r.shots, den: perMatch, unit: 'shots per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  crossesPerMatch: {
    num: (r) => r.crosses, den: perMatch, unit: 'crosses per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  headersPerMatch: {
    num: (r) => r.headersWon, den: perMatch, unit: 'headers won per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  longBallsPerMatch: {
    num: (r) => r.longBalls, den: perMatch, unit: 'long balls per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  cutbacksPerMatch: {
    num: (r) => r.cutbacks, den: perMatch, unit: 'cutbacks per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  tacklesPerMatch: {
    num: (r) => r.tackles, den: perMatch, unit: 'tackles per match (both teams)',
    what: '⚠ THE CONTACT half at FRIENDLY-MATCH grain — NOT the ladder estimand (DF-T2 §R11 '
      + 'item 6): random genomes, one friendly, read at the whistle. The mandate\'s verdict '
      + 'lives at LADDER grain, published in `ladder`.',
    denNote: 'one match per seed', family: 'reading-vs-contact (REPORTED, friendly grain)',
  },
  interceptionsPerMatch: {
    num: (r) => r.interceptions, den: perMatch, unit: 'interceptions per match (both teams)',
    what: '⚠ THE READING half at FRIENDLY-MATCH grain — NOT the ladder estimand (DF-T2 §R11 '
      + 'item 6 / DF-C0 §R4). The two numbers must never be quoted as the same thing.',
    denNote: 'one match per seed', family: 'reading-vs-contact (REPORTED, friendly grain)',
  },
  tacklesPlusInterceptionsPerMatch: {
    num: (r) => r.tackles + r.interceptions, den: perMatch,
    unit: 'events per match (both teams)',
    what: 'the shipped defensive event rate at friendly-match grain',
    denNote: 'one match per seed', family: 'reading-vs-contact (REPORTED, friendly grain)',
  },
};

const BOOTSTRAP = 2000;
const seedsWalked = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
const rngBoot = new Rng(STATS_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngBoot.next() * seedsWalked.length)));
const shutBySeed = new Map(rows.filter((r) => r.arm === 'shut').map((r) => [r.seed, r]));
const armedBySeed = new Map(rows.filter((r) => r.arm === 'armed').map((r) => [r.seed, r]));

interface FaceRow {
  face: string; family: string; unit: string; what: string; denNote: string;
  shutValue: number; shutNumerator: number; shutDenominator: number;
  armedValue: number; armedNumerator: number; armedDenominator: number;
  delta: number; ciLo: number; ciHi: number; halfWidth: number; ratioToHalfWidth: number;
  resolved: boolean; direction: 'down' | 'up' | 'unresolved';
}
const pickPct = (draws: readonly number[], p: number): number => (draws.length === 0 ? Number.NaN
  : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
const faceOf = (name: string, d: FaceDef): FaceRow => {
  const shutRows = rows.filter((r) => r.arm === 'shut');
  const armedRows2 = rows.filter((r) => r.arm === 'armed');
  const bn = sum(shutRows.map(d.num));
  const bd = sum(shutRows.map(d.den));
  const an = sum(armedRows2.map(d.num));
  const ad = sum(armedRows2.map(d.den));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let bnn = 0; let bdd = 0; let ann = 0; let add = 0;
    for (const i of idx) {
      const s = seedsWalked[i];
      const rb = shutBySeed.get(s)!;
      const ra = armedBySeed.get(s)!;
      bnn += d.num(rb); bdd += d.den(rb);
      ann += d.num(ra); add += d.den(ra);
    }
    const v = ratio(ann, add) - ratio(bnn, bdd);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pickPct(draws, 0.025);
  const hi = pickPct(draws, 0.975);
  const hw = (hi - lo) / 2;
  const delta = ratio(an, ad) - ratio(bn, bd);
  const resolved = Number.isFinite(lo) && Number.isFinite(hi) && (lo > 0 || hi < 0);
  return {
    face: name, family: d.family, unit: d.unit, what: d.what, denNote: d.denNote,
    shutValue: round(ratio(bn, bd)), shutNumerator: round(bn), shutDenominator: round(bd),
    armedValue: round(ratio(an, ad)), armedNumerator: round(an), armedDenominator: round(ad),
    delta: round(delta), ciLo: round(lo), ciHi: round(hi), halfWidth: round(hw),
    ratioToHalfWidth: round(Math.abs(delta) / hw, 6),
    resolved, direction: resolved ? (hi < 0 ? 'down' : 'up') : 'unresolved',
  };
};
const faces: FaceRow[] = Object.entries(FACES).map(([k, d]) => faceOf(k, d));
const faceRow = (name: string): FaceRow => faces.find((f) => f.face === name)!;

/* ---- the latency PERCENTILE faces, from STORED BINS (canon) ---- */
const latBinsPooled = (arm: 'shut' | 'armed'): number[] => Array.from({ length: LAT_BINS },
  (_, b) => sum(rows.filter((r) => r.arm === arm).map((r) => r.reTargetLatencyBins[b])));
const latQuantile = (bins: readonly number[], p: number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  let acc = 0;
  for (let b = 0; b < LAT_BINS; b++) {
    acc += bins[b];
    if (acc >= p * total) return (b + 1) * LAT_BIN_S;
  }
  return LAT_BINS * LAT_BIN_S;
};
const latencyBins = { shut: latBinsPooled('shut'), armed: latBinsPooled('armed') };
const latencyPercentiles = {
  shutMedianS: latQuantile(latencyBins.shut, 0.5),
  shutP90S: latQuantile(latencyBins.shut, 0.9),
  armedMedianS: latQuantile(latencyBins.armed, 0.5),
  armedP90S: latQuantile(latencyBins.armed, 0.9),
};
const poolBins = (arm: 'shut' | 'armed', pickB: (r: Row) => number[], n: number): number[] =>
  Array.from({ length: n }, (_, b) => sum(rows.filter((r) => r.arm === arm).map((r) => pickB(r)[b])));
const chaserBins = {
  shut: poolBins('shut', (r) => r.chaserCountBins, 5),
  armed: poolBins('armed', (r) => r.chaserCountBins, 5),
};
const swarmBins = {
  shutStance: poolBins('shut', (r) => r.swarmStanceBins, SWARM_BINS),
  armedStance: poolBins('armed', (r) => r.swarmStanceBins, SWARM_BINS),
  shutZone: poolBins('shut', (r) => r.swarmZoneBins, SWARM_BINS),
  armedZone: poolBins('armed', (r) => r.swarmZoneBins, SWARM_BINS),
};

/* ========================================================================== */
/* §9 ⭐⭐ H-DF.1(a) — THE WITHIN-ARM DIFFERENTIATION BLOCK                     */
/* ========================================================================== */
const armedRows = rows.filter((r) => r.arm === 'armed');
const OPT_PRESS = 0;
const OPT_TAKE = 3;
const optionOrder = [...DF_SURFACE_OPTIONS];
const byOptionPooled = Array.from({ length: N_OPT }, (_, i) => sum(armedRows.map((r) => r.byOption[i])));
const byModeOptionPooled = Array.from({ length: 2 * N_OPT }, (_, i) =>
  sum(armedRows.map((r) => r.byModeOption[i])));
const electionsPooled = sum(armedRows.map((r) => r.elections));
const shareOf = (xs: readonly number[]): number[] => {
  const t = sum(xs);
  return xs.map((x) => round(ratio(x, t)));
};
/**
 * ⭐ THE WITHIN-ARM BOOTSTRAP (a1 + a2) — its OWN stats base, its OWN resample index; the
 * cluster is the SEED, exactly as the between-arm bootstrap's is. UNPAIRED by construction:
 * each side gets its own interval and the frozen test is INTERVAL OVERLAP.
 */
const rngWithin = new Rng(STATS_BASE + 2 * STATS_STEP);
const withinIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngWithin.next() * seedsWalked.length)));
interface Interval { value: number; ciLo: number; ciHi: number; halfWidth: number }
const intervalOf = (draws: number[], value: number): Interval => {
  draws.sort((a, b) => a - b);
  const lo = pickPct(draws, 0.025);
  const hi = pickPct(draws, 0.975);
  return { value: round(value), ciLo: round(lo), ciHi: round(hi), halfWidth: round((hi - lo) / 2) };
};
const disjoint = (a: Interval, b: Interval): boolean =>
  Number.isFinite(a.ciLo) && Number.isFinite(b.ciLo) && (a.ciHi < b.ciLo || b.ciHi < a.ciLo);

/* ---- (a1) BY SITUATION: the press ELECTION share, DEFEND vs PRESS mode ---- */
const modePressShare = (rs: readonly Row[], slot: 0 | 1): number => {
  const block = Array.from({ length: N_OPT }, (_, i) =>
    sum(rs.map((r) => r.byModeOption[slot * N_OPT + i])));
  return ratio(block[OPT_PRESS], sum(block));
};
const a1Interval = (slot: 0 | 1): Interval => {
  const draws: number[] = [];
  for (const idx of withinIndex) {
    const rs = idx.map((i) => armedBySeed.get(seedsWalked[i])!);
    const v = modePressShare(rs, slot);
    if (Number.isFinite(v)) draws.push(v);
  }
  return intervalOf(draws, modePressShare(armedRows, slot));
};
const a1Defend = a1Interval(0);
const a1Press = a1Interval(1);
const a1Pass = disjoint(a1Defend, a1Press);

/* ---- (a2) BY BODY: the attrs.defending TERCILE gradient, for PRESS and for TAKE ---- */
interface TercileRow { tercile: number; n: number; defendingAttrLo: number; defendingAttrHi: number; counts: number[]; shares: number[] }
const bodiesOf = (rs: readonly Row[]): Array<{ attr: number; counts: number[] }> => {
  const out: Array<{ attr: number; counts: number[] }> = [];
  for (const r of rs) for (const b of r.bodyRows) out.push({ attr: b[0], counts: b.slice(1) });
  out.sort((a, b) => a.attr - b.attr);
  return out;
};
const tercilesOf = (bodies: ReadonlyArray<{ attr: number; counts: number[] }>): TercileRow[] =>
  [0, 1, 2].map((t) => {
    const lo = Math.floor((t * bodies.length) / 3);
    const hi = Math.floor(((t + 1) * bodies.length) / 3);
    const slice = bodies.slice(lo, hi);
    const agg = Array.from({ length: N_OPT }, (_, i) => sum(slice.map((x) => x.counts[i])));
    return {
      tercile: t, n: slice.length,
      defendingAttrLo: round(slice.length === 0 ? Number.NaN : slice[0].attr),
      defendingAttrHi: round(slice.length === 0 ? Number.NaN : slice[slice.length - 1].attr),
      counts: agg, shares: shareOf(agg),
    };
  });
const terciles = tercilesOf(bodiesOf(armedRows));
const tercileShare = (ts: readonly TercileRow[], t: number, opt: number): number =>
  ratio(ts[t].counts[opt], sum(ts[t].counts));
const a2Interval = (t: number, opt: number): Interval => {
  const draws: number[] = [];
  for (const idx of withinIndex) {
    const rs = idx.map((i) => armedBySeed.get(seedsWalked[i])!);
    const v = tercileShare(tercilesOf(bodiesOf(rs)), t, opt);
    if (Number.isFinite(v)) draws.push(v);
  }
  return intervalOf(draws, tercileShare(terciles, t, opt));
};
const strictlyMonotone = (xs: readonly number[]): boolean =>
  xs.every((v) => Number.isFinite(v))
  && ((xs[0] < xs[1] && xs[1] < xs[2]) || (xs[0] > xs[1] && xs[1] > xs[2]));
const a2Of = (opt: number): {
  option: string; bottom: Interval; middle: number; top: Interval;
  pointEstimates: number[]; monotone: boolean; disjoint: boolean; pass: boolean;
} => {
  const bottom = a2Interval(0, opt);
  const top = a2Interval(2, opt);
  const pts = [0, 1, 2].map((t) => round(tercileShare(terciles, t, opt)));
  const mono = strictlyMonotone(pts);
  const dis = disjoint(bottom, top);
  return {
    option: optionOrder[opt], bottom, middle: pts[1], top,
    pointEstimates: pts, monotone: mono, disjoint: dis, pass: mono && dis,
  };
};
const a2Press = a2Of(OPT_PRESS);
const a2Take = a2Of(OPT_TAKE);
const a2Pass = a2Press.pass && a2Take.pass;

/* ---- ⚠ THE INHERITED CAUTION, re-measured at exam grain (never gated) ---- */
const bodyAgg = new Map<string, number[]>();
for (const r of armedRows) {
  for (const b of r.bodyRows) {
    const k = `${r.seed}:${b[0]}`;
    const prev = bodyAgg.get(k) ?? Array.from({ length: N_OPT }, () => 0);
    for (let i = 0; i < N_OPT; i++) prev[i] += b[1 + i];
    bodyAgg.set(k, prev);
  }
}
const bodyModalCounts = Array.from({ length: N_OPT }, () => 0);
let bodiesCounted = 0;
for (const counts of bodyAgg.values()) {
  if (sum(counts) === 0) continue;
  bodiesCounted += 1;
  let arg = 0;
  for (let i = 1; i < N_OPT; i++) if (counts[i] > counts[arg]) arg = i;
  bodyModalCounts[arg] += 1;
}

const usage = {
  optionOrder,
  mechanismOfRecord: '#327 §CORR item 5 — TWO PRICED ELECTIONS + ONE DERIVED LABEL: '
    + 'press-vs-mark and hold-vs-switch are CHOSEN; jump-vs-take is the L3 account\'s own '
    + 'sign LABELLING the outcome (actionExecutor.ts\'s `slack <= 0` branch). H-DF.1(a) is '
    + 'phrased on THAT mechanism, never as "four choosable acts".',
  note: 'ONE row per DEFENDER per assignment pass (the TEAM_AI_INTERVAL cadence) — a '
    + 'DECISION distribution, not a tick distribution. Shut-arm counts are structurally zero '
    + '(the ledger is untouched with the door shut), which is gate gLedgerZeroWhenShut.',
  electionsArmed: electionsPooled,
  idleArmed: sum(armedRows.map((r) => r.idle)),
  byOption: byOptionPooled,
  byOptionShare: shareOf(byOptionPooled),
  byModeOption: byModeOptionPooled,
  byModeOptionShareDefend: shareOf(byModeOptionPooled.slice(0, N_OPT)),
  byModeOptionSharePress: shareOf(byModeOptionPooled.slice(N_OPT)),
  bodiesCounted,
  bodyModalCounts,
  bodyModalShare: shareOf(bodyModalCounts),
  bodyModalCaution: '⚠⚠ THE INHERITED CAUTION (DF-T2 §R11 item 1, ratified #327 §CORR 2): at '
    + 'the receipts\' grain 407 of 410 bodies were HOLD-MODAL and not one body was modal on '
    + 'press or jump. This census is the SAME reading re-run at exam grain. It is REPORTED '
    + 'beside the H-DF.1(a) verdict and is NOT a conjunct of it — the verdict is the '
    + 'conjuncts\', the caution is the reader\'s.',
  byDefendingAttrTercile: terciles,
  pressOfferedArmed: sum(armedRows.map((r) => r.pressOffered)),
  pressDeclinedByBookArmed: sum(armedRows.map((r) => r.pressDeclinedByBook)),
};

/* ---- ⭐ THE PRESS REALISATION RATE — the ordered election-vs-act JOIN ---- */
const pressElectionsArmed = byOptionPooled[OPT_PRESS];
const containEpisodesArmed = sum(armedRows.map((r) => r.containEpisodes));
const containEpisodesShut = sum(rows.filter((r) => r.arm === 'shut').map((r) => r.containEpisodes));
const pressRealisation = {
  what: '⭐ THE PRESS REALISATION RATE (#327 §CORR item 3, ORDERED onto this exam): the '
    + 'usage tables of record read as ELECTION shares — the counter increments on the '
    + 'ABSENCE of an assignment, and whether Phase-29.1\'s contain branch (its own goal-side '
    + 'test and ONE-container rule, untouched) licenses the body was never measured. This '
    + 'face JOINS the vacations to the REALISED contains.',
  pressElectionsArmed,
  containEpisodesArmed,
  containEpisodesShut,
  /** the ordered join: realised contain EPISODES per press ELECTION, armed arm */
  episodesPerPressElection: round(ratio(containEpisodesArmed, pressElectionsArmed)),
  denNote: '⚠ THE DENOMINATOR IS THE ELECTION, THE NUMERATOR IS THE ACT, and the two are '
    + 'counted at DIFFERENT cadences: an election is one defender per assignment pass '
    + '(TEAM_AI_INTERVAL, 0.4 s + the shipped 0.05 s expedites); an EPISODE is a maximal '
    + 'contiguous run of realised contain ticks and MAY span several passes. The ratio is '
    + 'therefore a CONVERSION INDEX, not a probability, and it is NOT bounded by 1. The '
    + 'tick-grain rate with its own honest denominator is the face '
    + '`containActShareOfOfferTicks`, published in BOTH arms.',
  honestLimit: '⚠ The instrument CANNOT see which body vacated (the ledger carries counts, '
    + 'not identities, and src is untouched by this stage), so the join is at TEAM/WALK '
    + 'grain, never body-to-body. Both arms are published so the shut arm\'s contain '
    + 'episodes — which exist WITHOUT any election at all (the shipped spare-body state) — '
    + 'are visible as the background rate this index sits on.',
};

/* ========================================================================== */
/* §10 THE LADDER FACES + SLOPES — DF-C0-FIX §RF1's ONE FORMULA, verbatim      */
/* ========================================================================== */
interface LadderFaceRow {
  arm: LadderArm; generation: number; leagues: number; matches: number;
  goalsPerMatch: number; shotsPerTeamMatch: number; shotsOnTargetPerTeamMatch: number;
  tacklesPerTeamMatch: number; interceptionsPerTeamMatch: number;
  clearancesPerTeamMatch: number; blocksPerTeamMatch: number; passCompletion: number;
  perLeagueGoalsPerMatch: number[];
}
const ladderFaces: LadderFaceRow[] = [];
for (const arm of LADDER_ARMS) {
  for (let gen = 1; gen <= LADDER_GENS; gen++) {
    const cs = ladderCells.filter((c) => c.arm === arm && c.generation === gen);
    const mt = sum(cs.map((c) => c.matches));
    ladderFaces.push({
      arm, generation: gen, leagues: cs.length, matches: mt,
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt)),
      shotsPerTeamMatch: round(ratio(sum(cs.map((c) => c.shots)), mt * 2)),
      shotsOnTargetPerTeamMatch: round(ratio(sum(cs.map((c) => c.shotsOnTarget)), mt * 2)),
      tacklesPerTeamMatch: round(ratio(sum(cs.map((c) => c.tackles)), mt * 2)),
      interceptionsPerTeamMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt * 2)),
      clearancesPerTeamMatch: round(ratio(sum(cs.map((c) => c.clearances)), mt * 2)),
      blocksPerTeamMatch: round(ratio(sum(cs.map((c) => c.blocks)), mt * 2)),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),
      perLeagueGoalsPerMatch: cs.map((c) => round(ratio(c.goals, c.matches))),
    });
  }
}
const EARLY_GENS = Math.min(5, LADDER_GENS);
const LATE_FROM = Math.max(1, LADDER_GENS - EARLY_GENS + 1);
const LADDER_SLOPE_FACES = ['goals', 'tackles', 'interceptions', 'shots', 'clearances'] as const;
const numOf = (c: LadderCell, f: (typeof LADDER_SLOPE_FACES)[number]): number =>
  (f === 'goals' ? c.goals : f === 'tackles' ? c.tackles : f === 'interceptions'
    ? c.interceptions : f === 'shots' ? c.shots : c.clearances);
const denOf = (c: LadderCell, f: (typeof LADDER_SLOPE_FACES)[number]): number =>
  (f === 'goals' ? c.matches : c.matches * 2);
/** ⭐ DF-C0-FIX §RF1's ONE FORMULA — publish side and re-derivation call THIS function. */
const slopeDeltaThroughOneFormula = (perLeague: ReadonlyArray<{ early: number; late: number; delta: number }>): number =>
  mean(perLeague.map((p) => p.delta));
interface LadderSlope {
  arm: LadderArm; face: string;
  early: number; late: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; ratioToHalfWidth: number;
  earlyGens: string; lateGens: string; leagues: number;
}
const rngLadder = new Rng(STATS_BASE + STATS_STEP);
const ladderSlopes: LadderSlope[] = [];
const perLeagueOf = (arm: LadderArm, f: (typeof LADDER_SLOPE_FACES)[number]) =>
  LADDER_SEEDS.map((ls) => {
    const cs = ladderCells.filter((c) => c.arm === arm && c.leagueSeed === ls);
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));
    const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));
    return { early: e, late: l, delta: l - e };
  });
for (const arm of LADDER_ARMS) {
  for (const f of LADDER_SLOPE_FACES) {
    const perLeague = perLeagueOf(arm, f);
    const draws: number[] = [];
    for (let b = 0; b < BOOTSTRAP; b++) {
      const ds: number[] = [];
      for (let i = 0; i < perLeague.length; i++) {
        ds.push(perLeague[Math.floor(rngLadder.next() * perLeague.length)].delta);
      }
      const v = mean(ds);
      if (Number.isFinite(v)) draws.push(v);
    }
    draws.sort((a, b) => a - b);
    const lo = pickPct(draws, 0.025);
    const hi = pickPct(draws, 0.975);
    const hw = (hi - lo) / 2;
    const delta = slopeDeltaThroughOneFormula(perLeague);
    ladderSlopes.push({
      arm, face: f,
      early: round(mean(perLeague.map((p) => p.early))),
      late: round(mean(perLeague.map((p) => p.late))),
      delta: round(delta), ciLo: round(lo), ciHi: round(hi), halfWidth: round(hw),
      ratioToHalfWidth: round(Math.abs(delta) / hw, 6),
      earlyGens: `1..${EARLY_GENS}`, lateGens: `${LATE_FROM}..${LADDER_GENS}`,
      leagues: LADDER_SEEDS.length,
    });
  }
}
const slopeOf = (arm: LadderArm, face: string): LadderSlope =>
  ladderSlopes.find((s) => s.arm === arm && s.face === face)!;
const shutGoalSlope = slopeOf('liveShut', 'goals');
const armedGoalSlope = slopeOf('liveArmed', 'goals');
const ladderFloorRead = {
  atkFrozenFloor: ATK_FROZEN_FLOOR,
  atkFrozenFloorSource: ATK_FROZEN_FLOOR_SOURCE,
  shutGoalsSlopeDelta: shutGoalSlope.delta,
  armedGoalsSlopeDelta: armedGoalSlope.delta,
  shutDistanceAboveFloor: round(shutGoalSlope.delta - ATK_FROZEN_FLOOR),
  armedDistanceAboveFloor: round(armedGoalSlope.delta - ATK_FROZEN_FLOOR),
  fractionOfExcessClosed: round(
    (shutGoalSlope.delta - ATK_FROZEN_FLOOR) === 0 ? Number.NaN
      : ((shutGoalSlope.delta - ATK_FROZEN_FLOOR) - (armedGoalSlope.delta - ATK_FROZEN_FLOOR))
        / (shutGoalSlope.delta - ATK_FROZEN_FLOOR),
  ),
  armedMinusShut: round(armedGoalSlope.delta - shutGoalSlope.delta),
  bendsTowardFloor: armedGoalSlope.delta < shutGoalSlope.delta,
  readingVsContactAtLadderGrain: {
    note: '⭐ DF-C0 §R4\'s ESTIMAND — evolved LEAGUE play across generations, per team-match. '
      + 'This is the mandate\'s own face and the ONLY grain at which 「防守从读球退化成身体'
      + '接触」 is judged. The friendly-match `interceptionsPerMatch` face is a DIFFERENT '
      + 'number and is never quoted as this one (DF-T2 §R11 item 6).',
    shutInterceptionsDelta: slopeOf('liveShut', 'interceptions').delta,
    armedInterceptionsDelta: slopeOf('liveArmed', 'interceptions').delta,
    shutTacklesDelta: slopeOf('liveShut', 'tackles').delta,
    armedTacklesDelta: slopeOf('liveArmed', 'tackles').delta,
    shutInterceptionsGen1: null as number | null,
    shutInterceptionsGenLast: null as number | null,
    armedInterceptionsGen1: null as number | null,
    armedInterceptionsGenLast: null as number | null,
  },
  preRegisteredDirection: '#320 item 3\'s FROZEN DIRECTION, restated at dispatch (#331 item '
    + '5): the ladder is REPORTED and a deviation ROUTES TO A SLICE, never to a nudge. '
    + 'DF-T1 measured the persistence door widening the excess (+1.513 armed vs +1.256 base, '
    + 'inside overlapping intervals) while the READING half moved the predicted way; this '
    + 'exam asks the same two questions of the SURFACE door.',
  interpretationNote: '⚠ THE FLOOR IS A REFERENCE LINE, NOT A MATCHED CONTROL — DF-C0\'s '
    + 'atkFrozen arm froze the ATTACK genes on league seeds 12,508,900–903; this stage arms '
    + 'a defensive door on 12,515,900–903. The floor says what the ecology\'s inflation looks '
    + 'like when attack stops evolving; it does not say what this door should have achieved. '
    + 'REPORTED, never gated. ⚠ No between-arm SLOPE test was pre-registered and none is '
    + 'invented: each arm carries its own league-clustered interval and the comparison is '
    + 'read as overlap.',
};
{
  const g1 = (arm: LadderArm, gen: number): number =>
    ladderFaces.find((l) => l.arm === arm && l.generation === gen)!.interceptionsPerTeamMatch;
  const rv = ladderFloorRead.readingVsContactAtLadderGrain;
  rv.shutInterceptionsGen1 = g1('liveShut', 1);
  rv.shutInterceptionsGenLast = g1('liveShut', LADDER_GENS);
  rv.armedInterceptionsGen1 = g1('liveArmed', 1);
  rv.armedInterceptionsGenLast = g1('liveArmed', LADDER_GENS);
}

/* ========================================================================== */
/* §11 H-DF.1 — THE FROZEN VERDICT (never re-cut after sight)                  */
/* ========================================================================== */
const fMc2 = faceRow('multiChaseShare2');
const fMc3 = faceRow('multiChaseShare3');
const capShaAfter = capShaNow();
const capIdentical = capShaBefore === CAP_SHA_OF_RECORD && capShaAfter === CAP_SHA_OF_RECORD;
const limbB1 = chaserBins.armed[4] === 0 && chaserBins.shut[4] === 0;
const limbB2 = !(fMc2.resolved && fMc2.direction === 'up')
  && !(fMc3.resolved && fMc3.direction === 'up');
const limbB3 = capIdentical && capRuleOccurrences === 1;
const HDF1A_PASS = a1Pass && a2Pass;
const HDF1B_PASS = limbB1 && limbB2 && limbB3;
const hdf1 = {
  claim: 'H-DF.1 (scored, mechanism grain, at the assembled composition) — with the '
    + 'continuous decision surface armed and priced through EXISTING accounts, (a) '
    + 'per-defender decisions GENUINELY DIFFERENTIATE at claim grain, by situation and by '
    + 'body, AND (b) THE SWARM DOES NOT RETURN — measured INSIDE the cap (M-DF.2: the '
    + 'cap-off arm is a LATER stage and is explicitly OUT of this exam).',
  ciRule: 'BETWEEN-ARM faces: RESOLVED = the 95 % seed-clustered PAIRED bootstrap interval '
    + 'of (armed − shut) EXCLUDES ZERO (2,000 draws, percentile, the SAME resampled seed set '
    + 'used for both arms in every draw). WITHIN-ARM contrasts (a1, a2): each side carries '
    + 'its OWN seed-clustered bootstrap interval and the test is INTERVAL OVERLAP — DISJOINT '
    + '= resolved apart. Frozen before the battery; NEVER re-cut after sight.',
  a_differentiation: {
    pass: HDF1A_PASS,
    a1_bySituation: {
      pass: a1Pass,
      rule: 'the PRESS ELECTION share resolves apart across team modes: the DEFEND-mode and '
        + 'PRESS-mode intervals must be DISJOINT',
      defend: a1Defend, press: a1Press,
      disjoint: a1Pass,
      absoluteGap: round(Math.abs(a1Defend.value - a1Press.value)),
      ratioToHalfWidth: round(Math.abs(a1Defend.value - a1Press.value)
        / Math.max(a1Defend.halfWidth, a1Press.halfWidth), 6),
    },
    a2_byBody: {
      pass: a2Pass,
      rule: 'the attrs.defending TERCILE gradient resolves for PRESS *and* for TAKE: top vs '
        + 'bottom tercile intervals DISJOINT and the three point estimates STRICTLY MONOTONE',
      press: a2Press, take: a2Take,
    },
    inheritedCaution: usage.bodyModalCaution,
    bodyModalCounts, bodiesCounted,
  },
  b_swarmDoesNotReturn: {
    pass: HDF1B_PASS,
    b1_fourChaserBinZeroBothArms: {
      pass: limbB1, rule: 'the four-chaser bin is EXACTLY ZERO in BOTH arms (structural)',
      armedBin4: chaserBins.armed[4], shutBin4: chaserBins.shut[4],
      armedBins: chaserBins.armed, shutBins: chaserBins.shut,
    },
    b2_multiChaseDoesNotRise: {
      pass: limbB2,
      rule: 'multiChaseShare2 AND multiChaseShare3 do NOT RISE resolvedly armed '
        + '(non-inferiority: each fails only on a RESOLVED move UP)',
      multiChaseShare2: {
        shut: fMc2.shutValue, armed: fMc2.armedValue, delta: fMc2.delta,
        ci: [fMc2.ciLo, fMc2.ciHi], halfWidth: fMc2.halfWidth,
        ratioToHalfWidth: fMc2.ratioToHalfWidth, direction: fMc2.direction,
      },
      multiChaseShare3: {
        shut: fMc3.shutValue, armed: fMc3.armedValue, delta: fMc3.delta,
        ci: [fMc3.ciLo, fMc3.ciHi], halfWidth: fMc3.halfWidth,
        ratioToHalfWidth: fMc3.ratioToHalfWidth, direction: fMc3.direction,
      },
    },
    b3_capSliceShaIdentical: {
      pass: limbB3,
      rule: 'the `assignChasers` slice is SHA-IDENTICAL to DF-T2 §R6\'s sha of record across '
        + 'the WHOLE stage (hashed before the battery AND after it)',
      shaOfRecord: CAP_SHA_OF_RECORD, shaBefore: capShaBefore, shaAfter: capShaAfter,
      capRuleLine: CAP_RULE_LINE, capRuleOccurrences,
    },
    capOffArm: '⛔ EXPLICITLY OUT (M-DF.2\'s own order, restated at dispatch #331 item 5): '
      + 'the cap-off arm is a LATER stage. This exam proves (b) INSIDE the cap only.',
  },
  verdict: HDF1A_PASS && HDF1B_PASS ? 'PASS'
    : HDF1A_PASS ? 'FAIL — (b)' : HDF1B_PASS ? 'FAIL — (a)' : 'FAIL — (a) and (b)',
};

/* ========================================================================== */
/* §12 GATES (frozen; a RED gate stays RED and is reported)                    */
/* ========================================================================== */
const gates: Record<string, boolean> = {};
gates.gWorldOkEveryWalk = rows.every((r) => r.worldOk);
gates.gSeedsBookedEqualWalked = seedsWalked.length === SEEDS.length
  && SEEDS.every((s) => seedsWalked.includes(s));
gates.gArmsPairedPerSeed = seedsWalked.every((s) => rows.filter((r) => r.seed === s).length === 2)
  && seedsWalked.every((s) => shutBySeed.has(s) && armedBySeed.has(s));
gates.gAnchorsResolveOnce = anchorReceipts.every((r) => r.matches === 1) && ANCHORS_OK
  && containWhyOccurrences === 1;
const srcPorcelain = gitOut(['status', '--porcelain', '--', 'src']).trim();
const srcDiffStat = gitOut(['diff', '--stat', 'HEAD', '--', 'src']).trim();
gates.gSrcUntouched = srcPorcelain === '' && srcDiffStat === '';
gates.gCapIntactBothArms = chaserBins.armed[4] === 0 && chaserBins.shut[4] === 0;
gates.gCapBinsNonEmpty = sum(chaserBins.armed) > 0 && sum(chaserBins.shut) > 0;
gates.gCapSliceShaIdentical = capIdentical && capRuleOccurrences === 1;
gates.gLatencyBinsStored = rows.every((r) => r.reTargetLatencyBins.length === LAT_BINS)
  && sum(latencyBins.armed) > 0 && sum(latencyBins.shut) > 0;
gates.gSwarmBinsStored = sum(swarmBins.shutZone) > 0 && sum(swarmBins.armedZone) > 0;
/** DORMANCY MEASURED IN-BATTERY: the ledger is untouched with the door shut */
gates.gLedgerZeroWhenShut = rows.filter((r) => r.arm === 'shut').every((r) =>
  r.elections === 0 && r.idle === 0 && r.pressOffered === 0 && r.pressDeclinedByBook === 0
  && r.byOption.every((x) => x === 0) && r.byModeOption.every((x) => x === 0)
  && r.bodyRows.length === 0);
/** ⭐ NON-DEGENERACY LIVENESS: all four options used at least once (a one-corner surface is RED) */
gates.gEveryOptionUsed = byOptionPooled.every((x) => x > 0);
/** the usage cells the (a) block re-derives from are actually stored */
gates.gUsageCellsStored = armedRows.every((r) => r.bodyRows.length > 0)
  && bodiesCounted > 0 && sum(byModeOptionPooled) > 0;
/** ⭐ the press REALISATION instrument really ran (a zero offer denominator is silently dead) */
gates.gContainInstrumentAlive = rows.every((r) => r.containOfferTicks > 0)
  && sum(rows.map((r) => r.containActTicks)) > 0 && containEpisodesArmed > 0;
gates.gArmsDistinguishable = fMc3.shutValue !== fMc3.armedValue;
gates.gRyiInstrumentAlive = rows.every((r) => r.openSpells > 0 && r.enginePasses > 0
  && r.openFirstReceptions > 0);
gates.gLadderComplete = ladderCells.length === LADDER_ARMS.length * LADDER_SEEDS.length * LADDER_GENS
  && ladderCells.every((c) => c.matches > 0);
gates.gLadderDoorHeld = ladderCells.every((c) => c.doorWrong === 0 && c.doorChecked > 0);
gates.gLadderGen1Identical = gen1Fingerprints.length === LADDER_SEEDS.length
  && gen1Fingerprints.every((g) => /^[0-9a-f]{64}$/.test(g.sha256));
gates.gSeedDiscipline = SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999)
  && LADDER_SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999);
gates.gStatsDisjoint = STATS_BASE >= 115_200 && minStatsGap >= STATS_STEP && REGISTRY_COMPLETE;
gates.gFingerprintUnmoved = false; // filled below
gates.gFacesFromDisk = false;      // filled below (staging re-parse)

const FINGERPRINT_OF_RECORD = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
let fingerprintNow = 'NOT-RUN';
try {
  const out = execFileSync('npx', ['tsx', 'scripts/fingerprint.ts'], { encoding: 'utf8' });
  fingerprintNow = (/sha256=([0-9a-f]{64})/.exec(out) ?? [, 'NO-MATCH'])[1] as string;
} catch { fingerprintNow = 'FINGERPRINT-FAILED'; }
gates.gFingerprintUnmoved = fingerprintNow === FINGERPRINT_OF_RECORD;

/* ========================================================================== */
/* §13 THE ARTIFACT — allowlist schema; STAGE, re-derive off disk, hash LAST   */
/* ========================================================================== */
const instrumentSha = createHash('sha256')
  .update(readFileSync(new URL(import.meta.url))).digest('hex');
const perfAnchorBytes = readFileSync('docs/perf/baseline.json');
const perfAnchor = JSON.parse(perfAnchorBytes.toString('utf8')) as Record<string, unknown>;

const bodyCore = {
  stage: 'DF-T3-SURFACE-EXAM',
  kind: 'exam (H-DF.1(a)+(b) SCORED on virgin paired seeds, INSIDE the cap; everything else REPORTED)',
  ruling: '#331 item 5',
  contract: 'DF-DEFENSIVE-BRAIN-CONTRACT.md §1 H-DF.1/H-DF.2 + §2 M-DF.1/M-DF.2/M-DF.3/M-DF.4',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  instrument: {
    file: 'scripts/probes/df-t3-surface-exam.ts',
    sha256: instrumentSha,
    churnDefinitionsReusedFrom: 'scripts/probes/df-c0-defensive-brain-census.ts §R2 via '
      + 'df-t0-assignment-persistence.ts and df-t1-persistence-exam.ts (Row accumulator, '
      + 'familyOf, DUP_RUN_M, latency bins, swarm radii, every numerator/denominator pair)',
    usageDefinitionsReusedFrom: 'scripts/probes/df-t2-decision-surface.ts (the usage-ledger '
      + 'read at the whistle, the gid→attrs.defending join, the tercile cut, the body-modal '
      + 'census) — the JOIN LIVES IN THE INSTRUMENT, never in src',
    ryiDefinitionsReusedFrom: 'docs/world-model/R-YI-STANDING-GAP-TABLE.md §definitions '
      + '(Q01 · Q05 · Q06 · Q07 · Q14), ported verbatim through '
      + 'scripts/probes/bk-t2-composition-exam.ts §(d) THE R-乙 SPELL WALKER',
    ladderMechanismReusedFrom: 'scripts/probes/df-c0-defensive-brain-census.ts §7(d) + '
      + 'DF-C0-FIX §RF1\'s ONE FORMULA (slopeDeltaThroughOneFormula), via df-t1',
    pressRealisationIsNew: 'THE ONE NEW WALKER: the offer population is the Phase-29.1 '
      + 'contain branch\'s own geometry by ANCHORED EXTRACTION; the act is the brain\'s '
      + 'realised argmax read off `p.action` (type · targetIdx · the winning candidate\'s '
      + 'own `why`). Instrument-side only; src is untouched.',
  },
  definitions: {
    ryiQ01: 'R-乙 VERBATIM — "how long a team keeps the ball (open-play possession spell, '
      + 'mean)": a maximal interval of same-owner-TEAM control while phase === "playing", '
      + 'ended by an opponent establishing ownership / the phase leaving "playing" / full '
      + 'time; duration = (endTick − startTick)·DT. openPlay origin only. ⚠ #324 §CORR 1: '
      + 'spells are SUSPENDED (not ended) while the ball is loose in play, so in-spell loose '
      + 'time is INCLUDED.',
    ryiQ05: 'R-乙 VERBATIM — "how many touches a possession is made of": ownership episodes '
      + 'counted inside each openPlay-origin spell.',
    ryiQ06: 'R-乙 VERBATIM — "how many passes find a team-mate": the engine\'s OWN passive '
      + 'counters, Σ team.stats.passesCompleted / Σ team.stats.passes, both teams.',
    ryiQ14: 'R-乙 VERBATIM — "how much of the game is played under pressure (pressing-'
      + 'intensity proxy)": among the FIRST reception of each openPlay-origin spell, the '
      + 'share whose nearest-opponent distance at the reception tick is ≤ the substrate\'s '
      + 'OWN pressure switch TOUCH_CONTROL_DIST. Restart/kickoff-origin receptions EXCLUDED.',
    ryiQ07: 'R-乙 Q07 VERBATIM — FORWARD is the engine\'s own team.stats.passesForward counter.',
    ryiSource: 'docs/world-model/R-YI-STANDING-GAP-TABLE.md §definitions, reused verbatim',
    markSwitch: 'DF-C0 §R2 VERBATIM — a defender-tick on which team.marks.get(index) is '
      + 'non-null now, was non-null last tick, and the two differ.',
    pressElection: 'DF-T2 §P2(a) — PRESS\'s executable form is the ABSENCE of an assignment: '
      + 'the surface OFFERS the body to the shipped Phase-29.1 contain branch. The ledger '
      + 'counter therefore increments on an ELECTION, never on an ACT (#327 §CORR 3).',
    containOfferTick: 'a defending-team tick on which an outfield body holds NO mark, is not '
      + 'a chaser, and satisfies the contain branch\'s three anchored preconditions '
      + `(dC < ${CONTAIN_RADIUS_M} · carrierGoalD < ${CONTAIN_TERRITORY_M} · goal-side).`,
    containActTick: 'the same body\'s realised action IS the contain candidate: '
      + '`action.type === "MarkOpponent"` AND `action.targetIdx === carrier.index` AND the '
      + `winning candidate's own why starts with "${CONTAIN_WHY_PREFIX}".`,
    containEpisode: 'a maximal contiguous run of containActTicks for one body.',
    pressureRadiusMetres: PRESSURE_R,
    dupRunMetres: DUP_RUN_M,
    swarmRadiusStanceMetres: SWARM_R_STANCE,
    swarmRadiusZoneMetres: SWARM_R_ZONE,
    markRangeMetres: MARK_RANGE,
    containRadiusMetres: CONTAIN_RADIUS_M,
    containTerritoryMetres: CONTAIN_TERRITORY_M,
  },
  world: {
    version: DF_WORLD,
    doors: 'a4MatchFlags(9) + bkFacingLaw + bkContactLaw + dfAssignPersist (DF-T1\'s BANKED '
      + 'world) in BOTH arms',
    armDifference: 'dfSurface only',
    arms: {
      shut: 'the world-9 stack + dfAssignPersist, the SURFACE door SHUT',
      armed: 'the same + dfSurface',
    },
    capOffArm: '⛔ NOT RUN — M-DF.2\'s own order (a later stage).',
    ladderWorld: 'the SHIPPED world (League — canon: worker fixtures play the SHIPPED world; '
      + 'League.toJSON omits matchFlags). The ladder is NOT world-9: it is the ecology.',
    ladderArmNotes: LADDER_ARM_NOTE,
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    subRanges: {
      battery: `${BLOCK_BASE}–${BLOCK_BASE + N_SEEDS - 1} (${N_SEEDS} paired seeds)`,
      smokePrefix: `${BLOCK_BASE + 800}–${BLOCK_BASE + 802} (in band)`,
      ladderLeagues: `${LADDER_SEEDS_ALL[0]}–${LADDER_SEEDS_ALL[3]} (booked once, walked in both arms)`,
      receipt: `${RECEIPT_SEED} (the xxx,999 world-construction receipt — WALKED)`,
    },
    booked: SEEDS,
    walked: seedsWalked,
    ladderSeeds: LADDER_SEEDS,
    bookedEqualsWalked: seedsWalked.length === SEEDS.length && SEEDS.every((s) => seedsWalked.includes(s)),
    walksTotal: rows.length,
    blockConsumedWhole: `${BLOCK_BASE}–${BLOCK_BASE + 999} CONSUMED WHOLE of record`,
    nextSimBlock: 12_516_000,
  },
  stats: {
    basesConsumed: STATS_BASES_CONSUMED,
    step: STATS_STEP,
    registryEntries: STATS_PUBLISHED_BASES.length,
    registryComplete: REGISTRY_COMPLETE,
    registryCompletionMethod: 'IN-C0\'s COMPLETED 56-entry registry + 114,200 '
      + '(IN-C0/IN-C0-FIX, #317 item 4) + 114,400 and 114,600 (DF-C0, #320 item 4) — the '
      + '"59-entry registry" the rulings quote — + ⭐ 114,800 and 115,000, which DF-T1 ITSELF '
      + 'consumed (DF-T1 §R7). The rulings\' running count of 59 is the registry as of '
      + 'DF-T1\'s FREEZE; DF-T3 appends DF-T1\'s two draws, so the registry entering this '
      + 'stage is 61. DF-T2 and IN-T0/IN-T1 and BK-C1 consumed ZERO.',
    minGapToAnyPublishedBase: minStatsGap,
    nextBase: STATS_BASE + 3 * STATS_STEP,
    draw1: `${STATS_BASE} — the paired seed-clustered match-battery bootstrap`,
    draw2: `${STATS_BASE + STATS_STEP} — the ladder's league-clustered slope bootstrap`,
    draw3: `${STATS_BASE + 2 * STATS_STEP} — the WITHIN-ARM seed-clustered bootstrap that `
      + 'carries H-DF.1(a1) and (a2)',
    bootstrapDraws: BOOTSTRAP,
  },
  anchoredExtractions: anchorReceipts,
  containWhyNeedle: { line: CONTAIN_WHY_LINE, occurrences: containWhyOccurrences },
  hdf1,
  usage,
  pressRealisation,
  faces,
  latencyBins,
  latencyPercentiles,
  chaserBins,
  swarmBins,
  ladder: {
    arms: LADDER_ARMS,
    leagues: LADDER_SEEDS.length,
    generations: LADDER_GENS,
    leagueSeasons: ladderLeagueSeasons,
    matches: ladderMatches,
    earlyGens: `1..${EARLY_GENS}`,
    lateGens: `${LATE_FROM}..${LADDER_GENS}`,
    gen1Fingerprints,
    faces: ladderFaces,
    slopes: ladderSlopes,
    floorRead: ladderFloorRead,
  },
  perf: {
    anchorFile: 'docs/perf/baseline.json',
    anchorSha256: createHash('sha256').update(perfAnchorBytes).digest('hex'),
    anchorHead: (perfAnchor as { head?: string }).head ?? null,
    anchorUsPerStep: (perfAnchor as { usPerStep?: number }).usPerStep ?? null,
    note: 'DF-T3 is INSTRUMENT-ONLY — it measures no seam cost. DF-T2 §R8 owns the perf '
      + 'receipt for this door; nothing is re-measured or re-published here.',
  },
  wall: { batterySeconds: batteryWallSec, ladderSeconds: ladderWallSec },
  perSeedCells: rows,
  ladderCells,
  fingerprint: { ofRecord: FINGERPRINT_OF_RECORD, recomputed: fingerprintNow },
  srcTouched: {
    note: 'INSTRUMENT-ONLY stage: src must be UNTOUCHED (the #327 §CORR 1/5 riders are '
      + 'comment-only in src and landed in their OWN commit BEFORE this instrument froze)',
    gitStatusSrc: srcPorcelain,
    gitDiffStatSrcHead: srcDiffStat,
    head: gitOut(['rev-parse', 'HEAD']).trim(),
  },
};

/* ---- gFacesFromDisk: STAGE the body, re-parse it off disk, re-derive EVERY face ---- */
mkdirSync('docs/world-model/data', { recursive: true });
const STAGING = `${OUT.replace(/\.json$/, '')}.staging.json`;
writeFileSync(STAGING, `${JSON.stringify(bodyCore, null, 2)}\n`);
const onDisk = JSON.parse(readFileSync(STAGING, 'utf8')) as typeof bodyCore;
const mismatches: string[] = [];
let checks = 0;
const asJson = (v: number): number | null => (Number.isFinite(v) ? v : null);
const same = (recomputed: number, published: unknown): boolean =>
  Object.is(asJson(recomputed), published as number | null);
{
  const dRows = onDisk.perSeedCells as Row[];
  const dShut = dRows.filter((r) => r.arm === 'shut');
  const dArmed = dRows.filter((r) => r.arm === 'armed');
  for (const [name, d] of Object.entries(FACES)) {
    const published = (onDisk.faces as FaceRow[]).find((f) => f.face === name)!;
    const b = round(ratio(sum(dShut.map(d.num)), sum(dShut.map(d.den))));
    const a = round(ratio(sum(dArmed.map(d.num)), sum(dArmed.map(d.den))));
    const dl = round(ratio(sum(dArmed.map(d.num)), sum(dArmed.map(d.den)))
      - ratio(sum(dShut.map(d.num)), sum(dShut.map(d.den))));
    checks += 3;
    if (!same(b, published.shutValue)) mismatches.push(`face ${name} shut ${b} vs ${published.shutValue}`);
    if (!same(a, published.armedValue)) mismatches.push(`face ${name} armed ${a} vs ${published.armedValue}`);
    if (!same(dl, published.delta)) mismatches.push(`face ${name} delta ${dl} vs ${published.delta}`);
  }
  for (const arm of ['shut', 'armed'] as const) {
    const bins = Array.from({ length: LAT_BINS }, (_, bi) =>
      sum(dRows.filter((r) => r.arm === arm).map((r) => r.reTargetLatencyBins[bi])));
    checks += 1;
    if (JSON.stringify(bins) !== JSON.stringify((onDisk.latencyBins as Record<string, number[]>)[arm])) {
      mismatches.push(`latencyBins ${arm}`);
    }
    for (const [p, k] of [[0.5, `${arm}MedianS`], [0.9, `${arm}P90S`]] as const) {
      checks += 1;
      const v = latQuantile(bins, p as number);
      if (!same(v, (onDisk.latencyPercentiles as Record<string, number>)[k as string])) {
        mismatches.push(`latencyPercentile ${k}`);
      }
    }
    const cb = Array.from({ length: 5 }, (_, bi) =>
      sum(dRows.filter((r) => r.arm === arm).map((r) => r.chaserCountBins[bi])));
    checks += 1;
    if (JSON.stringify(cb) !== JSON.stringify((onDisk.chaserBins as Record<string, number[]>)[arm])) {
      mismatches.push(`chaserBins ${arm}`);
    }
  }
  for (const [k, pickB] of [
    ['shutStance', (r: Row) => (r.arm === 'shut' ? r.swarmStanceBins : null)],
    ['armedStance', (r: Row) => (r.arm === 'armed' ? r.swarmStanceBins : null)],
    ['shutZone', (r: Row) => (r.arm === 'shut' ? r.swarmZoneBins : null)],
    ['armedZone', (r: Row) => (r.arm === 'armed' ? r.swarmZoneBins : null)],
  ] as const) {
    const bins = Array.from({ length: SWARM_BINS }, (_, bi) =>
      sum(dRows.map((r) => pickB(r)?.[bi] ?? 0)));
    checks += 1;
    if (JSON.stringify(bins) !== JSON.stringify((onDisk.swarmBins as Record<string, number[]>)[k])) {
      mismatches.push(`swarmBins ${k}`);
    }
  }
  /* ---- the USAGE block, re-derived from the stored per-seed cells ---- */
  {
    const bo = Array.from({ length: N_OPT }, (_, i) => sum(dArmed.map((r) => r.byOption[i])));
    const bmo = Array.from({ length: 2 * N_OPT }, (_, i) => sum(dArmed.map((r) => r.byModeOption[i])));
    checks += 4;
    if (JSON.stringify(bo) !== JSON.stringify(onDisk.usage.byOption)) mismatches.push('usage/byOption');
    if (JSON.stringify(bmo) !== JSON.stringify(onDisk.usage.byModeOption)) mismatches.push('usage/byModeOption');
    if (sum(dArmed.map((r) => r.elections)) !== onDisk.usage.electionsArmed) mismatches.push('usage/elections');
    if (sum(dArmed.map((r) => r.idle)) !== onDisk.usage.idleArmed) mismatches.push('usage/idle');
    const ts = tercilesOf(bodiesOf(dArmed));
    checks += 1;
    if (JSON.stringify(ts) !== JSON.stringify(onDisk.usage.byDefendingAttrTercile)) {
      mismatches.push('usage/byDefendingAttrTercile');
    }
    /* the (a1)/(a2) POINT ESTIMATES and the frozen booleans, off disk */
    checks += 2;
    if (!same(round(modePressShare(dArmed, 0)), onDisk.hdf1.a_differentiation.a1_bySituation.defend.value)) {
      mismatches.push('hdf1/a1/defendValue');
    }
    if (!same(round(modePressShare(dArmed, 1)), onDisk.hdf1.a_differentiation.a1_bySituation.press.value)) {
      mismatches.push('hdf1/a1/pressValue');
    }
    for (const [opt, pub] of [[OPT_PRESS, onDisk.hdf1.a_differentiation.a2_byBody.press],
      [OPT_TAKE, onDisk.hdf1.a_differentiation.a2_byBody.take]] as const) {
      const pts = [0, 1, 2].map((t) => round(tercileShare(ts, t, opt as number)));
      checks += 2;
      if (JSON.stringify(pts) !== JSON.stringify(pub.pointEstimates)) mismatches.push(`hdf1/a2/${pub.option}/points`);
      if (strictlyMonotone(pts) !== pub.monotone) mismatches.push(`hdf1/a2/${pub.option}/monotone`);
    }
    const a1d = onDisk.hdf1.a_differentiation.a1_bySituation;
    const a2p = onDisk.hdf1.a_differentiation.a2_byBody.press;
    const a2t = onDisk.hdf1.a_differentiation.a2_byBody.take;
    const rA1 = disjoint(a1d.defend, a1d.press);
    const rA2 = a2p.monotone && a2p.disjoint && a2t.monotone && a2t.disjoint;
    checks += 3;
    if (rA1 !== a1d.pass) mismatches.push('hdf1/a1/pass');
    if (rA2 !== onDisk.hdf1.a_differentiation.a2_byBody.pass) mismatches.push('hdf1/a2/pass');
    if ((rA1 && rA2) !== onDisk.hdf1.a_differentiation.pass) mismatches.push('hdf1/a/pass');
  }
  /* ---- the PRESS REALISATION join, off disk ---- */
  {
    const ce = sum(dArmed.map((r) => r.containEpisodes));
    const pe = Array.from({ length: N_OPT }, (_, i) => sum(dArmed.map((r) => r.byOption[i])))[OPT_PRESS];
    checks += 3;
    if (ce !== onDisk.pressRealisation.containEpisodesArmed) mismatches.push('pressRealisation/episodes');
    if (pe !== onDisk.pressRealisation.pressElectionsArmed) mismatches.push('pressRealisation/elections');
    if (!same(round(ratio(ce, pe)), onDisk.pressRealisation.episodesPerPressElection)) {
      mismatches.push('pressRealisation/index');
    }
  }
  /* ---- the ladder: every per-generation face and every slope, through THE ONE FORMULA ---- */
  const dCells = onDisk.ladderCells as LadderCell[];
  for (const lf of onDisk.ladder.faces as LadderFaceRow[]) {
    const cs = dCells.filter((c) => c.arm === lf.arm && c.generation === lf.generation);
    const mt = sum(cs.map((c) => c.matches));
    const expect: Record<string, number> = {
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt)),
      shotsPerTeamMatch: round(ratio(sum(cs.map((c) => c.shots)), mt * 2)),
      shotsOnTargetPerTeamMatch: round(ratio(sum(cs.map((c) => c.shotsOnTarget)), mt * 2)),
      tacklesPerTeamMatch: round(ratio(sum(cs.map((c) => c.tackles)), mt * 2)),
      interceptionsPerTeamMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt * 2)),
      clearancesPerTeamMatch: round(ratio(sum(cs.map((c) => c.clearances)), mt * 2)),
      blocksPerTeamMatch: round(ratio(sum(cs.map((c) => c.blocks)), mt * 2)),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),
    };
    for (const [k, v] of Object.entries(expect)) {
      checks += 1;
      if (!same(v, (lf as unknown as Record<string, number>)[k])) {
        mismatches.push(`ladderFace ${lf.arm}/gen${lf.generation}/${k}`);
      }
    }
    checks += 1;
    if (JSON.stringify(cs.map((c) => round(ratio(c.goals, c.matches)))) !== JSON.stringify(lf.perLeagueGoalsPerMatch)) {
      mismatches.push(`ladderFace ${lf.arm}/gen${lf.generation}/perLeagueGoalsPerMatch`);
    }
  }
  for (const s of onDisk.ladder.slopes as LadderSlope[]) {
    const perLeague = LADDER_SEEDS.map((ls) => {
      const cs = dCells.filter((c) => c.arm === s.arm && c.leagueSeed === ls);
      const early = cs.filter((c) => c.generation <= EARLY_GENS);
      const late = cs.filter((c) => c.generation >= LATE_FROM);
      const f = s.face as (typeof LADDER_SLOPE_FACES)[number];
      const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));
      const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));
      return { early: e, late: l, delta: l - e };
    });
    checks += 4;
    if (!same(round(mean(perLeague.map((p) => p.early))), s.early)) mismatches.push(`slope ${s.arm}/${s.face}/early`);
    if (!same(round(mean(perLeague.map((p) => p.late))), s.late)) mismatches.push(`slope ${s.arm}/${s.face}/late`);
    if (!same(round(slopeDeltaThroughOneFormula(perLeague)), s.delta)) mismatches.push(`slope ${s.arm}/${s.face}/delta`);
    if (!same(round(Math.abs(slopeDeltaThroughOneFormula(perLeague)) / s.halfWidth, 6), s.ratioToHalfWidth)) {
      mismatches.push(`slope ${s.arm}/${s.face}/ratioToHalfWidth`);
    }
  }
  const bs = (onDisk.ladder.slopes as LadderSlope[]).find((s) => s.arm === 'liveShut' && s.face === 'goals')!;
  const as2 = (onDisk.ladder.slopes as LadderSlope[]).find((s) => s.arm === 'liveArmed' && s.face === 'goals')!;
  checks += 4;
  if (!same(round(bs.delta - ATK_FROZEN_FLOOR), onDisk.ladder.floorRead.shutDistanceAboveFloor)) mismatches.push('floorRead/shut');
  if (!same(round(as2.delta - ATK_FROZEN_FLOOR), onDisk.ladder.floorRead.armedDistanceAboveFloor)) mismatches.push('floorRead/armed');
  if (!same(round(as2.delta - bs.delta), onDisk.ladder.floorRead.armedMinusShut)) mismatches.push('floorRead/armedMinusShut');
  if ((as2.delta < bs.delta) !== onDisk.ladder.floorRead.bendsTowardFloor) mismatches.push('floorRead/bendsTowardFloor');
  /* ---- the H-DF.1(b) limbs, recomputed off disk ---- */
  const dMc2 = (onDisk.faces as FaceRow[]).find((f) => f.face === 'multiChaseShare2')!;
  const dMc3 = (onDisk.faces as FaceRow[]).find((f) => f.face === 'multiChaseShare3')!;
  const rB1 = (onDisk.chaserBins as Record<string, number[]>).armed[4] === 0
    && (onDisk.chaserBins as Record<string, number[]>).shut[4] === 0;
  const rB2 = !(dMc2.resolved && dMc2.direction === 'up') && !(dMc3.resolved && dMc3.direction === 'up');
  const rB3 = onDisk.hdf1.b_swarmDoesNotReturn.b3_capSliceShaIdentical.shaBefore === CAP_SHA_OF_RECORD
    && onDisk.hdf1.b_swarmDoesNotReturn.b3_capSliceShaIdentical.shaAfter === CAP_SHA_OF_RECORD
    && onDisk.hdf1.b_swarmDoesNotReturn.b3_capSliceShaIdentical.capRuleOccurrences === 1;
  checks += 4;
  if (rB1 !== onDisk.hdf1.b_swarmDoesNotReturn.b1_fourChaserBinZeroBothArms.pass) mismatches.push('hdf1/b1');
  if (rB2 !== onDisk.hdf1.b_swarmDoesNotReturn.b2_multiChaseDoesNotRise.pass) mismatches.push('hdf1/b2');
  if (rB3 !== onDisk.hdf1.b_swarmDoesNotReturn.b3_capSliceShaIdentical.pass) mismatches.push('hdf1/b3');
  if ((rB1 && rB2 && rB3) !== onDisk.hdf1.b_swarmDoesNotReturn.pass) mismatches.push('hdf1/b');
  const rAll = onDisk.hdf1.a_differentiation.pass;
  checks += 1;
  const expectVerdict = rAll && rB1 && rB2 && rB3 ? 'PASS'
    : rAll ? 'FAIL — (b)' : (rB1 && rB2 && rB3) ? 'FAIL — (a)' : 'FAIL — (a) and (b)';
  if (expectVerdict !== onDisk.hdf1.verdict) mismatches.push('hdf1/verdict');
  /* ---- the body-modal caution census, off disk ---- */
  {
    const agg = new Map<string, number[]>();
    for (const r of dArmed) {
      for (const b of r.bodyRows) {
        const k = `${r.seed}:${b[0]}`;
        const prev = agg.get(k) ?? Array.from({ length: N_OPT }, () => 0);
        for (let i = 0; i < N_OPT; i++) prev[i] += b[1 + i];
        agg.set(k, prev);
      }
    }
    const modal = Array.from({ length: N_OPT }, () => 0);
    let n = 0;
    for (const counts of agg.values()) {
      if (sum(counts) === 0) continue;
      n += 1;
      let arg = 0;
      for (let i = 1; i < N_OPT; i++) if (counts[i] > counts[arg]) arg = i;
      modal[arg] += 1;
    }
    checks += 2;
    if (n !== onDisk.usage.bodiesCounted) mismatches.push('usage/bodiesCounted');
    if (JSON.stringify(modal) !== JSON.stringify(onDisk.usage.bodyModalCounts)) mismatches.push('usage/bodyModalCounts');
  }
}
gates.gFacesFromDisk = mismatches.length === 0;
rmSync(STAGING, { force: true });

/* ---- the FINAL body: every gate written, THEN hashed (DF-C0 §CORR item 2) ---- */
const body = {
  ...bodyCore,
  faceReDerivation: { checks, mismatches },
  gates,
  gatesAllGreen: Object.values(gates).every(Boolean),
};
const ALL_GREEN = body.gatesAllGreen;
const artifact = {
  ...body,
  bodySha256: createHash('sha256').update(JSON.stringify(body)).digest('hex'),
};
const outPath = ALL_GREEN || IS_OVERRIDE ? OUT : `${OUT.replace(/\.json$/, '')}.RED.json`;
const tmp = `${outPath}.tmp`;
writeFileSync(tmp, `${JSON.stringify(artifact, null, 2)}\n`);
renameSync(tmp, outPath);

banner(`\nwrote ${outPath}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : 'RED  '}  ${k}`);
banner(`\nH-DF.1 = ${hdf1.verdict}`);
banner(`  (a1) defend ${a1Defend.value} [${a1Defend.ciLo}, ${a1Defend.ciHi}]`
  + `  vs press ${a1Press.value} [${a1Press.ciLo}, ${a1Press.ciHi}]  disjoint=${a1Pass}`);
banner(`  (a2) press terciles ${JSON.stringify(a2Press.pointEstimates)} mono=${a2Press.monotone}`
  + ` disjoint=${a2Press.disjoint} · take ${JSON.stringify(a2Take.pointEstimates)}`
  + ` mono=${a2Take.monotone} disjoint=${a2Take.disjoint}`);
banner(`  (b1) chaserBins shut=[${chaserBins.shut.join(', ')}] armed=[${chaserBins.armed.join(', ')}]`);
banner(`  (b2) mc2 ${fMc2.shutValue} → ${fMc2.armedValue} Δ ${fMc2.delta} [${fMc2.ciLo}, ${fMc2.ciHi}]`
  + ` · mc3 ${fMc3.shutValue} → ${fMc3.armedValue} Δ ${fMc3.delta} [${fMc3.ciLo}, ${fMc3.ciHi}]`);
banner(`  (b3) cap sha before=${capShaBefore.slice(0, 12)} after=${capShaAfter.slice(0, 12)}`);
banner(`bodyModalCounts = [${bodyModalCounts.join(', ')}] over ${bodiesCounted} bodies`);
banner(`pressRealisation: ${containEpisodesArmed} episodes / ${pressElectionsArmed} elections`
  + ` = ${pressRealisation.episodesPerPressElection}`);
banner(`ladder goals slope: shut ${shutGoalSlope.delta} vs armed ${armedGoalSlope.delta}`
  + `  floor ${ATK_FROZEN_FLOOR}`);
banner(`re-derivation: ${checks} checks, ${mismatches.length} mismatches`);
process.exit(ALL_GREEN ? 0 : 1);
