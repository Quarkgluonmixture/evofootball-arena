#!/usr/bin/env tsx
/**
 * ============================================================================
 * DF-T3B — THE POWER EXTENSION (instrument-only; H-DF.1(a2) RE-RUN VERBATIM)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #334 item 5 (the shared power dispatch), which
 * ratified DF-T3 §COMMANDER CORRECTIONS item 1's disposition: "THE REMEDY IS
 * POWER, NOT A NEW RULE: DF-T3B (the power extension) is QUEUED — the SAME
 * frozen (a2) conjunct on a larger virgin battery".
 *
 * ⛔⛔ THE RULE IS NOT RE-CUT. Not re-binned, not re-thresholded, not softened
 * to "at least one option". The ONLY variable is the seed count: 41 → 121.
 * A SECOND MISS AT HIGHER POWER IS A RESULT, and it is reported as one.
 *
 * ⭐⭐ THE FROZEN RULE, VERBATIM from DF-T3-SURFACE-EXAM.md §P1's table:
 *   (a2) BY BODY — "the `attrs.defending` TERCILE gradient resolves for PRESS
 *   *and* for TAKE: top vs bottom tercile intervals DISJOINT *and* the three
 *   point estimates STRICTLY MONOTONE in tercile index, for BOTH options".
 *   kind: CI (unpaired, within-arm).
 *
 * ⭐ THIS IS A THIN INSTRUMENT. It reproduces ONLY the (a2) machinery from
 * DF-T3's frozen form — the tercile cuts, the within-arm bootstrap idiom, the
 * per-seed cells, the walk-side predicate fixtures — and NOTHING else. Named
 * out, explicitly, so no reader looks for them:
 *   ⛔ NO SEASON LADDER (DF-T3 §R3 owns it; a power re-run of a within-arm
 *      conjunct buys CLUSTERS, not new estimands — the DV-T1B precedent).
 *   ⛔ NO between-arm football faces at all (the churn/coverage family, the
 *      R-乙 chain, the §2 equilibrium faces, multiChase, the swarm/chaser bins
 *      and H-DF.1(b)'s three conjuncts are ALL banked PASS at DF-T3 §R0/§R4
 *      and are not re-asked).
 *   ⛔ NO PRESS-REALISATION WALKER — so the contain-offer predicate this
 *      stage's COMMIT 1 pinned is NOT scored here; its anchored line receipt
 *      rides along as the rider's source receipt and nothing more.
 *   ⛔ NO DOSING anywhere (both arms are flag worlds; #334 item 3's
 *      match-local-copy idiom is N/A and stated as N/A).
 *   ⛔ THE CAP-OFF ARM stays held (M-DF.2; DF-T3 §CORR item 1).
 *
 * ⭐ REPORTED, NEVER SCORED HERE:
 *   · (a1) BY SITUATION — DF-T3 §R0 banked it ✅ at 3.19 half-widths. It is
 *     re-read on the virgin battery as a COMPANION, because the mode-slot
 *     walk-side predicate is pinned anyway and the read is free. THE VERDICT
 *     OF RECORD ON (a1) IS DF-T3's; this is a second draw of the same face.
 *   · ⚠⚠ THE INHERITED CAUTION (DF-T2 §R11 item 1 / #327 §CORR 2, re-ratified
 *     at DF-T3 §R1): 407 of 410 bodies were HOLD-MODAL. The body-modal census
 *     is re-run at this stage's grain and published BESIDE the verdict, as
 *     loudly as it. It is NOT a conjunct.
 *
 * ⭐ THE FROZEN CI RULES — DF-T3 §P2's, REPRODUCED, never re-cut:
 *   · PER-SEED CELLS are stored so every headline re-derives (canon, home
 *     ruling #282.2(ii)).
 *   · WITHIN-ARM contrasts ((a2)'s terciles, (a1)'s two modes) are UNPAIRED:
 *     each side gets its own seed-clustered bootstrap interval and the frozen
 *     test is INTERVAL OVERLAP — DISJOINT = resolved apart. In every draw the
 *     tercile CUTS are recomputed from the resampled bodies, so the cut is
 *     INSIDE the bootstrap, not outside it.
 *   · 2,000 resamples; 95 % percentile intervals; the bootstrap rng is seeded
 *     from its OWN published STATS BASE (block-base discipline).
 *   · Canon (paraphrase): moving denominators disclosed per face (home PW-C0
 *     §CORR item 2) — every published share carries its own denominator.
 *   · Canon VERBATIM: "a max−min face reports a noise-floor comparison, not a
 *     zero-null CI" (home PC-T1 §CORR item 3) — no max−min face is published.
 *   · Canon VERBATIM: "arming receipts, not football findings" (home ruling
 *     #289 item 1) — the arms-distinguishable check is an OUTCOME DIGEST
 *     comparison, deliberately NOT a football effect size.
 *
 * ⭐⭐ WALK-SIDE PREDICATES PINNED — canon VERBATIM: "a scored face's walk-side
 * predicate is pinned — anchored extraction or fixture — because the
 * re-derivation gate proves arithmetic, not definitions" (home: DF-T3 §CORR
 * item 2, ruling #332 item 3), REFINED at #334 item 2: "anchored extraction
 * protects the source line; a headline-bearing walk-side predicate ALSO needs
 * a COMPOSITION FIXTURE" (home: BK-T3 §CORR item 2). Every predicate this
 * conjunct is scored through — the mode slot, the tercile cut, the monotone
 * test and the DISJOINTNESS test itself — carries hand-computed fixtures
 * evaluated in the CONSTRUCTION CLASS before a single battery walk, and a
 * disagreement exits 3 with nothing written. ⭐ The disjointness fixtures
 * include DF-T3 §R0's OWN PUBLISHED INTERVALS: the frozen criterion must
 * reproduce that draw's PRESS pass and TAKE red on the record's numbers.
 *
 * ⭐ RED ROUTING (#334 item 3, now a REQUIRED brief clause): a RED run writes
 * `…RED.json`; the canonical path is only reached all-green.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: DFT3B_MODE (smoke|full, REQUIRED) · DFT3B_N · DFT3B_OUT.
 *   ANY other `DFT3B_*` var is a FATAL refusal, and so is ANY engine env door.
 *   An override run (smoke / N / OUT) may NOT write the canonical path.
 *
 * RUN: DFT3B_MODE=full npx tsx scripts/probes/df-t3b-power-extension.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) ·
 *       2 = an env refusal · 3 = the construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { DF_SURFACE_OPTIONS } from '../../src/ai/TeamBrain';
import { Rng } from '../../src/utils/rng';

const banner = (s: string): void => { process.stdout.write(`${s}\n`); };

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE                                               */
/* ========================================================================== */
const ENV_WHITELIST = ['DFT3B_MODE', 'DFT3B_N', 'DFT3B_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE_ARMED', 'A4_WORLD', 'EVO_', 'SIM_'];
for (const k of Object.keys(process.env)) {
  if (k.startsWith('DFT3B_') && !(ENV_WHITELIST as readonly string[]).includes(k)) {
    console.error(`ENV REFUSAL: ${k} is not on the whitelist`);
    process.exit(2);
  }
  if (ENGINE_DOORS.some((d) => k === d || k.startsWith(d))) {
    console.error(`ENV REFUSAL: engine door ${k} is set`);
    process.exit(2);
  }
}
type Mode = 'smoke' | 'full';
const MODE = process.env.DFT3B_MODE as Mode | undefined;
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('ENV REFUSAL: DFT3B_MODE must be smoke|full');
  process.exit(2);
}
const N_ENV = process.env.DFT3B_N === undefined ? null : Number(process.env.DFT3B_N);
const OUT_OVERRIDE = process.env.DFT3B_OUT ?? null;
const CANONICAL_OUT = 'docs/world-model/data/df-t3b-power-extension.json';
const OUT = OUT_OVERRIDE ?? CANONICAL_OUT;
const IS_OVERRIDE = OUT_OVERRIDE !== null || MODE !== 'full' || N_ENV !== null;
if (IS_OVERRIDE && OUT === CANONICAL_OUT) {
  console.error('REFUSAL: an override run (smoke / N / OUT) may not write the canonical path');
  process.exit(2);
}

