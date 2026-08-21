#!/usr/bin/env tsx
/**
 * ============================================================================
 * DF-T4 — THE CAP-OFF TRIAL (H-DF.4 scored on virgin paired seeds)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #336 item 5, bound by
 * `docs/world-model/DF-DEFENSIVE-BRAIN-CONTRACT.md` §1 (H-DF.1 / H-DF.2) and §2
 * M-DF.2 — *"the census (DF-C0) freezes the swarm's own face (the pile-up band
 * the cap holds today); the surface slice arms dormant beside the cap; the exam
 * proves H-DF.1(b) INSIDE the cap first, then the cap-off arm proves the surface
 * alone holds the band"* — plus M-DF.4's ecological gate (*"EVERY DF exam
 * reports the season ladder beside match-grain faces"*).
 *
 * THE ARMS (frozen at dispatch, #336 item 5) — BOTH carry the H-DF.1-PASSING
 * STACK (world 9 + bkFacingLaw + bkContactLaw + dfAssignPersist + dfSurface):
 *   capOn  = the shipped Phase-31 cap (`dfCapOff` OFF)
 *   capOff = the cap's rule retired IN THE ARM ONLY (`dfCapOff` ON — DF-T4
 *            commit 1's purely ADDITIVE, flag-gated bypass; the shipped cap
 *            code is untouched and byte-identical with the flag off)
 * `dfCapOff` is the ONLY difference between the arms.
 *
 * ⭐ INSTRUMENT-ONLY AT THIS COMMIT. The seam landed in DF-T4 commit 1, BEFORE
 * this file was frozen; `gSrcUntouched` proves the worktree matches HEAD.
 *
 * ⭐⭐ THE SCORED CLAIM — PRE-REGISTERED, FROZEN BEFORE THE BATTERY, NEVER
 * RE-CUT AFTER SIGHT (the forms are argued in the stage doc §P, and §P is
 * committed in the SAME commit as this file):
 *
 *   H-DF.4 — THE SURFACE ALONE HOLDS THE BAND. Three conjuncts:
 *     (i)   THE FOUR-CHASER BIN, cap-off, IS EXACTLY ZERO.
 *           ⭐ THE FORM IS CHOSEN AND ARGUED (dispatch: "pick ONE form at §P
 *           from the parents' own definitions, argue it there, never after"):
 *           EXACTLY ZERO, because it is the ONLY form the parents define for
 *           this bin. DF-C0 §R2 VERBATIM: *"the bin for four is EXACTLY ZERO,
 *           so the cap does bind"* — a STRUCTURAL receipt, published as a count
 *           with no interval; DF-T2 §R6 and DF-T3 §R4 both re-published it as
 *           EXACTLY ZERO in both of their arms. No parent froze an interval for
 *           this bin, so a nonzero band would have to be INVENTED here, which is
 *           exactly what the frozen-rule discipline forbids. ⚠ Consequence,
 *           stated BEFORE the run: DF-T4 commit 1's own fixture proves a FOURTH
 *           chaser is reachable when the cap is off, so a single tick of the
 *           picture turns this conjunct RED. THAT IS ACCEPTED: a red gate stays
 *           red and is reported, and the tail MAGNITUDE (the bin's share, and
 *           the ≥3 share's paired delta) is published beside it as REPORTED
 *           companions so the ruling can price the red without re-cutting it.
 *     (ii)  multiChaseShare2 AND multiChaseShare3, cap-off, STAY INSIDE THE
 *           CAP-ON ARM's OWN 95 % INTERVALS. Form, verbatim from the dispatch:
 *           each face's cap-off POINT ESTIMATE must lie within [ciLo, ciHi] of
 *           the CAP-ON arm's own seed-clustered bootstrap interval. This is
 *           DF-C0 §R2's band idiom ("the swarm the cap holds today, measured,
 *           with its denominators stated") applied to THIS battery's own capped
 *           arm rather than to the census's numbers, so the two sides share
 *           every walk, every seed and every denominator.
 *     (iii) THE CHURN / COVERAGE FACES DO NOT DEGRADE RESOLVEDLY cap-off:
 *           markSwitchesPerDefenderMinute (degrade = UP) ·
 *           markHeldShare (degrade = DOWN) · dupMarkShare (degrade = UP).
 *           NON-INFERIORITY: each fails only on a RESOLVED move in its OWN
 *           frozen bad direction (the paired interval excluding zero on that
 *           side). The three faces and their three directions are DF-C0 §R2's
 *           own 乱跑 faces and DF-T1's own frozen direction convention.
 *
 * ⭐ THE ORDERED FIRST LOOK (#336 item 5, "the ordered first look"): DF-T3 §R4's
 * HONEST SPLINTER — the ≥5-body STANCE bin (five or more bodies inside the
 * shipped 2.6 m stance radius) — re-measured in BOTH arms from STORED BINS,
 * with BOTH prior readings quoted verbatim:
 *   · DF-T3 §R4: `swarmBins.armedStance` = [130299, 60720, 16289, 2697, 159, 26]
 *     vs `swarmBins.shutStance` = [120305, 66645, 14806, 2280, 165, 0] — 26
 *     armed against 0 shut, "26 of 210,190 armed carrier-present defending
 *     team-ticks (0.0124 %)".
 *   · DF-T2 §R6: `swarmBins.armedStance` = [111776, 68278, 13721, 1799, 133, 0]
 *     vs `swarmBins.shutStance` = [123293, 62895, 14170, 2035, 260, 77] — the
 *     SIGN THE OTHER WAY (77 shut against 0 armed).
 * REPORTED, never gated (it is not one of H-DF.4's conjuncts).
 *
 * REPORTED, NEVER GATED: the press ELECTION + REALISATION faces by arm · the
 * chaser-count distribution by arm (FULL BINS) · interceptions / tackles at
 * MATCH grain · goals at MATCH grain · the swarm stance/zone shares · ⭐ THE
 * SEASON LADDER (M-DF.4's ecological gate, both arms, goals × generation).
 *
 * ⭐ THE FROZEN CI RULES (pre-registered; NEVER re-cut after sight):
 *   · PER-SEED CELLS are stored so every headline re-derives (canon, home
 *     ruling #282.2(ii)).
 *   · BETWEEN-ARM faces use the PAIRED DELTA (capOff − capOn) with a
 *     SEED-CLUSTERED PAIRED bootstrap: resample the walked seeds with
 *     replacement, compute BOTH arms' ratios over the SAME resampled seed set
 *     in every draw, then the delta. RESOLVED iff the interval EXCLUDES ZERO.
 *   · THE (ii) CONJUNCT is a WITHIN-ARM containment test: the CAP-ON arm's own
 *     seed-clustered (unpaired) 95 % interval, and the cap-off POINT ESTIMATE
 *     must lie inside it.
 *   · 2,000 resamples everywhere; 95 % percentile intervals; every bootstrap
 *     rng is seeded from its own published STATS BASE (block base discipline).
 *   · Canon VERBATIM: "a starred finding states its |Δ|÷half-width ratio"
 *     (home BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2).
 *   · Canon (paraphrase): moving denominators disclosed per face (home PW-C0
 *     §CORR item 2) — every face publishes its own `denNote`.
 *   · Canon (paraphrase): clock honesty — every rate on the 240 s match clock
 *     or dual-axis; APPLIED values, never nominal.
 *
 * ⭐ CANON HONOURED (sentences COPIED from docs/world-model/CANON.md, #301):
 *   · freeze-before-battery (home ruling #266.3(c)).
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not
 *     in the schema never enters the body; forbidden-name lists are retired"
 *     (home PC-T0 §CORR item 1).
 *   · per-seed cells (home ruling #282.2(ii)).
 *   · "the re-derivation gate covers EVERY published face; a percentile face
 *     requires stored bins" (home PC-C0 §CORR item 4).
 *   · "a scored face's walk-side predicate is pinned — anchored extraction or
 *     fixture — because the re-derivation gate proves arithmetic, not
 *     definitions" (home DF-T3 §CORR item 2), REFINED at #334 item 2: "anchored
 *     extraction protects the source line; a headline-bearing walk-side
 *     predicate ALSO needs a composition fixture" (home BK-T3 §CORR item 2) —
 *     ⭐ §3B below is a COMPOSITION FIXTURE PER WALK-SIDE PREDICATE, calling the
 *     SAME functions the battery calls.
 *   · "a field carries the unit its name claims" (home ruling #294 item 3).
 *   · "a src-extracted constant pins its extraction to the NAMED call site —
 *     anchored match + line receipt — never first-occurrence" (home BK-C0
 *     §CORR item 1).
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes
 *     a gated face" (home PC-T2 §CORR item 4).
 *   · "a max−min face reports a noise-floor comparison, not a zero-null CI"
 *     (home PC-T1 §CORR item 3) — no max−min face is published here.
 *   · "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits
 *     matchFlags; true since #155, stated now, test-pinned; refines #270's E4
 *     correction; matches the perf diagnostic)" (home ruling #283.2(iv)).
 *   · seed discipline: BOOKED = WALKED; blocks consumed whole; stats step ≥ 200.
 *   · DF-C0 §CORR item 2 (ruling #321): the body is hashed LAST, after EVERY
 *     gate is written — including `gFacesFromDisk`, which re-parses a STAGING
 *     file off disk.
 *   · BOOKED = WALKED is gated against the per-seed CELLS' own distinct-seed
 *     set, never a projection of the input (#335 item 4's correction).
 *   · RED runs write a side path; the canonical path is only reached all-green
 *     (the red-routing idiom, #334 item 3).
 *   · The dose/`info.genome` idiom is N/A — there is NO dosing here; both arms
 *     are shut/armed FLAG worlds and no gene is written anywhere.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: DFT4_MODE (smoke|full, REQUIRED) · DFT4_N · DFT4_GENS · DFT4_OUT.
 *   ANY other `DFT4_*` var is a FATAL refusal, and so is ANY engine env door.
 *   An override run (smoke / N / GENS / OUT) may NOT write the canonical path.
 *
 * RUN: DFT4_MODE=full npx tsx scripts/probes/df-t4-cap-off-trial.ts
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
const ENV_WHITELIST = ['DFT4_MODE', 'DFT4_N', 'DFT4_GENS', 'DFT4_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE_ARMED', 'A4_WORLD', 'EVO_', 'SIM_'];
for (const k of Object.keys(process.env)) {
  if (k.startsWith('DFT4_') && !(ENV_WHITELIST as readonly string[]).includes(k)) {
    console.error(`ENV REFUSAL: ${k} is not on the whitelist`);
    process.exit(2);
  }
  if (ENGINE_DOORS.some((d) => k === d || k.startsWith(d))) {
    console.error(`ENV REFUSAL: engine door ${k} is set`);
    process.exit(2);
  }
}
type Mode = 'smoke' | 'full';
const MODE = process.env.DFT4_MODE as Mode | undefined;
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('ENV REFUSAL: DFT4_MODE must be smoke|full');
  process.exit(2);
}
const N_ENV = process.env.DFT4_N === undefined ? null : Number(process.env.DFT4_N);
const GENS_ENV = process.env.DFT4_GENS === undefined ? null : Number(process.env.DFT4_GENS);
const OUT_OVERRIDE = process.env.DFT4_OUT ?? null;
const CANONICAL_OUT = 'docs/world-model/data/df-t4-cap-off-trial.json';
const OUT = OUT_OVERRIDE ?? CANONICAL_OUT;
const IS_OVERRIDE = OUT_OVERRIDE !== null || MODE !== 'full' || N_ENV !== null || GENS_ENV !== null;
if (IS_OVERRIDE && OUT === CANONICAL_OUT) {
  console.error('REFUSAL: an override run (smoke / N / GENS / OUT) may not write the canonical path');
  process.exit(2);
}

/* ========================================================================== */
/* §1 SEEDS — BOOKED = WALKED, the block consumed whole                       */
/* ========================================================================== */
/** DF-T4's OWN booked block (ruling #336 item 5): 12,521,000–999. */
const BLOCK_BASE = 12_521_000;
const RECEIPT_SEED = BLOCK_BASE + 999;
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 40 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
/**
 * THE SUB-RANGES, DECLARED BEFORE THE RUN (BOOKED = WALKED reported after):
 *   12,521,000 – 12,521,039  the trial battery (40 paired seeds)
 *   12,521,800 – 12,521,802  the in-band smoke prefix (also the pin suite's seeds)
 *   12,521,900 – 12,521,903  the season ladder's four league seeds (the SAME four
 *                            leagues in BOTH arms — the paired design)
 *   12,521,999               the xxx,999 world-construction receipt seed (walked)
 * THE BLOCK 12,521,000–999 IS CONSUMED WHOLE OF RECORD either way.
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
 * re-typed literal. The first four are DF-C0 §R2 / DF-T1 §R6 / DF-T3 §R7's, inherited
 * verbatim; the last two are the shipped Phase-29.1 contain branch's (the executable form of
 * PRESS, and the geometry the REALISATION instrument reads).
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
  const hitLines = lines.map((l, i) => (l === a.line ? i + 1 : 0)).filter((n) => n > 0);
  const m = a.re.exec(a.line);
  return {
    id: a.id, file: a.file, line: a.line, matches: hitLines.length, lineNumbers: hitLines,
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

/* ---- THE CAP SLICE: DF-T2's sha discipline, SUPERSEDED — the explicit pins ---- */
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }); } catch { return 'GIT-FAILED'; }
};
/**
 * ⚠⚠ DF-T2 §R6's cap-slice sha of record
 * `5b4a21d036e9d97027a360f166621d747374ec5c42ead20b9ed132919872703c` MOVED BY CONSTRUCTION at
 * DF-T4 commit 1 — the bypass lives INSIDE the sliced function. Ruling #336 item 5 replaced
 * that discipline with an EXPLICIT PIN: with the flag OFF the four-chaser bin is exactly zero
 * as ever (tests/dfCapOff.test.ts owns that pin, and this probe re-measures it in the CAP-ON
 * arm as gate `gCapOnBinFourZero`). What the probe still hashes is the slice AT THIS COMMIT,
 * before AND after the battery, as a CHANGE DETECTOR — plus the shipped cap's own statements
 * by verbatim occurrence count, which is the thing "never deleted or reworded" actually means.
 */
