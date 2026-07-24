// S3-G1 OBSERVER-LOCAL MEMORY-GUIDED ATTENTION.
// Authority: docs/world-model/OBSERVER-LOCAL-ATTENTION-POLICY.md
import { createHash } from 'node:crypto';
import { chooseAttentionGaze } from '../../src/ai/attentionPolicy';
import {
  capturePerceptionTruth,
  createObserverGaze,
  createPerceptionMemory,
  perceiveSnapshot,
  type ObserverGaze,
  type PerceptionMemory,
  type PerceptionSnapshot,
  type PerceptionTruth,
} from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 96);
const SEED_START = Number(process.argv[3] ?? 88_000);
const MAX_SEEDS = 192;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const WINDOW_TICKS = 48;
const RUN_DISTANCE = 6;
const SPEED_MIN = 0.25;
const SPEED_MAX = 0.50;
const DIST_MIN = 5;
const DIST_MAX = 30;
const FACING_MAX = -0.80;
const BOUNDS_MARGIN = 2;
// Mirrors the perceiveSnapshot envelope at awareness 0.8; auditor use only.
const VISUAL_RANGE = 18 + AWARENESS * 22;
const NEAR_FIELD = 4;
const EPS = 1e-9;

type Arm = 'B' | 'M' | 'T';
type WindowStatus =
  | 'completed'
  | 'finishedEarly'
  | 'notPlaying'
  | 'removedOrSubstituted'
  | 'interventionChanged'
  | 'nearField'
  | 'outOfRange';

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly freezeTick: number;
  readonly observerGid: number;
  readonly actorGid: number;
  readonly actorAgeAtFreeze: number;
  readonly observerMemory: PerceptionMemory;
  readonly acceptanceSnapshot: PerceptionSnapshot;
  readonly runTarget: Readonly<{ x: number; y: number }>;
}

