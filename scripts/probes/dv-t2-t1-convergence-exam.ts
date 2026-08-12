/**
 * DV T2-T1 — THE CONVERGENCE EXAM (docs/world-model/DV-T2-T1-CONVERGENCE-EXAM.md).
 *
 * The FIFTH REGISTRATION is scored here. Contract DV-T2-LEARNED-MAP-CONTRACT.md §1/§3,
 * under commander ruling #257.3 (the exam frame: bare world DOORS SHUT, LEARN-ONLY the
 * registration's arm, LEARN+CONSUME reported, OFF the identity anchor, the predicate
 * SHARPENED into a conjunction, M sized EX ANTE).
 *
 * ⭐ INSTRUMENT-ONLY ROUND: `src/**` is byte-untouched (X-SRC-UNTOUCHED is a HARD gate).
 * ⭐ #247: this probe may READ the committed censuses; `src/**` may not (G-VALUES-UNREACHABLE).
 *
 * RUN: npx tsx scripts/probes/dv-t2-t1-convergence-exam.ts
 *      DVT2T1_MODE=guard npx tsx ... — the exit-semantics guard block, reds G-CLEAN-INVOCATION,
 *      writes to /tmp and exits 1. A guarded run is BY DEFINITION not the exam.
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import {
  appendFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT } from '../../src/sim/constants';
import { DV_ZONES } from '../../src/ai/deliveryValueSeat';
import { DeliveryAccountBook } from '../../src/ai/deliveryAccountBook';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { mtArmedVersion, MT_WORLD_FLAGS } from '../../src/game/a4World';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 PATHS, MODE, THE EXIT-SEMANTICS GUARD                                   */
/* ========================================================================== */
const CANON_OUT = 'docs/world-model/data/dv-t2-t1-convergence-exam.json';
const GUARD_OUT = '/tmp/dv-t2-t1-guarded-run.json';
const CHECKPOINT_PATH = '/tmp/dv-t2-t1-checkpoint.jsonl';
/** ⭐ INSTRUMENT-SIDE ONLY (#247). */
const DVC0_PATH = 'docs/world-model/data/dv-c0-loss-cost.json';
const T2C0_PATH = 'docs/world-model/data/dv-t2-c0-pass-level-census.json';
const T2T0_PATH = 'docs/world-model/data/dv-t2-t0-learning-seam.json';

/** ANY override routes the whole run onto the guard block and can never be the exam. */
const OVERRIDES = ['DVT2T1_MODE', 'DVT2T1_R', 'DVT2T1_M', 'DVT2T1_SKIP_FP'] as const;
const overridesPresent = OVERRIDES.filter((k) => process.env[k] !== undefined);
const GUARDED = overridesPresent.length > 0;
const OUT_PATH = GUARDED ? GUARD_OUT : CANON_OUT;

/* ========================================================================== */
/* §1 THE FROZEN DESIGN — every literal below is frozen BEFORE the battery and */
/*    machine-checked against the committed artifacts by G-N (the G-N form).   */
/* ========================================================================== */
/** replicates; each replicate is ONE persistent `dvLearnedBooks` set = 2 books. */
const R_FROZEN = 20;
/** matches per replicate — the ex-ante sized run length. */
const M_FROZEN = 440;
/** the frozen ordered-book-share threshold (ruling #257.3(c): freeze it ≥ 0.9). */
const TAU = 0.90;
/** the ex-ante power target for the CONJUNCTION under census-true rates. */
const POWER_TARGET = 0.80;
/** the M search grid the N rule minimises over. */
const M_GRID_STEP = 20;
const M_GRID_MAX = 600;
/** the frozen LEARNING-CURVE checkpoints (logarithmic in M, ending at M). */
const CHECKPOINTS: readonly number[] = [10, 20, 40, 80, 160, 320, 440];
/** the wall cap, declared ex ante (seconds of battery wall the exam may buy). */
const WALL_CAP_S = 7200;
/** the seed-room cap: the pre-registered battery band's size. */
const SEED_ROOM = 9000;

/** the sizing outputs, FROZEN before the battery (G-N recomputes and compares). */
const FROZEN_SIZING = {
  deff: 1.692308,
  designDeliveryRates: [10.425, 23.75, 4.625],
  designPunishRatesCensus: [0.036554, 0.030211, 0.019361],
  designPunishRatesSmoke: [0.034772, 0.02363, 0.010811],
  mStar: 440,
  qPerBook: 0.92482,
  limbIPower: 0.999999,
  limbIIPowerConservative: 0.813079,
  limbIIPowerIndependent: 0.820799,
  conjunctionPowerConservative: 0.813078,
  mdeOwnMinusMiddlePp: 0.6264,
} as const;

/* ---- the frozen league-identity baseline (PRE-CHANGE, inherited UNTRUNCATED) -------- */
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/* ---- the guard tolerances, inherited VERBATIM from DV-T1/#251 ---------------------- */
const NI_FRACTION = 1 - 0.275 / 0.380;
const SAMPLE_EVERY = 10;
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;

/* ---- the estimator ---------------------------------------------------------------- */
const BOOTSTRAP = 2000;
const STATS_BASE = 107_800;
const STATS_PUBLISHED_BASES: readonly number[] = [
  91_100, 91_300, 91_500, 100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000,
  103_400, 104_000, 104_400, 105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400,
];

/* ---- §SEED LEDGER ----------------------------------------------------------------- */
const SMOKE_BASE = 12_438_000; //   12,438,000–011 the sampler-inertness + core block
const SMOKE_N = 12;
const GUARD_BASE = 12_438_050; //   12,438,050–099 the exit-semantics guard block
const GUARD_SPAN = 50;
const GWORLD_SEED = 12_438_999; //  constructed, never stepped
const BATTERY_BASE = 12_439_000; // 12,439,000 + r*M + i

const R = GUARDED ? Number(process.env.DVT2T1_R ?? 2) : R_FROZEN;
const M = GUARDED ? Number(process.env.DVT2T1_M ?? 6) : M_FROZEN;
const seedOf = (r: number, i: number): number => (GUARDED
  ? GUARD_BASE + ((r * M + i) % GUARD_SPAN)
  : BATTERY_BASE + r * M_FROZEN + i);

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat block (repro receipt)', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
  { name: 'O2-T1 smoke (#222)', range: [12_422_000, 12_422_011] },
  { name: 'O2-T1 guard (#222)', range: [12_422_050, 12_422_099] },
  { name: 'O2-T1 battery + reserve (#222)', range: [12_422_100, 12_422_899] },
  { name: 'CTB-T0 receipts + corner/smoke read (#224)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds (#224)', range: [12_423_900, 12_423_901] },
  { name: 'OBM-T0 receipts + geometry/EPI/smoke read (#228)', range: [12_424_000, 12_424_024] },
  { name: 'OBM-T0 REPORTED cost reading (#228)', range: [12_424_025, 12_424_025] },
  { name: 'OBM-T1 smoke (#228.6/#230)', range: [12_424_026, 12_424_037] },
  { name: 'OBM-T1 delivered-dose read (#230)', range: [12_424_040, 12_424_040] },
  { name: 'OBM-T1 guard band (#230)', range: [12_424_050, 12_424_099] },
  { name: 'OBM-T1 battery + reserve (#230)', range: [12_424_100, 12_424_899] },
  { name: 'OBM-T0 test-file seeds (#228)', range: [12_424_900, 12_424_906] },
  { name: 'PTP-T0 receipts + geometry/EPI-MOTION/smoke read (#232)', range: [12_425_000, 12_425_024] },
  { name: 'PTP-T0 REPORTED cost reading (#232)', range: [12_425_025, 12_425_025] },
  { name: 'PTP-T1 smoke (#232.3/#233)', range: [12_425_026, 12_425_037] },
  { name: 'PTP-T1 delivered-dose read (#233)', range: [12_425_040, 12_425_040] },
  { name: 'PTP-T1 guard band (#233)', range: [12_425_050, 12_425_099] },
  { name: 'PTP-T1 battery + reserve (#233/#234)', range: [12_425_100, 12_425_727] },
  { name: 'PTP-T0 test-file seeds (#232)', range: [12_425_900, 12_425_906] },
  { name: 'DLC-T0 receipts + contest/winner/EPI/smoke read (#237)', range: [12_426_000, 12_426_024] },
  { name: 'DLC-T0 REPORTED chooser-cost reading (#237)', range: [12_426_025, 12_426_025] },
  { name: 'DLC-T1 smoke (#238)', range: [12_426_030, 12_426_041] },
  { name: 'DLC-T1 delivered-dose read (#238)', range: [12_426_045, 12_426_045] },
  { name: 'DLC-T1 guard band (#238)', range: [12_426_050, 12_426_099] },
  { name: 'DLC-T1 battery + reserve (#238/#239)', range: [12_426_100, 12_426_727] },
  { name: 'DLC-T0 test-file seeds (#237)', range: [12_426_900, 12_426_906] },
  { name: 'DLC-T0s receipts + grid/winner/EPI/smoke/decode read (#242)', range: [12_427_000, 12_427_024] },
  { name: 'DLC-T0s REPORTED chooser-cost reading (#242)', range: [12_427_025, 12_427_025] },
  { name: 'DLC-T0s test-file seeds (#242)', range: [12_427_900, 12_427_906] },
  { name: 'DLC-T1s smoke (#243)', range: [12_428_000, 12_428_011] },
  { name: 'DLC-T1s delivered-dose read (#243)', range: [12_428_015, 12_428_015] },
  { name: 'DLC-T1s strike read (#243)', range: [12_428_020, 12_428_020] },
  { name: 'DLC-T1s guard band (#243)', range: [12_428_050, 12_428_099] },
  { name: 'DLC-T1s battery + reserve (#243/#244)', range: [12_428_100, 12_428_899] },
  { name: 'DLC-T1s test-file seed band (#243)', range: [12_428_900, 12_428_906] },
  { name: 'DV-C0 smoke (#249)', range: [12_429_000, 12_429_011] },
  { name: 'DV-C0 exit-semantics guard block (#249)', range: [12_429_050, 12_429_099] },
  { name: 'DV-C0 census + reserve (#249)', range: [12_429_100, 12_429_899] },
  { name: 'DV-C0 G-WORLD construction seed (#249)', range: [12_429_999, 12_429_999] },
  { name: 'DV-T0 receipts + reads (#250)', range: [12_430_000, 12_430_026] },
  { name: '⚠ DV-T0 test-file seeds (#250 — THE ORDERED SKIP BAND)', range: [12_430_900, 12_430_911] },
  { name: 'DV-T1 smoke + reads + guard + battery (#251)', range: [12_430_027, 12_430_382] },
  { name: 'DV-T1b smoke + reads + guard + battery (#252)', range: [12_431_000, 12_431_742] },
  { name: 'DV-T1b reserved ceiling (#251.2)', range: [12_431_900, 12_431_999] },
  { name: 'DV-T1c smoke + reads + guard + battery (#253/#254)', range: [12_432_000, 12_434_035] },
  { name: 'DV-T1c reserved ceiling (#253.1)', range: [12_435_000, 12_435_099] },
  { name: 'T2-C0 smoke (#256)', range: [12_436_000, 12_436_011] },
  { name: 'T2-C0 wrapper-inertness twin (#256)', range: [12_436_020, 12_436_020] },
  { name: 'T2-C0 exit-semantics guard block (#256)', range: [12_436_050, 12_436_099] },
  { name: 'T2-C0 census + reserve (#256)', range: [12_436_100, 12_436_899] },
  { name: 'T2-C0 G-WORLD construction seed (#256)', range: [12_436_999, 12_436_999] },
  // ⭐ T2-T0's own four blocks (#257.4), read off its committed §SEED LEDGER.
  { name: 'T2-T0 receipts + reads (#257)', range: [12_437_000, 12_437_029] },
  { name: 'T2-T0 REPORTED dormant-armed smoke (#257)', range: [12_437_100, 12_437_139] },
  { name: 'T2-T0 test-file seeds (#257)', range: [12_437_900, 12_437_911] },
];

