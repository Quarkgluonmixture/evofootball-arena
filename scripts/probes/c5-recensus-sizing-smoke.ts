// C5 RE-CENSUS — READ-ONLY sizing smoke (docs/world-model/C5-RECENSUS.md §3.7).
//
// Purpose: repair (iv) — eligible-choice moments — is NEW, so the eligible-moment
// yield per match, the exclusion shares, the eligible-population pressure-band
// shares, and the act-now per-cluster variance are NOT derivable from banked
// data (#24). This smoke measures them with NO forced holds and NO src change,
// using only untouched A0 forks, over a DISJOINT block (8,290,000..8,290,015,
// #46.2). It changes no frozen quantity; its numbers are disclosed in the doc's
// §RESULT-SMOKE. It is committed WITH the freeze.
import { pressureAt } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCH_DURATION = 240;
const SMOKE_SEED_START = 8_290_000;
const SMOKE_MATCHES = 48;
const PER_MATCH_CAP = 80;
const MOMENT_SPACING = 30;
const HORIZON = 240;
const PRESSURE_BANDS = [0.15, 0.45] as const;
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;

const VALUE_FLAGS = {
  edsPerceivedDefence: true,
  edsPerceivedChoice: true,
  edsValueAxis: true,
  c5Hold: true,
  c5TouchFork: false,
  c6Carry: true,   // the enriched world (§0.1)
  c7Windup: true,
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
  duration: MATCH_DURATION, ...VALUE_FLAGS,
});
const distance = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const pressureBandOf = (v: number): 0 | 1 | 2 =>
  (v < PRESSURE_BANDS[0] ? 0 : v < PRESSURE_BANDS[1] ? 1 : 2);
const mean = (xs: number[]): number => (xs.length === 0 ? NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const sd = (xs: number[]): number => {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
};

/** A0 (untouched): run the fork to horizon; return the decided action + shot. */
const runA0 = (before: Match, ownerGid: number) => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  const attacking = fork.teams[owner.side];
  const shotsBefore = attacking.stats.shots;
  const startTick = fork.simTick;
  let action = owner.action.type;
  let shot = false;
  let reached = false;
  for (let t = 0; t < HORIZON; t++) {
    if (fork.finished) break;
    fork.step(DT);
    const elapsed = fork.simTick - startTick;
    if (elapsed === 1) action = owner.action.type; // the decision just made
    if (elapsed === HORIZON) { shot = attacking.stats.shots > shotsBefore; reached = true; break; }
  }
  if (!reached) shot = attacking.stats.shots > shotsBefore;
  return { action, shot };
};

interface PerMatch {
  seed: number;
  qualifying: number;
  eligible: number;
  exFirstTouch: number;
  exMustKick: number;
  exShoot: number;
  exClear: number;
  bandCounts: [number, number, number];
  eligShotRate: number; // act-now shot rate on eligible moments in this match
}

const rows: PerMatch[] = [];
for (let seed = SMOKE_SEED_START; seed < SMOKE_SEED_START + SMOKE_MATCHES; seed++) {
  const match = matchOf(seed);
  let sinceLast = MOMENT_SPACING;
  let inMatch = 0;
  const r: PerMatch = {
    seed, qualifying: 0, eligible: 0, exFirstTouch: 0, exMustKick: 0,
    exShoot: 0, exClear: 0, bandCounts: [0, 0, 0], eligShotRate: NaN,
  };
  const eligShots: number[] = [];
  while (!match.finished && inMatch < PER_MATCH_CAP) {
    const owner: Player | null = match.ball.owner;
    const qualifies = match.phase === 'playing' && owner !== null
      && owner.role !== 'GK' && !owner.sentOff
      && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
    if (qualifies) {
      r.qualifying += 1;
      const before = cloneSimulationState(match);
      // eligibility, repair (iv):
      let eligible = true;
      if (owner!.firstTouchWindow > 0) { r.exFirstTouch += 1; eligible = false; }
      else if (match.restartKickGid === owner!.gid) { r.exMustKick += 1; eligible = false; }
      else {
        const a0 = runA0(before, owner!.gid);
        if (a0.action === 'Shoot') { r.exShoot += 1; eligible = false; }
        else if (a0.action === 'ClearBall') { r.exClear += 1; eligible = false; }
        else {
          eligible = true;
          r.eligible += 1;
          r.bandCounts[pressureBandOf(pressureAt(owner!.pos, match.teams[1 - owner!.side].players))] += 1;
          eligShots.push(a0.shot ? 1 : 0);
        }
      }
      void eligible;
      sinceLast = 0;
      inMatch += 1;
    }
    match.step(DT);
    sinceLast += 1;
  }
  r.eligShotRate = mean(eligShots);
  rows.push(r);
}

