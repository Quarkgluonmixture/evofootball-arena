// S3-G2 DUAL-TARGET INTERLEAVED ATTENTION.
// Authority: docs/world-model/DUAL-TARGET-ATTENTION-SCHEDULE.md
//
// One gaze, two moving teammates, six scheduled scans per 48-tick window. The
// contract's geometry section already fixes that at awareness 0.8 at most one
// target can be out of field, so this is a CADENCE experiment with zero slack:
// strict alternation yields exactly the three samples the banked qualified
// motion predicate needs. Every module is consumed unchanged; the alternation
// schedule is probe-owned and reads nothing but the tick index.
import { createHash } from 'node:crypto';
import { chooseAttentionGaze } from '../../src/ai/attentionPolicy';
import {
  appendObservedMotionSample,
  type ObservedMotionHistory,
} from '../../src/ai/motionEvidence';
import { buildMotionGatedBelief } from '../../src/ai/motionGatedIntentResponse';
import { generateOffBallCandidates } from '../../src/ai/offBallAffordance';
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
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 96);
const SEED_START = Number(process.argv[3] ?? 94_000);
// Run 1 accepted only 69/96 in 512 seeds (7.4 seeds per state). Escalation
// resolution, DUAL-TARGET-ATTENTION-SCHEDULE.md §8.1: the sampling budget is not
// a gate, so Run 2 keeps every gate, arm and acceptance clause verbatim, starts
// at the same seed so the first 512 reproduce bit-identically, and only raises
// this budget.
const MAX_SEEDS = 2048;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const WINDOW_TICKS = 48;
/** The banked scan interval at awareness 0.8: round(15 - 0.8*9). */
const SCAN_INTERVAL_TICKS = Math.round(15 - AWARENESS * 9);
const RUN_DISTANCE = 6;
const SPEED_MIN = 0.25;
const SPEED_MAX = 0.50;
const DIST_MIN = 5;
const DIST_MAX = 30;
/** Above the 126.87° field half-angle: no single aim can hold both targets. */
const SEPARATION_MIN_COS = Math.cos((130 * Math.PI) / 180);
/** At least one target must sit outside the unchanged body-facing field. */
const BODY_FIELD_MAX_COS = -0.60;
const BOUNDS_MARGIN = 2;
const VISUAL_RANGE = 18 + AWARENESS * 22;
const NEAR_FIELD = 4;
const EPS = 1e-9;
/** The qualified predicate's own minimum: three strictly-newer samples. */
const FRESH_MIN = 3;

type Arm = 'B' | 'S' | 'I' | 'T';
type Slot = 'A1' | 'A2';
const SLOTS: readonly Slot[] = ['A1', 'A2'];
type WindowStatus =
  | 'completed'
  | 'finishedEarly'
  | 'notPlaying'
  | 'removedOrSubstituted'
  | 'interventionChanged'
  | 'nearField'
  | 'outOfRange';

interface FrozenActor {
  readonly gid: number;
  readonly ageAtFreeze: number;
  readonly runTarget: Readonly<{ x: number; y: number }>;
  readonly candidates: readonly { readonly id: string; readonly point: { x: number; y: number } }[];
}

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly freezeTick: number;
  readonly observerGid: number;
  readonly observerMemory: PerceptionMemory;
  readonly acceptanceSnapshot: PerceptionSnapshot;
  readonly separationDegrees: number;
  readonly actors: Readonly<Record<Slot, FrozenActor>>;
}

