// O2 OPENING STEP — THE #65 WHETHER-SEAT SIZING SMOKE, RE-RUN OVER THE O1-ARMED
// WORLD (ruling #185.2, the #65.3 unpark condition; docs/world-model/
// O2-OPENING-SIZING.md; instrument-only — ZERO mechanic changes).
//
// THE FORM IS #65's, NOT A NEW INSTRUMENT. Every metric, every eligibility test
// and every constant below is lifted VERBATIM from
// `scripts/probes/c5-t2-whether-sizing-smoke.ts` (C5-T2-WHETHER-SEAT §5.2). The
// live match never carries a whetherEye; every decision is classified on a
// PRISTINE CLONE, so the trajectory is the untouched A0 world (read-only).
//
// TWO ARMS on the SAME fresh seeds (paired):
//   BASELINE  = the #65 world form verbatim (CENSUS_FLAGS, §0.1 enriched world)
//   O1-ARMED  = the same + `o1PassWindup: true` (the certified O1 cut-1 mechanic,
//               banked by ruling #184.1)
// The commander's question: does taxing release time change how often holding is
// WORTH it (the TRUE-context share) and does the perception wedge still swallow
// it (the PERCEIVED chooser-hold share)?
//
// THREE ADDITIONS to #65's output, declared BEFORE any result (#65's smoke had
// none of them; nothing of #65's is removed or redefined):
//   (A1) TRUE-context share measured IN-PROBE at every eligible moment. #65 read
//        this quantity off the CENSUS (0.586 % = 600/102,466, seat doc §3.4(B));
//        the census's eligibility predicate is the smoke's verbatim (same
//        qualifying test, same PER_MATCH_CAP/MOMENT_SPACING, same exclusions —
//        c5-recensus.ts:333-393), so the same estimand is measurable here. Only
//        cell 0|0|0 reaches zero in the certified table (asserted below), so
//        "true-context share" = TRUE-cell-0|0|0 share of eligible moments,
//        exactly the census's definition.
//   (A2) WEDGE RATIO = trueContextShare / perceivedHoldShare (#65 reported it in
//        words: "a ~4× perception wedge"; 0.586/0.141 = 4.16).
//   (A3) CLUSTER (per-match) BOOTSTRAP CIs on every rate, and on the PAIRED
//        armed−baseline delta of every rate. #65's smoke printed points only.
//        Ratio-of-totals estimator; stats base 103,000 (#163 stream rule,
//        102,800 consumed by O1-T2).
//
// GATES: X-DET (whole two-arm computation run twice, byte-identical + sha) ·
// X-FP-PROD (the shipped fingerprint, seed 1337 / 2 seasons, recomputed
// IN-PROBE per the #181.2 standing receipt rule) · G-REPRO65 (this probe's own
// walker re-derives #65's published numbers on #65's own block, in-probe) ·
// SEED/STATS disjointness · table-SHA drift · flag-hygiene assertions.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { whetherEyeDecision, type RecensusCostTable } from '../../src/ai/whetherEye';

const wall0 = Date.now();
const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

/* ========================================================================== */
/* §1 FROZEN PARAMETERS — #65 verbatim unless marked                          */
/* ========================================================================== */
const MATCH_DURATION = 240; // #65
const PER_MATCH_CAP = 80; // #65 / census verbatim
const MOMENT_SPACING = 30; // #65 / census verbatim
const HORIZON = 240; // #65 (the A0 eligibility fork)
const SUPPORT_MIN_M = 6; // #65
const SUPPORT_MAX_M = 30; // #65
const N_HOLD_FLOOR = 446; // #65 / seat §3.4(B)
const SHARE_FLOOR = 0.0029; // #65 / seat §3.4(B): 0.29 % of eligible moments