/* ========================================================================== */
/* §2 SMALL TOOLS                                                             */
/* ========================================================================== */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walkValue = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walkValue);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walkValue(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walkValue(v));
};
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0
  ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const sdOf = (xs: readonly number[]): number => {
  if (xs.length < 2) return Number.NaN;
  const mu = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - mu) ** 2, 0) / (xs.length - 1));
};
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  const idx = (s.length - 1) * q;
  const lo = Math.floor(idx); const hi = Math.ceil(idx);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (idx - lo);
};

/* ========================================================================== */
/* §3 THE EX-ANTE SIZING — recomputed FROM the two committed artifacts         */
/* ========================================================================== */
const readJson = (p: string): Record<string, unknown> =>
  JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;
const t2c0 = readJson(T2C0_PATH);
const t2t0 = readJson(T2T0_PATH);
const dvc0 = readJson(DVC0_PATH);
const t2c0Census = ((t2c0.result as Record<string, unknown>).census
  ?? {}) as Record<string, unknown>;
const yardstick = t2c0Census.yardstick as {
  schema: string; windowS: number;
  zones: Record<string, { punishRate: number; deliveries: number; punished: number;
    ci95: [number, number] }>;
  relative: Record<string, number>; ordering: string[];
  eventRateMoments: { zone: string; deliveriesPerTeamPerMatch: number;
    punishedPerTeamPerMatch: number }[];
};
const t2c0Accounting = t2c0Census.accounting as {
  punishedPrimary: number;
  perWindow: { windowS: number; attributed: number }[];
};
const t2t0Smoke = (((t2t0.result as Record<string, unknown>).reported
  ?? {}) as Record<string, unknown>).smoke as {
    matches: number;
    rows: { zone: string; bookDeliveries: number; bookPunished: number }[];
  };

/** ⭐ RELATIVES FROM RAW COUNTS (#256.1's 5-dp LOW): never from the stored rounded rate. */
const rateFromCounts = (punished: number, deliveries: number): number => (deliveries > 0
  ? punished / deliveries : 0);
const censusRates = DV_ZONES.map((z) => rateFromCounts(
  yardstick.zones[z].punished, yardstick.zones[z].deliveries,
));
const censusRelative = ((): number[] => {
  const mu = mean(censusRates);
  return censusRates.map((r) => r / mu);
})();
const censusDeliveryRates = DV_ZONES.map((z) => (yardstick.eventRateMoments
  .find((m) => m.zone === z)?.deliveriesPerTeamPerMatch ?? Number.NaN));
const smokeTeamMatches = t2t0Smoke.matches * 2;
const smokeRates = DV_ZONES.map((z) => {
  const row = t2t0Smoke.rows.find((r) => r.zone === z);
  return rateFromCounts(row?.bookPunished ?? 0, row?.bookDeliveries ?? 0);
});
const smokeDeliveryRates = DV_ZONES.map((z) => {
  const row = t2t0Smoke.rows.find((r) => r.zone === z);
  return (row?.bookDeliveries ?? 0) / smokeTeamMatches;
});
/** the CONSERVATIVE per cell: the LOWER delivery rate of the two committed sources. */
const designDeliveryRates = DV_ZONES.map((_z, i) => Math.min(
  censusDeliveryRates[i], smokeDeliveryRates[i],
));
/** ⭐ THE CHAIN DESIGN EFFECT, from committed counts: punished DELIVERIES ÷ the goals
 *  they share (T2-C0's primary-window attributed count). A chain-level label means the
 *  punished count is over-dispersed relative to binomial; this is the ex-ante inflation,
 *  and it is a LOWER bound (equal-sized clusters). */
const DEFF = t2c0Accounting.punishedPrimary
  / (t2c0Accounting.perWindow.find((w) => w.windowS === yardstick.windowS)?.attributed ?? 1);

const binomPmf = (n: number, p: number): Float64Array => {
  const out = new Float64Array(n + 1);
  out[0] = Math.exp(n * Math.log1p(-p));
  let lc = 0;
  for (let k = 1; k <= n; k++) {
    lc += Math.log((n - k + 1) / k);
    out[k] = Math.exp(lc + k * Math.log(p) + (n - k) * Math.log1p(-p));
  }
  return out;
};
const cdfOf = (pmf: Float64Array): Float64Array => {
  const c = new Float64Array(pmf.length);
  let s = 0;
  for (let i = 0; i < pmf.length; i++) { s += pmf[i]; c[i] = s; }
  return c;
};
/** effective per-zone book counts at M matches (the design effect applied). */
const nEff = (m: number): number[] => designDeliveryRates
  .map((d) => Math.max(1, Math.round((d * m) / DEFF)));