interface ArmOutcome {
  readonly arm: Arm;
  readonly fresh: Readonly<Record<Slot, number>>;
  readonly supported: Readonly<Record<Slot, boolean>>;
  readonly supportOnsetTick: Readonly<Record<Slot, number | null>>;
  readonly ballAgeMean: number | null;
  readonly ballMissingTicks: number;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly status: WindowStatus;
  readonly separationDegrees: number;
  readonly ageAtFreeze: Readonly<Record<Slot, number>> | null;
  readonly fresh: Readonly<Record<Arm, Readonly<Record<Slot, number>>>> | null;
  readonly supported: Readonly<Record<Arm, Readonly<Record<Slot, boolean>>>> | null;
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

/**
 * The probe-owned alternation: A1 for the first scan interval, A2 for the next,
 * and so on. It reads the tick index and nothing else — no truth, no other
 * player's state, no outcome. Exactly the role S3-G1's supplied relevance
 * target played.
 */
const scheduledSlot = (step: number): Slot =>
  (Math.floor((step - 1) / SCAN_INTERVAL_TICKS) % 2 === 0 ? 'A1' : 'A2');

interface Recording {
  readonly status: WindowStatus;
  readonly truths: readonly PerceptionTruth[];
}

/** Step the frozen clone once; gaze never touches physics, so all arms replay it. */
const recordWindow = (frozen: Match, state: FrozenState): Recording => {
  const observer = findPlayer(frozen, state.observerGid);
  const actors = SLOTS.map((slot) => findPlayer(frozen, state.actors[slot].gid));
  if (!observer || actors.some((actor) => actor === null)) {
    return { status: 'removedOrSubstituted', truths: [] };
  }
  const bodies = actors as NonNullable<typeof actors[number]>[];
  const observerRoster = observer.rosterIdx;
  const rosters = bodies.map((actor) => actor.rosterIdx);
  bodies.forEach((actor, index) => {
    actor.action = {
      type: 'MoveToPoint', targetPos: { ...state.actors[SLOTS[index]].runTarget }, scores: [],
    };
    actor.decisionTimer = Number.POSITIVE_INFINITY;
  });
  const truths: PerceptionTruth[] = [];
  for (let step = 1; step <= WINDOW_TICKS; step++) {
    if (frozen.finished) return { status: 'finishedEarly', truths };
    frozen.step(DT);
    truths.push(capturePerceptionTruth(frozen));
    if (frozen.phase !== 'playing') return { status: 'notPlaying', truths };
    if (observer.sentOff || observer.rosterIdx !== observerRoster) {
      return { status: 'removedOrSubstituted', truths };
    }
    for (let index = 0; index < bodies.length; index++) {
      const actor = bodies[index];
      if (actor.sentOff || actor.rosterIdx !== rosters[index]) {
        return { status: 'removedOrSubstituted', truths };
      }
      const target = state.actors[SLOTS[index]].runTarget;
      if (
        actor.action.type !== 'MoveToPoint'
        || actor.action.targetPos?.x !== target.x
        || actor.action.targetPos?.y !== target.y
      ) return { status: 'interventionChanged', truths };
      const d = Math.hypot(actor.pos.x - observer.pos.x, actor.pos.y - observer.pos.y);
      if (d <= NEAR_FIELD) return { status: 'nearField', truths };
      if (d > VISUAL_RANGE) return { status: 'outOfRange', truths };
    }
  }
  return { status: 'completed', truths };
};

interface ArmAudit {
  gazeInvalid: number;
  nonNormalised: number;
  nonFinite: number;
  recomputeMismatches: number;
  beliefSchemaFailures: number;
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
  const policySnapshots: PerceptionSnapshot[] = [];
  const policyGazes: (ObserverGaze | null)[] = [];
  const fresh: Record<Slot, number> = { A1: 0, A2: 0 };
  const lastCounted: Record<Slot, number> = { A1: state.freezeTick, A2: state.freezeTick };
  const histories: Record<Slot, ObservedMotionHistory | null> = { A1: null, A2: null };
  const supported: Record<Slot, boolean> = { A1: false, A2: false };
  const supportOnsetTick: Record<Slot, number | null> = { A1: null, A2: null };
  let ballAgeSum = 0;
  let ballTicks = 0;
  let ballMissingTicks = 0;

