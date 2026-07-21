// O0a OFF-BALL OFFER FIELD CENSUS (probe-only, no live consumer).
//
// Samples attacking off-ball outfielders once per sim-second and compares the
// causal facts exposed by O0's generic field with the legacy supportSpot point.
// It never selects a point or mutates the match.
//   npx tsx scripts/probes/offball-offer-field.ts [matches] [seedOffset]
import {
  evaluateOffBallAffordances, evaluateOffBallCandidate,
  type OffBallAffordance, type OffBallCandidatePoint,
} from '../../src/ai/offBallAffordance';
import {
  capturePerceptionTruth, oraclePerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { supportSpot } from '../../src/ai/formations';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const N = Number(process.argv[2] ?? 24);
const OFF = Number(process.argv[3] ?? 0);
const SAMPLE_TICKS = Math.round(1 / DT);
const EPS = 1e-6;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

type Sector = 'forward' | 'lateral' | 'backward' | 'hold';
const SECTORS = ['forward', 'lateral', 'backward', 'hold'] as const;

interface SectorStats {
  count: number;
  statesWithCandidate: number;
  statesWithJointWindow: number;
  onside: number;
  positiveMargin: number;
  jointWindow: number;
  selfArrival: number;
  opponentMargin: number;
  teammateSpacing: number;
  laneClearance: number;
}

const sectorStats = (): SectorStats => ({
  count: 0,
  statesWithCandidate: 0,
  statesWithJointWindow: 0,
  onside: 0,
  positiveMargin: 0,
  jointWindow: 0,
  selfArrival: 0,
  opponentMargin: 0,
  teammateSpacing: 0,
  laneClearance: 0,
});

const sectorOf = (candidate: OffBallCandidatePoint): Sector => {
  if (Math.abs(candidate.forwardDelta) <= EPS && Math.abs(candidate.lateralDelta) <= EPS) return 'hold';
  if (candidate.forwardDelta > EPS) return 'forward';
  if (candidate.forwardDelta < -EPS) return 'backward';
  return 'lateral';
};

const finiteAffordance = (value: OffBallAffordance): boolean => [
  value.candidate.point.x,
  value.candidate.point.y,
  value.candidate.forwardDelta,
  value.candidate.lateralDelta,
  value.selfArrival,
  value.selfTurnTime,
  value.opponentArrival,
  value.opponentArrivalMargin,
  value.nearestOpponentDistanceAtArrival,
  value.nearestTeammateDistanceAtArrival,
  value.carrierDistanceAtArrival,
  value.carrierLaneClearance,
  value.fieldMargin,
  value.offsideMargin,
  value.offsideRisk,
].every(Number.isFinite);

const record = (stats: SectorStats, value: OffBallAffordance): void => {
  stats.count++;
  const onside = value.offsideMargin <= 0;
  const positiveMargin = value.opponentArrivalMargin > 0;
  if (onside) stats.onside++;
  if (positiveMargin) stats.positiveMargin++;
  if (onside && positiveMargin) stats.jointWindow++;
  stats.selfArrival += value.selfArrival;
  stats.opponentMargin += value.opponentArrivalMargin;
  stats.teammateSpacing += value.nearestTeammateDistanceAtArrival;
  stats.laneClearance += value.carrierLaneClearance;
};

const generic = new Map<Sector, SectorStats>([
  ['forward', sectorStats()],
  ['lateral', sectorStats()],
  ['backward', sectorStats()],
  ['hold', sectorStats()],
]);
const legacy = new Map<Sector, SectorStats>([
  ['forward', sectorStats()],
  ['lateral', sectorStats()],
  ['backward', sectorStats()],
  ['hold', sectorStats()],
]);

let eligibleStates = 0;
let evaluatedStates = 0;
let missingFactEvaluations = 0;
let nonFiniteFields = 0;
let totalCandidates = 0;
let boundaryPruned = 0;

for (let seed = OFF; seed < OFF + N; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });

  while (!match.finished) {
    match.step(DT);
    if (match.simTick % SAMPLE_TICKS !== 0 || match.phase !== 'playing') continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff) continue;
    const side = carrier.side;
    const attackingTeam = match.teams[side];
    const truth = capturePerceptionTruth(match);
    const reachProfiles = new Map<number, KnownReachProfile>();
    for (const body of match.allPlayers) {
      if (body.sentOff) continue;
      reachProfiles.set(body.gid, {
        topSpeed: body.topSpeed,
        accel: body.accel,
        dribbling: body.attrs.dribbling,
      });
    }

    for (const player of attackingTeam.players) {
      if (player.sentOff || player === carrier || player.role === 'GK') continue;
      eligibleStates++;
      const input = {
        snapshot: oraclePerceptionSnapshot(truth, player.gid),
        playerGid: player.gid,
        carrierGid: carrier.gid,
        attackDir: attackingTeam.attackDir,
        reachProfiles,
      } as const;
      const values = evaluateOffBallAffordances(input);
      if (!values) {
        missingFactEvaluations++;
        continue;
      }
      evaluatedStates++;
      totalCandidates += values.length;
      boundaryPruned += 17 - values.length;

      const stateSectors = new Set<Sector>();
      const stateJointSectors = new Set<Sector>();
      for (const value of values) {
        if (!finiteAffordance(value)) nonFiniteFields++;
        const sector = sectorOf(value.candidate);
        stateSectors.add(sector);
        if (value.offsideMargin <= 0 && value.opponentArrivalMargin > 0) {
          stateJointSectors.add(sector);
        }
        record(generic.get(sector)!, value);
      }
      for (const sector of stateSectors) generic.get(sector)!.statesWithCandidate++;
      for (const sector of stateJointSectors) generic.get(sector)!.statesWithJointWindow++;

      const legacyPoint = supportSpot(player, attackingTeam, match.ball);
      const legacyCandidate: OffBallCandidatePoint = {
        id: 'legacy-support',
        point: { x: legacyPoint.x, y: legacyPoint.y },
        sampleHorizon: 0,
        directionIndex: null,
        forwardDelta: (legacyPoint.x - player.pos.x) * attackingTeam.attackDir,
        lateralDelta: legacyPoint.y - player.pos.y,
      };
      const legacyValue = evaluateOffBallCandidate(input, legacyCandidate);
      if (!legacyValue) {
        missingFactEvaluations++;
        continue;
      }
      if (!finiteAffordance(legacyValue)) nonFiniteFields++;
      const legacySector = sectorOf(legacyCandidate);
      const legacyStats = legacy.get(legacySector)!;
      record(legacyStats, legacyValue);
      legacyStats.statesWithCandidate++;
      if (legacyValue.offsideMargin <= 0 && legacyValue.opponentArrivalMargin > 0) {
        legacyStats.statesWithJointWindow++;
      }
    }
  }
}

