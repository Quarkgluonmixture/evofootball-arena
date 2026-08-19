#!/usr/bin/env tsx
/**
 * ============================================================================
 * DF-C0-FIX — THE SLOPE-FORMULA CURE (no sim re-runs; the stored cells stand)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #320 item 1. A FIX GENERATION of the PUBLISH/VERIFY
 * arithmetic of `scripts/probes/df-c0-defensive-brain-census.ts` (frozen `61deb21`,
 * results `473fe3a`). The frozen probe is NOT edited and NOT re-run: every measured cell
 * (250 world-9 walks · 240 league-season cells · 17,040 matches) is carried BIT-EXACT
 * out of the RED side-path artifact. SEEDS: NONE. STATS BASES: NONE. `src/**`: untouched.
 *
 * WHAT WAS BROKEN (DF-C0 §R0):
 *   the frozen probe PUBLISHES a ladder slope's `delta` as the mean of the four
 *   per-league `late − early` deltas — `const delta = mean(perLeague.map((p) => p.delta));`
 *   — while its own on-disk re-derivation recomputes it as `round(l - e)` where `l` and
 *   `e` are the ALREADY-ROUNDED league-mean levels. The two are algebraically identical
 *   and differ only in floating-point association plus one rounding step, so 2 of 15
 *   slope deltas disagreed at 1 × 10⁻⁶ and `gFacesFromDisk` went RED. Nothing measured
 *   was wrong; the CRITERION was two formulas wearing one name.
 *
 * WHAT IS FIXED HERE, AND ONLY THIS — ⭐ ONE FORMULA, BOTH SIDES:
 *   `slopeDelta = mean(per-league (late − early))` is adopted as THE formula and is
 *   applied on the PUBLISH side and on the RE-DERIVATION side through THE SAME function
 *   (`slopeDeltaThroughOneFormula`). It is the PRE-REGISTERED ESTIMAND, and the choice is
 *   forced rather than free: the league-clustered bootstrap that produces every slope's
 *   `ciLo`/`ciHi`/`halfWidth` resamples PER-LEAGUE DELTAS and means them, so the
 *   mean-of-deltas is the only point estimate consistent with its own interval. The
 *   rejected alternative (`round(late) - round(early)`) would have imported a rounding
 *   artifact into the estimand.
 *
 * ⭐ THE MEASURED CONSEQUENCE, STATED BEFORE THE RECEIPT: because the PUBLISH side was
 * ALREADY the estimand, adopting it changes ZERO published measurement fields. The two
 * values that move are on the RE-DERIVATION side (`1.20176 → 1.201761` and
 * `0.290846 → 0.290845` — the re-derived defFrozen tackles/clearances deltas now landing
 * on the published estimand). The dispatch anticipated the two 1e-6 moves on the publish
 * side; measurement says the publish side was already right and the verifier was the
 * drifting copy. `gDriftBounded` asserts BOTH halves: the changed-field set inside the
 * hashed body is EXACTLY {`gates.gFacesFromDisk`}, and ZERO numeric field anywhere in the
 * hashed body moves at 5 decimal places.
 *
 * WHAT IS DELIBERATELY UNCHANGED: every cell, every churn face, both stored-bin
 * percentiles, all 8 × 3 × 20 per-generation ladder faces, every slope level, every
 * bootstrap interval, the inventory, the gap analysis, the sizing, the seed/stats books.
 * They are carried out of the RED artifact and — for every FACE — RE-DERIVED from the
 * carried cells and asserted bit-identical (`gPublishedFacesReproduced`), so nothing is
 * copied on trust.
 *
 * THE RED-RUN DISCIPLINE: this probe writes a STAGING path, re-derives off THAT file, and
 * only RENAMES onto the canonical path when every gate is green. A red fix run therefore
 * cannot touch the artifact of record.
 *
 * RUN: `npx tsx scripts/probes/df-c0-fix-slope-formula.ts`  (no env, no seeds, ~1 s)
 */
import { readFileSync, writeFileSync, mkdirSync, renameSync, existsSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { DT, MATCH_DURATION } from '../../src/sim/constants';

const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const sha256 = (s: string): string => createHash('sha256').update(s).digest('hex');
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }).trim(); } catch { return ''; }
};

const SELF_PATH = 'scripts/probes/df-c0-fix-slope-formula.ts';
const FROZEN_PROBE = 'scripts/probes/df-c0-defensive-brain-census.ts';
const RED_PATH = 'docs/world-model/data/df-c0-defensive-brain-census.RED.json';
const CANON_PATH = 'docs/world-model/data/df-c0-defensive-brain-census.json';
const STAGE_PATH = 'docs/world-model/data/df-c0-fix-slope-formula.staging.json';

/** the pins of record, quoted from DF-C0 §RESULTS / §R0 (never re-measured into agreement) */
const RED_BYTES_SHA = 'ca7d0f65682001823b7fef1ddac8c84af25bf9370b5656b83681802332d85723';
const RED_BODY_SHA = 'da540e1febb554ef485bcb878e37e53b275168fbff7fd1d5a1a24d939f97239c';
const FROZEN_INSTRUMENT_SHA = '7b47b7e9077840fa8264fe85c5338ffbacc8a5265d48bdcb0484c55446e8a530';
const RED_MISMATCHES_PINNED = [
  'slope defFrozen/tackles delta: 1.20176 ≠ 1.201761',
  'slope defFrozen/clearances delta: 0.290846 ≠ 0.290845',
] as const;
const FREEZE_COMMIT = '61deb212a43f7f36a65284058fc17fdc02a233d0';