/* ========================================================================== */
/* §1 SEEDS — BOOKED = WALKED, the block consumed whole                       */
/* ========================================================================== */
/** DF-T3B's OWN booked block (ruling #334 item 5): 12,518,000–999. */
const BLOCK_BASE = 12_518_000;
const RECEIPT_SEED = BLOCK_BASE + 999;
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 120 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
/**
 * THE SUB-RANGES, DECLARED BEFORE THE RUN (BOOKED = WALKED reported after):
 *   12,518,000 – 12,518,119  the power battery (120 paired virgin seeds)
 *   12,518,800 – 12,518,802  the in-band smoke prefix
 *   12,518,999               the xxx,999 world-construction receipt seed (WALKED)
 * ⛔ NO LADDER SUB-RANGE — this stage runs no ladder (see the header).
 * THE BLOCK 12,518,000–999 IS CONSUMED WHOLE OF RECORD either way.
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
 * ⭐ ANCHORED EXTRACTION (canon, home BK-C0 §CORR item 1): every line this
 * instrument's walk-side layout depends on is pulled from ONE named line that
 * must occur EXACTLY ONCE in its file. Line numbers are REPORTED, never
 * asserted — the line number is the thing that drifts.
 */
interface Anchor { id: string; file: string; line: string; re: RegExp; expect: string }
const CONTAIN_OFFER_LINE =
  '      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {';
const ANCHORS: readonly Anchor[] = [
  {
    /** the MODE SLOT of record: Press ⇒ 1, everything else ⇒ 0 */
    id: 'dfLedgerModeSlot',
    file: 'src/ai/TeamBrain.ts',
    line: "    const modeSlot = team.mode === 'Press' ? 1 : 0;",
    re: /team\.mode === 'Press' \? (\d) : 0;/,
    expect: '1',
  },
  {
    /** the byModeOption INDEX COMPOSITION of record: slot × |options| + option */
    id: 'dfLedgerModeIndex',
    file: 'src/ai/TeamBrain.ts',
    line: '      ledger.byModeOption[modeSlot * DF_SURFACE_OPTIONS.length + opt] += 1;',
    re: /\[(modeSlot \* DF_SURFACE_OPTIONS\.length \+ opt)\]/,
    expect: 'modeSlot * DF_SURFACE_OPTIONS.length + opt',
  },
  {
    /** the per-BODY row this stage's TERCILE join reads — raw counts, joined instrument-side */
    id: 'dfLedgerByGid',
    file: 'src/ai/TeamBrain.ts',
    line: '      ledger.byGid.set(p.gid, perBody);',
    re: /byGid\.set\((p\.gid), perBody\);/,
    expect: 'p.gid',
  },
  {
    /**
     * ⭐ THE RIDER'S SOURCE RECEIPT ONLY (this stage's COMMIT 1). The contain-offer
     * predicate is NOT walked by this thin instrument and NOT scored here; the line is
     * carried so the pin's source is line-receipted at the freeze commit too.
     */
    id: 'containOfferPredicateRiderReceipt',
    file: 'src/ai/PlayerBrain.ts',
    line: CONTAIN_OFFER_LINE,
    re: /dC < (\d+(?:\.\d+)?) && carrierGoalD < 35 && dist\(p\.pos, ownGoal\) < carrierGoalD/,
    expect: '8',
  },
];
interface AnchorReceipt {
  id: string; file: string; line: string; re: string;
  matches: number; lineNumbers: number[]; captured: string; expected: string;
}
const anchorReceipts: AnchorReceipt[] = ANCHORS.map((a) => {
  const lines = readSrc(a.file).split('\n');
  const hits = lines.map((l, i) => (l === a.line ? i + 1 : 0)).filter((n) => n > 0);
  const m = a.re.exec(a.line);
  return {
    id: a.id, file: a.file, line: a.line, re: a.re.source,
    matches: hits.length, lineNumbers: hits,
    captured: m === null ? 'NO-MATCH' : (m[1] as string),
    expected: a.expect,
  };
});
const ANCHORS_OK = anchorReceipts.every((r) => r.matches === 1 && r.captured === r.expected);
if (!ANCHORS_OK) {
  console.error('CONSTRUCTION CLASS: an anchored extraction did not resolve', anchorReceipts);
  process.exit(3);
}

/* ========================================================================== */
/* §2b ⭐⭐ THE WALK-SIDE PREDICATE PINS — the refined canon's composition half */
/* ========================================================================== */
const N_OPT = DF_SURFACE_OPTIONS.length;
const OPT_PRESS = DF_SURFACE_OPTIONS.indexOf('press');
const OPT_TAKE = DF_SURFACE_OPTIONS.indexOf('take');
const N_TERCILES = 3;

/** THE MODE SLOT COMPOSITION, mirroring the anchored src line exactly. */
const modeSlotOf = (mode: string): number => (mode === 'Press' ? 1 : 0);
const byModeIndexOf = (mode: string, opt: number): number => modeSlotOf(mode) * N_OPT + opt;
/** THE TERCILE CUT: ascending bodies sliced at floor(t·n/3) — DF-T3's own form. */
const tercileBoundsOf = (n: number, t: number): { lo: number; hi: number } => ({
  lo: Math.floor((t * n) / N_TERCILES),
  hi: Math.floor(((t + 1) * n) / N_TERCILES),
});
/** THE MONOTONE TEST: strictly monotone in tercile index, either direction. */
const strictlyMonotone = (xs: readonly number[]): boolean =>
  xs.every((v) => Number.isFinite(v))
  && ((xs[0] < xs[1] && xs[1] < xs[2]) || (xs[0] > xs[1] && xs[1] > xs[2]));
interface Interval { value: number; ciLo: number; ciHi: number; halfWidth: number }
/** THE FROZEN DISJOINTNESS TEST — the whole (a2) criterion turns on this one function. */
const disjoint = (a: Interval, b: Interval): boolean =>
  Number.isFinite(a.ciLo) && Number.isFinite(b.ciLo) && (a.ciHi < b.ciLo || b.ciHi < a.ciLo);
const iv = (ciLo: number, ciHi: number): Interval =>
  ({ value: (ciLo + ciHi) / 2, ciLo, ciHi, halfWidth: (ciHi - ciLo) / 2 });

