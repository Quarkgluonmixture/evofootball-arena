// Probe: S7 PASS NEXT-STATE PARETO FRONTIER (OFFLINE layer/capability gate).
// At each ordinary-pass launch, evaluates every teammate through the S4/S5
// vector and asks only whether one candidate is unambiguously dominated.
// It does NOT assign utility weights, alter the live choice, or claim the
// observational outcome comparison is a counterfactual payoff proof.
//   npx tsx scripts/probes/pass-value-frontier.ts [matches] [seedOffset]
import {
  evaluatePassAffordance, type KnownReachProfile, type PassAffordanceResult,
} from '../../src/ai/passAffordance';
import {
  comparePassNextStates, passNextStateValue, passParetoFrontier,
  type PassNextStateValue,
} from '../../src/ai/passValue';
import {
  capturePerceptionTruth, createPerceptionMemory, oraclePerceptionSnapshot,
  perceiveSnapshot, type PerceptionMemory, type PerceptionSnapshot,
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
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);
const AWARENESS = [0.2, 0.5, 0.8] as const;

interface PerceptionMetric {
  sets: number;
  oracleCandidates: number;
  perceivedCandidates: number;
  relationPairs: number;
  relationMatches: number;
  frontierCandidates: number;
  frontierMatches: number;
  chosenComparable: number;
  chosenOnFrontier: number;
}

const perceptionMetrics = new Map<number, PerceptionMetric>(AWARENESS.map((awareness) => [awareness, {
  sets: 0,
  oracleCandidates: 0,
  perceivedCandidates: 0,
  relationPairs: 0,
  relationMatches: 0,
  frontierCandidates: 0,
  frontierMatches: 0,
  chosenComparable: 0,
  chosenOnFrontier: 0,
}]));

interface OutcomeMetric {
  n: number;
  received: number;
  intercepted: number;
}

const outcomes: Record<'frontier' | 'dominated', OutcomeMetric> = {
  frontier: { n: 0, received: 0, intercepted: 0 },
  dominated: { n: 0, received: 0, intercepted: 0 },
};

interface TrackedPass {
  passerGid: number;
  targetGid: number;
  kickT: number;
  interceptions0: number;
  classification: 'frontier' | 'dominated';
}

let candidateSets = 0;
let candidateCount = 0;
let frontierCount = 0;
let chosenComparable = 0;
let chosenFrontier = 0;
let chosenDominated = 0;
let dominatorCount = 0;

const profilesOf = (match: Match): Map<number, KnownReachProfile> => {
  const profiles = new Map<number, KnownReachProfile>();
  for (const player of match.allPlayers) {
    if (player.sentOff) continue;
    profiles.set(player.gid, {
      topSpeed: player.topSpeed,
      accel: player.accel,
      dribbling: player.attrs.dribbling,
    });
  }
  return profiles;
};

const valuesOf = (
  snapshot: PerceptionSnapshot,
  passerGid: number,
  targetGids: readonly number[],
  attackDir: 1 | -1,
  profiles: ReadonlyMap<number, KnownReachProfile>,
): PassNextStateValue[] => {
  const values: PassNextStateValue[] = [];
  for (const targetGid of targetGids) {
    const result: PassAffordanceResult | null = evaluatePassAffordance({
      snapshot,
      passerGid,
      targetGid,
      attackDir,
      reachProfiles: profiles,
    });
    if (!result) continue;
    const value = passNextStateValue(result);
    if (value) values.push(value);
  }
  return values;
};

const byGid = (values: readonly PassNextStateValue[]): Map<number, PassNextStateValue> =>
  new Map(values.map((value) => [value.targetGid, value]));