const pct = (part: number, whole: number): string =>
  whole > 0 ? `${(part / whole * 100).toFixed(1)}%` : 'n/a';
const avg = (sum: number, count: number): string =>
  count > 0 ? (sum / count).toFixed(3) : 'n/a';

console.log(`O0a OFF-BALL OFFER FIELD CENSUS · ${N} matches · seeds ${OFF}..${OFF + N - 1}`);
console.log(`states eligible/evaluated/missing ${eligibleStates}/${evaluatedStates}/${missingFactEvaluations}`);
console.log(`candidates/state ${avg(totalCandidates, evaluatedStates)} · boundary pruned/state ${avg(boundaryPruned, evaluatedStates)} · non-finite ${nonFiniteFields}`);
console.log('\ngeneric field (geometric sectors; no selection):');
for (const sector of SECTORS) {
  const stats = generic.get(sector)!;
  console.log(
    `  ${sector.padEnd(8)} n=${stats.count} · state coverage ${pct(stats.statesWithCandidate, evaluatedStates)}`
    + ` · joint-window states ${pct(stats.statesWithJointWindow, evaluatedStates)}`
    + ` · onside ${pct(stats.onside, stats.count)} · margin>0 ${pct(stats.positiveMargin, stats.count)}`
    + ` · ETA ${avg(stats.selfArrival, stats.count)}s · oppMargin ${avg(stats.opponentMargin, stats.count)}s`
    + ` · mateSpace ${avg(stats.teammateSpacing, stats.count)}m · lane ${avg(stats.laneClearance, stats.count)}m`,
  );
}
console.log('\nlegacy supportSpot (same vector interface):');
for (const sector of SECTORS) {
  const stats = legacy.get(sector)!;
  console.log(
    `  ${sector.padEnd(8)} n=${stats.count} · states ${pct(stats.statesWithCandidate, evaluatedStates)}`
    + ` · joint-window ${pct(stats.statesWithJointWindow, evaluatedStates)}`
    + ` · onside ${pct(stats.onside, stats.count)} · margin>0 ${pct(stats.positiveMargin, stats.count)}`
    + ` · ETA ${avg(stats.selfArrival, stats.count)}s · oppMargin ${avg(stats.opponentMargin, stats.count)}s`
    + ` · mateSpace ${avg(stats.teammateSpacing, stats.count)}m · lane ${avg(stats.laneClearance, stats.count)}m`,
  );
}

if (missingFactEvaluations > 0 || nonFiniteFields > 0) process.exitCode = 1;
