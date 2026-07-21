// Probe: S4/S5 PASS-AFFORDANCE CALIBRATION (LAYER-GATE only).
// Samples ordinary ground passes at launch, evaluates the intended receiver
// from exact truth and from S3 snapshots at three synthetic awareness levels,
// then resolves the real target-reception/interception outcome. Nothing here
// feeds Match decisions or consumes Match RNG.
//   npx tsx scripts/probes/pass-affordance-calibration.ts [matches] [seedOffset]
import {
  evaluatePassAffordance, type KnownReachProfile, type PassAffordance,
} from '../../src/ai/passAffordance';
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  oraclePerceptionSnapshot, type PerceptionMemory,
} from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);
const AWARENESS = [0.2, 0.5, 0.8] as const;
const CONTROL_LABELS = ['0..0.25', '0.25..0.5', '0.5..0.75', '0.75..1'];
const MARGIN_LABELS = ['<-0.5', '-0.5..-0.2', '-0.2..0', '0..0.2', '0.2..0.5', '>0.5'];

interface OutcomeBucket {
  n: number;
  received: number;
  intercepted: number;
}

interface Calibration {
  eligible: number;
  evaluated: number;
  boundedMarginError: number;
  controlError: number;
  targetAgeTicks: number;
  noOpponentSnapshots: number;
  brier: number;
  controlBuckets: OutcomeBucket[];
  marginBuckets: OutcomeBucket[];
}

const calibration = (): Calibration => ({
  eligible: 0,
  evaluated: 0,
  boundedMarginError: 0,
  controlError: 0,
  targetAgeTicks: 0,
  noOpponentSnapshots: 0,
  brier: 0,
  controlBuckets: CONTROL_LABELS.map(() => ({ n: 0, received: 0, intercepted: 0 })),
  marginBuckets: MARGIN_LABELS.map(() => ({ n: 0, received: 0, intercepted: 0 })),
});

const oracleMetric = calibration();
const metrics = new Map<number, Calibration>(AWARENESS.map((a) => [a, calibration()]));

const boundedMargin = (value: number): number => Number.isFinite(value)
  ? Math.max(-5, Math.min(5, value))
  : value > 0 ? 5 : -5;

const controlBucket = (probability: number): number => Math.min(3, Math.floor(probability * 4));
const marginBucket = (margin: number): number =>
  margin < -0.5 ? 0 : margin < -0.2 ? 1 : margin < 0 ? 2 : margin < 0.2 ? 3 : margin <= 0.5 ? 4 : 5;

interface Estimate {
  metric: Calibration;
  affordance: PassAffordance;
}

interface TrackedPass {
  passerGid: number;
  targetGid: number;
  kickT: number;
  interceptions0: number;
  predictedArrival: number;
  predictedPoint: Readonly<{ x: number; y: number }>;
  estimates: Estimate[];
}

const recordOutcome = (estimate: Estimate, received: boolean, intercepted: boolean): void => {
  const { metric, affordance } = estimate;
  const buckets = [
    metric.controlBuckets[controlBucket(affordance.controlProbability)],
    metric.marginBuckets[marginBucket(affordance.arrivalMargin)],
  ];
  for (const bucket of buckets) {
    bucket.n++;
    if (received) bucket.received++;
    if (intercepted) bucket.intercepted++;
  }
  metric.brier += (affordance.controlProbability - Number(received)) ** 2;
};

let receivedForFlightError = 0;
let receivedForFiniteTimeError = 0;
let unreachableFlights = 0;
let unreachableButReceived = 0;
let flightTimeError = 0;
let flightPointError = 0;