/* ========================================================================== */
/* §1 THE FROZEN ARITHMETIC — copied byte-verbatim, drift-gated below          */
/* ========================================================================== */
/**
 * Every helper and every face accessor below is COPIED BYTE-VERBATIM from the frozen
 * probe and the copy is GATED: `gOneFormula` re-reads the frozen file at run time and
 * requires each snippet to occur EXACTLY ONCE, so this file cannot silently drift into a
 * redefinition of the instrument. THE ONE FORMULA is itself one of the gated snippets —
 * the estimand adopted here is literally the frozen probe's own publish line.
 */
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const ratio = (a: number, b: number): number => (b === 0 ? Number.NaN : a / b);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((a, b) => a + b, 0) / xs.length);

interface Row {
  seed: number; worldOk: boolean; ticks: number; defTeamTicks: number; defenderTicks: number;
  markSwitches: number; markAbandons: number; markStarts: number;
  chaseStarts: number; chaseAbandons: number; markHeldTicks: number;
  reTargetLatencyBins: number[]; reTargetLatencyCount: number; reTargetLatencyTickSum: number;
  markPairTicks: number; dupMarkTicks: number;
  multiChase2Ticks: number; multiChase3Ticks: number;
  swarmStanceBins: number[]; swarmZoneBins: number[]; chaserCountBins: number[];
  goals: number; tackles: number; interceptions: number;
}
interface LadderCell {
  arm: string; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; xg: number; tackles: number; interceptions: number;
  clearances: number; blocks: number; passes: number; passesCompleted: number;
}

const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;
const defenderMatches = (r: Row): number => (r.defenderTicks * DT) / MATCH_DURATION;

interface FaceAccessor { num: (r: Row) => number; den: (r: Row) => number; verbatim: string }
/** the 15 churn faces: accessor pairs copied verbatim from the frozen `CHURN_FACES` */
const CHURN_ACCESSORS: Record<string, FaceAccessor> = {
  markSwitchesPerDefenderMinute: {
    num: (r) => r.markSwitches, den: defenderMinutes,
    verbatim: 'num: (r) => r.markSwitches, den: defenderMinutes,',
  },
  markSwitchesPerDefenderMatch: {
    num: (r) => r.markSwitches, den: defenderMatches,
    verbatim: 'num: (r) => r.markSwitches, den: defenderMatches,',
  },
  markAbandonsPerDefenderMinute: {
    num: (r) => r.markAbandons, den: defenderMinutes,
    verbatim: 'num: (r) => r.markAbandons, den: defenderMinutes,',
  },
  markStartsPerDefenderMinute: {
    num: (r) => r.markStarts, den: defenderMinutes,
    verbatim: 'num: (r) => r.markStarts, den: defenderMinutes,',
  },
  chaseStartsPerDefenderMinute: {
    num: (r) => r.chaseStarts, den: defenderMinutes,
    verbatim: 'num: (r) => r.chaseStarts, den: defenderMinutes,',
  },
  chaseAbandonsPerDefenderMinute: {
    num: (r) => r.chaseAbandons, den: defenderMinutes,
    verbatim: 'num: (r) => r.chaseAbandons, den: defenderMinutes,',
  },
  markHeldShare: {
    num: (r) => r.markHeldTicks, den: (r) => r.defenderTicks,
    verbatim: 'num: (r) => r.markHeldTicks, den: (r) => r.defenderTicks,',
  },
  dupMarkShare: {
    num: (r) => r.dupMarkTicks, den: (r) => r.markPairTicks,
    verbatim: 'num: (r) => r.dupMarkTicks, den: (r) => r.markPairTicks,',
  },
  multiChaseShare2: {
    num: (r) => r.multiChase2Ticks, den: (r) => r.defTeamTicks,
    verbatim: 'num: (r) => r.multiChase2Ticks, den: (r) => r.defTeamTicks,',
  },
  multiChaseShare3: {
    num: (r) => r.multiChase3Ticks, den: (r) => r.defTeamTicks,
    verbatim: 'num: (r) => r.multiChase3Ticks, den: (r) => r.defTeamTicks,',
  },
  swarmStanceShare2: {
    num: (r) => sum(r.swarmStanceBins.slice(2)), den: (r) => sum(r.swarmStanceBins),
    verbatim: 'num: (r) => sum(r.swarmStanceBins.slice(2)), den: (r) => sum(r.swarmStanceBins),',
  },
  swarmZoneShare3: {
    num: (r) => sum(r.swarmZoneBins.slice(3)), den: (r) => sum(r.swarmZoneBins),
    verbatim: 'num: (r) => sum(r.swarmZoneBins.slice(3)), den: (r) => sum(r.swarmZoneBins),',
  },
  reTargetLatencyMeanS: {
    num: (r) => r.reTargetLatencyTickSum * DT, den: (r) => r.reTargetLatencyCount,
    verbatim: 'num: (r) => r.reTargetLatencyTickSum * DT, den: (r) => r.reTargetLatencyCount,',
  },
  goalsPerMatch: {
    num: (r) => r.goals, den: () => 1,
    verbatim: 'num: (r) => r.goals, den: () => 1,',
  },
  tacklesPlusInterceptionsPerMatch: {
    num: (r) => r.tackles + r.interceptions, den: () => 1,
    verbatim: 'num: (r) => r.tackles + r.interceptions, den: () => 1,',
  },
};

const LADDER_SLOPE_FACES = ['goals', 'tackles', 'interceptions', 'shots', 'clearances'] as const;
type SlopeFace = (typeof LADDER_SLOPE_FACES)[number];
const numOf = (c: LadderCell, f: SlopeFace): number =>
  (f === 'goals' ? c.goals : f === 'tackles' ? c.tackles : f === 'interceptions'
    ? c.interceptions : f === 'shots' ? c.shots : c.clearances);