/** ⭐ q(M) — the probability ONE book is STRICTLY ordered own > middle > final. */
const qPerBook = (m: number, rates: readonly number[]): number => {
  const n = nEff(m);
  const pmf = n.map((nn, i) => binomPmf(nn, rates[i]));
  const cdf = pmf.map(cdfOf);
  let tot = 0;
  for (let km = 0; km <= n[1]; km++) {
    const pm = pmf[1][km];
    if (pm < 1e-15) continue;
    const rm = km / n[1];
    const thrO = rm * n[0];
    let kO = Math.floor(thrO);
    if (Math.abs(thrO - Math.round(thrO)) < 1e-9) kO = Math.round(thrO);
    const pO = kO >= n[0] ? 0 : 1 - cdf[0][Math.min(kO, n[0])];
    const thrF = rm * n[2];
    let kF = Math.ceil(thrF) - 1;
    if (Math.abs(thrF - Math.round(thrF)) < 1e-9) kF = Math.round(thrF) - 1;
    const pF = kF < 0 ? 0 : cdf[2][Math.min(kF, n[2])];
    tot += pm * pO * pF;
  }
  return tot;
};
/** P(observed ordered share over B books ≥ τ). */
const sharePower = (b: number, q: number, tau: number): number => {
  const need = Math.ceil(tau * b);
  const pmf = binomPmf(b, q);
  let s = 0;
  for (let k = need; k <= b; k++) s += pmf[k];
  return s;
};
const erf = (x0: number): number => {
  const s = x0 < 0 ? -1 : 1; const x = Math.abs(x0);
  const a1 = 0.254829592; const a2 = -0.284496736; const a3 = 1.421413741;
  const a4 = -1.453152027; const a5 = 1.061405429; const p = 0.3275911;
  const t = 1 / (1 + p * x);
  return s * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
};
const normCdf = (z: number): number => 0.5 * (1 + erf(z / Math.SQRT2));
/** LIMB (i): both replicate-mean gaps RESOLVED at SET grain (cluster = replicate). */
const limbIPower = (m: number, r: number, rates: readonly number[]): number => {
  const n = nEff(m);
  const v = (p: number, nn: number): number => (p * (1 - p)) / nn;
  const sd1 = Math.sqrt(v(rates[0], n[0]) + v(rates[1], n[1]));
  const sd2 = Math.sqrt(v(rates[1], n[1]) + v(rates[2], n[2]));
  // CONSERVATIVE: the two books of a replicate are treated as ONE cluster (√R, not √2R).
  const p1 = normCdf((rates[0] - rates[1]) / (sd1 / Math.sqrt(r)) - 1.959964);
  const p2 = normCdf((rates[1] - rates[2]) / (sd2 / Math.sqrt(r)) - 1.959964);
  return Math.min(p1, p2);
};
/** the CONJUNCTION's ex-ante power, in its CONSERVATIVE form (books perfectly correlated
 *  inside a replicate ⇒ the effective book count for the share is R, not 2R). */
const conjunctionPower = (m: number, r: number, rates: readonly number[]): number =>
  limbIPower(m, r, rates) * sharePower(r, qPerBook(m, rates), TAU);

/** THE N RULE, executed: the smallest M on the frozen grid whose CONJUNCTION power under
 *  the WORSE of the two committed rate sources reaches the target; capped by seed room and
 *  by the declared wall. */
const sizing = ((): Record<string, unknown> => {
  const worse = (m: number): { power: number; source: string } => {
    const c = conjunctionPower(m, R_FROZEN, censusRates);
    const s = conjunctionPower(m, R_FROZEN, smokeRates);
    return c <= s ? { power: c, source: 'T2-C0 census' } : { power: s, source: 'T2-T0 smoke' };
  };
  let mRaw = Number.NaN;
  let binding = '';
  const grid: { m: number; powerCensus: number; powerSmoke: number }[] = [];
  for (let m = M_GRID_STEP; m <= M_GRID_MAX; m += M_GRID_STEP) {
    const pc = conjunctionPower(m, R_FROZEN, censusRates);
    const ps = conjunctionPower(m, R_FROZEN, smokeRates);
    grid.push({ m, powerCensus: round(pc, 6), powerSmoke: round(ps, 6) });
    if (!Number.isFinite(mRaw) && Math.min(pc, ps) >= POWER_TARGET) {
      mRaw = m; binding = worse(m).source;
    }
  }
  const seedCap = Math.floor(SEED_ROOM / R_FROZEN);
  // measured ms/match is the smoke's; the wall term uses 3 arms per seed.
  const wallCapAt = (msPerWalk: number): number => Math.floor(
    (WALL_CAP_S * 1000) / (R_FROZEN * 3 * msPerWalk),
  );
  const mde = ((): number => {
    for (let g = censusRates[0] - censusRates[1]; g > 0.0005; g -= 0.00002) {
      const rates = [censusRates[1] + g, censusRates[1], censusRates[2]];
      if (conjunctionPower(mRaw, R_FROZEN, rates) < POWER_TARGET) {
        return round((g + 0.00002) * 100, 4);
      }
    }
    return Number.NaN;
  })();
  return {
    deff: round(DEFF, 6),
    designDeliveryRates: designDeliveryRates.map((v) => round(v, 6)),
    censusDeliveryRates: censusDeliveryRates.map((v) => round(v, 6)),
    smokeDeliveryRates: smokeDeliveryRates.map((v) => round(v, 6)),
    censusRates: censusRates.map((v) => round(v, 6)),
    smokeRates: smokeRates.map((v) => round(v, 6)),
    nEffAtMStar: nEff(mRaw),
    grid,
    mRaw,
    bindingSource: binding,
    seedCap,
    seedCapBinds: seedCap < mRaw,
    mStar: Math.min(mRaw, seedCap),
    qPerBook: round(qPerBook(mRaw, censusRates), 6),
    limbIPower: round(limbIPower(mRaw, R_FROZEN, censusRates), 6),
    limbIIPowerConservative: round(sharePower(R_FROZEN, qPerBook(mRaw, censusRates), TAU), 6),
    limbIIPowerIndependent: round(sharePower(2 * R_FROZEN, qPerBook(mRaw, censusRates), TAU), 6),
    conjunctionPowerConservative: round(conjunctionPower(mRaw, R_FROZEN, censusRates), 6),
    mdeOwnMinusMiddlePp: mde,
    wallCapFormula: 'floor(WALL_CAP_S·1000 / (R · 3 arms · ms/walk)); filled from the smoke',
    wallCapAt100ms: wallCapAt(100),
    booksTotal: 2 * R_FROZEN,
    orderedBooksRequired: Math.ceil(TAU * 2 * R_FROZEN),
  };
})();

/* ========================================================================== */
/* §4 THE WORLD — bare production, DOORS SHUT (#257.2(i) / #257.3(a))          */
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
type Arm = 'off' | 'learnOnly' | 'learnConsume';
const matchOf = (
  seed: number, arm: Arm, books: readonly [DeliveryAccountBook, DeliveryAccountBook] | null,
): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  ...(arm === 'off' ? {} : { dvLearnedMap: true }),
  ...(arm === 'off' || books === null ? {} : { dvLearnedBooks: books }),
  ...(arm === 'learnConsume' ? { dvDeliveryValue: true } : {}),
});

const DOOR_FLAGS = ['ptpPassLead', 'dlcDeliveryChoice', 'dlcStrikePlane', 'obmMovement',
  'ctbSupportPlane', 'o1PassWindup', 'edsPerceivedDefence', 'edsPerceivedChoice',
  'pmPhaseModulation', 'mtMarkTightness', 'ptpPassToPath', 'ctbCheckToBall'] as const;
const GENE_NEEDLES = ['defLaneConvergence', 'markSag', 'passLeadSupport', 'obmMoveWeights',
  'ctbSupportPlane', 'dlcStrikePlaneGene', 'dvExposureWeight', 'dvLossBelief'] as const;
const genomeViews = (m: Match): Record<string, unknown>[] => ([0, 1] as const).flatMap((s) => [
  m.teams[s].info.genome, m.teams[s].baseGenome, m.teams[s].effGenome,
] as unknown as Record<string, unknown>[]);
/** ⭐ THE CONFIGURATION-IDENTITY PREDICATE, DERIVED FOR THIS EXAM (#251.3/#252.3): NINE
 *  conjuncts, each with its own mutant in G-ARMS (the count is the key set below — the
 *  #250.3(i) counting class, checked against the mutant list, not asserted in prose). */
const armConjuncts = (
  m: Match, arm: Arm, books: readonly [DeliveryAccountBook, DeliveryAccountBook] | null,
  seed: number,
): Record<string, boolean> => {
  const mm = m as unknown as Record<string, unknown>;
  const mtKeys = Object.keys(MT_WORLD_FLAGS) as (keyof typeof MT_WORLD_FLAGS)[];
  return {
    learnFlag: m.dvLearnedMap === (arm !== 'off'),
    consumeFlag: m.dvDeliveryValue === (arm === 'learnConsume'),
    booksWired: arm === 'off'
      ? (m as unknown as { dvLearn: unknown }).dvLearn === null
      : (books !== null
        && (m as unknown as { dvLearn: { books?: unknown } | null }).dvLearn !== null),
    doorsShut: DOOR_FLAGS.every((k) => mm[k] !== true),
    mtDoorsShut: mtKeys.every((k) => mm[k] !== true) && mtArmedVersion(m) === 0,
    eyeNull: m.stationEye === null,
    // ⭐ the OFF arm is fully born-absent; the LEARNING arms may carry EXACTLY ONE gene —
    // `dvLossBelief`, written by the team's OWN book at construction from the carried book
    // (Match writes the belief in its constructor when a non-empty book is handed in).
    genesDisciplined: (arm === 'off'
      ? genomeViews(m).every((g) => GENE_NEEDLES.every((k) => g[k] === undefined))
      : genomeViews(m).every((g) => GENE_NEEDLES.filter((k) => k !== 'dvLossBelief')
        .every((k) => g[k] === undefined))),
    // ⭐⭐ THE LAMARCK LIMB (#257.1): the FRANCHISE genome is never written, in any arm.
    noFranchiseBelief: [m.teams[0].info.genome, m.teams[1].info.genome]
      .every((g) => (g as TacticalGenome).dvLossBelief === undefined),
    censusConstruction: m.teams[0].info.genome !== undefined
      && canonical(m.teams[0].info.genome) === canonical(team('A', seed * 2 + 1).genome)
      && canonical(m.teams[1].info.genome) === canonical(team('B', seed * 2 + 2).genome),
  };
};