  for (let index = 0; index < truths.length; index++) {
    const truth = truths[index];
    const step = index + 1;
    // Which target this arm is attending on this tick.
    const attend: Slot | null = arm === 'B' ? null : arm === 'S' ? 'A1' : scheduledSlot(step);
    let gaze: ObserverGaze | null = null;
    if (arm === 'S' || arm === 'I') {
      gaze = chooseAttentionGaze(previousSnapshot, state.actors[attend!].gid, previousGaze);
      policyGazes.push(gaze);
    } else if (arm === 'T') {
      const actorTruth = truth.players.find((p) => p.gid === state.actors[attend!].gid);
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
    if (arm === 'S' || arm === 'I') policySnapshots.push(snapshot);

    for (const slot of SLOTS) {
      const actor = state.actors[slot];
      const fact = snapshot.players.find((entry) => entry.gid === actor.gid);
      if (!fact) continue;
      if (!finiteObservation(fact)) audit.nonFinite++;
      if (fact.observedTick > lastCounted[slot]) {
        fresh[slot]++;
        lastCounted[slot] = fact.observedTick;
      }
      // Qualified support: the UNCHANGED motion history + motion-gated belief.
      // The reference tag is the observer's own gid — inert for the predicate,
      // which reads only the samples and the candidate set.
      const nextHistory = appendObservedMotionSample(
        snapshot, actor.gid, state.observerGid, state.freezeTick, histories[slot],
      );
      if (!nextHistory) {
        audit.beliefSchemaFailures++;
        continue;
      }
      histories[slot] = nextHistory;
      const belief = buildMotionGatedBelief({
        history: nextHistory,
        actorCandidates: actor.candidates,
        referenceGid: state.observerGid,
        referenceEpoch: state.freezeTick,
        previous: null,
      });
      if (!belief) {
        audit.beliefSchemaFailures++;
        continue;
      }
      if (belief.supportedCandidateIds.length > 0 && !supported[slot]) {
        supported[slot] = true;
        supportOnsetTick[slot] = truth.tick;
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

  if (arm === 'S' || arm === 'I') {
    // Recompute every policy gaze from this arm's own logged snapshots and its
    // own schedule alone — no truth, no other arm.
    let replayPrevious: ObserverGaze | null = null;
    let replayInput: PerceptionSnapshot = state.acceptanceSnapshot;
    for (let index = 0; index < policyGazes.length; index++) {
      const slot: Slot = arm === 'S' ? 'A1' : scheduledSlot(index + 1);
      const replayGaze = chooseAttentionGaze(replayInput, state.actors[slot].gid, replayPrevious);
      if (JSON.stringify(replayGaze) !== JSON.stringify(policyGazes[index])) {
        audit.recomputeMismatches++;
      }
      replayPrevious = replayGaze;
      replayInput = policySnapshots[index];
    }
  }

  return {
    arm,
    fresh,
    supported,
    supportOnsetTick,
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
    beliefSchemaFailures: 0,
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

      const profiles = new Map<number, KnownReachProfile>(
        match.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed,
          accel: player.accel,
          dribbling: player.attrs.dribbling,
        }]),
      );
      let state: FrozenState | null = null;
      const outfield = match.allPlayers
        .filter((player) => player.role !== 'GK' && !player.sentOff)
        .sort((left, right) => left.gid - right.gid);

      for (const observer of outfield) {
        const snapshot = snapshots.get(observer.gid);
        const memory = memories.get(observer.gid);
        if (!snapshot || !memory) continue;
        const attackDir = match.teams[observer.side].attackDir;
        // Every eligible actor for this observer, with its bearing recorded.
        const eligible = outfield
          .filter((actor) => actor.gid !== observer.gid && actor.side === observer.side)
          .map((actor) => {
            const speed = Math.hypot(actor.vel.x, actor.vel.y);
            const dx = actor.pos.x - observer.pos.x;
            const dy = actor.pos.y - observer.pos.y;
            const d = Math.hypot(dx, dy);
            return { actor, speed, dx, dy, d };
          })
          .filter((entry) => (
            entry.speed >= SPEED_MIN && entry.speed <= SPEED_MAX
            && entry.d > DIST_MIN && entry.d <= DIST_MAX
          ))
          .map((entry) => {
            const fact = snapshot.players.find((f) => f.gid === entry.actor.gid);
            const runTarget = {
              x: entry.actor.pos.x + (entry.actor.vel.x / entry.speed) * RUN_DISTANCE,
              y: entry.actor.pos.y + (entry.actor.vel.y / entry.speed) * RUN_DISTANCE,
            };
            return {
              ...entry,
              fact,
              runTarget,
              bearing: { x: entry.dx / entry.d, y: entry.dy / entry.d },
              bodyCos: (observer.bodyDir.x * entry.dx + observer.bodyDir.y * entry.dy) / entry.d,
            };
          })
          .filter((entry) => (
            entry.fact !== undefined && entry.fact.ageTicks >= 1
            && Math.abs(entry.runTarget.x) <= HALF_L - BOUNDS_MARGIN
            && Math.abs(entry.runTarget.y) <= HALF_W - BOUNDS_MARGIN
          ));

        for (let i = 0; i < eligible.length && !state; i++) {
          for (let j = i + 1; j < eligible.length && !state; j++) {
            const first = eligible[i];
            const second = eligible[j];
            const cos = first.bearing.x * second.bearing.x + first.bearing.y * second.bearing.y;
            // Bearings at least 130° apart: no single aim holds both.
            if (cos > SEPARATION_MIN_COS) continue;
            // At least one target outside the unchanged body-facing field.
            if (first.bodyCos >= BODY_FIELD_MAX_COS && second.bodyCos >= BODY_FIELD_MAX_COS) {
              continue;
            }
            const frozenActorOf = (entry: typeof first): FrozenActor => {
              const profile = profiles.get(entry.actor.gid)!;
              return {
                gid: entry.actor.gid,
                ageAtFreeze: entry.fact!.ageTicks,
                runTarget: entry.runTarget,
                candidates: generateOffBallCandidates(entry.fact!, profile, attackDir)
                  .map((candidate) => ({ id: candidate.id, point: { ...candidate.point } }))
                  .sort((left, right) => left.id.localeCompare(right.id)),
              };
            };
            state = {
              key: `${seed}:${match.simTick}:${observer.gid}:${first.actor.gid}:${second.actor.gid}`,
              seed,
              freezeTick: match.simTick,
              observerGid: observer.gid,
              observerMemory: cloneMemory(memory),
              acceptanceSnapshot: snapshot,
              separationDegrees: (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI,
              actors: { A1: frozenActorOf(first), A2: frozenActorOf(second) },
            };
          }
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
          separationDegrees: state.separationDegrees,
          ageAtFreeze: { A1: state.actors.A1.ageAtFreeze, A2: state.actors.A2.ageAtFreeze },
          fresh: null,
          supported: null,
          ballAgeMean: null,
        });
        continue;
      }
      const truthsBefore = JSON.stringify(recording.truths);
      const outcomes = new Map<Arm, ArmOutcome>();
      for (const arm of ['B', 'S', 'I', 'T'] as const) {
        outcomes.set(arm, runArm(state, recording.truths, arm, audit));
      }
      if (JSON.stringify(recording.truths) !== truthsBefore) truthMutations++;
      const armRecord = <T>(pick: (outcome: ArmOutcome) => T): Record<Arm, T> => ({
        B: pick(outcomes.get('B')!),
        S: pick(outcomes.get('S')!),
        I: pick(outcomes.get('I')!),
        T: pick(outcomes.get('T')!),
      });
      records.push({
        key: state.key,
        seed,
        status: 'completed',
        separationDegrees: state.separationDegrees,
        ageAtFreeze: { A1: state.actors.A1.ageAtFreeze, A2: state.actors.A2.ageAtFreeze },
        fresh: armRecord((outcome) => outcome.fresh),
        supported: armRecord((outcome) => outcome.supported),
        ballAgeMean: armRecord((outcome) => outcome.ballAgeMean),
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
  const bothFresh = (arm: Arm) => completed.filter((record) =>
    record.fresh![arm].A1 >= FRESH_MIN && record.fresh![arm].A2 >= FRESH_MIN).length;
  const bothSupported = (arm: Arm) => completed.filter((record) =>
    record.supported![arm].A1 && record.supported![arm].A2).length;
  const counts = {
    completed: completed.length,
    aborts: abortCensus,
    bothFresh: { B: bothFresh('B'), S: bothFresh('S'), I: bothFresh('I'), T: bothFresh('T') },
    bothSupported: {
      B: bothSupported('B'), S: bothSupported('S'), I: bothSupported('I'), T: bothSupported('T'),
    },
    sStarvesA2: completed.filter((record) => record.fresh!.S.A2 >= FRESH_MIN).length,
    iGeSOnA2: completed.filter((record) => record.fresh!.I.A2 >= record.fresh!.S.A2).length,
    iGtSOnA2: completed.filter((record) => record.fresh!.I.A2 > record.fresh!.S.A2).length,
    iLtSOnA1: completed.filter((record) => record.fresh!.I.A1 < record.fresh!.S.A1).length,
    freshMeans: (['B', 'S', 'I', 'T'] as const).reduce<Record<string, [number, number]>>(
      (means, arm) => {
        const a1 = completed.reduce((sum, r) => sum + r.fresh![arm].A1, 0)
          / Math.max(1, completed.length);
        const a2 = completed.reduce((sum, r) => sum + r.fresh![arm].A2, 0)
          / Math.max(1, completed.length);
        means[arm] = [a1, a2];
        return means;
      }, {},
    ),
    ballAgeMeans: (['B', 'S', 'I', 'T'] as const).reduce<Record<string, number>>((means, arm) => {
      const values = completed.map((r) => r.ballAgeMean![arm]).filter((v): v is number => v !== null);
      means[arm] = values.length === 0
        ? 0
        : values.reduce((sum, value) => sum + value, 0) / values.length;
      return means;
    }, {}),
    separationMean: completed.reduce((sum, r) => sum + r.separationDegrees, 0)
      / Math.max(1, completed.length),
  };
  const share = (value: number): number => value / Math.max(1, completed.length);
  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    gazeInvalid: audit.gazeInvalid === 0,
    nonNormalisedGaze: audit.nonNormalised === 0,
    perceptionRng: perceptionRngChanges === 0,
    truthImmutable: truthMutations === 0,
    policyRecompute: audit.recomputeMismatches === 0,
    finiteObservations: audit.nonFinite === 0,
    beliefSchema: audit.beliefSchemaFailures === 0,
  };
  const completion = { completedWindows: completed.length >= 72 };
  const channel = { truthCeilingDualFresh: completed.length > 0 && share(counts.bothFresh.T) >= 0.95 };
  const mechanism = {
    g1InterleavedDualFresh: share(counts.bothFresh.I) >= 0.80,
    g2InterleavedDualSupport: share(counts.bothSupported.I) >= 0.60,
    g3SingleTargetStarves: share(counts.sStarvesA2) <= 0.50,
    g4InterleavedGeSingleOnA2: share(counts.iGeSOnA2) >= 0.95,
    g5InterleavedGtSingleOnA2: share(counts.iGtSOnA2) >= 0.50,
    g6SplittingCostsAttendedTarget: share(counts.iLtSOnA1) >= 0.50,
  };
  const exactPass = Object.values(exact).every(Boolean) && completion.completedWindows;
  const verdict = !exactPass
    ? 'FAIL'
    : !channel.truthCeilingDualFresh
      ? 'CHANNEL-INVALID'
      : Object.values(mechanism).every(Boolean) ? 'PASS' : 'FAIL';
  return {
    experiment: 'S3-G2',
    authority: 'DUAL-TARGET-ATTENTION-SCHEDULE',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
      windowTicks: WINDOW_TICKS,
      scanIntervalTicks: SCAN_INTERVAL_TICKS,
      freshMin: FRESH_MIN,
      speedBand: [SPEED_MIN, SPEED_MAX],
      distanceBand: [DIST_MIN, DIST_MAX],
      separationMinDegrees: 130,
      bodyFieldMaxCos: BODY_FIELD_MAX_COS,
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
      beliefSchemaFailures: audit.beliefSchemaFailures,
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
  `S3-G2 ${output.verdict} · accepted ${output.census.acceptedStates}/${REQUIRED_STATES}`
  + ` · completed ${output.counts.completed}`
  + ` · dualFresh I ${output.counts.bothFresh.I} T ${output.counts.bothFresh.T}`
  + ` S ${output.counts.bothFresh.S} B ${output.counts.bothFresh.B}`
  + ` · dualSupport I ${output.counts.bothSupported.I}`
  + ` · SHA ${sha256}`,
);