const pct = (value: number, denominator: number): string =>
  `${((value / Math.max(denominator, 1)) * 100).toFixed(1)}%`;

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
    const metric = outcomes[pass.classification];
    metric.n++;
    if (received) metric.received++;
    if (intercepted) metric.intercepted++;
  };

  while (!match.finished) {
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
        if (passer && !passer.sentOff) {
          const truth = capturePerceptionTruth(match);
          const targetGids = match.teams[passer.side].players
            .filter((player) => player.gid !== passer.gid && !player.sentOff)
            .map((player) => player.gid);
          const profiles = profilesOf(match);
          const oracleValues = valuesOf(
            oraclePerceptionSnapshot(truth, passer.gid),
            passer.gid,
            targetGids,
            match.teams[passer.side].attackDir,
            profiles,
          );
          const oracleByGid = byGid(oracleValues);
          const chosen = oracleByGid.get(pass.targetGid);
          if (oracleValues.length >= 2 && chosen) {
            const frontier = passParetoFrontier(oracleValues);
            const frontierGids = new Set(frontier.map((value) => value.targetGid));
            const classification = frontierGids.has(chosen.targetGid) ? 'frontier' : 'dominated';
            candidateSets++;
            candidateCount += oracleValues.length;
            frontierCount += frontier.length;
            chosenComparable++;
            if (classification === 'frontier') {
              chosenFrontier++;
            } else {
              chosenDominated++;
              dominatorCount += oracleValues.filter((value) =>
                value.targetGid !== chosen.targetGid
                && comparePassNextStates(value, chosen) === 'leftDominates').length;
            }
            tracked = {
              passerGid: pass.passerGid,
              targetGid: pass.targetGid,
              kickT: match.simTime,
              interceptions0: interceptions(),
              classification,
            };

            for (const awareness of AWARENESS) {
              const metric = perceptionMetrics.get(awareness)!;
              const snapshot = perceiveSnapshot(
                truth, passer.gid, awareness, seed, memoryFor(awareness, passer.gid),
              );
              const perceivedValues = valuesOf(
                snapshot,
                passer.gid,
                targetGids,
                match.teams[passer.side].attackDir,
                profiles,
              );
              const perceivedByGid = byGid(perceivedValues);
              const commonGids = oracleValues
                .map((value) => value.targetGid)
                .filter((gid) => perceivedByGid.has(gid));
              metric.sets++;
              metric.oracleCandidates += oracleValues.length;
              metric.perceivedCandidates += perceivedValues.length;

              const restrictedOracle = commonGids.map((gid) => oracleByGid.get(gid)!);
              const restrictedPerceived = commonGids.map((gid) => perceivedByGid.get(gid)!);
              const oracleFrontier = new Set(
                passParetoFrontier(restrictedOracle).map((value) => value.targetGid),
              );
              const perceivedFrontier = new Set(
                passParetoFrontier(restrictedPerceived).map((value) => value.targetGid),
              );
              for (const gid of commonGids) {
                metric.frontierCandidates++;
                if (oracleFrontier.has(gid) === perceivedFrontier.has(gid)) metric.frontierMatches++;
              }
              for (let i = 0; i < commonGids.length; i++) {
                for (let j = i + 1; j < commonGids.length; j++) {
                  metric.relationPairs++;
                  if (comparePassNextStates(restrictedOracle[i], restrictedOracle[j])
                    === comparePassNextStates(restrictedPerceived[i], restrictedPerceived[j])) {
                    metric.relationMatches++;
                  }
                }
              }
              if (perceivedByGid.has(pass.targetGid)) {
                metric.chosenComparable++;
                if (perceivedFrontier.has(pass.targetGid)) metric.chosenOnFrontier++;
              }
            }
          }
        }
      }
    }
    previousPass = pass;
  }
  if (tracked) resolve(tracked);
}

console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   comparable ordinary-pass choices ${candidateSets}`);
console.log('S7 frontier is OFFLINE only: no weights, live action consumer, gene, or Match RNG use.');
console.log(
  `exact truth: ${(candidateCount / Math.max(candidateSets, 1)).toFixed(2)} candidates/set → `
  + `${(frontierCount / Math.max(candidateSets, 1)).toFixed(2)} on Pareto frontier; `
  + `live chosen target frontier ${pct(chosenFrontier, chosenComparable)}, `
  + `dominated ${pct(chosenDominated, chosenComparable)}`,
);
console.log(
  `dominated live choices have ${(dominatorCount / Math.max(chosenDominated, 1)).toFixed(2)} `
  + `unambiguously better alternatives on average`,
);

console.log('\nS3 snapshot fidelity for the S7 relation (against truth, common visible candidates only):');
for (const awareness of AWARENESS) {
  const metric = perceptionMetrics.get(awareness)!;
  console.log(
    `  awareness ${awareness.toFixed(1)}: candidate coverage `
    + `${pct(metric.perceivedCandidates, metric.oracleCandidates)}, `
    + `pair relation agreement ${pct(metric.relationMatches, metric.relationPairs)}, `
    + `frontier membership agreement ${pct(metric.frontierMatches, metric.frontierCandidates)}, `
    + `chosen visible ${pct(metric.chosenComparable, metric.sets)}, `
    + `chosen-on-frontier when visible ${pct(metric.chosenOnFrontier, metric.chosenComparable)}`,
  );
}

console.log('\nobservational outcome by exact-truth classification (NOT a counterfactual):');
for (const classification of ['frontier', 'dominated'] as const) {
  const metric = outcomes[classification];
  console.log(
    `  ${classification.padEnd(9)} n=${metric.n.toString().padStart(5)}  `
    + `target received ${pct(metric.received, metric.n)}  `
    + `intercepted ${pct(metric.intercepted, metric.n)}`,
  );
}