for (let seed = OFF; seed < OFF + N; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  const memories = new Map<number, Map<number, PerceptionMemory>>(
    AWARENESS.map((awareness) => [awareness, new Map()]),
  );
  const interceptions = (): number =>
    match.teams[0].stats.interceptions + match.teams[1].stats.interceptions;
  let previousPass = match.pendingPass;
  let tracked: TrackedPass | null = null;

  const memoryFor = (awareness: number, gid: number): PerceptionMemory => {
    const byPlayer = memories.get(awareness)!;
    let memory = byPlayer.get(gid);
    if (!memory) {
      memory = createPerceptionMemory();
      byPlayer.set(gid, memory);
    }
    return memory;
  };

  const resolve = (pass: TrackedPass): void => {
    const completed = match.lastCompletedPass;
    const received = !!completed
      && completed.passerGid === pass.passerGid
      && completed.receiverGid === pass.targetGid
      && completed.t >= pass.kickT;
    const intercepted = !received && interceptions() > pass.interceptions0;
    if (received) {
      receivedForFlightError++;
      flightPointError += Math.hypot(
        match.ball.pos.x - pass.predictedPoint.x,
        match.ball.pos.y - pass.predictedPoint.y,
      );
      if (Number.isFinite(pass.predictedArrival)) {
        receivedForFiniteTimeError++;
        flightTimeError += Math.abs((match.simTime - pass.kickT) - pass.predictedArrival);
      } else {
        unreachableButReceived++;
      }
    }
    for (const estimate of pass.estimates) recordOutcome(estimate, received, intercepted);
  };

  while (!match.finished) {
    // Keep the current carrier's last-known world warm before a possible kick.
    // This gives the launch snapshot real scan age instead of constructing a
    // fresh memory only when a pass has already happened.
    const carrier = match.phase === 'playing' ? match.ball.owner : null;
    if (carrier && !carrier.sentOff) {
      const truth = capturePerceptionTruth(match);
      for (const awareness of AWARENESS) {
        perceiveSnapshot(truth, carrier.gid, awareness, seed, memoryFor(awareness, carrier.gid));
      }
    }

    match.step(DT);
    const pass = match.pendingPass;
    if (pass !== previousPass) {
      if (tracked) resolve(tracked);
      tracked = null;

      const ordinary = pass
        && match.phase === 'playing'
        && match.lastPassKind?.kind === 'pass'
        && match.lastPassKind.t === pass.t;
      if (ordinary) {
        const passer = match.allPlayers[pass.passerGid];
        const target = match.allPlayers[pass.targetGid];
        if (passer && target && !passer.sentOff && !target.sentOff) {
          const truth = capturePerceptionTruth(match);
          const profiles = new Map<number, KnownReachProfile>();
          for (const player of match.allPlayers) {
            if (player.sentOff) continue;
            profiles.set(player.gid, {
              topSpeed: player.topSpeed,
              accel: player.accel,
              dribbling: player.attrs.dribbling,
            });
          }
          const oracle = evaluatePassAffordance({
            snapshot: oraclePerceptionSnapshot(truth, passer.gid),
            passerGid: passer.gid,
            targetGid: target.gid,
            attackDir: match.teams[passer.side].attackDir,
            reachProfiles: profiles,
          });
          if (oracle) {
            if (!oracle.flight.reachable) unreachableFlights++;
            oracleMetric.eligible++;
            oracleMetric.evaluated++;
            const estimates: Estimate[] = [{ metric: oracleMetric, affordance: oracle.affordance }];
            for (const awareness of AWARENESS) {
              const metric = metrics.get(awareness)!;
              metric.eligible++;
              const snapshot = perceiveSnapshot(
                truth, passer.gid, awareness, seed, memoryFor(awareness, passer.gid),
              );
              const observedPasser = snapshot.players.find((player) => player.gid === passer.gid);
              if (observedPasser && !snapshot.players.some((player) => player.side !== observedPasser.side)) {
                metric.noOpponentSnapshots++;
              }
              const estimate = evaluatePassAffordance({
                snapshot,
                passerGid: passer.gid,
                targetGid: target.gid,
                attackDir: match.teams[passer.side].attackDir,
                reachProfiles: profiles,
              });
              if (!estimate) continue;
              metric.evaluated++;
              metric.boundedMarginError += Math.abs(
                boundedMargin(estimate.affordance.arrivalMargin)
                - boundedMargin(oracle.affordance.arrivalMargin),
              );
              metric.controlError += Math.abs(
                estimate.affordance.controlProbability - oracle.affordance.controlProbability,
              );
              metric.targetAgeTicks += estimate.affordance.targetObservationAgeTicks;
              estimates.push({ metric, affordance: estimate.affordance });
            }
            tracked = {
              passerGid: passer.gid,
              targetGid: target.gid,
              kickT: match.simTime,
              interceptions0: interceptions(),
              predictedArrival: oracle.affordance.ballArrival,
              predictedPoint: oracle.affordance.targetPoint,
              estimates,
            };
          }
        }
      }
    }
    previousPass = pass;
  }
  if (tracked) resolve(tracked);
}