/** THE FRESH BLOCK (12.31M+ free per the PROGRAMME seed ledger). */
const SEED_START = envInt('O2SZ_SEED_START', 12_310_000);
const N_MATCHES = envInt('O2SZ_MATCHES', 200);
/** #65's OWN block — re-walked as the G-REPRO65 receipt, never as fresh data. */
const REPRO65_SEED_START = 8_500_000;
const REPRO65_MATCHES = 48;
/** #163 stats-stream disjointness: 102,800 was O1-T2's base ⇒ +200 floor. */
const BOOTSTRAP_SEED = 103_000;
const BOOTSTRAP_RESAMPLES = envInt('O2SZ_RESAMPLES', 2000);
const PUBLISHED_STATS_BASES = [102_000, 102_200, 102_400, 102_600, 102_800];
/** The 12.30M band ledger (PROGRAMME §0 seeds line) + #65's block. */
const RESERVED_BAND: [number, number] = [12_300_000, 12_399_999];
const CONSUMED: { name: string; range: [number, number] }[] = [
  { name: 'tempo census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 smoke', range: [12_309_900, 12_309_923] },
];

const TABLE_PATH = process.env.O2SZ_TABLE ?? 'docs/world-model/data/c5-recensus.json';
const OUT_PATH = process.env.O2SZ_OUT ?? 'docs/world-model/data/o2-whether-sizing-rerun.json';
/** #65's frozen certified-table SHA (§0) — the same drift guard. */
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';
/** #65's published smoke numbers (its committed artifact) — the G-REPRO65 target. */
const REPRO65_TARGET = {
  qualifying: 3840, eligible: 2835, dHold: 4,
  classes: { 'D-HOLD': 4, 'E-ACTNOW-DECLINED': 816, 'E-ABSTAIN-UNSEEN': 2004, 'E-NOCELL': 11 },
  agreeOverall: 0.502439, ctxPlaced: 820,
} as const;
/** The shipped fingerprint (O1-T2 §G1 / scripts/fingerprint.ts). */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SKIP_FP = process.argv.includes('--skip-fp');

/** The enriched census world (#65 §0.1) — the world the table was priced on. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;
type ArmName = 'baseline' | 'o1armed';
const ARM_FLAGS: Record<ArmName, Record<string, boolean>> = {
  baseline: { ...CENSUS_FLAGS },
  o1armed: { ...CENSUS_FLAGS, o1PassWindup: true },
};

/* ========================================================================== */
/* §2 HELPERS — #65 verbatim                                                  */
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
const matchOf = (seed: number, arm: ArmName): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...ARM_FLAGS[arm],
} as ConstructorParameters<typeof Match>[0]);
const distance = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const mean = (xs: number[]): number => (xs.length === 0 ? NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : NaN);

/* --- the certified table, INJECTED (#65's P2 convention) ------------------- */
const raw = JSON.parse(readFileSync(TABLE_PATH, 'utf8'));
if (raw.tableSha !== EXPECTED_TABLE_SHA) {
  throw new Error(`certified table SHA drift: ${raw.tableSha} != ${EXPECTED_TABLE_SHA}`);
}
const params = raw.parameters;
const TABLE: RecensusCostTable = {
  pressureBands: params.pressureBands,
  staleBands: params.staleBands,
  supportCuts: params.supportCuts,
  supportWindowM: params.supportWindowM,
  cells: raw.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper, reachesZero: k.reachesZero,
    })),
  })),
};
/** (A1) The certified HOLDABLE cells — the true-context population's definition. */
const HOLDABLE_CELLS = TABLE.cells
  .filter((c) => c.costs.some((k) => k.reachesZero))
  .map((c) => `${c.pressureBand}|${c.staleBand}|${c.supportBand}`)
  .sort();
if (HOLDABLE_CELLS.length !== 1 || HOLDABLE_CELLS[0] !== '0|0|0') {
  throw new Error(`holdable-cell set drift: ${JSON.stringify(HOLDABLE_CELLS)} != ["0|0|0"]`);
}

type Band = 0 | 1 | 2;
const pressureBandOf = (v: number): Band =>
  (v < TABLE.pressureBands[0] ? 0 : v < TABLE.pressureBands[1] ? 1 : 2);