interface PredicatePin { predicate: string; case: string; expected: string; actual: string }
const predicatePins: PredicatePin[] = [];
const pin = (predicate: string, name: string, expected: unknown, actual: unknown): void => {
  predicatePins.push({
    predicate, case: name, expected: JSON.stringify(expected), actual: JSON.stringify(actual),
  });
};
/* --- THE MODE SLOT: Press is slot 1, EVERY other mode is slot 0 --- */
pin('modeSlotOf', 'Press — the pressing block is slot 1', 1, modeSlotOf('Press'));
pin('modeSlotOf', 'Defend — slot 0', 0, modeSlotOf('Defend'));
pin('modeSlotOf', 'Attack — NOT Press, so slot 0 (the src line is a Press test, not a switch)',
  0, modeSlotOf('Attack'));
pin('byModeIndexOf', 'Defend × press = index 0', 0, byModeIndexOf('Defend', OPT_PRESS));
pin('byModeIndexOf', 'Defend × take = index 3', 3, byModeIndexOf('Defend', OPT_TAKE));
pin('byModeIndexOf', '⭐ Press × press = index 4 (the slot MULTIPLIER, not an offset by one)',
  4, byModeIndexOf('Press', OPT_PRESS));
pin('byModeIndexOf', 'Press × take = index 7', 7, byModeIndexOf('Press', OPT_TAKE));
pin('DF_SURFACE_OPTIONS', 'the option order of record — press/hold/jump/take',
  ['press', 'hold', 'jump', 'take'], [...DF_SURFACE_OPTIONS]);
/* --- THE TERCILE CUT: three contiguous ascending slices, remainder to the TOP --- */
pin('tercileBoundsOf', '9 bodies — three equal thirds, bottom [0,3)',
  { lo: 0, hi: 3 }, tercileBoundsOf(9, 0));
pin('tercileBoundsOf', '9 bodies — middle [3,6)', { lo: 3, hi: 6 }, tercileBoundsOf(9, 1));
pin('tercileBoundsOf', '9 bodies — top [6,9)', { lo: 6, hi: 9 }, tercileBoundsOf(9, 2));
pin('tercileBoundsOf', '⭐ 10 bodies — the REMAINDER lands in the TOP tercile [6,10)',
  { lo: 6, hi: 10 }, tercileBoundsOf(10, 2));
pin('tercileBoundsOf', '11 bodies — bottom is still [0,3), top is [7,11)',
  [{ lo: 0, hi: 3 }, { lo: 7, hi: 11 }], [tercileBoundsOf(11, 0), tercileBoundsOf(11, 2)]);
pin('tercileBoundsOf', '⚠ 2 bodies — the BOTTOM tercile is EMPTY (a degenerate cut, stated)',
  { lo: 0, hi: 0 }, tercileBoundsOf(2, 0));
pin('tercileBoundsOf', 'the three slices always PARTITION n (no body counted twice, none lost)',
  [true, true], [
    tercileBoundsOf(97, 0).hi === tercileBoundsOf(97, 1).lo
      && tercileBoundsOf(97, 1).hi === tercileBoundsOf(97, 2).lo,
    tercileBoundsOf(97, 0).lo === 0 && tercileBoundsOf(97, 2).hi === 97,
  ]);
/* --- THE MONOTONE TEST: STRICT, either direction, NaN-hostile --- */
pin('strictlyMonotone', 'rising 1 < 2 < 3 — TRUE', true, strictlyMonotone([1, 2, 3]));
pin('strictlyMonotone', 'falling 3 > 2 > 1 — TRUE (either direction is monotone)',
  true, strictlyMonotone([3, 2, 1]));
pin('strictlyMonotone', '⭐ a TIE is not STRICT — [1, 1, 2] is FALSE', false,
  strictlyMonotone([1, 1, 2]));
pin('strictlyMonotone', 'a kink [1, 3, 2] — FALSE', false, strictlyMonotone([1, 3, 2]));
pin('strictlyMonotone', 'a NaN anywhere — FALSE, never silently true', false,
  strictlyMonotone([1, Number.NaN, 3]));
pin('strictlyMonotone', '⭐ DF-T3 §R0\'s published TAKE points — monotone TRUE, as recorded',
  true, strictlyMonotone([0.150150781962, 0.156426726245, 0.166339494055]));
/* --- ⭐⭐ THE DISJOINTNESS TEST, PINNED AGAINST DF-T3 §R0's OWN PUBLISHED NUMBERS --- */
pin('disjoint', 'clearly separated intervals — TRUE', true, disjoint(iv(0, 1), iv(2, 3)));
pin('disjoint', 'nested intervals — FALSE', false, disjoint(iv(0, 3), iv(1, 2)));
pin('disjoint', '⭐ intervals that merely TOUCH at an endpoint — FALSE (strict `<`)',
  false, disjoint(iv(0, 1), iv(1, 2)));
pin('disjoint', 'order does not matter — the reversed pair agrees',
  [true, true], [disjoint(iv(0, 1), iv(2, 3)), disjoint(iv(2, 3), iv(0, 1))]);
pin('disjoint', 'a NaN edge — FALSE, never silently true',
  false, disjoint(iv(Number.NaN, 1), iv(2, 3)));
pin('disjoint',
  '⭐⭐ DF-T3 §R0\'s PRESS bottom [0.000909642207398, 0.00231122149781] vs top '
  + '[0.00257751497233, 0.00481417292509] — DISJOINT, exactly as that draw scored ✅',
  true, disjoint(iv(0.000909642207398, 0.00231122149781), iv(0.00257751497233, 0.00481417292509)));
pin('disjoint',
  '⭐⭐ DF-T3 §R0\'s TAKE bottom [0.139787870547, 0.160352359808] vs top '
  + '[0.152372659991, 0.180705992363] — OVERLAP, exactly as that draw scored ⛔ (this is '
  + 'the red DF-T3B exists to re-power; the criterion is proven to reproduce it)',
  false, disjoint(iv(0.139787870547, 0.160352359808), iv(0.152372659991, 0.180705992363)));
const PREDICATE_PINS_OK = predicatePins.every((p) => p.expected === p.actual);
if (!PREDICATE_PINS_OK) {
  console.error('CONSTRUCTION CLASS: a walk-side predicate pin FAILED',
    predicatePins.filter((p) => p.expected !== p.actual));
  process.exit(3);
}

/* ========================================================================== */
/* §2c THE ARMS — DF-T3 §P3's, byte-for-byte                                  */
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
/**
 * ⭐ THE ARMS (DF-T3 §P3, reproduced): shut = the world-9 stack + `dfAssignPersist`
 * (DF-T1's BANKED world, the matched floor); armed = the same + `dfSurface`.
 * `dfSurface` is the ONLY difference. ⛔ NO DOSE anywhere — both are flag worlds.
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
const worldConjuncts = (m: Match, armed: boolean): Record<string, boolean> => {
  const mm = m as unknown as {
    pcLatency: unknown; l3Defence: unknown;
    c7Windup: boolean; o1PassWindup: boolean; pcReactionLatency: boolean;
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
    inSnapshotLaw: boolean; inLookAct: boolean;
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
    /** ⭐ ONE SEAM FAMILY: the IN doors are shut on both arms (DF-T3's stack, unchanged) */
    inDoorsShutBothArms: mm.inSnapshotLaw === false && mm.inLookAct === false,
  };
};