/** the whole-match signature, INCLUDING the rng stream state (DV-T0's own form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

interface GuardRow {
  interceptions: number; offsides: number; goals: number;
  spreadYOut: number; spacingMedian: number; spacingUnder4: number;
}
interface WalkOut { signature: string; guards: GuardRow; armOk: boolean; ticks: number }
/** the walk. `sample=false` gives the BARE walk (the sampler-inertness twin). */
const walk = (
  seed: number, arm: Arm,
  books: readonly [DeliveryAccountBook, DeliveryAccountBook] | null,
  sample = true,
): WalkOut => {
  const m = matchOf(seed, arm, books);
  const armOk = Object.values(armConjuncts(m, arm, books, seed)).every(Boolean);
  const pairs: number[] = [];
  const spreadOut: number[] = [];
  let samples = 0; let tick = 0;
  while (!m.finished) {
    m.step(DT);
    tick += 1;
    if (!sample) continue;
    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outfield.length === 0) continue;
      const hasBall = m.possessionSide === (t.side as 0 | 1);
      if (!hasBall) {
        const ys = outfield.map((p) => p.pos.y);
        const mu = mean(ys);
        spreadOut.push(Math.sqrt(ys.reduce((a, b) => a + (b - mu) ** 2, 0) / ys.length));
      }
      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) {
            pairs.push(Math.hypot(
              outfield[i].pos.x - outfield[j].pos.x, outfield[i].pos.y - outfield[j].pos.y,
            ));
          }
        }
      }
    }
  }
  const st = [m.teams[0].stats, m.teams[1].stats];
  return {
    signature: signature(m),
    armOk,
    ticks: tick,
    guards: {
      interceptions: st[0].interceptions + st[1].interceptions,
      offsides: st[0].offsides + st[1].offsides,
      goals: st[0].goals + st[1].goals,
      spreadYOut: mean(spreadOut),
      spacingMedian: quantile(pairs, 0.5),
      spacingUnder4: pairs.length === 0 ? Number.NaN
        : pairs.filter((v) => v < CLOSE_PAIR_M).length / pairs.length,
    },
  };
};

/* ========================================================================== */
/* §5 THE BATTERY — one persistent book-set per replicate, no season boundary  */
/* ========================================================================== */
type Cells = { deliveries: number[]; punished: number[] };
interface RepRow {
  r: number; seedFirst: number; seedLast: number; matches: number;
  /** [arm][book 0|1][checkpoint] → cells */
  learnCells: Cells[][];
  consumeCells: Cells[][];
  guards: Record<Arm, GuardRow>;
  byteIdentical: number; armOk: number; labelsClosed: number;
  digest: string;
}
/** the frozen checkpoint list truncated to M, with M appended if truncation dropped it.
 *  ⚠ INERT IN THE EXAM: M = 440 IS the last frozen checkpoint; the append branch exists so
 *  a GUARDED short run still snapshots its own end. */
const checkpointsFor = (m: number): number[] => {
  const cps = CHECKPOINTS.filter((c) => c <= m);
  if (cps[cps.length - 1] !== m) cps.push(m);
  return cps;
};

const snapshot = (b: DeliveryAccountBook): Cells => ({
  deliveries: [...b.deliveries], punished: [...b.punished],
});
const runReplicate = (r: number): RepRow => {
  const learnBooks: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook(),
  ];
  const consumeBooks: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook(),
  ];
  const cps = checkpointsFor(M);
  const learnCells: Cells[][] = [[], []];
  const consumeCells: Cells[][] = [[], []];
  const acc: Record<Arm, GuardRow[]> = { off: [], learnOnly: [], learnConsume: [] };
  let byteIdentical = 0; let armOk = 0;
  for (let i = 0; i < M; i++) {
    const seed = seedOf(r, i);
    const off = walk(seed, 'off', null);
    const lo = walk(seed, 'learnOnly', learnBooks);
    const lc = walk(seed, 'learnConsume', consumeBooks);
    if (off.signature === lo.signature) byteIdentical += 1;
    armOk += (off.armOk ? 1 : 0) + (lo.armOk ? 1 : 0) + (lc.armOk ? 1 : 0);
    acc.off.push(off.guards); acc.learnOnly.push(lo.guards); acc.learnConsume.push(lc.guards);
    if (cps.includes(i + 1)) {
      for (const s of [0, 1]) {
        learnCells[s].push(snapshot(learnBooks[s]));
        consumeCells[s].push(snapshot(consumeBooks[s]));
      }
    }
  }
  const gm = (rows: GuardRow[]): GuardRow => ({
    interceptions: mean(rows.map((x) => x.interceptions)),
    offsides: mean(rows.map((x) => x.offsides)),
    goals: mean(rows.map((x) => x.goals)),
    spreadYOut: mean(rows.map((x) => x.spreadYOut).filter(Number.isFinite)),
    spacingMedian: mean(rows.map((x) => x.spacingMedian).filter(Number.isFinite)),
    spacingUnder4: mean(rows.map((x) => x.spacingUnder4).filter(Number.isFinite)),
  });
  const row: RepRow = {
    r, seedFirst: seedOf(r, 0), seedLast: seedOf(r, M - 1), matches: M,
    learnCells, consumeCells,
    guards: { off: gm(acc.off), learnOnly: gm(acc.learnOnly), learnConsume: gm(acc.learnConsume) },
    byteIdentical,
    armOk,
    labelsClosed: [0, 1].reduce((a, s) => a
      + learnBooks[s].deliveries.reduce((x, y) => x + y, 0), 0),
    digest: '',
  };
  row.digest = sha(canonical({ ...row, digest: '' }));
  return row;
};

/* ---- the CHECKPOINTED long run (#250.1: a torn-down session resumes) ------- */
const loadCheckpoint = (): Map<number, RepRow> => {
  const out = new Map<number, RepRow>();
  if (GUARDED || !existsSync(CHECKPOINT_PATH)) return out;
  for (const line of readFileSync(CHECKPOINT_PATH, 'utf8').split('\n')) {
    if (line.trim().length === 0) continue;
    const row = JSON.parse(line) as RepRow & { design?: string };
    if ((row as { design?: string }).design !== `${R_FROZEN}x${M_FROZEN}`) continue;
    out.set(row.r, row);
  }
  return out;
};
const t0Battery = Date.now();
const done = loadCheckpoint();
const reps: RepRow[] = [];
for (let r = 0; r < R; r++) {
  const cached = done.get(r);
  if (cached !== undefined) {
    reps.push(cached);
    process.stderr.write(`  [dv-t2-t1] replicate ${r} RESUMED from checkpoint\n`);
    continue;
  }
  const t0 = Date.now();
  const row = runReplicate(r);
  reps.push(row);
  if (!GUARDED) {
    appendFileSync(CHECKPOINT_PATH,
      `${JSON.stringify({ ...row, design: `${R_FROZEN}x${M_FROZEN}` })}\n`);
  }
  process.stderr.write(`  [dv-t2-t1] replicate ${r}/${R} done in ${
    Math.round((Date.now() - t0) / 1000)}s (${row.matches} matches × 3 arms)\n`);
}
const batteryWallS = Math.round((Date.now() - t0Battery) / 1000);

/* ========================================================================== */
/* §6 THE SCORING — the SHARPENED predicate (#257.3(c))                       */
/* ========================================================================== */
const CPS = checkpointsFor(M);
const beliefOf = (c: Cells): number[] => c.deliveries.map((d, i) => (d > 0 ? c.punished[i] / d : 0));
const isOrdered = (v: readonly number[]): boolean => v[0] > v[1] && v[1] > v[2];
/** every book (2 per replicate) at every checkpoint. */
const booksAt = (cpIdx: number, which: 'learn' | 'consume'): { r: number; side: number;
  cells: Cells; belief: number[] }[] => reps.flatMap((row) => [0, 1].map((s) => {
  const cells = (which === 'learn' ? row.learnCells : row.consumeCells)[s][cpIdx];
  return { r: row.r, side: s, cells, belief: beliefOf(cells) };
}));

/* ---- the cluster bootstrap (set grain = the REPLICATE), stats base 107,800 -- */
const bootRng = new Rng(STATS_BASE);
const bootIdx: number[][] = Array.from({ length: BOOTSTRAP }, () =>
  Array.from({ length: reps.length }, () => bootRng.int(0, reps.length - 1)));
/** one SHARED resample-index matrix ⇒ every gap is paired by construction. */
const bootCi = (perReplicate: readonly number[]): [number, number] => {
  const stats = bootIdx.map((idx) => mean(idx.map((k) => perReplicate[k])));
  return [quantile(stats, 0.025), quantile(stats, 0.975)];
};