const staleBandOf = (v: number): Band =>
  (v < TABLE.staleBands[0] ? 0 : v < TABLE.staleBands[1] ? 1 : 2);
const supportBandOf = (v: number): Band =>
  (v < TABLE.supportCuts.low ? 0 : v >= TABLE.supportCuts.high ? 2 : 1);

/** A0 (untouched): one fork step to read the decided action — #65 verbatim. */
const decidedActionOf = (before: Match, ownerGid: number): string => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  let action = owner.action.type;
  const startTick = fork.simTick;
  for (let t = 0; t < HORIZON; t++) {
    if (fork.finished) break;
    fork.step(DT);
    if (fork.simTick - startTick === 1) { action = owner.action.type; break; }
  }
  return action;
};

/** The TRUE-context cell (census keying) — #65 verbatim. */
const trueCellOf = (match: Match, owner: Player): { key: string; bands: [Band, Band, Band] } => {
  const side = owner.side;
  const pB = pressureBandOf(pressureAt(owner.pos, match.teams[1 - side].players));
  const sB = staleBandOf(match.teams[side].staleTime);
  const support = match.teams[side].players.filter((p) => (
    p.gid !== owner.gid && p.role !== 'GK' && !p.sentOff
    && distance(p.pos, owner.pos) >= SUPPORT_MIN_M && distance(p.pos, owner.pos) <= SUPPORT_MAX_M
  )).length;
  const supB = supportBandOf(support);
  return { key: `${pB}|${sB}|${supB}`, bands: [pB, sB, supB] };
};

type DecisionClass = 'D-HOLD' | 'E-ACTNOW-DECLINED' | 'E-ABSTAIN-UNSEEN' | 'E-NOCELL';
const CLASSES: DecisionClass[] = ['D-HOLD', 'E-ACTNOW-DECLINED', 'E-ABSTAIN-UNSEEN', 'E-NOCELL'];

interface PerMatch {
  seed: number;
  qualifying: number;
  eligible: number;
  exFirstTouch: number;
  exMustKick: number;
  exShoot: number;
  exClear: number;
  classCounts: Record<DecisionClass, number>;
  dHold: number;
  holdCells: Record<string, number>;
  /** (A1) eligible moments whose TRUE cell is the certified holdable cell. */
  trueHoldable: number;
  /** M-CTX accumulators, per match (so the bootstrap can cluster on the seed). */
  ctxPlaced: number;
  ctxAgreeAll: number;
  ctxAgreeFeature: [number, number, number];
  perceivedCellCounts: Record<string, number>;
}