const CAP_SHA_DF_T2_HISTORICAL = '5b4a21d036e9d97027a360f166621d747374ec5c42ead20b9ed132919872703c';
const capSlice = (source: string): string => source.slice(
  source.indexOf('function assignChasers(team: Team, match: Match): void {'),
  source.indexOf('/**\n * Marks: each non-chasing outfielder'),
);
const SHIPPED_CAP_LINES: readonly string[] = [
  '  let count = 1;',
  "    if (team.mode === 'Press' || team.genome.pressIntensity > 0.78) count += 1;",
  '    if (possession === -1) count = Math.min(count, 1);',
  '        if (tp > 0.3) count = Math.min(count + 1, 3);',
  '        else if (tp < -0.3) count = Math.min(count, 1);',
  "  if (match.phase === 'restart') count = match.restart?.kind === 'goalKick' ? 0 : 1;",
  '  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);',
];
const BYPASS_LINES: readonly string[] = [
  "    if (match.dfCapOff && team.mode === 'Press' && team.genome.pressIntensity > 0.78) count += 1;",
  '        const beforeWindow = count;',
  '        if (match.dfCapOff && tp > 0.3) count = beforeWindow + 1;',
];
const lineHitsIn = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const capShaNow = (): string =>
  createHash('sha256').update(capSlice(readSrc('src/ai/TeamBrain.ts'))).digest('hex');