const scoreAt = (cpIdx: number, which: 'learn' | 'consume'): Record<string, unknown> => {
  const books = booksAt(cpIdx, which);
  const byRep = reps.map((row) => {
    const two = books.filter((b) => b.r === row.r);
    return DV_ZONES.map((_z, i) => mean(two.map((b) => b.belief[i])));
  });
  const meanVec = DV_ZONES.map((_z, i) => mean(byRep.map((v) => v[i])));
  const gap1 = byRep.map((v) => v[0] - v[1]);
  const gap2 = byRep.map((v) => v[1] - v[2]);
  const ci1 = bootCi(gap1); const ci2 = bootCi(gap2);
  const orderedBooks = books.filter((b) => isOrdered(b.belief)).length;
  const share = orderedBooks / books.length;
  const relMu = mean(meanVec);
  const relative = meanVec.map((v) => (relMu > 0 ? v / relMu : 0));
  const limbI = isOrdered(meanVec) && ci1[0] > 0 && ci2[0] > 0;
  const limbII = share >= TAU;
  return {
    matches: CPS[cpIdx],
    books: books.length,
    meanVector: meanVec.map((v) => round(v, 6)),
    meanVectorPct: meanVec.map((v) => round(v * 100, 3)),
    relative: relative.map((v) => round(v, 5)),
    gapOwnMinusMiddlePp: round((meanVec[0] - meanVec[1]) * 100, 4),
    ciOwnMinusMiddlePp: [round(ci1[0] * 100, 4), round(ci1[1] * 100, 4)],
    gapMiddleMinusFinalPp: round((meanVec[1] - meanVec[2]) * 100, 4),
    ciMiddleMinusFinalPp: [round(ci2[0] * 100, 4), round(ci2[1] * 100, 4)],
    orderedBooks,
    orderedShare: round(share, 5),
    limbIOrderedResolved: limbI,
    limbIIShareAtThreshold: limbII,
    conjunction: limbI && limbII,
    // REPORTED convergence distance vs the census (never gated, #246)
    l1AbsoluteVsCensus: round(meanVec.reduce((a, v, i) => a + Math.abs(v - censusRates[i]), 0), 6),
    l1RelativeVsCensus: round(
      relative.reduce((a, v, i) => a + Math.abs(v - censusRelative[i]), 0), 5,
    ),
    perBookOrdered: books.map((b) => ({ r: b.r, side: b.side, ordered: isOrdered(b.belief) })),
  };
};

const curveLearn = CPS.map((_c, i) => scoreAt(i, 'learn'));
const curveConsume = CPS.map((_c, i) => scoreAt(i, 'consume'));
const finalLearn = curveLearn[curveLearn.length - 1];
const finalConsume = curveConsume[curveConsume.length - 1];

/* ---- the football guards (REPORTED, at the BANKED tolerances) -------------- */
const GUARD_KEYS = ['interceptions', 'offsides', 'goals', 'spreadYOut', 'spacingMedian',
  'spacingUnder4'] as const;
const GUARD_DIRECTION: Record<string, 'ceiling' | 'floor' | 'flag'> = {
  interceptions: 'ceiling', spreadYOut: 'floor', spacingMedian: 'floor',
  spacingUnder4: 'ceiling', offsides: 'flag', goals: 'flag',
};
const guardRows = (arm: Arm): Record<string, unknown>[] => GUARD_KEYS.map((k) => {
  const deltas = reps.map((row) => row.guards[arm][k] - row.guards.off[k]);
  const control = mean(reps.map((row) => row.guards.off[k]));
  const ci = bootCi(deltas);
  const delta = mean(deltas);
  const tol = NI_FRACTION * Math.abs(control);
  const resolved = ci[0] > 0 || ci[1] < 0;
  const dir = GUARD_DIRECTION[k];
  const beyond = dir === 'ceiling' ? delta > tol : dir === 'floor' ? delta < -tol
    : Math.abs(delta) > tol;
  return {
    ruler: k,
    direction: dir,
    control: round(control, 6),
    tolerance: round(tol, 6),
    delta: round(delta, 6),
    ci95: [round(ci[0], 6), round(ci[1], 6)],
    resolved,
    beyondTolerance: beyond,
    breach: resolved && beyond && dir !== 'flag',
  };
});
const guardsConsume = guardRows('learnConsume');
const guardsLearnOnly = guardRows('learnOnly');

/* ---- the FEEDBACK question (REPORTED): does consuming starve/distort? ------ */
const totalCells = (which: 'learn' | 'consume'): { deliveries: number[]; punished: number[] } => {
  const cells = booksAt(CPS.length - 1, which).map((b) => b.cells);
  return {
    deliveries: DV_ZONES.map((_z, i) => cells.reduce((a, c) => a + c.deliveries[i], 0)),
    punished: DV_ZONES.map((_z, i) => cells.reduce((a, c) => a + c.punished[i], 0)),
  };
};
const feedback = ((): Record<string, unknown> => {
  const l = totalCells('learn'); const c = totalCells('consume');
  const shareOf = (t: { deliveries: number[] }): number[] => {
    const tot = t.deliveries.reduce((a, b) => a + b, 0);
    return t.deliveries.map((d) => d / tot);
  };
  return {
    learnOnlyDeliveries: l.deliveries,
    learnConsumeDeliveries: c.deliveries,
    learnOnlyPunished: l.punished,
    learnConsumePunished: c.punished,
    learnOnlyMix: shareOf(l).map((v) => round(v, 5)),
    learnConsumeMix: shareOf(c).map((v) => round(v, 5)),
    deliveryCountRatio: DV_ZONES.map((_z, i) => round(c.deliveries[i] / l.deliveries[i], 5)),
    question: 'does consuming the growing belief STARVE (fewer deliveries into the '
      + 'punished zones) or DISTORT (a different book) the account book? REPORTED beside '
      + 'the learn-only books; it gates nothing and adjudicates nothing (#203).',
  };
})();

/* ========================================================================== */
/* §7 THE GATES — the FROZEN list; the headline count is this list's length    */
/* ========================================================================== */
const FROZEN_GATE_NAMES = [
  'gDet', 'xSrcUntouched', 'xFpProd', 'gWorld', 'gByteIdentical', 'gArms', 'gBooksLive',
  'gBookMath', 'gYardstick', 'gN', 'gCurve', 'gCells', 'gValuesUnreachable', 'gSeed',
  'gStats', 'gCleanInvocation', 'gResume',
] as const;

/* ---- G-WORLD: bare production, doors shut, on a never-stepped match -------- */
const gWorldRows = ((): Record<string, unknown> => {
  const m = matchOf(GWORLD_SEED, 'off', null);
  const conj = armConjuncts(m, 'off', null, GWORLD_SEED);
  const perMatchArmOk = reps.reduce((a, row) => a + row.armOk, 0);
  const perMatchArmExpected = reps.length * M * 3;
  return {
    ...conj,
    constructionSeed: GWORLD_SEED,
    doorKeys: DOOR_FLAGS,
    geneKeysChecked: GENE_NEEDLES,
    genomeViewsChecked: genomeViews(m).length,
    perMatchArmOk,
    perMatchArmExpected,
    pass: Object.values(conj).every(Boolean) && perMatchArmOk === perMatchArmExpected,
  };
})();
const gWorld = gWorldRows.pass === true;

/* ---- F-DV2-c / G-BYTE-IDENTICAL + the SAMPLER-INERTNESS twin -------------- */
const samplerTwin = Array.from({ length: SMOKE_N }, (_, i) => {
  const seed = GUARDED ? GUARD_BASE + i : SMOKE_BASE + i;
  return walk(seed, 'off', null, true).signature === walk(seed, 'off', null, false).signature;
});
const byteIdenticalTotal = reps.reduce((a, row) => a + row.byteIdentical, 0);
const byteIdenticalExpected = reps.length * M;
const gByteIdentical = byteIdenticalTotal === byteIdenticalExpected
  && samplerTwin.every(Boolean);