const denOf = (c: LadderCell, f: SlopeFace): number =>
  (f === 'goals' ? c.matches : c.matches * 2);

/** the per-league early/late levels a slope is built from (frozen expressions, verbatim) */
const perLeagueLevels = (cells: readonly LadderCell[], arm: string, leagueSeed: number,
  f: SlopeFace, earlyGens: number, lateFrom: number): { early: number; late: number; delta: number } => {
  const cs = cells.filter((c) => c.arm === arm && c.leagueSeed === leagueSeed);
  const early = cs.filter((c) => c.generation <= earlyGens);
  const late = cs.filter((c) => c.generation >= lateFrom);
  const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));
  const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));
  return { early: e, late: l, delta: l - e };
};

/**
 * ⭐⭐ THE ONE FORMULA. Called by the PUBLISH side (§4) and by the RE-DERIVATION side (§6)
 * — the same function, so the two can no longer drift apart by construction. This is the
 * cure: not a new number, a single home for the number.
 */
const slopeDeltaThroughOneFormula = (
  perLeague: ReadonlyArray<{ early: number; late: number; delta: number }>,
): number => mean(perLeague.map((p) => p.delta));

/** the frozen snippets `gOneFormula` requires to resolve EXACTLY ONCE in the frozen probe */
const VERBATIM_SNIPPETS: ReadonlyArray<readonly [string, string]> = [
  ['sum', 'const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);'],
  ['round', 'const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);'],
  ['ratio', 'const ratio = (a: number, b: number): number => (b === 0 ? Number.NaN : a / b);'],
  ['mean', 'const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN\n  : xs.reduce((a, b) => a + b, 0) / xs.length);'],
  ['defenderMinutes', 'const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;'],
  ['defenderMatches', 'const defenderMatches = (r: Row): number => (r.defenderTicks * DT) / MATCH_DURATION;'],
  ['slopeFaceList', "const LADDER_SLOPE_FACES = ['goals', 'tackles', 'interceptions', 'shots', 'clearances'] as const;"],
  ['numOf', "const numOf = (c: LadderCell, f: (typeof LADDER_SLOPE_FACES)[number]): number =>\n  (f === 'goals' ? c.goals : f === 'tackles' ? c.tackles : f === 'interceptions'\n    ? c.interceptions : f === 'shots' ? c.shots : c.clearances);"],
  ['denOf', "const denOf = (c: LadderCell, f: (typeof LADDER_SLOPE_FACES)[number]): number =>\n  (f === 'goals' ? c.matches : c.matches * 2);"],
  ['perLeagueEarly', 'const early = cs.filter((c) => c.generation <= EARLY_GENS);'],
  ['perLeagueLate', 'const late = cs.filter((c) => c.generation >= LATE_FROM);'],
  ['perLeagueE', 'const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));'],
  ['perLeagueL', 'const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));'],
  ['perLeagueReturn', 'return { early: e, late: l, delta: l - e };'],
  ['THE ONE FORMULA', 'const delta = mean(perLeague.map((p) => p.delta));'],
  ['slopeLevelsPublished', 'early: round(mean(perLeague.map((p) => p.early))),\n      late: round(mean(perLeague.map((p) => p.late))),'],
  ['genGoals', 'goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), matches)),'],
  ['genXg', 'xgPerTeamMatch: round(ratio(sum(cs.map((c) => c.xg)), teamMatches)),'],
  ['genTackles', 'tacklesPerTeamMatch: round(ratio(sum(cs.map((c) => c.tackles)), teamMatches)),'],
  ['genInterceptions', 'interceptionsPerTeamMatch: round(ratio(sum(cs.map((c) => c.interceptions)), teamMatches)),'],
  ['genClearances', 'clearancesPerTeamMatch: round(ratio(sum(cs.map((c) => c.clearances)), teamMatches)),'],
  ['genBlocks', 'blocksPerTeamMatch: round(ratio(sum(cs.map((c) => c.blocks)), teamMatches)),'],
  ['genPassCompletion', 'passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),'],
  ['genPerLeagueGoals', 'perLeagueGoalsPerMatch: cs.map((c) => round(ratio(c.goals, c.matches))),'],
  ...Object.entries(CHURN_ACCESSORS).map(([k, v]) => [k, v.verbatim] as const),
];
/** ⭐ THE DEFECT RECEIPT: the SECOND formula, quoted from the frozen verifier it lived in */
const DEFECT_SNIPPET = 'if (!Object.is(round(l - e), s.delta)) {';

/* ========================================================================== */
/* §2 THE GUARDS — refuse BEFORE anything is written                           */
/* ========================================================================== */
const FROZEN_SRC = readFileSync(FROZEN_PROBE, 'utf8');
const RED_RAW = readFileSync(RED_PATH, 'utf8');

const occurrencesOf = (hay: string, needle: string): number => {
  let n = 0;
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) n += 1;
  return n;
};
/**
 * Occurrence COUNTS are published per snippet, not asserted to be 1: the frozen probe
 * legitimately writes the per-league level expressions TWICE (once on its publish side,
 * once inside its own on-disk verifier) — that duplication is exactly the defect this fix
 * cures. The gate is `resolved` (≥ 1 verbatim occurrence); the counts are the receipt, so
 * any drift in the frozen file surfaces as a count change.
 */
const snippetReport = VERBATIM_SNIPPETS.map(([id, text]) => ({
  id, bytes: Buffer.byteLength(text, 'utf8'), occurrences: occurrencesOf(FROZEN_SRC, text),
}));
const defectSnippetOccurrences = occurrencesOf(FROZEN_SRC, DEFECT_SNIPPET);
const gOneFormula = snippetReport.every((s) => s.occurrences >= 1)
  && defectSnippetOccurrences === 1;