/* ========================================================================== */
/* §3 THE WALK — #65's loop verbatim; the ONLY addition is the read-only       */
/*    true-cell classification at every eligible moment (A1), which touches    */
/*    no RNG and steps nothing (G-REPRO65 proves the walk is unchanged).      */
/* ========================================================================== */
const walkArm = (arm: ArmName, seedStart: number, matches: number): PerMatch[] => {
  const rows: PerMatch[] = [];
  for (let seed = seedStart; seed < seedStart + matches; seed++) {
    const match = matchOf(seed, arm);
    let sinceLast = MOMENT_SPACING;
    let inMatch = 0;
    const r: PerMatch = {
      seed, qualifying: 0, eligible: 0, exFirstTouch: 0, exMustKick: 0, exShoot: 0, exClear: 0,
      classCounts: { 'D-HOLD': 0, 'E-ACTNOW-DECLINED': 0, 'E-ABSTAIN-UNSEEN': 0, 'E-NOCELL': 0 },
      dHold: 0, holdCells: {}, trueHoldable: 0,
      ctxPlaced: 0, ctxAgreeAll: 0, ctxAgreeFeature: [0, 0, 0], perceivedCellCounts: {},
    };
    while (!match.finished && inMatch < PER_MATCH_CAP) {
      const owner: Player | null = match.ball.owner;
      const qualifies = match.phase === 'playing' && owner !== null
        && owner.role !== 'GK' && !owner.sentOff
        && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
      if (qualifies) {
        r.qualifying += 1;
        const gid = owner!.gid;
        const before = cloneSimulationState(match);
        if (owner!.firstTouchWindow > 0) {
          r.exFirstTouch += 1;
        } else if (match.restartKickGid === gid) {
          r.exMustKick += 1;
        } else {
          const decided = decidedActionOf(before, gid);
          if (decided === 'Shoot') {
            r.exShoot += 1;
          } else if (decided === 'ClearBall') {
            r.exClear += 1;
          } else {
            r.eligible += 1;
            const cloneOwner = before.allPlayers.find((p) => p.gid === gid)!;
            const decision = whetherEyeDecision(cloneOwner, before, TABLE);
            r.classCounts[decision.cls as DecisionClass] += 1;
            if (decision.cls === 'D-HOLD') {
              r.dHold += 1;
              const cell = decision.cell ?? '?';
              r.holdCells[cell] = (r.holdCells[cell] ?? 0) + 1;
            }
            // (A1) TRUE-context classification of EVERY eligible moment.
            const truth = trueCellOf(match, owner!);
            if (HOLDABLE_CELLS.includes(truth.key)) r.trueHoldable += 1;
            // M-CTX: perceived-vs-true agreement, when a cell was placed (#65).
            if (decision.perceived !== null) {
              const pb = [decision.perceived.pressureBand, decision.perceived.staleBand, decision.perceived.supportBand];
              const perceivedKey = `${pb[0]}|${pb[1]}|${pb[2]}`;
              r.perceivedCellCounts[perceivedKey] = (r.perceivedCellCounts[perceivedKey] ?? 0) + 1;
              r.ctxPlaced += 1;
              if (perceivedKey === truth.key) r.ctxAgreeAll += 1;
              for (let f = 0; f < 3; f++) if (pb[f] === truth.bands[f]) r.ctxAgreeFeature[f] += 1;
            }
          }
        }
        sinceLast = 0;
        inMatch += 1;
      }
      match.step(DT);
      sinceLast += 1;
    }
    rows.push(r);
  }
  return rows;
};

/* ========================================================================== */
/* §4 SUMMARIES + (A3) the paired cluster bootstrap                           */
/* ========================================================================== */
/** The six headline rates, each a RATIO OF TOTALS over a set of match rows. */
const RATE_KEYS = [
  'perceivedHoldShare', 'trueContextShare', 'abstainUnseenShare',
  'actNowDeclinedShare', 'noCellShare', 'ctxAgreement',
] as const;
type RateKey = typeof RATE_KEYS[number];
const rateOf = (rows: readonly PerMatch[], key: RateKey): number => {
  const s = (f: (r: PerMatch) => number) => rows.reduce((a, r) => a + f(r), 0);
  const elig = Math.max(1, s((r) => r.eligible));
  switch (key) {
    case 'perceivedHoldShare': return s((r) => r.dHold) / elig;
    case 'trueContextShare': return s((r) => r.trueHoldable) / elig;
    case 'abstainUnseenShare': return s((r) => r.classCounts['E-ABSTAIN-UNSEEN']) / elig;
    case 'actNowDeclinedShare': return s((r) => r.classCounts['E-ACTNOW-DECLINED']) / elig;
    case 'noCellShare': return s((r) => r.classCounts['E-NOCELL']) / elig;
    case 'ctxAgreement': return s((r) => r.ctxAgreeAll) / Math.max(1, s((r) => r.ctxPlaced));
  }
};
const wedgeOf = (rows: readonly PerMatch[]): number => {
  const p = rateOf(rows, 'perceivedHoldShare');
  return p > 0 ? rateOf(rows, 'trueContextShare') / p : NaN;
};

const pctl = (sorted: number[], q: number): number => {
  const finite = sorted.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return NaN;
  const i = Math.min(finite.length - 1, Math.max(0, Math.floor(q * (finite.length - 1))));
  return finite[i];
};

