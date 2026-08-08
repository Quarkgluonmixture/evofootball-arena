// THE ABSOLUTE POSSESSION / TEMPO CENSUS — commander ruling #170 (granted on #169.5).
//
// Authority: docs/world-model/TEMPO-CENSUS.md (the FROZEN pre-registration, which
// ELABORATES and NEVER re-cuts #170) + #169 (the ruler-honesty audit: our batteries are
// RELATIVE A/B rulers and the disease lives in the BASELINE — a disease present in both
// arms can never fire a gate; H-169a labelled) + #166 (ledger corrections BINDING: the
// next free census seed is 12,293,000; stats base 102,200 is published but UNSPENT) +
// #163 (stats bases STREAM-disjoint, gaps ≥ 200) + #128 (wall measured OUTSIDE the
// X-DET-compared core) + VISION §2 (the 2026-07-27 tempo anchor C5/C7 — the registered
// tempo census — and the 2026-08-08 scramble verdict) + VISION §3 (the reference-database
// HOUSE LAW: curve shapes and causal seats may be referenced, CONSTANTS NEVER IMPORTED).
//
// WHAT THIS IS: not an A/B. An ABSOLUTE ruler. It reports the per-arm LEVEL of the time
// dimension — how long a team keeps the ball, how many touches that is, how long a body
// holds it per touch, how often the ball changes hands, what happens to a reception taken
// under pressure, and how long the actions themselves take — against real-football
// REFERENCE LINES that GATE NOTHING.
//
// ⭐ AXIS HONESTY (#170.2, the PITCH_SCALE probe lesson; #171.1.ii FIX). MATCH_DURATION = 240
// sim-seconds maps to a 90' display clock. EVERY rate is therefore reported TWICE:
//     per SIM-second   — what the user actually watches at 1× (240 s = one nominal match)
//     per DISPLAY-min  — the 90' mapping
//     MAPPING FACTOR   — 240 sim-s ⇔ 90 display-min ⇒ 1 sim-s = 0.375 display-min
//                        ⇒ rate_per_display_min = rate_per_sim_s × (240 / 90) = × 2.666…
// ⭐ ONE CLOCK IS THE RATE DENOMINATOR (#171.1.ii): `match.simTime` — the PLAYED-time clock
// that `Match.minute()` itself maps onto the 90' display. `simTick · DT` is NOT used in any
// rate: `simTick` (= `stepCount`) counts the kickoff / goal-pause / half-time steps that
// `simTime` skips (Match.ts:1113–1134), so dividing by it breaks the ×2.6667 law. The
// pause-INCLUSIVE clock the user actually sits through is still emitted once per arm as
// `wallSimSecondsPerMatch`, clearly labelled and used in NO rate.
// DURATIONS are reported in SIM-SECONDS ONLY and are never rescaled: a 0.3 s hold is a
// 0.3 s hold on the screen. The gap table never mixes axes.
//
// ARMS (same seeds across all three; the shared-seed set IS the pairing):
//   prod — the SHIPPED game: no match flags, no station eye, no gene written.
//   v1   — the #156 uniform-whisper world (A4_WORLD_FLAGS + the PRIOR eye + obedience 0.5).
//   v2   — the #167.5 discipline world (v1 + the frozen backLoaded offset family).
// ⚠ DECLARED CONFOUND: prod differs from v1 in TWO ways at once (the enriched construction
// flags AND the eye/gene). This is deliberate — "production" means the world the user plays,
// not a single-factor control. No prod-vs-v1 causal claim is made or permitted.
//
// MODES (explicit TEMPO_MODE, NO default):
//   smoke   — sizing / wall / plumbing ONLY (40 seeds × 3 arms), writes the sizing JSON.
//   census  — the full run at TEMPO_N (required in census mode; pinned from the smoke).
//
// COMMAND LINES:
//   TEMPO_MODE=smoke  npx tsx scripts/probes/tempo-census.ts
//   the full census, §0.0.4 DETACHED (the commander's resident session; log declared):
//     nohup env TEMPO_MODE=census TEMPO_N=<the disclosed N* from the smoke> \
//       npx tsx scripts/probes/tempo-census.ts > /tmp/tempo-census-full.log 2>&1 & disown
//   preflight (bounded, writes OUTSIDE docs/, NOT a verdict):
//     TEMPO_MODE=smoke TEMPO_CAP=2 TEMPO_SKIP_FP=1 TEMPO_OUT=/tmp/t.json npx tsx …
//
// ROAD B. Nothing ships. ZERO `src/**` changes (X-SRC-ZERO HARD). Every flag is armed ONLY
// inside this instrument; the production fingerprint 57b0bdab…c673 is unchanged. The
// reference bands live in the OUTPUT only — no number from the research file or from any
// public source ever reaches a sim value.

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import {
  CONTEST_RADIUS, CONTROL_RADIUS, CONTROL_REACH_SCALE, DT, MATCH_DURATION, TOUCH_CONTROL_DIST,
} from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type {
  MergedChildTable, RoleConditionedTable, RoleControlLevels,
} from '../../src/ai/stationEye';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING — pinned BEFORE any run (TEMPO-CENSUS.md §§2–6).
// =============================================================================

/** ⭐ THE TIME AXES. MATCH_DURATION sim-seconds ⇔ 90 display-minutes (Match.ts:1058 —
 *  `Math.min(45, Math.floor((simTime / duration) * 90))` per half). */
const DISPLAY_MINUTES = 90;
/** sim-seconds per display-minute = 240 / 90 = 2.666… */
const SIM_S_PER_DISPLAY_MIN = MATCH_DURATION / DISPLAY_MINUTES;

/** ⭐ THE PRESSURE RADIUS, FROZEN EX ANTE FROM A TRACED constants.ts VALUE.
 *  `TOUCH_CONTROL_DIST` (src/sim/constants.ts:315) = 4.2 m is the sim's OWN definition of
 *  "under pressure". Its docstring, quoted honestly across the TWO comment blocks it
 *  actually lives in (constants.ts:305–311, the Phase-36 discrete-touch block, then
 *  constants.ts:312–314 immediately above the const), with the elision marked:
 *    "Under pressure (an opponent inside TOUCH_CONTROL_DIST) the carry stays glued: close
 *     control IS short touches, and the tackle/shield duel lives there." […]
 *    "Nearest-opponent distance above which the carrier plays open touches."
 *  It is the substrate's own pressure switch, which is exactly what this census must read.
 *  TWO declared SENSITIVITY radii are reported beside it, never instead of it:
 *    · CONTEST_RADIUS 3.0 m (constants.ts:256 — "both sides with a body within this of a
 *      loose ball = a genuine contest"), and
 *    · CONTROL_RADIUS (constants.ts:244 — the reach envelope; the tightest read). ⚠ It is
 *      NOT a flat 1.25: the source is `1.25 * CONTROL_REACH_SCALE` (constants.ts:31, an
 *      env-scalable factor), so the probe writes the COMPUTED runtime value plus the
 *      formula and the observed scale into the trace (#171.1 finding 5).
 *  For context only, the engine's own RECEPTION pressure trigger is genome-dependent
 *  (`trigger = 3.0 + team.genome.tempo * 1.5`, Match.ts:1710 ⇒ 3.0–4.5 m) — it is REPORTED
 *  as the observed distribution, never used as the frozen radius (a genome-dependent radius
 *  would make the ruler move with the arm). */
const PRESSURE_R = TOUCH_CONTROL_DIST;
const PRESSURE_R_TIGHT = CONTEST_RADIUS;
const PRESSURE_R_TIGHTEST = CONTROL_RADIUS;

/** ⭐ THE FIRST-TOUCH WINDOW, FROZEN EX ANTE FROM A TRACED ENGINE VALUE.
 *  `p.firstTouchWindow = 0.28` (src/sim/Match.ts:1725) is the engine's own 一脚出球
 *  window: a pass struck inside it is played FIRST-TIME. A reception whose hold is ≤ this
 *  is therefore a first-touch release BY THE SUBSTRATE'S OWN DEFINITION, not by ours. */
const FIRST_TOUCH_S = 0.28;

/** Ticks after a spell's terminating tick within which a foul is attributed to it. */
const FOUL_LOOKAHEAD_TICKS = 6;

// --- seed ledger (#166.2.ii: the next FREE census seed is 12,293,000) --------
/** Everything at or below this is CONSUMED or RESERVED by the A4 arc (#166.2.ii). */
const CONSUMED_CEILING = 12_292_999;
/** The itemized A4 ledger, carried forward for the disjointness proof. */
const CONSUMED_BLOCKS = [
  [11_150_000, 11_150_039], [11_200_000, 11_600_079],
  [11_700_000, 11_700_039], [11_800_000, 11_807_999],
  [11_850_000, 11_850_039], [11_900_000, 11_907_999],
  [11_950_000, 11_950_039], [12_000_000, 12_007_999],
  [12_050_000, 12_050_039], [12_100_000, 12_107_999],
  [12_150_000, 12_150_039], [12_200_000, 12_207_999],
  [12_208_000, 12_217_999],
  [12_220_000, 12_220_039], [12_230_000, 12_236_999],
  [12_237_000, 12_237_039], [12_240_000, 12_247_999],
  [12_248_000, 12_255_999], [12_256_000, 12_256_039],
  [12_256_040, 12_256_059], // X-OFF-IDENT in every S2-P3 mode (#166.2.ii correction)
  [12_257_000, 12_257_399], // S2-P3 Leg F
  [12_258_000, 12_258_039], // S2-P3 Leg W smoke
  [12_260_000, 12_264_999], // S2-P3 Leg W (N = 5,000 sets)
  [12_266_000, 12_269_999], // S2-P3 Leg S smoke (bounded, band reserved whole)
  [12_270_000, 12_292_944], // S2-P3 Leg S (true upper bound, #166.2.ii)
] as const;