const srcPorcelain = gitOut(['status', '--porcelain', '--', 'src']);
const srcDiffStat = gitOut(['diff', '--stat', 'HEAD', '--', 'src']);
const gSrcUntouched = srcPorcelain === '' && srcDiffStat === '';

const frozenSha = sha256(FROZEN_SRC);
const redBytesSha = sha256(RED_RAW);
const RED = JSON.parse(RED_RAW) as {
  probe: string; stage: string; orderedBy: string; mode: string; isOverrideRun: boolean;
  git: { head: string; srcStatusPorcelain: string; srcDiffStatHead: string };
  instrumentSha256: string; hashSchema: string[]; bodySha256: string;
  allGreen: boolean; gates: Record<string, boolean>; faceReDerivationMismatches: string[];
  luanpaoDiagnosis: {
    clock: { dt: number; matchDurationSeconds: number };
    latencyBins: { bins: number; binSeconds: number; pooled: number[]; total: number;
      medianFromBinsSeconds: number; p90FromBinsSeconds: number };
    faces: Array<{ face: string; value: number; numerator: number; denominator: number }>;
  };
  seasonLadder: {
    generations: number; leagueSeeds: number[];
    perGenerationFaces: Array<Record<string, number | number[] | string>>;
    earlyLateSlopes: Array<{ arm: string; face: string; early: number; late: number;
      delta: number; ciLo: number; ciHi: number; halfWidth: number;
      ratioToHalfWidth: number; earlyGens: string; lateGens: string; leagues: number }>;
  };
  perSeedCells: Row[];
  ladderCells: LadderCell[];
};

const gFrozenInstrumentUnmoved = frozenSha === FROZEN_INSTRUMENT_SHA
  && RED.instrumentSha256 === FROZEN_INSTRUMENT_SHA;
const gRedSourceBytes = redBytesSha === RED_BYTES_SHA && RED.bodySha256 === RED_BODY_SHA;
const redGateNames = Object.keys(RED.gates);
const gRedWasRedForExactlyThisReason = RED.allGreen === false
  && RED.gates.gFacesFromDisk === false
  && redGateNames.filter((g) => g !== 'gFacesFromDisk').every((g) => RED.gates[g] === true)
  && RED.faceReDerivationMismatches.length === RED_MISMATCHES_PINNED.length
  && RED_MISMATCHES_PINNED.every((m, i) => RED.faceReDerivationMismatches[i] === m)
  && RED.mode === 'full' && RED.isOverrideRun === false
  && RED.git.head === FREEZE_COMMIT;
const gClockMatchesSrc = RED.luanpaoDiagnosis.clock.dt === DT
  && RED.luanpaoDiagnosis.clock.matchDurationSeconds === MATCH_DURATION;

const REFUSALS: string[] = [];
if (!gSrcUntouched) REFUSALS.push(`src is DIRTY: ${srcPorcelain} ${srcDiffStat}`);
if (!gFrozenInstrumentUnmoved) REFUSALS.push(`frozen instrument moved: ${frozenSha}`);
if (!gRedSourceBytes) REFUSALS.push(`RED artifact bytes/body hash moved: ${redBytesSha}`);
if (!gRedWasRedForExactlyThisReason) REFUSALS.push('RED artifact is not the pinned red run');
if (!gClockMatchesSrc) REFUSALS.push('clock drift between src constants and the stored cells');
if (!gOneFormula) {
  REFUSALS.push(`frozen arithmetic drifted: ${snippetReport
    .filter((s) => s.occurrences < 1).map((s) => s.id).join(', ')} `
    + `(defect snippet occurrences ${defectSnippetOccurrences}, expected 1)`);
}
if (REFUSALS.length > 0) {
  banner('=== DF-C0-FIX REFUSES TO RUN (nothing written) ===');
  for (const r of REFUSALS) banner(`  · ${r}`);
  process.exit(2);
}

/* ========================================================================== */
/* §3 THE WINDOWS — read out of the RED artifact, never retyped                */
/* ========================================================================== */
const LADDER_GENS = RED.seasonLadder.generations;
const LADDER_SEEDS = RED.seasonLadder.leagueSeeds;
const EARLY_GENS = Math.min(5, LADDER_GENS);
const LATE_FROM = Math.max(1, LADDER_GENS - EARLY_GENS + 1);
const LAT_BINS = RED.luanpaoDiagnosis.latencyBins.bins;
const LAT_BIN_S = RED.luanpaoDiagnosis.latencyBins.binSeconds;

/* ========================================================================== */
/* §4 RE-PUBLISH — every face recomputed from the carried cells                */
/* ========================================================================== */
const rows = RED.perSeedCells;
const cells = RED.ladderCells;
const reproMismatches: string[] = [];

/* (a) the 15 churn faces */
for (const [name, acc] of Object.entries(CHURN_ACCESSORS)) {
  const published = RED.luanpaoDiagnosis.faces.find((f) => f.face === name);
  if (published === undefined) { reproMismatches.push(`${name}: MISSING from the RED artifact`); continue; }
  const num = sum(rows.map(acc.num));
  const den = sum(rows.map(acc.den));
  if (!Object.is(round(ratio(num, den)), published.value)) {
    reproMismatches.push(`${name}: ${round(ratio(num, den))} ≠ ${published.value}`);
  }
  if (!Object.is(round(num), published.numerator) || !Object.is(round(den), published.denominator)) {
    reproMismatches.push(`${name} num/den: ${round(num)}/${round(den)} ≠ `
      + `${published.numerator}/${published.denominator}`);
  }
}
if (RED.luanpaoDiagnosis.faces.length !== Object.keys(CHURN_ACCESSORS).length) {
  reproMismatches.push(`face count: ${RED.luanpaoDiagnosis.faces.length} published vs `
    + `${Object.keys(CHURN_ACCESSORS).length} accessors`);
}