const totalQual = rows.reduce((a, r) => a + r.qualifying, 0);
const totalElig = rows.reduce((a, r) => a + r.eligible, 0);
const perMatchElig = rows.map((r) => r.eligible);
const bandTotals = rows.reduce<[number, number, number]>(
  (a, r) => [a[0] + r.bandCounts[0], a[1] + r.bandCounts[1], a[2] + r.bandCounts[2]], [0, 0, 0]);
const bandSum = bandTotals[0] + bandTotals[1] + bandTotals[2];
const perMatchRates = rows.map((r) => r.eligShotRate).filter((x) => Number.isFinite(x));

const summary = {
  block: `${SMOKE_SEED_START}..${SMOKE_SEED_START + SMOKE_MATCHES - 1}`,
  matches: SMOKE_MATCHES,
  qualifyingTotal: totalQual,
  eligibleTotal: totalElig,
  eligibleFraction: Number((totalElig / totalQual).toFixed(4)),
  eligiblePerMatch: {
    mean: Number(mean(perMatchElig).toFixed(2)),
    min: Math.min(...perMatchElig),
    max: Math.max(...perMatchElig),
  },
  exclusions: {
    firstTouch: rows.reduce((a, r) => a + r.exFirstTouch, 0),
    mustKick: rows.reduce((a, r) => a + r.exMustKick, 0),
    a0Shoot: rows.reduce((a, r) => a + r.exShoot, 0),
    a0Clear: rows.reduce((a, r) => a + r.exClear, 0),
  },
  eligiblePressureShares: {
    free: Number((bandTotals[0] / bandSum).toFixed(4)),
    mid: Number((bandTotals[1] / bandSum).toFixed(4)),
    pressed: Number((bandTotals[2] / bandSum).toFixed(4)),
  },
  actNowEligible: {
    shotRate: Number((mean(perMatchRates)).toFixed(4)),
    perMatchClusterSd: Number((sd(perMatchRates)).toFixed(4)),
  },
  smallestBandShare: Number((Math.min(bandTotals[0], bandTotals[1], bandTotals[2]) / bandSum).toFixed(4)),
};

// --- H1 re-powering, derived from the MEASURED cluster SD (§3.0) --------------
// SE_diff(K_b,K_h) = sigma_c * sqrt(1/K_b + 1/K_h); ratio K_b:K_h = 2.5:1 (as C5 T1's 75:32).
const sigmaC = sd(perMatchRates); // per-match (cluster) SD of the act-now marginal
const seDiff = (kb: number, kh: number): number => sigmaC * Math.sqrt(1 / kb + 1 / kh);
// (a) the K needed for the inherited 2.0pp tolerance to be >= 3 sigma:
const solveKfor3sigma = () => {
  for (let kh = 8; kh <= 20000; kh++) {
    const kb = Math.ceil(kh * 2.5);
    if (3 * seDiff(kb, kh) <= 0.02) return { kBuild: kb, kHeldout: kh };
  }
  return null;
};
// (b) the tolerance that equals 3 sigma at a feasible design:
const feasible = [
  [180, 72], [300, 120], [400, 160], [500, 200],
].map(([kb, kh]) => ({
  kBuild: kb, kHeldout: kh,
  seDiffPp: Number((seDiff(kb, kh) * 100).toFixed(3)),
  tol3sigmaPp: Number((3 * seDiff(kb, kh) * 100).toFixed(3)),
  sigmaAt2pp: Number((0.02 / seDiff(kb, kh)).toFixed(2)),
}));

const h1Repower = {
  measuredSigmaCPp: Number((sigmaC * 100).toFixed(3)),
  note: 'sigma_c = per-match cluster SD of the act-now marginal on the ENRICHED, ELIGIBLE population',
  kFor2ppAt3sigma: solveKfor3sigma(),
  feasibleDesigns: feasible,
};

console.log(JSON.stringify({ ...summary, h1Repower }, null, 2));
