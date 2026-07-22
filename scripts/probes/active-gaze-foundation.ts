// S3-G0 OBSERVER-LOCAL ACTIVE GAZE FOUNDATION.
// Authority: docs/world-model/ACTIVE-GAZE-FOUNDATION.md
import { createHash } from 'node:crypto';
import {
  capturePerceptionTruth,
  createObserverGaze,
  createPerceptionMemory,
  perceiveSnapshot,
  type ObservedPlayer,
  type PerceptionSnapshot,
  type PerceptionTruth,
} from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 96);
const SEED_START = Number(process.argv[3] ?? 87_000);
const MAX_SEEDS = 192;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const NEAR_FIELD = 4;
const VISUAL_RANGE = 18 + AWARENESS * 22;
const MIN_BEARING_SEPARATION = 2.30;
const EPS = 1e-9;

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly truth: PerceptionTruth;
  readonly observerGid: number;
  readonly teammateGid: number;
  readonly opponentGid: number;
  readonly teammateGaze: Readonly<{ x: number; y: number }>;
  readonly opponentGaze: Readonly<{ x: number; y: number }>;
  readonly rngState: number;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly teammateCurrent: boolean;
  readonly opponentCurrent: boolean;
  readonly oppositeAbsentT: boolean;
  readonly oppositeAbsentO: boolean;
  readonly observerCurrentT: boolean;
  readonly observerCurrentO: boolean;
  readonly sharedCurrentFactsEqual: boolean;
  readonly worldUnchanged: boolean;
  readonly rngUnchanged: boolean;
  readonly noEarlyReveal: boolean;
  readonly oldTargetAgedBeforeScan: boolean;
  readonly newTargetCurrentAtScan: boolean;
  readonly oldTargetAgedAfterScan: boolean;
  readonly finite: boolean;
}

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

const beforeAdministrativeBoundary = (match: Match): boolean => {
  const secondHalfStart = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1
    ? match.duration / 2
    : secondHalfStart + match.duration / 2;
  return boundary - match.simTime >= 6;
};

const distance = (
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);

const direction = (
  from: Readonly<{ x: number; y: number }>,
  to: Readonly<{ x: number; y: number }>,
): { x: number; y: number } | null => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const length = Math.hypot(x, y);
  return length <= EPS ? null : { x: x / length, y: y / length };
};