/* ========================================================================== */
/* §3 THE ROW — per-seed cells, ONLY what (a2) and its companions need         */
/* ========================================================================== */
interface Row {
  arm: 'shut' | 'armed';
  seed: number;
  worldOk: boolean;
  ticks: number;
  stepWallMs: number;
  /** the DF-T2 usage ledger, read at the whistle (pure bookkeeping in src) */
  elections: number;
  idle: number;
  pressOffered: number;
  pressDeclinedByBook: number;
  byOption: number[];
  byModeOption: number[];
  /** per-body: [defendingAttr, press, hold, jump, take] — the join is INSTRUMENT-side */
  bodyRows: number[][];
  /**
   * ⭐ AN ARMING RECEIPT, NOT A FOOTBALL FACE (canon, home ruling #289 item 1): a digest of
   * the walk's own outcome, used ONLY to prove the two arms are different worlds per seed.
   * No football quantity is published from it and no CI is attached to it.
   */
  outcomeDigest: string;
}

const zeros = (n: number): number[] => Array.from({ length: n }, () => 0);

const walk = (seed: number, armed: boolean): Row => {
  const m = buildMatch(seed, armed);
  const wOk = Object.values(worldConjuncts(m, armed)).every(Boolean);
  const t0 = Date.now();
  let ticks = 0;
  while (!m.finished) { m.step(DT); ticks += 1; }
  const led = m.dfSurfaceLedger;
  const attrOf = new Map<number, number>();
  for (const t of m.teams) for (const p of t.players) attrOf.set(p.gid, p.attrs.defending);
  const bodyRows: number[][] = [];
  for (const [gid, counts] of led.byGid) {
    bodyRows.push([attrOf.get(gid) ?? Number.NaN, ...counts]);
  }
  bodyRows.sort((a, b) => a[0] - b[0]);
  const r = m.getResult();
  return {
    arm: armed ? 'armed' : 'shut',
    seed,
    worldOk: wOk,
    ticks,
    stepWallMs: Date.now() - t0,
    elections: led.elections,
    idle: led.idle,
    pressOffered: led.pressOffered,
    pressDeclinedByBook: led.pressDeclinedByBook,
    byOption: [...led.byOption],
    byModeOption: [...led.byModeOption],
    bodyRows,
    outcomeDigest: createHash('sha256')
      .update(JSON.stringify({ score: r.score, stats: r.stats, events: r.events.length, ticks }))
      .digest('hex'),
  };
};

/* ========================================================================== */
/* §4 STATS BASES — the registry, floor 116,400, step ≥ 200                    */
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
 * THE REGISTRY OF RECORD ENTERING THIS STAGE IS 67 (ruling #333 item 4): IN-C0's completed
 * 56 + 114,200 (IN-C0/IN-C0-FIX) + 114,400/114,600 (DF-C0) + 114,800/115,000 (DF-T1) +
 * 115,200/115,400/115,600 (DF-T3) + 115,800/116,000/116,200 (IN-T2). BK-T3 consumed ZERO
 * (#334 item 4). THIS STAGE CONSUMES EXACTLY ONE base — it has exactly one bootstrap draw.
 */
const REGISTRY_ADDITIONS: readonly number[] = [
  114_200, 114_400, 114_600, 114_800, 115_000, 115_200, 115_400, 115_600,
  115_800, 116_000, 116_200,
];
const STATS_PUBLISHED_BASES: readonly number[] = [
  ...new Set([...R9_INHERITED_BASES, ...REGISTRY_ADDITIONS]),
].sort((a, b) => a - b);
const REGISTRY_COMPLETE = R9_INHERITED_BASES.length === 56
  && STATS_PUBLISHED_BASES.length === 67
  && REGISTRY_ADDITIONS.every((b) => !R9_INHERITED_BASES.includes(b));
const STATS_BASE = 116_400;
const STATS_STEP = 200;
/** ONE draw ⇒ ONE base: the WITHIN-ARM seed-clustered bootstrap that carries (a2). */
const STATS_BASES_CONSUMED = [STATS_BASE] as const;
const minStatsGap = Math.min(...STATS_BASES_CONSUMED
  .flatMap((mine) => STATS_PUBLISHED_BASES.map((b) => Math.abs(mine - b))));

/* ========================================================================== */
/* §5 THE CONSTRUCTION CLASS — refuse BEFORE any battery (nothing written)     */
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

/* ========================================================================== */
/* §6 THE BATTERY                                                              */
/* ========================================================================== */
banner(`DF-T3B: mode=${MODE} battery=${SEEDS.length} seeds × 2 arms (NO ladder, by design)`);
const tBattery0 = Date.now();
const rows: Row[] = [];
for (const seed of SEEDS) {
  for (const armed of [false, true]) rows.push(walk(seed, armed));
}
const batteryWallSec = Number(((Date.now() - tBattery0) / 1000).toFixed(3));
const seedsWalked = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
banner(`battery done in ${batteryWallSec}s — ${rows.length} walks`);

/* ========================================================================== */
/* §7 ⭐⭐ H-DF.1(a2) — THE WITHIN-ARM TERCILE BLOCK, DF-T3's form reproduced    */
/* ========================================================================== */
const round = (v: number, digits = 12): number =>
  (Number.isFinite(v) ? Number(v.toPrecision(digits)) : v);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const ratio = (n: number, d: number): number => (d === 0 ? Number.NaN : n / d);
const shareOf = (xs: readonly number[]): number[] => {
  const t = sum(xs);
  return xs.map((x) => round(ratio(x, t)));
};
const armedRows = rows.filter((r) => r.arm === 'armed');
const shutRows = rows.filter((r) => r.arm === 'shut');
const armedBySeed = new Map(armedRows.map((r) => [r.seed, r]));
const shutBySeed = new Map(shutRows.map((r) => [r.seed, r]));

const BOOTSTRAP = 2000;
const pickPct = (draws: readonly number[], p: number): number => (draws.length === 0 ? Number.NaN
  : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
/**
 * ⭐ THE WITHIN-ARM BOOTSTRAP — DF-T3 §P2's idiom, reproduced: the cluster is the SEED, the
 * contrast is UNPAIRED, each side gets its OWN interval and the frozen test is INTERVAL
 * OVERLAP. The rng is seeded from THIS stage's own published stats base.
 */
const rngWithin = new Rng(STATS_BASE);
const withinIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngWithin.next() * seedsWalked.length)));
const intervalOf = (draws: number[], value: number): Interval => {
  draws.sort((a, b) => a - b);
  const lo = pickPct(draws, 0.025);
  const hi = pickPct(draws, 0.975);
  return { value: round(value), ciLo: round(lo), ciHi: round(hi), halfWidth: round((hi - lo) / 2) };
};