interface ArmOutcome {
  readonly arm: Arm;
  readonly freshCount: number;
  readonly ballAgeMean: number | null;
  readonly ballMissingTicks: number;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly status: WindowStatus;
  readonly actorAgeAtFreeze: number;
  readonly fresh: Readonly<Record<Arm, number>> | null;
  readonly ballAgeMean: Readonly<Record<Arm, number | null>> | null;
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

const cloneMemory = (memory: PerceptionMemory): PerceptionMemory => ({
  nextScanTick: memory.nextScanTick,
  ball: memory.ball === null ? null : {
    ...memory.ball,
    pos: { ...memory.ball.pos },
    vel: { ...memory.ball.vel },
  },
  players: new Map([...memory.players].map(([gid, value]) => [gid, {
    ...value,
    pos: { ...value.pos },
    vel: { ...value.vel },
    bodyDir: { ...value.bodyDir },
  }])),
});

const beforeAdministrativeBoundary = (match: Match): boolean => {
  const secondHalfStart = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1
    ? match.duration / 2
    : secondHalfStart + match.duration / 2;
  return boundary - match.simTime >= 6;
};

const findPlayer = (match: Match, gid: number) =>
  match.allPlayers.find((player) => player.gid === gid) ?? null;

const finiteObservation = (entry: PerceptionSnapshot['players'][number]): boolean => [
  entry.pos.x, entry.pos.y, entry.vel.x, entry.vel.y,
  entry.bodyDir.x, entry.bodyDir.y, entry.observedTick, entry.ageTicks,
].every(Number.isFinite);

interface Recording {
  readonly status: WindowStatus;
  readonly truths: readonly PerceptionTruth[];
}

/** Step the frozen clone once; gaze never touches physics, so every arm replays this. */
const recordWindow = (frozen: Match, state: FrozenState): Recording => {
  const actor = findPlayer(frozen, state.actorGid);
  const observer = findPlayer(frozen, state.observerGid);
  if (!actor || !observer) return { status: 'removedOrSubstituted', truths: [] };
  const actorRoster = actor.rosterIdx;
  const observerRoster = observer.rosterIdx;
  actor.action = { type: 'MoveToPoint', targetPos: { ...state.runTarget }, scores: [] };
  actor.decisionTimer = Number.POSITIVE_INFINITY;
  const truths: PerceptionTruth[] = [];
  for (let step = 1; step <= WINDOW_TICKS; step++) {
    if (frozen.finished) return { status: 'finishedEarly', truths };
    frozen.step(DT);
    truths.push(capturePerceptionTruth(frozen));
    if (frozen.phase !== 'playing') return { status: 'notPlaying', truths };
    if (
      actor.sentOff || observer.sentOff
      || actor.rosterIdx !== actorRoster || observer.rosterIdx !== observerRoster
    ) return { status: 'removedOrSubstituted', truths };
    if (
      actor.action.type !== 'MoveToPoint'
      || actor.action.targetPos?.x !== state.runTarget.x
      || actor.action.targetPos?.y !== state.runTarget.y
    ) return { status: 'interventionChanged', truths };
    const d = Math.hypot(actor.pos.x - observer.pos.x, actor.pos.y - observer.pos.y);
    if (d <= NEAR_FIELD) return { status: 'nearField', truths };
    if (d > VISUAL_RANGE) return { status: 'outOfRange', truths };
  }
  return { status: 'completed', truths };
};

interface ArmAudit {
  gazeInvalid: number;
  nonNormalised: number;
  nonFinite: number;
  recomputeMismatches: number;
}

const runArm = (
  state: FrozenState,
  truths: readonly PerceptionTruth[],
  arm: Arm,
  audit: ArmAudit,
): ArmOutcome => {
  const memory = cloneMemory(state.observerMemory);
  let previousGaze: ObserverGaze | null = null;
  let previousSnapshot: PerceptionSnapshot = state.acceptanceSnapshot;
  const mSnapshots: PerceptionSnapshot[] = [];
  const mGazes: (ObserverGaze | null)[] = [];
  let freshCount = 0;
  let lastCounted = state.freezeTick;
  let ballAgeSum = 0;
  let ballTicks = 0;
  let ballMissingTicks = 0;
  for (const truth of truths) {
    let gaze: ObserverGaze | null = null;
    if (arm === 'M') {
      gaze = chooseAttentionGaze(previousSnapshot, state.actorGid, previousGaze);
      mGazes.push(gaze);
    } else if (arm === 'T') {
      const actorTruth = truth.players.find((p) => p.gid === state.actorGid);
      const observerTruth = truth.players.find((p) => p.gid === state.observerGid);
      if (actorTruth && observerTruth) {
        const aim = {
          x: actorTruth.pos.x - observerTruth.pos.x,
          y: actorTruth.pos.y - observerTruth.pos.y,
        };
        gaze = Math.hypot(aim.x, aim.y) <= EPS
          ? previousGaze
          : createObserverGaze(state.observerGid, aim, truth.tick) ?? previousGaze;
      } else {
        gaze = previousGaze;
      }
    }
    if (gaze !== null) {
      if (
        gaze.observerGid !== state.observerGid
        || !Number.isInteger(gaze.establishedTick)
        || gaze.establishedTick < 0
        || gaze.establishedTick > truth.tick
      ) audit.gazeInvalid++;
      if (Math.abs(Math.hypot(gaze.gazeDir.x, gaze.gazeDir.y) - 1) > 1e-9) audit.nonNormalised++;
    }
    const snapshot = perceiveSnapshot(truth, state.observerGid, AWARENESS, state.seed, memory, gaze);
    if (arm === 'M') mSnapshots.push(snapshot);
    const actorFact = snapshot.players.find((p) => p.gid === state.actorGid);
    if (actorFact) {
      if (!finiteObservation(actorFact)) audit.nonFinite++;
      if (actorFact.observedTick > lastCounted) {
        freshCount++;
        lastCounted = actorFact.observedTick;
      }
    }
    if (snapshot.ball) {
      ballAgeSum += snapshot.ball.ageTicks;
      ballTicks++;
    } else {
      ballMissingTicks++;
    }
    previousGaze = gaze;
    previousSnapshot = snapshot;
  }
  if (arm === 'M') {
    // Recompute every M gaze from the logged snapshot sequence alone.
    let replayPrevious: ObserverGaze | null = null;
    let replayInput: PerceptionSnapshot = state.acceptanceSnapshot;
    for (let index = 0; index < mGazes.length; index++) {
      const replayGaze = chooseAttentionGaze(replayInput, state.actorGid, replayPrevious);
      if (JSON.stringify(replayGaze) !== JSON.stringify(mGazes[index])) audit.recomputeMismatches++;
      replayPrevious = replayGaze;
      replayInput = mSnapshots[index];
    }
  }
  return {
    arm,
    freshCount,
    ballAgeMean: ballTicks === 0 ? null : ballAgeSum / ballTicks,
    ballMissingTicks,
  };
};

const runExperiment = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  let perceptionRngChanges = 0;
  let truthMutations = 0;
  const audit: ArmAudit = {
    gazeInvalid: 0,
    nonNormalised: 0,
    nonFinite: 0,
    recomputeMismatches: 0,
  };
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
    const memories = new Map<number, PerceptionMemory>();
    const snapshots = new Map<number, PerceptionSnapshot>();
    for (const player of match.allPlayers) {
      if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
    }
    let accepted = false;
    while (!match.finished && !accepted) {
      match.step(DT);
      const truth = capturePerceptionTruth(match);
      const rngBefore = (match.rng as unknown as { s: number }).s;
      for (const player of match.allPlayers) {
        if (player.role === 'GK' || player.sentOff) continue;
        snapshots.set(player.gid, perceiveSnapshot(
          truth, player.gid, AWARENESS, seed, memories.get(player.gid)!,
        ));
      }
      const rngAfter = (match.rng as unknown as { s: number }).s;
      if (rngBefore !== rngAfter) perceptionRngChanges++;
      if (
        match.simTick % SAMPLE_TICKS !== 0
        || match.simTime < 10
        || match.phase !== 'playing'
        || !beforeAdministrativeBoundary(match)
      ) continue;
      let state: FrozenState | null = null;
      const outfield = match.allPlayers
        .filter((player) => player.role !== 'GK' && !player.sentOff)
        .sort((left, right) => left.gid - right.gid);
      for (const observer of outfield) {
        const snapshot = snapshots.get(observer.gid);
        const memory = memories.get(observer.gid);
        if (!snapshot || !memory) continue;
        for (const actor of outfield) {
          if (actor.gid === observer.gid || actor.side !== observer.side) continue;
          const speed = Math.hypot(actor.vel.x, actor.vel.y);
          if (speed < SPEED_MIN || speed > SPEED_MAX) continue;
          const dx = actor.pos.x - observer.pos.x;
          const dy = actor.pos.y - observer.pos.y;
          const d = Math.hypot(dx, dy);
          if (d <= DIST_MIN || d > DIST_MAX) continue;
          const facing = (observer.bodyDir.x * dx + observer.bodyDir.y * dy) / d;
          if (facing >= FACING_MAX) continue;
          const fact = snapshot.players.find((entry) => entry.gid === actor.gid);
          if (!fact || fact.ageTicks < 1) continue;
          const runTarget = {
            x: actor.pos.x + (actor.vel.x / speed) * RUN_DISTANCE,
            y: actor.pos.y + (actor.vel.y / speed) * RUN_DISTANCE,
          };
          if (
            Math.abs(runTarget.x) > HALF_L - BOUNDS_MARGIN
            || Math.abs(runTarget.y) > HALF_W - BOUNDS_MARGIN
          ) continue;
          state = {
            key: `${seed}:${match.simTick}:${observer.gid}:${actor.gid}`,
            seed,
            freezeTick: match.simTick,
            observerGid: observer.gid,
            actorGid: actor.gid,
            actorAgeAtFreeze: fact.ageTicks,
            observerMemory: cloneMemory(memory),
            acceptanceSnapshot: snapshot,
            runTarget,
          };
          break;
        }
        if (state) break;
      }
      if (!state) continue;
      accepted = true;
      acceptedStates++;
      const frozen = cloneSimulationState(match);
      const recording = recordWindow(frozen, state);
      if (recording.status !== 'completed') {
        records.push({
          key: state.key,
          seed,
          status: recording.status,
          actorAgeAtFreeze: state.actorAgeAtFreeze,
          fresh: null,
          ballAgeMean: null,
        });
        continue;
      }
      const truthsBefore = JSON.stringify(recording.truths);
      const outcomes = new Map<Arm, ArmOutcome>();
      for (const arm of ['B', 'M', 'T'] as const) {
        outcomes.set(arm, runArm(state, recording.truths, arm, audit));
      }
      if (JSON.stringify(recording.truths) !== truthsBefore) truthMutations++;
      const b = outcomes.get('B')!;
      const m = outcomes.get('M')!;
      const t = outcomes.get('T')!;
      records.push({
        key: state.key,
        seed,
        status: 'completed',
        actorAgeAtFreeze: state.actorAgeAtFreeze,
        fresh: { B: b.freshCount, M: m.freshCount, T: t.freshCount },
        ballAgeMean: { B: b.ballAgeMean, M: m.ballAgeMean, T: t.ballAgeMean },
      });
    }
  }

  const completed = records.filter((record) => record.status === 'completed');
  const abortCensus: Record<string, number> = {};
  for (const record of records) {
    if (record.status !== 'completed') {
      abortCensus[record.status] = (abortCensus[record.status] ?? 0) + 1;
    }
  }
  const counts = {
    completed: completed.length,
    aborts: abortCensus,
    mFour: completed.filter((record) => record.fresh!.M >= 4).length,
    bFour: completed.filter((record) => record.fresh!.B >= 4).length,
    tFour: completed.filter((record) => record.fresh!.T >= 4).length,
    dominanceGe: completed.filter((record) => record.fresh!.M >= record.fresh!.B).length,
    dominanceGt: completed.filter((record) => record.fresh!.M > record.fresh!.B).length,
  };
  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    gazeInvalid: audit.gazeInvalid === 0,
    nonNormalisedGaze: audit.nonNormalised === 0,
    perceptionRng: perceptionRngChanges === 0,
    truthImmutable: truthMutations === 0,
    policyRecompute: audit.recomputeMismatches === 0,
    finiteObservations: audit.nonFinite === 0,
  };
  const completion = { completedWindows: completed.length >= 72 };
  const channel = {
    truthCeilingSupport: completed.length > 0 && counts.tFour / completed.length >= 0.95,
  };
  const mechanism = {
    memorySupport: completed.length > 0 && counts.mFour / completed.length >= 0.95,
    bodyFacingDeficit: completed.length > 0 && counts.bFour / completed.length <= 0.50,
    dominanceGe: completed.length > 0 && counts.dominanceGe / completed.length >= 0.95,
    dominanceGt: completed.length > 0 && counts.dominanceGt / completed.length >= 0.50,
  };
  const exactPass = Object.values(exact).every(Boolean) && completion.completedWindows;
  const verdict = !exactPass
    ? 'FAIL'
    : !channel.truthCeilingSupport
      ? 'CHANNEL-INVALID'
      : Object.values(mechanism).every(Boolean) ? 'PASS' : 'FAIL';
  return {
    experiment: 'S3-G1',
    authority: 'OBSERVER-LOCAL-ATTENTION-POLICY',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
      windowTicks: WINDOW_TICKS,
      runDistance: RUN_DISTANCE,
      speedBand: [SPEED_MIN, SPEED_MAX],
      distanceBand: [DIST_MIN, DIST_MAX],
      facingMax: FACING_MAX,
      boundsMargin: BOUNDS_MARGIN,
    },
    census: { scannedSeeds, acceptedStates },
    counts,
    diagnostics: {
      gazeInvalid: audit.gazeInvalid,
      nonNormalisedGaze: audit.nonNormalised,
      perceptionRngChanges,
      truthMutations,
      recomputeMismatches: audit.recomputeMismatches,
      nonFiniteObservations: audit.nonFinite,
    },
    exact,
    completion,
    channel,
    mechanism,
    verdict,
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
  `S3-G1 ${output.verdict} · accepted ${output.census.acceptedStates}/${REQUIRED_STATES}`
  + ` · completed ${output.counts.completed}`
  + ` · M4 ${output.counts.mFour} · B4 ${output.counts.bFour} · T4 ${output.counts.tFour}`
  + ` · SHA ${sha256}`,
);