/* (b) the percentile face from the STORED BINS */
const latPooled = Array.from({ length: LAT_BINS }, (_, b) =>
  sum(rows.map((r) => r.reTargetLatencyBins[b])));
const latTotal = sum(latPooled);
const latQ = (p: number): number => {
  if (latTotal === 0) return Number.NaN;
  let acc = 0;
  for (let b = 0; b < LAT_BINS; b++) {
    acc += latPooled[b];
    if (acc >= p * latTotal) return (b + 1) * LAT_BIN_S;
  }
  return LAT_BINS * LAT_BIN_S;
};
{
  const lb = RED.luanpaoDiagnosis.latencyBins;
  if (JSON.stringify(latPooled) !== JSON.stringify(lb.pooled)) reproMismatches.push('latency pooled bins mismatch');
  if (latTotal !== lb.total) reproMismatches.push('latency bin total mismatch');
  if (!Object.is(round(latQ(0.5)), lb.medianFromBinsSeconds)) reproMismatches.push('latency median mismatch');
  if (!Object.is(round(latQ(0.9)), lb.p90FromBinsSeconds)) reproMismatches.push('latency p90 mismatch');
}

/* (c) every per-generation ladder face */
for (const lf of RED.seasonLadder.perGenerationFaces) {
  const cs = cells.filter((c) => c.arm === lf.arm && c.generation === lf.generation);
  const matches = sum(cs.map((c) => c.matches));
  const teamMatches = matches * 2;
  const check: Array<[string, number | number[], number | number[] | string]> = [
    ['goalsPerMatch', round(ratio(sum(cs.map((c) => c.goals)), matches)), lf.goalsPerMatch],
    ['shotsPerTeamMatch', round(ratio(sum(cs.map((c) => c.shots)), teamMatches)), lf.shotsPerTeamMatch],
    ['shotsConcededPerTeamMatch', round(ratio(sum(cs.map((c) => c.shots)), teamMatches)),
      lf.shotsConcededPerTeamMatch],
    ['xgPerTeamMatch', round(ratio(sum(cs.map((c) => c.xg)), teamMatches)), lf.xgPerTeamMatch],
    ['tacklesPerTeamMatch', round(ratio(sum(cs.map((c) => c.tackles)), teamMatches)), lf.tacklesPerTeamMatch],
    ['interceptionsPerTeamMatch', round(ratio(sum(cs.map((c) => c.interceptions)), teamMatches)),
      lf.interceptionsPerTeamMatch],
    ['clearancesPerTeamMatch', round(ratio(sum(cs.map((c) => c.clearances)), teamMatches)),
      lf.clearancesPerTeamMatch],
    ['blocksPerTeamMatch', round(ratio(sum(cs.map((c) => c.blocks)), teamMatches)), lf.blocksPerTeamMatch],
    ['passCompletion', round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),
      lf.passCompletion],
    ['matches', matches, lf.matches],
    ['leagues', cs.length, lf.leagues],
    ['perLeagueGoalsPerMatch', cs.map((c) => round(ratio(c.goals, c.matches))), lf.perLeagueGoalsPerMatch],
  ];
  for (const [n, a, b] of check) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      reproMismatches.push(`ladder ${String(lf.arm)} gen${String(lf.generation)} ${n}: `
        + `${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
    }
  }
}

/* (d) ⭐ THE SLOPES — levels re-derived, deltas RE-PUBLISHED THROUGH THE ONE FORMULA */
interface MovedField { field: string; from: number; to: number; absDelta: number }
const publishMoves: MovedField[] = [];
const rePublishedSlopes = RED.seasonLadder.earlyLateSlopes.map((s) => {
  const f = s.face as SlopeFace;
  const perLeague = LADDER_SEEDS.map((ls) => perLeagueLevels(cells, s.arm, ls, f, EARLY_GENS, LATE_FROM));
  const early = round(mean(perLeague.map((p) => p.early)));
  const late = round(mean(perLeague.map((p) => p.late)));
  const delta = round(slopeDeltaThroughOneFormula(perLeague));
  if (!Object.is(early, s.early) || !Object.is(late, s.late)) {
    reproMismatches.push(`slope ${s.arm}/${s.face} levels: ${early}/${late} ≠ ${s.early}/${s.late}`);
  }
  if (!Object.is(delta, s.delta)) {
    publishMoves.push({ field: `seasonLadder.earlyLateSlopes[${s.arm}/${s.face}].delta`,
      from: s.delta, to: delta, absDelta: Math.abs(delta - s.delta) });
  }
  const ratioToHalfWidth = round(Math.abs(delta) / s.halfWidth, 3);
  if (!Object.is(ratioToHalfWidth, s.ratioToHalfWidth)) {
    publishMoves.push({ field: `seasonLadder.earlyLateSlopes[${s.arm}/${s.face}].ratioToHalfWidth`,
      from: s.ratioToHalfWidth, to: ratioToHalfWidth,
      absDelta: Math.abs(ratioToHalfWidth - s.ratioToHalfWidth) });
  }
  return { ...s, early, late, delta, ratioToHalfWidth };
});
const gPublishedFacesReproduced = reproMismatches.length === 0;

/* ========================================================================== */
/* §5 THE CANONICAL ARTIFACT — cells carried, faces re-published, gates green   */
/* ========================================================================== */
/**
 * ⭐ THE RE-DERIVATION SIDE IS THE SIDE THAT MOVED. The publish side already WAS the
 * estimand, so the values that change are the two the frozen verifier used to compute
 * with its second formula. Both are named here as receipts of record.
 */
const REDERIVATION_MOVES = RED.faceReDerivationMismatches.map((m) => {
  const mm = /^slope (\S+) delta: (\S+) ≠ (\S+)$/.exec(m);
  return mm === null ? { field: m, from: Number.NaN, to: Number.NaN }
    : { field: `reDerived(${mm[1]}).delta`, from: Number(mm[2]), to: Number(mm[3]) };
});

const fixNote = {
  orderedBy: 'COMMANDER RULING #320 item 1 (DF-C0-FIX)',
  fixInstrument: SELF_PATH,
  fixInstrumentSha256: sha256(readFileSync(SELF_PATH, 'utf8')),
  frozenInstrument: FROZEN_PROBE,
  frozenInstrumentSha256: frozenSha,
  sourceArtifact: RED_PATH,
  sourceArtifactBytesSha256: redBytesSha,
  sourceArtifactBodySha256: RED.bodySha256,
  simRerun: false,
  seedsConsumed: 0,
  statsBasesConsumed: 0,
  theOneFormula: 'slopeDelta = mean(per-league (late − early)) — the PRE-REGISTERED estimand '
    + '(the league-clustered bootstrap resamples per-league deltas, so this is the only point '
    + 'estimate consistent with its own interval); applied on the PUBLISH side and the '
    + 'RE-DERIVATION side through ONE function, `slopeDeltaThroughOneFormula`',
  formulaRejected: 'round(mean(late levels)) − round(mean(early levels)) — the frozen '
    + "verifier's second formula; rejected because it imports a rounding step into the "
    + 'estimand and disagrees with the bootstrap that builds the interval',
  defectSnippetInFrozenProbe: DEFECT_SNIPPET,
  defectSnippetOccurrences,
  verbatimSnippets: snippetReport,
  changedFieldsInHashedBody: [] as string[],
  publishedMeasurementFieldsChanged: publishMoves,
  reDerivationValuesMoved: REDERIVATION_MOVES,
  unchanged: 'every perSeedCells / ladderCells cell carried BIT-EXACT out of the RED '
    + 'artifact; every churn face, both stored-bin percentiles, all per-generation ladder '
    + 'faces and every slope level RE-DERIVED from those cells and asserted identical; every '
    + 'bootstrap interval carried (a deterministic function of the same cells and the same '
    + 'stats bases — no draw was re-taken)',
  facesOfRecord: 'the DF-C0 faces become GATED-OF-RECORD with this artifact (they were '
    + 'REPORTED-not-of-record while gFacesFromDisk was red)',
};

const fixGatesPre = {
  gSrcUntouched,
  gFrozenInstrumentUnmoved,
  gRedSourceBytes,
  gRedWasRedForExactlyThisReason,
  gClockMatchesSrc,
  gOneFormula,
  gPublishedFacesReproduced,
};

const buildArtifact = (
  gFacesFromDisk: boolean, mismatches: string[], changedFields: string[],
  gDriftBounded: boolean, gCellsCarriedBitExact: boolean,
): Record<string, unknown> => {
  const gates = { ...RED.gates, gFacesFromDisk };
  const body = {
    ...RED,
    seasonLadder: { ...RED.seasonLadder, earlyLateSlopes: rePublishedSlopes },
    gates,
    allGreen: Object.values(gates).every(Boolean)
      && Object.values({ ...fixGatesPre, gCellsCarriedBitExact, gDriftBounded }).every(Boolean),
    faceReDerivationMismatches: mismatches,
    fix: {
      ...fixNote,
      changedFieldsInHashedBody: changedFields,
      gates: { ...fixGatesPre, gCellsCarriedBitExact, gDriftBounded },
      run: {
        head: gitOut(['rev-parse', 'HEAD']),
        srcStatusPorcelain: srcPorcelain,
        srcDiffStatHead: srcDiffStat,
      },
    },
  };
  const hashBody = Object.fromEntries(RED.hashSchema.map((k) =>
    [k, (body as unknown as Record<string, unknown>)[k]]));
  return { ...body, bodySha256: sha256(JSON.stringify(hashBody)) };
};

/* ---- the changed-field audit over the HASHED BODY (RED vs canonical) ---- */
const walk = (v: unknown, path: string, out: Map<string, unknown>): void => {
  if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${path}[${i}]`, out)); return; }
  if (v !== null && typeof v === 'object') {
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) walk(x, `${path}.${k}`, out);
    return;
  }
  out.set(path, v);
};
const flatOf = (a: Record<string, unknown>): Map<string, unknown> => {
  const out = new Map<string, unknown>();
  for (const k of RED.hashSchema) walk(a[k], k, out);
  return out;
};
const draft = buildArtifact(true, [], [], true, true);
const flatRed = flatOf(RED as unknown as Record<string, unknown>);
const flatNew = flatOf(draft);
const changedFields: string[] = [];
const movedAt5dp: string[] = [];
let numericFieldsCompared = 0;
for (const [k, before] of flatRed) {
  const after = flatNew.get(k);
  if (typeof before === 'number' && typeof after === 'number') numericFieldsCompared += 1;
  if (Object.is(before, after)) continue;
  changedFields.push(k);
  if (typeof before === 'number' && typeof after === 'number'
    && !Object.is(round(before, 5), round(after, 5))) movedAt5dp.push(k);
}
for (const k of flatNew.keys()) if (!flatRed.has(k)) changedFields.push(`+${k}`);
const gCellsCarriedBitExact =
  JSON.stringify(RED.perSeedCells) === JSON.stringify(draft.perSeedCells)
  && JSON.stringify(RED.ladderCells) === JSON.stringify(draft.ladderCells);