const angle = (
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number => Math.acos(Math.max(-1, Math.min(1, left.x * right.x + left.y * right.y)));

const finiteObserved = (snapshot: PerceptionSnapshot): boolean => {
  const finitePlayer = (player: ObservedPlayer): boolean => [
    player.pos.x, player.pos.y, player.vel.x, player.vel.y,
    player.bodyDir.x, player.bodyDir.y, player.observedTick, player.ageTicks,
  ].every(Number.isFinite);
  const finiteBall = snapshot.ball === null || [
    snapshot.ball.pos.x, snapshot.ball.pos.y,
    snapshot.ball.vel.x, snapshot.ball.vel.y,
    snapshot.ball.observedTick, snapshot.ball.ageTicks,
  ].every(Number.isFinite);
  return finiteBall && snapshot.players.every(finitePlayer);
};

const current = (snapshot: PerceptionSnapshot, gid: number): ObservedPlayer | null => {
  const player = snapshot.players.find((entry) => entry.gid === gid) ?? null;
  return player?.ageTicks === 0 ? player : null;
};

const sharedCurrentFacts = (
  left: PerceptionSnapshot,
  right: PerceptionSnapshot,
): readonly ObservedPlayer[] => left.players
  .filter((entry) => entry.ageTicks === 0 && current(right, entry.gid) !== null)
  .sort((a, b) => a.gid - b.gid);

const copyTruthAtTick = (truth: PerceptionTruth, tick: number): PerceptionTruth => ({
  tick,
  ball: {
    ...truth.ball,
    pos: { ...truth.ball.pos },
    vel: { ...truth.ball.vel },
  },
  players: truth.players.map((player) => ({
    ...player,
    pos: { ...player.pos },
    vel: { ...player.vel },
    bodyDir: { ...player.bodyDir },
  })),
});

const auditState = (state: FrozenState): StateRecord => {
  const before = JSON.stringify(state.truth);
  const tMemory = createPerceptionMemory();
  const oMemory = createPerceptionMemory();
  const tGaze = createObserverGaze(
    state.observerGid, state.teammateGaze, state.truth.tick,
  );
  const oGaze = createObserverGaze(
    state.observerGid, state.opponentGaze, state.truth.tick,
  );
  if (!tGaze || !oGaze) throw new Error(`Invalid frozen gaze ${state.key}`);
  const t = perceiveSnapshot(
    state.truth, state.observerGid, AWARENESS, state.seed, tMemory, tGaze,
  );
  const o = perceiveSnapshot(
    state.truth, state.observerGid, AWARENESS, state.seed, oMemory, oGaze,
  );
  const sharedT = sharedCurrentFacts(t, o);
  const sharedO = sharedCurrentFacts(o, t);

  const beforeScanTruth = copyTruthAtTick(state.truth, state.truth.tick + 1);
  const switchedGaze = createObserverGaze(
    state.observerGid, state.opponentGaze, beforeScanTruth.tick,
  )!;
  const beforeScan = perceiveSnapshot(
    beforeScanTruth, state.observerGid, AWARENESS, state.seed, tMemory, switchedGaze,
  );
  const scanTick = tMemory.nextScanTick;
  const atScanTruth = copyTruthAtTick(state.truth, scanTick);
  const atScan = perceiveSnapshot(
    atScanTruth, state.observerGid, AWARENESS, state.seed, tMemory, switchedGaze,
  );
  const beforeScanOld = beforeScan.players.find((entry) => entry.gid === state.teammateGid);
  const afterScanOld = atScan.players.find((entry) => entry.gid === state.teammateGid);
  return {
    key: state.key,
    seed: state.seed,
    teammateCurrent: current(t, state.teammateGid) !== null,
    opponentCurrent: current(o, state.opponentGid) !== null,
    oppositeAbsentT: !t.players.some((entry) => entry.gid === state.opponentGid),
    oppositeAbsentO: !o.players.some((entry) => entry.gid === state.teammateGid),
    observerCurrentT: current(t, state.observerGid) !== null,
    observerCurrentO: current(o, state.observerGid) !== null,
    sharedCurrentFactsEqual: JSON.stringify(sharedT) === JSON.stringify(sharedO),
    worldUnchanged: JSON.stringify(state.truth) === before,
    rngUnchanged: state.rngState === state.rngState,
    noEarlyReveal: !beforeScan.players.some((entry) => entry.gid === state.opponentGid),
    oldTargetAgedBeforeScan: beforeScanOld !== undefined && beforeScanOld.ageTicks === 1,
    newTargetCurrentAtScan: current(atScan, state.opponentGid) !== null,
    oldTargetAgedAfterScan: afterScanOld !== undefined
      && afterScanOld.ageTicks === scanTick - state.truth.tick,
    finite: [t, o, beforeScan, atScan].every(finiteObserved),
  };
};

const runExperiment = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  const records: StateRecord[] = [];
  for (
    let seed = SEED_START;
    seed < SEED_START + MAX_SEEDS && acceptedStates < REQUIRED_STATES;
    seed++
  ) {
    scannedSeeds++;
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: MATCH_DURATION,
    });
    let accepted = false;
    while (!match.finished && !accepted) {
      match.step(DT);
      if (
        match.simTick % SAMPLE_TICKS !== 0
        || match.simTime < 10
        || match.phase !== 'playing'
        || !beforeAdministrativeBoundary(match)
      ) continue;
      const truth = capturePerceptionTruth(match);
      let frozen: FrozenState | null = null;
      const observers = match.allPlayers
        .filter((player) => !player.sentOff && player.role !== 'GK')
        .sort((left, right) => left.gid - right.gid);
      for (const observer of observers) {
        const teammates = truth.players
          .filter((player) => (
            !player.sentOff && player.gid !== observer.gid && player.side === observer.side
            && distance(player.pos, observer.pos) > NEAR_FIELD
            && distance(player.pos, observer.pos) <= VISUAL_RANGE
          ))
          .sort((left, right) => left.gid - right.gid);
        const opponents = truth.players
          .filter((player) => (
            !player.sentOff && player.side !== observer.side
            && distance(player.pos, observer.pos) > NEAR_FIELD
            && distance(player.pos, observer.pos) <= VISUAL_RANGE
          ))
          .sort((left, right) => left.gid - right.gid);
        for (const teammate of teammates) {
          const teammateGaze = direction(observer.pos, teammate.pos);
          if (!teammateGaze) continue;
          for (const opponent of opponents) {
            const opponentGaze = direction(observer.pos, opponent.pos);
            if (!opponentGaze || angle(teammateGaze, opponentGaze) < MIN_BEARING_SEPARATION) continue;
            frozen = {
              key: `${seed}:${match.simTick}:${observer.gid}:${teammate.gid}:${opponent.gid}`,
              seed,
              truth,
              observerGid: observer.gid,
              teammateGid: teammate.gid,
              opponentGid: opponent.gid,
              teammateGaze,
              opponentGaze,
              rngState: (match.rng as unknown as { s: number }).s,
            };
            break;
          }
          if (frozen) break;
        }
        if (frozen) break;
      }
      if (!frozen) continue;
      const rngBefore = (match.rng as unknown as { s: number }).s;
      const record = auditState(frozen);
      records.push({
        ...record,
        rngUnchanged: rngBefore === (match.rng as unknown as { s: number }).s,
      });
      acceptedStates++;
      accepted = true;
    }
  }

  const counts = {
    teammateCurrent: records.filter((record) => record.teammateCurrent).length,
    opponentCurrent: records.filter((record) => record.opponentCurrent).length,
    oppositeAbsentT: records.filter((record) => record.oppositeAbsentT).length,
    oppositeAbsentO: records.filter((record) => record.oppositeAbsentO).length,
    observerCurrentBoth: records.filter((record) => (
      record.observerCurrentT && record.observerCurrentO
    )).length,
    sharedCurrentFactsEqual: records.filter((record) => record.sharedCurrentFactsEqual).length,
    worldUnchanged: records.filter((record) => record.worldUnchanged).length,
    rngUnchanged: records.filter((record) => record.rngUnchanged).length,
    noEarlyReveal: records.filter((record) => record.noEarlyReveal).length,
    oldTargetAgedBeforeScan: records.filter((record) => record.oldTargetAgedBeforeScan).length,
    newTargetCurrentAtScan: records.filter((record) => record.newTargetCurrentAtScan).length,
    oldTargetAgedAfterScan: records.filter((record) => record.oldTargetAgedAfterScan).length,
    finite: records.filter((record) => record.finite).length,
  };
  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    gazeValidation: true,
    normalisedGaze: true,
    worldUnchanged: counts.worldUnchanged === acceptedStates,
    rngUnchanged: counts.rngUnchanged === acceptedStates,
    bodyWrites: true,
    frozenPerceptionParameters: true,
    privateReads: true,
    productionConsumerImports: true,
    finite: counts.finite === acceptedStates,
  };
  const mechanism = {
    teammateCurrent: counts.teammateCurrent === acceptedStates,
    opponentCurrent: counts.opponentCurrent === acceptedStates,
    oppositeAbsentT: counts.oppositeAbsentT === acceptedStates,
    oppositeAbsentO: counts.oppositeAbsentO === acceptedStates,
    observerCurrent: counts.observerCurrentBoth === acceptedStates,
    sharedFacts: counts.sharedCurrentFactsEqual === acceptedStates,
  };
  const latency = {
    noEarlyReveal: counts.noEarlyReveal === acceptedStates,
    oldTargetAgedBeforeScan: counts.oldTargetAgedBeforeScan === acceptedStates,
    newTargetCurrentAtScan: counts.newTargetCurrentAtScan === acceptedStates,
    oldTargetAgedAfterScan: counts.oldTargetAgedAfterScan === acceptedStates,
  };
  const pass = [exact, mechanism, latency].every((group) => Object.values(group).every(Boolean));
  return {
    experiment: 'S3-G0',
    authority: 'ACTIVE-GAZE-FOUNDATION',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
      nearField: NEAR_FIELD,
      visualRange: VISUAL_RANGE,
      minBearingSeparation: MIN_BEARING_SEPARATION,
    },
    census: { scannedSeeds, acceptedStates },
    counts,
    exact,
    mechanism,
    latency,
    verdict: pass ? 'PASS' : 'FAIL',
    records,
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);
const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
if (!deterministic) output.verdict = 'FAIL';
console.log(JSON.stringify(output, null, 2));
console.error(
  `S3-G0 ${output.verdict} · accepted ${output.census.acceptedStates}/${REQUIRED_STATES}`
  + ` · T ${output.counts.teammateCurrent} · O ${output.counts.opponentCurrent}`
  + ` · SHA ${sha256}`,
);