/* ---- G-ARMS: the identity predicate, ONE MUTANT PER CONJUNCT --------------- */
const gArmsRows = ((): Record<string, unknown> => {
  const seed = GUARDED ? GUARD_BASE + 1 : SMOKE_BASE + 1;
  const books: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook(),
  ];
  const truth = armConjuncts(matchOf(seed, 'learnOnly', books), 'learnOnly', books, seed);
  const mutants: { conjunct: string; flipped: boolean }[] = [];
  // 1 learnFlag — the OFF match read as if it were the learn arm
  mutants.push({ conjunct: 'learnFlag',
    flipped: armConjuncts(matchOf(seed, 'off', null), 'learnOnly', books, seed)
      .learnFlag === false });
  // 2 consumeFlag — the CONSUME match read as the learn-only arm
  mutants.push({ conjunct: 'consumeFlag',
    flipped: armConjuncts(matchOf(seed, 'learnConsume', books), 'learnOnly', books, seed)
      .consumeFlag === false });
  // 3 booksWired — an armed match whose ledger seat is nulled
  const m3 = matchOf(seed, 'learnOnly', books);
  (m3 as unknown as { dvLearn: unknown }).dvLearn = null;
  mutants.push({ conjunct: 'booksWired',
    flipped: armConjuncts(m3, 'learnOnly', books, seed).booksWired === false });
  // 4 doorsShut — a delivery door armed
  const m4 = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    dvLearnedMap: true, dvLearnedBooks: books, ptpPassLead: true });
  mutants.push({ conjunct: 'doorsShut',
    flipped: armConjuncts(m4, 'learnOnly', books, seed).doorsShut === false });
  // 5 mtDoorsShut — the MT world flag armed
  const mtKey = (Object.keys(MT_WORLD_FLAGS) as string[])[0];
  const m5 = matchOf(seed, 'learnOnly', books);
  (m5 as unknown as Record<string, unknown>)[mtKey] = true;
  mutants.push({ conjunct: 'mtDoorsShut',
    flipped: armConjuncts(m5, 'learnOnly', books, seed).mtDoorsShut === false });
  // 6 eyeNull — a station eye planted
  const m6 = matchOf(seed, 'learnOnly', books);
  (m6 as unknown as Record<string, unknown>).stationEye = {};
  mutants.push({ conjunct: 'eyeNull',
    flipped: armConjuncts(m6, 'learnOnly', books, seed).eyeNull === false });
  // 7 genesDisciplined — a NON-belief dv gene written onto one view
  const m7 = matchOf(seed, 'learnOnly', books);
  (m7.teams[0].baseGenome as TacticalGenome).dvExposureWeight = 0.5;
  mutants.push({ conjunct: 'genesDisciplined',
    flipped: armConjuncts(m7, 'learnOnly', books, seed).genesDisciplined === false });
  // 7b noFranchiseBelief — the learned belief written onto the FRANCHISE genome
  const m7b = matchOf(seed, 'learnOnly', books);
  (m7b.teams[0].info.genome as TacticalGenome).dvLossBelief = [0.1, 0.2, 0.3];
  mutants.push({ conjunct: 'noFranchiseBelief',
    flipped: armConjuncts(m7b, 'learnOnly', books, seed).noFranchiseBelief === false });
  // 8 censusConstruction — the squads built off the WRONG seed derivation
  const m8 = new Match({ seed, teamA: team('A', seed * 2 + 7), teamB: team('B', seed * 2 + 2),
    dvLearnedMap: true, dvLearnedBooks: books });
  mutants.push({ conjunct: 'censusConstruction',
    flipped: armConjuncts(m8, 'learnOnly', books, seed).censusConstruction === false });
  return {
    truth,
    mutants: mutants.map((x) => ({ conjunct: x.conjunct, flipped: x.flipped })),
    coverage: 'EVERY conjunct of the exam\'s configuration-identity predicate carries its '
      + 'own mutant (9 conjuncts / 9 mutants); the claim reaches exactly those nine and '
      + 'no further.',
    pass: Object.values(truth).every(Boolean) && mutants.every((x) => x.flipped),
  };
})();
const gArms = gArmsRows.pass === true;

/* ---- G-BOOKS-LIVE: non-vacuity ------------------------------------------- */
const finalBooks = booksAt(CPS.length - 1, 'learn');
const gBooksLiveRows = {
  books: finalBooks.length,
  booksWithAllThreeZones: finalBooks.filter((b) => b.cells.deliveries.every((d) => d > 0)).length,
  booksWithPunishment: finalBooks.filter((b) => b.cells.punished
    .reduce((a, x) => a + x, 0) > 0).length,
  labelsClosed: reps.reduce((a, row) => a + row.labelsClosed, 0),
  minDeliveriesPerZone: DV_ZONES.map((_z, i) => Math.min(...finalBooks
    .map((b) => b.cells.deliveries[i]))),
};
const gBooksLive = gBooksLiveRows.booksWithAllThreeZones === finalBooks.length
  && gBooksLiveRows.booksWithPunishment === finalBooks.length
  && gBooksLiveRows.labelsClosed > 0;

/* ---- G-BOOKMATH: the belief arithmetic + the strictness rule --------------- */
const gBookMathRows = ((): Record<string, unknown> => {
  let bad = 0; let cells = 0;
  for (const which of ['learn', 'consume'] as const) {
    for (let c = 0; c < CPS.length; c++) {
      for (const b of booksAt(c, which)) {
        for (let z = 0; z < DV_ZONES.length; z++) {
          cells += 1;
          const d = b.cells.deliveries[z]; const p = b.cells.punished[z];
          const belief = d > 0 ? p / d : 0;
          if (b.belief[z] !== belief || p > d || p < 0) bad += 1;
        }
      }
    }
  }
  return {
    cellsChecked: cells,
    mismatches: bad,
    strictTieRejected: !isOrdered([0.03, 0.03, 0.01]) && !isOrdered([0.03, 0.02, 0.02])
      && isOrdered([0.03, 0.02, 0.01]),
    relativesFromRawCounts: Math.abs(censusRelative[0] - 1.27322) < 1e-3
      && Math.abs(censusRelative[2] - 0.67441) < 1e-3,
    pass: false,
  };
})();
const gBookMath = gBookMathRows.mismatches === 0
  && gBookMathRows.strictTieRejected === true
  && gBookMathRows.relativesFromRawCounts === true;
gBookMathRows.pass = gBookMath;

/* ---- G-YARDSTICK: the census table READ, never typed ----------------------- */
const gYardstickRows = {
  schema: yardstick.schema,
  windowS: yardstick.windowS,
  orderingRead: yardstick.ordering,
  ratesFromRawCounts: censusRates.map((v) => round(v, 6)),
  relativeFromRawCounts: censusRelative.map((v) => round(v, 5)),
  storedRelative: DV_ZONES.map((z) => yardstick.relative[z]),
  orderedTruth: isOrdered(censusRates),
  maxRelativeDrift: round(Math.max(...DV_ZONES
    .map((z, i) => Math.abs(censusRelative[i] - yardstick.relative[z]))), 6),
};
const gYardstick = gYardstickRows.schema === 'dv-t2c0.pass-truth-table.v1'
  && gYardstickRows.orderedTruth
  && JSON.stringify(gYardstickRows.orderingRead) === JSON.stringify(['own', 'middle', 'final'])
  && gYardstickRows.maxRelativeDrift < 1e-4;

/* ---- G-N: the frozen literals ARE the recomputed sizing -------------------- */
const gNRows = {
  frozen: FROZEN_SIZING,
  recomputed: {
    deff: sizing.deff,
    designDeliveryRates: sizing.designDeliveryRates,
    designPunishRatesCensus: (sizing.censusRates as number[]),
    designPunishRatesSmoke: (sizing.smokeRates as number[]),
    mStar: sizing.mStar,
    qPerBook: sizing.qPerBook,
    limbIPower: sizing.limbIPower,
    limbIIPowerConservative: sizing.limbIIPowerConservative,
    limbIIPowerIndependent: sizing.limbIIPowerIndependent,
    conjunctionPowerConservative: sizing.conjunctionPowerConservative,
    mdeOwnMinusMiddlePp: sizing.mdeOwnMinusMiddlePp,
  },
  rFrozen: R_FROZEN,
  tau: TAU,
  powerTarget: POWER_TARGET,
  ranAtM: M,
  seedCapBinds: sizing.seedCapBinds,
};
const gN = canonical(gNRows.frozen) === canonical(gNRows.recomputed)
  && (sizing.conjunctionPowerConservative as number) >= POWER_TARGET
  && TAU >= 0.9
  && (GUARDED || M === (sizing.mStar as number));

/* ---- G-CURVE: the checkpoint stream is monotone and ends at M -------------- */
const gCurveRows = ((): Record<string, unknown> => {
  let violations = 0;
  for (const which of ['learn', 'consume'] as const) {
    for (let c = 1; c < CPS.length; c++) {
      const prev = booksAt(c - 1, which); const cur = booksAt(c, which);
      for (let b = 0; b < cur.length; b++) {
        for (let z = 0; z < DV_ZONES.length; z++) {
          if (cur[b].cells.deliveries[z] < prev[b].cells.deliveries[z]) violations += 1;
          if (cur[b].cells.punished[z] < prev[b].cells.punished[z]) violations += 1;
        }
      }
    }
  }
  return {
    checkpoints: CPS, violations, endsAtM: CPS[CPS.length - 1] === M,
    frozenCheckpoints: CHECKPOINTS,
  };
})();
const gCurve = gCurveRows.violations === 0 && gCurveRows.endsAtM === true;

