// C5 T2 — THE WHETHER SEAT: READ-ONLY SIZING SMOKE
// (docs/world-model/C5-T2-WHETHER-SEAT.md §5.2, ruling #64.3 / #44.5).
//
// The LIVE perceived-0|0|0 chooser-hold rate is NOT derivable from the banked
// census (which keyed on TRUE context). This smoke measures it EX ANTE, with the
// seat's decision function armed but **no forks taken and no cost measured** —
// the trajectory is the untouched A0 world (whetherEye stays null on the live
// match; every decision is classified on a PRISTINE CLONE, so the live world is
// never perturbed). Over the disjoint block 8,500,000..8,500,047 (48 matches,
// #46.2) it reports: the eligible-moment count per match, the decision-class
// shares (D-HOLD / E-ACTNOW-DECLINED / E-ABSTAIN-UNSEEN / E-NOCELL), the
// perceived-vs-true cell agreement, and hence the live chooser-hold rate that
// FIXES the §5.1 fork-stage ceiling. Its numbers trigger #44.5's commander
// sign-off. It is committed WITH the implementation, BEFORE any fork run.
//
// It changes NO frozen quantity and takes NO holds — rates only, #44.5 form.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { whetherEyeDecision, type RecensusCostTable } from '../../src/ai/whetherEye';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen parameters (§5.1 / §5.2) -----------------------------------------
const MATCH_DURATION = 240;
const SMOKE_SEED_START = 8_500_000;
const SMOKE_MATCHES = envInt('C5T2_SMOKE_MATCHES', 48);
const PER_MATCH_CAP = 80; // census verbatim
const MOMENT_SPACING = 30; // census verbatim
const HORIZON = 240; // (unused for cost here; kept for the A0 eligibility fork)
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
// The certified DEV floor and cell share (§3.4(B)).
const N_HOLD_FLOOR = 446;
const SHARE_FLOOR = 0.0029; // 0.29% of eligible moments (½ × census true-context share)
const TABLE_PATH = process.env.C5T2_TABLE ?? 'docs/world-model/data/c5-recensus.json';
const OUT_PATH = process.env.C5T2_SMOKE_OUT ?? 'docs/world-model/data/c5-t2-whether-sizing.json';
// The frozen certified table's SHA (§0) — a drift guard on the injected table.
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';

/** The enriched census world (§0.1) — the world the table was priced on. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...CENSUS_FLAGS,
});
const distance = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const mean = (xs: number[]): number => (xs.length === 0 ? NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : NaN);

// --- inject the certified table (P2 convention: never bundled in src) --------
const rawFile = readFileSync(TABLE_PATH, 'utf8');
const raw = JSON.parse(rawFile);
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

type Band = 0 | 1 | 2;
const pressureBandOf = (v: number): Band =>
  (v < TABLE.pressureBands[0] ? 0 : v < TABLE.pressureBands[1] ? 1 : 2);
const staleBandOf = (v: number): Band =>
  (v < TABLE.staleBands[0] ? 0 : v < TABLE.staleBands[1] ? 1 : 2);
const supportBandOf = (v: number): Band =>
  (v < TABLE.supportCuts.low ? 0 : v >= TABLE.supportCuts.high ? 2 : 1);

/** A0 (untouched): one fork step to read the decided action, per repair (iv). */
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

/** The TRUE-context cell (census keying), for the M-CTX perception-price mediator. */
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
}