const armSummary = (rows: PerMatch[]) => {
  const s = (f: (r: PerMatch) => number) => rows.reduce((a, r) => a + f(r), 0);
  const totalElig = s((r) => r.eligible);
  const holdCellAgg: Record<string, number> = {};
  const perceivedMix: Record<string, number> = {};
  for (const r of rows) {
    for (const [k, v] of Object.entries(r.holdCells)) holdCellAgg[k] = (holdCellAgg[k] ?? 0) + v;
    for (const [k, v] of Object.entries(r.perceivedCellCounts)) perceivedMix[k] = (perceivedMix[k] ?? 0) + v;
  }
  const holdsPerMatch = mean(rows.map((r) => r.dHold));
  return {
    matches: rows.length,
    qualifyingTotal: s((r) => r.qualifying),
    eligibleTotal: totalElig,
    eligibleFraction: round(totalElig / Math.max(1, s((r) => r.qualifying))),
    eligiblePerMatch: {
      mean: round(mean(rows.map((r) => r.eligible)), 3),
      min: Math.min(...rows.map((r) => r.eligible)), max: Math.max(...rows.map((r) => r.eligible)),
    },
    exclusions: {
      firstTouch: s((r) => r.exFirstTouch), mustKick: s((r) => r.exMustKick),
      a0Shoot: s((r) => r.exShoot), a0Clear: s((r) => r.exClear),
    },
    decisionClassShares: Object.fromEntries(CLASSES.map((c) => [c, {
      count: s((r) => r.classCounts[c]),
      share: round(s((r) => r.classCounts[c]) / Math.max(1, totalElig)),
    }])),
    chooserHold: {
      total: s((r) => r.dHold),
      rateOfEligible: round(rateOf(rows, 'perceivedHoldShare')),
      perMatchMean: round(holdsPerMatch, 4),
      perMatchMax: Math.max(...rows.map((r) => r.dHold)),
      byCell: holdCellAgg,
    },
    trueContext: {
      holdableCells: HOLDABLE_CELLS,
      total: s((r) => r.trueHoldable),
      shareOfEligible: round(rateOf(rows, 'trueContextShare')),
    },
    wedgeRatio: round(wedgeOf(rows), 4),
    mCtxPerceptionPrice: {
      placed: s((r) => r.ctxPlaced),
      agreeOverall: round(rateOf(rows, 'ctxAgreement')),
      agreePressure: round(s((r) => r.ctxAgreeFeature[0]) / Math.max(1, s((r) => r.ctxPlaced))),
      agreeStale: round(s((r) => r.ctxAgreeFeature[1]) / Math.max(1, s((r) => r.ctxPlaced))),
      agreeSupport: round(s((r) => r.ctxAgreeFeature[2]) / Math.max(1, s((r) => r.ctxPlaced))),
      perceivedCellMix: perceivedMix,
    },
    devFloor: {
      shareFloorPp: round(SHARE_FLOOR * 100, 4),
      nHoldFloor: N_HOLD_FLOOR,
      shareClearsFloor: rateOf(rows, 'perceivedHoldShare') >= SHARE_FLOOR,
      matchesForNfloor: holdsPerMatch > 0 ? Math.ceil(N_HOLD_FLOOR / holdsPerMatch) : null,
    },
  };
};

/** (A3) Paired per-match cluster bootstrap: one resampled seed-index set feeds
 *  BOTH arms, so every delta is paired on the seed. */