interface TercileRow {
  tercile: number; n: number; defendingAttrLo: number; defendingAttrHi: number;
  counts: number[]; shares: number[];
}
const bodiesOf = (rs: readonly Row[]): Array<{ attr: number; counts: number[] }> => {
  const out: Array<{ attr: number; counts: number[] }> = [];
  for (const r of rs) for (const b of r.bodyRows) out.push({ attr: b[0], counts: b.slice(1) });
  out.sort((a, b) => a.attr - b.attr);
  return out;
};
const tercilesOf = (bodies: ReadonlyArray<{ attr: number; counts: number[] }>): TercileRow[] =>
  [0, 1, 2].map((t) => {
    const { lo, hi } = tercileBoundsOf(bodies.length, t);
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
interface A2Limb {
  option: string; bottom: Interval; middle: number; top: Interval;
  pointEstimates: number[]; monotone: boolean; disjoint: boolean; pass: boolean;
  overlapMetres: number; gapOverLargerHalfWidth: number; denominators: number[];
}
const a2Of = (opt: number): A2Limb => {
  const bottom = a2Interval(0, opt);
  const top = a2Interval(2, opt);
  const pts = [0, 1, 2].map((t) => round(tercileShare(terciles, t, opt)));
  const mono = strictlyMonotone(pts);
  const dis = disjoint(bottom, top);
  return {
    option: DF_SURFACE_OPTIONS[opt], bottom, middle: pts[1], top,
    pointEstimates: pts, monotone: mono, disjoint: dis, pass: mono && dis,
    /** the SIGNED overlap of the two intervals in units of SHARE (positive ⇒ they overlap) */
    overlapMetres: round(Math.min(bottom.ciHi, top.ciHi) - Math.max(bottom.ciLo, top.ciLo)),
    gapOverLargerHalfWidth: round(Math.abs(top.value - bottom.value)
      / Math.max(bottom.halfWidth, top.halfWidth), 6),
    denominators: [0, 1, 2].map((t) => sum(terciles[t].counts)),
  };
};
const a2Press = a2Of(OPT_PRESS);
const a2Take = a2Of(OPT_TAKE);
const A2_PASS = a2Press.pass && a2Take.pass;

/* ---- (a1) THE COMPANION RE-READ (REPORTED — DF-T3 §R0 owns the verdict) ---- */
const modePressShare = (rs: readonly Row[], mode: 'Defend' | 'Press'): number => {
  const base = modeSlotOf(mode) * N_OPT;
  const block = Array.from({ length: N_OPT }, (_, i) =>
    sum(rs.map((r) => r.byModeOption[base + i])));
  return ratio(block[OPT_PRESS], sum(block));
};
const a1Interval = (mode: 'Defend' | 'Press'): Interval => {
  const draws: number[] = [];
  for (const idx of withinIndex) {
    const rs = idx.map((i) => armedBySeed.get(seedsWalked[i])!);
    const v = modePressShare(rs, mode);
    if (Number.isFinite(v)) draws.push(v);
  }
  return intervalOf(draws, modePressShare(armedRows, mode));
};
const a1Defend = a1Interval('Defend');
const a1Press = a1Interval('Press');
const a1Disjoint = disjoint(a1Defend, a1Press);

/* ---- ⚠⚠ THE INHERITED CAUTION, re-measured at this stage's grain ---- */
const bodyModalCensusOf = (rs: readonly Row[]): { bodiesCounted: number; counts: number[] } => {
  const agg = new Map<string, number[]>();
  for (const r of rs) {
    for (const b of r.bodyRows) {
      const k = `${r.seed}:${b[0]}`;
      const prev = agg.get(k) ?? zeros(N_OPT);
      for (let i = 0; i < N_OPT; i++) prev[i] += b[1 + i];
      agg.set(k, prev);
    }
  }
  const counts = zeros(N_OPT);
  let bodiesCounted = 0;
  for (const cs of agg.values()) {
    if (sum(cs) === 0) continue;
    bodiesCounted += 1;
    let arg = 0;
    for (let i = 1; i < N_OPT; i++) if (cs[i] > cs[arg]) arg = i;
    counts[arg] += 1;
  }
  return { bodiesCounted, counts };
};
const bodyModal = bodyModalCensusOf(armedRows);

const byOptionPooled = Array.from({ length: N_OPT }, (_, i) => sum(armedRows.map((r) => r.byOption[i])));
const byModeOptionPooled = Array.from({ length: 2 * N_OPT }, (_, i) =>
  sum(armedRows.map((r) => r.byModeOption[i])));

const usage = {
  optionOrder: [...DF_SURFACE_OPTIONS],
  mechanismOfRecord: 'DF-T3 §P1 (#327 §CORR item 5) VERBATIM — TWO PRICED ELECTIONS + ONE '
    + 'DERIVED LABEL: press-vs-mark and hold-vs-switch are CHOSEN; jump-vs-take is the L3 '
    + 'account\'s own sign LABELLING the outcome. (a2) is the tercile gradient of press AND '
    + 'take BY BODY, never "four choosable acts".',
  note: 'ONE row per DEFENDER per assignment pass (the TEAM_AI_INTERVAL cadence) — a '
    + 'DECISION distribution, not a tick distribution. Shut-arm counts are structurally zero '
    + '(gLedgerZeroWhenShut).',
  electionsArmed: sum(armedRows.map((r) => r.elections)),
  idleArmed: sum(armedRows.map((r) => r.idle)),
  byOption: byOptionPooled,
  byOptionShare: shareOf(byOptionPooled),
  byModeOption: byModeOptionPooled,
  byModeOptionShareDefend: shareOf(byModeOptionPooled.slice(0, N_OPT)),
  byModeOptionSharePress: shareOf(byModeOptionPooled.slice(N_OPT)),
  bodiesCounted: bodyModal.bodiesCounted,
  bodyModalCounts: bodyModal.counts,
  bodyModalShare: shareOf(bodyModal.counts),
  bodyModalCaution: '⚠⚠ THE INHERITED CAUTION (DF-T2 §R11 item 1, ratified #327 §CORR 2, '
    + 'reproduced at DF-T3 §R1 as 407 of 410 bodies HOLD-MODAL on independent seeds). This '
    + 'census is the SAME reading re-run on THIS stage\'s virgin battery. It is REPORTED '
    + 'BESIDE the (a2) verdict and is NOT a conjunct of it — the verdict is the conjunct\'s, '
    + 'the caution is the reader\'s.',
  byDefendingAttrTercile: terciles,
  pressOfferedArmed: sum(armedRows.map((r) => r.pressOffered)),
  pressDeclinedByBookArmed: sum(armedRows.map((r) => r.pressDeclinedByBook)),
};

/* ========================================================================== */
/* §8 GATES (frozen; a RED gate stays RED and is reported)                     */
/* ========================================================================== */
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }); } catch { return 'GIT-FAILED'; }
};
const gates: Record<string, boolean> = {};
gates.gWorldOkEveryWalk = rows.every((r) => r.worldOk);
/**
 * BOOKED = WALKED from INDEPENDENT RECORDS (#334 item 3: gates that cannot fail are not
 * gates): the BOOKED list is the declared seed constant, the WALKED list is derived from the
 * per-seed cells the battery actually produced. Neither is computed from the other.
 */
gates.gSeedsBookedEqualWalked = seedsWalked.length === SEEDS.length
  && SEEDS.every((s) => seedsWalked.includes(s))
  && seedsWalked.every((s) => SEEDS.includes(s));
gates.gArmsPairedPerSeed = seedsWalked.every((s) => rows.filter((r) => r.seed === s).length === 2)
  && seedsWalked.every((s) => shutBySeed.has(s) && armedBySeed.has(s));