/* ---- G-CELLS: the per-cluster cells are IN the artifact and re-derive it ---- */
const storedCells = reps.map((row) => ({
  r: row.r, seedFirst: row.seedFirst, seedLast: row.seedLast,
  learn: row.learnCells, consume: row.consumeCells,
  guards: row.guards,
}));
const gCellsRows = ((): Record<string, unknown> => {
  // re-derive the headline share and mean vector from the STORED cells alone.
  const books = storedCells.flatMap((row) => [0, 1].map((s) => beliefOf(
    row.learn[s][CPS.length - 1],
  )));
  const share = books.filter(isOrdered).length / books.length;
  const byRep = storedCells.map((row) => DV_ZONES.map((_z, i) => mean([0, 1]
    .map((s) => beliefOf(row.learn[s][CPS.length - 1])[i]))));
  const vec = DV_ZONES.map((_z, i) => round(mean(byRep.map((v) => v[i])), 6));
  return {
    rederivedShare: round(share, 5),
    publishedShare: finalLearn.orderedShare,
    rederivedMeanVector: vec,
    publishedMeanVector: finalLearn.meanVector,
    clustersStored: storedCells.length,
    cellsPerCluster: 2 * CPS.length * 2,
  };
})();
const gCells = gCellsRows.rederivedShare === gCellsRows.publishedShare
  && canonical(gCellsRows.rederivedMeanVector) === canonical(gCellsRows.publishedMeanVector)
  && storedCells.length === reps.length;

/* ---- G-VALUES-UNREACHABLE: no census value reachable from `src/**` --------- */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e);
  if (statSync(p).isDirectory()) return srcFiles(p);
  return p.endsWith('.ts') ? [p] : [];
});
const SRC = srcFiles('src');
const srcText = new Map(SRC.map((f) => [f, readFileSync(f, 'utf8')]));
const srcAll = [...srcText.values()].join('\n');
const deepNumbers = (v: unknown, out: number[] = []): number[] => {
  if (typeof v === 'number') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => deepNumbers(x, out));
  else if (v !== null && typeof v === 'object') {
    Object.values(v as Record<string, unknown>).forEach((x) => deepNumbers(x, out));
  }
  return out;
};
const NEEDLE_FLOOR = 0.0005;
const dvc0Census = ((dvc0.result as Record<string, unknown>).census
  ?? {}) as Record<string, unknown>;
const rateNeedles = [
  ...deepNumbers(t2c0Census.yardstick), ...deepNumbers(dvc0Census.yardstick),
].filter((v) => v > NEEDLE_FLOOR && v < 1);
const needleForms = new Set<string>();
for (const v of rateNeedles) {
  needleForms.add(String(v));
  needleForms.add(String(round(v * 100, 3)));
  needleForms.add((v * 100).toFixed(3));
  needleForms.add((v * 100).toFixed(2));
  needleForms.add(v.toFixed(5));
}
const tokenHit = (needle: string): boolean =>
  new RegExp(`(?<![\\d.])${needle.replace(/\./g, '\\.')}(?![\\d])`).test(srcAll);
const valueHits = [...needleForms].filter((s) => s.length >= 5 && tokenHit(s));
const NAME_NEEDLES = ['dv-c0-loss-cost', 'dv-t2-c0-pass-level-census',
  'dv-t2-t0-learning-seam', 'dv-c0.truth-table', 'dv-t2c0.pass-truth-table'];
const nameHits = NAME_NEEDLES.filter((s) => srcAll.includes(s));
const controlNeedleFound = srcAll.includes('DV_LEARN_WINDOW_S');
const gValuesRows = {
  needleFormsSearched: needleForms.size,
  rateNeedles: rateNeedles.length,
  valueHits, nameHits, controlNeedleFound,
  coverage: 'the search set is every rate-valued member of BOTH committed yardsticks '
    + `(DV-C0's and T2-C0's) above the declared floor ${NEEDLE_FLOOR}, in five string forms `
    + '(raw, ×100 rounded, two fixed PERCENTAGE forms as the tables print them, 5-dp); '
    + 'zero/degenerate cells are excluded by that floor and the CONTROL NEEDLE proves the '
    + 'search is live. It does NOT cover this exam\'s own measured values (they are the '
    + 'result, not a table src could copy).',
};
const gValuesUnreachable = valueHits.length === 0 && nameHits.length === 0
  && controlNeedleFound && rateNeedles.length >= 12;

/* ---- X-SRC-UNTOUCHED / X-FP-PROD ----------------------------------------- */
const srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim();
const srcStatus = execSync('git status --porcelain -- src', { encoding: 'utf8' }).trim();
const xSrcUntouched = srcDiff.length === 0 && srcStatus.length === 0;
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = leagueHash(1337);
const xFpProd = fpObserved === FINGERPRINT_BASELINE;

/* ---- G-SEED / G-STATS ----------------------------------------------------- */
const blocksUsed = GUARDED
  ? [{ name: 'guarded run (exit-semantics guard block)', first: GUARD_BASE,
    last: GUARD_BASE + GUARD_SPAN - 1 }]
  : [
    { name: 'sampler-inertness twin + core', first: SMOKE_BASE, last: SMOKE_BASE + SMOKE_N - 1 },
    { name: 'exit-semantics guard block', first: GUARD_BASE, last: GUARD_BASE + GUARD_SPAN - 1 },
    { name: 'G-WORLD construction seed', first: GWORLD_SEED, last: GWORLD_SEED },
    { name: 'the battery', first: BATTERY_BASE, last: BATTERY_BASE + R_FROZEN * M_FROZEN - 1 },
  ];
const seedBlocks = blocksUsed.map((b) => ({
  ...b,
  collisions: CONSUMED.filter((c) => b.first <= c.range[1] && b.last >= c.range[0])
    .map((c) => c.name),
})).map((b) => ({ ...b, ok: b.collisions.length === 0 }));
const sortedBlocks = [...seedBlocks].sort((a, b) => a.first - b.first);
const blocksOrdered = sortedBlocks.every((b, i) => i === 0 || b.first > sortedBlocks[i - 1].last);
const gSeed = seedBlocks.every((b) => b.ok) && blocksOrdered
  && CONSUMED.some((c) => c.name.includes('T2-T0 test-file seeds'));
const statsGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
const gStats = STATS_BASE >= 107_800 && statsGap >= 200;

/* ---- G-CLEAN-INVOCATION --------------------------------------------------- */
const gCleanInvocation = !GUARDED;

/* ---- G-RESUME: replicate 0 recomputed from scratch == its checkpointed row -- */
const resumeRow = runReplicate(0);
const gResumeRows = {
  replicate: 0,
  checkpointDigest: reps[0].digest,
  recomputedDigest: resumeRow.digest,
  resumedFromCheckpoint: done.has(0),
  checkpointPath: CHECKPOINT_PATH,
};
const gResume = resumeRow.digest === reps[0].digest;

/* ---- G-DET: the deterministic CORE runs twice ------------------------------ */
const core = (): Record<string, unknown> => {
  const books: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook(),
  ];
  const sigs: string[] = [];
  for (let i = 0; i < SMOKE_N; i++) {
    const seed = (GUARDED ? GUARD_BASE : SMOKE_BASE) + i;
    sigs.push(walk(seed, 'learnOnly', books).signature);
  }
  return {
    sigs,
    cells: [0, 1].map((s) => snapshot(books[s])),
    sizing,
    censusRates: censusRates.map((v) => round(v, 8)),
    finalLearn: finalLearn.meanVector,
    finalShare: finalLearn.orderedShare,
  };
};
const digestA = sha(canonical(core()));
const digestB = sha(canonical(core()));
const gDet = digestA === digestB;

/* ========================================================================== */
/* §8 THE ARTIFACT                                                            */
/* ========================================================================== */
const gates: Record<string, boolean> = {
  gDet,
  xSrcUntouched,
  xFpProd,
  gWorld,
  gByteIdentical,
  gArms,
  gBooksLive,
  gBookMath,
  gYardstick,
  gN,
  gCurve,
  gCells,
  gValuesUnreachable,
  gSeed,
  gStats,
  gCleanInvocation,
  gResume,
};
/** ⭐ #250.3(i), THRICE-CAUGHT: the headline count IS the frozen list's length, and the
 *  gate object's key set must BE that list — a structural check, not a promise. */
const gateListMatches = canonical(Object.keys(gates).sort())
  === canonical([...FROZEN_GATE_NAMES].sort());
if (!gateListMatches) {
  process.stdout.write('*** THE GATE OBJECT DOES NOT MATCH THE FROZEN GATE LIST ***\n');
  process.exit(1);
}
const allPass = Object.values(gates).every(Boolean);

/** the FORK state, printed MECHANICALLY (#257.3(e)) — never resolved here. */
const forks = {
  fDv2a: {
    fired: !(finalLearn.conjunction as boolean),
    consequent: 'the registration scores NEGATIVE honestly — a result about '
      + 'experience-only learning at rung one; the coach channel is the named '
      + 'accelerator, not a rescue re-run',
  },
  fDv2b: {
    fired: (finalLearn.limbIOrderedResolved as boolean) === false
      && (finalLearn.ciOwnMinusMiddlePp as number[])[1] < 0,
    consequent: 'a label/semantics defect hunt, STOP (in a byte-identical world the '
      + 'book\'s expectation IS the census marginal)',
  },
  fDv2c: {
    fired: !gByteIdentical,
    consequent: 'the learn-only arm\'s world is NOT byte-identical to off (a dormancy '
      + 'breach) ⇒ STOP',
  },
  note: 'MECHANICAL PREDICATE FLAGS ONLY (#203). A fired fork is STILL A COMMIT: the '
    + 'honest result lands and the commander adjudicates it.',
};