const bootstrap = (base: PerMatch[], armed: PerMatch[]) => {
  const n = base.length;
  const rng = new Rng(BOOTSTRAP_SEED);
  const draws: Record<string, { base: number[]; armed: number[]; delta: number[] }> = {};
  for (const k of RATE_KEYS) draws[k] = { base: [], armed: [], delta: [] };
  draws.wedgeRatio = { base: [], armed: [], delta: [] };
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const idx: number[] = [];
    for (let i = 0; i < n; i++) idx.push(Math.min(n - 1, Math.floor(rng.next() * n)));
    const rb = idx.map((i) => base[i]);
    const ra = idx.map((i) => armed[i]);
    for (const k of RATE_KEYS) {
      const vb = rateOf(rb, k); const va = rateOf(ra, k);
      draws[k].base.push(vb); draws[k].armed.push(va); draws[k].delta.push(va - vb);
    }
    const wb = wedgeOf(rb); const wa = wedgeOf(ra);
    draws.wedgeRatio.base.push(wb); draws.wedgeRatio.armed.push(wa); draws.wedgeRatio.delta.push(wa - wb);
  }
  const ci = (xs: number[], dp: number) => {
    const s = [...xs].sort((x, y) => x - y);
    return { lower: round(pctl(s, 0.025), dp), upper: round(pctl(s, 0.975), dp) };
  };
  const out: Record<string, unknown> = {};
  for (const k of [...RATE_KEYS, 'wedgeRatio']) {
    const dp = k === 'wedgeRatio' ? 4 : 6;
    const pointBase = k === 'wedgeRatio' ? wedgeOf(base) : rateOf(base, k as RateKey);
    const pointArmed = k === 'wedgeRatio' ? wedgeOf(armed) : rateOf(armed, k as RateKey);
    const d = ci(draws[k].delta, dp);
    out[k] = {
      baseline: { point: round(pointBase, dp), ...ci(draws[k].base, dp) },
      o1armed: { point: round(pointArmed, dp), ...ci(draws[k].armed, dp) },
      pairedDelta: { point: round(pointArmed - pointBase, dp), ...d },
      resolved: Number.isFinite(d.lower) && Number.isFinite(d.upper) && (d.lower > 0 || d.upper < 0),
    };
  }
  return {
    method: 'per-match (seed-clustered) paired bootstrap, ratio-of-totals estimator, 2.5/97.5 percentiles',
    statsBase: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, clusters: n, rates: out,
  };
};

/* ========================================================================== */
/* §5 RUN (X-DET: the whole computation, twice)                               */
/* ========================================================================== */
const runAll = (tag: string) => {
  process.stderr.write(`  [o2-sz] ${tag}: baseline arm (${N_MATCHES} matches @ ${SEED_START})...\n`);
  const base = walkArm('baseline', SEED_START, N_MATCHES);
  process.stderr.write(`  [o2-sz] ${tag}: o1-armed arm (same seeds)...\n`);
  const armed = walkArm('o1armed', SEED_START, N_MATCHES);
  process.stderr.write(`  [o2-sz] ${tag}: G-REPRO65 walk (#65 block ${REPRO65_SEED_START}, baseline flags)...\n`);
  const repro = walkArm('baseline', REPRO65_SEED_START, REPRO65_MATCHES);
  const reproSum = armSummary(repro);
  const reproObserved = {
    qualifying: reproSum.qualifyingTotal, eligible: reproSum.eligibleTotal,
    dHold: reproSum.chooserHold.total,
    classes: Object.fromEntries(CLASSES.map((c) => [c, reproSum.decisionClassShares[c].count])),
    agreeOverall: reproSum.mCtxPerceptionPrice.agreeOverall,
    ctxPlaced: reproSum.mCtxPerceptionPrice.placed,
  };
  const reproIdentical = JSON.stringify(reproObserved) === JSON.stringify({
    qualifying: REPRO65_TARGET.qualifying, eligible: REPRO65_TARGET.eligible, dHold: REPRO65_TARGET.dHold,
    classes: REPRO65_TARGET.classes, agreeOverall: REPRO65_TARGET.agreeOverall, ctxPlaced: REPRO65_TARGET.ctxPlaced,
  });
  return {
    arms: { baseline: armSummary(base), o1armed: armSummary(armed) },
    contrasts: bootstrap(base, armed),
    gRepro65: {
      block: `${REPRO65_SEED_START}..${REPRO65_SEED_START + REPRO65_MATCHES - 1}`,
      published65: REPRO65_TARGET, observed: reproObserved, identical: reproIdentical,
      note: 'this probe\'s own walker re-derives #65\'s committed numbers on #65\'s own block '
        + '(baseline flags) — the form is #65\'s, proven in-probe (#181.2 receipt rule)',
    },
    perMatch: {
      baseline: base.map((r) => ({ seed: r.seed, eligible: r.eligible, dHold: r.dHold, trueHoldable: r.trueHoldable, abstainUnseen: r.classCounts['E-ABSTAIN-UNSEEN'], ctxPlaced: r.ctxPlaced, ctxAgreeAll: r.ctxAgreeAll })),
      o1armed: armed.map((r) => ({ seed: r.seed, eligible: r.eligible, dHold: r.dHold, trueHoldable: r.trueHoldable, abstainUnseen: r.classCounts['E-ABSTAIN-UNSEEN'], ctxPlaced: r.ctxPlaced, ctxAgreeAll: r.ctxAgreeAll })),
    },
  };
};