/**
 * ⭐ THE DRIFT BOUND, both halves: the changed-field set inside the hashed body is EXACTLY
 * {`gates.gFacesFromDisk`} (the gate the fix flips), and NOTHING anywhere in the hashed
 * body moves at 5 decimal places.
 */
const gDriftBounded = changedFields.length === 1
  && changedFields[0] === 'gates.gFacesFromDisk'
  && movedAt5dp.length === 0;

/* ========================================================================== */
/* §6 THE FULL RE-DERIVATION, OFF DISK, THROUGH THE ONE FORMULA                */
/* ========================================================================== */
mkdirSync('docs/world-model/data', { recursive: true });
writeFileSync(STAGE_PATH, `${JSON.stringify(
  buildArtifact(true, [], changedFields, gDriftBounded, gCellsCarriedBitExact), null, 2)}\n`);

const onDisk = JSON.parse(readFileSync(STAGE_PATH, 'utf8')) as typeof RED;
const diskRows = onDisk.perSeedCells;
const diskCells = onDisk.ladderCells;
const faceMismatches: string[] = [];
let reDerivedChecks = 0;

/* (a) the churn faces, re-derived from the artifact's own cells */
for (const [name, acc] of Object.entries(CHURN_ACCESSORS)) {
  const published = onDisk.luanpaoDiagnosis.faces.find((f) => f.face === name);
  reDerivedChecks += 1;
  if (published === undefined) { faceMismatches.push(`${name}: MISSING from artifact`); continue; }
  const v = round(ratio(sum(diskRows.map(acc.num)), sum(diskRows.map(acc.den))));
  if (!Object.is(v, published.value)) faceMismatches.push(`${name}: ${v} ≠ ${published.value}`);
}
/* (b) the percentile face, from the STORED BINS on disk */
{
  const pooled = Array.from({ length: LAT_BINS }, (_, b) =>
    sum(diskRows.map((r) => r.reTargetLatencyBins[b])));
  const total = sum(pooled);
  const q = (p: number): number => {
    if (total === 0) return Number.NaN;
    let acc = 0;
    for (let b = 0; b < LAT_BINS; b++) {
      acc += pooled[b];
      if (acc >= p * total) return (b + 1) * LAT_BIN_S;
    }
    return LAT_BINS * LAT_BIN_S;
  };
  reDerivedChecks += 3;
  if (JSON.stringify(pooled) !== JSON.stringify(onDisk.luanpaoDiagnosis.latencyBins.pooled)) {
    faceMismatches.push('latency pooled bins mismatch');
  }
  if (!Object.is(round(q(0.5)), onDisk.luanpaoDiagnosis.latencyBins.medianFromBinsSeconds)) {
    faceMismatches.push('latency median from bins mismatch');
  }
  if (!Object.is(round(q(0.9)), onDisk.luanpaoDiagnosis.latencyBins.p90FromBinsSeconds)) {
    faceMismatches.push('latency p90 from bins mismatch');
  }
}
/* (c) every per-generation ladder face, re-derived off disk */
for (const lf of onDisk.seasonLadder.perGenerationFaces) {
  const cs = diskCells.filter((c) => c.arm === lf.arm && c.generation === lf.generation);
  const matches = sum(cs.map((c) => c.matches));
  const tm = matches * 2;
  const check: Array<[string, number | number[], unknown]> = [
    ['goalsPerMatch', round(ratio(sum(cs.map((c) => c.goals)), matches)), lf.goalsPerMatch],
    ['shotsPerTeamMatch', round(ratio(sum(cs.map((c) => c.shots)), tm)), lf.shotsPerTeamMatch],
    ['shotsConcededPerTeamMatch', round(ratio(sum(cs.map((c) => c.shots)), tm)), lf.shotsConcededPerTeamMatch],
    ['xgPerTeamMatch', round(ratio(sum(cs.map((c) => c.xg)), tm)), lf.xgPerTeamMatch],
    ['tacklesPerTeamMatch', round(ratio(sum(cs.map((c) => c.tackles)), tm)), lf.tacklesPerTeamMatch],
    ['interceptionsPerTeamMatch', round(ratio(sum(cs.map((c) => c.interceptions)), tm)),
      lf.interceptionsPerTeamMatch],
    ['clearancesPerTeamMatch', round(ratio(sum(cs.map((c) => c.clearances)), tm)), lf.clearancesPerTeamMatch],
    ['blocksPerTeamMatch', round(ratio(sum(cs.map((c) => c.blocks)), tm)), lf.blocksPerTeamMatch],
    ['passCompletion', round(ratio(sum(cs.map((c) => c.passesCompleted)),
      sum(cs.map((c) => c.passes)))), lf.passCompletion],
    ['perLeagueGoalsPerMatch', cs.map((c) => round(ratio(c.goals, c.matches))), lf.perLeagueGoalsPerMatch],
  ];
  for (const [n, a, b] of check) {
    reDerivedChecks += 1;
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      faceMismatches.push(`ladder ${String(lf.arm)} gen${String(lf.generation)} ${n}: `
        + `${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
    }
  }
}
/* (d) ⭐ every slope: levels AND deltas, the delta through THE ONE FORMULA */
for (const s of onDisk.seasonLadder.earlyLateSlopes) {
  const f = s.face as SlopeFace;
  const perLeague = onDisk.seasonLadder.leagueSeeds.map((ls) =>
    perLeagueLevels(diskCells, s.arm, ls, f, EARLY_GENS, LATE_FROM));
  const e = round(mean(perLeague.map((p) => p.early)));
  const l = round(mean(perLeague.map((p) => p.late)));
  const d = round(slopeDeltaThroughOneFormula(perLeague));
  reDerivedChecks += 3;
  if (!Object.is(e, s.early) || !Object.is(l, s.late)) {
    faceMismatches.push(`slope ${s.arm}/${s.face}: ${e}/${l} ≠ ${s.early}/${s.late}`);
  }
  if (!Object.is(d, s.delta)) {
    faceMismatches.push(`slope ${s.arm}/${s.face} delta: ${d} ≠ ${s.delta}`);
  }
  if (!Object.is(round(Math.abs(d) / s.halfWidth, 3), s.ratioToHalfWidth)) {
    faceMismatches.push(`slope ${s.arm}/${s.face} |Δ|/hw: ${round(Math.abs(d) / s.halfWidth, 3)} `
      + `≠ ${s.ratioToHalfWidth}`);
  }
}
const gFacesFromDisk = faceMismatches.length === 0;

/* ========================================================================== */
/* §7 PUBLISH — canonical ONLY on green (a red run cannot touch the record)     */
/* ========================================================================== */
const FIX_GATES = { ...fixGatesPre, gCellsCarriedBitExact, gDriftBounded, gFacesFromDisk };
const CENSUS_GATES = { ...RED.gates, gFacesFromDisk };
const ALL_GREEN = Object.values(FIX_GATES).every(Boolean) && Object.values(CENSUS_GATES).every(Boolean);

const finalBytes = `${JSON.stringify(
  buildArtifact(gFacesFromDisk, faceMismatches, changedFields, gDriftBounded, gCellsCarriedBitExact),
  null, 2)}\n`;
if (ALL_GREEN) {
  writeFileSync(STAGE_PATH, finalBytes);
  renameSync(STAGE_PATH, CANON_PATH);
} else {
  writeFileSync(STAGE_PATH, finalBytes);
}
const OUT = ALL_GREEN ? CANON_PATH : STAGE_PATH;
if (ALL_GREEN && existsSync(STAGE_PATH)) unlinkSync(STAGE_PATH);
const outBytesSha = sha256(readFileSync(OUT, 'utf8'));
const OUT_PARSED = JSON.parse(readFileSync(OUT, 'utf8')) as { bodySha256: string; allGreen: boolean };

/* ========================================================================== */
/* §8 BANNER                                                                   */
/* ========================================================================== */
banner('');
banner('=== DF-C0-FIX — THE SLOPE-FORMULA CURE (no sim re-runs) ===');
banner(`source (RED, of record)  ${RED_PATH}`);
banner(`  bytes sha256 ${redBytesSha}`);
banner(`  bodySha256   ${RED.bodySha256}   allGreen ${RED.allGreen}`);
banner(`frozen instrument        ${FROZEN_PROBE}  sha256 ${frozenSha}  (NOT edited, NOT re-run)`);
banner(`artifact →               ${OUT}`);
banner(`  bytes sha256 ${outBytesSha}`);
banner(`  bodySha256   ${OUT_PARSED.bodySha256}   allGreen ${OUT_PARSED.allGreen}`);
banner('');
banner('--- THE ONE FORMULA ---');
banner('  slopeDelta = mean(per-league (late − early))   [the pre-registered estimand]');
banner('  applied by ONE function on BOTH sides: slopeDeltaThroughOneFormula');
banner(`  rejected: round(mean(late)) − round(mean(early))   [the frozen verifier's second `
  + 'formula]');
banner(`  frozen snippets drift-gated: ${snippetReport.length} (all resolved verbatim) `
  + `+ the defect receipt (${defectSnippetOccurrences} occurrence) ⇒ gOneFormula = ${gOneFormula}`);
banner(`  snippets occurring TWICE in the frozen probe (the duplication cured here): `
  + `${JSON.stringify(snippetReport.filter((s) => s.occurrences > 1).map((s) => `${s.id}×${s.occurrences}`))}`);
banner('');
banner('--- WHAT MOVED ---');
banner(`  published measurement fields changed: ${publishMoves.length}`);
for (const m of publishMoves) banner(`    ${m.field}: ${m.from} → ${m.to}`);
banner(`  re-derivation values moved: ${REDERIVATION_MOVES.length}`);
for (const m of REDERIVATION_MOVES) banner(`    ${m.field}: ${m.from} → ${m.to}`);
banner(`  changed fields in the hashed body: ${JSON.stringify(changedFields)}`);
banner(`  numeric fields compared ${numericFieldsCompared}; moved at 5 dp = ${movedAt5dp.length}`);
banner('');
banner('--- RE-DERIVATION OFF DISK ---');
banner(`  checks re-derived from the artifact's own cells: ${reDerivedChecks}`);
banner(`  mismatches: ${faceMismatches.length}${faceMismatches.length === 0 ? '' : ` ${JSON.stringify(faceMismatches)}`}`);
banner('');
banner('--- GATES ---');
for (const [k, v] of Object.entries(FIX_GATES)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}  (fix)`);
for (const [k, v] of Object.entries(CENSUS_GATES)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}  (census, carried)`);
banner('');
banner(`seeds consumed: 0 · stats bases consumed: 0 · sim re-runs: 0 · src: `
  + `${gSrcUntouched ? 'UNTOUCHED' : 'DIRTY'}`);
banner('');
banner(ALL_GREEN ? 'ALL GATES GREEN' : '**GATES RED — canonical path NOT written**');
if (!ALL_GREEN) process.exit(1);