gates.gAnchorsResolveOnce = anchorReceipts.every((r) => r.matches === 1) && ANCHORS_OK;
gates.gWalkSidePredicatesPinned = PREDICATE_PINS_OK && predicatePins.length >= 24;
const srcPorcelain = gitOut(['status', '--porcelain', '--', 'src']).trim();
const srcDiffStat = gitOut(['diff', '--stat', 'HEAD', '--', 'src']).trim();
gates.gSrcUntouched = srcPorcelain === '' && srcDiffStat === '';
/** DORMANCY MEASURED IN-BATTERY: the ledger is untouched with the door shut */
gates.gLedgerZeroWhenShut = shutRows.every((r) =>
  r.elections === 0 && r.idle === 0 && r.pressOffered === 0 && r.pressDeclinedByBook === 0
  && r.byOption.every((x) => x === 0) && r.byModeOption.every((x) => x === 0)
  && r.bodyRows.length === 0);
/** ⭐ NON-DEGENERACY LIVENESS: all four options used at least once (a one-corner surface is RED) */
gates.gEveryOptionUsed = byOptionPooled.every((x) => x > 0);
gates.gUsageCellsStored = armedRows.every((r) => r.bodyRows.length > 0)
  && bodyModal.bodiesCounted > 0 && sum(byModeOptionPooled) > 0;
/** ⭐ THE SCORED CELLS ARE ALIVE: every tercile carries bodies AND decisions in BOTH options */
gates.gTercileCellsAlive = terciles.every((t) => t.n > 0 && sum(t.counts) > 0
  && t.counts[OPT_PRESS] > 0 && t.counts[OPT_TAKE] > 0);
/** ⭐ the bootstrap really resampled — a degenerate interval is not a measurement */
gates.gWithinBootstrapAlive = withinIndex.length === BOOTSTRAP
  && [a2Press, a2Take].every((l) => l.bottom.halfWidth > 0 && l.top.halfWidth > 0);
/** ⭐ AN ARMING RECEIPT: the two arms are different worlds on EVERY seed */
gates.gArmsDistinguishable = seedsWalked.every((s) =>
  shutBySeed.get(s)!.outcomeDigest !== armedBySeed.get(s)!.outcomeDigest);
gates.gSeedDiscipline = SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999)
  && seedsWalked.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999);
gates.gStatsDisjoint = STATS_BASE >= 116_400 && minStatsGap >= STATS_STEP && REGISTRY_COMPLETE;
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
/* §9 THE ARTIFACT — allowlist schema; STAGE, re-derive off disk, hash LAST    */
/* ========================================================================== */
const instrumentSha = createHash('sha256')
  .update(readFileSync(new URL(import.meta.url))).digest('hex');

const hdf1a2 = {
  ruleVerbatim: 'the `attrs.defending` TERCILE gradient resolves for PRESS *and* for TAKE: '
    + 'top vs bottom tercile intervals DISJOINT *and* the three point estimates STRICTLY '
    + 'MONOTONE in tercile index, for BOTH options',
  ruleHome: 'DF-T3-SURFACE-EXAM.md §P1, conjunct (a2) BY BODY — QUOTED VERBATIM AND NOT '
    + 'RE-CUT. The only thing this stage changed is the number of seeds (41 → '
    + `${SEEDS.length}).`,
  kind: 'CI (unpaired, within-arm) — interval OVERLAP is the frozen test; DISJOINT = resolved',
  priorDraw: {
    stage: 'DF-T3 §R0 (41 paired seeds, block 12,515,000–999, stats base 115,600)',
    pressVerdict: 'PASS — points [0.00150781962269, 0.00324652656566, 0.00362976406534], '
      + 'bottom [0.000909642207398, 0.00231122149781] vs top [0.00257751497233, '
      + '0.00481417292509]',
    takeVerdict: 'FAIL — points [0.150150781962, 0.156426726245, 0.166339494055] monotone '
      + 'TRUE, bottom [0.139787870547, 0.160352359808] vs top [0.152372659991, '
      + '0.180705992363] OVERLAP by 0.0080 of share',
    disposition: 'DF-T3 §CORR item 1: "THE REMEDY IS POWER, NOT A NEW RULE."',
  },
  press: a2Press,
  take: a2Take,
  pass: A2_PASS,
  verdict: A2_PASS ? 'PASS' : a2Press.pass ? 'FAIL — TAKE' : a2Take.pass ? 'FAIL — PRESS'
    : 'FAIL — PRESS and TAKE',
  scopeNote: '⛔ THIS STAGE SCORES (a2) ONLY. H-DF.1(a) as a whole (= (a1) AND (a2)) and '
    + 'H-DF.1(b) are DF-T3 §R0\'s verdicts and are not re-adjudicated here; (a1) below is a '
    + 'COMPANION RE-READ, reported, never scored.',
};