const first = runAll('run-1');
const second = runAll('run-2');
const firstJson = JSON.stringify(first);
const xDet = firstJson === JSON.stringify(second);
const resultSha = createHash('sha256').update(firstJson).digest('hex');

/* --- X-FP-PROD, recomputed in-probe (#181.2) ------------------------------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'skipped (--skip-fp)' : leagueHash(FINGERPRINT_SEED);
const xFpProd = SKIP_FP || fpObserved === FINGERPRINT_BASELINE;

/* --- seed / stats disjointness --------------------------------------------- */
const firstSeed = SEED_START; const lastSeed = SEED_START + N_MATCHES - 1;
const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
const clashes = CONSUMED.filter((c) => !(lastSeed < c.range[0] || firstSeed > c.range[1]));
const reproClash = !(lastSeed < REPRO65_SEED_START || firstSeed > REPRO65_SEED_START + REPRO65_MATCHES - 1);
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const gates = {
  xDet: { pass: xDet, note: 'the whole two-arm computation run twice, JSON byte-identical' },
  xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved, seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS, skipped: SKIP_FP },
  gRepro65: { pass: first.gRepro65.identical },
  xSrcUntouched: { pass: srcDiff === '', srcDiff },
  seedDisjoint: {
    pass: inBand && clashes.length === 0 && !reproClash,
    block: `${firstSeed}..${lastSeed}`, band: RESERVED_BAND, clashes: clashes.map((c) => c.name),
    repro65Block: `${REPRO65_SEED_START}..${REPRO65_SEED_START + REPRO65_MATCHES - 1}`, repro65Clash: reproClash,
  },
  statsDisjoint: { pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, published: PUBLISHED_STATS_BASES, minGap: statsMinGap },
  flagHygiene: {
    pass: JSON.stringify(ARM_FLAGS.baseline) === JSON.stringify(CENSUS_FLAGS)
      && ARM_FLAGS.o1armed.o1PassWindup === true
      && Object.keys(ARM_FLAGS.o1armed).length === Object.keys(CENSUS_FLAGS).length + 1,
    baseline: ARM_FLAGS.baseline, o1armed: ARM_FLAGS.o1armed,
    note: 'the arms differ in exactly one flag: o1PassWindup',
  },
  tableSha: { pass: true, sha: EXPECTED_TABLE_SHA, holdableCells: HOLDABLE_CELLS },
};
const allGatesPass = Object.values(gates).every((g) => g.pass);