const pct = (value: number, denominator: number): string =>
  `${((value / Math.max(denominator, 1)) * 100).toFixed(1)}%`;

console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   ordinary passes ${(oracleMetric.evaluated / N).toFixed(1)}/match`);
console.log('S4/S5 are OFFLINE only: no live consumer, gene, action score, or Match RNG use.');
console.log(
  `S4 intended-flight error on ${receivedForFlightError} target receptions: `
  + `finite-time MAE ${(flightTimeError / Math.max(receivedForFiniteTimeError, 1)).toFixed(3)}s, `
  + `point MAE ${(flightPointError / Math.max(receivedForFlightError, 1)).toFixed(2)}m; `
  + `friction-unreachable ${unreachableFlights}/${oracleMetric.evaluated} launches `
  + `(${unreachableButReceived} still met early by target)`,
);
console.log('\nperception → affordance fidelity against exact-truth evaluation:');
for (const awareness of AWARENESS) {
  const metric = metrics.get(awareness)!;
  const evaluated = Math.max(metric.evaluated, 1);
  console.log(
    `  awareness ${awareness.toFixed(1)}: coverage ${pct(metric.evaluated, metric.eligible)}, `
    + `margin MAE ${(metric.boundedMarginError / evaluated).toFixed(3)}s, `
    + `control MAE ${(metric.controlError / evaluated).toFixed(3)}, `
    + `target age ${(metric.targetAgeTicks / evaluated).toFixed(1)} ticks, `
    + `no-opponent snapshots ${pct(metric.noOpponentSnapshots, metric.eligible)}`,
  );
}

const printReliability = (name: string, metric: Calibration): void => {
  const total = metric.controlBuckets.reduce((sum, bucket) => sum + bucket.n, 0);
  console.log(`\n${name} control prior → actual intended-target outcome (Brier ${(metric.brier / Math.max(total, 1)).toFixed(3)}):`);
  console.log('  prior       share   received  intercepted');
  for (let i = 0; i < metric.controlBuckets.length; i++) {
    const bucket = metric.controlBuckets[i];
    console.log(
      `  ${CONTROL_LABELS[i].padEnd(11)} ${pct(bucket.n, total).padStart(6)}   `
      + `${pct(bucket.received, bucket.n).padStart(8)}   ${pct(bucket.intercepted, bucket.n).padStart(10)}`,
    );
  }
};

const printMarginReliability = (name: string, metric: Calibration): void => {
  const total = metric.marginBuckets.reduce((sum, bucket) => sum + bucket.n, 0);
  console.log(`\n${name} arrival margin → actual intended-target outcome:`);
  console.log('  margin      share   received  intercepted');
  for (let i = 0; i < metric.marginBuckets.length; i++) {
    const bucket = metric.marginBuckets[i];
    console.log(
      `  ${MARGIN_LABELS[i].padEnd(11)} ${pct(bucket.n, total).padStart(6)}   `
      + `${pct(bucket.received, bucket.n).padStart(8)}   ${pct(bucket.intercepted, bucket.n).padStart(10)}`,
    );
  }
};

printMarginReliability('exact-truth', oracleMetric);
printReliability('exact-truth', oracleMetric);
for (const awareness of AWARENESS) printReliability(`awareness ${awareness.toFixed(1)}`, metrics.get(awareness)!);