const bodyCore = {
  stage: 'DF-T3B-POWER-EXTENSION',
  kind: 'power extension (H-DF.1(a2) RE-RUN VERBATIM on a larger virgin battery; nothing '
    + 'else scored, nothing re-cut)',
  ruling: '#334 item 5 (ratifying DF-T3 §COMMANDER CORRECTIONS item 1)',
  contract: 'DF-DEFENSIVE-BRAIN-CONTRACT.md §1 H-DF.1 + §2 M-DF.1/M-DF.2/M-DF.3',
  parentStage: 'DF-T3-SURFACE-EXAM.md (§P1 the frozen rule · §P2 the frozen CI rules · '
    + '§R0 the prior draw · §CORR item 1 the power disposition · §CORR item 2 the ordered pin)',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  instrument: {
    file: 'scripts/probes/df-t3b-power-extension.ts',
    sha256: instrumentSha,
    thinBy: 'ONLY the H-DF.1(a2) machinery is reproduced from DF-T3\'s frozen form: the '
      + 'tercile cuts, the within-arm seed-clustered bootstrap idiom, the per-seed cells and '
      + 'the walk-side predicate fixtures.',
    reproducedFrom: 'scripts/probes/df-t3-surface-exam.ts §9 (the within-arm differentiation '
      + 'block: bodiesOf / tercilesOf / tercileShare / a2Interval / strictlyMonotone / '
      + 'disjoint / intervalOf / the withinIndex resampler) and §3\'s usage-ledger read at '
      + 'the whistle with the gid→attrs.defending join — THE JOIN LIVES IN THE INSTRUMENT, '
      + 'never in src.',
    namedOut: [
      '⛔ NO SEASON LADDER (DF-T3 §R3 owns it; a power re-run buys clusters, not estimands)',
      '⛔ NO between-arm football faces (churn/coverage, R-乙, §2 equilibrium, multiChase, '
      + 'the swarm/chaser bins) — banked at DF-T3 and not re-asked',
      '⛔ NO press-realisation walker — so the contain-offer predicate this stage\'s COMMIT 1 '
      + 'pinned is NOT scored here; its line receipt rides as the rider\'s source receipt',
      '⛔ NO H-DF.1(b) conjuncts — banked PASS on all three at DF-T3 §R0',
      '⛔ NO DOSING (both arms are flag worlds; #334 item 3\'s match-local-copy dose idiom '
      + 'is N/A, stated as N/A)',
      '⛔ THE CAP-OFF ARM stays HELD (M-DF.2; DF-T3 §CORR item 1)',
    ],
  },
  definitions: {
    tercileCut: 'the ARMED arm\'s bodies sorted ASCENDING by attrs.defending and sliced at '
      + 'floor(t·n/3) — three contiguous slices that partition n, remainder to the TOP '
      + 'tercile. THE CUT IS RECOMPUTED INSIDE EVERY BOOTSTRAP DRAW from the resampled '
      + 'bodies (DF-T3 §P2), so the cut is inside the interval, not outside it.',
    tercileShare: 'of the DECISIONS the bodies in a tercile took, the share that were the '
      + 'named option — numerator counts[opt], denominator Σ counts over all four options.',
    bodyRow: 'one row per (seed, gid) with the body\'s attrs.defending and its four option '
      + 'counts, read off the shipped ledger\'s byGid map at the whistle.',
    modeSlot: 'src\'s OWN slot (anchored): team.mode === \'Press\' ? 1 : 0, and the ledger '
      + 'index is modeSlot × |DF_SURFACE_OPTIONS| + opt.',
    outcomeDigest: '⭐ AN ARMING RECEIPT, NOT A FOOTBALL FACE (canon, home ruling #289 item '
      + '1): sha256 over the walk\'s score/stats/event-count/tick-count, used ONLY by '
      + 'gArmsDistinguishable. No football quantity is derived from it and no CI is '
      + 'attached to it.',
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
    dosing: '⛔ NONE. Both arms are FLAG worlds; nothing is written to any genome view, so '
      + '#334 item 3\'s match-local-copy dose idiom and its info.genome-cleanliness conjunct '
      + 'are N/A — stated, not silently omitted.',
    ladder: '⛔ NOT RUN by this stage.',
    capOffArm: '⛔ NOT RUN — M-DF.2\'s own order, HELD until (a) resolves.',
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    subRanges: {
      battery: `${BLOCK_BASE}–${BLOCK_BASE + N_SEEDS - 1} (${N_SEEDS} paired virgin seeds)`,
      smokePrefix: `${BLOCK_BASE + 800}–${BLOCK_BASE + 802} (in band)`,
      receipt: `${RECEIPT_SEED} (the xxx,999 world-construction receipt — WALKED)`,
      ladderLeagues: 'NONE — this stage runs no ladder',
    },
    booked: SEEDS,
    walked: seedsWalked,
    bookedEqualsWalked: seedsWalked.length === SEEDS.length
      && SEEDS.every((s) => seedsWalked.includes(s)),
    walksTotal: rows.length,
    seedsVsDfT3: `DF-T3 walked 41 paired seeds (12,515,000–039 + 999); this stage walks `
      + `${SEEDS.length} VIRGIN paired seeds — the power ratio is `
      + `${round(SEEDS.length / 41, 6)}× the clusters.`,
    blockConsumedWhole: `${BLOCK_BASE}–${BLOCK_BASE + 999} CONSUMED WHOLE of record`,
    nextSimBlock: 12_519_000,
  },
  stats: {
    basesConsumed: STATS_BASES_CONSUMED,
    step: STATS_STEP,
    registryEntries: STATS_PUBLISHED_BASES.length,
    registryComplete: REGISTRY_COMPLETE,
    registryCompletionMethod: 'the registry of record ENTERING this stage is 67 (ruling #333 '
      + 'item 4): IN-C0\'s completed 56 + 114,200 + 114,400 + 114,600 + 114,800 + 115,000 + '
      + '115,200 + 115,400 + 115,600 + 115,800 + 116,000 + 116,200. BK-T3 consumed ZERO '
      + '(#334 item 4). THIS STAGE CONSUMES EXACTLY ONE base, so the registry leaves at 68.',
    minGapToAnyPublishedBase: minStatsGap,
    nextBase: STATS_BASE + STATS_STEP,
    draw1: `${STATS_BASE} — the WITHIN-ARM seed-clustered bootstrap that carries (a2) (and `
      + 'the (a1) companion re-read, which shares the SAME resample index by construction, '
      + 'exactly as DF-T3\'s single within-arm draw did)',
    bootstrapDraws: BOOTSTRAP,
  },
  anchoredExtractions: anchorReceipts,
  walkSidePredicatePins: predicatePins,
  hdf1a2,
  a1Companion: {
    reported: true,
    scored: false,
    note: '⭐ REPORTED, NEVER SCORED HERE. DF-T3 §R0 banked (a1) ✅ at |Δ|÷hw 3.19307 and '
      + 'that remains THE VERDICT OF RECORD. This is a second, independent draw of the same '
      + 'face on virgin seeds, published because the mode-slot predicate is pinned anyway and '
      + 'the read costs nothing.',
    rule: 'byModeOptionShareDefend[press] vs byModeOptionSharePress[press], each with its own '
      + 'seed-clustered bootstrap interval, DISJOINT',
    defend: a1Defend,
    press: a1Press,
    disjoint: a1Disjoint,
    absoluteGap: round(Math.abs(a1Defend.value - a1Press.value)),
    gapOverLargerHalfWidth: round(Math.abs(a1Defend.value - a1Press.value)
      / Math.max(a1Defend.halfWidth, a1Press.halfWidth), 6),
    denNote: 'each mode\'s denominator is Σ that mode\'s four option counts — a MOVING '
      + 'denominator (how much of the battery each team mode occupies), disclosed per canon.',
  },
  usage,
  wall: { batterySeconds: batteryWallSec },
  perSeedCells: rows,
  fingerprint: { ofRecord: FINGERPRINT_OF_RECORD, recomputed: fingerprintNow },
  srcTouched: {
    note: 'INSTRUMENT-ONLY after commit 1: src must be UNTOUCHED (commit 1 is TESTS ONLY — '
      + 'zero src bytes — and landed BEFORE this instrument froze)',
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
  const dArmed = dRows.filter((r) => r.arm === 'armed');
  const dShut = dRows.filter((r) => r.arm === 'shut');
  /* ---- the usage block ---- */
  const bo = Array.from({ length: N_OPT }, (_, i) => sum(dArmed.map((r) => r.byOption[i])));
  const bmo = Array.from({ length: 2 * N_OPT }, (_, i) => sum(dArmed.map((r) => r.byModeOption[i])));
  checks += 6;
  if (JSON.stringify(bo) !== JSON.stringify(onDisk.usage.byOption)) mismatches.push('usage/byOption');
  if (JSON.stringify(shareOf(bo)) !== JSON.stringify(onDisk.usage.byOptionShare)) mismatches.push('usage/byOptionShare');
  if (JSON.stringify(bmo) !== JSON.stringify(onDisk.usage.byModeOption)) mismatches.push('usage/byModeOption');
  if (sum(dArmed.map((r) => r.elections)) !== onDisk.usage.electionsArmed) mismatches.push('usage/elections');
  if (sum(dArmed.map((r) => r.idle)) !== onDisk.usage.idleArmed) mismatches.push('usage/idle');
  if (sum(dArmed.map((r) => r.pressOffered)) !== onDisk.usage.pressOfferedArmed) {
    mismatches.push('usage/pressOffered');
  }
  checks += 3;
  if (JSON.stringify(shareOf(bmo.slice(0, N_OPT)))
    !== JSON.stringify(onDisk.usage.byModeOptionShareDefend)) mismatches.push('usage/modeShareDefend');
  if (JSON.stringify(shareOf(bmo.slice(N_OPT)))
    !== JSON.stringify(onDisk.usage.byModeOptionSharePress)) mismatches.push('usage/modeSharePress');
  if (sum(dArmed.map((r) => r.pressDeclinedByBook)) !== onDisk.usage.pressDeclinedByBookArmed) {
    mismatches.push('usage/pressDeclinedByBook');
  }
  /* ---- the TERCILE TABLE, re-cut off disk from the stored body rows ---- */
  const ts = tercilesOf(bodiesOf(dArmed));
  checks += 1;
  if (JSON.stringify(ts) !== JSON.stringify(onDisk.usage.byDefendingAttrTercile)) {
    mismatches.push('usage/byDefendingAttrTercile');
  }
  /* ---- ⭐⭐ (a2): the six point estimates, both monotone booleans, both disjointness
   *      booleans, both limb passes, the conjunct pass and the VERDICT STRING ---- */
  for (const [opt, pub] of [[OPT_PRESS, onDisk.hdf1a2.press], [OPT_TAKE, onDisk.hdf1a2.take]] as const) {
    const pts = [0, 1, 2].map((t) => round(tercileShare(ts, t, opt as number)));
    checks += 6;
    if (JSON.stringify(pts) !== JSON.stringify(pub.pointEstimates)) mismatches.push(`a2/${pub.option}/points`);
    if (strictlyMonotone(pts) !== pub.monotone) mismatches.push(`a2/${pub.option}/monotone`);
    if (disjoint(pub.bottom, pub.top) !== pub.disjoint) mismatches.push(`a2/${pub.option}/disjoint`);
    if ((pub.monotone && pub.disjoint) !== pub.pass) mismatches.push(`a2/${pub.option}/pass`);
    if (!same(round(Math.min(pub.bottom.ciHi, pub.top.ciHi)
      - Math.max(pub.bottom.ciLo, pub.top.ciLo)), pub.overlapMetres)) {
      mismatches.push(`a2/${pub.option}/overlap`);
    }
    if (JSON.stringify([0, 1, 2].map((t) => sum(ts[t].counts))) !== JSON.stringify(pub.denominators)) {
      mismatches.push(`a2/${pub.option}/denominators`);
    }
    checks += 1;
    if (!same(round(Math.abs(pub.top.value - pub.bottom.value)
      / Math.max(pub.bottom.halfWidth, pub.top.halfWidth), 6), pub.gapOverLargerHalfWidth)) {
      mismatches.push(`a2/${pub.option}/gapOverLargerHalfWidth`);
    }
  }
  checks += 2;
  const rA2 = onDisk.hdf1a2.press.pass && onDisk.hdf1a2.take.pass;
  if (rA2 !== onDisk.hdf1a2.pass) mismatches.push('a2/pass');
  const expectVerdict = rA2 ? 'PASS' : onDisk.hdf1a2.press.pass ? 'FAIL — TAKE'
    : onDisk.hdf1a2.take.pass ? 'FAIL — PRESS' : 'FAIL — PRESS and TAKE';
  if (expectVerdict !== onDisk.hdf1a2.verdict) mismatches.push('a2/verdict');
  /* ---- the (a1) COMPANION, off disk ---- */
  checks += 4;
  if (!same(round(modePressShare(dArmed, 'Defend')), onDisk.a1Companion.defend.value)) {
    mismatches.push('a1/defend/value');
  }
  if (!same(round(modePressShare(dArmed, 'Press')), onDisk.a1Companion.press.value)) {
    mismatches.push('a1/press/value');
  }
  if (disjoint(onDisk.a1Companion.defend, onDisk.a1Companion.press) !== onDisk.a1Companion.disjoint) {
    mismatches.push('a1/disjoint');
  }
  if (!same(round(Math.abs(onDisk.a1Companion.defend.value - onDisk.a1Companion.press.value)),
    onDisk.a1Companion.absoluteGap)) mismatches.push('a1/gap');
  checks += 1;
  if (!same(round(Math.abs(onDisk.a1Companion.defend.value - onDisk.a1Companion.press.value)
    / Math.max(onDisk.a1Companion.defend.halfWidth, onDisk.a1Companion.press.halfWidth), 6),
  onDisk.a1Companion.gapOverLargerHalfWidth)) mismatches.push('a1/gapOverLargerHalfWidth');
  /* ---- the BODY-MODAL CAUTION census, off disk ---- */
  const bm = bodyModalCensusOf(dArmed);
  checks += 3;
  if (bm.bodiesCounted !== onDisk.usage.bodiesCounted) mismatches.push('usage/bodiesCounted');
  if (JSON.stringify(bm.counts) !== JSON.stringify(onDisk.usage.bodyModalCounts)) {
    mismatches.push('usage/bodyModalCounts');
  }
  if (JSON.stringify(shareOf(bm.counts)) !== JSON.stringify(onDisk.usage.bodyModalShare)) {
    mismatches.push('usage/bodyModalShare');
  }
  /* ---- DORMANCY and the ARMING RECEIPT, off disk ---- */
  checks += 2;
  if (!dShut.every((r) => r.elections === 0 && r.bodyRows.length === 0)) {
    mismatches.push('dormancy/shutLedgerNonEmptyOnDisk');
  }
  const dSeeds = [...new Set(dRows.map((r) => r.seed))].sort((a, b) => a - b);
  if (!dSeeds.every((s) => dRows.find((r) => r.seed === s && r.arm === 'shut')!.outcomeDigest
    !== dRows.find((r) => r.seed === s && r.arm === 'armed')!.outcomeDigest)) {
    mismatches.push('armsDistinguishable/onDisk');
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
/** ⭐ RED ROUTING (#334 item 3, REQUIRED): a RED run never touches the canonical path. */
const outPath = ALL_GREEN || IS_OVERRIDE ? OUT : `${OUT.replace(/\.json$/, '')}.RED.json`;
const tmp = `${outPath}.tmp`;
writeFileSync(tmp, `${JSON.stringify(artifact, null, 2)}\n`);
renameSync(tmp, outPath);

banner(`\nwrote ${outPath}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : 'RED  '}  ${k}`);
banner(`\nH-DF.1(a2) = ${hdf1a2.verdict}`);
for (const l of [a2Press, a2Take]) {
  banner(`  ${l.option}: pts ${JSON.stringify(l.pointEstimates)} mono=${l.monotone}`
    + ` disjoint=${l.disjoint} bottom [${l.bottom.ciLo}, ${l.bottom.ciHi}]`
    + ` top [${l.top.ciLo}, ${l.top.ciHi}] overlap=${l.overlapMetres}`
    + ` gap/hw=${l.gapOverLargerHalfWidth}`);
}
banner(`  (a1) companion: defend ${a1Defend.value} [${a1Defend.ciLo}, ${a1Defend.ciHi}]`
  + ` vs press ${a1Press.value} [${a1Press.ciLo}, ${a1Press.ciHi}] disjoint=${a1Disjoint}`);
banner(`bodyModalCounts = [${bodyModal.counts.join(', ')}] over ${bodyModal.bodiesCounted} bodies`);
banner(`walk-side predicate pins: ${predicatePins.length}, all pass=${PREDICATE_PINS_OK}`);
banner(`re-derivation: ${checks} checks, ${mismatches.length} mismatches`);
process.exit(ALL_GREEN ? 0 : 1);