const output = {
  experiment: 'O2-OPENING-SIZING-RERUN',
  authority: 'PROGRAMME-RULINGS #185.2 (the #65.3 unpark condition) · C5-T2-WHETHER-SEAT §5.2 (the form)',
  form: 'the #65 sizing smoke VERBATIM (metrics/eligibility/constants) + three declared additions A1/A2/A3',
  block: `${firstSeed}..${lastSeed}`,
  matches: N_MATCHES,
  armDefinitions: { baseline: 'CENSUS_FLAGS (#65 §0.1)', o1armed: 'CENSUS_FLAGS + o1PassWindup' },
  tableSha: EXPECTED_TABLE_SHA,
  reference65: {
    block: '8500000..8500047', chooserHoldRate: 0.001411, trueContextShare: 0.00586,
    wedgeRatio: 4.1531, abstainUnseenShare: 0.706878, ctxAgreement: 0.502439,
    note: 'chooserHold/abstain/agreement from the committed c5-t2-whether-sizing.json; '
      + 'trueContextShare 0.586 % is the CENSUS quantity (seat §3.4(B), 600/102466); '
      + 'wedgeRatio = 0.00586/0.001411',
  },
  ...first,
  gates,
  allGatesPass,
  deterministic: xDet,
  resultSha,
  head,
  wallMs: Date.now() - wall0,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (x: number) => `${(x * 100).toFixed(3)}%`;
const A = first.arms;
const C = first.contrasts.rates as Record<string, any>;
console.error(
  `O2-SIZING-RERUN · ${output.block} (${N_MATCHES} matches/arm, shared seeds)\n`
  + `  eligible  base ${A.baseline.eligibleTotal} · armed ${A.o1armed.eligibleTotal}\n`
  + `  PERCEIVED hold  base ${pct(A.baseline.chooserHold.rateOfEligible)} (n=${A.baseline.chooserHold.total})`
  + ` · armed ${pct(A.o1armed.chooserHold.rateOfEligible)} (n=${A.o1armed.chooserHold.total})`
  + ` · Δ ${C.perceivedHoldShare.pairedDelta.point} [${C.perceivedHoldShare.pairedDelta.lower}, ${C.perceivedHoldShare.pairedDelta.upper}] resolved=${C.perceivedHoldShare.resolved}\n`
  + `  TRUE-context    base ${pct(A.baseline.trueContext.shareOfEligible)} (n=${A.baseline.trueContext.total})`
  + ` · armed ${pct(A.o1armed.trueContext.shareOfEligible)} (n=${A.o1armed.trueContext.total})`
  + ` · Δ ${C.trueContextShare.pairedDelta.point} [${C.trueContextShare.pairedDelta.lower}, ${C.trueContextShare.pairedDelta.upper}] resolved=${C.trueContextShare.resolved}\n`
  + `  WEDGE base ${A.baseline.wedgeRatio}× · armed ${A.o1armed.wedgeRatio}×`
  + ` · Δ [${C.wedgeRatio.pairedDelta.lower}, ${C.wedgeRatio.pairedDelta.upper}]\n`
  + `  E-ABSTAIN-UNSEEN base ${pct(A.baseline.decisionClassShares['E-ABSTAIN-UNSEEN'].share)}`
  + ` · armed ${pct(A.o1armed.decisionClassShares['E-ABSTAIN-UNSEEN'].share)}`
  + ` · Δ [${C.abstainUnseenShare.pairedDelta.lower}, ${C.abstainUnseenShare.pairedDelta.upper}] resolved=${C.abstainUnseenShare.resolved}\n`
  + `  M-CTX agreement base ${pct(A.baseline.mCtxPerceptionPrice.agreeOverall)}`
  + ` · armed ${pct(A.o1armed.mCtxPerceptionPrice.agreeOverall)}`
  + ` · Δ [${C.ctxAgreement.pairedDelta.lower}, ${C.ctxAgreement.pairedDelta.upper}] resolved=${C.ctxAgreement.resolved}\n`
  + `  DEV floor 0.29%: base ${A.baseline.devFloor.shareClearsFloor} · armed ${A.o1armed.devFloor.shareClearsFloor}\n`
  + `  GATES X-DET ${xDet} · X-FP-PROD ${xFpProd} · G-REPRO65 ${first.gRepro65.identical}`
  + ` · seeds ${gates.seedDisjoint.pass} · stats ${gates.statsDisjoint.pass} · flags ${gates.flagHygiene.pass}`
  + ` · src-untouched ${gates.xSrcUntouched.pass} · ALL ${allGatesPass}\n`
  + `  resultSha ${resultSha} · wall ${Math.round(output.wallMs / 1000)} s`,
);
if (!allGatesPass) process.exitCode = 1;