const result = {
  stage: 'DV-T2-T1 — THE CONVERGENCE EXAM (the FIFTH REGISTRATION scored)',
  contract: 'docs/world-model/DV-T2-LEARNED-MAP-CONTRACT.md §1/§3; ruling #257.3',
  doc: 'docs/world-model/DV-T2-T1-CONVERGENCE-EXAM.md',
  mode: GUARDED ? 'GUARDED — NOT THE EXAM' : 'EXAM',
  gatingGrain: GUARDED
    ? 'GUARD BLOCK, R/M overridden — these rows adjudicate NOTHING'
    : `THE BATTERY: R = ${R_FROZEN} replicates × M = ${M_FROZEN} matches, `
      + `${2 * R_FROZEN} books — these rows ARE the registration's evidence`,
  design: {
    replicates: R_FROZEN,
    matchesPerReplicate: M_FROZEN,
    books: 2 * R_FROZEN,
    tau: TAU,
    powerTarget: POWER_TARGET,
    checkpoints: CHECKPOINTS,
    seasonBoundary: 'NEVER FIRES — the probe drives the match sequence directly, so '
      + 'League.startSeason() is never called and M-DV2.2\'s reset clause is HONOURED, '
      + 'not amended. One long season in substance, DECLARED as such (#257.3(a)).',
    learner: 'the SIDE (A/B). Squads are redrawn per fixture EXACTLY as the census draws '
      + 'them (teamA = seed·2+1, teamB = seed·2+2), so the book\'s sampling population is '
      + 'the yardstick\'s population. A fixed-roster sequence would converge to ONE '
      + 'matchup\'s truth and would arm F-DV2-b spuriously.',
  },
  sizing,
  seeds: { blocks: seedBlocks, ordered: blocksOrdered, statsBase: STATS_BASE, statsGap },
  gates,
  gateCount: FROZEN_GATE_NAMES.length,
  frozenGateNames: FROZEN_GATE_NAMES,
  gDet: { pass: gDet, digestA, digestB },
  xSrcUntouched: { pass: xSrcUntouched, diff: srcDiff, status: srcStatus },
  xFpProd: { pass: xFpProd, observed: fpObserved, baseline: FINGERPRINT_BASELINE },
  gWorld: gWorldRows,
  gByteIdentical: {
    pass: gByteIdentical,
    matchesIdentical: byteIdenticalTotal,
    matchesWalked: byteIdenticalExpected,
    samplerInertTwins: samplerTwin.filter(Boolean).length,
    samplerTwinsRun: samplerTwin.length,
    semantics: 'F-DV2-c\'s gate. The LEARN-ONLY arm\'s whole-run signature (rng stream '
      + 'state inside) equals the OFF arm\'s on EVERY battery seed, so the books sample '
      + 'exactly the census\'s world. The guard sampler\'s own inertness is proved on the '
      + 'declared twin block (sampled vs bare), so a perturbing instrument cannot hide '
      + 'inside this identity.',
  },
  gArms: gArmsRows,
  gBooksLive: { ...gBooksLiveRows, pass: gBooksLive },
  gBookMath: gBookMathRows,
  gYardstick: { ...gYardstickRows, pass: gYardstick },
  gN: { ...gNRows, pass: gN },
  gCurve: { ...gCurveRows, pass: gCurve },
  gCells: { ...gCellsRows, pass: gCells },
  gValuesUnreachable: { ...gValuesRows, pass: gValuesUnreachable },
  gSeed: { blocks: seedBlocks, ordered: blocksOrdered, pass: gSeed },
  gStats: { base: STATS_BASE, minGap: statsGap, pass: gStats },
  gCleanInvocation: {
    pass: gCleanInvocation, overridesPresent,
    semantics: 'any of ' + OVERRIDES.join('/') + ' routes the whole run onto the guard '
      + 'block 12,438,050–099, reds this gate, writes to /tmp and exits 1 — the battery '
      + 'band stays VIRGIN.',
  },
  gResume: { ...gResumeRows, pass: gResume },
  /* ---- ⭐⭐ THE REGISTRATION ---- */
  registration: {
    verbatim: '不用输赢:只给球队自己的丢球→丢分账本,它们能自己学出正确形状的风险地图——'
      + '后场 > 中场 > 前场的顺序自己长出来,不用任何人告诉它们。',
    predicate: 'H-DV2 as SHARPENED by #257.3(c): the CONJUNCTION of (i) the replicate-mean '
      + 'belief vector strictly ordered own > middle > final with BOTH pairwise gaps '
      + `RESOLVED at set grain, and (ii) the ordered-book share ≥ τ = ${TAU} at the `
      + 'ex-ante-sized M.',
    limbI: {
      meanVectorPct: finalLearn.meanVectorPct,
      ordered: isOrdered(finalLearn.meanVector as number[]),
      gapOwnMinusMiddlePp: finalLearn.gapOwnMinusMiddlePp,
      ciOwnMinusMiddlePp: finalLearn.ciOwnMinusMiddlePp,
      gapMiddleMinusFinalPp: finalLearn.gapMiddleMinusFinalPp,
      ciMiddleMinusFinalPp: finalLearn.ciMiddleMinusFinalPp,
      pass: finalLearn.limbIOrderedResolved,
    },
    limbII: {
      orderedBooks: finalLearn.orderedBooks,
      books: finalLearn.books,
      orderedShare: finalLearn.orderedShare,
      threshold: TAU,
      required: Math.ceil(TAU * (finalLearn.books as number)),
      pass: finalLearn.limbIIShareAtThreshold,
    },
    conjunction: finalLearn.conjunction,
    convergenceReported: {
      censusRatesPct: censusRates.map((v) => round(v * 100, 3)),
      censusRelative: censusRelative.map((v) => round(v, 5)),
      bookRelative: finalLearn.relative,
      l1AbsoluteVsCensus: finalLearn.l1AbsoluteVsCensus,
      l1RelativeVsCensus: finalLearn.l1RelativeVsCensus,
      note: 'REPORTED, never gated (#246): the SHAPE is the registration, the magnitudes '
        + 'are this world\'s.',
    },
  },
  learningCurve: { learnOnly: curveLearn, learnConsume: curveConsume },
  learnConsumeReported: {
    final: finalConsume,
    guards: guardsConsume,
    guardsLearnOnlyControlCheck: guardsLearnOnly,
    feedback,
    semantics: 'REPORTED ONLY (#257.3(b)): the consuming arm\'s books, its football guards '
      + 'at the BANKED tolerances (NI_FRACTION · |control|, NI_FRACTION = 1 − 0.275/0.380) '
      + 'and the feedback question. It gates nothing and scores nothing. The learn-only '
      + 'guard row is the NULL CONTROL: it must be exactly zero, because that arm\'s world '
      + 'is byte-identical to the control.',
  },
  forks,
  perClusterCells: storedCells,
  wall: { batterySeconds: batteryWallS },
};

const envelope = {
  head: execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(),
  generatedAt: new Date().toISOString(),
  outPath: OUT_PATH,
  batteryWallSeconds: batteryWallS,
  note: 'UNHASHED (#197-M1): head, timestamps and all machine timings live here so '
    + 'resultSha256 re-derives at any commit or path.',
};
const resultSha256 = sha(canonical(result));
writeFileSync(OUT_PATH, `${JSON.stringify({ envelope, resultSha256, result }, null, 2)}\n`);

for (const k of FROZEN_GATE_NAMES) {
  process.stdout.write(`${gates[k] ? 'PASS' : 'FAIL'}  ${k}\n`);
}
process.stdout.write(`gates ${Object.values(gates).filter(Boolean).length}/${
  FROZEN_GATE_NAMES.length}\n`);
process.stdout.write(`resultSha256 ${resultSha256}\n`);
process.stdout.write(`G-DET digest ${digestA}\n`);
process.stdout.write(`M* ${sizing.mStar} q ${sizing.qPerBook} power ${
  sizing.conjunctionPowerConservative} MDE ${sizing.mdeOwnMinusMiddlePp} pp\n`);
process.stdout.write(`LIMB I ${finalLearn.limbIOrderedResolved} · LIMB II ${
  finalLearn.limbIIShareAtThreshold} (share ${finalLearn.orderedShare}) · CONJUNCTION ${
  finalLearn.conjunction}\n`);
process.stdout.write(`${allPass ? 'ALL HARD GATES PASS' : '*** A GATE IS RED ***'}\n`);
process.exit(allPass ? 0 : 1);