/** THIS STAGE'S BLOCKS — disjoint from each other and strictly above the ceiling. */
const SMOKE_BASE = 12_293_000; const SMOKE_MATCHES = 40;   // → 12,293,039
const CENSUS_BASE = 12_294_000; const CENSUS_N_CAP = 3_000; // → ≤ 12,296,999
/** The band this stage reserves in full. */
const RESERVED_BAND = [12_293_000, 12_299_999] as const;

// --- stats seeds (#163.2.iii: STREAM-disjoint, gaps ≥ 200) --------------------
/** #166.2.ii: 102,200 is PUBLISHED BUT UNSPENT — Leg S never drew from it. Reused here. */
const BOOTSTRAP_SEED = 102_200;
const RESERVED_STATS_SEED = 102_400;
const CONSUMED_STATS = [
  91_100, 91_110, 92_110, 93_003, 99_403, 99_503, 99_603, 99_703, 99_803, 99_903,
  100_603, 100_703, 100_803, 100_903, 101_003, 101_103, 101_203, 101_303,
  101_403, 101_503, 101_513, 101_523, 101_800, 102_000,
] as const;
const STATS_GAP_MIN = 200;
const BOOTSTRAP_RESAMPLES = 2_000;

// --- sizing (frozen ex ante) --------------------------------------------------
/** ⭐ THE SIZING TARGET. The headline distribution read is the SPELL-LENGTH quantile set
 *  (p25 / median / p75). For an order statistic the standard error is
 *      SE(q_p) ≈ sqrt(p(1−p)/n) / f(q_p),
 *  so the RELATIVE precision improves as 1/sqrt(n) and is quantile-count-driven, not
 *  match-count-driven. We freeze the target on the COUNT OF OPEN-PLAY SPELLS PER ARM:
 *      n = 20,000 spells ⇒ sqrt(.25·.75/20000) = 0.0031 in probability mass, which on a
 *      spell-length density of even 0.05 /s at p75 is a p75 standard error of ~0.06 s —
 *      an order of magnitude finer than any reference band we compare against.
 *  N* = ceil(TARGET_SPELLS / spellsPerMatch_smoke), rounded UP to N_STEP, capped by the
 *  wall budget and by CENSUS_N_CAP. Frozen BEFORE the smoke ran. */
const TARGET_SPELLS_PER_ARM = 20_000;
const N_STEP = 50;
/** Wall budget for the full census (#170: ≤ 2 h across the whole launched run). */
const WALL_BUDGET_HOURS = 2;
const XDET_FACTOR = 2;
const ARMS_COUNT = 3;

// --- X-family pins ------------------------------------------------------------
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const MERGED_PATH = 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const MERGED_SHA_EXPECTED = '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED = '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';

/** #67.3: the ENRICHED world the v3 table + merged children were censused on
 *  (= src/game/a4World.ts `A4_WORLD_FLAGS`, verbatim). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;
const A4_OBEDIENCE = 0.5;
const A4_V2_OFFSETS = [0, 0.4, 0.2, 0, -0.2, -0.4] as const;

// --- histogram buckets (frozen ex ante) ---------------------------------------
/** Spell length, SIM-SECONDS. Upper edges; the last bucket is the open tail. */
const SPELL_BUCKETS_S = [0.5, 1, 2, 3, 5, 8, 12, 20] as const;
/** Touches per spell. Upper edges on the integer count. */
const TOUCH_BUCKETS = [1, 2, 3, 4, 5, 9] as const;
/** Hold (reception→release) per touch, SIM-SECONDS. */
const HOLD_BUCKETS_S = [0.1, 0.28, 0.5, 1, 2, 4] as const;

const PROGRESS_EVERY = 10;

// =============================================================================
// REFERENCE BANDS — real football. ⭐⭐ THEY GATE NOTHING.
// House law (VISION §3): curve SHAPES and orders of magnitude may be referenced;
// CONSTANTS ARE NEVER IMPORTED into sim values. These live in the OUTPUT only.
// ⚠ EVERY band below is ELEVEN-a-side, full-size-pitch football. Our world is 6v6 on a
// 0.70-scaled pitch. The bands are ORIENTATION, not targets — see the doc §5 caveat.
// =============================================================================
interface Band {
  readonly id: string;
  readonly metric: string;
  readonly lo: number | null;
  readonly hi: number | null;
  readonly unit: string;
  /** O/T/I/S = the research file's own grades; P = labelled PUBLIC estimate;
   *  D = DERIVED from another band (arithmetic shown); ABSENT = no honest source. */
  readonly grade: 'O' | 'T' | 'I' | 'S' | 'P' | 'D' | 'ABSENT';
  readonly source: string;
  /** ⚠ #171.1.iii: the POPULATION the band counts, spelled out AT THE POINT OF READ where
   *  it differs from the probe's default emission (both-teams sums per match). */
  readonly scope?: string;
}
const REFERENCE_BANDS: readonly Band[] = [
  {
    id: 'spellDurationMean', metric: 'possession-spell (Opta "sequence") mean duration',
    lo: 9.6, hi: 10.4, unit: 'seconds', grade: 'P',
    source: 'PUBLIC (Opta / Stats Perform, Premier League open-play sequences): 10.4 s mean '
      + 'in 2024-25, 9.6 s in 2025-26. theanalyst.com "Analysing Premier League Playing '
      + 'Styles in 2024-25" + premierleague.com/en/news/4426039 (Opta Analyst, 2025-26 '
      + 'tactical trends). NOT in the eFootball research file — that file is an ENGINE '
      + 'study and carries no real-football possession statistics.',
  },
  {
    id: 'spellDurationQuantiles', metric: 'possession-spell p25 / median / p75',
    lo: null, hi: null, unit: 'seconds', grade: 'ABSENT',
    source: 'ABSENT — Opta publishes sequence MEANS, not the quantile set; no public '
      + 'quantile source located and nothing in the research file. Our p25/median/p75 are '
      + 'reported against NO band. (The mean band above is the only duration reference.)',
  },
  {
    id: 'passesPerSpell', metric: 'passes per open-play sequence',
    lo: 2.88, hi: 5.12, unit: 'passes', grade: 'P',
    source: 'PUBLIC (Opta, Premier League team season averages): league range 2.88 '
      + '(Nottingham Forest, lowest) to 5.12 (Manchester City, highest); Man City 5.1 and '
      + 'Southampton 4.4 in 2024-25 ⇒ a league CENTRAL value near 3.5–4. theanalyst.com '
      + '(playing styles 2024-25) + premierleague.com/en/news/4426039. This is the closest '
      + 'public analogue to TOUCHES PER POSSESSION — it is passes, not touches, so it is a '
      + 'LOWER bound on touches (a carry adds touches without a pass).',
  },
  {
    id: 'timeOnBallPerTouch', metric: 'time on the ball per touch (a player)',
    lo: 0.8, hi: 1.3, unit: 'seconds', grade: 'D',
    source: 'DERIVED (arithmetic shown, from two PUBLIC figures): an outfield player is in '
      + 'possession ~1 min 49 s (109 s) across a 90\' match (gulfnews.com "A football game '
      + 'lasts 90 minutes, you say?", quoting the standard broadcast/《The Numbers Game》 '
      + 'figure), and is involved in 111 ± 77 on-ball activities per match (PMC3778701, '
      + 'match-analysis study). 109 / 111 ≈ 0.98 s per touch; the band widens that to '
      + '0.8–1.3 s for the ±77 dispersion. LOW confidence, labelled.',
  },
  {
    id: 'turnoversPerDisplayMinute', metric: 'possession changes per display-minute (both teams)',
    lo: 3.0, hi: 4.5, unit: 'changes / display-minute', grade: 'D',
    source: 'DERIVED from spellDurationMean + ball-in-play time: the PL ball was in play '
      + '56 min 58 s of the 90 in 2024-25 (Opta, cited via the gulfnews/refsplaining '
      + 'ball-in-play reporting); at a ~10 s mean sequence that is ~342 sequence-ends per '
      + 'match ⇒ 342 / 90 ≈ 3.8 per DISPLAY-minute (≈ 6.0 per ball-in-play minute). NOT an '
      + 'independent measurement — it is the duration band re-expressed, and it inherits '
      + 'that band\'s uncertainty.',
  },
  {
    id: 'firstTouchDeathShare', metric: 'share of possessions dying at the FIRST touch',
    lo: null, hi: null, unit: 'share', grade: 'ABSENT',
    source: 'ABSENT — no public per-possession first-touch-death rate located, and the '
      + 'research file has none. The passesPerSpell band bounds it only indirectly (a '
      + 'league mean of 3.5–4 passes per sequence is incompatible with a MAJORITY of '
      + 'sequences dying on touch one, but that is an inference, not a band).',
  },
  {
    id: 'pressedFirstTouchDeath', metric: 'pressed vs unpressed first-touch loss rate',
    lo: null, hi: null, unit: 'share', grade: 'ABSENT',
    source: 'ABSENT — the H-169a discriminator has NO real-football reference. It is read '
      + 'as an INTERNAL contrast (pressed vs unpressed within the same arm), which is '
      + 'exactly why it can discriminate without a band.',
  },
  {
    id: 'kickPreparationDelay', metric: 'kick preparation delay (wind-up) sensitivity',
    lo: null, hi: null, unit: 'frames',
    grade: 'T',
    source: 'eFootball research file §5.2/§5.3/§5.6 (grade T, controlled frame-by-frame '
      + 'tests): a 99-rated ground passer\'s preparation delay is ~4 FRAMES shorter than a '
      + '60-rated one on a ~15 m pass; below 60 the delay is floor-clamped, 60–80 is where '
      + 'the ability matters most, above 80 the margin is ~1 frame; the new engine is 2–3 '
      + 'frames faster than the old at high ability. SHAPE ONLY — a frame count from '
      + 'another engine is NOT a target for our wind-up, and no value here is imported. '
      + 'What it licenses is the QUALITATIVE claim that a real engine spends real time '
      + 'between the decision and the strike (VISION §2\'s C7 seat).',
  },
  {
    id: 'shotsPerTeam', metric: 'shots per team per match',
    lo: 10, hi: 14.5, unit: 'shots', grade: 'P',
    source: 'PUBLIC but WEAK: the only team-level datapoint located is Arsenal 14.53 '
      + 'shots/match in 2024-25 (statmuse.com), which was among the league LEADERS ⇒ the '
      + 'league mean sits below it. The band is deliberately wide and its centre is NOT '
      + 'sourced. Treat as an order-of-magnitude line only.',
    scope: '⚠ PER TEAM PER MATCH. The probe\'s eventsPerMinute.shots.perMatch is a BOTH-TEAMS '
      + 'sum — read this band against eventsPerMinute.shots.perTeamPerMatch (= the sum / 2; '
      + 'the arms are symmetric, so the halving is exact in expectation, not per match).',
  },
  {
    id: 'foulsPerTeam', metric: 'fouls per team per match',
    lo: 9, hi: 12, unit: 'fouls', grade: 'P',
    source: 'PUBLIC but WEAK: Arsenal committed 399 fouls in 38 matches in 2024-25 = 10.5 '
      + 'per match (statmuse.com). One team, one season; the band is that value ±1.5.',
    scope: '⚠ PER TEAM PER MATCH. The probe\'s eventsPerMinute.fouls.perMatch is a BOTH-TEAMS '
      + 'sum — read this band against eventsPerMinute.fouls.perTeamPerMatch (= the sum / 2; '
      + 'the arms are symmetric, so the halving is exact in expectation, not per match).',
  },
] as const;