const runSmoke = () => {
  const rows: PerMatch[] = [];
  // M-CTX agreement accumulators (over eligible moments where a perceived cell was placed).
  let ctxPlaced = 0;
  let ctxAgreeAll = 0;
  const ctxAgreeFeature = [0, 0, 0]; // pressure / stale / support
  const perceivedCellCounts: Record<string, number> = {};

  for (let seed = SMOKE_SEED_START; seed < SMOKE_SEED_START + SMOKE_MATCHES; seed++) {
    const match = matchOf(seed);
    let sinceLast = MOMENT_SPACING;
    let inMatch = 0;
    const r: PerMatch = {
      seed, qualifying: 0, eligible: 0, exFirstTouch: 0, exMustKick: 0, exShoot: 0, exClear: 0,
      classCounts: { 'D-HOLD': 0, 'E-ACTNOW-DECLINED': 0, 'E-ABSTAIN-UNSEEN': 0, 'E-NOCELL': 0 },
      dHold: 0, holdCells: {},
    };
    while (!match.finished && inMatch < PER_MATCH_CAP) {
      const owner: Player | null = match.ball.owner;
      const qualifies = match.phase === 'playing' && owner !== null
        && owner.role !== 'GK' && !owner.sentOff
        && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
      if (qualifies) {
        r.qualifying += 1;
        const gid = owner!.gid;
        // A PRISTINE clone — every read (eligibility fork + the whether decision)
        // runs off it, so the live A0 trajectory is never perturbed (read-only).
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
            // M-CTX: perceived-vs-true agreement (perception price), when a cell was placed.
            if (decision.perceived !== null) {
              const truth = trueCellOf(match, owner!);
              const pb = [decision.perceived.pressureBand, decision.perceived.staleBand, decision.perceived.supportBand];
              const perceivedKey = `${pb[0]}|${pb[1]}|${pb[2]}`;
              perceivedCellCounts[perceivedKey] = (perceivedCellCounts[perceivedKey] ?? 0) + 1;
              ctxPlaced += 1;
              if (perceivedKey === truth.key) ctxAgreeAll += 1;
              for (let f = 0; f < 3; f++) if (pb[f] === truth.bands[f]) ctxAgreeFeature[f] += 1;
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

  const sum = (f: (r: PerMatch) => number) => rows.reduce((a, r) => a + f(r), 0);
  const totalQual = sum((r) => r.qualifying);
  const totalElig = sum((r) => r.eligible);
  const totalHold = sum((r) => r.dHold);
  const classShares = Object.fromEntries(CLASSES.map((c) => [
    c, { count: sum((r) => r.classCounts[c]), share: round(sum((r) => r.classCounts[c]) / Math.max(1, totalElig)) },
  ]));
  const holdPerMatch = rows.map((r) => r.dHold);
  const eligPerMatch = rows.map((r) => r.eligible);
  const chooserHoldRate = totalHold / Math.max(1, totalElig); // D-HOLD share of eligible
  const holdCellAgg: Record<string, number> = {};
  for (const r of rows) for (const [k, v] of Object.entries(r.holdCells)) holdCellAgg[k] = (holdCellAgg[k] ?? 0) + v;

  // The ceiling the measured rate implies (§5.1, #44.5).
  const holdsPerMatch = mean(holdPerMatch);
  const matchesForNfloor = holdsPerMatch > 0 ? Math.ceil(N_HOLD_FLOOR / holdsPerMatch) : null;
  const shareClears = chooserHoldRate >= SHARE_FLOOR;

  return {
    experiment: 'C5-T2-WHETHER-SIZING-SMOKE',
    authority: 'C5-T2-WHETHER-SEAT',
    block: `${SMOKE_SEED_START}..${SMOKE_SEED_START + SMOKE_MATCHES - 1}`,
    matches: SMOKE_MATCHES,
    tableSha: EXPECTED_TABLE_SHA,
    qualifyingTotal: totalQual,
    eligibleTotal: totalElig,
    eligibleFraction: round(totalElig / Math.max(1, totalQual)),
    eligiblePerMatch: {
      mean: round(mean(eligPerMatch), 3), min: Math.min(...eligPerMatch), max: Math.max(...eligPerMatch),
    },
    exclusions: {
      firstTouch: sum((r) => r.exFirstTouch), mustKick: sum((r) => r.exMustKick),
      a0Shoot: sum((r) => r.exShoot), a0Clear: sum((r) => r.exClear),
    },
    decisionClassShares: classShares,
    chooserHold: {
      total: totalHold,
      rateOfEligible: round(chooserHoldRate),
      perMatchMean: round(holdsPerMatch, 4),
      perMatchMax: Math.max(...holdPerMatch),
      byCell: holdCellAgg,
    },
    mCtxPerceptionPrice: {
      placed: ctxPlaced,
      agreeOverall: round(ctxAgreeAll / Math.max(1, ctxPlaced)),
      agreePressure: round(ctxAgreeFeature[0] / Math.max(1, ctxPlaced)),
      agreeStale: round(ctxAgreeFeature[1] / Math.max(1, ctxPlaced)),
      agreeSupport: round(ctxAgreeFeature[2] / Math.max(1, ctxPlaced)),
      perceivedCellMix: perceivedCellCounts,
    },
    ceilingImplication: {
      nHoldFloor: N_HOLD_FLOOR,
      shareFloorPp: round(SHARE_FLOOR * 100, 4),
      measuredHoldsPerMatch: round(holdsPerMatch, 4),
      matchesForNfloor,
      provisionalCeiling: 1600,
      shareClearsFloor: shareClears,
      note: 'ceiling = matches to accumulate N_hold>=446 chooser-taken k30 holds; compare to the provisional 1,600 (§5.1). Commander signs off the final ceiling (#44.5).',
    },
  };
};

// Determinism: two invocations byte-identical + a canonical SHA (the smoke's X-DET).
const first = runSmoke();
const second = runSmoke();
const firstJson = JSON.stringify(first);
const deterministic = firstJson === JSON.stringify(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (x: number) => `${(x * 100).toFixed(3)}%`;
console.error(
  `C5-T2-SIZING-SMOKE · ${output.block} (${output.matches} matches)`
  + ` · qualifying ${output.qualifyingTotal} · eligible ${output.eligibleTotal}`
  + ` (${pct(output.eligibleFraction)}) · elig/match ${output.eligiblePerMatch.mean}`
  + ` · D-HOLD ${output.chooserHold.total} = ${pct(output.chooserHold.rateOfEligible)} of eligible`
  + ` (${output.chooserHold.perMatchMean}/match, max ${output.chooserHold.perMatchMax})`
  + ` · byCell ${JSON.stringify(output.chooserHold.byCell)}`
  + ` · classes ${CLASSES.map((c) => `${c} ${output.decisionClassShares[c].count}`).join(' / ')}`
  + ` · M-CTX agree ${pct(output.mCtxPerceptionPrice.agreeOverall)}`
  + ` (P ${pct(output.mCtxPerceptionPrice.agreePressure)} S ${pct(output.mCtxPerceptionPrice.agreeStale)} sup ${pct(output.mCtxPerceptionPrice.agreeSupport)})`
  + ` · ceiling: ${output.ceilingImplication.matchesForNfloor} matches for N>=446`
  + ` vs provisional 1600 · share clears 0.29%: ${output.ceilingImplication.shareClearsFloor}`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