const capShaBefore = capShaNow();
const shippedCapLineCounts = SHIPPED_CAP_LINES.map((l) => ({
  line: l, occurrences: lineHitsIn(capSlice(readSrc('src/ai/TeamBrain.ts')), l),
}));
const bypassLineCounts = BYPASS_LINES.map((l) => ({
  line: l, occurrences: lineHitsIn(capSlice(readSrc('src/ai/TeamBrain.ts')), l),
}));

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
 * ⭐ THE ARMS (frozen at dispatch, #336 item 5):
 *   capOn  = the world-9 stack + dfAssignPersist + dfSurface — the H-DF.1-PASSING world;
 *   capOff = the same + dfCapOff.
 * `dfCapOff` is the ONLY difference.
 */
const buildMatch = (seed: number, capOff: boolean): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(DF_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
    dfAssignPersist: true,
    dfSurface: true,
    ...(capOff ? { dfCapOff: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, DF_WORLD, L3_DOSE, PC_DOSE);
  return m;
};

/* ========================================================================== */
/* §3 THE INSTRUMENT — DF-C0 §R2's definitions verbatim (via DF-T0/T1/T3)     */
/* ========================================================================== */
const DUP_RUN_M = 4;
const N_OPT = DF_SURFACE_OPTIONS.length;
type Family = 'ONBALL' | 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'OTHER';
/** ⭐ WALK-SIDE PREDICATE 1 — the BALL family (the multiChase numerator's own classifier) */
const familyOfAction = (isOwner: boolean, actionType: string): Family => {
  if (isOwner) return 'ONBALL';
  switch (actionType) {
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
const familyOf = (p: Player, m: Match): Family =>
  familyOfAction(m.ball.owner === p, p.action.type);
const LAT_BINS = 8;
const LAT_BIN_S = 0.5;
const latBinOf = (s: number): number => Math.min(LAT_BINS - 1, Math.floor(s / LAT_BIN_S));
const SWARM_BINS = 6;
/** ⭐ WALK-SIDE PREDICATE 2 — the swarm bin (the ≥5-body stance splinter's own classifier) */
const swarmBinOf = (bodiesInside: number): number => Math.min(SWARM_BINS - 1, bodiesInside);
/** ⭐ WALK-SIDE PREDICATE 3 — the chaser-count bin (H-DF.4(i)'s own classifier) */
const CHASER_BINS = 5;
const chaserBinOf = (chasers: number): number => Math.min(CHASER_BINS - 1, chasers);
/** ⭐ WALK-SIDE PREDICATE 4 — the mark transition (DF-C0 §R2's switch/abandon/start) */
type MarkTransition = 'switch' | 'abandon' | 'start' | 'none';
const markTransitionOf = (prev: number | null, cur: number | null): MarkTransition => {
  if (prev !== null && cur !== null && prev !== cur) return 'switch';
  if (prev !== null && cur === null) return 'abandon';
  if (prev === null && cur !== null) return 'start';
  return 'none';
};
/** ⭐ WALK-SIDE PREDICATE 5 — the contain OFFER geometry (the shipped branch's three terms) */
const containOffered = (o: {
  holdsMark: boolean; isChaser: boolean; carrierIsOpp: boolean;
  dCarrier: number; carrierGoalD: number; dOwnGoal: number;
}): boolean => !o.holdsMark && !o.isChaser && o.carrierIsOpp
  && o.dCarrier < CONTAIN_RADIUS_M
  && o.carrierGoalD < CONTAIN_TERRITORY_M
  && o.dOwnGoal < o.carrierGoalD;
/** ⭐ WALK-SIDE PREDICATE 6 — the contain ACT (the brain's realised argmax) */
const containActed = (o: {
  carrierIsOpp: boolean; actionType: string; targetIdx: number | undefined;
  carrierIndex: number; why: string;
}): boolean => o.carrierIsOpp && o.actionType === 'MarkOpponent'
  && o.targetIdx === o.carrierIndex && o.why.startsWith(CONTAIN_WHY_PREFIX);

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

type ArmName = 'capOn' | 'capOff';
interface Row {
  arm: ArmName;
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
  /* the press REALISATION walker (DF-T3 §R2's, inherited verbatim) */
  containOfferTicks: number;
  containActTicks: number;
  containEpisodes: number;
  /* the R-乙 chain accumulators (definitions VERBATIM from R-YI via BK-T2 / DF-T3) */
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
  tackles: number;
  interceptions: number;
  /* DF-T2 §THE USAGE LEDGER, read off the match at the whistle (ARMED IN BOTH ARMS) */
  elections: number;
  idle: number;
  pressOffered: number;
  pressDeclinedByBook: number;
  byOption: number[];
  byModeOption: number[];
  stepWallMs: number;
}

const worldConjuncts = (m: Match, capOff: boolean): Record<string, boolean> => {
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
    /** ⭐ THE H-DF.1-PASSING STACK IS THE FLOOR OF BOTH ARMS */
    persistenceArmedBothArms: m.dfAssignPersist === true,
    surfaceArmedBothArms: m.dfSurface === true,
    /** THE ONLY ARM DIFFERENCE */
    capDoorMatchesArm: m.dfCapOff === capOff,
  };
};

const walk = (seed: number, capOff: boolean): Row => {
  const m = buildMatch(seed, capOff);
  const wOk = Object.values(worldConjuncts(m, capOff)).every(Boolean);
  const row: Row = {
    arm: capOff ? 'capOff' : 'capOn',
    seed, worldOk: wOk, ticks: 0, playingTicks: 0, defTeamTicks: 0, defenderTicks: 0,
    markSwitches: 0, markAbandons: 0, markStarts: 0, chaseStarts: 0, chaseAbandons: 0,
    markHeldTicks: 0,
    reTargetLatencyBins: Array.from({ length: LAT_BINS }, () => 0),
    reTargetLatencyCount: 0, reTargetLatencyTickSum: 0,
    markPairTicks: 0, dupMarkTicks: 0, multiChase2Ticks: 0, multiChase3Ticks: 0,
    carrierTicks: 0,
    swarmStanceBins: Array.from({ length: SWARM_BINS }, () => 0),
    swarmZoneBins: Array.from({ length: SWARM_BINS }, () => 0),
    chaserCountBins: Array.from({ length: CHASER_BINS }, () => 0),
    containOfferTicks: 0, containActTicks: 0, containEpisodes: 0,
    openSpells: 0, openSpellTickSum: 0, openSpellTouchSum: 0,
    openFirstReceptions: 0, openFirstReceptionsPressed: 0,
    enginePasses: 0, enginePassesCompleted: 0, enginePassesForward: 0,
    goals: 0, shots: 0, tackles: 0, interceptions: 0,
    elections: 0, idle: 0, pressOffered: 0, pressDeclinedByBook: 0,
    byOption: Array.from({ length: N_OPT }, () => 0),
    byModeOption: Array.from({ length: 2 * N_OPT }, () => 0),
    stepWallMs: 0,
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
      row.chaserCountBins[chaserBinOf(t.chasers.size)] += 1;
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
        const trans = markTransitionOf(prev, cur2);
        if (trans === 'switch') {
          row.markSwitches += 1;
          if (lostAt.has(k)) lostAt.delete(k);
        } else if (trans === 'abandon') {
          row.markAbandons += 1;
          lostAt.set(k, tick);
        } else if (trans === 'start') {
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
        /* ====== THE PRESS REALISATION WALKER (DF-T3 §R2's, inherited verbatim) ====== */
        const offered = containOffered({
          holdsMark: cur2 !== null, isChaser, carrierIsOpp,
          dCarrier: carrierIsOpp
            ? Math.hypot(p.pos.x - carrier!.pos.x, p.pos.y - carrier!.pos.y) : Infinity,
          carrierGoalD,
          dOwnGoal: Math.hypot(p.pos.x - ownGoal.x, p.pos.y - ownGoal.y),
        });
        if (offered) row.containOfferTicks += 1;
        const acting = containActed({
          carrierIsOpp,
          actionType: p.action.type,
          targetIdx: (p.action as { targetIdx?: number }).targetIdx,
          carrierIndex: carrierIsOpp ? carrier!.index : -1,
          why: p.action.scores[0]?.why ?? '',
        });
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
        row.swarmStanceBins[swarmBinOf(inStance)] += 1;
        row.swarmZoneBins[swarmBinOf(inZone)] += 1;
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
  }
  const led = m.dfSurfaceLedger;
  row.elections = led.elections;
  row.idle = led.idle;
  row.pressOffered = led.pressOffered;
  row.pressDeclinedByBook = led.pressDeclinedByBook;
  row.byOption = [...led.byOption];
  row.byModeOption = [...led.byModeOption];
  return row;
};

/* ========================================================================== */
/* §3B ⭐⭐ COMPOSITION FIXTURES — ONE PER WALK-SIDE PREDICATE                  */
/*     canon: "anchored extraction protects the source line; a headline-       */
/*     bearing walk-side predicate ALSO needs a composition fixture"          */
/*     (home BK-T3 §CORR item 2, refining DF-T3 §CORR item 2). Each fixture   */
/*     calls THE SAME function the battery calls, on a CONSTRUCTED input      */
/*     whose classification is known, and every one must hold or the probe    */
/*     REFUSES TO RUN (construction class, nothing written).                  */
/* ========================================================================== */
interface PredFixture { predicate: string; cell: string; expected: string | number | boolean; got: string | number | boolean }
const predFixtures: PredFixture[] = [];
const fx = (predicate: string, cell: string, expected: string | number | boolean, got: string | number | boolean): void => {
  predFixtures.push({ predicate, cell, expected, got });
};
/* P1 — the BALL family (the multiChase numerator) */
fx('familyOfAction', 'the owner himself', 'ONBALL', familyOfAction(true, 'ChaseBall'));
fx('familyOfAction', 'ChaseBall', 'BALL', familyOfAction(false, 'ChaseBall'));
fx('familyOfAction', 'InterceptPass', 'BALL', familyOfAction(false, 'InterceptPass'));
fx('familyOfAction', 'ReceivePass', 'BALL', familyOfAction(false, 'ReceivePass'));
fx('familyOfAction', 'MarkOpponent is NOT ball', 'MARK', familyOfAction(false, 'MarkOpponent'));
fx('familyOfAction', 'MoveToFormationSpot is NOT ball', 'FORMATION', familyOfAction(false, 'MoveToFormationSpot'));
/* P2 — the swarm bin (the ≥5-body stance splinter) */
fx('swarmBinOf', '0 bodies', 0, swarmBinOf(0));
fx('swarmBinOf', '4 bodies', 4, swarmBinOf(4));
fx('swarmBinOf', '5 bodies → the LAST bin', 5, swarmBinOf(5));
fx('swarmBinOf', '9 bodies clamp into the last bin', 5, swarmBinOf(9));
/* P3 — the chaser bin (H-DF.4(i)) */
fx('chaserBinOf', '0 chasers', 0, chaserBinOf(0));
fx('chaserBinOf', '3 chasers', 3, chaserBinOf(3));
fx('chaserBinOf', '4 chasers → bin 4', 4, chaserBinOf(4));
fx('chaserBinOf', '5 chasers clamp into bin 4', 4, chaserBinOf(5));
/* P4 — the mark transition (DF-C0 §R2's own definitions) */
fx('markTransitionOf', 'held 3 → held 7', 'switch', markTransitionOf(3, 7));
fx('markTransitionOf', 'held 3 → held 3', 'none', markTransitionOf(3, 3));
fx('markTransitionOf', 'held 3 → nobody', 'abandon', markTransitionOf(3, null));
fx('markTransitionOf', 'nobody → held 3', 'start', markTransitionOf(null, 3));
fx('markTransitionOf', 'nobody → nobody', 'none', markTransitionOf(null, null));
/* P5 — the contain OFFER geometry, ONE FIXTURE PER TERM (DF-T3B's rider idiom) */
const offerBase = {
  holdsMark: false, isChaser: false, carrierIsOpp: true,
  dCarrier: 5, carrierGoalD: 25, dOwnGoal: 20,
};
fx('containOffered', 'POSITIVE — all terms hold', true, containOffered(offerBase));
fx('containOffered', 'TERM dC<8 violated (10 m off him)', false,
  containOffered({ ...offerBase, dCarrier: 10 }));
fx('containOffered', 'TERM carrierGoalD<35 violated (a 40 m build-up)', false,
  containOffered({ ...offerBase, carrierGoalD: 40, dOwnGoal: 35 }));
fx('containOffered', 'TERM goal-side violated (behind him)', false,
  containOffered({ ...offerBase, dOwnGoal: 30 }));
fx('containOffered', 'he already HOLDS a man', false,
  containOffered({ ...offerBase, holdsMark: true }));
fx('containOffered', 'he is already a CHASER', false,
  containOffered({ ...offerBase, isChaser: true }));
fx('containOffered', 'no opposing carrier at all', false,
  containOffered({ ...offerBase, carrierIsOpp: false, dCarrier: Infinity, carrierGoalD: Infinity }));
/* P6 — the contain ACT (the realised argmax) */
const actBase = {
  carrierIsOpp: true, actionType: 'MarkOpponent', targetIdx: 4 as number | undefined,
  carrierIndex: 4, why: 'contain Foo — hold goal-side',
};
fx('containActed', 'POSITIVE — type + target + why', true, containActed(actBase));
fx('containActed', 'a DIFFERENT man is marked', false, containActed({ ...actBase, targetIdx: 5 }));
fx('containActed', 'the winning why is not the contain one', false,
  containActed({ ...actBase, why: 'mark Foo — tightest man' }));
fx('containActed', 'the action is a chase, not a mark', false,
  containActed({ ...actBase, actionType: 'ChaseBall' }));
fx('containActed', 'no opposing carrier at all', false,
  containActed({ ...actBase, carrierIsOpp: false }));
const PRED_FIXTURES_OK = predFixtures.every((f) => f.expected === f.got);
if (!PRED_FIXTURES_OK) {
  console.error('CONSTRUCTION CLASS: a walk-side predicate fixture failed',
    predFixtures.filter((f) => f.expected !== f.got));
  process.exit(3);
}

/* ========================================================================== */
/* §4 THE SEASON LADDER — the ecological gate (M-DF.4), DF-T3's design reused  */
/* ========================================================================== */
/**
 * ⭐ M-DF.4 VERBATIM: *"the ecological gate: EVERY DF exam reports the season ladder beside
 * match-grain faces"*. The arms: `liveCapOn` = the live world + dfAssignPersist + dfSurface;
 * `liveCapOff` = the same + dfCapOff. Both armed through the League's OWN `matchFlags` probe
 * surface, which the shipped `createMatch` spread carries into every fixture — nothing is
 * hand-written onto `info.genome` (dose-placement canon, home ruling #270.2; this stage does
 * NO dosing at all). Canon VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world
 * (League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines #270's
 * E4 correction; matches the perf diagnostic)" (home: ruling #283.2(iv)) — THE LADDER IS THE
 * ECOLOGY, not world 9. NO GENE IS FROZEN IN EITHER ARM. The atkFrozen FLOOR is NOT re-run:
 * it is DF-C0 §R4's published +0.2211, QUOTED as a reference line.
 */
type LadderArm = 'liveCapOn' | 'liveCapOff';
const LADDER_ARMS: readonly LadderArm[] = ['liveCapOn', 'liveCapOff'];
const LADDER_ARM_NOTE: Record<LadderArm, string> = {
  liveCapOn: 'THE LIVE WORLD + dfAssignPersist + dfSurface (the H-DF.1-passing stack), the '
    + 'Phase-31 CAP INTACT.',
  liveCapOff: 'THE LIVE WORLD + dfAssignPersist + dfSurface + dfCapOff, armed through '
    + 'League.matchFlags (the shipped createMatch spread). Nothing else differs.',
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
  league.matchFlags = arm === 'liveCapOff'
    ? { dfAssignPersist: true, dfSurface: true, dfCapOff: true }
    : { dfAssignPersist: true, dfSurface: true };
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
      const fixture = league.nextFixture();
      if (fixture === null) break;
      const match = league.createMatch(fixture);
      doorChecked += 1;
      if (match.dfCapOff !== (arm === 'liveCapOff')
        || match.dfAssignPersist !== true || match.dfSurface !== true) doorWrong += 1;
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
      league.applyResult(fixture, res);
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
/* §5 STATS BASES — the registry of record 69, floor 116,800, step ≥ 200      */
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
 * THE REGISTRY OF RECORD ENTERING THIS STAGE IS 69 (ruling #335 item 4: "registry 69"; #336
 * item 4: "Stats ZERO — registry stays 69"). Summed from the rulings' own consumption items,
 * never cached (#332 item 3's lesson): IN-C0's completed 56 + 114,200 (IN-C0/IN-C0-FIX, #317
 * item 4) + 114,400 + 114,600 (DF-C0, #320 item 4) + 114,800 + 115,000 (DF-T1) + 115,200 +
 * 115,400 + 115,600 (DF-T3) + 115,800 + 116,000 + 116,200 (to #333 item 4's count of 67) +
 * 116,400 (DF-T3B) + 116,600 (IN-T2B) = 69. BK-T3 and BK-T4 consumed ZERO.
 */
const REGISTRY_ADDITIONS: readonly number[] = [
  114_200, 114_400, 114_600, 114_800, 115_000, 115_200, 115_400, 115_600,
  115_800, 116_000, 116_200, 116_400, 116_600,
];
const STATS_PUBLISHED_BASES: readonly number[] = [
  ...new Set([...R9_INHERITED_BASES, ...REGISTRY_ADDITIONS]),
].sort((a, b) => a - b);
const REGISTRY_COMPLETE = R9_INHERITED_BASES.length === 56
  && STATS_PUBLISHED_BASES.length === 69
  && REGISTRY_ADDITIONS.every((b) => !R9_INHERITED_BASES.includes(b));
const STATS_BASE = 116_800;
const STATS_STEP = 200;
/** THREE draws, THREE bases, all booked (#336 item 5: stats from 116,800 on the lattice) */
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
if (!shippedCapLineCounts.every((c) => c.occurrences === 1)
  || !bypassLineCounts.every((c) => c.occurrences === 1)) {
  console.error('CONSTRUCTION CLASS: the cap slice does not carry its lines exactly once',
    { shippedCapLineCounts, bypassLineCounts });
  process.exit(3);
}

/* ========================================================================== */
/* §7 THE BATTERY                                                              */
/* ========================================================================== */
const LADDER_GENS = GENS_ENV ?? (MODE === 'full' ? 20 : 2);
const LADDER_SEEDS_ALL = [BLOCK_BASE + 900, BLOCK_BASE + 901, BLOCK_BASE + 902, BLOCK_BASE + 903];
const LADDER_SEEDS = MODE === 'smoke' ? LADDER_SEEDS_ALL.slice(0, 1) : LADDER_SEEDS_ALL;

banner(`DF-T4: mode=${MODE} battery=${SEEDS.length} seeds × 2 arms  ladder=${LADDER_SEEDS.length}`
  + ` leagues × ${LADDER_GENS} generations × ${LADDER_ARMS.length} arms`);
const tBattery0 = Date.now();
const rows: Row[] = [];
for (const seed of SEEDS) {
  for (const capOff of [false, true]) rows.push(walk(seed, capOff));
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
/* §8 THE BETWEEN-ARM FACES — paired, seed-clustered, DF-T3's idiom verbatim   */
/* ========================================================================== */
const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;
const defenderMatches = (r: Row): number => (r.defenderTicks * DT) / MATCH_DURATION;
const perMatch = (): number => 1;

interface FaceDef { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string; denNote: string; family: string }
const FACES: Record<string, FaceDef> = {
  /* ---------- H-DF.4(ii)'s TWO SCORED faces ---------- */
  multiChaseShare2: {
    num: (r) => r.multiChase2Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '⭐ H-DF.4(ii) SCORED — ≥2 bodies in the BALL family at once. Cap-off it must lie '
      + 'INSIDE the CAP-ON arm\'s own 95 % interval.',
    denNote: 'denominator = out-of-possession team-ticks — MOVES with possession share',
    family: 'swarm (SCORED)',
  },
  multiChaseShare3: {
    num: (r) => r.multiChase3Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '⭐ H-DF.4(ii) SCORED — ≥3 bodies in the BALL family, the "NEVER three" the cap '
      + 'banned as it actually occurs. Cap-off it must lie INSIDE the CAP-ON arm\'s own 95 % '
      + 'interval.',
    denNote: 'denominator = out-of-possession team-ticks — MOVES with possession share',
    family: 'swarm (SCORED)',
  },
  /* ---------- H-DF.4(iii)'s THREE SCORED faces ---------- */
  markSwitchesPerDefenderMinute: {
    num: (r) => r.markSwitches, den: defenderMinutes,
    unit: 'switches per defender-minute (sim clock; 1 defender-minute = 60 sim-s a body '
      + 'spent out of possession)',
    what: '⭐ H-DF.4(iii) SCORED — 乱跑 itself (DF-C0 §R2\'s definition VERBATIM). FROZEN BAD '
      + 'DIRECTION: UP. It fails only on a RESOLVED rise cap-off.',
    denNote: 'denominator = defender body-ticks × DT / 60; MOVING with sent-offs and with '
      + 'possession share — disclosed per face',
    family: 'churn (SCORED)',
  },
  markHeldShare: {
    num: (r) => r.markHeldTicks, den: (r) => r.defenderTicks,
    unit: 'share of defender body-ticks',
    what: '⭐ H-DF.4(iii) SCORED — ASSIGNMENT COVERAGE, how much of his defending life a body '
      + 'actually HAS a mark. FROZEN BAD DIRECTION: DOWN.',
    denNote: 'denominator = defender body-ticks (the assignment-holding population)',
    family: 'coverage (SCORED)',
  },
  dupMarkShare: {
    num: (r) => r.dupMarkTicks, den: (r) => r.markPairTicks,
    unit: `share of ≥2-marker team-ticks with two mark targets within ${DUP_RUN_M} m`,
    what: `⭐ H-DF.4(iii) SCORED — THE dupRun-LINEAGE FACE, defensive side (radius reused `
      + `verbatim: DUP_RUN_M = ${DUP_RUN_M}). FROZEN BAD DIRECTION: UP.`,
    denNote: 'denominator = team-ticks with ≥2 MARK-family defenders — MOVES with how often '
      + 'the scheme assigns two markers at all',
    family: 'churn (SCORED)',
  },
  /* ---------- the crowding COMPANIONS to the (i) conjunct (REPORTED) ---------- */
  chaserShare3Plus: {
    num: (r) => sum(r.chaserCountBins.slice(3)), den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks with ≥3 licensed chasers',
    what: '⭐ THE (i) CONJUNCT\'S MAGNITUDE COMPANION (REPORTED, never gated): the licence '
      + 'the cap ceilings. DF-C0 §R2 published the capped world\'s own bins '
      + '[431172, 1719847, 877388, 193222, 0] over 3,221,629 team-ticks — "three 6.0 %".',
    denNote: 'denominator = out-of-possession team-ticks — MOVES with possession share',
    family: 'chaser count (REPORTED)',
  },
  chaserShare4: {
    num: (r) => r.chaserCountBins[4], den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks with ≥4 licensed chasers',
    what: '⭐⭐ THE (i) CONJUNCT AS A SHARE (REPORTED beside the gate, so a RED can be priced '
      + 'without re-cutting it): cap-on this is structurally 0.',
    denNote: 'denominator = out-of-possession team-ticks — MOVES with possession share',
    family: 'chaser count (REPORTED)',
  },
  /* ---------- the swarm companions (REPORTED) ---------- */
  swarmStanceShare2: {
    num: (r) => sum(r.swarmStanceBins.slice(2)), den: (r) => sum(r.swarmStanceBins),
    unit: `share of carrier-present defending team-ticks with ≥2 bodies inside ${SWARM_R_STANCE} m`,
    what: 'THE SWARM\'S OWN FACE at the shipped stance radius (REPORTED)',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
    family: 'swarm (REPORTED)',
  },
  swarmStanceShare5: {
    num: (r) => r.swarmStanceBins[5], den: (r) => sum(r.swarmStanceBins),
    unit: `share of carrier-present defending team-ticks with ≥5 bodies inside ${SWARM_R_STANCE} m`,
    what: '⭐ THE ORDERED FIRST LOOK as a SHARE — DF-T3 §R4\'s honest splinter (26 ticks armed '
      + 'vs 0 shut, 0.0124 %), sign-reversed from DF-T2 §R6 (77 shut vs 0 armed). REPORTED.',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
    family: 'swarm (REPORTED — the ordered first look)',
  },
  swarmZoneShare3: {
    num: (r) => sum(r.swarmZoneBins.slice(3)), den: (r) => sum(r.swarmZoneBins),
    unit: `share of carrier-present defending team-ticks with ≥3 bodies inside ${SWARM_R_ZONE} m`,
    what: 'the geometric pile-up face at the zonal engage radius (REPORTED)',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
    family: 'swarm (REPORTED)',
  },
  /* ---------- the rest of the churn / coverage family (REPORTED) ---------- */
  markSwitchesPerDefenderMatch: {
    num: (r) => r.markSwitches, den: defenderMatches,
    unit: `switches per defender-match (the ${MATCH_DURATION} s match clock — the dual axis)`,
    what: 'the same count on the match clock (clock honesty)',
    denNote: 'denominator = defender body-ticks × DT / MATCH_DURATION',
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
    what: '⭐ a body is licensed to hunt the ball — the door\'s most direct plumbing face',
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
  /* ---------- THE PRESS REALISATION FAMILY (DF-T3 §R2's, both arms) ---------- */
  containActShareOfOfferTicks: {
    num: (r) => r.containActTicks, den: (r) => r.containOfferTicks,
    unit: 'share of OFFER defender-ticks (the contain branch\'s own geometry, anchored)',
    what: '⭐ THE PRESS REALISATION RATE at TICK grain, BOTH ARMS — of the defender-ticks the '
      + 'shipped contain branch\'s geometry OFFERS, the share where the brain\'s realised '
      + 'ARGMAX IS the contain candidate.',
    denNote: 'denominator = OFFER defender-ticks — MOVES with how often the geometry arises '
      + 'at all, which the CAP itself changes (a licensed chaser is not an offer)',
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
  pressElectionShare: {
    num: (r) => r.byOption[0], den: (r) => r.elections,
    unit: 'share of surface elections',
    what: '⭐ THE PRESS ELECTION SHARE by arm — DF-T2\'s usage ledger, which is armed in BOTH '
      + 'arms here, so the cap\'s retirement can be read at the DECISION seat too.',
    denNote: 'denominator = surface elections (one row per defender per assignment pass) — '
      + 'MOVES with how many bodies are free to be offered an option at all',
    family: 'press election (REPORTED)',
  },
  pressDeclinedByBookShare: {
    num: (r) => r.pressDeclinedByBook, den: (r) => r.pressOffered,
    unit: 'share of press offers declined by the defence book',
    what: 'the decline-only veto\'s own receipt, by arm',
    denNote: 'denominator = press offers (the surface\'s own geometric population)',
    family: 'press election (REPORTED)',
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
    what: '⭐ R-乙 Q14 — "how much of the game is played under pressure", the nearest opponent '
      + `≤ TOUCH_CONTROL_DIST = ${PRESSURE_R} m at the reception tick. The face the cap's `
      + 'retirement should move if it moves anything.',
    denNote: 'denominator = openPlay-origin first receptions — MOVES with spell count',
    family: 'R-乙 chain (REPORTED)',
  },
  /* ---------- goals + the defensive mix at MATCH grain (REPORT ONLY) ---------- */
  goalsPerMatch: {
    num: (r) => r.goals, den: perMatch, unit: 'goals per match',
    what: '§2 equilibrium (REPORTED — nothing ships from a trial)',
    denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  shotsPerMatch: {
    num: (r) => r.shots, den: perMatch, unit: 'shots per match',
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
const onBySeed = new Map(rows.filter((r) => r.arm === 'capOn').map((r) => [r.seed, r]));
const offBySeed = new Map(rows.filter((r) => r.arm === 'capOff').map((r) => [r.seed, r]));

interface FaceRow {
  face: string; family: string; unit: string; what: string; denNote: string;
  capOnValue: number; capOnNumerator: number; capOnDenominator: number;
  capOffValue: number; capOffNumerator: number; capOffDenominator: number;
  delta: number; ciLo: number; ciHi: number; halfWidth: number; ratioToHalfWidth: number;
  resolved: boolean; direction: 'down' | 'up' | 'unresolved';
}
const pickPct = (draws: readonly number[], p: number): number => (draws.length === 0 ? Number.NaN
  : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
const faceOf = (name: string, d: FaceDef): FaceRow => {
  const onRows = rows.filter((r) => r.arm === 'capOn');
  const offRows = rows.filter((r) => r.arm === 'capOff');
  const bn = sum(onRows.map(d.num));
  const bd = sum(onRows.map(d.den));
  const an = sum(offRows.map(d.num));
  const ad = sum(offRows.map(d.den));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let bnn = 0; let bdd = 0; let ann = 0; let add = 0;
    for (const i of idx) {
      const s = seedsWalked[i];
      const rb = onBySeed.get(s)!;
      const ra = offBySeed.get(s)!;
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
    capOnValue: round(ratio(bn, bd)), capOnNumerator: round(bn), capOnDenominator: round(bd),
    capOffValue: round(ratio(an, ad)), capOffNumerator: round(an), capOffDenominator: round(ad),
    delta: round(delta), ciLo: round(lo), ciHi: round(hi), halfWidth: round(hw),
    ratioToHalfWidth: round(Math.abs(delta) / hw, 6),
    resolved, direction: resolved ? (hi < 0 ? 'down' : 'up') : 'unresolved',
  };
};
const faces: FaceRow[] = Object.entries(FACES).map(([k, d]) => faceOf(k, d));
const faceRow = (name: string): FaceRow => faces.find((f) => f.face === name)!;

/* ---- the latency PERCENTILE faces, from STORED BINS (canon) ---- */
const armRows = (arm: ArmName): Row[] => rows.filter((r) => r.arm === arm);
const latBinsPooled = (arm: ArmName): number[] => Array.from({ length: LAT_BINS },
  (_, b) => sum(armRows(arm).map((r) => r.reTargetLatencyBins[b])));
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
const latencyBins = { capOn: latBinsPooled('capOn'), capOff: latBinsPooled('capOff') };
const latencyPercentiles = {
  capOnMedianS: latQuantile(latencyBins.capOn, 0.5),
  capOnP90S: latQuantile(latencyBins.capOn, 0.9),
  capOffMedianS: latQuantile(latencyBins.capOff, 0.5),
  capOffP90S: latQuantile(latencyBins.capOff, 0.9),
};
const poolBins = (arm: ArmName, pickB: (r: Row) => number[], n: number): number[] =>
  Array.from({ length: n }, (_, b) => sum(armRows(arm).map((r) => pickB(r)[b])));
const chaserBins = {
  capOn: poolBins('capOn', (r) => r.chaserCountBins, CHASER_BINS),
  capOff: poolBins('capOff', (r) => r.chaserCountBins, CHASER_BINS),
};
const swarmBins = {
  capOnStance: poolBins('capOn', (r) => r.swarmStanceBins, SWARM_BINS),
  capOffStance: poolBins('capOff', (r) => r.swarmStanceBins, SWARM_BINS),
  capOnZone: poolBins('capOn', (r) => r.swarmZoneBins, SWARM_BINS),
  capOffZone: poolBins('capOff', (r) => r.swarmZoneBins, SWARM_BINS),
};

/* ========================================================================== */
/* §9 ⭐⭐ THE (ii) CONJUNCT — THE CAP-ON ARM'S OWN 95 % INTERVAL, CONTAINMENT  */
/* ========================================================================== */
/**
 * ⭐ THE WITHIN-ARM BOOTSTRAP — its OWN stats base, its OWN resample index; the cluster is the
 * SEED, exactly as the between-arm bootstrap's is. UNPAIRED by construction: the CAP-ON arm
 * gets its own interval and the frozen test is whether the cap-off POINT ESTIMATE lies inside
 * it (the dispatch's own words: "stay INSIDE the cap-on arm's own 95 % intervals").
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
const armIntervalOf = (arm: ArmName, d: FaceDef): Interval => {
  const bySeed = arm === 'capOn' ? onBySeed : offBySeed;
  const draws: number[] = [];
  for (const idx of withinIndex) {
    let n = 0; let dd = 0;
    for (const i of idx) {
      const r = bySeed.get(seedsWalked[i])!;
      n += d.num(r); dd += d.den(r);
    }
    const v = ratio(n, dd);
    if (Number.isFinite(v)) draws.push(v);
  }
  const rs = armRows(arm);
  return intervalOf(draws, ratio(sum(rs.map(d.num)), sum(rs.map(d.den))));
};
const insideInterval = (point: number, iv: Interval): boolean =>
  Number.isFinite(point) && Number.isFinite(iv.ciLo) && Number.isFinite(iv.ciHi)
  && point >= iv.ciLo && point <= iv.ciHi;

const containment = (name: string): {
  face: string; capOnInterval: Interval; capOffPoint: number; inside: boolean;
  capOffInterval: Interval; pairedDelta: number; pairedCi: number[];
  pairedHalfWidth: number; pairedRatioToHalfWidth: number; pairedResolved: boolean;
} => {
  const d = FACES[name];
  const on = armIntervalOf('capOn', d);
  const off = armIntervalOf('capOff', d);
  const f = faceRow(name);
  return {
    face: name,
    capOnInterval: on,
    capOffPoint: off.value,
    inside: insideInterval(off.value, on),
    capOffInterval: off,
    pairedDelta: f.delta,
    pairedCi: [f.ciLo, f.ciHi],
    pairedHalfWidth: f.halfWidth,
    pairedRatioToHalfWidth: f.ratioToHalfWidth,
    pairedResolved: f.resolved,
  };
};
const cMc2 = containment('multiChaseShare2');
const cMc3 = containment('multiChaseShare3');

/* ========================================================================== */
/* §10 ⭐ THE ORDERED FIRST LOOK — the ≥5-body STANCE bin, both arms            */
/* ========================================================================== */
const stanceFive = {
  what: '⭐ THE ORDERED FIRST LOOK (#336 item 5): DF-T3 §R4\'s honest splinter — the ≥5-body '
    + `bin of the stance histogram (five or more bodies inside the shipped ${SWARM_R_STANCE} m `
    + 'stance radius) — re-measured in BOTH arms from STORED BINS. REPORTED, never gated: it '
    + 'is not one of H-DF.4\'s conjuncts.',
  priorReadings: {
    dfT3: 'DF-T3 §R4 VERBATIM: `swarmBins.armedStance` = [130299, 60720, 16289, 2697, 159, 26] '
      + '· `swarmBins.shutStance` = [120305, 66645, 14806, 2280, 165, 0] — the last bin is 26 '
      + 'armed against 0 shut, "26 of 210,190 armed carrier-present defending team-ticks '
      + '(0.0124 %)", read there as "noise at the tail of a bin, not the swarm returning".',
    dfT2: 'DF-T2 §R6 VERBATIM: `swarmBins.armedStance` = [111776, 68278, 13721, 1799, 133, 0] '
      + '· `swarmBins.shutStance` = [123293, 62895, 14170, 2035, 260, 77] — THE SIGN THE OTHER '
      + 'WAY (77 shut against 0 armed), which is why DF-T3 called the splinter unresolved and '
      + 'ordered it re-measured here.',
  },
  capOnBins: swarmBins.capOnStance,
  capOffBins: swarmBins.capOffStance,
  capOnBinFive: swarmBins.capOnStance[5],
  capOffBinFive: swarmBins.capOffStance[5],
  capOnDenominator: sum(swarmBins.capOnStance),
  capOffDenominator: sum(swarmBins.capOffStance),
  capOnShare: round(ratio(swarmBins.capOnStance[5], sum(swarmBins.capOnStance))),
  capOffShare: round(ratio(swarmBins.capOffStance[5], sum(swarmBins.capOffStance))),
  pairedFace: 'swarmStanceShare5 (in `faces`, with its own paired interval)',
};

/* ========================================================================== */
/* §11 THE LADDER FACES + SLOPES — DF-C0-FIX §RF1's ONE FORMULA, verbatim      */
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
const ladderSlopes: LadderSlope[] = [];
const rngLadder = new Rng(STATS_BASE + STATS_STEP);
for (const arm of LADDER_ARMS) {
  for (const f of LADDER_SLOPE_FACES) {
    const perLeague = LADDER_SEEDS.map((ls) => {
      const cs = ladderCells.filter((c) => c.arm === arm && c.leagueSeed === ls);
      const early = cs.filter((c) => c.generation <= EARLY_GENS);
      const late = cs.filter((c) => c.generation >= LATE_FROM);
      const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));
      const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));
      return { early: e, late: l, delta: l - e };
    });
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
const onGoalSlope = slopeOf('liveCapOn', 'goals');
const offGoalSlope = slopeOf('liveCapOff', 'goals');
const ladderFloorRead = {
  atkFrozenFloor: ATK_FROZEN_FLOOR,
  atkFrozenFloorSource: ATK_FROZEN_FLOOR_SOURCE,
  capOnGoalsSlopeDelta: onGoalSlope.delta,
  capOffGoalsSlopeDelta: offGoalSlope.delta,
  capOnDistanceAboveFloor: round(onGoalSlope.delta - ATK_FROZEN_FLOOR),
  capOffDistanceAboveFloor: round(offGoalSlope.delta - ATK_FROZEN_FLOOR),
  capOffMinusCapOn: round(offGoalSlope.delta - onGoalSlope.delta),
  bendsTowardFloor: offGoalSlope.delta < onGoalSlope.delta,
  readingVsContactAtLadderGrain: {
    note: '⭐ DF-C0 §R4\'s ESTIMAND — evolved LEAGUE play across generations, per team-match. '
      + 'This is the mandate\'s own face and the ONLY grain at which 「防守从读球退化成身体'
      + '接触」 is judged. The friendly-match `interceptionsPerMatch` face is a DIFFERENT '
      + 'number and is never quoted as this one (DF-T2 §R11 item 6).',
    capOnInterceptionsDelta: slopeOf('liveCapOn', 'interceptions').delta,
    capOffInterceptionsDelta: slopeOf('liveCapOff', 'interceptions').delta,
    capOnTacklesDelta: slopeOf('liveCapOn', 'tackles').delta,
    capOffTacklesDelta: slopeOf('liveCapOff', 'tackles').delta,
    capOnInterceptionsGen1: null as number | null,
    capOnInterceptionsGenLast: null as number | null,
    capOffInterceptionsGen1: null as number | null,
    capOffInterceptionsGenLast: null as number | null,
  },
  preRegisteredDirection: '#320 item 3\'s FROZEN DIRECTION, restated at dispatch: the ladder '
    + 'is REPORTED and a deviation ROUTES TO A SLICE, never to a nudge. M-DF.4\'s ecological '
    + 'gate is why it runs at all — the dispatch\'s REPORTED list is match-grain, and the '
    + 'contract\'s own clause extends it.',
  interpretationNote: '⚠ THE FLOOR IS A REFERENCE LINE, NOT A MATCHED CONTROL — DF-C0\'s '
    + 'atkFrozen arm froze the ATTACK genes on league seeds 12,508,900–903; this stage arms a '
    + 'defensive door on 12,521,900–903. ⚠ No between-arm SLOPE test was pre-registered and '
    + 'none is invented: each arm carries its own league-clustered interval and the comparison '
    + 'is read as overlap.',
};
{
  const g1 = (arm: LadderArm, gen: number): number =>
    ladderFaces.find((l) => l.arm === arm && l.generation === gen)!.interceptionsPerTeamMatch;
  const rv = ladderFloorRead.readingVsContactAtLadderGrain;
  rv.capOnInterceptionsGen1 = g1('liveCapOn', 1);
  rv.capOnInterceptionsGenLast = g1('liveCapOn', LADDER_GENS);
  rv.capOffInterceptionsGen1 = g1('liveCapOff', 1);
  rv.capOffInterceptionsGenLast = g1('liveCapOff', LADDER_GENS);
}

/* ========================================================================== */
/* §12 H-DF.4 — THE FROZEN VERDICT (never re-cut after sight)                  */
/* ========================================================================== */
const capShaAfter = capShaNow();
const fSwitch = faceRow('markSwitchesPerDefenderMinute');
const fHeld = faceRow('markHeldShare');
const fDup = faceRow('dupMarkShare');
/** (i) the four-chaser bin, cap-off, EXACTLY ZERO */
const limb1 = chaserBins.capOff[4] === 0;
/** (ii) both multiChase shares inside the CAP-ON arm's own 95 % intervals */
const limb2 = cMc2.inside && cMc3.inside;
/** (iii) the three churn/coverage faces do not degrade RESOLVEDLY (each with its own direction) */
const degraded = (f: FaceRow, bad: 'up' | 'down'): boolean => f.resolved && f.direction === bad;
const limb3 = !degraded(fSwitch, 'up') && !degraded(fHeld, 'down') && !degraded(fDup, 'up');
const HDF4_PASS = limb1 && limb2 && limb3;
const hdf4 = {
  claim: 'H-DF.4 — THE SURFACE ALONE HOLDS THE BAND: with the Phase-31 cap RETIRED in the '
    + 'arm, the priced per-defender surface alone prevents the crowding the cap was built to '
    + 'stop (M-DF.2\'s final sequence step — "the cap-off arm proves the surface alone holds '
    + 'the band"; ruling #336 item 5).',
  ciRule: 'BETWEEN-ARM faces: RESOLVED = the 95 % seed-clustered PAIRED bootstrap interval of '
    + '(capOff − capOn) EXCLUDES ZERO (2,000 draws, percentile, the SAME resampled seed set '
    + 'used for both arms in every draw). THE (ii) CONTAINMENT TEST: the CAP-ON arm\'s own '
    + 'seed-clustered (unpaired) 95 % interval, and the cap-off POINT ESTIMATE must lie inside '
    + 'it. Frozen before the battery; NEVER re-cut after sight.',
  i_fourChaserBinZero: {
    pass: limb1,
    rule: 'THE FOUR-CHASER BIN, CAP-OFF, IS EXACTLY ZERO. ⭐ THE FORM IS CHOSEN AND ARGUED AT '
      + '§P: it is the ONLY form the parents define for this bin — DF-C0 §R2 VERBATIM "the bin '
      + 'for four is EXACTLY ZERO, so the cap does bind" (a structural count, no interval), '
      + 're-published as exactly zero in both arms by DF-T2 §R6 and DF-T3 §R4. A nonzero band '
      + 'would have to be invented here, which the frozen-rule discipline forbids. ⚠ Stated '
      + 'BEFORE the run: commit 1\'s own fixture proves a FOURTH chaser is reachable cap-off, '
      + 'so ONE tick of the picture turns this conjunct RED — accepted, and the magnitude is '
      + 'REPORTED beside it (chaserShare4 · chaserShare3Plus) so a red can be priced without '
      + 'being re-cut.',
    capOffBin4: chaserBins.capOff[4],
    capOnBin4: chaserBins.capOn[4],
    capOffBins: chaserBins.capOff,
    capOnBins: chaserBins.capOn,
    capOffShare4: faceRow('chaserShare4').capOffValue,
    capOnShare4: faceRow('chaserShare4').capOnValue,
    capOffShare3Plus: faceRow('chaserShare3Plus').capOffValue,
    capOnShare3Plus: faceRow('chaserShare3Plus').capOnValue,
  },
  ii_multiChaseInsideCapOnIntervals: {
    pass: limb2,
    rule: 'multiChaseShare2 AND multiChaseShare3, cap-off, STAY INSIDE the CAP-ON arm\'s own '
      + '95 % intervals (the cap-off point estimate within [ciLo, ciHi] of the cap-on arm\'s '
      + 'seed-clustered bootstrap interval)',
    multiChaseShare2: cMc2,
    multiChaseShare3: cMc3,
  },
  iii_churnDoesNotDegrade: {
    pass: limb3,
    rule: 'the churn/coverage faces do NOT DEGRADE RESOLVEDLY cap-off — '
      + 'markSwitchesPerDefenderMinute (bad direction UP) · markHeldShare (bad direction '
      + 'DOWN) · dupMarkShare (bad direction UP); NON-INFERIORITY, each fails only on a '
      + 'RESOLVED move in its own frozen bad direction',
    faces: [
      { face: fSwitch.face, badDirection: 'up', capOn: fSwitch.capOnValue, capOff: fSwitch.capOffValue, delta: fSwitch.delta, ci: [fSwitch.ciLo, fSwitch.ciHi], halfWidth: fSwitch.halfWidth, ratioToHalfWidth: fSwitch.ratioToHalfWidth, resolved: fSwitch.resolved, direction: fSwitch.direction, degraded: degraded(fSwitch, 'up') },
      { face: fHeld.face, badDirection: 'down', capOn: fHeld.capOnValue, capOff: fHeld.capOffValue, delta: fHeld.delta, ci: [fHeld.ciLo, fHeld.ciHi], halfWidth: fHeld.halfWidth, ratioToHalfWidth: fHeld.ratioToHalfWidth, resolved: fHeld.resolved, direction: fHeld.direction, degraded: degraded(fHeld, 'down') },
      { face: fDup.face, badDirection: 'up', capOn: fDup.capOnValue, capOff: fDup.capOffValue, delta: fDup.delta, ci: [fDup.ciLo, fDup.ciHi], halfWidth: fDup.halfWidth, ratioToHalfWidth: fDup.ratioToHalfWidth, resolved: fDup.resolved, direction: fDup.direction, degraded: degraded(fDup, 'up') },
    ],
  },
  verdict: HDF4_PASS ? 'PASS' : `FAIL — ${[
    limb1 ? null : '(i)', limb2 ? null : '(ii)', limb3 ? null : '(iii)',
  ].filter((x) => x !== null).join(' and ')}`,
  consequence: 'IF H-DF.4 HOLDS, cap retirement becomes an ENTRY DECISION (the width-floor '
    + 'sequence completes: the compensator retires by measurement). IF IT FAILS, THE CAP '
    + 'STAYS — and that is the result (#336 item 5).',
};

/* ========================================================================== */
/* §13 GATES (frozen; a RED gate stays RED and is reported)                    */
/* ========================================================================== */
const gates: Record<string, boolean> = {};
gates.gWorldOkEveryWalk = rows.every((r) => r.worldOk);
/** ⭐ BOOKED = WALKED against the CELLS' own distinct-seed set (#335 item 4's correction) */
gates.gSeedsBookedEqualWalked = seedsWalked.length === SEEDS.length
  && SEEDS.every((s) => seedsWalked.includes(s))
  && seedsWalked.every((s) => SEEDS.includes(s));
gates.gArmsPairedPerSeed = seedsWalked.every((s) => rows.filter((r) => r.seed === s).length === 2)
  && seedsWalked.every((s) => onBySeed.has(s) && offBySeed.has(s));
gates.gAnchorsResolveOnce = anchorReceipts.every((r) => r.matches === 1) && ANCHORS_OK
  && containWhyOccurrences === 1;
/** ⭐⭐ the walk-side predicate FIXTURES (canon: fixtures protect the transcription) */
gates.gWalkPredicateFixtures = PRED_FIXTURES_OK && predFixtures.length >= 30;
const srcPorcelain = gitOut(['status', '--porcelain', '--', 'src']).trim();
const srcDiffStat = gitOut(['diff', '--stat', 'HEAD', '--', 'src']).trim();
gates.gSrcUntouched = srcPorcelain === '' && srcDiffStat === '';
/** ⭐ THE EXPLICIT PIN THAT REPLACED THE SHA DISCIPLINE: cap-ON's bin four is zero as ever */
gates.gCapOnBinFourZero = chaserBins.capOn[4] === 0;
gates.gCapBinsNonEmpty = sum(chaserBins.capOn) > 0 && sum(chaserBins.capOff) > 0;
gates.gCapSliceStableThroughRun = capShaBefore === capShaAfter;
gates.gShippedCapLinesVerbatim = shippedCapLineCounts.every((c) => c.occurrences === 1);
gates.gBypassLinesPresent = bypassLineCounts.every((c) => c.occurrences === 1);
gates.gLatencyBinsStored = rows.every((r) => r.reTargetLatencyBins.length === LAT_BINS)
  && sum(latencyBins.capOn) > 0 && sum(latencyBins.capOff) > 0;
gates.gSwarmBinsStored = sum(swarmBins.capOnStance) > 0 && sum(swarmBins.capOffStance) > 0
  && sum(swarmBins.capOnZone) > 0 && sum(swarmBins.capOffZone) > 0;
/** ⭐ LIVENESS ON EVALUATION COUNTS, NEVER ON CHOSEN OUTCOMES: the surface ran in BOTH arms */
gates.gSurfaceLedgerLiveBothArms = rows.every((r) => r.elections > 0 && r.pressOffered > 0);
/** ⭐ the ARM DIFFERENCE IS REAL somewhere in the battery (the door is not inert here) */
gates.gArmsDistinguishable = seedsWalked.some((s) => {
  const a = onBySeed.get(s)!;
  const b = offBySeed.get(s)!;
  return a.chaseStarts !== b.chaseStarts || a.multiChase3Ticks !== b.multiChase3Ticks
    || JSON.stringify(a.chaserCountBins) !== JSON.stringify(b.chaserCountBins);
});
gates.gContainInstrumentAlive = rows.every((r) => r.containOfferTicks > 0)
  && sum(rows.map((r) => r.containActTicks)) > 0;
gates.gRyiInstrumentAlive = rows.every((r) => r.openSpells > 0 && r.enginePasses > 0
  && r.openFirstReceptions > 0);
gates.gLadderComplete = ladderCells.length === LADDER_ARMS.length * LADDER_SEEDS.length * LADDER_GENS
  && ladderCells.every((c) => c.matches > 0);
gates.gLadderDoorHeld = ladderCells.every((c) => c.doorWrong === 0 && c.doorChecked > 0);
gates.gLadderGen1Identical = gen1Fingerprints.length === LADDER_SEEDS.length
  && gen1Fingerprints.every((g) => /^[0-9a-f]{64}$/.test(g.sha256));
gates.gSeedDiscipline = SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999)
  && LADDER_SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999);
gates.gStatsDisjoint = STATS_BASE >= 116_800 && minStatsGap >= STATS_STEP && REGISTRY_COMPLETE;
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
/* §14 THE ARTIFACT — allowlist schema; STAGE, re-derive off disk, hash LAST   */
/* ========================================================================== */
const instrumentSha = createHash('sha256')
  .update(readFileSync(new URL(import.meta.url))).digest('hex');
const perfAnchorBytes = readFileSync('docs/perf/baseline.json');
const perfAnchor = JSON.parse(perfAnchorBytes.toString('utf8')) as Record<string, unknown>;

const bodyCore = {
  stage: 'DF-T4-CAP-OFF-TRIAL',
  kind: 'trial (H-DF.4 SCORED on virgin paired seeds, the cap RETIRED in one arm; everything '
    + 'else REPORTED)',
  ruling: '#336 item 5',
  contract: 'DF-DEFENSIVE-BRAIN-CONTRACT.md §1 H-DF.1/H-DF.2 + §2 M-DF.2 (the cap-off arm) '
    + '+ M-DF.4 (the ecological gate)',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  instrument: {
    file: 'scripts/probes/df-t4-cap-off-trial.ts',
    sha256: instrumentSha,
    churnDefinitionsReusedFrom: 'scripts/probes/df-c0-defensive-brain-census.ts §R2 via '
      + 'df-t0-assignment-persistence.ts, df-t1-persistence-exam.ts and df-t3-surface-exam.ts '
      + '(Row accumulator, familyOf, DUP_RUN_M, latency bins, swarm radii, every '
      + 'numerator/denominator pair)',
    pressRealisationReusedFrom: 'scripts/probes/df-t3-surface-exam.ts §R2 (the offer/act/'
      + 'episode walker, definitions verbatim) — published in BOTH arms here',
    ryiDefinitionsReusedFrom: 'docs/world-model/R-YI-STANDING-GAP-TABLE.md §definitions '
      + '(Q01 · Q05 · Q06 · Q14), ported verbatim through '
      + 'scripts/probes/bk-t2-composition-exam.ts §(d) THE R-乙 SPELL WALKER',
    ladderMechanismReusedFrom: 'scripts/probes/df-c0-defensive-brain-census.ts §7(d) + '
      + 'DF-C0-FIX §RF1\'s ONE FORMULA (slopeDeltaThroughOneFormula), via df-t1 and df-t3',
    whatIsNew: 'THE ARMS (capOn vs capOff — the FIRST battery in which the Phase-31 cap is '
      + 'retired at all), the (ii) CONTAINMENT test against the cap-on arm\'s own interval, '
      + 'the chaser-count SHARE companions, and §3B\'s COMPOSITION FIXTURE PER WALK-SIDE '
      + 'PREDICATE (the walk\'s own classifiers are now named functions the fixtures call).',
  },
  walkSidePredicateFixtures: {
    note: 'canon VERBATIM: "a scored face\'s walk-side predicate is pinned — anchored '
      + 'extraction or fixture — because the re-derivation gate proves arithmetic, not '
      + 'definitions" (home DF-T3 §CORR item 2), REFINED at #334 item 2: "anchored extraction '
      + 'protects the source line; a headline-bearing walk-side predicate ALSO needs a '
      + 'composition fixture" (home BK-T3 §CORR item 2). Every fixture below calls THE SAME '
      + 'function the battery calls; a failure is a CONSTRUCTION-CLASS refusal (exit 3, '
      + 'nothing written).',
    predicates: ['familyOfAction', 'swarmBinOf', 'chaserBinOf', 'markTransitionOf',
      'containOffered', 'containActed'],
    cells: predFixtures,
    allHeld: PRED_FIXTURES_OK,
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
    markSwitch: 'DF-C0 §R2 VERBATIM — a defender-tick on which team.marks.get(index) is '
      + 'non-null now, was non-null last tick, and the two differ (the `markTransitionOf` '
      + 'classifier, fixture-pinned in §3B).',
    chaserCountBin: 'the number of members of `team.chasers` on an out-of-possession '
      + 'team-tick, clamped into 5 bins — bin 4 is "FOUR OR MORE" (the `chaserBinOf` '
      + 'classifier, fixture-pinned in §3B). DF-C0 §R2, DF-T2 §R6 and DF-T3 §R4 all published '
      + 'this bin as EXACTLY ZERO.',
    swarmStanceBin: `the number of the defending team's outfield bodies within `
      + `${SWARM_R_STANCE} m of the carrier, clamped into 6 bins — bin 5 is "FIVE OR MORE" `
      + '(the ordered first look).',
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
    doors: 'a4MatchFlags(9) + bkFacingLaw + bkContactLaw + dfAssignPersist + dfSurface — the '
      + 'H-DF.1-PASSING STACK — in BOTH arms',
    armDifference: 'dfCapOff only',
    arms: {
      capOn: 'the H-DF.1-passing stack with the shipped Phase-31 cap INTACT',
      capOff: 'the same stack with the cap\'s rule RETIRED IN THE ARM (DF-T4 commit 1\'s '
        + 'purely additive, flag-gated bypass; the shipped cap code is untouched)',
    },
    ladderWorld: 'the SHIPPED world (League — canon: worker fixtures play the SHIPPED world; '
      + 'League.toJSON omits matchFlags). The ladder is NOT world-9: it is the ecology.',
    ladderArmNotes: LADDER_ARM_NOTE,
  },
  capSeam: {
    note: '⚠⚠ DF-T2 §R6\'s cap-slice sha of record MOVED BY CONSTRUCTION at DF-T4 commit 1 — '
      + 'the bypass lives inside the sliced function. Ruling #336 item 5 replaced that '
      + 'discipline with an EXPLICIT PIN (the four-chaser bin is exactly zero with the flag '
      + 'off), which is gate `gCapOnBinFourZero` here and a permanent pin in '
      + 'tests/dfCapOff.test.ts. What remains sha-checked is stability THROUGH THE RUN.',
    dfT2HistoricalSha: CAP_SHA_DF_T2_HISTORICAL,
    shaBefore: capShaBefore,
    shaAfter: capShaAfter,
    shippedCapLines: shippedCapLineCounts,
    bypassLines: bypassLineCounts,
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    subRanges: {
      battery: `${BLOCK_BASE}–${BLOCK_BASE + N_SEEDS - 1} (${N_SEEDS} paired seeds)`,
      smokePrefix: `${BLOCK_BASE + 800}–${BLOCK_BASE + 802} (in band; also the pin suite's seeds)`,
      ladderLeagues: `${LADDER_SEEDS_ALL[0]}–${LADDER_SEEDS_ALL[3]} (booked once, walked in both arms)`,
      receipt: `${RECEIPT_SEED} (the xxx,999 world-construction receipt — WALKED)`,
    },
    booked: SEEDS,
    walked: seedsWalked,
    ladderSeeds: LADDER_SEEDS,
    bookedEqualsWalked: seedsWalked.length === SEEDS.length
      && SEEDS.every((s) => seedsWalked.includes(s))
      && seedsWalked.every((s) => SEEDS.includes(s)),
    bookedEqualsWalkedMethod: '⭐ #335 item 4\'s correction: the WALKED set is the DISTINCT '
      + 'seed set of the per-seed CELLS (`perSeedCells`), never a projection of the booked '
      + 'input — the two lists are compared in BOTH directions.',
    walksTotal: rows.length,
    blockConsumedWhole: `${BLOCK_BASE}–${BLOCK_BASE + 999} CONSUMED WHOLE of record`,
    nextSimBlock: 12_522_000,
  },
  stats: {
    basesConsumed: STATS_BASES_CONSUMED,
    step: STATS_STEP,
    registryEntries: STATS_PUBLISHED_BASES.length,
    registryComplete: REGISTRY_COMPLETE,
    registryCompletionMethod: 'the registry of record ENTERING this stage is 69 (#335 item 4 '
      + '"registry 69"; #336 item 4 "Stats ZERO — registry stays 69"), summed from the '
      + 'rulings\' own consumption items and never cached (#332 item 3\'s lesson): IN-C0\'s '
      + 'completed 56 + 114,200 + 114,400 + 114,600 + 114,800 + 115,000 + 115,200 + 115,400 '
      + '+ 115,600 + 115,800 + 116,000 + 116,200 + 116,400 (DF-T3B) + 116,600 (IN-T2B). THIS '
      + 'STAGE CONSUMES THREE bases, so the registry leaves at 72.',
    minGapToAnyPublishedBase: minStatsGap,
    nextBase: STATS_BASE + 3 * STATS_STEP,
    draw1: `${STATS_BASE} — the paired seed-clustered match-battery bootstrap`,
    draw2: `${STATS_BASE + STATS_STEP} — the ladder's league-clustered slope bootstrap`,
    draw3: `${STATS_BASE + 2 * STATS_STEP} — the WITHIN-ARM seed-clustered bootstrap that `
      + 'carries H-DF.4(ii)\'s containment test (both arms share this ONE resample index by '
      + 'construction)',
    bootstrapDraws: BOOTSTRAP,
  },
  anchoredExtractions: anchorReceipts,
  containWhyNeedle: { line: CONTAIN_WHY_LINE, occurrences: containWhyOccurrences },
  hdf4,
  stanceFive,
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
    note: 'the seam is TWO comparisons and one local read inside a function that already runs '
      + 'on the TEAM_AI_INTERVAL cadence, and it is dead with the flag off; no perf receipt is '
      + 'claimed or re-published here.',
  },
  wall: { batterySeconds: batteryWallSec, ladderSeconds: ladderWallSec },
  perSeedCells: rows,
  ladderCells,
  fingerprint: { ofRecord: FINGERPRINT_OF_RECORD, recomputed: fingerprintNow },
  srcTouched: {
    note: 'the SEAM landed in DF-T4 commit 1, BEFORE this instrument froze; at run time the '
      + 'worktree must match HEAD exactly (canon xSrcUntouched: git diff --stat HEAD -- src '
      + 'AND git status --porcelain -- src)',
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
  const dOn = dRows.filter((r) => r.arm === 'capOn');
  const dOff = dRows.filter((r) => r.arm === 'capOff');
  for (const [name, d] of Object.entries(FACES)) {
    const published = (onDisk.faces as FaceRow[]).find((f) => f.face === name)!;
    const b = round(ratio(sum(dOn.map(d.num)), sum(dOn.map(d.den))));
    const a = round(ratio(sum(dOff.map(d.num)), sum(dOff.map(d.den))));
    const dl = round(ratio(sum(dOff.map(d.num)), sum(dOff.map(d.den)))
      - ratio(sum(dOn.map(d.num)), sum(dOn.map(d.den))));
    checks += 3;
    if (!same(b, published.capOnValue)) mismatches.push(`face ${name} capOn ${b} vs ${published.capOnValue}`);
    if (!same(a, published.capOffValue)) mismatches.push(`face ${name} capOff ${a} vs ${published.capOffValue}`);
    if (!same(dl, published.delta)) mismatches.push(`face ${name} delta ${dl} vs ${published.delta}`);
  }
  for (const arm of ['capOn', 'capOff'] as const) {
    const dArm = dRows.filter((r) => r.arm === arm);
    const bins = Array.from({ length: LAT_BINS }, (_, bi) =>
      sum(dArm.map((r) => r.reTargetLatencyBins[bi])));
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
    const cb = Array.from({ length: CHASER_BINS }, (_, bi) =>
      sum(dArm.map((r) => r.chaserCountBins[bi])));
    checks += 1;
    if (JSON.stringify(cb) !== JSON.stringify((onDisk.chaserBins as Record<string, number[]>)[arm])) {
      mismatches.push(`chaserBins ${arm}`);
    }
  }
  for (const [k, arm, pick] of [
    ['capOnStance', 'capOn', (r: Row) => r.swarmStanceBins],
    ['capOffStance', 'capOff', (r: Row) => r.swarmStanceBins],
    ['capOnZone', 'capOn', (r: Row) => r.swarmZoneBins],
    ['capOffZone', 'capOff', (r: Row) => r.swarmZoneBins],
  ] as const) {
    const bins = Array.from({ length: SWARM_BINS }, (_, bi) =>
      sum(dRows.filter((r) => r.arm === arm).map((r) => pick(r)[bi])));
    checks += 1;
    if (JSON.stringify(bins) !== JSON.stringify((onDisk.swarmBins as Record<string, number[]>)[k])) {
      mismatches.push(`swarmBins ${k}`);
    }
  }
  /* ---- the ORDERED FIRST LOOK, off disk ---- */
  {
    const on5 = sum(dOn.map((r) => r.swarmStanceBins[5]));
    const off5 = sum(dOff.map((r) => r.swarmStanceBins[5]));
    const onDen = sum(dOn.map((r) => sum(r.swarmStanceBins)));
    const offDen = sum(dOff.map((r) => sum(r.swarmStanceBins)));
    checks += 6;
    if (on5 !== onDisk.stanceFive.capOnBinFive) mismatches.push('stanceFive/capOnBinFive');
    if (off5 !== onDisk.stanceFive.capOffBinFive) mismatches.push('stanceFive/capOffBinFive');
    if (onDen !== onDisk.stanceFive.capOnDenominator) mismatches.push('stanceFive/capOnDen');
    if (offDen !== onDisk.stanceFive.capOffDenominator) mismatches.push('stanceFive/capOffDen');
    if (!same(round(ratio(on5, onDen)), onDisk.stanceFive.capOnShare)) mismatches.push('stanceFive/capOnShare');
    if (!same(round(ratio(off5, offDen)), onDisk.stanceFive.capOffShare)) mismatches.push('stanceFive/capOffShare');
  }
  /* ---- H-DF.4's three limbs, recomputed off disk ---- */
  {
    const dChaser = onDisk.chaserBins as Record<string, number[]>;
    const r1 = dChaser.capOff[4] === 0;
    const pub = onDisk.hdf4;
    checks += 1;
    if (r1 !== pub.i_fourChaserBinZero.pass) mismatches.push('hdf4/i');
    const inside = (point: number, iv: Interval): boolean => insideInterval(point, iv);
    const r2 = inside(pub.ii_multiChaseInsideCapOnIntervals.multiChaseShare2.capOffPoint,
      pub.ii_multiChaseInsideCapOnIntervals.multiChaseShare2.capOnInterval)
      && inside(pub.ii_multiChaseInsideCapOnIntervals.multiChaseShare3.capOffPoint,
        pub.ii_multiChaseInsideCapOnIntervals.multiChaseShare3.capOnInterval);
    checks += 1;
    if (r2 !== pub.ii_multiChaseInsideCapOnIntervals.pass) mismatches.push('hdf4/ii');
    const r3 = pub.iii_churnDoesNotDegrade.faces.every((f) =>
      !(f.resolved && f.direction === f.badDirection));
    checks += 1;
    if (r3 !== pub.iii_churnDoesNotDegrade.pass) mismatches.push('hdf4/iii');
    checks += 1;
    const expectVerdict = r1 && r2 && r3 ? 'PASS' : `FAIL — ${[
      r1 ? null : '(i)', r2 ? null : '(ii)', r3 ? null : '(iii)',
    ].filter((x) => x !== null).join(' and ')}`;
    if (expectVerdict !== pub.verdict) mismatches.push('hdf4/verdict');
    /* and the containment points themselves, from the cells */
    for (const [name, block] of [
      ['multiChaseShare2', pub.ii_multiChaseInsideCapOnIntervals.multiChaseShare2],
      ['multiChaseShare3', pub.ii_multiChaseInsideCapOnIntervals.multiChaseShare3],
    ] as const) {
      const d = FACES[name];
      checks += 1;
      if (!same(round(ratio(sum(dOff.map(d.num)), sum(dOff.map(d.den)))), block.capOffPoint)) {
        mismatches.push(`hdf4/ii/${name}/capOffPoint`);
      }
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
  const bs = (onDisk.ladder.slopes as LadderSlope[]).find((s) => s.arm === 'liveCapOn' && s.face === 'goals')!;
  const as2 = (onDisk.ladder.slopes as LadderSlope[]).find((s) => s.arm === 'liveCapOff' && s.face === 'goals')!;
  checks += 4;
  if (!same(round(bs.delta - ATK_FROZEN_FLOOR), onDisk.ladder.floorRead.capOnDistanceAboveFloor)) mismatches.push('floorRead/capOn');
  if (!same(round(as2.delta - ATK_FROZEN_FLOOR), onDisk.ladder.floorRead.capOffDistanceAboveFloor)) mismatches.push('floorRead/capOff');
  if (!same(round(as2.delta - bs.delta), onDisk.ladder.floorRead.capOffMinusCapOn)) mismatches.push('floorRead/capOffMinusCapOn');
  if ((as2.delta < bs.delta) !== onDisk.ladder.floorRead.bendsTowardFloor) mismatches.push('floorRead/bendsTowardFloor');
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
banner(`\nH-DF.4 = ${hdf4.verdict}`);
banner(`  (i)   chaserBins capOn=[${chaserBins.capOn.join(', ')}] capOff=[${chaserBins.capOff.join(', ')}]`);
banner(`  (ii)  mc2 capOn ${cMc2.capOnInterval.value} [${cMc2.capOnInterval.ciLo}, ${cMc2.capOnInterval.ciHi}]`
  + ` ← capOff ${cMc2.capOffPoint} inside=${cMc2.inside}`);
banner(`        mc3 capOn ${cMc3.capOnInterval.value} [${cMc3.capOnInterval.ciLo}, ${cMc3.capOnInterval.ciHi}]`
  + ` ← capOff ${cMc3.capOffPoint} inside=${cMc3.inside}`);
banner(`  (iii) switches ${fSwitch.capOnValue}→${fSwitch.capOffValue} (${fSwitch.direction})`
  + ` · held ${fHeld.capOnValue}→${fHeld.capOffValue} (${fHeld.direction})`
  + ` · dup ${fDup.capOnValue}→${fDup.capOffValue} (${fDup.direction})`);
banner(`first look: ≥5-body stance bin capOn=${stanceFive.capOnBinFive} capOff=${stanceFive.capOffBinFive}`
  + ` (of ${stanceFive.capOnDenominator} / ${stanceFive.capOffDenominator})`);
banner(`ladder goals slope: capOn ${onGoalSlope.delta} vs capOff ${offGoalSlope.delta}`
  + `  floor ${ATK_FROZEN_FLOOR}`);
banner(`re-derivation: ${checks} checks, ${mismatches.length} mismatches`);
process.exit(ALL_GREEN ? 0 : 1);