// =============================================================================
// ENV / MODE
// =============================================================================
const MODES = ['smoke', 'census'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.TEMPO_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`TEMPO-CENSUS FATAL — TEMPO_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const CAP = process.env.TEMPO_CAP ? Math.max(1, Number.parseInt(process.env.TEMPO_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(CAP);
const SKIP_DET = process.env.TEMPO_SKIP_DET === '1';
const SKIP_FP = process.env.TEMPO_SKIP_FP === '1';
const N_ENV = process.env.TEMPO_N ? Math.max(1, Number.parseInt(process.env.TEMPO_N, 10)) : null;
if (MODE === 'census' && N_ENV === null) {
  console.error('TEMPO-CENSUS FATAL — census requires TEMPO_N (pinned from the smoke sizing arithmetic).');
  process.exit(2);
}
if (MODE === 'smoke' && N_ENV !== null) {
  console.error('TEMPO-CENSUS FATAL — TEMPO_N is accepted ONLY in census; the smoke\'s 40 seeds are FROZEN.');
  process.exit(2);
}
const CENSUS_N = MODE === 'census' ? Math.min(N_ENV as number, CENSUS_N_CAP) : 0;

const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/tempo-census-sizing-smoke.json',
  census: 'docs/world-model/data/tempo-census.json',
};
const OUT_PATH = process.env.TEMPO_OUT ?? (IS_PREFLIGHT ? '/tmp/tempo-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && OUT_PATH.startsWith('docs/world-model/data/')) {
  console.error('TEMPO-CENSUS FATAL — a CAPPED (preflight) invocation may not write a canonical repo '
    + 'path; pass TEMPO_OUT=/tmp/… (the canonical-write guard).');
  process.exit(2);
}

const SEED_BASE = MODE === 'smoke' ? SMOKE_BASE : CENSUS_BASE;
const SEED_COUNT = Math.min(MODE === 'smoke' ? SMOKE_MATCHES : CENSUS_N, CAP);

// =============================================================================
// numeric helpers (the house forms)
// =============================================================================
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const sampleSd = (xs: readonly number[]): number => {
  const f = xs.filter(Number.isFinite);
  if (f.length < 2) return Number.NaN;
  const mu = f.reduce((s, x) => s + x, 0) / f.length;
  return Math.sqrt(f.reduce((s, x) => s + (x - mu) ** 2, 0) / (f.length - 1));
};
/** Quantile of an ALREADY-SORTED ascending array (the house's index form). */
const quantileSorted = (sorted: readonly number[], q: number): number => {
  if (sorted.length === 0) return Number.NaN;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))];
};
const sha = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');
/** Deterministic key-sorted serialization (nested), so the digest cannot drift on key order. */
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walk(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walk(v));
};
/** Bucket a value by UPPER EDGES; returns index in [0, edges.length] (last = open tail). */
const bucketOf = (v: number, edges: readonly number[]): number => {
  for (let i = 0; i < edges.length; i++) if (v <= edges[i]) return i;
  return edges.length;
};
const bucketLabels = (edges: readonly number[], unit: string): string[] => {
  const out: string[] = [];
  let prev = 0;
  for (const e of edges) { out.push(`${prev}–${e}${unit}`); prev = e; }
  out.push(`>${prev}${unit}`);
  return out;
};
/** Deterministic percentile bootstrap CI of a mean (stats stream, never match RNG). */
const bootstrapCi = (xs: readonly number[], seed: number): [number, number] => {
  if (xs.length < 2) return [Number.NaN, Number.NaN];
  const rng = new Rng(seed);
  const means: number[] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    let s = 0;
    for (let i = 0; i < xs.length; i++) s += xs[Math.floor(rng.next() * xs.length) % xs.length];
    means.push(s / xs.length);
  }
  means.sort((a, b) => a - b);
  return [quantileSorted(means, 0.025), quantileSorted(means, 0.975)];
};

// =============================================================================
// the injected P3p-1 merged table + control (X-MERGE-IDENT) — never in src/**
// =============================================================================
interface MergedTableFile { mergedTableSha: string; base: RoleConditionedTable; children: MergedChildTable }
const rawMerged = JSON.parse(readFileSync(MERGED_PATH, 'utf8')) as MergedTableFile;
const roleTable: RoleConditionedTable = rawMerged.base;
const children: MergedChildTable = rawMerged.children;
const mergedTableSha = rawMerged.mergedTableSha;
const control: RoleControlLevels = (JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as { control: RoleControlLevels }).control;
const mergeIdent = (() => {
  const mergedRehash = sha({ base: roleTable, children });
  const baseRehash = sha(roleTable);
  return {
    mergedShaField: mergedTableSha, mergedShaExpected: MERGED_SHA_EXPECTED, mergedRehash,
    baseRehash, baseShaExpected: BASE_SHA_EXPECTED,
    pass: mergedTableSha === MERGED_SHA_EXPECTED && mergedRehash === MERGED_SHA_EXPECTED
      && baseRehash === BASE_SHA_EXPECTED,
  };
})();

// =============================================================================
// the three arms
// =============================================================================
const ARMS = ['prod', 'v1', 'v2'] as const;
type Arm = (typeof ARMS)[number];
type EyeConfig = NonNullable<Match['stationEye']>;

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  const g = randomGenome(rng);
  const squad = randomSquad(rng);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: g, squad,
  };
};
/** The A4 PRIOR eye — `a4EyeConfig` of src/game/a4World.ts, field for field. */
const a4Eye = (): EyeConfig => ({
  arm: 'neutral', scope: { kind: 'both' }, table: {},
  v3: { roleTable, control, children, mergedTableSha },
  v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true, homePrior: true },
});
/** `setA4Obedience` + `setA4Offsets` of src/game/a4World.ts, verbatim idiom. */
const armGenes = (m: Match, side: Side, offsets: readonly number[] | null): void => {
  const t = m.teams[side];
  for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
    g.homePriorObedience = A4_OBEDIENCE;
    if (offsets !== null) g.homePriorObedienceOffset = [...offsets];
  }
};
const matchFor = (arm: Arm, seed: number): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  if (arm === 'prod') return new Match(base);
  const m = new Match({ ...base, ...CENSUS_FLAGS });
  m.stationEye = a4Eye();
  for (const side of [0, 1] as const) armGenes(m, side, arm === 'v2' ? A4_V2_OFFSETS : null);
  return m;
};

// =============================================================================
// ⭐ THE CENSUS INSTRUMENT — a pure TICK-WALK over observable match state.
// Reads ONLY: match.phase · match.ball.owner · match.score · match.simTick ·
// match.restartKickGid / kickoffKickGid · match.pendingKick · player.pos / side / sentOff ·
// team.stats. Writes NOTHING back into the match. Zero src/**.
// =============================================================================

/** A maximal interval of same-team ball control (the Opta "sequence" shape). */
interface Spell {
  team: Side;
  startTick: number;
  endTick: number;
  lastOwnedTick: number;
  ownedTicks: number;
  looseTicks: number;
  touches: number;
  origin: 'openPlay' | 'restart' | 'kickoff';
  terminator: 'opponentControl' | 'fouledWon' | 'foulCommitted' | 'goal' | 'outOfPlay' | 'matchEnd';
  firstTouchIdx: number;
  lastTouchIdx: number;
}
/** One ownership episode (a TOUCH): reception → release. */
interface Touch {
  gid: number;
  side: Side;
  spellIdx: number;
  startTick: number;
  endTick: number;
  /** nearest-opponent distance AT the reception tick (m) */
  nearestOpp: number;
  /** the engine's own genome-dependent reception trigger for this receiver's team (m) */
  engineTrigger: number;
  isFirstOfSpell: boolean;
  outcome: 'retainedSelf' | 'releasedToTeammate' | 'lost' | 'fouled' | 'foulCommitted'
    | 'goal' | 'outOfPlay' | 'matchEnd';
}

interface MatchCensus {
  seed: number;
  spells: Spell[];
  touches: Touch[];
  /** ⭐ THE RATE DENOMINATOR (#171.1.ii): `match.simTime` — PLAYED sim-seconds (stoppage
   *  included, kickoff/goal-pause/half-time steps excluded, exactly as the 90' display
   *  clock counts them). Every rate on every axis divides by THIS. */
  simSeconds: number;
  /** CONTEXT ONLY, in NO rate: the pause-INCLUSIVE clock the user actually sits through,
   *  `simTick · DT` (simTick = stepCount, which ticks through the pauses simTime skips). */
  wallSimSeconds: number;
  /** ticks with phase === 'playing' (the ball-in-play analogue). */
  inPlayTicks: number;
  /** ticks the ball had an owner while playing. */
  ownedTicks: number;
  /** C7 wind-up: ticks with a committed-but-unstruck shot (v1/v2 only; prod has no seam). */
  windupTicks: number;
  windupEpisodes: number;
  windupLengths: number[];
  stats: {
    passes: number; passesCompleted: number; shots: number; fouls: number;
    interceptions: number; tackles: number; miscontrols: number; goals: number;
  };
}

const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const dx = o.pos.x - p.pos.x; const dy = o.pos.y - p.pos.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < best) best = d;
  }
  return best;
};

function censusOne(arm: Arm, seed: number): MatchCensus {
  const m = matchFor(arm, seed);
  const spells: Spell[] = [];
  const touches: Touch[] = [];
  /** ticks (relative to spell close) at which each side committed a foul */
  const foulTicks: { tick: number; side: Side }[] = [];

  let cur: Spell | null = null;
  let curTouch: Touch | null = null;
  let prevOwnerGid: number | null = null;
  let prevFouls: [number, number] = [0, 0];
  let prevScore: [number, number] = [0, 0];
  let inPlayTicks = 0; let ownedTicks = 0;
  let windupTicks = 0; let windupEpisodes = 0; let curWindup = 0;
  const windupLengths: number[] = [];
  let prevWindupGid: number | null = null;
  let goalThisTick = false;

  /** Finalize the open spell (pure of `cur`: the caller owns the handle). */
  const finishSpell = (s: Spell, tick: number, terminator: Spell['terminator']): void => {
    s.endTick = tick;
    s.terminator = terminator;
    s.lastTouchIdx = touches.length - 1;
    spells.push(s);
  };
  const newSpell = (team: Side, tick: number, origin: Spell['origin']): Spell => ({
    team, startTick: tick, endTick: tick, lastOwnedTick: tick, ownedTicks: 0, looseTicks: 0,
    touches: 0, origin, terminator: 'matchEnd', firstTouchIdx: touches.length, lastTouchIdx: -1,
  });

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    const phase = m.phase;
    const owner = m.ball.owner;
    const ownerGid = owner === null ? null : owner.gid;

    // --- foul + goal detection (deltas on the passive ledgers) ---
    for (const s of [0, 1] as const) {
      const f = m.teams[s].stats.fouls;
      if (f > prevFouls[s]) foulTicks.push({ tick, side: s });
      prevFouls[s] = f;
    }
    goalThisTick = m.score[0] !== prevScore[0] || m.score[1] !== prevScore[1];
    prevScore = [m.score[0], m.score[1]];

    // --- C7 wind-up (observable only where the seam is armed) ---
    const pk = m.pendingKick;
    if (pk !== null) {
      windupTicks++; curWindup++;
      if (prevWindupGid === null) windupEpisodes++;
      prevWindupGid = pk.gid;
    } else if (prevWindupGid !== null) {
      windupLengths.push(curWindup); curWindup = 0; prevWindupGid = null;
    }

    // --- the release side of the previous tick's touch ---
    if (prevOwnerGid !== null && ownerGid !== prevOwnerGid && curTouch !== null) {
      curTouch.endTick = tick;
      curTouch = null;
    }

    if (phase !== 'playing') {
      // ⭐ #171.1.i — THE DEAD-BALL LEAK FIX. The ownership episode closes at the SAME
      // boundary that closes the spell: a carrier who is still holding the ball when the
      // phase leaves 'playing' must not accrue hold ticks through the restart. Time on
      // ball counts phase === 'playing' ticks ONLY. `prevOwnerGid` is reset to null so
      // that the resumption (a restart taker, or the same body playing on) registers as a
      // FRESH ownership episode rather than silently continuing the dead one.
      if (curTouch !== null) {
        curTouch.endTick = tick;
        curTouch = null;
      }
      if (cur !== null) {
        finishSpell(cur, tick, goalThisTick ? 'goal' : 'outOfPlay');
        cur = null;
      }
      prevOwnerGid = null;
      continue;
    }

    inPlayTicks++;
    if (owner === null) {
      if (cur !== null) cur.looseTicks++;
      prevOwnerGid = null;
      continue;
    }
    ownedTicks++;
    const side = owner.side;
    if (cur !== null && cur.team !== side) {
      finishSpell(cur, tick, 'opponentControl');
      cur = null;
    }
    if (cur === null) {
      const origin: Spell['origin'] = m.kickoffKickGid === owner.gid ? 'kickoff'
        : m.restartKickGid === owner.gid ? 'restart' : 'openPlay';
      cur = newSpell(side, tick, origin);
    }
    const spell: Spell = cur;
    spell.ownedTicks++;
    spell.lastOwnedTick = tick;

    if (ownerGid !== prevOwnerGid) {
      // a NEW ownership episode = a TOUCH (a reception, a re-collect, or a tackle-win)
      const trigger = 3.0 + m.teams[side].genome.tempo * 1.5;
      const t: Touch = {
        gid: owner.gid, side, spellIdx: spells.length, startTick: tick, endTick: tick,
        nearestOpp: nearestOpponent(m, owner), engineTrigger: trigger,
        isFirstOfSpell: spell.touches === 0, outcome: 'matchEnd',
      };
      touches.push(t);
      curTouch = t;
      spell.touches++;
    }
    prevOwnerGid = ownerGid;
  }
  if (curTouch !== null) curTouch.endTick = m.simTick;
  if (cur !== null) { finishSpell(cur, m.simTick, 'matchEnd'); cur = null; }

  // --- attribute fouls to the spells they terminated ---
  for (const s of spells) {
    if (s.terminator !== 'outOfPlay') continue;
    const f = foulTicks.find((x) => x.tick >= s.endTick - FOUL_LOOKAHEAD_TICKS
      && x.tick <= s.endTick + FOUL_LOOKAHEAD_TICKS);
    if (f === undefined) continue;
    s.terminator = f.side === s.team ? 'foulCommitted' : 'fouledWon';
  }
  // --- resolve every touch's outcome from what followed it ---
  for (let si = 0; si < spells.length; si++) {
    const s = spells[si];
    const from = s.firstTouchIdx; const to = s.lastTouchIdx;
    for (let i = from; i <= to && i < touches.length; i++) {
      const t = touches[i];
      if (i < to) {
        t.outcome = touches[i + 1].gid === t.gid ? 'retainedSelf' : 'releasedToTeammate';
      } else {
        t.outcome = s.terminator === 'opponentControl' ? 'lost'
          : s.terminator === 'fouledWon' ? 'fouled'
            : s.terminator === 'foulCommitted' ? 'foulCommitted'
              : s.terminator === 'goal' ? 'goal'
                : s.terminator === 'matchEnd' ? 'matchEnd' : 'outOfPlay';
      }
    }
  }

  const st0 = m.teams[0].stats; const st1 = m.teams[1].stats;
  return {
    seed, spells, touches,
    simSeconds: m.simTime,
    wallSimSeconds: m.simTick * DT,
    inPlayTicks, ownedTicks, windupTicks, windupEpisodes, windupLengths,
    stats: {
      passes: st0.passes + st1.passes,
      passesCompleted: st0.passesCompleted + st1.passesCompleted,
      shots: st0.shots + st1.shots,
      fouls: st0.fouls + st1.fouls,
      interceptions: st0.interceptions + st1.interceptions,
      tackles: st0.tackles + st1.tackles,
      miscontrols: st0.miscontrols + st1.miscontrols,
      goals: m.score[0] + m.score[1],
    },
  };
}

// =============================================================================
// AGGREGATION — every rate on BOTH axes; every duration in SIM-SECONDS only.
// =============================================================================
/** ⭐ A rate reported honestly on both clocks, off ONE denominator (#171.1.ii).
 *  The denominator is ALWAYS `simSecondsPerMatch` = mean `match.simTime` (PLAYED sim-seconds
 *  — the clock Match.minute() maps onto the 90' display). Both axes are therefore the same
 *  number in two units and the stated law reproduces exactly:
 *      perDisplayMinute = perSimSecond × SIM_S_PER_DISPLAY_MIN (= × 2.6667).
 *  The pause-inclusive clock (simTick · DT) appears once per arm as context and in NO rate. */
const bothAxes = (countPerMatch: number, simSecondsPerMatch: number) => {
  const perSimSecond = countPerMatch / simSecondsPerMatch;
  return {
    perMatch: round(countPerMatch, 4),
    perSimSecond: round(perSimSecond, 6),
    perSimMinute: round(perSimSecond * 60, 4),
    perDisplayMinute: round(perSimSecond * SIM_S_PER_DISPLAY_MIN, 6),
  };
};
/** ⚠ #171.1.iii — a BOTH-TEAMS-summed count also emitted per TEAM per match. The arms are
 *  symmetric (identical construction on both sides), so sum / 2 is the per-team level; it is
 *  an expectation over the seed set, not a per-match attribution. */
const bothAxesTeamScoped = (countPerMatch: number, simSecondsPerMatch: number) => ({
  ...bothAxes(countPerMatch, simSecondsPerMatch),
  perTeamPerMatch: round(countPerMatch / 2, 4),
  scope: '⚠ perMatch is a BOTH-TEAMS sum; perTeamPerMatch (= sum / 2, the arms being '
    + 'symmetric) is the scope the per-TEAM reference bands (B9 shots, B10 fouls) are stated '
    + 'in. Never read a per-team band against the sum.',
});

const distOf = (xs: number[], edges: readonly number[], unit: string) => {
  const sorted = [...xs].sort((a, b) => a - b);
  const hist = Array<number>(edges.length + 1).fill(0);
  for (const x of xs) hist[bucketOf(x, edges)]++;
  return {
    n: xs.length,
    mean: round(mean(xs), 4),
    sd: round(sampleSd(xs), 4),
    p25: round(quantileSorted(sorted, 0.25), 4),
    median: round(quantileSorted(sorted, 0.5), 4),
    p75: round(quantileSorted(sorted, 0.75), 4),
    p90: round(quantileSorted(sorted, 0.9), 4),
    max: round(sorted.length === 0 ? Number.NaN : sorted[sorted.length - 1], 4),
    histogram: hist,
    histogramShare: hist.map((h) => round(xs.length === 0 ? Number.NaN : h / xs.length, 5)),
    buckets: bucketLabels(edges, unit),
  };
};

const shareOf = (num: number, den: number): number => round(den === 0 ? Number.NaN : num / den, 5);

function aggregateArm(arm: Arm, per: MatchCensus[], statsSeedOffset: number) {
  const matches = per.length;
  /** ⭐ THE ONE RATE DENOMINATOR (#171.1.ii): mean PLAYED sim-seconds (match.simTime). */
  const simSecondsPerMatch = mean(per.map((p) => p.simSeconds));
  /** CONTEXT ONLY, in no rate: the pause-inclusive clock (simTick · DT). */
  const wallSimSecondsPerMatch = mean(per.map((p) => p.wallSimSeconds));
  const allSpells = per.flatMap((p) => p.spells);
  const openSpells = allSpells.filter((s) => s.origin === 'openPlay');
  const allTouches = per.flatMap((p) => p.touches);

  const spellDur = (s: Spell): number => (s.endTick - s.startTick) * DT;
  const spellOwnedDur = (s: Spell): number => s.ownedTicks * DT;

  const lens = openSpells.map(spellDur);
  const lensAll = allSpells.map(spellDur);
  const ownedLens = openSpells.map(spellOwnedDur);
  const touchCounts = openSpells.map((s) => s.touches);
  const holds = allTouches.map((t) => (t.endTick - t.startTick) * DT);

  // terminator mix (open play)
  const terms: Record<string, number> = {};
  for (const s of openSpells) terms[s.terminator] = (terms[s.terminator] ?? 0) + 1;
  const originMix: Record<string, number> = {};
  for (const s of allSpells) originMix[s.origin] = (originMix[s.origin] ?? 0) + 1;

  // first-touch death (open play): exactly one touch AND lost to the opponent
  const oneTouchSpells = openSpells.filter((s) => s.touches === 1);
  const deadFirstTouch = oneTouchSpells.filter((s) => s.terminator === 'opponentControl');
  const deadFirstTouchWide = oneTouchSpells.filter((s) => s.terminator === 'opponentControl'
    || s.terminator === 'outOfPlay' || s.terminator === 'foulCommitted');

  // ---- press-context RECEPTION outcomes (the frozen 4-way at R = PRESSURE_R) ----
  // ⭐ #171.1.iv — POPULATION FIX. The frozen wording is "the FIRST reception of each SPELL"
  // on the openPlay population; the all-origins pool folds in restart/kickoff receptions
  // whose geometry is set-piece geometry (a placed ball, a retreating defence). The HEADLINE
  // block and the H-169a discriminator therefore run on openPlay-origin spells ONLY; the
  // all-origins variant is kept BESIDE them, labelled, for context.
  // `spellIdx` is a per-MATCH index, so the join must happen inside each match.
  const firstTouchesOpen = per.flatMap((p) => p.touches.filter(
    (t) => t.isFirstOfSpell && p.spells[t.spellIdx]?.origin === 'openPlay',
  ));
  const firstTouchesAllOrigins = allTouches.filter((t) => t.isFirstOfSpell);
  /** the HEADLINE population. */
  const firstTouches = firstTouchesOpen;
  const classify = (t: Touch) => {
    const hold = (t.endTick - t.startTick) * DT;
    if (t.outcome === 'lost') return hold <= FIRST_TOUCH_S ? 'lostWithinFirstTouch' : 'lostAfterHold';
    if (t.outcome === 'fouled') return 'fouled';
    if (t.outcome === 'retainedSelf') return 'retainedBeyondFirstTouch';
    if (t.outcome === 'releasedToTeammate') {
      return hold <= FIRST_TOUCH_S ? 'releasedFirstTouchSafe' : 'retainedBeyondFirstTouch';
    }
    return 'otherDeadBall';
  };
  const OUTCOME_KEYS = [
    'retainedBeyondFirstTouch', 'releasedFirstTouchSafe', 'lostWithinFirstTouch',
    'lostAfterHold', 'fouled', 'otherDeadBall',
  ] as const;
  const pressBlock = (radius: number, pool: readonly Touch[]) => {
    const mk = (ts: readonly Touch[]) => {
      const counts: Record<string, number> = {};
      for (const k of OUTCOME_KEYS) counts[k] = 0;
      for (const t of ts) counts[classify(t)]++;
      const share: Record<string, number> = {};
      for (const k of OUTCOME_KEYS) share[k] = shareOf(counts[k], ts.length);
      const hold = ts.map((t) => (t.endTick - t.startTick) * DT);
      return {
        n: ts.length, counts, share,
        holdMeanS: round(mean(hold), 4), holdMedianS: round(quantileSorted([...hold].sort((a, b) => a - b), 0.5), 4),
        lostShare: shareOf(ts.filter((t) => t.outcome === 'lost').length, ts.length),
      };
    };
    const pressed = pool.filter((t) => t.nearestOpp <= radius);
    const free = pool.filter((t) => t.nearestOpp > radius);
    return {
      radiusM: radius,
      pressedShare: shareOf(pressed.length, pool.length),
      pressed: mk(pressed), unpressed: mk(free), all: mk(pool),
    };
  };

  // ---- ⭐ THE H-169a DISCRIMINATOR (frozen ex ante) ----
  const lossRate = (ts: readonly Touch[]): number =>
    shareOf(ts.filter((t) => t.outcome === 'lost').length, ts.length);
  /** The frozen contrast on a given first-reception population. */
  const discriminate = (pool: readonly Touch[]) => {
    const pressed = pool.filter((t) => t.nearestOpp <= PRESSURE_R);
    const free = pool.filter((t) => t.nearestOpp > PRESSURE_R);
    const pLostPressed = lossRate(pressed);
    const pLostFree = lossRate(free);
    const ratio = Number.isFinite(pLostPressed) && Number.isFinite(pLostFree) && pLostFree > 0
      ? pLostPressed / pLostFree : Number.NaN;
    const gap = pLostPressed - pLostFree;
    const reading = !Number.isFinite(ratio) ? 'INDETERMINATE (a rate is undefined or zero)'
      : (ratio >= 1.5 && gap >= 0.10) ? 'PRESSED-SPECIFIC — consistent with H-169a (pressure has no outlet)'
        : (ratio <= 1.2 || gap <= 0.05) ? 'NOT PRESSED-SPECIFIC — spells die unpressed too ⇒ the disease is elsewhere'
          : 'AMBIGUOUS — between the two frozen readings';
    return {
      nFirstReceptions: pool.length,
      nPressed: pressed.length,
      nUnpressed: free.length,
      pLostPressed, pLostUnpressed: pLostFree,
      ratio: round(ratio, 4), gap: round(gap, 5),
      reading,
      holdMeanPressedS: round(mean(pressed.map((t) => (t.endTick - t.startTick) * DT)), 4),
      holdMeanUnpressedS: round(mean(free.map((t) => (t.endTick - t.startTick) * DT)), 4),
    };
  };
  const discOpen = discriminate(firstTouchesOpen);
  const discAllOrigins = discriminate(firstTouchesAllOrigins);

  const nearestOppDist = distOf(firstTouches.map((t) => t.nearestOpp), [1, 2, 3, 4.2, 6, 9], 'm');

  // ---- event rates, both axes ----
  const ev = (key: keyof MatchCensus['stats']) =>
    bothAxes(mean(per.map((p) => p.stats[key])), simSecondsPerMatch);
  /** ⚠ both-teams sum AND per-team-per-match (the scope B9/B10 are stated in). */
  const evTeam = (key: keyof MatchCensus['stats']) =>
    bothAxesTeamScoped(mean(per.map((p) => p.stats[key])), simSecondsPerMatch);
  const turnoversPerMatch = mean(per.map((p) =>
    p.spells.filter((s) => s.terminator === 'opponentControl').length));
  const spellsPerMatch = mean(per.map((p) => p.spells.length));
  const openSpellsPerMatch = mean(per.map((p) => p.spells.filter((s) => s.origin === 'openPlay').length));
  const regainsPerMatch = mean(per.map((p) => p.stats.interceptions + p.stats.tackles));

  // ---- CIs on the headline per-match means (stats stream, deterministic) ----
  const ci = (xs: number[], off: number): [number, number] => bootstrapCi(xs, BOOTSTRAP_SEED + statsSeedOffset + off);

  const windupAll = per.flatMap((p) => p.windupLengths).map((t) => t * DT);

  return {
    arm,
    matches,
    simSecondsPerMatch: round(simSecondsPerMatch, 4),
    simSecondsPerMatchNote: '⭐ match.simTime — PLAYED sim-seconds (stoppage in, kickoff / '
      + 'goal-pause / half-time steps out). THE denominator of every rate on every axis '
      + '(#171.1.ii), so perDisplayMinute = perSimSecond × '
      + `${round(SIM_S_PER_DISPLAY_MIN, 6)} holds exactly.`,
    wallSimSecondsPerMatch: round(wallSimSecondsPerMatch, 4),
    wallSimSecondsNote: '⚠ CONTEXT ONLY — USED IN NO RATE. simTick · DT, the PAUSE-INCLUSIVE '
      + 'clock the user actually sits through at 1× (simTick = stepCount, which ticks through '
      + 'the kickoff / goal-pause / half-time steps that simTime skips). Reported because it '
      + 'is the honest answer to "how long does a match take to watch", not because any rate '
      + 'divides by it.',
    inPlaySimSecondsPerMatch: round(mean(per.map((p) => p.inPlayTicks * DT)), 4),
    ownedSimSecondsPerMatch: round(mean(per.map((p) => p.ownedTicks * DT)), 4),
    ownedShareOfInPlay: shareOf(mean(per.map((p) => p.ownedTicks)), mean(per.map((p) => p.inPlayTicks))),

    possessionSpell: {
      definition: 'a maximal interval of same-owner-TEAM ball control while phase === "playing"; '
        + 'opened at the first tick a body of that team owns the ball, SUSPENDED (not ended) '
        + 'while the ball is loose in play (a pass in flight, a dribble knock, a deflection), '
        + 'ended by an opponent establishing ownership, by the phase leaving "playing" '
        + '(out of play / foul / goal / half end), or by full time. Duration = (endTick − '
        + 'startTick) · DT, i.e. INCLUDING in-spell loose time (the Opta "sequence" shape); '
        + 'the controlled-time-only variant is reported beside it.',
      openPlay: distOf(lens, SPELL_BUCKETS_S, 's'),
      openPlayControlledTimeOnly: distOf(ownedLens, SPELL_BUCKETS_S, 's'),
      allOrigins: distOf(lensAll, SPELL_BUCKETS_S, 's'),
      originMix,
      terminatorMix: terms,
      terminatorShare: Object.fromEntries(
        Object.entries(terms).map(([k, v]) => [k, shareOf(v, openSpells.length)]),
      ),
      perMatch: bothAxes(spellsPerMatch, simSecondsPerMatch),
      openPlayPerMatch: bothAxes(openSpellsPerMatch, simSecondsPerMatch),
      firstTouchDeath: {
        definition: 'an open-play spell with EXACTLY ONE ownership episode that ended with the '
          + 'opponents establishing control (the strict form). The WIDE form also counts a '
          + 'one-touch spell that ended out of play or in a foul by the holding team.',
        oneTouchSpells: oneTouchSpells.length,
        oneTouchShare: shareOf(oneTouchSpells.length, openSpells.length),
        strictDeaths: deadFirstTouch.length,
        strictShare: shareOf(deadFirstTouch.length, openSpells.length),
        wideDeaths: deadFirstTouchWide.length,
        wideShare: shareOf(deadFirstTouchWide.length, openSpells.length),
      },
    },

    touchesPerPossession: distOf(touchCounts, TOUCH_BUCKETS, ''),

    timeOnBallPerTouch: {
      definition: 'owner-held sim-seconds per ownership episode: (releaseTick − receptionTick) · DT, '
        + 'counting phase === "playing" ticks ONLY — the episode is CLOSED at the same boundary '
        + 'that closes the spell, so a carrier still holding the ball when play stops accrues no '
        + 'dead-ball hold (#171.1.i). A DURATION — reported in SIM-SECONDS ONLY, never rescaled '
        + 'to the 90\' clock.',
      ...distOf(holds, HOLD_BUCKETS_S, 's'),
      shareAtOrUnderFirstTouchWindow: shareOf(
        holds.filter((h) => h <= FIRST_TOUCH_S).length, holds.length,
      ),
      firstTouchWindowS: FIRST_TOUCH_S,
    },

    actionDurations: {
      receptionToRelease: distOf(holds, HOLD_BUCKETS_S, 's'),
      kickWindup: {
        observable: windupAll.length > 0,
        note: windupAll.length > 0
          ? 'C7 wind-up seam armed (c7Windup) — pendingKick episodes measured.'
          : 'ABSENT-WITH-REASON on this arm: `pendingKick` is null in every path unless the '
            + 'c7Windup seam is armed, so the production world HAS no measurable kick '
            + 'execution time — the strike is instantaneous. That absence is itself the '
            + 'VISION §2 C7 finding, not a probe limitation.',
        episodesPerMatch: round(mean(per.map((p) => p.windupEpisodes)), 4),
        ...(windupAll.length > 0 ? distOf(windupAll, [0.05, 0.1, 0.2, 0.4], 's') : {}),
      },
    },

    pressContext: {
      frozenRadiusM: PRESSURE_R,
      frozenRadiusTrace: 'TOUCH_CONTROL_DIST, src/sim/constants.ts:315 — the substrate\'s own '
        + '"under pressure" switch for the carry.',
      populationNote: '⭐ #171.1.iv — the HEADLINE first-reception block is the openPlay-ORIGIN '
        + 'population (the frozen wording: the FIRST reception of each SPELL). Restart- and '
        + 'kickoff-origin receptions carry set-piece geometry and are reported SEPARATELY as '
        + 'firstReceptionsAllOrigins, labelled, for context only.',
      allReceptions: pressBlock(PRESSURE_R, allTouches),
      firstReceptionsOfSpell: pressBlock(PRESSURE_R, firstTouchesOpen),
      firstReceptionsAllOrigins: pressBlock(PRESSURE_R, firstTouchesAllOrigins),
      sensitivityTight: pressBlock(PRESSURE_R_TIGHT, firstTouchesOpen),
      sensitivityTightest: pressBlock(PRESSURE_R_TIGHTEST, firstTouchesOpen),
      nearestOpponentAtReception: nearestOppDist,
      nearestOpponentPopulation: 'openPlay-origin first receptions',
      engineTriggerRangeM: [
        round(Math.min(...allTouches.map((t) => t.engineTrigger)), 4),
        round(Math.max(...allTouches.map((t) => t.engineTrigger)), 4),
      ],
    },

    discriminatorH169a: {
      frozenExAnte: 'Among the FIRST reception of each spell, compare P(spell lost here | pressed) '
        + 'against P(spell lost here | unpressed) at the frozen radius. READING RULE (frozen '
        + 'before any run): ratio ≥ 1.5 AND absolute gap ≥ 0.10 ⇒ PRESSED-SPECIFIC, the outlet '
        + 'story holds; ratio ≤ 1.2 OR gap ≤ 0.05 ⇒ NOT pressed-specific, the disease is '
        + 'elsewhere; anything between ⇒ AMBIGUOUS. ⭐ REPORTED, NEVER GATED — the commander rules.',
      population: '⭐ openPlay-ORIGIN spells\' first receptions ONLY (#171.1.iv). '
        + 'Restart/kickoff-origin receptions are set-piece geometry and are excluded from the '
        + 'headline; the all-origins variant is carried beside it, labelled, for context.',
      ...discOpen,
      allOriginsVariant: {
        note: '⚠ CONTEXT ONLY — the same contrast on ALL first receptions (openPlay + restart + '
          + 'kickoff). NOT the frozen discriminator; it is here so the population choice is '
          + 'auditable rather than hidden.',
        ...discAllOrigins,
      },
    },

    eventsPerMinute: {
      axisNote: `MAPPING: ${MATCH_DURATION} sim-s ⇔ ${DISPLAY_MINUTES} display-min ⇒ 1 sim-s = `
        + `${round(DISPLAY_MINUTES / MATCH_DURATION, 6)} display-min; per-display-min = `
        + `per-sim-s × ${round(SIM_S_PER_DISPLAY_MIN, 6)}. Both axes are given for EVERY rate, `
        + 'and BOTH divide the SAME denominator — mean match.simTime (played sim-seconds), NOT '
        + 'simTick · DT — so the law reproduces exactly (#171.1.ii).',
      scopeNote: '⚠ every count here is a BOTH-TEAMS sum per match. passes / shots / fouls also '
        + 'carry perTeamPerMatch (= sum / 2), which is the scope the per-TEAM bands B9 (shots '
        + '10–14.5) and B10 (fouls 9–12) are stated in.',
      passes: evTeam('passes'),
      passesCompleted: ev('passesCompleted'),
      shots: evTeam('shots'),
      fouls: evTeam('fouls'),
      goals: ev('goals'),
      miscontrols: ev('miscontrols'),
      regains: bothAxes(regainsPerMatch, simSecondsPerMatch),
      turnovers: bothAxes(turnoversPerMatch, simSecondsPerMatch),
      possessionChanges: bothAxes(spellsPerMatch, simSecondsPerMatch),
    },

    ci95PerMatch: {
      note: `deterministic percentile bootstrap, ${BOOTSTRAP_RESAMPLES} resamples, stats base `
        + `${BOOTSTRAP_SEED} (+ per-arm offset) — the STATS stream, never the match RNG.`,
      spellsPerMatch: ci(per.map((p) => p.spells.length), 1).map((v) => round(v, 4)),
      openSpellMeanLengthS: ci(per.map((p) => mean(p.spells.filter((s) => s.origin === 'openPlay').map(spellDur))), 2)
        .map((v) => round(v, 4)),
      passesPerMatch: ci(per.map((p) => p.stats.passes), 3).map((v) => round(v, 4)),
      turnoversPerMatch: ci(per.map((p) => p.spells.filter((s) => s.terminator === 'opponentControl').length), 4)
        .map((v) => round(v, 4)),
    },
  };
}

// =============================================================================
// THE DETERMINISTIC EXPERIMENT (run TWICE for X-DET)
// =============================================================================
function runExperiment(label: string) {
  const seeds = Array.from({ length: SEED_COUNT }, (_, k) => SEED_BASE + k);
  const byArm: Record<string, unknown> = {};
  const spellsPerMatchByArm: Record<string, number> = {};
  for (let ai = 0; ai < ARMS.length; ai++) {
    const arm = ARMS[ai];
    const per: MatchCensus[] = [];
    for (let i = 0; i < seeds.length; i++) {
      per.push(censusOne(arm, seeds[i]));
      if ((i + 1) % PROGRESS_EVERY === 0 || i + 1 === seeds.length) {
        process.stderr.write(
          `[tempo-census ${label}] ${arm} ${i + 1}/${seeds.length}\n`,
        );
      }
    }
    byArm[arm] = aggregateArm(arm, per, ai * 10);
    spellsPerMatchByArm[arm] = mean(per.map((p) => p.spells.filter((s) => s.origin === 'openPlay').length));
  }
  return { seeds: { base: SEED_BASE, count: SEED_COUNT, first: seeds[0], last: seeds[seeds.length - 1] }, arms: byArm, spellsPerMatchByArm };
}

const t0 = Date.now();
const experiment = runExperiment('pass1');
const t1 = Date.now();
const wallPerMatchMs = (t1 - t0) / Math.max(1, SEED_COUNT * ARMS_COUNT);

let xDet = true;
if (!SKIP_DET) {
  const second = runExperiment('pass2');
  xDet = canonical(second) === canonical(experiment);
}

// =============================================================================
// THE X-FAMILY
// =============================================================================
const inBlock = (s: number, b: readonly [number, number]): boolean => s >= b[0] && s <= b[1];
const mySeeds = { base: SEED_BASE, lo: SEED_BASE, hi: SEED_BASE + Math.max(0, SEED_COUNT - 1) };
const smokeBlock: [number, number] = [SMOKE_BASE, SMOKE_BASE + SMOKE_MATCHES - 1];
const censusBlock: [number, number] = [CENSUS_BASE, CENSUS_BASE + CENSUS_N_CAP - 1];
const disjoint = (() => {
  const aboveCeiling = mySeeds.lo > CONSUMED_CEILING;
  const collisions = CONSUMED_BLOCKS.filter((b) =>
    inBlock(mySeeds.lo, b as unknown as [number, number]) || inBlock(mySeeds.hi, b as unknown as [number, number])
    || (mySeeds.lo <= b[0] && mySeeds.hi >= b[1]));
  const ownBlocksDisjoint = smokeBlock[1] < censusBlock[0];
  const insideReserved = mySeeds.lo >= RESERVED_BAND[0] && mySeeds.hi <= RESERVED_BAND[1];
  const consumedStats: readonly number[] = CONSUMED_STATS;
  // 102,200 is itself in the published list but UNSPENT (#166.2.ii) — it is excluded from
  // its own gap test and every OTHER published base must sit ≥ STATS_GAP_MIN away.
  const statsOk = consumedStats.every((s) => s === BOOTSTRAP_SEED
    || Math.abs(s - BOOTSTRAP_SEED) >= STATS_GAP_MIN)
    && consumedStats.every((s) => Math.abs(s - RESERVED_STATS_SEED) >= STATS_GAP_MIN);
  return {
    used: mySeeds, consumedCeiling: CONSUMED_CEILING, aboveCeiling,
    collisions: collisions.map((b) => [b[0], b[1]]),
    ownBlocksDisjoint, insideReserved,
    smokeBlock, censusBlock, reservedBand: RESERVED_BAND,
    statsBase: BOOTSTRAP_SEED, statsReserved: RESERVED_STATS_SEED, statsGapMin: STATS_GAP_MIN,
    statsNote: 'stats base 102,200 is PUBLISHED BUT UNSPENT per #166.2.ii — reused here by that '
      + 'explicit finding; the nearest other published base is 102,000 (gap 200 = the floor).',
    statsOk,
    pass: aboveCeiling && collisions.length === 0 && ownBlocksDisjoint && insideReserved && statsOk,
  };
})();

let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
const xSrcZero = srcDiff === '';

let fingerprint = 'skipped'; let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fingerprint = 'skipped (preflight)'; } else {
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  xFpProd = fingerprint === FINGERPRINT_BASELINE;
}

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

// --- ⭐ the SIZING arithmetic (smoke only, shown in full) ---------------------
const sizing = (() => {
  const worst = Math.min(...ARMS.map((a) => experiment.spellsPerMatchByArm[a]));
  const nRaw = worst > 0 ? Math.ceil(TARGET_SPELLS_PER_ARM / worst) : Number.NaN;
  const nStepped = Number.isFinite(nRaw) ? Math.ceil(nRaw / N_STEP) * N_STEP : Number.NaN;
  const wallBudgetMs = WALL_BUDGET_HOURS * 3_600_000;
  const nWall = Math.floor(wallBudgetMs / (wallPerMatchMs * ARMS_COUNT * XDET_FACTOR));
  const nStar = Math.min(nStepped, nWall, CENSUS_N_CAP);
  return {
    targetSpellsPerArm: TARGET_SPELLS_PER_ARM,
    openPlaySpellsPerMatchByArm: Object.fromEntries(
      ARMS.map((a) => [a, round(experiment.spellsPerMatchByArm[a], 4)]),
    ),
    bindingArmSpellsPerMatch: round(worst, 4),
    nRaw, nStepped, nStep: N_STEP,
    wallPerMatchMs: round(wallPerMatchMs, 3),
    wallBudgetHours: WALL_BUDGET_HOURS,
    nAffordableAtBudget: nWall,
    nCap: CENSUS_N_CAP,
    nStar: Number.isFinite(nStar) ? nStar : null,
    projectedWallHours: Number.isFinite(nStar)
      ? round((nStar * ARMS_COUNT * XDET_FACTOR * wallPerMatchMs) / 3_600_000, 3) : null,
    arithmetic: `N* = min( ceil(${TARGET_SPELLS_PER_ARM} / spellsPerMatch_binding) rounded up to `
      + `${N_STEP}, floor(budget / (ms_per_match × ${ARMS_COUNT} arms × ${XDET_FACTOR} X-DET)), `
      + `${CENSUS_N_CAP} ) — frozen BEFORE the smoke ran.`,
  };
})();

const gates = {
  xDet, xMergeIdent: mergeIdent.pass, xSrcZero, xFpProd, seedDisjoint: disjoint.pass,
};
const hardGatesPass = Object.entries(gates)
  .filter(([k]) => !(SKIP_DET && k === 'xDet'))
  .every(([, v]) => v === true);

const verdict = MODE === 'smoke'
  ? `SIZING SMOKE — plumbing ${hardGatesPass ? 'GREEN' : 'RED'}; N* = ${sizing.nStar ?? 'n/a'} `
    + `(projected ${sizing.projectedWallHours ?? '?'} h). NO conclusion is drawn from smoke levels.`
  : `ABSOLUTE CENSUS at N=${SEED_COUNT} — plumbing ${hardGatesPass ? 'GREEN' : 'RED'}. `
    + 'Levels are DESCRIPTIVE; the gap table is the commander\'s to adjudicate.';

const body = {
  probe: 'tempo-census',
  ruling: '#170 (granted on #169.5); stage doc docs/world-model/TEMPO-CENSUS.md',
  mode: MODE,
  head,
  preflight: IS_PREFLIGHT,
  staging: {
    arms: ARMS,
    armDefinitions: {
      prod: 'the SHIPPED game — no match flags, no station eye, no gene written.',
      v1: 'A4_WORLD_FLAGS + the PRIOR eye (v4.homePrior) + homePriorObedience 0.5 on BOTH sides.',
      v2: 'v1 + the frozen backLoaded offset family [0,+.4,+.2,0,−.2,−.4] on BOTH sides.',
    },
    declaredConfound: 'prod differs from v1 in TWO ways at once (construction flags AND eye/gene). '
      + 'Deliberate: "production" is the world the user plays, not a single-factor control. NO '
      + 'prod-vs-v1 causal claim is made or permitted.',
    axes: {
      matchDurationSimSeconds: MATCH_DURATION,
      displayMinutes: DISPLAY_MINUTES,
      displayMinPerSimSecond: round(DISPLAY_MINUTES / MATCH_DURATION, 6),
      simSecondsPerDisplayMinute: round(SIM_S_PER_DISPLAY_MIN, 6),
      law: 'EVERY rate appears on BOTH axes. DURATIONS are sim-seconds only and are NEVER '
        + 'rescaled — a 0.3 s hold is 0.3 s on the screen. The gap table never mixes axes.',
      rateDenominator: '⭐ ONE CLOCK (#171.1.ii): mean `match.simTime` — PLAYED sim-seconds — is '
        + 'the denominator of BOTH axes, so perDisplayMinute = perSimSecond × '
        + `${round(SIM_S_PER_DISPLAY_MIN, 6)} holds EXACTLY. \`simTick · DT\` is used in NO rate: `
        + 'simTick (= stepCount) counts the kickoff / goal-pause / half-time steps that simTime '
        + 'skips (Match.ts:1113–1134). That pause-inclusive clock is emitted once per arm as '
        + '`wallSimSecondsPerMatch`, labelled as context.',
      trace: 'Match.ts:1058 — displayMinute = min(45, floor((simTime / duration) · 90)) per half.',
    },
    frozenRadii: {
      primaryM: PRESSURE_R, primaryTrace: 'TOUCH_CONTROL_DIST, src/sim/constants.ts:315',
      tightM: PRESSURE_R_TIGHT, tightTrace: 'CONTEST_RADIUS, src/sim/constants.ts:256',
      tightestM: PRESSURE_R_TIGHTEST,
      tightestTrace: `CONTROL_RADIUS, src/sim/constants.ts:244 = 1.25 × CONTROL_REACH_SCALE `
        + `(constants.ts:31, positiveEnv('CONTROL_REACH_SCALE') ?? 1 — env-scalable, NOT a flat `
        + `1.25). Observed at RUNTIME in this process: CONTROL_REACH_SCALE = `
        + `${CONTROL_REACH_SCALE} ⇒ CONTROL_RADIUS = ${CONTROL_RADIUS} m, which is the value `
        + 'actually used by the sensitivityTightest block (#171.1 finding 5).',
      controlReachScaleObserved: CONTROL_REACH_SCALE,
      controlRadiusFormula: 'CONTROL_RADIUS = 1.25 × CONTROL_REACH_SCALE',
      engineReceptionTrigger: 'trigger = 3.0 + team.genome.tempo · 1.5 (Match.ts:1710) ⇒ 3.0–4.5 m; '
        + 'REPORTED as observed range, never used as the frozen radius (it moves with the arm).',
    },
    frozenFirstTouchWindowS: FIRST_TOUCH_S,
    frozenFirstTouchTrace: 'p.firstTouchWindow = 0.28 (Match.ts:1725) — the engine\'s own 一脚出球 window.',
    seedLedger: disjoint,
    sizingFrozen: {
      targetSpellsPerArm: TARGET_SPELLS_PER_ARM, nStep: N_STEP,
      wallBudgetHours: WALL_BUDGET_HOURS, nCap: CENSUS_N_CAP, xDetFactor: XDET_FACTOR,
    },
    buckets: {
      spellSeconds: SPELL_BUCKETS_S, touchesPerSpell: TOUCH_BUCKETS, holdSeconds: HOLD_BUCKETS_S,
    },
    foulLookaheadTicks: FOUL_LOOKAHEAD_TICKS,
  },
  referenceBands: {
    houseLaw: '⭐⭐ THESE BANDS GATE NOTHING. They are REFERENCE LINES for the commander\'s gap '
      + 'table. VISION §3 house law: curve shapes and causal seats may be referenced, CONSTANTS '
      + 'ARE NEVER IMPORTED — no number here reaches any sim value, and none is a target.',
    scaleCaveat: '⚠ EVERY band is ELEVEN-a-side full-pitch football. Our world is 6v6 on a '
      + '0.70-scaled pitch (63.0 × 40.6 m) with 240 sim-seconds mapped to 90 display-minutes. '
      + 'Counts (passes, shots) are NOT comparable across that gap; the DURATION and SHAPE '
      + 'bands (spell length, time on the ball, touches per possession, the first-touch share) '
      + 'are the ones worth reading, because a human body\'s time is the same in both games.',
    gradeKey: 'O/T/I/S = the eFootball research file\'s own evidence grades (§0). '
      + 'P = labelled PUBLIC real-football estimate with its citation. D = DERIVED from another '
      + 'band (arithmetic shown). ABSENT = no honest source exists ⇒ no band.',
    bands: REFERENCE_BANDS,
  },
  result: experiment,
  wall: {
    perMatchMs: round(wallPerMatchMs, 3),
    note: 'measured OUTSIDE the X-DET-compared core (#128) — excluded from resultSha256.',
  },
  sizing: MODE === 'smoke' ? sizing : { note: 'sizing is a SMOKE-mode output only.' },
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xMergeIdent: { ...mergeIdent, note: 'the injected P3p-1 merged table identity (inherited HARD gate)' },
    xSrcZero: { pass: xSrcZero, srcDiffStat: srcDiff, note: 'this stage adds ZERO src/** — it is a pure tick-walk observer' },
    xFpProd: { pass: xFpProd, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, skipped: SKIP_FP },
    seedDisjoint: disjoint,
  },
  gates, hardGatesPass,
  deviations: [
    'THE PROD ARM IS A TWO-FACTOR DIFFERENCE from v1 (construction flags + eye/gene), declared '
    + 'above. It is the world the user plays; it is not a control.',
    'A TOUCH IS AN OWNERSHIP EPISODE, not a foot-ball contact. `Match` exposes `ball.owner`, not '
    + 'a contact event, so an episode shorter than one tick (1/60 s) is invisible and a contact '
    + 'that never establishes control is counted only through its effect on ownership. Deriving '
    + 'it from observable state is REQUIRED by X-SRC-ZERO (#170.1); the alternative was a src '
    + 'change, which is forbidden.',
    'KICK EXECUTION TIME IS ABSENT ON THE PROD ARM by the substrate\'s own construction: '
    + '`pendingKick` is null unless the c7Windup seam is armed. That absence is REPORTED as the '
    + 'finding it is (VISION §2\'s C7 seat), not patched.',
    'SPELL DURATION INCLUDES IN-SPELL LOOSE TIME (a pass in flight, a dribble knock) — the Opta '
    + '"sequence" shape, so the duration band is read against like for like. The '
    + 'controlled-time-only variant is reported beside it for the honest second read.',
    'FOULS ARE ATTRIBUTED BY LEDGER DELTA within ±6 ticks of a spell\'s terminating tick '
    + '(`team.stats.fouls` is the only observable), so an "advantage" foul that does not stop '
    + 'play may land on the wrong side of a spell boundary. Bounded and declared.',
    'THE REFERENCE BANDS ARE 11v11. Two are ABSENT (spell quantiles, first-touch-death share) '
    + 'because no honest source exists; two are DERIVED with the arithmetic shown; two (shots, '
    + 'fouls) rest on a SINGLE team-season datapoint and are labelled WEAK.',
  ],
  registeredNonClaims: [
    'NOTHING SHIPS (Road B): zero src/** changes, the production fingerprint 57b0bdab…c673 '
    + 'unchanged, every flag armed ONLY inside this instrument.',
    'THE BANDS GATE NOTHING. No PASS/FAIL is computed against any reference value anywhere in '
    + 'this probe. The verdict field reports PLUMBING only.',
    'THE H-169a DISCRIMINATOR IS A READING, NOT A RULING. Its thresholds were frozen before any '
    + 'run so the reading cannot be fitted after sight; the commander adjudicates.',
    'NO WATCHABILITY CLAIM. Tempo FEEL belongs to the user\'s eyes (#152); this instrument only '
    + 'puts a number beside the 1.1/1.2× intuition (VISION §2, 2026-07-27).',
    'NO MECHANIC IS PROPOSED HERE. The outlet-seats vs punish-compactness fork is the commander\'s '
    + 'to present after the gap table (#170.3).',
  ],
  verdict,
};

const resultSha256 = createHash('sha256').update(canonical({
  staging: body.staging, referenceBands: body.referenceBands, result: body.result,
})).digest('hex');
const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({ ...body, resultSha256, sha256 }, null, 2)}\n`);

console.error(
  `TEMPO-CENSUS [${MODE}] ${verdict.slice(0, 70)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''}`
  + ` · xDet ${xDet} · xMerge ${mergeIdent.pass} · srcZero ${xSrcZero} · xFp ${xFpProd}`
  + ` · disj ${disjoint.pass} · wall/match ${round(wallPerMatchMs, 1)} ms`
  + ` · resultSHA ${resultSha256.slice(0, 12)} → ${OUT_PATH}`,
);
